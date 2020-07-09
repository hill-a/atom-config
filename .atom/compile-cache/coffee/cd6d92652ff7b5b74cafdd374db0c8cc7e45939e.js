(function() {
  var CompositeDisposable, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  module.exports = {
    config: {
      lineLength: {
        type: 'integer',
        "default": '80'
      },
      filters: {
        type: 'string',
        "default": ''
      },
      extensions: {
        type: 'string',
        "default": 'c++,cc,cpp,cu,cuh,h,hpp'
      },
      executablePath: {
        type: 'string',
        "default": 'cpplint'
      }
    },
    activate: function() {
      require('atom-package-deps').install('linter-cpplint');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-cpplint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.cpplintPath = executablePath;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-cpplint.lineLength', (function(_this) {
        return function() {
          return _this.updateParameters();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter-cpplint.filters', (function(_this) {
        return function() {
          return _this.updateParameters();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter-cpplint.extensions', (function(_this) {
        return function() {
          return _this.updateParameters();
        };
      })(this)));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        name: 'cpplint',
        grammarScopes: ['source.cpp'],
        scope: 'file',
        lintsOnChange: false,
        lint: (function(_this) {
          return function(textEditor) {
            var execOpt, filePath, parameters;
            filePath = textEditor.getPath();
            parameters = _this.parameters.slice();
            parameters.push(filePath);
            execOpt = {
              stream: 'stderr',
              allowEmptyStderr: true,
              cwd: path.dirname(filePath)
            };
            return helpers.exec(_this.cpplintPath, parameters, execOpt).then(function(result) {
              var line, match, message, range, regex, toReturn;
              toReturn = [];
              regex = /.+:(\d+):(.+)\[\d+\]/g;
              while ((match = regex.exec(result)) !== null) {
                message = match[2];
                line = parseInt(match[1]) || 1;
                line = Math.max(0, line - 1);
                range = helpers.generateRange(textEditor, line);
                toReturn.push({
                  severity: 'warning',
                  excerpt: message,
                  location: {
                    file: filePath,
                    position: range
                  }
                });
              }
              return toReturn;
            });
          };
        })(this)
      };
    },
    updateParameters: function() {
      var extensions, filters, lineLength, parameters;
      lineLength = atom.config.get('linter-cpplint.lineLength');
      filters = atom.config.get('linter-cpplint.filters');
      extensions = atom.config.get('linter-cpplint.extensions');
      parameters = [];
      if (lineLength) {
        parameters.push('--linelength', lineLength);
      }
      if (filters) {
        parameters.push('--filter', filters);
      }
      if (extensions) {
        parameters.push('--extensions', extensions);
      }
      return this.parameters = parameters;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvbGludGVyLWNwcGxpbnQvbGliL2luaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FERjtNQUdBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO09BSkY7TUFNQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMseUJBRFQ7T0FQRjtNQVNBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxTQURUO09BVkY7S0FERjtJQWNBLFFBQUEsRUFBVSxTQUFBO01BQ1IsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsZ0JBQXJDO01BRUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLCtCQUFwQixFQUNuQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsY0FBRDtpQkFDRSxLQUFDLENBQUEsV0FBRCxHQUFlO1FBRGpCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURtQixDQUFuQjtNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlE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Q2IsVUFBQSxHQUFhO01BQ2IsSUFBRyxVQUFIO1FBQ0UsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsY0FBaEIsRUFBZ0MsVUFBaEMsRUFERjs7TUFFQSxJQUFHLE9BQUg7UUFDRSxVQUFVLENBQUMsSUFBWCxDQUFnQixVQUFoQixFQUE0QixPQUE1QixFQURGOztNQUVBLElBQUcsVUFBSDtRQUNFLFVBQVUsQ0FBQyxJQUFYLENBQWdCLGNBQWhCLEVBQWdDLFVBQWhDLEVBREY7O2FBRUEsSUFBQyxDQUFBLFVBQUQsR0FBYztJQVhFLENBOUVsQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgbGluZUxlbmd0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogJzgwJ1xuICAgIGZpbHRlcnM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICBleHRlbnNpb25zOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdjKyssY2MsY3BwLGN1LGN1aCxoLGhwcCdcbiAgICBleGVjdXRhYmxlUGF0aDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnY3BwbGludCdcblxuICBhY3RpdmF0ZTogLT5cbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1jcHBsaW50JylcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItY3BwbGludC5leGVjdXRhYmxlUGF0aCcsXG4gICAgKGV4ZWN1dGFibGVQYXRoKSA9PlxuICAgICAgQGNwcGxpbnRQYXRoID0gZXhlY3V0YWJsZVBhdGhcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItY3BwbGludC5saW5lTGVuZ3RoJywgPT5cbiAgICAgIEB1cGRhdGVQYXJhbWV0ZXJzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItY3BwbGludC5maWx0ZXJzJywgPT5cbiAgICAgIEB1cGRhdGVQYXJhbWV0ZXJzKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdsaW50ZXItY3BwbGludC5leHRlbnNpb25zJywgPT5cbiAgICAgIEB1cGRhdGVQYXJhbWV0ZXJzKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gIHByb3ZpZGVMaW50ZXI6IC0+XG4gICAgaGVscGVycyA9IHJlcXVpcmUoJ2F0b20tbGludGVyJylcbiAgICBwcm92aWRlciA9XG4gICAgICBuYW1lOiAnY3BwbGludCdcbiAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmNwcCddXG4gICAgICBzY29wZTogJ2ZpbGUnXG4gICAgICAjIGNwcGxpbnQgb25seSBsaW50cyBmaWxlKHMpLlxuICAgICAgbGludHNPbkNoYW5nZTogZmFsc2VcbiAgICAgIGxpbnQ6ICh0ZXh0RWRpdG9yKSA9PlxuICAgICAgICBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIHBhcmFtZXRlcnMgPSBAcGFyYW1ldGVycy5zbGljZSgpXG5cbiAgICAgICAgIyBGaWxlIHBhdGggaXMgdGhlIGxhc3QgcGFyYW1ldGVyLlxuICAgICAgICBwYXJhbWV0ZXJzLnB1c2goZmlsZVBhdGgpXG5cbiAgICAgICAgZXhlY09wdCA9XG4gICAgICAgICAgc3RyZWFtOiAnc3RkZXJyJ1xuICAgICAgICAgIGFsbG93RW1wdHlTdGRlcnI6IHRydWVcbiAgICAgICAgICBjd2Q6IHBhdGguZGlybmFtZShmaWxlUGF0aClcblxuICAgICAgICByZXR1cm4gaGVscGVyc1xuICAgICAgICAgICAgLmV4ZWMoQGNwcGxpbnRQYXRoLCBwYXJhbWV0ZXJzLCBleGVjT3B0KS50aGVuIChyZXN1bHQpIC0+XG4gICAgICAgICAgdG9SZXR1cm4gPSBbXVxuICAgICAgICAgIHJlZ2V4ID0gLy4rOihcXGQrKTooLispXFxbXFxkK1xcXS9nXG5cbiAgICAgICAgICB3aGlsZSAobWF0Y2ggPSByZWdleC5leGVjKHJlc3VsdCkpIGlzbnQgbnVsbFxuICAgICAgICAgICAgbWVzc2FnZSA9IG1hdGNoWzJdXG5cbiAgICAgICAgICAgICMgY3BwbGludCBsaW5lIGlzIDEtYmFzZWQuIExpbmUgMCBpcyBmb3IgY29weXJpZ2h0IGFuZCBoZWFkZXJfZ3VhcmQuXG4gICAgICAgICAgICBsaW5lID0gcGFyc2VJbnQobWF0Y2hbMV0pIG9yIDFcbiAgICAgICAgICAgIGxpbmUgPSBNYXRoLm1heCgwLCBsaW5lIC0gMSlcblxuICAgICAgICAgICAgcmFuZ2UgPSBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSlcblxuICAgICAgICAgICAgdG9SZXR1cm4ucHVzaCh7XG4gICAgICAgICAgICAgIHNldmVyaXR5OiAnd2FybmluZydcbiAgICAgICAgICAgICAgZXhjZXJwdDogbWVzc2FnZVxuICAgICAgICAgICAgICBsb2NhdGlvbjpcbiAgICAgICAgICAgICAgICBmaWxlOiBmaWxlUGF0aFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiByYW5nZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gdG9SZXR1cm5cblxuICB1cGRhdGVQYXJhbWV0ZXJzOiAtPlxuICAgIGxpbmVMZW5ndGggPSBhdG9tLmNvbmZpZy5nZXQgJ2xpbnRlci1jcHBsaW50LmxpbmVMZW5ndGgnXG4gICAgZmlsdGVycyA9IGF0b20uY29uZmlnLmdldCAnbGludGVyLWNwcGxpbnQuZmlsdGVycydcbiAgICBleHRlbnNpb25zID0gYXRvbS5jb25maWcuZ2V0ICdsaW50ZXItY3BwbGludC5leHRlbnNpb25zJ1xuICAgIHBhcmFtZXRlcnMgPSBbXVxuICAgIGlmIGxpbmVMZW5ndGhcbiAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1saW5lbGVuZ3RoJywgbGluZUxlbmd0aClcbiAgICBpZiBmaWx0ZXJzXG4gICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZmlsdGVyJywgZmlsdGVycylcbiAgICBpZiBleHRlbnNpb25zXG4gICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZXh0ZW5zaW9ucycsIGV4dGVuc2lvbnMpXG4gICAgQHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzXG4iXX0=
