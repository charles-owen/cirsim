import {Component} from '../Component';
import {Led} from '../Graphics/Led';
import {BusConstant} from "./BusConstant";
import {Util} from "../Utility/Util";
import {Registers16} from "./Registers16";

/**
 * Component: TrafficLight

 * @constructor
 */
export const TrafficLight = function() {
    Component.call(this);

    this.height = 96;
    this.width = 32;
    this.valueR = undefined;
    this.valueY = undefined;
    this.valueG = undefined;

    this.red = new Led(0, -32, 12);
    this.yellow = new Led(0, 0, 12);
    this.green = new Led(0, 32, 12);

    // Inputs
    this.addIn(-16, -32, 16);
    this.addIn(-16, 0, 16);
    this.addIn(-16, 32, 16);
};

TrafficLight.prototype = Object.create(Component.prototype);
TrafficLight.prototype.constructor = TrafficLight;

TrafficLight.prototype.prefix = "L";
TrafficLight.prototype.nameRequired = true;

TrafficLight.type = "TrafficLight";        ///< Name to use in files
TrafficLight.label = "Traffic Light";          ///< Label for the palette
TrafficLight.desc = "Traffic Light";    ///< Description for the palette
TrafficLight.img = "trafficlight.png";       ///< Image to use for the palette
TrafficLight.description = `<h2>Traffic Light</h2><p>The Traffic Light component has indicators 
for Red, Yellow, and Green as in a conventional traffic light.</p>`;
TrafficLight.order = 504;
TrafficLight.help = 'trafficlight';


/**
 * Compute the gate result
 * @param state
 */
TrafficLight.prototype.compute = function(state) {
    this.valueR = state[0];
    this.valueY = state[1];
    this.valueG = state[2];
};

/**
 * Clone this component object.
 * @returns {TrafficLight}
 */
TrafficLight.prototype.clone = function() {
    var copy = new TrafficLight();
    copy.copyFrom(this);
    return copy;
};

/**
 * Support for string-based testing.
 *
 * Example: test:red=1;yel=0;grn=0
 * @param value Test string like red=1 or yel=0
 * @param input In object test was sent to
 */
TrafficLight.prototype.testAsString = function(value, input) {
    if(value === null) {
        return;
    }

    const items = value.split('=');
    if(items[1] === '?') {
        // For don't cares, we just return
        return;
    }

    if(items.length < 2) {
        throw "Invalid traffic light test validation string " + value;
    }

    let testValue;
    switch(items[0]) {
        case 'red':
            testValue = this.valueR;
            break;

        case 'grn':
        case 'green':
            testValue = this.valueG;
            break;

        case 'yel':
        case 'yellow':
            testValue = this.valueY;
            break;

        default:
            throw "Invalid traffic light test validation string " + value;
    }

    if(testValue === undefined || items[1] === '1' && !testValue || items[1] === '0' && testValue) {
        const v = testValue === undefined ? '?' : (testValue ? '1' : '0');
        throw "Incorrect traffic light value. Expected " + value + " but got " + items[0] + '=' + v;
    }
}

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
TrafficLight.prototype.draw = function(context, view) {
    // Select the style
    this.selectStyle(context, view);

    var background = "#feb51a";
    this.drawBox(context, background);

    // TrafficLight
    this.red.color = this.valueR === undefined ? "undefined" : (this.valueR ? "red" : "off");
    this.red.draw(context, this.x-0.5, this.y, background);
    this.yellow.color = this.valueY === undefined ? "undefined" : (this.valueY ? "yellow" : "off");
    this.yellow.draw(context, this.x-0.5, this.y, background);
    this.green.color = this.valueG === undefined ? "undefined" : (this.valueG ? "green" : "off");
    this.green.draw(context, this.x-0.5, this.y, background);

    this.drawIO(context, view);
};
