/**
 * Various user interface options we can select
 */

/**
 * User interface options.
 * @param options User provided options that override the default values.
 * @constructor
 */
var Options = function(options) {
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

    /// Do we include the input/export menu options?
    /// Options are: 'none', 'import', 'export', 'both'
    this.export = 'both';

    /// Number of milliseconds between tests
    /// Set larger to slow the tests down
    this.testTime = 17;

    /// A user ID associated with some remote system
    /// Primary used for AJAX file/save functionality
    this.userid = null;

    /// Any import options, importing from
    /// files from other assignments
   // this.imports = [];

    /// Optional specification of server-side API for save/load capabilities
    /// Most simple version is a URL for the server.
    /// More advance version is an object with these optional properties:
    ///
    /// url - Server URL
    /// extra - Object with extra data to be send with API operations
    ///
    /// save - Object with save-specific resources (url, extra)
    /// open - Object with open-specific resources
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
            if(this.api[mode] !== undefined) {
 
                // Mode is explicitly specified
                var modeObj = this.api[mode];
                if(modeObj.url === undefined) {
                    // Mode is not supported
                    return null;
                }

                var obj = {url: modeObj.url};

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

                var obj = {url: this.api.url};
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



export default Options;
