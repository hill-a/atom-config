
/*
Requires clang-format (https://clang.llvm.org)
 */

(function() {
  "use strict";
  var Beautifier, ClangFormat, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require('fs');

  module.exports = ClangFormat = (function(superClass) {
    extend(ClangFormat, superClass);

    function ClangFormat() {
      return ClangFormat.__super__.constructor.apply(this, arguments);
    }

    ClangFormat.prototype.name = "clang-format";

    ClangFormat.prototype.link = "https://clang.llvm.org/docs/ClangFormat.html";

    ClangFormat.prototype.executables = [
      {
        name: "ClangFormat",
        cmd: "clang-format",
        homepage: "https://clang.llvm.org/docs/ClangFormat.html",
        installation: "https://clang.llvm.org/docs/ClangFormat.html",
        version: {
          parse: function(text) {
            return text.match(/version (\d+\.\d+\.\d+)/)[1];
          }
        },
        docker: {
          image: "unibeautify/clang-format"
        }
      }
    ];

    ClangFormat.prototype.options = {
      "C++": false,
      "C": false,
      "Objective-C": false,
      "GLSL": true
    };


    /*
      Dump contents to a given file
     */

    ClangFormat.prototype.dumpToFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-dump";
      }
      if (contents == null) {
        contents = "";
      }
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          return fs.open(name, "w", function(err, fd) {
            _this.debug('dumpToFile', name, err, fd);
            if (err) {
              return reject(err);
            }
            return fs.write(fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(name);
              });
            });
          });
        };
      })(this));
    };

    ClangFormat.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var currDir, currFile, dumpFile, editor, fullPath, ref;
        editor = typeof atom !== "undefined" && atom !== null ? (ref = atom.workspace) != null ? ref.getActiveTextEditor() : void 0 : void 0;
        if (editor != null) {
          fullPath = editor.getPath();
          currDir = path.dirname(fullPath);
          currFile = path.basename(fullPath);
          dumpFile = path.join(currDir, ".atom-beautify." + currFile);
          return resolve(dumpFile);
        } else {
          return reject(new Error("No active editor found!"));
        }
      }).then((function(_this) {
        return function(dumpFile) {
          return _this.exe("clang-format").run([_this.dumpToFile(dumpFile, text), ["--style=file"]])["finally"](function() {
            return fs.unlink(dumpFile, function() {});
          });
        };
      })(this));
    };

    return ClangFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvY2xhbmctZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxpQ0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFFckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUNOLFdBQUEsR0FBYTtNQUNYO1FBQ0UsSUFBQSxFQUFNLGFBRFI7UUFFRSxHQUFBLEVBQUssY0FGUDtRQUdFLFFBQUEsRUFBVSw4Q0FIWjtRQUlFLFlBQUEsRUFBYyw4Q0FKaEI7UUFLRSxPQUFBLEVBQVM7VUFDUCxLQUFBLEVBQU8sU0FBQyxJQUFEO21CQUFVLElBQUksQ0FBQyxLQUFMLENBQVcseUJBQVgsQ0FBc0MsQ0FBQSxDQUFBO1VBQWhELENBREE7U0FMWDtRQVFFLE1BQUEsRUFBUTtVQUNOLEtBQUEsRUFBTywwQkFERDtTQVJWO09BRFc7OzswQkFlYixPQUFBLEdBQVM7TUFDUCxLQUFBLEVBQU8sS0FEQTtNQUVQLEdBQUEsRUFBSyxLQUZFO01BR1AsYUFBQSxFQUFlLEtBSFI7TUFJUCxNQUFBLEVBQVEsSUFKRDs7OztBQU9UOzs7OzBCQUdBLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBOEIsUUFBOUI7O1FBQUMsT0FBTzs7O1FBQXNCLFdBQVc7O0FBQ25ELGFBQU8sSUFBSSxJQUFDLENBQUEsT0FBTCxDQUFhLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtpQkFDbEIsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsR0FBZCxFQUFtQixTQUFDLEdBQUQsRUFBTSxFQUFOO1lBQ2pCLEtBQUMsQ0FBQSxLQUFELENBQU8sWUFBUCxFQUFxQixJQUFyQixFQUEyQixHQUEzQixFQUFnQyxFQUFoQztZQUNBLElBQXNCLEdBQXRCO0FBQUEscUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7bUJBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFULEVBQWEsUUFBYixFQUF1QixTQUFDLEdBQUQ7Y0FDckIsSUFBc0IsR0FBdEI7QUFBQSx1QkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztxQkFDQSxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsRUFBYSxTQUFDLEdBQUQ7Z0JBQ1gsSUFBc0IsR0FBdEI7QUFBQSx5QkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOzt1QkFDQSxPQUFBLENBQVEsSUFBUjtjQUZXLENBQWI7WUFGcUIsQ0FBdkI7VUFIaUIsQ0FBbkI7UUFEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWI7SUFERzs7MEJBZVosUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFhUixhQUFPLElBQUksSUFBQyxDQUFBLE9BQUwsQ0FBYSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxNQUFBLHNGQUF3QixDQUFFLG1CQUFqQixDQUFBO1FBQ1QsSUFBRyxjQUFIO1VBQ0UsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQUE7VUFDWCxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiO1VBQ1YsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsUUFBZDtVQUNYLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsaUJBQUEsR0FBa0IsUUFBckM7aUJBQ1gsT0FBQSxDQUFRLFFBQVIsRUFMRjtTQUFBLE1BQUE7aUJBT0UsTUFBQSxDQUFPLElBQUksS0FBSixDQUFVLHlCQUFWLENBQVAsRUFQRjs7TUFGa0IsQ0FBYixDQVdQLENBQUMsSUFYTSxDQVdELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO0FBR0osaUJBQU8sS0FBQyxDQUFBLEdBQUQsQ0FBSyxjQUFMLENBQW9CLENBQUMsR0FBckIsQ0FBeUIsQ0FDOUIsS0FBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLEVBQXNCLElBQXRCLENBRDhCLEVBRTlCLENBQUMsY0FBRCxDQUY4QixDQUF6QixDQUdILEVBQUMsT0FBRCxFQUhHLENBR08sU0FBQTttQkFDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsU0FBQSxHQUFBLENBQXBCO1VBRFUsQ0FIUDtRQUhIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVhDO0lBYkM7Ozs7S0E1QytCO0FBVDNDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBjbGFuZy1mb3JtYXQgKGh0dHBzOi8vY2xhbmcubGx2bS5vcmcpXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuZnMgPSByZXF1aXJlKCdmcycpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ2xhbmdGb3JtYXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG5cbiAgbmFtZTogXCJjbGFuZy1mb3JtYXRcIlxuICBsaW5rOiBcImh0dHBzOi8vY2xhbmcubGx2bS5vcmcvZG9jcy9DbGFuZ0Zvcm1hdC5odG1sXCJcbiAgZXhlY3V0YWJsZXM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIkNsYW5nRm9ybWF0XCJcbiAgICAgIGNtZDogXCJjbGFuZy1mb3JtYXRcIlxuICAgICAgaG9tZXBhZ2U6IFwiaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZy9kb2NzL0NsYW5nRm9ybWF0Lmh0bWxcIlxuICAgICAgaW5zdGFsbGF0aW9uOiBcImh0dHBzOi8vY2xhbmcubGx2bS5vcmcvZG9jcy9DbGFuZ0Zvcm1hdC5odG1sXCJcbiAgICAgIHZlcnNpb246IHtcbiAgICAgICAgcGFyc2U6ICh0ZXh0KSAtPiB0ZXh0Lm1hdGNoKC92ZXJzaW9uIChcXGQrXFwuXFxkK1xcLlxcZCspLylbMV1cbiAgICAgIH1cbiAgICAgIGRvY2tlcjoge1xuICAgICAgICBpbWFnZTogXCJ1bmliZWF1dGlmeS9jbGFuZy1mb3JtYXRcIlxuICAgICAgfVxuICAgIH1cbiAgXVxuXG4gIG9wdGlvbnM6IHtcbiAgICBcIkMrK1wiOiBmYWxzZVxuICAgIFwiQ1wiOiBmYWxzZVxuICAgIFwiT2JqZWN0aXZlLUNcIjogZmFsc2VcbiAgICBcIkdMU0xcIjogdHJ1ZVxuICB9XG5cbiAgIyMjXG4gICAgRHVtcCBjb250ZW50cyB0byBhIGdpdmVuIGZpbGVcbiAgIyMjXG4gIGR1bXBUb0ZpbGU6IChuYW1lID0gXCJhdG9tLWJlYXV0aWZ5LWR1bXBcIiwgY29udGVudHMgPSBcIlwiKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIGZzLm9wZW4obmFtZSwgXCJ3XCIsIChlcnIsIGZkKSA9PlxuICAgICAgICBAZGVidWcoJ2R1bXBUb0ZpbGUnLCBuYW1lLCBlcnIsIGZkKVxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgIGZzLndyaXRlKGZkLCBjb250ZW50cywgKGVycikgLT5cbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgICAgZnMuY2xvc2UoZmQsIChlcnIpIC0+XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgICAgICByZXNvbHZlKG5hbWUpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgIyBOT1RFOiBPbmUgbWF5IHdvbmRlciB3aHkgdGhpcyBjb2RlIGdvZXMgYSBsb25nIHdheSB0byBjb25zdHJ1Y3QgYSBmaWxlXG4gICAgIyBwYXRoIGFuZCBkdW1wIGNvbnRlbnQgdXNpbmcgYSBjdXN0b20gYGR1bXBUb0ZpbGVgLiBXb3VsZG4ndCBpdCBiZSBlYXNpZXJcbiAgICAjIHRvIHVzZSBgQHRlbXBGaWxlYCBpbnN0ZWFkPyBUaGUgcmVhc29uIGhlcmUgaXMgdG8gd29yayBhcm91bmQgdGhlXG4gICAgIyBjbGFuZy1mb3JtYXQgY29uZmlnIGZpbGUgbG9jYXRpbmcgbWVjaGFuaXNtLiBBcyBpbmRpY2F0ZWQgaW4gdGhlIG1hbnVhbCxcbiAgICAjIGNsYW5nLWZvcm1hdCAod2l0aCBgLS1zdHlsZSBmaWxlYCkgdHJpZXMgdG8gbG9jYXRlIGEgYC5jbGFuZy1mb3JtYXRgXG4gICAgIyBjb25maWcgZmlsZSBpbiBkaXJlY3RvcnkgYW5kIHBhcmVudCBkaXJlY3RvcmllcyBvZiB0aGUgaW5wdXQgZmlsZSxcbiAgICAjIGFuZCByZXRyZWF0IHRvIGRlZmF1bHQgc3R5bGUgaWYgbm90IGZvdW5kLiBQcm9qZWN0cyBvZnRlbiBtYWtlcyB1c2Ugb2ZcbiAgICAjIHRoaXMgcnVsZSB0byBkZWZpbmUgdGhlaXIgb3duIHN0eWxlIGluIGl0cyB0b3AgZGlyZWN0b3J5LiBVc2VycyBvZnRlblxuICAgICMgcHV0IGEgYC5jbGFuZy1mb3JtYXRgIGluIHRoZWlyICRIT01FIHRvIGRlZmluZSBoaXMvaGVyIHN0eWxlLiBUbyBob25vclxuICAgICMgdGhpcyBydWxlLCB3ZSBIQVZFIFRPIGdlbmVyYXRlIHRoZSB0ZW1wIGZpbGUgaW4gVEhFIFNBTUUgZGlyZWN0b3J5IGFzXG4gICAgIyB0aGUgZWRpdGluZyBmaWxlLiBIb3dldmVyLCB0aGlzIG1lY2hhbmlzbSBpcyBub3QgZGlyZWN0bHkgc3VwcG9ydGVkIGJ5XG4gICAgIyBhdG9tLWJlYXV0aWZ5IGF0IHRoZSBtb21lbnQuIFNvIHdlIGludHJvZHVjZSBsb3RzIG9mIGNvZGUgaGVyZS5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tPy53b3Jrc3BhY2U/LmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgZWRpdG9yP1xuICAgICAgICBmdWxsUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgY3VyckRpciA9IHBhdGguZGlybmFtZShmdWxsUGF0aClcbiAgICAgICAgY3VyckZpbGUgPSBwYXRoLmJhc2VuYW1lKGZ1bGxQYXRoKVxuICAgICAgICBkdW1wRmlsZSA9IHBhdGguam9pbihjdXJyRGlyLCBcIi5hdG9tLWJlYXV0aWZ5LiN7Y3VyckZpbGV9XCIpXG4gICAgICAgIHJlc29sdmUgZHVtcEZpbGVcbiAgICAgIGVsc2VcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIk5vIGFjdGl2ZSBlZGl0b3IgZm91bmQhXCIpKVxuICAgIClcbiAgICAudGhlbigoZHVtcEZpbGUpID0+XG4gICAgICAjIGNvbnNvbGUubG9nKFwiY2xhbmctZm9ybWF0XCIsIGR1bXBGaWxlKVxuXG4gICAgICByZXR1cm4gQGV4ZShcImNsYW5nLWZvcm1hdFwiKS5ydW4oW1xuICAgICAgICBAZHVtcFRvRmlsZShkdW1wRmlsZSwgdGV4dClcbiAgICAgICAgW1wiLS1zdHlsZT1maWxlXCJdXG4gICAgICAgIF0pLmZpbmFsbHkoIC0+XG4gICAgICAgICAgZnMudW5saW5rKGR1bXBGaWxlLCAtPilcbiAgICAgICAgKVxuICAgIClcbiJdfQ==
