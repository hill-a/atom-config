Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.provideBuilder = provideBuilder;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _atom = require('atom');

'use babel';

var errorMatch = '(?s)"(?<file>[\\/0-9a-zA-Z\\._\\-]+)", line (?<line>\\d+), characters (?<col>\\d+)-(?<col_end>\\d+):\\s*(?<message>.+?)\\n\\S';

var targets = {
  '.ml': {
    '.native': 'Native Executable',
    '.byte': 'Bytecode Executable',
    '.cmo': 'Bytecode Object',
    '.cmx': 'Native Object',
    '.inferred.mli': 'Inferred Interface'
  },
  'mli': {
    '.cmi': 'Compiled Interface'
  },
  '.mllib': {
    '.cma': 'Bytecode Library',
    '.cmxa': 'Native Library'
  },
  '.mldylib': {
    '.cmxs': 'Native Plugin'
  },
  '.odocl': {
    '.docdir/index.html': 'HTML Documentation'
  },
  '.mly': {
    '.ml': 'Menhir Parser'
  },
  '.mlypack': {
    '.ml': 'Menhir Parser'
  },
  '.mlpack': {
    '.cmo': 'Bytecode Object',
    '.cmx': 'Native Object'
  },
  '.mltop': {
    '.top': 'Custom Toplevel'
  }
};

function buildTargets(file) {
  var exec = atom.config.get('build-ocaml.ocamlbuildPath');
  var p = _path2['default'].parse(file);
  var fileTargets = targets[p.ext];
  var base = _path2['default'].join(p.dir, p.name);
  var args = atom.config.get('build-ocaml.ocamlbuildArgs');

  var settings = [];

  for (var ext in fileTargets) {
    var _name = fileTargets[ext];
    var command = _name.toLowerCase().replace(' ', '-');
    settings.push({
      exec: exec,
      name: _name,
      args: args.concat([base + ext]),
      atomCommandName: 'build-ocaml:' + command,
      errorMatch: errorMatch
    });
  }

  settings.push({
    exec: exec,
    name: 'Clean',
    args: ['-clean'],
    atomCommandName: 'build-ocaml:clean'
  });

  return settings;
}

function provideBuilder() {
  return (function (_EventEmitter) {
    _inherits(OcamlbuildBuildProvider, _EventEmitter);

    function OcamlbuildBuildProvider(cwd) {
      _classCallCheck(this, OcamlbuildBuildProvider);

      _get(Object.getPrototypeOf(OcamlbuildBuildProvider.prototype), 'constructor', this).call(this);
      this.cwd = cwd;
    }

    _createClass(OcamlbuildBuildProvider, [{
      key: 'destructor',
      value: function destructor() {
        if (this.disposable) this.disposable.dispose();
      }
    }, {
      key: 'getNiceName',
      value: function getNiceName() {
        return 'Ocamlbuild';
      }
    }, {
      key: 'isEligible',
      value: function isEligible() {
        var _this = this;

        if (_fs2['default'].existsSync(_path2['default'].join(this.cwd, '_tags'))) {
          if (!this.disposable) {
            this.disposable = atom.workspace.onDidStopChangingActivePaneItem(function (item) {
              if (item instanceof _atom.TextEditor) {
                _this.emit('refresh');
              }
            });
          }
          return true;
        } else {
          if (this.disposable) this.disposable.dispose();
          this.disposable = null;
          return false;
        }
      }
    }, {
      key: 'settings',
      value: function settings() {
        var editor = atom.workspace.getActiveTextEditor();
        if (editor && editor.getPath()) {
          var file = _path2['default'].relative(this.cwd, editor.getPath());
          return buildTargets(file);
        } else {
          return [];
        }
      }
    }]);

    return OcamlbuildBuildProvider;
  })(_events2['default']);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLW9jYW1sL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OztzQkFDTSxRQUFROzs7O29CQUNSLE1BQU07O0FBTC9CLFdBQVcsQ0FBQTs7QUFPWCxJQUFNLFVBQVUsR0FBRywrSEFBK0gsQ0FBQTs7QUFFbEosSUFBTSxPQUFPLEdBQUc7QUFDZCxPQUFLLEVBQUU7QUFDTCxhQUFTLEVBQUUsbUJBQW1CO0FBQzlCLFdBQU8sRUFBRSxxQkFBcUI7QUFDOUIsVUFBTSxFQUFFLGlCQUFpQjtBQUN6QixVQUFNLEVBQUUsZUFBZTtBQUN2QixtQkFBZSxFQUFFLG9CQUFvQjtHQUN0QztBQUNELE9BQUssRUFBRTtBQUNMLFVBQU0sRUFBRSxvQkFBb0I7R0FDN0I7QUFDRCxVQUFRLEVBQUU7QUFDUixVQUFNLEVBQUUsa0JBQWtCO0FBQzFCLFdBQU8sRUFBRSxnQkFBZ0I7R0FDMUI7QUFDRCxZQUFVLEVBQUU7QUFDVixXQUFPLEVBQUUsZUFBZTtHQUN6QjtBQUNELFVBQVEsRUFBRTtBQUNSLHdCQUFvQixFQUFFLG9CQUFvQjtHQUMzQztBQUNELFFBQU0sRUFBRTtBQUNOLFNBQUssRUFBRSxlQUFlO0dBQ3ZCO0FBQ0QsWUFBVSxFQUFFO0FBQ1YsU0FBSyxFQUFFLGVBQWU7R0FDdkI7QUFDRCxXQUFTLEVBQUU7QUFDVCxVQUFNLEVBQUUsaUJBQWlCO0FBQ3pCLFVBQU0sRUFBRSxlQUFlO0dBQ3hCO0FBQ0QsVUFBUSxFQUFFO0FBQ1IsVUFBTSxFQUFFLGlCQUFpQjtHQUMxQjtDQUNGLENBQUE7O0FBRUQsU0FBUyxZQUFZLENBQUUsSUFBSSxFQUFFO0FBQzNCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUE7QUFDMUQsTUFBTSxDQUFDLEdBQUcsa0JBQUss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QU8sRUFBRSxDQUFBO1NBQ1Y7T0FDRjs7O1dBdkNVLHVCQUF1QjswQkF3Q25DO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvYnVpbGQtb2NhbWwvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQge1RleHRFZGl0b3J9IGZyb20gJ2F0b20nXG5cbmNvbnN0IGVycm9yTWF0Y2ggPSAnKD9zKVwiKD88ZmlsZT5bXFxcXC8wLTlhLXpBLVpcXFxcLl9cXFxcLV0rKVwiLCBsaW5lICg/PGxpbmU+XFxcXGQrKSwgY2hhcmFjdGVycyAoPzxjb2w+XFxcXGQrKS0oPzxjb2xfZW5kPlxcXFxkKyk6XFxcXHMqKD88bWVzc2FnZT4uKz8pXFxcXG5cXFxcUydcblxuY29uc3QgdGFyZ2V0cyA9IHtcbiAgJy5tbCc6IHtcbiAgICAnLm5hdGl2ZSc6ICdOYXRpdmUgRXhlY3V0YWJsZScsXG4gICAgJy5ieXRlJzogJ0J5dGVjb2RlIEV4ZWN1dGFibGUnLFxuICAgICcuY21vJzogJ0J5dGVjb2RlIE9iamVjdCcsXG4gICAgJy5jbXgnOiAnTmF0aXZlIE9iamVjdCcsXG4gICAgJy5pbmZlcnJlZC5tbGknOiAnSW5mZXJyZWQgSW50ZXJmYWNlJ1xuICB9LFxuICAnbWxpJzoge1xuICAgICcuY21pJzogJ0NvbXBpbGVkIEludGVyZmFjZSdcbiAgfSxcbiAgJy5tbGxpYic6IHtcbiAgICAnLmNtYSc6ICdCeXRlY29kZSBMaWJyYXJ5JyxcbiAgICAnLmNteGEnOiAnTmF0aXZlIExpYnJhcnknXG4gIH0sXG4gICcubWxkeWxpYic6IHtcbiAgICAnLmNteHMnOiAnTmF0aXZlIFBsdWdpbidcbiAgfSxcbiAgJy5vZG9jbCc6IHtcbiAgICAnLmRvY2Rpci9pbmRleC5odG1sJzogJ0hUTUwgRG9jdW1lbnRhdGlvbidcbiAgfSxcbiAgJy5tbHknOiB7XG4gICAgJy5tbCc6ICdNZW5oaXIgUGFyc2VyJ1xuICB9LFxuICAnLm1seXBhY2snOiB7XG4gICAgJy5tbCc6ICdNZW5oaXIgUGFyc2VyJ1xuICB9LFxuICAnLm1scGFjayc6IHtcbiAgICAnLmNtbyc6ICdCeXRlY29kZSBPYmplY3QnLFxuICAgICcuY214JzogJ05hdGl2ZSBPYmplY3QnXG4gIH0sXG4gICcubWx0b3AnOiB7XG4gICAgJy50b3AnOiAnQ3VzdG9tIFRvcGxldmVsJ1xuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVGFyZ2V0cyAoZmlsZSkge1xuICBjb25zdCBleGVjID0gYXRvbS5jb25maWcuZ2V0KCdidWlsZC1vY2FtbC5vY2FtbGJ1aWxkUGF0aCcpXG4gIGNvbnN0IHAgPSBwYXRoLnBhcnNlKGZpbGUpXG4gIGNvbnN0IGZpbGVUYXJnZXRzID0gdGFyZ2V0c1twLmV4dF1cbiAgY29uc3QgYmFzZSA9IHBhdGguam9pbihwLmRpciwgcC5uYW1lKVxuICBjb25zdCBhcmdzID0gYXRvbS5jb25maWcuZ2V0KCdidWlsZC1vY2FtbC5vY2FtbGJ1aWxkQXJncycpXG5cbiAgY29uc3Qgc2V0dGluZ3MgPSBbXVxuXG4gIGZvciAoY29uc3QgZXh0IGluIGZpbGVUYXJnZXRzKSB7XG4gICAgY29uc3QgbmFtZSA9IGZpbGVUYXJnZXRzW2V4dF1cbiAgICBjb25zdCBjb21tYW5kID0gbmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnLScpXG4gICAgc2V0dGluZ3MucHVzaCh7XG4gICAgICBleGVjLFxuICAgICAgbmFtZSxcbiAgICAgIGFyZ3M6IGFyZ3MuY29uY2F0KFtiYXNlICsgZXh0XSksXG4gICAgICBhdG9tQ29tbWFuZE5hbWU6IGBidWlsZC1vY2FtbDoke2NvbW1hbmR9YCxcbiAgICAgIGVycm9yTWF0Y2hcbiAgICB9KVxuICB9XG5cbiAgc2V0dGluZ3MucHVzaCh7XG4gICAgZXhlYyxcbiAgICBuYW1lOiAnQ2xlYW4nLFxuICAgIGFyZ3M6IFsnLWNsZWFuJ10sXG4gICAgYXRvbUNvbW1hbmROYW1lOiBgYnVpbGQtb2NhbWw6Y2xlYW5gXG4gIH0pXG5cbiAgcmV0dXJuIHNldHRpbmdzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlQnVpbGRlciAoKSB7XG4gIHJldHVybiBjbGFzcyBPY2FtbGJ1aWxkQnVpbGRQcm92aWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IgKGN3ZCkge1xuICAgICAgc3VwZXIoKVxuICAgICAgdGhpcy5jd2QgPSBjd2RcbiAgICB9XG5cbiAgICBkZXN0cnVjdG9yICgpIHtcbiAgICAgIGlmICh0aGlzLmRpc3Bvc2FibGUpIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICB9XG5cbiAgICBnZXROaWNlTmFtZSAoKSB7XG4gICAgICByZXR1cm4gJ09jYW1sYnVpbGQnXG4gICAgfVxuXG4gICAgaXNFbGlnaWJsZSAoKSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4odGhpcy5jd2QsICdfdGFncycpKSkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzcG9zYWJsZSkge1xuICAgICAgICAgIHRoaXMuZGlzcG9zYWJsZSA9IGF0b20ud29ya3NwYWNlLm9uRGlkU3RvcENoYW5naW5nQWN0aXZlUGFuZUl0ZW0oKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgVGV4dEVkaXRvcikge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3JlZnJlc2gnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3Bvc2FibGUpIHRoaXMuZGlzcG9zYWJsZS5kaXNwb3NlKClcbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlID0gbnVsbFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR0aW5ncyAoKSB7XG4gICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmIChlZGl0b3IgJiYgZWRpdG9yLmdldFBhdGgoKSkge1xuICAgICAgICBjb25zdCBmaWxlID0gcGF0aC5yZWxhdGl2ZSh0aGlzLmN3ZCwgZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgICAgcmV0dXJuIGJ1aWxkVGFyZ2V0cyhmaWxlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=