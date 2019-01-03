import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Vector} from '../Utility/Vector';

/**
 * Component: SevenSeg Seven Segment display
 */
export const SevenSeg = function() {
    Component.call(this);

    this.height = 150;
    this.width = 90;
    this.value = [undefined, undefined, undefined, undefined, undefined, undefined, undefined];

    this.color = "green";

    // Seven inputs plus enable
    var y = -16 * 4;
    var len = 11;

    this.addIn(-this.width/2, y, len, "a");
    y += 16;
    this.addIn(-this.width/2, y, len, "b");
    y += 16;
    this.addIn(-this.width/2, y, len, "c");
    y += 16;
    this.addIn(-this.width/2, y, len, "d");
    y += 16;
    this.addIn(-this.width/2, y, len, "e");
    y += 16;
    this.addIn(-this.width/2, y, len, "f");
    y += 16;
    this.addIn(-this.width/2, y, len, "g");
    y += 16;

    y += 16;
    this.addIn(-this.width/2, y, len, "en");
};

SevenSeg.prototype = Object.create(Component.prototype);
SevenSeg.prototype.constructor = SevenSeg;

SevenSeg.prototype.prefix = "L";
SevenSeg.prototype.nameRequired = true;

SevenSeg.type = "7seg";        ///< Name to use in files
SevenSeg.label = "7 SEG";          ///< Label for the palette
SevenSeg.desc = "7 Segment Display";    ///< Description for the palette
SevenSeg.img = "7seg.png";       ///< Image to use for the palette
SevenSeg.order = 40;             ///< Order of presentation in the palette
SevenSeg.description = '<h2>7 Seg</h2><p>A 7 segment display has seven different display' +
    ' positions that can be set independently to make numbers and other characters. The en (enable) pin' +
    ' enables the display if true or if not connected.</p>';


/**
 * Compute the gate result
 * @param state
 */
SevenSeg.prototype.compute = function(state) {
    if(state[7] === false) {
        for(var i=0; i<7; i++) {
            this.value[i] = false;
        }
    } else {
        for(var i=0; i<7; i++) {
            this.value[i] = state[i];
        }
    }
};

SevenSeg.prototype.get = function(i) {
    return this.ins[0].value[i];
};


/**
 * Clone this component object.
 * @returns {SevenSeg}
 */
SevenSeg.prototype.clone = function() {
    var copy = new SevenSeg();
    copy.color = this.color;
    copy.value = this.value.slice();
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
SevenSeg.prototype.draw = function(context, view) {
    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    // Select the style
    this.selectStyle(context, view);

    var saveFillStyle = context.fillStyle;
    var saveStrokeStyle = context.strokeStyle;

    //
    // Background
    //
    context.fillStyle = "#cccccc";
    context.fillRect(leftX, topY, this.width, this.height);

    // Border
    context.fillStyle = saveFillStyle;
    context.beginPath();
    context.rect(leftX, topY, this.width, this.height);
    context.stroke();

    var border = 0.2 * this.width;
    var gap = 0.02 * this.width;
    leftX += border + 5;
    rightX -= border;
    topY += border;
    botY -= border;

    context.font = "11px Times";
    context.textAlign = "center";

    this.drawSegment(context, this.value[0], {x: leftX + gap, y: topY}, {x: rightX - gap, y: topY}, 'a');
    this.drawSegment(context, this.value[1], {x: rightX, y: topY + gap}, {x: rightX, y: this.y - gap},'b');
    this.drawSegment(context, this.value[2], {x: rightX, y: this.y + gap}, {x: rightX, y: botY - gap}, 'c');
    this.drawSegment(context, this.value[3], {x: rightX - gap, y: botY}, {x: leftX + gap, y: botY}, 'd');
    this.drawSegment(context, this.value[4], {x: leftX, y: botY - gap}, {x: leftX, y: this.y + gap}, 'e');
    this.drawSegment(context, this.value[5], {x: leftX, y: this.y - gap}, {x: leftX, y: topY + gap}, 'f');
    this.drawSegment(context, this.value[6], {x: leftX + gap, y: this.y}, {x: rightX - gap, y: this.y}, 'g');

    //
    // Restore
    //
    context.lineWidth = 1;
    context.fillStyle = saveFillStyle;
    context.strokeStyle = saveStrokeStyle;

    this.drawIO(context, view);
};

SevenSeg.prototype.drawSegment = function(context, value, fm, to, letter) {
    var dir = new Vector(to.x - fm.x, to.y - fm.y);
    var dir1 = Vector.normalize(dir);
    dir1 = Vector.rotate(dir1, Math.PI/4);
    var dir2 = Vector.rotate(dir1, Math.PI/2);

    var wid = 10;
    var elen = wid * 0.707;

    if(value) {
        switch(this.color) {
            case "red":
                context.fillStyle = "#fe0501";
                break;

            case "blue":
                context.fillStyle = "#15ddff"; // "#3dffff";
                break;

            default:    // green
                context.fillStyle = "#00fb4a"; // "#00fb4a"; // "#78f71e";
                break;
        }
    } else {
        context.fillStyle = "#444444";
    }

    context.strokeStyle = "#222222";

    context.beginPath();
    context.moveTo(fm.x, fm.y);
    context.lineTo(fm.x + elen * dir1.x, fm.y + elen * dir1.y);
    context.lineTo(to.x + elen * dir2.x, to.y + elen * dir2.y);
    context.lineTo(to.x, to.y);
    context.lineTo(to.x - elen * dir1.x, to.y - elen * dir1.y);
    context.lineTo(fm.x - elen * dir2.x, fm.y - elen * dir2.y);
    context.lineTo(fm.x, fm.y);
    context.fill();
    context.stroke();

    var mid = new Vector((to.x + fm.x)/2, (to.y + fm.y)/2);
    var dir3 = Vector.rotate(Vector.normalize(dir), Math.PI/2);
    var offset = 10;
    context.fillStyle = "#000000";
    context.fillText(letter, mid.x + dir3.x * offset, mid.y + dir3.y * offset + 2);

    if(value === undefined) {
        context.fillStyle = "#00ffff";
        context.fontWeight = "bolder";
        context.fillText("?", mid.x, mid.y + 3);
        context.fontWeight = "normal";
    }
};


/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
SevenSeg.prototype.load = function(obj) {
    this.color = obj["color"];
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
SevenSeg.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.color = this.color;
    return obj;
};

SevenSeg.prototype.properties = function(main) {
    var that = this;

    var dlg = new ComponentPropertiesDlg(this, main, false);
    var id = dlg.uniqueId();
    var colors = ['red', 'green', 'blue'];
    var html = '<div class="control1 center"><label for="' + id + '">Color: </label><select id="' + id + '">';
    colors.forEach(function(color) {
        if(color === that.color) {
            html += '<option selected>' + color + '</option>';
        } else {
            html += '<option>' + color + '</option>';
        }

    });
    html += '</select></div>';

    dlg.extra(html, function() {
        return null;
    }, function() {
        that.color = document.getElementById(id).value;
    });

    dlg.open();
};
