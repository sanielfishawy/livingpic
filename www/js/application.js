/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */

(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
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

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

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

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
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
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
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
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
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
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
								list.push( arg );
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
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
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
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
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
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
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

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
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Preliminary tests
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Can't get basic test support
	if ( !all || !all.length ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

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
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
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

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
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

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

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

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
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
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
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

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
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

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
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
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8 –
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

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

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
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
			return this;
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
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
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
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	assertGetIdNotName,
	Expr,
	getText,
	isXML,
	contains,
	compile,
	sortOrder,
	hasDuplicate,
	outermostContext,

	baseHasDuplicate = true,
	strundefined = "undefined",

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	Token = String,
	document = window.document,
	docElem = document.documentElement,
	dirruns = 0,
	done = 0,
	pop = [].pop,
	push = [].push,
	slice = [].slice,
	// Use a stripped-down indexOf if a native one is unavailable
	indexOf = [].indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// Augment a function for special use by Sizzle
	markFunction = function( fn, value ) {
		fn[ expando ] = value == null || value;
		return fn;
	},

	createCache = function() {
		var cache = {},
			keys = [];

		return markFunction(function( key, value ) {
			// Only keep the most recent entries
			if ( keys.push( key ) > Expr.cacheLength ) {
				delete cache[ keys.shift() ];
			}

			return (cache[ key ] = value);
		}, cache );
	},

	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments not in parens/brackets,
	//   then attribute selectors and non-pseudos (denoted by :),
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

	// For matchExpr.POS and matchExpr.needsContext
	pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
		"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rnot = /^:not/,
	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"POS": new RegExp( pos, "i" ),
		"CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	// Support

	// Used for testing something on an element
	assert = function( fn ) {
		var div = document.createElement("div");

		try {
			return fn( div );
		} catch (e) {
			return false;
		} finally {
			// release memory in IE
			div = null;
		}
	},

	// Check if getElementsByTagName("*") returns only elements
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

function Sizzle( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
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
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
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
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	docElem.compareDocumentPosition ?
	function( a, b ) {
		return b && !!( a.compareDocumentPosition( b ) & 16 );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

Sizzle.attr = function( elem, name ) {
	var val,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( xml || assertAttributes ) {
		return elem.getAttribute( name );
	}
	val = elem.getAttributeNode( name );
	return val ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			val.specified ? val.value : null :
		null;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	// IE6/7 return a modified href
	attrHandle: assertHrefNotNormalized ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		},

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			},

		"NAME": assertUsableName && function( tag, context ) {
			if ( typeof context.getElementsByName !== strundefined ) {
				return context.getElementsByName( name );
			}
		},

		"CLASS": assertUsableClassName && function( className, context, xml ) {
			if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
				return context.getElementsByClassName( className );
			}
		}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var unquoted, excess;
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[3];
			} else if ( (unquoted = match[4]) ) {
				// Only check arguments that contain a pseudo
				if ( rpseudo.test(unquoted) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					unquoted = unquoted.slice( 0, excess );
					match[0] = match[0].slice( 0, excess );
				}
				match[2] = unquoted;
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ expando ][ className ];
			if ( !pattern ) {
				pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
			}
			return function( elem ) {
				return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
			};
		},

		"ATTR": function( name, operator, check ) {
			return function( elem, context ) {
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
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				return function( elem ) {
					var node, diff,
						parent = elem.parentNode;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					if ( parent ) {
						diff = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								diff++;
								if ( elem === node ) {
									break;
								}
							}
						}
					}

					// Incorporate the offset (or cast to NaN), then check against cycle size
					diff -= last;
					return diff === first || ( diff % first === 0 && diff / first >= 0 );
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
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
							idx = indexOf.call( seed, matched[i] );
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
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

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

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputPseudo("radio"),
		"checkbox": createInputPseudo("checkbox"),
		"file": createInputPseudo("file"),
		"password": createInputPseudo("password"),
		"image": createInputPseudo("image"),

		"submit": createButtonPseudo("submit"),
		"reset": createButtonPseudo("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		},

		// Positional types
		"first": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = 0; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = 1; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

function siblingCheck( a, b, ret ) {
	if ( a === b ) {
		return ret;
	}

	var cur = a.nextSibling;

	while ( cur ) {
		if ( cur === b ) {
			return -1;
		}

		cur = cur.nextSibling;
	}

	return 1;
}

sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	} :
	function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		i = 1;

	hasDuplicate = baseHasDuplicate;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				results.splice( i--, 1 );
			}
		}
	}

	return results;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type, soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector ];

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
				soFar = soFar.slice( match[0].length );
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// Cast descendant combinators to space
			matched.type = match[0].replace( rtrim, " " );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				// The last two arguments here are (context, xml) for backCompat
				(match = preFilters[ type ]( match, document, true ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
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
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( checkNonElements || elem.nodeType === 1  ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( !xml ) {
				var cache,
					dirkey = dirruns + " " + doneName + " ",
					cachedkey = dirkey + cachedruns;
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( (cache = elem[ expando ]) === cachedkey ) {
							return elem.sizset;
						} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
							if ( elem.sizset ) {
								return elem;
							}
						} else {
							elem[ expando ] = cachedkey;
							if ( matcher( elem, context, xml ) ) {
								elem.sizset = true;
								return elem;
							}
							elem.sizset = false;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( matcher( elem, context, xml ) ) {
							return elem;
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
		// Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
		if ( seed && postFinder ) {
			return;
		}

		var i, elem, postFilterIn,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

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
			postFilterIn = condense( matcherOut, postMap );
			postFilter( postFilterIn, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = postFilterIn.length;
			while ( i-- ) {
				if ( (elem = postFilterIn[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		// Keep seed and results synchronized
		if ( seed ) {
			// Ignore postFinder because it can't coexist with seed
			i = preFilter && matcherOut.length;
			while ( i-- ) {
				if ( (elem = matcherOut[i]) ) {
					seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
				}
			}
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
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			// The concatenated values are (context, xml) for backCompat
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
					i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && tokens.join("")
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
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = superMatcher.el;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++superMatcher.el;
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

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
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

	superMatcher.el = 0;
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ expando ][ selector ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results, seed ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results, seed );
	}
	return results;
}

function select( selector, context, results, seed, xml ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !xml &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( rbackslash, "" ),
						rsibling.test( tokens[0].type ) && context.parentNode || context,
						xml
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && tokens.join("");
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		xml,
		results,
		rsibling.test( selector )
	);
	return results;
}

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

			// qSa(:focus) reports false when true (Chrome 21),
			// A support test would require too much code (would include document ready)
			rbuggyQSA = [":focus"],

			// matchesSelector(:focus) reports false when true (Chrome 21),
			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [ ":active", ":focus" ],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'/>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		// rbuggyQSA always contains :focus, so no need for a length check
		rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				var groups, i,
					old = true,
					nid = expando,
					newContext = context,
					newSelector = context.nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + groups[i].join("");
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							newSelector
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( "!=", pseudos );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active and :focus, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
	// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
	context = context || document;
	context = !context.nodeType && context[0] || context;
	context = context.ownerDocument || context;

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			safe = context === document && safeFragment,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = context.createElement("div");
					safe.appendChild( div );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Take out of fragment container (we need a fresh div each time)
					div.parentNode.removeChild( div );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
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

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = {},

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
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

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
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
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
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

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
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

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = window.getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			ret = computed[ name ];
			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				} else {
					return getWidthOrHeight( elem, name, extra );
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
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
		});

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

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

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
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

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
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
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
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
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

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
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
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

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
			context: true,
			url: true
		}
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

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
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

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
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
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
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
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
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

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() ) || false;
			s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
				( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
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
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
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
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
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
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
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

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
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
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				percent = 1 - ( remaining / animation.duration || 0 ),
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
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

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
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

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
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

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
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

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

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

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

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
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
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

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

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
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	return {
		top: box.top  + scrollTop  - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
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


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
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

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          xhrFields: {
            withCredentials: withCredentials
          },
          crossDomain: crossDomain
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is(':checkbox,:radio') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is(':radio') && allInputs.filter('input:radio:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      csrf_token = $('meta[name=csrf-token]').attr('content');
      csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/*

toSentence v1.7.5
Copyright 2011 Alexey Osipenko
http://osipenko.in.ua

Requires jQuery 1.4 or newer

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

*/

(function($) {
  $.toSentence = function(array, options) {
    options = jQuery.extend({}, options);
    options.two_words_connector = options.two_words_connector || " and "
    options.last_word_connector = options.last_word_connector || " and "
    options.words_connector = options.words_connector || ", "

    var size = array.length;
    var last_word_connector = (size == 2) ? options.two_words_connector : options.last_word_connector;

    if (size == 1) { return array[0] }
    return array.slice(0, size-1).join(options.words_connector) + last_word_connector + array[size-1]
  }
})(jQuery);
/*!
  * klass: a classical JS OOP façade
  * https://github.com/ded/klass
  * License MIT (c) Dustin Diaz & Jacob Thornton 2012
  */


!function (name, definition) {
  if (typeof define == 'function') define(definition)
  else if (typeof module != 'undefined') module.exports = definition()
  else this[name] = definition()
}('klass', function () {
  var context = this
    , old = context.klass
    , f = 'function'
    , fnTest = /xyz/.test(function () {xyz}) ? /\bsupr\b/ : /.*/
    , proto = 'prototype'

  function klass(o) {
    return extend.call(isFn(o) ? o : function () {}, o, 1)
  }

  function isFn(o) {
    return typeof o === f
  }

  function wrap(k, fn, supr) {
    return function () {
      var tmp = this.supr
      this.supr = supr[proto][k]
      var ret = fn.apply(this, arguments)
      this.supr = tmp
      return ret
    }
  }

  function process(what, o, supr) {
    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        what[k] = isFn(o[k])
          && isFn(supr[proto][k])
          && fnTest.test(o[k])
          ? wrap(k, o[k], supr) : o[k]
      }
    }
  }

  function extend(o, fromSub) {
    // must redefine noop each time so it doesn't inherit from previous arbitrary classes
    function noop() {}
    noop[proto] = this[proto]
    var supr = this
      , prototype = new noop()
      , isFunction = isFn(o)
      , _constructor = isFunction ? o : this
      , _methods = isFunction ? {} : o
    function fn() {
      if (this.initialize) this.initialize.apply(this, arguments)
      else {
        fromSub || isFunction && supr.apply(this, arguments)
        _constructor.apply(this, arguments)
      }
    }

    fn.methods = function (o) {
      process(prototype, o, supr)
      fn[proto] = prototype
      return this
    }

    fn.methods.call(fn, _methods).prototype.constructor = fn

    fn.extend = arguments.callee
    fn[proto].implement = fn.statics = function (o, optFn) {
      o = typeof o == 'string' ? (function () {
        var obj = {}
        obj[o] = optFn
        return obj
      }()) : o
      process(this, o, supr)
      return this
    }

    return fn
  }

  klass.noConflict = function () {
    context.klass = old
    return this
  }
  context.klass = klass

  return klass
});
// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5


(function (window) {
	
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	if (!Function.prototype.bind ) {

		Function.prototype.bind = function( obj ) {
			var slice = [].slice,
					args = slice.call(arguments, 1), 
					self = this, 
					nop = function () {}, 
					bound = function () {
						return self.apply( this instanceof nop ? this : ( obj || {} ), 
																args.concat( slice.call(arguments) ) );
					};

			nop.prototype = self.prototype;

			bound.prototype = new nop();

			return bound;
		};
	}

	

	if (typeof window.Code === "undefined") {
		window.Code = {};
	}
	
	
	
	window.Code.Util = {
		
		
		/*
		 * Function: registerNamespace
		 */			
		registerNamespace: function () {
			var 
				args = arguments, obj = null, i, j, ns, nsParts, root, argsLen, nsPartsLens;
			for (i=0, argsLen=args.length; i<argsLen; i++) {
				ns = args[i];
				nsParts = ns.split(".");
				root = nsParts[0];
				if (typeof window[root] === "undefined"){
					window[root] = {};
				}
				obj = window[root];
				//eval('if (typeof ' + root + ' == "undefined"){' + root + ' = {};} obj = ' + root + ';');
				for (j=1, nsPartsLens=nsParts.length; j<nsPartsLens; ++j) {
					obj[nsParts[j]] = obj[nsParts[j]] || {};
					obj = obj[nsParts[j]];
				}
			}
		},
		
		
		
		/*
		 * Function: coalesce
		 * Takes any number of arguments and returns the first non Null / Undefined argument.
		 */
		coalesce: function () {
			var i, j;
			for (i=0, j=arguments.length; i<j; i++) {
				if (!this.isNothing(arguments[i])) {
					return arguments[i];
				}
			}
			return null;
		},
		
		
		
		/*
		 * Function: extend
		 */
		extend: function(destination, source, overwriteProperties){
			var prop;
			if (this.isNothing(overwriteProperties)){
				overwriteProperties = true;
			}
			if (destination && source && this.isObject(source)){
				for(prop in source){
					if (this.objectHasProperty(source, prop)) {
						if (overwriteProperties){
							destination[prop] = source[prop];
						}
						else{
							if(typeof destination[prop] === "undefined"){ 
								destination[prop] = source[prop]; 
							}
						}
					}
				}
			}
		},
		
		
		
		/*
		 * Function: clone
		 */
		clone: function(obj) {
			var retval = {};
			this.extend(retval, obj);
			return retval;
		},
		
		
		
		/*
		 * Function: isObject
		 */
		isObject: function(obj){
			return obj instanceof Object;
		},
		
		
		
		/*
		 * Function: isFunction
		 */
		isFunction: function(obj){
			return ({}).toString.call(obj) === "[object Function]";
		},
		
		
		
		/*
		 * Function: isArray
		 */
		isArray: function(obj){
			return obj instanceof Array;
		},
		
		
		/*
		 * Function: isLikeArray
		 */
		isLikeArray: function(obj) { 
			return typeof obj.length === 'number';
		},
		
		
		
		/*
		 * Function: isNumber
		 */
		isNumber: function(obj){
			return typeof obj === "number";
		},
		
		
		
		/*
		 * Function: isString
		 */
		isString: function(obj){
			return typeof obj === "string";
		},
	
		
		/*
		 * Function: isNothing
		 */
		isNothing: function (obj) {
		
			if (typeof obj === "undefined" || obj === null) {
				return true;
			}	
			return false;
			
		},
		
		
		
		/*
		 * Function: swapArrayElements
		 */
		swapArrayElements: function(arr, i, j){
			
			var temp = arr[i]; 
			arr[i] = arr[j];
			arr[j] = temp;
		
		},
		
		
		
		/*
		 * Function: trim
		 */
		trim: function(val) {
			return val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},
		
		
		
		/*
		 * Function: toCamelCase
		 */
		toCamelCase: function(val){
			return val.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
		},
		
		
		
		/*
		 * Function: toDashedCase
		 */
		toDashedCase: function(val){
			return val.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
		},
		
		
		
		/*
		 * Function: indexOf
		 */
		arrayIndexOf: function(obj, array, prop){
			
			var i, j, retval, arrayItem;
			
			retval = -1;
			
			for (i=0, j=array.length; i<j; i++){
				
				arrayItem = array[i];
				
				if (!this.isNothing(prop)){
					if (this.objectHasProperty(arrayItem, prop)) {
						if (arrayItem[prop] === obj){
							retval = i;
							break;
						}
					}
				}
				else{
					if (arrayItem === obj){
						retval = i;
						break;
					}
				}
				
			}
			
			return retval;
			
		},
		
		
		
		/*
		 * Function: objectHasProperty
		 */
		objectHasProperty: function(obj, propName){
			
			if (obj.hasOwnProperty){
				return obj.hasOwnProperty(propName);
			}
			else{
				return ('undefined' !== typeof obj[propName]);
			}
			
		}
		
		
	};
	
}(window));
// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, Util) {
	
	Util.Browser = {
	
		ua: null,
		version: null,
		safari: null,
		webkit: null,
		opera: null,
		msie: null,
		chrome: null,
		mozilla: null,
		
		android: null,
		blackberry: null,
		iPad: null,
		iPhone: null,
		iPod: null,
		iOS: null,
		
		is3dSupported: null,
		isCSSTransformSupported: null,
		isTouchSupported: null,
		isGestureSupported: null,
		
		
		_detect: function(){
			
			this.ua = window.navigator.userAgent;
			this.version = (this.ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || []);
			this.safari = (/Safari/gi).test(window.navigator.appVersion);
			this.webkit = /webkit/i.test(this.ua);
			this.opera = /opera/i.test(this.ua);
			this.msie = /msie/i.test(this.ua) && !this.opera;
			this.chrome = /Chrome/i.test(this.ua);
			this.firefox = /Firefox/i.test(this.ua);
			this.fennec = /Fennec/i.test(this.ua);
			this.mozilla = /mozilla/i.test(this.ua) && !/(compatible|webkit)/.test(this.ua);
			this.android = /android/i.test(this.ua);
			this.blackberry = /blackberry/i.test(this.ua);
			this.iOS = (/iphone|ipod|ipad/gi).test(window.navigator.platform);
			this.iPad = (/ipad/gi).test(window.navigator.platform);
			this.iPhone = (/iphone/gi).test(window.navigator.platform);
			this.iPod = (/ipod/gi).test(window.navigator.platform);
			
			var testEl = document.createElement('div');
			this.is3dSupported = !Util.isNothing(testEl.style.WebkitPerspective);	
			this.isCSSTransformSupported = ( !Util.isNothing(testEl.style.WebkitTransform) || !Util.isNothing(testEl.style.MozTransform) || !Util.isNothing(testEl.style.transformProperty) );
			this.isTouchSupported = this.isEventSupported('touchstart');
			this.isGestureSupported = this.isEventSupported('gesturestart');
			
		},
		
			
		_eventTagNames: {
			'select':'input',
			'change':'input',
			'submit':'form',
			'reset':'form',
			'error':'img',
			'load':'img',
			'abort':'img'
		},
				
				
		/*
		 * Function: isEventSupported
		 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		 */
		isEventSupported: function(eventName) {
			var 
				el = document.createElement(this._eventTagNames[eventName] || 'div'),
				isSupported;
			eventName = 'on' + eventName;
			isSupported = Util.objectHasProperty(el, eventName);
			if (!isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] === 'function';
			}
			el = null;
			return isSupported;
		},
		
		
		isLandscape: function(){
			return (Util.DOM.windowWidth() > Util.DOM.windowHeight());
		}
  };
	
	Util.Browser._detect();
	
}
(
	window,
	window.Code.Util
))
;
// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function (window, Util) {
	
	Util.extend(Util, {
		
		Events: {
			
			
			/*
			 * Function: add
			 * Add an event handler
			 */
			add: function(obj, type, handler){
				
				this._checkHandlersProperty(obj);
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				if (typeof obj.__eventHandlers[type] === 'undefined'){
					obj.__eventHandlers[type] = [];
				}
				obj.__eventHandlers[type].push(handler);
				
				// DOM element 
				if (this._isBrowserObject(obj)){
					obj.addEventListener(type, handler, false);
				}
				
			},
			
			
			
			/*
			 * Function: remove
			 * Removes a handler or all handlers associated with a type
			 */
			remove: function(obj, type, handler){
				
				this._checkHandlersProperty(obj);
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				if (obj.__eventHandlers[type] instanceof Array){
					
					var
						i, j,
						handlers = obj.__eventHandlers[type];
					
					// Removing all handlers for a type
					if (Util.isNothing(handler)){
						
						if (this._isBrowserObject(obj)){
							for (i=0, j=handlers.length; i<j; i++){
								obj.removeEventListener(type, handlers[i], false);
							}
						}
						
						obj.__eventHandlers[type] = [];
						return;
					}
					
					// Removing a specific handler
					for (i=0, j=handlers.length; i<j; i++){
						if (handlers[i] === handler){
							handlers.splice(i, 1);
							break;
						}
					}
					
					// DOM element 
					if (this._isBrowserObject(obj)){
						obj.removeEventListener(type, handler, false);
						return;
					}
				
				}
			
			},
			
			
			/*
			 * Function: fire
			 * Fire an event
			 */
			fire: function(obj, type){
				
				var 
					i, j,
					event,
					listeners,
					listener,
					args = Array.prototype.slice.call(arguments).splice(2),
					isNative;
				
				
				if (type === 'mousewheel'){
					type = this._normaliseMouseWheelType();
				}
				
				
				// DOM element 
				if (this._isBrowserObject(obj)){
				
					if (typeof type !== "string"){
						throw 'type must be a string for DOM elements';
					}
					
					isNative = this._NATIVE_EVENTS[type];
					event = document.createEvent(isNative ? "HTMLEvents" : "UIEvents"); 
					event[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, window, 1);
					
					// Fire an event on an element that has no extra arguments
					if (args.length < 1){
						obj.dispatchEvent(event);
						return;
					}
				
				}
				
				this._checkHandlersProperty(obj);
				
				if (typeof type === "string"){
					event = { type: type };
				}
				else{
					event = type;
				}
				if (!event.target){
					event.target = obj;
				}

				if (!event.type){ 
					throw new Error("Event object missing 'type' property.");
				}

				if (obj.__eventHandlers[event.type] instanceof Array){
					listeners = obj.__eventHandlers[event.type];
					args.unshift(event);
					for (i=0, j=listeners.length; i<j; i++){
						listener = listeners[i];
						if (!Util.isNothing(listener)){
							listener.apply(obj, args);
						}
					}
				}
				
			},
			
			
			/*
			 * Function: getMousePosition
			 */
			getMousePosition: function(event){
				
				var retval = {
					x: 0,
					y: 0
				};
				
				if (event.pageX) {
					retval.x = event.pageX;
				}
				else if (event.clientX) {
					retval.x = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
				}
			
				if (event.pageY) {
					retval.y = event.pageY;
				}
				else if (event.clientY) {
					retval.y = event.clientY + ( document.documentElement.scrollTop || document.body.scrollTop);
				}
				
				return retval;
			},
			
			
			/*
			 * Function: getTouchEvent
			 */
			getTouchEvent: function(event){
				
				return event;
			
			},
			
			
			
			/*
			 * Function: getWheelDelta
			 */
			getWheelDelta: function(event){
				
				var delta = 0;
				
				if (!Util.isNothing(event.wheelDelta)){
					delta = event.wheelDelta / 120;
				}
				else if (!Util.isNothing(event.detail)){
					delta = -event.detail / 3;
				}
				
				return delta;
				
			},
			
			
			/*
			 * Function: domReady
			 */
			domReady: function(handler){
				
				document.addEventListener('DOMContentLoaded', handler, false);
			
			},
			
			
			_checkHandlersProperty: function(obj){
				
				if (Util.isNothing(obj.__eventHandlers)){
					Util.extend(obj, {
						__eventHandlers: { }
					});
				}
			
			},
			
			
			_isBrowserObject: function(obj){
				if (obj === window || obj === window.document){
					return true;
				}
				return this._isElement(obj) || this._isNode(obj);
			},
			
			
			_isElement: function(obj){
				return (
					typeof window.HTMLElement === "object" ? obj instanceof window.HTMLElement : //DOM2
					typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName==="string"
				);
			},
			
			
			
			_isNode: function(obj){
				return (
					typeof window.Node === "object" ? obj instanceof window.Node : 
					typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName==="string"
				);
			},
			
			
			
			_normaliseMouseWheelType: function(){
				
				if (Util.Browser.isEventSupported('mousewheel')){
					return 'mousewheel';
				}
				return 'DOMMouseScroll';
				
			},
			
			
			
			_NATIVE_EVENTS: { 
				click: 1, dblclick: 1, mouseup: 1, mousedown: 1, contextmenu: 1, //mouse buttons
				mousewheel: 1, DOMMouseScroll: 1, //mouse wheel
				mouseover: 1, mouseout: 1, mousemove: 1, selectstart: 1, selectend: 1, //mouse movement
				keydown: 1, keypress: 1, keyup: 1, //keyboard
				orientationchange: 1, // mobile
				touchstart: 1, touchmove: 1, touchend: 1, touchcancel: 1, // touch
				gesturestart: 1, gesturechange: 1, gestureend: 1, // gesture
				focus: 1, blur: 1, change: 1, reset: 1, select: 1, submit: 1, //form elements
				load: 1, unload: 1, beforeunload: 1, resize: 1, move: 1, DOMContentLoaded: 1, readystatechange: 1, //window
				error: 1, abort: 1, scroll: 1 
			}
			
		}
	
		
	});
	
	
}
(
	window,
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function (window, Util) {
	
	Util.extend(Util, {
		
		DOM: {
			
			
			
			/*
			 * Function: setData
			 */
			setData: function(el, key, value){
			
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._setData(el[i], key, value);
					}
				}
				else{
					Util.DOM._setData(el, key, value);
				}
			
			},
			_setData: function(el, key, value){
			
				Util.DOM.setAttribute(el, 'data-' + key, value);
			
			},
			
			
			
			/*
			 * Function: getData
			 */
			getData: function(el, key, defaultValue){
				
				return Util.DOM.getAttribute(el, 'data-' + key, defaultValue);
				
			},
			
			
			
			/*
			 * Function: removeData
			 */
			removeData: function(el, key){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._removeData(el[i], key);
					}
				}
				else{
					Util.DOM._removeData(el, key);
				}
				
			},
			_removeData: function(el, key){
				
				Util.DOM.removeAttribute(el, 'data-' + key);
				
			},
			
			
			
			/*
			 * Function: isChildOf
			 */
			isChildOf: function(childEl, parentEl)
			{
				if (parentEl === childEl){ 
					return false; 
				}
				while (childEl && childEl !== parentEl)
				{ 
					childEl = childEl.parentNode; 
				}

				return childEl === parentEl;
			},
			
	
		
			/*
			 * Function: find
			 */
			find: function(selectors, contextEl){
				if (Util.isNothing(contextEl)){
					contextEl = window.document;
				}
				var 
					els = contextEl.querySelectorAll(selectors),
					retval = [],
					i, j;
				
				for (i=0, j=els.length; i<j; i++){
					retval.push(els[i]);
				}
				return retval;
			},
			
			
					
			/*
			 * Function: createElement
			 */
			createElement: function(type, attributes, content){
				
				var 
					attribute,
					retval = document.createElement(type);
					
				for(attribute in attributes) {
					if(Util.objectHasProperty(attributes, attribute)){
						retval.setAttribute(attribute, attributes[attribute]);
					}
				}
    
				retval.innerHTML = content || '';
				
				return retval;
				
			},
			
			
			/*
			 * Function: appendChild
			 */
			appendChild: function(childEl, parentEl){
				
				parentEl.appendChild(childEl);
				
			},
			
			
			/*
			 * Function: insertBefore
			 */
			insertBefore: function(newEl, refEl, parentEl){
				
				parentEl.insertBefore(newEl, refEl);
				
			},
			
			
			/*
			 * Function: appendText
			 */
			appendText: function(text, parentEl){
				
				Util.DOM.appendChild(document.createTextNode(text), parentEl);
				
			},
			
			
			/*
			 * Function: appendToBody
			 */
			appendToBody: function(childEl){
				
				this.appendChild(childEl, document.body);
				
			},
			
			
			/*
			 * Function: removeChild
			 */
			removeChild: function(childEl, parentEl){
			
				parentEl.removeChild(childEl);
				
			},
			
			
			
			/*
			 * Function: removeChildren
			 */
			removeChildren: function(parentEl){
				
				if (parentEl.hasChildNodes()){
					
					while (parentEl.childNodes.length >= 1){
						parentEl.removeChild(parentEl.childNodes[parentEl.childNodes.length -1]);
					}
					
				}
			
			},
			
			
			
			/*
			 * Function: hasAttribute
			 */
			hasAttribute: function(el, attributeName){
				
				return !Util.isNothing(el.getAttribute(attributeName));
			
			},
			
			
			
			/*
			 * Function: getAttribute
			 */
			getAttribute: function(el, attributeName, defaultValue){
				
				var retval = el.getAttribute(attributeName);
				if (Util.isNothing(retval) && !Util.isNothing(defaultValue)){
					retval = defaultValue;
				}
				return retval;
			
			},
			
			
			
			/*
			 * Function: el, attributeName
			 */
			setAttribute: function(el, attributeName, value){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._setAttribute(el[i], attributeName, value);
					}
				}
				else{
					Util.DOM._setAttribute(el, attributeName, value);
				}
				
			},
			_setAttribute: function(el, attributeName, value){
				
				el.setAttribute(attributeName, value);
				
			},
			
			
			
			/*
			 * Function: removeAttribute
			 */
			removeAttribute: function(el, attributeName){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._removeAttribute(el[i], attributeName);
					}
				}
				else{
					Util.DOM._removeAttribute(el, attributeName);
				}
			
			},
			_removeAttribute: function(el, attributeName){
				
				if (this.hasAttribute(el, attributeName)){
				
					el.removeAttribute(attributeName);
					
				}
				
			},
			
			
			
			/*
			 * Function: addClass
			 */
			addClass: function(el, className){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._addClass(el[i], className);
					}
				}
				else{
					Util.DOM._addClass(el, className);
				} 
				
			},
			_addClass: function(el, className){
				var 
					currentClassValue = Util.DOM.getAttribute(el, 'class', ''),
					re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
				
				if ( ! re.test(currentClassValue) ){
					if (currentClassValue !== ''){
						currentClassValue = currentClassValue + ' ';
					}
					currentClassValue = currentClassValue + className;
					Util.DOM.setAttribute(el, 'class', currentClassValue);
				}
			},
			
			
			
			/*
			 * Function: removeClass
			 */
			removeClass: function(el, className){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._removeClass(el[i], className);
					}
				}
				else{
					Util.DOM._removeClass(el, className);
				}
				
			},
			_removeClass: function(el, className){
				
				var 
					currentClassValue = Util.DOM.getAttribute(el, 'class', ''),
					classes = Util.trim(currentClassValue).split(' '),
					newClassVal = '',
					i, j;
				
				for (i=0, j=classes.length; i<j; i++){
					if (classes[i] !== className){
						if (newClassVal !== ''){
							newClassVal += ' ';
						}
						newClassVal += classes[i];
					}
				}
				
				if (newClassVal === ''){
					Util.DOM.removeAttribute(el, 'class');
				}
				else{
					Util.DOM.setAttribute(el, 'class', newClassVal);
				}
				
			},
			
			
			
			/*
			 * Function: hasClass
			 */
			hasClass: function(el, className){
				
				var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(Util.DOM.getAttribute(el, 'class', ''));
				
			},
			
			
			
			/*
			 * Function: setStyle
			 */
			setStyle: function(el, style, value){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._setStyle(el[i], style, value);
					}
				}
				else{
					Util.DOM._setStyle(el, style, value);
				}
				
			},
			_setStyle: function(el, style, value){
				
				var prop, val;
				
				if (Util.isObject(style)) {
					for(prop in style) {
						if(Util.objectHasProperty(style, prop)){
							
							if (prop === 'width'){
								Util.DOM.width(el, style[prop]);
							}
							else if (prop === 'height'){
								Util.DOM.height(el, style[prop]);
							}
							else{
								el.style[prop] = style[prop];
							}
						
						}
					}
				}
				else {
					el.style[style] = value;
				}
			},
			
			
			
			/*
			 * Function: getStyle
			 */
			getStyle: function(el, styleName){
				
				var retval = window.getComputedStyle(el,'').getPropertyValue(styleName);
				if (retval === ''){
					retval = el.style[styleName];
				}
				return retval;
				
			},
			
			
			
			/*
			 * Function: hide
			 */
			hide: function(el){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._hide(el[i]);
					}
				}
				else{
					Util.DOM._hide(el);
				}
				
			},
			_hide: function(el){
				
				// Store the current display value if we use show
				Util.DOM.setData(el, 'ccl-disp', Util.DOM.getStyle(el, 'display'));
				Util.DOM.setStyle(el, 'display', 'none');
				
			},
			
			
			
			/*
			 * Function: show
			 */
			show: function(el){
				
				if (Util.isLikeArray(el)){
					var i, len;
					for (i=0, len=el.length; i<len; i++){
						Util.DOM._show(el[i]);
					}
				}
				else{
					Util.DOM._show(el);
				}
				
			},
			_show: function(el){
				
				if (Util.DOM.getStyle(el, 'display') === 'none'){
					var oldDisplayValue = Util.DOM.getData(el, 'ccl-disp', 'block');
					if (oldDisplayValue === 'none' || oldDisplayValue === ''){
						oldDisplayValue = 'block';
					}
					Util.DOM.setStyle(el, 'display', oldDisplayValue);
				}
				
			},
			
			
			
			/*
			 * Function: width 
			 * Content width, excludes padding
			 */
			width: function(el, value){
				
				if (!Util.isNothing(value)){
					if (Util.isNumber(value)){
						value = value + 'px';
					}
					el.style.width = value;
				}
				
				return this._getDimension(el, 'width');
				
			},
			
			
			
			/*
			 * Function: outerWidth
			 */
			outerWidth: function(el){
				
				var retval = Util.DOM.width(el);
				
				retval += parseInt(Util.DOM.getStyle(el, 'padding-left'), 10) + parseInt(Util.DOM.getStyle(el, 'padding-right'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'margin-left'), 10) + parseInt(Util.DOM.getStyle(el, 'margin-right'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'border-left-width'), 10) + parseInt(Util.DOM.getStyle(el, 'border-right-width'), 10); 
				return retval;
			
			},
			
			
			
			/*
			 * Function: height 
			 * Content height, excludes padding
			 */
			height: function(el, value){
				
				if (!Util.isNothing(value)){
					if (Util.isNumber(value)){
						value = value + 'px';
					}
					el.style.height = value;
				}
				
				return this._getDimension(el, 'height');
				
			},
			
			
			
			/*
			 * Function: _getDimension
			 */
			_getDimension: function(el, dimension){
				
				var 
					retval = window.parseInt(window.getComputedStyle(el,'').getPropertyValue(dimension)),
					styleBackup;
				
				if (isNaN(retval)){
					
					// If this is the case, chances are the element is not displayed and we can't get
					// the width and height. This temporarily shows and hides to get the value
					styleBackup = { 
						display: el.style.display,
						left: el.style.left
					};
					
					el.style.display = 'block';
					el.style.left = '-1000000px';
					
					retval = window.parseInt(window.getComputedStyle(el,'').getPropertyValue(dimension));
					
					el.style.display = styleBackup.display;
					el.style.left = styleBackup.left;
				}
				return retval;
				
			},
			
			
			
			/*
			 * Function: outerHeight
			 */
			outerHeight: function(el){
				
				var retval = Util.DOM.height(el);
				
				retval += parseInt(Util.DOM.getStyle(el, 'padding-top'), 10) + parseInt(Util.DOM.getStyle(el, 'padding-bottom'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'margin-top'), 10) + parseInt(Util.DOM.getStyle(el, 'margin-bottom'), 10); 
				retval += parseInt(Util.DOM.getStyle(el, 'border-top-width'), 10) + parseInt(Util.DOM.getStyle(el, 'border-bottom-width'), 10); 
								
				return retval;
			
			},
			
			
			
			/*
			 * Function: documentWidth
			 */
			documentWidth: function(){
				
				return Util.DOM.width(document.documentElement);
				
			},


			
			/*
			 * Function: documentHeight
			 */
			documentHeight: function(){
				
				return Util.DOM.height(document.documentElement);
				
			},
			
			
			
			/*
			 * Function: documentOuterWidth
			 */
			documentOuterWidth: function(){
				
				return Util.DOM.width(document.documentElement);
				
			},

			
			
			/*
			 * Function: documentOuterHeight
			 */
			documentOuterHeight: function(){
				
				return Util.DOM.outerHeight(document.documentElement);
				
			},
			
			
			
			/*
			 * Function: bodyWidth
			 */
			bodyWidth: function(){
				
				return Util.DOM.width(document.body);
			
			},
			
			
			
			/*
			 * Function: bodyHeight
			 */
			bodyHeight: function(){
				
				return Util.DOM.height(document.body);
			
			},
			
			
			
			/*
			 * Function: bodyOuterWidth
			 */
			bodyOuterWidth: function(){
				
				return Util.DOM.outerWidth(document.body);
			
			},
			
			
			
			/*
			 * Function: bodyOuterHeight
			 */
			bodyOuterHeight: function(){
				
				return Util.DOM.outerHeight(document.body);
			
			},
			
			
			
			/*
			 * Function: windowWidth
			 */
			windowWidth: function(){
			
				return window.innerWidth;
			
			},
			
			
			
			/*
			 * Function: windowHeight
			 */
			windowHeight: function(){
			
				return window.innerHeight;
			
			},
			
			
			
			/*
			 * Function: windowScrollLeft
			 */
			windowScrollLeft: function(){
			
				return window.pageXOffset;
			
			},
			
			
			
			/*
			 * Function: windowScrollTop
			 */
			windowScrollTop: function(){
			
				return window.pageYOffset;
			
			}
			
		}
	
		
	});
	
	
}
(
	window,
	window.Code.Util
));
// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function (window, Util) {
	
	Util.extend(Util, {
		
		Animation: {
				
			_applyTransitionDelay: 50,
			
			_transitionEndLabel: (window.document.documentElement.style.webkitTransition !== undefined) ? "webkitTransitionEnd" : "transitionend",
			
			_transitionEndHandler: null,
			
			_transitionPrefix: (window.document.documentElement.style.webkitTransition !== undefined) ? "webkitTransition" : (window.document.documentElement.style.MozTransition !== undefined) ? "MozTransition" : "transition",
			
			_transformLabel: (window.document.documentElement.style.webkitTransform !== undefined) ? "webkitTransform" : (window.document.documentElement.style.MozTransition !== undefined) ? "MozTransform" : "transform",
						
			
			/*
			 * Function: _getTransitionEndHandler
			 */
			_getTransitionEndHandler: function(){
			
				if (Util.isNothing(this._transitionEndHandler)){
					this._transitionEndHandler = this._onTransitionEnd.bind(this);
				}
				
				return this._transitionEndHandler;
			
			},
			
			
			
			/*
			 * Function: stop
			 */
			stop: function(el){
				
				if (Util.Browser.isCSSTransformSupported){
					var 
						property = el.style[this._transitionPrefix + 'Property'],
						callbackLabel = (property !== '') ? 'ccl' + property + 'callback' : 'cclallcallback',
						style = {};
					
					Util.Events.remove(el, this._transitionEndLabel, this._getTransitionEndHandler());
					if (Util.isNothing(el.callbackLabel)){
						delete el.callbackLabel;
					}
					
					style[this._transitionPrefix + 'Property'] = '';
					style[this._transitionPrefix + 'Duration'] = '';
					style[this._transitionPrefix + 'TimingFunction'] = '';
					style[this._transitionPrefix + 'Delay'] = '';
					style[this._transformLabel] = '';
					
					Util.DOM.setStyle(el, style);
				}
				else if (!Util.isNothing(window.jQuery)){
				
					window.jQuery(el).stop(true, true);
				
				}
				
			
			},
			
			
			
			/*
			 * Function: fadeIn
			 */
			fadeIn: function(el, speed, callback, timingFunction, opacity){
				
				opacity = Util.coalesce(opacity, 1);
				if (opacity <= 0){
					opacity = 1;
				}
				
				if (speed <= 0){
					Util.DOM.setStyle(el, 'opacity', opacity);
					if (!Util.isNothing(callback)){
						callback(el);
						return;
					}
				}
				
				var currentOpacity = Util.DOM.getStyle(el, 'opacity');
				
				if (currentOpacity >= 1){
					Util.DOM.setStyle(el, 'opacity', 0);
				}
				
				if (Util.Browser.isCSSTransformSupported){
					this._applyTransition(el, 'opacity', opacity, speed, callback, timingFunction);
				}
				else if (!Util.isNothing(window.jQuery)){
					window.jQuery(el).fadeTo(speed, opacity, callback);
				}
				
			},
			
			
			
			/*
			 * Function: fadeTo
			 */
			fadeTo: function(el, opacity, speed, callback, timingFunction){
				this.fadeIn(el, speed, callback, timingFunction, opacity);
			},
			
			
			
			/*
			 * Function: fadeOut
			 */
			fadeOut: function(el, speed, callback, timingFunction){
				
				if (speed <= 0){
					Util.DOM.setStyle(el, 'opacity', 0);
					if (!Util.isNothing(callback)){
						callback(el);
						return;
					}
				}
				
				if (Util.Browser.isCSSTransformSupported){
				
					this._applyTransition(el, 'opacity', 0, speed, callback, timingFunction);
					
				}
				else{
				
					window.jQuery(el).fadeTo(speed, 0, callback);
				
				}
				
			},
			
			
			
			/*
			 * Function: slideBy
			 */
			slideBy: function(el, x, y, speed, callback, timingFunction){
			
				var style = {};
				
				x = Util.coalesce(x, 0);
				y = Util.coalesce(y, 0);
				timingFunction = Util.coalesce(timingFunction, 'ease-out');
				
				style[this._transitionPrefix + 'Property'] = 'all';
				style[this._transitionPrefix + 'Delay'] = '0';
				
				if (speed === 0){
					style[this._transitionPrefix + 'Duration'] = '';
					style[this._transitionPrefix + 'TimingFunction'] = '';
				}
				else{
					style[this._transitionPrefix + 'Duration'] = speed + 'ms';
					style[this._transitionPrefix + 'TimingFunction'] = Util.coalesce(timingFunction, 'ease-out');
					
					Util.Events.add(el, this._transitionEndLabel, this._getTransitionEndHandler());
					
				}
				
				style[this._transformLabel] = (Util.Browser.is3dSupported) ? 'translate3d(' + x + 'px, ' + y + 'px, 0px)' : 'translate(' + x + 'px, ' + y + 'px)';
				
				if (!Util.isNothing(callback)){
					el.cclallcallback = callback;
				}
				
				Util.DOM.setStyle(el, style);
				
				if (speed === 0){
					window.setTimeout(function(){
						this._leaveTransforms(el);
					}.bind(this), this._applyTransitionDelay);
				}
				
			},
			
			
			
			/*
			 * Function: 
			 */
			resetTranslate: function(el){
				
				var style = {};
				style[this._transformLabel] = style[this._transformLabel] = (Util.Browser.is3dSupported) ? 'translate3d(0px, 0px, 0px)' : 'translate(0px, 0px)';
				Util.DOM.setStyle(el, style);
			
			},
			
			
			
			/*
			 * Function: _applyTransition
			 */
			_applyTransition: function(el, property, val, speed, callback, timingFunction){
					
				var style = {};
				
				timingFunction = Util.coalesce(timingFunction, 'ease-in');
				
				style[this._transitionPrefix + 'Property'] = property;
				style[this._transitionPrefix + 'Duration'] = speed + 'ms';
				style[this._transitionPrefix + 'TimingFunction'] = timingFunction;
				style[this._transitionPrefix + 'Delay'] = '0';
				
				Util.Events.add(el, this._transitionEndLabel, this._getTransitionEndHandler());
				
				Util.DOM.setStyle(el, style);
				
				if (!Util.isNothing(callback)){
					el['ccl' + property + 'callback'] = callback;
				}
				
				window.setTimeout(function(){
					Util.DOM.setStyle(el, property, val);
				}, this._applyTransitionDelay);	
				
			},
			
			
			
			/*
			 * Function: _onTransitionEnd
			 */
			_onTransitionEnd: function(e){
				
				Util.Events.remove(e.currentTarget, this._transitionEndLabel, this._getTransitionEndHandler());
				this._leaveTransforms(e.currentTarget);
			
			},
			
			
			
			/*
			 * Function: _leaveTransforms
			 */
			_leaveTransforms: function(el){
				
				var 
						property = el.style[this._transitionPrefix + 'Property'],
						callbackLabel = (property !== '') ? 'ccl' + property + 'callback' : 'cclallcallback',
						callback,
						transform = Util.coalesce(el.style.webkitTransform, el.style.MozTransform, el.style.transform),
						transformMatch, 
						transformExploded,
						domX = window.parseInt(Util.DOM.getStyle(el, 'left'), 0),
						domY = window.parseInt(Util.DOM.getStyle(el, 'top'), 0),
						transformedX,
						transformedY,
						style = {};
					
				if (transform !== ''){
					if (Util.Browser.is3dSupported){
						transformMatch = transform.match( /translate3d\((.*?)\)/ );
					}
					else{
						transformMatch = transform.match( /translate\((.*?)\)/ );
					}
					if (!Util.isNothing(transformMatch)){
						transformExploded = transformMatch[1].split(', ');
						transformedX = window.parseInt(transformExploded[0], 0);
						transformedY = window.parseInt(transformExploded[1], 0);
					}
				}
				
				style[this._transitionPrefix + 'Property'] = '';
				style[this._transitionPrefix + 'Duration'] = '';
				style[this._transitionPrefix + 'TimingFunction'] = '';
				style[this._transitionPrefix + 'Delay'] = '';
				
				Util.DOM.setStyle(el, style);
				
				window.setTimeout(function(){
					
					if(!Util.isNothing(transformExploded)){
						
						style = {};
						style[this._transformLabel] = '';
						style.left = (domX + transformedX) + 'px';
						style.top = (domY + transformedY) + 'px';
						
						Util.DOM.setStyle(el, style);
						
					}
					
					if (!Util.isNothing(el[callbackLabel])){
						callback = el[callbackLabel];
						delete el[callbackLabel];
						callback(el);
					}
					
				}.bind(this), this._applyTransitionDelay);
				
			}
			
			
		}
		
		
	});
	
	
}
(
	window,
	window.Code.Util
));
// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.Util.TouchElement');
	
	
	Util.TouchElement.EventTypes = {
	
		onTouch: 'CodeUtilTouchElementOnTouch'
	
	};
	
	
	Util.TouchElement.ActionTypes = {
		
		touchStart: 'touchStart',
		touchMove: 'touchMove',
		touchEnd: 'touchEnd',
		touchMoveEnd: 'touchMoveEnd',
		tap: 'tap',
		doubleTap: 'doubleTap',
		swipeLeft: 'swipeLeft',
		swipeRight: 'swipeRight',
		swipeUp: 'swipeUp',
		swipeDown: 'swipeDown',
		gestureStart: 'gestureStart',
		gestureChange: 'gestureChange',
		gestureEnd: 'gestureEnd'
	
	};
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.Util.TouchElement');
	
	
	Util.TouchElement.TouchElementClass = klass({
		
		el: null,
		
		captureSettings: null,
		
		touchStartPoint: null,
		touchEndPoint: null,
		touchStartTime: null,
		doubleTapTimeout: null,
		
		touchStartHandler: null,
		touchMoveHandler: null,
		touchEndHandler: null,
		
		mouseDownHandler: null,
		mouseMoveHandler: null,
		mouseUpHandler: null,
		mouseOutHandler: null,
		
		gestureStartHandler: null,
		gestureChangeHandler: null,
		gestureEndHandler: null,
		
		swipeThreshold: null,
		swipeTimeThreshold: null,
		doubleTapSpeed: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			this.removeEventHandlers();
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(el, captureSettings){
			
			this.el = el;
			
			this.captureSettings = {
				swipe: false,
				move: false,
				gesture: false,
				doubleTap: false,
				preventDefaultTouchEvents: true
			};
			
			Util.extend(this.captureSettings, captureSettings);
			
			this.swipeThreshold = 50;
			this.swipeTimeThreshold = 250;
			this.doubleTapSpeed = 250;
			
			this.touchStartPoint = { x: 0, y: 0 };
			this.touchEndPoint = { x: 0, y: 0 };
			
		},
		
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
		
			if (Util.isNothing(this.touchStartHandler)){
				this.touchStartHandler = this.onTouchStart.bind(this);
				this.touchMoveHandler = this.onTouchMove.bind(this);
				this.touchEndHandler = this.onTouchEnd.bind(this);
				this.mouseDownHandler = this.onMouseDown.bind(this);
				this.mouseMoveHandler = this.onMouseMove.bind(this);
				this.mouseUpHandler = this.onMouseUp.bind(this);
				this.mouseOutHandler = this.onMouseOut.bind(this);
				this.gestureStartHandler = this.onGestureStart.bind(this);
				this.gestureChangeHandler = this.onGestureChange.bind(this);
				this.gestureEndHandler = this.onGestureEnd.bind(this);
			}
			
			Util.Events.add(this.el, 'touchstart', this.touchStartHandler);
			if (this.captureSettings.move){
				Util.Events.add(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.add(this.el, 'touchend', this.touchEndHandler);
			
			Util.Events.add(this.el, 'mousedown', this.mouseDownHandler);
			
			if (Util.Browser.isGestureSupported && this.captureSettings.gesture){
				Util.Events.add(this.el, 'gesturestart', this.gestureStartHandler);
				Util.Events.add(this.el, 'gesturechange', this.gestureChangeHandler);
				Util.Events.add(this.el, 'gestureend', this.gestureEndHandler);
			}
			
		},
		
		
		
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
			
			Util.Events.remove(this.el, 'touchstart', this.touchStartHandler);
			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);
			Util.Events.remove(this.el, 'mousedown', this.mouseDownHandler);
			
			if (Util.Browser.isGestureSupported && this.captureSettings.gesture){
				Util.Events.remove(this.el, 'gesturestart', this.gestureStartHandler);
				Util.Events.remove(this.el, 'gesturechange', this.gestureChangeHandler);
				Util.Events.remove(this.el, 'gestureend', this.gestureEndHandler);
			}
			
		},
		
		
		
		/*
		 * Function: getTouchPoint
		 */
		getTouchPoint: function(touches){
			
			return {
				x: touches[0].pageX,
				y: touches[0].pageY
			};
			
		},
		
		
		
		/*
		 * Function: fireTouchEvent
		 */
		fireTouchEvent: function(e){
			
			var 
				action,
				distX = 0,
				distY = 0,
				dist = 0,
				self,
				endTime,
				diffTime;

			distX = this.touchEndPoint.x - this.touchStartPoint.x;
			distY = this.touchEndPoint.y - this.touchStartPoint.y;
			dist = Math.sqrt( (distX * distX) + (distY * distY) );
			
			if (this.captureSettings.swipe){
				endTime = new Date();
				diffTime = endTime - this.touchStartTime;
				
				// See if there was a swipe gesture
				if (diffTime <= this.swipeTimeThreshold){
					
					if (window.Math.abs(distX) >= this.swipeThreshold){
					
						Util.Events.fire(this, { 
							type: Util.TouchElement.EventTypes.onTouch, 
							target: this, 
							point: this.touchEndPoint,
							action: (distX < 0) ? Util.TouchElement.ActionTypes.swipeLeft : Util.TouchElement.ActionTypes.swipeRight,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;
						
					}
					
					
					if (window.Math.abs(distY) >= this.swipeThreshold){
						
						Util.Events.fire(this, { 
							type: Util.TouchElement.EventTypes.onTouch, 
							target: this, 
							point: this.touchEndPoint,
							action: (distY < 0) ? Util.TouchElement.ActionTypes.swipeUp : Util.TouchElement.ActionTypes.swipeDown,
							targetEl: e.target,
							currentTargetEl: e.currentTarget
						});
						return;
					
					}
					
				}
			}
			
			
			if (dist > 1){
			
				Util.Events.fire(this, { 
					type: Util.TouchElement.EventTypes.onTouch, 
					target: this, 
					action: Util.TouchElement.ActionTypes.touchMoveEnd,
					point: this.touchEndPoint,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				return;
			}
			
			
			if (!this.captureSettings.doubleTap){
				
				Util.Events.fire(this, { 
					type: Util.TouchElement.EventTypes.onTouch, 
					target: this, 
					point: this.touchEndPoint,
					action: Util.TouchElement.ActionTypes.tap,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				return;
				
			}
			
			if (Util.isNothing(this.doubleTapTimeout)){
				
				this.doubleTapTimeout = window.setTimeout(function(){
					
					this.doubleTapTimeout = null;
					
					Util.Events.fire(this, { 
						type: Util.TouchElement.EventTypes.onTouch, 
						target: this, 
						point: this.touchEndPoint,
						action: Util.TouchElement.ActionTypes.tap,
						targetEl: e.target,
						currentTargetEl: e.currentTarget
					});
					
				}.bind(this), this.doubleTapSpeed);
				
				return;
				
			}
			else{
				
				window.clearTimeout(this.doubleTapTimeout);
				this.doubleTapTimeout = null;
			
				Util.Events.fire(this, { 
					type: Util.TouchElement.EventTypes.onTouch, 
					target: this, 
					point: this.touchEndPoint,
					action: Util.TouchElement.ActionTypes.doubleTap,
					targetEl: e.target,
					currentTargetEl: e.currentTarget
				});
				
			}
			
		},
		
		
		
		/*
		 * Function: onTouchStart
		 */
		onTouchStart: function(e){
			
			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}
			
			// No longer need mouse events
			Util.Events.remove(this.el, 'mousedown', this.mouseDownHandler);
			
			var 
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches;
			
			if (touches.length > 1 && this.captureSettings.gesture){
				this.isGesture = true;
				return;
			}
			
			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = this.getTouchPoint(touches);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
			
		},
		
		
		
		/*
		 * Function: onTouchMove
		 */
		onTouchMove: function(e){
			
			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}
			
			if (this.isGesture && this.captureSettings.gesture){
				return;
			}
			
			var 
				touchEvent = Util.Events.getTouchEvent(e),
				touches = touchEvent.touches;
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchMove,
				point: this.getTouchPoint(touches),
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
		},
		
		
		
		/*
		 * Function: onTouchEnd
		 */
		onTouchEnd: function(e){
			
			if (this.isGesture && this.captureSettings.gesture){
				return;
			}
			
			if (this.captureSettings.preventDefaultTouchEvents){
				e.preventDefault();
			}
			
			// http://backtothecode.blogspot.com/2009/10/javascript-touch-and-gesture-events.html
			// iOS removed the current touch from e.touches on "touchend"
			// Need to look into e.changedTouches
			
			var 
				touchEvent = Util.Events.getTouchEvent(e),
				touches = (!Util.isNothing(touchEvent.changedTouches)) ? touchEvent.changedTouches : touchEvent.touches;
			
			this.touchEndPoint = this.getTouchPoint(touches);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
				
			this.fireTouchEvent(e);
			
		},
		
		
		
		/*
		 * Function: onMouseDown
		 */
		onMouseDown: function(e){
			
			e.preventDefault();
			
			// No longer need touch events
			Util.Events.remove(this.el, 'touchstart', this.mouseDownHandler);
			Util.Events.remove(this.el, 'touchmove', this.touchMoveHandler);
			Util.Events.remove(this.el, 'touchend', this.touchEndHandler);
			
			// Add move/up/out
			if (this.captureSettings.move){
				Util.Events.add(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.add(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.add(this.el, 'mouseout', this.mouseOutHandler);
			
			this.touchStartTime = new Date();
			this.isGesture = false;
			this.touchStartPoint = Util.Events.getMousePosition(e);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchStart,
				point: this.touchStartPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
		},
		
		
		
		/*
		 * Function: onMouseMove
		 */
		onMouseMove: function(e){
			
			e.preventDefault();
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchMove,
				point: Util.Events.getMousePosition(e),
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
		},
		
		
		
		/*
		 * Function: onMouseUp
		 */
		onMouseUp: function(e){
			
			e.preventDefault();
			
			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.remove(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.remove(this.el, 'mouseout', this.mouseOutHandler);
			
			this.touchEndPoint = Util.Events.getMousePosition(e);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
			this.fireTouchEvent(e);
		
		},
		
		
		
		/*
		 * Function: onMouseOut
		 */
		onMouseOut: function(e){
			
			/*
			 * http://blog.stchur.com/2007/03/15/mouseenter-and-mouseleave-events-for-firefox-and-other-non-ie-browsers/
			 */
			var relTarget = e.relatedTarget;
			if (this.el === relTarget || Util.DOM.isChildOf(relTarget, this.el)){ 
				return;
			}
			
			e.preventDefault();
			
			if (this.captureSettings.move){
				Util.Events.remove(this.el, 'mousemove', this.mouseMoveHandler);
			}
			Util.Events.remove(this.el, 'mouseup', this.mouseUpHandler);
			Util.Events.remove(this.el, 'mouseout', this.mouseOutHandler);
			
			this.touchEndPoint = Util.Events.getMousePosition(e);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.touchEnd,
				point: this.touchEndPoint,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
			this.fireTouchEvent(e);
			
		},
		
		
		
		/*
		 * Function: onGestureStart
		 */
		onGestureStart: function(e){
		
			e.preventDefault();
			
			var touchEvent = Util.Events.getTouchEvent(e);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.gestureStart,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
		
		},
		
		
		
		/*
		 * Function: onGestureChange
		 */
		onGestureChange: function(e){
		
			e.preventDefault();
			
			var touchEvent = Util.Events.getTouchEvent(e);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.gestureChange,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
		},
		
		
		
		/*
		 * Function: onGestureEnd
		 */
		onGestureEnd: function(e){
		
			e.preventDefault();
			
			var touchEvent = Util.Events.getTouchEvent(e);
			
			Util.Events.fire(this, { 
				type: Util.TouchElement.EventTypes.onTouch, 
				target: this, 
				action: Util.TouchElement.ActionTypes.gestureEnd,
				scale: touchEvent.scale,
				rotation: touchEvent.rotation,
				targetEl: e.target,
				currentTargetEl: e.currentTarget
			});
			
		}
		
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Image');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.Image.EventTypes = {
		
		onLoad: 'onLoad',
		onError: 'onError'
		
	};
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Image');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.Image.ImageClass = klass({
		
		
		
		refObj: null,
		imageEl: null,
		src: null,
		caption: null,
		metaData: null,
		imageLoadHandler: null,
		imageErrorHandler: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop, i;
			
			this.shrinkImage();
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(refObj, src, caption, metaData){
			
			this.refObj = refObj;
			// This is needed. Webkit resolves the src
			// value which means we can't compare against it in the load function
			this.originalSrc = src;
			this.src = src;
			this.caption = caption;
			this.metaData = metaData;
			
			this.imageEl = new window.Image();
			
			this.imageLoadHandler = this.onImageLoad.bind(this);
			this.imageErrorHandler = this.onImageError.bind(this);
			
		},
		
		
		
		/*
		 * Function: load
		 */
		load: function(){
			
			this.imageEl.originalSrc = Util.coalesce(this.imageEl.originalSrc, '');
			
			if (this.imageEl.originalSrc === this.src){
				
				if (this.imageEl.isError){
					Util.Events.fire(this, {
						type: PhotoSwipe.Image.EventTypes.onError,
						target: this
					});
				}
				else{
					Util.Events.fire(this, {
						type: PhotoSwipe.Image.EventTypes.onLoad,
						target: this
					});
				}
				return;
			}
			
			this.imageEl.isError = false;
			this.imageEl.isLoading = true;
			this.imageEl.naturalWidth = null;
			this.imageEl.naturalHeight = null;
			this.imageEl.isLandscape = false;
			this.imageEl.onload = this.imageLoadHandler;
			this.imageEl.onerror = this.imageErrorHandler;
			this.imageEl.onabort = this.imageErrorHandler;
			this.imageEl.originalSrc = this.src;
			this.imageEl.src = this.src;
			
		},
		
		
		
		/*
		 * Function: shrinkImage
		 */
		shrinkImage: function(){
		
			if (Util.isNothing(this.imageEl)){
				return;
			}
			
			if (this.imageEl.src.indexOf(this.src) > -1){
				this.imageEl.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
				if (!Util.isNothing(this.imageEl.parentNode)){
					Util.DOM.removeChild(this.imageEl, this.imageEl.parentNode);
				}
			}
		
		},
		
		
		
		/*
		 * Function: onImageLoad
		 */
		onImageLoad: function(e){
			
			this.imageEl.onload = null;
			this.imageEl.naturalWidth = Util.coalesce(this.imageEl.naturalWidth, this.imageEl.width);
			this.imageEl.naturalHeight = Util.coalesce(this.imageEl.naturalHeight, this.imageEl.height);
			this.imageEl.isLandscape = (this.imageEl.naturalWidth > this.imageEl.naturalHeight);
			this.imageEl.isLoading = false;
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Image.EventTypes.onLoad,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: onImageError
		 */
		onImageError: function(e){
		
			this.imageEl.onload = null;
			this.imageEl.onerror = null;
			this.imageEl.onabort = null;
			this.imageEl.isLoading = false;
			this.imageEl.isError = true;
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Image.EventTypes.onError,
				target: this
			});
			
		}
		
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Cache');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.Cache.Mode = {
		
		normal: 'normal',
		aggressive: 'aggressive'
		
	};
	
	
	
	PhotoSwipe.Cache.Functions = {
		
		/*
		 * Function: getImageSource
		 * Default method for returning an image's source
		 */
		getImageSource: function(el){
			return el.href;
		},
	
	
	
		/*
		 * Function: getImageCaption
		 * Default method for returning an image's caption
		 * Assumes the el is an anchor and the first child is the
		 * image. The returned value is the "alt" attribute of the
		 * image.
		 */
		getImageCaption: function(el){
			
			if (el.nodeName === "IMG"){
				return Util.DOM.getAttribute(el, 'alt'); 
			}
			var i, j, childEl;
			for (i=0, j=el.childNodes.length; i<j; i++){
				childEl = el.childNodes[i];
				if (el.childNodes[i].nodeName === 'IMG'){
					return Util.DOM.getAttribute(childEl, 'alt'); 
				}
			}
			
		},
	
	
	
		/*
		 * Function: getImageMetaData
		 * Can be used if you wish to store additional meta
		 * data against the full size image
		 */
		getImageMetaData: function(el){
			
			return  {};
			
		}
		
	};
	
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Cache');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.Cache.CacheClass = klass({
		
		
		
		images: null,
		settings: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop, i, j;
			
			if (!Util.isNothing(this.images)){
				for (i=0, j=this.images.length; i<j; i++){
					this.images[i].dispose();
				}
				this.images.length = 0;
			}
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(images, options){
			
			var i, j, cacheImage, image, src, caption, metaData;
			
			this.settings = options;
			
			this.images = [];
			
			for (i=0, j=images.length; i<j; i++){
				
				image = images[i];
				src = this.settings.getImageSource(image);
				caption = this.settings.getImageCaption(image);
				metaData = this.settings.getImageMetaData(image);
				
				this.images.push(new PhotoSwipe.Image.ImageClass(image, src, caption, metaData));
				
			}
			
			
		},
		
		
		
		/*
		 * Function: getImages
		 */
		getImages: function(indexes){
		
			var i, j, retval = [], cacheImage;
			
			for (i=0, j=indexes.length; i<j; i++){
				cacheImage = this.images[indexes[i]];
				if (this.settings.cacheMode === PhotoSwipe.Cache.Mode.aggressive){
					cacheImage.cacheDoNotShrink = true;
				}
				retval.push(cacheImage);
			}
			
			if (this.settings.cacheMode === PhotoSwipe.Cache.Mode.aggressive){
				for (i=0, j=this.images.length; i<j; i++){
					cacheImage = this.images[i];
					if (!Util.objectHasProperty(cacheImage, 'cacheDoNotShrink')){
						cacheImage.shrinkImage();
					}
					else{
						delete cacheImage.cacheDoNotShrink;
					}
				}
			}
			
			return retval;
			
		}
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util,
	window.Code.PhotoSwipe.Image
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.DocumentOverlay');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.DocumentOverlay.CssClasses = {
		documentOverlay: 'ps-document-overlay'
	};
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.DocumentOverlay');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.DocumentOverlay.DocumentOverlayClass = klass({
		
		
		
		el: null,
		settings: null,
		initialBodyHeight: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			Util.Animation.stop(this.el);
			Util.DOM.removeChild(this.el, this.el.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(options){
			
			this.settings = options;
			
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.DocumentOverlay.CssClasses.documentOverlay
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: this.settings.zIndex
			});
		
			Util.DOM.hide(this.el);
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.el);
			}
			else{
				Util.DOM.appendChild(this.el, this.settings.target);
			}
			
			Util.Animation.resetTranslate(this.el);
			
			// Store this value incase the body dimensions change to zero!
			// I've seen it happen! :D
			this.initialBodyHeight = Util.DOM.bodyOuterHeight();
			
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var width, height, top;
			
			if (this.settings.target === window){
				
				width = Util.DOM.windowWidth();
				height = Util.DOM.bodyOuterHeight() * 2; // This covers extra height added by photoswipe
				top = (this.settings.jQueryMobile) ? Util.DOM.windowScrollTop() + 'px' : '0px';
				
				if (height < 1){
					height = this.initialBodyHeight;
				}

				if (Util.DOM.windowHeight() > height){
					height = Util.DOM.windowHeight();
				}
				
			}
			else{
				
				width = Util.DOM.width(this.settings.target);
				height = Util.DOM.height(this.settings.target);
				top = '0px';
				
			}
			
			Util.DOM.setStyle(this.el, {
				width: width,
				height: height,
				top: top
			});
		
		},
		
		
		
		/*
		 * Function: fadeIn
		 */
		fadeIn: function(speed, callback){
		
			this.resetPosition();
			
			Util.DOM.setStyle(this.el, 'opacity', 0);
			Util.DOM.show(this.el);
			
			Util.Animation.fadeIn(this.el, speed, callback);
		
		}
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Carousel');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.Carousel.EventTypes = {
	
		onSlideByEnd: 'PhotoSwipeCarouselOnSlideByEnd',
		onSlideshowStart: 'PhotoSwipeCarouselOnSlideshowStart',
		onSlideshowStop: 'PhotoSwipeCarouselOnSlideshowStop'
		
	};
	
	
	
	PhotoSwipe.Carousel.CssClasses = {
		carousel: 'ps-carousel',
		content: 'ps-carousel-content',
		item: 'ps-carousel-item',
		itemLoading: 'ps-carousel-item-loading',
		itemError: 'ps-carousel-item-error'
	};
	
	
	
	PhotoSwipe.Carousel.SlideByAction = {
		previous: 'previous',
		current: 'current',
		next: 'next'
	};
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Carousel');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Carousel.CarouselClass = klass({
		
		
		
		el: null,
		contentEl: null,
		settings: null,
		cache: null,
		slideByEndHandler: null,
		currentCacheIndex: null,
		isSliding: null,
		isSlideshowActive: null,
		lastSlideByAction: null,
		touchStartPoint: null,
		touchStartPosition: null,
		imageLoadHandler: null,
		imageErrorHandler: null,
		slideshowTimeout: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop, i, j;
			
			for (i=0, j=this.cache.images.length; i<j; i++){
				Util.Events.remove(this.cache.images[i], PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
				Util.Events.remove(this.cache.images[i], PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			}
			
			this.stopSlideshow();
			Util.Animation.stop(this.el);
			Util.DOM.removeChild(this.el, this.el.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(cache, options){
			
			//this.supr(true);
			
			var i, totalItems, itemEl;
			
			this.cache = cache;
			this.settings = options;
			this.slideByEndHandler = this.onSlideByEnd.bind(this);
			this.imageLoadHandler = this.onImageLoad.bind(this);
			this.imageErrorHandler = this.onImageError.bind(this);
			this.currentCacheIndex = 0;
			this.isSliding = false;
			this.isSlideshowActive = false;
			
			// No looping if < 3 images
			if (this.cache.images.length < 3){
				this.settings.loop = false;
			}
			
			// Main container 
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.Carousel.CssClasses.carousel
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0,
				overflow: 'hidden',
				zIndex: this.settings.zIndex
			});
			Util.DOM.hide(this.el);
			
			
			// Content
			this.contentEl = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.Carousel.CssClasses.content
				}, 
				''
			);
			Util.DOM.setStyle(this.contentEl, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0
			});
			
			Util.DOM.appendChild(this.contentEl, this.el);
			
			
			// Items
			totalItems = (cache.images.length < 3) ? cache.images.length : 3;
			
			for (i=0; i<totalItems; i++){
				
				itemEl = Util.DOM.createElement(
					'div', 
					{ 
						'class': PhotoSwipe.Carousel.CssClasses.item + 
						' ' + PhotoSwipe.Carousel.CssClasses.item + '-'+ i
					}, 
					''
				);
				Util.DOM.setAttribute(itemEl, 'style', 'float: left;');
				Util.DOM.setStyle(itemEl, {
					display: 'block',
					position: 'relative',
					left: 0,
					top: 0,
					overflow: 'hidden'
				});
				
				if (this.settings.margin > 0){
					Util.DOM.setStyle(itemEl, {
						marginRight: this.settings.margin + 'px'
					});
				}
				
				Util.DOM.appendChild(itemEl, this.contentEl);
				
			}
			
			
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.el);
			}
			else{
				Util.DOM.appendChild(this.el, this.settings.target);
			}
			
		},
		
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			var width, height, top, itemWidth, itemEls, contentWidth, i, j, itemEl, imageEl;
			
			if (this.settings.target === window){
				width = Util.DOM.windowWidth();
				height = Util.DOM.windowHeight();
				top = Util.DOM.windowScrollTop()  + 'px';
			}
			else{
				width = Util.DOM.width(this.settings.target);
				height = Util.DOM.height(this.settings.target);
				top = '0px';
			}
			
			itemWidth = (this.settings.margin > 0) ? width + this.settings.margin : width;
			itemEls = Util.DOM.find('.' + PhotoSwipe.Carousel.CssClasses.item, this.contentEl);
			contentWidth = itemWidth * itemEls.length;
			
			
			// Set the height and width to fill the document
			Util.DOM.setStyle(this.el, {
				top: top,
				width: width,
				height: height
			});
			
			
			// Set the height and width of the content el
			Util.DOM.setStyle(this.contentEl, {
				width: contentWidth,
				height: height
			});
			
			
			// Set the height and width of item elements
			for (i=0, j=itemEls.length; i<j; i++){
				
				itemEl = itemEls[i];
				Util.DOM.setStyle(itemEl, {
					width: width,
					height: height
				});
				
				// If an item has an image then resize that
				imageEl = Util.DOM.find('img', itemEl)[0];
				if (!Util.isNothing(imageEl)){
					this.resetImagePosition(imageEl);
				}
				
			}
			
			this.setContentLeftPosition();
			
			
		},
		
		
		
		/*
		 * Function: resetImagePosition
		 */
		resetImagePosition: function(imageEl){
			
			if (Util.isNothing(imageEl)){
				return;
			}
			
			var 
				src = Util.DOM.getAttribute(imageEl, 'src'),
				scale, 
				newWidth, 
				newHeight, 
				newTop, 
				newLeft,
				maxWidth = Util.DOM.width(this.el),
				maxHeight = Util.DOM.height(this.el);
			
			if (this.settings.imageScaleMethod === 'fitNoUpscale'){
				
				newWidth = imageEl.naturalWidth;
				newHeight =imageEl.naturalHeight;
				
				if (newWidth > maxWidth){
					scale = maxWidth / newWidth;
					newWidth = Math.round(newWidth * scale);
					newHeight = Math.round(newHeight * scale);
				}
				
				if (newHeight > maxHeight){
					scale = maxHeight / newHeight;
					newHeight = Math.round(newHeight * scale);
					newWidth = Math.round(newWidth * scale);
				}
				
			}
			else{
				
				if (imageEl.isLandscape) {
					// Ensure the width fits the screen
					scale = maxWidth / imageEl.naturalWidth;
				}
				else {
					// Ensure the height fits the screen
					scale = maxHeight / imageEl.naturalHeight;
				}
				
				newWidth = Math.round(imageEl.naturalWidth * scale);
				newHeight = Math.round(imageEl.naturalHeight * scale);
				
				if (this.settings.imageScaleMethod === 'zoom'){
					
					scale = 1;
					if (newHeight < maxHeight){
						scale = maxHeight /newHeight;	
					}
					else if (newWidth < maxWidth){
						scale = maxWidth /newWidth;	
					}
					
					if (scale !== 1) {
						newWidth = Math.round(newWidth * scale);
						newHeight = Math.round(newHeight * scale);
					}
					
				}
				else if (this.settings.imageScaleMethod === 'fit') {
					// Rescale again to ensure full image fits into the viewport
					scale = 1;
					if (newWidth > maxWidth) {
						scale = maxWidth / newWidth;
					}
					else if (newHeight > maxHeight) {
						scale = maxHeight / newHeight;
					}
					if (scale !== 1) {
						newWidth = Math.round(newWidth * scale);
						newHeight = Math.round(newHeight * scale);
					}
				}
			
			}
			
			newTop = Math.round( ((maxHeight - newHeight) / 2) ) + 'px';
			newLeft = Math.round( ((maxWidth - newWidth) / 2) ) + 'px';
			
			Util.DOM.setStyle(imageEl, {
				position: 'absolute',
				width: newWidth,
				height: newHeight,
				top: newTop,
				left: newLeft,
				display: 'block'
			});
		
		},
		
		
		
		/*
		 * Function: setContentLeftPosition
		 */
		setContentLeftPosition: function(){
		
			var width, itemEls, left;
			if (this.settings.target === window){
				width = Util.DOM.windowWidth();
			}
			else{
				width = Util.DOM.width(this.settings.target);
			}
			
			itemEls = this.getItemEls();
			left = 0;
				
			if (this.settings.loop){
				left = (width + this.settings.margin) * -1;
			}
			else{
				
				if (this.currentCacheIndex === this.cache.images.length-1){
					left = ((itemEls.length-1) * (width + this.settings.margin)) * -1;
				}
				else if (this.currentCacheIndex > 0){
					left = (width + this.settings.margin) * -1;
				}
				
			}
			
			Util.DOM.setStyle(this.contentEl, {
				left: left + 'px'
			});
			
		},
		
		
		
		/*
		 * Function: 
		 */
		show: function(index){
			
			this.currentCacheIndex = index;
			this.resetPosition();
			this.setImages(false);
			Util.DOM.show(this.el);
			
			Util.Animation.resetTranslate(this.contentEl);
			var 
				itemEls = this.getItemEls(),
				i, j;
			for (i=0, j=itemEls.length; i<j; i++){
				Util.Animation.resetTranslate(itemEls[i]);
			}
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Carousel.EventTypes.onSlideByEnd,
				target: this,
				action: PhotoSwipe.Carousel.SlideByAction.current,
				cacheIndex: this.currentCacheIndex
			});
			
		},
		
		
		
		/*
		 * Function: setImages
		 */
		setImages: function(ignoreCurrent){
			
			var 
				cacheImages,
				itemEls = this.getItemEls(),
				nextCacheIndex = this.currentCacheIndex + 1,
				previousCacheIndex = this.currentCacheIndex - 1;
			
			if (this.settings.loop){
				
				if (nextCacheIndex > this.cache.images.length-1){
					nextCacheIndex = 0;
				}
				if (previousCacheIndex < 0){
					previousCacheIndex = this.cache.images.length-1;
				}
				
				cacheImages = this.cache.getImages([
					previousCacheIndex,
					this.currentCacheIndex,
					nextCacheIndex
				]);
				
				if (!ignoreCurrent){
					// Current
					this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
				}
				// Next
				this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
				// Previous
				this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
				
			}
			else{
			
				if (itemEls.length === 1){
					if (!ignoreCurrent){
						// Current
						cacheImages = this.cache.getImages([
							this.currentCacheIndex
						]);
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
				}
				else if (itemEls.length === 2){
					
					if (this.currentCacheIndex === 0){
						cacheImages = this.cache.getImages([
							this.currentCacheIndex,
							this.currentCacheIndex + 1
						]);
						if (!ignoreCurrent){
							this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
						}
						this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
					}
					else{
						cacheImages = this.cache.getImages([
							this.currentCacheIndex - 1,
							this.currentCacheIndex
						]);
						if (!ignoreCurrent){
							this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						}
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
					
				}
				else{
					
					if (this.currentCacheIndex === 0){
						cacheImages = this.cache.getImages([
							this.currentCacheIndex,
							this.currentCacheIndex + 1,
							this.currentCacheIndex + 2
						]);
						if (!ignoreCurrent){
							this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
						}
						this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
					}
					else if (this.currentCacheIndex === this.cache.images.length-1){
						cacheImages = this.cache.getImages([
							this.currentCacheIndex - 2,
							this.currentCacheIndex - 1,
							this.currentCacheIndex
						]);
						if (!ignoreCurrent){
							// Current
							this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
						}
						this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
					else{
						cacheImages = this.cache.getImages([
							this.currentCacheIndex - 1,
							this.currentCacheIndex,
							this.currentCacheIndex + 1
						]);
						
						if (!ignoreCurrent){
							// Current
							this.addCacheImageToItemEl(cacheImages[1], itemEls[1]);
						}
						// Next
						this.addCacheImageToItemEl(cacheImages[2], itemEls[2]);
						// Previous
						this.addCacheImageToItemEl(cacheImages[0], itemEls[0]);
					}
					
				}
			
			}
		
		},
		
		
		
		/*
		 * Function: addCacheImageToItemEl
		 */
		addCacheImageToItemEl: function(cacheImage, itemEl){
			
			Util.DOM.removeClass(itemEl, PhotoSwipe.Carousel.CssClasses.itemError);
			Util.DOM.addClass(itemEl, PhotoSwipe.Carousel.CssClasses.itemLoading);
			
			Util.DOM.removeChildren(itemEl);
			
			Util.DOM.setStyle(cacheImage.imageEl, {
				display: 'none'
			});
			Util.DOM.appendChild(cacheImage.imageEl, itemEl);
			
			Util.Animation.resetTranslate(cacheImage.imageEl);
			
			Util.Events.add(cacheImage, PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
			Util.Events.add(cacheImage, PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			
			cacheImage.load();
			
		},
		
		
		
		/*
		 * Function: slideCarousel
		 */
		slideCarousel: function(point, action, speed){
			
			if (this.isSliding){
				return;
			}
			
			var width, diffX, slideBy;
			
			if (this.settings.target === window){
				width = Util.DOM.windowWidth() + this.settings.margin;
			}
			else{
				width = Util.DOM.width(this.settings.target) + this.settings.margin;
			}
			
			speed = Util.coalesce(speed, this.settings.slideSpeed);
			
			if (window.Math.abs(diffX) < 1){
				return;
			}
			
			
			switch (action){
				
				case Util.TouchElement.ActionTypes.swipeLeft:
					
					slideBy = width * -1;
					break;
					
				case Util.TouchElement.ActionTypes.swipeRight:
				
					slideBy = width;
					break;
				
				default:
					
					diffX = point.x - this.touchStartPoint.x;
					
					if (window.Math.abs(diffX) > width / 2){
						slideBy = (diffX > 0) ? width : width * -1;
					}
					else{
						slideBy = 0;
					}
					break;
			
			}
			
			if (slideBy < 0){
				this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.next;
			}
			else if (slideBy > 0){
				this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.previous;
			}
			else{
				this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.current;
			}
			
			// Check for non-looping carousels
			// If we are at the start or end, spring back to the current item element
			if (!this.settings.loop){
				if ( (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous && this.currentCacheIndex === 0 ) || (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next && this.currentCacheIndex === this.cache.images.length-1) ){
					slideBy = 0;
					this.lastSlideByAction = PhotoSwipe.Carousel.SlideByAction.current;
				}
			}
			
			this.isSliding = true;
			this.doSlideCarousel(slideBy, speed);
			
		},
		
		
		
		/*
		 * Function: 
		 */
		moveCarousel: function(point){
			
			if (this.isSliding){
				return;
			}
			
			if (!this.settings.enableDrag){
				return;
			}
			
			this.doMoveCarousel(point.x - this.touchStartPoint.x);
			
		},
		
		
		
		/*
		 * Function: getItemEls
		 */
		getItemEls: function(){
		
			return Util.DOM.find('.' + PhotoSwipe.Carousel.CssClasses.item, this.contentEl);
		
		},
		
		
		
		/*
		 * Function: previous
		 */
		previous: function(){
			
			this.stopSlideshow();
			this.slideCarousel({x:0, y:0}, Util.TouchElement.ActionTypes.swipeRight, this.settings.nextPreviousSlideSpeed);
		
		},
		
		
		
		/*
		 * Function: next
		 */
		next: function(){
			
			this.stopSlideshow();
			this.slideCarousel({x:0, y:0}, Util.TouchElement.ActionTypes.swipeLeft, this.settings.nextPreviousSlideSpeed);
		
		},
		
		
		
		/*
		 * Function: slideshowNext
		 */
		slideshowNext: function(){
		
			this.slideCarousel({x:0, y:0}, Util.TouchElement.ActionTypes.swipeLeft);
		
		},
		
		
		
		
		/*
		 * Function: startSlideshow
		 */
		startSlideshow: function(){
			
			this.stopSlideshow();
			
			this.isSlideshowActive = true;
			
			this.slideshowTimeout = window.setTimeout(this.slideshowNext.bind(this), this.settings.slideshowDelay);
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Carousel.EventTypes.onSlideshowStart,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: stopSlideshow
		 */
		stopSlideshow: function(){
			
			if (!Util.isNothing(this.slideshowTimeout)){
			
				window.clearTimeout(this.slideshowTimeout);
				this.slideshowTimeout = null;
				this.isSlideshowActive = false;
				
				Util.Events.fire(this, {
					type: PhotoSwipe.Carousel.EventTypes.onSlideshowStop,
					target: this
				});
			
			}
			
		},
		
		
		
		/*
		 * Function: onSlideByEnd
		 */
		onSlideByEnd: function(e){
			
			if (Util.isNothing(this.isSliding)){
				return;
			}
			
			var itemEls = this.getItemEls();
			
			this.isSliding = false;
			
			if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
				this.currentCacheIndex = this.currentCacheIndex + 1;
			}
			else if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
				this.currentCacheIndex = this.currentCacheIndex - 1;
			}
			
			if (this.settings.loop){
				
				if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
					// Move first to the last
					Util.DOM.appendChild(itemEls[0], this.contentEl);
				}
				else if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
					// Move the last to the first
					Util.DOM.insertBefore(itemEls[itemEls.length-1], itemEls[0], this.contentEl);
				}
				
				if (this.currentCacheIndex < 0){
					this.currentCacheIndex = this.cache.images.length - 1;
				}
				else if (this.currentCacheIndex === this.cache.images.length){
					this.currentCacheIndex = 0;
				}
				
			}
			else{
				
				if (this.cache.images.length > 3){
					
					if (this.currentCacheIndex > 1 && this.currentCacheIndex < this.cache.images.length-2){
						if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
							// Move first to the last
							Util.DOM.appendChild(itemEls[0], this.contentEl);
						}
						else if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
							// Move the last to the first
							Util.DOM.insertBefore(itemEls[itemEls.length-1], itemEls[0], this.contentEl);
						}
					}
					else if (this.currentCacheIndex === 1){
						if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.previous){
							// Move the last to the first
							Util.DOM.insertBefore(itemEls[itemEls.length-1], itemEls[0], this.contentEl);
						}
					}
					else if (this.currentCacheIndex === this.cache.images.length-2){
						if (this.lastSlideByAction === PhotoSwipe.Carousel.SlideByAction.next){
							// Move first to the last
							Util.DOM.appendChild(itemEls[0], this.contentEl);
						}
					}
				
				}
				
				
			}
			
			if (this.lastSlideByAction !== PhotoSwipe.Carousel.SlideByAction.current){
				this.setContentLeftPosition();
				this.setImages(true);
			}
			
			
			Util.Events.fire(this, {
				type: PhotoSwipe.Carousel.EventTypes.onSlideByEnd,
				target: this,
				action: this.lastSlideByAction,
				cacheIndex: this.currentCacheIndex
			});
			
			
			if (this.isSlideshowActive){
				
				if (this.lastSlideByAction !== PhotoSwipe.Carousel.SlideByAction.current){
					this.startSlideshow();
				}
				else{
					this.stopSlideshow();
				}
			
			}
			
			
		},
		
		
		
		/*
		 * Function: onTouch
		 */
		onTouch: function(action, point){
			
			this.stopSlideshow();
			
			switch(action){
				
				case Util.TouchElement.ActionTypes.touchStart:
					this.touchStartPoint = point;
					this.touchStartPosition = {
						x: window.parseInt(Util.DOM.getStyle(this.contentEl, 'left'), 0),
						y: window.parseInt(Util.DOM.getStyle(this.contentEl, 'top'), 0)
					};
					break;
				
				case Util.TouchElement.ActionTypes.touchMove:
					this.moveCarousel(point);
					break;
					
				case Util.TouchElement.ActionTypes.touchMoveEnd:
				case Util.TouchElement.ActionTypes.swipeLeft:
				case Util.TouchElement.ActionTypes.swipeRight:
					this.slideCarousel(point, action);
					break;
					
				case Util.TouchElement.ActionTypes.tap:
					break;
					
				case Util.TouchElement.ActionTypes.doubleTap:
					break;
				
				
			}
			
		},
		
		
		
		/*
		 * Function: onImageLoad
		 */
		onImageLoad: function(e){
			
			var cacheImage = e.target;
			
			if (!Util.isNothing(cacheImage.imageEl.parentNode)){
				Util.DOM.removeClass(cacheImage.imageEl.parentNode, PhotoSwipe.Carousel.CssClasses.itemLoading);
				this.resetImagePosition(cacheImage.imageEl);
			}
			
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			
		},
		
		
		
		/*
		 * Function: onImageError
		 */
		onImageError: function(e){
			
			var cacheImage = e.target;
			
			if (!Util.isNothing(cacheImage.imageEl.parentNode)){
				Util.DOM.removeClass(cacheImage.imageEl.parentNode, PhotoSwipe.Carousel.CssClasses.itemLoading);
				Util.DOM.addClass(cacheImage.imageEl.parentNode, PhotoSwipe.Carousel.CssClasses.itemError);
			}
			
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onLoad, this.imageLoadHandler);
			Util.Events.remove(cacheImage, PhotoSwipe.Image.EventTypes.onError, this.imageErrorHandler);
			
		}
		
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util, TouchElement){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Carousel');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Carousel.CarouselClass = PhotoSwipe.Carousel.CarouselClass.extend({
	
		
		/*
		 * Function: getStartingPos
		 */
		getStartingPos: function(){
			
			var startingPos = this.touchStartPosition;
			
			if (Util.isNothing(startingPos)){
				startingPos = {
					x: window.parseInt(Util.DOM.getStyle(this.contentEl, 'left'), 0),
					y: window.parseInt(Util.DOM.getStyle(this.contentEl, 'top'), 0)
				};
			}
			
			return startingPos;
		
		},
		
		
		
		/*
		 * Function: doMoveCarousel
		 */
		doMoveCarousel: function(xVal){
			
			var style;
			
			if (Util.Browser.isCSSTransformSupported){
				
				style = {};
				
				style[Util.Animation._transitionPrefix + 'Property'] = 'all';
				style[Util.Animation._transitionPrefix + 'Duration'] = '';
				style[Util.Animation._transitionPrefix + 'TimingFunction'] = '';
				style[Util.Animation._transitionPrefix + 'Delay'] = '0';
				style[Util.Animation._transformLabel] = (Util.Browser.is3dSupported) ? 'translate3d(' + xVal + 'px, 0px, 0px)' : 'translate(' + xVal + 'px, 0px)';
				
				Util.DOM.setStyle(this.contentEl, style);
			
			}
			else if (!Util.isNothing(window.jQuery)){
				
				
				window.jQuery(this.contentEl).stop().css('left', this.getStartingPos().x + xVal + 'px');
				
			}
			
		},
		
		
		
		/*
		 * Function: doSlideCarousel
		 */
		doSlideCarousel: function(xVal, speed){
			
			var animateProps, transform;
			
			if (speed <= 0){
				
				this.slideByEndHandler();
				return;
				
			}
			
			
			if (Util.Browser.isCSSTransformSupported){
				
				transform = Util.coalesce(this.contentEl.style.webkitTransform, this.contentEl.style.MozTransform, this.contentEl.style.transform, '');
				if (transform.indexOf('translate3d(' + xVal) === 0){
					this.slideByEndHandler();
					return;
				}
				else if (transform.indexOf('translate(' + xVal) === 0){
					this.slideByEndHandler();
					return;
				}
				
				Util.Animation.slideBy(this.contentEl, xVal, 0, speed, this.slideByEndHandler, this.settings.slideTimingFunction);
				
			}
			else if (!Util.isNothing(window.jQuery)){
				
				animateProps = {
					left: this.getStartingPos().x + xVal + 'px'
				};
		
				if (this.settings.animationTimingFunction === 'ease-out'){
					this.settings.animationTimingFunction = 'easeOutQuad';
				}
				
				if ( Util.isNothing(window.jQuery.easing[this.settings.animationTimingFunction]) ){
					this.settings.animationTimingFunction = 'linear';
				}
			
				window.jQuery(this.contentEl).animate(
					animateProps, 
					this.settings.slideSpeed, 
					this.settings.animationTimingFunction,
					this.slideByEndHandler
				);
			
			}
			
			
		}
	
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util,
	window.Code.PhotoSwipe.TouchElement
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Toolbar');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Toolbar.CssClasses = {
		toolbar: 'ps-toolbar',
		toolbarContent: 'ps-toolbar-content',
		toolbarTop: 'ps-toolbar-top',
		caption: 'ps-caption',
		captionBottom: 'ps-caption-bottom',
		captionContent: 'ps-caption-content',
		close: 'ps-toolbar-close',
		play: 'ps-toolbar-play',
		previous: 'ps-toolbar-previous',
		previousDisabled: 'ps-toolbar-previous-disabled',
		next: 'ps-toolbar-next',
		nextDisabled: 'ps-toolbar-next-disabled'
	};
	
	
	
	PhotoSwipe.Toolbar.ToolbarAction = {
		close: 'close',
		play: 'play',
		next: 'next',
		previous: 'previous',
		none: 'none'
	};
	
	
	
	PhotoSwipe.Toolbar.EventTypes = {
		onTap: 'PhotoSwipeToolbarOnClick',
		onBeforeShow: 'PhotoSwipeToolbarOnBeforeShow',
		onShow: 'PhotoSwipeToolbarOnShow',
		onBeforeHide: 'PhotoSwipeToolbarOnBeforeHide',
		onHide: 'PhotoSwipeToolbarOnHide'
	};
	
	
	
	PhotoSwipe.Toolbar.getToolbar = function(){
		
		return '<div class="' + PhotoSwipe.Toolbar.CssClasses.close + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div><div class="' + PhotoSwipe.Toolbar.CssClasses.play + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div><div class="' + PhotoSwipe.Toolbar.CssClasses.previous + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div><div class="' + PhotoSwipe.Toolbar.CssClasses.next + '"><div class="' + PhotoSwipe.Toolbar.CssClasses.toolbarContent + '"></div></div>';
		
	};
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.Toolbar');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.Toolbar.ToolbarClass = klass({
		
		
		
		toolbarEl: null,
		closeEl: null,
		playEl: null,
		previousEl: null,
		nextEl: null,
		captionEl: null,
		captionContentEl: null,
		currentCaption: null,
		settings: null,
		cache: null,
		timeout: null,
		isVisible: null,
		fadeOutHandler: null,
		touchStartHandler: null,
		touchMoveHandler: null,
		clickHandler: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			this.clearTimeout();
			
			this.removeEventHandlers();
			
			Util.Animation.stop(this.toolbarEl);
			Util.Animation.stop(this.captionEl);
			
			Util.DOM.removeChild(this.toolbarEl, this.toolbarEl.parentNode);
			Util.DOM.removeChild(this.captionEl, this.captionEl.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
			
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(cache, options){
			
			var cssClass;
			
			this.settings = options;
			this.cache = cache;
			this.isVisible = false;
			
			this.fadeOutHandler = this.onFadeOut.bind(this);
			this.touchStartHandler = this.onTouchStart.bind(this);
			this.touchMoveHandler = this.onTouchMove.bind(this);
			this.clickHandler = this.onClick.bind(this);
			
			
			cssClass = PhotoSwipe.Toolbar.CssClasses.toolbar;
			if (this.settings.captionAndToolbarFlipPosition){
				cssClass = cssClass + ' ' + PhotoSwipe.Toolbar.CssClasses.toolbarTop;
			}
			
			
			// Toolbar
			this.toolbarEl = Util.DOM.createElement(
				'div', 
				{ 
					'class': cssClass
				},
				this.settings.getToolbar()
			);
		
			
			Util.DOM.setStyle(this.toolbarEl, {
				left: 0,
				position: 'absolute',
				overflow: 'hidden',
				zIndex: this.settings.zIndex
			});
			
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.toolbarEl);
			}
			else{
				Util.DOM.appendChild(this.toolbarEl, this.settings.target);
			}
			Util.DOM.hide(this.toolbarEl);
			
			this.closeEl = Util.DOM.find('.' + PhotoSwipe.Toolbar.CssClasses.close, this.toolbarEl)[0];
			if (this.settings.preventHide && !Util.isNothing(this.closeEl)){
				Util.DOM.hide(this.closeEl);
			}
			
			this.playEl = Util.DOM.find('.' + PhotoSwipe.Toolbar.CssClasses.play, this.toolbarEl)[0];
			if (this.settings.preventSlideshow && !Util.isNothing(this.playEl)){
				Util.DOM.hide(this.playEl);
			}
			
			this.nextEl = Util.DOM.find('.' + PhotoSwipe.Toolbar.CssClasses.next, this.toolbarEl)[0];
			this.previousEl = Util.DOM.find('.' + PhotoSwipe.Toolbar.CssClasses.previous, this.toolbarEl)[0];
			
			
			// Caption
			cssClass = PhotoSwipe.Toolbar.CssClasses.caption;
			if (this.settings.captionAndToolbarFlipPosition){
				cssClass = cssClass + ' ' + PhotoSwipe.Toolbar.CssClasses.captionBottom;
			}
			
			this.captionEl = Util.DOM.createElement(
				'div', 
				{ 
					'class': cssClass
				}, 
				''
			);
			Util.DOM.setStyle(this.captionEl, {
				left: 0,
				position: 'absolute',
				overflow: 'hidden',
				zIndex: this.settings.zIndex
			});
			
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.captionEl);
			}
			else{
				Util.DOM.appendChild(this.captionEl, this.settings.target);
			}
			Util.DOM.hide(this.captionEl);
			
			this.captionContentEl = Util.DOM.createElement(
				'div', 
				{
					'class': PhotoSwipe.Toolbar.CssClasses.captionContent
				}, 
				''
			);
			Util.DOM.appendChild(this.captionContentEl, this.captionEl);
			
			this.addEventHandlers();
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
		
			var width, toolbarTop, captionTop;
			
			if (this.settings.target === window){
				if (this.settings.captionAndToolbarFlipPosition){
					toolbarTop = Util.DOM.windowScrollTop();
					captionTop = (Util.DOM.windowScrollTop() + Util.DOM.windowHeight()) - Util.DOM.height(this.captionEl);
				}
				else {
					toolbarTop = (Util.DOM.windowScrollTop() + Util.DOM.windowHeight()) - Util.DOM.height(this.toolbarEl);
					captionTop = Util.DOM.windowScrollTop();
				}	
				width = Util.DOM.windowWidth();
			}
			else{
				if (this.settings.captionAndToolbarFlipPosition){
					toolbarTop = '0';
					captionTop = Util.DOM.height(this.settings.target) - Util.DOM.height(this.captionEl);
				}
				else{
					toolbarTop = Util.DOM.height(this.settings.target) - Util.DOM.height(this.toolbarEl);
					captionTop = 0;
				}
				width = Util.DOM.width(this.settings.target);
			}
			
			Util.DOM.setStyle(this.toolbarEl, {
				top: toolbarTop + 'px',
				width: width
			});
		
			Util.DOM.setStyle(this.captionEl, {
				top: captionTop + 'px',
				width: width
			});
		},
		
		
		
		/*
		 * Function: toggleVisibility
		 */
		toggleVisibility: function(index){
		
			if (this.isVisible){
				this.fadeOut();
			}
			else{
				this.show(index);
			}
		
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(index){
			
			Util.Animation.stop(this.toolbarEl);
			Util.Animation.stop(this.captionEl);
			
			this.resetPosition();
			this.setToolbarStatus(index);
			
			Util.Events.fire(this, { 
				type: PhotoSwipe.Toolbar.EventTypes.onBeforeShow, 
				target: this 
			});
			
			this.showToolbar();
			this.setCaption(index);
			this.showCaption();
			
			this.isVisible = true;
			
			this.setTimeout();
			
			Util.Events.fire(this, { 
				type: PhotoSwipe.Toolbar.EventTypes.onShow, 
				target: this 
			});
			
		},
		
		
		
		/*
		 * Function: setTimeout
		 */
		setTimeout: function(){
			
			if (this.settings.captionAndToolbarAutoHideDelay > 0){
				// Set a timeout to hide the toolbar
				this.clearTimeout();
				this.timeout = window.setTimeout(this.fadeOut.bind(this), this.settings.captionAndToolbarAutoHideDelay);
			}
		
		},
		
		
		
		/*
		 * Function: clearTimeout
		 */
		clearTimeout: function(){
			
			if (!Util.isNothing(this.timeout)){
				window.clearTimeout(this.timeout);
				this.timeout = null;
			}
			
		},
		
		
		
		/*
		 * Function: fadeOut
		 */
		fadeOut: function(){
		
			this.clearTimeout();
			
			Util.Events.fire(this, { 
				type: PhotoSwipe.Toolbar.EventTypes.onBeforeHide, 
				target: this 
			});
			
			Util.Animation.fadeOut(this.toolbarEl, this.settings.fadeOutSpeed);
			Util.Animation.fadeOut(this.captionEl, this.settings.fadeOutSpeed, this.fadeOutHandler);
			
			this.isVisible = false;
		
		},
		
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
		
			if (Util.Browser.isTouchSupported){
				if (!Util.Browser.blackberry){
					// Had an issue with touchstart, animation and Blackberry. BB will default to click
					Util.Events.add(this.toolbarEl, 'touchstart', this.touchStartHandler);
				}
				Util.Events.add(this.toolbarEl, 'touchmove', this.touchMoveHandler);
				Util.Events.add(this.captionEl, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.add(this.toolbarEl, 'click', this.clickHandler);
		
		},
		
		
		
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
		
			if (Util.Browser.isTouchSupported){
				if (!Util.Browser.blackberry){
					// Had an issue with touchstart, animation and Blackberry. BB will default to click
					Util.Events.remove(this.toolbarEl, 'touchstart', this.touchStartHandler);
				}
				Util.Events.remove(this.toolbarEl, 'touchmove', this.touchMoveHandler);
				Util.Events.remove(this.captionEl, 'touchmove', this.touchMoveHandler);
			}
			Util.Events.remove(this.toolbarEl, 'click', this.clickHandler);
		
		},
		
		
		
		/*
		 * Function: handleTap
		 */
		handleTap: function(e){
			
			this.clearTimeout();
			
			var action;
			
			if (e.target === this.nextEl || Util.DOM.isChildOf(e.target, this.nextEl)){
				action = PhotoSwipe.Toolbar.ToolbarAction.next;
			}
			else if (e.target === this.previousEl || Util.DOM.isChildOf(e.target, this.previousEl)){
				action = PhotoSwipe.Toolbar.ToolbarAction.previous;
			}
			else if (e.target === this.closeEl || Util.DOM.isChildOf(e.target, this.closeEl)){
				action = PhotoSwipe.Toolbar.ToolbarAction.close;
			}
			else if (e.target === this.playEl || Util.DOM.isChildOf(e.target, this.playEl)){
				action = PhotoSwipe.Toolbar.ToolbarAction.play;
			}
			
			this.setTimeout();
			
			if (Util.isNothing(action)){
				action = PhotoSwipe.Toolbar.ToolbarAction.none;
			}
			
			Util.Events.fire(this, { 
				type: PhotoSwipe.Toolbar.EventTypes.onTap, 
				target: this, 
				action: action,
				tapTarget: e.target
			});
			
		},
		
		
		
		/*
		 * Function: setCaption
		 */ 
		setCaption: function(index){
		
			Util.DOM.removeChildren(this.captionContentEl);
			
			this.currentCaption = Util.coalesce(this.cache.images[index].caption, '\u00A0');
			
			if (Util.isObject(this.currentCaption)){
				Util.DOM.appendChild(this.currentCaption, this.captionContentEl);
			}
			else{
				if (this.currentCaption === ''){
					this.currentCaption = '\u00A0';
				}
				Util.DOM.appendText(this.currentCaption, this.captionContentEl);
			}
			
			this.currentCaption = (this.currentCaption === '\u00A0') ? '' : this.currentCaption;
			this.resetPosition();
			
		},
		
		
		
		/*
		 * Function: showToolbar
		 */
		showToolbar: function(){
		
			Util.DOM.setStyle(this.toolbarEl, {
				opacity: this.settings.captionAndToolbarOpacity
			});
			Util.DOM.show(this.toolbarEl);
			
		},
		
		
		
		/*
		 * Function: showCaption
		 */
		showCaption: function(){
			
			if (this.currentCaption === '' || this.captionContentEl.childNodes.length < 1){
				// Empty caption
				if (!this.settings.captionAndToolbarShowEmptyCaptions){
					Util.DOM.hide(this.captionEl);
					return;
				}
			}
			Util.DOM.setStyle(this.captionEl, {
				opacity: this.settings.captionAndToolbarOpacity
			});
			Util.DOM.show(this.captionEl);
		
		},
		
		
		
		/*
		 * Function: setToolbarStatus
		 */
		setToolbarStatus: function(index){
			
			if (this.settings.loop){
				return;
			}
			
			Util.DOM.removeClass(this.previousEl, PhotoSwipe.Toolbar.CssClasses.previousDisabled);
			Util.DOM.removeClass(this.nextEl, PhotoSwipe.Toolbar.CssClasses.nextDisabled);
			
			if (index > 0 && index < this.cache.images.length-1){
				return;
			}
			
			if (index === 0){
				if (!Util.isNothing(this.previousEl)){
					Util.DOM.addClass(this.previousEl, PhotoSwipe.Toolbar.CssClasses.previousDisabled);
				}
			}
			
			if (index === this.cache.images.length-1){
				if (!Util.isNothing(this.nextEl)){
					Util.DOM.addClass(this.nextEl, PhotoSwipe.Toolbar.CssClasses.nextDisabled);
				}
			}
			
		},
		
		
		
		/*
		 * Function: onFadeOut
		 */
		onFadeOut: function(){
		
			Util.DOM.hide(this.toolbarEl);
			Util.DOM.hide(this.captionEl);
			
			Util.Events.fire(this, { 
				type: PhotoSwipe.Toolbar.EventTypes.onHide, 
				target: this 
			});
			
		},
		
		
		
		/*
		 * Function: onTouchStart
		 */
		onTouchStart: function(e){
			
			e.preventDefault();
			Util.Events.remove(this.toolbarEl, 'click', this.clickHandler);
			this.handleTap(e);
			
		},
		
		
		
		/*
		 * Function: onTouchMove
		 */
		onTouchMove: function(e){
		
			e.preventDefault();
		
		},
		
		
		
		/*
		 * Function: onClick
		 */
		onClick: function(e){
			
			e.preventDefault();
			this.handleTap(e);
			
		}
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.UILayer');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	PhotoSwipe.UILayer.CssClasses = {
		uiLayer: 'ps-uilayer'
	};
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.UILayer');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.UILayer.UILayerClass = Util.TouchElement.TouchElementClass.extend({
		
		
		
		el: null,
		settings: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			this.removeEventHandlers();
			
			Util.DOM.removeChild(this.el, this.el.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(options){
			
			this.settings = options;
			
			// Main container 
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.UILayer.CssClasses.uiLayer
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				display: 'block',
				position: 'absolute',
				left: 0,
				top: 0,
				overflow: 'hidden',
				zIndex: this.settings.zIndex,
				opacity: 0
			});
			Util.DOM.hide(this.el);
			
			if (this.settings.target === window){
				Util.DOM.appendToBody(this.el);
			}
			else{
				Util.DOM.appendChild(this.el, this.settings.target);
			}
			
			this.supr(this.el, {
				swipe: true,
				move: true,
				gesture: Util.Browser.iOS,
				doubleTap: true,
				preventDefaultTouchEvents: this.settings.preventDefaultTouchEvents
			});
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			// Set the height and width to fill the document
			if (this.settings.target === window){
				Util.DOM.setStyle(this.el, {
					top: Util.DOM.windowScrollTop()  + 'px',
					width: Util.DOM.windowWidth(),
					height: Util.DOM.windowHeight()
				});	
			}
			else{
				Util.DOM.setStyle(this.el, {
					top: '0px',
					width: Util.DOM.width(this.settings.target),
					height: Util.DOM.height(this.settings.target)
				});
			}
			
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(){
			
			this.resetPosition();
			Util.DOM.show(this.el);
			this.addEventHandlers();
			
		},
		
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
			
			this.supr();
			
		},
		
		
		
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
		
			this.supr();
		
		}
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.ZoomPanRotate');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	PhotoSwipe.ZoomPanRotate.CssClasses = {
		zoomPanRotate: 'ps-zoom-pan-rotate'
	};
	
	
	PhotoSwipe.ZoomPanRotate.EventTypes = {
	
		onTransform: 'PhotoSwipeZoomPanRotateOnTransform'
	
	};
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe.ZoomPanRotate');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.ZoomPanRotate.ZoomPanRotateClass = klass({
	
		el: null,
		settings: null,
		containerEl: null,
		imageEl: null,
		transformSettings: null,
		panStartingPoint: null,
		transformEl: null,
		
		
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			Util.DOM.removeChild(this.el, this.el.parentNode);
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(options, cacheImage, uiLayer){
			
			var parentEl, width, height, top;
			
			this.settings = options;
			
			if (this.settings.target === window){
				parentEl = document.body;
				width = Util.DOM.windowWidth();
				height = Util.DOM.windowHeight();
				top = Util.DOM.windowScrollTop() + 'px';
			}
			else{
				parentEl = this.settings.target;
				width = Util.DOM.width(parentEl);
				height = Util.DOM.height(parentEl);
				top = '0px';
			}
			
			this.imageEl = cacheImage.imageEl.cloneNode(false);
			Util.DOM.setStyle(this.imageEl, {
				
				zIndex: 1
				
			});
			
			this.transformSettings = {
				
				startingScale: 1.0,
				scale: 1.0,
				startingRotation: 0,
				rotation: 0,
				startingTranslateX: 0,
				startingTranslateY: 0,
				translateX: 0,
				translateY: 0
			
			};
			
			
			this.el = Util.DOM.createElement(
				'div', 
				{ 
					'class': PhotoSwipe.ZoomPanRotate.CssClasses.zoomPanRotate
				}, 
				''
			);
			Util.DOM.setStyle(this.el, {
				left: 0,
				top: top,
				position: 'absolute',
				width: width,
				height: height,
				zIndex: this.settings.zIndex,
				display: 'block'
			});
			
			Util.DOM.insertBefore(this.el, uiLayer.el, parentEl);
			
			if (Util.Browser.iOS){
				this.containerEl = Util.DOM.createElement('div','','');
				Util.DOM.setStyle(this.containerEl, {
					left: 0,
					top: 0,
					width: width,
					height: height,
					position: 'absolute',
					zIndex: 1
				});
				Util.DOM.appendChild(this.imageEl, this.containerEl);
				Util.DOM.appendChild(this.containerEl, this.el);
				Util.Animation.resetTranslate(this.containerEl);
				Util.Animation.resetTranslate(this.imageEl);
				this.transformEl = this.containerEl;
			}
			else{
				Util.DOM.appendChild(this.imageEl, this.el);
				this.transformEl = this.imageEl;
			}
			
		},
		
		
		
		/*
		 * Function: setStartingTranslateFromCurrentTransform
		 */
		setStartingTranslateFromCurrentTransform: function(){
			
			var 
				transformValue = Util.coalesce(this.transformEl.style.webkitTransform, this.transformEl.style.MozTransform, this.transformEl.style.transform),
				transformExploded;
			
			if (!Util.isNothing(transformValue)){
				
				transformExploded = transformValue.match( /translate\((.*?)\)/ );
				
				if (!Util.isNothing(transformExploded)){
				
					transformExploded = transformExploded[1].split(', ');
					this.transformSettings.startingTranslateX = window.parseInt(transformExploded[0], 10);
					this.transformSettings.startingTranslateY = window.parseInt(transformExploded[1], 10);
				
				}
			
			}
			
		},
		
		
		
		/*
		 * Function: getScale
		 */
		getScale: function(scaleValue){
			
			var scale = this.transformSettings.startingScale * scaleValue;
			
			if (this.settings.minUserZoom !== 0 && scale < this.settings.minUserZoom){
				scale = this.settings.minUserZoom;
			}
			else if (this.settings.maxUserZoom !== 0 && scale > this.settings.maxUserZoom){
				scale = this.settings.maxUserZoom;
			}
			
			return scale;
			
		},
		
		
		
		/*
		 * Function: setStartingScaleAndRotation
		 */
		setStartingScaleAndRotation: function(scaleValue, rotationValue){
			
			this.transformSettings.startingScale = this.getScale(scaleValue);
			
			this.transformSettings.startingRotation = 
				(this.transformSettings.startingRotation + rotationValue) % 360;
				
		},
		
		
		
		/*
		 * Function: zoomRotate
		 */
		zoomRotate: function(scaleValue, rotationValue){
			
			this.transformSettings.scale = this.getScale(scaleValue);
			
			this.transformSettings.rotation = 
				this.transformSettings.startingRotation + rotationValue;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: panStart
		 */
		panStart: function(point){
			
			this.setStartingTranslateFromCurrentTransform();
			
			this.panStartingPoint = {
				x: point.x,
				y: point.y
			};
			
		},
		
		
		
		/*
		 * Function: pan
		 */
		pan: function(point){ 
			
			var 
				dx = point.x - this.panStartingPoint.x,
				dy = point.y - this.panStartingPoint.y,
				dxScaleAdjust = dx / this.transformSettings.scale ,
        dyScaleAdjust = dy / this.transformSettings.scale;
			
			this.transformSettings.translateX = 
				this.transformSettings.startingTranslateX + dxScaleAdjust;

			this.transformSettings.translateY = 
				this.transformSettings.startingTranslateY + dyScaleAdjust;

			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: zoomAndPanToPoint
		 */
		zoomAndPanToPoint: function(scaleValue, point){
			
			
			if (this.settings.target === window){
				
				this.panStart({
					x: Util.DOM.windowWidth() / 2,
					y: Util.DOM.windowHeight() / 2
				});
				
				var 
					dx = point.x - this.panStartingPoint.x,
					dy = point.y - this.panStartingPoint.y,
					dxScaleAdjust = dx / this.transformSettings.scale,
					dyScaleAdjust = dy / this.transformSettings.scale;
					
				this.transformSettings.translateX = 
					(this.transformSettings.startingTranslateX + dxScaleAdjust) * -1;
				
				this.transformSettings.translateY = 
					(this.transformSettings.startingTranslateY + dyScaleAdjust) * -1;
					
			}
			
			
			this.setStartingScaleAndRotation(scaleValue, 0);
			this.transformSettings.scale = this.transformSettings.startingScale;
			
			this.transformSettings.rotation = 0;
			
			this.applyTransform();
			
		},
		
		
		
		/*
		 * Function: applyTransform
		 */
		applyTransform: function(){
			
			var 
				rotationDegs = this.transformSettings.rotation % 360,
				translateX = window.parseInt(this.transformSettings.translateX, 10),
				translateY = window.parseInt(this.transformSettings.translateY, 10),
				transform = 'scale(' + this.transformSettings.scale + ') rotate(' + rotationDegs + 'deg) translate(' + translateX + 'px, ' + translateY + 'px)';
			
			Util.DOM.setStyle(this.transformEl, {
				webkitTransform: transform,
				MozTransform: transform,
				msTransform: transform,
				transform: transform
			});
			
			Util.Events.fire(this, {
				target: this,
				type: PhotoSwipe.ZoomPanRotate.EventTypes.onTransform,
				scale: this.transformSettings.scale,
				rotation: this.transformSettings.rotation,
				rotationDegs: rotationDegs,
				translateX: translateX,
				translateY: translateY
			});
			
		}
	
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, Util){
	
	
	Util.registerNamespace('Code.PhotoSwipe');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	
	PhotoSwipe.CssClasses = {
		buildingBody: 'ps-building',
		activeBody: 'ps-active'
	};
	
	
	
	PhotoSwipe.EventTypes = {
	
		onBeforeShow: 'PhotoSwipeOnBeforeShow',
		onShow: 'PhotoSwipeOnShow',
		onBeforeHide: 'PhotoSwipeOnBeforeHide',
		onHide: 'PhotoSwipeOnHide',
		onDisplayImage: 'PhotoSwipeOnDisplayImage',
		onResetPosition: 'PhotoSwipeOnResetPosition',
		onSlideshowStart: 'PhotoSwipeOnSlideshowStart',
		onSlideshowStop: 'PhotoSwipeOnSlideshowStop',
		onTouch: 'PhotoSwipeOnTouch',
		onBeforeCaptionAndToolbarShow: 'PhotoSwipeOnBeforeCaptionAndToolbarShow',
		onCaptionAndToolbarShow: 'PhotoSwipeOnCaptionAndToolbarShow',
		onBeforeCaptionAndToolbarHide: 'PhotoSwipeOnBeforeCaptionAndToolbarHide',
		onCaptionAndToolbarHide: 'PhotoSwipeOnCaptionAndToolbarHide',
		onToolbarTap: 'PhotoSwipeOnToolbarTap',
		onBeforeZoomPanRotateShow: 'PhotoSwipeOnBeforeZoomPanRotateShow',
		onZoomPanRotateShow: 'PhotoSwipeOnZoomPanRotateShow',
		onBeforeZoomPanRotateHide: 'PhotoSwipeOnBeforeZoomPanRotateHide',
		onZoomPanRotateHide: 'PhotoSwipeOnZoomPanRotateHide',
		onZoomPanRotateTransform: 'PhotoSwipeOnZoomPanRotateTransform'
	
	};
	
	
	
	PhotoSwipe.instances = [];
	PhotoSwipe.activeInstances = [];
	
	
	
	/*
	 * Function: Code.PhotoSwipe.setActivateInstance
	 */
	PhotoSwipe.setActivateInstance = function(instance){
		
		// Can only have one instance per target (i.e. window or div)
		var index = Util.arrayIndexOf(instance.settings.target, PhotoSwipe.activeInstances, 'target');
		if (index > -1){
			throw 'Code.PhotoSwipe.activateInstance: Unable to active instance as another instance is already active for this target';
		}
		PhotoSwipe.activeInstances.push({
			target: instance.settings.target,
			instance: instance
		});
			
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.unsetActivateInstance
	 */
	PhotoSwipe.unsetActivateInstance = function(instance){
		
		var index = Util.arrayIndexOf(instance, PhotoSwipe.activeInstances, 'instance');
		PhotoSwipe.activeInstances.splice(index, 1);
		
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.attach
	 */
	PhotoSwipe.attach = function(images, options, id){
		
		var i, j, instance, image;
		
		instance = PhotoSwipe.createInstance(images, options, id);
		
		// Add click event handlers if applicable
		for (i=0, j=images.length; i<j; i++){
			
			image = images[i];
			if (!Util.isNothing(image.nodeType)){
				if (image.nodeType === 1){
					// DOM element
					image.__photoSwipeClickHandler = PhotoSwipe.onTriggerElementClick.bind(instance);
					Util.Events.remove(image, 'click', image.__photoSwipeClickHandler);
					Util.Events.add(image, 'click', image.__photoSwipeClickHandler);
				}
			}
			
		}
		
		return instance;
		
	};
	
	
	
	/*
	 * jQuery plugin
	 */
	if (window.jQuery){
		
		window.jQuery.fn.photoSwipe = function(options, id){
		
			return PhotoSwipe.attach(this, options, id);
			
		};
		
		
	}
	
	
	
	/*
	 * Function: Code.PhotoSwipe.detatch
	 */
	PhotoSwipe.detatch = function(instance){
	
		var i, j, image;
		
		// Remove click event handlers if applicable
		for (i=0, j=instance.originalImages.length; i<j; i++){
			
			image = instance.originalImages[i];
			if (!Util.isNothing(image.nodeType)){
				if (image.nodeType === 1){
					// DOM element
					Util.Events.remove(image, 'click', image.__photoSwipeClickHandler);
					delete image.__photoSwipeClickHandler;
				}
			}
			
		}
		
		PhotoSwipe.disposeInstance(instance);
	
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.createInstance
	 */
	PhotoSwipe.createInstance = function(images, options, id){
		
		var i, instance, image;
		
		if (Util.isNothing(images)){
			throw 'Code.PhotoSwipe.attach: No images passed.';
		}
		
		if (!Util.isLikeArray(images)){
			throw 'Code.PhotoSwipe.createInstance: Images must be an array of elements or image urls.';
		}
		
		if (images.length < 1){
			throw 'Code.PhotoSwipe.createInstance: No images to passed.';
		}
		
		options = Util.coalesce(options, { });
		
		instance = PhotoSwipe.getInstance(id);
		
		if (Util.isNothing(instance)){
			instance = new PhotoSwipe.PhotoSwipeClass(images, options, id);
			PhotoSwipe.instances.push(instance);
		}
		else{
			throw 'Code.PhotoSwipe.createInstance: Instance with id "' + id +' already exists."';
		}
		
		return instance;
	
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.disposeInstance
	 */
	PhotoSwipe.disposeInstance = function(instance){
		
		var instanceIndex = PhotoSwipe.getInstanceIndex(instance);
		
		if (instanceIndex < 0){
			throw 'Code.PhotoSwipe.disposeInstance: Unable to find instance to dispose.';
		}
		
		instance.dispose();
		PhotoSwipe.instances.splice(instanceIndex, 1);
		instance = null;
	
	};
	
	
	
	/*
	 * Function: onTriggerElementClick
	 */
	PhotoSwipe.onTriggerElementClick = function(e){
	
		e.preventDefault();
		
		var instance = this;
		instance.show(e.currentTarget);
	
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.getInstance
	 */
	PhotoSwipe.getInstance = function(id){
		
		var i, j, instance;
		
		for (i=0, j=PhotoSwipe.instances.length; i<j; i++){
			
			instance = PhotoSwipe.instances[i];
			if (instance.id === id){
				return instance;
			}
			
		}
		
		return null;
		
	};
	
	
	
	/*
	 * Function: Code.PhotoSwipe.getInstanceIndex
	 */
	PhotoSwipe.getInstanceIndex = function(instance){
		
		var i, j, instanceIndex = -1;
		
		for (i=0, j=PhotoSwipe.instances.length; i<j; i++){
		
			if (PhotoSwipe.instances[i] === instance){
				instanceIndex = i;
				break;
			}
		
		}
		
		return instanceIndex;
		
	};
	
	
	
}
(
	window, 
	window.Code.Util
));// Copyright (c) 2012 by Code Computerlove (http://www.codecomputerlove.com)
// Licensed under the MIT license
// version: 3.0.5

(function(window, klass, Util, Cache, DocumentOverlay, Carousel, Toolbar, UILayer, ZoomPanRotate){
	
	
	Util.registerNamespace('Code.PhotoSwipe');
	var PhotoSwipe = window.Code.PhotoSwipe;
	
	
	PhotoSwipe.PhotoSwipeClass = klass({
		
		
		
		id: null,
		settings: null,
		isBackEventSupported: null,
		backButtonClicked: null,
		currentIndex: null,
		originalImages: null,
		mouseWheelStartTime: null,
		windowDimensions: null,
		
		
		
		// Components
		cache: null,
		documentOverlay: null,
		carousel: null,
		uiLayer: null,
		toolbar: null,
		zoomPanRotate: null,
		
		
		
		// Handlers
		windowOrientationChangeHandler: null,
		windowScrollHandler: null,
		windowHashChangeHandler: null,
		keyDownHandler: null,
		windowOrientationEventName: null,
		uiLayerTouchHandler: null,
		carouselSlideByEndHandler: null,
		carouselSlideshowStartHandler: null,
		carouselSlideshowStopHandler: null,
		toolbarTapHandler: null,
		toolbarBeforeShowHandler: null,
		toolbarShowHandler: null,
		toolbarBeforeHideHandler: null,
		toolbarHideHandler: null,
		mouseWheelHandler: null,
		zoomPanRotateTransformHandler: null,
		
		
		_isResettingPosition: null,
		_uiWebViewResetPositionTimeout: null,
				
		
		/*
		 * Function: dispose
		 */
		dispose: function(){
		
			var prop;
			
			Util.Events.remove(this, PhotoSwipe.EventTypes.onBeforeShow);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onShow);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onBeforeHide);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onHide);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onDisplayImage);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onResetPosition);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onSlideshowStart);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onSlideshowStop);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onTouch);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarShow);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onCaptionAndToolbarShow);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarHide);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onCaptionAndToolbarHide);
			Util.Events.remove(this, PhotoSwipe.EventTypes.onZoomPanRotateTransform);
			
			
			this.removeEventHandlers();
			
			if (!Util.isNothing(this.documentOverlay)){
				this.documentOverlay.dispose();
			}
			
			if (!Util.isNothing(this.carousel)){
				this.carousel.dispose();
			}
			
			if (!Util.isNothing(this.uiLayer)){
				this.uiLayer.dispose();
			}
			
			if (!Util.isNothing(this.toolbar)){
				this.toolbar.dispose();
			}
			
			this.destroyZoomPanRotate();
			
			if (!Util.isNothing(this.cache)){
				this.cache.dispose();
			}
			
			for (prop in this) {
				if (Util.objectHasProperty(this, prop)) {
					this[prop] = null;
				}
			}
		
		},
		
		
		
		/*
		 * Function: initialize
		 */
		initialize: function(images, options, id){
			
			var targetPosition;
			
			if (Util.isNothing(id)){
				this.id = 'PhotoSwipe' + new Date().getTime().toString();
			}
			else{
				this.id = id;
			}
			
			this.originalImages = images;
			
			if (Util.Browser.android && !Util.Browser.firefox){
				if (window.navigator.userAgent.match(/Android (\d+.\d+)/).toString().replace(/^.*\,/, '') >= 2.1){
					this.isBackEventSupported = true;
				}
			}
			
			if (!this.isBackEventSupported){
				this.isBackEventSupported = Util.objectHasProperty(window, 'onhashchange');
			}
			
			this.settings = {
				
				// General
				fadeInSpeed: 250,
				fadeOutSpeed: 250,
				preventHide: false,
				preventSlideshow: false,
				zIndex: 1000,
				backButtonHideEnabled: true,
				enableKeyboard: true,
				enableMouseWheel: true,
				mouseWheelSpeed: 350,
				autoStartSlideshow: false,
				jQueryMobile: ( !Util.isNothing(window.jQuery) && !Util.isNothing(window.jQuery.mobile) ),
				jQueryMobileDialogHash: '&ui-state=dialog',
				enableUIWebViewRepositionTimeout: false,
				uiWebViewResetPositionDelay: 500,
				target: window,
				preventDefaultTouchEvents: true,
				
				
				// Carousel
				loop: true,
				slideSpeed: 250,
				nextPreviousSlideSpeed: 0,
				enableDrag: true,
				swipeThreshold: 50,
				swipeTimeThreshold: 250,
				slideTimingFunction: 'ease-out',
				slideshowDelay: 3000,
				doubleTapSpeed: 250,
				margin: 20,
				imageScaleMethod: 'fit', // Either "fit", "fitNoUpscale" or "zoom",
				
				
				// Toolbar
				captionAndToolbarHide: false,
				captionAndToolbarFlipPosition: false,
				captionAndToolbarAutoHideDelay: 5000,
				captionAndToolbarOpacity: 0.8,
				captionAndToolbarShowEmptyCaptions: true,
				getToolbar: PhotoSwipe.Toolbar.getToolbar,
				
				
				// ZoomPanRotate
				allowUserZoom: true, 
				allowRotationOnUserZoom: false,
				maxUserZoom: 5.0,
				minUserZoom: 0.5,
				doubleTapZoomLevel: 2.5,
				
				
				// Cache
				getImageSource: PhotoSwipe.Cache.Functions.getImageSource,
				getImageCaption: PhotoSwipe.Cache.Functions.getImageCaption,
				getImageMetaData: PhotoSwipe.Cache.Functions.getImageMetaData,
				cacheMode: PhotoSwipe.Cache.Mode.normal
				
			};
			
			Util.extend(this.settings, options);
			
			if (this.settings.target !== window){
				targetPosition = Util.DOM.getStyle(this.settings.target, 'position');
				if (targetPosition !== 'relative' || targetPosition !== 'absolute'){
					Util.DOM.setStyle(this.settings.target, 'position', 'relative');
				}
			}
			
			if (this.settings.target !== window){
				this.isBackEventSupported = false;
				this.settings.backButtonHideEnabled = false;
			}
			else{
				if (this.settings.preventHide){
					this.settings.backButtonHideEnabled = false;
				}
			}
			
			this.cache = new Cache.CacheClass(images, this.settings);
			
		},
		
		
		
		/*
		 * Function: show
		 */
		show: function(obj){
			
			var i, j;
			
			this._isResettingPosition = false;
			this.backButtonClicked = false;
			
			// Work out what the starting index is
			if (Util.isNumber(obj)){
				this.currentIndex = obj;
			}
			else{
				
				this.currentIndex = -1;
				for (i=0, j=this.originalImages.length; i<j; i++){
					if (this.originalImages[i] === obj){
						this.currentIndex = i;
						break;
					}
				}
				
			}
			
			if (this.currentIndex < 0 || this.currentIndex > this.originalImages.length-1){
				throw "Code.PhotoSwipe.PhotoSwipeClass.show: Starting index out of range";
			}
			
			// Store a reference to the current window dimensions
			// Use this later to double check that a window has actually
			// been resized.
			this.isAlreadyGettingPage = this.getWindowDimensions();
			
			// Set this instance to be the active instance
			PhotoSwipe.setActivateInstance(this);
			
			this.windowDimensions = this.getWindowDimensions();
			
			// Create components
			if (this.settings.target === window){
				Util.DOM.addClass(window.document.body, PhotoSwipe.CssClasses.buildingBody);
			}
			else{
				Util.DOM.addClass(this.settings.target, PhotoSwipe.CssClasses.buildingBody);
			}
			this.createComponents();
			
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onBeforeShow,
				target: this
			});
			
			// Fade in the document overlay
			this.documentOverlay.fadeIn(this.settings.fadeInSpeed, this.onDocumentOverlayFadeIn.bind(this));
			
		},
		
		
		
		/*
		 * Function: getWindowDimensions
		 */
		getWindowDimensions: function(){
		
			return {
				width: Util.DOM.windowWidth(),
				height: Util.DOM.windowHeight()
			};
		
		},
		
		
		
		/*
		 * Function: createComponents
		 */
		createComponents: function(){
		
			this.documentOverlay = new DocumentOverlay.DocumentOverlayClass(this.settings);
			this.carousel = new Carousel.CarouselClass(this.cache, this.settings);
			this.uiLayer = new UILayer.UILayerClass(this.settings);
			if (!this.settings.captionAndToolbarHide){
				this.toolbar = new Toolbar.ToolbarClass(this.cache, this.settings);
			}
			
		},
		
		
		
		/*
		 * Function: resetPosition
		 */
		resetPosition: function(){
			
			if (this._isResettingPosition){
				return;
			}
			
			var newWindowDimensions = this.getWindowDimensions();
			if (!Util.isNothing(this.windowDimensions)){
				if (newWindowDimensions.width === this.windowDimensions.width && newWindowDimensions.height === this.windowDimensions.height){
					// This was added as a fudge for iOS
					return;
				}
			}
			
			this._isResettingPosition = true;
			
			this.windowDimensions = newWindowDimensions;
			
			this.destroyZoomPanRotate();
			
			this.documentOverlay.resetPosition();
			this.carousel.resetPosition();
			
			if (!Util.isNothing(this.toolbar)){
				this.toolbar.resetPosition();
			}
			
			this.uiLayer.resetPosition();
			
			this._isResettingPosition = false;
			
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onResetPosition,
				target: this
			});
			
		},
		
		
		
		/*
		 * Function: addEventHandler
		 */
		addEventHandler: function(type, handler){
			
			Util.Events.add(this, type, handler);
		
		},
		
		
		
		/*
		 * Function: addEventHandlers
		 */
		addEventHandlers: function(){
			
			if (Util.isNothing(this.windowOrientationChangeHandler)){
			
				this.windowOrientationChangeHandler = this.onWindowOrientationChange.bind(this);
				this.windowScrollHandler = this.onWindowScroll.bind(this);
				this.keyDownHandler = this.onKeyDown.bind(this);
				this.windowHashChangeHandler = this.onWindowHashChange.bind(this);
				this.uiLayerTouchHandler = this.onUILayerTouch.bind(this);
				this.carouselSlideByEndHandler = this.onCarouselSlideByEnd.bind(this);
				this.carouselSlideshowStartHandler = this.onCarouselSlideshowStart.bind(this);
				this.carouselSlideshowStopHandler = this.onCarouselSlideshowStop.bind(this);
				this.toolbarTapHandler = this.onToolbarTap.bind(this);
				this.toolbarBeforeShowHandler = this.onToolbarBeforeShow.bind(this);
				this.toolbarShowHandler = this.onToolbarShow.bind(this);
				this.toolbarBeforeHideHandler = this.onToolbarBeforeHide.bind(this);
				this.toolbarHideHandler = this.onToolbarHide.bind(this);
				this.mouseWheelHandler = this.onMouseWheel.bind(this);
				this.zoomPanRotateTransformHandler = this.onZoomPanRotateTransform.bind(this);
				
			}
			
			// Set window handlers
			if (Util.Browser.android){
				// For some reason, resize was more stable than orientationchange in Android
				this.orientationEventName = 'resize';
			}
			else if (Util.Browser.iOS && (!Util.Browser.safari)){
				Util.Events.add(window.document.body, 'orientationchange', this.windowOrientationChangeHandler);
			}
			else{
				var supportsOrientationChange = !Util.isNothing(window.onorientationchange);
				this.orientationEventName = supportsOrientationChange ? 'orientationchange' : 'resize';
			}
			
			if (!Util.isNothing(this.orientationEventName)){
				Util.Events.add(window, this.orientationEventName, this.windowOrientationChangeHandler);
			}
			if (this.settings.target === window){
				Util.Events.add(window, 'scroll', this.windowScrollHandler);
			}
			
			if (this.settings.enableKeyboard){
				Util.Events.add(window.document, 'keydown', this.keyDownHandler);
			}
			
			
			if (this.isBackEventSupported && this.settings.backButtonHideEnabled){
					
				this.windowHashChangeHandler = this.onWindowHashChange.bind(this);
				
				if (this.settings.jQueryMobile){
					window.location.hash = this.settings.jQueryMobileDialogHash;
				}
				else{
					this.currentHistoryHashValue = 'PhotoSwipe' + new Date().getTime().toString();
					window.location.hash = this.currentHistoryHashValue;
				}
								
				Util.Events.add(window, 'hashchange', this.windowHashChangeHandler);
			
			}
			
			if (this.settings.enableMouseWheel){
				Util.Events.add(window, 'mousewheel', this.mouseWheelHandler);
			}
			
			Util.Events.add(this.uiLayer, Util.TouchElement.EventTypes.onTouch, this.uiLayerTouchHandler);
			Util.Events.add(this.carousel, Carousel.EventTypes.onSlideByEnd, this.carouselSlideByEndHandler);
			Util.Events.add(this.carousel, Carousel.EventTypes.onSlideshowStart, this.carouselSlideshowStartHandler);
			Util.Events.add(this.carousel, Carousel.EventTypes.onSlideshowStop, this.carouselSlideshowStopHandler);
			
			if (!Util.isNothing(this.toolbar)){
				Util.Events.add(this.toolbar, Toolbar.EventTypes.onTap, this.toolbarTapHandler);
				Util.Events.add(this.toolbar, Toolbar.EventTypes.onBeforeShow, this.toolbarBeforeShowHandler);
				Util.Events.add(this.toolbar, Toolbar.EventTypes.onShow, this.toolbarShowHandler);
				Util.Events.add(this.toolbar, Toolbar.EventTypes.onBeforeHide, this.toolbarBeforeHideHandler);
				Util.Events.add(this.toolbar, Toolbar.EventTypes.onHide, this.toolbarHideHandler);
			}
		
		},
		
		
		
		/*
		 * Function: removeEventHandlers
		 */
		removeEventHandlers: function(){
			
			if (Util.Browser.iOS && (!Util.Browser.safari)){
				Util.Events.remove(window.document.body, 'orientationchange', this.windowOrientationChangeHandler);
			}
			
			if (!Util.isNothing(this.orientationEventName)){
				Util.Events.remove(window, this.orientationEventName, this.windowOrientationChangeHandler);
			}
			
			Util.Events.remove(window, 'scroll', this.windowScrollHandler);
			
			if (this.settings.enableKeyboard){
				Util.Events.remove(window.document, 'keydown', this.keyDownHandler);
			}
			
			if (this.isBackEventSupported && this.settings.backButtonHideEnabled){
				Util.Events.remove(window, 'hashchange', this.windowHashChangeHandler);
			}
			
			if (this.settings.enableMouseWheel){
				Util.Events.remove(window, 'mousewheel', this.mouseWheelHandler);
			}
			
			if (!Util.isNothing(this.uiLayer)){
				Util.Events.remove(this.uiLayer, Util.TouchElement.EventTypes.onTouch, this.uiLayerTouchHandler);
			}
			
			if (!Util.isNothing(this.toolbar)){
				Util.Events.remove(this.carousel, Carousel.EventTypes.onSlideByEnd, this.carouselSlideByEndHandler);
				Util.Events.remove(this.carousel, Carousel.EventTypes.onSlideshowStart, this.carouselSlideshowStartHandler);
				Util.Events.remove(this.carousel, Carousel.EventTypes.onSlideshowStop, this.carouselSlideshowStopHandler);
			}
			
			if (!Util.isNothing(this.toolbar)){
				Util.Events.remove(this.toolbar, Toolbar.EventTypes.onTap, this.toolbarTapHandler);
				Util.Events.remove(this.toolbar, Toolbar.EventTypes.onBeforeShow, this.toolbarBeforeShowHandler);
				Util.Events.remove(this.toolbar, Toolbar.EventTypes.onShow, this.toolbarShowHandler);
				Util.Events.remove(this.toolbar, Toolbar.EventTypes.onBeforeHide, this.toolbarBeforeHideHandler);
				Util.Events.remove(this.toolbar, Toolbar.EventTypes.onHide, this.toolbarHideHandler);
			}
			
		},
		
		
		
		
		/*
		 * Function: hide
		 */
		hide: function(){
			
			if (this.settings.preventHide){
				return;
			}
			
			if (Util.isNothing(this.documentOverlay)){
				throw "Code.PhotoSwipe.PhotoSwipeClass.hide: PhotoSwipe instance is already hidden";
			}
			
			if (!Util.isNothing(this.hiding)){
				return;
			}
			
			this.clearUIWebViewResetPositionTimeout();
			
			this.destroyZoomPanRotate();
			
			this.removeEventHandlers();
			
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onBeforeHide,
				target: this
			});
			
			this.uiLayer.dispose();
			this.uiLayer = null;
			
			if (!Util.isNothing(this.toolbar)){
				this.toolbar.dispose();
				this.toolbar = null;
			}
			
			this.carousel.dispose();
			this.carousel = null;
			
			Util.DOM.removeClass(window.document.body, PhotoSwipe.CssClasses.activeBody);
			
			this.documentOverlay.dispose();
			this.documentOverlay = null;
			
			this._isResettingPosition = false;
			
			// Deactive this instance
			PhotoSwipe.unsetActivateInstance(this);
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onHide,
				target: this
			});
			
			this.goBackInHistory();
			
		},
		
		
		
		/*
		 * Function: goBackInHistory
		 */
		goBackInHistory: function(){		  
			if (this.isBackEventSupported && this.settings.backButtonHideEnabled){
				if ( !this.backButtonClicked ){
					window.history.back();
				}
			}
		},
		
		
		
		/*
		 * Function: play
		 */
		play: function(){
			
			if (this.isZoomActive()){
				return;
			}
			
			if (!this.settings.preventSlideshow){
				if (!Util.isNothing(this.carousel)){
					if (!Util.isNothing(this.toolbar) && this.toolbar.isVisible){
						this.toolbar.fadeOut();
					}
					this.carousel.startSlideshow();
				}
			}
			
		},
		
		
		
		/*
		 * Function: stop
		 */
		stop: function(){
			
			if (this.isZoomActive()){
				return;
			}
			
			if (!Util.isNothing(this.carousel)){
				this.carousel.stopSlideshow();
			}
		
		},
		
		
		
		/*
		 * Function: previous
		 */
		previous: function(){
			
			if (this.isZoomActive()){
				return;
			}
			
			if (!Util.isNothing(this.carousel)){
				this.carousel.previous();
			}
		
		},
		
		
		
		/*
		 * Function: next
		 */
		next: function(){
			
			if (this.isZoomActive()){
				return;
			}
			
			if (!Util.isNothing(this.carousel)){
				this.carousel.next();
			}
			
		},
		
		
		
		/*
		 * Function: toggleToolbar
		 */
		toggleToolbar: function(){
			
			if (this.isZoomActive()){
				return;
			}
			
			if (!Util.isNothing(this.toolbar)){
				this.toolbar.toggleVisibility(this.currentIndex);
			}
			
		},
		
		
		
		/*
		 * Function: fadeOutToolbarIfVisible
		 */
		fadeOutToolbarIfVisible: function(){
		
			if (!Util.isNothing(this.toolbar) && this.toolbar.isVisible && this.settings.captionAndToolbarAutoHideDelay > 0){
				this.toolbar.fadeOut();
			}
		
		},
		
		
		
		/*
		 * Function: createZoomPanRotate
		 */
		createZoomPanRotate: function(){
			
			this.stop();
			
			if (this.canUserZoom() && !this.isZoomActive()){
				
				Util.Events.fire(this, PhotoSwipe.EventTypes.onBeforeZoomPanRotateShow);
				
				this.zoomPanRotate = new ZoomPanRotate.ZoomPanRotateClass(
					this.settings, 
					this.cache.images[this.currentIndex],
					this.uiLayer
				);
				
				// If we don't override this in the event of false
				// you will be unable to pan around a zoomed image effectively
				this.uiLayer.captureSettings.preventDefaultTouchEvents = true;
				
				Util.Events.add(this.zoomPanRotate, PhotoSwipe.ZoomPanRotate.EventTypes.onTransform, this.zoomPanRotateTransformHandler);
				
				Util.Events.fire(this, PhotoSwipe.EventTypes.onZoomPanRotateShow);
				
				if (!Util.isNothing(this.toolbar) && this.toolbar.isVisible){
					this.toolbar.fadeOut();
				}
				
			}
		
		},
		
		
		
		/*
		 * Function: destroyZoomPanRotate
		 */
		destroyZoomPanRotate: function(){
			
			if (!Util.isNothing(this.zoomPanRotate)){
				
				Util.Events.fire(this, PhotoSwipe.EventTypes.onBeforeZoomPanRotateHide);
			
				Util.Events.remove(this.zoomPanRotate, PhotoSwipe.ZoomPanRotate.EventTypes.onTransform, this.zoomPanRotateTransformHandler);
				this.zoomPanRotate.dispose();
				this.zoomPanRotate = null;
				
				// Set the preventDefaultTouchEvents back to it was
				this.uiLayer.captureSettings.preventDefaultTouchEvents = this.settings.preventDefaultTouchEvents;
				
				Util.Events.fire(this, PhotoSwipe.EventTypes.onZoomPanRotateHide);
				
			}
		
		},
		
		
		
		/*
		 * Function: canUserZoom
		 */
		canUserZoom: function(){
			
			var testEl, cacheImage;
			
			if (Util.Browser.msie){
				testEl = document.createElement('div');
				if (Util.isNothing(testEl.style.msTransform)){
					return false;
				}
			}
			else if (!Util.Browser.isCSSTransformSupported){
				return false;
			}
			
			if (!this.settings.allowUserZoom){
				return false;
			}
			
			
			if (this.carousel.isSliding){
				return false;
			}
			
			cacheImage = this.cache.images[this.currentIndex];
			
			if (Util.isNothing(cacheImage)){
				return false;
			}
			
			if (cacheImage.isLoading){
				return false;
			}
			
			return true;
			
		},
		
		
		
		/*
		 * Function: isZoomActive
		 */
		isZoomActive: function(){
		
			return (!Util.isNothing(this.zoomPanRotate));
		
		},
		
		
		
		/*
		 * Function: getCurrentImage
		 */
		getCurrentImage: function(){
		
			return this.cache.images[this.currentIndex];
		
		},
		
		
		
		/*
		 * Function: onDocumentOverlayFadeIn
		 */
		onDocumentOverlayFadeIn: function(e){
			
			window.setTimeout(function(){
				
				var el = (this.settings.target === window) ? window.document.body : this.settings.target;
				
				Util.DOM.removeClass(el, PhotoSwipe.CssClasses.buildingBody);
				Util.DOM.addClass(el, PhotoSwipe.CssClasses.activeBody);
				
				this.addEventHandlers();
				
				this.carousel.show(this.currentIndex);
				
				this.uiLayer.show();
				
				if (this.settings.autoStartSlideshow){
					this.play();
				}
				else if (!Util.isNothing(this.toolbar)){
					this.toolbar.show(this.currentIndex);
				}
				
				Util.Events.fire(this, {
					type: PhotoSwipe.EventTypes.onShow,
					target: this
				});
			
				this.setUIWebViewResetPositionTimeout();
				
			}.bind(this), 250);
			
			
		},
		
		
		
		/*
		 * Function: setUIWebViewResetPositionTimeout
		 */
		setUIWebViewResetPositionTimeout: function(){
			
			if (!this.settings.enableUIWebViewRepositionTimeout){
				return;
			}
			
			if (!(Util.Browser.iOS && (!Util.Browser.safari))){
				return;
			}
			
			if (!Util.isNothing(this._uiWebViewResetPositionTimeout)){
				window.clearTimeout(this._uiWebViewResetPositionTimeout);
			}
			this._uiWebViewResetPositionTimeout = window.setTimeout(function(){
				
				this.resetPosition();
				
				this.setUIWebViewResetPositionTimeout();
				
			}.bind(this), this.settings.uiWebViewResetPositionDelay);
			
		},
		
		
		
		/*
		 * Function: clearUIWebViewResetPositionTimeout
		 */
		clearUIWebViewResetPositionTimeout: function(){
			if (!Util.isNothing(this._uiWebViewResetPositionTimeout)){
				window.clearTimeout(this._uiWebViewResetPositionTimeout);
			}
		},
		
		
		
		/*
		 * Function: onWindowScroll
		 */
		onWindowScroll: function(e){
			
			this.resetPosition();
		
		},
		
		
		
		/*
		 * Function: onWindowOrientationChange
		 */
		onWindowOrientationChange: function(e){
			
			this.resetPosition();
			
		},
		
		
		
		/*
		 * Function: onWindowHashChange
		 */
		onWindowHashChange: function(e){
			
			var compareHash = '#' + 
				((this.settings.jQueryMobile) ? this.settings.jQueryMobileDialogHash : this.currentHistoryHashValue);
			
			if (window.location.hash !== compareHash){
				this.backButtonClicked = true;
				this.hide();
			}
		
		},
		
		
		
		/*
		 * Function: onKeyDown
		 */
		onKeyDown: function(e){
			
			if (e.keyCode === 37) { // Left
				e.preventDefault();
				this.previous();
			}
			else if (e.keyCode === 39) { // Right
				e.preventDefault();
				this.next();
			}
			else if (e.keyCode === 38 || e.keyCode === 40) { // Up and down
				e.preventDefault();
			}
			else if (e.keyCode === 27) { // Escape
				e.preventDefault();
				this.hide();
			}
			else if (e.keyCode === 32) { // Spacebar
				if (!this.settings.hideToolbar){
					this.toggleToolbar();
				}
				else{
					this.hide();
				}
				e.preventDefault();
			}
			else if (e.keyCode === 13) { // Enter
				e.preventDefault();
				this.play();
			}
			
		},
		
		
		
		/*
		 * Function: onUILayerTouch
		 */
		onUILayerTouch: function(e){
			
			if (this.isZoomActive()){
				
				switch (e.action){
					
					case Util.TouchElement.ActionTypes.gestureChange:
						this.zoomPanRotate.zoomRotate(e.scale, (this.settings.allowRotationOnUserZoom) ? e.rotation : 0);
						break;
					
					case Util.TouchElement.ActionTypes.gestureEnd:
						this.zoomPanRotate.setStartingScaleAndRotation(e.scale, (this.settings.allowRotationOnUserZoom) ? e.rotation : 0);
						break;
						
					case Util.TouchElement.ActionTypes.touchStart:
						this.zoomPanRotate.panStart(e.point);
						break;
					
					case Util.TouchElement.ActionTypes.touchMove:
						this.zoomPanRotate.pan(e.point);
						break;
						
					case Util.TouchElement.ActionTypes.doubleTap:
						this.destroyZoomPanRotate();
						this.toggleToolbar();
						break;
					
					case Util.TouchElement.ActionTypes.swipeLeft:
						this.destroyZoomPanRotate();
						this.next();
						this.toggleToolbar();
						break;
						
					case Util.TouchElement.ActionTypes.swipeRight:
						this.destroyZoomPanRotate();
						this.previous();
						this.toggleToolbar();
						break;
				}
			
			}
			else{
				
				switch (e.action){
					
					case Util.TouchElement.ActionTypes.touchMove:
					case Util.TouchElement.ActionTypes.swipeLeft:
					case Util.TouchElement.ActionTypes.swipeRight:
						
						// Hide the toolbar if need be 
						this.fadeOutToolbarIfVisible();
						
						// Pass the touch onto the carousel
						this.carousel.onTouch(e.action, e.point);
						break;
					
					case Util.TouchElement.ActionTypes.touchStart:
					case Util.TouchElement.ActionTypes.touchMoveEnd:
					
						// Pass the touch onto the carousel
						this.carousel.onTouch(e.action, e.point);
						break;
						
					case Util.TouchElement.ActionTypes.tap:
						this.toggleToolbar();
						break;
						
					case Util.TouchElement.ActionTypes.doubleTap:
						
						// Take into consideration the window scroll
						if (this.settings.target === window){
							e.point.x -= Util.DOM.windowScrollLeft();
							e.point.y -= Util.DOM.windowScrollTop();
						}
						
						// Just make sure that if the user clicks out of the image
						// that the image does not pan out of view!
						var 
							cacheImageEl = this.cache.images[this.currentIndex].imageEl,
						
							imageTop = window.parseInt(Util.DOM.getStyle(cacheImageEl, 'top'), 10),
							imageLeft = window.parseInt(Util.DOM.getStyle(cacheImageEl, 'left'), 10),
							imageRight = imageLeft + Util.DOM.width(cacheImageEl),
							imageBottom = imageTop + Util.DOM.height(cacheImageEl);
						
						if (e.point.x < imageLeft){
							e.point.x = imageLeft;
						}
						else if (e.point.x > imageRight){
							e.point.x = imageRight;
						}
						
						if (e.point.y < imageTop){
							e.point.y = imageTop;
						}
						else if (e.point.y > imageBottom){
							e.point.y = imageBottom;
						}
						
						this.createZoomPanRotate();
						if (this.isZoomActive()){
							this.zoomPanRotate.zoomAndPanToPoint(this.settings.doubleTapZoomLevel, e.point);
						}
						
						break;
					
					case Util.TouchElement.ActionTypes.gestureStart:
						this.createZoomPanRotate();
						break;
				}
				
				
			}
			
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onTouch,
				target: this,
				point: e.point, 
				action: e.action
			});
			
		},
		
		
		
		/*
		 * Function: onCarouselSlideByEnd
		 */
		onCarouselSlideByEnd: function(e){
			
			this.currentIndex = e.cacheIndex;
			
			if (!Util.isNothing(this.toolbar)){
				this.toolbar.setCaption(this.currentIndex);
				this.toolbar.setToolbarStatus(this.currentIndex);
			}
			
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onDisplayImage,
				target: this,
				action: e.action,
				index: e.cacheIndex
			});
		
		},
		
		
		
		/*
		 * Function: onToolbarTap
		 */
		onToolbarTap: function(e){
		
			switch(e.action){
				
				case Toolbar.ToolbarAction.next:
					this.next();
					break;
				
				case Toolbar.ToolbarAction.previous:
					this.previous();
					break;
					
				case Toolbar.ToolbarAction.close:
					this.hide();
					break;
				
				case Toolbar.ToolbarAction.play:
					this.play();
					break;
					
			}
			
			Util.Events.fire(this, { 
				type: PhotoSwipe.EventTypes.onToolbarTap, 
				target: this,
				toolbarAction: e.action,
				tapTarget: e.tapTarget
			});
			
		},
		
		
		
		/*
		 * Function: onMouseWheel
		 */
		onMouseWheel: function(e){
			
			var 
				delta = Util.Events.getWheelDelta(e),
				dt = e.timeStamp - (this.mouseWheelStartTime || 0);
			
			if (dt < this.settings.mouseWheelSpeed) {
				return;
			}
			
			this.mouseWheelStartTime = e.timeStamp;
			
			if (this.settings.invertMouseWheel){
				delta = delta * -1;
			}
			
			if (delta < 0){
				this.next();
			}
			else if (delta > 0){
				this.previous();
			}
			
		},
		
		
		
		/*
		 * Function: onCarouselSlideshowStart
		 */
		onCarouselSlideshowStart: function(e){
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onSlideshowStart,
				target: this
			});
		
		},
		
		
		
		/*
		 * Function: onCarouselSlideshowStop
		 */
		onCarouselSlideshowStop: function(e){
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onSlideshowStop,
				target: this
			});
		
		},
		
		
		
		/*
		 * Function: onToolbarBeforeShow
		 */
		onToolbarBeforeShow: function(e){
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarShow,
				target: this
			});
		
		},
		
		
		
		/*
		 * Function: onToolbarShow
		 */
		onToolbarShow: function(e){
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onCaptionAndToolbarShow,
				target: this
			});
		
		},
		
		
		
		/*
		 * Function: onToolbarBeforeHide
		 */
		onToolbarBeforeHide: function(e){
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onBeforeCaptionAndToolbarHide,
				target: this
			});
		
		},
		
		
		
		/*
		 * Function: onToolbarHide
		 */
		onToolbarHide: function(e){
		
			Util.Events.fire(this, {
				type: PhotoSwipe.EventTypes.onCaptionAndToolbarHide,
				target: this
			});
		
		},
		
		
		
		/*
		 * Function: onZoomPanRotateTransform
		 */
		onZoomPanRotateTransform: function(e){
			
			Util.Events.fire(this, {
				target: this,
				type: PhotoSwipe.EventTypes.onZoomPanRotateTransform,
				scale: e.scale,
				rotation: e.rotation,
				rotationDegs: e.rotationDegs,
				translateX: e.translateX,
				translateY: e.translateY
			});
			
		}
		
		
	});
	
	
	
}
(
	window, 
	window.klass, 
	window.Code.Util,
	window.Code.PhotoSwipe.Cache,
	window.Code.PhotoSwipe.DocumentOverlay,
	window.Code.PhotoSwipe.Carousel,
	window.Code.PhotoSwipe.Toolbar,
	window.Code.PhotoSwipe.UILayer,
	window.Code.PhotoSwipe.ZoomPanRotate
));
/**
 * @version: 1.0 Alpha-1
 * @author: Coolite Inc. http://www.coolite.com/
 * @date: 2008-05-13
 * @copyright: Copyright (c) 2006-2008, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * @license: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * @website: http://www.datejs.com/
 *
 * SANI_GARF: Note I got this version by copying the source used for the demo on datejs.com rather than from their download
 * The version that you download is from 2007 and has trouble parsing ISO formated dates. See this thread: 
 * http://code.google.com/p/datejs/issues/detail?can=2&start=0&num=100&q=&colspec=ID%20Type%20Status%20Priority%20Milestone%20Owner%20Summary&groupby=&sort=&id=59
 */

Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|aft(er)?|from|hence)/i,subtract:/^(\-|bef(ore)?|ago)/i,yesterday:/^yes(terday)?/i,today:/^t(od(ay)?)?/i,tomorrow:/^tom(orrow)?/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^mn|min(ute)?s?/i,hour:/^h(our)?s?/i,week:/^w(eek)?s?/i,month:/^m(onth)?s?/i,day:/^d(ay)?s?/i,year:/^y(ear)?s?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt|utc)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a(?!u|p)|p)/i},timezones:[{name:"UTC",offset:"-000"},{name:"GMT",offset:"-000"},{name:"EST",offset:"-0500"},{name:"EDT",offset:"-0400"},{name:"CST",offset:"-0600"},{name:"CDT",offset:"-0500"},{name:"MST",offset:"-0700"},{name:"MDT",offset:"-0600"},{name:"PST",offset:"-0800"},{name:"PDT",offset:"-0700"}]};
(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo,p=function(s,l){if(!l){l=2;}
return("000"+s).slice(l*-1);};$P.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};$P.setTimeToNow=function(){var n=new Date();this.setHours(n.getHours());this.setMinutes(n.getMinutes());this.setSeconds(n.getSeconds());this.setMilliseconds(n.getMilliseconds());return this;};$D.today=function(){return new Date().clearTime();};$D.compare=function(date1,date2){if(isNaN(date1)||isNaN(date2)){throw new Error(date1+" - "+date2);}else if(date1 instanceof Date&&date2 instanceof Date){return(date1<date2)?-1:(date1>date2)?1:0;}else{throw new TypeError(date1+" - "+date2);}};$D.equals=function(date1,date2){return(date1.compareTo(date2)===0);};$D.getDayNumberFromName=function(name){var n=$C.dayNames,m=$C.abbreviatedDayNames,o=$C.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s||o[i].toLowerCase()==s){return i;}}
return-1;};$D.getMonthNumberFromName=function(name){var n=$C.monthNames,m=$C.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};$D.isLeapYear=function(year){return((year%4===0&&year%100!==0)||year%400===0);};$D.getDaysInMonth=function(year,month){return[31,($D.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};$D.getTimezoneAbbreviation=function(offset){var z=$C.timezones,p;for(var i=0;i<z.length;i++){if(z[i].offset===offset){return z[i].name;}}
return null;};$D.getTimezoneOffset=function(name){var z=$C.timezones,p;for(var i=0;i<z.length;i++){if(z[i].name===name.toUpperCase()){return z[i].offset;}}
return null;};$P.clone=function(){return new Date(this.getTime());};$P.compareTo=function(date){return Date.compare(this,date);};$P.equals=function(date){return Date.equals(this,date||new Date());};$P.between=function(start,end){return this.getTime()>=start.getTime()&&this.getTime()<=end.getTime();};$P.isAfter=function(date){return this.compareTo(date||new Date())===1;};$P.isBefore=function(date){return(this.compareTo(date||new Date())===-1);};$P.isToday=function(){return this.isSameDay(new Date());};$P.isSameDay=function(date){return this.clone().clearTime().equals(date.clone().clearTime());};$P.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};$P.addSeconds=function(value){return this.addMilliseconds(value*1000);};$P.addMinutes=function(value){return this.addMilliseconds(value*60000);};$P.addHours=function(value){return this.addMilliseconds(value*3600000);};$P.addDays=function(value){this.setDate(this.getDate()+value);return this;};$P.addWeeks=function(value){return this.addDays(value*7);};$P.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,$D.getDaysInMonth(this.getFullYear(),this.getMonth())));return this;};$P.addYears=function(value){return this.addMonths(value*12);};$P.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.milliseconds){this.addMilliseconds(x.milliseconds);}
if(x.seconds){this.addSeconds(x.seconds);}
if(x.minutes){this.addMinutes(x.minutes);}
if(x.hours){this.addHours(x.hours);}
if(x.weeks){this.addWeeks(x.weeks);}
if(x.months){this.addMonths(x.months);}
if(x.years){this.addYears(x.years);}
if(x.days){this.addDays(x.days);}
return this;};var $y,$m,$d;$P.getWeek=function(){var a,b,c,d,e,f,g,n,s,w;$y=(!$y)?this.getFullYear():$y;$m=(!$m)?this.getMonth()+1:$m;$d=(!$d)?this.getDate():$d;if($m<=2){a=$y-1;b=(a/4|0)-(a/100|0)+(a/400|0);c=((a-1)/4|0)-((a-1)/100|0)+((a-1)/400|0);s=b-c;e=0;f=$d-1+(31*($m-1));}else{a=$y;b=(a/4|0)-(a/100|0)+(a/400|0);c=((a-1)/4|0)-((a-1)/100|0)+((a-1)/400|0);s=b-c;e=s+1;f=$d+((153*($m-3)+2)/5)+58+s;}
g=(a+b)%7;d=(f+g-e)%7;n=(f+3-d)|0;if(n<0){w=53-((g-s)/5|0);}else if(n>364+s){w=1;}else{w=(n/7|0)+1;}
$y=$m=$d=null;return w;};$P.getISOWeek=function(){$y=this.getUTCFullYear();$m=this.getUTCMonth()+1;$d=this.getUTCDate();return p(this.getWeek());};$P.setWeek=function(n){return this.moveToDayOfWeek(1).addWeeks(n-this.getWeek());};$D._validate=function(n,min,max,name){if(typeof n=="undefined"){return false;}else if(typeof n!="number"){throw new TypeError(n+" is not a Number.");}else if(n<min||n>max){throw new RangeError(n+" is not a valid value for "+name+".");}
return true;};$D.validateMillisecond=function(value){return $D._validate(value,0,999,"millisecond");};$D.validateSecond=function(value){return $D._validate(value,0,59,"second");};$D.validateMinute=function(value){return $D._validate(value,0,59,"minute");};$D.validateHour=function(value){return $D._validate(value,0,23,"hour");};$D.validateDay=function(value,year,month){return $D._validate(value,1,$D.getDaysInMonth(year,month),"day");};$D.validateMonth=function(value){return $D._validate(value,0,11,"month");};$D.validateYear=function(value){return $D._validate(value,0,9999,"year");};$P.set=function(config){if($D.validateMillisecond(config.millisecond)){this.addMilliseconds(config.millisecond-this.getMilliseconds());}
if($D.validateSecond(config.second)){this.addSeconds(config.second-this.getSeconds());}
if($D.validateMinute(config.minute)){this.addMinutes(config.minute-this.getMinutes());}
if($D.validateHour(config.hour)){this.addHours(config.hour-this.getHours());}
if($D.validateMonth(config.month)){this.addMonths(config.month-this.getMonth());}
if($D.validateYear(config.year)){this.addYears(config.year-this.getFullYear());}
if($D.validateDay(config.day,this.getFullYear(),this.getMonth())){this.addDays(config.day-this.getDate());}
if(config.timezone){this.setTimezone(config.timezone);}
if(config.timezoneOffset){this.setTimezoneOffset(config.timezoneOffset);}
if(config.week&&$D._validate(config.week,0,53,"week")){this.setWeek(config.week);}
return this;};$P.moveToFirstDayOfMonth=function(){return this.set({day:1});};$P.moveToLastDayOfMonth=function(){return this.set({day:$D.getDaysInMonth(this.getFullYear(),this.getMonth())});};$P.moveToNthOccurrence=function(dayOfWeek,occurrence){var shift=0;if(occurrence>0){shift=occurrence-1;}
else if(occurrence===-1){this.moveToLastDayOfMonth();if(this.getDay()!==dayOfWeek){this.moveToDayOfWeek(dayOfWeek,-1);}
return this;}
return this.moveToFirstDayOfMonth().addDays(-1).moveToDayOfWeek(dayOfWeek,+1).addWeeks(shift);};$P.moveToDayOfWeek=function(dayOfWeek,orient){var diff=(dayOfWeek-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};$P.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};$P.getOrdinalNumber=function(){return Math.ceil((this.clone().clearTime()-new Date(this.getFullYear(),0,1))/86400000)+1;};$P.getTimezone=function(){return $D.getTimezoneAbbreviation(this.getUTCOffset());};$P.setTimezoneOffset=function(offset){var here=this.getTimezoneOffset(),there=Number(offset)*-6/10;return this.addMinutes(there-here);};$P.setTimezone=function(offset){return this.setTimezoneOffset($D.getTimezoneOffset(offset));};$P.hasDaylightSavingTime=function(){return(Date.today().set({month:0,day:1}).getTimezoneOffset()!==Date.today().set({month:6,day:1}).getTimezoneOffset());};$P.isDaylightSavingTime=function(){return(this.hasDaylightSavingTime()&&new Date().getTimezoneOffset()===Date.today().set({month:6,day:1}).getTimezoneOffset());};$P.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r.charAt(0)+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};$P.getElapsed=function(date){return(date||new Date())-this;};if(!$P.toISOString){$P.toISOString=function(){function f(n){return n<10?'0'+n:n;}
return'"'+this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z"';};}
$P._toString=$P.toString;$P.toString=function(format){var x=this;if(format&&format.length==1){var c=$C.formatPatterns;x.t=x.toString;switch(format){case"d":return x.t(c.shortDate);case"D":return x.t(c.longDate);case"F":return x.t(c.fullDateTime);case"m":return x.t(c.monthDay);case"r":return x.t(c.rfc1123);case"s":return x.t(c.sortableDateTime);case"t":return x.t(c.shortTime);case"T":return x.t(c.longTime);case"u":return x.t(c.universalSortableDateTime);case"y":return x.t(c.yearMonth);}}
var ord=function(n){switch(n*1){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};return format?format.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)/g,function(m){if(m.charAt(0)==="\\"){return m.replace("\\","");}
x.h=x.getHours;switch(m){case"hh":return p(x.h()<13?(x.h()===0?12:x.h()):(x.h()-12));case"h":return x.h()<13?(x.h()===0?12:x.h()):(x.h()-12);case"HH":return p(x.h());case"H":return x.h();case"mm":return p(x.getMinutes());case"m":return x.getMinutes();case"ss":return p(x.getSeconds());case"s":return x.getSeconds();case"yyyy":return p(x.getFullYear(),4);case"yy":return p(x.getFullYear());case"dddd":return $C.dayNames[x.getDay()];case"ddd":return $C.abbreviatedDayNames[x.getDay()];case"dd":return p(x.getDate());case"d":return x.getDate();case"MMMM":return $C.monthNames[x.getMonth()];case"MMM":return $C.abbreviatedMonthNames[x.getMonth()];case"MM":return p((x.getMonth()+1));case"M":return x.getMonth()+1;case"t":return x.h()<12?$C.amDesignator.substring(0,1):$C.pmDesignator.substring(0,1);case"tt":return x.h()<12?$C.amDesignator:$C.pmDesignator;case"S":return ord(x.getDate());default:return m;}}):this._toString();};}());
(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo,$N=Number.prototype;$P._orient=+1;$P._nth=null;$P._is=false;$P._same=false;$P._isSecond=false;$N._dateElement="day";$P.next=function(){this._orient=+1;return this;};$D.next=function(){return $D.today().next();};$P.last=$P.prev=$P.previous=function(){this._orient=-1;return this;};$D.last=$D.prev=$D.previous=function(){return $D.today().last();};$P.is=function(){this._is=true;return this;};$P.same=function(){this._same=true;this._isSecond=false;return this;};$P.today=function(){return this.same().day();};$P.weekday=function(){if(this._is){this._is=false;return(!this.is().sat()&&!this.is().sun());}
return false;};$P.at=function(time){return(typeof time==="string")?$D.parse(this.toString("d")+" "+time):this.set(time);};$N.fromNow=$N.after=function(date){var c={};c[this._dateElement]=this;return((!date)?new Date():date.clone()).add(c);};$N.ago=$N.before=function(date){var c={};c[this._dateElement]=this*-1;return((!date)?new Date():date.clone()).add(c);};var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),pxf=("Milliseconds Seconds Minutes Hours Date Week Month FullYear").split(/\s/),nth=("final first second third fourth fifth").split(/\s/),de;$P.toObject=function(){var o={};for(var i=0;i<px.length;i++){o[px[i].toLowerCase()]=this["get"+pxf[i]]();}
return o;};$D.fromObject=function(config){config.week=null;return Date.today().set(config);};var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
if(this._nth!==null){if(this._isSecond){this.addSeconds(this._orient*-1);}
this._isSecond=false;var ntemp=this._nth;this._nth=null;var temp=this.clone().moveToLastDayOfMonth();this.moveToNthOccurrence(n,ntemp);if(this>temp){throw new RangeError($D.getDayName(n)+" does not occur "+ntemp+" times in the month of "+$D.getMonthName(temp.getMonth())+" "+temp.getFullYear()+".");}
return this;}
return this.moveToDayOfWeek(n,this._orient);};};var sdf=function(n){return function(){var t=$D.today(),shift=n-t.getDay();if(n===0&&$C.firstDayOfWeek===1&&t.getDay()!==0){shift=shift+7;}
return t.addDays(shift);};};for(var i=0;i<dx.length;i++){$D[dx[i].toUpperCase()]=$D[dx[i].toUpperCase().substring(0,3)]=i;$D[dx[i]]=$D[dx[i].substring(0,3)]=sdf(i);$P[dx[i]]=$P[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};var smf=function(n){return function(){return $D.today().set({month:n,day:1});};};for(var j=0;j<mx.length;j++){$D[mx[j].toUpperCase()]=$D[mx[j].toUpperCase().substring(0,3)]=j;$D[mx[j]]=$D[mx[j].substring(0,3)]=smf(j);$P[mx[j]]=$P[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(this._isSecond){this._isSecond=false;return this;}
if(this._same){this._same=this._is=false;var o1=this.toObject(),o2=(arguments[0]||new Date()).toObject(),v="",k=j.toLowerCase();for(var m=(px.length-1);m>-1;m--){v=px[m].toLowerCase();if(o1[v]!=o2[v]){return false;}
if(k==v){break;}}
return true;}
if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$P[de]=$P[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}
$P._ss=ef("Second");var nthfn=function(n){return function(dayOfWeek){if(this._same){return this._ss(arguments[0]);}
if(dayOfWeek||dayOfWeek===0){return this.moveToNthOccurrence(dayOfWeek,n);}
this._nth=n;if(n===2&&(dayOfWeek===undefined||dayOfWeek===null)){this._isSecond=true;return this.addSeconds(this._orient);}
return this;};};for(var l=0;l<nth.length;l++){$P[nth[l]]=(l===0)?nthfn(-1):nthfn(l);}}());
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var $D=Date,$P=$D.prototype,$C=$D.CultureInfo;var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};$D.Grammar={};$D.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=(s.length==3)?"jan feb mar apr may jun jul aug sep oct nov dec".indexOf(s)/4:Number(s)-1;};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<$C.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
var now=new Date();if((this.hour||this.minute)&&(!this.month&&!this.year&&!this.day)){this.day=now.getDate();}
if(!this.year){this.year=now.getFullYear();}
if(!this.month&&this.month!==0){this.month=now.getMonth();}
if(!this.day){this.day=1;}
if(!this.hour){this.hour=0;}
if(!this.minute){this.minute=0;}
if(!this.second){this.second=0;}
if(this.meridian&&this.hour){if(this.meridian=="p"&&this.hour<12){this.hour=this.hour+12;}else if(this.meridian=="a"&&this.hour==12){this.hour=0;}}
if(this.day>$D.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
var today=$D.today();if(this.now&&!this.unit&&!this.operator){return new Date();}else if(this.now){today=new Date();}
var expression=!!(this.days&&this.days!==null||this.orient||this.operator);var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(!this.now&&"hour minute second".indexOf(this.unit)!=-1){today.setTimeToNow();}
if(this.month||this.month===0){if("year day hour minute second".indexOf(this.unit)!=-1){this.value=this.month+1;this.month=null;expression=true;}}
if(!expression&&this.weekday&&!this.day&&!this.days){var temp=Date[this.weekday]();this.day=temp.getDate();if(!this.month){this.month=temp.getMonth();}
this.year=temp.getFullYear();}
if(expression&&this.weekday&&this.unit!="month"){this.unit="day";gap=($D.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month&&this.unit=="day"&&this.operator){this.value=(this.month+1);this.month=null;}
if(this.value!=null&&this.month!=null&&this.year!=null){this.day=this.value*1;}
if(this.month&&!this.day&&this.value){today.set({day:this.value*1});if(!expression){this.day=this.value*1;}}
if(!this.month&&this.value&&this.unit=="month"&&!this.now){this.month=this.value;expression=true;}
if(expression&&(this.month||this.month===0)&&this.unit!="year"){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(!this.value&&this.operator&&this.operator!==null&&this[this.unit+"s"]&&this[this.unit+"s"]!==null){this[this.unit+"s"]=this[this.unit+"s"]+((this.operator=="add")?1:-1)+(this.value||0)*orient;}else if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
this[this.unit+"s"]=this.value*orient;}
if(this.meridian&&this.hour){if(this.meridian=="p"&&this.hour<12){this.hour=this.hour+12;}else if(this.meridian=="a"&&this.hour==12){this.hour=0;}}
if(this.weekday&&!this.day&&!this.days){var temp=Date[this.weekday]();this.day=temp.getDate();if(temp.getMonth()!==today.getMonth()){this.month=temp.getMonth();}}
if((this.month||this.month===0)&&!this.day){this.day=1;}
if(!this.orient&&!this.operator&&this.unit=="week"&&this.value&&!this.day&&!this.month){return Date.today().setWeek(this.value);}
if(expression&&this.timezone&&this.day&&this.days){this.day=this.days;}
return(expression)?today.add(this):today.set(this);}};var _=$D.Parsing.Operators,g=$D.Grammar,t=$D.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|@|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=$C.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken($C.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.m,g.s],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^((\+|\-)\s*\d\d\d\d)|((\+|\-)\d\d\:?\d\d)/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("second minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[$C.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw $D.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["\"yyyy-MM-ddTHH:mm:ssZ\"","yyyy-MM-ddTHH:mm:ssZ","yyyy-MM-ddTHH:mm:ssz","yyyy-MM-ddTHH:mm:ss","yyyy-MM-ddTHH:mmZ","yyyy-MM-ddTHH:mmz","yyyy-MM-ddTHH:mm","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","MMddyyyy","ddMMyyyy","Mddyyyy","ddMyyyy","Mdyyyy","dMyyyy","yyyy","Mdyy","dMyy","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};$D._parse=$D.parse;$D.parse=function(s){var r=null;if(!s){return null;}
if(s instanceof Date){return s;}
try{r=$D.Grammar.start.call({},s.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1"));}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};$D.getParseFunction=function(fx){var fn=$D.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};$D.parseExact=function(s,fx){return $D.getParseFunction(fx)(s);};}());
/*!
 * jsUri v1.1.1
 * https://github.com/derek-watson/jsUri
 *
 * Copyright 2011, Derek Watson
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Includes parseUri regular expressions
 * http://blog.stevenlevithan.com/archives/parseuri
 * Copyright 2007, Steven Levithan
 * Released under the MIT license.
 *
 * Date: Mon Nov 14 20:06:34 2011 -0800
 */

    

var Query = function (queryString) {

    // query string parsing, parameter manipulation and stringification

    'use strict';

    var // parseQuery(q) parses the uri query string and returns a multi-dimensional array of the components
        parseQuery = function (q) {
            var arr = [], i, ps, p, keyval;

            if (typeof (q) === 'undefined' || q === null || q === '') {
                return arr;
            }

            if (q.indexOf('?') === 0) {
                q = q.substring(1);
            }

            ps = q.toString().split(/[&;]/);

            for (i = 0; i < ps.length; i++) {
                p = ps[i];
                keyval = p.split('=');
                arr.push([keyval[0], keyval[1]]);
            }

            return arr;
        },

        params = parseQuery(queryString),

        // toString() returns a string representation of the internal state of the object
        toString = function () {
            var s = '', i, param;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (s.length > 0) {
                    s += '&';
                }
                s += param.join('=');
            }
            return s.length > 0 ? '?' + s : s;
        },

        decode = function (s) {
            s = decodeURIComponent(s);
            s = s.replace('+', ' ');
            return s;
        },

        // getParamValues(key) returns the first query param value found for the key 'key'
        getParamValue = function (key) {
            var param, i;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (decode(key) === decode(param[0])) {
                    return param[1];
                }
            }
        },

        // getParamValues(key) returns an array of query param values for the key 'key'
        getParamValues = function (key) {
            var arr = [], i, param;
            for (i = 0; i < params.length; i++) {
                param = params[i];
                if (decode(key) === decode(param[0])) {
                    arr.push(param[1]);
                }
            }
            return arr;
        },

        // deleteParam(key) removes all instances of parameters named (key)
        // deleteParam(key, val) removes all instances where the value matches (val)
        deleteParam = function (key, val) {

            var arr = [], i, param, keyMatchesFilter, valMatchesFilter;

            for (i = 0; i < params.length; i++) {

                param = params[i];
                keyMatchesFilter = decode(param[0]) === decode(key);
                valMatchesFilter = decode(param[1]) === decode(val);

                if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && !keyMatchesFilter && !valMatchesFilter)) {
                    arr.push(param);
                }
            }

            params = arr;

            return this;
        },

        // addParam(key, val) Adds an element to the end of the list of query parameters
        // addParam(key, val, index) adds the param at the specified position (index)
        addParam = function (key, val, index) {

            if (arguments.length === 3 && index !== -1) {
                index = Math.min(index, params.length);
                params.splice(index, 0, [key, val]);
            } else if (arguments.length > 0) {
                params.push([key, val]);
            }
            return this;
        },

        // replaceParam(key, newVal) deletes all instances of params named (key) and replaces them with the new single value
        // replaceParam(key, newVal, oldVal) deletes only instances of params named (key) with the value (val) and replaces them with the new single value
        // this function attempts to preserve query param ordering
        replaceParam = function (key, newVal, oldVal) {

            var index = -1, i, param;

            if (arguments.length === 3) {
                for (i = 0; i < params.length; i++) {
                    param = params[i];
                    if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
                        index = i;
                        break;
                    }
                }
                deleteParam(key, oldVal).addParam(key, newVal, index);
            } else {
                for (i = 0; i < params.length; i++) {
                    param = params[i];
                    if (decode(param[0]) === decode(key)) {
                        index = i;
                        break;
                    }
                }
                deleteParam(key);
                addParam(key, newVal, index);
            }
            return this;
        };

    // public api
    return {
        getParamValue: getParamValue,
        getParamValues: getParamValues,
        deleteParam: deleteParam,
        addParam: addParam,
        replaceParam: replaceParam,
        
        toString: toString
    };
};

var Uri = function (uriString) {

    // uri string parsing, attribute manipulation and stringification

    'use strict';

    /*global Query: true */
    /*jslint regexp: false, plusplus: false */

    var strictMode = false,

        // parseUri(str) parses the supplied uri and returns an object containing its components
        parseUri = function (str) {

            /*jslint unparam: true */
            var parsers = {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                },
                keys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                q = {
                    name: "queryKey",
                    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                },
                m = parsers[strictMode ? "strict" : "loose"].exec(str),
                uri = {},
                i = 14;

            while (i--) {
                uri[keys[i]] = m[i] || "";
            }

            uri[q.name] = {};
            uri[keys[12]].replace(q.parser, function ($0, $1, $2) {
                if ($1) {
                    uri[q.name][$1] = $2;
                }
            });

            return uri;
        },

        uriParts = parseUri(uriString || ''),

        queryObj = new Query(uriParts.query),


        /*
            Basic get/set functions for all properties
        */

        protocol = function (val) {
            if (typeof val !== 'undefined') {
                uriParts.protocol = val;
            }
            return uriParts.protocol;
        },

        hasAuthorityPrefixUserPref = null,

        // hasAuthorityPrefix: if there is no protocol, the leading // can be enabled or disabled
        hasAuthorityPrefix = function (val) {

            if (typeof val !== 'undefined') {
                hasAuthorityPrefixUserPref = val;
            }

            if (hasAuthorityPrefixUserPref === null) {
                return (uriParts.source.indexOf('//') !== -1);
            } else {
                return hasAuthorityPrefixUserPref;
            }
        },

        userInfo = function (val) {
            if (typeof val !== 'undefined') {
                uriParts.userInfo = val;
            }
            return uriParts.userInfo;
        },

        host = function (val) {
            if (typeof val !== 'undefined') {
                uriParts.host = val;
            }
            return uriParts.host;
        },

        port = function (val) {
            if (typeof val !== 'undefined') {
                uriParts.port = val;
            }
            return uriParts.port;
        },

        path = function (val) {
            if (typeof val !== 'undefined') {
                uriParts.path = val;
            }
            return uriParts.path;
        },

        query = function (val) {
            if (typeof val !== 'undefined') {
                queryObj = new Query(val);
            }
            return queryObj;
        },

        anchor = function (val) {
            if (typeof val !== 'undefined') {
                uriParts.anchor = val;
            }
            return uriParts.anchor;
        },


        /*
            Fluent setters for Uri uri properties
        */

        setProtocol = function (val) {
            protocol(val);
            return this;
        },

        setHasAuthorityPrefix = function (val) {
            hasAuthorityPrefix(val);
            return this;
        },

        setUserInfo = function (val) {
            userInfo(val);
            return this;
        },

        setHost = function (val) {
            host(val);
            return this;
        },

        setPort = function (val) {
            port(val);
            return this;
        },

        setPath = function (val) {
            path(val);
            return this;
        },

        setQuery = function (val) {
            query(val);
            return this;
        },

        setAnchor = function (val) {
            anchor(val);
            return this;
        },

        /*
            Query method wrappers
        */
        getQueryParamValue = function (key) {
            return query().getParamValue(key);
        },

        getQueryParamValues = function (key) {
            return query().getParamValues(key);
        },

        deleteQueryParam = function (key, val) {
            if (arguments.length === 2) {
                query().deleteParam(key, val);
            } else {
                query().deleteParam(key);
            }

            return this;
        },

        addQueryParam = function (key, val, index) {
            if (arguments.length === 3) {
                query().addParam(key, val, index);
            } else {
                query().addParam(key, val);
            }
            return this;
        },

        replaceQueryParam = function (key, newVal, oldVal) {
            if (arguments.length === 3) {
                query().replaceParam(key, newVal, oldVal);
            } else {
                query().replaceParam(key, newVal);
            }

            return this;
        },

        /*
            Serialization
        */

        // toString() stringifies the current state of the uri
        toString = function () {

            var s = '',
                is = function (s) {
                    return (s !== null && s !== '');
                };

            if (is(protocol())) {
                s += protocol();
                if (protocol().indexOf(':') !== protocol().length - 1) {
                    s += ':';
                }
                s += '//';
            } else {
                if (hasAuthorityPrefix() && is(host())) {
                    s += '//';
                }
            }

            if (is(userInfo()) && is(host())) {
                s += userInfo();
                if (userInfo().indexOf('@') !== userInfo().length - 1) {
                    s += '@';
                }
            }

            if (is(host())) {
                s += host();
                if (is(port())) {
                    s += ':' + port();
                }
            }

            if (is(path())) {
                s += path();
            } else {
                if (is(host()) && (is(query().toString()) || is(anchor()))) {
                    s += '/';
                }
            }
            if (is(query().toString())) {
                if (query().toString().indexOf('?') !== 0) {
                    s += '?';
                }
                s += query().toString();
            }

            if (is(anchor())) {
                if (anchor().indexOf('#') !== 0) {
                    s += '#';
                }
                s += anchor();
            }

            return s;
        },

        /*
            Cloning
        */

        // clone() returns a new, identical Uri instance
        clone = function () {
            return new Uri(toString());
        };

    // public api
    return {

        protocol: protocol,
        hasAuthorityPrefix: hasAuthorityPrefix,
        userInfo: userInfo,
        host: host,
        port: port,
        path: path,
        query: query,
        anchor: anchor,
        
        setProtocol: setProtocol,
        setHasAuthorityPrefix: setHasAuthorityPrefix,
        setUserInfo: setUserInfo,
        setHost: setHost,
        setPort: setPort,
        setPath: setPath,
        setQuery: setQuery,
        setAnchor: setAnchor,
        
        getQueryParamValue: getQueryParamValue,
        getQueryParamValues: getQueryParamValues,
        deleteQueryParam: deleteQueryParam,
        addQueryParam: addQueryParam,
        replaceQueryParam: replaceQueryParam,
        
        toString: toString,
        clone: clone
    };
};

/* add compatibility for users of jsUri <= 1.1.1 */
var jsUri = Uri;
(function() {
  var AutoCompleteDisplay,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AutoComplete = (function() {

    AutoComplete.prototype.page_id = null;

    AutoComplete.prototype.name_of_self = null;

    AutoComplete.prototype.theme = null;

    AutoComplete.prototype.template_for_list_item = null;

    AutoComplete.prototype.template_for_picked_item = null;

    AutoComplete.prototype.acp = null;

    AutoComplete.prototype.acs = null;

    AutoComplete.prototype.acd = null;

    function AutoComplete(options) {
      var picked_items_box, search_input_field, search_results_box;
      if (options == null) {
        options = {};
      }
      this.picked_items = __bind(this.picked_items, this);

      if (options.name_of_self == null) {
        $.error("AutoComplete requires that  you pass in the name the instance of it that you created so that it can create the appropriate onclick text for the search results.");
      }
      this.name_of_self = options.name_of_self;
      if (options.page_id == null) {
        $.error("AutoComplete requires a page_id. This should be the id of the page containing the autocomple view elements.");
      }
      this.page_id = options.page_id;
      this.theme = options.theme != null ? options.theme : "c";
      search_input_field = $("#" + this.page_id + " .auto_complete_search_input_field");
      search_results_box = $("#" + this.page_id + " .auto_complete_search_results_box");
      picked_items_box = $("#" + this.page_id + " .auto_complete_picked_items_box");
      this.template_for_list_item = options.template_for_list_item != null ? options.template_for_list_item : "<li data-auto_complete_id='list_item_id'                                                                                                                 data-auto_complete_str='list_item_str'                                                                                                                  class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-" + this.theme + "'                                                                                                                 onclick='list_item_pick_onclick_text' >                                                                                                              <div class='ui-btn-inner ui-li'>                                                                                                                <div class='ui-btn-text'>                                                                                                                  <a class='ui-link-inherit' href='#'>list_item_str</a>                                                                                                                </div>                                                                                                                <span class='ui-icon ui-icon-plus ui-icon-shadow'> </span>                                                                                                              </div>                                                                                                            </li>";
      this.template_for_picked_item = options.template_for_picked_item != null ? options.template_for_picked_item : "<a class='ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-mini ui-btn-icon-right ui-btn-up-" + this.theme + "'                                                                                                                       data-auto_complete_id=''                                                                                                                      onclick='" + this.name_of_self + ".acp.delete(this)'>                                                                                                                      <span class='ui-btn-inner ui-btn-corner-all'>                                                                                                                        <span class='ui-btn-text'>Some text</span>                                                                                                                        <span class='ui-icon ui-icon-delete ui-icon-shadow'> </span>                                                                                                                      </span>                                                                                                                    </a>";
      this.acd = new AutoCompleteDisplay({
        page_id: this.page_id
      });
      this.acp = new AutoCompletePick({
        picked_items_box: picked_items_box,
        template_for_picked_item: this.template_for_picked_item,
        on_delete: this.acd.on_delete,
        on_pick: this.acd.on_pick
      });
      this.acs = new AutoCompleteSearch({
        search_input_field: search_input_field,
        search_results_box: search_results_box,
        pick_onclick_text: "" + this.name_of_self + ".acp.pick(this)",
        on_auto_complete: this.acd.on_auto_complete,
        template_for_list_item: this.template_for_list_item
      });
    }

    AutoComplete.prototype.picked_items = function() {
      return this.acp.picked_items;
    };

    return AutoComplete;

  })();

  window.AutoCompleteSearch = (function() {

    AutoCompleteSearch.prototype.search_input_field = null;

    AutoCompleteSearch.prototype.search_results_box = null;

    AutoCompleteSearch.prototype.pick_onclick_text = null;

    AutoCompleteSearch.prototype.template_for_list_item = null;

    AutoCompleteSearch.prototype.on_auto_complete = function() {};

    AutoCompleteSearch.prototype.full_list = [];

    AutoCompleteSearch.prototype.previous_matches = {};

    AutoCompleteSearch.prototype.first_letter_list = {};

    AutoCompleteSearch.prototype.first_letter_return_max_list_size = 50;

    function AutoCompleteSearch(options) {
      if (options == null) {
        options = {};
      }
      this.html_for_list = __bind(this.html_for_list, this);

      this.html_for_item = __bind(this.html_for_item, this);

      this.shortest_list_for_expression = __bind(this.shortest_list_for_expression, this);

      this.check = __bind(this.check, this);

      this.match = __bind(this.match, this);

      this.get_first_letter_list_for = __bind(this.get_first_letter_list_for, this);

      this.setup_first_letter_list = __bind(this.setup_first_letter_list, this);

      this.setup_event_listner_on_search_input = __bind(this.setup_event_listner_on_search_input, this);

      console.log("Creating new autocompleter");
      if (options.search_input_field == null) {
        $.error("AutoCompleteSearch requires 'options.search_input_field' for which is monitored for text input. E.g. ac = new AutoCompleteSearch(search_input_field: $('#invite .auto_complete_exp' ))");
      }
      this.search_input_field = options.search_input_field;
      if (options.search_results_box == null) {
        $.error("AutoCompleteSearch requires 'options.search_results_box' for which is monitored for text input. E.g. ac = new AutoCompleteSearch(search_results_box: $('#invite .auto_complete_search_results_box' ))");
      }
      this.search_results_box = options.search_results_box;
      if (options.pick_onclick_text == null) {
        $.error("AutoCompleteSearch requires 'options.pick_onclick_text'.");
      }
      this.pick_onclick_text = options.pick_onclick_text;
      if (options.template_for_list_item == null) {
        $.error("AutoCompleteSearch requires 'template_for_list_item");
      }
      this.template_for_list_item = options.template_for_list_item;
      if (options.on_auto_complete != null) {
        this.on_auto_complete = options.on_auto_complete;
      }
      if (options.full_list != null) {
        this.full_list = options.full_list;
      } else {
        get_contacts({
          fresh: false
        });
        this.full_list = contact_list().filter(function(contact) {
          return contact.fullname != null;
        }).map(function(contact) {
          return {
            id: contact.id,
            str: contact.fullname
          };
        });
      }
      this.setup_first_letter_list();
      this.setup_event_listner_on_search_input();
    }

    AutoCompleteSearch.prototype.setup_event_listner_on_search_input = function() {
      var _this = this;
      return this.search_input_field.bind("keyup", function(event) {
        var exp;
        exp = _this.search_input_field.val();
        _this.search_results_box.html(_this.check(exp));
        console.log(_this.on_auto_complete.toString());
        return _this.on_auto_complete();
      });
    };

    AutoCompleteSearch.prototype.setup_first_letter_list = function() {
      var item, _i, _len, _ref, _results,
        _this = this;
      _ref = this.full_list;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push((function() {
          var fl;
          fl = item.str[0].toLowerCase();
          if (_this.first_letter_list[fl] == null) {
            _this.first_letter_list[fl] = [];
          }
          if (!(_this.first_letter_list[fl].length >= _this.first_letter_return_max_list_size)) {
            return _this.first_letter_list[fl].push(item);
          }
        })());
      }
      return _results;
    };

    AutoCompleteSearch.prototype.get_first_letter_list_for = function(exp) {
      if (exp.length !== 1) {
        return [];
      }
      return this.first_letter_list[exp.toLowerCase()];
    };

    AutoCompleteSearch.prototype.match = function(exp, str) {
      var patt;
      if (!(typeof exp === "string" && typeof str === "string")) {
        return false;
      }
      patt = exp.length === 1 ? new RegExp("^" + exp, "i") : new RegExp(exp, "i");
      return patt.test(str);
    };

    AutoCompleteSearch.prototype.check = function(exp) {
      var list, prev_exp, row, _fn, _i, _len,
        _this = this;
      if (!(typeof exp === "string" && exp !== "")) {
        return "";
      }
      if (exp.length === 1) {
        console.log("Using first letter hash");
        return this.html_for_list(this.get_first_letter_list_for(exp));
      }
      if (this.previous_matches[exp] != null) {
        console.log(("Found " + exp + ": ") + this.previous_matches[exp].length);
        return this.html_for_list(this.previous_matches[exp]);
      }
      prev_exp = this.shortest_list_for_expression(exp);
      list = null;
      if (prev_exp) {
        console.log("Using list: " + prev_exp);
        list = this.previous_matches[prev_exp];
      } else {
        console.log("Using full_list");
        list = this.full_list;
      }
      console.log(list.length);
      this.previous_matches[exp] = [];
      _fn = function() {
        if (_this.match(exp, row.str)) {
          return _this.previous_matches[exp].push(row);
        }
      };
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        row = list[_i];
        _fn();
      }
      console.log(this.previous_matches[exp].length);
      return this.html_for_list(this.previous_matches[exp]);
    };

    AutoCompleteSearch.prototype.shortest_list_for_expression = function(exp) {
      var fits, lw, p_exp, previous_exps, _fn, _i, _len,
        _this = this;
      fits = [];
      previous_exps = keys(this.previous_matches);
      _fn = function() {
        var patt;
        patt = RegExp(p_exp, "i");
        if (patt.test(exp)) {
          return fits.push(p_exp);
        }
      };
      for (_i = 0, _len = previous_exps.length; _i < _len; _i++) {
        p_exp = previous_exps[_i];
        _fn();
      }
      if (fits.length === 0) {

      } else {
        console.log(fits);
        lw = fits.longest_word();
        if (lw.length === 1) {
          return false;
        } else {
          return lw;
        }
      }
    };

    AutoCompleteSearch.prototype.html_for_item = function(item) {
      return this.template_for_list_item.replace(/list_item_id/g, item.id).replace(/list_item_str/g, item.str).replace(/list_item_pick_onclick_text/g, this.pick_onclick_text);
    };

    AutoCompleteSearch.prototype.html_for_list = function(list) {
      var item, r, _fn, _i, _len,
        _this = this;
      r = "";
      _fn = function() {
        return r = r + _this.html_for_item(item);
      };
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        item = list[_i];
        _fn();
      }
      return r;
    };

    return AutoCompleteSearch;

  })();

  window.AutoCompletePick = (function() {

    AutoCompletePick.prototype.picked_items_box = null;

    AutoCompletePick.prototype.template_for_picked_item = null;

    AutoCompletePick.prototype.on_delete = function() {};

    AutoCompletePick.prototype.on_pick = function() {};

    AutoCompletePick.prototype.picked_items = {};

    function AutoCompletePick(options) {
      if (options == null) {
        options = {};
      }
      this["delete"] = __bind(this["delete"], this);

      this.pick = __bind(this.pick, this);

      if (options.picked_items_box == null) {
        $.error("AutoCompletePick requires 'options.picked_items_box' for where picked items will be displayed. E.g. ac = new AutoCompletePick(picked_items_box: $('#invite .picked_items' ))");
      }
      this.picked_items_box = options.picked_items_box;
      if (options.template_for_picked_item == null) {
        $.error("AutoCompletePick requires a template_for_picked_item");
      }
      this.template_for_picked_item = options.template_for_picked_item;
      if (options.on_pick != null) {
        this.on_pick = options.on_pick;
      }
      if (options.on_delete != null) {
        this.on_delete = options.on_delete;
      }
    }

    AutoCompletePick.prototype.pick = function(element) {
      var added_element, picked_id, picked_str;
      picked_id = $(element).data("auto_complete_id");
      picked_str = $(element).data("auto_complete_str");
      if (this.picked_items[picked_id]) {
        this.on_pick();
        return;
      }
      this.picked_items[picked_id] = picked_str;
      this.picked_items_box.append(this.template_for_picked_item);
      added_element = this.picked_items_box.children().last();
      added_element.data($(element).data());
      added_element.find(".ui-btn-text").html(picked_str);
      console.log(this.picked_items);
      return this.on_pick();
    };

    AutoCompletePick.prototype["delete"] = function(element) {
      var deleted_id;
      deleted_id = $(element).data("auto_complete_id");
      delete this.picked_items[deleted_id];
      $(element).remove();
      return this.on_delete();
    };

    return AutoCompletePick;

  })();

  AutoCompleteDisplay = (function() {

    AutoCompleteDisplay.prototype.page_id = null;

    function AutoCompleteDisplay(options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      this.on_pick = __bind(this.on_pick, this);

      this.on_auto_complete = __bind(this.on_auto_complete, this);

      this.set_search_results_height = __bind(this.set_search_results_height, this);

      this.page_id = options.page_id;
      $("#" + this.page_id + " .auto_complete_search_results_box").hide();
      $("#" + this.page_id + " .picked_items_block").hide();
      $(window).bind("resize", function(event) {
        return _this.set_search_results_height();
      });
    }

    AutoCompleteDisplay.prototype.set_search_results_height = function() {
      var search_h, window_h;
      window_h = Math.floor($(window).height());
      search_h = Math.floor($("#" + this.page_id + " #search_block").height());
      return $("#" + this.page_id + " .auto_complete_search_results_box").css("height", "" + (window_h - search_h - 0) + "px");
    };

    AutoCompleteDisplay.prototype.on_auto_complete = function() {
      this.set_search_results_height();
      $("#" + this.page_id).addClass("search_started");
      $("#" + this.page_id + " .help").slideUp();
      $("#" + this.page_id + " .picked_items_block").hide();
      return $("#" + this.page_id + " .auto_complete_search_results_box").show();
    };

    AutoCompleteDisplay.prototype.on_pick = function() {
      $("#" + this.page_id + " .auto_complete_search_input_field").val("");
      $("#" + this.page_id + " .auto_complete_search_results_box").hide();
      $("#" + this.page_id + " .picked_items_block").show();
      return $("#" + this.page_id + " .auto_complete_search_input_field").attr("placeholder", "Type another name");
    };

    return AutoCompleteDisplay;

  })();

}).call(this);
(function() {

  $(document).ready(function() {});

}).call(this);
(function() {

  $(document).ready(function() {
    return $("#confirm_invite").live("pagebeforeshow", function(event) {
      $("#confirm_invite .invitees").html($.toSentence(invitees_first_names()));
      return $("#confirm_invite .current_occasion").html(current_occasion().name);
    });
  });

}).call(this);
(function() {

  $(document).ready(function() {
    return $("#confirm_invite_details").live("pagebeforeshow", function(event) {
      $("#confirm_invite_details .invitees").html($.toSentence(invitees_first_names()));
      return $("#confirm_invite_details .current_occasion").html(current_occasion().name);
    });
  });

}).call(this);
(function() {

  window.submit_name = function(form_data) {
    var cu, name;
    name = array_to_hash(trim_all_form_data(form_data));
    if (name.first_name === "") {
      alert("Please enter your first name");
      return;
    }
    if (name.last_name === "") {
      alert("Please enter your last name");
      return;
    }
    cu = current_user();
    cu.first_name = name.first_name;
    cu.last_name = name.last_name;
    set_current_user(cu);
    $.mobile.changePage("#confirm_known_user");
    return $.ajax({
      url: Config.base_url() + "/users/update",
      type: "POST",
      data: current_user()
    });
  };

  window.confirm_name = function() {
    register();
    return $.mobile.changePage("#confirm_occasion");
  };

  window.register = function() {
    return $.ajax({
      url: Config.base_url() + "/users/register",
      type: "POST",
      data: current_user(),
      success: function(response) {
        return set_registered(true);
      }
    });
  };

}).call(this);
(function() {

  window.submit_occasion_name = function(form_data) {
    var o_name;
    o_name = array_to_hash(trim_all_form_data(form_data));
    if (o_name.name === "") {
      alert("Please enter a name");
      return;
    }
    alert("fuck");
    clear_current_occasion();
    set_current_occasion({
      name: o_name.name
    });
    $.mobile.changePage("#estimate_population", {
      transition: "slide"
    });
    return $.ajax({
      url: Config.base_url() + "/occasions/create",
      type: "POST",
      data: current_occasion(),
      success: function(response) {
        return set_current_occasion(JSON.parse(response.responseText));
      }
    });
  };

}).call(this);
(function() {

  window.get_contacts = function(options) {
    if (options == null) {
      options = {};
    }
    console.log("in window.get_contacts");
    if (!contact_list() || options.fresh === true) {
      console.log("getting contacts from the server");
      return $.ajax({
        async: false,
        url: Config.base_url() + "/app/get_contacts",
        success: function(response) {
          set_contact_list(JSON.parse(response.responseText));
          return create_indexed_contact_list();
        }
      });
    }
  };

  window.create_indexed_contact_list = function() {
    var contact, i_c_l, _fn, _i, _len, _ref;
    i_c_l = {};
    if (contact_list() != null) {
      _ref = contact_list();
      _fn = function() {
        return i_c_l[contact["id"]] = contact;
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        contact = _ref[_i];
        _fn();
      }
    }
    return set_indexed_contact_list(i_c_l);
  };

}).call(this);
(function() {

  window.submit_pop_estimate = function(form_data) {
    var cu, pop_estimate;
    pop_estimate = form_data[0].value;
    if (/^\d+$/.test(pop_estimate)) {
      $.mobile.changePage("#invite", {
        transition: "slide"
      });
      cu = current_occasion();
      cu.pop_estimate = pop_estimate;
      set_current_occasion(cu);
      return $.ajax({
        url: Config.base_url() + "/occasions/pop_estimate",
        type: "POST",
        data: current_occasion()
      });
    } else {
      return alert("Please enter a number.");
    }
  };

}).call(this);
(function() {

  $(document).ready(function() {
    return $(document).bind("pagebeforeload", function(event) {
      return $(".display_app_state").html(display_app_state());
    });
  });

}).call(this);
(function() {
  var ThumbWidthCalculator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(document).bind("pagebeforechange", function(event, data) {
    var cache_full_dont_wait_for_response, occ_gal, occasion_id, uri;
    uri = new Uri(data.toPage);
    if (!(typeof data.toPage === "string" && uri.path() === "/gallery")) {
      return;
    }
    occasion_id = uri.getQueryParamValue("occasion_id");
    event.preventDefault();
    $.mobile.changePage("#gallery");
    cache_full_dont_wait_for_response = localStorage["gallery_" + occasion_id] != null;
    console.log("cache_full_dont_wait_for_response: " + cache_full_dont_wait_for_response);
    $.ajax({
      async: cache_full_dont_wait_for_response,
      url: Config.base_url() + "/occasions/gallery_json",
      data: {
        occasion_id: occasion_id
      },
      success: function(response) {
        var str;
        try {
          str = JSON.stringify(response);
        } catch (error) {
          localStorage.removeItem("gallery_" + occasion_id);
          return;
        }
        return localStorage["gallery_" + occasion_id] = str;
      }
    });
    occ_gal = JSON.parse(localStorage["gallery_" + occasion_id]);
    window.gh = new GalleryHandler(occ_gal.occasion, occ_gal.gallery);
    return gh.update_gallery_page();
  });

  $("#gallery").live("pagehide", function(event, data) {
    if (typeof gh !== "undefined" && gh !== null) {
      window.gh.dispose();
    }
    return window.gh = null;
  });

  window.GalleryHandler = (function() {

    GalleryHandler.FIRST_BATCH_SIZE = 20;

    GalleryHandler.BATCH_SIZE = 200;

    GalleryHandler.NEXT_BATCH_LOAD_THRESHOLD = 30;

    GalleryHandler.BATCH_LOAD_DELAY = 50;

    GalleryHandler.STATUS = null;

    GalleryHandler.STATUS = {};

    GalleryHandler.STATUS.NOT_SET_TO_LOAD = 0;

    GalleryHandler.STATUS.SET_TO_LOAD = 1;

    GalleryHandler.STATUS.LOADED = 2;

    GalleryHandler.Instances = {};

    GalleryHandler.Dispose = function(instance_id) {
      return GalleryHandler.Instances[instance_id] = void 0;
    };

    GalleryHandler.Dispose_all_instances = function() {
      return GalleryHandler.Instances = {};
    };

    function GalleryHandler(occasion, image_list, options) {
      var i, url, _fn, _i, _len, _ref,
        _this = this;
      if (options == null) {
        options = {};
      }
      this.dispose = __bind(this.dispose, this);

      this.set_img_size = __bind(this.set_img_size, this);

      this.unbind_img_size_handler = __bind(this.unbind_img_size_handler, this);

      this.bind_img_size_handler = __bind(this.bind_img_size_handler, this);

      this.display_batch = __bind(this.display_batch, this);

      this.display_gallery = __bind(this.display_gallery, this);

      this.update_header = __bind(this.update_header, this);

      this.update_gallery_page = __bind(this.update_gallery_page, this);

      this.loaded_percentage = __bind(this.loaded_percentage, this);

      this.next_batch_load_threshold_achieved = __bind(this.next_batch_load_threshold_achieved, this);

      this.on_img_click = __bind(this.on_img_click, this);

      this.on_img_load = __bind(this.on_img_load, this);

      this.insert_loaded_img = __bind(this.insert_loaded_img, this);

      this.load_img = __bind(this.load_img, this);

      this.load_batch = __bind(this.load_batch, this);

      this.num_set_to_load_or_loaded = __bind(this.num_set_to_load_or_loaded, this);

      this.image_list_not_set_to_load = __bind(this.image_list_not_set_to_load, this);

      this.next_batch_to_load = __bind(this.next_batch_to_load, this);

      this.create_photo_swipe_instance = __bind(this.create_photo_swipe_instance, this);

      if (occasion == null) {
        $.error("GalleryHander requires an occasion object");
      }
      this.occasion = occasion;
      if (image_list == null) {
        $.error("GalleryHandler requires image_list - a list of thumbnails to display in the gallery box element");
      }
      this.image_list = [];
      _ref = image_list.uniq();
      _fn = function() {
        return _this.image_list.push({
          i: i,
          url: url,
          status: GalleryHandler.STATUS.NOT_SET_TO_LOAD
        });
      };
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        url = _ref[i];
        _fn();
      }
      this.large_image_list = this.image_list.map(function(obj) {
        return obj.url.replace(/thumb/, "phone");
      });
      this.gallery_box = options.gallery_box != null ? options.gallery_box : $("#gallery .content");
      this.photo_swipe = this.create_photo_swipe_instance();
      this.FIRST_BATCH_SIZE = options.first_batch_size != null ? options.first_batch_size : GalleryHandler.FIRST_BATCH_SIZE;
      this.thumb_width = 75;
      this.num_images = this.image_list.length;
      this.num_loaded = 0;
      this.num_set_to_load = 0;
      this.num_left_to_load = this.num_images;
      this.next_batch_num = 0;
      this.delay = null;
      this.this_instance_id = "gh_" + (new Date().getTime());
      this.this_instance = this;
      GalleryHandler.Instances[this.this_instance_id] = this.this_instance;
    }

    GalleryHandler.prototype.create_photo_swipe_instance = function() {
      var options;
      options = {
        getImageSource: function(obj) {
          return obj;
        },
        getImageCaption: function(obj) {
          return "";
        },
        backButtonHideEnabled: false,
        preventSlideshow: true,
        doubleTapZoomLevel: 2,
        maxUserZoom: 2,
        minUserZoom: 1
      };
      return Code.PhotoSwipe.attach(this.large_image_list, options);
    };

    GalleryHandler.prototype.next_batch_to_load = function() {
      this.next_batch_num++;
      if (this.next_batch_num === 1) {
        return this.image_list_not_set_to_load().slice(0, (this.FIRST_BATCH_SIZE - 1) + 1 || 9e9);
      } else {
        return this.image_list_not_set_to_load().slice(0, (GalleryHandler.BATCH_SIZE - 1) + 1 || 9e9);
      }
    };

    GalleryHandler.prototype.image_list_not_set_to_load = function() {
      var ret_val,
        _this = this;
      ret_val = this.image_list.filter(function(img) {
        return img.status === GalleryHandler.STATUS.NOT_SET_TO_LOAD;
      });
      return ret_val;
    };

    GalleryHandler.prototype.num_set_to_load_or_loaded = function() {
      return this.num_set_to_load + this.num_loaded;
    };

    GalleryHandler.prototype.load_batch = function(batch) {
      var img, _i, _len, _results,
        _this = this;
      console.log("loading: " + batch.length);
      _results = [];
      for (_i = 0, _len = batch.length; _i < _len; _i++) {
        img = batch[_i];
        _results.push((function() {
          return _this.load_img(img);
        })());
      }
      return _results;
    };

    GalleryHandler.prototype.load_img = function(img) {
      this.insert_loaded_img(img);
      this.image_list[img.i].status = GalleryHandler.STATUS.SET_TO_LOAD;
      this.num_set_to_load++;
      return this.num_left_to_load--;
    };

    GalleryHandler.prototype.insert_loaded_img = function(img) {
      var img_tag;
      img_tag = $("<img src='" + img.url + "' data-index=" + img.i + " style='display:none; width:" + this.thumb_width + "px'/>");
      img_tag.bind("load", this.on_img_load);
      img_tag.bind("click", this.on_img_click);
      return this.gallery_box.append(img_tag);
    };

    GalleryHandler.prototype.on_img_load = function(event) {
      $(event.target).css("display", "inline");
      this.image_list[$(event.target).data("index")].status = GalleryHandler.STATUS.LOADED;
      this.num_loaded++;
      this.num_set_to_load--;
      if (this.num_loaded === 30 || this.num_set_to_load === 0) {
        return this.set_img_size();
      }
    };

    GalleryHandler.prototype.on_img_click = function(event) {
      var index;
      index = $(event.target).data("index");
      return this.photo_swipe.show(index);
    };

    GalleryHandler.prototype.next_batch_load_threshold_achieved = function() {
      if (this.next_batch_num === 1) {
        return true;
      } else if (this.num_set_to_load < (GalleryHandler.NEXT_BATCH_LOAD_THRESHOLD * this.next_batch_num)) {
        return true;
      } else {
        return false;
      }
    };

    GalleryHandler.prototype.loaded_percentage = function() {
      return (1.0 * this.num_loaded) / (this.num_set_to_load + this.num_loaded);
    };

    GalleryHandler.prototype.update_gallery_page = function() {
      this.bind_img_size_handler();
      this.update_header();
      return this.display_gallery();
    };

    GalleryHandler.prototype.update_header = function() {
      $("#gallery .occasion_name").html(this.occasion.name);
      $("#gallery .occasion_city").html(this.occasion.city);
      return $("#gallery .occasion_date").html(lp_date_format(this.occasion.start_time));
    };

    GalleryHandler.prototype.display_gallery = function() {
      this.load_batch(this.next_batch_to_load());
      return this.delay = window.setInterval(this.display_batch, GalleryHandler.BATCH_LOAD_DELAY);
    };

    GalleryHandler.prototype.display_batch = function() {
      if (this.num_left_to_load > 0) {
        console.log("loaded_percentage: " + this.loaded_percentage());
        if (this.next_batch_load_threshold_achieved()) {
          console.log("achieved");
        }
        if (this.next_batch_load_threshold_achieved()) {
          return this.load_batch(this.next_batch_to_load());
        }
      } else {
        return clearInterval(this.delay);
      }
    };

    GalleryHandler.prototype.bind_img_size_handler = function() {
      return $(window).bind("resize", this.set_img_size);
    };

    GalleryHandler.prototype.unbind_img_size_handler = function() {
      return $(window).unbind("resize", this.set_img_size);
    };

    GalleryHandler.prototype.set_img_size = function() {
      this.thumb_width = new ThumbWidthCalculator($(window).innerWidth()).thumb_width();
      return this.gallery_box.find("img").css("width", "" + this.thumb_width + "px");
    };

    GalleryHandler.prototype.dispose = function() {
      this.unbind_img_size_handler();
      this.num_left_to_load = 0;
      clearInterval(this.delay);
      this.gallery_box.html("");
      this.photo_swipe.dispose();
      return GalleryHandler.Dispose(this.this_instance_id);
    };

    return GalleryHandler;

  }).call(this);

  ThumbWidthCalculator = (function() {

    function ThumbWidthCalculator(window_width, max_img_width, min_img_width, margin, border, min_cols) {
      this.window_width = window_width;
      this.max_img_width = max_img_width != null ? max_img_width : 75;
      this.min_img_width = min_img_width != null ? min_img_width : 65;
      this.margin = margin != null ? margin : 3;
      this.border = border != null ? border : 1;
      this.min_cols = min_cols != null ? min_cols : 4;
      this.shrink_to_fit = __bind(this.shrink_to_fit, this);

      this.thumb_width = __bind(this.thumb_width, this);

      this.img_outer_width = __bind(this.img_outer_width, this);

      this.window_width = this.window_width;
      this.img_padding = 2 * (this.margin + this.border);
      this.img_inner_width = 0;
      this.max_img_outer_width = this.max_img_width + this.img_padding;
    }

    ThumbWidthCalculator.prototype.img_outer_width = function(img_inner_width) {
      return img_inner_width + this.img_padding;
    };

    ThumbWidthCalculator.prototype.thumb_width = function() {
      if ((this.window_width / this.min_cols) < this.max_img_outer_width) {
        this.img_inner_width = (this.window_width / this.min_cols) - this.img_padding - 3;
      } else {
        this.img_inner_width = this.shrink_to_fit();
      }
      return this.img_inner_width;
    };

    ThumbWidthCalculator.prototype.shrink_to_fit = function() {
      var best_fit_img_width, best_left_over, left_over, try_img_width;
      try_img_width = this.max_img_width;
      best_left_over = this.max_img_width;
      best_fit_img_width = this.max_img_width;
      while (try_img_width >= this.min_img_width) {
        left_over = this.window_width % this.img_outer_width(try_img_width);
        if (left_over < best_left_over) {
          best_left_over = left_over;
          best_fit_img_width = try_img_width;
        }
        try_img_width--;
      }
      return best_fit_img_width;
    };

    return ThumbWidthCalculator;

  })();

}).call(this);
(function() {

  $(document).ready(function() {
    return $("#invite").bind("pageshow", function(event) {
      window.ac = new AutoComplete({
        name_of_self: "ac",
        page_id: "invite"
      });
      return $("#invite .current_occasion").html(current_occasion().name);
    });
  });

  window.invite_done = function() {
    console.log("picked keys = " + keys(ac.picked_items()));
    set_invitees(keys(ac.picked_items()));
    console.log(find_contacts_by_id(invitees()));
    $.ajax({
      url: Config.base_url() + "/invite",
      type: "POST",
      data: {
        device: Config.device,
        invitees: JSON.stringify(find_contacts_by_id(invitees()))
      }
    });
    return $.mobile.changePage("#confirm_invite", {
      transition: "slide"
    });
  };

}).call(this);
(function() {

  window.appState = (function() {

    function appState() {}

    appState.set = function(key, obj) {
      try {
        return localStorage[key] = JSON.stringify(obj);
      } catch (error) {
        return console.log("Could not set appState for " + key + " because of " + error);
      }
    };

    appState.get = function(key) {
      var result;
      result = false;
      try {
        result = localStorage[key] != null ? JSON.parse(localStorage[key]) : false;
      } catch (error) {
        console.log(error);
      }
      return result;
    };

    appState.clear = function(key) {
      return localStorage.removeItem(key);
    };

    appState.clear_all = function() {
      return localStorage.clear();
    };

    return appState;

  })();

  this.current_user = function() {
    return appState.get("current_user");
  };

  this.set_current_user = function(obj) {
    return appState.set("current_user", obj);
  };

  this.clear_current_user = function() {
    return appState.clear("current_user");
  };

  this.current_user_id = function() {
    return current_user() && current_user().id;
  };

  window.current_user_fullname = function() {
    return "" + (current_user().first_name ? current_user().first_name : void 0) + " " + (current_user().last_name ? current_user().last_name : void 0);
  };

  this.registered = function() {
    return appState.get("registered");
  };

  this.set_registered = function(obj) {
    return appState.set("registered", obj);
  };

  this.clear_registered = function() {
    return appState.clear("registered");
  };

  this.current_occasion = function() {
    return appState.get("current_occasion");
  };

  this.set_current_occasion = function(obj) {
    return appState.set("current_occasion", obj);
  };

  this.clear_current_occasion = function() {
    return appState.clear("current_occasion");
  };

  this.current_occasion_name = function() {
    return current_occasion().name;
  };

  this.find_contacts_by_id = function(ids) {
    return ids.map(function(id) {
      return indexed_contact_list()[id];
    });
  };

  this.contact_list = function() {
    return appState.get("contact_list");
  };

  this.set_contact_list = function(obj) {
    return appState.set("contact_list", obj);
  };

  this.clear_contact_list = function() {
    return appState.clear("contact_list");
  };

  this.indexed_contact_list = function() {
    return appState.get("indexed_contact_list");
  };

  this.set_indexed_contact_list = function(obj) {
    return appState.set("indexed_contact_list", obj);
  };

  this.clear_indexed_contact_list = function() {
    return appState.clear("indexed_contact_list");
  };

  this.invitees = function() {
    return appState.get("invitees");
  };

  this.set_invitees = function(obj) {
    return appState.set("invitees", obj);
  };

  this.clear_invitees = function() {
    return appState.clear("invitees");
  };

  this.invitees_contact = function() {
    return find_contacts_by_id(invitees());
  };

  this.invitees_first_names = function() {
    return invitees_contact().map(function(contact) {
      return contact.first_name;
    });
  };

  this.invitees_full_names = function() {
    return invitees_contact().map(function(contact) {
      return contact.fullname;
    });
  };

  window.display_app_state = function() {
    return "Current_user: " + (current_user_id()) + " | Registered: " + (registered());
  };

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $("#occasions").live("pageshow", function(event) {
    return $.ajax({
      url: Config.base_url() + "/occasions/occasions_json",
      success: function(response) {
        return new OccasionsHandler(response).update_occasions_list();
      }
    });
  });

  window.OccasionsHandler = (function() {

    OccasionsHandler.LIST_ITEM_HTML = "<li>                     <a href='#'>                       <img/>                       <h1 class='occasion_name'/>                       <p>                         <span class='occasion_city de-emphasize1'/> &nbsp;                          <span class='occasion_date de-emphasize2'/>                        </p>                     </a>                   </li>";

    OccasionsHandler.LIST_HTML = "<ul id='occasions_list' data-role='listview' class='npb-list'></ul>";

    function OccasionsHandler(occasions, options) {
      this.occasions = occasions;
      if (options == null) {
        options = {};
      }
      this.insert_occasion_in_list = __bind(this.insert_occasion_in_list, this);

      this.update_occasions_list = __bind(this.update_occasions_list, this);

      if (this.occasions == null) {
        $.error("OccasionsHandler: requres an occasions object'");
      }
      this.page = options.page != null ? options.page : $("#occasions");
      this.content = this.page.children(":jqmData(role=content)");
      this.list = $(OccasionsHandler.LIST_HTML);
    }

    OccasionsHandler.prototype.update_occasions_list = function() {
      var occasion, _fn, _i, _len, _ref,
        _this = this;
      _ref = this.occasions;
      _fn = function() {
        return _this.insert_occasion_in_list(occasion);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        occasion = _ref[_i];
        _fn();
      }
      this.content.html(this.list);
      this.page.page();
      return $("#occasions_list").listview();
    };

    OccasionsHandler.prototype.insert_occasion_in_list = function(occasion) {
      var el;
      el = $(OccasionsHandler.LIST_ITEM_HTML);
      el.find("a").attr("href", "/gallery?occasion_id=" + occasion.id);
      el.find("img").attr("src", occasion.thumbnail);
      el.find(".occasion_name").html(occasion.name);
      el.find(".occasion_city").html(occasion.city);
      el.find(".occasion_date").html(lp_date_format(occasion.start_time));
      return this.list.append(el);
    };

    return OccasionsHandler;

  })();

}).call(this);
(function() {

  window.handle_registration = function(opt) {
    console.log("handle_registration with " + JSON.stringify(opt));
    if (opt.fresh) {
      console.log("Clearing all app state");
      appState.clear_all();
    }
    if (registered()) {
      console.log("Already registered: Enter the app");
      return enter_the_app();
    } else if (current_user()) {
      console.log("Had a current_user with a confirmed name. : Enter the app");
      return $.mobile.changePage("#welcome", {
        transition: "fade"
      });
    } else if (opt.context_id) {
      if (opt.context_id === "unknown") {
        console.log("No existing context so get user information from him");
        return enter_the_app();
      } else {
        console.log("Based upon existing context " + opt.context_id + " - getting info back from server");
        return $.ajax({
          url: Config.base_url() + "/get_context/" + opt.context_id,
          dataType: "json",
          async: false,
          beforeSend: function(x) {
            if (x && x.overrideMimeType) {
              return x.overrideMimeType("application/j-son;charset=UTF-8");
            }
          },
          success: function(context) {
            console.log("Saving current user to " + JSON.stringify(context.user) + " and current occasion to " + JSON.stringify(context.occasion));
            set_current_user(context.user);
            set_current_occasion(context.occasion);
            return enter_the_app();
          },
          error: function(jqXHR, textStatus, errorThrown) {
            return alert("Error getting user info with status " + textStatus + " and errorThrown " + errorThrown);
          }
        });
      }
    } else if (opt.user_id) {
      console.log("Known user " + opt.user_id + " - getting info back from server");
      return $.ajax({
        url: Config.base_url() + "/users/show/" + opt.user_id,
        dataType: "json",
        async: false,
        beforeSend: function(x) {
          if (x && x.overrideMimeType) {
            return x.overrideMimeType("application/j-son;charset=UTF-8");
          }
        },
        success: function(user) {
          console.log("Saving current user to " + JSON.stringify(user));
          set_current_user(user);
          return enter_the_app();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return alert("Error getting user info with status " + textStatus + " and errorThrown " + errorThrown);
        }
      });
    } else if (opt.user) {
      if (registered()) {
        console.log("Known registered user: Enter the app");
        return enter_the_app();
      } else {
        console.log("Known Unregistered user: Confirm his details");
        set_current_user(opt.user);
        return $.mobile.changePage("#welcome", {
          transition: "fade"
        });
      }
    } else {
      console.log("Not registered and no user info. Redirect to check cookies @ " + Config.base_url() + "/app/check_cookies");
      return window.setTimeout(function() {
        return window.location = Config.base_url() + "/app/check_cookies?" + Config.check_cookies_query_string();
      }, 2000);
    }
  };

  window.enter_the_app = function() {
    if (registered()) {
      console.log("Known registered user: Enter the app");
      return $.mobile.changePage("#app_running", {
        transition: "fade"
      });
    } else {
      return $.mobile.changePage("#welcome", {
        transition: "fade"
      });
    }
  };

}).call(this);
(function() {

  $(document).ready(function() {
    return $("#tag_pic").bind("pageshow", function(event) {
      return window.ac = new AutoComplete({
        name_of_self: "ac",
        page_id: "tag_pic",
        theme: "a"
      });
    });
  });

  window.tag_done = function() {
    console.log("Tagged");
    console.log(find_contacts_by_id(keys(ac.picked_items())));
    $.ajax({
      url: Config.base_url() + "/social_actions/tag",
      type: "POST",
      data: {
        tags: JSON.stringify(find_contacts_by_id(keys(ac.picked_items())))
      }
    });
    return $.mobile.changePage("#app_running", {
      transition: "slide"
    });
  };

}).call(this);
(function() {

  $(document).ready(function() {
    return $("#what_next").live("pagebeforeshow", function(event) {
      return $("#what_next .current_occasion").html(current_occasion().name);
    });
  });

}).call(this);
(function() {

  this.Config = {
    is_running_on_device: function() {
      return typeof app !== "undefined" && app !== null;
    },
    get_contacts: function() {
      if (typeof app !== "undefined" && app !== null) {
        return app.getContacts;
      } else {
        return get_contacts;
      }
    },
    base_url: function() {
      if (typeof app !== "undefined" && app !== null) {
        return app.base_url;
      } else {
        return "";
      }
    },
    cookie_redirect_base_url: function(using_app) {
      if (using_app != null) {
        return "snapshot://";
      } else {
        return "/";
      }
    },
    check_cookies_query_string: function() {
      if (typeof app !== "undefined" && app !== null) {
        return "app=true";
      } else {
        return "";
      }
    },
    init_app: function() {
      if (typeof app !== "undefined" && app !== null) {
        return app.initialize();
      } else {
        return init_app();
      }
    },
    device: function() {
      return typeof app === "function" ? app({
        "iphone": ''
      }) : void 0;
    }
  };

}).call(this);
(function() {

  window.functions_of_object = function(obj) {
    var candidate, id, test;
    return test = (function() {
      var _results;
      _results = [];
      for (id in obj) {
        candidate = obj[id];
        try {
          if (typeof candidate === "function") {
            _results.push("" + id);
          } else {
            _results.push(void 0);
          }
        } catch (error) {
          _results.push(console.log(error));
        }
      }
      return _results;
    })();
  };

  window.array_to_hash = function(arr) {
    var hsh, result, _fn, _i, _len;
    result = {};
    _fn = function() {
      return result[hsh.name] = hsh.value;
    };
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      hsh = arr[_i];
      _fn();
    }
    return result;
  };

  window.hash_to_array = function(hash) {
    var key, result, _fn, _i, _len, _ref;
    result = [];
    _ref = keys(hash);
    _fn = function() {
      return result.push([key, hash[key.toString()]]);
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _fn();
    }
    return result;
  };

  window.trim_all_form_data = function(fd) {
    return $.map(fd, function(hsh) {
      return {
        name: hsh.name,
        value: $.trim(hsh.value)
      };
    });
  };

  window.cln_str = function(obj) {
    if (obj != null) {
      return "" + obj;
    } else {
      return "";
    }
  };

  window.keys = function(hsh) {
    var result;
    result = [];
    $.each(hsh, function(key) {
      return result.push(key.toString());
    });
    return result;
  };

  window.lp_date_format = function(date) {
    return Date.parse(date).toString("MMM d yyyy");
  };

  Array.prototype.max = function() {
    return Math.max.apply(Math, this);
  };

  Array.prototype.min = function() {
    return Math.min.apply(Math, this);
  };

  Array.prototype.longest_word = function() {
    return this.sort(function(a, b) {
      return b.length - a.length;
    })[0];
  };

  Array.prototype.shortest_word = function() {
    return this.sort(function(a, b) {
      return a.length - b.length;
    })[0];
  };

  Array.prototype.uniq = function() {
    var el, h, _fn, _i, _len;
    h = {};
    _fn = function() {
      return h[el] = true;
    };
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      el = this[_i];
      _fn();
    }
    return keys(h);
  };

}).call(this);
(function() {

  $(document).ready(function(event) {
    return initialize_view();
  });

  window.initialize_view = function() {
    $(".window_height").css("height", "" + ($(window).height()) + "px");
    return $(".quarter_window_height").css("height", "" + (Math.floor($(window).height() / 4)) + "px");
  };

}).call(this);
(function(window, Util) {
	
	Util.Browser = {
	
		ua: null,
		version: null,
		safari: null,
		webkit: null,
		opera: null,
		msie: null,
		chrome: null,
		mozilla: null,
		
		android: null,
		blackberry: null,
		iPad: null,
		iPhone: null,
		iPod: null,
		iOS: null,
		
		is3dSupported: null,
		isCSSTransformSupported: null,
		isTouchSupported: null,
		isGestureSupported: null,
		
		
		_detect: function(){
			
			this.ua = window.navigator.userAgent;
			this.version = (this.ua.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || []);
			this.safari = (/Safari/gi).test(window.navigator.appVersion);
			this.webkit = /webkit/i.test(this.ua);
			this.opera = /opera/i.test(this.ua);
			this.msie = /msie/i.test(this.ua) && !this.opera;
			this.chrome = /Chrome/i.test(this.ua);
			this.firefox = /Firefox/i.test(this.ua);
			this.fennec = /Fennec/i.test(this.ua);
			this.mozilla = /mozilla/i.test(this.ua) && !/(compatible|webkit)/.test(this.ua);
			this.android = /android/i.test(this.ua);
			this.blackberry = /blackberry/i.test(this.ua);
			this.iOS = (/iphone|ipod|ipad/gi).test(window.navigator.platform);
			this.iPad = (/ipad/gi).test(window.navigator.platform);
			this.iPhone = (/iphone/gi).test(window.navigator.platform);
			this.iPod = (/ipod/gi).test(window.navigator.platform);
			
			var testEl = document.createElement('div');
			
      // The following 2 lines were added by Sani and the 3rd line  commented out. See http://mobilehtml5.stungeye.com/
      // This is to get around bugs with android 3d animation.
      var isAndroidICS = /4.0.[1-2]/.test(this.ua) && this.android; 
      this.is3dSupported = !Util.isNothing(testEl.style.WebkitPerspective) && !isAndroidICS; 
      // this.is3dSupported = !Util.isNothing(testEl.style.WebkitPerspective);  
		
			this.isCSSTransformSupported = ( !Util.isNothing(testEl.style.WebkitTransform) || !Util.isNothing(testEl.style.MozTransform) || !Util.isNothing(testEl.style.transformProperty) );
			this.isTouchSupported = this.isEventSupported('touchstart');
			this.isGestureSupported = this.isEventSupported('gesturestart');
			
		},
		
			
		_eventTagNames: {
			'select':'input',
			'change':'input',
			'submit':'form',
			'reset':'form',
			'error':'img',
			'load':'img',
			'abort':'img'
		},
				
				
		/*
		 * Function: isEventSupported
		 * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		 */
		isEventSupported: function(eventName) {
			var 
				el = document.createElement(this._eventTagNames[eventName] || 'div'),
				isSupported;
			eventName = 'on' + eventName;
			isSupported = Util.objectHasProperty(el, eventName);
			if (!isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] === 'function';
			}
			el = null;
			return isSupported;
		},
		
		
		isLandscape: function(){
			return (Util.DOM.windowWidth() > Util.DOM.windowHeight());
		}
  };
	
	Util.Browser._detect();
	
}
(
	window,
	window.Code.Util
))
;
// This is the manifest for the packaged app.s





;
