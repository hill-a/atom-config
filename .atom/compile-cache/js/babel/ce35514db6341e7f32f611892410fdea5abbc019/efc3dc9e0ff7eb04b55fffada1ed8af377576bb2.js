Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _nteractOutputs = require("@nteract/outputs");

var _utils = require("./../utils");

var _resultViewMarkdown = require("./result-view/markdown");

var _resultViewMarkdown2 = _interopRequireDefault(_resultViewMarkdown);

function hide() {
  atom.workspace.hide(_utils.INSPECTOR_URI);
  return null;
}

var Inspector = (0, _mobxReact.observer)(function (_ref) {
  var kernel = _ref.store.kernel;

  if (!kernel) return hide();

  var bundle = kernel.inspector.bundle;

  if (!bundle["text/html"] && !bundle["text/markdown"] && !bundle["text/plain"]) {
    return hide();
  }

  return _react2["default"].createElement(
    "div",
    {
      className: "native-key-bindings",
      tabIndex: "-1",
      style: {
        fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
      }
    },
    _react2["default"].createElement(
      _nteractOutputs.RichMedia,
      { data: bundle },
      _react2["default"].createElement(_nteractOutputs.Media.HTML, null),
      _react2["default"].createElement(_resultViewMarkdown2["default"], null),
      _react2["default"].createElement(_nteractOutputs.Media.Plain, null)
    )
  );
});

exports["default"] = Inspector;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL2luc3BlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRWtCLE9BQU87Ozs7eUJBQ0EsWUFBWTs7OEJBQ0osa0JBQWtCOztxQkFFckIsWUFBWTs7a0NBRXJCLHdCQUF3Qjs7OztBQUk3QyxTQUFTLElBQUksR0FBRztBQUNkLE1BQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxzQkFBZSxDQUFDO0FBQ25DLFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsSUFBTSxTQUFTLEdBQUcseUJBQVMsVUFBQyxJQUFxQixFQUFZO01BQXRCLE1BQU0sR0FBakIsSUFBcUIsQ0FBbkIsS0FBSyxDQUFJLE1BQU07O0FBQzNDLE1BQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLEVBQUUsQ0FBQzs7QUFFM0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLE1BQ0UsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQ3BCLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUN4QixDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFDckI7QUFDQSxXQUFPLElBQUksRUFBRSxDQUFDO0dBQ2Y7O0FBRUQsU0FDRTs7O0FBQ0UsZUFBUyxFQUFDLHFCQUFxQjtBQUMvQixjQUFRLEVBQUMsSUFBSTtBQUNiLFdBQUssRUFBRTtBQUNMLGdCQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLCtCQUErQixJQUFJLFNBQVM7T0FDdEUsQUFBQzs7SUFFRjs7UUFBVyxJQUFJLEVBQUUsTUFBTSxBQUFDO01BQ3RCLGlDQUFDLHNCQUFNLElBQUksT0FBRztNQUNkLHVFQUFZO01BQ1osaUNBQUMsc0JBQU0sS0FBSyxPQUFHO0tBQ0w7R0FDUixDQUNOO0NBQ0gsQ0FBQyxDQUFDOztxQkFFWSxTQUFTIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL2luc3BlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCB7IFJpY2hNZWRpYSwgTWVkaWEgfSBmcm9tIFwiQG50ZXJhY3Qvb3V0cHV0c1wiO1xuXG5pbXBvcnQgeyBJTlNQRUNUT1JfVVJJIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi9rZXJuZWxcIjtcbmltcG9ydCBNYXJrZG93biBmcm9tIFwiLi9yZXN1bHQtdmlldy9tYXJrZG93blwiO1xuXG50eXBlIFByb3BzID0geyBzdG9yZTogeyBrZXJuZWw6ID9LZXJuZWwgfSB9O1xuXG5mdW5jdGlvbiBoaWRlKCkge1xuICBhdG9tLndvcmtzcGFjZS5oaWRlKElOU1BFQ1RPUl9VUkkpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgSW5zcGVjdG9yID0gb2JzZXJ2ZXIoKHsgc3RvcmU6IHsga2VybmVsIH0gfTogUHJvcHMpID0+IHtcbiAgaWYgKCFrZXJuZWwpIHJldHVybiBoaWRlKCk7XG5cbiAgY29uc3QgYnVuZGxlID0ga2VybmVsLmluc3BlY3Rvci5idW5kbGU7XG5cbiAgaWYgKFxuICAgICFidW5kbGVbXCJ0ZXh0L2h0bWxcIl0gJiZcbiAgICAhYnVuZGxlW1widGV4dC9tYXJrZG93blwiXSAmJlxuICAgICFidW5kbGVbXCJ0ZXh0L3BsYWluXCJdXG4gICkge1xuICAgIHJldHVybiBoaWRlKCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cIm5hdGl2ZS1rZXktYmluZGluZ3NcIlxuICAgICAgdGFiSW5kZXg9XCItMVwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBmb250U2l6ZTogYXRvbS5jb25maWcuZ2V0KGBIeWRyb2dlbi5vdXRwdXRBcmVhRm9udFNpemVgKSB8fCBcImluaGVyaXRcIlxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UmljaE1lZGlhIGRhdGE9e2J1bmRsZX0+XG4gICAgICAgIDxNZWRpYS5IVE1MIC8+XG4gICAgICAgIDxNYXJrZG93biAvPlxuICAgICAgICA8TWVkaWEuUGxhaW4gLz5cbiAgICAgIDwvUmljaE1lZGlhPlxuICAgIDwvZGl2PlxuICApO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEluc3BlY3RvcjtcbiJdfQ==