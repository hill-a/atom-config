Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * The `HydrogenKernel` class wraps Hydrogen's internal representation of kernels
 * and exposes a small set of methods that should be usable by plugins.
 * @class HydrogenKernel
 */

var HydrogenKernel = (function () {
  function HydrogenKernel(_kernel) {
    _classCallCheck(this, HydrogenKernel);

    this._kernel = _kernel;
    this.destroyed = false;
  }

  _createClass(HydrogenKernel, [{
    key: "_assertNotDestroyed",
    value: function _assertNotDestroyed() {
      // Internal: plugins might hold references to long-destroyed kernels, so
      // all API calls should guard against this case
      if (this.destroyed) {
        throw new Error("HydrogenKernel: operation not allowed because the kernel has been destroyed");
      }
    }

    /*
     * The language of the kernel, as specified in its kernelspec
     */
  }, {
    key: "addMiddleware",

    /*
     * Add a kernel middleware, which allows intercepting and issuing commands to
     * the kernel.
     *
     * If the methods of a `middleware` object are added/modified/deleted after
     * `addMiddleware` has been called, the changes will take effect immediately.
     *
     * @param {HydrogenKernelMiddleware} middleware
     */
    value: function addMiddleware(middleware) {
      this._assertNotDestroyed();
      this._kernel.addMiddleware(middleware);
    }

    /*
     * Calls your callback when the kernel has been destroyed.
     * @param {Function} Callback
     */
  }, {
    key: "onDidDestroy",
    value: function onDidDestroy(callback) {
      this._assertNotDestroyed();
      this._kernel.emitter.on("did-destroy", callback);
    }

    /*
     * Get the [connection file](http://jupyter-notebook.readthedocs.io/en/latest/examples/Notebook/Connecting%20with%20the%20Qt%20Console.html) of the kernel.
     * @return {String} Path to connection file.
     */
  }, {
    key: "getConnectionFile",
    value: function getConnectionFile() {
      this._assertNotDestroyed();
      // $FlowFixMe
      var connectionFile = this._kernel.transport.connectionFile ? this._kernel.transport.connectionFile : null;
      if (!connectionFile) {
        throw new Error("No connection file for " + this._kernel.kernelSpec.display_name + " kernel found");
      }

      return connectionFile;
    }
  }, {
    key: "language",
    get: function get() {
      this._assertNotDestroyed();
      return this._kernel.language;
    }

    /*
     * The display name of the kernel, as specified in its kernelspec
     */
  }, {
    key: "displayName",
    get: function get() {
      this._assertNotDestroyed();
      return this._kernel.displayName;
    }
  }]);

  return HydrogenKernel;
})();

exports["default"] = HydrogenKernel;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLWtlcm5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQVdxQixjQUFjO0FBSXRCLFdBSlEsY0FBYyxDQUlyQixPQUFlLEVBQUU7MEJBSlYsY0FBYzs7QUFLL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7R0FDeEI7O2VBUGtCLGNBQWM7O1dBU2QsK0JBQUc7OztBQUdwQixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsY0FBTSxJQUFJLEtBQUssQ0FDYiw2RUFBNkUsQ0FDOUUsQ0FBQztPQUNIO0tBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBMkJZLHVCQUFDLFVBQW9DLEVBQUU7QUFDbEQsVUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDM0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDeEM7Ozs7Ozs7O1dBTVcsc0JBQUMsUUFBa0IsRUFBUTtBQUNyQyxVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUMzQixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2xEOzs7Ozs7OztXQU1nQiw2QkFBRztBQUNsQixVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFM0IsVUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQ3JDLElBQUksQ0FBQztBQUNULFVBQUksQ0FBQyxjQUFjLEVBQUU7QUFDbkIsY0FBTSxJQUFJLEtBQUssNkJBQ2EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxtQkFDL0QsQ0FBQztPQUNIOztBQUVELGFBQU8sY0FBYyxDQUFDO0tBQ3ZCOzs7U0FyRFcsZUFBVztBQUNyQixVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUMzQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0tBQzlCOzs7Ozs7O1NBS2MsZUFBVztBQUN4QixVQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUMzQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0tBQ2pDOzs7U0FqQ2tCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9wbHVnaW4tYXBpL2h5ZHJvZ2VuLWtlcm5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIEtlcm5lbCBmcm9tIFwiLi8uLi9rZXJuZWxcIjtcbmltcG9ydCB0eXBlIHsgSHlkcm9nZW5LZXJuZWxNaWRkbGV3YXJlIH0gZnJvbSBcIi4vaHlkcm9nZW4tdHlwZXNcIjtcblxuLypcbiAqIFRoZSBgSHlkcm9nZW5LZXJuZWxgIGNsYXNzIHdyYXBzIEh5ZHJvZ2VuJ3MgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2Yga2VybmVsc1xuICogYW5kIGV4cG9zZXMgYSBzbWFsbCBzZXQgb2YgbWV0aG9kcyB0aGF0IHNob3VsZCBiZSB1c2FibGUgYnkgcGx1Z2lucy5cbiAqIEBjbGFzcyBIeWRyb2dlbktlcm5lbFxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh5ZHJvZ2VuS2VybmVsIHtcbiAgX2tlcm5lbDogS2VybmVsO1xuICBkZXN0cm95ZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoX2tlcm5lbDogS2VybmVsKSB7XG4gICAgdGhpcy5fa2VybmVsID0gX2tlcm5lbDtcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlO1xuICB9XG5cbiAgX2Fzc2VydE5vdERlc3Ryb3llZCgpIHtcbiAgICAvLyBJbnRlcm5hbDogcGx1Z2lucyBtaWdodCBob2xkIHJlZmVyZW5jZXMgdG8gbG9uZy1kZXN0cm95ZWQga2VybmVscywgc29cbiAgICAvLyBhbGwgQVBJIGNhbGxzIHNob3VsZCBndWFyZCBhZ2FpbnN0IHRoaXMgY2FzZVxuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBcIkh5ZHJvZ2VuS2VybmVsOiBvcGVyYXRpb24gbm90IGFsbG93ZWQgYmVjYXVzZSB0aGUga2VybmVsIGhhcyBiZWVuIGRlc3Ryb3llZFwiXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAqIFRoZSBsYW5ndWFnZSBvZiB0aGUga2VybmVsLCBhcyBzcGVjaWZpZWQgaW4gaXRzIGtlcm5lbHNwZWNcbiAgICovXG4gIGdldCBsYW5ndWFnZSgpOiBzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydE5vdERlc3Ryb3llZCgpO1xuICAgIHJldHVybiB0aGlzLl9rZXJuZWwubGFuZ3VhZ2U7XG4gIH1cblxuICAvKlxuICAgKiBUaGUgZGlzcGxheSBuYW1lIG9mIHRoZSBrZXJuZWwsIGFzIHNwZWNpZmllZCBpbiBpdHMga2VybmVsc3BlY1xuICAgKi9cbiAgZ2V0IGRpc3BsYXlOYW1lKCk6IHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0Tm90RGVzdHJveWVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2tlcm5lbC5kaXNwbGF5TmFtZTtcbiAgfVxuXG4gIC8qXG4gICAqIEFkZCBhIGtlcm5lbCBtaWRkbGV3YXJlLCB3aGljaCBhbGxvd3MgaW50ZXJjZXB0aW5nIGFuZCBpc3N1aW5nIGNvbW1hbmRzIHRvXG4gICAqIHRoZSBrZXJuZWwuXG4gICAqXG4gICAqIElmIHRoZSBtZXRob2RzIG9mIGEgYG1pZGRsZXdhcmVgIG9iamVjdCBhcmUgYWRkZWQvbW9kaWZpZWQvZGVsZXRlZCBhZnRlclxuICAgKiBgYWRkTWlkZGxld2FyZWAgaGFzIGJlZW4gY2FsbGVkLCB0aGUgY2hhbmdlcyB3aWxsIHRha2UgZWZmZWN0IGltbWVkaWF0ZWx5LlxuICAgKlxuICAgKiBAcGFyYW0ge0h5ZHJvZ2VuS2VybmVsTWlkZGxld2FyZX0gbWlkZGxld2FyZVxuICAgKi9cbiAgYWRkTWlkZGxld2FyZShtaWRkbGV3YXJlOiBIeWRyb2dlbktlcm5lbE1pZGRsZXdhcmUpIHtcbiAgICB0aGlzLl9hc3NlcnROb3REZXN0cm95ZWQoKTtcbiAgICB0aGlzLl9rZXJuZWwuYWRkTWlkZGxld2FyZShtaWRkbGV3YXJlKTtcbiAgfVxuXG4gIC8qXG4gICAqIENhbGxzIHlvdXIgY2FsbGJhY2sgd2hlbiB0aGUga2VybmVsIGhhcyBiZWVuIGRlc3Ryb3llZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gQ2FsbGJhY2tcbiAgICovXG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NlcnROb3REZXN0cm95ZWQoKTtcbiAgICB0aGlzLl9rZXJuZWwuZW1pdHRlci5vbihcImRpZC1kZXN0cm95XCIsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qXG4gICAqIEdldCB0aGUgW2Nvbm5lY3Rpb24gZmlsZV0oaHR0cDovL2p1cHl0ZXItbm90ZWJvb2sucmVhZHRoZWRvY3MuaW8vZW4vbGF0ZXN0L2V4YW1wbGVzL05vdGVib29rL0Nvbm5lY3RpbmclMjB3aXRoJTIwdGhlJTIwUXQlMjBDb25zb2xlLmh0bWwpIG9mIHRoZSBrZXJuZWwuXG4gICAqIEByZXR1cm4ge1N0cmluZ30gUGF0aCB0byBjb25uZWN0aW9uIGZpbGUuXG4gICAqL1xuICBnZXRDb25uZWN0aW9uRmlsZSgpIHtcbiAgICB0aGlzLl9hc3NlcnROb3REZXN0cm95ZWQoKTtcbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgY29uc3QgY29ubmVjdGlvbkZpbGUgPSB0aGlzLl9rZXJuZWwudHJhbnNwb3J0LmNvbm5lY3Rpb25GaWxlXG4gICAgICA/IHRoaXMuX2tlcm5lbC50cmFuc3BvcnQuY29ubmVjdGlvbkZpbGVcbiAgICAgIDogbnVsbDtcbiAgICBpZiAoIWNvbm5lY3Rpb25GaWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBObyBjb25uZWN0aW9uIGZpbGUgZm9yICR7dGhpcy5fa2VybmVsLmtlcm5lbFNwZWMuZGlzcGxheV9uYW1lfSBrZXJuZWwgZm91bmRgXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBjb25uZWN0aW9uRmlsZTtcbiAgfVxufVxuIl19