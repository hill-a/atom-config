Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Adapted from https://github.com/nteract/nteract/blob/master/packages/outputs/src/components/media/markdown.tsx
 * Copyright (c) 2016 - present, nteract contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @NOTE: This `Markdown` component could be used exactly same as the original `Media.Markdown` component of @nteract/outputs,
 *        except that this file adds a class name to it for further stylings in styles/hydrogen.less.
 */

var _nteractMarkdown = require("@nteract/markdown");

var _nteractMarkdown2 = _interopRequireDefault(_nteractMarkdown);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var Markdown = (function (_React$PureComponent) {
  _inherits(Markdown, _React$PureComponent);

  function Markdown() {
    _classCallCheck(this, Markdown);

    _get(Object.getPrototypeOf(Markdown.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Markdown, [{
    key: "render",
    value: function render() {
      return _react2["default"].createElement(
        "div",
        { className: "markdown" },
        _react2["default"].createElement(_nteractMarkdown2["default"], { source: this.props.data })
      );
    }
  }], [{
    key: "defaultProps",
    value: {
      data: "",
      mediaType: "text/markdown"
    },
    enumerable: true
  }]);

  return Markdown;
})(_react2["default"].PureComponent);

exports.Markdown = Markdown;
exports["default"] = Markdown;

/**
 * Markdown text.
 */

/**
 * Media type. Defaults to `text/markdown`.
 * For more on media types, see: https://www.w3.org/TR/CSS21/media.html%23media-types.
 */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9jb21wb25lbnRzL3Jlc3VsdC12aWV3L21hcmtkb3duLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OytCQWM4QixtQkFBbUI7Ozs7cUJBQy9CLE9BQU87Ozs7SUFjWixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBTWIsa0JBQUc7QUFDUCxhQUNFOztVQUFLLFNBQVMsRUFBQyxVQUFVO1FBQ3ZCLGlFQUFtQixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEFBQUMsR0FBRztPQUMxQyxDQUNOO0tBQ0g7OztXQVhxQjtBQUNwQixVQUFJLEVBQUUsRUFBRTtBQUNSLGVBQVMsRUFBRSxlQUFlO0tBQzNCOzs7O1NBSlUsUUFBUTtHQUFTLG1CQUFNLGFBQWE7OztxQkFlbEMsUUFBUSIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9IeWRyb2dlbi9saWIvY29tcG9uZW50cy9yZXN1bHQtdmlldy9tYXJrZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8qKlxuICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9udGVyYWN0L250ZXJhY3QvYmxvYi9tYXN0ZXIvcGFja2FnZXMvb3V0cHV0cy9zcmMvY29tcG9uZW50cy9tZWRpYS9tYXJrZG93bi50c3hcbiAqIENvcHlyaWdodCAoYykgMjAxNiAtIHByZXNlbnQsIG50ZXJhY3QgY29udHJpYnV0b3JzXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQE5PVEU6IFRoaXMgYE1hcmtkb3duYCBjb21wb25lbnQgY291bGQgYmUgdXNlZCBleGFjdGx5IHNhbWUgYXMgdGhlIG9yaWdpbmFsIGBNZWRpYS5NYXJrZG93bmAgY29tcG9uZW50IG9mIEBudGVyYWN0L291dHB1dHMsXG4gKiAgICAgICAgZXhjZXB0IHRoYXQgdGhpcyBmaWxlIGFkZHMgYSBjbGFzcyBuYW1lIHRvIGl0IGZvciBmdXJ0aGVyIHN0eWxpbmdzIGluIHN0eWxlcy9oeWRyb2dlbi5sZXNzLlxuICovXG5cbmltcG9ydCBNYXJrZG93bkNvbXBvbmVudCBmcm9tIFwiQG50ZXJhY3QvbWFya2Rvd25cIjtcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgLyoqXG4gICAqIE1hcmtkb3duIHRleHQuXG4gICAqL1xuICBkYXRhOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBNZWRpYSB0eXBlLiBEZWZhdWx0cyB0byBgdGV4dC9tYXJrZG93bmAuXG4gICAqIEZvciBtb3JlIG9uIG1lZGlhIHR5cGVzLCBzZWU6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9DU1MyMS9tZWRpYS5odG1sJTIzbWVkaWEtdHlwZXMuXG4gICAqL1xuICBtZWRpYVR5cGU6IFwidGV4dC9tYXJrZG93blwiO1xufVxuXG5leHBvcnQgY2xhc3MgTWFya2Rvd24gZXh0ZW5kcyBSZWFjdC5QdXJlQ29tcG9uZW50PFByb3BzPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZGF0YTogXCJcIixcbiAgICBtZWRpYVR5cGU6IFwidGV4dC9tYXJrZG93blwiXG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hcmtkb3duXCI+XG4gICAgICAgIDxNYXJrZG93bkNvbXBvbmVudCBzb3VyY2U9e3RoaXMucHJvcHMuZGF0YX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFya2Rvd247XG4iXX0=