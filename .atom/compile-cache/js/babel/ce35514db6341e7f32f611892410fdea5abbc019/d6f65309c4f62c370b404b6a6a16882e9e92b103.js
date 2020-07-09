Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _utils = require("./utils");

function getName(kernel) {
  var prefix = kernel.transport.gatewayName ? kernel.transport.gatewayName + ": " : "";
  return prefix + kernel.displayName + " - " + _store2["default"].getFilesForKernel(kernel).map(_tildify2["default"]).join(", ");
}

var ExistingKernelPicker = (function () {
  function ExistingKernelPicker() {
    var _this = this;

    _classCallCheck(this, ExistingKernelPicker);

    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(kernel) {
        return getName(kernel);
      },
      elementForItem: function elementForItem(kernel) {
        var element = document.createElement("li");
        element.textContent = getName(kernel);
        return element;
      },
      didConfirmSelection: function didConfirmSelection(kernel) {
        var filePath = _store2["default"].filePath;
        var editor = _store2["default"].editor;
        var grammar = _store2["default"].grammar;

        if (!filePath || !editor || !grammar) return _this.cancel();
        _store2["default"].newKernel(kernel, filePath, editor, grammar);
        _this.cancel();
      },
      didCancelSelection: function didCancelSelection() {
        return _this.cancel();
      },
      emptyMessage: "No running kernels for this language."
    });
  }

  _createClass(ExistingKernelPicker, [{
    key: "destroy",
    value: function destroy() {
      this.cancel();
      return this.selectListView.destroy();
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.panel != null) {
        this.panel.destroy();
      }
      this.panel = null;
      if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    }
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      this.selectListView.focus();
      this.selectListView.reset();
    }
  }, {
    key: "toggle",
    value: _asyncToGenerator(function* () {
      if (this.panel != null) {
        this.cancel();
      } else if (_store2["default"].filePath && _store2["default"].grammar) {
        yield this.selectListView.update({
          items: _store2["default"].runningKernels.filter(function (kernel) {
            return (0, _utils.kernelSpecProvidesGrammar)(kernel.kernelSpec, _store2["default"].grammar);
          })
        });
        var markers = _store2["default"].markers;
        if (markers) markers.clear();
        this.attach();
      }
    })
  }]);

  return ExistingKernelPicker;
})();

exports["default"] = ExistingKernelPicker;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9leGlzdGluZy1rZXJuZWwtcGlja2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs4QkFFMkIsa0JBQWtCOzs7O3FCQUMzQixTQUFTOzs7O3NCQUNiLFFBQVE7Ozs7dUJBQ0YsU0FBUzs7OztxQkFFYSxTQUFTOztBQUluRCxTQUFTLE9BQU8sQ0FBQyxNQUFjLEVBQUU7QUFDL0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQ3BDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxVQUMvQixFQUFFLENBQUM7QUFDUCxTQUNFLE1BQU0sR0FDTixNQUFNLENBQUMsV0FBVyxHQUNsQixLQUFLLEdBQ0wsbUJBQ0csaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQ3pCLEdBQUcsc0JBQVMsQ0FDWixJQUFJLENBQUMsSUFBSSxDQUFDLENBQ2I7Q0FDSDs7SUFFb0Isb0JBQW9CO0FBSzVCLFdBTFEsb0JBQW9CLEdBS3pCOzs7MEJBTEssb0JBQW9COztBQU1yQyxRQUFJLENBQUMsY0FBYyxHQUFHLGdDQUFtQjtBQUN2QyxvQkFBYyxFQUFFLENBQUMsYUFBYSxDQUFDO0FBQy9CLFdBQUssRUFBRSxFQUFFO0FBQ1Qsc0JBQWdCLEVBQUUsMEJBQUEsTUFBTTtlQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7T0FBQTtBQUMzQyxvQkFBYyxFQUFFLHdCQUFBLE1BQU0sRUFBSTtBQUN4QixZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdDLGVBQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sT0FBTyxDQUFDO09BQ2hCO0FBQ0QseUJBQW1CLEVBQUUsNkJBQUEsTUFBTSxFQUFJO1lBQ3JCLFFBQVEsc0JBQVIsUUFBUTtZQUFFLE1BQU0sc0JBQU4sTUFBTTtZQUFFLE9BQU8sc0JBQVAsT0FBTzs7QUFDakMsWUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLE1BQUssTUFBTSxFQUFFLENBQUM7QUFDM0QsMkJBQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25ELGNBQUssTUFBTSxFQUFFLENBQUM7T0FDZjtBQUNELHdCQUFrQixFQUFFO2VBQU0sTUFBSyxNQUFNLEVBQUU7T0FBQTtBQUN2QyxrQkFBWSxFQUFFLHVDQUF1QztLQUN0RCxDQUFDLENBQUM7R0FDSjs7ZUF4QmtCLG9CQUFvQjs7V0EwQmhDLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3RDOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7QUFDdEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN0QjtBQUNELFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO0FBQ2pDLFlBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN0QyxZQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO09BQ3RDO0tBQ0Y7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7QUFDdkQsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztBQUMzRSxVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDN0I7Ozs2QkFFVyxhQUFHO0FBQ2IsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUN0QixZQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7T0FDZixNQUFNLElBQUksbUJBQU0sUUFBUSxJQUFJLG1CQUFNLE9BQU8sRUFBRTtBQUMxQyxjQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO0FBQy9CLGVBQUssRUFBRSxtQkFBTSxjQUFjLENBQUMsTUFBTSxDQUFDLFVBQUEsTUFBTTttQkFDdkMsc0NBQTBCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsbUJBQU0sT0FBTyxDQUFDO1dBQUEsQ0FDNUQ7U0FDRixDQUFDLENBQUM7QUFDSCxZQUFNLE9BQU8sR0FBRyxtQkFBTSxPQUFPLENBQUM7QUFDOUIsWUFBSSxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmO0tBQ0Y7OztTQS9Ea0Isb0JBQW9COzs7cUJBQXBCLG9CQUFvQiIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvZXhpc3Rpbmcta2VybmVsLXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBTZWxlY3RMaXN0VmlldyBmcm9tIFwiYXRvbS1zZWxlY3QtbGlzdFwiO1xuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgdGlsZGlmeSBmcm9tIFwidGlsZGlmeVwiO1xuXG5pbXBvcnQgeyBrZXJuZWxTcGVjUHJvdmlkZXNHcmFtbWFyIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuaW1wb3J0IHR5cGUgS2VybmVsIGZyb20gXCIuL2tlcm5lbFwiO1xuXG5mdW5jdGlvbiBnZXROYW1lKGtlcm5lbDogS2VybmVsKSB7XG4gIGNvbnN0IHByZWZpeCA9IGtlcm5lbC50cmFuc3BvcnQuZ2F0ZXdheU5hbWVcbiAgICA/IGAke2tlcm5lbC50cmFuc3BvcnQuZ2F0ZXdheU5hbWV9OiBgXG4gICAgOiBcIlwiO1xuICByZXR1cm4gKFxuICAgIHByZWZpeCArXG4gICAga2VybmVsLmRpc3BsYXlOYW1lICtcbiAgICBcIiAtIFwiICtcbiAgICBzdG9yZVxuICAgICAgLmdldEZpbGVzRm9yS2VybmVsKGtlcm5lbClcbiAgICAgIC5tYXAodGlsZGlmeSlcbiAgICAgIC5qb2luKFwiLCBcIilcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhpc3RpbmdLZXJuZWxQaWNrZXIge1xuICBrZXJuZWxTcGVjczogQXJyYXk8S2VybmVsc3BlYz47XG4gIHNlbGVjdExpc3RWaWV3OiBTZWxlY3RMaXN0VmlldztcbiAgcGFuZWw6ID9hdG9tJFBhbmVsO1xuICBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ6ID9IVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtc0NsYXNzTGlzdDogW1wibWFyay1hY3RpdmVcIl0sXG4gICAgICBpdGVtczogW10sXG4gICAgICBmaWx0ZXJLZXlGb3JJdGVtOiBrZXJuZWwgPT4gZ2V0TmFtZShrZXJuZWwpLFxuICAgICAgZWxlbWVudEZvckl0ZW06IGtlcm5lbCA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBnZXROYW1lKGtlcm5lbCk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IGtlcm5lbCA9PiB7XG4gICAgICAgIGNvbnN0IHsgZmlsZVBhdGgsIGVkaXRvciwgZ3JhbW1hciB9ID0gc3RvcmU7XG4gICAgICAgIGlmICghZmlsZVBhdGggfHwgIWVkaXRvciB8fCAhZ3JhbW1hcikgcmV0dXJuIHRoaXMuY2FuY2VsKCk7XG4gICAgICAgIHN0b3JlLm5ld0tlcm5lbChrZXJuZWwsIGZpbGVQYXRoLCBlZGl0b3IsIGdyYW1tYXIpO1xuICAgICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgfSxcbiAgICAgIGRpZENhbmNlbFNlbGVjdGlvbjogKCkgPT4gdGhpcy5jYW5jZWwoKSxcbiAgICAgIGVtcHR5TWVzc2FnZTogXCJObyBydW5uaW5nIGtlcm5lbHMgZm9yIHRoaXMgbGFuZ3VhZ2UuXCJcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5jYW5jZWwoKTtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RMaXN0Vmlldy5kZXN0cm95KCk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIGlmICh0aGlzLnBhbmVsID09IG51bGwpXG4gICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMuc2VsZWN0TGlzdFZpZXcgfSk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5mb2N1cygpO1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcucmVzZXQoKTtcbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgIH0gZWxzZSBpZiAoc3RvcmUuZmlsZVBhdGggJiYgc3RvcmUuZ3JhbW1hcikge1xuICAgICAgYXdhaXQgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe1xuICAgICAgICBpdGVtczogc3RvcmUucnVubmluZ0tlcm5lbHMuZmlsdGVyKGtlcm5lbCA9PlxuICAgICAgICAgIGtlcm5lbFNwZWNQcm92aWRlc0dyYW1tYXIoa2VybmVsLmtlcm5lbFNwZWMsIHN0b3JlLmdyYW1tYXIpXG4gICAgICAgIClcbiAgICAgIH0pO1xuICAgICAgY29uc3QgbWFya2VycyA9IHN0b3JlLm1hcmtlcnM7XG4gICAgICBpZiAobWFya2VycykgbWFya2Vycy5jbGVhcigpO1xuICAgICAgdGhpcy5hdHRhY2goKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==