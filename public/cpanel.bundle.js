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
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.NOMINATE_SELF = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _flux = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var controlPanelDispatcher = new _flux.Dispatcher();
	
	var NOMINATE_SELF = exports.NOMINATE_SELF = "NOMINATE_SELF";
	
	var nominateSelfAction = function nominateSelfAction(data) {
	    return {
	        "value": data,
	        "type": NOMINATE_SELF
	    };
	};
	
	$(function () {
	    var PanelistStore = function (_Store) {
	        _inherits(PanelistStore, _Store);
	
	        function PanelistStore() {
	            _classCallCheck(this, PanelistStore);
	
	            return _possibleConstructorReturn(this, (PanelistStore.__proto__ || Object.getPrototypeOf(PanelistStore)).apply(this, arguments));
	        }
	
	        _createClass(PanelistStore, [{
	            key: "getInitialState",
	            value: function getInitialState(cb) {
	                var _this2 = this;
	
	                $.ajax({
	                    url: "http://localhost:3003/panelists",
	                    method: 'get',
	                    contentType: "application/json",
	                    success: function success(res) {
	                        _this2.__state = res;
	                        cb(_this2.__state);
	                    }
	                });
	            }
	        }, {
	            key: "__onDispatch",
	            value: function __onDispatch(action) {
	                var _this3 = this;
	
	                switch (action.type) {
	                    case NOMINATE_SELF:
	                        this.__state = action.value;
	                        $.ajax({
	                            url: 'http://localhost:3003/panelists',
	                            method: 'put',
	                            contentType: 'application/json',
	                            data: JSON.stringify(this.__state),
	                            success: function success(res) {
	                                console.log('res is: ' + res);
	                                _this3.__emitChange();
	                            }
	                        });
	
	                        break;
	                }
	            }
	        }]);
	
	        return PanelistStore;
	    }(_flux.Store);
	
	    var panelistStore = new PanelistStore(controlPanelDispatcher);
	
	    var render = function render(object) {
	
	        $('.collapse-button').on('click', function (e) {
	            $(e.currentTarget).find('.more-less').toggleClass("fa-plus fa-minus");
	        });
	
	        $('.logged-in-username').html(object.name.split(' ')[0]);
	        $('.assessment-status').html(object.status);
	        $('.nominated-by').html(object.nominatedBy);
	        $('.nominate-btn').hide();
	        $('.shadow-status').html(object.shadow.status);
	        $('.reverse-shadow-status').html(object.reverseShadow.status);
	
	        if (object.state == 0) {
	
	            $('.detail-status').css('opacity', 0.6);
	            $('.collapse-button').hide();
	            $('.nominate-btn').show();
	        }
	
	        $('.nominate-btn').on('click', function () {
	
	            // Code for Email to Supervisor Will be here
	            var newObject = object;
	            newObject.state = 1;
	            newObject.status = 'Pending Supervisor Approval';
	            newObject.nominatedBy = 'Self';
	
	            controlPanelDispatcher.dispatch(nominateSelfAction(newObject));
	
	            $('#myModal').modal('show');
	        });
	    };
	    panelistStore.addListener(function (state) {
	        console.log('render is performed');
	
	        // Re-render
	        render(state);
	    });
	
	    panelistStore.getInitialState(function (data) {
	        render(data);
	    });
	});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Dispatcher = __webpack_require__(3);
	
	Object.defineProperty(exports, 'Dispatcher', {
	  enumerable: true,
	  get: function get() {
	    return _Dispatcher.Dispatcher;
	  }
	});
	
	var _Store = __webpack_require__(4);
	
	Object.defineProperty(exports, 'Store', {
	  enumerable: true,
	  get: function get() {
	    return _Store.Store;
	  }
	});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Dispatcher = exports.Dispatcher = function () {
	    function Dispatcher() {
	        _classCallCheck(this, Dispatcher);
	
	        this.__listeners = [];
	    }
	
	    _createClass(Dispatcher, [{
	        key: "dispatch",
	        value: function dispatch(action) {
	            this.__listeners.forEach(function (listener) {
	                return listener(action);
	            });
	        }
	    }, {
	        key: "register",
	        value: function register(listener) {
	            this.__listeners.push(listener);
	        }
	    }]);

	    return Dispatcher;
	}();

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Store = exports.Store = function () {
	    function Store(dispatcher) {
	        _classCallCheck(this, Store);
	
	        this.__listeners = [];
	        this.__state = this.getInitialState();
	        dispatcher.register(this.__onDispatch.bind(this));
	    }
	
	    _createClass(Store, [{
	        key: "getInitialState",
	        value: function getInitialState() {
	            throw new Error("Subclasses must override getInitialState method of a Flux Store");
	        }
	    }, {
	        key: "__onDispatch",
	        value: function __onDispatch() {
	            throw new Error("Subclasses must override __onDispatch method of a Flux Store");
	        }
	    }, {
	        key: "addListener",
	        value: function addListener(listener) {
	            this.__listeners.push(listener);
	        }
	    }, {
	        key: "__emitChange",
	        value: function __emitChange() {
	            var _this = this;
	
	            this.__listeners.forEach(function (listener) {
	                return listener(_this.__state);
	            });
	        }
	    }]);

	    return Store;
	}();

/***/ })
/******/ ]);
//# sourceMappingURL=cpanel.bundle.js.map