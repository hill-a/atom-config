Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var AtomClockView = (function () {
  function AtomClockView(statusBar) {
    _classCallCheck(this, AtomClockView);

    this.statusBar = statusBar;
    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(AtomClockView, [{
    key: 'start',
    value: function start() {
      this.drawElement();
      this.initialize();
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.setConfigValues();
      this.setTooltip(this.showTooltip);
      this.setIcon(this.showIcon);
      this.setUTCClass(this.showUTC);
      this.startTicker();

      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-clock:toggle': function atomClockToggle() {
          return _this.toggle();
        },
        'atom-clock:utc-mode': function atomClockUtcMode() {
          return atom.config.set('atom-clock.showUTC', !_this.showUTC);
        }
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.dateFormat', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showTooltip', function () {
        _this.setConfigValues();
        _this.setTooltip(_this.showTooltip);
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.tooltipDateFormat', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.locale', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showUTC', function () {
        _this.refreshTicker();
        _this.setUTCClass(_this.showUTC);
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.refreshInterval', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showClockIcon', function () {
        _this.setConfigValues();
        _this.setIcon(_this.showIcon);
      }));

      if (this.showOnlyInFullscreen) this.element.classList.add('fullscreen-hide');else this.element.classList.remove('fullscreen-hide');

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showOnlyInFullscreen', function () {
        _this.showOnlyInFullscreen = !_this.showOnlyInFullscreen;
        _this.element.classList.toggle('fullscreen-hide');
      }));
    }
  }, {
    key: 'drawElement',
    value: function drawElement() {
      this.element = document.createElement('div');
      this.element.classList.add('atom-clock', 'inline-block');

      this.iconElement = document.createElement('span');
      this.iconElement.classList.add('atom-clock-icon');

      this.timeElement = document.createElement('span');
      this.timeElement.classList.add('atom-clock-time');

      this.element.appendChild(this.iconElement);
      this.element.appendChild(this.timeElement);

      this.statusBar.addRightTile({
        item: this.element,
        priority: -500
      });
    }
  }, {
    key: 'setConfigValues',
    value: function setConfigValues() {
      this.dateFormat = atom.config.get('atom-clock.dateFormat');
      this.showTooltip = atom.config.get('atom-clock.showTooltip');
      this.tooltipDateFormat = atom.config.get('atom-clock.tooltipDateFormat');
      this.locale = atom.config.get('atom-clock.locale');
      this.showUTC = atom.config.get('atom-clock.showUTC');
      this.refreshInterval = atom.config.get('atom-clock.refreshInterval') * 1000;
      this.showIcon = atom.config.get('atom-clock.showClockIcon');
      this.showOnlyInFullscreen = atom.config.get('atom-clock.showOnlyInFullscreen');
    }
  }, {
    key: 'startTicker',
    value: function startTicker() {
      var _this2 = this;

      this.setDate();
      var nextTick = this.refreshInterval - Date.now() % this.refreshInterval;
      this.tick = setTimeout(function () {
        _this2.startTicker();
      }, nextTick);
    }
  }, {
    key: 'clearTicker',
    value: function clearTicker() {
      if (this.tick) clearTimeout(this.tick);
    }
  }, {
    key: 'refreshTicker',
    value: function refreshTicker() {
      this.setConfigValues();
      this.clearTicker();
      this.startTicker();
    }
  }, {
    key: 'setDate',
    value: function setDate() {
      this.date = this.getDate(this.locale, this.dateFormat);
      this.timeElement.textContent = this.date;
    }
  }, {
    key: 'getDate',
    value: function getDate(locale, format) {
      if (!this.Moment) this.Moment = require('moment');

      var moment = this.Moment().locale(locale);

      if (this.showUTC) moment.utc();

      return moment.format(format);
    }
  }, {
    key: 'setIcon',
    value: function setIcon(toSet) {
      if (toSet) this.iconElement.classList.add('icon', 'icon-clock');else this.iconElement.classList.remove('icon', 'icon-clock');
    }
  }, {
    key: 'setTooltip',
    value: function setTooltip(toSet) {
      var _this3 = this;

      if (this.tooltip === undefined) this.tooltip = atom.tooltips.add(this.element, {
        title: function title() {
          return _this3.getDate(_this3.locale, _this3.tooltipDateFormat);
        },
        'class': 'atom-clock-tooltip'
      });

      if (toSet) atom.tooltips.findTooltips(this.element)[0].enable();else atom.tooltips.findTooltips(this.element)[0].disable();
    }
  }, {
    key: 'setUTCClass',
    value: function setUTCClass(toSet) {
      if (toSet) {
        this.element.classList.add('atom-clock-utc');
        atom.tooltips.findTooltips(this.element)[0].getTooltipElement().classList.add('atom-clock-utc');
      } else {
        this.element.classList.remove('atom-clock-utc');
        atom.tooltips.findTooltips(this.element)[0].getTooltipElement().classList.remove('atom-clock-utc');
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var style = this.element.style.display;
      this.element.style.display = style === 'none' ? '' : 'none';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.clearTicker();
      this.subscriptions.dispose();
      this.tooltip.dispose();
      this.element.remove();
    }
  }]);

  return AtomClockView;
})();

exports['default'] = AtomClockView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2F0b20tY2xvY2svbGliL2F0b20tY2xvY2stdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7QUFGMUMsV0FBVyxDQUFDOztJQUlTLGFBQWE7QUFFckIsV0FGUSxhQUFhLENBRXBCLFNBQVMsRUFBRTswQkFGSixhQUFhOztBQUc5QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0dBQy9DOztlQUxrQixhQUFhOztXQU8zQixpQkFBRztBQUNOLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDbEI7OztXQUVTLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDakMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBOztBQUVsQixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCwyQkFBbUIsRUFBRTtpQkFBTSxNQUFLLE1BQU0sRUFBRTtTQUFBO0FBQ3hDLDZCQUFxQixFQUFFO2lCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBSyxPQUFPLENBQUM7U0FBQTtPQUNsRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRSxZQUFNO0FBQzVFLGNBQUssYUFBYSxFQUFFLENBQUE7T0FDckIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLEVBQUUsWUFBTTtBQUM3RSxjQUFLLGVBQWUsRUFBRSxDQUFBO0FBQ3RCLGNBQUssVUFBVSxDQUFDLE1BQUssV0FBVyxDQUFDLENBQUE7T0FDbEMsQ0FBQyxDQUFDLENBQUE7O0FBRUgsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsOEJBQThCLEVBQUUsWUFBTTtBQUNuRixjQUFLLGFBQWEsRUFBRSxDQUFBO09BQ3JCLENBQUMsQ0FBQyxDQUFBOztBQUVILFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLG1CQUFtQixFQUFFLFlBQU07QUFDeEUsY0FBSyxhQUFhLEVBQUUsQ0FBQTtPQUNyQixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxZQUFNO0FBQ3pFLGNBQUssYUFBYSxFQUFFLENBQUE7QUFDcEIsY0FBSyxXQUFXLENBQUMsTUFBSyxPQUFPLENBQUMsQ0FBQTtPQUMvQixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyw0QkFBNEIsRUFBRSxZQUFNO0FBQ2pGLGNBQUssYUFBYSxFQUFFLENBQUE7T0FDckIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsMEJBQTBCLEVBQUUsWUFBTTtBQUMvRSxjQUFLLGVBQWUsRUFBRSxDQUFBO0FBQ3RCLGNBQUssT0FBTyxDQUFDLE1BQUssUUFBUSxDQUFDLENBQUE7T0FDNUIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsVUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBLEtBRTdDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBOztBQUVsRCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNO0FBQ3RGLGNBQUssb0JBQW9CLEdBQUcsQ0FBQyxNQUFLLG9CQUFvQixDQUFBO0FBQ3RELGNBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtPQUNqRCxDQUFDLENBQUMsQ0FBQTtLQUVKOzs7V0FFVSx1QkFBRztBQUNaLFVBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFBOztBQUV4RCxVQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUE7O0FBRWpELFVBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqRCxVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTs7QUFFakQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQzFDLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFMUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFDMUIsWUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQ2xCLGdCQUFRLEVBQUUsQ0FBQyxHQUFHO09BQ2YsQ0FBQyxDQUFBO0tBQ0g7OztXQUVjLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUMxRCxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUE7QUFDNUQsVUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFDeEUsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ2xELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUNwRCxVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLEdBQUcsSUFBSSxDQUFBO0FBQzNFLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtBQUMzRCxVQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQTtLQUMvRTs7O1dBRVUsdUJBQUc7OztBQUNaLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNkLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLEFBQUMsQ0FBQTtBQUN6RSxVQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBRSxZQUFPO0FBQUUsZUFBSyxXQUFXLEVBQUUsQ0FBQTtPQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDakU7OztXQUVVLHVCQUFHO0FBQ1osVUFBSSxJQUFJLENBQUMsSUFBSSxFQUNYLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDMUI7OztXQUVZLHlCQUFHO0FBQ2QsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7S0FDbkI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3RELFVBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7S0FDekM7OztXQUVNLGlCQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDdEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRWpDLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRXpDLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFDZCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7O0FBRWQsYUFBTyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQzdCOzs7V0FFTSxpQkFBQyxLQUFLLEVBQUU7QUFDYixVQUFJLEtBQUssRUFDUCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFBLEtBRXBELElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUE7S0FDMUQ7OztXQUVTLG9CQUFDLEtBQUssRUFBRTs7O0FBQ2hCLFVBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM3QyxhQUFLLEVBQUU7aUJBQU0sT0FBSyxPQUFPLENBQUMsT0FBSyxNQUFNLEVBQUUsT0FBSyxpQkFBaUIsQ0FBQztTQUFBO0FBQzlELGlCQUFPLG9CQUFvQjtPQUM1QixDQUFDLENBQUE7O0FBRUosVUFBSSxLQUFLLEVBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBLEtBRXBELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN4RDs7O1dBRVUscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDNUMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO09BQ2hHLE1BQU07QUFDTCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMvQyxZQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7T0FDbkc7S0FDRjs7O1dBR0ssa0JBQUc7QUFDUCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUE7QUFDdEMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssS0FBSyxNQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQTtLQUM1RDs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7S0FDdEI7OztTQTVLa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvYXRvbS1jbG9jay9saWIvYXRvbS1jbG9jay12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdG9tQ2xvY2tWaWV3IHtcblxuICBjb25zdHJ1Y3RvcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuZHJhd0VsZW1lbnQoKVxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpXG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuc2V0Q29uZmlnVmFsdWVzKClcbiAgICB0aGlzLnNldFRvb2x0aXAodGhpcy5zaG93VG9vbHRpcClcbiAgICB0aGlzLnNldEljb24odGhpcy5zaG93SWNvbilcbiAgICB0aGlzLnNldFVUQ0NsYXNzKHRoaXMuc2hvd1VUQylcbiAgICB0aGlzLnN0YXJ0VGlja2VyKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2F0b20tY2xvY2s6dG9nZ2xlJzogKCkgPT4gdGhpcy50b2dnbGUoKSxcbiAgICAgICdhdG9tLWNsb2NrOnV0Yy1tb2RlJzogKCkgPT4gYXRvbS5jb25maWcuc2V0KCdhdG9tLWNsb2NrLnNob3dVVEMnLCAhdGhpcy5zaG93VVRDKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5kYXRlRm9ybWF0JywgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoVGlja2VyKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tY2xvY2suc2hvd1Rvb2x0aXAnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldENvbmZpZ1ZhbHVlcygpXG4gICAgICB0aGlzLnNldFRvb2x0aXAodGhpcy5zaG93VG9vbHRpcClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tY2xvY2sudG9vbHRpcERhdGVGb3JtYXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5sb2NhbGUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93VVRDJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoVGlja2VyKClcbiAgICAgIHRoaXMuc2V0VVRDQ2xhc3ModGhpcy5zaG93VVRDKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5yZWZyZXNoSW50ZXJ2YWwnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93Q2xvY2tJY29uJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRDb25maWdWYWx1ZXMoKVxuICAgICAgdGhpcy5zZXRJY29uKHRoaXMuc2hvd0ljb24pXG4gICAgfSkpXG5cbiAgICBpZiAodGhpcy5zaG93T25seUluRnVsbHNjcmVlbilcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmdWxsc2NyZWVuLWhpZGUnKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuLWhpZGUnKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93T25seUluRnVsbHNjcmVlbicsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd09ubHlJbkZ1bGxzY3JlZW4gPSAhdGhpcy5zaG93T25seUluRnVsbHNjcmVlblxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2Z1bGxzY3JlZW4taGlkZScpXG4gICAgfSkpXG5cbiAgfVxuXG4gIGRyYXdFbGVtZW50KCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2F0b20tY2xvY2snLCAnaW5saW5lLWJsb2NrJylcblxuICAgIHRoaXMuaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLmljb25FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2F0b20tY2xvY2staWNvbicpXG5cbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy50aW1lRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhdG9tLWNsb2NrLXRpbWUnKVxuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaWNvbkVsZW1lbnQpXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpXG5cbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50LFxuICAgICAgcHJpb3JpdHk6IC01MDBcbiAgICB9KVxuICB9XG5cbiAgc2V0Q29uZmlnVmFsdWVzKCkge1xuICAgIHRoaXMuZGF0ZUZvcm1hdCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5kYXRlRm9ybWF0JylcbiAgICB0aGlzLnNob3dUb29sdGlwID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnNob3dUb29sdGlwJylcbiAgICB0aGlzLnRvb2x0aXBEYXRlRm9ybWF0ID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnRvb2x0aXBEYXRlRm9ybWF0JylcbiAgICB0aGlzLmxvY2FsZSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5sb2NhbGUnKVxuICAgIHRoaXMuc2hvd1VUQyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5zaG93VVRDJylcbiAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5yZWZyZXNoSW50ZXJ2YWwnKSAqIDEwMDBcbiAgICB0aGlzLnNob3dJY29uID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnNob3dDbG9ja0ljb24nKVxuICAgIHRoaXMuc2hvd09ubHlJbkZ1bGxzY3JlZW4gPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY2xvY2suc2hvd09ubHlJbkZ1bGxzY3JlZW4nKVxuICB9XG5cbiAgc3RhcnRUaWNrZXIoKSB7XG4gICAgdGhpcy5zZXREYXRlKClcbiAgICB2YXIgbmV4dFRpY2sgPSB0aGlzLnJlZnJlc2hJbnRlcnZhbCAtIChEYXRlLm5vdygpICUgdGhpcy5yZWZyZXNoSW50ZXJ2YWwpXG4gICAgdGhpcy50aWNrID0gc2V0VGltZW91dCAoKCkgPT4gIHsgdGhpcy5zdGFydFRpY2tlcigpIH0sIG5leHRUaWNrKVxuICB9XG5cbiAgY2xlYXJUaWNrZXIoKSB7XG4gICAgaWYgKHRoaXMudGljaylcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpY2spXG4gIH1cblxuICByZWZyZXNoVGlja2VyKCkge1xuICAgIHRoaXMuc2V0Q29uZmlnVmFsdWVzKClcbiAgICB0aGlzLmNsZWFyVGlja2VyKClcbiAgICB0aGlzLnN0YXJ0VGlja2VyKClcbiAgfVxuXG4gIHNldERhdGUoKSB7XG4gICAgdGhpcy5kYXRlID0gdGhpcy5nZXREYXRlKHRoaXMubG9jYWxlLCB0aGlzLmRhdGVGb3JtYXQpXG4gICAgdGhpcy50aW1lRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuZGF0ZVxuICB9XG5cbiAgZ2V0RGF0ZShsb2NhbGUsIGZvcm1hdCkge1xuICAgIGlmICghdGhpcy5Nb21lbnQpXG4gICAgICB0aGlzLk1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbiAgICB2YXIgbW9tZW50ID0gdGhpcy5Nb21lbnQoKS5sb2NhbGUobG9jYWxlKVxuXG4gICAgaWYgKHRoaXMuc2hvd1VUQylcbiAgICAgIG1vbWVudC51dGMoKVxuXG4gICAgcmV0dXJuIG1vbWVudC5mb3JtYXQoZm9ybWF0KVxuICB9XG5cbiAgc2V0SWNvbih0b1NldCkge1xuICAgIGlmICh0b1NldClcbiAgICAgIHRoaXMuaWNvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaWNvbicsICdpY29uLWNsb2NrJylcbiAgICBlbHNlXG4gICAgICB0aGlzLmljb25FbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24nLCAnaWNvbi1jbG9jaycpXG4gIH1cblxuICBzZXRUb29sdGlwKHRvU2V0KSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHRpdGxlOiAoKSA9PiB0aGlzLmdldERhdGUodGhpcy5sb2NhbGUsIHRoaXMudG9vbHRpcERhdGVGb3JtYXQpLFxuICAgICAgICBjbGFzczogJ2F0b20tY2xvY2stdG9vbHRpcCdcbiAgICAgIH0pXG5cbiAgICBpZiAodG9TZXQpXG4gICAgICBhdG9tLnRvb2x0aXBzLmZpbmRUb29sdGlwcyh0aGlzLmVsZW1lbnQpWzBdLmVuYWJsZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS50b29sdGlwcy5maW5kVG9vbHRpcHModGhpcy5lbGVtZW50KVswXS5kaXNhYmxlKClcbiAgfVxuXG4gIHNldFVUQ0NsYXNzKHRvU2V0KSB7XG4gICAgaWYgKHRvU2V0KSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYXRvbS1jbG9jay11dGMnKVxuICAgICAgYXRvbS50b29sdGlwcy5maW5kVG9vbHRpcHModGhpcy5lbGVtZW50KVswXS5nZXRUb29sdGlwRWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoJ2F0b20tY2xvY2stdXRjJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2F0b20tY2xvY2stdXRjJylcbiAgICAgIGF0b20udG9vbHRpcHMuZmluZFRvb2x0aXBzKHRoaXMuZWxlbWVudClbMF0uZ2V0VG9vbHRpcEVsZW1lbnQoKS5jbGFzc0xpc3QucmVtb3ZlKCdhdG9tLWNsb2NrLXV0YycpXG4gICAgfVxuICB9XG5cblxuICB0b2dnbGUoKSB7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXlcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHN0eWxlID09PSAnbm9uZScgPyAnJyA6ICdub25lJ1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNsZWFyVGlja2VyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKVxuICB9XG59XG4iXX0=