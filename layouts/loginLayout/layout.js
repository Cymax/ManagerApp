define(function(require) {
  'use strict';
  var Backbone        = require('backbone'),
      _               = require('underscore'),
      loginMaster  = require('text!./loginMaster.html'),
      router          = require('router');

  return Backbone.View.extend({
    template: _.template(loginMaster),

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
		
							
			$(document).ready(function(){					
				
				//Show or hide the sticky footer button
				$(window).scroll(function() {
					if ($(this).scrollTop() > 200) {
						$('.go-to-top').fadeIn(200);
					} else {
						$('.go-to-top').fadeOut(200);
					}
				});				
				
				// Animate the scroll to top
				$('.go-to-top').click(function(event) {
					event.preventDefault();				
					$('html, body').animate({scrollTop: 0}, 300);
				})
			
			
			});//ready	
		});//require
		
      this.$el.html(this.template(this));

      // this.content is populated by the child view
      this.$el.find('content-placeholder').append(new this.content().render().el);
      return this;
    }
  });
});