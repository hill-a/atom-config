(function() {
  var CompositeDisposable, GitTimeMachine, GitTimeMachineView;

  GitTimeMachineView = require('./git-time-machine-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = GitTimeMachine = {
    gitTimeMachineView: null,
    timelinePanel: null,
    subscriptions: null,
    activate: function(state) {
      this.gitTimeMachineView = new GitTimeMachineView(state.gitTimeMachineViewState);
      this.timelinePanel = atom.workspace.addBottomPanel({
        item: this.gitTimeMachineView.getElement(),
        visible: false
      });
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'git-time-machine:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            var ref;
            return ((ref = _this.timelinePanel) != null ? ref.isVisible() : void 0) && _this.toggle();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          return _this._onDidChangeActivePaneItem(editor);
        };
      })(this)));
    },
    deactivate: function() {
      this.timelinePanel.destroy();
      this.subscriptions.dispose();
      return this.gitTimeMachineView.destroy();
    },
    serialize: function() {
      return {
        gitTimeMachineViewState: this.gitTimeMachineView.serialize()
      };
    },
    toggle: function() {
      if (this.timelinePanel.isVisible()) {
        this.gitTimeMachineView.hide();
        return this.timelinePanel.hide();
      } else {
        return require('atom-package-deps').install('git-time-machine').then((function() {
          this.timelinePanel.show();
          this.gitTimeMachineView.show();
          return this.gitTimeMachineView.setEditor(atom.workspace.getActiveTextEditor());
        }).bind(this));
      }
    },
    _onDidChangeActivePaneItem: function(editor) {
      if (this.timelinePanel.isVisible()) {
        editor = atom.workspace.getActiveTextEditor();
        this.gitTimeMachineView.setEditor(editor);
      }
    },
    consumeSplitDiff: function(splitDiffService) {
      return require('./git-revision-view').SplitDiffService = splitDiffService;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWUtbWFjaGluZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDcEIsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUFpQixjQUFBLEdBQ2Y7SUFBQSxrQkFBQSxFQUFvQixJQUFwQjtJQUNBLGFBQUEsRUFBZSxJQURmO0lBRUEsYUFBQSxFQUFlLElBRmY7SUFLQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUksa0JBQUosQ0FBdUIsS0FBSyxDQUFDLHVCQUE3QjtNQUN0QixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEI7UUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLGtCQUFrQixDQUFDLFVBQXBCLENBQUEsQ0FBTjtRQUF3QyxPQUFBLEVBQVMsS0FBakQ7T0FBOUI7TUFHakIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUdyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtRQUFBLHlCQUFBLEVBQTJCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtRQUNBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQU0sZ0JBQUE7NkRBQWMsQ0FBRSxTQUFoQixDQUFBLFdBQUEsSUFBK0IsS0FBQyxDQUFBLE1BQUQsQ0FBQTtVQUFyQztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEZjtPQURpQixDQUFuQjthQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUFZLEtBQUMsQ0FBQSwwQkFBRCxDQUE0QixNQUE1QjtRQUFaO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFuQjtJQVpRLENBTFY7SUFvQkEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE9BQXBCLENBQUE7SUFIVSxDQXBCWjtJQTBCQSxTQUFBLEVBQVcsU0FBQTthQUNUO1FBQUEsdUJBQUEsRUFBeUIsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQUEsQ0FBekI7O0lBRFMsQ0ExQlg7SUE4QkEsTUFBQSxFQUFRLFNBQUE7TUFFTixJQUFHLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBZixDQUFBLENBQUg7UUFDRSxJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFBLEVBRkY7T0FBQSxNQUFBO2VBSUUsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsa0JBQXJDLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQyxTQUFBO1VBQ0wsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQUE7VUFDQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsSUFBcEIsQ0FBQTtpQkFDQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsU0FBcEIsQ0FBOEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQTlCO1FBSEssQ0FBRCxDQUlMLENBQUMsSUFKSSxDQUlDLElBSkQsQ0FEUixFQUpGOztJQUZNLENBOUJSO0lBNENBLDBCQUFBLEVBQTRCLFNBQUMsTUFBRDtNQUMxQixJQUFHLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBZixDQUFBLENBQUg7UUFDRSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1FBQ1QsSUFBQyxDQUFBLGtCQUFrQixDQUFDLFNBQXBCLENBQThCLE1BQTlCLEVBRkY7O0lBRDBCLENBNUM1QjtJQW1EQSxnQkFBQSxFQUFrQixTQUFDLGdCQUFEO2FBQ2hCLE9BQUEsQ0FBUSxxQkFBUixDQUE4QixDQUFDLGdCQUEvQixHQUFrRDtJQURsQyxDQW5EbEI7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJHaXRUaW1lTWFjaGluZVZpZXcgPSByZXF1aXJlICcuL2dpdC10aW1lLW1hY2hpbmUtdmlldydcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gR2l0VGltZU1hY2hpbmUgPVxuICBnaXRUaW1lTWFjaGluZVZpZXc6IG51bGxcbiAgdGltZWxpbmVQYW5lbDogbnVsbFxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBnaXRUaW1lTWFjaGluZVZpZXcgPSBuZXcgR2l0VGltZU1hY2hpbmVWaWV3IHN0YXRlLmdpdFRpbWVNYWNoaW5lVmlld1N0YXRlXG4gICAgQHRpbWVsaW5lUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbChpdGVtOiBAZ2l0VGltZU1hY2hpbmVWaWV3LmdldEVsZW1lbnQoKSwgdmlzaWJsZTogZmFsc2UpXG5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgIyBSZWdpc3RlciBjb21tYW5kIHRoYXQgdG9nZ2xlcyB0aGlzIHZpZXdcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgXG4gICAgICAnZ2l0LXRpbWUtbWFjaGluZTp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcbiAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IEB0aW1lbGluZVBhbmVsPy5pc1Zpc2libGUoKSAmJiBAdG9nZ2xlKClcbiAgICBcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoZWRpdG9yKSA9PiBAX29uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oZWRpdG9yKSlcblxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHRpbWVsaW5lUGFuZWwuZGVzdHJveSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGdpdFRpbWVNYWNoaW5lVmlldy5kZXN0cm95KClcblxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBnaXRUaW1lTWFjaGluZVZpZXdTdGF0ZTogQGdpdFRpbWVNYWNoaW5lVmlldy5zZXJpYWxpemUoKVxuXG5cbiAgdG9nZ2xlOiAtPlxuICAgICMgY29uc29sZS5sb2cgJ0dpdFRpbWVNYWNoaW5lIHdhcyBvcGVuZWQhJ1xuICAgIGlmIEB0aW1lbGluZVBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAZ2l0VGltZU1hY2hpbmVWaWV3LmhpZGUoKVxuICAgICAgQHRpbWVsaW5lUGFuZWwuaGlkZSgpXG4gICAgZWxzZVxuICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdnaXQtdGltZS1tYWNoaW5lJylcbiAgICAgICAgLnRoZW4gKC0+XG4gICAgICAgICAgQHRpbWVsaW5lUGFuZWwuc2hvdygpXG4gICAgICAgICAgQGdpdFRpbWVNYWNoaW5lVmlldy5zaG93KClcbiAgICAgICAgICBAZ2l0VGltZU1hY2hpbmVWaWV3LnNldEVkaXRvciBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgKS5iaW5kKHRoaXMpXG5cblxuICBfb25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbTogKGVkaXRvcikgLT5cbiAgICBpZiBAdGltZWxpbmVQYW5lbC5pc1Zpc2libGUoKVxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBAZ2l0VGltZU1hY2hpbmVWaWV3LnNldEVkaXRvcihlZGl0b3IpXG4gICAgcmV0dXJuXG5cblxuICBjb25zdW1lU3BsaXREaWZmOiAoc3BsaXREaWZmU2VydmljZSkgLT5cbiAgICByZXF1aXJlKCcuL2dpdC1yZXZpc2lvbi12aWV3JykuU3BsaXREaWZmU2VydmljZSA9IHNwbGl0RGlmZlNlcnZpY2VcbiJdfQ==
