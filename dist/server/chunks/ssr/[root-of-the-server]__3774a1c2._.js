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
"[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuizPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/authStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/gameStore.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function QuizPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { user, isAuthenticated, initialize } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { level, totalScore, currentPhase, currentStage, hearts, heartTimer, isLoading, error, loadUserData, updateHearts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])();
    // URL 파라미터에서 현재 퀴즈 정보 가져오기
    const quizPhase = parseInt(searchParams.get('phase') || '1');
    const quizStage = parseInt(searchParams.get('stage') || '1');
    // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const initData = async ()=>{
            await initialize();
            if (user?.id) {
                await loadUserData(user.id);
            }
        };
        initData();
    }, [
        initialize,
        user?.id,
        loadUserData
    ]);
    // 하트 타이머 업데이트 (30초마다)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isAuthenticated || !user?.id) return;
        const interval = setInterval(()=>{
            if (hearts && hearts.current_hearts < 5) {
                updateHearts(user.id);
            }
        }, 30000); // 30초마다 실행
        return ()=>clearInterval(interval);
    }, [
        isAuthenticated,
        user?.id,
        hearts,
        updateHearts
    ]);
    // 레벨에 따른 캐릭터 이미지 경로 반환
    const getCharacterImage = (level)=>{
        if (level >= 20) return '/images/characters/level-20.png';
        if (level >= 15) return '/images/characters/level-15.png';
        if (level >= 10) return '/images/characters/level-10.png';
        if (level >= 5) return '/images/characters/level-5.png';
        return '/images/characters/level-1.png';
    };
    // 하트 타이머 텍스트 반환
    const getHeartTimerText = ()=>{
        if (!hearts) return "로딩 중...";
        if (hearts.current_hearts >= 5) return "충전 완료";
        if (heartTimer) {
            const minutes = Math.floor(heartTimer / 60);
            const seconds = heartTimer % 60;
            return `${minutes}분${seconds}초`;
        }
        return "충전 중...";
    };
    // 로딩 중
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/backgrounds/background-quiz.png",
                        alt: "퀴즈 배경",
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                        lineNumber: 84,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 flex items-center justify-center min-h-screen",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-xl font-medium",
                        children: "로딩 중..."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this);
    }
    // 에러 상태
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/backgrounds/background-quiz.png",
                        alt: "퀴즈 배경",
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 106,
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
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this);
    }
    // 인증되지 않은 경우
    if (!isAuthenticated) {
        router.push('/');
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: "/images/backgrounds/background-quiz.png",
                    alt: "퀴즈 배경",
                    fill: true,
                    className: "object-cover",
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 left-0 right-0 z-10 bg-transparent",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[60px] px-6 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/ui/block02.png",
                                                alt: "캐릭터 배경",
                                                width: 40,
                                                height: 40,
                                                className: "object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 155,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: getCharacterImage(level),
                                                alt: "캐릭터",
                                                width: 30,
                                                height: 30,
                                                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/ui/block01.png",
                                                alt: "레벨 배경",
                                                width: 70,
                                                height: 24,
                                                className: "object-cover",
                                                style: {
                                                    width: '70px',
                                                    height: '24px',
                                                    minWidth: '70px',
                                                    minHeight: '24px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 174,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-sm font-medium whitespace-nowrap",
                                                children: [
                                                    "Lv.",
                                                    level
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/items/icon-heart.png",
                                                alt: "하트",
                                                width: 44,
                                                height: 44,
                                                className: "object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-base font-normal",
                                                children: hearts?.current_hearts || 0
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/items/button-ad.png",
                                                alt: "광고",
                                                width: 16,
                                                height: 16,
                                                className: "absolute bottom-0 right-0 object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/ui/block01.png",
                                                alt: "타이머 배경",
                                                width: 70,
                                                height: 24,
                                                className: "object-cover",
                                                style: {
                                                    width: '70px',
                                                    height: '24px',
                                                    minWidth: '70px',
                                                    minHeight: '24px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-sm font-medium whitespace-nowrap",
                                                children: getHeartTimerText()
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/images/items/Icon-star.png",
                                            alt: "별",
                                            width: 40,
                                            height: 40,
                                            className: "object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                            lineNumber: 231,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/images/ui/block01.png",
                                                alt: "점수 배경",
                                                width: 70,
                                                height: 24,
                                                className: "object-cover",
                                                style: {
                                                    width: '70px',
                                                    height: '24px',
                                                    minWidth: '70px',
                                                    minHeight: '24px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-sm font-medium whitespace-nowrap",
                                                children: totalScore.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/images/items/button-setting.png",
                                    alt: "설정",
                                    width: 24,
                                    height: 24,
                                    className: "object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-[84px] left-0 right-0 z-10 flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: "/images/ui/progressbar01.png",
                            alt: "프로그래스바 테두리",
                            width: 310,
                            height: 24,
                            className: "object-cover"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                            lineNumber: 273,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-1 left-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/images/ui/progressbar02.png",
                                    alt: "프로그래스바 내부",
                                    width: 300,
                                    height: 16,
                                    className: "object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white font-bold text-sm",
                                        children: [
                                            "STAGE ",
                                            quizPhase,
                                            "-",
                                            quizStage
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 271,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 pt-[120px] px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold mb-4",
                            children: "퀴즈 풀이 페이지"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg",
                            children: [
                                "현재 스테이지: ",
                                quizPhase,
                                "-",
                                quizStage
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                    lineNumber: 304,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/work/health-hero/src/app/game/quiz/page.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3774a1c2._.js.map