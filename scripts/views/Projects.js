/* globals Ext */

/// <reference Path="../ext-js/adapter/ext/ext-base.js"/>
/// <reference path="../ext-js/ext-all-debug.js"/>

/*
 * Copyright(c) 2010 Medicor AB.
 */

function createProjectProxy() {
	return new Ext.data.HttpProxy({
		autoDestroy: true,
		api: {
			read:		{ method: 'GET' }, // url is assigned in ProjectWindow:setProject
			create:		{ url: 'DataService.svc/ProjectSet', method: 'POST' },
			update:		{ url: 'DataService.svc/ProjectSet', method: 'MERGE' },
			destroy:	{ url: 'DataService.svc/ProjectSet', method: 'DELETE' }
		}
	});
}

function createProjectReader() {
	return new Ext.data.JsonReader({
		idProperty: 'ProjectID',
		root: 'd',
		fields: [
			{name: 'ProjectID',		type: 'int'},
			{name: 'ProjectRate',	type: 'int'},
			{name: 'ProjectName',	type: 'string'},
			{name: 'Purpose',		type: 'string'}
		]
	});
}

function createProjectWriter() {
	return new Ext.data.JsonWriter({
		returnJson: true,
		writeAllFields: false
	});
}

function createProjectStore() {
	return new Ext.data.Store ({
		proxy:  createProjectProxy(),
		reader: createProjectReader(),
		writer: createProjectWriter(),
		autoLoad: false,
		autoSave: false,
		restful: true,
		listeners: {
		//	write: function(store, action, result, res, rs) {
		//		App.setAlert(res.success, res.message); // <-- show user-feedback for all write actions
		//	},
			exception: function(proxy, type, action, options, res, arg) {
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
}

function createProjectGridColumnModel() {
	return new Ext.grid.ColumnModel ({
		defaults: {
//			editor: new Ext.form.TextField(),
			menuDisabled: true
		},
		columns: [
			{id: 'projectName',		header: "Namn",			dataIndex: 'ProjectName',	width: 140, fixed: true},
			{id: 'purpose',			header: "Beskrivning",	dataIndex: 'Purpose'},
			{id: 'projectRate',		header: "Taxa",			dataIndex: 'ProjectRate',	width: 45,  fixed: true, xtype: 'numbercolumn',	format: '000',	align: 'left'}
//			{id: 'hoursWorked',		header: "Timmar",	dataIndex: 'HoursWorked',	width: 80, fixed: true, xtype: 'datecolumn',	format: Date.patterns.ISO8601Short }
		]
	});
}

function createProjectGridPanel() {
	return new Ext.grid.GridPanel({
		store: createProjectStore(),
		colModel: createProjectGridColumnModel(),
		frame: false,
		loadMask: true,
		border: false,
		viewConfig: {
			forceFit: true
		},
		selModel: new Ext.grid.RowSelectionModel ({
			singleSelect: true,
			moveEditorOnEnter: false
		}),
		listeners: {
			rowclick: function() {
				Ext.getCmp('deleteProjectButton').enable();
			},
			rowdblclick: function () {
				Ext.getCmp('browseProjectButton').handler();
			}
		}
	});
}

function createProjectGridWindow (aContainer, aProject) {
	var n = 0;
	Ext.WindowMgr.each(function(){n=n+1;}); // JavaScript 4ever.
	var gridPanel = createProjectGridPanel();
	return new Ext.Window ({
		layout: 'fit',
		renderTo: aContainer,
		x: (20+20*n),
		y: (20+20*n),
		width: 560,
		height: 420,
		minWidth: 420,
		minHeight: 200,
		constrain: true,
		plain: true,
		collapsible: true,
		closable: true,
		iconCls: 'IconProjects',
		items: gridPanel,
		tbar: [{
			id: 'browseProjectButton',
			text: 'Redigera',
			iconCls: 'IconProjectsBrowse',
			disabled: true,
			handler: function() {
				var r = gridPanel.getSelectionModel().getSelected();
				var d = createProjectFormDialog (r, aProject.CustomerName + '&nbsp;&mdash;&nbsp;' + r.data.ProjectName);
				d.show(this.getEl());
			}
		}, {
			xtype: 'tbseparator'
		}, {
			id: 'insertProjectButton',
			text: 'Registrera ny',
			iconCls: 'IconProjectsInsert',
			disabled: true,
			handler: function() {
			}
		}, {
			xtype: 'tbseparator'
		}, {
			id: 'deleteProjectButton',
			text: 'Ta bort',
			iconCls: 'IconProjectsDelete',
			disabled: true,
			handler: function() {
			}
		}],
		listeners: {
			show: function (t) {
				t.setTitle('Projekt för &nbsp;<b>' + aProject.CustomerName + '</b>');
				gridPanel.getStore().proxy.setApi(Ext.data.Api.actions.read, 'DataService.svc/CustomerSet(#)/Projects'.replace('#', aProject.CustomerID));
				gridPanel.getStore().load();
				var c = this.getTopToolbar();
				c.findById('browseProjectButton').enable();
				c.findById('insertProjectButton').enable();
			}
		}
	});
}
