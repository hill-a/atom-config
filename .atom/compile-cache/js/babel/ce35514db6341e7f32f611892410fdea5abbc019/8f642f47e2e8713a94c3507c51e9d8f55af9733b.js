"use babel";

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('atom-space-pen-views');

var $ = _require.$;
var ScrollView = _require.ScrollView;

var _require2 = require('atom');

var Point = _require2.Point;

var fs = require('fs-plus');
var path = require('path');
var _ = require('underscore-plus');

var _require3 = require('atom');

var File = _require3.File;
var Disposable = _require3.Disposable;
var CompositeDisposable = _require3.CompositeDisposable;

var _require4 = require('loophole');

var Function = _require4.Function;

global.Function = Function;

global.PDFJS = { workerSrc: "temp", cMapUrl: "temp", cMapPacked: true };
require('./../node_modules/pdfjs-dist/build/pdf.js');
PDFJS.workerSrc = "file://" + path.resolve(__dirname, "../node_modules/pdfjs-dist/build/pdf.worker.js");
PDFJS.cMapUrl = "file://" + path.resolve(__dirname, "../node_modules/pdfjs-dist/cmaps") + "/";

var _require5 = require('child_process');

var exec = _require5.exec;
var execFile = _require5.execFile;

var PdfEditorView = (function (_ScrollView) {
  _inherits(PdfEditorView, _ScrollView);

  _createClass(PdfEditorView, null, [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'pdf-view', tabindex: -1 }, function () {
        _this.div({ outlet: 'container', style: 'position: relative' });
      });
    }
  }]);

  function PdfEditorView(filePath) {
    var scale = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var _this2 = this;

    var scrollTop = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
    var scrollLeft = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    _classCallCheck(this, PdfEditorView);

    _get(Object.getPrototypeOf(PdfEditorView.prototype), 'constructor', this).call(this);

    this.currentScale = scale ? scale : 1.5;
    this.defaultScale = 1.5;
    this.scaleFactor = 10.0;
    this.fitToWidthOnOpen = !scale && atom.config.get('pdf-view.fitToWidthOnOpen');

    this.filePath = filePath;
    this.file = new File(this.filePath);
    this.scrollTopBeforeUpdate = scrollTop;
    this.scrollLeftBeforeUpdate = scrollLeft;
    this.canvases = [];
    this.updating = false;

    this.updatePdf(true);

    this.pdfViewElements = [];
    this.binaryViewEditor = null;

    this.currentPageNumber = 0;
    this.totalPageNumber = 0;
    this.centersBetweenPages = [];
    this.pageHeights = [];
    this.maxPageWidth = 0;
    this.toScaleFactor = 1.0;
    this.dragging = null;

    var disposables = new CompositeDisposable();

    var needsUpdateCallback = function needsUpdateCallback() {
      if (_this2.updating) {
        _this2.needsUpdate = true;
      } else {
        _this2.updatePdf();
      }
    };

    var toggleNightModeCallback = function toggleNightModeCallback() {
      _this2.setNightMode();
    };

    disposables.add(atom.config.onDidChange('pdf-view.nightMode', toggleNightModeCallback));
    disposables.add(atom.config.onDidChange('pdf-view.reverseSyncBehaviour', needsUpdateCallback));

    disposables.add(this.file.onDidChange(function () {
      if (atom.config.get('pdf-view.autoReloadOnUpdate')) {
        needsUpdateCallback();
      } else {
        _this2.fileUpdated = true;
      }
    }));

    var autoReloadDisposable = undefined;
    var setupAutoReload = function setupAutoReload() {
      if (!atom.config.get('pdf-view.autoReloadOnUpdate')) {
        autoReloadDisposable = atom.workspace.onDidOpen(function (e) {
          if (e.item == _this2 && _this2.fileUpdated) {
            _this2.fileUpdated = false;
            needsUpdateCallback();
          }
        });
      } else {
        if (autoReloadDisposable) {
          disposables.remove(autoReloadDisposable);
          autoReloadDisposable.dispose();
        }

        if (_this2.fileUpdated) {
          _this2.fileUpdated = false;
          needsUpdateCallback();
        }
      }
    };
    disposables.add(atom.config.observe('pdf-view.autoReloadOnUpdate', setupAutoReload));

    var moveLeftCallback = function moveLeftCallback() {
      return _this2.scrollLeft(_this2.scrollLeft() - $(window).width() / 20);
    };
    var moveRightCallback = function moveRightCallback() {
      return _this2.scrollRight(_this2.scrollRight() + $(window).width() / 20);
    };
    var scrollCallback = function scrollCallback() {
      return _this2.onScroll();
    };
    var resizeHandler = function resizeHandler() {
      return _this2.setCurrentPageNumber();
    };

    atom.commands.add('.pdf-view', {
      'core:move-left': moveLeftCallback,
      'core:move-right': moveRightCallback
    });

    this.on('scroll', scrollCallback);
    $(window).on('resize', resizeHandler);

    disposables.add(new Disposable(function () {
      $(window).off('scroll', scrollCallback);
      $(window).off('resize', resizeHandler);
    }));

    atom.commands.add('atom-workspace', {
      'pdf-view:zoom-fit': function pdfViewZoomFit() {
        if (_this2.hasFocus()) {
          _this2.zoomFit();
        }
      },
      'pdf-view:zoom-in': function pdfViewZoomIn() {
        if (_this2.hasFocus()) {
          _this2.zoomIn();
        }
      },
      'pdf-view:zoom-out': function pdfViewZoomOut() {
        if (_this2.hasFocus()) {
          _this2.zoomOut();
        }
      },
      'pdf-view:reset-zoom': function pdfViewResetZoom() {
        if (_this2.hasFocus()) {
          _this2.resetZoom();
        }
      },
      'pdf-view:go-to-next-page': function pdfViewGoToNextPage() {
        if (_this2.hasFocus()) {
          _this2.goToNextPage();
        }
      },
      'pdf-view:go-to-previous-page': function pdfViewGoToPreviousPage() {
        if (_this2.hasFocus()) {
          _this2.goToPreviousPage();
        }
      },
      'pdf-view:reload': function pdfViewReload() {
        _this2.updatePdf(true);
      }
    });

    this.onMouseMove = function (e) {
      if (_this2.binaryView) {
        return;
      }
      if (_this2.dragging) {
        _this2.simpleClick = false;

        _this2.scrollTop(_this2.dragging.scrollTop - (e.screenY - _this2.dragging.y));
        _this2.scrollLeft(_this2.dragging.scrollLeft - (e.screenX - _this2.dragging.x));
        e.preventDefault();
      }
    };

    this.onMouseUp = function (e) {
      if (_this2.binaryView) {
        return;
      }
      _this2.dragging = null;
      $(document).unbind('mousemove', _this2.onMouseMove);
      $(document).unbind('mouseup', _this2.onMouseUp);
      e.preventDefault();
    };

    this.on('mousedown', function (e) {
      if (_this2.binaryView) {
        return;
      }
      _this2.simpleClick = true;
      atom.workspace.paneForItem(_this2).activate();
      _this2.dragging = { x: e.screenX, y: e.screenY, scrollTop: _this2.scrollTop(), scrollLeft: _this2.scrollLeft() };
      $(document).on('mousemove', _this2.onMouseMove);
      $(document).on('mouseup', _this2.onMouseUp);
      e.preventDefault();
    });

    this.on('mousewheel', function (e) {
      if (_this2.binaryView) {
        return;
      }
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.originalEvent.wheelDelta > 0) {
          _this2.zoomIn();
        } else if (e.originalEvent.wheelDelta < 0) {
          _this2.zoomOut();
        }
      }
    });
  }

  _createClass(PdfEditorView, [{
    key: 'hasFocus',
    value: function hasFocus() {
      return !this.binaryView && atom.workspace.getActivePaneItem() === this;
    }
  }, {
    key: 'setNightMode',
    value: function setNightMode() {
      if (atom.config.get('pdf-view.nightMode')) {
        this.addClass('night-mode');
      } else {
        this.removeClass('night-mode');
      }
    }
  }, {
    key: 'reverseSync',
    value: function reverseSync(page, e) {
      var _this3 = this;

      if (this.simpleClick) {
        e.preventDefault();
        this.pdfDocument.getPage(page).then(function (pdfPage) {
          var viewport = pdfPage.getViewport(_this3.currentScale);
          var x = undefined,
              y = undefined;

          var _viewport$convertToPdfPoint = viewport.convertToPdfPoint(e.offsetX, $(_this3.canvases[page - 1]).height() - e.offsetY);

          var _viewport$convertToPdfPoint2 = _slicedToArray(_viewport$convertToPdfPoint, 2);

          x = _viewport$convertToPdfPoint2[0];
          y = _viewport$convertToPdfPoint2[1];

          var callback = function callback(error, stdout, stderr) {
            if (!error) {
              stdout = stdout.replace(/\r\n/g, '\n');
              var attrs = {};
              for (var _line of stdout.split('\n')) {
                var m = _line.match(/^([a-zA-Z]*):(.*)$/);
                if (m) {
                  attrs[m[1]] = m[2];
                }
              }

              var file = attrs.Input;
              var line = attrs.Line;

              if (file && line) {
                var editor = null;
                var pathToOpen = path.normalize(attrs.Input);
                var lineToOpen = +attrs.Line;
                var done = false;
                for (var _editor of atom.workspace.getTextEditors()) {
                  if (_editor.getPath() === pathToOpen) {
                    var position = new Point(lineToOpen - 1, -1);
                    _editor.scrollToBufferPosition(position, { center: true });
                    _editor.setCursorBufferPosition(position);
                    _editor.moveToFirstCharacterOfLine();
                    var pane = atom.workspace.paneForItem(_editor);
                    pane.activateItem(_editor);
                    pane.activate();
                    done = true;
                    break;
                  }
                }

                if (!done) {
                  var paneopt = atom.config.get('pdf-view.paneToUseInSynctex');
                  atom.workspace.open(pathToOpen, { initialLine: lineToOpen, initialColumn: 0, split: paneopt });
                }
              }
            }
          };

          var synctexPath = atom.config.get('pdf-view.syncTeXPath');
          var clickspec = [page, x, y, _this3.filePath].join(':');

          if (synctexPath) {
            execFile(synctexPath, ["edit", "-o", clickspec], callback);
          } else {
            var cmd = 'synctex edit -o "' + clickspec + '"';
            exec(cmd, callback);
          }
        });
      }
    }
  }, {
    key: 'forwardSync',
    value: function forwardSync(texPath, lineNumber) {
      var _this4 = this;

      if (this.updating) {
        this.forwardSyncAfterUpdate = {
          texPath: texPath,
          lineNumber: lineNumber
        };
        return;
      }

      var callback = function callback(error, stdout, stderr) {
        if (!error) {
          var _ret = (function () {
            stdout = stdout.replace(/\r\n/g, '\n');
            var attrs = {};
            for (var line of stdout.split('\n')) {
              var m = line.match(/^([a-zA-Z]*):(.*)$/);
              if (m) {
                if (m[1] in attrs) {
                  break;
                }

                attrs[m[1]] = m[2];
              }
            }

            var page = parseInt(attrs.Page);

            if (!_this4.pdfDocument) {
              return {
                v: undefined
              };
            }

            if (page > _this4.pdfDocument.numPages) {
              return {
                v: undefined
              };
            }

            _this4.pdfDocument.getPage(page).then(function (pdfPage) {
              var viewport = pdfPage.getViewport(_this4.currentScale);
              var canvas = _this4.canvases[page - 1];

              var x = parseFloat(attrs.x);
              var y = parseFloat(attrs.y);

              var _viewport$convertToViewportPoint = viewport.convertToViewportPoint(x, y);

              var _viewport$convertToViewportPoint2 = _slicedToArray(_viewport$convertToViewportPoint, 2);

              x = _viewport$convertToViewportPoint2[0];
              y = _viewport$convertToViewportPoint2[1];

              x = x + canvas.offsetLeft;
              y = viewport.height - y + canvas.offsetTop;

              var visibilityThreshold = 50;

              // Scroll
              if (y < _this4.scrollTop() + visibilityThreshold) {
                _this4.scrollTop(y - visibilityThreshold);
              } else if (y > _this4.scrollBottom() - visibilityThreshold) {
                _this4.scrollBottom(y + visibilityThreshold);
              }

              if (x < _this4.scrollLeft() + visibilityThreshold) {
                _this4.scrollLeft(x - visibilityThreshold);
              } else if (x > _this4.scrollRight() - visibilityThreshold) {
                _this4.scrollBottom(x + visibilityThreshold);
              }

              // Show highlighter
              $('<div/>', {
                'class': "tex-highlight",
                style: 'top: ' + y + 'px; left: ' + x + 'px;'
              }).appendTo(_this4.container).on('animationend', function () {
                $(this).remove();
              });
            });
          })();

          if (typeof _ret === 'object') return _ret.v;
        }
      };

      var synctexPath = atom.config.get('pdf-view.syncTeXPath');
      var inputspec = [lineNumber, 0, texPath].join(':');

      if (synctexPath) {
        execFile(synctexPath, ["view", "-i", inputspec, "-o", this.filePath], callback);
      } else {
        var cmd = 'synctex view -i "' + inputspec + '" -o "' + this.filePath + '"';
        exec(cmd, callback);
      }
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
      if (this.binaryView) {
        return;
      }

      if (!this.updating) {
        this.scrollTopBeforeUpdate = this.scrollTop();
        this.scrollLeftBeforeUpdate = this.scrollLeft();
      }

      this.setCurrentPageNumber();
    }
  }, {
    key: 'setCurrentPageNumber',
    value: function setCurrentPageNumber() {
      if (!this.pdfDocument || this.binaryView) {
        return;
      }

      var center = (this.scrollBottom() + this.scrollTop()) / 2.0;
      this.currentPageNumber = 1;

      if (this.centersBetweenPages.length === 0 && this.pageHeights.length === this.pdfDocument.numPages) for (var pdfPageNumber of _.range(1, this.pdfDocument.numPages + 1)) {
        this.centersBetweenPages.push(this.pageHeights.slice(0, pdfPageNumber).reduce(function (x, y) {
          return x + y;
        }, 0) + pdfPageNumber * 20 - 10);
      }

      for (var pdfPageNumber of _.range(2, this.pdfDocument.numPages + 1)) {
        if (center >= this.centersBetweenPages[pdfPageNumber - 2] && center < this.centersBetweenPages[pdfPageNumber - 1]) {
          this.currentPageNumber = pdfPageNumber;
        }
      }

      atom.views.getView(atom.workspace).dispatchEvent(new Event('pdf-view:current-page-update'));
    }
  }, {
    key: 'finishUpdate',
    value: function finishUpdate() {
      this.updating = false;
      if (this.needsUpdate) {
        this.updatePdf();
      }
      if (this.toScaleFactor != 1) {
        this.adjustSize(1);
      }
      if (this.scrollToPageAfterUpdate) {
        this.scrollToPage(this.scrollToPageAfterUpdate);
        delete this.scrollToPageAfterUpdate;
      }
      if (this.scrollToNamedDestAfterUpdate) {
        this.scrollToNamedDest(this.scrollToNamedDestAfterUpdate);
        delete this.scrollToNamedDestAfterUpdate;
      }
      if (this.forwardSyncAfterUpdate) {
        this.forwardSync(this.forwardSyncAfterUpdate.texPath, this.forwardSyncAfterUpdate.lineNumber);
        delete this.forwardSyncAfterUpdate;
      }
    }
  }, {
    key: 'updatePdf',
    value: function updatePdf() {
      var _this5 = this;

      var closeOnError = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.needsUpdate = false;

      if (!fs.existsSync(this.filePath)) {
        return;
      }

      var pdfData = null;

      try {
        pdfData = new Uint8Array(fs.readFileSync(this.filePath));
      } catch (error) {
        if (error.code === 'ENOENT') {
          return;
        }
      }

      this.updating = true;

      var reverseSyncClicktype = null;
      switch (atom.config.get('pdf-view.reverseSyncBehaviour')) {
        case 'Click':
          reverseSyncClicktype = 'click';
          break;
        case 'Double click':
          reverseSyncClicktype = 'dblclick';
          break;
      }

      this.setNightMode();

      PDFJS.getDocument(pdfData).then(function (pdfDocument) {
        _this5.container.find("canvas").remove();
        _this5.canvases = [];
        _this5.pageHeights = [];

        _this5.pdfDocument = pdfDocument;
        _this5.totalPageNumber = _this5.pdfDocument.numPages;

        var _loop = function (pdfPageNumber) {
          var canvas = $("<canvas/>", { 'class': "page-container" }).appendTo(_this5.container)[0];
          _this5.canvases.push(canvas);
          _this5.pageHeights.push(0);
          if (reverseSyncClicktype) {
            $(canvas).on(reverseSyncClicktype, function (e) {
              return _this5.reverseSync(pdfPageNumber, e);
            });
          }
        };

        for (var pdfPageNumber of _.range(1, _this5.pdfDocument.numPages + 1)) {
          _loop(pdfPageNumber);
        }

        _this5.maxPageWidth = 0;

        if (_this5.fitToWidthOnOpen) {
          Promise.all(_.range(1, _this5.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
            return _this5.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
              return pdfPage.getViewport(1.0).width;
            });
          })).then(function (pdfPageWidths) {
            _this5.maxPageWidth = Math.max.apply(Math, _toConsumableArray(pdfPageWidths));
            _this5.renderPdf();
          });
        } else {
          _this5.renderPdf();
        }
      }, function () {
        if (closeOnError) {
          atom.notifications.addError(_this5.filePath + " is not a PDF file.");
          atom.workspace.paneForItem(_this5).destroyItem(_this5);
        } else {
          _this5.finishUpdate();
        }
      });
    }
  }, {
    key: 'renderPdf',
    value: function renderPdf() {
      var _this6 = this;

      var scrollAfterRender = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.centersBetweenPages = [];

      if (this.fitToWidthOnOpen) {
        this.currentScale = this[0].clientWidth / this.maxPageWidth;
        this.fitToWidthOnOpen = false;
      }

      Promise.all(_.range(1, this.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
        var canvas = _this6.canvases[pdfPageNumber - 1];

        return _this6.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
          var viewport = pdfPage.getViewport(_this6.currentScale);
          var context = canvas.getContext('2d');

          var outputScale = window.devicePixelRatio;
          canvas.height = Math.floor(viewport.height) * outputScale;
          canvas.width = Math.floor(viewport.width) * outputScale;

          context._scaleX = outputScale;
          context._scaleY = outputScale;
          context.scale(outputScale, outputScale);
          context._transformMatrix = [outputScale, 0, 0, outputScale, 0, 0];
          canvas.style.width = Math.floor(viewport.width) + 'px';
          canvas.style.height = Math.floor(viewport.height) + 'px';

          _this6.pageHeights[pdfPageNumber - 1] = Math.floor(viewport.height);

          return pdfPage.render({ canvasContext: context, viewport: viewport });
        });
      })).then(function (renderTasks) {
        if (scrollAfterRender) {
          _this6.scrollTop(_this6.scrollTopBeforeUpdate);
          _this6.scrollLeft(_this6.scrollLeftBeforeUpdate);
          _this6.setCurrentPageNumber();
        }
        Promise.all(renderTasks).then(function () {
          return _this6.finishUpdate();
        });
      }, function () {
        return _this6.finishUpdate();
      });
    }
  }, {
    key: 'computeMaxPageWidthAndTryZoomFit',
    value: function computeMaxPageWidthAndTryZoomFit() {
      var _this7 = this;

      Promise.all(_.range(1, this.pdfDocument.numPages + 1).map(function (pdfPageNumber) {
        return _this7.pdfDocument.getPage(pdfPageNumber).then(function (pdfPage) {
          return pdfPage.getViewport(1.0).width;
        });
      })).then(function (pdfPageWidths) {
        _this7.maxPageWidth = Math.max.apply(Math, _toConsumableArray(pdfPageWidths));
        _this7.zoomFit();
      });
    }
  }, {
    key: 'zoomFit',
    value: function zoomFit() {
      if (this.maxPageWidth == 0) {
        this.computeMaxPageWidthAndTryZoomFit();
        return;
      }
      var fitScale = this[0].clientWidth / this.maxPageWidth;
      return this.adjustSize(fitScale / (this.currentScale * this.toScaleFactor));
    }
  }, {
    key: 'zoomOut',
    value: function zoomOut() {
      return this.adjustSize(100 / (100 + this.scaleFactor));
    }
  }, {
    key: 'zoomIn',
    value: function zoomIn() {
      return this.adjustSize((100 + this.scaleFactor) / 100);
    }
  }, {
    key: 'resetZoom',
    value: function resetZoom() {
      return this.adjustSize(this.defaultScale / this.currentScale);
    }
  }, {
    key: 'goToNextPage',
    value: function goToNextPage() {
      return this.scrollToPage(this.currentPageNumber + 1);
    }
  }, {
    key: 'goToPreviousPage',
    value: function goToPreviousPage() {
      return this.scrollToPage(this.currentPageNumber - 1);
    }
  }, {
    key: 'computeZoomedScrollTop',
    value: function computeZoomedScrollTop(oldScrollTop, oldPageHeights) {
      var pixelsToZoom = 0;
      var spacesToSkip = 0;
      var zoomedPixels = 0;

      for (var pdfPageNumber of _.range(0, this.pdfDocument.numPages)) {
        if (pixelsToZoom + spacesToSkip + oldPageHeights[pdfPageNumber] > oldScrollTop) {
          zoomFactorForPage = this.pageHeights[pdfPageNumber] / oldPageHeights[pdfPageNumber];
          var partOfPageAboveUpperBorder = oldScrollTop - (pixelsToZoom + spacesToSkip);
          zoomedPixels += Math.round(partOfPageAboveUpperBorder * zoomFactorForPage);
          pixelsToZoom += partOfPageAboveUpperBorder;
          break;
        } else {
          pixelsToZoom += oldPageHeights[pdfPageNumber];
          zoomedPixels += this.pageHeights[pdfPageNumber];
        }

        if (pixelsToZoom + spacesToSkip + 20 > oldScrollTop) {
          var partOfPaddingAboveUpperBorder = oldScrollTop - (pixelsToZoom + spacesToSkip);
          spacesToSkip += partOfPaddingAboveUpperBorder;
          break;
        } else {
          spacesToSkip += 20;
        }
      }

      return zoomedPixels + spacesToSkip;
    }
  }, {
    key: 'adjustSize',
    value: function adjustSize(factor) {
      var _this8 = this;

      if (!this.pdfDocument) {
        return;
      }

      factor = this.toScaleFactor * factor;

      if (this.updating) {
        this.toScaleFactor = factor;
        return;
      }

      this.updating = true;
      this.toScaleFactor = 1;

      var oldScrollTop = this.scrollTop();
      var oldPageHeights = this.pageHeights.slice(0);
      this.currentScale = this.currentScale * factor;
      this.renderPdf(false);

      process.nextTick(function () {
        var newScrollTop = _this8.computeZoomedScrollTop(oldScrollTop, oldPageHeights);
        _this8.scrollTop(newScrollTop);
      });

      process.nextTick(function () {
        var newScrollLeft = _this8.scrollLeft() * factor;
        _this8.scrollLeft(newScrollLeft);
      });
    }
  }, {
    key: 'getCurrentPageNumber',
    value: function getCurrentPageNumber() {
      return this.currentPageNumber;
    }
  }, {
    key: 'getTotalPageNumber',
    value: function getTotalPageNumber() {
      return this.totalPageNumber;
    }
  }, {
    key: 'scrollToPage',
    value: function scrollToPage(pdfPageNumber) {
      if (this.updating) {
        this.scrollToPageAfterUpdate = pdfPageNumber;
        return;
      }

      if (!this.pdfDocument || isNaN(pdfPageNumber)) {
        return;
      }

      pdfPageNumber = Math.min(pdfPageNumber, this.pdfDocument.numPages);
      pageScrollPosition = this.pageHeights.slice(0, pdfPageNumber - 1).reduce(function (x, y) {
        return x + y;
      }, 0) + (pdfPageNumber - 1) * 20;

      return this.scrollTop(pageScrollPosition);
    }
  }, {
    key: 'scrollToNamedDest',
    value: function scrollToNamedDest(namedDest) {
      var _this9 = this;

      if (this.updating) {
        this.scrollToNamedDestAfterUpdate = namedDest;
        return;
      }

      if (!this.pdfDocument) {
        return;
      }

      this.pdfDocument.getDestination(namedDest).then(function (destRef) {
        return _this9.pdfDocument.getPageIndex(destRef[0]);
      }).then(function (pageNumber) {
        return _this9.scrollToPage(pageNumber + 1);
      })['catch'](function () {
        return atom.notifications.addError('Cannot find named destination ' + namedDest + '.');
      });
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        filePath: this.filePath,
        scale: this.currentScale,
        scrollTop: this.scrollTopBeforeUpdate,
        scrollLeft: this.scrollLeftBeforeUpdate,
        deserializer: 'PdfEditorDeserializer'
      };
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      if (this.filePath) {
        return path.basename(this.filePath);
      } else {
        return 'untitled';
      }
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.filePath;
    }
  }, {
    key: 'getPath',
    value: function getPath() {
      return this.filePath;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      try {
        this.pdfDocument.destroy();
      } catch (e) {
        console.error(e);
      }
      return this.detach();
    }
  }, {
    key: 'onDidChangeTitle',
    value: function onDidChangeTitle() {
      return new Disposable(function () {
        return null;
      });
    }
  }, {
    key: 'onDidChangeModified',
    value: function onDidChangeModified() {
      return new Disposable(function () {
        return null;
      });
    }
  }, {
    key: 'binaryView',
    get: function get() {
      return this.hasClass('binary-view');
    },
    set: function set(enabled) {
      var container = this.container[0];
      if (!!enabled === this.binaryView) {
        return;
      }
      if (!this.binaryViewEditor) {
        var _require6 = require('atom');

        var TextBuffer = _require6.TextBuffer;
        var TextEditor = _require6.TextEditor;

        var buffer = TextBuffer.loadSync(this.filePath);
        this.binaryViewEditor = new TextEditor({ buffer: buffer, readOnly: true });
      }
      if (enabled) {
        this.addClass('binary-view');
        for (var el of Array.from(container.children)) {
          container.removeChild(el);
          this.pdfViewElements.push(el);
        }
        container.appendChild(this.binaryViewEditor.element);
      } else {
        this.removeClass('binary-view');
        container.removeChild(this.binaryViewEditor.element);
        while (this.pdfViewElements.length) {
          container.appendChild(this.pdfViewElements.shift());
        }
      }
    }
  }]);

  return PdfEditorView;
})(ScrollView);

exports['default'] = PdfEditorView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL3BkZi12aWV3L2xpYi9wZGYtZWRpdG9yLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7ZUFFVSxPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQWhELENBQUMsWUFBRCxDQUFDO0lBQUUsVUFBVSxZQUFWLFVBQVU7O2dCQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhCLEtBQUssYUFBTCxLQUFLOztBQUNWLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7O2dCQUNXLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0lBQXhELElBQUksYUFBSixJQUFJO0lBQUUsVUFBVSxhQUFWLFVBQVU7SUFBRSxtQkFBbUIsYUFBbkIsbUJBQW1COztnQkFDekIsT0FBTyxDQUFDLFVBQVUsQ0FBQzs7SUFBL0IsUUFBUSxhQUFSLFFBQVE7O0FBQ2IsTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O0FBRTNCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDLElBQUksRUFBQyxDQUFDO0FBQ3BFLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3JELEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGdEQUFnRCxDQUFDLENBQUM7QUFDeEcsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsa0NBQWtDLENBQUMsR0FBQyxHQUFHLENBQUM7O2dCQUNyRSxPQUFPLENBQUMsZUFBZSxDQUFDOztJQUExQyxJQUFJLGFBQUosSUFBSTtJQUFFLFFBQVEsYUFBUixRQUFROztJQUVFLGFBQWE7WUFBYixhQUFhOztlQUFiLGFBQWE7O1dBQ2xCLG1CQUFHOzs7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsU0FBTyxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUUsWUFBTTtBQUNoRCxjQUFLLEdBQUcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFDLENBQUMsQ0FBQztPQUM5RCxDQUFDLENBQUM7S0FDSjs7O0FBRVUsV0FQUSxhQUFhLENBT3BCLFFBQVEsRUFBK0M7UUFBN0MsS0FBSyx5REFBRyxJQUFJOzs7O1FBQUUsU0FBUyx5REFBRyxDQUFDO1FBQUUsVUFBVSx5REFBRyxDQUFDOzswQkFQOUMsYUFBYTs7QUFROUIsK0JBUmlCLGFBQWEsNkNBUXRCOztBQUVSLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDeEMsUUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7QUFDeEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0FBRS9FLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxTQUFTLENBQUM7QUFDdkMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLFVBQVUsQ0FBQztBQUN6QyxRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUMzQixRQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztBQUN6QixRQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0FBQzlCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixRQUFJLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7O0FBRTVDLFFBQUksbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLEdBQVM7QUFDOUIsVUFBSSxPQUFLLFFBQVEsRUFBRTtBQUNqQixlQUFLLFdBQVcsR0FBRyxJQUFJLENBQUM7T0FDekIsTUFBTTtBQUNMLGVBQUssU0FBUyxFQUFFLENBQUM7T0FDbEI7S0FDRixDQUFBOztBQUVELFFBQUksdUJBQXVCLEdBQUcsU0FBMUIsdUJBQXVCLEdBQVM7QUFDbEMsYUFBSyxZQUFZLEVBQUUsQ0FBQztLQUNyQixDQUFBOztBQUVELGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsK0JBQStCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOztBQUUvRixlQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDMUMsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFO0FBQ2xELDJCQUFtQixFQUFFLENBQUM7T0FDdkIsTUFBTTtBQUNMLGVBQUssV0FBVyxHQUFHLElBQUksQ0FBQztPQUN6QjtLQUNGLENBQUMsQ0FBQyxDQUFDOztBQUVKLFFBQUksb0JBQW9CLFlBQUEsQ0FBQztBQUN6QixRQUFJLGVBQWUsR0FBRyxTQUFsQixlQUFlLEdBQVM7QUFDMUIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLEVBQUU7QUFDbkQsNEJBQW9CLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBQyxDQUFDLEVBQUs7QUFDckQsY0FBSSxDQUFDLENBQUMsSUFBSSxVQUFRLElBQUksT0FBSyxXQUFXLEVBQUU7QUFDdEMsbUJBQUssV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN6QiwrQkFBbUIsRUFBRSxDQUFDO1dBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO09BQ0osTUFBTTtBQUNMLFlBQUcsb0JBQW9CLEVBQUU7QUFDdkIscUJBQVcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN6Qyw4QkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQzs7QUFFRCxZQUFJLE9BQUssV0FBVyxFQUFFO0FBQ3BCLGlCQUFLLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDekIsNkJBQW1CLEVBQUUsQ0FBQztTQUN2QjtPQUNGO0tBQ0YsQ0FBQTtBQUNELGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFckYsUUFBSSxnQkFBZ0IsR0FBSSxTQUFwQixnQkFBZ0I7YUFBVSxPQUFLLFVBQVUsQ0FBQyxPQUFLLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7S0FBQSxBQUFDLENBQUM7QUFDM0YsUUFBSSxpQkFBaUIsR0FBSSxTQUFyQixpQkFBaUI7YUFBVSxPQUFLLFdBQVcsQ0FBQyxPQUFLLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7S0FBQSxBQUFDLENBQUM7QUFDOUYsUUFBSSxjQUFjLEdBQUksU0FBbEIsY0FBYzthQUFVLE9BQUssUUFBUSxFQUFFO0tBQUEsQUFBQyxDQUFDO0FBQzdDLFFBQUksYUFBYSxHQUFJLFNBQWpCLGFBQWE7YUFBVSxPQUFLLG9CQUFvQixFQUFFO0tBQUEsQUFBQyxDQUFDOztBQUV4RCxRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUU7QUFDN0Isc0JBQWdCLEVBQUUsZ0JBQWdCO0FBQ2xDLHVCQUFpQixFQUFFLGlCQUFpQjtLQUNyQyxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDbEMsS0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FBRXRDLGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsWUFBTTtBQUNuQyxPQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUN4QyxPQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztLQUN4QyxDQUFDLENBQUMsQ0FBQzs7QUFFSixRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNsQyx5QkFBbUIsRUFBRSwwQkFBTTtBQUN6QixZQUFJLE9BQUssUUFBUSxFQUFFLEVBQUU7QUFDbkIsaUJBQUssT0FBTyxFQUFFLENBQUM7U0FDaEI7T0FDRjtBQUNELHdCQUFrQixFQUFFLHlCQUFNO0FBQ3hCLFlBQUksT0FBSyxRQUFRLEVBQUUsRUFBRTtBQUNuQixpQkFBSyxNQUFNLEVBQUUsQ0FBQztTQUNmO09BQ0Y7QUFDRCx5QkFBbUIsRUFBRSwwQkFBTTtBQUN6QixZQUFJLE9BQUssUUFBUSxFQUFFLEVBQUU7QUFDbkIsaUJBQUssT0FBTyxFQUFFLENBQUM7U0FDaEI7T0FDRjtBQUNELDJCQUFxQixFQUFFLDRCQUFNO0FBQzNCLFlBQUksT0FBSyxRQUFRLEVBQUUsRUFBRTtBQUNuQixpQkFBSyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtPQUNGO0FBQ0QsZ0NBQTBCLEVBQUUsK0JBQU07QUFDaEMsWUFBSSxPQUFLLFFBQVEsRUFBRSxFQUFFO0FBQ25CLGlCQUFLLFlBQVksRUFBRSxDQUFDO1NBQ3JCO09BQ0Y7QUFDRCxvQ0FBOEIsRUFBRSxtQ0FBTTtBQUNwQyxZQUFJLE9BQUssUUFBUSxFQUFFLEVBQUU7QUFDbkIsaUJBQUssZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjtPQUNGO0FBQ0QsdUJBQWlCLEVBQUUseUJBQU07QUFDdkIsZUFBSyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEI7S0FDRixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN4QixVQUFJLE9BQUssVUFBVSxFQUFFO0FBQ25CLGVBQU87T0FDUjtBQUNELFVBQUksT0FBSyxRQUFRLEVBQUU7QUFDakIsZUFBSyxXQUFXLEdBQUcsS0FBSyxDQUFDOztBQUV6QixlQUFLLFNBQVMsQ0FBQyxPQUFLLFFBQVEsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDeEUsZUFBSyxVQUFVLENBQUMsT0FBSyxRQUFRLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzFFLFNBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUNwQjtLQUNGLENBQUM7O0FBRUYsUUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFDLENBQUMsRUFBSztBQUN0QixVQUFJLE9BQUssVUFBVSxFQUFFO0FBQ25CLGVBQU87T0FDUjtBQUNELGFBQUssUUFBUSxHQUFHLElBQUksQ0FBQztBQUNyQixPQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQ2xELE9BQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE9BQUssU0FBUyxDQUFDLENBQUM7QUFDOUMsT0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3BCLENBQUM7O0FBRUYsUUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDMUIsVUFBSSxPQUFLLFVBQVUsRUFBRTtBQUNuQixlQUFPO09BQ1I7QUFDRCxhQUFLLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLFFBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUM1QyxhQUFLLFFBQVEsR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFLLFNBQVMsRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFLLFVBQVUsRUFBRSxFQUFDLENBQUM7QUFDekcsT0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsT0FBSyxXQUFXLENBQUMsQ0FBQztBQUM5QyxPQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQzFDLE9BQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUNwQixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDM0IsVUFBSSxPQUFLLFVBQVUsRUFBRTtBQUNuQixlQUFPO09BQ1I7QUFDRCxVQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7QUFDYixTQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsWUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUU7QUFDbEMsaUJBQUssTUFBTSxFQUFFLENBQUM7U0FDZixNQUFNLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO0FBQ3pDLGlCQUFLLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO09BQ0Y7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUF6TGtCLGFBQWE7O1dBME54QixvQkFBRztBQUNULGFBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxJQUFJLENBQUM7S0FDeEU7OztXQUVXLHdCQUFHO0FBQ2IsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDN0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDaEM7S0FDRjs7O1dBRVUscUJBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTs7O0FBQ25CLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixTQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsWUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQy9DLGNBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBSyxZQUFZLENBQUMsQ0FBQztBQUN0RCxjQUFJLENBQUMsWUFBQTtjQUFDLENBQUMsWUFBQSxDQUFDOzs0Q0FDQSxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBSyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7OztBQUE3RixXQUFDO0FBQUMsV0FBQzs7QUFFSixjQUFJLFFBQVEsR0FBSSxTQUFaLFFBQVEsQ0FBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUN6QyxnQkFBSSxDQUFDLEtBQUssRUFBRTtBQUNWLG9CQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMsa0JBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLG1CQUFLLElBQUksS0FBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkMsb0JBQUksQ0FBQyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUN4QyxvQkFBSSxDQUFDLEVBQUU7QUFDTCx1QkFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEI7ZUFDRjs7QUFFRCxrQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN2QixrQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQzs7QUFFdEIsa0JBQUksSUFBSSxJQUFJLElBQUksRUFBRTtBQUNoQixvQkFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLG9CQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxvQkFBSSxVQUFVLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQzdCLG9CQUFJLElBQUksR0FBRyxLQUFLLENBQUM7QUFDakIscUJBQUssSUFBSSxPQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtBQUNsRCxzQkFBSSxPQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO0FBQ25DLHdCQUFJLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0MsMkJBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUN4RCwyQkFBTSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLDJCQUFNLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztBQUNwQyx3QkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBTSxDQUFDLENBQUM7QUFDOUMsd0JBQUksQ0FBQyxZQUFZLENBQUMsT0FBTSxDQUFDLENBQUM7QUFDMUIsd0JBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQix3QkFBSSxHQUFHLElBQUksQ0FBQztBQUNaLDBCQUFNO21CQUNQO2lCQUNGOztBQUVELG9CQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1Qsc0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUE7QUFDNUQsc0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtpQkFDN0Y7ZUFDRjthQUNGO1dBQ0YsQUFBQyxDQUFDOztBQUVILGNBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDMUQsY0FBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFLLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdEQsY0FBSSxXQUFXLEVBQUU7QUFDZixvQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7V0FDNUQsTUFBTTtBQUNMLGdCQUFJLEdBQUcseUJBQXVCLFNBQVMsTUFBRyxDQUFDO0FBQzNDLGdCQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1dBQ3JCO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7S0FDRjs7O1dBRVUscUJBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRTs7O0FBQzdCLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsc0JBQXNCLEdBQUc7QUFDNUIsaUJBQU8sRUFBUCxPQUFPO0FBQ1Asb0JBQVUsRUFBVixVQUFVO1NBQ1gsQ0FBQTtBQUNELGVBQU07T0FDUDs7QUFFRCxVQUFJLFFBQVEsR0FBSSxTQUFaLFFBQVEsQ0FBSyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUN6QyxZQUFJLENBQUMsS0FBSyxFQUFFOztBQUNWLGtCQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdkMsZ0JBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLGlCQUFLLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbkMsa0JBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUN4QyxrQkFBSSxDQUFDLEVBQUU7QUFDTCxvQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFO0FBQ2pCLHdCQUFNO2lCQUNQOztBQUVELHFCQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2VBQ3BCO2FBQ0Y7O0FBRUQsZ0JBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWhDLGdCQUFJLENBQUMsT0FBSyxXQUFXLEVBQUU7QUFDckI7O2dCQUFPO2FBQ1I7O0FBRUQsZ0JBQUksSUFBSSxHQUFHLE9BQUssV0FBVyxDQUFDLFFBQVEsRUFBRTtBQUNwQzs7Z0JBQU87YUFDUjs7QUFFRCxtQkFBSyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUMvQyxrQkFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFLLFlBQVksQ0FBQyxDQUFDO0FBQ3RELGtCQUFJLE1BQU0sR0FBRyxPQUFLLFFBQVEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRXJDLGtCQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVCLGtCQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztxREFDbkIsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7Ozs7QUFBN0MsZUFBQztBQUFFLGVBQUM7O0FBRUwsZUFBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQzFCLGVBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDOztBQUUzQyxrQkFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7OztBQUc3QixrQkFBSSxDQUFDLEdBQUcsT0FBSyxTQUFTLEVBQUUsR0FBRyxtQkFBbUIsRUFBRTtBQUM5Qyx1QkFBSyxTQUFTLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLENBQUM7ZUFDekMsTUFBTSxJQUFJLENBQUMsR0FBRyxPQUFLLFlBQVksRUFBRSxHQUFHLG1CQUFtQixFQUFFO0FBQ3hELHVCQUFLLFlBQVksQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztlQUM1Qzs7QUFFRCxrQkFBSSxDQUFDLEdBQUcsT0FBSyxVQUFVLEVBQUUsR0FBRyxtQkFBbUIsRUFBRTtBQUMvQyx1QkFBSyxVQUFVLENBQUMsQ0FBQyxHQUFHLG1CQUFtQixDQUFDLENBQUM7ZUFDMUMsTUFBTSxJQUFJLENBQUMsR0FBRyxPQUFLLFdBQVcsRUFBRSxHQUFHLG1CQUFtQixFQUFFO0FBQ3ZELHVCQUFLLFlBQVksQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztlQUM1Qzs7O0FBR0QsZUFBQyxDQUFDLFFBQVEsRUFBRTtBQUNWLHlCQUFPLGVBQWU7QUFDdEIscUJBQUssWUFBVSxDQUFDLGtCQUFhLENBQUMsUUFBSztlQUNwQyxDQUFDLENBQ0QsUUFBUSxDQUFDLE9BQUssU0FBUyxDQUFDLENBQ3hCLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBVztBQUM3QixpQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2VBQ2xCLENBQUMsQ0FBQzthQUNKLENBQUMsQ0FBQzs7OztTQUNKO09BQ0YsQUFBQyxDQUFDOztBQUVILFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDMUQsVUFBSSxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbkQsVUFBSSxXQUFXLEVBQUU7QUFDZixnQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDakYsTUFBTTtBQUNMLFlBQUksR0FBRyx5QkFBdUIsU0FBUyxjQUFTLElBQUksQ0FBQyxRQUFRLE1BQUcsQ0FBQztBQUNqRSxZQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQ3JCO0tBQ0o7OztXQUdPLG9CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNsQixZQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzlDLFlBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDakQ7O0FBRUQsVUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7S0FDN0I7OztXQUVtQixnQ0FBRztBQUNyQixVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3hDLGVBQU87T0FDUjs7QUFFRCxVQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUEsR0FBRSxHQUFHLENBQUE7QUFDekQsVUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQTs7QUFFMUIsVUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFDaEcsS0FBSyxJQUFJLGFBQWEsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBQyxDQUFDLENBQUMsRUFBRTtBQUNqRSxZQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUUsVUFBQyxDQUFDLEVBQUMsQ0FBQztpQkFBSyxDQUFDLEdBQUcsQ0FBQztTQUFBLEVBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztPQUMvSDs7QUFFSCxXQUFLLElBQUksYUFBYSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ2pFLFlBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEdBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEdBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0csY0FBSSxDQUFDLGlCQUFpQixHQUFHLGFBQWEsQ0FBQztTQUN4QztPQUNGOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDO0tBQzdGOzs7V0FFVyx3QkFBRztBQUNiLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixZQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7T0FDbEI7QUFDRCxVQUFJLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxFQUFFO0FBQzNCLFlBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDcEI7QUFDRCxVQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtBQUNoQyxZQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQy9DLGVBQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFBO09BQ3BDO0FBQ0QsVUFBSSxJQUFJLENBQUMsNEJBQTRCLEVBQUU7QUFDckMsWUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0FBQ3pELGVBQU8sSUFBSSxDQUFDLDRCQUE0QixDQUFBO09BQ3pDO0FBQ0QsVUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7QUFDL0IsWUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUM3RixlQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQTtPQUNuQztLQUNGOzs7V0FFUSxxQkFBdUI7OztVQUF0QixZQUFZLHlEQUFHLEtBQUs7O0FBQzVCLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDOztBQUV6QixVQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsZUFBTztPQUNSOztBQUVELFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsVUFBSTtBQUNGLGVBQU8sR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO09BQzFELENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxZQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzNCLGlCQUFPO1NBQ1I7T0FDRjs7QUFFRCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFckIsVUFBSSxvQkFBb0IsR0FBRyxJQUFJLENBQUE7QUFDL0IsY0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQztBQUNyRCxhQUFLLE9BQU87QUFDViw4QkFBb0IsR0FBRyxPQUFPLENBQUE7QUFDOUIsZ0JBQUs7QUFBQSxBQUNQLGFBQUssY0FBYztBQUNqQiw4QkFBb0IsR0FBRyxVQUFVLENBQUE7QUFDakMsZ0JBQUs7QUFBQSxPQUNSOztBQUVELFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFcEIsV0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXLEVBQUs7QUFDL0MsZUFBSyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZDLGVBQUssUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixlQUFLLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLGVBQUssV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUMvQixlQUFLLGVBQWUsR0FBRyxPQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUM7OzhCQUV4QyxhQUFhO0FBQ3BCLGNBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxTQUFPLGdCQUFnQixFQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRixpQkFBSyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGlCQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsY0FBSSxvQkFBb0IsRUFBRTtBQUN4QixhQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLFVBQUMsQ0FBQztxQkFBSyxPQUFLLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO2FBQUEsQ0FBQyxDQUFDO1dBQy9FOzs7QUFOSCxhQUFLLElBQUksYUFBYSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQUssV0FBVyxDQUFDLFFBQVEsR0FBQyxDQUFDLENBQUMsRUFBRTtnQkFBMUQsYUFBYTtTQU9yQjs7QUFFRCxlQUFLLFlBQVksR0FBRyxDQUFDLENBQUM7O0FBRXRCLFlBQUksT0FBSyxnQkFBZ0IsRUFBRTtBQUN6QixpQkFBTyxDQUFDLEdBQUcsQ0FDVCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFLLFdBQVcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsYUFBYTttQkFDMUQsT0FBSyxXQUFXLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLE9BQU87cUJBQ25ELE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSzthQUFBLENBQy9CO1dBQUEsQ0FDRixDQUNGLENBQUMsSUFBSSxDQUFDLFVBQUMsYUFBYSxFQUFLO0FBQ3hCLG1CQUFLLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxNQUFBLENBQVIsSUFBSSxxQkFBUSxhQUFhLEVBQUMsQ0FBQztBQUMvQyxtQkFBSyxTQUFTLEVBQUUsQ0FBQztXQUNsQixDQUFDLENBQUE7U0FDSCxNQUFNO0FBQ0wsaUJBQUssU0FBUyxFQUFFLENBQUM7U0FDbEI7T0FDRixFQUFFLFlBQU07QUFDUCxZQUFJLFlBQVksRUFBRTtBQUNoQixjQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFLLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25FLGNBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxRQUFNLENBQUMsV0FBVyxRQUFNLENBQUM7U0FDcEQsTUFBTTtBQUNMLGlCQUFLLFlBQVksRUFBRSxDQUFDO1NBQ3JCO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVRLHFCQUEyQjs7O1VBQTFCLGlCQUFpQix5REFBRyxJQUFJOztBQUNoQyxVQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDOztBQUU5QixVQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6QixZQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztBQUM1RCxZQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO09BQy9COztBQUVELGFBQU8sQ0FBQyxHQUFHLENBQ1QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsYUFBYSxFQUFLO0FBQy9ELFlBQUksTUFBTSxHQUFHLE9BQUssUUFBUSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFOUMsZUFBTyxPQUFLLFdBQVcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQy9ELGNBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBSyxZQUFZLENBQUMsQ0FBQztBQUN0RCxjQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV0QyxjQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7QUFDMUMsZ0JBQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDO0FBQzFELGdCQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsQ0FBQzs7QUFFeEQsaUJBQU8sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO0FBQzlCLGlCQUFPLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUM5QixpQkFBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDeEMsaUJBQU8sQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEUsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN2RCxnQkFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUV6RCxpQkFBSyxXQUFXLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsRSxpQkFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztTQUNyRSxDQUFDLENBQUM7T0FDSixDQUFDLENBQ0gsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXLEVBQUs7QUFDdEIsWUFBSSxpQkFBaUIsRUFBRTtBQUNyQixpQkFBSyxTQUFTLENBQUMsT0FBSyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzNDLGlCQUFLLFVBQVUsQ0FBQyxPQUFLLHNCQUFzQixDQUFDLENBQUM7QUFDN0MsaUJBQUssb0JBQW9CLEVBQUUsQ0FBQztTQUM3QjtBQUNELGVBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDO2lCQUFNLE9BQUssWUFBWSxFQUFFO1NBQUEsQ0FBQyxDQUFDO09BQzFELEVBQUU7ZUFBTSxPQUFLLFlBQVksRUFBRTtPQUFBLENBQUMsQ0FBQztLQUMvQjs7O1dBRStCLDRDQUFFOzs7QUFDaEMsYUFBTyxDQUFDLEdBQUcsQ0FDVCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxhQUFhO2VBQzFELE9BQUssV0FBVyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFPO2lCQUNuRCxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUs7U0FBQSxDQUMvQjtPQUFBLENBQ0YsQ0FDRixDQUFDLElBQUksQ0FBQyxVQUFDLGFBQWEsRUFBSztBQUN4QixlQUFLLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxNQUFBLENBQVIsSUFBSSxxQkFBUSxhQUFhLEVBQUMsQ0FBQztBQUMvQyxlQUFLLE9BQU8sRUFBRSxDQUFDO09BQ2hCLENBQUMsQ0FBQTtLQUNIOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEVBQUU7QUFDMUIsWUFBSSxDQUFDLGdDQUFnQyxFQUFFLENBQUM7QUFDeEMsZUFBTztPQUNSO0FBQ0QsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0FBQ3ZELGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksR0FBSSxJQUFJLENBQUMsYUFBYSxDQUFBLEFBQUMsQ0FBQyxDQUFDO0tBQzlFOzs7V0FFTSxtQkFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUEsQUFBQyxDQUFDLENBQUM7S0FDeEQ7OztXQUVLLGtCQUFHO0FBQ1AsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUEsR0FBSSxHQUFHLENBQUMsQ0FBQztLQUN4RDs7O1dBRVEscUJBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDL0Q7OztXQUVXLHdCQUFHO0FBQ2IsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUN0RDs7O1dBRWUsNEJBQUc7QUFDakIsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUN0RDs7O1dBRXFCLGdDQUFDLFlBQVksRUFBRSxjQUFjLEVBQUU7QUFDbkQsVUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFVBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNyQixVQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7O0FBRXJCLFdBQUssSUFBSSxhQUFhLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvRCxZQUFJLFlBQVksR0FBRyxZQUFZLEdBQUcsY0FBYyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFlBQVksRUFBRTtBQUM5RSwyQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNwRixjQUFJLDBCQUEwQixHQUFHLFlBQVksSUFBSSxZQUFZLEdBQUcsWUFBWSxDQUFBLEFBQUMsQ0FBQztBQUM5RSxzQkFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQUMzRSxzQkFBWSxJQUFJLDBCQUEwQixDQUFDO0FBQzNDLGdCQUFNO1NBQ1AsTUFBTTtBQUNMLHNCQUFZLElBQUksY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzlDLHNCQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNqRDs7QUFFRCxZQUFJLFlBQVksR0FBRyxZQUFZLEdBQUcsRUFBRSxHQUFHLFlBQVksRUFBRTtBQUNuRCxjQUFJLDZCQUE2QixHQUFHLFlBQVksSUFBSSxZQUFZLEdBQUcsWUFBWSxDQUFBLEFBQUMsQ0FBQztBQUNqRixzQkFBWSxJQUFJLDZCQUE2QixDQUFDO0FBQzlDLGdCQUFNO1NBQ1AsTUFBTTtBQUNMLHNCQUFZLElBQUksRUFBRSxDQUFDO1NBQ3BCO09BQ0Y7O0FBRUQsYUFBTyxZQUFZLEdBQUcsWUFBWSxDQUFDO0tBQ3BDOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7OztBQUNqQixVQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNyQixlQUFPO09BQ1I7O0FBRUQsWUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDOztBQUVyQyxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDNUIsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixVQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDcEMsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0QixhQUFPLENBQUMsUUFBUSxDQUFDLFlBQU07QUFDckIsWUFBSSxZQUFZLEdBQUcsT0FBSyxzQkFBc0IsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDN0UsZUFBSyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDOUIsQ0FBQyxDQUFDOztBQUVILGFBQU8sQ0FBQyxRQUFRLENBQUMsWUFBTTtBQUNyQixZQUFJLGFBQWEsR0FBRyxPQUFLLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQztBQUMvQyxlQUFLLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztPQUNoQyxDQUFDLENBQUM7S0FDSjs7O1dBRW1CLGdDQUFHO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0tBQy9COzs7V0FFaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0tBQzdCOzs7V0FFVyxzQkFBQyxhQUFhLEVBQUU7QUFDMUIsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyx1QkFBdUIsR0FBRyxhQUFhLENBQUE7QUFDNUMsZUFBTTtPQUNQOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtBQUM3QyxlQUFPO09BQ1I7O0FBRUQsbUJBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25FLHdCQUFrQixHQUFHLEFBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFHLGFBQWEsR0FBQyxDQUFDLENBQUUsQ0FBQyxNQUFNLENBQUUsVUFBQyxDQUFDLEVBQUMsQ0FBQztlQUFLLENBQUMsR0FBQyxDQUFDO09BQUEsRUFBRyxDQUFDLENBQUMsR0FBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUEsR0FBSSxFQUFFLENBQUE7O0FBRXhILGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQzNDOzs7V0FFZ0IsMkJBQUMsU0FBUyxFQUFFOzs7QUFDM0IsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyw0QkFBNEIsR0FBRyxTQUFTLENBQUE7QUFDN0MsZUFBTTtPQUNQOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3JCLGVBQU07T0FDUDs7QUFFRCxVQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FDdkMsSUFBSSxDQUFDLFVBQUEsT0FBTztlQUFJLE9BQUssV0FBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQzFELElBQUksQ0FBQyxVQUFBLFVBQVU7ZUFBSSxPQUFLLFlBQVksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO09BQUEsQ0FBQyxTQUNoRCxDQUFDO2VBQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLG9DQUFrQyxTQUFTLE9BQUk7T0FBQSxDQUFDLENBQUE7S0FDM0Y7OztXQUVRLHFCQUFHO0FBQ1YsYUFBTztBQUNMLGdCQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDdkIsYUFBSyxFQUFFLElBQUksQ0FBQyxZQUFZO0FBQ3hCLGlCQUFTLEVBQUUsSUFBSSxDQUFDLHFCQUFxQjtBQUNyQyxrQkFBVSxFQUFFLElBQUksQ0FBQyxzQkFBc0I7QUFDdkMsb0JBQVksRUFBRSx1QkFBdUI7T0FDdEMsQ0FBQztLQUNIOzs7V0FFTyxvQkFBRztBQUNULFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixlQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ3JDLE1BQU07QUFDTCxlQUFPLFVBQVUsQ0FBQztPQUNuQjtLQUNGOzs7V0FFSyxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUN0Qjs7O1dBRU0sbUJBQUc7QUFDUixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSTtBQUNGLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDNUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDbEI7QUFDRCxhQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUN0Qjs7O1dBRWUsNEJBQUc7QUFDakIsYUFBTyxJQUFJLFVBQVUsQ0FBQztlQUFNLElBQUk7T0FBQSxDQUFDLENBQUM7S0FDbkM7OztXQUVrQiwrQkFBRztBQUNwQixhQUFPLElBQUksVUFBVSxDQUFDO2VBQU0sSUFBSTtPQUFBLENBQUMsQ0FBQztLQUNuQzs7O1NBbGlCYSxlQUFHO0FBQ2YsYUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3JDO1NBRWEsYUFBQyxPQUFPLEVBQUU7QUFDdEIsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNqQyxlQUFPO09BQ1I7QUFDRCxVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO3dCQUNPLE9BQU8sQ0FBQyxNQUFNLENBQUM7O1lBQXpDLFVBQVUsYUFBVixVQUFVO1lBQUUsVUFBVSxhQUFWLFVBQVU7O0FBQzdCLFlBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxFQUFDLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7T0FDbEU7QUFDRCxVQUFJLE9BQU8sRUFBRTtBQUNYLFlBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDN0IsYUFBSyxJQUFNLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMvQyxtQkFBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMxQixjQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUMvQjtBQUNELGlCQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUN0RCxNQUNJO0FBQ0gsWUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNoQyxpQkFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckQsZUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRTtBQUNsQyxtQkFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDckQ7T0FDRjtLQUNGOzs7U0F4TmtCLGFBQWE7R0FBUyxVQUFVOztxQkFBaEMsYUFBYSIsImZpbGUiOiIvaG9tZS9haDI1Nzk2Mi8uYXRvbS9wYWNrYWdlcy9wZGYtdmlldy9saWIvcGRmLWVkaXRvci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxubGV0IHskLCBTY3JvbGxWaWV3fSA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJyk7XG5sZXQge1BvaW50fSA9IHJlcXVpcmUoJ2F0b20nKTtcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xubGV0IF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlLXBsdXMnKTtcbmxldCB7RmlsZSwgRGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5sZXQge0Z1bmN0aW9ufSA9IHJlcXVpcmUoJ2xvb3Bob2xlJyk7XG5nbG9iYWwuRnVuY3Rpb24gPSBGdW5jdGlvbjtcblxuZ2xvYmFsLlBERkpTID0ge3dvcmtlclNyYzogXCJ0ZW1wXCIsIGNNYXBVcmw6XCJ0ZW1wXCIsIGNNYXBQYWNrZWQ6dHJ1ZX07XG5yZXF1aXJlKCcuLy4uL25vZGVfbW9kdWxlcy9wZGZqcy1kaXN0L2J1aWxkL3BkZi5qcycpO1xuUERGSlMud29ya2VyU3JjID0gXCJmaWxlOi8vXCIgKyBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL25vZGVfbW9kdWxlcy9wZGZqcy1kaXN0L2J1aWxkL3BkZi53b3JrZXIuanNcIik7XG5QREZKUy5jTWFwVXJsID0gXCJmaWxlOi8vXCIgKyBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL25vZGVfbW9kdWxlcy9wZGZqcy1kaXN0L2NtYXBzXCIpK1wiL1wiO1xubGV0IHtleGVjLCBleGVjRmlsZX0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBkZkVkaXRvclZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3IHtcbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoe2NsYXNzOiAncGRmLXZpZXcnLCB0YWJpbmRleDogLTF9LCAoKSA9PiB7XG4gICAgICB0aGlzLmRpdih7b3V0bGV0OiAnY29udGFpbmVyJywgc3R5bGU6ICdwb3NpdGlvbjogcmVsYXRpdmUnfSk7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihmaWxlUGF0aCwgc2NhbGUgPSBudWxsLCBzY3JvbGxUb3AgPSAwLCBzY3JvbGxMZWZ0ID0gMCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IHNjYWxlID8gc2NhbGUgOiAxLjU7XG4gICAgdGhpcy5kZWZhdWx0U2NhbGUgPSAxLjU7XG4gICAgdGhpcy5zY2FsZUZhY3RvciA9IDEwLjA7XG4gICAgdGhpcy5maXRUb1dpZHRoT25PcGVuID0gIXNjYWxlICYmIGF0b20uY29uZmlnLmdldCgncGRmLXZpZXcuZml0VG9XaWR0aE9uT3BlbicpO1xuXG4gICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xuICAgIHRoaXMuZmlsZSA9IG5ldyBGaWxlKHRoaXMuZmlsZVBhdGgpO1xuICAgIHRoaXMuc2Nyb2xsVG9wQmVmb3JlVXBkYXRlID0gc2Nyb2xsVG9wO1xuICAgIHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSA9IHNjcm9sbExlZnQ7XG4gICAgdGhpcy5jYW52YXNlcyA9IFtdO1xuICAgIHRoaXMudXBkYXRpbmcgPSBmYWxzZTtcblxuICAgIHRoaXMudXBkYXRlUGRmKHRydWUpO1xuXG4gICAgdGhpcy5wZGZWaWV3RWxlbWVudHMgPSBbXTtcbiAgICB0aGlzLmJpbmFyeVZpZXdFZGl0b3IgPSBudWxsO1xuXG4gICAgdGhpcy5jdXJyZW50UGFnZU51bWJlciA9IDA7XG4gICAgdGhpcy50b3RhbFBhZ2VOdW1iZXIgPSAwO1xuICAgIHRoaXMuY2VudGVyc0JldHdlZW5QYWdlcyA9IFtdO1xuICAgIHRoaXMucGFnZUhlaWdodHMgPSBbXTtcbiAgICB0aGlzLm1heFBhZ2VXaWR0aCA9IDA7XG4gICAgdGhpcy50b1NjYWxlRmFjdG9yID0gMS4wO1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuXG4gICAgbGV0IGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIGxldCBuZWVkc1VwZGF0ZUNhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgICAgdGhpcy5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZVBkZigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB0b2dnbGVOaWdodE1vZGVDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgIHRoaXMuc2V0TmlnaHRNb2RlKCk7XG4gICAgfVxuXG4gICAgZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdwZGYtdmlldy5uaWdodE1vZGUnLCB0b2dnbGVOaWdodE1vZGVDYWxsYmFjaykpO1xuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncGRmLXZpZXcucmV2ZXJzZVN5bmNCZWhhdmlvdXInLCBuZWVkc1VwZGF0ZUNhbGxiYWNrKSk7XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQodGhpcy5maWxlLm9uRGlkQ2hhbmdlKCgpID0+IHtcbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LmF1dG9SZWxvYWRPblVwZGF0ZScpKSB7XG4gICAgICAgIG5lZWRzVXBkYXRlQ2FsbGJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmlsZVVwZGF0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIGxldCBhdXRvUmVsb2FkRGlzcG9zYWJsZTtcbiAgICBsZXQgc2V0dXBBdXRvUmVsb2FkID0gKCkgPT4ge1xuICAgICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LmF1dG9SZWxvYWRPblVwZGF0ZScpKSB7XG4gICAgICAgIGF1dG9SZWxvYWREaXNwb3NhYmxlID0gYXRvbS53b3Jrc3BhY2Uub25EaWRPcGVuKChlKSA9PiB7XG4gICAgICAgICAgaWYgKGUuaXRlbSA9PSB0aGlzICYmIHRoaXMuZmlsZVVwZGF0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZVVwZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIG5lZWRzVXBkYXRlQ2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoYXV0b1JlbG9hZERpc3Bvc2FibGUpIHtcbiAgICAgICAgICBkaXNwb3NhYmxlcy5yZW1vdmUoYXV0b1JlbG9hZERpc3Bvc2FibGUpO1xuICAgICAgICAgIGF1dG9SZWxvYWREaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZpbGVVcGRhdGVkKSB7XG4gICAgICAgICAgdGhpcy5maWxlVXBkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgIG5lZWRzVXBkYXRlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgncGRmLXZpZXcuYXV0b1JlbG9hZE9uVXBkYXRlJywgc2V0dXBBdXRvUmVsb2FkKSk7XG5cbiAgICBsZXQgbW92ZUxlZnRDYWxsYmFjayA9ICgoKSA9PiB0aGlzLnNjcm9sbExlZnQodGhpcy5zY3JvbGxMZWZ0KCkgLSAkKHdpbmRvdykud2lkdGgoKSAvIDIwKSk7XG4gICAgbGV0IG1vdmVSaWdodENhbGxiYWNrID0gKCgpID0+IHRoaXMuc2Nyb2xsUmlnaHQodGhpcy5zY3JvbGxSaWdodCgpICsgJCh3aW5kb3cpLndpZHRoKCkgLyAyMCkpO1xuICAgIGxldCBzY3JvbGxDYWxsYmFjayA9ICgoKSA9PiB0aGlzLm9uU2Nyb2xsKCkpO1xuICAgIGxldCByZXNpemVIYW5kbGVyID0gKCgpID0+IHRoaXMuc2V0Q3VycmVudFBhZ2VOdW1iZXIoKSk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnLnBkZi12aWV3Jywge1xuICAgICAgJ2NvcmU6bW92ZS1sZWZ0JzogbW92ZUxlZnRDYWxsYmFjayxcbiAgICAgICdjb3JlOm1vdmUtcmlnaHQnOiBtb3ZlUmlnaHRDYWxsYmFja1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbignc2Nyb2xsJywgc2Nyb2xsQ2FsbGJhY2spO1xuICAgICQod2luZG93KS5vbigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG5cbiAgICBkaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgJCh3aW5kb3cpLm9mZignc2Nyb2xsJywgc2Nyb2xsQ2FsbGJhY2spO1xuICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplJywgcmVzaXplSGFuZGxlcik7XG4gICAgfSkpO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ3BkZi12aWV3Onpvb20tZml0JzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgICAgdGhpcy56b29tRml0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6em9vbS1pbic6ICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRm9jdXMoKSkge1xuICAgICAgICAgIHRoaXMuem9vbUluKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAncGRmLXZpZXc6em9vbS1vdXQnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgICB0aGlzLnpvb21PdXQoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpyZXNldC16b29tJzogKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICAgICAgdGhpcy5yZXNldFpvb20oKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpnby10by1uZXh0LXBhZ2UnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgICB0aGlzLmdvVG9OZXh0UGFnZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ3BkZi12aWV3OmdvLXRvLXByZXZpb3VzLXBhZ2UnOiAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgICB0aGlzLmdvVG9QcmV2aW91c1BhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdwZGYtdmlldzpyZWxvYWQnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUGRmKHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5iaW5hcnlWaWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuc2ltcGxlQ2xpY2sgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnNjcm9sbFRvcCh0aGlzLmRyYWdnaW5nLnNjcm9sbFRvcCAtIChlLnNjcmVlblkgLSB0aGlzLmRyYWdnaW5nLnkpKTtcbiAgICAgICAgdGhpcy5zY3JvbGxMZWZ0KHRoaXMuZHJhZ2dpbmcuc2Nyb2xsTGVmdCAtIChlLnNjcmVlblggLSB0aGlzLmRyYWdnaW5nLngpKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm9uTW91c2VVcCA9IChlKSA9PiB7XG4gICAgICBpZiAodGhpcy5iaW5hcnlWaWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBudWxsO1xuICAgICAgJChkb2N1bWVudCkudW5iaW5kKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAgICQoZG9jdW1lbnQpLnVuYmluZCgnbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgIGlmICh0aGlzLmJpbmFyeVZpZXcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5zaW1wbGVDbGljayA9IHRydWU7XG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbSh0aGlzKS5hY3RpdmF0ZSgpO1xuICAgICAgdGhpcy5kcmFnZ2luZyA9IHt4OiBlLnNjcmVlblgsIHk6IGUuc2NyZWVuWSwgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcCgpLCBzY3JvbGxMZWZ0OiB0aGlzLnNjcm9sbExlZnQoKX07XG4gICAgICAkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgICAkKGRvY3VtZW50KS5vbignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ21vdXNld2hlZWwnLCAoZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuYmluYXJ5Vmlldykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoZS5jdHJsS2V5KSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCkge1xuICAgICAgICAgIHRoaXMuem9vbUluKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgPCAwKSB7XG4gICAgICAgICAgdGhpcy56b29tT3V0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBiaW5hcnlWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLmhhc0NsYXNzKCdiaW5hcnktdmlldycpO1xuICB9XG5cbiAgc2V0IGJpbmFyeVZpZXcoZW5hYmxlZCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyWzBdO1xuICAgIGlmICghIWVuYWJsZWQgPT09IHRoaXMuYmluYXJ5Vmlldykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuYmluYXJ5Vmlld0VkaXRvcikge1xuICAgICAgY29uc3Qge1RleHRCdWZmZXIsIFRleHRFZGl0b3J9ID0gcmVxdWlyZSgnYXRvbScpO1xuICAgICAgY29uc3QgYnVmZmVyID0gVGV4dEJ1ZmZlci5sb2FkU3luYyh0aGlzLmZpbGVQYXRoKTtcbiAgICAgIHRoaXMuYmluYXJ5Vmlld0VkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHtidWZmZXIsIHJlYWRPbmx5OiB0cnVlfSk7XG4gICAgfVxuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICB0aGlzLmFkZENsYXNzKCdiaW5hcnktdmlldycpO1xuICAgICAgZm9yIChjb25zdCBlbCBvZiBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgdGhpcy5wZGZWaWV3RWxlbWVudHMucHVzaChlbCk7XG4gICAgICB9XG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5iaW5hcnlWaWV3RWRpdG9yLmVsZW1lbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2JpbmFyeS12aWV3Jyk7XG4gICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5iaW5hcnlWaWV3RWRpdG9yLmVsZW1lbnQpO1xuICAgICAgd2hpbGUgKHRoaXMucGRmVmlld0VsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5wZGZWaWV3RWxlbWVudHMuc2hpZnQoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuICF0aGlzLmJpbmFyeVZpZXcgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSA9PT0gdGhpcztcbiAgfVxuXG4gIHNldE5pZ2h0TW9kZSgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5uaWdodE1vZGUnKSkge1xuICAgICAgdGhpcy5hZGRDbGFzcygnbmlnaHQtbW9kZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUNsYXNzKCduaWdodC1tb2RlJyk7XG4gICAgfVxuICB9XG5cbiAgcmV2ZXJzZVN5bmMocGFnZSwgZSkge1xuICAgIGlmICh0aGlzLnNpbXBsZUNsaWNrKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZSkudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICBsZXQgdmlld3BvcnQgPSBwZGZQYWdlLmdldFZpZXdwb3J0KHRoaXMuY3VycmVudFNjYWxlKTtcbiAgICAgICAgbGV0IHgseTtcbiAgICAgICAgW3gseV0gPSB2aWV3cG9ydC5jb252ZXJ0VG9QZGZQb2ludChlLm9mZnNldFgsICQodGhpcy5jYW52YXNlc1twYWdlIC0gMV0pLmhlaWdodCgpIC0gZS5vZmZzZXRZKTtcblxuICAgICAgICBsZXQgY2FsbGJhY2sgPSAoKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIHN0ZG91dCA9IHN0ZG91dC5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgICAgICAgbGV0IGF0dHJzID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCBsaW5lIG9mIHN0ZG91dC5zcGxpdCgnXFxuJykpIHtcbiAgICAgICAgICAgICAgbGV0IG0gPSBsaW5lLm1hdGNoKC9eKFthLXpBLVpdKik6KC4qKSQvKVxuICAgICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW21bMV1dID0gbVsyXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZmlsZSA9IGF0dHJzLklucHV0O1xuICAgICAgICAgICAgbGV0IGxpbmUgPSBhdHRycy5MaW5lO1xuXG4gICAgICAgICAgICBpZiAoZmlsZSAmJiBsaW5lKSB7XG4gICAgICAgICAgICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgICAgICAgICAgICBsZXQgcGF0aFRvT3BlbiA9IHBhdGgubm9ybWFsaXplKGF0dHJzLklucHV0KTtcbiAgICAgICAgICAgICAgbGV0IGxpbmVUb09wZW4gPSArYXR0cnMuTGluZTtcbiAgICAgICAgICAgICAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgZWRpdG9yIG9mIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yLmdldFBhdGgoKSA9PT0gcGF0aFRvT3Blbikge1xuICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IFBvaW50KGxpbmVUb09wZW4tMSwgLTEpO1xuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24ocG9zaXRpb24sIHtjZW50ZXI6IHRydWV9KTtcbiAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICBlZGl0b3IubW92ZVRvRmlyc3RDaGFyYWN0ZXJPZkxpbmUoKTtcbiAgICAgICAgICAgICAgICAgIGxldCBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oZWRpdG9yKTtcbiAgICAgICAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcik7XG4gICAgICAgICAgICAgICAgICBwYW5lLmFjdGl2YXRlKCk7XG4gICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgIGxldCBwYW5lb3B0ID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5wYW5lVG9Vc2VJblN5bmN0ZXgnKVxuICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aFRvT3Blbiwge2luaXRpYWxMaW5lOiBsaW5lVG9PcGVuLCBpbml0aWFsQ29sdW1uOiAwLCBzcGxpdDogcGFuZW9wdH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBzeW5jdGV4UGF0aCA9IGF0b20uY29uZmlnLmdldCgncGRmLXZpZXcuc3luY1RlWFBhdGgnKTtcbiAgICAgICAgbGV0IGNsaWNrc3BlYyA9IFtwYWdlLCB4LCB5LCB0aGlzLmZpbGVQYXRoXS5qb2luKCc6Jyk7XG5cbiAgICAgICAgaWYgKHN5bmN0ZXhQYXRoKSB7XG4gICAgICAgICAgZXhlY0ZpbGUoc3luY3RleFBhdGgsIFtcImVkaXRcIiwgXCItb1wiLCBjbGlja3NwZWNdLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IGNtZCA9IGBzeW5jdGV4IGVkaXQgLW8gXCIke2NsaWNrc3BlY31cImA7XG4gICAgICAgICAgZXhlYyhjbWQsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZm9yd2FyZFN5bmModGV4UGF0aCwgbGluZU51bWJlcikge1xuICAgICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgICAgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlID0ge1xuICAgICAgICAgIHRleFBhdGgsXG4gICAgICAgICAgbGluZU51bWJlclxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgY2FsbGJhY2sgPSAoKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgc3Rkb3V0ID0gc3Rkb3V0LnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICAgICAgbGV0IGF0dHJzID0ge307XG4gICAgICAgICAgZm9yIChsZXQgbGluZSBvZiBzdGRvdXQuc3BsaXQoJ1xcbicpKSB7XG4gICAgICAgICAgICBsZXQgbSA9IGxpbmUubWF0Y2goL14oW2EtekEtWl0qKTooLiopJC8pXG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICBpZiAobVsxXSBpbiBhdHRycykge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgYXR0cnNbbVsxXV0gPSBtWzJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGxldCBwYWdlID0gcGFyc2VJbnQoYXR0cnMuUGFnZSk7XG5cbiAgICAgICAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGFnZSA+IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGFnZSkudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICAgICAgbGV0IHZpZXdwb3J0ID0gcGRmUGFnZS5nZXRWaWV3cG9ydCh0aGlzLmN1cnJlbnRTY2FsZSk7XG4gICAgICAgICAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXNlc1twYWdlIC0gMV07XG5cbiAgICAgICAgICAgIGxldCB4ID0gcGFyc2VGbG9hdChhdHRycy54KTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VGbG9hdChhdHRycy55KTtcbiAgICAgICAgICAgIFt4LCB5XSA9IHZpZXdwb3J0LmNvbnZlcnRUb1ZpZXdwb3J0UG9pbnQoeCwgeSk7XG5cbiAgICAgICAgICAgIHggPSB4ICsgY2FudmFzLm9mZnNldExlZnQ7XG4gICAgICAgICAgICB5ID0gdmlld3BvcnQuaGVpZ2h0IC0geSArIGNhbnZhcy5vZmZzZXRUb3A7XG5cbiAgICAgICAgICAgIGxldCB2aXNpYmlsaXR5VGhyZXNob2xkID0gNTA7XG5cbiAgICAgICAgICAgIC8vIFNjcm9sbFxuICAgICAgICAgICAgaWYgKHkgPCB0aGlzLnNjcm9sbFRvcCgpICsgdmlzaWJpbGl0eVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvcCh5IC0gdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHkgPiB0aGlzLnNjcm9sbEJvdHRvbSgpIC0gdmlzaWJpbGl0eVRocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLnNjcm9sbEJvdHRvbSh5ICsgdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4IDwgdGhpcy5zY3JvbGxMZWZ0KCkgKyB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsTGVmdCh4IC0gdmlzaWJpbGl0eVRocmVzaG9sZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHggPiB0aGlzLnNjcm9sbFJpZ2h0KCkgLSB2aXNpYmlsaXR5VGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2Nyb2xsQm90dG9tKHggKyB2aXNpYmlsaXR5VGhyZXNob2xkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2hvdyBoaWdobGlnaHRlclxuICAgICAgICAgICAgJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICBjbGFzczogXCJ0ZXgtaGlnaGxpZ2h0XCIsXG4gICAgICAgICAgICAgIHN0eWxlOiBgdG9wOiAke3l9cHg7IGxlZnQ6ICR7eH1weDtgXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuY29udGFpbmVyKVxuICAgICAgICAgICAgLm9uKCdhbmltYXRpb25lbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbGV0IHN5bmN0ZXhQYXRoID0gYXRvbS5jb25maWcuZ2V0KCdwZGYtdmlldy5zeW5jVGVYUGF0aCcpO1xuICAgICAgbGV0IGlucHV0c3BlYyA9IFtsaW5lTnVtYmVyLCAwLCB0ZXhQYXRoXS5qb2luKCc6Jyk7XG5cbiAgICAgIGlmIChzeW5jdGV4UGF0aCkge1xuICAgICAgICBleGVjRmlsZShzeW5jdGV4UGF0aCwgW1widmlld1wiLCBcIi1pXCIsIGlucHV0c3BlYywgXCItb1wiLCB0aGlzLmZpbGVQYXRoXSwgY2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNtZCA9IGBzeW5jdGV4IHZpZXcgLWkgXCIke2lucHV0c3BlY31cIiAtbyBcIiR7dGhpcy5maWxlUGF0aH1cImA7XG4gICAgICAgIGV4ZWMoY21kLCBjYWxsYmFjayk7XG4gICAgICB9XG4gIH1cblxuXG4gIG9uU2Nyb2xsKCkge1xuICAgIGlmICh0aGlzLmJpbmFyeVZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudXBkYXRpbmcpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9wQmVmb3JlVXBkYXRlID0gdGhpcy5zY3JvbGxUb3AoKTtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSA9IHRoaXMuc2Nyb2xsTGVmdCgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0Q3VycmVudFBhZ2VOdW1iZXIoKTtcbiAgfVxuXG4gIHNldEN1cnJlbnRQYWdlTnVtYmVyKCkge1xuICAgIGlmICghdGhpcy5wZGZEb2N1bWVudCB8fCB0aGlzLmJpbmFyeVZpZXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2VudGVyID0gKHRoaXMuc2Nyb2xsQm90dG9tKCkgKyB0aGlzLnNjcm9sbFRvcCgpKS8yLjBcbiAgICB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyID0gMVxuXG4gICAgaWYgKHRoaXMuY2VudGVyc0JldHdlZW5QYWdlcy5sZW5ndGggPT09IDAgJiYgdGhpcy5wYWdlSGVpZ2h0cy5sZW5ndGggPT09IHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpXG4gICAgICBmb3IgKGxldCBwZGZQYWdlTnVtYmVyIG9mIF8ucmFuZ2UoMSwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcysxKSkge1xuICAgICAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMucHVzaCh0aGlzLnBhZ2VIZWlnaHRzLnNsaWNlKDAsIHBkZlBhZ2VOdW1iZXIpLnJlZHVjZSgoKHgseSkgPT4geCArIHkpLCAwKSArIHBkZlBhZ2VOdW1iZXIgKiAyMCAtIDEwKTtcbiAgICAgIH1cblxuICAgIGZvciAobGV0IHBkZlBhZ2VOdW1iZXIgb2YgXy5yYW5nZSgyLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzKzEpKSB7XG4gICAgICBpZiAoY2VudGVyID49IHRoaXMuY2VudGVyc0JldHdlZW5QYWdlc1twZGZQYWdlTnVtYmVyLTJdICYmIGNlbnRlciA8IHRoaXMuY2VudGVyc0JldHdlZW5QYWdlc1twZGZQYWdlTnVtYmVyLTFdKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgPSBwZGZQYWdlTnVtYmVyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3BkZi12aWV3OmN1cnJlbnQtcGFnZS11cGRhdGUnKSk7XG4gIH1cblxuICBmaW5pc2hVcGRhdGUoKSB7XG4gICAgdGhpcy51cGRhdGluZyA9IGZhbHNlO1xuICAgIGlmICh0aGlzLm5lZWRzVXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBkZigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50b1NjYWxlRmFjdG9yICE9IDEpIHtcbiAgICAgIHRoaXMuYWRqdXN0U2l6ZSgxKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUpXG4gICAgICBkZWxldGUgdGhpcy5zY3JvbGxUb1BhZ2VBZnRlclVwZGF0ZVxuICAgIH1cbiAgICBpZiAodGhpcy5zY3JvbGxUb05hbWVkRGVzdEFmdGVyVXBkYXRlKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvTmFtZWREZXN0KHRoaXMuc2Nyb2xsVG9OYW1lZERlc3RBZnRlclVwZGF0ZSlcbiAgICAgIGRlbGV0ZSB0aGlzLnNjcm9sbFRvTmFtZWREZXN0QWZ0ZXJVcGRhdGVcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9yd2FyZFN5bmNBZnRlclVwZGF0ZSkge1xuICAgICAgdGhpcy5mb3J3YXJkU3luYyh0aGlzLmZvcndhcmRTeW5jQWZ0ZXJVcGRhdGUudGV4UGF0aCwgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlLmxpbmVOdW1iZXIpXG4gICAgICBkZWxldGUgdGhpcy5mb3J3YXJkU3luY0FmdGVyVXBkYXRlXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUGRmKGNsb3NlT25FcnJvciA9IGZhbHNlKSB7XG4gICAgdGhpcy5uZWVkc1VwZGF0ZSA9IGZhbHNlO1xuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHRoaXMuZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHBkZkRhdGEgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHBkZkRhdGEgPSBuZXcgVWludDhBcnJheShmcy5yZWFkRmlsZVN5bmModGhpcy5maWxlUGF0aCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuXG4gICAgbGV0IHJldmVyc2VTeW5jQ2xpY2t0eXBlID0gbnVsbFxuICAgIHN3aXRjaChhdG9tLmNvbmZpZy5nZXQoJ3BkZi12aWV3LnJldmVyc2VTeW5jQmVoYXZpb3VyJykpIHtcbiAgICAgIGNhc2UgJ0NsaWNrJzpcbiAgICAgICAgcmV2ZXJzZVN5bmNDbGlja3R5cGUgPSAnY2xpY2snXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdEb3VibGUgY2xpY2snOlxuICAgICAgICByZXZlcnNlU3luY0NsaWNrdHlwZSA9ICdkYmxjbGljaydcbiAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICB0aGlzLnNldE5pZ2h0TW9kZSgpO1xuXG4gICAgUERGSlMuZ2V0RG9jdW1lbnQocGRmRGF0YSkudGhlbigocGRmRG9jdW1lbnQpID0+IHtcbiAgICAgIHRoaXMuY29udGFpbmVyLmZpbmQoXCJjYW52YXNcIikucmVtb3ZlKCk7XG4gICAgICB0aGlzLmNhbnZhc2VzID0gW107XG4gICAgICB0aGlzLnBhZ2VIZWlnaHRzID0gW107XG5cbiAgICAgIHRoaXMucGRmRG9jdW1lbnQgPSBwZGZEb2N1bWVudDtcbiAgICAgIHRoaXMudG90YWxQYWdlTnVtYmVyID0gdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcztcblxuICAgICAgZm9yIChsZXQgcGRmUGFnZU51bWJlciBvZiBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMrMSkpIHtcbiAgICAgICAgbGV0IGNhbnZhcyA9ICQoXCI8Y2FudmFzLz5cIiwge2NsYXNzOiBcInBhZ2UtY29udGFpbmVyXCJ9KS5hcHBlbmRUbyh0aGlzLmNvbnRhaW5lcilbMF07XG4gICAgICAgIHRoaXMuY2FudmFzZXMucHVzaChjYW52YXMpO1xuICAgICAgICB0aGlzLnBhZ2VIZWlnaHRzLnB1c2goMCk7XG4gICAgICAgIGlmIChyZXZlcnNlU3luY0NsaWNrdHlwZSkge1xuICAgICAgICAgICQoY2FudmFzKS5vbihyZXZlcnNlU3luY0NsaWNrdHlwZSwgKGUpID0+IHRoaXMucmV2ZXJzZVN5bmMocGRmUGFnZU51bWJlciwgZSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWF4UGFnZVdpZHRoID0gMDtcblxuICAgICAgaWYgKHRoaXMuZml0VG9XaWR0aE9uT3Blbikge1xuICAgICAgICBQcm9taXNlLmFsbChcbiAgICAgICAgICBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMgKyAxKS5tYXAoKHBkZlBhZ2VOdW1iZXIpID0+XG4gICAgICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT5cbiAgICAgICAgICAgICAgcGRmUGFnZS5nZXRWaWV3cG9ydCgxLjApLndpZHRoXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApLnRoZW4oKHBkZlBhZ2VXaWR0aHMpID0+IHtcbiAgICAgICAgICB0aGlzLm1heFBhZ2VXaWR0aCA9IE1hdGgubWF4KC4uLnBkZlBhZ2VXaWR0aHMpO1xuICAgICAgICAgIHRoaXMucmVuZGVyUGRmKCk7XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlclBkZigpO1xuICAgICAgfVxuICAgIH0sICgpID0+IHtcbiAgICAgIGlmIChjbG9zZU9uRXJyb3IpIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMuZmlsZVBhdGggKyBcIiBpcyBub3QgYSBQREYgZmlsZS5cIik7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRoaXMpLmRlc3Ryb3lJdGVtKHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5pc2hVcGRhdGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlclBkZihzY3JvbGxBZnRlclJlbmRlciA9IHRydWUpIHtcbiAgICB0aGlzLmNlbnRlcnNCZXR3ZWVuUGFnZXMgPSBbXTtcblxuICAgIGlmICh0aGlzLmZpdFRvV2lkdGhPbk9wZW4pIHtcbiAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gdGhpc1swXS5jbGllbnRXaWR0aCAvIHRoaXMubWF4UGFnZVdpZHRoO1xuICAgICAgdGhpcy5maXRUb1dpZHRoT25PcGVuID0gZmFsc2U7XG4gICAgfVxuXG4gICAgUHJvbWlzZS5hbGwoXG4gICAgICBfLnJhbmdlKDEsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMgKyAxKS5tYXAoKHBkZlBhZ2VOdW1iZXIpID0+IHtcbiAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzZXNbcGRmUGFnZU51bWJlciAtIDFdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT4ge1xuICAgICAgICAgIGxldCB2aWV3cG9ydCA9IHBkZlBhZ2UuZ2V0Vmlld3BvcnQodGhpcy5jdXJyZW50U2NhbGUpO1xuICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgICAgICBsZXQgb3V0cHV0U2NhbGUgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gTWF0aC5mbG9vcih2aWV3cG9ydC5oZWlnaHQpICogb3V0cHV0U2NhbGU7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gTWF0aC5mbG9vcih2aWV3cG9ydC53aWR0aCkgKiBvdXRwdXRTY2FsZTtcblxuICAgICAgICAgIGNvbnRleHQuX3NjYWxlWCA9IG91dHB1dFNjYWxlO1xuICAgICAgICAgIGNvbnRleHQuX3NjYWxlWSA9IG91dHB1dFNjYWxlO1xuICAgICAgICAgIGNvbnRleHQuc2NhbGUob3V0cHV0U2NhbGUsIG91dHB1dFNjYWxlKTtcbiAgICAgICAgICBjb250ZXh0Ll90cmFuc2Zvcm1NYXRyaXggPSBbb3V0cHV0U2NhbGUsIDAsIDAsIG91dHB1dFNjYWxlLCAwLCAwXTtcbiAgICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBNYXRoLmZsb29yKHZpZXdwb3J0LndpZHRoKSArICdweCc7XG4gICAgICAgICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IE1hdGguZmxvb3Iodmlld3BvcnQuaGVpZ2h0KSArICdweCc7XG5cbiAgICAgICAgICB0aGlzLnBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXIgLSAxXSA9IE1hdGguZmxvb3Iodmlld3BvcnQuaGVpZ2h0KTtcblxuICAgICAgICAgIHJldHVybiBwZGZQYWdlLnJlbmRlcih7Y2FudmFzQ29udGV4dDogY29udGV4dCwgdmlld3BvcnQ6IHZpZXdwb3J0fSk7XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICApLnRoZW4oKHJlbmRlclRhc2tzKSA9PiB7XG4gICAgICBpZiAoc2Nyb2xsQWZ0ZXJSZW5kZXIpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxUb3AodGhpcy5zY3JvbGxUb3BCZWZvcmVVcGRhdGUpO1xuICAgICAgICB0aGlzLnNjcm9sbExlZnQodGhpcy5zY3JvbGxMZWZ0QmVmb3JlVXBkYXRlKTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50UGFnZU51bWJlcigpO1xuICAgICAgfVxuICAgICAgUHJvbWlzZS5hbGwocmVuZGVyVGFza3MpLnRoZW4oKCkgPT4gdGhpcy5maW5pc2hVcGRhdGUoKSk7XG4gICAgfSwgKCkgPT4gdGhpcy5maW5pc2hVcGRhdGUoKSk7XG4gIH1cblxuICBjb21wdXRlTWF4UGFnZVdpZHRoQW5kVHJ5Wm9vbUZpdCgpe1xuICAgIFByb21pc2UuYWxsKFxuICAgICAgXy5yYW5nZSgxLCB0aGlzLnBkZkRvY3VtZW50Lm51bVBhZ2VzICsgMSkubWFwKChwZGZQYWdlTnVtYmVyKSA9PlxuICAgICAgICB0aGlzLnBkZkRvY3VtZW50LmdldFBhZ2UocGRmUGFnZU51bWJlcikudGhlbigocGRmUGFnZSkgPT5cbiAgICAgICAgICBwZGZQYWdlLmdldFZpZXdwb3J0KDEuMCkud2lkdGhcbiAgICAgICAgKVxuICAgICAgKVxuICAgICkudGhlbigocGRmUGFnZVdpZHRocykgPT4ge1xuICAgICAgdGhpcy5tYXhQYWdlV2lkdGggPSBNYXRoLm1heCguLi5wZGZQYWdlV2lkdGhzKTtcbiAgICAgIHRoaXMuem9vbUZpdCgpO1xuICAgIH0pXG4gIH1cblxuICB6b29tRml0KCkge1xuICAgIGlmICh0aGlzLm1heFBhZ2VXaWR0aCA9PSAwKSB7XG4gICAgICB0aGlzLmNvbXB1dGVNYXhQYWdlV2lkdGhBbmRUcnlab29tRml0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBmaXRTY2FsZSA9IHRoaXNbMF0uY2xpZW50V2lkdGggLyB0aGlzLm1heFBhZ2VXaWR0aDtcbiAgICByZXR1cm4gdGhpcy5hZGp1c3RTaXplKGZpdFNjYWxlIC8gKHRoaXMuY3VycmVudFNjYWxlICogIHRoaXMudG9TY2FsZUZhY3RvcikpO1xuICB9XG5cbiAgem9vbU91dCgpIHtcbiAgICByZXR1cm4gdGhpcy5hZGp1c3RTaXplKDEwMCAvICgxMDAgKyB0aGlzLnNjYWxlRmFjdG9yKSk7XG4gIH1cblxuICB6b29tSW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRqdXN0U2l6ZSgoMTAwICsgdGhpcy5zY2FsZUZhY3RvcikgLyAxMDApO1xuICB9XG5cbiAgcmVzZXRab29tKCkge1xuICAgIHJldHVybiB0aGlzLmFkanVzdFNpemUodGhpcy5kZWZhdWx0U2NhbGUgLyB0aGlzLmN1cnJlbnRTY2FsZSk7XG4gIH1cblxuICBnb1RvTmV4dFBhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgKyAxKTtcbiAgfVxuXG4gIGdvVG9QcmV2aW91c1BhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2Nyb2xsVG9QYWdlKHRoaXMuY3VycmVudFBhZ2VOdW1iZXIgLSAxKTtcbiAgfVxuXG4gIGNvbXB1dGVab29tZWRTY3JvbGxUb3Aob2xkU2Nyb2xsVG9wLCBvbGRQYWdlSGVpZ2h0cykge1xuICAgIGxldCBwaXhlbHNUb1pvb20gPSAwO1xuICAgIGxldCBzcGFjZXNUb1NraXAgPSAwO1xuICAgIGxldCB6b29tZWRQaXhlbHMgPSAwO1xuXG4gICAgZm9yIChsZXQgcGRmUGFnZU51bWJlciBvZiBfLnJhbmdlKDAsIHRoaXMucGRmRG9jdW1lbnQubnVtUGFnZXMpKSB7XG4gICAgICBpZiAocGl4ZWxzVG9ab29tICsgc3BhY2VzVG9Ta2lwICsgb2xkUGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl0gPiBvbGRTY3JvbGxUb3ApIHtcbiAgICAgICAgem9vbUZhY3RvckZvclBhZ2UgPSB0aGlzLnBhZ2VIZWlnaHRzW3BkZlBhZ2VOdW1iZXJdIC8gb2xkUGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl07XG4gICAgICAgIGxldCBwYXJ0T2ZQYWdlQWJvdmVVcHBlckJvcmRlciA9IG9sZFNjcm9sbFRvcCAtIChwaXhlbHNUb1pvb20gKyBzcGFjZXNUb1NraXApO1xuICAgICAgICB6b29tZWRQaXhlbHMgKz0gTWF0aC5yb3VuZChwYXJ0T2ZQYWdlQWJvdmVVcHBlckJvcmRlciAqIHpvb21GYWN0b3JGb3JQYWdlKTtcbiAgICAgICAgcGl4ZWxzVG9ab29tICs9IHBhcnRPZlBhZ2VBYm92ZVVwcGVyQm9yZGVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpeGVsc1RvWm9vbSArPSBvbGRQYWdlSGVpZ2h0c1twZGZQYWdlTnVtYmVyXTtcbiAgICAgICAgem9vbWVkUGl4ZWxzICs9IHRoaXMucGFnZUhlaWdodHNbcGRmUGFnZU51bWJlcl07XG4gICAgICB9XG5cbiAgICAgIGlmIChwaXhlbHNUb1pvb20gKyBzcGFjZXNUb1NraXAgKyAyMCA+IG9sZFNjcm9sbFRvcCkge1xuICAgICAgICBsZXQgcGFydE9mUGFkZGluZ0Fib3ZlVXBwZXJCb3JkZXIgPSBvbGRTY3JvbGxUb3AgLSAocGl4ZWxzVG9ab29tICsgc3BhY2VzVG9Ta2lwKTtcbiAgICAgICAgc3BhY2VzVG9Ta2lwICs9IHBhcnRPZlBhZGRpbmdBYm92ZVVwcGVyQm9yZGVyO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNwYWNlc1RvU2tpcCArPSAyMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gem9vbWVkUGl4ZWxzICsgc3BhY2VzVG9Ta2lwO1xuICB9XG5cbiAgYWRqdXN0U2l6ZShmYWN0b3IpIHtcbiAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmYWN0b3IgPSB0aGlzLnRvU2NhbGVGYWN0b3IgKiBmYWN0b3I7XG5cbiAgICBpZiAodGhpcy51cGRhdGluZykge1xuICAgICAgdGhpcy50b1NjYWxlRmFjdG9yID0gZmFjdG9yO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRpbmcgPSB0cnVlO1xuICAgIHRoaXMudG9TY2FsZUZhY3RvciA9IDE7XG5cbiAgICBsZXQgb2xkU2Nyb2xsVG9wID0gdGhpcy5zY3JvbGxUb3AoKTtcbiAgICBsZXQgb2xkUGFnZUhlaWdodHMgPSB0aGlzLnBhZ2VIZWlnaHRzLnNsaWNlKDApO1xuICAgIHRoaXMuY3VycmVudFNjYWxlID0gdGhpcy5jdXJyZW50U2NhbGUgKiBmYWN0b3I7XG4gICAgdGhpcy5yZW5kZXJQZGYoZmFsc2UpO1xuXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBsZXQgbmV3U2Nyb2xsVG9wID0gdGhpcy5jb21wdXRlWm9vbWVkU2Nyb2xsVG9wKG9sZFNjcm9sbFRvcCwgb2xkUGFnZUhlaWdodHMpO1xuICAgICAgdGhpcy5zY3JvbGxUb3AobmV3U2Nyb2xsVG9wKTtcbiAgICB9KTtcblxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgbGV0IG5ld1Njcm9sbExlZnQgPSB0aGlzLnNjcm9sbExlZnQoKSAqIGZhY3RvcjtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdChuZXdTY3JvbGxMZWZ0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnRQYWdlTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlTnVtYmVyO1xuICB9XG5cbiAgZ2V0VG90YWxQYWdlTnVtYmVyKCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZU51bWJlcjtcbiAgfVxuXG4gIHNjcm9sbFRvUGFnZShwZGZQYWdlTnVtYmVyKSB7XG4gICAgaWYgKHRoaXMudXBkYXRpbmcpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlQWZ0ZXJVcGRhdGUgPSBwZGZQYWdlTnVtYmVyXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGRmRG9jdW1lbnQgfHwgaXNOYU4ocGRmUGFnZU51bWJlcikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwZGZQYWdlTnVtYmVyID0gTWF0aC5taW4ocGRmUGFnZU51bWJlciwgdGhpcy5wZGZEb2N1bWVudC5udW1QYWdlcyk7XG4gICAgcGFnZVNjcm9sbFBvc2l0aW9uID0gKHRoaXMucGFnZUhlaWdodHMuc2xpY2UoMCwgKHBkZlBhZ2VOdW1iZXItMSkpLnJlZHVjZSgoKHgseSkgPT4geCt5KSwgMCkpICsgKHBkZlBhZ2VOdW1iZXIgLSAxKSAqIDIwXG5cbiAgICByZXR1cm4gdGhpcy5zY3JvbGxUb3AocGFnZVNjcm9sbFBvc2l0aW9uKTtcbiAgfVxuXG4gIHNjcm9sbFRvTmFtZWREZXN0KG5hbWVkRGVzdCkge1xuICAgIGlmICh0aGlzLnVwZGF0aW5nKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvTmFtZWREZXN0QWZ0ZXJVcGRhdGUgPSBuYW1lZERlc3RcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghdGhpcy5wZGZEb2N1bWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5wZGZEb2N1bWVudC5nZXREZXN0aW5hdGlvbihuYW1lZERlc3QpXG4gICAgICAudGhlbihkZXN0UmVmID0+IHRoaXMucGRmRG9jdW1lbnQuZ2V0UGFnZUluZGV4KGRlc3RSZWZbMF0pKVxuICAgICAgLnRoZW4ocGFnZU51bWJlciA9PiB0aGlzLnNjcm9sbFRvUGFnZShwYWdlTnVtYmVyICsgMSkpXG4gICAgICAuY2F0Y2goKCkgPT4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBDYW5ub3QgZmluZCBuYW1lZCBkZXN0aW5hdGlvbiAke25hbWVkRGVzdH0uYCkpXG4gIH1cblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGVQYXRoOiB0aGlzLmZpbGVQYXRoLFxuICAgICAgc2NhbGU6IHRoaXMuY3VycmVudFNjYWxlLFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbFRvcEJlZm9yZVVwZGF0ZSxcbiAgICAgIHNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsTGVmdEJlZm9yZVVwZGF0ZSxcbiAgICAgIGRlc2VyaWFsaXplcjogJ1BkZkVkaXRvckRlc2VyaWFsaXplcidcbiAgICB9O1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgaWYgKHRoaXMuZmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiBwYXRoLmJhc2VuYW1lKHRoaXMuZmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ3VudGl0bGVkJztcbiAgICB9XG4gIH1cblxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZVBhdGg7XG4gIH1cblxuICBnZXRQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmZpbGVQYXRoO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5wZGZEb2N1bWVudC5kZXN0cm95KCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGV0YWNoKCk7XG4gIH1cblxuICBvbkRpZENoYW5nZVRpdGxlKCkge1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiBudWxsKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlTW9kaWZpZWQoKSB7XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IG51bGwpO1xuICB9XG59XG4iXX0=