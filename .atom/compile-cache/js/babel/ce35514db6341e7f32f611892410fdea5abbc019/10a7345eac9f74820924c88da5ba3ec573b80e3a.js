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
      this.toClipboard(this.rightClickToClipboard);
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

      this.subscriptions.add(atom.config.onDidChange('atom-clock.rightClickToClipboard', function () {
        _this.rightClickToClipboard = !_this.rightClickToClipboard;
        _this.toClipboard(_this.rightClickToClipboard);
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
      this.rightClickToClipboard = atom.config.get('atom-clock.rightClickToClipboard');
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
    key: 'toClipboard',
    value: function toClipboard(toSet) {
      var _this4 = this;

      if (toSet) {
        this.element.oncontextmenu = function () {
          atom.clipboard.write(_this4.getDate(_this4.locale, _this4.tooltipDateFormat));
          atom.notifications.addSuccess('Current time copied to clipboard.', {
            dismissable: true,
            icon: 'clock'
          });
        };
      } else {
        this.element.oncontextmenu = null;
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2F0b20tY2xvY2svbGliL2F0b20tY2xvY2stdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7QUFGMUMsV0FBVyxDQUFDOztJQUlTLGFBQWE7QUFFckIsV0FGUSxhQUFhLENBRXBCLFNBQVMsRUFBRTswQkFGSixhQUFhOztBQUc5QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0dBQy9DOztlQUxrQixhQUFhOztXQU8zQixpQkFBRztBQUNOLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7S0FDbEI7OztXQUVTLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDakMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM5QixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7O0FBRWxCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELDJCQUFtQixFQUFFO2lCQUFNLE1BQUssTUFBTSxFQUFFO1NBQUE7QUFDeEMsNkJBQXFCLEVBQUU7aUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFLLE9BQU8sQ0FBQztTQUFBO09BQ2xGLENBQUMsQ0FBQyxDQUFBOztBQUVI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QUE7S0FDNUQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2xCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ3RCOzs7U0FqTWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2F0b20tY2xvY2svbGliL2F0b20tY2xvY2stdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXRvbUNsb2NrVmlldyB7XG5cbiAgY29uc3RydWN0b3Ioc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmRyYXdFbGVtZW50KClcbiAgICB0aGlzLmluaXRpYWxpemUoKVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLnNldENvbmZpZ1ZhbHVlcygpXG4gICAgdGhpcy5zZXRUb29sdGlwKHRoaXMuc2hvd1Rvb2x0aXApXG4gICAgdGhpcy5zZXRJY29uKHRoaXMuc2hvd0ljb24pXG4gICAgdGhpcy50b0NsaXBib2FyZCh0aGlzLnJpZ2h0Q2xpY2tUb0NsaXBib2FyZClcbiAgICB0aGlzLnNldFVUQ0NsYXNzKHRoaXMuc2hvd1VUQylcbiAgICB0aGlzLnN0YXJ0VGlja2VyKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2F0b20tY2xvY2s6dG9nZ2xlJzogKCkgPT4gdGhpcy50b2dnbGUoKSxcbiAgICAgICdhdG9tLWNsb2NrOnV0Yy1tb2RlJzogKCkgPT4gYXRvbS5jb25maWcuc2V0KCdhdG9tLWNsb2NrLnNob3dVVEMnLCAhdGhpcy5zaG93VVRDKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5kYXRlRm9ybWF0JywgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoVGlja2VyKClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tY2xvY2suc2hvd1Rvb2x0aXAnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldENvbmZpZ1ZhbHVlcygpXG4gICAgICB0aGlzLnNldFRvb2x0aXAodGhpcy5zaG93VG9vbHRpcClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tY2xvY2sudG9vbHRpcERhdGVGb3JtYXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5sb2NhbGUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93VVRDJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoVGlja2VyKClcbiAgICAgIHRoaXMuc2V0VVRDQ2xhc3ModGhpcy5zaG93VVRDKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5yZWZyZXNoSW50ZXJ2YWwnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93Q2xvY2tJY29uJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRDb25maWdWYWx1ZXMoKVxuICAgICAgdGhpcy5zZXRJY29uKHRoaXMuc2hvd0ljb24pXG4gICAgfSkpXG5cbiAgICBpZiAodGhpcy5zaG93T25seUluRnVsbHNjcmVlbilcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdmdWxsc2NyZWVuLWhpZGUnKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuLWhpZGUnKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93T25seUluRnVsbHNjcmVlbicsICgpID0+IHtcbiAgICAgIHRoaXMuc2hvd09ubHlJbkZ1bGxzY3JlZW4gPSAhdGhpcy5zaG93T25seUluRnVsbHNjcmVlblxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2Z1bGxzY3JlZW4taGlkZScpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLnJpZ2h0Q2xpY2tUb0NsaXBib2FyZCcsICgpID0+IHtcbiAgICAgIHRoaXMucmlnaHRDbGlja1RvQ2xpcGJvYXJkID0gIXRoaXMucmlnaHRDbGlja1RvQ2xpcGJvYXJkXG4gICAgICB0aGlzLnRvQ2xpcGJvYXJkKHRoaXMucmlnaHRDbGlja1RvQ2xpcGJvYXJkKVxuICAgIH0pKVxuXG4gIH1cblxuICBkcmF3RWxlbWVudCgpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhdG9tLWNsb2NrJywgJ2lubGluZS1ibG9jaycpXG5cbiAgICB0aGlzLmljb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5pY29uRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhdG9tLWNsb2NrLWljb24nKVxuXG4gICAgdGhpcy50aW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMudGltZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYXRvbS1jbG9jay10aW1lJylcblxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmljb25FbGVtZW50KVxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KVxuXG4gICAgdGhpcy5zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICAgIHByaW9yaXR5OiAtNTAwXG4gICAgfSlcbiAgfVxuXG4gIHNldENvbmZpZ1ZhbHVlcygpIHtcbiAgICB0aGlzLmRhdGVGb3JtYXQgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY2xvY2suZGF0ZUZvcm1hdCcpXG4gICAgdGhpcy5zaG93VG9vbHRpcCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5zaG93VG9vbHRpcCcpXG4gICAgdGhpcy50b29sdGlwRGF0ZUZvcm1hdCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay50b29sdGlwRGF0ZUZvcm1hdCcpXG4gICAgdGhpcy5sb2NhbGUgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY2xvY2subG9jYWxlJylcbiAgICB0aGlzLnNob3dVVEMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY2xvY2suc2hvd1VUQycpXG4gICAgdGhpcy5yZWZyZXNoSW50ZXJ2YWwgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY2xvY2sucmVmcmVzaEludGVydmFsJykgKiAxMDAwXG4gICAgdGhpcy5zaG93SWNvbiA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5zaG93Q2xvY2tJY29uJylcbiAgICB0aGlzLnNob3dPbmx5SW5GdWxsc2NyZWVuID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnNob3dPbmx5SW5GdWxsc2NyZWVuJylcbiAgICB0aGlzLnJpZ2h0Q2xpY2tUb0NsaXBib2FyZCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5yaWdodENsaWNrVG9DbGlwYm9hcmQnKVxuICB9XG5cbiAgc3RhcnRUaWNrZXIoKSB7XG4gICAgdGhpcy5zZXREYXRlKClcbiAgICB2YXIgbmV4dFRpY2sgPSB0aGlzLnJlZnJlc2hJbnRlcnZhbCAtIChEYXRlLm5vdygpICUgdGhpcy5yZWZyZXNoSW50ZXJ2YWwpXG4gICAgdGhpcy50aWNrID0gc2V0VGltZW91dCAoKCkgPT4gIHsgdGhpcy5zdGFydFRpY2tlcigpIH0sIG5leHRUaWNrKVxuICB9XG5cbiAgY2xlYXJUaWNrZXIoKSB7XG4gICAgaWYgKHRoaXMudGljaylcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpY2spXG4gIH1cblxuICByZWZyZXNoVGlja2VyKCkge1xuICAgIHRoaXMuc2V0Q29uZmlnVmFsdWVzKClcbiAgICB0aGlzLmNsZWFyVGlja2VyKClcbiAgICB0aGlzLnN0YXJ0VGlja2VyKClcbiAgfVxuXG4gIHNldERhdGUoKSB7XG4gICAgdGhpcy5kYXRlID0gdGhpcy5nZXREYXRlKHRoaXMubG9jYWxlLCB0aGlzLmRhdGVGb3JtYXQpXG4gICAgdGhpcy50aW1lRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuZGF0ZVxuICB9XG5cbiAgZ2V0RGF0ZShsb2NhbGUsIGZvcm1hdCkge1xuICAgIGlmICghdGhpcy5Nb21lbnQpXG4gICAgICB0aGlzLk1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbiAgICB2YXIgbW9tZW50ID0gdGhpcy5Nb21lbnQoKS5sb2NhbGUobG9jYWxlKVxuXG4gICAgaWYgKHRoaXMuc2hvd1VUQylcbiAgICAgIG1vbWVudC51dGMoKVxuXG4gICAgcmV0dXJuIG1vbWVudC5mb3JtYXQoZm9ybWF0KVxuICB9XG5cbiAgc2V0SWNvbih0b1NldCkge1xuICAgIGlmICh0b1NldClcbiAgICAgIHRoaXMuaWNvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaWNvbicsICdpY29uLWNsb2NrJylcbiAgICBlbHNlXG4gICAgICB0aGlzLmljb25FbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24nLCAnaWNvbi1jbG9jaycpXG4gIH1cblxuICBzZXRUb29sdGlwKHRvU2V0KSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHRpdGxlOiAoKSA9PiB0aGlzLmdldERhdGUodGhpcy5sb2NhbGUsIHRoaXMudG9vbHRpcERhdGVGb3JtYXQpLFxuICAgICAgICBjbGFzczogJ2F0b20tY2xvY2stdG9vbHRpcCdcbiAgICAgIH0pXG5cbiAgICBpZiAodG9TZXQpXG4gICAgICBhdG9tLnRvb2x0aXBzLmZpbmRUb29sdGlwcyh0aGlzLmVsZW1lbnQpWzBdLmVuYWJsZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS50b29sdGlwcy5maW5kVG9vbHRpcHModGhpcy5lbGVtZW50KVswXS5kaXNhYmxlKClcbiAgfVxuXG4gIHRvQ2xpcGJvYXJkKHRvU2V0KSB7XG4gICAgaWYgKHRvU2V0KSB7XG4gICAgICB0aGlzLmVsZW1lbnQub25jb250ZXh0bWVudSA9ICgpID0+IHtcbiAgICAgICAgYXRvbS5jbGlwYm9hcmQud3JpdGUodGhpcy5nZXREYXRlKHRoaXMubG9jYWxlLCB0aGlzLnRvb2x0aXBEYXRlRm9ybWF0KSlcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ0N1cnJlbnQgdGltZSBjb3BpZWQgdG8gY2xpcGJvYXJkLicsIHtcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICBpY29uOiAnY2xvY2snXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudC5vbmNvbnRleHRtZW51ID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHNldFVUQ0NsYXNzKHRvU2V0KSB7XG4gICAgaWYgKHRvU2V0KSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYXRvbS1jbG9jay11dGMnKVxuICAgICAgYXRvbS50b29sdGlwcy5maW5kVG9vbHRpcHModGhpcy5lbGVtZW50KVswXS5nZXRUb29sdGlwRWxlbWVudCgpLmNsYXNzTGlzdC5hZGQoJ2F0b20tY2xvY2stdXRjJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2F0b20tY2xvY2stdXRjJylcbiAgICAgIGF0b20udG9vbHRpcHMuZmluZFRvb2x0aXBzKHRoaXMuZWxlbWVudClbMF0uZ2V0VG9vbHRpcEVsZW1lbnQoKS5jbGFzc0xpc3QucmVtb3ZlKCdhdG9tLWNsb2NrLXV0YycpXG4gICAgfVxuICB9XG5cblxuICB0b2dnbGUoKSB7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXlcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHN0eWxlID09PSAnbm9uZScgPyAnJyA6ICdub25lJ1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNsZWFyVGlja2VyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKVxuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKVxuICB9XG59XG4iXX0=