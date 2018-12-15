/**
 * @file
 * The pallet div where we select parts to add to the circuit
 */

import {PaletteItem} from './PaletteItem';
import {Tools} from './DOM/Tools';

export const Palette = function(main, work) {
    const that = this;

    this.main = main;
    this.cirsim = main.cirsim;
    this.palette = [];

    const div = Tools.createClassedDiv('palette');

    let components = [];

    // We allow either an array of strings in components
    // or a string naming a specific named palette
    if(typeof main.options.components === "string") {
        components = main.components.getPalette(main.options.components);
        if(components === null) {
            throw new Error('options.components invalid name ' + main.options.components);
        }
    } else {
        main.options.components.forEach((component) => {
            // This can be a component name or a palette name
            let palette = main.components.getPalette(component);
            if(palette !== null) {
                components = components.concat(palette);
            } else {
                components.push(component);
            }
        });
    }

    // Test if an item is in an array
    function inArray(needle, haystack) {
        for(var i=0; i<haystack.length; i++) {
            if(haystack[i].toLowerCase() === needle.toLowerCase()) {
                return true;
            }
        }

        return false;
    }

    function addToPalette(obj) {
        // Only some components get added to the pallet...
        // A component is added if it is in the current
        // list of components or main.options.always
        var name = obj.type;
        if(!inArray(name, components) &&
                !inArray(name, main.options.always)) {
            return;
        }

        that.palette.push(obj);
        var pi = new PaletteItem(that, obj);
        div.appendChild(pi.element);
    }

    //
    // Load the circuit components into the palette
    //
    main.components.components.forEach(function(obj) {
        addToPalette(obj);
    });

    work.appendChild(div);

    this.refresh = function() {
        // Remove any images that are of class "circuitref"
        //div.find(".circuitref").remove();

        // // Add any necessary circuitref images
        // for(var i = main.currentView().tabnum+1;  i < main.model.circuits.circuits.length;  i++) {
        //     var circuit = main.model.circuits.circuits[i];
        //     var obj = Cirsim.CircuitRef;
        //
        //     var longClass = circuit.name.length > 6 ? ' class="long"' : '';
        //
        //
        //     var img = $('<figure class="circuitref"><img src="' + main.root + '/images/' + obj.img +
        //         '" alt="' + obj.desc + '" title="' + obj.desc + '">' +
        //         '<figcaption' + longClass + '>' + circuit.name + '</figcaption></figure>');
        //     new PaletteItem(img, obj, circuit);
        //
        //     div.append(img);
        // }
    }

};

