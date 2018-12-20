/**
 * Simple drawing of a screw head
 * @constructor
 */
export const Screw = function() {
};


Screw.draw = function(context, x, y, radius, angle) {
    var saveFillStyle = context.fillStyle;
    var saveStrokeStyle = context.strokeStyle;

    context.fillStyle = "#dddddd";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#000000";
    context.lineWidth = 0.5;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);

    var dx = Math.cos(angle) * radius;
    var dy = Math.sin(angle) * radius;
    context.moveTo(x - dx, y - dy);
    context.lineTo(x + dx, y + dy);
    context.stroke();

    context.strokeStyle = saveStrokeStyle;
    context.fillStyle = saveFillStyle;
    context.lineWidth = 1;
};
