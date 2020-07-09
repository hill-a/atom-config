(function() {
  var BufferedProcess, CompositeDisposable, dirname, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  dirname = require('path').dirname;

  module.exports = {
    subscriptions: null,
    activate: function(state) {
      var target;
      this.subscriptions = new CompositeDisposable;
      target = 'atom-text-editor[data-grammar~="ocaml"]';
      this.subscriptions.add(atom.commands.add(target, {
        'ocaml-indent:selection': (function(_this) {
          return function() {
            return _this.indentSelection();
          };
        })(this),
        'ocaml-indent:file': (function(_this) {
          return function() {
            return _this.indentFile();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var editorSubscriptions;
          editorSubscriptions = new CompositeDisposable;
          _this.subscriptions.add(editorSubscriptions);
          editor.onDidDestroy(function() {
            _this.subscriptions.remove(editorSubscriptions);
            return editorSubscriptions.dispose();
          });
          editorSubscriptions.add(editor.observeGrammar(function(grammar) {
            var didInsertTextDisposable;
            if (typeof didInsertTextDisposable !== "undefined" && didInsertTextDisposable !== null) {
              editorSubscriptions.remove(didInsertTextDisposable);
              didInsertTextDisposable.dispose();
              didInsertTextDisposable = null;
            }
            if (!['source.ocaml', 'ocaml'].includes(grammar.scopeName)) {
              return;
            }
            didInsertTextDisposable = editor.onDidInsertText(function(arg) {
              var prefix, range, text;
              text = arg.text, range = arg.range;
              if (text.endsWith('\n')) {
                _this.indentNewline(editor, range);
              }
              prefix = editor.getTextInBufferRange([[range.end.row, 0], range.end]);
              if (prefix.match(/(else|then|do|and|end|done|\)|\}|\]|\|)$/)) {
                return _this.indentRange(editor, range);
              }
            });
            return editorSubscriptions.add(didInsertTextDisposable);
          }));
          return editorSubscriptions.add(editor.getBuffer().onWillSave(function() {
            if (!['source.ocaml', 'ocaml'].includes(editor.getGrammar().scopeName)) {
              return;
            }
            if (atom.config.get('ocaml-indent.indentOnSave')) {
              return _this.indentFile(editor);
            }
          }));
        };
      })(this)));
    },
    indentRange: function(editor, arg, text) {
      var args, cwd, end, start;
      start = arg.start, end = arg.end;
      args = ['--numeric', '--lines', (start.row + 1) + "-" + (end.row + 1)];
      if (text == null) {
        text = editor.getText();
      }
      cwd = editor.getPath() != null ? dirname(editor.getPath()) : atom.project.getPaths()[0];
      return this.ocpIndent(args, text, cwd).then((function(_this) {
        return function(output) {
          var indents, s;
          indents = (function() {
            var j, len, ref1, results;
            ref1 = output.trim().split('\n');
            results = [];
            for (j = 0, len = ref1.length; j < len; j++) {
              s = ref1[j];
              results.push(parseInt(s));
            }
            return results;
          })();
          return _this.doIndents(editor, start.row, indents);
        };
      })(this));
    },
    indentNewline: function(editor, range) {
      var line, text;
      text = editor.getTextInBufferRange([[0, 0], range.end]);
      line = editor.lineTextForBufferRow(range.end.row);
      text += line.trim().length ? line : "(**)";
      return this.indentRange(editor, range, text);
    },
    indentSelection: function() {
      var editor, j, len, range, ref1, results;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      ref1 = editor.getSelectedBufferRanges();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        range = ref1[j];
        results.push(this.indentRange(editor, range));
      }
      return results;
    },
    indentFile: function(editor) {
      if (!(editor != null ? editor : editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      return this.indentRange(editor, editor.getBuffer().getRange());
    },
    ocpIndent: function(args, text, cwd) {
      return new Promise(function(resolve, reject) {
        var bp, command, exit, options, stdout;
        command = atom.config.get('ocaml-indent.ocpIndentPath');
        args = args.concat(atom.config.get('ocaml-indent.ocpIndentArgs'));
        stdout = function(output) {
          return resolve(output);
        };
        exit = function(code) {
          if (code) {
            return reject(code);
          }
        };
        options = {
          cwd: cwd
        };
        bp = new BufferedProcess({
          command: command,
          args: args,
          stdout: stdout,
          exit: exit,
          options: options
        });
        bp.process.stdin.write(text);
        return bp.process.stdin.end();
      });
    },
    doIndents: function(editor, startRow, indents) {
      return editor.transact(100, function() {
        var col, i, indent, indentString, j, len, ref1, ref2, results, row;
        results = [];
        for (i = j = 0, len = indents.length; j < len; i = ++j) {
          indent = indents[i];
          row = startRow + i;
          col = (ref1 = (ref2 = editor.lineTextForBufferRow(row)) != null ? ref2.match(/^\s*/)[0].length : void 0) != null ? ref1 : 0;
          indentString = " ".repeat(indent);
          results.push(editor.setTextInBufferRange([[row, 0], [row, col]], indentString));
        }
        return results;
      });
    },
    provideIndent: function() {
      return {
        indentFile: (function(_this) {
          return function(editor) {
            return _this.indentFile(editor);
          };
        })(this),
        indentRange: (function(_this) {
          return function(editor, range) {
            return _this.indentRange(editor, range);
          };
        })(this)
      };
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvb2NhbWwtaW5kZW50L2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDckIsVUFBVyxPQUFBLENBQVEsTUFBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsTUFBQSxHQUFTO01BQ1QsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixNQUFsQixFQUNqQjtRQUFBLHdCQUFBLEVBQTBCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtRQUNBLG1CQUFBLEVBQXFCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURyQjtPQURpQixDQUFuQjthQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO0FBQ25ELGNBQUE7VUFBQSxtQkFBQSxHQUFzQixJQUFJO1VBQzFCLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixtQkFBbkI7VUFDQSxNQUFNLENBQUMsWUFBUCxDQUFvQixTQUFBO1lBQ2xCLEtBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFzQixt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QkFBQSxTQUFDLE1BQUQsRUFBUyxLQUFUO21CQUFtQixLQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsS0FBckI7VUFBbkI7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGI7O0lBRGEsQ0FoRmY7SUFvRkEsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURVLENBcEZaOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIEJ1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xue2Rpcm5hbWV9ID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgdGFyZ2V0ID0gJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1cIm9jYW1sXCJdJ1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCB0YXJnZXQsXG4gICAgICAnb2NhbWwtaW5kZW50OnNlbGVjdGlvbic6ID0+IEBpbmRlbnRTZWxlY3Rpb24oKVxuICAgICAgJ29jYW1sLWluZGVudDpmaWxlJzogPT4gQGluZGVudEZpbGUoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgZWRpdG9yU3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yU3Vic2NyaXB0aW9uc1xuICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSA9PlxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5yZW1vdmUgZWRpdG9yU3Vic2NyaXB0aW9uc1xuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9ic2VydmVHcmFtbWFyIChncmFtbWFyKSA9PlxuICAgICAgICBpZiBkaWRJbnNlcnRUZXh0RGlzcG9zYWJsZT9cbiAgICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLnJlbW92ZSBkaWRJbnNlcnRUZXh0RGlzcG9zYWJsZVxuICAgICAgICAgIGRpZEluc2VydFRleHREaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgICAgIGRpZEluc2VydFRleHREaXNwb3NhYmxlID0gbnVsbFxuICAgICAgICByZXR1cm4gdW5sZXNzIFsnc291cmNlLm9jYW1sJywgJ29jYW1sJ10uaW5jbHVkZXMgZ3JhbW1hci5zY29wZU5hbWVcbiAgICAgICAgZGlkSW5zZXJ0VGV4dERpc3Bvc2FibGUgPSBlZGl0b3Iub25EaWRJbnNlcnRUZXh0ICh7dGV4dCwgcmFuZ2V9KSA9PlxuICAgICAgICAgIGlmIHRleHQuZW5kc1dpdGggJ1xcbidcbiAgICAgICAgICAgIEBpbmRlbnROZXdsaW5lIGVkaXRvciwgcmFuZ2VcbiAgICAgICAgICBwcmVmaXggPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UgW1tyYW5nZS5lbmQucm93LCAwXSwgcmFuZ2UuZW5kXVxuICAgICAgICAgIGlmIHByZWZpeC5tYXRjaCAvKGVsc2V8dGhlbnxkb3xhbmR8ZW5kfGRvbmV8XFwpfFxcfXxcXF18XFx8KSQvXG4gICAgICAgICAgICBAaW5kZW50UmFuZ2UgZWRpdG9yLCByYW5nZVxuICAgICAgICBlZGl0b3JTdWJzY3JpcHRpb25zLmFkZCBkaWRJbnNlcnRUZXh0RGlzcG9zYWJsZVxuICAgICAgZWRpdG9yU3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLmdldEJ1ZmZlcigpLm9uV2lsbFNhdmUgPT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyBbJ3NvdXJjZS5vY2FtbCcsICdvY2FtbCddLmluY2x1ZGVzIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCAnb2NhbWwtaW5kZW50LmluZGVudE9uU2F2ZSdcbiAgICAgICAgICBAaW5kZW50RmlsZSBlZGl0b3JcblxuICBpbmRlbnRSYW5nZTogKGVkaXRvciwge3N0YXJ0LCBlbmR9LCB0ZXh0KSAtPlxuICAgIGFyZ3MgPSBbJy0tbnVtZXJpYycsICctLWxpbmVzJywgXCIje3N0YXJ0LnJvdyArIDF9LSN7ZW5kLnJvdyArIDF9XCJdXG4gICAgdGV4dCA/PSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgY3dkID0gaWYgZWRpdG9yLmdldFBhdGgoKT9cbiAgICAgIGRpcm5hbWUgZWRpdG9yLmdldFBhdGgoKVxuICAgIGVsc2VcbiAgICAgIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgQG9jcEluZGVudCBhcmdzLCB0ZXh0LCBjd2RcbiAgICAudGhlbiAob3V0cHV0KSA9PlxuICAgICAgaW5kZW50cyA9IChwYXJzZUludCBzIGZvciBzIGluIG91dHB1dC50cmltKCkuc3BsaXQgJ1xcbicpXG4gICAgICBAZG9JbmRlbnRzIGVkaXRvciwgc3RhcnQucm93LCBpbmRlbnRzXG5cbiAgaW5kZW50TmV3bGluZTogKGVkaXRvciwgcmFuZ2UpIC0+XG4gICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSBbWzAsIDBdLCByYW5nZS5lbmRdXG4gICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyByYW5nZS5lbmQucm93XG4gICAgdGV4dCArPSBpZiBsaW5lLnRyaW0oKS5sZW5ndGggdGhlbiBsaW5lIGVsc2UgXCIoKiopXCJcbiAgICBAaW5kZW50UmFuZ2UgZWRpdG9yLCByYW5nZSwgdGV4dFxuXG4gIGluZGVudFNlbGVjdGlvbjogLT5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGZvciByYW5nZSBpbiBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKVxuICAgICAgQGluZGVudFJhbmdlIGVkaXRvciwgcmFuZ2VcblxuICBpbmRlbnRGaWxlOiAoZWRpdG9yKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID89IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBpbmRlbnRSYW5nZSBlZGl0b3IsIGVkaXRvci5nZXRCdWZmZXIoKS5nZXRSYW5nZSgpXG5cbiAgb2NwSW5kZW50OiAoYXJncywgdGV4dCwgY3dkKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBjb21tYW5kID0gYXRvbS5jb25maWcuZ2V0ICdvY2FtbC1pbmRlbnQub2NwSW5kZW50UGF0aCdcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdCBhdG9tLmNvbmZpZy5nZXQgJ29jYW1sLWluZGVudC5vY3BJbmRlbnRBcmdzJ1xuICAgICAgc3Rkb3V0ID0gKG91dHB1dCkgLT4gcmVzb2x2ZSBvdXRwdXRcbiAgICAgIGV4aXQgPSAoY29kZSkgLT4gcmVqZWN0IGNvZGUgaWYgY29kZVxuICAgICAgb3B0aW9ucyA9IHtjd2R9XG4gICAgICBicCA9IG5ldyBCdWZmZXJlZFByb2Nlc3Mge2NvbW1hbmQsIGFyZ3MsIHN0ZG91dCwgZXhpdCwgb3B0aW9uc31cbiAgICAgIGJwLnByb2Nlc3Muc3RkaW4ud3JpdGUgdGV4dFxuICAgICAgYnAucHJvY2Vzcy5zdGRpbi5lbmQoKVxuXG4gIGRvSW5kZW50czogKGVkaXRvciwgc3RhcnRSb3csIGluZGVudHMpIC0+XG4gICAgZWRpdG9yLnRyYW5zYWN0IDEwMCwgLT5cbiAgICAgIGZvciBpbmRlbnQsIGkgaW4gaW5kZW50c1xuICAgICAgICByb3cgPSBzdGFydFJvdyArIGlcbiAgICAgICAgY29sID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdyk/Lm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aCA/IDBcbiAgICAgICAgaW5kZW50U3RyaW5nID0gIFwiIFwiLnJlcGVhdCBpbmRlbnRcbiAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKFtbcm93LCAwXSwgW3JvdywgY29sXV0sIGluZGVudFN0cmluZylcblxuICBwcm92aWRlSW5kZW50OiAtPlxuICAgIGluZGVudEZpbGU6IChlZGl0b3IpID0+IEBpbmRlbnRGaWxlIGVkaXRvclxuICAgIGluZGVudFJhbmdlOiAoZWRpdG9yLCByYW5nZSkgPT4gQGluZGVudFJhbmdlIGVkaXRvciwgcmFuZ2VcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuIl19
