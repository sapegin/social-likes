(function() {
  'use strict';
  var $, Password, supported, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  supported = void 0;

  Password = (function(_super) {
    __extends(Password, _super);

    function Password() {
      _ref = Password.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Password.prototype.init = function() {
      this.types = {
        locked: 'password',
        unlocked: 'text'
      };
      this.fieldElem = this.find('field');
      this.toggleElem = this.find('toggle');
      return this.on('mousedown', 'toggle', this.toggle);
    };

    Password.prototype.isSupported = function() {
      if (supported !== void 0) {
        return supported;
      }
      supported = $('<!--[if lte IE 8]><i></i><![endif]-->').find('i').length !== 1;
      return supported;
    };

    Password.prototype.toggle = function() {
      var fieldType, focused, locked,
        _this = this;
      focused = document.activeElement === this.fieldElem[0];
      locked = this.hasState('unlocked');
      fieldType = this.fieldElem.attr('type');
      this.toggleState('unlocked');
      if (fieldType === this.types.locked && !locked) {
        this.fieldElem.attr('type', this.types.unlocked);
      } else if (fieldType === this.types.unlocked && locked) {
        this.fieldElem.attr('type', this.types.locked);
      }
      if (focused) {
        return setTimeout((function() {
          return _this.fieldElem.focus();
        }), 0);
      }
    };

    return Password;

  })(Component);

  tamia.initComponents({
    password: Password
  });

}).call(this);
