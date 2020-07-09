Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _utils = require("./utils");

var KernelTransport = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(KernelTransport, [{
    key: "executionState",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "loading";
    },
    enumerable: true
  }, {
    key: "executionCount",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return 0;
    },
    enumerable: true
  }, {
    key: "lastExecutionTime",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "No execution";
    },
    enumerable: true
  }, {
    key: "inspector",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return { bundle: {} };
    },
    enumerable: true
  }], null, _instanceInitializers);

  function KernelTransport(kernelSpec, grammar) {
    _classCallCheck(this, KernelTransport);

    _defineDecoratedPropertyDescriptor(this, "executionState", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "executionCount", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "lastExecutionTime", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "inspector", _instanceInitializers);

    this.kernelSpec = kernelSpec;
    this.grammar = grammar;

    this.language = kernelSpec.language.toLowerCase();
    this.displayName = kernelSpec.display_name;
  }

  _createDecoratedClass(KernelTransport, [{
    key: "setExecutionState",
    decorators: [_mobx.action],
    value: function setExecutionState(state) {
      this.executionState = state;
    }
  }, {
    key: "setExecutionCount",
    decorators: [_mobx.action],
    value: function setExecutionCount(count) {
      this.executionCount = count;
    }
  }, {
    key: "setLastExecutionTime",
    decorators: [_mobx.action],
    value: function setLastExecutionTime(timeString) {
      this.lastExecutionTime = timeString;
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      throw new Error("KernelTransport: interrupt method not implemented");
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      throw new Error("KernelTransport: shutdown method not implemented");
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      throw new Error("KernelTransport: restart method not implemented");
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      throw new Error("KernelTransport: execute method not implemented");
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      throw new Error("KernelTransport: complete method not implemented");
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      throw new Error("KernelTransport: inspect method not implemented");
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      throw new Error("KernelTransport: inputReply method not implemented");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("KernelTransport: Destroying base kernel");
    }
  }], null, _instanceInitializers);

  return KernelTransport;
})();

exports["default"] = KernelTransport;
module.exports = exports["default"];

// Only `WSKernel` would have `gatewayName` property and thus not initialize it here,
// still `KernelTransport` is better to have `gatewayName` property for code simplicity in the other parts of code
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9rZXJuZWwtdHJhbnNwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRW1DLE1BQU07O3FCQUVyQixTQUFTOztJQU9SLGVBQWU7Ozs7d0JBQWYsZUFBZTs7OzthQUVqQixTQUFTOzs7Ozs7O2FBRVQsQ0FBQzs7Ozs7OzthQUVFLGNBQWM7Ozs7Ozs7YUFFdEIsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFOzs7OztBQVdmLFdBbkJRLGVBQWUsQ0FtQnRCLFVBQXNCLEVBQUUsT0FBcUIsRUFBRTswQkFuQnhDLGVBQWU7Ozs7Ozs7Ozs7QUFvQmhDLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUV2QixRQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbEQsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO0dBQzVDOzt3QkF6QmtCLGVBQWU7OztXQTRCakIsMkJBQUMsS0FBYSxFQUFFO0FBQy9CLFVBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQzdCOzs7O1dBR2dCLDJCQUFDLEtBQWEsRUFBRTtBQUMvQixVQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztLQUM3Qjs7OztXQUdtQiw4QkFBQyxVQUFrQixFQUFFO0FBQ3ZDLFVBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUM7S0FDckM7OztXQUVRLHFCQUFHO0FBQ1YsWUFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0tBQ3RFOzs7V0FFTyxvQkFBRztBQUNULFlBQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztLQUNyRTs7O1dBRU0saUJBQUMsV0FBc0IsRUFBRTtBQUM5QixZQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7S0FDcEU7OztXQUVNLGlCQUFDLElBQVksRUFBRSxTQUEwQixFQUFFO0FBQ2hELFlBQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztLQUNwRTs7O1dBRU8sa0JBQUMsSUFBWSxFQUFFLFNBQTBCLEVBQUU7QUFDakQsWUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0tBQ3JFOzs7V0FFTSxpQkFBQyxJQUFZLEVBQUUsU0FBaUIsRUFBRSxTQUEwQixFQUFFO0FBQ25FLFlBQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztLQUNwRTs7O1dBRVMsb0JBQUMsS0FBYSxFQUFFO0FBQ3hCLFlBQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztLQUN2RTs7O1dBRU0sbUJBQUc7QUFDUixzQkFBSSx5Q0FBeUMsQ0FBQyxDQUFDO0tBQ2hEOzs7U0F4RWtCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9rZXJuZWwtdHJhbnNwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgb2JzZXJ2YWJsZSwgYWN0aW9uIH0gZnJvbSBcIm1vYnhcIjtcblxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgUmVzdWx0c0NhbGxiYWNrID0gKFxuICBtZXNzYWdlOiBhbnksXG4gIGNoYW5uZWw6IFwic2hlbGxcIiB8IFwiaW9wdWJcIiB8IFwic3RkaW5cIlxuKSA9PiB2b2lkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXJuZWxUcmFuc3BvcnQge1xuICBAb2JzZXJ2YWJsZVxuICBleGVjdXRpb25TdGF0ZSA9IFwibG9hZGluZ1wiO1xuICBAb2JzZXJ2YWJsZVxuICBleGVjdXRpb25Db3VudCA9IDA7XG4gIEBvYnNlcnZhYmxlXG4gIGxhc3RFeGVjdXRpb25UaW1lID0gXCJObyBleGVjdXRpb25cIjtcbiAgQG9ic2VydmFibGVcbiAgaW5zcGVjdG9yID0geyBidW5kbGU6IHt9IH07XG5cbiAga2VybmVsU3BlYzogS2VybmVsc3BlYztcbiAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyO1xuICBsYW5ndWFnZTogc3RyaW5nO1xuICBkaXNwbGF5TmFtZTogc3RyaW5nO1xuXG4gIC8vIE9ubHkgYFdTS2VybmVsYCB3b3VsZCBoYXZlIGBnYXRld2F5TmFtZWAgcHJvcGVydHkgYW5kIHRodXMgbm90IGluaXRpYWxpemUgaXQgaGVyZSxcbiAgLy8gc3RpbGwgYEtlcm5lbFRyYW5zcG9ydGAgaXMgYmV0dGVyIHRvIGhhdmUgYGdhdGV3YXlOYW1lYCBwcm9wZXJ0eSBmb3IgY29kZSBzaW1wbGljaXR5IGluIHRoZSBvdGhlciBwYXJ0cyBvZiBjb2RlXG4gIGdhdGV3YXlOYW1lOiA/c3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMsIGdyYW1tYXI6IGF0b20kR3JhbW1hcikge1xuICAgIHRoaXMua2VybmVsU3BlYyA9IGtlcm5lbFNwZWM7XG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcblxuICAgIHRoaXMubGFuZ3VhZ2UgPSBrZXJuZWxTcGVjLmxhbmd1YWdlLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5kaXNwbGF5TmFtZSA9IGtlcm5lbFNwZWMuZGlzcGxheV9uYW1lO1xuICB9XG5cbiAgQGFjdGlvblxuICBzZXRFeGVjdXRpb25TdGF0ZShzdGF0ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5leGVjdXRpb25TdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgQGFjdGlvblxuICBzZXRFeGVjdXRpb25Db3VudChjb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5leGVjdXRpb25Db3VudCA9IGNvdW50O1xuICB9XG5cbiAgQGFjdGlvblxuICBzZXRMYXN0RXhlY3V0aW9uVGltZSh0aW1lU3RyaW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLmxhc3RFeGVjdXRpb25UaW1lID0gdGltZVN0cmluZztcbiAgfVxuXG4gIGludGVycnVwdCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IGludGVycnVwdCBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgc2h1dGRvd24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiS2VybmVsVHJhbnNwb3J0OiBzaHV0ZG93biBtZXRob2Qgbm90IGltcGxlbWVudGVkXCIpO1xuICB9XG5cbiAgcmVzdGFydChvblJlc3RhcnRlZDogP0Z1bmN0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiS2VybmVsVHJhbnNwb3J0OiByZXN0YXJ0IG1ldGhvZCBub3QgaW1wbGVtZW50ZWRcIik7XG4gIH1cblxuICBleGVjdXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IGV4ZWN1dGUgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIGNvbXBsZXRlKGNvZGU6IHN0cmluZywgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IGNvbXBsZXRlIG1ldGhvZCBub3QgaW1wbGVtZW50ZWRcIik7XG4gIH1cblxuICBpbnNwZWN0KGNvZGU6IHN0cmluZywgY3Vyc29yUG9zOiBudW1iZXIsIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiS2VybmVsVHJhbnNwb3J0OiBpbnNwZWN0IG1ldGhvZCBub3QgaW1wbGVtZW50ZWRcIik7XG4gIH1cblxuICBpbnB1dFJlcGx5KGlucHV0OiBzdHJpbmcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJLZXJuZWxUcmFuc3BvcnQ6IGlucHV0UmVwbHkgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZFwiKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgbG9nKFwiS2VybmVsVHJhbnNwb3J0OiBEZXN0cm95aW5nIGJhc2Uga2VybmVsXCIpO1xuICB9XG59XG4iXX0=