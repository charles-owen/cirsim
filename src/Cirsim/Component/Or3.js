/**
 * Component: 3-input OR gate
 */

import Component from '../Component.js';
import Or from './Or.js';

var Or3 = function(name) {
    Component.call(this, name);

    this.height = 50;
    this.width = 64;

    //
    // This math computes the location of the pins
    // relative to the arc on the left side of the OR gate
    //
    var offset = Or3.offsetX;
    var a = Math.atan2(this.height/2, offset);
    var r = offset / Math.cos(a);
    var pinY = 16;
    var pinX = Math.sqrt(r*r - pinY*pinY) - offset;
    var pinY2 = 2;
    var pinX2 = Math.sqrt(r*r - pinY2*pinY2) - offset;

    // Three inputs and one output
    this.addIn(-32 + pinX, -pinY, 16 + pinX);
    this.addIn(-32 + pinX2, 0, 16 + pinX2);
    this.addIn(-32 + pinX,  pinY, 16 + pinX);
    this.addOut(32, 0, 16);
};

Or3.prototype = Object.create(Component.prototype);
Or3.prototype.constructor = Or3;

Or3.offsetX = 40;         ///< Left side offset for left arc
Or3.offsetY = 30;         ///< Lower offset to right arcs

Or3.type = "Or3";            ///< Name to use in files
Or3.label = "OR";           ///< Label for the palette
Or3.desc = "OR gate";       ///< Description for the palette
Or3.img = "or3.png";         ///< Image to use for the palette
Or3.order = 15.3;               ///< Order of presentation in the palette
Or3.description = '<h2>OR Gate</h2><p>The output of a three-input OR ' +
    'gate is <em>true</em> if any of of the' +
    ' inputs are true. Otherwise, it is false.</p>';

/**
 * Compute the gate result
 * @param state
 */
Or3.prototype.compute = function(state) {
    if(state[0] || state[1] || state[2]) {
        this.outs[0].set(true);
    } else if(state[0] === undefined || state[1] === undefined || state[2] === undefined) {
        this.outs[0].set(undefined);
    } else {
        this.outs[0].set(false);
    }
};

/**
 * Clone this component object.
 * @returns {Or3}
 */
Or3.prototype.clone = function() {
    var copy = new Or3();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Or3.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    Or.draw(context, this.x, this.y, this.width, this.height);

    this.drawName(context, -2, 5);
    this.drawIO(context, view);
};

export default Or3;


