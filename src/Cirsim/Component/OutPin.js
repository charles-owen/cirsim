import {Component} from '../Component';
import {Led} from '../Graphics/Led'

/**
 * Component: OutPin output pin
 * @param name Component name
 * @constructor
 */
export const OutPin = function(name) {
    Component.call(this, name);

    this.height = 16;
    this.width = 64;

    this.led = new Led(-19, 0, 7);

    // One input
    this.addIn(-32, 0, 16);
};

OutPin.prototype = Object.create(Component.prototype);
OutPin.prototype.constructor = OutPin;

OutPin.prototype.prefix = "O";
OutPin.prototype.nameRequired = true;

OutPin.type = "OutPin";        ///< Name to use in files
OutPin.label = "Out Pin";          ///< Label for the palette
OutPin.desc = "Output Pin";    ///< Description for the palette
OutPin.img = "outpin.png";       ///< Image to use for the palette
OutPin.order = 2;             ///< Order of presentation in the palette
OutPin.description = '<h2>Ouput Pin</h2><p>An OUT pin serves as output ' +
    'for a circuit. The LED indicates if the input is true (green), false ' +
    '(black), or undefined (?).</p>';
OutPin.help = 'outpin';

/**
 * This function is called when an input is changed on this
 * component.
 *
 * There is no delay for an output pin
 */
OutPin.prototype.pending = function() {
};


OutPin.prototype.get = function() {
    return this.ins[0].value;
};

OutPin.prototype.getAsString = function() {
    switch(this.ins[0]) {
        case true:
            return "1";

        case false:
            return "0";

        default:
            return "?";
    }
};


/**
 * Clone this component object.
 * @returns {OutPin}
 */
OutPin.prototype.clone = function() {
    var copy = new OutPin();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
OutPin.prototype.draw = function(context, view) {
    var value = this.get();

    // Component background
    var background = this.value ? "white" : "#dddddd";
    this.outlinePath(context);
    context.fillStyle = background;
    context.fill();

    // LED
    this.led.color = value === undefined ? "undefined" : (value ? "green" : "off");
    this.led.draw(context, this.x, this.y, background);

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    this.outlinePath(context);
    context.stroke();

    // Name
    context.beginPath();
    context.font = "14px Times";
    context.textAlign = "center";

    var val = value === undefined ? "?" : (value ? "1" : "0");
    var x = this.x + 9;
    if(this.naming !== null) {
        context.fillText(this.naming + ": " + val, x, this.y + 5);
    } else {
        context.fillText(val, x, this.y + 5);
    }

    this.drawIO(context, view);
};

OutPin.prototype.outlinePath = function(context) {
    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX, this.y);
    context.lineTo(leftX + this.height/2, botY);
    context.lineTo(rightX, botY);
    context.lineTo(rightX, topY);
    context.lineTo(leftX + this.height/2, topY);
    context.lineTo(leftX, this.y);
};
