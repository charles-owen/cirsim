/**
 * Convenience class for generating unique Cirsim-specific ID's
 * @constructor
 */
export const Unique = function() {
}

Unique.unique = 1;

Unique.uniqueId = function() {
    return Unique.unique++;
}

Unique.uniqueName = function() {
    return "cirsim-id-" + Unique.unique++;
}

export default Unique;
