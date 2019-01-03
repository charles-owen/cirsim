import {Component} from '../Component';

/**
 * Component: Letters16 Special 16 letter display
 * @constructor
 */
export const Letters16 = function() {
    Component.call(this);

    this.height = 150;
    this.width = 90;
    this.value = undefined;

    var len = 11;
    this.addIn(-this.width/2, 0, len, "in").bus = true;
};

Letters16.prototype = Object.create(Component.prototype);
Letters16.prototype.constructor = Letters16;

Letters16.prototype.prefix = "L";
Letters16.prototype.nameRequired = true;

Letters16.type = "letters16";        ///< Name to use in files
Letters16.label = "16 Letter Display";          ///< Label for the palette
Letters16.desc = "16 Letter Display";    ///< Description for the palette
Letters16.img = "letters16.png";       ///< Image to use for the palette
Letters16.description = `<h2>16 Letter Display</h2>
<p>A special display used for Word Sequencing tasks. A 4-bit bus input value 0-15 (0 to f in hex) maps
to the letters indicated in this table:</p>
<table class="center">
<tr><th>Value</th><th>Letter</th></tr>
<tr><td>0</td><td>A</td></tr>
<tr><td>1</td><td>C</td></tr>
<tr><td>2</td><td>D</td></tr>
<tr><td>3</td><td>E</td></tr>
<tr><td>4</td><td>F</td></tr>
<tr><td>5</td><td>H</td></tr>
<tr><td>6</td><td>I</td></tr>
<tr><td>7</td><td>L</td></tr>
<tr><td>8</td><td>M</td></tr>
<tr><td>9</td><td>N</td></tr>
<tr><td>a</td><td>O</td></tr>
<tr><td>b</td><td>R</td></tr>
<tr><td>c</td><td>S</td></tr>
<tr><td>d</td><td>T</td></tr>
<tr><td>e</td><td>U</td></tr>
<tr><td>f</td><td>W</td></tr>
</table>
`;
Letters16.order = 500;


/**
 * Compute the gate result
 * @param state
 */
Letters16.prototype.compute = function(state) {
    if(Array.isArray(state[0])) {
        var v = state[0];
        if(v[0] === undefined || v[1] === undefined || v[2] === undefined || v[3] === undefined) {
            this.value = undefined;
        } else {
            this.value = (v[0] ? 1 : 0) + (v[1] ? 2 : 0) + (v[2] ? 4 : 0) + (v[3] ? 8 : 0);
        }
    } else {
        this.value = undefined;
    }
};

Letters16.prototype.get = function(i) {
    return this.ins[0].value[i];
};


/**
 * Clone this component object.
 * @returns {Letters16}
 */
Letters16.prototype.clone = function() {
    var copy = new Letters16();
    copy.value = this.value;
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Letters16.prototype.draw = function(context, view) {
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

    var letters = ['A', 'C', 'D', 'E', 'F', 'H', 'I', 'L',
        'M', 'N', 'O', 'R', 'S', 'T', 'U', 'W'];
    var letter = this.value === undefined ? '?' : letters[this.value];

    context.beginPath();
    context.font = "60px Arial";
    context.textAlign = "center";
    context.strokeStyle = "#008800";
    context.fillStyle = context.strokeStyle;
    context.fillText(letter, this.x, this.y + 20);
    context.stroke();

    // Restore
    //
    context.lineWidth = 1;
    context.fillStyle = saveFillStyle;
    context.strokeStyle = saveStrokeStyle;

    this.drawName(context, 0, this.height/2 - 8);
    this.drawIO(context, view);
};
