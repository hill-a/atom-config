Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _mobx = require("mobx");

var _lodash = require("lodash");

var _utils = require("./utils");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _storeWatches = require("./store/watches");

var _storeWatches2 = _interopRequireDefault(_storeWatches);

var _storeOutput = require("./store/output");

var _storeOutput2 = _interopRequireDefault(_storeOutput);

var _pluginApiHydrogenKernel = require("./plugin-api/hydrogen-kernel");

var _pluginApiHydrogenKernel2 = _interopRequireDefault(_pluginApiHydrogenKernel);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _kernelTransport = require("./kernel-transport");

var _kernelTransport2 = _interopRequireDefault(_kernelTransport);

function protectFromInvalidMessages(onResults) {
  var wrappedOnResults = function wrappedOnResults(message, channel) {
    if (!message) {
      (0, _utils.log)("Invalid message: null");
      return;
    }

    if (!message.content) {
      (0, _utils.log)("Invalid message: Missing content");
      return;
    }

    if (message.content.execution_state === "starting") {
      // Kernels send a starting status message with an empty parent_header
      (0, _utils.log)("Dropped starting status IO message");
      return;
    }

    if (!message.parent_header) {
      (0, _utils.log)("Invalid message: Missing parent_header");
      return;
    }

    if (!message.parent_header.msg_id) {
      (0, _utils.log)("Invalid message: Missing parent_header.msg_id");
      return;
    }

    if (!message.parent_header.msg_type) {
      (0, _utils.log)("Invalid message: Missing parent_header.msg_type");
      return;
    }

    if (!message.header) {
      (0, _utils.log)("Invalid message: Missing header");
      return;
    }

    if (!message.header.msg_id) {
      (0, _utils.log)("Invalid message: Missing header.msg_id");
      return;
    }

    if (!message.header.msg_type) {
      (0, _utils.log)("Invalid message: Missing header.msg_type");
      return;
    }

    onResults(message, channel);
  };
  return wrappedOnResults;
}

// Adapts middleware objects provided by plugins to an internal interface. In
// particular, this implements fallthrough logic for when a plugin defines some
// methods (e.g. execute) but doesn't implement others (e.g. interrupt). Note
// that HydrogenKernelMiddleware objects are mutable: they may lose/gain methods
// at any time, including in the middle of processing a request. This class also
// adds basic checks that messages passed via the `onResults` callbacks are not
// missing key mandatory fields specified in the Jupyter messaging spec.

var MiddlewareAdapter = (function () {
  function MiddlewareAdapter(middleware, next) {
    _classCallCheck(this, MiddlewareAdapter);

    this._middleware = middleware;
    this._next = next;
  }

  // The return value of this method gets passed to plugins! For now we just
  // return the MiddlewareAdapter object itself, which is why all private
  // functionality is prefixed with _, and why MiddlewareAdapter is marked as
  // implementing HydrogenKernelMiddlewareThunk. Once multiple plugin API
  // versions exist, we may want to generate a HydrogenKernelMiddlewareThunk
  // specialized for a particular plugin API version.

  _createClass(MiddlewareAdapter, [{
    key: "interrupt",
    value: function interrupt() {
      if (this._middleware.interrupt) {
        this._middleware.interrupt(this._nextAsPluginType);
      } else {
        this._next.interrupt();
      }
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      if (this._middleware.shutdown) {
        this._middleware.shutdown(this._nextAsPluginType);
      } else {
        this._next.shutdown();
      }
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      if (this._middleware.restart) {
        this._middleware.restart(this._nextAsPluginType, onRestarted);
      } else {
        this._next.restart(onRestarted);
      }
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      // We don't want to repeatedly wrap the onResults callback every time we
      // fall through, but we need to do it at least once before delegating to
      // the KernelTransport.
      var safeOnResults = this._middleware.execute || this._next instanceof _kernelTransport2["default"] ? protectFromInvalidMessages(onResults) : onResults;

      if (this._middleware.execute) {
        this._middleware.execute(this._nextAsPluginType, code, safeOnResults);
      } else {
        this._next.execute(code, safeOnResults);
      }
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      var safeOnResults = this._middleware.complete || this._next instanceof _kernelTransport2["default"] ? protectFromInvalidMessages(onResults) : onResults;

      if (this._middleware.complete) {
        this._middleware.complete(this._nextAsPluginType, code, safeOnResults);
      } else {
        this._next.complete(code, safeOnResults);
      }
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      var safeOnResults = this._middleware.inspect || this._next instanceof _kernelTransport2["default"] ? protectFromInvalidMessages(onResults) : onResults;
      if (this._middleware.inspect) {
        this._middleware.inspect(this._nextAsPluginType, code, cursorPos, safeOnResults);
      } else {
        this._next.inspect(code, cursorPos, safeOnResults);
      }
    }
  }, {
    key: "_nextAsPluginType",
    get: function get() {
      if (this._next instanceof _kernelTransport2["default"]) {
        throw new Error("MiddlewareAdapter: _nextAsPluginType must never be called when _next is KernelTransport");
      }
      return this._next;
    }
  }]);

  return MiddlewareAdapter;
})();

var Kernel = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(Kernel, [{
    key: "inspector",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return { bundle: {} };
    },
    enumerable: true
  }], null, _instanceInitializers);

  function Kernel(kernel) {
    _classCallCheck(this, Kernel);

    _defineDecoratedPropertyDescriptor(this, "inspector", _instanceInitializers);

    this.outputStore = new _storeOutput2["default"]();
    this.watchCallbacks = [];
    this.emitter = new _atom.Emitter();
    this.pluginWrapper = null;

    this.transport = kernel;

    this.watchesStore = new _storeWatches2["default"](this);

    // A MiddlewareAdapter that forwards all requests to `this.transport`.
    // Needed to terminate the middleware chain in a way such that the `next`
    // object passed to the last middleware is not the KernelTransport instance
    // itself (which would be violate isolation of internals from plugins).
    var delegateToTransport = new MiddlewareAdapter({}, this.transport);
    this.middleware = [delegateToTransport];
  }

  _createDecoratedClass(Kernel, [{
    key: "addMiddleware",
    value: function addMiddleware(middleware) {
      this.middleware.unshift(new MiddlewareAdapter(middleware, this.middleware[0]));
    }
  }, {
    key: "setExecutionState",
    value: function setExecutionState(state) {
      this.transport.setExecutionState(state);
    }
  }, {
    key: "setExecutionCount",
    value: function setExecutionCount(count) {
      this.transport.setExecutionCount(count);
    }
  }, {
    key: "setLastExecutionTime",
    value: function setLastExecutionTime(timeString) {
      this.transport.setLastExecutionTime(timeString);
    }
  }, {
    key: "setInspectorResult",
    decorators: [_mobx.action],
    value: _asyncToGenerator(function* (bundle, editor) {
      if ((0, _lodash.isEqual)(this.inspector.bundle, bundle)) {
        yield atom.workspace.toggle(_utils.INSPECTOR_URI);
      } else if (bundle.size !== 0) {
        this.inspector.bundle = bundle;
        yield atom.workspace.open(_utils.INSPECTOR_URI, { searchAllPanes: true });
      }
      (0, _utils.focus)(editor);
    })
  }, {
    key: "getPluginWrapper",
    value: function getPluginWrapper() {
      if (!this.pluginWrapper) {
        this.pluginWrapper = new _pluginApiHydrogenKernel2["default"](this);
      }

      return this.pluginWrapper;
    }
  }, {
    key: "addWatchCallback",
    value: function addWatchCallback(watchCallback) {
      this.watchCallbacks.push(watchCallback);
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      this.firstMiddlewareAdapter.interrupt();
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this.firstMiddlewareAdapter.shutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      this.firstMiddlewareAdapter.restart(onRestarted);
      this.setExecutionCount(0);
      this.setLastExecutionTime("No execution");
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      var _this = this;

      var wrappedOnResults = this._wrapExecutionResultsCallback(onResults);
      this.firstMiddlewareAdapter.execute(code, function (message, channel) {
        wrappedOnResults(message, channel);

        var msg_type = message.header.msg_type;

        if (msg_type === "execute_input") {
          _this.setLastExecutionTime("Running ...");
        }

        if (msg_type === "execute_reply") {
          var count = message.content.execution_count;
          _this.setExecutionCount(count);
          var timeString = (0, _utils.executionTime)(message);
          _this.setLastExecutionTime(timeString);
        }

        var execution_state = message.content.execution_state;

        if (channel == "iopub" && msg_type === "status" && execution_state === "idle") {
          _this._callWatchCallbacks();
        }
      });
    }
  }, {
    key: "executeWatch",
    value: function executeWatch(code, onResults) {
      this.firstMiddlewareAdapter.execute(code, this._wrapExecutionResultsCallback(onResults));
    }
  }, {
    key: "_callWatchCallbacks",
    value: function _callWatchCallbacks() {
      this.watchCallbacks.forEach(function (watchCallback) {
        return watchCallback();
      });
    }

    /*
     * Takes a callback that accepts execution results in a hydrogen-internal
     * format and wraps it to accept Jupyter message/channel pairs instead.
     * Kernels and plugins all operate on types specified by the Jupyter messaging
     * protocol in order to maximize compatibility, but hydrogen internally uses
     * its own types.
     */
  }, {
    key: "_wrapExecutionResultsCallback",
    value: function _wrapExecutionResultsCallback(onResults) {
      var _this2 = this;

      return function (message, channel) {
        if (channel === "shell") {
          var _status = message.content.status;

          if (_status === "error" || _status === "ok") {
            onResults({
              data: _status,
              stream: "status"
            });
          } else {
            console.warn("Kernel: ignoring unexpected value for message.content.status");
          }
        } else if (channel === "iopub") {
          if (message.header.msg_type === "execute_input") {
            onResults({
              data: message.content.execution_count,
              stream: "execution_count"
            });
          }

          // TODO(nikita): Consider converting to V5 elsewhere, so that plugins
          // never have to deal with messages in the V4 format
          var result = (0, _utils.msgSpecToNotebookFormat)((0, _utils.msgSpecV4toV5)(message));
          onResults(result);
        } else if (channel === "stdin") {
          if (message.header.msg_type !== "input_request") {
            return;
          }

          var _message$content = message.content;
          var _prompt = _message$content.prompt;
          var password = _message$content.password;

          // TODO(nikita): perhaps it would make sense to install middleware for
          // sending input replies
          var inputView = new _inputView2["default"]({ prompt: _prompt, password: password }, function (input) {
            return _this2.transport.inputReply(input);
          });

          inputView.attach();
        }
      };
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      this.firstMiddlewareAdapter.complete(code, function (message, channel) {
        if (channel !== "shell") {
          (0, _utils.log)("Invalid reply: wrong channel");
          return;
        }
        onResults(message.content);
      });
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      this.firstMiddlewareAdapter.inspect(code, cursorPos, function (message, channel) {
        if (channel !== "shell") {
          (0, _utils.log)("Invalid reply: wrong channel");
          return;
        }
        onResults({
          data: message.content.data,
          found: message.content.found
        });
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("Kernel: Destroying");
      // This is for cleanup to improve performance
      this.watchesStore.destroy();
      _store2["default"].deleteKernel(this);
      this.transport.destroy();
      if (this.pluginWrapper) {
        this.pluginWrapper.destroyed = true;
      }
      this.emitter.emit("did-destroy");
      this.emitter.dispose();
    }
  }, {
    key: "kernelSpec",
    get: function get() {
      return this.transport.kernelSpec;
    }
  }, {
    key: "grammar",
    get: function get() {
      return this.transport.grammar;
    }
  }, {
    key: "language",
    get: function get() {
      return this.transport.language;
    }
  }, {
    key: "displayName",
    get: function get() {
      return this.transport.displayName;
    }
  }, {
    key: "firstMiddlewareAdapter",
    get: function get() {
      return this.middleware[0];
    }
  }, {
    key: "executionState",
    decorators: [_mobx.computed],
    get: function get() {
      return this.transport.executionState;
    }
  }, {
    key: "executionCount",
    decorators: [_mobx.computed],
    get: function get() {
      return this.transport.executionCount;
    }
  }, {
    key: "lastExecutionTime",
    decorators: [_mobx.computed],
    get: function get() {
      return this.transport.lastExecutionTime;
    }
  }], null, _instanceInitializers);

  return Kernel;
})();

exports["default"] = Kernel;
module.exports = exports["default"];

// Invariant: the `._next` of each entry in this array must point to the next
// element of the array. The `._next` of the last element must point to
// `this.transport`.
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9rZXJuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFd0IsTUFBTTs7b0JBQ2UsTUFBTTs7c0JBQzNCLFFBQVE7O3FCQVF6QixTQUFTOztxQkFDRSxTQUFTOzs7OzRCQUVGLGlCQUFpQjs7OzsyQkFDbEIsZ0JBQWdCOzs7O3VDQUNiLDhCQUE4Qjs7Ozt5QkFLbkMsY0FBYzs7OzsrQkFDUixvQkFBb0I7Ozs7QUFJaEQsU0FBUywwQkFBMEIsQ0FDakMsU0FBMEIsRUFDVDtBQUNqQixNQUFNLGdCQUFpQyxHQUFHLFNBQXBDLGdCQUFpQyxDQUFJLE9BQU8sRUFBRSxPQUFPLEVBQUs7QUFDOUQsUUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLHNCQUFJLHVCQUF1QixDQUFDLENBQUM7QUFDN0IsYUFBTztLQUNSOztBQUVELFFBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ3BCLHNCQUFJLGtDQUFrQyxDQUFDLENBQUM7QUFDeEMsYUFBTztLQUNSOztBQUVELFFBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEtBQUssVUFBVSxFQUFFOztBQUVsRCxzQkFBSSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzFDLGFBQU87S0FDUjs7QUFFRCxRQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtBQUMxQixzQkFBSSx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzlDLGFBQU87S0FDUjs7QUFFRCxRQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7QUFDakMsc0JBQUksK0NBQStDLENBQUMsQ0FBQztBQUNyRCxhQUFPO0tBQ1I7O0FBRUQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO0FBQ25DLHNCQUFJLGlEQUFpRCxDQUFDLENBQUM7QUFDdkQsYUFBTztLQUNSOztBQUVELFFBQUksQ0FBQyxPQUFPLENBQUMsTUFB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QyxjQUFjLENBQUM7S0FDdEM7Ozs7U0FPaUIsZUFBVztBQUMzQixhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO0tBQ3RDOzs7O1NBT29CLGVBQVc7QUFDOUIsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO0tBQ3pDOzs7U0E3RWtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9rZXJuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBFbWl0dGVyIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCB7IG9ic2VydmFibGUsIGFjdGlvbiwgY29tcHV0ZWQgfSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IHsgaXNFcXVhbCB9IGZyb20gXCJsb2Rhc2hcIjtcblxuaW1wb3J0IHtcbiAgbG9nLFxuICBmb2N1cyxcbiAgbXNnU3BlY1RvTm90ZWJvb2tGb3JtYXQsXG4gIG1zZ1NwZWNWNHRvVjUsXG4gIElOU1BFQ1RPUl9VUklcbn0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBzdG9yZSBmcm9tIFwiLi9zdG9yZVwiO1xuXG5pbXBvcnQgV2F0Y2hlc1N0b3JlIGZyb20gXCIuL3N0b3JlL3dhdGNoZXNcIjtcbmltcG9ydCBPdXRwdXRTdG9yZSBmcm9tIFwiLi9zdG9yZS9vdXRwdXRcIjtcbmltcG9ydCBIeWRyb2dlbktlcm5lbCBmcm9tIFwiLi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLWtlcm5lbFwiO1xuaW1wb3J0IHR5cGUge1xuICBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmVUaHVuayxcbiAgSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlXG59IGZyb20gXCIuL3BsdWdpbi1hcGkvaHlkcm9nZW4tdHlwZXNcIjtcbmltcG9ydCBJbnB1dFZpZXcgZnJvbSBcIi4vaW5wdXQtdmlld1wiO1xuaW1wb3J0IEtlcm5lbFRyYW5zcG9ydCBmcm9tIFwiLi9rZXJuZWwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgdHlwZSB7IFJlc3VsdHNDYWxsYmFjayB9IGZyb20gXCIuL2tlcm5lbC10cmFuc3BvcnRcIjtcbmltcG9ydCB7IGV4ZWN1dGlvblRpbWUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5mdW5jdGlvbiBwcm90ZWN0RnJvbUludmFsaWRNZXNzYWdlcyhcbiAgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2tcbik6IFJlc3VsdHNDYWxsYmFjayB7XG4gIGNvbnN0IHdyYXBwZWRPblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjayA9IChtZXNzYWdlLCBjaGFubmVsKSA9PiB7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IG51bGxcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLmNvbnRlbnQpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBjb250ZW50XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChtZXNzYWdlLmNvbnRlbnQuZXhlY3V0aW9uX3N0YXRlID09PSBcInN0YXJ0aW5nXCIpIHtcbiAgICAgIC8vIEtlcm5lbHMgc2VuZCBhIHN0YXJ0aW5nIHN0YXR1cyBtZXNzYWdlIHdpdGggYW4gZW1wdHkgcGFyZW50X2hlYWRlclxuICAgICAgbG9nKFwiRHJvcHBlZCBzdGFydGluZyBzdGF0dXMgSU8gbWVzc2FnZVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UucGFyZW50X2hlYWRlcikge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIHBhcmVudF9oZWFkZXJcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLnBhcmVudF9oZWFkZXIubXNnX2lkKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgcGFyZW50X2hlYWRlci5tc2dfaWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLnBhcmVudF9oZWFkZXIubXNnX3R5cGUpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBwYXJlbnRfaGVhZGVyLm1zZ190eXBlXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5oZWFkZXIpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBoZWFkZXJcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLmhlYWRlci5tc2dfaWQpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBoZWFkZXIubXNnX2lkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5oZWFkZXIubXNnX3R5cGUpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBoZWFkZXIubXNnX3R5cGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb25SZXN1bHRzKG1lc3NhZ2UsIGNoYW5uZWwpO1xuICB9O1xuICByZXR1cm4gd3JhcHBlZE9uUmVzdWx0cztcbn1cblxuLy8gQWRhcHRzIG1pZGRsZXdhcmUgb2JqZWN0cyBwcm92aWRlZCBieSBwbHVnaW5zIHRvIGFuIGludGVybmFsIGludGVyZmFjZS4gSW5cbi8vIHBhcnRpY3VsYXIsIHRoaXMgaW1wbGVtZW50cyBmYWxsdGhyb3VnaCBsb2dpYyBmb3Igd2hlbiBhIHBsdWdpbiBkZWZpbmVzIHNvbWVcbi8vIG1ldGhvZHMgKGUuZy4gZXhlY3V0ZSkgYnV0IGRvZXNuJ3QgaW1wbGVtZW50IG90aGVycyAoZS5nLiBpbnRlcnJ1cHQpLiBOb3RlXG4vLyB0aGF0IEh5ZHJvZ2VuS2VybmVsTWlkZGxld2FyZSBvYmplY3RzIGFyZSBtdXRhYmxlOiB0aGV5IG1heSBsb3NlL2dhaW4gbWV0aG9kc1xuLy8gYXQgYW55IHRpbWUsIGluY2x1ZGluZyBpbiB0aGUgbWlkZGxlIG9mIHByb2Nlc3NpbmcgYSByZXF1ZXN0LiBUaGlzIGNsYXNzIGFsc29cbi8vIGFkZHMgYmFzaWMgY2hlY2tzIHRoYXQgbWVzc2FnZXMgcGFzc2VkIHZpYSB0aGUgYG9uUmVzdWx0c2AgY2FsbGJhY2tzIGFyZSBub3Rcbi8vIG1pc3Npbmcga2V5IG1hbmRhdG9yeSBmaWVsZHMgc3BlY2lmaWVkIGluIHRoZSBKdXB5dGVyIG1lc3NhZ2luZyBzcGVjLlxuY2xhc3MgTWlkZGxld2FyZUFkYXB0ZXIgaW1wbGVtZW50cyBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmVUaHVuayB7XG4gIF9taWRkbGV3YXJlOiBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmU7XG4gIF9uZXh0OiBNaWRkbGV3YXJlQWRhcHRlciB8IEtlcm5lbFRyYW5zcG9ydDtcbiAgY29uc3RydWN0b3IoXG4gICAgbWlkZGxld2FyZTogSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlLFxuICAgIG5leHQ6IE1pZGRsZXdhcmVBZGFwdGVyIHwgS2VybmVsVHJhbnNwb3J0XG4gICkge1xuICAgIHRoaXMuX21pZGRsZXdhcmUgPSBtaWRkbGV3YXJlO1xuICAgIHRoaXMuX25leHQgPSBuZXh0O1xuICB9XG5cbiAgLy8gVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIG1ldGhvZCBnZXRzIHBhc3NlZCB0byBwbHVnaW5zISBGb3Igbm93IHdlIGp1c3RcbiAgLy8gcmV0dXJuIHRoZSBNaWRkbGV3YXJlQWRhcHRlciBvYmplY3QgaXRzZWxmLCB3aGljaCBpcyB3aHkgYWxsIHByaXZhdGVcbiAgLy8gZnVuY3Rpb25hbGl0eSBpcyBwcmVmaXhlZCB3aXRoIF8sIGFuZCB3aHkgTWlkZGxld2FyZUFkYXB0ZXIgaXMgbWFya2VkIGFzXG4gIC8vIGltcGxlbWVudGluZyBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmVUaHVuay4gT25jZSBtdWx0aXBsZSBwbHVnaW4gQVBJXG4gIC8vIHZlcnNpb25zIGV4aXN0LCB3ZSBtYXkgd2FudCB0byBnZW5lcmF0ZSBhIEh5ZHJvZ2VuS2VybmVsTWlkZGxld2FyZVRodW5rXG4gIC8vIHNwZWNpYWxpemVkIGZvciBhIHBhcnRpY3VsYXIgcGx1Z2luIEFQSSB2ZXJzaW9uLlxuICBnZXQgX25leHRBc1BsdWdpblR5cGUoKTogSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlVGh1bmsge1xuICAgIGlmICh0aGlzLl9uZXh0IGluc3RhbmNlb2YgS2VybmVsVHJhbnNwb3J0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiTWlkZGxld2FyZUFkYXB0ZXI6IF9uZXh0QXNQbHVnaW5UeXBlIG11c3QgbmV2ZXIgYmUgY2FsbGVkIHdoZW4gX25leHQgaXMgS2VybmVsVHJhbnNwb3J0XCJcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uZXh0O1xuICB9XG5cbiAgaW50ZXJydXB0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9taWRkbGV3YXJlLmludGVycnVwdCkge1xuICAgICAgdGhpcy5fbWlkZGxld2FyZS5pbnRlcnJ1cHQodGhpcy5fbmV4dEFzUGx1Z2luVHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25leHQuaW50ZXJydXB0KCk7XG4gICAgfVxuICB9XG5cbiAgc2h1dGRvd24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21pZGRsZXdhcmUuc2h1dGRvd24pIHtcbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuc2h1dGRvd24odGhpcy5fbmV4dEFzUGx1Z2luVHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25leHQuc2h1dGRvd24oKTtcbiAgICB9XG4gIH1cblxuICByZXN0YXJ0KG9uUmVzdGFydGVkOiA/RnVuY3Rpb24pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbWlkZGxld2FyZS5yZXN0YXJ0KSB7XG4gICAgICB0aGlzLl9taWRkbGV3YXJlLnJlc3RhcnQodGhpcy5fbmV4dEFzUGx1Z2luVHlwZSwgb25SZXN0YXJ0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZXh0LnJlc3RhcnQob25SZXN0YXJ0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjayk6IHZvaWQge1xuICAgIC8vIFdlIGRvbid0IHdhbnQgdG8gcmVwZWF0ZWRseSB3cmFwIHRoZSBvblJlc3VsdHMgY2FsbGJhY2sgZXZlcnkgdGltZSB3ZVxuICAgIC8vIGZhbGwgdGhyb3VnaCwgYnV0IHdlIG5lZWQgdG8gZG8gaXQgYXQgbGVhc3Qgb25jZSBiZWZvcmUgZGVsZWdhdGluZyB0b1xuICAgIC8vIHRoZSBLZXJuZWxUcmFuc3BvcnQuXG4gICAgbGV0IHNhZmVPblJlc3VsdHMgPVxuICAgICAgdGhpcy5fbWlkZGxld2FyZS5leGVjdXRlIHx8IHRoaXMuX25leHQgaW5zdGFuY2VvZiBLZXJuZWxUcmFuc3BvcnRcbiAgICAgICAgPyBwcm90ZWN0RnJvbUludmFsaWRNZXNzYWdlcyhvblJlc3VsdHMpXG4gICAgICAgIDogb25SZXN1bHRzO1xuXG4gICAgaWYgKHRoaXMuX21pZGRsZXdhcmUuZXhlY3V0ZSkge1xuICAgICAgdGhpcy5fbWlkZGxld2FyZS5leGVjdXRlKHRoaXMuX25leHRBc1BsdWdpblR5cGUsIGNvZGUsIHNhZmVPblJlc3VsdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZXh0LmV4ZWN1dGUoY29kZSwgc2FmZU9uUmVzdWx0cyk7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjayk6IHZvaWQge1xuICAgIGxldCBzYWZlT25SZXN1bHRzID1cbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuY29tcGxldGUgfHwgdGhpcy5fbmV4dCBpbnN0YW5jZW9mIEtlcm5lbFRyYW5zcG9ydFxuICAgICAgICA/IHByb3RlY3RGcm9tSW52YWxpZE1lc3NhZ2VzKG9uUmVzdWx0cylcbiAgICAgICAgOiBvblJlc3VsdHM7XG5cbiAgICBpZiAodGhpcy5fbWlkZGxld2FyZS5jb21wbGV0ZSkge1xuICAgICAgdGhpcy5fbWlkZGxld2FyZS5jb21wbGV0ZSh0aGlzLl9uZXh0QXNQbHVnaW5UeXBlLCBjb2RlLCBzYWZlT25SZXN1bHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbmV4dC5jb21wbGV0ZShjb2RlLCBzYWZlT25SZXN1bHRzKTtcbiAgICB9XG4gIH1cblxuICBpbnNwZWN0KGNvZGU6IHN0cmluZywgY3Vyc29yUG9zOiBudW1iZXIsIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrKTogdm9pZCB7XG4gICAgbGV0IHNhZmVPblJlc3VsdHMgPVxuICAgICAgdGhpcy5fbWlkZGxld2FyZS5pbnNwZWN0IHx8IHRoaXMuX25leHQgaW5zdGFuY2VvZiBLZXJuZWxUcmFuc3BvcnRcbiAgICAgICAgPyBwcm90ZWN0RnJvbUludmFsaWRNZXNzYWdlcyhvblJlc3VsdHMpXG4gICAgICAgIDogb25SZXN1bHRzO1xuICAgIGlmICh0aGlzLl9taWRkbGV3YXJlLmluc3BlY3QpIHtcbiAgICAgIHRoaXMuX21pZGRsZXdhcmUuaW5zcGVjdChcbiAgICAgICAgdGhpcy5fbmV4dEFzUGx1Z2luVHlwZSxcbiAgICAgICAgY29kZSxcbiAgICAgICAgY3Vyc29yUG9zLFxuICAgICAgICBzYWZlT25SZXN1bHRzXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uZXh0Lmluc3BlY3QoY29kZSwgY3Vyc29yUG9zLCBzYWZlT25SZXN1bHRzKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2VybmVsIHtcbiAgQG9ic2VydmFibGVcbiAgaW5zcGVjdG9yID0geyBidW5kbGU6IHt9IH07XG4gIG91dHB1dFN0b3JlID0gbmV3IE91dHB1dFN0b3JlKCk7XG5cbiAgd2F0Y2hlc1N0b3JlOiBXYXRjaGVzU3RvcmU7XG4gIHdhdGNoQ2FsbGJhY2tzOiBBcnJheTxGdW5jdGlvbj4gPSBbXTtcblxuICBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgcGx1Z2luV3JhcHBlcjogSHlkcm9nZW5LZXJuZWwgfCBudWxsID0gbnVsbDtcbiAgdHJhbnNwb3J0OiBLZXJuZWxUcmFuc3BvcnQ7XG5cbiAgLy8gSW52YXJpYW50OiB0aGUgYC5fbmV4dGAgb2YgZWFjaCBlbnRyeSBpbiB0aGlzIGFycmF5IG11c3QgcG9pbnQgdG8gdGhlIG5leHRcbiAgLy8gZWxlbWVudCBvZiB0aGUgYXJyYXkuIFRoZSBgLl9uZXh0YCBvZiB0aGUgbGFzdCBlbGVtZW50IG11c3QgcG9pbnQgdG9cbiAgLy8gYHRoaXMudHJhbnNwb3J0YC5cbiAgbWlkZGxld2FyZTogQXJyYXk8TWlkZGxld2FyZUFkYXB0ZXI+O1xuXG4gIGNvbnN0cnVjdG9yKGtlcm5lbDogS2VybmVsVHJhbnNwb3J0KSB7XG4gICAgdGhpcy50cmFuc3BvcnQgPSBrZXJuZWw7XG5cbiAgICB0aGlzLndhdGNoZXNTdG9yZSA9IG5ldyBXYXRjaGVzU3RvcmUodGhpcyk7XG5cbiAgICAvLyBBIE1pZGRsZXdhcmVBZGFwdGVyIHRoYXQgZm9yd2FyZHMgYWxsIHJlcXVlc3RzIHRvIGB0aGlzLnRyYW5zcG9ydGAuXG4gICAgLy8gTmVlZGVkIHRvIHRlcm1pbmF0ZSB0aGUgbWlkZGxld2FyZSBjaGFpbiBpbiBhIHdheSBzdWNoIHRoYXQgdGhlIGBuZXh0YFxuICAgIC8vIG9iamVjdCBwYXNzZWQgdG8gdGhlIGxhc3QgbWlkZGxld2FyZSBpcyBub3QgdGhlIEtlcm5lbFRyYW5zcG9ydCBpbnN0YW5jZVxuICAgIC8vIGl0c2VsZiAod2hpY2ggd291bGQgYmUgdmlvbGF0ZSBpc29sYXRpb24gb2YgaW50ZXJuYWxzIGZyb20gcGx1Z2lucykuXG4gICAgY29uc3QgZGVsZWdhdGVUb1RyYW5zcG9ydCA9IG5ldyBNaWRkbGV3YXJlQWRhcHRlcih7fSwgdGhpcy50cmFuc3BvcnQpO1xuICAgIHRoaXMubWlkZGxld2FyZSA9IFtkZWxlZ2F0ZVRvVHJhbnNwb3J0XTtcbiAgfVxuXG4gIGdldCBrZXJuZWxTcGVjKCk6IEtlcm5lbHNwZWMge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5rZXJuZWxTcGVjO1xuICB9XG5cbiAgZ2V0IGdyYW1tYXIoKTogYXRvbSRHcmFtbWFyIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuZ3JhbW1hcjtcbiAgfVxuXG4gIGdldCBsYW5ndWFnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5sYW5ndWFnZTtcbiAgfVxuXG4gIGdldCBkaXNwbGF5TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5kaXNwbGF5TmFtZTtcbiAgfVxuXG4gIGdldCBmaXJzdE1pZGRsZXdhcmVBZGFwdGVyKCk6IE1pZGRsZXdhcmVBZGFwdGVyIHtcbiAgICByZXR1cm4gdGhpcy5taWRkbGV3YXJlWzBdO1xuICB9XG5cbiAgYWRkTWlkZGxld2FyZShtaWRkbGV3YXJlOiBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmUpIHtcbiAgICB0aGlzLm1pZGRsZXdhcmUudW5zaGlmdChcbiAgICAgIG5ldyBNaWRkbGV3YXJlQWRhcHRlcihtaWRkbGV3YXJlLCB0aGlzLm1pZGRsZXdhcmVbMF0pXG4gICAgKTtcbiAgfVxuXG4gIEBjb21wdXRlZFxuICBnZXQgZXhlY3V0aW9uU3RhdGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc3BvcnQuZXhlY3V0aW9uU3RhdGU7XG4gIH1cblxuICBzZXRFeGVjdXRpb25TdGF0ZShzdGF0ZTogc3RyaW5nKSB7XG4gICAgdGhpcy50cmFuc3BvcnQuc2V0RXhlY3V0aW9uU3RhdGUoc3RhdGUpO1xuICB9XG5cbiAgQGNvbXB1dGVkXG4gIGdldCBleGVjdXRpb25Db3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnRyYW5zcG9ydC5leGVjdXRpb25Db3VudDtcbiAgfVxuXG4gIHNldEV4ZWN1dGlvbkNvdW50KGNvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLnRyYW5zcG9ydC5zZXRFeGVjdXRpb25Db3VudChjb3VudCk7XG4gIH1cblxuICBAY29tcHV0ZWRcbiAgZ2V0IGxhc3RFeGVjdXRpb25UaW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNwb3J0Lmxhc3RFeGVjdXRpb25UaW1lO1xuICB9XG5cbiAgc2V0TGFzdEV4ZWN1dGlvblRpbWUodGltZVN0cmluZzogc3RyaW5nKSB7XG4gICAgdGhpcy50cmFuc3BvcnQuc2V0TGFzdEV4ZWN1dGlvblRpbWUodGltZVN0cmluZyk7XG4gIH1cblxuICBAYWN0aW9uXG4gIGFzeW5jIHNldEluc3BlY3RvclJlc3VsdChidW5kbGU6IE9iamVjdCwgZWRpdG9yOiA/YXRvbSRUZXh0RWRpdG9yKSB7XG4gICAgaWYgKGlzRXF1YWwodGhpcy5pbnNwZWN0b3IuYnVuZGxlLCBidW5kbGUpKSB7XG4gICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS50b2dnbGUoSU5TUEVDVE9SX1VSSSk7XG4gICAgfSBlbHNlIGlmIChidW5kbGUuc2l6ZSAhPT0gMCkge1xuICAgICAgdGhpcy5pbnNwZWN0b3IuYnVuZGxlID0gYnVuZGxlO1xuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihJTlNQRUNUT1JfVVJJLCB7IHNlYXJjaEFsbFBhbmVzOiB0cnVlIH0pO1xuICAgIH1cbiAgICBmb2N1cyhlZGl0b3IpO1xuICB9XG5cbiAgZ2V0UGx1Z2luV3JhcHBlcigpIHtcbiAgICBpZiAoIXRoaXMucGx1Z2luV3JhcHBlcikge1xuICAgICAgdGhpcy5wbHVnaW5XcmFwcGVyID0gbmV3IEh5ZHJvZ2VuS2VybmVsKHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBsdWdpbldyYXBwZXI7XG4gIH1cblxuICBhZGRXYXRjaENhbGxiYWNrKHdhdGNoQ2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy53YXRjaENhbGxiYWNrcy5wdXNoKHdhdGNoQ2FsbGJhY2spO1xuICB9XG5cbiAgaW50ZXJydXB0KCkge1xuICAgIHRoaXMuZmlyc3RNaWRkbGV3YXJlQWRhcHRlci5pbnRlcnJ1cHQoKTtcbiAgfVxuXG4gIHNodXRkb3duKCkge1xuICAgIHRoaXMuZmlyc3RNaWRkbGV3YXJlQWRhcHRlci5zaHV0ZG93bigpO1xuICB9XG5cbiAgcmVzdGFydChvblJlc3RhcnRlZDogP0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5maXJzdE1pZGRsZXdhcmVBZGFwdGVyLnJlc3RhcnQob25SZXN0YXJ0ZWQpO1xuICAgIHRoaXMuc2V0RXhlY3V0aW9uQ291bnQoMCk7XG4gICAgdGhpcy5zZXRMYXN0RXhlY3V0aW9uVGltZShcIk5vIGV4ZWN1dGlvblwiKTtcbiAgfVxuXG4gIGV4ZWN1dGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgY29uc3Qgd3JhcHBlZE9uUmVzdWx0cyA9IHRoaXMuX3dyYXBFeGVjdXRpb25SZXN1bHRzQ2FsbGJhY2sob25SZXN1bHRzKTtcbiAgICB0aGlzLmZpcnN0TWlkZGxld2FyZUFkYXB0ZXIuZXhlY3V0ZShcbiAgICAgIGNvZGUsXG4gICAgICAobWVzc2FnZTogTWVzc2FnZSwgY2hhbm5lbDogc3RyaW5nKSA9PiB7XG4gICAgICAgIHdyYXBwZWRPblJlc3VsdHMobWVzc2FnZSwgY2hhbm5lbCk7XG5cbiAgICAgICAgY29uc3QgeyBtc2dfdHlwZSB9ID0gbWVzc2FnZS5oZWFkZXI7XG4gICAgICAgIGlmIChtc2dfdHlwZSA9PT0gXCJleGVjdXRlX2lucHV0XCIpIHtcbiAgICAgICAgICB0aGlzLnNldExhc3RFeGVjdXRpb25UaW1lKFwiUnVubmluZyAuLi5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobXNnX3R5cGUgPT09IFwiZXhlY3V0ZV9yZXBseVwiKSB7XG4gICAgICAgICAgY29uc3QgY291bnQgPSBtZXNzYWdlLmNvbnRlbnQuZXhlY3V0aW9uX2NvdW50O1xuICAgICAgICAgIHRoaXMuc2V0RXhlY3V0aW9uQ291bnQoY291bnQpO1xuICAgICAgICAgIGNvbnN0IHRpbWVTdHJpbmcgPSBleGVjdXRpb25UaW1lKG1lc3NhZ2UpO1xuICAgICAgICAgIHRoaXMuc2V0TGFzdEV4ZWN1dGlvblRpbWUodGltZVN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGV4ZWN1dGlvbl9zdGF0ZSB9ID0gbWVzc2FnZS5jb250ZW50O1xuICAgICAgICBpZiAoXG4gICAgICAgICAgY2hhbm5lbCA9PSBcImlvcHViXCIgJiZcbiAgICAgICAgICBtc2dfdHlwZSA9PT0gXCJzdGF0dXNcIiAmJlxuICAgICAgICAgIGV4ZWN1dGlvbl9zdGF0ZSA9PT0gXCJpZGxlXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fY2FsbFdhdGNoQ2FsbGJhY2tzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZVdhdGNoKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBGdW5jdGlvbikge1xuICAgIHRoaXMuZmlyc3RNaWRkbGV3YXJlQWRhcHRlci5leGVjdXRlKFxuICAgICAgY29kZSxcbiAgICAgIHRoaXMuX3dyYXBFeGVjdXRpb25SZXN1bHRzQ2FsbGJhY2sob25SZXN1bHRzKVxuICAgICk7XG4gIH1cblxuICBfY2FsbFdhdGNoQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMud2F0Y2hDYWxsYmFja3MuZm9yRWFjaCh3YXRjaENhbGxiYWNrID0+IHdhdGNoQ2FsbGJhY2soKSk7XG4gIH1cblxuICAvKlxuICAgKiBUYWtlcyBhIGNhbGxiYWNrIHRoYXQgYWNjZXB0cyBleGVjdXRpb24gcmVzdWx0cyBpbiBhIGh5ZHJvZ2VuLWludGVybmFsXG4gICAqIGZvcm1hdCBhbmQgd3JhcHMgaXQgdG8gYWNjZXB0IEp1cHl0ZXIgbWVzc2FnZS9jaGFubmVsIHBhaXJzIGluc3RlYWQuXG4gICAqIEtlcm5lbHMgYW5kIHBsdWdpbnMgYWxsIG9wZXJhdGUgb24gdHlwZXMgc3BlY2lmaWVkIGJ5IHRoZSBKdXB5dGVyIG1lc3NhZ2luZ1xuICAgKiBwcm90b2NvbCBpbiBvcmRlciB0byBtYXhpbWl6ZSBjb21wYXRpYmlsaXR5LCBidXQgaHlkcm9nZW4gaW50ZXJuYWxseSB1c2VzXG4gICAqIGl0cyBvd24gdHlwZXMuXG4gICAqL1xuICBfd3JhcEV4ZWN1dGlvblJlc3VsdHNDYWxsYmFjayhvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIChtZXNzYWdlOiBNZXNzYWdlLCBjaGFubmVsOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChjaGFubmVsID09PSBcInNoZWxsXCIpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IG1lc3NhZ2UuY29udGVudDtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gXCJlcnJvclwiIHx8IHN0YXR1cyA9PT0gXCJva1wiKSB7XG4gICAgICAgICAgb25SZXN1bHRzKHtcbiAgICAgICAgICAgIGRhdGE6IHN0YXR1cyxcbiAgICAgICAgICAgIHN0cmVhbTogXCJzdGF0dXNcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIFwiS2VybmVsOiBpZ25vcmluZyB1bmV4cGVjdGVkIHZhbHVlIGZvciBtZXNzYWdlLmNvbnRlbnQuc3RhdHVzXCJcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09IFwiaW9wdWJcIikge1xuICAgICAgICBpZiAobWVzc2FnZS5oZWFkZXIubXNnX3R5cGUgPT09IFwiZXhlY3V0ZV9pbnB1dFwiKSB7XG4gICAgICAgICAgb25SZXN1bHRzKHtcbiAgICAgICAgICAgIGRhdGE6IG1lc3NhZ2UuY29udGVudC5leGVjdXRpb25fY291bnQsXG4gICAgICAgICAgICBzdHJlYW06IFwiZXhlY3V0aW9uX2NvdW50XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE8obmlraXRhKTogQ29uc2lkZXIgY29udmVydGluZyB0byBWNSBlbHNld2hlcmUsIHNvIHRoYXQgcGx1Z2luc1xuICAgICAgICAvLyBuZXZlciBoYXZlIHRvIGRlYWwgd2l0aCBtZXNzYWdlcyBpbiB0aGUgVjQgZm9ybWF0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG1zZ1NwZWNUb05vdGVib29rRm9ybWF0KG1zZ1NwZWNWNHRvVjUobWVzc2FnZSkpO1xuICAgICAgICBvblJlc3VsdHMocmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gXCJzdGRpblwiKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmhlYWRlci5tc2dfdHlwZSAhPT0gXCJpbnB1dF9yZXF1ZXN0XCIpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IHByb21wdCwgcGFzc3dvcmQgfSA9IG1lc3NhZ2UuY29udGVudDtcblxuICAgICAgICAvLyBUT0RPKG5pa2l0YSk6IHBlcmhhcHMgaXQgd291bGQgbWFrZSBzZW5zZSB0byBpbnN0YWxsIG1pZGRsZXdhcmUgZm9yXG4gICAgICAgIC8vIHNlbmRpbmcgaW5wdXQgcmVwbGllc1xuICAgICAgICBjb25zdCBpbnB1dFZpZXcgPSBuZXcgSW5wdXRWaWV3KHsgcHJvbXB0LCBwYXNzd29yZCB9LCAoaW5wdXQ6IHN0cmluZykgPT5cbiAgICAgICAgICB0aGlzLnRyYW5zcG9ydC5pbnB1dFJlcGx5KGlucHV0KVxuICAgICAgICApO1xuXG4gICAgICAgIGlucHV0Vmlldy5hdHRhY2goKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IEZ1bmN0aW9uKSB7XG4gICAgdGhpcy5maXJzdE1pZGRsZXdhcmVBZGFwdGVyLmNvbXBsZXRlKFxuICAgICAgY29kZSxcbiAgICAgIChtZXNzYWdlOiBNZXNzYWdlLCBjaGFubmVsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKGNoYW5uZWwgIT09IFwic2hlbGxcIikge1xuICAgICAgICAgIGxvZyhcIkludmFsaWQgcmVwbHk6IHdyb25nIGNoYW5uZWxcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG9uUmVzdWx0cyhtZXNzYWdlLmNvbnRlbnQpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBpbnNwZWN0KGNvZGU6IHN0cmluZywgY3Vyc29yUG9zOiBudW1iZXIsIG9uUmVzdWx0czogRnVuY3Rpb24pIHtcbiAgICB0aGlzLmZpcnN0TWlkZGxld2FyZUFkYXB0ZXIuaW5zcGVjdChcbiAgICAgIGNvZGUsXG4gICAgICBjdXJzb3JQb3MsXG4gICAgICAobWVzc2FnZTogTWVzc2FnZSwgY2hhbm5lbDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmIChjaGFubmVsICE9PSBcInNoZWxsXCIpIHtcbiAgICAgICAgICBsb2coXCJJbnZhbGlkIHJlcGx5OiB3cm9uZyBjaGFubmVsXCIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvblJlc3VsdHMoe1xuICAgICAgICAgIGRhdGE6IG1lc3NhZ2UuY29udGVudC5kYXRhLFxuICAgICAgICAgIGZvdW5kOiBtZXNzYWdlLmNvbnRlbnQuZm91bmRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgbG9nKFwiS2VybmVsOiBEZXN0cm95aW5nXCIpO1xuICAgIC8vIFRoaXMgaXMgZm9yIGNsZWFudXAgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgIHRoaXMud2F0Y2hlc1N0b3JlLmRlc3Ryb3koKTtcbiAgICBzdG9yZS5kZWxldGVLZXJuZWwodGhpcyk7XG4gICAgdGhpcy50cmFuc3BvcnQuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLnBsdWdpbldyYXBwZXIpIHtcbiAgICAgIHRoaXMucGx1Z2luV3JhcHBlci5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdChcImRpZC1kZXN0cm95XCIpO1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==