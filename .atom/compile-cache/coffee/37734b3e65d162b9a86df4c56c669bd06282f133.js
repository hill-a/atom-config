(function() {
  var $, BufferedProcess, CompositeDisposable, GitRevisionView, _, fs, path, ref, str,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  path = require('path');

  fs = require('fs');

  str = require('bumble-strings');

  ref = require("atom"), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  $ = require("atom-space-pen-views").$;

  module.exports = GitRevisionView = (function() {
    function GitRevisionView() {
      this._onDidDestroyTimeMachineEditor = bind(this._onDidDestroyTimeMachineEditor, this);
    }

    GitRevisionView.prototype.FILE_PREFIX = "Time Machine - ";

    GitRevisionView.isActivating = function() {
      return this._isActivating;
    };

    GitRevisionView.loadExistingRevForEditor = function(editor) {
      if (editor.__gitTimeMachine == null) {
        return;
      }
      return _.defer((function(_this) {
        return function() {
          var ref1;
          if (!editor.isDestroyed()) {
            return (ref1 = editor.__gitTimeMachine) != null ? ref1.activateTimeMachineEditorForEditor(editor) : void 0;
          }
        };
      })(this));
    };

    GitRevisionView.showRevision = function(sourceEditor, leftRevHash, rightRevHash, onClose) {
      if (sourceEditor.__gitTimeMachine) {
        return sourceEditor.__gitTimeMachine.showRevision(sourceEditor.__gitTimeMachine.sourceEditor, leftRevHash, rightRevHash);
      } else {
        return new GitRevisionView().showRevision(sourceEditor, leftRevHash, rightRevHash, onClose);
      }
    };

    GitRevisionView.prototype.leftRevEditor = null;

    GitRevisionView.prototype.rightRevEditor = null;

    GitRevisionView.prototype.sourceEditor = null;

    GitRevisionView.prototype.activateTimeMachineEditorForEditor = function(editor) {
      var ref1, rightEditor;
      if (editor !== this.leftRevEditor && editor !== this.rightRevEditor && editor !== this.sourceEditor) {
        return;
      }
      GitRevisionView._isActivating = true;
      if (editor === this.leftRevEditor) {
        rightEditor = (ref1 = this.rightRevEditor) != null ? ref1 : this.sourceEditor;
        this.findEditorPane(rightEditor)[0].activateItem(rightEditor);
      } else {
        this.findEditorPane(this.leftRevEditor)[0].activateItem(this.leftRevEditor);
      }
      this.splitDiff(this.leftRevEditor, this.rightRevEditor);
      return GitRevisionView._isActivating = false;
    };

    GitRevisionView.prototype.showRevision = function(sourceEditor1, leftRevHash, rightRevHash, onClose1) {
      var file, promises, revHash;
      this.sourceEditor = sourceEditor1;
      this.onClose = onClose1;
      if (!((leftRevHash != null) || (rightRevHash != null))) {
        return;
      }
      file = this.sourceEditor.getPath();
      promises = (function() {
        var i, len, ref1, results;
        ref1 = [leftRevHash, rightRevHash];
        results = [];
        for (i = 0, len = ref1.length; i < len; i++) {
          revHash = ref1[i];
          results.push(this._loadRevision(file, revHash));
        }
        return results;
      }).call(this);
      Promise.all(promises).then((function(_this) {
        return function(revisions) {
          _this.revisions = revisions;
          return _this._showRevisions(revisions);
        };
      })(this));
      this.sourceEditor.onDidDestroy((function(_this) {
        return function() {
          return _this._onDidDestroyTimeMachineEditor(_this.sourceEditor);
        };
      })(this));
      this.sourceEditor.__gitTimeMachine = this;
      return this;
    };

    GitRevisionView.prototype.findEditorPane = function(editor) {
      var i, item, j, len, len1, pane, paneIndex, ref1, ref2;
      ref1 = atom.workspace.getPanes();
      for (paneIndex = i = 0, len = ref1.length; i < len; paneIndex = ++i) {
        pane = ref1[paneIndex];
        ref2 = pane.getItems();
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          item = ref2[j];
          if (item === editor) {
            return [pane, paneIndex];
          }
        }
      }
      return [null, null];
    };

    GitRevisionView.prototype._loadRevision = function(file, hash) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var exit, fileContents, showArgs, stderr, stdout;
          if (hash == null) {
            resolve(null);
            return;
          }
          fileContents = "";
          stdout = function(output) {
            return fileContents += output;
          };
          stderr = function(output) {
            return console.error("Error loading revision of file", output);
          };
          exit = function(code) {
            if (code === 0) {
              return resolve({
                revHash: hash,
                fileContents: fileContents
              });
            } else {
              atom.notifications.addError("Could not retrieve revision for " + (path.basename(file)) + " (" + code + ")");
              return reject(code);
            }
          };
          showArgs = ["show", hash + ":./" + (path.basename(file))];
          return new BufferedProcess({
            command: "git",
            args: showArgs,
            options: {
              cwd: path.dirname(file)
            },
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
        };
      })(this));
    };

    GitRevisionView.prototype._showRevisions = function(revisions) {
      var index, promises, revision;
      GitRevisionView._isActivating = true;
      promises = (function() {
        var i, len, results;
        results = [];
        for (index = i = 0, len = revisions.length; i < len; index = ++i) {
          revision = revisions[index];
          results.push(this._showRevision(revision, index === 0));
        }
        return results;
      }).call(this);
      return Promise.all(promises).then((function(_this) {
        return function(editors) {
          _this.leftRevEditor = editors[0], _this.rightRevEditor = editors[1];
          if (_this.rightRevEditor == null) {
            _this.rightRevEditor = _this.sourceEditor;
          }
          _this.splitDiff(_this.leftRevEditor, _this.rightRevEditor);
          return GitRevisionView._isActivating = false;
        };
      })(this));
    };

    GitRevisionView.prototype._showRevision = function(revision, isLeftRev) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var fileContents, promise, revHash;
          if (revision != null) {
            revHash = revision.revHash, fileContents = revision.fileContents;
          } else {
            revHash = fileContents = null;
          }
          promise = atom.workspace.open(_this.sourceEditor.getPath(), {
            activatePane: false,
            activateItem: false,
            searchAllPanes: true
          });
          return promise.then(function(sourceEditor) {
            if (_this.sourceEditor == null) {
              _this.sourceEditor = sourceEditor;
            }
            if (revHash == null) {
              if (!isLeftRev) {
                if ((_this.rightRevEditor != null) && _this.rightRevEditor !== _this.sourceEditor) {
                  atom.workspace.open(_this.sourceEditor.getPath(), {
                    activatePane: true,
                    activateItem: true,
                    searchAllPanes: true
                  }).then(function() {
                    _this.rightRevEditor = _this.sourceEditor;
                    return resolve(_this.sourceEditor);
                  });
                } else {
                  resolve(_this.sourceEditor);
                }
              }
              return;
            }
            promise = _this._createEditorForRevision(revision, fileContents, isLeftRev);
            return promise.then(function(newEditor) {
              return resolve(newEditor);
            });
          });
        };
      })(this));
    };

    GitRevisionView.prototype._createEditorForRevision = function(revision, fileContents, isLeftRev) {
      var file;
      file = this.sourceEditor.getPath();
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var leftPane, outputFilePath, paneIndex, promise, ref1, sourceEditorPane;
          outputFilePath = _this._getOutputFilePath(file, revision, isLeftRev);
          ref1 = _this.findEditorPane(_this.sourceEditor), sourceEditorPane = ref1[0], paneIndex = ref1[1];
          if (isLeftRev) {
            if (paneIndex <= 0) {
              sourceEditorPane.splitLeft();
              leftPane = atom.workspace.getPanes()[0];
              if (leftPane !== atom.workspace.getActivePane()) {
                leftPane.activate();
              }
            } else {
              leftPane = atom.workspace.getPanes()[paneIndex - 1];
              leftPane.activate();
            }
          } else {
            sourceEditorPane.activate();
          }
          promise = atom.workspace.open(outputFilePath, {
            activateItem: true,
            searchAllPanes: false
          });
          return promise.then(function(newTextEditor) {
            _this._updateEditor(newTextEditor, revision.revHash, fileContents, isLeftRev);
            if (revision.sourceEditor == null) {
              revision.sourceEditor = newTextEditor;
            }
            _.defer(function() {
              return sourceEditorPane.activate();
            });
            return resolve(newTextEditor);
          });
        };
      })(this));
    };

    GitRevisionView.prototype._getOutputFilePath = function(file, revision, isLeftRev) {
      var leftOrRight, outputDir, outputPath;
      outputDir = (atom.getConfigDirPath()) + "/git-time-machine";
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      leftOrRight = isLeftRev ? 'lrev' : 'rrev';
      outputPath = outputDir + "/" + this.FILE_PREFIX + revision.revHash + " - " + (path.basename(file));
      outputPath = outputDir + "/" + leftOrRight + "/" + this.FILE_PREFIX + (path.basename(file));
      return outputPath;
    };

    GitRevisionView.prototype._updateEditor = function(newTextEditor, revHash, fileContents, isLeftRev) {
      var lineEnding, ref1;
      lineEnding = ((ref1 = this.sourceEditor.buffer) != null ? ref1.lineEndingForRow(0) : void 0) || "\n";
      if ((revHash != null) && (fileContents != null)) {
        fileContents = fileContents != null ? fileContents.replace(/(\r\n|\n)/g, lineEnding) : void 0;
        newTextEditor.buffer.setPreferredLineEnding(lineEnding);
        newTextEditor.buffer.cachedDiskContents = fileContents;
        newTextEditor.setText(fileContents);
      }
      newTextEditor.onDidDestroy((function(_this) {
        return function() {
          return _this._onDidDestroyTimeMachineEditor(newTextEditor);
        };
      })(this));
      if (isLeftRev) {
        this.leftRevEditor = newTextEditor;
        if (this.rightRevEditor == null) {
          this.rightRevEditor = this.sourceEditor;
        }
      } else {
        this.rightRevEditor = newTextEditor;
      }
      return newTextEditor.__gitTimeMachine = this.sourceEditor.__gitTimeMachine = this;
    };

    GitRevisionView.prototype._onDidDestroyTimeMachineEditor = function(editor) {
      var filePath, gitRevView, leftEditor, regex, rightEditor, sourceEditor;
      gitRevView = editor.__gitTimeMachine;
      if (gitRevView == null) {
        return;
      }
      leftEditor = gitRevView.leftRevEditor;
      rightEditor = gitRevView.rightRevEditor;
      sourceEditor = gitRevView.sourceEditor;
      if (editor === leftEditor || editor === rightEditor) {
        if (editor !== sourceEditor) {
          filePath = editor.getPath();
          regex = new RegExp("\/git-time-machine\/.*" + this.FILE_PREFIX);
          if (filePath.match(regex)) {
            fs.unlink(filePath);
          } else {
            console.warn("cowardly refusing to delete non gtm temp file: " + filePath);
          }
        }
      }
      delete gitRevView.sourceEditor.__gitTimeMachine;
      delete gitRevView.leftRevEditor.__gitTimeMachine;
      delete gitRevView.rightRevEditor.__gitTimeMachine;
      delete editor.__gitTimeMachine;
      if (editor === leftEditor) {
        if (rightEditor !== sourceEditor) {
          rightEditor.destroy();
        }
      } else {
        leftEditor.destroy();
      }
      return _.defer((function(_this) {
        return function() {
          return typeof _this.onClose === "function" ? _this.onClose() : void 0;
        };
      })(this));
    };

    GitRevisionView.prototype.splitDiff = function(leftEditor, rightEditor) {
      var ref1;
      return (ref1 = this.constructor.SplitDiffService) != null ? ref1.diffEditors(leftEditor, rightEditor, {
        addedColorSide: 'right'
      }) : void 0;
    };

    return GitRevisionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXJldmlzaW9uLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrRUFBQTtJQUFBOztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSOztFQUdOLE1BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3JCLElBQUssT0FBQSxDQUFRLHNCQUFSOztFQUdOLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs4QkFFckIsV0FBQSxHQUFhOztJQUdiLGVBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQTtBQUNiLGFBQU8sSUFBQyxDQUFBO0lBREs7O0lBSWYsZUFBQyxDQUFBLHdCQUFELEdBQTJCLFNBQUMsTUFBRDtNQUN6QixJQUFjLCtCQUFkO0FBQUEsZUFBQTs7YUFDQSxDQUFDLENBQUMsS0FBRixDQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNOLGNBQUE7VUFBQSxJQUFBLENBQU8sTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUFQO2tFQUN5QixDQUFFLGtDQUF6QixDQUE0RCxNQUE1RCxXQURGOztRQURNO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBRnlCOztJQU8zQixlQUFDLENBQUEsWUFBRCxHQUFlLFNBQUMsWUFBRCxFQUFlLFdBQWYsRUFBNEIsWUFBNUIsRUFBMEMsT0FBMUM7TUFDYixJQUFHLFlBQVksQ0FBQyxnQkFBaEI7ZUFDRSxZQUFZLENBQUMsZ0JBQWdCLENBQUMsWUFBOUIsQ0FBMkMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLFlBQXpFLEVBQ0Us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ID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMnXG5zdHIgPSByZXF1aXJlKCdidW1ibGUtc3RyaW5ncycpXG5cblxue0NvbXBvc2l0ZURpc3Bvc2FibGUsIEJ1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlIFwiYXRvbVwiXG57JH0gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxuXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2l0UmV2aXNpb25WaWV3XG5cbiAgRklMRV9QUkVGSVg6IFwiVGltZSBNYWNoaW5lIC0gXCJcbiAgXG4gICMgdGhpcyBpcyB0cnVlIHdoZW4gd2UgYXJlIGNyZWF0aW5nIHBhbmVzIGFuZCBlZGl0b3JzIGZvciBhIHJldmlzaW9uLiBcbiAgQGlzQWN0aXZhdGluZzogLT4gXG4gICAgcmV0dXJuIEBfaXNBY3RpdmF0aW5nXG5cbiAgICBcbiAgQGxvYWRFeGlzdGluZ1JldkZvckVkaXRvcjogKGVkaXRvcikgLT5cbiAgICByZXR1cm4gdW5sZXNzIGVkaXRvci5fX2dpdFRpbWVNYWNoaW5lP1xuICAgIF8uZGVmZXIgPT5cbiAgICAgIHVubGVzcyBlZGl0b3IuaXNEZXN0cm95ZWQoKVxuICAgICAgICBlZGl0b3IuX19naXRUaW1lTWFjaGluZT8uYWN0aXZhdGVUaW1lTWFjaGluZUVkaXRvckZvckVkaXRvcihlZGl0b3IpIFxuXG5cbiAgQHNob3dSZXZpc2lvbjogKHNvdXJjZUVkaXRvciwgbGVmdFJldkhhc2gsIHJpZ2h0UmV2SGFzaCwgb25DbG9zZSkgLT4gXG4gICAgaWYgc291cmNlRWRpdG9yLl9fZ2l0VGltZU1hY2hpbmVcbiAgICAgIHNvdXJjZUVkaXRvci5fX2dpdFRpbWVNYWNoaW5lLnNob3dSZXZpc2lvbihzb3VyY2VFZGl0b3IuX19naXRUaW1lTWFjaGluZS5zb3VyY2VFZGl0b3IsIFxuICAgICAgICBsZWZ0UmV2SGFzaCwgcmlnaHRSZXZIYXNoKVxuICAgIGVsc2VcbiAgICAgIG5ldyBHaXRSZXZpc2lvblZpZXcoKS5zaG93UmV2aXNpb24oc291cmNlRWRpdG9yLCBsZWZ0UmV2SGFzaCwgcmlnaHRSZXZIYXNoLCBvbkNsb3NlKVxuICAgICAgXG5cbiAgbGVmdFJldkVkaXRvcjogbnVsbFxuICByaWdodFJldkVkaXRvcjogbnVsbFxuICBzb3VyY2VFZGl0b3I6IG51bGxcbiAgXG4gIGFjdGl2YXRlVGltZU1hY2hpbmVFZGl0b3JGb3JFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3IgaW4gW0BsZWZ0UmV2RWRpdG9yLCBAcmlnaHRSZXZFZGl0b3IsIEBzb3VyY2VFZGl0b3JdXG4gICAgXG4gICAgR2l0UmV2aXNpb25WaWV3Ll9pc0FjdGl2YXRpbmcgPSB0cnVlXG4gICAgaWYgZWRpdG9yID09IEBsZWZ0UmV2RWRpdG9yXG4gICAgICByaWdodEVkaXRvciA9IEByaWdodFJldkVkaXRvciA/IEBzb3VyY2VFZGl0b3JcbiAgICAgIEBmaW5kRWRpdG9yUGFuZShyaWdodEVkaXRvcilbMF0uYWN0aXZhdGVJdGVtKHJpZ2h0RWRpdG9yKVxuICAgIGVsc2VcbiAgICAgIEBmaW5kRWRpdG9yUGFuZShAbGVmdFJldkVkaXRvcilbMF0uYWN0aXZhdGVJdGVtKEBsZWZ0UmV2RWRpdG9yKVxuICAgIFxuICAgIEBzcGxpdERpZmYoQGxlZnRSZXZFZGl0b3IsIEByaWdodFJldkVkaXRvcilcbiAgICBHaXRSZXZpc2lvblZpZXcuX2lzQWN0aXZhdGluZyA9IGZhbHNlXG4gICAgICBcblxuICBcbiAgc2hvd1JldmlzaW9uOiAoQHNvdXJjZUVkaXRvciwgbGVmdFJldkhhc2gsIHJpZ2h0UmV2SGFzaCwgQG9uQ2xvc2UpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBsZWZ0UmV2SGFzaD8gfHwgcmlnaHRSZXZIYXNoP1xuICAgIGZpbGUgPSBAc291cmNlRWRpdG9yLmdldFBhdGgoKVxuICAgIFxuICAgIHByb21pc2VzID0gZm9yIHJldkhhc2ggaW4gW2xlZnRSZXZIYXNoLCByaWdodFJldkhhc2hdXG4gICAgICBAX2xvYWRSZXZpc2lvbiBmaWxlLCByZXZIYXNoXG4gICAgICBcbiAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbiAocmV2aXNpb25zKT0+XG4gICAgICBAcmV2aXNpb25zID0gcmV2aXNpb25zXG4gICAgICBAX3Nob3dSZXZpc2lvbnMgcmV2aXNpb25zXG4gICAgICBcbiAgICBAc291cmNlRWRpdG9yLm9uRGlkRGVzdHJveSA9PiBAX29uRGlkRGVzdHJveVRpbWVNYWNoaW5lRWRpdG9yKEBzb3VyY2VFZGl0b3IpXG4gICAgQHNvdXJjZUVkaXRvci5fX2dpdFRpbWVNYWNoaW5lID0gQFxuICAgICAgXG4gICAgcmV0dXJuIEBcblxuXG4gICMgcmV0dXJucyB0aGUgcGFuZSBhbmQgaXQncyBpbmRleCAobGVmdCB0byByaWdodCkgaW4gd29ya3NwYWNlLmdldFBhbmVzKClcbiAgZmluZEVkaXRvclBhbmU6IChlZGl0b3IpIC0+XG4gICAgZm9yIHBhbmUsIHBhbmVJbmRleCBpbiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpXG4gICAgICBmb3IgaXRlbSBpbiBwYW5lLmdldEl0ZW1zKClcbiAgICAgICAgcmV0dXJuIFtwYW5lLCBwYW5lSW5kZXhdIGlmIGl0ZW0gPT0gZWRpdG9yXG4gICAgXG4gICAgcmV0dXJuIFtudWxsLCBudWxsXVxuXG4gIFxuICBfbG9hZFJldmlzaW9uOiAoZmlsZSwgaGFzaCkgLT5cbiAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHVubGVzcyBoYXNoP1xuICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgIHJldHVyblxuICAgICAgICAgXG4gICAgICBmaWxlQ29udGVudHMgPSBcIlwiXG4gICAgICBzdGRvdXQgPSAob3V0cHV0KSAtPlxuICAgICAgICBmaWxlQ29udGVudHMgKz0gb3V0cHV0XG4gICAgICBzdGRlcnIgPSAob3V0cHV0KSAtPlxuICAgICAgICBjb25zb2xlLmVycm9yIFwiRXJyb3IgbG9hZGluZyByZXZpc2lvbiBvZiBmaWxlXCIsIG91dHB1dFxuICAgICAgZXhpdCA9IChjb2RlKSA9PlxuICAgICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgICByZXNvbHZlIFxuICAgICAgICAgICAgcmV2SGFzaDogaGFzaFxuICAgICAgICAgICAgZmlsZUNvbnRlbnRzOiBmaWxlQ29udGVudHNcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkNvdWxkIG5vdCByZXRyaWV2ZSByZXZpc2lvbiBmb3IgI3twYXRoLmJhc2VuYW1lKGZpbGUpfSAoI3tjb2RlfSlcIlxuICAgICAgICAgIHJlamVjdChjb2RlKVxuXG4gICAgICBzaG93QXJncyA9IFtcbiAgICAgICAgXCJzaG93XCIsXG4gICAgICAgIFwiI3toYXNofTouLyN7cGF0aC5iYXNlbmFtZShmaWxlKX1cIlxuICAgICAgXVxuICAgICAgIyBjb25zb2xlLmxvZyBcImNhbGxpbmcgZ2l0XCJcbiAgICAgIG5ldyBCdWZmZXJlZFByb2Nlc3Mge1xuICAgICAgICBjb21tYW5kOiBcImdpdFwiLFxuICAgICAgICBhcmdzOiBzaG93QXJncyxcbiAgICAgICAgb3B0aW9uczogeyBjd2Q6cGF0aC5kaXJuYW1lKGZpbGUpIH0sXG4gICAgICAgIHN0ZG91dDogc3Rkb3V0LFxuICAgICAgICBzdGRlcnI6IHN0ZGVycixcbiAgICAgICAgZXhpdFxuICAgICAgfVxuXG5cbiAgIyByZXZpc2lvbnMgYXJlIHRoZSBwcm9taXNlIHJlc29sdmUgZnJvbSBAX2xvYWRSZXZpc2lvbigpXG4gIF9zaG93UmV2aXNpb25zOiAocmV2aXNpb25zKSAtPlxuICAgIEdpdFJldmlzaW9uVmlldy5faXNBY3RpdmF0aW5nID0gdHJ1ZVxuICAgIHByb21pc2VzID0gZm9yIHJldmlzaW9uLCBpbmRleCBpbiByZXZpc2lvbnNcbiAgICAgIEBfc2hvd1JldmlzaW9uKHJldmlzaW9uLCBpbmRleCA9PSAwKSBcbiAgXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4gKGVkaXRvcnMpID0+XG4gICAgICBbQGxlZnRSZXZFZGl0b3IsIEByaWdodFJldkVkaXRvcl0gPSBlZGl0b3JzXG4gICAgICBAcmlnaHRSZXZFZGl0b3IgPz0gQHNvdXJjZUVkaXRvclxuICAgICAgXG4gICAgICBAc3BsaXREaWZmKEBsZWZ0UmV2RWRpdG9yLCBAcmlnaHRSZXZFZGl0b3IpXG4gICAgICBHaXRSZXZpc2lvblZpZXcuX2lzQWN0aXZhdGluZyA9IGZhbHNlXG5cblxuICBcbiAgX3Nob3dSZXZpc2lvbjogKHJldmlzaW9uLCBpc0xlZnRSZXYpIC0+XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBpZiByZXZpc2lvbj9cbiAgICAgICAge3Jldkhhc2gsIGZpbGVDb250ZW50c30gPSByZXZpc2lvblxuICAgICAgZWxzZVxuICAgICAgICByZXZIYXNoID0gZmlsZUNvbnRlbnRzID0gbnVsbCAgICAjIHNob3cgY3VycmVudCByZXZpc2lvblxuICAgICAgXG4gICAgICAjIGVkaXRvciAoY3VycmVudCByZXYpIG1heSBoYXZlIGJlZW4gZGVzdHJveWVkLCB3b3Jrc3BhY2Uub3BlbiB3aWxsIGZpbmQgb3JcbiAgICAgICMgcmVvcGVuIGl0XG4gICAgICBwcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uub3BlbiBAc291cmNlRWRpdG9yLmdldFBhdGgoKSxcbiAgICAgICAgYWN0aXZhdGVQYW5lOiBmYWxzZVxuICAgICAgICBhY3RpdmF0ZUl0ZW06IGZhbHNlXG4gICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG4gICAgICAgIFxuICAgICAgcHJvbWlzZS50aGVuIChzb3VyY2VFZGl0b3IpID0+XG4gICAgICAgIEBzb3VyY2VFZGl0b3IgPz0gc291cmNlRWRpdG9yXG4gICAgICAgIFxuICAgICAgICB1bmxlc3MgcmV2SGFzaD9cbiAgICAgICAgICB1bmxlc3MgaXNMZWZ0UmV2XG4gICAgICAgICAgICBpZiBAcmlnaHRSZXZFZGl0b3I/ICYmIEByaWdodFJldkVkaXRvciAhPSBAc291cmNlRWRpdG9yXG4gICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oQHNvdXJjZUVkaXRvci5nZXRQYXRoKCksXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVQYW5lOiB0cnVlXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVJdGVtOiB0cnVlXG4gICAgICAgICAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICApLnRoZW4gPT5cbiAgICAgICAgICAgICAgICBAcmlnaHRSZXZFZGl0b3IgPSBAc291cmNlRWRpdG9yXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShAc291cmNlRWRpdG9yKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICByZXNvbHZlKEBzb3VyY2VFZGl0b3IpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBwcm9taXNlID0gQF9jcmVhdGVFZGl0b3JGb3JSZXZpc2lvbihyZXZpc2lvbiwgZmlsZUNvbnRlbnRzLCBpc0xlZnRSZXYpXG4gICAgICAgIHByb21pc2UudGhlbiAobmV3RWRpdG9yKSA9PiBcbiAgICAgICAgICByZXNvbHZlKG5ld0VkaXRvcilcbiAgICAgICAgXG4gICAgICAgIFxuICBfY3JlYXRlRWRpdG9yRm9yUmV2aXNpb246IChyZXZpc2lvbiwgZmlsZUNvbnRlbnRzLCBpc0xlZnRSZXYpIC0+XG4gICAgZmlsZSA9IEBzb3VyY2VFZGl0b3IuZ2V0UGF0aCgpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBvdXRwdXRGaWxlUGF0aCA9IEBfZ2V0T3V0cHV0RmlsZVBhdGgoZmlsZSwgcmV2aXNpb24sIGlzTGVmdFJldilcbiAgICAgIFxuICAgICAgIyBzb3VyY2VFZGl0b3IgaGVyZSBzaG91bGQgYWx3YXlzIGJlIHRoZSBvcmlnaW5hbCBzb3VyY2UgZG9jIGVkaXRvciAoY3VycmVudCByZXYpXG4gICAgICBbc291cmNlRWRpdG9yUGFuZSwgcGFuZUluZGV4XSA9IEBmaW5kRWRpdG9yUGFuZShAc291cmNlRWRpdG9yKVxuICAgICAgaWYgaXNMZWZ0UmV2IFxuICAgICAgICBpZiBwYW5lSW5kZXggPD0gMFxuICAgICAgICAgIHNvdXJjZUVkaXRvclBhbmUuc3BsaXRMZWZ0KClcbiAgICAgICAgICBsZWZ0UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClbMF1cbiAgICAgICAgICBsZWZ0UGFuZS5hY3RpdmF0ZSgpIHVubGVzcyBsZWZ0UGFuZSA9PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgZWxzZSBcbiAgICAgICAgICBsZWZ0UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClbcGFuZUluZGV4IC0gMV1cbiAgICAgICAgICBsZWZ0UGFuZS5hY3RpdmF0ZSgpXG4gICAgICBlbHNlXG4gICAgICAgIHNvdXJjZUVkaXRvclBhbmUuYWN0aXZhdGUoKVxuICAgICAgICBcbiAgICAgIHByb21pc2UgPSBhdG9tLndvcmtzcGFjZS5vcGVuIG91dHB1dEZpbGVQYXRoLFxuICAgICAgICBhY3RpdmF0ZUl0ZW06IHRydWVcbiAgICAgICAgc2VhcmNoQWxsUGFuZXM6IGZhbHNlXG4gICAgICAgIFxuICAgICAgcHJvbWlzZS50aGVuIChuZXdUZXh0RWRpdG9yKSA9PlxuICAgICAgICBAX3VwZGF0ZUVkaXRvcihuZXdUZXh0RWRpdG9yLCByZXZpc2lvbi5yZXZIYXNoLCBmaWxlQ29udGVudHMsIGlzTGVmdFJldilcbiAgICAgICAgcmV2aXNpb24uc291cmNlRWRpdG9yID89IG5ld1RleHRFZGl0b3JcbiAgICAgICAgXy5kZWZlciA9PiBzb3VyY2VFZGl0b3JQYW5lLmFjdGl2YXRlKClcbiAgICAgICAgcmVzb2x2ZShuZXdUZXh0RWRpdG9yKVxuICAgICAgICBcbiAgICAgICAgXG4gIF9nZXRPdXRwdXRGaWxlUGF0aDogKGZpbGUsIHJldmlzaW9uLCBpc0xlZnRSZXYpLT5cbiAgICBvdXRwdXREaXIgPSBcIiN7YXRvbS5nZXRDb25maWdEaXJQYXRoKCl9L2dpdC10aW1lLW1hY2hpbmVcIlxuICAgIGZzLm1rZGlyU3luYyBvdXRwdXREaXIgaWYgbm90IGZzLmV4aXN0c1N5bmMgb3V0cHV0RGlyXG4gICAgbGVmdE9yUmlnaHQgPSBpZiBpc0xlZnRSZXYgdGhlbiAnbHJldicgZWxzZSAncnJldidcblxuICAgIG91dHB1dFBhdGggPSBcIiN7b3V0cHV0RGlyfS8je0BGSUxFX1BSRUZJWH0je3JldmlzaW9uLnJldkhhc2h9IC0gI3twYXRoLmJhc2VuYW1lKGZpbGUpfVwiXG4gICAgb3V0cHV0UGF0aCA9IFwiI3tvdXRwdXREaXJ9LyN7bGVmdE9yUmlnaHR9LyN7QEZJTEVfUFJFRklYfSN7cGF0aC5iYXNlbmFtZShmaWxlKX1cIlxuICAgIFxuICAgIHJldHVybiBvdXRwdXRQYXRoXG4gICAgXG4gIFxuICBfdXBkYXRlRWRpdG9yOiAobmV3VGV4dEVkaXRvciwgcmV2SGFzaCwgZmlsZUNvbnRlbnRzLCBpc0xlZnRSZXYpIC0+XG4gICAgbGluZUVuZGluZyA9IEBzb3VyY2VFZGl0b3IuYnVmZmVyPy5saW5lRW5kaW5nRm9yUm93KDApIHx8IFwiXFxuXCJcbiAgICAjIHJldkhhc2ggPT0gbnVsbCA9IHdlIGFyZSB1cGRhdGluZyB0aGUgY3VycmVudCBzb3VyY2Ugc291cmNlRWRpdG9yIChjdXJlbnQgcmV2KVxuICAgIGlmIHJldkhhc2g/ICYmIGZpbGVDb250ZW50cz9cbiAgICAgIGZpbGVDb250ZW50cyA9IGZpbGVDb250ZW50cz8ucmVwbGFjZSgvKFxcclxcbnxcXG4pL2csIGxpbmVFbmRpbmcpXG4gICAgICBuZXdUZXh0RWRpdG9yLmJ1ZmZlci5zZXRQcmVmZXJyZWRMaW5lRW5kaW5nKGxpbmVFbmRpbmcpXG4gICAgICAjIEhBQ0sgQUxFUlQ6IHRoaXMgaXMgcHJvbmUgdG8gZXZlbnR1YWxseSBmYWlsLiBEb24ndCBzaG93IHVzZXIgY2hhbmdlXG4gICAgICAjICBcIndvdWxkIHlvdSBsaWtlIHRvIHNhdmVcIiBtZXNzYWdlIGJldHdlZW4gY2hhbmdlcyB0byByZXYgYmVpbmcgdmlld2VkXG4gICAgICBuZXdUZXh0RWRpdG9yLmJ1ZmZlci5jYWNoZWREaXNrQ29udGVudHMgPSBmaWxlQ29udGVudHNcbiAgICAgIG5ld1RleHRFZGl0b3Iuc2V0VGV4dChmaWxlQ29udGVudHMpXG5cbiAgICBuZXdUZXh0RWRpdG9yLm9uRGlkRGVzdHJveSA9PiBAX29uRGlkRGVzdHJveVRpbWVNYWNoaW5lRWRpdG9yKG5ld1RleHRFZGl0b3IpIFxuXG4gICAgaWYgaXNMZWZ0UmV2XG4gICAgICBAbGVmdFJldkVkaXRvciA9IG5ld1RleHRFZGl0b3JcbiAgICAgIEByaWdodFJldkVkaXRvciA/PSBAc291cmNlRWRpdG9yXG4gICAgZWxzZVxuICAgICAgQHJpZ2h0UmV2RWRpdG9yID0gbmV3VGV4dEVkaXRvclxuICAgICAgXG4gICAgbmV3VGV4dEVkaXRvci5fX2dpdFRpbWVNYWNoaW5lID0gQHNvdXJjZUVkaXRvci5fX2dpdFRpbWVNYWNoaW5lID0gQFxuICAgIFxuICAgIFxuICBfb25EaWREZXN0cm95VGltZU1hY2hpbmVFZGl0b3I6IChlZGl0b3IpID0+XG4gICAgZ2l0UmV2VmlldyA9IGVkaXRvci5fX2dpdFRpbWVNYWNoaW5lXG4gICAgcmV0dXJuIHVubGVzcyBnaXRSZXZWaWV3P1xuICAgIFxuICAgIGxlZnRFZGl0b3IgPSBnaXRSZXZWaWV3LmxlZnRSZXZFZGl0b3JcbiAgICByaWdodEVkaXRvciA9IGdpdFJldlZpZXcucmlnaHRSZXZFZGl0b3JcbiAgICBzb3VyY2VFZGl0b3IgPSBnaXRSZXZWaWV3LnNvdXJjZUVkaXRvclxuICAgIFxuICAgIGlmIGVkaXRvciBpbiBbbGVmdEVkaXRvciwgcmlnaHRFZGl0b3JdXG4gICAgICBpZiBlZGl0b3IgIT0gc291cmNlRWRpdG9yIFxuICAgICAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwIFwiXFwvZ2l0LXRpbWUtbWFjaGluZVxcLy4qI3tARklMRV9QUkVGSVh9XCJcbiAgICAgICAgaWYgZmlsZVBhdGgubWF0Y2ggcmVnZXhcbiAgICAgICAgICBmcy51bmxpbmsoZmlsZVBhdGgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjb25zb2xlLndhcm4gXCJjb3dhcmRseSByZWZ1c2luZyB0byBkZWxldGUgbm9uIGd0bSB0ZW1wIGZpbGU6ICN7ZmlsZVBhdGh9XCJcblxuICAgIGRlbGV0ZSBnaXRSZXZWaWV3LnNvdXJjZUVkaXRvci5fX2dpdFRpbWVNYWNoaW5lXG4gICAgZGVsZXRlIGdpdFJldlZpZXcubGVmdFJldkVkaXRvci5fX2dpdFRpbWVNYWNoaW5lXG4gICAgZGVsZXRlIGdpdFJldlZpZXcucmlnaHRSZXZFZGl0b3IuX19naXRUaW1lTWFjaGluZVxuICAgIGRlbGV0ZSBlZGl0b3IuX19naXRUaW1lTWFjaGluZVxuICAgIFxuICAgIGlmIGVkaXRvciA9PSBsZWZ0RWRpdG9yXG4gICAgICB1bmxlc3MgcmlnaHRFZGl0b3IgPT0gc291cmNlRWRpdG9yXG4gICAgICAgIHJpZ2h0RWRpdG9yLmRlc3Ryb3koKVxuICAgIGVsc2VcbiAgICAgIGxlZnRFZGl0b3IuZGVzdHJveSgpXG4gICAgXG4gICAgXy5kZWZlciA9PiBAb25DbG9zZT8oKSAgIyBkZWZlciB0byBhbGxvdyBzZXRFZGl0b3IgdG8gY2FsbCB0aHJvdWdoXG4gICAgXG5cbiAgIyBzdGFydGluZyBpbiBndG0gMi4wOyBsZWZ0RWRpdG9yID0gb3JkZXIgdmVyc2lvbiwgcmlnaHRFZGl0b3IgPSBuZXcgdmVyc2lvblxuICBzcGxpdERpZmY6IChsZWZ0RWRpdG9yLCByaWdodEVkaXRvcikgLT5cbiAgICBAY29uc3RydWN0b3IuU3BsaXREaWZmU2VydmljZT8uZGlmZkVkaXRvcnMobGVmdEVkaXRvciwgcmlnaHRFZGl0b3IsIGFkZGVkQ29sb3JTaWRlOiAncmlnaHQnKVxuICAgIFxuXG5cbiAgICBcbiAgICBcbiJdfQ==
