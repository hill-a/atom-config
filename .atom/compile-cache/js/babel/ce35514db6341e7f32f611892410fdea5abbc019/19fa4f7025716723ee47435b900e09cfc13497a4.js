Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _output = require("./output");

var _output2 = _interopRequireDefault(_output);

var _utils = require("./../utils");

var WatchStore = (function () {
  var _instanceInitializers = {};

  function WatchStore(kernel) {
    var _this = this;

    _classCallCheck(this, WatchStore);

    this.outputStore = new _output2["default"]();

    _defineDecoratedPropertyDescriptor(this, "run", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setCode", _instanceInitializers);

    this.getCode = function () {
      return _this.editor.getText();
    };

    this.focus = function () {
      _this.editor.element.focus();
    };

    this.kernel = kernel;
    this.editor = atom.workspace.buildTextEditor({
      softWrapped: true,
      lineNumberGutterVisible: false
    });
    var grammar = this.kernel.grammar;
    if (grammar) atom.grammars.assignLanguageMode(this.editor, grammar.scopeName);
    this.editor.moveToTop();
    this.editor.element.classList.add("watch-input");
  }

  _createDecoratedClass(WatchStore, [{
    key: "run",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        var code = _this2.getCode();
        (0, _utils.log)("watchview running:", code);
        if (code && code.length > 0) {
          _this2.kernel.executeWatch(code, function (result) {
            _this2.outputStore.appendOutput(result);
          });
        }
      };
    },
    enumerable: true
  }, {
    key: "setCode",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function (code) {
        _this3.editor.setText(code);
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return WatchStore;
})();

exports["default"] = WatchStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zdG9yZS93YXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBRXVCLE1BQU07O3NCQUVMLFVBQVU7Ozs7cUJBQ2QsWUFBWTs7SUFJWCxVQUFVOzs7QUFNbEIsV0FOUSxVQUFVLENBTWpCLE1BQWMsRUFBRTs7OzBCQU5ULFVBQVU7O1NBRzdCLFdBQVcsR0FBRyx5QkFBaUI7Ozs7OztTQWdDL0IsT0FBTyxHQUFHLFlBQU07QUFDZCxhQUFPLE1BQUssTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzlCOztTQUVELEtBQUssR0FBRyxZQUFNO0FBQ1osWUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCOztBQWxDQyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDO0FBQzNDLGlCQUFXLEVBQUUsSUFBSTtBQUNqQiw2QkFBdUIsRUFBRSxLQUFLO0tBQy9CLENBQUMsQ0FBQztBQUNILFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0FBQ3BDLFFBQUksT0FBTyxFQUNULElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkUsUUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN4QixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ2xEOzt3QkFqQmtCLFVBQVU7Ozs7OzthQW9CdkIsWUFBTTtBQUNWLFlBQU0sSUFBSSxHQUFHLE9BQUssT0FBTyxFQUFFLENBQUM7QUFDNUIsd0JBQUksb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDaEMsWUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDM0IsaUJBQUssTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDdkMsbUJBQUssV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztXQUN2QyxDQUFDLENBQUM7U0FDSjtPQUNGOzs7Ozs7Ozs7YUFHUyxVQUFDLElBQUksRUFBYTtBQUMxQixlQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDM0I7Ozs7O1NBakNrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvd2F0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBhY3Rpb24gfSBmcm9tIFwibW9ieFwiO1xuXG5pbXBvcnQgT3V0cHV0U3RvcmUgZnJvbSBcIi4vb3V0cHV0XCI7XG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZSBLZXJuZWwgZnJvbSBcIi4vLi4va2VybmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdGNoU3RvcmUge1xuICBrZXJuZWw6IEtlcm5lbDtcbiAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3I7XG4gIG91dHB1dFN0b3JlID0gbmV3IE91dHB1dFN0b3JlKCk7XG4gIGF1dG9jb21wbGV0ZURpc3Bvc2FibGU6ID9hdG9tJERpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3Ioa2VybmVsOiBLZXJuZWwpIHtcbiAgICB0aGlzLmtlcm5lbCA9IGtlcm5lbDtcbiAgICB0aGlzLmVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcih7XG4gICAgICBzb2Z0V3JhcHBlZDogdHJ1ZSxcbiAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIGNvbnN0IGdyYW1tYXIgPSB0aGlzLmtlcm5lbC5ncmFtbWFyO1xuICAgIGlmIChncmFtbWFyKVxuICAgICAgYXRvbS5ncmFtbWFycy5hc3NpZ25MYW5ndWFnZU1vZGUodGhpcy5lZGl0b3IsIGdyYW1tYXIuc2NvcGVOYW1lKTtcbiAgICB0aGlzLmVkaXRvci5tb3ZlVG9Ub3AoKTtcbiAgICB0aGlzLmVkaXRvci5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ3YXRjaC1pbnB1dFwiKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgcnVuID0gKCkgPT4ge1xuICAgIGNvbnN0IGNvZGUgPSB0aGlzLmdldENvZGUoKTtcbiAgICBsb2coXCJ3YXRjaHZpZXcgcnVubmluZzpcIiwgY29kZSk7XG4gICAgaWYgKGNvZGUgJiYgY29kZS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmtlcm5lbC5leGVjdXRlV2F0Y2goY29kZSwgcmVzdWx0ID0+IHtcbiAgICAgICAgdGhpcy5vdXRwdXRTdG9yZS5hcHBlbmRPdXRwdXQocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBAYWN0aW9uXG4gIHNldENvZGUgPSAoY29kZTogc3RyaW5nKSA9PiB7XG4gICAgdGhpcy5lZGl0b3Iuc2V0VGV4dChjb2RlKTtcbiAgfTtcblxuICBnZXRDb2RlID0gKCkgPT4ge1xuICAgIHJldHVybiB0aGlzLmVkaXRvci5nZXRUZXh0KCk7XG4gIH07XG5cbiAgZm9jdXMgPSAoKSA9PiB7XG4gICAgdGhpcy5lZGl0b3IuZWxlbWVudC5mb2N1cygpO1xuICB9O1xufVxuIl19