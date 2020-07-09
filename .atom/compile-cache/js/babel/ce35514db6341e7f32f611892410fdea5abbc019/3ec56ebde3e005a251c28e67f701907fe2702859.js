Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = repositoryForEditorPath;

var _atom = require('atom');

/**
 * Given a pathString for a file in an active TextEditor
 *
 * @param  {String} pathString
 * @return {Promise<GitRepository>}
 */
'use babel';

function repositoryForEditorPath(pathString) {
  var directory = new _atom.Directory(pathString);

  return atom.project.repositoryForDirectory(directory).then(function (projectRepo) {
    if (!projectRepo) {
      throw new Error('Unable to find GitRepository for path ' + pathString + '.');
    }

    return projectRepo;
  });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9yZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBVXdCLHVCQUF1Qjs7b0JBUnJCLE1BQU07Ozs7Ozs7O0FBRmhDLFdBQVcsQ0FBQzs7QUFVRyxTQUFTLHVCQUF1QixDQUFDLFVBQVUsRUFBRTtBQUMxRCxNQUFNLFNBQVMsR0FBRyxvQkFBYyxVQUFVLENBQUMsQ0FBQzs7QUFFNUMsU0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUNsRCxJQUFJLENBQUMsVUFBQyxXQUFXLEVBQUs7QUFDckIsUUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixZQUFNLElBQUksS0FBSyw0Q0FBMEMsVUFBVSxPQUFJLENBQUM7S0FDekU7O0FBRUQsV0FBTyxXQUFXLENBQUM7R0FDcEIsQ0FBQyxDQUFDO0NBQ04iLCJmaWxlIjoiL2hvbWUvYWgyNTc5NjIvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL3JlcG9zaXRvcnlGb3JFZGl0b3JQYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IERpcmVjdG9yeSB9IGZyb20gJ2F0b20nO1xuXG4vKipcbiAqIEdpdmVuIGEgcGF0aFN0cmluZyBmb3IgYSBmaWxlIGluIGFuIGFjdGl2ZSBUZXh0RWRpdG9yXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBwYXRoU3RyaW5nXG4gKiBAcmV0dXJuIHtQcm9taXNlPEdpdFJlcG9zaXRvcnk+fVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXBvc2l0b3J5Rm9yRWRpdG9yUGF0aChwYXRoU3RyaW5nKSB7XG4gIGNvbnN0IGRpcmVjdG9yeSA9IG5ldyBEaXJlY3RvcnkocGF0aFN0cmluZyk7XG5cbiAgcmV0dXJuIGF0b20ucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGRpcmVjdG9yeSlcbiAgICAudGhlbigocHJvamVjdFJlcG8pID0+IHtcbiAgICAgIGlmICghcHJvamVjdFJlcG8pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBHaXRSZXBvc2l0b3J5IGZvciBwYXRoICR7cGF0aFN0cmluZ30uYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9qZWN0UmVwbztcbiAgICB9KTtcbn1cbiJdfQ==