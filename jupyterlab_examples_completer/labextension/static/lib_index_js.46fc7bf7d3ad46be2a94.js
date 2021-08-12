"use strict";
(self["webpackChunk_tabnine_jupyterlab"] = self["webpackChunk_tabnine_jupyterlab"] || []).push([["lib_index_js"],{

/***/ "./lib/connector.js":
/*!**************************!*\
  !*** ./lib/connector.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CompletionConnector": () => (/* binding */ CompletionConnector)
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
            return Private.mergeReplies(definedReplies);
        });
    }
}
var Private;
(function (Private) {
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
    Private.mergeReplies = mergeReplies;
})(Private || (Private = {}));


/***/ }),

/***/ "./lib/customconnector.js":
/*!********************************!*\
  !*** ./lib/customconnector.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomConnector": () => (/* binding */ CustomConnector)
/* harmony export */ });
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handler */ "./lib/handler.js");


class CustomConnector extends _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_0__.DataConnector {
    constructor(options) {
        super();
        this._editor = options.editor;
    }
    fetch(request) {
        if (!this._editor) {
            return Promise.reject("No editor");
        }
        return new Promise((resolve) => {
            resolve(Private.completionHint(this._editor));
        });
    }
}
// i
/**
 * A namespace for Private functionality.
 */
var Private;
(function (Private) {
    /**
     * Get a list of mocked completion hints.
     *
     * @param editor Editor
     * @returns Completion reply
     */
    function completionHint(editor) {
        // Find the token at the cursor
        const cursor = editor.getCursorPosition();
        const token = editor.getTokenForPosition(cursor);
        const tokenList = [
            { value: token.value + "Dima", offset: token.offset, type: "magic" },
        ];
        (0,_handler__WEBPACK_IMPORTED_MODULE_1__.requestAPI)("complete", { method: "POST" });
        // Only choose the ones that have a non-empty type field, which are likely to be of interest.
        const completionList = tokenList.filter((t) => t.type).map((t) => t.value);
        // Remove duplicate completions from the list
        const matches = Array.from(new Set(completionList));
        return {
            start: token.offset,
            end: token.offset + token.value.length,
            matches,
            metadata: {},
        };
    }
    Private.completionHint = completionHint;
})(Private || (Private = {}));


/***/ }),

/***/ "./lib/handler.js":
/*!************************!*\
  !*** ./lib/handler.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "requestAPI": () => (/* binding */ requestAPI)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);


async function requestAPI(endPoint = "", init = {}) {
    const settings = _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeSettings();
    const requestUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(settings.baseUrl, "tabnine", endPoint);
    let response;
    try {
        response = await _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeRequest(requestUrl, init, settings);
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

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/completer */ "webpack/sharing/consume/default/@jupyterlab/completer");
/* harmony import */ var _jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_completer__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _connector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./connector */ "./lib/connector.js");
/* harmony import */ var _customconnector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./customconnector */ "./lib/customconnector.js");




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
        console.log("JupyterLab custom completer extension is activated!");
        // Modelled after completer-extension's notebooks plugin
        notebooks.widgetAdded.connect((sender, panel) => {
            var _a, _b;
            let editor = (_b = (_a = panel.content.activeCell) === null || _a === void 0 ? void 0 : _a.editor) !== null && _b !== void 0 ? _b : null;
            const session = panel.sessionContext.session;
            const options = { session, editor };
            const connector = new _connector__WEBPACK_IMPORTED_MODULE_2__.CompletionConnector([]);
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
                const custom = new _customconnector__WEBPACK_IMPORTED_MODULE_3__.CustomConnector(options);
                handler.connector = new _connector__WEBPACK_IMPORTED_MODULE_2__.CompletionConnector([
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
//# sourceMappingURL=lib_index_js.46fc7bf7d3ad46be2a94.js.map