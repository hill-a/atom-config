Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

exports.createResult = createResult;
exports.clearResult = clearResult;
exports.clearResults = clearResults;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _componentsResultView = require("./components/result-view");

var _componentsResultView2 = _interopRequireDefault(_componentsResultView);

var _panesOutputArea = require("./panes/output-area");

var _panesOutputArea2 = _interopRequireDefault(_panesOutputArea);

var _panesWatches = require("./panes/watches");

var _panesWatches2 = _interopRequireDefault(_panesWatches);

var _utils = require("./utils");

/**
 * Creates and renders a ResultView.
 *
 * @param {Object} store - Global Hydrogen Store
 * @param {atom$TextEditor} store.editor - TextEditor associated with the result.
 * @param {Kernel} store.kernel - Kernel to run code and associate with the result.
 * @param {MarkerStore} store.markers - MarkerStore that belongs to `store.editor`.
 * @param {Object} codeBlock - A Hydrogen Cell.
 * @param {String} codeBlock.code - Source string of the cell.
 * @param {Number} codeBlock.row - Row to display the result on.
 * @param {HydrogenCellType} codeBlock.cellType - Cell type of the cell.
 */

function createResult(_ref, _ref2) {
  var editor = _ref.editor;
  var kernel = _ref.kernel;
  var markers = _ref.markers;
  var code = _ref2.code;
  var row = _ref2.row;
  var cellType = _ref2.cellType;
  return (function () {
    if (!editor || !kernel || !markers) return;

    if (atom.workspace.getActivePaneItem() instanceof _panesWatches2["default"]) {
      kernel.watchesStore.run();
      return;
    }
    var globalOutputStore = atom.config.get("Hydrogen.outputAreaDefault") || atom.workspace.getPaneItems().find(function (item) {
      return item instanceof _panesOutputArea2["default"];
    }) ? kernel.outputStore : null;

    if (globalOutputStore) (0, _utils.openOrShowDock)(_utils.OUTPUT_AREA_URI);

    var _ref3 = new _componentsResultView2["default"](markers, kernel, editor, row, !globalOutputStore || cellType == "markdown");

    var outputStore = _ref3.outputStore;

    if (code.search(/[\S]/) != -1) {
      switch (cellType) {
        case "markdown":
          outputStore.appendOutput({
            output_type: "display_data",
            data: {
              "text/markdown": code
            },
            metadata: {}
          });
          outputStore.appendOutput({ data: "ok", stream: "status" });
          break;
        case "codecell":
          kernel.execute(code, function (result) {
            outputStore.appendOutput(result);
            if (globalOutputStore) globalOutputStore.appendOutput(result);
          });
          break;
      }
    } else {
      outputStore.appendOutput({ data: "ok", stream: "status" });
    }
  })();
}

/**
 * Clears a ResultView or selection of ResultViews.
 * To select a result to clear, put your cursor on the row on the ResultView.
 * To select multiple ResultViews, select text starting on the row of
 * the first ResultView to remove all the way to text on the row of the
 * last ResultView to remove. *This must be one selection and
 * the last selection made*
 *
 * @param {Object} store - Global Hydrogen Store
 * @param {atom$TextEditor} store.editor - TextEditor associated with the ResultView.
 * @param {MarkerStore} store.markers - MarkerStore that belongs to `store.editor` and the ResultView.
 */

function clearResult(_ref4) {
  var editor = _ref4.editor;
  var markers = _ref4.markers;
  return (function () {
    if (!editor || !markers) return;

    var _editor$getLastSelection$getBufferRowRange = editor.getLastSelection().getBufferRowRange();

    var _editor$getLastSelection$getBufferRowRange2 = _slicedToArray(_editor$getLastSelection$getBufferRowRange, 2);

    var startRow = _editor$getLastSelection$getBufferRowRange2[0];
    var endRow = _editor$getLastSelection$getBufferRowRange2[1];

    for (var row = startRow; row <= endRow; row++) {
      markers.clearOnRow(row);
    }
  })();
}

/**
 * Clears all ResultViews of a MarkerStore.
 * It also clears the currect kernel results.
 *
 * @param {Object} store - Global Hydrogen Store
 * @param {Kernel} store.kernel - Kernel to clear outputs.
 * @param {MarkerStore} store.markers - MarkerStore to clear.
 */

function clearResults(_ref5) {
  var kernel = _ref5.kernel;
  var markers = _ref5.markers;
  return (function () {
    if (markers) markers.clear();
    if (!kernel) return;
    kernel.outputStore.clear();
  })();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9yZXN1bHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29DQUN1QiwwQkFBMEI7Ozs7K0JBQzFCLHFCQUFxQjs7Ozs0QkFDcEIsaUJBQWlCOzs7O3FCQUNPLFNBQVM7Ozs7Ozs7Ozs7Ozs7OztBQWdCbEQsU0FBUyxZQUFZLENBQzFCLElBUUUsRUFDRixLQUk0RDtNQVoxRCxNQUFNLEdBRFIsSUFRRSxDQVBBLE1BQU07TUFDTixNQUFNLEdBRlIsSUFRRSxDQU5BLE1BQU07TUFDTixPQUFPLEdBSFQsSUFRRSxDQUxBLE9BQU87TUFPUCxJQUFJLEdBRE4sS0FJNEQsQ0FIMUQsSUFBSTtNQUNKLEdBQUcsR0FGTCxLQUk0RCxDQUYxRCxHQUFHO01BQ0gsUUFBUSxHQUhWLEtBSTRELENBRDFELFFBQVE7c0JBRVY7QUFDQSxRQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU87O0FBRTNDLFFBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxxQ0FBdUIsRUFBRTtBQUM3RCxZQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLGFBQU87S0FDUjtBQUNELFFBQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLElBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTthQUFJLElBQUksd0NBQXNCO0tBQUEsQ0FBQyxHQUNsRSxNQUFNLENBQUMsV0FBVyxHQUNsQixJQUFJLENBQUM7O0FBRVgsUUFBSSxpQkFBaUIsRUFBRSxrREFBK0IsQ0FBQzs7Z0JBRS9CLHNDQUN0QixPQUFPLEVBQ1AsTUFBTSxFQUNOLE1BQU0sRUFDTixHQUFHLEVBQ0gsQ0FBQyxpQkFBaUIsSUFBSSxRQUFRLElBQUksVUFBVSxDQUM3Qzs7UUFOTyxXQUFXLFNBQVgsV0FBVzs7QUFPbkIsUUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQzdCLGNBQVEsUUFBUTtBQUNkLGFBQUssVUFBVTtBQUNiLHFCQUFXLENBQUMsWUFBWSxDQUFDO0FBQ3ZCLHVCQUFXLEVBQUUsY0FBYztBQUMzQixnQkFBSSxFQUFFO0FBQ0osNkJBQWUsRUFBRSxJQUFJO2FBQ3RCO0FBQ0Qsb0JBQVEsRUFBRSxFQUFFO1dBQ2IsQ0FBQyxDQUFDO0FBQ0gscUJBQVcsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQzNELGdCQUFNO0FBQUEsQUFDUixhQUFLLFVBQVU7QUFDYixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBQSxNQUFNLEVBQUk7QUFDN0IsdUJBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakMsZ0JBQUksaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1dBQy9ELENBQUMsQ0FBQztBQUNILGdCQUFNO0FBQUEsT0FDVDtLQUNGLE1BQU07QUFDTCxpQkFBVyxDQUFDLFlBQVksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDNUQ7R0FDRjtDQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFjTSxTQUFTLFdBQVcsQ0FBQyxLQU0xQjtNQUxBLE1BQU0sR0FEb0IsS0FNMUIsQ0FMQSxNQUFNO01BQ04sT0FBTyxHQUZtQixLQU0xQixDQUpBLE9BQU87c0JBSUw7QUFDRixRQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU87O3FEQUNMLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFOzs7O1FBQWpFLFFBQVE7UUFBRSxNQUFNOztBQUV2QixTQUFLLElBQUksR0FBRyxHQUFHLFFBQVEsRUFBRSxHQUFHLElBQUksTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQzdDLGFBQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDekI7R0FDRjtDQUFBOzs7Ozs7Ozs7OztBQVVNLFNBQVMsWUFBWSxDQUFDLEtBTTNCO01BTEEsTUFBTSxHQURxQixLQU0zQixDQUxBLE1BQU07TUFDTixPQUFPLEdBRm9CLEtBTTNCLENBSkEsT0FBTztzQkFJTDtBQUNGLFFBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QixRQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87QUFDcEIsVUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUM1QjtDQUFBIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9yZXN1bHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IFJlc3VsdFZpZXcgZnJvbSBcIi4vY29tcG9uZW50cy9yZXN1bHQtdmlld1wiO1xuaW1wb3J0IE91dHB1dFBhbmUgZnJvbSBcIi4vcGFuZXMvb3V0cHV0LWFyZWFcIjtcbmltcG9ydCBXYXRjaGVzUGFuZSBmcm9tIFwiLi9wYW5lcy93YXRjaGVzXCI7XG5pbXBvcnQgeyBPVVRQVVRfQVJFQV9VUkksIG9wZW5PclNob3dEb2NrIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuaW1wb3J0IHR5cGUgTWFya2VyU3RvcmUgZnJvbSBcIi4vc3RvcmUvbWFya2Vyc1wiO1xuXG4vKipcbiAqIENyZWF0ZXMgYW5kIHJlbmRlcnMgYSBSZXN1bHRWaWV3LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdG9yZSAtIEdsb2JhbCBIeWRyb2dlbiBTdG9yZVxuICogQHBhcmFtIHthdG9tJFRleHRFZGl0b3J9IHN0b3JlLmVkaXRvciAtIFRleHRFZGl0b3IgYXNzb2NpYXRlZCB3aXRoIHRoZSByZXN1bHQuXG4gKiBAcGFyYW0ge0tlcm5lbH0gc3RvcmUua2VybmVsIC0gS2VybmVsIHRvIHJ1biBjb2RlIGFuZCBhc3NvY2lhdGUgd2l0aCB0aGUgcmVzdWx0LlxuICogQHBhcmFtIHtNYXJrZXJTdG9yZX0gc3RvcmUubWFya2VycyAtIE1hcmtlclN0b3JlIHRoYXQgYmVsb25ncyB0byBgc3RvcmUuZWRpdG9yYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2RlQmxvY2sgLSBBIEh5ZHJvZ2VuIENlbGwuXG4gKiBAcGFyYW0ge1N0cmluZ30gY29kZUJsb2NrLmNvZGUgLSBTb3VyY2Ugc3RyaW5nIG9mIHRoZSBjZWxsLlxuICogQHBhcmFtIHtOdW1iZXJ9IGNvZGVCbG9jay5yb3cgLSBSb3cgdG8gZGlzcGxheSB0aGUgcmVzdWx0IG9uLlxuICogQHBhcmFtIHtIeWRyb2dlbkNlbGxUeXBlfSBjb2RlQmxvY2suY2VsbFR5cGUgLSBDZWxsIHR5cGUgb2YgdGhlIGNlbGwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXN1bHQoXG4gIHtcbiAgICBlZGl0b3IsXG4gICAga2VybmVsLFxuICAgIG1hcmtlcnNcbiAgfTogJFJlYWRPbmx5PHtcbiAgICBlZGl0b3I6ID9hdG9tJFRleHRFZGl0b3IsXG4gICAga2VybmVsOiA/S2VybmVsLFxuICAgIG1hcmtlcnM6ID9NYXJrZXJTdG9yZVxuICB9PixcbiAge1xuICAgIGNvZGUsXG4gICAgcm93LFxuICAgIGNlbGxUeXBlXG4gIH06IHsgY29kZTogc3RyaW5nLCByb3c6IG51bWJlciwgY2VsbFR5cGU6IEh5ZHJvZ2VuQ2VsbFR5cGUgfVxuKSB7XG4gIGlmICghZWRpdG9yIHx8ICFrZXJuZWwgfHwgIW1hcmtlcnMpIHJldHVybjtcblxuICBpZiAoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSBpbnN0YW5jZW9mIFdhdGNoZXNQYW5lKSB7XG4gICAga2VybmVsLndhdGNoZXNTdG9yZS5ydW4oKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZ2xvYmFsT3V0cHV0U3RvcmUgPVxuICAgIGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLm91dHB1dEFyZWFEZWZhdWx0XCIpIHx8XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkuZmluZChpdGVtID0+IGl0ZW0gaW5zdGFuY2VvZiBPdXRwdXRQYW5lKVxuICAgICAgPyBrZXJuZWwub3V0cHV0U3RvcmVcbiAgICAgIDogbnVsbDtcblxuICBpZiAoZ2xvYmFsT3V0cHV0U3RvcmUpIG9wZW5PclNob3dEb2NrKE9VVFBVVF9BUkVBX1VSSSk7XG5cbiAgY29uc3QgeyBvdXRwdXRTdG9yZSB9ID0gbmV3IFJlc3VsdFZpZXcoXG4gICAgbWFya2VycyxcbiAgICBrZXJuZWwsXG4gICAgZWRpdG9yLFxuICAgIHJvdyxcbiAgICAhZ2xvYmFsT3V0cHV0U3RvcmUgfHwgY2VsbFR5cGUgPT0gXCJtYXJrZG93blwiXG4gICk7XG4gIGlmIChjb2RlLnNlYXJjaCgvW1xcU10vKSAhPSAtMSkge1xuICAgIHN3aXRjaCAoY2VsbFR5cGUpIHtcbiAgICAgIGNhc2UgXCJtYXJrZG93blwiOlxuICAgICAgICBvdXRwdXRTdG9yZS5hcHBlbmRPdXRwdXQoe1xuICAgICAgICAgIG91dHB1dF90eXBlOiBcImRpc3BsYXlfZGF0YVwiLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwidGV4dC9tYXJrZG93blwiOiBjb2RlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtZXRhZGF0YToge31cbiAgICAgICAgfSk7XG4gICAgICAgIG91dHB1dFN0b3JlLmFwcGVuZE91dHB1dCh7IGRhdGE6IFwib2tcIiwgc3RyZWFtOiBcInN0YXR1c1wiIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJjb2RlY2VsbFwiOlxuICAgICAgICBrZXJuZWwuZXhlY3V0ZShjb2RlLCByZXN1bHQgPT4ge1xuICAgICAgICAgIG91dHB1dFN0b3JlLmFwcGVuZE91dHB1dChyZXN1bHQpO1xuICAgICAgICAgIGlmIChnbG9iYWxPdXRwdXRTdG9yZSkgZ2xvYmFsT3V0cHV0U3RvcmUuYXBwZW5kT3V0cHV0KHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0U3RvcmUuYXBwZW5kT3V0cHV0KHsgZGF0YTogXCJva1wiLCBzdHJlYW06IFwic3RhdHVzXCIgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhcnMgYSBSZXN1bHRWaWV3IG9yIHNlbGVjdGlvbiBvZiBSZXN1bHRWaWV3cy5cbiAqIFRvIHNlbGVjdCBhIHJlc3VsdCB0byBjbGVhciwgcHV0IHlvdXIgY3Vyc29yIG9uIHRoZSByb3cgb24gdGhlIFJlc3VsdFZpZXcuXG4gKiBUbyBzZWxlY3QgbXVsdGlwbGUgUmVzdWx0Vmlld3MsIHNlbGVjdCB0ZXh0IHN0YXJ0aW5nIG9uIHRoZSByb3cgb2ZcbiAqIHRoZSBmaXJzdCBSZXN1bHRWaWV3IHRvIHJlbW92ZSBhbGwgdGhlIHdheSB0byB0ZXh0IG9uIHRoZSByb3cgb2YgdGhlXG4gKiBsYXN0IFJlc3VsdFZpZXcgdG8gcmVtb3ZlLiAqVGhpcyBtdXN0IGJlIG9uZSBzZWxlY3Rpb24gYW5kXG4gKiB0aGUgbGFzdCBzZWxlY3Rpb24gbWFkZSpcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RvcmUgLSBHbG9iYWwgSHlkcm9nZW4gU3RvcmVcbiAqIEBwYXJhbSB7YXRvbSRUZXh0RWRpdG9yfSBzdG9yZS5lZGl0b3IgLSBUZXh0RWRpdG9yIGFzc29jaWF0ZWQgd2l0aCB0aGUgUmVzdWx0Vmlldy5cbiAqIEBwYXJhbSB7TWFya2VyU3RvcmV9IHN0b3JlLm1hcmtlcnMgLSBNYXJrZXJTdG9yZSB0aGF0IGJlbG9uZ3MgdG8gYHN0b3JlLmVkaXRvcmAgYW5kIHRoZSBSZXN1bHRWaWV3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJSZXN1bHQoe1xuICBlZGl0b3IsXG4gIG1hcmtlcnNcbn06ICRSZWFkT25seTx7XG4gIGVkaXRvcjogP2F0b20kVGV4dEVkaXRvcixcbiAgbWFya2VyczogP01hcmtlclN0b3JlXG59Pikge1xuICBpZiAoIWVkaXRvciB8fCAhbWFya2VycykgcmV0dXJuO1xuICBjb25zdCBbc3RhcnRSb3csIGVuZFJvd10gPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJvd1JhbmdlKCk7XG5cbiAgZm9yIChsZXQgcm93ID0gc3RhcnRSb3c7IHJvdyA8PSBlbmRSb3c7IHJvdysrKSB7XG4gICAgbWFya2Vycy5jbGVhck9uUm93KHJvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhcnMgYWxsIFJlc3VsdFZpZXdzIG9mIGEgTWFya2VyU3RvcmUuXG4gKiBJdCBhbHNvIGNsZWFycyB0aGUgY3VycmVjdCBrZXJuZWwgcmVzdWx0cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3RvcmUgLSBHbG9iYWwgSHlkcm9nZW4gU3RvcmVcbiAqIEBwYXJhbSB7S2VybmVsfSBzdG9yZS5rZXJuZWwgLSBLZXJuZWwgdG8gY2xlYXIgb3V0cHV0cy5cbiAqIEBwYXJhbSB7TWFya2VyU3RvcmV9IHN0b3JlLm1hcmtlcnMgLSBNYXJrZXJTdG9yZSB0byBjbGVhci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUmVzdWx0cyh7XG4gIGtlcm5lbCxcbiAgbWFya2Vyc1xufTogJFJlYWRPbmx5PHtcbiAga2VybmVsOiA/S2VybmVsLFxuICBtYXJrZXJzOiA/TWFya2VyU3RvcmVcbn0+KSB7XG4gIGlmIChtYXJrZXJzKSBtYXJrZXJzLmNsZWFyKCk7XG4gIGlmICgha2VybmVsKSByZXR1cm47XG4gIGtlcm5lbC5vdXRwdXRTdG9yZS5jbGVhcigpO1xufVxuIl19