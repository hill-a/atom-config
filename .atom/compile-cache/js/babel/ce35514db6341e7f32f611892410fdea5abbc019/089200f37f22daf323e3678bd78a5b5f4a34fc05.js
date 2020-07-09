Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atomSelectList = require("atom-select-list");

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _wsKernel = require("../../../ws-kernel");

var _wsKernel2 = _interopRequireDefault(_wsKernel);

var _utils = require("../../../utils");

var basicCommands = [{ name: "Interrupt", value: "interrupt-kernel" }, { name: "Restart", value: "restart-kernel" }, { name: "Shut Down", value: "shutdown-kernel" }];

var wsKernelCommands = [{ name: "Rename session for", value: "rename-kernel" }, { name: "Disconnect from", value: "disconnect-kernel" }];

var SignalListView = (function () {
  function SignalListView(store, handleKernelCommand) {
    var _this = this;

    _classCallCheck(this, SignalListView);

    this.store = store;
    this.handleKernelCommand = handleKernelCommand;
    this.selectListView = new _atomSelectList2["default"]({
      itemsClassList: ["mark-active"],
      items: [],
      filterKeyForItem: function filterKeyForItem(item) {
        return item.name;
      },
      elementForItem: function elementForItem(item) {
        var element = document.createElement("li");
        element.textContent = item.name;
        return element;
      },
      didConfirmSelection: function didConfirmSelection(item) {
        (0, _utils.log)("Selected command:", item);
        _this.onConfirmed(item);
        _this.cancel();
      },
      didCancelSelection: function didCancelSelection() {
        return _this.cancel();
      },
      emptyMessage: "No running kernels for this file type."
    });
  }

  _createClass(SignalListView, [{
    key: "onConfirmed",
    value: function onConfirmed(kernelCommand) {
      if (this.handleKernelCommand) {
        this.handleKernelCommand(kernelCommand, this.store);
      }
    }
  }, {
    key: "toggle",
    value: _asyncToGenerator(function* () {
      if (this.panel != null) {
        this.cancel();
      }
      if (!this.store) return;
      var kernel = this.store.kernel;
      if (!kernel) return;
      var commands = kernel.transport instanceof _wsKernel2["default"] ? [].concat(basicCommands, wsKernelCommands) : basicCommands;

      var listItems = commands.map(function (command) {
        return {
          name: command.name + " " + kernel.kernelSpec.display_name + " kernel",
          command: command.value
        };
      });

      yield this.selectListView.update({ items: listItems });
      this.attach();
    })
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      if (this.panel == null) this.panel = atom.workspace.addModalPanel({ item: this.selectListView });
      this.selectListView.focus();
      this.selectListView.reset();
    }
  }, {
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
  }]);

  return SignalListView;
})();

exports["default"] = SignalListView;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9jb25zdW1lZC9zdGF0dXMtYmFyL3NpZ25hbC1saXN0LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUUyQixrQkFBa0I7Ozs7d0JBRXhCLG9CQUFvQjs7OztxQkFDckIsZ0JBQWdCOztBQUdwQyxJQUFNLGFBQWEsR0FBRyxDQUNwQixFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixFQUFFLEVBQ2hELEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFDNUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxDQUNoRCxDQUFDOztBQUVGLElBQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUN0RCxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsbUJBQW1CLEVBQUUsQ0FDeEQsQ0FBQzs7SUFFbUIsY0FBYztBQU90QixXQVBRLGNBQWMsQ0FPckIsS0FBWSxFQUFFLG1CQUE2QixFQUFFOzs7MEJBUHRDLGNBQWM7O0FBUS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsY0FBYyxHQUFHLGdDQUFtQjtBQUN2QyxvQkFBYyxFQUFFLENBQUMsYUFBYSxDQUFDO0FBQy9CLFdBQUssRUFBRSxFQUFFO0FBQ1Qsc0JBQWdCLEVBQUUsMEJBQUEsSUFBSTtlQUFJLElBQUksQ0FBQyxJQUFJO09BQUE7QUFDbkMsb0JBQWMsRUFBRSx3QkFBQSxJQUFJLEVBQUk7QUFDdEIsWUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxlQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDaEMsZUFBTyxPQUFPLENBQUM7T0FDaEI7QUFDRCx5QkFBbUIsRUFBRSw2QkFBQSxJQUFJLEVBQUk7QUFDM0Isd0JBQUksbUJBQW1CLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0IsY0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsY0FBSyxNQUFNLEVBQUUsQ0FBQztPQUNmO0FBQ0Qsd0JBQWtCLEVBQUU7ZUFBTSxNQUFLLE1BQU0sRUFBRTtPQUFBO0FBQ3ZDLGtCQUFZLEVBQUUsd0NBQXdDO0tBQ3ZELENBQUMsQ0FBQztHQUNKOztlQTNCa0IsY0FBYzs7V0E2QnRCLHFCQUFDLGFBQWtDLEVBQUM7QUFDNUMsVUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDM0IsWUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDckQ7S0FDSjs7OzZCQUVXLGFBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNmO0FBQ0QsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTztBQUN4QixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUNqQyxVQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDcEIsVUFBTSxRQUFRLEdBQ1osTUFBTSxDQUFDLFNBQVMsaUNBQW9CLGFBQzVCLGFBQWEsRUFBSyxnQkFBZ0IsSUFDdEMsYUFBYSxDQUFDOztBQUVwQixVQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTztlQUFLO0FBQ3pDLGNBQUksRUFBSyxPQUFPLENBQUMsSUFBSSxTQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxZQUFTO0FBQ2hFLGlCQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUs7U0FDdkI7T0FBQyxDQUFDLENBQUM7O0FBRUosWUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7V0FFSyxrQkFBRztBQUNQLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO0FBQ3ZELFVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7QUFDM0UsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0Qzs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDdEI7QUFDRCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtBQUNqQyxZQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdEMsWUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztPQUN0QztLQUNGOzs7U0E5RWtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9jb25zdW1lZC9zdGF0dXMtYmFyL3NpZ25hbC1saXN0LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgU2VsZWN0TGlzdFZpZXcgZnJvbSBcImF0b20tc2VsZWN0LWxpc3RcIjtcblxuaW1wb3J0IFdTS2VybmVsIGZyb20gXCIuLi8uLi8uLi93cy1rZXJuZWxcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHR5cGUgeyBTdG9yZSB9IGZyb20gXCIuLi8uLi8uLi9zdG9yZVwiO1xuXG5jb25zdCBiYXNpY0NvbW1hbmRzID0gW1xuICB7IG5hbWU6IFwiSW50ZXJydXB0XCIsIHZhbHVlOiBcImludGVycnVwdC1rZXJuZWxcIiB9LFxuICB7IG5hbWU6IFwiUmVzdGFydFwiLCB2YWx1ZTogXCJyZXN0YXJ0LWtlcm5lbFwiIH0sXG4gIHsgbmFtZTogXCJTaHV0IERvd25cIiwgdmFsdWU6IFwic2h1dGRvd24ta2VybmVsXCIgfVxuXTtcblxuY29uc3Qgd3NLZXJuZWxDb21tYW5kcyA9IFtcbiAgeyBuYW1lOiBcIlJlbmFtZSBzZXNzaW9uIGZvclwiLCB2YWx1ZTogXCJyZW5hbWUta2VybmVsXCIgfSxcbiAgeyBuYW1lOiBcIkRpc2Nvbm5lY3QgZnJvbVwiLCB2YWx1ZTogXCJkaXNjb25uZWN0LWtlcm5lbFwiIH1cbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZ25hbExpc3RWaWV3IHtcbiAgcGFuZWw6ID9hdG9tJFBhbmVsO1xuICBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ6ID9IVE1MRWxlbWVudDtcbiAgc2VsZWN0TGlzdFZpZXc6IFNlbGVjdExpc3RWaWV3O1xuICBzdG9yZTogP1N0b3JlO1xuICBoYW5kbGVLZXJuZWxDb21tYW5kOiA/RnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlLCBoYW5kbGVLZXJuZWxDb21tYW5kOiBGdW5jdGlvbikge1xuICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICB0aGlzLmhhbmRsZUtlcm5lbENvbW1hbmQgPSBoYW5kbGVLZXJuZWxDb21tYW5kO1xuICAgIHRoaXMuc2VsZWN0TGlzdFZpZXcgPSBuZXcgU2VsZWN0TGlzdFZpZXcoe1xuICAgICAgaXRlbXNDbGFzc0xpc3Q6IFtcIm1hcmstYWN0aXZlXCJdLFxuICAgICAgaXRlbXM6IFtdLFxuICAgICAgZmlsdGVyS2V5Rm9ySXRlbTogaXRlbSA9PiBpdGVtLm5hbWUsXG4gICAgICBlbGVtZW50Rm9ySXRlbTogaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBpdGVtLm5hbWU7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IGl0ZW0gPT4ge1xuICAgICAgICBsb2coXCJTZWxlY3RlZCBjb21tYW5kOlwiLCBpdGVtKTtcbiAgICAgICAgdGhpcy5vbkNvbmZpcm1lZChpdGVtKTtcbiAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgIH0sXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHRoaXMuY2FuY2VsKCksXG4gICAgICBlbXB0eU1lc3NhZ2U6IFwiTm8gcnVubmluZyBrZXJuZWxzIGZvciB0aGlzIGZpbGUgdHlwZS5cIlxuICAgIH0pO1xuICB9XG5cbiAgb25Db25maXJtZWQoa2VybmVsQ29tbWFuZDogeyBjb21tYW5kOiBzdHJpbmcgfSl7XG4gICAgXHRpZiAodGhpcy5oYW5kbGVLZXJuZWxDb21tYW5kKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlS2VybmVsQ29tbWFuZChrZXJuZWxDb21tYW5kLCB0aGlzLnN0b3JlKTtcbiAgICAgIH1cbiAgfVxuXG4gIGFzeW5jIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc3RvcmUpIHJldHVybjtcbiAgICBjb25zdCBrZXJuZWwgPSB0aGlzLnN0b3JlLmtlcm5lbDtcbiAgICBpZiAoIWtlcm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNvbW1hbmRzID1cbiAgICAgIGtlcm5lbC50cmFuc3BvcnQgaW5zdGFuY2VvZiBXU0tlcm5lbFxuICAgICAgICA/IFsuLi5iYXNpY0NvbW1hbmRzLCAuLi53c0tlcm5lbENvbW1hbmRzXVxuICAgICAgICA6IGJhc2ljQ29tbWFuZHM7XG5cbiAgICBjb25zdCBsaXN0SXRlbXMgPSBjb21tYW5kcy5tYXAoY29tbWFuZCA9PiAoe1xuICAgICAgbmFtZTogYCR7Y29tbWFuZC5uYW1lfSAke2tlcm5lbC5rZXJuZWxTcGVjLmRpc3BsYXlfbmFtZX0ga2VybmVsYCxcbiAgICAgIGNvbW1hbmQ6IGNvbW1hbmQudmFsdWVcbiAgICB9KSk7XG5cbiAgICBhd2FpdCB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7IGl0ZW1zOiBsaXN0SXRlbXMgfSk7XG4gICAgdGhpcy5hdHRhY2goKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKHRoaXMucGFuZWwgPT0gbnVsbClcbiAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcy5zZWxlY3RMaXN0VmlldyB9KTtcbiAgICB0aGlzLnNlbGVjdExpc3RWaWV3LmZvY3VzKCk7XG4gICAgdGhpcy5zZWxlY3RMaXN0Vmlldy5yZXNldCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNhbmNlbCgpO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdExpc3RWaWV3LmRlc3Ryb3koKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgaWYgKHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50KSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIl19