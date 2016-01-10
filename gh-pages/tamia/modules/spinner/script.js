(function() {
  'use strict';
  var $, Loader, _loaderTmpl, _ref, _shadeSelector, _wrapperClass,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  _wrapperClass = 'loader-wrapper';

  _shadeSelector = '.loader-shade';

  _loaderTmpl = '<div class="loader-shade">\n	<div class="l-center">\n		<div class="l-center-i">\n			<div class="spinner spinner_big"></div>\n		</div>\n	</div>\n</div>';

  Loader = (function(_super) {
    __extends(Loader, _super);

    function Loader() {
      _ref = Loader.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Loader.prototype.init = function() {
      var _this = this;
      this.initHtml();
      return setTimeout((function() {
        return _this.addState('loading');
      }), 0);
    };

    Loader.prototype.destroy = function() {
      var _this = this;
      this.removeState('loading');
      return this.elem.find(_shadeSelector).afterTransition(function() {
        _this.elem.removeClass(_wrapperClass);
        return _this.loader.remove();
      });
    };

    Loader.prototype.initHtml = function() {
      this.elem.addClass(_wrapperClass);
      this.loader = $(_loaderTmpl);
      return this.elem.append(this.loader);
    };

    return Loader;

  })(Component);

  tamia.registerEvents({
    'loading-start': function(elem) {
      var container;
      container = $(elem);
      if (container.data('loader')) {
        return;
      }
      return container.data('loader', new Loader(elem));
    },
    'loading-stop': function(elem) {
      var container, loader;
      container = $(elem);
      loader = container.data('loader');
      if (!loader) {
        return;
      }
      loader.destroy();
      return container.removeData('loader');
    }
  });

}).call(this);
