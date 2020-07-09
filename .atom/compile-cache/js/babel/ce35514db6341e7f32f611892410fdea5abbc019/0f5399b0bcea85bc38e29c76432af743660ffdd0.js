Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _common = require("./common");

// this is really specific to the results that this middleware will handle

var Middleware = (function () {
  function Middleware() {
    _classCallCheck(this, Middleware);
  }

  _createClass(Middleware, [{
    key: "execute",
    value: function execute(next, code, onResults) {
      var _this = this;

      next.execute(code, function (message, channel) {
        if (message.header.msg_type === "execute_result" || message.header.msg_type === "display_data") {
          var _data = message.content.data;

          if (_data && _common.DATA_EXPLORER_MEDIA_TYPE in _data) {
            _this.data = _data[_common.DATA_EXPLORER_MEDIA_TYPE];
            (0, _common.openOrShowDock)(_common.DATA_EXPLORER_URI);
          }
        }
        onResults(message, channel);
      });
    }
  }]);

  return Middleware;
})();

exports.Middleware = Middleware;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2RhdGEtZXhwbG9yZXIvbGliL2tlcm5lbC1taWRkbGV3YXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3NCQU1PLFVBQVU7Ozs7SUFVSixVQUFVO1dBQVYsVUFBVTswQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUdkLGlCQUNMLElBQW1DLEVBQ25DLElBQVksRUFDWixTQUFrQyxFQUNsQzs7O0FBQ0EsVUFBSSxDQUFDLE9BQU8sQ0FDVixJQUFJLEVBQ0osVUFDRSxPQUFPLEVBQ1AsT0FBTyxFQUNKO0FBQ0gsWUFDRSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxnQkFBZ0IsSUFDNUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssY0FBYyxFQUMxQztjQUNRLEtBQUksR0FBSyxPQUFPLENBQUMsT0FBTyxDQUF4QixJQUFJOztBQUNaLGNBQUksS0FBSSxJQUFJLG9DQUE0QixLQUFJLEVBQUU7QUFDNUMsa0JBQUssSUFBSSxHQUFHLEtBQUksa0NBQTBCLENBQUM7QUFDM0Msa0VBQWlDLENBQUM7V0FDbkM7U0FDRjtBQUNELGlCQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQzdCLENBQ0YsQ0FBQztLQUNIOzs7U0EzQlUsVUFBVSIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9kYXRhLWV4cGxvcmVyL2xpYi9rZXJuZWwtbWlkZGxld2FyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7XG4gIG9wZW5PclNob3dEb2NrLFxuICBEQVRBX0VYUExPUkVSX01FRElBX1RZUEUsXG4gIERBVEFfRVhQTE9SRVJfVVJJXG59IGZyb20gXCIuL2NvbW1vblwiO1xuXG5pbXBvcnQgdHlwZSB7IERhdGFSZXNvdXJjZSB9IGZyb20gXCIuL2NvbW1vblwiO1xuXG4vLyB0aGlzIGlzIHJlYWxseSBzcGVjaWZpYyB0byB0aGUgcmVzdWx0cyB0aGF0IHRoaXMgbWlkZGxld2FyZSB3aWxsIGhhbmRsZVxudHlwZSBFeGVjUmVzdWx0Q29udGVudCA9IHtcbiAgZXhlY3V0aW9uQ291bnQ6IG51bWJlcixcbiAgZGF0YT86IHsgW2tleTogc3RyaW5nXTogT2JqZWN0IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBNaWRkbGV3YXJlIHtcbiAgZGF0YTogRGF0YVJlc291cmNlO1xuXG4gIGV4ZWN1dGUoXG4gICAgbmV4dDogSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlVGh1bmssXG4gICAgY29kZTogc3RyaW5nLFxuICAgIG9uUmVzdWx0czogSHlkcm9nZW5SZXN1bHRzQ2FsbGJhY2tcbiAgKSB7XG4gICAgbmV4dC5leGVjdXRlKFxuICAgICAgY29kZSxcbiAgICAgIChcbiAgICAgICAgbWVzc2FnZTogSnVweXRlck1lc3NhZ2U8TWVzc2FnZVR5cGUsIEV4ZWNSZXN1bHRDb250ZW50PixcbiAgICAgICAgY2hhbm5lbDogQ2hhbm5lbFxuICAgICAgKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBtZXNzYWdlLmhlYWRlci5tc2dfdHlwZSA9PT0gXCJleGVjdXRlX3Jlc3VsdFwiIHx8XG4gICAgICAgICAgbWVzc2FnZS5oZWFkZXIubXNnX3R5cGUgPT09IFwiZGlzcGxheV9kYXRhXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgeyBkYXRhIH0gPSBtZXNzYWdlLmNvbnRlbnQ7XG4gICAgICAgICAgaWYgKGRhdGEgJiYgREFUQV9FWFBMT1JFUl9NRURJQV9UWVBFIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGFbREFUQV9FWFBMT1JFUl9NRURJQV9UWVBFXTtcbiAgICAgICAgICAgIG9wZW5PclNob3dEb2NrKERBVEFfRVhQTE9SRVJfVVJJKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb25SZXN1bHRzKG1lc3NhZ2UsIGNoYW5uZWwpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cbiJdfQ==