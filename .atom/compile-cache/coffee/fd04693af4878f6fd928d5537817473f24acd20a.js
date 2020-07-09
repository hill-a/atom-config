(function() {
  var DEFAULT_INDENT, DEFAULT_WARN_FN, adjust_space;

  DEFAULT_INDENT = '    ';

  adjust_space = function(line) {
    var comment, muli_string, string_list;
    string_list = line.match(/(['"])[^\1]*?\1/g);
    muli_string = line.match(/\[(=*)\[([^\]\1\]]*)/);
    comment = line.match(/\-{2}[^\[].*$/);
    line = line.replace(/\s+/g, ' ');
    line = line.replace(/\s?(==|>=|<=|~=|[=><\+\*\/])\s?/g, ' $1 ');
    line = line.replace(/([^=e\-\(\s])\s?\-\s?([^\-\[])/g, '$1 - $2');
    line = line.replace(/([^\d])e\s?\-\s?([^\-\[])/g, '$1e - $2');
    line = line.replace(/,([^\s])/g, ', $1');
    line = line.replace(/\s+,/g, ',');
    line = line.replace(/(['"])[^\1]*?\1/g, function() {
      return string_list.shift();
    });
    if (muli_string && muli_string[0]) {
      line = line.replace(/\[(=*)\[([^\]\1\]]*)/, muli_string[0]);
    }
    if (comment && comment[0]) {
      line = line.replace(/\-{2}[^\[].*$/, comment[0]);
    }
    return line;
  };

  DEFAULT_WARN_FN = function(msg) {
    return console.log('WARNING:', msg);
  };

  module.exports = function(str, indent, warn_fn, opts) {
    var $currIndent, $extIndent, $lastIndent, $nextIndent, $prevLength, $template, eol, new_code;
    if (opts == null) {
      opts = {};
    }
    eol = (opts != null ? opts.eol : void 0) || '\n';
    indent = indent || DEFAULT_INDENT;
    warn_fn = typeof warn_fn === 'function' ? warn_fn : DEFAULT_WARN_FN;
    if (Number.isInteger(indent)) {
      indent = ' '.repeat(indent);
    }
    $currIndent = 0;
    $nextIndent = 0;
    $prevLength = 0;
    $extIndent = 0;
    $lastIndent = 0;
    $template = 0;
    new_code = str.split(/\r?\n/g).map(function(line, line_number) {
      var $brackets, $curly, $template_flag, $useful, arr, code, comment, new_line, raw_line, res1, res2;
      $template_flag = false;
      if ($template) {
        res2 = line.match(/\](=*)\]/);
        if (res2 && $template === res2[1].length + 1) {
          $template_flag = true;
          if ($template && !/]=*]$/.test(line)) {
            arr = line.split(/\]=*\]/, 2);
            comment = arr[0];
            code = arr[1];
            line = comment + ']' + '='.repeat($template - 1) + ']' + adjust_space(code);
            $template = 0;
          }
          $template = 0;
        } else {
          return line;
        }
      }
      res1 = line.match(/\[(=*)\[/);
      if (res1 && (!new RegExp("\\]" + ('='.repeat(res1[1].length)) + "\\]").test(line))) {
        $template = res1[1].length + 1;
      }
      if (!$template_flag) {
        line = line.trim();
        line = adjust_space(line);
      }
      if (!line.length) {
        return '';
      }
      raw_line = line;
      line = line.replace(/(['"])[^\1]*?\1/g, '');
      line = line.replace(/\s*--.+$/, '');
      if (/^((local )?function|repeat|while)\b/.test(line) && !/\bend\s*[\),;]*$/.test(line) || /\b(then|do)$/.test(line) && !/^elseif\b/.test(line) || /^if\b/.test(line) && /\bthen\b/.test(line) && !/\bend$/.test(line) || /\bfunction ?(?:\w+ )?\([^\)]*\)$/.test(line) && !/\bend$/.test(line)) {
        $nextIndent = $currIndent + 1;
      } else if (/^until\b/.test(line) || /^end\s*[\),;]*$/.test(line) || /^end\s*\)\s*\.\./.test(line) || /^else(if)?\b/.test(line) && /\bend$/.test(line)) {
        $nextIndent = --$currIndent;
      } else if (/^else\b/.test(line) || /^elseif\b/.test(line)) {
        $nextIndent = $currIndent;
        $currIndent = $currIndent - 1;
      }
      $brackets = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      $curly = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if ($curly < 0) {
        $currIndent += $curly;
      }
      if ($brackets < 0) {
        $currIndent += $brackets;
      }
      $nextIndent += $brackets + $curly;
      if ($currIndent - $lastIndent > 1) {
        $extIndent += $nextIndent - $lastIndent - 1;
        $nextIndent = $currIndent = 1 + $lastIndent;
      }
      if ($currIndent - $lastIndent < -1 && $extIndent > 0) {
        $extIndent += $currIndent - $lastIndent + 1;
        $currIndent = -1 + $lastIndent;
      }
      if ($nextIndent < $currIndent) {
        $nextIndent = $currIndent;
      }
      if ($currIndent < 0) {
        warn_fn("negative indentation at line " + line_number + ": " + raw_line);
      }
      new_line = (raw_line.length && $currIndent > 0 && !$template_flag ? indent.repeat($currIndent) : '') + raw_line;
      $useful = $prevLength > 0 || raw_line.length > 0;
      $lastIndent = $currIndent;
      $currIndent = $nextIndent;
      $prevLength = raw_line.length;
      return new_line || void 0;
    });
    if ($currIndent > 0) {
      warn_fn('positive indentation at the end');
    }
    return new_code.join(eol);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvbHVhLWJlYXV0aWZpZXIvYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGNBQUEsR0FBaUI7O0VBRWpCLFlBQUEsR0FBZSxTQUFDLElBQUQ7QUFDYixRQUFBO0lBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFMLENBQVcsa0JBQVg7SUFDZCxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxzQkFBWDtJQUNkLE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLGVBQVg7SUFDVixJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCO0lBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsa0NBQWIsRUFBaUQsTUFBakQ7SUFFUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxpQ0FBYixFQUFnRCxTQUFoRDtJQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLDRCQUFiLEVBQTJDLFVBQTNDO0lBRVAsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsV0FBYixFQUEwQixNQUExQjtJQUVQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFBc0IsR0FBdEI7SUFFUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxrQkFBYixFQUFpQyxTQUFBO2FBQ3RDLFdBQVcsQ0FBQyxLQUFaLENBQUE7SUFEc0MsQ0FBakM7SUFFUCxJQUFHLFdBQUEsSUFBZ0IsV0FBWSxDQUFBLENBQUEsQ0FBL0I7TUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxzQkFBYixFQUFxQyxXQUFZLENBQUEsQ0FBQSxDQUFqRCxFQURUOztJQUVBLElBQUcsT0FBQSxJQUFZ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QUFSLEVBQUE7O1dBQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkO0VBNUVlO0FBNUJqQiIsInNvdXJjZXNDb250ZW50IjpbIkRFRkFVTFRfSU5ERU5UID0gJyAgICAnXG5cbmFkanVzdF9zcGFjZSA9IChsaW5lKSAtPlxuICBzdHJpbmdfbGlzdCA9IGxpbmUubWF0Y2ggLyhbJ1wiXSlbXlxcMV0qP1xcMS9nXG4gIG11bGlfc3RyaW5nID0gbGluZS5tYXRjaCAvXFxbKD0qKVxcWyhbXlxcXVxcMVxcXV0qKS9cbiAgY29tbWVudCA9IGxpbmUubWF0Y2ggL1xcLXsyfVteXFxbXS4qJC9cbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvXFxzKy9nLCAnICdcbiAgIyByZXBsYWNlIGFsbCB3aGl0ZXNwYWNlcyBpbnNpZGUgdGhlIHN0cmluZyB3aXRoIG9uZSBzcGFjZSwgV0FSTklORzogdGhlIHdoaXRlc3BhY2VzIGluIHN0cmluZyB3aWxsIGJlIHJlcGxhY2UgdG9vIVxuICBsaW5lID0gbGluZS5yZXBsYWNlIC9cXHM/KD09fD49fDw9fH49fFs9PjxcXCtcXCpcXC9dKVxccz8vZywgJyAkMSAnXG4gICMgYWRkIHdoaXRlc3BhY2UgYXJvdW5kIHRoZSBvcGVyYXRvclxuICBsaW5lID0gbGluZS5yZXBsYWNlIC8oW149ZVxcLVxcKFxcc10pXFxzP1xcLVxccz8oW15cXC1cXFtdKS9nLCAnJDEgLSAkMidcbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvKFteXFxkXSllXFxzP1xcLVxccz8oW15cXC1cXFtdKS9nLCAnJDFlIC0gJDInXG4gICMganVzdCBmb3JtYXQgbWludXMsIG5vdCBmb3IgLS0gb3IgbmVnYXRpdmUgbnVtYmVyIG9yIGNvbW1lbnRhcnkuXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgLywoW15cXHNdKS9nLCAnLCAkMSdcbiAgIyBhZGp1c3QgJywnXG4gIGxpbmUgPSBsaW5lLnJlcGxhY2UgL1xccyssL2csICcsJ1xuICAjIHJlY292ZXIgdGhlIHdoaXRlc3BhY2VzIGluIHN0cmluZy5cbiAgbGluZSA9IGxpbmUucmVwbGFjZSAvKFsnXCJdKVteXFwxXSo/XFwxL2csIC0+XG4gICAgc3RyaW5nX2xpc3Quc2hpZnQoKVxuICBpZiBtdWxpX3N0cmluZyBhbmQgbXVsaV9zdHJpbmdbMF1cbiAgICBsaW5lID0gbGluZS5yZXBsYWNlIC9cXFsoPSopXFxbKFteXFxdXFwxXFxdXSopLywgbXVsaV9zdHJpbmdbMF1cbiAgaWYgY29tbWVudCBhbmQgY29tbWVudFswXVxuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UgL1xcLXsyfVteXFxbXS4qJC8sIGNvbW1lbnRbMF1cbiAgbGluZVxuXG5ERUZBVUxUX1dBUk5fRk4gPSAobXNnKSAtPlxuICBjb25zb2xlLmxvZygnV0FSTklORzonLCBtc2cpXG5cbm1vZHVsZS5leHBvcnRzID0gKHN0ciwgaW5kZW50LCB3YXJuX2ZuLCBvcHRzID0ge30pIC0+XG4gIGVvbCA9IG9wdHM/LmVvbCBvciAnXFxuJ1xuICBpbmRlbnQgPSBpbmRlbnQgb3IgREVGQVVMVF9JTkRFTlRcbiAgd2Fybl9mbiA9IGlmIHR5cGVvZiB3YXJuX2ZuID09ICdmdW5jdGlvbicgdGhlbiB3YXJuX2ZuIGVsc2UgREVGQVVMVF9XQVJOX0ZOXG4gIGluZGVudCA9ICcgJy5yZXBlYXQoaW5kZW50KSBpZiBOdW1iZXIuaXNJbnRlZ2VyKGluZGVudClcbiAgJGN1cnJJbmRlbnQgPSAwXG4gICRuZXh0SW5kZW50ID0gMFxuICAkcHJldkxlbmd0aCA9IDBcbiAgJGV4dEluZGVudCA9IDBcbiAgJGxhc3RJbmRlbnQgPSAwXG4gICR0ZW1wbGF0ZSA9IDBcbiAgbmV3X2NvZGUgPSBzdHIuc3BsaXQoL1xccj9cXG4vZykubWFwIChsaW5lLCBsaW5lX251bWJlcikgLT5cbiAgICAkdGVtcGxhdGVfZmxhZyA9IGZhbHNlXG4gICAgaWYgJHRlbXBsYXRlXG4gICAgICByZXMyID0gbGluZS5tYXRjaCgvXFxdKD0qKVxcXS8pXG4gICAgICBpZiByZXMyIGFuZCAkdGVtcGxhdGUgPT0gcmVzMlsxXS5sZW5ndGggKyAxXG4gICAgICAgICR0ZW1wbGF0ZV9mbGFnID0gdHJ1ZVxuICAgICAgICBpZiAkdGVtcGxhdGUgYW5kICEvXT0qXSQvLnRlc3QobGluZSlcbiAgICAgICAgICBhcnIgPSBsaW5lLnNwbGl0KC9cXF09KlxcXS8sIDIpXG4gICAgICAgICAgY29tbWVudCA9IGFyclswXVxuICAgICAgICAgIGNvZGUgPSBhcnJbMV1cbiAgICAgICAgICBsaW5lID0gY29tbWVudCArICddJyArICc9Jy5yZXBlYXQoJHRlbXBsYXRlIC0gMSkgKyAnXScgKyBhZGp1c3Rfc3BhY2UoY29kZSlcbiAgICAgICAgICAkdGVtcGxhdGUgPSAwXG4gICAgICAgICR0ZW1wbGF0ZSA9IDBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGxpbmVcbiAgICByZXMxID0gbGluZS5tYXRjaCgvXFxbKD0qKVxcWy8pXG4gICAgaWYgcmVzMSBhbmQgKG5vdCBuZXcgUmVnRXhwKFwiXFxcXF0jeyc9Jy5yZXBlYXQgcmVzMVsxXS5sZW5ndGh9XFxcXF1cIikudGVzdCBsaW5lKVxuICAgICAgJHRlbXBsYXRlID0gcmVzMVsxXS5sZW5ndGggKyAxXG4gICAgaWYgISR0ZW1wbGF0ZV9mbGFnXG4gICAgICBsaW5lID0gbGluZS50cmltKClcbiAgICAgICMgcmVtb3RlIGFsbCBzcGFjZXMgb24gYm90aCBlbmRzXG4gICAgICBsaW5lID0gYWRqdXN0X3NwYWNlKGxpbmUpXG4gICAgaWYgIWxpbmUubGVuZ3RoXG4gICAgICByZXR1cm4gJydcbiAgICByYXdfbGluZSA9IGxpbmVcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC8oWydcIl0pW15cXDFdKj9cXDEvZywgJycpXG4gICAgIyByZW1vdmUgYWxsIHF1b3RlZCBmcmFnbWVudHMgZm9yIHByb3BlciBicmFja2V0IHByb2Nlc3NpbmdcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHMqLS0uKyQvLCAnJylcbiAgICAjIHJlbW92ZSBhbGwgY29tbWVudHM7IHRoaXMgaWdub3JlcyBsb25nIGJyYWNrZXQgc3R5bGUgY29tbWVudHNcbiAgICBpZiAvXigobG9jYWwgKT9mdW5jdGlvbnxyZXBlYXR8d2hpbGUpXFxiLy50ZXN0KGxpbmUpIGFuZCAhL1xcYmVuZFxccypbXFwpLDtdKiQvLnRlc3QobGluZSkgb3IgL1xcYih0aGVufGRvKSQvLnRlc3QobGluZSkgYW5kICEvXmVsc2VpZlxcYi8udGVzdChsaW5lKSBvciAvXmlmXFxiLy50ZXN0KGxpbmUpIGFuZCAvXFxidGhlblxcYi8udGVzdChsaW5lKSBhbmQgIS9cXGJlbmQkLy50ZXN0KGxpbmUpIG9yIC9cXGJmdW5jdGlvbiA/KD86XFx3KyApP1xcKFteXFwpXSpcXCkkLy50ZXN0KGxpbmUpIGFuZCAhL1xcYmVuZCQvLnRlc3QobGluZSlcbiAgICAgICRuZXh0SW5kZW50ID0gJGN1cnJJbmRlbnQgKyAxXG4gICAgZWxzZSBpZiAvXnVudGlsXFxiLy50ZXN0KGxpbmUpIG9yIC9eZW5kXFxzKltcXCksO10qJC8udGVzdChsaW5lKSBvciAvXmVuZFxccypcXClcXHMqXFwuXFwuLy50ZXN0KGxpbmUpIG9yIC9eZWxzZShpZik/XFxiLy50ZXN0KGxpbmUpIGFuZCAvXFxiZW5kJC8udGVzdChsaW5lKVxuICAgICAgJG5leHRJbmRlbnQgPSAtLSRjdXJySW5kZW50XG4gICAgZWxzZSBpZiAvXmVsc2VcXGIvLnRlc3QobGluZSkgb3IgL15lbHNlaWZcXGIvLnRlc3QobGluZSlcbiAgICAgICRuZXh0SW5kZW50ID0gJGN1cnJJbmRlbnRcbiAgICAgICRjdXJySW5kZW50ID0gJGN1cnJJbmRlbnQgLSAxXG4gICAgJGJyYWNrZXRzID0gKGxpbmUubWF0Y2goL1xcKC9nKSBvciBbXSkubGVuZ3RoIC0gKChsaW5lLm1hdGNoKC9cXCkvZykgb3IgW10pLmxlbmd0aClcbiAgICAjIGNhcHR1cmUgdW5iYWxhbmNlZCBicmFja2V0c1xuICAgICRjdXJseSA9IChsaW5lLm1hdGNoKC9cXHsvZykgb3IgW10pLmxlbmd0aCAtICgobGluZS5tYXRjaCgvXFx9L2cpIG9yIFtdKS5sZW5ndGgpXG4gICAgIyBjYXB0dXJlIHVuYmFsYW5jZWQgY3VybHkgYnJhY2tldHNcbiAgICAjIGNsb3NlIChjdXJseSkgYnJhY2tldHMgaWYgbmVlZGVkXG4gICAgaWYgJGN1cmx5IDwgMFxuICAgICAgJGN1cnJJbmRlbnQgKz0gJGN1cmx5XG4gICAgaWYgJGJyYWNrZXRzIDwgMFxuICAgICAgJGN1cnJJbmRlbnQgKz0gJGJyYWNrZXRzXG4gICAgJG5leHRJbmRlbnQgKz0gJGJyYWNrZXRzICsgJGN1cmx5XG4gICAgIyBjb25zb2xlLmxvZyh7bGFzdDogJGxhc3RJbmRlbnQsIGN1cnI6ICRjdXJySW5kZW50LCBuZXh0OiAkbmV4dEluZGVudCwgZXh0OiAkZXh0SW5kZW50fSlcbiAgICBpZiAkY3VyckluZGVudCAtICRsYXN0SW5kZW50ID4gMVxuICAgICAgJGV4dEluZGVudCArPSAkbmV4dEluZGVudCAtICRsYXN0SW5kZW50IC0gMVxuICAgICAgJG5leHRJbmRlbnQgPSAkY3VyckluZGVudCA9IDEgKyAkbGFzdEluZGVudFxuICAgIGlmICRjdXJySW5kZW50IC0gJGxhc3RJbmRlbnQgPCAtMSBhbmQgJGV4dEluZGVudCA+IDBcbiAgICAgICRleHRJbmRlbnQgKz0gJGN1cnJJbmRlbnQgLSAkbGFzdEluZGVudCArIDFcbiAgICAgICRjdXJySW5kZW50ID0gLTEgKyAkbGFzdEluZGVudFxuICAgIGlmICRuZXh0SW5kZW50IDwgJGN1cnJJbmRlbnRcbiAgICAgICRuZXh0SW5kZW50ID0gJGN1cnJJbmRlbnRcbiAgICAjIGNvbnNvbGUubG9nKHtsYXN0OiAkbGFzdEluZGVudCwgY3VycjogJGN1cnJJbmRlbnQsIG5leHQ6ICRuZXh0SW5kZW50LCBleHQ6ICRleHRJbmRlbnR9KVxuICAgIHdhcm5fZm4gXCJcIlwibmVnYXRpdmUgaW5kZW50YXRpb24gYXQgbGluZSAje2xpbmVfbnVtYmVyfTogI3tyYXdfbGluZX1cIlwiXCIgaWYgJGN1cnJJbmRlbnQgPCAwXG4gICAgbmV3X2xpbmUgPSAoaWYgcmF3X2xpbmUubGVuZ3RoIGFuZCAkY3VyckluZGVudCA+IDAgYW5kICEkdGVtcGxhdGVfZmxhZyB0aGVuIGluZGVudC5yZXBlYXQoJGN1cnJJbmRlbnQpIGVsc2UgJycpICsgcmF3X2xpbmVcbiAgICAkdXNlZnVsID0gJHByZXZMZW5ndGggPiAwIG9yIHJhd19saW5lLmxlbmd0aCA+IDBcbiAgICAkbGFzdEluZGVudCA9ICRjdXJySW5kZW50XG4gICAgJGN1cnJJbmRlbnQgPSAkbmV4dEluZGVudFxuICAgICRwcmV2TGVuZ3RoID0gcmF3X2xpbmUubGVuZ3RoXG4gICAgbmV3X2xpbmUgb3IgdW5kZWZpbmVkXG5cbiAgd2Fybl9mbiAncG9zaXRpdmUgaW5kZW50YXRpb24gYXQgdGhlIGVuZCcgaWYgJGN1cnJJbmRlbnQgPiAwXG4gIG5ld19jb2RlLmpvaW4gZW9sIl19
