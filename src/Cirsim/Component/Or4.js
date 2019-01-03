
import {Component} from '../Component';
import {Or} from './Or';
import {Or3} from "./Or3";

/**
 * Component: OR gate

 * @constructor
 */
export const Or4 = function() {
    Component.call(this);

    this.height = 64;
    this.width = 64;

    //
    // This math computes the location of the pins
    // relative to the arc on the left side of the OR gate
    //
    var offset = Or4.offsetX;
    var a = Math.atan2(this.height/2, offset);
    var r = offset / Math.cos(a);
    var pinY = 8;
    var pinX = Math.sqrt(r*r - pinY*pinY) - offset;
    var pinY2 = 8 + 16;
    var pinX2 = Math.sqrt(r*r - pinY2*pinY2) - offset;

    // Four inputs and one output
    this.addIn(-32 + pinX2, -pinY2, 16 + pinX2);
    this.addIn(-32 + pinX, -pinY, 16 + pinX);
    this.addIn(-32 + pinX,  pinY, 16 + pinX);
    this.addIn(-32 + pinX2,  pinY2, 16 + pinX2);
    this.addOut(32, 0, 16);
};

Or4.prototype = Object.create(Component.prototype);
Or4.prototype.constructor = Or4;

Or4.offsetX = 40;         ///< Left side offset for left arc
Or4.offsetY = 30;         ///< Lower offset to right arcs

Or4.type = "Or4";            ///< Name to use in files
Or4.label = "OR";           ///< Label for the palette
Or4.desc = "OR gate";       ///< Description for the palette
//Or4.img = "or4.png";         ///< Image to use for the palette
Or4.order = 15.5;               ///< Order of presentation in the palette
Or4.description = '<h2>OR Gate</h2><p>The output of a four-input OR ' +
    'gate is <em>true</em> if any of of the' +
    ' inputs are true. Otherwise, it is false.</p>';

/**
 * Compute the gate result
 * @param state
 */
Or4.prototype.compute = function(state) {
    if(state[0] || state[1] || state[2] || state[3]) {
        this.outs[0].set(true);
    } else if(state[0] === undefined || state[1] === undefined || state[2] === undefined || state[3] === undefined) {
        this.outs[0].set(undefined);
    } else {
        this.outs[0].set(false);
    }
};

/**
 * Clone this component object.
 * @returns {Or4}
 */
Or4.prototype.clone = function() {
    var copy = new Or4();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Or4.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    Or.draw(context, this.x, this.y, this.width, this.height);

    this.drawName(context, -2, 5);
    this.drawIO(context, view);
};


/**
 * Create a PaletteImage object for an Or gate
 */
Or4.paletteImage = function() {

	var paletteImage = Or.paletteImageBase();
	paletteImage.io(Or.leftX, -16, 'w');
	paletteImage.io(Or.leftX, -5.5, 'w');
	paletteImage.io(Or.leftX, +5.5, 'w');
	paletteImage.io(Or.leftX, +16, 'w');

	return paletteImage;
}
