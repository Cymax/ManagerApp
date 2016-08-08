define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      preventionTemplate  = require('text!./preventionTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var preventionPage = Backbone.View.extend({
    template: _.template(preventionTemplate),
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
    content: preventionPage
  });
});


