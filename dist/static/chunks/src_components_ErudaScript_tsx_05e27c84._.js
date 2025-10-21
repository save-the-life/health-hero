(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ErudaScript.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErudaScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function ErudaScript() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ErudaScript.useEffect": ()=>{
            // 이미 Eruda가 로드되어 있는지 확인
            if ('eruda' in window) {
                console.log('✅ Eruda already loaded');
                return;
            }
            // 이미 스크립트가 추가되어 있는지 확인
            const existingScript = document.querySelector('script[src*="eruda"]');
            if (existingScript) {
                console.log('✅ Eruda script already exists');
                return;
            }
            // Eruda 스크립트를 동적으로 로드
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/eruda';
            script.async = true;
            script.onload = ({
                "ErudaScript.useEffect": ()=>{
                    if ('eruda' in window) {
                        const eruda = window.eruda;
                        eruda.init();
                        console.log('🔧 Eruda initialized successfully!');
                    }
                }
            })["ErudaScript.useEffect"];
            script.onerror = ({
                "ErudaScript.useEffect": ()=>{
                    console.error('❌ Failed to load Eruda');
                }
            })["ErudaScript.useEffect"];
            document.head.appendChild(script);
            // Cleanup
            return ({
                "ErudaScript.useEffect": ()=>{
                    if (document.head.contains(script)) {
                        document.head.removeChild(script);
                    }
                }
            })["ErudaScript.useEffect"];
        }
    }["ErudaScript.useEffect"], []);
    return null;
}
_s(ErudaScript, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ErudaScript;
var _c;
__turbopack_context__.k.register(_c, "ErudaScript");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_ErudaScript_tsx_05e27c84._.js.map