;(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
  'use strict';
  var namespace = 'crosscover';
  var autoPlay = null;
	var timer = null;
	var current = null;
  var methods = {
    init: function(options) {
      options = $.extend({
        animateInClass:'fade-in',
        animateOutClass:'fade-out',
				interval : 2000,
				startIndex : 0,
        autoPlay : true,
				controles : true,
				controlesClass  : 'crosscover-controls',
				prevClass : 'crosscover-prev',
				nextClass : 'crosscover-next',
				playerClass : 'crosscover-player',
				playerActiveClass : 'is-playing'
      }, options);

			autoPlay = options.autoPlay;
      if (options.controles) methods.addControler.call(this,options);

      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);
				var $items = $this.children('.crosscover-list').children('li');
				var $controls = $this.children('.' + options.controlesClass);
				var	$navPrev = $controls.children('.' + options.prevClass);
				var	$navNext = $controls.children('.' + options.nextClass);
				var	$navPlayPause = $controls.children('.' + options.playerClass);

				current = options.startIndex;

        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, {
            options: options
          });

          methods.setup.call(_this, $items);

					$navPlayPause.on('click.' + namespace, function(event) {
  					 methods.pauseToggle.call(_this, $items, event);
					});

					$navPrev.on('click.' + namespace, function() {
						if(autoPlay) methods.autoPlayStart.call(_this, $items);
						return methods.toggle.call(_this, $items, 'prev');
					} );

					$navNext.on('click.' + namespace, function() {
						if(autoPlay) methods.autoPlayStart.call(_this, $items);
						return methods.toggle.call(_this, $items, 'next');
					});

        }
      });
    },

    addControler: function(options) {
      var $this = $(this);
      var isClass = autoPlay ? options.playerActiveClass : null;
      $this
	      .append(
          $('<div>')
            .addClass(options.controlesClass)
    	      .append(
              $('<span>')
                .addClass(options.prevClass)
            )
    	      .append(
              $('<span>')
                .addClass(options.playerClass)
                .addClass(isClass)
            )
    	      .append(
              $('<span>')
                .addClass(options.nextClass)
            )
        );
    },

    setup: function($items) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      $items.each(function(index) {
				var $item = $(this);
				$item
          .css( 'background-image', 'url(' + $item.find( 'img' )
          .attr( 'src' ) + ')' );
			});
			$items
        .eq(current)
        .addClass('crosscover-active')
        .addClass(options.animateInClass);
      return methods.autoPlayStart.call(_this, $items);
    },

    pauseToggle: function($items, event) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
  		var $target = $(event.target);

      if(autoPlay){
        autoPlay = false;
  			$target
  				.removeClass(options.playerActiveClass)
  				.addClass(options.playClass);
        return methods.autoPlayStop.call(_this);
      } else {
        autoPlay = true;
  			$target.addClass(options.playerActiveClass);
        return methods.autoPlayStart.call(_this, $items);
      }
    },

    toggle: function($items, mode){
      var _this = this;
			var $currentItem = $items.eq(current);
			if(mode === 'next') {
				 current = current < $items.length - 1 ? current++ : 0 - 1;
         current++;
			} else if(mode === 'prev'){
				 current = current > 0 - 1 ? current-- : $items.length - 1;
         current--;
			}
      var $newItem = $items.eq(current);
      methods.animate.call(_this, $currentItem, $newItem);
    },

    animate: function($currentItem, $newItem) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
			$currentItem
        .removeClass()
        .addClass(options.animateOutClass)
        .animateCallback(function(){
          $(this).removeClass();
        });
			$newItem
        .addClass(options.animateInClass)
        .addClass('crosscover-active')
        .animateCallback(function(){
          if(!$(this).hasClass('crosscover-active')){
            $(this).addClass('crosscover-active');
          }
        });
    },

    currentIndex: function() {
      return current;
    },

    autoPlayStart: function($items) {
      var _this = this;
      var $this = $(this);
      var options   = $this.data(namespace).options;
      if(autoPlay){
        clearTimeout( timer );
  			timer = setTimeout(function(){
  				methods.toggle.call(_this, $items, 'next' );
  				methods.autoPlayStart.call(_this, $items);
  			}, options.interval );
      }
    },

    autoPlayStop: function() {
  		autoPlay = false;
  		return clearTimeout( timer );
    },

    destroy: function(){
      return this.each(function(){
        var $this = $(this);
        $(window).unbind('.'+namespace);
        $this
          .css({'opacity':1})
          .removeData(namespace);
      });
    }
  };

  $.fn.animateCallback = function(callback){
    var end = 'animationend webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationEnd';
    return this.each(function() {
      var $this = $(this);
      $this.bind(end, function(){
        $this.unbind(end);
        return callback.call(this);
      });
    });
  };

  $.fn.crosscover = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.' + namespace);
    }
  };

}));
