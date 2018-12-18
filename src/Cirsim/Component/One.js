
import {Component} from '../Component';
import {PaletteImage} from '../Graphics/PaletteImage';

/**
 * Component: One (fixed true) gate
 * @param name Name assigned to this component
 * @constructor
 */
export const One = function(name) {
    Component.call(this, name);

    this.height = 16;
    this.width = 16;

    // One output
    this.addOut(8, 0, 8);
    this.outs[0].set(true);
};

One.prototype = Object.create(Component.prototype);
One.prototype.constructor = One;

One.prototype.prefix = null;    ///< No component naming

One.type = "One";           ///< Name to use in files
One.label = "1";            ///< Label for the palette
One.desc = "1 (true)";      ///< Description for the palette
One.description = '<h2>One</h2><p>A simple true value.</p>';
One.order = 0.5;            ///< Order of presentation in the palette
One.help = 'one';           ///< Help page is available

/**
 * Compute the gate result
 * @param state
 */
One.prototype.compute = function(state) {
    this.outs[0].set(true);
};

/**
 * Clone this component object.
 * @returns {One}
 */
One.prototype.clone = function() {
    var copy = new One();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
One.prototype.draw = function(context, view) {
    // Select the style to draw
    this.selectStyle(context, view);

    this.drawBox(context);
    this.drawText(context, '1', 0, 5, "14px Times");
    this.drawIO(context, view);
};

/**
 * Create a PaletteImage object for the component
 */
One.paletteImage = function() {
    let size=16;  // Box size
    let width = 60;       // Image width
    let height = 30;      // Image height

    var pi = new PaletteImage(width, height);

    pi.box(size, size);
    pi.io(size/2, 0, 'e');

    pi.drawText("1", 0, 5, "14px Times");
    return pi;
}
