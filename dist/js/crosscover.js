/*!
 * crosscover v0.4.0
 * Carousel of a simple background image using jquery and animate.css.
 * http://git.blivesta.com/crosscover
 * License : MIT
 * Author : blivesta <enmt@blivesta.com> (http://blivesta.com/)
 */
;(function(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function($) {
  'use strict';
  var namespace = 'crosscover';
  var __ = {
    init: function(options) {
      options = $.extend({
        animateInClass: 'fade-in',
        animateOutClass: 'fade-out',
        interval: 5000,
        startIndex: 0,
        autoPlay: true,
        controller: true,
        controllerClass: 'crosscover-controller',
        prevClass: 'crosscover-prev',
        nextClass: 'crosscover-next',
        playerClass: 'crosscover-player',
        playerActiveClass: 'is-playing',
        playerInnerHtml: '<span class="crosscover-icon-player"></span>',
        prevInnerHtml: '<span class="crosscover-icon-prev"></span>',
        nextInnerHtml: '<span class="crosscover-icon-next"></span>'
      }, options);

      __.settings = {
        currentIndex: options.startIndex,
        timer: null,
        coverBaseClass:'crosscover-cover',
        coverWaitClass:'is-wait',
        coverActiveClass:'is-active'
      };

      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);
        var $item = $this.children('.crosscover-list').children('li');

        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, {
            options: options
          });

          if (options.controller) __.createControler.call(_this, $item);

          __.setup.call(_this, $item);

        }
      });
    },

    setup: function($item) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      $item.each(function(index) {
        var $self = $(this);
        var image = $self.find('img').attr('src');
        $self
          .addClass(__.settings.coverBaseClass, __.settings.coverWaitClass)
          .css({
            'background-image': 'url(' + image + ')'
          });
      });

      return __.slideStart.call(_this, $item);

    },

    slideStart: function($item) {
      var _this = this;

      __.autoPlayStart.call(_this, $item);
      __.show.call(_this, $item);
    },

    createControler: function($item) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var isClass = options.autoPlay ? options.playerActiveClass : null;

      $this
        .append(
          $('<div>')
          .attr({
            'data-crosscover-controller': ''
          })
          .addClass(options.controllerClass)
          .append(
            $('<button>')
            .attr({
              'data-crosscover-prev': ''
            })
            .addClass(options.prevClass)
            .html(options.prevInnerHtml)
          )
          .append(
            $('<button>')
            .attr({
              'data-crosscover-player': ''
            })
            .addClass(options.playerClass)
            .addClass(isClass)
            .html(options.playerInnerHtml)
          )
          .append(
            $('<button>')
            .attr({
              'data-crosscover-next': ''
            })
            .addClass(options.nextClass)
            .html(options.nextInnerHtml)
          )
        );

      return __.addControler.call(_this, $item);
    },

    addControler: function($item) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var $controller = $this.children('[data-crosscover-controller]');
      var $navPrev = $controller.children('[data-crosscover-prev]');
      var $navNext = $controller.children('[data-crosscover-next]');
      var $navPlayPause = $controller.children('[data-crosscover-player]');

      $navPlayPause.on('click.' + namespace, function(event) {
        $(this).blur();
        return __.playToggle.call(_this, $item, $(this));
      });

      $navPrev.on('click.' + namespace, function(event) {
        $(this).blur();
        return __.toggle.call(_this, $item, 'prev');
      });

      $navNext.on('click.' + namespace, function(event) {
        $(this).blur();
        return __.toggle.call(_this, $item, 'next');
      });

    },

    playToggle: function($item) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var $navPlayPause = $this.find('[data-crosscover-player]');

      if (options.autoPlay) {

        options.autoPlay = false;

        $navPlayPause
          .removeClass(options.playerActiveClass)
          .addClass(options.playClass);

        return __.autoPlayStop.call(_this);
      } else {

        options.autoPlay = true;

        $navPlayPause.addClass(options.playerActiveClass);

        return __.autoPlayStart.call(_this, $item);
      }
    },

    toggle: function($item, setting) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      __.hide.call(_this, $item);

      if (setting === 'next') {
        __.settings.currentIndex++;
      } else if (setting === 'prev') {
        __.settings.currentIndex--;
      }

      if (__.settings.currentIndex >= $item.length) {
        __.settings.currentIndex = 0;
      } else if (__.settings.currentIndex <= -1) {
        __.settings.currentIndex = $item.length - 1;
      }

      __.autoPlayStart.call(_this, $item);

      return __.show.call(_this, $item);
    },

    show: function($item) {
      var $this = $(this);
      var options = $this.data(namespace).options;

      return $item
        .eq(__.settings.currentIndex)
        .addClass(__.settings.coverActiveClass)
        .removeClass(__.settings.coverWaitClass)
        .addClass(options.animateInClass)
        .csscallbacks('animationEnd',function() {
          $(this)
          .removeClass(options.animateInClass + ' ' + __.settings.coverWaitClass)
          .addClass(__.settings.coverActiveClass);
        });
    },

    hide: function($item) {
      var $this = $(this);
      var options = $this.data(namespace).options;

      return $item
        .eq(__.settings.currentIndex)
        .addClass(__.settings.coverWaitClass)
        .removeClass(__.settings.coverActiveClass)
        .addClass(options.animateOutClass)
        .csscallbacks('animationEnd', function() {
          $(this)
            .removeClass(options.animateOutClass + ' ' + __.settings.coverActiveClass)
            .addClass(__.settings.coverWaitClass);
        });
    },

    autoPlayStart: function($item) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;

      if (options.autoPlay) {

        __.autoPlayStop.call(_this);

        __.settings.timer = setTimeout(function() {
          __.toggle.call(_this, $item, 'next');
          __.autoPlayStart.call(_this, $item);
        }, options.interval);

      }
      return _this;
    },

    autoPlayStop: function() {
      return clearTimeout(__.settings.timer);
    },

    currentIndex: function() {
      return __.settings.currentIndex;
    }

  };

  $.fn.crosscover = function(method) {
    if (__[method]) {
      return __[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return __.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.' + namespace);
    }
  };

  $.fn.csscallbacks = function(type, callback){

    var _animationStart = 'animationstart webkitAnimationStart oAnimationStart';
    var _animationEnd = 'animationend webkitAnimationEnd oAnimationEnd';
    var _transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd";

    if(type === 'animationStart'){
      type = _animationStart;
    } else if(type === 'animationEnd'){
      type = _animationEnd;
    } else if(type === 'transitionEnd'){
      type = _transitionEnd;
    }

    return this.each(function(index) {
      var $this = $(this);
      $this.on(type, function(){
        $this.off(type);
        return callback.call(this);
      });
    });

  };

}));
