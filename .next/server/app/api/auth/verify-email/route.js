/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/verify-email/route";
exports.ids = ["app/api/auth/verify-email/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-email%2Froute&page=%2Fapi%2Fauth%2Fverify-email%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-email%2Froute.ts&appDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-email%2Froute&page=%2Fapi%2Fauth%2Fverify-email%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-email%2Froute.ts&appDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_Storage_Documents_Programming_Cursor_Projects_domitests_test_1_DomiAI_app_api_auth_verify_email_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/verify-email/route.ts */ \"(rsc)/./app/api/auth/verify-email/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/verify-email/route\",\n        pathname: \"/api/auth/verify-email\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/verify-email/route\"\n    },\n    resolvedPagePath: \"D:\\\\Storage\\\\Documents\\\\Programming\\\\Cursor Projects\\\\domitests\\\\test 1\\\\DomiAI\\\\app\\\\api\\\\auth\\\\verify-email\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_Storage_Documents_Programming_Cursor_Projects_domitests_test_1_DomiAI_app_api_auth_verify_email_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGdmVyaWZ5LWVtYWlsJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGdmVyaWZ5LWVtYWlsJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRnZlcmlmeS1lbWFpbCUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDU3RvcmFnZSU1Q0RvY3VtZW50cyU1Q1Byb2dyYW1taW5nJTVDQ3Vyc29yJTIwUHJvamVjdHMlNUNkb21pdGVzdHMlNUN0ZXN0JTIwMSU1Q0RvbWlBSSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1Q1N0b3JhZ2UlNUNEb2N1bWVudHMlNUNQcm9ncmFtbWluZyU1Q0N1cnNvciUyMFByb2plY3RzJTVDZG9taXRlc3RzJTVDdGVzdCUyMDElNUNEb21pQUkmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3VFO0FBQ3BKO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxTdG9yYWdlXFxcXERvY3VtZW50c1xcXFxQcm9ncmFtbWluZ1xcXFxDdXJzb3IgUHJvamVjdHNcXFxcZG9taXRlc3RzXFxcXHRlc3QgMVxcXFxEb21pQUlcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXHZlcmlmeS1lbWFpbFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC92ZXJpZnktZW1haWwvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL3ZlcmlmeS1lbWFpbFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC92ZXJpZnktZW1haWwvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFxTdG9yYWdlXFxcXERvY3VtZW50c1xcXFxQcm9ncmFtbWluZ1xcXFxDdXJzb3IgUHJvamVjdHNcXFxcZG9taXRlc3RzXFxcXHRlc3QgMVxcXFxEb21pQUlcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXHZlcmlmeS1lbWFpbFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-email%2Froute&page=%2Fapi%2Fauth%2Fverify-email%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-email%2Froute.ts&appDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./app/api/auth/verify-email/route.ts":
/*!********************************************!*\
  !*** ./app/api/auth/verify-email/route.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const token = searchParams.get('token');\n    if (!token) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL('/auth/error?error=missing_token', request.url));\n    }\n    try {\n        // Find user with verification token\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.findFirst({\n            where: {\n                verificationToken: token,\n                emailVerified: false\n            }\n        });\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL('/auth/error?error=invalid_token', request.url));\n        }\n        // Update user as verified\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.update({\n            where: {\n                id: user.id\n            },\n            data: {\n                emailVerified: true,\n                verificationToken: null,\n                status: 'ACTIVE'\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL('/auth/verified', request.url));\n    } catch (error) {\n        console.error('Email verification error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.redirect(new URL('/auth/error?error=verification_failed', request.url));\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvdmVyaWZ5LWVtYWlsL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNUO0FBRTNCLGVBQWVFLElBQUlDLE9BQWdCO0lBQ3hDLE1BQU0sRUFBRUMsWUFBWSxFQUFFLEdBQUcsSUFBSUMsSUFBSUYsUUFBUUcsR0FBRztJQUM1QyxNQUFNQyxRQUFRSCxhQUFhSSxHQUFHLENBQUM7SUFFL0IsSUFBSSxDQUFDRCxPQUFPO1FBQ1YsT0FBT1AscURBQVlBLENBQUNTLFFBQVEsQ0FBQyxJQUFJSixJQUFJLG1DQUFtQ0YsUUFBUUcsR0FBRztJQUNyRjtJQUVBLElBQUk7UUFDRixvQ0FBb0M7UUFDcEMsTUFBTUksT0FBTyxNQUFNVCxtREFBTUEsQ0FBQ1MsSUFBSSxDQUFDQyxTQUFTLENBQUM7WUFDdkNDLE9BQU87Z0JBQ0xDLG1CQUFtQk47Z0JBQ25CTyxlQUFlO1lBQ2pCO1FBQ0Y7UUFFQSxJQUFJLENBQUNKLE1BQU07WUFDVCxPQUFPVixxREFBWUEsQ0FBQ1MsUUFBUSxDQUFDLElBQUlKLElBQUksbUNBQW1DRixRQUFRRyxHQUFHO1FBQ3JGO1FBRUEsMEJBQTBCO1FBQzFCLE1BQU1MLG1EQUFNQSxDQUFDUyxJQUFJLENBQUNLLE1BQU0sQ0FBQztZQUN2QkgsT0FBTztnQkFBRUksSUFBSU4sS0FBS00sRUFBRTtZQUFDO1lBQ3JCQyxNQUFNO2dCQUNKSCxlQUFlO2dCQUNmRCxtQkFBbUI7Z0JBQ25CSyxRQUFRO1lBQ1Y7UUFDRjtRQUVBLE9BQU9sQixxREFBWUEsQ0FBQ1MsUUFBUSxDQUFDLElBQUlKLElBQUksa0JBQWtCRixRQUFRRyxHQUFHO0lBQ3BFLEVBQUUsT0FBT2EsT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsNkJBQTZCQTtRQUMzQyxPQUFPbkIscURBQVlBLENBQUNTLFFBQVEsQ0FBQyxJQUFJSixJQUFJLHlDQUF5Q0YsUUFBUUcsR0FBRztJQUMzRjtBQUNGIiwic291cmNlcyI6WyJEOlxcU3RvcmFnZVxcRG9jdW1lbnRzXFxQcm9ncmFtbWluZ1xcQ3Vyc29yIFByb2plY3RzXFxkb21pdGVzdHNcXHRlc3QgMVxcRG9taUFJXFxhcHBcXGFwaVxcYXV0aFxcdmVyaWZ5LWVtYWlsXFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCBwcmlzbWEgZnJvbSAnQC9saWIvcHJpc21hJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xyXG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcclxuICBjb25zdCB0b2tlbiA9IHNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gIGlmICghdG9rZW4pIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTCgnL2F1dGgvZXJyb3I/ZXJyb3I9bWlzc2luZ190b2tlbicsIHJlcXVlc3QudXJsKSk7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgLy8gRmluZCB1c2VyIHdpdGggdmVyaWZpY2F0aW9uIHRva2VuXHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZEZpcnN0KHtcclxuICAgICAgd2hlcmU6IHsgXHJcbiAgICAgICAgdmVyaWZpY2F0aW9uVG9rZW46IHRva2VuLFxyXG4gICAgICAgIGVtYWlsVmVyaWZpZWQ6IGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLnJlZGlyZWN0KG5ldyBVUkwoJy9hdXRoL2Vycm9yP2Vycm9yPWludmFsaWRfdG9rZW4nLCByZXF1ZXN0LnVybCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSB1c2VyIGFzIHZlcmlmaWVkXHJcbiAgICBhd2FpdCBwcmlzbWEudXNlci51cGRhdGUoe1xyXG4gICAgICB3aGVyZTogeyBpZDogdXNlci5pZCB9LFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgZW1haWxWZXJpZmllZDogdHJ1ZSxcclxuICAgICAgICB2ZXJpZmljYXRpb25Ub2tlbjogbnVsbCxcclxuICAgICAgICBzdGF0dXM6ICdBQ1RJVkUnXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTCgnL2F1dGgvdmVyaWZpZWQnLCByZXF1ZXN0LnVybCkpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFbWFpbCB2ZXJpZmljYXRpb24gZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5yZWRpcmVjdChuZXcgVVJMKCcvYXV0aC9lcnJvcj9lcnJvcj12ZXJpZmljYXRpb25fZmFpbGVkJywgcmVxdWVzdC51cmwpKTtcclxuICB9XHJcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJ0b2tlbiIsImdldCIsInJlZGlyZWN0IiwidXNlciIsImZpbmRGaXJzdCIsIndoZXJlIiwidmVyaWZpY2F0aW9uVG9rZW4iLCJlbWFpbFZlcmlmaWVkIiwidXBkYXRlIiwiaWQiLCJkYXRhIiwic3RhdHVzIiwiZXJyb3IiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/verify-email/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxTQUFTLElBQUlELHdEQUFZQTtBQUUvQixpRUFBZUMsTUFBTUEsRUFBQSIsInNvdXJjZXMiOlsiRDpcXFN0b3JhZ2VcXERvY3VtZW50c1xcUHJvZ3JhbW1pbmdcXEN1cnNvciBQcm9qZWN0c1xcZG9taXRlc3RzXFx0ZXN0IDFcXERvbWlBSVxcbGliXFxwcmlzbWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KClcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHByaXNtYSAiXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwicHJpc21hIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-email%2Froute&page=%2Fapi%2Fauth%2Fverify-email%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-email%2Froute.ts&appDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5CStorage%5CDocuments%5CProgramming%5CCursor%20Projects%5Cdomitests%5Ctest%201%5CDomiAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();