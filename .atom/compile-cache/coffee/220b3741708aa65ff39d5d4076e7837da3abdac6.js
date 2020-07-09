(function() {
  var $, GitTimeplot, View, _, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View;

  _ = require('underscore-plus');

  module.exports = GitTimeplot = (function() {
    GitTimeplot.prototype.className = 'gtm-hz-scroller';

    function GitTimeplot($parentElement) {
      var ref1;
      this.$parentElement = $parentElement;
      this._onTouchClick = bind(this._onTouchClick, this);
      this._onScroll = bind(this._onScroll, this);
      this._debouncedOnScroll = _.debounce(this._onScroll, 100);
      this.$element = this.$parentElement.find("." + this.className);
      if (!(((ref1 = this.$element) != null ? ref1.length : void 0) > 0)) {
        this.$element = $("<div class='" + this.className + "'>");
        this.$parentElement.append(this.$element);
        this.$element.on('scroll.gtmHzScroller', this._onScroll);
      }
    }

    GitTimeplot.prototype.render = function(initialScrollLeft) {
      this.initialScrollLeft = initialScrollLeft != null ? initialScrollLeft : 0;
      this._toggleTouchAreas();
      this.$element.scrollLeft(this.initialScrollLeft);
      return this.$element;
    };

    GitTimeplot.prototype.scrollFarRight = function() {
      return this.$element.scrollLeft(this._getChildWidth() - this.$element.width());
    };

    GitTimeplot.prototype.scrollFarLeft = function() {
      return this.$element.scrollLeft(0);
    };

    GitTimeplot.prototype.getScrollLeft = function() {
      return this.$element.scrollLeft();
    };

    GitTimeplot.prototype.getScrollRight = function() {
      return this.$element.scrollLeft() + this.$element.width();
    };

    GitTimeplot.prototype._onScroll = function() {
      return this._toggleTouchAreas();
    };

    GitTimeplot.prototype._onTouchClick = function(which) {
      switch (which) {
        case "left":
          return this.scrollFarLeft();
        case "right":
          return this.scrollFarRight();
      }
    };

    GitTimeplot.prototype._toggleTouchAreas = function() {
      this._toggleTouchArea('left');
      return this._toggleTouchArea('right');
    };

    GitTimeplot.prototype._toggleTouchArea = function(which) {
      var $touchArea, areaLeft, ref1, relativeRight, scrollLeft, shouldHide;
      $touchArea = this.$element.find(".gtm-touch-area.gtm-" + which);
      if (!($touchArea.length > 0)) {
        $touchArea = $("<div class='gtm-touch-area gtm-" + which + "'>");
        $touchArea.on("click.gtmTouchArea", (function(_this) {
          return function() {
            return _this._onTouchClick(which);
          };
        })(this));
        this.$element.prepend($touchArea);
      }
      scrollLeft = this.getScrollLeft();
      relativeRight = this.getScrollRight();
      ref1 = (function() {
        switch (which) {
          case 'left':
            return {
              shouldHide: scrollLeft === 0,
              areaLeft: scrollLeft
            };
          case 'right':
            return {
              shouldHide: relativeRight >= this._getChildWidth() - 10,
              areaLeft: relativeRight - 20
            };
        }
      }).call(this), shouldHide = ref1.shouldHide, areaLeft = ref1.areaLeft;
      if (shouldHide) {
        return $touchArea.hide();
      } else {
        $touchArea.css({
          left: areaLeft
        });
        return $touchArea.show();
      }
    };

    GitTimeplot.prototype._getChildWidth = function() {
      return this.$element.find('.timeplot').outerWidth(true);
    };

    return GitTimeplot;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvaHotc2Nyb2xsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSw0QkFBQTtJQUFBOztFQUFBLE1BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFELEVBQUk7O0VBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSixNQUFNLENBQUMsT0FBUCxHQUF1QjswQkFDckIsU0FBQSxHQUFXOztJQUVFLHFCQUFDLGNBQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLGlCQUFEOzs7TUFDWixJQUFDLENBQUEsa0JBQUQsR0FBc0IsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxJQUFDLENBQUEsU0FBWixFQUF1QixHQUF2QjtNQUV0QixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsR0FBQSxHQUFJLElBQUMsQ0FBQSxTQUExQjtNQUNaLElBQUEsQ0FBQSx1Q0FBZ0IsQ0FBRSxnQkFBWCxHQUFvQixDQUEzQixDQUFBO1FBQ0UsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFBLENBQUUsY0FBQSxHQUFlLElBQUMsQ0FBQSxTQUFoQixHQUEwQixJQUE1QjtRQUNaLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBaEIsQ0FBdUIsSUFBQyxDQUFBLFFBQXhCO1FBQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxFQUFWLENBQWEsc0JBQWIsRUFBcUMsSUFBQyxDQUFBLFNBQXRDLEVBSEY7O0lBSlc7OzBCQVdiLE1BQUEsR0FBUSxTQUFDLGlCQUFEO01BQUMsSUFBQyxDQUFBLGdEQUFELG9CQUFtQjtNQUMxQixJQUFDLENBQUEsaUJBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixDQUFxQixJQUFDLENBQUEsaUJBQXRCO0FBQ0EsYUFBTyxJQUFDLENBQUE7SUFIRjs7MEJBTVIsY0FBQSxHQUFnQixTQUFBO2FBQ2QsSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQXFCLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBQSxHQUFvQixJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBQSxDQUF6QztJQURjOzswQkFJaEIsYUFBQSxHQUFlLFNBQUE7YUFDYixJQUFDLENBQUEsUUFBUSxDQUFDLFVBQVYsQ0FBcUIsQ0FBckI7SUFEYTs7MEJBSWYsYUFBQSxHQUFlLFNBQUE7QUFDYixhQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsVUFBVixDQUFBO0lBRE07OzBCQUlmLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLGFBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxVQUFWLENBQUEsQ0FBQSxHQUF5QixJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsQ0FBQTtJQURsQjs7MEJBSWhCLFNBQUEsR0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFEUzs7MEJBSVgsYUFBQSxHQUFlLFNBQUMsS0FBRDtBQUNiLGNBQU8sS0FBUDtBQUFBLGFBQ00sTUFETjtpQkFDa0IsSUFBQyxDQUFBLGFBQUQsQ0FBQTtBQURsQixhQUVNLE9BRk47aUJBRW1CLElBQUMsQ0FBQSxjQUFELENBQUE7QUFGbkI7SUFEYTs7MEJBTWYsaUJBQUEsR0FBbUIsU0FBQTtNQUNqQixJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsTUFBbEI7YUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsT0FBbEI7SUFGaUI7OzBCQUtuQixnQkFBQSxHQUFrQixTQUFDLEtBQUQ7QUFDaEIsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxzQkFBQSxHQUF1QixLQUF0QztNQUNiLElBQUEsQ0FBQSxDQUFPLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQTNCLENBQUE7UUFDRSxVQUFBLEdBQWEsQ0FBQSxDQUFFLGlDQUFBLEdBQWtDLEtBQWxDLEdBQXdDLElBQTFDO1FBQ2IsVUFBVSxDQUFDLEVBQVgsQ0FBYyxvQkFBZCxFQUFvQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxhQUFELENBQWUsS0FBZjtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQztRQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBVixDQUFrQixVQUFsQixFQUhGOztNQUtBLFVBQUEsR0FBYSxJQUFDLENBQUEsYUFBRCxDQUFBO01BQ2IsYUFBQSxHQUFnQixJQUFDLENBQUEsY0FBRCxDQUFBO01BRWhCO0FBQXlCLGdCQUFPLEtBQVA7QUFBQSxlQUNsQixNQURrQjttQkFFckI7Y0FBQSxVQUFBLEVBQVksVUFBQSxLQUFjLENBQTFCO2NBQ0EsUUFBQSxFQUFVLFVBRFY7O0FBRnFCLGVBSWxCLE9BSmtCO21CQUtyQjtjQUFBLFVBQUEsRUFBWSxhQUFBLElBQWlCLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBQSxHQUFvQixFQUFqRDtjQUNBLFFBQUEsRUFBVSxhQUFBLEdBQWdCLEVBRDFCOztBQUxxQjttQkFBekIsRUFBQyw0QkFBRCxFQUFhO01BUWIsSUFBRyxVQUFIO2VBQ0UsVUFBVSxDQUFDLElBQVgsQ0FBQSxFQURGO09BQUEsTUFBQTtRQUdFLFVBQVUsQ0FBQyxHQUFYLENBQWU7VUFBQyxJQUFBLEVBQU0sUUFBUDtTQUFmO2VBQ0EsVUFBVSxDQUFDLElBQVgsQ0FBQSxFQUpGOztJQWxCZ0I7OzBCQXlCbEIsY0FBQSxHQUFnQixTQUFBO2FBQ2QsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsV0FBZixDQUEyQixDQUFDLFVBQTVCLENBQXVDLElBQXZDO0lBRGM7Ozs7O0FBL0VsQiIsInNvdXJjZXNDb250ZW50IjpbIlxueyQsIFZpZXd9ID0gcmVxdWlyZSBcImF0b20tc3BhY2UtcGVuLXZpZXdzXCJcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2l0VGltZXBsb3RcbiAgY2xhc3NOYW1lOiAnZ3RtLWh6LXNjcm9sbGVyJ1xuXG4gIGNvbnN0cnVjdG9yOiAoQCRwYXJlbnRFbGVtZW50KS0+XG4gICAgQF9kZWJvdW5jZWRPblNjcm9sbCA9IF8uZGVib3VuY2UgQF9vblNjcm9sbCwgMTAwXG4gICAgXG4gICAgQCRlbGVtZW50ID0gQCRwYXJlbnRFbGVtZW50LmZpbmQoXCIuI3tAY2xhc3NOYW1lfVwiKVxuICAgIHVubGVzcyBAJGVsZW1lbnQ/Lmxlbmd0aCA+IDBcbiAgICAgIEAkZWxlbWVudCA9ICQoXCI8ZGl2IGNsYXNzPScje0BjbGFzc05hbWV9Jz5cIilcbiAgICAgIEAkcGFyZW50RWxlbWVudC5hcHBlbmQgQCRlbGVtZW50XG4gICAgICBAJGVsZW1lbnQub24gJ3Njcm9sbC5ndG1IelNjcm9sbGVyJywgQF9vblNjcm9sbFxuXG5cblxuICByZW5kZXI6IChAaW5pdGlhbFNjcm9sbExlZnQ9MCkgLT5cbiAgICBAX3RvZ2dsZVRvdWNoQXJlYXMoKVxuICAgIEAkZWxlbWVudC5zY3JvbGxMZWZ0KEBpbml0aWFsU2Nyb2xsTGVmdClcbiAgICByZXR1cm4gQCRlbGVtZW50XG5cblxuICBzY3JvbGxGYXJSaWdodDogKCkgLT5cbiAgICBAJGVsZW1lbnQuc2Nyb2xsTGVmdChAX2dldENoaWxkV2lkdGgoKSAtIEAkZWxlbWVudC53aWR0aCgpKVxuXG5cbiAgc2Nyb2xsRmFyTGVmdDogKCkgLT5cbiAgICBAJGVsZW1lbnQuc2Nyb2xsTGVmdCgwKVxuXG5cbiAgZ2V0U2Nyb2xsTGVmdDogKCkgLT5cbiAgICByZXR1cm4gQCRlbGVtZW50LnNjcm9sbExlZnQoKVxuXG5cbiAgZ2V0U2Nyb2xsUmlnaHQ6ICgpIC0+XG4gICAgcmV0dXJuIEAkZWxlbWVudC5zY3JvbGxMZWZ0KCkgKyBAJGVsZW1lbnQud2lkdGgoKVxuXG5cbiAgX29uU2Nyb2xsOiA9PlxuICAgIEBfdG9nZ2xlVG91Y2hBcmVhcygpXG4gICAgXG4gICAgXG4gIF9vblRvdWNoQ2xpY2s6ICh3aGljaCkgPT5cbiAgICBzd2l0Y2god2hpY2gpXG4gICAgIHdoZW4gXCJsZWZ0XCIgdGhlbiBAc2Nyb2xsRmFyTGVmdCgpXG4gICAgIHdoZW4gXCJyaWdodFwiIHRoZW4gQHNjcm9sbEZhclJpZ2h0KClcblxuXG4gIF90b2dnbGVUb3VjaEFyZWFzOiAtPlxuICAgIEBfdG9nZ2xlVG91Y2hBcmVhKCdsZWZ0JylcbiAgICBAX3RvZ2dsZVRvdWNoQXJlYSgncmlnaHQnKVxuXG5cbiAgX3RvZ2dsZVRvdWNoQXJlYTogKHdoaWNoKS0+XG4gICAgJHRvdWNoQXJlYSA9IEAkZWxlbWVudC5maW5kKFwiLmd0bS10b3VjaC1hcmVhLmd0bS0je3doaWNofVwiKVxuICAgIHVubGVzcyAkdG91Y2hBcmVhLmxlbmd0aCA+IDBcbiAgICAgICR0b3VjaEFyZWEgPSAkKFwiPGRpdiBjbGFzcz0nZ3RtLXRvdWNoLWFyZWEgZ3RtLSN7d2hpY2h9Jz5cIilcbiAgICAgICR0b3VjaEFyZWEub24gXCJjbGljay5ndG1Ub3VjaEFyZWFcIiwgPT4gQF9vblRvdWNoQ2xpY2sod2hpY2gpXG4gICAgICBAJGVsZW1lbnQucHJlcGVuZCgkdG91Y2hBcmVhKVxuICAgIFxuICAgIHNjcm9sbExlZnQgPSBAZ2V0U2Nyb2xsTGVmdCgpXG4gICAgcmVsYXRpdmVSaWdodCA9IEBnZXRTY3JvbGxSaWdodCgpXG4gICAgXG4gICAge3Nob3VsZEhpZGUsIGFyZWFMZWZ0fSA9IHN3aXRjaCB3aGljaFxuICAgICAgd2hlbiAnbGVmdCdcbiAgICAgICAgc2hvdWxkSGlkZTogc2Nyb2xsTGVmdCA9PSAwXG4gICAgICAgIGFyZWFMZWZ0OiBzY3JvbGxMZWZ0XG4gICAgICB3aGVuICdyaWdodCdcbiAgICAgICAgc2hvdWxkSGlkZTogcmVsYXRpdmVSaWdodCA+PSBAX2dldENoaWxkV2lkdGgoKSAtIDEwXG4gICAgICAgIGFyZWFMZWZ0OiByZWxhdGl2ZVJpZ2h0IC0gMjBcbiAgICBcbiAgICBpZiBzaG91bGRIaWRlXG4gICAgICAkdG91Y2hBcmVhLmhpZGUoKVxuICAgIGVsc2VcbiAgICAgICR0b3VjaEFyZWEuY3NzKHtsZWZ0OiBhcmVhTGVmdH0pXG4gICAgICAkdG91Y2hBcmVhLnNob3coKVxuXG5cbiAgX2dldENoaWxkV2lkdGg6IC0+XG4gICAgQCRlbGVtZW50LmZpbmQoJy50aW1lcGxvdCcpLm91dGVyV2lkdGgodHJ1ZSlcbiAgICBcblxuXG5cbiJdfQ==
