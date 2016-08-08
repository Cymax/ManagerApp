define(function(require) {
  'use strict';
  var Backbone        = require('backbone'),
      _               = require('underscore'),
      privateModeTemplate  = require('text!./privateModeTemplate.html'),
      router          = require('router');

  return Backbone.View.extend({
    template: _.template(privateModeTemplate),

    model: {
      routes: router.routes
    },

    render: function() {
      this.$el.html(this.template(this));
	  
	  	    function hideURLbar() {
				window.scrollTo(0, 1);
			}

			addEventListener('load', function() {
				setTimeout(hideURLbar, 0)
			}, false);
			window.onorientationchange = hideURLbar;	

      // this.content is populated by the child view
      this.$el.find('content-placeholder').append(new this.content().render().el);
      return this;
    }
  });
});
