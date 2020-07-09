(function() {
  var Range;

  Range = require('atom').Range;

  module.exports = {
    regex: /^# ?%%/gm,
    editor: function() {
      var ref;
      return (ref = this.testingEditor) != null ? ref : atom.workspace.getActiveTextEditor();
    },
    cursorRowEnd: function() {
      var currentRow;
      currentRow = this.editor().getCursorBufferPosition().row;
      return this.editor().buffer.rangeForRow(currentRow).end;
    },
    rowEnd: function(row) {
      return this.editor().buffer.rangeForRow(row).end;
    },
    cellRange: function() {
      var bufferEnd, editor, endPos, lowerCellPos, lowerRange, startRow, upperCellPos, upperRange;
      editor = this.editor();
      bufferEnd = editor.buffer.getEndPosition();
      startRow = editor.getSelectedBufferRange().start.row;
      upperRange = new Range([0, 0], this.rowEnd(startRow));
      endPos = editor.getSelectedBufferRange().end;
      if (startRow === endPos.row) {
        endPos = this.rowEnd(endPos.row);
      }
      lowerRange = new Range(endPos, bufferEnd);
      upperCellPos = [0, 0];
      lowerCellPos = bufferEnd;
      editor.backwardsScanInBufferRange(this.regex, upperRange, (function(_this) {
        return function(match) {
          upperCellPos = match.range.start;
          return match.stop();
        };
      })(this));
      editor.scanInBufferRange(this.regex, lowerRange, (function(_this) {
        return function(match) {
          lowerCellPos = match.range.start;
          return match.stop();
        };
      })(this));
      return new Range(upperCellPos, lowerCellPos);
    },
    getCellRows: function(range, funcName) {
      var cellRows, maxRow;
      cellRows = [];
      maxRow = {
        'scanInBufferRange': 0,
        'backwardsScanInBufferRange': 1
      };
      this.editor()[funcName](this.regex, range, (function(_this) {
        return function(match) {
          cellRows.push(match.range.start.row);
          if (cellRows.length > maxRow[funcName]) {
            return match.stop();
          }
        };
      })(this));
      return cellRows;
    },
    reverseSelect: function(range) {
      return this.editor().setSelectedBufferRange(range, {
        reversed: true
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvY2VsbC1uYXZpZ2F0aW9uL2xpYi91dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFFLFFBQVUsT0FBQSxDQUFRLE1BQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBTyxVQUFQO0lBRUEsTUFBQSxFQUFRLFNBQUE7QUFBRyxVQUFBO3dEQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFBcEIsQ0FGUjtJQUlBLFlBQUEsRUFBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyx1QkFBVixDQUFBLENBQW1DLENBQUM7YUFDakQsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsTUFBTSxDQUFDLFdBQWpCLENBQTZCLFVBQTdCLENBQXdDLENBQUM7SUFGN0IsQ0FKZDtJQVNBLE1BQUEsRUFBUSxTQUFDLEdBQUQ7YUFBUyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQVMsQ0FBQyxNQUFNLENBQUMsV0FBakIsQ0FBNkIsR0FBN0IsQ0FBaUMsQ0FBQztJQUEzQyxDQVRSO0lBV0EsU0FBQSxFQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDVCxTQUFBLEdBQVksTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFkLENBQUE7TUFFWixRQUFBLEdBQVcsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBK0IsQ0FBQyxLQUFLLENBQUM7TUFDakQsVUFBQSxHQUFhLElBQUksS0FBSixDQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBVixFQUFpQixJQUFDLENBQUEsTUFBRCxDQUFRLFFBQVIsQ0FBakI7TUFFYixNQUFBLEdBQVMsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBK0IsQ0FBQztNQUN6QyxJQUFnQyxRQUFBLEtBQVksTUFBTSxDQUFDLEdBQW5EO1FBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFELENBQVEsTUFBTSxDQUFDLEdBQWYsRUFBVDs7TUFDQSxVQUFBLEdBQWEsSUFBSSxLQUFKLENBQVUsTUFBVixFQUFrQixTQUFsQjtNQUViLFlBQUEsR0FBZSxDQUFDLENBQUQsRUFBRyxDQUFIO01BQ2YsWUFBQSxHQUFlO01BQ2YsTUFBTSxDQUFDLDBCQUFQLENBQWtDLElBQUMsQ0FBQSxLQUFuQyxFQUEwQyxVQUExQyxFQUFzRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtVQUNwRCxZQUFBLEdBQWUsS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDM0IsS0FBSyxDQUFDLElBQU4sQ0FBQTtRQUZvRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQ7TUFHQSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsSUFBQyxDQUFBLEtBQTFCLEVBQWlDLFVBQWpDLEVBQTZDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO1VBQzNDLFlBQUEsR0FBZSxLQUFLLENBQUMsS0FBSyxDQUFDO2lCQUMzQixLQUFLLENBQUMsSUFBTixDQUFBO1FBRjJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QzthQUdBLElBQUksS0FBSixDQUFVLFlBQVYsRUFBd0IsWUFBeEI7SUFuQlMsQ0FYWDtJQWdDQSxXQUFBLEVBQWEsU0FBQyxLQUFELEVBQVEsUUFBUjtBQUNYLFVBQUE7TUFBQSxRQUFBLEdBQVc7TUFDWCxNQUFBLEdBQ0U7UUFBQSxtQkFBQSxFQUFxQixDQUFyQjtRQUNBLDRCQUFBLEVBQThCLENBRDlCOztNQUVGLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBVSxDQUFBLFFBQUEsQ0FBVixDQUFvQixJQUFDLENBQUEsS0FBckIsRUFBNEIsS0FBNUIsRUFBbUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDakMsUUFBUSxDQUFDLElBQVQsQ0FBYyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFoQztVQUNBLElBQWdCLFFBQVEsQ0FBQyxNQUFULEdBQWtCLE1BQU8sQ0FBQSxRQUFBLENBQXpDO21CQUFBLEtBQUssQ0FBQyxJQUFOLENBQUEsRUFBQTs7UUFGaUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO2FBR0E7SUFSVyxDQWhDYjtJQTBDQSxhQUFBLEVBQWUsU0FBQyxLQUFEO2FBQ2IsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFTLENBQUMsc0JBQVYsQ0FBaUMsS0FBakMsRUFBd0M7UUFBQSxRQUFBLEVBQVUsSUFBVjtPQUF4QztJQURhLENBMUNmOztBQUhGIiwic291cmNlc0NvbnRlbnQiOlsieyBSYW5nZSB9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICByZWdleDogL14jID8lJS9nbVxuXG4gIGVkaXRvcjogLT4gQHRlc3RpbmdFZGl0b3IgPyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICBjdXJzb3JSb3dFbmQ6IC0+XG4gICAgY3VycmVudFJvdyA9IEBlZGl0b3IoKS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvd1xuICAgIEBlZGl0b3IoKS5idWZmZXIucmFuZ2VGb3JSb3coY3VycmVudFJvdykuZW5kXG5cblxuICByb3dFbmQ6IChyb3cpIC0+IEBlZGl0b3IoKS5idWZmZXIucmFuZ2VGb3JSb3cocm93KS5lbmRcblxuICBjZWxsUmFuZ2U6IC0+XG4gICAgZWRpdG9yID0gQGVkaXRvcigpXG4gICAgYnVmZmVyRW5kID0gZWRpdG9yLmJ1ZmZlci5nZXRFbmRQb3NpdGlvbigpXG5cbiAgICBzdGFydFJvdyA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCkuc3RhcnQucm93XG4gICAgdXBwZXJSYW5nZSA9IG5ldyBSYW5nZSBbMCwwXSwgQHJvd0VuZChzdGFydFJvdylcblxuICAgIGVuZFBvcyA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCkuZW5kXG4gICAgZW5kUG9zID0gQHJvd0VuZChlbmRQb3Mucm93KSBpZiBzdGFydFJvdyA9PSBlbmRQb3Mucm93XG4gICAgbG93ZXJSYW5nZSA9IG5ldyBSYW5nZSBlbmRQb3MsIGJ1ZmZlckVuZFxuXG4gICAgdXBwZXJDZWxsUG9zID0gWzAsMF1cbiAgICBsb3dlckNlbGxQb3MgPSBidWZmZXJFbmRcbiAgICBlZGl0b3IuYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2UgQHJlZ2V4LCB1cHBlclJhbmdlLCAobWF0Y2gpID0+XG4gICAgICB1cHBlckNlbGxQb3MgPSBtYXRjaC5yYW5nZS5zdGFydFxuICAgICAgbWF0Y2guc3RvcCgpXG4gICAgZWRpdG9yLnNjYW5JbkJ1ZmZlclJhbmdlIEByZWdleCwgbG93ZXJSYW5nZSwgKG1hdGNoKSA9PlxuICAgICAgbG93ZXJDZWxsUG9zID0gbWF0Y2gucmFuZ2Uuc3RhcnRcbiAgICAgIG1hdGNoLnN0b3AoKVxuICAgIG5ldyBSYW5nZSB1cHBlckNlbGxQb3MsIGxvd2VyQ2VsbFBvc1xuXG4gIGdldENlbGxSb3dzOiAocmFuZ2UsIGZ1bmNOYW1lKSAtPlxuICAgIGNlbGxSb3dzID0gW11cbiAgICBtYXhSb3cgPVxuICAgICAgJ3NjYW5JbkJ1ZmZlclJhbmdlJzogMFxuICAgICAgJ2JhY2t3YXJkc1NjYW5JbkJ1ZmZlclJhbmdlJzogMVxuICAgIEBlZGl0b3IoKVtmdW5jTmFtZV0gQHJlZ2V4LCByYW5nZSwgKG1hdGNoKSA9PlxuICAgICAgY2VsbFJvd3MucHVzaCBtYXRjaC5yYW5nZS5zdGFydC5yb3dcbiAgICAgIG1hdGNoLnN0b3AoKSBpZiBjZWxsUm93cy5sZW5ndGggPiBtYXhSb3dbZnVuY05hbWVdXG4gICAgY2VsbFJvd3NcblxuICByZXZlcnNlU2VsZWN0OiAocmFuZ2UpIC0+XG4gICAgQGVkaXRvcigpLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UgcmFuZ2UsIHJldmVyc2VkOiB0cnVlXG4iXX0=
