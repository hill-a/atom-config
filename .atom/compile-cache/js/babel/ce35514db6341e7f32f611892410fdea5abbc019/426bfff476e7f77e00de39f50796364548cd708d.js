Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ipynbOpener = ipynbOpener;
exports.importNotebook = importNotebook;

var _loadNotebook = _asyncToGenerator(function* (filename) {
  var data = undefined;
  var nb = undefined;
  try {
    data = yield readFileP(filename);
    nb = (0, _nteractCommutable.parseNotebook)(data);
  } catch (err) {
    if (err.name === "SyntaxError") {
      atom.notifications.addError("Error not a valid notebook", {
        detail: err.stack
      });
    } else {
      atom.notifications.addError("Error reading file", {
        detail: err.message
      });
    }
    return;
  }
  if (nb.nbformat < 4) {
    atom.notifications.addError("Only notebook version 4 currently supported");
    return;
  }
  var editor = yield atom.workspace.open();
  var grammar = getGrammarForNotebook(nb);
  if (!grammar) return;
  editor.setGrammar(grammar);
  var commentStartString = (0, _codeManager.getCommentStartString)(editor);
  if (!commentStartString) {
    atom.notifications.addError("No comment symbol defined in root scope");
    return;
  }
  var sources = _lodash2["default"].map(nb.cells, function (cell) {
    return getCellSource(cell, commentStartString + " ");
  });
  editor.setText(sources.join(linesep));
});

exports._loadNotebook = _loadNotebook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fs = require("fs");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require("util");

var _nteractCommutable = require("@nteract/commutable");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var _codeManager = require("./code-manager");

var dialog = require("electron").remote.dialog;

var readFileP = (0, _util.promisify)(_fs.readFile);
var linesep = process.platform === "win32" ? "\r\n" : "\n";

function ipynbOpener(uri) {
  if (path.extname(uri).toLowerCase() === ".ipynb" && atom.config.get("Hydrogen.importNotebookURI") === true) {
    return _loadNotebook(uri);
  }
}

function importNotebook(event) {
  // Use selected filepath if called from tree-view context menu
  var filenameFromTreeView = _lodash2["default"].get(event, "target.dataset.path");
  if (filenameFromTreeView && path.extname(filenameFromTreeView) === ".ipynb") {
    return _loadNotebook(filenameFromTreeView);
  }

  dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Notebooks", extensions: ["ipynb"] }]
  }, function (filenames) {
    if (!filenames) {
      atom.notifications.addError("No filenames selected");
      return;
    }
    var filename = filenames[0];
    if (path.extname(filename) !== ".ipynb") {
      atom.notifications.addError("Selected file must have extension .ipynb");
      return;
    }

    _loadNotebook(filename);
  });
}

function getGrammarForNotebook(nb) {
  if (!nb.metadata.kernelspec || !nb.metadata.language_info) {
    atom.notifications.addWarning("No language metadata in notebook; assuming Python");
    return atom.grammars.grammarForScopeName("source.python");
  }

  var matchedGrammar = null;
  // metadata.language_info.file_extension is not a required metadata field, but
  // if it exists is the best way to match with Atom Grammar
  if (nb.metadata.language_info && nb.metadata.language_info.file_extension) {
    matchedGrammar = getGrammarForFileExtension(nb.metadata.language_info.file_extension);
    if (matchedGrammar) return matchedGrammar;
  }

  // If metadata exists, then metadata.kernelspec.name is required (in v4)
  if (nb.metadata.kernelspec.name) {
    matchedGrammar = getGrammarForKernelspecName(nb.metadata.kernelspec.name);
    if (matchedGrammar) return matchedGrammar;
  }

  atom.notifications.addWarning("Unable to determine correct language grammar");
  return atom.grammars.grammarForScopeName("source.python");
}

function getGrammarForFileExtension(ext) {
  ext = ext.startsWith(".") ? ext.slice(1) : ext;
  var grammars = atom.grammars.getGrammars();
  return _lodash2["default"].find(grammars, function (grammar) {
    return _lodash2["default"].includes(grammar.fileTypes, ext);
  });
}

function getGrammarForKernelspecName(name) {
  // Check if there exists an Atom grammar named source.${name}
  var grammars = atom.grammars.getGrammars();
  var matchedGrammar = _lodash2["default"].find(grammars, { scopeName: "source." + name });
  if (matchedGrammar) return matchedGrammar;

  // Otherwise attempt manual matching from kernelspec name to Atom scope
  var crosswalk = {
    python2: "source.python",
    python3: "source.python",
    bash: "source.shell",
    javascript: "source.js",
    ir: "source.r"
  };
  if (crosswalk[name]) {
    return atom.grammars.grammarForScopeName(crosswalk[name]);
  }
}

function getCellSource(cell, commentStartString) {
  var cellType = cell.cell_type;
  var cellMarkerKeyword = cellType === "markdown" ? "markdown" : null;
  var cellMarker = getCellMarker(commentStartString, cellMarkerKeyword);
  var source = cell.source;
  if (cellType === "markdown") {
    source = _lodash2["default"].map(source, function (line) {
      return commentStartString + line;
    });
  }
  return cellMarker + linesep + source.join("");
}

function getCellMarker(commentStartString, keyword) {
  var marker = commentStartString + "%%";
  return keyword ? marker + (" " + keyword) : marker;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9pbXBvcnQtbm90ZWJvb2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBc0RzQixhQUFhLHFCQUE1QixXQUE2QixRQUFnQixFQUFFO0FBQ3BELE1BQUksSUFBSSxZQUFBLENBQUM7QUFDVCxNQUFJLEVBQUUsWUFBQSxDQUFDO0FBQ1AsTUFBSTtBQUNGLFFBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqQyxNQUFFLEdBQUcsc0NBQWMsSUFBSSxDQUFDLENBQUM7R0FDMUIsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNaLFFBQUksR0FBRyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7QUFDOUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7QUFDeEQsY0FBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLO09BQ2xCLENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtBQUNoRCxjQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU87T0FDcEIsQ0FBQyxDQUFDO0tBQ0o7QUFDRCxXQUFPO0dBQ1I7QUFDRCxNQUFJLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO0FBQ25CLFFBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDM0UsV0FBTztHQUNSO0FBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNDLE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLE1BQUksQ0FBQyxPQUFPLEVBQUUsT0FBTztBQUNyQixRQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNCLE1BQU0sa0JBQWtCLEdBQUcsd0NBQXNC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QUcsTUFBTSxVQUFPLE9BQU8sQ0FBRSxHQUFHLE1BQU0sQ0FBQztDQUNsRCIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvaW1wb3J0LW5vdGVib29rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcblxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKFwiZWxlY3Ryb25cIikucmVtb3RlO1xuaW1wb3J0IHsgcGFyc2VOb3RlYm9vayB9IGZyb20gXCJAbnRlcmFjdC9jb21tdXRhYmxlXCI7XG5pbXBvcnQgdHlwZSB7IE5vdGVib29rLCBDZWxsIH0gZnJvbSBcIkBudGVyYWN0L2NvbW11dGFibGVcIjtcblxuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5pbXBvcnQgeyBnZXRDb21tZW50U3RhcnRTdHJpbmcgfSBmcm9tIFwiLi9jb2RlLW1hbmFnZXJcIjtcblxuY29uc3QgcmVhZEZpbGVQID0gcHJvbWlzaWZ5KHJlYWRGaWxlKTtcbmNvbnN0IGxpbmVzZXAgPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcIlxcclxcblwiIDogXCJcXG5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGlweW5iT3BlbmVyKHVyaTogc3RyaW5nKSB7XG4gIGlmIChcbiAgICBwYXRoLmV4dG5hbWUodXJpKS50b0xvd2VyQ2FzZSgpID09PSBcIi5pcHluYlwiICYmXG4gICAgYXRvbS5jb25maWcuZ2V0KFwiSHlkcm9nZW4uaW1wb3J0Tm90ZWJvb2tVUklcIikgPT09IHRydWVcbiAgKSB7XG4gICAgcmV0dXJuIF9sb2FkTm90ZWJvb2sodXJpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW1wb3J0Tm90ZWJvb2soZXZlbnQ/OiBhdG9tJEN1c3RvbUV2ZW50KSB7XG4gIC8vIFVzZSBzZWxlY3RlZCBmaWxlcGF0aCBpZiBjYWxsZWQgZnJvbSB0cmVlLXZpZXcgY29udGV4dCBtZW51XG4gIGNvbnN0IGZpbGVuYW1lRnJvbVRyZWVWaWV3ID0gXy5nZXQoZXZlbnQsIFwidGFyZ2V0LmRhdGFzZXQucGF0aFwiKTtcbiAgaWYgKGZpbGVuYW1lRnJvbVRyZWVWaWV3ICYmIHBhdGguZXh0bmFtZShmaWxlbmFtZUZyb21UcmVlVmlldykgPT09IFwiLmlweW5iXCIpIHtcbiAgICByZXR1cm4gX2xvYWROb3RlYm9vayhmaWxlbmFtZUZyb21UcmVlVmlldyk7XG4gIH1cblxuICBkaWFsb2cuc2hvd09wZW5EaWFsb2coXG4gICAge1xuICAgICAgcHJvcGVydGllczogW1wib3BlbkZpbGVcIl0sXG4gICAgICBmaWx0ZXJzOiBbeyBuYW1lOiBcIk5vdGVib29rc1wiLCBleHRlbnNpb25zOiBbXCJpcHluYlwiXSB9XVxuICAgIH0sXG4gICAgKGZpbGVuYW1lczogP0FycmF5PHN0cmluZz4pID0+IHtcbiAgICAgIGlmICghZmlsZW5hbWVzKSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIk5vIGZpbGVuYW1lcyBzZWxlY3RlZFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsZW5hbWUgPSBmaWxlbmFtZXNbMF07XG4gICAgICBpZiAocGF0aC5leHRuYW1lKGZpbGVuYW1lKSAhPT0gXCIuaXB5bmJcIikge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJTZWxlY3RlZCBmaWxlIG11c3QgaGF2ZSBleHRlbnNpb24gLmlweW5iXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF9sb2FkTm90ZWJvb2soZmlsZW5hbWUpO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIF9sb2FkTm90ZWJvb2soZmlsZW5hbWU6IHN0cmluZykge1xuICBsZXQgZGF0YTtcbiAgbGV0IG5iO1xuICB0cnkge1xuICAgIGRhdGEgPSBhd2FpdCByZWFkRmlsZVAoZmlsZW5hbWUpO1xuICAgIG5iID0gcGFyc2VOb3RlYm9vayhkYXRhKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyci5uYW1lID09PSBcIlN5bnRheEVycm9yXCIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkVycm9yIG5vdCBhIHZhbGlkIG5vdGVib29rXCIsIHtcbiAgICAgICAgZGV0YWlsOiBlcnIuc3RhY2tcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJFcnJvciByZWFkaW5nIGZpbGVcIiwge1xuICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChuYi5uYmZvcm1hdCA8IDQpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJPbmx5IG5vdGVib29rIHZlcnNpb24gNCBjdXJyZW50bHkgc3VwcG9ydGVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKCk7XG4gIGNvbnN0IGdyYW1tYXIgPSBnZXRHcmFtbWFyRm9yTm90ZWJvb2sobmIpO1xuICBpZiAoIWdyYW1tYXIpIHJldHVybjtcbiAgZWRpdG9yLnNldEdyYW1tYXIoZ3JhbW1hcik7XG4gIGNvbnN0IGNvbW1lbnRTdGFydFN0cmluZyA9IGdldENvbW1lbnRTdGFydFN0cmluZyhlZGl0b3IpO1xuICBpZiAoIWNvbW1lbnRTdGFydFN0cmluZykge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIk5vIGNvbW1lbnQgc3ltYm9sIGRlZmluZWQgaW4gcm9vdCBzY29wZVwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3Qgc291cmNlcyA9IF8ubWFwKG5iLmNlbGxzLCBjZWxsID0+IHtcbiAgICByZXR1cm4gZ2V0Q2VsbFNvdXJjZShjZWxsLCBjb21tZW50U3RhcnRTdHJpbmcgKyBcIiBcIik7XG4gIH0pO1xuICBlZGl0b3Iuc2V0VGV4dChzb3VyY2VzLmpvaW4obGluZXNlcCkpO1xufVxuXG5mdW5jdGlvbiBnZXRHcmFtbWFyRm9yTm90ZWJvb2sobmI6IE5vdGVib29rKSB7XG4gIGlmICghbmIubWV0YWRhdGEua2VybmVsc3BlYyB8fCAhbmIubWV0YWRhdGEubGFuZ3VhZ2VfaW5mbykge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgXCJObyBsYW5ndWFnZSBtZXRhZGF0YSBpbiBub3RlYm9vazsgYXNzdW1pbmcgUHl0aG9uXCJcbiAgICApO1xuICAgIHJldHVybiBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UucHl0aG9uXCIpO1xuICB9XG5cbiAgbGV0IG1hdGNoZWRHcmFtbWFyID0gbnVsbDtcbiAgLy8gbWV0YWRhdGEubGFuZ3VhZ2VfaW5mby5maWxlX2V4dGVuc2lvbiBpcyBub3QgYSByZXF1aXJlZCBtZXRhZGF0YSBmaWVsZCwgYnV0XG4gIC8vIGlmIGl0IGV4aXN0cyBpcyB0aGUgYmVzdCB3YXkgdG8gbWF0Y2ggd2l0aCBBdG9tIEdyYW1tYXJcbiAgaWYgKG5iLm1ldGFkYXRhLmxhbmd1YWdlX2luZm8gJiYgbmIubWV0YWRhdGEubGFuZ3VhZ2VfaW5mby5maWxlX2V4dGVuc2lvbikge1xuICAgIG1hdGNoZWRHcmFtbWFyID0gZ2V0R3JhbW1hckZvckZpbGVFeHRlbnNpb24oXG4gICAgICBuYi5tZXRhZGF0YS5sYW5ndWFnZV9pbmZvLmZpbGVfZXh0ZW5zaW9uXG4gICAgKTtcbiAgICBpZiAobWF0Y2hlZEdyYW1tYXIpIHJldHVybiBtYXRjaGVkR3JhbW1hcjtcbiAgfVxuXG4gIC8vIElmIG1ldGFkYXRhIGV4aXN0cywgdGhlbiBtZXRhZGF0YS5rZXJuZWxzcGVjLm5hbWUgaXMgcmVxdWlyZWQgKGluIHY0KVxuICBpZiAobmIubWV0YWRhdGEua2VybmVsc3BlYy5uYW1lKSB7XG4gICAgbWF0Y2hlZEdyYW1tYXIgPSBnZXRHcmFtbWFyRm9yS2VybmVsc3BlY05hbWUobmIubWV0YWRhdGEua2VybmVsc3BlYy5uYW1lKTtcbiAgICBpZiAobWF0Y2hlZEdyYW1tYXIpIHJldHVybiBtYXRjaGVkR3JhbW1hcjtcbiAgfVxuXG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwiVW5hYmxlIHRvIGRldGVybWluZSBjb3JyZWN0IGxhbmd1YWdlIGdyYW1tYXJcIik7XG4gIHJldHVybiBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UucHl0aG9uXCIpO1xufVxuXG5mdW5jdGlvbiBnZXRHcmFtbWFyRm9yRmlsZUV4dGVuc2lvbihleHQ6IHN0cmluZyk6ID9hdG9tJEdyYW1tYXIge1xuICBleHQgPSBleHQuc3RhcnRzV2l0aChcIi5cIikgPyBleHQuc2xpY2UoMSkgOiBleHQ7XG4gIGNvbnN0IGdyYW1tYXJzID0gYXRvbS5ncmFtbWFycy5nZXRHcmFtbWFycygpO1xuICByZXR1cm4gXy5maW5kKGdyYW1tYXJzLCBncmFtbWFyID0+IHtcbiAgICByZXR1cm4gXy5pbmNsdWRlcyhncmFtbWFyLmZpbGVUeXBlcywgZXh0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEdyYW1tYXJGb3JLZXJuZWxzcGVjTmFtZShuYW1lOiBzdHJpbmcpOiA/YXRvbSRHcmFtbWFyIHtcbiAgLy8gQ2hlY2sgaWYgdGhlcmUgZXhpc3RzIGFuIEF0b20gZ3JhbW1hciBuYW1lZCBzb3VyY2UuJHtuYW1lfVxuICBjb25zdCBncmFtbWFycyA9IGF0b20uZ3JhbW1hcnMuZ2V0R3JhbW1hcnMoKTtcbiAgY29uc3QgbWF0Y2hlZEdyYW1tYXIgPSBfLmZpbmQoZ3JhbW1hcnMsIHsgc2NvcGVOYW1lOiBgc291cmNlLiR7bmFtZX1gIH0pO1xuICBpZiAobWF0Y2hlZEdyYW1tYXIpIHJldHVybiBtYXRjaGVkR3JhbW1hcjtcblxuICAvLyBPdGhlcndpc2UgYXR0ZW1wdCBtYW51YWwgbWF0Y2hpbmcgZnJvbSBrZXJuZWxzcGVjIG5hbWUgdG8gQXRvbSBzY29wZVxuICBjb25zdCBjcm9zc3dhbGsgPSB7XG4gICAgcHl0aG9uMjogXCJzb3VyY2UucHl0aG9uXCIsXG4gICAgcHl0aG9uMzogXCJzb3VyY2UucHl0aG9uXCIsXG4gICAgYmFzaDogXCJzb3VyY2Uuc2hlbGxcIixcbiAgICBqYXZhc2NyaXB0OiBcInNvdXJjZS5qc1wiLFxuICAgIGlyOiBcInNvdXJjZS5yXCJcbiAgfTtcbiAgaWYgKGNyb3Nzd2Fsa1tuYW1lXSkge1xuICAgIHJldHVybiBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoY3Jvc3N3YWxrW25hbWVdKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDZWxsU291cmNlKGNlbGw6IENlbGwsIGNvbW1lbnRTdGFydFN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgY2VsbFR5cGUgPSBjZWxsLmNlbGxfdHlwZTtcbiAgY29uc3QgY2VsbE1hcmtlcktleXdvcmQgPSBjZWxsVHlwZSA9PT0gXCJtYXJrZG93blwiID8gXCJtYXJrZG93blwiIDogbnVsbDtcbiAgY29uc3QgY2VsbE1hcmtlciA9IGdldENlbGxNYXJrZXIoY29tbWVudFN0YXJ0U3RyaW5nLCBjZWxsTWFya2VyS2V5d29yZCk7XG4gIHZhciBzb3VyY2UgPSBjZWxsLnNvdXJjZTtcbiAgaWYgKGNlbGxUeXBlID09PSBcIm1hcmtkb3duXCIpIHtcbiAgICBzb3VyY2UgPSBfLm1hcChzb3VyY2UsIGxpbmUgPT4gY29tbWVudFN0YXJ0U3RyaW5nICsgbGluZSk7XG4gIH1cbiAgcmV0dXJuIGNlbGxNYXJrZXIgKyBsaW5lc2VwICsgc291cmNlLmpvaW4oXCJcIik7XG59XG5cbmZ1bmN0aW9uIGdldENlbGxNYXJrZXIoY29tbWVudFN0YXJ0U3RyaW5nOiBzdHJpbmcsIGtleXdvcmQ6ID9zdHJpbmcpIHtcbiAgY29uc3QgbWFya2VyID0gY29tbWVudFN0YXJ0U3RyaW5nICsgXCIlJVwiO1xuICByZXR1cm4ga2V5d29yZCA/IG1hcmtlciArIGAgJHtrZXl3b3JkfWAgOiBtYXJrZXI7XG59XG4iXX0=