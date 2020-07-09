Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
/** @babel */

var _atom = require('atom');

function getCellRanges(editor) {
  var ranges = [];
  var n = editor.getLineCount();
  var inCell = false;
  var startPosition = new _atom.Point(0, 0);

  var _loop = function (i) {
    var bufferPosition = new _atom.Point(i, 0);
    var scopeDescriptor = editor.syntaxTreeScopeDescriptorForBufferPosition(bufferPosition);
    var scopes = scopeDescriptor.scopes;
    var targetScopes = atom.config.get('markdown-cell-highlight.targetScopes');
    if (scopes.some(function (s) {
      return targetScopes.some(function (ts) {
        return s.startsWith(ts);
      });
    })) {
      if (!inCell) {
        startPosition = bufferPosition;
        inCell = true;
      }
    } else {
      if (inCell) {
        ranges.push(new _atom.Range(startPosition, bufferPosition));
        inCell = false;
      }
    }
  };

  for (var i = 0; i < n; i++) {
    _loop(i);
  }
  return ranges;
}

function decorateRanges(editor, ranges) {
  return ranges.map(function (range) {
    var marker = editor.markBufferRange(range);
    editor.decorateMarker(marker, {
      type: 'line-number',
      'class': 'markdown-cell-highlight'
    });
    editor.decorateMarker(marker, {
      type: 'line',
      'class': 'markdown-cell-highlight'
    });
    return marker;
  });
}

function decorateCells(editor) {
  var ranges = getCellRanges(editor);
  return decorateRanges(editor, ranges);
}

var editorStore = new WeakMap();

function observeEditor(editor) {
  if (!editor || editorStore.has(editor)) return;
  var markerSubscription = new _atom.CompositeDisposable();
  var markdownScopes = atom.config.get('markdown-cell-highlight.markdownScopes');
  if (editor.getGrammar && markdownScopes.includes(editor.getGrammar().id)) {
    (function () {
      // init
      // NOTE: have to wait for an editor to finish initial tokenizing
      var markers = [];
      setTimeout(function () {
        return markers = decorateCells(editor);
      }, 250);
      markerSubscription.add(editor.onDidStopChanging(function () {
        markers.forEach(function (marker) {
          return marker.destroy();
        });
        markers = decorateCells(editor);
      }),
      // clean up
      new _atom.Disposable(function () {
        return markers.forEach(function (marker) {
          return marker.destroy();
        });
      }));
    })();
  }
  markerSubscription.add(editor.onDidDestroy(function () {
    editorStore['delete'](editor);
    markerSubscription.dispose();
  }), editor.onDidChangeGrammar(function (grammar) {
    editorStore['delete'](editor);
    markerSubscription.dispose();
    observeEditor(editor);
  }));
  editorStore.set(editor, markerSubscription);
}

var subscriptions = null;

// atom package API

function activate() {
  subscriptions = new _atom.CompositeDisposable();
  subscriptions.add(atom.workspace.observeTextEditors(observeEditor));
}

function deactivate() {
  atom.workspace.getTextEditors().forEach(function (editor) {
    if (editorStore.has(editor)) {
      editorStore.get(editor).dispose();
      editorStore['delete'](editor);
    }
  });
  subscriptions.dispose();
  subscriptions = null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL21hcmtkb3duLWNlbGwtaGlnaGxpZ2h0L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztvQkFFOEQsTUFBTTs7QUFFcEUsU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0FBQzdCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQTtBQUNqQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDL0IsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLE1BQUksYUFBYSxHQUFHLGdCQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTs7d0JBQzFCLENBQUM7QUFDUixRQUFNLGNBQWMsR0FBRyxnQkFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDdEMsUUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLDBDQUEwQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3pGLFFBQU0sTUFBTSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUE7QUFDckMsUUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQTtBQUM1RSxRQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDO2FBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUU7ZUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztPQUFBLENBQUM7S0FBQSxDQUFDLEVBQUU7QUFDL0QsVUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLHFCQUFhLEdBQUcsY0FBYyxDQUFBO0FBQzlCLGNBQU0sR0FBRyxJQUFJLENBQUE7T0FDZDtLQUNGLE1BQU07QUFDTCxVQUFJLE1BQU0sRUFBRTtBQUNWLGNBQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQVUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUE7QUFDckQsY0FBTSxHQUFHLEtBQUssQ0FBQTtPQUNmO0tBQ0Y7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QUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0NBQ3BFOztBQUVNLFNBQVMsVUFBVSxHQUFHO0FBQzNCLE1BQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2hELFFBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUMzQixpQkFBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNqQyxpQkFBVyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDM0I7R0FDRixDQUFDLENBQUE7QUFDRixlQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkIsZUFBYSxHQUFHLElBQUksQ0FBQTtDQUNyQiIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1jZWxsLWhpZ2hsaWdodC9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgeyBQb2ludCwgUmFuZ2UsIENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5mdW5jdGlvbiBnZXRDZWxsUmFuZ2VzKGVkaXRvcikge1xuICBjb25zdCByYW5nZXMgPSBbXVxuICBjb25zdCBuID0gZWRpdG9yLmdldExpbmVDb3VudCgpXG4gIGxldCBpbkNlbGwgPSBmYWxzZVxuICBsZXQgc3RhcnRQb3NpdGlvbiA9IG5ldyBQb2ludCgwLCAwKVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgIGNvbnN0IGJ1ZmZlclBvc2l0aW9uID0gbmV3IFBvaW50KGksIDApXG4gICAgY29uc3Qgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnN5bnRheFRyZWVTY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcbiAgICBjb25zdCBzY29wZXMgPSBzY29wZURlc2NyaXB0b3Iuc2NvcGVzXG4gICAgY29uc3QgdGFyZ2V0U2NvcGVzID0gYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1jZWxsLWhpZ2hsaWdodC50YXJnZXRTY29wZXMnKVxuICAgIGlmIChzY29wZXMuc29tZShzID0+IHRhcmdldFNjb3Blcy5zb21lKHRzID0+IHMuc3RhcnRzV2l0aCh0cykpKSkge1xuICAgICAgaWYgKCFpbkNlbGwpIHtcbiAgICAgICAgc3RhcnRQb3NpdGlvbiA9IGJ1ZmZlclBvc2l0aW9uXG4gICAgICAgIGluQ2VsbCA9IHRydWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGluQ2VsbCkge1xuICAgICAgICByYW5nZXMucHVzaChuZXcgUmFuZ2Uoc3RhcnRQb3NpdGlvbiwgYnVmZmVyUG9zaXRpb24pKVxuICAgICAgICBpbkNlbGwgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmFuZ2VzXG59XG5cbmZ1bmN0aW9uIGRlY29yYXRlUmFuZ2VzKGVkaXRvciwgcmFuZ2VzKSB7XG4gIHJldHVybiByYW5nZXMubWFwKHJhbmdlID0+IHtcbiAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlKVxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgdHlwZTogJ2xpbmUtbnVtYmVyJyxcbiAgICAgICAgY2xhc3M6ICdtYXJrZG93bi1jZWxsLWhpZ2hsaWdodCdcbiAgICB9KVxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICBjbGFzczogJ21hcmtkb3duLWNlbGwtaGlnaGxpZ2h0J1xuICAgIH0pXG4gICAgcmV0dXJuIG1hcmtlclxuICB9KVxufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZUNlbGxzKGVkaXRvcikge1xuICBjb25zdCByYW5nZXMgPSBnZXRDZWxsUmFuZ2VzKGVkaXRvcilcbiAgcmV0dXJuIGRlY29yYXRlUmFuZ2VzKGVkaXRvciwgcmFuZ2VzKVxufVxuXG5jb25zdCBlZGl0b3JTdG9yZSA9IG5ldyBXZWFrTWFwKClcblxuZnVuY3Rpb24gb2JzZXJ2ZUVkaXRvcihlZGl0b3IpIHtcbiAgaWYgKCFlZGl0b3IgfHwgZWRpdG9yU3RvcmUuaGFzKGVkaXRvcikpIHJldHVyblxuICBjb25zdCBtYXJrZXJTdWJzY3JpcHRpb24gPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIGNvbnN0IG1hcmtkb3duU2NvcGVzID0gYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1jZWxsLWhpZ2hsaWdodC5tYXJrZG93blNjb3BlcycpXG4gIGlmIChlZGl0b3IuZ2V0R3JhbW1hciAmJiBtYXJrZG93blNjb3Blcy5pbmNsdWRlcyhlZGl0b3IuZ2V0R3JhbW1hcigpLmlkKSkge1xuICAgIC8vIGluaXRcbiAgICAvLyBOT1RFOiBoYXZlIHRvIHdhaXQgZm9yIGFuIGVkaXRvciB0byBmaW5pc2ggaW5pdGlhbCB0b2tlbml6aW5nXG4gICAgbGV0IG1hcmtlcnMgPSBbXVxuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFya2VycyA9IGRlY29yYXRlQ2VsbHMoZWRpdG9yKSwgMjUwKVxuICAgIG1hcmtlclN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICBlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4ge1xuICAgICAgICBtYXJrZXJzLmZvckVhY2gobWFya2VyID0+IG1hcmtlci5kZXN0cm95KCkpXG4gICAgICAgIG1hcmtlcnMgPSBkZWNvcmF0ZUNlbGxzKGVkaXRvcilcbiAgICAgIH0pLFxuICAgICAgLy8gY2xlYW4gdXBcbiAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IG1hcmtlcnMuZm9yRWFjaChtYXJrZXIgPT4gbWFya2VyLmRlc3Ryb3koKSkpXG4gICAgKVxuICB9XG4gIG1hcmtlclN1YnNjcmlwdGlvbi5hZGQoXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICBlZGl0b3JTdG9yZS5kZWxldGUoZWRpdG9yKVxuICAgICAgbWFya2VyU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIH0pLFxuICAgIGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoZ3JhbW1hciA9PiB7XG4gICAgICBlZGl0b3JTdG9yZS5kZWxldGUoZWRpdG9yKVxuICAgICAgbWFya2VyU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgb2JzZXJ2ZUVkaXRvcihlZGl0b3IpXG4gICAgfSlcbiAgKVxuICBlZGl0b3JTdG9yZS5zZXQoZWRpdG9yLCBtYXJrZXJTdWJzY3JpcHRpb24pXG59XG5cbmxldCBzdWJzY3JpcHRpb25zID0gbnVsbFxuXG4vLyBhdG9tIHBhY2thZ2UgQVBJXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhvYnNlcnZlRWRpdG9yKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XG4gIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaChlZGl0b3IgPT4ge1xuICAgIGlmIChlZGl0b3JTdG9yZS5oYXMoZWRpdG9yKSkge1xuICAgICAgZWRpdG9yU3RvcmUuZ2V0KGVkaXRvcikuZGlzcG9zZSgpXG4gICAgICBlZGl0b3JTdG9yZS5kZWxldGUoZWRpdG9yKVxuICAgIH1cbiAgfSlcbiAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgc3Vic2NyaXB0aW9ucyA9IG51bGxcbn1cbiJdfQ==