(function() {
  var Buffer, CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Buffer = (function() {
    function Buffer(buffer, destroyCallback) {
      this.buffer = buffer;
      this.destroyCallback = destroyCallback;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.buffer.onDidDestroy(this.destroyCallback));
      this.subscriptions.add(this.buffer.onDidChange((function(_this) {
        return function() {
          return _this.changed = true;
        };
      })(this)));
      this.changed = true;
    }

    Buffer.prototype.isChanged = function() {
      return this.changed;
    };

    Buffer.prototype.setChanged = function(changed) {
      this.changed = changed;
    };

    Buffer.prototype.getPath = function() {
      return this.buffer.getPath();
    };

    Buffer.prototype.getText = function() {
      return this.buffer.getText();
    };

    Buffer.prototype.onDidDestroy = function(callback) {
      return this.subscriptions.add(this.buffer.onDidDestroy(callback));
    };

    Buffer.prototype.onDidChange = function(callback) {
      return this.subscriptions.add(this.buffer.onDidChange(callback));
    };

    Buffer.prototype.destroy = function() {
      this.subscriptions.dispose();
      return this.destroyCallback();
    };

    return Buffer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvb2NhbWwtbWVybGluL2xpYi9idWZmZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBQ1IsZ0JBQUMsTUFBRCxFQUFVLGVBQVY7TUFBQyxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxrQkFBRDtNQUNyQixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsSUFBQyxDQUFBLGVBQXRCLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3JDLEtBQUMsQ0FBQSxPQUFELEdBQVc7UUFEMEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLENBQW5CO01BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUxBOztxQkFPYixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKOztxQkFFWCxVQUFBLEdBQVksU0FBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7SUFBRDs7cUJBRVosT0FBQSxHQUFTLFNBQUE7YUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQTtJQUFIOztxQkFFVCxPQUFBLEdBQVMsU0FBQTthQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBO0lBQUg7O3FCQUVULFlBQUEsR0FBYyxTQUFDLFFBQUQ7YUFDWixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLFFBQXJCLENBQW5CO0lBRFk7O3FCQUdkLFdBQUEsR0FBYSxTQUFDLFFBQUQ7YUFDWCxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLFFBQXBCLENBQW5CO0lBRFc7O3FCQUdiLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7YUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBRk87Ozs7O0FBeEJYIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCdWZmZXJcbiAgY29uc3RydWN0b3I6IChAYnVmZmVyLCBAZGVzdHJveUNhbGxiYWNrKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGJ1ZmZlci5vbkRpZERlc3Ryb3kgQGRlc3Ryb3lDYWxsYmFja1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAYnVmZmVyLm9uRGlkQ2hhbmdlID0+XG4gICAgICBAY2hhbmdlZCA9IHRydWVcbiAgICBAY2hhbmdlZCA9IHRydWVcblxuICBpc0NoYW5nZWQ6IC0+IEBjaGFuZ2VkXG5cbiAgc2V0Q2hhbmdlZDogKEBjaGFuZ2VkKSAtPlxuXG4gIGdldFBhdGg6IC0+IEBidWZmZXIuZ2V0UGF0aCgpXG5cbiAgZ2V0VGV4dDogLT4gQGJ1ZmZlci5nZXRUZXh0KClcblxuICBvbkRpZERlc3Ryb3k6IChjYWxsYmFjaykgLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGJ1ZmZlci5vbkRpZERlc3Ryb3kgY2FsbGJhY2tcblxuICBvbkRpZENoYW5nZTogKGNhbGxiYWNrKSAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAYnVmZmVyLm9uRGlkQ2hhbmdlIGNhbGxiYWNrXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZGVzdHJveUNhbGxiYWNrKClcbiJdfQ==
