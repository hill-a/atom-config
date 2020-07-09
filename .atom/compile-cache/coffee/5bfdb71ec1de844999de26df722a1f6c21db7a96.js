(function() {
  var $, TextEditor, TypeView, etch;

  TextEditor = require('atom').TextEditor;

  etch = require('etch');

  $ = etch.dom;

  module.exports = TypeView = (function() {
    TypeView.typeList = null;

    TypeView.typeIndex = null;

    TypeView.editor = null;

    TypeView.marker = null;

    TypeView.subscription = null;

    function TypeView(typeList, editor) {
      this.typeList = typeList;
      this.editor = editor;
      this.typeIndex = 0;
      etch.initialize(this);
      this.refs.editor.element.removeAttribute('tabindex');
    }

    TypeView.prototype.render = function() {
      return $.div({
        "class": 'ocaml-merlin-type'
      }, $(TextEditor, {
        ref: 'editor',
        mini: true,
        grammar: atom.workspace.grammarRegistry.grammarForScopeName('source.ocaml'),
        autoHeight: true,
        autoWidth: true
      }));
    };

    TypeView.prototype.update = function() {
      return etch.update(this);
    };

    TypeView.prototype.show = function() {
      var range, ref, type;
      this.destroy();
      ref = this.typeList[this.typeIndex], range = ref.range, type = ref.type;
      this.refs.editor.setText(type);
      this.marker = this.editor.markBufferRange(range);
      this.editor.decorateMarker(this.marker, range.isSingleLine() && type.split('\n').length < 10 ? {
        type: 'overlay',
        item: this.element,
        position: 'tail',
        "class": 'ocaml-merlin'
      } : {
        type: 'block',
        item: this.element,
        position: 'after'
      });
      this.editor.decorateMarker(this.marker, {
        type: 'highlight',
        "class": 'ocaml-merlin'
      });
      this.subscription = this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      return type;
    };

    TypeView.prototype.expand = function() {
      var ref, ref1;
      if (!((ref = this.typeIndex + 1 < ((ref1 = this.typeList) != null ? ref1.length : void 0)) != null ? ref : 0)) {
        return;
      }
      this.typeIndex += 1;
      return this.show();
    };

    TypeView.prototype.shrink = function() {
      if (!(this.typeIndex > 0)) {
        return;
      }
      this.typeIndex -= 1;
      return this.show();
    };

    TypeView.prototype.destroy = function() {
      var ref, ref1;
      if ((ref = this.marker) != null) {
        ref.destroy();
      }
      return (ref1 = this.subscription) != null ? ref1.dispose() : void 0;
    };

    return TypeView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvb2NhbWwtbWVybGluL2xpYi90eXBlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUNmLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxDQUFBLEdBQUksSUFBSSxDQUFDOztFQUVULE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBQ3JCLFFBQUMsQ0FBQSxRQUFELEdBQVc7O0lBQ1gsUUFBQyxDQUFBLFNBQUQsR0FBWTs7SUFFWixRQUFDLENBQUEsTUFBRCxHQUFTOztJQUNULFFBQUMsQ0FBQSxNQUFELEdBQVM7O0lBRVQsUUFBQyxDQUFBLFlBQUQsR0FBZTs7SUFFRixrQkFBQyxRQUFELEVBQVksTUFBWjtNQUFDLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFNBQUQ7TUFDdkIsSUFBQyxDQUFBLFNBQUQsR0FBYTtNQUNiLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQXJCLENBQXFDLFVBQXJDO0lBSFc7O3VCQUtiLE1BQUEsR0FBUSxTQUFBO2FBQ04sQ0FBQyxDQUFDLEdBQUYsQ0FDRTtRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7T0FERixFQUVFLENBQUEsQ0FBRSxVQUFGLEVBQ0U7UUFBQSxHQUFBLEVBQUssUUFBTDtRQUNBLElBQUEsRUFBTSxJQUROO1FBRUEsT0FBQSxFQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLG1CQUEvQixDQUFtRCxjQUFuRCxDQUZUO1FBR0EsVUFBQSxFQUFZLElBSFo7UUFJQSxTQUFBLEVBQVcsSUFKWDtPQURGLENBRkY7SUFETTs7dUJBVVIsTUFBQSxHQUFRLFNBQUE7YUFDTixJQUFJLENBQUMsTUFBTCxDQUFZLElBQVo7SUFETTs7dUJBR1IsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQTtNQUNBLE1BQWdCLElBQUMsQ0FBQSxRQUFTLENBQUEsSUFBQyxDQUFBLFNBQUQsQ0FBMUIsRUFBQyxpQkFBRCxFQUFRO01BQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBYixDQUFxQixJQUFyQjtNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLEtBQXhCO01BQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLElBQUMsQ0FBQSxNQUF4QixFQUNLLEtBQUssQ0FBQyxZQUFOLENBQUEsQ0FBQSxJQUF5QixJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBZ0IsQ0FBQyxNQUFqQixHQUEwQixFQUF0RCxHQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxJQUFBLEVBQU0sSUFBQyxDQUFBLE9BRFA7UUFFQSxRQUFBLEVBQVUsTUFGVjtRQUdBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FIUDtPQURGLEdBTUU7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLElBQUEsRUFBTSxJQUFDLENBQUEsT0FEUDtRQUVBLFFBQUEsRUFBVSxPQUZWO09BUEo7TUFVQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLE1BQXhCLEVBQ0U7UUFBQSxJQUFBLEVBQU0sV0FBTjtRQUNBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FEUDtPQURGO01BR0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQzthQUNoQjtJQW5CSTs7dUJBcUJOLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLElBQUEsQ0FBQSxzR0FBbUQsQ0FBbkQsQ0FBQTtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLFNBQUQsSUFBYzthQUNkLElBQUMsQ0FBQSxJQUFELENBQUE7SUFITTs7dUJBS1IsTUFBQSxHQUFRLFNBQUE7TUFDTixJQUFBLENBQUEsQ0FBYyxJQUFDLENBQUEsU0FBRCxHQUFhLENBQTNCLENBQUE7QUFBQSxlQUFBOztNQUNBLElBQUMsQ0FBQSxTQUFELElBQWM7YUFDZCxJQUFDLENBQUEsSUFBRCxDQUFBO0lBSE07O3VCQUtSLE9BQUEsR0FBUyxTQUFBO0FBR1AsVUFBQTs7V0FBTyxDQUFFLE9BQVQsQ0FBQTs7c0RBQ2EsQ0FBRSxPQUFmLENBQUE7SUFKTzs7Ozs7QUE5RFgiLCJzb3VyY2VzQ29udGVudCI6WyJ7VGV4dEVkaXRvcn0gPSByZXF1aXJlICdhdG9tJ1xuZXRjaCA9IHJlcXVpcmUgJ2V0Y2gnXG4kID0gZXRjaC5kb21cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUeXBlVmlld1xuICBAdHlwZUxpc3Q6IG51bGxcbiAgQHR5cGVJbmRleDogbnVsbFxuXG4gIEBlZGl0b3I6IG51bGxcbiAgQG1hcmtlcjogbnVsbFxuXG4gIEBzdWJzY3JpcHRpb246IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKEB0eXBlTGlzdCwgQGVkaXRvcikgLT5cbiAgICBAdHlwZUluZGV4ID0gMFxuICAgIGV0Y2guaW5pdGlhbGl6ZSB0aGlzXG4gICAgQHJlZnMuZWRpdG9yLmVsZW1lbnQucmVtb3ZlQXR0cmlidXRlICd0YWJpbmRleCdcblxuICByZW5kZXI6IC0+XG4gICAgJC5kaXZcbiAgICAgIGNsYXNzOiAnb2NhbWwtbWVybGluLXR5cGUnLFxuICAgICAgJCBUZXh0RWRpdG9yLFxuICAgICAgICByZWY6ICdlZGl0b3InXG4gICAgICAgIG1pbmk6IHRydWVcbiAgICAgICAgZ3JhbW1hcjogYXRvbS53b3Jrc3BhY2UuZ3JhbW1hclJlZ2lzdHJ5LmdyYW1tYXJGb3JTY29wZU5hbWUgJ3NvdXJjZS5vY2FtbCdcbiAgICAgICAgYXV0b0hlaWdodDogdHJ1ZVxuICAgICAgICBhdXRvV2lkdGg6IHRydWVcblxuICB1cGRhdGU6IC0+XG4gICAgZXRjaC51cGRhdGUgdGhpc1xuXG4gIHNob3c6IC0+XG4gICAgQGRlc3Ryb3koKVxuICAgIHtyYW5nZSwgdHlwZX0gPSBAdHlwZUxpc3RbQHR5cGVJbmRleF1cbiAgICBAcmVmcy5lZGl0b3Iuc2V0VGV4dCB0eXBlXG4gICAgQG1hcmtlciA9IEBlZGl0b3IubWFya0J1ZmZlclJhbmdlIHJhbmdlXG4gICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBAbWFya2VyLFxuICAgICAgaWYgcmFuZ2UuaXNTaW5nbGVMaW5lKCkgYW5kIHR5cGUuc3BsaXQoJ1xcbicpLmxlbmd0aCA8IDEwXG4gICAgICAgIHR5cGU6ICdvdmVybGF5J1xuICAgICAgICBpdGVtOiBAZWxlbWVudFxuICAgICAgICBwb3NpdGlvbjogJ3RhaWwnXG4gICAgICAgIGNsYXNzOiAnb2NhbWwtbWVybGluJ1xuICAgICAgZWxzZVxuICAgICAgICB0eXBlOiAnYmxvY2snXG4gICAgICAgIGl0ZW06IEBlbGVtZW50XG4gICAgICAgIHBvc2l0aW9uOiAnYWZ0ZXInXG4gICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBAbWFya2VyLFxuICAgICAgdHlwZTogJ2hpZ2hsaWdodCdcbiAgICAgIGNsYXNzOiAnb2NhbWwtbWVybGluJ1xuICAgIEBzdWJzY3JpcHRpb24gPSBAZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24gPT4gQGRlc3Ryb3koKVxuICAgIHR5cGVcblxuICBleHBhbmQ6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAdHlwZUluZGV4ICsgMSA8IEB0eXBlTGlzdD8ubGVuZ3RoID8gMFxuICAgIEB0eXBlSW5kZXggKz0gMVxuICAgIEBzaG93KClcblxuICBzaHJpbms6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAdHlwZUluZGV4ID4gMFxuICAgIEB0eXBlSW5kZXggLT0gMVxuICAgIEBzaG93KClcblxuICBkZXN0cm95OiAtPlxuICAgICMgZXRjaC5kZXN0cm95IHRoaXNcbiAgICAjIC50aGVuID0+XG4gICAgQG1hcmtlcj8uZGVzdHJveSgpXG4gICAgQHN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4iXX0=
