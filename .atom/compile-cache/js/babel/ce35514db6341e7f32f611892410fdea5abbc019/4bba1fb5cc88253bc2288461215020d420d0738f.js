Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _atom = require("atom");

var _mobx = require("mobx");

var _utils = require("./../utils");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require("./../config");

var _config2 = _interopRequireDefault(_config);

var _codeManager = require("./../code-manager");

var codeManager = _interopRequireWildcard(_codeManager);

var _markers = require("./markers");

var _markers2 = _interopRequireDefault(_markers);

var _kernelManager = require("./../kernel-manager");

var _kernelManager2 = _interopRequireDefault(_kernelManager);

var _kernel = require("./../kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var commutable = require("@nteract/commutable");

var Store = (function () {
  var _instanceInitializers = {};

  function Store() {
    _classCallCheck(this, Store);

    this.subscriptions = new _atom.CompositeDisposable();

    _defineDecoratedPropertyDescriptor(this, "markersMapping", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "runningKernels", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "kernelMapping", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "startingKernels", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "editor", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "grammar", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "configMapping", _instanceInitializers);

    this.globalMode = Boolean(atom.config.get("Hydrogen.globalMode"));
  }

  _createDecoratedClass(Store, [{
    key: "newMarkerStore",
    decorators: [_mobx.action],
    value: function newMarkerStore(editorId) {
      var markerStore = new _markers2["default"]();
      this.markersMapping.set(editorId, markerStore);
      return markerStore;
    }
  }, {
    key: "startKernel",
    decorators: [_mobx.action],
    value: function startKernel(kernelDisplayName) {
      this.startingKernels.set(kernelDisplayName, true);
    }
  }, {
    key: "addFileDisposer",
    value: function addFileDisposer(editor, filePath) {
      var _this = this;

      var fileDisposer = new _atom.CompositeDisposable();

      if ((0, _utils.isUnsavedFilePath)(filePath)) {
        fileDisposer.add(editor.onDidSave(function (event) {
          fileDisposer.dispose();
          _this.addFileDisposer(editor, event.path); // Add another `fileDisposer` once it's saved
        }));
        fileDisposer.add(editor.onDidDestroy(function () {
          _this.kernelMapping["delete"](filePath);
          fileDisposer.dispose();
        }));
      } else {
        var file = new _atom.File(filePath);
        fileDisposer.add(file.onDidDelete(function () {
          _this.kernelMapping["delete"](filePath);
          fileDisposer.dispose();
        }));
      }

      this.subscriptions.add(fileDisposer);
    }
  }, {
    key: "newKernel",
    decorators: [_mobx.action],
    value: function newKernel(kernel, filePath, editor, grammar) {
      if ((0, _utils.isMultilanguageGrammar)(editor.getGrammar())) {
        if (!this.kernelMapping.has(filePath)) {
          this.kernelMapping.set(filePath, new Map());
        }
        var multiLanguageMap = this.kernelMapping.get(filePath);
        if (multiLanguageMap) multiLanguageMap.set(grammar.name, kernel);
      } else {
        this.kernelMapping.set(filePath, kernel);
      }
      this.addFileDisposer(editor, filePath);
      var index = this.runningKernels.findIndex(function (k) {
        return k === kernel;
      });
      if (index === -1) {
        this.runningKernels.push(kernel);
      }
      // delete startingKernel since store.kernel now in place to prevent duplicate kernel
      this.startingKernels["delete"](kernel.kernelSpec.display_name);
    }
  }, {
    key: "deleteKernel",
    decorators: [_mobx.action],
    value: function deleteKernel(kernel) {
      var _this2 = this;

      var grammar = kernel.grammar.name;
      var files = this.getFilesForKernel(kernel);

      files.forEach(function (file) {
        var kernelOrMap = _this2.kernelMapping.get(file);
        if (!kernelOrMap) return;
        if (kernelOrMap instanceof _kernel2["default"]) {
          _this2.kernelMapping["delete"](file);
        } else {
          kernelOrMap["delete"](grammar);
        }
      });

      this.runningKernels = this.runningKernels.filter(function (k) {
        return k !== kernel;
      });
    }
  }, {
    key: "getFilesForKernel",
    value: function getFilesForKernel(kernel) {
      var _this3 = this;

      var grammar = kernel.grammar.name;
      return this.filePaths.filter(function (file) {
        var kernelOrMap = _this3.kernelMapping.get(file);
        if (!kernelOrMap) return false;
        return kernelOrMap instanceof _kernel2["default"] ? kernelOrMap === kernel : kernelOrMap.get(grammar) === kernel;
      });
    }
  }, {
    key: "dispose",
    decorators: [_mobx.action],
    value: function dispose() {
      this.subscriptions.dispose();
      this.markersMapping.forEach(function (markerStore) {
        return markerStore.clear();
      });
      this.markersMapping.clear();
      this.runningKernels.forEach(function (kernel) {
        return kernel.destroy();
      });
      this.runningKernels = [];
      this.kernelMapping.clear();
    }
  }, {
    key: "updateEditor",
    decorators: [_mobx.action],
    value: function updateEditor(editor) {
      this.editor = editor;
      this.setGrammar(editor);

      if (this.globalMode && this.kernel && editor) {
        var fileName = editor.getPath();
        if (!fileName) return;
        this.kernelMapping.set(fileName, this.kernel);
      }
    }

    // Returns the embedded grammar for multilanguage, normal grammar otherwise
  }, {
    key: "getEmbeddedGrammar",
    value: function getEmbeddedGrammar(editor) {
      var grammar = editor.getGrammar();
      if (!(0, _utils.isMultilanguageGrammar)(grammar)) {
        return grammar;
      }

      var embeddedScope = (0, _utils.getEmbeddedScope)(editor, editor.getCursorBufferPosition());

      if (!embeddedScope) return grammar;
      var scope = embeddedScope.replace(".embedded", "");
      return atom.grammars.grammarForScopeName(scope);
    }
  }, {
    key: "setGrammar",
    decorators: [_mobx.action],
    value: function setGrammar(editor) {
      if (!editor) {
        this.grammar = null;
        return;
      }

      this.grammar = this.getEmbeddedGrammar(editor);
    }
  }, {
    key: "setConfigValue",
    decorators: [_mobx.action],
    value: function setConfigValue(keyPath, newValue) {
      if (!newValue) {
        newValue = atom.config.get(keyPath);
      }
      this.configMapping.set(keyPath, newValue);
    }

    /**
     * Force mobx to recalculate filePath (which depends on editor observable)
     */
  }, {
    key: "forceEditorUpdate",
    value: function forceEditorUpdate() {
      var currentEditor = this.editor;
      if (!currentEditor) return;

      var oldKey = this.filePath;
      // Return back if the kernel for this editor is already disposed.
      if (!oldKey || !this.kernelMapping.has(oldKey)) return;

      this.updateEditor(null);
      this.updateEditor(currentEditor);
      var newKey = this.filePath;
      if (!newKey) return;

      // Change key of kernelMapping from editor ID to file path
      this.kernelMapping.set(newKey, this.kernelMapping.get(oldKey));
      this.kernelMapping["delete"](oldKey);
    }
  }, {
    key: "markersMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "runningKernels",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: "kernelMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "startingKernels",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "editor",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return atom.workspace.getActiveTextEditor();
    },
    enumerable: true
  }, {
    key: "grammar",
    decorators: [_mobx.observable],
    initializer: null,
    enumerable: true
  }, {
    key: "configMapping",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return new Map();
    },
    enumerable: true
  }, {
    key: "kernel",
    decorators: [_mobx.computed],
    get: function get() {
      var _this4 = this;

      if (!this.grammar || !this.editor) return null;

      if (this.globalMode) {
        var _ret = (function () {
          var currentScopeName = _this4.grammar.scopeName;
          return {
            v: _this4.runningKernels.find(function (k) {
              return k.grammar.scopeName === currentScopeName;
            })
          };
        })();

        if (typeof _ret === "object") return _ret.v;
      }
      var file = this.filePath;
      if (!file) return null;
      var kernelOrMap = this.kernelMapping.get(file);
      if (!kernelOrMap) return null;
      if (kernelOrMap instanceof _kernel2["default"]) return kernelOrMap;
      return this.grammar && this.grammar.name ? kernelOrMap.get(this.grammar.name) : null;
    }
  }, {
    key: "filePath",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) return null;
      var savedFilePath = editor.getPath();
      return savedFilePath ? savedFilePath : "Unsaved Editor " + editor.id;
    }
  }, {
    key: "filePaths",
    decorators: [_mobx.computed],
    get: function get() {
      return (0, _mobx.keys)(this.kernelMapping);
    }
  }, {
    key: "notebook",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) return null;
      var notebook = commutable.emptyNotebook;
      if (this.kernel) {
        notebook = notebook.setIn(["metadata", "kernelspec"], this.kernel.transport.kernelSpec);
      }
      var cellRanges = codeManager.getCells(editor);
      _lodash2["default"].forEach(cellRanges, function (cell) {
        var start = cell.start;
        var end = cell.end;

        var source = codeManager.getTextInRange(editor, start, end);
        source = source ? source : "";
        // When the cell marker following a given cell range is on its own line,
        // the newline immediately preceding that cell marker is included in
        // `source`. We remove that here. See #1512 for more details.
        if (source.slice(-1) === "\n") source = source.slice(0, -1);
        var cellType = codeManager.getMetadataForRow(editor, start);
        var newCell = undefined;
        if (cellType === "codecell") {
          newCell = commutable.emptyCodeCell.set("source", source);
        } else if (cellType === "markdown") {
          source = codeManager.removeCommentsMarkdownCell(editor, source);
          newCell = commutable.emptyMarkdownCell.set("source", source);
        }
        notebook = commutable.appendCellToNotebook(notebook, newCell);
      });
      return commutable.toJS(notebook);
    }
  }, {
    key: "markers",
    decorators: [_mobx.computed],
    get: function get() {
      var editor = this.editor;
      if (!editor) return null;
      var markerStore = this.markersMapping.get(editor.id);
      return markerStore ? markerStore : this.newMarkerStore(editor.id);
    }
  }], null, _instanceInitializers);

  return Store;
})();

exports.Store = Store;

var store = new Store();
exports["default"] = store;

// For debugging
window.hydrogen_store = store;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zdG9yZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztvQkFFMEMsTUFBTTs7b0JBUXpDLE1BQU07O3FCQUtOLFlBQVk7O3NCQUNMLFFBQVE7Ozs7c0JBRUgsYUFBYTs7OzsyQkFDSCxtQkFBbUI7O0lBQXBDLFdBQVc7O3VCQUNDLFdBQVc7Ozs7NkJBQ1QscUJBQXFCOzs7O3NCQUM1QixhQUFhOzs7O0FBRWhDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOztJQUVyQyxLQUFLOzs7V0FBTCxLQUFLOzBCQUFMLEtBQUs7O1NBQ2hCLGFBQWEsR0FBRywrQkFBeUI7Ozs7Ozs7Ozs7Ozs7Ozs7U0FlekMsVUFBVSxHQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOzs7d0JBaEIxRCxLQUFLOzs7V0E2RkYsd0JBQUMsUUFBZ0IsRUFBRTtBQUMvQixVQUFNLFdBQVcsR0FBRywwQkFBaUIsQ0FBQztBQUN0QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDL0MsYUFBTyxXQUFXLENBQUM7S0FDcEI7Ozs7V0FHVSxxQkFBQyxpQkFBeUIsRUFBRTtBQUNyQyxVQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNuRDs7O1dBRWMseUJBQUMsTUFBdUIsRUFBRSxRQUFnQixFQUFFOzs7QUFDekQsVUFBTSxZQUFZLEdBQUcsK0JBQXlCLENBQUM7O0FBRS9DLFVBQUksOEJBQWtCLFFBQVEsQ0FBQyxFQUFFO0FBQy9CLG9CQUFZLENBQUMsR0FBRyxDQUNkLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDeEIsc0JBQVksQ0FBQyxPQUFPLEVB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T0FDL0QsQ0FBQyxDQUFDO0FBQ0gsYUFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDOzs7O1NBR1UsZUFBaUI7QUFDMUIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQ3pCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RCxhQUFPLFdBQVcsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbkU7OztTQTFGVSxLQUFLOzs7OztBQTBRbEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztxQkFDWCxLQUFLOzs7QUFHcEIsTUFBTSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRmlsZSB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQge1xuICBvYnNlcnZhYmxlLFxuICBjb21wdXRlZCxcbiAgYWN0aW9uLFxuICBpc09ic2VydmFibGVNYXAsXG4gIGtleXMsXG4gIHZhbHVlc1xufSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IHtcbiAgaXNNdWx0aWxhbmd1YWdlR3JhbW1hcixcbiAgZ2V0RW1iZWRkZWRTY29wZSxcbiAgaXNVbnNhdmVkRmlsZVBhdGhcbn0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcblxuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi8uLi9jb25maWdcIjtcbmltcG9ydCAqIGFzIGNvZGVNYW5hZ2VyIGZyb20gXCIuLy4uL2NvZGUtbWFuYWdlclwiO1xuaW1wb3J0IE1hcmtlclN0b3JlIGZyb20gXCIuL21hcmtlcnNcIjtcbmltcG9ydCBrZXJuZWxNYW5hZ2VyIGZyb20gXCIuLy4uL2tlcm5lbC1tYW5hZ2VyXCI7XG5pbXBvcnQgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuXG5jb25zdCBjb21tdXRhYmxlID0gcmVxdWlyZShcIkBudGVyYWN0L2NvbW11dGFibGVcIik7XG5cbmV4cG9ydCBjbGFzcyBTdG9yZSB7XG4gIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICBAb2JzZXJ2YWJsZVxuICBtYXJrZXJzTWFwcGluZzogTWFwPG51bWJlciwgTWFya2VyU3RvcmU+ID0gbmV3IE1hcCgpO1xuICBAb2JzZXJ2YWJsZVxuICBydW5uaW5nS2VybmVsczogQXJyYXk8S2VybmVsPiA9IFtdO1xuICBAb2JzZXJ2YWJsZVxuICBrZXJuZWxNYXBwaW5nOiBLZXJuZWxNYXBwaW5nID0gbmV3IE1hcCgpO1xuICBAb2JzZXJ2YWJsZVxuICBzdGFydGluZ0tlcm5lbHM6IE1hcDxzdHJpbmcsIGJvb2xlYW4+ID0gbmV3IE1hcCgpO1xuICBAb2JzZXJ2YWJsZVxuICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gIEBvYnNlcnZhYmxlXG4gIGdyYW1tYXI6ID9hdG9tJEdyYW1tYXI7XG4gIEBvYnNlcnZhYmxlXG4gIGNvbmZpZ01hcHBpbmc6IE1hcDxzdHJpbmcsID9taXhlZD4gPSBuZXcgTWFwKCk7XG4gIGdsb2JhbE1vZGU6IGJvb2xlYW4gPSBCb29sZWFuKGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLmdsb2JhbE1vZGVcIikpO1xuXG4gIEBjb21wdXRlZFxuICBnZXQga2VybmVsKCk6ID9LZXJuZWwge1xuICAgIGlmICghdGhpcy5ncmFtbWFyIHx8ICF0aGlzLmVkaXRvcikgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAodGhpcy5nbG9iYWxNb2RlKSB7XG4gICAgICBjb25zdCBjdXJyZW50U2NvcGVOYW1lID0gdGhpcy5ncmFtbWFyLnNjb3BlTmFtZTtcbiAgICAgIHJldHVybiB0aGlzLnJ1bm5pbmdLZXJuZWxzLmZpbmQoXG4gICAgICAgIGsgPT4gay5ncmFtbWFyLnNjb3BlTmFtZSA9PT0gY3VycmVudFNjb3BlTmFtZVxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuZmlsZVBhdGg7XG4gICAgaWYgKCFmaWxlKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBrZXJuZWxPck1hcCA9IHRoaXMua2VybmVsTWFwcGluZy5nZXQoZmlsZSk7XG4gICAgaWYgKCFrZXJuZWxPck1hcCkgcmV0dXJuIG51bGw7XG4gICAgaWYgKGtlcm5lbE9yTWFwIGluc3RhbmNlb2YgS2VybmVsKSByZXR1cm4ga2VybmVsT3JNYXA7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hciAmJiB0aGlzLmdyYW1tYXIubmFtZVxuICAgICAgPyBrZXJuZWxPck1hcC5nZXQodGhpcy5ncmFtbWFyLm5hbWUpXG4gICAgICA6IG51bGw7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IGZpbGVQYXRoKCk6ID9zdHJpbmcge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBzYXZlZEZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICByZXR1cm4gc2F2ZWRGaWxlUGF0aCA/IHNhdmVkRmlsZVBhdGggOiBgVW5zYXZlZCBFZGl0b3IgJHtlZGl0b3IuaWR9YDtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgZmlsZVBhdGhzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiBrZXlzKHRoaXMua2VybmVsTWFwcGluZyk7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IG5vdGVib29rKCkge1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgIGlmICghZWRpdG9yKSByZXR1cm4gbnVsbDtcbiAgICBsZXQgbm90ZWJvb2sgPSBjb21tdXRhYmxlLmVtcHR5Tm90ZWJvb2s7XG4gICAgaWYgKHRoaXMua2VybmVsKSB7XG4gICAgICBub3RlYm9vayA9IG5vdGVib29rLnNldEluKFxuICAgICAgICBbXCJtZXRhZGF0YVwiLCBcImtlcm5lbHNwZWNcIl0sXG4gICAgICAgIHRoaXMua2VybmVsLnRyYW5zcG9ydC5rZXJuZWxTcGVjXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBjZWxsUmFuZ2VzID0gY29kZU1hbmFnZXIuZ2V0Q2VsbHMoZWRpdG9yKTtcbiAgICBfLmZvckVhY2goY2VsbFJhbmdlcywgY2VsbCA9PiB7XG4gICAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGNlbGw7XG4gICAgICBsZXQgc291cmNlID0gY29kZU1hbmFnZXIuZ2V0VGV4dEluUmFuZ2UoZWRpdG9yLCBzdGFydCwgZW5kKTtcbiAgICAgIHNvdXJjZSA9IHNvdXJjZSA/IHNvdXJjZSA6IFwiXCI7XG4gICAgICAvLyBXaGVuIHRoZSBjZWxsIG1hcmtlciBmb2xsb3dpbmcgYSBnaXZlbiBjZWxsIHJhbmdlIGlzIG9uIGl0cyBvd24gbGluZSxcbiAgICAgIC8vIHRoZSBuZXdsaW5lIGltbWVkaWF0ZWx5IHByZWNlZGluZyB0aGF0IGNlbGwgbWFya2VyIGlzIGluY2x1ZGVkIGluXG4gICAgICAvLyBgc291cmNlYC4gV2UgcmVtb3ZlIHRoYXQgaGVyZS4gU2VlICMxNTEyIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICBpZiAoc291cmNlLnNsaWNlKC0xKSA9PT0gXCJcXG5cIikgc291cmNlID0gc291cmNlLnNsaWNlKDAsIC0xKTtcbiAgICAgIGNvbnN0IGNlbGxUeXBlID0gY29kZU1hbmFnZXIuZ2V0TWV0YWRhdGFGb3JSb3coZWRpdG9yLCBzdGFydCk7XG4gICAgICBsZXQgbmV3Q2VsbDtcbiAgICAgIGlmIChjZWxsVHlwZSA9PT0gXCJjb2RlY2VsbFwiKSB7XG4gICAgICAgIG5ld0NlbGwgPSBjb21tdXRhYmxlLmVtcHR5Q29kZUNlbGwuc2V0KFwic291cmNlXCIsIHNvdXJjZSk7XG4gICAgICB9IGVsc2UgaWYgKGNlbGxUeXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICAgICAgc291cmNlID0gY29kZU1hbmFnZXIucmVtb3ZlQ29tbWVudHNNYXJrZG93bkNlbGwoZWRpdG9yLCBzb3VyY2UpO1xuICAgICAgICBuZXdDZWxsID0gY29tbXV0YWJsZS5lbXB0eU1hcmtkb3duQ2VsbC5zZXQoXCJzb3VyY2VcIiwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIG5vdGVib29rID0gY29tbXV0YWJsZS5hcHBlbmRDZWxsVG9Ob3RlYm9vayhub3RlYm9vaywgbmV3Q2VsbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvbW11dGFibGUudG9KUyhub3RlYm9vayk7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IG1hcmtlcnMoKTogP01hcmtlclN0b3JlIHtcbiAgICBjb25zdCBlZGl0b3IgPSB0aGlzLmVkaXRvcjtcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgbWFya2VyU3RvcmUgPSB0aGlzLm1hcmtlcnNNYXBwaW5nLmdldChlZGl0b3IuaWQpO1xuICAgIHJldHVybiBtYXJrZXJTdG9yZSA/IG1hcmtlclN0b3JlIDogdGhpcy5uZXdNYXJrZXJTdG9yZShlZGl0b3IuaWQpO1xuICB9XG5cbiAgQGFjdGlvblxuICBuZXdNYXJrZXJTdG9yZShlZGl0b3JJZDogbnVtYmVyKSB7XG4gICAgY29uc3QgbWFya2VyU3RvcmUgPSBuZXcgTWFya2VyU3RvcmUoKTtcbiAgICB0aGlzLm1hcmtlcnNNYXBwaW5nLnNldChlZGl0b3JJZCwgbWFya2VyU3RvcmUpO1xuICAgIHJldHVybiBtYXJrZXJTdG9yZTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgc3RhcnRLZXJuZWwoa2VybmVsRGlzcGxheU5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuc3RhcnRpbmdLZXJuZWxzLnNldChrZXJuZWxEaXNwbGF5TmFtZSwgdHJ1ZSk7XG4gIH1cblxuICBhZGRGaWxlRGlzcG9zZXIoZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBmaWxlRGlzcG9zZXIgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgaWYgKGlzVW5zYXZlZEZpbGVQYXRoKGZpbGVQYXRoKSkge1xuICAgICAgZmlsZURpc3Bvc2VyLmFkZChcbiAgICAgICAgZWRpdG9yLm9uRGlkU2F2ZShldmVudCA9PiB7XG4gICAgICAgICAgZmlsZURpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICAgICAgICB0aGlzLmFkZEZpbGVEaXNwb3NlcihlZGl0b3IsIGV2ZW50LnBhdGgpOyAvLyBBZGQgYW5vdGhlciBgZmlsZURpc3Bvc2VyYCBvbmNlIGl0J3Mgc2F2ZWRcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgICBmaWxlRGlzcG9zZXIuYWRkKFxuICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmtlcm5lbE1hcHBpbmcuZGVsZXRlKGZpbGVQYXRoKTtcbiAgICAgICAgICBmaWxlRGlzcG9zZXIuZGlzcG9zZSgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmlsZTogYXRvbSRGaWxlID0gbmV3IEZpbGUoZmlsZVBhdGgpO1xuICAgICAgZmlsZURpc3Bvc2VyLmFkZChcbiAgICAgICAgZmlsZS5vbkRpZERlbGV0ZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5rZXJuZWxNYXBwaW5nLmRlbGV0ZShmaWxlUGF0aCk7XG4gICAgICAgICAgZmlsZURpc3Bvc2VyLmRpc3Bvc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChmaWxlRGlzcG9zZXIpO1xuICB9XG5cbiAgQGFjdGlvblxuICBuZXdLZXJuZWwoXG4gICAga2VybmVsOiBLZXJuZWwsXG4gICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXJcbiAgKSB7XG4gICAgaWYgKGlzTXVsdGlsYW5ndWFnZUdyYW1tYXIoZWRpdG9yLmdldEdyYW1tYXIoKSkpIHtcbiAgICAgIGlmICghdGhpcy5rZXJuZWxNYXBwaW5nLmhhcyhmaWxlUGF0aCkpIHtcbiAgICAgICAgdGhpcy5rZXJuZWxNYXBwaW5nLnNldChmaWxlUGF0aCwgbmV3IE1hcCgpKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG11bHRpTGFuZ3VhZ2VNYXAgPSB0aGlzLmtlcm5lbE1hcHBpbmcuZ2V0KGZpbGVQYXRoKTtcbiAgICAgIGlmIChtdWx0aUxhbmd1YWdlTWFwKSBtdWx0aUxhbmd1YWdlTWFwLnNldChncmFtbWFyLm5hbWUsIGtlcm5lbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMua2VybmVsTWFwcGluZy5zZXQoZmlsZVBhdGgsIGtlcm5lbCk7XG4gICAgfVxuICAgIHRoaXMuYWRkRmlsZURpc3Bvc2VyKGVkaXRvciwgZmlsZVBhdGgpO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5ydW5uaW5nS2VybmVscy5maW5kSW5kZXgoayA9PiBrID09PSBrZXJuZWwpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRoaXMucnVubmluZ0tlcm5lbHMucHVzaChrZXJuZWwpO1xuICAgIH1cbiAgICAvLyBkZWxldGUgc3RhcnRpbmdLZXJuZWwgc2luY2Ugc3RvcmUua2VybmVsIG5vdyBpbiBwbGFjZSB0byBwcmV2ZW50IGR1cGxpY2F0ZSBrZXJuZWxcbiAgICB0aGlzLnN0YXJ0aW5nS2VybmVscy5kZWxldGUoa2VybmVsLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgZGVsZXRlS2VybmVsKGtlcm5lbDogS2VybmVsKSB7XG4gICAgY29uc3QgZ3JhbW1hciA9IGtlcm5lbC5ncmFtbWFyLm5hbWU7XG4gICAgY29uc3QgZmlsZXMgPSB0aGlzLmdldEZpbGVzRm9yS2VybmVsKGtlcm5lbCk7XG5cbiAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgY29uc3Qga2VybmVsT3JNYXAgPSB0aGlzLmtlcm5lbE1hcHBpbmcuZ2V0KGZpbGUpO1xuICAgICAgaWYgKCFrZXJuZWxPck1hcCkgcmV0dXJuO1xuICAgICAgaWYgKGtlcm5lbE9yTWFwIGluc3RhbmNlb2YgS2VybmVsKSB7XG4gICAgICAgIHRoaXMua2VybmVsTWFwcGluZy5kZWxldGUoZmlsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXJuZWxPck1hcC5kZWxldGUoZ3JhbW1hcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnJ1bm5pbmdLZXJuZWxzID0gdGhpcy5ydW5uaW5nS2VybmVscy5maWx0ZXIoayA9PiBrICE9PSBrZXJuZWwpO1xuICB9XG5cbiAgZ2V0RmlsZXNGb3JLZXJuZWwoa2VybmVsOiBLZXJuZWwpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBjb25zdCBncmFtbWFyID0ga2VybmVsLmdyYW1tYXIubmFtZTtcbiAgICByZXR1cm4gdGhpcy5maWxlUGF0aHMuZmlsdGVyKGZpbGUgPT4ge1xuICAgICAgY29uc3Qga2VybmVsT3JNYXAgPSB0aGlzLmtlcm5lbE1hcHBpbmcuZ2V0KGZpbGUpO1xuICAgICAgaWYgKCFrZXJuZWxPck1hcCkgcmV0dXJuIGZhbHNlO1xuICAgICAgcmV0dXJuIGtlcm5lbE9yTWFwIGluc3RhbmNlb2YgS2VybmVsXG4gICAgICAgID8ga2VybmVsT3JNYXAgPT09IGtlcm5lbFxuICAgICAgICA6IGtlcm5lbE9yTWFwLmdldChncmFtbWFyKSA9PT0ga2VybmVsO1xuICAgIH0pO1xuICB9XG5cbiAgQGFjdGlvblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5tYXJrZXJzTWFwcGluZy5mb3JFYWNoKG1hcmtlclN0b3JlID0+IG1hcmtlclN0b3JlLmNsZWFyKCkpO1xuICAgIHRoaXMubWFya2Vyc01hcHBpbmcuY2xlYXIoKTtcbiAgICB0aGlzLnJ1bm5pbmdLZXJuZWxzLmZvckVhY2goa2VybmVsID0+IGtlcm5lbC5kZXN0cm95KCkpO1xuICAgIHRoaXMucnVubmluZ0tlcm5lbHMgPSBbXTtcbiAgICB0aGlzLmtlcm5lbE1hcHBpbmcuY2xlYXIoKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgdXBkYXRlRWRpdG9yKGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuc2V0R3JhbW1hcihlZGl0b3IpO1xuXG4gICAgaWYgKHRoaXMuZ2xvYmFsTW9kZSAmJiB0aGlzLmtlcm5lbCAmJiBlZGl0b3IpIHtcbiAgICAgIGNvbnN0IGZpbGVOYW1lID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgIGlmICghZmlsZU5hbWUpIHJldHVybjtcbiAgICAgIHRoaXMua2VybmVsTWFwcGluZy5zZXQoZmlsZU5hbWUsIHRoaXMua2VybmVsKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBlbWJlZGRlZCBncmFtbWFyIGZvciBtdWx0aWxhbmd1YWdlLCBub3JtYWwgZ3JhbW1hciBvdGhlcndpc2VcbiAgZ2V0RW1iZWRkZWRHcmFtbWFyKGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yKTogP2F0b20kR3JhbW1hciB7XG4gICAgY29uc3QgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCk7XG4gICAgaWYgKCFpc011bHRpbGFuZ3VhZ2VHcmFtbWFyKGdyYW1tYXIpKSB7XG4gICAgICByZXR1cm4gZ3JhbW1hcjtcbiAgICB9XG5cbiAgICBjb25zdCBlbWJlZGRlZFNjb3BlID0gZ2V0RW1iZWRkZWRTY29wZShcbiAgICAgIGVkaXRvcixcbiAgICAgIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgKTtcblxuICAgIGlmICghZW1iZWRkZWRTY29wZSkgcmV0dXJuIGdyYW1tYXI7XG4gICAgY29uc3Qgc2NvcGUgPSBlbWJlZGRlZFNjb3BlLnJlcGxhY2UoXCIuZW1iZWRkZWRcIiwgXCJcIik7XG4gICAgcmV0dXJuIGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZShzY29wZSk7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldEdyYW1tYXIoZWRpdG9yOiA/YXRvbSRUZXh0RWRpdG9yKSB7XG4gICAgaWYgKCFlZGl0b3IpIHtcbiAgICAgIHRoaXMuZ3JhbW1hciA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ncmFtbWFyID0gdGhpcy5nZXRFbWJlZGRlZEdyYW1tYXIoZWRpdG9yKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgc2V0Q29uZmlnVmFsdWUoa2V5UGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogP21peGVkKSB7XG4gICAgaWYgKCFuZXdWYWx1ZSkge1xuICAgICAgbmV3VmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQoa2V5UGF0aCk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlnTWFwcGluZy5zZXQoa2V5UGF0aCwgbmV3VmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcmNlIG1vYnggdG8gcmVjYWxjdWxhdGUgZmlsZVBhdGggKHdoaWNoIGRlcGVuZHMgb24gZWRpdG9yIG9ic2VydmFibGUpXG4gICAqL1xuICBmb3JjZUVkaXRvclVwZGF0ZSgpIHtcbiAgICBjb25zdCBjdXJyZW50RWRpdG9yID0gdGhpcy5lZGl0b3I7XG4gICAgaWYgKCFjdXJyZW50RWRpdG9yKSByZXR1cm47XG5cbiAgICBjb25zdCBvbGRLZXkgPSB0aGlzLmZpbGVQYXRoO1xuICAgIC8vIFJldHVybiBiYWNrIGlmIHRoZSBrZXJuZWwgZm9yIHRoaXMgZWRpdG9yIGlzIGFscmVhZHkgZGlzcG9zZWQuXG4gICAgaWYgKCFvbGRLZXkgfHwgIXRoaXMua2VybmVsTWFwcGluZy5oYXMob2xkS2V5KSkgcmV0dXJuO1xuXG4gICAgdGhpcy51cGRhdGVFZGl0b3IobnVsbCk7XG4gICAgdGhpcy51cGRhdGVFZGl0b3IoY3VycmVudEVkaXRvcik7XG4gICAgY29uc3QgbmV3S2V5ID0gdGhpcy5maWxlUGF0aDtcbiAgICBpZiAoIW5ld0tleSkgcmV0dXJuO1xuXG4gICAgLy8gQ2hhbmdlIGtleSBvZiBrZXJuZWxNYXBwaW5nIGZyb20gZWRpdG9yIElEIHRvIGZpbGUgcGF0aFxuICAgIHRoaXMua2VybmVsTWFwcGluZy5zZXQobmV3S2V5LCB0aGlzLmtlcm5lbE1hcHBpbmcuZ2V0KG9sZEtleSkpO1xuICAgIHRoaXMua2VybmVsTWFwcGluZy5kZWxldGUob2xkS2V5KTtcbiAgfVxufVxuXG5jb25zdCBzdG9yZSA9IG5ldyBTdG9yZSgpO1xuZXhwb3J0IGRlZmF1bHQgc3RvcmU7XG5cbi8vIEZvciBkZWJ1Z2dpbmdcbndpbmRvdy5oeWRyb2dlbl9zdG9yZSA9IHN0b3JlO1xuIl19