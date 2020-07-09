Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

exports.toggleInspector = toggleInspector;
exports.toggleOutputMode = toggleOutputMode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _utils = require("./utils");

var _codeManager = require("./code-manager");

var _panesOutputArea = require("./panes/output-area");

var _panesOutputArea2 = _interopRequireDefault(_panesOutputArea);

function toggleInspector(store) {
  var editor = store.editor;
  var kernel = store.kernel;

  if (!editor || !kernel) {
    atom.notifications.addInfo("No kernel running!");
    return;
  }

  var _getCodeToInspect = (0, _codeManager.getCodeToInspect)(editor);

  var _getCodeToInspect2 = _slicedToArray(_getCodeToInspect, 2);

  var code = _getCodeToInspect2[0];
  var cursorPos = _getCodeToInspect2[1];

  if (!code || cursorPos === 0) {
    atom.notifications.addInfo("No code to introspect!");
    return;
  }

  kernel.inspect(code, cursorPos, function (result) {
    (0, _utils.log)("Inspector: Result:", result);

    if (!result.found) {
      atom.workspace.hide(_utils.INSPECTOR_URI);
      atom.notifications.addInfo("No introspection available!");
      return;
    }

    kernel.setInspectorResult(result.data, editor);
  });
}

function toggleOutputMode() {
  // There should never be more than one instance of OutputArea
  var outputArea = atom.workspace.getPaneItems().find(function (paneItem) {
    return paneItem instanceof _panesOutputArea2["default"];
  });

  if (outputArea) {
    return outputArea.destroy();
  } else {
    (0, _utils.openOrShowDock)(_utils.OUTPUT_AREA_URI);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztxQkFRTyxTQUFTOzsyQkFDaUIsZ0JBQWdCOzsrQkFDMUIscUJBQXFCOzs7O0FBSXJDLFNBQVMsZUFBZSxDQUFDLEtBQVksRUFBRTtNQUNwQyxNQUFNLEdBQWEsS0FBSyxDQUF4QixNQUFNO01BQUUsTUFBTSxHQUFLLEtBQUssQ0FBaEIsTUFBTTs7QUFDdEIsTUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUN0QixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2pELFdBQU87R0FDUjs7MEJBRXlCLG1DQUFpQixNQUFNLENBQUM7Ozs7TUFBM0MsSUFBSTtNQUFFLFNBQVM7O0FBQ3RCLE1BQUksQ0FBQyxJQUFJLElBQUksU0FBUyxLQUFLLENBQUMsRUFBRTtBQUM1QixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3JELFdBQU87R0FDUjs7QUFFRCxRQUFNLENBQUMsT0FBTyxDQUNaLElBQUksRUFDSixTQUFTLEVBQ1QsVUFBQyxNQUFNLEVBQXVDO0FBQzVDLG9CQUFJLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksc0JBQWUsQ0FBQztBQUNuQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzFELGFBQU87S0FDUjs7QUFFRCxVQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztHQUNoRCxDQUNGLENBQUM7Q0FDSDs7QUFFTSxTQUFTLGdCQUFnQixHQUFTOztBQUV2QyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUM5QixZQUFZLEVBQUUsQ0FDZCxJQUFJLENBQUMsVUFBQSxRQUFRO1dBQUksUUFBUSx3Q0FBc0I7R0FBQSxDQUFDLENBQUM7O0FBRXBELE1BQUksVUFBVSxFQUFFO0FBQ2QsV0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDN0IsTUFBTTtBQUNMLHNEQUErQixDQUFDO0dBQ2pDO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHtcbiAgbG9nLFxuICByZWFjdEZhY3RvcnksXG4gIElOU1BFQ1RPUl9VUkksXG4gIE9VVFBVVF9BUkVBX1VSSSxcbiAgb3Blbk9yU2hvd0RvY2tcbn0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IGdldENvZGVUb0luc3BlY3QgfSBmcm9tIFwiLi9jb2RlLW1hbmFnZXJcIjtcbmltcG9ydCBPdXRwdXRQYW5lIGZyb20gXCIuL3BhbmVzL291dHB1dC1hcmVhXCI7XG5cbmltcG9ydCB0eXBlb2Ygc3RvcmUgZnJvbSBcIi4vc3RvcmVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZUluc3BlY3RvcihzdG9yZTogc3RvcmUpIHtcbiAgY29uc3QgeyBlZGl0b3IsIGtlcm5lbCB9ID0gc3RvcmU7XG4gIGlmICghZWRpdG9yIHx8ICFrZXJuZWwpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIk5vIGtlcm5lbCBydW5uaW5nIVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBbY29kZSwgY3Vyc29yUG9zXSA9IGdldENvZGVUb0luc3BlY3QoZWRpdG9yKTtcbiAgaWYgKCFjb2RlIHx8IGN1cnNvclBvcyA9PT0gMCkge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFwiTm8gY29kZSB0byBpbnRyb3NwZWN0IVwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBrZXJuZWwuaW5zcGVjdChcbiAgICBjb2RlLFxuICAgIGN1cnNvclBvcyxcbiAgICAocmVzdWx0OiB7IGRhdGE6IE9iamVjdCwgZm91bmQ6IEJvb2xlYW4gfSkgPT4ge1xuICAgICAgbG9nKFwiSW5zcGVjdG9yOiBSZXN1bHQ6XCIsIHJlc3VsdCk7XG5cbiAgICAgIGlmICghcmVzdWx0LmZvdW5kKSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmhpZGUoSU5TUEVDVE9SX1VSSSk7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFwiTm8gaW50cm9zcGVjdGlvbiBhdmFpbGFibGUhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGtlcm5lbC5zZXRJbnNwZWN0b3JSZXN1bHQocmVzdWx0LmRhdGEsIGVkaXRvcik7XG4gICAgfVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlT3V0cHV0TW9kZSgpOiB2b2lkIHtcbiAgLy8gVGhlcmUgc2hvdWxkIG5ldmVyIGJlIG1vcmUgdGhhbiBvbmUgaW5zdGFuY2Ugb2YgT3V0cHV0QXJlYVxuICBjb25zdCBvdXRwdXRBcmVhID0gYXRvbS53b3Jrc3BhY2VcbiAgICAuZ2V0UGFuZUl0ZW1zKClcbiAgICAuZmluZChwYW5lSXRlbSA9PiBwYW5lSXRlbSBpbnN0YW5jZW9mIE91dHB1dFBhbmUpO1xuXG4gIGlmIChvdXRwdXRBcmVhKSB7XG4gICAgcmV0dXJuIG91dHB1dEFyZWEuZGVzdHJveSgpO1xuICB9IGVsc2Uge1xuICAgIG9wZW5PclNob3dEb2NrKE9VVFBVVF9BUkVBX1VSSSk7XG4gIH1cbn1cbiJdfQ==