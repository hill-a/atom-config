(function() {
  var FooterView;

  module.exports = FooterView = (function() {
    function FooterView(isWhitespaceIgnored, disableIgnoreWhitespace, isAutoDiffEnabled, disableAutoDiff) {
      var autoDiffLabel, copyToLeftButton, copyToRightButton, ignoreWhitespaceLabel, left, mid, nextDiffButton, numDifferences, prevDiffButton, right, selectionDivider;
      this.element = document.createElement('div');
      this.element.classList.add('split-diff-ui');
      prevDiffButton = document.createElement('button');
      prevDiffButton.classList.add('btn');
      prevDiffButton.classList.add('btn-md');
      prevDiffButton.classList.add('prev-diff');
      prevDiffButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:prev-diff');
      };
      prevDiffButton.title = 'Move to Previous Diff';
      nextDiffButton = document.createElement('button');
      nextDiffButton.classList.add('btn');
      nextDiffButton.classList.add('btn-md');
      nextDiffButton.classList.add('next-diff');
      nextDiffButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:next-diff');
      };
      nextDiffButton.title = 'Move to Next Diff';
      this.selectionCountValue = document.createElement('span');
      this.selectionCountValue.classList.add('selection-count-value');
      this.element.appendChild(this.selectionCountValue);
      selectionDivider = document.createElement('span');
      selectionDivider.textContent = '/';
      selectionDivider.classList.add('selection-divider');
      this.element.appendChild(selectionDivider);
      this.selectionCount = document.createElement('div');
      this.selectionCount.classList.add('selection-count');
      this.selectionCount.classList.add('hidden');
      this.selectionCount.appendChild(this.selectionCountValue);
      this.selectionCount.appendChild(selectionDivider);
      this.numDifferencesValue = document.createElement('span');
      this.numDifferencesValue.classList.add('num-diff-value');
      this.numDifferencesValue.classList.add('split-diff-loading-icon');
      this.numDifferencesText = document.createElement('span');
      this.numDifferencesText.textContent = 'differences';
      this.numDifferencesText.classList.add('num-diff-text');
      numDifferences = document.createElement('div');
      numDifferences.classList.add('num-diff');
      numDifferences.appendChild(this.numDifferencesValue);
      numDifferences.appendChild(this.numDifferencesText);
      left = document.createElement('div');
      left.classList.add('left');
      left.appendChild(prevDiffButton);
      left.appendChild(nextDiffButton);
      left.appendChild(this.selectionCount);
      left.appendChild(numDifferences);
      this.element.appendChild(left);
      copyToLeftButton = document.createElement('button');
      copyToLeftButton.classList.add('btn');
      copyToLeftButton.classList.add('btn-md');
      copyToLeftButton.classList.add('copy-to-left');
      copyToLeftButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:copy-to-left');
      };
      copyToLeftButton.title = 'Copy to Left';
      copyToRightButton = document.createElement('button');
      copyToRightButton.classList.add('btn');
      copyToRightButton.classList.add('btn-md');
      copyToRightButton.classList.add('copy-to-right');
      copyToRightButton.onclick = function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:copy-to-right');
      };
      copyToRightButton.title = 'Copy to Right';
      mid = document.createElement('div');
      mid.classList.add('mid');
      mid.appendChild(copyToLeftButton);
      mid.appendChild(copyToRightButton);
      this.element.appendChild(mid);
      this.ignoreWhitespaceValue = document.createElement('input');
      this.ignoreWhitespaceValue.type = 'checkbox';
      this.ignoreWhitespaceValue.id = 'ignore-whitespace-checkbox';
      this.ignoreWhitespaceValue.checked = isWhitespaceIgnored;
      this.ignoreWhitespaceValue.disabled = disableIgnoreWhitespace;
      this.ignoreWhitespaceValue.addEventListener('change', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:set-ignore-whitespace');
      });
      ignoreWhitespaceLabel = document.createElement('label');
      ignoreWhitespaceLabel.classList.add('ignore-whitespace-label');
      ignoreWhitespaceLabel.htmlFor = 'ignore-whitespace-checkbox';
      ignoreWhitespaceLabel.textContent = 'Ignore Whitespace';
      this.autoDiffValue = document.createElement('input');
      this.autoDiffValue.type = 'checkbox';
      this.autoDiffValue.id = 'auto-diff-checkbox';
      this.autoDiffValue.checked = isAutoDiffEnabled;
      this.autoDiffValue.disabled = disableAutoDiff;
      this.autoDiffValue.addEventListener('change', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'split-diff:set-auto-diff');
      });
      autoDiffLabel = document.createElement('label');
      autoDiffLabel.classList.add('auto-diff-label');
      autoDiffLabel.htmlFor = 'auto-diff-checkbox';
      autoDiffLabel.textContent = 'Auto Diff';
      right = document.createElement('div');
      right.classList.add('right');
      right.appendChild(this.ignoreWhitespaceValue);
      right.appendChild(ignoreWhitespaceLabel);
      right.appendChild(this.autoDiffValue);
      right.appendChild(autoDiffLabel);
      this.element.appendChild(right);
    }

    FooterView.prototype.destroy = function() {
      this.element.remove();
      return this.footerPanel.destroy();
    };

    FooterView.prototype.getElement = function() {
      return this.element;
    };

    FooterView.prototype.createPanel = function() {
      return this.footerPanel = atom.workspace.addBottomPanel({
        item: this.element
      });
    };

    FooterView.prototype.show = function() {
      return this.footerPanel.show();
    };

    FooterView.prototype.hide = function() {
      return this.footerPanel.hide();
    };

    FooterView.prototype.setLoading = function() {
      this.numDifferencesValue.textContent = null;
      return this.numDifferencesValue.classList.add('split-diff-loading-icon');
    };

    FooterView.prototype.setNumDifferences = function(num) {
      this.numDifferencesValue.classList.remove('split-diff-loading-icon');
      if (num === 1) {
        this.numDifferencesText.textContent = 'difference';
      } else {
        this.numDifferencesText.textContent = 'differences';
      }
      return this.numDifferencesValue.textContent = num;
    };

    FooterView.prototype.showSelectionCount = function(count) {
      this.selectionCountValue.textContent = count;
      return this.selectionCount.classList.remove('hidden');
    };

    FooterView.prototype.hideSelectionCount = function() {
      return this.selectionCount.classList.add('hidden');
    };

    FooterView.prototype.setIgnoreWhitespace = function(isWhitespaceIgnored) {
      return this.ignoreWhitespaceValue.checked = isWhitespaceIgnored;
    };

    FooterView.prototype.setAutoDiff = function(isAutoDiffEnabled) {
      return this.autoDiffValue.checked = isAutoDiffEnabled;
    };

    return FooterView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvdWkvZm9vdGVyLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msb0JBQUMsbUJBQUQsRUFBc0IsdUJBQXRCLEVBQStDLGlCQUEvQyxFQUFrRSxlQUFsRTtBQUVYLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsZUFBdkI7TUFPQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCO01BQ2pCLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBekIsQ0FBNkIsS0FBN0I7TUFDQSxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQXpCLENBQTZCLFFBQTdCO01BQ0EsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUF6QixDQUE2QixXQUE3QjtNQUNBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCLFNBQUE7ZUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBdkIsRUFBMkQsc0JBQTNEO01BRHVCO01BRXpCLGNBQWMsQ0FBQyxLQUFmLEdBQXVCO01BRXZCLGNBQUEsR0FBaUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkI7TUFDakIsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUF6QixDQUE2QixLQUE3QjtNQUNBLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBekIsQ0FBNkIsUUFBN0I7TUFDQSxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQXpCLENBQTZCLFdBQTdCO01BQ0EsY0FBYyxDQUFDLE9BQWYsR0FBeUIsU0FBQTtl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QUFEO01BQ2xCLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxXQUFyQixHQUFtQzthQUNuQyxJQUFDLENBQUEsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUExQixDQUFpQyxRQUFqQztJQUZrQjs7eUJBS3BCLGtCQUFBLEdBQW9CLFNBQUE7YUFDbEIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBMUIsQ0FBOEIsUUFBOUI7SUFEa0I7O3lCQUlwQixtQkFBQSxHQUFxQixTQUFDLG1CQUFEO2FBQ25CLElBQUMsQ0FBQSxxQkFBcUIsQ0FBQyxPQUF2QixHQUFpQztJQURkOzt5QkFJckIsV0FBQSxHQUFhLFNBQUMsaUJBQUQ7YUFDWCxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsR0FBeUI7SUFEZDs7Ozs7QUFwTWYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBGb290ZXJWaWV3XG4gIGNvbnN0cnVjdG9yOiAoaXNXaGl0ZXNwYWNlSWdub3JlZCwgZGlzYWJsZUlnbm9yZVdoaXRlc3BhY2UsIGlzQXV0b0RpZmZFbmFibGVkLCBkaXNhYmxlQXV0b0RpZmYpIC0+XG4gICAgIyBjcmVhdGUgcm9vdCBVSSBlbGVtZW50XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3NwbGl0LWRpZmYtdWknKVxuXG4gICAgIyAtLS0tLS0tLS0tLS1cbiAgICAjIExFRlQgQ09MVU1OIHxcbiAgICAjIC0tLS0tLS0tLS0tLVxuXG4gICAgIyBjcmVhdGUgcHJldiBkaWZmIGJ1dHRvblxuICAgIHByZXZEaWZmQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBwcmV2RGlmZkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKVxuICAgIHByZXZEaWZmQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bi1tZCcpXG4gICAgcHJldkRpZmZCdXR0b24uY2xhc3NMaXN0LmFkZCgncHJldi1kaWZmJylcbiAgICBwcmV2RGlmZkJ1dHRvbi5vbmNsaWNrID0gKCkgLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ3NwbGl0LWRpZmY6cHJldi1kaWZmJylcbiAgICBwcmV2RGlmZkJ1dHRvbi50aXRsZSA9ICdNb3ZlIHRvIFByZXZpb3VzIERpZmYnXG4gICAgIyBjcmVhdGUgbmV4dCBkaWZmIGJ1dHRvblxuICAgIG5leHREaWZmQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBuZXh0RGlmZkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKVxuICAgIG5leHREaWZmQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bi1tZCcpXG4gICAgbmV4dERpZmZCdXR0b24uY2xhc3NMaXN0LmFkZCgnbmV4dC1kaWZmJylcbiAgICBuZXh0RGlmZkJ1dHRvbi5vbmNsaWNrID0gKCkgLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ3NwbGl0LWRpZmY6bmV4dC1kaWZmJylcbiAgICBuZXh0RGlmZkJ1dHRvbi50aXRsZSA9ICdNb3ZlIHRvIE5leHQgRGlmZidcblxuICAgICMgY3JlYXRlIHNlbGVjdGlvbiBjb3VudGVyXG4gICAgQHNlbGVjdGlvbkNvdW50VmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBAc2VsZWN0aW9uQ291bnRWYWx1ZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rpb24tY291bnQtdmFsdWUnKVxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKEBzZWxlY3Rpb25Db3VudFZhbHVlKVxuICAgICMgY3JlYXRlIHNlbGVjdGlvbiBkaXZpZGVyXG4gICAgc2VsZWN0aW9uRGl2aWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHNlbGVjdGlvbkRpdmlkZXIudGV4dENvbnRlbnQgPSAnLydcbiAgICBzZWxlY3Rpb25EaXZpZGVyLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGlvbi1kaXZpZGVyJylcbiAgICBAZWxlbWVudC5hcHBlbmRDaGlsZChzZWxlY3Rpb25EaXZpZGVyKVxuICAgICMgY3JlYXRlIHNlbGVjdGlvbiBjb3VudCBjb250YWluZXJcbiAgICBAc2VsZWN0aW9uQ291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBzZWxlY3Rpb25Db3VudC5jbGFzc0xpc3QuYWRkKCdzZWxlY3Rpb24tY291bnQnKVxuICAgIEBzZWxlY3Rpb25Db3VudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgICMgYWRkIGl0ZW1zIHRvIGNvbnRhaW5lclxuICAgIEBzZWxlY3Rpb25Db3VudC5hcHBlbmRDaGlsZChAc2VsZWN0aW9uQ291bnRWYWx1ZSlcbiAgICBAc2VsZWN0aW9uQ291bnQuYXBwZW5kQ2hpbGQoc2VsZWN0aW9uRGl2aWRlcilcblxuICAgICMgY3JlYXRlIG51bWJlciBvZiBkaWZmZXJlbmNlcyB2YWx1ZVxuICAgIEBudW1EaWZmZXJlbmNlc1ZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgQG51bURpZmZlcmVuY2VzVmFsdWUuY2xhc3NMaXN0LmFkZCgnbnVtLWRpZmYtdmFsdWUnKVxuICAgIEBudW1EaWZmZXJlbmNlc1ZhbHVlLmNsYXNzTGlzdC5hZGQoJ3NwbGl0LWRpZmYtbG9hZGluZy1pY29uJylcbiAgICAjIGNyZWF0ZSBudW1iZXIgb2YgZGlmZmVyZW5jZXMgdGV4dFxuICAgIEBudW1EaWZmZXJlbmNlc1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBAbnVtRGlmZmVyZW5jZXNUZXh0LnRleHRDb250ZW50ID0gJ2RpZmZlcmVuY2VzJ1xuICAgIEBudW1EaWZmZXJlbmNlc1RleHQuY2xhc3NMaXN0LmFkZCgnbnVtLWRpZmYtdGV4dCcpXG4gICAgIyBjcmVhdGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzIGNvbnRhaW5lclxuICAgIG51bURpZmZlcmVuY2VzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBudW1EaWZmZXJlbmNlcy5jbGFzc0xpc3QuYWRkKCdudW0tZGlmZicpXG4gICAgIyBhZGQgaXRlbXMgdG8gY29udGFpbmVyXG4gICAgbnVtRGlmZmVyZW5jZXMuYXBwZW5kQ2hpbGQoQG51bURpZmZlcmVuY2VzVmFsdWUpXG4gICAgbnVtRGlmZmVyZW5jZXMuYXBwZW5kQ2hpbGQoQG51bURpZmZlcmVuY2VzVGV4dClcbiAgICAjIGNyZWF0ZSBsZWZ0IGNvbHVtbiBhbmQgYWRkIHByZXYvbmV4dCBidXR0b25zIGFuZCBudW1iZXIgb2YgZGlmZmVyZW5jZXMgdGV4dFxuICAgIGxlZnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGxlZnQuY2xhc3NMaXN0LmFkZCgnbGVmdCcpXG4gICAgbGVmdC5hcHBlbmRDaGlsZChwcmV2RGlmZkJ1dHRvbilcbiAgICBsZWZ0LmFwcGVuZENoaWxkKG5leHREaWZmQnV0dG9uKVxuICAgIGxlZnQuYXBwZW5kQ2hpbGQoQHNlbGVjdGlvbkNvdW50KVxuICAgIGxlZnQuYXBwZW5kQ2hpbGQobnVtRGlmZmVyZW5jZXMpXG4gICAgIyBhZGQgY29udGFpbmVyIHRvIFVJXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQobGVmdClcblxuICAgICMgLS0tLS0tLS0tLS1cbiAgICAjIE1JRCBDT0xVTU4gfFxuICAgICMgLS0tLS0tLS0tLS1cblxuICAgICMgY3JlYXRlIGNvcHkgdG8gbGVmdCBidXR0b25cbiAgICBjb3B5VG9MZWZ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBjb3B5VG9MZWZ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bicpXG4gICAgY29weVRvTGVmdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4tbWQnKVxuICAgIGNvcHlUb0xlZnRCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29weS10by1sZWZ0JylcbiAgICBjb3B5VG9MZWZ0QnV0dG9uLm9uY2xpY2sgPSAoKSAtPlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnc3BsaXQtZGlmZjpjb3B5LXRvLWxlZnQnKVxuICAgIGNvcHlUb0xlZnRCdXR0b24udGl0bGUgPSAnQ29weSB0byBMZWZ0J1xuICAgICNjb3B5VG9MZWZ0QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHkgdG8gTGVmdCdcbiAgICAjIGNyZWF0ZSBjb3B5IHRvIHJpZ2h0IGJ1dHRvblxuICAgIGNvcHlUb1JpZ2h0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBjb3B5VG9SaWdodEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nKVxuICAgIGNvcHlUb1JpZ2h0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2J0bi1tZCcpXG4gICAgY29weVRvUmlnaHRCdXR0b24uY2xhc3NMaXN0LmFkZCgnY29weS10by1yaWdodCcpXG4gICAgY29weVRvUmlnaHRCdXR0b24ub25jbGljayA9ICgpIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdzcGxpdC1kaWZmOmNvcHktdG8tcmlnaHQnKVxuICAgIGNvcHlUb1JpZ2h0QnV0dG9uLnRpdGxlID0gJ0NvcHkgdG8gUmlnaHQnXG4gICAgI2NvcHlUb1JpZ2h0QnV0dG9uLnRleHRDb250ZW50ID0gJ0NvcHkgdG8gUmlnaHQnXG4gICAgIyBjcmVhdGUgbWlkIGNvbHVtblxuICAgIG1pZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgI21pZC5jbGFzc0xpc3QuYWRkKCdidG4tZ3JvdXAnKVxuICAgIG1pZC5jbGFzc0xpc3QuYWRkKCdtaWQnKVxuICAgICMgYWRkIGJ1dHRvbnMgdG8gYnV0dG9uIGdyb3VwXG4gICAgbWlkLmFwcGVuZENoaWxkKGNvcHlUb0xlZnRCdXR0b24pXG4gICAgbWlkLmFwcGVuZENoaWxkKGNvcHlUb1JpZ2h0QnV0dG9uKVxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKG1pZClcblxuICAgICMgLS0tLS0tLS0tLS0tLVxuICAgICMgUklHSFQgQ09MVU1OIHxcbiAgICAjIC0tLS0tLS0tLS0tLS1cblxuICAgICMgY3JlYXRlIGlnbm9yZSB3aGl0ZXNwYWNlIGNoZWNrYm94XG4gICAgQGlnbm9yZVdoaXRlc3BhY2VWYWx1ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgICBAaWdub3JlV2hpdGVzcGFjZVZhbHVlLnR5cGUgPSAnY2hlY2tib3gnXG4gICAgQGlnbm9yZVdoaXRlc3BhY2VWYWx1ZS5pZCA9ICdpZ25vcmUtd2hpdGVzcGFjZS1jaGVja2JveCdcbiAgICAjIHNldCBjaGVja2JveCB2YWx1ZSB0byBjdXJyZW50IHBhY2thZ2UgaWdub3JlIHdoaXRlc3BhY2Ugc2V0dGluZ1xuICAgIEBpZ25vcmVXaGl0ZXNwYWNlVmFsdWUuY2hlY2tlZCA9IGlzV2hpdGVzcGFjZUlnbm9yZWRcbiAgICAjIHNldCBjaGVja2JveCB0byBkaXNhYmxlZCBpZiBzZXJ2aWNlIGlzIG92ZXJyaWRpbmdcbiAgICBAaWdub3JlV2hpdGVzcGFjZVZhbHVlLmRpc2FibGVkID0gZGlzYWJsZUlnbm9yZVdoaXRlc3BhY2VcbiAgICAjIHJlZ2lzdGVyIGNvbW1hbmQgdG8gY2hlY2tib3hcbiAgICBAaWdub3JlV2hpdGVzcGFjZVZhbHVlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdzcGxpdC1kaWZmOnNldC1pZ25vcmUtd2hpdGVzcGFjZScpXG4gICAgKVxuICAgICMgY3JlYXRlIGlnbm9yZSB3aGl0ZXNwYWNlIGxhYmVsXG4gICAgaWdub3JlV2hpdGVzcGFjZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKVxuICAgIGlnbm9yZVdoaXRlc3BhY2VMYWJlbC5jbGFzc0xpc3QuYWRkKCdpZ25vcmUtd2hpdGVzcGFjZS1sYWJlbCcpXG4gICAgaWdub3JlV2hpdGVzcGFjZUxhYmVsLmh0bWxGb3IgPSAnaWdub3JlLXdoaXRlc3BhY2UtY2hlY2tib3gnXG4gICAgaWdub3JlV2hpdGVzcGFjZUxhYmVsLnRleHRDb250ZW50ID0gJ0lnbm9yZSBXaGl0ZXNwYWNlJ1xuXG4gICAgIyBjcmVhdGUgaWdub3JlIHdoaXRlc3BhY2UgY2hlY2tib3hcbiAgICBAYXV0b0RpZmZWYWx1ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JylcbiAgICBAYXV0b0RpZmZWYWx1ZS50eXBlID0gJ2NoZWNrYm94J1xuICAgIEBhdXRvRGlmZlZhbHVlLmlkID0gJ2F1dG8tZGlmZi1jaGVja2JveCdcbiAgICAjIHNldCBjaGVja2JveCB2YWx1ZSB0byBjdXJyZW50IHBhY2thZ2UgaWdub3JlIHdoaXRlc3BhY2Ugc2V0dGluZ1xuICAgIEBhdXRvRGlmZlZhbHVlLmNoZWNrZWQgPSBpc0F1dG9EaWZmRW5hYmxlZFxuICAgICMgc2V0IGNoZWNrYm94IHRvIGRpc2FibGVkIGlmIHNlcnZpY2UgaXMgb3ZlcnJpZGluZ1xuICAgIEBhdXRvRGlmZlZhbHVlLmRpc2FibGVkID0gZGlzYWJsZUF1dG9EaWZmXG4gICAgIyByZWdpc3RlciBjb21tYW5kIHRvIGNoZWNrYm94XG4gICAgQGF1dG9EaWZmVmFsdWUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ3NwbGl0LWRpZmY6c2V0LWF1dG8tZGlmZicpXG4gICAgKVxuICAgICMgY3JlYXRlIGlnbm9yZSB3aGl0ZXNwYWNlIGxhYmVsXG4gICAgYXV0b0RpZmZMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJylcbiAgICBhdXRvRGlmZkxhYmVsLmNsYXNzTGlzdC5hZGQoJ2F1dG8tZGlmZi1sYWJlbCcpXG4gICAgYXV0b0RpZmZMYWJlbC5odG1sRm9yID0gJ2F1dG8tZGlmZi1jaGVja2JveCdcbiAgICBhdXRvRGlmZkxhYmVsLnRleHRDb250ZW50ID0gJ0F1dG8gRGlmZidcblxuICAgICMgY3JlYXRlIHJpZ2h0IGNvbHVtblxuICAgIHJpZ2h0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICByaWdodC5jbGFzc0xpc3QuYWRkKCdyaWdodCcpXG4gICAgIyBhZGQgaXRlbXMgdG8gY29udGFpbmVyXG4gICAgcmlnaHQuYXBwZW5kQ2hpbGQoQGlnbm9yZVdoaXRlc3BhY2VWYWx1ZSlcbiAgICByaWdodC5hcHBlbmRDaGlsZChpZ25vcmVXaGl0ZXNwYWNlTGFiZWwpXG4gICAgcmlnaHQuYXBwZW5kQ2hpbGQoQGF1dG9EaWZmVmFsdWUpXG4gICAgcmlnaHQuYXBwZW5kQ2hpbGQoYXV0b0RpZmZMYWJlbClcbiAgICAjIGFkZCBzZXR0aW5ncyB0byBVSVxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKHJpZ2h0KVxuXG4gICMgVGVhciBkb3duIGFueSBzdGF0ZSBhbmQgZGV0YWNoXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGVsZW1lbnQucmVtb3ZlKClcbiAgICBAZm9vdGVyUGFuZWwuZGVzdHJveSgpXG5cbiAgZ2V0RWxlbWVudDogLT5cbiAgICBAZWxlbWVudFxuXG4gIGNyZWF0ZVBhbmVsOiAtPlxuICAgIEBmb290ZXJQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKGl0ZW06IEBlbGVtZW50KVxuXG4gIHNob3c6IC0+XG4gICAgQGZvb3RlclBhbmVsLnNob3coKVxuXG4gIGhpZGU6IC0+XG4gICAgQGZvb3RlclBhbmVsLmhpZGUoKVxuXG4gIHNldExvYWRpbmc6IC0+XG4gICAgQG51bURpZmZlcmVuY2VzVmFsdWUudGV4dENvbnRlbnQgPSBudWxsXG4gICAgQG51bURpZmZlcmVuY2VzVmFsdWUuY2xhc3NMaXN0LmFkZCgnc3BsaXQtZGlmZi1sb2FkaW5nLWljb24nKVxuXG4gICMgc2V0IHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXMgdmFsdWVcbiAgc2V0TnVtRGlmZmVyZW5jZXM6IChudW0pIC0+XG4gICAgQG51bURpZmZlcmVuY2VzVmFsdWUuY2xhc3NMaXN0LnJlbW92ZSgnc3BsaXQtZGlmZi1sb2FkaW5nLWljb24nKVxuICAgIGlmIG51bSA9PSAxXG4gICAgICBAbnVtRGlmZmVyZW5jZXNUZXh0LnRleHRDb250ZW50ID0gJ2RpZmZlcmVuY2UnXG4gICAgZWxzZVxuICAgICAgQG51bURpZmZlcmVuY2VzVGV4dC50ZXh0Q29udGVudCA9ICdkaWZmZXJlbmNlcydcbiAgICBAbnVtRGlmZmVyZW5jZXNWYWx1ZS50ZXh0Q29udGVudCA9IG51bVxuXG4gICMgc2hvdyB0aGUgc2VsZWN0aW9uIGNvdW50ZXIgbmV4dCB0byB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG4gICMgaXQgd2lsbCB0dXJuICdZIGRpZmZlcmVuY2VzJyBpbnRvICdYIC8gWSBkaWZmZXJlbmNlcydcbiAgc2hvd1NlbGVjdGlvbkNvdW50OiAoY291bnQpIC0+XG4gICAgQHNlbGVjdGlvbkNvdW50VmFsdWUudGV4dENvbnRlbnQgPSBjb3VudFxuICAgIEBzZWxlY3Rpb25Db3VudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuXG4gICMgaGlkZSB0aGUgc2VsZWN0aW9uIGNvdW50ZXIgbmV4dCB0byB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG4gIGhpZGVTZWxlY3Rpb25Db3VudDogKCkgLT5cbiAgICBAc2VsZWN0aW9uQ291bnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcblxuICAjIHNldCB0aGUgc3RhdGUgb2YgdGhlIGlnbm9yZSB3aGl0ZXNwYWNlIGNoZWNrYm94XG4gIHNldElnbm9yZVdoaXRlc3BhY2U6IChpc1doaXRlc3BhY2VJZ25vcmVkKSAtPlxuICAgIEBpZ25vcmVXaGl0ZXNwYWNlVmFsdWUuY2hlY2tlZCA9IGlzV2hpdGVzcGFjZUlnbm9yZWRcblxuICAjIHNldCB0aGUgc3RhdGUgb2YgdGhlIGF1dG8gZGlmZiBjaGVja2JveFxuICBzZXRBdXRvRGlmZjogKGlzQXV0b0RpZmZFbmFibGVkKSAtPlxuICAgIEBhdXRvRGlmZlZhbHVlLmNoZWNrZWQgPSBpc0F1dG9EaWZmRW5hYmxlZFxuIl19
