Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Open a pane container (dock or workspace center) without focusing it
 * @export
 * @param {string} URI
 * @returns {Promise<void>}
 *
 */

var openOrShowDock = _asyncToGenerator(function* (URI) {
  var paneContainer = atom.workspace.paneContainerForURI(URI);
  if (paneContainer) {
    paneContainer.show();
  }
  if (!paneContainer) {
    // Open item without activating
    paneContainer = yield atom.workspace.open(URI, {
      searchAllPanes: true,
      activatePane: false
    });
  }
  // if container is a dock, show (but dont focus) the dock,
  // if container is workspace center it will already be showing

  return paneContainer;
});

exports.openOrShowDock = openOrShowDock;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// export type MIMETYPE = "application/vnd.dataresource+json";
var DATA_EXPLORER_MEDIA_TYPE = "application/vnd.dataresource+json";

exports.DATA_EXPLORER_MEDIA_TYPE = DATA_EXPLORER_MEDIA_TYPE;
var DATA_EXPLORER_URI = "atom://hydrogen-data-explorer/dock-view";

exports.DATA_EXPLORER_URI = DATA_EXPLORER_URI;
// Just the basics, there is more to fully type this
// https://frictionlessdata.io/specs/tabular-data-resource/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2RhdGEtZXhwbG9yZXIvbGliL2NvbW1vbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFxQnNCLGNBQWMscUJBQTdCLFdBQThCLEdBQVcsRUFBbUI7QUFDakUsTUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1RCxNQUFJLGFBQWEsRUFBRTtBQUNqQixpQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ3RCO0FBQ0QsTUFBSSxDQUFDLGFBQWEsRUFBRTs7QUFFbEIsaUJBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUM3QyxvQkFBYyxFQUFFLElBQUk7QUFDcEIsa0JBQVksRUFBRSxLQUFLO0tBQ3BCLENBQUMsQ0FBQztHQUNKOzs7O0FBSUQsU0FBTyxhQUFhLENBQUM7Q0FDdEI7Ozs7Ozs7QUFsQ00sSUFBTSx3QkFBd0IsR0FBRyxtQ0FBbUMsQ0FBQzs7O0FBRXJFLElBQU0saUJBQWlCLEdBQUcseUNBQXlDLENBQUMiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZGF0YS1leHBsb3Jlci9saWIvY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gZXhwb3J0IHR5cGUgTUlNRVRZUEUgPSBcImFwcGxpY2F0aW9uL3ZuZC5kYXRhcmVzb3VyY2UranNvblwiO1xuZXhwb3J0IGNvbnN0IERBVEFfRVhQTE9SRVJfTUVESUFfVFlQRSA9IFwiYXBwbGljYXRpb24vdm5kLmRhdGFyZXNvdXJjZStqc29uXCI7XG5cbmV4cG9ydCBjb25zdCBEQVRBX0VYUExPUkVSX1VSSSA9IFwiYXRvbTovL2h5ZHJvZ2VuLWRhdGEtZXhwbG9yZXIvZG9jay12aWV3XCI7XG5cbi8vIEp1c3QgdGhlIGJhc2ljcywgdGhlcmUgaXMgbW9yZSB0byBmdWxseSB0eXBlIHRoaXNcbi8vIGh0dHBzOi8vZnJpY3Rpb25sZXNzZGF0YS5pby9zcGVjcy90YWJ1bGFyLWRhdGEtcmVzb3VyY2UvXG5leHBvcnQgdHlwZSBEYXRhUmVzb3VyY2UgPSB7XG4gIGRhdGE6IEFycmF5PE9iamVjdCB8IEFycmF5PGFueT4+LFxuICBzY2hlbWE6IHsgZmllbGRzOiBBcnJheTx7IG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nIH0+IH1cbn07XG5cbi8qKlxuICogT3BlbiBhIHBhbmUgY29udGFpbmVyIChkb2NrIG9yIHdvcmtzcGFjZSBjZW50ZXIpIHdpdGhvdXQgZm9jdXNpbmcgaXRcbiAqIEBleHBvcnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBVUklcbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICpcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wZW5PclNob3dEb2NrKFVSSTogc3RyaW5nKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgbGV0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9yVVJJKFVSSSk7XG4gIGlmIChwYW5lQ29udGFpbmVyKSB7XG4gICAgcGFuZUNvbnRhaW5lci5zaG93KCk7XG4gIH1cbiAgaWYgKCFwYW5lQ29udGFpbmVyKSB7XG4gICAgLy8gT3BlbiBpdGVtIHdpdGhvdXQgYWN0aXZhdGluZ1xuICAgIHBhbmVDb250YWluZXIgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKFVSSSwge1xuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgICBhY3RpdmF0ZVBhbmU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbiAgLy8gaWYgY29udGFpbmVyIGlzIGEgZG9jaywgc2hvdyAoYnV0IGRvbnQgZm9jdXMpIHRoZSBkb2NrLFxuICAvLyBpZiBjb250YWluZXIgaXMgd29ya3NwYWNlIGNlbnRlciBpdCB3aWxsIGFscmVhZHkgYmUgc2hvd2luZ1xuXG4gIHJldHVybiBwYW5lQ29udGFpbmVyO1xufVxuIl19