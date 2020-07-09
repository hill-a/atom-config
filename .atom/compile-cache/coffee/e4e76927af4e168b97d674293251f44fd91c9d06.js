(function() {
  var $, GitRevSelectorPopup, View, _, moment, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View;

  moment = require('moment');

  _ = require('underscore-plus');

  module.exports = GitRevSelectorPopup = (function(superClass) {
    extend(GitRevSelectorPopup, superClass);

    function GitRevSelectorPopup() {
      this._onMouseLeaveHoverElement = bind(this._onMouseLeaveHoverElement, this);
      this._onMouseEnterHoverElement = bind(this._onMouseEnterHoverElement, this);
      this._onMouseLeavePopup = bind(this._onMouseLeavePopup, this);
      this._onMouseEnterPopup = bind(this._onMouseEnterPopup, this);
      this.isMouseInPopup = bind(this.isMouseInPopup, this);
      this.remove = bind(this.remove, this);
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      return GitRevSelectorPopup.__super__.constructor.apply(this, arguments);
    }

    GitRevSelectorPopup.content = function(commit, leftOrRight, $hoverElement) {
      var dateFormat;
      dateFormat = "MMM DD YYYY ha";
      return this.div({
        "class": "select-list popover-list git-timemachine-revselector-popup"
      }, (function(_this) {
        return function() {
          var authorDate, linesAdded, linesDeleted;
          authorDate = moment.unix(commit.authorDate);
          linesAdded = commit.linesAdded || 0;
          linesDeleted = commit.linesDeleted || 0;
          return _this.div({
            "data-rev": commit.id
          }, function() {
            return _this.div({
              "class": "commit"
            }, function() {
              _this.div({
                "class": "header"
              }, function() {
                _this.div("" + (authorDate.format(dateFormat)));
                _this.div("" + commit.hash);
                return _this.div(function() {
                  _this.span({
                    "class": 'added-count'
                  }, "+" + linesAdded + " ");
                  return _this.span({
                    "class": 'removed-count'
                  }, "-" + linesDeleted + " ");
                });
              });
              _this.div(function() {
                return _this.strong("" + commit.message);
              });
              return _this.div("Authored by " + commit.authorName + " " + (authorDate.fromNow()));
            });
          });
        };
      })(this));
    };

    GitRevSelectorPopup.prototype.initialize = function(commit, leftOrRight1, $hoverElement1) {
      this.leftOrRight = leftOrRight1;
      this.$hoverElement = $hoverElement1;
      if (this._debouncedHide == null) {
        this._debouncedHide = _.debounce(this.hide, 50);
      }
      this.appendTo(atom.views.getView(atom.workspace));
      this._bindMouseEvents();
      this.show();
      return _.delay(this.hide, 5000);
    };

    GitRevSelectorPopup.prototype._bindMouseEvents = function() {
      this.mouseenter(this._onMouseEnterPopup);
      this.mouseleave(this._onMouseLeavePopup);
      this.$hoverElement.mouseenter(this._onMouseEnterHoverElement);
      return this.$hoverElement.mouseleave(this._onMouseLeaveHoverElement);
    };

    GitRevSelectorPopup.prototype.hide = function() {
      if (!(this._mouseInPopup || this._mouseInHoverElement)) {
        GitRevSelectorPopup.__super__.hide.apply(this, arguments);
      }
      return this;
    };

    GitRevSelectorPopup.prototype.show = function() {
      GitRevSelectorPopup.__super__.show.apply(this, arguments);
      _.defer((function(_this) {
        return function() {
          return _this._positionPopup();
        };
      })(this));
      return this;
    };

    GitRevSelectorPopup.prototype.remove = function() {
      return GitRevSelectorPopup.__super__.remove.apply(this, arguments);
    };

    GitRevSelectorPopup.prototype.isMouseInPopup = function() {
      return this._mouseInPopup === true;
    };

    GitRevSelectorPopup.prototype._positionPopup = function() {
      var clientRect, left, top;
      clientRect = this.$hoverElement.offset();
      if (this.leftOrRight === 'left') {
        left = clientRect.left + this.$hoverElement.width() - this.width();
      } else {
        left = clientRect.left;
      }
      top = clientRect.top - this.height() - 18;
      return this.css({
        top: top,
        left: left
      });
    };

    GitRevSelectorPopup.prototype._onMouseEnterPopup = function(evt) {
      this._mouseInPopup = true;
    };

    GitRevSelectorPopup.prototype._onMouseLeavePopup = function(evt) {
      this._mouseInPopup = false;
      this._debouncedHide();
    };

    GitRevSelectorPopup.prototype._onMouseEnterHoverElement = function(evt) {
      this._mouseInHoverElement = true;
      return this.show();
    };

    GitRevSelectorPopup.prototype._onMouseLeaveHoverElement = function(evt) {
      this._mouseInHoverElement = false;
      return this._debouncedHide();
    };

    return GitRevSelectorPopup;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXJldnNlbGVjdG9yLXBvcHVwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNENBQUE7SUFBQTs7OztFQUFBLE1BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFELEVBQUk7O0VBQ0osTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUNULENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBR0osTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7Ozs7Ozs7OztJQUVyQixtQkFBQyxDQUFBLE9BQUQsR0FBVyxTQUFDLE1BQUQsRUFBUyxXQUFULEVBQXNCLGFBQXRCO0FBQ1QsVUFBQTtNQUFBLFVBQUEsR0FBYTthQUNiLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDREQUFQO09BQUwsRUFBMEUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ3hFLGNBQUE7VUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFNLENBQUMsVUFBbkI7VUFDYixVQUFBLEdBQWEsTUFBTSxDQUFDLFVBQVAsSUFBcUI7VUFDbEMsWUFBQSxHQUFlLE1BQU0sQ0FBQyxZQUFQLElBQXVCO2lCQUN0QyxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsVUFBQSxFQUFZLE1BQU0sQ0FBQyxFQUFuQjtXQUFMLEVBQTRCLFNBQUE7bUJBQzFCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFFBQVA7YUFBTCxFQUFzQixTQUFBO2NBQ3BCLEtBQUMsQ0FBQSxHQUFELENBQUs7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxRQUFQO2VBQUwsRUFBc0IsU0FBQTtnQkFDcEIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxFQUFBLEdB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R0FBTyxVQUFVLENBQUMsS0FIcEI7O01BSUEsR0FBQSxHQUFNLFVBQVUsQ0FBQyxHQUFYLEdBQWlCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBakIsR0FBNkI7YUFDbkMsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFDLEdBQUEsRUFBSyxHQUFOO1FBQVcsSUFBQSxFQUFNLElBQWpCO09BQUw7SUFQYzs7a0NBVWhCLGtCQUFBLEdBQW9CLFNBQUMsR0FBRDtNQUNsQixJQUFDLENBQUEsYUFBRCxHQUFpQjtJQURDOztrQ0FLcEIsa0JBQUEsR0FBb0IsU0FBQyxHQUFEO01BQ2xCLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxjQUFELENBQUE7SUFGa0I7O2tDQU1wQix5QkFBQSxHQUEyQixTQUFDLEdBQUQ7TUFDekIsSUFBQyxDQUFBLG9CQUFELEdBQXdCO2FBQ3hCLElBQUMsQ0FBQSxJQUFELENBQUE7SUFGeUI7O2tDQUszQix5QkFBQSxHQUEyQixTQUFDLEdBQUQ7TUFDekIsSUFBQyxDQUFBLG9CQUFELEdBQXdCO2FBQ3hCLElBQUMsQ0FBQSxjQUFELENBQUE7SUFGeUI7Ozs7S0F4RnNCO0FBTG5EIiwic291cmNlc0NvbnRlbnQiOlsieyQsIFZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHaXRSZXZTZWxlY3RvclBvcHVwIGV4dGVuZHMgVmlld1xuXG4gIEBjb250ZW50ID0gKGNvbW1pdCwgbGVmdE9yUmlnaHQsICRob3ZlckVsZW1lbnQpIC0+XG4gICAgZGF0ZUZvcm1hdCA9IFwiTU1NIEREIFlZWVkgaGFcIlxuICAgIEBkaXYgY2xhc3M6IFwic2VsZWN0LWxpc3QgcG9wb3Zlci1saXN0IGdpdC10aW1lbWFjaGluZS1yZXZzZWxlY3Rvci1wb3B1cFwiLCA9PlxuICAgICAgYXV0aG9yRGF0ZSA9IG1vbWVudC51bml4KGNvbW1pdC5hdXRob3JEYXRlKVxuICAgICAgbGluZXNBZGRlZCA9IGNvbW1pdC5saW5lc0FkZGVkIHx8IDBcbiAgICAgIGxpbmVzRGVsZXRlZCA9IGNvbW1pdC5saW5lc0RlbGV0ZWQgfHwgMFxuICAgICAgQGRpdiBcImRhdGEtcmV2XCI6IGNvbW1pdC5pZCwgPT5cbiAgICAgICAgQGRpdiBjbGFzczogXCJjb21taXRcIiwgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiBcImhlYWRlclwiLCA9PlxuICAgICAgICAgICAgQGRpdiBcIiN7YXV0aG9yRGF0ZS5mb3JtYXQoZGF0ZUZvcm1hdCl9XCJcbiAgICAgICAgICAgIEBkaXYgXCIje2NvbW1pdC5oYXNofVwiXG4gICAgICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnYWRkZWQtY291bnQnLCBcIisje2xpbmVzQWRkZWR9IFwiXG4gICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAncmVtb3ZlZC1jb3VudCcsIFwiLSN7bGluZXNEZWxldGVkfSBcIlxuXG4gICAgICAgICAgQGRpdiA9PlxuICAgICAgICAgICAgQHN0cm9uZyBcIiN7Y29tbWl0Lm1lc3NhZ2V9XCJcblxuICAgICAgICAgIEBkaXYgXCJBdXRob3JlZCBieSAje2NvbW1pdC5hdXRob3JOYW1lfSAje2F1dGhvckRhdGUuZnJvbU5vdygpfVwiXG5cblxuICBpbml0aWFsaXplOiAoY29tbWl0LCBAbGVmdE9yUmlnaHQsIEAkaG92ZXJFbGVtZW50KSAtPlxuICAgICMgYWxsb3dzIHRpbWUgdG8gZ2V0IG1vdXNlIGluIHBvcHVwXG4gICAgQF9kZWJvdW5jZWRIaWRlID89IF8uZGVib3VuY2UgQGhpZGUsIDUwIFxuICAgIFxuICAgIEBhcHBlbmRUbyBhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2VcbiAgICBAX2JpbmRNb3VzZUV2ZW50cygpXG4gICAgQHNob3coKVxuICAgIF8uZGVsYXkgQGhpZGUsIDUwMDBcbiAgICBcbiAgICBcbiAgX2JpbmRNb3VzZUV2ZW50czogLT5cbiAgICBAbW91c2VlbnRlciBAX29uTW91c2VFbnRlclBvcHVwXG4gICAgQG1vdXNlbGVhdmUgQF9vbk1vdXNlTGVhdmVQb3B1cFxuICAgIEAkaG92ZXJFbGVtZW50Lm1vdXNlZW50ZXIgQF9vbk1vdXNlRW50ZXJIb3ZlckVsZW1lbnRcbiAgICBAJGhvdmVyRWxlbWVudC5tb3VzZWxlYXZlIEBfb25Nb3VzZUxlYXZlSG92ZXJFbGVtZW50XG5cbiAgICBcbiAgaGlkZTogKCkgPT5cbiAgICB1bmxlc3MgQF9tb3VzZUluUG9wdXAgfHwgQF9tb3VzZUluSG92ZXJFbGVtZW50XG4gICAgICBzdXBlclxuICAgICAgXG4gICAgcmV0dXJuIEBcblxuXG4gIHNob3c6ICgpID0+XG4gICAgc3VwZXJcbiAgICBfLmRlZmVyID0+IEBfcG9zaXRpb25Qb3B1cCgpXG4gICAgICBcbiAgICByZXR1cm4gQFxuXG5cbiAgcmVtb3ZlOiAoKSA9PlxuICAgIHN1cGVyXG5cblxuICBpc01vdXNlSW5Qb3B1cDogKCkgPT5cbiAgICByZXR1cm4gQF9tb3VzZUluUG9wdXAgPT0gdHJ1ZVxuXG5cbiAgX3Bvc2l0aW9uUG9wdXA6IC0+XG4gICAgY2xpZW50UmVjdCA9IEAkaG92ZXJFbGVtZW50Lm9mZnNldCgpXG4gICAgaWYgQGxlZnRPclJpZ2h0ID09ICdsZWZ0J1xuICAgICAgbGVmdCA9IGNsaWVudFJlY3QubGVmdCArIEAkaG92ZXJFbGVtZW50LndpZHRoKCkgLSBAd2lkdGgoKVxuICAgIGVsc2VcbiAgICAgIGxlZnQgPSBjbGllbnRSZWN0LmxlZnRcbiAgICB0b3AgPSBjbGllbnRSZWN0LnRvcCAtIEBoZWlnaHQoKSAtIDE4XG4gICAgQGNzcyh7dG9wOiB0b3AsIGxlZnQ6IGxlZnR9KVxuXG5cbiAgX29uTW91c2VFbnRlclBvcHVwOiAoZXZ0KSA9PlxuICAgIEBfbW91c2VJblBvcHVwID0gdHJ1ZVxuICAgIHJldHVyblxuXG5cbiAgX29uTW91c2VMZWF2ZVBvcHVwOiAoZXZ0KSA9PlxuICAgIEBfbW91c2VJblBvcHVwID0gZmFsc2VcbiAgICBAX2RlYm91bmNlZEhpZGUoKVxuICAgIHJldHVyblxuICAgIFxuICAgIFxuICBfb25Nb3VzZUVudGVySG92ZXJFbGVtZW50OiAoZXZ0KSA9PlxuICAgIEBfbW91c2VJbkhvdmVyRWxlbWVudCA9IHRydWVcbiAgICBAc2hvdygpXG4gICAgXG5cbiAgX29uTW91c2VMZWF2ZUhvdmVyRWxlbWVudDogKGV2dCkgPT5cbiAgICBAX21vdXNlSW5Ib3ZlckVsZW1lbnQgPSBmYWxzZVxuICAgIEBfZGVib3VuY2VkSGlkZSgpXG5cblxuIl19
