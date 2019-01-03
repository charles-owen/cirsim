import {Component} from '../Component';
import {PaletteImage} from '../Graphics/PaletteImage';

/**
 * Component: Zero (fixed false) gate
 */
export const Zero = function() {
    Component.call(this);

    this.height = 16;
    this.width = 16;

    // Zero output
    this.addOut(8, 0, 8);
    this.outs[0].set(false);
};

Zero.prototype = Object.create(Component.prototype);
Zero.prototype.constructor = Zero;

Zero.prototype.prefix = null;   ///< No component naming

Zero.type = "Zero";         ///< Name to use in files
Zero.label = "0";           ///< Label for the palette
Zero.desc = "0 (false)";    ///< Description for the palette
Zero.description = '<h2>Zero</h2><p>A simple false value.</p>';
Zero.order = 0;             ///< Order of presentation in the palette
Zero.help = 'zero';         ///< Available online help for zero

/**
 * Compute the gate result
 * @param state
 */
Zero.prototype.compute = function(state) {
    this.outs[0].set(false);
};

/**
 * Clone this component object.
 * @returns {Zero}
 */
Zero.prototype.clone = function() {
    var copy = new Zero();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Zero.prototype.draw = function(context, view) {
    // Select the style to draw
    this.selectStyle(context, view);

    this.drawBox(context);
    this.drawText(context, '0', 0, 5, "14px Times");
    this.drawIO(context, view);
};

/**
 * Create a PaletteImage object for the component
 */
Zero.paletteImage = function() {
    let size=16;  // Box size
    let width = 60;       // Image width
    let height = 30;      // Image height

    var pi = new PaletteImage(width, height);

    pi.box(size, size);
    pi.io(size/2, 0, 'e');

    pi.drawText("0", 0, 5, "14px Times");
    return pi;
}
