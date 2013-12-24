(function() {
  'use strict';
  var $, Flippable, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  Flippable = (function(_super) {
    __extends(Flippable, _super);

    function Flippable() {
      _ref = Flippable.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Flippable.prototype.init = function() {
      if (this.elem.hasClass('js-flip')) {
        return this.on('click', this.toggle);
      } else {
        return this.on('click', 'flip', this.toggle);
      }
    };

    Flippable.prototype.toggle = function() {
      this.toggleState('flipped');
      return this.elem.trigger('flipped.tamia', this.hasState('flipped'));
    };

    return Flippable;

  })(Component);

  tamia.initComponents({
    flippable: Flippable
  });

}).call(this);
