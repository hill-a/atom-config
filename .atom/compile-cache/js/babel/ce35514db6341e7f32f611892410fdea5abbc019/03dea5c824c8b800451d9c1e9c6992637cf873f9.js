Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === "function") { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError("The decorator for method " + descriptor.key + " is of the invalid type " + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

var _mobx = require("mobx");

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _atom = require("atom");

var _watch = require("./watch");

var _watch2 = _interopRequireDefault(_watch);

var _servicesConsumedAutocomplete = require("../services/consumed/autocomplete");

var _servicesConsumedAutocomplete2 = _interopRequireDefault(_servicesConsumedAutocomplete);

var WatchesStore = (function () {
  var _instanceInitializers = {};
  var _instanceInitializers = {};

  _createDecoratedClass(WatchesStore, [{
    key: "watches",
    decorators: [_mobx.observable],
    initializer: function initializer() {
      return [];
    },
    enumerable: true
  }], null, _instanceInitializers);

  function WatchesStore(kernel) {
    _classCallCheck(this, WatchesStore);

    _defineDecoratedPropertyDescriptor(this, "watches", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "createWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "addWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "addWatchFromEditor", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "removeWatch", _instanceInitializers);

    _defineDecoratedPropertyDescriptor(this, "run", _instanceInitializers);

    this.kernel = kernel;

    this.kernel.addWatchCallback(this.run);
    if (_servicesConsumedAutocomplete2["default"].isEnabeled) {
      var disposable = new _atom.CompositeDisposable();
      this.autocompleteDisposables = disposable;
      _servicesConsumedAutocomplete2["default"].register(disposable);
    }
    this.addWatch();
  }

  _createDecoratedClass(WatchesStore, [{
    key: "destroy",
    value: function destroy() {
      if (_servicesConsumedAutocomplete2["default"].isEnabeled && this.autocompleteDisposables) _servicesConsumedAutocomplete2["default"].dispose(this.autocompleteDisposables);
    }
  }, {
    key: "createWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this = this;

      return function () {
        var lastWatch = _this.watches[_this.watches.length - 1];
        if (!lastWatch || lastWatch.getCode().trim() !== "") {
          var watch = new _watch2["default"](_this.kernel);
          _this.watches.push(watch);
          if (_servicesConsumedAutocomplete2["default"].isEnabeled) _servicesConsumedAutocomplete2["default"].addAutocompleteToWatch(_this, watch);
          return watch;
        }
        return lastWatch;
      };
    },
    enumerable: true
  }, {
    key: "addWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this2 = this;

      return function () {
        _this2.createWatch().focus();
      };
    },
    enumerable: true
  }, {
    key: "addWatchFromEditor",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this3 = this;

      return function (editor) {
        if (!editor) return;
        var watchText = editor.getSelectedText();
        if (!watchText) {
          _this3.addWatch();
        } else {
          var watch = _this3.createWatch();
          watch.setCode(watchText);
          watch.run();
        }
      };
    },
    enumerable: true
  }, {
    key: "removeWatch",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this4 = this;

      return function () {
        var watches = _this4.watches.map(function (v, k) {
          return {
            name: v.getCode(),
            value: k
          };
        }).filter(function (obj) {
          return obj.value !== 0 || obj.name !== "";
        });

        var watchesPicker = new _atomSelectList2["default"]({
          items: watches,
          elementForItem: function elementForItem(watch) {
            var element = document.createElement("li");
            element.textContent = watch.name || "<empty>";
            return element;
          },
          didConfirmSelection: function didConfirmSelection(watch) {
            var selectedWatch = _this4.watches[watch.value];
            // This is for cleanup to improve performance
            if (_servicesConsumedAutocomplete2["default"].isEnabeled) _servicesConsumedAutocomplete2["default"].removeAutocompleteFromWatch(_this4, selectedWatch);
            _this4.watches.splice(watch.value, 1);
            modalPanel.destroy();
            watchesPicker.destroy();
            if (_this4.watches.length === 0) _this4.addWatch();else if (previouslyFocusedElement) previouslyFocusedElement.focus();
          },
          filterKeyForItem: function filterKeyForItem(watch) {
            return watch.name;
          },
          didCancelSelection: function didCancelSelection() {
            modalPanel.destroy();
            if (previouslyFocusedElement) previouslyFocusedElement.focus();
            watchesPicker.destroy();
          },
          emptyMessage: "There are no watches to remove!"
        });
        var previouslyFocusedElement = document.activeElement;
        var modalPanel = atom.workspace.addModalPanel({
          item: watchesPicker
        });
        watchesPicker.focus();
      };
    },
    enumerable: true
  }, {
    key: "run",
    decorators: [_mobx.action],
    initializer: function initializer() {
      var _this5 = this;

      return function () {
        _this5.watches.forEach(function (watch) {
          return watch.run();
        });
      };
    },
    enumerable: true
  }], null, _instanceInitializers);

  return WatchesStore;
})();

exports["default"] = WatchesStore;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zdG9yZS93YXRjaGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFFbUMsTUFBTTs7OEJBQ2Qsa0JBQWtCOzs7O29CQUNULE1BQU07O3FCQUVuQixTQUFTOzs7OzRDQUNDLG1DQUFtQzs7OztJQUsvQyxZQUFZOzs7O3dCQUFaLFlBQVk7Ozs7YUFHRixFQUFFOzs7OztBQUdwQixXQU5RLFlBQVksQ0FNbkIsTUFBYyxFQUFFOzBCQU5ULFlBQVk7Ozs7Ozs7Ozs7Ozs7O0FBTzdCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixRQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2QyxRQUFJLDBDQUFxQixVQUFVLEVBQUU7QUFDbkMsVUFBTSxVQUFVLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsVUFBSSxDQUFDLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztBQUMxQyxnREFBcUIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQzNDO0FBQ0QsUUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ2pCOzt3QkFoQmtCLFlBQVk7O1dBZ0d4QixtQkFBRztBQUNSLFVBQUksMENBQXFCLFVBQVUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQ2pFLDBDQUFxQixPQUFPLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDOUQ7Ozs7Ozs7YUFoRmEsWUFBTTtBQUNsQixZQUFNLFNBQVMsR0FBRyxNQUFLLE9BQU8sQ0FBQyxNQUFLLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsWUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ25ELGNBQU0sS0FBSyxHQUFHLHVCQUFlLE1BQUss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Q0FBQztBQUNILHFCQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7T0FDdkI7Ozs7Ozs7OzthQUdLLFlBQU07QUFDVixlQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO2lCQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7U0FBQSxDQUFDLENBQUM7T0FDNUM7Ozs7O1NBOUZrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvc3RvcmUvd2F0Y2hlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGFjdGlvbiwgb2JzZXJ2YWJsZSB9IGZyb20gXCJtb2J4XCI7XG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSBcImF0b20tc2VsZWN0LWxpc3RcIjtcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgV2F0Y2hTdG9yZSBmcm9tIFwiLi93YXRjaFwiO1xuaW1wb3J0IEF1dG9jb21wbGV0ZUNvbnN1bWVyIGZyb20gXCIuLi9zZXJ2aWNlcy9jb25zdW1lZC9hdXRvY29tcGxldGVcIjtcblxuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuLy4uL2tlcm5lbFwiO1xuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYXRjaGVzU3RvcmUge1xuICBrZXJuZWw6IEtlcm5lbDtcbiAgQG9ic2VydmFibGVcbiAgd2F0Y2hlczogQXJyYXk8V2F0Y2hTdG9yZT4gPSBbXTtcbiAgYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXM6ID9hdG9tJENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3Ioa2VybmVsOiBLZXJuZWwpIHtcbiAgICB0aGlzLmtlcm5lbCA9IGtlcm5lbDtcblxuICAgIHRoaXMua2VybmVsLmFkZFdhdGNoQ2FsbGJhY2sodGhpcy5ydW4pO1xuICAgIGlmIChBdXRvY29tcGxldGVDb25zdW1lci5pc0VuYWJlbGVkKSB7XG4gICAgICBjb25zdCBkaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMgPSBkaXNwb3NhYmxlO1xuICAgICAgQXV0b2NvbXBsZXRlQ29uc3VtZXIucmVnaXN0ZXIoZGlzcG9zYWJsZSk7XG4gICAgfVxuICAgIHRoaXMuYWRkV2F0Y2goKTtcbiAgfVxuXG4gIEBhY3Rpb25cbiAgY3JlYXRlV2F0Y2ggPSAoKSA9PiB7XG4gICAgY29uc3QgbGFzdFdhdGNoID0gdGhpcy53YXRjaGVzW3RoaXMud2F0Y2hlcy5sZW5ndGggLSAxXTtcbiAgICBpZiAoIWxhc3RXYXRjaCB8fCBsYXN0V2F0Y2guZ2V0Q29kZSgpLnRyaW0oKSAhPT0gXCJcIikge1xuICAgICAgY29uc3Qgd2F0Y2ggPSBuZXcgV2F0Y2hTdG9yZSh0aGlzLmtlcm5lbCk7XG4gICAgICB0aGlzLndhdGNoZXMucHVzaCh3YXRjaCk7XG4gICAgICBpZiAoQXV0b2NvbXBsZXRlQ29uc3VtZXIuaXNFbmFiZWxlZClcbiAgICAgICAgQXV0b2NvbXBsZXRlQ29uc3VtZXIuYWRkQXV0b2NvbXBsZXRlVG9XYXRjaCh0aGlzLCB3YXRjaCk7XG4gICAgICByZXR1cm4gd2F0Y2g7XG4gICAgfVxuICAgIHJldHVybiBsYXN0V2F0Y2g7XG4gIH07XG5cbiAgQGFjdGlvblxuICBhZGRXYXRjaCA9ICgpID0+IHtcbiAgICB0aGlzLmNyZWF0ZVdhdGNoKCkuZm9jdXMoKTtcbiAgfTtcblxuICBAYWN0aW9uXG4gIGFkZFdhdGNoRnJvbUVkaXRvciA9IChlZGl0b3I6IGF0b20kVGV4dEVkaXRvcikgPT4ge1xuICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgY29uc3Qgd2F0Y2hUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpO1xuICAgIGlmICghd2F0Y2hUZXh0KSB7XG4gICAgICB0aGlzLmFkZFdhdGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHdhdGNoID0gdGhpcy5jcmVhdGVXYXRjaCgpO1xuICAgICAgd2F0Y2guc2V0Q29kZSh3YXRjaFRleHQpO1xuICAgICAgd2F0Y2gucnVuKCk7XG4gICAgfVxuICB9O1xuXG4gIEBhY3Rpb25cbiAgcmVtb3ZlV2F0Y2ggPSAoKSA9PiB7XG4gICAgY29uc3Qgd2F0Y2hlcyA9IHRoaXMud2F0Y2hlc1xuICAgICAgLm1hcCgodiwgaykgPT4gKHtcbiAgICAgICAgbmFtZTogdi5nZXRDb2RlKCksXG4gICAgICAgIHZhbHVlOiBrXG4gICAgICB9KSlcbiAgICAgIC5maWx0ZXIob2JqID0+IG9iai52YWx1ZSAhPT0gMCB8fCBvYmoubmFtZSAhPT0gXCJcIik7XG5cbiAgICBjb25zdCB3YXRjaGVzUGlja2VyID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zOiB3YXRjaGVzLFxuICAgICAgZWxlbWVudEZvckl0ZW06IHdhdGNoID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IHdhdGNoLm5hbWUgfHwgXCI8ZW1wdHk+XCI7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IHdhdGNoID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRXYXRjaCA9IHRoaXMud2F0Y2hlc1t3YXRjaC52YWx1ZV07XG4gICAgICAgIC8vIFRoaXMgaXMgZm9yIGNsZWFudXAgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgICAgICBpZiAoQXV0b2NvbXBsZXRlQ29uc3VtZXIuaXNFbmFiZWxlZClcbiAgICAgICAgICBBdXRvY29tcGxldGVDb25zdW1lci5yZW1vdmVBdXRvY29tcGxldGVGcm9tV2F0Y2godGhpcywgc2VsZWN0ZWRXYXRjaCk7XG4gICAgICAgIHRoaXMud2F0Y2hlcy5zcGxpY2Uod2F0Y2gudmFsdWUsIDEpO1xuICAgICAgICBtb2RhbFBhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgd2F0Y2hlc1BpY2tlci5kZXN0cm95KCk7XG4gICAgICAgIGlmICh0aGlzLndhdGNoZXMubGVuZ3RoID09PSAwKSB0aGlzLmFkZFdhdGNoKCk7XG4gICAgICAgIGVsc2UgaWYgKHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9LFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogd2F0Y2ggPT4gd2F0Y2gubmFtZSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4ge1xuICAgICAgICBtb2RhbFBhbmVsLmRlc3Ryb3koKTtcbiAgICAgICAgaWYgKHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgIHdhdGNoZXNQaWNrZXIuZGVzdHJveSgpO1xuICAgICAgfSxcbiAgICAgIGVtcHR5TWVzc2FnZTogXCJUaGVyZSBhcmUgbm8gd2F0Y2hlcyB0byByZW1vdmUhXCJcbiAgICB9KTtcbiAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGNvbnN0IG1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcbiAgICAgIGl0ZW06IHdhdGNoZXNQaWNrZXJcbiAgICB9KTtcbiAgICB3YXRjaGVzUGlja2VyLmZvY3VzKCk7XG4gIH07XG5cbiAgQGFjdGlvblxuICBydW4gPSAoKSA9PiB7XG4gICAgdGhpcy53YXRjaGVzLmZvckVhY2god2F0Y2ggPT4gd2F0Y2gucnVuKCkpO1xuICB9O1xuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKEF1dG9jb21wbGV0ZUNvbnN1bWVyLmlzRW5hYmVsZWQgJiYgdGhpcy5hdXRvY29tcGxldGVEaXNwb3NhYmxlcylcbiAgICAgIEF1dG9jb21wbGV0ZUNvbnN1bWVyLmRpc3Bvc2UodGhpcy5hdXRvY29tcGxldGVEaXNwb3NhYmxlcyk7XG4gIH1cbn1cbiJdfQ==