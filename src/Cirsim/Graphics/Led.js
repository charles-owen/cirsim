import {Vector} from '../Utility/Vector';

/**
 * Object that simulates an LED
 */
export const Led = function(x, y, param1, param2) {
    this.x = x;
    this.y = y;
    this.color = "undefined";

    if(param2 === undefined) {
        // Round LED
        this.radius = param1;
        this.width = param1 * 2;
        this.height = param1 * 2;
    } else {
        // Rectangular LED
        this.radius = null;
        this.width = param1;
        this.height = param2;
    }
};

Led.colors = {
    black: ['#000000', '#000000'],
    undefined: ['#444444', '#888888'],
    green: ['#55ff88', "#00fb4a"],
    red: ["#ff4444", "#ff0000"],
    blue: ["#25ffff", "#15ddff"],
    purple: ["#c000ff", "#8000ff"],
    yellow: ["#ffff00", "#ffff80"],
    none: ['#000000', '#000000']
};

Led.prototype.draw = function(context, x, y, background) {
    if(this.color === 'none') {
        return;
    }

    let saveFill = context.fillStyle;

    if(background === undefined) {
        background = "white";
    }

    context.beginPath();
    x += this.x;
    y += this.y;
    let r = this.radius * 1.15;

    let color1, color2;

    if(Led.colors.hasOwnProperty(this.color)) {
        color1 = Led.colors[this.color][0];
        color2 = Led.colors[this.color][1];
    } else {
        color1 = '#000000';
        color2 = '#000000';
    }

    if(this.radius !== null) {
        let grd = context.createRadialGradient(x, y, 1, x, y, r);
        grd.addColorStop(0, color1);
        grd.addColorStop(0.5, color2);
        grd.addColorStop(1, background);
        context.fillStyle = grd;
    } else {
        let grd = context.createLinearGradient(0, y-this.height/2, 0, y+this.height/2);
        grd.addColorStop(0, background);
        grd.addColorStop(0.25, color1);
        grd.addColorStop(0.75, color1);
        grd.addColorStop(1, background);
        context.fillStyle = grd;
    }

    context.fillRect(x-this.width/2, y-this.height/2, this.width, this.height);


    if(this.color === "undefined") {
        context.font = "14px Times";
        context.fillStyle = "#ffffff"; // "#00ffff";
        context.fontWeight = "bold";
        context.textAlign = "center";
        context.fillText("?", x, y + 5);
        context.fillText("?", x+1, y + 5);
        context.fontWeight = "normal";
    }

    context.fillStyle = saveFill;
};

Led.prototype.touch = function(x, y, touchX, touchY) {
    x += this.x;
    y += this.y;

    return (Vector.distance({x: x, y: y}, {x: touchX, y: touchY}) <= this.radius);
};

/**
 * Create an HTML selector for LED colors.
 * @param id ID to apply to the selector
 * @param current Current value (selected)
 * @param allowNone If true, allow the color 'none'
 * @returns {string}
 */
Led.colorSelector = function(id, current, allowNone=false) {
    let html = '<div class="control1 center"><label for="' + id + '">Color: </label><select id="' + id + '">';

    let colors = Led.colors;
    for(const color in colors) {
        if(!colors.hasOwnProperty(color)) {
            continue;
        }

        if(color === 'black' || color === 'undefined') {
            continue;
        }

        if(allowNone !== true && color === 'none') {
            continue;
        }

        if(color === current) {
            html += '<option selected>' + color + '</option>';
        } else {
            html += '<option>' + color + '</option>';
        }
    }

    html += '</select></div>';
    return html;
}

