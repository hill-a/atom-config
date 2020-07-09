Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require("atom");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _mobx = require("mobx");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _panesInspector = require("./panes/inspector");

var _panesInspector2 = _interopRequireDefault(_panesInspector);

var _panesWatches = require("./panes/watches");

var _panesWatches2 = _interopRequireDefault(_panesWatches);

var _panesOutputArea = require("./panes/output-area");

var _panesOutputArea2 = _interopRequireDefault(_panesOutputArea);

var _panesKernelMonitor = require("./panes/kernel-monitor");

var _panesKernelMonitor2 = _interopRequireDefault(_panesKernelMonitor);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _zmqKernel = require("./zmq-kernel");

var _zmqKernel2 = _interopRequireDefault(_zmqKernel);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _kernel = require("./kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _kernelPicker = require("./kernel-picker");

var _kernelPicker2 = _interopRequireDefault(_kernelPicker);

var _wsKernelPicker = require("./ws-kernel-picker");

var _wsKernelPicker2 = _interopRequireDefault(_wsKernelPicker);

var _existingKernelPicker = require("./existing-kernel-picker");

var _existingKernelPicker2 = _interopRequireDefault(_existingKernelPicker);

var _pluginApiHydrogenProvider = require("./plugin-api/hydrogen-provider");

var _pluginApiHydrogenProvider2 = _interopRequireDefault(_pluginApiHydrogenProvider);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _kernelManager = require("./kernel-manager");

var _kernelManager2 = _interopRequireDefault(_kernelManager);

var _services = require("./services");

var _services2 = _interopRequireDefault(_services);

var _commands = require("./commands");

var commands = _interopRequireWildcard(_commands);

var _codeManager = require("./code-manager");

var codeManager = _interopRequireWildcard(_codeManager);

var _result = require("./result");

var result = _interopRequireWildcard(_result);

var _utils = require("./utils");

var _exportNotebook = require("./export-notebook");

var _exportNotebook2 = _interopRequireDefault(_exportNotebook);

var _importNotebook = require("./import-notebook");

var Hydrogen = {
  config: _config2["default"].schema,

  activate: function activate() {
    var _this = this;

    this.emitter = new _atom.Emitter();

    var skipLanguageMappingsChange = false;
    _store2["default"].subscriptions.add(atom.config.onDidChange("Hydrogen.languageMappings", function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      if (skipLanguageMappingsChange) {
        skipLanguageMappingsChange = false;
        return;
      }

      if (_store2["default"].runningKernels.length != 0) {
        skipLanguageMappingsChange = true;

        atom.config.set("Hydrogen.languageMappings", oldValue);

        atom.notifications.addError("Hydrogen", {
          description: "`languageMappings` cannot be updated while kernels are running",
          dismissable: false
        });
      }
    }));

    _store2["default"].subscriptions.add(
    // enable/disable mobx-react-devtools logging
    atom.config.onDidChange("Hydrogen.debug", function (_ref2) {
      var newValue = _ref2.newValue;
      return (0, _utils.renderDevTools)(newValue);
    }));

    _store2["default"].subscriptions.add(atom.config.observe("Hydrogen.statusBarDisable", function (newValue) {
      _store2["default"].setConfigValue("Hydrogen.statusBarDisable", Boolean(newValue));
    }));

    _store2["default"].subscriptions.add(atom.commands.add("atom-text-editor:not([mini])", {
      "hydrogen:run": function hydrogenRun() {
        return _this.run();
      },
      "hydrogen:run-all": function hydrogenRunAll() {
        return _this.runAll();
      },
      "hydrogen:run-all-above": function hydrogenRunAllAbove() {
        return _this.runAllAbove();
      },
      "hydrogen:run-and-move-down": function hydrogenRunAndMoveDown() {
        return _this.run(true);
      },
      "hydrogen:run-cell": function hydrogenRunCell() {
        return _this.runCell();
      },
      "hydrogen:run-cell-and-move-down": function hydrogenRunCellAndMoveDown() {
        return _this.runCell(true);
      },
      "hydrogen:toggle-watches": function hydrogenToggleWatches() {
        return atom.workspace.toggle(_utils.WATCHES_URI);
      },
      "hydrogen:toggle-output-area": function hydrogenToggleOutputArea() {
        return commands.toggleOutputMode();
      },
      "hydrogen:toggle-kernel-monitor": _asyncToGenerator(function* () {
        var lastItem = atom.workspace.getActivePaneItem();
        var lastPane = atom.workspace.paneForItem(lastItem);
        yield atom.workspace.toggle(_utils.KERNEL_MONITOR_URI);
        if (lastPane) lastPane.activate();
      }),
      "hydrogen:start-local-kernel": function hydrogenStartLocalKernel() {
        return _this.startZMQKernel();
      },
      "hydrogen:connect-to-remote-kernel": function hydrogenConnectToRemoteKernel() {
        return _this.connectToWSKernel();
      },
      "hydrogen:connect-to-existing-kernel": function hydrogenConnectToExistingKernel() {
        return _this.connectToExistingKernel();
      },
      "hydrogen:add-watch": function hydrogenAddWatch() {
        if (_store2["default"].kernel) {
          _store2["default"].kernel.watchesStore.addWatchFromEditor(_store2["default"].editor);
          (0, _utils.openOrShowDock)(_utils.WATCHES_URI);
        }
      },
      "hydrogen:remove-watch": function hydrogenRemoveWatch() {
        if (_store2["default"].kernel) {
          _store2["default"].kernel.watchesStore.removeWatch();
          (0, _utils.openOrShowDock)(_utils.WATCHES_URI);
        }
      },
      "hydrogen:update-kernels": function hydrogenUpdateKernels() {
        return _kernelManager2["default"].updateKernelSpecs();
      },
      "hydrogen:toggle-inspector": function hydrogenToggleInspector() {
        return commands.toggleInspector(_store2["default"]);
      },
      "hydrogen:interrupt-kernel": function hydrogenInterruptKernel() {
        return _this.handleKernelCommand({ command: "interrupt-kernel" }, _store2["default"]);
      },
      "hydrogen:restart-kernel": function hydrogenRestartKernel() {
        return _this.handleKernelCommand({ command: "restart-kernel" }, _store2["default"]);
      },
      "hydrogen:shutdown-kernel": function hydrogenShutdownKernel() {
        return _this.handleKernelCommand({ command: "shutdown-kernel" }, _store2["default"]);
      },
      "hydrogen:clear-result": function hydrogenClearResult() {
        return result.clearResult(_store2["default"]);
      },
      "hydrogen:export-notebook": function hydrogenExportNotebook() {
        return (0, _exportNotebook2["default"])();
      },
      "hydrogen:fold-current-cell": function hydrogenFoldCurrentCell() {
        return _this.foldCurrentCell();
      },
      "hydrogen:fold-all-but-current-cell": function hydrogenFoldAllButCurrentCell() {
        return _this.foldAllButCurrentCell();
      },
      "hydrogen:clear-results": function hydrogenClearResults() {
        return result.clearResults(_store2["default"]);
      }
    }));

    _store2["default"].subscriptions.add(atom.commands.add("atom-workspace", {
      "hydrogen:import-notebook": _importNotebook.importNotebook
    }));

    if (atom.inDevMode()) {
      _store2["default"].subscriptions.add(atom.commands.add("atom-workspace", {
        "hydrogen:hot-reload-package": function hydrogenHotReloadPackage() {
          return (0, _utils.hotReloadPackage)();
        }
      }));
    }

    _store2["default"].subscriptions.add(atom.workspace.observeActiveTextEditor(function (editor) {
      _store2["default"].updateEditor(editor);
    }));

    _store2["default"].subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      var editorSubscriptions = new _atom.CompositeDisposable();
      editorSubscriptions.add(editor.onDidChangeGrammar(function () {
        _store2["default"].setGrammar(editor);
      }));

      if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
        editorSubscriptions.add(editor.onDidChangeCursorPosition(_lodash2["default"].debounce(function () {
          _store2["default"].setGrammar(editor);
        }, 75)));
      }

      editorSubscriptions.add(editor.onDidDestroy(function () {
        editorSubscriptions.dispose();
      }));

      editorSubscriptions.add(editor.onDidChangeTitle(function (newTitle) {
        return _store2["default"].forceEditorUpdate();
      }));

      _store2["default"].subscriptions.add(editorSubscriptions);
    }));

    this.hydrogenProvider = null;

    _store2["default"].subscriptions.add(atom.workspace.addOpener(function (uri) {
      switch (uri) {
        case _utils.INSPECTOR_URI:
          return new _panesInspector2["default"](_store2["default"]);
        case _utils.WATCHES_URI:
          return new _panesWatches2["default"](_store2["default"]);
        case _utils.OUTPUT_AREA_URI:
          return new _panesOutputArea2["default"](_store2["default"]);
        case _utils.KERNEL_MONITOR_URI:
          return new _panesKernelMonitor2["default"](_store2["default"]);
      }
    }));
    _store2["default"].subscriptions.add(atom.workspace.addOpener(_importNotebook.ipynbOpener));

    _store2["default"].subscriptions.add(
    // Destroy any Panes when the package is deactivated.
    new _atom.Disposable(function () {
      atom.workspace.getPaneItems().forEach(function (item) {
        if (item instanceof _panesInspector2["default"] || item instanceof _panesWatches2["default"] || item instanceof _panesOutputArea2["default"] || item instanceof _panesKernelMonitor2["default"]) {
          item.destroy();
        }
      });
    }));

    (0, _utils.renderDevTools)(atom.config.get("Hydrogen.debug") === true);

    (0, _mobx.autorun)(function () {
      _this.emitter.emit("did-change-kernel", _store2["default"].kernel);
    });
  },

  deactivate: function deactivate() {
    _store2["default"].dispose();
  },

  /*-------------- Service Providers --------------*/
  provideHydrogen: function provideHydrogen() {
    if (!this.hydrogenProvider) {
      this.hydrogenProvider = new _pluginApiHydrogenProvider2["default"](this);
    }

    return this.hydrogenProvider;
  },

  provideAutocompleteResults: function provideAutocompleteResults() {
    return _services2["default"].provided.autocomplete.provideAutocompleteResults(_store2["default"]);
  },
  /*-----------------------------------------------*/

  /*-------------- Service Consumers --------------*/
  consumeAutocompleteWatchEditor: function consumeAutocompleteWatchEditor(watchEditor) {
    return _services2["default"].consumed.autocomplete.consume(_store2["default"], watchEditor);
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    return _services2["default"].consumed.statusBar.addStatusBar(_store2["default"], statusBar, this.handleKernelCommand.bind(this));
  },
  /*-----------------------------------------------*/

  connectToExistingKernel: function connectToExistingKernel() {
    if (!this.existingKernelPicker) {
      this.existingKernelPicker = new _existingKernelPicker2["default"]();
    }
    this.existingKernelPicker.toggle();
  },

  handleKernelCommand: function handleKernelCommand(_ref3, _ref4) {
    var command = _ref3.command;
    var payload = _ref3.payload;
    var kernel = _ref4.kernel;
    var markers = _ref4.markers;
    return (function () {
      (0, _utils.log)("handleKernelCommand:", arguments);

      if (!kernel) {
        var message = "No running kernel for grammar or editor found";
        atom.notifications.addError(message);
        return;
      }

      if (command === "interrupt-kernel") {
        kernel.interrupt();
      } else if (command === "restart-kernel") {
        kernel.restart();
      } else if (command === "shutdown-kernel") {
        if (markers) markers.clear();
        // Note that destroy alone does not shut down a WSKernel
        kernel.shutdown();
        kernel.destroy();
      } else if (command === "rename-kernel" && kernel.transport instanceof _wsKernel2["default"]) {
        kernel.transport.promptRename();
      } else if (command === "disconnect-kernel") {
        if (markers) markers.clear();
        kernel.destroy();
      }
    }).apply(this, arguments);
  },

  run: function run() {
    var moveDown = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var editor = _store2["default"].editor;
    if (!editor) return;
    // https://github.com/nteract/hydrogen/issues/1452
    atom.commands.dispatch(editor.element, "autocomplete-plus:cancel");
    var codeBlock = codeManager.findCodeBlock(editor);
    if (!codeBlock) {
      return;
    }

    var codeNullable = codeBlock.code;
    if (codeNullable === null) return;

    var row = codeBlock.row;

    var cellType = codeManager.getMetadataForRow(editor, new _atom.Point(row, 0));

    var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

    if (moveDown === true) {
      codeManager.moveDown(editor, row);
    }

    this.checkForKernel(_store2["default"], function (kernel) {
      result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
    });
  },

  runAll: function runAll(breakpoints) {
    var _this2 = this;

    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var grammar = _store2["default"].grammar;
    var filePath = _store2["default"].filePath;

    if (!editor || !grammar || !filePath) return;
    if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
      atom.notifications.addError('"Run All" is not supported for this file type!');
      return;
    }

    if (editor && kernel) {
      this._runAll(editor, kernel, breakpoints);
      return;
    }

    _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (kernel) {
      _this2._runAll(editor, kernel, breakpoints);
    });
  },

  _runAll: function _runAll(editor, kernel, breakpoints) {
    var _this3 = this;

    var cells = codeManager.getCells(editor, breakpoints);

    var _loop = function (cell) {
      var start = cell.start;
      var end = cell.end;

      var codeNullable = codeManager.getTextInRange(editor, start, end);
      if (codeNullable === null) return "continue";

      var row = codeManager.escapeBlankRows(editor, start.row, end.row == editor.getLastBufferRow() ? end.row : end.row - 1);
      var cellType = codeManager.getMetadataForRow(editor, start);

      var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

      _this3.checkForKernel(_store2["default"], function (kernel) {
        result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
      });
    };

    for (var cell of cells) {
      var _ret = _loop(cell);

      if (_ret === "continue") continue;
    }
  },

  runAllAbove: function runAllAbove() {
    var _this4 = this;

    var editor = _store2["default"].editor;
    var kernel = _store2["default"].kernel;
    var grammar = _store2["default"].grammar;
    var filePath = _store2["default"].filePath;

    if (!editor || !grammar || !filePath) return;
    if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
      atom.notifications.addError('"Run All Above" is not supported for this file type!');
      return;
    }

    if (editor && kernel) {
      this._runAllAbove(editor, kernel);
      return;
    }

    _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (kernel) {
      _this4._runAllAbove(editor, kernel);
    });
  },

  _runAllAbove: function _runAllAbove(editor, kernel) {
    var _this5 = this;

    var cursor = editor.getCursorBufferPosition();
    cursor.column = editor.getBuffer().lineLengthForRow(cursor.row);
    var breakpoints = codeManager.getBreakpoints(editor);
    breakpoints.push(cursor);
    var cells = codeManager.getCells(editor, breakpoints);

    var _loop2 = function (cell) {
      var start = cell.start;
      var end = cell.end;

      var codeNullable = codeManager.getTextInRange(editor, start, end);

      var row = codeManager.escapeBlankRows(editor, start.row, end.row == editor.getLastBufferRow() ? end.row : end.row - 1);
      var cellType = codeManager.getMetadataForRow(editor, start);

      if (codeNullable !== null) {
        (function () {
          var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

          _this5.checkForKernel(_store2["default"], function (kernel) {
            result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
          });
        })();
      }

      if (cell.containsPoint(cursor)) {
        return "break";
      }
    };

    for (var cell of cells) {
      var _ret2 = _loop2(cell);

      if (_ret2 === "break") break;
    }
  },

  runCell: function runCell() {
    var moveDown = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var editor = _store2["default"].editor;
    if (!editor) return;
    // https://github.com/nteract/hydrogen/issues/1452
    atom.commands.dispatch(editor.element, "autocomplete-plus:cancel");

    var _codeManager$getCurrentCell = codeManager.getCurrentCell(editor);

    var start = _codeManager$getCurrentCell.start;
    var end = _codeManager$getCurrentCell.end;

    var codeNullable = codeManager.getTextInRange(editor, start, end);
    if (codeNullable === null) return;

    var row = codeManager.escapeBlankRows(editor, start.row, end.row == editor.getLastBufferRow() ? end.row : end.row - 1);
    var cellType = codeManager.getMetadataForRow(editor, start);

    var code = cellType === "markdown" ? codeManager.removeCommentsMarkdownCell(editor, codeNullable) : codeNullable;

    if (moveDown === true) {
      codeManager.moveDown(editor, row);
    }

    this.checkForKernel(_store2["default"], function (kernel) {
      result.createResult(_store2["default"], { code: code, row: row, cellType: cellType });
    });
  },

  foldCurrentCell: function foldCurrentCell() {
    var editor = _store2["default"].editor;
    if (!editor) return;
    codeManager.foldCurrentCell(editor);
  },

  foldAllButCurrentCell: function foldAllButCurrentCell() {
    var editor = _store2["default"].editor;
    if (!editor) return;
    codeManager.foldAllButCurrentCell(editor);
  },

  startZMQKernel: function startZMQKernel() {
    var _this6 = this;

    _kernelManager2["default"].getAllKernelSpecsForGrammar(_store2["default"].grammar).then(function (kernelSpecs) {
      if (_this6.kernelPicker) {
        _this6.kernelPicker.kernelSpecs = kernelSpecs;
      } else {
        _this6.kernelPicker = new _kernelPicker2["default"](kernelSpecs);

        _this6.kernelPicker.onConfirmed = function (kernelSpec) {
          var editor = _store2["default"].editor;
          var grammar = _store2["default"].grammar;
          var filePath = _store2["default"].filePath;
          var markers = _store2["default"].markers;

          if (!editor || !grammar || !filePath || !markers) return;
          markers.clear();

          _kernelManager2["default"].startKernel(kernelSpec, grammar, editor, filePath);
        };
      }

      _this6.kernelPicker.toggle();
    });
  },

  connectToWSKernel: function connectToWSKernel() {
    if (!this.wsKernelPicker) {
      this.wsKernelPicker = new _wsKernelPicker2["default"](function (transport) {
        var kernel = new _kernel2["default"](transport);
        var editor = _store2["default"].editor;
        var grammar = _store2["default"].grammar;
        var filePath = _store2["default"].filePath;
        var markers = _store2["default"].markers;

        if (!editor || !grammar || !filePath || !markers) return;
        markers.clear();

        if (kernel.transport instanceof _zmqKernel2["default"]) kernel.destroy();

        _store2["default"].newKernel(kernel, filePath, editor, grammar);
      });
    }

    this.wsKernelPicker.toggle(function (kernelSpec) {
      return (0, _utils.kernelSpecProvidesGrammar)(kernelSpec, _store2["default"].grammar);
    });
  },

  // Accepts store as an arg
  checkForKernel: function checkForKernel(_ref5, callback) {
    var editor = _ref5.editor;
    var grammar = _ref5.grammar;
    var filePath = _ref5.filePath;
    var kernel = _ref5.kernel;
    return (function () {
      if (!filePath || !grammar) {
        return atom.notifications.addError("The language grammar must be set in order to start a kernel. The easiest way to do this is to save the file.");
      }

      if (kernel) {
        callback(kernel);
        return;
      }

      _kernelManager2["default"].startKernelFor(grammar, editor, filePath, function (newKernel) {
        return callback(newKernel);
      });
    })();
  }
};

exports["default"] = Hydrogen;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBUU8sTUFBTTs7c0JBRUMsUUFBUTs7OztvQkFDRSxNQUFNOztxQkFDWixPQUFPOzs7OzhCQUVDLG1CQUFtQjs7Ozs0QkFDckIsaUJBQWlCOzs7OytCQUNsQixxQkFBcUI7Ozs7a0NBQ2Qsd0JBQXdCOzs7O3NCQUNuQyxVQUFVOzs7O3lCQUNQLGNBQWM7Ozs7d0JBQ2YsYUFBYTs7OztzQkFDZixVQUFVOzs7OzRCQUNKLGlCQUFpQjs7Ozs4QkFDZixvQkFBb0I7Ozs7b0NBQ2QsMEJBQTBCOzs7O3lDQUM5QixnQ0FBZ0M7Ozs7cUJBRTNDLFNBQVM7Ozs7NkJBQ0Qsa0JBQWtCOzs7O3dCQUN2QixZQUFZOzs7O3dCQUNQLFlBQVk7O0lBQTFCLFFBQVE7OzJCQUNTLGdCQUFnQjs7SUFBakMsV0FBVzs7c0JBQ0MsVUFBVTs7SUFBdEIsTUFBTTs7cUJBZ0JYLFNBQVM7OzhCQUVXLG1CQUFtQjs7Ozs4QkFDRixtQkFBbUI7O0FBRS9ELElBQU0sUUFBUSxHQUFHO0FBQ2YsUUFBTSxFQUFFLG9CQUFPLE1BQU07O0FBRXJCLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDOztBQUU3QixRQUFJLDBCQUEwQixHQUFHLEtBQUssQ0FBQztBQUN2Qyx1QkFBTSxhQUFhLENBQUMsR0FBRyxDQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDckIsMkJBQTJCLEVBQzNCLFVBQUMsSUFBc0IsRUFBSztVQUF6QixRQUFRLEdBQVYsSUFBc0IsQ0FBcEIsUUFBUTtVQUFFLFFBQVEsR0FBcEIsSUFBc0IsQ0FBVixRQUFROztBQUNuQixVQUFJLDBCQUEwQixFQUFFO0FBQzlCLGtDQUEwQixHQUFHLEtBQUssQ0FBQztBQUNuQyxlQUFPO09BQ1I7O0FBRUQsVUFBSSxtQkFBTSxj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UCxNQUFNLEVBQ04sUUFBUSxFQUNSLFVBQUMsU0FBUztlQUFhLFFBQVEsQ0FBQyxTQUFTLENBQUM7T0FBQSxDQUMzQyxDQUFDO0tBQ0g7R0FBQTtDQUNGLENBQUM7O3FCQUVhLFFBQVEiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQge1xuICBFbWl0dGVyLFxuICBDb21wb3NpdGVEaXNwb3NhYmxlLFxuICBEaXNwb3NhYmxlLFxuICBQb2ludCxcbiAgVGV4dEVkaXRvclxufSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBhdXRvcnVuIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW1wb3J0IEluc3BlY3RvclBhbmUgZnJvbSBcIi4vcGFuZXMvaW5zcGVjdG9yXCI7XG5pbXBvcnQgV2F0Y2hlc1BhbmUgZnJvbSBcIi4vcGFuZXMvd2F0Y2hlc1wiO1xuaW1wb3J0IE91dHB1dFBhbmUgZnJvbSBcIi4vcGFuZXMvb3V0cHV0LWFyZWFcIjtcbmltcG9ydCBLZXJuZWxNb25pdG9yUGFuZSBmcm9tIFwiLi9wYW5lcy9rZXJuZWwtbW9uaXRvclwiO1xuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCBaTVFLZXJuZWwgZnJvbSBcIi4vem1xLWtlcm5lbFwiO1xuaW1wb3J0IFdTS2VybmVsIGZyb20gXCIuL3dzLWtlcm5lbFwiO1xuaW1wb3J0IEtlcm5lbCBmcm9tIFwiLi9rZXJuZWxcIjtcbmltcG9ydCBLZXJuZWxQaWNrZXIgZnJvbSBcIi4va2VybmVsLXBpY2tlclwiO1xuaW1wb3J0IFdTS2VybmVsUGlja2VyIGZyb20gXCIuL3dzLWtlcm5lbC1waWNrZXJcIjtcbmltcG9ydCBFeGlzdGluZ0tlcm5lbFBpY2tlciBmcm9tIFwiLi9leGlzdGluZy1rZXJuZWwtcGlja2VyXCI7XG5pbXBvcnQgSHlkcm9nZW5Qcm92aWRlciBmcm9tIFwiLi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLXByb3ZpZGVyXCI7XG5cbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuaW1wb3J0IGtlcm5lbE1hbmFnZXIgZnJvbSBcIi4va2VybmVsLW1hbmFnZXJcIjtcbmltcG9ydCBzZXJ2aWNlcyBmcm9tIFwiLi9zZXJ2aWNlc1wiO1xuaW1wb3J0ICogYXMgY29tbWFuZHMgZnJvbSBcIi4vY29tbWFuZHNcIjtcbmltcG9ydCAqIGFzIGNvZGVNYW5hZ2VyIGZyb20gXCIuL2NvZGUtbWFuYWdlclwiO1xuaW1wb3J0ICogYXMgcmVzdWx0IGZyb20gXCIuL3Jlc3VsdFwiO1xuXG5pbXBvcnQgdHlwZSBNYXJrZXJTdG9yZSBmcm9tIFwiLi9zdG9yZS9tYXJrZXJzXCI7XG5cbmltcG9ydCB7XG4gIGxvZyxcbiAgcmVhY3RGYWN0b3J5LFxuICBpc011bHRpbGFuZ3VhZ2VHcmFtbWFyLFxuICByZW5kZXJEZXZUb29scyxcbiAgSU5TUEVDVE9SX1VSSSxcbiAgV0FUQ0hFU19VUkksXG4gIE9VVFBVVF9BUkVBX1VSSSxcbiAgS0VSTkVMX01PTklUT1JfVVJJLFxuICBob3RSZWxvYWRQYWNrYWdlLFxuICBvcGVuT3JTaG93RG9jayxcbiAga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hclxufSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgZXhwb3J0Tm90ZWJvb2sgZnJvbSBcIi4vZXhwb3J0LW5vdGVib29rXCI7XG5pbXBvcnQgeyBpbXBvcnROb3RlYm9vaywgaXB5bmJPcGVuZXIgfSBmcm9tIFwiLi9pbXBvcnQtbm90ZWJvb2tcIjtcblxuY29uc3QgSHlkcm9nZW4gPSB7XG4gIGNvbmZpZzogQ29uZmlnLnNjaGVtYSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgbGV0IHNraXBMYW5ndWFnZU1hcHBpbmdzQ2hhbmdlID0gZmFsc2U7XG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcbiAgICAgICAgXCJIeWRyb2dlbi5sYW5ndWFnZU1hcHBpbmdzXCIsXG4gICAgICAgICh7IG5ld1ZhbHVlLCBvbGRWYWx1ZSB9KSA9PiB7XG4gICAgICAgICAgaWYgKHNraXBMYW5ndWFnZU1hcHBpbmdzQ2hhbmdlKSB7XG4gICAgICAgICAgICBza2lwTGFuZ3VhZ2VNYXBwaW5nc0NoYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzdG9yZS5ydW5uaW5nS2VybmVscy5sZW5ndGggIT0gMCkge1xuICAgICAgICAgICAgc2tpcExhbmd1YWdlTWFwcGluZ3NDaGFuZ2UgPSB0cnVlO1xuXG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJIeWRyb2dlbi5sYW5ndWFnZU1hcHBpbmdzXCIsIG9sZFZhbHVlKTtcblxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiSHlkcm9nZW5cIiwge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgICBcImBsYW5ndWFnZU1hcHBpbmdzYCBjYW5ub3QgYmUgdXBkYXRlZCB3aGlsZSBrZXJuZWxzIGFyZSBydW5uaW5nXCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgKTtcblxuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgLy8gZW5hYmxlL2Rpc2FibGUgbW9ieC1yZWFjdC1kZXZ0b29scyBsb2dnaW5nXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcIkh5ZHJvZ2VuLmRlYnVnXCIsICh7IG5ld1ZhbHVlIH0pID0+XG4gICAgICAgIHJlbmRlckRldlRvb2xzKG5ld1ZhbHVlKVxuICAgICAgKVxuICAgICk7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoXCJIeWRyb2dlbi5zdGF0dXNCYXJEaXNhYmxlXCIsIG5ld1ZhbHVlID0+IHtcbiAgICAgICAgc3RvcmUuc2V0Q29uZmlnVmFsdWUoXCJIeWRyb2dlbi5zdGF0dXNCYXJEaXNhYmxlXCIsIEJvb2xlYW4obmV3VmFsdWUpKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pXCIsIHtcbiAgICAgICAgXCJoeWRyb2dlbjpydW5cIjogKCkgPT4gdGhpcy5ydW4oKSxcbiAgICAgICAgXCJoeWRyb2dlbjpydW4tYWxsXCI6ICgpID0+IHRoaXMucnVuQWxsKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWFsbC1hYm92ZVwiOiAoKSA9PiB0aGlzLnJ1bkFsbEFib3ZlKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWFuZC1tb3ZlLWRvd25cIjogKCkgPT4gdGhpcy5ydW4odHJ1ZSksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWNlbGxcIjogKCkgPT4gdGhpcy5ydW5DZWxsKCksXG4gICAgICAgIFwiaHlkcm9nZW46cnVuLWNlbGwtYW5kLW1vdmUtZG93blwiOiAoKSA9PiB0aGlzLnJ1bkNlbGwodHJ1ZSksXG4gICAgICAgIFwiaHlkcm9nZW46dG9nZ2xlLXdhdGNoZXNcIjogKCkgPT4gYXRvbS53b3Jrc3BhY2UudG9nZ2xlKFdBVENIRVNfVVJJKSxcbiAgICAgICAgXCJoeWRyb2dlbjp0b2dnbGUtb3V0cHV0LWFyZWFcIjogKCkgPT4gY29tbWFuZHMudG9nZ2xlT3V0cHV0TW9kZSgpLFxuICAgICAgICBcImh5ZHJvZ2VuOnRvZ2dsZS1rZXJuZWwtbW9uaXRvclwiOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGFzdEl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuICAgICAgICAgIGNvbnN0IGxhc3RQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0obGFzdEl0ZW0pO1xuICAgICAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLnRvZ2dsZShLRVJORUxfTU9OSVRPUl9VUkkpO1xuICAgICAgICAgIGlmIChsYXN0UGFuZSkgbGFzdFBhbmUuYWN0aXZhdGUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJoeWRyb2dlbjpzdGFydC1sb2NhbC1rZXJuZWxcIjogKCkgPT4gdGhpcy5zdGFydFpNUUtlcm5lbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmNvbm5lY3QtdG8tcmVtb3RlLWtlcm5lbFwiOiAoKSA9PiB0aGlzLmNvbm5lY3RUb1dTS2VybmVsKCksXG4gICAgICAgIFwiaHlkcm9nZW46Y29ubmVjdC10by1leGlzdGluZy1rZXJuZWxcIjogKCkgPT5cbiAgICAgICAgICB0aGlzLmNvbm5lY3RUb0V4aXN0aW5nS2VybmVsKCksXG4gICAgICAgIFwiaHlkcm9nZW46YWRkLXdhdGNoXCI6ICgpID0+IHtcbiAgICAgICAgICBpZiAoc3RvcmUua2VybmVsKSB7XG4gICAgICAgICAgICBzdG9yZS5rZXJuZWwud2F0Y2hlc1N0b3JlLmFkZFdhdGNoRnJvbUVkaXRvcihzdG9yZS5lZGl0b3IpO1xuICAgICAgICAgICAgb3Blbk9yU2hvd0RvY2soV0FUQ0hFU19VUkkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoeWRyb2dlbjpyZW1vdmUtd2F0Y2hcIjogKCkgPT4ge1xuICAgICAgICAgIGlmIChzdG9yZS5rZXJuZWwpIHtcbiAgICAgICAgICAgIHN0b3JlLmtlcm5lbC53YXRjaGVzU3RvcmUucmVtb3ZlV2F0Y2goKTtcbiAgICAgICAgICAgIG9wZW5PclNob3dEb2NrKFdBVENIRVNfVVJJKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaHlkcm9nZW46dXBkYXRlLWtlcm5lbHNcIjogKCkgPT4ga2VybmVsTWFuYWdlci51cGRhdGVLZXJuZWxTcGVjcygpLFxuICAgICAgICBcImh5ZHJvZ2VuOnRvZ2dsZS1pbnNwZWN0b3JcIjogKCkgPT4gY29tbWFuZHMudG9nZ2xlSW5zcGVjdG9yKHN0b3JlKSxcbiAgICAgICAgXCJoeWRyb2dlbjppbnRlcnJ1cHQta2VybmVsXCI6ICgpID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kKHsgY29tbWFuZDogXCJpbnRlcnJ1cHQta2VybmVsXCIgfSwgc3RvcmUpLFxuICAgICAgICBcImh5ZHJvZ2VuOnJlc3RhcnQta2VybmVsXCI6ICgpID0+XG4gICAgICAgICAgdGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kKHsgY29tbWFuZDogXCJyZXN0YXJ0LWtlcm5lbFwiIH0sIHN0b3JlKSxcbiAgICAgICAgXCJoeWRyb2dlbjpzaHV0ZG93bi1rZXJuZWxcIjogKCkgPT5cbiAgICAgICAgICB0aGlzLmhhbmRsZUtlcm5lbENvbW1hbmQoeyBjb21tYW5kOiBcInNodXRkb3duLWtlcm5lbFwiIH0sIHN0b3JlKSxcbiAgICAgICAgXCJoeWRyb2dlbjpjbGVhci1yZXN1bHRcIjogKCkgPT4gcmVzdWx0LmNsZWFyUmVzdWx0KHN0b3JlKSxcbiAgICAgICAgXCJoeWRyb2dlbjpleHBvcnQtbm90ZWJvb2tcIjogKCkgPT4gZXhwb3J0Tm90ZWJvb2soKSxcbiAgICAgICAgXCJoeWRyb2dlbjpmb2xkLWN1cnJlbnQtY2VsbFwiOiAoKSA9PiB0aGlzLmZvbGRDdXJyZW50Q2VsbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmZvbGQtYWxsLWJ1dC1jdXJyZW50LWNlbGxcIjogKCkgPT5cbiAgICAgICAgICB0aGlzLmZvbGRBbGxCdXRDdXJyZW50Q2VsbCgpLFxuICAgICAgICBcImh5ZHJvZ2VuOmNsZWFyLXJlc3VsdHNcIjogKCkgPT4gcmVzdWx0LmNsZWFyUmVzdWx0cyhzdG9yZSlcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCB7XG4gICAgICAgIFwiaHlkcm9nZW46aW1wb3J0LW5vdGVib29rXCI6IGltcG9ydE5vdGVib29rXG4gICAgICB9KVxuICAgICk7XG5cbiAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwge1xuICAgICAgICAgIFwiaHlkcm9nZW46aG90LXJlbG9hZC1wYWNrYWdlXCI6ICgpID0+IGhvdFJlbG9hZFBhY2thZ2UoKVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVUZXh0RWRpdG9yKGVkaXRvciA9PiB7XG4gICAgICAgIHN0b3JlLnVwZGF0ZUVkaXRvcihlZGl0b3IpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgICAgY29uc3QgZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoKCkgPT4ge1xuICAgICAgICAgICAgc3RvcmUuc2V0R3JhbW1hcihlZGl0b3IpO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKFxuICAgICAgICAgICAgICBfLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzdG9yZS5zZXRHcmFtbWFyKGVkaXRvcik7XG4gICAgICAgICAgICAgIH0sIDc1KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICAgIGVkaXRvclN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG5cbiAgICAgICAgZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlVGl0bGUobmV3VGl0bGUgPT4gc3RvcmUuZm9yY2VFZGl0b3JVcGRhdGUoKSlcbiAgICAgICAgKTtcblxuICAgICAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JTdWJzY3JpcHRpb25zKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuaHlkcm9nZW5Qcm92aWRlciA9IG51bGw7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcih1cmkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHVyaSkge1xuICAgICAgICAgIGNhc2UgSU5TUEVDVE9SX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgSW5zcGVjdG9yUGFuZShzdG9yZSk7XG4gICAgICAgICAgY2FzZSBXQVRDSEVTX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgV2F0Y2hlc1BhbmUoc3RvcmUpO1xuICAgICAgICAgIGNhc2UgT1VUUFVUX0FSRUFfVVJJOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBPdXRwdXRQYW5lKHN0b3JlKTtcbiAgICAgICAgICBjYXNlIEtFUk5FTF9NT05JVE9SX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgS2VybmVsTW9uaXRvclBhbmUoc3RvcmUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgc3RvcmUuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKGlweW5iT3BlbmVyKSk7XG5cbiAgICBzdG9yZS5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIC8vIERlc3Ryb3kgYW55IFBhbmVzIHdoZW4gdGhlIHBhY2thZ2UgaXMgZGVhY3RpdmF0ZWQuXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIEluc3BlY3RvclBhbmUgfHxcbiAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBXYXRjaGVzUGFuZSB8fFxuICAgICAgICAgICAgaXRlbSBpbnN0YW5jZW9mIE91dHB1dFBhbmUgfHxcbiAgICAgICAgICAgIGl0ZW0gaW5zdGFuY2VvZiBLZXJuZWxNb25pdG9yUGFuZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaXRlbS5kZXN0cm95KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJlbmRlckRldlRvb2xzKGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLmRlYnVnXCIpID09PSB0cnVlKTtcblxuICAgIGF1dG9ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtY2hhbmdlLWtlcm5lbFwiLCBzdG9yZS5rZXJuZWwpO1xuICAgIH0pO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgc3RvcmUuZGlzcG9zZSgpO1xuICB9LFxuXG4gIC8qLS0tLS0tLS0tLS0tLS0gU2VydmljZSBQcm92aWRlcnMgLS0tLS0tLS0tLS0tLS0qL1xuICBwcm92aWRlSHlkcm9nZW4oKSB7XG4gICAgaWYgKCF0aGlzLmh5ZHJvZ2VuUHJvdmlkZXIpIHtcbiAgICAgIHRoaXMuaHlkcm9nZW5Qcm92aWRlciA9IG5ldyBIeWRyb2dlblByb3ZpZGVyKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmh5ZHJvZ2VuUHJvdmlkZXI7XG4gIH0sXG5cbiAgcHJvdmlkZUF1dG9jb21wbGV0ZVJlc3VsdHMoKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VzLnByb3ZpZGVkLmF1dG9jb21wbGV0ZS5wcm92aWRlQXV0b2NvbXBsZXRlUmVzdWx0cyhzdG9yZSk7XG4gIH0sXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0gU2VydmljZSBDb25zdW1lcnMgLS0tLS0tLS0tLS0tLS0qL1xuICBjb25zdW1lQXV0b2NvbXBsZXRlV2F0Y2hFZGl0b3Iod2F0Y2hFZGl0b3I6IEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VzLmNvbnN1bWVkLmF1dG9jb21wbGV0ZS5jb25zdW1lKHN0b3JlLCB3YXRjaEVkaXRvcik7XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXI6IGF0b20kU3RhdHVzQmFyKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VzLmNvbnN1bWVkLnN0YXR1c0Jhci5hZGRTdGF0dXNCYXIoXG4gICAgICBzdG9yZSxcbiAgICAgIHN0YXR1c0JhcixcbiAgICAgIHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZC5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfSxcbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgY29ubmVjdFRvRXhpc3RpbmdLZXJuZWwoKSB7XG4gICAgaWYgKCF0aGlzLmV4aXN0aW5nS2VybmVsUGlja2VyKSB7XG4gICAgICB0aGlzLmV4aXN0aW5nS2VybmVsUGlja2VyID0gbmV3IEV4aXN0aW5nS2VybmVsUGlja2VyKCk7XG4gICAgfVxuICAgIHRoaXMuZXhpc3RpbmdLZXJuZWxQaWNrZXIudG9nZ2xlKCk7XG4gIH0sXG5cbiAgaGFuZGxlS2VybmVsQ29tbWFuZChcbiAgICB7IGNvbW1hbmQsIHBheWxvYWQgfTogeyBjb21tYW5kOiBzdHJpbmcsIHBheWxvYWQ6ID9LZXJuZWxzcGVjIH0sXG4gICAgeyBrZXJuZWwsIG1hcmtlcnMgfTogeyBrZXJuZWw6ID9LZXJuZWwsIG1hcmtlcnM6ID9NYXJrZXJTdG9yZSB9XG4gICkge1xuICAgIGxvZyhcImhhbmRsZUtlcm5lbENvbW1hbmQ6XCIsIGFyZ3VtZW50cyk7XG5cbiAgICBpZiAoIWtlcm5lbCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IFwiTm8gcnVubmluZyBrZXJuZWwgZm9yIGdyYW1tYXIgb3IgZWRpdG9yIGZvdW5kXCI7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbW1hbmQgPT09IFwiaW50ZXJydXB0LWtlcm5lbFwiKSB7XG4gICAgICBrZXJuZWwuaW50ZXJydXB0KCk7XG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcInJlc3RhcnQta2VybmVsXCIpIHtcbiAgICAgIGtlcm5lbC5yZXN0YXJ0KCk7XG4gICAgfSBlbHNlIGlmIChjb21tYW5kID09PSBcInNodXRkb3duLWtlcm5lbFwiKSB7XG4gICAgICBpZiAobWFya2VycykgbWFya2Vycy5jbGVhcigpO1xuICAgICAgLy8gTm90ZSB0aGF0IGRlc3Ryb3kgYWxvbmUgZG9lcyBub3Qgc2h1dCBkb3duIGEgV1NLZXJuZWxcbiAgICAgIGtlcm5lbC5zaHV0ZG93bigpO1xuICAgICAga2VybmVsLmRlc3Ryb3koKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY29tbWFuZCA9PT0gXCJyZW5hbWUta2VybmVsXCIgJiZcbiAgICAgIGtlcm5lbC50cmFuc3BvcnQgaW5zdGFuY2VvZiBXU0tlcm5lbFxuICAgICkge1xuICAgICAga2VybmVsLnRyYW5zcG9ydC5wcm9tcHRSZW5hbWUoKTtcbiAgICB9IGVsc2UgaWYgKGNvbW1hbmQgPT09IFwiZGlzY29ubmVjdC1rZXJuZWxcIikge1xuICAgICAgaWYgKG1hcmtlcnMpIG1hcmtlcnMuY2xlYXIoKTtcbiAgICAgIGtlcm5lbC5kZXN0cm95KCk7XG4gICAgfVxuICB9LFxuXG4gIHJ1bihtb3ZlRG93bjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZWRpdG9yID0gc3RvcmUuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL250ZXJhY3QvaHlkcm9nZW4vaXNzdWVzLzE0NTJcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvci5lbGVtZW50LCBcImF1dG9jb21wbGV0ZS1wbHVzOmNhbmNlbFwiKTtcbiAgICBjb25zdCBjb2RlQmxvY2sgPSBjb2RlTWFuYWdlci5maW5kQ29kZUJsb2NrKGVkaXRvcik7XG4gICAgaWYgKCFjb2RlQmxvY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2RlTnVsbGFibGUgPSBjb2RlQmxvY2suY29kZTtcbiAgICBpZiAoY29kZU51bGxhYmxlID09PSBudWxsKSByZXR1cm47XG5cbiAgICBjb25zdCB7IHJvdyB9ID0gY29kZUJsb2NrO1xuICAgIGNvbnN0IGNlbGxUeXBlID0gY29kZU1hbmFnZXIuZ2V0TWV0YWRhdGFGb3JSb3coZWRpdG9yLCBuZXcgUG9pbnQocm93LCAwKSk7XG5cbiAgICBjb25zdCBjb2RlID1cbiAgICAgIGNlbGxUeXBlID09PSBcIm1hcmtkb3duXCJcbiAgICAgICAgPyBjb2RlTWFuYWdlci5yZW1vdmVDb21tZW50c01hcmtkb3duQ2VsbChlZGl0b3IsIGNvZGVOdWxsYWJsZSlcbiAgICAgICAgOiBjb2RlTnVsbGFibGU7XG5cbiAgICBpZiAobW92ZURvd24gPT09IHRydWUpIHtcbiAgICAgIGNvZGVNYW5hZ2VyLm1vdmVEb3duKGVkaXRvciwgcm93KTtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrRm9yS2VybmVsKHN0b3JlLCBrZXJuZWwgPT4ge1xuICAgICAgcmVzdWx0LmNyZWF0ZVJlc3VsdChzdG9yZSwgeyBjb2RlLCByb3csIGNlbGxUeXBlIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIHJ1bkFsbChicmVha3BvaW50czogP0FycmF5PGF0b20kUG9pbnQ+KSB7XG4gICAgY29uc3QgeyBlZGl0b3IsIGtlcm5lbCwgZ3JhbW1hciwgZmlsZVBhdGggfSA9IHN0b3JlO1xuICAgIGlmICghZWRpdG9yIHx8ICFncmFtbWFyIHx8ICFmaWxlUGF0aCkgcmV0dXJuO1xuICAgIGlmIChpc011bHRpbGFuZ3VhZ2VHcmFtbWFyKGVkaXRvci5nZXRHcmFtbWFyKCkpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgICdcIlJ1biBBbGxcIiBpcyBub3Qgc3VwcG9ydGVkIGZvciB0aGlzIGZpbGUgdHlwZSEnXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlZGl0b3IgJiYga2VybmVsKSB7XG4gICAgICB0aGlzLl9ydW5BbGwoZWRpdG9yLCBrZXJuZWwsIGJyZWFrcG9pbnRzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBrZXJuZWxNYW5hZ2VyLnN0YXJ0S2VybmVsRm9yKFxuICAgICAgZ3JhbW1hcixcbiAgICAgIGVkaXRvcixcbiAgICAgIGZpbGVQYXRoLFxuICAgICAgKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3J1bkFsbChlZGl0b3IsIGtlcm5lbCwgYnJlYWtwb2ludHMpO1xuICAgICAgfVxuICAgICk7XG4gIH0sXG5cbiAgX3J1bkFsbChcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBrZXJuZWw6IEtlcm5lbCxcbiAgICBicmVha3BvaW50cz86IEFycmF5PGF0b20kUG9pbnQ+XG4gICkge1xuICAgIGxldCBjZWxscyA9IGNvZGVNYW5hZ2VyLmdldENlbGxzKGVkaXRvciwgYnJlYWtwb2ludHMpO1xuICAgIGZvciAoY29uc3QgY2VsbCBvZiBjZWxscykge1xuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBjZWxsO1xuICAgICAgY29uc3QgY29kZU51bGxhYmxlID0gY29kZU1hbmFnZXIuZ2V0VGV4dEluUmFuZ2UoZWRpdG9yLCBzdGFydCwgZW5kKTtcbiAgICAgIGlmIChjb2RlTnVsbGFibGUgPT09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCByb3cgPSBjb2RlTWFuYWdlci5lc2NhcGVCbGFua1Jvd3MoXG4gICAgICAgIGVkaXRvcixcbiAgICAgICAgc3RhcnQucm93LFxuICAgICAgICBlbmQucm93ID09IGVkaXRvci5nZXRMYXN0QnVmZmVyUm93KCkgPyBlbmQucm93IDogZW5kLnJvdyAtIDFcbiAgICAgICk7XG4gICAgICBjb25zdCBjZWxsVHlwZSA9IGNvZGVNYW5hZ2VyLmdldE1ldGFkYXRhRm9yUm93KGVkaXRvciwgc3RhcnQpO1xuXG4gICAgICBjb25zdCBjb2RlID1cbiAgICAgICAgY2VsbFR5cGUgPT09IFwibWFya2Rvd25cIlxuICAgICAgICAgID8gY29kZU1hbmFnZXIucmVtb3ZlQ29tbWVudHNNYXJrZG93bkNlbGwoZWRpdG9yLCBjb2RlTnVsbGFibGUpXG4gICAgICAgICAgOiBjb2RlTnVsbGFibGU7XG5cbiAgICAgIHRoaXMuY2hlY2tGb3JLZXJuZWwoc3RvcmUsIGtlcm5lbCA9PiB7XG4gICAgICAgIHJlc3VsdC5jcmVhdGVSZXN1bHQoc3RvcmUsIHsgY29kZSwgcm93LCBjZWxsVHlwZSB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBydW5BbGxBYm92ZSgpIHtcbiAgICBjb25zdCB7IGVkaXRvciwga2VybmVsLCBncmFtbWFyLCBmaWxlUGF0aCB9ID0gc3RvcmU7XG4gICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoKSByZXR1cm47XG4gICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgJ1wiUnVuIEFsbCBBYm92ZVwiIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHRoaXMgZmlsZSB0eXBlISdcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGVkaXRvciAmJiBrZXJuZWwpIHtcbiAgICAgIHRoaXMuX3J1bkFsbEFib3ZlKGVkaXRvciwga2VybmVsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBrZXJuZWxNYW5hZ2VyLnN0YXJ0S2VybmVsRm9yKFxuICAgICAgZ3JhbW1hcixcbiAgICAgIGVkaXRvcixcbiAgICAgIGZpbGVQYXRoLFxuICAgICAgKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gICAgICAgIHRoaXMuX3J1bkFsbEFib3ZlKGVkaXRvciwga2VybmVsKTtcbiAgICAgIH1cbiAgICApO1xuICB9LFxuXG4gIF9ydW5BbGxBYm92ZShlZGl0b3I6IGF0b20kVGV4dEVkaXRvciwga2VybmVsOiBLZXJuZWwpIHtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcbiAgICBjdXJzb3IuY29sdW1uID0gZWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVMZW5ndGhGb3JSb3coY3Vyc29yLnJvdyk7XG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSBjb2RlTWFuYWdlci5nZXRCcmVha3BvaW50cyhlZGl0b3IpO1xuICAgIGJyZWFrcG9pbnRzLnB1c2goY3Vyc29yKTtcbiAgICBjb25zdCBjZWxscyA9IGNvZGVNYW5hZ2VyLmdldENlbGxzKGVkaXRvciwgYnJlYWtwb2ludHMpO1xuICAgIGZvciAoY29uc3QgY2VsbCBvZiBjZWxscykge1xuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSBjZWxsO1xuICAgICAgY29uc3QgY29kZU51bGxhYmxlID0gY29kZU1hbmFnZXIuZ2V0VGV4dEluUmFuZ2UoZWRpdG9yLCBzdGFydCwgZW5kKTtcblxuICAgICAgY29uc3Qgcm93ID0gY29kZU1hbmFnZXIuZXNjYXBlQmxhbmtSb3dzKFxuICAgICAgICBlZGl0b3IsXG4gICAgICAgIHN0YXJ0LnJvdyxcbiAgICAgICAgZW5kLnJvdyA9PSBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpID8gZW5kLnJvdyA6IGVuZC5yb3cgLSAxXG4gICAgICApO1xuICAgICAgY29uc3QgY2VsbFR5cGUgPSBjb2RlTWFuYWdlci5nZXRNZXRhZGF0YUZvclJvdyhlZGl0b3IsIHN0YXJ0KTtcblxuICAgICAgaWYgKGNvZGVOdWxsYWJsZSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjb2RlID1cbiAgICAgICAgICBjZWxsVHlwZSA9PT0gXCJtYXJrZG93blwiXG4gICAgICAgICAgICA/IGNvZGVNYW5hZ2VyLnJlbW92ZUNvbW1lbnRzTWFya2Rvd25DZWxsKGVkaXRvciwgY29kZU51bGxhYmxlKVxuICAgICAgICAgICAgOiBjb2RlTnVsbGFibGU7XG5cbiAgICAgICAgdGhpcy5jaGVja0Zvcktlcm5lbChzdG9yZSwga2VybmVsID0+IHtcbiAgICAgICAgICByZXN1bHQuY3JlYXRlUmVzdWx0KHN0b3JlLCB7IGNvZGUsIHJvdywgY2VsbFR5cGUgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2VsbC5jb250YWluc1BvaW50KGN1cnNvcikpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHJ1bkNlbGwobW92ZURvd246IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGVkaXRvciA9IHN0b3JlLmVkaXRvcjtcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L2h5ZHJvZ2VuL2lzc3Vlcy8xNDUyXG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3IuZWxlbWVudCwgXCJhdXRvY29tcGxldGUtcGx1czpjYW5jZWxcIik7XG5cbiAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGNvZGVNYW5hZ2VyLmdldEN1cnJlbnRDZWxsKGVkaXRvcik7XG4gICAgY29uc3QgY29kZU51bGxhYmxlID0gY29kZU1hbmFnZXIuZ2V0VGV4dEluUmFuZ2UoZWRpdG9yLCBzdGFydCwgZW5kKTtcbiAgICBpZiAoY29kZU51bGxhYmxlID09PSBudWxsKSByZXR1cm47XG5cbiAgICBjb25zdCByb3cgPSBjb2RlTWFuYWdlci5lc2NhcGVCbGFua1Jvd3MoXG4gICAgICBlZGl0b3IsXG4gICAgICBzdGFydC5yb3csXG4gICAgICBlbmQucm93ID09IGVkaXRvci5nZXRMYXN0QnVmZmVyUm93KCkgPyBlbmQucm93IDogZW5kLnJvdyAtIDFcbiAgICApO1xuICAgIGNvbnN0IGNlbGxUeXBlID0gY29kZU1hbmFnZXIuZ2V0TWV0YWRhdGFGb3JSb3coZWRpdG9yLCBzdGFydCk7XG5cbiAgICBjb25zdCBjb2RlID1cbiAgICAgIGNlbGxUeXBlID09PSBcIm1hcmtkb3duXCJcbiAgICAgICAgPyBjb2RlTWFuYWdlci5yZW1vdmVDb21tZW50c01hcmtkb3duQ2VsbChlZGl0b3IsIGNvZGVOdWxsYWJsZSlcbiAgICAgICAgOiBjb2RlTnVsbGFibGU7XG5cbiAgICBpZiAobW92ZURvd24gPT09IHRydWUpIHtcbiAgICAgIGNvZGVNYW5hZ2VyLm1vdmVEb3duKGVkaXRvciwgcm93KTtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrRm9yS2VybmVsKHN0b3JlLCBrZXJuZWwgPT4ge1xuICAgICAgcmVzdWx0LmNyZWF0ZVJlc3VsdChzdG9yZSwgeyBjb2RlLCByb3csIGNlbGxUeXBlIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIGZvbGRDdXJyZW50Q2VsbCgpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBzdG9yZS5lZGl0b3I7XG4gICAgaWYgKCFlZGl0b3IpIHJldHVybjtcbiAgICBjb2RlTWFuYWdlci5mb2xkQ3VycmVudENlbGwoZWRpdG9yKTtcbiAgfSxcblxuICBmb2xkQWxsQnV0Q3VycmVudENlbGwoKSB7XG4gICAgY29uc3QgZWRpdG9yID0gc3RvcmUuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgY29kZU1hbmFnZXIuZm9sZEFsbEJ1dEN1cnJlbnRDZWxsKGVkaXRvcik7XG4gIH0sXG5cbiAgc3RhcnRaTVFLZXJuZWwoKSB7XG4gICAga2VybmVsTWFuYWdlclxuICAgICAgLmdldEFsbEtlcm5lbFNwZWNzRm9yR3JhbW1hcihzdG9yZS5ncmFtbWFyKVxuICAgICAgLnRoZW4oa2VybmVsU3BlY3MgPT4ge1xuICAgICAgICBpZiAodGhpcy5rZXJuZWxQaWNrZXIpIHtcbiAgICAgICAgICB0aGlzLmtlcm5lbFBpY2tlci5rZXJuZWxTcGVjcyA9IGtlcm5lbFNwZWNzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMua2VybmVsUGlja2VyID0gbmV3IEtlcm5lbFBpY2tlcihrZXJuZWxTcGVjcyk7XG5cbiAgICAgICAgICB0aGlzLmtlcm5lbFBpY2tlci5vbkNvbmZpcm1lZCA9IChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGVkaXRvciwgZ3JhbW1hciwgZmlsZVBhdGgsIG1hcmtlcnMgfSA9IHN0b3JlO1xuICAgICAgICAgICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoIHx8ICFtYXJrZXJzKSByZXR1cm47XG4gICAgICAgICAgICBtYXJrZXJzLmNsZWFyKCk7XG5cbiAgICAgICAgICAgIGtlcm5lbE1hbmFnZXIuc3RhcnRLZXJuZWwoa2VybmVsU3BlYywgZ3JhbW1hciwgZWRpdG9yLCBmaWxlUGF0aCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMua2VybmVsUGlja2VyLnRvZ2dsZSgpO1xuICAgICAgfSk7XG4gIH0sXG5cbiAgY29ubmVjdFRvV1NLZXJuZWwoKSB7XG4gICAgaWYgKCF0aGlzLndzS2VybmVsUGlja2VyKSB7XG4gICAgICB0aGlzLndzS2VybmVsUGlja2VyID0gbmV3IFdTS2VybmVsUGlja2VyKCh0cmFuc3BvcnQ6IFdTS2VybmVsKSA9PiB7XG4gICAgICAgIGNvbnN0IGtlcm5lbCA9IG5ldyBLZXJuZWwodHJhbnNwb3J0KTtcbiAgICAgICAgY29uc3QgeyBlZGl0b3IsIGdyYW1tYXIsIGZpbGVQYXRoLCBtYXJrZXJzIH0gPSBzdG9yZTtcbiAgICAgICAgaWYgKCFlZGl0b3IgfHwgIWdyYW1tYXIgfHwgIWZpbGVQYXRoIHx8ICFtYXJrZXJzKSByZXR1cm47XG4gICAgICAgIG1hcmtlcnMuY2xlYXIoKTtcblxuICAgICAgICBpZiAoa2VybmVsLnRyYW5zcG9ydCBpbnN0YW5jZW9mIFpNUUtlcm5lbCkga2VybmVsLmRlc3Ryb3koKTtcblxuICAgICAgICBzdG9yZS5uZXdLZXJuZWwoa2VybmVsLCBmaWxlUGF0aCwgZWRpdG9yLCBncmFtbWFyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMud3NLZXJuZWxQaWNrZXIudG9nZ2xlKChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PlxuICAgICAga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hcihrZXJuZWxTcGVjLCBzdG9yZS5ncmFtbWFyKVxuICAgICk7XG4gIH0sXG5cbiAgLy8gQWNjZXB0cyBzdG9yZSBhcyBhbiBhcmdcbiAgY2hlY2tGb3JLZXJuZWwoXG4gICAge1xuICAgICAgZWRpdG9yLFxuICAgICAgZ3JhbW1hcixcbiAgICAgIGZpbGVQYXRoLFxuICAgICAga2VybmVsXG4gICAgfToge1xuICAgICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXIsXG4gICAgICBmaWxlUGF0aDogc3RyaW5nLFxuICAgICAga2VybmVsPzogS2VybmVsXG4gICAgfSxcbiAgICBjYWxsYmFjazogKGtlcm5lbDogS2VybmVsKSA9PiB2b2lkXG4gICkge1xuICAgIGlmICghZmlsZVBhdGggfHwgIWdyYW1tYXIpIHtcbiAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgIFwiVGhlIGxhbmd1YWdlIGdyYW1tYXIgbXVzdCBiZSBzZXQgaW4gb3JkZXIgdG8gc3RhcnQgYSBrZXJuZWwuIFRoZSBlYXNpZXN0IHdheSB0byBkbyB0aGlzIGlzIHRvIHNhdmUgdGhlIGZpbGUuXCJcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGtlcm5lbCkge1xuICAgICAgY2FsbGJhY2soa2VybmVsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBrZXJuZWxNYW5hZ2VyLnN0YXJ0S2VybmVsRm9yKFxuICAgICAgZ3JhbW1hcixcbiAgICAgIGVkaXRvcixcbiAgICAgIGZpbGVQYXRoLFxuICAgICAgKG5ld0tlcm5lbDogS2VybmVsKSA9PiBjYWxsYmFjayhuZXdLZXJuZWwpXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgSHlkcm9nZW47XG4iXX0=