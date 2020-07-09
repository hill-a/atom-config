Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _uuidV4 = require('uuid/v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _stripIndent = require('strip-indent');

var _stripIndent2 = _interopRequireDefault(_stripIndent);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _variableExplorer = require('./variable-explorer');

var _variableExplorer2 = _interopRequireDefault(_variableExplorer);

// Should be unique among all plugins. At some point, hydrogen should provide
// an API that doesn't require adding fields to the kernel wrappers.
'use babel';

var PLUGIN_KEY = '_nikitakit_python';

var VARIABLE_EXPLORER_URI = 'atom://hydrogen-python/variable-explorer';

function _getUsername() {
  return process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
}

function createMessageFactory(parent_header) {
  return function (type) {
    return {
      header: {
        username: _getUsername(),
        session: parent_header.session, // check if this is correct
        msg_type: type,
        msg_id: (0, _uuidV42['default'])(),
        date: new Date(),
        version: '5.0'
      },
      metadata: {},
      parent_header: parent_header,
      content: {}
    };
  };
}

function codeFromFile(filename) {
  // Takes a file and runs it in a (possibly remote) kernel, while trying not to
  // pollute the kernel's global namespace. We supply all the python files this
  // gets called on, so to avoid escaping issues we mandate that the files not
  // contain ''' anywhere.
  var fullPath = _path2['default'].join(__dirname, '..', 'py', filename);
  var contents = _fs2['default'].readFileSync(fullPath, 'utf8');
  if (contents.includes("'''")) {
    throw new Error('File ' + filename + ' contains triple single-quotes');
  }

  return 'exec(\'\'\'' + contents + '\'\'\', globals().copy())';
}

function expandCode(editor, code) {
  var selection = editor.getSelectedBufferRange();
  var isSelection = !selection.start.isEqual(selection.end);
  // if there is a selection, we don't need to expand the code
  if (isSelection) {
    return code;
  }

  var originalCodeLength = code.split('\n').length;

  var bufferRowLength = editor.getLastBufferRow();

  // trim right to avoid empty lines at the end of the selection
  code = code.trimRight();

  var cursorLineText = editor.lineTextForBufferRow(selection.start.row);
  var lastCodeLineText = code.split('\n')[code.split('\n').length - 1];
  var isRunWithoutMove = code.includes(cursorLineText) && editor.lineTextForBufferRow(Math.min(selection.start.row + code.split('\n').length - 1, bufferRowLength)).trimRight() === lastCodeLineText;

  // find start of executed code
  var startBufferRow = selection.start.row;
  if (!isRunWithoutMove) {
    while (editor.lineTextForBufferRow(startBufferRow).trim() != lastCodeLineText.trim()) {
      startBufferRow -= 1;
      if (startBufferRow < 0) break;
    }
    startBufferRow = Math.max(0, startBufferRow - code.split('\n').length + 1);
  }

  // find original indent
  var indent = code.match(/^\s+/) || '';

  // prepare expansion regex to the top
  var prependCodeList = atom.config.get('hydrogen-python.prependCodeList');
  var prependCode = prependCodeList.join('|');
  var prependRegex = new RegExp('^(' + indent + '(' + prependCode + '))');

  // if start line matches the prepend code regex
  // expand to first non-prepend line
  var prependOffset = 0;
  while (editor.lineTextForBufferRow(startBufferRow + prependOffset).match(prependRegex)) {
    prependOffset += 1;
    code += '\n' + editor.lineTextForBufferRow(startBufferRow + prependOffset);
  }

  // function to identify breakpoints via tokens
  var isBreakpoint = function isBreakpoint(rownum) {
    return editor.tokenizedBuffer.tokenizedLines[rownum].tokens.reduce(function (accumulated, token) {
      return token.scopes.concat(accumulated);
    }, []).filter(function (token) {
      return token.endsWith('.breakpoint');
    }).length > 0;
  };

  // prepare expansion regex to the bottom
  var expandCodeList = atom.config.get('hydrogen-python.expandCodeList');
  // add whitespace to the list
  var expandCode = ['\\s'].concat(expandCodeList).join('|');
  var expandRegex = new RegExp('^(' + indent + '(' + expandCode + ')|s*#|s*$)');

  var lastRow = startBufferRow + (code.split('\n').length - 1);
  var origRow = lastRow;
  var nextRowText = editor.lineTextForBufferRow(lastRow + 1) || '';

  // expand code to the bottom
  while (lastRow <= bufferRowLength && !isBreakpoint(lastRow) && nextRowText.match(expandRegex)) {
    code += '\n' + nextRowText;
    lastRow += 1;
    if (lastRow + 1 > editor.getLastBufferRow()) break;
    nextRowText = editor.lineTextForBufferRow(lastRow + 1);
  }

  // expand code to the top
  var prevRowText = editor.lineTextForBufferRow(startBufferRow - 1) || '';
  while (startBufferRow - 1 >= 0 && !isBreakpoint(startBufferRow - 1) && prevRowText.match(prependRegex)) {
    code = prevRowText + '\n' + code;
    startBufferRow -= 1;
    if (startBufferRow <= 0) break;
    prevRowText = editor.lineTextForBufferRow(startBufferRow - 1);
  }

  if (code.trimRight().split('\n').length > originalCodeLength) {
    console.log('[hydrogen-python] executed code from line ' + (startBufferRow + 1) + ' to line ' + (lastRow + 1));
  }

  // if run-and-move set cursor to the beginning of the next content line
  if (!isRunWithoutMove) {
    var bufferRow = startBufferRow + code.split('\n').length;
    while (bufferRow <= bufferRowLength && (editor.lineTextForBufferRow(bufferRow) || '').match(/^\s*($|#)/)) {
      bufferRow += 1;
    }
    editor.setCursorBufferPosition([bufferRow == startBufferRow ? bufferRow + 1 : bufferRow, 0]);
  }

  return code;
}

var PythonKernelMod = (function () {
  function PythonKernelMod(kernel, emitter) {
    var _this = this;

    _classCallCheck(this, PythonKernelMod);

    this.kernel = kernel;
    this.emitter = emitter;
    this.subscriptions = new _atom.CompositeDisposable();

    this.kernel.addMiddleware(this);

    this.kernelPluginInstalled = false;
    this.kernelPluginFailed = false;

    this.enableVariableExplorer = false;
    this.subscriptions.add(this.emitter.on('did-show-explorer', function () {
      _this.enableVariableExplorer = true;
    }));
    this.emitter.emit('did-install-middleware');
  }

  _createClass(PythonKernelMod, [{
    key: 'execute',
    value: function execute(next, code, onResults) {
      var _this2 = this;

      var makeReply = null;

      if (atom.config.get('hydrogen-python.expandCode')) {
        var editor = atom.workspace.getActiveTextEditor();
        code = expandCode(editor, code);
      }

      // IPython can string leading indentation if every line of code being run
      // is indented the same amount. However, this only works if the first line
      // is indented. We therefore trim empty lines at the start of the executed
      // region.
      code = code.replace(/^\n|\n$/g, '');

      next.execute(code, function (msg, channel) {
        if (!makeReply && msg.parent_header) {
          makeReply = createMessageFactory(msg.parent_header);
        }

        onResults(msg, channel);
        if (msg.header.msg_type == 'execute_reply') {
          if (_this2.enableVariableExplorer) {
            _this2.variableExplorerHook(next);
          }
        }
      });
    }
  }, {
    key: 'shutdown',
    value: function shutdown(next) {
      next.shutdown();

      this.kernelPluginInstalled = false;
      this.kernelPluginFailed = false;
      this.emitter.emit('did-update-vars', []);
    }
  }, {
    key: 'restart',
    value: function restart(next, onRestarted) {
      next.restart(onRestarted);

      this.kernelPluginInstalled = false;
      this.kernelPluginFailed = false;
      this.emitter.emit('did-update-vars', []);
    }
  }, {
    key: 'wrapDataHandler',
    value: function wrapDataHandler(dataHandler) {
      return function (msg, channel) {
        if (channel === 'iopub' && msg.header.msg_type === 'display_data' && msg.content.data && msg.content.data['application/json'] && msg.content.data['application/json'].hydrogen_python) {
          dataHandler(msg.content.data['application/json'].hydrogen_python);
        }
      };
    }
  }, {
    key: 'startKernelPluginInstall',
    value: function startKernelPluginInstall(next, onInstalled) {
      var _this3 = this;

      this.kernelPluginFailed = true;
      var sanityCode = codeFromFile('sanity_check.py');
      var installCode = codeFromFile('install_kernel_plugin.py');
      next.execute(sanityCode, this.wrapDataHandler(function (data) {
        if (data !== 'pass') {
          return;
        }
        next.execute(installCode, _this3.wrapDataHandler(function (data) {
          console.log('hydrogen-python: kernel plugin installed');
          _this3.kernelPluginInstalled = true;
          _this3.kernelPluginFailed = false;
          if (onInstalled) {
            onInstalled(next);
          }
        }));
      }));
    }
  }, {
    key: 'variableExplorerHook',
    value: function variableExplorerHook(next) {
      var _this4 = this;

      if (this.kernelPluginFailed) {
        return;
      }

      if (!this.kernelPluginInstalled) {
        this.startKernelPluginInstall(next, this.variableExplorerHook.bind(this));
        return;
      }

      next.execute("get_ipython()._hydrogen_python.run('variable_explorer_hook')", this.wrapDataHandler(function (data) {
        if (data.error) {
          console.error(data.error);
        }
        if (data.variables) {
          _this4.emitter.emit('did-update-vars', data.variables);
        }
      }));
    }
  }]);

  return PythonKernelMod;
})();

var HydrogenPythonPlugin = {
  subscriptions: null,
  hydrogen: null,
  emitter: null,

  activate: function activate() {
    var _this5 = this;

    this.subscriptions = new _atom.CompositeDisposable();

    this.emitter = new _atom.Emitter();
    this.subscriptions.add(this.emitter);

    this.subscriptions.add(atom.workspace.addOpener(function (uri) {
      switch (uri) {
        case VARIABLE_EXPLORER_URI:
          return new VariableExplorerPane(_this5.emitter);
      }
    }),
    // Destroy any Panes when the package is deactivated.
    new _atom.Disposable(function () {
      atom.workspace.getPaneItems().forEach(function (item) {
        if (item instanceof _variableExplorer2['default']) {
          item.destroy();
        }
      });
    }));

    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'hydrogen-python:toggle-variable-explorer': function hydrogenPythonToggleVariableExplorer() {
        return atom.workspace.toggle(VARIABLE_EXPLORER_URI);
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  consumeHydrogen: function consumeHydrogen(hydrogen) {
    var _this6 = this;

    this.hydrogen = hydrogen;

    this.hydrogen.onDidChangeKernel(function (kernel) {
      if (kernel && kernel.language === 'python' && !kernel[PLUGIN_KEY]) {
        var kernelMod = new PythonKernelMod(kernel, _this6.emitter);
        kernel[PLUGIN_KEY] = { mod: kernelMod };
      }
    });

    return new _atom.Disposable(function () {
      _this6.hydrogen = null;
    });
  }
};

var VariableExplorerPane = (function () {
  function VariableExplorerPane(emitter) {
    var _this7 = this;

    _classCallCheck(this, VariableExplorerPane);

    this.reactElement = null;
    this.element = document.createElement('div');
    this.subscriptions = new _atom.CompositeDisposable();

    this.getTitle = function () {
      return 'Variable Explorer';
    };

    this.getURI = function () {
      return VARIABLE_EXPLORER_URI;
    };

    this.getDefaultLocation = function () {
      return 'right';
    };

    this.getAllowedLocations = function () {
      return ['left', 'right', 'bottom'];
    };

    var reactElement = _react2['default'].createElement(_variableExplorer2['default'], { emitter: emitter });

    _reactDom2['default'].render(reactElement, this.element);
    this.subscriptions.add(new _atom.Disposable(function () {
      _reactDom2['default'].unmountComponentAtNode(_this7.element);
    }));

    emitter.emit('did-show-explorer');
    this.subscriptions.add(emitter.on('did-install-middleware', function () {
      emitter.emit('did-show-explorer');
    }));
  }

  _createClass(VariableExplorerPane, [{
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.element.remove();
    }
  }]);

  return VariableExplorerPane;
})();

exports['default'] = HydrogenPythonPlugin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2h5ZHJvZ2VuLXB5dGhvbi9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUV5RCxNQUFNOztxQkFDN0MsT0FBTzs7Ozt3QkFDSixXQUFXOzs7O3NCQUNqQixTQUFTOzs7OzJCQUNBLGNBQWM7Ozs7a0JBQ3ZCLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztnQ0FFTSxxQkFBcUI7Ozs7OztBQVZsRCxXQUFXLENBQUM7O0FBY1osSUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUM7O0FBRXZDLElBQU0scUJBQXFCLEdBQUcsMENBQTBDLENBQUM7O0FBRXpFLFNBQVMsWUFBWSxHQUFHO0FBQ3RCLFNBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQ3BCO0NBQ0g7O0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUU7QUFDM0MsU0FBTyxVQUFBLElBQUk7V0FBSztBQUNkLFlBQU0sRUFBRTtBQUNOLGdCQUFRLEVBQUUsWUFBWSxFQUFFO0FBQ3hCLGVBQU8sRUFBRSxhQUFhLENBQUMsT0FBTztBQUM5QixnQkFBUSxFQUFFLElBQUk7QUFDZCxjQUFNLEVBQUUsMEJBQUk7QUFDWixZQUFJLEVBQUUsSUFBSSxJQUFJLEVBQUU7QUFDaEIsZUFBTyxFQUFFLEtBQUs7T0FDZjtBQUNELGNBQVEsRUFBRSxFQUFFO0FBQ1osbUJBQWEsRUFBYixhQUFhO0FBQ2IsYUFBTyxFQUFFLEVBQUU7S0FDWjtHQUFDLENBQUM7Q0FDSjs7QUFFRCxTQUFTLFlBQVksQ0FBQyxRQUFRLEVBQUU7Ozs7O0FBSzlCLE1BQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFR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QUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdkI7OztTQWhDRyxvQkFBb0I7OztxQkFtQ1gsb0JBQW9CIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2h5ZHJvZ2VuLXB5dGhvbi9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdjQgZnJvbSAndXVpZC92NCc7XG5pbXBvcnQgc3RyaXBJbmRlbnQgZnJvbSAnc3RyaXAtaW5kZW50JztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IFZhcmlhYmxlRXhwbG9yZXIgZnJvbSAnLi92YXJpYWJsZS1leHBsb3Jlcic7XG5cbi8vIFNob3VsZCBiZSB1bmlxdWUgYW1vbmcgYWxsIHBsdWdpbnMuIEF0IHNvbWUgcG9pbnQsIGh5ZHJvZ2VuIHNob3VsZCBwcm92aWRlXG4vLyBhbiBBUEkgdGhhdCBkb2Vzbid0IHJlcXVpcmUgYWRkaW5nIGZpZWxkcyB0byB0aGUga2VybmVsIHdyYXBwZXJzLlxuY29uc3QgUExVR0lOX0tFWSA9ICdfbmlraXRha2l0X3B5dGhvbic7XG5cbmNvbnN0IFZBUklBQkxFX0VYUExPUkVSX1VSSSA9ICdhdG9tOi8vaHlkcm9nZW4tcHl0aG9uL3ZhcmlhYmxlLWV4cGxvcmVyJztcblxuZnVuY3Rpb24gX2dldFVzZXJuYW1lKCkge1xuICByZXR1cm4gKFxuICAgIHByb2Nlc3MuZW52LkxPR05BTUUgfHxcbiAgICBwcm9jZXNzLmVudi5VU0VSIHx8XG4gICAgcHJvY2Vzcy5lbnYuTE5BTUUgfHxcbiAgICBwcm9jZXNzLmVudi5VU0VSTkFNRVxuICApO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNZXNzYWdlRmFjdG9yeShwYXJlbnRfaGVhZGVyKSB7XG4gIHJldHVybiB0eXBlID0+ICh7XG4gICAgaGVhZGVyOiB7XG4gICAgICB1c2VybmFtZTogX2dldFVzZXJuYW1lKCksXG4gICAgICBzZXNzaW9uOiBwYXJlbnRfaGVhZGVyLnNlc3Npb24sIC8vIGNoZWNrIGlmIHRoaXMgaXMgY29ycmVjdFxuICAgICAgbXNnX3R5cGU6IHR5cGUsXG4gICAgICBtc2dfaWQ6IHY0KCksXG4gICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgdmVyc2lvbjogJzUuMCcsXG4gICAgfSxcbiAgICBtZXRhZGF0YToge30sXG4gICAgcGFyZW50X2hlYWRlcixcbiAgICBjb250ZW50OiB7fSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvZGVGcm9tRmlsZShmaWxlbmFtZSkge1xuICAvLyBUYWtlcyBhIGZpbGUgYW5kIHJ1bnMgaXQgaW4gYSAocG9zc2libHkgcmVtb3RlKSBrZXJuZWwsIHdoaWxlIHRyeWluZyBub3QgdG9cbiAgLy8gcG9sbHV0ZSB0aGUga2VybmVsJ3MgZ2xvYmFsIG5hbWVzcGFjZS4gV2Ugc3VwcGx5IGFsbCB0aGUgcHl0aG9uIGZpbGVzIHRoaXNcbiAgLy8gZ2V0cyBjYWxsZWQgb24sIHNvIHRvIGF2b2lkIGVzY2FwaW5nIGlzc3VlcyB3ZSBtYW5kYXRlIHRoYXQgdGhlIGZpbGVzIG5vdFxuICAvLyBjb250YWluICcnJyBhbnl3aGVyZS5cbiAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAncHknLCBmaWxlbmFtZSk7XG4gIGNvbnN0IGNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKGZ1bGxQYXRoLCAndXRmOCcpO1xuICBpZiAoY29udGVudHMuaW5jbHVkZXMoXCInJydcIikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGUgJHtmaWxlbmFtZX0gY29udGFpbnMgdHJpcGxlIHNpbmdsZS1xdW90ZXNgKTtcbiAgfVxuXG4gIHJldHVybiBgZXhlYygnJycke2NvbnRlbnRzfScnJywgZ2xvYmFscygpLmNvcHkoKSlgO1xufVxuXG5mdW5jdGlvbiBleHBhbmRDb2RlKGVkaXRvciwgY29kZSkge1xuICBjb25zdCBzZWxlY3Rpb24gPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpO1xuICBjb25zdCBpc1NlbGVjdGlvbiA9ICFzZWxlY3Rpb24uc3RhcnQuaXNFcXVhbChzZWxlY3Rpb24uZW5kKTtcbiAgLy8gaWYgdGhlcmUgaXMgYSBzZWxlY3Rpb24sIHdlIGRvbid0IG5lZWQgdG8gZXhwYW5kIHRoZSBjb2RlXG4gIGlmIChpc1NlbGVjdGlvbikge1xuICAgIHJldHVybiBjb2RlO1xuICB9XG5cbiAgY29uc3Qgb3JpZ2luYWxDb2RlTGVuZ3RoID0gY29kZS5zcGxpdCgnXFxuJykubGVuZ3RoO1xuXG4gIGNvbnN0IGJ1ZmZlclJvd0xlbmd0aCA9IGVkaXRvci5nZXRMYXN0QnVmZmVyUm93KCk7XG5cbiAgLy8gdHJpbSByaWdodCB0byBhdm9pZCBlbXB0eSBsaW5lcyBhdCB0aGUgZW5kIG9mIHRoZSBzZWxlY3Rpb25cbiAgY29kZSA9IGNvZGUudHJpbVJpZ2h0KCk7XG5cbiAgY29uc3QgY3Vyc29yTGluZVRleHQgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coc2VsZWN0aW9uLnN0YXJ0LnJvdyk7XG4gIGNvbnN0IGxhc3RDb2RlTGluZVRleHQgPSBjb2RlLnNwbGl0KCdcXG4nKVtjb2RlLnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxXTtcbiAgY29uc3QgaXNSdW5XaXRob3V0TW92ZSA9IChjb2RlLmluY2x1ZGVzKGN1cnNvckxpbmVUZXh0KSAmJlxuICAgZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KFxuICAgICBNYXRoLm1pbihzZWxlY3Rpb24uc3RhcnQucm93ICsgY29kZS5zcGxpdCgnXFxuJykubGVuZ3RoIC0gMSxcbiAgICAgICBidWZmZXJSb3dMZW5ndGgpKS50cmltUmlnaHQoKSA9PT0gbGFzdENvZGVMaW5lVGV4dCk7XG5cbiAgLy8gZmluZCBzdGFydCBvZiBleGVjdXRlZCBjb2RlXG4gIGxldCBzdGFydEJ1ZmZlclJvdyA9IHNlbGVjdGlvbi5zdGFydC5yb3c7XG4gIGlmICghaXNSdW5XaXRob3V0TW92ZSkge1xuICAgIHdoaWxlIChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coc3RhcnRCdWZmZXJSb3cpLnRyaW0oKSAhPSBsYXN0Q29kZUxpbmVUZXh0LnRyaW0oKSkge1xuICAgICAgc3RhcnRCdWZmZXJSb3cgLT0gMTtcbiAgICAgIGlmIChzdGFydEJ1ZmZlclJvdyA8IDApIGJyZWFrO1xuICAgIH1cbiAgICBzdGFydEJ1ZmZlclJvdyA9IE1hdGgubWF4KDAsIHN0YXJ0QnVmZmVyUm93IC0gY29kZS5zcGxpdCgnXFxuJykubGVuZ3RoICsgMSk7XG4gIH1cblxuICAvLyBmaW5kIG9yaWdpbmFsIGluZGVudFxuICBjb25zdCBpbmRlbnQgPSAoY29kZS5tYXRjaCgvXlxccysvKSB8fCAnJyk7XG5cbiAgLy8gcHJlcGFyZSBleHBhbnNpb24gcmVnZXggdG8gdGhlIHRvcFxuICBjb25zdCBwcmVwZW5kQ29kZUxpc3QgPSBhdG9tLmNvbmZpZy5nZXQoJ2h5ZHJvZ2VuLXB5dGhvbi5wcmVwZW5kQ29kZUxpc3QnKTtcbiAgY29uc3QgcHJlcGVuZENvZGUgPSBwcmVwZW5kQ29kZUxpc3Quam9pbignfCcpO1xuICBjb25zdCBwcmVwZW5kUmVnZXggPSBuZXcgUmVnRXhwKGBeKCR7aW5kZW50fSgke3ByZXBlbmRDb2RlfSkpYCk7XG5cbiAgLy8gaWYgc3RhcnQgbGluZSBtYXRjaGVzIHRoZSBwcmVwZW5kIGNvZGUgcmVnZXhcbiAgLy8gZXhwYW5kIHRvIGZpcnN0IG5vbi1wcmVwZW5kIGxpbmVcbiAgbGV0IHByZXBlbmRPZmZzZXQgPSAwO1xuICB3aGlsZSAoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHN0YXJ0QnVmZmVyUm93ICsgcHJlcGVuZE9mZnNldCkubWF0Y2gocHJlcGVuZFJlZ2V4KSkge1xuICAgIHByZXBlbmRPZmZzZXQgKz0gMTtcbiAgICBjb2RlICs9IGBcXG4ke2VkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzdGFydEJ1ZmZlclJvdyArIHByZXBlbmRPZmZzZXQpfWA7XG4gIH1cblxuICAvLyBmdW5jdGlvbiB0byBpZGVudGlmeSBicmVha3BvaW50cyB2aWEgdG9rZW5zXG4gIGNvbnN0IGlzQnJlYWtwb2ludCA9IHJvd251bSA9PlxuICAgIGVkaXRvci50b2tlbml6ZWRCdWZmZXIudG9rZW5pemVkTGluZXNbcm93bnVtXS50b2tlbnMucmVkdWNlKFxuICAgICAgKGFjY3VtdWxhdGVkLCB0b2tlbikgPT4gdG9rZW4uc2NvcGVzLmNvbmNhdChhY2N1bXVsYXRlZCksXG4gICAgICBbXSxcbiAgICApLmZpbHRlcihcbiAgICAgIHRva2VuID0+IHRva2VuLmVuZHNXaXRoKCcuYnJlYWtwb2ludCcpLFxuICAgICkubGVuZ3RoID4gMDtcblxuICAvLyBwcmVwYXJlIGV4cGFuc2lvbiByZWdleCB0byB0aGUgYm90dG9tXG4gIGNvbnN0IGV4cGFuZENvZGVMaXN0ID0gYXRvbS5jb25maWcuZ2V0KCdoeWRyb2dlbi1weXRob24uZXhwYW5kQ29kZUxpc3QnKTtcbiAgLy8gYWRkIHdoaXRlc3BhY2UgdG8gdGhlIGxpc3RcbiAgY29uc3QgZXhwYW5kQ29kZSA9IFsnXFxcXHMnXS5jb25jYXQoZXhwYW5kQ29kZUxpc3QpLmpvaW4oJ3wnKTtcbiAgY29uc3QgZXhwYW5kUmVnZXggPSBuZXcgUmVnRXhwKGBeKCR7aW5kZW50fSgke2V4cGFuZENvZGV9KXxcXHMqI3xcXHMqJClgKTtcblxuICBsZXQgbGFzdFJvdyA9IHN0YXJ0QnVmZmVyUm93ICsgKGNvZGUuc3BsaXQoJ1xcbicpLmxlbmd0aCAtIDEpO1xuICBjb25zdCBvcmlnUm93ID0gbGFzdFJvdztcbiAgbGV0IG5leHRSb3dUZXh0ID0gKGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhsYXN0Um93ICsgMSkgfHwgJycpO1xuXG4gIC8vIGV4cGFuZCBjb2RlIHRvIHRoZSBib3R0b21cbiAgd2hpbGUgKGxhc3RSb3cgPD0gYnVmZmVyUm93TGVuZ3RoICYmICFpc0JyZWFrcG9pbnQobGFzdFJvdykgJiYgbmV4dFJvd1RleHQubWF0Y2goZXhwYW5kUmVnZXgpKSB7XG4gICAgY29kZSArPSBgXFxuJHtuZXh0Um93VGV4dH1gO1xuICAgIGxhc3RSb3cgKz0gMTtcbiAgICBpZiAobGFzdFJvdyArIDEgPiBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpKSBicmVhaztcbiAgICBuZXh0Um93VGV4dCA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhsYXN0Um93ICsgMSk7XG4gIH1cblxuICAvLyBleHBhbmQgY29kZSB0byB0aGUgdG9wXG4gIGxldCBwcmV2Um93VGV4dCA9IChlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coc3RhcnRCdWZmZXJSb3cgLSAxKSB8fCAnJyk7XG4gIHdoaWxlIChzdGFydEJ1ZmZlclJvdyAtIDEgPj0gMCAmJiAhaXNCcmVha3BvaW50KHN0YXJ0QnVmZmVyUm93IC0gMSkgJiYgcHJldlJvd1RleHQubWF0Y2gocHJlcGVuZFJlZ2V4KSkge1xuICAgIGNvZGUgPSBgJHtwcmV2Um93VGV4dH1cXG4ke2NvZGV9YDtcbiAgICBzdGFydEJ1ZmZlclJvdyAtPSAxO1xuICAgIGlmIChzdGFydEJ1ZmZlclJvdyA8PSAwKSBicmVhaztcbiAgICBwcmV2Um93VGV4dCA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzdGFydEJ1ZmZlclJvdyAtIDEpO1xuICB9XG5cbiAgaWYgKGNvZGUudHJpbVJpZ2h0KCkuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IG9yaWdpbmFsQ29kZUxlbmd0aCkgeyBjb25zb2xlLmxvZyhgW2h5ZHJvZ2VuLXB5dGhvbl0gZXhlY3V0ZWQgY29kZSBmcm9tIGxpbmUgJHtzdGFydEJ1ZmZlclJvdyArIDF9IHRvIGxpbmUgJHtsYXN0Um93ICsgMX1gKTsgfVxuXG4gIC8vIGlmIHJ1bi1hbmQtbW92ZSBzZXQgY3Vyc29yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG5leHQgY29udGVudCBsaW5lXG4gIGlmICghaXNSdW5XaXRob3V0TW92ZSkge1xuICAgIGxldCBidWZmZXJSb3cgPSBzdGFydEJ1ZmZlclJvdyArIGNvZGUuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICB3aGlsZSAoYnVmZmVyUm93IDw9IGJ1ZmZlclJvd0xlbmd0aCAmJiAoZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGJ1ZmZlclJvdykgfHwgJycpLm1hdGNoKC9eXFxzKigkfCMpLykpIHsgYnVmZmVyUm93ICs9IDE7IH1cbiAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWyhidWZmZXJSb3cgPT0gc3RhcnRCdWZmZXJSb3cpID8gKGJ1ZmZlclJvdyArIDEpIDogKGJ1ZmZlclJvdyksIDBdKTtcbiAgfVxuXG4gIHJldHVybiBjb2RlO1xufVxuXG5jbGFzcyBQeXRob25LZXJuZWxNb2Qge1xuICBjb25zdHJ1Y3RvcihrZXJuZWwsIGVtaXR0ZXIpIHtcbiAgICB0aGlzLmtlcm5lbCA9IGtlcm5lbDtcbiAgICB0aGlzLmVtaXR0ZXIgPSBlbWl0dGVyO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLmtlcm5lbC5hZGRNaWRkbGV3YXJlKHRoaXMpO1xuXG4gICAgdGhpcy5rZXJuZWxQbHVnaW5JbnN0YWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmtlcm5lbFBsdWdpbkZhaWxlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5lbmFibGVWYXJpYWJsZUV4cGxvcmVyID0gZmFsc2U7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZW1pdHRlci5vbignZGlkLXNob3ctZXhwbG9yZXInLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW5hYmxlVmFyaWFibGVFeHBsb3JlciA9IHRydWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtaW5zdGFsbC1taWRkbGV3YXJlJyk7XG4gIH1cblxuICBleGVjdXRlKG5leHQsIGNvZGUsIG9uUmVzdWx0cykge1xuICAgIGxldCBtYWtlUmVwbHkgPSBudWxsO1xuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnaHlkcm9nZW4tcHl0aG9uLmV4cGFuZENvZGUnKSkge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgY29kZSA9IGV4cGFuZENvZGUoZWRpdG9yLCBjb2RlKTtcbiAgICB9XG5cbiAgICAvLyBJUHl0aG9uIGNhbiBzdHJpbmcgbGVhZGluZyBpbmRlbnRhdGlvbiBpZiBldmVyeSBsaW5lIG9mIGNvZGUgYmVpbmcgcnVuXG4gICAgLy8gaXMgaW5kZW50ZWQgdGhlIHNhbWUgYW1vdW50LiBIb3dldmVyLCB0aGlzIG9ubHkgd29ya3MgaWYgdGhlIGZpcnN0IGxpbmVcbiAgICAvLyBpcyBpbmRlbnRlZC4gV2UgdGhlcmVmb3JlIHRyaW0gZW1wdHkgbGluZXMgYXQgdGhlIHN0YXJ0IG9mIHRoZSBleGVjdXRlZFxuICAgIC8vIHJlZ2lvbi5cbiAgICBjb2RlID0gY29kZS5yZXBsYWNlKC9eXFxufFxcbiQvZywgJycpO1xuXG4gICAgbmV4dC5leGVjdXRlKGNvZGUsIChtc2csIGNoYW5uZWwpID0+IHtcbiAgICAgIGlmICghbWFrZVJlcGx5ICYmIG1zZy5wYXJlbnRfaGVhZGVyKSB7XG4gICAgICAgIG1ha2VSZXBseSA9IGNyZWF0ZU1lc3NhZ2VGYWN0b3J5KG1zZy5wYXJlbnRfaGVhZGVyKTtcbiAgICAgIH1cblxuICAgICAgb25SZXN1bHRzKG1zZywgY2hhbm5lbCk7XG4gICAgICBpZiAobXNnLmhlYWRlci5tc2dfdHlwZSA9PSAnZXhlY3V0ZV9yZXBseScpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlVmFyaWFibGVFeHBsb3Jlcikge1xuICAgICAgICAgIHRoaXMudmFyaWFibGVFeHBsb3Jlckhvb2sobmV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNodXRkb3duKG5leHQpIHtcbiAgICBuZXh0LnNodXRkb3duKCk7XG5cbiAgICB0aGlzLmtlcm5lbFBsdWdpbkluc3RhbGxlZCA9IGZhbHNlO1xuICAgIHRoaXMua2VybmVsUGx1Z2luRmFpbGVkID0gZmFsc2U7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtdmFycycsIFtdKTtcbiAgfVxuXG4gIHJlc3RhcnQobmV4dCwgb25SZXN0YXJ0ZWQpIHtcbiAgICBuZXh0LnJlc3RhcnQob25SZXN0YXJ0ZWQpO1xuXG4gICAgdGhpcy5rZXJuZWxQbHVnaW5JbnN0YWxsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmtlcm5lbFBsdWdpbkZhaWxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLXZhcnMnLCBbXSk7XG4gIH1cblxuICB3cmFwRGF0YUhhbmRsZXIoZGF0YUhhbmRsZXIpIHtcbiAgICByZXR1cm4gKG1zZywgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGNoYW5uZWwgPT09ICdpb3B1YidcbiAgICAgICAgJiYgbXNnLmhlYWRlci5tc2dfdHlwZSA9PT0gJ2Rpc3BsYXlfZGF0YSdcbiAgICAgICAgJiYgbXNnLmNvbnRlbnQuZGF0YVxuICAgICAgICAmJiBtc2cuY29udGVudC5kYXRhWydhcHBsaWNhdGlvbi9qc29uJ11cbiAgICAgICAgJiYgbXNnLmNvbnRlbnQuZGF0YVsnYXBwbGljYXRpb24vanNvbiddLmh5ZHJvZ2VuX3B5dGhvbikge1xuICAgICAgICBkYXRhSGFuZGxlcihtc2cuY29udGVudC5kYXRhWydhcHBsaWNhdGlvbi9qc29uJ10uaHlkcm9nZW5fcHl0aG9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhcnRLZXJuZWxQbHVnaW5JbnN0YWxsKG5leHQsIG9uSW5zdGFsbGVkKSB7XG4gICAgdGhpcy5rZXJuZWxQbHVnaW5GYWlsZWQgPSB0cnVlO1xuICAgIGNvbnN0IHNhbml0eUNvZGUgPSBjb2RlRnJvbUZpbGUoJ3Nhbml0eV9jaGVjay5weScpO1xuICAgIGNvbnN0IGluc3RhbGxDb2RlID0gY29kZUZyb21GaWxlKCdpbnN0YWxsX2tlcm5lbF9wbHVnaW4ucHknKTtcbiAgICBuZXh0LmV4ZWN1dGUoc2FuaXR5Q29kZSwgdGhpcy53cmFwRGF0YUhhbmRsZXIoKGRhdGEpID0+IHtcbiAgICAgIGlmIChkYXRhICE9PSAncGFzcycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbmV4dC5leGVjdXRlKGluc3RhbGxDb2RlLCB0aGlzLndyYXBEYXRhSGFuZGxlcigoZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnaHlkcm9nZW4tcHl0aG9uOiBrZXJuZWwgcGx1Z2luIGluc3RhbGxlZCcpO1xuICAgICAgICB0aGlzLmtlcm5lbFBsdWdpbkluc3RhbGxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMua2VybmVsUGx1Z2luRmFpbGVkID0gZmFsc2U7XG4gICAgICAgIGlmIChvbkluc3RhbGxlZCkge1xuICAgICAgICAgIG9uSW5zdGFsbGVkKG5leHQpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfSkpO1xuICB9XG5cbiAgdmFyaWFibGVFeHBsb3Jlckhvb2sobmV4dCkge1xuICAgIGlmICh0aGlzLmtlcm5lbFBsdWdpbkZhaWxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5rZXJuZWxQbHVnaW5JbnN0YWxsZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRLZXJuZWxQbHVnaW5JbnN0YWxsKG5leHQsIHRoaXMudmFyaWFibGVFeHBsb3Jlckhvb2suYmluZCh0aGlzKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbmV4dC5leGVjdXRlKFwiZ2V0X2lweXRob24oKS5faHlkcm9nZW5fcHl0aG9uLnJ1bigndmFyaWFibGVfZXhwbG9yZXJfaG9vaycpXCIsXG4gICAgICB0aGlzLndyYXBEYXRhSGFuZGxlcigoZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZGF0YS5lcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudmFyaWFibGVzKSB7XG4gICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtdmFycycsIGRhdGEudmFyaWFibGVzKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICB9XG59XG5cbmNvbnN0IEh5ZHJvZ2VuUHl0aG9uUGx1Z2luID0ge1xuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICBoeWRyb2dlbjogbnVsbCxcbiAgZW1pdHRlcjogbnVsbCxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcik7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKCh1cmkpID0+IHtcbiAgICAgICAgc3dpdGNoICh1cmkpIHtcbiAgICAgICAgICBjYXNlIFZBUklBQkxFX0VYUExPUkVSX1VSSTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFyaWFibGVFeHBsb3JlclBhbmUodGhpcy5lbWl0dGVyKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICAvLyBEZXN0cm95IGFueSBQYW5lcyB3aGVuIHRoZSBwYWNrYWdlIGlzIGRlYWN0aXZhdGVkLlxuICAgICAgbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBWYXJpYWJsZUV4cGxvcmVyKSB7XG4gICAgICAgICAgICBpdGVtLmRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcjpub3QoW21pbmldKScsIHtcbiAgICAgICAgJ2h5ZHJvZ2VuLXB5dGhvbjp0b2dnbGUtdmFyaWFibGUtZXhwbG9yZXInOiAoKSA9PlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLnRvZ2dsZShWQVJJQUJMRV9FWFBMT1JFUl9VUkkpLFxuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgY29uc3VtZUh5ZHJvZ2VuKGh5ZHJvZ2VuKSB7XG4gICAgdGhpcy5oeWRyb2dlbiA9IGh5ZHJvZ2VuO1xuXG4gICAgdGhpcy5oeWRyb2dlbi5vbkRpZENoYW5nZUtlcm5lbCgoa2VybmVsKSA9PiB7XG4gICAgICBpZiAoa2VybmVsICYmIGtlcm5lbC5sYW5ndWFnZSA9PT0gJ3B5dGhvbicgJiYgIWtlcm5lbFtQTFVHSU5fS0VZXSkge1xuICAgICAgICBjb25zdCBrZXJuZWxNb2QgPSBuZXcgUHl0aG9uS2VybmVsTW9kKGtlcm5lbCwgdGhpcy5lbWl0dGVyKTtcbiAgICAgICAga2VybmVsW1BMVUdJTl9LRVldID0geyBtb2Q6IGtlcm5lbE1vZCB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHRoaXMuaHlkcm9nZW4gPSBudWxsO1xuICAgIH0pO1xuICB9LFxufTtcblxuY2xhc3MgVmFyaWFibGVFeHBsb3JlclBhbmUge1xuICByZWFjdEVsZW1lbnQgPSBudWxsO1xuICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKGVtaXR0ZXIpIHtcbiAgICBjb25zdCByZWFjdEVsZW1lbnQgPSA8VmFyaWFibGVFeHBsb3JlciBlbWl0dGVyPXtlbWl0dGVyfSAvPjtcblxuICAgIFJlYWN0RE9NLnJlbmRlcihyZWFjdEVsZW1lbnQsIHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBSZWFjdERPTS51bm1vdW50Q29tcG9uZW50QXROb2RlKHRoaXMuZWxlbWVudCk7XG4gICAgfSkpO1xuXG4gICAgZW1pdHRlci5lbWl0KCdkaWQtc2hvdy1leHBsb3JlcicpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBlbWl0dGVyLm9uKCdkaWQtaW5zdGFsbC1taWRkbGV3YXJlJywgKCkgPT4ge1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ2RpZC1zaG93LWV4cGxvcmVyJyk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgZ2V0VGl0bGUgPSAoKSA9PiAnVmFyaWFibGUgRXhwbG9yZXInO1xuXG4gIGdldFVSSSA9ICgpID0+IFZBUklBQkxFX0VYUExPUkVSX1VSSTtcblxuICBnZXREZWZhdWx0TG9jYXRpb24gPSAoKSA9PiAncmlnaHQnO1xuXG4gIGdldEFsbG93ZWRMb2NhdGlvbnMgPSAoKSA9PiBbJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJ107XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIeWRyb2dlblB5dGhvblBsdWdpbjtcbiJdfQ==