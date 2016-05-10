
/// <reference Path="../ext-js/adapter/ext/ext-base.js"/>
/// <reference path="../ext-js/ext-all-debug.js"/>

/*
 * Copyright(c) 2010 Medicor AB.
 */

var proxy = new Ext.data.HttpProxy ({
	url: 'DataService.svc/CompanySet',
	restful: true
	/*
	No need for API when RESTful
	api: {
		create: 'create.php',
		read: { url: 'read.php',method: 'GET' },
		update: 'update.php',
		destroy: 'destroy.php'
	}
	*/
});

var reader = new Ext.data.JsonReader ({
    idProperty: 'CompanyID',
    root: 'd'
}, [
    {name: 'CompanyID'},
    {name: 'CompanyName'},
    {name: 'StreetAddress'},
    {name: 'PostalAddress'},
    {name: 'CompanyEmail'}
]);

// The new DataWriter component.
var writer = new Ext.data.JsonWriter ({
    returnJson: true,
    writeAllFields: false
});

// Typical Store collecting the Proxy, Reader and Writer together.
var store = new Ext.data.Store ({
    id: 'user',
    proxy: proxy,
    reader: reader,
    writer: writer,
    autoSave: false,
    restful: true,
    listeners: {
		/*
        write : function(store, action, result, res, rs) {
            App.setAlert(res.success, res.message); // <-- show user-feedback for all write actions
        },
        */
        exception : function(proxy, type, action, options, res, arg) {
            if (type === 'remote') {
                Ext.Msg.show({
                    title: 'REMOTE EXCEPTION',
                    msg: res.message,
                    icon: Ext.MessageBox.ERROR
                });
            }
        }
    }
});

store.load();

function formatDate (value) {
    return value ? value.dateFormat('yyyy-mm-dd') : '';
};

var textField = new Ext.form.TextField();

var companyGridModel = new Ext.grid.ColumnModel ({
	defaults: {
		editor: textField
	},
	columns: [
		{id: 'CompanyID',		header: "ID",				dataIndex: 'CompanyID',		width: 60 }, 
		{id: 'CompanyName',		header: "Name",				dataIndex: 'CompanyName',	width: 120}, 
		{id: 'StreetAddress',	header: "Street address",	dataIndex: 'StreetAddress',	width: 150}, 
		{id: 'PostalAddress',	header: "Postal address",	dataIndex: 'PostalAddress',	width: 100}, 
		{id: 'CompanyEmail',	header: "Email",			dataIndex: 'CompanyEmail',	width: 80}
	]
});
/*
var Plant = Ext.data.Record.create([
// the "name" below matches the tag name to read, except "availDate"
// which is mapped to the tag "availability"
       {name: 'common', type: 'string' },
       { name: 'botanical', type: 'string' },
       { name: 'light' },
       { name: 'price', type: 'float' },             // automatic date conversions
       {name: 'availDate', mapping: 'availability', type: 'date', dateFormat: 'm/d/Y' },
       { name: 'indoor', type: 'bool' }
]);
*/
var grid = new Ext.grid.EditorGridPanel ({
	store: store,
	colModel: companyGridModel,
	frame: false,
	//plugins: checkColumn,
	clicksToEdit: 2,
	viewConfig: {forceFit: true}
 /*
	tbar: [{
		text: 'Lägg till tidpost',
		handler: null
		function() {
			var p = new Plant({
				common: 'New Plant 1',
				light: 'Mostly Shade',
				price: 0,
				availDate: (new Date()).clearTime(),
				indoor: false
			});
			grid.stopEditing();
			store.insert(0, p);
			grid.startEditing(0, 0);
		}
    }]
*/
});

