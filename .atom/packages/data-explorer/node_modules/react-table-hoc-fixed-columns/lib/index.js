"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "withFixedColumnsStickyPosition", {
  enumerable: true,
  get: function get() {
    return _stickyPosition.default;
  }
});
Object.defineProperty(exports, "withFixedColumnsScrollEvent", {
  enumerable: true,
  get: function get() {
    return _scrollEvent.default;
  }
});
exports.default = void 0;

var _helpers = require("./helpers");

var _stickyPosition = _interopRequireDefault(require("./stickyPosition"));

var _scrollEvent = _interopRequireDefault(require("./scrollEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withFixedColumns = (0, _helpers.enableStickyPosition)() ? _stickyPosition.default : _scrollEvent.default; // use for legacy browser

var _default = withFixedColumns;
exports.default = _default;