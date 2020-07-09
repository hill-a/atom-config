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

var _display = require("./display");

var _display2 = _interopRequireDefault(_display);

var ScrollList = (function (_React$Component) {
  _inherits(ScrollList, _React$Component);

  function ScrollList() {
    _classCallCheck(this, _ScrollList);

    _get(Object.getPrototypeOf(_ScrollList.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ScrollList, [{
    key: "scrollToBottom",
    value: function scrollToBottom() {
      if (!this.el) return;
      var scrollHeight = this.el.scrollHeight;
      var height = this.el.clientHeight;
      var maxScrollTop = scrollHeight - height;
      this.el.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.scrollToBottom();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.scrollToBottom();
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      if (this.props.outputs.length === 0) return null;
      return _react2["default"].createElement(
        "div",
        {
          className: "scroll-list multiline-container native-key-bindings",
          tabIndex: "-1",
          style: {
            fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
          },
          ref: function (el) {
            _this.el = el;
          },
          "hydrogen-wrapoutput": atom.config.get("Hydrogen.wrapOutput").toString()
        },
        this.props.outputs.map(function (output, index) {
          return _react2["default"].createElement(_display2["default"], { output: output, key: index });
        })
      );
    }
  }]);

  var _ScrollList = ScrollList;
  ScrollList = (0, _mobxReact.observer)(ScrollList) || ScrollList;
  return ScrollList;
})(_react2["default"].Component);

exports["default"] = ScrollList;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L2xpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7eUJBQ0EsWUFBWTs7dUJBQ2pCLFdBQVc7Ozs7SUFLekIsVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTs7Ozs7O2VBQVYsVUFBVTs7V0FHQSwwQkFBRztBQUNmLFVBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU87QUFDckIsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUM7QUFDMUMsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUM7QUFDcEMsVUFBTSxZQUFZLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUMzQyxVQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUM7S0FDekQ7OztXQUVpQiw4QkFBRztBQUNuQixVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDdkI7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDdkI7OztXQUVLLGtCQUFHOzs7QUFDUCxVQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDakQsYUFDRTs7O0FBQ0UsbUJBQVMsRUFBQyxxREFBcUQ7QUFDL0Qsa0JBQVEsRUFBQyxJQUFJO0FBQ2IsZUFBSyxFQUFFO0FBQ0wsb0JBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsK0JBQStCLElBQUksU0FBUztXQUN0RSxBQUFDO0FBQ0YsYUFBRyxFQUFFLFVBQUEsRUFBRSxFQUFJO0FBQ1Qsa0JBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQztXQUNkLEFBQUM7QUFDRixpQ0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxBQUFDOztRQUV0RSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsS0FBSztpQkFDcEMseURBQVMsTUFBTSxFQUFFLE1BQU0sQUFBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEFBQUMsR0FBRztTQUN4QyxDQUFDO09BQ0UsQ0FDTjtLQUNIOzs7b0JBdENHLFVBQVU7QUFBVixZQUFVLDRCQUFWLFVBQVUsS0FBVixVQUFVO1NBQVYsVUFBVTtHQUFTLG1CQUFNLFNBQVM7O3FCQXlDekIsVUFBVSIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9saXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IERpc3BsYXkgZnJvbSBcIi4vZGlzcGxheVwiO1xuXG50eXBlIFByb3BzID0geyBvdXRwdXRzOiBBcnJheTxPYmplY3Q+IH07XG5cbkBvYnNlcnZlclxuY2xhc3MgU2Nyb2xsTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxQcm9wcz4ge1xuICBlbDogP0hUTUxFbGVtZW50O1xuXG4gIHNjcm9sbFRvQm90dG9tKCkge1xuICAgIGlmICghdGhpcy5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuZWwuc2Nyb2xsSGVpZ2h0O1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWwuY2xpZW50SGVpZ2h0O1xuICAgIGNvbnN0IG1heFNjcm9sbFRvcCA9IHNjcm9sbEhlaWdodCAtIGhlaWdodDtcbiAgICB0aGlzLmVsLnNjcm9sbFRvcCA9IG1heFNjcm9sbFRvcCA+IDAgPyBtYXhTY3JvbGxUb3AgOiAwO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5vdXRwdXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwic2Nyb2xsLWxpc3QgbXVsdGlsaW5lLWNvbnRhaW5lciBuYXRpdmUta2V5LWJpbmRpbmdzXCJcbiAgICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZm9udFNpemU6IGF0b20uY29uZmlnLmdldChgSHlkcm9nZW4ub3V0cHV0QXJlYUZvbnRTaXplYCkgfHwgXCJpbmhlcml0XCJcbiAgICAgICAgfX1cbiAgICAgICAgcmVmPXtlbCA9PiB7XG4gICAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB9fVxuICAgICAgICBoeWRyb2dlbi13cmFwb3V0cHV0PXthdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLndyYXBPdXRwdXRgKS50b1N0cmluZygpfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5wcm9wcy5vdXRwdXRzLm1hcCgob3V0cHV0LCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxEaXNwbGF5IG91dHB1dD17b3V0cHV0fSBrZXk9e2luZGV4fSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsTGlzdDtcbiJdfQ==