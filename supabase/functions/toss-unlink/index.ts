import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS 헤더
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * 토스 연결 끊기 콜백 Edge Function
 *
 * 토스 앱에서 사용자가 연결을 끊을 때 호출됩니다.
 * - referrer: UNLINK (직접 연결 끊기), WITHDRAWAL_TERMS (약관 철회), WITHDRAWAL_TOSS (토스 탈퇴)
 *
 * 요청 형식:
 * POST { userKey: number, referrer: string }
 * Authorization: Basic <base64_encoded_secret>
 */
serve(async (req) => {
  // CORS preflight 처리
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Method 검증
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders
    });
  }

  // Basic Auth 헤더 검증
  const authHeader = req.headers.get("Authorization");
  const TOSS_SECRET = Deno.env.get("TOSS_CALLBACK_SECRET");

  if (TOSS_SECRET) {
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      console.error("[toss-unlink] Missing or invalid Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      // Basic Auth에서 credentials 추출 및 base64 디코딩
      const base64Credentials = authHeader.slice(6); // "Basic " 제거
      const decodedCredentials = atob(base64Credentials);

      // 디코딩된 값이 TOSS_CALLBACK_SECRET과 일치하는지 확인
      // 형식: username:password 또는 단순 secret
      if (decodedCredentials !== TOSS_SECRET && !decodedCredentials.includes(TOSS_SECRET)) {
        console.error("[toss-unlink] Invalid credentials");
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.error("[toss-unlink] Failed to decode Authorization header:", e);
      return new Response(JSON.stringify({ error: "Invalid Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  try {
    // 요청 데이터 파싱
    const { userKey, referrer } = await req.json();
    console.log(`[toss-unlink] UserKey: ${userKey}, Referrer: ${referrer}`);

    if (!userKey) {
      // 토스 테스트 요청 (userKey 없음) - 성공 응답 반환
      return new Response(JSON.stringify({ result: "Test OK" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Supabase Admin 클라이언트 초기화 (RLS 우회)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 유저 검색 (toss_user_key 기준)
    const { data: user, error: findError } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email, name")
      .eq("toss_user_key", userKey)
      .single();

    if (findError || !user) {
      console.warn("[toss-unlink] User not found or already unlinked:", userKey);
      // 이미 처리되었거나 없는 유저여도 200 반환 (토스 재시도 방지)
      return new Response(
        JSON.stringify({ result: "User not found but handled" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(`[toss-unlink] Found user: ${user.id}, email: ${user.email}`);

    // 연결 끊기 처리 (DB 업데이트)
    const { error: updateError } = await supabaseAdmin
      .from("user_profiles")
      .update({
        toss_user_key: null,
        toss_access_token: null,
        toss_refresh_token: null,
        toss_token_expires_at: null,
        status: "unlinked",
        unlinked_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("[toss-unlink] Failed to update user:", updateError);
      throw updateError;
    }

    // 연결 끊기 로그 기록
    const { error: logError } = await supabaseAdmin
      .from("toss_login_logs")
      .insert({
        user_id: user.id,
        toss_user_key: userKey,
        referrer: referrer || "UNLINK_CALLBACK",
        user_agent: "Toss Unlink Callback"
      });

    if (logError) {
      console.warn("[toss-unlink] Failed to insert log:", logError);
      // 로그 실패는 치명적이지 않으므로 계속 진행
    }

    console.log(`[toss-unlink] User ${user.id} unlinked successfully`);

    // 성공 응답
    return new Response(JSON.stringify({ result: "Success" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[toss-unlink] Error processing unlink:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
