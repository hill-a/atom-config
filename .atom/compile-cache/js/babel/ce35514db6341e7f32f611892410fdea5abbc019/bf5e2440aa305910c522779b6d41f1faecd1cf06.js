Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _kernelTransport = require("./kernel-transport");

var _kernelTransport2 = _interopRequireDefault(_kernelTransport);

var _inputView = require("./input-view");

var _inputView2 = _interopRequireDefault(_inputView);

var _utils = require("./utils");

var WSKernel = (function (_KernelTransport) {
  _inherits(WSKernel, _KernelTransport);

  function WSKernel(gatewayName, kernelSpec, grammar, session) {
    var _this = this;

    _classCallCheck(this, WSKernel);

    _get(Object.getPrototypeOf(WSKernel.prototype), "constructor", this).call(this, kernelSpec, grammar);
    this.session = session;
    this.gatewayName = gatewayName;

    this.session.statusChanged.connect(function () {
      return _this.setExecutionState(_this.session.status);
    });
    this.setExecutionState(this.session.status); // Set initial status correctly
  }

  _createClass(WSKernel, [{
    key: "interrupt",
    value: function interrupt() {
      this.session.kernel.interrupt();
    }
  }, {
    key: "shutdown",
    value: function shutdown() {
      this.session.kernel.shutdown();
    }
  }, {
    key: "restart",
    value: function restart(onRestarted) {
      var future = this.session.kernel.restart();
      future.then(function () {
        if (onRestarted) onRestarted();
      });
    }
  }, {
    key: "execute",
    value: function execute(code, onResults) {
      var future = this.session.kernel.requestExecute({ code: code });

      future.onIOPub = function (message) {
        (0, _utils.log)("WSKernel: execute:", message);
        onResults(message, "iopub");
      };

      future.onReply = function (message) {
        return onResults(message, "shell");
      };
      future.onStdin = function (message) {
        return onResults(message, "stdin");
      };
    }
  }, {
    key: "complete",
    value: function complete(code, onResults) {
      this.session.kernel.requestComplete({
        code: code,
        cursor_pos: (0, _utils.js_idx_to_char_idx)(code.length, code)
      }).then(function (message) {
        return onResults(message, "shell");
      });
    }
  }, {
    key: "inspect",
    value: function inspect(code, cursorPos, onResults) {
      this.session.kernel.requestInspect({
        code: code,
        cursor_pos: cursorPos,
        detail_level: 0
      }).then(function (message) {
        return onResults(message, "shell");
      });
    }
  }, {
    key: "inputReply",
    value: function inputReply(input) {
      this.session.kernel.sendInputReply({ value: input });
    }
  }, {
    key: "promptRename",
    value: function promptRename() {
      var _this2 = this;

      var view = new _inputView2["default"]({
        prompt: "Name your current session",
        defaultText: this.session.path,
        allowCancel: true
      }, function (input) {
        return _this2.session.setPath(input);
      });

      view.attach();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _utils.log)("WSKernel: destroying jupyter-js-services Session");
      this.session.dispose();
      _get(Object.getPrototypeOf(WSKernel.prototype), "destroy", this).call(this);
    }
  }]);

  return WSKernel;
})(_kernelTransport2["default"]);

exports["default"] = WSKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi93cy1rZXJuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7K0JBRTRCLG9CQUFvQjs7Ozt5QkFFMUIsY0FBYzs7OztxQkFDSSxTQUFTOztJQUk1QixRQUFRO1lBQVIsUUFBUTs7QUFHaEIsV0FIUSxRQUFRLENBSXpCLFdBQW1CLEVBQ25CLFVBQXNCLEVBQ3RCLE9BQXFCLEVBQ3JCLE9BQWdCLEVBQ2hCOzs7MEJBUmlCLFFBQVE7O0FBU3pCLCtCQVRpQixRQUFRLDZDQVNuQixVQUFVLEVBQUUsT0FBTyxFQUFFO0FBQzNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDOztBQUUvQixRQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7YUFDakMsTUFBSyxpQkFBaUIsQ0FBQyxNQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUM7S0FBQSxDQUM1QyxDQUFDO0FBQ0YsUUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDN0M7O2VBakJrQixRQUFROztXQW1CbEIscUJBQUc7QUFDVixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNqQzs7O1dBRU8sb0JBQUc7QUFDVCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUNoQzs7O1dBRU0saUJBQUMsV0FBc0IsRUFBRTtBQUM5QixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QyxZQUFNLENBQUMsSUFBSSxDQUFDLFlBQU07QUFDaEIsWUFBSSxXQUFXLEVBQUUsV0FBVyxFQUFFLENBQUM7T0FDaEMsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLGlCQUFDLElBQVksRUFBRSxTQUEwQixFQUFFO0FBQ2hELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQyxDQUFDOztBQUU1RCxZQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsT0FBTyxFQUFjO0FBQ3JDLHdCQUFJLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25DLGlCQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzdCLENBQUM7O0FBRUYsWUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLE9BQU87ZUFBYyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztPQUFBLENBQUM7QUFDbkUsWUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFDLE9BQU87ZUFBYyxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztPQUFBLENBQUM7S0FDcEU7OztXQUVPLGtCQUFDLElBQVksRUFBRSxTQUEwQixFQUFFO0FBQ2pELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUNoQixlQUFlLENBQUM7QUFDZixZQUFJLEVBQUosSUFBSTtBQUNKLGtCQUFVLEVBQUUsK0JBQW1CLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO09BQ2xELENBQUMsQ0FDRCxJQUFJLENBQUMsVUFBQyxPQUFPO2VBQWMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDNUQ7OztXQUVNLGlCQUFDLElBQVksRUFBRSxTQUFpQixFQUFFLFNBQTBCLEVBQUU7QUFDbkUsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQ2hCLGNBQWMsQ0FBQztBQUNkLFlBQUksRUFBSixJQUFJO0FBQ0osa0JBQVUsRUFBRSxTQUFTO0FBQ3JCLG9CQUFZLEVBQUUsQ0FBQztPQUNoQixDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQUMsT0FBTztlQUFjLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQzVEOzs7V0FFUyxvQkFBQyxLQUFhLEVBQUU7QUFDeEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7S0FDdEQ7OztXQUVXLHdCQUFHOzs7QUFDYixVQUFNLElBQUksR0FBRywyQkFDWDtBQUNFLGNBQU0sRUFBRSwyQkFBMkI7QUFDbkMsbUJBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDOUIsbUJBQVcsRUFBRSxJQUFJO09BQ2xCLEVBQ0QsVUFBQyxLQUFLO2VBQWEsT0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztPQUFBLENBQy9DLENBQUM7O0FBRUYsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztXQUVNLG1CQUFHO0FBQ1Isc0JBQUksa0RBQWtELENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZCLGlDQXJGaUIsUUFBUSx5Q0FxRlQ7S0FDakI7OztTQXRGa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3dzLWtlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBLZXJuZWxUcmFuc3BvcnQgZnJvbSBcIi4va2VybmVsLXRyYW5zcG9ydFwiO1xuaW1wb3J0IHR5cGUgeyBSZXN1bHRzQ2FsbGJhY2sgfSBmcm9tIFwiLi9rZXJuZWwtdHJhbnNwb3J0XCI7XG5pbXBvcnQgSW5wdXRWaWV3IGZyb20gXCIuL2lucHV0LXZpZXdcIjtcbmltcG9ydCB7IGxvZywganNfaWR4X3RvX2NoYXJfaWR4IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuaW1wb3J0IHR5cGUgeyBTZXNzaW9uIH0gZnJvbSBcIkBqdXB5dGVybGFiL3NlcnZpY2VzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdTS2VybmVsIGV4dGVuZHMgS2VybmVsVHJhbnNwb3J0IHtcbiAgc2Vzc2lvbjogU2Vzc2lvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBnYXRld2F5TmFtZTogc3RyaW5nLFxuICAgIGtlcm5lbFNwZWM6IEtlcm5lbHNwZWMsXG4gICAgZ3JhbW1hcjogYXRvbSRHcmFtbWFyLFxuICAgIHNlc3Npb246IFNlc3Npb25cbiAgKSB7XG4gICAgc3VwZXIoa2VybmVsU3BlYywgZ3JhbW1hcik7XG4gICAgdGhpcy5zZXNzaW9uID0gc2Vzc2lvbjtcbiAgICB0aGlzLmdhdGV3YXlOYW1lID0gZ2F0ZXdheU5hbWU7XG5cbiAgICB0aGlzLnNlc3Npb24uc3RhdHVzQ2hhbmdlZC5jb25uZWN0KCgpID0+XG4gICAgICB0aGlzLnNldEV4ZWN1dGlvblN0YXRlKHRoaXMuc2Vzc2lvbi5zdGF0dXMpXG4gICAgKTtcbiAgICB0aGlzLnNldEV4ZWN1dGlvblN0YXRlKHRoaXMuc2Vzc2lvbi5zdGF0dXMpOyAvLyBTZXQgaW5pdGlhbCBzdGF0dXMgY29ycmVjdGx5XG4gIH1cblxuICBpbnRlcnJ1cHQoKSB7XG4gICAgdGhpcy5zZXNzaW9uLmtlcm5lbC5pbnRlcnJ1cHQoKTtcbiAgfVxuXG4gIHNodXRkb3duKCkge1xuICAgIHRoaXMuc2Vzc2lvbi5rZXJuZWwuc2h1dGRvd24oKTtcbiAgfVxuXG4gIHJlc3RhcnQob25SZXN0YXJ0ZWQ6ID9GdW5jdGlvbikge1xuICAgIGNvbnN0IGZ1dHVyZSA9IHRoaXMuc2Vzc2lvbi5rZXJuZWwucmVzdGFydCgpO1xuICAgIGZ1dHVyZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChvblJlc3RhcnRlZCkgb25SZXN0YXJ0ZWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjaykge1xuICAgIGNvbnN0IGZ1dHVyZSA9IHRoaXMuc2Vzc2lvbi5rZXJuZWwucmVxdWVzdEV4ZWN1dGUoeyBjb2RlIH0pO1xuXG4gICAgZnV0dXJlLm9uSU9QdWIgPSAobWVzc2FnZTogTWVzc2FnZSkgPT4ge1xuICAgICAgbG9nKFwiV1NLZXJuZWw6IGV4ZWN1dGU6XCIsIG1lc3NhZ2UpO1xuICAgICAgb25SZXN1bHRzKG1lc3NhZ2UsIFwiaW9wdWJcIik7XG4gICAgfTtcblxuICAgIGZ1dHVyZS5vblJlcGx5ID0gKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG9uUmVzdWx0cyhtZXNzYWdlLCBcInNoZWxsXCIpO1xuICAgIGZ1dHVyZS5vblN0ZGluID0gKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG9uUmVzdWx0cyhtZXNzYWdlLCBcInN0ZGluXCIpO1xuICB9XG5cbiAgY29tcGxldGUoY29kZTogc3RyaW5nLCBvblJlc3VsdHM6IFJlc3VsdHNDYWxsYmFjaykge1xuICAgIHRoaXMuc2Vzc2lvbi5rZXJuZWxcbiAgICAgIC5yZXF1ZXN0Q29tcGxldGUoe1xuICAgICAgICBjb2RlLFxuICAgICAgICBjdXJzb3JfcG9zOiBqc19pZHhfdG9fY2hhcl9pZHgoY29kZS5sZW5ndGgsIGNvZGUpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG9uUmVzdWx0cyhtZXNzYWdlLCBcInNoZWxsXCIpKTtcbiAgfVxuXG4gIGluc3BlY3QoY29kZTogc3RyaW5nLCBjdXJzb3JQb3M6IG51bWJlciwgb25SZXN1bHRzOiBSZXN1bHRzQ2FsbGJhY2spIHtcbiAgICB0aGlzLnNlc3Npb24ua2VybmVsXG4gICAgICAucmVxdWVzdEluc3BlY3Qoe1xuICAgICAgICBjb2RlLFxuICAgICAgICBjdXJzb3JfcG9zOiBjdXJzb3JQb3MsXG4gICAgICAgIGRldGFpbF9sZXZlbDogMFxuICAgICAgfSlcbiAgICAgIC50aGVuKChtZXNzYWdlOiBNZXNzYWdlKSA9PiBvblJlc3VsdHMobWVzc2FnZSwgXCJzaGVsbFwiKSk7XG4gIH1cblxuICBpbnB1dFJlcGx5KGlucHV0OiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlc3Npb24ua2VybmVsLnNlbmRJbnB1dFJlcGx5KHsgdmFsdWU6IGlucHV0IH0pO1xuICB9XG5cbiAgcHJvbXB0UmVuYW1lKCkge1xuICAgIGNvbnN0IHZpZXcgPSBuZXcgSW5wdXRWaWV3KFxuICAgICAge1xuICAgICAgICBwcm9tcHQ6IFwiTmFtZSB5b3VyIGN1cnJlbnQgc2Vzc2lvblwiLFxuICAgICAgICBkZWZhdWx0VGV4dDogdGhpcy5zZXNzaW9uLnBhdGgsXG4gICAgICAgIGFsbG93Q2FuY2VsOiB0cnVlXG4gICAgICB9LFxuICAgICAgKGlucHV0OiBzdHJpbmcpID0+IHRoaXMuc2Vzc2lvbi5zZXRQYXRoKGlucHV0KVxuICAgICk7XG5cbiAgICB2aWV3LmF0dGFjaCgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBsb2coXCJXU0tlcm5lbDogZGVzdHJveWluZyBqdXB5dGVyLWpzLXNlcnZpY2VzIFNlc3Npb25cIik7XG4gICAgdGhpcy5zZXNzaW9uLmRpc3Bvc2UoKTtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==