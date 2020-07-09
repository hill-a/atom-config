Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _consumed = require("./consumed");

var _consumed2 = _interopRequireDefault(_consumed);

var _provided = require("./provided");

var _provided2 = _interopRequireDefault(_provided);

exports["default"] = { consumed: _consumed2["default"], provided: _provided2["default"] };

/**
 * # Hydrogen <img src="https://cdn.rawgit.com/nteract/hydrogen/17eda245/static/animate-logo.svg" alt="hydrogen animated logo" height="50px" align="right" />
 *
 * ## Services API
 *
 * The [Atom Services API](https://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/) is a way for Atom packages to interact with each other. Hydrogen both provides and consumes *services* to add additional features to itself. `./lib/services` is our container folder for anything that functions through the [Atom Services API](https://flight-manual.atom.io/behind-atom/sections/interacting-with-other-packages-via-services/). If the service is considered a *provided service*, then it is located inside of `./lib/services/provided`. If the service, however, is considered a *consumed service*, then it is located inside of `./lib/services/consumed`.
 *
 * ### Consumed Services
 * - [Status Bar Tile: `status-bar`](./consumed/status-bar/status-bar.js)
 *    - This allows us to add kernel controls to the status bar.
 * - [Autocomplete For Any Editor: `autocomplete-plus`](./consumed/autocomplete.js)
 *    - This allows us to add autocomplete to things like watches.
 *
 * ### Provided Services
 * - [Autocomplete Results: `autocomplete-plus`](./provided/autocomplete.js)
 *    - This allows us to provide autocomplete results that are similiar to jupyter's tab completion.
 *
 * ## License
 *
 * This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/nteract/hydrogen/blob/master/LICENSE.md) file for details.
 */
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7d0JBRXFCLFlBQVk7Ozs7d0JBQ1osWUFBWTs7OztxQkFFbEIsRUFBRSxRQUFRLHVCQUFBLEVBQUUsUUFBUSx1QkFBQSxFQUFFIiwiZmlsZSI6Ii9ob21lL2FoMjU3OTYyLy5hdG9tL3BhY2thZ2VzL0h5ZHJvZ2VuL2xpYi9zZXJ2aWNlcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBjb25zdW1lZCBmcm9tIFwiLi9jb25zdW1lZFwiO1xuaW1wb3J0IHByb3ZpZGVkIGZyb20gXCIuL3Byb3ZpZGVkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHsgY29uc3VtZWQsIHByb3ZpZGVkIH07XG5cbi8qKlxuICogIyBIeWRyb2dlbiA8aW1nIHNyYz1cImh0dHBzOi8vY2RuLnJhd2dpdC5jb20vbnRlcmFjdC9oeWRyb2dlbi8xN2VkYTI0NS9zdGF0aWMvYW5pbWF0ZS1sb2dvLnN2Z1wiIGFsdD1cImh5ZHJvZ2VuIGFuaW1hdGVkIGxvZ29cIiBoZWlnaHQ9XCI1MHB4XCIgYWxpZ249XCJyaWdodFwiIC8+XG4gKlxuICogIyMgU2VydmljZXMgQVBJXG4gKlxuICogVGhlIFtBdG9tIFNlcnZpY2VzIEFQSV0oaHR0cHM6Ly9mbGlnaHQtbWFudWFsLmF0b20uaW8vYmVoaW5kLWF0b20vc2VjdGlvbnMvaW50ZXJhY3Rpbmctd2l0aC1vdGhlci1wYWNrYWdlcy12aWEtc2VydmljZXMvKSBpcyBhIHdheSBmb3IgQXRvbSBwYWNrYWdlcyB0byBpbnRlcmFjdCB3aXRoIGVhY2ggb3RoZXIuIEh5ZHJvZ2VuIGJvdGggcHJvdmlkZXMgYW5kIGNvbnN1bWVzICpzZXJ2aWNlcyogdG8gYWRkIGFkZGl0aW9uYWwgZmVhdHVyZXMgdG8gaXRzZWxmLiBgLi9saWIvc2VydmljZXNgIGlzIG91ciBjb250YWluZXIgZm9sZGVyIGZvciBhbnl0aGluZyB0aGF0IGZ1bmN0aW9ucyB0aHJvdWdoIHRoZSBbQXRvbSBTZXJ2aWNlcyBBUEldKGh0dHBzOi8vZmxpZ2h0LW1hbnVhbC5hdG9tLmlvL2JlaGluZC1hdG9tL3NlY3Rpb25zL2ludGVyYWN0aW5nLXdpdGgtb3RoZXItcGFja2FnZXMtdmlhLXNlcnZpY2VzLykuIElmIHRoZSBzZXJ2aWNlIGlzIGNvbnNpZGVyZWQgYSAqcHJvdmlkZWQgc2VydmljZSosIHRoZW4gaXQgaXMgbG9jYXRlZCBpbnNpZGUgb2YgYC4vbGliL3NlcnZpY2VzL3Byb3ZpZGVkYC4gSWYgdGhlIHNlcnZpY2UsIGhvd2V2ZXIsIGlzIGNvbnNpZGVyZWQgYSAqY29uc3VtZWQgc2VydmljZSosIHRoZW4gaXQgaXMgbG9jYXRlZCBpbnNpZGUgb2YgYC4vbGliL3NlcnZpY2VzL2NvbnN1bWVkYC5cbiAqXG4gKiAjIyMgQ29uc3VtZWQgU2VydmljZXNcbiAqIC0gW1N0YXR1cyBCYXIgVGlsZTogYHN0YXR1cy1iYXJgXSguL2NvbnN1bWVkL3N0YXR1cy1iYXIvc3RhdHVzLWJhci5qcylcbiAqICAgIC0gVGhpcyBhbGxvd3MgdXMgdG8gYWRkIGtlcm5lbCBjb250cm9scyB0byB0aGUgc3RhdHVzIGJhci5cbiAqIC0gW0F1dG9jb21wbGV0ZSBGb3IgQW55IEVkaXRvcjogYGF1dG9jb21wbGV0ZS1wbHVzYF0oLi9jb25zdW1lZC9hdXRvY29tcGxldGUuanMpXG4gKiAgICAtIFRoaXMgYWxsb3dzIHVzIHRvIGFkZCBhdXRvY29tcGxldGUgdG8gdGhpbmdzIGxpa2Ugd2F0Y2hlcy5cbiAqXG4gKiAjIyMgUHJvdmlkZWQgU2VydmljZXNcbiAqIC0gW0F1dG9jb21wbGV0ZSBSZXN1bHRzOiBgYXV0b2NvbXBsZXRlLXBsdXNgXSguL3Byb3ZpZGVkL2F1dG9jb21wbGV0ZS5qcylcbiAqICAgIC0gVGhpcyBhbGxvd3MgdXMgdG8gcHJvdmlkZSBhdXRvY29tcGxldGUgcmVzdWx0cyB0aGF0IGFyZSBzaW1pbGlhciB0byBqdXB5dGVyJ3MgdGFiIGNvbXBsZXRpb24uXG4gKlxuICogIyMgTGljZW5zZVxuICpcbiAqIFRoaXMgcHJvamVjdCBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgLSBzZWUgdGhlIFtMSUNFTlNFLm1kXShodHRwczovL2dpdGh1Yi5jb20vbnRlcmFjdC9oeWRyb2dlbi9ibG9iL21hc3Rlci9MSUNFTlNFLm1kKSBmaWxlIGZvciBkZXRhaWxzLlxuICovXG4iXX0=