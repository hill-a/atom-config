(function() {
  var CompositeDisposable, RenameDialog, StatusIcon,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  RenameDialog = null;

  module.exports = StatusIcon = (function(superClass) {
    extend(StatusIcon, superClass);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var ref;
      this.terminalView = terminalView;
      this.classList.add('vk-terminal-status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.name = document.createElement('span');
      this.name.classList.add('name');
      this.appendChild(this.name);
      this.dataset.type = (ref = this.terminalView.constructor) != null ? ref.name : void 0;
      this.addEventListener('click', (function(_this) {
        return function(arg) {
          var ctrlKey, which;
          which = arg.which, ctrlKey = arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
      return this.setupTooltip();
    };

    StatusIcon.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function(event) {
          if (event.detail === 'vk-terminal') {
            return;
          }
          return _this.updateTooltip();
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    StatusIcon.prototype.updateTooltip = function() {
      var process;
      this.removeTooltip();
      if (process = this.terminalView.getTerminalTitle()) {
        this.tooltip = atom.tooltips.add(this, {
          title: process,
          html: false,
          delay: {
            show: 1000,
            hide: 100
          }
        });
      }
      return this.dispatchEvent(new CustomEvent('mouseenter', {
        bubbles: true,
        detail: 'vk-terminal'
      }));
    };

    StatusIcon.prototype.removeTooltip = function() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      return this.tooltip = null;
    };

    StatusIcon.prototype.destroy = function() {
      this.removeTooltip();
      if (this.mouseEnterSubscription) {
        this.mouseEnterSubscription.dispose();
      }
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.isActive = function() {
      return this.classList.contains('active');
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    StatusIcon.prototype.rename = function() {
      var dialog;
      if (RenameDialog == null) {
        RenameDialog = require('./rename-dialog');
      }
      dialog = new RenameDialog(this);
      return dialog.attach();
    };

    StatusIcon.prototype.getName = function() {
      return this.name.textContent.substring(1);
    };

    StatusIcon.prototype.updateName = function(name) {
      if (name !== this.getName()) {
        if (name) {
          name = "&nbsp;" + name;
        }
        this.name.innerHTML = name;
        return this.terminalView.emit('did-change-title');
      }
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('vk-terminal-status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvdmstdGVybWluYWwvbGliL3N0YXR1cy1pY29uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixZQUFBLEdBQWU7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt5QkFDSixNQUFBLEdBQVE7O3lCQUVSLFVBQUEsR0FBWSxTQUFDLFlBQUQ7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLGVBQUQ7TUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSx5QkFBZjtNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkI7TUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQixFQUE0QixlQUE1QjtNQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQWQ7TUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCO01BQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsTUFBcEI7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkO01BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULHNEQUF5QyxDQUFFO01BRTNDLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixPQUFsQixFQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUN6QixjQUFBO1VBRDJCLG1CQUFPO1VBQ2xDLElBQUcsS0FBQSxLQUFTLENBQVo7WUFDRSxLQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQTttQkFDQSxLQUZGO1dBQUEsTUFHSyxJQUFHLEtBQUEsS0FBUyxDQUFaO1lB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LENBQUMsTUFBUCxDQUFBO0lBSE07O3lCQUtSLE9BQUEsR0FBUyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBbEIsQ0FBNEIsQ0FBNUI7SUFBSDs7eUJBRVQsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUNWLElBQUcsSUFBQSxLQUFVLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBYjtRQUNFLElBQTBCLElBQTFCO1VBQUEsSUFBQSxHQUFPLFFBQUEsR0FBVyxLQUFsQjs7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7ZUFDbEIsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLGtCQUFuQixFQUhGOztJQURVOzs7O0tBeEZXOztFQThGekIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIseUJBQXpCLEVBQW9EO0lBQUEsU0FBQSxFQUFXLFVBQVUsQ0FBQyxTQUF0QjtJQUFpQyxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBQTFDO0dBQXBEO0FBbkdqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cblJlbmFtZURpYWxvZyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU3RhdHVzSWNvbiBleHRlbmRzIEhUTUxFbGVtZW50XG4gIGFjdGl2ZTogZmFsc2VcblxuICBpbml0aWFsaXplOiAoQHRlcm1pbmFsVmlldykgLT5cbiAgICBAY2xhc3NMaXN0LmFkZCAndmstdGVybWluYWwtc3RhdHVzLWljb24nXG5cbiAgICBAaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKVxuICAgIEBpY29uLmNsYXNzTGlzdC5hZGQgJ2ljb24nLCAnaWNvbi10ZXJtaW5hbCdcbiAgICBAYXBwZW5kQ2hpbGQoQGljb24pXG5cbiAgICBAbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIEBuYW1lLmNsYXNzTGlzdC5hZGQgJ25hbWUnXG4gICAgQGFwcGVuZENoaWxkKEBuYW1lKVxuXG4gICAgQGRhdGFzZXQudHlwZSA9IEB0ZXJtaW5hbFZpZXcuY29uc3RydWN0b3I/Lm5hbWVcblxuICAgIEBhZGRFdmVudExpc3RlbmVyICdjbGljaycsICh7d2hpY2gsIGN0cmxLZXl9KSA9PlxuICAgICAgaWYgd2hpY2ggaXMgMVxuICAgICAgICBAdGVybWluYWxWaWV3LnRvZ2dsZSgpXG4gICAgICAgIHRydWVcbiAgICAgIGVsc2UgaWYgd2hpY2ggaXMgMlxuICAgICAgICBAdGVybWluYWxWaWV3LmRlc3Ryb3koKVxuICAgICAgICBmYWxzZVxuXG4gICAgQHNldHVwVG9vbHRpcCgpXG5cbiAgc2V0dXBUb29sdGlwOiAtPlxuXG4gICAgb25Nb3VzZUVudGVyID0gKGV2ZW50KSA9PlxuICAgICAgcmV0dXJuIGlmIGV2ZW50LmRldGFpbCBpcyAndmstdGVybWluYWwnXG4gICAgICBAdXBkYXRlVG9vbHRpcCgpXG5cbiAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbiA9IGRpc3Bvc2U6ID0+XG4gICAgICBAcmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uTW91c2VFbnRlcilcbiAgICAgIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uID0gbnVsbFxuXG4gICAgQGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG5cbiAgdXBkYXRlVG9vbHRpcDogLT5cbiAgICBAcmVtb3ZlVG9vbHRpcCgpXG5cbiAgICBpZiBwcm9jZXNzID0gQHRlcm1pbmFsVmlldy5nZXRUZXJtaW5hbFRpdGxlKClcbiAgICAgIEB0b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQgdGhpcyxcbiAgICAgICAgdGl0bGU6IHByb2Nlc3NcbiAgICAgICAgaHRtbDogZmFsc2VcbiAgICAgICAgZGVsYXk6XG4gICAgICAgICAgc2hvdzogMTAwMFxuICAgICAgICAgIGhpZGU6IDEwMFxuXG4gICAgQGRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdtb3VzZWVudGVyJywgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiAndmstdGVybWluYWwnKSlcblxuICByZW1vdmVUb29sdGlwOiAtPlxuICAgIEB0b29sdGlwLmRpc3Bvc2UoKSBpZiBAdG9vbHRpcFxuICAgIEB0b29sdGlwID0gbnVsbFxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHJlbW92ZVRvb2x0aXAoKVxuICAgIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKSBpZiBAbW91c2VFbnRlclN1YnNjcmlwdGlvblxuICAgIEByZW1vdmUoKVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBjbGFzc0xpc3QuYWRkICdhY3RpdmUnXG4gICAgQGFjdGl2ZSA9IHRydWVcblxuICBpc0FjdGl2ZTogLT5cbiAgICBAY2xhc3NMaXN0LmNvbnRhaW5zICdhY3RpdmUnXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAY2xhc3NMaXN0LnJlbW92ZSAnYWN0aXZlJ1xuICAgIEBhY3RpdmUgPSBmYWxzZVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAYWN0aXZlXG4gICAgICBAY2xhc3NMaXN0LnJlbW92ZSAnYWN0aXZlJ1xuICAgIGVsc2VcbiAgICAgIEBjbGFzc0xpc3QuYWRkICdhY3RpdmUnXG4gICAgQGFjdGl2ZSA9ICFAYWN0aXZlXG5cbiAgaXNBY3RpdmU6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVcblxuICByZW5hbWU6IC0+XG4gICAgUmVuYW1lRGlhbG9nID89IHJlcXVpcmUgJy4vcmVuYW1lLWRpYWxvZydcbiAgICBkaWFsb2cgPSBuZXcgUmVuYW1lRGlhbG9nIHRoaXNcbiAgICBkaWFsb2cuYXR0YWNoKClcblxuICBnZXROYW1lOiAtPiBAbmFtZS50ZXh0Q29udGVudC5zdWJzdHJpbmcoMSlcblxuICB1cGRhdGVOYW1lOiAobmFtZSkgLT5cbiAgICBpZiBuYW1lIGlzbnQgQGdldE5hbWUoKVxuICAgICAgbmFtZSA9IFwiJm5ic3A7XCIgKyBuYW1lIGlmIG5hbWVcbiAgICAgIEBuYW1lLmlubmVySFRNTCA9IG5hbWVcbiAgICAgIEB0ZXJtaW5hbFZpZXcuZW1pdCAnZGlkLWNoYW5nZS10aXRsZSdcblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3ZrLXRlcm1pbmFsLXN0YXR1cy1pY29uJywgcHJvdG90eXBlOiBTdGF0dXNJY29uLnByb3RvdHlwZSwgZXh0ZW5kczogJ2xpJylcbiJdfQ==
