import {Component} from '../Component';
import {Led} from '../Graphics/Led'
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: InPin gate

 * @constructor InPin
 */
export const InPin = function() {
    Component.call(this);

    this.height = 16;
    this.width = 64;

    this.led = new Led(19, 0, 7);

    // One output
    this.addOut(32, 0, 16);
    this.set(false);
};

InPin.prototype = Object.create(Component.prototype);
InPin.prototype.constructor = InPin;

// The special symbol * means letters
InPin.prototype.prefix = "*I";
InPin.prototype.nameRequired = true;

InPin.type = "InPin";        ///< Name to use in files
InPin.label = "In Pin";          ///< Label for the palette
InPin.desc = "Input Pin";    ///< Description for the palette
InPin.img = "inpin.png";       ///< Image to use for the palette
InPin.order = 2;             ///< Order of presentation in the palette
InPin.description = '<h2>Input Pin</h2><p>An IN pin serves as input ' +
    'for a circuit. Clicking the LED toggles the output true or false.</p>';
InPin.help = 'inpin';
/**
 * Clone this component object.
 * @returns {InPin}
 */
InPin.prototype.clone = function() {
    var copy = new InPin();
    copy.value = this.value;
    copy.copyFrom(this);
    return copy;
};

InPin.prototype.compute = function(state) {
    this.outs[0].set(this.value);
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
InPin.prototype.draw = function(context, view) {
    // Component background
    var background = this.value ? "white" : "#dddddd";
    this.outlinePath(context);
    context.fillStyle = background;
    context.fill();

    // LED
    this.led.color = this.value ? "green" : "off";
    this.led.draw(context, this.x, this.y, background);

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    this.outlinePath(context);
    context.stroke();

    // Name
    context.beginPath();
    context.font = "14px Times";
    context.textAlign = "center";

    var val = this.value ? "1" : "0";
    var x = this.x - 9;
    if(this.naming !== null) {
        context.fillText(this.naming + ": " + val, x, this.y + 5);
    } else {
        context.fillText(val, x, this.y + 5);
    }

    this.drawIO(context, view);
};

InPin.prototype.outlinePath = function(context) {
    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, botY);
    context.lineTo(rightX - this.height/2, botY);
    context.lineTo(rightX, this.y);
    context.lineTo(rightX - this.height/2, topY);
    context.lineTo(leftX, topY);
};

InPin.prototype.touch = function(x, y) {
    if(this.led.touch(this.x, this.y, x, y)) {
        this.circuit.circuits.model.backup();
        this.set(!this.value);
        return null;
    }

    var touched = Component.prototype.touch.call(this, x, y);
    return touched;
};

/**
 * Set the value for the input
 * @param value true for on
 */
InPin.prototype.set = function(value) {
    if (typeof value === 'string' || value instanceof String) {
        this.setAsString(value);
    } else {
        this.value = value;
        this.outs[0].set(value);
    }
};

/**
 * Set the value of an input from a string.
 * Accepts the following possible values.
 *
 * For undefined: undefined, '?', 'undefined'
 * For true: true, '1', 1, 'true'
 * For false: false, '0', false', 0
 *
 * @param value
 */
InPin.prototype.setAsString = function(value) {
    switch(value) {
        case undefined:
        case 'undefined':
        case '?':
            this.set(undefined);
            break;

        case 'false':
        case '0':
        case false:
            this.set(false);
            break;

        case 'true':
        case '1':
        case true:
            this.set(true);
            break;

        default:
            const v = +value === 1;
            this.set(v);
            break;
    }
}

InPin.prototype.get = function() {
    return this.value;
};

/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
InPin.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.value = this.value;
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
InPin.prototype.load = function(obj) {
    this.set(obj["value"]);
    Component.prototype.load.call(this, obj);
};

InPin.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const id = dlg.uniqueId();


    let html = '<div class="control center"><div class="choosers">' +
        '<label><input type="radio" id="' + id + '" value="1" name="' + id + '"' +
        (this.value ? " checked" : "") +
        '> true (1)</label>' +
        '<label><input type="radio" id="' + id + '" value="0" name="' + id + '"' +
        (this.value ? "" : " checked") +
        '> false (0)</label>' +
        '</div></div>';

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.set(document.querySelector('#' + id + ':checked').value === "1");
    });

    dlg.open();
};
