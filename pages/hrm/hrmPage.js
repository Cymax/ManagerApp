define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      hrmTemplate  = require('text!./hrmTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var hrmPage = Backbone.View.extend({
    template: _.template(hrmTemplate),
    render: function() {
	  	  require(['jquery','jqueryui','bootstrap','jquery_validate','md5', 'store','wb_translate'], function($){ 		
		 
		  $(function(){				 
			 	renderTranslations();
	      });//ready
		  
	   });//require
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: hrmPage
  });
});


