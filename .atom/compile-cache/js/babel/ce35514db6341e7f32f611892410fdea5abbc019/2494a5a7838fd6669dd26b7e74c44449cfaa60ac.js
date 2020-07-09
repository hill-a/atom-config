Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require("mobx-react");

var _display = require("./display");

var _display2 = _interopRequireDefault(_display);

var _reactRangeslider = require("react-rangeslider");

var _reactRangeslider2 = _interopRequireDefault(_reactRangeslider);

var counterStyle = {
  position: "absolute",
  pointerEvents: "none",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)"
};

var History = (0, _mobxReact.observer)(function (_ref) {
  var store = _ref.store;
  return (function () {
    var output = store.outputs[store.index];
    return output ? _react2["default"].createElement(
      "div",
      { className: "history" },
      _react2["default"].createElement(
        "div",
        { className: "slider" },
        _react2["default"].createElement("div", {
          className: "btn btn-xs icon icon-chevron-left",
          style: { position: "absolute", left: "0px" },
          onClick: store.decrementIndex
        }),
        _react2["default"].createElement(_reactRangeslider2["default"], {
          min: 0,
          max: store.outputs.length - 1,
          value: store.index,
          onChange: store.setIndex,
          tooltip: false
        }),
        _react2["default"].createElement(
          "div",
          { style: counterStyle },
          store.index + 1,
          "/",
          store.outputs.length
        ),
        _react2["default"].createElement("div", {
          className: "btn btn-xs icon icon-chevron-right",
          style: { position: "absolute", right: "0px" },
          onClick: store.incrementIndex
        })
      ),
      _react2["default"].createElement(
        "div",
        {
          className: "multiline-container native-key-bindings",
          tabIndex: "-1",
          style: {
            fontSize: atom.config.get("Hydrogen.outputAreaFontSize") || "inherit"
          },
          "hydrogen-wrapoutput": atom.config.get("Hydrogen.wrapOutput").toString()
        },
        _react2["default"].createElement(_display2["default"], { output: output })
      )
    ) : null;
  })();
});

exports["default"] = History;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L2hpc3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUVrQixPQUFPOzs7O3lCQUNBLFlBQVk7O3VCQUNqQixXQUFXOzs7O2dDQUNaLG1CQUFtQjs7OztBQUl0QyxJQUFNLFlBQVksR0FBRztBQUNuQixVQUFRLEVBQUUsVUFBVTtBQUNwQixlQUFhLEVBQUUsTUFBTTtBQUNyQixNQUFJLEVBQUUsS0FBSztBQUNYLEtBQUcsRUFBRSxLQUFLO0FBQ1YsV0FBUyxFQUFFLHVCQUF1QjtDQUNuQyxDQUFDOztBQUVGLElBQU0sT0FBTyxHQUFHLHlCQUFTLFVBQUMsSUFBUztNQUFQLEtBQUssR0FBUCxJQUFTLENBQVAsS0FBSztzQkFBK0I7QUFDOUQsUUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUMsV0FBTyxNQUFNLEdBQ1g7O1FBQUssU0FBUyxFQUFDLFNBQVM7TUFDdEI7O1VBQUssU0FBUyxFQUFDLFFBQVE7UUFDckI7QUFDRSxtQkFBUyxFQUFDLG1DQUFtQztBQUM3QyxlQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQUFBQztBQUM3QyxpQkFBTyxFQUFFLEtBQUssQ0FBQyxjQUFjLEFBQUM7VUFDOUI7UUFDRjtBQUNFLGFBQUcsRUFBRSxDQUFDLEFBQUM7QUFDUCxhQUFHLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxBQUFDO0FBQzlCLGVBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxBQUFDO0FBQ25CLGtCQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQUFBQztBQUN6QixpQkFBTyxFQUFFLEtBQUssQUFBQztVQUNmO1FBQ0Y7O1lBQUssS0FBSyxFQUFFLFlBQVksQUFBQztVQUN0QixLQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7O1VBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1NBQ25DO1FBQ047QUFDRSxtQkFBUyxFQUFDLG9DQUFvQztBQUM5QyxlQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQUFBQztBQUM5QyxpQkFBTyxFQUFFLEtBQUssQ0FBQyxjQUFjLEFBQUM7VUFDOUI7T0FDRTtNQUNOOzs7QUFDRSxtQkFBUyxFQUFDLHlDQUF5QztBQUNuRCxrQkFBUSxFQUFDLElBQUk7QUFDYixlQUFLLEVBQUU7QUFDTCxvQkFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRywrQkFBK0IsSUFBSSxTQUFTO1dBQ3RFLEFBQUM7QUFDRixpQ0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxBQUFDOztRQUV2RSx5REFBUyxNQUFNLEVBQUUsTUFBTSxBQUFDLEdBQUc7T0FDdkI7S0FDRixHQUNKLElBQUksQ0FBQztHQUNWO0NBQUEsQ0FBQyxDQUFDOztxQkFFWSxPQUFPIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L2hpc3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBvYnNlcnZlciB9IGZyb20gXCJtb2J4LXJlYWN0XCI7XG5pbXBvcnQgRGlzcGxheSBmcm9tIFwiLi9kaXNwbGF5XCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCJyZWFjdC1yYW5nZXNsaWRlclwiO1xuXG5pbXBvcnQgdHlwZSBPdXRwdXRTdG9yZSBmcm9tIFwiLi4vLi4vc3RvcmUvb3V0cHV0XCI7XG5cbmNvbnN0IGNvdW50ZXJTdHlsZSA9IHtcbiAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgcG9pbnRlckV2ZW50czogXCJub25lXCIsXG4gIGxlZnQ6IFwiNTAlXCIsXG4gIHRvcDogXCI1MCVcIixcbiAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZSgtNTAlLCAtNTAlKVwiXG59O1xuXG5jb25zdCBIaXN0b3J5ID0gb2JzZXJ2ZXIoKHsgc3RvcmUgfTogeyBzdG9yZTogT3V0cHV0U3RvcmUgfSkgPT4ge1xuICBjb25zdCBvdXRwdXQgPSBzdG9yZS5vdXRwdXRzW3N0b3JlLmluZGV4XTtcbiAgcmV0dXJuIG91dHB1dCA/IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhpc3RvcnlcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2xpZGVyXCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGljb24gaWNvbi1jaGV2cm9uLWxlZnRcIlxuICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGxlZnQ6IFwiMHB4XCIgfX1cbiAgICAgICAgICBvbkNsaWNrPXtzdG9yZS5kZWNyZW1lbnRJbmRleH1cbiAgICAgICAgLz5cbiAgICAgICAgPFNsaWRlclxuICAgICAgICAgIG1pbj17MH1cbiAgICAgICAgICBtYXg9e3N0b3JlLm91dHB1dHMubGVuZ3RoIC0gMX1cbiAgICAgICAgICB2YWx1ZT17c3RvcmUuaW5kZXh9XG4gICAgICAgICAgb25DaGFuZ2U9e3N0b3JlLnNldEluZGV4fVxuICAgICAgICAgIHRvb2x0aXA9e2ZhbHNlfVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IHN0eWxlPXtjb3VudGVyU3R5bGV9PlxuICAgICAgICAgIHtzdG9yZS5pbmRleCArIDF9L3tzdG9yZS5vdXRwdXRzLmxlbmd0aH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXhzIGljb24gaWNvbi1jaGV2cm9uLXJpZ2h0XCJcbiAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCByaWdodDogXCIwcHhcIiB9fVxuICAgICAgICAgIG9uQ2xpY2s9e3N0b3JlLmluY3JlbWVudEluZGV4fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cIm11bHRpbGluZS1jb250YWluZXIgbmF0aXZlLWtleS1iaW5kaW5nc1wiXG4gICAgICAgIHRhYkluZGV4PVwiLTFcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGZvbnRTaXplOiBhdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLm91dHB1dEFyZWFGb250U2l6ZWApIHx8IFwiaW5oZXJpdFwiXG4gICAgICAgIH19XG4gICAgICAgIGh5ZHJvZ2VuLXdyYXBvdXRwdXQ9e2F0b20uY29uZmlnLmdldChgSHlkcm9nZW4ud3JhcE91dHB1dGApLnRvU3RyaW5nKCl9XG4gICAgICA+XG4gICAgICAgIDxEaXNwbGF5IG91dHB1dD17b3V0cHV0fSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICkgOiBudWxsO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEhpc3Rvcnk7XG4iXX0=