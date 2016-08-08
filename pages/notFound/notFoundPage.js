define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      notFoundTemplate  = require('text!./notFoundTemplate.html'),
      Layout        = require('layouts/loginLayout/layout');

  var NotFoundPage = Backbone.View.extend({
    template: _.template(notFoundTemplate),
    render: function() {
	  	 require(['jquery','jquery-ui','underscore','bootstrap','jquery-pace','jquery-app','touch-punch','SmartNotification','sparkline','jquery-validate','jquery-maskedinput','jquery-select2','bootstrap-slider','jquery-browser','jquery-fastclick','jquery-moment','highcharts','highcharts-3d','highcharts-exporting','highcharts-drilldown','wb_accountInfo','jcrop','pwstrength','md5','datatables','datatables_responsive','datatablesColVis','datatablesTools','dataTablesColumnFilter', 'store'], function($){ 
		  $(function(){
		      $('#headerName').html("Page not found... ");
				
	      });//ready
	   });//require
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: NotFoundPage
  });
});
