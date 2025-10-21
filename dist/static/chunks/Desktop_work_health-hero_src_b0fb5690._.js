(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://uasphzqbluxctnukoazy.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc3BoenFibHV4Y3RudWtvYXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTk0MzEsImV4cCI6MjA3NjM5NTQzMX0.-j7mVMSL-ExdbkaHW_E2PkCrtJBk8hC-u4XeoAqjuSE");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/work/health-hero/src/store/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-client] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
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
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (session === null || session === void 0 ? void 0 : session.user) {
                    // 사용자 프로필 가져오기
                    const { data: profile, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('id', session.user.id).single();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/work/health-hero/src/store/gameStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGameStore",
    ()=>useGameStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-client] (ecmascript)");
;
;
;
const useGameStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('level, total_score, current_exp, current_phase, current_stage').eq('id', userId).single(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_hearts').select('*').eq('user_id', userId).single()
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
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('refill_heart', {
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
        consumeHeart: async function() {
            let amount = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
            const hearts = get().hearts;
            if (!hearts) return false;
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('consume_heart', {
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
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('add_heart_by_ad', {
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
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('buy_heart_with_points', {
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
            return "".concat(minutes, "분").concat(seconds.toString().padStart(2, '0'), "초");
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/work/health-hero/src/app/game/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GamePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/gameStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function GamePage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, isAuthenticated, initialize } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { level, totalScore, currentPhase, hearts, heartTimer, isLoading, error, loadUserData, updateHearts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])();
    // 화면 높이 감지
    const [isSmallScreen, setIsSmallScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 화면 크기 감지
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            const checkScreenSize = {
                "GamePage.useEffect.checkScreenSize": ()=>{
                    setIsSmallScreen(window.innerHeight < 700); // 700px 미만을 작은 화면으로 판단
                }
            }["GamePage.useEffect.checkScreenSize"];
            checkScreenSize();
            window.addEventListener('resize', checkScreenSize);
            return ({
                "GamePage.useEffect": ()=>window.removeEventListener('resize', checkScreenSize)
            })["GamePage.useEffect"];
        }
    }["GamePage.useEffect"], []);
    // 컴포넌트 마운트 시 인증 상태 초기화 및 데이터 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            const initData = {
                "GamePage.useEffect.initData": async ()=>{
                    await initialize();
                }
            }["GamePage.useEffect.initData"];
            initData();
        }
    }["GamePage.useEffect"], [
        initialize
    ]);
    // 사용자 데이터 로드
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            if (isAuthenticated && (user === null || user === void 0 ? void 0 : user.id)) {
                loadUserData(user.id);
            }
        }
    }["GamePage.useEffect"], [
        isAuthenticated,
        user === null || user === void 0 ? void 0 : user.id,
        loadUserData
    ]);
    // 하트 타이머 업데이트 (30초마다)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            if (!isAuthenticated || !(user === null || user === void 0 ? void 0 : user.id) || !hearts) return;
            const interval = setInterval({
                "GamePage.useEffect.interval": ()=>{
                    // 하트가 5개 미만일 때만 서버 업데이트 호출
                    if (hearts.current_hearts < 5) {
                        updateHearts();
                    }
                }
            }["GamePage.useEffect.interval"], 30000); // 30초마다 (하트 충전 주기 고려)
            return ({
                "GamePage.useEffect": ()=>clearInterval(interval)
            })["GamePage.useEffect"];
        }
    }["GamePage.useEffect"], [
        isAuthenticated,
        user === null || user === void 0 ? void 0 : user.id,
        hearts,
        updateHearts
    ]);
    // 스크롤을 하단에 고정하는 useEffect
    // 스크롤 위치 조정 (작은 화면에서만)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            if (!isSmallScreen) return; // 작은 화면이 아니면 스크롤 로직 실행하지 않음
            const scrollToBottom = {
                "GamePage.useEffect.scrollToBottom": ()=>{
                    const scrollContainer = document.querySelector('.overflow-y-auto');
                    if (scrollContainer) {
                        // 스크롤을 맨 아래로 이동 (페이즈 1이 보이도록)
                        scrollContainer.scrollTop = scrollContainer.scrollHeight;
                    }
                }
            }["GamePage.useEffect.scrollToBottom"];
            // 즉시 실행
            scrollToBottom();
            // 이미지 로딩 완료 후에도 실행 (여러 번 시도)
            const timeoutIds = [
                setTimeout(scrollToBottom, 100),
                setTimeout(scrollToBottom, 500),
                setTimeout(scrollToBottom, 1000)
            ];
            // 윈도우 리사이즈 시에도 실행
            window.addEventListener('resize', scrollToBottom);
            // 페이지 로드 완료 후에도 실행
            window.addEventListener('load', scrollToBottom);
            return ({
                "GamePage.useEffect": ()=>{
                    timeoutIds.forEach({
                        "GamePage.useEffect": (id)=>clearTimeout(id)
                    }["GamePage.useEffect"]);
                    window.removeEventListener('resize', scrollToBottom);
                    window.removeEventListener('load', scrollToBottom);
                }
            })["GamePage.useEffect"];
        }
    }["GamePage.useEffect"], [
        isLoading,
        isSmallScreen
    ]); // isSmallScreen 의존성 추가
    // 레벨에 따른 캐릭터 이미지 경로 반환
    const getCharacterImage = (level)=>{
        if (level >= 20) return '/images/characters/level-20.png';
        if (level >= 15) return '/images/characters/level-15.png';
        if (level >= 10) return '/images/characters/level-10.png';
        if (level >= 5) return '/images/characters/level-5.png';
        return '/images/characters/level-1.png';
    };
    // 페이즈 상태에 따른 이미지 경로 반환
    const getPhaseImage = (phaseNumber)=>{
        // 페이즈 1은 항상 활성화
        if (phaseNumber === 1) {
            return '/images/items/icon-phase1.png';
        }
        // 사용자의 현재 페이즈를 기반으로 활성화 상태 결정
        // 현재 페이즈보다 낮은 페이즈는 모두 클리어된 것으로 간주
        if (phaseNumber <= currentPhase) {
            return "/images/items/icon-phase".concat(phaseNumber, ".png");
        }
        // 현재 페이즈보다 높은 페이즈는 잠금 상태
        return '/images/items/icon-locked-phase.png';
    };
    // 페이즈 클릭 핸들러
    const handlePhaseClick = (phaseNumber)=>{
        // 현재 페이즈보다 높은 페이즈는 클릭 불가
        if (phaseNumber > currentPhase) {
            return;
        }
        // 스테이지 맵 페이지로 이동
        router.push("/game/phase".concat(phaseNumber));
    };
    // 로딩 중이거나 에러가 있으면 표시
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/backgrounds/background-main.png",
                        alt: "헬스 히어로 메인 배경",
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 flex items-center justify-center min-h-screen",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-xl font-medium",
                        children: "로딩 중..."
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
            lineNumber: 145,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 z-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/backgrounds/background-main.png",
                        alt: "헬스 히어로 메인 배경",
                        fill: true,
                        className: "object-cover",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-10 flex items-center justify-center min-h-screen",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-500 text-xl font-medium",
                        children: [
                            "에러: ",
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 180,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
            lineNumber: 167,
            columnNumber: 7
        }, this);
    }
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative min-h-screen overflow-hidden flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-xl mb-4",
                        children: "로그인이 필요합니다"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg",
                            children: "홈으로 돌아가기"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 193,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: "/images/backgrounds/background-main.png",
                    alt: "헬스 히어로 메인 배경",
                    fill: true,
                    className: "object-cover",
                    priority: true
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-6 left-0 right-0 z-30 bg-transparent",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-3 h-[60px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/ui/block02.png",
                                        alt: "캐릭터 배경",
                                        width: 40,
                                        height: 40,
                                        className: "relative z-10"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: getCharacterImage(level),
                                        alt: "캐릭터",
                                        width: 30,
                                        height: 30,
                                        className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/ui/block01.png",
                                        alt: "레벨 배경",
                                        width: 70,
                                        height: 24,
                                        className: "absolute top-1/2 left-6 transform -translate-y-1/2 z-0",
                                        style: {
                                            width: '70px',
                                            height: '24px',
                                            minWidth: '70px',
                                            minHeight: '24px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 237,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1",
                                        children: [
                                            "Lv.",
                                            level
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 218,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/items/icon-heart.png",
                                        alt: "하트",
                                        width: 44,
                                        height: 44,
                                        className: "relative z-10"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-base font-normal",
                                        children: (hearts === null || hearts === void 0 ? void 0 : hearts.current_hearts) || 5
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/items/button-ad.png",
                                        alt: "광고 버튼",
                                        width: 16,
                                        height: 16,
                                        className: "absolute bottom-0 right-0 z-20"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/ui/block01.png",
                                        alt: "타이머 배경",
                                        width: 70,
                                        height: 24,
                                        className: "absolute top-1/2 left-6 transform -translate-y-1/2 z-0",
                                        style: {
                                            width: '70px',
                                            height: '24px',
                                            minWidth: '70px',
                                            minHeight: '24px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1",
                                        children: heartTimer
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 253,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/items/Icon-star.png",
                                        alt: "별",
                                        width: 40,
                                        height: 40,
                                        className: "relative z-10"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/images/ui/block01.png",
                                        alt: "점수 배경",
                                        width: 70,
                                        height: 24,
                                        className: "absolute top-1/2 left-6 transform -translate-y-1/2 z-0",
                                        style: {
                                            width: '70px',
                                            height: '24px',
                                            minWidth: '70px',
                                            minHeight: '24px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute top-1/2 left-6 transform -translate-y-1/2 z-10 text-[10px] font-bold text-[#8B4513] whitespace-nowrap flex items-center justify-center w-[70px] ml-1",
                                        children: totalScore.toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/items/button-setting.png",
                                alt: "설정",
                                width: 24,
                                height: 24,
                                className: "cursor-pointer hover:opacity-80 transition-opacity"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 319,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 w-full h-screen pt-[60px] pb-4 ".concat(isSmallScreen ? 'overflow-y-auto' : 'overflow-hidden'),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full",
                    style: {
                        height: isSmallScreen ? 'calc(100vh + 40px)' : '90vh'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[20px] right-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 cursor-pointer hover:opacity-80 transition-opacity",
                            onClick: ()=>handlePhaseClick(1),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full flex flex-col items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: getPhaseImage(1),
                                    alt: "페이즈 1",
                                    width: 120,
                                    height: 120,
                                    className: "mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                    lineNumber: 350,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 349,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 345,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[180px] left-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ".concat(currentPhase >= 2 ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-not-allowed'),
                            onClick: ()=>handlePhaseClick(2),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full flex flex-col items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: getPhaseImage(2),
                                    alt: "페이즈 2",
                                    width: 120,
                                    height: 120,
                                    className: "mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                    lineNumber: 368,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[340px] right-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ".concat(currentPhase >= 3 ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-not-allowed'),
                            onClick: ()=>handlePhaseClick(3),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full flex flex-col items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: getPhaseImage(3),
                                    alt: "페이즈 3",
                                    width: 120,
                                    height: 120,
                                    className: "mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                    lineNumber: 386,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 379,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[500px] left-[24px] w-[150px] h-[160px] rounded-[20px] bg-white/50 backdrop-blur-[10px] shadow-[0_2px_2px_0_rgba(0,0,0,0.4)] z-10 ".concat(currentPhase >= 4 ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-not-allowed'),
                            onClick: ()=>handlePhaseClick(4),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full flex flex-col items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: getPhaseImage(4),
                                    alt: "페이즈 4",
                                    width: 120,
                                    height: 120,
                                    className: "mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                    lineNumber: 404,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 403,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 397,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[120px] left-1/2 transform -translate-x-1/2 z-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/ui/vector1.png",
                                alt: "페이즈 연결선",
                                width: 170,
                                height: 60,
                                className: "opacity-80"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 417,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 416,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[280px] left-1/2 transform -translate-x-1/2 z-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/ui/vector2.png",
                                alt: "페이즈 연결선",
                                width: 170,
                                height: 60,
                                className: "opacity-80"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 428,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-[440px] left-1/2 transform -translate-x-1/2 z-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/images/ui/vector1.png",
                                alt: "페이즈 연결선",
                                width: 170,
                                height: 60,
                                className: "opacity-80"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                                lineNumber: 439,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                    lineNumber: 337,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/work/health-hero/src/app/game/page.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_s(GamePage, "r335sd/mwCy7Bf3DjLYAxP9r3Tk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$gameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = GamePage;
var _c;
__turbopack_context__.k.register(_c, "GamePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_work_health-hero_src_b0fb5690._.js.map