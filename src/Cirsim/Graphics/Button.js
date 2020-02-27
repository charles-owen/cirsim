import {CanvasHelper} from './CanvasHelper';

/**
 * Construct a display button
 * @param label Label to display on the button
 * @param value Value of the button
 * @param x Center of the button
 * @param y Center of the button
 * @constructor
 */
export const Button = function(label, value, x, y, size) {

    this.label = label;
    this.value = value;
    this.x = x;
    this.y = y;

    this.size = size === undefined ? 30 : size;
    this.state = 'off';


}

Button.prototype.touch = function(x, y) {
    const size = this.size;

    if(x > this.x - size/2 && x < this.x + size/2 &&
        y > this.y - size/2 && y < this.y + size/2) {
        this.state = 'pressed';
        return true;
    }

    return false;
}

Button.prototype.setState = function(state) {
    this.state = state;
}

Button.prototype.untouch = function() {
    if(this.state === 'pressed') {
        this.state = 'on';
        return true;
    }

    return false;
}

Button.prototype.draw = function(context, x, y) {
    const saveFillStyle = context.fillStyle;
    const saveStrokeStyle = context.strokeStyle;

    x += this.x;
    y += this.y;
    const size = this.size;
    const textSize = size * 0.85;

    // ff5255
    switch(this.state) {
        case 'off':
        default:
            context.fillStyle = '#3ab5de';
            break;

        case 'pressed':
            context.fillStyle = '#ff5255';
            break;

        case 'on':
            context.fillStyle = '#0000ff';
            break;
    }

    const radius = 3;

    CanvasHelper.roundedRect(context, x - size/2, y - size/2, size, size, radius);
    context.fill();

    context.lineWidth = 2;
    context.strokeStyle = '#f2f2f2';

    CanvasHelper.roundedRect(context, x - size/2, y - size/2, size, size, radius);
    context.stroke();

    context.font = '' + textSize + 'px Arial';
    context.textAlign = "center";
    context.fillStyle = '#f2f2f2';
    context.fillText(this.label, x, y + textSize * 0.38);

    // Restore
    context.lineWidth = 1;
    context.fillStyle = saveFillStyle;
    context.strokeStyle = saveStrokeStyle;
}
