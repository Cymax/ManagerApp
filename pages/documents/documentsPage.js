define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      documentsTemplate  = require('text!./documentsTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var DocumentsPage = Backbone.View.extend({
    template: _.template(documentsTemplate),
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
    content: DocumentsPage
  });
});


