Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTable = require("react-table");

var _reactTable2 = _interopRequireDefault(_reactTable);

var _mobxReact = require("mobx-react");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _tildify = require("tildify");

var _tildify2 = _interopRequireDefault(_tildify);

var _kernel = require("../kernel");

var _kernel2 = _interopRequireDefault(_kernel);

var _utils = require("../utils");

var showKernelSpec = function showKernelSpec(kernelSpec) {
  atom.notifications.addInfo("Hydrogen: Kernel Spec", {
    detail: JSON.stringify(kernelSpec, null, 2),
    dismissable: true
  });
};
var interrupt = function interrupt(kernel) {
  kernel.interrupt();
};
var shutdown = function shutdown(kernel) {
  kernel.shutdown();
  kernel.destroy();
};
var restart = function restart(kernel) {
  kernel.restart();
};

// @TODO If our store holds editor IDs instead of file paths, these messy matching stuff below would
//       easily be replaced by simpler code. See also components/kernel-monitor.js for this problem.
var openUnsavedEditor = function openUnsavedEditor(filePath) {
  var editor = atom.workspace.getTextEditors().find(function (editor) {
    var match = filePath.match(/\d+/);
    if (!match) {
      return false;
    }
    return String(editor.id) === match[0];
  });
  // This path won't happen after https://github.com/nteract/hydrogen/pull/1662 since every deleted
  // editors would be deleted from `store.kernelMapping`. Just kept here for safety.
  if (!editor) return;
  atom.workspace.open(editor, {
    searchAllPanes: true
  });
};
var openEditor = function openEditor(filePath) {
  atom.workspace.open(filePath, {
    searchAllPanes: true
  })["catch"](function (err) {
    atom.notifications.addError("Hydrogen", {
      description: err
    });
  });
};

var kernelInfoCell = function kernelInfoCell(props) {
  var _props$value = props.value;
  var displayName = _props$value.displayName;
  var kernelSpec = _props$value.kernelSpec;

  return _react2["default"].createElement(
    "a",
    {
      className: "icon",
      onClick: showKernelSpec.bind(_this, kernelSpec),
      title: "Show kernel spec",
      key: displayName + "kernelInfo"
    },
    displayName
  );
};

// Set default properties of React-Table
Object.assign(_reactTable.ReactTableDefaults, {
  className: "kernel-monitor",
  showPagination: false
});
Object.assign(_reactTable.ReactTableDefaults.column, {
  className: "table-cell",
  headerClassName: "table-header",
  style: { textAlign: "center" }
});

var KernelMonitor = (0, _mobxReact.observer)(function (_ref) {
  var store = _ref.store;
  return (function () {
    var _this2 = this;

    if (store.runningKernels.length === 0) {
      return _react2["default"].createElement(
        "ul",
        { className: "background-message centered" },
        _react2["default"].createElement(
          "li",
          null,
          "No running kernels"
        )
      );
    }

    var data = _lodash2["default"].map(store.runningKernels, function (kernel, key) {
      return {
        gateway: kernel.transport.gatewayName || "Local",
        kernelInfo: {
          displayName: kernel.displayName,
          kernelSpec: kernel.kernelSpec
        },
        status: kernel.executionState,
        executionCount: kernel.executionCount,
        lastExecutionTime: kernel.lastExecutionTime,
        kernelKey: { kernel: kernel, key: String(key) },
        files: store.getFilesForKernel(kernel)
      };
    });
    var columns = [{
      Header: "Gateway",
      accessor: "gateway",
      maxWidth: 125
    }, {
      Header: "Kernel",
      accessor: "kernelInfo",
      Cell: kernelInfoCell,
      maxWidth: 125
    }, {
      Header: "Status",
      accessor: "status",
      maxWidth: 100
    }, {
      Header: "Count",
      accessor: "executionCount",
      maxWidth: 50,
      style: { textAlign: "right" }
    }, {
      Header: "Last Exec Time",
      accessor: "lastExecutionTime",
      maxWidth: 100,
      style: { textAlign: "right" }
    }, {
      Header: "Managements",
      accessor: "kernelKey",
      Cell: function Cell(props) {
        var _props$value2 = props.value;
        var kernel = _props$value2.kernel;
        var key = _props$value2.key;

        return [_react2["default"].createElement("a", {
          className: "icon icon-zap",
          onClick: interrupt.bind(_this2, kernel),
          title: "Interrupt kernel",
          key: key + "interrupt"
        }), _react2["default"].createElement("a", {
          className: "icon icon-sync",
          onClick: restart.bind(_this2, kernel),
          title: "Restart kernel",
          key: key + "restart"
        }), _react2["default"].createElement("a", {
          className: "icon icon-trashcan",
          onClick: shutdown.bind(_this2, kernel),
          title: "Shutdown kernel",
          key: key + "shutdown"
        })];
      },
      width: 150
    }, {
      Header: "Files",
      accessor: "files",
      Cell: function Cell(props) {
        return props.value.map(function (filePath, index) {
          var separator = index === 0 ? "" : "  |  ";
          var body = (0, _utils.isUnsavedFilePath)(filePath) ? _react2["default"].createElement(
            "a",
            {
              onClick: openUnsavedEditor.bind(_this2, filePath),
              title: "Jump to file",
              key: filePath + "jump"
            },
            filePath
          ) : _react2["default"].createElement(
            "a",
            {
              onClick: openEditor.bind(_this2, filePath),
              title: "Jump to file",
              key: filePath + "jump"
            },
            (0, _tildify2["default"])(filePath)
          );
          return _react2["default"].createElement(
            "div",
            { style: { display: "-webkit-inline-box" }, key: filePath },
            separator,
            body
          );
        });
      },
      style: { textAlign: "center", whiteSpace: "pre-wrap" }
    }];

    return _react2["default"].createElement(_reactTable2["default"], { data: data, columns: columns });
  })();
});

KernelMonitor.displayName = "KernelMonitor";
exports["default"] = KernelMonitor;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL2tlcm5lbC1tb25pdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7OzBCQUNGLGFBQWE7Ozs7eUJBRVgsWUFBWTs7c0JBQ3ZCLFFBQVE7Ozs7dUJBQ0YsU0FBUzs7OztzQkFHVixXQUFXOzs7O3FCQUNJLFVBQVU7O0FBRTVDLElBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxVQUFVLEVBQVM7QUFDekMsTUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUU7QUFDbEQsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDM0MsZUFBVyxFQUFFLElBQUk7R0FDbEIsQ0FBQyxDQUFDO0NBQ0osQ0FBQztBQUNGLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLE1BQU0sRUFBYTtBQUNwQyxRQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Q0FDcEIsQ0FBQztBQUNGLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLE1BQU0sRUFBYTtBQUNuQyxRQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbEIsUUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ2xCLENBQUM7QUFDRixJQUFNLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxNQUFNLEVBQWE7QUFDbEMsUUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0NBQ2xCLENBQUM7Ozs7QUFJRixJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLFFBQVEsRUFBYTtBQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUM1RCxRQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFD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QUFJLEVBQUUsSUFBSSxBQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFHLENBQUM7R0FDckQ7Q0FBQSxDQUFDLENBQUM7O0FBRUgsYUFBYSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUM7cUJBQzdCLGFBQWEiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL2NvbXBvbmVudHMva2VybmVsLW1vbml0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgUmVhY3RUYWJsZSBmcm9tIFwicmVhY3QtdGFibGVcIjtcbmltcG9ydCB7IFJlYWN0VGFibGVEZWZhdWx0cyB9IGZyb20gXCJyZWFjdC10YWJsZVwiO1xuaW1wb3J0IHsgb2JzZXJ2ZXIgfSBmcm9tIFwibW9ieC1yZWFjdFwiO1xuaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHRpbGRpZnkgZnJvbSBcInRpbGRpZnlcIjtcblxuaW1wb3J0IHR5cGVvZiBzdG9yZSBmcm9tIFwiLi4vc3RvcmVcIjtcbmltcG9ydCBLZXJuZWwgZnJvbSBcIi4uL2tlcm5lbFwiO1xuaW1wb3J0IHsgaXNVbnNhdmVkRmlsZVBhdGggfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuY29uc3Qgc2hvd0tlcm5lbFNwZWMgPSAoa2VybmVsU3BlYzoge30pID0+IHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXCJIeWRyb2dlbjogS2VybmVsIFNwZWNcIiwge1xuICAgIGRldGFpbDogSlNPTi5zdHJpbmdpZnkoa2VybmVsU3BlYywgbnVsbCwgMiksXG4gICAgZGlzbWlzc2FibGU6IHRydWVcbiAgfSk7XG59O1xuY29uc3QgaW50ZXJydXB0ID0gKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gIGtlcm5lbC5pbnRlcnJ1cHQoKTtcbn07XG5jb25zdCBzaHV0ZG93biA9IChrZXJuZWw6IEtlcm5lbCkgPT4ge1xuICBrZXJuZWwuc2h1dGRvd24oKTtcbiAga2VybmVsLmRlc3Ryb3koKTtcbn07XG5jb25zdCByZXN0YXJ0ID0gKGtlcm5lbDogS2VybmVsKSA9PiB7XG4gIGtlcm5lbC5yZXN0YXJ0KCk7XG59O1xuXG4vLyBAVE9ETyBJZiBvdXIgc3RvcmUgaG9sZHMgZWRpdG9yIElEcyBpbnN0ZWFkIG9mIGZpbGUgcGF0aHMsIHRoZXNlIG1lc3N5IG1hdGNoaW5nIHN0dWZmIGJlbG93IHdvdWxkXG4vLyAgICAgICBlYXNpbHkgYmUgcmVwbGFjZWQgYnkgc2ltcGxlciBjb2RlLiBTZWUgYWxzbyBjb21wb25lbnRzL2tlcm5lbC1tb25pdG9yLmpzIGZvciB0aGlzIHByb2JsZW0uXG5jb25zdCBvcGVuVW5zYXZlZEVkaXRvciA9IChmaWxlUGF0aDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmluZChlZGl0b3IgPT4ge1xuICAgIGNvbnN0IG1hdGNoID0gZmlsZVBhdGgubWF0Y2goL1xcZCsvKTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcoZWRpdG9yLmlkKSA9PT0gbWF0Y2hbMF07XG4gIH0pO1xuICAvLyBUaGlzIHBhdGggd29uJ3QgaGFwcGVuIGFmdGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L2h5ZHJvZ2VuL3B1bGwvMTY2MiBzaW5jZSBldmVyeSBkZWxldGVkXG4gIC8vIGVkaXRvcnMgd291bGQgYmUgZGVsZXRlZCBmcm9tIGBzdG9yZS5rZXJuZWxNYXBwaW5nYC4gSnVzdCBrZXB0IGhlcmUgZm9yIHNhZmV0eS5cbiAgaWYgKCFlZGl0b3IpIHJldHVybjtcbiAgYXRvbS53b3Jrc3BhY2Uub3BlbihlZGl0b3IsIHtcbiAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICB9KTtcbn07XG5jb25zdCBvcGVuRWRpdG9yID0gKGZpbGVQYXRoOiBzdHJpbmcpID0+IHtcbiAgYXRvbS53b3Jrc3BhY2VcbiAgICAub3BlbihmaWxlUGF0aCwge1xuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcbiAgICB9KVxuICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiSHlkcm9nZW5cIiwge1xuICAgICAgICBkZXNjcmlwdGlvbjogZXJyXG4gICAgICB9KTtcbiAgICB9KTtcbn07XG5cbnR5cGUgS2VybmVsSW5mbyA9IHtcbiAgdmFsdWU6IHtcbiAgICBkaXNwbGF5TmFtZTogc3RyaW5nLFxuICAgIGtlcm5lbFNwZWM6IEtlcm5lbHNwZWNcbiAgfVxufTtcbmNvbnN0IGtlcm5lbEluZm9DZWxsID0gKHByb3BzOiBLZXJuZWxJbmZvKSA9PiB7XG4gIGNvbnN0IHsgZGlzcGxheU5hbWUsIGtlcm5lbFNwZWMgfSA9IHByb3BzLnZhbHVlO1xuICByZXR1cm4gKFxuICAgIDxhXG4gICAgICBjbGFzc05hbWU9XCJpY29uXCJcbiAgICAgIG9uQ2xpY2s9e3Nob3dLZXJuZWxTcGVjLmJpbmQodGhpcywga2VybmVsU3BlYyl9XG4gICAgICB0aXRsZT1cIlNob3cga2VybmVsIHNwZWNcIlxuICAgICAga2V5PXtkaXNwbGF5TmFtZSArIFwia2VybmVsSW5mb1wifVxuICAgID5cbiAgICAgIHtkaXNwbGF5TmFtZX1cbiAgICA8L2E+XG4gICk7XG59O1xuXG4vLyBTZXQgZGVmYXVsdCBwcm9wZXJ0aWVzIG9mIFJlYWN0LVRhYmxlXG5PYmplY3QuYXNzaWduKFJlYWN0VGFibGVEZWZhdWx0cywge1xuICBjbGFzc05hbWU6IFwia2VybmVsLW1vbml0b3JcIixcbiAgc2hvd1BhZ2luYXRpb246IGZhbHNlXG59KTtcbk9iamVjdC5hc3NpZ24oUmVhY3RUYWJsZURlZmF1bHRzLmNvbHVtbiwge1xuICBjbGFzc05hbWU6IFwidGFibGUtY2VsbFwiLFxuICBoZWFkZXJDbGFzc05hbWU6IFwidGFibGUtaGVhZGVyXCIsXG4gIHN0eWxlOiB7IHRleHRBbGlnbjogXCJjZW50ZXJcIiB9XG59KTtcblxuY29uc3QgS2VybmVsTW9uaXRvciA9IG9ic2VydmVyKCh7IHN0b3JlIH06IHsgc3RvcmU6IHN0b3JlIH0pID0+IHtcbiAgaWYgKHN0b3JlLnJ1bm5pbmdLZXJuZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPVwiYmFja2dyb3VuZC1tZXNzYWdlIGNlbnRlcmVkXCI+XG4gICAgICAgIDxsaT5ObyBydW5uaW5nIGtlcm5lbHM8L2xpPlxuICAgICAgPC91bD5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgZGF0YSA9IF8ubWFwKHN0b3JlLnJ1bm5pbmdLZXJuZWxzLCAoa2VybmVsLCBrZXk6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBnYXRld2F5OiBrZXJuZWwudHJhbnNwb3J0LmdhdGV3YXlOYW1lIHx8IFwiTG9jYWxcIixcbiAgICAgIGtlcm5lbEluZm86IHtcbiAgICAgICAgZGlzcGxheU5hbWU6IGtlcm5lbC5kaXNwbGF5TmFtZSxcbiAgICAgICAga2VybmVsU3BlYzoga2VybmVsLmtlcm5lbFNwZWNcbiAgICAgIH0sXG4gICAgICBzdGF0dXM6IGtlcm5lbC5leGVjdXRpb25TdGF0ZSxcbiAgICAgIGV4ZWN1dGlvbkNvdW50OiBrZXJuZWwuZXhlY3V0aW9uQ291bnQsXG4gICAgICBsYXN0RXhlY3V0aW9uVGltZToga2VybmVsLmxhc3RFeGVjdXRpb25UaW1lLFxuICAgICAga2VybmVsS2V5OiB7IGtlcm5lbDoga2VybmVsLCBrZXk6IFN0cmluZyhrZXkpIH0sXG4gICAgICBmaWxlczogc3RvcmUuZ2V0RmlsZXNGb3JLZXJuZWwoa2VybmVsKVxuICAgIH07XG4gIH0pO1xuICBjb25zdCBjb2x1bW5zID0gW1xuICAgIHtcbiAgICAgIEhlYWRlcjogXCJHYXRld2F5XCIsXG4gICAgICBhY2Nlc3NvcjogXCJnYXRld2F5XCIsXG4gICAgICBtYXhXaWR0aDogMTI1XG4gICAgfSxcbiAgICB7XG4gICAgICBIZWFkZXI6IFwiS2VybmVsXCIsXG4gICAgICBhY2Nlc3NvcjogXCJrZXJuZWxJbmZvXCIsXG4gICAgICBDZWxsOiBrZXJuZWxJbmZvQ2VsbCxcbiAgICAgIG1heFdpZHRoOiAxMjVcbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJTdGF0dXNcIixcbiAgICAgIGFjY2Vzc29yOiBcInN0YXR1c1wiLFxuICAgICAgbWF4V2lkdGg6IDEwMFxuICAgIH0sXG4gICAge1xuICAgICAgSGVhZGVyOiBcIkNvdW50XCIsXG4gICAgICBhY2Nlc3NvcjogXCJleGVjdXRpb25Db3VudFwiLFxuICAgICAgbWF4V2lkdGg6IDUwLFxuICAgICAgc3R5bGU6IHsgdGV4dEFsaWduOiBcInJpZ2h0XCIgfVxuICAgIH0sXG4gICAge1xuICAgICAgSGVhZGVyOiBcIkxhc3QgRXhlYyBUaW1lXCIsXG4gICAgICBhY2Nlc3NvcjogXCJsYXN0RXhlY3V0aW9uVGltZVwiLFxuICAgICAgbWF4V2lkdGg6IDEwMCxcbiAgICAgIHN0eWxlOiB7IHRleHRBbGlnbjogXCJyaWdodFwiIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIEhlYWRlcjogXCJNYW5hZ2VtZW50c1wiLFxuICAgICAgYWNjZXNzb3I6IFwia2VybmVsS2V5XCIsXG4gICAgICBDZWxsOiBwcm9wcyA9PiB7XG4gICAgICAgIGNvbnN0IHsga2VybmVsLCBrZXkgfSA9IHByb3BzLnZhbHVlO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uIGljb24temFwXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2ludGVycnVwdC5iaW5kKHRoaXMsIGtlcm5lbCl9XG4gICAgICAgICAgICB0aXRsZT1cIkludGVycnVwdCBrZXJuZWxcIlxuICAgICAgICAgICAga2V5PXtrZXkgKyBcImludGVycnVwdFwifVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIDxhXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJpY29uIGljb24tc3luY1wiXG4gICAgICAgICAgICBvbkNsaWNrPXtyZXN0YXJ0LmJpbmQodGhpcywga2VybmVsKX1cbiAgICAgICAgICAgIHRpdGxlPVwiUmVzdGFydCBrZXJuZWxcIlxuICAgICAgICAgICAga2V5PXtrZXkgKyBcInJlc3RhcnRcIn1cbiAgICAgICAgICAvPixcbiAgICAgICAgICA8YVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRyYXNoY2FuXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3NodXRkb3duLmJpbmQodGhpcywga2VybmVsKX1cbiAgICAgICAgICAgIHRpdGxlPVwiU2h1dGRvd24ga2VybmVsXCJcbiAgICAgICAgICAgIGtleT17a2V5ICsgXCJzaHV0ZG93blwifVxuICAgICAgICAgIC8+XG4gICAgICAgIF07XG4gICAgICB9LFxuICAgICAgd2lkdGg6IDE1MFxuICAgIH0sXG4gICAge1xuICAgICAgSGVhZGVyOiBcIkZpbGVzXCIsXG4gICAgICBhY2Nlc3NvcjogXCJmaWxlc1wiLFxuICAgICAgQ2VsbDogcHJvcHMgPT4ge1xuICAgICAgICByZXR1cm4gcHJvcHMudmFsdWUubWFwKChmaWxlUGF0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBzZXBhcmF0b3IgPSBpbmRleCA9PT0gMCA/IFwiXCIgOiBcIiAgfCAgXCI7XG4gICAgICAgICAgY29uc3QgYm9keSA9IGlzVW5zYXZlZEZpbGVQYXRoKGZpbGVQYXRoKSA/IChcbiAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e29wZW5VbnNhdmVkRWRpdG9yLmJpbmQodGhpcywgZmlsZVBhdGgpfVxuICAgICAgICAgICAgICB0aXRsZT1cIkp1bXAgdG8gZmlsZVwiXG4gICAgICAgICAgICAgIGtleT17ZmlsZVBhdGggKyBcImp1bXBcIn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2ZpbGVQYXRofVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8YVxuICAgICAgICAgICAgICBvbkNsaWNrPXtvcGVuRWRpdG9yLmJpbmQodGhpcywgZmlsZVBhdGgpfVxuICAgICAgICAgICAgICB0aXRsZT1cIkp1bXAgdG8gZmlsZVwiXG4gICAgICAgICAgICAgIGtleT17ZmlsZVBhdGggKyBcImp1bXBcIn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3RpbGRpZnkoZmlsZVBhdGgpfVxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCItd2Via2l0LWlubGluZS1ib3hcIiB9fSBrZXk9e2ZpbGVQYXRofT5cbiAgICAgICAgICAgICAge3NlcGFyYXRvcn1cbiAgICAgICAgICAgICAge2JvZHl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBzdHlsZTogeyB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIiB9XG4gICAgfVxuICBdO1xuXG4gIHJldHVybiA8UmVhY3RUYWJsZSBkYXRhPXtkYXRhfSBjb2x1bW5zPXtjb2x1bW5zfSAvPjtcbn0pO1xuXG5LZXJuZWxNb25pdG9yLmRpc3BsYXlOYW1lID0gXCJLZXJuZWxNb25pdG9yXCI7XG5leHBvcnQgZGVmYXVsdCBLZXJuZWxNb25pdG9yO1xuIl19