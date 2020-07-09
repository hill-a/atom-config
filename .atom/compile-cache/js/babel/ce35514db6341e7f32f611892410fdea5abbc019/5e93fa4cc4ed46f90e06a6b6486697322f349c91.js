Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.reduceOutputs = reduceOutputs;
exports.isSingleLine = isSingleLine;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _escapeCarriage = require("escape-carriage");

var _componentsResultViewDisplay = require("../components/result-view/display");

var outputTypes = ["execute_result", "display_data", "stream", "error"];

/**
 * https://github.com/nteract/hydrogen/issues/466#issuecomment-274822937
 * An output can be a stream of data that does not arrive at a single time. This
 * function handles the different types of outputs and accumulates the data
 * into a reduced output.
 *
 * @param {Array<Object>} outputs - Kernel output messages
 * @param {Object} output - Outputted to be reduced into list of outputs
 * @return {Array<Object>} updated-outputs - Outputs + Output
 */

function reduceOutputs(outputs, output) {
  var last = outputs.length - 1;
  if (outputs.length > 0 && output.output_type === "stream" && outputs[last].output_type === "stream") {
    var appendText = function appendText(previous, next) {
      previous.text = (0, _escapeCarriage.escapeCarriageReturnSafe)(previous.text + next.text);
    };

    if (outputs[last].name === output.name) {
      appendText(outputs[last], output);
      return outputs;
    }

    if (outputs.length > 1 && outputs[last - 1].name === output.name) {
      appendText(outputs[last - 1], output);
      return outputs;
    }
  }
  outputs.push(output);
  return outputs;
}

function isSingleLine(text, availableSpace) {
  // If it turns out escapeCarriageReturn is a bottleneck, we should remove it.
  return (!text || text.indexOf("\n") === -1 || text.indexOf("\n") === text.length - 1) && availableSpace > (0, _escapeCarriage.escapeCarriageReturn)(text).length;
}

var OutputStore = (function () {
  var _instanceInitializers = {};

  function OutputStore() {
    _classCallCheck(this, OutputStore);

    _defineDecoratedPropertyDescriptor(this, "outputs", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "status", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "executionCount", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "index", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "position", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "incrementIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "decrementIndex", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "clear", _instanceInitializers);
  }

  _createDecoratedClass(OutputStore, [{
    key: "appendOutput",
    decorators: [_mobx.action],
    value: function appendOutput(message) {
      if (message.stream === "execution_count") {
        this.executionCount = message.data;
      } else if (message.stream === "status") {
        this.status = message.data;
      } else if (outputTypes.indexOf(message.output_type) > -1) {
        reduceOutputs(this.outputs, message);
        this.setIndex(this.outputs.length - 1);
      }
    }
  }, {
    key: "updatePosition",
    decorators: [_mobx.action],
    value: function updatePosition(position) {
      Object.assign(this.position, position);
    }
  }, {
    key: "outputs",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }, {
    key: "status",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return "running";
    },
    enumerable: true
  }, {
    key: "executionCount",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return null;
    },
    enumerable: true
  }, {
    key: "index",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return -1;
    },
    enumerable: true
  }, {
    key: "position",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return {
        lineHeight: 0,
        lineLength: 0,
        editorWidth: 0,
        charWidth: 0
      };
    },
    enumerable: true
  }, {
    key: "isPlain",
    decorators: [_mobx.computed],
    get: function get() {
      if (this.outputs.length !== 1) return false;

      var availableSpace = Math.floor((this.position.editorWidth - this.position.lineLength) / this.position.charWidth);
      if (availableSpace <= 0) return false;

      var output = this.outputs[0];
      switch (output.output_type) {
        case "execute_result":
        case "display_data":
          {
            var bundle = output.data;
            return (0, _componentsResultViewDisplay.isTextOutputOnly)(bundle) ? isSingleLine(bundle["text/plain"], availableSpace) : false;
          }
        case "stream":
          {
            return isSingleLine(output.text, availableSpace);
          }
        default:
          {
            return false;
          }
      }
    }
  }, {
    key: "setIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this = this;

      return function (index) {
        if (index < 0) {
          _this.index = 0;
        } else if (index < _this.outputs.length) {
          _this.index = index;
        } else {
          _this.index = _this.outputs.length - 1;
        }
      };
    },
    enumerable: true
  }, {
    key: "incrementIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.index = _this2.index < _this2.outputs.length - 1 ? _this2.index + 1 : _this2.outputs.length - 1;
      };
    },
    enumerable: true
  }, {
    key: "decrementIndex",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.index = _this3.index > 0 ? _this3.index - 1 : 0;
      };
    },
    enumerable: true
  }, {
    key: "clear",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this4 = this;

      return function () {
        _this4.outputs = [];
        _this4.index = -1;
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return OutputStore;
})();

exports["default"] = OutputStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zdG9yZS9vdXRwdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUU2QyxNQUFNOztzQkFDckMsUUFBUTs7Ozs4QkFJZixpQkFBaUI7OzJDQUdTLG1DQUFtQzs7QUFDcEUsSUFBTSxXQUFXLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FBWW5FLFNBQVMsYUFBYSxDQUMzQixPQUFzQixFQUN0QixNQUFjLEVBQ0M7QUFDZixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQyxNQUNFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUNsQixNQUFNLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQ3RDO1FBQ1MsVUFBVSxHQUFuQixTQUFTLFVBQVUsQ0FBQyxRQUFnQixFQUFFLElBQVksRUFBRTtBQUNsRCxjQUFRLENBQUMsSUFBSSxHQUFHLDhDQUF5QixRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyRTs7QUFFRCxRQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtBQUN0QyxnQkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsQyxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7QUFFRCxRQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDaEUsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLGFBQU8sT0FBTyxDQUFDO0tBQ2hCO0dBQ0Y7QUFDRCxTQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JCLFNBQU8sT0FBTyxDQUFDO0NBQ2hCOztBQUVNLFNBQVMsWUFBWSxDQUFDLElBQWEsRUFBRSxjQUFzQixFQUFFOztBQUVsRSxTQUNFLENBQUMsQ0FBQyxJQUFJLElBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxJQUN4QyxjQUFjLEdBQUcsMENBQXFCLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FDbEQ7Q0FDSDs7SUFFb0IsV0FBVzs7O1dBQVgsV0FBVzswQkFBWCxXQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBQVgsV0FBVzs7O1dBOENsQixzQkFBQyxPQUFlLEVBQUU7QUFDNUIsVUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLGlCQUFpQixFQUFFO0FBQ3hDLFlBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztPQUNwQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7QUFDdEMsWUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO09BQzVCLE1BQU0sSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtBQUN4RCxxQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztPQUN4QztLQUNGOzs7O1dBR2Esd0JBQUMsUUFJZCxFQUFFO0FBQ0QsWUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3hDOzs7OzthQTlEd0IsRUFBRTs7Ozs7OzthQUVWLFNBQVM7Ozs7Ozs7YUFFQSxJQUFJOzs7Ozs7O2FBRWQsQ0FBQyxDQUFDOzs7Ozs7O2FBRVA7QUFDVCxrQkFBVSxFQUFFLENBQUM7QUFDYixrQkFBVSxFQUFFLENBQUM7QUFDYixtQkFBVyxFQUFFLENBQUM7QUFDZCxpQkFBUyxFQUFFLENBQUM7T0FDYjs7Ozs7O1NBR1UsZUFBWTtBQUNyQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQzs7QUFFNUMsVUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDL0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQSxHQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FDMUIsQ0FBQztBQUNGLFVBQUksY0FBYyxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQzs7QUFFdEMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixjQUFRLE1BQU0sQ0FBQyxXQUFXO0FBQ3hCLGFBQUssZ0JBQWdCLENBQUM7QUFDdEIsYUFBSyxjQUFjO0FBQUU7QUFDbkIsZ0JBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDM0IsbUJBQU8sbURBQWlCLE1BQU0sQ0FBQyxHQUMzQixZQUFZLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLGNBQWMsQ0FBQyxHQUNsRCxLQUFLLENBQUM7V0FDWDtBQUFBLEFBQ0QsYUFBSyxRQUFRO0FBQUU7QUFDYixtQkFBTyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztXQUNsRDtBQUFBLEFBQ0Q7QUFBUztBQUNQLG1CQUFPLEtBQUssQ0FBQztXQUNkO0FBQUEsT0FDRjtLQUNGOzs7Ozs7O2FBd0JVLFVBQUMsS0FBSyxFQUFhO0FBQzVCLFlBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtBQUNiLGdCQUFLLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDaEIsTUFBTSxJQUFJLEtBQUssR0FBRyxNQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDdEMsZ0JBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNwQixNQUFNO0FBQ0wsZ0JBQUssS0FBSyxHQUFHLE1BQUssT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDdEM7T0FDRjs7Ozs7Ozs7O2FBR2dCLFlBQU07QUFDckIsZUFBSyxLQUFLLEdBQ1IsT0FBSyxLQUFLLEdBQUcsT0FBSyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FDaEMsT0FBSyxLQUFLLEdBQUcsQ0FBQyxHQUNkLE9BQUssT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDL0I7Ozs7Ozs7OzthQUdnQixZQUFNO0FBQ3JCLGVBQUssS0FBSyxHQUFHLE9BQUssS0FBSyxHQUFHLENBQUMsR0FBRyxPQUFLLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2xEOzs7Ozs7Ozs7YUFHTyxZQUFNO0FBQ1osZUFBSyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLGVBQUssS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ2pCOzs7OztTQTlGa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3N0b3JlL291dHB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGFjdGlvbiwgY29tcHV0ZWQsIG9ic2VydmFibGUgfSBmcm9tIFwibW9ieFwiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHtcbiAgZXNjYXBlQ2FycmlhZ2VSZXR1cm4sXG4gIGVzY2FwZUNhcnJpYWdlUmV0dXJuU2FmZVxufSBmcm9tIFwiZXNjYXBlLWNhcnJpYWdlXCI7XG5cbmltcG9ydCB0eXBlIHsgSU9ic2VydmFibGVBcnJheSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgeyBpc1RleHRPdXRwdXRPbmx5IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvcmVzdWx0LXZpZXcvZGlzcGxheVwiO1xuY29uc3Qgb3V0cHV0VHlwZXMgPSBbXCJleGVjdXRlX3Jlc3VsdFwiLCBcImRpc3BsYXlfZGF0YVwiLCBcInN0cmVhbVwiLCBcImVycm9yXCJdO1xuXG4vKipcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L2h5ZHJvZ2VuL2lzc3Vlcy80NjYjaXNzdWVjb21tZW50LTI3NDgyMjkzN1xuICogQW4gb3V0cHV0IGNhbiBiZSBhIHN0cmVhbSBvZiBkYXRhIHRoYXQgZG9lcyBub3QgYXJyaXZlIGF0IGEgc2luZ2xlIHRpbWUuIFRoaXNcbiAqIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIGRpZmZlcmVudCB0eXBlcyBvZiBvdXRwdXRzIGFuZCBhY2N1bXVsYXRlcyB0aGUgZGF0YVxuICogaW50byBhIHJlZHVjZWQgb3V0cHV0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gb3V0cHV0cyAtIEtlcm5lbCBvdXRwdXQgbWVzc2FnZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvdXRwdXQgLSBPdXRwdXR0ZWQgdG8gYmUgcmVkdWNlZCBpbnRvIGxpc3Qgb2Ygb3V0cHV0c1xuICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn0gdXBkYXRlZC1vdXRwdXRzIC0gT3V0cHV0cyArIE91dHB1dFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlT3V0cHV0cyhcbiAgb3V0cHV0czogQXJyYXk8T2JqZWN0PixcbiAgb3V0cHV0OiBPYmplY3Rcbik6IEFycmF5PE9iamVjdD4ge1xuICBjb25zdCBsYXN0ID0gb3V0cHV0cy5sZW5ndGggLSAxO1xuICBpZiAoXG4gICAgb3V0cHV0cy5sZW5ndGggPiAwICYmXG4gICAgb3V0cHV0Lm91dHB1dF90eXBlID09PSBcInN0cmVhbVwiICYmXG4gICAgb3V0cHV0c1tsYXN0XS5vdXRwdXRfdHlwZSA9PT0gXCJzdHJlYW1cIlxuICApIHtcbiAgICBmdW5jdGlvbiBhcHBlbmRUZXh0KHByZXZpb3VzOiBPYmplY3QsIG5leHQ6IE9iamVjdCkge1xuICAgICAgcHJldmlvdXMudGV4dCA9IGVzY2FwZUNhcnJpYWdlUmV0dXJuU2FmZShwcmV2aW91cy50ZXh0ICsgbmV4dC50ZXh0KTtcbiAgICB9XG5cbiAgICBpZiAob3V0cHV0c1tsYXN0XS5uYW1lID09PSBvdXRwdXQubmFtZSkge1xuICAgICAgYXBwZW5kVGV4dChvdXRwdXRzW2xhc3RdLCBvdXRwdXQpO1xuICAgICAgcmV0dXJuIG91dHB1dHM7XG4gICAgfVxuXG4gICAgaWYgKG91dHB1dHMubGVuZ3RoID4gMSAmJiBvdXRwdXRzW2xhc3QgLSAxXS5uYW1lID09PSBvdXRwdXQubmFtZSkge1xuICAgICAgYXBwZW5kVGV4dChvdXRwdXRzW2xhc3QgLSAxXSwgb3V0cHV0KTtcbiAgICAgIHJldHVybiBvdXRwdXRzO1xuICAgIH1cbiAgfVxuICBvdXRwdXRzLnB1c2gob3V0cHV0KTtcbiAgcmV0dXJuIG91dHB1dHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NpbmdsZUxpbmUodGV4dDogP3N0cmluZywgYXZhaWxhYmxlU3BhY2U6IG51bWJlcikge1xuICAvLyBJZiBpdCB0dXJucyBvdXQgZXNjYXBlQ2FycmlhZ2VSZXR1cm4gaXMgYSBib3R0bGVuZWNrLCB3ZSBzaG91bGQgcmVtb3ZlIGl0LlxuICByZXR1cm4gKFxuICAgICghdGV4dCB8fFxuICAgICAgdGV4dC5pbmRleE9mKFwiXFxuXCIpID09PSAtMSB8fFxuICAgICAgdGV4dC5pbmRleE9mKFwiXFxuXCIpID09PSB0ZXh0Lmxlbmd0aCAtIDEpICYmXG4gICAgYXZhaWxhYmxlU3BhY2UgPiBlc2NhcGVDYXJyaWFnZVJldHVybih0ZXh0KS5sZW5ndGhcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3V0cHV0U3RvcmUge1xuICBAb2JzZXJ2YWJsZVxuICBvdXRwdXRzOiBBcnJheTxPYmplY3Q+ID0gW107XG4gIEBvYnNlcnZhYmxlXG4gIHN0YXR1czogc3RyaW5nID0gXCJydW5uaW5nXCI7XG4gIEBvYnNlcnZhYmxlXG4gIGV4ZWN1dGlvbkNvdW50OiA/bnVtYmVyID0gbnVsbDtcbiAgQG9ic2VydmFibGVcbiAgaW5kZXg6IG51bWJlciA9IC0xO1xuICBAb2JzZXJ2YWJsZVxuICBwb3NpdGlvbiA9IHtcbiAgICBsaW5lSGVpZ2h0OiAwLFxuICAgIGxpbmVMZW5ndGg6IDAsXG4gICAgZWRpdG9yV2lkdGg6IDAsXG4gICAgY2hhcldpZHRoOiAwXG4gIH07XG5cbiAgQGNvbXB1dGVkXG4gIGdldCBpc1BsYWluKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLm91dHB1dHMubGVuZ3RoICE9PSAxKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBhdmFpbGFibGVTcGFjZSA9IE1hdGguZmxvb3IoXG4gICAgICAodGhpcy5wb3NpdGlvbi5lZGl0b3JXaWR0aCAtIHRoaXMucG9zaXRpb24ubGluZUxlbmd0aCkgL1xuICAgICAgICB0aGlzLnBvc2l0aW9uLmNoYXJXaWR0aFxuICAgICk7XG4gICAgaWYgKGF2YWlsYWJsZVNwYWNlIDw9IDApIHJldHVybiBmYWxzZTtcblxuICAgIGNvbnN0IG91dHB1dCA9IHRoaXMub3V0cHV0c1swXTtcbiAgICBzd2l0Y2ggKG91dHB1dC5vdXRwdXRfdHlwZSkge1xuICAgICAgY2FzZSBcImV4ZWN1dGVfcmVzdWx0XCI6XG4gICAgICBjYXNlIFwiZGlzcGxheV9kYXRhXCI6IHtcbiAgICAgICAgY29uc3QgYnVuZGxlID0gb3V0cHV0LmRhdGE7XG4gICAgICAgIHJldHVybiBpc1RleHRPdXRwdXRPbmx5KGJ1bmRsZSlcbiAgICAgICAgICA/IGlzU2luZ2xlTGluZShidW5kbGVbXCJ0ZXh0L3BsYWluXCJdLCBhdmFpbGFibGVTcGFjZSlcbiAgICAgICAgICA6IGZhbHNlO1xuICAgICAgfVxuICAgICAgY2FzZSBcInN0cmVhbVwiOiB7XG4gICAgICAgIHJldHVybiBpc1NpbmdsZUxpbmUob3V0cHV0LnRleHQsIGF2YWlsYWJsZVNwYWNlKTtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBhY3Rpb25cbiAgYXBwZW5kT3V0cHV0KG1lc3NhZ2U6IE9iamVjdCkge1xuICAgIGlmIChtZXNzYWdlLnN0cmVhbSA9PT0gXCJleGVjdXRpb25fY291bnRcIikge1xuICAgICAgdGhpcy5leGVjdXRpb25Db3VudCA9IG1lc3NhZ2UuZGF0YTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2Uuc3RyZWFtID09PSBcInN0YXR1c1wiKSB7XG4gICAgICB0aGlzLnN0YXR1cyA9IG1lc3NhZ2UuZGF0YTtcbiAgICB9IGVsc2UgaWYgKG91dHB1dFR5cGVzLmluZGV4T2YobWVzc2FnZS5vdXRwdXRfdHlwZSkgPiAtMSkge1xuICAgICAgcmVkdWNlT3V0cHV0cyh0aGlzLm91dHB1dHMsIG1lc3NhZ2UpO1xuICAgICAgdGhpcy5zZXRJbmRleCh0aGlzLm91dHB1dHMubGVuZ3RoIC0gMSk7XG4gICAgfVxuICB9XG5cbiAgQGFjdGlvblxuICB1cGRhdGVQb3NpdGlvbihwb3NpdGlvbjoge1xuICAgIGxpbmVIZWlnaHQ/OiBudW1iZXIsXG4gICAgbGluZUxlbmd0aD86IG51bWJlcixcbiAgICBlZGl0b3JXaWR0aD86IG51bWJlclxuICB9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnBvc2l0aW9uLCBwb3NpdGlvbik7XG4gIH1cblxuICBAYWN0aW9uXG4gIHNldEluZGV4ID0gKGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBpZiAoaW5kZXggPCAwKSB7XG4gICAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKGluZGV4IDwgdGhpcy5vdXRwdXRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluZGV4ID0gdGhpcy5vdXRwdXRzLmxlbmd0aCAtIDE7XG4gICAgfVxuICB9O1xuXG4gIEBhY3Rpb25cbiAgaW5jcmVtZW50SW5kZXggPSAoKSA9PiB7XG4gICAgdGhpcy5pbmRleCA9XG4gICAgICB0aGlzLmluZGV4IDwgdGhpcy5vdXRwdXRzLmxlbmd0aCAtIDFcbiAgICAgICAgPyB0aGlzLmluZGV4ICsgMVxuICAgICAgICA6IHRoaXMub3V0cHV0cy5sZW5ndGggLSAxO1xuICB9O1xuXG4gIEBhY3Rpb25cbiAgZGVjcmVtZW50SW5kZXggPSAoKSA9PiB7XG4gICAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggPiAwID8gdGhpcy5pbmRleCAtIDEgOiAwO1xuICB9O1xuXG4gIEBhY3Rpb25cbiAgY2xlYXIgPSAoKSA9PiB7XG4gICAgdGhpcy5vdXRwdXRzID0gW107XG4gICAgdGhpcy5pbmRleCA9IC0xO1xuICB9O1xufVxuIl19