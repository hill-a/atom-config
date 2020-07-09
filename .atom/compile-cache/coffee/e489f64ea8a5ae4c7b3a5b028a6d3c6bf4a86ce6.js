(function() {
  var $, GitRevSelector, GitRevSelectorPopup, _, moment,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require("atom-space-pen-views").$;

  _ = require('underscore-plus');

  moment = require('moment');

  GitRevSelectorPopup = require('./git-revselector-popup');

  module.exports = GitRevSelector = (function() {
    function GitRevSelector(leftOrRight, commit, onPreviousRevision, onNextRevision) {
      var $splitdiffElement;
      this.onPreviousRevision = onPreviousRevision;
      this.onNextRevision = onNextRevision;
      this._onNextRevClick = bind(this._onNextRevClick, this);
      this._onPreviousRevClick = bind(this._onPreviousRevClick, this);
      $splitdiffElement = $(".tool-panel .split-diff-ui .mid");
      $splitdiffElement.find(".timemachine-rev-select." + leftOrRight + "-rev").remove();
      this.$element = $("<div class='timemachine-rev-select " + leftOrRight + "-rev'>");
      if (leftOrRight === 'left') {
        $splitdiffElement.prepend(this.$element);
      } else {
        $splitdiffElement.append(this.$element);
      }
      if (commit != null) {
        this.revPopup = new GitRevSelectorPopup(commit, leftOrRight, this.$element);
      }
      this.render(leftOrRight, commit);
    }

    GitRevSelector.prototype.render = function(leftOrRight, commit) {
      var commitLabel, dateFormat;
      this.$element.text('');
      dateFormat = "MMM DD YYYY ha";
      commitLabel = "";
      if (commit != null) {
        commitLabel = moment.unix(commit.authorDate).format(dateFormat);
      }
      if (commit === void 0) {

      } else if (commit === null) {
        this._renderLeftButton();
        this._renderVersionLabel("Local Version");
        return this._renderRightButton({
          disabled: true
        });
      } else {
        this._renderLeftButton();
        this._renderVersionLabel(commitLabel);
        return this._renderRightButton();
      }
    };

    GitRevSelector.prototype.destroy = function() {
      var ref;
      this.$element.remove();
      return (ref = this.revPopup) != null ? ref.remove() : void 0;
    };

    GitRevSelector.prototype._renderLeftButton = function(options) {
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        click: this._onPreviousRevClick
      });
      return this._renderButton(" < ", options);
    };

    GitRevSelector.prototype._renderRightButton = function(options) {
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        click: this._onNextRevClick
      });
      return this._renderButton(" > ", options);
    };

    GitRevSelector.prototype._renderButton = function(text, options) {
      var $button;
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        "class": 'btn btn-small',
        click: null,
        disabled: false
      });
      $button = $("<button class='" + options["class"] + "'>" + text + "</button>");
      $button.attr('disabled', options.disabled);
      if (options.click != null) {
        $button.on('click.gtmRevSelector', options.click);
      }
      return this.$element.append($button);
    };

    GitRevSelector.prototype._renderVersionLabel = function(label) {
      return this.$element.append($("<span>" + label + "</span>"));
    };

    GitRevSelector.prototype._onPreviousRevClick = function() {
      var ref;
      return (ref = this.onPreviousRevision) != null ? ref.apply(this, arguments) : void 0;
    };

    GitRevSelector.prototype._onNextRevClick = function() {
      var ref;
      return (ref = this.onNextRevision) != null ? ref.apply(this, arguments) : void 0;
    };

    return GitRevSelector;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXJldi1zZWxlY3Rvci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLGlEQUFBO0lBQUE7O0VBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBQ04sQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBRVQsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSOztFQUd0QixNQUFNLENBQUMsT0FBUCxHQUF1QjtJQUVSLHdCQUFDLFdBQUQsRUFBYyxNQUFkLEVBQXNCLGtCQUF0QixFQUEyQyxjQUEzQztBQUNYLFVBQUE7TUFEaUMsSUFBQyxDQUFBLHFCQUFEO01BQXFCLElBQUMsQ0FBQSxpQkFBRDs7O01BQ3RELGlCQUFBLEdBQW9CLENBQUEsQ0FBRSxpQ0FBRjtNQUNwQixpQkFBaUIsQ0FBQyxJQUFsQixDQUF1QiwwQkFBQSxHQUEyQixXQUEzQixHQUF1QyxNQUE5RCxDQUFvRSxDQUFDLE1BQXJFLENBQUE7TUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBQUEsQ0FBRSxxQ0FBQSxHQUFzQyxXQUF0QyxHQUFrRCxRQUFwRDtNQUVaLElBQUcsV0FBQSxLQUFlLE1BQWxCO1FBQ0UsaUJBQWlCLENBQUMsT0FBbEIsQ0FBMEIsSUFBQyxDQUFBLFFBQTNCLEVBREY7T0FBQSxNQUFBO1FBR0UsaUJBQWlCLENBQUMsTUFBbEIsQ0FBeUIsSUFBQyxDQUFBLFFBQTFCLEVBSEY7O01BS0EsSUFBRyxjQUFIO1FBQ0UsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLG1CQUFKLENBQXdCLE1BQXhCLEVBQWdDLFdBQWhDLEVBQTZDLElBQUMsQ0FBQSxRQUE5QyxFQURkOztNQUdBLElBQUMsQ0FBQSxNQUFELENBQVEsV0FBUixFQUFxQixNQUFyQjtJQWRXOzs2QkFpQmIsTUFBQSxHQUFTLFNBQUMsV0FBRCxFQUFjLE1BQWQ7QUFDUCxVQUFBO01BQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsRUFBZjtNQUVBLFVBQUEsR0FBYTtNQUNiLFdBQUEsR0FBYztNQUNkLElBQUcsY0FBSDtRQUVFLFdBQUEsR0FBYyxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQU0sQ0FBQyxVQUFuQixDQUE4QixDQUFDLE1BQS9CLENBQXNDLFVBQXRDLEVBRmhCOztNQUlPLElBQUcsTUFBQSxLQUFVLE1BQWI7QUFBQTtPQUFBLE1BQ0YsSUFBRyxNQUFBLEtBQVUsSUFBYjtRQUNILElBQUMsQ0FBQSxpQkFBRCxDQUFBO1FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLGVBQXJCO2VBQ0EsSUFBQyxDQUFBLGtCQUFELENBQW9CO1VBQUEsUUFBQSxFQUFVLElBQVY7U0FBcEIsRUFIRztPQUFBLE1BQUE7UUFLSCxJQUFDLENBQUEsaUJBQUQsQ0FBQTtRQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixXQUFyQjtlQUNBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLEVBUEc7O0lBVkU7OzZCQW9CVCxPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7TUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBQTtnREFDUyxDQUFFLE1BQVgsQ0FBQTtJQUZPOzs2QkFLVCxpQkFBQSxHQUFtQixTQUFDLE9BQUQ7O1FBQUMsVUFBUTs7TUFDMUIsT0FBQSxHQUFVLENBQUMsQ0FBQyxRQUFGLENBQVcsT0FBWCxFQUNSO1FBQUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxtQkFBUjtPQURRO2FBR1YsSUFBQyxDQUFBLGFBQUQsQ0FBZSxLQUFmLEVBQXNCLE9BQXRCO0lBSmlCOzs2QkFPbkIsa0JBQUEsR0FBb0IsU0FBQyxPQUFEOztRQUFDLFVBQVE7O01BQzNCLE9BQUEsR0FBVSxDQUFDLENBQUMsUUFBRixDQUFXLE9BQVgsRUFDUjtRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsZUFBUjtPQURRO2FBR1YsSUFBQyxDQUFBLGFBQUQsQ0FBZSxLQUFmLEVBQXNCLE9BQXRCO0lBSmtCOzs2QkFPcEIsYUFBQSxHQUFlLFNBQUMsSUFBRCxFQUFPLE9BQVA7QUFDYixVQUFBOztRQURvQixVQUFROztNQUM1QixPQUFBLEdBQVUsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxPQUFYLEVBQ1I7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQVA7UUFDQSxLQUFBLEVBQU8sSUFEUDtRQUVBLFFBQUEsRUFBVSxLQUZWO09BRFE7TUFLVixPQUFBLEdBQVUsQ0FBQSxDQUFFLGlCQUFBLEdBQWtCLE9BQU8sRUFBQyxLQUFELEVBQXpCLEdBQWdDLElBQWhDLEdBQW9DLElBQXBDLEdBQXlDLFdBQTNDO01BQ1YsT0FBTyxDQUFDLElBQVIsQ0FBYSxVQUFiLEVBQXlCLE9BQU8sQ0FBQyxRQUFqQztNQUNBLElBQUcscUJBQUg7UUFDRSxPQUFPLENBQUMsRUFBUixDQUFXLHNCQUFYLEVBQW1DLE9BQU8sQ0FBQyxLQUEzQyxFQURGOzthQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixPQUFqQjtJQVhhOzs2QkFjZixtQkFBQSxHQUFxQixTQUFDLEtBQUQ7YUFDbkIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxNQUFWLENBQWlCLENBQUEsQ0FBRSxRQUFBLEdBQVMsS0FBVCxHQUFlLFNBQWpCLENBQWpCO0lBRG1COzs2QkFJckIsbUJBQUEsR0FBcUIsU0FBQTtBQUNuQixVQUFBOzBEQUFtQixDQUFFLEtBQXJCLENBQTJCLElBQTNCLEVBQThCLFNBQTlCO0lBRG1COzs2QkFJckIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtzREFBZSxDQUFFLEtBQWpCLENBQXVCLElBQXZCLEVBQTBCLFNBQTFCO0lBRGU7Ozs7O0FBdkZuQiIsInNvdXJjZXNDb250ZW50IjpbIlxueyR9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5tb21lbnQgPSByZXF1aXJlICdtb21lbnQnXG5cbkdpdFJldlNlbGVjdG9yUG9wdXAgPSByZXF1aXJlICcuL2dpdC1yZXZzZWxlY3Rvci1wb3B1cCdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdpdFJldlNlbGVjdG9yXG5cbiAgY29uc3RydWN0b3I6IChsZWZ0T3JSaWdodCwgY29tbWl0LCBAb25QcmV2aW91c1JldmlzaW9uLCBAb25OZXh0UmV2aXNpb24pIC0+XG4gICAgJHNwbGl0ZGlmZkVsZW1lbnQgPSAkKFwiLnRvb2wtcGFuZWwgLnNwbGl0LWRpZmYtdWkgLm1pZFwiKVxuICAgICRzcGxpdGRpZmZFbGVtZW50LmZpbmQoXCIudGltZW1hY2hpbmUtcmV2LXNlbGVjdC4je2xlZnRPclJpZ2h0fS1yZXZcIikucmVtb3ZlKClcbiAgICBcbiAgICBAJGVsZW1lbnQgPSAkKFwiPGRpdiBjbGFzcz0ndGltZW1hY2hpbmUtcmV2LXNlbGVjdCAje2xlZnRPclJpZ2h0fS1yZXYnPlwiKVxuICAgIFxuICAgIGlmIGxlZnRPclJpZ2h0ID09ICdsZWZ0J1xuICAgICAgJHNwbGl0ZGlmZkVsZW1lbnQucHJlcGVuZCBAJGVsZW1lbnRcbiAgICBlbHNlXG4gICAgICAkc3BsaXRkaWZmRWxlbWVudC5hcHBlbmQgQCRlbGVtZW50XG4gICAgXG4gICAgaWYgY29tbWl0P1xuICAgICAgQHJldlBvcHVwID0gbmV3IEdpdFJldlNlbGVjdG9yUG9wdXAoY29tbWl0LCBsZWZ0T3JSaWdodCwgQCRlbGVtZW50KVxuXG4gICAgQHJlbmRlcihsZWZ0T3JSaWdodCwgY29tbWl0KVxuICAgIFxuXG4gIHJlbmRlcjogIChsZWZ0T3JSaWdodCwgY29tbWl0KSAtPlxuICAgIEAkZWxlbWVudC50ZXh0KCcnKVxuICAgIFxuICAgIGRhdGVGb3JtYXQgPSBcIk1NTSBERCBZWVlZIGhhXCJcbiAgICBjb21taXRMYWJlbCA9IFwiXCJcbiAgICBpZiBjb21taXQ/XG4gICAgICAjIGNvbW1pdExhYmVsID0gXCIje2NvbW1pdERhdGV9ICN7cmV2SGFzaH1cIiAgI3Rha2VzIHVwIHRvbyBtdWNoIHNwYWNlIHdpdGggcmV2SGFzaFxuICAgICAgY29tbWl0TGFiZWwgPSBtb21lbnQudW5peChjb21taXQuYXV0aG9yRGF0ZSkuZm9ybWF0KGRhdGVGb3JtYXQpXG5cbiAgICByZXR1cm4gaWYgY29tbWl0ID09IHVuZGVmaW5lZFxuICAgIGVsc2UgaWYgY29tbWl0ID09IG51bGxcbiAgICAgIEBfcmVuZGVyTGVmdEJ1dHRvbigpIFxuICAgICAgQF9yZW5kZXJWZXJzaW9uTGFiZWwoXCJMb2NhbCBWZXJzaW9uXCIpXG4gICAgICBAX3JlbmRlclJpZ2h0QnV0dG9uKGRpc2FibGVkOiB0cnVlKVxuICAgIGVsc2VcbiAgICAgIEBfcmVuZGVyTGVmdEJ1dHRvbigpXG4gICAgICBAX3JlbmRlclZlcnNpb25MYWJlbChjb21taXRMYWJlbClcbiAgICAgIEBfcmVuZGVyUmlnaHRCdXR0b24oKVxuXG4gIFxuICBkZXN0cm95OiAoKSAtPlxuICAgIEAkZWxlbWVudC5yZW1vdmUoKVxuICAgIEByZXZQb3B1cD8ucmVtb3ZlKClcbiAgICBcbiAgXG4gIF9yZW5kZXJMZWZ0QnV0dG9uOiAob3B0aW9ucz17fSkgLT5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyBvcHRpb25zLFxuICAgICAgY2xpY2s6IEBfb25QcmV2aW91c1JldkNsaWNrXG4gICAgXG4gICAgQF9yZW5kZXJCdXR0b24gXCIgPCBcIiwgb3B0aW9uc1xuICAgICAgICBcbiAgICAgIFxuICBfcmVuZGVyUmlnaHRCdXR0b246IChvcHRpb25zPXt9KSAtPlxuICAgIG9wdGlvbnMgPSBfLmRlZmF1bHRzIG9wdGlvbnMsXG4gICAgICBjbGljazogQF9vbk5leHRSZXZDbGlja1xuICAgIFxuICAgIEBfcmVuZGVyQnV0dG9uIFwiID4gXCIsIG9wdGlvbnNcbiAgICBcblxuICBfcmVuZGVyQnV0dG9uOiAodGV4dCwgb3B0aW9ucz17fSkgLT5cbiAgICBvcHRpb25zID0gXy5kZWZhdWx0cyBvcHRpb25zLFxuICAgICAgY2xhc3M6ICdidG4gYnRuLXNtYWxsJ1xuICAgICAgY2xpY2s6IG51bGxcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgIFxuICAgICRidXR0b24gPSAkKFwiPGJ1dHRvbiBjbGFzcz0nI3tvcHRpb25zLmNsYXNzfSc+I3t0ZXh0fTwvYnV0dG9uPlwiKSBcbiAgICAkYnV0dG9uLmF0dHIoJ2Rpc2FibGVkJywgb3B0aW9ucy5kaXNhYmxlZClcbiAgICBpZiBvcHRpb25zLmNsaWNrP1xuICAgICAgJGJ1dHRvbi5vbiAnY2xpY2suZ3RtUmV2U2VsZWN0b3InLCBvcHRpb25zLmNsaWNrXG4gICAgXG4gICAgQCRlbGVtZW50LmFwcGVuZCAkYnV0dG9uXG5cblxuICBfcmVuZGVyVmVyc2lvbkxhYmVsOiAobGFiZWwpIC0+XG4gICAgQCRlbGVtZW50LmFwcGVuZCAkKFwiPHNwYW4+I3tsYWJlbH08L3NwYW4+XCIpXG5cblxuICBfb25QcmV2aW91c1JldkNsaWNrOiA9PlxuICAgIEBvblByZXZpb3VzUmV2aXNpb24/LmFwcGx5KEAsIGFyZ3VtZW50cylcbiAgICBcbiAgXG4gIF9vbk5leHRSZXZDbGljazogPT5cbiAgICBAb25OZXh0UmV2aXNpb24/LmFwcGx5KEAsIGFyZ3VtZW50cylcbiAgICBcbiAgICAiXX0=
