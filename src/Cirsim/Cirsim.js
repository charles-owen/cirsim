import {Main} from './Main';
import {Options} from './Options';
import {Components} from './Components';
import {All} from './Component/All';
import {Ready} from './Utility/Ready';

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
export const Cirsim = function(sel, options) {
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
    this.root = __webpack_public_path__;

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
    this.start = () => {
        if(sel === null) {
            return this.startNow();
        }

        Ready.go(() => {
            this.startNow();
        });
    }

    /**
     * Start Cirsim running now. Does not wait for document ready.
     */
    this.startNow = () => {
        if(sel !== null) {
            if(sel instanceof Element) {
	            const main = new Main(this, sel, tests);
	            mains.push(main);
            } else {
                const elements = document.querySelectorAll(sel);
                for(let i=0; i<elements.length; i++) {
                    const element = elements[i];
	                const main = new Main(this, element, tests);
	                mains.push(main);
                }
            }

            if(mains.length === 1) {
	            if(this.options.global !== null) {
		            global[this.options.global] = mains[0];
	            }

                return mains[0];
            }
        } else {
            this.options.display = 'none';
            let main = new Main(this, null, tests);
            mains.push(main);
            return main;
        }

        return null;
    }


    /**
     * Get all active instances of Cirsim that are running.
     * @returns {Array} Array of objects of type Main.
     * @deprecated This is going away
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
