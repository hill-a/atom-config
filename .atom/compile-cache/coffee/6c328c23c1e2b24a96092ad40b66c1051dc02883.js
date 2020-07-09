(function() {
  var $, GitTimeplotPopup, View, moment, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  moment = require('moment');

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View;

  module.exports = GitTimeplotPopup = (function(superClass) {
    extend(GitTimeplotPopup, superClass);

    function GitTimeplotPopup() {
      this._onRevisionClick = bind(this._onRevisionClick, this);
      this._onMouseLeave = bind(this._onMouseLeave, this);
      this._onMouseEnter = bind(this._onMouseEnter, this);
      this.isMouseInPopup = bind(this.isMouseInPopup, this);
      this.remove = bind(this.remove, this);
      this.hide = bind(this.hide, this);
      return GitTimeplotPopup.__super__.constructor.apply(this, arguments);
    }

    GitTimeplotPopup.content = function(commitData, start, end) {
      var commitSuffix, commitVerb, dateFormat;
      dateFormat = "MMM DD YYYY ha";
      commitVerb = commitData.length > 0 ? "were" : "was";
      commitSuffix = commitData.length > 0 ? "s" : "";
      return this.div({
        "class": "select-list popover-list git-timemachine-popup"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'rev-scroller'
          }, function() {
            _this.h5("There " + commitVerb + " " + commitData.length + " commit" + commitSuffix + " between");
            _this.h6((start.format(dateFormat)) + " and " + (end.format(dateFormat)));
            return _this.ul(function() {
              var authorDate, commit, i, len, linesAdded, linesDeleted, results;
              results = [];
              for (i = 0, len = commitData.length; i < len; i++) {
                commit = commitData[i];
                authorDate = moment.unix(commit.authorDate);
                linesAdded = commit.linesAdded || 0;
                linesDeleted = commit.linesDeleted || 0;
                results.push(_this.li({
                  "data-rev": commit.id,
                  click: '_onRevisionClick'
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
                }));
              }
              return results;
            });
          });
          return _this.div({
            "class": 'helper-text'
          }, function() {
            _this.div({
              "class": 'click-help'
            }, function() {
              _this.b("click");
              return _this.span(" to select left revision");
            });
            return _this.div({
              "class": 'shift-click-help'
            }, function() {
              _this.b("shift+click");
              return _this.span(" to select right revision");
            });
          });
        };
      })(this));
    };

    GitTimeplotPopup.prototype.initialize = function(commitData, start, end, onViewRevision) {
      this.onViewRevision = onViewRevision;
      this.appendTo(atom.views.getView(atom.workspace));
      this.mouseenter(this._onMouseEnter);
      return this.mouseleave(this._onMouseLeave);
    };

    GitTimeplotPopup.prototype.hide = function() {
      this._mouseInPopup = false;
      return GitTimeplotPopup.__super__.hide.apply(this, arguments);
    };

    GitTimeplotPopup.prototype.remove = function() {
      if (!this._mouseInPopup) {
        return GitTimeplotPopup.__super__.remove.apply(this, arguments);
      }
    };

    GitTimeplotPopup.prototype.isMouseInPopup = function() {
      return this._mouseInPopup === true;
    };

    GitTimeplotPopup.prototype._onMouseEnter = function(evt) {
      this._mouseInPopup = true;
    };

    GitTimeplotPopup.prototype._onMouseLeave = function(evt) {
      this.hide();
    };

    GitTimeplotPopup.prototype._onRevisionClick = function(evt) {
      var revHash;
      revHash = $(evt.target).closest('li').data('rev');
      return this.onViewRevision(revHash, evt.shiftKey);
    };

    return GitTimeplotPopup;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWVwbG90LXBvcHVwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQTs7OztFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFDVCxNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7Ozs7Ozs7O0lBRXJCLGdCQUFDLENBQUEsT0FBRCxHQUFXLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsR0FBcEI7QUFDVCxVQUFBO01BQUEsVUFBQSxHQUFhO01BQ2IsVUFBQSxHQUFnQixVQUFVLENBQUMsTUFBWCxHQUFvQixDQUF2QixHQUE4QixNQUE5QixHQUEwQztNQUN2RCxZQUFBLEdBQWtCLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQXZCLEdBQThCLEdBQTlCLEdBQXVDO2FBQ3RELElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdEQUFQO09BQUwsRUFBOEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQzVELEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7V0FBTCxFQUE0QixTQUFBO1lBQzFCLEtBQUMsQ0FBQSxFQUFELENBQUksUUFBQSxHQUFTLFVBQVQsR0FBb0IsR0FBcEIsR0FBdUIsVUFBVSxDQUFDLE1BQWxDLEdBQXlDLFNBQXpDLEdBQWtELFlBQWxELEdBQStELFVBQW5FO1lBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBTSxDQUFDLEtBQUssQ0FBQyxNQUFOLENBQWEsVUFBYixDQUFELENBQUEsR0FBMEIsT0FBMUIsR0FBZ0MsQ0FBQyxHQUFHLENBQUMsTUFBSixDQUFXLFVBQVgsQ0FBRCxD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QSxTQUFBO0lBRkk7OytCQUtOLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBQSxDQUFPLElBQUMsQ0FBQSxhQUFSO2VBQ0UsOENBQUEsU0FBQSxFQURGOztJQURNOzsrQkFLUixjQUFBLEdBQWdCLFNBQUE7QUFDZCxhQUFPLElBQUMsQ0FBQSxhQUFELEtBQWtCO0lBRFg7OytCQUloQixhQUFBLEdBQWUsU0FBQyxHQUFEO01BRWIsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFGSjs7K0JBTWYsYUFBQSxHQUFlLFNBQUMsR0FBRDtNQUNiLElBQUMsQ0FBQSxJQUFELENBQUE7SUFEYTs7K0JBS2YsZ0JBQUEsR0FBa0IsU0FBQyxHQUFEO0FBQ2hCLFVBQUE7TUFBQSxPQUFBLEdBQVUsQ0FBQSxDQUFFLEdBQUcsQ0FBQyxNQUFOLENBQWEsQ0FBQyxPQUFkLENBQXNCLElBQXRCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsS0FBakM7YUFDVixJQUFDLENBQUEsY0FBRCxDQUFnQixPQUFoQixFQUF5QixHQUFHLENBQUMsUUFBN0I7SUFGZ0I7Ozs7S0FyRTRCO0FBSGhEIiwic291cmNlc0NvbnRlbnQiOlsibW9tZW50ID0gcmVxdWlyZSAnbW9tZW50J1xueyQsIFZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHaXRUaW1lcGxvdFBvcHVwIGV4dGVuZHMgVmlld1xuXG4gIEBjb250ZW50ID0gKGNvbW1pdERhdGEsIHN0YXJ0LCBlbmQpIC0+XG4gICAgZGF0ZUZvcm1hdCA9IFwiTU1NIEREIFlZWVkgaGFcIlxuICAgIGNvbW1pdFZlcmIgPSBpZiBjb21taXREYXRhLmxlbmd0aCA+IDAgdGhlbiBcIndlcmVcIiBlbHNlIFwid2FzXCJcbiAgICBjb21taXRTdWZmaXggPSBpZiBjb21taXREYXRhLmxlbmd0aCA+IDAgdGhlbiBcInNcIiBlbHNlIFwiXCJcbiAgICBAZGl2IGNsYXNzOiBcInNlbGVjdC1saXN0IHBvcG92ZXItbGlzdCBnaXQtdGltZW1hY2hpbmUtcG9wdXBcIiwgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdyZXYtc2Nyb2xsZXInLCA9PlxuICAgICAgICBAaDUgXCJUaGVyZSAje2NvbW1pdFZlcmJ9ICN7Y29tbWl0RGF0YS5sZW5ndGh9IGNvbW1pdCN7Y29tbWl0U3VmZml4fSBiZXR3ZWVuXCJcbiAgICAgICAgQGg2IFwiI3tzdGFydC5mb3JtYXQoZGF0ZUZvcm1hdCl9IGFuZCAje2VuZC5mb3JtYXQoZGF0ZUZvcm1hdCl9XCJcbiAgICAgICAgQHVsID0+XG4gICAgICAgICAgZm9yIGNvbW1pdCBpbiBjb21taXREYXRhXG4gICAgICAgICAgICBhdXRob3JEYXRlID0gbW9tZW50LnVuaXgoY29tbWl0LmF1dGhvckRhdGUpXG4gICAgICAgICAgICBsaW5lc0FkZGVkID0gY29tbWl0LmxpbmVzQWRkZWQgfHwgMFxuICAgICAgICAgICAgbGluZXNEZWxldGVkID0gY29tbWl0LmxpbmVzRGVsZXRlZCB8fCAwXG4gICAgICAgICAgICBAbGkgXCJkYXRhLXJldlwiOiBjb21taXQuaWQsIGNsaWNrOiAnX29uUmV2aXNpb25DbGljaycsID0+XG4gICAgICAgICAgICAgIEBkaXYgY2xhc3M6IFwiY29tbWl0XCIsID0+XG4gICAgICAgICAgICAgICAgQGRpdiBjbGFzczogXCJoZWFkZXJcIiwgPT5cbiAgICAgICAgICAgICAgICAgIEBkaXYgXCIje2F1dGhvckRhdGUuZm9ybWF0KGRhdGVGb3JtYXQpfVwiXG4gICAgICAgICAgICAgICAgICBAZGl2IFwiI3tjb21taXQuaGFzaH1cIlxuICAgICAgICAgICAgICAgICAgQGRpdiA9PlxuICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ2FkZGVkLWNvdW50JywgXCIrI3tsaW5lc0FkZGVkfSBcIlxuICAgICAgICAgICAgICAgICAgICBAc3BhbiBjbGFzczogJ3JlbW92ZWQtY291bnQnLCBcIi0je2xpbmVzRGVsZXRlZH0gXCJcblxuICAgICAgICAgICAgICAgIEBkaXYgPT5cbiAgICAgICAgICAgICAgICAgIEBzdHJvbmcgXCIje2NvbW1pdC5tZXNzYWdlfVwiXG5cbiAgICAgICAgICAgICAgICBAZGl2IFwiQXV0aG9yZWQgYnkgI3tjb21taXQuYXV0aG9yTmFtZX0gI3thdXRob3JEYXRlLmZyb21Ob3coKX1cIlxuICAgICAgQGRpdiBjbGFzczogJ2hlbHBlci10ZXh0JywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2NsaWNrLWhlbHAnLCA9PlxuICAgICAgICAgIEBiIFwiY2xpY2tcIlxuICAgICAgICAgIEBzcGFuIFwiIHRvIHNlbGVjdCBsZWZ0IHJldmlzaW9uXCJcbiAgICAgICAgXG4gICAgICAgIEBkaXYgY2xhc3M6ICdzaGlmdC1jbGljay1oZWxwJywgPT5cbiAgICAgICAgICBAYiBcInNoaWZ0K2NsaWNrXCJcbiAgICAgICAgICBAc3BhbiBcIiB0byBzZWxlY3QgcmlnaHQgcmV2aXNpb25cIlxuICAgICAgICBcblxuICBpbml0aWFsaXplOiAoY29tbWl0RGF0YSwgc3RhcnQsIGVuZCwgQG9uVmlld1JldmlzaW9uKSAtPlxuICAgIEBhcHBlbmRUbyBhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2VcbiAgICBAbW91c2VlbnRlciBAX29uTW91c2VFbnRlclxuICAgIEBtb3VzZWxlYXZlIEBfb25Nb3VzZUxlYXZlXG5cbiAgICBcbiAgaGlkZTogKCkgPT5cbiAgICBAX21vdXNlSW5Qb3B1cCA9IGZhbHNlXG4gICAgc3VwZXJcblxuXG4gIHJlbW92ZTogKCkgPT5cbiAgICB1bmxlc3MgQF9tb3VzZUluUG9wdXBcbiAgICAgIHN1cGVyXG5cblxuICBpc01vdXNlSW5Qb3B1cDogKCkgPT5cbiAgICByZXR1cm4gQF9tb3VzZUluUG9wdXAgPT0gdHJ1ZVxuXG5cbiAgX29uTW91c2VFbnRlcjogKGV2dCkgPT5cbiAgICAjIGNvbnNvbGUubG9nICdtb3VzZSBpbiBwb3B1cCdcbiAgICBAX21vdXNlSW5Qb3B1cCA9IHRydWVcbiAgICByZXR1cm5cblxuXG4gIF9vbk1vdXNlTGVhdmU6IChldnQpID0+XG4gICAgQGhpZGUoKVxuICAgIHJldHVyblxuXG5cbiAgX29uUmV2aXNpb25DbGljazogKGV2dCkgPT5cbiAgICByZXZIYXNoID0gJChldnQudGFyZ2V0KS5jbG9zZXN0KCdsaScpLmRhdGEoJ3JldicpXG4gICAgQG9uVmlld1JldmlzaW9uKHJldkhhc2gsIGV2dC5zaGlmdEtleSlcbiJdfQ==
