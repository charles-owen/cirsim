import {Component} from '../Component';
import {Screw} from '../Graphics/Screw';
import {Vector} from '../Utility/Vector';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: Button than can be pressed by the user

 * @constructor
 */
export const Button = function() {
    Component.call(this);

    // Size
    this.height = 50;
    this.width = 50;
    this.buttonSize = 40;

    this.value = false;
    this.color = 'blue';

    // One output
    this.addOut(this.width/2, 0, 48 - this.width/2);
    this.set(false);
};

Button.prototype = Object.create(Component.prototype);
Button.prototype.constructor = Button;

Button.prototype.prefix = "B";
Button.type = "Button";        ///< Name to use in files
Button.label = "Button";          ///< Label for the palette
Button.desc = "Push Button";    ///< Description for the palette
Button.img = "button.png";       ///< Image to use for the palette
Button.order = 100;             ///< Order of presentation in the palette
Button.description = '<h2>Push Button</h2><p>Clicking the button turns on' +
    ' the output (true), while releasing turns it off.</p>';

/**
 * Clone this component object.
 * @returns {Button}
 */
Button.prototype.clone = function() {
    var copy = new Button();
    copy.value = this.value;
    copy.color = this.color;
    copy.copyFrom(this);
    return copy;
};

Button.prototype.compute = function(state) {
    this.outs[0].set(this.value);
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Button.prototype.load = function(obj) {
    this.color = obj["color"] !== undefined ? obj["color"] : 'blue';
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
Button.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.color = this.color;
    return obj;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Button.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var topY = this.y - this.height/2 + 0.5;

    var saveFillStyle = context.fillStyle;
    var saveStrokeStyle = context.strokeStyle;

    //
    // Button background
    //
    context.fillStyle = "#cccccc";
    context.fillRect(leftX, topY, this.width, this.height);

    // Border
    context.fillStyle = saveFillStyle;
    context.beginPath();
    context.rect(leftX, topY, this.width, this.height);
    context.stroke();

    switch(this.color) {
        case 'blue':
        default:
            var color = ["#25ffff", "#15ddff", "#00d5d4"];
            break;

        case 'green':
            var color = ["#25ff25", "#15ff00", "#00d500"];
            break;
    }
    // The button
    let r = 16;
    if(this.value) {
        var grd = context.createRadialGradient(this.x, this.y, 1, this.x, this.y, r);
        grd.addColorStop(0, color[0]);
        grd.addColorStop(0.5, color[1]);
        grd.addColorStop(1, color[2]);
        context.fillStyle = grd;
    } else {
        context.fillStyle = "#888888";
    }

    context.beginPath();
    context.arc(this.x, this.y, r, 0, Math.PI * 2);
    context.fill();

    //
    // Button Border
    //
    context.strokeStyle = "#000000";
    context.beginPath();
    context.arc(this.x, this.y, 17, 0, Math.PI * 2);
    context.lineWidth = 4;
    context.stroke();

    //
    // Restore
    //
    context.lineWidth = 1;
    context.fillStyle = saveFillStyle;
    context.strokeStyle = saveStrokeStyle;

    // Screws
    var s = 18;
    Screw.draw(context, this.x - s, this.y - s, 3, 0.3);
    Screw.draw(context, this.x - s, this.y + s, 3, 1.3);
    Screw.draw(context, this.x + s, this.y - s, 3, 2.3);
    Screw.draw(context, this.x + s, this.y + s, 3, 0.7);

    this.drawIO(context, view);
};


Button.prototype.touch = function(x, y) {
    if(Vector.distance(new Vector(x, y), new Vector(this.x, this.y)) < 16) {
        this.set(true);
        return null;
    }

    return Component.prototype.touch.call(this, x, y);
};

Button.prototype.mouseUp = function() {
    this.set(false);
};

/**
 * Set the value for the input
 * @param value true for on
 */
Button.prototype.set = function(value) {
    this.value = value;
    this.outs[0].set(value);
};

Button.prototype.setAsString = function(value) {
    var v = +value === 1;
    this.set(v);
}

Button.prototype.get = function() {
    return this.value;
};

Button.prototype.properties = function(main) {
    var that = this;

    var dlg = new ComponentPropertiesDlg(this, main, false);
    var id = dlg.uniqueId();

    var colors = ['green', 'blue'];
    var html = '<div class="control1 center"><label for="' + id + '">Color: </label><select id="' + id + '">';
    colors.forEach((color) => {
        if(color === that.color) {
            html += '<option selected>' + color + '</option>';
        } else {
            html += '<option>' + color + '</option>';
        }

    });
    html += '</select></div>';

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.color = document.getElementById(id).value;
    });

    dlg.open();
};
