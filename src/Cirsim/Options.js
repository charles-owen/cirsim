/**
 * User interface options.
 * @param options User provided options that override the default values.
 * @constructor
 */
export const Options = function(options) {
    options = options ? options : {};

    /// Display options
    /// window - Displays as a standard div (default)
    /// inline - For display in a page without the user interface
    /// full - Full screen
    /// none - No window at all
    this.display = 'window';

    /// Any content (JSON) to preload
    this.load = null;

    /// Any additional tabs to add
    /// Do not include "main", it is always included
    this.tabs = [];

    /// If true, we include the tabs menu
    this.tabsMenu = true;

    /// Do we include the input/export menu options?
    /// Options are: 'none', 'import', 'export', 'both'
    this.export = 'both';

    /// Number of milliseconds between tests
    /// Set larger to slow the tests down
    this.testTime = 17;

    /// A user ID associated with some remote system
    /// Primary used for AJAX file/save functionality
    this.userid = null;

	/**
	 * All installed tests as an array of tests, each of
     * which represents a single test. Each test can be
     * a Javascript object, JSON of an object, or base64 of
     * a JSON object. The use of base64 helps to obfuscate tests.
     *
	 * The underlying test is a JavaScript object with these tags:
	 *
	 * tag: A tag to identify the test
	 * name: Name of the test, what will appear in menus
	 * input: Array of input labels
	 * output: Array of output labels
	 * test: Array of tests, each an array of input/expected
	 * staff: true if this is staff testing (no saving)
     * result: A results selector
     * circuit: A circuit selector
     * success: A value to set the results selector to on a success
     *
     * If result is set, any element that matches that selector will
     * be set to 0 or the value of 'success' depending on the test failure/success
     *
     * If circuit is set, any element that matches that selector will
     * have its value set to the current circuit when the test is selected.
	 */
    this.tests = [];

	/**
     * Any import options, importing from files from other assignments
     *
     * Array of possible imports, each an object with the keys:
     * from - Tab in source we import from
     * into - Tab we import into
     * name - Filename for source
     * extra - Object with extra key/value pairs to send to server when importing
	 */
    this.imports = [];

    /// Optional specification of server-side API for save/load capabilities
    /// Most simple version is a URL for the server.
    /// More advanced version is an object with these optional properties:
    ///
    /// url - Server URL
    /// extra - Object with extra data to be send with API operations
    /// save - Object with save-specific resources (url, name, mode, extra)
    /// open - Object with open-specific resources (url, extra)
    /// import - Object with import-specific resources (url, name,
    /// files - Object with directory query-specific resources
    ///
    this.api = null;

    /// Optional exit link. If provided, the menu will have an "Exit" option
    /// with this link in it.
    this.exit = null;

    /// Indication of what components are included in the palette.
    /// This can be:
    /// A string with a palette name
    /// [or] An array containing strings that name components
    /// or palette names.
    ///
    /// Examples:
    /// components: 'combinatorial'
    /// components: ['combinatorial', 'Or3', 'Or4']
    /// components: ['sequential']
    ///
    this.components = ['combinatorial', 'sequential'];

    /// List of components that are always included even if specific components are
    /// specified in this.components.
    this.always = ['Zero', 'One', 'InPin', 'OutPin', 'Clock', 'Button', 'LED'];

    /// Display all output states
    this.showOutputStates = false;

    for(var property in options) {
        if(options.hasOwnProperty(property)) {
            if(!this.hasOwnProperty(property)) {
                throw new Error("Invalid option " + property);
            }
            this[property] = options[property];
        }
    }

    /**
     * Get the API operations for a given file mode.
     * @param mode 'save', 'open'
     * @returns {*}
     */
    this.getAPI = function(mode) {
        if(this.api === null) {
            return null;
        }

        if(this.api === Object(this.api)) {
            let obj;

            if(this.api[mode] !== undefined) {
 
                // Mode is explicitly specified
                var modeObj = this.api[mode];
                if(modeObj.url === undefined) {
                    // Mode is not supported
                    return null;
                }

                // Send content type
                obj = {url: modeObj.url};
                if(modeObj.contentType !== undefined) {
                    obj.contentType = modeObj.contentType;
                } else if(this.api.contentType !== undefined) {
                    obj.contentType = this.api.contentType;
                } else {
                    obj.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
                }

                if(modeObj.extra !== undefined) {
                    obj.extra = modeObj.extra;
                } else if(this.api.extra !== undefined) {
                    obj.extra = this.api.extra;
                } else {
                    obj.extra = {};
                }

                if(modeObj.name !== undefined) {
                    obj.name = modeObj.name;
                } else if(this.api.name !== undefined) {
                    obj.name = this.api.name;
                }
            } else {
                if(this.api.url === undefined) {
                    return null;
                }

                obj = {url: this.api.url};
                if(this.api.extra !== undefined) {
                    obj.extra = this.api.extra;
                } else {
                    obj.extra = {};
                }

                if(this.api.name !== undefined) {
                    obj.name = this.api.name;
                }
            }

            return obj;
        } else {
            return {url: this.api};
        }
    }
}
