(function() {
  var File, SelectList, buildAstDumpArgs, getFirstScopes, getScopeLang, path, ref, ref1, spawnClang;

  File = require('atom').File;

  path = require('path');

  SelectList = require('atom-select-list');

  ref = require('./common-util'), getFirstScopes = ref.getFirstScopes, getScopeLang = ref.getScopeLang;

  ref1 = require('./clang-args-builder'), spawnClang = ref1.spawnClang, buildAstDumpArgs = ref1.buildAstDumpArgs;

  module.exports = {
    goDeclaration: function(editor, e) {
      var args, cwd, lang, term;
      lang = getScopeLang(getFirstScopes(editor));
      if (!lang) {
        e.abortKeyBinding();
        return;
      }
      editor.selectWordsContainingCursors();
      term = editor.getSelectedText();
      cwd = path.dirname(editor.getPath());
      args = buildAstDumpArgs(editor, lang, term);
      return spawnClang(cwd, args, editor.getText(), (function(_this) {
        return function(code, outputs, errors, resolve) {
          console.log("GoDecl err\n", errors);
          return resolve(_this.handleAstDumpResult(editor, {
            output: outputs,
            term: term
          }, code));
        };
      })(this));
    },
    handleAstDumpResult: function(editor, result, returnCode) {
      var declList, places;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      places = this.parseAstDump(result.output, result.term);
      if (places.length === 1) {
        return this.jumpToLocation(editor, places.pop());
      } else if (places.length > 1) {
        declList = this.createDeclList(editor, places);
        this.lastFocusedElement = document.activeElement;
        this.panel = atom.workspace.addModalPanel({
          item: declList
        });
        return declList.focus();
      }
    },
    createDeclList: function(editor, places) {
      return new SelectList({
        items: places,
        elementForItem: function(item) {
          var element, f;
          element = document.createElement('li');
          if (item[0] === '<stdin>') {
            element.innerHTML = item[1] + ":" + item[2];
          } else {
            f = path.join(item[0]);
            element.innerHTML(f + "  " + item[1] + ":" + item[2]);
          }
          return element;
        },
        filterKeyForItem: function(item) {
          return item.label;
        },
        didConfirmSelection: (function(_this) {
          return function(item) {
            _this.hideDeclList();
            return _this.jumpToLocation(editor, item);
          };
        })(this),
        didCancelSelection: (function(_this) {
          return function() {
            return _this.hideDeclList();
          };
        })(this)
      });
    },
    hideDeclList: function() {
      if (this.panel && this.panel.destroy) {
        this.panel.destroy();
      }
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        return this.lastFocusedElement = null;
      }
    },
    jumpToLocation: function(editor, arg) {
      var col, f, file, line;
      file = arg[0], line = arg[1], col = arg[2];
      if (file === '<stdin>') {
        return editor.setCursorBufferPosition([line - 1, col - 1]);
      }
      if (file.startsWith(".")) {
        file = path.join(editor.getDirectoryPath(), file);
      }
      f = new File(file);
      return f.exists().then(function(result) {
        if (result) {
          return atom.workspace.open(file, {
            initialLine: line - 1,
            initialColumn: col - 1
          });
        }
      });
    },
    parseAstDump: function(aststring, term) {
      var _, candidate, candidates, col, declRangeStr, declTerms, escapedTerm, file, i, len, line, lines, match, places, posStr, positions, ref2, ref3;
      candidates = aststring.split('\n\n');
      places = [];
      escapedTerm = term.match(/[A-Za-z_][A-Za-z0-9_]*/);
      if (escapedTerm === null) {
        return [];
      }
      for (i = 0, len = candidates.length; i < len; i++) {
        candidate = candidates[i];
        match = candidate.match(RegExp("^Dumping\\s(?:[A-Za-z_]*::)*?" + escapedTerm + ":"));
        if (match !== null) {
          lines = candidate.split('\n');
          if (lines.length < 2) {
            continue;
          }
          declTerms = lines[1].split(' ');
          _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          while (!declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/)) {
            if (declTerms.length < 5) {
              break;
            }
            declTerms = declTerms.slice(2);
            _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          }
          if (declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/)) {
            ref2 = declRangeStr.match(/<(.*):([0-9]+):([0-9]+),/), _ = ref2[0], file = ref2[1], line = ref2[2], col = ref2[3];
            positions = posStr.match(/(line|col):([0-9]+)(?::([0-9]+))?/);
            if (positions) {
              if (positions[1] === 'line') {
                ref3 = [positions[2], positions[3]], line = ref3[0], col = ref3[1];
              } else {
                col = positions[2];
              }
              places.push([file, Number(line), Number(col)]);
            }
          }
        }
      }
      return places;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9qdW1wZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSOztFQUNULElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxVQUFBLEdBQWEsT0FBQSxDQUFRLGtCQUFSOztFQUViLE1BQWlDLE9BQUEsQ0FBUSxlQUFSLENBQWpDLEVBQUMsbUNBQUQsRUFBaUI7O0VBQ2pCLE9BQWlDLE9BQUEsQ0FBUSxzQkFBUixDQUFqQyxFQUFDLDRCQUFELEVBQWE7O0VBR2IsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGFBQUEsRUFBZSxTQUFDLE1BQUQsRUFBUSxDQUFSO0FBQ2IsVUFBQTtNQUFBLElBQUEsR0FBTyxZQUFBLENBQWMsY0FBQSxDQUFlLE1BQWYsQ0FBZDtNQUNQLElBQUEsQ0FBTyxJQUFQO1FBQ0UsQ0FBQyxDQUFDLGVBQUYsQ0FBQTtBQUNBLGVBRkY7O01BR0EsTUFBTSxDQUFDLDRCQUFQLENBQUE7TUFDQSxJQUFBLEdBQU8sTUFBTSxDQUFDLGVBQVAsQ0FBQTtNQUNQLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBYjtNQUNOLElBQUEsR0FBTyxnQkFBQSxDQUFpQixNQUFqQixFQUF5QixJQUF6QixFQUErQixJQUEvQjthQUNQLFVBQUEsQ0FBVyxHQUFYLEVBQWdCLElBQWhCLEVBQXNCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBdEIsRUFBd0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE1BQWhCLEVBQXdCLE9BQXhCO1VBQ3RDLE9BQU8sQ0FBQyxHQUFSLENBQVksY0FBWixFQUE0QixNQUE1QjtpQkFDQSxPQUFBLENBQVEsS0FBQyxDQUFB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ZSxDQUEzQjtBQUFBLHFCQUFBOztVQUNBLFNBQUEsR0FBWSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVCxDQUFlLEdBQWY7VUFDWCxnQkFBRCxFQUFHLGdCQUFILEVBQUssMkJBQUwsRUFBa0IsZ0JBQWxCLEVBQW9CO0FBQ3BCLGlCQUFNLENBQUksWUFBWSxDQUFDLEtBQWIsQ0FBbUIsMEJBQW5CLENBQVY7WUFDRSxJQUFTLFNBQVMsQ0FBQyxNQUFWLEdBQW1CLENBQTVCO0FBQUEsb0JBQUE7O1lBQ0EsU0FBQSxHQUFZLFNBQVU7WUFDckIsZ0JBQUQsRUFBRyxnQkFBSCxFQUFLLDJCQUFMLEVBQWtCLGdCQUFsQixFQUFvQjtVQUh0QjtVQUlBLElBQUcsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsMEJBQW5CLENBQUg7WUFDRSxPQUFvQixZQUFZLENBQUMsS0FBYixDQUFtQiwwQkFBbkIsQ0FBcEIsRUFBQyxXQUFELEVBQUcsY0FBSCxFQUFRLGNBQVIsRUFBYTtZQUNiLFNBQUEsR0FBWSxNQUFNLENBQUMsS0FBUCxDQUFhLG1DQUFiO1lBQ1osSUFBRyxTQUFIO2NBQ0UsSUFBRyxTQUFVLENBQUEsQ0FBQSxDQUFWLEtBQWdCLE1BQW5CO2dCQUNFLE9BQWEsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFYLEVBQWUsU0FBVSxDQUFBLENBQUEsQ0FBekIsQ0FBYixFQUFDLGNBQUQsRUFBTSxjQURSO2VBQUEsTUFBQTtnQkFHRSxHQUFBLEdBQU0sU0FBVSxDQUFBLENBQUEsRUFIbEI7O2NBSUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFDLElBQUQsRUFBTyxNQUFBLENBQU8sSUFBUCxDQUFQLEVBQXFCLE1BQUEsQ0FBTyxHQUFQLENBQXJCLENBQVosRUFMRjthQUhGO1dBVEY7O0FBRkY7QUFvQkEsYUFBTztJQXpCSyxDQTFEZDs7QUFURiIsInNvdXJjZXNDb250ZW50IjpbIntGaWxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblNlbGVjdExpc3QgPSByZXF1aXJlICdhdG9tLXNlbGVjdC1saXN0J1xuXG57Z2V0Rmlyc3RTY29wZXMsIGdldFNjb3BlTGFuZ30gPSByZXF1aXJlICcuL2NvbW1vbi11dGlsJ1xue3NwYXduQ2xhbmcsIGJ1aWxkQXN0RHVtcEFyZ3N9ID0gcmVxdWlyZSAnLi9jbGFuZy1hcmdzLWJ1aWxkZXInXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICBnb0RlY2xhcmF0aW9uOiAoZWRpdG9yLGUpLT5cbiAgICBsYW5nID0gZ2V0U2NvcGVMYW5nIChnZXRGaXJzdFNjb3BlcyBlZGl0b3IpXG4gICAgdW5sZXNzIGxhbmdcbiAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgIHJldHVyblxuICAgIGVkaXRvci5zZWxlY3RXb3Jkc0NvbnRhaW5pbmdDdXJzb3JzKClcbiAgICB0ZXJtID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgY3dkID0gcGF0aC5kaXJuYW1lIGVkaXRvci5nZXRQYXRoKClcbiAgICBhcmdzID0gYnVpbGRBc3REdW1wQXJncyBlZGl0b3IsIGxhbmcsIHRlcm1cbiAgICBzcGF3bkNsYW5nIGN3ZCwgYXJncywgZWRpdG9yLmdldFRleHQoKSwgKGNvZGUsIG91dHB1dHMsIGVycm9ycywgcmVzb2x2ZSkgPT5cbiAgICAgIGNvbnNvbGUubG9nIFwiR29EZWNsIGVyclxcblwiLCBlcnJvcnNcbiAgICAgIHJlc29sdmUoQGhhbmRsZUFzdER1bXBSZXN1bHQgZWRpdG9yLCB7b3V0cHV0Om91dHB1dHMsIHRlcm06dGVybX0sIGNvZGUpXG5cbiAgaGFuZGxlQXN0RHVtcFJlc3VsdDogKGVkaXRvciwgcmVzdWx0LCByZXR1cm5Db2RlKS0+XG4gICAgaWYgcmV0dXJuQ29kZSBpcyBub3QgMFxuICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaWdub3JlQ2xhbmdFcnJvcnNcIlxuICAgIHBsYWNlcyA9IEBwYXJzZUFzdER1bXAgcmVzdWx0Lm91dHB1dCwgcmVzdWx0LnRlcm1cbiAgICBpZiBwbGFjZXMubGVuZ3RoIGlzIDFcbiAgICAgIEBqdW1wVG9Mb2NhdGlvbiBlZGl0b3IsIHBsYWNlcy5wb3AoKVxuICAgIGVsc2UgaWYgcGxhY2VzLmxlbmd0aCA+IDFcbiAgICAgIGRlY2xMaXN0ID0gQGNyZWF0ZURlY2xMaXN0IGVkaXRvciwgcGxhY2VzXG4gICAgICBAbGFzdEZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCBpdGVtOiBkZWNsTGlzdFxuICAgICAgZGVjbExpc3QuZm9jdXMoKVxuXG4gIGNyZWF0ZURlY2xMaXN0OiAoZWRpdG9yLCBwbGFjZXMpIC0+XG4gICAgbmV3IFNlbGVjdExpc3RcbiAgICAgIGl0ZW1zOiBwbGFjZXNcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgLT5cbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgaWYgaXRlbVswXSBpcyAnPHN0ZGluPidcbiAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IFwiI3tpdGVtWzFdfToje2l0ZW1bMl19XCJcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGYgPSBwYXRoLmpvaW4oaXRlbVswXSlcbiAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCBcIiN7Zn0gICN7aXRlbVsxXX06I3tpdGVtWzJdfVwiXG4gICAgICAgIGVsZW1lbnRcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IChpdGVtKSAtPiBpdGVtLmxhYmVsLFxuICAgICAgZGlkQ29uZmlybVNlbGVjdGlvbjogKGl0ZW0pID0+XG4gICAgICAgIEBoaWRlRGVjbExpc3QoKVxuICAgICAgICBAanVtcFRvTG9jYXRpb24gZWRpdG9yLCBpdGVtXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+XG4gICAgICAgIEBoaWRlRGVjbExpc3QoKVxuXG4gIGhpZGVEZWNsTGlzdDogKCktPlxuICAgIGlmIEBwYW5lbCBhbmQgQHBhbmVsLmRlc3Ryb3lcbiAgICAgIEBwYW5lbC5kZXN0cm95KClcbiAgICBpZiBAbGFzdEZvY3VzZWRFbGVtZW50XG4gICAgICBAbGFzdEZvY3VzZWRFbGVtZW50LmZvY3VzKClcbiAgICAgIEBsYXN0Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG5cbiAganVtcFRvTG9jYXRpb246IChlZGl0b3IsIFtmaWxlLGxpbmUsY29sXSkgLT5cbiAgICBpZiBmaWxlIGlzICc8c3RkaW4+J1xuICAgICAgcmV0dXJuIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbbGluZS0xLGNvbC0xXVxuICAgIGZpbGUgPSBwYXRoLmpvaW4gZWRpdG9yLmdldERpcmVjdG9yeVBhdGgoKSwgZmlsZSBpZiBmaWxlLnN0YXJ0c1dpdGgoXCIuXCIpXG4gICAgZiA9IG5ldyBGaWxlIGZpbGVcbiAgICBmLmV4aXN0cygpLnRoZW4gKHJlc3VsdCkgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZSwge2luaXRpYWxMaW5lOmxpbmUtMSwgaW5pdGlhbENvbHVtbjpjb2wtMX0gaWYgcmVzdWx0XG5cbiAgcGFyc2VBc3REdW1wOiAoYXN0c3RyaW5nLCB0ZXJtKS0+XG4gICAgY2FuZGlkYXRlcyA9IGFzdHN0cmluZy5zcGxpdCAnXFxuXFxuJ1xuICAgIHBsYWNlcyA9IFtdXG4gICAgZXNjYXBlZFRlcm0gPSB0ZXJtLm1hdGNoIC9bQS1aYS16X11bQS1aYS16MC05X10qL1xuICAgIHJldHVybiBbXSBpZiBlc2NhcGVkVGVybSBpcyBudWxsXG4gICAgZm9yIGNhbmRpZGF0ZSBpbiBjYW5kaWRhdGVzXG4gICAgICBtYXRjaCA9IGNhbmRpZGF0ZS5tYXRjaCAvLy9eRHVtcGluZ1xccyg/OltBLVphLXpfXSo6OikqPyN7ZXNjYXBlZFRlcm19Oi8vL1xuICAgICAgaWYgbWF0Y2ggaXNudCBudWxsXG4gICAgICAgIGxpbmVzID0gY2FuZGlkYXRlLnNwbGl0ICdcXG4nXG4gICAgICAgIGNvbnRpbnVlIGlmIGxpbmVzLmxlbmd0aCA8IDJcbiAgICAgICAgZGVjbFRlcm1zID0gbGluZXNbMV0uc3BsaXQgJyAnXG4gICAgICAgIFtfLF8sZGVjbFJhbmdlU3RyLF8scG9zU3RyLC4uLl0gPSBkZWNsVGVybXNcbiAgICAgICAgd2hpbGUgbm90IGRlY2xSYW5nZVN0ci5tYXRjaCAvPCguKik6KFswLTldKyk6KFswLTldKyksL1xuICAgICAgICAgIGJyZWFrIGlmIGRlY2xUZXJtcy5sZW5ndGggPCA1XG4gICAgICAgICAgZGVjbFRlcm1zID0gZGVjbFRlcm1zWzIuLl1cbiAgICAgICAgICBbXyxfLGRlY2xSYW5nZVN0cixfLHBvc1N0ciwuLi5dID0gZGVjbFRlcm1zXG4gICAgICAgIGlmIGRlY2xSYW5nZVN0ci5tYXRjaCAvPCguKik6KFswLTldKyk6KFswLTldKyksL1xuICAgICAgICAgIFtfLGZpbGUsbGluZSxjb2xdID0gZGVjbFJhbmdlU3RyLm1hdGNoIC88KC4qKTooWzAtOV0rKTooWzAtOV0rKSwvXG4gICAgICAgICAgcG9zaXRpb25zID0gcG9zU3RyLm1hdGNoIC8obGluZXxjb2wpOihbMC05XSspKD86OihbMC05XSspKT8vXG4gICAgICAgICAgaWYgcG9zaXRpb25zXG4gICAgICAgICAgICBpZiBwb3NpdGlvbnNbMV0gaXMgJ2xpbmUnXG4gICAgICAgICAgICAgIFtsaW5lLGNvbF0gPSBbcG9zaXRpb25zWzJdLCBwb3NpdGlvbnNbM11dXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGNvbCA9IHBvc2l0aW9uc1syXVxuICAgICAgICAgICAgcGxhY2VzLnB1c2ggW2ZpbGUsKE51bWJlciBsaW5lKSwoTnVtYmVyIGNvbCldXG4gICAgcmV0dXJuIHBsYWNlc1xuIl19
