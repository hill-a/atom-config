(function() {
  var Merlin, Point, Range, createInterface, ref, spawn;

  spawn = require('child_process').spawn;

  createInterface = require('readline').createInterface;

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  module.exports = Merlin = (function() {
    Merlin.prototype.process = null;

    Merlin.prototype["interface"] = null;

    Merlin.prototype.protocol = 2;

    Merlin.prototype.queue = null;

    function Merlin() {
      this.queue = Promise.resolve();
      this.restart();
    }

    Merlin.prototype.restart = function() {
      var path, projectPaths, ref1, ref2;
      path = atom.config.get('ocaml-merlin.merlinPath');
      if ((ref1 = this["interface"]) != null) {
        ref1.close();
      }
      if ((ref2 = this.process) != null) {
        ref2.kill();
      }
      projectPaths = atom.project.getPaths();
      this.process = spawn(path, [], {
        cwd: projectPaths.length > 0 ? projectPaths[0] : __dirname
      });
      this.process.on('error', function(error) {
        return console.log(error);
      });
      this.process.on('exit', function(code) {
        return console.log("Merlin exited with code " + code);
      });
      console.log("Merlin process started, pid = " + this.process.pid);
      this["interface"] = createInterface({
        input: this.process.stdout,
        output: this.process.stdin,
        terminal: false
      });
      return this.rawQuery(["protocol", "version", 2]).then((function(_this) {
        return function(arg) {
          var kind, payload;
          kind = arg[0], payload = arg[1];
          return _this.protocol = kind === "return" ? payload.selected : 1;
        };
      })(this));
    };

    Merlin.prototype.close = function() {
      var ref1, ref2;
      if ((ref1 = this["interface"]) != null) {
        ref1.close();
      }
      return (ref2 = this.process) != null ? ref2.kill() : void 0;
    };

    Merlin.prototype.rawQuery = function(query) {
      return this.queue = this.queue.then((function(_this) {
        return function() {
          return new Promise(function(resolve, reject) {
            var jsonQuery;
            jsonQuery = JSON.stringify(query);
            return _this["interface"].question(jsonQuery + '\n', function(answer) {
              return resolve(JSON.parse(answer));
            });
          });
        };
      })(this));
    };

    Merlin.prototype.query = function(buffer, query) {
      return this.rawQuery({
        context: ["auto", buffer.getPath()],
        query: query
      }).then(function(arg) {
        var kind, payload;
        kind = arg[0], payload = arg[1];
        return new Promise(function(resolve, reject) {
          if (kind === "return") {
            return resolve(payload);
          } else if (kind === "error") {
            return reject(payload.message);
          } else {
            return reject(payload);
          }
        });
      });
    };

    Merlin.prototype.position = function(point) {
      point = Point.fromObject(point);
      return {
        line: point.row + 1,
        col: point.column
      };
    };

    Merlin.prototype.point = function(position) {
      return new Point(position.line - 1, position.col);
    };

    Merlin.prototype.range = function(start, end) {
      return new Range(this.point(start), this.point(end));
    };

    Merlin.prototype.sync = function(buffer) {
      if (!buffer.isChanged()) {
        return Promise.resolve(true);
      }
      buffer.setChanged(false);
      if (this.protocol === 1) {
        return this.query(buffer, ["tell", "start", "at", this.position([0, 0])]).then((function(_this) {
          return function() {
            return _this.query(buffer, ["tell", "source-eof", buffer.getText()]);
          };
        })(this));
      } else if (this.protocol === 2) {
        return this.query(buffer, ["tell", "start", "end", buffer.getText()]);
      }
    };

    Merlin.prototype.setFlags = function(buffer, flags) {
      return this.query(buffer, ["flags", "set", flags]).then(function(arg) {
        var failures;
        failures = arg.failures;
        return failures != null ? failures : [];
      });
    };

    Merlin.prototype.usePackages = function(buffer, packages) {
      return this.query(buffer, ["find", "use", packages]).then(function(arg) {
        var failures;
        failures = arg.failures;
        return failures != null ? failures : [];
      });
    };

    Merlin.prototype.listPackages = function(buffer) {
      return this.query(buffer, ["find", "list"]);
    };

    Merlin.prototype.enableExtensions = function(buffer, extensions) {
      return this.query(buffer, ["extension", "enable", extensions]);
    };

    Merlin.prototype.listExtensions = function(buffer) {
      return this.query(buffer, ["extension", "list"]);
    };

    Merlin.prototype.addSourcePaths = function(buffer, paths) {
      return this.query(buffer, ["path", "add", "source", paths]);
    };

    Merlin.prototype.addBuildPaths = function(buffer, paths) {
      return this.query(buffer, ["path", "add", "build", paths]);
    };

    Merlin.prototype.type = function(buffer, point) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["type", "enclosing", "at", _this.position(point)]).then(function(types) {
            return types.map(function(arg) {
              var end, start, tail, type;
              start = arg.start, end = arg.end, type = arg.type, tail = arg.tail;
              return {
                range: _this.range(start, end),
                type: type,
                tail: tail
              };
            });
          });
        };
      })(this));
    };

    Merlin.prototype.destruct = function(buffer, range) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["case", "analysis", "from", _this.position(range.start), "to", _this.position(range.end)]).then(function(arg) {
            var content, end, ref1, start;
            (ref1 = arg[0], start = ref1.start, end = ref1.end), content = arg[1];
            return {
              range: _this.range(start, end),
              content: content
            };
          });
        };
      })(this));
    };

    Merlin.prototype.complete = function(buffer, point, prefix) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["complete", "prefix", prefix, "at", _this.position(point, "with", "doc")]).then(function(arg) {
            var entries;
            entries = arg.entries;
            return entries;
          });
        };
      })(this));
    };

    Merlin.prototype.expand = function(buffer, point, prefix) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["expand", "prefix", prefix, "at", _this.position(point)]).then(function(arg) {
            var entries;
            entries = arg.entries;
            return entries;
          });
        };
      })(this));
    };

    Merlin.prototype.occurrences = function(buffer, point) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["occurrences", "ident", "at", _this.position(point)]).then(function(occurrences) {
            return occurrences.map(function(arg) {
              var end, start;
              start = arg.start, end = arg.end;
              return _this.range(start, end);
            });
          });
        };
      })(this));
    };

    Merlin.prototype.locate = function(buffer, point, kind) {
      if (kind == null) {
        kind = 'ml';
      }
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["locate", null, kind, "at", _this.position(point)]).then(function(result) {
            return new Promise(function(resolve, reject) {
              if (typeof result === 'string') {
                return reject(result);
              } else {
                return resolve({
                  file: result.file,
                  point: _this.point(result.pos)
                });
              }
            });
          });
        };
      })(this));
    };

    Merlin.prototype.enclosing = function(buffer, point) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["enclosing", _this.position(point)]).then(function(selections) {
            return selections.map(function(arg) {
              var end, start;
              start = arg.start, end = arg.end;
              return _this.range(start, end);
            });
          });
        };
      })(this));
    };

    Merlin.prototype.errors = function(buffer) {
      return this.sync(buffer).then((function(_this) {
        return function() {
          return _this.query(buffer, ["errors"]).then(function(errors) {
            return errors.map(function(arg) {
              var end, i, indent, j, lines, message, ref1, start, type;
              start = arg.start, end = arg.end, type = arg.type, message = arg.message;
              lines = message.split('\n');
              lines[0] = lines[0][0].toUpperCase() + lines[0].slice(1);
              if (lines.length > 1) {
                indent = lines.slice(1).reduce(function(indent, line) {
                  return Math.min(indent, line.search(/\S|$/));
                }, 2e308);
                for (i = j = 1, ref1 = lines.length - 1; 1 <= ref1 ? j <= ref1 : j >= ref1; i = 1 <= ref1 ? ++j : --j) {
                  lines[i] = lines[i].slice(indent);
                }
              }
              return {
                range: (start != null) && (end != null) ? _this.range(start, end) : [[0, 0], [0, 0]],
                type: type,
                message: lines.join('\n')
              };
            });
          });
        };
      })(this));
    };

    Merlin.prototype.project = function(buffer) {
      return this.query(buffer, ["project", "get"]).then(function(arg) {
        var failures, result;
        result = arg.result, failures = arg.failures;
        return {
          merlinFiles: result,
          failures: failures
        };
      });
    };

    return Merlin;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvb2NhbWwtbWVybGluL2xpYi9tZXJsaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxRQUFTLE9BQUEsQ0FBUSxlQUFSOztFQUNULGtCQUFtQixPQUFBLENBQVEsVUFBUjs7RUFDcEIsTUFBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxpQkFBRCxFQUFROztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO3FCQUNyQixPQUFBLEdBQVM7O3NCQUNULFdBQUEsR0FBVzs7cUJBQ1gsUUFBQSxHQUFVOztxQkFFVixLQUFBLEdBQU87O0lBRU0sZ0JBQUE7TUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTLE9BQU8sQ0FBQyxPQUFSLENBQUE7TUFDVCxJQUFDLENBQUEsT0FBRCxDQUFBO0lBRlc7O3FCQUliLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCOztZQUNHLENBQUUsS0FBWixDQUFBOzs7WUFDUSxDQUFFLElBQVYsQ0FBQTs7TUFFQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUE7TUFDZixJQUFDLENBQUEsT0FBRCxHQUFXLEtBQUEsQ0FBTSxJQUFOLEVBQVksRUFBWixFQUFnQjtRQUFBLEdBQUEsRUFBUSxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF6QixHQUFnQyxZQUFhLENBQUEsQ0FBQSxDQUE3QyxHQUFxRCxTQUExRDtPQUFoQjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsU0FBQyxLQUFEO2VBQVcsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaO01BQVgsQ0FBckI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxNQUFaLEVBQW9CLFNB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QUFkLENBQXhCLEdBQStDLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQXREO2dCQUNBLElBQUEsRUFBTSxJQUROO2dCQUVBLE9BQUEsRUFBUyxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FGVDs7WUFUUyxDQUFYO1VBREksQ0FETjtRQURpQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7SUFETTs7cUJBaUJSLE9BQUEsR0FBUyxTQUFDLE1BQUQ7YUFDUCxJQUFDLENBQUEsS0FBRCxDQUFPLE1BQVAsRUFBZSxDQUFDLFNBQUQsRUFBWSxLQUFaLENBQWYsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLEdBQUQ7QUFDSixZQUFBO1FBRE0scUJBQVE7ZUFDZDtVQUFBLFdBQUEsRUFBYSxNQUFiO1VBQ0EsUUFBQSxFQUFVLFFBRFY7O01BREksQ0FETjtJQURPOzs7OztBQS9LWCIsInNvdXJjZXNDb250ZW50IjpbIntzcGF3bn0gPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xue2NyZWF0ZUludGVyZmFjZX0gPSByZXF1aXJlICdyZWFkbGluZSdcbntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBNZXJsaW5cbiAgcHJvY2VzczogbnVsbFxuICBpbnRlcmZhY2U6IG51bGxcbiAgcHJvdG9jb2w6IDJcblxuICBxdWV1ZTogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBxdWV1ZSA9IFByb21pc2UucmVzb2x2ZSgpXG4gICAgQHJlc3RhcnQoKVxuXG4gIHJlc3RhcnQ6IC0+XG4gICAgcGF0aCA9IGF0b20uY29uZmlnLmdldCAnb2NhbWwtbWVybGluLm1lcmxpblBhdGgnXG4gICAgQGludGVyZmFjZT8uY2xvc2UoKVxuICAgIEBwcm9jZXNzPy5raWxsKClcblxuICAgIHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgQHByb2Nlc3MgPSBzcGF3biBwYXRoLCBbXSwgY3dkOiBpZiBwcm9qZWN0UGF0aHMubGVuZ3RoID4gMCB0aGVuIHByb2plY3RQYXRoc1swXSBlbHNlIF9fZGlybmFtZVxuICAgIEBwcm9jZXNzLm9uICdlcnJvcicsIChlcnJvcikgLT4gY29uc29sZS5sb2cgZXJyb3JcbiAgICBAcHJvY2Vzcy5vbiAnZXhpdCcsIChjb2RlKSAtPiBjb25zb2xlLmxvZyBcIk1lcmxpbiBleGl0ZWQgd2l0aCBjb2RlICN7Y29kZX1cIlxuICAgIGNvbnNvbGUubG9nIFwiTWVybGluIHByb2Nlc3Mgc3RhcnRlZCwgcGlkID0gI3tAcHJvY2Vzcy5waWR9XCJcbiAgICBAaW50ZXJmYWNlID0gY3JlYXRlSW50ZXJmYWNlXG4gICAgICBpbnB1dDogQHByb2Nlc3Muc3Rkb3V0XG4gICAgICBvdXRwdXQ6IEBwcm9jZXNzLnN0ZGluXG4gICAgICB0ZXJtaW5hbDogZmFsc2VcbiAgICBAcmF3UXVlcnkgW1wicHJvdG9jb2xcIiwgXCJ2ZXJzaW9uXCIsIDJdXG4gICAgLnRoZW4gKFtraW5kLCBwYXlsb2FkXSkgPT5cbiAgICAgIEBwcm90b2NvbCA9IGlmIGtpbmQgaXMgXCJyZXR1cm5cIiB0aGVuIHBheWxvYWQuc2VsZWN0ZWQgZWxzZSAxXG5cbiAgY2xvc2U6IC0+XG4gICAgQGludGVyZmFjZT8uY2xvc2UoKVxuICAgIEBwcm9jZXNzPy5raWxsKClcblxuICByYXdRdWVyeTogKHF1ZXJ5KSAtPlxuICAgIEBxdWV1ZSA9IEBxdWV1ZS50aGVuID0+XG4gICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgICBqc29uUXVlcnkgPSBKU09OLnN0cmluZ2lmeSBxdWVyeVxuICAgICAgICBAaW50ZXJmYWNlLnF1ZXN0aW9uIGpzb25RdWVyeSArICdcXG4nLCAoYW5zd2VyKSAtPlxuICAgICAgICAgIHJlc29sdmUgSlNPTi5wYXJzZShhbnN3ZXIpXG5cbiAgcXVlcnk6IChidWZmZXIsIHF1ZXJ5KSAtPlxuICAgIEByYXdRdWVyeVxuICAgICAgY29udGV4dDogW1wiYXV0b1wiLCBidWZmZXIuZ2V0UGF0aCgpXVxuICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgLnRoZW4gKFtraW5kLCBwYXlsb2FkXSkgLT5cbiAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgIGlmIGtpbmQgaXMgXCJyZXR1cm5cIlxuICAgICAgICAgIHJlc29sdmUgcGF5bG9hZFxuICAgICAgICBlbHNlIGlmIGtpbmQgaXMgXCJlcnJvclwiXG4gICAgICAgICAgcmVqZWN0IHBheWxvYWQubWVzc2FnZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVqZWN0IHBheWxvYWRcblxuICBwb3NpdGlvbjogKHBvaW50KSAtPlxuICAgIHBvaW50ID0gUG9pbnQuZnJvbU9iamVjdCBwb2ludFxuICAgIHtsaW5lOiBwb2ludC5yb3cgKyAxLCBjb2w6IHBvaW50LmNvbHVtbn1cblxuICBwb2ludDogKHBvc2l0aW9uKSAtPlxuICAgIG5ldyBQb2ludCBwb3NpdGlvbi5saW5lIC0gMSwgcG9zaXRpb24uY29sXG5cbiAgcmFuZ2U6IChzdGFydCwgZW5kKSAtPlxuICAgIG5ldyBSYW5nZSAoQHBvaW50IHN0YXJ0KSwgKEBwb2ludCBlbmQpXG5cbiAgc3luYzogKGJ1ZmZlcikgLT5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpIHVubGVzcyBidWZmZXIuaXNDaGFuZ2VkKClcbiAgICBidWZmZXIuc2V0Q2hhbmdlZCBmYWxzZVxuICAgIGlmIEBwcm90b2NvbCBpcyAxXG4gICAgICBAcXVlcnkgYnVmZmVyLCBbXCJ0ZWxsXCIsIFwic3RhcnRcIiwgXCJhdFwiLCBAcG9zaXRpb24oWzAsIDBdKV1cbiAgICAgIC50aGVuID0+IEBxdWVyeSBidWZmZXIsIFtcInRlbGxcIiwgXCJzb3VyY2UtZW9mXCIsIGJ1ZmZlci5nZXRUZXh0KCldXG4gICAgZWxzZSBpZiBAcHJvdG9jb2wgaXMgMlxuICAgICAgQHF1ZXJ5IGJ1ZmZlciwgW1widGVsbFwiLCBcInN0YXJ0XCIsIFwiZW5kXCIsIGJ1ZmZlci5nZXRUZXh0KCldXG5cbiAgc2V0RmxhZ3M6IChidWZmZXIsIGZsYWdzKSAtPlxuICAgIEBxdWVyeSBidWZmZXIsIFtcImZsYWdzXCIsIFwic2V0XCIsIGZsYWdzXVxuICAgIC50aGVuICh7ZmFpbHVyZXN9KSAtPlxuICAgICAgZmFpbHVyZXMgPyBbXVxuXG4gIHVzZVBhY2thZ2VzOiAoYnVmZmVyLCBwYWNrYWdlcykgLT5cbiAgICBAcXVlcnkgYnVmZmVyLCBbXCJmaW5kXCIsIFwidXNlXCIsIHBhY2thZ2VzXVxuICAgIC50aGVuICh7ZmFpbHVyZXN9KSAtPlxuICAgICAgZmFpbHVyZXMgPyBbXVxuXG4gIGxpc3RQYWNrYWdlczogKGJ1ZmZlcikgLT5cbiAgICBAcXVlcnkgYnVmZmVyLCBbXCJmaW5kXCIsIFwibGlzdFwiXVxuXG4gIGVuYWJsZUV4dGVuc2lvbnM6IChidWZmZXIsIGV4dGVuc2lvbnMpIC0+XG4gICAgQHF1ZXJ5IGJ1ZmZlciwgW1wiZXh0ZW5zaW9uXCIsIFwiZW5hYmxlXCIsIGV4dGVuc2lvbnNdXG5cbiAgbGlzdEV4dGVuc2lvbnM6IChidWZmZXIpIC0+XG4gICAgQHF1ZXJ5IGJ1ZmZlciwgW1wiZXh0ZW5zaW9uXCIsIFwibGlzdFwiXVxuXG4gIGFkZFNvdXJjZVBhdGhzOiAoYnVmZmVyLCBwYXRocykgLT5cbiAgICBAcXVlcnkgYnVmZmVyLCBbXCJwYXRoXCIsIFwiYWRkXCIsIFwic291cmNlXCIsIHBhdGhzXVxuXG4gIGFkZEJ1aWxkUGF0aHM6IChidWZmZXIsIHBhdGhzKSAtPlxuICAgIEBxdWVyeSBidWZmZXIsIFtcInBhdGhcIiwgXCJhZGRcIiwgXCJidWlsZFwiLCBwYXRoc11cblxuICB0eXBlOiAoYnVmZmVyLCBwb2ludCkgLT5cbiAgICBAc3luYyhidWZmZXIpLnRoZW4gPT5cbiAgICAgIEBxdWVyeSBidWZmZXIsIFtcInR5cGVcIiwgXCJlbmNsb3NpbmdcIiwgXCJhdFwiLCBAcG9zaXRpb24gcG9pbnRdXG4gICAgICAudGhlbiAodHlwZXMpID0+XG4gICAgICAgIHR5cGVzLm1hcCAoe3N0YXJ0LCBlbmQsIHR5cGUsIHRhaWx9KSA9PlxuICAgICAgICAgIHJhbmdlOiBAcmFuZ2Ugc3RhcnQsIGVuZFxuICAgICAgICAgIHR5cGU6IHR5cGVcbiAgICAgICAgICB0YWlsOiB0YWlsXG5cbiAgZGVzdHJ1Y3Q6IChidWZmZXIsIHJhbmdlKSAtPlxuICAgIEBzeW5jKGJ1ZmZlcikudGhlbiA9PlxuICAgICAgQHF1ZXJ5IGJ1ZmZlciwgW1wiY2FzZVwiLCBcImFuYWx5c2lzXCIsIFwiZnJvbVwiLCBAcG9zaXRpb24ocmFuZ2Uuc3RhcnQpLFxuICAgICAgICAgICAgICAgICAgICAgIFwidG9cIiwgQHBvc2l0aW9uKHJhbmdlLmVuZCldXG4gICAgICAudGhlbiAoW3tzdGFydCwgZW5kfSwgY29udGVudF0pID0+XG4gICAgICAgIHJhbmdlOiBAcmFuZ2Ugc3RhcnQsIGVuZFxuICAgICAgICBjb250ZW50OiBjb250ZW50XG5cbiAgY29tcGxldGU6IChidWZmZXIsIHBvaW50LCBwcmVmaXgpIC0+XG4gICAgQHN5bmMoYnVmZmVyKS50aGVuID0+XG4gICAgICBAcXVlcnkgYnVmZmVyLCBbXCJjb21wbGV0ZVwiLCBcInByZWZpeFwiLCBwcmVmaXgsXG4gICAgICAgICAgICAgICAgICAgICAgXCJhdFwiLCBAcG9zaXRpb24gcG9pbnQsIFwid2l0aFwiLCBcImRvY1wiXVxuICAgICAgLnRoZW4gKHtlbnRyaWVzfSkgLT5cbiAgICAgICAgZW50cmllc1xuXG4gIGV4cGFuZDogKGJ1ZmZlciwgcG9pbnQsIHByZWZpeCkgLT5cbiAgICBAc3luYyhidWZmZXIpLnRoZW4gPT5cbiAgICAgIEBxdWVyeSBidWZmZXIsIFtcImV4cGFuZFwiLCBcInByZWZpeFwiLCBwcmVmaXgsXG4gICAgICAgICAgICAgICAgICAgICAgXCJhdFwiLCBAcG9zaXRpb24gcG9pbnRdXG4gICAgICAudGhlbiAoe2VudHJpZXN9KSAtPlxuICAgICAgICBlbnRyaWVzXG5cbiAgb2NjdXJyZW5jZXM6IChidWZmZXIsIHBvaW50KSAtPlxuICAgIEBzeW5jKGJ1ZmZlcikudGhlbiA9PlxuICAgICAgQHF1ZXJ5IGJ1ZmZlciwgW1wib2NjdXJyZW5jZXNcIiwgXCJpZGVudFwiLCBcImF0XCIsIEBwb3NpdGlvbiBwb2ludF1cbiAgICAgIC50aGVuIChvY2N1cnJlbmNlcykgPT5cbiAgICAgICAgb2NjdXJyZW5jZXMubWFwICh7c3RhcnQsIGVuZH0pID0+XG4gICAgICAgICAgQHJhbmdlIHN0YXJ0LCBlbmRcblxuICBsb2NhdGU6IChidWZmZXIsIHBvaW50LCBraW5kID0gJ21sJykgLT5cbiAgICBAc3luYyhidWZmZXIpLnRoZW4gPT5cbiAgICAgIEBxdWVyeSBidWZmZXIsIFtcImxvY2F0ZVwiLCBudWxsLCBraW5kLCBcImF0XCIsIEBwb3NpdGlvbiBwb2ludF1cbiAgICAgIC50aGVuIChyZXN1bHQpID0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgaWYgdHlwZW9mIHJlc3VsdCBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVqZWN0IHJlc3VsdFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc29sdmVcbiAgICAgICAgICAgICAgZmlsZTogcmVzdWx0LmZpbGVcbiAgICAgICAgICAgICAgcG9pbnQ6IEBwb2ludCByZXN1bHQucG9zXG5cbiAgZW5jbG9zaW5nOiAoYnVmZmVyLCBwb2ludCkgLT5cbiAgICBAc3luYyhidWZmZXIpLnRoZW4gPT5cbiAgICAgIEBxdWVyeSBidWZmZXIsIFtcImVuY2xvc2luZ1wiLCBAcG9zaXRpb24gcG9pbnRdXG4gICAgICAudGhlbiAoc2VsZWN0aW9ucykgPT5cbiAgICAgICAgc2VsZWN0aW9ucy5tYXAgKHtzdGFydCwgZW5kfSkgPT5cbiAgICAgICAgICBAcmFuZ2Ugc3RhcnQsIGVuZFxuXG4gIGVycm9yczogKGJ1ZmZlcikgLT5cbiAgICBAc3luYyhidWZmZXIpLnRoZW4gPT5cbiAgICAgIEBxdWVyeSBidWZmZXIsIFtcImVycm9yc1wiXVxuICAgICAgLnRoZW4gKGVycm9ycykgPT5cbiAgICAgICAgZXJyb3JzLm1hcCAoe3N0YXJ0LCBlbmQsIHR5cGUsIG1lc3NhZ2V9KSA9PlxuICAgICAgICAgIGxpbmVzID0gbWVzc2FnZS5zcGxpdCAnXFxuJ1xuICAgICAgICAgIGxpbmVzWzBdID0gbGluZXNbMF1bMF0udG9VcHBlckNhc2UoKSArIGxpbmVzWzBdWzEuLi0xXVxuICAgICAgICAgIGlmIGxpbmVzLmxlbmd0aCA+IDFcbiAgICAgICAgICAgIGluZGVudCA9IGxpbmVzWzEuLi0xXS5yZWR1Y2UgKGluZGVudCwgbGluZSkgLT5cbiAgICAgICAgICAgICAgTWF0aC5taW4gaW5kZW50LCBsaW5lLnNlYXJjaCAvXFxTfCQvXG4gICAgICAgICAgICAsIEluZmluaXR5XG4gICAgICAgICAgICBmb3IgaSBpbiBbMS4ubGluZXMubGVuZ3RoLTFdXG4gICAgICAgICAgICAgIGxpbmVzW2ldID0gbGluZXNbaV1baW5kZW50Li4tMV1cbiAgICAgICAgICByYW5nZTogaWYgc3RhcnQ/IGFuZCBlbmQ/IHRoZW4gQHJhbmdlIHN0YXJ0LCBlbmQgZWxzZSBbWzAsIDBdLCBbMCwgMF1dXG4gICAgICAgICAgdHlwZTogdHlwZVxuICAgICAgICAgIG1lc3NhZ2U6IGxpbmVzLmpvaW4gJ1xcbidcblxuICBwcm9qZWN0OiAoYnVmZmVyKSAtPlxuICAgIEBxdWVyeSBidWZmZXIsIFtcInByb2plY3RcIiwgXCJnZXRcIl1cbiAgICAudGhlbiAoe3Jlc3VsdCwgZmFpbHVyZXN9KSAtPlxuICAgICAgbWVybGluRmlsZXM6IHJlc3VsdFxuICAgICAgZmFpbHVyZXM6IGZhaWx1cmVzXG4iXX0=
