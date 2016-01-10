(function() {
  'use strict';
  var $, Component,
    __slice = [].slice;

  $ = jQuery;

  /*
  JS component base class.
  
  Elements: any HTML element with class name that follow a pattern `.js-name` where `name` is an element name.
  
  States: any class on component root HTML node that follow a pattern `.is-state` where `state` is a state name.
  After initialization all components will have `ok` state.
  
  Example:
  
    class Pony extends Component
      init: ->
        @on('click', 'toggle', @toggle)
      toggle: ->
        @toggleState('pink')
  
    tamia.initComponents(pony: Pony)
  
    <div class="pink-pony is-pink" data-component="pony">
      <button class="pink-pony__button js-toggle">To pink or not to pink?</div>
    </div>
  */


  Component = (function() {
    function Component(elem) {
      if (!elem || elem.nodeType !== 1) {
        throw new ReferenceError('No DOM node passed to Component constructor.');
      }
      this.elemNode = elem;
      this.elem = $(elem);
      this.initializable = this.isInitializable();
      if (!this.initializable) {
        return;
      }
      this._fillStates();
      if (this.isSupported()) {
        this.handlers = {};
        this.init();
        this.addState('ok');
      } else {
        this.fallback();
        this.addState('unsupported');
      }
    }

    /*
    	Put all your initialization code in this method.
    */


    Component.prototype.init = function() {};

    /*
    	You can implement this method to do destroy component.
    */


    Component.prototype.destroy = function() {};

    /*
    	Implement this method if you want to check whether browser is good for your component or not.
    
    	@returns {Boolean}
    */


    Component.prototype.isSupported = function() {
      return true;
    };

    /*
    	Implement this method if you want to check whether component could be initialized.
    
    	Example:
    
    	  isInitializable: ->
    	    # Do not initialize component if it's not visible
    	    @isVisible()
    
    	@return {Boolean}
    */


    Component.prototype.isInitializable = function() {
      return true;
    };

    /*
    	You can implement this method to do some fallbacks. It will be called if isSupported() returns false.
    */


    Component.prototype.fallback = function() {};

    /*
    	Finds element.
    
    	@param {String} name Element ID.
    
    	@return {jQuery} Element with .js-name class.
    */


    Component.prototype.find = function(name) {
      return this.elem.find(".js-" + name).first();
    };

    /*
    	Attaches event handler.
    
    	@param {String} events Event names (space separated).
    	@param {String} [element] Element id.
    	@param {Function} handler Handler function (scope will automatically sets to this).
    */


    Component.prototype.on = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._toggleEvent.apply(this, ['on'].concat(__slice.call(args)));
    };

    /*
    	Detaches event handler.
    
    	@param {String} events Event names (space separated).
    	@param {String} [element] Element id.
    	@param {Function} handler Handler function (scope will automatically sets to this).
    */


    Component.prototype.off = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this._toggleEvent.apply(this, ['off'].concat(__slice.call(args)));
    };

    /*
    	Returns component state.
    
    	@param {String} [name] State name.
    
    	@return {Boolean} Sate value.
    */


    Component.prototype.hasState = function(name) {
      return !!this.states[name];
    };

    /*
    	Sets state to true.
    
    	@param {String} [name] State name.
    */


    Component.prototype.addState = function(name) {
      return this.toggleState(name, true);
    };

    /*
    	Sets state to false.
    
    	@param {String} [name] State name.
    */


    Component.prototype.removeState = function(name) {
      return this.toggleState(name, false);
    };

    /*
    	Toggles state value.
    
    	@param {String} [name] State name.
    	@param {Boolean} [value] State value.
    */


    Component.prototype.toggleState = function(name, value) {
      if (value == null) {
        value = !this.states[name];
      }
      this.states[name] = value;
      return this._updateStates();
    };

    /*
    	Returns component visibility.
    
    	@return {Boolean}
    */


    Component.prototype.isVisible = function() {
      return !!(this.elemNode.offsetWidth || this.elemNode.offsetHeight);
    };

    Component.prototype._toggleEvent = function() {
      var action, args, func, funcArg, handler, _ref;
      action = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof args[1] === 'string') {
        args[1] = ".js-" + args[1];
      }
      funcArg = args.length - 1;
      func = args[funcArg];
      handler;
      if (this.handlers[func]) {
        handler = this.handlers[func];
      }
      if (action === 'on') {
        if (handler) {
          handler.counter++;
        } else {
          this.handlers[func] = handler = {
            counter: 1,
            func: func.bind(this)
          };
        }
      }
      if (!handler) {
        return;
      }
      args[funcArg] = handler.func;
      (_ref = this.elem)[action].apply(_ref, args);
      if (action === 'off') {
        handler.counter--;
        if (handler.counter <= 0) {
          return this.handlers[func] = null;
        }
      }
    };

    Component.prototype._fillStates = function() {
      var classes, cls, clsName, re, states;
      states = {};
      classes = this.elemNode.className.split(' ');
      for (clsName in classes) {
        cls = classes[clsName];
        re = /^is-/;
        if (re.test(cls)) {
          states[cls.replace(re, '')] = true;
        }
      }
      return this.states = states;
    };

    Component.prototype._updateStates = function() {
      var classes, name;
      classes = this.elemNode.className;
      classes = $.trim(classes.replace(/\bis-[-\w]+/g, ''));
      classes = classes.split(/\s+/);
      for (name in this.states) {
        if (this.states[name]) {
          classes.push("is-" + name);
        }
      }
      return this.elemNode.className = classes.join(' ');
    };

    return Component;

  })();

  Component.__tamia_cmpnt__ = true;

  window.Component = Component;

}).call(this);
