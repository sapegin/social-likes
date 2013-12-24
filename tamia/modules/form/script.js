(function() {
  'use strict';
  var $, _disabledClass, _enableDisable, _formElementsSelector;

  $ = jQuery;

  _formElementsSelector = '.field,.button,.disablable';

  _disabledClass = 'is-disabled';

  _enableDisable = function(elem, enable) {
    var formElements;
    formElements = ($(elem)).find(_formElementsSelector).addBack(_formElementsSelector);
    formElements[enable ? 'removeClass' : 'addClass'](_disabledClass);
    return formElements.attr('disabled', !enable);
  };

  tamia.registerEvents({
    /*
    	Enables all descendant form elements.
    */

    enable: function(elem) {
      return _enableDisable(elem, true);
    },
    /*
    	Disables all descendant form elements.
    */

    disable: function(elem) {
      return _enableDisable(elem, false);
    }
  });

}).call(this);
