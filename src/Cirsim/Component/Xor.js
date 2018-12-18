
import {Component} from '../Component';
import {Or} from './Or';

/**
 * Component: XOR gate
 * @param name Component name
 * @constructor
 */
export const Xor = function(name) {
    Component.call(this, name);

    this.height = 50;
    this.width = 64;

    //
    // This math computes the location of the pins
    // relative to the arc on the left side of the OR gate
    //
    var offset = Xor.offsetX;
    var a = Math.atan2(this.height/2, offset);
    var r = offset / Math.cos(a);
    var pinY = 16;
    var pinX = Math.sqrt(r*r - pinY*pinY) - offset;

    // Two inputs and one output
    this.addIn(-32 + pinX, -pinY, 16 + pinX);
    this.addIn(-32 + pinX,  pinY, 16 + pinX);
    this.addOut(32, 0, 16);
};

Xor.prototype = Object.create(Component.prototype);
Xor.prototype.constructor = Xor;

Xor.offsetX = 40;        ///< Left side offset for left arc
Xor.offsetY = 30;        ///< Lower offset to right arcs
Xor.offsetX1 = 6;        ///< Offset for the left extra bar

Xor.type = "Xor";            ///< Name to use in files
Xor.label = "XOR";           ///< Label for the palette
Xor.desc = "XOR gate";       ///< Description for the palette
Xor.img = "xor.png";         ///< Image to use for the palette
Xor.order = 17;               ///< Xorder of presentation in the palette
Xor.description = '<h2>XOR Gate</h2><p>The output of an XOR ' +
    'gate is <em>true</em> if the state of the inputs differ. Otherwise, it is false.</p>';

/**
 * Compute the gate result
 * @param state
 */
Xor.prototype.compute = function(state) {
    if(state[0] === undefined || state[1] === undefined) {
        this.outs[0].set(undefined);
    } else {
        this.outs[0].set( (state[0] && !state[1]) || (!state[0] && state[1]) );
    }
};

/**
 * Clone this component object.
 * @returns {Xor}
 */
Xor.prototype.clone = function() {
    var copy = new Xor();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Xor.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    Or.draw(context, this.x, this.y, this.width, this.height);

    context.beginPath();

    // Extra left side
    var leftX = this.x - this.width/2 - 0.5;
    var offsetX = Xor.offsetX;
    var a = Math.atan2(this.height/2, offsetX);
    var r = offsetX / Math.cos(a);
    context.arc(leftX - offsetX - Xor.offsetX1, this.y, r, -a, a);
    context.stroke();

    this.drawName(context, -2, 5);
    this.drawIO(context, view);
};
