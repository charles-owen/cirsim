import {Component} from '../Component';
import {And} from './And';

/**
 * Component: 4-input AND gate
 * @constructor
 */
export const And4 = function() {
    Component.call(this);

    this.height = 50;
    this.width = 64;

    // Three inputs and one output
    this.addIn(-32, -24, 16);
    this.addIn(-32, -8, 16);
    this.addIn(-32, 8, 16);
    this.addIn(-32, 24, 16);
    this.addOut(32, 0, 16);
};

And4.prototype = Object.create(Component.prototype);
And4.prototype.constructor = And4;

And4.type = "And4";            ///< Name to use in files
And4.label = "AND";           ///< Label for the palette
And4.desc = "4-Input AND gate";       ///< Description for the palette
And4.order = 13;               ///< Order of presentation in the palette
And4.description = '<h2>AND Gate</h2><p>The output of a four-input AND ' +
    'gate is <em>true</em> if all four' +
    ' inputs are true.</p>';
And4.help = 'and4';

/**
 * Compute the gate result
 * @param state
 */
And4.prototype.compute = function(state) {
    if(state[0] && state[1] && state[2] && state[3]) {
        this.outs[0].set(true);
    } else if(state[0] === undefined ||
        state[1] === undefined ||
        state[2] === undefined ||
        state[3] === undefined) {
        this.outs[0].set(undefined);
    } else {
        this.outs[0].set(false);
    }
};

/**
 * Clone this component object.
 * @returns {And4}
 * @memberof And4
 */
And4.prototype.clone = function() {
    var copy = new And4();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
And4.prototype.draw = function(context, view) {
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
And4.paletteImage = function() {

    var paletteImage = And.paletteImageBase();
    var y = paletteImage.height / 2;
    paletteImage.io(And.leftX, -24, 'w');
    paletteImage.io(And.leftX, -8, 'w');
    paletteImage.io(And.leftX, +8, 'w');
    paletteImage.io(And.leftX, +24, 'w');

    return paletteImage;
}
