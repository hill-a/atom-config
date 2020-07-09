Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _atom = require("atom");

/**
 * This acts as a global storage for the consumed service.
 */

var AutocompleteWatchEditor = (function () {
  function AutocompleteWatchEditor() {
    _classCallCheck(this, AutocompleteWatchEditor);

    this.addAutocompleteToEditor = function (editor, labels) {
      return;
    };

    this.isEnabeled = false;
  }

  _createClass(AutocompleteWatchEditor, [{
    key: "consume",

    /**
     * This function is called on activation of autocomplete, or if autocomplete is
     * already active, then it is called when hydrogen activates.
     *
     * @param {Store} store - The global Hydrogen store.
     * @param {Function} watchEditor - The function provided by `autocomplete.watchEditor`.
     * @returns {Disposable} - This is for clean up when autocomplete or hydrogen deactivate.
     */
    value: function consume(store, watchEditor) {
      var _this = this;

      this.disposables = new _atom.CompositeDisposable();
      this.addAutocompleteToEditor = watchEditor;

      // Add autocomplete capabilities to already existing watches
      for (var kernel of store.runningKernels) {
        var watchesStoreDisposable = new _atom.CompositeDisposable();
        kernel.watchesStore.autocompleteDisposables = watchesStoreDisposable;
        this.disposables.add(watchesStoreDisposable);
        for (var watch of kernel.watchesStore.watches) {
          this.addAutocompleteToWatch(kernel.watchesStore, watch);
        }
      }
      this.isEnabeled = true;
      var disposable = new _atom.Disposable(function () {
        return _this.disable(store);
      });
      store.subscriptions.add(disposable);
      return disposable;
    }

    /**
     * This function is just for cleaning up when either autocomplete or hydrogen is deactivating.
     *
     * @param {Store} store - The global Hydrogen store.
     */
  }, {
    key: "disable",
    value: function disable(store) {
      // Removes the consumed function `watchEditor`
      this.addAutocompleteToEditor = function (editor, labels) {
        return;
      };

      /*
       * Removes disposables from all watches (leaves references inside
       * `this.disposables` to be disposed at the end).
       * Autocomplete is only actually disabled on dispose of `this.disposables`
       */
      for (var kernel of store.runningKernels) {
        for (var watch of kernel.watchesStore.watches) {
          watch.autocompleteDisposable = null;
        }
        kernel.watchesStore.autocompleteDisposables = null;
      }

      // Disables autocomplete, Cleans up everything, and Resets.
      this.disposables.dispose();
      this.isEnabeled = false;
    }

    /**
     * This function is for adding autocomplete capabilities to a watch.
     *
     * @param {WatchesStore} watchesStore - This should always be the parent `WatchesStore` of `watch`.
     * @param {WatchStore} watch - The watch to add autocomplete to.
     */
  }, {
    key: "addAutocompleteToWatch",
    value: function addAutocompleteToWatch(watchesStore, watch) {
      var disposable = this.addAutocompleteToEditor(watch.editor, ["default", "workspace-center", "symbol-provider"]);
      if (disposable) {
        watch.autocompleteDisposable = disposable;
        if (watchesStore.autocompleteDisposables) watchesStore.autocompleteDisposables.add(disposable);
      }
    }

    /**
     * This function is for removing autocomplete capabilities from a watch.
     *
     * @param {WatchesStore} watchesStore - This should always be the parent `WatchesStore` of `watch`.
     * @param {WatchStore} watch - The watch to remove autocomplete from.
     */
  }, {
    key: "removeAutocompleteFromWatch",
    value: function removeAutocompleteFromWatch(watchesStore, watch) {
      var disposable = watch.autocompleteDisposable;
      if (disposable) {
        if (watchesStore.autocompleteDisposables) watchesStore.autocompleteDisposables.remove(disposable);
        disposable.dispose();
        watch.autocompleteDisposable = null;
      }
    }

    /**
     * Removes and disposes an autocomplete disposable
     *
     * @param {Disposable | CompositeDisposable} disposable
     */
  }, {
    key: "dispose",
    value: function dispose(disposable) {
      this.disposables.remove(disposable);
      disposable.dispose();
    }

    /**
     * Adds a disposable as an autocomplete disposable.
     *
     * @param {Disposable | CompositeDisposable} disposable
     */
  }, {
    key: "register",
    value: function register(disposable) {
      this.disposables.add(disposable);
    }
  }]);

  return AutocompleteWatchEditor;
})();

exports.AutocompleteWatchEditor = AutocompleteWatchEditor;

var autocompleteConsumer = new AutocompleteWatchEditor();
exports["default"] = autocompleteConsumer;

/** The `consumed autocompleteWatchEditor` */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9jb25zdW1lZC9hdXRvY29tcGxldGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWdELE1BQU07Ozs7OztJQVN6Qyx1QkFBdUI7V0FBdkIsdUJBQXVCOzBCQUF2Qix1QkFBdUI7O1NBR2xDLHVCQUF1QixHQUFHLFVBQ3hCLE1BQU0sRUFDTixNQUFNLEVBQ0g7QUFDSCxhQUFPO0tBQ1I7O1NBQ0QsVUFBVSxHQUFZLEtBQUs7OztlQVRoQix1QkFBdUI7Ozs7Ozs7Ozs7O1dBbUIzQixpQkFBQyxLQUFZLEVBQUUsV0FBeUMsRUFBRTs7O0FBQy9ELFVBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDN0MsVUFBSSxDQUFDLHVCQUF1QixHQUFHLFdBQVcsQ0FBQzs7O0FBRzNDLFdBQUssSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtBQUN2QyxZQUFNLHNCQUFzQixHQUFHLCtCQUF5QixDQUFDO0FBQ3pELGNBQU0sQ0FBQyxZQUFZLENBQUMsdUJBQXVCLEdBQUcsc0JBQXNCLENBQUM7QUFDckUsWUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM3QyxhQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO0FBQzdDLGNBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3pEO09BQ0Y7QUFDRCxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixVQUFNLFVBQVUsR0FBRyxxQkFBZTtlQUFNLE1BQUssT0FBTyxDQUFDLEtBQUssQ0FBQztPQUFBLENBQUMsQ0FBQztBQUM3RCxXQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxhQUFPLFVBQVUsQ0FBQztLQUNuQjs7Ozs7Ozs7O1dBT00saUJBQUMsS0FBWSxFQUFFOztBQUVwQixVQUFJLENBQUMsdUJBQXVCLEdBQUcsVUFDN0IsTUFBTSxFQUNOLE1BQU0sRUFDSDtBQUNILGVBQU87T0FDUixDQUFDOzs7Ozs7O0FBT0YsV0FBSyxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO0FBQ3ZDLGFBQUssSUFBSSxLQUFLLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7QUFDN0MsZUFBSyxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztTQUNyQztBQUNELGNBQU0sQ0FBQyxZQUFZLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO09BQ3BEOzs7QUFHRCxVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0tBQ3pCOzs7Ozs7Ozs7O1dBUXFCLGdDQUFDLFlBQTBCLEVBQUUsS0FBaUIsRUFBRTtBQUNwRSxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUM1RCxTQUFTLEVBQ1Qsa0JBQWtCLEVBQ2xCLGlCQUFpQixDQUNsQixDQUFDLENBQUM7QUFDSCxVQUFJLFVBQVUsRUFBRTtBQUNkLGFBQUssQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLENBQUM7QUFDMUMsWUFBSSxZQUFZLENBQUMsdUJBQXVCLEVBQ3RDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDeEQ7S0FDRjs7Ozs7Ozs7OztXQVEwQixxQ0FBQyxZQUEwQixFQUFFLEtBQWlCLEVBQUU7QUFDekUsVUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDO0FBQ2hELFVBQUksVUFBVSxFQUFFO0FBQ2QsWUFBSSxZQUFZLENBQUMsdUJBQXVCLEVBQ3RDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDMUQsa0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixhQUFLLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO09BQ3JDO0tBQ0Y7Ozs7Ozs7OztXQU9NLGlCQUFDLFVBQTRDLEVBQUU7QUFDcEQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsZ0JBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0Qjs7Ozs7Ozs7O1dBT08sa0JBQUMsVUFBNEMsRUFBRTtBQUNyRCxVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNsQzs7O1NBekhVLHVCQUF1Qjs7Ozs7QUE0SHBDLElBQU0sb0JBQW9CLEdBQUcsSUFBSSx1QkFBdUIsRUFBRSxDQUFDO3FCQUM1QyxvQkFBb0IiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvSHlkcm9nZW4vbGliL3NlcnZpY2VzL2NvbnN1bWVkL2F1dG9jb21wbGV0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuXG5pbXBvcnQgdHlwZSB7IFN0b3JlIH0gZnJvbSBcIi4uLy4uL3N0b3JlXCI7XG5pbXBvcnQgdHlwZSBXYXRjaGVzU3RvcmUgZnJvbSBcIi4uLy4uL3N0b3JlL3dhdGNoZXNcIjtcbmltcG9ydCB0eXBlIFdhdGNoU3RvcmUgZnJvbSBcIi4uLy4uL3N0b3JlL3dhdGNoXCI7XG5cbi8qKlxuICogVGhpcyBhY3RzIGFzIGEgZ2xvYmFsIHN0b3JhZ2UgZm9yIHRoZSBjb25zdW1lZCBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgQXV0b2NvbXBsZXRlV2F0Y2hFZGl0b3Ige1xuICBkaXNwb3NhYmxlczogYXRvbSRDb21wb3NpdGVEaXNwb3NhYmxlO1xuICAvKiogVGhlIGBjb25zdW1lZCBhdXRvY29tcGxldGVXYXRjaEVkaXRvcmAgKi9cbiAgYWRkQXV0b2NvbXBsZXRlVG9FZGl0b3IgPSAoXG4gICAgZWRpdG9yOiBhdG9tJFRleHRFZGl0b3IsXG4gICAgbGFiZWxzOiBBcnJheTxzdHJpbmc+XG4gICkgPT4ge1xuICAgIHJldHVybjtcbiAgfTtcbiAgaXNFbmFiZWxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBhY3RpdmF0aW9uIG9mIGF1dG9jb21wbGV0ZSwgb3IgaWYgYXV0b2NvbXBsZXRlIGlzXG4gICAqIGFscmVhZHkgYWN0aXZlLCB0aGVuIGl0IGlzIGNhbGxlZCB3aGVuIGh5ZHJvZ2VuIGFjdGl2YXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgLSBUaGUgZ2xvYmFsIEh5ZHJvZ2VuIHN0b3JlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB3YXRjaEVkaXRvciAtIFRoZSBmdW5jdGlvbiBwcm92aWRlZCBieSBgYXV0b2NvbXBsZXRlLndhdGNoRWRpdG9yYC5cbiAgICogQHJldHVybnMge0Rpc3Bvc2FibGV9IC0gVGhpcyBpcyBmb3IgY2xlYW4gdXAgd2hlbiBhdXRvY29tcGxldGUgb3IgaHlkcm9nZW4gZGVhY3RpdmF0ZS5cbiAgICovXG4gIGNvbnN1bWUoc3RvcmU6IFN0b3JlLCB3YXRjaEVkaXRvcjogYXRvbSRBdXRvY29tcGxldGVXYXRjaEVkaXRvcikge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuYWRkQXV0b2NvbXBsZXRlVG9FZGl0b3IgPSB3YXRjaEVkaXRvcjtcblxuICAgIC8vIEFkZCBhdXRvY29tcGxldGUgY2FwYWJpbGl0aWVzIHRvIGFscmVhZHkgZXhpc3Rpbmcgd2F0Y2hlc1xuICAgIGZvciAobGV0IGtlcm5lbCBvZiBzdG9yZS5ydW5uaW5nS2VybmVscykge1xuICAgICAgY29uc3Qgd2F0Y2hlc1N0b3JlRGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICBrZXJuZWwud2F0Y2hlc1N0b3JlLmF1dG9jb21wbGV0ZURpc3Bvc2FibGVzID0gd2F0Y2hlc1N0b3JlRGlzcG9zYWJsZTtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKHdhdGNoZXNTdG9yZURpc3Bvc2FibGUpO1xuICAgICAgZm9yIChsZXQgd2F0Y2ggb2Yga2VybmVsLndhdGNoZXNTdG9yZS53YXRjaGVzKSB7XG4gICAgICAgIHRoaXMuYWRkQXV0b2NvbXBsZXRlVG9XYXRjaChrZXJuZWwud2F0Y2hlc1N0b3JlLCB3YXRjaCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaXNFbmFiZWxlZCA9IHRydWU7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IG5ldyBEaXNwb3NhYmxlKCgpID0+IHRoaXMuZGlzYWJsZShzdG9yZSkpO1xuICAgIHN0b3JlLnN1YnNjcmlwdGlvbnMuYWRkKGRpc3Bvc2FibGUpO1xuICAgIHJldHVybiBkaXNwb3NhYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMganVzdCBmb3IgY2xlYW5pbmcgdXAgd2hlbiBlaXRoZXIgYXV0b2NvbXBsZXRlIG9yIGh5ZHJvZ2VuIGlzIGRlYWN0aXZhdGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmUgLSBUaGUgZ2xvYmFsIEh5ZHJvZ2VuIHN0b3JlLlxuICAgKi9cbiAgZGlzYWJsZShzdG9yZTogU3RvcmUpIHtcbiAgICAvLyBSZW1vdmVzIHRoZSBjb25zdW1lZCBmdW5jdGlvbiBgd2F0Y2hFZGl0b3JgXG4gICAgdGhpcy5hZGRBdXRvY29tcGxldGVUb0VkaXRvciA9IChcbiAgICAgIGVkaXRvcjogYXRvbSRUZXh0RWRpdG9yLFxuICAgICAgbGFiZWxzOiBBcnJheTxzdHJpbmc+XG4gICAgKSA9PiB7XG4gICAgICByZXR1cm47XG4gICAgfTtcblxuICAgIC8qXG4gICAgICogUmVtb3ZlcyBkaXNwb3NhYmxlcyBmcm9tIGFsbCB3YXRjaGVzIChsZWF2ZXMgcmVmZXJlbmNlcyBpbnNpZGVcbiAgICAgKiBgdGhpcy5kaXNwb3NhYmxlc2AgdG8gYmUgZGlzcG9zZWQgYXQgdGhlIGVuZCkuXG4gICAgICogQXV0b2NvbXBsZXRlIGlzIG9ubHkgYWN0dWFsbHkgZGlzYWJsZWQgb24gZGlzcG9zZSBvZiBgdGhpcy5kaXNwb3NhYmxlc2BcbiAgICAgKi9cbiAgICBmb3IgKGxldCBrZXJuZWwgb2Ygc3RvcmUucnVubmluZ0tlcm5lbHMpIHtcbiAgICAgIGZvciAobGV0IHdhdGNoIG9mIGtlcm5lbC53YXRjaGVzU3RvcmUud2F0Y2hlcykge1xuICAgICAgICB3YXRjaC5hdXRvY29tcGxldGVEaXNwb3NhYmxlID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGtlcm5lbC53YXRjaGVzU3RvcmUuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIERpc2FibGVzIGF1dG9jb21wbGV0ZSwgQ2xlYW5zIHVwIGV2ZXJ5dGhpbmcsIGFuZCBSZXNldHMuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gICAgdGhpcy5pc0VuYWJlbGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBmb3IgYWRkaW5nIGF1dG9jb21wbGV0ZSBjYXBhYmlsaXRpZXMgdG8gYSB3YXRjaC5cbiAgICpcbiAgICogQHBhcmFtIHtXYXRjaGVzU3RvcmV9IHdhdGNoZXNTdG9yZSAtIFRoaXMgc2hvdWxkIGFsd2F5cyBiZSB0aGUgcGFyZW50IGBXYXRjaGVzU3RvcmVgIG9mIGB3YXRjaGAuXG4gICAqIEBwYXJhbSB7V2F0Y2hTdG9yZX0gd2F0Y2ggLSBUaGUgd2F0Y2ggdG8gYWRkIGF1dG9jb21wbGV0ZSB0by5cbiAgICovXG4gIGFkZEF1dG9jb21wbGV0ZVRvV2F0Y2god2F0Y2hlc1N0b3JlOiBXYXRjaGVzU3RvcmUsIHdhdGNoOiBXYXRjaFN0b3JlKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IHRoaXMuYWRkQXV0b2NvbXBsZXRlVG9FZGl0b3Iod2F0Y2guZWRpdG9yLCBbXG4gICAgICBcImRlZmF1bHRcIixcbiAgICAgIFwid29ya3NwYWNlLWNlbnRlclwiLFxuICAgICAgXCJzeW1ib2wtcHJvdmlkZXJcIlxuICAgIF0pO1xuICAgIGlmIChkaXNwb3NhYmxlKSB7XG4gICAgICB3YXRjaC5hdXRvY29tcGxldGVEaXNwb3NhYmxlID0gZGlzcG9zYWJsZTtcbiAgICAgIGlmICh3YXRjaGVzU3RvcmUuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMpXG4gICAgICAgIHdhdGNoZXNTdG9yZS5hdXRvY29tcGxldGVEaXNwb3NhYmxlcy5hZGQoZGlzcG9zYWJsZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgZm9yIHJlbW92aW5nIGF1dG9jb21wbGV0ZSBjYXBhYmlsaXRpZXMgZnJvbSBhIHdhdGNoLlxuICAgKlxuICAgKiBAcGFyYW0ge1dhdGNoZXNTdG9yZX0gd2F0Y2hlc1N0b3JlIC0gVGhpcyBzaG91bGQgYWx3YXlzIGJlIHRoZSBwYXJlbnQgYFdhdGNoZXNTdG9yZWAgb2YgYHdhdGNoYC5cbiAgICogQHBhcmFtIHtXYXRjaFN0b3JlfSB3YXRjaCAtIFRoZSB3YXRjaCB0byByZW1vdmUgYXV0b2NvbXBsZXRlIGZyb20uXG4gICAqL1xuICByZW1vdmVBdXRvY29tcGxldGVGcm9tV2F0Y2god2F0Y2hlc1N0b3JlOiBXYXRjaGVzU3RvcmUsIHdhdGNoOiBXYXRjaFN0b3JlKSB7XG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IHdhdGNoLmF1dG9jb21wbGV0ZURpc3Bvc2FibGU7XG4gICAgaWYgKGRpc3Bvc2FibGUpIHtcbiAgICAgIGlmICh3YXRjaGVzU3RvcmUuYXV0b2NvbXBsZXRlRGlzcG9zYWJsZXMpXG4gICAgICAgIHdhdGNoZXNTdG9yZS5hdXRvY29tcGxldGVEaXNwb3NhYmxlcy5yZW1vdmUoZGlzcG9zYWJsZSk7XG4gICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgIHdhdGNoLmF1dG9jb21wbGV0ZURpc3Bvc2FibGUgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFuZCBkaXNwb3NlcyBhbiBhdXRvY29tcGxldGUgZGlzcG9zYWJsZVxuICAgKlxuICAgKiBAcGFyYW0ge0Rpc3Bvc2FibGUgfCBDb21wb3NpdGVEaXNwb3NhYmxlfSBkaXNwb3NhYmxlXG4gICAqL1xuICBkaXNwb3NlKGRpc3Bvc2FibGU6IERpc3Bvc2FibGUgfCBDb21wb3NpdGVEaXNwb3NhYmxlKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5yZW1vdmUoZGlzcG9zYWJsZSk7XG4gICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGRpc3Bvc2FibGUgYXMgYW4gYXV0b2NvbXBsZXRlIGRpc3Bvc2FibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RGlzcG9zYWJsZSB8IENvbXBvc2l0ZURpc3Bvc2FibGV9IGRpc3Bvc2FibGVcbiAgICovXG4gIHJlZ2lzdGVyKGRpc3Bvc2FibGU6IERpc3Bvc2FibGUgfCBDb21wb3NpdGVEaXNwb3NhYmxlKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZGlzcG9zYWJsZSk7XG4gIH1cbn1cblxuY29uc3QgYXV0b2NvbXBsZXRlQ29uc3VtZXIgPSBuZXcgQXV0b2NvbXBsZXRlV2F0Y2hFZGl0b3IoKTtcbmV4cG9ydCBkZWZhdWx0IGF1dG9jb21wbGV0ZUNvbnN1bWVyO1xuIl19