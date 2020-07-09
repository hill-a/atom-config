(function() {
  var File, HelpView, Path, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  File = require('atom').File;

  View = require('atom-space-pen-views').View;

  Path = null;

  module.exports = HelpView = (function(superClass) {
    extend(HelpView, superClass);

    function HelpView(main) {
      this.main = main;
      HelpView.__super__.constructor.call(this, this.main);
    }

    HelpView.content = function() {
      var configFile, configFolder;
      configFile = new File(atom.config.getUserConfigPath());
      configFolder = configFile.getParent().getRealPathSync();
      return this.div({
        "class": "help"
      }, (function(_this) {
        return function() {
          _this.h2({
            "class": "header"
          }, 'Process Palette');
          return _this.div({
            "class": "content"
          }, function() {
            _this.div(function() {
              _this.span("Add commands by creating a ");
              _this.span("process-palette.json", {
                "class": "text-info"
              });
              return _this.span(" configuration file in any of the following locations:");
            });
            _this.ul(function() {
              _this.li(function() {
                _this.span("Your ");
                _this.span("" + configFolder, {
                  "class": "text-info"
                });
                _this.span(" folder for global commands ");
                return _this.button("Do it!", {
                  "class": 'btn btn-sm inline-block-tight',
                  outlet: 'globalButton',
                  click: 'createGlobalConfigurationFile'
                });
              });
              return _this.li(function() {
                _this.span("The root of any of your project folders for project specific commands ");
                return _this.button("Do it!", {
                  "class": 'btn btn-sm inline-block-tight',
                  outlet: 'projectButton',
                  click: 'createProjectConfigurationFile'
                });
              });
            });
            _this.span("Once you've created a configuration file, run ");
            _this.span("Process Palette: Reload Configuration", {
              "class": "btn btn-sm inline-block-tight",
              click: 'reloadConfiguration'
            });
            return _this.span("to load it.");
          });
        };
      })(this));
    };

    HelpView.prototype.initialize = function() {
      this.globalButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
      return this.projectButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
    };

    HelpView.prototype.createGlobalConfigurationFile = function() {
      var configFile;
      configFile = new File(atom.config.getUserConfigPath());
      return this.main.guiEditConfiguration(true, '', configFile.getParent().getRealPathSync());
    };

    HelpView.prototype.createProjectConfigurationFile = function() {
      return this.main.editConfiguration(false);
    };

    HelpView.prototype.createConfigurationFile = function(configFolder) {
      var configFile, file, packagePath;
      configFile = configFolder.getFile("process-palette.json");
      if (Path == null) {
        Path = require('path');
      }
      if (!configFile.existsSync()) {
        packagePath = atom.packages.getActivePackage('process-palette').path;
        file = new File(Path.join(packagePath, 'examples', 'process-palette.json'));
        return file.read(false).then((function(_this) {
          return function(content) {
            return configFile.create().then(function() {
              configFile.writeSync(content);
              return atom.workspace.open(configFile.getPath());
            });
          };
        })(this));
      } else {
        return atom.workspace.open(configFile.getPath());
      }
    };

    HelpView.prototype.reloadConfiguration = function() {
      return this.main.reloadConfiguration();
    };

    HelpView.prototype.serialize = function() {};

    HelpView.prototype.destroy = function() {
      return this.element.remove();
    };

    HelpView.prototype.getElement = function() {
      return this.element;
    };

    return HelpView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvcHJvY2Vzcy1wYWxldHRlL2xpYi92aWV3cy9oZWxwLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwwQkFBQTtJQUFBOzs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSOztFQUNSLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUVULElBQUEsR0FBTzs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFFUyxrQkFBQyxJQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWiwwQ0FBTSxJQUFDLENBQUEsSUFBUDtJQURXOztJQUdiLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTtBQUNSLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxJQUFKLENBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBWixDQUFBLENBQVQ7TUFDYixZQUFBLEdBQWUsVUFBVSxDQUFDLFNBQVgsQ0FBQSxDQUFzQixDQUFDLGVBQXZCLENBQUE7YUFFZixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUMsQ0FBQSxLQUFBLENBQUEsRUFBTyxNQUFSO09BQUwsRUFBc0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3BCLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQyxDQUFBLEtBQUEsQ0FBQSxFQUFPLFFBQVI7V0FBSixFQUF1QixpQkFBdkI7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFDLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUjtXQUFMLEVBQXlCLFNBQUE7WUFDdkIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO2NBQ0gsS0FBQyxDQUFBLElBQUQsQ0FBTSw2QkFBTjtjQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sc0JBQU4sRUFBOEI7Z0JBQUMsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFSO2VBQTlCO3FCQUNBLEtBQUMsQ0FBQSxJQUFELENB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QVUsQ0FBQyxPQUFYLENBQUEsQ0FBcEI7WUFGdUIsQ0FBekI7VUFEb0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLEVBSkY7T0FBQSxNQUFBO2VBU0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBcEIsRUFURjs7SUFKdUI7O3VCQWV6QixtQkFBQSxHQUFxQixTQUFBO2FBQ25CLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQTtJQURtQjs7dUJBR3JCLFNBQUEsR0FBVyxTQUFBLEdBQUE7O3VCQUVYLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUE7SUFETzs7dUJBR1QsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFDLENBQUE7SUFEUzs7OztLQS9EUztBQU52QiIsInNvdXJjZXNDb250ZW50IjpbIntGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG57Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuUGF0aCA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgSGVscFZpZXcgZXh0ZW5kcyBWaWV3XG5cbiAgY29uc3RydWN0b3I6IChAbWFpbikgLT5cbiAgICBzdXBlcihAbWFpbik7XG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgY29uZmlnRmlsZSA9IG5ldyBGaWxlKGF0b20uY29uZmlnLmdldFVzZXJDb25maWdQYXRoKCkpO1xuICAgIGNvbmZpZ0ZvbGRlciA9IGNvbmZpZ0ZpbGUuZ2V0UGFyZW50KCkuZ2V0UmVhbFBhdGhTeW5jKCk7XG5cbiAgICBAZGl2IHtjbGFzczogXCJoZWxwXCJ9LCA9PlxuICAgICAgQGgyIHtjbGFzczogXCJoZWFkZXJcIn0sICdQcm9jZXNzIFBhbGV0dGUnXG4gICAgICBAZGl2IHtjbGFzczogXCJjb250ZW50XCJ9LCA9PlxuICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgQHNwYW4gXCJBZGQgY29tbWFuZHMgYnkgY3JlYXRpbmcgYSBcIlxuICAgICAgICAgIEBzcGFuIFwicHJvY2Vzcy1wYWxldHRlLmpzb25cIiwge2NsYXNzOiBcInRleHQtaW5mb1wifVxuICAgICAgICAgIEBzcGFuIFwiIGNvbmZpZ3VyYXRpb24gZmlsZSBpbiBhbnkgb2YgdGhlIGZvbGxvd2luZyBsb2NhdGlvbnM6XCJcbiAgICAgICAgQHVsID0+XG4gICAgICAgICAgQGxpID0+XG4gICAgICAgICAgICBAc3BhbiBcIllvdXIgXCJcbiAgICAgICAgICAgIEBzcGFuIFwiI3tjb25maWdGb2xkZXJ9XCIsIHtjbGFzczogXCJ0ZXh0LWluZm9cIn1cbiAgICAgICAgICAgIEBzcGFuIFwiIGZvbGRlciBmb3IgZ2xvYmFsIGNvbW1hbmRzIFwiXG4gICAgICAgICAgICBAYnV0dG9uIFwiRG8gaXQhXCIsIHtjbGFzczonYnRuIGJ0bi1zbSBpbmxpbmUtYmxvY2stdGlnaHQnLCBvdXRsZXQ6ICdnbG9iYWxCdXR0b24nLCBjbGljazonY3JlYXRlR2xvYmFsQ29uZmlndXJhdGlvbkZpbGUnfVxuICAgICAgICAgIEBsaSA9PlxuICAgICAgICAgICAgQHNwYW4gXCJUaGUgcm9vdCBvZiBhbnkgb2YgeW91ciBwcm9qZWN0IGZvbGRlcnMgZm9yIHByb2plY3Qgc3BlY2lmaWMgY29tbWFuZHMgXCJcbiAgICAgICAgICAgIEBidXR0b24gXCJEbyBpdCFcIiwge2NsYXNzOididG4gYnRuLXNtIGlubGluZS1ibG9jay10aWdodCcsIG91dGxldDogJ3Byb2plY3RCdXR0b24nLCBjbGljazonY3JlYXRlUHJvamVjdENvbmZpZ3VyYXRpb25GaWxlJ31cbiAgICAgICAgQHNwYW4gXCJPbmNlIHlvdSd2ZSBjcmVhdGVkIGEgY29uZmlndXJhdGlvbiBmaWxlLCBydW4gXCJcbiAgICAgICAgQHNwYW4gXCJQcm9jZXNzIFBhbGV0dGU6IFJlbG9hZCBDb25maWd1cmF0aW9uXCIsIHtjbGFzczogXCJidG4gYnRuLXNtIGlubGluZS1ibG9jay10aWdodFwiLCBjbGljazoncmVsb2FkQ29uZmlndXJhdGlvbid9XG4gICAgICAgIEBzcGFuIFwidG8gbG9hZCBpdC5cIlxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGdsb2JhbEJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICBAcHJvamVjdEJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcblxuICBjcmVhdGVHbG9iYWxDb25maWd1cmF0aW9uRmlsZTogLT5cbiAgICBjb25maWdGaWxlID0gbmV3IEZpbGUoYXRvbS5jb25maWcuZ2V0VXNlckNvbmZpZ1BhdGgoKSk7XG4gICAgQG1haW4uZ3VpRWRpdENvbmZpZ3VyYXRpb24odHJ1ZSwgJycsIGNvbmZpZ0ZpbGUuZ2V0UGFyZW50KCkuZ2V0UmVhbFBhdGhTeW5jKCkpO1xuXG4gIGNyZWF0ZVByb2plY3RDb25maWd1cmF0aW9uRmlsZTogLT5cbiAgICBAbWFpbi5lZGl0Q29uZmlndXJhdGlvbihmYWxzZSk7XG5cbiAgY3JlYXRlQ29uZmlndXJhdGlvbkZpbGU6IChjb25maWdGb2xkZXIpIC0+XG4gICAgY29uZmlnRmlsZSA9IGNvbmZpZ0ZvbGRlci5nZXRGaWxlKFwicHJvY2Vzcy1wYWxldHRlLmpzb25cIik7XG4gICAgUGF0aCA/PSByZXF1aXJlICdwYXRoJ1xuXG4gICAgaWYgIWNvbmZpZ0ZpbGUuZXhpc3RzU3luYygpXG4gICAgICBwYWNrYWdlUGF0aCA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgncHJvY2Vzcy1wYWxldHRlJykucGF0aFxuICAgICAgZmlsZSA9IG5ldyBGaWxlKFBhdGguam9pbihwYWNrYWdlUGF0aCwgJ2V4YW1wbGVzJywgJ3Byb2Nlc3MtcGFsZXR0ZS5qc29uJykpO1xuXG4gICAgICBmaWxlLnJlYWQoZmFsc2UpLnRoZW4gKGNvbnRlbnQpID0+XG4gICAgICAgIGNvbmZpZ0ZpbGUuY3JlYXRlKCkudGhlbiA9PlxuICAgICAgICAgIGNvbmZpZ0ZpbGUud3JpdGVTeW5jKGNvbnRlbnQpO1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oY29uZmlnRmlsZS5nZXRQYXRoKCkpO1xuICAgIGVsc2VcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oY29uZmlnRmlsZS5nZXRQYXRoKCkpO1xuXG4gIHJlbG9hZENvbmZpZ3VyYXRpb246IC0+XG4gICAgQG1haW4ucmVsb2FkQ29uZmlndXJhdGlvbigpO1xuXG4gIHNlcmlhbGl6ZTogLT5cblxuICBkZXN0cm95OiAtPlxuICAgIEBlbGVtZW50LnJlbW92ZSgpO1xuXG4gIGdldEVsZW1lbnQ6IC0+XG4gICAgQGVsZW1lbnRcbiJdfQ==
