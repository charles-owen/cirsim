import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Value} from '../Value';
import {Sanitize} from '../Utility/Sanitize';

/**
 * Component: OutPinBus gate
 */
export const OutPinBus = function() {
    Component.call(this);

    this.value = new Value();
    this.narrow = false;

    this.height = 16;
    this.width = 96;

    // One input
    this.addIn(-this.width/2, 0, 16).bus = true;
};

OutPinBus.prototype = Object.create(Component.prototype);
OutPinBus.prototype.constructor = OutPinBus;

OutPinBus.prototype.prefix = "O";
OutPinBus.prototype.nameRequired = true;

OutPinBus.type = "OutPinBus";         ///< Name to use in files
OutPinBus.label = "Bus Out";          ///< Label for the palette
OutPinBus.desc = "Bus Output Pin";    ///< Description for the palette
OutPinBus.img = "outpinbus.png";      ///< Image to use for the palette
OutPinBus.order = 101;                ///< Order of presentation in the palette
OutPinBus.description = `<h2>Bus Output Pin</h2>
<p>An Bus Out pin serves as output for a bus in a circuit.</p>
<p>The output format is selectable. Auto format will display values 
with eight or fewer digits as binary and larger values in hex.</p>`;
OutPinBus.help = 'outpinbus';

/**
 * Compute the result
 * @param state
 */
OutPinBus.prototype.compute = function(state) {
    this.value.set(state[0]);
}

OutPinBus.prototype.get = function() {
    return this.value.get();
};

OutPinBus.prototype.getAsString = function() {
    return this.value.getAsString();
};

/**
 * Clone this component object.
 * @returns {OutPinBus}
 */
OutPinBus.prototype.clone = function() {
    var copy = new OutPinBus();
    copy.copyFrom(this);
    copy.value = this.value.clone();
    return copy;
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
OutPinBus.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    this.value.save(obj);
    if(this.narrow) {
        obj.narrow = this.narrow;
    }
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
OutPinBus.prototype.load = function(obj) {
    this.value.load(obj);
    this.setNarrow(Sanitize.boolean(obj.narrow));
    Component.prototype.load.call(this, obj);
};


/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
OutPinBus.prototype.draw = function(context, view) {
    // Component background
    this.outlinePath(context);
    context.fillStyle = "#dddddd";
    context.fill();

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    this.outlinePath(context);
    context.stroke();

    let x = this.x + this.height / 4;
    if(this.narrow) {
        // Some adjustments of the X location
        // to make the narrow presentation look nicer
        x = x - 2;
    }

    this.value.draw(context,
        x,
        this.y,
        this.width - this.height / 2,
        this.naming);

    this.drawIO(context, view);
};

OutPinBus.prototype.outlinePath = function(context) {
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


OutPinBus.prototype.properties = function(main) {
    let dlg = new ComponentPropertiesDlg(this, main);
    let id = dlg.uniqueId();


    let content = this.value.dialogContent(dlg);
    let html = content.html + `<input type="checkbox" id="${id}" name="${id}"${this.narrow ? " checked" : ""}> <label for="${id}">Narrow</label>`;

    dlg.extra(html, content.validate, () => {
        content.accept();

	    this.setNarrow(document.getElementById(id).checked);
    });

    dlg.open();
};

OutPinBus.prototype.setNarrow = function(narrow) {
    this.narrow = narrow;
    this.width = narrow ? 48 : 96;
    this.ins[0].x = -this.width/2;
}

export default OutPinBus;
