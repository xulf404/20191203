 /*!
  * jQuery Cookie Plugin v1.4.1
  * https://github.com/carhartl/jquery-cookie
  *
  * Copyright 2013 Klaus Hartl
  * Released under the MIT license
  */
 (function(factory) {
 	if (typeof define === 'function' && define.amd) {
 		// AMD
 		define(['jquery'], factory);
 	} else if (typeof exports === 'object') {
 		// CommonJS
 		factory(require('jquery'));
 	} else {
 		// Browser globals
 		factory(jQuery);
 	}
 }(function($) {

 	var pluses = /\+/g;

 	function encode(s) {
 		return config.raw ? s : encodeURIComponent(s);
 	}

 	function decode(s) {
 		return config.raw ? s : decodeURIComponent(s);
 	}

 	function stringifyCookieValue(value) {
 		return encode(config.json ? JSON.stringify(value) : String(value));
 	}

 	function parseCookieValue(s) {
 		if (s.indexOf('"') === 0) {
 			// This is a quoted cookie as according to RFC2068, unescape...
 			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
 		}

 		try {
 			// Replace server-side written pluses with spaces.
 			// If we can't decode the cookie, ignore it, it's unusable.
 			// If we can't parse the cookie, ignore it, it's unusable.
 			s = decodeURIComponent(s.replace(pluses, ' '));
 			return config.json ? JSON.parse(s) : s;
 		} catch (e) {}
 	}

 	function read(s, converter) {
 		var value = config.raw ? s : parseCookieValue(s);
 		return $.isFunction(converter) ? converter(value) : value;
 	}

 	var config = $.cookie = function(key, value, options) {

 		// Write

 		if (value !== undefined && !$.isFunction(value)) {
 			options = $.extend({}, config.defaults, options);

 			if (typeof options.expires === 'number') {
 				var days = options.expires,
 					t = options.expires = new Date();
 				t.setTime(+t + days * 864e+5);
 			}

 			return (document.cookie = [
 				encode(key), '=', stringifyCookieValue(value),
 				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
 				options.path ? '; path=' + options.path : '',
 				options.domain ? '; domain=' + options.domain : '',
 				options.secure ? '; secure' : ''
 			].join(''));
 		}

 		// Read

 		var result = key ? undefined : {};

 		// To prevent the for loop in the first place assign an empty array
 		// in case there are no cookies at all. Also prevents odd result when
 		// calling $.cookie().
 		var cookies = document.cookie ? document.cookie.split('; ') : [];

 		for (var i = 0, l = cookies.length; i < l; i++) {
 			var parts = cookies[i].split('=');
 			var name = decode(parts.shift());
 			var cookie = parts.join('=');

 			if (key && key === name) {
 				// If second argument (value) is a function it's a converter...
 				result = read(cookie, value);
 				break;
 			}

 			// Prevent storing a cookie that we couldn't decode.
 			if (!key && (cookie = read(cookie)) !== undefined) {
 				result[name] = cookie;
 			}
 		}

 		return result;
 	};

 	config.defaults = {};

 	$.removeCookie = function(key, options) {
 		if ($.cookie(key) === undefined) {
 			return false;
 		}

 		// Must not alter options, thus extending a fresh object...
 		$.cookie(key, '', $.extend({}, options, {
 			expires: -1
 		}));
 		return !$.cookie(key);
 	};

 }));


 /*
  *����������localStorage֧�ּ�������
  *compatibility_localStorage()
  **/
 (function() {
 	if (!window.localStorage) {
 		Object.defineProperty(window, "localStorage", new(function() {
 			var aKeys = [],
 				oStorage = {};
 			Object.defineProperty(oStorage, "getItem", {
 				value: function(sKey) {
 					return sKey ? this[sKey] : null;
 				},
 				writable: false,
 				configurable: false,
 				enumerable: false
 			});
 			Object.defineProperty(oStorage, "key", {
 				value: function(nKeyId) {
 					return aKeys[nKeyId];
 				},
 				writable: false,
 				configurable: false,
 				enumerable: false
 			});
 			Object.defineProperty(oStorage, "setItem", {
 				value: function(sKey, sValue) {
 					if (!sKey) {
 						return;
 					}
 					document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
 				},
 				writable: false,
 				configurable: false,
 				enumerable: false
 			});
 			Object.defineProperty(oStorage, "length", {
 				get: function() {
 					return aKeys.length;
 				},
 				configurable: false,
 				enumerable: false
 			});
 			Object.defineProperty(oStorage, "removeItem", {
 				value: function(sKey) {
 					if (!sKey) {
 						return;
 					}
 					document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
 				},
 				writable: false,
 				configurable: false,
 				enumerable: false
 			});
 			this.get = function() {
 				var iThisIndx;
 				for (var sKey in oStorage) {
 					iThisIndx = aKeys.indexOf(sKey);
 					if (iThisIndx === -1) {
 						oStorage.setItem(sKey, oStorage[sKey]);
 					} else {
 						aKeys.splice(iThisIndx, 1);
 					}
 					delete oStorage[sKey];
 				}
 				for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
 					oStorage.removeItem(aKeys[0]);
 				}
 				for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
 					aCouple = aCouples[nIdx].split(/\s*=\s*/);
 					if (aCouple.length > 1) {
 						oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
 						aKeys.push(iKey);
 					}
 				}
 				return oStorage;
 			};
 			this.configurable = false;
 			this.enumerable = true;
 		})());
 	}
 }());

 // ��չɾ������Ԫ�ط���
 Array.prototype.remove = function(dx) {
 	if (isNaN(dx) || dx > this.length) {
 		return false;
 	}
 	for (var i = 0, n = 0; i < this.length; i++) {
 		if (this[i] != this[dx]) {
 			this[n++] = this[i];
 		}
 	}
 	this.length -= 1;
 }



 var cookieKeys = {
 	M_TOKEN: 'm1authorization',
 	M_USERNAME: 'm1_username',
 	M_USERINFO: 'm1_userinfo',
 	PAGE_TEMP_USER_ID: 'cookie_page_temp_user_id',
 	PAGE_TEMP_USER_KEY: 'cookie_page_temp_user_key',
  PAGE_USER_GUIDE_V2: 'page_user_guide_v2',               // �û���
  PAGE_TEMP_USER_GUIDE_V2: 'page_temp_user_guide_v2',     // ��ʱ�û���
 	M_JINSHUJU_ADD_ISOK: 'm1_jinshuju_add_isok',
 	M_JINSHUJU_ADD_ISCANCEL: 'm1_jinshuju_add_iscancel',
 	M_JINSHUJU_FORM_URL: 'm1_jinshuju_form_url',
 	M_JINSHUJU_SYNC_CONTACT: 'm1_jinshuju_sync_contact'
 }

 var storeKeys = {
 	PAGE_EDIT_BODY: 'm1_page_edit_body'
 }

 var intercomEvents = {
  CREATE_PAGE: '/PAGE/CREATED',
  PUBLISH_PAGE: '/PAGE/PUBLISHED',
  SHARE_PAGE: '/PAGE/SHARE',
  PAY_TEMPLATE: '/PAGE/USED PAY TEMPLATE',
  REMOVE_LOGO: '/PAGE/REMOVE LOGO',
  BIND_DOMAIN: '/PAGE/BIND DOMAIN',
  CLICK_SEO: '/PAGE/SEO SETTING',
  CLICK_CODE: '/PAGE/ADD THIRD CODE',
  IMAGE_SEARCH: '/PAGE/USED PAY IMAGES',
  IMAGE_ORDERS_SUBMIT: '/PAGE/USED IMAGES NOT PAY',
  IMAGE_ORDERS_PAY: '/PAGE/USED IMAGES PAID'
 };

 var config = {
 	token: (function() {
 		return $.cookie(cookieKeys.M_TOKEN);
 	}()),

  userInfo: (function(){
    var userInfo = $.cookie(cookieKeys.M_USERINFO);
    if(userInfo){
      userInfo = decodeURIComponent(userInfo);
      userInfo = JSON.parse(userInfo);
    }
    return userInfo;
  }()),

  permissions: (function(){
    var detail = '';
    var userInfo = $.cookie(cookieKeys.M_USERINFO);
    if(userInfo){
      userInfo = decodeURIComponent(userInfo);
      userInfo = JSON.parse(userInfo);
      detail = userInfo.userinfo.accounts[0].detail;
      if(detail){
        try{
          detail = JSON.parse(detail);
          if(typeof detail !== 'object') {
            detail = null
          }
        } catch(e) {
          detail = null;
        }
      }
    }
    return detail;
  }()),

  
 
  // official
 	domain: 'http://page.m1world.com/v2',
 	pageApi: 'http://pageapi.m1world.com',
 	m1Api: 'http://m1api.m1world.com',
  edmApi: 'http://edmapi.m1world.com',
 	m1Domain: 'http://www.m1world.com',
  edmDomain: 'http://edm.m1world.com',
 	imageLibDomain: 'http://www.m1world.com',
  pageDomain: 'http://page.m1world.com',
  defaultShareDomain: 'http://www.m1page.com',
  vipDomain: 'http://www.m1vip.cn',
  pageApps: '/apps',

 	libraryDomain: 'http://resource.m1world.com',
 	sectionPath: '/tpl/sections/',
 	layoutPath: '/tpl/layouts/',
 	itemPath: '/tpl/items/',
 	cookieDomain: '.m1world.com',
 	shareDomain: null,

  // ϵͳ�û�����״̬�ؼ���
  remindStateKeys: {
    PAGE_GUIDE_V2: 'PAGE_GUIDE_V2'  //page v2 �û���
  },

	msgOrigins: [
               'http://page.m1world.com'
               ,'http://edm.m1world.com'
               ,'http://contact.m1world.com'
               ,'http://www.m1world.com'
               ,'http://test.m1world.com'
               ,'http://metest.m1world.com'
             ],

  permissionsKey: {
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
    STAT: 'view_stat'
  }
 };

 var messageHandlers = {
    // M1ͼƬ��
    lib_image:{ 
      GROUP: 'm1-lib-img-group',              // ϵͳͼƬ��
      RET_SEL_IMG: 'm1-lib-img-ret-sel-img',   // ����ѡ�е�ͼƬ
      MAXIMIZE_DIALOG: 'm1-lib-img-maximize-dialog'  // �Ի������
    }
 }

// Ȩ�޿���
 var permissions = {
    page:{
      add: (function(){
        if(config.permissions && config.permissions.page){
          return config.permissions.page.add;   
        }
        return true;
      }()),
      edit: (function(){
        if(config.permissions && config.permissions.page){
          return config.permissions.page.edit; 
        }
        return true;
      }()),
      delete: (function(){
        if(config.permissions && config.permissions.page){
          return config.permissions.page.delete;      
        }
        return true;
      }()),
      view_stat: (function(){
        if(config.permissions && config.permissions.page){
          return config.permissions.page.view_stat;     
        }
        return true;
      }()),
    }
 }

 /*ͨ�ù���*/
 var util = {
 	/*
 	 *��֤�ֻ������Ƿ���ȷ
 	 *@param s ����֤�ֻ�����
 	 *return bool �Ƿ���ȷ true ��ȷ�� false ����ȷ
 	 */
 	isMobile: function(s) {
 		var reg = /^1[3456789]\d{9}$/;
 		return reg.test(s);
 	},

 	/*
 	 *��֤�����Ƿ���ȷ
 	 *@param s ����֤����
 	 *return bool �Ƿ���ȷ true ��ȷ�� false ����ȷ
 	 */
 	isEmail: function(s) {
 		var reg = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; //�����ʽ
 		return reg.test(s);
 	},

 	/*
 	 *��֤�Ƿ�������
 	 *@param s ����֤����
 	 *return bool �Ƿ���ȷ true ��ȷ�� false ����ȷ
 	 */
 	isNumber: function(s) {
 		var reg = /^[1-9]\d*$/; //ֻ����������
 		return reg.test(s);
 	},

 	/*
 	 *��֤�����Ƿ���ȷ
 	 *@param s ����֤����
 	 *return bool �Ƿ���ȷ true ��ȷ�� false ����ȷ
 	 */
 	isURL: function(s) {
 		var reg = /^[a-zA-z]+:\/\/[^\s]*$/; //������ַ��ʽ����ȷ
 		return reg.test(s);
 	},

 	/*
 	 *��ȡ�������ַ������
 	 *@param strParam Ҫ��ȡ�Ĳ���
 	 *@return ��ȡ��ֵ
 	 */
 	request: function(name) {
 		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
 		var r = window.location.search.substr(1).match(reg);
 		if (r != null) {
 			// return unescape(r[2]);
      return decodeURIComponent(r[2]);
 		}
 		return "";
 	},

 	/*
 	 *�жϵ�ǰ�������Ƿ�������ײ�
 	 *@param $this ����������
 	 *@param $body ����������������
 	 *@param space ����ײ��ľ��룬Ĭ��Ϊ0
 	 *return bool
 	 */
 	isScrollBottom: function($win, $body, space) {
 		space = space ? space : 0;
 		var scrollTop = $win.scrollTop();
 		var win_h = $win.height();
 		var body_h = $body.height();
 		if (scrollTop >= body_h - win_h - space) {
 			return true;
 		}
 		return false;
 	},

 	/*
 	 *�ж��Ƿ��ǿն���û�����ԵĶ���
 	 *@param o Ҫ�жϵĶ���
 	 *@return bool ��true ��Ϊ��false
 	 */
 	isEmptyObjedt: function(o) {
 		for (var n in o) {
 			return false;
 		}
 		return true;
 	},

  /**
   * ȥ���ַ�����HTML��ǩ     
   * @param  {String} str ��HTML���ַ���
   * @return {String}     ����HTML���ַ���
   */
  removeHtmlTag: function(str) {
    return str.replace(/<\/?[^>]*>/g,'');
  },

  /*
   *��������
   *@param func Ҫִ�е�function
   *@param wait ָ��xx ms��ִ��
   *@param immediate �Ƿ�����ִ��
   */
  debounce: function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate & !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },
  /**
   * ����url����Ĳ���
   * @param  {string} url ����url��ַ
   * @return {string}     �޲ε�ַ
   */
  removeUrlParam: function(url){
    var i = url.indexOf('?');
    return i >= 0 ? url.slice(0,i) : url;
  },

  /**
   * ���ݻ�ȡ��css����ͼƬ����ֵ�õ�ͼƬ��ַurl
   * @param  {string} bgImage css����ͼƬ����ֵ
   * @return {string}         ͼƬ��ַurl
   */
  getCssBgImageUrl: function(bgImage){
    bgImage = bgImage.replace(/["]/g,''); // ���ݴ��� 306 safari ��ȡ�Ĳ�������
    return bgImage.slice(4,bgImage.length - 1);
  },

  /**
   * ����ַ����httpЭ��
   * @param  {string} url ��ַ
   * @return {string}     ȷ��������httpЭ�����ַ
   */
  linkAddProtocol: function(url) {
    if(!['http://','https://','//'].some(function(v,i) {
      return url.trim().toLowerCase().indexOf(v) === 0;
    })){
      url = 'http://' + url;
    }
    return url;
  },

 	//��ʽ������С��10��0
 	completionDate: function(input) {
 		return input < 10 ? "0" + input : input;
 	},

 	/**
 	 *��ʽ������
 	 *@param timetamp ��������
 	 *@param split 	  �ָ���
 	 *@return ���ظ�ʽ���������ַ���
 	 */
 	formatDate: function(timestamp, split) {
 		split = split ? split : '-';
 		var date = new Date(parseInt(timestamp));
 		return this.getFormatDate(date, split);
 	},

 	/**
 	 *��ʽ������ʱ��
 	 *@param timetamp ��������
 	 *@param split 	  �ָ���
 	 *@return ���ظ�ʽ���������ַ���
 	 */
 	formatDateTime: function(timestamp, split) {
 		split = split ? split : '-';
 		var d = new Date(parseInt(timestamp));
 		return this.getFormatDateTime(d, split);
 	},

 	getFormatDate: function(newDate, split) {
 		split = split ? split : '-';
 		var year = newDate.getFullYear();
 		var month = newDate.getMonth();
 		var date = newDate.getDate();
 		var hour = newDate.getHours();
 		var minu = newDate.getMinutes();
 		var dateStr = year + split + this.completionDate(month + 1) + split + this.completionDate(date);
 		return dateStr
 	},

 	getFormatDateTime: function(newDate, split) {
 		split = split ? split : '-';
 		var year = newDate.getFullYear();
 		var month = newDate.getMonth();
 		var date = newDate.getDate();
 		var hour = newDate.getHours();
 		var minu = newDate.getMinutes();
 		var second = newDate.getSeconds();
 		var dateStr = year + split + this.completionDate(month + 1) + split + this.completionDate(date) + ' ' + this.completionDate(hour) + ':' + this.completionDate(minu) + ':' + this.completionDate(second);
 		return dateStr
 	},

 	getDateToday: function(split) {
 		split = split ? split : '-';
 		var date = new Date();
 		return this.getFormatDate(date, split);
 	},

 	getNow: function(split) {
 		split = split ? split : '-';
 		var date = new Date();
 		return this.getFormatDateTime(date, split);
 	},

 	//�õ���ǰʱ�����
 	getTimeToMilli: function() {
 		var d = new Date();
 		return d.getTime();
 	},

 	//�õ�ʱ���
 	getTimeStamp: function() {
 		var timestamp = new Date().getTime();
 		return timestamp;
 	},

 	//����ʱ����
 	getTimeSpan: function(startDate, endDate) {
 		var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
 		var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
 		var dates = Math.abs(startTime - endTime);
 		return dates;
 	},

 	//����������
 	getDateDiff: function(startDate, endDate) {
 		var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
 		var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
 		var dates = parseInt(Math.abs(startTime - endTime) / (1000 * 60 * 60 * 24));
 		return dates;
 	},

 	//����+��
 	addDays: function(d, n) {
 		var t = new Date(d); //���Ʋ������¶��󣬱���Ķ�ԭ����
 		t.setDate(t.getDate() + n);
 		return t;
 	},

 	//����+�¡��ն��գ���Ŀ���·ݲ����ڸ����ڣ�����Ϊ���һ��
 	addMonths: function(d, n) {
 		var t = new Date(d);
 		t.setMonth(t.getMonth() + n);
 		if (t.getDate() != d.getDate()) {
 			t.setDate(0);
 		}
 		return t;
 	},

 	//����+�ꡣ�¶����ն��գ���Ŀ�����²����ڸ����ڣ�����Ϊ���һ��
 	addYears: function(d, n) {
 		var t = new Date(d);
 		t.setFullYear(t.getFullYear() + n);
 		if (t.getDate() != d.getDate()) {
 			t.setDate(0);
 		}
 		return t;
 	},

 	//��ñ����ȵĿ�ʼ�·�
 	getQuarterStartMonth: function() {
 		var now = new Date(); //��ǰ����
 		var nowMonth = now.getMonth(); //��ǰ��ֵ��1��=0��12��=11��
 		if (nowMonth <= 2) {
 			return 0;
 		} else if (nowMonth <= 5) {
 			return 3;
 		} else if (nowMonth <= 8) {
 			return 6;
 		} else {
 			return 9;
 		}
 	},

 	//��ȡ����һ
 	getWeekStartDate: function() {
 		var now = new Date(); //��ǰ����
 		var nowDayOfWeek = (now.getDay() == 0) ? 7 : now.getDay() - 1; //�����Ǳ��ܵĵڼ��졣��һ=0������=6
 		return this.AddDays(now, -nowDayOfWeek);
 	},

 	//���ա�����һ+6��
 	getWeekEndDate: function() {
 		return this.AddDays(this.getWeekStartDate(), 6);
 	},

 	//��ȡ�³���һ��
 	getMonthStartDate: function() {
 		var now = new Date(); //��ǰ����
 		var nowMonth = now.getMonth(); //��ǰ��ֵ��1��=0��12��=11��
 		var nowYear = now.getFullYear();
 		return new Date(nowYear, nowMonth, 1);
 	},

 	//��ĩ�����³�-1��
 	getMonthEndDate: function() {
 		return this.AddDays(this.AddMonths(this.getMonthStartDate(), 1), -1);
 	},

 	//���ȳ�
 	getQuarterStartDate: function() {
 		var now = new Date(); //��ǰ����
 		var nowYear = now.getFullYear();
 		return new Date(nowYear, this.getQuarterStartMonth(), 1);
 	},

 	//����ĩ���¼���-1��
 	getQuarterEndDate: function() {
 		return this.AddDays(this.AddMonths(this.getQuarterStartDate(), 3), -1);
 	},

 	//�жϵ�ǰҳ���Ƿ�����ĳ��js��css�ļ�
 	isInclude: function(name) {
 		var js = /js$/i.test(name);
 		var es = document.getElementsByTagName(js ? 'script' : 'link');
 		for (var i = 0; i < es.length; i++) {
 			if (es[i][js ? 'src' : 'href'].indexOf(name) != -1) return true;
 		}
 		return false;
 	},

  /**
   * ��̬�����ļ�
   * @param  {string} url  ����
   * @param  {string} type �ļ����� css �� js Ĭ��js
   * @return {node}      ��ӵ��ļ��ڵ� script �� link
   */
  includeFile: function(url,type) {
    if(type === 'css'){
      var link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      return link;
    }else{
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      document.head.appendChild(script);
      return script;
    }
  },

  /**
   * ���¶�λê����
   * @param  {string} anchor Ҫ��λ��ê PS��#section
   */
  resetAnchor: function(anchor) {
    var hash = anchor || location.hash;
    if(hash){
      location.href = hash;
    }
  },

 	/*RGB��ɫת��Ϊ16����*/
 	colorHex: function(that) {
 		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
 		if (/^(rgb|RGB)/.test(that)) {
 			var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
 			var strHex = "#";
 			for (var i = 0; i < aColor.length; i++) {
 				var hex = Number(aColor[i]).toString(16);
 				if (hex === "0") {
 					hex += hex;
 				}
 				strHex += hex;
 			}
 			if (strHex.length !== 7) {
 				strHex = that;
 			}
 			return strHex;
 		} else if (reg.test(that)) {
 			var aNum = that.replace(/#/, "").split("");
 			if (aNum.length === 6) {
 				return that;
 			} else if (aNum.length === 3) {
 				var numHex = "#";
 				for (var i = 0; i < aNum.length; i += 1) {
 					numHex += (aNum[i] + aNum[i]);
 				}
 				return numHex;
 			}
 		} else {
 			return that;
 		}
 	},

 	/*16������ɫתΪRGB��ʽ
 	 *@param hex 16������ɫ ���磺#FF0000
 	 *@param alpha ͸���� 0~1֮��
 	 *@return rgba��ɫ
 	 */
 	hexToRgba: function(hex, alpha) {
 		var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
 		var sColor = hex.toLowerCase();
 		if (sColor && reg.test(sColor)) {
 			if (sColor.length === 4) {
 				var sColorNew = "#";
 				for (var i = 1; i < 4; i += 1) {
 					sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
 				}
 				sColor = sColorNew;
 			}
 			//������λ����ɫֵ
 			var sColorChange = [];
 			for (var i = 1; i < 7; i += 2) {
 				sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
 			}
 			if (typeof Number(alpha)) {
 				return "RGBA(" + sColorChange.join(",") + ',' + alpha + ")";
 			} else {
 				return "RGB(" + sColorChange.join(",") + ")";
 			}
 		} else {
 			return sColor;
 		}
 	},
  /**
   * ���ݵ�ǰdom��ȡ�õ���ţ����ͼimageView2
   * @param  {jQuery DOM} $self jquery�ڵ�
   * @return {string}       imageView2����,�� ?imageView2/2/w/1920
   */
  getImageView: function($self){
    var $content,imgSize;
      var maxW,maxH,model,imageView = '';
      var imgW,imgH;
      var imageSizes = { 
        imageSize: {
            sw: 640,
            mw: 768,
            lw: 1024
        },
        bgImageSize: {
            sw: 1080,
            mw: 1200,
            lw: 1920
        }
      }
      if($self.is('img')){
          $content = $self.closest('.m-component-content');
          imgSize = imageSizes.imageSize;
          imgW = $self.attr('data-width') || 0;
          imgH = $self.attr('data-height') || 0;
      }else{
          $content = $self;
          imgSize = imageSizes.bgImageSize;
      }
      switch(util.getTerminal()){
          case 'mb':
              maxW = $content.attr('img-sw') || imgSize.sw;
              maxH = $content.attr('img-sh');
              break;
          case 'ipad':
              maxW = $content.attr('img-mw') || imgSize.mw;
              maxH = $content.attr('img-mh');
              break;
          case 'pc':
              maxW = $content.attr('img-lw') || imgSize.lw;
              maxH = $content.attr('img-lh');
              break;
      }
      
      model = $content.attr('img-model');

      if(maxW || maxH){
          imageView = '?imageView2';
          imageView += model ? ('/' + model) : '/2';
          imageView += maxW ? ('/w/' + maxW) : '';
          imageView += maxH ? ('/h/' + maxH) : '';
      }
      return imageView;
  },

  /**
   * �жϵ�ǰ����ƽ̨
   * @return {string} ��ǰƽ̨ mb�ƶ��ˣ�ipad iPad��pc ���Զ�
   */
  getTerminal: function(){
      var result = '';
      if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
          if (window.location.href.indexOf("?mobile") < 0) {
              try {
                  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                      // �жϷ��ʻ����� Android|webOS|iPhone|iPod|BlackBerry �����������ʽ 
                      result = 'mb';
                  } else if (/iPad/i.test(navigator.userAgent)) {
                      // �жϷ��ʻ����� iPad �����������ʽ 
                      result = 'ipad';
                  } else {
                      // �жϷ��ʻ����� �����ƶ��豸 �����������ʽ 
                      result = 'pc';
                  }
              } catch (e) {}
          }
      } else {
          // ������϶����ǣ������������ʽ 
           result = 'pc';
      }
      return result;
  },

 	create_qrcode: function(text) {
 		var $wechatBanner = $('<div id="wechat_banner">\
						    <div style="background:rgba(0,0,0,0.5); position:fixed; top:0; left:0; width:100%; height:100%; z-idnex:9999;"></div>\
						    <div style="position: fixed;top: 30%;left: 0; right:0; margin-left:auto; margin-right:auto; width:200px; z-index:9999;background-color:#fff;padding:20px 40px;border:solid 1px #eee; box-shadow:0 0 10px #666;">\
						        <div style="line-height:32px;"><strong style="font-size: 20px;">����΢������Ȧ</strong></div>\
						        <div id="wechat_qr" style="text-align:center; margin:10px 0;"></div>\
						        <div>��΢�ţ�����ײ��ġ����֡���<br />\
						        ʹ�á�ɨһɨ�����ɽ���ҳ����������Ȧ��</div>\
						        <span class="wxqr-close" style="position:absolute; top:0; right:0; display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; font-size:18px; cursor:pointer;">��</span>\
						    </div>\
						</div>');
 		var $wxqr = $wechatBanner.find('#wechat_qr');
 		var $btnClose = $wechatBanner.find('.wxqr-close');

 		$("body").append($wechatBanner);
 		var qrcode = new QRCode($wxqr[0], {
 			width: 200, //���ÿ��
 			height: 200
 		});
 		qrcode.makeCode(text);
 		$wxqr.find("img").css({
 			'margin-left': 'auto',
 			'margin-right': 'auto'
 		});

 		$btnClose.click(function(event) {
 			$wechatBanner.remove();
 		});
 	},

  loadScript: (function() {
    var loadOneScript = function(url) {
      var dtd = $.Deferred();
      var scriptNode = document.createElement('script');
      scriptNode.type = 'text/javascript';
      var onload = function() {
        dtd.resolve();
      };
      $(scriptNode).bind('load',onload).bind('readystatechange', function() {
        if(node.readyState === 'onload') {
          onload();
        }
      });
      document.querySelector('head').appendChild(scriptNode);
      scriptNode.src = url;
      return dtd.promise();
    };

    var load = function(urls) {
      if(!$.isArray(urls)){
        return load([urls]);
      }
      var ret = [];
      for(var i = 0; i < urls.length; i++){
        ret[i] = loadOneScript(urls[i]);
      };
      return $.when.apply($, ret);
    }

    return {load: load};
  }())


 }; //end util


 //���ش洢����
 var store = {
 	//��ȡ���ش洢�ĸ���
 	length: localStorage.length,
 	//��ȡֵ
 	get: function(key) {
 		return localStorage.getItem(key);
 	},
 	//����ֵ
 	set: function(key, value) {
 		localStorage.setItem(key, value);
 	},
 	//ɾ��ָ��key��ֵ
 	remove: function(key) {
 		localStorage.removeItem(key);
 	},
 	//��ȡ���ش洢��keyֵ
 	key: function(n) {
 		return localStorage.key(n);
 	},
 	//�������д洢
 	clear: function() {
 		localStorage.clear();
 	}
 };

 var eventHandler = {
 	/*
 	 * ����¼���������
 	 * obj        Ҫ��Ӽ����Ķ����Ԫ��
 	 * eventName  �¼���
 	 * fun        ��������������
 	 * param      �������������Ĳ���������ʹ���һ������
 	 */
 	add: function(obj, eventName, fun, param) {
 		var fn = fun;
 		if (param) {
 			fn = function(e) {
 				fun.call(this, param); //�̳м�������,����������Գ�ʼ��;
 			}
 		}
 		if (obj.attachEvent) {
 			obj.attachEvent('on' + eventName, fn);
 		} else if (obj.addEventListener) {
 			obj.addEventListener(eventName, fn, false);
 		} else {
 			obj["on" + eventName] = fn;
 		}
 	},

 	/*
 	 * ɾ���¼���������
 	 * obj        Ҫ��Ӽ����Ķ����Ԫ��
 	 * eventName  �¼���
 	 * fun         ��������������
 	 */
 	remove: function(obj, eventName, fun) {
 		if (obj.removeEventListener) {
 			obj.removeEventListener(eventName, fun, false);
 		} else if (obj.detachEvent) {
 			obj.detachEvent("on" + eventName, fun);
 		} else {
 			delete obj["on" + eventName];
 		}
 	}
 };

 var message = {
 	loadingIndex: null,
 	//��Ϣ��ʾ��
 	alert: function(msg, time, style) {
 		time = time || 2;
 		style = style || 'background-color:rgba(0,0,0,0.5); color:#fff; border:none;'
 		layer.open({
 			content: msg,
 			style: style,
 			time: time,
 			shade: false
 		});
 	},
 	//��Ϣ��
 	info: function(msg, fn) {
 		var i = layer.open({
 			content: msg,
 			btn: ['OK'],
 			yes: function() {
 				if (fn) {
 					fn();
 				}
        layer.close(i);
 			}
 		});
 	},
 	//ȷ�Ͽ�
 	confirm: function(msg, y, n) {
 		var i = layer.open({
 			content: msg,
 			btn: ['ȷ��', 'ȡ��'],
 			shadeClose: false,
 			yes: function() {
 				if (y) {
 					y();
 				}
        layer.close(i);
 			},
 			no: n
 		});
 	},
 	//���ز�
 	loading: function() {
 		message.closeLoading(message.loadingIndex);
 		message.loadingIndex = layer.open({
 			type: 2,
 			shade: false
 		});
 	},
 	//�رռ��ز�
 	closeLoading: function() {
 		layer.close(message.loadingIndex);
 	}
 }


 var M = {
 	//����Ƿ��¼
 	isLogin: function() {
 		var login = false;
 		if ($.cookie(cookieKeys.M_TOKEN)) {
 			login = true;
 		}
 		return login;
 	},

 	getAccountJson: function() {
 		var userinfo = $.cookie(cookieKeys.M_USERINFO);
 		var userinfoStr, userinfoJson;
 		if (userinfo) {
 			userinfoStr = decodeURIComponent(userinfo);
 			userinfoJson = JSON.parse(userinfoStr);
 		}
 		return userinfoJson;
 	},

 	getAccountVersion: function() {
 		var version = -1;
 		var userinfoJson = this.getAccountJson();
 		if (userinfoJson) {
 			version = userinfoJson.userinfo.accounts[0].version;
 		}
 		return version;
 	},

  getVersionName: function(version){
    var v = version || M.getAccountVersion();
    var versionNames = {
      1: '��Ѱ�',
      4: '��׼��',
      2: '�ƽ��',
      3: '��ʯ��'
    };
    return versionNames[v] || '';
  },

 	isPayVersion: function() {
 		var isPay = false;
 		var v = M.getAccountVersion();
 		if (v === 2 || v === 3 || v == 4) {
 			isPay = true;
 		}
 		return isPay;
 	},
  // �Ƿ�����LOGO
  isHideLogo: function(){
    var hide = false;
    var userinfoJson = this.getAccountJson();
    if (userinfoJson) {
      hide = userinfoJson.userinfo.accounts[0].hideLogo;
    }
    return hide;
  },

 	// �����˻���ȫ���й��˻���Ϣ��cookie
 	removeAccountCookies: function() {
 		var d = {
 			path: '/',
 			domain: config.cookieDomain
 		};
 		$.removeCookie(cookieKeys.M_TOKEN, d);
 		$.removeCookie(cookieKeys.M_USERINFO, d);
 		$.removeCookie(cookieKeys.M_USERINFO, d);
 	},

 	// ���Token�Ƿ���ڣ���˷���
 	checkTokenValid: function(data) {
 		if (!data.success && data.data === 'Invalid token value') {
 			M.removeAccountCookies();
 			location.href = 'http://www.m1world.com/login.html?c=' + location.href;
 			return;
 		}
 	},

   /*����û���page����Ȩ�ޣ�����ʾ
   *@param key string ����Ĳ���Ȩ������
   *@return bool falseû��Ȩ�� true��Ȩ��
   */
  checkPermission: function(key){
    var msg, hasPermission = true;
    if(config.userInfo && config.userInfo.userinfo.accounts[0].type === 1) {
      switch(key){
        case config.permissionsKey.ADD:
          msg = '��ǰ�û�û���½�Ȩ�ޣ�';
          hasPermission = permissions.page.add
          break;
        case config.permissionsKey.EDIT:
          msg = '��ǰ�û�û�б༭Ȩ�ޣ�';
          hasPermission = permissions.page.edit;
          break;
        case config.permissionsKey.DELETE:
          msg = '��ǰ�û�û��ɾ��Ȩ�ޣ�';
          hasPermission = permissions.page.delete;
          break;
        case config.permissionsKey.STAT:
          msg = '��ǰ�û�û�в鿴ͳ��Ȩ�ޣ�';
          hasPermission = permissions.page.view_stat;
          break;
      }
      if(!hasPermission){
        message.alert(msg);
      }
    }
    return hasPermission;
  },

  /*
  *����Ƿ��и߼�ģ��Ȩ��
  *@param name string ���� ģ���� 
  *@return bool �Ǳ��� false ��Ȩ�� true ��Ȩ��
  */
  checkPayModulePermission: function(name,version){
    if(!M.isPayModule(name)){
      return true;
    }
    var modulePermission = {
      // free
      1: ['contact-us'],
      // gold
      2: ['slider','circle','contact-us'],
      // diamond
      3: ['slider','circle','contact-us'],
      // base
      4: ['contact-us']
    },
    v = version || M.getAccountVersion();

    if(v === -1){ return false; }

    return modulePermission[v].indexOf(name) >= 0;
  },

  /**
   * �жϵ�ǰģ���Ƿ��Ǹ���������ģ��
   * @param  {string}  name [��ǰģ����]
   * @return {Boolean}      true �Ǹ��ѣ�false���Ǹ���
   */
  isPayModule: function(name) {
    var payModules = ['slider','circle','contact-us'];
    return payModules.indexOf(name) >= 0;
  },
  /*
  *����ģ������ȡģ���ʹ�õİ汾��
  *@param name string ģ����
  *@param int �汾��
  */
  getPayModuleVersion: function(name){
    var v = -1;
      if(M.checkPayModulePermission(name,4)){
        v = 4;
      }else if(M.checkPayModulePermission(name,2)){
        v = 2;
      }else if(M.checkPayModulePermission(name,3)){
        v = 3;
      }
      return v;
  },

  /*
  *����ģ������ģ��汾�ŷ��ذ汾����
  *@param arguments[0] string ģ���� or int ģ��汾��
  *@return array ���Ѱ汾������
  **/
  getPayModuleVersionNames: function(){
    var v = typeof arguments[0] === 'number' ? arguments[0] : M.getPayModuleVersion(arguments[0]);
    var moduleVersionName = {
      4: ['��׼��','�ƽ��','��ʯ��'],
      2: ['�ƽ��','��ʯ��'],
      3: ['��ʯ��']
    }
    return moduleVersionName[v] || [];
  },
  /*
  *���ݵ�ǰ�˻��汾�ŷ��ظ���ģ��汾����
  *@return array ���Ѱ汾������
  **/
  getCurrPayModuleVersionNames: function(){
    var v = M.getAccountVersion();
    var vName = {
      1: ['��׼��','�ƽ��','��ʯ��'],
      4: ['�ƽ��','��ʯ��'],
      2: ['��ʯ��']
    };
    return vName[v] || [];
  },
  /**
   * �����滻ģ��������
   * @param  {string} data ��Ҫ�滻��ģ���ַ���
   * @return {string}      �滻���ģ���ַ���
   */
  templateReplace: function(data){
    var result = data.replace(new RegExp('{libraryDomain}','gm'),config.libraryDomain);
    return result;
  },

 	// ��ͨajax����
 	ajaxJson: function(url, method, param, callback, async) {
 		async = async = undefined ? true : async;
 		$.ajax({
 				url: url,
 				type: method,
 				dataType: 'json',
 				async: async,
 				data: param
 			})
 			.done(function(data) {
 				M.checkTokenValid(data);

 				callback(data);
 				// console.log("success");
 			})
 			.fail(function() {
 				// console.log("error");
 			})
 			.always(function() {
 				// console.log("complete");
 			});
 	},

 	// FormData Ajax����һ���ϴ��ļ�
 	ajaxFormData: function(url, param, callback, xhrFun) {
 		$.ajax({
 				url: url,
 				type: 'POST',
 				dataType: 'json',
 				data: param,
 				timeout: 9000000000,
 				cache: false,
 				contentType: false,
 				processData: false,
 				//success: callback,
 				xhr: xhrFun
 			})
 			.done(function(data) {
 				M.checkTokenValid(data);
 				callback(data);
 				// console.log("success FormData");
 			})
 			.fail(function() {
 				// console.log("error");
 			})
 			.always(function() {
 				// console.log("complete FormData");
 			});
 	},


 	getNavDockHeight: function() {
 		var win_w = $(window).width();
 		var $headerContenter = $('#header-container');
 		if ($headerContenter.hasClass('dock-top') && win_w > 710) {
 			head_h = $headerContenter.height();
 		} else {
 			head_h = 0;
 		}
 		return head_h;
 	},

 	plainTextHandler: function($module) {
 		if (!$module || !$module.hasClass('m-module-plain-text')) {
 			return;
 		}
 		var win_h = $(window).height();
 		var head_h = M.getNavDockHeight();
 		var paddingTop = parseInt($module.css('padding-top'));
 		var paddingBottom = parseInt($module.css('padding-bottom'));
 		var $topLeft = $module.find('.m-repeatable-item.topLeft');
 		var $topRight = $module.find('.m-repeatable-item.topRight');
 		var $bottomLeft = $module.find('.m-repeatable-item.bottomLeft');
 		var $bottomRight = $module.find('.m-repeatable-item.bottomRight');
 		var topLeft_h = ($topLeft.length > 0 && $topLeft.outerHeight()) || 0;
 		var topRight_h = ($topRight.length > 0 && $topRight.outerHeight()) || 0;
 		var bottomLeft_h = ($bottomLeft.length > 0 && $bottomLeft.outerHeight()) || 0;
 		var bottomRight_h = ($bottomRight.length > 0 && $bottomRight.outerHeight()) || 0;

 		var left_h = paddingTop + paddingBottom + topLeft_h + bottomLeft_h;
 		var right_h = paddingTop + paddingBottom + topRight_h + bottomRight_h;

 		var content_h = left_h > right_h ? left_h : right_h;
 		var min_height = 0;
 		if (content_h > win_h) {
 			min_height = content_h;
 		} else {
 			min_height = win_h;
 		}
 		if (win_h < 518) {
 			min_height = 518;
 			min_height -= head_h;
 		}
 		$module.css('min-height', min_height);
 	},

 	jinshujuHandler: function($module) {
 		if (!$module || !$module.hasClass('m-module-jinshuju')) {
 			return;
 		}
 		var win_h = $(window).height();
 		var head_h = M.getNavDockHeight();
 		var min_height = win_h - head_h;
 		$module.find('iframe').css('min-height', min_height + 'px');
 		$module.css('min-height', min_height);
 	},
  // �������ҷ���ģ����С�߶Ȱ�����ߵ���һ���߶�Ϊ׼
  perpsHandler: function($module){
    var $perspBg = $module.find('.m-persp-bg');
    var $perspContent = $perspBg.siblings('.m-persp-content');
    if($perspContent.length === 0){
      return;
    }else{
      function resetHeight(){
        $perspContent.css({'min-height': ''});
        var bgHeight = $perspBg.children('.m-persp-container').outerHeight();
        var contentHeight = $perspContent.outerHeight();
        var win_w = $(window).width();
        if(win_w>= 908 && bgHeight > contentHeight){
          $perspContent.css({'min-height': bgHeight + 'px'});
        }
      }
      if(!$module.data('module-input-event-handle')){
        $module.data('module-input-event-handle', '1');
        $perspBg.on('input propertychange', util.debounce(function(event) {
          resetHeight();
        },500));
      }
      resetHeight();
    }

  },

 	moduleHandler: function($module,moduleName) {
    switch(moduleName){
      case 'jinshuju':
        M.jinshujuHandler($module);
        break;
      case 'plain-text':
 		    M.plainTextHandler($module);
        break;
      case 'feature-listing':
      case 'content-columns':
      case 'gallery':
        M.perpsHandler($module);
        break;
    }
 		
 	},

  handleBigCatSettings: function() {
    if(BCSettings) {
      BCSettings.contact_info['custom-event-page_updated'] = "1"
      BCDA(BCSettings)
    }
  },
 };