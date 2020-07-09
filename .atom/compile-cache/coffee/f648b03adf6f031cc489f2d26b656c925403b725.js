(function() {
  var Buffer, CompositeDisposable, Disposable, Merlin, RenameView, SelectionView, TypeView, languages, ref, scopes, selectors;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  languages = ['ocaml', 'ocamllex', 'ocamlyacc', 'reason'];

  scopes = ['ocaml'].concat(languages.map(function(language) {
    return "source." + language;
  }));

  selectors = languages.map(function(language) {
    return ".source." + language;
  });

  Merlin = null;

  Buffer = null;

  TypeView = null;

  SelectionView = null;

  RenameView = null;

  module.exports = {
    merlin: null,
    subscriptions: null,
    buffers: {},
    typeViews: {},
    selectionViews: {},
    latestType: null,
    occurrences: null,
    positions: [],
    indentRange: null,
    activate: function(state) {
      var target;
      Merlin = require('./merlin');
      Buffer = require('./buffer');
      TypeView = require('./type-view');
      SelectionView = require('./selection-view');
      this.merlin = new Merlin;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.onDidChange('ocaml-merlin.merlinPath', (function(_this) {
        return function() {
          return _this.restartMerlin();
        };
      })(this)));
      target = scopes.map(function(scope) {
        return "atom-text-editor[data-grammar='" + (scope.replace(/\./g, ' ')) + "']";
      }).join(', ');
      this.subscriptions.add(atom.commands.add(target, {
        'ocaml-merlin:show-type': (function(_this) {
          return function() {
            return _this.toggleType();
          };
        })(this),
        'ocaml-merlin:toggle-type': (function(_this) {
          return function() {
            return _this.toggleType();
          };
        })(this),
        'ocaml-merlin:shrink-type': (function(_this) {
          return function() {
            return _this.shrinkType();
          };
        })(this),
        'ocaml-merlin:expand-type': (function(_this) {
          return function() {
            return _this.expandType();
          };
        })(this),
        'ocaml-merlin:close-bubble': (function(_this) {
          return function() {
            return _this.closeType();
          };
        })(this),
        'ocaml-merlin:insert-latest-type': (function(_this) {
          return function() {
            return _this.insertType();
          };
        })(this),
        'ocaml-merlin:destruct': (function(_this) {
          return function() {
            return _this.destruct();
          };
        })(this),
        'ocaml-merlin:next-occurrence': (function(_this) {
          return function() {
            return _this.getOccurrence(1);
          };
        })(this),
        'ocaml-merlin:previous-occurrence': (function(_this) {
          return function() {
            return _this.getOccurrence(-1);
          };
        })(this),
        'ocaml-merlin:go-to-declaration': (function(_this) {
          return function() {
            return _this.goToDeclaration('ml');
          };
        })(this),
        'ocaml-merlin:go-to-type-declaration': (function(_this) {
          return function() {
            return _this.goToDeclaration('mli');
          };
        })(this),
        'ocaml-merlin:return-from-declaration': (function(_this) {
          return function() {
            return _this.returnFromDeclaration();
          };
        })(this),
        'ocaml-merlin:shrink-selection': (function(_this) {
          return function() {
            return _this.shrinkSelection();
          };
        })(this),
        'ocaml-merlin:expand-selection': (function(_this) {
          return function() {
            return _this.expandSelection();
          };
        })(this),
        'ocaml-merlin:rename-variable': (function(_this) {
          return function() {
            return _this.renameVariable();
          };
        })(this),
        'ocaml-merlin:restart-merlin': (function(_this) {
          return function() {
            return _this.restartMerlin();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.subscriptions.add(editor.observeGrammar(function(grammar) {
            if (scopes.includes(grammar.scopeName)) {
              return _this.addBuffer(editor.getBuffer());
            } else {
              return _this.removeBuffer(editor.getBuffer());
            }
          }));
          return _this.subscriptions.add(editor.onDidDestroy(function() {
            delete _this.typeViews[editor.id];
            return delete _this.selectionViews[editor.id];
          }));
        };
      })(this)));
    },
    restartMerlin: function() {
      var _, buffer, ref1;
      ref1 = this.buffers;
      for (_ in ref1) {
        buffer = ref1[_];
        buffer.setChanged(true);
      }
      return this.merlin.restart();
    },
    addBuffer: function(textBuffer) {
      var buffer, bufferId;
      bufferId = textBuffer.getId();
      if (this.buffers[bufferId] != null) {
        return;
      }
      buffer = new Buffer(textBuffer, (function(_this) {
        return function() {
          return delete _this.buffers[bufferId];
        };
      })(this));
      this.buffers[bufferId] = buffer;
      return this.merlin.project(buffer).then((function(_this) {
        return function(arg) {
          var failures, merlinFiles;
          merlinFiles = arg.merlinFiles, failures = arg.failures;
          if (failures != null) {
            atom.workspace.notificationManager.addError(failures.join('\n'));
          }
          if (merlinFiles.length) {
            return;
          }
          _this.merlin.setFlags(buffer, atom.config.get('ocaml-merlin.default.flags')).then(function(arg1) {
            var failures;
            failures = arg1.failures;
            if (failures != null) {
              return atom.workspace.notificationManager.addError(failures.join('\n'));
            }
          });
          _this.merlin.usePackages(buffer, atom.config.get('ocaml-merlin.default.packages')).then(function(arg1) {
            var failures;
            failures = arg1.failures;
            if (failures != null) {
              return atom.workspace.notificationManager.addError(failures.join('\n'));
            }
          });
          _this.merlin.enableExtensions(buffer, atom.config.get('ocaml-merlin.default.extensions'));
          _this.merlin.addSourcePaths(buffer, atom.config.get('ocaml-merlin.default.sourcePaths'));
          return _this.merlin.addBuildPaths(buffer, atom.config.get('ocaml-merlin.default.buildPaths'));
        };
      })(this));
    },
    removeBuffer: function(textBuffer) {
      var ref1;
      return (ref1 = this.buffers[textBuffer.getId()]) != null ? ref1.destroy() : void 0;
    },
    getBuffer: function(editor) {
      var buffer, textBuffer;
      textBuffer = editor.getBuffer();
      buffer = this.buffers[textBuffer.getId()];
      if (buffer != null) {
        return buffer;
      }
      this.addBuffer(textBuffer);
      return this.buffers[textBuffer.getId()];
    },
    toggleType: function() {
      var editor, ref1, ref2;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if ((ref1 = this.typeViews[editor.id]) != null ? (ref2 = ref1.marker) != null ? ref2.isValid() : void 0 : void 0) {
        this.typeViews[editor.id].destroy();
        return delete this.typeViews[editor.id];
      } else {
        return this.merlin.type(this.getBuffer(editor), editor.getCursorBufferPosition()).then((function(_this) {
          return function(typeList) {
            var typeView;
            if (!typeList.length) {
              return;
            }
            typeView = new TypeView(typeList, editor);
            _this.latestType = typeView.show();
            return _this.typeViews[editor.id] = typeView;
          };
        })(this));
      }
    },
    shrinkType: function() {
      var editor, ref1;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      return this.latestType = (ref1 = this.typeViews[editor.id]) != null ? ref1.shrink() : void 0;
    },
    expandType: function() {
      var editor, ref1;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      return this.latestType = (ref1 = this.typeViews[editor.id]) != null ? ref1.expand() : void 0;
    },
    closeType: function() {
      var editor, ref1;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      if ((ref1 = this.typeViews[editor.id]) != null) {
        ref1.destroy();
      }
      return delete this.typeViews[editor.id];
    },
    insertType: function() {
      var editor;
      if (this.latestType == null) {
        return;
      }
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      return editor.insertText(this.latestType);
    },
    destruct: function() {
      var editor;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      return this.merlin.destruct(this.getBuffer(editor), editor.getSelectedBufferRange()).then((function(_this) {
        return function(arg) {
          var content, range;
          range = arg.range, content = arg.content;
          return editor.transact(100, function() {
            range = editor.setTextInBufferRange(range, content);
            if (_this.indentRange != null) {
              return _this.indentRange(editor, range);
            }
          });
        };
      })(this), function(arg) {
        var message;
        message = arg.message;
        return atom.workspace.notificationManager.addError(message);
      });
    },
    getOccurrence: function(offset) {
      var editor, point;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      point = editor.getCursorBufferPosition();
      return this.merlin.occurrences(this.getBuffer(editor), point).then(function(ranges) {
        var index, range;
        index = ranges.findIndex(function(range) {
          return range.containsPoint(point);
        });
        range = ranges[(index + offset) % ranges.length];
        return editor.setSelectedBufferRange(range);
      });
    },
    goToDeclaration: function(kind) {
      var currentPoint, editor;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      currentPoint = editor.getCursorBufferPosition();
      return this.merlin.locate(this.getBuffer(editor), currentPoint, kind).then((function(_this) {
        return function(arg) {
          var file, point;
          file = arg.file, point = arg.point;
          _this.positions.push({
            file: editor.getPath(),
            point: currentPoint
          });
          if (file !== editor.getPath()) {
            return atom.workspace.open(file, {
              initialLine: point.row,
              initialColumn: point.column,
              pending: true,
              searchAllPanes: true
            });
          } else {
            return editor.setCursorBufferPosition(point);
          }
        };
      })(this), function(reason) {
        return atom.workspace.notificationManager.addError(reason);
      });
    },
    returnFromDeclaration: function() {
      var position;
      if (!(position = this.positions.pop())) {
        return;
      }
      return atom.workspace.open(position.file, {
        initialLine: position.point.row,
        initialColumn: position.point.column,
        pending: true,
        searchAllPanes: true
      });
    },
    getSelectionView: function() {
      var editor, selectionView;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      selectionView = this.selectionViews[editor.id];
      if (selectionView != null ? selectionView.isAlive() : void 0) {
        return Promise.resolve(selectionView);
      }
      return this.merlin.enclosing(this.getBuffer(editor), editor.getCursorBufferPosition()).then((function(_this) {
        return function(ranges) {
          selectionView = new SelectionView(editor, ranges);
          return _this.selectionViews[editor.id] = selectionView;
        };
      })(this));
    },
    shrinkSelection: function() {
      return this.getSelectionView().then(function(selectionView) {
        return selectionView.shrink();
      });
    },
    expandSelection: function() {
      return this.getSelectionView().then(function(selectionView) {
        return selectionView.expand();
      });
    },
    renameView: function(name, callback) {
      if (RenameView == null) {
        RenameView = require('./rename-view');
      }
      return new RenameView({
        name: name,
        callback: callback
      });
    },
    renameVariable: function() {
      var editor;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      return this.merlin.occurrences(this.getBuffer(editor), editor.getCursorBufferPosition()).then((function(_this) {
        return function(ranges) {
          var currentName;
          currentName = editor.getTextInBufferRange(ranges[0]);
          return _this.renameView(currentName, function(newName) {
            return editor.transact(function() {
              return ranges.reverse().map(function(range) {
                return editor.setTextInBufferRange(range, newName);
              });
            });
          });
        };
      })(this));
    },
    deactivate: function() {
      var _, buffer, ref1, results;
      this.merlin.close();
      this.subscriptions.dispose();
      ref1 = this.buffers;
      results = [];
      for (_ in ref1) {
        buffer = ref1[_];
        results.push(buffer.destroy());
      }
      return results;
    },
    getPrefix: function(editor, point) {
      var line;
      line = editor.getTextInBufferRange([[point.row, 0], point]);
      return line.match(/[^\s\[\](){}<>,+*\/-]*$/)[0];
    },
    provideAutocomplete: function() {
      var completePartialPrefixes, kindToType, minimumWordLength;
      minimumWordLength = 1;
      this.subscriptions.add(atom.config.observe("autocomplete-plus.minimumWordLength", function(value) {
        return minimumWordLength = value;
      }));
      completePartialPrefixes = false;
      this.subscriptions.add(atom.config.observe("ocaml-merlin.completePartialPrefixes", function(value) {
        return completePartialPrefixes = value;
      }));
      kindToType = {
        "Value": "value",
        "Variant": "variable",
        "Constructor": "class",
        "Label": "keyword",
        "Module": "method",
        "Signature": "type",
        "Type": "type",
        "Method": "property",
        "#": "constant",
        "Exn": "keyword",
        "Class": "class"
      };
      return {
        selector: selectors.join(', '),
        getSuggestions: (function(_this) {
          return function(arg) {
            var activatedManually, bufferPosition, editor, index, prefix, promise, replacement;
            editor = arg.editor, bufferPosition = arg.bufferPosition, activatedManually = arg.activatedManually;
            prefix = _this.getPrefix(editor, bufferPosition);
            if (prefix.length < (activatedManually ? 1 : minimumWordLength)) {
              return [];
            }
            if (completePartialPrefixes) {
              replacement = prefix;
              promise = _this.merlin.expand(_this.getBuffer(editor), bufferPosition, prefix);
            } else {
              index = prefix.lastIndexOf(".");
              if (index >= 0) {
                replacement = prefix.substr(index + 1);
              }
              promise = _this.merlin.complete(_this.getBuffer(editor), bufferPosition, prefix);
            }
            return promise.then(function(entries) {
              return entries.map(function(arg1) {
                var desc, info, kind, name;
                name = arg1.name, kind = arg1.kind, desc = arg1.desc, info = arg1.info;
                return {
                  text: name,
                  replacementPrefix: replacement,
                  type: kindToType[kind],
                  leftLabel: kind,
                  rightLabel: desc,
                  description: info.length ? info : desc
                };
              });
            });
          };
        })(this),
        disableForSelector: (selectors.map(function(selector) {
          return selector + " .comment";
        })).join(', '),
        inclusionPriority: 1
      };
    },
    provideLinter: function() {
      return {
        name: 'OCaml Merlin',
        scope: 'file',
        lintsOnChange: atom.config.get('ocaml-merlin.lintAsYouType'),
        grammarScopes: scopes,
        lint: (function(_this) {
          return function(editor) {
            var buffer;
            if (!(buffer = _this.getBuffer(editor))) {
              return [];
            }
            return _this.merlin.errors(buffer).then(function(errors) {
              return errors.map(function(arg) {
                var m, message, range, type;
                range = arg.range, type = arg.type, message = arg.message;
                return {
                  location: {
                    file: editor.getPath(),
                    position: range
                  },
                  excerpt: message.match('\n') ? type[0].toUpperCase() + type.slice(1) : message,
                  severity: type === 'warning' ? 'warning' : 'error',
                  description: message.match('\n') ? "```\n" + message + "```" : null,
                  solutions: (m = message.match(/Hint: Did you mean (.*)\?/)) ? [
                    {
                      position: range,
                      replaceWith: m[1]
                    }
                  ] : []
                };
              });
            });
          };
        })(this)
      };
    },
    consumeIndent: function(arg) {
      this.indentRange = arg.indentRange;
      return new Disposable((function(_this) {
        return function() {
          return _this.indentRange = null;
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvb2NhbWwtbWVybGluL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFFdEIsU0FBQSxHQUFZLENBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsV0FBdEIsRUFBbUMsUUFBbkM7O0VBQ1osTUFBQSxHQUFTLENBQUMsT0FBRCxDQUFTLENBQUMsTUFBVixDQUFpQixTQUFTLENBQUMsR0FBVixDQUFjLFNBQUMsUUFBRDtXQUFjLFNBQUEsR0FBVTtFQUF4QixDQUFkLENBQWpCOztFQUNULFNBQUEsR0FBWSxTQUFTLENBQUMsR0FBVixDQUFjLFNBQUMsUUFBRDtXQUFjLFVBQUEsR0FBVztFQUF6QixDQUFkOztFQUVaLE1BQUEsR0FBUzs7RUFDVCxNQUFBLEdBQVM7O0VBQ1QsUUFBQSxHQUFXOztFQUNYLGFBQUEsR0FBZ0I7O0VBQ2hCLFVBQUEsR0FBYTs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLElBQVI7SUFDQSxhQUFBLEVBQWUsSUFEZjtJQUVBLE9BQUEsRUFBUyxFQUZUO0lBSUEsU0FBQSxFQUFXLEVBSlg7SUFLQSxjQUFBLEVBQWdCLEVBTGhCO0lBT0EsVUFBQSxFQUFZLElBUFo7SUFTQSxXQUFBLEVBQWEsSUFUYjtJQVdBLFNBQUEsRUFBVyxFQVhYO0lBYUEsV0FBQSxFQUFhLElBYmI7SUFlQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjtNQUNULE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjtNQUNULFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjtNQUNYLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSO01BRWhCLElBQUMs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S0FBM0MsR0FBcUQsSUFMbEU7a0JBTUEsU0FBQSxFQUFjLENBQUEsQ0FBQSxHQUFJLE9BQU8sQ0FBQyxLQUFSLENBQWMsMkJBQWQsQ0FBSixDQUFILEdBQXNEO29CQUMvRDtzQkFBQSxRQUFBLEVBQVUsS0FBVjtzQkFDQSxXQUFBLEVBQWEsQ0FBRSxDQUFBLENBQUEsQ0FEZjtxQkFEK0Q7bUJBQXRELEdBR0osRUFUUDs7Y0FEUyxDQUFYO1lBREksQ0FETjtVQUZJO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpOOztJQURhLENBelBmO0lBOFFBLGFBQUEsRUFBZSxTQUFDLEdBQUQ7TUFBRSxJQUFDLENBQUEsY0FBRixJQUFFO2FBQ2hCLElBQUksVUFBSixDQUFlLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsV0FBRCxHQUFlO1FBQWxCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO0lBRGEsQ0E5UWY7O0FBYkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5sYW5ndWFnZXMgPSBbJ29jYW1sJywgJ29jYW1sbGV4JywgJ29jYW1seWFjYycsICdyZWFzb24nXVxuc2NvcGVzID0gWydvY2FtbCddLmNvbmNhdCBsYW5ndWFnZXMubWFwIChsYW5ndWFnZSkgLT4gXCJzb3VyY2UuI3tsYW5ndWFnZX1cIlxuc2VsZWN0b3JzID0gbGFuZ3VhZ2VzLm1hcCAobGFuZ3VhZ2UpIC0+IFwiLnNvdXJjZS4je2xhbmd1YWdlfVwiXG5cbk1lcmxpbiA9IG51bGxcbkJ1ZmZlciA9IG51bGxcblR5cGVWaWV3ID0gbnVsbFxuU2VsZWN0aW9uVmlldyA9IG51bGxcblJlbmFtZVZpZXcgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgbWVybGluOiBudWxsXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgYnVmZmVyczoge31cblxuICB0eXBlVmlld3M6IHt9XG4gIHNlbGVjdGlvblZpZXdzOiB7fVxuXG4gIGxhdGVzdFR5cGU6IG51bGxcblxuICBvY2N1cnJlbmNlczogbnVsbFxuXG4gIHBvc2l0aW9uczogW11cblxuICBpbmRlbnRSYW5nZTogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgTWVybGluID0gcmVxdWlyZSAnLi9tZXJsaW4nXG4gICAgQnVmZmVyID0gcmVxdWlyZSAnLi9idWZmZXInXG4gICAgVHlwZVZpZXcgPSByZXF1aXJlICcuL3R5cGUtdmlldydcbiAgICBTZWxlY3Rpb25WaWV3ID0gcmVxdWlyZSAnLi9zZWxlY3Rpb24tdmlldydcblxuICAgIEBtZXJsaW4gPSBuZXcgTWVybGluXG5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ29jYW1sLW1lcmxpbi5tZXJsaW5QYXRoJywgPT5cbiAgICAgIEByZXN0YXJ0TWVybGluKClcblxuICAgIHRhcmdldCA9IHNjb3Blcy5tYXAgKHNjb3BlKSAtPlxuICAgICAgXCJhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj0nI3tzY29wZS5yZXBsYWNlIC9cXC4vZywgJyAnfSddXCJcbiAgICAuam9pbiAnLCAnXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgdGFyZ2V0LFxuICAgICAgJ29jYW1sLW1lcmxpbjpzaG93LXR5cGUnOiA9PiBAdG9nZ2xlVHlwZSgpXG4gICAgICAnb2NhbWwtbWVybGluOnRvZ2dsZS10eXBlJzogPT4gQHRvZ2dsZVR5cGUoKVxuICAgICAgJ29jYW1sLW1lcmxpbjpzaHJpbmstdHlwZSc6ID0+IEBzaHJpbmtUeXBlKClcbiAgICAgICdvY2FtbC1tZXJsaW46ZXhwYW5kLXR5cGUnOiA9PiBAZXhwYW5kVHlwZSgpXG4gICAgICAnb2NhbWwtbWVybGluOmNsb3NlLWJ1YmJsZSc6ID0+IEBjbG9zZVR5cGUoKVxuICAgICAgJ29jYW1sLW1lcmxpbjppbnNlcnQtbGF0ZXN0LXR5cGUnOiA9PiBAaW5zZXJ0VHlwZSgpXG4gICAgICAnb2NhbWwtbWVybGluOmRlc3RydWN0JzogPT4gQGRlc3RydWN0KClcbiAgICAgICdvY2FtbC1tZXJsaW46bmV4dC1vY2N1cnJlbmNlJzogPT4gQGdldE9jY3VycmVuY2UoMSlcbiAgICAgICdvY2FtbC1tZXJsaW46cHJldmlvdXMtb2NjdXJyZW5jZSc6ID0+IEBnZXRPY2N1cnJlbmNlKC0xKVxuICAgICAgJ29jYW1sLW1lcmxpbjpnby10by1kZWNsYXJhdGlvbic6ID0+IEBnb1RvRGVjbGFyYXRpb24oJ21sJylcbiAgICAgICdvY2FtbC1tZXJsaW46Z28tdG8tdHlwZS1kZWNsYXJhdGlvbic6ID0+IEBnb1RvRGVjbGFyYXRpb24oJ21saScpXG4gICAgICAnb2NhbWwtbWVybGluOnJldHVybi1mcm9tLWRlY2xhcmF0aW9uJzogPT4gQHJldHVybkZyb21EZWNsYXJhdGlvbigpXG4gICAgICAnb2NhbWwtbWVybGluOnNocmluay1zZWxlY3Rpb24nOiA9PiBAc2hyaW5rU2VsZWN0aW9uKClcbiAgICAgICdvY2FtbC1tZXJsaW46ZXhwYW5kLXNlbGVjdGlvbic6ID0+IEBleHBhbmRTZWxlY3Rpb24oKVxuICAgICAgJ29jYW1sLW1lcmxpbjpyZW5hbWUtdmFyaWFibGUnOiA9PiBAcmVuYW1lVmFyaWFibGUoKVxuICAgICAgJ29jYW1sLW1lcmxpbjpyZXN0YXJ0LW1lcmxpbic6ID0+IEByZXN0YXJ0TWVybGluKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub2JzZXJ2ZUdyYW1tYXIgKGdyYW1tYXIpID0+XG4gICAgICAgIGlmIHNjb3Blcy5pbmNsdWRlcyBncmFtbWFyLnNjb3BlTmFtZVxuICAgICAgICAgIEBhZGRCdWZmZXIgZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAcmVtb3ZlQnVmZmVyIGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZERlc3Ryb3kgPT5cbiAgICAgICAgZGVsZXRlIEB0eXBlVmlld3NbZWRpdG9yLmlkXVxuICAgICAgICBkZWxldGUgQHNlbGVjdGlvblZpZXdzW2VkaXRvci5pZF1cblxuICByZXN0YXJ0TWVybGluOiAtPlxuICAgIGJ1ZmZlci5zZXRDaGFuZ2VkIHRydWUgZm9yIF8sIGJ1ZmZlciBvZiBAYnVmZmVyc1xuICAgIEBtZXJsaW4ucmVzdGFydCgpXG5cbiAgYWRkQnVmZmVyOiAodGV4dEJ1ZmZlcikgLT5cbiAgICBidWZmZXJJZCA9IHRleHRCdWZmZXIuZ2V0SWQoKVxuICAgIHJldHVybiBpZiBAYnVmZmVyc1tidWZmZXJJZF0/XG4gICAgYnVmZmVyID0gbmV3IEJ1ZmZlciB0ZXh0QnVmZmVyLCA9PiBkZWxldGUgQGJ1ZmZlcnNbYnVmZmVySWRdXG4gICAgQGJ1ZmZlcnNbYnVmZmVySWRdID0gYnVmZmVyXG4gICAgQG1lcmxpbi5wcm9qZWN0IGJ1ZmZlclxuICAgIC50aGVuICh7bWVybGluRmlsZXMsIGZhaWx1cmVzfSkgPT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IgZmFpbHVyZXMuam9pbiAnXFxuJyBpZiBmYWlsdXJlcz9cbiAgICAgIHJldHVybiBpZiBtZXJsaW5GaWxlcy5sZW5ndGhcbiAgICAgIEBtZXJsaW4uc2V0RmxhZ3MgYnVmZmVyLCBhdG9tLmNvbmZpZy5nZXQgJ29jYW1sLW1lcmxpbi5kZWZhdWx0LmZsYWdzJ1xuICAgICAgLnRoZW4gKHtmYWlsdXJlc30pIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IgZmFpbHVyZXMuam9pbiAnXFxuJyBpZiBmYWlsdXJlcz9cbiAgICAgIEBtZXJsaW4udXNlUGFja2FnZXMgYnVmZmVyLCBhdG9tLmNvbmZpZy5nZXQgJ29jYW1sLW1lcmxpbi5kZWZhdWx0LnBhY2thZ2VzJ1xuICAgICAgLnRoZW4gKHtmYWlsdXJlc30pIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IgZmFpbHVyZXMuam9pbiAnXFxuJyBpZiBmYWlsdXJlcz9cbiAgICAgIEBtZXJsaW4uZW5hYmxlRXh0ZW5zaW9ucyBidWZmZXIsIGF0b20uY29uZmlnLmdldCAnb2NhbWwtbWVybGluLmRlZmF1bHQuZXh0ZW5zaW9ucydcbiAgICAgIEBtZXJsaW4uYWRkU291cmNlUGF0aHMgYnVmZmVyLCBhdG9tLmNvbmZpZy5nZXQgJ29jYW1sLW1lcmxpbi5kZWZhdWx0LnNvdXJjZVBhdGhzJ1xuICAgICAgQG1lcmxpbi5hZGRCdWlsZFBhdGhzIGJ1ZmZlciwgYXRvbS5jb25maWcuZ2V0ICdvY2FtbC1tZXJsaW4uZGVmYXVsdC5idWlsZFBhdGhzJ1xuXG4gIHJlbW92ZUJ1ZmZlcjogKHRleHRCdWZmZXIpIC0+XG4gICAgQGJ1ZmZlcnNbdGV4dEJ1ZmZlci5nZXRJZCgpXT8uZGVzdHJveSgpXG5cbiAgZ2V0QnVmZmVyOiAoZWRpdG9yKSAtPlxuICAgIHRleHRCdWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBidWZmZXIgPSBAYnVmZmVyc1t0ZXh0QnVmZmVyLmdldElkKCldXG4gICAgcmV0dXJuIGJ1ZmZlciBpZiBidWZmZXI/XG4gICAgQGFkZEJ1ZmZlciB0ZXh0QnVmZmVyXG4gICAgQGJ1ZmZlcnNbdGV4dEJ1ZmZlci5nZXRJZCgpXVxuXG4gIHRvZ2dsZVR5cGU6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiBAdHlwZVZpZXdzW2VkaXRvci5pZF0/Lm1hcmtlcj8uaXNWYWxpZCgpXG4gICAgICBAdHlwZVZpZXdzW2VkaXRvci5pZF0uZGVzdHJveSgpXG4gICAgICBkZWxldGUgQHR5cGVWaWV3c1tlZGl0b3IuaWRdXG4gICAgZWxzZVxuICAgICAgQG1lcmxpbi50eXBlIEBnZXRCdWZmZXIoZWRpdG9yKSwgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIC50aGVuICh0eXBlTGlzdCkgPT5cbiAgICAgICAgcmV0dXJuIHVubGVzcyB0eXBlTGlzdC5sZW5ndGhcbiAgICAgICAgdHlwZVZpZXcgPSBuZXcgVHlwZVZpZXcgdHlwZUxpc3QsIGVkaXRvclxuICAgICAgICBAbGF0ZXN0VHlwZSA9IHR5cGVWaWV3LnNob3coKVxuICAgICAgICBAdHlwZVZpZXdzW2VkaXRvci5pZF0gPSB0eXBlVmlld1xuXG4gIHNocmlua1R5cGU6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAbGF0ZXN0VHlwZSA9IEB0eXBlVmlld3NbZWRpdG9yLmlkXT8uc2hyaW5rKClcblxuICBleHBhbmRUeXBlOiAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQGxhdGVzdFR5cGUgPSBAdHlwZVZpZXdzW2VkaXRvci5pZF0/LmV4cGFuZCgpXG5cbiAgY2xvc2VUeXBlOiAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQHR5cGVWaWV3c1tlZGl0b3IuaWRdPy5kZXN0cm95KClcbiAgICBkZWxldGUgQHR5cGVWaWV3c1tlZGl0b3IuaWRdXG5cbiAgaW5zZXJ0VHlwZTogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBsYXRlc3RUeXBlP1xuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgZWRpdG9yLmluc2VydFRleHQgQGxhdGVzdFR5cGVcblxuICBkZXN0cnVjdDogLT5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBtZXJsaW4uZGVzdHJ1Y3QgQGdldEJ1ZmZlcihlZGl0b3IpLCBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG4gICAgLnRoZW4gKHtyYW5nZSwgY29udGVudH0pID0+XG4gICAgICBlZGl0b3IudHJhbnNhY3QgMTAwLCA9PlxuICAgICAgICByYW5nZSA9IGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZSByYW5nZSwgY29udGVudFxuICAgICAgICBAaW5kZW50UmFuZ2UgZWRpdG9yLCByYW5nZSBpZiBAaW5kZW50UmFuZ2U/XG4gICAgLCAoe21lc3NhZ2V9KSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uubm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvciBtZXNzYWdlXG5cbiAgZ2V0T2NjdXJyZW5jZTogKG9mZnNldCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHBvaW50ID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBAbWVybGluLm9jY3VycmVuY2VzIEBnZXRCdWZmZXIoZWRpdG9yKSwgcG9pbnRcbiAgICAudGhlbiAocmFuZ2VzKSAtPlxuICAgICAgaW5kZXggPSByYW5nZXMuZmluZEluZGV4IChyYW5nZSkgLT4gcmFuZ2UuY29udGFpbnNQb2ludCBwb2ludFxuICAgICAgcmFuZ2UgPSByYW5nZXNbKGluZGV4ICsgb2Zmc2V0KSAlIHJhbmdlcy5sZW5ndGhdXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSByYW5nZVxuXG4gIGdvVG9EZWNsYXJhdGlvbjogKGtpbmQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjdXJyZW50UG9pbnQgPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIEBtZXJsaW4ubG9jYXRlIEBnZXRCdWZmZXIoZWRpdG9yKSwgY3VycmVudFBvaW50LCBraW5kXG4gICAgLnRoZW4gKHtmaWxlLCBwb2ludH0pID0+XG4gICAgICBAcG9zaXRpb25zLnB1c2hcbiAgICAgICAgZmlsZTogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBwb2ludDogY3VycmVudFBvaW50XG4gICAgICBpZiBmaWxlIGlzbnQgZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGUsXG4gICAgICAgICAgaW5pdGlhbExpbmU6IHBvaW50LnJvd1xuICAgICAgICAgIGluaXRpYWxDb2x1bW46IHBvaW50LmNvbHVtblxuICAgICAgICAgIHBlbmRpbmc6IHRydWVcbiAgICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gcG9pbnRcbiAgICAsIChyZWFzb24pIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5ub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yIHJlYXNvblxuXG4gIHJldHVybkZyb21EZWNsYXJhdGlvbjogLT5cbiAgICByZXR1cm4gdW5sZXNzIHBvc2l0aW9uID0gQHBvc2l0aW9ucy5wb3AoKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gcG9zaXRpb24uZmlsZSxcbiAgICAgIGluaXRpYWxMaW5lOiBwb3NpdGlvbi5wb2ludC5yb3dcbiAgICAgIGluaXRpYWxDb2x1bW46IHBvc2l0aW9uLnBvaW50LmNvbHVtblxuICAgICAgcGVuZGluZzogdHJ1ZVxuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcblxuICBnZXRTZWxlY3Rpb25WaWV3OiAtPlxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgc2VsZWN0aW9uVmlldyA9IEBzZWxlY3Rpb25WaWV3c1tlZGl0b3IuaWRdXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShzZWxlY3Rpb25WaWV3KSBpZiBzZWxlY3Rpb25WaWV3Py5pc0FsaXZlKClcbiAgICBAbWVybGluLmVuY2xvc2luZyBAZ2V0QnVmZmVyKGVkaXRvciksIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgLnRoZW4gKHJhbmdlcykgPT5cbiAgICAgIHNlbGVjdGlvblZpZXcgPSBuZXcgU2VsZWN0aW9uVmlldyBlZGl0b3IsIHJhbmdlc1xuICAgICAgQHNlbGVjdGlvblZpZXdzW2VkaXRvci5pZF0gPSBzZWxlY3Rpb25WaWV3XG5cbiAgc2hyaW5rU2VsZWN0aW9uOiAtPlxuICAgIEBnZXRTZWxlY3Rpb25WaWV3KCkudGhlbiAoc2VsZWN0aW9uVmlldykgLT4gc2VsZWN0aW9uVmlldy5zaHJpbmsoKVxuXG4gIGV4cGFuZFNlbGVjdGlvbjogLT5cbiAgICBAZ2V0U2VsZWN0aW9uVmlldygpLnRoZW4gKHNlbGVjdGlvblZpZXcpIC0+IHNlbGVjdGlvblZpZXcuZXhwYW5kKClcblxuICByZW5hbWVWaWV3OiAobmFtZSwgY2FsbGJhY2spIC0+XG4gICAgUmVuYW1lVmlldyA/PSByZXF1aXJlICcuL3JlbmFtZS12aWV3J1xuICAgIG5ldyBSZW5hbWVWaWV3IHtuYW1lLCBjYWxsYmFja31cblxuICByZW5hbWVWYXJpYWJsZTogLT5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBtZXJsaW4ub2NjdXJyZW5jZXMgQGdldEJ1ZmZlcihlZGl0b3IpLCBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIC50aGVuIChyYW5nZXMpID0+XG4gICAgICBjdXJyZW50TmFtZSA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSByYW5nZXNbMF1cbiAgICAgIEByZW5hbWVWaWV3IGN1cnJlbnROYW1lLCAobmV3TmFtZSkgLT5cbiAgICAgICAgZWRpdG9yLnRyYW5zYWN0IC0+XG4gICAgICAgICAgcmFuZ2VzLnJldmVyc2UoKS5tYXAgKHJhbmdlKSAtPlxuICAgICAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlIHJhbmdlLCBuZXdOYW1lXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAbWVybGluLmNsb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBidWZmZXIuZGVzdHJveSgpIGZvciBfLCBidWZmZXIgb2YgQGJ1ZmZlcnNcblxuICBnZXRQcmVmaXg6IChlZGl0b3IsIHBvaW50KSAtPlxuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoW1twb2ludC5yb3csIDBdLCBwb2ludF0pXG4gICAgbGluZS5tYXRjaCgvW15cXHNcXFtcXF0oKXt9PD4sKypcXC8tXSokLylbMF1cblxuICBwcm92aWRlQXV0b2NvbXBsZXRlOiAtPlxuICAgIG1pbmltdW1Xb3JkTGVuZ3RoID0gMVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIFwiYXV0b2NvbXBsZXRlLXBsdXMubWluaW11bVdvcmRMZW5ndGhcIiwgKHZhbHVlKSAtPlxuICAgICAgbWluaW11bVdvcmRMZW5ndGggPSB2YWx1ZVxuICAgIGNvbXBsZXRlUGFydGlhbFByZWZpeGVzID0gZmFsc2VcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBcIm9jYW1sLW1lcmxpbi5jb21wbGV0ZVBhcnRpYWxQcmVmaXhlc1wiLCAodmFsdWUpIC0+XG4gICAgICBjb21wbGV0ZVBhcnRpYWxQcmVmaXhlcyA9IHZhbHVlXG4gICAga2luZFRvVHlwZSA9XG4gICAgICBcIlZhbHVlXCI6IFwidmFsdWVcIlxuICAgICAgXCJWYXJpYW50XCI6IFwidmFyaWFibGVcIlxuICAgICAgXCJDb25zdHJ1Y3RvclwiOiBcImNsYXNzXCJcbiAgICAgIFwiTGFiZWxcIjogXCJrZXl3b3JkXCJcbiAgICAgIFwiTW9kdWxlXCI6IFwibWV0aG9kXCJcbiAgICAgIFwiU2lnbmF0dXJlXCI6IFwidHlwZVwiXG4gICAgICBcIlR5cGVcIjogXCJ0eXBlXCJcbiAgICAgIFwiTWV0aG9kXCI6IFwicHJvcGVydHlcIlxuICAgICAgXCIjXCI6IFwiY29uc3RhbnRcIlxuICAgICAgXCJFeG5cIjogXCJrZXl3b3JkXCJcbiAgICAgIFwiQ2xhc3NcIjogXCJjbGFzc1wiXG4gICAgc2VsZWN0b3I6IHNlbGVjdG9ycy5qb2luICcsICdcbiAgICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBhY3RpdmF0ZWRNYW51YWxseX0pID0+XG4gICAgICBwcmVmaXggPSBAZ2V0UHJlZml4IGVkaXRvciwgYnVmZmVyUG9zaXRpb25cbiAgICAgIHJldHVybiBbXSBpZiBwcmVmaXgubGVuZ3RoIDwgKGlmIGFjdGl2YXRlZE1hbnVhbGx5IHRoZW4gMSBlbHNlIG1pbmltdW1Xb3JkTGVuZ3RoKVxuICAgICAgaWYgY29tcGxldGVQYXJ0aWFsUHJlZml4ZXNcbiAgICAgICAgcmVwbGFjZW1lbnQgPSBwcmVmaXhcbiAgICAgICAgcHJvbWlzZSA9IEBtZXJsaW4uZXhwYW5kIEBnZXRCdWZmZXIoZWRpdG9yKSwgYnVmZmVyUG9zaXRpb24sIHByZWZpeFxuICAgICAgZWxzZVxuICAgICAgICBpbmRleCA9IHByZWZpeC5sYXN0SW5kZXhPZiBcIi5cIlxuICAgICAgICByZXBsYWNlbWVudCA9IHByZWZpeC5zdWJzdHIoaW5kZXggKyAxKSBpZiBpbmRleCA+PSAwXG4gICAgICAgIHByb21pc2UgPSBAbWVybGluLmNvbXBsZXRlIEBnZXRCdWZmZXIoZWRpdG9yKSwgYnVmZmVyUG9zaXRpb24sIHByZWZpeFxuICAgICAgcHJvbWlzZS50aGVuIChlbnRyaWVzKSAtPlxuICAgICAgICBlbnRyaWVzLm1hcCAoe25hbWUsIGtpbmQsIGRlc2MsIGluZm99KSAtPlxuICAgICAgICAgIHRleHQ6IG5hbWVcbiAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcmVwbGFjZW1lbnRcbiAgICAgICAgICB0eXBlOiBraW5kVG9UeXBlW2tpbmRdXG4gICAgICAgICAgbGVmdExhYmVsOiBraW5kXG4gICAgICAgICAgcmlnaHRMYWJlbDogZGVzY1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBpZiBpbmZvLmxlbmd0aCB0aGVuIGluZm8gZWxzZSBkZXNjXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yOiAoc2VsZWN0b3JzLm1hcCAoc2VsZWN0b3IpIC0+IHNlbGVjdG9yICsgXCIgLmNvbW1lbnRcIikuam9pbiAnLCAnXG4gICAgaW5jbHVzaW9uUHJpb3JpdHk6IDFcblxuICBwcm92aWRlTGludGVyOiAtPlxuICAgIG5hbWU6ICdPQ2FtbCBNZXJsaW4nXG4gICAgc2NvcGU6ICdmaWxlJ1xuICAgIGxpbnRzT25DaGFuZ2U6IGF0b20uY29uZmlnLmdldCAnb2NhbWwtbWVybGluLmxpbnRBc1lvdVR5cGUnXG4gICAgZ3JhbW1hclNjb3Blczogc2NvcGVzXG4gICAgbGludDogKGVkaXRvcikgPT5cbiAgICAgIHJldHVybiBbXSB1bmxlc3MgYnVmZmVyID0gQGdldEJ1ZmZlcihlZGl0b3IpXG4gICAgICBAbWVybGluLmVycm9ycyBidWZmZXJcbiAgICAgIC50aGVuIChlcnJvcnMpIC0+XG4gICAgICAgIGVycm9ycy5tYXAgKHtyYW5nZSwgdHlwZSwgbWVzc2FnZX0pIC0+XG4gICAgICAgICAgbG9jYXRpb246XG4gICAgICAgICAgICBmaWxlOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgICBwb3NpdGlvbjogcmFuZ2VcbiAgICAgICAgICBleGNlcnB0OiBpZiBtZXNzYWdlLm1hdGNoICdcXG4nIHRoZW4gdHlwZVswXS50b1VwcGVyQ2FzZSgpICsgdHlwZVsxLi4tMV0gZWxzZSBtZXNzYWdlXG4gICAgICAgICAgc2V2ZXJpdHk6IGlmIHR5cGUgaXMgJ3dhcm5pbmcnIHRoZW4gJ3dhcm5pbmcnIGVsc2UgJ2Vycm9yJ1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBpZiBtZXNzYWdlLm1hdGNoICdcXG4nIHRoZW4gXCJgYGBcXG4je21lc3NhZ2V9YGBgXCIgZWxzZSBudWxsXG4gICAgICAgICAgc29sdXRpb25zOiBpZiBtID0gbWVzc2FnZS5tYXRjaCAvSGludDogRGlkIHlvdSBtZWFuICguKilcXD8vIHRoZW4gW1xuICAgICAgICAgICAgcG9zaXRpb246IHJhbmdlXG4gICAgICAgICAgICByZXBsYWNlV2l0aDogbVsxXVxuICAgICAgICAgIF0gZWxzZSBbXVxuXG4gIGNvbnN1bWVJbmRlbnQ6ICh7QGluZGVudFJhbmdlfSkgLT5cbiAgICBuZXcgRGlzcG9zYWJsZSA9PiBAaW5kZW50UmFuZ2UgPSBudWxsXG4iXX0=
