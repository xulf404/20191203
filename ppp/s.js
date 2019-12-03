(function($){
var $window = $(window);
var $mContent,$slides,$navigator,$mNav,$mGallery;
var isScrollEvent = false;	//用来判断是否是滚动条触发事件
var pageSet = {
	isshowshare: true,
	isshowbar: true,
	onlypc: false
};
var commonFolter = config.pageDomain + '/v2/common'
var includeFileUrls = {
	fontawesome: 	{fileName: 'font-awesome.min.css', 			path: commonFolter + '/lib/font-awesome-4.3.0/css/font-awesome.min.css'} ,
	// 分享按钮&二维码
	mshare: 		{fileName: 'mshare.js', 					path: commonFolter + '/js/mshare.js'},
	qrcode: 		{fileName: 'qrcode.js', 					path: commonFolter + '/js/qrcode.js'},
	// 滑块
	swiperCss: 		{fileName: 'swiper.min.css', 				path: commonFolter + '/lib/swiper/css/swiper.min.css'},
	swiperJs: 		{fileName: 'swiper.min.js', 				path: commonFolter + '/lib/swiper/js/swiper.min.js'},
	// 相册
	pswpHtml: 		{fileName: 'pswp.html', 					path: commonFolter + '/tpl/base/pswp.html'},
	pswpCss: 		{fileName: 'photoswipe.css', 				path: commonFolter + '/lib/photoswipe/photoswipe.css'},
	pswpCssUI: 		{fileName: 'default-skin.css', 				path: commonFolter + '/lib/photoswipe/default-skin/default-skin.css'},
	pswpJs: 		{fileName: 'photoswipe.js', 				path: commonFolter + '/lib/photoswipe/photoswipe.js'},
	pswpJsUI: 		{fileName: 'photoswipe-ui-default.min.js', 	path: commonFolter + '/lib/photoswipe/photoswipe-ui-default.min.js'},
	// 环形
	radial: 		{fileName: 'radialIndicator.js', 			path: commonFolter + '/lib/radialIndicator.js'}
}

var scrollListener = function(){
	$window.scroll(util.debounce(function(event) {
		if(isScrollEvent) return;
		var win_h = $window.height();
		var scrollTop = $window.scrollTop()
		var $anchors = $slides.find('.section-anchor');
		$.each($anchors, function(index, el) {
			var $anchor = $(el);
			var currSectionTop = $anchor.offset().top;		// 当前模块位移
			var sectionHeight = $anchor.parent().height();  // 当前模块高度
			var sectionPosTop = currSectionTop - scrollTop; // 模块顶部在浏览器可视窗口的位置（模块顶部距离浏览器窗口顶部的绝对位置）

			if(index > 0 && ($anchors.eq(index-1).offset().top - scrollTop >= 0)){
				// 如果前一个模块顶部还在可视窗口内，则此模块不做处理
				return true;
			}

			if((sectionPosTop >= 0) && (sectionPosTop <= (win_h/2))
				|| (sectionPosTop < 0) && (sectionPosTop + sectionHeight >= win_h)){
				// 如果模块顶部在窗口可视区域上半部分位置 或者模块顶部和底部都在可视区域外（占据整个窗口） 选中此模块导航
				var sectionName = $anchor.parent().attr('data-section-name');
				setSectionNav(sectionName);
			} else {
				// 如果模块在窗口可视区域后半部分，则选中前一个模块导航
				var sectionName = $anchors.eq(index-1).parent().attr('data-section-name');
				setSectionNav(sectionName);
			}
		});
	},300));
}

function setSectionNav(sectionName) {
	isScrollEvent = true;
	$mNav.find('a[href="#'+ sectionName +'"]').addClass('selected').parent().siblings().children().removeClass('selected');

	var hash = window.location.hash;
	if(hash != '#'+sectionName){
		history.replaceState({url: location.href},'','#' + sectionName);
	}
	isScrollEvent = false;
}

var openPhotoSwipe = function(items, index) {
    //var pswpElement = document.querySelectorAll('.pswp')[0];
    var pswpElement = document.querySelector('.pswp');
    // build items array
    // var items = [
    //     {
    //         src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
    //         w: 964,
    //         h: 1024
    //     },
    //     {
    //         src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
    //         w: 1024,
    //         h: 683
    //     }
    // ];
    
    // define options (if needed)
    var options = {
             // history & focus options are disabled on CodePen        
        history: false,
        focus: false,
        index: index,
        
        showAnimationDuration: 300,
        hideAnimationDuration: 300
        
    };
    
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    // gallery.goTo(index);

    gallery.listen('close', function(event){
    	console.log('close gallery')
    });
};

function alert(msg) {
    /// <summary>覆盖系统alert，自动关闭</summary>
    /// <param name="alertMessage" type="String">要提示的文字</param>
    var $MaskAlert = $('<div id="MaskAlert" style="z-index:9999;letter-spacing: 2px;"></div>');
    var html = "";
    html += '<div class="alert alert-warning fade in" style=\"padding: 25px 20px;background-color: rgba(0, 0, 0, 0.5);position: fixed;top: 30%;left:0;right:0;margin-left:auto;margin-right:auto;z-index: 9999;border-radius: 4px;font-size: 20px;min-width: 250px;max-width:300px;text-align: center; color:#fff;\">';
    html += '<button type="button" class="btn-close" style="color:#fff; background-color:transparent; position:absolute; right:10px; cursor:pointer;">×</button>';
    html += '<span id="Alert_Message" >' + msg + '</span>';
    html += '</div>';
    $MaskAlert.html(html);
    $('body').append($MaskAlert);
    $MaskAlert.fadeIn(200);

    var temp;
    temp = setTimeout(function () {
        $MaskAlert.fadeOut(200, function(){
        	$MaskAlert.remove();
        });
    }, 2000);

    $MaskAlert.on('click', '.btn-close', function(event) {
    	$MaskAlert.fadeOut(100, function(){
    		$MaskAlert.remove();
    	});
    });
}


$.fn.formValidate = function(){
	var _areaData = [];
	var _fieldNames = ["full_name", "company", "job_title", "email", "mobile_phone", "work_phone", "city", "remark", "gender", "address", "birthday", "website", "fax", "country", "province", "postCode", "qq", "weibo", "weixin"];
	var _specialFields = ['full_name', 'email', 'mobile_phone', 'work_phone'];  // 特殊字段
	var _provinceData = [
		{id: 1, name: '北京市'},
		{id: 2, name: '天津市'},
		{id: 3, name: '河北省'},
		{id: 4, name: '山西省'},
		{id: 5, name: '内蒙古自治区'},
		{id: 6, name: '辽宁省'},
		{id: 7, name: '吉林省'},
		{id: 8, name: '黑龙江省'},
		{id: 9, name: '上海市'},
		{id: 10, name: '江苏省'},
		{id: 11, name: '浙江省'},
		{id: 12, name: '安徽省'},
		{id: 13, name: '福建省'},
		{id: 14, name: '江西省'},
		{id: 15, name: '山东省'},
		{id: 16, name: '河南省'},
		{id: 17, name: '湖北省'},
		{id: 18, name: '湖南省'},
		{id: 19, name: '广东省'},
		{id: 20, name: '广西壮族自治区'},
		{id: 21, name: '海南省'},
		{id: 22, name: '重庆市'},
		{id: 23, name: '四川省'},
		{id: 24, name: '贵州省'},
		{id: 25, name: '云南省'},
		{id: 26, name: '西藏自治区'},
		{id: 27, name: '陕西省'},
		{id: 28, name: '甘肃省'},
		{id: 29, name: '青海省'},
		{id: 30, name: '宁夏回族自治区'},
		{id: 31, name: '新疆维吾尔自治区'},
		{id: 32, name: '台湾省'},
		{id: 33, name: '香港特别行政区'},
		{id: 34, name: '澳门特别行政区'}
	];
	var _pageId = $('#page_id').val();
	var _pageTitle = $('title').text();
	/**
	 * 加载身份城市json数据
	 * @return {array} 身份城市json数据
	 */
	function loadAreaData(){
		var path = config.domain + '/config/area.json';
		$.getJSON(path, function(json){
			if(json){
				_areaData = json;
			}
		});
	}
	function getProvinceName(id){
		var provinceName = '';
		var provinceId = parseInt(id);
		if(provinceId){
			var province = _areaData.filter(function(v){
				return v.id === provinceId;
			});
			if(province){
				provinceName = province[0].name;
			}
		}
		return provinceName;
	}

	function getCityName(id){
		var cityName = '';
		var cityId = parseInt(id);
		if(cityId){
			var city = _areaData.filter(function(v) {
				return v.id === cityId;
			});
			if(city){
				cityName = city[0].name;
			}
		}
		return cityName;
	}

	function getProvinceList(json){
		var data = json || _areaData;
		return data.filter(function(v){
			return v.parentId === 0;
		});
	}

	function getCityList(provinceId){
		return _areaData.filter(function(v){
			return v.parentId === provinceId;
		});
	}

	function setProvinceToSelect(list, $province){
		list.forEach(function(v){
			$province.get(0).add(new Option(v.name, v.id));
		});
	}

	function setCityToSelect(list, $city){
		if(list.length > 0){
			$city.empty().append('<option value="">请选择'+ $city.attr('placeholder') +'</option>');
			list.forEach(function(v){
				$city.get(0).add(new Option(v.name, v.id));
			});
		}
	}
	/**
	 * 判断字段是否是特殊字段
	 * @param  {string}  fieldName 字段名
	 * @return {Boolean}           true 是特殊字段，false 不是特殊字段
	 */
	function isSpecialField(fieldName){
		return _specialFields.some(function(val, index){
			return val === fieldName.toLowerCase();
		});
	}
	/**
	 * 检测必填项
	 * @param  {DOM} $this 当前要检测的DOM
	 * @return {boolean}       true 为通过，false 未通过
	 */
	function checkRequired($this){
		var required = $this.attr('required');
		var fieldValue = $this.val().trim();
		var fieldKey = $this.attr('name').trim();
		if(required !== undefined && fieldValue.length === 0){
			alertMessage = ($this.get(0).nodeName === 'SELECT' ? '请选择' : '请填写') + $this.attr('placeholder');
			$this.addClass('m-input-error').focus();
			alert(alertMessage);
			return false;
		}else{
			$this.removeClass('m-input-error')
		}
		return true;
	}

	function checkName($name){
		if(!checkRequired($name)){
			return false;
		}
		return true;
	}
	// 检验邮箱
	function checkEmail($email){
		if(!checkRequired($email)){
			return false;
		}else{
			var email = $.trim($email.val());
			var holder = $email.attr('placeholder');
			if(email.length > 0 && !util.isEmail(email)){
				alert(holder + '格式不正确');
				$email.addClass('m-input-error').focus();
				return false;
			}else{
				$email.removeClass('m-input-error');			
			}
		}
		return true;
	}
	// 检验手机或座机任意一项
	function checkPhone($mobilePhone,$workPhone){
		if($mobilePhone.length > 0 && $workPhone.length > 0){
			var mobileHolder = $mobilePhone.attr('placeholder');
			var workHolder = $workPhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			var workPhone = $.trim($workPhone.val());
			if(mobilePhone.length == 0 && workPhone.length == 0){
				alert(mobileHolder + '或' + workHolder + ' 至少填写一项！');
				$mobilePhone.addClass('m-input-error').focus();
				$workPhone.addClass('m-input-error');
				return false;
			}else{
				$mobilePhone.removeClass('m-input-error');
				$workPhone.removeClass('m-input-error');
			}
			if(mobilePhone.length > 0 && !checkMobilePhone($mobilePhone)){
				return false;
			}
		}else if($mobilePhone.length > 0){		
			if(!checkMobilePhone($mobilePhone)){
				return false;
			}
		}else if($workPhone.length > 0){
			if(!checkMobilePhone($workPhone)){
				return false;
			}
		}
		return true;
	}
	// 检验手机号格式
	function checkMobilePhone($mobilePhone){
		if(!checkRequired($mobilePhone)){
			return false;
		}else{
			var mobileHolder = $mobilePhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			if(mobilePhone.length > 0 && !util.isMobile(mobilePhone)){
				alert(mobileHolder + '格式不正确!');
				$mobilePhone.addClass('m-input-error').focus();
				return false;
			}else{
				$mobilePhone.removeClass('m-input-error');
				// 是否验证手机验证码
				if($mobilePhone.attr('verify-code') !== undefined){
					var $phoneVerifyCode = $mobilePhone.closest('.m-email-form-small-fields-group').find('[name="verify_code_phone"]');
					if($phoneVerifyCode.length > 0) {
						return checkPhoneVerifyCode($phoneVerifyCode);
					}
				}
			}
		}
		return true;
	}
	// 检验手机验证码
	function checkPhoneVerifyCode($phoneVerifyCode){
		if($phoneVerifyCode.attr('verify-pass') !== 'success'){
			alert('手机验证码不正确!');
			return false;
		}
		return true;
	}

	function checkWorkPhone($workPhone){
		if(!checkRequired($workPhone)){
			return false;
		}
		return true;
	}

	function testMobilePhone($mobilePhone) {
		var mobilePhone = $mobilePhone.val().trim();
		if(!util.isMobile(mobilePhone)){
			$mobilePhone.addClass('m-input-error');
			return false;
		} else {
			$mobilePhone.removeClass('m-input-error');
		}
		return true;
	}

	function testEmail($email) {
		var email = $email.val().trim();
		if(!util.isEmail(email)) {
			$email.addClass('m-input-error');
			return false;
		} else {
			$email.removeClass('m-input-error');
			return true;
		}
	}

	function checkSubmit($section){
		var $nameFields = $section.find('.m-email-form-small-fields-group').children('.m-name-field').children(); // 获取所有字段html标签
		var $requiredFields = $nameFields.filter('[required]');	
		// console.log('required count:',$requiredFields.length);
		if($requiredFields.length === 0){
			// 如果是早期版page没有required属性，则按早期默认验证规则处理
			return checkFieldsValidate_noRequired($section);
		}else{
			if(!checkFieldsValidate($nameFields)){
				// 字段验证失败 退出
				return false;
			}
			var $remark = $section.find('textarea[name=remark]');
			// 处理备注验证
			if($remark.length > 0){
				if(!checkRequired($remark)){
					return false;  
				}
			}
		}
		return true;
	}

	// 处理普通属性验证
	function checkFieldsValidate($nameFields){
		var isValidate = true;
		$.each($nameFields, function(index, val) {
			var $this = $(this);
			var fieldKey = $this.attr('name').trim();
			if(!isSpecialField(fieldKey)){ 
				// 非特殊字段处理
				isValidate = checkRequired($this);
			}else{   
				// 特殊字段处理
				switch(fieldKey){
					case 'full_name':
						isValidate = checkName($this);
						break;
					case 'email':
						isValidate = checkEmail($this);
						break;
					case 'mobile_phone':
						isValidate = checkMobilePhone($this);
						break;
					case 'work_phone':
						isValidate = checkWorkPhone($this);
						break;
				}
			}
			if(!isValidate){
				return false;   // 退出循环
			}
		});
		return isValidate;
	}

	// 处理早期版page的form验证，没有required属性的情况下默认处理
	function checkFieldsValidate_noRequired($section){
		var $name = $section.find('input[name=full_name]');
		var $email = $section.find('input[name=email]');
		var $mobilePhone = $section.find('input[name=mobile_phone]');	// 手机
		var $workPhone = $section.find('input[name=work_phone]');		// 电话

		if($name.length > 0){
			var name = $.trim($name.val());
			if(name.length == 0){
				alert('请输入' + $name.attr('placeholder'));
				$name.addClass('m-input-error');
				$name.focus();
				return false;
			}else{
				$name.removeClass('m-input-error');
			}
		}
		if($email.length > 0){
			var email = $.trim($email.val());
			var holder = $email.attr('placeholder');
			if(email.length == 0){
				alert('请输入' + holder);
				$email.addClass('m-input-error');
				$email.focus();
				return false;
			}else if(!util.isEmail(email)){
				alert(holder + '格式不正确');
				$email.addClass('m-input-error');
				$email.focus();
				return false;
			}else{
				$email.removeClass('m-input-error');					
			}
		}

		if($mobilePhone.length > 0 && $workPhone.length > 0){
			var mobileHolder = $mobilePhone.attr('placeholder');
			var workHolder = $workPhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			var workPhone = $.trim($workPhone.val());
			if(mobilePhone.length == 0 && workPhone.length == 0){
				alert(mobileHolder + '或' + workHolder + ' 至少填写一项！');
				$mobilePhone.addClass('m-input-error');
				$workPhone.addClass('m-input-error');
				$mobilePhone.focus();
				return false;
			}
		}else if($mobilePhone.length > 0){
			var mobileHolder = $mobilePhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			if(mobilePhone.length == 0){
				alert('请填写'+ mobileHolder +'!');
				$mobilePhone.addClass('m-input-error');
				$mobilePhone.focus();
				return false;
			}else if(!util.isMobile(mobilePhone)){
				alert(mobileHolder + '格式不正确!');
				$mobilePhone.addClass('m-input-error');
				$mobilePhone.focus();
				return false;
			}
		}else if($workPhone.length > 0){
			var workHolder = $workPhone.attr('placeholder');
			var workPhone = $.trim($workPhone.val());
			if(workPhone.length == 0){
				alert('请填写'+ workHolder +'!');
				$workPhone.addClass('m-input-error');
				$workPhone.focus();
				return false;
			}
		}
		return true;
	}

	// 判断获取子来源
	function getSubResource() {
		var subResourceKeys = [{name: 'utm', keys: ['utm_source','utm_medium','utm_term','utm_content','utm_campaign']}]
		var subResourceData = [];
		subResourceKeys.forEach(function(source,i) {
			var subItem = {}
			if(source.name === 'utm') {
				var utmSourceValue = util.request('utm_source');
				var utmMediumValue = util.request('utm_medium');
				if(utmSourceValue || utmMediumValue) {
					var subItemArr = [];
					utmSourceValue && subItemArr.push(utmSourceValue);
					utmMediumValue && subItemArr.push(utmMediumValue);
					subItem = getSubItem(source.keys);
					subItem.name = subItemArr.join('|');
					subResourceData.push(subItem);
				}
			} else {
				subItem = getSubItem(source.keys);
				if(subItem.detail !== {}) {
					subResourceData.push(subItem);
				}
			}
		});

		function getSubItem(keys) {
			var subResourceItem = {};
			var name, detail = {};
			keys.forEach(function(key, i) {
				if(!name) {
					// 默认第一个字段作为名字
					subResourceItem.name = util.request(key)
				}
				detail[key] = util.request(key);
			});
			if(detail !== {}) {
				subResourceItem.detail = JSON.stringify(detail);
			}

			return subResourceItem;
		}

		return subResourceData.length > 0 ? JSON.stringify(subResourceData) : '';
	}

	function getFieldsJson($section){
		var fields = {};
		var propertys = [];
		var $form = $section.closest('.m-form');
		var $nameFields = $section.find('.m-email-form-small-fields-group').children('.m-name-field').children(); // 获取所有字段html标签
		var $remark = $section.find('textarea[name=remark]');
		var $groupName = $section.find('input[name=group_name]');
		var subResourceStr = getSubResource(); // 获取子来源字符串
		var formId = $form.attr('data-formid');
		var code_phone,code_email;
		$.each($nameFields, function(index, val) {
			var $this = $(this);
			var fieldKey = $this.attr('name');
			var fieldValue = $.trim($this.val());
			 // console.log($this.val() + ' - ' + $this.attr('name'));
			 if(_areaData && _areaData.length > 0 && fieldKey === 'province'){
			 	fieldValue = getProvinceName(fieldValue);			 	
			 }else if(_areaData && _areaData.length > 0 && fieldKey === 'city'){
			 	if($this.get(0).nodeName === 'SELECT'){
			 		fieldValue = getCityName(fieldValue);
			 	}
			 }else if($this.get(0).nodeName == 'SELECT'){	
			 	// 下拉选择 需要传文本值而不是id
		 		if(fieldValue.length !== 0){
		 			fieldValue = $this.children(':selected').text();
		 		}
		 	}

			if(_fieldNames.indexOf(fieldKey) === -1){
				propertys.push({propertyId: fieldKey,label: fieldValue});
			}else{
				fields[fieldKey] = fieldValue;
			}


			if(fieldKey === 'mobile_phone' && $this.attr('verify-code') !== undefined) {
				code_phone = $.trim($section.find('input[name="verify_code_phone"]').val());
			}

			if(fieldKey === 'email' && $this.attr('verify-code') !== undefined) {
				code_email = $section.find('input[name="verify_code_email"]').val().trim();
			}

		});
		if(propertys.length > 0){
			fields.propertys = JSON.stringify(propertys);
		}

		if($remark.length > 0){
			var remark = $.trim($remark.val());
			fields.remark = remark;
		}
		fields.group_name = $groupName.val();

		if(subResourceStr.length > 0) {
			fields.sub_resource = subResourceStr;
		}

		if(formId) {
			fields.f_id = formId;
		}
		if(code_phone) {
			fields.code_phone = code_phone;
		}
		if(code_email) {
			fields.code_email = code_email;
		}
		return fields;
	}

	function postForm(fields,$content){
		var $submit = $content.find('.m-submit-field a.m-email-form-button')
		var url = config.pageApi + '/contact_form/submit';
		var param = fields;
		$submit.attr('disabled','disabled').html('<span>提交中...</span>');
		M.ajaxJson(url, 'POST', param, function(ret) {
		  if (ret.success) {
        if (param.p_id == '28308') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>提交成功</p>\
										<p>请点击下面链接地址下载<br /><a style=\"color:#06c;border-bottom:solid 1px #06c\" href=\"http://resource.m1world.com/2016%E4%BA%BF%E8%BE%BE%E8%BD%AF%E4%BB%B6%E6%96%B0%E5%9F%8E%E5%AE%A2%E6%88%B7%E5%A4%A7%E4%BC%9A%E8%B5%84%E6%96%99%E5%8C%85.zip\" target=\"_blank\">2016亿达软件新城客户大会资料包</a></p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '28672' || param.p_id == '29761' || param.p_id == '32758') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>提交成功</p>\
										<p>请点击下面链接地址下载<br /><a style=\"color:#06c;border-bottom:solid 1px #06c\" href=\"http://aed8e0ab16f8ba5b.share.mingdao.net/apps/kcshare/5857d416442bf21c080e6ee8\" target=\"_blank\">优秀邮件模板案例集锦-由M1云端市场部整理</a></p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '28857') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>Submitted successfully, thank you for your support！</p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '29750') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>Thank you for your submission！</p>\
										<p><br /><a style=\"color:#06c;border-bottom:solid 1px #06c;font-size: 22px;\" href=\"http://www.trig-talent.com/sites/default/files/TRIG_catalog_2017.pdf\" target=\"_blank\">Download</a></p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '30886') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>Submit successfully!</p>\
										<p>We will contact you soon!</p>\
									</div>\
								</div>');
        }
        else {

        	// ----此处是表单增强部分 以上均为临时----------
		  		var setting = ret.data;
    	  	var tips = '<p>提交成功</p><p>感谢您对我们的信赖与支持！</p>';
    	  	if(typeof setting === 'object') {
    	  		if(setting.isurl) {
    	  			// location.href = setting.content;
    	  			// 为解决安卓微信浏览localhost.href失效问题
    	  			var timeStamp = (new Date().getTime())
    	  			var paramTimeStamp = setting.content.indexOf('?') >= 0 ? ('&__t=' + timeStamp) : ('?__t=' + timeStamp);
    	  			var jumpUrl = setting.content + paramTimeStamp;
    	  			window.location.href = jumpUrl;

    	  			tips += '<p>没有跳转？ <a href="'+ jumpUrl +'">请点此处跳转</a></p>'
    	  		} else {
              tips = setting.content || tips;
    	  		}
          }
          $content.empty().append('<div class="m-form-submit-success">\
    						<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
    						<div class="m-form-submit-success-info">'+ tips +'</div>\
    					</div>');
          //------------------------------------------------
        }
		  	
			}else{
				$submit.removeAttr('disabled').html('<span>提交</span>');
			}
		});	
	}

	function postFormHandler(ret) {
	  if (ret.success) {
	  	var setting = ret.data;
	  	var tips = '<p>提交成功</p><p>感谢您对我们的信赖与支持！</p>';
	  	if(typeof setting === 'object') {
	  		if(setting.isurl) {
	  			if(setting.isblank) {
						var winOpen = window.open();
	  				winOpen.location = setting.content;
	  			} else {
	  				location.href = setting.content;
	  			}
	  		} else {
          tips = setting.content || tips;
	  		}
      }
      $content.empty().append('<div class="m-form-submit-success">\
						<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
						<div class="m-form-submit-success-info">'+ tips +'</div>\
					</div>');
		}else{
			$submit.removeAttr('disabled').html('<span>提交</span>');
		}
	}

	function setCodeBtnCountdown($btn) {
		var countdown = 60;
		$btn.prop('disabled', true);
		$btn.text( countdown + '秒后重新获取');
		var timer = setInterval(function(){
			if(--countdown >= 0) {
				$btn.text(countdown + '秒后重新获取');
			} else {
				$btn.text('点击获取验证码');
				countdown = 60;
				$btn.prop('disabled', false);
				clearInterval(timer);
			}
		},1000);
	}

	// 发送手机验证码
	function postPhoneVerifyCode(phone,formId,fn) {
		var url = config.pageApi + '/contact_form/verify_code';
		var param = {
			phone: phone,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'POST', param, fn);
	}

	// 获取校验手机验证码
	function postCheckPhoneVerifyCode(code_phone, formId, fn) {
		var url = config.pageApi + '/contact_form/verify_code/check';
		var param = {
			code_phone: code_phone,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'GET', param, fn);
	}

	// 发送邮箱验证码
	function postEmailVerifyCode(email,formId,fn) {
		var url = config.pageApi + '/contact_form/verify_code';
		var param = {
			email: email,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'POST', param, fn);
	}

	// 获取校验邮箱验证码
	function postCheckEmailVerifyCode(code_email, formId, fn) {
		var url = config.pageApi + '/contact_form/verify_code/check';
		var param = {
			code_email: code_email,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'GET', param, fn);
	}

	// 组合一个验证码DOM
	function getFieldVerifyCodeDom(option) {
		var $fieldVerify;
		var verifyHtml = '<input type="number" name="verify_code_'+ option.fieldKey +'" placeholder="'+ option.fieldPlaceholder +'">'
                        verifyHtml  +=     '<div class="verify-code-wrap">'
                        verifyHtml  +=      '<span class="verify-code-icon"></span>'
                        verifyHtml  +=      '<button class="verify-code-button btn-verify-code-'+ option.fieldKey +'">点击获取验证码</button>' 
                        verifyHtml  +=    '</div>'
		if(option.fieldIndex % 2 === 0) {
		  $fieldVerify = $('<section>' + verifyHtml + '</section>');
		} else {
		  $fieldVerify = $('<div>' + verifyHtml + '</div>');
		}
		return $fieldVerify.addClass('m-email-form-field m-name-field-wrap wow fadeInUp');
	}

	// 重置表单布局
	function resetFormLayoutType($inputsGroup) {
    var formLayoutType = 1;
    var fieldsCount = $inputsGroup.find('.m-email-form-small-fields-group div.m-email-form-field').length;
		$inputsGroup.removeClass('m-email-form-small-fields-1 m-email-form-small-fields-2  m-email-form-small-fields-3')
		if(fieldsCount === 1){
      formLayoutType = 1;
		}else{
			if(fieldsCount % 2 === 0){
        formLayoutType = 2;
			}else{
        formLayoutType = 3;
      }
    }
		$inputsGroup.addClass('m-email-form-small-fields-' + formLayoutType);
	}

	// 设置验证码状态
	function setVerifyCodeState($fieldCode,state) {
		var $codeInput = $fieldCode.find('input[name="verify_code_phone"]');
		var $codeIcon = $fieldCode.find('.verify-code-icon');
		$codeIcon.removeClass('success error loading');
		switch(state) {
			case 'success':
				$codeInput.attr('verify-pass','success');
				$codeIcon.addClass('success').html('<i class="fa fa-check-circle"></i>');
				break;
			case 'error':
				$codeInput.attr('verify-pass','error');
				$codeIcon.addClass('error').html('<i class="fa fa-times-circle"></i>');
				break;
			case 'loading':
				$codeInput.removeAttr('verify-pass');
				$codeIcon.addClass('loading').html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');
				break;
			default:
				$codeInput.removeAttr('verify-pass');
				$codeIcon.html('');
				break;
		}
	}

	// 短信验证码处理
	function phoneVerifyCodeHandler($form) {
		var $mobilePhone = $form.find('input[name=mobile_phone]');
		if($mobilePhone.attr('verify-code') === undefined) {
			return;
		}
		var isVerifyCodeSend = false;
		var formId = $form.attr('data-formid');
		var $inputsGroup = $form.find('.m-email-form-inputs-group');
		var $fieldsGroup = $inputsGroup.find('.m-email-form-small-fields-group');
		var fieldIndex = getFieldIndex($fieldsGroup, 'mobile_phone');
		var $fieldCode = getFieldVerifyCodeDom({
			fieldKey: 'phone',
			fieldPlaceholder: '请输入短信验证码',
			fieldIndex: fieldIndex + 1
		});

		// 将新建验证码字段插入表单
		$mobilePhone.parent().after($fieldCode);
		// 重置表单布局
		resetFormLayoutType($inputsGroup);

		var $phoneCodeInput = $fieldCode.find('input[name="verify_code_phone"]');
		var $phoneCodeBtn = $fieldCode.find('.btn-verify-code-phone');
		var $codeIcon = $fieldCode.find('.verify-code-icon');

		$phoneCodeBtn.click(function(event) {
			if(!testMobilePhone($mobilePhone)) {
				alert('请输入正确的手机号！');
				return;
			}
			var phone = $mobilePhone.val().trim();
			$phoneCodeBtn.prop('disabled', true);
			$phoneCodeBtn.text('验证码发送中...');
			postPhoneVerifyCode(phone, formId, function(ret) {
				if(ret.success) {
					setCodeBtnCountdown($phoneCodeBtn);
				}else{
					alert('验证码获取错误，请重新获取！');
					$phoneCodeBtn.prop('disabled', false);
					$phoneCodeBtn.text('点击获取验证码');
				}
			});
		});

		function checkAutoSendCode() {
			var code = $phoneCodeInput.val().trim();
			if(!/^[0-9]{4}$/.test(code)){
				setVerifyCodeState($fieldCode, 'error');
				return;
			}

			setVerifyCodeState($fieldCode, 'loading');
			postCheckPhoneVerifyCode(code, formId, function(ret) {
				if(ret.success) {
					setVerifyCodeState($fieldCode, 'success');
				} else {
					setVerifyCodeState($fieldCode, 'error');
					alert('验证码无效');
				}
			})
		}

		$phoneCodeInput.blur(function(event) {
			if(!isVerifyCodeSend) {
				checkAutoSendCode();
			}
		});

		var codeTimer
		$phoneCodeInput.on('input', function(event) {
			event.preventDefault();
			isVerifyCodeSend = false;
			clearTimeout(codeTimer)
			codeTimer = setTimeout(function() {
				var code = $phoneCodeInput.val().trim();
				if(code.length === 4) {
					isVerifyCodeSend = true;
					checkAutoSendCode();
				}
			}, 500);
		});
	}

	// 邮件验证码处理
	function emailVerifyCodeHandler($form) {
		var $email = $form.find('input[name=email]');
		if($email.attr('verify-code') === undefined) {
			return;
		}

		var formId = $form.attr('data-formid');
		var $inputsGroup = $form.find('.m-email-form-inputs-group');
		var $fieldsGroup = $inputsGroup.find('.m-email-form-small-fields-group');
		var fieldIndex = getFieldIndex($fieldsGroup, 'email');
		var $fieldCode = getFieldVerifyCodeDom({
			fieldKey: 'email',
			fieldPlaceholder: '请输入邮箱验证码',
			fieldIndex: fieldIndex + 1
		});
		// 将新建验证码字段插入表单
		$email.parent().after($fieldCode);
		// 重置表单布局
		resetFormLayoutType($inputsGroup);

		var $emailCodeInput = $form.find('input[name="verify_code_email"]');
		var $emailCodeBtn = $form.find('.btn-verify-code-email');
		var $codeIcon = $emailCodeBtn.parent().find('.verify-code-icon');

		$emailCodeBtn.click(function(event) {
			if(!testEmail($email)) {
				alert('请输入正确的邮箱！');
				return;
			}
			var email = $email.val().trim();
			$emailCodeBtn.prop('disabled', true);
			$emailCodeBtn.text('验证码发送中...');
			postEmailVerifyCode(email, formId, function(ret) {
				if(ret.success) {
					setCodeBtnCountdown($emailCodeBtn);
				}else{
					alert('验证码获取错误，请重新获取！');
					$emailCodeBtn.prop('disabled', false);
					$emailCodeBtn.text('点击获取验证码');
				}
			});
		});

		$emailCodeInput.blur(function(event) {
			var code = $emailCodeInput.val().trim();
			if(!/^[0-9]{4}$/.test(code)){
				setVerifyCodeState($fieldCode, 'error');
				return;
			}

			setVerifyCodeState($fieldCode, 'loading');
			postCheckEmailVerifyCode(code, formId, function(ret) {
				if(ret.success) {
					setVerifyCodeState($fieldCode, 'success');
				} else {
					setVerifyCodeState($fieldCode, 'error');
					alert('验证码无效');
				}
			})
		});
	}

	// 获取当前字段所在表单中的索引(不含额外字段,如section)
	function getFieldIndex($fieldsGroup, fieldName) {
		var fieldIndex = -1;
		$fieldsGroup.find('div.m-email-form-field').each(function(index, el) {
			if($(el).children('[name="'+ fieldName +'"]').length === 1) {
				fieldIndex = index;
				return false;
			}
		});
		return fieldIndex;
	}

	// 手机处理
	function phoneHandler($form) {
		var $mobilePhone = $form.find('input[name=mobile_phone]');
		if($mobilePhone.attr('verify-code') === undefined) {
			return;
		}

		function addVerifyCodePhone() {
			var $phoneCodeInput = $form.find('input[name="verify_code_phone"]');
			if($phoneCodeInput.length === 0){
				phoneVerifyCodeHandler($form);
			}
		}

		$mobilePhone.blur(function(event) {
			if(!testMobilePhone($mobilePhone)){
				return;
			}
			addVerifyCodePhone()
		});
		var phoneTimer;
		$mobilePhone.on('input', function(event) {
			event.preventDefault();
			clearTimeout(phoneTimer)
			phoneTimer = setTimeout(function() {
				var phone = $.trim($mobilePhone.val())
				if(phone.length === 11) {
					if(testMobilePhone($mobilePhone)){
						addVerifyCodePhone()
					}
				}
			})
		});
	}

	// 邮箱处理
	function emailHandler($form) {
		var $email = $form.find('input[name=email]');
		if($email.attr('verify-code') === undefined) {
			return;
		}

		$email.blur(function(event) {
			if(!testEmail($email)){
				return;
			}
			var $emailCodeInput = $form.find('input[name="verify_code_email"]');
			if($emailCodeInput.length === 0){
				emailVerifyCodeHandler($form);
			}
		});
	}

	return this.each(function(index, el) {
		var fields = {};
		var $me = $(el);
		var $content = $me.find('.m-component-content');
		var $fieldsGroup = $me.find('.m-email-form-small-fields-group');
		var $nameFields = $fieldsGroup.children('.m-name-field').children();   // 获取所有字段html标签
		var $name = $me.find('input[name=full_name]');
		var $email = $me.find('input[name=email]');
		var $job = $me.find('input[name=job_title]');
		var $company = $me.find('input[name=company]');
		var $mobilePhone = $me.find('input[name=mobile_phone]').attr('type','number');	// 改为数字类型
		var $workPhone = $me.find('input[name=work_phone]');		// 改为数字类型
		var $remark = $me.find('textarea[name=remark]');
		var $groupName = $me.find('input[name=group_name]');
		var $submit = $me.find('.m-submit-field a.m-email-form-button');
		var $selectCity = $me.find('select[name=city]');


		(function(){
			var $province = $content.find('select[name=province]');
			if($province.length > 0){
				setProvinceToSelect(_provinceData, $province);
			}
		})();

		$content.on('click', 'select[name=province]', function(event){
			if(_areaData.length === 0){
				loadAreaData();
			}
		}).on('change', 'select[name=province]', function(event) {
			var $this = $(this);
			if($selectCity.length > 0){
				var provinceId = parseInt($this.val());
				if(provinceId !== NaN){
					var citys = getCityList(provinceId);
					setCityToSelect(citys, $selectCity);
				}
			}
		});

		$submit.click(function(event) {
			if($submit.attr('disabled') == 'disabled') return; //防止重复提交

			//这部分为了预览页面用
			if(!_pageId){
				_pageId = util.request('p');
			}
			
			if(!_pageId){
				alert('参数错误');
				return false;
			}
			if(checkSubmit($content)){
				fields = getFieldsJson($content);
				fields.p_id = _pageId;
				fields.resource = _pageTitle + ' [' + _pageId + ']';
        setTimeout(function(){ // 延迟提交 防止按钮点击事件失效
				  postForm(fields, $content);
        },4)
			}
		});

		phoneHandler($me);
		emailHandler($me);
	});
}

function loadingFonts(){
	// 判断是否为移动端运行环境 
	if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
	    if (window.location.href.indexOf("?mobile") < 0) {
	        try {
	            //if(/Android/i.test(navigator.userAgent)) {
	                // 判断访问环境 Android 则加载以下样式 
	                 //setActiveStyleSheet("/common/css/fonts/web-font.css");
	            //}
	            /*if (!(/Android/i.test(navigator.userAgent))) {
	                // 判断访问环境非 Android 则加载以下样式 
	                 setActiveStyleSheet("/common/css/fonts/web-font.css");
	            }*/
	            /*if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
	                // 判断访问环境是 Android|webOS|iPhone|iPod|BlackBerry 则加载以下样式 
	                setActiveStyleSheet("style_mobile_a.css");
	            } else if (/iPad/i.test(navigator.userAgent)) {
	                // 判断访问环境是 iPad 则加载以下样式 
	                setActiveStyleSheet("style_mobile_iPad.css");
	            } else {
	                // 判断访问环境是 其他移动设备 则加载以下样式 
	                setActiveStyleSheet("style_mobile_other.css");
	            }*/
	        } catch (e) {}
	    }
	} else {
	    // 如果以上都不是，则加载以下样式 
	    //setActiveStyleSheet("/common/css/fonts/web-font.css");
	    //setActiveStyleSheet("common/css/fonts/editorfonts.css");
	}
	// 判断完毕后加载样式 
	function setActiveStyleSheet(filename) {
	    //document.write('<link href=' + filename + ' type="text/css" rel="stylesheet">');
	    var $link = $('<link/>');
	    $link.attr({
	    	type:'text/css',
	    	rel:'stylesheet',
	    	href: filename
	    });
	    $('head').append($link);
	}
}

function hideNavigator(){
	var win_w = $window.width();
	$navigator.hide();
	$slides.find('a.section-anchor').css('top', '');
	$slides.css('padding-top', '');
}

function showNavigator(){
	var win_w = $window.width();
	var navCount = $navigator.find('.m-nav').children().length;
	$navigator.css({display: ''});
	if(win_w > 737 && $navigator.hasClass('dock-top')){
		var nav_h = $navigator.height();
		var top_h = $slides.css('padding-top');
		if(nav_h != top_h){
			$slides.css('padding-top', nav_h)
			.find('a.section-anchor').css('top',- nav_h);
		}
	}else{
		$slides.css('padding-top', '')
		.find('a.section-anchor').css('top','');
	}
}

var setSectionAnchor = function(){
	var win_w = $window.width();
	var navCount = $navigator.find('.m-nav').children().length;
	if(navCount <= 1){
		hideNavigator();
	}else{
		if(pageSet.isshowbar){
			if(pageSet.onlypc && util.getTerminal() === 'mb'){
				hideNavigator();
			}else{
				showNavigator()
			}
		}else{
			hideNavigator();
		}
		
	}
}

var initWinResize = function(){
	setSectionAnchor();
	$window.resize(function(event) {
		setSectionAnchor();
	});
}

function initCircle(){
	var $circleGroups = $('.m-circle-group');
	$.each($circleGroups, function(index, el) {
		var $this = $(el);
		var circleOptions = $this.attr('data-circle-options');
		var circleJson = circleOptions ? JSON.parse(circleOptions) : {};
		var radius = circleJson.radius || 60;
		var barWidth = circleJson.barWidth || 10;
		var barColor = circleJson.barColor || '#348a3e';
	   	var barBgColor = circleJson.barBgColor || '#d0f2d0';
	   	var fontColor = circleJson.fontColor || '#090670';
	   	var percentage = circleJson.percentage == undefined ? true : circleJson.percentage;
	   	var minValue = circleJson.minValue || 0;
	   	var maxValue = circleJson.maxValue || 100;

	   	$.each($this.find('.circle-container'), function(index, el) {
	   		 var $circle = $(el);
	   		 var value = $circle.attr('data-circle-value') || 0;
	   		 var maxValue = 100; //如果是百分比显示，则最大值设为100
	   		 if(!percentage){	 //如果是纯数字显示，则最大值设为当前值
	   		 	maxValue = value;
	   		 }
	   		 $circle.radialIndicator({
	   		 	percentage: percentage,
	   		 	radius: radius,
	   		 	barWidth: barWidth,
	   		 	barColor: barColor,
	   		 	barBgColor: barBgColor,
	   		 	fontColor: fontColor,
	   		 	// minValue: minValue,
	   		 	maxValue: maxValue
	   		 });

	   		 var radial = $circle.data('radialIndicator');
	   		 radial.animate(value);
	   	});
	});
}

function initSwiper(){
	$.each($('.swiper-container'), function(index, val) {
		var $this = $(this);
	    var $pagination = $this.find('.swiper-pagination');
	    var $btnNext = $this.find('.swiper-button-next');
	    var $btnPrev = $this.find('.swiper-button-prev');
		var $swiperWrap = $this.find('.swiper-wrapper');
	    var autoplayTime = $swiperWrap.attr('data-autoplay-time') || 0;

	    $.each($swiperWrap.find('.swiper-slide,img'), function(index, el) {
	    	var $slider = $(el);
	    	var srcUrl = $slider.attr('data-url');
	    	if(srcUrl){
	    		srcUrl = srcUrl + util.getImageView($slider);
	    		if($slider.is('img')){
	    			$slider.attr('src',srcUrl);
	    		}else{
	    		    $slider.css('background-image','url(' + srcUrl + ')');
	    		}
	    	}
	    });

	    var slideData = {
	         pagination: $pagination,
	         nextButton: $btnNext,
	         prevButton: $btnPrev,
	         slidesPerView: 1,
	         paginationClickable: true,
	         noSwiping: false,
	         //spaceBetween: 30,
	         loop: true
	     };

	     if(autoplayTime > 0){
	     	slideData.autoplay = autoplayTime
	     }

	    var swiper = new Swiper($this, slideData);
	});
}

function initGallery() {
	var $mGallerys = $('.m-gallery');
	$mGallerys.on('click', '.m-gallery-item img', function(event) {
		var $image = $(this);
		var $link = $image.parent();
		var $gallery = $image.closest('.m-gallery');
		var index = $image.closest('.m-gallery-item').index();
		var items = [];
		if($link.get(0).nodeName !== 'A' || !$link.attr('href') || $link.attr('href').trim() === ''){  //如果存在链接 优先用链接 否则打开预览图
			$.each($gallery.find('.m-gallery-item'), function(index, val) {
				 var $this = $(this);
				 var $img = $this.find('img');
				 var src = ($img.attr('data-url') || util.removeUrlParam($img.attr('src'))) + '?imageView2/2/w/1920';
				 var w = $img.attr('data-width') || 1024;
				 var h = $img.attr('data-height') || 1024;
				 var item = {
				 	src: src,
				 	w: w,
				 	h: h
				 };
				 items.push(item);
			});
			openPhotoSwipe(items, index);
			return false;
		}
	});
}

function initForm() {
	$('.m-form').formValidate();
}

function initNavigator() {
	if(location.href.indexOf('/edit.html') < 0){			//非后台编辑页面执行
		$mNav.on('click', 'ul.m-nav li a:not([data-section-name])', function(event) {
			event.preventDefault();
			if(!isScrollEvent){
				isScrollEvent = true;
				var sectionName = $(this).attr('href').substr(1);
				$(this).addClass('selected').parent().siblings().children('a').removeClass('selected');
				history.replaceState({url: location.href},'','#' + sectionName);
				try {
					window.parent.history.replaceState({url: location.href},'','#' + sectionName);
				} catch(e) {
					// statements
					// console.log(e);
				}
				
				var sectionTop = $('a[name='+ sectionName +']').offset().top;
				$('html,body').animate({'scrollTop': sectionTop}, 800, function(event){
					isScrollEvent = false;
				});
			}
		});
		scrollListener();
	}

	$mNav.find('ul.m-nav li a').removeClass('selected');
	$('#m-page-container').ready(function() {
		var hash = window.location.hash;
		if(hash){
			setTimeout(function(){
				$mNav.find('ul.m-nav li a[href="'+ hash +'"]').click();
			},200)
			
		}
	});
}


function checkLoadGallery() {
	if($('.m-gallery').length > 0) {
		if(util.isInclude(includeFileUrls.pswpJs.fileName)){
			initGallery();
		} else {
			[includeFileUrls.pswpCss.path,
			includeFileUrls.pswpCssUI.path].forEach(function(url, index) {
				util.includeFile(url,'css');
			});
			$.when(
				$.get(includeFileUrls.pswpHtml.path, function(data) {
					$('body').append(data);
				}),
				util.loadScript
			    .load([includeFileUrls.pswpJs.path,
			    	   includeFileUrls.pswpJsUI.path])
			).done(function() {
			    	initGallery();
			})
		}
	}
}

function checkLoadSwiter() {
	if($('.swiper-container').length > 0){
		if(util.isInclude(includeFileUrls.swiperJs.fileName)){
			setTimeout(function(){
				initSwiper();
			},800);
		}else{
			util.includeFile(includeFileUrls.swiperCss.path,'css');
			util.loadScript
			    .load([includeFileUrls.swiperJs.path])
			    .done(function() {
			    	initSwiper();
			    })
		}
	}
}

function checkLoadCircle() {
	if($('.m-circle-group').length > 0) {
		if(util.isInclude(includeFileUrls.radial.fileName)){
			initCircle();
		} else {
			util.loadScript
				.load([includeFileUrls.radial.path])
				.done(function() {
					initCircle();
				})
		}
	}
}

function intactHandle($bgLayer) {
	bgImage = $bgLayer.attr('data-url') || $bgLayer.attr('src');
	if(!bgImage){
		$bgLayer.css('min-height','');
	}else{
		var w = $bgLayer.attr('data-width');
		var h = $bgLayer.attr('data-height');
		var sw = $bgLayer.width();
		var sh = Math.floor((sw * h) / w);
		$bgLayer.css('min-height', sh);
	}
}

function intactEmptyTextHandle($section) {
	var conClass = '.m-component-content';
	var $presp = $section.find('.m-persp-position');
	var $textGroup = $section.find('.m-item-text-group');
	var $btnGroup = $section.find('.m-item-button-group');
	var $itemTitle = $textGroup.find('.m-item-title');
	var $itemText = $textGroup.find('.m-item-text');
	var titleLength = $itemTitle.find(conClass).text().trim().length;
	var textLength = $itemText.find(conClass).text().trim().length;
	var btnLength = $btnGroup.find(conClass).text().trim().length;
	if(titleLength === 0 && textLength === 0 && btnLength === 0){
		$presp.hide();
	}else{
		if(titleLength === 0 && textLength === 0){
			$textGroup.hide();
		}else if(titleLength === 0){
			$itemTitle.hide();
		}else if(textLength === 0){
			$itemText.hide();
		}

		if(btnLength === 0){
			$btnGroup.hide();
			$textGroup.css('margin-bottom',0);
		}

	}

}

function handleIntactModule() {
	$.each($('.m-module-intact'), function(index, el) {
		 var $section = $(el);
		 var $bgLayer = $section.find('.m-bg-image');
		 intactEmptyTextHandle($section);
		 intactHandle($bgLayer);
		 $window.resize(util.debounce(function(event) {
		 	intactHandle($bgLayer);
		 }, 100));
	});
}

function handleJinshujuModule() {
	if(util.getTerminal() === 'mb') {
		$.each($('.m-module-jinshuju'), function(index, el) {
			var $iframe = $(el).find('iframe');
			var url = $iframe.attr('src');
			if(url.indexOf('embedded=true') < 0) {
				var param = url.indexOf('?') < 0 ? '?embedded=true' : '&embedded=true';
				$iframe.attr('src', (url + param));
			}
		});
	}
}

function initPageSetting(){
	var $setting = $('#setting_all');
	if($setting.length === 0){
		return;
	}
	var settingData = $setting.get(0).value;
	if(settingData.length === 0){
		return;
	}
	var $mNav = $('#header-container');
	var navCount = $navigator.find('.m-nav').children().length;
	var settingJson = JSON.parse(settingData);
	var bar = settingJson.bar ? JSON.parse(settingJson.bar) : {};
	pageSet.isshowshare = settingJson.isshowshare === 'true' ? true : false;
	pageSet.isshowbar = settingJson.isshowbar === 'true' ? true : false;
	pageSet.onlypc = bar.onlypc === undefined ? false : bar.onlypc;
	if(pageSet.isshowshare){
		// if(!util.isInclude(includeFileUrls.fontawesome.fileName)){
		// 	util.includeFile(includeFileUrls.fontawesome.path,'css');
		// }
		if(!util.isInclude(includeFileUrls.mshare.fileName)){
			// util.includeFile(includeFileUrls.mshare);
			util.loadScript
			    .load([includeFileUrls.qrcode.path,includeFileUrls.mshare.path])
			    .done(function() {

			    })
		}
	}
	setSectionAnchor();
}

function initBottomShareBar() {
	var $body = $('body');
	var version = $('#version').val();
	var $shareBar = $('<div class="m-page-bottom-share">\
						    <div class="right">\
						    	<div class="right-share" id="insert-share-container"></div>\
						    	<div class="right-complaint"><div class="icon-right"><a href="http://cn.mikecrm.com/StVjzZ8" target="_blank"></a></div></div>\
						    </div>\
						</div>');
	if(['2','3','4'].indexOf(version) === -1) {
		$shareBar.prepend('<div class="middle"><div class="middle-text"><a href="http://www.m1world.com/?ref=m1page" target="_blank">M1云端市场部提供技术支持</a></div></div>');
		$('.powered-by').remove();
		if($navigator.hasClass('dock-bottom')) {
			if($window.width() > 727) {
				$shareBar.css('bottom','45px')
				$body.css('padding-bottom','95px');
			} else {
				$body.css('padding-bottom','48px');
			}
			
			$window.resize(function(event) {
				if($window.width() > 727) {
					$shareBar.css('bottom','45px')
					$body.css('padding-bottom','95px');
				} else {
					$body.css('padding-bottom','48px');
					$shareBar.css('bottom','0px')
				}
			});
		} else {
			$body.css('padding-bottom','48px');
		}
		
	}else{
		$shareBar.addClass(' mini-right');
	}
	$body.append($shareBar);

	// ----------------特殊处理开始 个别页面隐藏投诉按钮---------
	var pageId = $.trim($('#page_id').val());
	if(pageId && ['27645'].indexOf(pageId) >= 0) {
		$shareBar.find('.right-complaint .icon-right').empty().css('width','0px');
	}
	// -----------------特殊处理结束-----------------------------

	resetShareBar($shareBar);
}
// 重设底部分享
function resetShareBar($shareBar) {
	var $body = $('body');
	$shareBar = $shareBar || $('.m-page-bottom-share');
	if (document.documentElement.clientHeight >= document.documentElement.offsetHeight - 4) {
		$shareBar.addClass('slideInUp');
	}else{
		$window.scroll(util.debounce(function(event){
			// 展示隐藏分享按钮
			if($window.scrollTop() > 300 || util.isScrollBottom($window,$body)){
			    $shareBar.addClass('slideInUp');
			}else{
			    $shareBar.removeClass('slideInUp');
			}
		}, 300));
	}
}

function messageBodyInfoHandler() {
	window.addEventListener('message',function(e){
      if(e.source!=window.parent) return;
      if(e.data.handler === 'req_web_info'){
      	var sourcedata = e.data
      	resizeMessage(sourcedata);
      }
  },false);

  function resizeMessage(sourceData) {
  	var $body = $('body');
  	var msg = {
  		handler: 'res_web_info',
  		data: {
  			key: sourceData.data.key,
  			height: $body.outerHeight()
  		}
  	}
  	window.parent.postMessage(msg,'*');
  	resetShareBar();
  // 	setTimeout(function() {
  // 		msg.data.height = $body.outerHeight();
  // 		window.parent.postMessage(msg,'*');
  // 		resetShareBar();
		// },1000);
  	// $(window).resize(util.debounce(function(event) {
  	// 	msg.data.height = $body.outerHeight();
  	// 	window.parent.postMessage(msg,'*');
  	// 	resetShareBar();
  	// }, 600));
  }
}

function initPostMessage() {
	messageBodyInfoHandler();
}

var initShareContent = function(){
	$mContent = $('#m-content');
	$slides = $mContent.find('.slides');
	$navigator = $mContent.find('#header-container');
	$mNav = $mContent.find('#m-nav');
	$mGallery = $mContent.find('.m-gallery');

	initNavigator();
	initForm();
	initWinResize();
	handleIntactModule();
	handleJinshujuModule();

	checkLoadGallery();
	checkLoadSwiter();
	checkLoadCircle();

	initBottomShareBar();
	initPageSetting();

	initPostMessage();
}	//end initShareContent

window.initShareContent = initShareContent;

$(function() {
	initShareContent();
	loadingFonts();
});

})(jQuery);
