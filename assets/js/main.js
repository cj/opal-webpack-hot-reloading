/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://local.sh:8080/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(6);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function(undefined) {
	  if (typeof(this.Opal) !== 'undefined') {
	    console.warn('Opal already loaded. Loading twice can cause troubles, please fix your setup.');
	    return this.Opal;
	  }
	
	  var nil;
	
	  // The actual class for BasicObject
	  var BasicObject;
	
	  // The actual Object class.
	  // The leading underscore is to avoid confusion with window.Object()
	  var _Object;
	
	  // The actual Module class
	  var Module;
	
	  // The actual Class class
	  var Class;
	
	  // Constructor for instances of BasicObject
	  function BasicObject_alloc(){}
	
	  // Constructor for instances of Object
	  function Object_alloc(){}
	
	  // Constructor for instances of Class
	  function Class_alloc(){}
	
	  // Constructor for instances of Module
	  function Module_alloc(){}
	
	  // Constructor for instances of NilClass (nil)
	  function NilClass_alloc(){}
	
	  // The Opal object that is exposed globally
	  var Opal = this.Opal = {};
	
	  // All bridged classes - keep track to donate methods from Object
	  var bridges = {};
	
	  // TopScope is used for inheriting constants from the top scope
	  var TopScope = function(){};
	
	  // Opal just acts as the top scope
	  TopScope.prototype = Opal;
	
	  // To inherit scopes
	  Opal.constructor = TopScope;
	
	  // List top scope constants
	  Opal.constants = [];
	
	  // This is a useful reference to global object inside ruby files
	  Opal.global = this;
	
	  // Minify common function calls
	  var $hasOwn = Opal.hasOwnProperty;
	  var $slice  = Opal.slice = Array.prototype.slice;
	
	  // Nil object id is always 4
	  var nil_id = 4;
	
	  // Generates even sequential numbers greater than 4
	  // (nil_id) to serve as unique ids for ruby objects
	  var unique_id = nil_id;
	
	  // Return next unique id
	  Opal.uid = function() {
	    unique_id += 2;
	    return unique_id;
	  };
	
	  // Table holds all class variables
	  Opal.cvars = {};
	
	  // Globals table
	  Opal.gvars = {};
	
	  // Exit function, this should be replaced by platform specific implementation
	  // (See nodejs and phantom for examples)
	  Opal.exit = function(status) { if (Opal.gvars.DEBUG) console.log('Exited with status '+status); };
	
	  // keeps track of exceptions for $!
	  Opal.exceptions = [];
	
	  // Get a constant on the given scope. Every class and module in Opal has a
	  // scope used to store, and inherit, constants. For example, the top level
	  // `Object` in ruby has a scope accessible as `Opal.Object.$$scope`.
	  //
	  // To get the `Array` class using this scope, you could use:
	  //
	  //     Opal.Object.$$scope.get("Array")
	  //
	  // If a constant with the given name cannot be found, then a dispatch to the
	  // class/module's `#const_method` is called, which by default will raise an
	  // error.
	  //
	  // @param [String] name the name of the constant to lookup
	  // @return [RubyObject]
	  //
	  Opal.get = function(name) {
	    var constant = this[name];
	
	    if (constant == null) {
	      return this.base.$const_get(name);
	    }
	
	    return constant;
	  };
	
	  // Create a new constants scope for the given class with the given
	  // base. Constants are looked up through their parents, so the base
	  // scope will be the outer scope of the new klass.
	  //
	  // @param base_scope [$$scope] the scope in which the new scope should be created
	  // @param klass      [Class]
	  // @param id         [String, null] the name of the newly created scope
	  //
	  Opal.create_scope = function(base_scope, klass, id) {
	    var const_alloc = function() {};
	    var const_scope = const_alloc.prototype = new base_scope.constructor();
	
	    klass.$$scope       = const_scope;
	    klass.$$base_module = base_scope.base;
	
	    const_scope.base        = klass;
	    const_scope.constructor = const_alloc;
	    const_scope.constants   = [];
	
	    if (id) {
	      Opal.cdecl(base_scope, id, klass);
	      const_alloc.displayName = id+"_scope_alloc";
	    }
	  }
	
	  // A `class Foo; end` expression in ruby is compiled to call this runtime
	  // method which either returns an existing class of the given name, or creates
	  // a new class in the given `base` scope.
	  //
	  // If a constant with the given name exists, then we check to make sure that
	  // it is a class and also that the superclasses match. If either of these
	  // fail, then we raise a `TypeError`. Note, superklass may be null if one was
	  // not specified in the ruby code.
	  //
	  // We pass a constructor to this method of the form `function ClassName() {}`
	  // simply so that classes show up with nicely formatted names inside debuggers
	  // in the web browser (or node/sprockets).
	  //
	  // The `base` is the current `self` value where the class is being created
	  // from. We use this to get the scope for where the class should be created.
	  // If `base` is an object (not a class/module), we simple get its class and
	  // use that as the base instead.
	  //
	  // @param base        [Object] where the class is being created
	  // @param superklass  [Class,null] superclass of the new class (may be null)
	  // @param id          [String] the name of the class to be created
	  // @param constructor [Function] function to use as constructor
	  //
	  // @return new [Class]  or existing ruby class
	  //
	  Opal.klass = function(base, superklass, id, constructor) {
	    var klass, bridged, alloc;
	
	    // If base is an object, use its class
	    if (!base.$$is_class && !base.$$is_module) {
	      base = base.$$class;
	    }
	
	    // If the superclass is a function then we're bridging a native JS class
	    if (typeof(superklass) === 'function') {
	      bridged = superklass;
	      superklass = _Object;
	    }
	
	    // Try to find the class in the current scope
	    klass = base.$$scope[id];
	
	    // If the class exists in the scope, then we must use that
	    if (klass && klass.$$orig_scope === base.$$scope) {
	      // Make sure the existing constant is a class, or raise error
	      if (!klass.$$is_class) {
	        throw Opal.TypeError.$new(id + " is not a class");
	      }
	
	      // Make sure existing class has same superclass
	      if (superklass && klass.$$super !== superklass) {
	        throw Opal.TypeError.$new("superclass mismatch for class " + id);
	      }
	
	      return klass;
	    }
	
	    // Class doesnt exist, create a new one with given superclass...
	
	    // Not specifying a superclass means we can assume it to be Object
	    if (superklass == null) {
	      superklass = _Object;
	    }
	
	    // If bridged the JS class will also be the alloc function
	    alloc = bridged || boot_class_alloc(id, constructor, superklass);
	
	    // Create the class object (instance of Class)
	    klass = boot_class_object(id, superklass, alloc);
	
	    // Name the class
	    klass.$$name = id;
	    klass.displayName = id;
	
	    // Mark the object as a class
	    klass.$$is_class = true;
	
	    // Every class gets its own constant scope, inherited from current scope
	    Opal.create_scope(base.$$scope, klass, id);
	
	    // Name new class directly onto current scope (Opal.Foo.Baz = klass)
	    base[id] = base.$$scope[id] = klass;
	
	    if (bridged) {
	      Opal.bridge(klass, alloc);
	    }
	    else {
	      // Copy all parent constants to child, unless parent is Object
	      if (superklass !== _Object && superklass !== BasicObject) {
	        donate_constants(superklass, klass);
	      }
	
	      // Call .inherited() hook with new class on the superclass
	      if (superklass.$inherited) {
	        superklass.$inherited(klass);
	      }
	    }
	
	    return klass;
	  };
	
	  // Create generic class with given superclass.
	  Opal.boot_class = function(superklass, constructor) {
	    var alloc = boot_class_alloc(null, constructor, superklass)
	
	    return boot_class_object(null, superklass, alloc);
	  }
	
	  // The class object itself (as in `Class.new`)
	  //
	  // @param superklass [(Opal) Class] Another class object (as in `Class.new`)
	  // @param alloc      [constructor]  The constructor that holds the prototype
	  //                                  that will be used for instances of the
	  //                                  newly constructed class.
	  function boot_class_object(id, superklass, alloc) {
	    // Grab the superclass prototype and use it to build an intermediary object
	    // in the prototype chain.
	    function Superclass_alloc_proxy() {};
	    Superclass_alloc_proxy.prototype = superklass.constructor.prototype;
	    function SingletonClass_alloc() {}
	    SingletonClass_alloc.prototype = new Superclass_alloc_proxy();
	
	    if (id) {
	      SingletonClass_alloc.displayName = "SingletonClass_alloc("+id+")";
	    }
	
	    // The built class is the only instance of its singleton_class
	    var klass = new SingletonClass_alloc();
	
	    setup_module_or_class_object(klass, SingletonClass_alloc, superklass, alloc.prototype);
	
	    // @property $$alloc This is the constructor of instances of the current
	    //                   class. Its prototype will be used for method lookup
	    klass.$$alloc = alloc;
	
	    // @property $$proto.$$class Make available to instances a reference to the
	    //                           class they belong to.
	    klass.$$proto.$$class = klass;
	
	    return klass;
	  }
	
	  // Adds common/required properties to a module or class object
	  // (as in `Module.new` / `Class.new`)
	  //
	  // @param module      The module or class that needs to be prepared
	  //
	  // @param constructor The constructor of the module or class itself,
	  //                    usually it's already assigned by using `new`. Some
	  //                    ipothesis on why it's needed can be found below.
	  //
	  // @param superklass  The superclass of the class/module object, for modules
	  //                    is `Module` (of `Module` in JS context)
	  //
	  // @param prototype   The prototype on which the class/module methods will
	  //                    be stored.
	  //
	  function setup_module_or_class_object(module, constructor, superklass, prototype) {
	    // @property $$id Each class is assigned a unique `id` that helps
	    //                comparation and implementation of `#object_id`
	    module.$$id = Opal.uid();
	
	    // @property $$proto This is the prototype on which methods will be defined
	    module.$$proto = prototype;
	
	    // @property constructor keeps a ref to the constructor, but apparently the
	    //                       constructor is already set on:
	    //
	    //                          `var module = new constructor` is called.
	    //
	    //                       Maybe there are some browsers not abiding (IE6?)
	    module.constructor = constructor;
	
	    if (superklass === Module) {
	      // @property $$is_module Clearly mark this as a module
	      module.$$is_module = true;
	      module.$$class     = Module;
	    }
	    else {
	      // @property $$is_class Clearly mark this as a class
	      module.$$is_class = true;
	      module.$$class    = Class;
	    }
	
	    // @property $$super the superclass, doesn't get changed by module inclusions
	    module.$$super = superklass;
	
	    // @property $$parent direct parent class or module
	    //                    starts with the superclass, after module inclusion is
	    //                    the last included module
	    module.$$parent = superklass;
	
	    // @property $$inc included modules
	    module.$$inc = [];
	  }
	
	  // Define new module (or return existing module). The given `base` is basically
	  // the current `self` value the `module` statement was defined in. If this is
	  // a ruby module or class, then it is used, otherwise if the base is a ruby
	  // object then that objects real ruby class is used (e.g. if the base is the
	  // main object, then the top level `Object` class is used as the base).
	  //
	  // If a module of the given name is already defined in the base, then that
	  // instance is just returned.
	  //
	  // If there is a class of the given name in the base, then an error is
	  // generated instead (cannot have a class and module of same name in same base).
	  //
	  // Otherwise, a new module is created in the base with the given name, and that
	  // new instance is returned back (to be referenced at runtime).
	  //
	  // @param  base [Module, Class] class or module this definition is inside
	  // @param  id [String] the name of the new (or existing) module
	  // @return [Module]
	  //
	  Opal.module = function(base, id) {
	    var module;
	
	    if (!base.$$is_class && !base.$$is_module) {
	      base = base.$$class;
	    }
	
	    if ($hasOwn.call(base.$$scope, id)) {
	      module = base.$$scope[id];
	
	      if (!module.$$is_module && module !== _Object) {
	        throw Opal.TypeError.$new(id + " is not a module");
	      }
	    }
	    else {
	      module = boot_module_object();
	
	      // name module using base (e.g. Foo or Foo::Baz)
	      module.$$name = id;
	
	      // mark the object as a module
	      module.$$is_module = true;
	
	      // initialize dependency tracking
	      module.$$dep = [];
	
	      Opal.create_scope(base.$$scope, module, id);
	
	      // Name new module directly onto current scope (Opal.Foo.Baz = module)
	      base[id] = base.$$scope[id] = module;
	    }
	
	    return module;
	  };
	
	  // Internal function to create a new module instance. This simply sets up
	  // the prototype hierarchy and method tables.
	  //
	  function boot_module_object() {
	    var mtor = function() {};
	    mtor.prototype = Module_alloc.prototype;
	
	    function module_constructor() {}
	    module_constructor.prototype = new mtor();
	
	    var module = new module_constructor();
	    var module_prototype = {};
	
	    setup_module_or_class_object(module, module_constructor, Module, module_prototype);
	
	    return module;
	  }
	
	  // Make `boot_module_object` available to the JS-API
	  Opal.boot_module_object = boot_module_object;
	
	  // Return the singleton class for the passed object.
	  //
	  // If the given object alredy has a singleton class, then it will be stored on
	  // the object as the `$$meta` property. If this exists, then it is simply
	  // returned back.
	  //
	  // Otherwise, a new singleton object for the class or object is created, set on
	  // the object at `$$meta` for future use, and then returned.
	  //
	  // @param [RubyObject] object the ruby object
	  // @return [RubyClass] the singleton class for object
	  //
	  Opal.get_singleton_class = function(object) {
	    if (object.$$meta) {
	      return object.$$meta;
	    }
	
	    if (object.$$is_class || object.$$is_module) {
	      return build_class_singleton_class(object);
	    }
	
	    return build_object_singleton_class(object);
	  };
	
	  // Build the singleton class for an existing class.
	  //
	  // NOTE: Actually in MRI a class' singleton class inherits from its
	  // superclass' singleton class which in turn inherits from Class.
	  //
	  // @param [RubyClass] klass
	  // @return [RubyClass]
	  //
	  function build_class_singleton_class(klass) {
	    var meta = new Opal.Class.$$alloc();
	
	    meta.$$class = Opal.Class;
	    meta.$$proto = klass.constructor.prototype;
	
	    meta.$$is_singleton = true;
	    meta.$$singleton_of = klass;
	    meta.$$inc          = [];
	    meta.$$scope        = klass.$$scope;
	
	    return klass.$$meta = meta;
	  }
	
	  // Build the singleton class for a Ruby (non class) Object.
	  //
	  // @param [RubyObject] object
	  // @return [RubyClass]
	  //
	  function build_object_singleton_class(object) {
	    var orig_class = object.$$class,
	        class_id   = "#<Class:#<" + orig_class.$$name + ":" + orig_class.$$id + ">>";
	
	    var Singleton = function() {};
	    var meta = Opal.boot_class(orig_class, Singleton);
	    meta.$$name   = class_id;
	
	    meta.$$proto  = object;
	    meta.$$class  = orig_class.$$class;
	    meta.$$scope  = orig_class.$$scope;
	    meta.$$parent = orig_class;
	    meta.$$is_singleton = true;
	    meta.$$singleton_of = object;
	
	    return object.$$meta = meta;
	  }
	
	  // Bridges a single method.
	  function bridge_method(target, from, name, body) {
	    var ancestors, i, ancestor, length;
	
	    ancestors = target.$$bridge.$ancestors();
	
	    // order important here, we have to check for method presence in
	    // ancestors from the bridged class to the last ancestor
	    for (i = 0, length = ancestors.length; i < length; i++) {
	      ancestor = ancestors[i];
	
	      if ($hasOwn.call(ancestor.$$proto, name) &&
	          ancestor.$$proto[name] &&
	          !ancestor.$$proto[name].$$donated &&
	          !ancestor.$$proto[name].$$stub &&
	          ancestor !== from) {
	        break;
	      }
	
	      if (ancestor === from) {
	        target.prototype[name] = body
	        break;
	      }
	    }
	
	  }
	
	  // Bridges from *donator* to a *target*.
	  function _bridge(target, donator) {
	    var id, methods, method, i, bridged;
	
	    if (typeof(target) === "function") {
	      id      = donator.$__id__();
	      methods = donator.$instance_methods();
	
	      for (i = methods.length - 1; i >= 0; i--) {
	        method = '$' + methods[i];
	
	        bridge_method(target, donator, method, donator.$$proto[method]);
	      }
	
	      if (!bridges[id]) {
	        bridges[id] = [];
	      }
	
	      bridges[id].push(target);
	    }
	    else {
	      bridged = bridges[target.$__id__()];
	
	      if (bridged) {
	        for (i = bridged.length - 1; i >= 0; i--) {
	          _bridge(bridged[i], donator);
	        }
	
	        bridges[donator.$__id__()] = bridged.slice();
	      }
	    }
	  }
	
	  // The actual inclusion of a module into a class.
	  //
	  // ## Class `$$parent` and `iclass`
	  //
	  // To handle `super` calls, every class has a `$$parent`. This parent is
	  // used to resolve the next class for a super call. A normal class would
	  // have this point to its superclass. However, if a class includes a module
	  // then this would need to take into account the module. The module would
	  // also have to then point its `$$parent` to the actual superclass. We
	  // cannot modify modules like this, because it might be included in more
	  // then one class. To fix this, we actually insert an `iclass` as the class'
	  // `$$parent` which can then point to the superclass. The `iclass` acts as
	  // a proxy to the actual module, so the `super` chain can then search it for
	  // the required method.
	  //
	  // @param [RubyModule] module the module to include
	  // @param [RubyClass] klass the target class to include module into
	  // @return [null]
	  //
	  Opal.append_features = function(module, klass) {
	    var iclass, donator, prototype, methods, id, i;
	
	    // check if this module is already included in the class
	    for (i = klass.$$inc.length - 1; i >= 0; i--) {
	      if (klass.$$inc[i] === module) {
	        return;
	      }
	    }
	
	    klass.$$inc.push(module);
	    module.$$dep.push(klass);
	    _bridge(klass, module);
	
	    // iclass
	    iclass = {
	      $$name:   module.$$name,
	      $$proto:  module.$$proto,
	      $$parent: klass.$$parent,
	      $$module: module,
	      $$iclass: true
	    };
	
	    klass.$$parent = iclass;
	
	    donator   = module.$$proto;
	    prototype = klass.$$proto;
	    methods   = module.$instance_methods();
	
	    for (i = methods.length - 1; i >= 0; i--) {
	      id = '$' + methods[i];
	
	      // if the target class already has a method of the same name defined
	      // and that method was NOT donated, then it must be a method defined
	      // by the class so we do not want to override it
	      if ( prototype.hasOwnProperty(id) &&
	          !prototype[id].$$donated &&
	          !prototype[id].$$stub) {
	        continue;
	      }
	
	      prototype[id] = donator[id];
	      prototype[id].$$donated = module;
	    }
	
	    donate_constants(module, klass);
	  };
	
	  // Boot a base class (makes instances).
	  function boot_class_alloc(id, constructor, superklass) {
	    if (superklass) {
	      var alloc_proxy = function() {};
	      alloc_proxy.prototype  = superklass.$$proto || superklass.prototype;
	      constructor.prototype = new alloc_proxy();
	    }
	
	    if (id) {
	      constructor.displayName = id+'_alloc';
	    }
	
	    constructor.prototype.constructor = constructor;
	
	    return constructor;
	  }
	
	  // Builds the class object for core classes:
	  // - make the class object have a singleton class
	  // - make the singleton class inherit from its parent singleton class
	  //
	  // @param id         [String]      the name of the class
	  // @param alloc      [Function]    the constructor for the core class instances
	  // @param superclass [Class alloc] the constructor of the superclass
	  //
	  function boot_core_class_object(id, alloc, superclass) {
	    var superclass_constructor = function() {};
	        superclass_constructor.prototype = superclass.prototype;
	
	    var singleton_class = function() {};
	        singleton_class.prototype = new superclass_constructor();
	
	    singleton_class.displayName = "#<Class:"+id+">";
	
	    // the singleton_class acts as the class object constructor
	    var klass = new singleton_class();
	
	    setup_module_or_class_object(klass, singleton_class, superclass, alloc.prototype);
	
	    klass.$$alloc     = alloc;
	    klass.$$name      = id;
	    klass.displayName = id;
	
	    // Give all instances a ref to their class
	    alloc.prototype.$$class = klass;
	
	    Opal[id] = klass;
	    Opal.constants.push(id);
	
	    return klass;
	  }
	
	  // For performance, some core Ruby classes are toll-free bridged to their
	  // native JavaScript counterparts (e.g. a Ruby Array is a JavaScript Array).
	  //
	  // This method is used to setup a native constructor (e.g. Array), to have
	  // its prototype act like a normal Ruby class. Firstly, a new Ruby class is
	  // created using the native constructor so that its prototype is set as the
	  // target for th new class. Note: all bridged classes are set to inherit
	  // from Object.
	  //
	  // Example:
	  //
	  //    Opal.bridge(self, Function);
	  //
	  // @param [Class] klass the Ruby class to bridge
	  // @param [Function] constructor native JavaScript constructor to use
	  // @return [Class] returns the passed Ruby class
	  //
	  Opal.bridge = function(klass, constructor) {
	    if (constructor.$$bridge) {
	      throw Opal.ArgumentError.$new("already bridged");
	    }
	
	    Opal.stub_subscribers.push(constructor.prototype);
	
	    constructor.prototype.$$class = klass;
	    constructor.$$bridge          = klass;
	
	    var ancestors = klass.$ancestors();
	
	    // order important here, we have to bridge from the last ancestor to the
	    // bridged class
	    for (var i = ancestors.length - 1; i >= 0; i--) {
	      _bridge(constructor, ancestors[i]);
	    }
	
	    for (var name in BasicObject_alloc.prototype) {
	      var method = BasicObject_alloc.prototype[method];
	
	      if (method && method.$$stub && !(name in constructor.prototype)) {
	        constructor.prototype[name] = method;
	      }
	    }
	
	    return klass;
	  }
	
	
	  // Constant assignment, see also `Opal.cdecl`
	  //
	  // @param base_module [Module, Class] the constant namespace
	  // @param name        [String] the name of the constant
	  // @param value       [Object] the value of the constant
	  //
	  // @example Assigning a namespaced constant
	  //   self::FOO = 'bar'
	  //
	  // @example Assigning with Module#const_set
	  //   Foo.const_set :BAR, 123
	  //
	  Opal.casgn = function(base_module, name, value) {
	    function update(klass, name) {
	      klass.$$name = name;
	
	      for (name in klass.$$scope) {
	        var value = klass.$$scope[name];
	
	        if (value.$$name === nil && (value.$$is_class || value.$$is_module)) {
	          update(value, name)
	        }
	      }
	    }
	
	    var scope = base_module.$$scope;
	
	    if (value.$$is_class || value.$$is_module) {
	      // Only checking _Object prevents setting a const on an anonymous class
	      // that has a superclass that's not Object
	      if (value.$$is_class || value.$$base_module === _Object) {
	        value.$$base_module = base_module;
	      }
	
	      if (value.$$name === nil && value.$$base_module.$$name !== nil) {
	        update(value, name);
	      }
	    }
	
	    scope.constants.push(name);
	    return scope[name] = value;
	  };
	
	  // constant decl
	  Opal.cdecl = function(base_scope, name, value) {
	    if ((value.$$is_class || value.$$is_module) && value.$$orig_scope == null) {
	      value.$$name = name;
	      value.$$orig_scope = base_scope;
	      base_scope.constructor[name] = value;
	    }
	
	    base_scope.constants.push(name);
	    return base_scope[name] = value;
	  };
	
	  // When a source module is included into the target module, we must also copy
	  // its constants to the target.
	  //
	  function donate_constants(source_mod, target_mod) {
	    var source_constants = source_mod.$$scope.constants,
	        target_scope     = target_mod.$$scope,
	        target_constants = target_scope.constants;
	
	    for (var i = 0, length = source_constants.length; i < length; i++) {
	      target_constants.push(source_constants[i]);
	      target_scope[source_constants[i]] = source_mod.$$scope[source_constants[i]];
	    }
	  };
	
	  // Donate methods for a module.
	  function donate(module, jsid) {
	    var included_in = module.$$dep,
	        body = module.$$proto[jsid],
	        i, length, includee, dest, current,
	        klass_includees, j, jj, current_owner_index, module_index;
	
	    if (!included_in) {
	      return;
	    }
	
	    for (i = 0, length = included_in.length; i < length; i++) {
	      includee = included_in[i];
	      dest = includee.$$proto;
	      current = dest[jsid];
	
	      if (dest.hasOwnProperty(jsid) && !current.$$donated && !current.$$stub) {
	        // target class has already defined the same method name - do nothing
	      }
	      else if (dest.hasOwnProperty(jsid) && !current.$$stub) {
	        // target class includes another module that has defined this method
	        klass_includees = includee.$$inc;
	
	        for (j = 0, jj = klass_includees.length; j < jj; j++) {
	          if (klass_includees[j] === current.$$donated) {
	            current_owner_index = j;
	          }
	          if (klass_includees[j] === module) {
	            module_index = j;
	          }
	        }
	
	        // only redefine method on class if the module was included AFTER
	        // the module which defined the current method body. Also make sure
	        // a module can overwrite a method it defined before
	        if (current_owner_index <= module_index) {
	          dest[jsid] = body;
	          dest[jsid].$$donated = module;
	        }
	      }
	      else {
	        // neither a class, or module included by class, has defined method
	        dest[jsid] = body;
	        dest[jsid].$$donated = module;
	      }
	
	      if (includee.$$dep) {
	        donate(includee, jsid);
	      }
	    }
	  };
	
	  // Methods stubs are used to facilitate method_missing in opal. A stub is a
	  // placeholder function which just calls `method_missing` on the receiver.
	  // If no method with the given name is actually defined on an object, then it
	  // is obvious to say that the stub will be called instead, and then in turn
	  // method_missing will be called.
	  //
	  // When a file in ruby gets compiled to javascript, it includes a call to
	  // this function which adds stubs for every method name in the compiled file.
	  // It should then be safe to assume that method_missing will work for any
	  // method call detected.
	  //
	  // Method stubs are added to the BasicObject prototype, which every other
	  // ruby object inherits, so all objects should handle method missing. A stub
	  // is only added if the given property name (method name) is not already
	  // defined.
	  //
	  // Note: all ruby methods have a `$` prefix in javascript, so all stubs will
	  // have this prefix as well (to make this method more performant).
	  //
	  //    Opal.add_stubs(["$foo", "$bar", "$baz="]);
	  //
	  // All stub functions will have a private `$$stub` property set to true so
	  // that other internal methods can detect if a method is just a stub or not.
	  // `Kernel#respond_to?` uses this property to detect a methods presence.
	  //
	  // @param [Array] stubs an array of method stubs to add
	  //
	  Opal.add_stubs = function(stubs) {
	    var subscriber, subscribers = Opal.stub_subscribers,
	        i, ilength = stubs.length,
	        j, jlength = subscribers.length,
	        method_name, stub;
	
	    for (i = 0; i < ilength; i++) {
	      method_name = stubs[i];
	      stub = stub_for(method_name);
	
	      for (j = 0; j < jlength; j++) {
	        subscriber = subscribers[j];
	
	        if (!(method_name in subscriber)) {
	          subscriber[method_name] = stub;
	        }
	      }
	    }
	  };
	
	  // Keep a list of prototypes that want method_missing stubs to be added.
	  //
	  // @default [Prototype List] BasicObject_alloc.prototype
	  //
	  Opal.stub_subscribers = [BasicObject_alloc.prototype];
	
	  // Add a method_missing stub function to the given prototype for the
	  // given name.
	  //
	  // @param [Prototype] prototype the target prototype
	  // @param [String] stub stub name to add (e.g. "$foo")
	  //
	  Opal.add_stub_for = function(prototype, stub) {
	    var method_missing_stub = stub_for(stub);
	    prototype[stub] = method_missing_stub;
	  }
	
	  // Generate the method_missing stub for a given method name.
	  //
	  // @param [String] method_name The js-name of the method to stub (e.g. "$foo")
	  //
	  function stub_for(method_name) {
	    function method_missing_stub() {
	      // Copy any given block onto the method_missing dispatcher
	      this.$method_missing.$$p = method_missing_stub.$$p;
	
	      // Set block property to null ready for the next call (stop false-positives)
	      method_missing_stub.$$p = null;
	
	      // call method missing with correct args (remove '$' prefix on method name)
	      return this.$method_missing.apply(this, [method_name.slice(1)].concat($slice.call(arguments)));
	    }
	
	    method_missing_stub.$$stub = true;
	
	    return method_missing_stub;
	  }
	
	  // Arity count error dispatcher
	  Opal.ac = function(actual, expected, object, meth) {
	    var inspect = '';
	    if (object.$$is_class || object.$$is_module) {
	      inspect += object.$$name + '.';
	    }
	    else {
	      inspect += object.$$class.$$name + '#';
	    }
	    inspect += meth;
	
	    throw Opal.ArgumentError.$new('[' + inspect + '] wrong number of arguments(' + actual + ' for ' + expected + ')');
	  };
	
	  // The Array of ancestors for a given module/class
	  Opal.ancestors = function(module_or_class) {
	    var parent = module_or_class,
	        result = [];
	
	    while (parent) {
	      result.push(parent);
	      for (var i=0; i < parent.$$inc.length; i++) {
	        result = result.concat(Opal.ancestors(parent.$$inc[i]));
	      }
	
	      parent = parent.$$is_class ? parent.$$super : null;
	    }
	
	    return result;
	  }
	
	  // Super dispatcher
	  Opal.find_super_dispatcher = function(obj, jsid, current_func, iter, defs) {
	    var dispatcher;
	
	    if (defs) {
	      if (obj.$$is_class || obj.$$is_module) {
	        dispatcher = defs.$$super;
	      }
	      else {
	        dispatcher = obj.$$class.$$proto;
	      }
	    }
	    else {
	      if (obj.$$is_class || obj.$$is_module) {
	        dispatcher = obj.$$super;
	      }
	      else {
	        dispatcher = find_obj_super_dispatcher(obj, jsid, current_func);
	      }
	    }
	
	    dispatcher = dispatcher['$' + jsid];
	    dispatcher.$$p = iter;
	
	    return dispatcher;
	  };
	
	  // Iter dispatcher for super in a block
	  Opal.find_iter_super_dispatcher = function(obj, jsid, current_func, iter, defs) {
	    if (current_func.$$def) {
	      return Opal.find_super_dispatcher(obj, current_func.$$jsid, current_func, iter, defs);
	    }
	    else {
	      return Opal.find_super_dispatcher(obj, jsid, current_func, iter, defs);
	    }
	  };
	
	  function find_obj_super_dispatcher(obj, jsid, current_func) {
	    var klass = obj.$$meta || obj.$$class;
	    jsid = '$' + jsid;
	
	    while (klass) {
	      if (klass.$$proto[jsid] === current_func) {
	        // ok
	        break;
	      }
	
	      klass = klass.$$parent;
	    }
	
	    // if we arent in a class, we couldnt find current?
	    if (!klass) {
	      throw new Error("could not find current class for super()");
	    }
	
	    klass = klass.$$parent;
	
	    // else, let's find the next one
	    while (klass) {
	      var working = klass.$$proto[jsid];
	
	      if (working && working !== current_func) {
	        // ok
	        break;
	      }
	
	      klass = klass.$$parent;
	    }
	
	    return klass.$$proto;
	  };
	
	  // Used to return as an expression. Sometimes, we can't simply return from
	  // a javascript function as if we were a method, as the return is used as
	  // an expression, or even inside a block which must "return" to the outer
	  // method. This helper simply throws an error which is then caught by the
	  // method. This approach is expensive, so it is only used when absolutely
	  // needed.
	  //
	  Opal.ret = function(val) {
	    Opal.returner.$v = val;
	    throw Opal.returner;
	  };
	
	  // handles yield calls for 1 yielded arg
	  Opal.yield1 = function(block, arg) {
	    if (typeof(block) !== "function") {
	      throw Opal.LocalJumpError.$new("no block given");
	    }
	
	    if (block.length > 1 && arg.$$is_array) {
	      return block.apply(null, arg);
	    }
	    else {
	      return block(arg);
	    }
	  };
	
	  // handles yield for > 1 yielded arg
	  Opal.yieldX = function(block, args) {
	    if (typeof(block) !== "function") {
	      throw Opal.LocalJumpError.$new("no block given");
	    }
	
	    if (block.length > 1 && args.length === 1) {
	      if (args[0].$$is_array) {
	        return block.apply(null, args[0]);
	      }
	    }
	
	    if (!args.$$is_array) {
	      args = $slice.call(args);
	    }
	
	    return block.apply(null, args);
	  };
	
	  // Finds the corresponding exception match in candidates.  Each candidate can
	  // be a value, or an array of values.  Returns null if not found.
	  Opal.rescue = function(exception, candidates) {
	    for (var i = 0; i < candidates.length; i++) {
	      var candidate = candidates[i];
	
	      if (candidate.$$is_array) {
	        var result = Opal.rescue(exception, candidate);
	
	        if (result) {
	          return result;
	        }
	      }
	      else if (candidate['$==='](exception)) {
	        return candidate;
	      }
	    }
	
	    return null;
	  };
	
	  Opal.is_a = function(object, klass) {
	    if (object.$$meta === klass) {
	      return true;
	    }
	
	    var search = object.$$class;
	
	    while (search) {
	      if (search === klass) {
	        return true;
	      }
	
	      for (var i = 0, length = search.$$inc.length; i < length; i++) {
	        if (search.$$inc[i] === klass) {
	          return true;
	        }
	      }
	
	      search = search.$$super;
	    }
	
	    return false;
	  };
	
	  // Helpers for implementing multiple assignment
	  // Our code for extracting the values and assigning them only works if the
	  // return value is a JS array
	  // So if we get an Array subclass, extract the wrapped JS array from it
	
	  Opal.to_ary = function(value) {
	    // Used for: a, b = something (no splat)
	    if (value.$$is_array) {
	      return (value.constructor === Array) ? value : value.literal;
	    }
	    else if (value['$respond_to?']('to_ary', true)) {
	      var ary = value.$to_ary();
	      if (ary === nil) {
	        return [value];
	      }
	      else if (ary.$$is_array) {
	        return (ary.constructor === Array) ? ary : ary.literal;
	      }
	      else {
	        throw Opal.TypeError.$new("Can't convert " + value.$$class +
	          " to Array (" + value.$$class + "#to_ary gives " + ary.$$class + ")");
	      }
	    }
	    else {
	      return [value];
	    }
	  };
	
	  Opal.to_a = function(value) {
	    // Used for: a, b = *something (with splat)
	    if (value.$$is_array) {
	      // A splatted array must be copied
	      return (value.constructor === Array) ? value.slice() : value.literal.slice();
	    }
	    else if (value['$respond_to?']('to_a', true)) {
	      var ary = value.$to_a();
	      if (ary === nil) {
	        return [value];
	      }
	      else if (ary.$$is_array) {
	        return (ary.constructor === Array) ? ary : ary.literal;
	      }
	      else {
	        throw Opal.TypeError.$new("Can't convert " + value.$$class +
	          " to Array (" + value.$$class + "#to_a gives " + ary.$$class + ")");
	      }
	    }
	    else {
	      return [value];
	    }
	  };
	
	  // Used to get a list of rest keyword arguments. Method takes the given
	  // keyword args, i.e. the hash literal passed to the method containing all
	  // keyword arguemnts passed to method, as well as the used args which are
	  // the names of required and optional arguments defined. This method then
	  // just returns all key/value pairs which have not been used, in a new
	  // hash literal.
	  //
	  // @param given_args [Hash] all kwargs given to method
	  // @param used_args [Object<String: true>] all keys used as named kwargs
	  // @return [Hash]
	  //
	  Opal.kwrestargs = function(given_args, used_args) {
	    var keys      = [],
	        map       = {},
	        key       = null,
	        given_map = given_args.$$smap;
	
	    for (key in given_map) {
	      if (!used_args[key]) {
	        keys.push(key);
	        map[key] = given_map[key];
	      }
	    }
	
	    return Opal.hash2(keys, map);
	  };
	
	  // Call a ruby method on a ruby object with some arguments:
	  //
	  //   var my_array = [1, 2, 3, 4]
	  //   Opal.send(my_array, 'length')     # => 4
	  //   Opal.send(my_array, 'reverse!')   # => [4, 3, 2, 1]
	  //
	  // A missing method will be forwarded to the object via
	  // method_missing.
	  //
	  // The result of either call with be returned.
	  //
	  // @param [Object] recv the ruby object
	  // @param [String] mid ruby method to call
	  //
	  Opal.send = function(recv, mid) {
	    var args = $slice.call(arguments, 2),
	        func = recv['$' + mid];
	
	    if (func) {
	      return func.apply(recv, args);
	    }
	
	    return recv.$method_missing.apply(recv, [mid].concat(args));
	  };
	
	  Opal.block_send = function(recv, mid, block) {
	    var args = $slice.call(arguments, 3),
	        func = recv['$' + mid];
	
	    if (func) {
	      func.$$p = block;
	      return func.apply(recv, args);
	    }
	
	    return recv.$method_missing.apply(recv, [mid].concat(args));
	  };
	
	  // Used to define methods on an object. This is a helper method, used by the
	  // compiled source to define methods on special case objects when the compiler
	  // can not determine the destination object, or the object is a Module
	  // instance. This can get called by `Module#define_method` as well.
	  //
	  // ## Modules
	  //
	  // Any method defined on a module will come through this runtime helper.
	  // The method is added to the module body, and the owner of the method is
	  // set to be the module itself. This is used later when choosing which
	  // method should show on a class if more than 1 included modules define
	  // the same method. Finally, if the module is in `module_function` mode,
	  // then the method is also defined onto the module itself.
	  //
	  // ## Classes
	  //
	  // This helper will only be called for classes when a method is being
	  // defined indirectly; either through `Module#define_method`, or by a
	  // literal `def` method inside an `instance_eval` or `class_eval` body. In
	  // either case, the method is simply added to the class' prototype. A special
	  // exception exists for `BasicObject` and `Object`. These two classes are
	  // special because they are used in toll-free bridged classes. In each of
	  // these two cases, extra work is required to define the methods on toll-free
	  // bridged class' prototypes as well.
	  //
	  // ## Objects
	  //
	  // If a simple ruby object is the object, then the method is simply just
	  // defined on the object as a singleton method. This would be the case when
	  // a method is defined inside an `instance_eval` block.
	  //
	  // @param [RubyObject or Class] obj the actual obj to define method for
	  // @param [String] jsid the javascript friendly method name (e.g. '$foo')
	  // @param [Function] body the literal javascript function used as method
	  // @return [null]
	  //
	  Opal.defn = function(obj, jsid, body) {
	    obj.$$proto[jsid] = body;
	
	    if (obj.$$is_module) {
	      donate(obj, jsid);
	
	      if (obj.$$module_function) {
	        Opal.defs(obj, jsid, body);
	      }
	    }
	
	    if (obj.$__id__ && !obj.$__id__.$$stub) {
	      var bridged = bridges[obj.$__id__()];
	
	      if (bridged) {
	        for (var i = bridged.length - 1; i >= 0; i--) {
	          bridge_method(bridged[i], obj, jsid, body);
	        }
	      }
	    }
	
	    if (obj.$method_added && !obj.$method_added.$$stub) {
	      obj.$method_added(jsid.substr(1));
	    }
	
	    var singleton_of = obj.$$singleton_of;
	    if (singleton_of && singleton_of.$singleton_method_added && !singleton_of.$singleton_method_added.$$stub) {
	      singleton_of.$singleton_method_added(jsid.substr(1));
	    }
	
	    return nil;
	  };
	
	
	  // Define a singleton method on the given object.
	  Opal.defs = function(obj, jsid, body) {
	    Opal.defn(Opal.get_singleton_class(obj), jsid, body)
	  };
	
	  Opal.def = function(obj, jsid, body) {
	    // if instance_eval is invoked on a module/class, it sets inst_eval_mod
	    if (!obj.$$eval && (obj.$$is_class || obj.$$is_module)) {
	      Opal.defn(obj, jsid, body);
	    }
	    else {
	      Opal.defs(obj, jsid, body);
	    }
	  };
	
	  // Called from #remove_method.
	  Opal.rdef = function(obj, jsid) {
	    // TODO: remove from bridges as well
	
	    if (!$hasOwn.call(obj.$$proto, jsid)) {
	      throw Opal.NameError.$new("method '" + jsid.substr(1) + "' not defined in " + obj.$name());
	    }
	
	    delete obj.$$proto[jsid];
	
	    if (obj.$$is_singleton) {
	      if (obj.$$proto.$singleton_method_removed && !obj.$$proto.$singleton_method_removed.$$stub) {
	        obj.$$proto.$singleton_method_removed(jsid.substr(1));
	      }
	    }
	    else {
	      if (obj.$method_removed && !obj.$method_removed.$$stub) {
	        obj.$method_removed(jsid.substr(1));
	      }
	    }
	  };
	
	  // Called from #undef_method.
	  Opal.udef = function(obj, jsid) {
	    if (!obj.$$proto[jsid] || obj.$$proto[jsid].$$stub) {
	      throw Opal.NameError.$new("method '" + jsid.substr(1) + "' not defined in " + obj.$name());
	    }
	
	    Opal.add_stub_for(obj.$$proto, jsid);
	
	    if (obj.$$is_singleton) {
	      if (obj.$$proto.$singleton_method_undefined && !obj.$$proto.$singleton_method_undefined.$$stub) {
	        obj.$$proto.$singleton_method_undefined(jsid.substr(1));
	      }
	    }
	    else {
	      if (obj.$method_undefined && !obj.$method_undefined.$$stub) {
	        obj.$method_undefined(jsid.substr(1));
	      }
	    }
	  };
	
	  Opal.alias = function(obj, name, old) {
	    var id     = '$' + name,
	        old_id = '$' + old,
	        body   = obj.$$proto['$' + old];
	
	    // instance_eval is being run on a class/module, so that need to alias class methods
	    if (obj.$$eval) {
	      return Opal.alias(Opal.get_singleton_class(obj), name, old);
	    }
	
	    if (typeof(body) !== "function" || body.$$stub) {
	      var ancestor = obj.$$super;
	
	      while (typeof(body) !== "function" && ancestor) {
	        body     = ancestor[old_id];
	        ancestor = ancestor.$$super;
	      }
	
	      if (typeof(body) !== "function" || body.$$stub) {
	        throw Opal.NameError.$new("undefined method `" + old + "' for class `" + obj.$name() + "'")
	      }
	    }
	
	    Opal.defn(obj, id, body);
	
	    return obj;
	  };
	
	  Opal.alias_native = function(obj, name, native_name) {
	    var id   = '$' + name,
	        body = obj.$$proto[native_name];
	
	    if (typeof(body) !== "function" || body.$$stub) {
	      throw Opal.NameError.$new("undefined native method `" + native_name + "' for class `" + obj.$name() + "'")
	    }
	
	    Opal.defn(obj, id, body);
	
	    return obj;
	  };
	
	  Opal.hash_init = function(hash) {
	    hash.$$map  = {};
	    hash.$$smap = {};
	    hash.$$keys = [];
	  };
	
	  Opal.hash_clone = function(from_hash, to_hash) {
	    to_hash.none = from_hash.none;
	    to_hash.proc = from_hash.proc;
	
	    for (var i = 0, keys = from_hash.$$keys, length = keys.length, key, value; i < length; i++) {
	      key = from_hash.$$keys[i];
	
	      if (key.$$is_string) {
	        value = from_hash.$$smap[key];
	      } else {
	        value = key.value;
	        key = key.key;
	      }
	
	      Opal.hash_put(to_hash, key, value);
	    }
	  };
	
	  Opal.hash_put = function(hash, key, value) {
	    if (key.$$is_string) {
	      if (!hash.$$smap.hasOwnProperty(key)) {
	        hash.$$keys.push(key);
	      }
	      hash.$$smap[key] = value;
	      return;
	    }
	
	    var key_hash = key.$hash(), bucket, last_bucket;
	
	    if (!hash.$$map.hasOwnProperty(key_hash)) {
	      bucket = {key: key, key_hash: key_hash, value: value};
	      hash.$$keys.push(bucket);
	      hash.$$map[key_hash] = bucket;
	      return;
	    }
	
	    bucket = hash.$$map[key_hash];
	
	    while (bucket) {
	      if (key === bucket.key || key['$eql?'](bucket.key)) {
	        last_bucket = undefined;
	        bucket.value = value;
	        break;
	      }
	      last_bucket = bucket;
	      bucket = bucket.next;
	    }
	
	    if (last_bucket) {
	      bucket = {key: key, key_hash: key_hash, value: value};
	      hash.$$keys.push(bucket);
	      last_bucket.next = bucket;
	    }
	  };
	
	  Opal.hash_get = function(hash, key) {
	    if (key.$$is_string) {
	      if (hash.$$smap.hasOwnProperty(key)) {
	        return hash.$$smap[key];
	      }
	      return;
	    }
	
	    var key_hash = key.$hash(), bucket;
	
	    if (hash.$$map.hasOwnProperty(key_hash)) {
	      bucket = hash.$$map[key_hash];
	
	      while (bucket) {
	        if (key === bucket.key || key['$eql?'](bucket.key)) {
	          return bucket.value;
	        }
	        bucket = bucket.next;
	      }
	    }
	  };
	
	  Opal.hash_delete = function(hash, key) {
	    var i, keys = hash.$$keys, length = keys.length, value;
	
	    if (key.$$is_string) {
	      if (!hash.$$smap.hasOwnProperty(key)) {
	        return;
	      }
	
	      for (i = 0; i < length; i++) {
	        if (keys[i] === key) {
	          keys.splice(i, 1);
	          break;
	        }
	      }
	
	      value = hash.$$smap[key];
	      delete hash.$$smap[key];
	      return value;
	    }
	
	    var key_hash = key.$hash();
	
	    if (!hash.$$map.hasOwnProperty(key_hash)) {
	      return;
	    }
	
	    var bucket = hash.$$map[key_hash], last_bucket;
	
	    while (bucket) {
	      if (key === bucket.key || key['$eql?'](bucket.key)) {
	        value = bucket.value;
	
	        for (i = 0; i < length; i++) {
	          if (keys[i] === bucket) {
	            keys.splice(i, 1);
	            break;
	          }
	        }
	
	        if (last_bucket && bucket.next) {
	          last_bucket.next = bucket.next;
	        }
	        else if (last_bucket) {
	          delete last_bucket.next;
	        }
	        else if (bucket.next) {
	          hash.$$map[key_hash] = bucket.next;
	        }
	        else {
	          delete hash.$$map[key_hash];
	        }
	
	        return value;
	      }
	      last_bucket = bucket;
	      bucket = bucket.next;
	    }
	  };
	
	  Opal.hash_rehash = function(hash) {
	    for (var i = 0, length = hash.$$keys.length, key_hash, bucket, last_bucket; i < length; i++) {
	
	      if (hash.$$keys[i].$$is_string) {
	        continue;
	      }
	
	      key_hash = hash.$$keys[i].key.$hash();
	
	      if (key_hash === hash.$$keys[i].key_hash) {
	        continue;
	      }
	
	      bucket = hash.$$map[hash.$$keys[i].key_hash];
	      last_bucket = undefined;
	
	      while (bucket) {
	        if (bucket === hash.$$keys[i]) {
	          if (last_bucket && bucket.next) {
	            last_bucket.next = bucket.next;
	          }
	          else if (last_bucket) {
	            delete last_bucket.next;
	          }
	          else if (bucket.next) {
	            hash.$$map[hash.$$keys[i].key_hash] = bucket.next;
	          }
	          else {
	            delete hash.$$map[hash.$$keys[i].key_hash];
	          }
	          break;
	        }
	        last_bucket = bucket;
	        bucket = bucket.next;
	      }
	
	      hash.$$keys[i].key_hash = key_hash;
	
	      if (!hash.$$map.hasOwnProperty(key_hash)) {
	        hash.$$map[key_hash] = hash.$$keys[i];
	        continue;
	      }
	
	      bucket = hash.$$map[key_hash];
	      last_bucket = undefined;
	
	      while (bucket) {
	        if (bucket === hash.$$keys[i]) {
	          last_bucket = undefined;
	          break;
	        }
	        last_bucket = bucket;
	        bucket = bucket.next;
	      }
	
	      if (last_bucket) {
	        last_bucket.next = hash.$$keys[i];
	      }
	    }
	  };
	
	  Opal.hash = function() {
	    var arguments_length = arguments.length, args, hash, i, length, key, value;
	
	    if (arguments_length === 1 && arguments[0].$$is_hash) {
	      return arguments[0];
	    }
	
	    hash = new Opal.Hash.$$alloc();
	    Opal.hash_init(hash);
	
	    if (arguments_length === 1 && arguments[0].$$is_array) {
	      args = arguments[0];
	      length = args.length;
	
	      for (i = 0; i < length; i++) {
	        if (args[i].length !== 2) {
	          throw Opal.ArgumentError.$new("value not of length 2: " + args[i].$inspect());
	        }
	
	        key = args[i][0];
	        value = args[i][1];
	
	        Opal.hash_put(hash, key, value);
	      }
	
	      return hash;
	    }
	
	    if (arguments_length === 1) {
	      args = arguments[0];
	      for (key in args) {
	        if (args.hasOwnProperty(key)) {
	          value = args[key];
	
	          Opal.hash_put(hash, key, value);
	        }
	      }
	
	      return hash;
	    }
	
	    if (arguments_length % 2 !== 0) {
	      throw Opal.ArgumentError.$new("odd number of arguments for Hash");
	    }
	
	    for (i = 0; i < arguments_length; i += 2) {
	      key = arguments[i];
	      value = arguments[i + 1];
	
	      Opal.hash_put(hash, key, value);
	    }
	
	    return hash;
	  };
	
	  // hash2 is a faster creator for hashes that just use symbols and
	  // strings as keys. The map and keys array can be constructed at
	  // compile time, so they are just added here by the constructor
	  // function
	  //
	  Opal.hash2 = function(keys, smap) {
	    var hash = new Opal.Hash.$$alloc();
	
	    hash.$$map  = {};
	    hash.$$keys = keys;
	    hash.$$smap = smap;
	
	    return hash;
	  };
	
	  // Create a new range instance with first and last values, and whether the
	  // range excludes the last value.
	  //
	  Opal.range = function(first, last, exc) {
	    var range         = new Opal.Range.$$alloc();
	        range.begin   = first;
	        range.end     = last;
	        range.exclude = exc;
	
	    return range;
	  };
	
	  Opal.ivar = function(name) {
	    if (
	        // properties
	        name === "constructor" ||
	        name === "displayName" ||
	        name === "__count__" ||
	        name === "__noSuchMethod__" ||
	        name === "__parent__" ||
	        name === "__proto__" ||
	
	        // methods
	        name === "hasOwnProperty" ||
	        name === "valueOf"
	       )
	    {
	      return name + "$";
	    }
	
	    return name;
	  };
	
	  // Require system
	  // --------------
	
	  Opal.modules         = {};
	  Opal.loaded_features = ['corelib/runtime'];
	  Opal.current_dir     = '.'
	  Opal.require_table   = {'corelib/runtime': true};
	
	  function normalize(path) {
	    var parts, part, new_parts = [], SEPARATOR = '/';
	
	    if (Opal.current_dir !== '.') {
	      path = Opal.current_dir.replace(/\/*$/, '/') + path;
	    }
	
	    path = path.replace(/\.(rb|opal|js)$/, '');
	    parts = path.split(SEPARATOR);
	
	    for (var i = 0, ii = parts.length; i < ii; i++) {
	      part = parts[i];
	      if (part === '') continue;
	      (part === '..') ? new_parts.pop() : new_parts.push(part)
	    }
	
	    return new_parts.join(SEPARATOR);
	  }
	
	  Opal.loaded = function(paths) {
	    var i, l, path;
	
	    for (i = 0, l = paths.length; i < l; i++) {
	      path = normalize(paths[i]);
	
	      if (Opal.require_table[path]) {
	        return;
	      }
	
	      Opal.loaded_features.push(path);
	      Opal.require_table[path] = true;
	    }
	  }
	
	  Opal.load = function(path) {
	    path = normalize(path);
	
	    Opal.loaded([path]);
	
	    var module = Opal.modules[path];
	
	    if (module) {
	      module(Opal);
	    }
	    else {
	      var severity = Opal.dynamic_require_severity || 'warning';
	      var message  = 'cannot load such file -- ' + path;
	
	      if (severity === "error") {
	        Opal.LoadError ? Opal.LoadError.$new(message) : function(){throw message}();
	      }
	      else if (severity === "warning") {
	        console.warn('WARNING: LoadError: ' + message);
	      }
	    }
	
	    return true;
	  }
	
	  Opal.require = function(path) {
	    path = normalize(path);
	
	    if (Opal.require_table[path]) {
	      return false;
	    }
	
	    return Opal.load(path);
	  }
	
	  // Initialization
	  // --------------
	
	  // Constructors for *instances* of core objects
	  boot_class_alloc('BasicObject', BasicObject_alloc);
	  boot_class_alloc('Object',      Object_alloc,       BasicObject_alloc);
	  boot_class_alloc('Module',      Module_alloc,       Object_alloc);
	  boot_class_alloc('Class',       Class_alloc,        Module_alloc);
	
	  // Constructors for *classes* of core objects
	  BasicObject = boot_core_class_object('BasicObject', BasicObject_alloc, Class_alloc);
	  _Object     = boot_core_class_object('Object',      Object_alloc,      BasicObject.constructor);
	  Module      = boot_core_class_object('Module',      Module_alloc,      _Object.constructor);
	  Class       = boot_core_class_object('Class',       Class_alloc,       Module.constructor);
	
	  // Fix booted classes to use their metaclass
	  BasicObject.$$class = Class;
	  _Object.$$class     = Class;
	  Module.$$class      = Class;
	  Class.$$class       = Class;
	
	  // Fix superclasses of booted classes
	  BasicObject.$$super = null;
	  _Object.$$super     = BasicObject;
	  Module.$$super      = _Object;
	  Class.$$super       = Module;
	
	  BasicObject.$$parent = null;
	  _Object.$$parent     = BasicObject;
	  Module.$$parent      = _Object;
	  Class.$$parent       = Module;
	
	  Opal.base                = _Object;
	  BasicObject.$$scope      = _Object.$$scope = Opal;
	  BasicObject.$$orig_scope = _Object.$$orig_scope = Opal;
	
	  Module.$$scope      = _Object.$$scope;
	  Module.$$orig_scope = _Object.$$orig_scope;
	  Class.$$scope       = _Object.$$scope;
	  Class.$$orig_scope  = _Object.$$orig_scope;
	
	  _Object.$$proto.toString = function() {
	    return this.$to_s();
	  };
	
	  _Object.$$proto.$require = Opal.require;
	
	  Opal.top = new _Object.$$alloc();
	
	  // Nil
	  Opal.klass(_Object, _Object, 'NilClass', NilClass_alloc);
	  nil = Opal.nil = new NilClass_alloc();
	  nil.$$id = nil_id;
	  nil.call = nil.apply = function() { throw Opal.LocalJumpError.$new('no block given'); };
	
	  Opal.breaker  = new Error('unexpected break');
	  Opal.returner = new Error('unexpected return');
	
	  TypeError.$$super = Error;
	}).call(this);
	
	if (typeof(global) !== 'undefined') {
	  global.Opal = this.Opal;
	  Opal.global = global;
	}
	
	if (typeof(window) !== 'undefined') {
	  window.Opal = this.Opal;
	  Opal.global = window;
	}
	Opal.loaded(["corelib/runtime"]);
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/helpers"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  Opal.add_stubs(['$new', '$class', '$===', '$respond_to?', '$raise', '$type_error', '$__send__', '$coerce_to', '$nil?', '$<=>', '$inspect', '$coerce_to!']);
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defs(self, '$bridge', function(klass, constructor) {
	      var self = this;
	
	      return Opal.bridge(klass, constructor);
	    });
	
	    Opal.defs(self, '$type_error', function(object, type, method, coerced) {
	      var $a, $b, self = this;
	
	      if (method == null) {
	        method = nil
	      }
	      if (coerced == null) {
	        coerced = nil
	      }
	      if ((($a = (($b = method !== false && method !== nil) ? coerced : method)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('TypeError').$new("can't convert " + (object.$class()) + " into " + (type) + " (" + (object.$class()) + "#" + (method) + " gives " + (coerced.$class()))
	        } else {
	        return $scope.get('TypeError').$new("no implicit conversion of " + (object.$class()) + " into " + (type))
	      };
	    });
	
	    Opal.defs(self, '$coerce_to', function(object, type, method) {
	      var $a, self = this;
	
	      if ((($a = type['$==='](object)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return object};
	      if ((($a = object['$respond_to?'](method)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise(self.$type_error(object, type))
	      };
	      return object.$__send__(method);
	    });
	
	    Opal.defs(self, '$coerce_to!', function(object, type, method) {
	      var $a, self = this, coerced = nil;
	
	      coerced = self.$coerce_to(object, type, method);
	      if ((($a = type['$==='](coerced)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise(self.$type_error(object, type, method, coerced))
	      };
	      return coerced;
	    });
	
	    Opal.defs(self, '$coerce_to?', function(object, type, method) {
	      var $a, self = this, coerced = nil;
	
	      if ((($a = object['$respond_to?'](method)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return nil
	      };
	      coerced = self.$coerce_to(object, type, method);
	      if ((($a = coerced['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return nil};
	      if ((($a = type['$==='](coerced)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise(self.$type_error(object, type, method, coerced))
	      };
	      return coerced;
	    });
	
	    Opal.defs(self, '$try_convert', function(object, type, method) {
	      var $a, self = this;
	
	      if ((($a = type['$==='](object)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return object};
	      if ((($a = object['$respond_to?'](method)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return object.$__send__(method)
	        } else {
	        return nil
	      };
	    });
	
	    Opal.defs(self, '$compare', function(a, b) {
	      var $a, self = this, compare = nil;
	
	      compare = a['$<=>'](b);
	      if ((($a = compare === nil) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (a.$class()) + " with " + (b.$class()) + " failed")};
	      return compare;
	    });
	
	    Opal.defs(self, '$destructure', function(args) {
	      var self = this;
	
	      
	      if (args.length == 1) {
	        return args[0];
	      }
	      else if (args.$$is_array) {
	        return args;
	      }
	      else {
	        return $slice.call(args);
	      }
	    
	    });
	
	    Opal.defs(self, '$respond_to?', function(obj, method) {
	      var self = this;
	
	      
	      if (obj == null || !obj.$$class) {
	        return false;
	      }
	    
	      return obj['$respond_to?'](method);
	    });
	
	    Opal.defs(self, '$inspect', function(obj) {
	      var self = this;
	
	      
	      if (obj === undefined) {
	        return "undefined";
	      }
	      else if (obj === null) {
	        return "null";
	      }
	      else if (!obj.$$class) {
	        return obj.toString();
	      }
	      else {
	        return obj.$inspect();
	      }
	    
	    });
	
	    Opal.defs(self, '$instance_variable_name!', function(name) {
	      var $a, self = this;
	
	      name = $scope.get('Opal')['$coerce_to!'](name, $scope.get('String'), "to_str");
	      if ((($a = /^@[a-zA-Z_][a-zA-Z0-9_]*?$/.test(name)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('NameError').$new("'" + (name) + "' is not allowed as an instance variable name", name))
	      };
	      return name;
	    });
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/module"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$===', '$raise', '$equal?', '$<', '$>', '$nil?', '$attr_reader', '$attr_writer', '$coerce_to!', '$new', '$=~', '$inject', '$const_get', '$split', '$const_missing', '$to_str', '$to_proc', '$lambda', '$bind', '$call', '$class', '$append_features', '$included', '$name', '$to_s', '$__id__']);
	  return (function($base, $super) {
	    function $Module(){};
	    var self = $Module = $klass($base, $super, 'Module', $Module);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_3, TMP_5, TMP_6;
	
	    Opal.defs(self, '$new', TMP_1 = function() {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      TMP_1.$$p = null;
	      
	      var klass         = Opal.boot_module_object();
	      klass.$$name      = nil;
	      klass.$$class     = Opal.Module;
	      klass.$$dep       = []
	      klass.$$is_module = true;
	      klass.$$proto     = {};
	
	      // inherit scope from parent
	      Opal.create_scope(Opal.Module.$$scope, klass);
	
	      if (block !== nil) {
	        var block_self = block.$$s;
	        block.$$s = null;
	        block.call(klass);
	        block.$$s = block_self;
	      }
	
	      return klass;
	    
	    });
	
	    Opal.defn(self, '$===', function(object) {
	      var $a, self = this;
	
	      if ((($a = object == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return false};
	      return Opal.is_a(object, self);
	    });
	
	    Opal.defn(self, '$<', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Module')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "compared with non class/module")
	      };
	      
	      var working = self,
	          ancestors,
	          i, length;
	
	      if (working === other) {
	        return false;
	      }
	
	      for (i = 0, ancestors = Opal.ancestors(self), length = ancestors.length; i < length; i++) {
	        if (ancestors[i] === other) {
	          return true;
	        }
	      }
	
	      for (i = 0, ancestors = Opal.ancestors(other), length = ancestors.length; i < length; i++) {
	        if (ancestors[i] === self) {
	          return false;
	        }
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$<=', function(other) {
	      var $a, self = this;
	
	      return ((($a = self['$equal?'](other)) !== false && $a !== nil) ? $a : $rb_lt(self, other));
	    });
	
	    Opal.defn(self, '$>', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Module')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "compared with non class/module")
	      };
	      return $rb_lt(other, self);
	    });
	
	    Opal.defn(self, '$>=', function(other) {
	      var $a, self = this;
	
	      return ((($a = self['$equal?'](other)) !== false && $a !== nil) ? $a : $rb_gt(self, other));
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var $a, self = this, lt = nil;
	
	      
	      if (self === other) {
	        return 0;
	      }
	    
	      if ((($a = $scope.get('Module')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return nil
	      };
	      lt = $rb_lt(self, other);
	      if ((($a = lt['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return nil};
	      if (lt !== false && lt !== nil) {
	        return -1
	        } else {
	        return 1
	      };
	    });
	
	    Opal.defn(self, '$alias_method', function(newname, oldname) {
	      var self = this;
	
	      Opal.alias(self, newname, oldname);
	      return self;
	    });
	
	    Opal.defn(self, '$alias_native', function(mid, jsid) {
	      var self = this;
	
	      if (jsid == null) {
	        jsid = mid
	      }
	      Opal.alias_native(self, mid, jsid);
	      return self;
	    });
	
	    Opal.defn(self, '$ancestors', function() {
	      var self = this;
	
	      return Opal.ancestors(self);
	    });
	
	    Opal.defn(self, '$append_features', function(klass) {
	      var self = this;
	
	      Opal.append_features(self, klass);
	      return self;
	    });
	
	    Opal.defn(self, '$attr_accessor', function() {
	      var $a, $b, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var names = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        names[$splat_index] = arguments[$splat_index + 0];
	      }
	      ($a = self).$attr_reader.apply($a, Opal.to_a(names));
	      return ($b = self).$attr_writer.apply($b, Opal.to_a(names));
	    });
	
	    Opal.alias(self, 'attr', 'attr_accessor');
	
	    Opal.defn(self, '$attr_reader', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var names = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        names[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var proto = self.$$proto;
	
	      for (var i = names.length - 1; i >= 0; i--) {
	        var name = names[i],
	            id   = '$' + name,
	            ivar = Opal.ivar(name);
	
	        // the closure here is needed because name will change at the next
	        // cycle, I wish we could use let.
	        var body = (function(ivar) {
	          return function() {
	            if (this[ivar] == null) {
	              return nil;
	            }
	            else {
	              return this[ivar];
	            }
	          };
	        })(ivar);
	
	        // initialize the instance variable as nil
	        proto[ivar] = nil;
	
	        if (self.$$is_singleton) {
	          proto.constructor.prototype[id] = body;
	        }
	        else {
	          Opal.defn(self, id, body);
	        }
	      }
	    
	      return nil;
	    });
	
	    Opal.defn(self, '$attr_writer', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var names = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        names[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var proto = self.$$proto;
	
	      for (var i = names.length - 1; i >= 0; i--) {
	        var name = names[i],
	            id   = '$' + name + '=',
	            ivar = Opal.ivar(name);
	
	        // the closure here is needed because name will change at the next
	        // cycle, I wish we could use let.
	        var body = (function(ivar){
	          return function(value) {
	            return this[ivar] = value;
	          }
	        })(ivar);
	
	        // initialize the instance variable as nil
	        proto[ivar] = nil;
	
	        if (self.$$is_singleton) {
	          proto.constructor.prototype[id] = body;
	        }
	        else {
	          Opal.defn(self, id, body);
	        }
	      }
	    
	      return nil;
	    });
	
	    Opal.defn(self, '$autoload', function(const$, path) {
	      var self = this;
	
	      
	      var autoloaders;
	
	      if (!(autoloaders = self.$$autoload)) {
	        autoloaders = self.$$autoload = {};
	      }
	
	      autoloaders[const$] = path;
	      return nil;
	    ;
	    });
	
	    Opal.defn(self, '$class_variable_get', function(name) {
	      var $a, self = this;
	
	      name = $scope.get('Opal')['$coerce_to!'](name, $scope.get('String'), "to_str");
	      if ((($a = name.length < 3 || name.slice(0,2) !== '@@') !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('NameError').$new("class vars should start with @@", name))};
	      
	      var value = Opal.cvars[name.slice(2)];
	      (function() {if ((($a = value == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('NameError').$new("uninitialized class variable @@a in", name))
	        } else {
	        return nil
	      }; return nil; })()
	      return value;
	    
	    });
	
	    Opal.defn(self, '$class_variable_set', function(name, value) {
	      var $a, self = this;
	
	      name = $scope.get('Opal')['$coerce_to!'](name, $scope.get('String'), "to_str");
	      if ((($a = name.length < 3 || name.slice(0,2) !== '@@') !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('NameError'))};
	      
	      Opal.cvars[name.slice(2)] = value;
	      return value;
	    
	    });
	
	    Opal.defn(self, '$constants', function() {
	      var self = this;
	
	      return self.$$scope.constants.slice(0);
	    });
	
	    Opal.defn(self, '$const_defined?', function(name, inherit) {
	      var $a, self = this;
	
	      if (inherit == null) {
	        inherit = true
	      }
	      if ((($a = name['$=~'](/^[A-Z]\w*$/)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('NameError').$new("wrong constant name " + (name), name))
	      };
	      
	      var scopes = [self.$$scope];
	
	      if (inherit || self === Opal.Object) {
	        var parent = self.$$super;
	
	        while (parent !== Opal.BasicObject) {
	          scopes.push(parent.$$scope);
	
	          parent = parent.$$super;
	        }
	      }
	
	      for (var i = 0, length = scopes.length; i < length; i++) {
	        if (scopes[i].hasOwnProperty(name)) {
	          return true;
	        }
	      }
	
	      return false;
	    
	    });
	
	    Opal.defn(self, '$const_get', function(name, inherit) {
	      var $a, $b, TMP_2, self = this;
	
	      if (inherit == null) {
	        inherit = true
	      }
	      if ((($a = name.indexOf('::') != -1 && name != '::') !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = ($b = name.$split("::")).$inject, $a.$$p = (TMP_2 = function(o, c){var self = TMP_2.$$s || this;
	if (o == null) o = nil;if (c == null) c = nil;
	        return o.$const_get(c)}, TMP_2.$$s = self, TMP_2), $a).call($b, self)};
	      if ((($a = /^[A-Z]\w*$/.test(name)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('NameError').$new("wrong constant name " + (name), name))
	      };
	      
	      var scopes = [self.$$scope];
	
	      if (inherit || self == Opal.Object) {
	        var parent = self.$$super;
	
	        while (parent !== Opal.BasicObject) {
	          scopes.push(parent.$$scope);
	
	          parent = parent.$$super;
	        }
	      }
	
	      for (var i = 0, length = scopes.length; i < length; i++) {
	        if (scopes[i].hasOwnProperty(name)) {
	          return scopes[i][name];
	        }
	      }
	
	      return self.$const_missing(name);
	    
	    });
	
	    Opal.defn(self, '$const_missing', function(name) {
	      var self = this;
	
	      
	      if (self.$$autoload) {
	        var file = self.$$autoload[name];
	
	        if (file) {
	          self.$require(file);
	
	          return self.$const_get(name);
	        }
	      }
	    
	      return self.$raise($scope.get('NameError').$new("uninitialized constant " + (self) + "::" + (name), name));
	    });
	
	    Opal.defn(self, '$const_set', function(name, value) {
	      var $a, self = this;
	
	      if ((($a = name['$=~'](/^[A-Z]\w*$/)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('NameError').$new("wrong constant name " + (name), name))
	      };
	      try {
	      name = name.$to_str()
	      } catch ($err) {if (true) {
	        try {
	          self.$raise($scope.get('TypeError'), "conversion with #to_str failed")
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	      Opal.casgn(self, name, value);
	      return value;
	    });
	
	    Opal.defn(self, '$define_method', TMP_3 = function(name, method) {
	      var $a, $b, $c, TMP_4, self = this, $iter = TMP_3.$$p, block = $iter || nil, $case = nil;
	
	      TMP_3.$$p = null;
	      if ((($a = method === undefined && block === nil) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "tried to create a Proc object without a block")};
	      ((($a = block) !== false && $a !== nil) ? $a : block = (function() {$case = method;if ($scope.get('Proc')['$===']($case)) {return method}else if ($scope.get('Method')['$===']($case)) {return method.$to_proc().$$unbound;}else if ($scope.get('UnboundMethod')['$===']($case)) {return ($b = ($c = self).$lambda, $b.$$p = (TMP_4 = function(args){var self = TMP_4.$$s || this, $a, bound = nil;
	args = $slice.call(arguments, 0);
	      bound = method.$bind(self);
	        return ($a = bound).$call.apply($a, Opal.to_a(args));}, TMP_4.$$s = self, TMP_4), $b).call($c)}else {return self.$raise($scope.get('TypeError'), "wrong argument type " + (block.$class()) + " (expected Proc/Method)")}})());
	      
	      var id = '$' + name;
	
	      block.$$jsid = name;
	      block.$$s    = null;
	      block.$$def  = block;
	
	      Opal.defn(self, id, block);
	
	      return name;
	    
	    });
	
	    Opal.defn(self, '$remove_method', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var names = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        names[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = 0, length = names.length; i < length; i++) {
	        Opal.rdef(self, "$" + names[i]);
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$singleton_class?', function() {
	      var self = this;
	
	      return !!self.$$is_singleton;
	    });
	
	    Opal.defn(self, '$include', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var mods = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        mods[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = mods.length - 1; i >= 0; i--) {
	        var mod = mods[i];
	
	        if (mod === self) {
	          continue;
	        }
	
	        if (!mod.$$is_module) {
	          self.$raise($scope.get('TypeError'), "wrong argument type " + ((mod).$class()) + " (expected Module)");
	        }
	
	        (mod).$append_features(self);
	        (mod).$included(self);
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$include?', function(mod) {
	      var self = this;
	
	      
	      for (var cls = self; cls; cls = cls.$$super) {
	        for (var i = 0; i != cls.$$inc.length; i++) {
	          var mod2 = cls.$$inc[i];
	          if (mod === mod2) {
	            return true;
	          }
	        }
	      }
	      return false;
	    
	    });
	
	    Opal.defn(self, '$instance_method', function(name) {
	      var self = this;
	
	      
	      var meth = self.$$proto['$' + name];
	
	      if (!meth || meth.$$stub) {
	        self.$raise($scope.get('NameError').$new("undefined method `" + (name) + "' for class `" + (self.$name()) + "'", name));
	      }
	
	      return $scope.get('UnboundMethod').$new(self, meth, name);
	    
	    });
	
	    Opal.defn(self, '$instance_methods', function(include_super) {
	      var self = this;
	
	      if (include_super == null) {
	        include_super = true
	      }
	      
	      var methods = [],
	          proto   = self.$$proto;
	
	      for (var prop in proto) {
	        if (prop.charAt(0) !== '$') {
	          continue;
	        }
	
	        if (typeof(proto[prop]) !== "function") {
	          continue;
	        }
	
	        if (proto[prop].$$stub) {
	          continue;
	        }
	
	        if (!self.$$is_module) {
	          if (self !== Opal.BasicObject && proto[prop] === Opal.BasicObject.$$proto[prop]) {
	            continue;
	          }
	
	          if (!include_super && !proto.hasOwnProperty(prop)) {
	            continue;
	          }
	
	          if (!include_super && proto[prop].$$donated) {
	            continue;
	          }
	        }
	
	        methods.push(prop.substr(1));
	      }
	
	      return methods;
	    
	    });
	
	    Opal.defn(self, '$included', function(mod) {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$extended', function(mod) {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$method_added', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$method_removed', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$method_undefined', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$module_eval', TMP_5 = function() {
	      var self = this, $iter = TMP_5.$$p, block = $iter || nil;
	
	      TMP_5.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "no block given")
	      };
	      
	      var old = block.$$s,
	          result;
	
	      block.$$s = null;
	      result = block.call(self);
	      block.$$s = old;
	
	      return result;
	    
	    });
	
	    Opal.alias(self, 'class_eval', 'module_eval');
	
	    Opal.defn(self, '$module_exec', TMP_6 = function() {
	      var self = this, $iter = TMP_6.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_6.$$p = null;
	      
	      if (block === nil) {
	        self.$raise($scope.get('LocalJumpError'), "no block given")
	      }
	
	      var block_self = block.$$s, result;
	
	      block.$$s = null;
	      result = block.apply(self, args);
	      block.$$s = block_self;
	
	      return result;
	    ;
	    });
	
	    Opal.alias(self, 'class_exec', 'module_exec');
	
	    Opal.defn(self, '$method_defined?', function(method) {
	      var self = this;
	
	      
	      var body = self.$$proto['$' + method];
	      return (!!body) && !body.$$stub;
	    
	    });
	
	    Opal.defn(self, '$module_function', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var methods = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        methods[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      if (methods.length === 0) {
	        self.$$module_function = true;
	      }
	      else {
	        for (var i = 0, length = methods.length; i < length; i++) {
	          var meth = methods[i],
	              id   = '$' + meth,
	              func = self.$$proto[id];
	
	          Opal.defs(self, id, func);
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.defn(self, '$name', function() {
	      var self = this;
	
	      
	      if (self.$$full_name) {
	        return self.$$full_name;
	      }
	
	      var result = [], base = self;
	
	      while (base) {
	        if (base.$$name === nil) {
	          return result.length === 0 ? nil : result.join('::');
	        }
	
	        result.unshift(base.$$name);
	
	        base = base.$$base_module;
	
	        if (base === Opal.Object) {
	          break;
	        }
	      }
	
	      if (result.length === 0) {
	        return nil;
	      }
	
	      return self.$$full_name = result.join('::');
	    
	    });
	
	    Opal.defn(self, '$remove_class_variable', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$remove_const', function(name) {
	      var self = this;
	
	      
	      var old = self.$$scope[name];
	      delete self.$$scope[name];
	      return old;
	    
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var $a, self = this;
	
	      return ((($a = Opal.Module.$name.call(self)) !== false && $a !== nil) ? $a : "#<" + (self.$$is_module ? 'Module' : 'Class') + ":0x" + (self.$__id__().$to_s(16)) + ">");
	    });
	
	    return (Opal.defn(self, '$undef_method', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var names = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        names[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = 0, length = names.length; i < length; i++) {
	        Opal.udef(self, "$" + names[i]);
	      }
	    
	      return self;
	    }), nil) && 'undef_method';
	  })($scope.base, null)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/class"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$raise', '$allocate']);
	  self.$require("corelib/module");
	  return (function($base, $super) {
	    function $Class(){};
	    var self = $Class = $klass($base, $super, 'Class', $Class);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2;
	
	    Opal.defs(self, '$new', TMP_1 = function(sup) {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      if (sup == null) {
	        sup = $scope.get('Object')
	      }
	      TMP_1.$$p = null;
	      
	      if (!sup.$$is_class) {
	        self.$raise($scope.get('TypeError'), "superclass must be a Class");
	      }
	
	      function AnonClass(){};
	      var klass        = Opal.boot_class(sup, AnonClass)
	      klass.$$name     = nil;
	      klass.$$parent   = sup;
	      klass.$$is_class = true;
	
	      // inherit scope from parent
	      Opal.create_scope(sup.$$scope, klass);
	
	      sup.$inherited(klass);
	
	      if (block !== nil) {
	        var block_self = block.$$s;
	        block.$$s = null;
	        block.call(klass);
	        block.$$s = block_self;
	      }
	
	      return klass;
	    ;
	    });
	
	    Opal.defn(self, '$allocate', function() {
	      var self = this;
	
	      
	      var obj = new self.$$alloc();
	      obj.$$id = Opal.uid();
	      return obj;
	    
	    });
	
	    Opal.defn(self, '$inherited', function(cls) {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$new', TMP_2 = function() {
	      var self = this, $iter = TMP_2.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_2.$$p = null;
	      
	      var obj = self.$allocate();
	
	      obj.$initialize.$$p = block;
	      obj.$initialize.apply(obj, args);
	      return obj;
	    ;
	    });
	
	    return (Opal.defn(self, '$superclass', function() {
	      var self = this;
	
	      return self.$$super || nil;
	    }), nil) && 'superclass';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/basic_object"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $range = Opal.range, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$==', '$!', '$nil?', '$cover?', '$size', '$raise', '$compile', '$lambda', '$>', '$new', '$inspect']);
	  return (function($base, $super) {
	    function $BasicObject(){};
	    var self = $BasicObject = $klass($base, $super, 'BasicObject', $BasicObject);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_4, TMP_5;
	
	    Opal.defn(self, '$initialize', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return self === other;
	    });
	
	    Opal.defn(self, '$eql?', function(other) {
	      var self = this;
	
	      return self['$=='](other);
	    });
	
	    Opal.alias(self, 'equal?', '==');
	
	    Opal.defn(self, '$__id__', function() {
	      var self = this;
	
	      return self.$$id || (self.$$id = Opal.uid());
	    });
	
	    Opal.defn(self, '$__send__', TMP_1 = function(symbol) {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_1.$$p = null;
	      
	      var func = self['$' + symbol]
	
	      if (func) {
	        if (block !== nil) {
	          func.$$p = block;
	        }
	
	        return func.apply(self, args);
	      }
	
	      if (block !== nil) {
	        self.$method_missing.$$p = block;
	      }
	
	      return self.$method_missing.apply(self, [symbol].concat(args));
	    
	    });
	
	    Opal.defn(self, '$!', function() {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.defn(self, '$!=', function(other) {
	      var self = this;
	
	      return (self['$=='](other))['$!']();
	    });
	
	    Opal.alias(self, 'equal?', '==');
	
	    Opal.defn(self, '$instance_eval', TMP_2 = function() {
	      var $a, $b, TMP_3, self = this, $iter = TMP_2.$$p, block = $iter || nil, string = nil, file = nil, _lineno = nil, compiled = nil, wrapper = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_2.$$p = null;
	      if ((($a = ($b = block['$nil?'](), $b !== false && $b !== nil ?!!Opal.compile : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = ($range(1, 3, false))['$cover?'](args.$size())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          $scope.get('Kernel').$raise($scope.get('ArgumentError'), "wrong number of arguments (0 for 1..3)")
	        };
	        $a = Opal.to_a(args), string = ($a[0] == null ? nil : $a[0]), file = ($a[1] == null ? nil : $a[1]), _lineno = ($a[2] == null ? nil : $a[2]), $a;
	        compiled = $scope.get('Opal').$compile(string, $hash2(["file", "eval"], {"file": (((($a = file) !== false && $a !== nil) ? $a : "(eval)")), "eval": true}));
	        wrapper = function() {return eval(compiled)};
	        block = ($a = ($b = $scope.get('Kernel')).$lambda, $a.$$p = (TMP_3 = function(){var self = TMP_3.$$s || this;
	
	        return wrapper.call(self);}, TMP_3.$$s = self, TMP_3), $a).call($b);
	      } else if ((($a = $rb_gt(args.$size(), 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        $scope.get('Kernel').$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (args.$size()) + " for 0)")};
	      
	      var old = block.$$s,
	          result;
	
	      block.$$s = null;
	
	      // Need to pass $$eval so that method definitions know if this is
	      // being done on a class/module. Cannot be compiler driven since
	      // send(:instance_eval) needs to work.
	      if (self.$$is_class || self.$$is_module) {
	        self.$$eval = true;
	        try {
	          result = block.call(self, self);
	        }
	        finally {
	          self.$$eval = false;
	        }
	      }
	      else {
	        result = block.call(self, self);
	      }
	
	      block.$$s = old;
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$instance_exec', TMP_4 = function() {
	      var self = this, $iter = TMP_4.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_4.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        $scope.get('Kernel').$raise($scope.get('ArgumentError'), "no block given")
	      };
	      
	      var block_self = block.$$s,
	          result;
	
	      block.$$s = null;
	
	      if (self.$$is_class || self.$$is_module) {
	        self.$$eval = true;
	        try {
	          result = block.apply(self, args);
	        }
	        finally {
	          self.$$eval = false;
	        }
	      }
	      else {
	        result = block.apply(self, args);
	      }
	
	      block.$$s = block_self;
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$singleton_method_added', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$singleton_method_removed', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$singleton_method_undefined', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    return (Opal.defn(self, '$method_missing', TMP_5 = function(symbol) {
	      var $a, self = this, $iter = TMP_5.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_5.$$p = null;
	      return $scope.get('Kernel').$raise($scope.get('NoMethodError').$new((function() {if ((($a = self.$inspect && !self.$inspect.$$stub) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return "undefined method `" + (symbol) + "' for " + (self.$inspect()) + ":" + (self.$$class)
	        } else {
	        return "undefined method `" + (symbol) + "' for " + (self.$$class)
	      }; return nil; })(), symbol));
	    }), nil) && 'method_missing';
	  })($scope.base, null)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/kernel"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_le(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $gvars = Opal.gvars, $hash2 = Opal.hash2, $klass = Opal.klass;
	
	  Opal.add_stubs(['$raise', '$new', '$inspect', '$!', '$=~', '$==', '$object_id', '$class', '$coerce_to?', '$<<', '$allocate', '$copy_instance_variables', '$copy_singleton_methods', '$initialize_clone', '$initialize_copy', '$define_method', '$to_proc', '$singleton_class', '$initialize_dup', '$for', '$loop', '$pop', '$call', '$append_features', '$extended', '$length', '$respond_to?', '$[]', '$nil?', '$to_a', '$to_int', '$fetch', '$Integer', '$Float', '$to_ary', '$to_str', '$coerce_to', '$to_s', '$__id__', '$instance_variable_name!', '$coerce_to!', '$===', '$>', '$print', '$format', '$puts', '$each', '$<=', '$empty?', '$exception', '$kind_of?', '$respond_to_missing?', '$try_convert!', '$expand_path', '$join', '$start_with?', '$sym', '$arg', '$include']);
	  (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4, TMP_6, TMP_7, TMP_8, TMP_10, TMP_11;
	
	    Opal.defn(self, '$method_missing', TMP_1 = function(symbol) {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_1.$$p = null;
	      return self.$raise($scope.get('NoMethodError').$new("undefined method `" + (symbol) + "' for " + (self.$inspect()), symbol, args));
	    });
	
	    Opal.defn(self, '$=~', function(obj) {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.defn(self, '$!~', function(obj) {
	      var self = this;
	
	      return (self['$=~'](obj))['$!']();
	    });
	
	    Opal.defn(self, '$===', function(other) {
	      var $a, self = this;
	
	      return ((($a = self.$object_id()['$=='](other.$object_id())) !== false && $a !== nil) ? $a : self['$=='](other));
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var self = this;
	
	      
	      // set guard for infinite recursion
	      self.$$comparable = true;
	
	      var x = self['$=='](other);
	
	      if (x && x !== nil) {
	        return 0;
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$method', function(name) {
	      var self = this;
	
	      
	      var meth = self['$' + name];
	
	      if (!meth || meth.$$stub) {
	        self.$raise($scope.get('NameError').$new("undefined method `" + (name) + "' for class `" + (self.$class()) + "'", name));
	      }
	
	      return $scope.get('Method').$new(self, meth, name);
	    
	    });
	
	    Opal.defn(self, '$methods', function(all) {
	      var self = this;
	
	      if (all == null) {
	        all = true
	      }
	      
	      var methods = [];
	
	      for (var key in self) {
	        if (key[0] == "$" && typeof(self[key]) === "function") {
	          if (all == false || all === nil) {
	            if (!Opal.hasOwnProperty.call(self, key)) {
	              continue;
	            }
	          }
	          if (self[key].$$stub === undefined) {
	            methods.push(key.substr(1));
	          }
	        }
	      }
	
	      return methods;
	    
	    });
	
	    Opal.alias(self, 'public_methods', 'methods');
	
	    Opal.defn(self, '$Array', function(object) {
	      var self = this;
	
	      
	      var coerced;
	
	      if (object === nil) {
	        return [];
	      }
	
	      if (object.$$is_array) {
	        return object;
	      }
	
	      coerced = $scope.get('Opal')['$coerce_to?'](object, $scope.get('Array'), "to_ary");
	      if (coerced !== nil) { return coerced; }
	
	      coerced = $scope.get('Opal')['$coerce_to?'](object, $scope.get('Array'), "to_a");
	      if (coerced !== nil) { return coerced; }
	
	      return [object];
	    
	    });
	
	    Opal.defn(self, '$at_exit', TMP_2 = function() {
	      var $a, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	      if ($gvars.__at_exit__ == null) $gvars.__at_exit__ = nil;
	
	      TMP_2.$$p = null;
	      ((($a = $gvars.__at_exit__) !== false && $a !== nil) ? $a : $gvars.__at_exit__ = []);
	      return $gvars.__at_exit__['$<<'](block);
	    });
	
	    Opal.defn(self, '$caller', function() {
	      var self = this;
	
	      return [];
	    });
	
	    Opal.defn(self, '$class', function() {
	      var self = this;
	
	      return self.$$class;
	    });
	
	    Opal.defn(self, '$copy_instance_variables', function(other) {
	      var self = this;
	
	      
	      for (var name in other) {
	        if (other.hasOwnProperty(name) && name.charAt(0) !== '$') {
	          self[name] = other[name];
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$copy_singleton_methods', function(other) {
	      var self = this;
	
	      
	      var name;
	
	      if (other.hasOwnProperty('$$meta')) {
	        var other_singleton_class_proto = Opal.get_singleton_class(other).$$proto;
	        var self_singleton_class_proto = Opal.get_singleton_class(self).$$proto;
	
	        for (name in other_singleton_class_proto) {
	          if (name.charAt(0) === '$' && other_singleton_class_proto.hasOwnProperty(name)) {
	            self_singleton_class_proto[name] = other_singleton_class_proto[name];
	          }
	        }
	      }
	
	      for (name in other) {
	        if (name.charAt(0) === '$' && name.charAt(1) !== '$' && other.hasOwnProperty(name)) {
	          self[name] = other[name];
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$clone', function() {
	      var self = this, copy = nil;
	
	      copy = self.$class().$allocate();
	      copy.$copy_instance_variables(self);
	      copy.$copy_singleton_methods(self);
	      copy.$initialize_clone(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$initialize_clone', function(other) {
	      var self = this;
	
	      return self.$initialize_copy(other);
	    });
	
	    Opal.defn(self, '$define_singleton_method', TMP_3 = function(name, method) {
	      var $a, $b, self = this, $iter = TMP_3.$$p, block = $iter || nil;
	
	      TMP_3.$$p = null;
	      return ($a = ($b = self.$singleton_class()).$define_method, $a.$$p = block.$to_proc(), $a).call($b, name, method);
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this, copy = nil;
	
	      copy = self.$class().$allocate();
	      copy.$copy_instance_variables(self);
	      copy.$initialize_dup(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$initialize_dup', function(other) {
	      var self = this;
	
	      return self.$initialize_copy(other);
	    });
	
	    Opal.defn(self, '$enum_for', TMP_4 = function(method) {
	      var $a, $b, self = this, $iter = TMP_4.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      if (method == null) {
	        method = "each"
	      }
	      TMP_4.$$p = null;
	      return ($a = ($b = $scope.get('Enumerator')).$for, $a.$$p = block.$to_proc(), $a).apply($b, [self, method].concat(Opal.to_a(args)));
	    });
	
	    Opal.alias(self, 'to_enum', 'enum_for');
	
	    Opal.defn(self, '$equal?', function(other) {
	      var self = this;
	
	      return self === other;
	    });
	
	    Opal.defn(self, '$exit', function(status) {
	      var $a, $b, TMP_5, self = this;
	      if ($gvars.__at_exit__ == null) $gvars.__at_exit__ = nil;
	
	      if (status == null) {
	        status = true
	      }
	      ((($a = $gvars.__at_exit__) !== false && $a !== nil) ? $a : $gvars.__at_exit__ = []);
	      ($a = ($b = self).$loop, $a.$$p = (TMP_5 = function(){var self = TMP_5.$$s || this, block = nil;
	        if ($gvars.__at_exit__ == null) $gvars.__at_exit__ = nil;
	
	      block = $gvars.__at_exit__.$pop();
	        if (block !== false && block !== nil) {
	          return block.$call()
	          } else {
	          return ($breaker.$v = nil, $breaker)
	        };}, TMP_5.$$s = self, TMP_5), $a).call($b);
	      if ((($a = status === true) !== nil && (!$a.$$is_boolean || $a == true))) {
	        status = 0};
	      Opal.exit(status);
	      return nil;
	    });
	
	    Opal.defn(self, '$extend', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var mods = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        mods[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var singleton = self.$singleton_class();
	
	      for (var i = mods.length - 1; i >= 0; i--) {
	        var mod = mods[i];
	
	        if (!mod.$$is_module) {
	          self.$raise($scope.get('TypeError'), "wrong argument type " + ((mod).$class()) + " (expected Module)");
	        }
	
	        (mod).$append_features(singleton);
	        (mod).$extended(self);
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$format', function(format_string) {
	      var $a, $b, self = this, ary = nil, $splat_index = nil;
	      if ($gvars.DEBUG == null) $gvars.DEBUG = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      if ((($a = (($b = args.$length()['$=='](1)) ? args['$[]'](0)['$respond_to?']("to_ary") : args.$length()['$=='](1))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        ary = $scope.get('Opal')['$coerce_to?'](args['$[]'](0), $scope.get('Array'), "to_ary");
	        if ((($a = ary['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          args = ary.$to_a()
	        };};
	      
	      var result = '',
	          //used for slicing:
	          begin_slice = 0,
	          end_slice,
	          //used for iterating over the format string:
	          i,
	          len = format_string.length,
	          //used for processing field values:
	          arg,
	          str,
	          //used for processing %g and %G fields:
	          exponent,
	          //used for keeping track of width and precision:
	          width,
	          precision,
	          //used for holding temporary values:
	          tmp_num,
	          //used for processing %{} and %<> fileds:
	          hash_parameter_key,
	          closing_brace_char,
	          //used for processing %b, %B, %o, %x, and %X fields:
	          base_number,
	          base_prefix,
	          base_neg_zero_regex,
	          base_neg_zero_digit,
	          //used for processing arguments:
	          next_arg,
	          seq_arg_num = 1,
	          pos_arg_num = 0,
	          //used for keeping track of flags:
	          flags,
	          FNONE  = 0,
	          FSHARP = 1,
	          FMINUS = 2,
	          FPLUS  = 4,
	          FZERO  = 8,
	          FSPACE = 16,
	          FWIDTH = 32,
	          FPREC  = 64,
	          FPREC0 = 128;
	
	      function CHECK_FOR_FLAGS() {
	        if (flags&FWIDTH) { self.$raise($scope.get('ArgumentError'), "flag after width") }
	        if (flags&FPREC0) { self.$raise($scope.get('ArgumentError'), "flag after precision") }
	      }
	
	      function CHECK_FOR_WIDTH() {
	        if (flags&FWIDTH) { self.$raise($scope.get('ArgumentError'), "width given twice") }
	        if (flags&FPREC0) { self.$raise($scope.get('ArgumentError'), "width after precision") }
	      }
	
	      function GET_NTH_ARG(num) {
	        if (num >= args.length) { self.$raise($scope.get('ArgumentError'), "too few arguments") }
	        return args[num];
	      }
	
	      function GET_NEXT_ARG() {
	        switch (pos_arg_num) {
	        case -1: self.$raise($scope.get('ArgumentError'), "unnumbered(" + (seq_arg_num) + ") mixed with numbered")
	        case -2: self.$raise($scope.get('ArgumentError'), "unnumbered(" + (seq_arg_num) + ") mixed with named")
	        }
	        pos_arg_num = seq_arg_num++;
	        return GET_NTH_ARG(pos_arg_num - 1);
	      }
	
	      function GET_POS_ARG(num) {
	        if (pos_arg_num > 0) {
	          self.$raise($scope.get('ArgumentError'), "numbered(" + (num) + ") after unnumbered(" + (pos_arg_num) + ")")
	        }
	        if (pos_arg_num === -2) {
	          self.$raise($scope.get('ArgumentError'), "numbered(" + (num) + ") after named")
	        }
	        if (num < 1) {
	          self.$raise($scope.get('ArgumentError'), "invalid index - " + (num) + "$")
	        }
	        pos_arg_num = -1;
	        return GET_NTH_ARG(num - 1);
	      }
	
	      function GET_ARG() {
	        return (next_arg === undefined ? GET_NEXT_ARG() : next_arg);
	      }
	
	      function READ_NUM(label) {
	        var num, str = '';
	        for (;; i++) {
	          if (i === len) {
	            self.$raise($scope.get('ArgumentError'), "malformed format string - %*[0-9]")
	          }
	          if (format_string.charCodeAt(i) < 48 || format_string.charCodeAt(i) > 57) {
	            i--;
	            num = parseInt(str, 10) || 0;
	            if (num > 2147483647) {
	              self.$raise($scope.get('ArgumentError'), "" + (label) + " too big")
	            }
	            return num;
	          }
	          str += format_string.charAt(i);
	        }
	      }
	
	      function READ_NUM_AFTER_ASTER(label) {
	        var arg, num = READ_NUM(label);
	        if (format_string.charAt(i + 1) === '$') {
	          i++;
	          arg = GET_POS_ARG(num);
	        } else {
	          arg = GET_NEXT_ARG();
	        }
	        return (arg).$to_int();
	      }
	
	      for (i = format_string.indexOf('%'); i !== -1; i = format_string.indexOf('%', i)) {
	        str = undefined;
	
	        flags = FNONE;
	        width = -1;
	        precision = -1;
	        next_arg = undefined;
	
	        end_slice = i;
	
	        i++;
	
	        switch (format_string.charAt(i)) {
	        case '%':
	          begin_slice = i;
	        case '':
	        case '\n':
	        case '\0':
	          i++;
	          continue;
	        }
	
	        format_sequence: for (; i < len; i++) {
	          switch (format_string.charAt(i)) {
	
	          case ' ':
	            CHECK_FOR_FLAGS();
	            flags |= FSPACE;
	            continue format_sequence;
	
	          case '#':
	            CHECK_FOR_FLAGS();
	            flags |= FSHARP;
	            continue format_sequence;
	
	          case '+':
	            CHECK_FOR_FLAGS();
	            flags |= FPLUS;
	            continue format_sequence;
	
	          case '-':
	            CHECK_FOR_FLAGS();
	            flags |= FMINUS;
	            continue format_sequence;
	
	          case '0':
	            CHECK_FOR_FLAGS();
	            flags |= FZERO;
	            continue format_sequence;
	
	          case '1':
	          case '2':
	          case '3':
	          case '4':
	          case '5':
	          case '6':
	          case '7':
	          case '8':
	          case '9':
	            tmp_num = READ_NUM('width');
	            if (format_string.charAt(i + 1) === '$') {
	              if (i + 2 === len) {
	                str = '%';
	                i++;
	                break format_sequence;
	              }
	              if (next_arg !== undefined) {
	                self.$raise($scope.get('ArgumentError'), "value given twice - %" + (tmp_num) + "$")
	              }
	              next_arg = GET_POS_ARG(tmp_num);
	              i++;
	            } else {
	              CHECK_FOR_WIDTH();
	              flags |= FWIDTH;
	              width = tmp_num;
	            }
	            continue format_sequence;
	
	          case '<':
	          case '\{':
	            closing_brace_char = (format_string.charAt(i) === '<' ? '>' : '\}');
	            hash_parameter_key = '';
	
	            i++;
	
	            for (;; i++) {
	              if (i === len) {
	                self.$raise($scope.get('ArgumentError'), "malformed name - unmatched parenthesis")
	              }
	              if (format_string.charAt(i) === closing_brace_char) {
	
	                if (pos_arg_num > 0) {
	                  self.$raise($scope.get('ArgumentError'), "named " + (hash_parameter_key) + " after unnumbered(" + (pos_arg_num) + ")")
	                }
	                if (pos_arg_num === -1) {
	                  self.$raise($scope.get('ArgumentError'), "named " + (hash_parameter_key) + " after numbered")
	                }
	                pos_arg_num = -2;
	
	                if (args[0] === undefined || !args[0].$$is_hash) {
	                  self.$raise($scope.get('ArgumentError'), "one hash required")
	                }
	
	                next_arg = (args[0]).$fetch(hash_parameter_key);
	
	                if (closing_brace_char === '>') {
	                  continue format_sequence;
	                } else {
	                  str = next_arg.toString();
	                  if (precision !== -1) { str = str.slice(0, precision); }
	                  if (flags&FMINUS) {
	                    while (str.length < width) { str = str + ' '; }
	                  } else {
	                    while (str.length < width) { str = ' ' + str; }
	                  }
	                  break format_sequence;
	                }
	              }
	              hash_parameter_key += format_string.charAt(i);
	            }
	
	          case '*':
	            i++;
	            CHECK_FOR_WIDTH();
	            flags |= FWIDTH;
	            width = READ_NUM_AFTER_ASTER('width');
	            if (width < 0) {
	              flags |= FMINUS;
	              width = -width;
	            }
	            continue format_sequence;
	
	          case '.':
	            if (flags&FPREC0) {
	              self.$raise($scope.get('ArgumentError'), "precision given twice")
	            }
	            flags |= FPREC|FPREC0;
	            precision = 0;
	            i++;
	            if (format_string.charAt(i) === '*') {
	              i++;
	              precision = READ_NUM_AFTER_ASTER('precision');
	              if (precision < 0) {
	                flags &= ~FPREC;
	              }
	              continue format_sequence;
	            }
	            precision = READ_NUM('precision');
	            continue format_sequence;
	
	          case 'd':
	          case 'i':
	          case 'u':
	            arg = self.$Integer(GET_ARG());
	            if (arg >= 0) {
	              str = arg.toString();
	              while (str.length < precision) { str = '0' + str; }
	              if (flags&FMINUS) {
	                if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                while (str.length < width) { str = str + ' '; }
	              } else {
	                if (flags&FZERO && precision === -1) {
	                  while (str.length < width - ((flags&FPLUS || flags&FSPACE) ? 1 : 0)) { str = '0' + str; }
	                  if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                } else {
	                  if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                  while (str.length < width) { str = ' ' + str; }
	                }
	              }
	            } else {
	              str = (-arg).toString();
	              while (str.length < precision) { str = '0' + str; }
	              if (flags&FMINUS) {
	                str = '-' + str;
	                while (str.length < width) { str = str + ' '; }
	              } else {
	                if (flags&FZERO && precision === -1) {
	                  while (str.length < width - 1) { str = '0' + str; }
	                  str = '-' + str;
	                } else {
	                  str = '-' + str;
	                  while (str.length < width) { str = ' ' + str; }
	                }
	              }
	            }
	            break format_sequence;
	
	          case 'b':
	          case 'B':
	          case 'o':
	          case 'x':
	          case 'X':
	            switch (format_string.charAt(i)) {
	            case 'b':
	            case 'B':
	              base_number = 2;
	              base_prefix = '0b';
	              base_neg_zero_regex = /^1+/;
	              base_neg_zero_digit = '1';
	              break;
	            case 'o':
	              base_number = 8;
	              base_prefix = '0';
	              base_neg_zero_regex = /^3?7+/;
	              base_neg_zero_digit = '7';
	              break;
	            case 'x':
	            case 'X':
	              base_number = 16;
	              base_prefix = '0x';
	              base_neg_zero_regex = /^f+/;
	              base_neg_zero_digit = 'f';
	              break;
	            }
	            arg = self.$Integer(GET_ARG());
	            if (arg >= 0) {
	              str = arg.toString(base_number);
	              while (str.length < precision) { str = '0' + str; }
	              if (flags&FMINUS) {
	                if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                if (flags&FSHARP && arg !== 0) { str = base_prefix + str; }
	                while (str.length < width) { str = str + ' '; }
	              } else {
	                if (flags&FZERO && precision === -1) {
	                  while (str.length < width - ((flags&FPLUS || flags&FSPACE) ? 1 : 0) - ((flags&FSHARP && arg !== 0) ? base_prefix.length : 0)) { str = '0' + str; }
	                  if (flags&FSHARP && arg !== 0) { str = base_prefix + str; }
	                  if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                } else {
	                  if (flags&FSHARP && arg !== 0) { str = base_prefix + str; }
	                  if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                  while (str.length < width) { str = ' ' + str; }
	                }
	              }
	            } else {
	              if (flags&FPLUS || flags&FSPACE) {
	                str = (-arg).toString(base_number);
	                while (str.length < precision) { str = '0' + str; }
	                if (flags&FMINUS) {
	                  if (flags&FSHARP) { str = base_prefix + str; }
	                  str = '-' + str;
	                  while (str.length < width) { str = str + ' '; }
	                } else {
	                  if (flags&FZERO && precision === -1) {
	                    while (str.length < width - 1 - (flags&FSHARP ? 2 : 0)) { str = '0' + str; }
	                    if (flags&FSHARP) { str = base_prefix + str; }
	                    str = '-' + str;
	                  } else {
	                    if (flags&FSHARP) { str = base_prefix + str; }
	                    str = '-' + str;
	                    while (str.length < width) { str = ' ' + str; }
	                  }
	                }
	              } else {
	                str = (arg >>> 0).toString(base_number).replace(base_neg_zero_regex, base_neg_zero_digit);
	                while (str.length < precision - 2) { str = base_neg_zero_digit + str; }
	                if (flags&FMINUS) {
	                  str = '..' + str;
	                  if (flags&FSHARP) { str = base_prefix + str; }
	                  while (str.length < width) { str = str + ' '; }
	                } else {
	                  if (flags&FZERO && precision === -1) {
	                    while (str.length < width - 2 - (flags&FSHARP ? base_prefix.length : 0)) { str = base_neg_zero_digit + str; }
	                    str = '..' + str;
	                    if (flags&FSHARP) { str = base_prefix + str; }
	                  } else {
	                    str = '..' + str;
	                    if (flags&FSHARP) { str = base_prefix + str; }
	                    while (str.length < width) { str = ' ' + str; }
	                  }
	                }
	              }
	            }
	            if (format_string.charAt(i) === format_string.charAt(i).toUpperCase()) {
	              str = str.toUpperCase();
	            }
	            break format_sequence;
	
	          case 'f':
	          case 'e':
	          case 'E':
	          case 'g':
	          case 'G':
	            arg = self.$Float(GET_ARG());
	            if (arg >= 0 || isNaN(arg)) {
	              if (arg === Infinity) {
	                str = 'Inf';
	              } else {
	                switch (format_string.charAt(i)) {
	                case 'f':
	                  str = arg.toFixed(precision === -1 ? 6 : precision);
	                  break;
	                case 'e':
	                case 'E':
	                  str = arg.toExponential(precision === -1 ? 6 : precision);
	                  break;
	                case 'g':
	                case 'G':
	                  str = arg.toExponential();
	                  exponent = parseInt(str.split('e')[1], 10);
	                  if (!(exponent < -4 || exponent >= (precision === -1 ? 6 : precision))) {
	                    str = arg.toPrecision(precision === -1 ? (flags&FSHARP ? 6 : undefined) : precision);
	                  }
	                  break;
	                }
	              }
	              if (flags&FMINUS) {
	                if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                while (str.length < width) { str = str + ' '; }
	              } else {
	                if (flags&FZERO && arg !== Infinity && !isNaN(arg)) {
	                  while (str.length < width - ((flags&FPLUS || flags&FSPACE) ? 1 : 0)) { str = '0' + str; }
	                  if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                } else {
	                  if (flags&FPLUS || flags&FSPACE) { str = (flags&FPLUS ? '+' : ' ') + str; }
	                  while (str.length < width) { str = ' ' + str; }
	                }
	              }
	            } else {
	              if (arg === -Infinity) {
	                str = 'Inf';
	              } else {
	                switch (format_string.charAt(i)) {
	                case 'f':
	                  str = (-arg).toFixed(precision === -1 ? 6 : precision);
	                  break;
	                case 'e':
	                case 'E':
	                  str = (-arg).toExponential(precision === -1 ? 6 : precision);
	                  break;
	                case 'g':
	                case 'G':
	                  str = (-arg).toExponential();
	                  exponent = parseInt(str.split('e')[1], 10);
	                  if (!(exponent < -4 || exponent >= (precision === -1 ? 6 : precision))) {
	                    str = (-arg).toPrecision(precision === -1 ? (flags&FSHARP ? 6 : undefined) : precision);
	                  }
	                  break;
	                }
	              }
	              if (flags&FMINUS) {
	                str = '-' + str;
	                while (str.length < width) { str = str + ' '; }
	              } else {
	                if (flags&FZERO && arg !== -Infinity) {
	                  while (str.length < width - 1) { str = '0' + str; }
	                  str = '-' + str;
	                } else {
	                  str = '-' + str;
	                  while (str.length < width) { str = ' ' + str; }
	                }
	              }
	            }
	            if (format_string.charAt(i) === format_string.charAt(i).toUpperCase() && arg !== Infinity && arg !== -Infinity && !isNaN(arg)) {
	              str = str.toUpperCase();
	            }
	            str = str.replace(/([eE][-+]?)([0-9])$/, '$10$2');
	            break format_sequence;
	
	          case 'a':
	          case 'A':
	            // Not implemented because there are no specs for this field type.
	            self.$raise($scope.get('NotImplementedError'), "`A` and `a` format field types are not implemented in Opal yet")
	
	          case 'c':
	            arg = GET_ARG();
	            if ((arg)['$respond_to?']("to_ary")) { arg = (arg).$to_ary()[0]; }
	            if ((arg)['$respond_to?']("to_str")) {
	              str = (arg).$to_str();
	            } else {
	              str = String.fromCharCode($scope.get('Opal').$coerce_to(arg, $scope.get('Integer'), "to_int"));
	            }
	            if (str.length !== 1) {
	              self.$raise($scope.get('ArgumentError'), "%c requires a character")
	            }
	            if (flags&FMINUS) {
	              while (str.length < width) { str = str + ' '; }
	            } else {
	              while (str.length < width) { str = ' ' + str; }
	            }
	            break format_sequence;
	
	          case 'p':
	            str = (GET_ARG()).$inspect();
	            if (precision !== -1) { str = str.slice(0, precision); }
	            if (flags&FMINUS) {
	              while (str.length < width) { str = str + ' '; }
	            } else {
	              while (str.length < width) { str = ' ' + str; }
	            }
	            break format_sequence;
	
	          case 's':
	            str = (GET_ARG()).$to_s();
	            if (precision !== -1) { str = str.slice(0, precision); }
	            if (flags&FMINUS) {
	              while (str.length < width) { str = str + ' '; }
	            } else {
	              while (str.length < width) { str = ' ' + str; }
	            }
	            break format_sequence;
	
	          default:
	            self.$raise($scope.get('ArgumentError'), "malformed format string - %" + (format_string.charAt(i)))
	          }
	        }
	
	        if (str === undefined) {
	          self.$raise($scope.get('ArgumentError'), "malformed format string - %")
	        }
	
	        result += format_string.slice(begin_slice, end_slice) + str;
	        begin_slice = i + 1;
	      }
	
	      if ($gvars.DEBUG && pos_arg_num >= 0 && seq_arg_num < args.length) {
	        self.$raise($scope.get('ArgumentError'), "too many arguments for format string")
	      }
	
	      return result + format_string.slice(begin_slice);
	    ;
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return self.$__id__();
	    });
	
	    Opal.defn(self, '$initialize_copy', function(other) {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return self.$to_s();
	    });
	
	    Opal.defn(self, '$instance_of?', function(klass) {
	      var self = this;
	
	      
	      if (!klass.$$is_class && !klass.$$is_module) {
	        self.$raise($scope.get('TypeError'), "class or module required");
	      }
	
	      return self.$$class === klass;
	    ;
	    });
	
	    Opal.defn(self, '$instance_variable_defined?', function(name) {
	      var self = this;
	
	      name = $scope.get('Opal')['$instance_variable_name!'](name);
	      return Opal.hasOwnProperty.call(self, name.substr(1));
	    });
	
	    Opal.defn(self, '$instance_variable_get', function(name) {
	      var self = this;
	
	      name = $scope.get('Opal')['$instance_variable_name!'](name);
	      
	      var ivar = self[Opal.ivar(name.substr(1))];
	
	      return ivar == null ? nil : ivar;
	    
	    });
	
	    Opal.defn(self, '$instance_variable_set', function(name, value) {
	      var self = this;
	
	      name = $scope.get('Opal')['$instance_variable_name!'](name);
	      return self[Opal.ivar(name.substr(1))] = value;
	    });
	
	    Opal.defn(self, '$remove_instance_variable', function(name) {
	      var self = this;
	
	      name = $scope.get('Opal')['$instance_variable_name!'](name);
	      
	      var key = Opal.ivar(name.substr(1)),
	          val;
	      if (self.hasOwnProperty(key)) {
	        val = self[key];
	        delete self[key];
	        return val;
	      }
	    
	      return self.$raise($scope.get('NameError'), "instance variable " + (name) + " not defined");
	    });
	
	    Opal.defn(self, '$instance_variables', function() {
	      var self = this;
	
	      
	      var result = [], ivar;
	
	      for (var name in self) {
	        if (self.hasOwnProperty(name) && name.charAt(0) !== '$') {
	          if (name.substr(-1) === '$') {
	            ivar = name.slice(0, name.length - 1);
	          } else {
	            ivar = name;
	          }
	          result.push('@' + ivar);
	        }
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$Integer', function(value, base) {
	      var self = this;
	
	      
	      var i, str, base_digits;
	
	      if (!value.$$is_string) {
	        if (base !== undefined) {
	          self.$raise($scope.get('ArgumentError'), "base specified for non string value")
	        }
	        if (value === nil) {
	          self.$raise($scope.get('TypeError'), "can't convert nil into Integer")
	        }
	        if (value.$$is_number) {
	          if (value === Infinity || value === -Infinity || isNaN(value)) {
	            self.$raise($scope.get('FloatDomainError'), value)
	          }
	          return Math.floor(value);
	        }
	        if (value['$respond_to?']("to_int")) {
	          i = value.$to_int();
	          if (i !== nil) {
	            return i;
	          }
	        }
	        return $scope.get('Opal')['$coerce_to!'](value, $scope.get('Integer'), "to_i");
	      }
	
	      if (base === undefined) {
	        base = 0;
	      } else {
	        base = $scope.get('Opal').$coerce_to(base, $scope.get('Integer'), "to_int");
	        if (base === 1 || base < 0 || base > 36) {
	          self.$raise($scope.get('ArgumentError'), "invalid radix " + (base))
	        }
	      }
	
	      str = value.toLowerCase();
	
	      str = str.replace(/(\d)_(?=\d)/g, '$1');
	
	      str = str.replace(/^(\s*[+-]?)(0[bodx]?)/, function (_, head, flag) {
	        switch (flag) {
	        case '0b':
	          if (base === 0 || base === 2) {
	            base = 2;
	            return head;
	          }
	        case '0':
	        case '0o':
	          if (base === 0 || base === 8) {
	            base = 8;
	            return head;
	          }
	        case '0d':
	          if (base === 0 || base === 10) {
	            base = 10;
	            return head;
	          }
	        case '0x':
	          if (base === 0 || base === 16) {
	            base = 16;
	            return head;
	          }
	        }
	        self.$raise($scope.get('ArgumentError'), "invalid value for Integer(): \"" + (value) + "\"")
	      });
	
	      base = (base === 0 ? 10 : base);
	
	      base_digits = '0-' + (base <= 10 ? base - 1 : '9a-' + String.fromCharCode(97 + (base - 11)));
	
	      if (!(new RegExp('^\\s*[+-]?[' + base_digits + ']+\\s*$')).test(str)) {
	        self.$raise($scope.get('ArgumentError'), "invalid value for Integer(): \"" + (value) + "\"")
	      }
	
	      i = parseInt(str, base);
	
	      if (isNaN(i)) {
	        self.$raise($scope.get('ArgumentError'), "invalid value for Integer(): \"" + (value) + "\"")
	      }
	
	      return i;
	    ;
	    });
	
	    Opal.defn(self, '$Float', function(value) {
	      var self = this;
	
	      
	      var str;
	
	      if (value === nil) {
	        self.$raise($scope.get('TypeError'), "can't convert nil into Float")
	      }
	
	      if (value.$$is_string) {
	        str = value.toString();
	
	        str = str.replace(/(\d)_(?=\d)/g, '$1');
	
	        //Special case for hex strings only:
	        if (/^\s*[-+]?0[xX][0-9a-fA-F]+\s*$/.test(str)) {
	          return self.$Integer(str);
	        }
	
	        if (!/^\s*[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?\s*$/.test(str)) {
	          self.$raise($scope.get('ArgumentError'), "invalid value for Float(): \"" + (value) + "\"")
	        }
	
	        return parseFloat(str);
	      }
	
	      return $scope.get('Opal')['$coerce_to!'](value, $scope.get('Float'), "to_f");
	    
	    });
	
	    Opal.defn(self, '$Hash', function(arg) {
	      var $a, $b, self = this;
	
	      if ((($a = ((($b = arg['$nil?']()) !== false && $b !== nil) ? $b : arg['$==']([]))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $hash2([], {})};
	      if ((($a = $scope.get('Hash')['$==='](arg)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return arg};
	      return $scope.get('Opal')['$coerce_to!'](arg, $scope.get('Hash'), "to_hash");
	    });
	
	    Opal.defn(self, '$is_a?', function(klass) {
	      var self = this;
	
	      
	      if (!klass.$$is_class && !klass.$$is_module) {
	        self.$raise($scope.get('TypeError'), "class or module required");
	      }
	
	      return Opal.is_a(self, klass);
	    ;
	    });
	
	    Opal.alias(self, 'kind_of?', 'is_a?');
	
	    Opal.defn(self, '$lambda', TMP_6 = function() {
	      var self = this, $iter = TMP_6.$$p, block = $iter || nil;
	
	      TMP_6.$$p = null;
	      block.$$is_lambda = true;
	      return block;
	    });
	
	    Opal.defn(self, '$load', function(file) {
	      var self = this;
	
	      file = $scope.get('Opal')['$coerce_to!'](file, $scope.get('String'), "to_str");
	      return Opal.load(file);
	    });
	
	    Opal.defn(self, '$loop', TMP_7 = function() {
	      var self = this, $iter = TMP_7.$$p, block = $iter || nil;
	
	      TMP_7.$$p = null;
	      
	      while (true) {
	        if (block() === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$nil?', function() {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.alias(self, 'object_id', '__id__');
	
	    Opal.defn(self, '$printf', function() {
	      var $a, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      if ((($a = $rb_gt(args.$length(), 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$print(($a = self).$format.apply($a, Opal.to_a(args)))};
	      return nil;
	    });
	
	    Opal.defn(self, '$proc', TMP_8 = function() {
	      var self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	      TMP_8.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "tried to create Proc object without a block")
	      };
	      block.$$is_lambda = false;
	      return block;
	    });
	
	    Opal.defn(self, '$puts', function() {
	      var $a, self = this, $splat_index = nil;
	      if ($gvars.stdout == null) $gvars.stdout = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var strs = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        strs[$splat_index] = arguments[$splat_index + 0];
	      }
	      return ($a = $gvars.stdout).$puts.apply($a, Opal.to_a(strs));
	    });
	
	    Opal.defn(self, '$p', function() {
	      var $a, $b, TMP_9, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      ($a = ($b = args).$each, $a.$$p = (TMP_9 = function(obj){var self = TMP_9.$$s || this;
	        if ($gvars.stdout == null) $gvars.stdout = nil;
	if (obj == null) obj = nil;
	      return $gvars.stdout.$puts(obj.$inspect())}, TMP_9.$$s = self, TMP_9), $a).call($b);
	      if ((($a = $rb_le(args.$length(), 1)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return args['$[]'](0)
	        } else {
	        return args
	      };
	    });
	
	    Opal.defn(self, '$print', function() {
	      var $a, self = this, $splat_index = nil;
	      if ($gvars.stdout == null) $gvars.stdout = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var strs = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        strs[$splat_index] = arguments[$splat_index + 0];
	      }
	      return ($a = $gvars.stdout).$print.apply($a, Opal.to_a(strs));
	    });
	
	    Opal.defn(self, '$warn', function() {
	      var $a, $b, self = this, $splat_index = nil;
	      if ($gvars.VERBOSE == null) $gvars.VERBOSE = nil;
	      if ($gvars.stderr == null) $gvars.stderr = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var strs = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        strs[$splat_index] = arguments[$splat_index + 0];
	      }
	      if ((($a = ((($b = $gvars.VERBOSE['$nil?']()) !== false && $b !== nil) ? $b : strs['$empty?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return nil
	        } else {
	        return ($a = $gvars.stderr).$puts.apply($a, Opal.to_a(strs))
	      };
	    });
	
	    Opal.defn(self, '$raise', function(exception, string, _backtrace) {
	      var self = this;
	      if ($gvars["!"] == null) $gvars["!"] = nil;
	
	      if (string == null) {
	        string = nil
	      }
	      if (_backtrace == null) {
	        _backtrace = nil
	      }
	      
	      if (exception == null && $gvars["!"] !== nil) {
	        throw $gvars["!"];
	      }
	      if (exception == null) {
	        exception = $scope.get('RuntimeError').$new();
	      }
	      else if (exception.$$is_string) {
	        exception = $scope.get('RuntimeError').$new(exception);
	      }
	      // using respond_to? and not an undefined check to avoid method_missing matching as true
	      else if (exception.$$is_class && exception['$respond_to?']("exception")) {
	        exception = exception.$exception(string);
	      }
	      else if (exception['$kind_of?']($scope.get('Exception'))) {
	        // exception is fine
	      }
	      else {
	        exception = $scope.get('TypeError').$new("exception class/object expected");
	      }
	
	      if ($gvars["!"] !== nil) {
	        Opal.exceptions.push($gvars["!"]);
	      }
	
	      $gvars["!"] = exception;
	
	      throw exception;
	    ;
	    });
	
	    Opal.alias(self, 'fail', 'raise');
	
	    Opal.defn(self, '$rand', function(max) {
	      var self = this;
	
	      
	      if (max === undefined) {
	        return Math.random();
	      }
	      else if (max.$$is_range) {
	        var min = max.begin, range = max.end - min;
	        if(!max.exclude) range++;
	
	        return self.$rand(range) + min;
	      }
	      else {
	        return Math.floor(Math.random() *
	          Math.abs($scope.get('Opal').$coerce_to(max, $scope.get('Integer'), "to_int")));
	      }
	    
	    });
	
	    Opal.defn(self, '$respond_to?', function(name, include_all) {
	      var $a, self = this;
	
	      if (include_all == null) {
	        include_all = false
	      }
	      if ((($a = self['$respond_to_missing?'](name, include_all)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      
	      var body = self['$' + name];
	
	      if (typeof(body) === "function" && !body.$$stub) {
	        return true;
	      }
	    
	      return false;
	    });
	
	    Opal.defn(self, '$respond_to_missing?', function(method_name, include_all) {
	      var self = this;
	
	      if (include_all == null) {
	        include_all = false
	      }
	      return false;
	    });
	
	    Opal.defn(self, '$require', function(file) {
	      var self = this;
	
	      file = $scope.get('Opal')['$coerce_to!'](file, $scope.get('String'), "to_str");
	      return Opal.require(file);
	    });
	
	    Opal.defn(self, '$require_relative', function(file) {
	      var self = this;
	
	      $scope.get('Opal')['$try_convert!'](file, $scope.get('String'), "to_str");
	      file = $scope.get('File').$expand_path($scope.get('File').$join(Opal.current_file, "..", file));
	      return Opal.require(file);
	    });
	
	    Opal.defn(self, '$require_tree', function(path) {
	      var self = this;
	
	      path = $scope.get('File').$expand_path(path);
	      if (path['$=='](".")) {
	        path = ""};
	      
	      for (var name in Opal.modules) {
	        if ((name)['$start_with?'](path)) {
	          Opal.require(name);
	        }
	      }
	    ;
	      return nil;
	    });
	
	    Opal.alias(self, 'send', '__send__');
	
	    Opal.alias(self, 'public_send', '__send__');
	
	    Opal.defn(self, '$singleton_class', function() {
	      var self = this;
	
	      return Opal.get_singleton_class(self);
	    });
	
	    Opal.defn(self, '$sleep', function(seconds) {
	      var self = this;
	
	      if (seconds == null) {
	        seconds = nil
	      }
	      
	      if (seconds === nil) {
	        self.$raise($scope.get('TypeError'), "can't convert NilClass into time interval")
	      }
	      if (!seconds.$$is_number) {
	        self.$raise($scope.get('TypeError'), "can't convert " + (seconds.$class()) + " into time interval")
	      }
	      if (seconds < 0) {
	        self.$raise($scope.get('ArgumentError'), "time interval must be positive")
	      }
	      var t = new Date();
	      while (new Date() - t <= seconds * 1000);
	      return seconds;
	    ;
	    });
	
	    Opal.alias(self, 'sprintf', 'format');
	
	    Opal.alias(self, 'srand', 'rand');
	
	    Opal.defn(self, '$String', function(str) {
	      var $a, self = this;
	
	      return ((($a = $scope.get('Opal')['$coerce_to?'](str, $scope.get('String'), "to_str")) !== false && $a !== nil) ? $a : $scope.get('Opal')['$coerce_to!'](str, $scope.get('String'), "to_s"));
	    });
	
	    Opal.defn(self, '$tap', TMP_10 = function() {
	      var self = this, $iter = TMP_10.$$p, block = $iter || nil;
	
	      TMP_10.$$p = null;
	      if (Opal.yield1(block, self) === $breaker) return $breaker.$v;
	      return self;
	    });
	
	    Opal.defn(self, '$to_proc', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return "#<" + (self.$class()) + ":0x" + (self.$__id__().$to_s(16)) + ">";
	    });
	
	    Opal.defn(self, '$catch', TMP_11 = function(sym) {
	      var $a, self = this, $iter = TMP_11.$$p, $yield = $iter || nil, e = nil;
	
	      TMP_11.$$p = null;
	      try {
	      return $a = Opal.yieldX($yield, []), $a === $breaker ? $a : $a
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('UncaughtThrowError')])) {e = $err;
	        try {
	          if (e.$sym()['$=='](sym)) {
	            return e.$arg()};
	          return self.$raise();
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	    });
	
	    Opal.defn(self, '$throw', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      return self.$raise($scope.get('UncaughtThrowError').$new(args));
	    });
	  })($scope.base);
	  return (function($base, $super) {
	    function $Object(){};
	    var self = $Object = $klass($base, $super, 'Object', $Object);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return self.$include($scope.get('Kernel'))
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/error"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $module = Opal.module;
	
	  Opal.add_stubs(['$new', '$clone', '$to_s', '$empty?', '$class', '$attr_reader', '$[]', '$>', '$length', '$inspect']);
	  (function($base, $super) {
	    function $Exception(){};
	    var self = $Exception = $klass($base, $super, 'Exception', $Exception);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.message = nil;
	    Opal.defs(self, '$new', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var message = (args.length > 0) ? args[0] : nil;
	      var err = new self.$$alloc(message);
	
	      if (Error.captureStackTrace) {
	        Error.captureStackTrace(err);
	      }
	
	      err.name = self.$$name;
	      err.$initialize.apply(err, args);
	      return err;
	    
	    });
	
	    Opal.defs(self, '$exception', function() {
	      var $a, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      return ($a = self).$new.apply($a, Opal.to_a(args));
	    });
	
	    Opal.defn(self, '$initialize', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      return self.message = (args.length > 0) ? args[0] : nil;
	    });
	
	    Opal.defn(self, '$backtrace', function() {
	      var self = this;
	
	      
	      var backtrace = self.stack;
	
	      if (typeof(backtrace) === 'string') {
	        return backtrace.split("\n").slice(0, 15);
	      }
	      else if (backtrace) {
	        return backtrace.slice(0, 15);
	      }
	
	      return [];
	    
	    });
	
	    Opal.defn(self, '$exception', function(str) {
	      var self = this;
	
	      if (str == null) {
	        str = nil
	      }
	      
	      if (str === nil || self === str) {
	        return self;
	      }
	      
	      var cloned = self.$clone();
	      cloned.message = str;
	      return cloned;
	    
	    });
	
	    Opal.defn(self, '$message', function() {
	      var self = this;
	
	      return self.$to_s();
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var $a, self = this, as_str = nil;
	
	      as_str = self.$to_s();
	      if ((($a = as_str['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$class().$to_s()
	        } else {
	        return "#<" + (self.$class().$to_s()) + ": " + (self.$to_s()) + ">"
	      };
	    });
	
	    return (Opal.defn(self, '$to_s', function() {
	      var $a, $b, self = this;
	
	      return ((($a = (($b = self.message, $b !== false && $b !== nil ?self.message.$to_s() : $b))) !== false && $a !== nil) ? $a : self.$class().$to_s());
	    }), nil) && 'to_s';
	  })($scope.base, Error);
	  (function($base, $super) {
	    function $ScriptError(){};
	    var self = $ScriptError = $klass($base, $super, 'ScriptError', $ScriptError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $SyntaxError(){};
	    var self = $SyntaxError = $klass($base, $super, 'SyntaxError', $SyntaxError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('ScriptError'));
	  (function($base, $super) {
	    function $LoadError(){};
	    var self = $LoadError = $klass($base, $super, 'LoadError', $LoadError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('ScriptError'));
	  (function($base, $super) {
	    function $NotImplementedError(){};
	    var self = $NotImplementedError = $klass($base, $super, 'NotImplementedError', $NotImplementedError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('ScriptError'));
	  (function($base, $super) {
	    function $SystemExit(){};
	    var self = $SystemExit = $klass($base, $super, 'SystemExit', $SystemExit);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $NoMemoryError(){};
	    var self = $NoMemoryError = $klass($base, $super, 'NoMemoryError', $NoMemoryError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $SignalException(){};
	    var self = $SignalException = $klass($base, $super, 'SignalException', $SignalException);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $Interrupt(){};
	    var self = $Interrupt = $klass($base, $super, 'Interrupt', $Interrupt);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $SecurityError(){};
	    var self = $SecurityError = $klass($base, $super, 'SecurityError', $SecurityError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $StandardError(){};
	    var self = $StandardError = $klass($base, $super, 'StandardError', $StandardError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('Exception'));
	  (function($base, $super) {
	    function $ZeroDivisionError(){};
	    var self = $ZeroDivisionError = $klass($base, $super, 'ZeroDivisionError', $ZeroDivisionError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $NameError(){};
	    var self = $NameError = $klass($base, $super, 'NameError', $NameError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $NoMethodError(){};
	    var self = $NoMethodError = $klass($base, $super, 'NoMethodError', $NoMethodError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('NameError'));
	  (function($base, $super) {
	    function $RuntimeError(){};
	    var self = $RuntimeError = $klass($base, $super, 'RuntimeError', $RuntimeError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $LocalJumpError(){};
	    var self = $LocalJumpError = $klass($base, $super, 'LocalJumpError', $LocalJumpError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $TypeError(){};
	    var self = $TypeError = $klass($base, $super, 'TypeError', $TypeError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $ArgumentError(){};
	    var self = $ArgumentError = $klass($base, $super, 'ArgumentError', $ArgumentError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $IndexError(){};
	    var self = $IndexError = $klass($base, $super, 'IndexError', $IndexError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $StopIteration(){};
	    var self = $StopIteration = $klass($base, $super, 'StopIteration', $StopIteration);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('IndexError'));
	  (function($base, $super) {
	    function $KeyError(){};
	    var self = $KeyError = $klass($base, $super, 'KeyError', $KeyError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('IndexError'));
	  (function($base, $super) {
	    function $RangeError(){};
	    var self = $RangeError = $klass($base, $super, 'RangeError', $RangeError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $FloatDomainError(){};
	    var self = $FloatDomainError = $klass($base, $super, 'FloatDomainError', $FloatDomainError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('RangeError'));
	  (function($base, $super) {
	    function $IOError(){};
	    var self = $IOError = $klass($base, $super, 'IOError', $IOError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $SystemCallError(){};
	    var self = $SystemCallError = $klass($base, $super, 'SystemCallError', $SystemCallError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base) {
	    var $Errno, self = $Errno = $module($base, 'Errno');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base, $super) {
	      function $EINVAL(){};
	      var self = $EINVAL = $klass($base, $super, 'EINVAL', $EINVAL);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_1;
	
	      return (Opal.defs(self, '$new', TMP_1 = function() {
	        var self = this, $iter = TMP_1.$$p, $yield = $iter || nil;
	
	        TMP_1.$$p = null;
	        return Opal.find_super_dispatcher(self, 'new', TMP_1, null, $EINVAL).apply(self, ["Invalid argument"]);
	      }), nil) && 'new'
	    })($scope.base, $scope.get('SystemCallError'))
	  })($scope.base);
	  (function($base, $super) {
	    function $UncaughtThrowError(){};
	    var self = $UncaughtThrowError = $klass($base, $super, 'UncaughtThrowError', $UncaughtThrowError);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_2;
	
	    def.sym = nil;
	    self.$attr_reader("sym", "arg");
	
	    return (Opal.defn(self, '$initialize', TMP_2 = function(args) {
	      var $a, self = this, $iter = TMP_2.$$p, $yield = $iter || nil;
	
	      TMP_2.$$p = null;
	      self.sym = args['$[]'](0);
	      if ((($a = $rb_gt(args.$length(), 1)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.arg = args['$[]'](1)};
	      return Opal.find_super_dispatcher(self, 'initialize', TMP_2, null).apply(self, ["uncaught throw " + (self.sym.$inspect())]);
	    }), nil) && 'initialize';
	  })($scope.base, $scope.get('ArgumentError'));
	  (function($base, $super) {
	    function $NameError(){};
	    var self = $NameError = $klass($base, $super, 'NameError', $NameError);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_3;
	
	    self.$attr_reader("name");
	
	    return (Opal.defn(self, '$initialize', TMP_3 = function(message, name) {
	      var self = this, $iter = TMP_3.$$p, $yield = $iter || nil;
	
	      if (name == null) {
	        name = nil
	      }
	      TMP_3.$$p = null;
	      Opal.find_super_dispatcher(self, 'initialize', TMP_3, null).apply(self, [message]);
	      return self.name = name;
	    }), nil) && 'initialize';
	  })($scope.base, null);
	  return (function($base, $super) {
	    function $NoMethodError(){};
	    var self = $NoMethodError = $klass($base, $super, 'NoMethodError', $NoMethodError);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_4;
	
	    self.$attr_reader("args");
	
	    return (Opal.defn(self, '$initialize', TMP_4 = function(message, name, args) {
	      var self = this, $iter = TMP_4.$$p, $yield = $iter || nil;
	
	      if (args == null) {
	        args = []
	      }
	      TMP_4.$$p = null;
	      Opal.find_super_dispatcher(self, 'initialize', TMP_4, null).apply(self, [message, name]);
	      return self.args = args;
	    }), nil) && 'initialize';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/constants"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.cdecl($scope, 'RUBY_PLATFORM', "opal");
	  Opal.cdecl($scope, 'RUBY_ENGINE', "opal");
	  Opal.cdecl($scope, 'RUBY_VERSION', "2.2.3");
	  Opal.cdecl($scope, 'RUBY_ENGINE_VERSION', "0.9.2");
	  Opal.cdecl($scope, 'RUBY_RELEASE_DATE', "2016-01-10");
	  Opal.cdecl($scope, 'RUBY_PATCHLEVEL', 0);
	  Opal.cdecl($scope, 'RUBY_REVISION', 0);
	  Opal.cdecl($scope, 'RUBY_COPYRIGHT', "opal - Copyright (C) 2013-2015 Adam Beynon");
	  return Opal.cdecl($scope, 'RUBY_DESCRIPTION', "opal " + ($scope.get('RUBY_ENGINE_VERSION')) + " (" + ($scope.get('RUBY_RELEASE_DATE')) + " revision " + ($scope.get('RUBY_REVISION')) + ")");
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/base"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require']);
	  self.$require("corelib/runtime");
	  self.$require("corelib/helpers");
	  self.$require("corelib/module");
	  self.$require("corelib/class");
	  self.$require("corelib/basic_object");
	  self.$require("corelib/kernel");
	  self.$require("corelib/error");
	  return self.$require("corelib/constants");
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/nil"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$raise', '$class', '$new', '$>', '$length', '$Rational']);
	  (function($base, $super) {
	    function $NilClass(){};
	    var self = $NilClass = $klass($base, $super, 'NilClass', $NilClass);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.$$meta = self;
	
	    Opal.defn(self, '$!', function() {
	      var self = this;
	
	      return true;
	    });
	
	    Opal.defn(self, '$&', function(other) {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.defn(self, '$|', function(other) {
	      var self = this;
	
	      return other !== false && other !== nil;
	    });
	
	    Opal.defn(self, '$^', function(other) {
	      var self = this;
	
	      return other !== false && other !== nil;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return other === nil;
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this;
	
	      return self.$raise($scope.get('TypeError'), "can't dup " + (self.$class()));
	    });
	
	    Opal.defn(self, '$clone', function() {
	      var self = this;
	
	      return self.$raise($scope.get('TypeError'), "can't clone " + (self.$class()));
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return "nil";
	    });
	
	    Opal.defn(self, '$nil?', function() {
	      var self = this;
	
	      return true;
	    });
	
	    Opal.defn(self, '$singleton_class', function() {
	      var self = this;
	
	      return $scope.get('NilClass');
	    });
	
	    Opal.defn(self, '$to_a', function() {
	      var self = this;
	
	      return [];
	    });
	
	    Opal.defn(self, '$to_h', function() {
	      var self = this;
	
	      return Opal.hash();
	    });
	
	    Opal.defn(self, '$to_i', function() {
	      var self = this;
	
	      return 0;
	    });
	
	    Opal.alias(self, 'to_f', 'to_i');
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return "";
	    });
	
	    Opal.defn(self, '$to_c', function() {
	      var self = this;
	
	      return $scope.get('Complex').$new(0, 0);
	    });
	
	    Opal.defn(self, '$rationalize', function() {
	      var $a, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      if ((($a = $rb_gt(args.$length(), 1)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'))};
	      return self.$Rational(0, 1);
	    });
	
	    Opal.defn(self, '$to_r', function() {
	      var self = this;
	
	      return self.$Rational(0, 1);
	    });
	
	    return (Opal.defn(self, '$instance_variables', function() {
	      var self = this;
	
	      return [];
	    }), nil) && 'instance_variables';
	  })($scope.base, null);
	  return Opal.cdecl($scope, 'NIL', nil);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/boolean"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$raise', '$class']);
	  (function($base, $super) {
	    function $Boolean(){};
	    var self = $Boolean = $klass($base, $super, 'Boolean', $Boolean);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.$$is_boolean = true;
	
	    def.$$meta = self;
	
	    Opal.defn(self, '$__id__', function() {
	      var self = this;
	
	      return self.valueOf() ? 2 : 0;
	    });
	
	    Opal.alias(self, 'object_id', '__id__');
	
	    Opal.defn(self, '$!', function() {
	      var self = this;
	
	      return self != true;
	    });
	
	    Opal.defn(self, '$&', function(other) {
	      var self = this;
	
	      return (self == true) ? (other !== false && other !== nil) : false;
	    });
	
	    Opal.defn(self, '$|', function(other) {
	      var self = this;
	
	      return (self == true) ? true : (other !== false && other !== nil);
	    });
	
	    Opal.defn(self, '$^', function(other) {
	      var self = this;
	
	      return (self == true) ? (other === false || other === nil) : (other !== false && other !== nil);
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return (self == true) === other.valueOf();
	    });
	
	    Opal.alias(self, 'equal?', '==');
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.defn(self, '$singleton_class', function() {
	      var self = this;
	
	      return $scope.get('Boolean');
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return (self == true) ? 'true' : 'false';
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this;
	
	      return self.$raise($scope.get('TypeError'), "can't dup " + (self.$class()));
	    });
	
	    return (Opal.defn(self, '$clone', function() {
	      var self = this;
	
	      return self.$raise($scope.get('TypeError'), "can't clone " + (self.$class()));
	    }), nil) && 'clone';
	  })($scope.base, Boolean);
	  Opal.cdecl($scope, 'TrueClass', $scope.get('Boolean'));
	  Opal.cdecl($scope, 'FalseClass', $scope.get('Boolean'));
	  Opal.cdecl($scope, 'TRUE', true);
	  return Opal.cdecl($scope, 'FALSE', false);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/comparable"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  Opal.add_stubs(['$===', '$>', '$<', '$equal?', '$<=>', '$normalize', '$raise', '$class']);
	  return (function($base) {
	    var $Comparable, self = $Comparable = $module($base, 'Comparable');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defs(self, '$normalize', function(what) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](what)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return what};
	      if ((($a = $rb_gt(what, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return 1};
	      if ((($a = $rb_lt(what, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return -1};
	      return 0;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var $a, self = this, cmp = nil;
	
	      try {
	      if ((($a = self['$equal?'](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return true};
	        
	      if (self["$<=>"] == Opal.Kernel["$<=>"]) {
	        return false;
	      }
	
	      // check for infinite recursion
	      if (self.$$comparable) {
	        delete self.$$comparable;
	        return false;
	      }
	    
	        if ((($a = cmp = (self['$<=>'](other))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          return false
	        };
	        return $scope.get('Comparable').$normalize(cmp) == 0;
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('StandardError')])) {
	        try {
	          return false
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	    });
	
	    Opal.defn(self, '$>', function(other) {
	      var $a, self = this, cmp = nil;
	
	      if ((($a = cmp = (self['$<=>'](other))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (other.$class()) + " failed")
	      };
	      return $scope.get('Comparable').$normalize(cmp) > 0;
	    });
	
	    Opal.defn(self, '$>=', function(other) {
	      var $a, self = this, cmp = nil;
	
	      if ((($a = cmp = (self['$<=>'](other))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (other.$class()) + " failed")
	      };
	      return $scope.get('Comparable').$normalize(cmp) >= 0;
	    });
	
	    Opal.defn(self, '$<', function(other) {
	      var $a, self = this, cmp = nil;
	
	      if ((($a = cmp = (self['$<=>'](other))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (other.$class()) + " failed")
	      };
	      return $scope.get('Comparable').$normalize(cmp) < 0;
	    });
	
	    Opal.defn(self, '$<=', function(other) {
	      var $a, self = this, cmp = nil;
	
	      if ((($a = cmp = (self['$<=>'](other))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (other.$class()) + " failed")
	      };
	      return $scope.get('Comparable').$normalize(cmp) <= 0;
	    });
	
	    Opal.defn(self, '$between?', function(min, max) {
	      var self = this;
	
	      if ($rb_lt(self, min)) {
	        return false};
	      if ($rb_gt(self, max)) {
	        return false};
	      return true;
	    });
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/regexp"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$nil?', '$[]', '$raise', '$escape', '$options', '$to_str', '$new', '$join', '$coerce_to!', '$!', '$match', '$coerce_to?', '$begin', '$coerce_to', '$call', '$=~', '$attr_reader', '$===', '$inspect', '$to_a']);
	  (function($base, $super) {
	    function $RegexpError(){};
	    var self = $RegexpError = $klass($base, $super, 'RegexpError', $RegexpError);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return nil;
	  })($scope.base, $scope.get('StandardError'));
	  (function($base, $super) {
	    function $Regexp(){};
	    var self = $Regexp = $klass($base, $super, 'Regexp', $Regexp);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_2;
	
	    Opal.cdecl($scope, 'IGNORECASE', 1);
	
	    Opal.cdecl($scope, 'MULTILINE', 4);
	
	    def.$$is_regexp = true;
	
	    (function(self) {
	      var $scope = self.$$scope, def = self.$$proto, TMP_1;
	
	      Opal.defn(self, '$allocate', TMP_1 = function() {
	        var self = this, $iter = TMP_1.$$p, $yield = $iter || nil, allocated = nil, $zuper = nil, $zuper_index = nil;
	
	        TMP_1.$$p = null;
	        $zuper = [];
	        for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	          $zuper[$zuper_index] = arguments[$zuper_index];
	        }
	        allocated = Opal.find_super_dispatcher(self, 'allocate', TMP_1, $iter).apply(self, $zuper);
	        allocated.uninitialized = true;
	        return allocated;
	      });
	      Opal.defn(self, '$escape', function(string) {
	        var self = this;
	
	        
	        return string.replace(/([-[\]\/{}()*+?.^$\\| ])/g, '\\$1')
	                     .replace(/[\n]/g, '\\n')
	                     .replace(/[\r]/g, '\\r')
	                     .replace(/[\f]/g, '\\f')
	                     .replace(/[\t]/g, '\\t');
	      
	      });
	      Opal.defn(self, '$last_match', function(n) {
	        var $a, self = this;
	        if ($gvars["~"] == null) $gvars["~"] = nil;
	
	        if (n == null) {
	          n = nil
	        }
	        if ((($a = n['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return $gvars["~"]
	          } else {
	          return $gvars["~"]['$[]'](n)
	        };
	      });
	      Opal.alias(self, 'quote', 'escape');
	      Opal.defn(self, '$union', function() {
	        var self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var parts = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          parts[$splat_index] = arguments[$splat_index + 0];
	        }
	        
	        var is_first_part_array, quoted_validated, part, options, each_part_options;
	        if (parts.length == 0) {
	          return /(?!)/;
	        }
	        // cover the 2 arrays passed as arguments case
	        is_first_part_array = parts[0].$$is_array;
	        if (parts.length > 1 && is_first_part_array) {
	          self.$raise($scope.get('TypeError'), "no implicit conversion of Array into String")
	        }        
	        // deal with splat issues (related to https://github.com/opal/opal/issues/858)
	        if (is_first_part_array) {
	          parts = parts[0];
	        }
	        options = undefined;
	        quoted_validated = [];
	        for (var i=0; i < parts.length; i++) {
	          part = parts[i];
	          if (part.$$is_string) {
	            quoted_validated.push(self.$escape(part));
	          }
	          else if (part.$$is_regexp) {
	            each_part_options = (part).$options();
	            if (options != undefined && options != each_part_options) {
	              self.$raise($scope.get('TypeError'), "All expressions must use the same options")
	            }
	            options = each_part_options;
	            quoted_validated.push('('+part.source+')');
	          }
	          else {
	            quoted_validated.push(self.$escape((part).$to_str()));
	          }
	        }
	      
	        return self.$new((quoted_validated).$join("|"), options);
	      });
	      return (Opal.defn(self, '$new', function(regexp, options) {
	        var self = this;
	
	        
	        if (regexp.$$is_regexp) {
	          return new RegExp(regexp);
	        }
	
	        regexp = $scope.get('Opal')['$coerce_to!'](regexp, $scope.get('String'), "to_str");
	
	        if (regexp.charAt(regexp.length - 1) === '\\') {
	          self.$raise($scope.get('RegexpError'), "too short escape sequence: /" + (regexp) + "/")
	        }
	
	        if (options === undefined || options['$!']()) {
	          return new RegExp(regexp);
	        }
	
	        if (options.$$is_number) {
	          var temp = '';
	          if ($scope.get('IGNORECASE') & options) { temp += 'i'; }
	          if ($scope.get('MULTILINE')  & options) { temp += 'm'; }
	          options = temp;
	        }
	        else {
	          options = 'i';
	        }
	
	        return new RegExp(regexp, options);
	      ;
	      }), nil) && 'new';
	    })(Opal.get_singleton_class(self));
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return other.constructor == RegExp && self.toString() === other.toString();
	    });
	
	    Opal.defn(self, '$===', function(string) {
	      var self = this;
	
	      return self.$match($scope.get('Opal')['$coerce_to?'](string, $scope.get('String'), "to_str")) !== nil;
	    });
	
	    Opal.defn(self, '$=~', function(string) {
	      var $a, self = this;
	      if ($gvars["~"] == null) $gvars["~"] = nil;
	
	      return ($a = self.$match(string), $a !== false && $a !== nil ?$gvars["~"].$begin(0) : $a);
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return self.toString();
	    });
	
	    Opal.defn(self, '$match', TMP_2 = function(string, pos) {
	      var self = this, $iter = TMP_2.$$p, block = $iter || nil;
	      if ($gvars["~"] == null) $gvars["~"] = nil;
	
	      TMP_2.$$p = null;
	      
	      if (self.uninitialized) {
	        self.$raise($scope.get('TypeError'), "uninitialized Regexp")
	      }
	
	      if (pos === undefined) {
	        pos = 0;
	      } else {
	        pos = $scope.get('Opal').$coerce_to(pos, $scope.get('Integer'), "to_int");
	      }
	
	      if (string === nil) {
	        return $gvars["~"] = nil;
	      }
	
	      string = $scope.get('Opal').$coerce_to(string, $scope.get('String'), "to_str");
	
	      if (pos < 0) {
	        pos += string.length;
	        if (pos < 0) {
	          return $gvars["~"] = nil;
	        }
	      }
	
	      var source = self.source;
	      var flags = 'g';
	      // m flag + a . in Ruby will match white space, but in JS, it only matches beginning/ending of lines, so we get the equivalent here
	      if (self.multiline) {
	        source = source.replace('.', "[\\s\\S]");
	        flags += 'm';
	      }
	
	      // global RegExp maintains state, so not using self/this
	      var md, re = new RegExp(source, flags + (self.ignoreCase ? 'i' : ''));
	
	      while (true) {
	        md = re.exec(string);
	        if (md === null) {
	          return $gvars["~"] = nil;
	        }
	        if (md.index >= pos) {
	          $gvars["~"] = $scope.get('MatchData').$new(re, md)
	          return block === nil ? $gvars["~"] : block.$call($gvars["~"]);
	        }
	        re.lastIndex = md.index + 1;
	      }
	    ;
	    });
	
	    Opal.defn(self, '$~', function() {
	      var self = this;
	      if ($gvars._ == null) $gvars._ = nil;
	
	      return self['$=~']($gvars._);
	    });
	
	    Opal.defn(self, '$source', function() {
	      var self = this;
	
	      return self.source;
	    });
	
	    Opal.defn(self, '$options', function() {
	      var self = this;
	
	      
	      if (self.uninitialized) {
	        self.$raise($scope.get('TypeError'), "uninitialized Regexp")
	      }
	      var result = 0;
	      // should be supported in IE6 according to https://msdn.microsoft.com/en-us/library/7f5z26w4(v=vs.94).aspx
	      if (self.multiline) {
	        result |= $scope.get('MULTILINE');
	      }
	      if (self.ignoreCase) {
	        result |= $scope.get('IGNORECASE');
	      }
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$casefold?', function() {
	      var self = this;
	
	      return self.ignoreCase;
	    });
	
	    return Opal.alias(self, 'to_s', 'source');
	  })($scope.base, RegExp);
	  return (function($base, $super) {
	    function $MatchData(){};
	    var self = $MatchData = $klass($base, $super, 'MatchData', $MatchData);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.matches = nil;
	    self.$attr_reader("post_match", "pre_match", "regexp", "string");
	
	    Opal.defn(self, '$initialize', function(regexp, match_groups) {
	      var self = this;
	
	      $gvars["~"] = self;
	      self.regexp = regexp;
	      self.begin = match_groups.index;
	      self.string = match_groups.input;
	      self.pre_match = match_groups.input.slice(0, match_groups.index);
	      self.post_match = match_groups.input.slice(match_groups.index + match_groups[0].length);
	      self.matches = [];
	      
	      for (var i = 0, length = match_groups.length; i < length; i++) {
	        var group = match_groups[i];
	
	        if (group == null) {
	          self.matches.push(nil);
	        }
	        else {
	          self.matches.push(group);
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$[]', function() {
	      var $a, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      return ($a = self.matches)['$[]'].apply($a, Opal.to_a(args));
	    });
	
	    Opal.defn(self, '$offset', function(n) {
	      var self = this;
	
	      
	      if (n !== 0) {
	        self.$raise($scope.get('ArgumentError'), "MatchData#offset only supports 0th element")
	      }
	      return [self.begin, self.begin + self.matches[n].length];
	    ;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var $a, $b, $c, $d, self = this;
	
	      if ((($a = $scope.get('MatchData')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return false
	      };
	      return ($a = ($b = ($c = ($d = self.string == other.string, $d !== false && $d !== nil ?self.regexp.toString() == other.regexp.toString() : $d), $c !== false && $c !== nil ?self.pre_match == other.pre_match : $c), $b !== false && $b !== nil ?self.post_match == other.post_match : $b), $a !== false && $a !== nil ?self.begin == other.begin : $a);
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.defn(self, '$begin', function(n) {
	      var self = this;
	
	      
	      if (n !== 0) {
	        self.$raise($scope.get('ArgumentError'), "MatchData#begin only supports 0th element")
	      }
	      return self.begin;
	    ;
	    });
	
	    Opal.defn(self, '$end', function(n) {
	      var self = this;
	
	      
	      if (n !== 0) {
	        self.$raise($scope.get('ArgumentError'), "MatchData#end only supports 0th element")
	      }
	      return self.begin + self.matches[n].length;
	    ;
	    });
	
	    Opal.defn(self, '$captures', function() {
	      var self = this;
	
	      return self.matches.slice(1);
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      
	      var str = "#<MatchData " + (self.matches[0]).$inspect();
	
	      for (var i = 1, length = self.matches.length; i < length; i++) {
	        str += " " + i + ":" + (self.matches[i]).$inspect();
	      }
	
	      return str + ">";
	    ;
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self.matches.length;
	    });
	
	    Opal.alias(self, 'size', 'length');
	
	    Opal.defn(self, '$to_a', function() {
	      var self = this;
	
	      return self.matches;
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return self.matches[0];
	    });
	
	    return (Opal.defn(self, '$values_at', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var i, a, index, values = [];
	
	      for (i = 0; i < args.length; i++) {
	
	        if (args[i].$$is_range) {
	          a = (args[i]).$to_a();
	          a.unshift(i, 1);
	          Array.prototype.splice.apply(args, a);
	        }
	
	        index = $scope.get('Opal')['$coerce_to!'](args[i], $scope.get('Integer'), "to_int");
	
	        if (index < 0) {
	          index += self.matches.length;
	          if (index < 0) {
	            values.push(nil);
	            continue;
	          }
	        }
	
	        values.push(self.matches[index]);
	      }
	
	      return values;
	    
	    }), nil) && 'values_at';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/string"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$require', '$include', '$coerce_to?', '$coerce_to', '$raise', '$===', '$format', '$to_s', '$respond_to?', '$to_str', '$<=>', '$==', '$=~', '$new', '$empty?', '$ljust', '$ceil', '$/', '$+', '$rjust', '$floor', '$to_a', '$each_char', '$to_proc', '$coerce_to!', '$copy_singleton_methods', '$initialize_clone', '$initialize_dup', '$enum_for', '$size', '$chomp', '$[]', '$to_i', '$class', '$each_line', '$match', '$captures', '$proc', '$shift', '$__send__', '$succ', '$escape']);
	  self.$require("corelib/comparable");
	  self.$require("corelib/regexp");
	  (function($base, $super) {
	    function $String(){};
	    var self = $String = $klass($base, $super, 'String', $String);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_4, TMP_5, TMP_6, TMP_7, TMP_8, TMP_9, TMP_11;
	
	    def.length = nil;
	    self.$include($scope.get('Comparable'));
	
	    def.$$is_string = true;
	
	    Opal.defn(self, '$__id__', function() {
	      var self = this;
	
	      return self.toString();
	    });
	
	    Opal.alias(self, 'object_id', '__id__');
	
	    Opal.defs(self, '$try_convert', function(what) {
	      var self = this;
	
	      return $scope.get('Opal')['$coerce_to?'](what, $scope.get('String'), "to_str");
	    });
	
	    Opal.defs(self, '$new', function(str) {
	      var self = this;
	
	      if (str == null) {
	        str = ""
	      }
	      str = $scope.get('Opal').$coerce_to(str, $scope.get('String'), "to_str");
	      return new String(str);
	    });
	
	    Opal.defn(self, '$initialize', function(str) {
	      var self = this;
	
	      
	      if (str === undefined) {
	        return self;
	      }
	    
	      return self.$raise($scope.get('NotImplementedError'), "Mutable strings are not supported in Opal.");
	    });
	
	    Opal.defn(self, '$%', function(data) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](data)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = self).$format.apply($a, [self].concat(Opal.to_a(data)))
	        } else {
	        return self.$format(self, data)
	      };
	    });
	
	    Opal.defn(self, '$*', function(count) {
	      var self = this;
	
	      
	      count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	
	      if (count < 0) {
	        self.$raise($scope.get('ArgumentError'), "negative argument")
	      }
	
	      if (count === 0) {
	        return '';
	      }
	
	      var result = '',
	          string = self.toString();
	
	      // All credit for the bit-twiddling magic code below goes to Mozilla
	      // polyfill implementation of String.prototype.repeat() posted here:
	      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
	
	      if (string.length * count >= 1 << 28) {
	        self.$raise($scope.get('RangeError'), "multiply count must not overflow maximum string size")
	      }
	
	      for (;;) {
	        if ((count & 1) === 1) {
	          result += string;
	        }
	        count >>>= 1;
	        if (count === 0) {
	          break;
	        }
	        string += string;
	      }
	
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$+', function(other) {
	      var self = this;
	
	      other = $scope.get('Opal').$coerce_to(other, $scope.get('String'), "to_str");
	      return self + other.$to_s();
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var $a, self = this;
	
	      if ((($a = other['$respond_to?']("to_str")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_str().$to_s();
	        return self > other ? 1 : (self < other ? -1 : 0);
	        } else {
	        
	        var cmp = other['$<=>'](self);
	
	        if (cmp === nil) {
	          return nil;
	        }
	        else {
	          return cmp > 0 ? -1 : (cmp < 0 ? 1 : 0);
	        }
	      ;
	      };
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_string) {
	        return self.toString() === other.toString();
	      }
	      if ($scope.get('Opal')['$respond_to?'](other, "to_str")) {
	        return other['$=='](self);
	      }
	      return false;
	    ;
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.alias(self, '===', '==');
	
	    Opal.defn(self, '$=~', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_string) {
	        self.$raise($scope.get('TypeError'), "type mismatch: String given");
	      }
	
	      return other['$=~'](self);
	    ;
	    });
	
	    Opal.defn(self, '$[]', function(index, length) {
	      var self = this;
	
	      
	      var size = self.length, exclude;
	
	      if (index.$$is_range) {
	        exclude = index.exclude;
	        length  = $scope.get('Opal').$coerce_to(index.end, $scope.get('Integer'), "to_int");
	        index   = $scope.get('Opal').$coerce_to(index.begin, $scope.get('Integer'), "to_int");
	
	        if (Math.abs(index) > size) {
	          return nil;
	        }
	
	        if (index < 0) {
	          index += size;
	        }
	
	        if (length < 0) {
	          length += size;
	        }
	
	        if (!exclude) {
	          length += 1;
	        }
	
	        length = length - index;
	
	        if (length < 0) {
	          length = 0;
	        }
	
	        return self.substr(index, length);
	      }
	
	
	      if (index.$$is_string) {
	        if (length != null) {
	          self.$raise($scope.get('TypeError'))
	        }
	        return self.indexOf(index) !== -1 ? index : nil;
	      }
	
	
	      if (index.$$is_regexp) {
	        var match = self.match(index);
	
	        if (match === null) {
	          $gvars["~"] = nil
	          return nil;
	        }
	
	        $gvars["~"] = $scope.get('MatchData').$new(index, match)
	
	        if (length == null) {
	          return match[0];
	        }
	
	        length = $scope.get('Opal').$coerce_to(length, $scope.get('Integer'), "to_int");
	
	        if (length < 0 && -length < match.length) {
	          return match[length += match.length];
	        }
	
	        if (length >= 0 && length < match.length) {
	          return match[length];
	        }
	
	        return nil;
	      }
	
	
	      index = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	
	      if (index < 0) {
	        index += size;
	      }
	
	      if (length == null) {
	        if (index >= size || index < 0) {
	          return nil;
	        }
	        return self.substr(index, 1);
	      }
	
	      length = $scope.get('Opal').$coerce_to(length, $scope.get('Integer'), "to_int");
	
	      if (length < 0) {
	        return nil;
	      }
	
	      if (index > size || index < 0) {
	        return nil;
	      }
	
	      return self.substr(index, length);
	    
	    });
	
	    Opal.alias(self, 'byteslice', '[]');
	
	    Opal.defn(self, '$capitalize', function() {
	      var self = this;
	
	      return self.charAt(0).toUpperCase() + self.substr(1).toLowerCase();
	    });
	
	    Opal.defn(self, '$casecmp', function(other) {
	      var self = this;
	
	      other = $scope.get('Opal').$coerce_to(other, $scope.get('String'), "to_str").$to_s();
	      
	      var ascii_only = /^[\x00-\x7F]*$/;
	      if (ascii_only.test(self) && ascii_only.test(other)) {
	        self = self.toLowerCase();
	        other = other.toLowerCase();
	      }
	    
	      return self['$<=>'](other);
	    });
	
	    Opal.defn(self, '$center', function(width, padstr) {
	      var $a, self = this;
	
	      if (padstr == null) {
	        padstr = " "
	      }
	      width = $scope.get('Opal').$coerce_to(width, $scope.get('Integer'), "to_int");
	      padstr = $scope.get('Opal').$coerce_to(padstr, $scope.get('String'), "to_str").$to_s();
	      if ((($a = padstr['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "zero width padding")};
	      if ((($a = width <= self.length) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self};
	      
	      var ljustified = self.$ljust($rb_divide(($rb_plus(width, self.length)), 2).$ceil(), padstr),
	          rjustified = self.$rjust($rb_divide(($rb_plus(width, self.length)), 2).$floor(), padstr);
	
	      return rjustified + ljustified.slice(self.length);
	    ;
	    });
	
	    Opal.defn(self, '$chars', TMP_1 = function() {
	      var $a, $b, self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      TMP_1.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return self.$each_char().$to_a()
	      };
	      return ($a = ($b = self).$each_char, $a.$$p = block.$to_proc(), $a).call($b);
	    });
	
	    Opal.defn(self, '$chomp', function(separator) {
	      var $a, self = this;
	      if ($gvars["/"] == null) $gvars["/"] = nil;
	
	      if (separator == null) {
	        separator = $gvars["/"]
	      }
	      if ((($a = separator === nil || self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self};
	      separator = $scope.get('Opal')['$coerce_to!'](separator, $scope.get('String'), "to_str").$to_s();
	      
	      if (separator === "\n") {
	        return self.replace(/\r?\n?$/, '');
	      }
	      else if (separator === "") {
	        return self.replace(/(\r?\n)+$/, '');
	      }
	      else if (self.length > separator.length) {
	        var tail = self.substr(self.length - separator.length, separator.length);
	
	        if (tail === separator) {
	          return self.substr(0, self.length - separator.length);
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$chop', function() {
	      var self = this;
	
	      
	      var length = self.length;
	
	      if (length <= 1) {
	        return "";
	      }
	
	      if (self.charAt(length - 1) === "\n" && self.charAt(length - 2) === "\r") {
	        return self.substr(0, length - 2);
	      }
	      else {
	        return self.substr(0, length - 1);
	      }
	    
	    });
	
	    Opal.defn(self, '$chr', function() {
	      var self = this;
	
	      return self.charAt(0);
	    });
	
	    Opal.defn(self, '$clone', function() {
	      var self = this, copy = nil;
	
	      copy = self.slice();
	      copy.$copy_singleton_methods(self);
	      copy.$initialize_clone(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this, copy = nil;
	
	      copy = self.slice();
	      copy.$initialize_dup(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$count', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var sets = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        sets[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      if (sets.length === 0) {
	        self.$raise($scope.get('ArgumentError'), "ArgumentError: wrong number of arguments (0 for 1+)")
	      }
	      var char_class = char_class_from_char_sets(sets);
	      if (char_class === null) {
	        return 0;
	      }
	      return self.length - self.replace(new RegExp(char_class, 'g'), '').length;
	    ;
	    });
	
	    Opal.defn(self, '$delete', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var sets = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        sets[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      if (sets.length === 0) {
	        self.$raise($scope.get('ArgumentError'), "ArgumentError: wrong number of arguments (0 for 1+)")
	      }
	      var char_class = char_class_from_char_sets(sets);
	      if (char_class === null) {
	        return self;
	      }
	      return self.replace(new RegExp(char_class, 'g'), '');
	    ;
	    });
	
	    Opal.defn(self, '$downcase', function() {
	      var self = this;
	
	      return self.toLowerCase();
	    });
	
	    Opal.defn(self, '$each_char', TMP_2 = function() {
	      var $a, $b, TMP_3, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_3 = function(){var self = TMP_3.$$s || this;
	
	        return self.$size()}, TMP_3.$$s = self, TMP_3), $a).call($b, "each_char")
	      };
	      
	      for (var i = 0, length = self.length; i < length; i++) {
	        var value = Opal.yield1(block, self.charAt(i));
	
	        if (value === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$each_line', TMP_4 = function(separator) {
	      var self = this, $iter = TMP_4.$$p, block = $iter || nil;
	      if ($gvars["/"] == null) $gvars["/"] = nil;
	
	      if (separator == null) {
	        separator = $gvars["/"]
	      }
	      TMP_4.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("each_line", separator)
	      };
	      
	      var value;
	
	      if (separator === nil) {
	        value = Opal.yield1(block, self);
	
	        if (value === $breaker) {
	          return value.$v;
	        }
	        else {
	          return self;
	        }
	      }
	
	      separator = $scope.get('Opal').$coerce_to(separator, $scope.get('String'), "to_str")
	
	      var a, i, n, length, chomped, trailing, splitted;
	
	      if (separator.length === 0) {
	        for (a = self.split(/(\n{2,})/), i = 0, n = a.length; i < n; i += 2) {
	          if (a[i] || a[i + 1]) {
	            value = Opal.yield1(block, (a[i] || "") + (a[i + 1] || ""));
	
	            if (value === $breaker) {
	              return value.$v;
	            }
	          }
	        }
	
	        return self;
	      }
	
	      chomped  = self.$chomp(separator);
	      trailing = self.length != chomped.length;
	      splitted = chomped.split(separator);
	
	      for (i = 0, length = splitted.length; i < length; i++) {
	        if (i < length - 1 || trailing) {
	          value = Opal.yield1(block, splitted[i] + separator);
	
	          if (value === $breaker) {
	            return value.$v;
	          }
	        }
	        else {
	          value = Opal.yield1(block, splitted[i]);
	
	          if (value === $breaker) {
	            return value.$v;
	          }
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$empty?', function() {
	      var self = this;
	
	      return self.length === 0;
	    });
	
	    Opal.defn(self, '$end_with?', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var suffixes = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        suffixes[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = 0, length = suffixes.length; i < length; i++) {
	        var suffix = $scope.get('Opal').$coerce_to(suffixes[i], $scope.get('String'), "to_str").$to_s();
	
	        if (self.length >= suffix.length &&
	            self.substr(self.length - suffix.length, suffix.length) == suffix) {
	          return true;
	        }
	      }
	    
	      return false;
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.alias(self, 'equal?', '===');
	
	    Opal.defn(self, '$gsub', TMP_5 = function(pattern, replacement) {
	      var self = this, $iter = TMP_5.$$p, block = $iter || nil;
	
	      TMP_5.$$p = null;
	      
	      if (replacement === undefined && block === nil) {
	        return self.$enum_for("gsub", pattern);
	      }
	
	      var result = '', match_data = nil, index = 0, match, _replacement;
	
	      if (pattern.$$is_regexp) {
	        pattern = new RegExp(pattern.source, 'gm' + (pattern.ignoreCase ? 'i' : ''));
	      } else {
	        pattern = $scope.get('Opal').$coerce_to(pattern, $scope.get('String'), "to_str");
	        pattern = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm');
	      }
	
	      while (true) {
	        match = pattern.exec(self);
	
	        if (match === null) {
	          $gvars["~"] = nil
	          result += self.slice(index);
	          break;
	        }
	
	        match_data = $scope.get('MatchData').$new(pattern, match);
	
	        if (replacement === undefined) {
	          _replacement = block(match[0]);
	        }
	        else if (replacement.$$is_hash) {
	          _replacement = (replacement)['$[]'](match[0]).$to_s();
	        }
	        else {
	          if (!replacement.$$is_string) {
	            replacement = $scope.get('Opal').$coerce_to(replacement, $scope.get('String'), "to_str");
	          }
	          _replacement = replacement.replace(/([\\]+)([0-9+&`'])/g, function (original, slashes, command) {
	            if (slashes.length % 2 === 0) {
	              return original;
	            }
	            switch (command) {
	            case "+":
	              for (var i = match.length - 1; i > 0; i--) {
	                if (match[i] !== undefined) {
	                  return slashes.slice(1) + match[i];
	                }
	              }
	              return '';
	            case "&": return slashes.slice(1) + match[0];
	            case "`": return slashes.slice(1) + self.slice(0, match.index);
	            case "'": return slashes.slice(1) + self.slice(match.index + match[0].length);
	            default:  return slashes.slice(1) + (match[command] || '');
	            }
	          }).replace(/\\\\/g, '\\');
	        }
	
	        if (pattern.lastIndex === match.index) {
	          result += (_replacement + self.slice(index, match.index + 1))
	          pattern.lastIndex += 1;
	        }
	        else {
	          result += (self.slice(index, match.index) + _replacement)
	        }
	        index = pattern.lastIndex;
	      }
	
	      $gvars["~"] = match_data
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return self.toString();
	    });
	
	    Opal.defn(self, '$hex', function() {
	      var self = this;
	
	      return self.$to_i(16);
	    });
	
	    Opal.defn(self, '$include?', function(other) {
	      var $a, self = this;
	
	      
	      if (other.$$is_string) {
	        return self.indexOf(other) !== -1;
	      }
	    
	      if ((($a = other['$respond_to?']("to_str")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "no implicit conversion of " + (other.$class()) + " into String")
	      };
	      return self.indexOf(other.$to_str()) !== -1;
	    });
	
	    Opal.defn(self, '$index', function(search, offset) {
	      var self = this;
	
	      
	      var index,
	          match,
	          regex;
	
	      if (offset === undefined) {
	        offset = 0;
	      } else {
	        offset = $scope.get('Opal').$coerce_to(offset, $scope.get('Integer'), "to_int");
	        if (offset < 0) {
	          offset += self.length;
	          if (offset < 0) {
	            return nil;
	          }
	        }
	      }
	
	      if (search.$$is_regexp) {
	        regex = new RegExp(search.source, 'gm' + (search.ignoreCase ? 'i' : ''));
	        while (true) {
	          match = regex.exec(self);
	          if (match === null) {
	            $gvars["~"] = nil;
	            index = -1;
	            break;
	          }
	          if (match.index >= offset) {
	            $gvars["~"] = $scope.get('MatchData').$new(regex, match)
	            index = match.index;
	            break;
	          }
	          regex.lastIndex = match.index + 1;
	        }
	      } else {
	        search = $scope.get('Opal').$coerce_to(search, $scope.get('String'), "to_str");
	        if (search.length === 0 && offset > self.length) {
	          index = -1;
	        } else {
	          index = self.indexOf(search, offset);
	        }
	      }
	
	      return index === -1 ? nil : index;
	    
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      
	      var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	          meta = {
	            '\u0007': '\\a',
	            '\u001b': '\\e',
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '\v': '\\v',
	            '"' : '\\"',
	            '\\': '\\\\'
	          },
	          escaped = self.replace(escapable, function (chr) {
	            return meta[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16).toUpperCase()).slice(-4);
	          });
	      return '"' + escaped.replace(/\#[\$\@\{]/g, '\\$&') + '"';
	    
	    });
	
	    Opal.defn(self, '$intern', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$lines', TMP_6 = function(separator) {
	      var $a, $b, self = this, $iter = TMP_6.$$p, block = $iter || nil, e = nil;
	      if ($gvars["/"] == null) $gvars["/"] = nil;
	
	      if (separator == null) {
	        separator = $gvars["/"]
	      }
	      TMP_6.$$p = null;
	      e = ($a = ($b = self).$each_line, $a.$$p = block.$to_proc(), $a).call($b, separator);
	      if (block !== false && block !== nil) {
	        return self
	        } else {
	        return e.$to_a()
	      };
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self.length;
	    });
	
	    Opal.defn(self, '$ljust', function(width, padstr) {
	      var $a, self = this;
	
	      if (padstr == null) {
	        padstr = " "
	      }
	      width = $scope.get('Opal').$coerce_to(width, $scope.get('Integer'), "to_int");
	      padstr = $scope.get('Opal').$coerce_to(padstr, $scope.get('String'), "to_str").$to_s();
	      if ((($a = padstr['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "zero width padding")};
	      if ((($a = width <= self.length) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self};
	      
	      var index  = -1,
	          result = "";
	
	      width -= self.length;
	
	      while (++index < width) {
	        result += padstr;
	      }
	
	      return self + result.slice(0, width);
	    
	    });
	
	    Opal.defn(self, '$lstrip', function() {
	      var self = this;
	
	      return self.replace(/^\s*/, '');
	    });
	
	    Opal.defn(self, '$match', TMP_7 = function(pattern, pos) {
	      var $a, $b, self = this, $iter = TMP_7.$$p, block = $iter || nil;
	
	      TMP_7.$$p = null;
	      if ((($a = ((($b = $scope.get('String')['$==='](pattern)) !== false && $b !== nil) ? $b : pattern['$respond_to?']("to_str"))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        pattern = $scope.get('Regexp').$new(pattern.$to_str())};
	      if ((($a = $scope.get('Regexp')['$==='](pattern)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "wrong argument type " + (pattern.$class()) + " (expected Regexp)")
	      };
	      return ($a = ($b = pattern).$match, $a.$$p = block.$to_proc(), $a).call($b, self, pos);
	    });
	
	    Opal.defn(self, '$next', function() {
	      var self = this;
	
	      
	      var i = self.length;
	      if (i === 0) {
	        return '';
	      }
	      var result = self;
	      var first_alphanum_char_index = self.search(/[a-zA-Z0-9]/);
	      var carry = false;
	      var code;
	      while (i--) {
	        code = self.charCodeAt(i);
	        if ((code >= 48 && code <= 57) ||
	          (code >= 65 && code <= 90) ||
	          (code >= 97 && code <= 122)) {
	          switch (code) {
	          case 57:
	            carry = true;
	            code = 48;
	            break;
	          case 90:
	            carry = true;
	            code = 65;
	            break;
	          case 122:
	            carry = true;
	            code = 97;
	            break;
	          default:
	            carry = false;
	            code += 1;
	          }
	        } else {
	          if (first_alphanum_char_index === -1) {
	            if (code === 255) {
	              carry = true;
	              code = 0;
	            } else {
	              carry = false;
	              code += 1;
	            }
	          } else {
	            carry = true;
	          }
	        }
	        result = result.slice(0, i) + String.fromCharCode(code) + result.slice(i + 1);
	        if (carry && (i === 0 || i === first_alphanum_char_index)) {
	          switch (code) {
	          case 65:
	            break;
	          case 97:
	            break;
	          default:
	            code += 1;
	          }
	          if (i === 0) {
	            result = String.fromCharCode(code) + result;
	          } else {
	            result = result.slice(0, i) + String.fromCharCode(code) + result.slice(i);
	          }
	          carry = false;
	        }
	        if (!carry) {
	          break;
	        }
	      }
	      return result;
	    
	    });
	
	    Opal.defn(self, '$oct', function() {
	      var self = this;
	
	      
	      var result,
	          string = self,
	          radix = 8;
	
	      if (/^\s*_/.test(string)) {
	        return 0;
	      }
	
	      string = string.replace(/^(\s*[+-]?)(0[bodx]?)(.+)$/i, function (original, head, flag, tail) {
	        switch (tail.charAt(0)) {
	        case '+':
	        case '-':
	          return original;
	        case '0':
	          if (tail.charAt(1) === 'x' && flag === '0x') {
	            return original;
	          }
	        }
	        switch (flag) {
	        case '0b':
	          radix = 2;
	          break;
	        case '0':
	        case '0o':
	          radix = 8;
	          break;
	        case '0d':
	          radix = 10;
	          break;
	        case '0x':
	          radix = 16;
	          break;
	        }
	        return head + tail;
	      });
	
	      result = parseInt(string.replace(/_(?!_)/g, ''), radix);
	      return isNaN(result) ? 0 : result;
	    
	    });
	
	    Opal.defn(self, '$ord', function() {
	      var self = this;
	
	      return self.charCodeAt(0);
	    });
	
	    Opal.defn(self, '$partition', function(sep) {
	      var self = this;
	
	      
	      var i, m;
	
	      if (sep.$$is_regexp) {
	        m = sep.exec(self);
	        if (m === null) {
	          i = -1;
	        } else {
	          $scope.get('MatchData').$new(sep, m);
	          sep = m[0];
	          i = m.index;
	        }
	      } else {
	        sep = $scope.get('Opal').$coerce_to(sep, $scope.get('String'), "to_str");
	        i = self.indexOf(sep);
	      }
	
	      if (i === -1) {
	        return [self, '', ''];
	      }
	
	      return [
	        self.slice(0, i),
	        self.slice(i, i + sep.length),
	        self.slice(i + sep.length)
	      ];
	    
	    });
	
	    Opal.defn(self, '$reverse', function() {
	      var self = this;
	
	      return self.split('').reverse().join('');
	    });
	
	    Opal.defn(self, '$rindex', function(search, offset) {
	      var self = this;
	
	      
	      var i, m, r, _m;
	
	      if (offset === undefined) {
	        offset = self.length;
	      } else {
	        offset = $scope.get('Opal').$coerce_to(offset, $scope.get('Integer'), "to_int");
	        if (offset < 0) {
	          offset += self.length;
	          if (offset < 0) {
	            return nil;
	          }
	        }
	      }
	
	      if (search.$$is_regexp) {
	        m = null;
	        r = new RegExp(search.source, 'gm' + (search.ignoreCase ? 'i' : ''));
	        while (true) {
	          _m = r.exec(self);
	          if (_m === null || _m.index > offset) {
	            break;
	          }
	          m = _m;
	          r.lastIndex = m.index + 1;
	        }
	        if (m === null) {
	          $gvars["~"] = nil
	          i = -1;
	        } else {
	          $scope.get('MatchData').$new(r, m);
	          i = m.index;
	        }
	      } else {
	        search = $scope.get('Opal').$coerce_to(search, $scope.get('String'), "to_str");
	        i = self.lastIndexOf(search, offset);
	      }
	
	      return i === -1 ? nil : i;
	    
	    });
	
	    Opal.defn(self, '$rjust', function(width, padstr) {
	      var $a, self = this;
	
	      if (padstr == null) {
	        padstr = " "
	      }
	      width = $scope.get('Opal').$coerce_to(width, $scope.get('Integer'), "to_int");
	      padstr = $scope.get('Opal').$coerce_to(padstr, $scope.get('String'), "to_str").$to_s();
	      if ((($a = padstr['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "zero width padding")};
	      if ((($a = width <= self.length) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self};
	      
	      var chars     = Math.floor(width - self.length),
	          patterns  = Math.floor(chars / padstr.length),
	          result    = Array(patterns + 1).join(padstr),
	          remaining = chars - result.length;
	
	      return result + padstr.slice(0, remaining) + self;
	    
	    });
	
	    Opal.defn(self, '$rpartition', function(sep) {
	      var self = this;
	
	      
	      var i, m, r, _m;
	
	      if (sep.$$is_regexp) {
	        m = null;
	        r = new RegExp(sep.source, 'gm' + (sep.ignoreCase ? 'i' : ''));
	
	        while (true) {
	          _m = r.exec(self);
	          if (_m === null) {
	            break;
	          }
	          m = _m;
	          r.lastIndex = m.index + 1;
	        }
	
	        if (m === null) {
	          i = -1;
	        } else {
	          $scope.get('MatchData').$new(r, m);
	          sep = m[0];
	          i = m.index;
	        }
	
	      } else {
	        sep = $scope.get('Opal').$coerce_to(sep, $scope.get('String'), "to_str");
	        i = self.lastIndexOf(sep);
	      }
	
	      if (i === -1) {
	        return ['', '', self];
	      }
	
	      return [
	        self.slice(0, i),
	        self.slice(i, i + sep.length),
	        self.slice(i + sep.length)
	      ];
	    
	    });
	
	    Opal.defn(self, '$rstrip', function() {
	      var self = this;
	
	      return self.replace(/[\s\u0000]*$/, '');
	    });
	
	    Opal.defn(self, '$scan', TMP_8 = function(pattern) {
	      var self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	      TMP_8.$$p = null;
	      
	      var result = [],
	          match_data = nil,
	          match;
	
	      if (pattern.$$is_regexp) {
	        pattern = new RegExp(pattern.source, 'gm' + (pattern.ignoreCase ? 'i' : ''));
	      } else {
	        pattern = $scope.get('Opal').$coerce_to(pattern, $scope.get('String'), "to_str");
	        pattern = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm');
	      }
	
	      while ((match = pattern.exec(self)) != null) {
	        match_data = $scope.get('MatchData').$new(pattern, match);
	        if (block === nil) {
	          match.length == 1 ? result.push(match[0]) : result.push((match_data).$captures());
	        } else {
	          match.length == 1 ? block(match[0]) : block.call(self, (match_data).$captures());
	        }
	        if (pattern.lastIndex === match.index) {
	          pattern.lastIndex += 1;
	        }
	      }
	
	      $gvars["~"] = match_data
	
	      return (block !== nil ? self : result);
	    
	    });
	
	    Opal.alias(self, 'size', 'length');
	
	    Opal.alias(self, 'slice', '[]');
	
	    Opal.defn(self, '$split', function(pattern, limit) {
	      var $a, self = this;
	      if ($gvars[";"] == null) $gvars[";"] = nil;
	
	      
	      if (self.length === 0) {
	        return [];
	      }
	
	      if (limit === undefined) {
	        limit = 0;
	      } else {
	        limit = $scope.get('Opal')['$coerce_to!'](limit, $scope.get('Integer'), "to_int");
	        if (limit === 1) {
	          return [self];
	        }
	      }
	
	      if (pattern === undefined || pattern === nil) {
	        pattern = ((($a = $gvars[";"]) !== false && $a !== nil) ? $a : " ");
	      }
	
	      var result = [],
	          string = self.toString(),
	          index = 0,
	          match,
	          i;
	
	      if (pattern.$$is_regexp) {
	        pattern = new RegExp(pattern.source, 'gm' + (pattern.ignoreCase ? 'i' : ''));
	      } else {
	        pattern = $scope.get('Opal').$coerce_to(pattern, $scope.get('String'), "to_str").$to_s();
	        if (pattern === ' ') {
	          pattern = /\s+/gm;
	          string = string.replace(/^\s+/, '');
	        } else {
	          pattern = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gm');
	        }
	      }
	
	      result = string.split(pattern);
	
	      if (result.length === 1 && result[0] === string) {
	        return result;
	      }
	
	      while ((i = result.indexOf(undefined)) !== -1) {
	        result.splice(i, 1);
	      }
	
	      if (limit === 0) {
	        while (result[result.length - 1] === '') {
	          result.length -= 1;
	        }
	        return result;
	      }
	
	      match = pattern.exec(string);
	
	      if (limit < 0) {
	        if (match !== null && match[0] === '' && pattern.source.indexOf('(?=') === -1) {
	          for (i = 0; i < match.length; i++) {
	            result.push('');
	          }
	        }
	        return result;
	      }
	
	      if (match !== null && match[0] === '') {
	        result.splice(limit - 1, result.length - 1, result.slice(limit - 1).join(''));
	        return result;
	      }
	
	      i = 0;
	      while (match !== null) {
	        i++;
	        index = pattern.lastIndex;
	        if (i + 1 === limit) {
	          break;
	        }
	        match = pattern.exec(string);
	      }
	
	      result.splice(limit - 1, result.length - 1, string.slice(index));
	      return result;
	    
	    });
	
	    Opal.defn(self, '$squeeze', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var sets = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        sets[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      if (sets.length === 0) {
	        return self.replace(/(.)\1+/g, '$1');
	      }
	      var char_class = char_class_from_char_sets(sets);
	      if (char_class === null) {
	        return self;
	      }
	      return self.replace(new RegExp('(' + char_class + ')\\1+', 'g'), '$1');
	    
	    });
	
	    Opal.defn(self, '$start_with?', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var prefixes = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        prefixes[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = 0, length = prefixes.length; i < length; i++) {
	        var prefix = $scope.get('Opal').$coerce_to(prefixes[i], $scope.get('String'), "to_str").$to_s();
	
	        if (self.indexOf(prefix) === 0) {
	          return true;
	        }
	      }
	
	      return false;
	    
	    });
	
	    Opal.defn(self, '$strip', function() {
	      var self = this;
	
	      return self.replace(/^\s*/, '').replace(/[\s\u0000]*$/, '');
	    });
	
	    Opal.defn(self, '$sub', TMP_9 = function(pattern, replacement) {
	      var self = this, $iter = TMP_9.$$p, block = $iter || nil;
	
	      TMP_9.$$p = null;
	      
	      if (!pattern.$$is_regexp) {
	        pattern = $scope.get('Opal').$coerce_to(pattern, $scope.get('String'), "to_str");
	        pattern = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	      }
	
	      var result = pattern.exec(self);
	
	      if (result === null) {
	        $gvars["~"] = nil
	        return self.toString();
	      }
	
	      $scope.get('MatchData').$new(pattern, result)
	
	      if (replacement === undefined) {
	        if (block === nil) {
	          self.$raise($scope.get('ArgumentError'), "wrong number of arguments (1 for 2)")
	        }
	        return self.slice(0, result.index) + block(result[0]) + self.slice(result.index + result[0].length);
	      }
	
	      if (replacement.$$is_hash) {
	        return self.slice(0, result.index) + (replacement)['$[]'](result[0]).$to_s() + self.slice(result.index + result[0].length);
	      }
	
	      replacement = $scope.get('Opal').$coerce_to(replacement, $scope.get('String'), "to_str");
	
	      replacement = replacement.replace(/([\\]+)([0-9+&`'])/g, function (original, slashes, command) {
	        if (slashes.length % 2 === 0) {
	          return original;
	        }
	        switch (command) {
	        case "+":
	          for (var i = result.length - 1; i > 0; i--) {
	            if (result[i] !== undefined) {
	              return slashes.slice(1) + result[i];
	            }
	          }
	          return '';
	        case "&": return slashes.slice(1) + result[0];
	        case "`": return slashes.slice(1) + self.slice(0, result.index);
	        case "'": return slashes.slice(1) + self.slice(result.index + result[0].length);
	        default:  return slashes.slice(1) + (result[command] || '');
	        }
	      }).replace(/\\\\/g, '\\');
	
	      return self.slice(0, result.index) + replacement + self.slice(result.index + result[0].length);
	    ;
	    });
	
	    Opal.alias(self, 'succ', 'next');
	
	    Opal.defn(self, '$sum', function(n) {
	      var self = this;
	
	      if (n == null) {
	        n = 16
	      }
	      
	      n = $scope.get('Opal').$coerce_to(n, $scope.get('Integer'), "to_int");
	
	      var result = 0,
	          length = self.length,
	          i = 0;
	
	      for (; i < length; i++) {
	        result += self.charCodeAt(i);
	      }
	
	      if (n <= 0) {
	        return result;
	      }
	
	      return result & (Math.pow(2, n) - 1);
	    ;
	    });
	
	    Opal.defn(self, '$swapcase', function() {
	      var self = this;
	
	      
	      var str = self.replace(/([a-z]+)|([A-Z]+)/g, function($0,$1,$2) {
	        return $1 ? $0.toUpperCase() : $0.toLowerCase();
	      });
	
	      if (self.constructor === String) {
	        return str;
	      }
	
	      return self.$class().$new(str);
	    
	    });
	
	    Opal.defn(self, '$to_f', function() {
	      var self = this;
	
	      
	      if (self.charAt(0) === '_') {
	        return 0;
	      }
	
	      var result = parseFloat(self.replace(/_/g, ''));
	
	      if (isNaN(result) || result == Infinity || result == -Infinity) {
	        return 0;
	      }
	      else {
	        return result;
	      }
	    
	    });
	
	    Opal.defn(self, '$to_i', function(base) {
	      var self = this;
	
	      if (base == null) {
	        base = 10
	      }
	      
	      var result,
	          string = self.toLowerCase(),
	          radix = $scope.get('Opal').$coerce_to(base, $scope.get('Integer'), "to_int");
	
	      if (radix === 1 || radix < 0 || radix > 36) {
	        self.$raise($scope.get('ArgumentError'), "invalid radix " + (radix))
	      }
	
	      if (/^\s*_/.test(string)) {
	        return 0;
	      }
	
	      string = string.replace(/^(\s*[+-]?)(0[bodx]?)(.+)$/, function (original, head, flag, tail) {
	        switch (tail.charAt(0)) {
	        case '+':
	        case '-':
	          return original;
	        case '0':
	          if (tail.charAt(1) === 'x' && flag === '0x' && (radix === 0 || radix === 16)) {
	            return original;
	          }
	        }
	        switch (flag) {
	        case '0b':
	          if (radix === 0 || radix === 2) {
	            radix = 2;
	            return head + tail;
	          }
	          break;
	        case '0':
	        case '0o':
	          if (radix === 0 || radix === 8) {
	            radix = 8;
	            return head + tail;
	          }
	          break;
	        case '0d':
	          if (radix === 0 || radix === 10) {
	            radix = 10;
	            return head + tail;
	          }
	          break;
	        case '0x':
	          if (radix === 0 || radix === 16) {
	            radix = 16;
	            return head + tail;
	          }
	          break;
	        }
	        return original
	      });
	
	      result = parseInt(string.replace(/_(?!_)/g, ''), radix);
	      return isNaN(result) ? 0 : result;
	    ;
	    });
	
	    Opal.defn(self, '$to_proc', function() {
	      var $a, $b, TMP_10, self = this, sym = nil;
	
	      sym = self;
	      return ($a = ($b = self).$proc, $a.$$p = (TMP_10 = function(args){var self = TMP_10.$$s || this, block, $a, $b, obj = nil;
	args = $slice.call(arguments, 0);
	        block = TMP_10.$$p || nil, TMP_10.$$p = null;
	      if ((($a = args['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "no receiver given")};
	        obj = args.$shift();
	        return ($a = ($b = obj).$__send__, $a.$$p = block.$to_proc(), $a).apply($b, [sym].concat(Opal.to_a(args)));}, TMP_10.$$s = self, TMP_10), $a).call($b);
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return self.toString();
	    });
	
	    Opal.alias(self, 'to_str', 'to_s');
	
	    Opal.alias(self, 'to_sym', 'intern');
	
	    Opal.defn(self, '$tr', function(from, to) {
	      var self = this;
	
	      from = $scope.get('Opal').$coerce_to(from, $scope.get('String'), "to_str").$to_s();
	      to = $scope.get('Opal').$coerce_to(to, $scope.get('String'), "to_str").$to_s();
	      
	      if (from.length == 0 || from === to) {
	        return self;
	      }
	
	      var i, in_range, c, ch, start, end, length;
	      var subs = {};
	      var from_chars = from.split('');
	      var from_length = from_chars.length;
	      var to_chars = to.split('');
	      var to_length = to_chars.length;
	
	      var inverse = false;
	      var global_sub = null;
	      if (from_chars[0] === '^' && from_chars.length > 1) {
	        inverse = true;
	        from_chars.shift();
	        global_sub = to_chars[to_length - 1]
	        from_length -= 1;
	      }
	
	      var from_chars_expanded = [];
	      var last_from = null;
	      in_range = false;
	      for (i = 0; i < from_length; i++) {
	        ch = from_chars[i];
	        if (last_from == null) {
	          last_from = ch;
	          from_chars_expanded.push(ch);
	        }
	        else if (ch === '-') {
	          if (last_from === '-') {
	            from_chars_expanded.push('-');
	            from_chars_expanded.push('-');
	          }
	          else if (i == from_length - 1) {
	            from_chars_expanded.push('-');
	          }
	          else {
	            in_range = true;
	          }
	        }
	        else if (in_range) {
	          start = last_from.charCodeAt(0);
	          end = ch.charCodeAt(0);
	          if (start > end) {
	            self.$raise($scope.get('ArgumentError'), "invalid range \"" + (String.fromCharCode(start)) + "-" + (String.fromCharCode(end)) + "\" in string transliteration")
	          }
	          for (c = start + 1; c < end; c++) {
	            from_chars_expanded.push(String.fromCharCode(c));
	          }
	          from_chars_expanded.push(ch);
	          in_range = null;
	          last_from = null;
	        }
	        else {
	          from_chars_expanded.push(ch);
	        }
	      }
	
	      from_chars = from_chars_expanded;
	      from_length = from_chars.length;
	
	      if (inverse) {
	        for (i = 0; i < from_length; i++) {
	          subs[from_chars[i]] = true;
	        }
	      }
	      else {
	        if (to_length > 0) {
	          var to_chars_expanded = [];
	          var last_to = null;
	          in_range = false;
	          for (i = 0; i < to_length; i++) {
	            ch = to_chars[i];
	            if (last_from == null) {
	              last_from = ch;
	              to_chars_expanded.push(ch);
	            }
	            else if (ch === '-') {
	              if (last_to === '-') {
	                to_chars_expanded.push('-');
	                to_chars_expanded.push('-');
	              }
	              else if (i == to_length - 1) {
	                to_chars_expanded.push('-');
	              }
	              else {
	                in_range = true;
	              }
	            }
	            else if (in_range) {
	              start = last_from.charCodeAt(0);
	              end = ch.charCodeAt(0);
	              if (start > end) {
	                self.$raise($scope.get('ArgumentError'), "invalid range \"" + (String.fromCharCode(start)) + "-" + (String.fromCharCode(end)) + "\" in string transliteration")
	              }
	              for (c = start + 1; c < end; c++) {
	                to_chars_expanded.push(String.fromCharCode(c));
	              }
	              to_chars_expanded.push(ch);
	              in_range = null;
	              last_from = null;
	            }
	            else {
	              to_chars_expanded.push(ch);
	            }
	          }
	
	          to_chars = to_chars_expanded;
	          to_length = to_chars.length;
	        }
	
	        var length_diff = from_length - to_length;
	        if (length_diff > 0) {
	          var pad_char = (to_length > 0 ? to_chars[to_length - 1] : '');
	          for (i = 0; i < length_diff; i++) {
	            to_chars.push(pad_char);
	          }
	        }
	
	        for (i = 0; i < from_length; i++) {
	          subs[from_chars[i]] = to_chars[i];
	        }
	      }
	
	      var new_str = ''
	      for (i = 0, length = self.length; i < length; i++) {
	        ch = self.charAt(i);
	        var sub = subs[ch];
	        if (inverse) {
	          new_str += (sub == null ? global_sub : ch);
	        }
	        else {
	          new_str += (sub != null ? sub : ch);
	        }
	      }
	      return new_str;
	    
	    });
	
	    Opal.defn(self, '$tr_s', function(from, to) {
	      var self = this;
	
	      from = $scope.get('Opal').$coerce_to(from, $scope.get('String'), "to_str").$to_s();
	      to = $scope.get('Opal').$coerce_to(to, $scope.get('String'), "to_str").$to_s();
	      
	      if (from.length == 0) {
	        return self;
	      }
	
	      var i, in_range, c, ch, start, end, length;
	      var subs = {};
	      var from_chars = from.split('');
	      var from_length = from_chars.length;
	      var to_chars = to.split('');
	      var to_length = to_chars.length;
	
	      var inverse = false;
	      var global_sub = null;
	      if (from_chars[0] === '^' && from_chars.length > 1) {
	        inverse = true;
	        from_chars.shift();
	        global_sub = to_chars[to_length - 1]
	        from_length -= 1;
	      }
	
	      var from_chars_expanded = [];
	      var last_from = null;
	      in_range = false;
	      for (i = 0; i < from_length; i++) {
	        ch = from_chars[i];
	        if (last_from == null) {
	          last_from = ch;
	          from_chars_expanded.push(ch);
	        }
	        else if (ch === '-') {
	          if (last_from === '-') {
	            from_chars_expanded.push('-');
	            from_chars_expanded.push('-');
	          }
	          else if (i == from_length - 1) {
	            from_chars_expanded.push('-');
	          }
	          else {
	            in_range = true;
	          }
	        }
	        else if (in_range) {
	          start = last_from.charCodeAt(0);
	          end = ch.charCodeAt(0);
	          if (start > end) {
	            self.$raise($scope.get('ArgumentError'), "invalid range \"" + (String.fromCharCode(start)) + "-" + (String.fromCharCode(end)) + "\" in string transliteration")
	          }
	          for (c = start + 1; c < end; c++) {
	            from_chars_expanded.push(String.fromCharCode(c));
	          }
	          from_chars_expanded.push(ch);
	          in_range = null;
	          last_from = null;
	        }
	        else {
	          from_chars_expanded.push(ch);
	        }
	      }
	
	      from_chars = from_chars_expanded;
	      from_length = from_chars.length;
	
	      if (inverse) {
	        for (i = 0; i < from_length; i++) {
	          subs[from_chars[i]] = true;
	        }
	      }
	      else {
	        if (to_length > 0) {
	          var to_chars_expanded = [];
	          var last_to = null;
	          in_range = false;
	          for (i = 0; i < to_length; i++) {
	            ch = to_chars[i];
	            if (last_from == null) {
	              last_from = ch;
	              to_chars_expanded.push(ch);
	            }
	            else if (ch === '-') {
	              if (last_to === '-') {
	                to_chars_expanded.push('-');
	                to_chars_expanded.push('-');
	              }
	              else if (i == to_length - 1) {
	                to_chars_expanded.push('-');
	              }
	              else {
	                in_range = true;
	              }
	            }
	            else if (in_range) {
	              start = last_from.charCodeAt(0);
	              end = ch.charCodeAt(0);
	              if (start > end) {
	                self.$raise($scope.get('ArgumentError'), "invalid range \"" + (String.fromCharCode(start)) + "-" + (String.fromCharCode(end)) + "\" in string transliteration")
	              }
	              for (c = start + 1; c < end; c++) {
	                to_chars_expanded.push(String.fromCharCode(c));
	              }
	              to_chars_expanded.push(ch);
	              in_range = null;
	              last_from = null;
	            }
	            else {
	              to_chars_expanded.push(ch);
	            }
	          }
	
	          to_chars = to_chars_expanded;
	          to_length = to_chars.length;
	        }
	
	        var length_diff = from_length - to_length;
	        if (length_diff > 0) {
	          var pad_char = (to_length > 0 ? to_chars[to_length - 1] : '');
	          for (i = 0; i < length_diff; i++) {
	            to_chars.push(pad_char);
	          }
	        }
	
	        for (i = 0; i < from_length; i++) {
	          subs[from_chars[i]] = to_chars[i];
	        }
	      }
	      var new_str = ''
	      var last_substitute = null
	      for (i = 0, length = self.length; i < length; i++) {
	        ch = self.charAt(i);
	        var sub = subs[ch]
	        if (inverse) {
	          if (sub == null) {
	            if (last_substitute == null) {
	              new_str += global_sub;
	              last_substitute = true;
	            }
	          }
	          else {
	            new_str += ch;
	            last_substitute = null;
	          }
	        }
	        else {
	          if (sub != null) {
	            if (last_substitute == null || last_substitute !== sub) {
	              new_str += sub;
	              last_substitute = sub;
	            }
	          }
	          else {
	            new_str += ch;
	            last_substitute = null;
	          }
	        }
	      }
	      return new_str;
	    
	    });
	
	    Opal.defn(self, '$upcase', function() {
	      var self = this;
	
	      return self.toUpperCase();
	    });
	
	    Opal.defn(self, '$upto', TMP_11 = function(stop, excl) {
	      var self = this, $iter = TMP_11.$$p, block = $iter || nil;
	
	      if (excl == null) {
	        excl = false
	      }
	      TMP_11.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("upto", stop, excl)
	      };
	      stop = $scope.get('Opal').$coerce_to(stop, $scope.get('String'), "to_str");
	      
	      var a, b, s = self.toString(), value;
	
	      if (s.length === 1 && stop.length === 1) {
	
	        a = s.charCodeAt(0);
	        b = stop.charCodeAt(0);
	
	        while (a <= b) {
	          if (excl && a === b) {
	            break;
	          }
	
	          value = block(String.fromCharCode(a));
	          if (value === $breaker) { return $breaker.$v; }
	
	          a += 1;
	        }
	
	      } else if (parseInt(s, 10).toString() === s && parseInt(stop, 10).toString() === stop) {
	
	        a = parseInt(s, 10);
	        b = parseInt(stop, 10);
	
	        while (a <= b) {
	          if (excl && a === b) {
	            break;
	          }
	
	          value = block(a.toString());
	          if (value === $breaker) { return $breaker.$v; }
	
	          a += 1;
	        }
	
	      } else {
	
	        while (s.length <= stop.length && s <= stop) {
	          if (excl && s === stop) {
	            break;
	          }
	
	          value = block(s);
	          if (value === $breaker) { return $breaker.$v; }
	
	          s = (s).$succ();
	        }
	
	      }
	      return self;
	    
	    });
	
	    
	    function char_class_from_char_sets(sets) {
	      function explode_sequences_in_character_set(set) {
	        var result = '',
	            i, len = set.length,
	            curr_char,
	            skip_next_dash,
	            char_code_from,
	            char_code_upto,
	            char_code;
	        for (i = 0; i < len; i++) {
	          curr_char = set.charAt(i);
	          if (curr_char === '-' && i > 0 && i < (len - 1) && !skip_next_dash) {
	            char_code_from = set.charCodeAt(i - 1);
	            char_code_upto = set.charCodeAt(i + 1);
	            if (char_code_from > char_code_upto) {
	              self.$raise($scope.get('ArgumentError'), "invalid range \"" + (char_code_from) + "-" + (char_code_upto) + "\" in string transliteration")
	            }
	            for (char_code = char_code_from + 1; char_code < char_code_upto + 1; char_code++) {
	              result += String.fromCharCode(char_code);
	            }
	            skip_next_dash = true;
	            i++;
	          } else {
	            skip_next_dash = (curr_char === '\\');
	            result += curr_char;
	          }
	        }
	        return result;
	      }
	
	      function intersection(setA, setB) {
	        if (setA.length === 0) {
	          return setB;
	        }
	        var result = '',
	            i, len = setA.length,
	            chr;
	        for (i = 0; i < len; i++) {
	          chr = setA.charAt(i);
	          if (setB.indexOf(chr) !== -1) {
	            result += chr;
	          }
	        }
	        return result;
	      }
	
	      var i, len, set, neg, chr, tmp,
	          pos_intersection = '',
	          neg_intersection = '';
	
	      for (i = 0, len = sets.length; i < len; i++) {
	        set = $scope.get('Opal').$coerce_to(sets[i], $scope.get('String'), "to_str");
	        neg = (set.charAt(0) === '^' && set.length > 1);
	        set = explode_sequences_in_character_set(neg ? set.slice(1) : set);
	        if (neg) {
	          neg_intersection = intersection(neg_intersection, set);
	        } else {
	          pos_intersection = intersection(pos_intersection, set);
	        }
	      }
	
	      if (pos_intersection.length > 0 && neg_intersection.length > 0) {
	        tmp = '';
	        for (i = 0, len = pos_intersection.length; i < len; i++) {
	          chr = pos_intersection.charAt(i);
	          if (neg_intersection.indexOf(chr) === -1) {
	            tmp += chr;
	          }
	        }
	        pos_intersection = tmp;
	        neg_intersection = '';
	      }
	
	      if (pos_intersection.length > 0) {
	        return '[' + $scope.get('Regexp').$escape(pos_intersection) + ']';
	      }
	
	      if (neg_intersection.length > 0) {
	        return '[^' + $scope.get('Regexp').$escape(neg_intersection) + ']';
	      }
	
	      return null;
	    }
	  
	  })($scope.base, String);
	  return Opal.cdecl($scope, 'Symbol', $scope.get('String'));
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/enumerable"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  Opal.add_stubs(['$raise', '$new', '$yield', '$dup', '$enum_for', '$enumerator_size', '$flatten', '$map', '$==', '$destructure', '$respond_to?', '$coerce_to!', '$>', '$*', '$nil?', '$coerce_to', '$try_convert', '$<', '$+', '$-', '$ceil', '$/', '$size', '$===', '$<<', '$[]', '$[]=', '$inspect', '$__send__', '$compare', '$<=>', '$proc', '$call', '$to_a', '$lambda', '$sort!', '$map!', '$first', '$zip']);
	  return (function($base) {
	    var $Enumerable, self = $Enumerable = $module($base, 'Enumerable');
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_6, TMP_8, TMP_11, TMP_12, TMP_14, TMP_15, TMP_16, TMP_18, TMP_19, TMP_21, TMP_23, TMP_25, TMP_27, TMP_28, TMP_29, TMP_31, TMP_33, TMP_34, TMP_36, TMP_37, TMP_39, TMP_41, TMP_42, TMP_43, TMP_44, TMP_46, TMP_48, TMP_50, TMP_52, TMP_54, TMP_59, TMP_60;
	
	    Opal.defn(self, '$all?', TMP_1 = function() {
	      var $a, self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      TMP_1.$$p = null;
	      
	      var result = true;
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var value = Opal.yieldX(block, arguments);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if ((($a = value) === nil || ($a.$$is_boolean && $a == false))) {
	            result = false;
	            return $breaker;
	          }
	        };
	      }
	      else {
	        self.$each.$$p = function(obj) {
	          if (arguments.length == 1 && (($a = obj) === nil || ($a.$$is_boolean && $a == false))) {
	            result = false;
	            return $breaker;
	          }
	        };
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$any?', TMP_2 = function() {
	      var $a, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      
	      var result = false;
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var value = Opal.yieldX(block, arguments);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            result = true;
	            return $breaker;
	          }
	        };
	      }
	      else {
	        self.$each.$$p = function(obj) {
	          if (arguments.length != 1 || (($a = obj) !== nil && (!$a.$$is_boolean || $a == true))) {
	            result = true;
	            return $breaker;
	          }
	        }
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$chunk', TMP_3 = function(state) {
	      var $a, $b, TMP_4, self = this, $iter = TMP_3.$$p, original_block = $iter || nil;
	
	      TMP_3.$$p = null;
	      if (original_block !== false && original_block !== nil) {
	        } else {
	        $scope.get('Kernel').$raise($scope.get('ArgumentError'), "no block given")
	      };
	      return ($a = ($b = Opal.get('Enumerator')).$new, $a.$$p = (TMP_4 = function(yielder){var self = TMP_4.$$s || this, $a, $b, TMP_5;
	if (yielder == null) yielder = nil;
	      
	        var block, previous = nil, accumulate = [];
	
	        if (state == undefined || state === nil) {
	          block = original_block;
	        } else {
	          block = ($a = ($b = $scope.get('Proc')).$new, $a.$$p = (TMP_5 = function(val){var self = TMP_5.$$s || this;
	if (val == null) val = nil;
	        return original_block.$yield(val, state.$dup())}, TMP_5.$$s = self, TMP_5), $a).call($b)
	        }
	
	        function releaseAccumulate() {
	          if (accumulate.length > 0) {
	            yielder.$yield(previous, accumulate)
	          }
	        }
	
	        self.$each.$$p = function(value) {
	          var key = Opal.yield1(block, value);
	
	          if (key === $breaker) {
	            return $breaker;
	          }
	
	          if (key === nil) {
	            releaseAccumulate();
	            accumulate = [];
	            previous = nil;
	          } else {
	            if (previous === nil || previous === key) {
	              accumulate.push(value);
	            } else {
	              releaseAccumulate();
	              accumulate = [value];
	            }
	
	            previous = key;
	          }
	        }
	
	        self.$each();
	
	        releaseAccumulate();
	      ;}, TMP_4.$$s = self, TMP_4), $a).call($b);
	    });
	
	    Opal.defn(self, '$collect', TMP_6 = function() {
	      var $a, $b, TMP_7, self = this, $iter = TMP_6.$$p, block = $iter || nil;
	
	      TMP_6.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_7 = function(){var self = TMP_7.$$s || this;
	
	        return self.$enumerator_size()}, TMP_7.$$s = self, TMP_7), $a).call($b, "collect")
	      };
	      
	      var result = [];
	
	      self.$each.$$p = function() {
	        var value = Opal.yieldX(block, arguments);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        result.push(value);
	      };
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$collect_concat', TMP_8 = function() {
	      var $a, $b, TMP_9, $c, TMP_10, self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	      TMP_8.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_9 = function(){var self = TMP_9.$$s || this;
	
	        return self.$enumerator_size()}, TMP_9.$$s = self, TMP_9), $a).call($b, "collect_concat")
	      };
	      return ($a = ($c = self).$map, $a.$$p = (TMP_10 = function(item){var self = TMP_10.$$s || this, $a;
	if (item == null) item = nil;
	      return $a = Opal.yield1(block, item), $a === $breaker ? $a : $a}, TMP_10.$$s = self, TMP_10), $a).call($c).$flatten(1);
	    });
	
	    Opal.defn(self, '$count', TMP_11 = function(object) {
	      var $a, self = this, $iter = TMP_11.$$p, block = $iter || nil;
	
	      TMP_11.$$p = null;
	      
	      var result = 0;
	
	      if (object != null) {
	        block = function() {
	          return $scope.get('Opal').$destructure(arguments)['$=='](object);
	        };
	      }
	      else if (block === nil) {
	        block = function() { return true; };
	      }
	
	      self.$each.$$p = function() {
	        var value = Opal.yieldX(block, arguments);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	          result++;
	        }
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$cycle', TMP_12 = function(n) {
	      var $a, $b, TMP_13, self = this, $iter = TMP_12.$$p, block = $iter || nil;
	
	      if (n == null) {
	        n = nil
	      }
	      TMP_12.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_13 = function(){var self = TMP_13.$$s || this, $a;
	
	        if (n['$=='](nil)) {
	            if ((($a = self['$respond_to?']("size")) !== nil && (!$a.$$is_boolean || $a == true))) {
	              return (($scope.get('Float')).$$scope.get('INFINITY'))
	              } else {
	              return nil
	            }
	            } else {
	            n = $scope.get('Opal')['$coerce_to!'](n, $scope.get('Integer'), "to_int");
	            if ((($a = $rb_gt(n, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	              return $rb_times(self.$enumerator_size(), n)
	              } else {
	              return 0
	            };
	          }}, TMP_13.$$s = self, TMP_13), $a).call($b, "cycle", n)
	      };
	      if ((($a = n['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        n = $scope.get('Opal')['$coerce_to!'](n, $scope.get('Integer'), "to_int");
	        if ((($a = n <= 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return nil};
	      };
	      
	      var result,
	          all = [], i, length, value;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        all.push(param);
	      }
	
	      self.$each();
	
	      if (result !== undefined) {
	        return result;
	      }
	
	      if (all.length === 0) {
	        return nil;
	      }
	
	      if (n === nil) {
	        while (true) {
	          for (i = 0, length = all.length; i < length; i++) {
	            value = Opal.yield1(block, all[i]);
	
	            if (value === $breaker) {
	              return $breaker.$v;
	            }
	          }
	        }
	      }
	      else {
	        while (n > 1) {
	          for (i = 0, length = all.length; i < length; i++) {
	            value = Opal.yield1(block, all[i]);
	
	            if (value === $breaker) {
	              return $breaker.$v;
	            }
	          }
	
	          n--;
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$detect', TMP_14 = function(ifnone) {
	      var $a, self = this, $iter = TMP_14.$$p, block = $iter || nil;
	
	      TMP_14.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("detect", ifnone)
	      };
	      
	      var result;
	
	      self.$each.$$p = function() {
	        var params = $scope.get('Opal').$destructure(arguments),
	            value  = Opal.yield1(block, params);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	          result = params;
	          return $breaker;
	        }
	      };
	
	      self.$each();
	
	      if (result === undefined && ifnone !== undefined) {
	        if (typeof(ifnone) === 'function') {
	          result = ifnone();
	        }
	        else {
	          result = ifnone;
	        }
	      }
	
	      return result === undefined ? nil : result;
	    
	    });
	
	    Opal.defn(self, '$drop', function(number) {
	      var $a, self = this;
	
	      number = $scope.get('Opal').$coerce_to(number, $scope.get('Integer'), "to_int");
	      if ((($a = number < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "attempt to drop negative size")};
	      
	      var result  = [],
	          current = 0;
	
	      self.$each.$$p = function() {
	        if (number <= current) {
	          result.push($scope.get('Opal').$destructure(arguments));
	        }
	
	        current++;
	      };
	
	      self.$each()
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$drop_while', TMP_15 = function() {
	      var $a, self = this, $iter = TMP_15.$$p, block = $iter || nil;
	
	      TMP_15.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("drop_while")
	      };
	      
	      var result   = [],
	          dropping = true;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments);
	
	        if (dropping) {
	          var value = Opal.yield1(block, param);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if ((($a = value) === nil || ($a.$$is_boolean && $a == false))) {
	            dropping = false;
	            result.push(param);
	          }
	        }
	        else {
	          result.push(param);
	        }
	      };
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$each_cons', TMP_16 = function(n) {
	      var $a, $b, TMP_17, self = this, $iter = TMP_16.$$p, block = $iter || nil;
	
	      TMP_16.$$p = null;
	      if ((($a = arguments.length != 1) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arguments.length) + " for 1)")};
	      n = $scope.get('Opal').$try_convert(n, $scope.get('Integer'), "to_int");
	      if ((($a = n <= 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "invalid size")};
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_17 = function(){var self = TMP_17.$$s || this, $a, $b, enum_size = nil;
	
	        enum_size = self.$enumerator_size();
	          if ((($a = enum_size['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return nil
	          } else if ((($a = ((($b = enum_size['$=='](0)) !== false && $b !== nil) ? $b : $rb_lt(enum_size, n))) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return 0
	            } else {
	            return $rb_plus($rb_minus(enum_size, n), 1)
	          };}, TMP_17.$$s = self, TMP_17), $a).call($b, "each_cons", n)
	      };
	      
	      var buffer = [], result = nil;
	
	      self.$each.$$p = function() {
	        var element = $scope.get('Opal').$destructure(arguments);
	        buffer.push(element);
	        if (buffer.length > n) {
	          buffer.shift();
	        }
	        if (buffer.length == n) {
	          var value = Opal.yield1(block, buffer.slice(0, n));
	
	          if (value == $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	        }
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$each_entry', TMP_18 = function() {
	      var self = this, $iter = TMP_18.$$p, block = $iter || nil;
	
	      TMP_18.$$p = null;
	      return self.$raise($scope.get('NotImplementedError'));
	    });
	
	    Opal.defn(self, '$each_slice', TMP_19 = function(n) {
	      var $a, $b, TMP_20, self = this, $iter = TMP_19.$$p, block = $iter || nil;
	
	      TMP_19.$$p = null;
	      n = $scope.get('Opal').$coerce_to(n, $scope.get('Integer'), "to_int");
	      if ((($a = n <= 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "invalid slice size")};
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_20 = function(){var self = TMP_20.$$s || this, $a;
	
	        if ((($a = self['$respond_to?']("size")) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return ($rb_divide(self.$size(), n)).$ceil()
	            } else {
	            return nil
	          }}, TMP_20.$$s = self, TMP_20), $a).call($b, "each_slice", n)
	      };
	      
	      var result,
	          slice = []
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments);
	
	        slice.push(param);
	
	        if (slice.length === n) {
	          if (Opal.yield1(block, slice) === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          slice = [];
	        }
	      };
	
	      self.$each();
	
	      if (result !== undefined) {
	        return result;
	      }
	
	      // our "last" group, if smaller than n then won't have been yielded
	      if (slice.length > 0) {
	        if (Opal.yield1(block, slice) === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    ;
	      return nil;
	    });
	
	    Opal.defn(self, '$each_with_index', TMP_21 = function() {
	      var $a, $b, TMP_22, self = this, $iter = TMP_21.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_21.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_22 = function(){var self = TMP_22.$$s || this;
	
	        return self.$enumerator_size()}, TMP_22.$$s = self, TMP_22), $a).apply($b, ["each_with_index"].concat(Opal.to_a(args)))
	      };
	      
	      var result,
	          index = 0;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = block(param, index);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        index++;
	      };
	
	      self.$each.apply(self, args);
	
	      if (result !== undefined) {
	        return result;
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$each_with_object', TMP_23 = function(object) {
	      var $a, $b, TMP_24, self = this, $iter = TMP_23.$$p, block = $iter || nil;
	
	      TMP_23.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_24 = function(){var self = TMP_24.$$s || this;
	
	        return self.$enumerator_size()}, TMP_24.$$s = self, TMP_24), $a).call($b, "each_with_object", object)
	      };
	      
	      var result;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = block(param, object);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	      };
	
	      self.$each();
	
	      if (result !== undefined) {
	        return result;
	      }
	    
	      return object;
	    });
	
	    Opal.defn(self, '$entries', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var result = [];
	
	      self.$each.$$p = function() {
	        result.push($scope.get('Opal').$destructure(arguments));
	      };
	
	      self.$each.apply(self, args);
	
	      return result;
	    
	    });
	
	    Opal.alias(self, 'find', 'detect');
	
	    Opal.defn(self, '$find_all', TMP_25 = function() {
	      var $a, $b, TMP_26, self = this, $iter = TMP_25.$$p, block = $iter || nil;
	
	      TMP_25.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_26 = function(){var self = TMP_26.$$s || this;
	
	        return self.$enumerator_size()}, TMP_26.$$s = self, TMP_26), $a).call($b, "find_all")
	      };
	      
	      var result = [];
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	          result.push(param);
	        }
	      };
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$find_index', TMP_27 = function(object) {
	      var $a, self = this, $iter = TMP_27.$$p, block = $iter || nil;
	
	      TMP_27.$$p = null;
	      if ((($a = object === undefined && block === nil) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$enum_for("find_index")};
	      
	      var result = nil,
	          index  = 0;
	
	      if (object != null) {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments);
	
	          if ((param)['$=='](object)) {
	            result = index;
	            return $breaker;
	          }
	
	          index += 1;
	        };
	      }
	      else if (block !== nil) {
	        self.$each.$$p = function() {
	          var value = Opal.yieldX(block, arguments);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            result = index;
	            return $breaker;
	          }
	
	          index += 1;
	        };
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$first', function(number) {
	      var $a, self = this, result = nil;
	
	      if ((($a = number === undefined) !== nil && (!$a.$$is_boolean || $a == true))) {
	        result = nil;
	        
	        self.$each.$$p = function() {
	          result = $scope.get('Opal').$destructure(arguments);
	
	          return $breaker;
	        };
	
	        self.$each();
	      ;
	        } else {
	        result = [];
	        number = $scope.get('Opal').$coerce_to(number, $scope.get('Integer'), "to_int");
	        if ((($a = number < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "attempt to take negative size")};
	        if ((($a = number == 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return []};
	        
	        var current = 0;
	        number = $scope.get('Opal').$coerce_to(number, $scope.get('Integer'), "to_int");
	
	        self.$each.$$p = function() {
	          result.push($scope.get('Opal').$destructure(arguments));
	
	          if (number <= ++current) {
	            return $breaker;
	          }
	        };
	
	        self.$each();
	      
	      };
	      return result;
	    });
	
	    Opal.alias(self, 'flat_map', 'collect_concat');
	
	    Opal.defn(self, '$grep', TMP_28 = function(pattern) {
	      var $a, self = this, $iter = TMP_28.$$p, block = $iter || nil;
	
	      TMP_28.$$p = null;
	      
	      var result = [];
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments),
	              value = pattern['$==='](param);
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            value = Opal.yield1(block, param);
	
	            if (value === $breaker) {
	              result = $breaker.$v;
	              return $breaker;
	            }
	
	            result.push(value);
	          }
	        };
	      }
	      else {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments),
	              value = pattern['$==='](param);
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            result.push(param);
	          }
	        };
	      }
	
	      self.$each();
	
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$group_by', TMP_29 = function() {
	      var $a, $b, TMP_30, $c, $d, self = this, $iter = TMP_29.$$p, block = $iter || nil, hash = nil;
	
	      TMP_29.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_30 = function(){var self = TMP_30.$$s || this;
	
	        return self.$enumerator_size()}, TMP_30.$$s = self, TMP_30), $a).call($b, "group_by")
	      };
	      hash = $scope.get('Hash').$new();
	      
	      var result;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        (($a = value, $c = hash, ((($d = $c['$[]']($a)) !== false && $d !== nil) ? $d : $c['$[]=']($a, []))))['$<<'](param);
	      }
	
	      self.$each();
	
	      if (result !== undefined) {
	        return result;
	      }
	    
	      return hash;
	    });
	
	    Opal.defn(self, '$include?', function(obj) {
	      var self = this;
	
	      
	      var result = false;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments);
	
	        if ((param)['$=='](obj)) {
	          result = true;
	          return $breaker;
	        }
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$inject', TMP_31 = function(object, sym) {
	      var self = this, $iter = TMP_31.$$p, block = $iter || nil;
	
	      TMP_31.$$p = null;
	      
	      var result = object;
	
	      if (block !== nil && sym === undefined) {
	        self.$each.$$p = function() {
	          var value = $scope.get('Opal').$destructure(arguments);
	
	          if (result === undefined) {
	            result = value;
	            return;
	          }
	
	          value = Opal.yieldX(block, [result, value]);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          result = value;
	        };
	      }
	      else {
	        if (sym === undefined) {
	          if (!$scope.get('Symbol')['$==='](object)) {
	            self.$raise($scope.get('TypeError'), "" + (object.$inspect()) + " is not a Symbol");
	          }
	
	          sym    = object;
	          result = undefined;
	        }
	
	        self.$each.$$p = function() {
	          var value = $scope.get('Opal').$destructure(arguments);
	
	          if (result === undefined) {
	            result = value;
	            return;
	          }
	
	          result = (result).$__send__(sym, value);
	        };
	      }
	
	      self.$each();
	
	      return result == undefined ? nil : result;
	    ;
	    });
	
	    Opal.defn(self, '$lazy', function() {
	      var $a, $b, TMP_32, self = this;
	
	      return ($a = ($b = (($scope.get('Enumerator')).$$scope.get('Lazy'))).$new, $a.$$p = (TMP_32 = function(enum$, args){var self = TMP_32.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	      return ($a = enum$).$yield.apply($a, Opal.to_a(args))}, TMP_32.$$s = self, TMP_32), $a).call($b, self, self.$enumerator_size());
	    });
	
	    Opal.defn(self, '$enumerator_size', function() {
	      var $a, self = this;
	
	      if ((($a = self['$respond_to?']("size")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$size()
	        } else {
	        return nil
	      };
	    });
	
	    Opal.alias(self, 'map', 'collect');
	
	    Opal.defn(self, '$max', TMP_33 = function() {
	      var self = this, $iter = TMP_33.$$p, block = $iter || nil;
	
	      TMP_33.$$p = null;
	      
	      var result;
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments);
	
	          if (result === undefined) {
	            result = param;
	            return;
	          }
	
	          var value = block(param, result);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if (value === nil) {
	            self.$raise($scope.get('ArgumentError'), "comparison failed");
	          }
	
	          if (value > 0) {
	            result = param;
	          }
	        };
	      }
	      else {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments);
	
	          if (result === undefined) {
	            result = param;
	            return;
	          }
	
	          if ($scope.get('Opal').$compare(param, result) > 0) {
	            result = param;
	          }
	        };
	      }
	
	      self.$each();
	
	      return result === undefined ? nil : result;
	    
	    });
	
	    Opal.defn(self, '$max_by', TMP_34 = function() {
	      var $a, $b, TMP_35, self = this, $iter = TMP_34.$$p, block = $iter || nil;
	
	      TMP_34.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_35 = function(){var self = TMP_35.$$s || this;
	
	        return self.$enumerator_size()}, TMP_35.$$s = self, TMP_35), $a).call($b, "max_by")
	      };
	      
	      var result,
	          by;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (result === undefined) {
	          result = param;
	          by     = value;
	          return;
	        }
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((value)['$<=>'](by) > 0) {
	          result = param
	          by     = value;
	        }
	      };
	
	      self.$each();
	
	      return result === undefined ? nil : result;
	    
	    });
	
	    Opal.alias(self, 'member?', 'include?');
	
	    Opal.defn(self, '$min', TMP_36 = function() {
	      var self = this, $iter = TMP_36.$$p, block = $iter || nil;
	
	      TMP_36.$$p = null;
	      
	      var result;
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments);
	
	          if (result === undefined) {
	            result = param;
	            return;
	          }
	
	          var value = block(param, result);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if (value === nil) {
	            self.$raise($scope.get('ArgumentError'), "comparison failed");
	          }
	
	          if (value < 0) {
	            result = param;
	          }
	        };
	      }
	      else {
	        self.$each.$$p = function() {
	          var param = $scope.get('Opal').$destructure(arguments);
	
	          if (result === undefined) {
	            result = param;
	            return;
	          }
	
	          if ($scope.get('Opal').$compare(param, result) < 0) {
	            result = param;
	          }
	        };
	      }
	
	      self.$each();
	
	      return result === undefined ? nil : result;
	    
	    });
	
	    Opal.defn(self, '$min_by', TMP_37 = function() {
	      var $a, $b, TMP_38, self = this, $iter = TMP_37.$$p, block = $iter || nil;
	
	      TMP_37.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_38 = function(){var self = TMP_38.$$s || this;
	
	        return self.$enumerator_size()}, TMP_38.$$s = self, TMP_38), $a).call($b, "min_by")
	      };
	      
	      var result,
	          by;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (result === undefined) {
	          result = param;
	          by     = value;
	          return;
	        }
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((value)['$<=>'](by) < 0) {
	          result = param
	          by     = value;
	        }
	      };
	
	      self.$each();
	
	      return result === undefined ? nil : result;
	    
	    });
	
	    Opal.defn(self, '$minmax', TMP_39 = function() {
	      var $a, $b, $c, TMP_40, self = this, $iter = TMP_39.$$p, block = $iter || nil;
	
	      TMP_39.$$p = null;
	      ((($a = block) !== false && $a !== nil) ? $a : block = ($b = ($c = self).$proc, $b.$$p = (TMP_40 = function(a, b){var self = TMP_40.$$s || this;
	if (a == null) a = nil;if (b == null) b = nil;
	      return a['$<=>'](b)}, TMP_40.$$s = self, TMP_40), $b).call($c));
	      
	      var min = nil, max = nil, first_time = true;
	
	      self.$each.$$p = function() {
	        var element = $scope.get('Opal').$destructure(arguments);
	        if (first_time) {
	          min = max = element;
	          first_time = false;
	        } else {
	          var min_cmp = block.$call(min, element);
	
	          if (min_cmp === nil) {
	            self.$raise($scope.get('ArgumentError'), "comparison failed")
	          } else if (min_cmp > 0) {
	            min = element;
	          }
	
	          var max_cmp = block.$call(max, element);
	
	          if (max_cmp === nil) {
	            self.$raise($scope.get('ArgumentError'), "comparison failed")
	          } else if (max_cmp < 0) {
	            max = element;
	          }
	        }
	      }
	
	      self.$each();
	
	      return [min, max];
	    
	    });
	
	    Opal.defn(self, '$minmax_by', TMP_41 = function() {
	      var self = this, $iter = TMP_41.$$p, block = $iter || nil;
	
	      TMP_41.$$p = null;
	      return self.$raise($scope.get('NotImplementedError'));
	    });
	
	    Opal.defn(self, '$none?', TMP_42 = function() {
	      var $a, self = this, $iter = TMP_42.$$p, block = $iter || nil;
	
	      TMP_42.$$p = null;
	      
	      var result = true;
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var value = Opal.yieldX(block, arguments);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            result = false;
	            return $breaker;
	          }
	        }
	      }
	      else {
	        self.$each.$$p = function() {
	          var value = $scope.get('Opal').$destructure(arguments);
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            result = false;
	            return $breaker;
	          }
	        };
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$one?', TMP_43 = function() {
	      var $a, self = this, $iter = TMP_43.$$p, block = $iter || nil;
	
	      TMP_43.$$p = null;
	      
	      var result = false;
	
	      if (block !== nil) {
	        self.$each.$$p = function() {
	          var value = Opal.yieldX(block, arguments);
	
	          if (value === $breaker) {
	            result = $breaker.$v;
	            return $breaker;
	          }
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            if (result === true) {
	              result = false;
	              return $breaker;
	            }
	
	            result = true;
	          }
	        }
	      }
	      else {
	        self.$each.$$p = function() {
	          var value = $scope.get('Opal').$destructure(arguments);
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            if (result === true) {
	              result = false;
	              return $breaker;
	            }
	
	            result = true;
	          }
	        }
	      }
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$partition', TMP_44 = function() {
	      var $a, $b, TMP_45, self = this, $iter = TMP_44.$$p, block = $iter || nil;
	
	      TMP_44.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_45 = function(){var self = TMP_45.$$s || this;
	
	        return self.$enumerator_size()}, TMP_45.$$s = self, TMP_45), $a).call($b, "partition")
	      };
	      
	      var truthy = [], falsy = [], result;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	          truthy.push(param);
	        }
	        else {
	          falsy.push(param);
	        }
	      };
	
	      self.$each();
	
	      return [truthy, falsy];
	    
	    });
	
	    Opal.alias(self, 'reduce', 'inject');
	
	    Opal.defn(self, '$reject', TMP_46 = function() {
	      var $a, $b, TMP_47, self = this, $iter = TMP_46.$$p, block = $iter || nil;
	
	      TMP_46.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_47 = function(){var self = TMP_47.$$s || this;
	
	        return self.$enumerator_size()}, TMP_47.$$s = self, TMP_47), $a).call($b, "reject")
	      };
	      
	      var result = [];
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((($a = value) === nil || ($a.$$is_boolean && $a == false))) {
	          result.push(param);
	        }
	      };
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$reverse_each', TMP_48 = function() {
	      var $a, $b, TMP_49, self = this, $iter = TMP_48.$$p, block = $iter || nil;
	
	      TMP_48.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_49 = function(){var self = TMP_49.$$s || this;
	
	        return self.$enumerator_size()}, TMP_49.$$s = self, TMP_49), $a).call($b, "reverse_each")
	      };
	      
	      var result = [];
	
	      self.$each.$$p = function() {
	        result.push(arguments);
	      };
	
	      self.$each();
	
	      for (var i = result.length - 1; i >= 0; i--) {
	        Opal.yieldX(block, result[i]);
	      }
	
	      return result;
	    
	    });
	
	    Opal.alias(self, 'select', 'find_all');
	
	    Opal.defn(self, '$slice_before', TMP_50 = function(pattern) {
	      var $a, $b, TMP_51, self = this, $iter = TMP_50.$$p, block = $iter || nil;
	
	      TMP_50.$$p = null;
	      if ((($a = pattern === undefined && block === nil || arguments.length > 1) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arguments.length) + " for 1)")};
	      return ($a = ($b = $scope.get('Enumerator')).$new, $a.$$p = (TMP_51 = function(e){var self = TMP_51.$$s || this, $a;
	if (e == null) e = nil;
	      
	        var slice = [];
	
	        if (block !== nil) {
	          if (pattern === undefined) {
	            self.$each.$$p = function() {
	              var param = $scope.get('Opal').$destructure(arguments),
	                  value = Opal.yield1(block, param);
	
	              if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true)) && slice.length > 0) {
	                e['$<<'](slice);
	                slice = [];
	              }
	
	              slice.push(param);
	            };
	          }
	          else {
	            self.$each.$$p = function() {
	              var param = $scope.get('Opal').$destructure(arguments),
	                  value = block(param, pattern.$dup());
	
	              if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true)) && slice.length > 0) {
	                e['$<<'](slice);
	                slice = [];
	              }
	
	              slice.push(param);
	            };
	          }
	        }
	        else {
	          self.$each.$$p = function() {
	            var param = $scope.get('Opal').$destructure(arguments),
	                value = pattern['$==='](param);
	
	            if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true)) && slice.length > 0) {
	              e['$<<'](slice);
	              slice = [];
	            }
	
	            slice.push(param);
	          };
	        }
	
	        self.$each();
	
	        if (slice.length > 0) {
	          e['$<<'](slice);
	        }
	      ;}, TMP_51.$$s = self, TMP_51), $a).call($b);
	    });
	
	    Opal.defn(self, '$sort', TMP_52 = function() {
	      var $a, $b, TMP_53, self = this, $iter = TMP_52.$$p, block = $iter || nil, ary = nil;
	
	      TMP_52.$$p = null;
	      ary = self.$to_a();
	      if ((block !== nil)) {
	        } else {
	        block = ($a = ($b = self).$lambda, $a.$$p = (TMP_53 = function(a, b){var self = TMP_53.$$s || this;
	if (a == null) a = nil;if (b == null) b = nil;
	        return a['$<=>'](b)}, TMP_53.$$s = self, TMP_53), $a).call($b)
	      };
	      return ary.sort(block);
	    });
	
	    Opal.defn(self, '$sort_by', TMP_54 = function() {
	      var $a, $b, TMP_55, $c, TMP_56, $d, TMP_57, $e, TMP_58, self = this, $iter = TMP_54.$$p, block = $iter || nil, dup = nil;
	
	      TMP_54.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_55 = function(){var self = TMP_55.$$s || this;
	
	        return self.$enumerator_size()}, TMP_55.$$s = self, TMP_55), $a).call($b, "sort_by")
	      };
	      dup = ($a = ($c = self).$map, $a.$$p = (TMP_56 = function(){var self = TMP_56.$$s || this, arg = nil;
	
	      arg = $scope.get('Opal').$destructure(arguments);
	        return [block.$call(arg), arg];}, TMP_56.$$s = self, TMP_56), $a).call($c);
	      ($a = ($d = dup)['$sort!'], $a.$$p = (TMP_57 = function(a, b){var self = TMP_57.$$s || this;
	if (a == null) a = nil;if (b == null) b = nil;
	      return (a[0])['$<=>'](b[0])}, TMP_57.$$s = self, TMP_57), $a).call($d);
	      return ($a = ($e = dup)['$map!'], $a.$$p = (TMP_58 = function(i){var self = TMP_58.$$s || this;
	if (i == null) i = nil;
	      return i[1];}, TMP_58.$$s = self, TMP_58), $a).call($e);
	    });
	
	    Opal.defn(self, '$take', function(num) {
	      var self = this;
	
	      return self.$first(num);
	    });
	
	    Opal.defn(self, '$take_while', TMP_59 = function() {
	      var $a, self = this, $iter = TMP_59.$$p, block = $iter || nil;
	
	      TMP_59.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return self.$enum_for("take_while")
	      };
	      
	      var result = [];
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = Opal.yield1(block, param);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        if ((($a = value) === nil || ($a.$$is_boolean && $a == false))) {
	          return $breaker;
	        }
	
	        result.push(param);
	      };
	
	      self.$each();
	
	      return result;
	    
	    });
	
	    Opal.alias(self, 'to_a', 'entries');
	
	    Opal.defn(self, '$zip', TMP_60 = function() {
	      var $a, self = this, $iter = TMP_60.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var others = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        others[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_60.$$p = null;
	      return ($a = self.$to_a()).$zip.apply($a, Opal.to_a(others));
	    });
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/enumerator"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$include', '$allocate', '$new', '$to_proc', '$coerce_to', '$nil?', '$empty?', '$+', '$class', '$__send__', '$===', '$call', '$enum_for', '$size', '$destructure', '$inspect', '$[]', '$raise', '$yield', '$each', '$enumerator_size', '$respond_to?', '$try_convert', '$<', '$for']);
	  self.$require("corelib/enumerable");
	  return (function($base, $super) {
	    function $Enumerator(){};
	    var self = $Enumerator = $klass($base, $super, 'Enumerator', $Enumerator);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4;
	
	    def.size = def.args = def.object = def.method = nil;
	    self.$include($scope.get('Enumerable'));
	
	    def.$$is_enumerator = true;
	
	    Opal.defs(self, '$for', TMP_1 = function(object, method) {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 2;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 2];
	      }
	      if (method == null) {
	        method = "each"
	      }
	      TMP_1.$$p = null;
	      
	      var obj = self.$allocate();
	
	      obj.object = object;
	      obj.size   = block;
	      obj.method = method;
	      obj.args   = args;
	
	      return obj;
	    ;
	    });
	
	    Opal.defn(self, '$initialize', TMP_2 = function() {
	      var $a, $b, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      if (block !== false && block !== nil) {
	        self.object = ($a = ($b = $scope.get('Generator')).$new, $a.$$p = block.$to_proc(), $a).call($b);
	        self.method = "each";
	        self.args = [];
	        self.size = arguments[0] || nil;
	        if ((($a = self.size) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self.size = $scope.get('Opal').$coerce_to(self.size, $scope.get('Integer'), "to_int")
	          } else {
	          return nil
	        };
	        } else {
	        self.object = arguments[0];
	        self.method = arguments[1] || "each";
	        self.args = $slice.call(arguments, 2);
	        return self.size = nil;
	      };
	    });
	
	    Opal.defn(self, '$each', TMP_3 = function() {
	      var $a, $b, $c, self = this, $iter = TMP_3.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_3.$$p = null;
	      if ((($a = ($b = block['$nil?'](), $b !== false && $b !== nil ?args['$empty?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self};
	      args = $rb_plus(self.args, args);
	      if ((($a = block['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = self.$class()).$new.apply($a, [self.object, self.method].concat(Opal.to_a(args)))};
	      return ($b = ($c = self.object).$__send__, $b.$$p = block.$to_proc(), $b).apply($c, [self.method].concat(Opal.to_a(args)));
	    });
	
	    Opal.defn(self, '$size', function() {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Proc')['$==='](self.size)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = self.size).$call.apply($a, Opal.to_a(self.args))
	        } else {
	        return self.size
	      };
	    });
	
	    Opal.defn(self, '$with_index', TMP_4 = function(offset) {
	      var $a, $b, TMP_5, self = this, $iter = TMP_4.$$p, block = $iter || nil;
	
	      if (offset == null) {
	        offset = 0
	      }
	      TMP_4.$$p = null;
	      if (offset !== false && offset !== nil) {
	        offset = $scope.get('Opal').$coerce_to(offset, $scope.get('Integer'), "to_int")
	        } else {
	        offset = 0
	      };
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_5 = function(){var self = TMP_5.$$s || this;
	
	        return self.$size()}, TMP_5.$$s = self, TMP_5), $a).call($b, "with_index", offset)
	      };
	      
	      var result, index = offset;
	
	      self.$each.$$p = function() {
	        var param = $scope.get('Opal').$destructure(arguments),
	            value = block(param, index);
	
	        if (value === $breaker) {
	          result = $breaker.$v;
	          return $breaker;
	        }
	
	        index++;
	
	        return value;
	      }
	
	      self.$each();
	
	      if (result !== undefined) {
	        return result;
	      }
	
	      return self.object;
	    
	    });
	
	    Opal.alias(self, 'with_object', 'each_with_object');
	
	    Opal.defn(self, '$inspect', function() {
	      var $a, self = this, result = nil;
	
	      result = "#<" + (self.$class()) + ": " + (self.object.$inspect()) + ":" + (self.method);
	      if ((($a = self.args['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        result = $rb_plus(result, "(" + (self.args.$inspect()['$[]']($scope.get('Range').$new(1, -2))) + ")")
	      };
	      return $rb_plus(result, ">");
	    });
	
	    (function($base, $super) {
	      function $Generator(){};
	      var self = $Generator = $klass($base, $super, 'Generator', $Generator);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_6, TMP_7;
	
	      def.block = nil;
	      self.$include($scope.get('Enumerable'));
	
	      Opal.defn(self, '$initialize', TMP_6 = function() {
	        var self = this, $iter = TMP_6.$$p, block = $iter || nil;
	
	        TMP_6.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('LocalJumpError'), "no block given")
	        };
	        return self.block = block;
	      });
	
	      return (Opal.defn(self, '$each', TMP_7 = function() {
	        var $a, $b, self = this, $iter = TMP_7.$$p, block = $iter || nil, yielder = nil, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        TMP_7.$$p = null;
	        yielder = ($a = ($b = $scope.get('Yielder')).$new, $a.$$p = block.$to_proc(), $a).call($b);
	        
	        try {
	          args.unshift(yielder);
	
	          if (Opal.yieldX(self.block, args) === $breaker) {
	            return $breaker.$v;
	          }
	        }
	        catch (e) {
	          if (e === $breaker) {
	            return $breaker.$v;
	          }
	          else {
	            throw e;
	          }
	        }
	      ;
	        return self;
	      }), nil) && 'each';
	    })($scope.base, null);
	
	    (function($base, $super) {
	      function $Yielder(){};
	      var self = $Yielder = $klass($base, $super, 'Yielder', $Yielder);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_8;
	
	      def.block = nil;
	      Opal.defn(self, '$initialize', TMP_8 = function() {
	        var self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	        TMP_8.$$p = null;
	        return self.block = block;
	      });
	
	      Opal.defn(self, '$yield', function() {
	        var self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var values = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          values[$splat_index] = arguments[$splat_index + 0];
	        }
	        
	        var value = Opal.yieldX(self.block, values);
	
	        if (value === $breaker) {
	          throw $breaker;
	        }
	
	        return value;
	      ;
	      });
	
	      return (Opal.defn(self, '$<<', function() {
	        var $a, self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var values = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          values[$splat_index] = arguments[$splat_index + 0];
	        }
	        ($a = self).$yield.apply($a, Opal.to_a(values));
	        return self;
	      }), nil) && '<<';
	    })($scope.base, null);
	
	    return (function($base, $super) {
	      function $Lazy(){};
	      var self = $Lazy = $klass($base, $super, 'Lazy', $Lazy);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_9, TMP_12, TMP_14, TMP_19, TMP_21, TMP_22, TMP_24, TMP_27, TMP_30;
	
	      def.enumerator = nil;
	      (function($base, $super) {
	        function $StopLazyError(){};
	        var self = $StopLazyError = $klass($base, $super, 'StopLazyError', $StopLazyError);
	
	        var def = self.$$proto, $scope = self.$$scope;
	
	        return nil;
	      })($scope.base, $scope.get('Exception'));
	
	      Opal.defn(self, '$initialize', TMP_9 = function(object, size) {
	        var TMP_10, self = this, $iter = TMP_9.$$p, block = $iter || nil;
	
	        if (size == null) {
	          size = nil
	        }
	        TMP_9.$$p = null;
	        if ((block !== nil)) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy new without a block")
	        };
	        self.enumerator = object;
	        return Opal.find_super_dispatcher(self, 'initialize', TMP_9, (TMP_10 = function(yielder, each_args){var self = TMP_10.$$s || this, $a, $b, TMP_11;
	if (yielder == null) yielder = nil;each_args = $slice.call(arguments, 1);
	        try {
	          return ($a = ($b = object).$each, $a.$$p = (TMP_11 = function(args){var self = TMP_11.$$s || this;
	args = $slice.call(arguments, 0);
	            
	              args.unshift(yielder);
	
	              if (Opal.yieldX(block, args) === $breaker) {
	                return $breaker;
	              }
	            ;}, TMP_11.$$s = self, TMP_11), $a).apply($b, Opal.to_a(each_args))
	          } catch ($err) {if (Opal.rescue($err, [$scope.get('Exception')])) {
	            try {
	              return nil
	            } finally {
	              Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	            }
	            }else { throw $err; }
	          }}, TMP_10.$$s = self, TMP_10)).apply(self, [size]);
	      });
	
	      Opal.alias(self, 'force', 'to_a');
	
	      Opal.defn(self, '$lazy', function() {
	        var self = this;
	
	        return self;
	      });
	
	      Opal.defn(self, '$collect', TMP_12 = function() {
	        var $a, $b, TMP_13, self = this, $iter = TMP_12.$$p, block = $iter || nil;
	
	        TMP_12.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy map without a block")
	        };
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_13 = function(enum$, args){var self = TMP_13.$$s || this;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        
	          var value = Opal.yieldX(block, args);
	
	          if (value === $breaker) {
	            return $breaker;
	          }
	
	          enum$.$yield(value);
	        }, TMP_13.$$s = self, TMP_13), $a).call($b, self, self.$enumerator_size());
	      });
	
	      Opal.defn(self, '$collect_concat', TMP_14 = function() {
	        var $a, $b, TMP_15, self = this, $iter = TMP_14.$$p, block = $iter || nil;
	
	        TMP_14.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy map without a block")
	        };
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_15 = function(enum$, args){var self = TMP_15.$$s || this, $a, $b, TMP_16, $c, TMP_17;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        
	          var value = Opal.yieldX(block, args);
	
	          if (value === $breaker) {
	            return $breaker;
	          }
	
	          if ((value)['$respond_to?']("force") && (value)['$respond_to?']("each")) {
	            ($a = ($b = (value)).$each, $a.$$p = (TMP_16 = function(v){var self = TMP_16.$$s || this;
	if (v == null) v = nil;
	          return enum$.$yield(v)}, TMP_16.$$s = self, TMP_16), $a).call($b)
	          }
	          else {
	            var array = $scope.get('Opal').$try_convert(value, $scope.get('Array'), "to_ary");
	
	            if (array === nil) {
	              enum$.$yield(value);
	            }
	            else {
	              ($a = ($c = (value)).$each, $a.$$p = (TMP_17 = function(v){var self = TMP_17.$$s || this;
	if (v == null) v = nil;
	          return enum$.$yield(v)}, TMP_17.$$s = self, TMP_17), $a).call($c);
	            }
	          }
	        ;}, TMP_15.$$s = self, TMP_15), $a).call($b, self, nil);
	      });
	
	      Opal.defn(self, '$drop', function(n) {
	        var $a, $b, TMP_18, self = this, current_size = nil, set_size = nil, dropped = nil;
	
	        n = $scope.get('Opal').$coerce_to(n, $scope.get('Integer'), "to_int");
	        if ((($a = $rb_lt(n, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "attempt to drop negative size")};
	        current_size = self.$enumerator_size();
	        set_size = (function() {if ((($a = $scope.get('Integer')['$==='](current_size)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          if ((($a = $rb_lt(n, current_size)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return n
	            } else {
	            return current_size
	          }
	          } else {
	          return current_size
	        }; return nil; })();
	        dropped = 0;
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_18 = function(enum$, args){var self = TMP_18.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        if ((($a = $rb_lt(dropped, n)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return dropped = $rb_plus(dropped, 1)
	            } else {
	            return ($a = enum$).$yield.apply($a, Opal.to_a(args))
	          }}, TMP_18.$$s = self, TMP_18), $a).call($b, self, set_size);
	      });
	
	      Opal.defn(self, '$drop_while', TMP_19 = function() {
	        var $a, $b, TMP_20, self = this, $iter = TMP_19.$$p, block = $iter || nil, succeeding = nil;
	
	        TMP_19.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy drop_while without a block")
	        };
	        succeeding = true;
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_20 = function(enum$, args){var self = TMP_20.$$s || this, $a, $b;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        if (succeeding !== false && succeeding !== nil) {
	            
	            var value = Opal.yieldX(block, args);
	
	            if (value === $breaker) {
	              return $breaker;
	            }
	
	            if ((($a = value) === nil || ($a.$$is_boolean && $a == false))) {
	              succeeding = false;
	
	              ($a = enum$).$yield.apply($a, Opal.to_a(args));
	            }
	          
	            } else {
	            return ($b = enum$).$yield.apply($b, Opal.to_a(args))
	          }}, TMP_20.$$s = self, TMP_20), $a).call($b, self, nil);
	      });
	
	      Opal.defn(self, '$enum_for', TMP_21 = function(method) {
	        var $a, $b, self = this, $iter = TMP_21.$$p, block = $iter || nil, $splat_index = nil;
	
	        var array_size = arguments.length - 1;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 1];
	        }
	        if (method == null) {
	          method = "each"
	        }
	        TMP_21.$$p = null;
	        return ($a = ($b = self.$class()).$for, $a.$$p = block.$to_proc(), $a).apply($b, [self, method].concat(Opal.to_a(args)));
	      });
	
	      Opal.defn(self, '$find_all', TMP_22 = function() {
	        var $a, $b, TMP_23, self = this, $iter = TMP_22.$$p, block = $iter || nil;
	
	        TMP_22.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy select without a block")
	        };
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_23 = function(enum$, args){var self = TMP_23.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        
	          var value = Opal.yieldX(block, args);
	
	          if (value === $breaker) {
	            return $breaker;
	          }
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            ($a = enum$).$yield.apply($a, Opal.to_a(args));
	          }
	        ;}, TMP_23.$$s = self, TMP_23), $a).call($b, self, nil);
	      });
	
	      Opal.alias(self, 'flat_map', 'collect_concat');
	
	      Opal.defn(self, '$grep', TMP_24 = function(pattern) {
	        var $a, $b, TMP_25, $c, TMP_26, self = this, $iter = TMP_24.$$p, block = $iter || nil;
	
	        TMP_24.$$p = null;
	        if (block !== false && block !== nil) {
	          return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_25 = function(enum$, args){var self = TMP_25.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	          
	            var param = $scope.get('Opal').$destructure(args),
	                value = pattern['$==='](param);
	
	            if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	              value = Opal.yield1(block, param);
	
	              if (value === $breaker) {
	                return $breaker;
	              }
	
	              enum$.$yield(Opal.yield1(block, param));
	            }
	          ;}, TMP_25.$$s = self, TMP_25), $a).call($b, self, nil)
	          } else {
	          return ($a = ($c = $scope.get('Lazy')).$new, $a.$$p = (TMP_26 = function(enum$, args){var self = TMP_26.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	          
	            var param = $scope.get('Opal').$destructure(args),
	                value = pattern['$==='](param);
	
	            if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	              enum$.$yield(param);
	            }
	          ;}, TMP_26.$$s = self, TMP_26), $a).call($c, self, nil)
	        };
	      });
	
	      Opal.alias(self, 'map', 'collect');
	
	      Opal.alias(self, 'select', 'find_all');
	
	      Opal.defn(self, '$reject', TMP_27 = function() {
	        var $a, $b, TMP_28, self = this, $iter = TMP_27.$$p, block = $iter || nil;
	
	        TMP_27.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy reject without a block")
	        };
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_28 = function(enum$, args){var self = TMP_28.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        
	          var value = Opal.yieldX(block, args);
	
	          if (value === $breaker) {
	            return $breaker;
	          }
	
	          if ((($a = value) === nil || ($a.$$is_boolean && $a == false))) {
	            ($a = enum$).$yield.apply($a, Opal.to_a(args));
	          }
	        ;}, TMP_28.$$s = self, TMP_28), $a).call($b, self, nil);
	      });
	
	      Opal.defn(self, '$take', function(n) {
	        var $a, $b, TMP_29, self = this, current_size = nil, set_size = nil, taken = nil;
	
	        n = $scope.get('Opal').$coerce_to(n, $scope.get('Integer'), "to_int");
	        if ((($a = $rb_lt(n, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "attempt to take negative size")};
	        current_size = self.$enumerator_size();
	        set_size = (function() {if ((($a = $scope.get('Integer')['$==='](current_size)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          if ((($a = $rb_lt(n, current_size)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return n
	            } else {
	            return current_size
	          }
	          } else {
	          return current_size
	        }; return nil; })();
	        taken = 0;
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_29 = function(enum$, args){var self = TMP_29.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        if ((($a = $rb_lt(taken, n)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            ($a = enum$).$yield.apply($a, Opal.to_a(args));
	            return taken = $rb_plus(taken, 1);
	            } else {
	            return self.$raise($scope.get('StopLazyError'))
	          }}, TMP_29.$$s = self, TMP_29), $a).call($b, self, set_size);
	      });
	
	      Opal.defn(self, '$take_while', TMP_30 = function() {
	        var $a, $b, TMP_31, self = this, $iter = TMP_30.$$p, block = $iter || nil;
	
	        TMP_30.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "tried to call lazy take_while without a block")
	        };
	        return ($a = ($b = $scope.get('Lazy')).$new, $a.$$p = (TMP_31 = function(enum$, args){var self = TMP_31.$$s || this, $a;
	if (enum$ == null) enum$ = nil;args = $slice.call(arguments, 1);
	        
	          var value = Opal.yieldX(block, args);
	
	          if (value === $breaker) {
	            return $breaker;
	          }
	
	          if ((($a = value) !== nil && (!$a.$$is_boolean || $a == true))) {
	            ($a = enum$).$yield.apply($a, Opal.to_a(args));
	          }
	          else {
	            self.$raise($scope.get('StopLazyError'));
	          }
	        ;}, TMP_31.$$s = self, TMP_31), $a).call($b, self, nil);
	      });
	
	      Opal.alias(self, 'to_enum', 'enum_for');
	
	      return (Opal.defn(self, '$inspect', function() {
	        var self = this;
	
	        return "#<" + (self.$class()) + ": " + (self.enumerator.$inspect()) + ">";
	      }), nil) && 'inspect';
	    })($scope.base, self);
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/numeric"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$include', '$instance_of?', '$class', '$Float', '$coerce', '$===', '$raise', '$__send__', '$equal?', '$coerce_to!', '$-@', '$**', '$-', '$*', '$div', '$<', '$ceil', '$to_f', '$denominator', '$to_r', '$==', '$floor', '$/', '$%', '$Complex', '$zero?', '$numerator', '$abs', '$arg', '$round', '$to_i', '$truncate', '$>']);
	  self.$require("corelib/comparable");
	  return (function($base, $super) {
	    function $Numeric(){};
	    var self = $Numeric = $klass($base, $super, 'Numeric', $Numeric);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    self.$include($scope.get('Comparable'));
	
	    Opal.defn(self, '$coerce', function(other) {
	      var $a, self = this;
	
	      if ((($a = other['$instance_of?'](self.$class())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return [other, self]};
	      return [self.$Float(other), self.$Float(self)];
	    });
	
	    Opal.defn(self, '$__coerced__', function(method, other) {
	      var $a, $b, self = this, a = nil, b = nil, $case = nil;
	
	      try {
	      $b = other.$coerce(self), $a = Opal.to_ary($b), a = ($a[0] == null ? nil : $a[0]), b = ($a[1] == null ? nil : $a[1]), $b
	      } catch ($err) {if (true) {
	        try {
	          $case = method;if ("+"['$===']($case) || "-"['$===']($case) || "*"['$===']($case) || "/"['$===']($case) || "%"['$===']($case) || "&"['$===']($case) || "|"['$===']($case) || "^"['$===']($case) || "**"['$===']($case)) {self.$raise($scope.get('TypeError'), "" + (other.$class()) + " can't be coerce into Numeric")}else if (">"['$===']($case) || ">="['$===']($case) || "<"['$===']($case) || "<="['$===']($case) || "<=>"['$===']($case)) {self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (other.$class()) + " failed")}
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	      return a.$__send__(method, b);
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var $a, self = this;
	
	      if ((($a = self['$equal?'](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return 0};
	      return nil;
	    });
	
	    Opal.defn(self, '$[]', function(bit) {
	      var self = this, min = nil, max = nil;
	
	      bit = $scope.get('Opal')['$coerce_to!'](bit, $scope.get('Integer'), "to_int");
	      min = ((2)['$**'](30))['$-@']();
	      max = $rb_minus(((2)['$**'](30)), 1);
	      return (bit < min || bit > max) ? 0 : (self >> bit) % 2;
	    });
	
	    Opal.defn(self, '$+@', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$-@', function() {
	      var self = this;
	
	      return $rb_minus(0, self);
	    });
	
	    Opal.defn(self, '$%', function(other) {
	      var self = this;
	
	      return $rb_minus(self, $rb_times(other, self.$div(other)));
	    });
	
	    Opal.defn(self, '$abs', function() {
	      var self = this;
	
	      if ($rb_lt(self, 0)) {
	        return self['$-@']()
	        } else {
	        return self
	      };
	    });
	
	    Opal.defn(self, '$abs2', function() {
	      var self = this;
	
	      return $rb_times(self, self);
	    });
	
	    Opal.defn(self, '$angle', function() {
	      var self = this;
	
	      if ($rb_lt(self, 0)) {
	        return (($scope.get('Math')).$$scope.get('PI'))
	        } else {
	        return 0
	      };
	    });
	
	    Opal.alias(self, 'arg', 'angle');
	
	    Opal.defn(self, '$ceil', function() {
	      var self = this;
	
	      return self.$to_f().$ceil();
	    });
	
	    Opal.defn(self, '$conj', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.alias(self, 'conjugate', 'conj');
	
	    Opal.defn(self, '$denominator', function() {
	      var self = this;
	
	      return self.$to_r().$denominator();
	    });
	
	    Opal.defn(self, '$div', function(other) {
	      var self = this;
	
	      if (other['$=='](0)) {
	        self.$raise($scope.get('ZeroDivisionError'), "divided by o")};
	      return ($rb_divide(self, other)).$floor();
	    });
	
	    Opal.defn(self, '$divmod', function(other) {
	      var self = this;
	
	      return [self.$div(other), self['$%'](other)];
	    });
	
	    Opal.defn(self, '$fdiv', function(other) {
	      var self = this;
	
	      return $rb_divide(self.$to_f(), other);
	    });
	
	    Opal.defn(self, '$floor', function() {
	      var self = this;
	
	      return self.$to_f().$floor();
	    });
	
	    Opal.defn(self, '$i', function() {
	      var self = this;
	
	      return self.$Complex(0, self);
	    });
	
	    Opal.defn(self, '$imag', function() {
	      var self = this;
	
	      return 0;
	    });
	
	    Opal.alias(self, 'imaginary', 'imag');
	
	    Opal.defn(self, '$integer?', function() {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.alias(self, 'magnitude', 'abs');
	
	    Opal.alias(self, 'modulo', '%');
	
	    Opal.defn(self, '$nonzero?', function() {
	      var $a, self = this;
	
	      if ((($a = self['$zero?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return nil
	        } else {
	        return self
	      };
	    });
	
	    Opal.defn(self, '$numerator', function() {
	      var self = this;
	
	      return self.$to_r().$numerator();
	    });
	
	    Opal.alias(self, 'phase', 'arg');
	
	    Opal.defn(self, '$polar', function() {
	      var self = this;
	
	      return [self.$abs(), self.$arg()];
	    });
	
	    Opal.defn(self, '$quo', function(other) {
	      var self = this;
	
	      return $rb_divide($scope.get('Opal')['$coerce_to!'](self, $scope.get('Rational'), "to_r"), other);
	    });
	
	    Opal.defn(self, '$real', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$real?', function() {
	      var self = this;
	
	      return true;
	    });
	
	    Opal.defn(self, '$rect', function() {
	      var self = this;
	
	      return [self, 0];
	    });
	
	    Opal.alias(self, 'rectangular', 'rect');
	
	    Opal.defn(self, '$round', function(digits) {
	      var self = this;
	
	      return self.$to_f().$round(digits);
	    });
	
	    Opal.defn(self, '$to_c', function() {
	      var self = this;
	
	      return self.$Complex(self, 0);
	    });
	
	    Opal.defn(self, '$to_int', function() {
	      var self = this;
	
	      return self.$to_i();
	    });
	
	    Opal.defn(self, '$truncate', function() {
	      var self = this;
	
	      return self.$to_f().$truncate();
	    });
	
	    Opal.defn(self, '$zero?', function() {
	      var self = this;
	
	      return self['$=='](0);
	    });
	
	    Opal.defn(self, '$positive?', function() {
	      var self = this;
	
	      return $rb_gt(self, 0);
	    });
	
	    Opal.defn(self, '$negative?', function() {
	      var self = this;
	
	      return $rb_lt(self, 0);
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this;
	
	      return self.$raise($scope.get('TypeError'), "can't dup " + (self.$class()));
	    });
	
	    return (Opal.defn(self, '$clone', function() {
	      var self = this;
	
	      return self.$raise($scope.get('TypeError'), "can't clone " + (self.$class()));
	    }), nil) && 'clone';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/array"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $hash2 = Opal.hash2, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$require', '$include', '$raise', '$===', '$to_a', '$respond_to?', '$to_ary', '$coerce_to', '$initialize', '$to_proc', '$coerce_to?', '$join', '$to_str', '$class', '$clone', '$hash', '$<=>', '$==', '$object_id', '$inspect', '$enum_for', '$coerce_to!', '$>', '$*', '$enumerator_size', '$empty?', '$copy_singleton_methods', '$initialize_clone', '$initialize_dup', '$replace', '$size', '$eql?', '$length', '$begin', '$end', '$exclude_end?', '$flatten', '$__id__', '$[]', '$to_s', '$new', '$!', '$delete_if', '$each', '$reverse', '$rotate', '$rand', '$at', '$keep_if', '$shuffle!', '$dup', '$<', '$sort', '$!=', '$times', '$[]=', '$<<', '$kind_of?', '$last', '$first', '$upto']);
	  self.$require("corelib/enumerable");
	  self.$require("corelib/numeric");
	  return (function($base, $super) {
	    function $Array(){};
	    var self = $Array = $klass($base, $super, 'Array', $Array);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4, TMP_6, TMP_8, TMP_10, TMP_12, TMP_13, TMP_15, TMP_17, TMP_19, TMP_20, TMP_21, TMP_22, TMP_24, TMP_26, TMP_27, TMP_29, TMP_31, TMP_33, TMP_34, TMP_36, TMP_38, TMP_39, TMP_40, TMP_43, TMP_44, TMP_47;
	
	    def.length = nil;
	    self.$include($scope.get('Enumerable'));
	
	    def.$$is_array = true;
	
	    Opal.defs(self, '$[]', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var objects = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        objects[$splat_index] = arguments[$splat_index + 0];
	      }
	      return objects;
	    });
	
	    Opal.defn(self, '$initialize', TMP_1 = function(size, obj) {
	      var $a, self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      if (size == null) {
	        size = nil
	      }
	      if (obj == null) {
	        obj = nil
	      }
	      TMP_1.$$p = null;
	      if ((($a = arguments.length > 2) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arguments.length) + " for 0..2)")};
	      
	      if (arguments.length === 0) {
	        self.splice(0, self.length);
	        return self;
	      }
	    
	      if ((($a = arguments.length === 1) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = $scope.get('Array')['$==='](size)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return size.$to_a()
	        } else if ((($a = size['$respond_to?']("to_ary")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return size.$to_ary()}};
	      size = $scope.get('Opal').$coerce_to(size, $scope.get('Integer'), "to_int");
	      if ((($a = size < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "negative array size")};
	      
	      self.splice(0, self.length);
	      var i, value;
	
	      if (block === nil) {
	        for (i = 0; i < size; i++) {
	          self.push(obj);
	        }
	      }
	      else {
	        for (i = 0, value; i < size; i++) {
	          value = block(i);
	
	          if (value === $breaker) {
	            return $breaker.$v;
	          }
	
	          self[i] = value;
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.defs(self, '$new', TMP_2 = function() {
	      var $a, $b, self = this, $iter = TMP_2.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_2.$$p = null;
	      return ($a = ($b = []).$initialize, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	    });
	
	    Opal.defs(self, '$try_convert', function(obj) {
	      var self = this;
	
	      return $scope.get('Opal')['$coerce_to?'](obj, $scope.get('Array'), "to_ary");
	    });
	
	    Opal.defn(self, '$&', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	        } else {
	        other = $scope.get('Opal').$coerce_to(other, $scope.get('Array'), "to_ary").$to_a()
	      };
	      
	      var result = [], hash = $hash2([], {}), i, length, item;
	
	      for (i = 0, length = other.length; i < length; i++) {
	        Opal.hash_put(hash, other[i], true);
	      }
	
	      for (i = 0, length = self.length; i < length; i++) {
	        item = self[i];
	        if (Opal.hash_delete(hash, item) !== undefined) {
	          result.push(item);
	        }
	      }
	
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$|', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	        } else {
	        other = $scope.get('Opal').$coerce_to(other, $scope.get('Array'), "to_ary").$to_a()
	      };
	      
	      var hash = $hash2([], {}), i, length, item;
	
	      for (i = 0, length = self.length; i < length; i++) {
	        Opal.hash_put(hash, self[i], true);
	      }
	
	      for (i = 0, length = other.length; i < length; i++) {
	        Opal.hash_put(hash, other[i], true);
	      }
	
	      return hash.$keys();
	    ;
	    });
	
	    Opal.defn(self, '$*', function(other) {
	      var $a, self = this;
	
	      if ((($a = other['$respond_to?']("to_str")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$join(other.$to_str())};
	      if ((($a = other['$respond_to?']("to_int")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "no implicit conversion of " + (other.$class()) + " into Integer")
	      };
	      other = $scope.get('Opal').$coerce_to(other, $scope.get('Integer'), "to_int");
	      if ((($a = other < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "negative argument")};
	      
	      var result = [];
	
	      for (var i = 0; i < other; i++) {
	        result = result.concat(self);
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$+', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	        } else {
	        other = $scope.get('Opal').$coerce_to(other, $scope.get('Array'), "to_ary").$to_a()
	      };
	      return self.concat(other);
	    });
	
	    Opal.defn(self, '$-', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	        } else {
	        other = $scope.get('Opal').$coerce_to(other, $scope.get('Array'), "to_ary").$to_a()
	      };
	      if ((($a = self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return []};
	      if ((($a = other.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$clone()};
	      
	      var result = [], hash = $hash2([], {}), i, length, item;
	
	      for (i = 0, length = other.length; i < length; i++) {
	        Opal.hash_put(hash, other[i], true);
	      }
	
	      for (i = 0, length = self.length; i < length; i++) {
	        item = self[i];
	        if (Opal.hash_get(hash, item) === undefined) {
	          result.push(item);
	        }
	      }
	
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$<<', function(object) {
	      var self = this;
	
	      self.push(object);
	      return self;
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	      } else if ((($a = other['$respond_to?']("to_ary")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_ary().$to_a()
	        } else {
	        return nil
	      };
	      
	      if (self.$hash() === other.$hash()) {
	        return 0;
	      }
	
	      var count = Math.min(self.length, other.length);
	
	      for (var i = 0; i < count; i++) {
	        var tmp = (self[i])['$<=>'](other[i]);
	
	        if (tmp !== 0) {
	          return tmp;
	        }
	      }
	
	      return (self.length)['$<=>'](other.length);
	    ;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      
	      var recursed = {};
	
	      function _eqeq(array, other) {
	        var i, length, a, b;
	
	        if (array === other)
	          return true;
	
	        if (!other.$$is_array) {
	          if ($scope.get('Opal')['$respond_to?'](other, "to_ary")) {
	            return (other)['$=='](array);
	          } else {
	            return false;
	          }
	        }
	
	        if (array.constructor !== Array)
	          array = array.literal;
	        if (other.constructor !== Array)
	          other = other.literal;
	
	        if (array.length !== other.length) {
	          return false;
	        }
	
	        recursed[(array).$object_id()] = true;
	
	        for (i = 0, length = array.length; i < length; i++) {
	          a = array[i];
	          b = other[i];
	          if (a.$$is_array) {
	            if (b.$$is_array && b.length !== a.length) {
	              return false;
	            }
	            if (!recursed.hasOwnProperty((a).$object_id())) {
	              if (!_eqeq(a, b)) {
	                return false;
	              }
	            }
	          } else {
	            if (!(a)['$=='](b)) {
	              return false;
	            }
	          }
	        }
	
	        return true;
	      }
	
	      return _eqeq(self, other);
	    ;
	    });
	
	    Opal.defn(self, '$[]', function(index, length) {
	      var self = this;
	
	      
	      var size = self.length,
	          exclude, from, to;
	
	      if (index.$$is_range) {
	        exclude = index.exclude;
	        from    = $scope.get('Opal').$coerce_to(index.begin, $scope.get('Integer'), "to_int");
	        to      = $scope.get('Opal').$coerce_to(index.end, $scope.get('Integer'), "to_int");
	
	        if (from < 0) {
	          from += size;
	
	          if (from < 0) {
	            return nil;
	          }
	        }
	
	        if (from > size) {
	          return nil;
	        }
	
	        if (to < 0) {
	          to += size;
	
	          if (to < 0) {
	            return [];
	          }
	        }
	
	        if (!exclude) {
	          to += 1;
	        }
	
	        return self.slice(from, to);
	      }
	      else {
	        index = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	
	        if (index < 0) {
	          index += size;
	
	          if (index < 0) {
	            return nil;
	          }
	        }
	
	        if (length === undefined) {
	          if (index >= size || index < 0) {
	            return nil;
	          }
	
	          return self[index];
	        }
	        else {
	          length = $scope.get('Opal').$coerce_to(length, $scope.get('Integer'), "to_int");
	
	          if (length < 0 || index > size || index < 0) {
	            return nil;
	          }
	
	          return self.slice(index, index + length);
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$[]=', function(index, value, extra) {
	      var $a, self = this, data = nil, length = nil;
	
	      
	      var i, size = self.length;
	    
	      if ((($a = $scope.get('Range')['$==='](index)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = $scope.get('Array')['$==='](value)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          data = value.$to_a()
	        } else if ((($a = value['$respond_to?']("to_ary")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          data = value.$to_ary().$to_a()
	          } else {
	          data = [value]
	        };
	        
	        var exclude = index.exclude,
	            from    = $scope.get('Opal').$coerce_to(index.begin, $scope.get('Integer'), "to_int"),
	            to      = $scope.get('Opal').$coerce_to(index.end, $scope.get('Integer'), "to_int");
	
	        if (from < 0) {
	          from += size;
	
	          if (from < 0) {
	            self.$raise($scope.get('RangeError'), "" + (index.$inspect()) + " out of range");
	          }
	        }
	
	        if (to < 0) {
	          to += size;
	        }
	
	        if (!exclude) {
	          to += 1;
	        }
	
	        if (from > size) {
	          for (i = size; i < from; i++) {
	            self[i] = nil;
	          }
	        }
	
	        if (to < 0) {
	          self.splice.apply(self, [from, 0].concat(data));
	        }
	        else {
	          self.splice.apply(self, [from, to - from].concat(data));
	        }
	
	        return value;
	      ;
	        } else {
	        if ((($a = extra === undefined) !== nil && (!$a.$$is_boolean || $a == true))) {
	          length = 1
	          } else {
	          length = value;
	          value = extra;
	          if ((($a = $scope.get('Array')['$==='](value)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            data = value.$to_a()
	          } else if ((($a = value['$respond_to?']("to_ary")) !== nil && (!$a.$$is_boolean || $a == true))) {
	            data = value.$to_ary().$to_a()
	            } else {
	            data = [value]
	          };
	        };
	        
	        var old;
	
	        index  = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	        length = $scope.get('Opal').$coerce_to(length, $scope.get('Integer'), "to_int");
	
	        if (index < 0) {
	          old    = index;
	          index += size;
	
	          if (index < 0) {
	            self.$raise($scope.get('IndexError'), "index " + (old) + " too small for array; minimum " + (-self.length));
	          }
	        }
	
	        if (length < 0) {
	          self.$raise($scope.get('IndexError'), "negative length (" + (length) + ")")
	        }
	
	        if (index > size) {
	          for (i = size; i < index; i++) {
	            self[i] = nil;
	          }
	        }
	
	        if (extra === undefined) {
	          self[index] = value;
	        }
	        else {
	          self.splice.apply(self, [index, length].concat(data));
	        }
	
	        return value;
	      
	      };
	    });
	
	    Opal.defn(self, '$assoc', function(object) {
	      var self = this;
	
	      
	      for (var i = 0, length = self.length, item; i < length; i++) {
	        if (item = self[i], item.length && (item[0])['$=='](object)) {
	          return item;
	        }
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$at', function(index) {
	      var self = this;
	
	      index = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	      
	      if (index < 0) {
	        index += self.length;
	      }
	
	      if (index < 0 || index >= self.length) {
	        return nil;
	      }
	
	      return self[index];
	    
	    });
	
	    Opal.defn(self, '$bsearch', TMP_3 = function() {
	      var self = this, $iter = TMP_3.$$p, block = $iter || nil;
	
	      TMP_3.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("bsearch")
	      };
	      
	      var min = 0,
	          max = self.length,
	          mid,
	          val,
	          ret,
	          smaller = false,
	          satisfied = nil;
	
	      while (min < max) {
	        mid = min + Math.floor((max - min) / 2);
	        val = self[mid];
	        ret = block(val);
	
	        if (ret === $breaker) {
	          return $breaker.$v;
	        }
	        else if (ret === true) {
	          satisfied = val;
	          smaller = true;
	        }
	        else if (ret === false || ret === nil) {
	          smaller = false;
	        }
	        else if (ret.$$is_number) {
	          if (ret === 0) { return val; }
	          smaller = (ret < 0);
	        }
	        else {
	          self.$raise($scope.get('TypeError'), "wrong argument type " + ((ret).$class()) + " (must be numeric, true, false or nil)")
	        }
	
	        if (smaller) { max = mid; } else { min = mid + 1; }
	      }
	
	      return satisfied;
	    
	    });
	
	    Opal.defn(self, '$cycle', TMP_4 = function(n) {
	      var $a, $b, TMP_5, $c, self = this, $iter = TMP_4.$$p, block = $iter || nil;
	
	      if (n == null) {
	        n = nil
	      }
	      TMP_4.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_5 = function(){var self = TMP_5.$$s || this, $a;
	
	        if (n['$=='](nil)) {
	            return (($scope.get('Float')).$$scope.get('INFINITY'))
	            } else {
	            n = $scope.get('Opal')['$coerce_to!'](n, $scope.get('Integer'), "to_int");
	            if ((($a = $rb_gt(n, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	              return $rb_times(self.$enumerator_size(), n)
	              } else {
	              return 0
	            };
	          }}, TMP_5.$$s = self, TMP_5), $a).call($b, "cycle", n)
	      };
	      if ((($a = ((($c = self['$empty?']()) !== false && $c !== nil) ? $c : n['$=='](0))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return nil};
	      
	      var i, length, value;
	
	      if (n === nil) {
	        while (true) {
	          for (i = 0, length = self.length; i < length; i++) {
	            value = Opal.yield1(block, self[i]);
	
	            if (value === $breaker) {
	              return $breaker.$v;
	            }
	          }
	        }
	      }
	      else {
	        n = $scope.get('Opal')['$coerce_to!'](n, $scope.get('Integer'), "to_int");
	        if (n <= 0) {
	          return self;
	        }
	
	        while (n > 0) {
	          for (i = 0, length = self.length; i < length; i++) {
	            value = Opal.yield1(block, self[i]);
	
	            if (value === $breaker) {
	              return $breaker.$v;
	            }
	          }
	
	          n--;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$clear', function() {
	      var self = this;
	
	      self.splice(0, self.length);
	      return self;
	    });
	
	    Opal.defn(self, '$clone', function() {
	      var self = this, copy = nil;
	
	      copy = [];
	      copy.$copy_singleton_methods(self);
	      copy.$initialize_clone(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this, copy = nil;
	
	      copy = [];
	      copy.$initialize_dup(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$initialize_copy', function(other) {
	      var self = this;
	
	      return self.$replace(other);
	    });
	
	    Opal.defn(self, '$collect', TMP_6 = function() {
	      var $a, $b, TMP_7, self = this, $iter = TMP_6.$$p, block = $iter || nil;
	
	      TMP_6.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_7 = function(){var self = TMP_7.$$s || this;
	
	        return self.$size()}, TMP_7.$$s = self, TMP_7), $a).call($b, "collect")
	      };
	      
	      var result = [];
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        var value = Opal.yield1(block, self[i]);
	
	        if (value === $breaker) {
	          return $breaker.$v;
	        }
	
	        result.push(value);
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$collect!', TMP_8 = function() {
	      var $a, $b, TMP_9, self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	      TMP_8.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_9 = function(){var self = TMP_9.$$s || this;
	
	        return self.$size()}, TMP_9.$$s = self, TMP_9), $a).call($b, "collect!")
	      };
	      
	      for (var i = 0, length = self.length; i < length; i++) {
	        var value = Opal.yield1(block, self[i]);
	
	        if (value === $breaker) {
	          return $breaker.$v;
	        }
	
	        self[i] = value;
	      }
	    
	      return self;
	    });
	
	    
	    function binomial_coefficient(n, k) {
	      if (n === k || k === 0) {
	        return 1;
	      }
	
	      if (k > 0 && n > k) {
	        return binomial_coefficient(n - 1, k - 1) + binomial_coefficient(n - 1, k);
	      }
	
	      return 0;
	    }
	  
	
	    Opal.defn(self, '$combination', TMP_10 = function(n) {
	      var $a, $b, TMP_11, self = this, $iter = TMP_10.$$p, $yield = $iter || nil, num = nil;
	
	      TMP_10.$$p = null;
	      num = $scope.get('Opal')['$coerce_to!'](n, $scope.get('Integer'), "to_int");
	      if (($yield !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_11 = function(){var self = TMP_11.$$s || this;
	
	        return binomial_coefficient(self.length, num);}, TMP_11.$$s = self, TMP_11), $a).call($b, "combination", num)
	      };
	      
	      var i, length, stack, chosen, lev, done, next;
	
	      if (num === 0) {
	        ((($a = Opal.yield1($yield, [])) === $breaker) ? $breaker.$v : $a)
	      } else if (num === 1) {
	        for (i = 0, length = self.length; i < length; i++) {
	          ((($a = Opal.yield1($yield, [self[i]])) === $breaker) ? $breaker.$v : $a)
	        }
	      }
	      else if (num === self.length) {
	        ((($a = Opal.yield1($yield, self.slice())) === $breaker) ? $breaker.$v : $a)
	      }
	      else if (num >= 0 && num < self.length) {
	        stack = [];
	        for (i = 0; i <= num + 1; i++) {
	          stack.push(0);
	        }
	
	        chosen = [];
	        lev = 0;
	        done = false;
	        stack[0] = -1;
	
	        while (!done) {
	          chosen[lev] = self[stack[lev+1]];
	          while (lev < num - 1) {
	            lev++;
	            next = stack[lev+1] = stack[lev] + 1;
	            chosen[lev] = self[next];
	          }
	          ((($a = Opal.yield1($yield, chosen.slice())) === $breaker) ? $breaker.$v : $a)
	          lev++;
	          do {
	            done = (lev === 0);
	            stack[lev]++;
	            lev--;
	          } while ( stack[lev+1] + num === self.length + lev + 1 );
	        }
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$compact', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, length = self.length, item; i < length; i++) {
	        if ((item = self[i]) !== nil) {
	          result.push(item);
	        }
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$compact!', function() {
	      var self = this;
	
	      
	      var original = self.length;
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        if (self[i] === nil) {
	          self.splice(i, 1);
	
	          length--;
	          i--;
	        }
	      }
	
	      return self.length === original ? nil : self;
	    
	    });
	
	    Opal.defn(self, '$concat', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	        } else {
	        other = $scope.get('Opal').$coerce_to(other, $scope.get('Array'), "to_ary").$to_a()
	      };
	      
	      for (var i = 0, length = other.length; i < length; i++) {
	        self.push(other[i]);
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$delete', TMP_12 = function(object) {
	      var $a, self = this, $iter = TMP_12.$$p, $yield = $iter || nil;
	
	      TMP_12.$$p = null;
	      
	      var original = self.length;
	
	      for (var i = 0, length = original; i < length; i++) {
	        if ((self[i])['$=='](object)) {
	          self.splice(i, 1);
	
	          length--;
	          i--;
	        }
	      }
	
	      if (self.length === original) {
	        if (($yield !== nil)) {
	          return ((($a = Opal.yieldX($yield, [])) === $breaker) ? $breaker.$v : $a);
	        }
	        return nil;
	      }
	      return object;
	    ;
	    });
	
	    Opal.defn(self, '$delete_at', function(index) {
	      var self = this;
	
	      
	      index = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	
	      if (index < 0) {
	        index += self.length;
	      }
	
	      if (index < 0 || index >= self.length) {
	        return nil;
	      }
	
	      var result = self[index];
	
	      self.splice(index, 1);
	
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$delete_if', TMP_13 = function() {
	      var $a, $b, TMP_14, self = this, $iter = TMP_13.$$p, block = $iter || nil;
	
	      TMP_13.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_14 = function(){var self = TMP_14.$$s || this;
	
	        return self.$size()}, TMP_14.$$s = self, TMP_14), $a).call($b, "delete_if")
	      };
	      
	      for (var i = 0, length = self.length, value; i < length; i++) {
	        if ((value = block(self[i])) === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (value !== false && value !== nil) {
	          self.splice(i, 1);
	
	          length--;
	          i--;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$drop', function(number) {
	      var self = this;
	
	      
	      if (number < 0) {
	        self.$raise($scope.get('ArgumentError'))
	      }
	
	      return self.slice(number);
	    ;
	    });
	
	    Opal.defn(self, '$each', TMP_15 = function() {
	      var $a, $b, TMP_16, self = this, $iter = TMP_15.$$p, block = $iter || nil;
	
	      TMP_15.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_16 = function(){var self = TMP_16.$$s || this;
	
	        return self.$size()}, TMP_16.$$s = self, TMP_16), $a).call($b, "each")
	      };
	      
	      for (var i = 0, length = self.length; i < length; i++) {
	        var value = Opal.yield1(block, self[i]);
	
	        if (value == $breaker) {
	          return $breaker.$v;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$each_index', TMP_17 = function() {
	      var $a, $b, TMP_18, self = this, $iter = TMP_17.$$p, block = $iter || nil;
	
	      TMP_17.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_18 = function(){var self = TMP_18.$$s || this;
	
	        return self.$size()}, TMP_18.$$s = self, TMP_18), $a).call($b, "each_index")
	      };
	      
	      for (var i = 0, length = self.length; i < length; i++) {
	        var value = Opal.yield1(block, i);
	
	        if (value === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$empty?', function() {
	      var self = this;
	
	      return self.length === 0;
	    });
	
	    Opal.defn(self, '$eql?', function(other) {
	      var self = this;
	
	      
	      var recursed = {};
	
	      function _eql(array, other) {
	        var i, length, a, b;
	
	        if (!other.$$is_array) {
	          return false;
	        }
	
	        other = other.$to_a();
	
	        if (array.length !== other.length) {
	          return false;
	        }
	
	        recursed[(array).$object_id()] = true;
	
	        for (i = 0, length = array.length; i < length; i++) {
	          a = array[i];
	          b = other[i];
	          if (a.$$is_array) {
	            if (b.$$is_array && b.length !== a.length) {
	              return false;
	            }
	            if (!recursed.hasOwnProperty((a).$object_id())) {
	              if (!_eql(a, b)) {
	                return false;
	              }
	            }
	          } else {
	            if (!(a)['$eql?'](b)) {
	              return false;
	            }
	          }
	        }
	
	        return true;
	      }
	
	      return _eql(self, other);
	    
	    });
	
	    Opal.defn(self, '$fetch', TMP_19 = function(index, defaults) {
	      var self = this, $iter = TMP_19.$$p, block = $iter || nil;
	
	      TMP_19.$$p = null;
	      
	      var original = index;
	
	      index = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	
	      if (index < 0) {
	        index += self.length;
	      }
	
	      if (index >= 0 && index < self.length) {
	        return self[index];
	      }
	
	      if (block !== nil) {
	        return block(original);
	      }
	
	      if (defaults != null) {
	        return defaults;
	      }
	
	      if (self.length === 0) {
	        self.$raise($scope.get('IndexError'), "index " + (original) + " outside of array bounds: 0...0")
	      }
	      else {
	        self.$raise($scope.get('IndexError'), "index " + (original) + " outside of array bounds: -" + (self.length) + "..." + (self.length));
	      }
	    ;
	    });
	
	    Opal.defn(self, '$fill', TMP_20 = function() {
	      var $a, $b, self = this, $iter = TMP_20.$$p, block = $iter || nil, one = nil, two = nil, obj = nil, left = nil, right = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_20.$$p = null;
	      
	      var i, length, value;
	    
	      if (block !== false && block !== nil) {
	        if ((($a = args.length > 2) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (args.$length()) + " for 0..2)")};
	        $b = args, $a = Opal.to_ary($b), one = ($a[0] == null ? nil : $a[0]), two = ($a[1] == null ? nil : $a[1]), $b;
	        } else {
	        if ((($a = args.length == 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "wrong number of arguments (0 for 1..3)")
	        } else if ((($a = args.length > 3) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (args.$length()) + " for 1..3)")};
	        $b = args, $a = Opal.to_ary($b), obj = ($a[0] == null ? nil : $a[0]), one = ($a[1] == null ? nil : $a[1]), two = ($a[2] == null ? nil : $a[2]), $b;
	      };
	      if ((($a = $scope.get('Range')['$==='](one)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if (two !== false && two !== nil) {
	          self.$raise($scope.get('TypeError'), "length invalid with range")};
	        left = $scope.get('Opal').$coerce_to(one.$begin(), $scope.get('Integer'), "to_int");
	        if ((($a = left < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          left += self.length;};
	        if ((($a = left < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('RangeError'), "" + (one.$inspect()) + " out of range")};
	        right = $scope.get('Opal').$coerce_to(one.$end(), $scope.get('Integer'), "to_int");
	        if ((($a = right < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          right += self.length;};
	        if ((($a = one['$exclude_end?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          right += 1;
	        };
	        if ((($a = right <= left) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self};
	      } else if (one !== false && one !== nil) {
	        left = $scope.get('Opal').$coerce_to(one, $scope.get('Integer'), "to_int");
	        if ((($a = left < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          left += self.length;};
	        if ((($a = left < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          left = 0};
	        if (two !== false && two !== nil) {
	          right = $scope.get('Opal').$coerce_to(two, $scope.get('Integer'), "to_int");
	          if ((($a = right == 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return self};
	          right += left;
	          } else {
	          right = self.length
	        };
	        } else {
	        left = 0;
	        right = self.length;
	      };
	      if ((($a = left > self.length) !== nil && (!$a.$$is_boolean || $a == true))) {
	        
	        for (i = self.length; i < right; i++) {
	          self[i] = nil;
	        }
	      ;};
	      if ((($a = right > self.length) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.length = right};
	      if (block !== false && block !== nil) {
	        
	        for (length = self.length; left < right; left++) {
	          value = block(left);
	
	          if (value === $breaker) {
	            return $breaker.$v;
	          }
	
	          self[left] = value;
	        }
	      ;
	        } else {
	        
	        for (length = self.length; left < right; left++) {
	          self[left] = obj;
	        }
	      ;
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$first', function(count) {
	      var self = this;
	
	      
	      if (count == null) {
	        return self.length === 0 ? nil : self[0];
	      }
	
	      count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	
	      if (count < 0) {
	        self.$raise($scope.get('ArgumentError'), "negative array size");
	      }
	
	      return self.slice(0, count);
	    
	    });
	
	    Opal.defn(self, '$flatten', function(level) {
	      var self = this;
	
	      
	      function _flatten(array, level) {
	        var result = [],
	            i, length,
	            item, ary;
	
	        array = (array).$to_a();
	
	        for (i = 0, length = array.length; i < length; i++) {
	          item = array[i];
	
	          if (!$scope.get('Opal')['$respond_to?'](item, "to_ary")) {
	            result.push(item);
	            continue;
	          }
	
	          ary = (item).$to_ary();
	
	          if (ary === nil) {
	            result.push(item);
	            continue;
	          }
	
	          if (!ary.$$is_array) {
	            self.$raise($scope.get('TypeError'));
	          }
	
	          if (ary === self) {
	            self.$raise($scope.get('ArgumentError'));
	          }
	
	          switch (level) {
	          case undefined:
	            result.push.apply(result, _flatten(ary));
	            break;
	          case 0:
	            result.push(ary);
	            break;
	          default:
	            result.push.apply(result, _flatten(ary, level - 1));
	          }
	        }
	        return result;
	      }
	
	      if (level !== undefined) {
	        level = $scope.get('Opal').$coerce_to(level, $scope.get('Integer'), "to_int");
	      }
	
	      return _flatten(self, level);
	    
	    });
	
	    Opal.defn(self, '$flatten!', function(level) {
	      var self = this;
	
	      
	      var flattened = self.$flatten(level);
	
	      if (self.length == flattened.length) {
	        for (var i = 0, length = self.length; i < length; i++) {
	          if (self[i] !== flattened[i]) {
	            break;
	          }
	        }
	
	        if (i == length) {
	          return nil;
	        }
	      }
	
	      self.$replace(flattened);
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      
	      var top = (Opal.hash_ids == undefined),
	          result = ['A'],
	          hash_id = self.$object_id(),
	          item, i, key;
	
	      try {
	        if (top) {
	          Opal.hash_ids = {};
	        }
	
	        if (Opal.hash_ids.hasOwnProperty(hash_id)) {
	          return 'self';
	        }
	
	        for (key in Opal.hash_ids) {
	          if (Opal.hash_ids.hasOwnProperty(key)) {
	            item = Opal.hash_ids[key];
	            if (self['$eql?'](item)) {
	              return 'self';
	            }
	          }
	        }
	
	        Opal.hash_ids[hash_id] = self;
	
	        for (i = 0; i < self.length; i++) {
	          item = self[i];
	          result.push(item.$hash());
	        }
	
	        return result.join(',');
	      } finally {
	        if (top) {
	          delete Opal.hash_ids;
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$include?', function(member) {
	      var self = this;
	
	      
	      for (var i = 0, length = self.length; i < length; i++) {
	        if ((self[i])['$=='](member)) {
	          return true;
	        }
	      }
	
	      return false;
	    
	    });
	
	    Opal.defn(self, '$index', TMP_21 = function(object) {
	      var self = this, $iter = TMP_21.$$p, block = $iter || nil;
	
	      TMP_21.$$p = null;
	      
	      var i, length, value;
	
	      if (object != null) {
	        for (i = 0, length = self.length; i < length; i++) {
	          if ((self[i])['$=='](object)) {
	            return i;
	          }
	        }
	      }
	      else if (block !== nil) {
	        for (i = 0, length = self.length; i < length; i++) {
	          if ((value = block(self[i])) === $breaker) {
	            return $breaker.$v;
	          }
	
	          if (value !== false && value !== nil) {
	            return i;
	          }
	        }
	      }
	      else {
	        return self.$enum_for("index");
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$insert', function(index) {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var objects = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        objects[$splat_index] = arguments[$splat_index + 1];
	      }
	      
	      index = $scope.get('Opal').$coerce_to(index, $scope.get('Integer'), "to_int");
	
	      if (objects.length > 0) {
	        if (index < 0) {
	          index += self.length + 1;
	
	          if (index < 0) {
	            self.$raise($scope.get('IndexError'), "" + (index) + " is out of bounds");
	          }
	        }
	        if (index > self.length) {
	          for (var i = self.length; i < index; i++) {
	            self.push(nil);
	          }
	        }
	
	        self.splice.apply(self, [index, 0].concat(objects));
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      
	      var result = [],
	          id     = self.$__id__();
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        var item = self['$[]'](i);
	
	        if ((item).$__id__() === id) {
	          result.push('[...]');
	        }
	        else {
	          result.push((item).$inspect());
	        }
	      }
	
	      return '[' + result.join(', ') + ']';
	    ;
	    });
	
	    Opal.defn(self, '$join', function(sep) {
	      var $a, self = this;
	      if ($gvars[","] == null) $gvars[","] = nil;
	
	      if (sep == null) {
	        sep = nil
	      }
	      if ((($a = self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ""};
	      if ((($a = sep === nil) !== nil && (!$a.$$is_boolean || $a == true))) {
	        sep = $gvars[","]};
	      
	      var result = [];
	      var i, length, item, tmp;
	
	      for (i = 0, length = self.length; i < length; i++) {
	        item = self[i];
	
	        if ($scope.get('Opal')['$respond_to?'](item, "to_str")) {
	          tmp = (item).$to_str();
	
	          if (tmp !== nil) {
	            result.push((tmp).$to_s());
	
	            continue;
	          }
	        }
	
	        if ($scope.get('Opal')['$respond_to?'](item, "to_ary")) {
	          tmp = (item).$to_ary();
	
	          if (tmp === self) {
	            self.$raise($scope.get('ArgumentError'));
	          }
	
	          if (tmp !== nil) {
	            result.push((tmp).$join(sep));
	
	            continue;
	          }
	        }
	
	        if ($scope.get('Opal')['$respond_to?'](item, "to_s")) {
	          tmp = (item).$to_s();
	
	          if (tmp !== nil) {
	            result.push(tmp);
	
	            continue;
	          }
	        }
	
	        self.$raise($scope.get('NoMethodError').$new("" + ($scope.get('Opal').$inspect(item)) + " doesn't respond to #to_str, #to_ary or #to_s", "to_str"));
	      }
	
	      if (sep === nil) {
	        return result.join('');
	      }
	      else {
	        return result.join($scope.get('Opal')['$coerce_to!'](sep, $scope.get('String'), "to_str").$to_s());
	      }
	    ;
	    });
	
	    Opal.defn(self, '$keep_if', TMP_22 = function() {
	      var $a, $b, TMP_23, self = this, $iter = TMP_22.$$p, block = $iter || nil;
	
	      TMP_22.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_23 = function(){var self = TMP_23.$$s || this;
	
	        return self.$size()}, TMP_23.$$s = self, TMP_23), $a).call($b, "keep_if")
	      };
	      
	      for (var i = 0, length = self.length, value; i < length; i++) {
	        if ((value = block(self[i])) === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (value === false || value === nil) {
	          self.splice(i, 1);
	
	          length--;
	          i--;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$last', function(count) {
	      var self = this;
	
	      
	      if (count == null) {
	        return self.length === 0 ? nil : self[self.length - 1];
	      }
	
	      count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	
	      if (count < 0) {
	        self.$raise($scope.get('ArgumentError'), "negative array size");
	      }
	
	      if (count > self.length) {
	        count = self.length;
	      }
	
	      return self.slice(self.length - count, self.length);
	    
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self.length;
	    });
	
	    Opal.alias(self, 'map', 'collect');
	
	    Opal.alias(self, 'map!', 'collect!');
	
	    Opal.defn(self, '$permutation', TMP_24 = function(num) {
	      var $a, $b, TMP_25, self = this, $iter = TMP_24.$$p, block = $iter || nil, perm = nil, used = nil;
	
	      TMP_24.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_25 = function(){var self = TMP_25.$$s || this;
	
	        return self.$size()}, TMP_25.$$s = self, TMP_25), $a).call($b, "permutation", num)
	      };
	      
	      var permute, offensive, output;
	
	      if (num === undefined) {
	        num = self.length;
	      }
	      else {
	        num = $scope.get('Opal').$coerce_to(num, $scope.get('Integer'), "to_int")
	      }
	
	      if (num < 0 || self.length < num) {
	        // no permutations, yield nothing
	      }
	      else if (num === 0) {
	        // exactly one permutation: the zero-length array
	        ((($a = Opal.yield1(block, [])) === $breaker) ? $breaker.$v : $a)
	      }
	      else if (num === 1) {
	        // this is a special, easy case
	        for (var i = 0; i < self.length; i++) {
	          ((($a = Opal.yield1(block, [self[i]])) === $breaker) ? $breaker.$v : $a)
	        }
	      }
	      else {
	        // this is the general case
	        perm = $scope.get('Array').$new(num)
	        used = $scope.get('Array').$new(self.length, false)
	
	        permute = function(num, perm, index, used, blk) {
	          self = this;
	          for(var i = 0; i < self.length; i++){
	            if(used['$[]'](i)['$!']()) {
	              perm[index] = i;
	              if(index < num - 1) {
	                used[i] = true;
	                permute.call(self, num, perm, index + 1, used, blk);
	                used[i] = false;
	              }
	              else {
	                output = [];
	                for (var j = 0; j < perm.length; j++) {
	                  output.push(self[perm[j]]);
	                }
	                Opal.yield1(blk, output);
	              }
	            }
	          }
	        }
	
	        if ((block !== nil)) {
	          // offensive (both definitions) copy.
	          offensive = self.slice();
	          permute.call(offensive, num, perm, 0, used, block);
	        }
	        else {
	          permute.call(self, num, perm, 0, used, block);
	        }
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$pop', function(count) {
	      var $a, self = this;
	
	      if ((($a = count === undefined) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return nil};
	        return self.pop();};
	      count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	      if ((($a = count < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "negative array size")};
	      if ((($a = self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return []};
	      if ((($a = count > self.length) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.splice(0, self.length);
	        } else {
	        return self.splice(self.length - count, self.length);
	      };
	    });
	
	    Opal.defn(self, '$product', TMP_26 = function() {
	      var $a, self = this, $iter = TMP_26.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_26.$$p = null;
	      
	      var result = (block !== nil) ? null : [],
	          n = args.length + 1,
	          counters = new Array(n),
	          lengths  = new Array(n),
	          arrays   = new Array(n),
	          i, m, subarray, len, resultlen = 1;
	
	      arrays[0] = self;
	      for (i = 1; i < n; i++) {
	        arrays[i] = $scope.get('Opal').$coerce_to(args[i - 1], $scope.get('Array'), "to_ary");
	      }
	
	      for (i = 0; i < n; i++) {
	        len = arrays[i].length;
	        if (len === 0) {
	          return result || self;
	        }
	        resultlen *= len;
	        if (resultlen > 2147483647) {
	          self.$raise($scope.get('RangeError'), "too big to product")
	        }
	        lengths[i] = len;
	        counters[i] = 0;
	      }
	
	      outer_loop: for (;;) {
	        subarray = [];
	        for (i = 0; i < n; i++) {
	          subarray.push(arrays[i][counters[i]]);
	        }
	        if (result) {
	          result.push(subarray);
	        } else {
	          ((($a = Opal.yield1(block, subarray)) === $breaker) ? $breaker.$v : $a)
	        }
	        m = n - 1;
	        counters[m]++;
	        while (counters[m] === lengths[m]) {
	          counters[m] = 0;
	          if (--m < 0) break outer_loop;
	          counters[m]++;
	        }
	      }
	
	      return result || self;
	    ;
	    });
	
	    Opal.defn(self, '$push', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var objects = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        objects[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = 0, length = objects.length; i < length; i++) {
	        self.push(objects[i]);
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$rassoc', function(object) {
	      var self = this;
	
	      
	      for (var i = 0, length = self.length, item; i < length; i++) {
	        item = self[i];
	
	        if (item.length && item[1] !== undefined) {
	          if ((item[1])['$=='](object)) {
	            return item;
	          }
	        }
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$reject', TMP_27 = function() {
	      var $a, $b, TMP_28, self = this, $iter = TMP_27.$$p, block = $iter || nil;
	
	      TMP_27.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_28 = function(){var self = TMP_28.$$s || this;
	
	        return self.$size()}, TMP_28.$$s = self, TMP_28), $a).call($b, "reject")
	      };
	      
	      var result = [];
	
	      for (var i = 0, length = self.length, value; i < length; i++) {
	        if ((value = block(self[i])) === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (value === false || value === nil) {
	          result.push(self[i]);
	        }
	      }
	      return result;
	    
	    });
	
	    Opal.defn(self, '$reject!', TMP_29 = function() {
	      var $a, $b, TMP_30, $c, self = this, $iter = TMP_29.$$p, block = $iter || nil, original = nil;
	
	      TMP_29.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_30 = function(){var self = TMP_30.$$s || this;
	
	        return self.$size()}, TMP_30.$$s = self, TMP_30), $a).call($b, "reject!")
	      };
	      original = self.$length();
	      ($a = ($c = self).$delete_if, $a.$$p = block.$to_proc(), $a).call($c);
	      if (self.$length()['$=='](original)) {
	        return nil
	        } else {
	        return self
	      };
	    });
	
	    Opal.defn(self, '$replace', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Array')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        other = other.$to_a()
	        } else {
	        other = $scope.get('Opal').$coerce_to(other, $scope.get('Array'), "to_ary").$to_a()
	      };
	      
	      self.splice(0, self.length);
	      self.push.apply(self, other);
	    
	      return self;
	    });
	
	    Opal.defn(self, '$reverse', function() {
	      var self = this;
	
	      return self.slice(0).reverse();
	    });
	
	    Opal.defn(self, '$reverse!', function() {
	      var self = this;
	
	      return self.reverse();
	    });
	
	    Opal.defn(self, '$reverse_each', TMP_31 = function() {
	      var $a, $b, TMP_32, $c, self = this, $iter = TMP_31.$$p, block = $iter || nil;
	
	      TMP_31.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_32 = function(){var self = TMP_32.$$s || this;
	
	        return self.$size()}, TMP_32.$$s = self, TMP_32), $a).call($b, "reverse_each")
	      };
	      ($a = ($c = self.$reverse()).$each, $a.$$p = block.$to_proc(), $a).call($c);
	      return self;
	    });
	
	    Opal.defn(self, '$rindex', TMP_33 = function(object) {
	      var self = this, $iter = TMP_33.$$p, block = $iter || nil;
	
	      TMP_33.$$p = null;
	      
	      var i, value;
	
	      if (object != null) {
	        for (i = self.length - 1; i >= 0; i--) {
	          if (i >= self.length) {
	            break;
	          }
	          if ((self[i])['$=='](object)) {
	            return i;
	          }
	        }
	      }
	      else if (block !== nil) {
	        for (i = self.length - 1; i >= 0; i--) {
	          if (i >= self.length) {
	            break;
	          }
	          if ((value = block(self[i])) === $breaker) {
	            return $breaker.$v;
	          }
	          if (value !== false && value !== nil) {
	            return i;
	          }
	        }
	      }
	      else if (object == null) {
	        return self.$enum_for("rindex");
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$rotate', function(n) {
	      var self = this;
	
	      if (n == null) {
	        n = 1
	      }
	      n = $scope.get('Opal').$coerce_to(n, $scope.get('Integer'), "to_int");
	      
	      var ary, idx, firstPart, lastPart;
	
	      if (self.length === 1) {
	        return self.slice();
	      }
	      if (self.length === 0) {
	        return [];
	      }
	
	      ary = self.slice();
	      idx = n % ary.length;
	
	      firstPart = ary.slice(idx);
	      lastPart = ary.slice(0, idx);
	      return firstPart.concat(lastPart);
	    
	    });
	
	    Opal.defn(self, '$rotate!', function(cnt) {
	      var self = this, ary = nil;
	
	      if (cnt == null) {
	        cnt = 1
	      }
	      
	      if (self.length === 0 || self.length === 1) {
	        return self;
	      }
	    
	      cnt = $scope.get('Opal').$coerce_to(cnt, $scope.get('Integer'), "to_int");
	      ary = self.$rotate(cnt);
	      return self.$replace(ary);
	    });
	
	    (function($base, $super) {
	      function $SampleRandom(){};
	      var self = $SampleRandom = $klass($base, $super, 'SampleRandom', $SampleRandom);
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      def.rng = nil;
	      Opal.defn(self, '$initialize', function(rng) {
	        var self = this;
	
	        return self.rng = rng;
	      });
	
	      return (Opal.defn(self, '$rand', function(size) {
	        var $a, self = this, random = nil;
	
	        random = $scope.get('Opal').$coerce_to(self.rng.$rand(size), $scope.get('Integer'), "to_int");
	        if ((($a = random < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('RangeError'), "random value must be >= 0")};
	        if ((($a = random < size) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          self.$raise($scope.get('RangeError'), "random value must be less than Array size")
	        };
	        return random;
	      }), nil) && 'rand';
	    })($scope.base, null);
	
	    Opal.defn(self, '$sample', function(count, options) {
	      var $a, $b, self = this, o = nil, rng = nil;
	
	      if ((($a = count === undefined) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$at($scope.get('Kernel').$rand(self.length))};
	      if ((($a = options === undefined) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = (o = $scope.get('Opal')['$coerce_to?'](count, $scope.get('Hash'), "to_hash"))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          options = o;
	          count = nil;
	          } else {
	          options = nil;
	          count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	        }
	        } else {
	        count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	        options = $scope.get('Opal').$coerce_to(options, $scope.get('Hash'), "to_hash");
	      };
	      if ((($a = (($b = count !== false && count !== nil) ? count < 0 : count)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "count must be greater than 0")};
	      if (options !== false && options !== nil) {
	        rng = options['$[]']("random")};
	      if ((($a = (($b = rng !== false && rng !== nil) ? rng['$respond_to?']("rand") : rng)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        rng = $scope.get('SampleRandom').$new(rng)
	        } else {
	        rng = $scope.get('Kernel')
	      };
	      if (count !== false && count !== nil) {
	        } else {
	        return self[rng.$rand(self.length)]
	      };
	      
	
	      var abandon, spin, result, i, j, k, targetIndex, oldValue;
	
	      if (count > self.length) {
	        count = self.length;
	      }
	
	      switch (count) {
	        case 0:
	          return [];
	          break;
	        case 1:
	          return [self[rng.$rand(self.length)]];
	          break;
	        case 2:
	          i = rng.$rand(self.length);
	          j = rng.$rand(self.length);
	          if (i === j) {
	            j = i === 0 ? i + 1 : i - 1;
	          }
	          return [self[i], self[j]];
	          break;
	        default:
	          if (self.length / count > 3) {
	            abandon = false;
	            spin = 0;
	
	            result = $scope.get('Array').$new(count);
	            i = 1;
	
	            result[0] = rng.$rand(self.length);
	            while (i < count) {
	              k = rng.$rand(self.length);
	              j = 0;
	
	              while (j < i) {
	                while (k === result[j]) {
	                  spin++;
	                  if (spin > 100) {
	                    abandon = true;
	                    break;
	                  }
	                  k = rng.$rand(self.length);
	                }
	                if (abandon) { break; }
	
	                j++;
	              }
	
	              if (abandon) { break; }
	
	              result[i] = k;
	
	              i++;
	            }
	
	            if (!abandon) {
	              i = 0;
	              while (i < count) {
	                result[i] = self[result[i]];
	                i++;
	              }
	
	              return result;
	            }
	          }
	
	          result = self.slice();
	
	          for (var c = 0; c < count; c++) {
	            targetIndex = rng.$rand(self.length);
	            oldValue = result[c];
	            result[c] = result[targetIndex];
	            result[targetIndex] = oldValue;
	          }
	
	          return count === self.length ? result : (result)['$[]'](0, count);
	      }
	    
	    });
	
	    Opal.defn(self, '$select', TMP_34 = function() {
	      var $a, $b, TMP_35, self = this, $iter = TMP_34.$$p, block = $iter || nil;
	
	      TMP_34.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_35 = function(){var self = TMP_35.$$s || this;
	
	        return self.$size()}, TMP_35.$$s = self, TMP_35), $a).call($b, "select")
	      };
	      
	      var result = [];
	
	      for (var i = 0, length = self.length, item, value; i < length; i++) {
	        item = self[i];
	
	        if ((value = Opal.yield1(block, item)) === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (value !== false && value !== nil) {
	          result.push(item);
	        }
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$select!', TMP_36 = function() {
	      var $a, $b, TMP_37, $c, self = this, $iter = TMP_36.$$p, block = $iter || nil;
	
	      TMP_36.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_37 = function(){var self = TMP_37.$$s || this;
	
	        return self.$size()}, TMP_37.$$s = self, TMP_37), $a).call($b, "select!")
	      };
	      
	      var original = self.length;
	      ($a = ($c = self).$keep_if, $a.$$p = block.$to_proc(), $a).call($c);
	      return self.length === original ? nil : self;
	    
	    });
	
	    Opal.defn(self, '$shift', function(count) {
	      var $a, self = this;
	
	      if ((($a = count === undefined) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return nil};
	        return self.shift();};
	      count = $scope.get('Opal').$coerce_to(count, $scope.get('Integer'), "to_int");
	      if ((($a = count < 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "negative array size")};
	      if ((($a = self.length === 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return []};
	      return self.splice(0, count);
	    });
	
	    Opal.alias(self, 'size', 'length');
	
	    Opal.defn(self, '$shuffle', function(rng) {
	      var self = this;
	
	      return self.$dup()['$shuffle!'](rng);
	    });
	
	    Opal.defn(self, '$shuffle!', function(rng) {
	      var self = this;
	
	      
	      var randgen, i = self.length, j, tmp;
	
	      if (rng !== undefined) {
	        rng = $scope.get('Opal')['$coerce_to?'](rng, $scope.get('Hash'), "to_hash");
	
	        if (rng !== nil) {
	          rng = rng['$[]']("random");
	
	          if (rng !== nil && rng['$respond_to?']("rand")) {
	            randgen = rng;
	          }
	        }
	      }
	
	      while (i) {
	        if (randgen) {
	          j = randgen.$rand(i).$to_int();
	
	          if (j < 0) {
	            self.$raise($scope.get('RangeError'), "random number too small " + (j))
	          }
	
	          if (j >= i) {
	            self.$raise($scope.get('RangeError'), "random number too big " + (j))
	          }
	        }
	        else {
	          j = Math.floor(Math.random() * i);
	        }
	
	        tmp = self[--i];
	        self[i] = self[j];
	        self[j] = tmp;
	      }
	
	      return self;
	    ;
	    });
	
	    Opal.alias(self, 'slice', '[]');
	
	    Opal.defn(self, '$slice!', function(index, length) {
	      var self = this;
	
	      
	      if (index < 0) {
	        index += self.length;
	      }
	
	      if (length != null) {
	        return self.splice(index, length);
	      }
	
	      if (index < 0 || index >= self.length) {
	        return nil;
	      }
	
	      return self.splice(index, 1)[0];
	    
	    });
	
	    Opal.defn(self, '$sort', TMP_38 = function() {
	      var $a, self = this, $iter = TMP_38.$$p, block = $iter || nil;
	
	      TMP_38.$$p = null;
	      if ((($a = self.length > 1) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return self
	      };
	      
	      if (block === nil) {
	        block = function(a, b) {
	          return (a)['$<=>'](b);
	        };
	      }
	
	      try {
	        return self.slice().sort(function(x, y) {
	          var ret = block(x, y);
	
	          if (ret === $breaker) {
	            throw $breaker;
	          }
	          else if (ret === nil) {
	            self.$raise($scope.get('ArgumentError'), "comparison of " + ((x).$inspect()) + " with " + ((y).$inspect()) + " failed");
	          }
	
	          return $rb_gt(ret, 0) ? 1 : ($rb_lt(ret, 0) ? -1 : 0);
	        });
	      }
	      catch (e) {
	        if (e === $breaker) {
	          return $breaker.$v;
	        }
	        else {
	          throw e;
	        }
	      }
	    ;
	    });
	
	    Opal.defn(self, '$sort!', TMP_39 = function() {
	      var $a, $b, self = this, $iter = TMP_39.$$p, block = $iter || nil;
	
	      TMP_39.$$p = null;
	      
	      var result;
	
	      if ((block !== nil)) {
	        result = ($a = ($b = (self.slice())).$sort, $a.$$p = block.$to_proc(), $a).call($b);
	      }
	      else {
	        result = (self.slice()).$sort();
	      }
	
	      self.length = 0;
	      for(var i = 0, length = result.length; i < length; i++) {
	        self.push(result[i]);
	      }
	
	      return self;
	    ;
	    });
	
	    Opal.defn(self, '$take', function(count) {
	      var self = this;
	
	      
	      if (count < 0) {
	        self.$raise($scope.get('ArgumentError'));
	      }
	
	      return self.slice(0, count);
	    ;
	    });
	
	    Opal.defn(self, '$take_while', TMP_40 = function() {
	      var self = this, $iter = TMP_40.$$p, block = $iter || nil;
	
	      TMP_40.$$p = null;
	      
	      var result = [];
	
	      for (var i = 0, length = self.length, item, value; i < length; i++) {
	        item = self[i];
	
	        if ((value = block(item)) === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (value === false || value === nil) {
	          return result;
	        }
	
	        result.push(item);
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$to_a', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.alias(self, 'to_ary', 'to_a');
	
	    Opal.defn(self, '$to_h', function() {
	      var self = this;
	
	      
	      var i, len = self.length, ary, key, val, hash = $hash2([], {});
	
	      for (i = 0; i < len; i++) {
	        ary = $scope.get('Opal')['$coerce_to?'](self[i], $scope.get('Array'), "to_ary");
	        if (!ary.$$is_array) {
	          self.$raise($scope.get('TypeError'), "wrong element type " + ((ary).$class()) + " at " + (i) + " (expected array)")
	        }
	        if (ary.length !== 2) {
	          self.$raise($scope.get('ArgumentError'), "wrong array length at " + (i) + " (expected 2, was " + ((ary).$length()) + ")")
	        }
	        key = ary[0];
	        val = ary[1];
	        Opal.hash_put(hash, key, val);
	      }
	
	      return hash;
	    ;
	    });
	
	    Opal.alias(self, 'to_s', 'inspect');
	
	    Opal.defn(self, '$transpose', function() {
	      var $a, $b, TMP_41, self = this, result = nil, max = nil;
	
	      if ((($a = self['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return []};
	      result = [];
	      max = nil;
	      ($a = ($b = self).$each, $a.$$p = (TMP_41 = function(row){var self = TMP_41.$$s || this, $a, $b, TMP_42;
	if (row == null) row = nil;
	      if ((($a = $scope.get('Array')['$==='](row)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          row = row.$to_a()
	          } else {
	          row = $scope.get('Opal').$coerce_to(row, $scope.get('Array'), "to_ary").$to_a()
	        };
	        ((($a = max) !== false && $a !== nil) ? $a : max = row.length);
	        if ((($a = (row.length)['$!='](max)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('IndexError'), "element size differs (" + (row.length) + " should be " + (max))};
	        return ($a = ($b = (row.length)).$times, $a.$$p = (TMP_42 = function(i){var self = TMP_42.$$s || this, $a, $b, $c, entry = nil;
	if (i == null) i = nil;
	        entry = (($a = i, $b = result, ((($c = $b['$[]']($a)) !== false && $c !== nil) ? $c : $b['$[]=']($a, []))));
	          return entry['$<<'](row.$at(i));}, TMP_42.$$s = self, TMP_42), $a).call($b);}, TMP_41.$$s = self, TMP_41), $a).call($b);
	      return result;
	    });
	
	    Opal.defn(self, '$uniq', TMP_43 = function() {
	      var self = this, $iter = TMP_43.$$p, block = $iter || nil;
	
	      TMP_43.$$p = null;
	      
	      var hash = $hash2([], {}), i, length, item, key;
	
	      if (block === nil) {
	        for (i = 0, length = self.length; i < length; i++) {
	          item = self[i];
	          if (Opal.hash_get(hash, item) === undefined) {
	            Opal.hash_put(hash, item, item);
	          }
	        }
	      }
	      else {
	        for (i = 0, length = self.length; i < length; i++) {
	          item = self[i];
	          key = Opal.yield1(block, item);
	          if (Opal.hash_get(hash, key) === undefined) {
	            Opal.hash_put(hash, key, item);
	          }
	        }
	      }
	
	      return hash.$values();
	    ;
	    });
	
	    Opal.defn(self, '$uniq!', TMP_44 = function() {
	      var self = this, $iter = TMP_44.$$p, block = $iter || nil;
	
	      TMP_44.$$p = null;
	      
	      var original_length = self.length, hash = $hash2([], {}), i, length, item, key;
	
	      for (i = 0, length = original_length; i < length; i++) {
	        item = self[i];
	        key = (block === nil ? item : Opal.yield1(block, item));
	
	        if (Opal.hash_get(hash, key) === undefined) {
	          Opal.hash_put(hash, key, item);
	          continue;
	        }
	
	        self.splice(i, 1);
	        length--;
	        i--;
	      }
	
	      return self.length === original_length ? nil : self;
	    ;
	    });
	
	    Opal.defn(self, '$unshift', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var objects = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        objects[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      for (var i = objects.length - 1; i >= 0; i--) {
	        self.unshift(objects[i]);
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$values_at', function() {
	      var $a, $b, TMP_45, self = this, out = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      out = [];
	      ($a = ($b = args).$each, $a.$$p = (TMP_45 = function(elem){var self = TMP_45.$$s || this, $a, $b, TMP_46, finish = nil, start = nil, i = nil;
	if (elem == null) elem = nil;
	      if ((($a = elem['$kind_of?']($scope.get('Range'))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          finish = $scope.get('Opal').$coerce_to(elem.$last(), $scope.get('Integer'), "to_int");
	          start = $scope.get('Opal').$coerce_to(elem.$first(), $scope.get('Integer'), "to_int");
	          
	          if (start < 0) {
	            start = start + self.length;
	            return nil;;
	          }
	        
	          
	          if (finish < 0) {
	            finish = finish + self.length;
	          }
	          if (elem['$exclude_end?']()) {
	            finish--;
	          }
	          if (finish < start) {
	            return nil;;
	          }
	        
	          return ($a = ($b = start).$upto, $a.$$p = (TMP_46 = function(i){var self = TMP_46.$$s || this;
	if (i == null) i = nil;
	          return out['$<<'](self.$at(i))}, TMP_46.$$s = self, TMP_46), $a).call($b, finish);
	          } else {
	          i = $scope.get('Opal').$coerce_to(elem, $scope.get('Integer'), "to_int");
	          return out['$<<'](self.$at(i));
	        }}, TMP_45.$$s = self, TMP_45), $a).call($b);
	      return out;
	    });
	
	    return (Opal.defn(self, '$zip', TMP_47 = function() {
	      var $a, self = this, $iter = TMP_47.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var others = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        others[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_47.$$p = null;
	      
	      var result = [], size = self.length, part, o, i, j, jj;
	
	      for (j = 0, jj = others.length; j < jj; j++) {
	        o = others[j];
	        if (o.$$is_array) {
	          continue;
	        }
	        if (o.$$is_enumerator) {
	          if (o.$size() === Infinity) {
	            others[j] = o.$take(size);
	          } else {
	            others[j] = o.$to_a();
	          }
	          continue;
	        }
	        others[j] = (((($a = $scope.get('Opal')['$coerce_to?'](o, $scope.get('Array'), "to_ary")) !== false && $a !== nil) ? $a : $scope.get('Opal')['$coerce_to!'](o, $scope.get('Enumerator'), "each"))).$to_a();
	      }
	
	      for (i = 0; i < size; i++) {
	        part = [self[i]];
	
	        for (j = 0, jj = others.length; j < jj; j++) {
	          o = others[j][i];
	
	          if (o == null) {
	            o = nil;
	          }
	
	          part[j + 1] = o;
	        }
	
	        result[i] = part;
	      }
	
	      if (block !== nil) {
	        for (i = 0; i < size; i++) {
	          block(result[i]);
	        }
	
	        return nil;
	      }
	
	      return result;
	    
	    }), nil) && 'zip';
	  })($scope.base, Array);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/hash"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$include', '$coerce_to?', '$[]', '$merge!', '$allocate', '$raise', '$==', '$coerce_to!', '$lambda?', '$abs', '$arity', '$call', '$enum_for', '$size', '$inspect', '$flatten', '$eql?', '$default', '$to_proc', '$dup', '$===', '$default_proc', '$default_proc=', '$default=', '$alias_method']);
	  self.$require("corelib/enumerable");
	  return (function($base, $super) {
	    function $Hash(){};
	    var self = $Hash = $klass($base, $super, 'Hash', $Hash);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_5, TMP_7, TMP_9, TMP_11, TMP_12, TMP_14, TMP_15, TMP_16, TMP_18, TMP_20, TMP_22;
	
	    def.proc = def.none = nil;
	    self.$include($scope.get('Enumerable'));
	
	    def.$$is_hash = true;
	
	    Opal.defs(self, '$[]', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var argv = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        argv[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var hash, argc = argv.length, i;
	
	      if (argc === 1) {
	        hash = $scope.get('Opal')['$coerce_to?'](argv['$[]'](0), $scope.get('Hash'), "to_hash");
	        if (hash !== nil) {
	          return self.$allocate()['$merge!'](hash);
	        }
	
	        argv = $scope.get('Opal')['$coerce_to?'](argv['$[]'](0), $scope.get('Array'), "to_ary");
	        if (argv === nil) {
	          self.$raise($scope.get('ArgumentError'), "odd number of arguments for Hash")
	        }
	
	        argc = argv.length;
	        hash = self.$allocate();
	
	        for (i = 0; i < argc; i++) {
	          if (!argv[i].$$is_array) continue;
	          switch(argv[i].length) {
	          case 1:
	            hash.$store(argv[i][0], nil);
	            break;
	          case 2:
	            hash.$store(argv[i][0], argv[i][1]);
	            break;
	          default:
	            self.$raise($scope.get('ArgumentError'), "invalid number of elements (" + (argv[i].length) + " for 1..2)")
	          }
	        }
	
	        return hash;
	      }
	
	      if (argc % 2 !== 0) {
	        self.$raise($scope.get('ArgumentError'), "odd number of arguments for Hash")
	      }
	
	      hash = self.$allocate();
	
	      for (i = 0; i < argc; i += 2) {
	        hash.$store(argv[i], argv[i + 1]);
	      }
	
	      return hash;
	    ;
	    });
	
	    Opal.defs(self, '$allocate', function() {
	      var self = this;
	
	      
	      var hash = new self.$$alloc();
	
	      Opal.hash_init(hash);
	
	      hash.none = nil;
	      hash.proc = nil;
	
	      return hash;
	    
	    });
	
	    Opal.defs(self, '$try_convert', function(obj) {
	      var self = this;
	
	      return $scope.get('Opal')['$coerce_to?'](obj, $scope.get('Hash'), "to_hash");
	    });
	
	    Opal.defn(self, '$initialize', TMP_1 = function(defaults) {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      TMP_1.$$p = null;
	      
	      if (defaults !== undefined && block !== nil) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (1 for 0)")
	      }
	      self.none = (defaults === undefined ? nil : defaults);
	      self.proc = block;
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      
	      if (self === other) {
	        return true;
	      }
	
	      if (!other.$$is_hash) {
	        return false;
	      }
	
	      if (self.$$keys.length !== other.$$keys.length) {
	        return false;
	      }
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, other_value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	          other_value = other.$$smap[key];
	        } else {
	          value = key.value;
	          other_value = Opal.hash_get(other, key.key);
	        }
	
	        if (other_value === undefined || !value['$eql?'](other_value)) {
	          return false;
	        }
	      }
	
	      return true;
	    
	    });
	
	    Opal.defn(self, '$[]', function(key) {
	      var self = this;
	
	      
	      var value = Opal.hash_get(self, key);
	
	      if (value !== undefined) {
	        return value;
	      }
	
	      return self.$default(key);
	    
	    });
	
	    Opal.defn(self, '$[]=', function(key, value) {
	      var self = this;
	
	      
	      Opal.hash_put(self, key, value);
	      return value;
	    
	    });
	
	    Opal.defn(self, '$assoc', function(object) {
	      var self = this;
	
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          if ((key)['$=='](object)) {
	            return [key, self.$$smap[key]];
	          }
	        } else {
	          if ((key.key)['$=='](object)) {
	            return [key.key, key.value];
	          }
	        }
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$clear', function() {
	      var self = this;
	
	      
	      Opal.hash_init(self);
	      return self;
	    
	    });
	
	    Opal.defn(self, '$clone', function() {
	      var self = this;
	
	      
	      var hash = new self.$$class.$$alloc();
	
	      Opal.hash_init(hash);
	      Opal.hash_clone(self, hash);
	
	      return hash;
	    
	    });
	
	    Opal.defn(self, '$default', function(key) {
	      var self = this;
	
	      
	      if (key !== undefined && self.proc !== nil) {
	        return self.proc.$call(self, key);
	      }
	      return self.none;
	    ;
	    });
	
	    Opal.defn(self, '$default=', function(object) {
	      var self = this;
	
	      
	      self.proc = nil;
	      self.none = object;
	
	      return object;
	    
	    });
	
	    Opal.defn(self, '$default_proc', function() {
	      var self = this;
	
	      return self.proc;
	    });
	
	    Opal.defn(self, '$default_proc=', function(proc) {
	      var self = this;
	
	      
	      if (proc !== nil) {
	        proc = $scope.get('Opal')['$coerce_to!'](proc, $scope.get('Proc'), "to_proc");
	
	        if (proc['$lambda?']() && proc.$arity().$abs() !== 2) {
	          self.$raise($scope.get('TypeError'), "default_proc takes two arguments");
	        }
	      }
	
	      self.none = nil;
	      self.proc = proc;
	
	      return proc;
	    ;
	    });
	
	    Opal.defn(self, '$delete', TMP_2 = function(key) {
	      var self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      
	      var value = Opal.hash_delete(self, key);
	
	      if (value !== undefined) {
	        return value;
	      }
	
	      if (block !== nil) {
	        return block.$call(key);
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$delete_if', TMP_3 = function() {
	      var $a, $b, TMP_4, self = this, $iter = TMP_3.$$p, block = $iter || nil;
	
	      TMP_3.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_4 = function(){var self = TMP_4.$$s || this;
	
	        return self.$size()}, TMP_4.$$s = self, TMP_4), $a).call($b, "delete_if")
	      };
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = block(key, value);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (obj !== false && obj !== nil) {
	          if (Opal.hash_delete(self, key) !== undefined) {
	            length--;
	            i--;
	          }
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.alias(self, 'dup', 'clone');
	
	    Opal.defn(self, '$each', TMP_5 = function() {
	      var $a, $b, TMP_6, self = this, $iter = TMP_5.$$p, block = $iter || nil;
	
	      TMP_5.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_6 = function(){var self = TMP_6.$$s || this;
	
	        return self.$size()}, TMP_6.$$s = self, TMP_6), $a).call($b, "each")
	      };
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = Opal.yield1(block, [key, value]);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.defn(self, '$each_key', TMP_7 = function() {
	      var $a, $b, TMP_8, self = this, $iter = TMP_7.$$p, block = $iter || nil;
	
	      TMP_7.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_8 = function(){var self = TMP_8.$$s || this;
	
	        return self.$size()}, TMP_8.$$s = self, TMP_8), $a).call($b, "each_key")
	      };
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key; i < length; i++) {
	        key = keys[i];
	
	        if (block(key.$$is_string ? key : key.key) === $breaker) {
	          return $breaker.$v;
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.alias(self, 'each_pair', 'each');
	
	    Opal.defn(self, '$each_value', TMP_9 = function() {
	      var $a, $b, TMP_10, self = this, $iter = TMP_9.$$p, block = $iter || nil;
	
	      TMP_9.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_10 = function(){var self = TMP_10.$$s || this;
	
	        return self.$size()}, TMP_10.$$s = self, TMP_10), $a).call($b, "each_value")
	      };
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key; i < length; i++) {
	        key = keys[i];
	
	        if (block(key.$$is_string ? self.$$smap[key] : key.value) === $breaker) {
	          return $breaker.$v;
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.defn(self, '$empty?', function() {
	      var self = this;
	
	      return self.$$keys.length === 0;
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.defn(self, '$fetch', TMP_11 = function(key, defaults) {
	      var self = this, $iter = TMP_11.$$p, block = $iter || nil;
	
	      TMP_11.$$p = null;
	      
	      var value = Opal.hash_get(self, key);
	
	      if (value !== undefined) {
	        return value;
	      }
	
	      if (block !== nil) {
	        value = block(key);
	
	        if (value === $breaker) {
	          return $breaker.$v;
	        }
	
	        return value;
	      }
	
	      if (defaults !== undefined) {
	        return defaults;
	      }
	    
	      return self.$raise($scope.get('KeyError'), "key not found: " + (key.$inspect()));
	    });
	
	    Opal.defn(self, '$flatten', function(level) {
	      var self = this;
	
	      if (level == null) {
	        level = 1
	      }
	      level = $scope.get('Opal')['$coerce_to!'](level, $scope.get('Integer'), "to_int");
	      
	      var result = [];
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        result.push(key);
	
	        if (value.$$is_array) {
	          if (level === 1) {
	            result.push(value);
	            continue;
	          }
	
	          result = result.concat((value).$flatten(level - 2));
	          continue;
	        }
	
	        result.push(value);
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$has_key?', function(key) {
	      var self = this;
	
	      return Opal.hash_get(self, key) !== undefined;
	    });
	
	    Opal.defn(self, '$has_value?', function(value) {
	      var self = this;
	
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key; i < length; i++) {
	        key = keys[i];
	
	        if (((key.$$is_string ? self.$$smap[key] : key.value))['$=='](value)) {
	          return true;
	        }
	      }
	
	      return false;
	    
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      
	      var top = (Opal.hash_ids === undefined),
	          hash_id = self.$object_id(),
	          result = ['Hash'],
	          key, item;
	
	      try {
	        if (top) {
	          Opal.hash_ids = {};
	        }
	
	        if (Opal.hash_ids.hasOwnProperty(hash_id)) {
	          return 'self';
	        }
	
	        for (key in Opal.hash_ids) {
	          if (Opal.hash_ids.hasOwnProperty(key)) {
	            item = Opal.hash_ids[key];
	            if (self['$eql?'](item)) {
	              return 'self';
	            }
	          }
	        }
	
	        Opal.hash_ids[hash_id] = self;
	
	        for (var i = 0, keys = self.$$keys, length = keys.length; i < length; i++) {
	          key = keys[i];
	
	          if (key.$$is_string) {
	            result.push([key, self.$$smap[key].$hash()]);
	          } else {
	            result.push([key.key_hash, key.value.$hash()]);
	          }
	        }
	
	        return result.sort().join();
	
	      } finally {
	        if (top) {
	          delete Opal.hash_ids;
	        }
	      }
	    
	    });
	
	    Opal.alias(self, 'include?', 'has_key?');
	
	    Opal.defn(self, '$index', function(object) {
	      var self = this;
	
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        if ((value)['$=='](object)) {
	          return key;
	        }
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$indexes', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var result = [];
	
	      for (var i = 0, length = args.length, key, value; i < length; i++) {
	        key = args[i];
	        value = Opal.hash_get(self, key);
	
	        if (value === undefined) {
	          result.push(self.$default());
	          continue;
	        }
	
	        result.push(value);
	      }
	
	      return result;
	    
	    });
	
	    Opal.alias(self, 'indices', 'indexes');
	
	    var inspect_ids;
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      
	      var top = (inspect_ids === undefined),
	          hash_id = self.$object_id(),
	          result = [];
	
	      try {
	        if (top) {
	          inspect_ids = {};
	        }
	
	        if (inspect_ids.hasOwnProperty(hash_id)) {
	          return '{...}';
	        }
	
	        inspect_ids[hash_id] = true;
	
	        for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	          key = keys[i];
	
	          if (key.$$is_string) {
	            value = self.$$smap[key];
	          } else {
	            value = key.value;
	            key = key.key;
	          }
	
	          result.push(key.$inspect() + '=>' + value.$inspect());
	        }
	
	        return '{' + result.join(', ') + '}';
	
	      } finally {
	        if (top) {
	          inspect_ids = undefined;
	        }
	      }
	    
	    });
	
	    Opal.defn(self, '$invert', function() {
	      var self = this;
	
	      
	      var hash = Opal.hash();
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        Opal.hash_put(hash, value, key);
	      }
	
	      return hash;
	    
	    });
	
	    Opal.defn(self, '$keep_if', TMP_12 = function() {
	      var $a, $b, TMP_13, self = this, $iter = TMP_12.$$p, block = $iter || nil;
	
	      TMP_12.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_13 = function(){var self = TMP_13.$$s || this;
	
	        return self.$size()}, TMP_13.$$s = self, TMP_13), $a).call($b, "keep_if")
	      };
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = block(key, value);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (obj === false || obj === nil) {
	          if (Opal.hash_delete(self, key) !== undefined) {
	            length--;
	            i--;
	          }
	        }
	      }
	
	      return self;
	    
	    });
	
	    Opal.alias(self, 'key', 'index');
	
	    Opal.alias(self, 'key?', 'has_key?');
	
	    Opal.defn(self, '$keys', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          result.push(key);
	        } else {
	          result.push(key.key);
	        }
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self.$$keys.length;
	    });
	
	    Opal.alias(self, 'member?', 'has_key?');
	
	    Opal.defn(self, '$merge', TMP_14 = function(other) {
	      var $a, $b, self = this, $iter = TMP_14.$$p, block = $iter || nil;
	
	      TMP_14.$$p = null;
	      return ($a = ($b = self.$dup())['$merge!'], $a.$$p = block.$to_proc(), $a).call($b, other);
	    });
	
	    Opal.defn(self, '$merge!', TMP_15 = function(other) {
	      var self = this, $iter = TMP_15.$$p, block = $iter || nil;
	
	      TMP_15.$$p = null;
	      
	      if (!$scope.get('Hash')['$==='](other)) {
	        other = $scope.get('Opal')['$coerce_to!'](other, $scope.get('Hash'), "to_hash");
	      }
	
	      var i, other_keys = other.$$keys, length = other_keys.length, key, value, other_value;
	
	      if (block === nil) {
	        for (i = 0; i < length; i++) {
	          key = other_keys[i];
	
	          if (key.$$is_string) {
	            other_value = other.$$smap[key];
	          } else {
	            other_value = key.value;
	            key = key.key;
	          }
	
	          Opal.hash_put(self, key, other_value);
	        }
	
	        return self;
	      }
	
	      for (i = 0; i < length; i++) {
	        key = other_keys[i];
	
	        if (key.$$is_string) {
	          other_value = other.$$smap[key];
	        } else {
	          other_value = key.value;
	          key = key.key;
	        }
	
	        value = Opal.hash_get(self, key);
	
	        if (value === undefined) {
	          Opal.hash_put(self, key, other_value);
	          continue;
	        }
	
	        Opal.hash_put(self, key, block(key, value, other_value));
	      }
	
	      return self;
	    ;
	    });
	
	    Opal.defn(self, '$rassoc', function(object) {
	      var self = this;
	
	      
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        if ((value)['$=='](object)) {
	          return [key, value];
	        }
	      }
	
	      return nil;
	    
	    });
	
	    Opal.defn(self, '$rehash', function() {
	      var self = this;
	
	      
	      Opal.hash_rehash(self);
	      return self;
	    
	    });
	
	    Opal.defn(self, '$reject', TMP_16 = function() {
	      var $a, $b, TMP_17, self = this, $iter = TMP_16.$$p, block = $iter || nil;
	
	      TMP_16.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_17 = function(){var self = TMP_17.$$s || this;
	
	        return self.$size()}, TMP_17.$$s = self, TMP_17), $a).call($b, "reject")
	      };
	      
	      var hash = Opal.hash();
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = block(key, value);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (obj === false || obj === nil) {
	          Opal.hash_put(hash, key, value);
	        }
	      }
	
	      return hash;
	    
	    });
	
	    Opal.defn(self, '$reject!', TMP_18 = function() {
	      var $a, $b, TMP_19, self = this, $iter = TMP_18.$$p, block = $iter || nil;
	
	      TMP_18.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_19 = function(){var self = TMP_19.$$s || this;
	
	        return self.$size()}, TMP_19.$$s = self, TMP_19), $a).call($b, "reject!")
	      };
	      
	      var changes_were_made = false;
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = block(key, value);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (obj !== false && obj !== nil) {
	          if (Opal.hash_delete(self, key) !== undefined) {
	            changes_were_made = true;
	            length--;
	            i--;
	          }
	        }
	      }
	
	      return changes_were_made ? self : nil;
	    
	    });
	
	    Opal.defn(self, '$replace', function(other) {
	      var $a, $b, self = this;
	
	      other = $scope.get('Opal')['$coerce_to!'](other, $scope.get('Hash'), "to_hash");
	      
	      Opal.hash_init(self);
	
	      for (var i = 0, other_keys = other.$$keys, length = other_keys.length, key, value, other_value; i < length; i++) {
	        key = other_keys[i];
	
	        if (key.$$is_string) {
	          other_value = other.$$smap[key];
	        } else {
	          other_value = key.value;
	          key = key.key;
	        }
	
	        Opal.hash_put(self, key, other_value);
	      }
	    
	      if ((($a = other.$default_proc()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        (($a = [other.$default_proc()]), $b = self, $b['$default_proc='].apply($b, $a), $a[$a.length-1])
	        } else {
	        (($a = [other.$default()]), $b = self, $b['$default='].apply($b, $a), $a[$a.length-1])
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$select', TMP_20 = function() {
	      var $a, $b, TMP_21, self = this, $iter = TMP_20.$$p, block = $iter || nil;
	
	      TMP_20.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_21 = function(){var self = TMP_21.$$s || this;
	
	        return self.$size()}, TMP_21.$$s = self, TMP_21), $a).call($b, "select")
	      };
	      
	      var hash = Opal.hash();
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = block(key, value);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (obj !== false && obj !== nil) {
	          Opal.hash_put(hash, key, value);
	        }
	      }
	
	      return hash;
	    
	    });
	
	    Opal.defn(self, '$select!', TMP_22 = function() {
	      var $a, $b, TMP_23, self = this, $iter = TMP_22.$$p, block = $iter || nil;
	
	      TMP_22.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_23 = function(){var self = TMP_23.$$s || this;
	
	        return self.$size()}, TMP_23.$$s = self, TMP_23), $a).call($b, "select!")
	      };
	      
	      var result = nil;
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value, obj; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        obj = block(key, value);
	
	        if (obj === $breaker) {
	          return $breaker.$v;
	        }
	
	        if (obj === false || obj === nil) {
	          if (Opal.hash_delete(self, key) !== undefined) {
	            length--;
	            i--;
	          }
	          result = self;
	        }
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$shift', function() {
	      var self = this;
	
	      
	      var keys = self.$$keys,
	          key;
	
	      if (keys.length > 0) {
	        key = keys[0];
	
	        key = key.$$is_string ? key : key.key;
	
	        return [key, Opal.hash_delete(self, key)];
	      }
	
	      return self.$default(nil);
	    
	    });
	
	    Opal.alias(self, 'size', 'length');
	
	    self.$alias_method("store", "[]=");
	
	    Opal.defn(self, '$to_a', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        result.push([key, value]);
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$to_h', function() {
	      var self = this;
	
	      
	      if (self.$$class === Opal.Hash) {
	        return self;
	      }
	
	      var hash = new Opal.Hash.$$alloc();
	
	      Opal.hash_init(hash);
	      Opal.hash_clone(self, hash);
	
	      return hash;
	    
	    });
	
	    Opal.defn(self, '$to_hash', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.alias(self, 'to_s', 'inspect');
	
	    Opal.alias(self, 'update', 'merge!');
	
	    Opal.alias(self, 'value?', 'has_value?');
	
	    Opal.alias(self, 'values_at', 'indexes');
	
	    return (Opal.defn(self, '$values', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          result.push(self.$$smap[key]);
	        } else {
	          result.push(key.value);
	        }
	      }
	
	      return result;
	    
	    }), nil) && 'values';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/number"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_le(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
	  }
	  function $rb_ge(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$bridge', '$raise', '$class', '$Float', '$respond_to?', '$coerce_to!', '$__coerced__', '$===', '$!', '$>', '$**', '$new', '$<', '$to_f', '$==', '$nan?', '$infinite?', '$enum_for', '$+', '$-', '$gcd', '$lcm', '$/', '$frexp', '$to_i', '$ldexp', '$rationalize', '$*', '$<<', '$to_r', '$-@', '$size', '$<=', '$>=']);
	  self.$require("corelib/numeric");
	  (function($base, $super) {
	    function $Number(){};
	    var self = $Number = $klass($base, $super, 'Number', $Number);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_4, TMP_5, TMP_6, TMP_7, TMP_8, TMP_9, TMP_10, TMP_11;
	
	    $scope.get('Opal').$bridge(self, Number);
	
	    Number.prototype.$$is_number = true;
	
	    Opal.defn(self, '$coerce', function(other) {
	      var self = this;
	
	      
	      if (other === nil) {
	        self.$raise($scope.get('TypeError'), "can't convert " + (other.$class()) + " into Float");
	      }
	      else if (other.$$is_string) {
	        return [self.$Float(other), self];
	      }
	      else if (other['$respond_to?']("to_f")) {
	        return [$scope.get('Opal')['$coerce_to!'](other, $scope.get('Float'), "to_f"), self];
	      }
	      else if (other.$$is_number) {
	        return [other, self];
	      }
	      else {
	        self.$raise($scope.get('TypeError'), "can't convert " + (other.$class()) + " into Float");
	      }
	    ;
	    });
	
	    Opal.defn(self, '$__id__', function() {
	      var self = this;
	
	      return (self * 2) + 1;
	    });
	
	    Opal.alias(self, 'object_id', '__id__');
	
	    Opal.defn(self, '$+', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self + other;
	      }
	      else {
	        return self.$__coerced__("+", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$-', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self - other;
	      }
	      else {
	        return self.$__coerced__("-", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$*', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self * other;
	      }
	      else {
	        return self.$__coerced__("*", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$/', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self / other;
	      }
	      else {
	        return self.$__coerced__("/", other);
	      }
	    
	    });
	
	    Opal.alias(self, 'fdiv', '/');
	
	    Opal.defn(self, '$%', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        if (other == -Infinity) {
	          return other;
	        }
	        else if (other == 0) {
	          self.$raise($scope.get('ZeroDivisionError'), "divided by 0");
	        }
	        else if (other < 0 || self < 0) {
	          return (self % other + other) % other;
	        }
	        else {
	          return self % other;
	        }
	      }
	      else {
	        return self.$__coerced__("%", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$&', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self & other;
	      }
	      else {
	        return self.$__coerced__("&", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$|', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self | other;
	      }
	      else {
	        return self.$__coerced__("|", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$^', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self ^ other;
	      }
	      else {
	        return self.$__coerced__("^", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$<', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self < other;
	      }
	      else {
	        return self.$__coerced__("<", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$<=', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self <= other;
	      }
	      else {
	        return self.$__coerced__("<=", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$>', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self > other;
	      }
	      else {
	        return self.$__coerced__(">", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$>=', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self >= other;
	      }
	      else {
	        return self.$__coerced__(">=", other);
	      }
	    
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var self = this;
	
	      try {
	      
	      if (other.$$is_number) {
	        if (isNaN(self) || isNaN(other)) {
	          return nil;
	        }
	
	        return self > other ? 1 : (self < other ? -1 : 0);
	      }
	      else {
	        return self.$__coerced__("<=>", other);
	      }
	    
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('ArgumentError')])) {
	        try {
	          return nil
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	    });
	
	    Opal.defn(self, '$<<', function(count) {
	      var self = this;
	
	      count = $scope.get('Opal')['$coerce_to!'](count, $scope.get('Integer'), "to_int");
	      return count > 0 ? self << count : self >> -count;
	    });
	
	    Opal.defn(self, '$>>', function(count) {
	      var self = this;
	
	      count = $scope.get('Opal')['$coerce_to!'](count, $scope.get('Integer'), "to_int");
	      return count > 0 ? self >> count : self << -count;
	    });
	
	    Opal.defn(self, '$[]', function(bit) {
	      var self = this;
	
	      bit = $scope.get('Opal')['$coerce_to!'](bit, $scope.get('Integer'), "to_int");
	      
	      if (bit < (($scope.get('Integer')).$$scope.get('MIN')) || bit > (($scope.get('Integer')).$$scope.get('MAX'))) {
	        return 0;
	      }
	
	      if (self < 0) {
	        return (((~self) + 1) >> bit) % 2;
	      }
	      else {
	        return (self >> bit) % 2;
	      }
	    ;
	    });
	
	    Opal.defn(self, '$+@', function() {
	      var self = this;
	
	      return +self;
	    });
	
	    Opal.defn(self, '$-@', function() {
	      var self = this;
	
	      return -self;
	    });
	
	    Opal.defn(self, '$~', function() {
	      var self = this;
	
	      return ~self;
	    });
	
	    Opal.defn(self, '$**', function(other) {
	      var $a, $b, $c, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = ((($b = ($scope.get('Integer')['$==='](self))['$!']()) !== false && $b !== nil) ? $b : $rb_gt(other, 0))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return Math.pow(self, other);
	          } else {
	          return $scope.get('Rational').$new(self, 1)['$**'](other)
	        }
	      } else if ((($a = (($b = $rb_lt(self, 0)) ? (((($c = $scope.get('Float')['$==='](other)) !== false && $c !== nil) ? $c : $scope.get('Rational')['$==='](other))) : $rb_lt(self, 0))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('Complex').$new(self, 0)['$**'](other.$to_f())
	      } else if ((($a = other.$$is_number != null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return Math.pow(self, other);
	        } else {
	        return self.$__coerced__("**", other)
	      };
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      
	      if (other.$$is_number) {
	        return self == Number(other);
	      }
	      else if (other['$respond_to?']("==")) {
	        return other['$=='](self);
	      }
	      else {
	        return false;
	      }
	    ;
	    });
	
	    Opal.defn(self, '$abs', function() {
	      var self = this;
	
	      return Math.abs(self);
	    });
	
	    Opal.defn(self, '$abs2', function() {
	      var self = this;
	
	      return Math.abs(self * self);
	    });
	
	    Opal.defn(self, '$angle', function() {
	      var $a, self = this;
	
	      if ((($a = self['$nan?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self};
	      
	      if (self == 0) {
	        if (1 / self > 0) {
	          return 0;
	        }
	        else {
	          return Math.PI;
	        }
	      }
	      else if (self < 0) {
	        return Math.PI;
	      }
	      else {
	        return 0;
	      }
	    
	    });
	
	    Opal.alias(self, 'arg', 'angle');
	
	    Opal.alias(self, 'phase', 'angle');
	
	    Opal.defn(self, '$bit_length', function() {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('NoMethodError').$new("undefined method `bit_length` for " + (self) + ":Float", "bit_length"))
	      };
	      
	      if (self === 0 || self === -1) {
	        return 0;
	      }
	
	      var result = 0,
	          value  = self < 0 ? ~self : self;
	
	      while (value != 0) {
	        result   += 1;
	        value  >>>= 1;
	      }
	
	      return result;
	    
	    });
	
	    Opal.defn(self, '$ceil', function() {
	      var self = this;
	
	      return Math.ceil(self);
	    });
	
	    Opal.defn(self, '$chr', function(encoding) {
	      var self = this;
	
	      return String.fromCharCode(self);
	    });
	
	    Opal.defn(self, '$denominator', TMP_1 = function() {
	      var $a, $b, self = this, $iter = TMP_1.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_1.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if ((($a = ((($b = self['$nan?']()) !== false && $b !== nil) ? $b : self['$infinite?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return 1
	        } else {
	        return Opal.find_super_dispatcher(self, 'denominator', TMP_1, $iter).apply(self, $zuper)
	      };
	    });
	
	    Opal.defn(self, '$downto', TMP_2 = function(stop) {
	      var $a, $b, TMP_3, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_3 = function(){var self = TMP_3.$$s || this, $a;
	
	        if ((($a = $scope.get('Numeric')['$==='](stop)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            } else {
	            self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (stop.$class()) + " failed")
	          };
	          if ((($a = $rb_gt(stop, self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return 0
	            } else {
	            return $rb_plus($rb_minus(self, stop), 1)
	          };}, TMP_3.$$s = self, TMP_3), $a).call($b, "downto", stop)
	      };
	      
	      if (!stop.$$is_number) {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (stop.$class()) + " failed")
	      }
	      for (var i = self; i >= stop; i--) {
	        if (block(i) === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    ;
	      return self;
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.defn(self, '$equal?', function(other) {
	      var $a, self = this;
	
	      return ((($a = self['$=='](other)) !== false && $a !== nil) ? $a : isNaN(self) && isNaN(other));
	    });
	
	    Opal.defn(self, '$even?', function() {
	      var self = this;
	
	      return self % 2 === 0;
	    });
	
	    Opal.defn(self, '$floor', function() {
	      var self = this;
	
	      return Math.floor(self);
	    });
	
	    Opal.defn(self, '$gcd', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "not an integer")
	      };
	      
	      var min = Math.abs(self),
	          max = Math.abs(other);
	
	      while (min > 0) {
	        var tmp = min;
	
	        min = max % min;
	        max = tmp;
	      }
	
	      return max;
	    
	    });
	
	    Opal.defn(self, '$gcdlcm', function(other) {
	      var self = this;
	
	      return [self.$gcd(), self.$lcm()];
	    });
	
	    Opal.defn(self, '$integer?', function() {
	      var self = this;
	
	      return self % 1 === 0;
	    });
	
	    Opal.defn(self, '$is_a?', TMP_4 = function(klass) {
	      var $a, $b, self = this, $iter = TMP_4.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_4.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if ((($a = (($b = klass['$==']($scope.get('Fixnum'))) ? $scope.get('Integer')['$==='](self) : klass['$==']($scope.get('Fixnum')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      if ((($a = (($b = klass['$==']($scope.get('Integer'))) ? $scope.get('Integer')['$==='](self) : klass['$==']($scope.get('Integer')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      if ((($a = (($b = klass['$==']($scope.get('Float'))) ? $scope.get('Float')['$==='](self) : klass['$==']($scope.get('Float')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      return Opal.find_super_dispatcher(self, 'is_a?', TMP_4, $iter).apply(self, $zuper);
	    });
	
	    Opal.alias(self, 'kind_of?', 'is_a?');
	
	    Opal.defn(self, '$instance_of?', TMP_5 = function(klass) {
	      var $a, $b, self = this, $iter = TMP_5.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_5.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if ((($a = (($b = klass['$==']($scope.get('Fixnum'))) ? $scope.get('Integer')['$==='](self) : klass['$==']($scope.get('Fixnum')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      if ((($a = (($b = klass['$==']($scope.get('Integer'))) ? $scope.get('Integer')['$==='](self) : klass['$==']($scope.get('Integer')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      if ((($a = (($b = klass['$==']($scope.get('Float'))) ? $scope.get('Float')['$==='](self) : klass['$==']($scope.get('Float')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return true};
	      return Opal.find_super_dispatcher(self, 'instance_of?', TMP_5, $iter).apply(self, $zuper);
	    });
	
	    Opal.defn(self, '$lcm', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "not an integer")
	      };
	      
	      if (self == 0 || other == 0) {
	        return 0;
	      }
	      else {
	        return Math.abs(self * other / self.$gcd(other));
	      }
	    
	    });
	
	    Opal.alias(self, 'magnitude', 'abs');
	
	    Opal.alias(self, 'modulo', '%');
	
	    Opal.defn(self, '$next', function() {
	      var self = this;
	
	      return self + 1;
	    });
	
	    Opal.defn(self, '$nonzero?', function() {
	      var self = this;
	
	      return self == 0 ? nil : self;
	    });
	
	    Opal.defn(self, '$numerator', TMP_6 = function() {
	      var $a, $b, self = this, $iter = TMP_6.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_6.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if ((($a = ((($b = self['$nan?']()) !== false && $b !== nil) ? $b : self['$infinite?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self
	        } else {
	        return Opal.find_super_dispatcher(self, 'numerator', TMP_6, $iter).apply(self, $zuper)
	      };
	    });
	
	    Opal.defn(self, '$odd?', function() {
	      var self = this;
	
	      return self % 2 !== 0;
	    });
	
	    Opal.defn(self, '$ord', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$pred', function() {
	      var self = this;
	
	      return self - 1;
	    });
	
	    Opal.defn(self, '$quo', TMP_7 = function(other) {
	      var $a, self = this, $iter = TMP_7.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_7.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if ((($a = $scope.get('Integer')['$==='](self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return Opal.find_super_dispatcher(self, 'quo', TMP_7, $iter).apply(self, $zuper)
	        } else {
	        return $rb_divide(self, other)
	      };
	    });
	
	    Opal.defn(self, '$rationalize', function(eps) {
	      var $a, $b, self = this, f = nil, n = nil;
	
	      
	      if (arguments.length > 1) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arguments.length) + " for 0..1)");
	      }
	    ;
	      if ((($a = $scope.get('Integer')['$==='](self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('Rational').$new(self, 1)
	      } else if ((($a = self['$infinite?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('FloatDomainError'), "Infinity")
	      } else if ((($a = self['$nan?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('FloatDomainError'), "NaN")
	      } else if ((($a = eps == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        $b = $scope.get('Math').$frexp(self), $a = Opal.to_ary($b), f = ($a[0] == null ? nil : $a[0]), n = ($a[1] == null ? nil : $a[1]), $b;
	        f = $scope.get('Math').$ldexp(f, (($scope.get('Float')).$$scope.get('MANT_DIG'))).$to_i();
	        n = $rb_minus(n, (($scope.get('Float')).$$scope.get('MANT_DIG')));
	        return $scope.get('Rational').$new($rb_times(2, f), (1)['$<<'](($rb_minus(1, n)))).$rationalize($scope.get('Rational').$new(1, (1)['$<<'](($rb_minus(1, n)))));
	        } else {
	        return self.$to_r().$rationalize(eps)
	      };
	    });
	
	    Opal.defn(self, '$round', function(ndigits) {
	      var $a, $b, self = this, _ = nil, exp = nil;
	
	      if ((($a = $scope.get('Integer')['$==='](self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = ndigits == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self};
	        if ((($a = ($b = $scope.get('Float')['$==='](ndigits), $b !== false && $b !== nil ?ndigits['$infinite?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('RangeError'), "Infinity")};
	        ndigits = $scope.get('Opal')['$coerce_to!'](ndigits, $scope.get('Integer'), "to_int");
	        if ((($a = $rb_lt(ndigits, (($scope.get('Integer')).$$scope.get('MIN')))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('RangeError'), "out of bounds")};
	        if ((($a = ndigits >= 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self};
	        ndigits = ndigits['$-@']();
	        
	        if (0.415241 * ndigits - 0.125 > self.$size()) {
	          return 0;
	        }
	
	        var f = Math.pow(10, ndigits),
	            x = Math.floor((Math.abs(x) + f / 2) / f) * f;
	
	        return self < 0 ? -x : x;
	      ;
	        } else {
	        if ((($a = ($b = self['$nan?'](), $b !== false && $b !== nil ?ndigits == null : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('FloatDomainError'), "NaN")};
	        ndigits = $scope.get('Opal')['$coerce_to!'](ndigits || 0, $scope.get('Integer'), "to_int");
	        if ((($a = $rb_le(ndigits, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          if ((($a = self['$nan?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	            self.$raise($scope.get('RangeError'), "NaN")
	          } else if ((($a = self['$infinite?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	            self.$raise($scope.get('FloatDomainError'), "Infinity")}
	        } else if (ndigits['$=='](0)) {
	          return Math.round(self)
	        } else if ((($a = ((($b = self['$nan?']()) !== false && $b !== nil) ? $b : self['$infinite?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self};
	        $b = $scope.get('Math').$frexp(self), $a = Opal.to_ary($b), _ = ($a[0] == null ? nil : $a[0]), exp = ($a[1] == null ? nil : $a[1]), $b;
	        if ((($a = $rb_ge(ndigits, $rb_minus(($rb_plus((($scope.get('Float')).$$scope.get('DIG')), 2)), ((function() {if ((($b = $rb_gt(exp, 0)) !== nil && (!$b.$$is_boolean || $b == true))) {
	          return $rb_divide(exp, 4)
	          } else {
	          return $rb_minus($rb_divide(exp, 3), 1)
	        }; return nil; })())))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self};
	        if ((($a = $rb_lt(ndigits, ((function() {if ((($b = $rb_gt(exp, 0)) !== nil && (!$b.$$is_boolean || $b == true))) {
	          return $rb_plus($rb_divide(exp, 3), 1)
	          } else {
	          return $rb_divide(exp, 4)
	        }; return nil; })())['$-@']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return 0};
	        return Math.round(self * Math.pow(10, ndigits)) / Math.pow(10, ndigits);
	      };
	    });
	
	    Opal.defn(self, '$step', TMP_8 = function(limit, step) {
	      var $a, self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	      if (step == null) {
	        step = 1
	      }
	      TMP_8.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return self.$enum_for("step", limit, step)
	      };
	      if ((($a = step == 0) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "step cannot be 0")};
	      
	      var value = self;
	
	      if (limit === Infinity || limit === -Infinity) {
	        block(value);
	        return self;
	      }
	
	      if (step > 0) {
	        while (value <= limit) {
	          block(value);
	          value += step;
	        }
	      }
	      else {
	        while (value >= limit) {
	          block(value);
	          value += step;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.alias(self, 'succ', 'next');
	
	    Opal.defn(self, '$times', TMP_9 = function() {
	      var self = this, $iter = TMP_9.$$p, block = $iter || nil;
	
	      TMP_9.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return self.$enum_for("times")
	      };
	      
	      for (var i = 0; i < self; i++) {
	        if (block(i) === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$to_f', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$to_i', function() {
	      var self = this;
	
	      return parseInt(self, 10);
	    });
	
	    Opal.alias(self, 'to_int', 'to_i');
	
	    Opal.defn(self, '$to_r', function() {
	      var $a, $b, self = this, f = nil, e = nil;
	
	      if ((($a = $scope.get('Integer')['$==='](self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('Rational').$new(self, 1)
	        } else {
	        $b = $scope.get('Math').$frexp(self), $a = Opal.to_ary($b), f = ($a[0] == null ? nil : $a[0]), e = ($a[1] == null ? nil : $a[1]), $b;
	        f = $scope.get('Math').$ldexp(f, (($scope.get('Float')).$$scope.get('MANT_DIG'))).$to_i();
	        e = $rb_minus(e, (($scope.get('Float')).$$scope.get('MANT_DIG')));
	        return ($rb_times(f, ((($scope.get('Float')).$$scope.get('RADIX'))['$**'](e)))).$to_r();
	      };
	    });
	
	    Opal.defn(self, '$to_s', function(base) {
	      var $a, $b, self = this;
	
	      if (base == null) {
	        base = 10
	      }
	      if ((($a = ((($b = $rb_lt(base, 2)) !== false && $b !== nil) ? $b : $rb_gt(base, 36))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "base must be between 2 and 36")};
	      return self.toString(base);
	    });
	
	    Opal.alias(self, 'truncate', 'to_i');
	
	    Opal.alias(self, 'inspect', 'to_s');
	
	    Opal.defn(self, '$divmod', TMP_10 = function(other) {
	      var $a, $b, self = this, $iter = TMP_10.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_10.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if ((($a = ((($b = self['$nan?']()) !== false && $b !== nil) ? $b : other['$nan?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('FloatDomainError'), "NaN")
	      } else if ((($a = self['$infinite?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('FloatDomainError'), "Infinity")
	        } else {
	        return Opal.find_super_dispatcher(self, 'divmod', TMP_10, $iter).apply(self, $zuper)
	      };
	    });
	
	    Opal.defn(self, '$upto', TMP_11 = function(stop) {
	      var $a, $b, TMP_12, self = this, $iter = TMP_11.$$p, block = $iter || nil;
	
	      TMP_11.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_12 = function(){var self = TMP_12.$$s || this, $a;
	
	        if ((($a = $scope.get('Numeric')['$==='](stop)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            } else {
	            self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (stop.$class()) + " failed")
	          };
	          if ((($a = $rb_lt(stop, self)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return 0
	            } else {
	            return $rb_plus($rb_minus(stop, self), 1)
	          };}, TMP_12.$$s = self, TMP_12), $a).call($b, "upto", stop)
	      };
	      
	      if (!stop.$$is_number) {
	        self.$raise($scope.get('ArgumentError'), "comparison of " + (self.$class()) + " with " + (stop.$class()) + " failed")
	      }
	      for (var i = self; i <= stop; i++) {
	        if (block(i) === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$zero?', function() {
	      var self = this;
	
	      return self == 0;
	    });
	
	    Opal.defn(self, '$size', function() {
	      var self = this;
	
	      return 4;
	    });
	
	    Opal.defn(self, '$nan?', function() {
	      var self = this;
	
	      return isNaN(self);
	    });
	
	    Opal.defn(self, '$finite?', function() {
	      var self = this;
	
	      return self != Infinity && self != -Infinity && !isNaN(self);
	    });
	
	    Opal.defn(self, '$infinite?', function() {
	      var self = this;
	
	      
	      if (self == Infinity) {
	        return +1;
	      }
	      else if (self == -Infinity) {
	        return -1;
	      }
	      else {
	        return nil;
	      }
	    
	    });
	
	    Opal.defn(self, '$positive?', function() {
	      var self = this;
	
	      return self == Infinity || 1 / self > 0;
	    });
	
	    return (Opal.defn(self, '$negative?', function() {
	      var self = this;
	
	      return self == -Infinity || 1 / self < 0;
	    }), nil) && 'negative?';
	  })($scope.base, $scope.get('Numeric'));
	  Opal.cdecl($scope, 'Fixnum', $scope.get('Number'));
	  (function($base, $super) {
	    function $Integer(){};
	    var self = $Integer = $klass($base, $super, 'Integer', $Integer);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defs(self, '$===', function(other) {
	      var self = this;
	
	      
	      if (!other.$$is_number) {
	        return false;
	      }
	
	      return (other % 1) === 0;
	    
	    });
	
	    Opal.cdecl($scope, 'MAX', Math.pow(2, 30) - 1);
	
	    return Opal.cdecl($scope, 'MIN', -Math.pow(2, 30));
	  })($scope.base, $scope.get('Numeric'));
	  return (function($base, $super) {
	    function $Float(){};
	    var self = $Float = $klass($base, $super, 'Float', $Float);
	
	    var def = self.$$proto, $scope = self.$$scope, $a;
	
	    Opal.defs(self, '$===', function(other) {
	      var self = this;
	
	      return !!other.$$is_number;
	    });
	
	    Opal.cdecl($scope, 'INFINITY', Infinity);
	
	    Opal.cdecl($scope, 'MAX', Number.MAX_VALUE);
	
	    Opal.cdecl($scope, 'MIN', Number.MIN_VALUE);
	
	    Opal.cdecl($scope, 'NAN', NaN);
	
	    Opal.cdecl($scope, 'DIG', 15);
	
	    Opal.cdecl($scope, 'MANT_DIG', 53);
	
	    Opal.cdecl($scope, 'RADIX', 2);
	
	    if ((($a = (typeof(Number.EPSILON) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      return Opal.cdecl($scope, 'EPSILON', Number.EPSILON)
	      } else {
	      return Opal.cdecl($scope, 'EPSILON', 2.2204460492503130808472633361816E-16)
	    };
	  })($scope.base, $scope.get('Numeric'));
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/range"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_le(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$include', '$attr_reader', '$<=>', '$raise', '$include?', '$<=', '$<', '$enum_for', '$upto', '$to_proc', '$succ', '$!', '$==', '$===', '$exclude_end?', '$eql?', '$begin', '$end', '$-', '$abs', '$to_i', '$inspect']);
	  self.$require("corelib/enumerable");
	  return (function($base, $super) {
	    function $Range(){};
	    var self = $Range = $klass($base, $super, 'Range', $Range);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3;
	
	    def.begin = def.exclude = def.end = nil;
	    self.$include($scope.get('Enumerable'));
	
	    def.$$is_range = true;
	
	    self.$attr_reader("begin", "end");
	
	    Opal.defn(self, '$initialize', function(first, last, exclude) {
	      var $a, self = this;
	
	      if (exclude == null) {
	        exclude = false
	      }
	      if ((($a = first['$<=>'](last)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('ArgumentError'))
	      };
	      self.begin = first;
	      self.end = last;
	      return self.exclude = exclude;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      
	      if (!other.$$is_range) {
	        return false;
	      }
	
	      return self.exclude === other.exclude &&
	             self.begin   ==  other.begin &&
	             self.end     ==  other.end;
	    
	    });
	
	    Opal.defn(self, '$===', function(value) {
	      var self = this;
	
	      return self['$include?'](value);
	    });
	
	    Opal.defn(self, '$cover?', function(value) {
	      var $a, $b, self = this;
	
	      return ($a = $rb_le(self.begin, value), $a !== false && $a !== nil ?((function() {if ((($b = self.exclude) !== nil && (!$b.$$is_boolean || $b == true))) {
	        return $rb_lt(value, self.end)
	        } else {
	        return $rb_le(value, self.end)
	      }; return nil; })()) : $a);
	    });
	
	    Opal.defn(self, '$each', TMP_1 = function() {
	      var $a, $b, $c, self = this, $iter = TMP_1.$$p, block = $iter || nil, current = nil, last = nil;
	
	      TMP_1.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("each")
	      };
	      
	      var i, limit, value;
	
	      if (self.begin.$$is_number && self.end.$$is_number) {
	        if (self.begin % 1 !== 0 || self.end % 1 !== 0) {
	          self.$raise($scope.get('TypeError'), "can't iterate from Float")
	        }
	
	        for (i = self.begin, limit = self.end + (function() {if ((($a = self.exclude) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return 0
	        } else {
	        return 1
	      }; return nil; })(); i < limit; i++) {
	          value = block(i);
	          if (value === $breaker) { return $breaker.$v; }
	        }
	
	        return self;
	      }
	
	      if (self.begin.$$is_string && self.end.$$is_string) {
	        value = ($a = ($b = self.begin).$upto, $a.$$p = block.$to_proc(), $a).call($b, self.end, self.exclude);
	
	        // The following is a bit hackish: we know that
	        // String#upto normally returns self, but may
	        // return a different value if there's a `break`
	        // statement in the supplied block. We need to
	        // propagate this `break` value here, so we
	        // test for equality with `@begin` string to
	        // determine the return value:
	        return value === self.begin ? self : value;
	      }
	    ;
	      current = self.begin;
	      last = self.end;
	      while ((($c = $rb_lt(current, last)) !== nil && (!$c.$$is_boolean || $c == true))) {
	      if (Opal.yield1(block, current) === $breaker) return $breaker.$v;
	      current = current.$succ();};
	      if ((($a = ($c = self.exclude['$!'](), $c !== false && $c !== nil ?current['$=='](last) : $c)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if (Opal.yield1(block, current) === $breaker) return $breaker.$v};
	      return self;
	    });
	
	    Opal.defn(self, '$eql?', function(other) {
	      var $a, $b, self = this;
	
	      if ((($a = $scope.get('Range')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return false
	      };
	      return ($a = ($b = self.exclude['$==='](other['$exclude_end?']()), $b !== false && $b !== nil ?self.begin['$eql?'](other.$begin()) : $b), $a !== false && $a !== nil ?self.end['$eql?'](other.$end()) : $a);
	    });
	
	    Opal.defn(self, '$exclude_end?', function() {
	      var self = this;
	
	      return self.exclude;
	    });
	
	    Opal.alias(self, 'first', 'begin');
	
	    Opal.alias(self, 'include?', 'cover?');
	
	    Opal.alias(self, 'last', 'end');
	
	    Opal.defn(self, '$max', TMP_2 = function() {
	      var self = this, $iter = TMP_2.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_2.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if (($yield !== nil)) {
	        return Opal.find_super_dispatcher(self, 'max', TMP_2, $iter).apply(self, $zuper)
	        } else {
	        return self.exclude ? self.end - 1 : self.end;
	      };
	    });
	
	    Opal.alias(self, 'member?', 'cover?');
	
	    Opal.defn(self, '$min', TMP_3 = function() {
	      var self = this, $iter = TMP_3.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_3.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if (($yield !== nil)) {
	        return Opal.find_super_dispatcher(self, 'min', TMP_3, $iter).apply(self, $zuper)
	        } else {
	        return self.begin
	      };
	    });
	
	    Opal.alias(self, 'member?', 'include?');
	
	    Opal.defn(self, '$size', function() {
	      var $a, $b, self = this, _begin = nil, _end = nil, infinity = nil;
	
	      _begin = self.begin;
	      _end = self.end;
	      if ((($a = self.exclude) !== nil && (!$a.$$is_boolean || $a == true))) {
	        _end = $rb_minus(_end, 1)};
	      if ((($a = ($b = $scope.get('Numeric')['$==='](_begin), $b !== false && $b !== nil ?$scope.get('Numeric')['$==='](_end) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return nil
	      };
	      if ((($a = $rb_lt(_end, _begin)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return 0};
	      infinity = (($scope.get('Float')).$$scope.get('INFINITY'));
	      if ((($a = ((($b = infinity['$=='](_begin.$abs())) !== false && $b !== nil) ? $b : _end.$abs()['$=='](infinity))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return infinity};
	      return ((Math.abs(_end - _begin) + 1)).$to_i();
	    });
	
	    Opal.defn(self, '$step', function(n) {
	      var self = this;
	
	      if (n == null) {
	        n = 1
	      }
	      return self.$raise($scope.get('NotImplementedError'));
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return self.begin.$inspect() + (self.exclude ? '...' : '..') + self.end.$inspect();
	    });
	
	    return Opal.alias(self, 'inspect', 'to_s');
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/proc"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$raise', '$coerce_to!']);
	  return (function($base, $super) {
	    function $Proc(){};
	    var self = $Proc = $klass($base, $super, 'Proc', $Proc);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2;
	
	    def.$$is_proc = true;
	
	    def.$$is_lambda = false;
	
	    Opal.defs(self, '$new', TMP_1 = function() {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      TMP_1.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        self.$raise($scope.get('ArgumentError'), "tried to create a Proc object without a block")
	      };
	      return block;
	    });
	
	    Opal.defn(self, '$call', TMP_2 = function() {
	      var self = this, $iter = TMP_2.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_2.$$p = null;
	      
	      if (block !== nil) {
	        self.$$p = block;
	      }
	
	      var result;
	
	      if (self.$$is_lambda) {
	        result = self.apply(null, args);
	      }
	      else {
	        result = Opal.yieldX(self, args);
	      }
	
	      if (result === $breaker) {
	        return $breaker.$v;
	      }
	
	      return result;
	    
	    });
	
	    Opal.alias(self, '[]', 'call');
	
	    Opal.alias(self, '===', 'call');
	
	    Opal.alias(self, 'yield', 'call');
	
	    Opal.defn(self, '$to_proc', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$lambda?', function() {
	      var self = this;
	
	      return !!self.$$is_lambda;
	    });
	
	    Opal.defn(self, '$arity', function() {
	      var self = this;
	
	      if (self.$$is_curried) { return -1; }
	      if (self.$$arity) { return self.$$arity };
	      return self.length;
	    });
	
	    Opal.defn(self, '$source_location', function() {
	      var self = this;
	
	      if (self.$$is_curried) { return nil; }
	      return nil;
	    });
	
	    Opal.defn(self, '$binding', function() {
	      var self = this;
	
	      if (self.$$is_curried) { self.$raise($scope.get('ArgumentError'), "Can't create Binding") };
	      return nil;
	    });
	
	    Opal.defn(self, '$parameters', function() {
	      var self = this;
	
	      if (self.$$is_curried) { return [["rest"]]; };
	      return nil;
	    });
	
	    Opal.defn(self, '$curry', function(arity) {
	      var self = this;
	
	      
	      if (arity === undefined) {
	        arity = self.length;
	      }
	      else {
	        arity = $scope.get('Opal')['$coerce_to!'](arity, $scope.get('Integer'), "to_int");
	        if (self.$$is_lambda && arity !== self.length) {
	          self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arity) + " for " + (self.length) + ")")
	        }
	      }
	
	      function curried () {
	        var args = $slice.call(arguments),
	            length = args.length,
	            result;
	
	        if (length > arity && self.$$is_lambda && !self.$$is_curried) {
	          self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (length) + " for " + (arity) + ")")
	        }
	
	        if (length >= arity) {
	          return self.$call.apply(self, args);
	        }
	
	        result = function () {
	          return curried.apply(null,
	            args.concat($slice.call(arguments)));
	        }
	        result.$$is_lambda = self.$$is_lambda;
	        result.$$is_curried = true;
	
	        return result;
	      };
	
	      curried.$$is_lambda = self.$$is_lambda;
	      curried.$$is_curried = true;
	      return curried;
	    
	    });
	
	    Opal.defn(self, '$dup', function() {
	      var self = this;
	
	      
	      var original_proc = self.$$original_proc || self,
	          proc = function () {
	            return original_proc.apply(this, arguments);
	          };
	
	      for (var prop in self) {
	        if (self.hasOwnProperty(prop)) {
	          proc[prop] = self[prop];
	        }
	      }
	
	      return proc;
	    
	    });
	
	    return Opal.alias(self, 'clone', 'dup');
	  })($scope.base, Function)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/method"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$attr_reader', '$class', '$arity', '$new', '$name']);
	  (function($base, $super) {
	    function $Method(){};
	    var self = $Method = $klass($base, $super, 'Method', $Method);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1;
	
	    def.method = def.receiver = def.owner = def.name = nil;
	    self.$attr_reader("owner", "receiver", "name");
	
	    Opal.defn(self, '$initialize', function(receiver, method, name) {
	      var self = this;
	
	      self.receiver = receiver;
	      self.owner = receiver.$class();
	      self.name = name;
	      return self.method = method;
	    });
	
	    Opal.defn(self, '$arity', function() {
	      var self = this;
	
	      return self.method.$arity();
	    });
	
	    Opal.defn(self, '$call', TMP_1 = function() {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_1.$$p = null;
	      
	      self.method.$$p = block;
	
	      return self.method.apply(self.receiver, args);
	    ;
	    });
	
	    Opal.alias(self, '[]', 'call');
	
	    Opal.defn(self, '$unbind', function() {
	      var self = this;
	
	      return $scope.get('UnboundMethod').$new(self.owner, self.method, self.name);
	    });
	
	    Opal.defn(self, '$to_proc', function() {
	      var self = this;
	
	      
	      var proc = function () { return self.$call.apply(self, $slice.call(arguments)); };
	      proc.$$unbound = self.method;
	      proc.$$is_lambda = true;
	      return proc;
	    
	    });
	
	    return (Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return "#<Method: " + (self.receiver.$class()) + "#" + (self.name) + ">";
	    }), nil) && 'inspect';
	  })($scope.base, null);
	  return (function($base, $super) {
	    function $UnboundMethod(){};
	    var self = $UnboundMethod = $klass($base, $super, 'UnboundMethod', $UnboundMethod);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.method = def.name = def.owner = nil;
	    self.$attr_reader("owner", "name");
	
	    Opal.defn(self, '$initialize', function(owner, method, name) {
	      var self = this;
	
	      self.owner = owner;
	      self.method = method;
	      return self.name = name;
	    });
	
	    Opal.defn(self, '$arity', function() {
	      var self = this;
	
	      return self.method.$arity();
	    });
	
	    Opal.defn(self, '$bind', function(object) {
	      var self = this;
	
	      return $scope.get('Method').$new(object, self.method, self.name);
	    });
	
	    return (Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return "#<UnboundMethod: " + (self.owner.$name()) + "#" + (self.name) + ">";
	    }), nil) && 'inspect';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/variables"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $gvars = Opal.gvars, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$new']);
	  $gvars["&"] = $gvars["~"] = $gvars["`"] = $gvars["'"] = nil;
	  $gvars.LOADED_FEATURES = $gvars["\""] = Opal.loaded_features;
	  $gvars.LOAD_PATH = $gvars[":"] = [];
	  $gvars["/"] = "\n";
	  $gvars[","] = nil;
	  Opal.cdecl($scope, 'ARGV', []);
	  Opal.cdecl($scope, 'ARGF', $scope.get('Object').$new());
	  Opal.cdecl($scope, 'ENV', $hash2([], {}));
	  $gvars.VERBOSE = false;
	  $gvars.DEBUG = false;
	  return $gvars.SAFE = 0;
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/mini"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require']);
	  self.$require("opal/base");
	  self.$require("corelib/nil");
	  self.$require("corelib/boolean");
	  self.$require("corelib/string");
	  self.$require("corelib/comparable");
	  self.$require("corelib/enumerable");
	  self.$require("corelib/enumerator");
	  self.$require("corelib/array");
	  self.$require("corelib/hash");
	  self.$require("corelib/number");
	  self.$require("corelib/range");
	  self.$require("corelib/proc");
	  self.$require("corelib/method");
	  self.$require("corelib/regexp");
	  return self.$require("corelib/variables");
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/array/inheritance"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$new', '$allocate', '$initialize', '$to_proc', '$__send__', '$clone', '$respond_to?', '$==', '$eql?', '$inspect', '$hash', '$*', '$class', '$slice', '$uniq', '$flatten', '$-', '$+']);
	  (function($base, $super) {
	    function $Array(){};
	    var self = $Array = $klass($base, $super, 'Array', $Array);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defs(self, '$inherited', function(klass) {
	      var self = this, replace = nil;
	
	      replace = $scope.get('Class').$new((($scope.get('Array')).$$scope.get('Wrapper')));
	      
	      klass.$$proto         = replace.$$proto;
	      klass.$$proto.$$class = klass;
	      klass.$$alloc         = replace.$$alloc;
	      klass.$$parent        = (($scope.get('Array')).$$scope.get('Wrapper'));
	
	      klass.$allocate = replace.$allocate;
	      klass.$new      = replace.$new;
	      klass["$[]"]    = replace["$[]"];
	    
	    }), nil) && 'inherited'
	  })($scope.base, null);
	  return (function($base, $super) {
	    function $Wrapper(){};
	    var self = $Wrapper = $klass($base, $super, 'Wrapper', $Wrapper);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4, TMP_5;
	
	    def.literal = nil;
	    def.$$is_array = true;
	
	    Opal.defs(self, '$allocate', TMP_1 = function(array) {
	      var self = this, $iter = TMP_1.$$p, $yield = $iter || nil, obj = nil;
	
	      if (array == null) {
	        array = []
	      }
	      TMP_1.$$p = null;
	      obj = Opal.find_super_dispatcher(self, 'allocate', TMP_1, null, $Wrapper).apply(self, []);
	      obj.literal = array;
	      return obj;
	    });
	
	    Opal.defs(self, '$new', TMP_2 = function() {
	      var $a, $b, self = this, $iter = TMP_2.$$p, block = $iter || nil, obj = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_2.$$p = null;
	      obj = self.$allocate();
	      ($a = ($b = obj).$initialize, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	      return obj;
	    });
	
	    Opal.defs(self, '$[]', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var objects = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        objects[$splat_index] = arguments[$splat_index + 0];
	      }
	      return self.$allocate(objects);
	    });
	
	    Opal.defn(self, '$initialize', TMP_3 = function() {
	      var $a, $b, self = this, $iter = TMP_3.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_3.$$p = null;
	      return self.literal = ($a = ($b = $scope.get('Array')).$new, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	    });
	
	    Opal.defn(self, '$method_missing', TMP_4 = function() {
	      var $a, $b, self = this, $iter = TMP_4.$$p, block = $iter || nil, result = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_4.$$p = null;
	      result = ($a = ($b = self.literal).$__send__, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	      if ((($a = result === self.literal) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self
	        } else {
	        return result
	      };
	    });
	
	    Opal.defn(self, '$initialize_copy', function(other) {
	      var self = this;
	
	      return self.literal = (other.literal).$clone();
	    });
	
	    Opal.defn(self, '$respond_to?', TMP_5 = function(name) {
	      var $a, self = this, $iter = TMP_5.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_5.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      return ((($a = Opal.find_super_dispatcher(self, 'respond_to?', TMP_5, $iter).apply(self, $zuper)) !== false && $a !== nil) ? $a : self.literal['$respond_to?'](name));
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return self.literal['$=='](other);
	    });
	
	    Opal.defn(self, '$eql?', function(other) {
	      var self = this;
	
	      return self.literal['$eql?'](other);
	    });
	
	    Opal.defn(self, '$to_a', function() {
	      var self = this;
	
	      return self.literal;
	    });
	
	    Opal.defn(self, '$to_ary', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return self.literal.$inspect();
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return self.literal.$hash();
	    });
	
	    Opal.defn(self, '$*', function(other) {
	      var self = this;
	
	      
	      var result = $rb_times(self.literal, other);
	
	      if (result.$$is_array) {
	        return self.$class().$allocate(result)
	      }
	      else {
	        return result;
	      }
	    ;
	    });
	
	    Opal.defn(self, '$[]', function(index, length) {
	      var self = this;
	
	      
	      var result = self.literal.$slice(index, length);
	
	      if (result.$$is_array && (index.$$is_range || length !== undefined)) {
	        return self.$class().$allocate(result)
	      }
	      else {
	        return result;
	      }
	    ;
	    });
	
	    Opal.alias(self, 'slice', '[]');
	
	    Opal.defn(self, '$uniq', function() {
	      var self = this;
	
	      return self.$class().$allocate(self.literal.$uniq());
	    });
	
	    Opal.defn(self, '$flatten', function(level) {
	      var self = this;
	
	      return self.$class().$allocate(self.literal.$flatten(level));
	    });
	
	    Opal.defn(self, '$-', function(other) {
	      var self = this;
	
	      return $rb_minus(self.literal, other);
	    });
	
	    return (Opal.defn(self, '$+', function(other) {
	      var self = this;
	
	      return $rb_plus(self.literal, other);
	    }), nil) && '+';
	  })($scope.get('Array'), null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/string/inheritance"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$require', '$new', '$allocate', '$initialize', '$to_proc', '$__send__', '$class', '$clone', '$respond_to?', '$==', '$inspect', '$+', '$*', '$map', '$split', '$enum_for', '$each_line', '$to_a', '$%']);
	  self.$require("corelib/string");
	  (function($base, $super) {
	    function $String(){};
	    var self = $String = $klass($base, $super, 'String', $String);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defs(self, '$inherited', function(klass) {
	      var self = this, replace = nil;
	
	      replace = $scope.get('Class').$new((($scope.get('String')).$$scope.get('Wrapper')));
	      
	      klass.$$proto         = replace.$$proto;
	      klass.$$proto.$$class = klass;
	      klass.$$alloc         = replace.$$alloc;
	      klass.$$parent        = (($scope.get('String')).$$scope.get('Wrapper'));
	
	      klass.$allocate = replace.$allocate;
	      klass.$new      = replace.$new;
	    
	    }), nil) && 'inherited'
	  })($scope.base, null);
	  return (function($base, $super) {
	    function $Wrapper(){};
	    var self = $Wrapper = $klass($base, $super, 'Wrapper', $Wrapper);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4, TMP_6, TMP_8;
	
	    def.literal = nil;
	    def.$$is_string = true;
	
	    Opal.defs(self, '$allocate', TMP_1 = function(string) {
	      var self = this, $iter = TMP_1.$$p, $yield = $iter || nil, obj = nil;
	
	      if (string == null) {
	        string = ""
	      }
	      TMP_1.$$p = null;
	      obj = Opal.find_super_dispatcher(self, 'allocate', TMP_1, null, $Wrapper).apply(self, []);
	      obj.literal = string;
	      return obj;
	    });
	
	    Opal.defs(self, '$new', TMP_2 = function() {
	      var $a, $b, self = this, $iter = TMP_2.$$p, block = $iter || nil, obj = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_2.$$p = null;
	      obj = self.$allocate();
	      ($a = ($b = obj).$initialize, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	      return obj;
	    });
	
	    Opal.defs(self, '$[]', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var objects = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        objects[$splat_index] = arguments[$splat_index + 0];
	      }
	      return self.$allocate(objects);
	    });
	
	    Opal.defn(self, '$initialize', function(string) {
	      var self = this;
	
	      if (string == null) {
	        string = ""
	      }
	      return self.literal = string;
	    });
	
	    Opal.defn(self, '$method_missing', TMP_3 = function() {
	      var $a, $b, self = this, $iter = TMP_3.$$p, block = $iter || nil, result = nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_3.$$p = null;
	      result = ($a = ($b = self.literal).$__send__, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	      if ((($a = result.$$is_string != null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = result == self.literal) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self
	          } else {
	          return self.$class().$allocate(result)
	        }
	        } else {
	        return result
	      };
	    });
	
	    Opal.defn(self, '$initialize_copy', function(other) {
	      var self = this;
	
	      return self.literal = (other.literal).$clone();
	    });
	
	    Opal.defn(self, '$respond_to?', TMP_4 = function(name) {
	      var $a, self = this, $iter = TMP_4.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	      TMP_4.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      return ((($a = Opal.find_super_dispatcher(self, 'respond_to?', TMP_4, $iter).apply(self, $zuper)) !== false && $a !== nil) ? $a : self.literal['$respond_to?'](name));
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return self.literal['$=='](other);
	    });
	
	    Opal.alias(self, 'eql?', '==');
	
	    Opal.alias(self, '===', '==');
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return self.literal;
	    });
	
	    Opal.alias(self, 'to_str', 'to_s');
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return self.literal.$inspect();
	    });
	
	    Opal.defn(self, '$+', function(other) {
	      var self = this;
	
	      return $rb_plus(self.literal, other);
	    });
	
	    Opal.defn(self, '$*', function(other) {
	      var self = this;
	
	      
	      var result = $rb_times(self.literal, other);
	
	      if (result.$$is_string) {
	        return self.$class().$allocate(result)
	      }
	      else {
	        return result;
	      }
	    ;
	    });
	
	    Opal.defn(self, '$split', function(pattern, limit) {
	      var $a, $b, TMP_5, self = this;
	
	      return ($a = ($b = self.literal.$split(pattern, limit)).$map, $a.$$p = (TMP_5 = function(str){var self = TMP_5.$$s || this;
	if (str == null) str = nil;
	      return self.$class().$allocate(str)}, TMP_5.$$s = self, TMP_5), $a).call($b);
	    });
	
	    Opal.defn(self, '$replace', function(string) {
	      var self = this;
	
	      return self.literal = string;
	    });
	
	    Opal.defn(self, '$each_line', TMP_6 = function(separator) {
	      var $a, $b, TMP_7, self = this, $iter = TMP_6.$$p, $yield = $iter || nil;
	      if ($gvars["/"] == null) $gvars["/"] = nil;
	
	      if (separator == null) {
	        separator = $gvars["/"]
	      }
	      TMP_6.$$p = null;
	      if (($yield !== nil)) {
	        } else {
	        return self.$enum_for("each_line", separator)
	      };
	      return ($a = ($b = self.literal).$each_line, $a.$$p = (TMP_7 = function(str){var self = TMP_7.$$s || this, $a;
	if (str == null) str = nil;
	      return $a = Opal.yield1($yield, self.$class().$allocate(str)), $a === $breaker ? $a : $a}, TMP_7.$$s = self, TMP_7), $a).call($b, separator);
	    });
	
	    Opal.defn(self, '$lines', TMP_8 = function(separator) {
	      var $a, $b, self = this, $iter = TMP_8.$$p, block = $iter || nil, e = nil;
	      if ($gvars["/"] == null) $gvars["/"] = nil;
	
	      if (separator == null) {
	        separator = $gvars["/"]
	      }
	      TMP_8.$$p = null;
	      e = ($a = ($b = self).$each_line, $a.$$p = block.$to_proc(), $a).call($b, separator);
	      if (block !== false && block !== nil) {
	        return self
	        } else {
	        return e.$to_a()
	      };
	    });
	
	    return (Opal.defn(self, '$%', function(data) {
	      var self = this;
	
	      return self.literal['$%'](data);
	    }), nil) && '%';
	  })($scope.get('String'), null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/string/encoding"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  var $a, $b, TMP_4, $c, TMP_6, $d, TMP_8, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$require', '$+', '$[]', '$new', '$to_proc', '$each', '$const_set', '$sub', '$upcase', '$const_get', '$===', '$==', '$name', '$include?', '$names', '$constants', '$raise', '$attr_accessor', '$attr_reader', '$register', '$length', '$bytes', '$to_a', '$each_byte', '$bytesize', '$enum_for', '$force_encoding', '$dup', '$coerce_to!', '$find', '$nil?', '$getbyte']);
	  self.$require("corelib/string");
	  (function($base, $super) {
	    function $Encoding(){};
	    var self = $Encoding = $klass($base, $super, 'Encoding', $Encoding);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1;
	
	    def.ascii = def.dummy = def.name = nil;
	    Opal.defs(self, '$register', TMP_1 = function(name, options) {
	      var $a, $b, $c, TMP_2, self = this, $iter = TMP_1.$$p, block = $iter || nil, names = nil, encoding = nil;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      TMP_1.$$p = null;
	      names = $rb_plus([name], (((($a = options['$[]']("aliases")) !== false && $a !== nil) ? $a : [])));
	      encoding = ($a = ($b = $scope.get('Class')).$new, $a.$$p = block.$to_proc(), $a).call($b, self).$new(name, names, ((($a = options['$[]']("ascii")) !== false && $a !== nil) ? $a : false), ((($a = options['$[]']("dummy")) !== false && $a !== nil) ? $a : false));
	      return ($a = ($c = names).$each, $a.$$p = (TMP_2 = function(name){var self = TMP_2.$$s || this;
	if (name == null) name = nil;
	      return self.$const_set(name.$sub("-", "_"), encoding)}, TMP_2.$$s = self, TMP_2), $a).call($c);
	    });
	
	    Opal.defs(self, '$find', function(name) {try {
	
	      var $a, $b, TMP_3, self = this, upcase = nil;
	
	      upcase = name.$upcase();
	      ($a = ($b = self.$constants()).$each, $a.$$p = (TMP_3 = function(const$){var self = TMP_3.$$s || this, $a, $b, encoding = nil;
	if (const$ == null) const$ = nil;
	      encoding = self.$const_get(const$);
	        if ((($a = $scope.get('Encoding')['$==='](encoding)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          return nil;
	        };
	        if ((($a = ((($b = encoding.$name()['$=='](upcase)) !== false && $b !== nil) ? $b : encoding.$names()['$include?'](upcase))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          Opal.ret(encoding)
	          } else {
	          return nil
	        };}, TMP_3.$$s = self, TMP_3), $a).call($b);
	      return self.$raise($scope.get('ArgumentError'), "unknown encoding name - " + (name));
	      } catch ($returner) { if ($returner === Opal.returner) { return $returner.$v } throw $returner; }
	    });
	
	    (function(self) {
	      var $scope = self.$$scope, def = self.$$proto;
	
	      return self.$attr_accessor("default_external")
	    })(Opal.get_singleton_class(self));
	
	    self.$attr_reader("name", "names");
	
	    Opal.defn(self, '$initialize', function(name, names, ascii, dummy) {
	      var self = this;
	
	      self.name = name;
	      self.names = names;
	      self.ascii = ascii;
	      return self.dummy = dummy;
	    });
	
	    Opal.defn(self, '$ascii_compatible?', function() {
	      var self = this;
	
	      return self.ascii;
	    });
	
	    Opal.defn(self, '$dummy?', function() {
	      var self = this;
	
	      return self.dummy;
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return self.name;
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var $a, self = this;
	
	      return "#<Encoding:" + (self.name) + ((function() {if ((($a = self.dummy) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return " (dummy)"
	        } else {
	        return nil
	      }; return nil; })()) + ">";
	    });
	
	    Opal.defn(self, '$each_byte', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'));
	    });
	
	    Opal.defn(self, '$getbyte', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'));
	    });
	
	    Opal.defn(self, '$bytesize', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'));
	    });
	
	    (function($base, $super) {
	      function $EncodingError(){};
	      var self = $EncodingError = $klass($base, $super, 'EncodingError', $EncodingError);
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      return nil;
	    })($scope.base, $scope.get('StandardError'));
	
	    return (function($base, $super) {
	      function $CompatibilityError(){};
	      var self = $CompatibilityError = $klass($base, $super, 'CompatibilityError', $CompatibilityError);
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      return nil;
	    })($scope.base, $scope.get('EncodingError'));
	  })($scope.base, null);
	  ($a = ($b = $scope.get('Encoding')).$register, $a.$$p = (TMP_4 = function(){var self = TMP_4.$$s || this, TMP_5;
	
	  Opal.def(self, '$each_byte', TMP_5 = function(string) {
	      var $a, self = this, $iter = TMP_5.$$p, block = $iter || nil;
	
	      TMP_5.$$p = null;
	      
	      for (var i = 0, length = string.length; i < length; i++) {
	        var code = string.charCodeAt(i);
	
	        if (code <= 0x7f) {
	          ((($a = Opal.yield1(block, code)) === $breaker) ? $breaker.$v : $a);
	        }
	        else {
	          var encoded = encodeURIComponent(string.charAt(i)).substr(1).split('%');
	
	          for (var j = 0, encoded_length = encoded.length; j < encoded_length; j++) {
	            ((($a = Opal.yield1(block, parseInt(encoded[j], 16))) === $breaker) ? $breaker.$v : $a);
	          }
	        }
	      }
	    
	    });
	    return (Opal.def(self, '$bytesize', function() {
	      var self = this;
	
	      return self.$bytes().$length();
	    }), nil) && 'bytesize';}, TMP_4.$$s = self, TMP_4), $a).call($b, "UTF-8", $hash2(["aliases", "ascii"], {"aliases": ["CP65001"], "ascii": true}));
	  ($a = ($c = $scope.get('Encoding')).$register, $a.$$p = (TMP_6 = function(){var self = TMP_6.$$s || this, TMP_7;
	
	  Opal.def(self, '$each_byte', TMP_7 = function(string) {
	      var $a, self = this, $iter = TMP_7.$$p, block = $iter || nil;
	
	      TMP_7.$$p = null;
	      
	      for (var i = 0, length = string.length; i < length; i++) {
	        var code = string.charCodeAt(i);
	
	        ((($a = Opal.yield1(block, code & 0xff)) === $breaker) ? $breaker.$v : $a);
	        ((($a = Opal.yield1(block, code >> 8)) === $breaker) ? $breaker.$v : $a);
	      }
	    
	    });
	    return (Opal.def(self, '$bytesize', function() {
	      var self = this;
	
	      return self.$bytes().$length();
	    }), nil) && 'bytesize';}, TMP_6.$$s = self, TMP_6), $a).call($c, "UTF-16LE");
	  ($a = ($d = $scope.get('Encoding')).$register, $a.$$p = (TMP_8 = function(){var self = TMP_8.$$s || this, TMP_9;
	
	  Opal.def(self, '$each_byte', TMP_9 = function(string) {
	      var $a, self = this, $iter = TMP_9.$$p, block = $iter || nil;
	
	      TMP_9.$$p = null;
	      
	      for (var i = 0, length = string.length; i < length; i++) {
	        ((($a = Opal.yield1(block, string.charCodeAt(i) & 0xff)) === $breaker) ? $breaker.$v : $a);
	      }
	    
	    });
	    return (Opal.def(self, '$bytesize', function() {
	      var self = this;
	
	      return self.$bytes().$length();
	    }), nil) && 'bytesize';}, TMP_8.$$s = self, TMP_8), $a).call($d, "ASCII-8BIT", $hash2(["aliases", "ascii"], {"aliases": ["BINARY"], "ascii": true}));
	  return (function($base, $super) {
	    function $String(){};
	    var self = $String = $klass($base, $super, 'String', $String);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_10;
	
	    def.encoding = nil;
	    String.prototype.encoding = (($scope.get('Encoding')).$$scope.get('UTF_16LE'));
	
	    Opal.defn(self, '$bytes', function() {
	      var self = this;
	
	      return self.$each_byte().$to_a();
	    });
	
	    Opal.defn(self, '$bytesize', function() {
	      var self = this;
	
	      return self.encoding.$bytesize(self);
	    });
	
	    Opal.defn(self, '$each_byte', TMP_10 = function() {
	      var $a, $b, self = this, $iter = TMP_10.$$p, block = $iter || nil;
	
	      TMP_10.$$p = null;
	      if ((block !== nil)) {
	        } else {
	        return self.$enum_for("each_byte")
	      };
	      ($a = ($b = self.encoding).$each_byte, $a.$$p = block.$to_proc(), $a).call($b, self);
	      return self;
	    });
	
	    Opal.defn(self, '$encode', function(encoding) {
	      var self = this;
	
	      return self.$dup().$force_encoding(encoding);
	    });
	
	    Opal.defn(self, '$encoding', function() {
	      var self = this;
	
	      return self.encoding;
	    });
	
	    Opal.defn(self, '$force_encoding', function(encoding) {
	      var $a, self = this;
	
	      encoding = $scope.get('Opal')['$coerce_to!'](encoding, $scope.get('String'), "to_str");
	      encoding = $scope.get('Encoding').$find(encoding);
	      if (encoding['$=='](self.encoding)) {
	        return self};
	      if ((($a = encoding['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "unknown encoding name - " + (encoding))};
	      
	      var result = new String(self);
	      result.encoding = encoding;
	
	      return result;
	    
	    });
	
	    return (Opal.defn(self, '$getbyte', function(idx) {
	      var self = this;
	
	      return self.encoding.$getbyte(self, idx);
	    }), nil) && 'getbyte';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/math"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  Opal.add_stubs(['$new', '$raise', '$Float', '$type_error', '$Integer', '$module_function', '$checked', '$float!', '$===', '$gamma', '$-', '$integer!', '$/', '$infinite?']);
	  return (function($base) {
	    var $Math, self = $Math = $module($base, 'Math');
	
	    var def = self.$$proto, $scope = self.$$scope, $a;
	
	    Opal.cdecl($scope, 'E', Math.E);
	
	    Opal.cdecl($scope, 'PI', Math.PI);
	
	    Opal.cdecl($scope, 'DomainError', $scope.get('Class').$new($scope.get('StandardError')));
	
	    Opal.defs(self, '$checked', function(method) {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      
	      if (isNaN(args[0]) || (args.length == 2 && isNaN(args[1]))) {
	        return NaN;
	      }
	
	      var result = Math[method].apply(null, args);
	
	      if (isNaN(result)) {
	        self.$raise($scope.get('DomainError'), "Numerical argument is out of domain - \"" + (method) + "\"");
	      }
	
	      return result;
	    
	    });
	
	    Opal.defs(self, '$float!', function(value) {
	      var self = this;
	
	      try {
	      return self.$Float(value)
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('ArgumentError')])) {
	        try {
	          return self.$raise($scope.get('Opal').$type_error(value, $scope.get('Float')))
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	    });
	
	    Opal.defs(self, '$integer!', function(value) {
	      var self = this;
	
	      try {
	      return self.$Integer(value)
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('ArgumentError')])) {
	        try {
	          return self.$raise($scope.get('Opal').$type_error(value, $scope.get('Integer')))
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	    });
	
	    self.$module_function();
	
	    Opal.defn(self, '$acos', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("acos", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.acosh) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.acosh = function(x) {
	        return Math.log(x + Math.sqrt(x * x - 1));
	      }
	    
	    };
	
	    Opal.defn(self, '$acosh', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("acosh", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$asin', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("asin", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.asinh) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.asinh = function(x) {
	        return Math.log(x + Math.sqrt(x * x + 1))
	      }
	    ;
	    };
	
	    Opal.defn(self, '$asinh', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("asinh", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$atan', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("atan", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$atan2', function(y, x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("atan2", $scope.get('Math')['$float!'](y), $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.atanh) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.atanh = function(x) {
	        return 0.5 * Math.log((1 + x) / (1 - x));
	      }
	    
	    };
	
	    Opal.defn(self, '$atanh', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("atanh", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.cbrt) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.cbrt = function(x) {
	        if (x == 0) {
	          return 0;
	        }
	
	        if (x < 0) {
	          return -Math.cbrt(-x);
	        }
	
	        var r  = x,
	            ex = 0;
	
	        while (r < 0.125) {
	          r *= 8;
	          ex--;
	        }
	
	        while (r > 1.0) {
	          r *= 0.125;
	          ex++;
	        }
	
	        r = (-0.46946116 * r + 1.072302) * r + 0.3812513;
	
	        while (ex < 0) {
	          r *= 0.5;
	          ex++;
	        }
	
	        while (ex > 0) {
	          r *= 2;
	          ex--;
	        }
	
	        r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
	        r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
	        r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
	        r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
	
	        return r;
	      }
	    
	    };
	
	    Opal.defn(self, '$cbrt', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("cbrt", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$cos', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("cos", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.cosh) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.cosh = function(x) {
	        return (Math.exp(x) + Math.exp(-x)) / 2;
	      }
	    
	    };
	
	    Opal.defn(self, '$cosh', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("cosh", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.erf) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.erf = function(x) {
	        var A1 =  0.254829592,
	            A2 = -0.284496736,
	            A3 =  1.421413741,
	            A4 = -1.453152027,
	            A5 =  1.061405429,
	            P  =  0.3275911;
	
	        var sign = 1;
	
	        if (x < 0) {
	            sign = -1;
	        }
	
	        x = Math.abs(x);
	
	        var t = 1.0 / (1.0 + P * x);
	        var y = 1.0 - (((((A5 * t + A4) * t) + A3) * t + A2) * t + A1) * t * Math.exp(-x * x);
	
	        return sign * y;
	      }
	    
	    };
	
	    Opal.defn(self, '$erf', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("erf", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.erfc) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.erfc = function(x) {
	        var z = Math.abs(x),
	            t = 1.0 / (0.5 * z + 1.0);
	
	        var A1 = t * 0.17087277 + -0.82215223,
	            A2 = t * A1 + 1.48851587,
	            A3 = t * A2 + -1.13520398,
	            A4 = t * A3 + 0.27886807,
	            A5 = t * A4 + -0.18628806,
	            A6 = t * A5 + 0.09678418,
	            A7 = t * A6 + 0.37409196,
	            A8 = t * A7 + 1.00002368,
	            A9 = t * A8,
	            A10 = -z * z - 1.26551223 + A9;
	
	        var a = t * Math.exp(A10);
	
	        if (x < 0.0) {
	          return 2.0 - a;
	        }
	        else {
	          return a;
	        }
	      }
	    
	    };
	
	    Opal.defn(self, '$erfc', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("erfc", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$exp', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("exp", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$frexp', function(x) {
	      var self = this;
	
	      x = $scope.get('Math')['$float!'](x);
	      
	      if (isNaN(x)) {
	        return [NaN, 0];
	      }
	
	      var ex   = Math.floor(Math.log(Math.abs(x)) / Math.log(2)) + 1,
	          frac = x / Math.pow(2, ex);
	
	      return [frac, ex];
	    
	    });
	
	    Opal.defn(self, '$gamma', function(n) {
	      var self = this;
	
	      n = $scope.get('Math')['$float!'](n);
	      
	      var i, t, x, value, result, twoN, threeN, fourN, fiveN;
	
	      var G = 4.7421875;
	
	      var P = [
	         0.99999999999999709182,
	         57.156235665862923517,
	        -59.597960355475491248,
	         14.136097974741747174,
	        -0.49191381609762019978,
	         0.33994649984811888699e-4,
	         0.46523628927048575665e-4,
	        -0.98374475304879564677e-4,
	         0.15808870322491248884e-3,
	        -0.21026444172410488319e-3,
	         0.21743961811521264320e-3,
	        -0.16431810653676389022e-3,
	         0.84418223983852743293e-4,
	        -0.26190838401581408670e-4,
	         0.36899182659531622704e-5
	      ];
	
	
	      if (isNaN(n)) {
	        return NaN;
	      }
	
	      if (n === 0 && 1 / n < 0) {
	        return -Infinity;
	      }
	
	      if (n === -1 || n === -Infinity) {
	        self.$raise($scope.get('DomainError'), "Numerical argument is out of domain - \"gamma\"");
	      }
	
	      if ($scope.get('Integer')['$==='](n)) {
	        if (n <= 0) {
	          return isFinite(n) ? Infinity : NaN;
	        }
	
	        if (n > 171) {
	          return Infinity;
	        }
	
	        value  = n - 2;
	        result = n - 1;
	
	        while (value > 1) {
	          result *= value;
	          value--;
	        }
	
	        if (result == 0) {
	          result = 1;
	        }
	
	        return result;
	      }
	
	      if (n < 0.5) {
	        return Math.PI / (Math.sin(Math.PI * n) * $scope.get('Math').$gamma($rb_minus(1, n)));
	      }
	
	      if (n >= 171.35) {
	        return Infinity;
	      }
	
	      if (n > 85.0) {
	        twoN   = n * n;
	        threeN = twoN * n;
	        fourN  = threeN * n;
	        fiveN  = fourN * n;
	
	        return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
	          (1 + 1 / (12 * n) + 1 / (288 * twoN) - 139 / (51840 * threeN) -
	          571 / (2488320 * fourN) + 163879 / (209018880 * fiveN) +
	          5246819 / (75246796800 * fiveN * n));
	      }
	
	      n -= 1;
	      x  = P[0];
	
	      for (i = 1; i < P.length; ++i) {
	        x += P[i] / (n + i);
	      }
	
	      t = n + G + 0.5;
	
	      return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
	    
	    });
	
	    if ((($a = (typeof(Math.hypot) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.hypot = function(x, y) {
	        return Math.sqrt(x * x + y * y)
	      }
	    ;
	    };
	
	    Opal.defn(self, '$hypot', function(x, y) {
	      var self = this;
	
	      return $scope.get('Math').$checked("hypot", $scope.get('Math')['$float!'](x), $scope.get('Math')['$float!'](y));
	    });
	
	    Opal.defn(self, '$ldexp', function(mantissa, exponent) {
	      var self = this;
	
	      mantissa = $scope.get('Math')['$float!'](mantissa);
	      exponent = $scope.get('Math')['$integer!'](exponent);
	      
	      if (isNaN(exponent)) {
	        self.$raise($scope.get('RangeError'), "float NaN out of range of integer");
	      }
	
	      return mantissa * Math.pow(2, exponent);
	    ;
	    });
	
	    Opal.defn(self, '$lgamma', function(n) {
	      var self = this;
	
	      
	      if (n == -1) {
	        return [Infinity, 1];
	      }
	      else {
	        return [Math.log(Math.abs($scope.get('Math').$gamma(n))), $scope.get('Math').$gamma(n) < 0 ? -1 : 1];
	      }
	    ;
	    });
	
	    Opal.defn(self, '$log', function(x, base) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('String')['$==='](x)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('Opal').$type_error(x, $scope.get('Float')))};
	      if ((($a = base == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('Math').$checked("log", $scope.get('Math')['$float!'](x))
	        } else {
	        if ((($a = $scope.get('String')['$==='](base)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('Opal').$type_error(base, $scope.get('Float')))};
	        return $rb_divide($scope.get('Math').$checked("log", $scope.get('Math')['$float!'](x)), $scope.get('Math').$checked("log", $scope.get('Math')['$float!'](base)));
	      };
	    });
	
	    if ((($a = (typeof(Math.log10) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.log10 = function(x) {
	        return Math.log(x) / Math.LN10;
	      }
	    
	    };
	
	    Opal.defn(self, '$log10', function(x) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('String')['$==='](x)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('Opal').$type_error(x, $scope.get('Float')))};
	      return $scope.get('Math').$checked("log10", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.log2) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.log2 = function(x) {
	        return Math.log(x) / Math.LN2;
	      }
	    
	    };
	
	    Opal.defn(self, '$log2', function(x) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('String')['$==='](x)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('Opal').$type_error(x, $scope.get('Float')))};
	      return $scope.get('Math').$checked("log2", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$sin', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("sin", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.sinh) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.sinh = function(x) {
	        return (Math.exp(x) - Math.exp(-x)) / 2;
	      }
	    
	    };
	
	    Opal.defn(self, '$sinh', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("sinh", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$sqrt', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("sqrt", $scope.get('Math')['$float!'](x));
	    });
	
	    Opal.defn(self, '$tan', function(x) {
	      var $a, self = this;
	
	      x = $scope.get('Math')['$float!'](x);
	      if ((($a = x['$infinite?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (($scope.get('Float')).$$scope.get('NAN'))};
	      return $scope.get('Math').$checked("tan", $scope.get('Math')['$float!'](x));
	    });
	
	    if ((($a = (typeof(Math.tanh) !== "undefined")) !== nil && (!$a.$$is_boolean || $a == true))) {
	      } else {
	      
	      Math.tanh = function(x) {
	        if (x == Infinity) {
	          return 1;
	        }
	        else if (x == -Infinity) {
	          return -1;
	        }
	        else {
	          return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
	        }
	      }
	    
	    };
	
	    Opal.defn(self, '$tanh', function(x) {
	      var self = this;
	
	      return $scope.get('Math').$checked("tanh", $scope.get('Math')['$float!'](x));
	    });
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/complex"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $module = Opal.module;
	
	  Opal.add_stubs(['$require', '$===', '$real?', '$raise', '$new', '$*', '$cos', '$sin', '$attr_reader', '$class', '$==', '$real', '$imag', '$Complex', '$-@', '$+', '$__coerced__', '$-', '$nan?', '$/', '$conj', '$abs2', '$quo', '$polar', '$exp', '$log', '$>', '$!=', '$divmod', '$**', '$hypot', '$atan2', '$lcm', '$denominator', '$to_s', '$numerator', '$abs', '$arg', '$rationalize', '$to_f', '$to_i', '$to_r', '$inspect', '$positive?', '$infinite?']);
	  self.$require("corelib/numeric");
	  (function($base, $super) {
	    function $Complex(){};
	    var self = $Complex = $klass($base, $super, 'Complex', $Complex);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.real = def.imag = nil;
	    Opal.defs(self, '$rect', function(real, imag) {
	      var $a, $b, $c, $d, self = this;
	
	      if (imag == null) {
	        imag = 0
	      }
	      if ((($a = ($b = ($c = ($d = $scope.get('Numeric')['$==='](real), $d !== false && $d !== nil ?real['$real?']() : $d), $c !== false && $c !== nil ?$scope.get('Numeric')['$==='](imag) : $c), $b !== false && $b !== nil ?imag['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "not a real")
	      };
	      return self.$new(real, imag);
	    });
	
	    (function(self) {
	      var $scope = self.$$scope, def = self.$$proto;
	
	      return Opal.alias(self, 'rectangular', 'rect')
	    })(Opal.get_singleton_class(self));
	
	    Opal.defs(self, '$polar', function(r, theta) {
	      var $a, $b, $c, $d, self = this;
	
	      if (theta == null) {
	        theta = 0
	      }
	      if ((($a = ($b = ($c = ($d = $scope.get('Numeric')['$==='](r), $d !== false && $d !== nil ?r['$real?']() : $d), $c !== false && $c !== nil ?$scope.get('Numeric')['$==='](theta) : $c), $b !== false && $b !== nil ?theta['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "not a real")
	      };
	      return self.$new($rb_times(r, $scope.get('Math').$cos(theta)), $rb_times(r, $scope.get('Math').$sin(theta)));
	    });
	
	    self.$attr_reader("real", "imag");
	
	    Opal.defn(self, '$initialize', function(real, imag) {
	      var self = this;
	
	      if (imag == null) {
	        imag = 0
	      }
	      self.real = real;
	      return self.imag = imag;
	    });
	
	    Opal.defn(self, '$coerce', function(other) {
	      var $a, $b, self = this;
	
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return [other, self]
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](other), $b !== false && $b !== nil ?other['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return [$scope.get('Complex').$new(other, 0), self]
	        } else {
	        return self.$raise($scope.get('TypeError'), "" + (other.$class()) + " can't be coerced into Complex")
	      };
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var $a, $b, self = this;
	
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (($a = self.real['$=='](other.$real())) ? self.imag['$=='](other.$imag()) : self.real['$=='](other.$real()))
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](other), $b !== false && $b !== nil ?other['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (($a = self.real['$=='](other)) ? self.imag['$=='](0) : self.real['$=='](other))
	        } else {
	        return other['$=='](self)
	      };
	    });
	
	    Opal.defn(self, '$-@', function() {
	      var self = this;
	
	      return self.$Complex(self.real['$-@'](), self.imag['$-@']());
	    });
	
	    Opal.defn(self, '$+', function(other) {
	      var $a, $b, self = this;
	
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex($rb_plus(self.real, other.$real()), $rb_plus(self.imag, other.$imag()))
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](other), $b !== false && $b !== nil ?other['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex($rb_plus(self.real, other), self.imag)
	        } else {
	        return self.$__coerced__("+", other)
	      };
	    });
	
	    Opal.defn(self, '$-', function(other) {
	      var $a, $b, self = this;
	
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex($rb_minus(self.real, other.$real()), $rb_minus(self.imag, other.$imag()))
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](other), $b !== false && $b !== nil ?other['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex($rb_minus(self.real, other), self.imag)
	        } else {
	        return self.$__coerced__("-", other)
	      };
	    });
	
	    Opal.defn(self, '$*', function(other) {
	      var $a, $b, self = this;
	
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex($rb_minus($rb_times(self.real, other.$real()), $rb_times(self.imag, other.$imag())), $rb_plus($rb_times(self.real, other.$imag()), $rb_times(self.imag, other.$real())))
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](other), $b !== false && $b !== nil ?other['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex($rb_times(self.real, other), $rb_times(self.imag, other))
	        } else {
	        return self.$__coerced__("*", other)
	      };
	    });
	
	    Opal.defn(self, '$/', function(other) {
	      var $a, $b, $c, $d, $e, self = this;
	
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = ((($b = ((($c = ((($d = (($e = $scope.get('Number')['$==='](self.real), $e !== false && $e !== nil ?self.real['$nan?']() : $e))) !== false && $d !== nil) ? $d : (($e = $scope.get('Number')['$==='](self.imag), $e !== false && $e !== nil ?self.imag['$nan?']() : $e)))) !== false && $c !== nil) ? $c : (($d = $scope.get('Number')['$==='](other.$real()), $d !== false && $d !== nil ?other.$real()['$nan?']() : $d)))) !== false && $b !== nil) ? $b : (($c = $scope.get('Number')['$==='](other.$imag()), $c !== false && $c !== nil ?other.$imag()['$nan?']() : $c)))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return $scope.get('Complex').$new((($scope.get('Float')).$$scope.get('NAN')), (($scope.get('Float')).$$scope.get('NAN')))
	          } else {
	          return $rb_divide($rb_times(self, other.$conj()), other.$abs2())
	        }
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](other), $b !== false && $b !== nil ?other['$real?']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Complex(self.real.$quo(other), self.imag.$quo(other))
	        } else {
	        return self.$__coerced__("/", other)
	      };
	    });
	
	    Opal.defn(self, '$**', function(other) {
	      var $a, $b, $c, $d, $e, self = this, r = nil, theta = nil, ore = nil, oim = nil, nr = nil, ntheta = nil, x = nil, z = nil, n = nil, div = nil, mod = nil;
	
	      if (other['$=='](0)) {
	        return $scope.get('Complex').$new(1, 0)};
	      if ((($a = $scope.get('Complex')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        $b = self.$polar(), $a = Opal.to_ary($b), r = ($a[0] == null ? nil : $a[0]), theta = ($a[1] == null ? nil : $a[1]), $b;
	        ore = other.$real();
	        oim = other.$imag();
	        nr = $scope.get('Math').$exp($rb_minus($rb_times(ore, $scope.get('Math').$log(r)), $rb_times(oim, theta)));
	        ntheta = $rb_plus($rb_times(theta, ore), $rb_times(oim, $scope.get('Math').$log(r)));
	        return $scope.get('Complex').$polar(nr, ntheta);
	      } else if ((($a = $scope.get('Integer')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = $rb_gt(other, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          x = self;
	          z = x;
	          n = $rb_minus(other, 1);
	          while ((($b = n['$!='](0)) !== nil && (!$b.$$is_boolean || $b == true))) {
	          while ((($c = ($e = n.$divmod(2), $d = Opal.to_ary($e), div = ($d[0] == null ? nil : $d[0]), mod = ($d[1] == null ? nil : $d[1]), $e, mod['$=='](0))) !== nil && (!$c.$$is_boolean || $c == true))) {
	          x = self.$Complex($rb_minus($rb_times(x.$real(), x.$real()), $rb_times(x.$imag(), x.$imag())), $rb_times($rb_times(2, x.$real()), x.$imag()));
	          n = div;};
	          z = $rb_times(z, x);
	          n = $rb_minus(n, 1);};
	          return z;
	          } else {
	          return ($rb_divide($scope.get('Rational').$new(1, 1), self))['$**'](other['$-@']())
	        }
	      } else if ((($a = ((($b = $scope.get('Float')['$==='](other)) !== false && $b !== nil) ? $b : $scope.get('Rational')['$==='](other))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        $b = self.$polar(), $a = Opal.to_ary($b), r = ($a[0] == null ? nil : $a[0]), theta = ($a[1] == null ? nil : $a[1]), $b;
	        return $scope.get('Complex').$polar(r['$**'](other), $rb_times(theta, other));
	        } else {
	        return self.$__coerced__("**", other)
	      };
	    });
	
	    Opal.defn(self, '$abs', function() {
	      var self = this;
	
	      return $scope.get('Math').$hypot(self.real, self.imag);
	    });
	
	    Opal.defn(self, '$abs2', function() {
	      var self = this;
	
	      return $rb_plus($rb_times(self.real, self.real), $rb_times(self.imag, self.imag));
	    });
	
	    Opal.defn(self, '$angle', function() {
	      var self = this;
	
	      return $scope.get('Math').$atan2(self.imag, self.real);
	    });
	
	    Opal.alias(self, 'arg', 'angle');
	
	    Opal.defn(self, '$conj', function() {
	      var self = this;
	
	      return self.$Complex(self.real, self.imag['$-@']());
	    });
	
	    Opal.alias(self, 'conjugate', 'conj');
	
	    Opal.defn(self, '$denominator', function() {
	      var self = this;
	
	      return self.real.$denominator().$lcm(self.imag.$denominator());
	    });
	
	    Opal.alias(self, 'divide', '/');
	
	    Opal.defn(self, '$eql?', function(other) {
	      var $a, $b, self = this;
	
	      return ($a = ($b = $scope.get('Complex')['$==='](other), $b !== false && $b !== nil ?self.real.$class()['$=='](self.imag.$class()) : $b), $a !== false && $a !== nil ?self['$=='](other) : $a);
	    });
	
	    Opal.defn(self, '$fdiv', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Numeric')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "" + (other.$class()) + " can't be coerced into Complex")
	      };
	      return $rb_divide(self, other);
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return "Complex:" + (self.real) + ":" + (self.imag);
	    });
	
	    Opal.alias(self, 'imaginary', 'imag');
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return "(" + (self.$to_s()) + ")";
	    });
	
	    Opal.alias(self, 'magnitude', 'abs');
	
	    Opal.defn(self, '$numerator', function() {
	      var self = this, d = nil;
	
	      d = self.$denominator();
	      return self.$Complex($rb_times(self.real.$numerator(), ($rb_divide(d, self.real.$denominator()))), $rb_times(self.imag.$numerator(), ($rb_divide(d, self.imag.$denominator()))));
	    });
	
	    Opal.alias(self, 'phase', 'arg');
	
	    Opal.defn(self, '$polar', function() {
	      var self = this;
	
	      return [self.$abs(), self.$arg()];
	    });
	
	    Opal.alias(self, 'quo', '/');
	
	    Opal.defn(self, '$rationalize', function(eps) {
	      var $a, self = this;
	
	      
	      if (arguments.length > 1) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arguments.length) + " for 0..1)");
	      }
	    ;
	      if ((($a = self.imag['$!='](0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('RangeError'), "can't' convert " + (self) + " into Rational")};
	      return self.$real().$rationalize(eps);
	    });
	
	    Opal.defn(self, '$real?', function() {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.defn(self, '$rect', function() {
	      var self = this;
	
	      return [self.real, self.imag];
	    });
	
	    Opal.alias(self, 'rectangular', 'rect');
	
	    Opal.defn(self, '$to_f', function() {
	      var self = this;
	
	      if (self.imag['$=='](0)) {
	        } else {
	        self.$raise($scope.get('RangeError'), "can't convert " + (self) + " into Float")
	      };
	      return self.real.$to_f();
	    });
	
	    Opal.defn(self, '$to_i', function() {
	      var self = this;
	
	      if (self.imag['$=='](0)) {
	        } else {
	        self.$raise($scope.get('RangeError'), "can't convert " + (self) + " into Integer")
	      };
	      return self.real.$to_i();
	    });
	
	    Opal.defn(self, '$to_r', function() {
	      var self = this;
	
	      if (self.imag['$=='](0)) {
	        } else {
	        self.$raise($scope.get('RangeError'), "can't convert " + (self) + " into Rational")
	      };
	      return self.real.$to_r();
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var $a, $b, $c, self = this, result = nil;
	
	      result = self.real.$inspect();
	      if ((($a = ((($b = (($c = $scope.get('Number')['$==='](self.imag), $c !== false && $c !== nil ?self.imag['$nan?']() : $c))) !== false && $b !== nil) ? $b : self.imag['$positive?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        result = $rb_plus(result, "+")
	        } else {
	        result = $rb_plus(result, "-")
	      };
	      result = $rb_plus(result, self.imag.$abs().$inspect());
	      if ((($a = ($b = $scope.get('Number')['$==='](self.imag), $b !== false && $b !== nil ?(((($c = self.imag['$nan?']()) !== false && $c !== nil) ? $c : self.imag['$infinite?']())) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        result = $rb_plus(result, "*")};
	      return $rb_plus(result, "i");
	    });
	
	    return Opal.cdecl($scope, 'I', self.$new(0, 1));
	  })($scope.base, $scope.get('Numeric'));
	  return (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$Complex', function(real, imag) {
	      var self = this;
	
	      if (imag == null) {
	        imag = nil
	      }
	      if (imag !== false && imag !== nil) {
	        return $scope.get('Complex').$new(real, imag)
	        } else {
	        return $scope.get('Complex').$new(real, 0)
	      };
	    })
	  })($scope.base);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/rational"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_times(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs * rhs : lhs['$*'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_le(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $module = Opal.module;
	
	  Opal.add_stubs(['$require', '$to_i', '$==', '$raise', '$<', '$-@', '$new', '$gcd', '$/', '$nil?', '$===', '$reduce', '$to_r', '$equal?', '$!', '$coerce_to!', '$attr_reader', '$to_f', '$numerator', '$denominator', '$<=>', '$-', '$*', '$__coerced__', '$+', '$Rational', '$>', '$**', '$abs', '$ceil', '$with_precision', '$floor', '$to_s', '$<=', '$truncate', '$send', '$convert']);
	  self.$require("corelib/numeric");
	  (function($base, $super) {
	    function $Rational(){};
	    var self = $Rational = $klass($base, $super, 'Rational', $Rational);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.num = def.den = nil;
	    Opal.defs(self, '$reduce', function(num, den) {
	      var $a, self = this, gcd = nil;
	
	      num = num.$to_i();
	      den = den.$to_i();
	      if (den['$=='](0)) {
	        self.$raise($scope.get('ZeroDivisionError'), "divided by 0")
	      } else if ((($a = $rb_lt(den, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        num = num['$-@']();
	        den = den['$-@']();
	      } else if (den['$=='](1)) {
	        return self.$new(num, den)};
	      gcd = num.$gcd(den);
	      return self.$new($rb_divide(num, gcd), $rb_divide(den, gcd));
	    });
	
	    Opal.defs(self, '$convert', function(num, den) {
	      var $a, $b, $c, self = this;
	
	      if ((($a = ((($b = num['$nil?']()) !== false && $b !== nil) ? $b : den['$nil?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('TypeError'), "cannot convert nil into Rational")};
	      if ((($a = ($b = $scope.get('Integer')['$==='](num), $b !== false && $b !== nil ?$scope.get('Integer')['$==='](den) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$reduce(num, den)};
	      if ((($a = ((($b = ((($c = $scope.get('Float')['$==='](num)) !== false && $c !== nil) ? $c : $scope.get('String')['$==='](num))) !== false && $b !== nil) ? $b : $scope.get('Complex')['$==='](num))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        num = num.$to_r()};
	      if ((($a = ((($b = ((($c = $scope.get('Float')['$==='](den)) !== false && $c !== nil) ? $c : $scope.get('String')['$==='](den))) !== false && $b !== nil) ? $b : $scope.get('Complex')['$==='](den))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        den = den.$to_r()};
	      if ((($a = ($b = den['$equal?'](1), $b !== false && $b !== nil ?($scope.get('Integer')['$==='](num))['$!']() : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('Opal')['$coerce_to!'](num, $scope.get('Rational'), "to_r")
	      } else if ((($a = ($b = $scope.get('Numeric')['$==='](num), $b !== false && $b !== nil ?$scope.get('Numeric')['$==='](den) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $rb_divide(num, den)
	        } else {
	        return self.$reduce(num, den)
	      };
	    });
	
	    self.$attr_reader("numerator", "denominator");
	
	    Opal.defn(self, '$initialize', function(num, den) {
	      var self = this;
	
	      self.num = num;
	      return self.den = den;
	    });
	
	    Opal.defn(self, '$numerator', function() {
	      var self = this;
	
	      return self.num;
	    });
	
	    Opal.defn(self, '$denominator', function() {
	      var self = this;
	
	      return self.den;
	    });
	
	    Opal.defn(self, '$coerce', function(other) {
	      var self = this, $case = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {return [other, self]}else if ($scope.get('Integer')['$===']($case)) {return [other.$to_r(), self]}else if ($scope.get('Float')['$===']($case)) {return [other, self.$to_f()]}else { return nil }})();
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var $a, self = this, $case = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {return (($a = self.num['$=='](other.$numerator())) ? self.den['$=='](other.$denominator()) : self.num['$=='](other.$numerator()))}else if ($scope.get('Integer')['$===']($case)) {return (($a = self.num['$=='](other)) ? self.den['$=='](1) : self.num['$=='](other))}else if ($scope.get('Float')['$===']($case)) {return self.$to_f()['$=='](other)}else {return other['$=='](self)}})();
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var self = this, $case = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {return $rb_minus($rb_times(self.num, other.$denominator()), $rb_times(self.den, other.$numerator()))['$<=>'](0)}else if ($scope.get('Integer')['$===']($case)) {return $rb_minus(self.num, $rb_times(self.den, other))['$<=>'](0)}else if ($scope.get('Float')['$===']($case)) {return self.$to_f()['$<=>'](other)}else {return self.$__coerced__("<=>", other)}})();
	    });
	
	    Opal.defn(self, '$+', function(other) {
	      var self = this, $case = nil, num = nil, den = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {num = $rb_plus($rb_times(self.num, other.$denominator()), $rb_times(self.den, other.$numerator()));
	      den = $rb_times(self.den, other.$denominator());
	      return self.$Rational(num, den);}else if ($scope.get('Integer')['$===']($case)) {return self.$Rational($rb_plus(self.num, $rb_times(other, self.den)), self.den)}else if ($scope.get('Float')['$===']($case)) {return $rb_plus(self.$to_f(), other)}else {return self.$__coerced__("+", other)}})();
	    });
	
	    Opal.defn(self, '$-', function(other) {
	      var self = this, $case = nil, num = nil, den = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {num = $rb_minus($rb_times(self.num, other.$denominator()), $rb_times(self.den, other.$numerator()));
	      den = $rb_times(self.den, other.$denominator());
	      return self.$Rational(num, den);}else if ($scope.get('Integer')['$===']($case)) {return self.$Rational($rb_minus(self.num, $rb_times(other, self.den)), self.den)}else if ($scope.get('Float')['$===']($case)) {return $rb_minus(self.$to_f(), other)}else {return self.$__coerced__("-", other)}})();
	    });
	
	    Opal.defn(self, '$*', function(other) {
	      var self = this, $case = nil, num = nil, den = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {num = $rb_times(self.num, other.$numerator());
	      den = $rb_times(self.den, other.$denominator());
	      return self.$Rational(num, den);}else if ($scope.get('Integer')['$===']($case)) {return self.$Rational($rb_times(self.num, other), self.den)}else if ($scope.get('Float')['$===']($case)) {return $rb_times(self.$to_f(), other)}else {return self.$__coerced__("*", other)}})();
	    });
	
	    Opal.defn(self, '$/', function(other) {
	      var self = this, $case = nil, num = nil, den = nil;
	
	      return (function() {$case = other;if ($scope.get('Rational')['$===']($case)) {num = $rb_times(self.num, other.$denominator());
	      den = $rb_times(self.den, other.$numerator());
	      return self.$Rational(num, den);}else if ($scope.get('Integer')['$===']($case)) {if (other['$=='](0)) {
	        return $rb_divide(self.$to_f(), 0.0)
	        } else {
	        return self.$Rational(self.num, $rb_times(self.den, other))
	      }}else if ($scope.get('Float')['$===']($case)) {return $rb_divide(self.$to_f(), other)}else {return self.$__coerced__("/", other)}})();
	    });
	
	    Opal.defn(self, '$**', function(other) {
	      var $a, $b, self = this, $case = nil;
	
	      return (function() {$case = other;if ($scope.get('Integer')['$===']($case)) {if ((($a = (($b = self['$=='](0)) ? $rb_lt(other, 0) : self['$=='](0))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (($scope.get('Float')).$$scope.get('INFINITY'))
	      } else if ((($a = $rb_gt(other, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Rational(self.num['$**'](other), self.den['$**'](other))
	      } else if ((($a = $rb_lt(other, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$Rational(self.den['$**'](other['$-@']()), self.num['$**'](other['$-@']()))
	        } else {
	        return self.$Rational(1, 1)
	      }}else if ($scope.get('Float')['$===']($case)) {return self.$to_f()['$**'](other)}else if ($scope.get('Rational')['$===']($case)) {if (other['$=='](0)) {
	        return self.$Rational(1, 1)
	      } else if (other.$denominator()['$=='](1)) {
	        if ((($a = $rb_lt(other, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self.$Rational(self.den['$**'](other.$numerator().$abs()), self.num['$**'](other.$numerator().$abs()))
	          } else {
	          return self.$Rational(self.num['$**'](other.$numerator()), self.den['$**'](other.$numerator()))
	        }
	      } else if ((($a = (($b = self['$=='](0)) ? $rb_lt(other, 0) : self['$=='](0))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('ZeroDivisionError'), "divided by 0")
	        } else {
	        return self.$to_f()['$**'](other)
	      }}else {return self.$__coerced__("**", other)}})();
	    });
	
	    Opal.defn(self, '$abs', function() {
	      var self = this;
	
	      return self.$Rational(self.num.$abs(), self.den.$abs());
	    });
	
	    Opal.defn(self, '$ceil', function(precision) {
	      var self = this;
	
	      if (precision == null) {
	        precision = 0
	      }
	      if (precision['$=='](0)) {
	        return (($rb_divide(self.num['$-@'](), self.den))['$-@']()).$ceil()
	        } else {
	        return self.$with_precision("ceil", precision)
	      };
	    });
	
	    Opal.alias(self, 'divide', '/');
	
	    Opal.defn(self, '$floor', function(precision) {
	      var self = this;
	
	      if (precision == null) {
	        precision = 0
	      }
	      if (precision['$=='](0)) {
	        return (($rb_divide(self.num['$-@'](), self.den))['$-@']()).$floor()
	        } else {
	        return self.$with_precision("floor", precision)
	      };
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return "Rational:" + (self.num) + ":" + (self.den);
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return "(" + (self.$to_s()) + ")";
	    });
	
	    Opal.alias(self, 'quo', '/');
	
	    Opal.defn(self, '$rationalize', function(eps) {
	      var self = this;
	
	      
	      if (arguments.length > 1) {
	        self.$raise($scope.get('ArgumentError'), "wrong number of arguments (" + (arguments.length) + " for 0..1)");
	      }
	
	      if (eps == null) {
	        return self;
	      }
	
	      var e = eps.$abs(),
	          a = $rb_minus(self, e),
	          b = $rb_plus(self, e);
	
	      var p0 = 0,
	          p1 = 1,
	          q0 = 1,
	          q1 = 0,
	          p2, q2;
	
	      var c, k, t;
	
	      while (true) {
	        c = (a).$ceil();
	
	        if ($rb_le(c, b)) {
	          break;
	        }
	
	        k  = c - 1;
	        p2 = k * p1 + p0;
	        q2 = k * q1 + q0;
	        t  = $rb_divide(1, ($rb_minus(b, k)));
	        b  = $rb_divide(1, ($rb_minus(a, k)));
	        a  = t;
	
	        p0 = p1;
	        q0 = q1;
	        p1 = p2;
	        q1 = q2;
	      }
	
	      return self.$Rational(c * p1 + p0, c * q1 + q0);
	    ;
	    });
	
	    Opal.defn(self, '$round', function(precision) {
	      var $a, self = this, num = nil, den = nil, approx = nil;
	
	      if (precision == null) {
	        precision = 0
	      }
	      if (precision['$=='](0)) {
	        } else {
	        return self.$with_precision("round", precision)
	      };
	      if (self.num['$=='](0)) {
	        return 0};
	      if (self.den['$=='](1)) {
	        return self.num};
	      num = $rb_plus($rb_times(self.num.$abs(), 2), self.den);
	      den = $rb_times(self.den, 2);
	      approx = ($rb_divide(num, den)).$truncate();
	      if ((($a = $rb_lt(self.num, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return approx['$-@']()
	        } else {
	        return approx
	      };
	    });
	
	    Opal.defn(self, '$to_f', function() {
	      var self = this;
	
	      return $rb_divide(self.num, self.den);
	    });
	
	    Opal.defn(self, '$to_i', function() {
	      var self = this;
	
	      return self.$truncate();
	    });
	
	    Opal.defn(self, '$to_r', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      return "" + (self.num) + "/" + (self.den);
	    });
	
	    Opal.defn(self, '$truncate', function(precision) {
	      var $a, self = this;
	
	      if (precision == null) {
	        precision = 0
	      }
	      if (precision['$=='](0)) {
	        if ((($a = $rb_lt(self.num, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self.$ceil()
	          } else {
	          return self.$floor()
	        }
	        } else {
	        return self.$with_precision("truncate", precision)
	      };
	    });
	
	    return (Opal.defn(self, '$with_precision', function(method, precision) {
	      var $a, self = this, p = nil, s = nil;
	
	      if ((($a = $scope.get('Integer')['$==='](precision)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        self.$raise($scope.get('TypeError'), "not an Integer")
	      };
	      p = (10)['$**'](precision);
	      s = $rb_times(self, p);
	      if ((($a = $rb_lt(precision, 1)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($rb_divide(s.$send(method), p)).$to_i()
	        } else {
	        return self.$Rational(s.$send(method), p)
	      };
	    }), nil) && 'with_precision';
	  })($scope.base, $scope.get('Numeric'));
	  return (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$Rational', function(numerator, denominator) {
	      var self = this;
	
	      if (denominator == null) {
	        denominator = 1
	      }
	      return $scope.get('Rational').$convert(numerator, denominator);
	    })
	  })($scope.base);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/time"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_gt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs > rhs : lhs['$>'](rhs);
	  }
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_divide(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs / rhs : lhs['$/'](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_le(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $range = Opal.range;
	
	  Opal.add_stubs(['$require', '$include', '$===', '$raise', '$coerce_to!', '$respond_to?', '$to_str', '$to_i', '$new', '$<=>', '$to_f', '$nil?', '$>', '$<', '$strftime', '$year', '$month', '$day', '$+', '$round', '$/', '$-', '$copy_instance_variables', '$initialize_dup', '$is_a?', '$zero?', '$wday', '$utc?', '$mon', '$yday', '$hour', '$min', '$sec', '$rjust', '$ljust', '$zone', '$to_s', '$[]', '$cweek_cyear', '$isdst', '$<=', '$!=', '$==', '$ceil']);
	  self.$require("corelib/comparable");
	  return (function($base, $super) {
	    function $Time(){};
	    var self = $Time = $klass($base, $super, 'Time', $Time);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    self.$include($scope.get('Comparable'));
	
	    
	    var days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
	        short_days   = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	        short_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	        long_months  = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	  ;
	
	    Opal.defs(self, '$at', function(seconds, frac) {
	      var self = this;
	
	      
	      var result;
	
	      if ($scope.get('Time')['$==='](seconds)) {
	        if (frac !== undefined) {
	          self.$raise($scope.get('TypeError'), "can't convert Time into an exact number")
	        }
	        result = new Date(seconds.getTime());
	        result.is_utc = seconds.is_utc;
	        return result;
	      }
	
	      if (!seconds.$$is_number) {
	        seconds = $scope.get('Opal')['$coerce_to!'](seconds, $scope.get('Integer'), "to_int");
	      }
	
	      if (frac === undefined) {
	        return new Date(seconds * 1000);
	      }
	
	      if (!frac.$$is_number) {
	        frac = $scope.get('Opal')['$coerce_to!'](frac, $scope.get('Integer'), "to_int");
	      }
	
	      return new Date(seconds * 1000 + (frac / 1000));
	    ;
	    });
	
	    
	    function time_params(year, month, day, hour, min, sec) {
	      if (year.$$is_string) {
	        year = parseInt(year, 10);
	      } else {
	        year = $scope.get('Opal')['$coerce_to!'](year, $scope.get('Integer'), "to_int");
	      }
	
	      if (month === nil) {
	        month = 1;
	      } else if (!month.$$is_number) {
	        if ((month)['$respond_to?']("to_str")) {
	          month = (month).$to_str();
	          switch (month.toLowerCase()) {
	          case 'jan': month =  1; break;
	          case 'feb': month =  2; break;
	          case 'mar': month =  3; break;
	          case 'apr': month =  4; break;
	          case 'may': month =  5; break;
	          case 'jun': month =  6; break;
	          case 'jul': month =  7; break;
	          case 'aug': month =  8; break;
	          case 'sep': month =  9; break;
	          case 'oct': month = 10; break;
	          case 'nov': month = 11; break;
	          case 'dec': month = 12; break;
	          default: month = (month).$to_i();
	          }
	        } else {
	          month = $scope.get('Opal')['$coerce_to!'](month, $scope.get('Integer'), "to_int");
	        }
	      }
	
	      if (month < 1 || month > 12) {
	        self.$raise($scope.get('ArgumentError'), "month out of range: " + (month))
	      }
	      month = month - 1;
	
	      if (day === nil) {
	        day = 1;
	      } else if (day.$$is_string) {
	        day = parseInt(day, 10);
	      } else {
	        day = $scope.get('Opal')['$coerce_to!'](day, $scope.get('Integer'), "to_int");
	      }
	
	      if (day < 1 || day > 31) {
	        self.$raise($scope.get('ArgumentError'), "day out of range: " + (day))
	      }
	
	      if (hour === nil) {
	        hour = 0;
	      } else if (hour.$$is_string) {
	        hour = parseInt(hour, 10);
	      } else {
	        hour = $scope.get('Opal')['$coerce_to!'](hour, $scope.get('Integer'), "to_int");
	      }
	
	      if (hour < 0 || hour > 24) {
	        self.$raise($scope.get('ArgumentError'), "hour out of range: " + (hour))
	      }
	
	      if (min === nil) {
	        min = 0;
	      } else if (min.$$is_string) {
	        min = parseInt(min, 10);
	      } else {
	        min = $scope.get('Opal')['$coerce_to!'](min, $scope.get('Integer'), "to_int");
	      }
	
	      if (min < 0 || min > 59) {
	        self.$raise($scope.get('ArgumentError'), "min out of range: " + (min))
	      }
	
	      if (sec === nil) {
	        sec = 0;
	      } else if (!sec.$$is_number) {
	        if (sec.$$is_string) {
	          sec = parseInt(sec, 10);
	        } else {
	          sec = $scope.get('Opal')['$coerce_to!'](sec, $scope.get('Integer'), "to_int");
	        }
	      }
	
	      if (sec < 0 || sec > 60) {
	        self.$raise($scope.get('ArgumentError'), "sec out of range: " + (sec))
	      }
	
	      return [year, month, day, hour, min, sec];
	    }
	  ;
	
	    Opal.defs(self, '$new', function(year, month, day, hour, min, sec, utc_offset) {
	      var self = this;
	
	      if (month == null) {
	        month = nil
	      }
	      if (day == null) {
	        day = nil
	      }
	      if (hour == null) {
	        hour = nil
	      }
	      if (min == null) {
	        min = nil
	      }
	      if (sec == null) {
	        sec = nil
	      }
	      if (utc_offset == null) {
	        utc_offset = nil
	      }
	      
	      var args, result;
	
	      if (year === undefined) {
	        return new Date();
	      }
	
	      if (utc_offset !== nil) {
	        self.$raise($scope.get('ArgumentError'), "Opal does not support explicitly specifying UTC offset for Time")
	      }
	
	      args  = time_params(year, month, day, hour, min, sec);
	      year  = args[0];
	      month = args[1];
	      day   = args[2];
	      hour  = args[3];
	      min   = args[4];
	      sec   = args[5];
	
	      result = new Date(year, month, day, hour, min, 0, sec * 1000);
	      if (year < 100) {
	        result.setFullYear(year);
	      }
	      return result;
	    
	    });
	
	    Opal.defs(self, '$local', function(year, month, day, hour, min, sec, millisecond, _dummy1, _dummy2, _dummy3) {
	      var self = this;
	
	      if (month == null) {
	        month = nil
	      }
	      if (day == null) {
	        day = nil
	      }
	      if (hour == null) {
	        hour = nil
	      }
	      if (min == null) {
	        min = nil
	      }
	      if (sec == null) {
	        sec = nil
	      }
	      if (millisecond == null) {
	        millisecond = nil
	      }
	      if (_dummy1 == null) {
	        _dummy1 = nil
	      }
	      if (_dummy2 == null) {
	        _dummy2 = nil
	      }
	      if (_dummy3 == null) {
	        _dummy3 = nil
	      }
	      
	      var args, result;
	
	      if (arguments.length === 10) {
	        args  = $slice.call(arguments);
	        year  = args[5];
	        month = args[4];
	        day   = args[3];
	        hour  = args[2];
	        min   = args[1];
	        sec   = args[0];
	      }
	
	      args  = time_params(year, month, day, hour, min, sec);
	      year  = args[0];
	      month = args[1];
	      day   = args[2];
	      hour  = args[3];
	      min   = args[4];
	      sec   = args[5];
	
	      result = new Date(year, month, day, hour, min, 0, sec * 1000);
	      if (year < 100) {
	        result.setFullYear(year);
	      }
	      return result;
	    
	    });
	
	    Opal.defs(self, '$gm', function(year, month, day, hour, min, sec, millisecond, _dummy1, _dummy2, _dummy3) {
	      var self = this;
	
	      if (month == null) {
	        month = nil
	      }
	      if (day == null) {
	        day = nil
	      }
	      if (hour == null) {
	        hour = nil
	      }
	      if (min == null) {
	        min = nil
	      }
	      if (sec == null) {
	        sec = nil
	      }
	      if (millisecond == null) {
	        millisecond = nil
	      }
	      if (_dummy1 == null) {
	        _dummy1 = nil
	      }
	      if (_dummy2 == null) {
	        _dummy2 = nil
	      }
	      if (_dummy3 == null) {
	        _dummy3 = nil
	      }
	      
	      var args, result;
	
	      if (arguments.length === 10) {
	        args  = $slice.call(arguments);
	        year  = args[5];
	        month = args[4];
	        day   = args[3];
	        hour  = args[2];
	        min   = args[1];
	        sec   = args[0];
	      }
	
	      args  = time_params(year, month, day, hour, min, sec);
	      year  = args[0];
	      month = args[1];
	      day   = args[2];
	      hour  = args[3];
	      min   = args[4];
	      sec   = args[5];
	
	      result = new Date(Date.UTC(year, month, day, hour, min, 0, sec * 1000));
	      if (year < 100) {
	        result.setUTCFullYear(year);
	      }
	      result.is_utc = true;
	      return result;
	    
	    });
	
	    (function(self) {
	      var $scope = self.$$scope, def = self.$$proto;
	
	      Opal.alias(self, 'mktime', 'local');
	      return Opal.alias(self, 'utc', 'gm');
	    })(Opal.get_singleton_class(self));
	
	    Opal.defs(self, '$now', function() {
	      var self = this;
	
	      return self.$new();
	    });
	
	    Opal.defn(self, '$+', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Time')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('TypeError'), "time + time?")};
	      
	      if (!other.$$is_number) {
	        other = $scope.get('Opal')['$coerce_to!'](other, $scope.get('Integer'), "to_int");
	      }
	      var result = new Date(self.getTime() + (other * 1000));
	      result.is_utc = self.is_utc;
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$-', function(other) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Time')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (self.getTime() - other.getTime()) / 1000};
	      
	      if (!other.$$is_number) {
	        other = $scope.get('Opal')['$coerce_to!'](other, $scope.get('Integer'), "to_int");
	      }
	      var result = new Date(self.getTime() - (other * 1000));
	      result.is_utc = self.is_utc;
	      return result;
	    ;
	    });
	
	    Opal.defn(self, '$<=>', function(other) {
	      var $a, self = this, r = nil;
	
	      if ((($a = $scope.get('Time')['$==='](other)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$to_f()['$<=>'](other.$to_f())
	        } else {
	        r = other['$<=>'](self);
	        if ((($a = r['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return nil
	        } else if ((($a = $rb_gt(r, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return -1
	        } else if ((($a = $rb_lt(r, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return 1
	          } else {
	          return 0
	        };
	      };
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return self.$to_f() === other.$to_f();
	    });
	
	    Opal.defn(self, '$asctime', function() {
	      var self = this;
	
	      return self.$strftime("%a %b %e %H:%M:%S %Y");
	    });
	
	    Opal.alias(self, 'ctime', 'asctime');
	
	    Opal.defn(self, '$day', function() {
	      var self = this;
	
	      return self.is_utc ? self.getUTCDate() : self.getDate();
	    });
	
	    Opal.defn(self, '$yday', function() {
	      var self = this, start_of_year = nil, start_of_day = nil, one_day = nil;
	
	      start_of_year = $scope.get('Time').$new(self.$year()).$to_i();
	      start_of_day = $scope.get('Time').$new(self.$year(), self.$month(), self.$day()).$to_i();
	      one_day = 86400;
	      return $rb_plus(($rb_divide(($rb_minus(start_of_day, start_of_year)), one_day)).$round(), 1);
	    });
	
	    Opal.defn(self, '$isdst', function() {
	      var self = this;
	
	      
	      var jan = new Date(self.getFullYear(), 0, 1),
	          jul = new Date(self.getFullYear(), 6, 1);
	      return self.getTimezoneOffset() < Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	    
	    });
	
	    Opal.alias(self, 'dst?', 'isdst');
	
	    Opal.defn(self, '$dup', function() {
	      var self = this, copy = nil;
	
	      copy = new Date(self.getTime());
	      copy.$copy_instance_variables(self);
	      copy.$initialize_dup(self);
	      return copy;
	    });
	
	    Opal.defn(self, '$eql?', function(other) {
	      var $a, self = this;
	
	      return ($a = other['$is_a?']($scope.get('Time')), $a !== false && $a !== nil ?(self['$<=>'](other))['$zero?']() : $a);
	    });
	
	    Opal.defn(self, '$friday?', function() {
	      var self = this;
	
	      return self.$wday() == 5;
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return 'Time:' + self.getTime();
	    });
	
	    Opal.defn(self, '$hour', function() {
	      var self = this;
	
	      return self.is_utc ? self.getUTCHours() : self.getHours();
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var $a, self = this;
	
	      if ((($a = self['$utc?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$strftime("%Y-%m-%d %H:%M:%S UTC")
	        } else {
	        return self.$strftime("%Y-%m-%d %H:%M:%S %z")
	      };
	    });
	
	    Opal.alias(self, 'mday', 'day');
	
	    Opal.defn(self, '$min', function() {
	      var self = this;
	
	      return self.is_utc ? self.getUTCMinutes() : self.getMinutes();
	    });
	
	    Opal.defn(self, '$mon', function() {
	      var self = this;
	
	      return (self.is_utc ? self.getUTCMonth() : self.getMonth()) + 1;
	    });
	
	    Opal.defn(self, '$monday?', function() {
	      var self = this;
	
	      return self.$wday() == 1;
	    });
	
	    Opal.alias(self, 'month', 'mon');
	
	    Opal.defn(self, '$saturday?', function() {
	      var self = this;
	
	      return self.$wday() == 6;
	    });
	
	    Opal.defn(self, '$sec', function() {
	      var self = this;
	
	      return self.is_utc ? self.getUTCSeconds() : self.getSeconds();
	    });
	
	    Opal.defn(self, '$succ', function() {
	      var self = this;
	
	      
	      var result = new Date(self.getTime() + 1000);
	      result.is_utc = self.is_utc;
	      return result;
	    
	    });
	
	    Opal.defn(self, '$usec', function() {
	      var self = this;
	
	      return self.getMilliseconds() * 1000;
	    });
	
	    Opal.defn(self, '$zone', function() {
	      var self = this;
	
	      
	      var string = self.toString(),
	          result;
	
	      if (string.indexOf('(') == -1) {
	        result = string.match(/[A-Z]{3,4}/)[0];
	      }
	      else {
	        result = string.match(/\([^)]+\)/)[0].match(/[A-Z]/g).join('');
	      }
	
	      if (result == "GMT" && /(GMT\W*\d{4})/.test(string)) {
	        return RegExp.$1;
	      }
	      else {
	        return result;
	      }
	    
	    });
	
	    Opal.defn(self, '$getgm', function() {
	      var self = this;
	
	      
	      var result = new Date(self.getTime());
	      result.is_utc = true;
	      return result;
	    
	    });
	
	    Opal.alias(self, 'getutc', 'getgm');
	
	    Opal.defn(self, '$gmtime', function() {
	      var self = this;
	
	      
	      self.is_utc = true;
	      return self;
	    
	    });
	
	    Opal.alias(self, 'utc', 'gmtime');
	
	    Opal.defn(self, '$gmt?', function() {
	      var self = this;
	
	      return self.is_utc === true;
	    });
	
	    Opal.defn(self, '$gmt_offset', function() {
	      var self = this;
	
	      return -self.getTimezoneOffset() * 60;
	    });
	
	    Opal.defn(self, '$strftime', function(format) {
	      var self = this;
	
	      
	      return format.replace(/%([\-_#^0]*:{0,2})(\d+)?([EO]*)(.)/g, function(full, flags, width, _, conv) {
	        var result = "",
	            zero   = flags.indexOf('0') !== -1,
	            pad    = flags.indexOf('-') === -1,
	            blank  = flags.indexOf('_') !== -1,
	            upcase = flags.indexOf('^') !== -1,
	            invert = flags.indexOf('#') !== -1,
	            colons = (flags.match(':') || []).length;
	
	        width = parseInt(width, 10);
	
	        if (zero && blank) {
	          if (flags.indexOf('0') < flags.indexOf('_')) {
	            zero = false;
	          }
	          else {
	            blank = false;
	          }
	        }
	
	        switch (conv) {
	          case 'Y':
	            result += self.$year();
	            break;
	
	          case 'C':
	            zero    = !blank;
	            result += Math.round(self.$year() / 100);
	            break;
	
	          case 'y':
	            zero    = !blank;
	            result += (self.$year() % 100);
	            break;
	
	          case 'm':
	            zero    = !blank;
	            result += self.$mon();
	            break;
	
	          case 'B':
	            result += long_months[self.$mon() - 1];
	            break;
	
	          case 'b':
	          case 'h':
	            blank   = !zero;
	            result += short_months[self.$mon() - 1];
	            break;
	
	          case 'd':
	            zero    = !blank
	            result += self.$day();
	            break;
	
	          case 'e':
	            blank   = !zero
	            result += self.$day();
	            break;
	
	          case 'j':
	            result += self.$yday();
	            break;
	
	          case 'H':
	            zero    = !blank;
	            result += self.$hour();
	            break;
	
	          case 'k':
	            blank   = !zero;
	            result += self.$hour();
	            break;
	
	          case 'I':
	            zero    = !blank;
	            result += (self.$hour() % 12 || 12);
	            break;
	
	          case 'l':
	            blank   = !zero;
	            result += (self.$hour() % 12 || 12);
	            break;
	
	          case 'P':
	            result += (self.$hour() >= 12 ? "pm" : "am");
	            break;
	
	          case 'p':
	            result += (self.$hour() >= 12 ? "PM" : "AM");
	            break;
	
	          case 'M':
	            zero    = !blank;
	            result += self.$min();
	            break;
	
	          case 'S':
	            zero    = !blank;
	            result += self.$sec()
	            break;
	
	          case 'L':
	            zero    = !blank;
	            width   = isNaN(width) ? 3 : width;
	            result += self.getMilliseconds();
	            break;
	
	          case 'N':
	            width   = isNaN(width) ? 9 : width;
	            result += (self.getMilliseconds().toString()).$rjust(3, "0");
	            result  = (result).$ljust(width, "0");
	            break;
	
	          case 'z':
	            var offset  = self.getTimezoneOffset(),
	                hours   = Math.floor(Math.abs(offset) / 60),
	                minutes = Math.abs(offset) % 60;
	
	            result += offset < 0 ? "+" : "-";
	            result += hours < 10 ? "0" : "";
	            result += hours;
	
	            if (colons > 0) {
	              result += ":";
	            }
	
	            result += minutes < 10 ? "0" : "";
	            result += minutes;
	
	            if (colons > 1) {
	              result += ":00";
	            }
	
	            break;
	
	          case 'Z':
	            result += self.$zone();
	            break;
	
	          case 'A':
	            result += days_of_week[self.$wday()];
	            break;
	
	          case 'a':
	            result += short_days[self.$wday()];
	            break;
	
	          case 'u':
	            result += (self.$wday() + 1);
	            break;
	
	          case 'w':
	            result += self.$wday();
	            break;
	
	          case 'V':
	            result += self.$cweek_cyear()['$[]'](0).$to_s().$rjust(2, "0");
	            break;
	
	          case 'G':
	            result += self.$cweek_cyear()['$[]'](1);
	            break;
	
	          case 'g':
	            result += self.$cweek_cyear()['$[]'](1)['$[]']($range(-2, -1, false));
	            break;
	
	          case 's':
	            result += self.$to_i();
	            break;
	
	          case 'n':
	            result += "\n";
	            break;
	
	          case 't':
	            result += "\t";
	            break;
	
	          case '%':
	            result += "%";
	            break;
	
	          case 'c':
	            result += self.$strftime("%a %b %e %T %Y");
	            break;
	
	          case 'D':
	          case 'x':
	            result += self.$strftime("%m/%d/%y");
	            break;
	
	          case 'F':
	            result += self.$strftime("%Y-%m-%d");
	            break;
	
	          case 'v':
	            result += self.$strftime("%e-%^b-%4Y");
	            break;
	
	          case 'r':
	            result += self.$strftime("%I:%M:%S %p");
	            break;
	
	          case 'R':
	            result += self.$strftime("%H:%M");
	            break;
	
	          case 'T':
	          case 'X':
	            result += self.$strftime("%H:%M:%S");
	            break;
	
	          default:
	            return full;
	        }
	
	        if (upcase) {
	          result = result.toUpperCase();
	        }
	
	        if (invert) {
	          result = result.replace(/[A-Z]/, function(c) { c.toLowerCase() }).
	                          replace(/[a-z]/, function(c) { c.toUpperCase() });
	        }
	
	        if (pad && (zero || blank)) {
	          result = (result).$rjust(isNaN(width) ? 2 : width, blank ? " " : "0");
	        }
	
	        return result;
	      });
	    
	    });
	
	    Opal.defn(self, '$sunday?', function() {
	      var self = this;
	
	      return self.$wday() == 0;
	    });
	
	    Opal.defn(self, '$thursday?', function() {
	      var self = this;
	
	      return self.$wday() == 4;
	    });
	
	    Opal.defn(self, '$to_a', function() {
	      var self = this;
	
	      return [self.$sec(), self.$min(), self.$hour(), self.$day(), self.$month(), self.$year(), self.$wday(), self.$yday(), self.$isdst(), self.$zone()];
	    });
	
	    Opal.defn(self, '$to_f', function() {
	      var self = this;
	
	      return self.getTime() / 1000;
	    });
	
	    Opal.defn(self, '$to_i', function() {
	      var self = this;
	
	      return parseInt(self.getTime() / 1000, 10);
	    });
	
	    Opal.alias(self, 'to_s', 'inspect');
	
	    Opal.defn(self, '$tuesday?', function() {
	      var self = this;
	
	      return self.$wday() == 2;
	    });
	
	    Opal.alias(self, 'tv_sec', 'sec');
	
	    Opal.alias(self, 'tv_usec', 'usec');
	
	    Opal.alias(self, 'utc?', 'gmt?');
	
	    Opal.alias(self, 'gmtoff', 'gmt_offset');
	
	    Opal.alias(self, 'utc_offset', 'gmt_offset');
	
	    Opal.defn(self, '$wday', function() {
	      var self = this;
	
	      return self.is_utc ? self.getUTCDay() : self.getDay();
	    });
	
	    Opal.defn(self, '$wednesday?', function() {
	      var self = this;
	
	      return self.$wday() == 3;
	    });
	
	    Opal.defn(self, '$year', function() {
	      var self = this;
	
	      return self.is_utc ? self.getUTCFullYear() : self.getFullYear();
	    });
	
	    return (Opal.defn(self, '$cweek_cyear', function() {
	      var $a, $b, self = this, jan01 = nil, jan01_wday = nil, first_monday = nil, year = nil, offset = nil, week = nil, dec31 = nil, dec31_wday = nil;
	
	      jan01 = $scope.get('Time').$new(self.$year(), 1, 1);
	      jan01_wday = jan01.$wday();
	      first_monday = 0;
	      year = self.$year();
	      if ((($a = ($b = $rb_le(jan01_wday, 4), $b !== false && $b !== nil ?jan01_wday['$!='](0) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        offset = $rb_minus(jan01_wday, 1)
	        } else {
	        offset = $rb_minus($rb_minus(jan01_wday, 7), 1);
	        if (offset['$=='](-8)) {
	          offset = -1};
	      };
	      week = ($rb_divide(($rb_plus(self.$yday(), offset)), 7.0)).$ceil();
	      if ((($a = $rb_le(week, 0)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return $scope.get('Time').$new($rb_minus(self.$year(), 1), 12, 31).$cweek_cyear()
	      } else if (week['$=='](53)) {
	        dec31 = $scope.get('Time').$new(self.$year(), 12, 31);
	        dec31_wday = dec31.$wday();
	        if ((($a = ($b = $rb_le(dec31_wday, 3), $b !== false && $b !== nil ?dec31_wday['$!='](0) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          week = 1;
	          year = $rb_plus(year, 1);};};
	      return [week, year];
	    }), nil) && 'cweek_cyear';
	  })($scope.base, Date);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/struct"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_lt(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs < rhs : lhs['$<'](rhs);
	  }
	  function $rb_ge(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
	  }
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$require', '$include', '$==', '$[]', '$upcase', '$const_set', '$new', '$unshift', '$each', '$define_struct_attribute', '$class_eval', '$to_proc', '$allocate', '$initialize', '$raise', '$<<', '$members', '$define_method', '$instance_eval', '$each_with_index', '$[]=', '$class', '$hash', '$===', '$<', '$-@', '$size', '$>=', '$coerce_to!', '$include?', '$to_sym', '$instance_of?', '$__id__', '$eql?', '$enum_for', '$length', '$map', '$+', '$join', '$inspect', '$each_pair', '$inject', '$flatten', '$to_a']);
	  self.$require("corelib/enumerable");
	  return (function($base, $super) {
	    function $Struct(){};
	    var self = $Struct = $klass($base, $super, 'Struct', $Struct);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_8, TMP_11;
	
	    self.$include($scope.get('Enumerable'));
	
	    Opal.defs(self, '$new', TMP_1 = function(name) {
	      var $a, $b, $c, TMP_2, self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil, $zuper = nil, $zuper_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_1.$$p = null;
	      $zuper = [];
	      for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	        $zuper[$zuper_index] = arguments[$zuper_index];
	      }
	      if (self['$==']($scope.get('Struct'))) {
	        } else {
	        return Opal.find_super_dispatcher(self, 'new', TMP_1, $iter, $Struct).apply(self, $zuper)
	      };
	      if (name['$[]'](0)['$=='](name['$[]'](0).$upcase())) {
	        return $scope.get('Struct').$const_set(name, ($a = self).$new.apply($a, Opal.to_a(args)))
	        } else {
	        args.$unshift(name);
	        return ($b = ($c = $scope.get('Class')).$new, $b.$$p = (TMP_2 = function(){var self = TMP_2.$$s || this, $a, $b, TMP_3, $c;
	
	        ($a = ($b = args).$each, $a.$$p = (TMP_3 = function(arg){var self = TMP_3.$$s || this;
	if (arg == null) arg = nil;
	          return self.$define_struct_attribute(arg)}, TMP_3.$$s = self, TMP_3), $a).call($b);
	          if (block !== false && block !== nil) {
	            ($a = ($c = self).$class_eval, $a.$$p = block.$to_proc(), $a).call($c)};
	          return (function(self) {
	            var $scope = self.$$scope, def = self.$$proto;
	
	            Opal.defn(self, '$new', function() {
	              var $a, self = this, instance = nil, $splat_index = nil;
	
	              var array_size = arguments.length - 0;
	              if(array_size < 0) array_size = 0;
	              var args = new Array(array_size);
	              for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	                args[$splat_index] = arguments[$splat_index + 0];
	              }
	              instance = self.$allocate();
	              instance.$$data = {};;
	              ($a = instance).$initialize.apply($a, Opal.to_a(args));
	              return instance;
	            });
	            return Opal.alias(self, '[]', 'new');
	          })(Opal.get_singleton_class(self));}, TMP_2.$$s = self, TMP_2), $b).call($c, self);
	      };
	    });
	
	    Opal.defs(self, '$define_struct_attribute', function(name) {
	      var $a, $b, TMP_4, $c, TMP_5, self = this;
	
	      if (self['$==']($scope.get('Struct'))) {
	        self.$raise($scope.get('ArgumentError'), "you cannot define attributes to the Struct class")};
	      self.$members()['$<<'](name);
	      ($a = ($b = self).$define_method, $a.$$p = (TMP_4 = function(){var self = TMP_4.$$s || this;
	
	      return self.$$data[name];}, TMP_4.$$s = self, TMP_4), $a).call($b, name);
	      return ($a = ($c = self).$define_method, $a.$$p = (TMP_5 = function(value){var self = TMP_5.$$s || this;
	if (value == null) value = nil;
	      return self.$$data[name] = value;}, TMP_5.$$s = self, TMP_5), $a).call($c, "" + (name) + "=");
	    });
	
	    Opal.defs(self, '$members', function() {
	      var $a, self = this;
	      if (self.members == null) self.members = nil;
	
	      if (self['$==']($scope.get('Struct'))) {
	        self.$raise($scope.get('ArgumentError'), "the Struct class has no members")};
	      return ((($a = self.members) !== false && $a !== nil) ? $a : self.members = []);
	    });
	
	    Opal.defs(self, '$inherited', function(klass) {
	      var $a, $b, TMP_6, self = this, members = nil;
	      if (self.members == null) self.members = nil;
	
	      members = self.members;
	      return ($a = ($b = klass).$instance_eval, $a.$$p = (TMP_6 = function(){var self = TMP_6.$$s || this;
	
	      return self.members = members}, TMP_6.$$s = self, TMP_6), $a).call($b);
	    });
	
	    Opal.defn(self, '$initialize', function() {
	      var $a, $b, TMP_7, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      return ($a = ($b = self.$members()).$each_with_index, $a.$$p = (TMP_7 = function(name, index){var self = TMP_7.$$s || this;
	if (name == null) name = nil;if (index == null) index = nil;
	      return self['$[]='](name, args['$[]'](index))}, TMP_7.$$s = self, TMP_7), $a).call($b);
	    });
	
	    Opal.defn(self, '$members', function() {
	      var self = this;
	
	      return self.$class().$members();
	    });
	
	    Opal.defn(self, '$hash', function() {
	      var self = this;
	
	      return $scope.get('Hash').$new(self.$$data).$hash();
	    });
	
	    Opal.defn(self, '$[]', function(name) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](name)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = $rb_lt(name, self.$members().$size()['$-@']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('IndexError'), "offset " + (name) + " too small for struct(size:" + (self.$members().$size()) + ")")};
	        if ((($a = $rb_ge(name, self.$members().$size())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('IndexError'), "offset " + (name) + " too large for struct(size:" + (self.$members().$size()) + ")")};
	        name = self.$members()['$[]'](name);
	      } else if ((($a = $scope.get('String')['$==='](name)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        
	        if(!self.$$data.hasOwnProperty(name)) {
	          self.$raise($scope.get('NameError').$new("no member '" + (name) + "' in struct", name))
	        }
	      ;
	        } else {
	        self.$raise($scope.get('TypeError'), "no implicit conversion of " + (name.$class()) + " into Integer")
	      };
	      name = $scope.get('Opal')['$coerce_to!'](name, $scope.get('String'), "to_str");
	      return self.$$data[name];
	    });
	
	    Opal.defn(self, '$[]=', function(name, value) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Integer')['$==='](name)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = $rb_lt(name, self.$members().$size()['$-@']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('IndexError'), "offset " + (name) + " too small for struct(size:" + (self.$members().$size()) + ")")};
	        if ((($a = $rb_ge(name, self.$members().$size())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$raise($scope.get('IndexError'), "offset " + (name) + " too large for struct(size:" + (self.$members().$size()) + ")")};
	        name = self.$members()['$[]'](name);
	      } else if ((($a = $scope.get('String')['$==='](name)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = self.$members()['$include?'](name.$to_sym())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          self.$raise($scope.get('NameError').$new("no member '" + (name) + "' in struct", name))
	        }
	        } else {
	        self.$raise($scope.get('TypeError'), "no implicit conversion of " + (name.$class()) + " into Integer")
	      };
	      name = $scope.get('Opal')['$coerce_to!'](name, $scope.get('String'), "to_str");
	      return self.$$data[name] = value;
	    });
	
	    Opal.defn(self, '$==', function(other) {
	      var $a, self = this;
	
	      if ((($a = other['$instance_of?'](self.$class())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return false
	      };
	      
	      var recursed1 = {}, recursed2 = {};
	
	      function _eqeq(struct, other) {
	        var key, a, b;
	
	        recursed1[(struct).$__id__()] = true;
	        recursed2[(other).$__id__()] = true;
	
	        for (key in struct.$$data) {
	          a = struct.$$data[key];
	          b = other.$$data[key];
	
	          if ($scope.get('Struct')['$==='](a)) {
	            if (!recursed1.hasOwnProperty((a).$__id__()) || !recursed2.hasOwnProperty((b).$__id__())) {
	              if (!_eqeq(a, b)) {
	                return false;
	              }
	            }
	          } else {
	            if (!(a)['$=='](b)) {
	              return false;
	            }
	          }
	        }
	
	        return true;
	      }
	
	      return _eqeq(self, other);
	    ;
	    });
	
	    Opal.defn(self, '$eql?', function(other) {
	      var $a, self = this;
	
	      if ((($a = other['$instance_of?'](self.$class())) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        return false
	      };
	      
	      var recursed1 = {}, recursed2 = {};
	
	      function _eqeq(struct, other) {
	        var key, a, b;
	
	        recursed1[(struct).$__id__()] = true;
	        recursed2[(other).$__id__()] = true;
	
	        for (key in struct.$$data) {
	          a = struct.$$data[key];
	          b = other.$$data[key];
	
	          if ($scope.get('Struct')['$==='](a)) {
	            if (!recursed1.hasOwnProperty((a).$__id__()) || !recursed2.hasOwnProperty((b).$__id__())) {
	              if (!_eqeq(a, b)) {
	                return false;
	              }
	            }
	          } else {
	            if (!(a)['$eql?'](b)) {
	              return false;
	            }
	          }
	        }
	
	        return true;
	      }
	
	      return _eqeq(self, other);
	    ;
	    });
	
	    Opal.defn(self, '$each', TMP_8 = function() {
	      var $a, $b, TMP_9, $c, TMP_10, self = this, $iter = TMP_8.$$p, $yield = $iter || nil;
	
	      TMP_8.$$p = null;
	      if (($yield !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_9 = function(){var self = TMP_9.$$s || this;
	
	        return self.$size()}, TMP_9.$$s = self, TMP_9), $a).call($b, "each")
	      };
	      ($a = ($c = self.$members()).$each, $a.$$p = (TMP_10 = function(name){var self = TMP_10.$$s || this, $a;
	if (name == null) name = nil;
	      return $a = Opal.yield1($yield, self['$[]'](name)), $a === $breaker ? $a : $a}, TMP_10.$$s = self, TMP_10), $a).call($c);
	      return self;
	    });
	
	    Opal.defn(self, '$each_pair', TMP_11 = function() {
	      var $a, $b, TMP_12, $c, TMP_13, self = this, $iter = TMP_11.$$p, $yield = $iter || nil;
	
	      TMP_11.$$p = null;
	      if (($yield !== nil)) {
	        } else {
	        return ($a = ($b = self).$enum_for, $a.$$p = (TMP_12 = function(){var self = TMP_12.$$s || this;
	
	        return self.$size()}, TMP_12.$$s = self, TMP_12), $a).call($b, "each_pair")
	      };
	      ($a = ($c = self.$members()).$each, $a.$$p = (TMP_13 = function(name){var self = TMP_13.$$s || this, $a;
	if (name == null) name = nil;
	      return $a = Opal.yield1($yield, [name, self['$[]'](name)]), $a === $breaker ? $a : $a}, TMP_13.$$s = self, TMP_13), $a).call($c);
	      return self;
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self.$members().$length();
	    });
	
	    Opal.alias(self, 'size', 'length');
	
	    Opal.defn(self, '$to_a', function() {
	      var $a, $b, TMP_14, self = this;
	
	      return ($a = ($b = self.$members()).$map, $a.$$p = (TMP_14 = function(name){var self = TMP_14.$$s || this;
	if (name == null) name = nil;
	      return self['$[]'](name)}, TMP_14.$$s = self, TMP_14), $a).call($b);
	    });
	
	    Opal.alias(self, 'values', 'to_a');
	
	    Opal.defn(self, '$inspect', function() {
	      var $a, $b, TMP_15, self = this, result = nil;
	
	      result = "#<struct ";
	      if (self.$class()['$==']($scope.get('Struct'))) {
	        result = $rb_plus(result, "" + (self.$class()) + " ")};
	      result = $rb_plus(result, ($a = ($b = self.$each_pair()).$map, $a.$$p = (TMP_15 = function(name, value){var self = TMP_15.$$s || this;
	if (name == null) name = nil;if (value == null) value = nil;
	      return "" + (name) + "=" + (value.$inspect())}, TMP_15.$$s = self, TMP_15), $a).call($b).$join(", "));
	      result = $rb_plus(result, ">");
	      return result;
	    });
	
	    Opal.alias(self, 'to_s', 'inspect');
	
	    Opal.defn(self, '$to_h', function() {
	      var $a, $b, TMP_16, self = this;
	
	      return ($a = ($b = self.$members()).$inject, $a.$$p = (TMP_16 = function(h, name){var self = TMP_16.$$s || this;
	if (h == null) h = nil;if (name == null) name = nil;
	      h['$[]='](name, self['$[]'](name));
	        return h;}, TMP_16.$$s = self, TMP_16), $a).call($b, $hash2([], {}));
	    });
	
	    return (Opal.defn(self, '$values_at', function() {
	      var $a, $b, TMP_17, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      args = ($a = ($b = args).$map, $a.$$p = (TMP_17 = function(arg){var self = TMP_17.$$s || this;
	if (arg == null) arg = nil;
	      return arg.$$is_range ? arg.$to_a() : arg;}, TMP_17.$$s = self, TMP_17), $a).call($b).$flatten();
	      
	      var result = [];
	      for (var i = 0, len = args.length; i < len; i++) {
	        if (!args[i].$$is_number) {
	          self.$raise($scope.get('TypeError'), "no implicit conversion of " + ((args[i]).$class()) + " into Integer")
	        }
	        result.push(self['$[]'](args[i]));
	      }
	      return result;
	    ;
	    }), nil) && 'values_at';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/io"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var $a, $b, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $module = Opal.module, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$attr_accessor', '$size', '$write', '$join', '$map', '$String', '$empty?', '$concat', '$chomp', '$getbyte', '$getc', '$raise', '$new', '$write_proc=', '$extend']);
	  (function($base, $super) {
	    function $IO(){};
	    var self = $IO = $klass($base, $super, 'IO', $IO);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.tty = def.closed = nil;
	    Opal.cdecl($scope, 'SEEK_SET', 0);
	
	    Opal.cdecl($scope, 'SEEK_CUR', 1);
	
	    Opal.cdecl($scope, 'SEEK_END', 2);
	
	    Opal.defn(self, '$tty?', function() {
	      var self = this;
	
	      return self.tty;
	    });
	
	    Opal.defn(self, '$closed?', function() {
	      var self = this;
	
	      return self.closed;
	    });
	
	    self.$attr_accessor("write_proc");
	
	    Opal.defn(self, '$write', function(string) {
	      var self = this;
	
	      self.write_proc(string);
	      return string.$size();
	    });
	
	    self.$attr_accessor("sync", "tty");
	
	    Opal.defn(self, '$flush', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    (function($base) {
	      var $Writable, self = $Writable = $module($base, 'Writable');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      Opal.defn(self, '$<<', function(string) {
	        var self = this;
	
	        self.$write(string);
	        return self;
	      });
	
	      Opal.defn(self, '$print', function() {
	        var $a, $b, TMP_1, self = this, $splat_index = nil;
	        if ($gvars[","] == null) $gvars[","] = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        self.$write(($a = ($b = args).$map, $a.$$p = (TMP_1 = function(arg){var self = TMP_1.$$s || this;
	if (arg == null) arg = nil;
	        return self.$String(arg)}, TMP_1.$$s = self, TMP_1), $a).call($b).$join($gvars[","]));
	        return nil;
	      });
	
	      Opal.defn(self, '$puts', function() {
	        var $a, $b, TMP_2, self = this, newline = nil, $splat_index = nil;
	        if ($gvars["/"] == null) $gvars["/"] = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        newline = $gvars["/"];
	        if ((($a = args['$empty?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self.$write($gvars["/"])
	          } else {
	          self.$write(($a = ($b = args).$map, $a.$$p = (TMP_2 = function(arg){var self = TMP_2.$$s || this;
	if (arg == null) arg = nil;
	          return self.$String(arg).$chomp()}, TMP_2.$$s = self, TMP_2), $a).call($b).$concat([nil]).$join(newline))
	        };
	        return nil;
	      });
	    })($scope.base);
	
	    return (function($base) {
	      var $Readable, self = $Readable = $module($base, 'Readable');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      Opal.defn(self, '$readbyte', function() {
	        var self = this;
	
	        return self.$getbyte();
	      });
	
	      Opal.defn(self, '$readchar', function() {
	        var self = this;
	
	        return self.$getc();
	      });
	
	      Opal.defn(self, '$readline', function(sep) {
	        var self = this;
	        if ($gvars["/"] == null) $gvars["/"] = nil;
	
	        if (sep == null) {
	          sep = $gvars["/"]
	        }
	        return self.$raise($scope.get('NotImplementedError'));
	      });
	
	      Opal.defn(self, '$readpartial', function(integer, outbuf) {
	        var self = this;
	
	        if (outbuf == null) {
	          outbuf = nil
	        }
	        return self.$raise($scope.get('NotImplementedError'));
	      });
	    })($scope.base);
	  })($scope.base, null);
	  Opal.cdecl($scope, 'STDERR', $gvars.stderr = $scope.get('IO').$new());
	  Opal.cdecl($scope, 'STDIN', $gvars.stdin = $scope.get('IO').$new());
	  Opal.cdecl($scope, 'STDOUT', $gvars.stdout = $scope.get('IO').$new());
	  (($a = [typeof(process) === 'object' ? function(s){process.stdout.write(s)} : function(s){console.log(s)}]), $b = $scope.get('STDOUT'), $b['$write_proc='].apply($b, $a), $a[$a.length-1]);
	  (($a = [typeof(process) === 'object' ? function(s){process.stderr.write(s)} : function(s){console.warn(s)}]), $b = $scope.get('STDERR'), $b['$write_proc='].apply($b, $a), $a[$a.length-1]);
	  $scope.get('STDOUT').$extend((($scope.get('IO')).$$scope.get('Writable')));
	  return $scope.get('STDERR').$extend((($scope.get('IO')).$$scope.get('Writable')));
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/main"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$include']);
	  Opal.defs(self, '$to_s', function() {
	    var self = this;
	
	    return "main";
	  });
	  return (Opal.defs(self, '$include', function(mod) {
	    var self = this;
	
	    return $scope.get('Object').$include(mod);
	  }), nil) && 'include';
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/dir"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$[]']);
	  return (function($base, $super) {
	    function $Dir(){};
	    var self = $Dir = $klass($base, $super, 'Dir', $Dir);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (function(self) {
	      var $scope = self.$$scope, def = self.$$proto, TMP_1;
	
	      Opal.defn(self, '$chdir', TMP_1 = function(dir) {
	        var $a, self = this, $iter = TMP_1.$$p, $yield = $iter || nil, prev_cwd = nil;
	
	        TMP_1.$$p = null;
	        try {
	        prev_cwd = Opal.current_dir;
	        Opal.current_dir = dir;
	        return $a = Opal.yieldX($yield, []), $a === $breaker ? $a : $a;
	        } finally {
	        Opal.current_dir = prev_cwd;
	        };
	      });
	      Opal.defn(self, '$pwd', function() {
	        var self = this;
	
	        return Opal.current_dir || '.';
	      });
	      Opal.alias(self, 'getwd', 'pwd');
	      return (Opal.defn(self, '$home', function() {
	        var $a, self = this;
	
	        return ((($a = $scope.get('ENV')['$[]']("HOME")) !== false && $a !== nil) ? $a : ".");
	      }), nil) && 'home';
	    })(Opal.get_singleton_class(self))
	  })($scope.base, null)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/file"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $range = Opal.range;
	
	  Opal.add_stubs(['$join', '$compact', '$split', '$==', '$first', '$[]=', '$home', '$each', '$pop', '$<<', '$[]', '$gsub', '$find', '$=~']);
	  return (function($base, $super) {
	    function $File(){};
	    var self = $File = $klass($base, $super, 'File', $File);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.cdecl($scope, 'Separator', Opal.cdecl($scope, 'SEPARATOR', "/"));
	
	    Opal.cdecl($scope, 'ALT_SEPARATOR', nil);
	
	    Opal.cdecl($scope, 'PATH_SEPARATOR', ":");
	
	    return (function(self) {
	      var $scope = self.$$scope, def = self.$$proto;
	
	      Opal.defn(self, '$expand_path', function(path, basedir) {
	        var $a, $b, TMP_1, self = this, parts = nil, new_parts = nil;
	
	        if (basedir == null) {
	          basedir = nil
	        }
	        path = [basedir, path].$compact().$join($scope.get('SEPARATOR'));
	        parts = path.$split($scope.get('SEPARATOR'));
	        new_parts = [];
	        if (parts.$first()['$==']("~")) {
	          parts['$[]='](0, $scope.get('Dir').$home())};
	        ($a = ($b = parts).$each, $a.$$p = (TMP_1 = function(part){var self = TMP_1.$$s || this;
	if (part == null) part = nil;
	        if (part['$==']("..")) {
	            return new_parts.$pop()
	            } else {
	            return new_parts['$<<'](part)
	          }}, TMP_1.$$s = self, TMP_1), $a).call($b);
	        return new_parts.$join($scope.get('SEPARATOR'));
	      });
	      Opal.alias(self, 'realpath', 'expand_path');
	      Opal.defn(self, '$dirname', function(path) {
	        var self = this;
	
	        return self.$split(path)['$[]']($range(0, -2, false));
	      });
	      Opal.defn(self, '$basename', function(path) {
	        var self = this;
	
	        return self.$split(path)['$[]'](-1);
	      });
	      Opal.defn(self, '$exist?', function(path) {
	        var self = this;
	
	        return Opal.modules[path] != null;
	      });
	      Opal.alias(self, 'exists?', 'exist?');
	      Opal.defn(self, '$directory?', function(path) {
	        var $a, $b, TMP_2, self = this, files = nil, file = nil;
	
	        files = [];
	        
	        for (var key in Opal.modules) {
	          files.push(key)
	        }
	      ;
	        path = path.$gsub((new RegExp("(^." + $scope.get('SEPARATOR') + "+|" + $scope.get('SEPARATOR') + "+$)")));
	        file = ($a = ($b = files).$find, $a.$$p = (TMP_2 = function(file){var self = TMP_2.$$s || this;
	if (file == null) file = nil;
	        return file['$=~']((new RegExp("^" + path)))}, TMP_2.$$s = self, TMP_2), $a).call($b);
	        return file;
	      });
	      Opal.defn(self, '$join', function() {
	        var self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var paths = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          paths[$splat_index] = arguments[$splat_index + 0];
	        }
	        return paths.$join($scope.get('SEPARATOR')).$gsub((new RegExp("" + $scope.get('SEPARATOR') + "+")), $scope.get('SEPARATOR'));
	      });
	      return (Opal.defn(self, '$split', function(path) {
	        var self = this;
	
	        return path.$split($scope.get('SEPARATOR'));
	      }), nil) && 'split';
	    })(Opal.get_singleton_class(self));
	  })($scope.base, $scope.get('IO'))
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/process"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$to_f', '$now', '$new']);
	  (function($base, $super) {
	    function $Process(){};
	    var self = $Process = $klass($base, $super, 'Process', $Process);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.cdecl($scope, 'CLOCK_REALTIME', 0);
	
	    Opal.cdecl($scope, 'CLOCK_MONOTONIC', 1);
	
	    Opal.defs(self, '$pid', function() {
	      var self = this;
	
	      return 0;
	    });
	
	    Opal.defs(self, '$times', function() {
	      var self = this, t = nil;
	
	      t = $scope.get('Time').$now().$to_f();
	      return (($scope.get('Benchmark')).$$scope.get('Tms')).$new(t, t, t, t, t);
	    });
	
	    return (Opal.defs(self, '$clock_gettime', function(clock_id, unit) {
	      var self = this;
	
	      if (unit == null) {
	        unit = nil
	      }
	      return $scope.get('Time').$now().$to_f();
	    }), nil) && 'clock_gettime';
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Signal(){};
	    var self = $Signal = $klass($base, $super, 'Signal', $Signal);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defs(self, '$trap', function() {
	      var self = this;
	
	      return nil;
	    }), nil) && 'trap'
	  })($scope.base, null);
	  return (function($base, $super) {
	    function $GC(){};
	    var self = $GC = $klass($base, $super, 'GC', $GC);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defs(self, '$start', function() {
	      var self = this;
	
	      return nil;
	    }), nil) && 'start'
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["corelib/unsupported"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $module = Opal.module;
	
	  Opal.add_stubs(['$warn', '$raise', '$%', '$module_function']);
	  
	  var warnings = {};
	
	  function warn(string) {
	    if (warnings[string]) {
	      return;
	    }
	
	    warnings[string] = true;
	    self.$warn(string);
	  }
	
	  (function($base, $super) {
	    function $String(){};
	    var self = $String = $klass($base, $super, 'String', $String);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    var ERROR = "String#%s not supported. Mutable String methods are not supported in Opal.";
	
	    Opal.defn(self, '$<<', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("<<"));
	    });
	
	    Opal.defn(self, '$capitalize!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("capitalize!"));
	    });
	
	    Opal.defn(self, '$chomp!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("chomp!"));
	    });
	
	    Opal.defn(self, '$chop!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("chop!"));
	    });
	
	    Opal.defn(self, '$downcase!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("downcase!"));
	    });
	
	    Opal.defn(self, '$gsub!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("gsub!"));
	    });
	
	    Opal.defn(self, '$lstrip!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("lstrip!"));
	    });
	
	    Opal.defn(self, '$next!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("next!"));
	    });
	
	    Opal.defn(self, '$reverse!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("reverse!"));
	    });
	
	    Opal.defn(self, '$slice!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("slice!"));
	    });
	
	    Opal.defn(self, '$squeeze!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("squeeze!"));
	    });
	
	    Opal.defn(self, '$strip!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("strip!"));
	    });
	
	    Opal.defn(self, '$sub!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("sub!"));
	    });
	
	    Opal.defn(self, '$succ!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("succ!"));
	    });
	
	    Opal.defn(self, '$swapcase!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("swapcase!"));
	    });
	
	    Opal.defn(self, '$tr!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("tr!"));
	    });
	
	    Opal.defn(self, '$tr_s!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("tr_s!"));
	    });
	
	    return (Opal.defn(self, '$upcase!', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), (ERROR)['$%']("upcase!"));
	    }), nil) && 'upcase!';
	  })($scope.base, null);
	  (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    var ERROR = "Object freezing is not supported by Opal";
	
	    Opal.defn(self, '$freeze', function() {
	      var $a, self = this;
	
	      if ((($a = OPAL_CONFIG.freezing) !== nil && (!$a.$$is_boolean || $a == true))) {
	        warn(ERROR);
	        } else {
	        self.$raise($scope.get('NotImplementedError'), ERROR)
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$frozen?', function() {
	      var $a, self = this;
	
	      if ((($a = OPAL_CONFIG.freezing) !== nil && (!$a.$$is_boolean || $a == true))) {
	        warn(ERROR);
	        } else {
	        self.$raise($scope.get('NotImplementedError'), ERROR)
	      };
	      return false;
	    });
	  })($scope.base);
	  (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    var ERROR = "Object tainting is not supported by Opal";
	
	    Opal.defn(self, '$taint', function() {
	      var $a, self = this;
	
	      if ((($a = OPAL_CONFIG.tainting) !== nil && (!$a.$$is_boolean || $a == true))) {
	        warn(ERROR);
	        } else {
	        self.$raise($scope.get('NotImplementedError'), ERROR)
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$untaint', function() {
	      var $a, self = this;
	
	      if ((($a = OPAL_CONFIG.tainting) !== nil && (!$a.$$is_boolean || $a == true))) {
	        warn(ERROR);
	        } else {
	        self.$raise($scope.get('NotImplementedError'), ERROR)
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$tainted?', function() {
	      var $a, self = this;
	
	      if ((($a = OPAL_CONFIG.tainting) !== nil && (!$a.$$is_boolean || $a == true))) {
	        warn(ERROR);
	        } else {
	        self.$raise($scope.get('NotImplementedError'), ERROR)
	      };
	      return false;
	    });
	  })($scope.base);
	  (function($base) {
	    var $Marshal, self = $Marshal = $module($base, 'Marshal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    var ERROR = "Marshalling is not supported by Opal";
	
	    self.$module_function();
	
	    Opal.defn(self, '$dump', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), ERROR);
	    });
	
	    Opal.defn(self, '$load', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), ERROR);
	    });
	
	    Opal.defn(self, '$restore', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), ERROR);
	    });
	  })($scope.base);
	  (function($base, $super) {
	    function $Module(){};
	    var self = $Module = $klass($base, $super, 'Module', $Module);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$public', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var methods = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        methods[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      if (methods.length === 0) {
	        self.$$module_function = false;
	      }
	
	      return nil;
	    
	    });
	
	    Opal.alias(self, 'private', 'public');
	
	    Opal.alias(self, 'protected', 'public');
	
	    Opal.alias(self, 'nesting', 'public');
	
	    Opal.defn(self, '$private_class_method', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.alias(self, 'public_class_method', 'private_class_method');
	
	    Opal.defn(self, '$private_method_defined?', function(obj) {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.defn(self, '$private_constant', function() {
	      var self = this;
	
	      return nil;
	    });
	
	    Opal.alias(self, 'protected_method_defined?', 'private_method_defined?');
	
	    Opal.alias(self, 'public_instance_methods', 'instance_methods');
	
	    return Opal.alias(self, 'public_method_defined?', 'method_defined?');
	  })($scope.base, null);
	  (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$private_methods', function() {
	      var self = this;
	
	      return [];
	    });
	
	    Opal.alias(self, 'private_instance_methods', 'private_methods');
	  })($scope.base);
	  return (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$eval', function() {
	      var self = this;
	
	      return self.$raise($scope.get('NotImplementedError'), "To use Kernel#eval, you must first require 'opal-parser'. " + ("See https://github.com/opal/opal/blob/" + ($scope.get('RUBY_ENGINE_VERSION')) + "/docs/opal_parser.md for details."));
	    })
	  })($scope.base);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require']);
	  self.$require("opal/base");
	  self.$require("opal/mini");
	  self.$require("corelib/array/inheritance");
	  self.$require("corelib/string/inheritance");
	  self.$require("corelib/string/encoding");
	  self.$require("corelib/math");
	  self.$require("corelib/complex");
	  self.$require("corelib/rational");
	  self.$require("corelib/time");
	  self.$require("corelib/struct");
	  self.$require("corelib/io");
	  self.$require("corelib/main");
	  self.$require("corelib/dir");
	  self.$require("corelib/file");
	  self.$require("corelib/process");
	  return self.$require("corelib/unsupported");
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["native"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  function $rb_ge(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs >= rhs : lhs['$>='](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $range = Opal.range, $hash2 = Opal.hash2, $klass = Opal.klass, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$try_convert', '$native?', '$respond_to?', '$to_n', '$raise', '$inspect', '$Native', '$proc', '$map!', '$end_with?', '$define_method', '$[]', '$convert', '$call', '$to_proc', '$new', '$each', '$native_reader', '$native_writer', '$extend', '$is_a?', '$map', '$alias_method', '$to_a', '$_Array', '$include', '$method_missing', '$bind', '$instance_method', '$[]=', '$slice', '$-', '$length', '$enum_for', '$===', '$>=', '$<<', '$each_pair', '$_initialize', '$name', '$exiting_mid', '$native_module']);
	  (function($base) {
	    var $Native, self = $Native = $module($base, 'Native');
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2;
	
	    Opal.defs(self, '$is_a?', function(object, klass) {
	      var self = this;
	
	      
	      try {
	        return object instanceof self.$try_convert(klass);
	      }
	      catch (e) {
	        return false;
	      }
	    ;
	    });
	
	    Opal.defs(self, '$try_convert', function(value) {
	      var self = this;
	
	      
	      if (self['$native?'](value)) {
	        return value;
	      }
	      else if (value['$respond_to?']("to_n")) {
	        return value.$to_n();
	      }
	      else {
	        return nil;
	      }
	    ;
	    });
	
	    Opal.defs(self, '$convert', function(value) {
	      var self = this;
	
	      
	      if (self['$native?'](value)) {
	        return value;
	      }
	      else if (value['$respond_to?']("to_n")) {
	        return value.$to_n();
	      }
	      else {
	        self.$raise($scope.get('ArgumentError'), "" + (value.$inspect()) + " isn't native");
	      }
	    ;
	    });
	
	    Opal.defs(self, '$call', TMP_1 = function(obj, key) {
	      var self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 2;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 2];
	      }
	      TMP_1.$$p = null;
	      
	      var prop = obj[key];
	
	      if (prop instanceof Function) {
	        var converted = new Array(args.length);
	
	        for (var i = 0, length = args.length; i < length; i++) {
	          var item = args[i],
	              conv = self.$try_convert(item);
	
	          converted[i] = conv === nil ? item : conv;
	        }
	
	        if (block !== nil) {
	          converted.push(block);
	        }
	
	        return self.$Native(prop.apply(obj, converted));
	      }
	      else {
	        return self.$Native(prop);
	      }
	    ;
	    });
	
	    Opal.defs(self, '$proc', TMP_2 = function() {
	      var $a, $b, TMP_3, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        self.$raise($scope.get('LocalJumpError'), "no block given")
	      };
	      return ($a = ($b = $scope.get('Kernel')).$proc, $a.$$p = (TMP_3 = function(args){var self = TMP_3.$$s || this, $a, $b, TMP_4, instance = nil;
	args = $slice.call(arguments, 0);
	      ($a = ($b = args)['$map!'], $a.$$p = (TMP_4 = function(arg){var self = TMP_4.$$s || this;
	if (arg == null) arg = nil;
	        return self.$Native(arg)}, TMP_4.$$s = self, TMP_4), $a).call($b);
	        instance = self.$Native(this);
	        
	        // if global is current scope, run the block in the scope it was defined
	        if (this === Opal.global) {
	          return block.apply(self, args);
	        }
	
	        var self_ = block.$$s;
	        block.$$s = null;
	
	        try {
	          return block.apply(instance, args);
	        }
	        finally {
	          block.$$s = self_;
	        }
	      ;}, TMP_3.$$s = self, TMP_3), $a).call($b);
	    });
	
	    (function($base) {
	      var $Helpers, self = $Helpers = $module($base, 'Helpers');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      Opal.defn(self, '$alias_native', function(new$, old, $kwargs) {
	        var $a, $b, TMP_5, $c, TMP_6, $d, TMP_7, self = this, as = nil;
	
	        if (old == null) {
	          old = new$
	        }
	        if (old == null) {
	          $kwargs = $hash2([], {});
	        }
	        else if (old.$$is_hash) {
	          $kwargs = old;
	          old = new$;
	        }
	        else if ($kwargs == null) {
	          $kwargs = $hash2([], {});
	        }
	        if (!$kwargs.$$is_hash) {
	          throw Opal.ArgumentError.$new('expecting keyword args');
	        }
	        if ((as = $kwargs.$$smap['as']) == null) {
	          as = nil
	        }
	        if ((($a = old['$end_with?']("=")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return ($a = ($b = self).$define_method, $a.$$p = (TMP_5 = function(value){var self = TMP_5.$$s || this;
	            if (self["native"] == null) self["native"] = nil;
	if (value == null) value = nil;
	          self["native"][old['$[]']($range(0, -2, false))] = $scope.get('Native').$convert(value);
	            return value;}, TMP_5.$$s = self, TMP_5), $a).call($b, new$)
	        } else if (as !== false && as !== nil) {
	          return ($a = ($c = self).$define_method, $a.$$p = (TMP_6 = function(args){var self = TMP_6.$$s || this, block, $a, $b, $c, value = nil;
	            if (self["native"] == null) self["native"] = nil;
	args = $slice.call(arguments, 0);
	            block = TMP_6.$$p || nil, TMP_6.$$p = null;
	          if ((($a = value = ($b = ($c = $scope.get('Native')).$call, $b.$$p = block.$to_proc(), $b).apply($c, [self["native"], old].concat(Opal.to_a(args)))) !== nil && (!$a.$$is_boolean || $a == true))) {
	              return as.$new(value.$to_n())
	              } else {
	              return nil
	            }}, TMP_6.$$s = self, TMP_6), $a).call($c, new$)
	          } else {
	          return ($a = ($d = self).$define_method, $a.$$p = (TMP_7 = function(args){var self = TMP_7.$$s || this, block, $a, $b;
	            if (self["native"] == null) self["native"] = nil;
	args = $slice.call(arguments, 0);
	            block = TMP_7.$$p || nil, TMP_7.$$p = null;
	          return ($a = ($b = $scope.get('Native')).$call, $a.$$p = block.$to_proc(), $a).apply($b, [self["native"], old].concat(Opal.to_a(args)))}, TMP_7.$$s = self, TMP_7), $a).call($d, new$)
	        };
	      });
	
	      Opal.defn(self, '$native_reader', function() {
	        var $a, $b, TMP_8, self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var names = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          names[$splat_index] = arguments[$splat_index + 0];
	        }
	        return ($a = ($b = names).$each, $a.$$p = (TMP_8 = function(name){var self = TMP_8.$$s || this, $a, $b, TMP_9;
	if (name == null) name = nil;
	        return ($a = ($b = self).$define_method, $a.$$p = (TMP_9 = function(){var self = TMP_9.$$s || this;
	            if (self["native"] == null) self["native"] = nil;
	
	          return self.$Native(self["native"][name])}, TMP_9.$$s = self, TMP_9), $a).call($b, name)}, TMP_8.$$s = self, TMP_8), $a).call($b);
	      });
	
	      Opal.defn(self, '$native_writer', function() {
	        var $a, $b, TMP_10, self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var names = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          names[$splat_index] = arguments[$splat_index + 0];
	        }
	        return ($a = ($b = names).$each, $a.$$p = (TMP_10 = function(name){var self = TMP_10.$$s || this, $a, $b, TMP_11;
	if (name == null) name = nil;
	        return ($a = ($b = self).$define_method, $a.$$p = (TMP_11 = function(value){var self = TMP_11.$$s || this;
	            if (self["native"] == null) self["native"] = nil;
	if (value == null) value = nil;
	          return self.$Native(self["native"][name] = value)}, TMP_11.$$s = self, TMP_11), $a).call($b, "" + (name) + "=")}, TMP_10.$$s = self, TMP_10), $a).call($b);
	      });
	
	      Opal.defn(self, '$native_accessor', function() {
	        var $a, $b, self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var names = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          names[$splat_index] = arguments[$splat_index + 0];
	        }
	        ($a = self).$native_reader.apply($a, Opal.to_a(names));
	        return ($b = self).$native_writer.apply($b, Opal.to_a(names));
	      });
	    })($scope.base);
	
	    Opal.defs(self, '$included', function(klass) {
	      var self = this;
	
	      return klass.$extend($scope.get('Helpers'));
	    });
	
	    Opal.defn(self, '$initialize', function(native$) {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Kernel')['$native?'](native$)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        } else {
	        $scope.get('Kernel').$raise($scope.get('ArgumentError'), "" + (native$.$inspect()) + " isn't native")
	      };
	      return self["native"] = native$;
	    });
	
	    Opal.defn(self, '$to_n', function() {
	      var self = this;
	      if (self["native"] == null) self["native"] = nil;
	
	      return self["native"];
	    });
	  })($scope.base);
	  (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_14;
	
	    Opal.defn(self, '$native?', function(value) {
	      var self = this;
	
	      return value == null || !value.$$class;
	    });
	
	    Opal.defn(self, '$Native', function(obj) {
	      var $a, $b, TMP_12, $c, TMP_13, self = this;
	
	      if ((($a = obj == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return nil
	      } else if ((($a = self['$native?'](obj)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (($scope.get('Native')).$$scope.get('Object')).$new(obj)
	      } else if ((($a = obj['$is_a?']($scope.get('Array'))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = ($b = obj).$map, $a.$$p = (TMP_12 = function(o){var self = TMP_12.$$s || this;
	if (o == null) o = nil;
	        return self.$Native(o)}, TMP_12.$$s = self, TMP_12), $a).call($b)
	      } else if ((($a = obj['$is_a?']($scope.get('Proc'))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = ($c = self).$proc, $a.$$p = (TMP_13 = function(args){var self = TMP_13.$$s || this, block, $a, $b;
	args = $slice.call(arguments, 0);
	          block = TMP_13.$$p || nil, TMP_13.$$p = null;
	        return self.$Native(($a = ($b = obj).$call, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args)))}, TMP_13.$$s = self, TMP_13), $a).call($c)
	        } else {
	        return obj
	      };
	    });
	
	    self.$alias_method("_Array", "Array");
	
	    Opal.defn(self, '$Array', TMP_14 = function(object) {
	      var $a, $b, self = this, $iter = TMP_14.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_14.$$p = null;
	      if ((($a = self['$native?'](object)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return ($a = ($b = (($scope.get('Native')).$$scope.get('Array'))).$new, $a.$$p = block.$to_proc(), $a).apply($b, [object].concat(Opal.to_a(args))).$to_a()};
	      return self.$_Array(object);
	    });
	  })($scope.base);
	  (function($base, $super) {
	    function $Object(){};
	    var self = $Object = $klass($base, $super, 'Object', $Object);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_15, TMP_16, TMP_17;
	
	    def["native"] = nil;
	    self.$include(Opal.get('Native'));
	
	    Opal.defn(self, '$==', function(other) {
	      var self = this;
	
	      return self["native"] === $scope.get('Native').$try_convert(other);
	    });
	
	    Opal.defn(self, '$has_key?', function(name) {
	      var self = this;
	
	      return Opal.hasOwnProperty.call(self["native"], name);
	    });
	
	    Opal.alias(self, 'key?', 'has_key?');
	
	    Opal.alias(self, 'include?', 'has_key?');
	
	    Opal.alias(self, 'member?', 'has_key?');
	
	    Opal.defn(self, '$each', TMP_15 = function() {
	      var $a, self = this, $iter = TMP_15.$$p, $yield = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      TMP_15.$$p = null;
	      if (($yield !== nil)) {
	        
	        for (var key in self["native"]) {
	          ((($a = Opal.yieldX($yield, [key, self["native"][key]])) === $breaker) ? $breaker.$v : $a)
	        }
	      ;
	        return self;
	        } else {
	        return ($a = self).$method_missing.apply($a, ["each"].concat(Opal.to_a(args)))
	      };
	    });
	
	    Opal.defn(self, '$[]', function(key) {
	      var self = this;
	
	      
	      var prop = self["native"][key];
	
	      if (prop instanceof Function) {
	        return prop;
	      }
	      else {
	        return Opal.get('Native').$call(self["native"], key)
	      }
	    ;
	    });
	
	    Opal.defn(self, '$[]=', function(key, value) {
	      var $a, self = this, native$ = nil;
	
	      native$ = $scope.get('Native').$try_convert(value);
	      if ((($a = native$ === nil) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self["native"][key] = value;
	        } else {
	        return self["native"][key] = native$;
	      };
	    });
	
	    Opal.defn(self, '$merge!', function(other) {
	      var self = this;
	
	      
	      other = $scope.get('Native').$convert(other);
	
	      for (var prop in other) {
	        self["native"][prop] = other[prop];
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$respond_to?', function(name, include_all) {
	      var self = this;
	
	      if (include_all == null) {
	        include_all = false
	      }
	      return $scope.get('Kernel').$instance_method("respond_to?").$bind(self).$call(name, include_all);
	    });
	
	    Opal.defn(self, '$respond_to_missing?', function(name, include_all) {
	      var self = this;
	
	      if (include_all == null) {
	        include_all = false
	      }
	      return Opal.hasOwnProperty.call(self["native"], name);
	    });
	
	    Opal.defn(self, '$method_missing', TMP_16 = function(mid) {
	      var $a, $b, self = this, $iter = TMP_16.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_16.$$p = null;
	      
	      if (mid.charAt(mid.length - 1) === '=') {
	        return self['$[]='](mid.$slice(0, $rb_minus(mid.$length(), 1)), args['$[]'](0));
	      }
	      else {
	        return ($a = ($b = Opal.get('Native')).$call, $a.$$p = block.$to_proc(), $a).apply($b, [self["native"], mid].concat(Opal.to_a(args)));
	      }
	    ;
	    });
	
	    Opal.defn(self, '$nil?', function() {
	      var self = this;
	
	      return false;
	    });
	
	    Opal.defn(self, '$is_a?', function(klass) {
	      var self = this;
	
	      return Opal.is_a(self, klass);
	    });
	
	    Opal.alias(self, 'kind_of?', 'is_a?');
	
	    Opal.defn(self, '$instance_of?', function(klass) {
	      var self = this;
	
	      return self.$$class === klass;
	    });
	
	    Opal.defn(self, '$class', function() {
	      var self = this;
	
	      return self.$$class;
	    });
	
	    Opal.defn(self, '$to_a', TMP_17 = function(options) {
	      var $a, $b, self = this, $iter = TMP_17.$$p, block = $iter || nil;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      TMP_17.$$p = null;
	      return ($a = ($b = (($scope.get('Native')).$$scope.get('Array'))).$new, $a.$$p = block.$to_proc(), $a).call($b, self["native"], options).$to_a();
	    });
	
	    return (Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return "#<Native:" + (String(self["native"])) + ">";
	    }), nil) && 'inspect';
	  })($scope.get('Native'), $scope.get('BasicObject'));
	  (function($base, $super) {
	    function $Array(){};
	    var self = $Array = $klass($base, $super, 'Array', $Array);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_18, TMP_19;
	
	    def.named = def["native"] = def.get = def.block = def.set = def.length = nil;
	    self.$include($scope.get('Native'));
	
	    self.$include($scope.get('Enumerable'));
	
	    Opal.defn(self, '$initialize', TMP_18 = function(native$, options) {
	      var $a, self = this, $iter = TMP_18.$$p, block = $iter || nil;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      TMP_18.$$p = null;
	      Opal.find_super_dispatcher(self, 'initialize', TMP_18, null).apply(self, [native$]);
	      self.get = ((($a = options['$[]']("get")) !== false && $a !== nil) ? $a : options['$[]']("access"));
	      self.named = options['$[]']("named");
	      self.set = ((($a = options['$[]']("set")) !== false && $a !== nil) ? $a : options['$[]']("access"));
	      self.length = ((($a = options['$[]']("length")) !== false && $a !== nil) ? $a : "length");
	      self.block = block;
	      if ((($a = self.$length() == null) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$raise($scope.get('ArgumentError'), "no length found on the array-like object")
	        } else {
	        return nil
	      };
	    });
	
	    Opal.defn(self, '$each', TMP_19 = function() {
	      var self = this, $iter = TMP_19.$$p, block = $iter || nil;
	
	      TMP_19.$$p = null;
	      if (block !== false && block !== nil) {
	        } else {
	        return self.$enum_for("each")
	      };
	      
	      for (var i = 0, length = self.$length(); i < length; i++) {
	        var value = Opal.yield1(block, self['$[]'](i));
	
	        if (value === $breaker) {
	          return $breaker.$v;
	        }
	      }
	    ;
	      return self;
	    });
	
	    Opal.defn(self, '$[]', function(index) {
	      var $a, self = this, result = nil, $case = nil;
	
	      result = (function() {$case = index;if ($scope.get('String')['$===']($case) || $scope.get('Symbol')['$===']($case)) {if ((($a = self.named) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self["native"][self.named](index);
	        } else {
	        return self["native"][index];
	      }}else if ($scope.get('Integer')['$===']($case)) {if ((($a = self.get) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self["native"][self.get](index);
	        } else {
	        return self["native"][index];
	      }}else { return nil }})();
	      if (result !== false && result !== nil) {
	        if ((($a = self.block) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self.block.$call(result)
	          } else {
	          return self.$Native(result)
	        }
	        } else {
	        return nil
	      };
	    });
	
	    Opal.defn(self, '$[]=', function(index, value) {
	      var $a, self = this;
	
	      if ((($a = self.set) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self["native"][self.set](index, $scope.get('Native').$convert(value));
	        } else {
	        return self["native"][index] = $scope.get('Native').$convert(value);
	      };
	    });
	
	    Opal.defn(self, '$last', function(count) {
	      var $a, $b, self = this, index = nil, result = nil;
	
	      if (count == null) {
	        count = nil
	      }
	      if (count !== false && count !== nil) {
	        index = $rb_minus(self.$length(), 1);
	        result = [];
	        while ((($b = $rb_ge(index, 0)) !== nil && (!$b.$$is_boolean || $b == true))) {
	        result['$<<'](self['$[]'](index));
	        index = $rb_minus(index, 1);};
	        return result;
	        } else {
	        return self['$[]']($rb_minus(self.$length(), 1))
	      };
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self["native"][self.length];
	    });
	
	    Opal.alias(self, 'to_ary', 'to_a');
	
	    return (Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      return self.$to_a().$inspect();
	    }), nil) && 'inspect';
	  })($scope.get('Native'), null);
	  (function($base, $super) {
	    function $Numeric(){};
	    var self = $Numeric = $klass($base, $super, 'Numeric', $Numeric);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self.valueOf();
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Proc(){};
	    var self = $Proc = $klass($base, $super, 'Proc', $Proc);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self;
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $String(){};
	    var self = $String = $klass($base, $super, 'String', $String);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self.valueOf();
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Regexp(){};
	    var self = $Regexp = $klass($base, $super, 'Regexp', $Regexp);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self.valueOf();
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $MatchData(){};
	    var self = $MatchData = $klass($base, $super, 'MatchData', $MatchData);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def.matches = nil;
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self.matches;
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Struct(){};
	    var self = $Struct = $klass($base, $super, 'Struct', $Struct);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var $a, $b, TMP_20, self = this, result = nil;
	
	      result = {};
	      ($a = ($b = self).$each_pair, $a.$$p = (TMP_20 = function(name, value){var self = TMP_20.$$s || this;
	if (name == null) name = nil;if (value == null) value = nil;
	      return result[name] = $scope.get('Native').$try_convert(value);}, TMP_20.$$s = self, TMP_20), $a).call($b);
	      return result;
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Array(){};
	    var self = $Array = $klass($base, $super, 'Array', $Array);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        var obj = self[i];
	
	        result.push($scope.get('Native').$try_convert(obj));
	      }
	
	      return result;
	    
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Boolean(){};
	    var self = $Boolean = $klass($base, $super, 'Boolean', $Boolean);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self.valueOf();
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Time(){};
	    var self = $Time = $klass($base, $super, 'Time', $Time);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self;
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $NilClass(){};
	    var self = $NilClass = $klass($base, $super, 'NilClass', $NilClass);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return null;
	    }), nil) && 'to_n'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Hash(){};
	    var self = $Hash = $klass($base, $super, 'Hash', $Hash);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_21;
	
	    self.$alias_method("_initialize", "initialize");
	
	    Opal.defn(self, '$initialize', TMP_21 = function(defaults) {
	      var $a, $b, self = this, $iter = TMP_21.$$p, block = $iter || nil;
	
	      TMP_21.$$p = null;
	      
	      if (defaults !== undefined && defaults.constructor === Object) {
	        var smap = self.$$smap,
	            keys = self.$$keys,
	            key, value;
	
	        for (key in defaults) {
	          value = defaults[key];
	
	          if (value && value.constructor === Object) {
	            smap[key] = $scope.get('Hash').$new(value);
	          } else if (value && value.$$is_array) {
	            value = value.map(function(item) {
	              if (item && item.constructor === Object) {
	                return $scope.get('Hash').$new(item);
	              }
	
	              return item;
	            });
	            smap[key] = value
	          } else {
	            smap[key] = self.$Native(value);
	          }
	
	          keys.push(key);
	        }
	
	        return self;
	      }
	
	      return ($a = ($b = self).$_initialize, $a.$$p = block.$to_proc(), $a).call($b, defaults);
	    
	    });
	
	    return (Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      
	      var result = {},
	          keys = self.$$keys,
	          smap = self.$$smap,
	          key, value;
	
	      for (var i = 0, length = keys.length; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = smap[key];
	        } else {
	          key = key.key;
	          value = key.value;
	        }
	
	        result[key] = $scope.get('Native').$try_convert(value);
	      }
	
	      return result;
	    
	    }), nil) && 'to_n';
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Module(){};
	    var self = $Module = $klass($base, $super, 'Module', $Module);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$native_module', function() {
	      var self = this;
	
	      return Opal.global[self.$name()] = self;
	    }), nil) && 'native_module'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Class(){};
	    var self = $Class = $klass($base, $super, 'Class', $Class);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$native_alias', function(new_jsid, existing_mid) {
	      var self = this;
	
	      
	      var aliased = self.$$proto['$' + existing_mid];
	      if (!aliased) {
	        self.$raise($scope.get('NameError').$new("undefined method `" + (existing_mid) + "' for class `" + (self.$inspect()) + "'", self.$exiting_mid()));
	      }
	      self.$$proto[new_jsid] = aliased;
	    ;
	    });
	
	    return (Opal.defn(self, '$native_class', function() {
	      var self = this;
	
	      self.$native_module();
	      self["new"] = self.$new;
	    }), nil) && 'native_class';
	  })($scope.base, null);
	  return $gvars.$ = $gvars.global = self.$Native(Opal.global);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/constants"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var $a, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require', '$raise']);
	  self.$require("native");
	  if ((($a = ($scope.JQUERY_CLASS != null)) !== nil && (!$a.$$is_boolean || $a == true))) {
	    return nil
	    } else {
	    return (function() {if ((($a = !!Opal.global.jQuery) !== nil && (!$a.$$is_boolean || $a == true))) {return Opal.cdecl($scope, 'JQUERY_CLASS', Opal.cdecl($scope, 'JQUERY_SELECTOR', Opal.global.jQuery))}else if ((($a = !!Opal.global.Zepto) !== nil && (!$a.$$is_boolean || $a == true))) {Opal.cdecl($scope, 'JQUERY_SELECTOR', Opal.global.Zepto);
	    return Opal.cdecl($scope, 'JQUERY_CLASS', Opal.global.Zepto.zepto.Z);}else {return self.$raise($scope.get('NameError'), "Can't find jQuery or Zepto. jQuery must be included before opal-jquery")}})()
	  };
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/element"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$to_n', '$include', '$each', '$alias_native', '$attr_reader', '$nil?', '$[]', '$[]=', '$raise', '$is_a?', '$has_key?', '$delete', '$call', '$gsub', '$upcase', '$compact', '$map', '$respond_to?', '$<<', '$Native', '$new']);
	  self.$require("native");
	  self.$require("opal/jquery/constants");
	  return (function($base, $super) {
	    function $Element(){};
	    var self = $Element = $klass($base, $super, 'Element', $Element);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_2, TMP_3, TMP_6, TMP_7, TMP_8;
	
	    var $ = $scope.get('JQUERY_SELECTOR').$to_n();
	
	    self.$include($scope.get('Enumerable'));
	
	    Opal.defs(self, '$find', function(selector) {
	      var self = this;
	
	      return $(selector);
	    });
	
	    Opal.defs(self, '$[]', function(selector) {
	      var self = this;
	
	      return $(selector);
	    });
	
	    Opal.defs(self, '$id', function(id) {
	      var self = this;
	
	      
	      var el = document.getElementById(id);
	
	      if (!el) {
	        return nil;
	      }
	
	      return $(el);
	    
	    });
	
	    Opal.defs(self, '$new', function(tag) {
	      var self = this;
	
	      if (tag == null) {
	        tag = "div"
	      }
	      return $(document.createElement(tag));
	    });
	
	    Opal.defs(self, '$parse', function(str) {
	      var self = this;
	
	      return $.parseHTML ? $($.parseHTML(str)) : $(str);
	    });
	
	    Opal.defs(self, '$expose', function() {
	      var $a, $b, TMP_1, self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var methods = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        methods[$splat_index] = arguments[$splat_index + 0];
	      }
	      return ($a = ($b = methods).$each, $a.$$p = (TMP_1 = function(method){var self = TMP_1.$$s || this;
	if (method == null) method = nil;
	      return self.$alias_native(method)}, TMP_1.$$s = self, TMP_1), $a).call($b);
	    });
	
	    self.$attr_reader("selector");
	
	    self.$alias_native("after");
	
	    self.$alias_native("before");
	
	    self.$alias_native("parent");
	
	    self.$alias_native("parents");
	
	    self.$alias_native("prev");
	
	    self.$alias_native("remove");
	
	    self.$alias_native("hide");
	
	    self.$alias_native("show");
	
	    self.$alias_native("toggle");
	
	    self.$alias_native("children");
	
	    self.$alias_native("blur");
	
	    self.$alias_native("closest");
	
	    self.$alias_native("detach");
	
	    self.$alias_native("focus");
	
	    self.$alias_native("find");
	
	    self.$alias_native("next");
	
	    self.$alias_native("siblings");
	
	    self.$alias_native("text");
	
	    self.$alias_native("trigger");
	
	    self.$alias_native("append");
	
	    self.$alias_native("prepend");
	
	    self.$alias_native("serialize");
	
	    self.$alias_native("is");
	
	    self.$alias_native("filter");
	
	    self.$alias_native("last");
	
	    self.$alias_native("wrap");
	
	    self.$alias_native("stop");
	
	    self.$alias_native("clone");
	
	    self.$alias_native("empty");
	
	    self.$alias_native("get");
	
	    self.$alias_native("prop");
	
	    Opal.alias(self, 'succ', 'next');
	
	    Opal.alias(self, '<<', 'append');
	
	    self.$alias_native("add_class", "addClass");
	
	    self.$alias_native("append_to", "appendTo");
	
	    self.$alias_native("has_class?", "hasClass");
	
	    self.$alias_native("html=", "html");
	
	    self.$alias_native("index");
	
	    self.$alias_native("is?", "is");
	
	    self.$alias_native("remove_attr", "removeAttr");
	
	    self.$alias_native("remove_class", "removeClass");
	
	    self.$alias_native("submit");
	
	    self.$alias_native("text=", "text");
	
	    self.$alias_native("toggle_class", "toggleClass");
	
	    self.$alias_native("value=", "val");
	
	    self.$alias_native("scroll_top=", "scrollTop");
	
	    self.$alias_native("scroll_top", "scrollTop");
	
	    self.$alias_native("scroll_left=", "scrollLeft");
	
	    self.$alias_native("scroll_left", "scrollLeft");
	
	    self.$alias_native("remove_attribute", "removeAttr");
	
	    self.$alias_native("slide_down", "slideDown");
	
	    self.$alias_native("slide_up", "slideUp");
	
	    self.$alias_native("slide_toggle", "slideToggle");
	
	    self.$alias_native("fade_toggle", "fadeToggle");
	
	    self.$alias_native("height=", "height");
	
	    self.$alias_native("width=", "width");
	
	    self.$alias_native("outer_width", "outerWidth");
	
	    self.$alias_native("outer_height", "outerHeight");
	
	    Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self;
	    });
	
	    Opal.defn(self, '$[]', function(name) {
	      var self = this;
	
	      
	      var value = self.attr(name);
	      if(value === undefined) return nil;
	      return value;
	    
	    });
	
	    Opal.defn(self, '$[]=', function(name, value) {
	      var $a, self = this;
	
	      if ((($a = value['$nil?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.removeAttr(name);};
	      return self.attr(name, value);
	    });
	
	    Opal.defn(self, '$attr', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var size = args.length;
	      switch (size) {
	      case 1:
	        return self['$[]'](args[0]);
	        break;
	      case 2:
	        return self['$[]='](args[0], args[1]);
	        break;
	      default:
	        self.$raise($scope.get('ArgumentError'), "#attr only accepts 1 or 2 arguments")
	      }
	    ;
	    });
	
	    Opal.defn(self, '$has_attribute?', function(name) {
	      var self = this;
	
	      return self.attr(name) !== undefined;
	    });
	
	    Opal.defn(self, '$append_to_body', function() {
	      var self = this;
	
	      return self.appendTo(document.body);
	    });
	
	    Opal.defn(self, '$append_to_head', function() {
	      var self = this;
	
	      return self.appendTo(document.head);
	    });
	
	    Opal.defn(self, '$at', function(index) {
	      var self = this;
	
	      
	      var length = self.length;
	
	      if (index < 0) {
	        index += length;
	      }
	
	      if (index < 0 || index >= length) {
	        return nil;
	      }
	
	      return $(self[index]);
	    
	    });
	
	    Opal.defn(self, '$class_name', function() {
	      var self = this;
	
	      
	      var first = self[0];
	      return (first && first.className) || "";
	    
	    });
	
	    Opal.defn(self, '$class_name=', function(name) {
	      var self = this;
	
	      
	      for (var i = 0, length = self.length; i < length; i++) {
	        self[i].className = name;
	      }
	    
	      return self;
	    });
	
	    Opal.defn(self, '$css', function(name, value) {
	      var $a, $b, self = this;
	
	      if (value == null) {
	        value = nil
	      }
	      if ((($a = ($b = value['$nil?'](), $b !== false && $b !== nil ?name['$is_a?']($scope.get('String')) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.css(name)
	      } else if ((($a = name['$is_a?']($scope.get('Hash'))) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.css(name.$to_n());
	        } else {
	        self.css(name, value);
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$animate', TMP_2 = function(params) {
	      var $a, self = this, $iter = TMP_2.$$p, block = $iter || nil, speed = nil;
	
	      TMP_2.$$p = null;
	      speed = (function() {if ((($a = params['$has_key?']("speed")) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return params.$delete("speed")
	        } else {
	        return 400
	      }; return nil; })();
	      
	      self.animate(params.$to_n(), speed, function() {
	        (function() {if ((block !== nil)) {
	        return block.$call()
	        } else {
	        return nil
	      }; return nil; })()
	      })
	    ;
	    });
	
	    Opal.defn(self, '$data', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 0];
	      }
	      
	      var result = self.data.apply(self, args);
	      return result == null ? nil : result;
	    
	    });
	
	    Opal.defn(self, '$effect', TMP_3 = function(name) {
	      var $a, $b, TMP_4, $c, TMP_5, self = this, $iter = TMP_3.$$p, block = $iter || nil, $splat_index = nil;
	
	      var array_size = arguments.length - 1;
	      if(array_size < 0) array_size = 0;
	      var args = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        args[$splat_index] = arguments[$splat_index + 1];
	      }
	      TMP_3.$$p = null;
	      name = ($a = ($b = name).$gsub, $a.$$p = (TMP_4 = function(match){var self = TMP_4.$$s || this;
	if (match == null) match = nil;
	      return match['$[]'](1).$upcase()}, TMP_4.$$s = self, TMP_4), $a).call($b, /_\w/);
	      args = ($a = ($c = args).$map, $a.$$p = (TMP_5 = function(a){var self = TMP_5.$$s || this, $a;
	if (a == null) a = nil;
	      if ((($a = a['$respond_to?']("to_n")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return a.$to_n()
	          } else {
	          return nil
	        }}, TMP_5.$$s = self, TMP_5), $a).call($c).$compact();
	      args['$<<'](function() { (function() {if ((block !== nil)) {
	        return block.$call()
	        } else {
	        return nil
	      }; return nil; })() });
	      return self[name].apply(self, args);
	    });
	
	    Opal.defn(self, '$visible?', function() {
	      var self = this;
	
	      return self.is(':visible');
	    });
	
	    Opal.defn(self, '$offset', function() {
	      var self = this;
	
	      return self.$Native(self.offset());
	    });
	
	    Opal.defn(self, '$each', TMP_6 = function() {
	      var self = this, $iter = TMP_6.$$p, $yield = $iter || nil;
	
	      TMP_6.$$p = null;
	      for (var i = 0, length = self.length; i < length; i++) {
	      if (Opal.yield1($yield, $(self[i])) === $breaker) return $breaker.$v;
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$first', function() {
	      var self = this;
	
	      return self.length ? self.first() : nil;
	    });
	
	    Opal.defn(self, '$html', function(content) {
	      var self = this;
	
	      
	      if (content != null) {
	        return self.html(content);
	      }
	
	      return self.html() || '';
	    
	    });
	
	    Opal.defn(self, '$id', function() {
	      var self = this;
	
	      
	      var first = self[0];
	      return (first && first.id) || "";
	    
	    });
	
	    Opal.defn(self, '$id=', function(id) {
	      var self = this;
	
	      
	      var first = self[0];
	
	      if (first) {
	        first.id = id;
	      }
	
	      return self;
	    
	    });
	
	    Opal.defn(self, '$tag_name', function() {
	      var self = this;
	
	      return self.length > 0 ? self[0].tagName.toLowerCase() : nil;
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var self = this;
	
	      
	      if      (self[0] === document) return '#<Element [document]>'
	      else if (self[0] === window  ) return '#<Element [window]>'
	
	      var val, el, str, result = [];
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        el  = self[i];
	        if (!el.tagName) { return '#<Element ['+el.toString()+']'; }
	
	        str = "<" + el.tagName.toLowerCase();
	
	        if (val = el.id) str += (' id="' + val + '"');
	        if (val = el.className) str += (' class="' + val + '"');
	
	        result.push(str + '>');
	      }
	
	      return '#<Element [' + result.join(', ') + ']>';
	    
	    });
	
	    Opal.defn(self, '$to_s', function() {
	      var self = this;
	
	      
	      var val, el, result = [];
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        el  = self[i];
	
	        result.push(el.outerHTML)
	      }
	
	      return result.join(', ');
	    
	    });
	
	    Opal.defn(self, '$length', function() {
	      var self = this;
	
	      return self.length;
	    });
	
	    Opal.defn(self, '$any?', function() {
	      var self = this;
	
	      return self.length > 0;
	    });
	
	    Opal.defn(self, '$empty?', function() {
	      var self = this;
	
	      return self.length === 0;
	    });
	
	    Opal.alias(self, 'empty?', 'none?');
	
	    Opal.defn(self, '$on', TMP_7 = function(name, sel) {
	      var self = this, $iter = TMP_7.$$p, block = $iter || nil;
	
	      if (sel == null) {
	        sel = nil
	      }
	      TMP_7.$$p = null;
	      
	      var wrapper = function(evt) {
	        if (evt.preventDefault) {
	          evt = $scope.get('Event').$new(evt);
	        }
	
	        return block.apply(null, arguments);
	      };
	
	      block._jq_wrap = wrapper;
	
	      if (sel == nil) {
	        self.on(name, wrapper);
	      }
	      else {
	        self.on(name, sel, wrapper);
	      }
	    ;
	      return block;
	    });
	
	    Opal.defn(self, '$one', TMP_8 = function(name, sel) {
	      var self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	      if (sel == null) {
	        sel = nil
	      }
	      TMP_8.$$p = null;
	      
	      var wrapper = function(evt) {
	        if (evt.preventDefault) {
	          evt = $scope.get('Event').$new(evt);
	        }
	
	        return block.apply(null, arguments);
	      };
	
	      block._jq_wrap = wrapper;
	
	      if (sel == nil) {
	        self.one(name, wrapper);
	      }
	      else {
	        self.one(name, sel, wrapper);
	      }
	    ;
	      return block;
	    });
	
	    Opal.defn(self, '$off', function(name, sel, block) {
	      var self = this;
	
	      if (block == null) {
	        block = nil
	      }
	      
	      if (sel == null) {
	        return self.off(name);
	      }
	      else if (block === nil) {
	        return self.off(name, sel._jq_wrap);
	      }
	      else {
	        return self.off(name, sel, block._jq_wrap);
	      }
	    
	    });
	
	    Opal.defn(self, '$serialize_array', function() {
	      var $a, $b, TMP_9, self = this;
	
	      return ($a = ($b = (self.serializeArray())).$map, $a.$$p = (TMP_9 = function(e){var self = TMP_9.$$s || this;
	if (e == null) e = nil;
	      return $scope.get('Hash').$new(e)}, TMP_9.$$s = self, TMP_9), $a).call($b);
	    });
	
	    Opal.alias(self, 'size', 'length');
	
	    Opal.defn(self, '$value', function() {
	      var self = this;
	
	      return self.val() || "";
	    });
	
	    Opal.defn(self, '$height', function() {
	      var self = this;
	
	      return self.height() || nil;
	    });
	
	    Opal.defn(self, '$width', function() {
	      var self = this;
	
	      return self.width() || nil;
	    });
	
	    return (Opal.defn(self, '$position', function() {
	      var self = this;
	
	      return self.$Native(self.position());
	    }), nil) && 'position';
	  })($scope.base, $scope.get('JQUERY_CLASS').$to_n());
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/window"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$require', '$include', '$find', '$on', '$to_proc', '$element', '$off', '$trigger', '$new']);
	  self.$require("opal/jquery/element");
	  (function($base) {
	    var $Browser, self = $Browser = $module($base, 'Browser');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base, $super) {
	      function $Window(){};
	      var self = $Window = $klass($base, $super, 'Window', $Window);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2;
	
	      def.element = nil;
	      self.$include($scope.get('Native'));
	
	      Opal.defn(self, '$element', function() {
	        var $a, self = this;
	
	        return ((($a = self.element) !== false && $a !== nil) ? $a : self.element = $scope.get('Element').$find(window));
	      });
	
	      Opal.defn(self, '$on', TMP_1 = function() {
	        var $a, $b, self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        TMP_1.$$p = null;
	        return ($a = ($b = self.$element()).$on, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	      });
	
	      Opal.defn(self, '$off', TMP_2 = function() {
	        var $a, $b, self = this, $iter = TMP_2.$$p, block = $iter || nil, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        TMP_2.$$p = null;
	        return ($a = ($b = self.$element()).$off, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args));
	      });
	
	      return (Opal.defn(self, '$trigger', function() {
	        var $a, self = this, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        return ($a = self.$element()).$trigger.apply($a, Opal.to_a(args));
	      }), nil) && 'trigger';
	    })($scope.base, null)
	  })($scope.base);
	  Opal.cdecl($scope, 'Window', (($scope.get('Browser')).$$scope.get('Window')).$new(window));
	  return $gvars.window = $scope.get('Window');
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/document"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $gvars = Opal.gvars;
	
	  Opal.add_stubs(['$require', '$to_n', '$call', '$new', '$ready?', '$resolve', '$module_function', '$find', '$extend']);
	  self.$require("opal/jquery/constants");
	  self.$require("opal/jquery/element");
	  (function($base) {
	    var $Browser, self = $Browser = $module($base, 'Browser');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $DocumentMethods, self = $DocumentMethods = $module($base, 'DocumentMethods');
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_1, $a, $b, TMP_3;
	
	      var $ = $scope.get('JQUERY_SELECTOR').$to_n();
	
	      Opal.defn(self, '$ready?', TMP_1 = function() {
	        var $a, $b, self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	        TMP_1.$$p = null;
	        if ((block !== nil)) {
	          if ((($a = (($b = Opal.cvars['@@__isReady']) == null ? nil : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return block.$call()
	            } else {
	            return $(block);
	          }
	          } else {
	          return nil
	        };
	      });
	
	      Opal.defn(self, '$ready', function() {
	        var $a, $b, TMP_2, self = this, promise = nil;
	
	        promise = $scope.get('Promise').$new();
	        ($a = ($b = $scope.get('Document'))['$ready?'], $a.$$p = (TMP_2 = function(){var self = TMP_2.$$s || this;
	
	        return promise.$resolve()}, TMP_2.$$s = self, TMP_2), $a).call($b);
	        return promise;
	      });
	
	      self.$module_function("ready?");
	
	      ($a = ($b = self)['$ready?'], $a.$$p = (TMP_3 = function(){var self = TMP_3.$$s || this;
	
	      return (Opal.cvars['@@__isReady'] = true)}, TMP_3.$$s = self, TMP_3), $a).call($b);
	
	      Opal.defn(self, '$title', function() {
	        var self = this;
	
	        return document.title;
	      });
	
	      Opal.defn(self, '$title=', function(title) {
	        var self = this;
	
	        return document.title = title;
	      });
	
	      Opal.defn(self, '$head', function() {
	        var self = this;
	
	        return $scope.get('Element').$find(document.head);
	      });
	
	      Opal.defn(self, '$body', function() {
	        var self = this;
	
	        return $scope.get('Element').$find(document.body);
	      });
	    })($scope.base)
	  })($scope.base);
	  Opal.cdecl($scope, 'Document', $scope.get('Element').$find(document));
	  $scope.get('Document').$extend((($scope.get('Browser')).$$scope.get('DocumentMethods')));
	  return $gvars.document = $scope.get('Document');
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/event"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$to_n', '$stop', '$prevent']);
	  self.$require("opal/jquery/constants");
	  return (function($base, $super) {
	    function $Event(){};
	    var self = $Event = $klass($base, $super, 'Event', $Event);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    def["native"] = nil;
	    var $ = $scope.get('JQUERY_SELECTOR').$to_n();
	
	    Opal.defn(self, '$initialize', function(native$) {
	      var self = this;
	
	      return self["native"] = native$;
	    });
	
	    Opal.defn(self, '$to_n', function() {
	      var self = this;
	
	      return self["native"];
	    });
	
	    Opal.defn(self, '$[]', function(name) {
	      var self = this;
	
	      return self["native"][name];
	    });
	
	    Opal.defn(self, '$type', function() {
	      var self = this;
	
	      return self["native"].type;
	    });
	
	    Opal.defn(self, '$element', function() {
	      var self = this;
	
	      return $(self["native"].currentTarget);
	    });
	
	    Opal.alias(self, 'current_target', 'element');
	
	    Opal.defn(self, '$target', function() {
	      var self = this;
	
	      return $(self["native"].target);
	    });
	
	    Opal.defn(self, '$prevented?', function() {
	      var self = this;
	
	      return self["native"].isDefaultPrevented();
	    });
	
	    Opal.defn(self, '$prevent', function() {
	      var self = this;
	
	      return self["native"].preventDefault();
	    });
	
	    Opal.defn(self, '$stopped?', function() {
	      var self = this;
	
	      return self["native"].isPropagationStopped();
	    });
	
	    Opal.defn(self, '$stop', function() {
	      var self = this;
	
	      return self["native"].stopPropagation();
	    });
	
	    Opal.defn(self, '$stop_immediate', function() {
	      var self = this;
	
	      return self["native"].stopImmediatePropagation();
	    });
	
	    Opal.defn(self, '$kill', function() {
	      var self = this;
	
	      self.$stop();
	      return self.$prevent();
	    });
	
	    Opal.defn(self, '$page_x', function() {
	      var self = this;
	
	      return self["native"].pageX;
	    });
	
	    Opal.defn(self, '$page_y', function() {
	      var self = this;
	
	      return self["native"].pageY;
	    });
	
	    Opal.defn(self, '$touch_x', function() {
	      var self = this;
	
	      return self["native"].originalEvent.touches[0].pageX;
	    });
	
	    Opal.defn(self, '$touch_y', function() {
	      var self = this;
	
	      return self["native"].originalEvent.touches[0].pageY;
	    });
	
	    Opal.defn(self, '$ctrl_key', function() {
	      var self = this;
	
	      return self["native"].ctrlKey;
	    });
	
	    Opal.defn(self, '$meta_key', function() {
	      var self = this;
	
	      return self["native"].metaKey;
	    });
	
	    Opal.defn(self, '$alt_key', function() {
	      var self = this;
	
	      return self["native"].altKey;
	    });
	
	    Opal.defn(self, '$shift_key', function() {
	      var self = this;
	
	      return self["native"].shiftKey;
	    });
	
	    Opal.defn(self, '$key_code', function() {
	      var self = this;
	
	      return self["native"].keyCode;
	    });
	
	    Opal.defn(self, '$which', function() {
	      var self = this;
	
	      return self["native"].which;
	    });
	
	    Opal.alias(self, 'default_prevented?', 'prevented?');
	
	    Opal.alias(self, 'prevent_default', 'prevent');
	
	    Opal.alias(self, 'propagation_stopped?', 'stopped?');
	
	    Opal.alias(self, 'stop_propagation', 'stop');
	
	    return Opal.alias(self, 'stop_immediate_propagation', 'stop_immediate');
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["json"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $hash2 = Opal.hash2, $klass = Opal.klass;
	
	  Opal.add_stubs(['$new', '$push', '$[]=', '$[]', '$create_id', '$json_create', '$attr_accessor', '$create_id=', '$===', '$parse', '$generate', '$from_object', '$merge', '$to_json', '$responds_to?', '$to_io', '$write', '$to_s', '$to_a', '$strftime']);
	  (function($base) {
	    var $JSON, self = $JSON = $module($base, 'JSON');
	
	    var def = self.$$proto, $scope = self.$$scope, $a, $b;
	
	    
	    var $parse  = JSON.parse,
	        $hasOwn = Opal.hasOwnProperty;
	
	    function to_opal(value, options) {
	      var klass, arr, hash, i, ii, k;
	
	      switch (typeof value) {
	        case 'string':
	          return value;
	
	        case 'number':
	          return value;
	
	        case 'boolean':
	          return !!value;
	
	        case 'null':
	          return nil;
	
	        case 'object':
	          if (!value) return nil;
	
	          if (value.$$is_array) {
	            arr = (options.array_class).$new();
	
	            for (i = 0, ii = value.length; i < ii; i++) {
	              (arr).$push(to_opal(value[i], options));
	            }
	
	            return arr;
	          }
	          else {
	            hash = (options.object_class).$new();
	
	            for (k in value) {
	              if ($hasOwn.call(value, k)) {
	                (hash)['$[]='](k, to_opal(value[k], options));
	              }
	            }
	
	            if (!options.parse && (klass = (hash)['$[]']($scope.get('JSON').$create_id())) != nil) {
	              klass = Opal.get(klass);
	              return (klass).$json_create(hash);
	            }
	            else {
	              return hash;
	            }
	          }
	        }
	    };
	  
	
	    (function(self) {
	      var $scope = self.$$scope, def = self.$$proto;
	
	      return self.$attr_accessor("create_id")
	    })(Opal.get_singleton_class(self));
	
	    (($a = ["json_class"]), $b = self, $b['$create_id='].apply($b, $a), $a[$a.length-1]);
	
	    Opal.defs(self, '$[]', function(value, options) {
	      var $a, self = this;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      if ((($a = $scope.get('String')['$==='](value)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.$parse(value, options)
	        } else {
	        return self.$generate(value, options)
	      };
	    });
	
	    Opal.defs(self, '$parse', function(source, options) {
	      var self = this;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      return self.$from_object($parse(source), options.$merge($hash2(["parse"], {"parse": true})));
	    });
	
	    Opal.defs(self, '$parse!', function(source, options) {
	      var self = this;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      return self.$parse(source, options);
	    });
	
	    Opal.defs(self, '$load', function(source, options) {
	      var self = this;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      return self.$from_object($parse(source), options);
	    });
	
	    Opal.defs(self, '$from_object', function(js_object, options) {
	      var $a, $b, $c, self = this;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      ($a = "object_class", $b = options, ((($c = $b['$[]']($a)) !== false && $c !== nil) ? $c : $b['$[]=']($a, $scope.get('Hash'))));
	      ($a = "array_class", $b = options, ((($c = $b['$[]']($a)) !== false && $c !== nil) ? $c : $b['$[]=']($a, $scope.get('Array'))));
	      return to_opal(js_object, options.$$smap);
	    });
	
	    Opal.defs(self, '$generate', function(obj, options) {
	      var self = this;
	
	      if (options == null) {
	        options = $hash2([], {})
	      }
	      return obj.$to_json(options);
	    });
	
	    Opal.defs(self, '$dump', function(obj, io, limit) {
	      var $a, self = this, string = nil;
	
	      if (io == null) {
	        io = nil
	      }
	      if (limit == null) {
	        limit = nil
	      }
	      string = self.$generate(obj);
	      if (io !== false && io !== nil) {
	        if ((($a = io['$responds_to?']("to_io")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          io = io.$to_io()};
	        io.$write(string);
	        return io;
	        } else {
	        return string
	      };
	    });
	  })($scope.base);
	  (function($base, $super) {
	    function $Object(){};
	    var self = $Object = $klass($base, $super, 'Object', $Object);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return self.$to_s().$to_json();
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  (function($base) {
	    var $Enumerable, self = $Enumerable = $module($base, 'Enumerable');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return self.$to_a().$to_json();
	    })
	  })($scope.base);
	  (function($base, $super) {
	    function $Array(){};
	    var self = $Array = $klass($base, $super, 'Array', $Array);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, length = self.length; i < length; i++) {
	        result.push((self[i]).$to_json());
	      }
	
	      return '[' + result.join(', ') + ']';
	    
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Boolean(){};
	    var self = $Boolean = $klass($base, $super, 'Boolean', $Boolean);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return (self == true) ? 'true' : 'false';
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Hash(){};
	    var self = $Hash = $klass($base, $super, 'Hash', $Hash);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      
	      var result = [];
	
	      for (var i = 0, keys = self.$$keys, length = keys.length, key, value; i < length; i++) {
	        key = keys[i];
	
	        if (key.$$is_string) {
	          value = self.$$smap[key];
	        } else {
	          value = key.value;
	          key = key.key;
	        }
	
	        result.push((key).$to_s().$to_json() + ':' + (value).$to_json());
	      }
	
	      return '{' + result.join(', ') + '}';
	    ;
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $NilClass(){};
	    var self = $NilClass = $klass($base, $super, 'NilClass', $NilClass);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return "null";
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Numeric(){};
	    var self = $Numeric = $klass($base, $super, 'Numeric', $Numeric);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return self.toString();
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  (function($base, $super) {
	    function $String(){};
	    var self = $String = $klass($base, $super, 'String', $String);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return Opal.alias(self, 'to_json', 'inspect')
	  })($scope.base, null);
	  (function($base, $super) {
	    function $Time(){};
	    var self = $Time = $klass($base, $super, 'Time', $Time);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    return (Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return self.$strftime("%FT%T%z").$to_json();
	    }), nil) && 'to_json'
	  })($scope.base, null);
	  return (function($base, $super) {
	    function $Date(){};
	    var self = $Date = $klass($base, $super, 'Date', $Date);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$to_json', function() {
	      var self = this;
	
	      return self.$to_s().$to_json();
	    });
	
	    return (Opal.defn(self, '$as_json', function() {
	      var self = this;
	
	      return self.$to_s();
	    }), nil) && 'as_json';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["promise"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  function $rb_plus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs + rhs : lhs['$+'](rhs);
	  }
	  function $rb_le(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs <= rhs : lhs['$<='](rhs);
	  }
	  function $rb_minus(lhs, rhs) {
	    return (typeof(lhs) === 'number' && typeof(rhs) === 'number') ? lhs - rhs : lhs['$-'](rhs);
	  }
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$resolve', '$new', '$reject', '$attr_reader', '$===', '$value', '$has_key?', '$keys', '$!', '$==', '$<<', '$>>', '$exception?', '$[]', '$resolved?', '$rejected?', '$error', '$include?', '$action', '$realized?', '$raise', '$^', '$call', '$resolve!', '$exception!', '$reject!', '$class', '$object_id', '$+', '$inspect', '$act?', '$nil?', '$prev', '$push', '$concat', '$it', '$lambda', '$reverse', '$pop', '$<=', '$length', '$shift', '$-', '$each', '$wait', '$then', '$to_proc', '$map', '$reduce', '$always', '$try', '$tap', '$all?', '$find']);
	  return (function($base, $super) {
	    function $Promise(){};
	    var self = $Promise = $klass($base, $super, 'Promise', $Promise);
	
	    var def = self.$$proto, $scope = self.$$scope, TMP_1, TMP_2, TMP_3, TMP_4;
	
	    def.value = def.action = def.exception = def.realized = def.delayed = def.error = def.prev = def.next = nil;
	    Opal.defs(self, '$value', function(value) {
	      var self = this;
	
	      return self.$new().$resolve(value);
	    });
	
	    Opal.defs(self, '$error', function(value) {
	      var self = this;
	
	      return self.$new().$reject(value);
	    });
	
	    Opal.defs(self, '$when', function() {
	      var self = this, $splat_index = nil;
	
	      var array_size = arguments.length - 0;
	      if(array_size < 0) array_size = 0;
	      var promises = new Array(array_size);
	      for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	        promises[$splat_index] = arguments[$splat_index + 0];
	      }
	      return $scope.get('When').$new(promises);
	    });
	
	    self.$attr_reader("error", "prev", "next");
	
	    Opal.defn(self, '$initialize', function(action) {
	      var self = this;
	
	      if (action == null) {
	        action = $hash2([], {})
	      }
	      self.action = action;
	      self.realized = false;
	      self.exception = false;
	      self.value = nil;
	      self.error = nil;
	      self.delayed = false;
	      self.prev = nil;
	      return self.next = nil;
	    });
	
	    Opal.defn(self, '$value', function() {
	      var $a, self = this;
	
	      if ((($a = $scope.get('Promise')['$==='](self.value)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.value.$value()
	        } else {
	        return self.value
	      };
	    });
	
	    Opal.defn(self, '$act?', function() {
	      var $a, self = this;
	
	      return ((($a = self.action['$has_key?']("success")) !== false && $a !== nil) ? $a : self.action['$has_key?']("always"));
	    });
	
	    Opal.defn(self, '$action', function() {
	      var self = this;
	
	      return self.action.$keys();
	    });
	
	    Opal.defn(self, '$exception?', function() {
	      var self = this;
	
	      return self.exception;
	    });
	
	    Opal.defn(self, '$realized?', function() {
	      var self = this;
	
	      return self.realized['$!']()['$!']();
	    });
	
	    Opal.defn(self, '$resolved?', function() {
	      var self = this;
	
	      return self.realized['$==']("resolve");
	    });
	
	    Opal.defn(self, '$rejected?', function() {
	      var self = this;
	
	      return self.realized['$==']("reject");
	    });
	
	    Opal.defn(self, '$^', function(promise) {
	      var self = this;
	
	      promise['$<<'](self);
	      self['$>>'](promise);
	      return promise;
	    });
	
	    Opal.defn(self, '$<<', function(promise) {
	      var self = this;
	
	      self.prev = promise;
	      return self;
	    });
	
	    Opal.defn(self, '$>>', function(promise) {
	      var $a, $b, $c, self = this;
	
	      self.next = promise;
	      if ((($a = self['$exception?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        promise.$reject(self.delayed['$[]'](0))
	      } else if ((($a = self['$resolved?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        promise.$resolve((function() {if ((($a = self.delayed) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return self.delayed['$[]'](0)
	          } else {
	          return self.$value()
	        }; return nil; })())
	      } else if ((($a = self['$rejected?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        if ((($a = ((($b = self.action['$has_key?']("failure")['$!']()) !== false && $b !== nil) ? $b : $scope.get('Promise')['$==='](((function() {if ((($c = self.delayed) !== nil && (!$c.$$is_boolean || $c == true))) {
	          return self.delayed['$[]'](0)
	          } else {
	          return self.error
	        }; return nil; })())))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          promise.$reject((function() {if ((($a = self.delayed) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return self.delayed['$[]'](0)
	            } else {
	            return self.$error()
	          }; return nil; })())
	        } else if ((($a = promise.$action()['$include?']("always")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          promise.$reject((function() {if ((($a = self.delayed) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return self.delayed['$[]'](0)
	            } else {
	            return self.$error()
	          }; return nil; })())}};
	      return self;
	    });
	
	    Opal.defn(self, '$resolve', function(value) {
	      var $a, $b, self = this, block = nil, e = nil;
	
	      if (value == null) {
	        value = nil
	      }
	      if ((($a = self['$realized?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "the promise has already been realized")};
	      if ((($a = $scope.get('Promise')['$==='](value)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (value['$<<'](self.prev))['$^'](self)};
	      try {
	      if ((($a = block = ((($b = self.action['$[]']("success")) !== false && $b !== nil) ? $b : self.action['$[]']("always"))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          value = block.$call(value)};
	        self['$resolve!'](value);
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('Exception')])) {e = $err;
	        try {
	          self['$exception!'](e)
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$resolve!', function(value) {
	      var $a, self = this;
	
	      self.realized = "resolve";
	      self.value = value;
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.next.$resolve(value)
	        } else {
	        return self.delayed = [value]
	      };
	    });
	
	    Opal.defn(self, '$reject', function(value) {
	      var $a, $b, self = this, block = nil, e = nil;
	
	      if (value == null) {
	        value = nil
	      }
	      if ((($a = self['$realized?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "the promise has already been realized")};
	      if ((($a = $scope.get('Promise')['$==='](value)) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return (value['$<<'](self.prev))['$^'](self)};
	      try {
	      if ((($a = block = ((($b = self.action['$[]']("failure")) !== false && $b !== nil) ? $b : self.action['$[]']("always"))) !== nil && (!$a.$$is_boolean || $a == true))) {
	          value = block.$call(value)};
	        if ((($a = self.action['$has_key?']("always")) !== nil && (!$a.$$is_boolean || $a == true))) {
	          self['$resolve!'](value)
	          } else {
	          self['$reject!'](value)
	        };
	      } catch ($err) {if (Opal.rescue($err, [$scope.get('Exception')])) {e = $err;
	        try {
	          self['$exception!'](e)
	        } finally {
	          Opal.gvars["!"] = Opal.exceptions.pop() || Opal.nil;
	        }
	        }else { throw $err; }
	      };
	      return self;
	    });
	
	    Opal.defn(self, '$reject!', function(value) {
	      var $a, self = this;
	
	      self.realized = "reject";
	      self.error = value;
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.next.$reject(value)
	        } else {
	        return self.delayed = [value]
	      };
	    });
	
	    Opal.defn(self, '$exception!', function(error) {
	      var self = this;
	
	      self.exception = true;
	      return self['$reject!'](error);
	    });
	
	    Opal.defn(self, '$then', TMP_1 = function() {
	      var $a, self = this, $iter = TMP_1.$$p, block = $iter || nil;
	
	      TMP_1.$$p = null;
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "a promise has already been chained")};
	      return self['$^']($scope.get('Promise').$new($hash2(["success"], {"success": block})));
	    });
	
	    Opal.alias(self, 'do', 'then');
	
	    Opal.defn(self, '$fail', TMP_2 = function() {
	      var $a, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	      TMP_2.$$p = null;
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "a promise has already been chained")};
	      return self['$^']($scope.get('Promise').$new($hash2(["failure"], {"failure": block})));
	    });
	
	    Opal.alias(self, 'rescue', 'fail');
	
	    Opal.alias(self, 'catch', 'fail');
	
	    Opal.defn(self, '$always', TMP_3 = function() {
	      var $a, self = this, $iter = TMP_3.$$p, block = $iter || nil;
	
	      TMP_3.$$p = null;
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "a promise has already been chained")};
	      return self['$^']($scope.get('Promise').$new($hash2(["always"], {"always": block})));
	    });
	
	    Opal.alias(self, 'finally', 'always');
	
	    Opal.alias(self, 'ensure', 'always');
	
	    Opal.defn(self, '$trace', TMP_4 = function(depth) {
	      var $a, self = this, $iter = TMP_4.$$p, block = $iter || nil;
	
	      if (depth == null) {
	        depth = nil
	      }
	      TMP_4.$$p = null;
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        self.$raise($scope.get('ArgumentError'), "a promise has already been chained")};
	      return self['$^']($scope.get('Trace').$new(depth, block));
	    });
	
	    Opal.defn(self, '$inspect', function() {
	      var $a, self = this, result = nil;
	
	      result = "#<" + (self.$class()) + "(" + (self.$object_id()) + ")";
	      if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	        result = $rb_plus(result, " >> " + (self.next.$inspect()))};
	      if ((($a = self['$realized?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	        result = $rb_plus(result, ": " + ((((($a = self.value) !== false && $a !== nil) ? $a : self.error)).$inspect()) + ">")
	        } else {
	        result = $rb_plus(result, ">")
	      };
	      return result;
	    });
	
	    (function($base, $super) {
	      function $Trace(){};
	      var self = $Trace = $klass($base, $super, 'Trace', $Trace);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_6;
	
	      Opal.defs(self, '$it', function(promise) {
	        var $a, $b, self = this, current = nil, prev = nil;
	
	        current = [];
	        if ((($a = ((($b = promise['$act?']()) !== false && $b !== nil) ? $b : promise.$prev()['$nil?']())) !== nil && (!$a.$$is_boolean || $a == true))) {
	          current.$push(promise.$value())};
	        if ((($a = prev = promise.$prev()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return current.$concat(self.$it(prev))
	          } else {
	          return current
	        };
	      });
	
	      return (Opal.defn(self, '$initialize', TMP_6 = function(depth, block) {
	        var $a, $b, TMP_5, self = this, $iter = TMP_6.$$p, $yield = $iter || nil;
	
	        TMP_6.$$p = null;
	        self.depth = depth;
	        return Opal.find_super_dispatcher(self, 'initialize', TMP_6, null).apply(self, [$hash2(["success"], {"success": ($a = ($b = self).$lambda, $a.$$p = (TMP_5 = function(){var self = TMP_5.$$s || this, $a, $b, trace = nil;
	
	        trace = $scope.get('Trace').$it(self).$reverse();
	          trace.$pop();
	          if ((($a = (($b = depth !== false && depth !== nil) ? $rb_le(depth, trace.$length()) : depth)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            trace.$shift($rb_minus(trace.$length(), depth))};
	          return ($a = block).$call.apply($a, Opal.to_a(trace));}, TMP_5.$$s = self, TMP_5), $a).call($b)})]);
	      }), nil) && 'initialize';
	    })($scope.base, self);
	
	    return (function($base, $super) {
	      function $When(){};
	      var self = $When = $klass($base, $super, 'When', $When);
	
	      var def = self.$$proto, $scope = self.$$scope, TMP_7, TMP_9, TMP_11, TMP_13, TMP_17;
	
	      def.wait = nil;
	      Opal.defn(self, '$initialize', TMP_7 = function(promises) {
	        var $a, $b, TMP_8, self = this, $iter = TMP_7.$$p, $yield = $iter || nil;
	
	        if (promises == null) {
	          promises = []
	        }
	        TMP_7.$$p = null;
	        Opal.find_super_dispatcher(self, 'initialize', TMP_7, null).apply(self, []);
	        self.wait = [];
	        return ($a = ($b = promises).$each, $a.$$p = (TMP_8 = function(promise){var self = TMP_8.$$s || this;
	if (promise == null) promise = nil;
	        return self.$wait(promise)}, TMP_8.$$s = self, TMP_8), $a).call($b);
	      });
	
	      Opal.defn(self, '$each', TMP_9 = function() {
	        var $a, $b, TMP_10, self = this, $iter = TMP_9.$$p, block = $iter || nil;
	
	        TMP_9.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "no block given")
	        };
	        return ($a = ($b = self).$then, $a.$$p = (TMP_10 = function(values){var self = TMP_10.$$s || this, $a, $b;
	if (values == null) values = nil;
	        return ($a = ($b = values).$each, $a.$$p = block.$to_proc(), $a).call($b)}, TMP_10.$$s = self, TMP_10), $a).call($b);
	      });
	
	      Opal.defn(self, '$collect', TMP_11 = function() {
	        var $a, $b, TMP_12, self = this, $iter = TMP_11.$$p, block = $iter || nil;
	
	        TMP_11.$$p = null;
	        if (block !== false && block !== nil) {
	          } else {
	          self.$raise($scope.get('ArgumentError'), "no block given")
	        };
	        return ($a = ($b = self).$then, $a.$$p = (TMP_12 = function(values){var self = TMP_12.$$s || this, $a, $b;
	if (values == null) values = nil;
	        return $scope.get('When').$new(($a = ($b = values).$map, $a.$$p = block.$to_proc(), $a).call($b))}, TMP_12.$$s = self, TMP_12), $a).call($b);
	      });
	
	      Opal.defn(self, '$inject', TMP_13 = function() {
	        var $a, $b, TMP_14, self = this, $iter = TMP_13.$$p, block = $iter || nil, $splat_index = nil;
	
	        var array_size = arguments.length - 0;
	        if(array_size < 0) array_size = 0;
	        var args = new Array(array_size);
	        for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	          args[$splat_index] = arguments[$splat_index + 0];
	        }
	        TMP_13.$$p = null;
	        return ($a = ($b = self).$then, $a.$$p = (TMP_14 = function(values){var self = TMP_14.$$s || this, $a, $b;
	if (values == null) values = nil;
	        return ($a = ($b = values).$reduce, $a.$$p = block.$to_proc(), $a).apply($b, Opal.to_a(args))}, TMP_14.$$s = self, TMP_14), $a).call($b);
	      });
	
	      Opal.alias(self, 'map', 'collect');
	
	      Opal.alias(self, 'reduce', 'inject');
	
	      Opal.defn(self, '$wait', function(promise) {
	        var $a, $b, TMP_15, self = this;
	
	        if ((($a = $scope.get('Promise')['$==='](promise)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          } else {
	          promise = $scope.get('Promise').$value(promise)
	        };
	        if ((($a = promise['$act?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          promise = promise.$then()};
	        self.wait['$<<'](promise);
	        ($a = ($b = promise).$always, $a.$$p = (TMP_15 = function(){var self = TMP_15.$$s || this, $a;
	          if (self.next == null) self.next = nil;
	
	        if ((($a = self.next) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return self.$try()
	            } else {
	            return nil
	          }}, TMP_15.$$s = self, TMP_15), $a).call($b);
	        return self;
	      });
	
	      Opal.alias(self, 'and', 'wait');
	
	      Opal.defn(self, '$>>', TMP_17 = function() {
	        var $a, $b, TMP_16, self = this, $iter = TMP_17.$$p, $yield = $iter || nil, $zuper = nil, $zuper_index = nil;
	
	        TMP_17.$$p = null;
	        $zuper = [];
	        for($zuper_index = 0; $zuper_index < arguments.length; $zuper_index++) {
	          $zuper[$zuper_index] = arguments[$zuper_index];
	        }
	        return ($a = ($b = Opal.find_super_dispatcher(self, '>>', TMP_17, $iter).apply(self, $zuper)).$tap, $a.$$p = (TMP_16 = function(){var self = TMP_16.$$s || this;
	
	        return self.$try()}, TMP_16.$$s = self, TMP_16), $a).call($b);
	      });
	
	      return (Opal.defn(self, '$try', function() {
	        var $a, $b, $c, $d, self = this, promise = nil;
	
	        if ((($a = ($b = ($c = self.wait)['$all?'], $b.$$p = "realized?".$to_proc(), $b).call($c)) !== nil && (!$a.$$is_boolean || $a == true))) {
	          if ((($a = promise = ($b = ($d = self.wait).$find, $b.$$p = "rejected?".$to_proc(), $b).call($d)) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return self.$reject(promise.$error())
	            } else {
	            return self.$resolve(($a = ($b = self.wait).$map, $a.$$p = "value".$to_proc(), $a).call($b))
	          }
	          } else {
	          return nil
	        };
	      }), nil) && 'try';
	    })($scope.base, self);
	  })($scope.base, null)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/http"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$require', '$to_n', '$each', '$define_singleton_method', '$send', '$new', '$define_method', '$attr_reader', '$delete', '$update', '$upcase', '$succeed', '$fail', '$promise', '$parse', '$private', '$tap', '$proc', '$ok?', '$resolve', '$reject', '$from_object', '$call']);
	  self.$require("json");
	  self.$require("native");
	  self.$require("promise");
	  self.$require("opal/jquery/constants");
	  return (function($base, $super) {
	    function $HTTP(){};
	    var self = $HTTP = $klass($base, $super, 'HTTP', $HTTP);
	
	    var def = self.$$proto, $scope = self.$$scope, $a, $b, TMP_1;
	
	    def.settings = def.payload = def.url = def.method = def.handler = def.json = def.body = def.ok = def.xhr = def.promise = def.status_code = nil;
	    var $ = $scope.get('JQUERY_SELECTOR').$to_n();
	
	    Opal.cdecl($scope, 'ACTIONS', ["get", "post", "put", "delete", "patch", "head"]);
	
	    ($a = ($b = $scope.get('ACTIONS')).$each, $a.$$p = (TMP_1 = function(action){var self = TMP_1.$$s || this, $a, $b, TMP_2, $c, TMP_3;
	if (action == null) action = nil;
	    ($a = ($b = self).$define_singleton_method, $a.$$p = (TMP_2 = function(url, options){var self = TMP_2.$$s || this, block;
	if (url == null) url = nil;if (options == null) options = $hash2([], {});
	        block = TMP_2.$$p || nil, TMP_2.$$p = null;
	      return self.$new().$send(action, url, options, block)}, TMP_2.$$s = self, TMP_2), $a).call($b, action);
	      return ($a = ($c = self).$define_method, $a.$$p = (TMP_3 = function(url, options){var self = TMP_3.$$s || this, block;
	if (url == null) url = nil;if (options == null) options = $hash2([], {});
	        block = TMP_3.$$p || nil, TMP_3.$$p = null;
	      return self.$send(action, url, options, block)}, TMP_3.$$s = self, TMP_3), $a).call($c, action);}, TMP_1.$$s = self, TMP_1), $a).call($b);
	
	    Opal.defs(self, '$setup', function() {
	      var self = this;
	
	      return $scope.get('Hash').$new($.ajaxSetup());
	    });
	
	    Opal.defs(self, '$setup=', function(settings) {
	      var self = this;
	
	      return $.ajaxSetup(settings.$to_n());
	    });
	
	    self.$attr_reader("body", "error_message", "method", "status_code", "url", "xhr");
	
	    Opal.defn(self, '$initialize', function() {
	      var self = this;
	
	      self.settings = $hash2([], {});
	      return self.ok = true;
	    });
	
	    Opal.defn(self, '$send', function(method, url, options, block) {
	      var $a, self = this, settings = nil, payload = nil;
	
	      self.method = method;
	      self.url = url;
	      self.payload = options.$delete("payload");
	      self.handler = block;
	      self.settings.$update(options);
	      $a = [self.settings.$to_n(), self.payload], settings = $a[0], payload = $a[1], $a;
	      
	      if (typeof(payload) === 'string') {
	        settings.data = payload;
	      }
	      else if (payload != nil) {
	        settings.data = payload.$to_json();
	        settings.contentType = 'application/json';
	      }
	
	      settings.url  = self.url;
	      settings.type = self.method.$upcase();
	
	      settings.success = function(data, status, xhr) {
	        return self.$succeed(data, status, xhr);
	      };
	
	      settings.error = function(xhr, status, error) {
	        return self.$fail(xhr, status, error);
	      };
	
	      $.ajax(settings);
	    ;
	      if ((($a = self.handler) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self
	        } else {
	        return self.$promise()
	      };
	    });
	
	    Opal.defn(self, '$json', function() {
	      var $a, self = this;
	
	      return ((($a = self.json) !== false && $a !== nil) ? $a : self.json = $scope.get('JSON').$parse(self.body));
	    });
	
	    Opal.defn(self, '$ok?', function() {
	      var self = this;
	
	      return self.ok;
	    });
	
	    Opal.defn(self, '$get_header', function(key) {
	      var self = this;
	
	      return self.xhr.getResponseHeader(key);;
	    });
	
	    self.$private();
	
	    Opal.defn(self, '$promise', function() {
	      var $a, $b, TMP_4, self = this;
	
	      if ((($a = self.promise) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.promise};
	      return self.promise = ($a = ($b = $scope.get('Promise').$new()).$tap, $a.$$p = (TMP_4 = function(promise){var self = TMP_4.$$s || this, $a, $b, TMP_5;
	if (promise == null) promise = nil;
	      return self.handler = ($a = ($b = self).$proc, $a.$$p = (TMP_5 = function(res){var self = TMP_5.$$s || this, $a;
	if (res == null) res = nil;
	        if ((($a = res['$ok?']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	            return promise.$resolve(res)
	            } else {
	            return promise.$reject(res)
	          }}, TMP_5.$$s = self, TMP_5), $a).call($b)}, TMP_4.$$s = self, TMP_4), $a).call($b);
	    });
	
	    Opal.defn(self, '$succeed', function(data, status, xhr) {
	      var $a, self = this;
	
	      
	      self.body = data;
	      self.xhr  = xhr;
	      self.status_code = xhr.status;
	
	      if (typeof(data) === 'object') {
	        self.json = $scope.get('JSON').$from_object(data);
	      }
	    ;
	      if ((($a = self.handler) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.handler.$call(self)
	        } else {
	        return nil
	      };
	    });
	
	    return (Opal.defn(self, '$fail', function(xhr, status, error) {
	      var $a, self = this;
	
	      
	      self.body = xhr.responseText;
	      self.xhr = xhr;
	      self.status_code = xhr.status;
	    ;
	      self.ok = false;
	      if ((($a = self.handler) !== nil && (!$a.$$is_boolean || $a == true))) {
	        return self.handler.$call(self)
	        } else {
	        return nil
	      };
	    }), nil) && 'fail';
	  })($scope.base, null);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery/kernel"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  return (function($base) {
	    var $Kernel, self = $Kernel = $module($base, 'Kernel');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    Opal.defn(self, '$alert', function(msg) {
	      var self = this;
	
	      alert(msg);
	      return nil;
	    })
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/jquery"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$==', '$require']);
	  if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	    self.$require("opal/jquery/window");
	    self.$require("opal/jquery/document");
	    self.$require("opal/jquery/element");
	    self.$require("opal/jquery/event");
	    self.$require("opal/jquery/http");
	    return self.$require("opal/jquery/kernel");}
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal-jquery"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require']);
	  return self.$require("opal/jquery")
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/connect/html"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass;
	
	  Opal.add_stubs(['$find', '$instance_of?', '$instance_eval', '$to_proc', '$<<', '$join', '$map', '$inspect', '$to_s', '$children', '$each', '$define_method', '$send', '$!', '$include?', '$respond_to?', '$scope', '$new', '$scope!', '$class', '$attr_accessor', '$instance_variable_set']);
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Connect, self = $Connect = $module($base, 'Connect');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      (function($base) {
	        var $HTML, self = $HTML = $module($base, 'HTML');
	
	        var def = self.$$proto, $scope = self.$$scope;
	
	        Opal.cdecl($scope, 'INDENT', "  ");
	
	        Opal.cdecl($scope, 'TAGS', ["a", "button", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
	
	        (function($base, $super) {
	          function $DSL(){};
	          var self = $DSL = $klass($base, $super, 'DSL', $DSL);
	
	          var def = self.$$proto, $scope = self.$$scope, TMP_1, $a, $b, TMP_5, TMP_7;
	
	          def.tag = def.attributes = def.attr_string = def.content = def.children = nil;
	          Opal.defn(self, '$initialize', TMP_1 = function(tag) {
	            var $a, $b, TMP_2, $c, TMP_3, $d, self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	            var array_size = arguments.length - 1;
	            if(array_size < 0) array_size = 0;
	            var args = new Array(array_size);
	            for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	              args[$splat_index] = arguments[$splat_index + 1];
	            }
	            TMP_1.$$p = null;
	            self.tag = tag;
	            self.content = ($a = ($b = args).$find, $a.$$p = (TMP_2 = function(a){var self = TMP_2.$$s || this;
	if (a == null) a = nil;
	            return a['$instance_of?']($scope.get('String'))}, TMP_2.$$s = self, TMP_2), $a).call($b);
	            self.attributes = ($a = ($c = args).$find, $a.$$p = (TMP_3 = function(a){var self = TMP_3.$$s || this;
	if (a == null) a = nil;
	            return a['$instance_of?']($scope.get('Hash'))}, TMP_3.$$s = self, TMP_3), $a).call($c);
	            self.attr_string = [];
	            if ((block !== nil)) {
	              return ($a = ($d = self).$instance_eval, $a.$$p = block.$to_proc(), $a).call($d)
	              } else {
	              return nil
	            };
	          });
	
	          Opal.defn(self, '$to_html', function() {
	            var $a, $b, TMP_4, $c, $d, self = this;
	
	            if ((($a = self.tag) !== nil && (!$a.$$is_boolean || $a == true))) {
	              if ((($a = self.attributes) !== nil && (!$a.$$is_boolean || $a == true))) {
	                self.attr_string['$<<'](" " + (($a = ($b = self.attributes).$map, $a.$$p = (TMP_4 = function(k, v){var self = TMP_4.$$s || this;
	if (k == null) k = nil;if (v == null) v = nil;
	                return "" + (k) + "=" + (v.$to_s().$inspect())}, TMP_4.$$s = self, TMP_4), $a).call($b).$join(" ")))};
	              return "<" + (self.tag) + (self.attr_string.$join()) + ">" + (self.content) + (($a = ($c = self.$children()).$map, $a.$$p = "to_html".$to_proc(), $a).call($c).$join()) + "</" + (self.tag) + ">";
	              } else {
	              return "" + (self.content) + (($a = ($d = self.$children()).$map, $a.$$p = "to_html".$to_proc(), $a).call($d).$join())
	            };
	          });
	
	          Opal.defn(self, '$children', function() {
	            var $a, self = this;
	
	            return ((($a = self.children) !== false && $a !== nil) ? $a : self.children = []);
	          });
	
	          ($a = ($b = ["p", "select"]).$each, $a.$$p = (TMP_5 = function(name){var self = TMP_5.$$s || this, $a, $b, TMP_6;
	if (name == null) name = nil;
	          return ($a = ($b = self).$define_method, $a.$$p = (TMP_6 = function(args){var self = TMP_6.$$s || this, block, $a, $b;
	args = $slice.call(arguments, 0);
	              block = TMP_6.$$p || nil, TMP_6.$$p = null;
	            return ($a = ($b = self).$send, $a.$$p = block.$to_proc(), $a).apply($b, ["method_missing", name].concat(Opal.to_a(args)))}, TMP_6.$$s = self, TMP_6), $a).call($b, name)}, TMP_5.$$s = self, TMP_5), $a).call($b);
	
	          Opal.defn(self, '$method_missing', TMP_7 = function(tag) {
	            var $a, $b, $c, self = this, $iter = TMP_7.$$p, block = $iter || nil, child = nil, $splat_index = nil;
	
	            var array_size = arguments.length - 1;
	            if(array_size < 0) array_size = 0;
	            var args = new Array(array_size);
	            for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	              args[$splat_index] = arguments[$splat_index + 1];
	            }
	            TMP_7.$$p = null;
	            if ((($a = ($b = $scope.get('TAGS')['$include?'](tag.$to_s())['$!'](), $b !== false && $b !== nil ?self.$scope()['$respond_to?'](tag, true) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	              return ($a = ($b = self.$scope()).$send, $a.$$p = block.$to_proc(), $a).apply($b, [tag].concat(Opal.to_a(args)))
	              } else {
	              child = ($a = ($c = $scope.get('DSL')['$scope!'](self.$scope())).$new, $a.$$p = block.$to_proc(), $a).apply($c, [tag.$to_s()].concat(Opal.to_a(args)));
	              self.$children()['$<<'](child);
	              return child;
	            };
	          });
	
	          Opal.defn(self, '$scope', function() {
	            var self = this;
	
	            return self.$class().$scope();
	          });
	
	          return (function(self) {
	            var $scope = self.$$scope, def = self.$$proto, TMP_8;
	
	            self.$attr_accessor("scope");
	            Opal.defn(self, '$html', TMP_8 = function() {
	              var $a, $b, self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	              TMP_8.$$p = null;
	              return ($a = ($b = $scope.get('DSL')['$scope!'](self.$scope())).$new, $a.$$p = block.$to_proc(), $a).call($b, nil, nil);
	            });
	            return (Opal.defn(self, '$scope!', function(scope) {
	              var self = this, klass = nil;
	
	              klass = $scope.get('Class').$new(self);
	              klass.$instance_variable_set("@scope", scope);
	              return klass;
	            }), nil) && 'scope!';
	          })(Opal.get_singleton_class(self));
	        })($scope.base, null);
	      })($scope.base)
	    })($scope.base)
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/connect/cache"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$!=', '$==', '$[]', '$[]=']);
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Connect, self = $Connect = $module($base, 'Connect');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      (function($base, $super) {
	        function $Cache(){};
	        var self = $Cache = $klass($base, $super, 'Cache', $Cache);
	
	        var def = self.$$proto, $scope = self.$$scope;
	
	        def.hash = nil;
	        Opal.defn(self, '$initialize', function(options) {
	          var $a, self = this;
	
	          if (options == null) {
	            options = $hash2([], {})
	          }
	          if ((($a = $scope.get('RUBY_ENGINE')['$!=']("opal")) !== nil && (!$a.$$is_boolean || $a == true))) {};
	          return self.hash = options;
	        });
	
	        Opal.defn(self, '$[]', function(key) {
	          var self = this;
	
	          if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	            return self.hash['$[]'](key)};
	        });
	
	        return (Opal.defn(self, '$[]=', function(key, value) {
	          var self = this;
	
	          if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	            return self.hash['$[]='](key, value)};
	        }), nil) && '[]=';
	      })($scope.base, null)
	    })($scope.base)
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["base64"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  return (function($base) {
	    var $Base64, self = $Base64 = $module($base, 'Base64');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    
	    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	        lookup  = {};
	
	    for (var i = 0, length = charset.length; i < length; i++) {
	      lookup[charset.charAt(i)] = i;
	    }
	
	    function from(string) {
	      var buffer = [];
	
	      for (var i = 0, length = string.length; i < length; i++) {
	        var a, b, c, d;
	
	        a = lookup[string.charAt(i)];
	        b = lookup[string.charAt(++i)];
	
	        buffer.push((a << 2) | (b >> 4));
	
	        c = lookup[string.charAt(++i)];
	
	        if (c == 64) {
	          break;
	        }
	
	        buffer.push(((b & 15) << 4) | (c >> 2));
	
	        d = lookup[string.charAt(++i)];
	
	        if (d == 64) {
	          break;
	        }
	
	        buffer.push(((c & 3) << 6) | d);
	      }
	
	      return buffer;
	    }
	
	    function decode(string) {
	      var buffer = from(string),
	          result = [], a, b, c;
	
	      for (var i = 0, length = buffer.length; i < length; i++) {
	        if (buffer[i] < 128) {
	          result.push(String.fromCharCode(buffer[i]));
	        }
	        else if (buffer[i] > 191 && buffer[i] < 224) {
	          a = (buffer[i] & 31) << 6;
	          b = buffer[++i] & 63;
	
	          result.push(String.fromCharCode(a | b));
	        }
	        else {
	          a = (buffer[i] & 15) << 12;
	          b = (buffer[++i] & 63) << 6;
	          c = buffer[++i] & 63;
	
	          result.push(String.fromCharCode(a | b | c));
	        }
	      }
	
	      return result.join('');
	    }
	
	    function to(string) {
	      var buffer = [], i, length;
	
	      if (/^[\x00-\x7f]*$/.test(string)) {
	        for (i = 0, length = string.length; i < length; i++) {
	          buffer.push(string.charCodeAt(i));
	        }
	      }
	      else {
	        for (i = 0, length = string.length; i < length; i++) {
	          var ch = string.charCodeAt(i);
	
	          if (ch < 128) {
	            buffer.push(ch);
	          }
	          else if (ch < 2048) {
	            buffer.push((ch >> 6) | 192);
	            buffer.push((ch & 63) | 128);
	          }
	          else {
	            buffer.push((ch >> 12) | 224);
	            buffer.push(((ch >> 6) & 63) | 128);
	            buffer.push((ch & 63) | 128);
	          }
	        }
	      }
	
	      return buffer;
	    }
	
	    function encode(string) {
	      var buffer = to(string),
	          result = [];
	
	      for (var i = 0, length = buffer.length; i < length; i++) {
	        var a = buffer[i],
	            b = buffer[++i],
	            c = 0,
	            d = a >> 2,
	            e = ((a & 3) << 4) | (b >> 4),
	            f = 0,
	            g = 0;
	
	        if (isNaN(a)) {
	          f = g = 64;
	        }
	        else {
	          c = buffer[++i];
	          f = ((b & 15) << 2) | (c >> 6);
	          g = isNaN(c) ? 64 : c & 63;
	        }
	
	        result.push(charset.charAt(d));
	        result.push(charset.charAt(e));
	        result.push(charset.charAt(f));
	        result.push(charset.charAt(g));
	      }
	
	      return result.join('');
	    }
	  
	
	    Opal.defs(self, '$decode64', function(string) {
	      var self = this;
	
	      return decode(string.replace(/\r?\n/g, ''));
	    });
	
	    Opal.defs(self, '$encode64', function(string) {
	      var self = this;
	
	      return encode(string).replace(/(.{60})/g, "$1\n");
	    });
	
	    Opal.defs(self, '$strict_decode64', function(string) {
	      var self = this;
	
	      return decode(string);
	    });
	
	    Opal.defs(self, '$strict_encode64', function(string) {
	      var self = this;
	
	      return encode(string);
	    });
	
	    Opal.defs(self, '$urlsafe_decode64', function(string) {
	      var self = this;
	
	      return decode(string.replace(/\-/g, '+').replace(/_/g, '/'));
	    });
	
	    Opal.defs(self, '$urlsafe_encode64', function(string) {
	      var self = this;
	
	      return encode(string).replace(/\+/g, '-').replace(/\//g, '_');
	    });
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/connect"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var $a, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$require', '$!=', '$new', '$options', '$!', '$to_html', '$html', '$to_proc', '$scope!']);
	  self.$require("opal/connect/html");
	  self.$require("opal/connect/cache");
	  self.$require("base64");
	  if ((($a = $scope.get('RUBY_ENGINE')['$!=']("opal")) !== nil && (!$a.$$is_boolean || $a == true))) {};
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Connect, self = $Connect = $module($base, 'Connect');
	
	      var def = self.$$proto, $scope = self.$$scope, $a, TMP_2;
	
	      (function(self) {
	        var $scope = self.$$scope, def = self.$$proto, TMP_1;
	
	        Opal.defn(self, '$__options__', TMP_1 = function() {
	          var $a, self = this, $iter = TMP_1.$$p, $yield = $iter || nil;
	          if (self.options == null) self.options = nil;
	
	          TMP_1.$$p = null;
	          ((($a = self.options) !== false && $a !== nil) ? $a : self.options = (($scope.get('Connect')).$$scope.get('Cache')).$new($hash2(["hot_reload"], {"hot_reload": false})));
	          if (($yield !== nil)) {
	            if (Opal.yield1($yield, self.options) === $breaker) return $breaker.$v};
	          return self.options;
	        });
	        return Opal.alias(self, 'options', '__options__');
	      })(Opal.get_singleton_class(self));
	
	      if ((($a = $scope.get('RUBY_ENGINE')['$!=']("opal")) !== nil && (!$a.$$is_boolean || $a == true))) {};
	
	      Opal.defn(self, '$__options__', function() {
	        var self = this;
	
	        return $scope.get('Connect').$options();
	      });
	
	      Opal.alias(self, 'connect_options', '__options__');
	
	      Opal.defn(self, '$__html__', TMP_2 = function(scope) {
	        var $a, $b, $c, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	        if (scope == null) {
	          scope = false
	        }
	        TMP_2.$$p = null;
	        if ((($a = (block !== nil)['$!']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return ($a = ($b = (($scope.get('HTML')).$$scope.get('DSL'))).$html, $a.$$p = scope.$to_proc(), $a).call($b).$to_html()
	          } else {
	          return ($a = ($c = (($scope.get('HTML')).$$scope.get('DSL'))['$scope!'](scope)).$html, $a.$$p = block.$to_proc(), $a).call($c).$to_html()
	        };
	      });
	
	      Opal.alias(self, 'html', '__html__');
	    })($scope.base)
	  })($scope.base);
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["app/components/test"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$include', '$==', '$append', '$[]']);
	  return (function($base, $super) {
	    function $Test(){};
	    var self = $Test = $klass($base, $super, 'Test', $Test);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    self.$include((($scope.get('Opal')).$$scope.get('Connect')));
	
	    return (Opal.defn(self, '$moo', function() {
	      var self = this;
	
	      if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	        return $scope.get('Element')['$[]']("body").$append("<div>cow</div>")};
	    }), nil) && 'moo';
	  })($scope.base, null)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["app/components/a"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$require', '$include', '$append', '$[]', '$bar', '$main', '$new', '$moo']);
	  self.$require("app/components/test");
	  return (function($base, $super) {
	    function $A(){};
	    var self = $A = $klass($base, $super, 'A', $A);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    self.$include((($scope.get('Opal')).$$scope.get('Connect')));
	
	    Opal.defn(self, '$foo', function() {
	      var self = this;
	
	      $scope.get('Element')['$[]']("body").$append("<div>required: world.rb</div>");
	      $scope.get('Element')['$[]']("body").$append("<div>A#foo</div>");
	      self.$bar();
	      $scope.get('App').$new().$main();
	      return self.$moo();
	    });
	
	    return (Opal.defn(self, '$bar', function() {
	      var self = this;
	
	      return $scope.get('Element')['$[]']("body").$append("<div>A#bar</div>");
	    }), nil) && 'bar';
	  })($scope.base, $scope.get('Test'));
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["app/components/main"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $klass = Opal.klass;
	
	  Opal.add_stubs(['$include', '$append', '$[]']);
	  return (function($base, $super) {
	    function $App(){};
	    var self = $App = $klass($base, $super, 'App', $App);
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    self.$include((($scope.get('Opal')).$$scope.get('Connect')));
	
	    return (Opal.defn(self, '$main', function() {
	      var self = this;
	
	      return $scope.get('Element')['$[]']("body").$append("<div>Just created a nested file and folder app/main.rb</div>");
	    }), nil) && 'main';
	  })($scope.base, null)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["app/components/hello"] = function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$require', '$include', '$==', '$html', '$[]', '$append', '$div', '$delete', '$foo', '$new']);
	  self.$require("app/components/a");
	  return (function($base) {
	    var $Yah, self = $Yah = $module($base, 'Yah');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Components, self = $Components = $module($base, 'Components');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      (function($base, $super) {
	        function $Hello(){};
	        var self = $Hello = $klass($base, $super, 'Hello', $Hello);
	
	        var def = self.$$proto, $scope = self.$$scope;
	
	        self.$include((($scope.get('Opal')).$$scope.get('Connect')));
	
	        return (Opal.defn(self, '$world', function(options) {
	          var $a, $b, TMP_1, $c, TMP_2, self = this, name = nil;
	
	          if (options == null) {
	            options = $hash2([], {})
	          }
	          if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	            $scope.get('Element')['$[]']("body").$html("");
	            $scope.get('Element')['$[]']("body").$append(($a = ($b = self).$html, $a.$$p = (TMP_1 = function(){var self = TMP_1.$$s || this;
	
	            return self.$div("Hello, World!")}, TMP_1.$$s = self, TMP_1), $a).call($b));
	            if ((($a = name = options.$delete("name")) !== nil && (!$a.$$is_boolean || $a == true))) {
	              $scope.get('Element')['$[]']("body").$append(($a = ($c = self).$html, $a.$$p = (TMP_2 = function(){var self = TMP_2.$$s || this;
	
	              return self.$div("Hello, " + (name) + "!")}, TMP_2.$$s = self, TMP_2), $a).call($c))};
	            return $scope.get('A').$new().$foo();};
	        }), nil) && 'world';
	      })($scope.base, null)
	    })($scope.base)
	  })($scope.base);
	};
	
	/* Generated by Opal 0.9.2 */
	(function(Opal) {
	  Opal.dynamic_require_severity = "error";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require']);
	  __webpack_require__(3);
	  self.$require("opal");
	  self.$require("opal-jquery");
	  self.$require("opal/connect");
	  self.$require("app/components/test.rb");
	  self.$require("app/components/a.rb");
	  self.$require("app/components/main.rb");
	  return self.$require("app/components/hello.rb");
	})(Opal);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(4);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(5);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.2.1
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-02-22T19:11Z
	 */
	
	(function( global, factory ) {
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var arr = [];
	
	var document = window.document;
	
	var slice = arr.slice;
	
	var concat = arr.concat;
	
	var push = arr.push;
	
	var indexOf = arr.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var support = {};
	
	
	
	var
		version = "2.2.1",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// Start with an empty selector
		selector: "",
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?
	
				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :
	
				// Return all the elements in a clean array
				slice.call( this );
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}
	
		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {
	
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},
	
		isArray: Array.isArray,
	
		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},
	
		isNumeric: function( obj ) {
	
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
		},
	
		isPlainObject: function( obj ) {
	
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}
	
			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
	
			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		},
	
		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
	
			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
	
		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;
	
			code = jQuery.trim( code );
	
			if ( code ) {
	
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf( "use strict" ) === 1 ) {
					script = document.createElement( "script" );
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {
	
					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval
	
					indirect( code );
				}
			}
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},
	
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: Date.now,
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	/* jshint ignore: end */
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	
	function isArrayLike( obj ) {
	
		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
		rescape = /'|\\/g,
	
		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, nidselect, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
	
			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	
					// ID selector
					if ( (m = match[1]) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	
					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;
	
					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {
	
						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rescape, "\\$&" );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
						while ( i-- ) {
							groups[i] = nidselect + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}
	
					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");
	
		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( (parent = document.defaultView) && parent.top !== parent ) {
			// Support: IE 11
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( document.createComment("") );
			return !div.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});
	
		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];
	
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},
	
			"disabled": function( elem ) {
				return elem.disabled === true;
			},
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
	
							if ( (oldCache = uniqueCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ dir ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
	
		}
	
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
	
		}
	
		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}
	
			qualifier = jQuery.filter( qualifier, elements );
		}
	
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {
	
							// Inject the element directly into the jQuery object
							this.length = 1;
							this[ 0 ] = elem;
						}
	
						this.context = document;
						this.selector = selector;
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;
	
			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;
	
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
					// Always skip document fragments
					if ( cur.nodeType < 11 && ( pos ?
						pos.index( cur ) > -1 :
	
						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
						matched.push( cur );
						break;
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within the set
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}
	
			// Locate the position of the desired element
			return indexOf.call( this,
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}
	
			return this.pushStack( matched );
		};
	} );
	var rnotwhite = ( /\S+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
	
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this === promise ? newDefer.promise() : this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Keep pipe for back-compat
			promise.pipe = promise.then;
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];
	
				// promise[ done | fail | progress ] = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add( function() {
	
						// state = [ resolved | rejected ]
						state = stateString;
	
					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}
	
				// deferred[ resolve | reject | notify ]
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,
	
				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
	
				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
	
				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},
	
				progressValues, progressContexts, resolveContexts;
	
			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.progress( updateFunc( i, progressContexts, progressValues ) )
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject );
					} else {
						--remaining;
					}
				}
			}
	
			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}
	
			return deferred.promise();
		}
	} );
	
	
	// The deferred used on DOM ready
	var readyList;
	
	jQuery.fn.ready = function( fn ) {
	
		// Add the callback
		jQuery.ready.promise().done( fn );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
	
			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	} );
	
	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}
	
	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {
	
			readyList = jQuery.Deferred();
	
			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE9-10 only
			// Older IE sometimes signals "interactive" too soon
			if ( document.readyState === "complete" ||
				( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout( jQuery.ready );
	
			} else {
	
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed );
	
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed );
			}
		}
		return readyList.promise( obj );
	};
	
	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();
	
	
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		return chainable ?
			elems :
	
			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {
	
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};
	
	
	
	
	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}
	
	Data.uid = 1;
	
	Data.prototype = {
	
		register: function( owner, initial ) {
			var value = initial || {};
	
			// If it is a node unlikely to be stringify-ed or looped over
			// use plain assignment
			if ( owner.nodeType ) {
				owner[ this.expando ] = value;
	
			// Otherwise secure it in a non-enumerable, non-writable property
			// configurability must be true to allow the property to be
			// deleted with the delete operator
			} else {
				Object.defineProperty( owner, this.expando, {
					value: value,
					writable: true,
					configurable: true
				} );
			}
			return owner[ this.expando ];
		},
		cache: function( owner ) {
	
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( !acceptData( owner ) ) {
				return {};
			}
	
			// Check if the owner object already has a cache
			var value = owner[ this.expando ];
	
			// If not, create one
			if ( !value ) {
				value = {};
	
				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {
	
					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;
	
					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}
	
			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );
	
			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;
	
			// Handle: [ owner, { properties } ] args
			} else {
	
				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
				owner[ this.expando ] && owner[ this.expando ][ key ];
		},
		access: function( owner, key, value ) {
			var stored;
	
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {
	
				stored = this.get( owner, key );
	
				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase( key ) );
			}
	
			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				cache = owner[ this.expando ];
	
			if ( cache === undefined ) {
				return;
			}
	
			if ( key === undefined ) {
				this.register( owner );
	
			} else {
	
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
	
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );
	
					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {
	
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}
	
				i = name.length;
	
				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}
	
			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
	
				// Support: Chrome <= 35-45+
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://code.google.com/p/chromium/issues/detail?id=378607
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();
	
	var dataUser = new Data();
	
	
	
	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;
	
	function dataAttr( elem, key, data ) {
		var name;
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
	
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}
	
	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},
	
		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},
	
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},
	
		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );
	
					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}
	
			return access( this, function( value ) {
				var data, camelKey;
	
				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
	
					// Attempt to get data from the cache
					// with the key as-is
					data = dataUser.get( elem, key ) ||
	
						// Try to find dashed key if it exists (gh-2779)
						// This is for 2.2.x only
						dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );
	
					if ( data !== undefined ) {
						return data;
					}
	
					camelKey = jQuery.camelCase( key );
	
					// Attempt to get data from the cache
					// with the key camelized
					data = dataUser.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}
	
					// We tried really hard, but the data doesn't exist.
					return;
				}
	
				// Set the data...
				camelKey = jQuery.camelCase( key );
				this.each( function() {
	
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = dataUser.get( this, camelKey );
	
					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					dataUser.set( this, camelKey, value );
	
					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
						dataUser.set( this, key, value );
					}
				} );
			}, null, value, arguments.length > 1, null, true );
		},
	
		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHidden = function( elem, el ) {
	
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" ||
				!jQuery.contains( elem.ownerDocument, elem );
		};
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() { return tween.cur(); } :
				function() { return jQuery.css( elem, prop, "" ); },
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			do {
	
				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";
	
				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );
	
			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([\w:-]+)/ );
	
	var rscriptType = ( /^$|\/(?:java|ecma)script/i );
	
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
	
		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
	
		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		_default: [ 0, "", "" ]
	};
	
	// Support: IE9
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	
	function getAll( context, tag ) {
	
		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
				[];
	
		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/;
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
	
					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );
	
					// Remember the top-level container
					tmp = fragment.firstChild;
	
					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}
	
		// Remove wrapper from fragment
		fragment.textContent = "";
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}
	
			contains = jQuery.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		return fragment;
	}
	
	
	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );
	
		// Support: Android 4.0-4.3, Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();
	
	
	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
	
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
	
			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},
	
		dispatch: function( event ) {
	
			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );
	
			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {
	
				for ( ; cur !== this; cur = cur.parentNode || this ) {
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		// Includes some event props shared by KeyEvent and MouseEvent
		props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),
	
		fixHooks: {},
	
		keyHooks: {
			props: "char charCode key keyCode".split( " " ),
			filter: function( event, original ) {
	
				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}
	
				return event;
			}
		},
	
		mouseHooks: {
			props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
				"screenX screenY toElement" ).split( " " ),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;
	
				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;
	
					event.pageX = original.clientX +
						( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
						( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY +
						( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
						( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}
	
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}
	
				return event;
			}
		},
	
		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}
	
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];
	
			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
	
			event = new jQuery.Event( originalEvent );
	
			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}
	
			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}
	
			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}
	
			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
	
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
	
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};
	
	jQuery.removeEvent = function( elem, type, handle ) {
	
		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
	
			if ( e ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( e ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	jQuery.fn.extend( {
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );
	
	
	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
	
		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?
	
			elem.getElementsByTagName( "tbody" )[ 0 ] ||
				elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
			elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
	
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
	
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;
	
			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};
	
				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}
	
		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );
	
			dataUser.set( dest, udataCur );
		}
	}
	
	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();
	
		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;
	
		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = concat.apply( [], args );
	
		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;
	
			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {
	
						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
	
		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,
	
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {
	
					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );
	
					// Remove any remaining nodes
					elem.textContent = "";
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};
	
							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	
	
	var iframe,
		elemdisplay = {
	
			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};
	
	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
	
			display = jQuery.css( elem[ 0 ], "display" );
	
		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();
	
		return display;
	}
	
	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];
	
		if ( !display ) {
			display = actualDisplay( nodeName, doc );
	
			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {
	
				// Use the already-created iframe if possible
				iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
					.appendTo( doc.documentElement );
	
				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;
	
				// Support: IE
				doc.write();
				doc.close();
	
				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}
	
			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}
	
		return display;
	}
	var rmargin = ( /^margin/ );
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var getStyles = function( elem ) {
	
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	var documentElement = document.documentElement;
	
	
	
	( function() {
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );
	
		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
			div.style.cssText =
	
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );
	
			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";
	
			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";
	
			documentElement.removeChild( container );
		}
	
		jQuery.extend( support, {
			pixelPosition: function() {
	
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {
	
				// Support: Android 4.0-4.3
				// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
				// since that compresses better and they're computed together anyway.
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {
	
				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if ( boxSizingReliableVal == null ) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			},
			reliableMarginRight: function() {
	
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );
	
				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
	
					// Support: Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;box-sizing:content-box;" +
					"display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				documentElement.appendChild( container );
	
				ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );
	
				documentElement.removeChild( container );
				div.removeChild( marginDiv );
	
				return ret;
			}
		} );
	} )();
	
	
	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;
	
		computed = computed || getStyles( elem );
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;
	
		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}
	
		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
	
			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
	
				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
	
				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
	
		return ret !== undefined ?
	
			// Support: IE9-11+
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var
	
		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;
	
	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {
	
		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}
	
		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	function setPositiveNumber( elem, value, subtract ) {
	
		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
	
			// If we already have the right measurement, avoid augmentation
			4 :
	
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,
	
			val = 0;
	
		for ( ; i < 4; i += 2 ) {
	
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
	
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
	
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// Support: IE11 only
		// In IE 11 fullscreen elements inside of an iframe have
		// 100x too small dimensions (gh-1764).
		if ( document.msFullscreenElement && window.top !== window ) {
	
			// Support: IE11 only
			// Running getBoundingClientRect on a disconnected node
			// in IE throws an error.
			if ( elem.getClientRects().length ) {
				val = Math.round( elem.getBoundingClientRect()[ name ] * 100 );
			}
		}
	
		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
	
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}
	
			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;
	
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			values[ index ] = dataPriv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
	
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}
	
				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = dataPriv.access(
						elem,
						"olddisplay",
						defaultDisplay( elem.nodeName )
					);
				}
			} else {
				hidden = isHidden( elem );
	
				if ( display !== "none" || !hidden ) {
					dataPriv.set(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css( elem, "display" )
					);
				}
			}
		}
	
		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}
	
		return elements;
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					style[ name ] = value;
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
						elem.offsetWidth === 0 ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);
	
				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {
	
					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}
	
				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);
	
	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back Compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };
	
		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// We're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );
	
		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
	
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );
	
			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;
	
			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	
		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
	
			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}
	
		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", {} );
			}
	
			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done( function() {
					jQuery( elem ).hide();
				} );
			}
			anim.done( function() {
				var prop;
	
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
	
				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
	
		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
			style.display = display;
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length ; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
			opt.duration : opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	
		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()
	
				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// Enable finishing flag on private data
				data.finish = true;
	
				// Empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		window.clearInterval( timerId );
	
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		input.type = "checkbox";
	
		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";
	
		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;
	
		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;
	
		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();
	
	
	var boolHook,
		attrHandle = jQuery.expr.attrHandle;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					propName = jQuery.propFix[ name ] || name;
	
					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
	
						// Set corresponding property to false
						elem[ propName ] = false;
					}
	
					elem.removeAttribute( name );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
	
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	} );
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	
	
	
	var rclass = /[\t\r\n\f]/g;
	
	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( type === "string" ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// Store className if set
						dataPriv.set( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	var rreturn = /\r/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					return typeof ret === "string" ?
	
						// Handle most common string cases
						ret.replace( rreturn, "" ) :
	
						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
	
				} else if ( typeof val === "number" ) {
					val += "";
	
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
	
					// Support: IE<11
					// option.value not trimmed (#14858)
					return jQuery.trim( elem.value );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ?
									!option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
						if ( option.selected =
								jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
	
	jQuery.extend( jQuery.event, {
	
		trigger: function( event, data, elem, onlyHandlers ) {
	
			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {
	
					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		// Piggyback on a donor event to simulate a different one
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
	
					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// But now, this "simulate" function is used only for events
					// for which stopPropagation() is noop, so there is no need for that anymore.
					//
					// For the 1.x branch though, guard for "click" and "submit"
					// events is still used, but was moved to jQuery.event.stopPropagation function
					// because `originalEvent` should point to the original event for the constancy
					// with other events and for more focused logic
				}
			);
	
			jQuery.event.trigger( e, null, elem );
	
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	
	} );
	
	jQuery.fn.extend( {
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
		function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );
	
	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	
	
	
	support.focusin = "onfocusin" in window;
	
	
	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );
	
					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;
	
	var nonce = jQuery.now();
	
	var rquery = ( /\?/ );
	
	
	
	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
	
		// Support: IE9
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}
	
		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
	
		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var transport,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers
				responseHeadersString,
				responseHeaders,
	
				// timeout handle
				timeoutTimer,
	
				// Url cleanup var
				urlAnchor,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				// Loop variable
				i,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// The jqXHR state
				state = 0,
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
	
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
	
			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
				.replace( rprotocol, location.protocol + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];
	
			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );
	
				// Support: IE8-11+
				// IE throws exception if url is malformed, e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;
	
					// Support: IE8-11+
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {
	
					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?
	
						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :
	
						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// Aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( state === 2 ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
	
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Called once
				if ( state === 2 ) {
					return;
				}
	
				// State is "done" now
				state = 2;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;
	
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapAll( html.call( this, i ) );
				} );
			}
	
			if ( this[ 0 ] ) {
	
				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function() {
			return this.parent().each( function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			} ).end();
		}
	} );
	
	
	jQuery.expr.filters.hidden = function( elem ) {
		return !jQuery.expr.filters.visible( elem );
	};
	jQuery.expr.filters.visible = function( elem ) {
	
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		// Use OR instead of AND as the element is not visible if either is true
		// See tickets #10406 and #13132
		return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
	};
	
	
	
	
	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
	
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};
	
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;
	
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();
	
				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};
	
	var xhrSuccessStatus = {
	
			// File protocol always yields status code 0, assume 200
			0: 200,
	
			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;
	
	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;
	
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();
	
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);
	
					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}
	
					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}
	
					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}
	
					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}
	
					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
	
								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
	
									// Support: IE9
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(
	
											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
	
										// Support: IE9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};
	
					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );
	
					// Support: IE9
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {
	
							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {
	
								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}
	
					// Create the abort callback
					callback = callback( "abort" );
	
					try {
	
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
	
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},
	
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
	
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// Force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// Support: Safari 8+
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();
	
	
	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
	
		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		context = context || ( support.createHTMLDocument ?
			document.implementation.createHTMLDocument( "" ) :
			document );
	
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	// Keep a copy of the old load method
	var _load = jQuery.fn.load;
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}
	
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( self, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
	
			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
	
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
	
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;
	
			if ( !doc ) {
				return;
			}
	
			docElem = doc.documentElement;
	
			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}
	
			box = elem.getBoundingClientRect();
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
	
			} else {
	
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}
	
			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}
	
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );
	
	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {
	
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
	
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		} );
	} );
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		},
		size: function() {
			return this.length;
		}
	} );
	
	jQuery.fn.andSelf = jQuery.fn.addBack;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
	
	return jQuery;
	}));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/connect/html"] = function(Opal) {
	  Opal.dynamic_require_severity = "ignore";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass;
	
	  Opal.add_stubs(['$find', '$instance_of?', '$instance_eval', '$to_proc', '$<<', '$join', '$map', '$inspect', '$to_s', '$children', '$each', '$define_method', '$send', '$!', '$include?', '$respond_to?', '$scope', '$new', '$scope!', '$class', '$attr_accessor', '$instance_variable_set']);
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Connect, self = $Connect = $module($base, 'Connect');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      (function($base) {
	        var $HTML, self = $HTML = $module($base, 'HTML');
	
	        var def = self.$$proto, $scope = self.$$scope;
	
	        Opal.cdecl($scope, 'INDENT', "  ");
	
	        Opal.cdecl($scope, 'TAGS', ["a", "button", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
	
	        (function($base, $super) {
	          function $DSL(){};
	          var self = $DSL = $klass($base, $super, 'DSL', $DSL);
	
	          var def = self.$$proto, $scope = self.$$scope, TMP_1, $a, $b, TMP_5, TMP_7;
	
	          def.tag = def.attributes = def.attr_string = def.content = def.children = nil;
	          Opal.defn(self, '$initialize', TMP_1 = function(tag) {
	            var $a, $b, TMP_2, $c, TMP_3, $d, self = this, $iter = TMP_1.$$p, block = $iter || nil, $splat_index = nil;
	
	            var array_size = arguments.length - 1;
	            if(array_size < 0) array_size = 0;
	            var args = new Array(array_size);
	            for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	              args[$splat_index] = arguments[$splat_index + 1];
	            }
	            TMP_1.$$p = null;
	            self.tag = tag;
	            self.content = ($a = ($b = args).$find, $a.$$p = (TMP_2 = function(a){var self = TMP_2.$$s || this;
	if (a == null) a = nil;
	            return a['$instance_of?']($scope.get('String'))}, TMP_2.$$s = self, TMP_2), $a).call($b);
	            self.attributes = ($a = ($c = args).$find, $a.$$p = (TMP_3 = function(a){var self = TMP_3.$$s || this;
	if (a == null) a = nil;
	            return a['$instance_of?']($scope.get('Hash'))}, TMP_3.$$s = self, TMP_3), $a).call($c);
	            self.attr_string = [];
	            if ((block !== nil)) {
	              return ($a = ($d = self).$instance_eval, $a.$$p = block.$to_proc(), $a).call($d)
	              } else {
	              return nil
	            };
	          });
	
	          Opal.defn(self, '$to_html', function() {
	            var $a, $b, TMP_4, $c, $d, self = this;
	
	            if ((($a = self.tag) !== nil && (!$a.$$is_boolean || $a == true))) {
	              if ((($a = self.attributes) !== nil && (!$a.$$is_boolean || $a == true))) {
	                self.attr_string['$<<'](" " + (($a = ($b = self.attributes).$map, $a.$$p = (TMP_4 = function(k, v){var self = TMP_4.$$s || this;
	if (k == null) k = nil;if (v == null) v = nil;
	                return "" + (k) + "=" + (v.$to_s().$inspect())}, TMP_4.$$s = self, TMP_4), $a).call($b).$join(" ")))};
	              return "<" + (self.tag) + (self.attr_string.$join()) + ">" + (self.content) + (($a = ($c = self.$children()).$map, $a.$$p = "to_html".$to_proc(), $a).call($c).$join()) + "</" + (self.tag) + ">";
	              } else {
	              return "" + (self.content) + (($a = ($d = self.$children()).$map, $a.$$p = "to_html".$to_proc(), $a).call($d).$join())
	            };
	          });
	
	          Opal.defn(self, '$children', function() {
	            var $a, self = this;
	
	            return ((($a = self.children) !== false && $a !== nil) ? $a : self.children = []);
	          });
	
	          ($a = ($b = ["p", "select"]).$each, $a.$$p = (TMP_5 = function(name){var self = TMP_5.$$s || this, $a, $b, TMP_6;
	if (name == null) name = nil;
	          return ($a = ($b = self).$define_method, $a.$$p = (TMP_6 = function(args){var self = TMP_6.$$s || this, block, $a, $b;
	args = $slice.call(arguments, 0);
	              block = TMP_6.$$p || nil, TMP_6.$$p = null;
	            return ($a = ($b = self).$send, $a.$$p = block.$to_proc(), $a).apply($b, ["method_missing", name].concat(Opal.to_a(args)))}, TMP_6.$$s = self, TMP_6), $a).call($b, name)}, TMP_5.$$s = self, TMP_5), $a).call($b);
	
	          Opal.defn(self, '$method_missing', TMP_7 = function(tag) {
	            var $a, $b, $c, self = this, $iter = TMP_7.$$p, block = $iter || nil, child = nil, $splat_index = nil;
	
	            var array_size = arguments.length - 1;
	            if(array_size < 0) array_size = 0;
	            var args = new Array(array_size);
	            for($splat_index = 0; $splat_index < array_size; $splat_index++) {
	              args[$splat_index] = arguments[$splat_index + 1];
	            }
	            TMP_7.$$p = null;
	            if ((($a = ($b = $scope.get('TAGS')['$include?'](tag.$to_s())['$!'](), $b !== false && $b !== nil ?self.$scope()['$respond_to?'](tag, true) : $b)) !== nil && (!$a.$$is_boolean || $a == true))) {
	              return ($a = ($b = self.$scope()).$send, $a.$$p = block.$to_proc(), $a).apply($b, [tag].concat(Opal.to_a(args)))
	              } else {
	              child = ($a = ($c = $scope.get('DSL')['$scope!'](self.$scope())).$new, $a.$$p = block.$to_proc(), $a).apply($c, [tag.$to_s()].concat(Opal.to_a(args)));
	              self.$children()['$<<'](child);
	              return child;
	            };
	          });
	
	          Opal.defn(self, '$scope', function() {
	            var self = this;
	
	            return self.$class().$scope();
	          });
	
	          return (function(self) {
	            var $scope = self.$$scope, def = self.$$proto, TMP_8;
	
	            self.$attr_accessor("scope");
	            Opal.defn(self, '$html', TMP_8 = function() {
	              var $a, $b, self = this, $iter = TMP_8.$$p, block = $iter || nil;
	
	              TMP_8.$$p = null;
	              return ($a = ($b = $scope.get('DSL')['$scope!'](self.$scope())).$new, $a.$$p = block.$to_proc(), $a).call($b, nil, nil);
	            });
	            return (Opal.defn(self, '$scope!', function(scope) {
	              var self = this, klass = nil;
	
	              klass = $scope.get('Class').$new(self);
	              klass.$instance_variable_set("@scope", scope);
	              return klass;
	            }), nil) && 'scope!';
	          })(Opal.get_singleton_class(self));
	        })($scope.base, null);
	      })($scope.base)
	    })($scope.base)
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/connect/cache"] = function(Opal) {
	  Opal.dynamic_require_severity = "ignore";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $klass = Opal.klass, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$!=', '$==', '$[]', '$[]=']);
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Connect, self = $Connect = $module($base, 'Connect');
	
	      var def = self.$$proto, $scope = self.$$scope;
	
	      (function($base, $super) {
	        function $Cache(){};
	        var self = $Cache = $klass($base, $super, 'Cache', $Cache);
	
	        var def = self.$$proto, $scope = self.$$scope;
	
	        def.hash = nil;
	        Opal.defn(self, '$initialize', function(options) {
	          var $a, self = this;
	
	          if (options == null) {
	            options = $hash2([], {})
	          }
	          if ((($a = $scope.get('RUBY_ENGINE')['$!=']("opal")) !== nil && (!$a.$$is_boolean || $a == true))) {};
	          return self.hash = options;
	        });
	
	        Opal.defn(self, '$[]', function(key) {
	          var self = this;
	
	          if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	            return self.hash['$[]'](key)};
	        });
	
	        return (Opal.defn(self, '$[]=', function(key, value) {
	          var self = this;
	
	          if ($scope.get('RUBY_ENGINE')['$==']("opal")) {
	            return self.hash['$[]='](key, value)};
	        }), nil) && '[]=';
	      })($scope.base, null)
	    })($scope.base)
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["base64"] = function(Opal) {
	  Opal.dynamic_require_severity = "ignore";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module;
	
	  return (function($base) {
	    var $Base64, self = $Base64 = $module($base, 'Base64');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    
	    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	        lookup  = {};
	
	    for (var i = 0, length = charset.length; i < length; i++) {
	      lookup[charset.charAt(i)] = i;
	    }
	
	    function from(string) {
	      var buffer = [];
	
	      for (var i = 0, length = string.length; i < length; i++) {
	        var a, b, c, d;
	
	        a = lookup[string.charAt(i)];
	        b = lookup[string.charAt(++i)];
	
	        buffer.push((a << 2) | (b >> 4));
	
	        c = lookup[string.charAt(++i)];
	
	        if (c == 64) {
	          break;
	        }
	
	        buffer.push(((b & 15) << 4) | (c >> 2));
	
	        d = lookup[string.charAt(++i)];
	
	        if (d == 64) {
	          break;
	        }
	
	        buffer.push(((c & 3) << 6) | d);
	      }
	
	      return buffer;
	    }
	
	    function decode(string) {
	      var buffer = from(string),
	          result = [], a, b, c;
	
	      for (var i = 0, length = buffer.length; i < length; i++) {
	        if (buffer[i] < 128) {
	          result.push(String.fromCharCode(buffer[i]));
	        }
	        else if (buffer[i] > 191 && buffer[i] < 224) {
	          a = (buffer[i] & 31) << 6;
	          b = buffer[++i] & 63;
	
	          result.push(String.fromCharCode(a | b));
	        }
	        else {
	          a = (buffer[i] & 15) << 12;
	          b = (buffer[++i] & 63) << 6;
	          c = buffer[++i] & 63;
	
	          result.push(String.fromCharCode(a | b | c));
	        }
	      }
	
	      return result.join('');
	    }
	
	    function to(string) {
	      var buffer = [], i, length;
	
	      if (/^[\x00-\x7f]*$/.test(string)) {
	        for (i = 0, length = string.length; i < length; i++) {
	          buffer.push(string.charCodeAt(i));
	        }
	      }
	      else {
	        for (i = 0, length = string.length; i < length; i++) {
	          var ch = string.charCodeAt(i);
	
	          if (ch < 128) {
	            buffer.push(ch);
	          }
	          else if (ch < 2048) {
	            buffer.push((ch >> 6) | 192);
	            buffer.push((ch & 63) | 128);
	          }
	          else {
	            buffer.push((ch >> 12) | 224);
	            buffer.push(((ch >> 6) & 63) | 128);
	            buffer.push((ch & 63) | 128);
	          }
	        }
	      }
	
	      return buffer;
	    }
	
	    function encode(string) {
	      var buffer = to(string),
	          result = [];
	
	      for (var i = 0, length = buffer.length; i < length; i++) {
	        var a = buffer[i],
	            b = buffer[++i],
	            c = 0,
	            d = a >> 2,
	            e = ((a & 3) << 4) | (b >> 4),
	            f = 0,
	            g = 0;
	
	        if (isNaN(a)) {
	          f = g = 64;
	        }
	        else {
	          c = buffer[++i];
	          f = ((b & 15) << 2) | (c >> 6);
	          g = isNaN(c) ? 64 : c & 63;
	        }
	
	        result.push(charset.charAt(d));
	        result.push(charset.charAt(e));
	        result.push(charset.charAt(f));
	        result.push(charset.charAt(g));
	      }
	
	      return result.join('');
	    }
	  
	
	    Opal.defs(self, '$decode64', function(string) {
	      var self = this;
	
	      return decode(string.replace(/\r?\n/g, ''));
	    });
	
	    Opal.defs(self, '$encode64', function(string) {
	      var self = this;
	
	      return encode(string).replace(/(.{60})/g, "$1\n");
	    });
	
	    Opal.defs(self, '$strict_decode64', function(string) {
	      var self = this;
	
	      return decode(string);
	    });
	
	    Opal.defs(self, '$strict_encode64', function(string) {
	      var self = this;
	
	      return encode(string);
	    });
	
	    Opal.defs(self, '$urlsafe_decode64', function(string) {
	      var self = this;
	
	      return decode(string.replace(/\-/g, '+').replace(/_/g, '/'));
	    });
	
	    Opal.defs(self, '$urlsafe_encode64', function(string) {
	      var self = this;
	
	      return encode(string).replace(/\+/g, '-').replace(/\//g, '_');
	    });
	  })($scope.base)
	};
	
	/* Generated by Opal 0.9.2 */
	Opal.modules["opal/connect"] = function(Opal) {
	  Opal.dynamic_require_severity = "ignore";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var $a, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, $module = Opal.module, $hash2 = Opal.hash2;
	
	  Opal.add_stubs(['$require', '$!=', '$new', '$options', '$!', '$to_html', '$html', '$to_proc', '$scope!']);
	  self.$require("opal/connect/html");
	  self.$require("opal/connect/cache");
	  self.$require("base64");
	  if ((($a = $scope.get('RUBY_ENGINE')['$!=']("opal")) !== nil && (!$a.$$is_boolean || $a == true))) {};
	  return (function($base) {
	    var $Opal, self = $Opal = $module($base, 'Opal');
	
	    var def = self.$$proto, $scope = self.$$scope;
	
	    (function($base) {
	      var $Connect, self = $Connect = $module($base, 'Connect');
	
	      var def = self.$$proto, $scope = self.$$scope, $a, TMP_2;
	
	      (function(self) {
	        var $scope = self.$$scope, def = self.$$proto, TMP_1;
	
	        Opal.defn(self, '$__options__', TMP_1 = function() {
	          var $a, self = this, $iter = TMP_1.$$p, $yield = $iter || nil;
	          if (self.options == null) self.options = nil;
	
	          TMP_1.$$p = null;
	          ((($a = self.options) !== false && $a !== nil) ? $a : self.options = (($scope.get('Connect')).$$scope.get('Cache')).$new($hash2(["hot_reload"], {"hot_reload": false})));
	          if (($yield !== nil)) {
	            if (Opal.yield1($yield, self.options) === $breaker) return $breaker.$v};
	          return self.options;
	        });
	        return Opal.alias(self, 'options', '__options__');
	      })(Opal.get_singleton_class(self));
	
	      if ((($a = $scope.get('RUBY_ENGINE')['$!=']("opal")) !== nil && (!$a.$$is_boolean || $a == true))) {};
	
	      Opal.defn(self, '$__options__', function() {
	        var self = this;
	
	        return $scope.get('Connect').$options();
	      });
	
	      Opal.alias(self, 'connect_options', '__options__');
	
	      Opal.defn(self, '$__html__', TMP_2 = function(scope) {
	        var $a, $b, $c, self = this, $iter = TMP_2.$$p, block = $iter || nil;
	
	        if (scope == null) {
	          scope = false
	        }
	        TMP_2.$$p = null;
	        if ((($a = (block !== nil)['$!']()) !== nil && (!$a.$$is_boolean || $a == true))) {
	          return ($a = ($b = (($scope.get('HTML')).$$scope.get('DSL'))).$html, $a.$$p = scope.$to_proc(), $a).call($b).$to_html()
	          } else {
	          return ($a = ($c = (($scope.get('HTML')).$$scope.get('DSL'))['$scope!'](scope)).$html, $a.$$p = block.$to_proc(), $a).call($c).$to_html()
	        };
	      });
	
	      Opal.alias(self, 'html', '__html__');
	    })($scope.base)
	  })($scope.base);
	};
	
	/* Generated by Opal 0.9.2 */
	(function(Opal) {
	  Opal.dynamic_require_severity = "ignore";
	  var OPAL_CONFIG = { method_missing: true, arity_check: false, freezing: true, tainting: true };
	  var $a, $b, TMP_1, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice;
	
	  Opal.add_stubs(['$require', '$ready?', '$new', '$__send__', '$parse', '$decode64']);
	  self.$require("opal/connect");
	  if (false) {;
	  module.hot.accept();
	  self.$require("opal/connect");
	  require('./app/components/test.rb');
	  require('./app/components/a.rb');
	  require('./app/components/main.rb');
	  require('./app/components/hello.rb');
	  ($a = ($b = $scope.get('Document'))['$ready?'], $a.$$p = (TMP_1 = function(){var self = TMP_1.$$s || this, $a, klass = nil;
	
	  klass = (((($scope.get('Yah')).$$scope.get('Components'))).$$scope.get('Hello')).$new();
	    return ($a = klass).$__send__.apply($a, ["world"].concat(Opal.to_a($scope.get('JSON').$parse($scope.get('Base64').$decode64("W3sibmFtZSI6ImNqIn1d\n")))));}, TMP_1.$$s = self, TMP_1), $a).call($b);
	  return };
	})(Opal);


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map