
import Resizer from 'resizer-cl';

import {Menu} from './Menu';
import {Palette} from './Palette';
import {Model} from './Model';
import Circuit from './Circuit';
import {Tabs} from './Tabs';
import ExportDlg from './Dlg/ExportDlg';
import ImportDlg from './Dlg/ImportDlg';
import {Test} from './Test';
import {Toast} from './Graphics/Toast';
import {FileSaveDialog} from './Dlg/FileSaveDialog';
import FileOpenDialog from './Dlg/FileOpenDialog';
import SaveDialog from './Dlg/SaveDialog';
import OpenDialog from './Dlg/OpenDialog';
import {View} from './View';
import {HelpDiv} from './Graphics/HelpDiv';
import {DragAndDrop} from './UI/DragAndDrop';
import {Tools} from './DOM/Tools';

/**
 * Actual instance of Cirsim for a single element.
 * @param cirsim The main Cirsim object
 * @param element Element we are loading into
 * @param tests Array of tests added to cirsim using addTest
 * @constructor
 */
export const Main = function(cirsim, element, tests) {
    this.cirsim = cirsim;
    this.element = element;
    this.options = cirsim.options;
    this.components = cirsim.components;
    this.test = new Test(this);

    /// div.main
    this.divMain = null;

    tests.forEach((test) => {
        this.test.addTest(test);
    })


    this.filename = null;

    let options = cirsim.options;

    /// The active editing model
    let model = null;

    /// References to other model components
    let menu=null, palette=null, tabs=null;

    /// div.overlay
    let divOverlay = null, divWork=null;

    this.initialize = function() {
        if(options.display !== 'none') {
            Tools.addClass(element, 'cirsim');
            element.innerHTML = '';

	        // el.show();

            switch(options.display) {
                case 'full':
	                Tools.addClass(element, 'cirsim-full');
                    break;

                case 'inline':
	                Tools.addClass(element, 'cirsim-inline');
                    break;

                default:
	                Tools.addClass(element, 'cirsim-window');
                    break;
            }

            if(options.display === 'window') {
                //
                // Add resizer to the window if in window mode
                // and it has not already been added
                //
                if(!element.classList.contains("resizer")) {
                    new Resizer(element, {
                        handle: '10px solid #18453B'
                    });
                }
            }

            this.dragAndDrop = new DragAndDrop(this);
        }


        //
        // Instantiate a model object
        //
        model = new Model(this);
        this.model = model;

        for(let i in this.options.tabs) {
            this.model.circuits.add(new Circuit(this.options.tabs[i]));
        }

        if(this.options.load !== null) {
            model.fmJSON(this.options.load);
        }

        //
        // Create and add the window components
        //
        if(options.display !== 'inline' && options.display !== 'none') {
            //
            // All window-based versions other than inline get the
            // full user interface
            //

            // <div class="main"></div>
            this.divMain = Tools.createClassedDiv('main');
            this.element.appendChild(this.divMain);

	        this.help = new HelpDiv(this);

            tabs = new Tabs(this);
            this.tabs = tabs;

            //
            // Add the menu
            //
            menu = new Menu(this);
            this.menu = menu;

            //
            // Working area
            // <div class="work"></div>
            //
            divWork = Tools.createClassedDiv('work');
            this.divMain.appendChild(divWork);

            //
            // And the palette
            //
            palette = new Palette(this, divWork);
            this.palette = palette;

            //
            // And add the tabs
            //
            tabs.create(divWork);

	        //
	        // And the overlay
	        // <div class="cirsim-overlay"></div>
	        //
	        divOverlay = Tools.createClassedDiv('cirsim-overlay');
	        this.divMain.appendChild(divOverlay);

            this.toast = new Toast(this);
            this.toast.create(this.divMain);
        }

        if(options.display === 'inline') {
            //
            // The minimal inline version
            // <div><canvas></canvas></div>
            //
            const div = document.createElement('div');
            element.appendChild(div);

            const canvas = document.createElement('canvas');
            div.appendChild(canvas);

            let circuit = model.circuits.getCircuit('main');
            let view = new View(this, canvas, circuit, 0);
            model.getSimulation().setView(view);

            //
            // And the overlay
            // <div class="cirsim-overlay"></div>
            //
            divOverlay = Tools.createClassedDiv('cirsim-overlay');
            element.appendChild(divOverlay);

            this.toast = new Toast(this);
            this.toast.create(this.element);
        }

        //
        // If open is specified with a single name, we
        // automatically open the file when we start.
        //
        var open = this.options.getAPI('open');
        if(open !== null && open.url !== undefined && open.name !== undefined) {
            this.filename = open.name;
            var dlg = new OpenDialog(open.name, this.options, this.toast);
            dlg.open((name, json) => {
                model.fmJSON(json);
                this.reload();
                this.filename = name;
            });
        }

    }


	this.addTest= function(test) {
		this.test.addTest(test);
	}


    this.currentView = function() {
        return tabs.currentView();
    };

    /**
     * Called whenever a new tab is selected
     */
    this.newTab = function() {
        if(palette !== null) {
            palette.refresh();
        }
        model.newTab();
    }

    /**
     * Backup the current circuits object in support of an Undo operation
     */
    this.backup = function() {
        model.backup();
    };

    /**
     * Undo operation
     */
    this.undo = function() {
        model.undo();
        tabs.undo();
        palette.refresh();
    };

    /**
     * Set or clear interface modal state.
     * @param modal True sets interface to modal state.
     *
     */
    this.modal = function(modal) {
        if(modal) {
            divOverlay.style.display = 'block';
        } else {
            divOverlay.style.display = 'none';
        }
    }

    this.open = function() {
        var dlg = new FileOpenDialog(this.options, this.toast);
        dlg.open((name, data) => {
            model.fmJSON(data);
            this.reload();
            this.filename = name;
        });
    }

    this.save = function() {
        if(this.filename === null) {
            this.saveAs();
        } else {
            var json = model.toJSON();
            var dlg = new SaveDialog(json, "application/json", this.filename, this.options, this.toast);
            dlg.open();
        }
    }

    this.saveAs = function() {
        var json = model.toJSON();
        var dlg = new FileSaveDialog(json, "application/json", this.options, this.toast);
        if(this.filename !== null) {
            dlg.filename = this.filename;
        }

        dlg.open((name) => {
            this.filename = name;
        });
    }

    // this.saveSingle = function() {
    //     // Don't save if not for current user
    //     if(this.userid !== null) {
    //         return;
    //     }
    //
    //     if(this.singleSave === null) {
    //         return;
    //     }
    //
    //     var json = model.toJSON();
    //     var dlg = new Cirsim.SaveSingleDialog(json, this.singleSave);
    //     dlg.open();
    // }

    this.export = function() {
        var dlg = new ExportDlg(model);
        dlg.open();
    };

    this.import = function() {
        var dlg = new ImportDlg(this, model);
        dlg.open();
    };

    // this.import_tab = function() {
    //     // Is the current tab in this list?
    //     for(var i=0; i<this.options.imports.length; i++) {
    //         var importer = this.options.imports[i];
    //         if(importer.into === this.currentView().circuit.name) {
    //             this.currentView().import_tab(importer);
    //             return;
    //         }
    //     }
    // }

    /**
     * Complete reload after a new model is loaded
     */
    this.reload = function() {
        tabs.destroy();
        tabs.create(divWork, model);
    }

    var dockedHelp = false;


    this.isHelpDocked = function() {
        return dockedHelp;
    }

    this.dockedHelp = function(dock) {
        dockedHelp = dock;
        if(dockedHelp) {
            Tools.addClass(this.element, 'docked-help');
        } else {
	        Tools.removeClass(this.element, 'docked-help');
        }
    }

    /**
     * Load a model from JSON
     * @param json JSON source
     */
    this.load = function(json) {
        model.fmJSON(json);
    }

    this.initialize();
}



Main.prototype.runTest = function(test) {
    return this.test.runTest(test);
}


