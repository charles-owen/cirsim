/**
 * The components collection for Cirsim
 * @constructor
 */
export const Components = function() {

    this.components = [];
    this.palettes = {};

    /**
     * Add a component to the collection of available component objects
     * @param component Component object
     */
    this.add = function(component) {
        this.components.push(component);
        this.components.sort(function(a, b) {
            return a.order - b.order;
        });
    };

    /**
     * Get a component prototype by type
     * @param type Type name to find
     * @returns Component object or null.
     */
    this.get = function(type) {
        for(var i=0; i<this.components.length; i++) {
            if(this.components[i].type === type) {
                return this.components[i];
            }
        }

        return null;
    };

    /**
     * Add a palette of components by name.
     * @param name Name to refer to the palette
     * @param components Array of component objects.
     */
    this.addPalette = function(name, components) {
        var names = [];
        for(var i=0; i<components.length; i++) {
            names.push(components[i].type);
        }

        this.palettes[name] = names;
    }

    this.getPalette = function(name) {
        if(this.palettes.hasOwnProperty(name)) {
            return this.palettes[name];
        }

        return null;
    }
}

export default Components;

