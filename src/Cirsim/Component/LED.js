
import {Component} from '../Component';
import {Led} from '../Graphics/Led'
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Sanitize} from '../Utility/Sanitize';

/**
 * Component: LED
 * @param name Component name
 * @constructor
 */
export const LED = function(name) {
    Component.call(this, name);

    this.height = 32;
    this.width = 32;
    this.value = undefined;

    this.led = new Led(0, 0, 12);

    this.color = "blue";

    // One input
    this.addIn(-16, 0, 16);
};

LED.prototype = Object.create(Component.prototype);
LED.prototype.constructor = LED;

LED.prototype.prefix = "L";
LED.prototype.nameRequired = true;

LED.type = "LED";        ///< Name to use in files
LED.label = "LED";          ///< Label for the palette
LED.desc = "Light Emitting Diode";    ///< Description for the palette
LED.img = "led.png";       ///< Image to use for the palette
LED.order = 31;             ///< Order of presentation in the palette
LED.description = '<h2>LED</h2><p>An LED indicates if the input is true (color), false ' +
    '(black), or undefined (?). The LED color can be set using the component properties dialog' +
    ' box.</p>';


/**
 * Compute the gate result
 * @param state
 */
LED.prototype.compute = function(state) {
    this.value = state[0];
};

LED.prototype.get = function() {
    return this.ins[0].value;
};


/**
 * Clone this component object.
 * @returns {LED}
 */
LED.prototype.clone = function() {
    var copy = new LED();
    copy.color = this.color;
    copy.value = this.value;
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
LED.prototype.draw = function(context, view) {
    var value = this.get();

    var leftX = this.x - this.width/2 - 0.5;
    var topY = this.y - this.height/2 + 0.5;

    // Select the style
    this.selectStyle(context, view);

    var saveFillStyle = context.fillStyle;
    var saveStrokeStyle = context.strokeStyle;

    //
    // Button background
    //
    var background = value ? "#ffffff" : "#dddddd";
    context.fillStyle = background;
    context.fillRect(leftX, topY, this.width, this.height);

    // Border
    context.fillStyle = saveFillStyle;
    context.beginPath();
    context.rect(leftX, topY, this.width, this.height);
    context.stroke();

    //
    // Restore
    //
    context.lineWidth = 1;
    context.fillStyle = saveFillStyle;
    context.strokeStyle = saveStrokeStyle;

    // LED
    this.led.color = value === undefined ? "undefined" : (value ? this.color : "off");
    this.led.draw(context, this.x-0.5, this.y, background);

    var edge = 12;
    context.fillRect(this.x - edge - 2, this.y - edge, 2, 2);
    context.fillRect(this.x + edge - 2, this.y - edge, 2, 2);
    context.fillRect(this.x - edge - 2, this.y + edge, 2, 2);
    context.fillRect(this.x + edge - 2, this.y + edge, 2, 2);

    this.drawIO(context, view);
};

LED.prototype.outlinePath = function(context) {
    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX, this.y);
    context.lineTo(leftX + this.height/2, botY);
    context.lineTo(rightX, botY);
    context.lineTo(rightX, topY);
    context.lineTo(leftX + this.height/2, topY);
    context.lineTo(leftX, this.y);
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
LED.prototype.load = function(obj) {
    this.color = Sanitize.sanitize(obj["color"]);
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
LED.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.color = this.color;
    return obj;
};

LED.prototype.properties = function(main) {
    let dlg = new ComponentPropertiesDlg(this, main, false);
    let colorId = dlg.uniqueId();

    let html = Led.colorSelector(colorId, this.color);

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.color = Sanitize.sanitize(document.getElementById(colorId).value); // $('#' + colorId).val());
    });

    dlg.open();
};
