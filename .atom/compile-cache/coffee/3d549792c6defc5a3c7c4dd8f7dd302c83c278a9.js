(function() {
  var $, $$, CompositeDisposable, HelpView, MainView, ProjectView, TextEditorView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  HelpView = require('./help-view');

  ProjectView = require('./project-view');

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View, TextEditorView = ref.TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = MainView = (function(superClass) {
    extend(MainView, superClass);

    MainView.URI = 'atom://process-palette';

    function MainView(main1) {
      this.main = main1;
      this.removeConfigController = bind(this.removeConfigController, this);
      this.addConfigController = bind(this.addConfigController, this);
      this.addProjectView = bind(this.addProjectView, this);
      this.closePressed = bind(this.closePressed, this);
      this.settingsPressed = bind(this.settingsPressed, this);
      this.reloadPressed = bind(this.reloadPressed, this);
      this.editPressed = bind(this.editPressed, this);
      this.savePressed = bind(this.savePressed, this);
      this.isOutputViewVisible = bind(this.isOutputViewVisible, this);
      this.showProcessOutput = bind(this.showProcessOutput, this);
      this.hideHelpView = bind(this.hideHelpView, this);
      this.toggleHelpView = bind(this.toggleHelpView, this);
      this.showOutputView = bind(this.showOutputView, this);
      this.showListView = bind(this.showListView, this);
      MainView.__super__.constructor.call(this, this.main);
      this.viewHeight = 200;
      this.outputView = null;
      this.showHelpView();
    }

    MainView.content = function(main) {
      return this.div({
        "class": "process-palette"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "button-group"
          }, function() {
            _this.button("Save", {
              "class": "btn btn-sm btn-fw btn-info inline-block-tight",
              outlet: "saveButton",
              click: "savePressed"
            });
            _this.button({
              "class": "btn btn-sm btn-fw icon-pencil inline-block-tight",
              outlet: "editButton",
              click: "editPressed"
            });
            _this.button({
              "class": "btn btn-sm btn-fw icon-sync inline-block-tight",
              outlet: "reloadButton",
              click: "reloadPressed"
            });
            _this.button({
              "class": "btn btn-sm btn-fw icon-gear inline-block-tight",
              outlet: "settingsButton",
              click: "settingsPressed"
            });
            _this.button({
              "class": "btn btn-sm btn-fw icon-question inline-block-tight",
              outlet: "helpButton",
              click: "toggleHelpView"
            });
            return _this.button({
              "class": "btn btn-sm btn-fw icon-chevron-down inline-block-tight",
              outlet: "hideButton",
              click: "closePressed"
            });
          });
          return _this.div({
            "class": "main-content",
            outlet: "mainContent"
          }, function() {
            _this.div({
              outlet: "helpView"
            }, function() {
              return _this.subview("hv", new HelpView(main));
            });
            _this.div({
              "class": "projects-list",
              outlet: "listView"
            });
            return _this.div({
              "class": "output-view",
              outlet: "outputViewContainer"
            });
          });
        };
      })(this));
    };

    MainView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable();
      this.disposables.add(atom.tooltips.add(this.saveButton, {
        title: "Save changes"
      }));
      this.disposables.add(atom.tooltips.add(this.helpButton, {
        title: "Toggle help"
      }));
      this.disposables.add(atom.tooltips.add(this.editButton, {
        title: "Edit configuration"
      }));
      this.disposables.add(atom.tooltips.add(this.reloadButton, {
        title: "Reload configurations"
      }));
      this.disposables.add(atom.tooltips.add(this.settingsButton, {
        title: "Settings"
      }));
      this.disposables.add(atom.tooltips.add(this.hideButton, {
        title: "Hide"
      }));
      this.saveButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      this.editButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      this.reloadButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      this.settingsButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      this.helpButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      this.hideButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      return this.saveButton.hide();
    };

    MainView.prototype.getTitle = function() {
      return 'Process Palette';
    };

    MainView.prototype.getURI = function() {
      return MainView.URI;
    };

    MainView.prototype.getPreferredLocation = function() {
      return 'bottom';
    };

    MainView.prototype.getAllowedLocations = function() {
      return ['bottom', 'left', 'right'];
    };

    MainView.prototype.isPermanentDockItem = function() {
      return false;
    };

    MainView.prototype.setViewHeight = function(viewHeight) {
      this.viewHeight = viewHeight;
    };

    MainView.prototype.setSaveButtonVisible = function(visible) {
      if (visible) {
        return this.saveButton.show();
      } else {
        return this.saveButton.hide();
      }
    };

    MainView.prototype.showListView = function() {
      if (this.listView.isHidden()) {
        this.hideHelpView();
        this.outputViewContainer.hide();
        return this.listView.show();
      }
    };

    MainView.prototype.showOutputView = function() {
      if (this.outputViewContainer.isHidden()) {
        this.hideHelpView();
        this.listView.hide();
        return this.outputViewContainer.show();
      }
    };

    MainView.prototype.toggleHelpView = function() {
      if (this.helpView.isHidden()) {
        return this.showHelpView();
      } else {
        return this.showListView();
      }
    };

    MainView.prototype.hideHelpView = function() {
      this.helpView.hide();
      return this.helpButton.removeClass("btn-info");
    };

    MainView.prototype.showHelpView = function() {
      this.listView.hide();
      this.outputViewContainer.hide();
      this.helpView.show();
      if (!this.helpButton.hasClass("btn-info")) {
        return this.helpButton.addClass("btn-info");
      }
    };

    MainView.prototype.showProcessOutput = function(processController) {
      if (this.outputView !== null) {
        this.outputView.detach();
      }
      this.outputView = processController.outputView;
      this.outputViewContainer.append(this.outputView);
      return this.showOutputView();
    };

    MainView.prototype.isProcessOutputShown = function(processController) {
      if (!this.isOutputViewVisible()) {
        return false;
      }
      if (this.outputView === null) {
        return false;
      }
      return this.outputView === processController.outputView;
    };

    MainView.prototype.isOutputViewVisible = function() {
      return this.outputViewContainer.isVisible();
    };

    MainView.prototype.savePressed = function() {
      return this.main.savePanel();
    };

    MainView.prototype.editPressed = function() {
      return this.main.editConfiguration();
    };

    MainView.prototype.reloadPressed = function() {
      return this.main.reloadConfiguration();
    };

    MainView.prototype.settingsPressed = function() {
      return atom.workspace.open('atom://config/packages/process-palette');
    };

    MainView.prototype.closePressed = function() {
      return this.main.hidePanel();
    };

    MainView.prototype.addProjectView = function(view) {
      this.listView.append(view);
      return this.showListView();
    };

    MainView.prototype.addConfigController = function(configController) {
      this.listView.addConfigController(configController);
      return this.showListView();
    };

    MainView.prototype.removeConfigController = function(configController) {
      return this.listView.removeConfigController(configController);
    };

    MainView.prototype.processControllerRemoved = function(processController) {
      if (this.outputView === null) {
        return;
      }
      if (this.outputView.processController !== processController) {
        return;
      }
      this.outputView.detach();
      this.outputView = null;
      processController = processController.configController.getFirstProcessController();
      if (this.outputViewContainer.isVisible() && (processController !== null)) {
        return this.showProcessOutput(processController);
      } else {
        return this.showListView();
      }
    };

    MainView.prototype.killFocusedProcess = function(discard) {
      var ref1;
      if (!this.outputViewContainer.isHidden()) {
        return (ref1 = this.outputView) != null ? ref1.processController.killProcess(discard) : void 0;
      }
    };

    MainView.prototype.discardFocusedOutput = function() {
      var ref1;
      if (!this.outputViewContainer.isHidden()) {
        return (ref1 = this.outputView) != null ? ref1.processController.discard() : void 0;
      }
    };

    MainView.prototype.deactivate = function() {
      this.hv.destroy();
      this.disposables.dispose();
      return this.element.remove();
    };

    MainView.prototype.getElement = function() {
      return this.element;
    };

    return MainView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvcHJvY2Vzcy1wYWxldHRlL2xpYi92aWV3cy9tYWluLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzRkFBQTtJQUFBOzs7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2QsTUFBZ0MsT0FBQSxDQUFRLHNCQUFSLENBQWhDLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUSxlQUFSLEVBQWM7O0VBQ2Isc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFFSixRQUFDLENBQUEsR0FBRCxHQUFPOztJQUVNLGtCQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsT0FBRDs7Ozs7Ozs7Ozs7Ozs7O01BQ1osMENBQU0sSUFBQyxDQUFBLElBQVA7TUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSxZQUFELENBQUE7SUFKVzs7SUFNYixRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRDthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQyxDQUFBLEtBQUEsQ0FBQSxFQUFPLGlCQUFSO09BQUwsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQy9CLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQyxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVI7V0FBTCxFQUE4QixTQUFBO1lBQzVCLEtBQUMsQ0FBQSxNQUFELENBQVEsTUFBUixFQUFnQjtjQUFDLENBQUEsS0FBQSxDQUFBLEVBQU0sK0NBQVA7Y0FBd0QsTUFBQSxFQUFRLFlBQWhFO2NBQThFLEtBQUEsRUFBTyxhQUFyRjthQUFoQjtZQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7Y0FBQyxDQUFB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QUFFLGlCQUFpQixDQUFDLE9BQS9CLENBQUEsV0FERjs7SUFEb0I7O3VCQUl0QixVQUFBLEdBQVksU0FBQTtNQUVWLElBQUMsQ0FBQSxFQUFFLENBQUMsT0FBSixDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQUpVOzt1QkFNWixVQUFBLEdBQVksU0FBQTtBQUNWLGFBQU8sSUFBQyxDQUFBO0lBREU7Ozs7S0F6TFM7QUFOdkIiLCJzb3VyY2VzQ29udGVudCI6WyJIZWxwVmlldyA9IHJlcXVpcmUgJy4vaGVscC12aWV3J1xuUHJvamVjdFZpZXcgPSByZXF1aXJlICcuL3Byb2plY3QtdmlldydcbnskLCAkJCwgVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNYWluVmlldyBleHRlbmRzIFZpZXdcblxuICBAVVJJID0gJ2F0b206Ly9wcm9jZXNzLXBhbGV0dGUnXG5cbiAgY29uc3RydWN0b3I6IChAbWFpbikgLT5cbiAgICBzdXBlcihAbWFpbik7XG4gICAgQHZpZXdIZWlnaHQgPSAyMDA7XG4gICAgQG91dHB1dFZpZXcgPSBudWxsO1xuICAgIEBzaG93SGVscFZpZXcoKTtcblxuICBAY29udGVudDogKG1haW4pIC0+XG4gICAgQGRpdiB7Y2xhc3M6IFwicHJvY2Vzcy1wYWxldHRlXCJ9LCA9PlxuICAgICAgQGRpdiB7Y2xhc3M6IFwiYnV0dG9uLWdyb3VwXCJ9LCA9PlxuICAgICAgICBAYnV0dG9uIFwiU2F2ZVwiLCB7Y2xhc3M6XCJidG4gYnRuLXNtIGJ0bi1mdyBidG4taW5mbyBpbmxpbmUtYmxvY2stdGlnaHRcIiwgb3V0bGV0OiBcInNhdmVCdXR0b25cIiwgY2xpY2s6IFwic2F2ZVByZXNzZWRcIn1cbiAgICAgICAgQGJ1dHRvbiB7Y2xhc3M6XCJidG4gYnRuLXNtIGJ0bi1mdyBpY29uLXBlbmNpbCBpbmxpbmUtYmxvY2stdGlnaHRcIiwgb3V0bGV0OiBcImVkaXRCdXR0b25cIiwgY2xpY2s6IFwiZWRpdFByZXNzZWRcIn1cbiAgICAgICAgQGJ1dHRvbiB7Y2xhc3M6XCJidG4gYnRuLXNtIGJ0bi1mdyBpY29uLXN5bmMgaW5saW5lLWJsb2NrLXRpZ2h0XCIsIG91dGxldDogXCJyZWxvYWRCdXR0b25cIiwgY2xpY2s6IFwicmVsb2FkUHJlc3NlZFwifVxuICAgICAgICBAYnV0dG9uIHtjbGFzczpcImJ0biBidG4tc20gYnRuLWZ3IGljb24tZ2VhciBpbmxpbmUtYmxvY2stdGlnaHRcIiwgb3V0bGV0OiBcInNldHRpbmdzQnV0dG9uXCIsIGNsaWNrOiBcInNldHRpbmdzUHJlc3NlZFwifVxuICAgICAgICBAYnV0dG9uIHtjbGFzczpcImJ0biBidG4tc20gYnRuLWZ3IGljb24tcXVlc3Rpb24gaW5saW5lLWJsb2NrLXRpZ2h0XCIsIG91dGxldDogXCJoZWxwQnV0dG9uXCIsIGNsaWNrOiBcInRvZ2dsZUhlbHBWaWV3XCJ9XG4gICAgICAgIEBidXR0b24ge2NsYXNzOlwiYnRuIGJ0bi1zbSBidG4tZncgaWNvbi1jaGV2cm9uLWRvd24gaW5saW5lLWJsb2NrLXRpZ2h0XCIsIG91dGxldDogXCJoaWRlQnV0dG9uXCIsIGNsaWNrOiBcImNsb3NlUHJlc3NlZFwifVxuICAgICAgQGRpdiB7Y2xhc3M6IFwibWFpbi1jb250ZW50XCIsIG91dGxldDogXCJtYWluQ29udGVudFwifSwgPT5cbiAgICAgICAgQGRpdiB7b3V0bGV0OiBcImhlbHBWaWV3XCJ9LCA9PlxuICAgICAgICAgIEBzdWJ2aWV3IFwiaHZcIiwgbmV3IEhlbHBWaWV3KG1haW4pXG4gICAgICAgIEBkaXYge2NsYXNzOiBcInByb2plY3RzLWxpc3RcIiwgb3V0bGV0OiBcImxpc3RWaWV3XCJ9XG4gICAgICAgIEBkaXYge2NsYXNzOiBcIm91dHB1dC12aWV3XCIsIG91dGxldDogXCJvdXRwdXRWaWV3Q29udGFpbmVyXCJ9XG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIEBkaXNwb3NhYmxlcy5hZGQoYXRvbS50b29sdGlwcy5hZGQoQHNhdmVCdXR0b24sIHt0aXRsZTogXCJTYXZlIGNoYW5nZXNcIn0pKTtcbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20udG9vbHRpcHMuYWRkKEBoZWxwQnV0dG9uLCB7dGl0bGU6IFwiVG9nZ2xlIGhlbHBcIn0pKTtcbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20udG9vbHRpcHMuYWRkKEBlZGl0QnV0dG9uLCB7dGl0bGU6IFwiRWRpdCBjb25maWd1cmF0aW9uXCJ9KSk7XG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLnRvb2x0aXBzLmFkZChAcmVsb2FkQnV0dG9uLCB7dGl0bGU6IFwiUmVsb2FkIGNvbmZpZ3VyYXRpb25zXCJ9KSk7XG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLnRvb2x0aXBzLmFkZChAc2V0dGluZ3NCdXR0b24sIHt0aXRsZTogXCJTZXR0aW5nc1wifSkpO1xuICAgIEBkaXNwb3NhYmxlcy5hZGQoYXRvbS50b29sdGlwcy5hZGQoQGhpZGVCdXR0b24sIHt0aXRsZTogXCJIaWRlXCJ9KSk7XG5cbiAgICBAc2F2ZUJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICBAZWRpdEJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICBAcmVsb2FkQnV0dG9uLm9uICdtb3VzZWRvd24nLCAoZSkgLT4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEBzZXR0aW5nc0J1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICBAaGVscEJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICBAaGlkZUJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIEBzYXZlQnV0dG9uLmhpZGUoKTtcblxuICBnZXRUaXRsZTogLT5cbiAgICByZXR1cm4gJ1Byb2Nlc3MgUGFsZXR0ZSc7XG5cbiAgZ2V0VVJJOiAtPlxuICAgIHJldHVybiBNYWluVmlldy5VUkk7XG5cbiAgZ2V0UHJlZmVycmVkTG9jYXRpb246IC0+XG4gICAgcmV0dXJuICdib3R0b20nO1xuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnM6IC0+XG4gICAgcmV0dXJuIFsnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuICBpc1Blcm1hbmVudERvY2tJdGVtOiAtPlxuICAgIHJldHVybiBmYWxzZTtcblxuICBzZXRWaWV3SGVpZ2h0OiAoQHZpZXdIZWlnaHQpIC0+XG4gICAgIyBAdmlld0hlaWdodCA9IE1hdGgubWF4KEB2aWV3SGVpZ2h0LCAxMDApO1xuICAgICMgQG1haW5Db250ZW50LmhlaWdodChAdmlld0hlaWdodCk7XG4gICAgIyBAdmlld0hlaWdodCA9IEBtYWluQ29udGVudC5oZWlnaHQoKTtcbiAgICAjIEBsaXN0Vmlldy5wYXJlbnRIZWlnaHRDaGFuZ2VkKEB2aWV3SGVpZ2h0KTtcbiAgICAjIEBvdXRwdXRWaWV3Py5wYXJlbnRIZWlnaHRDaGFuZ2VkKEB2aWV3SGVpZ2h0KTtcblxuICBzZXRTYXZlQnV0dG9uVmlzaWJsZTogKHZpc2libGUpIC0+XG4gICAgaWYgdmlzaWJsZVxuICAgICAgQHNhdmVCdXR0b24uc2hvdygpO1xuICAgIGVsc2VcbiAgICAgIEBzYXZlQnV0dG9uLmhpZGUoKTtcblxuICBzaG93TGlzdFZpZXc6ID0+XG4gICAgaWYgQGxpc3RWaWV3LmlzSGlkZGVuKClcbiAgICAgIEBoaWRlSGVscFZpZXcoKTtcbiAgICAgIEBvdXRwdXRWaWV3Q29udGFpbmVyLmhpZGUoKTtcbiAgICAgIEBsaXN0Vmlldy5zaG93KCk7XG5cbiAgc2hvd091dHB1dFZpZXc6ID0+XG4gICAgaWYgQG91dHB1dFZpZXdDb250YWluZXIuaXNIaWRkZW4oKVxuICAgICAgQGhpZGVIZWxwVmlldygpO1xuICAgICAgQGxpc3RWaWV3LmhpZGUoKTtcbiAgICAgIEBvdXRwdXRWaWV3Q29udGFpbmVyLnNob3coKTtcblxuICB0b2dnbGVIZWxwVmlldzogPT5cbiAgICBpZiBAaGVscFZpZXcuaXNIaWRkZW4oKVxuICAgICAgQHNob3dIZWxwVmlldygpO1xuICAgIGVsc2VcbiAgICAgIEBzaG93TGlzdFZpZXcoKTtcblxuICBoaWRlSGVscFZpZXc6ID0+XG4gICAgQGhlbHBWaWV3LmhpZGUoKTtcbiAgICBAaGVscEJ1dHRvbi5yZW1vdmVDbGFzcyhcImJ0bi1pbmZvXCIpO1xuXG4gIHNob3dIZWxwVmlldzogLT5cbiAgICBAbGlzdFZpZXcuaGlkZSgpO1xuICAgIEBvdXRwdXRWaWV3Q29udGFpbmVyLmhpZGUoKTtcbiAgICBAaGVscFZpZXcuc2hvdygpO1xuXG4gICAgaWYgIUBoZWxwQnV0dG9uLmhhc0NsYXNzKFwiYnRuLWluZm9cIilcbiAgICAgIEBoZWxwQnV0dG9uLmFkZENsYXNzKFwiYnRuLWluZm9cIik7XG5cbiAgc2hvd1Byb2Nlc3NPdXRwdXQ6IChwcm9jZXNzQ29udHJvbGxlcikgPT5cbiAgICBpZiBAb3V0cHV0VmlldyAhPSBudWxsXG4gICAgICBAb3V0cHV0Vmlldy5kZXRhY2goKTtcblxuICAgIEBvdXRwdXRWaWV3ID0gcHJvY2Vzc0NvbnRyb2xsZXIub3V0cHV0VmlldztcbiAgICBAb3V0cHV0Vmlld0NvbnRhaW5lci5hcHBlbmQoQG91dHB1dFZpZXcpO1xuICAgIEBzaG93T3V0cHV0VmlldygpO1xuXG4gIGlzUHJvY2Vzc091dHB1dFNob3duOiAocHJvY2Vzc0NvbnRyb2xsZXIpIC0+XG4gICAgaWYgIUBpc091dHB1dFZpZXdWaXNpYmxlKClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGlmIEBvdXRwdXRWaWV3ID09IG51bGxcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBAb3V0cHV0VmlldyA9PSBwcm9jZXNzQ29udHJvbGxlci5vdXRwdXRWaWV3O1xuXG4gIGlzT3V0cHV0Vmlld1Zpc2libGU6ID0+XG4gICAgcmV0dXJuIEBvdXRwdXRWaWV3Q29udGFpbmVyLmlzVmlzaWJsZSgpO1xuXG4gIHNhdmVQcmVzc2VkOiA9PlxuICAgIEBtYWluLnNhdmVQYW5lbCgpO1xuXG4gIGVkaXRQcmVzc2VkOiA9PlxuICAgIEBtYWluLmVkaXRDb25maWd1cmF0aW9uKCk7XG5cbiAgcmVsb2FkUHJlc3NlZDogPT5cbiAgICBAbWFpbi5yZWxvYWRDb25maWd1cmF0aW9uKCk7XG5cbiAgc2V0dGluZ3NQcmVzc2VkOiA9PlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvcHJvY2Vzcy1wYWxldHRlJyk7XG5cbiAgY2xvc2VQcmVzc2VkOiA9PlxuICAgIEBtYWluLmhpZGVQYW5lbCgpO1xuXG4gIGFkZFByb2plY3RWaWV3OiAodmlldykgPT5cbiAgICBAbGlzdFZpZXcuYXBwZW5kKHZpZXcpO1xuICAgICMgQGxpc3REaXZbMF0uYXBwZW5kQ2hpbGQodmlldy5nZXQoMCkpO1xuICAgICMgdmlld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICMgQGxpc3REaXZbMF0uYXBwZW5kQ2hpbGQodmlld0VsZW1lbnQpO1xuICAgICMganZpZXcgPSAkKHZpZXdFbGVtZW50KTtcbiAgICAjIGp2aWV3LmFwcGVuZCh2aWV3KTtcblxuXG4gICAgQHNob3dMaXN0VmlldygpO1xuXG4gIGFkZENvbmZpZ0NvbnRyb2xsZXI6IChjb25maWdDb250cm9sbGVyKSA9PlxuICAgIEBsaXN0Vmlldy5hZGRDb25maWdDb250cm9sbGVyKGNvbmZpZ0NvbnRyb2xsZXIpO1xuICAgIEBzaG93TGlzdFZpZXcoKTtcblxuICByZW1vdmVDb25maWdDb250cm9sbGVyOiAoY29uZmlnQ29udHJvbGxlcikgPT5cbiAgICBAbGlzdFZpZXcucmVtb3ZlQ29uZmlnQ29udHJvbGxlcihjb25maWdDb250cm9sbGVyKTtcblxuICBwcm9jZXNzQ29udHJvbGxlclJlbW92ZWQ6IChwcm9jZXNzQ29udHJvbGxlcikgLT5cbiAgICBpZiBAb3V0cHV0VmlldyA9PSBudWxsXG4gICAgICByZXR1cm47XG5cbiAgICBpZiBAb3V0cHV0Vmlldy5wcm9jZXNzQ29udHJvbGxlciAhPSBwcm9jZXNzQ29udHJvbGxlclxuICAgICAgcmV0dXJuO1xuXG4gICAgQG91dHB1dFZpZXcuZGV0YWNoKCk7XG4gICAgQG91dHB1dFZpZXcgPSBudWxsO1xuXG4gICAgcHJvY2Vzc0NvbnRyb2xsZXIgPSBwcm9jZXNzQ29udHJvbGxlci5jb25maWdDb250cm9sbGVyLmdldEZpcnN0UHJvY2Vzc0NvbnRyb2xsZXIoKTtcblxuICAgIGlmIEBvdXRwdXRWaWV3Q29udGFpbmVyLmlzVmlzaWJsZSgpIGFuZCAocHJvY2Vzc0NvbnRyb2xsZXIgIT0gbnVsbClcbiAgICAgIEBzaG93UHJvY2Vzc091dHB1dChwcm9jZXNzQ29udHJvbGxlcik7XG4gICAgZWxzZVxuICAgICAgQHNob3dMaXN0VmlldygpO1xuXG4gIGtpbGxGb2N1c2VkUHJvY2VzczogKGRpc2NhcmQpIC0+XG4gICAgaWYgIUBvdXRwdXRWaWV3Q29udGFpbmVyLmlzSGlkZGVuKClcbiAgICAgIEBvdXRwdXRWaWV3Py5wcm9jZXNzQ29udHJvbGxlci5raWxsUHJvY2VzcyhkaXNjYXJkKTtcblxuICBkaXNjYXJkRm9jdXNlZE91dHB1dDogLT5cbiAgICBpZiAhQG91dHB1dFZpZXdDb250YWluZXIuaXNIaWRkZW4oKVxuICAgICAgQG91dHB1dFZpZXc/LnByb2Nlc3NDb250cm9sbGVyLmRpc2NhcmQoKTtcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgICMgQGxpc3RWaWV3LmRlc3Ryb3koKTtcbiAgICBAaHYuZGVzdHJveSgpO1xuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgQGVsZW1lbnQucmVtb3ZlKCk7XG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICByZXR1cm4gQGVsZW1lbnQ7XG4iXX0=
