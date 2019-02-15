
import {Component} from '../Component';
import {CanvasHelper} from '../Graphics/CanvasHelper';
import {PaletteImage} from "../Graphics/PaletteImage";
import {And} from "./And";

/**
 * Component: OR gate

 * @constructor
 */
export const Or = function() {
    Component.call(this);

    this.height = 50;
    this.width = 64;

    //
    // This math computes the location of the pins
    // relative to the arc on the left side of the OR gate
    //
    var offset = Or.offsetX;
    var a = Math.atan2(this.height/2, offset);
    var r = offset / Math.cos(a);
    var pinY = 16;
    var pinX = Math.sqrt(r*r - pinY*pinY) - offset;

    // Two inputs and one output
    this.addIn(-32 + pinX, -pinY, 16 + pinX);
    this.addIn(-32 + pinX,  pinY, 16 + pinX);
    this.addOut(32, 0, 16);
};

Or.prototype = Object.create(Component.prototype);
Or.prototype.constructor = Or;

Or.offsetX = 40;         ///< Left side offset for left arc
Or.offsetY = 30;         ///< Lower offset to right arcs

Or.type = "Or";            ///< Name to use in files
Or.label = "OR";           ///< Label for the palette
Or.desc = "OR gate";       ///< Description for the palette
// Or.img = "or.png";         ///< Image to use for the palette
Or.order = 20;               ///< Order of presentation in the palette
Or.description = `<h2>OR Gate</h2><p>The output of an OR gate is <em>true</em> 
if either or both inputs are true. Otherwise, it is false.</p>`;
Or.help = 'or';

/**
 * Compute the gate result
 * @param state
 */
Or.prototype.compute = function(state) {
    if(state[0] || state[1]) {
        this.outs[0].set(true);
    } else if(state[0] === undefined || state[1] === undefined) {
        this.outs[0].set(undefined);
    } else {
        this.outs[0].set(false);
    }
};

/**
 * Clone this component object.
 * @returns {Or}
 */
Or.prototype.clone = function() {
    var copy = new Or();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Or.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    Or.draw(context, this.x, this.y, this.width, this.height);

    this.drawName(context, -2, 5);
    this.drawIO(context, view);
};

Or.draw = function(context, x, y, width, height) {
    Or.path(context, x, y, width, height);
    CanvasHelper.fillWith(context);
    context.stroke();
}

Or.path = function(context, x, y, width, height) {
    var leftX = x - width/2 - 0.5;
    var rightX = x + width/2 + 0.5;
    var topY = y - height/2 - 0.5;
    var botY = y + height/2 + 0.5;

    context.beginPath();

    // Left side
    var offsetX = Or.offsetX;
    var a = Math.atan2(height/2, offsetX);
    var r = offsetX / Math.cos(a);
    context.arc(leftX - offsetX, y, r, -a, a);

    var offsetY = ((width/2)*(width/2) - (height/2)*(height/2)) / height;
    r = height/2 + offsetY;
    a = Math.atan2(offsetY, width/2);

    // Bottom
    context.lineTo(x, botY);
    context.arc(x, y -offsetY, r, Math.PI/2, a, true);

    // Top
    context.arc(x, y + offsetY, r,-a, -Math.PI/2, true);
    context.lineTo(leftX, topY);
}

/**
 * Create a PaletteImage object for an Or gate
 * This is the base shape without input/outputs
 * so we can use this code for 3-4 inputs and NOR
 */
Or.paletteImageBase = function() {
	var paletteImage = new PaletteImage(120, 70);

	var context = paletteImage.context;
	context.lineWidth = 1.5;

	var x = paletteImage.width / 2;
	var y = paletteImage.height / 2;
	var width = 0.5 * paletteImage.width;
	var height = 0.65 * paletteImage.height;

	var leftX = x - width/2 - 0.5;
	var rightX = x + width/2 + 0.5;
	var topY = Math.round(y - height/2) - 0.5;
	var botY = Math.round(y + height/2) + 0.5;

	context.beginPath();

	// Left side
	var offsetX = Or.offsetX;
	var a = Math.atan2(height/2, offsetX);
	var r = offsetX / Math.cos(a);
	context.arc(leftX - offsetX, y, r, -a, a);

	var offsetY = ((width/2)*(width/2) - (height/2)*(height/2)) / height;
	r = height/2 + offsetY;
	a = Math.atan2(offsetY, width/2);

	this.leftX = leftX - paletteImage.width/2 + 3;
	this.rightX = rightX - paletteImage.width/2


	// Bottom
	context.lineTo(x, botY);
	context.arc(x, y -offsetY, r, Math.PI/2, a, true);

	// Top
	context.arc(x, y + offsetY, r,-a, -Math.PI/2, true);
	context.lineTo(leftX, topY);

	paletteImage.fillStroke();

	paletteImage.io(this.rightX, 0, 'e');
	return paletteImage;
}

/**
 * Create a PaletteImage object for an Or gate
 */
Or.paletteImage = function() {

	var paletteImage = Or.paletteImageBase();
	paletteImage.io(this.leftX, -16, 'w');
	paletteImage.io(this.leftX, +16, 'w');

	return paletteImage;
}

