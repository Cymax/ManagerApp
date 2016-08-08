define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      registerBetterTemplate  = require('text!./registerBetterTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var RegisterBetterPage = Backbone.View.extend({
    template: _.template(registerBetterTemplate),
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
    content: RegisterBetterPage
  });
});
