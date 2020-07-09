(function() {
  var CompositeDisposable, ConfigsView, Directory, File, MainEditView, MainView, Path, ProcessPalette, ProjectController, TreeViewController, _, ref;

  _ = require('underscore-plus');

  ref = require('atom'), Directory = ref.Directory, File = ref.File, CompositeDisposable = ref.CompositeDisposable;

  MainView = require('./views/main-view');

  TreeViewController = require('./controllers/tree-view-controller');

  Path = null;

  ConfigsView = null;

  MainEditView = null;

  ProjectController = null;

  module.exports = ProcessPalette = {
    config: {
      shell: {
        description: "The shell to run commands with. Leave empty for system default to be used.",
        type: "string",
        "default": ""
      },
      palettePanel: {
        type: "object",
        properties: {
          showCommand: {
            title: "Show command",
            description: "Show the configured command in the palette panel",
            type: "boolean",
            "default": true
          },
          showOutputTarget: {
            title: "Show output target",
            description: "Show the configured output target in the palette panel",
            type: "boolean",
            "default": true
          }
        }
      }
    },
    activate: function(state1) {
      this.state = state1;
      this.dirty = false;
      this.subscriptions = new CompositeDisposable();
      this.projectControllers = [];
      this.mainView = new MainView(this);
      this.treeViewController = new TreeViewController(this);
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:show': (function(_this) {
          return function() {
            return _this.showPanel();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:hide': (function(_this) {
          return function() {
            return _this.hidePanel();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:toggle': (function(_this) {
          return function() {
            return _this.togglePanel();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:rerun-last': (function(_this) {
          return function() {
            return _this.runLast();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:kill-focused-process': (function(_this) {
          return function() {
            return _this.mainView.killFocusedProcess(false);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:kill-and-remove-focused-process': (function(_this) {
          return function() {
            return _this.mainView.killFocusedProcess(true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:remove-focused-output': (function(_this) {
          return function() {
            return _this.mainView.discardFocusedOutput();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:edit-configuration': (function(_this) {
          return function() {
            return _this.editConfiguration();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'process-palette:reload-configuration': (function(_this) {
          return function() {
            return _this.reloadConfiguration();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.hidePanel();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.hidePanel();
          };
        })(this)
      }));
      atom.workspace.addOpener((function(_this) {
        return function(uri) {
          if (uri === MainView.URI) {
            return _this.mainView;
          }
        };
      })(this));
      if (this.state.visible) {
        this.showPanel(false);
      }
      return process.nextTick((function(_this) {
        return function() {
          return _this.load();
        };
      })(this));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.disposeProjectControllers();
      this.treeViewController.dispose();
      return this.mainView.deactivate();
    },
    disposeProjectControllers: function() {
      var i, len, projectController, ref1, results;
      ref1 = this.projectControllers;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        results.push(projectController.dispose());
      }
      return results;
    },
    serialize: function() {
      var state;
      if (this.mainView !== null) {
        state = {};
        state.visible = this.getDock() !== null;
        return state;
      }
      return this.state;
    },
    fileSaved: function(path) {
      var i, len, projectController, ref1, results;
      ref1 = this.projectControllers;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        results.push(projectController.fileSaved(path));
      }
      return results;
    },
    load: function() {
      var configFile, i, len, projectPath, ref1;
      atom.keymaps.removeBindingsFromSource('process-palette');
      configFile = new File(atom.config.getUserConfigPath());
      this.addProjectPath(configFile.getParent().getRealPathSync());
      ref1 = atom.project.getPaths();
      for (i = 0, len = ref1.length; i < len; i++) {
        projectPath = ref1[i];
        this.addProjectPath(projectPath);
      }
      return atom.project.onDidChangePaths((function(_this) {
        return function(paths) {
          return _this.projectsChanged(paths);
        };
      })(this));
    },
    projectsChanged: function(paths) {
      var i, j, k, len, len1, len2, path, projectCtrl, ref1, results, toRemove;
      for (i = 0, len = paths.length; i < len; i++) {
        path = paths[i];
        if (this.getProjectControllerWithPath(path) === null) {
          this.addProjectPath(path);
        }
      }
      toRemove = [];
      ref1 = this.projectControllers;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        projectCtrl = ref1[j];
        if (!projectCtrl.isGlobal() && paths.indexOf(projectCtrl.getProjectPath()) < 0) {
          toRemove.push(projectCtrl);
        }
      }
      if (toRemove.length === 0) {
        return;
      }
      results = [];
      for (k = 0, len2 = toRemove.length; k < len2; k++) {
        projectCtrl = toRemove[k];
        results.push(this.removeProjectController(projectCtrl));
      }
      return results;
    },
    getProjectControllerWithPath: function(projectPath) {
      var i, len, projectController, ref1;
      ref1 = this.projectControllers;
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        if (projectController.getProjectPath() === projectPath) {
          return projectController;
        }
      }
      return null;
    },
    reloadConfiguration: function(saveEditors) {
      var i, len, projectController, ref1;
      if (saveEditors == null) {
        saveEditors = true;
      }
      this.treeViewController.dispose();
      this.treeViewController = new TreeViewController(this);
      if (saveEditors) {
        this.saveEditors();
      }
      if (this.mainView.isOutputViewVisible()) {
        this.mainView.showListView();
      }
      ref1 = this.projectControllers;
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        projectController.dispose();
      }
      this.projectControllers = [];
      this.load();
      return atom.notifications.addInfo("Process Palette configurations reloaded");
    },
    togglePanel: function() {
      if (this.isVisibleInDock()) {
        return this.hidePanel();
      } else {
        return this.showPanel();
      }
    },
    showPanel: function(activate) {
      if (activate == null) {
        activate = true;
      }
      return atom.workspace.open(MainView.URI, {
        searchAllPanes: true,
        activatePane: activate,
        activateItem: activate
      });
    },
    hidePanel: function() {
      return atom.workspace.hide(this.mainView);
    },
    isVisible: function() {
      return this.isVisibleInDock();
    },
    isVisibleInDock: function() {
      var dock;
      dock = this.getDock();
      if ((dock == null) || !dock.isVisible()) {
        return false;
      }
      if (dock.getActivePane() == null) {
        return false;
      }
      return dock.getActivePane().getActiveItem() === this.mainView;
    },
    getDock: function() {
      if (atom.workspace.getBottomDock().getPaneItems().indexOf(this.mainView) >= 0) {
        return atom.workspace.getBottomDock();
      }
      if (atom.workspace.getLeftDock().getPaneItems().indexOf(this.mainView) >= 0) {
        return atom.workspace.getLeftDock();
      }
      if (atom.workspace.getRightDock().getPaneItems().indexOf(this.mainView) >= 0) {
        return atom.workspace.getRightDock();
      }
      return null;
    },
    runLast: function() {
      var configController;
      configController = this.getLastRunConfigController();
      return configController != null ? configController.runProcess() : void 0;
    },
    showListView: function() {
      this.showPanel();
      return this.mainView.showListView();
    },
    showProcessOutput: function(processController) {
      this.showPanel();
      return this.mainView.showProcessOutput(processController);
    },
    isProcessOutputShown: function(processController) {
      return this.mainView.isProcessOutputShown(processController);
    },
    processControllerRemoved: function(processController) {
      return this.mainView.processControllerRemoved(processController);
    },
    addProjectPath: function(projectPath) {
      var file, projectController;
      file = new Directory(projectPath).getFile('process-palette.json');
      if (!file.existsSync()) {
        return;
      }
      if (ProjectController == null) {
        ProjectController = require('./controllers/project-controller');
      }
      projectController = new ProjectController(this, projectPath);
      this.projectControllers.push(projectController);
      return this.mainView.addProjectView(projectController.view);
    },
    removeProjectController: function(projectController) {
      var index;
      index = this.projectControllers.indexOf(projectController);
      if (index < 0) {
        return;
      }
      this.projectControllers.splice(index, 1);
      return projectController.dispose();
    },
    editConfiguration: function(showGlobal) {
      var view;
      if (showGlobal == null) {
        showGlobal = true;
      }
      if (ConfigsView == null) {
        ConfigsView = require('./views/configs-view');
      }
      return view = new ConfigsView(this, showGlobal);
    },
    guiEditConfiguration: function(global, projectName, folderPath) {
      var exampleFile, file, packagePath, title;
      if (global) {
        title = 'Global Commands';
      } else {
        title = projectName;
      }
      if (Path == null) {
        Path = require('path');
      }
      file = new File(Path.join(folderPath, 'process-palette.json'));
      if (!file.existsSync()) {
        packagePath = atom.packages.getActivePackage('process-palette').path;
        exampleFile = new File(Path.join(packagePath, 'examples', 'process-palette.json'));
        return exampleFile.read(false).then((function(_this) {
          return function(content) {
            return file.create().then(function() {
              file.writeSync(content);
              _this.addProjectPath(folderPath);
              return _this.guiOpenFile(title, file);
            });
          };
        })(this));
      } else {
        return this.guiOpenFile(title, file);
      }
    },
    guiEditCommand: function(configController) {
      var action, file, projectController, title;
      projectController = configController.getProjectController();
      file = projectController.getConfigurationFile();
      action = configController.getConfig().action;
      if (projectController.isGlobal()) {
        title = 'Global Commands';
      } else {
        title = projectController.getProjectName();
      }
      return this.guiOpenFile(title, file, action);
    },
    guiOpenFile: function(title, file, selectedAction) {
      var filePath, main, pane, paneItem;
      if (selectedAction == null) {
        selectedAction = null;
      }
      if (MainEditView == null) {
        MainEditView = require('./views/edit/main-edit-view');
      }
      filePath = file.getRealPathSync();
      paneItem = this.getPaneItem(filePath);
      if (paneItem != null) {
        pane = atom.workspace.paneForItem(paneItem);
        pane.activateItem(paneItem);
        return;
      }
      main = this;
      return file.read(false).then((function(_this) {
        return function(content) {
          var config, view;
          config = JSON.parse(content);
          if (!_.isObject(config.patterns)) {
            config.patterns = {};
          }
          if (!_.isArray(config.commands)) {
            config.commands = [];
          }
          view = new MainEditView(main, title, filePath, config, selectedAction);
          pane = atom.workspace.getCenter().getActivePane();
          paneItem = pane.addItem(view, {
            index: 0
          });
          return pane.activateItem(paneItem);
        };
      })(this));
    },
    savePanel: function() {
      var i, len, projectController, ref1;
      ref1 = this.projectControllers;
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        projectController.saveFile();
      }
      return this.setDirty(false);
    },
    saveEditors: function() {
      var i, len, paneItem, paneItems;
      if (MainEditView == null) {
        MainEditView = require('./views/edit/main-edit-view');
      }
      paneItems = atom.workspace.getPaneItems();
      for (i = 0, len = paneItems.length; i < len; i++) {
        paneItem = paneItems[i];
        if (paneItem instanceof MainEditView) {
          paneItem.saveChanges();
        }
      }
      return this.setDirty(false);
    },
    getPaneItem: function(filePath) {
      var i, len, paneItem, paneItems;
      if (MainEditView == null) {
        MainEditView = require('./views/edit/main-edit-view');
      }
      paneItems = atom.workspace.getPaneItems();
      for (i = 0, len = paneItems.length; i < len; i++) {
        paneItem = paneItems[i];
        if (paneItem instanceof MainEditView) {
          if (paneItem.filePath === filePath) {
            return paneItem;
          }
        }
      }
      return null;
    },
    getConfigController: function(namespace, action) {
      var configController, i, len, projectController, ref1;
      ref1 = this.projectControllers;
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        configController = projectController.getConfigController(namespace, action);
        if (processController) {
          return processController;
        }
      }
      return null;
    },
    getLastRunConfigController: function() {
      var configController, configControllers, i, lastTime, len, result;
      result = null;
      configControllers = this.getAllConfigControllers();
      for (i = 0, len = configControllers.length; i < len; i++) {
        configController = configControllers[i];
        lastTime = configController.getLastTime();
        if (lastTime != null) {
          if ((result == null) || result.getLastTime() < lastTime) {
            result = configController;
          }
        }
      }
      return result;
    },
    getAllConfigControllers: function() {
      var i, len, projectController, ref1, result;
      result = [];
      ref1 = this.projectControllers;
      for (i = 0, len = ref1.length; i < len; i++) {
        projectController = ref1[i];
        result = result.concat(projectController.getConfigControllers());
      }
      return result;
    },
    setDirty: function(dirty) {
      if (this.dirty !== dirty) {
        this.dirty = dirty;
        return this.mainView.setSaveButtonVisible(this.dirty);
      }
    },
    recreateTreeViewContextMenu: function() {
      return this.treeViewController.recreateContextMenu();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvcHJvY2Vzcy1wYWxldHRlL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLHlCQUFELEVBQVksZUFBWixFQUFrQjs7RUFDbEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7RUFDWCxrQkFBQSxHQUFxQixPQUFBLENBQVEsb0NBQVI7O0VBRXJCLElBQUEsR0FBTzs7RUFDUCxXQUFBLEdBQWM7O0VBQ2QsWUFBQSxHQUFlOztFQUNmLGlCQUFBLEdBQW9COztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUFpQixjQUFBLEdBRWY7SUFBQSxNQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsNEVBQWI7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtPQURGO01BSUEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxVQUFBLEVBQ0U7VUFBQSxXQUFBLEVBQ0U7WUFBQSxLQUFBLEVBQU8sY0FBUDtZQUNBLFdBQUEsRUFBYSxrREFEYjtZQUVBLElBQUEsRUFBTSxTQUZOO1lBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1dBREY7VUFLQSxnQkFBQSxFQUNFO1lBQUEsS0FBQSxFQUFPLG9CQUFQO1lBQ0EsV0FBQSxFQUFhLHdEQURiO1lBRUEsSUFBQSxFQUFNLFNBRk47WUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7V0FORjtTQUZGO09BTEY7S0FERjtJQW1CQSxRQUFBLEVBQVUsU0FBQyxNQUFEO01BQUMsSUFBQyxDQUFBLFFBQUQ7TUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLGFB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QUF0QyxFQUFpRCxNQUFqRDtRQUVuQixJQUFHLGlCQUFIO0FBQ0UsaUJBQU8sa0JBRFQ7O0FBSEY7QUFNQSxhQUFPO0lBUFksQ0FyVHJCO0lBOFRBLDBCQUFBLEVBQTRCLFNBQUE7QUFDMUIsVUFBQTtNQUFBLE1BQUEsR0FBUztNQUNULGlCQUFBLEdBQW9CLElBQUMsQ0FBQSx1QkFBRCxDQUFBO0FBRXBCLFdBQUEsbURBQUE7O1FBQ0UsUUFBQSxHQUFXLGdCQUFnQixDQUFDLFdBQWpCLENBQUE7UUFFWCxJQUFHLGdCQUFIO1VBQ0UsSUFBSSxnQkFBRCxJQUFZLE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixRQUF0QztZQUNFLE1BQUEsR0FBUyxpQkFEWDtXQURGOztBQUhGO0FBT0EsYUFBTztJQVhtQixDQTlUNUI7SUEyVUEsdUJBQUEsRUFBeUIsU0FBQTtBQUN2QixVQUFBO01BQUEsTUFBQSxHQUFTO0FBRVQ7QUFBQSxXQUFBLHNDQUFBOztRQUNFLE1BQUEsR0FBUyxNQUFNLENBQUMsTUFBUCxDQUFjLGlCQUFpQixDQUFDLG9CQUFsQixDQUFBLENBQWQ7QUFEWDtBQUdBLGFBQU87SUFOZ0IsQ0EzVXpCO0lBbVZBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsS0FBYjtRQUNFLElBQUMsQ0FBQSxLQUFELEdBQVM7ZUFDVCxJQUFDLENBQUEsUUFBUSxDQUFDLG9CQUFWLENBQStCLElBQUMsQ0FBQSxLQUFoQyxFQUZGOztJQURRLENBblZWO0lBd1ZBLDJCQUFBLEVBQTZCLFNBQUE7YUFDM0IsSUFBQyxDQUFBLGtCQUFrQixDQUFDLG1CQUFwQixDQUFBO0lBRDJCLENBeFY3Qjs7QUFaRiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57RGlyZWN0b3J5LCBGaWxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5NYWluVmlldyA9IHJlcXVpcmUgJy4vdmlld3MvbWFpbi12aWV3J1xuVHJlZVZpZXdDb250cm9sbGVyID0gcmVxdWlyZSAnLi9jb250cm9sbGVycy90cmVlLXZpZXctY29udHJvbGxlcidcblxuUGF0aCA9IG51bGxcbkNvbmZpZ3NWaWV3ID0gbnVsbFxuTWFpbkVkaXRWaWV3ID0gbnVsbFxuUHJvamVjdENvbnRyb2xsZXIgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvY2Vzc1BhbGV0dGUgPVxuXG4gIGNvbmZpZzpcbiAgICBzaGVsbDpcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBzaGVsbCB0byBydW4gY29tbWFuZHMgd2l0aC4gTGVhdmUgZW1wdHkgZm9yIHN5c3RlbSBkZWZhdWx0IHRvIGJlIHVzZWQuXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICBwYWxldHRlUGFuZWw6XG4gICAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgICBwcm9wZXJ0aWVzOlxuICAgICAgICBzaG93Q29tbWFuZDpcbiAgICAgICAgICB0aXRsZTogXCJTaG93IGNvbW1hbmRcIlxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgdGhlIGNvbmZpZ3VyZWQgY29tbWFuZCBpbiB0aGUgcGFsZXR0ZSBwYW5lbFwiXG4gICAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIHNob3dPdXRwdXRUYXJnZXQ6XG4gICAgICAgICAgdGl0bGU6IFwiU2hvdyBvdXRwdXQgdGFyZ2V0XCJcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJTaG93IHRoZSBjb25maWd1cmVkIG91dHB1dCB0YXJnZXQgaW4gdGhlIHBhbGV0dGUgcGFuZWxcIlxuICAgICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZVxuXG4gIGFjdGl2YXRlOiAoQHN0YXRlKSAtPlxuICAgIEBkaXJ0eSA9IGZhbHNlO1xuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICBAcHJvamVjdENvbnRyb2xsZXJzID0gW107XG4gICAgQG1haW5WaWV3ID0gbmV3IE1haW5WaWV3KEApO1xuICAgIEB0cmVlVmlld0NvbnRyb2xsZXIgPSBuZXcgVHJlZVZpZXdDb250cm9sbGVyKEApO1xuICAgICMgQGJvdHRvbVBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoaXRlbTogQG1haW5WaWV3LmdldEVsZW1lbnQoKSwgdmlzaWJsZTogZmFsc2UpO1xuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdwcm9jZXNzLXBhbGV0dGU6c2hvdyc6ID0+IEBzaG93UGFuZWwoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncHJvY2Vzcy1wYWxldHRlOmhpZGUnOiA9PiBAaGlkZVBhbmVsKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3Byb2Nlc3MtcGFsZXR0ZTp0b2dnbGUnOiA9PiBAdG9nZ2xlUGFuZWwoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncHJvY2Vzcy1wYWxldHRlOnJlcnVuLWxhc3QnOiA9PiBAcnVuTGFzdCgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdwcm9jZXNzLXBhbGV0dGU6a2lsbC1mb2N1c2VkLXByb2Nlc3MnOiA9PiBAbWFpblZpZXcua2lsbEZvY3VzZWRQcm9jZXNzKGZhbHNlKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncHJvY2Vzcy1wYWxldHRlOmtpbGwtYW5kLXJlbW92ZS1mb2N1c2VkLXByb2Nlc3MnOiA9PiBAbWFpblZpZXcua2lsbEZvY3VzZWRQcm9jZXNzKHRydWUpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdwcm9jZXNzLXBhbGV0dGU6cmVtb3ZlLWZvY3VzZWQtb3V0cHV0JzogPT4gQG1haW5WaWV3LmRpc2NhcmRGb2N1c2VkT3V0cHV0KClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3Byb2Nlc3MtcGFsZXR0ZTplZGl0LWNvbmZpZ3VyYXRpb24nOiA9PiBAZWRpdENvbmZpZ3VyYXRpb24oKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLCAncHJvY2Vzcy1wYWxldHRlOnJlbG9hZC1jb25maWd1cmF0aW9uJzogPT4gQHJlbG9hZENvbmZpZ3VyYXRpb24oKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2NvcmU6Y2FuY2VsJzogPT4gQGhpZGVQYW5lbCgpXG4gICAgICAnY29yZTpjbG9zZSc6ID0+IEBoaWRlUGFuZWwoKVxuXG4gICAgIyBUT0RPIDogRW5hYmxlIHRoaXMgYWdhaW4gbGF0ZXIgdG8gc3VwcG9ydCAnb24tc2F2ZScgYmVoYXZpb3IuXG4gICAgIyBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgIyAgIEBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub25EaWRTYXZlIChldmVudCkgPT5cbiAgICAjICAgICBAZmlsZVNhdmVkKGV2ZW50LnBhdGgpO1xuXG4gICAgIyBpZiBfLmlzTnVtYmVyKEBzdGF0ZS5oZWlnaHQpXG4gICAgICAjIEBtYWluVmlldy5zZXRWaWV3SGVpZ2h0KEBzdGF0ZS5oZWlnaHQpO1xuXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyICh1cmkpID0+XG4gICAgICBpZiB1cmkgPT0gTWFpblZpZXcuVVJJXG4gICAgICAgIHJldHVybiBAbWFpblZpZXc7XG5cbiAgICBpZiBAc3RhdGUudmlzaWJsZVxuICAgICAgQHNob3dQYW5lbChmYWxzZSk7XG5cbiAgICBwcm9jZXNzLm5leHRUaWNrICgpID0+IEBsb2FkKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICBAZGlzcG9zZVByb2plY3RDb250cm9sbGVycygpO1xuICAgIEB0cmVlVmlld0NvbnRyb2xsZXIuZGlzcG9zZSgpO1xuICAgIEBtYWluVmlldy5kZWFjdGl2YXRlKCk7XG5cbiAgZGlzcG9zZVByb2plY3RDb250cm9sbGVyczogLT5cbiAgICBmb3IgcHJvamVjdENvbnRyb2xsZXIgaW4gQHByb2plY3RDb250cm9sbGVyc1xuICAgICAgcHJvamVjdENvbnRyb2xsZXIuZGlzcG9zZSgpO1xuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBpZiBAbWFpblZpZXcgIT0gbnVsbFxuICAgICAgc3RhdGUgPSB7fTtcbiAgICAgIHN0YXRlLnZpc2libGUgPSBAZ2V0RG9jaygpICE9IG51bGw7XG4gICAgICByZXR1cm4gc3RhdGU7XG5cbiAgICByZXR1cm4gQHN0YXRlO1xuXG4gIGZpbGVTYXZlZDogKHBhdGgpIC0+XG4gICAgZm9yIHByb2plY3RDb250cm9sbGVyIGluIEBwcm9qZWN0Q29udHJvbGxlcnNcbiAgICAgIHByb2plY3RDb250cm9sbGVyLmZpbGVTYXZlZChwYXRoKTtcblxuICBsb2FkOiAtPlxuICAgICMgUmVtb3ZlIGFsbCBrZXkgYmluZGluZ3MuXG4gICAgYXRvbS5rZXltYXBzLnJlbW92ZUJpbmRpbmdzRnJvbVNvdXJjZSgncHJvY2Vzcy1wYWxldHRlJyk7XG5cbiAgICBjb25maWdGaWxlID0gbmV3IEZpbGUoYXRvbS5jb25maWcuZ2V0VXNlckNvbmZpZ1BhdGgoKSk7XG4gICAgQGFkZFByb2plY3RQYXRoKGNvbmZpZ0ZpbGUuZ2V0UGFyZW50KCkuZ2V0UmVhbFBhdGhTeW5jKCkpO1xuXG4gICAgZm9yIHByb2plY3RQYXRoIGluIGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICBAYWRkUHJvamVjdFBhdGgocHJvamVjdFBhdGgpO1xuXG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMgKHBhdGhzKSA9PiBAcHJvamVjdHNDaGFuZ2VkKHBhdGhzKVxuXG4gIHByb2plY3RzQ2hhbmdlZDogKHBhdGhzKSAtPlxuICAgICMgQWRkIGNvbnRyb2xsZXJzIGZvciBuZXcgcHJvamVjdCBwYXRocy5cbiAgICBmb3IgcGF0aCBpbiBwYXRoc1xuICAgICAgaWYgQGdldFByb2plY3RDb250cm9sbGVyV2l0aFBhdGgocGF0aCkgPT0gbnVsbFxuICAgICAgICBAYWRkUHJvamVjdFBhdGgocGF0aCk7XG5cbiAgICAjIFJlbW92ZSBjb250cm9sbGVycyBvZiBvbGQgcHJvamVjdCBwYXRocy5cbiAgICB0b1JlbW92ZSA9IFtdO1xuICAgIGZvciBwcm9qZWN0Q3RybCBpbiBAcHJvamVjdENvbnRyb2xsZXJzXG4gICAgICBpZiAhcHJvamVjdEN0cmwuaXNHbG9iYWwoKSBhbmQgcGF0aHMuaW5kZXhPZihwcm9qZWN0Q3RybC5nZXRQcm9qZWN0UGF0aCgpKSA8IDBcbiAgICAgICAgdG9SZW1vdmUucHVzaChwcm9qZWN0Q3RybCk7XG5cbiAgICBpZiB0b1JlbW92ZS5sZW5ndGggPT0gMFxuICAgICAgcmV0dXJuO1xuXG4gICAgZm9yIHByb2plY3RDdHJsIGluIHRvUmVtb3ZlXG4gICAgICBAcmVtb3ZlUHJvamVjdENvbnRyb2xsZXIocHJvamVjdEN0cmwpO1xuXG4gIGdldFByb2plY3RDb250cm9sbGVyV2l0aFBhdGg6IChwcm9qZWN0UGF0aCkgLT5cbiAgICBmb3IgcHJvamVjdENvbnRyb2xsZXIgaW4gQHByb2plY3RDb250cm9sbGVyc1xuICAgICAgaWYgcHJvamVjdENvbnRyb2xsZXIuZ2V0UHJvamVjdFBhdGgoKSA9PSBwcm9qZWN0UGF0aFxuICAgICAgICByZXR1cm4gcHJvamVjdENvbnRyb2xsZXI7XG5cbiAgICByZXR1cm4gbnVsbDtcblxuICByZWxvYWRDb25maWd1cmF0aW9uOiAoc2F2ZUVkaXRvcnMgPSB0cnVlKSAtPlxuICAgIEB0cmVlVmlld0NvbnRyb2xsZXIuZGlzcG9zZSgpO1xuICAgIEB0cmVlVmlld0NvbnRyb2xsZXIgPSBuZXcgVHJlZVZpZXdDb250cm9sbGVyKEApO1xuXG4gICAgaWYgc2F2ZUVkaXRvcnNcbiAgICAgIEBzYXZlRWRpdG9ycygpO1xuXG4gICAgaWYgQG1haW5WaWV3LmlzT3V0cHV0Vmlld1Zpc2libGUoKVxuICAgICAgQG1haW5WaWV3LnNob3dMaXN0VmlldygpO1xuXG4gICAgZm9yIHByb2plY3RDb250cm9sbGVyIGluIEBwcm9qZWN0Q29udHJvbGxlcnNcbiAgICAgIHByb2plY3RDb250cm9sbGVyLmRpc3Bvc2UoKTtcblxuICAgIEBwcm9qZWN0Q29udHJvbGxlcnMgPSBbXTtcbiAgICBAbG9hZCgpO1xuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXCJQcm9jZXNzIFBhbGV0dGUgY29uZmlndXJhdGlvbnMgcmVsb2FkZWRcIik7XG5cbiAgdG9nZ2xlUGFuZWw6IC0+XG4gICAgaWYgQGlzVmlzaWJsZUluRG9jaygpXG4gICAgICBAaGlkZVBhbmVsKClcbiAgICBlbHNlXG4gICAgICBAc2hvd1BhbmVsKCk7XG5cbiAgc2hvd1BhbmVsOiAoYWN0aXZhdGUgPSB0cnVlKSAtPlxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oTWFpblZpZXcuVVJJLCB7XG4gICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICAgIGFjdGl2YXRlUGFuZTogYWN0aXZhdGUsXG4gICAgICBhY3RpdmF0ZUl0ZW06IGFjdGl2YXRlXG4gICAgfSk7XG5cbiAgaGlkZVBhbmVsOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmhpZGUoQG1haW5WaWV3KTtcblxuICBpc1Zpc2libGU6IC0+XG4gICAgcmV0dXJuIEBpc1Zpc2libGVJbkRvY2soKTtcblxuICBpc1Zpc2libGVJbkRvY2s6IC0+XG4gICAgZG9jayA9IEBnZXREb2NrKCk7XG5cbiAgICBpZiAhZG9jaz8gb3IgIWRvY2suaXNWaXNpYmxlKClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGlmICFkb2NrLmdldEFjdGl2ZVBhbmUoKT9cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBkb2NrLmdldEFjdGl2ZVBhbmUoKS5nZXRBY3RpdmVJdGVtKCkgaXMgQG1haW5WaWV3O1xuXG4gIGdldERvY2s6IC0+XG4gICAgaWYgYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpLmdldFBhbmVJdGVtcygpLmluZGV4T2YoQG1haW5WaWV3KSA+PSAwXG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaygpO1xuICAgIGlmIGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKCkuZ2V0UGFuZUl0ZW1zKCkuaW5kZXhPZihAbWFpblZpZXcpID49IDBcbiAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpO1xuICAgIGlmIGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaygpLmdldFBhbmVJdGVtcygpLmluZGV4T2YoQG1haW5WaWV3KSA+PSAwXG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCk7XG5cbiAgICByZXR1cm4gbnVsbDtcblxuICBydW5MYXN0OiAtPlxuICAgIGNvbmZpZ0NvbnRyb2xsZXIgPSBAZ2V0TGFzdFJ1bkNvbmZpZ0NvbnRyb2xsZXIoKTtcbiAgICBjb25maWdDb250cm9sbGVyPy5ydW5Qcm9jZXNzKCk7XG5cbiAgc2hvd0xpc3RWaWV3OiAtPlxuICAgIEBzaG93UGFuZWwoKTtcbiAgICBAbWFpblZpZXcuc2hvd0xpc3RWaWV3KCk7XG5cbiAgc2hvd1Byb2Nlc3NPdXRwdXQ6IChwcm9jZXNzQ29udHJvbGxlcikgLT5cbiAgICBAc2hvd1BhbmVsKCk7XG4gICAgQG1haW5WaWV3LnNob3dQcm9jZXNzT3V0cHV0KHByb2Nlc3NDb250cm9sbGVyKTtcblxuICBpc1Byb2Nlc3NPdXRwdXRTaG93bjogKHByb2Nlc3NDb250cm9sbGVyKSAtPlxuICAgIHJldHVybiBAbWFpblZpZXcuaXNQcm9jZXNzT3V0cHV0U2hvd24ocHJvY2Vzc0NvbnRyb2xsZXIpO1xuXG4gIHByb2Nlc3NDb250cm9sbGVyUmVtb3ZlZDogKHByb2Nlc3NDb250cm9sbGVyKSAtPlxuICAgIEBtYWluVmlldy5wcm9jZXNzQ29udHJvbGxlclJlbW92ZWQocHJvY2Vzc0NvbnRyb2xsZXIpO1xuXG4gIGFkZFByb2plY3RQYXRoOiAocHJvamVjdFBhdGgpIC0+XG4gICAgZmlsZSA9IG5ldyBEaXJlY3RvcnkocHJvamVjdFBhdGgpLmdldEZpbGUoJ3Byb2Nlc3MtcGFsZXR0ZS5qc29uJyk7XG5cbiAgICBpZiAhZmlsZS5leGlzdHNTeW5jKClcbiAgICAgIHJldHVybjtcblxuICAgIFByb2plY3RDb250cm9sbGVyID89IHJlcXVpcmUgJy4vY29udHJvbGxlcnMvcHJvamVjdC1jb250cm9sbGVyJ1xuICAgIHByb2plY3RDb250cm9sbGVyID0gbmV3IFByb2plY3RDb250cm9sbGVyKEAsIHByb2plY3RQYXRoKTtcbiAgICBAcHJvamVjdENvbnRyb2xsZXJzLnB1c2gocHJvamVjdENvbnRyb2xsZXIpO1xuICAgIEBtYWluVmlldy5hZGRQcm9qZWN0Vmlldyhwcm9qZWN0Q29udHJvbGxlci52aWV3KTtcblxuICByZW1vdmVQcm9qZWN0Q29udHJvbGxlcjogKHByb2plY3RDb250cm9sbGVyKSAtPlxuICAgIGluZGV4ID0gQHByb2plY3RDb250cm9sbGVycy5pbmRleE9mKHByb2plY3RDb250cm9sbGVyKTtcblxuICAgIGlmIGluZGV4IDwgMFxuICAgICAgcmV0dXJuO1xuXG4gICAgQHByb2plY3RDb250cm9sbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHByb2plY3RDb250cm9sbGVyLmRpc3Bvc2UoKTtcblxuICBlZGl0Q29uZmlndXJhdGlvbjogKHNob3dHbG9iYWwgPSB0cnVlKSAtPlxuICAgIENvbmZpZ3NWaWV3ID89IHJlcXVpcmUgJy4vdmlld3MvY29uZmlncy12aWV3J1xuICAgIHZpZXcgPSBuZXcgQ29uZmlnc1ZpZXcoQCwgc2hvd0dsb2JhbCk7XG4gICAgIyBmb3IgcHJvamVjdENvbnRyb2xsZXIgaW4gQHByb2plY3RDb250cm9sbGVyc1xuICAgICMgICBwcm9qZWN0Q29udHJvbGxlci5lZGl0Q29uZmlndXJhdGlvbigpO1xuXG4gIGd1aUVkaXRDb25maWd1cmF0aW9uOiAoZ2xvYmFsLCBwcm9qZWN0TmFtZSwgZm9sZGVyUGF0aCkgLT5cbiAgICBpZiBnbG9iYWxcbiAgICAgIHRpdGxlID0gJ0dsb2JhbCBDb21tYW5kcyc7XG4gICAgZWxzZVxuICAgICAgdGl0bGUgPSBwcm9qZWN0TmFtZTtcblxuICAgIFBhdGggPz0gcmVxdWlyZSAncGF0aCdcblxuICAgICMgSWYgdGhlcmUgaXMgYSBwcm9jZXNzLXBhbGV0dGUuanNvbiBmaWxlIHRoZW4gb3BlbiBpdC4gSWYgbm90IHRoZW5cbiAgICAjIGNyZWF0ZSBhIG5ldyBmaWxlIGFuZCBsb2FkIHRoZSBleGFtcGxlIGludG8gaXQuXG4gICAgZmlsZSA9IG5ldyBGaWxlKFBhdGguam9pbihmb2xkZXJQYXRoLCAncHJvY2Vzcy1wYWxldHRlLmpzb24nKSk7XG5cbiAgICBpZiAhZmlsZS5leGlzdHNTeW5jKClcbiAgICAgIHBhY2thZ2VQYXRoID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKCdwcm9jZXNzLXBhbGV0dGUnKS5wYXRoO1xuICAgICAgZXhhbXBsZUZpbGUgPSBuZXcgRmlsZShQYXRoLmpvaW4ocGFja2FnZVBhdGgsICdleGFtcGxlcycsICdwcm9jZXNzLXBhbGV0dGUuanNvbicpKTtcblxuICAgICAgZXhhbXBsZUZpbGUucmVhZChmYWxzZSkudGhlbiAoY29udGVudCkgPT5cbiAgICAgICAgZmlsZS5jcmVhdGUoKS50aGVuID0+XG4gICAgICAgICAgZmlsZS53cml0ZVN5bmMoY29udGVudCk7XG4gICAgICAgICAgQGFkZFByb2plY3RQYXRoKGZvbGRlclBhdGgpO1xuICAgICAgICAgIEBndWlPcGVuRmlsZSh0aXRsZSwgZmlsZSk7XG4gICAgZWxzZVxuICAgICAgQGd1aU9wZW5GaWxlKHRpdGxlLCBmaWxlKTtcblxuICBndWlFZGl0Q29tbWFuZDogKGNvbmZpZ0NvbnRyb2xsZXIpIC0+XG4gICAgcHJvamVjdENvbnRyb2xsZXIgPSBjb25maWdDb250cm9sbGVyLmdldFByb2plY3RDb250cm9sbGVyKCk7XG4gICAgZmlsZSA9IHByb2plY3RDb250cm9sbGVyLmdldENvbmZpZ3VyYXRpb25GaWxlKCk7XG4gICAgYWN0aW9uID0gY29uZmlnQ29udHJvbGxlci5nZXRDb25maWcoKS5hY3Rpb247XG5cbiAgICBpZiBwcm9qZWN0Q29udHJvbGxlci5pc0dsb2JhbCgpXG4gICAgICB0aXRsZSA9ICdHbG9iYWwgQ29tbWFuZHMnO1xuICAgIGVsc2VcbiAgICAgIHRpdGxlID0gcHJvamVjdENvbnRyb2xsZXIuZ2V0UHJvamVjdE5hbWUoKTtcblxuICAgIEBndWlPcGVuRmlsZSh0aXRsZSwgZmlsZSwgYWN0aW9uKTtcblxuICBndWlPcGVuRmlsZTogKHRpdGxlLCBmaWxlLCBzZWxlY3RlZEFjdGlvbiA9IG51bGwpIC0+XG4gICAgTWFpbkVkaXRWaWV3ID89IHJlcXVpcmUgJy4vdmlld3MvZWRpdC9tYWluLWVkaXQtdmlldydcblxuICAgICMgSWYgdGhlIGZpbGUgaXMgYWxyZWFkeSBvcGVuIHRoZW4gYWN0aXZhdGUgaXRzIHBhbmUuXG4gICAgZmlsZVBhdGggPSBmaWxlLmdldFJlYWxQYXRoU3luYygpO1xuICAgIHBhbmVJdGVtID0gQGdldFBhbmVJdGVtKGZpbGVQYXRoKTtcblxuICAgIGlmIHBhbmVJdGVtP1xuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHBhbmVJdGVtKTtcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKHBhbmVJdGVtKTtcbiAgICAgIHJldHVybjtcblxuICAgIG1haW4gPSBAO1xuXG4gICAgZmlsZS5yZWFkKGZhbHNlKS50aGVuIChjb250ZW50KSA9PlxuICAgICAgY29uZmlnID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICAgIGlmICFfLmlzT2JqZWN0KGNvbmZpZy5wYXR0ZXJucylcbiAgICAgICAgY29uZmlnLnBhdHRlcm5zID0ge307XG4gICAgICBpZiAhXy5pc0FycmF5KGNvbmZpZy5jb21tYW5kcylcbiAgICAgICAgY29uZmlnLmNvbW1hbmRzID0gW107XG5cbiAgICAgIHZpZXcgPSBuZXcgTWFpbkVkaXRWaWV3KG1haW4sIHRpdGxlLCBmaWxlUGF0aCwgY29uZmlnLCBzZWxlY3RlZEFjdGlvbik7XG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0QWN0aXZlUGFuZSgpO1xuICAgICAgcGFuZUl0ZW0gPSBwYW5lLmFkZEl0ZW0odmlldywge2luZGV4OiAwfSk7XG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShwYW5lSXRlbSk7XG5cbiAgIyBDYWxsZWQgd2hlbiB0aGUgc2F2ZSBidXR0b24gd2FzIHByZXNzZWQuIFRoaXMgc2F2ZXMgY2hhbmdlcyB0aGF0IHdlcmUgbWFkZVxuICAjIHRvIHRoZSBjb21tYW5kIGRpcmVjdGx5IGluIHRoZSBwYW5lbC5cbiAgc2F2ZVBhbmVsOiAtPlxuICAgIGZvciBwcm9qZWN0Q29udHJvbGxlciBpbiBAcHJvamVjdENvbnRyb2xsZXJzXG4gICAgICBwcm9qZWN0Q29udHJvbGxlci5zYXZlRmlsZSgpO1xuXG4gICAgQHNldERpcnR5KGZhbHNlKTtcblxuICBzYXZlRWRpdG9yczogLT5cbiAgICBNYWluRWRpdFZpZXcgPz0gcmVxdWlyZSAnLi92aWV3cy9lZGl0L21haW4tZWRpdC12aWV3J1xuICAgIHBhbmVJdGVtcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpO1xuXG4gICAgZm9yIHBhbmVJdGVtIGluIHBhbmVJdGVtc1xuICAgICAgaWYgcGFuZUl0ZW0gaW5zdGFuY2VvZiBNYWluRWRpdFZpZXdcbiAgICAgICAgcGFuZUl0ZW0uc2F2ZUNoYW5nZXMoKTtcblxuICAgIEBzZXREaXJ0eShmYWxzZSk7XG5cbiAgZ2V0UGFuZUl0ZW06IChmaWxlUGF0aCkgLT5cbiAgICBNYWluRWRpdFZpZXcgPz0gcmVxdWlyZSAnLi92aWV3cy9lZGl0L21haW4tZWRpdC12aWV3J1xuICAgIHBhbmVJdGVtcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpO1xuXG4gICAgZm9yIHBhbmVJdGVtIGluIHBhbmVJdGVtc1xuICAgICAgaWYgcGFuZUl0ZW0gaW5zdGFuY2VvZiBNYWluRWRpdFZpZXdcbiAgICAgICAgaWYgcGFuZUl0ZW0uZmlsZVBhdGggPT0gZmlsZVBhdGhcbiAgICAgICAgICByZXR1cm4gcGFuZUl0ZW07XG5cbiAgICByZXR1cm4gbnVsbDtcblxuICBnZXRDb25maWdDb250cm9sbGVyOiAobmFtZXNwYWNlLCBhY3Rpb24pIC0+XG4gICAgZm9yIHByb2plY3RDb250cm9sbGVyIGluIEBwcm9qZWN0Q29udHJvbGxlcnNcbiAgICAgIGNvbmZpZ0NvbnRyb2xsZXIgPSBwcm9qZWN0Q29udHJvbGxlci5nZXRDb25maWdDb250cm9sbGVyKG5hbWVzcGFjZSwgYWN0aW9uKTtcblxuICAgICAgaWYgcHJvY2Vzc0NvbnRyb2xsZXJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3NDb250cm9sbGVyO1xuXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgZ2V0TGFzdFJ1bkNvbmZpZ0NvbnRyb2xsZXI6IC0+XG4gICAgcmVzdWx0ID0gbnVsbDtcbiAgICBjb25maWdDb250cm9sbGVycyA9IEBnZXRBbGxDb25maWdDb250cm9sbGVycygpO1xuXG4gICAgZm9yIGNvbmZpZ0NvbnRyb2xsZXIgaW4gY29uZmlnQ29udHJvbGxlcnNcbiAgICAgIGxhc3RUaW1lID0gY29uZmlnQ29udHJvbGxlci5nZXRMYXN0VGltZSgpO1xuXG4gICAgICBpZiBsYXN0VGltZT9cbiAgICAgICAgaWYgIXJlc3VsdD8gb3IgcmVzdWx0LmdldExhc3RUaW1lKCkgPCBsYXN0VGltZVxuICAgICAgICAgIHJlc3VsdCA9IGNvbmZpZ0NvbnRyb2xsZXI7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIGdldEFsbENvbmZpZ0NvbnRyb2xsZXJzOiAtPlxuICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yIHByb2plY3RDb250cm9sbGVyIGluIEBwcm9qZWN0Q29udHJvbGxlcnNcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQocHJvamVjdENvbnRyb2xsZXIuZ2V0Q29uZmlnQ29udHJvbGxlcnMoKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIHNldERpcnR5OiAoZGlydHkpIC0+XG4gICAgaWYgQGRpcnR5ICE9IGRpcnR5XG4gICAgICBAZGlydHkgPSBkaXJ0eTtcbiAgICAgIEBtYWluVmlldy5zZXRTYXZlQnV0dG9uVmlzaWJsZShAZGlydHkpO1xuXG4gIHJlY3JlYXRlVHJlZVZpZXdDb250ZXh0TWVudTogLT5cbiAgICBAdHJlZVZpZXdDb250cm9sbGVyLnJlY3JlYXRlQ29udGV4dE1lbnUoKTtcbiJdfQ==
