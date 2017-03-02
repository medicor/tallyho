/* globals Ext createProjectGridWindow createCustomerGridWindow createRecordGridWindow */
/// <reference Path="../ext-js/adapter/ext/ext-base.js"/>
/// <reference path="../ext-js/ext-all.js"/>

/*
 * Copyright(c) 2010 Medicor AB.
 */

Ext.onReady(function() {

	var createDebitOverviewStore = function() {
		return new Ext.data.JsonStore({
			autoDestroy: true,
			autoLoad: false,
			url: 'DataService.svc/DebitOverview?$orderby=LastDebited%20desc',
			/*
			data: {
				d: [{
						ProjectID: 146,
						ProjectName: "HipFact",
						CustomerName: "Område Sahlgrenska",
						LastDebited: "/Date(1198800000000)/",
						NumberOfHours: 3861,
						TotalDebit: 2323740
					},{
						ProjectID: 906,
						ProjectName: "Webbplats",
						CustomerName: "Salomonsson Grafiska AB",
						LastDebited: "/Date(1195776000000)/",
						NumberOfHours: 59,
						TotalDebit: 42480
					}]
			},
			*/
			storeId: 'debitOverviewStore',
			root: 'd',
			idProperty: 'ProjectID',
			fields: [
				{name: 'ProjectID',		type: 'int'},
				{name: 'ProjectName',	type: 'string'},
				{name: 'CustomerID',	type: 'int'},
				{name: 'CustomerName',	type: 'string'},
				{name: 'LastDebited',	type: 'date', dateFormat: 'M$'},
				{name: 'NumberOfHours',	type: 'int'},
				{name: 'TotalDebit',	type: 'int'}
			],
			listeners: {
				exception: function (proxy, type, action, options, response) {
					Ext.Msg.alert(response);
				}
			}
		})
	};

	var createDebitOverviewPanel = function() {
		return new Ext.grid.GridPanel ({
			id: 'debitOverviewPanel',
			title: 'Debiteringsöversikt',
	//		region: 'north',
	//		loadMask: true,
			trackMouseOver: false,
			store: createDebitOverviewStore(),
			autoScroll: true,
			stripeRows: true,
			viewConfig: { forceFit: true },
			colModel: new Ext.grid.ColumnModel({
				defaults: {
					menuDisabled: true,
					resizable: false
				},
				columns: [
					{id: 'ProjectName',	header: "Projekt",	dataIndex: 'ProjectName' },
					{id: 'LastDebited',	header: "Senast",	dataIndex: 'LastDebited', width: 80, fixed: true, xtype: 'datecolumn', format: Date.patterns.ISO8601Short, tooltip: 'Datum när tid senast registrerades på projektet.'}
				]
			}),
			tbar: [{
				id: 'viewRecordsButton',
				text: 'Tider',
				iconCls: 'IconRecords',
				disabled: true,
				handler: function (){
					var p = Ext.getCmp('debitOverviewPanel');
					var w = createRecordGridWindow (contentPanel.body, p.getSelectionModel().getSelected().data);
					w.show(p.getEl());
				}
			},{
				xtype: 'tbseparator'
			},{
				id: 'viewProjectButton',
				text: 'Projekt',
				iconCls: 'IconProjects',
				disabled: true,
				handler: function () {
					var p = Ext.getCmp('debitOverviewPanel');
					var w = createProjectGridWindow (contentPanel.body, p.getSelectionModel().getSelected().data);
					w.show(p.getEl());
				}
			},{
				xtype: 'tbseparator'
			},{
				id: 'viewCustomerButton',
				text: 'Kunder',
				iconCls: 'IconCustomers',
				disabled: true,
				handler: function () {
					var p = Ext.getCmp('debitOverviewPanel');
					var w = createCustomerGridWindow (contentPanel.body, p.getSelectionModel().getSelected().data);
					w.show(p.getEl());
				}
			}],
			listeners: {
				rowclick: function (aGridPanel) {
					var c = aGridPanel.getTopToolbar();
					c.findById('viewRecordsButton').enable();
					c.findById('viewProjectButton').enable();
					c.findById('viewCustomerButton').enable();
				},
				rowdblclick: function(aGridPanel) {
					var c = aGridPanel.getTopToolbar();
					c.findById('viewRecordsButton').handler();
				}
			}
		});
	};

	var createInvoicePanel = function() {
		return new Ext.Panel({
			title: 'Fakturor',
	//		bodyCssClass: 'Workspace',
			html: '<p>Funktioner för fakturering.</p>'
		});
	};

	var createReportPanel = function() {
		return new Ext.Panel({
			title: 'Rapporter',
	//		bodyCssClass: 'Workspace',
			html: '<p>Diverse rapporter.</p>'
		});
	};

	var createToolsPanel = function() {
		var myStamp = new Ext.Component ({
			tag: 'span',
			cls: 'VersionStamp StyleFreeAnchor',
			html: '<a href="http://www.sencha.com" target="_blank">built with ExtJS v' + Ext.version + '</a>'
		});
		return new Ext.Panel({
			title: 'Verktyg',
			padding: 10,
			listeners: {
				beforeexpand: function () {
					myStamp.hide();
				},
				expand: function () {
					myStamp.show();
					myStamp.el.animate({backgroundColor: { from: '#FF0000', to: '#FF9C00' }}, 1.0, null, 'easeIn', 'color');
				}
			},
			items: [
				{
					id: 'logoutButton',
					xtype: 'button',
					text: 'Logga ut',
					iconCls: 'IconTool',
					handler: function () {
					/*
						Ext.Ajax.request ({
							url: 'DataService.svc/Deauthenticate',
							success: function () {
								mainViewport.disable();
								history.go(0);
							}
						});
						*/
						// Some browser incompatibility issues.
						document.cookie = 'TallyHoID=0; expires=Fri, 31 Aug 1962 00:00:00 GMT; path=/TallyHo/DataService.svc/'; // For FF, IE
						document.cookie = 'TallyHoID=0; expires=Fri, 31 Aug 1962 00:00:00 GMT; path=/TallyHo/DataService.svc';  // For Chrome
						document.cookie = 'TallyHoID=0; expires=Fri, 31 Aug 1962 00:00:00 GMT; path=/DataService.svc/'; // For FF, IE - deployed
						document.cookie = 'TallyHoID=0; expires=Fri, 31 Aug 1962 00:00:00 GMT; path=/DataService.svc';  // For Chrome - deployed
						document.location.reload(true);
					}
				},
				myStamp
			]
		});
	};

	var createSidebarPanel = function() {
		var myOverviewPanel = createDebitOverviewPanel();
		var isOverviewLoaded = false;
		return new Ext.Panel({
			id: 'sidebarPanel',
			layout: 'accordion',
			region: 'west',
			margins: '5 0 5 5',
			hideBorders: true,
	//		hidden: true,
			collapsible: true,
			collapsed: true,
			titleCollapse: false,
			floatable: false,
			split: true,
			width: 320,
			minWidth: 210,
			layoutConfig: {
				animate: true
			},
			items: [
				myOverviewPanel,
				createInvoicePanel(),
				createReportPanel(),
				createToolsPanel()
			],
			listeners: {
				beforeexpand: function () {
					return isOverviewLoaded; // && (document.cookie.indexOf('TallyHoID') < 0);
				}
			},
			load: function() {
				var s = myOverviewPanel.getStore();
				new Ext.LoadMask (Ext.getBody(), {msg: "Laddar debiteringsöversikt...", store: s});
				s.on ("load", function() {isOverviewLoaded=true; this.expand();}, this);
				s.load();
			}
		});
	};

	var createContentPanel = function() {
		return new Ext.Panel({
			id: 'contentPanel',
			layout: 'absolute',
			region: 'center',
			margins: '5 5 5 0',
			bodyCssClass: 'Workspace'
		});
	};

	var createWorkerStore = function() {
		return new Ext.data.JsonStore({
			autoDestroy: true,
			autoLoad: false,
			url: 'DataService.svc/Authenticate', // Must be set (to dummy value)
	//		baseParam: {'$expand': 'Company'}, // Can be used to expand entities if the data service method returns IQueryable
			storeId: 'workerStore',
			root: 'd',
			idProperty: 'WorkerID',
			fields: [
				{name: 'WorkerID',		type: 'int'},
				{name: 'Username',		type: 'string'},
				{name: 'Fullname',		type: 'string'},
				{name: 'BusinessEmail',	type: 'string'},
				//Can the following be setup to be hierarchical instead?
				{name: 'CompanyID',		type: 'int',	mapping: 'Company.CompanyID'},
				{name: 'CompanyName',	type: 'string',	mapping: 'Company.CompanyName'},
				{name: 'StreetAddress',	type: 'string',	mapping: 'Company.StreetAddress'},
				{name: 'PostalAddress',	type: 'string',	mapping: 'Company.PostalAddress'}
			],
			listeners: {
				exception: function () {
	//				Ext.Msg.alert('Exception in Worker Store', type, action);
				}
			}
		});
	};

	//	Ext.get("login-form-box").boxWrap();
	var createLoginPanel = function (aWorkerStore) {
		var myPanel;

		return myPanel = new Ext.form.FormPanel ({
			bodyStyle: 'padding: 20px',
			labelAlign: 'top',
			buttonAlign: 'left',
			defaultType: 'textfield',
			width: 240,
			waitMsgTarget: true,
	//		defaults: {
	//			msgTarget: 'title',
	//			allowBlank: false,
	//		},
			keys: {
				key: [10,13],
				fn: function() {
					// This should work out of the box ...
					var b = myPanel.findById('myLoginButton');
					b.handler(b);
				}
			},
			items: [{
				id: 'myUsername',
				fieldLabel: 'Användarnamn',
				submitValue: false,
				width: 200,
				listeners: {
					render: function (aField) {
						// This should work out of the box ...
						(function() { aField.focus(); }).defer(500);
					}
				}
			},{
				id: 'myPassword',
				fieldLabel: 'Lösenord',
				submitValue: false,
				inputType: 'password',
				width: 200
			},{
				id: 'mySaveFlag',
				boxLabel: 'Kom ihåg mig',
				hideLabel: true,
				xtype: 'checkbox',
				submitValue: false
			},{
				xtype: 'spacer',
				height: 20
			},{
				id: 'myLoginButton',
				xtype: 'button',
	//			type: 'submit',
				text: 'Logga in',
				style: 'float: left',
				width: 80,
				handler: function (aButton) {
					var thisForm = myPanel.getForm();
					if (thisForm.isValid()) {
						aButton.disable();
						myPanel.add(new Ext.Component ({id: 'myIndicator', cls: 'loading-indicator', html: 'Loggar in ...', style: 'float: right'}));
						myPanel.doLayout();
	//					var s = createWorkerStore();
	//					var m = new Ext.LoadMask (Ext.getBody(), {msg: "Loggar in ...", removeMask: true, store: s});
						var u = thisForm.findField('myUsername').getValue();
						var p = thisForm.findField('myPassword').getValue();
						var f = thisForm.findField('mySaveFlag').getValue();
						aWorkerStore.setBaseParam('aUsername', "'" + u + "'");
						aWorkerStore.setBaseParam('aPassword', "'" + p + "'");
						aWorkerStore.setBaseParam('aSaveFlag', "'" + f + "'");
						aWorkerStore.proxy.conn.url = 'DataService.svc/Authenticate2';
						aWorkerStore.load({
							callback: function(aWorker) {
								if (aWorker.length == 0) {
									myPanel.findById('myIndicator').el.fadeOut({duration: 0.5, callback: function(t){t.remove();}});
									myPanel.add(new Ext.Component ({id: 'myStatusRow', html: 'Ogiltigt användarnamn eller lösenord', style: 'clear: both; padding-top: 10px; color: red'}));
									myPanel.doLayout();
	//								(function(){myPanel.findById('myStatusRow').destroy();}).defer(3000);
									myPanel.findById('myUsername').focus();
									aButton.enable();
								} else {
									sidebarPanel.load();
									myPanel.destroy();
								}
							}
						});
					/*
						f.submit({
							url:'DataService.svc/Authenticate',
							method: 'get',
							params: {
								// All query string parameter values must be single-quoted. Only GET works. (MS anomalies)
								aUsername: "'" + f.findField('myUsername').getRawValue() + "'",
								aPassword: "'" + f.findField('myPassword').getRawValue() + "'",
								'$expand': 'Company'
							},
							failure: function (aForm, anAction) {
								thisPanel.add({ xtype: 'box', text: anAction.result });
								thisPanel.doLayout();
							},
							success: function (aForm, anAction) {
								thisPanel.add({ xtype: 'box', text: anAction.result });
								thisPanel.doLayout();
							}
						})
					*/
					}
				}
	//		},{
	//			xtype: 'component',
	//			id: 'myLoadingIndicator',
	//			cls: 'loading-indicator',
	//			html: 'Loggar in ...',
	//			style: 'float: right'
			}]
		});
	};

	// redirect to non-www to avoid multiple base addresses in DataService
	if (window.location.href.search(/www\./i) >= 0) {
		window.location.href = window.location.href.replace(/www\./i, '');
		return;
	}

	var sidebarPanel = createSidebarPanel();
	var contentPanel = createContentPanel();

	new Ext.Viewport({
		layout: 'border',
		items: [
			sidebarPanel,
			contentPanel
		]
	});

	var s = createWorkerStore();
	s.proxy.conn.url = 'DataService.svc/Authenticate1';
	s.proxy.conn.method = 'GET';
	s.load({
		callback: function(aWorker) {
			/*
			if (aWorker.length == 0) {
				var p = createLoginPanel(s);
				contentPanel.add(p);
				contentPanel.doLayout();
				p.getEl().center(contentPanel.getEl());
				p.getEl().move('up', 500, false);
				p.getEl().show();
				p.getEl().move('down', 400, {duration: 1, easing: 'bounceOut'});
			} else {
				//TODO: Load Company object through Ajax call?
				sidebarPanel.load();
			}
			*/
			// IN DEMO MODE.
			var p = createLoginPanel(s);
			contentPanel.add(p);
			contentPanel.doLayout();
			p.getEl().center(contentPanel.getEl());
			p.getEl().move('up', 500, false);
			p.getEl().show();
			p.getEl().move('down', 400, {duration: 1, easing: 'bounceOut'});
			Ext.getCmp('myUsername').setValue('DEMO');
			Ext.getCmp('myPassword').setValue('DEMO');
			// setTimeout(function() {
			// 	setTimeout(function() {
			// 		p.destroy();
			// 		sidebarPanel.load();
			// 	}, 500)
			// 	Ext.getCmp('myUsername').setValue('DEMO');
			// 	Ext.getCmp('myPassword').setValue('DEMO');
			// }, 1500)
		}
	});
});
