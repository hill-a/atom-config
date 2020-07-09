Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var StatusBar = (function (_React$Component) {
  _inherits(StatusBar, _React$Component);

  function StatusBar() {
    _classCallCheck(this, _StatusBar);

    _get(Object.getPrototypeOf(_StatusBar.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(StatusBar, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _props$store = this.props.store;
      var kernel = _props$store.kernel;
      var markers = _props$store.markers;
      var configMapping = _props$store.configMapping;

      if (!kernel || configMapping.get("Hydrogen.statusBarDisable")) return null;
      return _react2["default"].createElement(
        "a",
        { onClick: function () {
            return _this.props.onClick({ kernel: kernel, markers: markers });
          } },
        kernel.displayName,
        " | ",
        kernel.executionState
      );
    }
  }]);

  var _StatusBar = StatusBar;
  StatusBar = (0, _mobxReact.observer)(StatusBar) || StatusBar;
  return StatusBar;
})(_react2["default"].Component);

exports["default"] = StatusBar;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9jb25zdW1lZC9zdGF0dXMtYmFyL3N0YXR1cy1iYXItY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O3lCQUNBLFlBQVk7O0lBV2hCLFNBQVM7WUFBVCxTQUFTOztXQUFULFNBQVM7Ozs7OztlQUFULFNBQVM7O1dBQ3RCLGtCQUFHOzs7eUJBQ29DLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztVQUFuRCxNQUFNLGdCQUFOLE1BQU07VUFBRSxPQUFPLGdCQUFQLE9BQU87VUFBRSxhQUFhLGdCQUFiLGFBQWE7O0FBQ3RDLFVBQUksQ0FBQyxNQUFNLElBQUksYUFBYSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQzNFLGFBQ0U7O1VBQUcsT0FBTyxFQUFFO21CQUFNLE1BQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxDQUFDO1dBQUEsQUFBQztRQUN2RCxNQUFNLENBQUMsV0FBVzs7UUFBSyxNQUFNLENBQUMsY0FBYztPQUMzQyxDQUNKO0tBQ0g7OzttQkFUa0IsU0FBUztBQUFULFdBQVMsNEJBQVQsU0FBUyxLQUFULFNBQVM7U0FBVCxTQUFTO0dBQVMsbUJBQU0sU0FBUzs7cUJBQWpDLFNBQVMiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3NlcnZpY2VzL2NvbnN1bWVkL3N0YXR1cy1iYXIvc3RhdHVzLWJhci1jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5cbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi4vLi4vLi4va2VybmVsXCI7XG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uLy4uL3N0b3JlXCI7XG5cbnR5cGUgUHJvcHMgPSB7XG4gIHN0b3JlOiBTdG9yZSxcbiAgb25DbGljazogRnVuY3Rpb25cbn07XG5cbkBvYnNlcnZlclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdHVzQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFByb3BzPiB7XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGtlcm5lbCwgbWFya2VycywgY29uZmlnTWFwcGluZyB9ID0gdGhpcy5wcm9wcy5zdG9yZTtcbiAgICBpZiAoIWtlcm5lbCB8fCBjb25maWdNYXBwaW5nLmdldChcIkh5ZHJvZ2VuLnN0YXR1c0JhckRpc2FibGVcIikpIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoXG4gICAgICA8YSBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9uQ2xpY2soeyBrZXJuZWwsIG1hcmtlcnMgfSl9PlxuICAgICAgICB7a2VybmVsLmRpc3BsYXlOYW1lfSB8IHtrZXJuZWwuZXhlY3V0aW9uU3RhdGV9XG4gICAgICA8L2E+XG4gICAgKTtcbiAgfVxufVxuIl19