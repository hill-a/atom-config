Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _path = require('path');

// Local variables
'use babel';var VALID_SEVERITY = new Set(['error', 'warning', 'info']);
var regex = /line (\d+) column (\d+) - (Warning|Error): (.+)/g;
var defaultExecutableArguments = ['-language', 'en', '-quiet', '-errors', '--tab-size', '1'];
// Settings
var grammarScopes = [];
var executablePath = undefined;
var configExecutableArguments = undefined;

var getSeverity = function getSeverity(givenSeverity) {
  var severity = givenSeverity.toLowerCase();
  return VALID_SEVERITY.has(severity) ? severity : 'warning';
};

exports['default'] = {
  activate: function activate() {
    require('atom-package-deps').install('linter-tidy');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-tidy.executablePath', function (value) {
      executablePath = value;
    }), atom.config.observe('linter-tidy.executableArguments', function (value) {
      configExecutableArguments = value;
    }), atom.config.observe('linter-tidy.grammarScopes', function (configScopes) {
      grammarScopes.splice(0, grammarScopes.length);
      grammarScopes.push.apply(grammarScopes, _toConsumableArray(configScopes));
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      grammarScopes: grammarScopes,
      name: 'tidy',
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var parameters = defaultExecutableArguments.concat(configExecutableArguments);

        var _atom$project$relativizePath = atom.project.relativizePath(filePath);

        var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

        var projectPath = _atom$project$relativizePath2[0];

        var execOptions = {
          stream: 'stderr',
          stdin: fileText,
          cwd: projectPath !== null ? projectPath : (0, _path.dirname)(filePath),
          allowEmptyStderr: true
        };

        var output = yield helpers.exec(executablePath, parameters, execOptions);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, don't update the messages
          return null;
        }

        var messages = [];
        var match = regex.exec(output);
        while (match !== null) {
          var line = Number.parseInt(match[1], 10) - 1;
          var col = Number.parseInt(match[2], 10) - 1;
          messages.push({
            severity: getSeverity(match[3]),
            excerpt: match[4],
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, line, col)
            }
          });
          match = regex.exec(output);
        }
        return messages;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2xpbnRlci10aWR5L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOzswQkFDakIsYUFBYTs7SUFBMUIsT0FBTzs7b0JBQ0ssTUFBTTs7O0FBTDlCLFdBQVcsQ0FBQyxBQVFaLElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzdELElBQU0sS0FBSyxHQUFHLGtEQUFrRCxDQUFDO0FBQ2pFLElBQU0sMEJBQTBCLEdBQUcsQ0FDakMsV0FBVyxFQUFFLElBQUksRUFDakIsUUFBUSxFQUNSLFNBQVMsRUFDVCxZQUFZLEVBQUUsR0FBRyxDQUNsQixDQUFDOztBQUVGLElBQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN6QixJQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLElBQUkseUJBQXlCLFlBQUEsQ0FBQzs7QUFFOUIsSUFBTSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUksYUFBYSxFQUFLO0FBQ3JDLE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM3QyxTQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQztDQUM1RCxDQUFDOztxQkFFYTtBQUNiLFVBQVEsRUFBQSxvQkFBRztBQUNULFdBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0Qsb0JBQWMsR0FBRyxLQUFLLENBQUM7S0FDeEIsQ0FBQyxFQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlDQUFpQyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ2hFLCtCQUF5QixHQUFHLEtBQUssQ0FBQztLQUNuQyxDQUFDLEVBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsVUFBQyxZQUFZLEVBQUs7QUFDakUsbUJBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxtQkFBYSxDQUFDLElBQUksTUFBQSxDQUFsQixhQUFhLHFCQUFTLFlBQVksRUFBQyxDQUFDO0tBQ3JDLENBQUMsQ0FDSCxDQUFDO0dBQ0g7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM5Qjs7QUFFRCxlQUFhLEVBQUEseUJBQUc7QUFDZCxXQUFPO0FBQ0wsbUJBQWEsRUFBYixhQUFhO0FBQ2IsVUFBSSxFQUFFLE1BQU07QUFDWixXQUFLLEVBQUUsTUFBTTtBQUNiLG1CQUFhLEVBQUUsSUFBSTtBQUNuQixVQUFJLG9CQUFFLFdBQU8sVUFBVSxFQUFLO0FBQzFCLFlBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QyxZQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRXRDLFlBQU0sVUFBVSxHQUFHLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzsyQ0FFMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDOzs7O1lBQXBELFdBQVc7O0FBQ2xCLFlBQU0sV0FBVyxHQUFHO0FBQ2xCLGdCQUFNLEVBQUUsUUFBUTtBQUNoQixlQUFLLEVBQUUsUUFBUTtBQUNmLGFBQUcsRUFBRSxXQUFXLEtBQUssSUFBSSxHQUFHLFdBQVcsR0FBRyxtQkFBUSxRQUFRLENBQUM7QUFDM0QsMEJBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDOztBQUVGLFlBQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUUzRSxZQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUU7O0FBRXJDLGlCQUFPLElBQUksQ0FBQztTQUNiOztBQUVELFlBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixZQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLGVBQU8sS0FBSyxLQUFLLElBQUksRUFBRTtBQUNyQixjQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0MsY0FBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLGtCQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osb0JBQVEsRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLG1CQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNqQixvQkFBUSxFQUFFO0FBQ1Isa0JBQUksRUFBRSxRQUFRO0FBQ2Qsc0JBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO2FBQ3ZEO1dBQ0YsQ0FBQyxDQUFDO0FBQ0gsZUFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7QUFDRCxlQUFPLFFBQVEsQ0FBQztPQUNqQixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvbGludGVyLXRpZHkvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInO1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnO1xuXG4vLyBMb2NhbCB2YXJpYWJsZXNcbmNvbnN0IFZBTElEX1NFVkVSSVRZID0gbmV3IFNldChbJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbyddKTtcbmNvbnN0IHJlZ2V4ID0gL2xpbmUgKFxcZCspIGNvbHVtbiAoXFxkKykgLSAoV2FybmluZ3xFcnJvcik6ICguKykvZztcbmNvbnN0IGRlZmF1bHRFeGVjdXRhYmxlQXJndW1lbnRzID0gW1xuICAnLWxhbmd1YWdlJywgJ2VuJyxcbiAgJy1xdWlldCcsXG4gICctZXJyb3JzJyxcbiAgJy0tdGFiLXNpemUnLCAnMScsXG5dO1xuLy8gU2V0dGluZ3NcbmNvbnN0IGdyYW1tYXJTY29wZXMgPSBbXTtcbmxldCBleGVjdXRhYmxlUGF0aDtcbmxldCBjb25maWdFeGVjdXRhYmxlQXJndW1lbnRzO1xuXG5jb25zdCBnZXRTZXZlcml0eSA9IChnaXZlblNldmVyaXR5KSA9PiB7XG4gIGNvbnN0IHNldmVyaXR5ID0gZ2l2ZW5TZXZlcml0eS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gVkFMSURfU0VWRVJJVFkuaGFzKHNldmVyaXR5KSA/IHNldmVyaXR5IDogJ3dhcm5pbmcnO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhY3RpdmF0ZSgpIHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci10aWR5Jyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdGlkeS5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBleGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdGlkeS5leGVjdXRhYmxlQXJndW1lbnRzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbmZpZ0V4ZWN1dGFibGVBcmd1bWVudHMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRpZHkuZ3JhbW1hclNjb3BlcycsIChjb25maWdTY29wZXMpID0+IHtcbiAgICAgICAgZ3JhbW1hclNjb3Blcy5zcGxpY2UoMCwgZ3JhbW1hclNjb3Blcy5sZW5ndGgpO1xuICAgICAgICBncmFtbWFyU2NvcGVzLnB1c2goLi4uY29uZmlnU2NvcGVzKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBuYW1lOiAndGlkeScsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGNvbnN0IGZpbGVUZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IGRlZmF1bHRFeGVjdXRhYmxlQXJndW1lbnRzLmNvbmNhdChjb25maWdFeGVjdXRhYmxlQXJndW1lbnRzKTtcblxuICAgICAgICBjb25zdCBbcHJvamVjdFBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgZXhlY09wdGlvbnMgPSB7XG4gICAgICAgICAgc3RyZWFtOiAnc3RkZXJyJyxcbiAgICAgICAgICBzdGRpbjogZmlsZVRleHQsXG4gICAgICAgICAgY3dkOiBwcm9qZWN0UGF0aCAhPT0gbnVsbCA/IHByb2plY3RQYXRoIDogZGlybmFtZShmaWxlUGF0aCksXG4gICAgICAgICAgYWxsb3dFbXB0eVN0ZGVycjogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvdXRwdXQgPSBhd2FpdCBoZWxwZXJzLmV4ZWMoZXhlY3V0YWJsZVBhdGgsIHBhcmFtZXRlcnMsIGV4ZWNPcHRpb25zKTtcblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgZG9uJ3QgdXBkYXRlIHRoZSBtZXNzYWdlc1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBsaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzFdLCAxMCkgLSAxO1xuICAgICAgICAgIGNvbnN0IGNvbCA9IE51bWJlci5wYXJzZUludChtYXRjaFsyXSwgMTApIC0gMTtcbiAgICAgICAgICBtZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgIHNldmVyaXR5OiBnZXRTZXZlcml0eShtYXRjaFszXSksXG4gICAgICAgICAgICBleGNlcnB0OiBtYXRjaFs0XSxcbiAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgIGZpbGU6IGZpbGVQYXRoLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogaGVscGVycy5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIGxpbmUsIGNvbCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=