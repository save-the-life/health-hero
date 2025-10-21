module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/@supabase/supabase-js/dist/module/index.js [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://uasphzqbluxctnukoazy.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc3BoenFibHV4Y3RudWtvYXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTk0MzEsImV4cCI6MjA3NjM5NTQzMX0.-j7mVMSL-ExdbkaHW_E2PkCrtJBk8hC-u4XeoAqjuSE");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});
}),
"[project]/Desktop/work/health-hero/src/store/authStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        setUser: (user)=>set({
                user,
                isAuthenticated: !!user,
                error: null
            }),
        setLoading: (isLoading)=>set({
                isLoading
            }),
        setError: (error)=>set({
                error
            }),
        logout: async ()=>{
            try {
                // Supabase 로그아웃
                await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
                // 상태 초기화
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null
                });
            } catch (error) {
                console.error('로그아웃 실패:', error);
                set({
                    error: '로그아웃에 실패했습니다.'
                });
            }
        },
        initialize: async ()=>{
            set({
                isLoading: true
            });
            try {
                // Supabase 세션 확인
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (session?.user) {
                    // 사용자 프로필 가져오기
                    const { data: profile, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('id', session.user.id).single();
                    if (error) {
                        console.error('프로필 로드 실패:', error);
                        set({
                            isAuthenticated: false,
                            user: null
                        });
                    } else {
                        set({
                            user: profile,
                            isAuthenticated: true
                        });
                    }
                } else {
                    set({
                        isAuthenticated: false,
                        user: null
                    });
                }
            } catch (error) {
                console.error('인증 상태 초기화 실패:', error);
                set({
                    isAuthenticated: false,
                    user: null
                });
            } finally{
                set({
                    isLoading: false
                });
            }
        },
        updateProfile: (updates)=>{
            const currentUser = get().user;
            if (currentUser) {
                set({
                    user: {
                        ...currentUser,
                        ...updates
                    }
                });
            }
        }
    }), {
    name: 'auth-storage',
    partialize: (state)=>({
            user: state.user,
            isAuthenticated: state.isAuthenticated
        })
}));
}),
"[project]/Desktop/work/health-hero/src/store/gameStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGameStore",
    ()=>useGameStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
;
;
const useGameStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // 초기 상태
        level: 1,
        totalScore: 0,
        currentExp: 0,
        currentPhase: 1,
        currentStage: 1,
        hearts: null,
        heartTimer: '5분00초',
        isLoading: false,
        error: null,
        // 사용자 데이터 로드
        loadUserData: async (userId)=>{
            set({
                isLoading: true,
                error: null
            });
            try {
                // 사용자 프로필과 하트 데이터를 함께 조회
                const [profileResult, heartsResult] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('level, total_score, current_exp, current_phase, current_stage').eq('id', userId).single(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_hearts').select('*').eq('user_id', userId).single()
                ]);
                if (profileResult.error) {
                    console.warn('프로필 로드 실패, 기본값 사용:', profileResult.error.message);
                    // 프로필이 없으면 기본값 사용 (최초 회원가입 시 500포인트 지급)
                    const defaultProfile = {
                        level: 1,
                        total_score: 500,
                        current_exp: 0,
                        current_phase: 1,
                        current_stage: 1
                    };
                    set({
                        level: defaultProfile.level,
                        totalScore: defaultProfile.total_score,
                        currentExp: defaultProfile.current_exp,
                        currentPhase: defaultProfile.current_phase,
                        currentStage: defaultProfile.current_stage,
                        isLoading: false
                    });
                    return;
                }
                if (heartsResult.error) {
                    console.warn('하트 데이터 로드 실패, 기본값 사용:', heartsResult.error.message);
                    // 하트 데이터가 없으면 기본값 사용
                    const defaultHearts = {
                        current_hearts: 5,
                        last_refill_at: new Date().toISOString(),
                        ad_views_today: 0,
                        ad_reset_at: new Date().toISOString()
                    };
                    const heartTimer = get().calculateHeartTimer(defaultHearts.last_refill_at, defaultHearts.current_hearts);
                    set({
                        hearts: defaultHearts,
                        heartTimer,
                        isLoading: false
                    });
                    return;
                }
                const profile = profileResult.data;
                const hearts = heartsResult.data;
                // 하트 타이머 계산
                const heartTimer = get().calculateHeartTimer(hearts.last_refill_at, hearts.current_hearts);
                set({
                    level: profile.level || 1,
                    totalScore: profile.total_score || 0,
                    currentExp: profile.current_exp || 0,
                    currentPhase: profile.current_phase || 1,
                    currentStage: profile.current_stage || 1,
                    hearts: hearts,
                    heartTimer,
                    isLoading: false
                });
            } catch (error) {
                console.error('사용자 데이터 로드 실패:', error);
                set({
                    error: error instanceof Error ? error.message : '데이터 로드 실패',
                    isLoading: false
                });
            }
        },
        // 하트 업데이트
        updateHearts: async ()=>{
            const hearts = get().hearts;
            if (!hearts) return;
            // 하트가 이미 5개면 충전할 필요 없음
            if (hearts.current_hearts >= 5) {
                const heartTimer = get().calculateHeartTimer(hearts.last_refill_at, hearts.current_hearts);
                set({
                    heartTimer
                });
                return;
            }
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('refill_heart', {
                    p_user_id: hearts.user_id
                });
                if (error) {
                    console.error('하트 업데이트 실패:', error);
                    return;
                }
                if (data && data.length > 0) {
                    const result = data[0];
                    const heartTimer = get().calculateHeartTimer(result.last_refill_at, result.current_hearts);
                    set({
                        hearts: {
                            ...hearts,
                            current_hearts: result.current_hearts,
                            last_refill_at: result.last_refill_at
                        },
                        heartTimer
                    });
                }
            } catch (error) {
                console.error('하트 업데이트 실패:', error);
            }
        },
        // 하트 소모
        consumeHeart: async (amount = 1)=>{
            const hearts = get().hearts;
            if (!hearts) return false;
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('consume_heart', {
                    p_user_id: hearts.user_id,
                    p_amount: amount
                });
                if (error) {
                    console.error('하트 소모 실패:', error);
                    return false;
                }
                if (data && data.length > 0) {
                    const result = data[0];
                    if (result.success) {
                        set({
                            hearts: {
                                ...hearts,
                                current_hearts: result.current_hearts
                            }
                        });
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('하트 소모 실패:', error);
                return false;
            }
        },
        // 광고로 하트 획득
        addHeartByAd: async ()=>{
            const hearts = get().hearts;
            if (!hearts) return false;
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('add_heart_by_ad', {
                    p_user_id: hearts.user_id
                });
                if (error) {
                    console.error('광고 하트 획득 실패:', error);
                    return false;
                }
                if (data && data.length > 0) {
                    const result = data[0];
                    if (result.success) {
                        set({
                            hearts: {
                                ...hearts,
                                current_hearts: result.current_hearts,
                                ad_views_today: result.ad_views_today
                            }
                        });
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('광고 하트 획득 실패:', error);
                return false;
            }
        },
        // 포인트로 하트 구매
        buyHeartWithPoints: async ()=>{
            const hearts = get().hearts;
            if (!hearts) return false;
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('buy_heart_with_points', {
                    p_user_id: hearts.user_id,
                    p_cost: 500
                });
                if (error) {
                    console.error('포인트 하트 구매 실패:', error);
                    return false;
                }
                if (data && data.length > 0) {
                    const result = data[0];
                    if (result.success) {
                        set({
                            hearts: {
                                ...hearts,
                                current_hearts: result.current_hearts
                            },
                            totalScore: result.current_points
                        });
                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('포인트 하트 구매 실패:', error);
                return false;
            }
        },
        // 점수 업데이트
        updateScore: (score)=>{
            set({
                totalScore: score
            });
        },
        // 경험치 업데이트
        updateExp: (exp)=>{
            set({
                currentExp: exp
            });
        },
        // 레벨 업데이트
        updateLevel: (level)=>{
            set({
                level
            });
        },
        // 에러 설정
        setError: (error)=>{
            set({
                error
            });
        },
        // 하트 타이머 계산 헬퍼 함수
        calculateHeartTimer: (lastRefillAt, currentHearts)=>{
            // 하트가 5개면 충전 완료
            if (currentHearts >= 5) {
                return '충전 완료';
            }
            const now = new Date();
            const lastRefill = new Date(lastRefillAt);
            const diffMs = now.getTime() - lastRefill.getTime();
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            // 5분마다 하트 충전
            const nextRefillInMinutes = 5 - diffMinutes % 5;
            // 다음 충전까지 남은 시간을 분:초 형식으로 표시
            const minutes = Math.floor(nextRefillInMinutes);
            const seconds = 60 - Math.floor(diffMs / 1000) % 60;
            return `${minutes}분${seconds.toString().padStart(2, '0')}초`;
        }
    }), {
    name: 'game-storage',
    partialize: (state)=>({
            level: state.level,
            totalScore: state.totalScore,
            currentExp: state.currentExp,
            currentPhase: state.currentPhase,
            currentStage: state.currentStage,
            hearts: state.hearts
        })
}));
}),
"[project]/Desktop/work/health-hero/src/components/StageButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StageButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/image.js [app-ssr] (ecmascript)");
'use client';
;
;
function StageButton({ stageNumber, isLocked, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `font-medium h-[64px] w-[64px] rounded-[10px] relative ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80 transition-opacity'}`,
        style: {
            background: "linear-gradient(180deg, #50B0FF 0%, #50B0FF 50%, #008DFF 50%, #008DFF 100%)",
            border: "2px solid #76C1FF",
            outline: "2px solid #000000",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), inset 0px 3px 0px 0px rgba(0, 0, 0, 0.1)",
            color: "#FFFFFF",
            fontSize: "18px",
            fontWeight: "400",
            WebkitTextStroke: "1px #000000"
        },
        onClick: isLocked ? undefined : onClick,
        disabled: isLocked,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: "/images/items/button-point-blue.png",
                alt: "button-point-blue",
                style: {
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    width: "8.47px",
                    height: "6.3px",
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/components/StageButton.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this),
            isLocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                src: "/images/items/icon-lock.png",
                alt: "잠금",
                width: 24,
                height: 24,
                style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none"
                }
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/components/StageButton.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none"
                },
                children: stageNumber
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/components/StageButton.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/work/health-hero/src/components/StageButton.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Phase1Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/authStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/gameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/components/StageButton.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Phase1Page() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, isAuthenticated, initialize } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { hearts, isLoading, error, currentStage, loadUserData, updateHearts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])();
    // 화면 높이 감지
    const [isSmallScreen, setIsSmallScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 화면 크기 감지
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkScreenSize = ()=>{
            setIsSmallScreen(window.innerHeight < 700); // 700px 미만을 작은 화면으로 판단
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return ()=>window.removeEventListener('resize', checkScreenSize);
    }, []);
    // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initData = async ()=>{
            await initialize();
        };
        initData();
    }, [
        initialize
    ]);
    // 사용자 데이터 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isAuthenticated && user?.id) {
            loadUserData(user.id);
        }
    }, [
        isAuthenticated,
        user?.id,
        loadUserData
    ]);
    // 하트 타이머 업데이트 (30초마다)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated || !user?.id || !hearts) return;
        const interval = setInterval(()=>{
            // 하트가 5개 미만일 때만 서버 업데이트 호출
            if (hearts.current_hearts < 5) {
                updateHearts();
            }
        }, 30000); // 30초마다 (하트 충전 주기 고려)
        return ()=>clearInterval(interval);
    }, [
        isAuthenticated,
        user?.id,
        hearts,
        updateHearts
    ]);
    // 스테이지 잠금 상태 확인
    const isStageLocked = (stageNumber)=>{
        // 현재 스테이지보다 높은 스테이지는 잠금
        return stageNumber > currentStage;
    };
    // 스테이지 클릭 핸들러
    const handleStageClick = (stageNumber)=>{
        // 잠금된 스테이지는 클릭 불가
        if (isStageLocked(stageNumber)) {
            return;
        }
        // TODO: 퀴즈 페이지로 이동
        console.log(`페이즈 1 스테이지 ${stageNumber} 클릭`);
    };
    // 로딩 중이거나 에러가 있으면 표시
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/backgrounds/background-phase1.png",
                        alt: "페이즈 1 배경",
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 flex items-center justify-center min-h-screen",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-xl font-medium",
                        children: "로딩 중..."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/backgrounds/background-phase1.png",
                        alt: "페이즈 1 배경",
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 flex items-center justify-center min-h-screen",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-500 text-xl font-medium",
                        children: [
                            "에러: ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-xl",
                children: "로그인이 필요합니다."
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: "/images/backgrounds/background-phase1.png",
                    alt: "페이즈 1 배경",
                    fill: true,
                    className: "object-cover",
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 w-full h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-4 left-4 z-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.back(),
                            className: "flex items-center gap-2 text-white hover:opacity-80 transition-opacity  px-3 py-2 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/items/icon-backspace.png",
                                alt: "뒤로가기",
                                width: 24,
                                height: 24
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex flex-col justify-center items-center mb-5",
                        children: isSmallScreen ? // 작은 화면용 배치
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[24px] left-1/2 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 1,
                                        isLocked: isStageLocked(1),
                                        onClick: ()=>handleStageClick(1)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 174,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[180px] left-5/9 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 2,
                                        isLocked: isStageLocked(2),
                                        onClick: ()=>handleStageClick(2)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[300px] left-4/10 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 3,
                                        isLocked: isStageLocked(3),
                                        onClick: ()=>handleStageClick(3)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 193,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 192,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[400px] left-5/9 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 4,
                                        isLocked: isStageLocked(4),
                                        onClick: ()=>handleStageClick(4)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 202,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[520px] left-1/2 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 5,
                                        isLocked: isStageLocked(5),
                                        onClick: ()=>handleStageClick(5)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 211,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : // 일반 화면용 배치
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[24px] left-1/2 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 1,
                                        isLocked: isStageLocked(1),
                                        onClick: ()=>handleStageClick(1)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 223,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 222,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[200px] left-5/9 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 2,
                                        isLocked: isStageLocked(2),
                                        onClick: ()=>handleStageClick(2)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 232,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 231,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[340px] left-4/10 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 3,
                                        isLocked: isStageLocked(3),
                                        onClick: ()=>handleStageClick(3)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 240,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[440px] left-6/9 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 4,
                                        isLocked: isStageLocked(4),
                                        onClick: ()=>handleStageClick(4)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-[580px] left-1/2 transform -translate-x-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$components$2f$StageButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        stageNumber: 5,
                                        isLocked: isStageLocked(5),
                                        onClick: ()=>handleStageClick(5)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                                    lineNumber: 258,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/work/health-hero/src/app/game/phase1/page.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f51a0c1f._.js.map