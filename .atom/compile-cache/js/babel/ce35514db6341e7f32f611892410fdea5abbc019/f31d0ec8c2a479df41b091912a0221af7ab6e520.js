Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _child_process = require('child_process');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clangFormatBinaries = require('clang-format-binaries');

var _clangFormatBinaries2 = _interopRequireDefault(_clangFormatBinaries);

'use babel';

var ClangFormat = function ClangFormat() {
  var _this = this;

  _classCallCheck(this, ClangFormat);

  this.destroy = function () {
    _this.subscriptions.dispose();
  };

  this.handleBufferEvents = function (editor) {
    var buffer = editor.getBuffer();
    var bufferSavedSubscription = buffer.onWillSave(function () {
      var scope = editor.getRootScopeDescriptor().scopes[0];
      if (_this.shouldFormatOnSaveForScope(scope)) {
        buffer.transact(function () {
          return _this.format(editor);
        });
      }
    });

    var editorDestroyedSubscription = editor.onDidDestroy(function () {
      bufferSavedSubscription.dispose();
      editorDestroyedSubscription.dispose();

      _this.subscriptions.remove(bufferSavedSubscription);
      _this.subscriptions.remove(editorDestroyedSubscription);
    });

    _this.subscriptions.add(bufferSavedSubscription);
    _this.subscriptions.add(editorDestroyedSubscription);
  };

  this.format = function (editor) {
    var buffer = editor.getBuffer();

    var exe = atom.config.get('clang-format.executable');
    if (!exe) {
      var exePackageLocation = _path2['default'].dirname(_clangFormatBinaries2['default'].location);
      if (_os2['default'].platform() === 'win32') {
        exe = _path2['default'].join(exePackageLocation, '/bin/win32/clang-format.exe');
      } else {
        exe = _path2['default'].join(exePackageLocation, '/bin/' + _os2['default'].platform() + '_' + _os2['default'].arch() + '/clang-format');
      }
    }

    var options = {
      style: atom.config.get('clang-format.style'),
      cursor: _this.getCurrentCursorPosition(editor).toString(),
      'fallback-style': atom.config.get('clang-format.fallbackStyle')
    };

    // Format only selection
    if (_this.textSelected(editor)) {
      options.lines = _this.getTargetLineNums(editor);
    }

    // Pass file path to clang-format so it can look for .clang-format files
    var filePath = editor.getPath();
    if (filePath) {
      options['assume-filename'] = filePath;
    }

    // Call clang-format synchronously to ensure that save waits for us
    // Don't catch errors to make them visible to users via atom's UI
    // We need to explicitly ignore stderr since there is no parent stderr on
    // windows and node.js will try to write to it - whether it's there or not
    var args = Object.keys(options).reduce(function (memo, optionKey) {
      var optionValue = options[optionKey];
      if (optionValue) {
        return memo + '-' + optionKey + '="' + optionValue + '" ';
      }
      return memo;
    }, '');

    var execOptions = { input: editor.getText() };

    if (filePath) {
      execOptions.cwd = _path2['default'].dirname(filePath);
    }

    try {
      var stdout = (0, _child_process.execSync)('"' + exe + '" ' + args, execOptions).toString();
      // Update buffer with formatted text. setTextViaDiff minimizes re-rendering
      buffer.setTextViaDiff(_this.getReturnedFormattedText(stdout));
      // Restore cursor position
      var returnedCursorPos = _this.getReturnedCursorPosition(stdout);
      var convertedCursorPos = buffer.positionForCharacterIndex(returnedCursorPos);
      editor.setCursorBufferPosition(convertedCursorPos);
    } catch (error) {
      if (error.message.indexOf('Command failed:') < 0) {
        throw error;
      } else {
        atom.notifications.addError('Clang Format Command Failed', {
          dismissable: true,
          detail: 'clang-format failed with the below error. Consider reporting this by creating an issue here: https://github.com/LiquidHelium/atom-clang-format/issues.\nError message: "' + error.stderr.toString() + '".\nWhen running: "' + exe + ' ' + args + '".\nStdout was: "' + error.stdout.toString() + '"'
        });
      }
    }
  };

  this.shouldFormatOnSaveForScope = function (scope) {
    if (atom.config.get('clang-format.formatCPlusPlusOnSave') && ['source.c++', 'source.cpp'].includes(scope)) {
      return true;
    }
    if (atom.config.get('clang-format.formatCOnSave') && ['source.c'].includes(scope)) {
      return true;
    }
    if (atom.config.get('clang-format.formatObjectiveCOnSave') && ['source.objc', 'source.objcpp'].includes(scope)) {
      return true;
    }
    if (atom.config.get('clang-format.formatJavascriptOnSave') && ['source.js'].includes(scope)) {
      return true;
    }
    if (atom.config.get('clang-format.formatTypescriptOnSave') && ['source.ts'].includes(scope)) {
      return true;
    }
    if (atom.config.get('clang-format.formatJavaOnSave') && ['source.java'].includes(scope)) {
      return true;
    }
    return false;
  };

  this.getEndJSONPosition = function (text) {
    for (var i = 0; i < text.length; i += 1) {
      if (text[i] === '\n' || text[i] === '\r') {
        return i + 1;
      }
    }

    return -1;
  };

  this.getReturnedCursorPosition = function (stdout) {
    if (!stdout) {
      return 0;
    }
    var parsed = JSON.parse(stdout.slice(0, _this.getEndJSONPosition(stdout)));
    return parsed.Cursor;
  };

  this.getReturnedFormattedText = function (stdout) {
    return stdout.slice(_this.getEndJSONPosition(stdout));
  };

  this.getCurrentCursorPosition = function (editor) {
    var cursorPosition = editor.getCursorBufferPosition();
    var text = editor.getTextInBufferRange([[0, 0], cursorPosition]);
    return text.length;
  };

  this.getCursorLineNumber = function (editor) {
    var cursorPosition = editor.getCursorBufferPosition();
    // +1 to get 1-base line number.
    return cursorPosition.toArray()[0] + 1;
  };

  this.textSelected = function (editor) {
    var range = editor.getSelectedBufferRange();
    return !range.isEmpty();
  };

  this.getSelectedLineNums = function (editor) {
    var range = editor.getSelectedBufferRange();
    var rows = range.getRows();
    // + 1 to get 1-base line number.
    var startingRow = rows[0] + 1;
    // If 2 lines are selected, the diff between |starting_row| is 1, so -1.
    var endingRow = startingRow + range.getRowCount() - 1;
    return [startingRow, endingRow];
  };

  this.getTargetLineNums = function (editor) {
    if (_this.textSelected(editor)) {
      var lineNums = _this.getSelectedLineNums(editor);
      return lineNums[0] + ':' + lineNums[1];
    }

    var lineNum = _this.getCursorLineNumber(editor);
    return lineNum + ':' + lineNum;
  };

  this.subscriptions = new _atom.CompositeDisposable();
  this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
    return _this.handleBufferEvents(editor);
  }));

  this.subscriptions.add(atom.commands.add('atom-workspace', 'clang-format:format', function () {
    var editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      _this.format(editor);
    }
  }));
};

exports['default'] = ClangFormat;
module.exports = exports['default'];

// Returns line numbers recognizable by clang-format, i.e. '<begin>:<end>'.
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2NsYW5nLWZvcm1hdC9saWIvY2xhbmctZm9ybWF0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVvQyxNQUFNOzs2QkFDakIsZUFBZTs7a0JBQ3pCLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OzttQ0FDWSx1QkFBdUI7Ozs7QUFOMUQsV0FBVyxDQUFDOztJQVFTLFdBQVcsR0FDbkIsU0FEUSxXQUFXLEdBQ2hCOzs7d0JBREssV0FBVzs7T0FlOUIsT0FBTyxHQUFHLFlBQU07QUFDZCxVQUFLLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM5Qjs7T0FFRCxrQkFBa0IsR0FBRyxVQUFDLE1BQU0sRUFBSztBQUMvQixRQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDbEMsUUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQU07QUFDdEQsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQUksTUFBSywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUMxQyxjQUFNLENBQUMsUUFBUSxDQUFDO2lCQUFNLE1BQUssTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FBQztPQUM1QztLQUNGLENBQUMsQ0FBQzs7QUFFSCxRQUFNLDJCQUEyQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM1RCw2QkFBdUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQyxpQ0FBMkIsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFdEMsWUFBSyxhQUFhLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDbkQsWUFBSyxhQUFhLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDeEQsQ0FBQyxDQUFDOztBQUVILFVBQUssYUFBYSxDQUFD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Q0FBQyxDQUFDO0FBQ2pELFdBQVUsT0FBTyxTQUFJLE9BQU8sQ0FBRztHQUNoQzs7QUF2TEMsTUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxNQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFBLE1BQU07V0FBSSxNQUFLLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztHQUFBLENBQUMsQ0FDN0UsQ0FBQzs7QUFFRixNQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxZQUFNO0FBQ3RGLFFBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNwRCxRQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0dBQ0YsQ0FBQyxDQUFDLENBQUM7Q0FDTDs7cUJBYmtCLFdBQVciLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvY2xhbmctZm9ybWF0L2xpYi9jbGFuZy1mb3JtYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjbGFuZ0Zvcm1hdEV4ZWN1dGFibGVzIGZyb20gJ2NsYW5nLWZvcm1hdC1iaW5hcmllcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsYW5nRm9ybWF0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGVkaXRvciA9PiB0aGlzLmhhbmRsZUJ1ZmZlckV2ZW50cyhlZGl0b3IpKSxcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnY2xhbmctZm9ybWF0OmZvcm1hdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgdGhpcy5mb3JtYXQoZWRpdG9yKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95ID0gKCkgPT4ge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBoYW5kbGVCdWZmZXJFdmVudHMgPSAoZWRpdG9yKSA9PiB7XG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgIGNvbnN0IGJ1ZmZlclNhdmVkU3Vic2NyaXB0aW9uID0gYnVmZmVyLm9uV2lsbFNhdmUoKCkgPT4ge1xuICAgICAgY29uc3Qgc2NvcGUgPSBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLnNjb3Blc1swXTtcbiAgICAgIGlmICh0aGlzLnNob3VsZEZvcm1hdE9uU2F2ZUZvclNjb3BlKHNjb3BlKSkge1xuICAgICAgICBidWZmZXIudHJhbnNhY3QoKCkgPT4gdGhpcy5mb3JtYXQoZWRpdG9yKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBlZGl0b3JEZXN0cm95ZWRTdWJzY3JpcHRpb24gPSBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIGJ1ZmZlclNhdmVkU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKTtcbiAgICAgIGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbi5kaXNwb3NlKCk7XG5cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24pO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShlZGl0b3JEZXN0cm95ZWRTdWJzY3JpcHRpb24pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChidWZmZXJTYXZlZFN1YnNjcmlwdGlvbik7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3JEZXN0cm95ZWRTdWJzY3JpcHRpb24pO1xuICB9XG5cbiAgZm9ybWF0ID0gKGVkaXRvcikgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcblxuICAgIGxldCBleGUgPSBhdG9tLmNvbmZpZy5nZXQoJ2NsYW5nLWZvcm1hdC5leGVjdXRhYmxlJyk7XG4gICAgaWYgKCFleGUpIHtcbiAgICAgIGNvbnN0IGV4ZVBhY2thZ2VMb2NhdGlvbiA9IHBhdGguZGlybmFtZShjbGFuZ0Zvcm1hdEV4ZWN1dGFibGVzLmxvY2F0aW9uKTtcbiAgICAgIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInKSB7XG4gICAgICAgIGV4ZSA9IHBhdGguam9pbihleGVQYWNrYWdlTG9jYXRpb24sICcvYmluL3dpbjMyL2NsYW5nLWZvcm1hdC5leGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4ZSA9IHBhdGguam9pbihleGVQYWNrYWdlTG9jYXRpb24sIGAvYmluLyR7b3MucGxhdGZvcm0oKX1fJHtvcy5hcmNoKCl9L2NsYW5nLWZvcm1hdGApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBzdHlsZTogYXRvbS5jb25maWcuZ2V0KCdjbGFuZy1mb3JtYXQuc3R5bGUnKSxcbiAgICAgIGN1cnNvcjogdGhpcy5nZXRDdXJyZW50Q3Vyc29yUG9zaXRpb24oZWRpdG9yKS50b1N0cmluZygpLFxuICAgICAgJ2ZhbGxiYWNrLXN0eWxlJzogYXRvbS5jb25maWcuZ2V0KCdjbGFuZy1mb3JtYXQuZmFsbGJhY2tTdHlsZScpLFxuICAgIH07XG5cbiAgICAvLyBGb3JtYXQgb25seSBzZWxlY3Rpb25cbiAgICBpZiAodGhpcy50ZXh0U2VsZWN0ZWQoZWRpdG9yKSkge1xuICAgICAgb3B0aW9ucy5saW5lcyA9IHRoaXMuZ2V0VGFyZ2V0TGluZU51bXMoZWRpdG9yKTtcbiAgICB9XG5cbiAgICAvLyBQYXNzIGZpbGUgcGF0aCB0byBjbGFuZy1mb3JtYXQgc28gaXQgY2FuIGxvb2sgZm9yIC5jbGFuZy1mb3JtYXQgZmlsZXNcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICBvcHRpb25zWydhc3N1bWUtZmlsZW5hbWUnXSA9IGZpbGVQYXRoO1xuICAgIH1cblxuICAgIC8vIENhbGwgY2xhbmctZm9ybWF0IHN5bmNocm9ub3VzbHkgdG8gZW5zdXJlIHRoYXQgc2F2ZSB3YWl0cyBmb3IgdXNcbiAgICAvLyBEb24ndCBjYXRjaCBlcnJvcnMgdG8gbWFrZSB0aGVtIHZpc2libGUgdG8gdXNlcnMgdmlhIGF0b20ncyBVSVxuICAgIC8vIFdlIG5lZWQgdG8gZXhwbGljaXRseSBpZ25vcmUgc3RkZXJyIHNpbmNlIHRoZXJlIGlzIG5vIHBhcmVudCBzdGRlcnIgb25cbiAgICAvLyB3aW5kb3dzIGFuZCBub2RlLmpzIHdpbGwgdHJ5IHRvIHdyaXRlIHRvIGl0IC0gd2hldGhlciBpdCdzIHRoZXJlIG9yIG5vdFxuICAgIGNvbnN0IGFyZ3MgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5yZWR1Y2UoKG1lbW8sIG9wdGlvbktleSkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb25zW29wdGlvbktleV07XG4gICAgICBpZiAob3B0aW9uVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGAke21lbW99LSR7b3B0aW9uS2V5fT1cIiR7b3B0aW9uVmFsdWV9XCIgYDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH0sICcnKTtcblxuICAgIGNvbnN0IGV4ZWNPcHRpb25zID0geyBpbnB1dDogZWRpdG9yLmdldFRleHQoKSB9O1xuXG4gICAgaWYgKGZpbGVQYXRoKSB7XG4gICAgICBleGVjT3B0aW9ucy5jd2QgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdGRvdXQgPSBleGVjU3luYyhgXCIke2V4ZX1cIiAke2FyZ3N9YCwgZXhlY09wdGlvbnMpLnRvU3RyaW5nKCk7XG4gICAgICAvLyBVcGRhdGUgYnVmZmVyIHdpdGggZm9ybWF0dGVkIHRleHQuIHNldFRleHRWaWFEaWZmIG1pbmltaXplcyByZS1yZW5kZXJpbmdcbiAgICAgIGJ1ZmZlci5zZXRUZXh0VmlhRGlmZih0aGlzLmdldFJldHVybmVkRm9ybWF0dGVkVGV4dChzdGRvdXQpKTtcbiAgICAgIC8vIFJlc3RvcmUgY3Vyc29yIHBvc2l0aW9uXG4gICAgICBjb25zdCByZXR1cm5lZEN1cnNvclBvcyA9IHRoaXMuZ2V0UmV0dXJuZWRDdXJzb3JQb3NpdGlvbihzdGRvdXQpO1xuICAgICAgY29uc3QgY29udmVydGVkQ3Vyc29yUG9zID0gYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgocmV0dXJuZWRDdXJzb3JQb3MpO1xuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGNvbnZlcnRlZEN1cnNvclBvcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvci5tZXNzYWdlLmluZGV4T2YoJ0NvbW1hbmQgZmFpbGVkOicpIDwgMCkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQ2xhbmcgRm9ybWF0IENvbW1hbmQgRmFpbGVkJywge1xuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIGRldGFpbDogYGNsYW5nLWZvcm1hdCBmYWlsZWQgd2l0aCB0aGUgYmVsb3cgZXJyb3IuIENvbnNpZGVyIHJlcG9ydGluZyB0aGlzIGJ5IGNyZWF0aW5nIGFuIGlzc3VlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9MaXF1aWRIZWxpdW0vYXRvbS1jbGFuZy1mb3JtYXQvaXNzdWVzLlxcbkVycm9yIG1lc3NhZ2U6IFwiJHtlcnJvci5zdGRlcnIudG9TdHJpbmcoKX1cIi5cXG5XaGVuIHJ1bm5pbmc6IFwiJHtleGV9ICR7YXJnc31cIi5cXG5TdGRvdXQgd2FzOiBcIiR7ZXJyb3Iuc3Rkb3V0LnRvU3RyaW5nKCl9XCJgLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHNob3VsZEZvcm1hdE9uU2F2ZUZvclNjb3BlID0gKHNjb3BlKSA9PiB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnY2xhbmctZm9ybWF0LmZvcm1hdENQbHVzUGx1c09uU2F2ZScpICYmIFsnc291cmNlLmMrKycsICdzb3VyY2UuY3BwJ10uaW5jbHVkZXMoc2NvcGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnY2xhbmctZm9ybWF0LmZvcm1hdENPblNhdmUnKSAmJiBbJ3NvdXJjZS5jJ10uaW5jbHVkZXMoc2NvcGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnY2xhbmctZm9ybWF0LmZvcm1hdE9iamVjdGl2ZUNPblNhdmUnKSAmJiBbJ3NvdXJjZS5vYmpjJywgJ3NvdXJjZS5vYmpjcHAnXS5pbmNsdWRlcyhzY29wZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdjbGFuZy1mb3JtYXQuZm9ybWF0SmF2YXNjcmlwdE9uU2F2ZScpICYmIFsnc291cmNlLmpzJ10uaW5jbHVkZXMoc2NvcGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnY2xhbmctZm9ybWF0LmZvcm1hdFR5cGVzY3JpcHRPblNhdmUnKSAmJiBbJ3NvdXJjZS50cyddLmluY2x1ZGVzKHNjb3BlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2NsYW5nLWZvcm1hdC5mb3JtYXRKYXZhT25TYXZlJykgJiYgWydzb3VyY2UuamF2YSddLmluY2x1ZGVzKHNjb3BlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldEVuZEpTT05Qb3NpdGlvbiA9ICh0ZXh0KSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoKHRleHRbaV0gPT09ICdcXG4nKSB8fCAodGV4dFtpXSA9PT0gJ1xccicpKSB7XG4gICAgICAgIHJldHVybiBpICsgMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBnZXRSZXR1cm5lZEN1cnNvclBvc2l0aW9uID0gKHN0ZG91dCkgPT4ge1xuICAgIGlmICghc3Rkb3V0KSB7IHJldHVybiAwOyB9XG4gICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShzdGRvdXQuc2xpY2UoMCwgdGhpcy5nZXRFbmRKU09OUG9zaXRpb24oc3Rkb3V0KSkpO1xuICAgIHJldHVybiBwYXJzZWQuQ3Vyc29yO1xuICB9XG5cbiAgZ2V0UmV0dXJuZWRGb3JtYXR0ZWRUZXh0ID0gc3Rkb3V0ID0+IHN0ZG91dC5zbGljZSh0aGlzLmdldEVuZEpTT05Qb3NpdGlvbihzdGRvdXQpKTtcblxuICBnZXRDdXJyZW50Q3Vyc29yUG9zaXRpb24gPSAoZWRpdG9yKSA9PiB7XG4gICAgY29uc3QgY3Vyc29yUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcbiAgICBjb25zdCB0ZXh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtbMCwgMF0sIGN1cnNvclBvc2l0aW9uXSk7XG4gICAgcmV0dXJuIHRleHQubGVuZ3RoO1xuICB9XG5cbiAgZ2V0Q3Vyc29yTGluZU51bWJlciA9IChlZGl0b3IpID0+IHtcbiAgICBjb25zdCBjdXJzb3JQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpO1xuICAgIC8vICsxIHRvIGdldCAxLWJhc2UgbGluZSBudW1iZXIuXG4gICAgcmV0dXJuIGN1cnNvclBvc2l0aW9uLnRvQXJyYXkoKVswXSArIDE7XG4gIH1cblxuICB0ZXh0U2VsZWN0ZWQgPSAoZWRpdG9yKSA9PiB7XG4gICAgY29uc3QgcmFuZ2UgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpO1xuICAgIHJldHVybiAhcmFuZ2UuaXNFbXB0eSgpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRMaW5lTnVtcyA9IChlZGl0b3IpID0+IHtcbiAgICBjb25zdCByYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCk7XG4gICAgY29uc3Qgcm93cyA9IHJhbmdlLmdldFJvd3MoKTtcbiAgICAvLyArIDEgdG8gZ2V0IDEtYmFzZSBsaW5lIG51bWJlci5cbiAgICBjb25zdCBzdGFydGluZ1JvdyA9IHJvd3NbMF0gKyAxO1xuICAgIC8vIElmIDIgbGluZXMgYXJlIHNlbGVjdGVkLCB0aGUgZGlmZiBiZXR3ZWVuIHxzdGFydGluZ19yb3d8IGlzIDEsIHNvIC0xLlxuICAgIGNvbnN0IGVuZGluZ1JvdyA9IChzdGFydGluZ1JvdyArIHJhbmdlLmdldFJvd0NvdW50KCkpIC0gMTtcbiAgICByZXR1cm4gW3N0YXJ0aW5nUm93LCBlbmRpbmdSb3ddO1xuICB9XG5cbiAgLy8gUmV0dXJucyBsaW5lIG51bWJlcnMgcmVjb2duaXphYmxlIGJ5IGNsYW5nLWZvcm1hdCwgaS5lLiAnPGJlZ2luPjo8ZW5kPicuXG4gIGdldFRhcmdldExpbmVOdW1zID0gKGVkaXRvcikgPT4ge1xuICAgIGlmICh0aGlzLnRleHRTZWxlY3RlZChlZGl0b3IpKSB7XG4gICAgICBjb25zdCBsaW5lTnVtcyA9IHRoaXMuZ2V0U2VsZWN0ZWRMaW5lTnVtcyhlZGl0b3IpO1xuICAgICAgcmV0dXJuIGAke2xpbmVOdW1zWzBdfToke2xpbmVOdW1zWzFdfWA7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZU51bSA9IHRoaXMuZ2V0Q3Vyc29yTGluZU51bWJlcihlZGl0b3IpO1xuICAgIHJldHVybiBgJHtsaW5lTnVtfToke2xpbmVOdW19YDtcbiAgfVxufVxuIl19