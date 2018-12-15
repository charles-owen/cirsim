/**
 * @file
 * The Cirsim object.
 * Creates Main objects for each element we are installing Cirsim in.
 */

import $ from 'jquery';
import {Main} from './Main';
import Options from './Options';
import Components from './Components';
import All from './Component/All';

/**
 * Create an instance of Cirsim
 *
 * This creates a single Instance that manages the
 * components and starts actual Cirsim windows.
 *
 * Construct and start running like this:
 *
 * Given an HTML div:
 *     <div id="cirsim"></div>
 *
 * The following script starts Cirsim in that div:
 *
 *     var cirsim = new Cirsim('#cirsim');
 *     cirsim.start();
 *
 * @param sel Selector to create Cirsim in (can be many)
 * @param options An object containing Cirsim options.
 * @constructor
 */
var Cirsim = function(sel, options) {
    var that = this;

    //
    // Master set of the version
    //
    let PACKAGE = require('../../package.json');
    this.version = PACKAGE.version;

    //
    // Determine the root directory for Cirsim
    // This is the directory containing cirsim.js or
    // cirsim.min.js
    //
    this.root = __webpack_public_path__.substr(0,
        __webpack_public_path__.length-1);

    // Record the selector
    this.sel = sel;

    // The Options object that manages user options
    this.options = new Options(options);

    //
    // Install all components and configure standard
    // Cirsim palettes.
    //
    this.components = new Components();
    All(this.components);

    // A collection of Main objects.
    var mains = [];

    // A collection of tests.
    // We collect those in Cirsim because the actual
    // Main may not be created, yet.
    var tests = [];

    /**
     * Start Cirsim running, creating the user interface.
     * This does wait for document ready before calling
     * this.startNow() unless we are running in no-window
     * mode. In that case it returns a started instance.
     */
    this.start = function() {
        if(sel === null) {
            return this.startNow();
        }

        $().ready(function() {
            that.startNow();
        });
    }

    /**
     * Start Cirsim running now. Does not wait for document ready.
     */
    this.startNow = function() {
        if(sel !== null) {
            $(sel).each(function(index, element) {
                let main = new Main(that, element, tests);
                mains.push(main);
            });

            if(mains.length == 1) {
                return mains[0];
            }
        } else {
            this.options.display = 'none';
            let main = new Main(that, null, tests);
            mains.push(main);
            return main;
        }

        return null;
    }


    /**
     * Get all active instances of Cirsim that are running.
     * @returns {Array} Array of objects of type Main.
     */
    this.getInstances = function() {
        return mains;
    }

    /**
     * Add a test that is available to run
     *
     * The underlying test is a JavaScript object with these tags:
     *
     * tag: A tag to identify the test
     * name: Name of the test, what will appear in menus
     * input: Array of input labels
     * output: Array of output labels
     * test: Array of tests, each an array of input/expected
     * staff: true if this is staff testing (no saving)
     *
     * @param test Test to add. Can be Javascript object, JSON or base64
     * encoded JSON.
     */
    this.addTest = function(test) {
        tests.push(test);

/*        if(test === Object(test)) {
            tests.push(test);
        }
        else if(test.substr(0, 1) === '{') {
            tests.push(JSON.parse(test));
        } else {
            // Not JSON, must be base64 encoded
            test = atob(test);
            tests.push(JSON.parse(test));
        } */
    }

    /**
     * Run a test by name
     * @param test
     */
    this.runTest = function(test) {
        mains.forEach(function(main) {
            main.runTest(test);
        })
    }

}

export default Cirsim;
