/**
 * General purpose object for 2D vectors.
 *
 * Points are represented with x,y properties:
 * var p = {x: 23, y: -7.3};
 * @param x
 * @param y
 * @constructor
 */
export const Vector = function(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Normalize a vector
 */
Vector.prototype.normalize = function() {
    var len = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= len;
    this.y /= len;
};

Vector.normalize = function(vector) {
    var len = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return new Vector(vector.x / len, vector.y / len);
};

/**
 * Rotate a vector by some angle
 * @param vector Vector to rotate
 * @param angle Angle rotate by (radians)
 * @returns {Vector} New vector result
 */
Vector.rotate = function(vector, angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    return new Vector(c * vector.x - s * vector.y,
                        s * vector.x + c * vector.y);
};

/**
 * Compute the nearest distance to a line defined
 * a ax + by + c.
 * @param p Vector
 * @param a scalar
 * @param b scalar
 * @param c scalar
 */
Vector.distanceToLine = function(p, a, b, c) {
    if(a == 0) {
        // Horizontal line
        return Math.abs( (b * p.y + c) / b );
    } else if(b == 0) {
        // Vertical line
        return Math.abs( (a * p.x + c) / a);
    } else {
        return Math.abs(a * p.x + b * p.y + c) / Math.sqrt(a * a + b * b);
    }
};

/**
 * Compute the nearest distance to a line defined
 * by two points
 * @param p Vector
 * @param p1 First point (Vector)
 * @param p2 Second point (Vector)
 */
Vector.distanceToLineP2 = function(p, p1, p2) {
    return Vector.distanceToLine(p,
        (p1.y - p2.y), (p2.x - p1.x), (p1.x * p2.y - p2.x * p1.y));
};

/**
 * Compute the nearest point on a line defined
 * a ax + by + c.
 * @param p Vector
 * @param a
 * @param b
 * @param c
 */
Vector.nearestOnLine = function(p, a, b, c) {
    if(a == 0) {
        // Horizontal line
        return {x: p.x, y: -c/b};
    } else if(b == 0) {
        // Vertical line
        return {x: -c/a, y: p.y};
    } else {
        return {
            x: (b * (b * p.x - a * p.y) - a * c) / (a * a + b * b),
            y: (a * (-b * p.x + a * p.y) - b * c) / (a * a + b * b)
        }
    }
};

/**
 * Compute the nearest point on a line defined
 * using two points p1, p2.
 * @param p Vector
 * @param p1
 * @param p2
 * @returns {{x, y}}
 */
Vector.nearestOnLineP2 = function(p, p1, p2) {
    return Vector.nearestOnLine(p,
        (p1.y - p2.y), (p2.x - p1.x), (p1.x * p2.y - p2.x * p1.y));
};

/**
 * For the line segment [p1, p2], compute the t value.
 * t=0 for p1, t=1 for p2, t=[0,1] is on the line segment.
 * @param p Vector
 * @param p1
 * @param p2
 */
Vector.computeT = function(p, p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    if(Math.abs(dx) > Math.abs(dy)) {
        // Line is more horizontal than vertical
        return (p.x - p1.x) / dx;
    } else {
        return (p.y - p1.y) / dy;
    }
};

/**
 * Compute distance between two points.
 * @param p1
 * @param p2
 */
Vector.distance = function(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) +
        (p2.y - p1.y) * (p2.y - p1.y));
};

/**
 * Determine the distance from a point to the nearest
 * location on a line segement.
 * @param p Point to test (Vector)
 * @param p1
 * @param p2
 * @return Object with: d: distance, p (x,y) nearest point.
 */
Vector.distanceToLineSegment = function(p, p1, p2) {
    // What is the nearest point on the line through
    // p1 and p2?
    var n = Vector.nearestOnLineP2(p, p1, p2);

    // Is n in the line segment?
    var t = Vector.computeT(n, p1, p2);
    if(t >= 0 && t <= 1) {
        return {d : Vector.distance(p, n), p : n};
    }

    // Determine nearest end point
    var d1 = Vector.distance(p, p1);
    var d2 = Vector.distance(p, p2);
    if(d1 < d2) {
        return {d : d1, p : p1};
    } else {
        return {d : d2, p: p2};
    }
};

export default Vector;

