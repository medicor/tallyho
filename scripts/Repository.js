
/// <reference Path="../ext-js/adapter/ext/ext-base.js"/>
/// <reference path="../ext-js/ext-all-debug.js"/>

/*
 * Copyright(c) 2010 Medicor AB.
 */

Ext.BLANK_IMAGE_URL = 'ext-js/resources/images/s.gif';
Ext.lib.Ajax.defaultHeaders = {'Accept': 'application/json'};
Ext.QuickTips.init();

Date.patterns = {
	ISO8601Long: "Y-m-d H:i:s",
	ISO8601Short: "Y-m-d",
	ShortDate: "j F Y",
	LongDate: "l den j F Y",
	FullDateTime: "l, F d, Y g:i:s A",
	MonthDay: "F d",
	ShortTime: "g:i A",
	LongTime: "g:i:s A",
	SortableDateTime: "Y-m-d\\TH:i:s",
	UniversalSortableDateTime: "Y-m-d H:i:sO",
	YearMonth: "F, Y"
};
	
