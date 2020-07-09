Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.isTextOutputOnly = isTextOutputOnly;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _nteractOutputs = require("@nteract/outputs");

var _plotly = require("./plotly");

var _plotly2 = _interopRequireDefault(_plotly);

var _nteractTransformVega = require("@nteract/transform-vega");

var _markdown = require("./markdown");

var _markdown2 = _interopRequireDefault(_markdown);

// All supported media types for output go here
var supportedMediaTypes = _react2["default"].createElement(
  _nteractOutputs.RichMedia,
  null,
  _react2["default"].createElement(_nteractTransformVega.Vega5, null),
  _react2["default"].createElement(_nteractTransformVega.Vega4, null),
  _react2["default"].createElement(_nteractTransformVega.Vega3, null),
  _react2["default"].createElement(_nteractTransformVega.Vega2, null),
  _react2["default"].createElement(_plotly2["default"], null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite3, null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite2, null),
  _react2["default"].createElement(_nteractTransformVega.VegaLite1, null),
  _react2["default"].createElement(_nteractOutputs.Media.Json, null),
  _react2["default"].createElement(_nteractOutputs.Media.JavaScript, null),
  _react2["default"].createElement(_nteractOutputs.Media.HTML, null),
  _react2["default"].createElement(_markdown2["default"], null),
  _react2["default"].createElement(_nteractOutputs.Media.LaTeX, null),
  _react2["default"].createElement(_nteractOutputs.Media.SVG, null),
  _react2["default"].createElement(_nteractOutputs.Media.Image, { mediaType: "image/gif" }),
  _react2["default"].createElement(_nteractOutputs.Media.Image, { mediaType: "image/jpeg" }),
  _react2["default"].createElement(_nteractOutputs.Media.Image, { mediaType: "image/png" }),
  _react2["default"].createElement(_nteractOutputs.Media.Plain, null)
);

exports.supportedMediaTypes = supportedMediaTypes;

function isTextOutputOnly(data) {
  var supported = _react2["default"].Children.map(supportedMediaTypes.props.children, function (mediaComponent) {
    return mediaComponent.props.mediaType;
  });
  var bundleMediaTypes = [].concat(_toConsumableArray(Object.keys(data))).filter(function (mediaType) {
    return supported.includes(mediaType);
  });

  return bundleMediaTypes.length === 1 && bundleMediaTypes[0] === "text/plain" ? true : false;
}

var Display = (function (_React$Component) {
  _inherits(Display, _React$Component);

  function Display() {
    _classCallCheck(this, _Display);

    _get(Object.getPrototypeOf(_Display.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Display, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        _nteractOutputs.Output,
        { output: (0, _mobx.toJS)(this.props.output) },
        _react2["default"].createElement(
          _nteractOutputs.ExecuteResult,
          { expanded: true },
          supportedMediaTypes
        ),
        _react2["default"].createElement(
          _nteractOutputs.DisplayData,
          { expanded: true },
          supportedMediaTypes
        ),
        _react2["default"].createElement(_nteractOutputs.StreamText, { expanded: true }),
        _react2["default"].createElement(_nteractOutputs.KernelOutputError, { expanded: true })
      );
    }
  }]);

  var _Display = Display;
  Display = (0, _mobxReact.observer)(Display) || Display;
  return Display;
})(_react2["default"].Component);

exports["default"] = Display;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L2Rpc3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O29CQUNKLE1BQU07O3lCQUNGLFlBQVk7OzhCQVM5QixrQkFBa0I7O3NCQUNOLFVBQVU7Ozs7b0NBU3RCLHlCQUF5Qjs7d0JBRVgsWUFBWTs7Ozs7QUFHMUIsSUFBTSxtQkFBbUIsR0FDOUI7OztFQUNFLG1FQUFTO0VBQ1QsbUVBQVM7RUFDVCxtRUFBUztFQUNULG1FQUFTO0VBQ1QsMkRBQVU7RUFDVix1RUFBYTtFQUNiLHVFQUFhO0VBQ2IsdUVBQWE7RUFDYixpQ0FBQyxzQkFBTSxJQUFJLE9BQUc7RUFDZCxpQ0FBQyxzQkFBTSxVQUFVLE9BQUc7RUFDcEIsaUNBQUMsc0JBQU0sSUFBSSxPQUFHO0VBQ2QsNkRBQVk7RUFDWixpQ0FBQyxzQkFBTSxLQUFLLE9BQUc7RUFDZixpQ0FBQyxzQkFBTSxHQUFHLE9BQUc7RUFDYixpQ0FBQyxzQkFBTSxLQUFLLElBQUMsU0FBUyxFQUFDLFdBQVcsR0FBRztFQUNyQyxpQ0FBQyxzQkFBTSxLQUFLLElBQUMsU0FBUyxFQUFDLFlBQVksR0FBRztFQUN0QyxpQ0FBQyxzQkFBTSxLQUFLLElBQUMsU0FBUyxFQUFDLFdBQVcsR0FBRztFQUNyQyxpQ0FBQyxzQkFBTSxLQUFLLE9BQUc7Q0FDTCxBQUNiLENBQUM7Ozs7QUFFSyxTQUFTLGdCQUFnQixDQUFDLElBQVksRUFBRTtBQUM3QyxNQUFNLFNBQVMsR0FBRyxtQkFBTSxRQUFRLENBQUMsR0FBRyxDQUNsQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUNsQyxVQUFBLGNBQWM7V0FBSSxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQVM7R0FBQSxDQUNqRCxDQUFDO0FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyw2QkFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFFLE1BQU0sQ0FBQyxVQUFBLFNBQVM7V0FDOUQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7R0FBQSxDQUM5QixDQUFDOztBQUVGLFNBQU8sZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxZQUFZLEdBQ3hFLElBQUksR0FDSixLQUFLLENBQUM7Q0FDWDs7SUFHSyxPQUFPO1lBQVAsT0FBTzs7V0FBUCxPQUFPOzs7Ozs7ZUFBUCxPQUFPOztXQUNMLGtCQUFHO0FBQ1AsYUFDRTs7VUFBUSxNQUFNLEVBQUUsZ0JBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQUFBQztRQUN0Qzs7WUFBZSxRQUFRLE1BQUE7VUFBRSxtQkFBbUI7U0FBaUI7UUFDN0Q7O1lBQWEsUUFBUSxNQUFBO1VBQUUsbUJBQW1CO1NBQWU7UUFDekQsK0RBQVksUUFBUSxNQUFBLEdBQUc7UUFDdkIsc0VBQW1CLFFBQVEsTUFBQSxHQUFHO09BQ3ZCLENBQ1Q7S0FDSDs7O2lCQVZHLE9BQU87QUFBUCxTQUFPLDRCQUFQLE9BQU8sS0FBUCxPQUFPO1NBQVAsT0FBTztHQUFTLG1CQUFNLFNBQVM7O3FCQWF0QixPQUFPIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L2Rpc3BsYXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCB7XG4gIERpc3BsYXlEYXRhLFxuICBFeGVjdXRlUmVzdWx0LFxuICBTdHJlYW1UZXh0LFxuICBLZXJuZWxPdXRwdXRFcnJvcixcbiAgT3V0cHV0LFxuICBNZWRpYSxcbiAgUmljaE1lZGlhXG59IGZyb20gXCJAbnRlcmFjdC9vdXRwdXRzXCI7XG5pbXBvcnQgUGxvdGx5IGZyb20gXCIuL3Bsb3RseVwiO1xuaW1wb3J0IHtcbiAgVmVnYUxpdGUxLFxuICBWZWdhTGl0ZTIsXG4gIFZlZ2FMaXRlMyxcbiAgVmVnYTIsXG4gIFZlZ2EzLFxuICBWZWdhNCxcbiAgVmVnYTVcbn0gZnJvbSBcIkBudGVyYWN0L3RyYW5zZm9ybS12ZWdhXCI7XG5cbmltcG9ydCBNYXJrZG93biBmcm9tIFwiLi9tYXJrZG93blwiO1xuXG4vLyBBbGwgc3VwcG9ydGVkIG1lZGlhIHR5cGVzIGZvciBvdXRwdXQgZ28gaGVyZVxuZXhwb3J0IGNvbnN0IHN1cHBvcnRlZE1lZGlhVHlwZXMgPSAoXG4gIDxSaWNoTWVkaWE+XG4gICAgPFZlZ2E1IC8+XG4gICAgPFZlZ2E0IC8+XG4gICAgPFZlZ2EzIC8+XG4gICAgPFZlZ2EyIC8+XG4gICAgPFBsb3RseSAvPlxuICAgIDxWZWdhTGl0ZTMgLz5cbiAgICA8VmVnYUxpdGUyIC8+XG4gICAgPFZlZ2FMaXRlMSAvPlxuICAgIDxNZWRpYS5Kc29uIC8+XG4gICAgPE1lZGlhLkphdmFTY3JpcHQgLz5cbiAgICA8TWVkaWEuSFRNTCAvPlxuICAgIDxNYXJrZG93biAvPlxuICAgIDxNZWRpYS5MYVRlWCAvPlxuICAgIDxNZWRpYS5TVkcgLz5cbiAgICA8TWVkaWEuSW1hZ2UgbWVkaWFUeXBlPVwiaW1hZ2UvZ2lmXCIgLz5cbiAgICA8TWVkaWEuSW1hZ2UgbWVkaWFUeXBlPVwiaW1hZ2UvanBlZ1wiIC8+XG4gICAgPE1lZGlhLkltYWdlIG1lZGlhVHlwZT1cImltYWdlL3BuZ1wiIC8+XG4gICAgPE1lZGlhLlBsYWluIC8+XG4gIDwvUmljaE1lZGlhPlxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGV4dE91dHB1dE9ubHkoZGF0YTogT2JqZWN0KSB7XG4gIGNvbnN0IHN1cHBvcnRlZCA9IFJlYWN0LkNoaWxkcmVuLm1hcChcbiAgICBzdXBwb3J0ZWRNZWRpYVR5cGVzLnByb3BzLmNoaWxkcmVuLFxuICAgIG1lZGlhQ29tcG9uZW50ID0+IG1lZGlhQ29tcG9uZW50LnByb3BzLm1lZGlhVHlwZVxuICApO1xuICBjb25zdCBidW5kbGVNZWRpYVR5cGVzID0gWy4uLk9iamVjdC5rZXlzKGRhdGEpXS5maWx0ZXIobWVkaWFUeXBlID0+XG4gICAgc3VwcG9ydGVkLmluY2x1ZGVzKG1lZGlhVHlwZSlcbiAgKTtcblxuICByZXR1cm4gYnVuZGxlTWVkaWFUeXBlcy5sZW5ndGggPT09IDEgJiYgYnVuZGxlTWVkaWFUeXBlc1swXSA9PT0gXCJ0ZXh0L3BsYWluXCJcbiAgICA/IHRydWVcbiAgICA6IGZhbHNlO1xufVxuXG5Ab2JzZXJ2ZXJcbmNsYXNzIERpc3BsYXkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8eyBvdXRwdXQ6IGFueSB9PiB7XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE91dHB1dCBvdXRwdXQ9e3RvSlModGhpcy5wcm9wcy5vdXRwdXQpfT5cbiAgICAgICAgPEV4ZWN1dGVSZXN1bHQgZXhwYW5kZWQ+e3N1cHBvcnRlZE1lZGlhVHlwZXN9PC9FeGVjdXRlUmVzdWx0PlxuICAgICAgICA8RGlzcGxheURhdGEgZXhwYW5kZWQ+e3N1cHBvcnRlZE1lZGlhVHlwZXN9PC9EaXNwbGF5RGF0YT5cbiAgICAgICAgPFN0cmVhbVRleHQgZXhwYW5kZWQgLz5cbiAgICAgICAgPEtlcm5lbE91dHB1dEVycm9yIGV4cGFuZGVkIC8+XG4gICAgICA8L091dHB1dD5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpc3BsYXk7XG4iXX0=