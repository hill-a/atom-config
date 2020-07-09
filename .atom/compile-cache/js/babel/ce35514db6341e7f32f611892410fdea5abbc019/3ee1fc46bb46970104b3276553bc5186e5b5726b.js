Object.defineProperty(exports, "__esModule", {
  value: true
});

var Config = {
  getJson: function getJson(key) {
    var _default = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var value = atom.config.get("Hydrogen." + key);
    if (!value || typeof value !== "string") return _default;
    try {
      return JSON.parse(value);
    } catch (error) {
      var message = "Your Hydrogen config is broken: " + key;
      atom.notifications.addError(message, { detail: error });
    }
    return _default;
  },

  schema: {
    autocomplete: {
      title: "Enable Autocomplete",
      includeTitle: false,
      description: "If enabled, use autocomplete options provided by the current kernel.",
      type: "boolean",
      "default": true,
      order: 0
    },
    autocompleteSuggestionPriority: {
      title: "Autocomple Suggestion Priority",
      description: "Specify the sort order of Hydrogen's autocomplete suggestions. Note the default providers like snippets have priority of `1`. Requires a restart to take an effect.",
      type: "integer",
      "default": 3,
      order: 1
    },
    showInspectorResultsInAutocomplete: {
      title: "Enable Autocomplete description (Experimental)",
      description: "If enabled, Hydrogen will try to show [the results from kernel inspection](https://nteract.gitbooks.io/hydrogen/docs/Usage/GettingStarted.html#hydrogen-toggle-inspector) in each autocomplete suggestion's description. ⚠ May slow down the autocompletion performance. (**Note**: Even if you disable this, you would still get autocomplete suggestions.)",
      type: "boolean",
      "default": false, // @NOTE: Disable this feature by default since it's still experimental
      order: 2
    },
    importNotebookURI: {
      title: "Enable Notebook Auto-import",
      description: "If enabled, opening a file with extension `.ipynb` will [import the notebook](https://nteract.gitbooks.io/hydrogen/docs/Usage/NotebookFiles.html#notebook-import) file's source into a new tab. If disabled, or if the Hydrogen package is not activated, the raw file will open in Atom as normal.",
      type: "boolean",
      "default": true,
      order: 3
    },
    statusBarDisable: {
      title: "Disable the Hydrogen status bar",
      description: "If enabled, no kernel information will be provided in Atom's status bar.",
      type: "boolean",
      "default": false,
      order: 4
    },
    debug: {
      title: "Enable Debug Messages",
      includeTitle: false,
      description: "If enabled, log debug messages onto the dev console.",
      type: "boolean",
      "default": false,
      order: 5
    },
    autoScroll: {
      title: "Enable Autoscroll",
      includeTitle: false,
      description: "If enabled, Hydrogen will automatically scroll to the bottom of the result view.",
      type: "boolean",
      "default": true,
      order: 6
    },
    wrapOutput: {
      title: "Enable Soft Wrap for Output",
      includeTitle: false,
      description: "If enabled, your output code from Hydrogen will break long text and items.",
      type: "boolean",
      "default": false,
      order: 7
    },
    outputAreaDefault: {
      title: "View output in the dock by default",
      description: "If enabled, output will be displayed in the dock by default rather than inline",
      type: "boolean",
      "default": false,
      order: 8
    },
    outputAreaDock: {
      title: "Leave output dock open",
      description: "Do not close dock when switching to an editor without a running kernel",
      type: "boolean",
      "default": false,
      order: 9
    },
    outputAreaFontSize: {
      title: "Output area fontsize",
      includeTitle: false,
      description: "Change the fontsize of the Output area.",
      type: "integer",
      minimum: 0,
      "default": 0,
      order: 10
    },
    globalMode: {
      title: "Enable Global Kernel",
      description: "If enabled, all files of the same grammar will share a single global kernel (requires Atom restart)",
      type: "boolean",
      "default": false,
      order: 11
    },
    kernelNotifications: {
      title: "Enable Kernel Notifications",
      includeTitle: false,
      description: "Notify if kernels writes to stdout. By default, kernel notifications are only displayed in the developer console.",
      type: "boolean",
      "default": false,
      order: 12
    },
    startDir: {
      title: "Directory to start kernel in",
      includeTitle: false,
      description: "Restart the kernel for changes to take effect.",
      type: "string",
      "enum": [{
        value: "firstProjectDir",
        description: "The first started project's directory (default)"
      }, {
        value: "projectDirOfFile",
        description: "The project directory relative to the file"
      }, {
        value: "dirOfFile",
        description: "Current directory of the file"
      }],
      "default": "firstProjectDir",
      order: 13
    },
    languageMappings: {
      title: "Language Mappings",
      includeTitle: false,
      description: 'Custom Atom grammars and some kernels use non-standard language names. That leaves Hydrogen unable to figure out what kernel to start for your code. This field should be a valid JSON mapping from a kernel language name to Atom\'s grammar name ``` { "kernel name": "grammar name" } ```. For example ``` { "scala211": "scala", "javascript": "babel es6 javascript", "python": "magicpython" } ```.',
      type: "string",
      "default": '{ "python": "magicpython" }',
      order: 14
    },
    startupCode: {
      title: "Startup Code",
      includeTitle: false,
      description: 'This code will be executed on kernel startup. Format: `{"kernel": "your code \\nmore code"}`. Example: `{"Python 2": "%matplotlib inline"}`',
      type: "string",
      "default": "{}",
      order: 15
    },
    gateways: {
      title: "Kernel Gateways",
      includeTitle: false,
      description: 'Hydrogen can connect to remote notebook servers and kernel gateways. Each gateway needs at minimum a name and a value for options.baseUrl. The options are passed directly to the `jupyter-js-services` npm package, which includes documentation for additional fields. Example value: ``` [{ "name": "Remote notebook", "options": { "baseUrl": "http://mysite.com:8888" } }] ```',
      type: "string",
      "default": "[]",
      order: 16
    }
  }
};

exports["default"] = Config;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUVBLElBQU0sTUFBTSxHQUFHO0FBQ2IsU0FBTyxFQUFBLGlCQUFDLEdBQVcsRUFBeUI7UUFBdkIsUUFBZ0IseURBQUcsRUFBRTs7QUFDeEMsUUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGVBQWEsR0FBRyxDQUFHLENBQUM7QUFDakQsUUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsT0FBTyxRQUFRLENBQUM7QUFDekQsUUFBSTtBQUNGLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQixDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsVUFBTSxPQUFPLHdDQUFzQyxHQUFHLEFBQUUsQ0FBQztBQUN6RCxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUN6RDtBQUNELFdBQU8sUUFBUSxDQUFDO0dBQ2pCOztBQUVELFFBQU0sRUFBRTtBQUNOLGdCQUFZLEVBQUU7QUFDWixXQUFLLEVBQUUscUJBQXFCO0FBQzVCLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUNULHNFQUFzRTtBQUN4RSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7QUFDYixXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0Qsa0NBQThCLEVBQUU7QUFDOUIsV0FBSyxFQUFFLGdDQUFnQztBQUN2QyxpQkFBVyxFQUNULHFLQUFxSztBQUN2SyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLENBQUM7QUFDVixXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0Qsc0NBQWtDLEVBQUU7QUFDbEMsV0FBSyxFQUFFLGdEQUFnRDtBQUN2RCxpQkFBVyxFQUNULDhWQUE4VjtBQUNoVyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsV0FBSyxFQUFFLDZCQUE2QjtBQUNwQyxpQkFBVyxFQUNULHFTQUFxUztBQUN2UyxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7QUFDYixXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0Qsb0JBQWdCLEVBQUU7QUFDaEIsV0FBSyxFQUFFLGlDQUFpQztBQUN4QyxpQkFBVyxFQUNULDBFQUEwRTtBQUM1RSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QsU0FBSyxFQUFFO0FBQ0wsV0FBSyxFQUFFLHVCQUF1QjtBQUM5QixrQkFBWSxFQUFFLEtBQUs7QUFDbkIsaUJBQVcsRUFBRSxzREFBc0Q7QUFDbkUsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELGNBQVUsRUFBRTtBQUNWLFdBQUssRUFBRSxtQkFBbUI7QUFDMUIsa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQ1Qsa0ZBQWtGO0FBQ3BGLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsSUFBSTtBQUNiLFdBQUssRUFBRSxDQUFDO0tBQ1Q7QUFDRCxjQUFVLEVBQUU7QUFDVixXQUFLLEVBQUUsNkJBQTZCO0FBQ3BDLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUNULDRFQUE0RTtBQUM5RSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsV0FBSyxFQUFFLG9DQUFvQztBQUMzQyxpQkFBVyxFQUNULGdGQUFnRjtBQUNsRixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0Qsa0JBQWMsRUFBRTtBQUNkLFdBQUssRUFBRSx3QkFBd0I7QUFDL0IsaUJBQVcsRUFDVCx3RUFBd0U7QUFDMUUsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELHNCQUFrQixFQUFFO0FBQ2xCLFdBQUssRUFBRSxzQkFBc0I7QUFDN0Isa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQUUseUNBQXlDO0FBQ3RELFVBQUksRUFBRSxTQUFTO0FBQ2YsYUFBTyxFQUFFLENBQUM7QUFDVixpQkFBUyxDQUFDO0FBQ1YsV0FBSyxFQUFFLEVBQUU7S0FDVjtBQUNELGNBQVUsRUFBRTtBQUNWLFdBQUssRUFBRSxzQkFBc0I7QUFDN0IsaUJBQVcsRUFDVCxxR0FBcUc7QUFDdkcsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsV0FBSyxFQUFFLEVBQUU7S0FDVjtBQUNELHVCQUFtQixFQUFFO0FBQ25CLFdBQUssRUFBRSw2QkFBNkI7QUFDcEMsa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQ1QsbUhBQW1IO0FBQ3JILFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSxFQUFFO0tBQ1Y7QUFDRCxZQUFRLEVBQUU7QUFDUixXQUFLLEVBQUUsOEJBQThCO0FBQ3JDLGtCQUFZLEVBQUUsS0FBSztBQUNuQixpQkFBVyxFQUFFLGdEQUFnRDtBQUM3RCxVQUFJLEVBQUUsUUFBUTtBQUNkLGNBQU0sQ0FDSjtBQUNFLGFBQUssRUFBRSxpQkFBaUI7QUFDeEIsbUJBQVcsRUFBRSxpREFBaUQ7T0FDL0QsRUFDRDtBQUNFLGFBQUssRUFBRSxrQkFBa0I7QUFDekIsbUJBQVcsRUFBRSw0Q0FBNEM7T0FDMUQsRUFDRDtBQUNFLGFBQUssRUFBRSxXQUFXO0FBQ2xCLG1CQUFXLEVBQUUsK0JBQStCO09BQzdDLENBQ0Y7QUFDRCxpQkFBUyxpQkFBaUI7QUFDMUIsV0FBSyxFQUFFLEVBQUU7S0FDVjtBQUNELG9CQUFnQixFQUFFO0FBQ2hCLFdBQUssRUFBRSxtQkFBbUI7QUFDMUIsa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQ1QsMllBQTJZO0FBQzdZLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsNkJBQTZCO0FBQ3RDLFdBQUssRUFBRSxFQUFFO0tBQ1Y7QUFDRCxlQUFXLEVBQUU7QUFDWCxXQUFLLEVBQUUsY0FBYztBQUNyQixrQkFBWSxFQUFFLEtBQUs7QUFDbkIsaUJBQVcsRUFDVCw2SUFBNkk7QUFDL0ksVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxJQUFJO0FBQ2IsV0FBSyxFQUFFLEVBQUU7S0FDVjtBQUNELFlBQVEsRUFBRTtBQUNSLFdBQUssRUFBRSxpQkFBaUI7QUFDeEIsa0JBQVksRUFBRSxLQUFLO0FBQ25CLGlCQUFXLEVBQ1QscVhBQXFYO0FBQ3ZYLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsSUFBSTtBQUNiLFdBQUssRUFBRSxFQUFFO0tBQ1Y7R0FDRjtDQUNGLENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmNvbnN0IENvbmZpZyA9IHtcbiAgZ2V0SnNvbihrZXk6IHN0cmluZywgX2RlZmF1bHQ6IE9iamVjdCA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWUgPSBhdG9tLmNvbmZpZy5nZXQoYEh5ZHJvZ2VuLiR7a2V5fWApO1xuICAgIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSByZXR1cm4gX2RlZmF1bHQ7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGBZb3VyIEh5ZHJvZ2VuIGNvbmZpZyBpcyBicm9rZW46ICR7a2V5fWA7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSwgeyBkZXRhaWw6IGVycm9yIH0pO1xuICAgIH1cbiAgICByZXR1cm4gX2RlZmF1bHQ7XG4gIH0sXG5cbiAgc2NoZW1hOiB7XG4gICAgYXV0b2NvbXBsZXRlOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgQXV0b2NvbXBsZXRlXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgdXNlIGF1dG9jb21wbGV0ZSBvcHRpb25zIHByb3ZpZGVkIGJ5IHRoZSBjdXJyZW50IGtlcm5lbC5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIG9yZGVyOiAwXG4gICAgfSxcbiAgICBhdXRvY29tcGxldGVTdWdnZXN0aW9uUHJpb3JpdHk6IHtcbiAgICAgIHRpdGxlOiBcIkF1dG9jb21wbGUgU3VnZ2VzdGlvbiBQcmlvcml0eVwiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiU3BlY2lmeSB0aGUgc29ydCBvcmRlciBvZiBIeWRyb2dlbidzIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9ucy4gTm90ZSB0aGUgZGVmYXVsdCBwcm92aWRlcnMgbGlrZSBzbmlwcGV0cyBoYXZlIHByaW9yaXR5IG9mIGAxYC4gUmVxdWlyZXMgYSByZXN0YXJ0IHRvIHRha2UgYW4gZWZmZWN0LlwiLFxuICAgICAgdHlwZTogXCJpbnRlZ2VyXCIsXG4gICAgICBkZWZhdWx0OiAzLFxuICAgICAgb3JkZXI6IDFcbiAgICB9LFxuICAgIHNob3dJbnNwZWN0b3JSZXN1bHRzSW5BdXRvY29tcGxldGU6IHtcbiAgICAgIHRpdGxlOiBcIkVuYWJsZSBBdXRvY29tcGxldGUgZGVzY3JpcHRpb24gKEV4cGVyaW1lbnRhbClcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIEh5ZHJvZ2VuIHdpbGwgdHJ5IHRvIHNob3cgW3RoZSByZXN1bHRzIGZyb20ga2VybmVsIGluc3BlY3Rpb25dKGh0dHBzOi8vbnRlcmFjdC5naXRib29rcy5pby9oeWRyb2dlbi9kb2NzL1VzYWdlL0dldHRpbmdTdGFydGVkLmh0bWwjaHlkcm9nZW4tdG9nZ2xlLWluc3BlY3RvcikgaW4gZWFjaCBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbidzIGRlc2NyaXB0aW9uLiDimqAgTWF5IHNsb3cgZG93biB0aGUgYXV0b2NvbXBsZXRpb24gcGVyZm9ybWFuY2UuICgqKk5vdGUqKjogRXZlbiBpZiB5b3UgZGlzYWJsZSB0aGlzLCB5b3Ugd291bGQgc3RpbGwgZ2V0IGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9ucy4pXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLCAvLyBATk9URTogRGlzYWJsZSB0aGlzIGZlYXR1cmUgYnkgZGVmYXVsdCBzaW5jZSBpdCdzIHN0aWxsIGV4cGVyaW1lbnRhbFxuICAgICAgb3JkZXI6IDJcbiAgICB9LFxuICAgIGltcG9ydE5vdGVib29rVVJJOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgTm90ZWJvb2sgQXV0by1pbXBvcnRcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIG9wZW5pbmcgYSBmaWxlIHdpdGggZXh0ZW5zaW9uIGAuaXB5bmJgIHdpbGwgW2ltcG9ydCB0aGUgbm90ZWJvb2tdKGh0dHBzOi8vbnRlcmFjdC5naXRib29rcy5pby9oeWRyb2dlbi9kb2NzL1VzYWdlL05vdGVib29rRmlsZXMuaHRtbCNub3RlYm9vay1pbXBvcnQpIGZpbGUncyBzb3VyY2UgaW50byBhIG5ldyB0YWIuIElmIGRpc2FibGVkLCBvciBpZiB0aGUgSHlkcm9nZW4gcGFja2FnZSBpcyBub3QgYWN0aXZhdGVkLCB0aGUgcmF3IGZpbGUgd2lsbCBvcGVuIGluIEF0b20gYXMgbm9ybWFsLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgb3JkZXI6IDNcbiAgICB9LFxuICAgIHN0YXR1c0JhckRpc2FibGU6IHtcbiAgICAgIHRpdGxlOiBcIkRpc2FibGUgdGhlIEh5ZHJvZ2VuIHN0YXR1cyBiYXJcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIG5vIGtlcm5lbCBpbmZvcm1hdGlvbiB3aWxsIGJlIHByb3ZpZGVkIGluIEF0b20ncyBzdGF0dXMgYmFyLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiA0XG4gICAgfSxcbiAgICBkZWJ1Zzoge1xuICAgICAgdGl0bGU6IFwiRW5hYmxlIERlYnVnIE1lc3NhZ2VzXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246IFwiSWYgZW5hYmxlZCwgbG9nIGRlYnVnIG1lc3NhZ2VzIG9udG8gdGhlIGRldiBjb25zb2xlLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiA1XG4gICAgfSxcbiAgICBhdXRvU2Nyb2xsOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgQXV0b3Njcm9sbFwiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIEh5ZHJvZ2VuIHdpbGwgYXV0b21hdGljYWxseSBzY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcmVzdWx0IHZpZXcuXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBvcmRlcjogNlxuICAgIH0sXG4gICAgd3JhcE91dHB1dDoge1xuICAgICAgdGl0bGU6IFwiRW5hYmxlIFNvZnQgV3JhcCBmb3IgT3V0cHV0XCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgeW91ciBvdXRwdXQgY29kZSBmcm9tIEh5ZHJvZ2VuIHdpbGwgYnJlYWsgbG9uZyB0ZXh0IGFuZCBpdGVtcy5cIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogN1xuICAgIH0sXG4gICAgb3V0cHV0QXJlYURlZmF1bHQ6IHtcbiAgICAgIHRpdGxlOiBcIlZpZXcgb3V0cHV0IGluIHRoZSBkb2NrIGJ5IGRlZmF1bHRcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICBcIklmIGVuYWJsZWQsIG91dHB1dCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0aGUgZG9jayBieSBkZWZhdWx0IHJhdGhlciB0aGFuIGlubGluZVwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiA4XG4gICAgfSxcbiAgICBvdXRwdXRBcmVhRG9jazoge1xuICAgICAgdGl0bGU6IFwiTGVhdmUgb3V0cHV0IGRvY2sgb3BlblwiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiRG8gbm90IGNsb3NlIGRvY2sgd2hlbiBzd2l0Y2hpbmcgdG8gYW4gZWRpdG9yIHdpdGhvdXQgYSBydW5uaW5nIGtlcm5lbFwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiA5XG4gICAgfSxcbiAgICBvdXRwdXRBcmVhRm9udFNpemU6IHtcbiAgICAgIHRpdGxlOiBcIk91dHB1dCBhcmVhIGZvbnRzaXplXCIsXG4gICAgICBpbmNsdWRlVGl0bGU6IGZhbHNlLFxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hhbmdlIHRoZSBmb250c2l6ZSBvZiB0aGUgT3V0cHV0IGFyZWEuXCIsXG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgICAgb3JkZXI6IDEwXG4gICAgfSxcbiAgICBnbG9iYWxNb2RlOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgR2xvYmFsIEtlcm5lbFwiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiSWYgZW5hYmxlZCwgYWxsIGZpbGVzIG9mIHRoZSBzYW1lIGdyYW1tYXIgd2lsbCBzaGFyZSBhIHNpbmdsZSBnbG9iYWwga2VybmVsIChyZXF1aXJlcyBBdG9tIHJlc3RhcnQpXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDExXG4gICAgfSxcbiAgICBrZXJuZWxOb3RpZmljYXRpb25zOiB7XG4gICAgICB0aXRsZTogXCJFbmFibGUgS2VybmVsIE5vdGlmaWNhdGlvbnNcIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgXCJOb3RpZnkgaWYga2VybmVscyB3cml0ZXMgdG8gc3Rkb3V0LiBCeSBkZWZhdWx0LCBrZXJuZWwgbm90aWZpY2F0aW9ucyBhcmUgb25seSBkaXNwbGF5ZWQgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiAxMlxuICAgIH0sXG4gICAgc3RhcnREaXI6IHtcbiAgICAgIHRpdGxlOiBcIkRpcmVjdG9yeSB0byBzdGFydCBrZXJuZWwgaW5cIixcbiAgICAgIGluY2x1ZGVUaXRsZTogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogXCJSZXN0YXJ0IHRoZSBrZXJuZWwgZm9yIGNoYW5nZXMgdG8gdGFrZSBlZmZlY3QuXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZW51bTogW1xuICAgICAgICB7XG4gICAgICAgICAgdmFsdWU6IFwiZmlyc3RQcm9qZWN0RGlyXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGZpcnN0IHN0YXJ0ZWQgcHJvamVjdCdzIGRpcmVjdG9yeSAoZGVmYXVsdClcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdmFsdWU6IFwicHJvamVjdERpck9mRmlsZVwiLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBwcm9qZWN0IGRpcmVjdG9yeSByZWxhdGl2ZSB0byB0aGUgZmlsZVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB2YWx1ZTogXCJkaXJPZkZpbGVcIixcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJDdXJyZW50IGRpcmVjdG9yeSBvZiB0aGUgZmlsZVwiXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBkZWZhdWx0OiBcImZpcnN0UHJvamVjdERpclwiLFxuICAgICAgb3JkZXI6IDEzXG4gICAgfSxcbiAgICBsYW5ndWFnZU1hcHBpbmdzOiB7XG4gICAgICB0aXRsZTogXCJMYW5ndWFnZSBNYXBwaW5nc1wiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnQ3VzdG9tIEF0b20gZ3JhbW1hcnMgYW5kIHNvbWUga2VybmVscyB1c2Ugbm9uLXN0YW5kYXJkIGxhbmd1YWdlIG5hbWVzLiBUaGF0IGxlYXZlcyBIeWRyb2dlbiB1bmFibGUgdG8gZmlndXJlIG91dCB3aGF0IGtlcm5lbCB0byBzdGFydCBmb3IgeW91ciBjb2RlLiBUaGlzIGZpZWxkIHNob3VsZCBiZSBhIHZhbGlkIEpTT04gbWFwcGluZyBmcm9tIGEga2VybmVsIGxhbmd1YWdlIG5hbWUgdG8gQXRvbVxcJ3MgZ3JhbW1hciBuYW1lIGBgYCB7IFwia2VybmVsIG5hbWVcIjogXCJncmFtbWFyIG5hbWVcIiB9IGBgYC4gRm9yIGV4YW1wbGUgYGBgIHsgXCJzY2FsYTIxMVwiOiBcInNjYWxhXCIsIFwiamF2YXNjcmlwdFwiOiBcImJhYmVsIGVzNiBqYXZhc2NyaXB0XCIsIFwicHl0aG9uXCI6IFwibWFnaWNweXRob25cIiB9IGBgYC4nLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6ICd7IFwicHl0aG9uXCI6IFwibWFnaWNweXRob25cIiB9JyxcbiAgICAgIG9yZGVyOiAxNFxuICAgIH0sXG4gICAgc3RhcnR1cENvZGU6IHtcbiAgICAgIHRpdGxlOiBcIlN0YXJ0dXAgQ29kZVwiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnVGhpcyBjb2RlIHdpbGwgYmUgZXhlY3V0ZWQgb24ga2VybmVsIHN0YXJ0dXAuIEZvcm1hdDogYHtcImtlcm5lbFwiOiBcInlvdXIgY29kZSBcXFxcbm1vcmUgY29kZVwifWAuIEV4YW1wbGU6IGB7XCJQeXRob24gMlwiOiBcIiVtYXRwbG90bGliIGlubGluZVwifWAnLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwie31cIixcbiAgICAgIG9yZGVyOiAxNVxuICAgIH0sXG4gICAgZ2F0ZXdheXM6IHtcbiAgICAgIHRpdGxlOiBcIktlcm5lbCBHYXRld2F5c1wiLFxuICAgICAgaW5jbHVkZVRpdGxlOiBmYWxzZSxcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnSHlkcm9nZW4gY2FuIGNvbm5lY3QgdG8gcmVtb3RlIG5vdGVib29rIHNlcnZlcnMgYW5kIGtlcm5lbCBnYXRld2F5cy4gRWFjaCBnYXRld2F5IG5lZWRzIGF0IG1pbmltdW0gYSBuYW1lIGFuZCBhIHZhbHVlIGZvciBvcHRpb25zLmJhc2VVcmwuIFRoZSBvcHRpb25zIGFyZSBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIGBqdXB5dGVyLWpzLXNlcnZpY2VzYCBucG0gcGFja2FnZSwgd2hpY2ggaW5jbHVkZXMgZG9jdW1lbnRhdGlvbiBmb3IgYWRkaXRpb25hbCBmaWVsZHMuIEV4YW1wbGUgdmFsdWU6IGBgYCBbeyBcIm5hbWVcIjogXCJSZW1vdGUgbm90ZWJvb2tcIiwgXCJvcHRpb25zXCI6IHsgXCJiYXNlVXJsXCI6IFwiaHR0cDovL215c2l0ZS5jb206ODg4OFwiIH0gfV0gYGBgJyxcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIltdXCIsXG4gICAgICBvcmRlcjogMTZcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZztcbiJdfQ==