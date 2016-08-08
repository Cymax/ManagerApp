define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      updateSickTemplate  = require('text!./updateSickTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var UpdateSickPage = Backbone.View.extend({
    template: _.template(updateSickTemplate),
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
    content: UpdateSickPage
  });
});

