(function () {
    // Copyright (c) 2013 Sune Simonsen <sune@we-knowhow.dk>
    //
    // Permission is hereby granted, free of charge, to any person
    // obtaining a copy of this software and associated documentation
    // files (the 'Software'), to deal in the Software without
    // restriction, including without limitation the rights to use, copy,
    // modify, merge, publish, distribute, sublicense, and/or sell copies
    // of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be
    // included in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    // BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    // SOFTWARE.
    /*exported namespace*/
    var namespace = {};
    /*global namespace*/
    (function () {
        namespace.shim = {
            every: function (arr, fn, thisObj) {
                var scope = thisObj || null;
                for (var i = 0, j = arr.length; i < j; i += 1) {
                    if (!fn.call(scope, arr[i], i, arr)) {
                        return false;
                    }
                }
                return true;
            },
    
            some: function (arr, fn, thisObj) {
                var scope = thisObj || null;
                for (var i = 0, j = arr.length; i < j; i += 1) {
                    if (fn.call(scope, arr[i], i, arr)) {
                        return true;
                    }
                }
                return false;
            },
    
            indexOf: function (arr, searchElement, fromIndex) {
                var length = arr.length >>> 0; // Hack to convert object.length to a UInt32
    
                fromIndex = +fromIndex || 0;
    
                if (Math.abs(fromIndex) === Infinity) {
                    fromIndex = 0;
                }
    
                if (fromIndex < 0) {
                    fromIndex += length;
                    if (fromIndex < 0) {
                        fromIndex = 0;
                    }
                }
    
                for (;fromIndex < length; fromIndex += 1) {
                    if (arr[fromIndex] === searchElement) {
                        return fromIndex;
                    }
                }
    
                return -1;
            },
    
            getKeys: function (obj) {
                var result = [];
    
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        result.push(i);
                    }
                }
    
                return result;
            },
    
            forEach: function (arr, callback, that) {
                for (var i = 0, n = arr.length; i < n; i += 1)
                    if (i in arr)
                        callback.call(that, arr[i], i, arr);
            },
    
            map: function (arr, mapper, that) {
                var other = new Array(arr.length);
    
                for (var i = 0, n = arr.length; i < n; i += 1)
                    if (i in arr)
                        other[i] = mapper.call(that, arr[i], i, arr);
    
                return other;
            },
    
            filter: function (arr, predicate) {
                var length = +arr.length;
    
                var result = [];
    
                if (typeof predicate !== "function")
                    throw new TypeError();
    
                for (var i = 0; i < length; i += 1) {
                    var value = arr[i];
                    if (predicate(value)) {
                        result.push(value);
                    }
                }
    
                return result;
            },
    
            trim: function (text) {
                return text.replace(/^\s+|\s+$/g, '');
            },
    
            reduce: function (arr, fun) {
                var len = +arr.length;
    
                if (typeof fun !== "function")
                    throw new TypeError();
    
                // no value to return if no initial value and an empty array
                if (len === 0 && arguments.length === 1)
                    throw new TypeError();
    
                var i = 0;
                var rv;
                if (arguments.length >= 2) {
                    rv = arguments[2];
                } else {
                    do {
                        if (i in arr) {
                            rv = arr[i];
                            i += 1;
                            break;
                        }
    
                        // if array contains no values, no initial value to return
                        i += 1;
                        if (i >= len)
                            throw new TypeError();
                    } while (true);
                }
    
                for (; i < len; i += 1) {
                    if (i in arr)
                        rv = fun.call(null, rv, arr[i], i, this);
                }
    
                return rv;
            },
    
            JSON: (function () {
                "use strict";
    
                var jsonShim = {};
    
                function f(n) {
                    // Format integers to have at least two digits.
                    return n < 10 ? '0' + n : n;
                }
    
                function date(d, key) {
                    return isFinite(d.valueOf()) ?
                        d.getUTCFullYear()     + '-' +
                        f(d.getUTCMonth() + 1) + '-' +
                        f(d.getUTCDate())      + 'T' +
                        f(d.getUTCHours())     + ':' +
                        f(d.getUTCMinutes())   + ':' +
                        f(d.getUTCSeconds())   + 'Z' : null;
                }
    
                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    gap,
                    indent,
                    meta = {    // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"' : '\\"',
                        '\\': '\\\\'
                    },
                    rep;
    
    
                function quote(string) {
    
                    // If the string contains no control characters, no quote characters, and no
                    // backslash characters, then we can safely slap some quotes around it.
                    // Otherwise we must also replace the offending characters with safe escape
                    // sequences.
    
                    escapable.lastIndex = 0;
                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                        var c = meta[a];
                        return typeof c === 'string' ? c :
                            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' : '"' + string + '"';
                }
    
    
                function str(key, holder) {
    
                    // Produce a string from holder[key].
    
                    var i,          // The loop counter.
                        k,          // The member key.
                        v,          // The member value.
                        length,
                        mind = gap,
                        partial,
                        value = holder[key];
    
                    // If the value has a toJSON method, call it to obtain a replacement value.
    
                    if (value instanceof Date) {
                        value = date(key);
                    }
    
                    // If we were called with a replacer function, then call the replacer to
                    // obtain a replacement value.
    
                    if (typeof rep === 'function') {
                        value = rep.call(holder, key, value);
                    }
    
                    // What happens next depends on the value's type.
    
                    switch (typeof value) {
                    case 'string':
                        return quote(value);
    
                    case 'number':
    
                        // JSON numbers must be finite. Encode non-finite numbers as null.
    
                        return isFinite(value) ? String(value) : 'null';
    
                    case 'boolean':
                    case 'null':
    
                        // If the value is a boolean or null, convert it to a string. Note:
                        // typeof null does not produce 'null'. The case is included here in
                        // the remote chance that this gets fixed someday.
    
                        return String(value);
    
                        // If the type is 'object', we might be dealing with an object or an array or
                        // null.
    
                    case 'object':
    
                        // Due to a specification blunder in ECMAScript, typeof null is 'object',
                        // so watch out for that case.
    
                        if (!value) {
                            return 'null';
                        }
    
                        // Make an array to hold the partial results of stringifying this object value.
    
                        gap += indent;
                        partial = [];
    
                        // Is the value an array?
    
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
    
                            // The value is an array. Stringify every element. Use null as a placeholder
                            // for non-JSON values.
    
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }
    
                            // Join all of the elements together, separated with commas, and wrap them in
                            // brackets.
    
                            v = partial.length === 0 ? '[]' : gap ?
                                '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                                '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }
    
                        // If the replacer is an array, use it to select the members to be stringified.
    
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {
    
                            // Otherwise, iterate through all of the keys in the object.
    
                            for (k in value) {
                                if (value.hasOwnProperty(k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }
    
                        // Join all of the member texts together, separated with commas,
                        // and wrap them in braces.
    
                        v = partial.length === 0 ? '{}' : gap ?
                            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                            '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                    }
                }
    
                // If the JSON object does not yet have a stringify method, give it one.
    
                jsonShim.stringify = function (value, replacer, space) {
    
                    // The stringify method takes a value and an optional replacer, and an optional
                    // space parameter, and returns a JSON text. The replacer can be a function
                    // that can replace values, or an array of strings that will select the keys.
                    // A default replacer method can be provided. Use of the space parameter can
                    // produce text that is more easily readable.
    
                    var i;
                    gap = '';
                    indent = '';
    
                    // If the space parameter is a number, make an indent string containing that
                    // many spaces.
    
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
    
                        // If the space parameter is a string, it will be used as the indent string.
    
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
    
                    // If there is a replacer, it must be a function or an array.
                    // Otherwise, throw an error.
    
                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                         typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }
    
                    // Make a fake root object containing our value under the key of ''.
                    // Return the result of stringifying the value.
    
                    return str('', {'': value});
                };
    
                // If the JSON object does not yet have a parse method, give it one.
    
                jsonShim.parse = function (text, reviver) {
                    // jshint evil:true
                    // The parse method takes a text and an optional reviver function, and returns
                    // a JavaScript value if the text is a valid JSON text.
    
                    var j;
    
                    function walk(holder, key) {
    
                        // The walk method is used to recursively walk the resulting structure so
                        // that modifications can be made.
    
                        var k, v, value = holder[key];
                        if (value && typeof value === 'object') {
                            for (k in value) {
                                if (value.hasOwnProperty(k)) {
                                    v = walk(value, k);
                                    if (v !== undefined) {
                                        value[k] = v;
                                    } else {
                                        delete value[k];
                                    }
                                }
                            }
                        }
                        return reviver.call(holder, key, value);
                    }
    
    
                    // Parsing happens in four stages. In the first stage, we replace certain
                    // Unicode characters with escape sequences. JavaScript handles many characters
                    // incorrectly, either silently deleting them, or treating them as line endings.
    
                    text = String(text);
                    cx.lastIndex = 0;
                    if (cx.test(text)) {
                        text = text.replace(cx, function (a) {
                            return '\\u' +
                                ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                        });
                    }
    
                    // In the second stage, we run the text against regular expressions that look
                    // for non-JSON patterns. We are especially concerned with '()' and 'new'
                    // because they can cause invocation, and '=' because it can cause mutation.
                    // But just to be safe, we want to reject all unexpected forms.
    
                    // We split the second stage into 4 regexp operations in order to work around
                    // crippling inefficiencies in IE's and Safari's regexp engines. First we
                    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
                    // replace all simple value tokens with ']' characters. Third, we delete all
                    // open brackets that follow a colon or comma or that begin the text. Finally,
                    // we look to see that the remaining characters are only whitespace or ']' or
                    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    
                    if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                              .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                              .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    
                        // In the third stage we use the eval function to compile the text into a
                        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                        // in JavaScript: it can begin a block or an object literal. We wrap the text
                        // in parens to eliminate the ambiguity.
    
                        j = eval('(' + text + ')');
    
                        // In the optional fourth stage, we recursively walk the new structure, passing
                        // each name/value pair to a reviver function for possible transformation.
    
                        return typeof reviver === 'function' ?
                            walk({'': j}, '') : j;
                    }
    
                    // If the text is not JSON parseable, then a SyntaxError is thrown.
    
                    throw new SyntaxError('JSON.parse');
                };
    
                return jsonShim;
            })()
        };
    }());
    /*global namespace*/
    (function () {
        namespace.shim = namespace.shim || {};
        var shim = namespace.shim;
    
        var prototypes = {
            bind: Function.prototype.bind,
            every: Array.prototype.every,
            some: Array.prototype.some,
            indexOf: Array.prototype.indexOf,
            forEach: Array.prototype.forEach,
            map: Array.prototype.map,
            filter: Array.prototype.filter,
            reduce: Array.prototype.reduce,
            trim: String.prototype.trim
        };
    
        function createShimMethod(key) {
            shim[key] = function (obj) {
                var args = Array.prototype.slice.call(arguments, 1);
                return prototypes[key].apply(obj, args);
            };
        }
    
        for (var key in prototypes) {
            if (prototypes.hasOwnProperty(key) && prototypes[key]) {
                createShimMethod(key);
            }
        }
    
        if (!shim.bind) {
            shim.bind = function (fn, scope) {
                return function () {
                    return fn.apply(scope, arguments);
                };
            };
        }
    
        if (Object.keys) {
            shim['getKeys'] = Object.keys;
        }
    
        if ('object' === typeof JSON && JSON.parse && JSON.stringify) {
            shim['JSON'] = JSON;
        }
    }());
    /*global namespace*/
    (function () {
        var shim = namespace.shim;
        var forEach = shim.forEach;
        var filter = shim.filter;
        var getKeys = shim.getKeys;
    
        var utils = {
            // https://gist.github.com/1044128/
            getOuterHTML: function (element) {
                // jshint browser:true
                if ('outerHTML' in element) return element.outerHTML;
                var ns = "http://www.w3.org/1999/xhtml";
                var container = document.createElementNS(ns, '_');
                var xmlSerializer = new XMLSerializer();
                var html;
                if (document.xmlVersion) {
                    return xmlSerializer.serializeToString(element);
                } else {
                    container.appendChild(element.cloneNode(false));
                    html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
                    container.innerHTML = '';
                    return html;
                }
            },
    
            // Returns true if object is a DOM element.
            isDOMElement: function (object) {
                if (typeof HTMLElement === 'object') {
                    return object instanceof HTMLElement;
                } else {
                    return object &&
                        typeof object === 'object' &&
                        object.nodeType === 1 &&
                        typeof object.nodeName === 'string';
                }
            },
    
            isArray: function (ar) {
                return Object.prototype.toString.call(ar) === '[object Array]';
            },
    
            isRegExp: function (re) {
                var s;
                try {
                    s = '' + re;
                } catch (e) {
                    return false;
                }
    
                return re instanceof RegExp || // easy case
                // duck-type for context-switching evalcx case
                typeof(re) === 'function' &&
                    re.constructor.name === 'RegExp' &&
                    re.compile &&
                    re.test &&
                    re.exec &&
                    s.match(/^\/.*\/[gim]{0,3}$/);
            },
    
            isError: function (err) {
                return typeof err === 'object' && Object.prototype.toString.call(err) === '[object Error]';
            },
    
            extend: function (target) {
                var sources = Array.prototype.slice.call(arguments, 1);
                forEach(sources, function (source) {
                    forEach(getKeys(source), function (key) {
                        target[key] = source[key];
                    });
                });
                return target;
            },
    
            isUndefinedOrNull: function (value) {
                return value === null || value === undefined;
            },
    
            isArguments: function (object) {
                return Object.prototype.toString.call(object) === '[object Arguments]';
            },
    
            getKeysOfDefinedProperties: function (object) {
                return filter(getKeys(object), function (key) {
                    return typeof object[key] !== 'undefined';
                });
            },
    
            /**
             * Levenshtein distance algorithm from wikipedia
             * http://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Levenshtein_distance#JavaScript
             */
            levenshteinDistance: function (a, b) {
                if (a.length === 0) return b.length;
                if (b.length === 0) return a.length;
    
                var matrix = [];
    
                // increment along the first column of each row
                var i;
                for (i = 0; i <= b.length; i += 1) {
                    matrix[i] = [i];
                }
    
                // increment each column in the first row
                var j;
                for (j = 0; j <= a.length; j += 1) {
                    matrix[0][j] = j;
                }
    
                // Fill in the rest of the matrix
                for (i = 1; i <= b.length; i += 1) {
                    for (j = 1; j <= a.length; j += 1) {
                        if (b.charAt(i - 1) === a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                                    Math.min(matrix[i][j - 1] + 1, // insertion
                                                             matrix[i - 1][j] + 1)); // deletion
                        }
                    }
                }
    
                return matrix[b.length][a.length];
            },
    
            truncateStack: function (err, fn) {
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(err, fn);
                } else if ('stack' in err) {
                    // Excludes IE<10, and fn cannot be anonymous for this backup plan to work:
                    var stackEntries = err.stack.split(/\r\n?|\n\r?/),
                    needle = 'at ' + fn.name + ' ';
                    for (var i = 0 ; i < stackEntries.length ; i += 1) {
                        if (stackEntries[i].indexOf(needle) !== -1) {
                            stackEntries.splice(1, i);
                            err.stack = stackEntries.join("\n");
                        }
                    }
                }
            },
    
            findFirst: function (arr, predicate, thisObj) {
                var scope = thisObj || null;
                for (var i = 0 ; i < arr.length ; i += 1) {
                    if (predicate.call(scope, arr[i], i, arr)) {
                        return arr[i];
                    }
                }
                return null;
            },
    
            leftPad: function (str, width, ch) {
                ch = ch || ' ';
                while (str.length < width) {
                    str = ch + str;
                }
                return str;
            }
        };
    
        namespace.utils = utils;
    }());
    /*global namespace*/
    (function () {
        var shim = namespace.shim;
        var bind = shim.bind;
        var forEach = shim.forEach;
        var filter = shim.filter;
        var map = shim.map;
        var trim = shim.trim;
        var reduce = shim.reduce;
        var getKeys = shim.getKeys;
        var indexOf = shim.indexOf;
    
        var utils = namespace.utils;
        var truncateStack = utils.truncateStack;
        var extend = utils.extend;
        var levenshteinDistance = utils.levenshteinDistance;
        var isArray = utils.isArray;
    
        function Assertion(expect, subject, testDescription, flags, args) {
            this.expect = expect;
            this.obj = subject; // deprecated
            this.equal = bind(expect.equal, expect); // deprecated
            this.eql = this.equal; // deprecated
            this.inspect = bind(expect.inspect, expect); // deprecated
            this.subject = subject;
            this.testDescription = testDescription;
            this.flags = flags;
            this.args = args;
            this.errorMode = 'default';
        }
    
        Assertion.prototype.standardErrorMessage = function () {
            var expect = this.expect;
            var argsString = map(this.args, function (arg) {
                return expect.inspect(arg);
            }).join(', ');
    
            if (argsString.length > 0) {
                argsString = ' ' + argsString;
            }
    
            return 'expected ' +
                expect.inspect(this.subject) +
                ' ' + this.testDescription +
                argsString;
        };
    
        Assertion.prototype.throwStandardError = function () {
            var err = new Error(this.standardErrorMessage());
            err._isUnexpected = true;
            throw err;
        };
    
        Assertion.prototype.assert = function (condition) {
            var not = !!this.flags.not;
            condition = !!condition;
            if (condition === not) {
                this.throwStandardError();
            }
        };
    
        function Unexpected(assertions, types) {
            this.assertions = assertions || {};
            this.types = types || [];
        }
    
        Unexpected.prototype.equal = function (actual, expected, depth, seen) {
            var that = this;
    
            depth = depth || 0;
            if (depth > 500) {
                // detect recursive loops in the structure
                seen = seen || [];
                if (seen.indexOf(actual) !== -1) {
                    throw new Error('Cannot compare circular structures');
                }
                seen.push(actual);
            }
    
            var matchingCustomType = utils.findFirst(this.types || [], function (type) {
                return type.identify(actual) && type.identify(expected);
            });
    
            if (matchingCustomType) {
                return matchingCustomType.equal(actual, expected, function (a, b) {
                    return that.equal(a, b, depth + 1, seen);
                });
            }
    
            return false; // we should never get there
        };
    
        Unexpected.prototype.inspect = function (obj, depth) {
            var types = this.types;
            var seen = [];
            var format = function (obj, depth) {
                if (depth === 0) {
                    return '...';
                }
    
                seen = seen || [];
                if (indexOf(seen, obj) !== -1) {
                    return '[Circular]';
                }
    
                var matchingCustomType = utils.findFirst(types || [], function (type) {
                    return type.identify(obj);
                });
    
                if (matchingCustomType) {
                    return matchingCustomType.inspect(obj, function (v) {
                        seen.push(obj);
                        return format(v, depth - 1);
                    }, depth);
                }
            };
    
            return format(obj, depth || 3);
        };
    
        Unexpected.prototype.format = function (message, args) {
            args = map(args, function (arg) {
                return this.inspect(arg);
            }, this);
            message = message.replace(/\{(\d+)\}/g, function (match, n) {
                return args[n] || match;
            });
            return message;
        };
    
        Unexpected.prototype.fail = function (message) {
            message = message || "explicit failure";
            var args = Array.prototype.slice.call(arguments, 1);
            var error =  new Error(this.format(message, args));
            error._isUnexpected = true;
            throw error;
        };
    
        Unexpected.prototype.findAssertionSimilarTo = function (text) {
            var editDistrances = [];
            forEach(getKeys(this.assertions), function (assertion) {
                var distance = levenshteinDistance(text, assertion);
                editDistrances.push({
                    assertion: assertion,
                    distance: distance
                });
            });
            editDistrances.sort(function (x, y) {
                return x.distance - y.distance;
            });
            return map(editDistrances.slice(0, 5), function (editDistrance) {
                return editDistrance.assertion;
            });
        };
    
        Unexpected.prototype.addAssertion = function () {
            var assertions = this.assertions;
            var patterns = Array.prototype.slice.call(arguments, 0, -1);
            var handler = Array.prototype.slice.call(arguments, -1)[0];
            forEach(patterns, function (pattern) {
                ensureValidPattern(pattern);
                forEach(expandPattern(pattern), function (expandedPattern) {
                    assertions[expandedPattern.text] = {
                        handler: handler,
                        flags: expandedPattern.flags
                    };
                });
            });
    
            return this.expect; // for chaining
        };
    
        Unexpected.prototype.getType = function (typeName) {
            return utils.findFirst(this.types, function (type) {
                return type.name === typeName;
            });
        };
    
        var customTypePrototype = {
            name: 'any',
            equal: function (a, b) {
                return a === b;
            },
            inspect: function (value) {
                return '' + value;
            },
            toJSON: function (value) {
                return value;
            }
        };
    
        Unexpected.prototype.addType = function (type) {
            var baseType;
            if (type.base) {
                baseType = utils.findFirst(this.types, function (t) {
                    return t.name === type.base;
                });
    
                if (!baseType) {
                    throw new Error('Unknown base type: ' + type.base);
                }
            } else {
                baseType = customTypePrototype;
            }
    
            this.types.unshift(extend({}, baseType, type, { baseType: baseType }));
    
            return this.expect;
        };
    
        Unexpected.prototype.installPlugin = function (plugin) {
            if (typeof plugin !== 'function') {
                throw new Error('Expected first argument given to installPlugin to be a function');
            }
    
            plugin(this.expect);
    
            return this.expect; // for chaining
        };
    
        Unexpected.prototype.sanitize = function (obj, stack) {
            var that = this;
            stack = stack || [];
    
            var i;
            for (i = 0 ; i < stack.length ; i += 1) {
                if (stack[i] === obj) {
                    return obj;
                }
            }
    
            stack.push(obj);
    
            var sanitized,
                matchingCustomType = utils.findFirst(this.types || [], function (type) {
                    return type.identify(obj);
                });
            if (matchingCustomType) {
                sanitized = matchingCustomType.toJSON(obj, function (v) {
                    return that.sanitize(v, stack);
                });
            } else if (isArray(obj)) {
                sanitized = map(obj, function (item) {
                    return this.sanitize(item, stack);
                }, this);
            } else if (typeof obj === 'object' && obj) {
                sanitized = {};
                forEach(getKeys(obj).sort(), function (key) {
                    sanitized[key] = this.sanitize(obj[key], stack);
                }, this);
            } else {
                sanitized = obj;
            }
            stack.pop();
            return sanitized;
        };
    
        var errorMethodBlacklist = reduce(['message', 'line', 'sourceId', 'sourceURL', 'stack', 'stackArray'], function (result, prop) {
            result[prop] = true;
            return result;
        }, {});
    
        function errorWithMessage(e, message) {
            var newError = new Error(message);
            forEach(getKeys(e), function (key) {
                if (!errorMethodBlacklist[key]) {
                    newError[key] = e[key];
                }
            });
            return newError;
        }
    
        function handleNestedExpects(e, assertion) {
            switch (assertion.errorMode) {
            case 'nested':
                return errorWithMessage(e, assertion.standardErrorMessage() + '\n    ' + e.message.replace(/\n/g, '\n    '));
            case 'default':
                return errorWithMessage(e, assertion.standardErrorMessage());
            case 'bubble':
                return e;
            default:
                throw new Error("Unknown error mode: '" + assertion.errorMode + "'");
            }
        }
    
        function installExpectMethods(unexpected, expectFunction) {
            var expect = bind(expectFunction, unexpected);
            expect.equal = bind(unexpected.equal, unexpected);
            expect.sanitize = bind(unexpected.sanitize, unexpected);
            expect.inspect = bind(unexpected.inspect, unexpected);
            expect.fail = bind(unexpected.fail, unexpected);
            expect.addAssertion = bind(unexpected.addAssertion, unexpected);
            expect.addType = bind(unexpected.addType, unexpected);
            expect.clone = bind(unexpected.clone, unexpected);
            expect.toString = bind(unexpected.toString, unexpected);
            expect.assertions = unexpected.assertions;
            expect.installPlugin = bind(unexpected.installPlugin, unexpected);
            return expect;
        }
    
        function makeExpectFunction(unexpected) {
            var expect = installExpectMethods(unexpected, unexpected.expect);
            unexpected.expect = expect;
            return expect;
        }
    
        Unexpected.prototype.expect = function expect(subject, testDescriptionString) {
            var that = this;
            if (arguments.length < 2) {
                throw new Error('The expect functions requires at least two parameters.');
            }
            if (typeof testDescriptionString !== 'string') {
                throw new Error('The expect functions requires second parameter to be a string.');
            }
            var assertionRule = this.assertions[testDescriptionString];
            if (assertionRule) {
                var flags = extend({}, assertionRule.flags);
    
                var nestingLevel = 0;
                var callInNestedContext = function (callback) {
                    nestingLevel += 1;
                    try {
                        callback();
                        nestingLevel -= 1;
                    } catch (e) {
                        nestingLevel -= 1;
                        if (e._isUnexpected) {
                            truncateStack(e, wrappedExpect);
                            if (nestingLevel === 0) {
                                throw handleNestedExpects(e, assertion);
                            }
                        }
                        throw e;
                    }
                };
    
                var wrappedExpect = function wrappedExpect(subject, testDescriptionString) {
                    testDescriptionString = trim(testDescriptionString.replace(/\[(!?)([^\]]+)\] ?/g, function (match, negate, flag) {
                        negate = !!negate;
                        return flags[flag] !== negate ? flag + ' ' : '';
                    }));
    
                    var args = Array.prototype.slice.call(arguments, 2);
                    callInNestedContext(function () {
                        that.expect.apply(that, [subject, testDescriptionString].concat(args));
                    });
                };
    
                // Not sure this is the right way to go about this:
                wrappedExpect.equal = this.equal;
                wrappedExpect.types = this.types;
                wrappedExpect.sanitize = this.sanitize;
                wrappedExpect.inspect = this.inspect;
                wrappedExpect.fail = function () {
                    var args = arguments;
                    callInNestedContext(function () {
                        that.fail.apply(that, args);
                    });
                };
                wrappedExpect.format = this.format;
    
                var args = Array.prototype.slice.call(arguments, 2);
                args.unshift(wrappedExpect, subject);
                var assertion = new Assertion(wrappedExpect, subject, testDescriptionString, flags, args.slice(2));
                var handler = assertionRule.handler;
                try {
                    handler.apply(assertion, args);
                } catch (e) {
                    if (e._isUnexpected) {
                        truncateStack(e, this.expect);
                    }
                    throw e;
                }
            } else {
                var similarAssertions = this.findAssertionSimilarTo(testDescriptionString);
                var message =
                    'Unknown assertion "' + testDescriptionString + '", ' +
                    'did you mean: "' + similarAssertions[0] + '"';
                var err = new Error(message);
                truncateStack(err, this.expect);
                throw err;
            }
        };
    
        Unexpected.prototype.toString = function () {
            return getKeys(this.assertions).sort().join('\n');
        };
    
        Unexpected.prototype.clone = function () {
            var unexpected = new Unexpected(extend({}, this.assertions), [].concat(this.types));
            return makeExpectFunction(unexpected);
        };
    
        Unexpected.create = function () {
            var unexpected = new Unexpected();
            return makeExpectFunction(unexpected);
        };
    
        var expandPattern = (function () {
            function isFlag(token) {
                return token.slice(0, 1) === '[' && token.slice(-1) === ']';
            }
            function isAlternation(token) {
                return token.slice(0, 1) === '(' && token.slice(-1) === ')';
            }
            function removeEmptyStrings(texts) {
                return filter(texts, function (text) {
                    return text !== '';
                });
            }
            function createPermutations(tokens, index) {
                if (index === tokens.length) {
                    return [{ text: '', flags: {}}];
                }
    
                var token = tokens[index];
                var tail = createPermutations(tokens, index + 1);
                if (isFlag(token)) {
                    var flag = token.slice(1, -1);
                    return map(tail, function (pattern) {
                        var flags = {};
                        flags[flag] = true;
                        return {
                            text: flag + ' ' + pattern.text,
                            flags: extend(flags, pattern.flags)
                        };
                    }).concat(map(tail, function (pattern) {
                        var flags = {};
                        flags[flag] = false;
                        return {
                            text: pattern.text,
                            flags: extend(flags, pattern.flags)
                        };
                    }));
                } else if (isAlternation(token)) {
                    var alternations = token.split(/\(|\)|\|/);
                    alternations = removeEmptyStrings(alternations);
                    return reduce(alternations, function (result, alternation) {
                        return result.concat(map(tail, function (pattern) {
                            return {
                                text: alternation + pattern.text,
                                flags: pattern.flags
                            };
                        }));
                    }, []);
                } else {
                    return map(tail, function (pattern) {
                        return {
                            text: token + pattern.text,
                            flags: pattern.flags
                        };
                    });
                }
            }
            return function (pattern) {
                pattern = pattern.replace(/(\[[^\]]+\]) ?/g, '$1');
                var splitRegex = /\[[^\]]+\]|\([^\)]+\)/g;
                var tokens = [];
                var m;
                var lastIndex = 0;
                while ((m = splitRegex.exec(pattern))) {
                    tokens.push(pattern.slice(lastIndex, m.index));
                    tokens.push(pattern.slice(m.index, splitRegex.lastIndex));
                    lastIndex = splitRegex.lastIndex;
                }
                tokens.push(pattern.slice(lastIndex));
    
                tokens = removeEmptyStrings(tokens);
                var permutations = createPermutations(tokens, 0);
                forEach(permutations, function (permutation) {
                    permutation.text = trim(permutation.text);
                    if (permutation.text === '') {
                        // This can only happen if the pattern only contains flags
                        throw new Error("Assertion patterns must not only contain flags");
                    }
                });
                return permutations;
            };
        }());
    
    
        function ensureValidUseOfParenthesesOrBrackets(pattern) {
            var counts = {
                '[': 0,
                ']': 0,
                '(': 0,
                ')': 0
            };
            for (var i = 0; i < pattern.length; i += 1) {
                var c = pattern.charAt(i);
                if (c in counts) {
                    counts[c] += 1;
                }
                if (c === ']' && counts['['] >= counts[']']) {
                    if (counts['['] === counts[']'] + 1) {
                        throw new Error("Assertion patterns must not contain flags with brackets: '" + pattern + "'");
                    }
    
                    if (counts['('] !== counts[')']) {
                        throw new Error("Assertion patterns must not contain flags with parentheses: '" + pattern + "'");
                    }
    
                    if (pattern.charAt(i - 1) === '[') {
                        throw new Error("Assertion patterns must not contain empty flags: '" + pattern + "'");
                    }
                } else if (c === ')' && counts['('] >= counts[')']) {
                    if (counts['('] === counts[')'] + 1) {
                        throw new Error("Assertion patterns must not contain alternations with parentheses: '" + pattern + "'");
                    }
    
                    if (counts['['] !== counts[']']) {
                        throw new Error("Assertion patterns must not contain alternations with brackets: '" + pattern + "'");
                    }
                }
    
                if ((c === ')' || c === '|') && counts['('] >= counts[')']) {
                    if (pattern.charAt(i - 1) === '(' || pattern.charAt(i - 1) === '|') {
                        throw new Error("Assertion patterns must not contain empty alternations: '" + pattern + "'");
                    }
                }
            }
    
            if (counts['['] !== counts[']']) {
                throw new Error("Assertion patterns must not contain unbalanced brackets: '" + pattern + "'");
            }
    
            if (counts['('] !== counts[')']) {
                throw new Error("Assertion patterns must not contain unbalanced parentheses: '" + pattern + "'");
            }
        }
    
        function ensureValidPattern(pattern) {
            if (typeof pattern !== 'string' || pattern === '') {
                throw new Error("Assertion patterns must be a non empty string");
            }
            if (pattern.match(/^\s|\s$/)) {
                throw new Error("Assertion patterns can't start or end with whitespace");
            }
    
            ensureValidUseOfParenthesesOrBrackets(pattern);
        }
    
        namespace.expect = Unexpected.create();
    }());
    /*global namespace, Uint8Array, Uint16Array*/
    (function () {
        var expect = namespace.expect;
    
        var utils = namespace.utils;
        var isRegExp = utils.isRegExp;
        var leftPad = utils.leftPad;
        var shim = namespace.shim;
        var json = shim.JSON;
        var every = shim.every;
        var some = shim.some;
        var map = shim.map;
        var getKeys = shim.getKeys;
        var reduce = shim.reduce;
        var extend = utils.extend;
    
        expect.addType({
            name: 'fallback',
            identify: function (value) {
                return true;
            },
            equal: function (a, b) {
                return a === b;
            },
            inspect: function (value) {
                return '' + value;
            },
            toJSON: function (value) {
                return value;
            }
        });
    
        expect.addType({
            name: 'object',
            identify: function (arr) {
                return typeof arr === 'object';
            },
            equal: function (a, b, equal) {
                if (a === b) {
                    return true;
                }
    
                // an identical "prototype" property.
                if (a.prototype !== b.prototype) {
                    return false;
                }
                //~~~I've managed to break Object.keys through screwy arguments passing.
                //   Converting to array solves the problem.
                if (utils.isArguments(a)) {
                    if (!utils.isArguments(b)) {
                        return false;
                    }
                    return equal(Array.prototype.slice.call(a), Array.prototype.slice.call(b));
                }
                var actualKeys = utils.getKeysOfDefinedProperties(a),
                    expectedKeys = utils.getKeysOfDefinedProperties(b),
                    key,
                    i;
    
                // having the same number of owned properties (keys incorporates hasOwnProperty)
                if (actualKeys.length !== expectedKeys.length) {
                    return false;
                }
                //the same set of keys (although not necessarily the same order),
                actualKeys.sort();
                expectedKeys.sort();
                //~~~cheap key test
                for (i = actualKeys.length - 1; i >= 0; i -= 1) {
                    if (actualKeys[i] !== expectedKeys[i]) {
                        return false;
                    }
                }
    
                //equivalent values for every corresponding key, and
                //~~~possibly expensive deep test
                for (i = actualKeys.length - 1; i >= 0; i -= 1) {
                    key = actualKeys[i];
                    if (!equal(a[key], b[key])) {
                        return false;
                    }
                }
                return true;
            },
            inspect: function (obj, inspect) {
                var keys = getKeys(obj);
                if (keys.length === 0) {
                    return '{}';
                }
    
                var inspectedItems = map(keys, function (key) {
                    var parts = [];
                    if (key.match(/["' ]/)) {
                        parts.push(expect.inspect(key) + ':');
                    } else {
                        parts.push(key + ':');
                    }
    
                    var hasGetter = obj.__lookupGetter__ && obj.__lookupGetter__(key);
                    var hasSetter = obj.__lookupGetter__ && obj.__lookupSetter__(key);
    
                    if (hasGetter || !hasSetter) {
                        parts.push(inspect(obj[key]));
                    }
    
                    if (hasGetter && hasSetter) {
                        parts.push('[Getter/Setter]');
                    } else if (hasGetter) {
                        parts.push('[Getter]');
                    } else if (hasSetter) {
                        parts.push('[Setter]');
                    }
    
                    return parts.join(' ');
                });
    
                var length = 0;
                var multipleLines = some(inspectedItems, function (v) {
                    length += v.length;
                    return length > 50 || v.match(/\n/);
                });
    
                if (multipleLines) {
                    return '{\n' + inspectedItems.join(',\n').replace(/^/gm, '  ') + '\n}';
                } else {
                    return '{ ' + inspectedItems.join(', ') + ' }';
                }
            },
            toJSON: function (obj, toJSON) {
                return reduce(getKeys(obj), function (result, key) {
                    result[key] = toJSON(obj[key]);
                    return result;
                }, {});
            }
        });
    
        expect.addType({
            name: 'array',
            identify: function (arr) {
                return utils.isArray(arr) || utils.isArguments(arr);
            },
            equal: function (a, b, equal) {
                return a === b || (a.length === b.length && every(a, function (v, index) {
                    return equal(v, b[index]);
                }));
            },
            inspect: function (arr, inspect, depth) {
                if (arr.length === 0) {
                    return '[]';
                }
    
                if (depth === 1) {
                    return '[...]';
                }
    
                var inspectedItems = map(arr, function (v) {
                    return inspect(v);
                });
    
                var length = 0;
                var multipleLines = some(inspectedItems, function (v) {
                    length += v.length;
                    return length > 50 || v.match(/\n/);
                });
    
                if (multipleLines) {
                    return '[\n' + inspectedItems.join(',\n').replace(/^/gm, '  ') + '\n]';
                } else {
                    return '[ ' + inspectedItems.join(', ') + ' ]';
                }
            },
            toJSON: function (arr, toJSON) {
                return map(arr, toJSON);
            }
        });
    
        expect.addType({
            base: 'object',
            name: 'Error',
            identify: function (value) {
                return utils.isError(value);
            },
            equal: function (a, b, equal) {
                return a === b ||
                    (equal(a.message, b.message) && this.baseType.equal(a, b, equal));
            },
            inspect: function (value, inspect) {
                var errorObject = extend({
                    message: value.message
                }, value);
                return '[Error: ' + inspect(errorObject) + ']';
            }
        });
    
        expect.addType({
            name: 'date',
            identify: function (obj) {
                return Object.prototype.toString.call(obj) === '[object Date]';
            },
            equal: function (a, b) {
                return a.getTime() === b.getTime();
            },
            inspect: function (date) {
                return '[Date ' + date.toUTCString() + ']';
            },
            toJSON: function (date) {
                return {
                    $Date: this.inspect(date)
                };
            }
        });
    
        expect.addType({
            name: 'function',
            identify: function (f) {
                return typeof f === 'function';
            },
            equal: function (a, b) {
                return a === b || a.toString() === b.toString();
            },
            inspect: function (f) {
                var n = f.name ? ': ' + f.name : '';
                return '[Function' + n + ']';
            },
            toJSON: function (f) {
                return {
                    $Function: this.inspect(f)
                };
            }
        });
    
        expect.addType({
            name: 'regexp',
            identify: isRegExp,
            equal: function (a, b) {
                return a === b || (
                    a.source === b.source &&
                        a.global === b.global &&
                        a.ignoreCase === b.ignoreCase &&
                        a.multiline === b.multiline
                );
            },
            inspect: function (regExp) {
                return '' + regExp;
            },
            toJSON: function (regExp) {
                return {
                    $RegExp: this.inspect(regExp)
                };
            }
        });
    
        expect.addType({
            name: 'DomElement',
            identify: function (value) {
                return utils.isDOMElement(value);
            },
            inspect: function (value) {
                return utils.getOuterHTML(value);
            }
        });
    
        function getHexDumpLinesForBufferLikeObject(obj, width, digitWidth) {
            digitWidth = digitWidth || 2;
            var hexDumpLines = [];
            if (typeof width !== 'number') {
                width = 16;
            } else if (width === 0) {
                width = obj.length;
            }
            for (var i = 0 ; i < obj.length ; i += width) {
                var hexChars = '',
                    asciiChars = ' |';
    
                for (var j = 0 ; j < width ; j += 1) {
                    if (i + j < obj.length) {
                        var octet = obj[i + j];
                        hexChars += leftPad(octet.toString(16).toUpperCase(), digitWidth, '0') + ' ';
                        asciiChars += (octet >= 32 && octet < 127) ? String.fromCharCode(octet) : '.';
                    } else if (digitWidth === 2) {
                        hexChars += '   ';
                    }
                }
    
                if (digitWidth === 2) {
                    asciiChars += '|';
                    hexDumpLines.push(hexChars + asciiChars);
                } else {
                    hexDumpLines.push(hexChars.replace(/\s+$/, ''));
                }
            }
            return hexDumpLines;
        }
    
        function inspectBufferLikeObject(buffer, digitWidth) {
            var inspectedContents,
                maxLength = 20;
            if (buffer.length > maxLength) {
                inspectedContents = getHexDumpLinesForBufferLikeObject(buffer.slice(0, maxLength), 0, digitWidth) + ' (+' + (buffer.length - maxLength) + ')';
            } else {
                inspectedContents = getHexDumpLinesForBufferLikeObject(buffer, 0, digitWidth).join('\n');
            }
            return inspectedContents;
        }
    
        function bufferLikeObjectsEqual(a, b) {
            if (a === b) {
                return true;
            }
    
            if (a.length !== b.length) return false;
    
            for (var i = 0; i < a.length; i += 1) {
                if (a[i] !== b[i]) return false;
            }
    
            return true;
        }
    
        if (typeof Buffer !== 'undefined') {
            expect.addType({
                name: 'Buffer',
                identify: Buffer.isBuffer,
                equal: bufferLikeObjectsEqual,
                inspect: function (buffer) {
                    return '[Buffer ' + inspectBufferLikeObject(buffer) + ']';
                },
                toJSON: function (buffer) {
                    return {
                        $Buffer: getHexDumpLinesForBufferLikeObject(buffer)
                    };
                }
            });
        }
    
        if (typeof Uint8Array !== 'undefined') {
            expect.addType({
                name: 'Uint8Array',
                identify: function (obj) {
                    return obj && obj instanceof Uint8Array;
                },
                equal: bufferLikeObjectsEqual,
                inspect: function (uint8Array) {
                    return '[Uint8Array ' + inspectBufferLikeObject(uint8Array) + ']';
                },
                toJSON: function (uint8Array) {
                    return {
                        $Uint8Array: getHexDumpLinesForBufferLikeObject(uint8Array)
                    };
                }
            });
        }
    
    
        if (typeof Uint16Array !== 'undefined') {
            expect.addType({
                name: 'Uint16Array',
                identify: function (obj) {
                    return obj && obj instanceof Uint16Array;
                },
                equal: bufferLikeObjectsEqual,
                inspect: function (uint16Array) {
                    return '[Uint16Array ' + inspectBufferLikeObject(uint16Array, 8, 4, false) + ']';
                },
                toJSON: function (uint16Array) {
                    return {
                        $Uint16Array: getHexDumpLinesForBufferLikeObject(uint16Array, 8, 4, false)
                    };
                }
            });
        }
    
        expect.addType({
            name: 'string',
            identify: function (value) {
                return typeof value === 'string';
            },
            inspect: function (value) {
                return '\'' + json.stringify(value).replace(/^"|"$/g, '')
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"') + '\'';
            }
        });
    
        expect.addType({
            name: 'number',
            identify: function (value) {
                return typeof value === 'number';
            }
        });
    
        expect.addType({
            name: 'boolean',
            identify: function (value) {
                return typeof value === 'boolean';
            }
        });
    
        expect.addType({
            name: 'undefined',
            identify: function (value) {
                return typeof value === 'undefined';
            }
        });
    
        expect.addType({
            name: 'null',
            identify: function (value) {
                return value === null;
            }
        });
    }());
    /*global namespace*/
    (function () {
        var expect = namespace.expect;
    
        var shim = namespace.shim;
        var forEach = shim.forEach;
        var getKeys = shim.getKeys;
        var every = shim.every;
        var indexOf = shim.indexOf;
    
        var utils = namespace.utils;
        var isRegExp = utils.isRegExp;
        var isArray = utils.isArray;
    
        expect.addAssertion('[not] to be (ok|truthy)', function (expect, subject) {
            this.assert(subject);
        });
    
        expect.addAssertion('[not] to be', function (expect, subject, value) {
            expect(subject === value, '[not] to be truthy');
        });
    
        expect.addAssertion('[not] to be true', function (expect, subject) {
            expect(subject, '[not] to be', true);
        });
    
        expect.addAssertion('[not] to be false', function (expect, subject) {
            expect(subject, '[not] to be', false);
        });
    
        expect.addAssertion('[not] to be falsy', function (expect, subject) {
            expect(subject, '[!not] to be truthy');
        });
    
        expect.addAssertion('[not] to be null', function (expect, subject) {
            expect(subject, '[not] to be', null);
        });
    
        expect.addAssertion('[not] to be undefined', function (expect, subject) {
            expect(typeof subject, '[not] to be', 'undefined');
        });
    
        expect.addAssertion('[not] to be NaN', function (expect, subject) {
            expect(isNaN(subject), '[not] to be true');
        });
    
        expect.addAssertion('[not] to be (a|an)', function (expect, subject, type) {
            if ('string' === typeof type) {
                // typeof with support for 'array'
                expect('array' === type ? isArray(subject) :
                        'object' === type ? 'object' === typeof subject && null !== subject :
                            /^reg(?:exp?|ular expression)$/.test(type) ? isRegExp(subject) :
                                type === typeof subject,
                       '[not] to be true');
            } else {
                expect(subject instanceof type, '[not] to be true');
            }
    
            return this;
        });
    
        // Alias for common '[not] to be (a|an)' assertions
        expect.addAssertion('[not] to be (a|an) (boolean|number|string|function|object|array|regexp|regex|regular expression)', function (expect, subject) {
            var matches = /(.* be (?:a|an)) ([\w\s]+)/.exec(this.testDescription);
            expect(subject, matches[1], matches[2]);
        });
    
        forEach(['string', 'array', 'object'], function (type) {
            expect.addAssertion('to be (the|an) empty ' + type, function (expect, subject) {
                expect(subject, 'to be a', type);
                expect(subject, 'to be empty');
            });
    
            expect.addAssertion('to be a non-empty ' + type, function (expect, subject) {
                expect(subject, 'to be a', type);
                expect(subject, 'not to be empty');
            });
        });
    
        expect.addAssertion('[not] to match', function (expect, subject, regexp) {
            expect(regexp.exec(subject), '[not] to be truthy');
        });
    
        expect.addAssertion('[not] to have [own] property', function (expect, subject, key, value) {
            if (arguments.length === 4) {
                expect(subject, 'to have [own] property', key);
                expect(subject[key], '[not] to equal', value);
            } else {
                expect(this.flags.own ?
                       subject && subject.hasOwnProperty(key) :
                       subject && subject[key] !== undefined,
                       '[not] to be truthy');
            }
        });
    
        expect.addAssertion('[not] to have [own] properties', function (expect, subject, properties) {
            if (properties && isArray(properties)) {
                forEach(properties, function (property) {
                    expect(subject, '[not] to have [own] property', property);
                });
            } else if (properties && typeof properties === 'object') {
                // TODO the not flag does not make a lot of sense in this case
                if (this.flags.not) {
                    forEach(getKeys(properties), function (property) {
                        expect(subject, 'not to have [own] property', property);
                    });
                } else {
                    try {
                        forEach(getKeys(properties), function (property) {
                            expect(subject, 'to have [own] property', property, properties[property]);
                        });
                    } catch (e) {
                        e.expected = expect.sanitize(properties);
                        for (var propertyName in subject) {
                            if ((!this.flags.own || subject.hasOwnProperty(propertyName)) && !(propertyName in properties)) {
                                e.expected[propertyName] = expect.sanitize(subject[propertyName]);
                            }
                        }
                        e.actual = expect.sanitize(subject);
                        e.showDiff = true;
                        throw e;
                    }
                }
            } else {
                throw new Error("Assertion '" + this.testDescription + "' only supports " +
                                "input in the form of an Array or an Object.");
            }
        });
    
        expect.addAssertion('[not] to have length', function (expect, subject, length) {
            if (!subject || typeof subject.length !== 'number') {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports array like objects");
            }
            expect(subject.length, '[not] to be', length);
        });
    
        expect.addAssertion('[not] to be empty', function (expect, subject) {
            var length;
            if (subject && 'number' === typeof subject.length) {
                length = subject.length;
            } else if (isArray(subject) || typeof subject === 'string') {
                length = subject.length;
            } else if (subject && typeof subject === 'object') {
                length = getKeys(subject).length;
            } else {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports strings, arrays and objects");
            }
            expect(length, '[not] to be', 0);
        });
    
        expect.addAssertion('to be non-empty', function (expect, subject) {
            expect(subject, 'not to be empty');
        });
    
        expect.addAssertion('to [not] [only] have (key|keys)', '[not] to have (key|keys)', function (expect, subject, keys) {
            keys = isArray(keys) ?
                keys :
                Array.prototype.slice.call(arguments, 2);
    
            var hasKeys = subject && every(keys, function (key) {
                return subject.hasOwnProperty(key);
            });
            if (this.flags.only) {
                expect(hasKeys, 'to be truthy');
                expect(getKeys(subject).length === keys.length, '[not] to be truthy');
            } else {
                expect(hasKeys, '[not] to be truthy');
            }
        });
    
        expect.addAssertion('[not] to contain', function (expect, subject, arg) {
            var args = Array.prototype.slice.call(arguments, 2);
            var that = this;
    
            if ('string' === typeof subject) {
                forEach(args, function (arg) {
                    expect(subject.indexOf(arg) !== -1, '[not] to be truthy');
                });
            } else if (isArray(subject)) {
                forEach(args, function (arg) {
                    expect(subject && indexOf(subject, arg) !== -1, '[not] to be truthy');
                });
            } else if (subject === null) {
                expect(that.flags.not, '[not] to be falsy');
            } else {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports strings and arrays");
            }
        });
    
        expect.addAssertion('[not] to be finite', function (expect, subject) {
            expect(typeof subject === 'number' && isFinite(subject), '[not] to be truthy');
        });
    
        expect.addAssertion('[not] to be infinite', function (expect, subject) {
            expect(typeof subject === 'number' && !isNaN(subject) && !isFinite(subject), '[not] to be truthy');
        });
    
        expect.addAssertion('[not] to be within', function (expect, subject, start, finish) {
            this.args = [start + '..' + finish];
            expect(subject, 'to be a number');
            expect(subject >= start && subject <= finish, '[not] to be true');
        });
    
        expect.addAssertion('<', 'to be (<|less than|below)', function (expect, subject, value) {
            expect(subject < value, 'to be true');
        });
    
        expect.addAssertion('<=', 'to be (<=|less than or equal to)', function (expect, subject, value) {
            expect(subject <= value, 'to be true');
        });
    
        expect.addAssertion('>', 'to be (>|greater than|above)', function (expect, subject, value) {
            expect(subject > value, 'to be true');
        });
    
        expect.addAssertion('>=', 'to be (>=|greater than or equal to)', function (expect, subject, value) {
            expect(subject >= value, 'to be true');
        });
    
        expect.addAssertion('to be positive', function (expect, subject) {
            expect(subject, '>', 0);
        });
    
        expect.addAssertion('to be negative', function (expect, subject) {
            expect(subject, '<', 0);
        });
    
        expect.addAssertion('[not] to equal', function (expect, subject, value) {
            try {
                expect(expect.equal(value, subject), '[not] to be true');
            } catch (e) {
                if (!this.flags.not) {
                    e.expected = expect.sanitize(value);
                    e.actual = expect.sanitize(subject);
                    // Explicitly tell mocha to stringify and diff arrays
                    // and objects, but only when the types are identical
                    // and non-primitive:
                    if (e.actual && e.expected &&
                        typeof e.actual === 'object' &&
                        typeof e.expected === 'object' &&
                        isArray(e.actual) === isArray(e.expected)) {
                        e.showDiff = true;
                    }
                }
                throw e;
            }
        });
    
        expect.addAssertion('[not] to (throw|throw error|throw exception)', function (expect, subject, arg) {
            this.errorMode = 'nested';
            if (typeof subject !== 'function') {
                throw new Error("Assertion '" + this.testDescription +
                                "' only supports functions");
            }
    
            var thrown = false;
            var argType = typeof arg;
    
            try {
                subject();
            } catch (e) {
                var subject = 'string' === typeof e ? e : e.message;
                if ('function' === argType) {
                    arg(e);
                } else if ('string' === argType) {
                    expect(subject, '[not] to equal', arg);
                } else if (isRegExp(arg)) {
                    expect(subject, '[not] to match', arg);
                } else if (this.flags.not) {
                    expect.fail('threw: {0}', e.message);
                }
                thrown = true;
            }
    
            this.errorMode = 'default';
            if ('string' === argType || isRegExp(arg)) {
                // in the presence of a matcher, ensure the `not` only applies to
                // the matching.
                expect(thrown, 'to be true');
            } else {
                expect(thrown, '[not] to be true');
            }
        });
    
        expect.addAssertion('to be (a|an) [non-empty] (map|hash|object) whose values satisfy', function (expect, subject, callbackOrString) {
            var callback;
            if ('function' === typeof callbackOrString) {
                callback = callbackOrString;
            } else if ('string' === typeof callbackOrString) {
                var args = Array.prototype.slice.call(arguments, 2);
                callback = function (value) {
                    expect.apply(expect, [value].concat(args));
                };
            } else {
                throw new Error('Assertion "' + this.testDescription + '" expects a function as argument');
            }
            this.errorMode = 'nested';
            expect(subject, 'to be an object');
            if (this.flags['non-empty']) {
                expect(subject, 'to be non-empty');
            }
            this.errorMode = 'default';
    
            var errors = [];
            forEach(getKeys(subject), function (key, index) {
                try {
                    callback(subject[key], index);
                } catch (e) {
                    errors.push('    ' + key + ': ' + e.message.replace(/\n/g, '\n    '));
                }
            });
    
            if (errors.length > 0) {
                var objectString = expect.inspect(subject);
                var prefix = /\n/.test(objectString) ? '\n' : ' ';
                var message = 'failed expectation in' + prefix + objectString + ':\n' +
                    errors.join('\n');
                throw new Error(message);
            }
        });
    
        expect.addAssertion('to be (a|an) [non-empty] array whose items satisfy', function (expect, subject, callbackOrString) {
            var callback;
            if ('function' === typeof callbackOrString) {
                callback = callbackOrString;
            } else if ('string' === typeof callbackOrString) {
                var args = Array.prototype.slice.call(arguments, 2);
                callback = function (item) {
                    expect.apply(expect, [item].concat(args));
                };
            } else {
                throw new Error('Assertion "' + this.testDescription + '" expects a function as argument');
            }
            this.errorMode = 'nested';
            expect(subject, 'to be an array');
            if (this.flags['non-empty']) {
                expect(subject, 'to be non-empty');
            }
            this.errorMode = 'bubble';
            expect(subject, 'to be a map whose values satisfy', callback);
        });
    
        forEach(['string', 'number', 'boolean', 'array', 'object', 'function', 'regexp', 'regex', 'regular expression'], function (type) {
            expect.addAssertion('to be (a|an) [non-empty] array of ' + type + 's', function (expect, subject) {
                expect(subject, 'to be an array whose items satisfy', function (item) {
                    expect(item, 'to be a', type);
                });
                if (this.flags['non-empty']) {
                    expect(subject, 'to be non-empty');
                }
            });
        });
    
        expect.addAssertion('to be (a|an) [non-empty] (map|hash|object) whose keys satisfy', function (expect, subject, callbackOrString) {
            var callback;
            if ('function' === typeof callbackOrString) {
                this.errorMode = 'nested';
                callback = callbackOrString;
            } else if ('string' === typeof callbackOrString) {
                var args = Array.prototype.slice.call(arguments, 2);
                callback = function (key) {
                    expect.apply(expect, [key].concat(args));
                };
            } else {
                throw new Error('Assertion "' + this.testDescription + '" expects a function as argument');
            }
            this.errorMode = 'nested';
            expect(subject, 'to be an object');
            if (this.flags['non-empty']) {
                expect(subject, 'to be non-empty');
            }
            this.errorMode = 'default';
    
            var errors = [];
            var keys = getKeys(subject);
            forEach(keys, function (key) {
                try {
                    callback(key);
                } catch (e) {
                    errors.push('    ' + key + ': ' + e.message.replace(/\n/g, '\n    '));
                }
            });
    
            if (errors.length > 0) {
                var message = 'failed expectation on keys ' + keys.join(', ') + ':\n' +
                    errors.join('\n');
                throw new Error(message);
            }
        });
    }());
    /*global namespace*/
    (function () {
        var global = this;
        var expect = namespace.expect;
    
        // Support three module loading scenarios
        if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
            // CommonJS/Node.js
            module.exports = expect;
        } else if (typeof define === 'function' && define.amd) {
            // AMD anonymous module
            define(function () {
                return expect;
            });
        } else {
            // No module loader (plain <script> tag) - put directly in global namespace
            global.weknowhow = global.weknowhow || {};
            global.weknowhow.expect = expect;
        }
    }());
}());
