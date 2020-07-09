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

var _atom = require("atom");

var _resultViewHistory = require("./../result-view/history");

var _resultViewHistory2 = _interopRequireDefault(_resultViewHistory);

var Watch = (function (_React$Component) {
  _inherits(Watch, _React$Component);

  function Watch() {
    _classCallCheck(this, Watch);

    _get(Object.getPrototypeOf(Watch.prototype), "constructor", this).apply(this, arguments);

    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(Watch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this = this;

      if (!this.container) return;
      var container = this.container;
      container.insertBefore(this.props.store.editor.element, container.firstChild);

      this.subscriptions.add(atom.commands.add(container, "core:move-left", function () {
        return _this.props.store.outputStore.decrementIndex();
      }), atom.commands.add(container, "core:move-right", function () {
        return _this.props.store.outputStore.incrementIndex();
      }));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.subscriptions.dispose();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2["default"].createElement(
        "div",
        {
          className: "hydrogen watch-view",
          ref: function (c) {
            _this2.container = c;
          }
        },
        _react2["default"].createElement(_resultViewHistory2["default"], { store: this.props.store.outputStore })
      );
    }
  }]);

  return Watch;
})(_react2["default"].Component);

exports["default"] = Watch;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3dhdGNoLXNpZGViYXIvd2F0Y2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7b0JBQ1csTUFBTTs7aUNBQ3RCLDBCQUEwQjs7OztJQUd6QixLQUFLO1lBQUwsS0FBSzs7V0FBTCxLQUFLOzBCQUFMLEtBQUs7OytCQUFMLEtBQUs7O1NBRXhCLGFBQWEsR0FBNkIsK0JBQXlCOzs7ZUFGaEQsS0FBSzs7V0FHUCw2QkFBRzs7O0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU87QUFDNUIsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNqQyxlQUFTLENBQUMsWUFBWSxDQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUMvQixTQUFTLENBQUMsVUFBVSxDQUNyQixDQUFDOztBQUVGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUU7ZUFDN0MsTUFBSyxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUU7T0FBQSxDQUM5QyxFQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRTtlQUM5QyxNQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRTtPQUFBLENBQzlDLENBQ0YsQ0FBQztLQUNIOzs7V0FFbUIsZ0NBQUc7QUFDckIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM5Qjs7O1dBRUssa0JBQUc7OztBQUNQLGFBQ0U7OztBQUNFLG1CQUFTLEVBQUMscUJBQXFCO0FBQy9CLGFBQUcsRUFBRSxVQUFBLENBQUMsRUFBSTtBQUNSLG1CQUFLLFNBQVMsR0FBRyxDQUFDLENBQUM7V0FDcEIsQUFBQzs7UUFFRixtRUFBUyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxBQUFDLEdBQUc7T0FDNUMsQ0FDTjtLQUNIOzs7U0FwQ2tCLEtBQUs7R0FBUyxtQkFBTSxTQUFTOztxQkFBN0IsS0FBSyIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy93YXRjaC1zaWRlYmFyL3dhdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgSGlzdG9yeSBmcm9tIFwiLi8uLi9yZXN1bHQtdmlldy9oaXN0b3J5XCI7XG5pbXBvcnQgdHlwZSBXYXRjaFN0b3JlIGZyb20gXCIuLy4uLy4uL3N0b3JlL3dhdGNoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdGNoIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHsgc3RvcmU6IFdhdGNoU3RvcmUgfT4ge1xuICBjb250YWluZXI6ID9IVE1MRWxlbWVudDtcbiAgc3Vic2NyaXB0aW9uczogYXRvbSRDb21wb3NpdGVEaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnRhaW5lcikgcmV0dXJuO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyO1xuICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoXG4gICAgICB0aGlzLnByb3BzLnN0b3JlLmVkaXRvci5lbGVtZW50LFxuICAgICAgY29udGFpbmVyLmZpcnN0Q2hpbGRcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKGNvbnRhaW5lciwgXCJjb3JlOm1vdmUtbGVmdFwiLCAoKSA9PlxuICAgICAgICB0aGlzLnByb3BzLnN0b3JlLm91dHB1dFN0b3JlLmRlY3JlbWVudEluZGV4KClcbiAgICAgICksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChjb250YWluZXIsIFwiY29yZTptb3ZlLXJpZ2h0XCIsICgpID0+XG4gICAgICAgIHRoaXMucHJvcHMuc3RvcmUub3V0cHV0U3RvcmUuaW5jcmVtZW50SW5kZXgoKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cImh5ZHJvZ2VuIHdhdGNoLXZpZXdcIlxuICAgICAgICByZWY9e2MgPT4ge1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gYztcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPEhpc3Rvcnkgc3RvcmU9e3RoaXMucHJvcHMuc3RvcmUub3V0cHV0U3RvcmV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXX0=