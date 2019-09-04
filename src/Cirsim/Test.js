
import {Value} from './Value';
import {MessageDialog} from './Dlg/MessageDialog';
import {TestException} from './TestException';

/**
 * Constructor
 * @param main The Test object
 */
export const Test = function(main) {
    /// The main object
    this.main = main;

    /// Array of installed tests
    this.tests = [];

    this.addTest = function (test) {
        if (test === Object(test)) {
            this.tests.push(test);
        }
        else if (test.substr(0, 1) === '{') {
            this.tests.push(JSON.parse(test));
        } else {
            // Not JSON, must be base64 encoded
            test = atob(test);
            this.tests.push(JSON.parse(test));
        }
    }

    /**
     * Find a test by its tag.
     * @param tag Tag to search for
     */
    this.findTest = function(tag) {
        for(var i=0; i<this.tests.length; i++) {
            if(this.tests[i].tag === tag) {
                return this.tests[i];
            }
        }

        return null;
    }


    function isString(str) {
        return (typeof str === 'string' || str instanceof String);
    }



    /**
     * Run a single test and bring up result dialog boxes
     * @param test A test from the array of tests.
     */
    this.runTestDlg = function(test) {
        // Save before we test
        main.save(true, true);

        // Set the overlay so the tests are modal
        main.modal(true);

        const promise = this.runTest(test);
        promise.then((test) => {
            // Success
            main.modal(false);

            var html = '<h1>Circuit Success</h1>' +
                '<p>The test has passed.</p>'
            var dlg = new MessageDialog("Success", html);
            dlg.open();

	        setResult(test, test.success !== undefined ? test.success : 'success');
	        setCircuit(test, main.model.toJSON());

        }, (msg) => {
            // Failure
            main.modal(false);

            var html = '<h1>Circuit Failure</h1>' + msg;
            var dlg = new MessageDialog("Test Failure", html, 450);
            dlg.open();

            setResult(test, 'fail');
            setCircuit(test, main.model.toJSON());
        });
    }

    function setResult(test, result) {
	    if(test.result !== undefined) {
		    const elements = document.querySelectorAll(test.result);
		    for(const element of elements) {
			    element.value = result;
		    }
	    }
    }

    function setCircuit(test, circuit) {
        if(test.circuit !== undefined) {
	        const elements = document.querySelectorAll(test.circuit);
	        for(const element of elements) {
		        element.value = circuit;
	        }
        }
    }

    this.runTest = function(test) {
        return new Promise((success, failure) => {
            const model = main.model;
    
            // Backup the model to support Undo of what the test changes
            model.backup();

            // The current test number
            let testNum = -1;

            let inputs, outputs;

            try {
                //
                // Find the inputs
                //
                inputs = findInputs(test);
    
                //
                // Find the outputs
                //
                outputs = findOutputs(test);
            } catch(exception) {
                if(exception instanceof TestException) {
                    failure(exception.msg);
                    return;
                } else {
                    throw exception;
                }
            }
    
            function testOne() {
                if(testNum >= 0) {
                    const t = test.test[testNum];
    
                    // Ensure the last test passed
                    for(let i=0; i<outputs.length && (i + inputs.length)<t.length; i++) {
                        // What is expected?
                        let expected = t[i + inputs.length];

                        // Handle don't care, either a null or '?'
                        if(expected === null || expected === '?') {
                            continue;
                        }
    
                        //
                        // Handle any prefixes
                        //
    
                        // bitslop: is the bitslop option prefix.
                        // Bitslop means we expect the result to be
                        // within one bit of the expected value.
                        let bitSlop = false;
                        let any = false;
                        do {
                            any = false;
    
                            if(isString(expected) && expected.substr(0, 8) === "bitslop:") {
                                bitSlop = true;
                                expected = expected.substr(8);
                                any = true;
                            }
                        } while(any);
    
                        // What is expected? Use a Value component to
                        // allow things like hex and floating point values
                        const value = new Value();
                        value.type = Value.BINARY;
                        value.setAsString(expected);

	                    // Get the result
                        let actual = outputs[i].getAsString();
                        let good = true;        // Until we know otherwise

                        if(bitSlop) {
                            expected = value.getAsInteger();
    
                            value.setAsBinary(actual);
                            actual = value.getAsInteger();
                            if(actual === '?')  {
                                good = false;
                            } else if(actual < (expected-1) || (actual > expected+1)) {
                                good = false;
                            }
                        } else {
                            // The normal (binary) comparison case
                            expected = value.getAsBinary();
                            if(isString(expected)) {
                                // j and k index the last letters in actual and expected
                                let j = actual.length - 1;
                                let k = expected.length - 1;
    
                                // Test from the right end of both results so we
                                // ensure we are testing the same bits.
                                for( ; k >= 0 && good; j--, k--) {
                                    if(expected.substr(k, 1) === '?') {
                                        continue;
                                    }
    
                                    if(j < 0) {
                                        good = false;
                                        break;
                                    }
    
                                    if(actual.substr(j, 1) != expected.substr(k, 1)) {
                                        good = false;
                                    }
                                }
    
                                // If we exhausted expected, but still have actual bits
                                // we have an error
                                if(j > 0) {
                                    good = false;
                                }
                            } else {
                                if(expected !== null && expected !== '?') {
                                    good = expected == actual;
                                }
                            }
                        }
    
                        if(good) {
                            // Success
                        } else { 
                            // Failure
                            console.log(test);
                            console.log("Test: " + testNum + " Output " + outputs[i].component.naming + " Actual: " + actual + " Expected: "
                                + expected);
                            if(test.quiet === true) {
                                failure('<div class="cirsim-test-result"><p>This test is failing. Some output is not what is currently' +
                                    ' expected by the test. The circuit is left in the state it was' +
                                    ' in when the test failed. No additional detail will be provided about why ' +
                                    'the test is failed. It is your responsibility to create a ' +
                                    'circuit that works as expected.</p></div>');
                            } else {

                                failure(`<div class="cirsim-test-result"><p>This test is failing. An output value is 
not what is currently expected by the test. The circuit is left in the state it was 
in when the test failed.<p>
<p class="cs-result">Output ${outputs[i].component.naming} expected: ${expected} actual: ${actual}</p>
<p class="cs-info">Test ${testNum}</p></div>
`);
                            }

                            return;
                        }
                    }
                }
    
                testNum++;
    
                if(testNum < test.test.length) {
                    const t = test.test[testNum];
    
                    for(let i=0; i<inputs.length && i<t.length; i++) {
                        if(t[i] !== null) {
                            const result = inputs[i].command(t[i]);
                            if(result !== null) {
                                if(!result.ok) {
                                    failure('<p>This test is failing. ' + result.msg + '</p>');
                                    return;
                                }
                            } else {
                                try {
                                    inputs[i].setAsString(t[i]);
                                } catch(msg) {
                                    failure(`<div class="cirsim-test-result"><p>This test is failing.${msg}</p>
<p class="cs-info">Test ${testNum}</p></div>`);
                                    return;
                                }
                            }
                        }
                    }
    
                    // Churn one second worth
                    const simulation = model.getSimulation();
                    for(let i=0; i<100;  i++) {
                        if(!simulation.advance(0.010)) {
                            break;
                        }
                    }
    
                    setTimeout(testOne, main.options.testTime);
    
                    if(simulation.view !== null) {
                        simulation.view.draw();
                    }
                } else {
                    success(test);
                }
            }
    
            setTimeout(testOne, main.options.testTime);
        });
    }

    /**
     * Find all of the specified circuit inputs
     * @param test The test we are running
     * @returns {Array} Array of input objects
     */
    function findInputs(test) {
        var model = main.model;

        //
        // Find the inputs
        //
        var inputs = [];
        for(var i=0; i<test.input.length; i++) {
            var input = test.input[i];
            var search = model;
            var tabmsg = '';

            // Test for tab specification. That's a prefix
            // like this: tab:tabname:
            if(input.substr(0, 4) === "tab:") {
                var tab = input.substr(4);
                var colon = tab.indexOf(":");
                if(colon === -1) {
                    throw new TestException('<p>Invalid input tab definition: ' + input + '</p>');
                }

                var tabname = tab.substr(0, colon);

                search = model.getCircuit(tabname);
                if(search === null) {
                    throw new TestException('<p>Invalid input tab: ' + tabname + '</p>');
                }

                tabmsg = ' in tab <em>' + tabname + '</em>';
                input = tab.substr(colon+1);
            }

            if(input.substr(0, 5) === "type:") {
                var type = input.substr(5);
                var components = search.getComponentsByType(type);
                if(components.length === 0) {
                    throw new TestException('<p>The test is not able to pass because you do not have a' +
                        ' component of type ' + type + tabmsg + '.</p>');
                } else if(components.length > 1) {
                    throw new TestException('<p>The test is not able to pass because you have more than' +
                        ' one  component of type ' + type + tabmsg + '.</p>' +
                        '<p>You are only allowed one component of that type ' +
                        'in this circuit.</p>');
                }
                inputs.push(components[0]);
            } else {
                // Finding component by naming
                var component = search.getComponentByNaming(input);
                if(component !== null) {
                    inputs.push(component);
                } else {
                    throw new TestException('<p>The test is not able to pass because you do not' +
                        ' have a component named ' + input + tabmsg + '.</p>' +
                        '<p>Typically, the tests are looking for an input' +
                        ' pin or a bus input pin. Input pins are labeled IN in the palette. Double-click' +
                        ' on an input pin to set the name. Names in Cirsim are case sensitive.</p>');
                }
            }
        }

        return inputs;
    }

    function findOutputs(test) {
        var model = main.model;

        var outputs = [];
        for(var i=0; i<test.output.length; i++) {
            var search = model;
            var tabmsg = '';

            var split = test.output[i].split("-");
            var output = split[0];

            // Test for tab specification. That's a prefix
            // like this: tab:tabname:
            if(output.substr(0, 4) === "tab:") {
                var tab = output.substr(4);
                var colon = tab.indexOf(":");
                if(colon === -1) {
                    throw new TestException('<p>Invalid output tab definition: ' + output + '</p>');
                    break;
                }

                var tabname = tab.substr(0, colon);

                search = model.getCircuit(tabname);
                if(search === null) {
                    throw new TestException('<p>Invalid out tab: ' + tabname + '</p>');
                    break;
                }

                tabmsg = ' in tab <em>' + tabname + '</em>';
                output = tab.substr(colon+1);
            }

            var pin = split.length > 1 ? split[1] : 0;

            var component = search.getComponentByNaming(output);
            if(component !== null && component.ins.length > pin) {
                outputs.push(component.ins[pin]);
            } else {
                throw new TestException('<p>The test is not able to pass because you do not' +
                    ' have a component named ' + output + tabmsg + '.</p>' +
                    '<p>Output pins are labeled OUT in the palette. Double-click' +
                    ' on an output pin to set the name. Pin names are case sensitive.</p>');
                break;
            }
        }

        return outputs;
    }

}

