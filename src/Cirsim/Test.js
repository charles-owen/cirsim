/**
 * @file
 * Object for management of testing
 */

import Value from './Value.js';
import MessageDialog from './Dlg/MessageDialog.js';
import TestException from './TestException.js';
import Promise from 'es6-promise';

/**
 * Constructor
 * @param main The Test object
 */
var Test = function(main) {
    var that = this;

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
     * @param A test from the array of tests.
     */
    this.runTestDlg = function(tag) {
        // Set the overlay so the tests are modal
        main.modal(true);

        var promise = this.runTest(tag);
        promise.then(() => {
            // Success
            main.modal(false);

            var html = '<h1>Circuit Success</h1>' +
                '<p>The test has passed.</p>'
            var dlg = new MessageDialog("Success", html);
            dlg.open();
            $("#answer").val("success");
            $("#circuit").val(main.model.toJSON());
            
        }, (msg) => {
            // Failure
            main.modal(false);

            var html = '<h1>Circuit Failure</h1>' + msg;
            var dlg = new MessageDialog("Test Failure", html, 450);
            dlg.open();

            $("#answer").val("fail");
            $("#circuit").val(main.model.toJSON());
        });
    }

    this.runTest = function(tag) {
        return new Promise((success, failure) => {

            var test = this.findTest(tag);
            if (test === null) {
                failure('<p>Test ' + tag + ' does not exist.</p>');
            }

            var model = main.model;
    
            // Backup the model if we have an available user id to save to
            model.backup();
            if(main.userid === null) {
                main.saveSingle();
            }

            // The current test number
            var testNum = -1;
    
            try {
                //
                // Find the inputs
                //
                var inputs = findInputs(test);
    
                //
                // Find the outputs
                //
                var outputs = findOutputs(test);
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
                    var t = test.test[testNum];
    
                    // Ensure the last test passed
                    for(var i=0; i<outputs.length && (i + inputs.length)<t.length; i++) {
                        // What is expected?
                        var expected = t[i + inputs.length];
    
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
                        var bitslop = false;
                        var any = false;
                        do {
                            any = false;
    
                            if(isString(expected) && expected.substr(0, 8) === "bitslop:") {
                                bitslop = true;
                                expected = expected.substr(8);
                                any = true;
                            }
                        } while(any);
    
                        // What is expected? Use a Value component to
                        // allow things like hex and floating point values
                        var value = new Value();
                        value.type = Value.BINARY;
                        value.setAsString(expected);
    
                        // Get the result
                        var actual = outputs[i].getAsString();
                        var good = true;        // Until we know otherwise
    
                        if(bitslop) {
                            expected = value.getAsInteger();
    
                            value.setAsBinary(actual);
                            var actual = value.getAsInteger();
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
                                var j = actual.length - 1;
                                var k = expected.length - 1;
    
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
                            console.log("Test: " + testNum + " Actual: " + actual + " Expected: "
                                + expected);
                            failure('<p>This test is failing. Some output is not what is currently' +
                                ' expected by the test. The circuit is left in the state it was' +
                                ' in when the test failed. No additional detail will be provided about why ' +
                                'the test is failed. It is your responsibility to create a ' +
                                'circuit that works as expected.</p>');
                            return;
                        }
                    }
                }
    
                testNum++;
    
                if(testNum < test.test.length) {
                    var t = test.test[testNum];
    
                    for(var i=0; i<inputs.length && i<t.length; i++) {
                        if(t[i] !== null) {
                            var result = inputs[i].command(t[i]);
                            if(result !== null) {
                                if(!result.ok) {
                                    failure('<p>This test is failing. ' + result.msg + '</p>');
                                    return;
                                }
                            } else {
                                try {
                                    inputs[i].setAsString(t[i]);
                                } catch(msg) {
                                    console.log("exception: " + msg);
                                    failure('<p>This test is failing. ' + msg + '</p>');
                                    return;
                                }
                            }
                        }
                    }
    
                    // Churn one second worth
                    var simulation = model.getSimulation();
                    for(var i=0; i<100;  i++) {
                        if(!simulation.advance(0.010)) {
                            break;
                        }
                    }
    
                    setTimeout(testOne, main.options.testTime);
    
                    if(simulation.view !== null) {
                        simulation.view.draw();
                    }
                } else {
                    success();
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
                    break;
                }

                tabmsg = ' in tab <em>' + tabname + '</em>';
                input = tab.substr(colon+1);
            }

            if(input.substr(0, 5) === "type:") {
                var type = input.substr(5);
                var components = search.getComponentsByType(type);
                if(components.length == 0) {
                    throw new TestException('<p>The test is not able to pass because you do not have a' +
                        ' component of type ' + type + tabmsg + '.</p>');
                    break;
                } else if(components.length > 1) {
                    throw new TestException('<p>The test is not able to pass because you have more than' +
                        ' one  component of type ' + type + tabmsg + '.</p>' +
                        '<p>You are only allowed one component of that type ' +
                        'in this circuit.</p>');
                    break;
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
                    break;
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

export default Test;


