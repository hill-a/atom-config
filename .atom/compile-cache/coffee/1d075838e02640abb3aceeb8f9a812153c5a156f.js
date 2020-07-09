(function() {
  var $, $$, CompositeDisposable, ProcessView, ProjectView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, View = ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  ProcessView = null;

  module.exports = ProjectView = (function(superClass) {
    extend(ProjectView, superClass);

    function ProjectView(controller1) {
      this.controller = controller1;
      this.showProcessOutput = bind(this.showProcessOutput, this);
      this.getProcessView = bind(this.getProcessView, this);
      this.removeConfigController = bind(this.removeConfigController, this);
      this.addConfigController = bind(this.addConfigController, this);
      ProjectView.__super__.constructor.call(this, this.controller);
      this.processViews = [];
      this.folded = false;
      this.disposables = new CompositeDisposable();
      this.disposables.add(atom.config.onDidChange('process-palette.palettePanel.showCommand', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.setCommandVisible(newValue);
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('process-palette.palettePanel.showOutputTarget', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.setOutputTargetVisible(newValue);
        };
      })(this)));
    }

    ProjectView.content = function(controller) {
      return this.div({
        "class": "project-view"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "project-heading hand-cursor",
            click: "toggleFolded"
          }, function() {
            _this.div({
              "class": "name",
              outlet: "projectName"
            });
            return _this.span({
              "class": "icon icon-fold",
              outlet: "foldButton"
            });
          });
          return _this.div({
            "class": "process-list",
            outlet: "processList"
          });
        };
      })(this));
    };

    ProjectView.prototype.initialize = function() {
      this.projectName.html(this.controller.getDisplayName());
      return this.foldButton.on('mousedown', function(e) {
        return e.preventDefault();
      });
    };

    ProjectView.prototype.toggleFolded = function() {
      if (this.folded) {
        this.foldButton.addClass('icon-fold');
        this.foldButton.removeClass('icon-unfold');
      } else {
        this.foldButton.addClass('icon-unfold');
        this.foldButton.removeClass('icon-fold');
      }
      this.folded = !this.folded;
      if (this.folded) {
        return this.processList.hide();
      } else {
        return this.processList.show();
      }
    };

    ProjectView.prototype.setCommandVisible = function(visible) {
      var i, len, processView, ref1, results;
      ref1 = this.processViews;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        processView = ref1[i];
        results.push(processView.setCommandVisible(visible));
      }
      return results;
    };

    ProjectView.prototype.setOutputTargetVisible = function(visible) {
      var i, len, processView, ref1, results;
      ref1 = this.processViews;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        processView = ref1[i];
        results.push(processView.setOutputTargetVisible(visible));
      }
      return results;
    };

    ProjectView.prototype.addConfigController = function(configController) {
      var processView;
      if (ProcessView == null) {
        ProcessView = require('./process-view');
      }
      processView = new ProcessView(configController);
      this.processViews.push(processView);
      return this.processList.append($$(function() {
        return this.div((function(_this) {
          return function() {
            return _this.subview(configController.config.id, processView);
          };
        })(this));
      }));
    };

    ProjectView.prototype.removeConfigController = function(configController) {
      var index, processView;
      processView = this.getProcessView(configController);
      if (processView) {
        index = this.processViews.indexOf(processView);
        this.processViews.splice(index, 1);
        return processView.destroy();
      }
    };

    ProjectView.prototype.getProcessView = function(configController) {
      var i, len, processView, ref1;
      ref1 = this.processViews;
      for (i = 0, len = ref1.length; i < len; i++) {
        processView = ref1[i];
        if (processView.configController === configController) {
          return processView;
        }
      }
      return null;
    };

    ProjectView.prototype.showProcessOutput = function(processController) {
      return processController.showProcessOutput();
    };

    ProjectView.prototype.serialize = function() {};

    ProjectView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.processList.remove();
    };

    ProjectView.prototype.getElement = function() {
      return this.element;
    };

    ProjectView.prototype.parentHeightChanged = function(parentHeight) {};

    return ProjectView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvcHJvY2Vzcy1wYWxldHRlL2xpYi92aWV3cy9wcm9qZWN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrREFBQTtJQUFBOzs7O0VBQUEsTUFBZ0IsT0FBQSxDQUFRLHNCQUFSLENBQWhCLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUTs7RUFDUCxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLFdBQUEsR0FBYzs7RUFFZCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFFUyxxQkFBQyxXQUFEO01BQUMsSUFBQyxDQUFBLGFBQUQ7Ozs7O01BQ1osNkNBQU0sSUFBQyxDQUFBLFVBQVA7TUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLG1CQUFKLENBQUE7TUFFZixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDBDQUF4QixFQUFvRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUEwQixjQUFBO1VBQXhCLHlCQUFVO2lCQUFjLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixRQUFuQjtRQUExQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEUsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLCtDQUF4QixFQUF5RSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUEwQixjQUFBO1VBQXhCLHlCQUFVO2lCQUFjLEtBQUMsQ0FBQSxzQkFBRCxDQUF3QixRQUF4QjtRQUExQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekUsQ0FBakI7SUFQVzs7SUFT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QUFIO1FBQ0UsS0FBQSxHQUFRLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixXQUF0QjtRQUNSLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFxQixLQUFyQixFQUE0QixDQUE1QjtlQUNBLFdBQVcsQ0FBQyxPQUFaLENBQUEsRUFIRjs7SUFIc0I7OzBCQVF4QixjQUFBLEdBQWdCLFNBQUMsZ0JBQUQ7QUFDZCxVQUFBO0FBQUE7QUFBQSxXQUFBLHNDQUFBOztRQUNFLElBQUcsV0FBVyxDQUFDLGdCQUFaLEtBQWdDLGdCQUFuQztBQUNFLGlCQUFPLFlBRFQ7O0FBREY7QUFJQSxhQUFPO0lBTE87OzBCQU9oQixpQkFBQSxHQUFtQixTQUFDLGlCQUFEO2FBQ2pCLGlCQUFpQixDQUFDLGlCQUFsQixDQUFBO0lBRGlCOzswQkFHbkIsU0FBQSxHQUFXLFNBQUEsR0FBQTs7MEJBRVgsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFBO0lBRk87OzBCQUlULFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBO0lBRFM7OzBCQUdaLG1CQUFBLEdBQXFCLFNBQUMsWUFBRCxHQUFBOzs7O0tBakZHO0FBTjFCIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkLCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuUHJvY2Vzc1ZpZXcgPSBudWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBQcm9qZWN0VmlldyBleHRlbmRzIFZpZXdcblxuICBjb25zdHJ1Y3RvcjogKEBjb250cm9sbGVyKSAtPlxuICAgIHN1cGVyKEBjb250cm9sbGVyKTtcbiAgICBAcHJvY2Vzc1ZpZXdzID0gW107XG4gICAgQGZvbGRlZCA9IGZhbHNlO1xuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdwcm9jZXNzLXBhbGV0dGUucGFsZXR0ZVBhbmVsLnNob3dDb21tYW5kJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PiBAc2V0Q29tbWFuZFZpc2libGUobmV3VmFsdWUpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAncHJvY2Vzcy1wYWxldHRlLnBhbGV0dGVQYW5lbC5zaG93T3V0cHV0VGFyZ2V0JywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PiBAc2V0T3V0cHV0VGFyZ2V0VmlzaWJsZShuZXdWYWx1ZSlcblxuICBAY29udGVudDogKGNvbnRyb2xsZXIpIC0+XG4gICAgQGRpdiB7Y2xhc3M6IFwicHJvamVjdC12aWV3XCJ9LCA9PlxuICAgICAgQGRpdiB7Y2xhc3M6IFwicHJvamVjdC1oZWFkaW5nIGhhbmQtY3Vyc29yXCIsIGNsaWNrOiBcInRvZ2dsZUZvbGRlZFwifSwgPT5cbiAgICAgICAgQGRpdiB7Y2xhc3M6IFwibmFtZVwiLCBvdXRsZXQ6IFwicHJvamVjdE5hbWVcIn1cbiAgICAgICAgQHNwYW4ge2NsYXNzOiBcImljb24gaWNvbi1mb2xkXCIsIG91dGxldDogXCJmb2xkQnV0dG9uXCJ9XG4gICAgICBAZGl2IHtjbGFzczogXCJwcm9jZXNzLWxpc3RcIiwgb3V0bGV0OiBcInByb2Nlc3NMaXN0XCJ9XG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAcHJvamVjdE5hbWUuaHRtbChAY29udHJvbGxlci5nZXREaXNwbGF5TmFtZSgpKTtcbiAgICBAZm9sZEJ1dHRvbi5vbiAnbW91c2Vkb3duJywgKGUpIC0+IGUucHJldmVudERlZmF1bHQoKTtcblxuICB0b2dnbGVGb2xkZWQ6IC0+XG4gICAgaWYgQGZvbGRlZFxuICAgICAgQGZvbGRCdXR0b24uYWRkQ2xhc3MoJ2ljb24tZm9sZCcpO1xuICAgICAgQGZvbGRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2ljb24tdW5mb2xkJyk7XG4gICAgZWxzZVxuICAgICAgQGZvbGRCdXR0b24uYWRkQ2xhc3MoJ2ljb24tdW5mb2xkJyk7XG4gICAgICBAZm9sZEJ1dHRvbi5yZW1vdmVDbGFzcygnaWNvbi1mb2xkJyk7XG5cbiAgICBAZm9sZGVkID0gIUBmb2xkZWQ7XG5cbiAgICBpZiBAZm9sZGVkXG4gICAgICBAcHJvY2Vzc0xpc3QuaGlkZSgpO1xuICAgIGVsc2VcbiAgICAgIEBwcm9jZXNzTGlzdC5zaG93KCk7XG5cbiAgc2V0Q29tbWFuZFZpc2libGU6ICh2aXNpYmxlKSAtPlxuICAgIGZvciBwcm9jZXNzVmlldyBpbiBAcHJvY2Vzc1ZpZXdzXG4gICAgICBwcm9jZXNzVmlldy5zZXRDb21tYW5kVmlzaWJsZSh2aXNpYmxlKTtcblxuICBzZXRPdXRwdXRUYXJnZXRWaXNpYmxlOiAodmlzaWJsZSkgLT5cbiAgICBmb3IgcHJvY2Vzc1ZpZXcgaW4gQHByb2Nlc3NWaWV3c1xuICAgICAgcHJvY2Vzc1ZpZXcuc2V0T3V0cHV0VGFyZ2V0VmlzaWJsZSh2aXNpYmxlKTtcblxuICBhZGRDb25maWdDb250cm9sbGVyOiAoY29uZmlnQ29udHJvbGxlcikgPT5cbiAgICBQcm9jZXNzVmlldyA/PSByZXF1aXJlICcuL3Byb2Nlc3MtdmlldydcbiAgICBwcm9jZXNzVmlldyA9IG5ldyBQcm9jZXNzVmlldyhjb25maWdDb250cm9sbGVyKTtcbiAgICBAcHJvY2Vzc1ZpZXdzLnB1c2gocHJvY2Vzc1ZpZXcpO1xuXG4gICAgQHByb2Nlc3NMaXN0LmFwcGVuZCAkJCAtPlxuICAgICAgQGRpdiA9PlxuICAgICAgICBAc3VidmlldyBjb25maWdDb250cm9sbGVyLmNvbmZpZy5pZCwgcHJvY2Vzc1ZpZXdcblxuICByZW1vdmVDb25maWdDb250cm9sbGVyOiAoY29uZmlnQ29udHJvbGxlcikgPT5cbiAgICBwcm9jZXNzVmlldyA9IEBnZXRQcm9jZXNzVmlldyhjb25maWdDb250cm9sbGVyKTtcblxuICAgIGlmIHByb2Nlc3NWaWV3XG4gICAgICBpbmRleCA9IEBwcm9jZXNzVmlld3MuaW5kZXhPZihwcm9jZXNzVmlldyk7XG4gICAgICBAcHJvY2Vzc1ZpZXdzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICBwcm9jZXNzVmlldy5kZXN0cm95KCk7XG5cbiAgZ2V0UHJvY2Vzc1ZpZXc6IChjb25maWdDb250cm9sbGVyKSA9PlxuICAgIGZvciBwcm9jZXNzVmlldyBpbiBAcHJvY2Vzc1ZpZXdzXG4gICAgICBpZiBwcm9jZXNzVmlldy5jb25maWdDb250cm9sbGVyID09IGNvbmZpZ0NvbnRyb2xsZXJcbiAgICAgICAgcmV0dXJuIHByb2Nlc3NWaWV3O1xuXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgc2hvd1Byb2Nlc3NPdXRwdXQ6IChwcm9jZXNzQ29udHJvbGxlcikgPT5cbiAgICBwcm9jZXNzQ29udHJvbGxlci5zaG93UHJvY2Vzc091dHB1dCgpO1xuXG4gIHNlcmlhbGl6ZTogLT5cblxuICBkZXN0cm95OiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgQHByb2Nlc3NMaXN0LnJlbW92ZSgpO1xuXG4gIGdldEVsZW1lbnQ6IC0+XG4gICAgQGVsZW1lbnRcblxuICBwYXJlbnRIZWlnaHRDaGFuZ2VkOiAocGFyZW50SGVpZ2h0KSAtPlxuICAgICMgQHByb2Nlc3NMaXN0LmhlaWdodChwYXJlbnRIZWlnaHQpO1xuIl19
