define(function(require) {
  'use strict';
  var Backbone        = require('backbone'),
      _               = require('underscore'),
      dashboardTemplate  = require('text!./dashboardTemplate.html'),
      router          = require('router');

  return Backbone.View.extend({
    template: _.template(dashboardTemplate),

    model: {
      routes: router.routes
    },

    render: function() {
		 require(['jquery','store','wb_translate'], function($){	
		 
		   $(function(){				 
			 	renderTranslations();
	        });//ready
		 
		  	function hideURLbar() {
				window.scrollTo(0, 1);
			}

			addEventListener('load', function() {
				setTimeout(hideURLbar, 0)
			}, false);
			window.onorientationchange = hideURLbar;	 
		 	
			//redirect to login page if session  is not defined				
		    if(!store.get("session_Org_am_emp") ){ 		  		
				window.location.href = baseURL+'#/login';
			}						
			//redirect to login page if status is logout
			if(localStorage["storage_LoggedOut_am_emp"] === 'true'){ 		
			  window.location.href = baseURL+'#/login';		
			}		
		});
		
		
      this.$el.html(this.template(this));

      // this.content is populated by the child view
      this.$el.find('content-placeholder').append(new this.content().render().el);
      return this;
    }
  });
});
