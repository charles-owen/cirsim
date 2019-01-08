
import {Component} from '../Component';
import {PaletteImage} from '../Graphics/PaletteImage';
import {CanvasHelper} from '../Graphics/CanvasHelper';

/**
 * Component: Inverter gate
 * @constructor
 */
export const Inverter = function() {
    Component.call(this);

    this.height = 50;
    this.width = 40;

    // One input and one output
    this.addIn(-20, 0, 12);
    this.addOutInv(20, 0, 12);
};

Inverter.prototype = Object.create(Component.prototype);
Inverter.prototype.constructor = Inverter;

Inverter.type = "Inverter";            ///< Name to use in files
Inverter.label = "Inverter";           ///< Label for the palette
Inverter.desc = "Inverter gate";       ///< Description for the palette
Inverter.order = 13;               ///< Order of presentation in the palette
Inverter.description = `<h2>Inverter</h2><p>The output of an Inverter gate is <em>true</em> if the 
 input is false and <em>false</em> if the input is true.</p>`;
Inverter.help = 'inverter';

/**
 * Compute the gate result
 * @param state
 */
Inverter.prototype.compute = function(state) {
    this.outs[0].set(state[0]);
};

/**
 * Clone this component object.
 * @returns {Inverter}
 */
Inverter.prototype.clone = function() {
    var copy = new Inverter();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Inverter.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    Inverter.path(context, this.x, this.y, this.width, this.height);
    CanvasHelper.fillWith(context);

    Inverter.path(context, this.x, this.y, this.width, this.height);
    context.stroke();

    // Name
    if(this.naming !== null) {
        context.font = "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x-6, this.y + 5);
        context.stroke();
    }

    this.drawIO(context, view);
};

Inverter.path = function(context, x, y, width, height) {
	let leftX = x - width/2 - 0.5;
	let rightX = x + width/2 + 0.5;
	let topY = y - height/2 - 0.5;
	let botY = y + height/2 + 0.5;

    // Left side
    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, botY);

    // Bottom
    context.lineTo(rightX, y);

    // Top
    context.lineTo(leftX, topY);
}

/**
 * Create a PaletteImage object for an Inverter
 */
Inverter.paletteImage = function() {
    let paletteImage = new PaletteImage(120, 70);
	let size = 0.7;

    Inverter.path(paletteImage.context, 60, 35, 40, 50);
    paletteImage.fillStroke();
   // paletteImage.context.stroke();

    paletteImage.io(-20, 0, 'w');

    paletteImage.io(30, 0, 'e');
    paletteImage.circle(25, 0, 5);

    return paletteImage;
}

