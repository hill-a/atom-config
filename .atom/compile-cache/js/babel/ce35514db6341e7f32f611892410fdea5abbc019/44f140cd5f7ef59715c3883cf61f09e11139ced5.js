Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _templateObject = _taggedTemplateLiteral(["\n:root{\n  --nt-color-midnight: hsl(0, 0%, 15%);\n  --nt-color-midnight-lightest: hsl(0, 0%, 85%);\n  --theme-app-fg: ", ";\n  --theme-app-bg: ", ";\n}\n\n.data-explorer-container {\n  background-color: var(--theme-app-bg);\n  color: var(--theme-app-fg);\n  select {\n    /* the viz control select buttons */\n    color: black;\n  }\n\n  .ReactTable .-pagination .-btn {\n    color: var(--theme-app-fg);\n  }\n\n  div.control-wrapper > button {\n    color: black;\n  }\n\n  /* Otherwise some dark themes make selected button text hard to read */\n  .selected {\n    color: black;\n  }\n\n}\n\n"], ["\n:root{\n  --nt-color-midnight: hsl(0, 0%, 15%);\n  --nt-color-midnight-lightest: hsl(0, 0%, 85%);\n  --theme-app-fg: ", ";\n  --theme-app-bg: ", ";\n}\n\n.data-explorer-container {\n  background-color: var(--theme-app-bg);\n  color: var(--theme-app-fg);\n  select {\n    /* the viz control select buttons */\n    color: black;\n  }\n\n  .ReactTable .-pagination .-btn {\n    color: var(--theme-app-fg);\n  }\n\n  div.control-wrapper > button {\n    color: black;\n  }\n\n  /* Otherwise some dark themes make selected button text hard to read */\n  .selected {\n    color: black;\n  }\n\n}\n\n"]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _styledComponents = require("styled-components");

// $FlowFixMe

var _nteractDataExplorer = require("@nteract/data-explorer");

var _atom = require("atom");

var _common = require("./common");

var GlobalThemeVariables = (0, _styledComponents.createGlobalStyle)(_templateObject, function (props) {
  return props.theme === "light" ? "var(--nt-color-midnight)" : "var(--nt-color-midnight-lightest)";
}, function (props) {
  return props.theme === "light" ? "white" : "#2b2b2b";
});

function DataExplorerCustom(_ref) {
  var data = _ref.data;

  var _useState = (0, _react.useState)(atom.config.get("data-explorer.theme"));

  var _useState2 = _slicedToArray(_useState, 2);

  var theme = _useState2[0];
  var setTheme = _useState2[1];

  (0, _react.useEffect)(function () {
    var disposer = atom.config.observe("data-explorer.theme", function (newValue) {
      setTheme(newValue);
    });

    return function () {
      disposer.dispose();
    };
  }, []);

  (0, _react.useEffect)(function () {
    atom.config.set("data-explorer.theme", theme);
  }, [theme]);

  var otherTheme = theme === "light" ? "dark" : "light";
  return _react2["default"].createElement(
    _react2["default"].Fragment,
    null,
    _react2["default"].createElement(GlobalThemeVariables, { theme: theme }),
    _react2["default"].createElement(
      "label",
      { className: "input-label", style: { marginLeft: "10px" } },
      "Dark mode",
      _react2["default"].createElement("input", {
        className: "input-toggle",
        type: "checkbox",
        checked: theme === "dark",
        onChange: function (e) {
          var newTheme = e.target.checked ? "dark" : "light";
          setTheme(newTheme);
        },
        style: { margin: "10px" }
      })
    ),
    _react2["default"].createElement(
      _nteractDataExplorer.DataExplorer,
      { data: data, theme: theme },
      _react2["default"].createElement(_nteractDataExplorer.Toolbar, null),
      _react2["default"].createElement(_nteractDataExplorer.Viz, null)
    )
  );
}

var DataExplorerView = (function () {
  function DataExplorerView(data) {
    var _this = this;

    _classCallCheck(this, DataExplorerView);

    this.subscriptions = new _atom.CompositeDisposable();
    this.element = document.createElement("div");
    this.element.classList.add("data-explorer-container");
    this.element.classList.add("native-key-bindings");

    this.subscriptions.add(new _atom.Disposable(function () {
      _reactDom2["default"].unmountComponentAtNode(_this.element);
    }));

    this.render(data);
  }

  _createClass(DataExplorerView, [{
    key: "getTitle",
    value: function getTitle() {
      return "Data Explorer";
    }
  }, {
    key: "getDefaultLocation",
    value: function getDefaultLocation() {
      return "right";
    }
  }, {
    key: "getAllowedLocations",
    value: function getAllowedLocations() {
      return ["left", "right", "bottom"];
    }
  }, {
    key: "getURI",
    value: function getURI() {
      return _common.DATA_EXPLORER_URI;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.element.remove();
      this.subscriptions.dispose();
    }
  }, {
    key: "getElement",
    value: function getElement() {
      return this.element;
    }
  }, {
    key: "show",
    value: function show() {
      var container = atom.workspace.paneContainerForURI(this.getURI());
      if (!container || !container.show) return;

      container.show();
    }
  }, {
    key: "render",
    value: function render(data) {
      if (!data) return;
      _reactDom2["default"].render(_react2["default"].createElement(DataExplorerCustom, { data: data }), this.element);
    }
  }]);

  return DataExplorerView;
})();

exports["default"] = DataExplorerView;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2RhdGEtZXhwbG9yZXIvbGliL2RhdGEtZXhwbG9yZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUUyQyxPQUFPOzs7O3dCQUM3QixXQUFXOzs7O2dDQUNFLG1CQUFtQjs7OzttQ0FFVix3QkFBd0I7O29CQUNuQixNQUFNOztzQkFFTSxVQUFVOztBQUl0RSxJQUFNLG9CQUFvQiw2REFJTixVQUFBLEtBQUs7U0FDckIsS0FBSyxDQUFDLEtBQUssS0FBSyxPQUFPLEdBQ25CLDBCQUEwQixHQUMxQixtQ0FBbUM7Q0FBQSxFQUN2QixVQUFBLEtBQUs7U0FBSyxLQUFLLENBQUMsS0FBSyxLQUFLLE9BQU8sR0FBRyxPQUFPLEdBQUcsU0FBUztDQUFDLENBMEIzRSxDQUFDOztBQUVGLFNBQVMsa0JBQWtCLENBQUMsSUFBUSxFQUFFO01BQVIsSUFBSSxHQUFOLElBQVEsQ0FBTixJQUFJOztrQkFDTixxQkFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDOzs7O01BQW5FLEtBQUs7TUFBRSxRQUFROztBQUV0Qix3QkFBVSxZQUFNO0FBQ2QsUUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsVUFBQSxRQUFRLEVBQUk7QUFDdEUsY0FBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3BCLENBQUMsQ0FBQzs7QUFFSCxXQUFPLFlBQU07QUFDWCxjQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDcEIsQ0FBQztHQUNILEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRVAsd0JBQVUsWUFBTTtBQUNkLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQy9DLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVaLE1BQU0sVUFB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eHBsb3Jlci9saWIvZGF0YS1leHBsb3Jlci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBSZWFjdERPTSBmcm9tIFwicmVhY3QtZG9tXCI7XG5pbXBvcnQgeyBjcmVhdGVHbG9iYWxTdHlsZSB9IGZyb20gXCJzdHlsZWQtY29tcG9uZW50c1wiO1xuLy8gJEZsb3dGaXhNZVxuaW1wb3J0IHsgRGF0YUV4cGxvcmVyLCBUb29sYmFyLCBWaXogfSBmcm9tIFwiQG50ZXJhY3QvZGF0YS1leHBsb3JlclwiO1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCI7XG5cbmltcG9ydCB7IERBVEFfRVhQTE9SRVJfTUVESUFfVFlQRSwgREFUQV9FWFBMT1JFUl9VUkkgfSBmcm9tIFwiLi9jb21tb25cIjtcblxuaW1wb3J0IHR5cGUgeyBEYXRhUmVzb3VyY2UgfSBmcm9tIFwiLi9jb21tb25cIjtcblxuY29uc3QgR2xvYmFsVGhlbWVWYXJpYWJsZXMgPSBjcmVhdGVHbG9iYWxTdHlsZWBcbjpyb290e1xuICAtLW50LWNvbG9yLW1pZG5pZ2h0OiBoc2woMCwgMCUsIDE1JSk7XG4gIC0tbnQtY29sb3ItbWlkbmlnaHQtbGlnaHRlc3Q6IGhzbCgwLCAwJSwgODUlKTtcbiAgLS10aGVtZS1hcHAtZmc6ICR7cHJvcHMgPT5cbiAgICBwcm9wcy50aGVtZSA9PT0gXCJsaWdodFwiXG4gICAgICA/IFwidmFyKC0tbnQtY29sb3ItbWlkbmlnaHQpXCJcbiAgICAgIDogXCJ2YXIoLS1udC1jb2xvci1taWRuaWdodC1saWdodGVzdClcIn07XG4gIC0tdGhlbWUtYXBwLWJnOiAke3Byb3BzID0+IChwcm9wcy50aGVtZSA9PT0gXCJsaWdodFwiID8gXCJ3aGl0ZVwiIDogXCIjMmIyYjJiXCIpfTtcbn1cblxuLmRhdGEtZXhwbG9yZXItY29udGFpbmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGhlbWUtYXBwLWJnKTtcbiAgY29sb3I6IHZhcigtLXRoZW1lLWFwcC1mZyk7XG4gIHNlbGVjdCB7XG4gICAgLyogdGhlIHZpeiBjb250cm9sIHNlbGVjdCBidXR0b25zICovXG4gICAgY29sb3I6IGJsYWNrO1xuICB9XG5cbiAgLlJlYWN0VGFibGUgLi1wYWdpbmF0aW9uIC4tYnRuIHtcbiAgICBjb2xvcjogdmFyKC0tdGhlbWUtYXBwLWZnKTtcbiAgfVxuXG4gIGRpdi5jb250cm9sLXdyYXBwZXIgPiBidXR0b24ge1xuICAgIGNvbG9yOiBibGFjaztcbiAgfVxuXG4gIC8qIE90aGVyd2lzZSBzb21lIGRhcmsgdGhlbWVzIG1ha2Ugc2VsZWN0ZWQgYnV0dG9uIHRleHQgaGFyZCB0byByZWFkICovXG4gIC5zZWxlY3RlZCB7XG4gICAgY29sb3I6IGJsYWNrO1xuICB9XG5cbn1cblxuYDtcblxuZnVuY3Rpb24gRGF0YUV4cGxvcmVyQ3VzdG9tKHsgZGF0YSB9KSB7XG4gIGNvbnN0IFt0aGVtZSwgc2V0VGhlbWVdID0gdXNlU3RhdGUoYXRvbS5jb25maWcuZ2V0KFwiZGF0YS1leHBsb3Jlci50aGVtZVwiKSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBkaXNwb3NlciA9IGF0b20uY29uZmlnLm9ic2VydmUoXCJkYXRhLWV4cGxvcmVyLnRoZW1lXCIsIG5ld1ZhbHVlID0+IHtcbiAgICAgIHNldFRoZW1lKG5ld1ZhbHVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkaXNwb3Nlci5kaXNwb3NlKCk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KFwiZGF0YS1leHBsb3Jlci50aGVtZVwiLCB0aGVtZSk7XG4gIH0sIFt0aGVtZV0pO1xuXG4gIGNvbnN0IG90aGVyVGhlbWUgPSB0aGVtZSA9PT0gXCJsaWdodFwiID8gXCJkYXJrXCIgOiBcImxpZ2h0XCI7XG4gIHJldHVybiAoXG4gICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAgPEdsb2JhbFRoZW1lVmFyaWFibGVzIHRoZW1lPXt0aGVtZX0gLz5cbiAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJpbnB1dC1sYWJlbFwiIHN0eWxlPXt7IG1hcmdpbkxlZnQ6IFwiMTBweFwiIH19PlxuICAgICAgICBEYXJrIG1vZGVcbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiaW5wdXQtdG9nZ2xlXCJcbiAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgIGNoZWNrZWQ9e3RoZW1lID09PSBcImRhcmtcIn1cbiAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdUaGVtZSA9IGUudGFyZ2V0LmNoZWNrZWQgPyBcImRhcmtcIiA6IFwibGlnaHRcIjtcbiAgICAgICAgICAgIHNldFRoZW1lKG5ld1RoZW1lKTtcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7IG1hcmdpbjogXCIxMHB4XCIgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvbGFiZWw+XG4gICAgICA8RGF0YUV4cGxvcmVyIGRhdGE9e2RhdGF9IHRoZW1lPXt0aGVtZX0+XG4gICAgICAgIDxUb29sYmFyIC8+XG4gICAgICAgIDxWaXogLz5cbiAgICAgIDwvRGF0YUV4cGxvcmVyPlxuICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERhdGFFeHBsb3JlclZpZXcge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgc3Vic2NyaXB0aW9uczogYXRvbSRDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKGRhdGE6IERhdGFSZXNvdXJjZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImRhdGEtZXhwbG9yZXItY29udGFpbmVyXCIpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibmF0aXZlLWtleS1iaW5kaW5nc1wiKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUodGhpcy5lbGVtZW50KTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMucmVuZGVyKGRhdGEpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuIFwiRGF0YSBFeHBsb3JlclwiO1xuICB9XG5cbiAgZ2V0RGVmYXVsdExvY2F0aW9uKCkge1xuICAgIHJldHVybiBcInJpZ2h0XCI7XG4gIH1cblxuICBnZXRBbGxvd2VkTG9jYXRpb25zKCkge1xuICAgIHJldHVybiBbXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJib3R0b21cIl07XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIERBVEFfRVhQTE9SRVJfVVJJO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvclVSSSh0aGlzLmdldFVSSSgpKTtcbiAgICBpZiAoIWNvbnRhaW5lciB8fCAhY29udGFpbmVyLnNob3cpIHJldHVybjtcblxuICAgIGNvbnRhaW5lci5zaG93KCk7XG4gIH1cblxuICByZW5kZXIoZGF0YTogRGF0YVJlc291cmNlIHwgbnVsbCkge1xuICAgIGlmICghZGF0YSkgcmV0dXJuO1xuICAgIFJlYWN0RE9NLnJlbmRlcig8RGF0YUV4cGxvcmVyQ3VzdG9tIGRhdGE9e2RhdGF9IC8+LCB0aGlzLmVsZW1lbnQpO1xuICB9XG59XG4iXX0=