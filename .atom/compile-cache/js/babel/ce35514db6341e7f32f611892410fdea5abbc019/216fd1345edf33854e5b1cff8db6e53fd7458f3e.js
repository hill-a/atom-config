Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _nteractMathjax = require("@nteract/mathjax");

var _mathjaxElectron = require("mathjax-electron");

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _anser = require("anser");

var _anser2 = _interopRequireDefault(_anser);

var _resultViewHistory = require("./result-view/history");

var _resultViewHistory2 = _interopRequireDefault(_resultViewHistory);

var _resultViewList = require("./result-view/list");

var _resultViewList2 = _interopRequireDefault(_resultViewList);

var _utils = require("./../utils");

var OutputArea = (function (_React$Component) {
  var _instanceInitializers = {};

  _inherits(OutputArea, _React$Component);

  function OutputArea() {
    var _this = this;

    _classCallCheck(this, _OutputArea);

    _get(Object.getPrototypeOf(_OutputArea.prototype), "constructor", this).apply(this, arguments);

    _defineDecoratedPropertyDescriptor(this, "showHistory", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setHistory", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "setScrollList", _instanceInitializers);

    this.handleClick = function () {
      var kernel = _this.props.store.kernel;
      if (!kernel || !kernel.outputStore) return;
      var output = kernel.outputStore.outputs[kernel.outputStore.index];
      var copyOutput = _this.getOutputText(output);

      if (copyOutput) {
        atom.clipboard.write(_anser2["default"].ansiToText(copyOutput));
        atom.notifications.addSuccess("Copied to clipboard");
      } else {
        atom.notifications.addWarning("Nothing to copy");
      }
    };
  }

  _createDecoratedClass(OutputArea, [{
    key: "getOutputText",
    value: function getOutputText(output) {
      switch (output.output_type) {
        case "stream":
          return output.text;
        case "execute_result":
          return output.data["text/plain"];
        case "error":
          return output.traceback.toJS().join("\n");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var kernel = this.props.store.kernel;

      if (!kernel) {
        if (atom.config.get("Hydrogen.outputAreaDock")) {
          return _react2["default"].createElement(_utils.EmptyMessage, null);
        } else {
          atom.workspace.hide(_utils.OUTPUT_AREA_URI);
          return null;
        }
      }
      return _react2["default"].createElement(
        _nteractMathjax.Provider,
        { src: _mathjaxElectron.mathJaxPath },
        _react2["default"].createElement(
          "div",
          { className: "sidebar output-area" },
          kernel.outputStore.outputs.length > 0 ? _react2["default"].createElement(
            "div",
            { className: "block" },
            _react2["default"].createElement(
              "div",
              { className: "btn-group" },
              _react2["default"].createElement("button", {
                className: "btn icon icon-clock" + (this.showHistory ? " selected" : ""),
                onClick: this.setHistory
              }),
              _react2["default"].createElement("button", {
                className: "btn icon icon-three-bars" + (!this.showHistory ? " selected" : ""),
                onClick: this.setScrollList
              })
            ),
            _react2["default"].createElement(
              "div",
              { style: { float: "right" } },
              this.showHistory ? _react2["default"].createElement(
                "button",
                {
                  className: "btn icon icon-clippy",
                  onClick: this.handleClick
                },
                "Copy"
              ) : null,
              _react2["default"].createElement(
                "button",
                {
                  className: "btn icon icon-trashcan",
                  onClick: kernel.outputStore.clear
                },
                "Clear"
              )
            )
          ) : _react2["default"].createElement(_utils.EmptyMessage, null),
          this.showHistory ? _react2["default"].createElement(_resultViewHistory2["default"], { store: kernel.outputStore }) : _react2["default"].createElement(_resultViewList2["default"], { outputs: kernel.outputStore.outputs })
        )
      );
    }
  }, {
    key: "showHistory",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return true;
    },
    enumerable: true
  }, {
    key: "setHistory",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.showHistory = true;
      };
    },
    enumerable: true
  }, {
    key: "setScrollList",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function () {
        _this3.showHistory = false;
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  var _OutputArea = OutputArea;
  OutputArea = (0, _mobxReact.observer)(OutputArea) || OutputArea;
  return OutputArea;
})(_react2["default"].Component);

exports["default"] = OutputArea;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL291dHB1dC1hcmVhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7OEJBQ0Esa0JBQWtCOzsrQkFDZixrQkFBa0I7O29CQUNYLE1BQU07O3lCQUNoQixZQUFZOztxQkFDbkIsT0FBTzs7OztpQ0FFTCx1QkFBdUI7Ozs7OEJBQ3BCLG9CQUFvQjs7OztxQkFDRyxZQUFZOztJQUtwRCxVQUFVOzs7WUFBVixVQUFVOztXQUFWLFVBQVU7Ozs7Ozs7Ozs7Ozs7U0F3QmQsV0FBVyxHQUFHLFlBQU07QUFDbEIsVUFBTSxNQUFNLEdBQUcsTUFBSyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN2QyxVQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPO0FBQzNDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEUsVUFBTSxVQUFVLEdBQUcsTUFBSyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlDLFVBQUksVUFBVSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsbUJBQU0sVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsWUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztPQUN0RCxNQUFNO0FBQ0wsWUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztPQUNsRDtLQUNGOzs7d0JBcENHLFVBQVU7O1dBYUQsdUJBQUMsTUFBYyxFQUFXO0FBQ3JDLGNBQVEsTUFBTSxDQUFDLFdBQVc7QUFDeEIsYUFBSyxRQUFRO0FBQ1gsaUJBQU8sTUFBTSxDQUFDLElBQUksQ0FBQztBQUFBLEFBQ3JCLGFBQUssZ0JBQWdCO0FBQ25CLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFBQSxBQUNuQyxhQUFLLE9BQU87QUFDVixpQkFBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUFBLE9BQzdDO0tBQ0Y7OztXQWdCSyxrQkFBRztBQUNQLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7QUFFdkMsVUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRTtBQUM5QyxpQkFBTywyREFBZ0IsQ0FBQztTQUN6QixNQUFNO0FBQ0wsY0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUFpQixDQUFDO0FBQ3JDLGlCQUFPLElBQUksQ0FBQztTQUNiO09BQ0Y7QUFDRCxhQUNFOztVQUFVLEdBQUcsOEJBQWM7UUFDekI7O1lBQUssU0FBUyxFQUFDLHFCQUFxQjtVQUNqQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUNwQzs7Y0FBSyxTQUFTLEVBQUMsT0FBTztZQUNwQjs7Z0JBQUssU0FBUyxFQUFDLFdBQVc7Y0FDeEI7QUFDRSx5QkFBUywyQkFDUCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsR0FBRyxFQUFFLENBQUEsQUFDbEM7QUFDSCx1QkFBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEFBQUM7Z0JBQ3pCO2NBQ0Y7QUFDRSx5QkFBUyxnQ0FDUCxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxHQUFHLEVBQUUsQ0FBQSxBQUNuQztBQUNILHVCQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQUFBQztnQkFDNUI7YUFDRTtZQUNOOztnQkFBSyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEFBQUM7Y0FDNUIsSUFBSSxDQUFDLFdBQVcsR0FDZjs7O0FBQ0UsMkJBQVMsRUFBQyxzQkFBc0I7QUFDaEMseUJBQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxBQUFDOzs7ZUFHbkIsR0FDUCxJQUFJO2NBQ1I7OztBQUNFLDJCQUFTLEVBQUMsd0JBQXdCO0FBQ2xDLHlCQUFPLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEFBQUM7OztlQUczQjthQUNMO1dBQ0YsR0FFTiwyREFBZ0IsQUFDakI7VUFDQSxJQUFJLENBQUMsV0FBVyxHQUNmLG1FQUFTLEtBQUssRUFBRSxNQUFNLENBQUMsV0FBVyxBQUFDLEdBQUcsR0FFdEMsZ0VBQVksT0FBTyxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxBQUFDLEdBQUcsQUFDcEQ7U0FDRztPQUNHLENBQ1g7S0FDSDs7Ozs7YUE5RnNCLElBQUk7Ozs7Ozs7OzthQUVkLFlBQU07QUFDakIsZUFBSyxXQUFXLEdBQUcsSUFBSSxDQUFDO09BQ3pCOzs7Ozs7Ozs7YUFHZSxZQUFNO0FBQ3BCLGVBQUssV0FBVyxHQUFHLEtBQUssQ0FBQztPQUMxQjs7Ozs7b0JBWEcsVUFBVTtBQUFWLFlBQVUsNEJBQVYsVUFBVSxLQUFWLFVBQVU7U0FBVixVQUFVO0dBQVMsbUJBQU0sU0FBUzs7cUJBbUd6QixVQUFVIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL291dHB1dC1hcmVhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tIFwiQG50ZXJhY3QvbWF0aGpheFwiO1xuaW1wb3J0IHsgbWF0aEpheFBhdGggfSBmcm9tIFwibWF0aGpheC1lbGVjdHJvblwiO1xuaW1wb3J0IHsgYWN0aW9uLCBvYnNlcnZhYmxlIH0gZnJvbSBcIm1vYnhcIjtcbmltcG9ydCB7IG9ic2VydmVyIH0gZnJvbSBcIm1vYngtcmVhY3RcIjtcbmltcG9ydCBBbnNlciBmcm9tIFwiYW5zZXJcIjtcblxuaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vcmVzdWx0LXZpZXcvaGlzdG9yeVwiO1xuaW1wb3J0IFNjcm9sbExpc3QgZnJvbSBcIi4vcmVzdWx0LXZpZXcvbGlzdFwiO1xuaW1wb3J0IHsgT1VUUFVUX0FSRUFfVVJJLCBFbXB0eU1lc3NhZ2UgfSBmcm9tIFwiLi8uLi91dGlsc1wiO1xuXG5pbXBvcnQgdHlwZW9mIHN0b3JlIGZyb20gXCIuLi9zdG9yZVwiO1xuXG5Ab2JzZXJ2ZXJcbmNsYXNzIE91dHB1dEFyZWEgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8eyBzdG9yZTogc3RvcmUgfT4ge1xuICBAb2JzZXJ2YWJsZVxuICBzaG93SGlzdG9yeTogYm9vbGVhbiA9IHRydWU7XG4gIEBhY3Rpb25cbiAgc2V0SGlzdG9yeSA9ICgpID0+IHtcbiAgICB0aGlzLnNob3dIaXN0b3J5ID0gdHJ1ZTtcbiAgfTtcblxuICBAYWN0aW9uXG4gIHNldFNjcm9sbExpc3QgPSAoKSA9PiB7XG4gICAgdGhpcy5zaG93SGlzdG9yeSA9IGZhbHNlO1xuICB9O1xuXG4gIGdldE91dHB1dFRleHQob3V0cHV0OiBPYmplY3QpOiA/c3RyaW5nIHtcbiAgICBzd2l0Y2ggKG91dHB1dC5vdXRwdXRfdHlwZSkge1xuICAgICAgY2FzZSBcInN0cmVhbVwiOlxuICAgICAgICByZXR1cm4gb3V0cHV0LnRleHQ7XG4gICAgICBjYXNlIFwiZXhlY3V0ZV9yZXN1bHRcIjpcbiAgICAgICAgcmV0dXJuIG91dHB1dC5kYXRhW1widGV4dC9wbGFpblwiXTtcbiAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICByZXR1cm4gb3V0cHV0LnRyYWNlYmFjay50b0pTKCkuam9pbihcIlxcblwiKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDbGljayA9ICgpID0+IHtcbiAgICBjb25zdCBrZXJuZWwgPSB0aGlzLnByb3BzLnN0b3JlLmtlcm5lbDtcbiAgICBpZiAoIWtlcm5lbCB8fCAha2VybmVsLm91dHB1dFN0b3JlKSByZXR1cm47XG4gICAgY29uc3Qgb3V0cHV0ID0ga2VybmVsLm91dHB1dFN0b3JlLm91dHB1dHNba2VybmVsLm91dHB1dFN0b3JlLmluZGV4XTtcbiAgICBjb25zdCBjb3B5T3V0cHV0ID0gdGhpcy5nZXRPdXRwdXRUZXh0KG91dHB1dCk7XG5cbiAgICBpZiAoY29weU91dHB1dCkge1xuICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUoQW5zZXIuYW5zaVRvVGV4dChjb3B5T3V0cHV0KSk7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIkNvcGllZCB0byBjbGlwYm9hcmRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwiTm90aGluZyB0byBjb3B5XCIpO1xuICAgIH1cbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qga2VybmVsID0gdGhpcy5wcm9wcy5zdG9yZS5rZXJuZWw7XG5cbiAgICBpZiAoIWtlcm5lbCkge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLm91dHB1dEFyZWFEb2NrXCIpKSB7XG4gICAgICAgIHJldHVybiA8RW1wdHlNZXNzYWdlIC8+O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuaGlkZShPVVRQVVRfQVJFQV9VUkkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxQcm92aWRlciBzcmM9e21hdGhKYXhQYXRofT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlYmFyIG91dHB1dC1hcmVhXCI+XG4gICAgICAgICAge2tlcm5lbC5vdXRwdXRTdG9yZS5vdXRwdXRzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJsb2NrXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYnRuIGljb24gaWNvbi1jbG9jayR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0hpc3RvcnkgPyBcIiBzZWxlY3RlZFwiIDogXCJcIlxuICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNldEhpc3Rvcnl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BidG4gaWNvbiBpY29uLXRocmVlLWJhcnMke1xuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zaG93SGlzdG9yeSA/IFwiIHNlbGVjdGVkXCIgOiBcIlwiXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2V0U2Nyb2xsTGlzdH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbG9hdDogXCJyaWdodFwiIH19PlxuICAgICAgICAgICAgICAgIHt0aGlzLnNob3dIaXN0b3J5ID8gKFxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gaWNvbiBpY29uLWNsaXBweVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIENvcHlcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBpY29uIGljb24tdHJhc2hjYW5cIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17a2VybmVsLm91dHB1dFN0b3JlLmNsZWFyfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIENsZWFyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxFbXB0eU1lc3NhZ2UgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIHt0aGlzLnNob3dIaXN0b3J5ID8gKFxuICAgICAgICAgICAgPEhpc3Rvcnkgc3RvcmU9e2tlcm5lbC5vdXRwdXRTdG9yZX0gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPFNjcm9sbExpc3Qgb3V0cHV0cz17a2VybmVsLm91dHB1dFN0b3JlLm91dHB1dHN9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1Byb3ZpZGVyPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT3V0cHV0QXJlYTtcbiJdfQ==