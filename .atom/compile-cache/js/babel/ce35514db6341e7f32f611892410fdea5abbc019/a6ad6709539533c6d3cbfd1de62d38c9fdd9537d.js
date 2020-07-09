Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var _kernelMiddleware = require("./kernel-middleware");

var _common = require("./common");

var _dataExplorerView = require("./data-explorer-view");

var _dataExplorerView2 = _interopRequireDefault(_dataExplorerView);

/**
 *
 *
 * @date 2018-08-21
 * @class HydrogenDataExplorer
 * Used to create a single atom package instance exported in main
 * only use once, but flow can type classes like this easier than plain objects
 * and also we can create fake instances within specs
 */

var HydrogenDataExplorer = (function () {
  function HydrogenDataExplorer() {
    _classCallCheck(this, HydrogenDataExplorer);

    this.subscriptions = new _atom.CompositeDisposable();
    this.hydrogen = null;
    this.middlewareMap = new WeakMap();
    this.config = {
      theme: {
        title: "Data Explorer theme",
        description: "Light or dark, it's up to you",
        type: "string",
        "default": "dark",
        "enum": [{ value: "dark", description: "Dark" }, { value: "light", description: "Light" }]
      }
    };
  }

  _createClass(HydrogenDataExplorer, [{
    key: "activate",
    value: function activate() {
      var _this = this;

      var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.subscriptions.add(atom.workspace.addOpener(function (uri) {
        if (uri !== _common.DATA_EXPLORER_URI) return;
        var data = _this.activeMiddleware ? _this.activeMiddleware.data : null;
        if (!data) return;
        return new _dataExplorerView2["default"](data);
      }));

      this.subscriptions.add(atom.workspace.observeActivePaneItem(function (item) {
        if (item instanceof _dataExplorerView2["default"]) {
          var data = _this.activeMiddleware ? _this.activeMiddleware.data : null;
          item.render(data);
        }
      }));
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      atom.workspace.getPaneItems().forEach(function (paneItem) {
        if (paneItem instanceof _dataExplorerView2["default"]) paneItem.destroy();
      });
      this.subscriptions.dispose();
    }
  }, {
    key: "consumeHydrogen",
    value: function consumeHydrogen(hydrogen) {
      var _this2 = this;

      this.hydrogen = hydrogen;

      this.hydrogen.onDidChangeKernel(function (kernel) {
        if (!kernel || _this2.middlewareMap.has(kernel)) return;

        // This is a workaround, see the todo comment in this.activeKernel
        _this2.activeKernel = kernel;

        _this2.attachMiddleware(kernel);
      });

      return new _atom.Disposable(function () {
        _this2.hydrogen = null;
      });
    }
  }, {
    key: "attachMiddleware",
    value: function attachMiddleware(kernel) {
      var _this3 = this;

      var middleware = new _kernelMiddleware.Middleware();

      kernel.addMiddleware(middleware);
      this.middlewareMap.set(kernel, middleware);

      kernel.onDidDestroy(function () {
        _this3.middlewareMap["delete"](kernel);
      });
    }

    // TODO: Fix this in hydrogen so it doesnt throw if no kernel??
    // get activeKernel(): ?HydrogenKernel {
    //   // if (!this.hydrogen) return;
    //   // return this.hydrogen.getActiveKernel();
    // }

  }, {
    key: "activeMiddleware",
    get: function get() {
      var kernel = this.activeKernel;
      if (!kernel) return;
      return this.middlewareMap.get(kernel);
    }
  }]);

  return HydrogenDataExplorer;
})();

exports["default"] = HydrogenDataExplorer;
module.exports = exports["default"];

// This will be the most recent relevant kernel seen (see todos)
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2RhdGEtZXhwbG9yZXIvbGliL2h5ZHJvZ2VuLWRhdGEtZXhwbG9yZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFZ0QsTUFBTTs7Z0NBRTNCLHFCQUFxQjs7c0JBQ2QsVUFBVTs7Z0NBQ2Ysc0JBQXNCOzs7Ozs7Ozs7Ozs7OztJQVc5QixvQkFBb0I7V0FBcEIsb0JBQW9COzBCQUFwQixvQkFBb0I7O1NBQ3ZDLGFBQWEsR0FBNkIsK0JBQXlCO1NBQ25FLFFBQVEsR0FBYyxJQUFJO1NBQzFCLGFBQWEsR0FBd0MsSUFBSSxPQUFPLEVBQUU7U0FJbEUsTUFBTSxHQUFXO0FBQ2YsV0FBSyxFQUFFO0FBQ0wsYUFBSyxFQUFFLHFCQUFxQjtBQUM1QixtQkFBVyxFQUFFLCtCQUErQjtBQUM1QyxZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLE1BQU07QUFDZixnQkFBTSxDQUNKLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEVBQ3RDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLENBQ3pDO09BQ0Y7S0FDRjs7O2VBbEJrQixvQkFBb0I7O1dBb0IvQixvQkFBMkI7OztVQUExQixLQUFhLHlEQUFHLEVBQUU7O0FBQ3pCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUM5QixZQUFJLEdBQUcsOEJBQXNCLEVBQUUsT0FBTztBQUN0QyxZQUFNLElBQUksR0FBRyxNQUFLLGdCQUFnQixHQUFHLE1BQUssZ0JBQWdCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN2RSxZQUFJLENBQUMsSUFBSSxFQUFFLE9BQU87QUFDbEIsZUFBTyxrQ0FBcUIsSUFBSSxDQUFDLENBQUM7T0FDbkMsQ0FBQyxDQUNILENBQUM7O0FBRUYsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDM0MsWUFBSSxJQUFJLHlDQUE0QixFQUFFO0FBQ3BDLGNBQU0sSUFBSSxHQUFHLE1BQUssZ0JBQWdCLEdBQzlCLE1BQUssZ0JBQWdCLENBQUMsSUFBSSxHQUMxQixJQUFJLENBQUM7QUFDVCxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25CO09BQ0YsQ0FBQyxDQUNILENBQUM7S0FDSDs7O1dBRVMsc0JBQUc7QUFDWCxVQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUNoRCxZQUFJLFFBQVEseUNBQTRCLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQzlELENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDOUI7OztXQUVjLHlCQUFDLFFBQWtCLEVBQUU7OztBQUNsQyxVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN4QyxZQUFJLENBQUMsTUFBTSxJQUFJLE9BQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPOzs7QUFHdEQsZUFBSyxZQUFZLEdBQUcsTUFBTSxDQUFDOztBQUUzQixlQUFLLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQy9CLENBQUMsQ0FBQzs7QUFFSCxhQUFPLHFCQUFlLFlBQU07QUFDMUIsZUFBSyxRQUFRLEdBQUcsSUFBSSxDQUFDO09BQ3RCLENBQUMsQ0FBQztLQUNKOzs7V0FFZSwwQkFBQyxNQUFzQixFQUFFOzs7QUFDdkMsVUFBTSxVQUFVLEdBQUcsa0NBQWdCLENBQUM7O0FBRXBDLFlBQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDOztBQUUzQyxZQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDeEIsZUFBSyxhQUFhLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNuQyxDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7OztTQVFtQixlQUFnQjtBQUNsQyxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTztBQUNwQixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3ZDOzs7U0F2RmtCLG9CQUFvQjs7O3FCQUFwQixvQkFBb0IiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZGF0YS1leHBsb3Jlci9saWIvaHlkcm9nZW4tZGF0YS1leHBsb3Jlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgeyBNaWRkbGV3YXJlIH0gZnJvbSBcIi4va2VybmVsLW1pZGRsZXdhcmVcIjtcbmltcG9ydCB7IERBVEFfRVhQTE9SRVJfVVJJIH0gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQgRGF0YUV4cGxvcmVyVmlldyBmcm9tIFwiLi9kYXRhLWV4cGxvcmVyLXZpZXdcIjtcblxuLyoqXG4gKlxuICpcbiAqIEBkYXRlIDIwMTgtMDgtMjFcbiAqIEBjbGFzcyBIeWRyb2dlbkRhdGFFeHBsb3JlclxuICogVXNlZCB0byBjcmVhdGUgYSBzaW5nbGUgYXRvbSBwYWNrYWdlIGluc3RhbmNlIGV4cG9ydGVkIGluIG1haW5cbiAqIG9ubHkgdXNlIG9uY2UsIGJ1dCBmbG93IGNhbiB0eXBlIGNsYXNzZXMgbGlrZSB0aGlzIGVhc2llciB0aGFuIHBsYWluIG9iamVjdHNcbiAqIGFuZCBhbHNvIHdlIGNhbiBjcmVhdGUgZmFrZSBpbnN0YW5jZXMgd2l0aGluIHNwZWNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh5ZHJvZ2VuRGF0YUV4cGxvcmVyIHtcbiAgc3Vic2NyaXB0aW9uczogYXRvbSRDb21wb3NpdGVEaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgaHlkcm9nZW46ID9IeWRyb2dlbiA9IG51bGw7XG4gIG1pZGRsZXdhcmVNYXA6IFdlYWtNYXA8SHlkcm9nZW5LZXJuZWwsIE1pZGRsZXdhcmU+ID0gbmV3IFdlYWtNYXAoKTtcbiAgLy8gVGhpcyB3aWxsIGJlIHRoZSBtb3N0IHJlY2VudCByZWxldmFudCBrZXJuZWwgc2VlbiAoc2VlIHRvZG9zKVxuICBhY3RpdmVLZXJuZWw6ID9IeWRyb2dlbktlcm5lbDtcblxuICBjb25maWc6IE9iamVjdCA9IHtcbiAgICB0aGVtZToge1xuICAgICAgdGl0bGU6IFwiRGF0YSBFeHBsb3JlciB0aGVtZVwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiTGlnaHQgb3IgZGFyaywgaXQncyB1cCB0byB5b3VcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcImRhcmtcIixcbiAgICAgIGVudW06IFtcbiAgICAgICAgeyB2YWx1ZTogXCJkYXJrXCIsIGRlc2NyaXB0aW9uOiBcIkRhcmtcIiB9LFxuICAgICAgICB7IHZhbHVlOiBcImxpZ2h0XCIsIGRlc2NyaXB0aW9uOiBcIkxpZ2h0XCIgfVxuICAgICAgXVxuICAgIH1cbiAgfTtcblxuICBhY3RpdmF0ZShzdGF0ZTogT2JqZWN0ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKHVyaSA9PiB7XG4gICAgICAgIGlmICh1cmkgIT09IERBVEFfRVhQTE9SRVJfVVJJKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmFjdGl2ZU1pZGRsZXdhcmUgPyB0aGlzLmFjdGl2ZU1pZGRsZXdhcmUuZGF0YSA6IG51bGw7XG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuO1xuICAgICAgICByZXR1cm4gbmV3IERhdGFFeHBsb3JlclZpZXcoZGF0YSk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoaXRlbSBpbnN0YW5jZW9mIERhdGFFeHBsb3JlclZpZXcpIHtcbiAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5hY3RpdmVNaWRkbGV3YXJlXG4gICAgICAgICAgICA/IHRoaXMuYWN0aXZlTWlkZGxld2FyZS5kYXRhXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgaXRlbS5yZW5kZXIoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkuZm9yRWFjaChwYW5lSXRlbSA9PiB7XG4gICAgICBpZiAocGFuZUl0ZW0gaW5zdGFuY2VvZiBEYXRhRXhwbG9yZXJWaWV3KSBwYW5lSXRlbS5kZXN0cm95KCk7XG4gICAgfSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGNvbnN1bWVIeWRyb2dlbihoeWRyb2dlbjogSHlkcm9nZW4pIHtcbiAgICB0aGlzLmh5ZHJvZ2VuID0gaHlkcm9nZW47XG5cbiAgICB0aGlzLmh5ZHJvZ2VuLm9uRGlkQ2hhbmdlS2VybmVsKGtlcm5lbCA9PiB7XG4gICAgICBpZiAoIWtlcm5lbCB8fCB0aGlzLm1pZGRsZXdhcmVNYXAuaGFzKGtlcm5lbCkpIHJldHVybjtcblxuICAgICAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQsIHNlZSB0aGUgdG9kbyBjb21tZW50IGluIHRoaXMuYWN0aXZlS2VybmVsXG4gICAgICB0aGlzLmFjdGl2ZUtlcm5lbCA9IGtlcm5lbDtcblxuICAgICAgdGhpcy5hdHRhY2hNaWRkbGV3YXJlKGtlcm5lbCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgdGhpcy5oeWRyb2dlbiA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBhdHRhY2hNaWRkbGV3YXJlKGtlcm5lbDogSHlkcm9nZW5LZXJuZWwpIHtcbiAgICBjb25zdCBtaWRkbGV3YXJlID0gbmV3IE1pZGRsZXdhcmUoKTtcblxuICAgIGtlcm5lbC5hZGRNaWRkbGV3YXJlKG1pZGRsZXdhcmUpO1xuICAgIHRoaXMubWlkZGxld2FyZU1hcC5zZXQoa2VybmVsLCBtaWRkbGV3YXJlKTtcblxuICAgIGtlcm5lbC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5taWRkbGV3YXJlTWFwLmRlbGV0ZShrZXJuZWwpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETzogRml4IHRoaXMgaW4gaHlkcm9nZW4gc28gaXQgZG9lc250IHRocm93IGlmIG5vIGtlcm5lbD8/XG4gIC8vIGdldCBhY3RpdmVLZXJuZWwoKTogP0h5ZHJvZ2VuS2VybmVsIHtcbiAgLy8gICAvLyBpZiAoIXRoaXMuaHlkcm9nZW4pIHJldHVybjtcbiAgLy8gICAvLyByZXR1cm4gdGhpcy5oeWRyb2dlbi5nZXRBY3RpdmVLZXJuZWwoKTtcbiAgLy8gfVxuXG4gIGdldCBhY3RpdmVNaWRkbGV3YXJlKCk6ID9NaWRkbGV3YXJlIHtcbiAgICBjb25zdCBrZXJuZWwgPSB0aGlzLmFjdGl2ZUtlcm5lbDtcbiAgICBpZiAoIWtlcm5lbCkgcmV0dXJuO1xuICAgIHJldHVybiB0aGlzLm1pZGRsZXdhcmVNYXAuZ2V0KGtlcm5lbCk7XG4gIH1cbn1cbiJdfQ==