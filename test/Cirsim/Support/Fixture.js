import {Circuits} from '../../../src/Cirsim/Circuits';
import {Circuit} from '../../../src/Cirsim/Circuit';
import {InPin} from '../../../src/Cirsim/Component/InPin';
import {OutPin} from '../../../src/Cirsim/Component/OutPin';
import {InPinBus} from '../../../src/Cirsim/Component/InPinBus';
import {OutPinBus} from '../../../src/Cirsim/Component/OutPinBus';
import {Value} from "../../../src/Cirsim/Value";


/**
 * Create a text fixture for testing a single component
 * @param component under tests
 * @constructor
 */
export const Fixture = function(component, inputNames, outputNames) {
    var circuits = new Circuits(null);

    // Add a "main" circuit
    var circuit = circuits.add(new Circuit("main"));

    // Add the component under test
    circuit.add(component);

    // Create sufficient inputs
    var inputs = [];


    if(inputNames !== undefined) {
        inputNames.forEach((name) => {
            for(var i=0; i<component.ins.length;  i++) {
                let inp = component.ins[i];
                if(inp.name === name || (inp.name === undefined && name === 'CLK' && inp.clock)) {
                    let input;
                    if(inp.bus) {
                        input = circuit.add(new InPinBus(name));
                    } else {
                        input = circuit.add(new InPin(name));
                    }

                    circuit.connect(input, 0, component, i);
                    inputs.push(input);
                    break;
                }
            }

            if(i === component.ins.length) {
                throw 'Unable to find an input with name ' + name;
            }
        });
    } else {
        for(var i=0; i<component.ins.length;  i++) {
            let inp = component.ins[i];
            let input;
            if(inp.bus) {
                input = circuit.add(new InPinBus("I" + (i+1)));
            } else {
                input = circuit.add(new InPin("I" + (i+1)));
            }

            circuit.connect(input, 0, component, i);
            inputs.push(input);
        }
    }

    this.inputs = inputs;

    // Create sufficient outputs
    var outputs = [];

    if(outputNames !== undefined) {
        outputNames.forEach((name) => {
            for(var i=0; i<component.outs.length;  i++) {
                let outp = component.outs[i];
                if(outp.name === name) {
                    let output;
                    if(outp.bus) {
                        output = circuit.add(new OutPinBus(name));
                    } else {
                        output = circuit.add(new OutPin(name));
                    }

                    circuit.connect(component, i, output, 0);
                    outputs.push(output);
                    break;
                }

            }

            if(i === component.outs.length) {
                throw 'Unable to find an output with name ' + name;
            }
        });

    } else {
        for(var i=0; i<component.outs.length;  i++) {
            let outp = component.outs[i];
            let output;
            if(outp.bus) {
                output = circuit.add(new OutPinBus("O" + (i+1)));
            } else {
                output = circuit.add(new OutPin("O" + (i+1)));
            }

            circuit.connect(component, i, output, 0);
            outputs.push(output);
        }
    }


    this.outputs = outputs;

    // Ensure a stable state
    circuits.simulation.advance(1);


    /**
     * Conduct a test
     * @param assert
     * @param fixture
     * @param tests
     */
    this.test = function(tests) {
        var result = {};

        if(tests[0].length !== this.inputs.length + this.outputs.length) {
            result.pass = false;
            result.message = "Expected row length " + tests[0].length + ' is not equal to ' +
                this.inputs.length + ' inputs plus ' + this.outputs.length + ' outputs';
            return result;
        }

        for(var t=0; t<tests.length; t++) {
             var test = tests[t];

             // Set the inputs
             var i=0;
             for( ; i<this.inputs.length; i++) {
                 const input = this.inputs[i];
                 input.set(test[i]);
             }

            circuits.simulation.advance(1);

            // Check the outputs
            for(let j=0; j<this.outputs.length; j++) {
                const output = this.outputs[j];
                const actual = output.getAsValue();
                const expected = new Value(test[i]);
                if(!actual.equals(expected)) {
                    result.pass = false;
                    result.message = "Test failed on row " + t + ' output ' + j +
                        "\n expected: " + expected.get() + "\n   actual: " + actual.get();
                    return result;
                }

                i++;
            }
        }

        result.pass = true;
        result.message = 'Passes tests';
        return result;



    }

    /**
     * This allows true, false, and undefined to be specified as
     * 1, 0, and '?'.
     * @param val
     * @returns {*}
     */
    function valueParse(val) {
        switch(val) {
            case 0:
                return false;

            case 1:
                return true;

            case '?':
                return undefined;

            default:
                return val;
        }
    }


}

Fixture.matcher = {
    toPassTest: function(util, customEqualityTesters) {
        return {
            // fixture: Object of type Fixture
            // expected: Array of input/output expectations
            compare: function(fixture, expected) {
                return fixture.test(expected);
            }
        }
    }
}

export default Fixture;

