Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

var InputView = (function () {
  function InputView(_ref, onConfirmed) {
    var _this = this;

    var prompt = _ref.prompt;
    var defaultText = _ref.defaultText;
    var allowCancel = _ref.allowCancel;
    var password = _ref.password;

    _classCallCheck(this, InputView);

    this.onConfirmed = onConfirmed;

    this.element = document.createElement("div");
    this.element.classList.add("hydrogen", "input-view");
    if (password) this.element.classList.add("password");

    var label = document.createElement("div");
    label.classList.add("label", "icon", "icon-arrow-right");
    label.textContent = prompt || "Kernel requires input";

    this.miniEditor = new _atom.TextEditor({ mini: true });
    if (defaultText) this.miniEditor.setText(defaultText);

    this.element.appendChild(label);
    this.element.appendChild(this.miniEditor.element);

    if (allowCancel) {
      atom.commands.add(this.element, {
        "core:confirm": function coreConfirm() {
          return _this.confirm();
        },
        "core:cancel": function coreCancel() {
          return _this.close();
        }
      });
      this.miniEditor.element.addEventListener("blur", function () {
        if (document.hasFocus()) _this.close();
      });
    } else {
      atom.commands.add(this.element, {
        "core:confirm": function coreConfirm() {
          return _this.confirm();
        }
      });
    }
  }

  _createClass(InputView, [{
    key: "confirm",
    value: function confirm() {
      var text = this.miniEditor.getText();
      if (this.onConfirmed) this.onConfirmed(text);
      this.close();
    }
  }, {
    key: "close",
    value: function close() {
      if (this.panel) this.panel.destroy();
      this.panel = null;
      this.element.remove();
      if (this.previouslyFocusedElement) this.previouslyFocusedElement.focus();
    }
  }, {
    key: "attach",
    value: function attach() {
      this.previouslyFocusedElement = document.activeElement;
      this.panel = atom.workspace.addModalPanel({ item: this.element });
      this.miniEditor.element.focus();
      this.miniEditor.scrollToCursorPosition();
    }
  }]);

  return InputView;
})();

exports["default"] = InputView;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9pbnB1dC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUUyQixNQUFNOztJQVVaLFNBQVM7QUFNakIsV0FOUSxTQUFTLENBTzFCLElBQW9ELEVBQ3BELFdBQWUsRUFDZjs7O1FBRkUsTUFBTSxHQUFSLElBQW9ELENBQWxELE1BQU07UUFBRSxXQUFXLEdBQXJCLElBQW9ELENBQTFDLFdBQVc7UUFBRSxXQUFXLEdBQWxDLElBQW9ELENBQTdCLFdBQVc7UUFBRSxRQUFRLEdBQTVDLElBQW9ELENBQWhCLFFBQVE7OzBCQVAzQixTQUFTOztBQVUxQixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFDckQsUUFBSSxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVyRCxRQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLFNBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztBQUN6RCxTQUFLLENBQUMsV0FBVyxHQUFHLE1BQU0sSUFBSSx1QkFBdUIsQ0FBQzs7QUFFdEQsUUFBSSxDQUFDLFVBQVUsR0FBRyxxQkFBZSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pELFFBQUksV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUV0RCxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoQyxRQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsRCxRQUFJLFdBQVcsRUFBRTtBQUNmLFVBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDOUIsc0JBQWMsRUFBRTtpQkFBTSxNQUFLLE9BQU8sRUFBRTtTQUFBO0FBQ3BDLHFCQUFhLEVBQUU7aUJBQU0sTUFBSyxLQUFLLEVBQUU7U0FBQTtPQUNsQyxDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBTTtBQUNyRCxZQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFLLEtBQUssRUFBRSxDQUFDO09BQ3ZDLENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzlCLHNCQUFjLEVBQUU7aUJBQU0sTUFBSyxPQUFPLEVBQUU7U0FBQTtPQUNyQyxDQUFDLENBQUM7S0FDSjtHQUNGOztlQXZDa0IsU0FBUzs7V0F5Q3JCLG1CQUFHO0FBQ1IsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2QyxVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRUksaUJBQUc7QUFDTixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQyxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3RCLFVBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUMxRTs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsd0JBQXdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztBQUN2RCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLFVBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztLQUMxQzs7O1NBM0RrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvaW5wdXQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IFRleHRFZGl0b3IgfSBmcm9tIFwiYXRvbVwiO1xuXG50eXBlIG9wdHMgPSB7XG4gIHByb21wdDogc3RyaW5nLFxuICBkZWZhdWx0VGV4dD86IHN0cmluZyxcbiAgYWxsb3dDYW5jZWw/OiBib29sZWFuLFxuICBwYXNzd29yZD86IGJvb2xlYW5cbn07XG50eXBlIGNiID0gKHM6IHN0cmluZykgPT4gdm9pZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5wdXRWaWV3IHtcbiAgb25Db25maXJtZWQ6IGNiO1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgbWluaUVkaXRvcjogYXRvbSRUZXh0RWRpdG9yO1xuICBwYW5lbDogP2F0b20kUGFuZWw7XG4gIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudDogP0hUTUxFbGVtZW50O1xuICBjb25zdHJ1Y3RvcihcbiAgICB7IHByb21wdCwgZGVmYXVsdFRleHQsIGFsbG93Q2FuY2VsLCBwYXNzd29yZCB9OiBvcHRzLFxuICAgIG9uQ29uZmlybWVkOiBjYlxuICApIHtcbiAgICB0aGlzLm9uQ29uZmlybWVkID0gb25Db25maXJtZWQ7XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaHlkcm9nZW5cIiwgXCJpbnB1dC12aWV3XCIpO1xuICAgIGlmIChwYXNzd29yZCkgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJwYXNzd29yZFwiKTtcblxuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsYWJlbC5jbGFzc0xpc3QuYWRkKFwibGFiZWxcIiwgXCJpY29uXCIsIFwiaWNvbi1hcnJvdy1yaWdodFwiKTtcbiAgICBsYWJlbC50ZXh0Q29udGVudCA9IHByb21wdCB8fCBcIktlcm5lbCByZXF1aXJlcyBpbnB1dFwiO1xuXG4gICAgdGhpcy5taW5pRWRpdG9yID0gbmV3IFRleHRFZGl0b3IoeyBtaW5pOiB0cnVlIH0pO1xuICAgIGlmIChkZWZhdWx0VGV4dCkgdGhpcy5taW5pRWRpdG9yLnNldFRleHQoZGVmYXVsdFRleHQpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW5pRWRpdG9yLmVsZW1lbnQpO1xuXG4gICAgaWYgKGFsbG93Q2FuY2VsKSB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogKCkgPT4gdGhpcy5jb25maXJtKCksXG4gICAgICAgIFwiY29yZTpjYW5jZWxcIjogKCkgPT4gdGhpcy5jbG9zZSgpXG4gICAgICB9KTtcbiAgICAgIHRoaXMubWluaUVkaXRvci5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50Lmhhc0ZvY3VzKCkpIHRoaXMuY2xvc2UoKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogKCkgPT4gdGhpcy5jb25maXJtKClcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbmZpcm0oKSB7XG4gICAgY29uc3QgdGV4dCA9IHRoaXMubWluaUVkaXRvci5nZXRUZXh0KCk7XG4gICAgaWYgKHRoaXMub25Db25maXJtZWQpIHRoaXMub25Db25maXJtZWQodGV4dCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQpIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogdGhpcy5lbGVtZW50IH0pO1xuICAgIHRoaXMubWluaUVkaXRvci5lbGVtZW50LmZvY3VzKCk7XG4gICAgdGhpcy5taW5pRWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKTtcbiAgfVxufVxuIl19