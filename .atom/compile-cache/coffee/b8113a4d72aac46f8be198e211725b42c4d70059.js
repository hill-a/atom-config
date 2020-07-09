(function() {
  var CompositeDisposable, Disposable, Range, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable, Range = ref.Range;

  module.exports = Object.assign(require('./utils'), {
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'cell-navigation:next-cell': (function(_this) {
          return function() {
            return _this.nextCell();
          };
        })(this),
        'cell-navigation:previous-cell': (function(_this) {
          return function() {
            return _this.previousCell();
          };
        })(this),
        'cell-navigation:select-cell': (function(_this) {
          return function() {
            return _this.selectCell();
          };
        })(this),
        'cell-navigation:select-up': (function(_this) {
          return function() {
            return _this.selectUp();
          };
        })(this),
        'cell-navigation:select-down': (function(_this) {
          return function() {
            return _this.selectDown();
          };
        })(this),
        'cell-navigation:move-cell-up': (function(_this) {
          return function() {
            return _this.moveCellUp();
          };
        })(this),
        'cell-navigation:move-cell-down': (function(_this) {
          return function() {
            return _this.moveCellDown();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    selectCell: function() {
      return this.reverseSelect(this.cellRange());
    },
    selectDown: function() {
      var currentRange, downRange;
      currentRange = this.cellRange();
      this.editor().setCursorBufferPosition(currentRange.end);
      downRange = this.cellRange();
      return this.editor().setSelectedBufferRange([currentRange.start, downRange.end]);
    },
    selectUp: function() {
      var currentRange, upRange, upRow;
      currentRange = this.cellRange();
      upRow = currentRange.start.row - 1;
      if (upRow < 0) {
        upRow = 0;
      }
      this.editor().setCursorBufferPosition([upRow, 0]);
      upRange = this.cellRange();
      return this.reverseSelect([upRange.start, currentRange.end]);
    },
    nextCell: function() {
      var bufferEnd, cellRows, range;
      bufferEnd = this.editor().buffer.getEndPosition();
      range = new Range(this.cursorRowEnd(), bufferEnd);
      cellRows = this.getCellRows(range, 'scanInBufferRange');
      if (cellRows.length === 0) {
        return;
      }
      if (cellRows[0] === bufferEnd.row) {
        return;
      }
      return this.editor().setCursorBufferPosition([cellRows[0] + 1, 0]);
    },
    previousCell: function() {
      var cellRows, range;
      range = new Range([0, 0], this.cursorRowEnd());
      cellRows = this.getCellRows(range, 'backwardsScanInBufferRange');
      if (cellRows.length === 0) {
        return;
      }
      if (cellRows.length === 1) {
        if (cellRows[0] === 0) {
          return;
        } else {
          return this.editor().setCursorBufferPosition([0, 0]);
        }
      }
      return this.editor().setCursorBufferPosition([cellRows[1] + 1, 0]);
    },
    moveCellUp: function() {
      var cellRange, editor, insertPos, range;
      editor = this.editor();
      cellRange = this.cellRange();
      if (cellRange.start.row === 0) {
        return this.reverseSelect(cellRange);
      }
      range = new Range([0, 0], cellRange.start);
      insertPos = [0, 0];
      editor.backwardsScanInBufferRange(this.regex, range, (function(_this) {
        return function(match) {
          insertPos = match.range.start;
          return match.stop();
        };
      })(this));
      return editor.transact((function(_this) {
        return function() {
          var insertRanges, txt;
          txt = editor.getTextInBufferRange(cellRange);
          if (!txt.endsWith('\n')) {
            txt += '\n';
          }
          editor.buffer["delete"](cellRange);
          if (insertPos[0] === 0 && editor.buffer.lineForRow(0).search(_this.regex) !== 0) {
            editor.buffer.insert(insertPos, '# %%\n');
          }
          editor.setCursorBufferPosition(insertPos);
          insertRanges = editor.insertText(txt);
          return _this.reverseSelect(insertRanges[0]);
        };
      })(this));
    },
    moveCellDown: function() {
      var bufferEnd, cellRange, editor, insertPos, range, searchStart;
      editor = this.editor();
      cellRange = this.cellRange();
      bufferEnd = editor.buffer.getEndPosition();
      if (cellRange.end.row === bufferEnd.row) {
        return this.reverseSelect(cellRange);
      }
      searchStart = editor.buffer.rangeForRow(cellRange.end.row).end;
      range = new Range(searchStart, bufferEnd);
      insertPos = bufferEnd;
      editor.scanInBufferRange(this.regex, range, (function(_this) {
        return function(match) {
          insertPos = match.range.start;
          return match.stop();
        };
      })(this));
      return editor.transact((function(_this) {
        return function() {
          var insertRanges, txt;
          txt = editor.getTextInBufferRange(cellRange);
          if (txt.search(_this.regex) !== 0) {
            txt = '# %%\n' + txt;
          }
          editor.setCursorBufferPosition(insertPos);
          if (bufferEnd.column !== 0) {
            editor.buffer.append('\n');
          }
          insertRanges = editor.insertText(txt);
          _this.reverseSelect(insertRanges[0]);
          return editor.buffer["delete"](cellRange);
        };
      })(this));
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvY2VsbC1uYXZpZ2F0aW9uL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBNkMsT0FBQSxDQUFRLE1BQVIsQ0FBN0MsRUFBRSw2Q0FBRixFQUF1QiwyQkFBdkIsRUFBbUM7O0VBRW5DLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQU0sQ0FBQyxNQUFQLENBQWMsT0FBQSxDQUFRLFNBQVIsQ0FBZCxFQUVmO0lBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7YUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7UUFBQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7UUFDQSwrQkFBQSxFQUFpQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEakM7UUFFQSw2QkFBQSxFQUErQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGL0I7UUFHQSwyQkFBQSxFQUE2QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxRQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIN0I7UUFJQSw2QkFBQSxFQUErQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMs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QUFLLENBQUM7aUJBQ3hCLEtBQUssQ0FBQyxJQUFOLENBQUE7UUFGc0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDO2FBR0EsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2QsY0FBQTtVQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsU0FBNUI7VUFDTixJQUF3QixHQUFHLENBQUMsTUFBSixDQUFXLEtBQUMsQ0FBQSxLQUFaLENBQUEsS0FBc0IsQ0FBOUM7WUFBQSxHQUFBLEdBQU0sUUFBQSxHQUFXLElBQWpCOztVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixTQUEvQjtVQUVBLElBQTZCLFNBQVMsQ0FBQyxNQUFWLEtBQW9CLENBQWpEO1lBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFkLENBQXFCLElBQXJCLEVBQUE7O1VBQ0EsWUFBQSxHQUFlLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1VBQ2YsS0FBQyxDQUFBLGFBQUQsQ0FBZSxZQUFhLENBQUEsQ0FBQSxDQUE1QjtpQkFDQSxNQUFNLENBQUMsTUFBTSxFQUFDLE1BQUQsRUFBYixDQUFxQixTQUFyQjtRQVJjO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtJQVpZLENBdkVkO0dBRmU7QUFGakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIFJhbmdlIH0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gcmVxdWlyZSgnLi91dGlscycpLFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2NlbGwtbmF2aWdhdGlvbjpuZXh0LWNlbGwnOiA9PiBAbmV4dENlbGwoKVxuICAgICAgJ2NlbGwtbmF2aWdhdGlvbjpwcmV2aW91cy1jZWxsJzogPT4gQHByZXZpb3VzQ2VsbCgpXG4gICAgICAnY2VsbC1uYXZpZ2F0aW9uOnNlbGVjdC1jZWxsJzogPT4gQHNlbGVjdENlbGwoKVxuICAgICAgJ2NlbGwtbmF2aWdhdGlvbjpzZWxlY3QtdXAnOiA9PiBAc2VsZWN0VXAoKVxuICAgICAgJ2NlbGwtbmF2aWdhdGlvbjpzZWxlY3QtZG93bic6ID0+IEBzZWxlY3REb3duKClcbiAgICAgICdjZWxsLW5hdmlnYXRpb246bW92ZS1jZWxsLXVwJzogPT4gQG1vdmVDZWxsVXAoKVxuICAgICAgJ2NlbGwtbmF2aWdhdGlvbjptb3ZlLWNlbGwtZG93bic6ID0+IEBtb3ZlQ2VsbERvd24oKVxuXG4gIGRlYWN0aXZhdGU6IC0+IEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gICMgY29tbWFuZHNcblxuICBzZWxlY3RDZWxsOiAtPiBAcmV2ZXJzZVNlbGVjdCBAY2VsbFJhbmdlKClcblxuICBzZWxlY3REb3duOiAtPlxuICAgIGN1cnJlbnRSYW5nZSA9IEBjZWxsUmFuZ2UoKVxuICAgIEBlZGl0b3IoKS5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihjdXJyZW50UmFuZ2UuZW5kKVxuICAgICMgQG5leHRDZWxsKClcbiAgICBkb3duUmFuZ2UgPSBAY2VsbFJhbmdlKClcbiAgICBAZWRpdG9yKCkuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSBbY3VycmVudFJhbmdlLnN0YXJ0LCBkb3duUmFuZ2UuZW5kXVxuXG4gIHNlbGVjdFVwOiAtPlxuICAgIGN1cnJlbnRSYW5nZSA9IEBjZWxsUmFuZ2UoKVxuICAgIHVwUm93ID0gY3VycmVudFJhbmdlLnN0YXJ0LnJvdyAtIDFcbiAgICB1cFJvdyA9IDAgaWYgdXBSb3cgPCAwXG4gICAgQGVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFt1cFJvdywgMF1cbiAgICB1cFJhbmdlID0gQGNlbGxSYW5nZSgpXG4gICAgQHJldmVyc2VTZWxlY3QgW3VwUmFuZ2Uuc3RhcnQsIGN1cnJlbnRSYW5nZS5lbmRdXG5cbiAgbmV4dENlbGw6IC0+XG4gICAgYnVmZmVyRW5kID0gQGVkaXRvcigpLmJ1ZmZlci5nZXRFbmRQb3NpdGlvbigpXG4gICAgcmFuZ2UgPSBuZXcgUmFuZ2UgQGN1cnNvclJvd0VuZCgpLCBidWZmZXJFbmRcbiAgICBjZWxsUm93cyA9IEBnZXRDZWxsUm93cyByYW5nZSwgJ3NjYW5JbkJ1ZmZlclJhbmdlJ1xuICAgIHJldHVybiBpZiBjZWxsUm93cy5sZW5ndGggPT0gMFxuICAgIHJldHVybiBpZiBjZWxsUm93c1swXSA9PSBidWZmZXJFbmQucm93XG4gICAgQGVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFtjZWxsUm93c1swXSArIDEsIDBdXG5cblxuICBwcmV2aW91c0NlbGw6IC0+XG4gICAgcmFuZ2UgPSBuZXcgUmFuZ2UgWzAsMF0sIEBjdXJzb3JSb3dFbmQoKVxuICAgIGNlbGxSb3dzID0gQGdldENlbGxSb3dzIHJhbmdlLCAnYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UnXG4gICAgcmV0dXJuIGlmIGNlbGxSb3dzLmxlbmd0aCA9PSAwXG4gICAgaWYgY2VsbFJvd3MubGVuZ3RoID09IDFcbiAgICAgIGlmIGNlbGxSb3dzWzBdID09IDAgdGhlbiByZXR1cm4gZWxzZVxuICAgICAgICByZXR1cm4gQGVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFswLDBdXG4gICAgQGVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFtjZWxsUm93c1sxXSArIDEsIDBdXG5cbiAgbW92ZUNlbGxVcDogLT5cbiAgICBlZGl0b3IgPSBAZWRpdG9yKClcbiAgICBjZWxsUmFuZ2UgPSBAY2VsbFJhbmdlKClcbiAgICByZXR1cm4gQHJldmVyc2VTZWxlY3QgY2VsbFJhbmdlIGlmIGNlbGxSYW5nZS5zdGFydC5yb3cgPT0gMFxuICAgIHJhbmdlID0gbmV3IFJhbmdlIFswLDBdLCBjZWxsUmFuZ2Uuc3RhcnRcbiAgICBpbnNlcnRQb3MgPSBbMCwwXVxuICAgIGVkaXRvci5iYWNrd2FyZHNTY2FuSW5CdWZmZXJSYW5nZSBAcmVnZXgsIHJhbmdlLCAobWF0Y2gpID0+XG4gICAgICBpbnNlcnRQb3MgPSBtYXRjaC5yYW5nZS5zdGFydFxuICAgICAgbWF0Y2guc3RvcCgpXG4gICAgZWRpdG9yLnRyYW5zYWN0ID0+XG4gICAgICB0eHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UgY2VsbFJhbmdlXG4gICAgICAjIGNlbGwgcmVxdWlyZWQgdG8gZW5kIHdpdGggbmV3bGluZVxuICAgICAgdHh0ICs9ICdcXG4nIHVubGVzcyB0eHQuZW5kc1dpdGggJ1xcbidcbiAgICAgIGVkaXRvci5idWZmZXIuZGVsZXRlIGNlbGxSYW5nZVxuICAgICAgIyBpbnNlcnQgY2VsbCBtYXJrIGlmIHRoZSB0b3AgY2VsbCBkb2Vzbid0IGhhdmUgb25lXG4gICAgICBpZiBpbnNlcnRQb3NbMF0gPT0gMCBhbmQgZWRpdG9yLmJ1ZmZlci5saW5lRm9yUm93KDApLnNlYXJjaChAcmVnZXgpICE9IDBcbiAgICAgICAgZWRpdG9yLmJ1ZmZlci5pbnNlcnQgaW5zZXJ0UG9zLCAnIyAlJVxcbidcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBpbnNlcnRQb3NcbiAgICAgIGluc2VydFJhbmdlcyA9IGVkaXRvci5pbnNlcnRUZXh0IHR4dFxuICAgICAgQHJldmVyc2VTZWxlY3QgaW5zZXJ0UmFuZ2VzWzBdXG5cbiAgbW92ZUNlbGxEb3duOiAtPlxuICAgIGVkaXRvciA9IEBlZGl0b3IoKVxuICAgIGNlbGxSYW5nZSA9IEBjZWxsUmFuZ2UoKVxuICAgIGJ1ZmZlckVuZCA9IGVkaXRvci5idWZmZXIuZ2V0RW5kUG9zaXRpb24oKVxuICAgIGlmIGNlbGxSYW5nZS5lbmQucm93ID09IGJ1ZmZlckVuZC5yb3dcbiAgICAgIHJldHVybiBAcmV2ZXJzZVNlbGVjdCBjZWxsUmFuZ2VcbiAgICBzZWFyY2hTdGFydCA9IGVkaXRvci5idWZmZXIucmFuZ2VGb3JSb3coY2VsbFJhbmdlLmVuZC5yb3cpLmVuZFxuICAgIHJhbmdlID0gbmV3IFJhbmdlIHNlYXJjaFN0YXJ0LCBidWZmZXJFbmRcbiAgICBpbnNlcnRQb3MgPSBidWZmZXJFbmRcbiAgICBlZGl0b3Iuc2NhbkluQnVmZmVyUmFuZ2UgQHJlZ2V4LCByYW5nZSwgKG1hdGNoKSA9PlxuICAgICAgaW5zZXJ0UG9zID0gbWF0Y2gucmFuZ2Uuc3RhcnRcbiAgICAgIG1hdGNoLnN0b3AoKVxuICAgIGVkaXRvci50cmFuc2FjdCA9PlxuICAgICAgdHh0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlIGNlbGxSYW5nZVxuICAgICAgdHh0ID0gJyMgJSVcXG4nICsgdHh0IGlmIHR4dC5zZWFyY2goQHJlZ2V4KSAhPSAwXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gaW5zZXJ0UG9zXG4gICAgICAjIGluc2VydCBuZXdsaW5lIGlmIGJ1ZmZlckVuZCBkb2Vucyd0IGhhdmUgaXRcbiAgICAgIGVkaXRvci5idWZmZXIuYXBwZW5kICdcXG4nIGlmIGJ1ZmZlckVuZC5jb2x1bW4gIT0gMFxuICAgICAgaW5zZXJ0UmFuZ2VzID0gZWRpdG9yLmluc2VydFRleHQgdHh0XG4gICAgICBAcmV2ZXJzZVNlbGVjdCBpbnNlcnRSYW5nZXNbMF1cbiAgICAgIGVkaXRvci5idWZmZXIuZGVsZXRlIGNlbGxSYW5nZVxuIl19
