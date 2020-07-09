Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _uuidV4 = require("uuid/v4");

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _xmlhttprequest = require("xmlhttprequest");

var _xmlhttprequest2 = _interopRequireDefault(_xmlhttprequest);

var _url = require("url");

var _jupyterlabServices = require("@jupyterlab/services");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _wsKernel = require("./ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var CustomListView = (function () {
  function CustomListView() {
    var _this = this;

    _classCallCheck(this, CustomListView);

    this.onConfirmed = null;
    this.onCancelled = null;

    this.previouslyFocusedElement = document.activeElement;
    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.name;
      },
      elementForItem: function elementForItem(item) {
        var element = document.createElement("li");
        element.textContent = item.name;
        return element;
      },
      didConfirmSelection: function didConfirmSelection(item) {
        if (_this.onConfirmed) _this.onConfirmed(item);
      },
      didCancelSelection: function didCancelSelection() {
        _this.cancel();
        if (_this.onCancelled) _this.onCancelled();
      }
    });
  }

  _createClass(CustomListView, [{
    key: "show",
    value: function show() {
      if (!this.panel) {
        this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      }
      this.panel.show();
      this.selectListView.focus();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.cancel();
      return this.selectListView.destroy();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }]);

  return CustomListView;
})();

var WSKernelPicker = (function () {
  function WSKernelPicker(onChosen) {
    _classCallCheck(this, WSKernelPicker);

    this._onChosen = onChosen;
    this.listView = new CustomListView();
  }

  _createClass(WSKernelPicker, [{
    key: "toggle",
    value: _asyncToGenerator(function* (_kernelSpecFilter) {
      this.listView.previouslyFocusedElement = document.activeElement;
      this._kernelSpecFilter = _kernelSpecFilter;
      var gateways = _config2["default"].getJson("gateways") || [];
      if (_lodash2["default"].isEmpty(gateways)) {
        atom.notifications.addError("No remote kernel gateways available", {
          description: "Use the Hydrogen package settings to specify the list of remote servers. Hydrogen can use remote kernels on either a Jupyter Kernel Gateway or Jupyter notebook server."
        });
        return;
      }

      this._path = (_store2["default"].filePath || "unsaved") + "-" + (0, _uuidV42["default"])();

      this.listView.onConfirmed = this.onGateway.bind(this);

      yield this.listView.selectListView.update({
        items: gateways,
        infoMessage: "Select a gateway",
        emptyMessage: "No gateways available",
        loadingMessage: null
      });

      this.listView.show();
    })
  }, {
    key: "promptForText",
    value: _asyncToGenerator(function* (prompt) {
      var previouslyFocusedElement = this.listView.previouslyFocusedElement;
      this.listView.cancel();

      var inputPromise = new Promise(function (resolve, reject) {
        var inputView = new _inputView2["default"]({ prompt: prompt }, resolve);
        atom.commands.add(inputView.element, {
          "core:cancel": function coreCancel() {
            inputView.close();
            reject();
          }
        });
        inputView.attach();
      });

      var response = undefined;
      try {
        response = yield inputPromise;
        if (response === "") {
          return null;
        }
      } catch (e) {
        return null;
      }

      // Assume that no response to the prompt will cancel the entire flow, so
      // only restore listView if a response was received
      this.listView.show();
      this.listView.previouslyFocusedElement = previouslyFocusedElement;
      return response;
    })
  }, {
    key: "promptForCookie",
    value: _asyncToGenerator(function* (options) {
      var cookie = yield this.promptForText("Cookie:");
      if (cookie === null) {
        return false;
      }

      if (options.requestHeaders === undefined) {
        options.requestHeaders = {};
      }
      options.requestHeaders.Cookie = cookie;
      options.xhrFactory = function () {
        var request = new _xmlhttprequest2["default"].XMLHttpRequest();
        // Disable protections against setting the Cookie header
        request.setDisableHeaderCheck(true);
        return request;
      };
      options.wsFactory = function (url, protocol) {
        // Authentication requires requests to appear to be same-origin
        var parsedUrl = new _url.URL(url);
        if (parsedUrl.protocol == "wss:") {
          parsedUrl.protocol = "https:";
        } else {
          parsedUrl.protocol = "http:";
        }
        var headers = { Cookie: cookie };
        var origin = parsedUrl.origin;
        var host = parsedUrl.host;
        return new _ws2["default"](url, protocol, { headers: headers, origin: origin, host: host });
      };
      return true;
    })
  }, {
    key: "promptForToken",
    value: _asyncToGenerator(function* (options) {
      var token = yield this.promptForText("Token:");
      if (token === null) {
        return false;
      }

      options.token = token;
      return true;
    })
  }, {
    key: "promptForCredentials",
    value: _asyncToGenerator(function* (options) {
      var _this2 = this;

      yield this.listView.selectListView.update({
        items: [{
          name: "Authenticate with a token",
          action: "token"
        }, {
          name: "Authenticate with a cookie",
          action: "cookie"
        }, {
          name: "Cancel",
          action: "cancel"
        }],
        infoMessage: "Connection to gateway failed. Your settings may be incorrect, the server may be unavailable, or you may lack sufficient privileges to complete the connection.",
        loadingMessage: null,
        emptyMessage: null
      });

      var action = yield new Promise(function (resolve, reject) {
        _this2.listView.onConfirmed = function (item) {
          return resolve(item.action);
        };
        _this2.listView.onCancelled = function () {
          return resolve("cancel");
        };
      });
      if (action === "token") {
        return yield this.promptForToken(options);
      } else if (action === "cookie") {
        return yield this.promptForCookie(options);
      } else {
        // action === "cancel"
        this.listView.cancel();
        return false;
      }
    })
  }, {
    key: "onGateway",
    value: _asyncToGenerator(function* (gatewayInfo) {
      var _this3 = this;

      this.listView.onConfirmed = null;
      yield this.listView.selectListView.update({
        items: [],
        infoMessage: null,
        loadingMessage: "Loading sessions...",
        emptyMessage: "No sessions available"
      });

      var gatewayOptions = Object.assign({
        xhrFactory: function xhrFactory() {
          return new _xmlhttprequest2["default"].XMLHttpRequest();
        },
        wsFactory: function wsFactory(url, protocol) {
          return new _ws2["default"](url, protocol);
        }
      }, gatewayInfo.options);

      var serverSettings = _jupyterlabServices.ServerConnection.makeSettings(gatewayOptions);
      var specModels = undefined;

      try {
        specModels = yield _jupyterlabServices.Kernel.getSpecs(serverSettings);
      } catch (error) {
        // The error types you get back at this stage are fairly opaque. In
        // particular, having invalid credentials typically triggers ECONNREFUSED
        // rather than 403 Forbidden. This does some basic checks and then assumes
        // that all remaining error types could be caused by invalid credentials.
        if (!error.xhr || !error.xhr.responseText) {
          throw error;
        } else if (error.xhr.responseText.includes("ETIMEDOUT")) {
          atom.notifications.addError("Connection to gateway failed");
          this.listView.cancel();
          return;
        } else {
          var promptSucceeded = yield this.promptForCredentials(gatewayOptions);
          if (!promptSucceeded) {
            return;
          }
          serverSettings = _jupyterlabServices.ServerConnection.makeSettings(gatewayOptions);
          yield this.listView.selectListView.update({
            items: [],
            infoMessage: null,
            loadingMessage: "Loading sessions...",
            emptyMessage: "No sessions available"
          });
        }
      }

      try {
        yield* (function* () {
          if (!specModels) {
            specModels = yield _jupyterlabServices.Kernel.getSpecs(serverSettings);
          }

          var kernelSpecs = _lodash2["default"].filter(specModels.kernelspecs, function (spec) {
            return _this3._kernelSpecFilter(spec);
          });

          var kernelNames = _lodash2["default"].map(kernelSpecs, function (specModel) {
            return specModel.name;
          });

          try {
            var sessionModels = yield _jupyterlabServices.Session.listRunning(serverSettings);
            sessionModels = sessionModels.filter(function (model) {
              var name = model.kernel ? model.kernel.name : null;
              return name ? kernelNames.includes(name) : true;
            });
            var items = sessionModels.map(function (model) {
              var name = undefined;
              if (model.path) {
                name = (0, _tildify2["default"])(model.path);
              } else if (model.notebook && model.notebook.path) {
                name = (0, _tildify2["default"])(model.notebook.path);
              } else {
                name = "Session " + model.id;
              }
              return { name: name, model: model, options: serverSettings };
            });
            items.unshift({
              name: "[new session]",
              model: null,
              options: serverSettings,
              kernelSpecs: kernelSpecs
            });
            _this3.listView.onConfirmed = _this3.onSession.bind(_this3, gatewayInfo.name);
            yield _this3.listView.selectListView.update({
              items: items,
              loadingMessage: null
            });
          } catch (error) {
            if (!error.xhr || error.xhr.status !== 403) throw error;
            // Gateways offer the option of never listing sessions, for security
            // reasons.
            // Assume this is the case and proceed to creating a new session.
            _this3.onSession(gatewayInfo.name, {
              name: "[new session]",
              model: null,
              options: serverSettings,
              kernelSpecs: kernelSpecs
            });
          }
        })();
      } catch (e) {
        atom.notifications.addError("Connection to gateway failed");
        this.listView.cancel();
      }
    })
  }, {
    key: "onSession",
    value: _asyncToGenerator(function* (gatewayName, sessionInfo) {
      var _this4 = this;

      if (!sessionInfo.model) {
        if (!sessionInfo.name) {
          yield this.listView.selectListView.update({
            items: [],
            errorMessage: "This gateway does not support listing sessions",
            loadingMessage: null,
            infoMessage: null
          });
        }
        var items = _lodash2["default"].map(sessionInfo.kernelSpecs, function (spec) {
          var options = {
            serverSettings: sessionInfo.options,
            kernelName: spec.name,
            path: _this4._path
          };
          return {
            name: spec.display_name,
            options: options
          };
        });

        this.listView.onConfirmed = this.startSession.bind(this, gatewayName);
        yield this.listView.selectListView.update({
          items: items,
          emptyMessage: "No kernel specs available",
          infoMessage: "Select a session",
          loadingMessage: null
        });
      } else {
        this.onSessionChosen(gatewayName, (yield _jupyterlabServices.Session.connectTo(sessionInfo.model.id, sessionInfo.options)));
      }
    })
  }, {
    key: "startSession",
    value: function startSession(gatewayName, sessionInfo) {
      _jupyterlabServices.Session.startNew(sessionInfo.options).then(this.onSessionChosen.bind(this, gatewayName));
    }
  }, {
    key: "onSessionChosen",
    value: _asyncToGenerator(function* (gatewayName, session) {
      this.listView.cancel();
      var kernelSpec = yield session.kernel.getSpec();
      if (!_store2["default"].grammar) return;

      var kernel = new _wsKernel2["default"](gatewayName, kernelSpec, _store2["default"].grammar, session);
      this._onChosen(kernel);
    })
  }]);

  return WSKernelPicker;
})();

exports["default"] = WSKernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi93cy1rZXJuZWwtcGlja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs4QkFFMkIsa0JBQWtCOzs7O3NCQUMvQixRQUFROzs7O3VCQUNGLFNBQVM7Ozs7c0JBQ2QsU0FBUzs7OztrQkFDVCxJQUFJOzs7OzhCQUNILGdCQUFnQjs7OzttQkFDWixLQUFLOztrQ0FDeUIsc0JBQXNCOztzQkFFckQsVUFBVTs7Ozt3QkFDUixhQUFhOzs7O3lCQUNaLGNBQWM7Ozs7cUJBQ2xCLFNBQVM7Ozs7SUFFckIsY0FBYztBQU9QLFdBUFAsY0FBYyxHQU9KOzs7MEJBUFYsY0FBYzs7U0FDbEIsV0FBVyxHQUFjLElBQUk7U0FDN0IsV0FBVyxHQUFjLElBQUk7O0FBTTNCLFFBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBQ3ZELFFBQUksQ0FBQyxjQUFjLEdBQUcsZ0NBQW1CO0FBQ3ZDLG9CQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUM7QUFDL0IsV0FBSyxFQUFFLEVBQUU7QUFDVCxzQkFBZ0IsRUFBRSwwQkFBQSxJQUFJO2VBQUksSUFBSSxDQUFDLElBQUk7T0FBQTtBQUNuQyxvQkFBYyxFQUFFLHdCQUFBLElBQUksRUFBSTtBQUN0QixZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLGVBQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNoQyxlQUFPLE9BQU8sQ0FBQztPQUNoQjtBQUNELHlCQUFtQixFQUFFLDZCQUFBLElBQUksRUFBSTtBQUMzQixZQUFJLE1BQUssV0FBVyxFQUFFLE1BQUssV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzlDO0FBQ0Qsd0JBQWtCLEVBQUUsOEJBQU07QUFDeEIsY0FBSyxNQUFNLEVBQUUsQ0FBQztBQUNkLFlBQUksTUFBSyxXQUFX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LENBQ25FLENBQUM7T0FDSDtLQUNGOzs7V0FFVyxzQkFBQyxXQUFtQixFQUFFLFdBQWdCLEVBQUU7QUFDbEQsa0NBQVEsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FDN0MsQ0FBQztLQUNIOzs7NkJBRW9CLFdBQUMsV0FBbUIsRUFBRSxPQUFZLEVBQUU7QUFDdkQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUN2QixVQUFNLFVBQVUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEQsVUFBSSxDQUFDLG1CQUFNLE9BQU8sRUFBRSxPQUFPOztBQUUzQixVQUFNLE1BQU0sR0FBRywwQkFDYixXQUFXLEVBQ1gsVUFBVSxFQUNWLG1CQUFNLE9BQU8sRUFDYixPQUFPLENBQ1IsQ0FBQztBQUNGLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDeEI7OztTQXBUa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC1waWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSBcImF0b20tc2VsZWN0LWxpc3RcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB0aWxkaWZ5IGZyb20gXCJ0aWxkaWZ5XCI7XG5pbXBvcnQgdjQgZnJvbSBcInV1aWQvdjRcIjtcbmltcG9ydCB3cyBmcm9tIFwid3NcIjtcbmltcG9ydCB4aHIgZnJvbSBcInhtbGh0dHByZXF1ZXN0XCI7XG5pbXBvcnQgeyBVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgeyBLZXJuZWwsIFNlc3Npb24sIFNlcnZlckNvbm5lY3Rpb24gfSBmcm9tIFwiQGp1cHl0ZXJsYWIvc2VydmljZXNcIjtcblxuaW1wb3J0IENvbmZpZyBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCBXU0tlcm5lbCBmcm9tIFwiLi93cy1rZXJuZWxcIjtcbmltcG9ydCBJbnB1dFZpZXcgZnJvbSBcIi4vaW5wdXQtdmlld1wiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5cbmNsYXNzIEN1c3RvbUxpc3RWaWV3IHtcbiAgb25Db25maXJtZWQ6ID9GdW5jdGlvbiA9IG51bGw7XG4gIG9uQ2FuY2VsbGVkOiA/RnVuY3Rpb24gPSBudWxsO1xuICBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ6ID9IVE1MRWxlbWVudDtcbiAgc2VsZWN0TGlzdFZpZXc6IFNlbGVjdExpc3RWaWV3O1xuICBwYW5lbDogP2F0b20kUGFuZWw7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXNDbGFzc0xpc3Q6IFtcIm1hcmstYWN0aXZlXCJdLFxuICAgICAgaXRlbXM6IFtdLFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogaXRlbSA9PiBpdGVtLm5hbWUsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBpdGVtLm5hbWU7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IGl0ZW0gPT4ge1xuICAgICAgICBpZiAodGhpcy5vbkNvbmZpcm1lZCkgdGhpcy5vbkNvbmZpcm1lZChpdGVtKTtcbiAgICAgIH0sXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgaWYgKHRoaXMub25DYW5jZWxsZWQpIHRoaXMub25DYW5jZWxsZWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgaWYgKCF0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMuc2VsZWN0TGlzdFZpZXcgfSk7XG4gICAgfVxuICAgIHRoaXMucGFuZWwuc2hvdygpO1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcuZm9jdXMoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RMaXN0Vmlldy5kZXN0cm95KCk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV1NLZXJuZWxQaWNrZXIge1xuICBfb25DaG9zZW46IChrZXJuZWw6IEtlcm5lbCkgPT4gdm9pZDtcbiAgX2tlcm5lbFNwZWNGaWx0ZXI6IChrZXJuZWxTcGVjOiBLZXJuZWxzcGVjKSA9PiBib29sZWFuO1xuICBfcGF0aDogc3RyaW5nO1xuICBsaXN0VmlldzogQ3VzdG9tTGlzdFZpZXc7XG5cbiAgY29uc3RydWN0b3Iob25DaG9zZW46IChrZXJuZWw6IEtlcm5lbCkgPT4gdm9pZCkge1xuICAgIHRoaXMuX29uQ2hvc2VuID0gb25DaG9zZW47XG4gICAgdGhpcy5saXN0VmlldyA9IG5ldyBDdXN0b21MaXN0VmlldygpO1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlKF9rZXJuZWxTcGVjRmlsdGVyOiAoa2VybmVsU3BlYzogS2VybmVsc3BlYykgPT4gYm9vbGVhbikge1xuICAgIHRoaXMubGlzdFZpZXcucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9rZXJuZWxTcGVjRmlsdGVyID0gX2tlcm5lbFNwZWNGaWx0ZXI7XG4gICAgY29uc3QgZ2F0ZXdheXMgPSBDb25maWcuZ2V0SnNvbihcImdhdGV3YXlzXCIpIHx8IFtdO1xuICAgIGlmIChfLmlzRW1wdHkoZ2F0ZXdheXMpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJObyByZW1vdGUga2VybmVsIGdhdGV3YXlzIGF2YWlsYWJsZVwiLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiVXNlIHRoZSBIeWRyb2dlbiBwYWNrYWdlIHNldHRpbmdzIHRvIHNwZWNpZnkgdGhlIGxpc3Qgb2YgcmVtb3RlIHNlcnZlcnMuIEh5ZHJvZ2VuIGNhbiB1c2UgcmVtb3RlIGtlcm5lbHMgb24gZWl0aGVyIGEgSnVweXRlciBLZXJuZWwgR2F0ZXdheSBvciBKdXB5dGVyIG5vdGVib29rIHNlcnZlci5cIlxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcGF0aCA9IGAke3N0b3JlLmZpbGVQYXRoIHx8IFwidW5zYXZlZFwifS0ke3Y0KCl9YDtcblxuICAgIHRoaXMubGlzdFZpZXcub25Db25maXJtZWQgPSB0aGlzLm9uR2F0ZXdheS5iaW5kKHRoaXMpO1xuXG4gICAgYXdhaXQgdGhpcy5saXN0Vmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgaXRlbXM6IGdhdGV3YXlzLFxuICAgICAgaW5mb01lc3NhZ2U6IFwiU2VsZWN0IGEgZ2F0ZXdheVwiLFxuICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIGdhdGV3YXlzIGF2YWlsYWJsZVwiLFxuICAgICAgbG9hZGluZ01lc3NhZ2U6IG51bGxcbiAgICB9KTtcblxuICAgIHRoaXMubGlzdFZpZXcuc2hvdygpO1xuICB9XG5cbiAgYXN5bmMgcHJvbXB0Rm9yVGV4dChwcm9tcHQ6IHN0cmluZykge1xuICAgIGNvbnN0IHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IHRoaXMubGlzdFZpZXcucHJldmlvdXNseUZvY3VzZWRFbGVtZW50O1xuICAgIHRoaXMubGlzdFZpZXcuY2FuY2VsKCk7XG5cbiAgICBjb25zdCBpbnB1dFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBpbnB1dFZpZXcgPSBuZXcgSW5wdXRWaWV3KHsgcHJvbXB0IH0sIHJlc29sdmUpO1xuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoaW5wdXRWaWV3LmVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiAoKSA9PiB7XG4gICAgICAgICAgaW5wdXRWaWV3LmNsb3NlKCk7XG4gICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaW5wdXRWaWV3LmF0dGFjaCgpO1xuICAgIH0pO1xuXG4gICAgbGV0IHJlc3BvbnNlO1xuICAgIHRyeSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IGlucHV0UHJvbWlzZTtcbiAgICAgIGlmIChyZXNwb25zZSA9PT0gXCJcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBBc3N1bWUgdGhhdCBubyByZXNwb25zZSB0byB0aGUgcHJvbXB0IHdpbGwgY2FuY2VsIHRoZSBlbnRpcmUgZmxvdywgc29cbiAgICAvLyBvbmx5IHJlc3RvcmUgbGlzdFZpZXcgaWYgYSByZXNwb25zZSB3YXMgcmVjZWl2ZWRcbiAgICB0aGlzLmxpc3RWaWV3LnNob3coKTtcbiAgICB0aGlzLmxpc3RWaWV3LnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDtcbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH1cblxuICBhc3luYyBwcm9tcHRGb3JDb29raWUob3B0aW9uczogYW55KSB7XG4gICAgY29uc3QgY29va2llID0gYXdhaXQgdGhpcy5wcm9tcHRGb3JUZXh0KFwiQ29va2llOlwiKTtcbiAgICBpZiAoY29va2llID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVxdWVzdEhlYWRlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy5yZXF1ZXN0SGVhZGVycyA9IHt9O1xuICAgIH1cbiAgICBvcHRpb25zLnJlcXVlc3RIZWFkZXJzLkNvb2tpZSA9IGNvb2tpZTtcbiAgICBvcHRpb25zLnhockZhY3RvcnkgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVxdWVzdCA9IG5ldyB4aHIuWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIC8vIERpc2FibGUgcHJvdGVjdGlvbnMgYWdhaW5zdCBzZXR0aW5nIHRoZSBDb29raWUgaGVhZGVyXG4gICAgICByZXF1ZXN0LnNldERpc2FibGVIZWFkZXJDaGVjayh0cnVlKTtcbiAgICAgIHJldHVybiByZXF1ZXN0O1xuICAgIH07XG4gICAgb3B0aW9ucy53c0ZhY3RvcnkgPSAodXJsLCBwcm90b2NvbCkgPT4ge1xuICAgICAgLy8gQXV0aGVudGljYXRpb24gcmVxdWlyZXMgcmVxdWVzdHMgdG8gYXBwZWFyIHRvIGJlIHNhbWUtb3JpZ2luXG4gICAgICBsZXQgcGFyc2VkVXJsID0gbmV3IFVSTCh1cmwpO1xuICAgICAgaWYgKHBhcnNlZFVybC5wcm90b2NvbCA9PSBcIndzczpcIikge1xuICAgICAgICBwYXJzZWRVcmwucHJvdG9jb2wgPSBcImh0dHBzOlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkVXJsLnByb3RvY29sID0gXCJodHRwOlwiO1xuICAgICAgfVxuICAgICAgY29uc3QgaGVhZGVycyA9IHsgQ29va2llOiBjb29raWUgfTtcbiAgICAgIGNvbnN0IG9yaWdpbiA9IHBhcnNlZFVybC5vcmlnaW47XG4gICAgICBjb25zdCBob3N0ID0gcGFyc2VkVXJsLmhvc3Q7XG4gICAgICByZXR1cm4gbmV3IHdzKHVybCwgcHJvdG9jb2wsIHsgaGVhZGVycywgb3JpZ2luLCBob3N0IH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBwcm9tcHRGb3JUb2tlbihvcHRpb25zOiBhbnkpIHtcbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHRoaXMucHJvbXB0Rm9yVGV4dChcIlRva2VuOlwiKTtcbiAgICBpZiAodG9rZW4gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvcHRpb25zLnRva2VuID0gdG9rZW47XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBwcm9tcHRGb3JDcmVkZW50aWFscyhvcHRpb25zOiBhbnkpIHtcbiAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJBdXRoZW50aWNhdGUgd2l0aCBhIHRva2VuXCIsXG4gICAgICAgICAgYWN0aW9uOiBcInRva2VuXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQXV0aGVudGljYXRlIHdpdGggYSBjb29raWVcIixcbiAgICAgICAgICBhY3Rpb246IFwiY29va2llXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiQ2FuY2VsXCIsXG4gICAgICAgICAgYWN0aW9uOiBcImNhbmNlbFwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBpbmZvTWVzc2FnZTpcbiAgICAgICAgXCJDb25uZWN0aW9uIHRvIGdhdGV3YXkgZmFpbGVkLiBZb3VyIHNldHRpbmdzIG1heSBiZSBpbmNvcnJlY3QsIHRoZSBzZXJ2ZXIgbWF5IGJlIHVuYXZhaWxhYmxlLCBvciB5b3UgbWF5IGxhY2sgc3VmZmljaWVudCBwcml2aWxlZ2VzIHRvIGNvbXBsZXRlIHRoZSBjb25uZWN0aW9uLlwiLFxuICAgICAgbG9hZGluZ01lc3NhZ2U6IG51bGwsXG4gICAgICBlbXB0eU1lc3NhZ2U6IG51bGxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbiA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubGlzdFZpZXcub25Db25maXJtZWQgPSBpdGVtID0+IHJlc29sdmUoaXRlbS5hY3Rpb24pO1xuICAgICAgdGhpcy5saXN0Vmlldy5vbkNhbmNlbGxlZCA9ICgpID0+IHJlc29sdmUoXCJjYW5jZWxcIik7XG4gICAgfSk7XG4gICAgaWYgKGFjdGlvbiA9PT0gXCJ0b2tlblwiKSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5wcm9tcHRGb3JUb2tlbihvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gXCJjb29raWVcIikge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucHJvbXB0Rm9yQ29va2llKG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBhY3Rpb24gPT09IFwiY2FuY2VsXCJcbiAgICAgIHRoaXMubGlzdFZpZXcuY2FuY2VsKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgb25HYXRld2F5KGdhdGV3YXlJbmZvOiBhbnkpIHtcbiAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gbnVsbDtcbiAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICBpdGVtczogW10sXG4gICAgICBpbmZvTWVzc2FnZTogbnVsbCxcbiAgICAgIGxvYWRpbmdNZXNzYWdlOiBcIkxvYWRpbmcgc2Vzc2lvbnMuLi5cIixcbiAgICAgIGVtcHR5TWVzc2FnZTogXCJObyBzZXNzaW9ucyBhdmFpbGFibGVcIlxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2F0ZXdheU9wdGlvbnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICB4aHJGYWN0b3J5OiAoKSA9PiBuZXcgeGhyLlhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICAgIHdzRmFjdG9yeTogKHVybCwgcHJvdG9jb2wpID0+IG5ldyB3cyh1cmwsIHByb3RvY29sKVxuICAgICAgfSxcbiAgICAgIGdhdGV3YXlJbmZvLm9wdGlvbnNcbiAgICApO1xuXG4gICAgbGV0IHNlcnZlclNldHRpbmdzID0gU2VydmVyQ29ubmVjdGlvbi5tYWtlU2V0dGluZ3MoZ2F0ZXdheU9wdGlvbnMpO1xuICAgIGxldCBzcGVjTW9kZWxzO1xuXG4gICAgdHJ5IHtcbiAgICAgIHNwZWNNb2RlbHMgPSBhd2FpdCBLZXJuZWwuZ2V0U3BlY3Moc2VydmVyU2V0dGluZ3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBUaGUgZXJyb3IgdHlwZXMgeW91IGdldCBiYWNrIGF0IHRoaXMgc3RhZ2UgYXJlIGZhaXJseSBvcGFxdWUuIEluXG4gICAgICAvLyBwYXJ0aWN1bGFyLCBoYXZpbmcgaW52YWxpZCBjcmVkZW50aWFscyB0eXBpY2FsbHkgdHJpZ2dlcnMgRUNPTk5SRUZVU0VEXG4gICAgICAvLyByYXRoZXIgdGhhbiA0MDMgRm9yYmlkZGVuLiBUaGlzIGRvZXMgc29tZSBiYXNpYyBjaGVja3MgYW5kIHRoZW4gYXNzdW1lc1xuICAgICAgLy8gdGhhdCBhbGwgcmVtYWluaW5nIGVycm9yIHR5cGVzIGNvdWxkIGJlIGNhdXNlZCBieSBpbnZhbGlkIGNyZWRlbnRpYWxzLlxuICAgICAgaWYgKCFlcnJvci54aHIgfHwgIWVycm9yLnhoci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICB9IGVsc2UgaWYgKGVycm9yLnhoci5yZXNwb25zZVRleHQuaW5jbHVkZXMoXCJFVElNRURPVVRcIikpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiQ29ubmVjdGlvbiB0byBnYXRld2F5IGZhaWxlZFwiKTtcbiAgICAgICAgdGhpcy5saXN0Vmlldy5jYW5jZWwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvbXB0U3VjY2VlZGVkID0gYXdhaXQgdGhpcy5wcm9tcHRGb3JDcmVkZW50aWFscyhnYXRld2F5T3B0aW9ucyk7XG4gICAgICAgIGlmICghcHJvbXB0U3VjY2VlZGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlcnZlclNldHRpbmdzID0gU2VydmVyQ29ubmVjdGlvbi5tYWtlU2V0dGluZ3MoZ2F0ZXdheU9wdGlvbnMpO1xuICAgICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgIGluZm9NZXNzYWdlOiBudWxsLFxuICAgICAgICAgIGxvYWRpbmdNZXNzYWdlOiBcIkxvYWRpbmcgc2Vzc2lvbnMuLi5cIixcbiAgICAgICAgICBlbXB0eU1lc3NhZ2U6IFwiTm8gc2Vzc2lvbnMgYXZhaWxhYmxlXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmICghc3BlY01vZGVscykge1xuICAgICAgICBzcGVjTW9kZWxzID0gYXdhaXQgS2VybmVsLmdldFNwZWNzKHNlcnZlclNldHRpbmdzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qga2VybmVsU3BlY3MgPSBfLmZpbHRlcihzcGVjTW9kZWxzLmtlcm5lbHNwZWNzLCBzcGVjID0+XG4gICAgICAgIHRoaXMuX2tlcm5lbFNwZWNGaWx0ZXIoc3BlYylcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGtlcm5lbE5hbWVzID0gXy5tYXAoa2VybmVsU3BlY3MsIHNwZWNNb2RlbCA9PiBzcGVjTW9kZWwubmFtZSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBzZXNzaW9uTW9kZWxzID0gYXdhaXQgU2Vzc2lvbi5saXN0UnVubmluZyhzZXJ2ZXJTZXR0aW5ncyk7XG4gICAgICAgIHNlc3Npb25Nb2RlbHMgPSBzZXNzaW9uTW9kZWxzLmZpbHRlcihtb2RlbCA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IG1vZGVsLmtlcm5lbCA/IG1vZGVsLmtlcm5lbC5uYW1lIDogbnVsbDtcbiAgICAgICAgICByZXR1cm4gbmFtZSA/IGtlcm5lbE5hbWVzLmluY2x1ZGVzKG5hbWUpIDogdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gc2Vzc2lvbk1vZGVscy5tYXAobW9kZWwgPT4ge1xuICAgICAgICAgIGxldCBuYW1lO1xuICAgICAgICAgIGlmIChtb2RlbC5wYXRoKSB7XG4gICAgICAgICAgICBuYW1lID0gdGlsZGlmeShtb2RlbC5wYXRoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1vZGVsLm5vdGVib29rICYmIG1vZGVsLm5vdGVib29rLnBhdGgpIHtcbiAgICAgICAgICAgIG5hbWUgPSB0aWxkaWZ5KG1vZGVsLm5vdGVib29rLnBhdGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYW1lID0gYFNlc3Npb24gJHttb2RlbC5pZH1gO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4geyBuYW1lLCBtb2RlbCwgb3B0aW9uczogc2VydmVyU2V0dGluZ3MgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0ZW1zLnVuc2hpZnQoe1xuICAgICAgICAgIG5hbWU6IFwiW25ldyBzZXNzaW9uXVwiLFxuICAgICAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgICAgIG9wdGlvbnM6IHNlcnZlclNldHRpbmdzLFxuICAgICAgICAgIGtlcm5lbFNwZWNzXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gdGhpcy5vblNlc3Npb24uYmluZCh0aGlzLCBnYXRld2F5SW5mby5uYW1lKTtcbiAgICAgICAgYXdhaXQgdGhpcy5saXN0Vmlldy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbFxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICghZXJyb3IueGhyIHx8IGVycm9yLnhoci5zdGF0dXMgIT09IDQwMykgdGhyb3cgZXJyb3I7XG4gICAgICAgIC8vIEdhdGV3YXlzIG9mZmVyIHRoZSBvcHRpb24gb2YgbmV2ZXIgbGlzdGluZyBzZXNzaW9ucywgZm9yIHNlY3VyaXR5XG4gICAgICAgIC8vIHJlYXNvbnMuXG4gICAgICAgIC8vIEFzc3VtZSB0aGlzIGlzIHRoZSBjYXNlIGFuZCBwcm9jZWVkIHRvIGNyZWF0aW5nIGEgbmV3IHNlc3Npb24uXG4gICAgICAgIHRoaXMub25TZXNzaW9uKGdhdGV3YXlJbmZvLm5hbWUsIHtcbiAgICAgICAgICBuYW1lOiBcIltuZXcgc2Vzc2lvbl1cIixcbiAgICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgICBvcHRpb25zOiBzZXJ2ZXJTZXR0aW5ncyxcbiAgICAgICAgICBrZXJuZWxTcGVjc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJDb25uZWN0aW9uIHRvIGdhdGV3YXkgZmFpbGVkXCIpO1xuICAgICAgdGhpcy5saXN0Vmlldy5jYW5jZWwoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBvblNlc3Npb24oZ2F0ZXdheU5hbWU6IHN0cmluZywgc2Vzc2lvbkluZm86IGFueSkge1xuICAgIGlmICghc2Vzc2lvbkluZm8ubW9kZWwpIHtcbiAgICAgIGlmICghc2Vzc2lvbkluZm8ubmFtZSkge1xuICAgICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogXCJUaGlzIGdhdGV3YXkgZG9lcyBub3Qgc3VwcG9ydCBsaXN0aW5nIHNlc3Npb25zXCIsXG4gICAgICAgICAgbG9hZGluZ01lc3NhZ2U6IG51bGwsXG4gICAgICAgICAgaW5mb01lc3NhZ2U6IG51bGxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBjb25zdCBpdGVtcyA9IF8ubWFwKHNlc3Npb25JbmZvLmtlcm5lbFNwZWNzLCBzcGVjID0+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzZXJ2ZXJTZXR0aW5nczogc2Vzc2lvbkluZm8ub3B0aW9ucyxcbiAgICAgICAgICBrZXJuZWxOYW1lOiBzcGVjLm5hbWUsXG4gICAgICAgICAgcGF0aDogdGhpcy5fcGF0aFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IHNwZWMuZGlzcGxheV9uYW1lLFxuICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmxpc3RWaWV3Lm9uQ29uZmlybWVkID0gdGhpcy5zdGFydFNlc3Npb24uYmluZCh0aGlzLCBnYXRld2F5TmFtZSk7XG4gICAgICBhd2FpdCB0aGlzLmxpc3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7XG4gICAgICAgIGl0ZW1zOiBpdGVtcyxcbiAgICAgICAgZW1wdHlNZXNzYWdlOiBcIk5vIGtlcm5lbCBzcGVjcyBhdmFpbGFibGVcIixcbiAgICAgICAgaW5mb01lc3NhZ2U6IFwiU2VsZWN0IGEgc2Vzc2lvblwiLFxuICAgICAgICBsb2FkaW5nTWVzc2FnZTogbnVsbFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TZXNzaW9uQ2hvc2VuKFxuICAgICAgICBnYXRld2F5TmFtZSxcbiAgICAgICAgYXdhaXQgU2Vzc2lvbi5jb25uZWN0VG8oc2Vzc2lvbkluZm8ubW9kZWwuaWQsIHNlc3Npb25JbmZvLm9wdGlvbnMpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0U2Vzc2lvbihnYXRld2F5TmFtZTogc3RyaW5nLCBzZXNzaW9uSW5mbzogYW55KSB7XG4gICAgU2Vzc2lvbi5zdGFydE5ldyhzZXNzaW9uSW5mby5vcHRpb25zKS50aGVuKFxuICAgICAgdGhpcy5vblNlc3Npb25DaG9zZW4uYmluZCh0aGlzLCBnYXRld2F5TmFtZSlcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgb25TZXNzaW9uQ2hvc2VuKGdhdGV3YXlOYW1lOiBzdHJpbmcsIHNlc3Npb246IGFueSkge1xuICAgIHRoaXMubGlzdFZpZXcuY2FuY2VsKCk7XG4gICAgY29uc3Qga2VybmVsU3BlYyA9IGF3YWl0IHNlc3Npb24ua2VybmVsLmdldFNwZWMoKTtcbiAgICBpZiAoIXN0b3JlLmdyYW1tYXIpIHJldHVybjtcblxuICAgIGNvbnN0IGtlcm5lbCA9IG5ldyBXU0tlcm5lbChcbiAgICAgIGdhdGV3YXlOYW1lLFxuICAgICAga2VybmVsU3BlYyxcbiAgICAgIHN0b3JlLmdyYW1tYXIsXG4gICAgICBzZXNzaW9uXG4gICAgKTtcbiAgICB0aGlzLl9vbkNob3NlbihrZXJuZWwpO1xuICB9XG59XG4iXX0=