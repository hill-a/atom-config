(function() {
  var $, GitRevSelector, GitTimeplot, GitTimeplotPopup, View, _, d3, moment, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View;

  _ = require('underscore-plus');

  moment = require('moment');

  d3 = require('d3');

  GitTimeplotPopup = require('./git-timeplot-popup');

  GitRevSelector = require('./git-rev-selector');

  module.exports = GitTimeplot = (function() {
    function GitTimeplot(parentElement) {
      this._onViewRevision = bind(this._onViewRevision, this);
      this._bindMouseEvents = bind(this._bindMouseEvents, this);
      this._onRevSelectorNextPreviousRev = bind(this._onRevSelectorNextPreviousRev, this);
      this.$parentElement = $(parentElement);
      this.$closeHandle = this.$parentElement.find(".close-handle");
      this._debouncedRenderPopup = _.debounce(this._renderPopup, 50);
      this._debouncedHidePopup = _.debounce(this._hidePopup, 50);
      this._debouncedViewNearestRevision = _.debounce(this._viewNearestRevision, 100);
      this.leftRevHash = null;
      this.rightRevHash = null;
    }

    GitTimeplot.prototype.hide = function() {
      var ref1;
      return (ref1 = this.popup) != null ? ref1.remove() : void 0;
    };

    GitTimeplot.prototype.show = function() {};

    GitTimeplot.prototype.render = function(commitData, zoom, onViewRevision) {
      var ref1, svg;
      this.commitData = commitData;
      this.zoom = zoom;
      this.onViewRevision = onViewRevision;
      if ((ref1 = this.popup) != null) {
        ref1.remove();
      }
      this.$element = this.$parentElement.find('.timeplot');
      if (this.$element.length <= 0) {
        this.$element = $("<div class='timeplot'>");
        this.$parentElement.append(this.$element);
      }
      if (this.commitData.length <= 0) {
        this.$element.html("<div class='placeholder'>No commits, nothing to see here.</div>");
        return;
      }
      this.$element.width(this.zoom * 100 + '%');
      svg = d3.select(this.$element.get(0)).append("svg").attr("width", this.$element.width()).attr("height", 100);
      this._renderAxis(svg);
      this._renderBlobs(svg);
      this._renderHoverMarker();
      this._renderRevMarkers();
      this._renderRevSelectors();
      this._bindMouseEvents();
      return this.$element;
    };

    GitTimeplot.prototype.setRevisions = function(leftRevHash, rightRevHash) {
      this.leftRevHash = leftRevHash;
      this.rightRevHash = rightRevHash;
      if (this.leftRevHash == null) {
        this.leftRevHash = void 0;
      }
      if (this.rightRevHash == null) {
        this.rightRevHash = null;
      }
      this._renderRevMarkers();
      return this._renderRevSelectors();
    };

    GitTimeplot.prototype._renderAxis = function(svg) {
      var h, left_pad, maxDate, maxHour, minDate, minHour, pad, w, xAxis, yAxis;
      w = this.$element.width();
      h = 100;
      left_pad = 20;
      pad = 20;
      minDate = moment.unix(this.commitData[this.commitData.length - 1].authorDate).toDate();
      maxDate = moment.unix(this.commitData[0].authorDate).toDate();
      minHour = d3.min(this.commitData.map(function(d) {
        return moment.unix(d.authorDate).hour();
      }));
      maxHour = d3.max(this.commitData.map(function(d) {
        return moment.unix(d.authorDate).hour();
      }));
      this.x = d3.time.scale().domain([minDate, maxDate]).range([left_pad, w - pad]);
      this.y = d3.scale.linear().domain([minHour, maxHour]).range([10, h - pad * 2]);
      xAxis = d3.svg.axis().scale(this.x).orient("bottom");
      yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(0);
      svg.append("g").attr("class", "axis").attr("transform", "translate(0, " + (h - pad) + ")").call(xAxis);
      return svg.append("g").attr("class", "axis").attr("transform", "translate(" + (left_pad - pad) + ", 0)").call(yAxis);
    };

    GitTimeplot.prototype._renderBlobs = function(svg) {
      var max_r, r;
      max_r = d3.max(this.commitData.map(function(d) {
        return d.linesAdded + d.linesDeleted;
      }));
      r = d3.scale.linear().domain([0, max_r]).range([3, 15]);
      return svg.selectAll("circle").data(this.commitData).enter().append("circle").attr("class", "circle").attr("cx", (function(_this) {
        return function(d) {
          return _this.x(moment.unix(d.authorDate).toDate());
        };
      })(this)).attr("cy", (function(_this) {
        return function(d) {
          return _this.y(moment.unix(d.authorDate).hour());
        };
      })(this)).transition().duration(500).attr("r", function(d) {
        return r(d.linesAdded + d.linesDeleted || 0);
      });
    };

    GitTimeplot.prototype._renderHoverMarker = function() {
      this.$hoverMarker = this.$element.find('.hover-marker');
      if (!(this.$hoverMarker.length > 0)) {
        this.$hoverMarker = $("<div class='hover-marker'>");
        return this.$element.append(this.$hoverMarker);
      }
    };

    GitTimeplot.prototype._renderRevMarkers = function() {
      this._renderRevMarker('left');
      this._renderRevMarker('right');
      if (this._leftRev) {
        return this.$element.find('.left-rev-marker').show();
      }
    };

    GitTimeplot.prototype._renderRevMarker = function(whichRev) {
      var $revMarker, commit, revHash;
      $revMarker = this.$element.find("." + whichRev + "-rev-marker");
      if (!($revMarker.length > 0)) {
        $revMarker = $("<div class='" + whichRev + "-rev-marker'>");
        this.$element.append($revMarker);
      }
      revHash = this[whichRev + "RevHash"];
      commit = this._findCommit(revHash);
      if (commit === void 0) {
        return;
      }
      if (commit == null) {
        $revMarker.show().css({
          left: this.$element.width() - 10
        });
        return;
      }
      return $revMarker.show().css({
        left: this.x(moment.unix(commit.authorDate).toDate()),
        right: 'initial'
      });
    };

    GitTimeplot.prototype._renderRevSelectors = function() {
      return _.delay((function(_this) {
        return function() {
          _this._renderRevSelector('left');
          return _this._renderRevSelector('right');
        };
      })(this), 1000);
    };

    GitTimeplot.prototype._renderRevSelector = function(leftOrRight) {
      var commit, ref1, revHash;
      revHash = this[leftOrRight + "RevHash"];
      commit = this._findCommit(revHash);
      if ((ref1 = this[leftOrRight + "RevSelector"]) != null) {
        ref1.destroy();
      }
      return this[leftOrRight + "RevSelector"] = new GitRevSelector(leftOrRight, commit, (function(_this) {
        return function() {
          return _this._onRevSelectorNextPreviousRev(leftOrRight, -1);
        };
      })(this), (function(_this) {
        return function() {
          return _this._onRevSelectorNextPreviousRev(leftOrRight, +1);
        };
      })(this));
    };

    GitTimeplot.prototype._onRevSelectorNextPreviousRev = function(leftOrRight, offset) {
      var adjacentRevHash, currentRevHash;
      currentRevHash = this[leftOrRight + "RevHash"];
      adjacentRevHash = this._findAdjacentRevHash(currentRevHash, offset);
      return this._onViewRevision(adjacentRevHash, leftOrRight === 'right');
    };

    GitTimeplot.prototype._bindMouseEvents = function() {
      var _this;
      _this = this;
      this.$element.mouseenter(function(e) {
        return _this._onMouseenter(e);
      });
      this.$element.mousemove(function(e) {
        return _this._onMousemove(e);
      });
      this.$element.mouseleave(function(e) {
        return _this._onMouseleave(e);
      });
      this.$element.mousedown(function(e) {
        return _this._onMousedown(e);
      });
      this.$element.mouseup(function(e) {
        return _this._onMouseup(e);
      });
      this.$closeHandle.mouseenter(function(e) {
        return _this._onCloseHandleMouseenter(e);
      });
      return this.$closeHandle.mouseleave(function(e) {
        return _this._onCloseHandleMouseleave(e);
      });
    };

    GitTimeplot.prototype._onCloseHandleMouseenter = function(evt) {
      return this.isMouseInCloseHandle = true;
    };

    GitTimeplot.prototype._onCloseHandleMouseleave = function(evt) {
      return this.isMouseInCloseHandle = false;
    };

    GitTimeplot.prototype._onMouseenter = function(evt) {
      return this.isMouseInElement = true;
    };

    GitTimeplot.prototype._onMousemove = function(evt) {
      var relativeX;
      relativeX = evt.clientX - this.$element.offset().left;
      if (relativeX < this.$hoverMarker.offset().left) {
        this.$hoverMarker.css('left', relativeX);
      } else {
        this.$hoverMarker.css('left', relativeX - this.$hoverMarker.width());
      }
      if (this.isMouseInCloseHandle) {
        return this._hidePopup({
          force: true
        });
      } else if (this.isMouseDown) {
        this._hidePopup({
          force: true
        });
        return this._debouncedViewNearestRevision(evt.shiftKey);
      } else {
        return this._debouncedRenderPopup();
      }
    };

    GitTimeplot.prototype._onMouseleave = function(evt) {
      this.isMouseInElement = false;
      this._debouncedHidePopup();
      return this.isMouseDown = false;
    };

    GitTimeplot.prototype._onMousedown = function(evt) {
      this.isMouseDown = true;
      this._hidePopup({
        force: true
      });
      return this._debouncedViewNearestRevision(evt.shiftKey);
    };

    GitTimeplot.prototype._onMouseup = function(evt) {
      return this.isMouseDown = false;
    };

    GitTimeplot.prototype._onViewRevision = function(revHash, reverse) {
      return this.onViewRevision(revHash, reverse);
    };

    GitTimeplot.prototype._renderPopup = function() {
      var commits, end, left, ref1, ref2, ref3, start;
      if ((ref1 = this.popup) != null ? ref1.isMouseInPopup() : void 0) {
        left = this.popup.offset().left - this.$element.offset().left;
        if (this._popupRightAligned) {
          left += this.popup.width() + 7;
        }
        this.$hoverMarker.css({
          'left': left
        });
        return;
      }
      if (!this.isMouseInElement) {
        return;
      }
      if ((ref2 = this.popup) != null) {
        ref2.hide().remove();
      }
      ref3 = this._filterCommitData(this.commitData), commits = ref3[0], start = ref3[1], end = ref3[2];
      this.popup = new GitTimeplotPopup(commits, start, end, this._onViewRevision);
      left = this.$hoverMarker.offset().left;
      if (left + this.popup.outerWidth() + 10 > this.$element.offset().left + this.$element.width()) {
        this._popupRightAligned = true;
        left -= this.popup.width() + 7;
      } else {
        this._popupRightAligned = false;
      }
      return this.popup.css({
        left: left,
        top: this.$element.offset().top - this.popup.height() - 10
      });
    };

    GitTimeplot.prototype._hidePopup = function(options) {
      var ref1, ref2;
      if (options == null) {
        options = {};
      }
      options = _.defaults(options, {
        force: false
      });
      if (!options.force && (((ref1 = this.popup) != null ? ref1.isMouseInPopup() : void 0) || this.isMouseInElement)) {
        return;
      }
      return (ref2 = this.popup) != null ? ref2.hide().remove() : void 0;
    };

    GitTimeplot.prototype._filterCommitData = function() {
      var commits, left, relativeLeft, tEnd, tStart;
      left = this.$hoverMarker.offset().left;
      relativeLeft = left - this.$element.offset().left - 5;
      tStart = moment(this.x.invert(relativeLeft)).startOf('hour').subtract(1, 'minute');
      tEnd = moment(this.x.invert(relativeLeft + 10)).endOf('hour').add(1, 'minute');
      commits = _.filter(this.commitData, function(c) {
        return moment.unix(c.authorDate).isBetween(tStart, tEnd);
      });
      return [commits, tStart, tEnd];
    };

    GitTimeplot.prototype._findCommit = function(revHash, otherOutput) {
      if (otherOutput == null) {
        otherOutput = {};
      }
      if (revHash == null) {
        return revHash;
      }
      return _.find(this.commitData, function(d, index) {
        otherOutput.index = index;
        return d.id === revHash || d.hash === revHash;
      });
    };

    GitTimeplot.prototype._getNearestCommit = function() {
      var filteredCommitData, ref1, tEnd, tStart;
      ref1 = this._filterCommitData(), filteredCommitData = ref1[0], tStart = ref1[1], tEnd = ref1[2];
      if ((filteredCommitData != null ? filteredCommitData.length : void 0) > 0) {
        return filteredCommitData[0];
      } else {
        return _.find(this.commitData, function(c) {
          return moment.unix(c.authorDate).isBefore(tEnd);
        });
      }
    };

    GitTimeplot.prototype._viewNearestRevision = function(reverse) {
      var nearestCommit;
      nearestCommit = this._getNearestCommit();
      if (nearestCommit != null) {
        return this._onViewRevision(nearestCommit.id, reverse);
      }
    };

    GitTimeplot.prototype._findAdjacentRevHash = function(revHash, offset) {
      var commit, findOutput, index, ref1;
      findOutput = {};
      commit = this._findCommit(revHash, findOutput);
      if (commit == null) {
        index = offset <= 0 ? 0 : this.commitData.length - 1;
        return this.commitData[index].id;
      }
      return (ref1 = this.commitData[findOutput.index - offset]) != null ? ref1.id : void 0;
    };

    return GitTimeplot;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LXRpbWUtbWFjaGluZS9saWIvZ2l0LXRpbWVwbG90LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTs7RUFBQSxNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsU0FBRCxFQUFJOztFQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUNULEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFFTCxnQkFBQSxHQUFtQixPQUFBLENBQVEsc0JBQVI7O0VBQ25CLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSOztFQUdqQixNQUFNLENBQUMsT0FBUCxHQUF1QjtJQUVSLHFCQUFDLGFBQUQ7Ozs7TUFDWCxJQUFDLENBQUEsY0FBRCxHQUFrQixDQUFBLENBQUUsYUFBRjtNQUNsQixJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQXFCLGVBQXJCO01BQ2hCLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixDQUFDLENBQUMsUUFBRixDQUFXLElBQUMsQ0FBQSxZQUFaLEVBQTBCLEVBQTFCO01BQ3pCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixDQUFDLENBQUMsUUFBRixDQUFXLElBQUMsQ0FBQSxVQUFaLEVBQXdCLEVBQXhCO01BQ3ZCLElBQUMsQ0FBQSw2QkFBRCxHQUFpQyxDQUFDLENBQUMsUUFBRixDQUFXLElBQUMsQ0FBQSxvQkFBWixFQUFrQyxHQUFsQztNQUNqQyxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7SUFQTDs7MEJBVWIsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBOytDQUFNLENBQUUsTUFBUixDQUFBO0lBREk7OzBCQUlOLElBQUEsR0FBTSxTQUFBLEdB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d3NcIlxuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbm1vbWVudCA9IHJlcXVpcmUgJ21vbWVudCdcbmQzID0gcmVxdWlyZSAnZDMnXG5cbkdpdFRpbWVwbG90UG9wdXAgPSByZXF1aXJlICcuL2dpdC10aW1lcGxvdC1wb3B1cCdcbkdpdFJldlNlbGVjdG9yID0gcmVxdWlyZSAnLi9naXQtcmV2LXNlbGVjdG9yJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2l0VGltZXBsb3RcblxuICBjb25zdHJ1Y3RvcjogKHBhcmVudEVsZW1lbnQpIC0+XG4gICAgQCRwYXJlbnRFbGVtZW50ID0gJChwYXJlbnRFbGVtZW50KVxuICAgIEAkY2xvc2VIYW5kbGUgPSBAJHBhcmVudEVsZW1lbnQuZmluZChcIi5jbG9zZS1oYW5kbGVcIilcbiAgICBAX2RlYm91bmNlZFJlbmRlclBvcHVwID0gXy5kZWJvdW5jZShAX3JlbmRlclBvcHVwLCA1MClcbiAgICBAX2RlYm91bmNlZEhpZGVQb3B1cCA9IF8uZGVib3VuY2UoQF9oaWRlUG9wdXAsIDUwKVxuICAgIEBfZGVib3VuY2VkVmlld05lYXJlc3RSZXZpc2lvbiA9IF8uZGVib3VuY2UoQF92aWV3TmVhcmVzdFJldmlzaW9uLCAxMDApXG4gICAgQGxlZnRSZXZIYXNoID0gbnVsbCAgXG4gICAgQHJpZ2h0UmV2SGFzaCA9IG51bGxcblxuXG4gIGhpZGU6ICgpIC0+XG4gICAgQHBvcHVwPy5yZW1vdmUoKVxuXG5cbiAgc2hvdzogKCkgLT5cbiAgICAjICBub3RoaW5nIHRvIGRvIGhlcmVcblxuXG4gICMgQGNvbW1pdERhdGEgLSBhcnJheSBvZiBqYXZhc2NyaXB0IG9iamVjdHMgbGlrZSB0aG9zZSByZXR1cm5lZCBieSBHaXRVdGlscy5nZXRGaWxlQ29tbWl0SGlzdG9yeVxuICAjICAgICAgICAgICAgICAgc2hvdWxkIGJlIGluIHJldmVyc2UgY2hyb24gb3JkZXJcbiAgIyBAem9vbSAtIDEgdG8gbiB6b29tIGZhY3RvclxuICAjIEBvblZpZXdSZXZpc2lvbiAtIGNhbGxiYWNrIG1ldGhvZCBjYWxsZWQgd2hlbiBhIHJldmlzaW9uIGlzIHNlbGVjdGVkIGluIHRoZSB0aW1lcGxvdC4gQWxzbyBwYXNzZWRcbiAgIyAgICAgICAgICAgICAgIHRvIEdpdFJldlNlbGVjdG9yLiAgIFNvdWxkIHByb2JhYmx5IGJlIGEgY29uc3RydWN0b3IgYXJndW1lbnRcbiAgcmVuZGVyOiAoQGNvbW1pdERhdGEsIEB6b29tLCBAb25WaWV3UmV2aXNpb24pIC0+XG4gICAgQHBvcHVwPy5yZW1vdmUoKVxuXG4gICAgQCRlbGVtZW50ID0gQCRwYXJlbnRFbGVtZW50LmZpbmQoJy50aW1lcGxvdCcpXG4gICAgaWYgQCRlbGVtZW50Lmxlbmd0aCA8PSAwXG4gICAgICBAJGVsZW1lbnQgPSAkKFwiPGRpdiBjbGFzcz0ndGltZXBsb3QnPlwiKVxuICAgICAgQCRwYXJlbnRFbGVtZW50LmFwcGVuZCBAJGVsZW1lbnRcblxuICAgIGlmIEBjb21taXREYXRhLmxlbmd0aCA8PSAwXG4gICAgICBAJGVsZW1lbnQuaHRtbChcIjxkaXYgY2xhc3M9J3BsYWNlaG9sZGVyJz5ObyBjb21taXRzLCBub3RoaW5nIHRvIHNlZSBoZXJlLjwvZGl2PlwiKVxuICAgICAgcmV0dXJuO1xuICAgICAgXG4gICAgQCRlbGVtZW50LndpZHRoKEB6b29tICogMTAwICsgJyUnKVxuXG4gICAgc3ZnID0gZDMuc2VsZWN0KEAkZWxlbWVudC5nZXQoMCkpXG4gICAgLmFwcGVuZChcInN2Z1wiKVxuICAgIC5hdHRyKFwid2lkdGhcIiwgQCRlbGVtZW50LndpZHRoKCkpXG4gICAgLmF0dHIoXCJoZWlnaHRcIiwgMTAwKVxuXG4gICAgQF9yZW5kZXJBeGlzKHN2ZylcbiAgICBAX3JlbmRlckJsb2JzKHN2ZylcblxuICAgIEBfcmVuZGVySG92ZXJNYXJrZXIoKVxuICAgIEBfcmVuZGVyUmV2TWFya2VycygpXG4gICAgQF9yZW5kZXJSZXZTZWxlY3RvcnMoKVxuICAgIEBfYmluZE1vdXNlRXZlbnRzKClcblxuICAgIHJldHVybiBAJGVsZW1lbnQ7XG4gICAgXG4gIFxuICBzZXRSZXZpc2lvbnM6IChAbGVmdFJldkhhc2gsIEByaWdodFJldkhhc2gpIC0+XG4gICAgIyB3ZSBkb24ndCB3YW50IHRvIHNob3cgdGhlIGxlZnQgcmV2IG1hcmtlciBvciByZXYgc2VsZWN0b3IgYXQgYWxsIHVudGlsIGEgbGVmdCBAbGVmdFJldkhhc2ggaXMgc2V0XG4gICAgQGxlZnRSZXZIYXNoID0gdW5kZWZpbmVkIHVubGVzcyBAbGVmdFJldkhhc2g/XG4gICAgIyB3ZSB3YW50IHRvIHNob3cgcmlnaHQgcmV2IHNlbGVjdG9yIGFuZCBtYXJrZXIgZm9yIFwiTG9jYWwgUmV2aXNpb25cIiB3aGVuIEByaWdodFJldkhhc2ggaXMgbm90IHNldCBcbiAgICBAcmlnaHRSZXZIYXNoID0gbnVsbCB1bmxlc3MgQHJpZ2h0UmV2SGFzaD9cbiAgICBcbiAgICBAX3JlbmRlclJldk1hcmtlcnMoKVxuICAgIEBfcmVuZGVyUmV2U2VsZWN0b3JzKClcblxuXG4gIF9yZW5kZXJBeGlzOiAoc3ZnKSAtPlxuICAgIHcgPSBAJGVsZW1lbnQud2lkdGgoKVxuICAgIGggPSAxMDBcbiAgICBsZWZ0X3BhZCA9IDIwXG4gICAgcGFkID0gMjBcbiAgICBtaW5EYXRlID0gbW9tZW50LnVuaXgoQGNvbW1pdERhdGFbQGNvbW1pdERhdGEubGVuZ3RoLTFdLmF1dGhvckRhdGUpLnRvRGF0ZSgpXG4gICAgbWF4RGF0ZSA9IG1vbWVudC51bml4KEBjb21taXREYXRhWzBdLmF1dGhvckRhdGUpLnRvRGF0ZSgpXG4gICAgbWluSG91ciA9IGQzLm1pbihAY29tbWl0RGF0YS5tYXAoKGQpLT5tb21lbnQudW5peChkLmF1dGhvckRhdGUpLmhvdXIoKSkpXG4gICAgbWF4SG91ciA9IGQzLm1heChAY29tbWl0RGF0YS5tYXAoKGQpLT5tb21lbnQudW5peChkLmF1dGhvckRhdGUpLmhvdXIoKSkpXG5cbiAgICBAeCA9IGQzLnRpbWUuc2NhbGUoKS5kb21haW4oW21pbkRhdGUsIG1heERhdGVdKS5yYW5nZShbbGVmdF9wYWQsIHctcGFkXSlcbiAgICBAeSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbbWluSG91ciwgbWF4SG91cl0pLnJhbmdlKFsxMCwgaC1wYWQqMl0pXG5cbiAgICB4QXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoQHgpLm9yaWVudChcImJvdHRvbVwiKVxuICAgIHlBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZShAeSkub3JpZW50KFwibGVmdFwiKS50aWNrcygwKVxuXG4gICAgc3ZnLmFwcGVuZChcImdcIilcbiAgICAuYXR0cihcImNsYXNzXCIsIFwiYXhpc1wiKVxuICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKDAsICN7aC1wYWR9KVwiKVxuICAgIC5jYWxsKHhBeGlzKTtcblxuICAgIHN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXNcIilcbiAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgje2xlZnRfcGFkLXBhZH0sIDApXCIpXG4gICAgLmNhbGwoeUF4aXMpO1xuXG5cbiAgX3JlbmRlckJsb2JzOiAoc3ZnKSAtPlxuICAgIG1heF9yID0gZDMubWF4KEBjb21taXREYXRhLm1hcCgoZCktPnJldHVybiBkLmxpbmVzQWRkZWQgKyBkLmxpbmVzRGVsZXRlZCkpXG4gICAgciA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgLmRvbWFpbihbMCwgbWF4X3JdKVxuICAgIC5yYW5nZShbMywgMTVdKVxuXG4gICAgc3ZnLnNlbGVjdEFsbChcImNpcmNsZVwiKVxuICAgIC5kYXRhKEBjb21taXREYXRhKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZChcImNpcmNsZVwiKVxuICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJjaXJjbGVcIilcbiAgICAuYXR0cihcImN4XCIsIChkKT0+IEB4KG1vbWVudC51bml4KGQuYXV0aG9yRGF0ZSkudG9EYXRlKCkpKVxuICAgIC5hdHRyKFwiY3lcIiwgKGQpPT4gQHkobW9tZW50LnVuaXgoZC5hdXRob3JEYXRlKS5ob3VyKCkpKVxuICAgIC50cmFuc2l0aW9uKClcbiAgICAuZHVyYXRpb24oNTAwKVxuICAgIC5hdHRyKFwiclwiLCAoZCkgLT4gcihkLmxpbmVzQWRkZWQgKyBkLmxpbmVzRGVsZXRlZCB8fCAwKSlcblxuXG4gICMgaG92ZXIgbWFya2VyIGlzIHRoZSBncmF5IHZlcnRpY2FsIGxpbmUgdGhhdCBmb2xsb3dzIHRoZSBtb3VzZSBvbiB0aGUgdGltZXBsb3RcbiAgX3JlbmRlckhvdmVyTWFya2VyOiAoKSAtPlxuICAgIEAkaG92ZXJNYXJrZXIgPSBAJGVsZW1lbnQuZmluZCgnLmhvdmVyLW1hcmtlcicpXG4gICAgdW5sZXNzIEAkaG92ZXJNYXJrZXIubGVuZ3RoID4gMFxuICAgICAgQCRob3Zlck1hcmtlciA9ICQoXCI8ZGl2IGNsYXNzPSdob3Zlci1tYXJrZXInPlwiKVxuICAgICAgQCRlbGVtZW50LmFwcGVuZChAJGhvdmVyTWFya2VyKVxuXG5cbiAgX3JlbmRlclJldk1hcmtlcnM6ICgpIC0+XG4gICAgQF9yZW5kZXJSZXZNYXJrZXIoJ2xlZnQnKVxuICAgIEBfcmVuZGVyUmV2TWFya2VyKCdyaWdodCcpXG4gICAgXG4gICAgaWYgQF9sZWZ0UmV2IFxuICAgICAgIyB3ZSBkb24ndCBzaG93IHRoZSByZWQgbWFya2VyIHVudGlsIHdlIGhhdmUgYSBsZWZ0IHJldmlzaW9uXG4gICAgICBAJGVsZW1lbnQuZmluZCgnLmxlZnQtcmV2LW1hcmtlcicpLnNob3coKVxuICAgIFxuICAgIFxuICAjIHdoaWNoUmV2IHNob3VsZCBiZSAnbGVmdCcgb3IgJ3JpZ2h0J1xuICBfcmVuZGVyUmV2TWFya2VyOiAod2hpY2hSZXYpIC0+XG4gICAgJHJldk1hcmtlciA9IEAkZWxlbWVudC5maW5kKFwiLiN7d2hpY2hSZXZ9LXJldi1tYXJrZXJcIilcbiAgICB1bmxlc3MgJHJldk1hcmtlci5sZW5ndGggPiAwXG4gICAgICAkcmV2TWFya2VyID0gJChcIjxkaXYgY2xhc3M9JyN7d2hpY2hSZXZ9LXJldi1tYXJrZXInPlwiKVxuICAgICAgQCRlbGVtZW50LmFwcGVuZCgkcmV2TWFya2VyKVxuICAgIFxuICAgIHJldkhhc2ggPSBAW1wiI3t3aGljaFJldn1SZXZIYXNoXCJdXG4gICAgY29tbWl0ID0gQF9maW5kQ29tbWl0KHJldkhhc2gpXG4gICAgXG4gICAgcmV0dXJuIGlmIGNvbW1pdCA9PSB1bmRlZmluZWRcbiAgICBcbiAgICB1bmxlc3MgY29tbWl0P1xuICAgICAgIyBjb25zb2xlLmxvZyBcInJlc2V0dGluZyByZXZNYXJrZXJcIiwgd2hpY2hSZXYsIHJldkhhc2gsIGNvbW1pdFxuICAgICAgJHJldk1hcmtlci5zaG93KCkuY3NzKHtsZWZ0OiBAJGVsZW1lbnQud2lkdGgoKSAtIDEwfSlcbiAgICAgIHJldHVyblxuICAgIFxuICAgICMgY29uc29sZS5sb2cgXCJzZXR0aW5nIHJldk1hcmtlclwiLCB3aGljaFJldiwgcmV2SGFzaCwgY29tbWl0XG4gICAgJHJldk1hcmtlci5zaG93KCkuY3NzIFxuICAgICAgbGVmdDogQHgobW9tZW50LnVuaXgoY29tbWl0LmF1dGhvckRhdGUpLnRvRGF0ZSgpKVxuICAgICAgcmlnaHQ6ICdpbml0aWFsJ1xuICAgIFxuICAgIFxuICBfcmVuZGVyUmV2U2VsZWN0b3JzOiAoKSAtPlxuICAgICMgaGF2ZSB0byBhbGxvdyBzdWZmaWVudCB0aW1lIGZvciBzcGxpdGRpZmYgdG8gcmVuZGVyXG4gICAgXy5kZWxheSA9PlxuICAgICAgQF9yZW5kZXJSZXZTZWxlY3RvcignbGVmdCcpXG4gICAgICBAX3JlbmRlclJldlNlbGVjdG9yKCdyaWdodCcpXG4gICAgLCAxMDAwXG4gIFxuICBcbiAgIyByZW5kZXJzIHRoZSBzZWxlY3QgY29tcG9uZW50cyBpbiB0aGUgU3BsaXREaWZmIGJvdHRvbSBjb250cm9sIHBhbmVsXG4gIF9yZW5kZXJSZXZTZWxlY3RvcjogKGxlZnRPclJpZ2h0KSAtPlxuICAgIHJldkhhc2ggPSBAW1wiI3tsZWZ0T3JSaWdodH1SZXZIYXNoXCJdXG4gICAgY29tbWl0ID0gQF9maW5kQ29tbWl0KHJldkhhc2gpXG4gICAgQFtcIiN7bGVmdE9yUmlnaHR9UmV2U2VsZWN0b3JcIl0/LmRlc3Ryb3koKVxuICAgIEBbXCIje2xlZnRPclJpZ2h0fVJldlNlbGVjdG9yXCJdID0gbmV3IEdpdFJldlNlbGVjdG9yIGxlZnRPclJpZ2h0LCBjb21taXQsXG4gICAgICA9PiBAX29uUmV2U2VsZWN0b3JOZXh0UHJldmlvdXNSZXYobGVmdE9yUmlnaHQsIC0xKSxcbiAgICAgID0+IEBfb25SZXZTZWxlY3Rvck5leHRQcmV2aW91c1JldihsZWZ0T3JSaWdodCwgKzEpXG4gICAgXG4gICAgXG4gIF9vblJldlNlbGVjdG9yTmV4dFByZXZpb3VzUmV2OiAobGVmdE9yUmlnaHQsIG9mZnNldCkgPT5cbiAgICBjdXJyZW50UmV2SGFzaCA9IEBbXCIje2xlZnRPclJpZ2h0fVJldkhhc2hcIl1cbiAgICBhZGphY2VudFJldkhhc2ggPSBAX2ZpbmRBZGphY2VudFJldkhhc2goY3VycmVudFJldkhhc2gsIG9mZnNldClcbiAgICBAX29uVmlld1JldmlzaW9uKGFkamFjZW50UmV2SGFzaCwgbGVmdE9yUmlnaHQgPT0gJ3JpZ2h0JylcbiAgICBcbiAgICBcbiAgX2JpbmRNb3VzZUV2ZW50czogKCkgPT5cbiAgICBfdGhpcyA9IEBcbiAgICBAJGVsZW1lbnQubW91c2VlbnRlciAoZSkgLT4gX3RoaXMuX29uTW91c2VlbnRlcihlKVxuICAgIEAkZWxlbWVudC5tb3VzZW1vdmUgKGUpIC0+IF90aGlzLl9vbk1vdXNlbW92ZShlKVxuICAgIEAkZWxlbWVudC5tb3VzZWxlYXZlIChlKSAtPiBfdGhpcy5fb25Nb3VzZWxlYXZlKGUpXG4gICAgQCRlbGVtZW50Lm1vdXNlZG93biAoZSkgLT4gX3RoaXMuX29uTW91c2Vkb3duKGUpXG4gICAgQCRlbGVtZW50Lm1vdXNldXAgKGUpIC0+IF90aGlzLl9vbk1vdXNldXAoZSlcbiAgICBAJGNsb3NlSGFuZGxlLm1vdXNlZW50ZXIgKGUpIC0+IF90aGlzLl9vbkNsb3NlSGFuZGxlTW91c2VlbnRlcihlKVxuICAgIEAkY2xvc2VIYW5kbGUubW91c2VsZWF2ZSAoZSkgLT4gX3RoaXMuX29uQ2xvc2VIYW5kbGVNb3VzZWxlYXZlKGUpXG5cbiAgX29uQ2xvc2VIYW5kbGVNb3VzZWVudGVyOiAoZXZ0KSAtPlxuICAgIEBpc01vdXNlSW5DbG9zZUhhbmRsZSA9IHRydWVcblxuICBfb25DbG9zZUhhbmRsZU1vdXNlbGVhdmU6IChldnQpIC0+XG4gICAgQGlzTW91c2VJbkNsb3NlSGFuZGxlID0gZmFsc2VcblxuICBfb25Nb3VzZWVudGVyOiAoZXZ0KSAtPlxuICAgIEBpc01vdXNlSW5FbGVtZW50ID0gdHJ1ZVxuXG5cbiAgX29uTW91c2Vtb3ZlOiAoZXZ0KSAtPlxuICAgIHJlbGF0aXZlWCA9IGV2dC5jbGllbnRYIC0gQCRlbGVtZW50Lm9mZnNldCgpLmxlZnRcbiAgICBpZiByZWxhdGl2ZVggPCBAJGhvdmVyTWFya2VyLm9mZnNldCgpLmxlZnRcbiAgICAgIEAkaG92ZXJNYXJrZXIuY3NzKCdsZWZ0JywgcmVsYXRpdmVYKVxuICAgIGVsc2VcbiAgICAgIEAkaG92ZXJNYXJrZXIuY3NzKCdsZWZ0JywgcmVsYXRpdmVYIC0gQCRob3Zlck1hcmtlci53aWR0aCgpKVxuXG4gICAgaWYgQGlzTW91c2VJbkNsb3NlSGFuZGxlXG4gICAgICBAX2hpZGVQb3B1cChmb3JjZTogdHJ1ZSlcbiAgICBlbHNlIGlmIEBpc01vdXNlRG93blxuICAgICAgQF9oaWRlUG9wdXAoZm9yY2U6IHRydWUpXG4gICAgICBAX2RlYm91bmNlZFZpZXdOZWFyZXN0UmV2aXNpb24oZXZ0LnNoaWZ0S2V5KVxuICAgIGVsc2VcbiAgICAgIEBfZGVib3VuY2VkUmVuZGVyUG9wdXAoKVxuXG5cbiAgX29uTW91c2VsZWF2ZTogKGV2dCkgLT5cbiAgICBAaXNNb3VzZUluRWxlbWVudCA9IGZhbHNlXG4gICAgIyBkZWJvdW5jaW5nIGdpdmVzIGEgbGl0dGxlIHRpbWUgdG8gZ2V0IHRoZSBtb3VzZSBpbnRvIHRoZSBwb3B1cFxuICAgIEBfZGVib3VuY2VkSGlkZVBvcHVwKCk7XG4gICAgQGlzTW91c2VEb3duID0gZmFsc2VcblxuXG4gIF9vbk1vdXNlZG93bjogKGV2dCkgLT5cbiAgICBAaXNNb3VzZURvd24gPSB0cnVlXG4gICAgQF9oaWRlUG9wdXAoZm9yY2U6IHRydWUpXG4gICAgQF9kZWJvdW5jZWRWaWV3TmVhcmVzdFJldmlzaW9uKGV2dC5zaGlmdEtleSlcblxuXG4gIF9vbk1vdXNldXA6IChldnQpIC0+XG4gICAgQGlzTW91c2VEb3duID0gZmFsc2VcbiAgICBcbiAgICBcbiAgX29uVmlld1JldmlzaW9uOiAocmV2SGFzaCwgcmV2ZXJzZSkgPT5cbiAgICAjIHBhc3MgYWxvbmcgdXAgdGhlIGNvbXBvbmVudCBzdGFjay4gbm90ZSB0aGF0IHdlIGRvbid0IHVwZGF0ZSBAbGVmdFJldkhhc2ggYW5kIEByaWdodFJldkhhc2ggdW50aWxcbiAgICAjIHRoZSBjb250YWluZXIgY29tcG9uZW50IGNhbGxzIHNldFJldmlzaW9ucyBpbiByZXNwb25zZSB0byB0aGlzIFxuICAgIEBvblZpZXdSZXZpc2lvbihyZXZIYXNoLCByZXZlcnNlKVxuXG5cbiAgX3JlbmRlclBvcHVwOiAoKSAtPlxuICAgICMgcmVwb3NpdGlvbiB0aGUgbWFya2VyIHRvIG1hdGNoIHRoZSBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBwb3B1cFxuICAgIGlmIEBwb3B1cD8uaXNNb3VzZUluUG9wdXAoKVxuICAgICAgbGVmdCA9IEBwb3B1cC5vZmZzZXQoKS5sZWZ0IC0gQCRlbGVtZW50Lm9mZnNldCgpLmxlZnRcbiAgICAgIGlmIEBfcG9wdXBSaWdodEFsaWduZWRcbiAgICAgICAgbGVmdCArPSAoQHBvcHVwLndpZHRoKCkgKyA3KVxuICAgICAgQCRob3Zlck1hcmtlci5jc3MgJ2xlZnQnOiBsZWZ0XG4gICAgICByZXR1cm5cblxuICAgIHJldHVybiB1bmxlc3MgQGlzTW91c2VJbkVsZW1lbnRcblxuICAgIEBwb3B1cD8uaGlkZSgpLnJlbW92ZSgpXG4gICAgW2NvbW1pdHMsIHN0YXJ0LCBlbmRdID0gQF9maWx0ZXJDb21taXREYXRhKEBjb21taXREYXRhKVxuICAgIEBwb3B1cCA9IG5ldyBHaXRUaW1lcGxvdFBvcHVwKGNvbW1pdHMsIHN0YXJ0LCBlbmQsIEBfb25WaWV3UmV2aXNpb24pXG5cbiAgICBsZWZ0ID0gQCRob3Zlck1hcmtlci5vZmZzZXQoKS5sZWZ0XG4gICAgaWYgbGVmdCArIEBwb3B1cC5vdXRlcldpZHRoKCkgKyAxMCA+IEAkZWxlbWVudC5vZmZzZXQoKS5sZWZ0ICsgQCRlbGVtZW50LndpZHRoKClcbiAgICAgIEBfcG9wdXBSaWdodEFsaWduZWQgPSB0cnVlXG4gICAgICBsZWZ0IC09IChAcG9wdXAud2lkdGgoKSArIDcpXG4gICAgZWxzZVxuICAgICAgQF9wb3B1cFJpZ2h0QWxpZ25lZCA9IGZhbHNlXG5cbiAgICBAcG9wdXAuY3NzXG4gICAgICBsZWZ0OiBsZWZ0XG4gICAgICB0b3A6IEAkZWxlbWVudC5vZmZzZXQoKS50b3AgLSBAcG9wdXAuaGVpZ2h0KCkgLSAxMFxuXG5cbiAgX2hpZGVQb3B1cDogKG9wdGlvbnM9e30pIC0+XG4gICAgb3B0aW9ucyA9IF8uZGVmYXVsdHMgb3B0aW9ucyxcbiAgICAgIGZvcmNlOiBmYWxzZVxuXG4gICAgcmV0dXJuIGlmICFvcHRpb25zLmZvcmNlICYmIChAcG9wdXA/LmlzTW91c2VJblBvcHVwKCkgfHwgQGlzTW91c2VJbkVsZW1lbnQpXG4gICAgQHBvcHVwPy5oaWRlKCkucmVtb3ZlKClcblxuXG4gICMgcmV0dXJuIGNvbW1pdHMgZm9yIHJhbmdlIG9mIHRpbWUgYXQgaG92ZXIgbWFya2VyIChtb3VzZSBob3ZlciBwb2ludCArLy0gZml4IHJhZGl1cylcbiAgX2ZpbHRlckNvbW1pdERhdGE6ICgpIC0+XG4gICAgbGVmdCA9IEAkaG92ZXJNYXJrZXIub2Zmc2V0KCkubGVmdFxuICAgIHJlbGF0aXZlTGVmdCA9IGxlZnQgLSBAJGVsZW1lbnQub2Zmc2V0KCkubGVmdCAtIDVcbiAgICB0U3RhcnQgPSBtb21lbnQoQHguaW52ZXJ0KHJlbGF0aXZlTGVmdCkpLnN0YXJ0T2YoJ2hvdXInKS5zdWJ0cmFjdCgxLCAnbWludXRlJylcbiAgICB0RW5kID0gbW9tZW50KEB4LmludmVydChyZWxhdGl2ZUxlZnQgKyAxMCkpLmVuZE9mKCdob3VyJykuYWRkKDEsICdtaW51dGUnKVxuICAgIFxuICAgIGNvbW1pdHMgPSBfLmZpbHRlciBAY29tbWl0RGF0YSwgKGMpIC0+IG1vbWVudC51bml4KGMuYXV0aG9yRGF0ZSkuaXNCZXR3ZWVuKHRTdGFydCwgdEVuZClcbiAgICAjIGNvbnNvbGUubG9nKFwiZ3RtOiBpbnNwZWN0aW5nICN7Y29tbWl0cy5sZW5ndGh9IGNvbW1pdHMgYmV0d2VlICN7dFN0YXJ0LnRvU3RyaW5nKCl9IC0gI3t0RW5kLnRvU3RyaW5nKCl9XCIpXG4gICAgcmV0dXJuIFtjb21taXRzLCB0U3RhcnQsIHRFbmRdO1xuICAgIFxuICBcbiAgX2ZpbmRDb21taXQ6IChyZXZIYXNoLCBvdGhlck91dHB1dD17fSkgLT5cbiAgICB1bmxlc3MgcmV2SGFzaD9cbiAgICAgIHJldHVybiByZXZIYXNoICMgcmV0dXJucyBlaXRoZXIgbnVsbCBvciB1bmRlZmluZWQsIHdoaWNoZXZlciByZXZIYXNoIGlzIHNldCB0b1xuICAgIFxuICAgIHJldHVybiBfLmZpbmQgQGNvbW1pdERhdGEsIChkLCBpbmRleCkgLT4gXG4gICAgICBvdGhlck91dHB1dC5pbmRleCA9IGluZGV4XG4gICAgICBkLmlkID09IHJldkhhc2ggfHwgZC5oYXNoID09IHJldkhhc2hcbiAgICBcblxuICAjIHJldHVybiB0aGUgbmVhcmVzdCBjb21taXQgdG8gaG92ZXIgbWFya2VyIG9yIHByZXZpb3VzXG4gIF9nZXROZWFyZXN0Q29tbWl0OiAoKSAtPlxuICAgIFtmaWx0ZXJlZENvbW1pdERhdGEsIHRTdGFydCwgdEVuZF0gPSBAX2ZpbHRlckNvbW1pdERhdGEoKVxuICAgIGlmIGZpbHRlcmVkQ29tbWl0RGF0YT8ubGVuZ3RoID4gMFxuICAgICAgcmV0dXJuIGZpbHRlcmVkQ29tbWl0RGF0YVswXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBfLmZpbmQgQGNvbW1pdERhdGEsIChjKSAtPiBtb21lbnQudW5peChjLmF1dGhvckRhdGUpLmlzQmVmb3JlKHRFbmQpXG5cblxuICBfdmlld05lYXJlc3RSZXZpc2lvbjogKHJldmVyc2UpIC0+XG4gICAgbmVhcmVzdENvbW1pdCA9ICBAX2dldE5lYXJlc3RDb21taXQoKVxuICAgIGlmIG5lYXJlc3RDb21taXQ/XG4gICAgICBAX29uVmlld1JldmlzaW9uKG5lYXJlc3RDb21taXQuaWQsIHJldmVyc2UpXG4gICAgICBcbiAgXG4gICMgb2Zmc2V0IGlzIHRoZSBjaHJvbm9sb2dpY2FsIG9yZGVyLCBob3dldmVyIGNvbW1pdERhdGEgaXMgaW4gcmV2IGNocm9uIG9yZGVyXG4gIF9maW5kQWRqYWNlbnRSZXZIYXNoOiAocmV2SGFzaCwgb2Zmc2V0KSAtPlxuICAgIGZpbmRPdXRwdXQgPSB7fVxuICAgIGNvbW1pdCA9IEBfZmluZENvbW1pdChyZXZIYXNoLCBmaW5kT3V0cHV0KVxuICAgIHVubGVzcyBjb21taXQ/IFxuICAgICAgaW5kZXggPSBpZiBvZmZzZXQgPD0gMCB0aGVuIDAgZWxzZSBAY29tbWl0RGF0YS5sZW5ndGggLSAxIFxuICAgICAgcmV0dXJuIEBjb21taXREYXRhW2luZGV4XS5pZFxuICAgIFxuICAgICMgQGNvbW1pdERhdGEgaXMgaW4gcmV2ZXJzZSBjaHJvbm9sb2dpY2FsIG9yZGVyIFxuICAgIHJldHVybiBAY29tbWl0RGF0YVtmaW5kT3V0cHV0LmluZGV4IC0gb2Zmc2V0XT8uaWRcblxuIl19
