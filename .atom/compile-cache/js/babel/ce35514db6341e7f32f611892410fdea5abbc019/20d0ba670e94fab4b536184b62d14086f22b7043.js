Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exportNotebook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fs = require("fs");

var _store = require("./store");

var _store2 = _interopRequireDefault(_store);

var dialog = require("electron").remote.dialog;

var _require = require("@nteract/commutable");

var stringifyNotebook = _require.stringifyNotebook;

function exportNotebook() {
  // TODO: Refactor to use promises, this is a bit "nested".
  var saveNotebook = function saveNotebook(filename) {
    if (!filename) {
      return;
    }
    var ext = path.extname(filename) === "" ? ".ipynb" : "";
    var fname = "" + filename + ext;
    (0, _fs.writeFile)(fname, stringifyNotebook(_store2["default"].notebook), function (err, data) {
      if (err) {
        atom.notifications.addError("Error saving file", {
          detail: err.message
        });
      } else {
        atom.notifications.addSuccess("Save successful", {
          detail: "Saved notebook as " + fname
        });
      }
    });
  };
  dialog.showSaveDialog(saveNotebook);
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9leHBvcnQtbm90ZWJvb2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQVV3QixjQUFjOzs7Ozs7b0JBUmhCLE1BQU07O0lBQWhCLElBQUk7O2tCQUNVLElBQUk7O3FCQUtaLFNBQVM7Ozs7SUFIbkIsTUFBTSxHQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQXJDLE1BQU07O2VBQ2dCLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQzs7SUFBcEQsaUJBQWlCLFlBQWpCLGlCQUFpQjs7QUFJVixTQUFTLGNBQWMsR0FBRzs7QUFFdkMsTUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQVksUUFBUSxFQUFFO0FBQ3RDLFFBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixhQUFPO0tBQ1I7QUFDRCxRQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQzFELFFBQU0sS0FBSyxRQUFNLFFBQVEsR0FBRyxHQUFHLEFBQUUsQ0FBQztBQUNsQyx1QkFBVSxLQUFLLEVBQUUsaUJBQWlCLENBQUMsbUJBQU0sUUFBUSxDQUFDLEVBQUUsVUFBUyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3RFLFVBQUksR0FBRyxFQUFFO0FBQ1AsWUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7QUFDL0MsZ0JBQU0sRUFBRSxHQUFHLENBQUMsT0FBTztTQUNwQixDQUFDLENBQUM7T0FDSixNQUFNO0FBQ0wsWUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7QUFDL0MsZ0JBQU0seUJBQXVCLEtBQUssQUFBRTtTQUNyQyxDQUFDLENBQUM7T0FDSjtLQUNGLENBQUMsQ0FBQztHQUNKLENBQUM7QUFDRixRQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0NBQ3JDIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9leHBvcnQtbm90ZWJvb2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tIFwiZnNcIjtcblxuY29uc3QgeyBkaWFsb2cgfSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKS5yZW1vdGU7XG5jb25zdCB7IHN0cmluZ2lmeU5vdGVib29rIH0gPSByZXF1aXJlKFwiQG50ZXJhY3QvY29tbXV0YWJsZVwiKTtcblxuaW1wb3J0IHN0b3JlIGZyb20gXCIuL3N0b3JlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4cG9ydE5vdGVib29rKCkge1xuICAvLyBUT0RPOiBSZWZhY3RvciB0byB1c2UgcHJvbWlzZXMsIHRoaXMgaXMgYSBiaXQgXCJuZXN0ZWRcIi5cbiAgY29uc3Qgc2F2ZU5vdGVib29rID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV4dCA9IHBhdGguZXh0bmFtZShmaWxlbmFtZSkgPT09IFwiXCIgPyBcIi5pcHluYlwiIDogXCJcIjtcbiAgICBjb25zdCBmbmFtZSA9IGAke2ZpbGVuYW1lfSR7ZXh0fWA7XG4gICAgd3JpdGVGaWxlKGZuYW1lLCBzdHJpbmdpZnlOb3RlYm9vayhzdG9yZS5ub3RlYm9vayksIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXCJFcnJvciBzYXZpbmcgZmlsZVwiLCB7XG4gICAgICAgICAgZGV0YWlsOiBlcnIubWVzc2FnZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiU2F2ZSBzdWNjZXNzZnVsXCIsIHtcbiAgICAgICAgICBkZXRhaWw6IGBTYXZlZCBub3RlYm9vayBhcyAke2ZuYW1lfWBcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyhzYXZlTm90ZWJvb2spO1xufVxuIl19