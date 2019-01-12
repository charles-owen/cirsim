
/**
 * The File menu
 * @constructor
 */
export const FileMenu = function(menu, main) {
	const options = main.options;

	this.html = function() {
        let fileHtml = '';

	    let saveAPI = options.getAPI('save');
	    let openAPI = options.getAPI('open');

        // We only allow the Open menu option if there is no supplied filename
        if(openAPI !== null && openAPI.name === undefined) {
            fileHtml +=
                '<li><a class="file-open"><span class="icons-cl icons-cl-folder-open"></span>Open...</a></li>';
        }

        // Include the Save menu option if we are supporting save
        if(saveAPI !== null) {
            fileHtml +=
                '<li><a class="file-save"><span class="icons-cl icons-cl-disk"></span>Save</a></li>';
        }

        // Save-as only if there is no specific filename to use
        if(saveAPI !== null && saveAPI.name === undefined) {
            fileHtml +=
                '<li><a class="file-saveas"><span class="icons-cl icons-cl-disk"></span>Save As...</a></li>';
        }

        // Import/Export options
        if(options.export !== 'none') {
            if(fileHtml.length > 0) {
                fileHtml += '<li class="menu-divider">&nbsp;</li>';       // Separator
            }

            if(options.export === 'both' || options.export === 'import') {
                fileHtml += '<li><a class="cs-file-import"><span class="icons-cl icons-cl-arrowthickstop-1-n"></span>Import</a></li>';
            }

            if(options.export === 'both' || options.export === 'export') {
                fileHtml += '<li><a class="cs-file-export"><span class="icons-cl icons-cl-arrowthickstop-1-s"></span>Export</a></li>';
            }
        }

        if(options.imports.length > 0) {
	        fileHtml += optionalSeparator(fileHtml) +
	            `<li><a class="cs-file-import-tab"><span class="icons-cl icons-cl-arrowthickstop-1-s"></span>Import Tab</a></li>`;
        }

        if(options.exit !== null) {
            if(fileHtml.length > 0) {
                fileHtml += '<li class="menu-divider">&nbsp;</li>';       // Separator
            }
            fileHtml += '<li><a class="file-exit">Exit</a></li>';
        }

        if(fileHtml !== '') {
            return '<li><a>File</a><ul class="file-menu">' +
                fileHtml + '</ul></li>';
        } else {
            return '';
        }
    }

    const optionalSeparator = function(fileHtml) {
	    if(fileHtml.length > 0) {
		    return '<li class="menu-divider">&nbsp;</li>';       // Separator
	    }

	    return '';
    }

    this.activate = function() {
        menu.click('.cs-file-import', (event) => {
	        main.import();
        });

	    menu.click('.cs-file-export', (event) => {
		    main.export();
	    });

	    menu.click('.file-saveas', (event) => {
		    main.saveAs();
	    });

	    menu.click('.file-save', (event) => {
		    main.save();
	    });

	    menu.click('.file-open', (event) => {
		    main.open();
	    });

	    menu.click('.cs-file-import-tab', (event) => {
		    main.importTab();
	    });

	    menu.click('.file-exit', (event) => {
	    	if(options.exit !== null) {
	    		window.location.href = options.exit;
		    }
	    })
    }

    this.opening = function() {
	    // We enable the Import Tab menu option
	    // only if we are in a tab that we can import into
	    let enable = false;
	    const circuit = main.currentView().circuit;
	    if(circuit !== null) {
		    const name = circuit.name;
		    for(let i=0; i<main.options.imports.length; i++) {
			    const importer = main.options.imports[i];
			    if(importer.into === name) {
				    enable = true;
				    break;
			    }
		    }
	    }

	    menu.enable(".cs-file-import-tab", enable);
    }
}
