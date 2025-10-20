module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
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
"[project]/Desktop/work/health-hero/src/utils/tokenManager.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TokenManager",
    ()=>TokenManager
]);
class TokenManager {
    static ACCESS_TOKEN_KEY = 'toss_access_token';
    static REFRESH_TOKEN_KEY = 'toss_refresh_token';
    static EXPIRES_AT_KEY = 'toss_expires_at';
    static USER_KEY = 'toss_user_key';
    // 토큰 저장
    static saveTokens(accessToken, refreshToken, expiresIn, userKey) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const expiresAt = undefined;
    }
    // 토큰 조회
    static getAccessToken() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    static getRefreshToken() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    static getUserKey() {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
        const userKey = undefined;
    }
    // 토큰 만료 확인
    static isTokenExpired() {
        if ("TURBOPACK compile-time truthy", 1) return true;
        //TURBOPACK unreachable
        ;
        const expiresAt = undefined;
    }
    // 토큰 갱신
    static async refreshAccessToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('리프레시 토큰이 없습니다.');
        }
        try {
            const response = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken
                })
            });
            if (!response.ok) {
                throw new Error(`토큰 갱신 요청 실패: ${response.status}`);
            }
            const data = await response.json();
            if (data.resultType === 'FAILURE') {
                throw new Error(data.failure?.errorMessage || '토큰 갱신 실패');
            }
            if (data.success) {
                // 새 토큰 저장
                this.saveTokens(data.success.accessToken, data.success.refreshToken, data.success.expiresIn);
                return data.success.accessToken;
            }
            throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            // 토큰 갱신 실패 시 로그아웃 처리
            this.clearTokens();
            throw error;
        }
    }
    // 토큰 삭제
    static clearTokens() {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    // 유효한 액세스 토큰 가져오기 (필요시 자동 갱신)
    static async getValidAccessToken() {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
            return null;
        }
        // 토큰이 만료되었으면 갱신
        if (this.isTokenExpired()) {
            try {
                return await this.refreshAccessToken();
            } catch (error) {
                console.error('토큰 자동 갱신 실패:', error);
                return null;
            }
        }
        return accessToken;
    }
}
}),
"[project]/Desktop/work/health-hero/src/types/toss.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// 토스 인증 응답 (appLogin 결과)
__turbopack_context__.s([
    "TossErrorCode",
    ()=>TossErrorCode
]);
var TossErrorCode = /*#__PURE__*/ function(TossErrorCode) {
    // 인증 관련
    TossErrorCode["INVALID_AUTHORIZATION_CODE"] = "INVALID_AUTHORIZATION_CODE";
    TossErrorCode["EXPIRED_AUTHORIZATION_CODE"] = "EXPIRED_AUTHORIZATION_CODE";
    TossErrorCode["INVALID_ACCESS_TOKEN"] = "INVALID_ACCESS_TOKEN";
    TossErrorCode["EXPIRED_ACCESS_TOKEN"] = "EXPIRED_ACCESS_TOKEN";
    TossErrorCode["INVALID_REFRESH_TOKEN"] = "INVALID_REFRESH_TOKEN";
    TossErrorCode["EXPIRED_REFRESH_TOKEN"] = "EXPIRED_REFRESH_TOKEN";
    // 사용자 관련
    TossErrorCode["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    TossErrorCode["USER_ALREADY_EXISTS"] = "USER_ALREADY_EXISTS";
    TossErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    // 시스템 관련
    TossErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    TossErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    TossErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    return TossErrorCode;
}({});
}),
"[project]/Desktop/work/health-hero/src/utils/errorHandler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorHandler",
    ()=>ErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/types/toss.ts [app-ssr] (ecmascript)");
;
class ErrorHandler {
    static handleTossError(error) {
        // 토스 API 에러 처리
        if (error?.failure) {
            return {
                code: this.mapTossErrorCode(error.failure.errorCode),
                message: error.failure.errorMessage,
                details: error.failure
            };
        }
        // 네트워크 에러 처리
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return {
                code: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].NETWORK_ERROR,
                message: '네트워크 연결을 확인해주세요.',
                details: error
            };
        }
        // 알 수 없는 에러
        return {
            code: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].UNKNOWN_ERROR,
            message: error?.message || '알 수 없는 오류가 발생했습니다.',
            details: error
        };
    }
    static mapTossErrorCode(tossCode) {
        const errorMap = {
            'INVALID_AUTHORIZATION_CODE': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INVALID_AUTHORIZATION_CODE,
            'EXPIRED_AUTHORIZATION_CODE': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].EXPIRED_AUTHORIZATION_CODE,
            'INVALID_ACCESS_TOKEN': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INVALID_ACCESS_TOKEN,
            'EXPIRED_ACCESS_TOKEN': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].EXPIRED_ACCESS_TOKEN,
            'INVALID_REFRESH_TOKEN': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INVALID_REFRESH_TOKEN,
            'EXPIRED_REFRESH_TOKEN': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].EXPIRED_REFRESH_TOKEN,
            'USER_NOT_FOUND': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].USER_NOT_FOUND,
            'INTERNAL_SERVER_ERROR': __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INTERNAL_SERVER_ERROR
        };
        return errorMap[tossCode] || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].UNKNOWN_ERROR;
    }
    static getErrorMessage(error) {
        const errorMessages = {
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INVALID_AUTHORIZATION_CODE]: '유효하지 않은 인가 코드입니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].EXPIRED_AUTHORIZATION_CODE]: '인가 코드가 만료되었습니다. 다시 로그인해주세요.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INVALID_ACCESS_TOKEN]: '유효하지 않은 액세스 토큰입니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].EXPIRED_ACCESS_TOKEN]: '액세스 토큰이 만료되었습니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INVALID_REFRESH_TOKEN]: '유효하지 않은 리프레시 토큰입니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].EXPIRED_REFRESH_TOKEN]: '리프레시 토큰이 만료되었습니다. 다시 로그인해주세요.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].USER_ALREADY_EXISTS]: '이미 존재하는 사용자입니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INSUFFICIENT_PERMISSIONS]: '권한이 부족합니다.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].INTERNAL_SERVER_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
            [__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$types$2f$toss$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossErrorCode"].UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.'
        };
        return errorMessages[error.code] || error.message;
    }
}
}),
"[project]/Desktop/work/health-hero/src/hooks/useTossAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTossAuth",
    ()=>useTossAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$tokenManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/utils/tokenManager.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/utils/errorHandler.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const useTossAuth = ()=>{
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // 1. 토스 로그인 (인가 코드 받기)
    const tossLogin = async ()=>{
        try {
            if (typeof appLogin === 'undefined') {
                throw new Error('앱인토스 환경에서만 사용할 수 있습니다.');
            }
            const result = await appLogin();
            if (!result.authorizationCode) {
                throw new Error('인가 코드를 받을 수 없습니다.');
            }
            return result;
        } catch (error) {
            console.error('토스 로그인 실패:', error);
            throw error;
        }
    };
    // 2. 액세스 토큰 발급
    const getAccessToken = async (authorizationCode, referrer)=>{
        try {
            const response = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2/generate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    authorizationCode,
                    referrer
                })
            });
            if (!response.ok) {
                throw new Error(`토큰 요청 실패: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('액세스 토큰 발급 실패:', error);
            throw error;
        }
    };
    // 3. 사용자 정보 조회
    const getUserInfo = async (accessToken)=>{
        try {
            const response = await fetch('https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`사용자 정보 요청 실패: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('사용자 정보 조회 실패:', error);
            throw error;
        }
    };
    // 통합 로그인 함수
    const login = async ()=>{
        setIsLoading(true);
        setError(null);
        try {
            // 1. 토스 로그인 (인가 코드 받기)
            const authResult = await tossLogin();
            // 2. 액세스 토큰 발급
            const tokenResult = await getAccessToken(authResult.authorizationCode, authResult.referrer);
            if (tokenResult.resultType === 'FAILURE') {
                const tossError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorHandler"].handleTossError(tokenResult);
                throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorHandler"].getErrorMessage(tossError));
            }
            if (!tokenResult.success) {
                throw new Error('토큰 발급에 실패했습니다.');
            }
            // 3. 사용자 정보 조회
            const userResult = await getUserInfo(tokenResult.success.accessToken);
            if (userResult.resultType === 'FAILURE') {
                const tossError = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorHandler"].handleTossError(userResult);
                throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$errorHandler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorHandler"].getErrorMessage(tossError));
            }
            if (!userResult.success) {
                throw new Error('사용자 정보 조회에 실패했습니다.');
            }
            // 4. 토큰 저장
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$tokenManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenManager"].saveTokens(tokenResult.success.accessToken, tokenResult.success.refreshToken, tokenResult.success.expiresIn, userResult.success.userKey);
            return {
                auth: authResult,
                token: tokenResult.success,
                user: userResult.success
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
            setError(errorMessage);
            throw error;
        } finally{
            setIsLoading(false);
        }
    };
    // 로그아웃
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$utils$2f$tokenManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TokenManager"].clearTokens();
        setError(null);
    };
    return {
        login,
        logout,
        isLoading,
        error
    };
};
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
"[project]/Desktop/work/health-hero/src/services/tossAuthService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TossAuthService",
    ()=>TossAuthService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
class TossAuthService {
    // 토스 정보로 Supabase 사용자 생성/로그인
    static async createOrUpdateUser(tossData) {
        const { user, token, auth } = tossData;
        // 토스 userKey를 이메일로 변환 (고유 식별자)
        const email = `${user.userKey}@toss.health-hero.app`;
        const password = `toss_${user.userKey}_${Date.now()}`;
        try {
            // 1. 기존 사용자 확인
            const existingProfile = await this.findUserByTossKey(user.userKey);
            let userId;
            if (existingProfile) {
                // 기존 사용자 - 토스 정보로 Supabase 로그인
                const { data: signInData, error: signInError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                    email: existingProfile.email || email,
                    password: `toss_${user.userKey}_permanent`
                });
                if (signInError) {
                    // 비밀번호가 틀린 경우, 사용자를 찾아서 세션 생성
                    console.log('기존 사용자 재로그인 시도...');
                    throw signInError;
                }
                userId = signInData.user.id;
            } else {
                // 신규 사용자 - Supabase 계정 생성
                const { data: signUpData, error: signUpError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
                    email,
                    password: `toss_${user.userKey}_permanent`,
                    options: {
                        data: {
                            toss_user_key: user.userKey,
                            name: user.name
                        }
                    }
                });
                if (signUpError) {
                    throw signUpError;
                }
                if (!signUpData.user) {
                    throw new Error('사용자 생성에 실패했습니다.');
                }
                userId = signUpData.user.id;
            }
            // 2. 사용자 프로필 업데이트/생성
            const tokenExpiresAt = new Date(Date.now() + token.expiresIn * 1000).toISOString();
            const profileData = {
                id: userId,
                email,
                name: user.name,
                toss_user_key: user.userKey,
                toss_access_token: token.accessToken,
                toss_refresh_token: token.refreshToken,
                toss_token_expires_at: tokenExpiresAt,
                toss_referrer: auth.referrer,
                level: existingProfile?.level || 1,
                current_exp: existingProfile?.current_exp || 0,
                total_score: existingProfile?.total_score || 0,
                current_streak: existingProfile?.current_streak || 0,
                current_stage: existingProfile?.current_stage || 1,
                current_phase: existingProfile?.current_phase || 1
            };
            const { data: profile, error: profileError } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').upsert(profileData, {
                onConflict: 'id'
            }).select().single();
            if (profileError) {
                console.error('프로필 저장 실패:', profileError);
                throw profileError;
            }
            // 3. 로그인 기록 저장
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('toss_login_logs').insert({
                user_id: userId,
                toss_user_key: user.userKey,
                referrer: auth.referrer,
                user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
            });
            return {
                userId,
                profile
            };
        } catch (error) {
            console.error('Supabase 사용자 생성/업데이트 실패:', error);
            throw error;
        }
    }
    // 토스 userKey로 기존 사용자 찾기
    static async findUserByTossKey(tossUserKey) {
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('toss_user_key', tossUserKey).single();
            if (error) {
                if (error.code === 'PGRST116') {
                    // 사용자 없음
                    return null;
                }
                throw error;
            }
            return data;
        } catch (error) {
            console.error('사용자 조회 실패:', error);
            return null;
        }
    }
    // 현재 로그인된 사용자 프로필 가져오기
    static async getCurrentUserProfile() {
        try {
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (!user) {
                return null;
            }
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('id', user.id).single();
            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            console.error('현재 사용자 프로필 조회 실패:', error);
            return null;
        }
    }
    // 사용자 프로필 업데이트
    static async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update(updates).eq('id', userId).select().single();
            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            console.error('프로필 업데이트 실패:', error);
            throw error;
        }
    }
}
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
"[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TossLoginButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$hooks$2f$useTossAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/hooks/useTossAuth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$services$2f$tossAuthService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/services/tossAuthService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/work/health-hero/src/store/authStore.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function TossLoginButton() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { login, isLoading: tossLoading, error: tossError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$hooks$2f$useTossAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTossAuth"])();
    const { setUser, setLoading, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$store$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [localError, setLocalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleLogin = async ()=>{
        setLocalError(null);
        setError(null);
        setLoading(true);
        try {
            // 1. 토스 로그인
            const tossResult = await login();
            console.log('토스 로그인 성공:', tossResult);
            // 2. Supabase 연동
            const supabaseResult = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$src$2f$services$2f$tossAuthService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TossAuthService"].createOrUpdateUser(tossResult);
            console.log('Supabase 연동 성공:', supabaseResult);
            // 3. 사용자 정보 저장
            if (supabaseResult.profile) {
                setUser(supabaseResult.profile);
            }
            // 4. 게임 페이지로 이동
            router.push('/game');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
            console.error('로그인 실패:', error);
            setLocalError(errorMessage);
            setError(errorMessage);
        } finally{
            setLoading(false);
        }
    };
    const displayError = tossError || localError;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleLogin,
                disabled: tossLoading,
                className: "w-full bg-[#3182F6] hover:bg-[#2C5FCC] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                children: tossLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    className: "opacity-25",
                                    cx: "12",
                                    cy: "12",
                                    r: "10",
                                    stroke: "currentColor",
                                    strokeWidth: "4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    className: "opacity-75",
                                    fill: "currentColor",
                                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this),
                        "로그인 중..."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this) : '토스로 시작하기'
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            displayError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-500/10 border border-red-500/50 rounded-lg p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-500 text-sm text-center",
                    children: displayError
                }, void 0, false, {
                    fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                    lineNumber: 70,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                lineNumber: 69,
                columnNumber: 9
            }, this),
            "undefined" !== 'undefined' && typeof appLogin === 'undefined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-yellow-600 text-xs text-center",
                    children: [
                        "💡 토스 로그인은 앱인토스 환경에서만 사용할 수 있습니다.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$work$2f$health$2d$hero$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                            lineNumber: 78,
                            columnNumber: 46
                        }, this),
                        "샌드박스 앱 또는 토스앱에서 테스트해주세요."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/work/health-hero/src/components/TossLoginButton.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__61560335._.js.map