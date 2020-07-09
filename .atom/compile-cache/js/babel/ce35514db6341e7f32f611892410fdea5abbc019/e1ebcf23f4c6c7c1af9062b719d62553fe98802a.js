Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jmp = require("jmp");

var _uuidV4 = require("uuid/v4");

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _spawnteract = require("spawnteract");

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _kernelTransport = require("./kernel-transport");

var _kernelTransport2 = _interopRequireDefault(_kernelTransport);

var _utils = require("./utils");

var ZMQKernel = (function (_KernelTransport) {
  _inherits(ZMQKernel, _KernelTransport);

  function ZMQKernel(kernelSpec, grammar, options, onStarted) {
    var _this = this;

    _classCallCheck(this, ZMQKernel);

    _get(Object.getPrototypeOf(ZMQKernel.prototype), "constructor", this).call(this, kernelSpec, grammar);
    this.executionCallbacks = {};
    this.options = options || {};
    // Otherwise spawnteract deletes the file and hydrogen's restart kernel fails
    options.cleanupConnectionFile = false;

    (0, _spawnteract.launchSpec)(kernelSpec, options).then(function (_ref) {
      var config = _ref.config;
      var connectionFile = _ref.connectionFile;
      var spawn = _ref.spawn;

      _this.connection = config;
      _this.connectionFile = connectionFile;
      _this.kernelProcess = spawn;

      _this.monitorNotifications(spawn);

      _this.connect(function () {
        _this._executeStartupCode();

        if (onStarted) onStarted(_this);
      });
    });
  }

  _createClass(ZMQKernel, [{
    key: "connect",
    value: function connect(done) {
      var scheme = this.connection.signature_scheme.slice("hmac-".length);
      var key = this.connection.key;

      this.shellSocket = new _jmp.Socket("dealer", scheme, key);
      this.stdinSocket = new _jmp.Socket("dealer", scheme, key);
      this.ioSocket = new _jmp.Socket("sub", scheme, key);

      var id = (0, _uuidV42["default"])();
      this.shellSocket.identity = "dealer" + id;
      this.stdinSocket.identity = "dealer" + id;
      this.ioSocket.identity = "sub" + id;

      var address = this.connection.transport + "://" + this.connection.ip + ":";
      this.shellSocket.connect(address + this.connection.shell_port);
      this.ioSocket.connect(address + this.connection.iopub_port);
      this.ioSocket.subscribe("");
      this.stdinSocket.connect(address + this.connection.stdin_port);

      this.shellSocket.on("message", this.onShellMessage.bind(this));
      this.ioSocket.on("message", this.onIOMessage.bind(this));
      this.stdinSocket.on("message", this.onStdinMessage.bind(this));

      this.monitor(done);
    }
  }, {
    key: "monitorNotifications",
    value: function monitorNotifications(childProcess) {
      var _this2 = this;

      childProcess.stdout.on("data", function (data) {
        data = data.toString();

        if (atom.config.get("Hydrogen.kernelNotifications")) {
          atom.notifications.addInfo(_this2.kernelSpec.display_name, {
            description: data,
            dismissable: true
          });
        } else {
          (0, _utils.log)("ZMQKernel: stdout:", data);
        }
      });

      childProcess.stderr.on("data", function (data) {
        atom.notifications.addError(_this2.kernelSpec.display_name, {
          description: data.toString(),
          dismissable: true
        });
      });
    }
  }, {
    key: "monitor",
    value: function monitor(done) {
      var _this3 = this;

      try {
        (function () {
          var socketNames = ["shellSocket", "ioSocket"];

          var waitGroup = socketNames.length;

          var onConnect = function onConnect(_ref2) {
            var socketName = _ref2.socketName;
            var socket = _ref2.socket;

            (0, _utils.log)("ZMQKernel: " + socketName + " connected");
            socket.unmonitor();

            waitGroup--;
            if (waitGroup === 0) {
              (0, _utils.log)("ZMQKernel: all main sockets connected");
              _this3.setExecutionState("idle");
              if (done) done();
            }
          };

          var monitor = function monitor(socketName, socket) {
            (0, _utils.log)("ZMQKernel: monitor " + socketName);
            socket.on("connect", onConnect.bind(_this3, { socketName: socketName, socket: socket }));
            socket.monitor();
          };

          monitor("shellSocket", _this3.shellSocket);
          monitor("ioSocket", _this3.ioSocket);
        })();
      } catch (err) {
        console.error("ZMQKernel:", err);
      }
    }
  }, {
    key: "interrupt",
    value: function interrupt() {
      if (process.platform === "win32") {
        atom.notifications.addWarning("Cannot interrupt this kernel", {
          detail: "Kernel interruption is currently not supported in Windows."
        });
      } else {
        (0, _utils.log)("ZMQKernel: sending SIGINT");
        this.kernelProcess.kill("SIGINT");
      }
    }
  }, {
    key: "_kill",
    value: function _kill() {
      (0, _utils.log)("ZMQKernel: sending SIGKILL");
      this.kernelProcess.kill("SIGKILL");
    }
  }, {
    key: "_executeStartupCode",
    value: function _executeStartupCode() {
      var displayName = this.kernelSpec.display_name;
      var startupCode = _config2["default"].getJson("startupCode")[displayName];
      if (startupCode) {
        (0, _utils.log)("KernelManager: Executing startup code:", startupCode);
        startupCode += "\n";
        this.execute(startupCode, function (message, channel) {});
      }
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this._socketShutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      this._socketRestart(onRestarted);
    }
  }, {
    key: "_socketShutdown",
    value: function _socketShutdown() {
      var restart = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      var requestId = "shutdown_" + (0, _uuidV42["default"])();
      var message = this._createMessage("shutdown_request", requestId);

      message.content = { restart: restart };

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "_socketRestart",
    value: function _socketRestart(onRestarted) {
      var _this4 = this;

      if (this.executionState === "restarting") {
        return;
      }
      this.setExecutionState("restarting");
      this._socketShutdown(true);
      this._kill();

      var _launchSpecFromConnectionInfo = (0, _spawnteract.launchSpecFromConnectionInfo)(this.kernelSpec, this.connection, this.connectionFile, this.options);

      var spawn = _launchSpecFromConnectionInfo.spawn;

      this.kernelProcess = spawn;
      this.monitor(function () {
        _this4._executeStartupCode();
        if (onRestarted) onRestarted();
      });
    }

    // onResults is a callback that may be called multiple times
    // as results come in from the kernel
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      (0, _utils.log)("ZMQKernel.execute:", code);
      var requestId = "execute_" + (0, _uuidV42["default"])();

      var message = this._createMessage("execute_request", requestId);

      message.content = {
        code: code,
        silent: false,
        store_history: true,
        user_expressions: {},
        allow_stdin: true
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      (0, _utils.log)("ZMQKernel.complete:", code);

      var requestId = "complete_" + (0, _uuidV42["default"])();

      var message = this._createMessage("complete_request", requestId);

      message.content = {
        code: code,
        text: code,
        line: code,
        cursor_pos: (0, _utils.js_idx_to_char_idx)(code.length, code)
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      (0, _utils.log)("ZMQKernel.inspect:", code, cursorPos);

      var requestId = "inspect_" + (0, _uuidV42["default"])();

      var message = this._createMessage("inspect_request", requestId);

      message.content = {
        code: code,
        cursor_pos: cursorPos,
        detail_level: 0
      };

      this.executionCallbacks[requestId] = onResults;

      this.shellSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      var requestId = "input_reply_" + (0, _uuidV42["default"])();

      var message = this._createMessage("input_reply", requestId);

      message.content = { value: input };

      this.stdinSocket.send(new _jmp.Message(message));
    }
  }, {
    key: "onShellMessage",
    value: function onShellMessage(message) {
      (0, _utils.log)("shell message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (callback) {
        callback(message, "shell");
      }
    }
  }, {
    key: "onStdinMessage",
    value: function onStdinMessage(message) {
      (0, _utils.log)("stdin message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      // input_request messages are attributable to particular execution requests,
      // and should pass through the middleware stack to allow plugins to see them
      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (callback) {
        callback(message, "stdin");
      }
    }
  }, {
    key: "onIOMessage",
    value: function onIOMessage(message) {
      (0, _utils.log)("IO message:", message);

      if (!this._isValidMessage(message)) {
        return;
      }

      var msg_type = message.header.msg_type;

      if (msg_type === "status") {
        var _status = message.content.execution_state;
        this.setExecutionState(_status);
      }

      var msg_id = message.parent_header.msg_id;

      var callback = undefined;
      if (msg_id) {
        callback = this.executionCallbacks[msg_id];
      }

      if (callback) {
        callback(message, "iopub");
      }
    }
  }, {
    key: "_isValidMessage",
    value: function _isValidMessage(message) {
      if (!message) {
        (0, _utils.log)("Invalid message: null");
        return false;
      }

      if (!message.content) {
        (0, _utils.log)("Invalid message: Missing content");
        return false;
      }

      if (message.content.execution_state === "starting") {
        // Kernels send a starting status message with an empty parent_header
        (0, _utils.log)("Dropped starting status IO message");
        return false;
      }

      if (!message.parent_header) {
        (0, _utils.log)("Invalid message: Missing parent_header");
        return false;
      }

      if (!message.parent_header.msg_id) {
        (0, _utils.log)("Invalid message: Missing parent_header.msg_id");
        return false;
      }

      if (!message.parent_header.msg_type) {
        (0, _utils.log)("Invalid message: Missing parent_header.msg_type");
        return false;
      }

      if (!message.header) {
        (0, _utils.log)("Invalid message: Missing header");
        return false;
      }

      if (!message.header.msg_id) {
        (0, _utils.log)("Invalid message: Missing header.msg_id");
        return false;
      }

      if (!message.header.msg_type) {
        (0, _utils.log)("Invalid message: Missing header.msg_type");
        return false;
      }

      return true;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("ZMQKernel: destroy:", this);

      this.shutdown();

      this._kill();
      _fs2["default"].unlinkSync(this.connectionFile);

      this.shellSocket.close();
      this.ioSocket.close();
      this.stdinSocket.close();

      _get(Object.getPrototypeOf(ZMQKernel.prototype), "destroy", this).call(this);
    }
  }, {
    key: "_getUsername",
    value: function _getUsername() {
      return process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
    }
  }, {
    key: "_createMessage",
    value: function _createMessage(msgType) {
      var msgId = arguments.length <= 1 || arguments[1] === undefined ? (0, _uuidV42["default"])() : arguments[1];

      var message = {
        header: {
          username: this._getUsername(),
          session: "00000000-0000-0000-0000-000000000000",
          msg_type: msgType,
          msg_id: msgId,
          date: new Date(),
          version: "5.0"
        },
        metadata: {},
        parent_header: {},
        content: {}
      };

      return message;
    }
  }]);

  return ZMQKernel;
})(_kernelTransport2["default"]);

exports["default"] = ZMQKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi96bXEta2VybmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7bUJBQ2EsS0FBSzs7c0JBQ3RCLFNBQVM7Ozs7MkJBQ2lDLGFBQWE7O3NCQUVuRCxVQUFVOzs7OytCQUNELG9CQUFvQjs7OztxQkFFUixTQUFTOztJQWU1QixTQUFTO1lBQVQsU0FBUzs7QUFXakIsV0FYUSxTQUFTLENBWTFCLFVBQXNCLEVBQ3RCLE9BQXFCLEVBQ3JCLE9BQWUsRUFDZixTQUFvQixFQUNwQjs7OzBCQWhCaUIsU0FBUzs7QUFpQjFCLCtCQWpCaUIsU0FBUyw2Q0FpQnBCLFVBQVUsRUFBRSxPQUFPLEVBQUU7U0FoQjdCLGtCQUFrQixHQUFXLEVBQUU7QUFpQjdCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQzs7QUFFN0IsV0FBTyxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQzs7QUFFdEMsaUNBQVcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDbEMsVUFBQyxJQUFpQyxFQUFLO1VBQXBDLE1BQU0sR0FBUixJQUFpQyxDQUEvQixNQUFNO1VBQUUsY0FBYyxHQUF4QixJQUFpQyxDQUF2QixjQUFjO1VBQUUsS0FBSyxHQUEvQixJQUFpQyxDQUFQLEtBQUs7O0FBQzlCLFlBQUssVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUN6QixZQUFLLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDckMsWUFBSyxhQUFhLEdBQUcsS0FBSyxDQUFDOztBQUUzQixZQUFLLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVqQyxZQUFLLE9BQU8sQ0FBQyxZQUFNO0FBQ2pCLGNBQUssbUJBQW1CLEVBQUUsQ0FBQzs7QUFFM0IsWUFBSSxTQUFTLEVBQUUsU0FBUyxPQUFNLENBQUM7T0FDaEMsQ0FBQyxDQUFDO0tBQ0osQ0FDRixDQUFD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QUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2Isc0JBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN6QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRXpCLGlDQXJYaUIsU0FBUyx5Q0FxWFY7S0FDakI7OztXQUVXLHdCQUFHO0FBQ2IsYUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FDcEI7S0FDSDs7O1dBRWEsd0JBQUMsT0FBZSxFQUF3QjtVQUF0QixLQUFhLHlEQUFHLDBCQUFJOztBQUNsRCxVQUFNLE9BQU8sR0FBRztBQUNkLGNBQU0sRUFBRTtBQUNOLGtCQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRTtBQUM3QixpQkFBTyxFQUFFLHNDQUFzQztBQUMvQyxrQkFBUSxFQUFFLE9BQU87QUFDakIsZ0JBQU0sRUFBRSxLQUFLO0FBQ2IsY0FBSSxFQUFFLElBQUksSUFBSSxFQUFFO0FBQ2hCLGlCQUFPLEVBQUUsS0FBSztTQUNmO0FBQ0QsZ0JBQVEsRUFBRSxFQUFFO0FBQ1oscUJBQWEsRUFBRSxFQUFFO0FBQ2pCLGVBQU8sRUFBRSxFQUFFO09BQ1osQ0FBQzs7QUFFRixhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBalprQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvem1xLWtlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IE1lc3NhZ2UsIFNvY2tldCB9IGZyb20gXCJqbXBcIjtcbmltcG9ydCB2NCBmcm9tIFwidXVpZC92NFwiO1xuaW1wb3J0IHsgbGF1bmNoU3BlYywgbGF1bmNoU3BlY0Zyb21Db25uZWN0aW9uSW5mbyB9IGZyb20gXCJzcGF3bnRlcmFjdFwiO1xuXG5pbXBvcnQgQ29uZmlnIGZyb20gXCIuL2NvbmZpZ1wiO1xuaW1wb3J0IEtlcm5lbFRyYW5zcG9ydCBmcm9tIFwiLi9rZXJuZWwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgdHlwZSB7IFJlc3VsdHNDYWxsYmFjayB9IGZyb20gXCIuL2tlcm5lbC10cmFuc3BvcnRcIjtcbmltcG9ydCB7IGxvZywganNfaWR4X3RvX2NoYXJfaWR4IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IHR5cGUgQ29ubmVjdGlvbiA9IHtcbiAgY29udHJvbF9wb3J0OiBudW1iZXIsXG4gIGhiX3BvcnQ6IG51bWJlcixcbiAgaW9wdWJfcG9ydDogbnVtYmVyLFxuICBpcDogc3RyaW5nLFxuICBrZXk6IHN0cmluZyxcbiAgc2hlbGxfcG9ydDogbnVtYmVyLFxuICBzaWduYXR1cmVfc2NoZW1lOiBzdHJpbmcsXG4gIHN0ZGluX3BvcnQ6IG51bWJlcixcbiAgdHJhbnNwb3J0OiBzdHJpbmcsXG4gIHZlcnNpb246IG51bWJlclxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWk1RS2VybmVsIGV4dGVuZHMgS2VybmVsVHJhbnNwb3J0IHtcbiAgZXhlY3V0aW9uQ2FsbGJhY2tzOiBPYmplY3QgPSB7fTtcbiAgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgY29ubmVjdGlvbkZpbGU6IHN0cmluZztcbiAga2VybmVsUHJvY2VzczogY2hpbGRfcHJvY2VzcyRDaGlsZFByb2Nlc3M7XG4gIG9wdGlvbnM6IE9iamVjdDtcblxuICBzaGVsbFNvY2tldDogU29ja2V0O1xuICBzdGRpblNvY2tldDogU29ja2V0O1xuICBpb1NvY2tldDogU29ja2V0O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMsXG4gICAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyLFxuICAgIG9wdGlvbnM6IE9iamVjdCxcbiAgICBvblN0YXJ0ZWQ6ID9GdW5jdGlvblxuICApIHtcbiAgICBzdXBlcihrZXJuZWxTcGVjLCBncmFtbWFyKTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIC8vIE90aGVyd2lzZSBzcGF3bnRlcmFjdCBkZWxldGVzIHRoZSBmaWxlIGFuZCBoeWRyb2dlbidzIHJlc3RhcnQga2VybmVsIGZhaWxzXG4gICAgb3B0aW9ucy5jbGVhbnVwQ29ubmVjdGlvbkZpbGUgPSBmYWxzZTtcblxuICAgIGxhdW5jaFNwZWMoa2VybmVsU3BlYywgb3B0aW9ucykudGhlbihcbiAgICAgICh7IGNvbmZpZywgY29ubmVjdGlvbkZpbGUsIHNwYXduIH0pID0+IHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uID0gY29uZmlnO1xuICAgICAgICB0aGlzLmNvbm5lY3Rpb25GaWxlID0gY29ubmVjdGlvbkZpbGU7XG4gICAgICAgIHRoaXMua2VybmVsUHJvY2VzcyA9IHNwYXduO1xuXG4gICAgICAgIHRoaXMubW9uaXRvck5vdGlmaWNhdGlvbnMoc3Bhd24pO1xuXG4gICAgICAgIHRoaXMuY29ubmVjdCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZXhlY3V0ZVN0YXJ0dXBDb2RlKCk7XG5cbiAgICAgICAgICBpZiAob25TdGFydGVkKSBvblN0YXJ0ZWQodGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBjb25uZWN0KGRvbmU6ID9GdW5jdGlvbikge1xuICAgIGNvbnN0IHNjaGVtZSA9IHRoaXMuY29ubmVjdGlvbi5zaWduYXR1cmVfc2NoZW1lLnNsaWNlKFwiaG1hYy1cIi5sZW5ndGgpO1xuICAgIGNvbnN0IHsga2V5IH0gPSB0aGlzLmNvbm5lY3Rpb247XG5cbiAgICB0aGlzLnNoZWxsU29ja2V0ID0gbmV3IFNvY2tldChcImRlYWxlclwiLCBzY2hlbWUsIGtleSk7XG4gICAgdGhpcy5zdGRpblNvY2tldCA9IG5ldyBTb2NrZXQoXCJkZWFsZXJcIiwgc2NoZW1lLCBrZXkpO1xuICAgIHRoaXMuaW9Tb2NrZXQgPSBuZXcgU29ja2V0KFwic3ViXCIsIHNjaGVtZSwga2V5KTtcblxuICAgIGNvbnN0IGlkID0gdjQoKTtcbiAgICB0aGlzLnNoZWxsU29ja2V0LmlkZW50aXR5ID0gYGRlYWxlciR7aWR9YDtcbiAgICB0aGlzLnN0ZGluU29ja2V0LmlkZW50aXR5ID0gYGRlYWxlciR7aWR9YDtcbiAgICB0aGlzLmlvU29ja2V0LmlkZW50aXR5ID0gYHN1YiR7aWR9YDtcblxuICAgIGNvbnN0IGFkZHJlc3MgPSBgJHt0aGlzLmNvbm5lY3Rpb24udHJhbnNwb3J0fTovLyR7dGhpcy5jb25uZWN0aW9uLmlwfTpgO1xuICAgIHRoaXMuc2hlbGxTb2NrZXQuY29ubmVjdChhZGRyZXNzICsgdGhpcy5jb25uZWN0aW9uLnNoZWxsX3BvcnQpO1xuICAgIHRoaXMuaW9Tb2NrZXQuY29ubmVjdChhZGRyZXNzICsgdGhpcy5jb25uZWN0aW9uLmlvcHViX3BvcnQpO1xuICAgIHRoaXMuaW9Tb2NrZXQuc3Vic2NyaWJlKFwiXCIpO1xuICAgIHRoaXMuc3RkaW5Tb2NrZXQuY29ubmVjdChhZGRyZXNzICsgdGhpcy5jb25uZWN0aW9uLnN0ZGluX3BvcnQpO1xuXG4gICAgdGhpcy5zaGVsbFNvY2tldC5vbihcIm1lc3NhZ2VcIiwgdGhpcy5vblNoZWxsTWVzc2FnZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmlvU29ja2V0Lm9uKFwibWVzc2FnZVwiLCB0aGlzLm9uSU9NZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuc3RkaW5Tb2NrZXQub24oXCJtZXNzYWdlXCIsIHRoaXMub25TdGRpbk1lc3NhZ2UuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLm1vbml0b3IoZG9uZSk7XG4gIH1cblxuICBtb25pdG9yTm90aWZpY2F0aW9ucyhjaGlsZFByb2Nlc3M6IGNoaWxkX3Byb2Nlc3MkQ2hpbGRQcm9jZXNzKSB7XG4gICAgY2hpbGRQcm9jZXNzLnN0ZG91dC5vbihcImRhdGFcIiwgKGRhdGE6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xuICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcblxuICAgICAgaWYgKGF0b20uY29uZmlnLmdldChcIkh5ZHJvZ2VuLmtlcm5lbE5vdGlmaWNhdGlvbnNcIikpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8odGhpcy5rZXJuZWxTcGVjLmRpc3BsYXlfbmFtZSwge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiBkYXRhLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nKFwiWk1RS2VybmVsOiBzdGRvdXQ6XCIsIGRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2hpbGRQcm9jZXNzLnN0ZGVyci5vbihcImRhdGFcIiwgKGRhdGE6IHN0cmluZyB8IEJ1ZmZlcikgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMua2VybmVsU3BlYy5kaXNwbGF5X25hbWUsIHtcbiAgICAgICAgZGVzY3JpcHRpb246IGRhdGEudG9TdHJpbmcoKSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgbW9uaXRvcihkb25lOiA/RnVuY3Rpb24pIHtcbiAgICB0cnkge1xuICAgICAgbGV0IHNvY2tldE5hbWVzID0gW1wic2hlbGxTb2NrZXRcIiwgXCJpb1NvY2tldFwiXTtcblxuICAgICAgbGV0IHdhaXRHcm91cCA9IHNvY2tldE5hbWVzLmxlbmd0aDtcblxuICAgICAgY29uc3Qgb25Db25uZWN0ID0gKHsgc29ja2V0TmFtZSwgc29ja2V0IH0pID0+IHtcbiAgICAgICAgbG9nKFwiWk1RS2VybmVsOiBcIiArIHNvY2tldE5hbWUgKyBcIiBjb25uZWN0ZWRcIik7XG4gICAgICAgIHNvY2tldC51bm1vbml0b3IoKTtcblxuICAgICAgICB3YWl0R3JvdXAtLTtcbiAgICAgICAgaWYgKHdhaXRHcm91cCA9PT0gMCkge1xuICAgICAgICAgIGxvZyhcIlpNUUtlcm5lbDogYWxsIG1haW4gc29ja2V0cyBjb25uZWN0ZWRcIik7XG4gICAgICAgICAgdGhpcy5zZXRFeGVjdXRpb25TdGF0ZShcImlkbGVcIik7XG4gICAgICAgICAgaWYgKGRvbmUpIGRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgbW9uaXRvciA9IChzb2NrZXROYW1lLCBzb2NrZXQpID0+IHtcbiAgICAgICAgbG9nKFwiWk1RS2VybmVsOiBtb25pdG9yIFwiICsgc29ja2V0TmFtZSk7XG4gICAgICAgIHNvY2tldC5vbihcImNvbm5lY3RcIiwgb25Db25uZWN0LmJpbmQodGhpcywgeyBzb2NrZXROYW1lLCBzb2NrZXQgfSkpO1xuICAgICAgICBzb2NrZXQubW9uaXRvcigpO1xuICAgICAgfTtcblxuICAgICAgbW9uaXRvcihcInNoZWxsU29ja2V0XCIsIHRoaXMuc2hlbGxTb2NrZXQpO1xuICAgICAgbW9uaXRvcihcImlvU29ja2V0XCIsIHRoaXMuaW9Tb2NrZXQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcIlpNUUtlcm5lbDpcIiwgZXJyKTtcbiAgICB9XG4gIH1cblxuICBpbnRlcnJ1cHQoKSB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJDYW5ub3QgaW50ZXJydXB0IHRoaXMga2VybmVsXCIsIHtcbiAgICAgICAgZGV0YWlsOiBcIktlcm5lbCBpbnRlcnJ1cHRpb24gaXMgY3VycmVudGx5IG5vdCBzdXBwb3J0ZWQgaW4gV2luZG93cy5cIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZyhcIlpNUUtlcm5lbDogc2VuZGluZyBTSUdJTlRcIik7XG4gICAgICB0aGlzLmtlcm5lbFByb2Nlc3Mua2lsbChcIlNJR0lOVFwiKTtcbiAgICB9XG4gIH1cblxuICBfa2lsbCgpIHtcbiAgICBsb2coXCJaTVFLZXJuZWw6IHNlbmRpbmcgU0lHS0lMTFwiKTtcbiAgICB0aGlzLmtlcm5lbFByb2Nlc3Mua2lsbChcIlNJR0tJTExcIik7XG4gIH1cblxuICBfZXhlY3V0ZVN0YXJ0dXBDb2RlKCkge1xuICAgIGNvbnN0IGRpc3BsYXlOYW1lID0gdGhpcy5rZXJuZWxTcGVjLmRpc3BsYXlfbmFtZTtcbiAgICBsZXQgc3RhcnR1cENvZGUgPSBDb25maWcuZ2V0SnNvbihcInN0YXJ0dXBDb2RlXCIpW2Rpc3BsYXlOYW1lXTtcbiAgICBpZiAoc3RhcnR1cENvZGUpIHtcbiAgICAgIGxvZyhcIktlcm5lbE1hbmFnZXI6IEV4ZWN1dGluZyBzdGFydHVwIGNvZGU6XCIsIHN0YXJ0dXBDb2RlKTtcbiAgICAgIHN0YXJ0dXBDb2RlICs9IFwiXFxuXCI7XG4gICAgICB0aGlzLmV4ZWN1dGUoc3RhcnR1cENvZGUsIChtZXNzYWdlLCBjaGFubmVsKSA9PiB7fSk7XG4gICAgfVxuICB9XG5cbiAgc2h1dGRvd24oKSB7XG4gICAgdGhpcy5fc29ja2V0U2h1dGRvd24oKTtcbiAgfVxuXG4gIHJlc3RhcnQob25SZXN0YXJ0ZWQ6ID9GdW5jdGlvbikge1xuICAgIHRoaXMuX3NvY2tldFJlc3RhcnQob25SZXN0YXJ0ZWQpO1xuICB9XG5cbiAgX3NvY2tldFNodXRkb3duKHJlc3RhcnQ6ID9ib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCByZXF1ZXN0SWQgPSBgc2h1dGRvd25fJHt2NCgpfWA7XG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJzaHV0ZG93bl9yZXF1ZXN0XCIsIHJlcXVlc3RJZCk7XG5cbiAgICBtZXNzYWdlLmNvbnRlbnQgPSB7IHJlc3RhcnQgfTtcblxuICAgIHRoaXMuc2hlbGxTb2NrZXQuc2VuZChuZXcgTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBfc29ja2V0UmVzdGFydChvblJlc3RhcnRlZDogP0Z1bmN0aW9uKSB7XG4gICAgaWYgKHRoaXMuZXhlY3V0aW9uU3RhdGUgPT09IFwicmVzdGFydGluZ1wiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2V0RXhlY3V0aW9uU3RhdGUoXCJyZXN0YXJ0aW5nXCIpO1xuICAgIHRoaXMuX3NvY2tldFNodXRkb3duKHRydWUpO1xuICAgIHRoaXMuX2tpbGwoKTtcbiAgICBjb25zdCB7IHNwYXduIH0gPSBsYXVuY2hTcGVjRnJvbUNvbm5lY3Rpb25JbmZvKFxuICAgICAgdGhpcy5rZXJuZWxTcGVjLFxuICAgICAgdGhpcy5jb25uZWN0aW9uLFxuICAgICAgdGhpcy5jb25uZWN0aW9uRmlsZSxcbiAgICAgIHRoaXMub3B0aW9uc1xuICAgICk7XG4gICAgdGhpcy5rZXJuZWxQcm9jZXNzID0gc3Bhd247XG4gICAgdGhpcy5tb25pdG9yKCgpID0+IHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVTdGFydHVwQ29kZSgpO1xuICAgICAgaWYgKG9uUmVzdGFydGVkKSBvblJlc3RhcnRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gb25SZXN1bHRzIGlzIGEgY2FsbGJhY2sgdGhhdCBtYXkgYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzXG4gIC8vIGFzIHJlc3VsdHMgY29tZSBpbiBmcm9tIHRoZSBrZXJuZWxcbiAgZXhlY3V0ZShjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrKSB7XG4gICAgbG9nKFwiWk1RS2VybmVsLmV4ZWN1dGU6XCIsIGNvZGUpO1xuICAgIGNvbnN0IHJlcXVlc3RJZCA9IGBleGVjdXRlXyR7djQoKX1gO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJleGVjdXRlX3JlcXVlc3RcIiwgcmVxdWVzdElkKTtcblxuICAgIG1lc3NhZ2UuY29udGVudCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgc3RvcmVfaGlzdG9yeTogdHJ1ZSxcbiAgICAgIHVzZXJfZXhwcmVzc2lvbnM6IHt9LFxuICAgICAgYWxsb3dfc3RkaW46IHRydWVcbiAgICB9O1xuXG4gICAgdGhpcy5leGVjdXRpb25DYWxsYmFja3NbcmVxdWVzdElkXSA9IG9uUmVzdWx0cztcblxuICAgIHRoaXMuc2hlbGxTb2NrZXQuc2VuZChuZXcgTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBjb21wbGV0ZShjb2RlOiBzdHJpbmcsIG9uUmVzdWx0czogUmVzdWx0c0NhbGxiYWNrKSB7XG4gICAgbG9nKFwiWk1RS2VybmVsLmNvbXBsZXRlOlwiLCBjb2RlKTtcblxuICAgIGNvbnN0IHJlcXVlc3RJZCA9IGBjb21wbGV0ZV8ke3Y0KCl9YDtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9jcmVhdGVNZXNzYWdlKFwiY29tcGxldGVfcmVxdWVzdFwiLCByZXF1ZXN0SWQpO1xuXG4gICAgbWVzc2FnZS5jb250ZW50ID0ge1xuICAgICAgY29kZSxcbiAgICAgIHRleHQ6IGNvZGUsXG4gICAgICBsaW5lOiBjb2RlLFxuICAgICAgY3Vyc29yX3BvczoganNfaWR4X3RvX2NoYXJfaWR4KGNvZGUubGVuZ3RoLCBjb2RlKVxuICAgIH07XG5cbiAgICB0aGlzLmV4ZWN1dGlvbkNhbGxiYWNrc1tyZXF1ZXN0SWRdID0gb25SZXN1bHRzO1xuXG4gICAgdGhpcy5zaGVsbFNvY2tldC5zZW5kKG5ldyBNZXNzYWdlKG1lc3NhZ2UpKTtcbiAgfVxuXG4gIGluc3BlY3QoY29kZTogc3RyaW5nLCBjdXJzb3JQb3M6IG51bWJlciwgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICBsb2coXCJaTVFLZXJuZWwuaW5zcGVjdDpcIiwgY29kZSwgY3Vyc29yUG9zKTtcblxuICAgIGNvbnN0IHJlcXVlc3RJZCA9IGBpbnNwZWN0XyR7djQoKX1gO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2NyZWF0ZU1lc3NhZ2UoXCJpbnNwZWN0X3JlcXVlc3RcIiwgcmVxdWVzdElkKTtcblxuICAgIG1lc3NhZ2UuY29udGVudCA9IHtcbiAgICAgIGNvZGUsXG4gICAgICBjdXJzb3JfcG9zOiBjdXJzb3JQb3MsXG4gICAgICBkZXRhaWxfbGV2ZWw6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5leGVjdXRpb25DYWxsYmFja3NbcmVxdWVzdElkXSA9IG9uUmVzdWx0cztcblxuICAgIHRoaXMuc2hlbGxTb2NrZXQuc2VuZChuZXcgTWVzc2FnZShtZXNzYWdlKSk7XG4gIH1cblxuICBpbnB1dFJlcGx5KGlucHV0OiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXF1ZXN0SWQgPSBgaW5wdXRfcmVwbHlfJHt2NCgpfWA7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fY3JlYXRlTWVzc2FnZShcImlucHV0X3JlcGx5XCIsIHJlcXVlc3RJZCk7XG5cbiAgICBtZXNzYWdlLmNvbnRlbnQgPSB7IHZhbHVlOiBpbnB1dCB9O1xuXG4gICAgdGhpcy5zdGRpblNvY2tldC5zZW5kKG5ldyBNZXNzYWdlKG1lc3NhZ2UpKTtcbiAgfVxuXG4gIG9uU2hlbGxNZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICBsb2coXCJzaGVsbCBtZXNzYWdlOlwiLCBtZXNzYWdlKTtcblxuICAgIGlmICghdGhpcy5faXNWYWxpZE1lc3NhZ2UobWVzc2FnZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1zZ19pZCB9ID0gbWVzc2FnZS5wYXJlbnRfaGVhZGVyO1xuICAgIGxldCBjYWxsYmFjaztcbiAgICBpZiAobXNnX2lkKSB7XG4gICAgICBjYWxsYmFjayA9IHRoaXMuZXhlY3V0aW9uQ2FsbGJhY2tzW21zZ19pZF07XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhtZXNzYWdlLCBcInNoZWxsXCIpO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RkaW5NZXNzYWdlKG1lc3NhZ2U6IE1lc3NhZ2UpIHtcbiAgICBsb2coXCJzdGRpbiBtZXNzYWdlOlwiLCBtZXNzYWdlKTtcblxuICAgIGlmICghdGhpcy5faXNWYWxpZE1lc3NhZ2UobWVzc2FnZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpbnB1dF9yZXF1ZXN0IG1lc3NhZ2VzIGFyZSBhdHRyaWJ1dGFibGUgdG8gcGFydGljdWxhciBleGVjdXRpb24gcmVxdWVzdHMsXG4gICAgLy8gYW5kIHNob3VsZCBwYXNzIHRocm91Z2ggdGhlIG1pZGRsZXdhcmUgc3RhY2sgdG8gYWxsb3cgcGx1Z2lucyB0byBzZWUgdGhlbVxuICAgIGNvbnN0IHsgbXNnX2lkIH0gPSBtZXNzYWdlLnBhcmVudF9oZWFkZXI7XG4gICAgbGV0IGNhbGxiYWNrO1xuICAgIGlmIChtc2dfaWQpIHtcbiAgICAgIGNhbGxiYWNrID0gdGhpcy5leGVjdXRpb25DYWxsYmFja3NbbXNnX2lkXTtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKG1lc3NhZ2UsIFwic3RkaW5cIik7XG4gICAgfVxuICB9XG5cbiAgb25JT01lc3NhZ2UobWVzc2FnZTogTWVzc2FnZSkge1xuICAgIGxvZyhcIklPIG1lc3NhZ2U6XCIsIG1lc3NhZ2UpO1xuXG4gICAgaWYgKCF0aGlzLl9pc1ZhbGlkTWVzc2FnZShtZXNzYWdlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbXNnX3R5cGUgfSA9IG1lc3NhZ2UuaGVhZGVyO1xuICAgIGlmIChtc2dfdHlwZSA9PT0gXCJzdGF0dXNcIikge1xuICAgICAgY29uc3Qgc3RhdHVzID0gbWVzc2FnZS5jb250ZW50LmV4ZWN1dGlvbl9zdGF0ZTtcbiAgICAgIHRoaXMuc2V0RXhlY3V0aW9uU3RhdGUoc3RhdHVzKTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG1zZ19pZCB9ID0gbWVzc2FnZS5wYXJlbnRfaGVhZGVyO1xuICAgIGxldCBjYWxsYmFjaztcbiAgICBpZiAobXNnX2lkKSB7XG4gICAgICBjYWxsYmFjayA9IHRoaXMuZXhlY3V0aW9uQ2FsbGJhY2tzW21zZ19pZF07XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhtZXNzYWdlLCBcImlvcHViXCIpO1xuICAgIH1cbiAgfVxuXG4gIF9pc1ZhbGlkTWVzc2FnZShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IG51bGxcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLmNvbnRlbnQpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBjb250ZW50XCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChtZXNzYWdlLmNvbnRlbnQuZXhlY3V0aW9uX3N0YXRlID09PSBcInN0YXJ0aW5nXCIpIHtcbiAgICAgIC8vIEtlcm5lbHMgc2VuZCBhIHN0YXJ0aW5nIHN0YXR1cyBtZXNzYWdlIHdpdGggYW4gZW1wdHkgcGFyZW50X2hlYWRlclxuICAgICAgbG9nKFwiRHJvcHBlZCBzdGFydGluZyBzdGF0dXMgSU8gbWVzc2FnZVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIW1lc3NhZ2UucGFyZW50X2hlYWRlcikge1xuICAgICAgbG9nKFwiSW52YWxpZCBtZXNzYWdlOiBNaXNzaW5nIHBhcmVudF9oZWFkZXJcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLnBhcmVudF9oZWFkZXIubXNnX2lkKSB7XG4gICAgICBsb2coXCJJbnZhbGlkIG1lc3NhZ2U6IE1pc3NpbmcgcGFyZW50X2hlYWRlci5tc2dfaWRcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLnBhcmVudF9oZWFkZXIubXNnX3R5cGUpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBwYXJlbnRfaGVhZGVyLm1zZ190eXBlXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5oZWFkZXIpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBoZWFkZXJcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFtZXNzYWdlLmhlYWRlci5tc2dfaWQpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBoZWFkZXIubXNnX2lkXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghbWVzc2FnZS5oZWFkZXIubXNnX3R5cGUpIHtcbiAgICAgIGxvZyhcIkludmFsaWQgbWVzc2FnZTogTWlzc2luZyBoZWFkZXIubXNnX3R5cGVcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGxvZyhcIlpNUUtlcm5lbDogZGVzdHJveTpcIiwgdGhpcyk7XG5cbiAgICB0aGlzLnNodXRkb3duKCk7XG5cbiAgICB0aGlzLl9raWxsKCk7XG4gICAgZnMudW5saW5rU3luYyh0aGlzLmNvbm5lY3Rpb25GaWxlKTtcblxuICAgIHRoaXMuc2hlbGxTb2NrZXQuY2xvc2UoKTtcbiAgICB0aGlzLmlvU29ja2V0LmNsb3NlKCk7XG4gICAgdGhpcy5zdGRpblNvY2tldC5jbG9zZSgpO1xuXG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgX2dldFVzZXJuYW1lKCkge1xuICAgIHJldHVybiAoXG4gICAgICBwcm9jZXNzLmVudi5MT0dOQU1FIHx8XG4gICAgICBwcm9jZXNzLmVudi5VU0VSIHx8XG4gICAgICBwcm9jZXNzLmVudi5MTkFNRSB8fFxuICAgICAgcHJvY2Vzcy5lbnYuVVNFUk5BTUVcbiAgICApO1xuICB9XG5cbiAgX2NyZWF0ZU1lc3NhZ2UobXNnVHlwZTogc3RyaW5nLCBtc2dJZDogc3RyaW5nID0gdjQoKSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICBoZWFkZXI6IHtcbiAgICAgICAgdXNlcm5hbWU6IHRoaXMuX2dldFVzZXJuYW1lKCksXG4gICAgICAgIHNlc3Npb246IFwiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwXCIsXG4gICAgICAgIG1zZ190eXBlOiBtc2dUeXBlLFxuICAgICAgICBtc2dfaWQ6IG1zZ0lkLFxuICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICB2ZXJzaW9uOiBcIjUuMFwiXG4gICAgICB9LFxuICAgICAgbWV0YWRhdGE6IHt9LFxuICAgICAgcGFyZW50X2hlYWRlcjoge30sXG4gICAgICBjb250ZW50OiB7fVxuICAgIH07XG5cbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxufVxuIl19