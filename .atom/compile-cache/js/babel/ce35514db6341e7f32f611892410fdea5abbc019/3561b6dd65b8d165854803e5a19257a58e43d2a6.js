Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.provideAutocompleteResults = provideAutocompleteResults;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _anser = require("anser");

var _utils = require("../../utils");

var iconHTML = "<img src='" + __dirname + "/../../../static/logo.svg' style='width: 100%;'>";

var regexes = {
  // pretty dodgy, adapted from http://stackoverflow.com/a/8396658
  r: /([^\d\W]|[.])[\w.$]*$/,

  // adapted from http://stackoverflow.com/q/5474008
  python: /([^\d\W]|[\u00A0-\uFFFF])[\w.\u00A0-\uFFFF]*$/,

  // adapted from http://php.net/manual/en/language.variables.basics.php
  php: /[$a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/
};

function parseCompletions(results, prefix) {
  var matches = results.matches;
  var metadata = results.metadata;

  // @NOTE: This can make invalid `replacedPrefix` and `replacedText` when a line includes unicode characters
  // @TODO (@aviatesk): Use `Regex` to detect them regardless of the `results.cursor_*` feedbacks from kernels
  var cursor_start = (0, _utils.char_idx_to_js_idx)(results.cursor_start, prefix);
  var cursor_end = (0, _utils.char_idx_to_js_idx)(results.cursor_end, prefix);

  if (metadata && metadata._jupyter_types_experimental) {
    var comps = metadata._jupyter_types_experimental;
    if (comps.length > 0 && comps[0].text) {
      return _lodash2["default"].map(comps, function (match) {
        var text = match.text;
        var start = match.start && match.end ? match.start : cursor_start;
        var end = match.start && match.end ? match.end : cursor_end;
        var replacementPrefix = prefix.slice(start, end);
        var replacedText = prefix.slice(0, start) + text;
        var type = match.type;
        return {
          text: text,
          replacementPrefix: replacementPrefix,
          replacedText: replacedText,
          iconHTML: !type || type === "<unknown>" ? iconHTML : undefined,
          type: type
        };
      });
    }
  }

  var replacementPrefix = prefix.slice(cursor_start, cursor_end);

  return _lodash2["default"].map(matches, function (match) {
    var text = match;
    var replacedText = prefix.slice(0, cursor_start) + text;
    return {
      text: text,
      replacementPrefix: replacementPrefix,
      replacedText: replacedText,
      iconHTML: iconHTML
    };
  });
}

function provideAutocompleteResults(store) {
  var autocompleteProvider = {
    selector: ".source",
    disableForSelector: ".comment",

    // The default provider has an inclusion priority of 0.
    inclusionPriority: 1,

    // The default provider has a suggestion priority of 1.
    suggestionPriority: atom.config.get("Hydrogen.autocompleteSuggestionPriority"),

    // It won't suppress providers with lower priority.
    excludeLowerPriority: false,

    // Required: Return a promise, an array of suggestions, or null.
    getSuggestions: function getSuggestions(_ref) {
      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      if (!atom.config.get("Hydrogen.autocomplete")) return null;

      var kernel = store.kernel;
      if (!kernel || kernel.executionState !== "idle") return null;

      var line = editor.getTextInBufferRange([[bufferPosition.row, 0], bufferPosition]);

      var regex = regexes[kernel.language];
      if (regex) {
        prefix = _lodash2["default"].head(line.match(regex)) || "";
      } else {
        prefix = line;
      }

      // return if cursor is at whitespace
      if (prefix.trimRight().length < prefix.length) return null;

      var minimumWordLength = atom.config.get("autocomplete-plus.minimumWordLength");
      if (typeof minimumWordLength !== "number") {
        minimumWordLength = 3;
      }

      if (prefix.trim().length < minimumWordLength) return null;

      (0, _utils.log)("autocompleteProvider: request:", line, bufferPosition, prefix);

      var promise = new Promise(function (resolve) {
        kernel.complete(prefix, function (results) {
          return resolve(parseCompletions(results, prefix));
        });
      });

      return Promise.race([promise, this.timeout()]);
    },

    getSuggestionDetailsOnSelect: function getSuggestionDetailsOnSelect(_ref2) {
      var text = _ref2.text;
      var replacementPrefix = _ref2.replacementPrefix;
      var replacedText = _ref2.replacedText;
      var iconHTML = _ref2.iconHTML;
      var type = _ref2.type;

      if (!atom.config.get("Hydrogen.showInspectorResultsInAutocomplete")) return null;

      var kernel = store.kernel;
      if (!kernel || kernel.executionState !== "idle") return null;

      var promise = new Promise(function (resolve) {
        kernel.inspect(replacedText, replacedText.length, function (_ref3) {
          var found = _ref3.found;
          var data = _ref3.data;

          if (!found || !data["text/plain"]) {
            resolve(null);
            return;
          }
          var description = (0, _anser.ansiToText)(data["text/plain"]);
          resolve({
            text: text,
            replacementPrefix: replacementPrefix,
            replacedText: replacedText,
            iconHTML: iconHTML,
            type: type,
            description: description
          });
        });
      });

      return Promise.race([promise, this.timeout()]);
    },

    timeout: function timeout() {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(null);
        }, 1000);
      });
    }
  };

  return autocompleteProvider;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9wcm92aWRlZC9hdXRvY29tcGxldGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztzQkFFYyxRQUFROzs7O3FCQUNLLE9BQU87O3FCQUVNLGFBQWE7O0FBaUJyRCxJQUFNLFFBQVEsa0JBQWdCLFNBQVMscURBQWtELENBQUM7O0FBRTFGLElBQU0sT0FBTyxHQUFHOztBQUVkLEdBQUMsRUFBRSx1QkFBdUI7OztBQUcxQixRQUFNLEVBQUUsK0NBQStDOzs7QUFHdkQsS0FBRyxFQUFFLDRDQUE0QztDQUNsRCxDQUFDOztBQUVGLFNBQVMsZ0JBQWdCLENBQUMsT0FBc0IsRUFBRSxNQUFjLEVBQUU7TUFDeEQsT0FBTyxHQUFlLE9BQU8sQ0FBN0IsT0FBTztNQUFFLFFBQVEsR0FBSyxPQUFPLENBQXBCLFFBQVE7Ozs7QUFHekIsTUFBTSxZQUFZLEdBQUcsK0JBQW1CLE9BQU8sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEUsTUFBTSxVQUFVLEdBQUcsK0JBQW1CLE9BQU8sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWxFLE1BQUksUUFBUSxJQUFJLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtBQUNwRCxRQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsMkJBQTJCLENBQUM7QUFDbkQsUUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQ3JDLGFBQU8sb0JBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxVQUFBLEtBQUssRUFBSTtBQUMzQixZQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3hCLFlBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztBQUNwRSxZQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7QUFDOUQsWUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuRCxZQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkQsWUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN4QixlQUFPO0FBQ0wsY0FBSSxFQUFKLElBQUk7QUFDSiwyQkFBaUIsRUFBakIsaUJBQWlCO0FBQ2pCLHNCQUFZLEVBQVosWUFBWTtBQUNaLGtCQUFRLEVBQUUsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLFdBQVcsR0FBRyxRQUFRLEdBQUcsU0FBUztBQUM5RCxjQUFJLEVBQUosSUFBSTtTQUNMLENBQUM7T0FDSCxDQUFDLENBQUM7S0FDSjtHQUNGOztBQUVELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7O0FBRWpFLFNBQU8sb0JBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFBLEtBQUssRUFBSTtBQUM3QixRQUFNLElBQUksR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFELFdBQU87QUFDTCxVQUFJLEVBQUosSUFBSTtBQUNKLHVCQUFpQixFQUFqQixpQkFBaUI7QUFDakIsa0JBQVksRUFBWixZQUFZO0FBQ1osY0FBUSxFQUFSLFFBQVE7S0FDVCxDQUFDO0dBQ0gsQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUywwQkFBMEIsQ0FDeEMsS0FBWSxFQUNlO0FBQzNCLE1BQU0sb0JBQW9CLEdBQUc7QUFDM0IsWUFBUSxFQUFFLFNBQVM7QUFDbkIsc0JBQWtCLEVBQUUsVUFBVTs7O0FBRzlCLHFCQUFpQixFQUFFLENBQUM7OztBQUdwQixzQkFBa0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FDakMseUNBQXlDLENBQzFDOzs7QUFHRCx3QkFBb0IsRUFBRSxLQUFLOzs7QUFHM0Isa0JBQWMsRUFBQSx3QkFBQyxJQUFrQyxFQUFFO1VBQWxDLE1BQU0sR0FBUixJQUFrQyxDQUFoQyxNQUFNO1VBQUUsY0FBYyxHQUF4QixJQUFrQyxDQUF4QixjQUFjO1VBQUUsTUFBTSxHQUFoQyxJQUFrQyxDQUFSLE1BQU07O0FBQzdDLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDOztBQUUzRCxVQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLGNBQWMsS0FBSyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRTdELFVBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUN2QyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQ3ZCLGNBQWMsQ0FDZixDQUFDLENBQUM7O0FBRUgsVUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxVQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sR0FBRyxvQkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUMxQyxNQUFNO0FBQ0wsY0FBTSxHQUFHLElBQUksQ0FBQztPQUNmOzs7QUFHRCxVQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFM0QsVUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FDckMscUNBQXFDLENBQ3RDLENBQUM7QUFDRixVQUFJLE9BQU8saUJBQWlCLEtBQUssUUFBUSxFQUFFO0FBQ3pDLHlCQUFpQixHQUFHLENBQUMsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRTFELHNCQUFJLGdDQUFnQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXBFLFVBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ3JDLGNBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQUEsT0FBTyxFQUFJO0FBQ2pDLGlCQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNuRCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7O0FBRUQsZ0NBQTRCLEVBQUEsc0NBQUMsS0FNNUIsRUFBRTtVQUxELElBQUksR0FEdUIsS0FNNUIsQ0FMQyxJQUFJO1VBQ0osaUJBQWlCLEdBRlUsS0FNNUIsQ0FKQyxpQkFBaUI7VUFDakIsWUFBWSxHQUhlLEtBTTVCLENBSEMsWUFBWTtVQUNaLFFBQVEsR0FKbUIsS0FNNUIsQ0FGQyxRQUFRO1VBQ1IsSUFBSSxHQUx1QixLQU01QixDQURDLElBQUk7O0FBRUosVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLEVBQ2pFLE9BQU8sSUFBSSxDQUFDOztBQUVkLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDNUIsVUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsY0FBYyxLQUFLLE1BQU0sRUFBRSxPQUFPLElBQUksQ0FBQzs7QUFFN0QsVUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDckMsY0FBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQWUsRUFBSztjQUFsQixLQUFLLEdBQVAsS0FBZSxDQUFiLEtBQUs7Y0FBRSxJQUFJLEdBQWIsS0FBZSxDQUFOLElBQUk7O0FBQzlELGNBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDakMsbUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNkLG1CQUFPO1dBQ1I7QUFDRCxjQUFNLFdBQVcsR0FBRyx1QkFBVyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUNuRCxpQkFBTyxDQUFDO0FBQ04sZ0JBQUksRUFBSixJQUFJO0FBQ0osNkJBQWlCLEVBQWpCLGlCQUFpQjtBQUNqQix3QkFBWSxFQUFaLFlBQVk7QUFDWixvQkFBUSxFQUFSLFFBQVE7QUFDUixnQkFBSSxFQUFKLElBQUk7QUFDSix1QkFBVyxFQUFYLFdBQVc7V0FDWixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7O0FBRUQsV0FBTyxFQUFBLG1CQUFHO0FBQ1IsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUM1QixrQkFBVSxDQUFDLFlBQU07QUFDZixpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2YsRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNWLENBQUMsQ0FBQztLQUNKO0dBQ0YsQ0FBQzs7QUFFRixTQUFPLG9CQUFvQixDQUFDO0NBQzdCIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9wcm92aWRlZC9hdXRvY29tcGxldGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBhbnNpVG9UZXh0IH0gZnJvbSBcImFuc2VyXCI7XG5cbmltcG9ydCB7IGxvZywgY2hhcl9pZHhfdG9fanNfaWR4IH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uL3N0b3JlXCI7XG5cbnR5cGUgQ29tcGxldGVSZXBseSA9IHtcbiAgbWF0Y2hlczogQXJyYXk8c3RyaW5nPixcbiAgY3Vyc29yX3N0YXJ0OiBudW1iZXIsXG4gIGN1cnNvcl9lbmQ6IG51bWJlcixcbiAgbWV0YWRhdGE/OiB7XG4gICAgX2p1cHl0ZXJfdHlwZXNfZXhwZXJpbWVudGFsPzogQXJyYXk8e1xuICAgICAgc3RhcnQ/OiBudW1iZXIsXG4gICAgICBlbmQ/OiBudW1iZXIsXG4gICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICB0eXBlPzogc3RyaW5nXG4gICAgfT5cbiAgfVxufTtcblxuY29uc3QgaWNvbkhUTUwgPSBgPGltZyBzcmM9JyR7X19kaXJuYW1lfS8uLi8uLi8uLi9zdGF0aWMvbG9nby5zdmcnIHN0eWxlPSd3aWR0aDogMTAwJTsnPmA7XG5cbmNvbnN0IHJlZ2V4ZXMgPSB7XG4gIC8vIHByZXR0eSBkb2RneSwgYWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzgzOTY2NThcbiAgcjogLyhbXlxcZFxcV118Wy5dKVtcXHcuJF0qJC8sXG5cbiAgLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xLzU0NzQwMDhcbiAgcHl0aG9uOiAvKFteXFxkXFxXXXxbXFx1MDBBMC1cXHVGRkZGXSlbXFx3LlxcdTAwQTAtXFx1RkZGRl0qJC8sXG5cbiAgLy8gYWRhcHRlZCBmcm9tIGh0dHA6Ly9waHAubmV0L21hbnVhbC9lbi9sYW5ndWFnZS52YXJpYWJsZXMuYmFzaWNzLnBocFxuICBwaHA6IC9bJGEtekEtWl9cXHg3Zi1cXHhmZl1bYS16QS1aMC05X1xceDdmLVxceGZmXSokL1xufTtcblxuZnVuY3Rpb24gcGFyc2VDb21wbGV0aW9ucyhyZXN1bHRzOiBDb21wbGV0ZVJlcGx5LCBwcmVmaXg6IHN0cmluZykge1xuICBjb25zdCB7IG1hdGNoZXMsIG1ldGFkYXRhIH0gPSByZXN1bHRzO1xuICAvLyBATk9URTogVGhpcyBjYW4gbWFrZSBpbnZhbGlkIGByZXBsYWNlZFByZWZpeGAgYW5kIGByZXBsYWNlZFRleHRgIHdoZW4gYSBsaW5lIGluY2x1ZGVzIHVuaWNvZGUgY2hhcmFjdGVyc1xuICAvLyBAVE9ETyAoQGF2aWF0ZXNrKTogVXNlIGBSZWdleGAgdG8gZGV0ZWN0IHRoZW0gcmVnYXJkbGVzcyBvZiB0aGUgYHJlc3VsdHMuY3Vyc29yXypgIGZlZWRiYWNrcyBmcm9tIGtlcm5lbHNcbiAgY29uc3QgY3Vyc29yX3N0YXJ0ID0gY2hhcl9pZHhfdG9fanNfaWR4KHJlc3VsdHMuY3Vyc29yX3N0YXJ0LCBwcmVmaXgpO1xuICBjb25zdCBjdXJzb3JfZW5kID0gY2hhcl9pZHhfdG9fanNfaWR4KHJlc3VsdHMuY3Vyc29yX2VuZCwgcHJlZml4KTtcblxuICBpZiAobWV0YWRhdGEgJiYgbWV0YWRhdGEuX2p1cHl0ZXJfdHlwZXNfZXhwZXJpbWVudGFsKSB7XG4gICAgY29uc3QgY29tcHMgPSBtZXRhZGF0YS5fanVweXRlcl90eXBlc19leHBlcmltZW50YWw7XG4gICAgaWYgKGNvbXBzLmxlbmd0aCA+IDAgJiYgY29tcHNbMF0udGV4dCkge1xuICAgICAgcmV0dXJuIF8ubWFwKGNvbXBzLCBtYXRjaCA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBtYXRjaC50ZXh0O1xuICAgICAgICBjb25zdCBzdGFydCA9IG1hdGNoLnN0YXJ0ICYmIG1hdGNoLmVuZCA/IG1hdGNoLnN0YXJ0IDogY3Vyc29yX3N0YXJ0O1xuICAgICAgICBjb25zdCBlbmQgPSBtYXRjaC5zdGFydCAmJiBtYXRjaC5lbmQgPyBtYXRjaC5lbmQgOiBjdXJzb3JfZW5kO1xuICAgICAgICBjb25zdCByZXBsYWNlbWVudFByZWZpeCA9IHByZWZpeC5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgY29uc3QgcmVwbGFjZWRUZXh0ID0gcHJlZml4LnNsaWNlKDAsIHN0YXJ0KSArIHRleHQ7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBtYXRjaC50eXBlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRleHQsXG4gICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXgsXG4gICAgICAgICAgcmVwbGFjZWRUZXh0LFxuICAgICAgICAgIGljb25IVE1MOiAhdHlwZSB8fCB0eXBlID09PSBcIjx1bmtub3duPlwiID8gaWNvbkhUTUwgOiB1bmRlZmluZWQsXG4gICAgICAgICAgdHlwZVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcmVwbGFjZW1lbnRQcmVmaXggPSBwcmVmaXguc2xpY2UoY3Vyc29yX3N0YXJ0LCBjdXJzb3JfZW5kKTtcblxuICByZXR1cm4gXy5tYXAobWF0Y2hlcywgbWF0Y2ggPT4ge1xuICAgIGNvbnN0IHRleHQgPSBtYXRjaDtcbiAgICBjb25zdCByZXBsYWNlZFRleHQgPSBwcmVmaXguc2xpY2UoMCwgY3Vyc29yX3N0YXJ0KSArIHRleHQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQsXG4gICAgICByZXBsYWNlbWVudFByZWZpeCxcbiAgICAgIHJlcGxhY2VkVGV4dCxcbiAgICAgIGljb25IVE1MXG4gICAgfTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlQXV0b2NvbXBsZXRlUmVzdWx0cyhcbiAgc3RvcmU6IFN0b3JlXG4pOiBhdG9tJEF1dG9jb21wbGV0ZVByb3ZpZGVyIHtcbiAgY29uc3QgYXV0b2NvbXBsZXRlUHJvdmlkZXIgPSB7XG4gICAgc2VsZWN0b3I6IFwiLnNvdXJjZVwiLFxuICAgIGRpc2FibGVGb3JTZWxlY3RvcjogXCIuY29tbWVudFwiLFxuXG4gICAgLy8gVGhlIGRlZmF1bHQgcHJvdmlkZXIgaGFzIGFuIGluY2x1c2lvbiBwcmlvcml0eSBvZiAwLlxuICAgIGluY2x1c2lvblByaW9yaXR5OiAxLFxuXG4gICAgLy8gVGhlIGRlZmF1bHQgcHJvdmlkZXIgaGFzIGEgc3VnZ2VzdGlvbiBwcmlvcml0eSBvZiAxLlxuICAgIHN1Z2dlc3Rpb25Qcmlvcml0eTogYXRvbS5jb25maWcuZ2V0KFxuICAgICAgXCJIeWRyb2dlbi5hdXRvY29tcGxldGVTdWdnZXN0aW9uUHJpb3JpdHlcIlxuICAgICksXG5cbiAgICAvLyBJdCB3b24ndCBzdXBwcmVzcyBwcm92aWRlcnMgd2l0aCBsb3dlciBwcmlvcml0eS5cbiAgICBleGNsdWRlTG93ZXJQcmlvcml0eTogZmFsc2UsXG5cbiAgICAvLyBSZXF1aXJlZDogUmV0dXJuIGEgcHJvbWlzZSwgYW4gYXJyYXkgb2Ygc3VnZ2VzdGlvbnMsIG9yIG51bGwuXG4gICAgZ2V0U3VnZ2VzdGlvbnMoeyBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBwcmVmaXggfSkge1xuICAgICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoXCJIeWRyb2dlbi5hdXRvY29tcGxldGVcIikpIHJldHVybiBudWxsO1xuXG4gICAgICBjb25zdCBrZXJuZWwgPSBzdG9yZS5rZXJuZWw7XG4gICAgICBpZiAoIWtlcm5lbCB8fCBrZXJuZWwuZXhlY3V0aW9uU3RhdGUgIT09IFwiaWRsZVwiKSByZXR1cm4gbnVsbDtcblxuICAgICAgY29uc3QgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbXG4gICAgICAgIFtidWZmZXJQb3NpdGlvbi5yb3csIDBdLFxuICAgICAgICBidWZmZXJQb3NpdGlvblxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHJlZ2V4ID0gcmVnZXhlc1trZXJuZWwubGFuZ3VhZ2VdO1xuICAgICAgaWYgKHJlZ2V4KSB7XG4gICAgICAgIHByZWZpeCA9IF8uaGVhZChsaW5lLm1hdGNoKHJlZ2V4KSkgfHwgXCJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZWZpeCA9IGxpbmU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiBpZiBjdXJzb3IgaXMgYXQgd2hpdGVzcGFjZVxuICAgICAgaWYgKHByZWZpeC50cmltUmlnaHQoKS5sZW5ndGggPCBwcmVmaXgubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuICAgICAgbGV0IG1pbmltdW1Xb3JkTGVuZ3RoID0gYXRvbS5jb25maWcuZ2V0KFxuICAgICAgICBcImF1dG9jb21wbGV0ZS1wbHVzLm1pbmltdW1Xb3JkTGVuZ3RoXCJcbiAgICAgICk7XG4gICAgICBpZiAodHlwZW9mIG1pbmltdW1Xb3JkTGVuZ3RoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgIG1pbmltdW1Xb3JkTGVuZ3RoID0gMztcbiAgICAgIH1cblxuICAgICAgaWYgKHByZWZpeC50cmltKCkubGVuZ3RoIDwgbWluaW11bVdvcmRMZW5ndGgpIHJldHVybiBudWxsO1xuXG4gICAgICBsb2coXCJhdXRvY29tcGxldGVQcm92aWRlcjogcmVxdWVzdDpcIiwgbGluZSwgYnVmZmVyUG9zaXRpb24sIHByZWZpeCk7XG5cbiAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAga2VybmVsLmNvbXBsZXRlKHByZWZpeCwgcmVzdWx0cyA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUocGFyc2VDb21wbGV0aW9ucyhyZXN1bHRzLCBwcmVmaXgpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmFjZShbcHJvbWlzZSwgdGhpcy50aW1lb3V0KCldKTtcbiAgICB9LFxuXG4gICAgZ2V0U3VnZ2VzdGlvbkRldGFpbHNPblNlbGVjdCh7XG4gICAgICB0ZXh0LFxuICAgICAgcmVwbGFjZW1lbnRQcmVmaXgsXG4gICAgICByZXBsYWNlZFRleHQsXG4gICAgICBpY29uSFRNTCxcbiAgICAgIHR5cGVcbiAgICB9KSB7XG4gICAgICBpZiAoIWF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLnNob3dJbnNwZWN0b3JSZXN1bHRzSW5BdXRvY29tcGxldGVcIikpXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICBjb25zdCBrZXJuZWwgPSBzdG9yZS5rZXJuZWw7XG4gICAgICBpZiAoIWtlcm5lbCB8fCBrZXJuZWwuZXhlY3V0aW9uU3RhdGUgIT09IFwiaWRsZVwiKSByZXR1cm4gbnVsbDtcblxuICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBrZXJuZWwuaW5zcGVjdChyZXBsYWNlZFRleHQsIHJlcGxhY2VkVGV4dC5sZW5ndGgsICh7IGZvdW5kLCBkYXRhIH0pID0+IHtcbiAgICAgICAgICBpZiAoIWZvdW5kIHx8ICFkYXRhW1widGV4dC9wbGFpblwiXSkge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBhbnNpVG9UZXh0KGRhdGFbXCJ0ZXh0L3BsYWluXCJdKTtcbiAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeCxcbiAgICAgICAgICAgIHJlcGxhY2VkVGV4dCxcbiAgICAgICAgICAgIGljb25IVE1MLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoW3Byb21pc2UsIHRoaXMudGltZW91dCgpXSk7XG4gICAgfSxcblxuICAgIHRpbWVvdXQoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBhdXRvY29tcGxldGVQcm92aWRlcjtcbn1cbiJdfQ==