(function() {
  'use strict';
  var $, Select, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  Select = (function(_super) {
    __extends(Select, _super);

    function Select() {
      _ref = Select.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Select.prototype.init = function() {
      this.selectElem = this.find('select');
      this.boxElem = this.find('box');
      this.on('focus', 'select', this.focus);
      this.on('blur', 'select', this.blur);
      this.on('change', 'select', this.change);
      return this.change();
    };

    Select.prototype.focus = function() {
      return this.addState('focused');
    };

    Select.prototype.blur = function() {
      return this.removeState('focused');
    };

    Select.prototype.change = function() {
      return this.boxElem.text(this.selectElem.find(':selected').text());
    };

    return Select;

  })(Component);

  tamia.initComponents({
    select: Select
  });

}).call(this);
