Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _kernelspecs = require("kernelspecs");

var kernelspecs = _interopRequireWildcard(_kernelspecs);

var _electron = require("electron");

var _zmqKernel = require("./zmq-kernel");

var _zmqKernel2 = _interopRequireDefault(_zmqKernel);

var _kernel = require("./kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _kernelPicker = require("./kernel-picker");

var _kernelPicker2 = _interopRequireDefault(_kernelPicker);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _utils = require("./utils");

var ks = kernelspecs;

exports.ks = ks;

var KernelManager = (function () {
  function KernelManager() {
    _classCallCheck(this, KernelManager);

    this.kernelSpecs = null;
  }

  _createClass(KernelManager, [{
    key: "startKernelFor",
    value: function startKernelFor(grammar, editor, filePath, onStarted) {
      var _this = this;

      this.getKernelSpecForGrammar(grammar).then(function (kernelSpec) {
        if (!kernelSpec) {
          var message = "No kernel for grammar `" + grammar.name + "` found";
          var pythonDescription = grammar && /python/g.test(grammar.scopeName) ? "\n\nTo detect your current Python install you will need to run:<pre>python -m pip install ipykernel\npython -m ipykernel install --user</pre>" : "";
          var description = "Check that the language for this file is set in Atom, that you have a Jupyter kernel installed for it, and that you have configured the language mapping in Hydrogen preferences." + pythonDescription;
          atom.notifications.addError(message, {
            description: description,
            dismissable: pythonDescription !== ""
          });
          return;
        }

        _this.startKernel(kernelSpec, grammar, editor, filePath, onStarted);
      });
    }
  }, {
    key: "startKernel",
    value: function startKernel(kernelSpec, grammar, editor, filePath, onStarted) {
      var displayName = kernelSpec.display_name;

      // if kernel startup already in progress don't start additional kernel
      if (_store2["default"].startingKernels.get(displayName)) return;

      _store2["default"].startKernel(displayName);

      var currentPath = (0, _utils.getEditorDirectory)(editor);
      var projectPath = undefined;

      (0, _utils.log)("KernelManager: startKernel:", displayName);

      switch (atom.config.get("Hydrogen.startDir")) {
        case "firstProjectDir":
          projectPath = atom.project.getPaths()[0];
          break;
        case "projectDirOfFile":
          projectPath = atom.project.relativizePath(currentPath)[0];
          break;
      }

      var kernelStartDir = projectPath != null ? projectPath : currentPath;
      var options = {
        cwd: kernelStartDir,
        stdio: ["ignore", "pipe", "pipe"]
      };

      var transport = new _zmqKernel2["default"](kernelSpec, grammar, options, function () {
        var kernel = new _kernel2["default"](transport);
        _store2["default"].newKernel(kernel, filePath, editor, grammar);
        if (onStarted) onStarted(kernel);
      });
    }
  }, {
    key: "update",
    value: _asyncToGenerator(function* () {
      var kernelSpecs = yield ks.findAll();
      this.kernelSpecs = _lodash2["default"].sortBy(_lodash2["default"].map(_lodash2["default"].mapKeys(kernelSpecs, function (value, key) {
        return value.spec.name = key;
      }), "spec"), function (spec) {
        return spec.display_name;
      });
      return this.kernelSpecs;
    })
  }, {
    key: "getAllKernelSpecs",
    value: _asyncToGenerator(function* (grammar) {
      if (this.kernelSpecs) return this.kernelSpecs;
      return this.updateKernelSpecs(grammar);
    })
  }, {
    key: "getAllKernelSpecsForGrammar",
    value: _asyncToGenerator(function* (grammar) {
      if (!grammar) return [];

      var kernelSpecs = yield this.getAllKernelSpecs(grammar);
      return kernelSpecs.filter(function (spec) {
        return (0, _utils.kernelSpecProvidesGrammar)(spec, grammar);
      });
    })
  }, {
    key: "getKernelSpecForGrammar",
    value: _asyncToGenerator(function* (grammar) {
      var _this2 = this;

      var kernelSpecs = yield this.getAllKernelSpecsForGrammar(grammar);
      if (kernelSpecs.length <= 1) {
        return kernelSpecs[0];
      }

      if (this.kernelPicker) {
        this.kernelPicker.kernelSpecs = kernelSpecs;
      } else {
        this.kernelPicker = new _kernelPicker2["default"](kernelSpecs);
      }

      return new Promise(function (resolve) {
        if (!_this2.kernelPicker) return resolve(null);
        _this2.kernelPicker.onConfirmed = function (kernelSpec) {
          return resolve(kernelSpec);
        };
        _this2.kernelPicker.toggle();
      });
    })
  }, {
    key: "updateKernelSpecs",
    value: _asyncToGenerator(function* (grammar) {
      var kernelSpecs = yield this.update();

      if (kernelSpecs.length === 0) {
        var message = "No Kernels Installed";

        var options = {
          description: "No kernels are installed on your system so you will not be able to execute code in any language.",
          dismissable: true,
          buttons: [{
            text: "Install Instructions",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://nteract.gitbooks.io/hydrogen/docs/Installation.html");
            }
          }, {
            text: "Popular Kernels",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://nteract.io/kernels");
            }
          }, {
            text: "All Kernels",
            onDidClick: function onDidClick() {
              return _electron.shell.openExternal("https://github.com/jupyter/jupyter/wiki/Jupyter-kernels");
            }
          }]
        };
        atom.notifications.addError(message, options);
      } else {
        var message = "Hydrogen Kernels updated:";
        var options = {
          detail: _lodash2["default"].map(kernelSpecs, "display_name").join("\n")
        };
        atom.notifications.addInfo(message, options);
      }
      return kernelSpecs;
    })
  }]);

  return KernelManager;
})();

exports.KernelManager = KernelManager;
exports["default"] = new KernelManager();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9rZXJuZWwtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7OzJCQUNPLGFBQWE7O0lBQTlCLFdBQVc7O3dCQUNELFVBQVU7O3lCQUVWLGNBQWM7Ozs7c0JBQ2pCLFVBQVU7Ozs7NEJBRUosaUJBQWlCOzs7O3FCQUN4QixTQUFTOzs7O3FCQUN3QyxTQUFTOztBQUlyRSxJQUFNLEVBQUUsR0FBRyxXQUFXLENBQUM7Ozs7SUFFakIsYUFBYTtXQUFiLGFBQWE7MEJBQWIsYUFBYTs7U0FDeEIsV0FBVyxHQUF1QixJQUFJOzs7ZUFEM0IsYUFBYTs7V0FJVix3QkFDWixPQUFxQixFQUNyQixNQUF1QixFQUN2QixRQUFnQixFQUNoQixTQUFtQyxFQUNuQzs7O0FBQ0EsVUFBSSxDQUFDLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUN2RCxZQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsY0FBTSxPQUFPLCtCQUE4QixPQUFPLENBQUMsSUFBSSxZQUFVLENBQUM7QUFDbEUsY0FBTSxpQkFBaUIsR0FDckIsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUN4QywrSUFBK0ksR0FDL0ksRUFBRSxDQUFDO0FBQ1QsY0FBTSxXQUFXLHlMQUF1TCxpQkFBaUIsQUFBRSxDQUFDO0FBQzVOLGNBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtBQUNuQyx1QkFBVyxFQUFYLFdBQVc7QUFDWCx1QkFBVyxFQUFFLGlCQUFpQixLQUFLLEVBQUU7V0FDdEMsQ0FBQyxDQUFDO0FBQ0gsaUJBQU87U0FDUjs7QUFFRCxjQUFLLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENB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QUFFLGFBQWE7QUFDbkIsc0JBQVUsRUFBRTtxQkFDVixnQkFBTSxZQUFZLENBQ2hCLHlEQUF5RCxDQUMxRDthQUFBO1dBQ0osQ0FDRjtTQUNGLENBQUM7QUFDRixZQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7T0FDL0MsTUFBTTtBQUNMLFlBQU0sT0FBTyxHQUFHLDJCQUEyQixDQUFDO0FBQzVDLFlBQU0sT0FBTyxHQUFHO0FBQ2QsZ0JBQU0sRUFBRSxvQkFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDdEQsQ0FBQztBQUNGLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUM5QztBQUNELGFBQU8sV0FBVyxDQUFDO0tBQ3BCOzs7U0E3SlUsYUFBYTs7OztxQkFnS1gsSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2tlcm5lbC1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0ICogYXMga2VybmVsc3BlY3MgZnJvbSBcImtlcm5lbHNwZWNzXCI7XG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5pbXBvcnQgWk1RS2VybmVsIGZyb20gXCIuL3ptcS1rZXJuZWxcIjtcbmltcG9ydCBLZXJuZWwgZnJvbSBcIi4va2VybmVsXCI7XG5cbmltcG9ydCBLZXJuZWxQaWNrZXIgZnJvbSBcIi4va2VybmVsLXBpY2tlclwiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgeyBnZXRFZGl0b3JEaXJlY3RvcnksIGtlcm5lbFNwZWNQcm92aWRlc0dyYW1tYXIsIGxvZyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmltcG9ydCB0eXBlIHsgQ29ubmVjdGlvbiB9IGZyb20gXCIuL3ptcS1rZXJuZWxcIjtcblxuZXhwb3J0IGNvbnN0IGtzID0ga2VybmVsc3BlY3M7XG5cbmV4cG9ydCBjbGFzcyBLZXJuZWxNYW5hZ2VyIHtcbiAga2VybmVsU3BlY3M6ID9BcnJheTxLZXJuZWxzcGVjPiA9IG51bGw7XG4gIGtlcm5lbFBpY2tlcjogP0tlcm5lbFBpY2tlcjtcblxuICBzdGFydEtlcm5lbEZvcihcbiAgICBncmFtbWFyOiBhdG9tJEdyYW1tYXIsXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgZmlsZVBhdGg6IHN0cmluZyxcbiAgICBvblN0YXJ0ZWQ6IChrZXJuZWw6IEtlcm5lbCkgPT4gdm9pZFxuICApIHtcbiAgICB0aGlzLmdldEtlcm5lbFNwZWNGb3JHcmFtbWFyKGdyYW1tYXIpLnRoZW4oa2VybmVsU3BlYyA9PiB7XG4gICAgICBpZiAoIWtlcm5lbFNwZWMpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBObyBrZXJuZWwgZm9yIGdyYW1tYXIgXFxgJHtncmFtbWFyLm5hbWV9XFxgIGZvdW5kYDtcbiAgICAgICAgY29uc3QgcHl0aG9uRGVzY3JpcHRpb24gPVxuICAgICAgICAgIGdyYW1tYXIgJiYgL3B5dGhvbi9nLnRlc3QoZ3JhbW1hci5zY29wZU5hbWUpXG4gICAgICAgICAgICA/IFwiXFxuXFxuVG8gZGV0ZWN0IHlvdXIgY3VycmVudCBQeXRob24gaW5zdGFsbCB5b3Ugd2lsbCBuZWVkIHRvIHJ1bjo8cHJlPnB5dGhvbiAtbSBwaXAgaW5zdGFsbCBpcHlrZXJuZWxcXG5weXRob24gLW0gaXB5a2VybmVsIGluc3RhbGwgLS11c2VyPC9wcmU+XCJcbiAgICAgICAgICAgIDogXCJcIjtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBgQ2hlY2sgdGhhdCB0aGUgbGFuZ3VhZ2UgZm9yIHRoaXMgZmlsZSBpcyBzZXQgaW4gQXRvbSwgdGhhdCB5b3UgaGF2ZSBhIEp1cHl0ZXIga2VybmVsIGluc3RhbGxlZCBmb3IgaXQsIGFuZCB0aGF0IHlvdSBoYXZlIGNvbmZpZ3VyZWQgdGhlIGxhbmd1YWdlIG1hcHBpbmcgaW4gSHlkcm9nZW4gcHJlZmVyZW5jZXMuJHtweXRob25EZXNjcmlwdGlvbn1gO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSwge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiBweXRob25EZXNjcmlwdGlvbiAhPT0gXCJcIlxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXJ0S2VybmVsKGtlcm5lbFNwZWMsIGdyYW1tYXIsIGVkaXRvciwgZmlsZVBhdGgsIG9uU3RhcnRlZCk7XG4gICAgfSk7XG4gIH1cblxuICBzdGFydEtlcm5lbChcbiAgICBrZXJuZWxTcGVjOiBLZXJuZWxzcGVjLFxuICAgIGdyYW1tYXI6IGF0b20kR3JhbW1hcixcbiAgICBlZGl0b3I6IGF0b20kVGV4dEVkaXRvcixcbiAgICBmaWxlUGF0aDogc3RyaW5nLFxuICAgIG9uU3RhcnRlZDogPyhrZXJuZWw6IEtlcm5lbCkgPT4gdm9pZFxuICApIHtcbiAgICBjb25zdCBkaXNwbGF5TmFtZSA9IGtlcm5lbFNwZWMuZGlzcGxheV9uYW1lO1xuXG4gICAgLy8gaWYga2VybmVsIHN0YXJ0dXAgYWxyZWFkeSBpbiBwcm9ncmVzcyBkb24ndCBzdGFydCBhZGRpdGlvbmFsIGtlcm5lbFxuICAgIGlmIChzdG9yZS5zdGFydGluZ0tlcm5lbHMuZ2V0KGRpc3BsYXlOYW1lKSkgcmV0dXJuO1xuXG4gICAgc3RvcmUuc3RhcnRLZXJuZWwoZGlzcGxheU5hbWUpO1xuXG4gICAgbGV0IGN1cnJlbnRQYXRoID0gZ2V0RWRpdG9yRGlyZWN0b3J5KGVkaXRvcik7XG4gICAgbGV0IHByb2plY3RQYXRoO1xuXG4gICAgbG9nKFwiS2VybmVsTWFuYWdlcjogc3RhcnRLZXJuZWw6XCIsIGRpc3BsYXlOYW1lKTtcblxuICAgIHN3aXRjaCAoYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4uc3RhcnREaXJcIikpIHtcbiAgICAgIGNhc2UgXCJmaXJzdFByb2plY3REaXJcIjpcbiAgICAgICAgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicHJvamVjdERpck9mRmlsZVwiOlxuICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChjdXJyZW50UGF0aClbMF07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IGtlcm5lbFN0YXJ0RGlyID0gcHJvamVjdFBhdGggIT0gbnVsbCA/IHByb2plY3RQYXRoIDogY3VycmVudFBhdGg7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGN3ZDoga2VybmVsU3RhcnREaXIsXG4gICAgICBzdGRpbzogW1wiaWdub3JlXCIsIFwicGlwZVwiLCBcInBpcGVcIl1cbiAgICB9O1xuXG4gICAgY29uc3QgdHJhbnNwb3J0ID0gbmV3IFpNUUtlcm5lbChrZXJuZWxTcGVjLCBncmFtbWFyLCBvcHRpb25zLCAoKSA9PiB7XG4gICAgICBjb25zdCBrZXJuZWwgPSBuZXcgS2VybmVsKHRyYW5zcG9ydCk7XG4gICAgICBzdG9yZS5uZXdLZXJuZWwoa2VybmVsLCBmaWxlUGF0aCwgZWRpdG9yLCBncmFtbWFyKTtcbiAgICAgIGlmIChvblN0YXJ0ZWQpIG9uU3RhcnRlZChrZXJuZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlKCk6IFByb21pc2U8S2VybmVsc3BlY1tdPiB7XG4gICAgY29uc3Qga2VybmVsU3BlY3MgPSBhd2FpdCBrcy5maW5kQWxsKCk7XG4gICAgdGhpcy5rZXJuZWxTcGVjcyA9IF8uc29ydEJ5KFxuICAgICAgXy5tYXAoXG4gICAgICAgIF8ubWFwS2V5cyhrZXJuZWxTcGVjcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgIHJldHVybiAodmFsdWUuc3BlYy5uYW1lID0ga2V5KTtcbiAgICAgICAgfSksXG4gICAgICAgIFwic3BlY1wiXG4gICAgICApLFxuICAgICAgc3BlYyA9PiBzcGVjLmRpc3BsYXlfbmFtZVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXMua2VybmVsU3BlY3M7XG4gIH1cblxuICBhc3luYyBnZXRBbGxLZXJuZWxTcGVjcyhncmFtbWFyOiA/YXRvbSRHcmFtbWFyKSB7XG4gICAgaWYgKHRoaXMua2VybmVsU3BlY3MpIHJldHVybiB0aGlzLmtlcm5lbFNwZWNzO1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZUtlcm5lbFNwZWNzKGdyYW1tYXIpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWxsS2VybmVsU3BlY3NGb3JHcmFtbWFyKFxuICAgIGdyYW1tYXI6ID9hdG9tJEdyYW1tYXJcbiAgKTogUHJvbWlzZTxLZXJuZWxzcGVjW10+IHtcbiAgICBpZiAoIWdyYW1tYXIpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGtlcm5lbFNwZWNzID0gYXdhaXQgdGhpcy5nZXRBbGxLZXJuZWxTcGVjcyhncmFtbWFyKTtcbiAgICByZXR1cm4ga2VybmVsU3BlY3MuZmlsdGVyKHNwZWMgPT4ga2VybmVsU3BlY1Byb3ZpZGVzR3JhbW1hcihzcGVjLCBncmFtbWFyKSk7XG4gIH1cblxuICBhc3luYyBnZXRLZXJuZWxTcGVjRm9yR3JhbW1hcihncmFtbWFyOiBhdG9tJEdyYW1tYXIpIHtcbiAgICBjb25zdCBrZXJuZWxTcGVjcyA9IGF3YWl0IHRoaXMuZ2V0QWxsS2VybmVsU3BlY3NGb3JHcmFtbWFyKGdyYW1tYXIpO1xuICAgIGlmIChrZXJuZWxTcGVjcy5sZW5ndGggPD0gMSkge1xuICAgICAgcmV0dXJuIGtlcm5lbFNwZWNzWzBdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmtlcm5lbFBpY2tlcikge1xuICAgICAgdGhpcy5rZXJuZWxQaWNrZXIua2VybmVsU3BlY3MgPSBrZXJuZWxTcGVjcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5rZXJuZWxQaWNrZXIgPSBuZXcgS2VybmVsUGlja2VyKGtlcm5lbFNwZWNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoIXRoaXMua2VybmVsUGlja2VyKSByZXR1cm4gcmVzb2x2ZShudWxsKTtcbiAgICAgIHRoaXMua2VybmVsUGlja2VyLm9uQ29uZmlybWVkID0ga2VybmVsU3BlYyA9PiByZXNvbHZlKGtlcm5lbFNwZWMpO1xuICAgICAgdGhpcy5rZXJuZWxQaWNrZXIudG9nZ2xlKCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVLZXJuZWxTcGVjcyhncmFtbWFyOiA/YXRvbSRHcmFtbWFyKSB7XG4gICAgY29uc3Qga2VybmVsU3BlY3MgPSBhd2FpdCB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgaWYgKGtlcm5lbFNwZWNzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IFwiTm8gS2VybmVscyBJbnN0YWxsZWRcIjtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJObyBrZXJuZWxzIGFyZSBpbnN0YWxsZWQgb24geW91ciBzeXN0ZW0gc28geW91IHdpbGwgbm90IGJlIGFibGUgdG8gZXhlY3V0ZSBjb2RlIGluIGFueSBsYW5ndWFnZS5cIixcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0OiBcIkluc3RhbGwgSW5zdHJ1Y3Rpb25zXCIsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PlxuICAgICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoXG4gICAgICAgICAgICAgICAgXCJodHRwczovL250ZXJhY3QuZ2l0Ym9va3MuaW8vaHlkcm9nZW4vZG9jcy9JbnN0YWxsYXRpb24uaHRtbFwiXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRleHQ6IFwiUG9wdWxhciBLZXJuZWxzXCIsXG4gICAgICAgICAgICBvbkRpZENsaWNrOiAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoXCJodHRwczovL250ZXJhY3QuaW8va2VybmVsc1wiKVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdGV4dDogXCJBbGwgS2VybmVsc1wiLFxuICAgICAgICAgICAgb25EaWRDbGljazogKCkgPT5cbiAgICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKFxuICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9naXRodWIuY29tL2p1cHl0ZXIvanVweXRlci93aWtpL0p1cHl0ZXIta2VybmVsc1wiXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBcIkh5ZHJvZ2VuIEtlcm5lbHMgdXBkYXRlZDpcIjtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGRldGFpbDogXy5tYXAoa2VybmVsU3BlY3MsIFwiZGlzcGxheV9uYW1lXCIpLmpvaW4oXCJcXG5cIilcbiAgICAgIH07XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhtZXNzYWdlLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIGtlcm5lbFNwZWNzO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBLZXJuZWxNYW5hZ2VyKCk7XG4iXX0=