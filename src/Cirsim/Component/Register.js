/**
 * Component: Simple register.
 */

import Component from '../Component.js';

var Register = function(name) {
    Component.call(this, name);

    this.height = 90;
    this.width = 32;
    var w2 = this.width / 2;
    var h2 = this.height / 2;

    this.lastClk = false;

    // Two inputs, two outputs
    this.addIn(-w2, 0, 16, "D").bus = true;
    var clk = this.addIn(0, -h2, 11);
    clk.orientation = 'n';
    clk.clock = true;
    this.addOut(w2, 0, 16, "Q").bus = true;

    this.outs[0].set(undefined);
};

Register.prototype = Object.create(Component.prototype);
Register.prototype.constructor = Register;

Register.type = "Register";            ///< Name to use in files
Register.label = "Register";           ///< Label for the palette
Register.desc = "Register";       ///< Description for the palette
Register.img = "register.png";         ///< Image to use for the palette
Register.description = `<h2>Register</h2>
<p>A bus register. Works like a D Flip-Flop for all bits on a bus input and output. 
When the clock input goes high, the output is set to the value of the input. Works for
any bus size.</p>`;
Register.order = 310;

/**
 * Compute the gate result
 * @param state
 */
Register.prototype.compute = function(state) {
    if(state[1] && !this.lastClk) {
        var q = state[0];
        this.outs[0].set(q);
    }

    this.lastClk = state[1];
};

/**
 * Clone this component object.
 * @returns {Register}
 */
Register.prototype.clone = function() {
    var copy = new Register();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Register.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    this.drawBox(context);
    this.drawName(context, 0, -16);
    this.drawIO(context, view);
};

export default Register;
