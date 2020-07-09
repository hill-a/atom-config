(function() {
  module.exports = {
    autoDiff: {
      title: 'Auto Diff',
      description: 'Automatically recalculates the diff when one of the editors changes.',
      type: 'boolean',
      "default": true,
      order: 1
    },
    diffWords: {
      title: 'Show Word Diff',
      description: 'Diffs the words between each line when this box is checked.',
      type: 'boolean',
      "default": true,
      order: 2
    },
    ignoreWhitespace: {
      title: 'Ignore Whitespace',
      description: 'Will not diff whitespace when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 3
    },
    turnOffSoftWrap: {
      title: 'Remove Soft Wrap',
      description: 'Removes soft wrap during diff - restores when finished.',
      type: 'boolean',
      "default": false,
      order: 4
    },
    muteNotifications: {
      title: 'Mute Notifications',
      description: 'Mutes all warning notifications when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 5
    },
    hideDocks: {
      title: 'Hide Docks',
      description: 'Hides all docks (Tree View, Github, etc) during diff - shows when finished.',
      type: 'boolean',
      "default": false,
      order: 6
    },
    scrollSyncType: {
      title: 'Sync Scrolling',
      description: 'Syncs the scrolling of the editors.',
      type: 'string',
      "default": 'Vertical + Horizontal',
      "enum": ['Vertical + Horizontal', 'Vertical', 'None'],
      order: 7
    },
    colors: {
      type: 'object',
      properties: {
        addedColorSide: {
          title: 'Added Color Side',
          description: 'The side that the latest version of the file is on. The added color will be applied to this editor and the removed color will be opposite.',
          type: 'string',
          "default": 'left',
          "enum": ['left', 'right'],
          order: 1
        },
        overrideThemeColors: {
          title: 'Override Highlight Colors',
          description: 'Override the line highlight colors (defined by variables in your selected syntax theme) with the colors selected below.',
          type: 'boolean',
          "default": false,
          order: 2
        },
        addedColor: {
          title: 'Added Custom Color',
          description: 'The color that will be used for highlighting added lines when **Override Highlight Colors** is checked.',
          type: 'color',
          "default": 'green',
          order: 3
        },
        removedColor: {
          title: 'Removed Custom Color',
          description: 'The color that will be used for highlighting removed lines when **Override Highlight Colors** is checked.',
          type: 'color',
          "default": 'red',
          order: 4
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvY29uZmlnLXNjaGVtYS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFdBQVA7TUFDQSxXQUFBLEVBQWEsc0VBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBREY7SUFNQSxTQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sZ0JBQVA7TUFDQSxXQUFBLEVBQWEsNkRBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBUEY7SUFZQSxnQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLG1CQUFQO01BQ0EsV0FBQSxFQUFhLG9EQURiO01BRUEsSUFBQSxFQUFNLFNBRk47TUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7TUFJQSxLQUFBLEVBQU8sQ0FKUDtLQWJGO0lBa0JBLGVBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxrQkFBUDtNQUNBLFdBQUEsRUFBYSx5REFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0FuQkY7SUF3QkEsaUJBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxvQkFBUDtNQUNBLFdBQUEsRUFBYSwyREFEYjtNQUVBLElBQUEsRUFBTSxTQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO01BSUEsS0FBQSxFQUFPLENBSlA7S0F6QkY7SUE4QkEsU0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLFlBQVA7TUFDQSxXQUFBLEVBQWEsNkVBRGI7TUFFQSxJQUFBLEVBQU0sU0FGTjtNQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtNQUlBLEtBQUEsRUFBTyxDQUpQO0tBL0JGO0lBb0NBLGNBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxnQkFBUDtNQUNBLFdBQUEsRUFBYSxxQ0FEYjtNQUVBLElBQUEsRUFBTSxRQUZOO01BR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyx1QkFIVDtNQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyx1QkFBRCxFQUEwQixVQUExQixFQUFzQyxNQUF0QyxDQUpOO01BS0EsS0FBQSxFQUFPLENBTFA7S0FyQ0Y7SUEyQ0EsTUFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFFBQU47TUFDQSxVQUFBLEVBQ0U7UUFBQSxjQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sa0JBQVA7VUFDQSxXQUFBLEVBQWEsNElBRGI7VUFFQSxJQUFBLEVBQU0sUUFGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFIVDtVQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxNQUFELEVBQVMsT0FBVCxDQUpOO1VBS0EsS0FBQSxFQUFPLENBTFA7U0FERjtRQU9BLG1CQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sMkJBQVA7VUFDQSxXQUFBLEVBQWEseUhBRGI7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLEtBQUEsRUFBTyxDQUpQO1NBUkY7UUFhQSxVQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sb0JBQVA7VUFDQSxXQUFBLEVBQWEseUdBRGI7VUFFQSxJQUFBLEVBQU0sT0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FIVDtVQUlBLEtBQUEsRUFBTyxDQUpQO1NBZEY7UUFtQkEsWUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLHNCQUFQO1VBQ0EsV0FBQSxFQUFhLDJHQURiO1VBRUEsSUFBQSxFQUFNLE9BRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxLQUFBLEVBQU8sQ0FKUDtTQXBCRjtPQUZGO0tBNUNGOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBhdXRvRGlmZjpcbiAgICB0aXRsZTogJ0F1dG8gRGlmZidcbiAgICBkZXNjcmlwdGlvbjogJ0F1dG9tYXRpY2FsbHkgcmVjYWxjdWxhdGVzIHRoZSBkaWZmIHdoZW4gb25lIG9mIHRoZSBlZGl0b3JzIGNoYW5nZXMuJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcmRlcjogMVxuICBkaWZmV29yZHM6XG4gICAgdGl0bGU6ICdTaG93IFdvcmQgRGlmZidcbiAgICBkZXNjcmlwdGlvbjogJ0RpZmZzIHRoZSB3b3JkcyBiZXR3ZWVuIGVhY2ggbGluZSB3aGVuIHRoaXMgYm94IGlzIGNoZWNrZWQuJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IHRydWVcbiAgICBvcmRlcjogMlxuICBpZ25vcmVXaGl0ZXNwYWNlOlxuICAgIHRpdGxlOiAnSWdub3JlIFdoaXRlc3BhY2UnXG4gICAgZGVzY3JpcHRpb246ICdXaWxsIG5vdCBkaWZmIHdoaXRlc3BhY2Ugd2hlbiB0aGlzIGJveCBpcyBjaGVja2VkLidcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICAgIG9yZGVyOiAzXG4gIHR1cm5PZmZTb2Z0V3JhcDpcbiAgICB0aXRsZTogJ1JlbW92ZSBTb2Z0IFdyYXAnXG4gICAgZGVzY3JpcHRpb246ICdSZW1vdmVzIHNvZnQgd3JhcCBkdXJpbmcgZGlmZiAtIHJlc3RvcmVzIHdoZW4gZmluaXNoZWQuJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgb3JkZXI6IDRcbiAgbXV0ZU5vdGlmaWNhdGlvbnM6XG4gICAgdGl0bGU6ICdNdXRlIE5vdGlmaWNhdGlvbnMnXG4gICAgZGVzY3JpcHRpb246ICdNdXRlcyBhbGwgd2FybmluZyBub3RpZmljYXRpb25zIHdoZW4gdGhpcyBib3ggaXMgY2hlY2tlZC4nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgICBvcmRlcjogNVxuICBoaWRlRG9ja3M6XG4gICAgdGl0bGU6ICdIaWRlIERvY2tzJ1xuICAgIGRlc2NyaXB0aW9uOiAnSGlkZXMgYWxsIGRvY2tzIChUcmVlIFZpZXcsIEdpdGh1YiwgZXRjKSBkdXJpbmcgZGlmZiAtIHNob3dzIHdoZW4gZmluaXNoZWQuJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgb3JkZXI6IDZcbiAgc2Nyb2xsU3luY1R5cGU6XG4gICAgdGl0bGU6ICdTeW5jIFNjcm9sbGluZydcbiAgICBkZXNjcmlwdGlvbjogJ1N5bmNzIHRoZSBzY3JvbGxpbmcgb2YgdGhlIGVkaXRvcnMuJ1xuICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgZGVmYXVsdDogJ1ZlcnRpY2FsICsgSG9yaXpvbnRhbCdcbiAgICBlbnVtOiBbJ1ZlcnRpY2FsICsgSG9yaXpvbnRhbCcsICdWZXJ0aWNhbCcsICdOb25lJ11cbiAgICBvcmRlcjogN1xuICBjb2xvcnM6XG4gICAgdHlwZTogJ29iamVjdCdcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgYWRkZWRDb2xvclNpZGU6XG4gICAgICAgIHRpdGxlOiAnQWRkZWQgQ29sb3IgU2lkZSdcbiAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgc2lkZSB0aGF0IHRoZSBsYXRlc3QgdmVyc2lvbiBvZiB0aGUgZmlsZSBpcyBvbi4gVGhlIGFkZGVkIGNvbG9yIHdpbGwgYmUgYXBwbGllZCB0byB0aGlzIGVkaXRvciBhbmQgdGhlIHJlbW92ZWQgY29sb3Igd2lsbCBiZSBvcHBvc2l0ZS4nXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIGRlZmF1bHQ6ICdsZWZ0J1xuICAgICAgICBlbnVtOiBbJ2xlZnQnLCAncmlnaHQnXVxuICAgICAgICBvcmRlcjogMVxuICAgICAgb3ZlcnJpZGVUaGVtZUNvbG9yczpcbiAgICAgICAgdGl0bGU6ICdPdmVycmlkZSBIaWdobGlnaHQgQ29sb3JzJ1xuICAgICAgICBkZXNjcmlwdGlvbjogJ092ZXJyaWRlIHRoZSBsaW5lIGhpZ2hsaWdodCBjb2xvcnMgKGRlZmluZWQgYnkgdmFyaWFibGVzIGluIHlvdXIgc2VsZWN0ZWQgc3ludGF4IHRoZW1lKSB3aXRoIHRoZSBjb2xvcnMgc2VsZWN0ZWQgYmVsb3cuJ1xuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgIGFkZGVkQ29sb3I6XG4gICAgICAgIHRpdGxlOiAnQWRkZWQgQ3VzdG9tIENvbG9yJ1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBjb2xvciB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgaGlnaGxpZ2h0aW5nIGFkZGVkIGxpbmVzIHdoZW4gKipPdmVycmlkZSBIaWdobGlnaHQgQ29sb3JzKiogaXMgY2hlY2tlZC4nXG4gICAgICAgIHR5cGU6ICdjb2xvcidcbiAgICAgICAgZGVmYXVsdDogJ2dyZWVuJ1xuICAgICAgICBvcmRlcjogM1xuICAgICAgcmVtb3ZlZENvbG9yOlxuICAgICAgICB0aXRsZTogJ1JlbW92ZWQgQ3VzdG9tIENvbG9yJ1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBjb2xvciB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgaGlnaGxpZ2h0aW5nIHJlbW92ZWQgbGluZXMgd2hlbiAqKk92ZXJyaWRlIEhpZ2hsaWdodCBDb2xvcnMqKiBpcyBjaGVja2VkLidcbiAgICAgICAgdHlwZTogJ2NvbG9yJ1xuICAgICAgICBkZWZhdWx0OiAncmVkJ1xuICAgICAgICBvcmRlcjogNFxuIl19
