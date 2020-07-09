Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTable = require("react-table");

var _reactTable2 = _interopRequireDefault(_reactTable);

// This component is in charge of getting state into the React system.
'use babel';

var VariableExplorer = (function (_React$Component) {
  _inherits(VariableExplorer, _React$Component);

  function VariableExplorer(props) {
    _classCallCheck(this, VariableExplorer);

    _get(Object.getPrototypeOf(VariableExplorer.prototype), "constructor", this).call(this, props);
    this.state = {
      tableData: []
    };
    this.subscriptions = null;
  }

  _createClass(VariableExplorer, [{
    key: "handleUpdateVars",
    value: function handleUpdateVars(data) {
      this.setState(function (prevState) {
        return {
          tableData: data
        };
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.subscriptions = new _atom.CompositeDisposable();
      this.subscriptions.add(this.props.emitter.on('did-update-vars', this.handleUpdateVars.bind(this)));
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.subscriptions) {
        this.subscriptions.dispose();
        this.subscriptions = null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react2["default"].createElement(VariableExplorerRenderer, { data: this.state });
    }
  }]);

  return VariableExplorer;
})(_react2["default"].Component);

exports["default"] = VariableExplorer;

var VariableExplorerRenderer = (function (_React$Component2) {
  _inherits(VariableExplorerRenderer, _React$Component2);

  function VariableExplorerRenderer() {
    _classCallCheck(this, VariableExplorerRenderer);

    _get(Object.getPrototypeOf(VariableExplorerRenderer.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(VariableExplorerRenderer, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { "class": "hpy-variable-explorer" },
        _react2["default"].createElement(_reactTable2["default"], {
          data: this.props.data.tableData,
          columns: [{
            Header: "Name",
            accessor: "name"
          }, {
            Header: "Type",
            accessor: "type",
            maxWidth: 75
          }, {
            Header: "Size",
            accessor: "size",
            maxWidth: 75
          }, // accessor: d => d.size
          {
            Header: "Value",
            accessor: "value"
          }],
          defaultPageSize: 100,
          showPageSizeOptions: false,
          minRows: 20,
          className: "-striped -highlight hpy-variable-table",
          noDataText: "Variable explorer will initialize once you run a chunk of code. This experimental feature was tested with Python 3 only."
        })
      );
    }
  }]);

  return VariableExplorerRenderer;
})(_react2["default"].Component);

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2h5ZHJvZ2VuLXB5dGhvbi9saWIvdmFyaWFibGUtZXhwbG9yZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBRW9DLE1BQU07O3FCQUN4QixPQUFPOzs7OzBCQUNGLGFBQWE7Ozs7O0FBSnBDLFdBQVcsQ0FBQzs7SUFPUyxnQkFBZ0I7WUFBaEIsZ0JBQWdCOztBQUN4QixXQURRLGdCQUFnQixDQUN2QixLQUFLLEVBQUU7MEJBREEsZ0JBQWdCOztBQUVqQywrQkFGaUIsZ0JBQWdCLDZDQUUzQixLQUFLLEVBQUU7QUFDYixRQUFJLENBQUMsS0FBSyxHQUFHO0FBQ1gsZUFBUyxFQUFFLEVBQUU7S0FDZCxDQUFDO0FBQ0YsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7R0FDM0I7O2VBUGtCLGdCQUFnQjs7V0FTbkIsMEJBQUMsSUFBSSxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxRQUFRLENBQUMsVUFBQSxTQUFTO2VBQUs7QUFDMUIsbUJBQVMsRUFBRSxJQUFJO1NBQ2hCO09BQUMsQ0FBQyxDQUFDO0tBQ0w7OztXQUVnQiw2QkFBRztBQUNsQixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMzRSxDQUFDO0tBQ0g7OztXQUVtQixnQ0FBRztBQUNyQixVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixZQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztPQUMzQjtLQUNGOzs7V0FFSyxrQkFBRztBQUNQLGFBQ0UsaUNBQUMsd0JBQXdCLElBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEFBQUMsR0FBRyxDQUM5QztLQUNIOzs7U0FqQ2tCLGdCQUFnQjtHQUFTLG1CQUFNLFNBQVM7O3FCQUF4QyxnQkFBZ0I7O0lBb0MvQix3QkFBd0I7WUFBeEIsd0JBQXdCOztXQUF4Qix3QkFBd0I7MEJBQXhCLHdCQUF3Qjs7K0JBQXhCLHdCQUF3Qjs7O2VBQXhCLHdCQUF3Qjs7V0FDdEIsa0JBQUc7QUFDUCxhQUNFOztVQUFLLFNBQU0sdUJBQXVCO1FBQ2hDO0FBQ0UsY0FBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQUFBQztBQUNoQyxpQkFBTyxFQUFFLENBQ1A7QUFDRSxrQkFBTSxFQUFFLE1BQU07QUFDZCxvQkFBUSxFQUFFLE1BQU07V0FDakIsRUFDRDtBQUNFLGtCQUFNLEVBQUUsTUFBTTtBQUNkLG9CQUFRLEVBQUUsTUFBTTtBQUNoQixvQkFBUSxFQUFFLEVBQUU7V0FDYixFQUNEO0FBQ0Usa0JBQU0sRUFBRSxNQUFNO0FBQ2Qsb0JBQVEsRUFBRSxNQUFNO0FBQ2hCLG9CQUFRLEVBQUUsRUFBRTtXQUViO0FBQ0Q7QUFDRSxrQkFBTSxFQUFFLE9BQU87QUFDZixvQkFBUSxFQUFFLE9BQU87V0FDbEIsQ0FDRixBQUFDO0FBQ0YseUJBQWUsRUFBRSxHQUFHLEFBQUM7QUFDckIsNkJBQW1CLEVBQUUsS0FBSyxBQUFDO0FBQzNCLGlCQUFPLEVBQUUsRUFBRSxBQUFDO0FBQ1osbUJBQVMsRUFBQyx3Q0FBd0M7QUFDbEQsb0JBQVUsRUFBQywwSEFBMEg7VUFDckk7T0FDRSxDQUNOO0tBQ0g7OztTQW5DRyx3QkFBd0I7R0FBUyxtQkFBTSxTQUFTIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2h5ZHJvZ2VuLXB5dGhvbi9saWIvdmFyaWFibGUtZXhwbG9yZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RUYWJsZSBmcm9tIFwicmVhY3QtdGFibGVcIjtcblxuLy8gVGhpcyBjb21wb25lbnQgaXMgaW4gY2hhcmdlIG9mIGdldHRpbmcgc3RhdGUgaW50byB0aGUgUmVhY3Qgc3lzdGVtLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmFyaWFibGVFeHBsb3JlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB0YWJsZURhdGE6IFtdLFxuICAgIH07XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVVwZGF0ZVZhcnMoZGF0YSkge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICB0YWJsZURhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLnByb3BzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtdmFycycsIHRoaXMuaGFuZGxlVXBkYXRlVmFycy5iaW5kKHRoaXMpKSxcbiAgICApO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8VmFyaWFibGVFeHBsb3JlclJlbmRlcmVyIGRhdGE9e3RoaXMuc3RhdGV9IC8+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBWYXJpYWJsZUV4cGxvcmVyUmVuZGVyZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3M9XCJocHktdmFyaWFibGUtZXhwbG9yZXJcIj5cbiAgICAgICAgPFJlYWN0VGFibGVcbiAgICAgICAgICBkYXRhPXt0aGlzLnByb3BzLmRhdGEudGFibGVEYXRhfVxuICAgICAgICAgIGNvbHVtbnM9e1tcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgSGVhZGVyOiBcIk5hbWVcIixcbiAgICAgICAgICAgICAgYWNjZXNzb3I6IFwibmFtZVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgSGVhZGVyOiBcIlR5cGVcIixcbiAgICAgICAgICAgICAgYWNjZXNzb3I6IFwidHlwZVwiLFxuICAgICAgICAgICAgICBtYXhXaWR0aDogNzUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBIZWFkZXI6IFwiU2l6ZVwiLFxuICAgICAgICAgICAgICBhY2Nlc3NvcjogXCJzaXplXCIsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiA3NSxcbiAgICAgICAgICAgICAgLy8gYWNjZXNzb3I6IGQgPT4gZC5zaXplXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBIZWFkZXI6IFwiVmFsdWVcIixcbiAgICAgICAgICAgICAgYWNjZXNzb3I6IFwidmFsdWVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXX1cbiAgICAgICAgICBkZWZhdWx0UGFnZVNpemU9ezEwMH1cbiAgICAgICAgICBzaG93UGFnZVNpemVPcHRpb25zPXtmYWxzZX1cbiAgICAgICAgICBtaW5Sb3dzPXsyMH1cbiAgICAgICAgICBjbGFzc05hbWU9XCItc3RyaXBlZCAtaGlnaGxpZ2h0IGhweS12YXJpYWJsZS10YWJsZVwiXG4gICAgICAgICAgbm9EYXRhVGV4dD1cIlZhcmlhYmxlIGV4cGxvcmVyIHdpbGwgaW5pdGlhbGl6ZSBvbmNlIHlvdSBydW4gYSBjaHVuayBvZiBjb2RlLiBUaGlzIGV4cGVyaW1lbnRhbCBmZWF0dXJlIHdhcyB0ZXN0ZWQgd2l0aCBQeXRob24gMyBvbmx5LlwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iXX0=