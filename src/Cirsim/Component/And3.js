
import {Component} from '../Component';
import {And} from './And';

/**
 * Component: 3-input AND gate

 * @constructor
 */
export const And3 = function() {
    Component.call(this);

    this.height = 50;
    this.width = 64;

    // Three inputs and one output
    this.addIn(-32, -16, 16);
    this.addIn(-32, 0, 16);
    this.addIn(-32, 16, 16);
    this.addOut(32, 0, 16);
};

And3.prototype = Object.create(Component.prototype);
And3.prototype.constructor = And3;

And3.type = "And3";            ///< Name to use in files
And3.label = "AND";           ///< Label for the palette
And3.desc = "3-Input AND gate";       ///< Description for the palette
And3.order = 11.5;               ///< Order of presentation in the palette
And3.description = '<h2>AND Gate</h2><p>The output of a three-input AND ' +
    'gate is <em>true</em> if all three' +
    ' inputs are true.</p>';
And3.help = 'and3';

/**
 * Compute the gate result
 * @param state
 */
And3.prototype.compute = function(state) {
    if(state[0] && state[1] && state[2]) {
        this.outs[0].set(true);
    } else if(state[0] === undefined || state[1] === undefined || state[2] === undefined) {
        this.outs[0].set(undefined);
    } else {
        this.outs[0].set(false);
    }
};

/**
 * Clone this component object.
 * @returns {And3}
 */
And3.prototype.clone = function() {
    var copy = new And3();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
And3.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    // Left side
    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, botY);

    // Top
    context.moveTo(leftX, topY);
    context.lineTo(rightX - this.height / 2, topY);

    // Bottom
    context.moveTo(leftX, botY);
    context.lineTo(rightX - this.height / 2, botY);
    context.stroke();

    // Arc
    context.beginPath();
    context.arc(rightX - this.height / 2,
        this.y, this.height/2 + 0.5, -Math.PI/2, Math.PI/2);

    // Name
    if(this.naming !== null) {
        context.font = "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x-2, this.y + 5);
    }

    context.stroke();

    this.drawIO(context, view);
};


/**
 * Create a PaletteImage object for an And gate
 */
And3.paletteImage = function() {

    var paletteImage = And.paletteImageBase();
    paletteImage.io(And.leftX, -16, 'w');
    paletteImage.io(And.leftX, 0, 'w');
    paletteImage.io(And.leftX, +16, 'w');

    return paletteImage;
}
