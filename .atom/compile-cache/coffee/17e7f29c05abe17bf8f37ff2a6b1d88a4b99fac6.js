(function() {
  var SelectionView;

  module.exports = SelectionView = (function() {
    SelectionView.editor = null;

    SelectionView.rangeList = null;

    SelectionView.rangeIndex = null;

    SelectionView.alive = null;

    SelectionView.subscription = null;

    function SelectionView(editor, rangeList1) {
      var currentRange;
      this.editor = editor;
      this.rangeList = rangeList1;
      this.alive = true;
      currentRange = this.editor.getSelectedBufferRange();
      this.rangeIndex = rangeList.findIndex(function(range) {
        return range.containsRange(currentRange);
      });
      if (!this.rangeList[this.rangeIndex].isEqual(currentRange)) {
        this.rangeIndex -= 0.5;
      }
      this.subscription = this.editor.onDidChangeSelectionRange((function(_this) {
        return function(arg) {
          var newBufferRange;
          newBufferRange = arg.newBufferRange;
          if (newBufferRange.isEqual(_this.rangeList[_this.rangeIndex])) {
            return;
          }
          _this.rangeIndex = _this.rangeList.findIndex(function(range) {
            return range.isEqual(newBufferRange);
          });
          if (_this.rangeIndex === -1) {
            return _this.destroy();
          }
        };
      })(this));
    }

    SelectionView.prototype.expand = function() {
      var newIndex, ref, ref1;
      newIndex = Math.floor(this.rangeIndex + 1);
      if (!((ref = newIndex < ((ref1 = this.rangeList) != null ? ref1.length : void 0)) != null ? ref : 0)) {
        return;
      }
      this.rangeIndex = newIndex;
      return this.editor.setSelectedBufferRange(this.rangeList[this.rangeIndex]);
    };

    SelectionView.prototype.shrink = function() {
      var newIndex;
      newIndex = Math.ceil(this.rangeIndex - 1);
      if (!(newIndex >= 0)) {
        return;
      }
      this.rangeIndex = newIndex;
      return this.editor.setSelectedBufferRange(this.rangeList[this.rangeIndex]);
    };

    SelectionView.prototype.isAlive = function() {
      return this.alive;
    };

    SelectionView.prototype.destroy = function() {
      var ref;
      this.alive = false;
      return (ref = this.subscription) != null ? ref.dispose() : void 0;
    };

    return SelectionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvb2NhbWwtbWVybGluL2xpYi9zZWxlY3Rpb24tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBQ3JCLGFBQUMsQ0FBQSxNQUFELEdBQVM7O0lBRVQsYUFBQyxDQUFBLFNBQUQsR0FBWTs7SUFDWixhQUFDLENBQUEsVUFBRCxHQUFhOztJQUViLGFBQUMsQ0FBQSxLQUFELEdBQVE7O0lBQ1IsYUFBQyxDQUFBLFlBQUQsR0FBZTs7SUFFRix1QkFBQyxNQUFELEVBQVUsVUFBVjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxZQUFEO01BQ3JCLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUFBO01BQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYyxTQUFTLENBQUMsU0FBVixDQUFvQixTQUFDLEtBQUQ7ZUFDaEMsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsWUFBcEI7TUFEZ0MsQ0FBcEI7TUFFZCxJQUFHLENBQUksSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsVUFBRCxDQUFZLENBQUMsT0FBeEIsQ0FBZ0MsWUFBaEMsQ0FBUDtRQUNFLElBQUMsQ0FBQSxVQUFELElBQWUsSUFEakI7O01BRUEsSUFBQyxDQUFBLFlBQUQsR0FDRSxJQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ2hDLGNBQUE7VUFEa0MsaUJBQUQ7VUFDakMsSUFBVSxjQUFjLENBQUMsT0FBZixDQUF1QixLQUFDLENBQUEsU0FBVSxDQUFBLEtBQUMsQ0FBQSxVQUFELENBQWxDLENBQVY7QUFBQSxtQkFBQTs7VUFDQSxLQUFDLENBQUEsVUFBRCxHQUFjLEtBQUMsQ0FBQSxTQUFTLENBQUMsU0FBWCxDQUFxQixTQUFDLEtBQUQ7bUJBQ2pDLEtBQUssQ0FBQyxPQUFOLENBQWMsY0FBZDtVQURpQyxDQUFyQjtVQUVkLElBQWMsS0FBQyxDQUFBLFVBQUQsS0FBZSxDQUFDLENBQTlCO21CQUFBLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBQTs7UUFKZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO0lBUlM7OzRCQWNiLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBekI7TUFDWCxJQUFBLENBQUEsNkZBQThDLENBQTlDLENBQUE7QUFBQSxlQUFBOztNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWM7YUFDZCxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLElBQUMsQ0FBQSxTQUFVLENBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBMUM7SUFKTTs7NEJBTVIsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLFVBQUQsR0FBYyxDQUF4QjtNQUNYLElBQUEsQ0FBQSxDQUFjLFFBQUEsSUFBWSxDQUExQixDQUFBO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjO2FBQ2QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixJQUFDLENBQUEsU0FBVSxDQUFBLElBQUMsQ0FBQSxVQUFELENBQTFDO0lBSk07OzRCQU1SLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBO0lBRE07OzRCQUdULE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVM7b0RBQ0ksQ0FBRSxPQUFmLENBQUE7SUFGTzs7Ozs7QUF0Q1giLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNlbGVjdGlvblZpZXdcbiAgQGVkaXRvcjogbnVsbFxuXG4gIEByYW5nZUxpc3Q6IG51bGxcbiAgQHJhbmdlSW5kZXg6IG51bGxcblxuICBAYWxpdmU6IG51bGxcbiAgQHN1YnNjcmlwdGlvbjogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoQGVkaXRvciwgQHJhbmdlTGlzdCkgLT5cbiAgICBAYWxpdmUgPSB0cnVlXG4gICAgY3VycmVudFJhbmdlID0gQGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICBAcmFuZ2VJbmRleCA9IHJhbmdlTGlzdC5maW5kSW5kZXggKHJhbmdlKSAtPlxuICAgICAgcmFuZ2UuY29udGFpbnNSYW5nZSBjdXJyZW50UmFuZ2VcbiAgICBpZiBub3QgQHJhbmdlTGlzdFtAcmFuZ2VJbmRleF0uaXNFcXVhbCBjdXJyZW50UmFuZ2VcbiAgICAgIEByYW5nZUluZGV4IC09IDAuNVxuICAgIEBzdWJzY3JpcHRpb24gPVxuICAgICAgQGVkaXRvci5vbkRpZENoYW5nZVNlbGVjdGlvblJhbmdlICh7bmV3QnVmZmVyUmFuZ2V9KSA9PlxuICAgICAgICByZXR1cm4gaWYgbmV3QnVmZmVyUmFuZ2UuaXNFcXVhbCBAcmFuZ2VMaXN0W0ByYW5nZUluZGV4XVxuICAgICAgICBAcmFuZ2VJbmRleCA9IEByYW5nZUxpc3QuZmluZEluZGV4IChyYW5nZSkgLT5cbiAgICAgICAgICByYW5nZS5pc0VxdWFsKG5ld0J1ZmZlclJhbmdlKVxuICAgICAgICBAZGVzdHJveSgpIGlmIEByYW5nZUluZGV4IGlzIC0xXG5cbiAgZXhwYW5kOiAtPlxuICAgIG5ld0luZGV4ID0gTWF0aC5mbG9vciBAcmFuZ2VJbmRleCArIDFcbiAgICByZXR1cm4gdW5sZXNzIG5ld0luZGV4IDwgQHJhbmdlTGlzdD8ubGVuZ3RoID8gMFxuICAgIEByYW5nZUluZGV4ID0gbmV3SW5kZXhcbiAgICBAZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UgQHJhbmdlTGlzdFtAcmFuZ2VJbmRleF1cblxuICBzaHJpbms6IC0+XG4gICAgbmV3SW5kZXggPSBNYXRoLmNlaWwgQHJhbmdlSW5kZXggLSAxXG4gICAgcmV0dXJuIHVubGVzcyBuZXdJbmRleCA+PSAwXG4gICAgQHJhbmdlSW5kZXggPSBuZXdJbmRleFxuICAgIEBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSBAcmFuZ2VMaXN0W0ByYW5nZUluZGV4XVxuXG4gIGlzQWxpdmU6IC0+XG4gICAgQGFsaXZlXG5cbiAgZGVzdHJveTogLT5cbiAgICBAYWxpdmUgPSBmYWxzZVxuICAgIEBzdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuIl19
