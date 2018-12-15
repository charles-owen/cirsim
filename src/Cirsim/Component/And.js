/**
 * Component: AND gate
 */

import Component from '../Component';
import {PaletteImage} from '../Graphics/PaletteImage';
import CanvasHelper from '../Graphics/CanvasHelper';

var And = function(name) {
    Component.call(this, name);

    this.height = 50;
    this.width = 64;

    // Two inputs and one output
    this.addIn(-32, -16, 16);
    this.addIn(-32, 16, 16);
    this.addOut(32, 0, 16);
};

And.prototype = Object.create(Component.prototype);
And.prototype.constructor = And;

And.type = "And";            ///< Name to use in files
And.label = "AND";           ///< Label for the palette
And.desc = "AND gate";       ///< Description for the palette
And.order = 11;               ///< Order of presentation in the palette
And.description = `<h2>AND Gate</h2><p>The output of an AND gate is <em>true</em> if both inputs are true.</p>`;
And.help = 'and';

/**
 * Compute the gate result
 * @param state
 */
And.prototype.compute = function(state) {
    if(state[0] && state[1]) {
        this.outs[0].set(true);
    } else if(state[0] === false || state[1] === false) {
        this.outs[0].set(false);
    } else {
        this.outs[0].set(undefined);
    }
};

/**
 * Clone this component object.
 * @returns {And}
 */
And.prototype.clone = function() {
    var copy = new And();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
And.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    And.path(context, this.x, this.y, this.width, this.height);
    CanvasHelper.fillWith(context);

    And.path(context, this.x, this.y, this.width, this.height);
    context.stroke();

    this.drawName(context, -2, 5);
    this.drawIO(context, view);
};

/**
 * Create a path in the basic AND gate shape.
 * @param context
 * @param x
 * @param y
 * @param width
 * @param height
 */
And.path = function(context, x, y, width, height) {
    var leftX = x - width/2 - 0.5;
    var rightX = x + width/2 + 0.5;
    var topY = y - height/2 - 0.5;
    var botY = y + height/2 + 0.5;

    // Left side
    context.beginPath();
    context.moveTo(leftX, botY);
    context.lineTo(leftX, topY);

    // Top
    context.lineTo(rightX - height / 2, topY);

    // Arc
    context.arc(rightX - height / 2,
        y, height/2 + 0.5, -Math.PI/2, Math.PI/2);

    // Bottom
    context.lineTo(leftX, botY);
}

/**
 * Create a PaletteImage object for an And gate
 * This is the base shape without input/outputs
 * so we can use this code for 3-4 inputs and NAND
 */
And.paletteImageBase = function() {
    var paletteImage = new PaletteImage(120, 70);
    var size = 0.7;

    var context = paletteImage.context;
    context.lineWidth = 1.5;

    var x = paletteImage.width / 2;
    var y = paletteImage.height / 2;
    var scale = 0.5;
    var width = scale * paletteImage.width;
    var height = scale * paletteImage.height;

    var arc = 26.5;
    var leftX = x - width/2 - 0.5;
    var rightX = x + width/2 + 0.5;
    var topY = y - arc + 0.5;
    var botY = y + arc - 0.5;

    this.leftX = leftX - paletteImage.width/2;
    this.rightX = rightX - paletteImage.width/2

    // Left side
    context.beginPath();
    context.moveTo(leftX, botY);
    context.lineTo(leftX, topY);

    // Top
    context.lineTo(rightX - arc, topY);

    // Arc
    context.arc(rightX - arc, y, arc, -Math.PI/2, Math.PI/2);

    // Bottom
    context.lineTo(leftX, botY);
    context.stroke();


    paletteImage.io(this.rightX, 0, 'e');

    return paletteImage;
}

/**
 * Create a PaletteImage object for an And gate
 */
And.paletteImage = function() {

    var paletteImage = And.paletteImageBase();
    paletteImage.io(this.leftX, -16, 'w');
    paletteImage.io(this.leftX, +16, 'w');

    return paletteImage;
}

export default And;
