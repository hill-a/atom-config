(function() {
  var $, GitLog, GitRevisionView, GitTimeMachineView, GitTimeplot, HzScroller, NOT_GIT_ERRORS, View, _, moment, path, ref, str,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View;

  path = require('path');

  _ = require('underscore-plus');

  str = require('bumble-strings');

  moment = require('moment');

  GitLog = require('git-log-utils');

  GitTimeplot = require('./git-timeplot');

  GitRevisionView = require('./git-revision-view');

  HzScroller = require('./hz-scroller');

  NOT_GIT_ERRORS = ['File not a git repository', 'is outside repository', "Not a git repository"];

  module.exports = GitTimeMachineView = (function() {
    GitTimeMachineView.prototype.zoomOptions = [
      {
        label: "1x",
        value: 1
      }, {
        label: "1.5x",
        value: 1.5
      }, {
        label: "2x",
        value: 2
      }, {
        label: "3x",
        value: 3
      }, {
        label: "5x",
        value: 5
      }, {
        label: "8x",
        value: 8
      }
    ];

    GitTimeMachineView.prototype.zoom = 1;

    function GitTimeMachineView(serializedState, options) {
      if (options == null) {
        options = {};
      }
      this._onRevisionClose = bind(this._onRevisionClose, this);
      this._onEditorResize = bind(this._onEditorResize, this);
      this._onViewRevision = bind(this._onViewRevision, this);
      this._onZoomChange = bind(this._onZoomChange, this);
      if (!this.$element) {
        this.$element = $("<div class='git-time-machine'>");
      }
      if (options.editor != null) {
        this.setEditor(options.editor);
        this.render();
      }
      this._bindWindowEvents();
    }

    GitTimeMachineView.prototype.setEditor = function(editor) {
      var file;
      if ((editor == null) || editor === this.lastActivatedEditor || GitRevisionView.isActivating()) {
        return;
      }
      file = editor.getPath();
      if (file == null) {
        return;
      }
      this.lastActivatedEditor = editor;
      this.render();
      return GitRevisionView.loadExistingRevForEditor(editor);
    };

    GitTimeMachineView.prototype.render = function() {
      var ref1, ref2, scrollLeft;
      this.commits = this.gitCommitHistory();
      scrollLeft = (ref1 = (ref2 = this.scroller) != null ? ref2.getScrollLeft() : void 0) != null ? ref1 : 0;
      if (this.commits == null) {
        this._renderPlaceholder();
      } else {
        this.$element.text("");
        this._renderCloseHandle();
        this._renderTimeplot(this.commits, scrollLeft);
        this._renderZoomSelector();
        this._renderStats(this.commits);
      }
      return this.$element;
    };

    GitTimeMachineView.prototype.serialize = function() {
      return null;
    };

    GitTimeMachineView.prototype.destroy = function() {
      this._unbindWindowEvents();
      return this.$element.remove();
    };

    GitTimeMachineView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.timeplot) != null ? ref1.hide() : void 0;
    };

    GitTimeMachineView.prototype.show = function() {
      var ref1;
      return (ref1 = this.timeplot) != null ? ref1.show() : void 0;
    };

    GitTimeMachineView.prototype.getElement = function() {
      return this.$element.get(0);
    };

    GitTimeMachineView.prototype.gitCommitHistory = function(editor) {
      var commits, e, file, ref1;
      if (editor == null) {
        editor = this.lastActivatedEditor;
      }
      if (editor == null) {
        return null;
      }
      if (((ref1 = editor.__gitTimeMachine) != null ? ref1.sourceEditor : void 0) != null) {
        editor = editor.__gitTimeMachine.sourceEditor;
      }
      file = editor != null ? editor.getPath() : void 0;
      if (file == null) {
        return null;
      }
      try {
        commits = GitLog.getCommitHistory(file);
      } catch (error) {
        e = error;
        if (e.message != null) {
          if (str.weaklyHas(e.message, NOT_GIT_ERRORS)) {
            console.warn(file + " not in a git repository");
            return null;
          }
        }
        atom.notifications.addError(String(e));
        console.error(e);
        return null;
      }
      return commits;
    };

    GitTimeMachineView.prototype._bindWindowEvents = function() {
      return $(window).on('resize', this._onEditorResize);
    };

    GitTimeMachineView.prototype._unbindWindowEvents = function() {
      return $(window).off('resize', this._onEditorResize);
    };

    GitTimeMachineView.prototype._renderPlaceholder = function() {
      this.$element.html("<div class='placeholder'>Select a file in the git repo to see timeline</div>");
    };

    GitTimeMachineView.prototype._renderCloseHandle = function() {
      var $closeHandle;
      $closeHandle = $("<i class='close-handle icon icon-x clickable'></i>");
      this.$element.append($closeHandle);
      $closeHandle.on('mousedown', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        return atom.commands.dispatch(atom.views.getView(atom.workspace), "git-time-machine:toggle");
      });
      return atom.tooltips.add($closeHandle, {
        title: "Close Panel",
        delay: 0
      });
    };

    GitTimeMachineView.prototype._renderTimeplot = function(commits, scrollLeft) {
      var leftRevHash, ref1, ref2, ref3, ref4, rightRevHash;
      this.scroller = new HzScroller(this.$element);
      this.timeplot = new GitTimeplot(this.scroller.$element);
      this.timeplot.render(commits, this.zoom, this._onViewRevision);
      this.scroller.render(scrollLeft);
      leftRevHash = null;
      rightRevHash = null;
      if (this.lastActivatedEditor.__gitTimeMachine != null) {
        leftRevHash = (ref1 = this.lastActivatedEditor.__gitTimeMachine.revisions) != null ? (ref2 = ref1[0]) != null ? ref2.revHash : void 0 : void 0;
        rightRevHash = (ref3 = this.lastActivatedEditor.__gitTimeMachine.revisions) != null ? (ref4 = ref3[1]) != null ? ref4.revHash : void 0 : void 0;
      }
      this.timeplot.setRevisions(leftRevHash, rightRevHash);
    };

    GitTimeMachineView.prototype._renderStats = function(commits) {
      var authorCount, byAuthor, content, durationInMs, timeSpan;
      content = "";
      if (commits.length > 0) {
        byAuthor = _.indexBy(commits, 'authorName');
        authorCount = _.keys(byAuthor).length;
        durationInMs = moment.unix(commits[commits.length - 1].authorDate).diff(moment.unix(commits[0].authorDate));
        timeSpan = moment.duration(durationInMs).humanize();
        content = "<span class='total-commits'>" + commits.length + "</span> commits by " + authorCount + " authors spanning " + timeSpan;
      }
      this.$element.append("<div class='stats'>\n  " + content + "\n</div>");
    };

    GitTimeMachineView.prototype._renderZoomSelector = function() {
      var $div, $label, $option, $select, i, len, option, ref1;
      $div = $("<div  class='gtm-zoom-selector'>");
      $label = $("<label>zoom: </label>");
      $select = $("<select>");
      $div.append($label);
      $div.append($select);
      ref1 = this.zoomOptions;
      for (i = 0, len = ref1.length; i < len; i++) {
        option = ref1[i];
        $option = $("<option>" + option.label + "</option>");
        if (option.value === this.zoom) {
          $option.attr('selected', true);
        }
        $select.append($option);
      }
      $select.on("change.gtmZoom", this._onZoomChange);
      return this.$element.append($div);
    };

    GitTimeMachineView.prototype._onZoomChange = function(evt) {
      this.zoom = this.zoomOptions[evt.target.selectedIndex].value;
      return this.render();
    };

    GitTimeMachineView.prototype._onViewRevision = function(revHash, reverse) {
      var leftRevHash, ref1, ref2, ref3, ref4, ref5, ref6, ref7, rightRevHash;
      leftRevHash = null;
      rightRevHash = null;
      if (this.lastActivatedEditor.__gitTimeMachine != null) {
        leftRevHash = (ref1 = (ref2 = this.lastActivatedEditor.__gitTimeMachine.revisions) != null ? (ref3 = ref2[0]) != null ? ref3.revHash : void 0 : void 0) != null ? ref1 : null;
        rightRevHash = (ref4 = (ref5 = this.lastActivatedEditor.__gitTimeMachine.revisions) != null ? (ref6 = ref5[1]) != null ? ref6.revHash : void 0 : void 0) != null ? ref4 : null;
      }
      if (reverse) {
        rightRevHash = revHash;
      } else {
        leftRevHash = revHash;
      }
      ref7 = this._orderRevHashes(leftRevHash, rightRevHash), leftRevHash = ref7[0], rightRevHash = ref7[1];
      GitRevisionView.showRevision(this.lastActivatedEditor, leftRevHash, rightRevHash, this._onRevisionClose);
      return this.timeplot.setRevisions(leftRevHash, rightRevHash);
    };

    GitTimeMachineView.prototype._onEditorResize = function() {
      return this.render();
    };

    GitTimeMachineView.prototype._onRevisionClose = function() {
      var leftRevHash, rightRevHash;
      rightRevHash = leftRevHash = null;
      return this.timeplot.setRevisions(leftRevHash, rightRevHash);
    };

    GitTimeMachineView.prototype._orderRevHashes = function(revHashA, revHashB) {
      var i, len, orderedRevs, ref1, ref2, ref3, ref4, rev, unorderedRevs;
      unorderedRevs = [revHashA, revHashB];
      if (!(((ref1 = this.commits) != null ? ref1.length : void 0) > 0)) {
        return unorderedRevs;
      }
      orderedRevs = [];
      ref2 = this.commits;
      for (i = 0, len = ref2.length; i < len; i++) {
        rev = ref2[i];
        if ((ref3 = rev.id, indexOf.call(unorderedRevs, ref3) >= 0) || (ref4 = rev.hash, indexOf.call(unorderedRevs, ref4) >= 0)) {
          orderedRevs.push(rev.hash);
          if (orderedRevs.length >= 2) {
            break;
          }
        }
      }
      return orderedRevs.reverse();
    };

    return GitTimeMachineView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWUtbWFjaGluZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0hBQUE7SUFBQTs7O0VBQUEsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUQsRUFBSTs7RUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSOztFQUNOLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFFVCxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7RUFDZCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUjs7RUFDbEIsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUViLGNBQUEsR0FBaUIsQ0FBQywyQkFBRCxFQUE4Qix1QkFBOUIsRUFBdUQsc0JBQXZEOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUF1QjtpQ0FFckIsV0FBQSxHQUFhO01BQ1g7UUFDRSxLQUFBLEVBQU8sSUFEVDtRQUVFLEtBQUEsRUFBTyxDQUZUO09BRFcsRUFJVDtRQUNBLEtBQUEsRUFBTyxNQURQO1FBRUEsS0FBQSxFQUFPLEdBRlA7T0FKUyxFQU9UO1FBQ0EsS0FBQSxFQUFPLElBRFA7UUFFQSxLQUFBLEVBQU8sQ0FGUDtPQVBTLEVBVVQ7UUFDQSxLQUFBLEVBQU8sSUFEUDtRQUVBLEtBQUEsRUFBTyxDQUZQO09BVlMsRUFhVDtRQUNBLEtBQUEsRUFBTyxJQURQO1FBRUEsS0FBQSxFQUFPLENBRlA7T0FiUyxFQWdCVDtRQUNBLEtBQUEsRUFBTyxJQURQO1FBRUEsS0FBQSxFQUFPLENBRlA7T0FoQlM7OztpQ0FxQmIsSUFBQSxHQUFNOztJQUVPLDRCQUFDLGVBQUQsRUFBa0IsT0FBbEI7O1FBQWtCLFVBQVE7Ozs7OztNQUNyQyxJQUFBLENBQXVELElBQUMsQ0FBQSxRQUF4RDtRQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQSxDQUFFLGdDQUFGLEVBQVo7O01BQ0EsSUFBRyxzQkFBSDtRQUNFLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBTyxDQUFDLE1BQW5CO1FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUZGOztNQUlBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBTlc7O2lDQVNiLFNBQUEsR0FBVyxTQUFDLE1BQUQ7QUFDVCxVQUFBO01BQUEsSUFBVyxnQkFBRCxJQUFZLE1BQUEsS0FBVSxJQUFDLENBQUEsbUJBQXZCLElBQThDLGVBQWUsQ0FBQyxZQUFoQixDQUFBLENBQXhEO0FBQUEsZUFBQTs7TUFFQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNQLElBQWMsWUFBZDtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLG1CQUFELEdBQXVCO01BQ3ZCLElBQUMsQ0FBQSxNQUFELENBQUE7YUFDQSxlQUFlLENBQUMsd0JBQWhCLENBQXlDLE1BQXpDO0lBUlM7O2lDQVdYLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGdCQUFELENBQUE7TUFDWCxVQUFBLDRGQUEwQztNQUUxQyxJQUFPLG9CQUFQO1FBQ0UsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxFQUFmO1FBQ0EsSUFBQyxDQUFBLGtCQUFELENBQUE7UUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFDLENBQUEsT0FBbEIsRUFBMkIsVUFBM0I7UUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtRQUNBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE9BQWYsRUFQRjs7QUFTQSxhQUFPLElBQUMsQ0FBQTtJQWJGOztpQ0FpQlIsU0FBQSxHQUFXLFNBQUE7QUFDVCxhQUFPO0lBREU7O2lDQUtYLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLG1CQUFELENBQUE7YUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBQTtJQUZPOztpQ0FLVCxJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7a0RBQVMsQ0FBRSxJQUFYLENBQUE7SUFESTs7aUNBSU4sSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO2tEQUFTLENBQUUsSUFBWCxDQUFBO0lBREk7O2lDQUlOLFVBQUEsR0FBWSxTQUFBO0FBQ1YsYUFBTyxJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxDQUFkO0lBREc7O2lDQUlaLGdCQUFBLEdBQWtCLFNBQUMsTUFBRDtBQUNoQixVQUFBOztRQURpQixTQUFPLElBQUMsQ0FBQTs7TUFDekIsSUFBbUIsY0FBbkI7QUFBQSxlQUFPLEtBQVA7O01BQ0EsSUFBRywrRUFBSDtRQUNFLE1BQUEsR0FBUyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFEbkM7O01BR0EsSUFBQSxvQkFBTyxNQUFNLENBQUUsT0FBUixDQUFBO01BQ1AsSUFBbUIsWUFBbkI7QUFBQSxlQUFPLEtBQVA7O0FBRUE7UUFDRSxPQUFBLEdBQVUsTUFBTSxDQUFDLGdCQUFQLENBQXdCLElBQXhCLEVBRFo7T0FBQSxhQUFBO1FBRU07UUFDSixJQUFHLGlCQUFIO1VBQ0UsSUFBRyxHQUFHLENBQUMsU0FBSixDQUFjLENBQUMsQ0FBQyxPQUFoQixFQUF5QixjQUF6QixDQUFIO1lBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBZ0IsSUFBRCxHQUFNLDBCQUFyQjtBQUNBLG1CQUFPLEtBRlQ7V0FERjs7UUFLQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLE1BQUEsQ0FBTyxDQUFQLENBQTVCO1FBQ0EsT0FBTyxDQUFDLEtBQVIsQ0FBYyxDQUFkO0FBQ0EsZUFBTyxLQVZUOztBQVlBLGFBQU87SUFwQlM7O2lDQXVCbEIsaUJBQUEsR0FBbUIsU0FBQTthQUNqQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsRUFBVixDQUFhLFFBQWIsRUFBdUIsSUFBQyxDQUFBLGVBQXhCO0lBRGlCOztpQ0FJbkIsbUJBQUEsR0FBcUIsU0FBQTthQUNuQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsR0FBVixDQUFjLFFBQWQsRUFBd0IsSUFBQyxDQUFBLGVBQXpCO0lBRG1COztpQ0FJckIsa0JBQUEsR0FBb0IsU0FBQTtNQUNsQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSw4RUFBZjtJQURrQjs7aUNBS3BCLGtCQUFBLEdBQW9CLFNBQUE7QUFDbEIsVUFBQTtNQUFBLFlBQUEsR0FBZSxDQUFBLENBQUUsb0RBQUY7TUFDZixJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBaUIsWUFBakI7TUFDQSxZQUFZLENBQUMsRUFBYixDQUFnQixXQUFoQixFQUE2QixTQUFDLENBQUQ7UUFDM0IsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtRQUNBLENBQUMsQ0FBQyx3QkFBRixDQUFBO1FBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQTtlQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQXZCLEVBQTJELHlCQUEzRDtNQUwyQixDQUE3QjthQU1BLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixZQUFsQixFQUFnQztRQUFFLEtBQUEsRUFBTyxhQUFUO1FBQXdCLEtBQUEsRUFBTyxDQUEvQjtPQUFoQztJQVRrQjs7aUNBWXBCLGVBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsVUFBVjtBQUNmLFVBQUE7TUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxRQUFoQjtNQUNaLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxXQUFKLENBQWdCLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBMUI7TUFDWixJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBaUIsT0FBakIsRUFBMEIsSUFBQyxDQUFBLElBQTNCLEVBQWlDLElBQUMsQ0FBQSxlQUFsQztNQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixVQUFqQjtNQUdBLFdBQUEsR0FBYztNQUNkLFlBQUEsR0FBZTtNQUVmLElBQUcsaURBQUg7UUFDRSxXQUFBLHlHQUFpRSxDQUFFO1FBQ25FLFlBQUEseUdBQWtFLENBQUUsMEJBRnRFOztNQUlBLElBQUMsQ0FBQSxRQUFRLENBQUMsWUFBVixDQUF1QixXQUF2QixFQUFvQyxZQUFwQztJQWRlOztpQ0FtQmpCLFlBQUEsR0FBYyxTQUFDLE9BQUQ7QUFDWixVQUFBO01BQUEsT0FBQSxHQUFVO01BQ1YsSUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFwQjtRQUNFLFFBQUEsR0FBVyxDQUFDLENBQUMsT0FBRixDQUFVLE9BQVYsRUFBbUIsWUFBbkI7UUFDWCxXQUFBLEdBQWMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxRQUFQLENBQWdCLENBQUM7UUFDL0IsWUFBQSxHQUFlLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBUSxDQUFBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQWpCLENBQW1CLENBQUMsVUFBeEMsQ0FBbUQsQ0FBQyxJQUFwRCxDQUF5RCxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxVQUF2QixDQUF6RDtRQUNmLFFBQUEsR0FBVyxNQUFNLENBQUMsUUFBUCxDQUFnQixZQUFoQixDQUE2QixDQUFDLFFBQTlCLENBQUE7UUFDWCxPQUFBLEdBQVUsOEJBQUEsR0FBK0IsT0FBTyxDQUFDLE1BQXZDLEdBQThDLHFCQUE5QyxHQUFtRSxXQUFuRSxHQUErRSxvQkFBL0UsR0FBbUcsU0FML0c7O01BTUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLHlCQUFBLEdBRVgsT0FGVyxHQUVILFVBRmQ7SUFSWTs7aUNBZ0JkLG1CQUFBLEdBQXFCLFNBQUE7QUFDbkIsVUFBQTtNQUFBLElBQUEsR0FBTyxDQUFBLENBQUUsa0NBQUY7TUFDUCxNQUFBLEdBQVMsQ0FBQSxDQUFFLHVCQUFGO01BQ1QsT0FBQSxHQUFVLENBQUEsQ0FBRSxVQUFGO01BQ1YsSUFBSSxDQUFDLE1BQUwsQ0FBWSxNQUFaO01BQ0EsSUFBSSxDQUFDLE1BQUwsQ0FBWSxPQUFaO0FBRUE7QUFBQSxXQUFBLHNDQUFBOztRQUNFLE9BQUEsR0FBVSxDQUFBLENBQUUsVUFBQSxHQUFXLE1BQU0sQ0FBQyxLQUFsQixHQUF3QixXQUExQjtRQUNWLElBQWtDLE1BQU0sQ0FBQyxLQUFQLEtBQWdCLElBQUMsQ0FBQSxJQUFuRDtVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsVUFBYixFQUF5QixJQUF6QixFQUFBOztRQUNBLE9BQU8sQ0FBQyxNQUFSLENBQWUsT0FBZjtBQUhGO01BS0EsT0FBTyxDQUFDLEVBQVIsQ0FBVyxnQkFBWCxFQUE2QixJQUFDLENBQUEsYUFBOUI7YUFFQSxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBaUIsSUFBakI7SUFkbUI7O2lDQWlCckIsYUFBQSxHQUFlLFNBQUMsR0FBRDtNQUNiLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFdBQVksQ0FBQSxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQVgsQ0FBeUIsQ0FBQzthQUMvQyxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRmE7O2lDQUtmLGVBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsT0FBVjtBQUNmLFVBQUE7TUFBQSxXQUFBLEdBQWM7TUFDZCxZQUFBLEdBQWU7TUFFZixJQUFHLGlEQUFIO1FBQ0UsV0FBQSw4SkFBNkU7UUFDN0UsWUFBQSw4SkFBOEUsS0FGaEY7O01BSUEsSUFBRyxPQUFIO1FBQ0UsWUFBQSxHQUFlLFFBRGpCO09BQUEsTUFBQTtRQUdFLFdBQUEsR0FBYyxRQUhoQjs7TUFNQSxPQUE4QixJQUFDLENBQUEsZUFBRCxDQUFpQixXQUFqQixFQUE4QixZQUE5QixDQUE5QixFQUFDLHFCQUFELEVBQWM7TUFFZCxlQUFlLENBQUMsWUFBaEIsQ0FBNkIsSUFBQyxDQUFBLG1CQUE5QixFQUFtRCxXQUFuRCxFQUFnRSxZQUFoRSxFQUE4RSxJQUFDLENBQUEsZ0JBQS9FO2FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQXVCLFdBQXZCLEVBQW9DLFlBQXBDO0lBakJlOztpQ0FvQmpCLGVBQUEsR0FBaUIsU0FBQTthQUNmLElBQUMsQ0FBQSxNQUFELENBQUE7SUFEZTs7aUNBSWpCLGdCQUFBLEdBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLFlBQUEsR0FBZSxXQUFBLEdBQWM7YUFDN0IsSUFBQyxDQUFBLFFBQVEsQ0FBQyxZQUFWLENBQXVCLFdBQXZCLEVBQW9DLFlBQXBDO0lBRmdCOztpQ0FNbEIsZUFBQSxHQUFpQixTQUFDLFFBQUQsRUFBVyxRQUFYO0FBQ2YsVUFBQTtNQUFBLGFBQUEsR0FBZ0IsQ0FBQyxRQUFELEVBQVcsUUFBWDtNQUNoQixJQUFBLENBQUEsc0NBQW9DLENBQUUsZ0JBQVYsR0FBbUIsQ0FBL0MsQ0FBQTtBQUFBLGVBQU8sY0FBUDs7TUFFQSxXQUFBLEdBQWM7QUFDZDtBQUFBLFdBQUEsc0NBQUE7O1FBQ0UsSUFBRyxRQUFBLEdBQUcsQ0FBQyxFQUFKLEVBQUEsYUFBVSxhQUFWLEVBQUEsSUFBQSxNQUFBLENBQUEsSUFBMkIsUUFBQSxHQUFHLENBQUMsSUFBSixFQUFBLGFBQVksYUFBWixFQUFBLElBQUEsTUFBQSxDQUE5QjtVQUNFLFdBQVcsQ0FBQyxJQUFaLENBQWlCLEdBQUcsQ0FBQyxJQUFyQjtVQUNBLElBQVMsV0FBVyxDQUFDLE1BQVosSUFBc0IsQ0FBL0I7QUFBQSxrQkFBQTtXQUZGOztBQURGO0FBS0EsYUFBTyxXQUFXLENBQUMsT0FBWixDQUFBO0lBVlE7Ozs7O0FBeE9uQiIsInNvdXJjZXNDb250ZW50IjpbInskLCBWaWV3fSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5fID0gcmVxdWlyZSgndW5kZXJzY29yZS1wbHVzJylcbnN0ciA9IHJlcXVpcmUoJ2J1bWJsZS1zdHJpbmdzJylcbm1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbkdpdExvZyA9IHJlcXVpcmUgJ2dpdC1sb2ctdXRpbHMnXG5HaXRUaW1lcGxvdCA9IHJlcXVpcmUgJy4vZ2l0LXRpbWVwbG90J1xuR2l0UmV2aXNpb25WaWV3ID0gcmVxdWlyZSAnLi9naXQtcmV2aXNpb24tdmlldydcbkh6U2Nyb2xsZXIgPSByZXF1aXJlICcuL2h6LXNjcm9sbGVyJ1xuXG5OT1RfR0lUX0VSUk9SUyA9IFsnRmlsZSBub3QgYSBnaXQgcmVwb3NpdG9yeScsICdpcyBvdXRzaWRlIHJlcG9zaXRvcnknLCBcIk5vdCBhIGdpdCByZXBvc2l0b3J5XCJdXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2l0VGltZU1hY2hpbmVWaWV3XG4gIFxuICB6b29tT3B0aW9uczogW1xuICAgIHtcbiAgICAgIGxhYmVsOiBcIjF4XCIsXG4gICAgICB2YWx1ZTogMVxuICAgIH0se1xuICAgICAgbGFiZWw6IFwiMS41eFwiXG4gICAgICB2YWx1ZTogMS41XG4gICAgfSx7XG4gICAgICBsYWJlbDogXCIyeFwiXG4gICAgICB2YWx1ZTogMlxuICAgIH0se1xuICAgICAgbGFiZWw6IFwiM3hcIlxuICAgICAgdmFsdWU6IDNcbiAgICB9LHtcbiAgICAgIGxhYmVsOiBcIjV4XCJcbiAgICAgIHZhbHVlOiA1XG4gICAgfSx7XG4gICAgICBsYWJlbDogXCI4eFwiXG4gICAgICB2YWx1ZTogOFxuICAgIH1cbiAgXVxuICB6b29tOiAxXG4gIFxuICBjb25zdHJ1Y3RvcjogKHNlcmlhbGl6ZWRTdGF0ZSwgb3B0aW9ucz17fSkgLT5cbiAgICBAJGVsZW1lbnQgPSAkKFwiPGRpdiBjbGFzcz0nZ2l0LXRpbWUtbWFjaGluZSc+XCIpIHVubGVzcyBAJGVsZW1lbnRcbiAgICBpZiBvcHRpb25zLmVkaXRvcj9cbiAgICAgIEBzZXRFZGl0b3Iob3B0aW9ucy5lZGl0b3IpXG4gICAgICBAcmVuZGVyKClcblxuICAgIEBfYmluZFdpbmRvd0V2ZW50cygpXG4gICAgXG5cbiAgc2V0RWRpdG9yOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiBpZiAhZWRpdG9yPyB8fCBlZGl0b3IgPT0gQGxhc3RBY3RpdmF0ZWRFZGl0b3IgfHwgR2l0UmV2aXNpb25WaWV3LmlzQWN0aXZhdGluZygpIFxuICAgICAgXG4gICAgZmlsZSA9IGVkaXRvci5nZXRQYXRoKClcbiAgICByZXR1cm4gdW5sZXNzIGZpbGU/XG4gICAgXG4gICAgQGxhc3RBY3RpdmF0ZWRFZGl0b3IgPSBlZGl0b3JcbiAgICBAcmVuZGVyKClcbiAgICBHaXRSZXZpc2lvblZpZXcubG9hZEV4aXN0aW5nUmV2Rm9yRWRpdG9yKGVkaXRvcilcblxuXG4gIHJlbmRlcjogKCkgLT5cbiAgICBAY29tbWl0cyA9IEBnaXRDb21taXRIaXN0b3J5KClcbiAgICBzY3JvbGxMZWZ0ID0gQHNjcm9sbGVyPy5nZXRTY3JvbGxMZWZ0KCkgPyAwXG5cbiAgICB1bmxlc3MgQGNvbW1pdHM/XG4gICAgICBAX3JlbmRlclBsYWNlaG9sZGVyKClcbiAgICBlbHNlXG4gICAgICBAJGVsZW1lbnQudGV4dChcIlwiKVxuICAgICAgQF9yZW5kZXJDbG9zZUhhbmRsZSgpXG4gICAgICBAX3JlbmRlclRpbWVwbG90KEBjb21taXRzLCBzY3JvbGxMZWZ0KVxuICAgICAgQF9yZW5kZXJab29tU2VsZWN0b3IoKVxuICAgICAgQF9yZW5kZXJTdGF0cyhAY29tbWl0cylcblxuICAgIHJldHVybiBAJGVsZW1lbnRcblxuXG4gICMgUmV0dXJucyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgcmV0cmlldmVkIHdoZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWRcbiAgc2VyaWFsaXplOiAtPlxuICAgIHJldHVybiBudWxsXG5cblxuICAjIFRlYXIgZG93biBhbnkgc3RhdGUgYW5kIGRldGFjaFxuICBkZXN0cm95OiAtPlxuICAgIEBfdW5iaW5kV2luZG93RXZlbnRzKClcbiAgICBAJGVsZW1lbnQucmVtb3ZlKClcblxuXG4gIGhpZGU6IC0+XG4gICAgQHRpbWVwbG90Py5oaWRlKCkgICAjIHNvIGl0IGtub3dzIHRvIGhpZGUgdGhlIHBvcHVwXG5cblxuICBzaG93OiAtPlxuICAgIEB0aW1lcGxvdD8uc2hvdygpXG5cblxuICBnZXRFbGVtZW50OiAtPlxuICAgIHJldHVybiBAJGVsZW1lbnQuZ2V0KDApXG5cblxuICBnaXRDb21taXRIaXN0b3J5OiAoZWRpdG9yPUBsYXN0QWN0aXZhdGVkRWRpdG9yKS0+XG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIGVkaXRvcj9cbiAgICBpZiBlZGl0b3IuX19naXRUaW1lTWFjaGluZT8uc291cmNlRWRpdG9yP1xuICAgICAgZWRpdG9yID0gZWRpdG9yLl9fZ2l0VGltZU1hY2hpbmUuc291cmNlRWRpdG9yXG4gICAgXG4gICAgZmlsZSA9IGVkaXRvcj8uZ2V0UGF0aCgpXG4gICAgcmV0dXJuIG51bGwgdW5sZXNzIGZpbGU/XG4gICAgXG4gICAgdHJ5XG4gICAgICBjb21taXRzID0gR2l0TG9nLmdldENvbW1pdEhpc3RvcnkgZmlsZVxuICAgIGNhdGNoIGVcbiAgICAgIGlmIGUubWVzc2FnZT9cbiAgICAgICAgaWYgc3RyLndlYWtseUhhcyhlLm1lc3NhZ2UsIE5PVF9HSVRfRVJST1JTKVxuICAgICAgICAgIGNvbnNvbGUud2FybiBcIiN7ZmlsZX0gbm90IGluIGEgZ2l0IHJlcG9zaXRvcnlcIlxuICAgICAgICAgIHJldHVybiBudWxsXG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBTdHJpbmcgZVxuICAgICAgY29uc29sZS5lcnJvciBlXG4gICAgICByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIGNvbW1pdHM7XG5cblxuICBfYmluZFdpbmRvd0V2ZW50czogKCkgLT5cbiAgICAkKHdpbmRvdykub24gJ3Jlc2l6ZScsIEBfb25FZGl0b3JSZXNpemVcblxuXG4gIF91bmJpbmRXaW5kb3dFdmVudHM6ICgpIC0+XG4gICAgJCh3aW5kb3cpLm9mZiAncmVzaXplJywgQF9vbkVkaXRvclJlc2l6ZVxuXG5cbiAgX3JlbmRlclBsYWNlaG9sZGVyOiAoKSAtPlxuICAgIEAkZWxlbWVudC5odG1sKFwiPGRpdiBjbGFzcz0ncGxhY2Vob2xkZXInPlNlbGVjdCBhIGZpbGUgaW4gdGhlIGdpdCByZXBvIHRvIHNlZSB0aW1lbGluZTwvZGl2PlwiKVxuICAgIHJldHVyblxuXG5cbiAgX3JlbmRlckNsb3NlSGFuZGxlOiAoKSAtPlxuICAgICRjbG9zZUhhbmRsZSA9ICQoXCI8aSBjbGFzcz0nY2xvc2UtaGFuZGxlIGljb24gaWNvbi14IGNsaWNrYWJsZSc+PC9pPlwiKVxuICAgIEAkZWxlbWVudC5hcHBlbmQgJGNsb3NlSGFuZGxlXG4gICAgJGNsb3NlSGFuZGxlLm9uICdtb3VzZWRvd24nLCAoZSktPlxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAjIHdoeSBub3Q/IGluc3RlYWQgb2YgYWRkaW5nIGNhbGxiYWNrLCBvdXIgb3duIGV2ZW50Li4uXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksIFwiZ2l0LXRpbWUtbWFjaGluZTp0b2dnbGVcIilcbiAgICBhdG9tLnRvb2x0aXBzLmFkZCgkY2xvc2VIYW5kbGUsIHsgdGl0bGU6IFwiQ2xvc2UgUGFuZWxcIiwgZGVsYXk6IDAgfSlcblxuXG4gIF9yZW5kZXJUaW1lcGxvdDogKGNvbW1pdHMsIHNjcm9sbExlZnQpIC0+XG4gICAgQHNjcm9sbGVyID0gbmV3IEh6U2Nyb2xsZXIoQCRlbGVtZW50KVxuICAgIEB0aW1lcGxvdCA9IG5ldyBHaXRUaW1lcGxvdChAc2Nyb2xsZXIuJGVsZW1lbnQpXG4gICAgQHRpbWVwbG90LnJlbmRlcihjb21taXRzLCBAem9vbSwgQF9vblZpZXdSZXZpc2lvbilcbiAgICBAc2Nyb2xsZXIucmVuZGVyKHNjcm9sbExlZnQpXG4gICAgIyBAc2Nyb2xsZXIuc2Nyb2xsRmFyUmlnaHQoKVxuICAgIFxuICAgIGxlZnRSZXZIYXNoID0gbnVsbFxuICAgIHJpZ2h0UmV2SGFzaCA9IG51bGxcbiAgICBcbiAgICBpZiBAbGFzdEFjdGl2YXRlZEVkaXRvci5fX2dpdFRpbWVNYWNoaW5lP1xuICAgICAgbGVmdFJldkhhc2ggPSBAbGFzdEFjdGl2YXRlZEVkaXRvci5fX2dpdFRpbWVNYWNoaW5lLnJldmlzaW9ucz9bMF0/LnJldkhhc2hcbiAgICAgIHJpZ2h0UmV2SGFzaCA9IEBsYXN0QWN0aXZhdGVkRWRpdG9yLl9fZ2l0VGltZU1hY2hpbmUucmV2aXNpb25zP1sxXT8ucmV2SGFzaFxuXG4gICAgQHRpbWVwbG90LnNldFJldmlzaW9ucyhsZWZ0UmV2SGFzaCwgcmlnaHRSZXZIYXNoKSAgICBcbiAgICBcbiAgICByZXR1cm5cblxuXG4gIF9yZW5kZXJTdGF0czogKGNvbW1pdHMpIC0+XG4gICAgY29udGVudCA9IFwiXCJcbiAgICBpZiBjb21taXRzLmxlbmd0aCA+IDBcbiAgICAgIGJ5QXV0aG9yID0gXy5pbmRleEJ5IGNvbW1pdHMsICdhdXRob3JOYW1lJ1xuICAgICAgYXV0aG9yQ291bnQgPSBfLmtleXMoYnlBdXRob3IpLmxlbmd0aFxuICAgICAgZHVyYXRpb25Jbk1zID0gbW9tZW50LnVuaXgoY29tbWl0c1tjb21taXRzLmxlbmd0aCAtIDFdLmF1dGhvckRhdGUpLmRpZmYobW9tZW50LnVuaXgoY29tbWl0c1swXS5hdXRob3JEYXRlKSlcbiAgICAgIHRpbWVTcGFuID0gbW9tZW50LmR1cmF0aW9uKGR1cmF0aW9uSW5NcykuaHVtYW5pemUoKVxuICAgICAgY29udGVudCA9IFwiPHNwYW4gY2xhc3M9J3RvdGFsLWNvbW1pdHMnPiN7Y29tbWl0cy5sZW5ndGh9PC9zcGFuPiBjb21taXRzIGJ5ICN7YXV0aG9yQ291bnR9IGF1dGhvcnMgc3Bhbm5pbmcgI3t0aW1lU3Bhbn1cIlxuICAgIEAkZWxlbWVudC5hcHBlbmQgXCJcIlwiXG4gICAgICA8ZGl2IGNsYXNzPSdzdGF0cyc+XG4gICAgICAgICN7Y29udGVudH1cbiAgICAgIDwvZGl2PlxuICAgIFwiXCJcIlxuICAgIHJldHVyblxuICAgIFxuICAgIFxuICBfcmVuZGVyWm9vbVNlbGVjdG9yOiAoKSAtPlxuICAgICRkaXYgPSAkKFwiPGRpdiAgY2xhc3M9J2d0bS16b29tLXNlbGVjdG9yJz5cIilcbiAgICAkbGFiZWwgPSAkKFwiPGxhYmVsPnpvb206IDwvbGFiZWw+XCIpXG4gICAgJHNlbGVjdCA9ICQoXCI8c2VsZWN0PlwiKVxuICAgICRkaXYuYXBwZW5kKCRsYWJlbClcbiAgICAkZGl2LmFwcGVuZCgkc2VsZWN0KVxuICAgIFxuICAgIGZvciBvcHRpb24gaW4gQHpvb21PcHRpb25zXG4gICAgICAkb3B0aW9uID0gJChcIjxvcHRpb24+I3tvcHRpb24ubGFiZWx9PC9vcHRpb24+XCIpXG4gICAgICAkb3B0aW9uLmF0dHIoJ3NlbGVjdGVkJywgdHJ1ZSkgaWYgb3B0aW9uLnZhbHVlID09IEB6b29tXG4gICAgICAkc2VsZWN0LmFwcGVuZCAkb3B0aW9uXG4gICAgXG4gICAgJHNlbGVjdC5vbiBcImNoYW5nZS5ndG1ab29tXCIsIEBfb25ab29tQ2hhbmdlXG4gICAgXG4gICAgQCRlbGVtZW50LmFwcGVuZCAkZGl2XG5cblxuICBfb25ab29tQ2hhbmdlOiAoZXZ0KSA9PlxuICAgIEB6b29tID0gQHpvb21PcHRpb25zW2V2dC50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWVcbiAgICBAcmVuZGVyKClcbiAgICBcbiAgXG4gIF9vblZpZXdSZXZpc2lvbjogKHJldkhhc2gsIHJldmVyc2UpID0+XG4gICAgbGVmdFJldkhhc2ggPSBudWxsXG4gICAgcmlnaHRSZXZIYXNoID0gbnVsbFxuICAgIFxuICAgIGlmIEBsYXN0QWN0aXZhdGVkRWRpdG9yLl9fZ2l0VGltZU1hY2hpbmU/XG4gICAgICBsZWZ0UmV2SGFzaCA9IEBsYXN0QWN0aXZhdGVkRWRpdG9yLl9fZ2l0VGltZU1hY2hpbmUucmV2aXNpb25zP1swXT8ucmV2SGFzaCA/IG51bGxcbiAgICAgIHJpZ2h0UmV2SGFzaCA9IEBsYXN0QWN0aXZhdGVkRWRpdG9yLl9fZ2l0VGltZU1hY2hpbmUucmV2aXNpb25zP1sxXT8ucmV2SGFzaCA/IG51bGxcbiAgICAgIFxuICAgIGlmIHJldmVyc2VcbiAgICAgIHJpZ2h0UmV2SGFzaCA9IHJldkhhc2hcbiAgICBlbHNlXG4gICAgICBsZWZ0UmV2SGFzaCA9IHJldkhhc2hcbiAgICBcbiAgICAjIG9yZGVyIGJ5IGNyZWF0ZWQgYXNjXG4gICAgW2xlZnRSZXZIYXNoLCByaWdodFJldkhhc2hdID0gQF9vcmRlclJldkhhc2hlcyhsZWZ0UmV2SGFzaCwgcmlnaHRSZXZIYXNoKVxuICAgIFxuICAgIEdpdFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24oQGxhc3RBY3RpdmF0ZWRFZGl0b3IsIGxlZnRSZXZIYXNoLCByaWdodFJldkhhc2gsIEBfb25SZXZpc2lvbkNsb3NlKVxuICAgIEB0aW1lcGxvdC5zZXRSZXZpc2lvbnMobGVmdFJldkhhc2gsIHJpZ2h0UmV2SGFzaClcblxuXG4gIF9vbkVkaXRvclJlc2l6ZTogPT5cbiAgICBAcmVuZGVyKClcbiAgICBcbiAgICBcbiAgX29uUmV2aXNpb25DbG9zZTogPT5cbiAgICByaWdodFJldkhhc2ggPSBsZWZ0UmV2SGFzaCA9IG51bGxcbiAgICBAdGltZXBsb3Quc2V0UmV2aXNpb25zKGxlZnRSZXZIYXNoLCByaWdodFJldkhhc2gpXG5cblxuICAjIGFjY2VwdHMgcmV2SGFzaHMgb3IgY29tbWl0IElEcywgcmV0dXJucyBzb3J0ZWQgYnkgY3JlYXRlZCBhc2NcbiAgX29yZGVyUmV2SGFzaGVzOiAocmV2SGFzaEEsIHJldkhhc2hCKSAtPlxuICAgIHVub3JkZXJlZFJldnMgPSBbcmV2SGFzaEEsIHJldkhhc2hCXVxuICAgIHJldHVybiB1bm9yZGVyZWRSZXZzIHVubGVzcyBAY29tbWl0cz8ubGVuZ3RoID4gMFxuICAgIFxuICAgIG9yZGVyZWRSZXZzID0gW11cbiAgICBmb3IgcmV2IGluIEBjb21taXRzXG4gICAgICBpZiByZXYuaWQgaW4gdW5vcmRlcmVkUmV2cyB8fCByZXYuaGFzaCBpbiB1bm9yZGVyZWRSZXZzXG4gICAgICAgIG9yZGVyZWRSZXZzLnB1c2ggcmV2Lmhhc2hcbiAgICAgICAgYnJlYWsgaWYgb3JkZXJlZFJldnMubGVuZ3RoID49IDJcbiAgICAgICAgXG4gICAgcmV0dXJuIG9yZGVyZWRSZXZzLnJldmVyc2UoKSAgICBcbiAgICBcbiAgICAgIFxuICBcbiJdfQ==
