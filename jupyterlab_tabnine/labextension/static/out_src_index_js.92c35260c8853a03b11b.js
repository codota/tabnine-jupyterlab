"use strict";
(self["webpackChunk_tabnine_jupyterlab"] = self["webpackChunk_tabnine_jupyterlab"] || []).push([["out_src_index_js"],{

/***/ "./out/src/CompletionConnector.js":
/*!****************************************!*\
  !*** ./out/src/CompletionConnector.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CompletionConnector)
/* harmony export */ });
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__);

class CompletionConnector extends _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__.DataConnector {
    constructor(connectors) {
        super();
        this._connectors = connectors;
    }
    fetch(request) {
        return Promise.all(this._connectors.map((connector) => connector.fetch(request))).then((replies) => {
            const definedReplies = replies.filter((reply) => !!reply);
            return mergeReplies(definedReplies);
        });
    }
}
function mergeReplies(replies) {
    const repliesWithMatches = replies.filter((rep) => rep.matches.length > 0);
    if (repliesWithMatches.length === 0) {
        return replies[0];
    }
    if (repliesWithMatches.length === 1) {
        return repliesWithMatches[0];
    }
    const matches = new Set();
    repliesWithMatches.forEach((reply) => {
        reply.matches.forEach((match) => matches.add(match));
    });
    return Object.assign(Object.assign({}, repliesWithMatches[0]), { matches: [...matches] });
}


/***/ }),

/***/ "./out/src/TabnineConnector.js":
/*!*************************************!*\
  !*** ./out/src/TabnineConnector.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TabnineConnector),
/* harmony export */   "autoComplete": () => (/* binding */ autoComplete)
/* harmony export */ });
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _binary_postAutocomplete__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./binary/postAutocomplete */ "./out/src/binary/postAutocomplete.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "./out/src/consts.js");



class TabnineConnector extends _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__.DataConnector {
    constructor(options) {
        super();
        this._editor = options.editor;
    }
    fetch(request) {
        if (!this._editor) {
            return Promise.reject("No editor");
        }
        return autoComplete(this._editor);
    }
}
async function autoComplete(editor) {
    // Find the token at the cursor
    const position = editor.getCursorPosition();
    const currentOffset = editor.getOffsetAt(position);
    const beforeStartOffset = Math.max(0, currentOffset - _consts__WEBPACK_IMPORTED_MODULE_1__.CHAR_LIMIT);
    const afterEndOffset = currentOffset + _consts__WEBPACK_IMPORTED_MODULE_1__.CHAR_LIMIT;
    const before = editor
        .getTokens()
        .filter(({ offset }) => beforeStartOffset <= offset)
        .map(({ value }) => value)
        .join("");
    const after = editor
        .getTokens()
        .filter(({ offset }) => offset > currentOffset && offset < afterEndOffset)
        .map(({ value }) => value)
        .join("");
    const response = await (0,_binary_postAutocomplete__WEBPACK_IMPORTED_MODULE_2__.default)({
        before,
        after,
        max_num_results: 5,
        filename: "bilu",
        region_includes_end: true,
        region_includes_beginning: true,
    });
    debugger;
    return {
        start: currentOffset,
        end: currentOffset + 10,
        matches: response.results.map(({ new_prefix }) => new_prefix),
        metadata: {},
    };
}


/***/ }),

/***/ "./out/src/binary/postAutocomplete.js":
/*!********************************************!*\
  !*** ./out/src/binary/postAutocomplete.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ postAutocomplete)
/* harmony export */ });
/* harmony import */ var _postBinary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./postBinary */ "./out/src/binary/postBinary.js");

async function postAutocomplete(params) {
    return (0,_postBinary__WEBPACK_IMPORTED_MODULE_0__.default)({
        Autocomplete: params,
    });
}


/***/ }),

/***/ "./out/src/binary/postBinary.js":
/*!**************************************!*\
  !*** ./out/src/binary/postBinary.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ postBinary)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);


const settings = _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeSettings();
const requestUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(settings.baseUrl, "tabnine", "request");
async function postBinary(request) {
    let response;
    try {
        response = await _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeRequest(requestUrl, { method: "POST", body: JSON.stringify({ request, version: "3.2.71" }) }, settings);
    }
    catch (error) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.NetworkError(error);
    }
    const data = await response.json();
    if (!response.ok) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, data.message);
    }
    return data;
}


/***/ }),

/***/ "./out/src/consts.js":
/*!***************************!*\
  !*** ./out/src/consts.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHAR_LIMIT": () => (/* binding */ CHAR_LIMIT),
/* harmony export */   "API_VERSION": () => (/* binding */ API_VERSION)
/* harmony export */ });
const CHAR_LIMIT = 10000;
const API_VERSION = "3.5.34";


/***/ }),

/***/ "./out/src/index.js":
/*!**************************!*\
  !*** ./out/src/index.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/completer */ "webpack/sharing/consume/default/@jupyterlab/completer");
/* harmony import */ var _jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CompletionConnector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CompletionConnector */ "./out/src/CompletionConnector.js");
/* harmony import */ var _TabnineConnector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TabnineConnector */ "./out/src/TabnineConnector.js");




/**
 * The command IDs used by the console plugin.
 */
var CommandIDs;
(function (CommandIDs) {
    CommandIDs.invoke = "completer:invoke";
    CommandIDs.invokeNotebook = "completer:invoke-notebook";
    CommandIDs.select = "completer:select";
    CommandIDs.selectNotebook = "completer:select-notebook";
})(CommandIDs || (CommandIDs = {}));
/**
 *
 * Initialization data for the extension.
 */
const extension = {
    id: "completer",
    autoStart: true,
    requires: [_jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__.ICompletionManager, _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__.INotebookTracker],
    activate: async (app, completionManager, notebooks) => {
        console.log("Tabnine extension is activated!");
        notebooks.widgetAdded.connect((sender, panel) => {
            var _a, _b;
            let editor = (_b = (_a = panel.content.activeCell) === null || _a === void 0 ? void 0 : _a.editor) !== null && _b !== void 0 ? _b : null;
            const session = panel.sessionContext.session;
            const options = { session, editor };
            const connector = new _CompletionConnector__WEBPACK_IMPORTED_MODULE_2__.default([]);
            const handler = completionManager.register({
                connector,
                editor,
                parent: panel,
            });
            const updateConnector = () => {
                var _a, _b;
                editor = (_b = (_a = panel.content.activeCell) === null || _a === void 0 ? void 0 : _a.editor) !== null && _b !== void 0 ? _b : null;
                options.session = panel.sessionContext.session;
                options.editor = editor;
                handler.editor = editor;
                const kernel = new _jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__.KernelConnector(options);
                const context = new _jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__.ContextConnector(options);
                const custom = new _TabnineConnector__WEBPACK_IMPORTED_MODULE_3__.default(options);
                handler.connector = new _CompletionConnector__WEBPACK_IMPORTED_MODULE_2__.default([
                    kernel,
                    context,
                    custom,
                ]);
            };
            // Update the handler whenever the prompt or session changes
            panel.content.activeCellChanged.connect(updateConnector);
            panel.sessionContext.sessionChanged.connect(updateConnector);
        });
        // Add notebook completer command.
        app.commands.addCommand(CommandIDs.invokeNotebook, {
            execute: () => {
                var _a;
                const panel = notebooks.currentWidget;
                if (panel && ((_a = panel.content.activeCell) === null || _a === void 0 ? void 0 : _a.model.type) === "code") {
                    return app.commands.execute(CommandIDs.invoke, { id: panel.id });
                }
            },
        });
        // Add notebook completer select command.
        app.commands.addCommand(CommandIDs.selectNotebook, {
            execute: () => {
                const id = notebooks.currentWidget && notebooks.currentWidget.id;
                if (id) {
                    return app.commands.execute(CommandIDs.select, { id });
                }
            },
        });
        // Set enter key for notebook completer select command.
        app.commands.addKeyBinding({
            command: CommandIDs.selectNotebook,
            keys: ["Enter"],
            selector: ".jp-Notebook .jp-mod-completer-active",
        });
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (extension);


/***/ })

}]);
//# sourceMappingURL=out_src_index_js.92c35260c8853a03b11b.js.map