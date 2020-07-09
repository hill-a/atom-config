(function() {
  var TreeViewController;

  module.exports = TreeViewController = (function() {
    function TreeViewController(main) {
      this.main = main;
      this.editConfigDisposable = null;
    }

    TreeViewController.prototype.recreateContextMenu = function() {
      this.recreateCommandMenuItems();
      return this.recreateEditConfigMenuItem();
    };

    TreeViewController.prototype.recreateCommandMenuItems = function() {
      var configCtrls;
      configCtrls = this.main.getAllConfigControllers();
      configCtrls.sort(function(a, b) {
        return a.config.action.localeCompare(b.config.action);
      });
      return configCtrls.forEach(function(c) {
        return c.recreateTreeViewMenuItem();
      });
    };

    TreeViewController.prototype.recreateEditConfigMenuItem = function() {
      var ref, root;
      if ((ref = this.editConfigDisposable) != null) {
        ref.dispose();
      }
      root = {
        label: 'Run With',
        submenu: [
          {
            type: 'separator'
          }, {
            label: 'Edit Configuration',
            command: 'process-palette:edit-configuration'
          }
        ]
      };
      return this.editConfigDisposable = atom.contextMenu.add({
        '.tree-view': [root]
      });
    };

    TreeViewController.prototype.dispose = function() {
      var ref;
      return (ref = this.editConfigDisposable) != null ? ref.dispose() : void 0;
    };

    return TreeViewController;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvcHJvY2Vzcy1wYWxldHRlL2xpYi9jb250cm9sbGVycy90cmVlLXZpZXctY29udHJvbGxlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFUyw0QkFBQyxJQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWixJQUFDLENBQUEsb0JBQUQsR0FBd0I7SUFEYjs7aUNBR2IsbUJBQUEsR0FBcUIsU0FBQTtNQUNuQixJQUFDLENBQUEsd0JBQUQsQ0FBQTthQUVBLElBQUMsQ0FBQSwwQkFBRCxDQUFBO0lBSG1COztpQ0FLckIsd0JBQUEsR0FBMEIsU0FBQTtBQUV4QixVQUFBO01BQUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxJQUFJLENBQUMsdUJBQU4sQ0FBQTtNQUNkLFdBQVcsQ0FBQyxJQUFaLENBQWlCLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFoQixDQUE4QixDQUFDLENBQUMsTUFBTSxDQUFDLE1BQXZDO01BQVYsQ0FBakI7YUFDQSxXQUFXLENBQUMsT0FBWixDQUFvQixTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsd0JBQUYsQ0FBQTtNQUFQLENBQXBCO0lBSndCOztpQ0FNMUIsMEJBQUEsR0FBNEIsU0FBQTtBQUMxQixVQUFBOztXQUFxQixDQUFFLE9BQXZCLENBQUE7O01BRUEsSUFBQSxHQUFPO1FBQ0wsS0FBQSxFQUFPLFVBREY7UUFFTCxPQUFBLEVBQVM7VUFDUDtZQUFFLElBQUEsRUFBTSxXQUFSO1dBRE8sRUFFUDtZQUNFLEtBQUEsRUFBTyxvQkFEVDtZQUVFLE9BQUEsRUFBUyxvQ0FGWDtXQUZPO1NBRko7O2FBV1AsSUFBQyxDQUFBLG9CQUFELEdBQXdCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBakIsQ0FBcUI7UUFBQyxZQUFBLEVBQWMsQ0FBQyxJQUFELENBQWY7T0FBckI7SUFkRTs7aUNBZ0I1QixPQUFBLEdBQVMsU0FBQTtBQUdQLFVBQUE7NERBQXFCLENBQUUsT0FBdkIsQ0FBQTtJQUhPOzs7OztBQWpDWCIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRyZWVWaWV3Q29udHJvbGxlclxuXG4gIGNvbnN0cnVjdG9yOiAoQG1haW4pIC0+XG4gICAgQGVkaXRDb25maWdEaXNwb3NhYmxlID0gbnVsbDtcblxuICByZWNyZWF0ZUNvbnRleHRNZW51OiAtPlxuICAgIEByZWNyZWF0ZUNvbW1hbmRNZW51SXRlbXMoKTtcbiAgICAjIFBsYWNlIHRoZSAnRWRpdCBDb25maWd1cmF0aW9uJyBtZW51IGl0ZW0gYXQgdGhlIGJvdHRvbS5cbiAgICBAcmVjcmVhdGVFZGl0Q29uZmlnTWVudUl0ZW0oKTtcblxuICByZWNyZWF0ZUNvbW1hbmRNZW51SXRlbXM6IC0+XG4gICAgIyBHZXQgYWxsIHRoZSBjb25maWcgY29udHJvbGxlcnMgYW5kIHNvcnQgdGhlbSBhbHBoYWJldGljYWxseSBieSBhY3Rpb24uXG4gICAgY29uZmlnQ3RybHMgPSBAbWFpbi5nZXRBbGxDb25maWdDb250cm9sbGVycygpO1xuICAgIGNvbmZpZ0N0cmxzLnNvcnQgKGEsIGIpIC0+IGEuY29uZmlnLmFjdGlvbi5sb2NhbGVDb21wYXJlKGIuY29uZmlnLmFjdGlvbilcbiAgICBjb25maWdDdHJscy5mb3JFYWNoIChjKSAtPiBjLnJlY3JlYXRlVHJlZVZpZXdNZW51SXRlbSgpXG5cbiAgcmVjcmVhdGVFZGl0Q29uZmlnTWVudUl0ZW06IC0+XG4gICAgQGVkaXRDb25maWdEaXNwb3NhYmxlPy5kaXNwb3NlKCk7XG5cbiAgICByb290ID0ge1xuICAgICAgbGFiZWw6ICdSdW4gV2l0aCcsXG4gICAgICBzdWJtZW51OiBbXG4gICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfVxuICAgICAgICB7XG4gICAgICAgICAgbGFiZWw6ICdFZGl0IENvbmZpZ3VyYXRpb24nLFxuICAgICAgICAgIGNvbW1hbmQ6ICdwcm9jZXNzLXBhbGV0dGU6ZWRpdC1jb25maWd1cmF0aW9uJ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcblxuICAgIEBlZGl0Q29uZmlnRGlzcG9zYWJsZSA9IGF0b20uY29udGV4dE1lbnUuYWRkKHsnLnRyZWUtdmlldyc6IFtyb290XX0pO1xuXG4gIGRpc3Bvc2U6IC0+XG4gICAgIyBJdCBpcyBub3QgbmVjZXNzYXJ5IHRvIGRpc3Bvc2Ugb2YgZWFjaCBjb25maWcgY29udHJvbGxlcidzIG1lbnUgaXRlbXMuXG4gICAgIyBUaGVzZSB3aWxsIGJlIGRpc3Bvc2VkIG9mIHdoZW4gdGhlIGNvbmZpZyBjb250cm9sbGVycyBhcmUgZGlzcG9zZWQgb2YuXG4gICAgQGVkaXRDb25maWdEaXNwb3NhYmxlPy5kaXNwb3NlKCk7XG4iXX0=
