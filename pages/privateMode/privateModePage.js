define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      privateModeTemplate  = require('text!./privateModeTemplate.html'),
      Layout        = require('layouts/privateModeLayout/layout');

  var PrivateModePage = Backbone.View.extend({
    template: _.template(privateModeTemplate),
    render: function() {
	  	 require(['jquery','jquery-ui','underscore','bootstrap','jquery-pace','jquery-app','touch-punch','SmartNotification','sparkline','jquery-validate','jquery-maskedinput','jquery-select2','bootstrap-slider','jquery-browser','jquery-fastclick','jquery-moment','highcharts','highcharts-3d','highcharts-exporting','highcharts-drilldown','wb_accountInfo','jcrop','pwstrength','md5','datatables','datatables_responsive','datatablesColVis','datatablesTools','dataTablesColumnFilter', 'store'], function($){ 
		  $(function(){
		     $('#headerName').html("Private mode");	
				
	      });//ready
	   });//require
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: PrivateModePage
  });
});
