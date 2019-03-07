import {Component} from '../Component';
import {Led} from '../Graphics/Led'
import {ComponentPropertiesDlg} from "../Dlg/ComponentPropertiesDlg";
import {Sanitize} from "../Utility/Sanitize";

/**
 * Component: OutPin output pin

 * @constructor
 */
export const OutPin = function() {
    Component.call(this);

    this.height = 16;
    this.width = 64;
    this.color = 'green';

    this.led = new Led(-19, 0, 7);

    // One input
    this.addIn(-32, 0, 16);
};

OutPin.prototype = Object.create(Component.prototype);
OutPin.prototype.constructor = OutPin;

OutPin.prototype.prefix = "O";
OutPin.prototype.nameRequired = true;

OutPin.type = "OutPin";        ///< Name to use in files
OutPin.label = "Out Pin";          ///< Label for the palette
OutPin.desc = "Output Pin";    ///< Description for the palette
OutPin.img = "outpin.png";       ///< Image to use for the palette
OutPin.order = 3;             ///< Order of presentation in the palette
OutPin.description = `<h2>Ouput Pin</h2><p>An OUT pin serves as output 
for a circuit. The LED indicates if the input is true (led illuminated), false 
(black), or undefined (?).</p>`;
OutPin.help = 'outpin';

/**
 * This function is called when an input is changed on this
 * component.
 *
 * There is no delay for an output pin
 */
OutPin.prototype.pending = function() {
};


OutPin.prototype.get = function() {
    return this.ins[0].value;
};

OutPin.prototype.getAsString = function() {
    switch(this.ins[0]) {
        case true:
            return "1";

        case false:
            return "0";

        default:
            return "?";
    }
};


/**
 * Clone this component object.
 * @returns {OutPin}
 */
OutPin.prototype.clone = function() {
    var copy = new OutPin();
    copy.color = this.color;
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
OutPin.prototype.load = function(obj) {
    if(obj['color'] !== undefined) {
        this.color = Sanitize.sanitize(obj["color"]);
    }

    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
OutPin.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    if(this.color !== 'green') {
        obj.color = this.color;
    }
    return obj;
};


/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
OutPin.prototype.draw = function(context, view) {
    const value = this.get();

    // Component background
    const background = this.value ? "white" : "#dddddd";
    this.outlinePath(context);
    context.fillStyle = background;
    context.fill();

    if(this.color !== 'none') {
        // LED
        this.led.color = value === undefined ? "undefined" : (value ? this.color : "off");
        this.led.draw(context, this.x, this.y, background);
    }

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    this.outlinePath(context);
    context.stroke();

    // Name
    context.beginPath();
    context.font = "14px Times";
    context.textAlign = "center";


    if(this.color !== 'none') {
        const val = value === undefined ? "?" : (value ? "1" : "0");
        const x = this.x + 9;
        if(this.naming !== null) {
            context.fillText(this.naming + ": " + val, x, this.y + 5);
        } else {
            context.fillText(val, x, this.y + 5);
        }
    } else {
        const x = this.x + 4;
        if(this.naming !== null) {
            context.fillText(this.naming, x, this.y + 5);
        }
    }

    this.drawIO(context, view);
};

OutPin.prototype.outlinePath = function(context) {
    const leftX = this.x - this.width/2 - 0.5;
    const rightX = this.x + this.width/2 + 0.5;
    const topY = this.y - this.height/2 - 0.5;
    const botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX, this.y);
    context.lineTo(leftX + this.height/2, botY);
    context.lineTo(rightX, botY);
    context.lineTo(rightX, topY);
    context.lineTo(leftX + this.height/2, topY);
    context.lineTo(leftX, this.y);
};

OutPin.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);

    let html = `<div class="control1 center">`;
    // Color
    const colorId = dlg.uniqueId();
    html += Led.colorSelector(colorId, this.color, true);

    html += '</div>';

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.color = Sanitize.sanitize(document.getElementById(colorId).value);
    });

    dlg.open();
};

