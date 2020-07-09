Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _utils = require("./../utils");

var _componentsOutputArea = require("./../components/output-area");

var _componentsOutputArea2 = _interopRequireDefault(_componentsOutputArea);

var OutputPane = (function () {
  function OutputPane(store) {
    _classCallCheck(this, OutputPane);

    this.element = document.createElement("div");
    this.disposer = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return "Hydrogen Output Area";
    };

    this.getURI = function () {
      return _utils.OUTPUT_AREA_URI;
    };

    this.getDefaultLocation = function () {
      return "right";
    };

    this.getAllowedLocations = function () {
      return ["left", "right", "bottom"];
    };

    this.element.classList.add("hydrogen");

    this.disposer.add(new _atom.Disposable(function () {
      if (store.kernel) store.kernel.outputStore.clear();
    }));

    this.disposer.add(atom.commands.add(this.element, {
      "core:move-left": function coreMoveLeft() {
        if (!store.kernel) return;
        store.kernel.outputStore.decrementIndex();
      },
      "core:move-right": function coreMoveRight() {
        if (!store.kernel) return;
        store.kernel.outputStore.incrementIndex();
      }
    }));

    (0, _utils.reactFactory)(_react2["default"].createElement(_componentsOutputArea2["default"], { store: store }), this.element, null, this.disposer);
  }

  _createClass(OutputPane, [{
    key: "destroy",
    value: function destroy() {
      this.disposer.dispose();

      // When a user manually clicks the close icon, the pane holding the OutputArea
      // is destroyed along with the OutputArea item. We mimic this here so that we can call
      //  outputArea.destroy() and fully clean up the OutputArea without user clicking
      var pane = atom.workspace.paneForURI(_utils.OUTPUT_AREA_URI);
      if (!pane) return;
      pane.destroyItem(this);
    }
  }]);

  return OutputPane;
})();

exports["default"] = OutputPane;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9wYW5lcy9vdXRwdXQtYXJlYS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVnRCxNQUFNOztxQkFFcEMsT0FBTzs7OztxQkFFcUIsWUFBWTs7b0NBRW5DLDZCQUE2Qjs7OztJQUUvQixVQUFVO0FBSWxCLFdBSlEsVUFBVSxDQUlqQixLQUFZLEVBQUU7MEJBSlAsVUFBVTs7U0FDN0IsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1NBQ3ZDLFFBQVEsR0FBRywrQkFBeUI7O1NBZ0NwQyxRQUFRLEdBQUc7YUFBTSxzQkFBc0I7S0FBQTs7U0FFdkMsTUFBTSxHQUFHOztLQUFxQjs7U0FFOUIsa0JBQWtCLEdBQUc7YUFBTSxPQUFPO0tBQUE7O1NBRWxDLG1CQUFtQixHQUFHO2FBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztLQUFBOztBQW5DckQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUV2QyxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDZixxQkFBZSxZQUFNO0FBQ25CLFVBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNwRCxDQUFDLENBQ0gsQ0FBQzs7QUFFRixRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FDZixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLHNCQUFnQixFQUFFLHdCQUFNO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDMUIsYUFBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDM0M7QUFDRCx1QkFBaUIsRUFBRSx5QkFBTTtBQUN2QixZQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPO0FBQzFCLGFBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxDQUFDO09BQzNDO0tBQ0YsQ0FBQyxDQUNILENBQUM7O0FBRUYsNkJBQ0Usc0VBQVksS0FBSyxFQUFFLEtBQUssQUFBQyxHQUFHLEVBQzVCLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxFQUNKLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztHQUNIOztlQWhDa0IsVUFBVTs7V0EwQ3RCLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7Ozs7QUFLeEIsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLHdCQUFpQixDQUFDO0FBQ3hELFVBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTztBQUNsQixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hCOzs7U0FuRGtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9wYW5lcy9vdXRwdXQtYXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5cbmltcG9ydCB7IHJlYWN0RmFjdG9yeSwgT1VUUFVUX0FSRUFfVVJJIH0gZnJvbSBcIi4vLi4vdXRpbHNcIjtcbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4uL3N0b3JlXCI7XG5pbXBvcnQgT3V0cHV0QXJlYSBmcm9tIFwiLi8uLi9jb21wb25lbnRzL291dHB1dC1hcmVhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dHB1dFBhbmUge1xuICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGlzcG9zZXIgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKHN0b3JlOiBzdG9yZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaHlkcm9nZW5cIik7XG5cbiAgICB0aGlzLmRpc3Bvc2VyLmFkZChcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgaWYgKHN0b3JlLmtlcm5lbCkgc3RvcmUua2VybmVsLm91dHB1dFN0b3JlLmNsZWFyKCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLmRpc3Bvc2VyLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKHRoaXMuZWxlbWVudCwge1xuICAgICAgICBcImNvcmU6bW92ZS1sZWZ0XCI6ICgpID0+IHtcbiAgICAgICAgICBpZiAoIXN0b3JlLmtlcm5lbCkgcmV0dXJuO1xuICAgICAgICAgIHN0b3JlLmtlcm5lbC5vdXRwdXRTdG9yZS5kZWNyZW1lbnRJbmRleCgpO1xuICAgICAgICB9LFxuICAgICAgICBcImNvcmU6bW92ZS1yaWdodFwiOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKCFzdG9yZS5rZXJuZWwpIHJldHVybjtcbiAgICAgICAgICBzdG9yZS5rZXJuZWwub3V0cHV0U3RvcmUuaW5jcmVtZW50SW5kZXgoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmVhY3RGYWN0b3J5KFxuICAgICAgPE91dHB1dEFyZWEgc3RvcmU9e3N0b3JlfSAvPixcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLmRpc3Bvc2VyXG4gICAgKTtcbiAgfVxuXG4gIGdldFRpdGxlID0gKCkgPT4gXCJIeWRyb2dlbiBPdXRwdXQgQXJlYVwiO1xuXG4gIGdldFVSSSA9ICgpID0+IE9VVFBVVF9BUkVBX1VSSTtcblxuICBnZXREZWZhdWx0TG9jYXRpb24gPSAoKSA9PiBcInJpZ2h0XCI7XG5cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucyA9ICgpID0+IFtcImxlZnRcIiwgXCJyaWdodFwiLCBcImJvdHRvbVwiXTtcblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlzcG9zZXIuZGlzcG9zZSgpO1xuXG4gICAgLy8gV2hlbiBhIHVzZXIgbWFudWFsbHkgY2xpY2tzIHRoZSBjbG9zZSBpY29uLCB0aGUgcGFuZSBob2xkaW5nIHRoZSBPdXRwdXRBcmVhXG4gICAgLy8gaXMgZGVzdHJveWVkIGFsb25nIHdpdGggdGhlIE91dHB1dEFyZWEgaXRlbS4gV2UgbWltaWMgdGhpcyBoZXJlIHNvIHRoYXQgd2UgY2FuIGNhbGxcbiAgICAvLyAgb3V0cHV0QXJlYS5kZXN0cm95KCkgYW5kIGZ1bGx5IGNsZWFuIHVwIHRoZSBPdXRwdXRBcmVhIHdpdGhvdXQgdXNlciBjbGlja2luZ1xuICAgIGNvbnN0IHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKE9VVFBVVF9BUkVBX1VSSSk7XG4gICAgaWYgKCFwYW5lKSByZXR1cm47XG4gICAgcGFuZS5kZXN0cm95SXRlbSh0aGlzKTtcbiAgfVxufVxuIl19