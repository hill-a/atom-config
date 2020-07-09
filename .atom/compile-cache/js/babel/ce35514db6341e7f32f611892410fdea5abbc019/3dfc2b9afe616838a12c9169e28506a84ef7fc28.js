Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _clangFormat = require('./clang-format');

var _clangFormat2 = _interopRequireDefault(_clangFormat);

'use babel';

exports['default'] = {
  config: {
    formatCPlusPlusOnSave: {
      type: 'boolean',
      'default': false,
      title: 'Format C++ on save',
      order: 1
    },
    formatCOnSave: {
      type: 'boolean',
      'default': false,
      title: 'Format C on save',
      order: 2
    },
    formatObjectiveCOnSave: {
      type: 'boolean',
      'default': false,
      title: 'Format Objective-C on save',
      order: 3
    },
    formatJavascriptOnSave: {
      type: 'boolean',
      'default': false,
      title: 'Format JavaScript on save',
      order: 4
    },
    formatTypescriptOnSave: {
      type: 'boolean',
      'default': false,
      title: 'Format TypeScript on save',
      order: 5
    },
    formatJavaOnSave: {
      type: 'boolean',
      'default': false,
      title: 'Format Java on save',
      order: 6
    },
    executable: {
      type: 'string',
      'default': '',
      order: 7
    },
    style: {
      type: 'string',
      'default': 'file',
      order: 8,
      description: 'Default "file" uses the file ".clang-format" in one of the parent directories of the source file.'
    },
    fallbackStyle: {
      type: 'string',
      'default': 'llvm',
      description: 'Fallback Style. Set To "none" together with style "file" to ensure that if no ".clang-format" file exists, no reformatting takes place.'
    }
  },

  activate: function activate() {
    this.clangFormat = new _clangFormat2['default']();
  },

  deactivate: function deactivate() {
    return this.clangFormat.destroy();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2NsYW5nLWZvcm1hdC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7MkJBRXdCLGdCQUFnQjs7OztBQUZ4QyxXQUFXLENBQUM7O3FCQUlHO0FBQ2IsUUFBTSxFQUFFO0FBQ04seUJBQXFCLEVBQUU7QUFDckIsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxLQUFLO0FBQ2QsV0FBSyxFQUFFLG9CQUFvQjtBQUMzQixXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSxrQkFBa0I7QUFDekIsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELDBCQUFzQixFQUFFO0FBQ3RCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSw0QkFBNEI7QUFDbkMsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELDBCQUFzQixFQUFFO0FBQ3RCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSwyQkFBMkI7QUFDbEMsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELDBCQUFzQixFQUFFO0FBQ3RCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSwyQkFBMkI7QUFDbEMsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELG9CQUFnQixFQUFFO0FBQ2hCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztBQUNkLFdBQUssRUFBRSxxQkFBcUI7QUFDNUIsV0FBSyxFQUFFLENBQUM7S0FDVDtBQUNELGNBQVUsRUFBRTtBQUNWLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsRUFBRTtBQUNYLFdBQUssRUFBRSxDQUFDO0tBQ1Q7QUFDRCxTQUFLLEVBQUU7QUFDTCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLE1BQU07QUFDZixXQUFLLEVBQUUsQ0FBQztBQUNSLGlCQUFXLEVBQUUsbUdBQW1HO0tBQ2pIO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsTUFBTTtBQUNmLGlCQUFXLEVBQUUseUlBQXlJO0tBQ3ZKO0dBQ0Y7O0FBRUQsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLFdBQVcsR0FBRyw4QkFBaUIsQ0FBQztHQUN0Qzs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxXQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDbkM7Q0FDRiIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9jbGFuZy1mb3JtYXQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IENsYW5nRm9ybWF0IGZyb20gJy4vY2xhbmctZm9ybWF0JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBmb3JtYXRDUGx1c1BsdXNPblNhdmU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdGb3JtYXQgQysrIG9uIHNhdmUnLFxuICAgICAgb3JkZXI6IDEsXG4gICAgfSxcbiAgICBmb3JtYXRDT25TYXZlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHRpdGxlOiAnRm9ybWF0IEMgb24gc2F2ZScsXG4gICAgICBvcmRlcjogMixcbiAgICB9LFxuICAgIGZvcm1hdE9iamVjdGl2ZUNPblNhdmU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdGb3JtYXQgT2JqZWN0aXZlLUMgb24gc2F2ZScsXG4gICAgICBvcmRlcjogMyxcbiAgICB9LFxuICAgIGZvcm1hdEphdmFzY3JpcHRPblNhdmU6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdGl0bGU6ICdGb3JtYXQgSmF2YVNjcmlwdCBvbiBzYXZlJyxcbiAgICAgIG9yZGVyOiA0LFxuICAgIH0sXG4gICAgZm9ybWF0VHlwZXNjcmlwdE9uU2F2ZToge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICB0aXRsZTogJ0Zvcm1hdCBUeXBlU2NyaXB0IG9uIHNhdmUnLFxuICAgICAgb3JkZXI6IDUsXG4gICAgfSxcbiAgICBmb3JtYXRKYXZhT25TYXZlOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHRpdGxlOiAnRm9ybWF0IEphdmEgb24gc2F2ZScsXG4gICAgICBvcmRlcjogNixcbiAgICB9LFxuICAgIGV4ZWN1dGFibGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgICBvcmRlcjogNyxcbiAgICB9LFxuICAgIHN0eWxlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdmaWxlJyxcbiAgICAgIG9yZGVyOiA4LFxuICAgICAgZGVzY3JpcHRpb246ICdEZWZhdWx0IFwiZmlsZVwiIHVzZXMgdGhlIGZpbGUgXCIuY2xhbmctZm9ybWF0XCIgaW4gb25lIG9mIHRoZSBwYXJlbnQgZGlyZWN0b3JpZXMgb2YgdGhlIHNvdXJjZSBmaWxlLicsXG4gICAgfSxcbiAgICBmYWxsYmFja1N0eWxlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdsbHZtJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRmFsbGJhY2sgU3R5bGUuIFNldCBUbyBcIm5vbmVcIiB0b2dldGhlciB3aXRoIHN0eWxlIFwiZmlsZVwiIHRvIGVuc3VyZSB0aGF0IGlmIG5vIFwiLmNsYW5nLWZvcm1hdFwiIGZpbGUgZXhpc3RzLCBubyByZWZvcm1hdHRpbmcgdGFrZXMgcGxhY2UuJyxcbiAgICB9LFxuICB9LFxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuY2xhbmdGb3JtYXQgPSBuZXcgQ2xhbmdGb3JtYXQoKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHJldHVybiB0aGlzLmNsYW5nRm9ybWF0LmRlc3Ryb3koKTtcbiAgfSxcbn07XG4iXX0=