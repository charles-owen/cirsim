import {Component} from '../Component';
import {PaletteImage} from "../Graphics/PaletteImage";

/**
 * Component: Simple register.
 */
export const Register = function() {
    Component.call(this);

    this.height = 90;
    this.width = 32;
    const w2 = this.width / 2;
    const h2 = this.height / 2;

    this.lastClk = false;

    // Two inputs, two outputs
    this.addIn(-w2, 0, 8, "D").bus = true;
    const clk = this.addIn(0, -h2, 11);
    clk.orientation = 'n';
    clk.clock = true;
    this.addOut(w2, 0, 8, "Q").bus = true;

    this.outs[0].set(undefined);
};

Register.prototype = Object.create(Component.prototype);
Register.prototype.constructor = Register;

Register.type = "Register";            ///< Name to use in files
Register.label = "Register";           ///< Label for the palette
Register.desc = "Register";       ///< Description for the palette
Register.description = `<h2>Register</h2>
<p>A bus register. Works like a D Flip-Flop for all bits on a bus input and output. 
When the clock input goes high, the output is set to the value of the input. Works for
any bus size.</p>`;
Register.order = 404;

/**
 * Compute the gate result
 * @param state
 */
Register.prototype.compute = function(state) {
    if(state[1] && !this.lastClk) {
        const q = state[0];
        this.outs[0].set(q);
    }

    this.lastClk = state[1];
};

/**
 * Clone this component object.
 * @returns {Register}
 */
Register.prototype.clone = function() {
    const copy = new Register();
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



/**
 * Create a PaletteImage object for a the component
 */
Register.paletteImage = function() {
    const pi = new PaletteImage(60, 44);

    const wid = 12;
    pi.box(wid, 32);
    pi.io(-wid/2, 0, 'w');
    pi.io(wid/2, 0, 'e');
    pi.drawText("D", -wid/2+3, 2, "7px Times");
    pi.drawText("Q", wid/2-3, 2, "7px Times");

    // Clock
    pi.clock(0, -16, 'n');

    return pi;
}

