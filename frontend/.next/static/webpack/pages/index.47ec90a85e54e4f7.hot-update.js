/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[6].oneOf[9].use[1]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[6].oneOf[9].use[2]!./styles/Home.module.css":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[6].oneOf[9].use[1]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[6].oneOf[9].use[2]!./styles/Home.module.css ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/next/dist/build/webpack/loaders/css-loader/src/runtime/api.js */ \"./node_modules/next/dist/build/webpack/loaders/css-loader/src/runtime/api.js\");\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(true);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, \"/* Styles for Home Page based on Figma Frame 2038:150 */\\r\\n\\r\\n.Home_container__d256j {\\r\\n  background-color: #212121; /* Dark background */\\r\\n  color: #FFFFFF; /* White text */\\r\\n  min-height: 100vh;\\r\\n  display: flex;\\r\\n  flex-direction: column;\\r\\n  font-family: 'Anonymous Pro', monospace; /* Default font */\\r\\n}\\r\\n\\r\\n.Home_header__y2QYS {\\r\\n  display: flex;\\r\\n  justify-content: space-between; /* Logo left, nav right */\\r\\n  align-items: center;\\r\\n  padding: 2rem 4rem; /* Adjust padding based on Figma */\\r\\n  width: 100%;\\r\\n  box-sizing: border-box;\\r\\n}\\r\\n\\r\\n.Home_logo__IOQAX {\\r\\n  font-weight: 700;\\r\\n  font-size: 4rem; /* 64px from Figma style_TZP0LG */\\r\\n  color: #FFFFFF;\\r\\n}\\r\\n\\r\\n.Home_nav__KViFq {\\r\\n  display: flex;\\r\\n  gap: 2.5rem; /* Adjust gap based on Figma */\\r\\n}\\r\\n\\r\\n.Home_navLink__SvGJP {\\r\\n  font-weight: 400;\\r\\n  font-size: 1rem; /* 16px from Figma style_F6OOPH */\\r\\n  color: #FFFFFF;\\r\\n  text-decoration: none;\\r\\n  transition: color 0.2s ease;\\r\\n}\\r\\n\\r\\n.Home_navLink__SvGJP:hover {\\r\\n  color: #a0a0a0; /* Simple hover effect */\\r\\n}\\r\\n\\r\\n.Home_main__VkIEL {\\r\\n  flex-grow: 1;\\r\\n  display: flex;\\r\\n  flex-direction: column; /* Stack content area and image */\\r\\n  justify-content: center; /* Center vertically */\\r\\n  align-items: center; /* Center horizontally */\\r\\n  padding: 2rem 4rem; /* Padding for main area */\\r\\n  width: 100%;\\r\\n  box-sizing: border-box;\\r\\n  position: relative; /* Needed for absolute positioning of image if required */\\r\\n  overflow: hidden; /* Prevent image overflow if needed */\\r\\n}\\r\\n\\r\\n.Home_contentArea__XoUVk {\\r\\n  display: flex;\\r\\n  flex-direction: column;\\r\\n  align-items: flex-start; /* Align text/button left */\\r\\n  justify-content: center;\\r\\n  position: relative; /* Keep content above image */\\r\\n  z-index: 1;\\r\\n  width: 100%;\\r\\n  max-width: 1200px; /* Limit content width */\\r\\n  margin-bottom: auto; /* Push content towards top/center */\\r\\n  padding-top: 5vh; /* Add some space from top */\\r\\n}\\r\\n\\r\\n.Home_headline__fA2jP {\\r\\n  font-weight: 700;\\r\\n  font-size: 3rem; /* 48px from Figma style_66WSU8 */\\r\\n  line-height: 1.2; /* Adjust line height */\\r\\n  color: #FFFFFF;\\r\\n  margin: 0 0 2rem 0; /* Margin below headline */\\r\\n}\\r\\n\\r\\n.Home_ctaButton__lZzFU {\\r\\n  display: inline-block;\\r\\n  background-color: rgba(53, 100, 59, 0.55); /* Green button from Figma fill_IA9S54 */\\r\\n  color: #FFFFFF;\\r\\n  font-family: 'Anonymous Pro', monospace;\\r\\n  font-weight: 400;\\r\\n  font-size: 1.25rem; /* 20px from Figma style_LGEJ9M */\\r\\n  padding: 0.8rem 2rem; /* Adjust padding */\\r\\n  border: none;\\r\\n  border-radius: 33px; /* Rounded corners from Figma */\\r\\n  text-decoration: none;\\r\\n  cursor: pointer;\\r\\n  transition: background-color 0.2s ease;\\r\\n  margin-top: 1rem; /* Space above button */\\r\\n  align-self: flex-end; /* Align button to the right as per screenshot */\\r\\n  position: relative; /* Adjust positioning relative to text */\\r\\n  right: 10%; /* Approximate positioning from screenshot */\\r\\n}\\r\\n\\r\\n.Home_ctaButton__lZzFU:hover {\\r\\n  background-color: rgba(63, 120, 70, 0.7); /* Slightly lighter green on hover */\\r\\n}\\r\\n\\r\\n.Home_imageContainer__14Rgd {\\r\\n  position: absolute; /* Position image behind text */\\r\\n  bottom: 5%; /* Position near bottom */\\r\\n  left: 10%; /* Position towards left */\\r\\n  width: 40%; /* Adjust width based on desired size */\\r\\n  max-width: 600px; /* Max size */\\r\\n  z-index: 0; /* Behind content */\\r\\n  opacity: 0.6; /* Make it slightly transparent */\\r\\n}\\r\\n\\r\\n.Home_imageContainer__14Rgd img {\\r\\n  display: block;\\r\\n  width: 100%;\\r\\n  height: auto;\\r\\n}\\r\\n\\r\\n/* Remove styles from previous implementation if they exist */\\r\\n.Home_contentWrapper__rmdac, .Home_divider__RsgqR, .Home_navButtonContainer__ANryY, .Home_navButton__CJnYb, .Home_loginButtonContainer__BaSZu, .Home_loginButton__Hqu1n, .Home_footer__yFiaX, .Home_grid__AVljO, .Home_card__E5spL {\\r\\n  display: none; /* Hide elements from previous design */\\r\\n}\", \"\",{\"version\":3,\"sources\":[\"webpack://styles/Home.module.css\"],\"names\":[],\"mappings\":\"AAAA,uDAAuD;;AAEvD;EACE,yBAAyB,EAAE,oBAAoB;EAC/C,cAAc,EAAE,eAAe;EAC/B,iBAAiB;EACjB,aAAa;EACb,sBAAsB;EACtB,uCAAuC,EAAE,iBAAiB;AAC5D;;AAEA;EACE,aAAa;EACb,8BAA8B,EAAE,yBAAyB;EACzD,mBAAmB;EACnB,kBAAkB,EAAE,kCAAkC;EACtD,WAAW;EACX,sBAAsB;AACxB;;AAEA;EACE,gBAAgB;EAChB,eAAe,EAAE,iCAAiC;EAClD,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,WAAW,EAAE,8BAA8B;AAC7C;;AAEA;EACE,gBAAgB;EAChB,eAAe,EAAE,iCAAiC;EAClD,cAAc;EACd,qBAAqB;EACrB,2BAA2B;AAC7B;;AAEA;EACE,cAAc,EAAE,wBAAwB;AAC1C;;AAEA;EACE,YAAY;EACZ,aAAa;EACb,sBAAsB,EAAE,iCAAiC;EACzD,uBAAuB,EAAE,sBAAsB;EAC/C,mBAAmB,EAAE,wBAAwB;EAC7C,kBAAkB,EAAE,0BAA0B;EAC9C,WAAW;EACX,sBAAsB;EACtB,kBAAkB,EAAE,yDAAyD;EAC7E,gBAAgB,EAAE,qCAAqC;AACzD;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB,EAAE,2BAA2B;EACpD,uBAAuB;EACvB,kBAAkB,EAAE,6BAA6B;EACjD,UAAU;EACV,WAAW;EACX,iBAAiB,EAAE,wBAAwB;EAC3C,mBAAmB,EAAE,oCAAoC;EACzD,gBAAgB,EAAE,4BAA4B;AAChD;;AAEA;EACE,gBAAgB;EAChB,eAAe,EAAE,iCAAiC;EAClD,gBAAgB,EAAE,uBAAuB;EACzC,cAAc;EACd,kBAAkB,EAAE,0BAA0B;AAChD;;AAEA;EACE,qBAAqB;EACrB,yCAAyC,EAAE,wCAAwC;EACnF,cAAc;EACd,uCAAuC;EACvC,gBAAgB;EAChB,kBAAkB,EAAE,iCAAiC;EACrD,oBAAoB,EAAE,mBAAmB;EACzC,YAAY;EACZ,mBAAmB,EAAE,+BAA+B;EACpD,qBAAqB;EACrB,eAAe;EACf,sCAAsC;EACtC,gBAAgB,EAAE,uBAAuB;EACzC,oBAAoB,EAAE,gDAAgD;EACtE,kBAAkB,EAAE,wCAAwC;EAC5D,UAAU,EAAE,4CAA4C;AAC1D;;AAEA;EACE,wCAAwC,EAAE,oCAAoC;AAChF;;AAEA;EACE,kBAAkB,EAAE,+BAA+B;EACnD,UAAU,EAAE,yBAAyB;EACrC,SAAS,EAAE,0BAA0B;EACrC,UAAU,EAAE,uCAAuC;EACnD,gBAAgB,EAAE,aAAa;EAC/B,UAAU,EAAE,mBAAmB;EAC/B,YAAY,EAAE,iCAAiC;AACjD;;AAEA;EACE,cAAc;EACd,WAAW;EACX,YAAY;AACd;;AAEA,6DAA6D;AAC7D;EACE,aAAa,EAAE,uCAAuC;AACxD\",\"sourcesContent\":[\"/* Styles for Home Page based on Figma Frame 2038:150 */\\r\\n\\r\\n.container {\\r\\n  background-color: #212121; /* Dark background */\\r\\n  color: #FFFFFF; /* White text */\\r\\n  min-height: 100vh;\\r\\n  display: flex;\\r\\n  flex-direction: column;\\r\\n  font-family: 'Anonymous Pro', monospace; /* Default font */\\r\\n}\\r\\n\\r\\n.header {\\r\\n  display: flex;\\r\\n  justify-content: space-between; /* Logo left, nav right */\\r\\n  align-items: center;\\r\\n  padding: 2rem 4rem; /* Adjust padding based on Figma */\\r\\n  width: 100%;\\r\\n  box-sizing: border-box;\\r\\n}\\r\\n\\r\\n.logo {\\r\\n  font-weight: 700;\\r\\n  font-size: 4rem; /* 64px from Figma style_TZP0LG */\\r\\n  color: #FFFFFF;\\r\\n}\\r\\n\\r\\n.nav {\\r\\n  display: flex;\\r\\n  gap: 2.5rem; /* Adjust gap based on Figma */\\r\\n}\\r\\n\\r\\n.navLink {\\r\\n  font-weight: 400;\\r\\n  font-size: 1rem; /* 16px from Figma style_F6OOPH */\\r\\n  color: #FFFFFF;\\r\\n  text-decoration: none;\\r\\n  transition: color 0.2s ease;\\r\\n}\\r\\n\\r\\n.navLink:hover {\\r\\n  color: #a0a0a0; /* Simple hover effect */\\r\\n}\\r\\n\\r\\n.main {\\r\\n  flex-grow: 1;\\r\\n  display: flex;\\r\\n  flex-direction: column; /* Stack content area and image */\\r\\n  justify-content: center; /* Center vertically */\\r\\n  align-items: center; /* Center horizontally */\\r\\n  padding: 2rem 4rem; /* Padding for main area */\\r\\n  width: 100%;\\r\\n  box-sizing: border-box;\\r\\n  position: relative; /* Needed for absolute positioning of image if required */\\r\\n  overflow: hidden; /* Prevent image overflow if needed */\\r\\n}\\r\\n\\r\\n.contentArea {\\r\\n  display: flex;\\r\\n  flex-direction: column;\\r\\n  align-items: flex-start; /* Align text/button left */\\r\\n  justify-content: center;\\r\\n  position: relative; /* Keep content above image */\\r\\n  z-index: 1;\\r\\n  width: 100%;\\r\\n  max-width: 1200px; /* Limit content width */\\r\\n  margin-bottom: auto; /* Push content towards top/center */\\r\\n  padding-top: 5vh; /* Add some space from top */\\r\\n}\\r\\n\\r\\n.headline {\\r\\n  font-weight: 700;\\r\\n  font-size: 3rem; /* 48px from Figma style_66WSU8 */\\r\\n  line-height: 1.2; /* Adjust line height */\\r\\n  color: #FFFFFF;\\r\\n  margin: 0 0 2rem 0; /* Margin below headline */\\r\\n}\\r\\n\\r\\n.ctaButton {\\r\\n  display: inline-block;\\r\\n  background-color: rgba(53, 100, 59, 0.55); /* Green button from Figma fill_IA9S54 */\\r\\n  color: #FFFFFF;\\r\\n  font-family: 'Anonymous Pro', monospace;\\r\\n  font-weight: 400;\\r\\n  font-size: 1.25rem; /* 20px from Figma style_LGEJ9M */\\r\\n  padding: 0.8rem 2rem; /* Adjust padding */\\r\\n  border: none;\\r\\n  border-radius: 33px; /* Rounded corners from Figma */\\r\\n  text-decoration: none;\\r\\n  cursor: pointer;\\r\\n  transition: background-color 0.2s ease;\\r\\n  margin-top: 1rem; /* Space above button */\\r\\n  align-self: flex-end; /* Align button to the right as per screenshot */\\r\\n  position: relative; /* Adjust positioning relative to text */\\r\\n  right: 10%; /* Approximate positioning from screenshot */\\r\\n}\\r\\n\\r\\n.ctaButton:hover {\\r\\n  background-color: rgba(63, 120, 70, 0.7); /* Slightly lighter green on hover */\\r\\n}\\r\\n\\r\\n.imageContainer {\\r\\n  position: absolute; /* Position image behind text */\\r\\n  bottom: 5%; /* Position near bottom */\\r\\n  left: 10%; /* Position towards left */\\r\\n  width: 40%; /* Adjust width based on desired size */\\r\\n  max-width: 600px; /* Max size */\\r\\n  z-index: 0; /* Behind content */\\r\\n  opacity: 0.6; /* Make it slightly transparent */\\r\\n}\\r\\n\\r\\n.imageContainer img {\\r\\n  display: block;\\r\\n  width: 100%;\\r\\n  height: auto;\\r\\n}\\r\\n\\r\\n/* Remove styles from previous implementation if they exist */\\r\\n.contentWrapper, .divider, .navButtonContainer, .navButton, .loginButtonContainer, .loginButton, .footer, .grid, .card {\\r\\n  display: none; /* Hide elements from previous design */\\r\\n}\"],\"sourceRoot\":\"\"}]);\n// Exports\n___CSS_LOADER_EXPORT___.locals = {\n\t\"container\": \"Home_container__d256j\",\n\t\"header\": \"Home_header__y2QYS\",\n\t\"logo\": \"Home_logo__IOQAX\",\n\t\"nav\": \"Home_nav__KViFq\",\n\t\"navLink\": \"Home_navLink__SvGJP\",\n\t\"main\": \"Home_main__VkIEL\",\n\t\"contentArea\": \"Home_contentArea__XoUVk\",\n\t\"headline\": \"Home_headline__fA2jP\",\n\t\"ctaButton\": \"Home_ctaButton__lZzFU\",\n\t\"imageContainer\": \"Home_imageContainer__14Rgd\",\n\t\"contentWrapper\": \"Home_contentWrapper__rmdac\",\n\t\"divider\": \"Home_divider__RsgqR\",\n\t\"navButtonContainer\": \"Home_navButtonContainer__ANryY\",\n\t\"navButton\": \"Home_navButton__CJnYb\",\n\t\"loginButtonContainer\": \"Home_loginButtonContainer__BaSZu\",\n\t\"loginButton\": \"Home_loginButton__Hqu1n\",\n\t\"footer\": \"Home_footer__yFiaX\",\n\t\"grid\": \"Home_grid__AVljO\",\n\t\"card\": \"Home_card__E5spL\"\n};\nmodule.exports = ___CSS_LOADER_EXPORT___;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9jc3MtbG9hZGVyL3NyYy9pbmRleC5qcz8/cnVsZVNldFsxXS5ydWxlc1s2XS5vbmVPZls5XS51c2VbMV0hLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3J1bGVTZXRbMV0ucnVsZXNbNl0ub25lT2ZbOV0udXNlWzJdIS4vc3R5bGVzL0hvbWUubW9kdWxlLmNzcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBLGtDQUFrQyxtQkFBTyxDQUFDLG1LQUErRTtBQUN6SDtBQUNBO0FBQ0Esa0lBQWtJLGlDQUFpQywyQ0FBMkMsd0NBQXdDLG9CQUFvQiw2QkFBNkIsK0NBQStDLHVCQUF1Qiw2QkFBNkIsb0JBQW9CLHNDQUFzQyxvREFBb0QsMEJBQTBCLHFEQUFxRCw2QkFBNkIsS0FBSywyQkFBMkIsdUJBQXVCLHVCQUF1Qix1REFBdUQsS0FBSywwQkFBMEIsb0JBQW9CLG1CQUFtQixvQ0FBb0MsOEJBQThCLHVCQUF1Qix1QkFBdUIsdURBQXVELDRCQUE0QixrQ0FBa0MsS0FBSyxvQ0FBb0Msc0JBQXNCLDhCQUE4QiwyQkFBMkIsbUJBQW1CLG9CQUFvQiw4QkFBOEIsaUVBQWlFLGtEQUFrRCxtREFBbUQsNkNBQTZDLDZCQUE2QiwwQkFBMEIsa0ZBQWtGLDJDQUEyQyxrQ0FBa0Msb0JBQW9CLDZCQUE2QiwrQkFBK0IsMERBQTBELDBCQUEwQiwrQ0FBK0Msa0JBQWtCLHlCQUF5QixvREFBb0QsNkRBQTZELGtDQUFrQywrQkFBK0IsdUJBQXVCLHVCQUF1QiwwREFBMEQsNkNBQTZDLDBCQUEwQixnQ0FBZ0MsZ0NBQWdDLDRCQUE0QixpREFBaUQsOERBQThELDhDQUE4Qyx1QkFBdUIsMEJBQTBCLDhEQUE4RCx1Q0FBdUMsMkJBQTJCLDREQUE0RCxzQkFBc0IsNkNBQTZDLHdCQUF3QixvREFBb0QsMkVBQTJFLDJEQUEyRCxrREFBa0Qsc0NBQXNDLGdEQUFnRCwwQ0FBMEMscUNBQXFDLDBCQUEwQixrREFBa0QsMkNBQTJDLDZDQUE2QyxnRUFBZ0UsZ0NBQWdDLHdDQUF3Qyx1Q0FBdUMseUNBQXlDLHFCQUFxQixrQkFBa0IsbUJBQW1CLEtBQUssOFNBQThTLHFCQUFxQiw2Q0FBNkMsT0FBTywrRkFBK0YsTUFBTSx3QkFBd0IscUJBQXFCLGFBQWEsV0FBVyxZQUFZLHlCQUF5QixPQUFPLEtBQUssVUFBVSx3QkFBd0IsYUFBYSx5QkFBeUIsV0FBVyxZQUFZLE9BQU8sS0FBSyxZQUFZLHVCQUF1QixXQUFXLE9BQU8sS0FBSyxVQUFVLHNCQUFzQixPQUFPLEtBQUssWUFBWSx1QkFBdUIsV0FBVyxZQUFZLGFBQWEsT0FBTyxLQUFLLHNCQUFzQixPQUFPLEtBQUssVUFBVSxVQUFVLHdCQUF3Qix5QkFBeUIseUJBQXlCLHlCQUF5QixXQUFXLFlBQVkseUJBQXlCLHlCQUF5QixPQUFPLEtBQUssVUFBVSxZQUFZLHlCQUF5QixhQUFhLHlCQUF5QixXQUFXLFVBQVUsd0JBQXdCLHlCQUF5Qix5QkFBeUIsT0FBTyxLQUFLLFlBQVksdUJBQXVCLHlCQUF5QixXQUFXLHdCQUF3QixPQUFPLEtBQUssWUFBWSx5QkFBeUIsV0FBVyxZQUFZLGFBQWEseUJBQXlCLHlCQUF5QixXQUFXLHdCQUF3QixhQUFhLFdBQVcsWUFBWSx5QkFBeUIseUJBQXlCLHlCQUF5Qix1QkFBdUIsT0FBTyxLQUFLLHdCQUF3QixPQUFPLEtBQUssd0JBQXdCLHVCQUF1Qix1QkFBdUIsdUJBQXVCLHVCQUF1Qix1QkFBdUIsdUJBQXVCLE9BQU8sS0FBSyxVQUFVLFVBQVUsVUFBVSxNQUFNLFlBQVksTUFBTSxzQkFBc0Isc0dBQXNHLGlDQUFpQywyQ0FBMkMsd0NBQXdDLG9CQUFvQiw2QkFBNkIsK0NBQStDLHVCQUF1QixpQkFBaUIsb0JBQW9CLHNDQUFzQyxvREFBb0QsMEJBQTBCLHFEQUFxRCw2QkFBNkIsS0FBSyxlQUFlLHVCQUF1Qix1QkFBdUIsdURBQXVELEtBQUssY0FBYyxvQkFBb0IsbUJBQW1CLG9DQUFvQyxrQkFBa0IsdUJBQXVCLHVCQUF1Qix1REFBdUQsNEJBQTRCLGtDQUFrQyxLQUFLLHdCQUF3QixzQkFBc0IsOEJBQThCLGVBQWUsbUJBQW1CLG9CQUFvQiw4QkFBOEIsaUVBQWlFLGtEQUFrRCxtREFBbUQsNkNBQTZDLDZCQUE2QiwwQkFBMEIsa0ZBQWtGLDJDQUEyQyxzQkFBc0Isb0JBQW9CLDZCQUE2QiwrQkFBK0IsMERBQTBELDBCQUEwQiwrQ0FBK0Msa0JBQWtCLHlCQUF5QixvREFBb0QsNkRBQTZELGtDQUFrQyxtQkFBbUIsdUJBQXVCLHVCQUF1QiwwREFBMEQsNkNBQTZDLDBCQUEwQixnQ0FBZ0Msb0JBQW9CLDRCQUE0QixpREFBaUQsOERBQThELDhDQUE4Qyx1QkFBdUIsMEJBQTBCLDhEQUE4RCx1Q0FBdUMsMkJBQTJCLDREQUE0RCxzQkFBc0IsNkNBQTZDLHdCQUF3QixvREFBb0QsMkVBQTJFLDJEQUEyRCxrREFBa0QsMEJBQTBCLGdEQUFnRCwwQ0FBMEMseUJBQXlCLDBCQUEwQixrREFBa0QsMkNBQTJDLDZDQUE2QyxnRUFBZ0UsZ0NBQWdDLHdDQUF3Qyx1Q0FBdUMsNkJBQTZCLHFCQUFxQixrQkFBa0IsbUJBQW1CLEtBQUssa01BQWtNLHFCQUFxQiw2Q0FBNkMsbUJBQW1CO0FBQ3B4UztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3N0eWxlcy9Ib21lLm1vZHVsZS5jc3M/MzU0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG52YXIgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL2Nzcy1sb2FkZXIvc3JjL3J1bnRpbWUvYXBpLmpzXCIpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKHRydWUpO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLyogU3R5bGVzIGZvciBIb21lIFBhZ2UgYmFzZWQgb24gRmlnbWEgRnJhbWUgMjAzODoxNTAgKi9cXHJcXG5cXHJcXG4uSG9tZV9jb250YWluZXJfX2QyNTZqIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyMTIxMjE7IC8qIERhcmsgYmFja2dyb3VuZCAqL1xcclxcbiAgY29sb3I6ICNGRkZGRkY7IC8qIFdoaXRlIHRleHQgKi9cXHJcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICBmb250LWZhbWlseTogJ0Fub255bW91cyBQcm8nLCBtb25vc3BhY2U7IC8qIERlZmF1bHQgZm9udCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uSG9tZV9oZWFkZXJfX3kyUVlTIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IC8qIExvZ28gbGVmdCwgbmF2IHJpZ2h0ICovXFxyXFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcclxcbiAgcGFkZGluZzogMnJlbSA0cmVtOyAvKiBBZGp1c3QgcGFkZGluZyBiYXNlZCBvbiBGaWdtYSAqL1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG4uSG9tZV9sb2dvX19JT1FBWCB7XFxyXFxuICBmb250LXdlaWdodDogNzAwO1xcclxcbiAgZm9udC1zaXplOiA0cmVtOyAvKiA2NHB4IGZyb20gRmlnbWEgc3R5bGVfVFpQMExHICovXFxyXFxuICBjb2xvcjogI0ZGRkZGRjtcXHJcXG59XFxyXFxuXFxyXFxuLkhvbWVfbmF2X19LVmlGcSB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZ2FwOiAyLjVyZW07IC8qIEFkanVzdCBnYXAgYmFzZWQgb24gRmlnbWEgKi9cXHJcXG59XFxyXFxuXFxyXFxuLkhvbWVfbmF2TGlua19fU3ZHSlAge1xcclxcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXHJcXG4gIGZvbnQtc2l6ZTogMXJlbTsgLyogMTZweCBmcm9tIEZpZ21hIHN0eWxlX0Y2T09QSCAqL1xcclxcbiAgY29sb3I6ICNGRkZGRkY7XFxyXFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XFxyXFxufVxcclxcblxcclxcbi5Ib21lX25hdkxpbmtfX1N2R0pQOmhvdmVyIHtcXHJcXG4gIGNvbG9yOiAjYTBhMGEwOyAvKiBTaW1wbGUgaG92ZXIgZWZmZWN0ICovXFxyXFxufVxcclxcblxcclxcbi5Ib21lX21haW5fX1ZrSUVMIHtcXHJcXG4gIGZsZXgtZ3JvdzogMTtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAvKiBTdGFjayBjb250ZW50IGFyZWEgYW5kIGltYWdlICovXFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgLyogQ2VudGVyIHZlcnRpY2FsbHkgKi9cXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7IC8qIENlbnRlciBob3Jpem9udGFsbHkgKi9cXHJcXG4gIHBhZGRpbmc6IDJyZW0gNHJlbTsgLyogUGFkZGluZyBmb3IgbWFpbiBhcmVhICovXFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICBwb3NpdGlvbjogcmVsYXRpdmU7IC8qIE5lZWRlZCBmb3IgYWJzb2x1dGUgcG9zaXRpb25pbmcgb2YgaW1hZ2UgaWYgcmVxdWlyZWQgKi9cXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47IC8qIFByZXZlbnQgaW1hZ2Ugb3ZlcmZsb3cgaWYgbmVlZGVkICovXFxyXFxufVxcclxcblxcclxcbi5Ib21lX2NvbnRlbnRBcmVhX19Yb1VWayB7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0OyAvKiBBbGlnbiB0ZXh0L2J1dHRvbiBsZWZ0ICovXFxyXFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgLyogS2VlcCBjb250ZW50IGFib3ZlIGltYWdlICovXFxyXFxuICB6LWluZGV4OiAxO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBtYXgtd2lkdGg6IDEyMDBweDsgLyogTGltaXQgY29udGVudCB3aWR0aCAqL1xcclxcbiAgbWFyZ2luLWJvdHRvbTogYXV0bzsgLyogUHVzaCBjb250ZW50IHRvd2FyZHMgdG9wL2NlbnRlciAqL1xcclxcbiAgcGFkZGluZy10b3A6IDV2aDsgLyogQWRkIHNvbWUgc3BhY2UgZnJvbSB0b3AgKi9cXHJcXG59XFxyXFxuXFxyXFxuLkhvbWVfaGVhZGxpbmVfX2ZBMmpQIHtcXHJcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICBmb250LXNpemU6IDNyZW07IC8qIDQ4cHggZnJvbSBGaWdtYSBzdHlsZV82NldTVTggKi9cXHJcXG4gIGxpbmUtaGVpZ2h0OiAxLjI7IC8qIEFkanVzdCBsaW5lIGhlaWdodCAqL1xcclxcbiAgY29sb3I6ICNGRkZGRkY7XFxyXFxuICBtYXJnaW46IDAgMCAycmVtIDA7IC8qIE1hcmdpbiBiZWxvdyBoZWFkbGluZSAqL1xcclxcbn1cXHJcXG5cXHJcXG4uSG9tZV9jdGFCdXR0b25fX2xaekZVIHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNTMsIDEwMCwgNTksIDAuNTUpOyAvKiBHcmVlbiBidXR0b24gZnJvbSBGaWdtYSBmaWxsX0lBOVM1NCAqL1xcclxcbiAgY29sb3I6ICNGRkZGRkY7XFxyXFxuICBmb250LWZhbWlseTogJ0Fub255bW91cyBQcm8nLCBtb25vc3BhY2U7XFxyXFxuICBmb250LXdlaWdodDogNDAwO1xcclxcbiAgZm9udC1zaXplOiAxLjI1cmVtOyAvKiAyMHB4IGZyb20gRmlnbWEgc3R5bGVfTEdFSjlNICovXFxyXFxuICBwYWRkaW5nOiAwLjhyZW0gMnJlbTsgLyogQWRqdXN0IHBhZGRpbmcgKi9cXHJcXG4gIGJvcmRlcjogbm9uZTtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IDMzcHg7IC8qIFJvdW5kZWQgY29ybmVycyBmcm9tIEZpZ21hICovXFxyXFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgZWFzZTtcXHJcXG4gIG1hcmdpbi10b3A6IDFyZW07IC8qIFNwYWNlIGFib3ZlIGJ1dHRvbiAqL1xcclxcbiAgYWxpZ24tc2VsZjogZmxleC1lbmQ7IC8qIEFsaWduIGJ1dHRvbiB0byB0aGUgcmlnaHQgYXMgcGVyIHNjcmVlbnNob3QgKi9cXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgLyogQWRqdXN0IHBvc2l0aW9uaW5nIHJlbGF0aXZlIHRvIHRleHQgKi9cXHJcXG4gIHJpZ2h0OiAxMCU7IC8qIEFwcHJveGltYXRlIHBvc2l0aW9uaW5nIGZyb20gc2NyZWVuc2hvdCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uSG9tZV9jdGFCdXR0b25fX2xaekZVOmhvdmVyIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoNjMsIDEyMCwgNzAsIDAuNyk7IC8qIFNsaWdodGx5IGxpZ2h0ZXIgZ3JlZW4gb24gaG92ZXIgKi9cXHJcXG59XFxyXFxuXFxyXFxuLkhvbWVfaW1hZ2VDb250YWluZXJfXzE0UmdkIHtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTsgLyogUG9zaXRpb24gaW1hZ2UgYmVoaW5kIHRleHQgKi9cXHJcXG4gIGJvdHRvbTogNSU7IC8qIFBvc2l0aW9uIG5lYXIgYm90dG9tICovXFxyXFxuICBsZWZ0OiAxMCU7IC8qIFBvc2l0aW9uIHRvd2FyZHMgbGVmdCAqL1xcclxcbiAgd2lkdGg6IDQwJTsgLyogQWRqdXN0IHdpZHRoIGJhc2VkIG9uIGRlc2lyZWQgc2l6ZSAqL1xcclxcbiAgbWF4LXdpZHRoOiA2MDBweDsgLyogTWF4IHNpemUgKi9cXHJcXG4gIHotaW5kZXg6IDA7IC8qIEJlaGluZCBjb250ZW50ICovXFxyXFxuICBvcGFjaXR5OiAwLjY7IC8qIE1ha2UgaXQgc2xpZ2h0bHkgdHJhbnNwYXJlbnQgKi9cXHJcXG59XFxyXFxuXFxyXFxuLkhvbWVfaW1hZ2VDb250YWluZXJfXzE0UmdkIGltZyB7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgaGVpZ2h0OiBhdXRvO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBSZW1vdmUgc3R5bGVzIGZyb20gcHJldmlvdXMgaW1wbGVtZW50YXRpb24gaWYgdGhleSBleGlzdCAqL1xcclxcbi5Ib21lX2NvbnRlbnRXcmFwcGVyX19ybWRhYywgLkhvbWVfZGl2aWRlcl9fUnNncVIsIC5Ib21lX25hdkJ1dHRvbkNvbnRhaW5lcl9fQU5yeVksIC5Ib21lX25hdkJ1dHRvbl9fQ0puWWIsIC5Ib21lX2xvZ2luQnV0dG9uQ29udGFpbmVyX19CYVNadSwgLkhvbWVfbG9naW5CdXR0b25fX0hxdTFuLCAuSG9tZV9mb290ZXJfX3lGaWFYLCAuSG9tZV9ncmlkX19BVmxqTywgLkhvbWVfY2FyZF9fRTVzcEwge1xcclxcbiAgZGlzcGxheTogbm9uZTsgLyogSGlkZSBlbGVtZW50cyBmcm9tIHByZXZpb3VzIGRlc2lnbiAqL1xcclxcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vc3R5bGVzL0hvbWUubW9kdWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSx1REFBdUQ7O0FBRXZEO0VBQ0UseUJBQXlCLEVBQUUsb0JBQW9CO0VBQy9DLGNBQWMsRUFBRSxlQUFlO0VBQy9CLGlCQUFpQjtFQUNqQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVDQUF1QyxFQUFFLGlCQUFpQjtBQUM1RDs7QUFFQTtFQUNFLGFBQWE7RUFDYiw4QkFBOEIsRUFBRSx5QkFBeUI7RUFDekQsbUJBQW1CO0VBQ25CLGtCQUFrQixFQUFFLGtDQUFrQztFQUN0RCxXQUFXO0VBQ1gsc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGVBQWUsRUFBRSxpQ0FBaUM7RUFDbEQsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixXQUFXLEVBQUUsOEJBQThCO0FBQzdDOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGVBQWUsRUFBRSxpQ0FBaUM7RUFDbEQsY0FBYztFQUNkLHFCQUFxQjtFQUNyQiwyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxjQUFjLEVBQUUsd0JBQXdCO0FBQzFDOztBQUVBO0VBQ0UsWUFBWTtFQUNaLGFBQWE7RUFDYixzQkFBc0IsRUFBRSxpQ0FBaUM7RUFDekQsdUJBQXVCLEVBQUUsc0JBQXNCO0VBQy9DLG1CQUFtQixFQUFFLHdCQUF3QjtFQUM3QyxrQkFBa0IsRUFBRSwwQkFBMEI7RUFDOUMsV0FBVztFQUNYLHNCQUFzQjtFQUN0QixrQkFBa0IsRUFBRSx5REFBeUQ7RUFDN0UsZ0JBQWdCLEVBQUUscUNBQXFDO0FBQ3pEOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix1QkFBdUIsRUFBRSwyQkFBMkI7RUFDcEQsdUJBQXVCO0VBQ3ZCLGtCQUFrQixFQUFFLDZCQUE2QjtFQUNqRCxVQUFVO0VBQ1YsV0FBVztFQUNYLGlCQUFpQixFQUFFLHdCQUF3QjtFQUMzQyxtQkFBbUIsRUFBRSxvQ0FBb0M7RUFDekQsZ0JBQWdCLEVBQUUsNEJBQTRCO0FBQ2hEOztBQUVBO0VBQ0UsZ0JBQWdCO0VBQ2hCLGVBQWUsRUFBRSxpQ0FBaUM7RUFDbEQsZ0JBQWdCLEVBQUUsdUJBQXVCO0VBQ3pDLGNBQWM7RUFDZCxrQkFBa0IsRUFBRSwwQkFBMEI7QUFDaEQ7O0FBRUE7RUFDRSxxQkFBcUI7RUFDckIseUNBQXlDLEVBQUUsd0NBQXdDO0VBQ25GLGNBQWM7RUFDZCx1Q0FBdUM7RUFDdkMsZ0JBQWdCO0VBQ2hCLGtCQUFrQixFQUFFLGlDQUFpQztFQUNyRCxvQkFBb0IsRUFBRSxtQkFBbUI7RUFDekMsWUFBWTtFQUNaLG1CQUFtQixFQUFFLCtCQUErQjtFQUNwRCxxQkFBcUI7RUFDckIsZUFBZTtFQUNmLHNDQUFzQztFQUN0QyxnQkFBZ0IsRUFBRSx1QkFBdUI7RUFDekMsb0JBQW9CLEVBQUUsZ0RBQWdEO0VBQ3RFLGtCQUFrQixFQUFFLHdDQUF3QztFQUM1RCxVQUFVLEVBQUUsNENBQTRDO0FBQzFEOztBQUVBO0VBQ0Usd0NBQXdDLEVBQUUsb0NBQW9DO0FBQ2hGOztBQUVBO0VBQ0Usa0JBQWtCLEVBQUUsK0JBQStCO0VBQ25ELFVBQVUsRUFBRSx5QkFBeUI7RUFDckMsU0FBUyxFQUFFLDBCQUEwQjtFQUNyQyxVQUFVLEVBQUUsdUNBQXVDO0VBQ25ELGdCQUFnQixFQUFFLGFBQWE7RUFDL0IsVUFBVSxFQUFFLG1CQUFtQjtFQUMvQixZQUFZLEVBQUUsaUNBQWlDO0FBQ2pEOztBQUVBO0VBQ0UsY0FBYztFQUNkLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUEsNkRBQTZEO0FBQzdEO0VBQ0UsYUFBYSxFQUFFLHVDQUF1QztBQUN4RFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBTdHlsZXMgZm9yIEhvbWUgUGFnZSBiYXNlZCBvbiBGaWdtYSBGcmFtZSAyMDM4OjE1MCAqL1xcclxcblxcclxcbi5jb250YWluZXIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogIzIxMjEyMTsgLyogRGFyayBiYWNrZ3JvdW5kICovXFxyXFxuICBjb2xvcjogI0ZGRkZGRjsgLyogV2hpdGUgdGV4dCAqL1xcclxcbiAgbWluLWhlaWdodDogMTAwdmg7XFxyXFxuICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnQW5vbnltb3VzIFBybycsIG1vbm9zcGFjZTsgLyogRGVmYXVsdCBmb250ICovXFxyXFxufVxcclxcblxcclxcbi5oZWFkZXIge1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgLyogTG9nbyBsZWZ0LCBuYXYgcmlnaHQgKi9cXHJcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICBwYWRkaW5nOiAycmVtIDRyZW07IC8qIEFkanVzdCBwYWRkaW5nIGJhc2VkIG9uIEZpZ21hICovXFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxufVxcclxcblxcclxcbi5sb2dvIHtcXHJcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxyXFxuICBmb250LXNpemU6IDRyZW07IC8qIDY0cHggZnJvbSBGaWdtYSBzdHlsZV9UWlAwTEcgKi9cXHJcXG4gIGNvbG9yOiAjRkZGRkZGO1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2IHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBnYXA6IDIuNXJlbTsgLyogQWRqdXN0IGdhcCBiYXNlZCBvbiBGaWdtYSAqL1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2TGluayB7XFxyXFxuICBmb250LXdlaWdodDogNDAwO1xcclxcbiAgZm9udC1zaXplOiAxcmVtOyAvKiAxNnB4IGZyb20gRmlnbWEgc3R5bGVfRjZPT1BIICovXFxyXFxuICBjb2xvcjogI0ZGRkZGRjtcXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgZWFzZTtcXHJcXG59XFxyXFxuXFxyXFxuLm5hdkxpbms6aG92ZXIge1xcclxcbiAgY29sb3I6ICNhMGEwYTA7IC8qIFNpbXBsZSBob3ZlciBlZmZlY3QgKi9cXHJcXG59XFxyXFxuXFxyXFxuLm1haW4ge1xcclxcbiAgZmxleC1ncm93OiAxO1xcclxcbiAgZGlzcGxheTogZmxleDtcXHJcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IC8qIFN0YWNrIGNvbnRlbnQgYXJlYSBhbmQgaW1hZ2UgKi9cXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyOyAvKiBDZW50ZXIgdmVydGljYWxseSAqL1xcclxcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjsgLyogQ2VudGVyIGhvcml6b250YWxseSAqL1xcclxcbiAgcGFkZGluZzogMnJlbSA0cmVtOyAvKiBQYWRkaW5nIGZvciBtYWluIGFyZWEgKi9cXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTsgLyogTmVlZGVkIGZvciBhYnNvbHV0ZSBwb3NpdGlvbmluZyBvZiBpbWFnZSBpZiByZXF1aXJlZCAqL1xcclxcbiAgb3ZlcmZsb3c6IGhpZGRlbjsgLyogUHJldmVudCBpbWFnZSBvdmVyZmxvdyBpZiBuZWVkZWQgKi9cXHJcXG59XFxyXFxuXFxyXFxuLmNvbnRlbnRBcmVhIHtcXHJcXG4gIGRpc3BsYXk6IGZsZXg7XFxyXFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7IC8qIEFsaWduIHRleHQvYnV0dG9uIGxlZnQgKi9cXHJcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlOyAvKiBLZWVwIGNvbnRlbnQgYWJvdmUgaW1hZ2UgKi9cXHJcXG4gIHotaW5kZXg6IDE7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIG1heC13aWR0aDogMTIwMHB4OyAvKiBMaW1pdCBjb250ZW50IHdpZHRoICovXFxyXFxuICBtYXJnaW4tYm90dG9tOiBhdXRvOyAvKiBQdXNoIGNvbnRlbnQgdG93YXJkcyB0b3AvY2VudGVyICovXFxyXFxuICBwYWRkaW5nLXRvcDogNXZoOyAvKiBBZGQgc29tZSBzcGFjZSBmcm9tIHRvcCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uaGVhZGxpbmUge1xcclxcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXHJcXG4gIGZvbnQtc2l6ZTogM3JlbTsgLyogNDhweCBmcm9tIEZpZ21hIHN0eWxlXzY2V1NVOCAqL1xcclxcbiAgbGluZS1oZWlnaHQ6IDEuMjsgLyogQWRqdXN0IGxpbmUgaGVpZ2h0ICovXFxyXFxuICBjb2xvcjogI0ZGRkZGRjtcXHJcXG4gIG1hcmdpbjogMCAwIDJyZW0gMDsgLyogTWFyZ2luIGJlbG93IGhlYWRsaW5lICovXFxyXFxufVxcclxcblxcclxcbi5jdGFCdXR0b24ge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg1MywgMTAwLCA1OSwgMC41NSk7IC8qIEdyZWVuIGJ1dHRvbiBmcm9tIEZpZ21hIGZpbGxfSUE5UzU0ICovXFxyXFxuICBjb2xvcjogI0ZGRkZGRjtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnQW5vbnltb3VzIFBybycsIG1vbm9zcGFjZTtcXHJcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxyXFxuICBmb250LXNpemU6IDEuMjVyZW07IC8qIDIwcHggZnJvbSBGaWdtYSBzdHlsZV9MR0VKOU0gKi9cXHJcXG4gIHBhZGRpbmc6IDAuOHJlbSAycmVtOyAvKiBBZGp1c3QgcGFkZGluZyAqL1xcclxcbiAgYm9yZGVyOiBub25lO1xcclxcbiAgYm9yZGVyLXJhZGl1czogMzNweDsgLyogUm91bmRlZCBjb3JuZXJzIGZyb20gRmlnbWEgKi9cXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xcclxcbiAgbWFyZ2luLXRvcDogMXJlbTsgLyogU3BhY2UgYWJvdmUgYnV0dG9uICovXFxyXFxuICBhbGlnbi1zZWxmOiBmbGV4LWVuZDsgLyogQWxpZ24gYnV0dG9uIHRvIHRoZSByaWdodCBhcyBwZXIgc2NyZWVuc2hvdCAqL1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlOyAvKiBBZGp1c3QgcG9zaXRpb25pbmcgcmVsYXRpdmUgdG8gdGV4dCAqL1xcclxcbiAgcmlnaHQ6IDEwJTsgLyogQXBwcm94aW1hdGUgcG9zaXRpb25pbmcgZnJvbSBzY3JlZW5zaG90ICovXFxyXFxufVxcclxcblxcclxcbi5jdGFCdXR0b246aG92ZXIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2MywgMTIwLCA3MCwgMC43KTsgLyogU2xpZ2h0bHkgbGlnaHRlciBncmVlbiBvbiBob3ZlciAqL1xcclxcbn1cXHJcXG5cXHJcXG4uaW1hZ2VDb250YWluZXIge1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlOyAvKiBQb3NpdGlvbiBpbWFnZSBiZWhpbmQgdGV4dCAqL1xcclxcbiAgYm90dG9tOiA1JTsgLyogUG9zaXRpb24gbmVhciBib3R0b20gKi9cXHJcXG4gIGxlZnQ6IDEwJTsgLyogUG9zaXRpb24gdG93YXJkcyBsZWZ0ICovXFxyXFxuICB3aWR0aDogNDAlOyAvKiBBZGp1c3Qgd2lkdGggYmFzZWQgb24gZGVzaXJlZCBzaXplICovXFxyXFxuICBtYXgtd2lkdGg6IDYwMHB4OyAvKiBNYXggc2l6ZSAqL1xcclxcbiAgei1pbmRleDogMDsgLyogQmVoaW5kIGNvbnRlbnQgKi9cXHJcXG4gIG9wYWNpdHk6IDAuNjsgLyogTWFrZSBpdCBzbGlnaHRseSB0cmFuc3BhcmVudCAqL1xcclxcbn1cXHJcXG5cXHJcXG4uaW1hZ2VDb250YWluZXIgaW1nIHtcXHJcXG4gIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi8qIFJlbW92ZSBzdHlsZXMgZnJvbSBwcmV2aW91cyBpbXBsZW1lbnRhdGlvbiBpZiB0aGV5IGV4aXN0ICovXFxyXFxuLmNvbnRlbnRXcmFwcGVyLCAuZGl2aWRlciwgLm5hdkJ1dHRvbkNvbnRhaW5lciwgLm5hdkJ1dHRvbiwgLmxvZ2luQnV0dG9uQ29udGFpbmVyLCAubG9naW5CdXR0b24sIC5mb290ZXIsIC5ncmlkLCAuY2FyZCB7XFxyXFxuICBkaXNwbGF5OiBub25lOyAvKiBIaWRlIGVsZW1lbnRzIGZyb20gcHJldmlvdXMgZGVzaWduICovXFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ubG9jYWxzID0ge1xuXHRcImNvbnRhaW5lclwiOiBcIkhvbWVfY29udGFpbmVyX19kMjU2alwiLFxuXHRcImhlYWRlclwiOiBcIkhvbWVfaGVhZGVyX195MlFZU1wiLFxuXHRcImxvZ29cIjogXCJIb21lX2xvZ29fX0lPUUFYXCIsXG5cdFwibmF2XCI6IFwiSG9tZV9uYXZfX0tWaUZxXCIsXG5cdFwibmF2TGlua1wiOiBcIkhvbWVfbmF2TGlua19fU3ZHSlBcIixcblx0XCJtYWluXCI6IFwiSG9tZV9tYWluX19Wa0lFTFwiLFxuXHRcImNvbnRlbnRBcmVhXCI6IFwiSG9tZV9jb250ZW50QXJlYV9fWG9VVmtcIixcblx0XCJoZWFkbGluZVwiOiBcIkhvbWVfaGVhZGxpbmVfX2ZBMmpQXCIsXG5cdFwiY3RhQnV0dG9uXCI6IFwiSG9tZV9jdGFCdXR0b25fX2xaekZVXCIsXG5cdFwiaW1hZ2VDb250YWluZXJcIjogXCJIb21lX2ltYWdlQ29udGFpbmVyX18xNFJnZFwiLFxuXHRcImNvbnRlbnRXcmFwcGVyXCI6IFwiSG9tZV9jb250ZW50V3JhcHBlcl9fcm1kYWNcIixcblx0XCJkaXZpZGVyXCI6IFwiSG9tZV9kaXZpZGVyX19Sc2dxUlwiLFxuXHRcIm5hdkJ1dHRvbkNvbnRhaW5lclwiOiBcIkhvbWVfbmF2QnV0dG9uQ29udGFpbmVyX19BTnJ5WVwiLFxuXHRcIm5hdkJ1dHRvblwiOiBcIkhvbWVfbmF2QnV0dG9uX19DSm5ZYlwiLFxuXHRcImxvZ2luQnV0dG9uQ29udGFpbmVyXCI6IFwiSG9tZV9sb2dpbkJ1dHRvbkNvbnRhaW5lcl9fQmFTWnVcIixcblx0XCJsb2dpbkJ1dHRvblwiOiBcIkhvbWVfbG9naW5CdXR0b25fX0hxdTFuXCIsXG5cdFwiZm9vdGVyXCI6IFwiSG9tZV9mb290ZXJfX3lGaWFYXCIsXG5cdFwiZ3JpZFwiOiBcIkhvbWVfZ3JpZF9fQVZsak9cIixcblx0XCJjYXJkXCI6IFwiSG9tZV9jYXJkX19FNXNwTFwiXG59O1xubW9kdWxlLmV4cG9ydHMgPSBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/next/dist/build/webpack/loaders/css-loader/src/index.js??ruleSet[1].rules[6].oneOf[9].use[1]!./node_modules/next/dist/build/webpack/loaders/postcss-loader/src/index.js??ruleSet[1].rules[6].oneOf[9].use[2]!./styles/Home.module.css\n"));

/***/ })

});