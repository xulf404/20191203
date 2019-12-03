(function($){
var $window = $(window);
var $mContent,$slides,$navigator,$mNav,$mGallery;
var isScrollEvent = false;	//�����ж��Ƿ��ǹ����������¼�
var pageSet = {
	isshowshare: true,
	isshowbar: true,
	onlypc: false
};
var commonFolter = config.pageDomain + '/v2/common'
var includeFileUrls = {
	fontawesome: 	{fileName: 'font-awesome.min.css', 			path: commonFolter + '/lib/font-awesome-4.3.0/css/font-awesome.min.css'} ,
	// ����ť&��ά��
	mshare: 		{fileName: 'mshare.js', 					path: commonFolter + '/js/mshare.js'},
	qrcode: 		{fileName: 'qrcode.js', 					path: commonFolter + '/js/qrcode.js'},
	// ����
	swiperCss: 		{fileName: 'swiper.min.css', 				path: commonFolter + '/lib/swiper/css/swiper.min.css'},
	swiperJs: 		{fileName: 'swiper.min.js', 				path: commonFolter + '/lib/swiper/js/swiper.min.js'},
	// ���
	pswpHtml: 		{fileName: 'pswp.html', 					path: commonFolter + '/tpl/base/pswp.html'},
	pswpCss: 		{fileName: 'photoswipe.css', 				path: commonFolter + '/lib/photoswipe/photoswipe.css'},
	pswpCssUI: 		{fileName: 'default-skin.css', 				path: commonFolter + '/lib/photoswipe/default-skin/default-skin.css'},
	pswpJs: 		{fileName: 'photoswipe.js', 				path: commonFolter + '/lib/photoswipe/photoswipe.js'},
	pswpJsUI: 		{fileName: 'photoswipe-ui-default.min.js', 	path: commonFolter + '/lib/photoswipe/photoswipe-ui-default.min.js'},
	// ����
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
			var currSectionTop = $anchor.offset().top;		// ��ǰģ��λ��
			var sectionHeight = $anchor.parent().height();  // ��ǰģ��߶�
			var sectionPosTop = currSectionTop - scrollTop; // ģ�鶥������������Ӵ��ڵ�λ�ã�ģ�鶥��������������ڶ����ľ���λ�ã�

			if(index > 0 && ($anchors.eq(index-1).offset().top - scrollTop >= 0)){
				// ���ǰһ��ģ�鶥�����ڿ��Ӵ����ڣ����ģ�鲻������
				return true;
			}

			if((sectionPosTop >= 0) && (sectionPosTop <= (win_h/2))
				|| (sectionPosTop < 0) && (sectionPosTop + sectionHeight >= win_h)){
				// ���ģ�鶥���ڴ��ڿ��������ϰ벿��λ�� ����ģ�鶥���͵ײ����ڿ��������⣨ռ���������ڣ� ѡ�д�ģ�鵼��
				var sectionName = $anchor.parent().attr('data-section-name');
				setSectionNav(sectionName);
			} else {
				// ���ģ���ڴ��ڿ��������벿�֣���ѡ��ǰһ��ģ�鵼��
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
    /// <summary>����ϵͳalert���Զ��ر�</summary>
    /// <param name="alertMessage" type="String">Ҫ��ʾ������</param>
    var $MaskAlert = $('<div id="MaskAlert" style="z-index:9999;letter-spacing: 2px;"></div>');
    var html = "";
    html += '<div class="alert alert-warning fade in" style=\"padding: 25px 20px;background-color: rgba(0, 0, 0, 0.5);position: fixed;top: 30%;left:0;right:0;margin-left:auto;margin-right:auto;z-index: 9999;border-radius: 4px;font-size: 20px;min-width: 250px;max-width:300px;text-align: center; color:#fff;\">';
    html += '<button type="button" class="btn-close" style="color:#fff; background-color:transparent; position:absolute; right:10px; cursor:pointer;">��</button>';
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
	var _specialFields = ['full_name', 'email', 'mobile_phone', 'work_phone'];  // �����ֶ�
	var _provinceData = [
		{id: 1, name: '������'},
		{id: 2, name: '�����'},
		{id: 3, name: '�ӱ�ʡ'},
		{id: 4, name: 'ɽ��ʡ'},
		{id: 5, name: '���ɹ�������'},
		{id: 6, name: '����ʡ'},
		{id: 7, name: '����ʡ'},
		{id: 8, name: '������ʡ'},
		{id: 9, name: '�Ϻ���'},
		{id: 10, name: '����ʡ'},
		{id: 11, name: '�㽭ʡ'},
		{id: 12, name: '����ʡ'},
		{id: 13, name: '����ʡ'},
		{id: 14, name: '����ʡ'},
		{id: 15, name: 'ɽ��ʡ'},
		{id: 16, name: '����ʡ'},
		{id: 17, name: '����ʡ'},
		{id: 18, name: '����ʡ'},
		{id: 19, name: '�㶫ʡ'},
		{id: 20, name: '����׳��������'},
		{id: 21, name: '����ʡ'},
		{id: 22, name: '������'},
		{id: 23, name: '�Ĵ�ʡ'},
		{id: 24, name: '����ʡ'},
		{id: 25, name: '����ʡ'},
		{id: 26, name: '����������'},
		{id: 27, name: '����ʡ'},
		{id: 28, name: '����ʡ'},
		{id: 29, name: '�ຣʡ'},
		{id: 30, name: '���Ļ���������'},
		{id: 31, name: '�½�ά���������'},
		{id: 32, name: '̨��ʡ'},
		{id: 33, name: '����ر�������'},
		{id: 34, name: '�����ر�������'}
	];
	var _pageId = $('#page_id').val();
	var _pageTitle = $('title').text();
	/**
	 * ������ݳ���json����
	 * @return {array} ��ݳ���json����
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
			$city.empty().append('<option value="">��ѡ��'+ $city.attr('placeholder') +'</option>');
			list.forEach(function(v){
				$city.get(0).add(new Option(v.name, v.id));
			});
		}
	}
	/**
	 * �ж��ֶ��Ƿ��������ֶ�
	 * @param  {string}  fieldName �ֶ���
	 * @return {Boolean}           true �������ֶΣ�false ���������ֶ�
	 */
	function isSpecialField(fieldName){
		return _specialFields.some(function(val, index){
			return val === fieldName.toLowerCase();
		});
	}
	/**
	 * ��������
	 * @param  {DOM} $this ��ǰҪ����DOM
	 * @return {boolean}       true Ϊͨ����false δͨ��
	 */
	function checkRequired($this){
		var required = $this.attr('required');
		var fieldValue = $this.val().trim();
		var fieldKey = $this.attr('name').trim();
		if(required !== undefined && fieldValue.length === 0){
			alertMessage = ($this.get(0).nodeName === 'SELECT' ? '��ѡ��' : '����д') + $this.attr('placeholder');
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
	// ��������
	function checkEmail($email){
		if(!checkRequired($email)){
			return false;
		}else{
			var email = $.trim($email.val());
			var holder = $email.attr('placeholder');
			if(email.length > 0 && !util.isEmail(email)){
				alert(holder + '��ʽ����ȷ');
				$email.addClass('m-input-error').focus();
				return false;
			}else{
				$email.removeClass('m-input-error');			
			}
		}
		return true;
	}
	// �����ֻ�����������һ��
	function checkPhone($mobilePhone,$workPhone){
		if($mobilePhone.length > 0 && $workPhone.length > 0){
			var mobileHolder = $mobilePhone.attr('placeholder');
			var workHolder = $workPhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			var workPhone = $.trim($workPhone.val());
			if(mobilePhone.length == 0 && workPhone.length == 0){
				alert(mobileHolder + '��' + workHolder + ' ������дһ�');
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
	// �����ֻ��Ÿ�ʽ
	function checkMobilePhone($mobilePhone){
		if(!checkRequired($mobilePhone)){
			return false;
		}else{
			var mobileHolder = $mobilePhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			if(mobilePhone.length > 0 && !util.isMobile(mobilePhone)){
				alert(mobileHolder + '��ʽ����ȷ!');
				$mobilePhone.addClass('m-input-error').focus();
				return false;
			}else{
				$mobilePhone.removeClass('m-input-error');
				// �Ƿ���֤�ֻ���֤��
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
	// �����ֻ���֤��
	function checkPhoneVerifyCode($phoneVerifyCode){
		if($phoneVerifyCode.attr('verify-pass') !== 'success'){
			alert('�ֻ���֤�벻��ȷ!');
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
		var $nameFields = $section.find('.m-email-form-small-fields-group').children('.m-name-field').children(); // ��ȡ�����ֶ�html��ǩ
		var $requiredFields = $nameFields.filter('[required]');	
		// console.log('required count:',$requiredFields.length);
		if($requiredFields.length === 0){
			// ��������ڰ�pageû��required���ԣ�������Ĭ����֤������
			return checkFieldsValidate_noRequired($section);
		}else{
			if(!checkFieldsValidate($nameFields)){
				// �ֶ���֤ʧ�� �˳�
				return false;
			}
			var $remark = $section.find('textarea[name=remark]');
			// ����ע��֤
			if($remark.length > 0){
				if(!checkRequired($remark)){
					return false;  
				}
			}
		}
		return true;
	}

	// ������ͨ������֤
	function checkFieldsValidate($nameFields){
		var isValidate = true;
		$.each($nameFields, function(index, val) {
			var $this = $(this);
			var fieldKey = $this.attr('name').trim();
			if(!isSpecialField(fieldKey)){ 
				// �������ֶδ���
				isValidate = checkRequired($this);
			}else{   
				// �����ֶδ���
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
				return false;   // �˳�ѭ��
			}
		});
		return isValidate;
	}

	// �������ڰ�page��form��֤��û��required���Ե������Ĭ�ϴ���
	function checkFieldsValidate_noRequired($section){
		var $name = $section.find('input[name=full_name]');
		var $email = $section.find('input[name=email]');
		var $mobilePhone = $section.find('input[name=mobile_phone]');	// �ֻ�
		var $workPhone = $section.find('input[name=work_phone]');		// �绰

		if($name.length > 0){
			var name = $.trim($name.val());
			if(name.length == 0){
				alert('������' + $name.attr('placeholder'));
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
				alert('������' + holder);
				$email.addClass('m-input-error');
				$email.focus();
				return false;
			}else if(!util.isEmail(email)){
				alert(holder + '��ʽ����ȷ');
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
				alert(mobileHolder + '��' + workHolder + ' ������дһ�');
				$mobilePhone.addClass('m-input-error');
				$workPhone.addClass('m-input-error');
				$mobilePhone.focus();
				return false;
			}
		}else if($mobilePhone.length > 0){
			var mobileHolder = $mobilePhone.attr('placeholder');
			var mobilePhone = $.trim($mobilePhone.val());
			if(mobilePhone.length == 0){
				alert('����д'+ mobileHolder +'!');
				$mobilePhone.addClass('m-input-error');
				$mobilePhone.focus();
				return false;
			}else if(!util.isMobile(mobilePhone)){
				alert(mobileHolder + '��ʽ����ȷ!');
				$mobilePhone.addClass('m-input-error');
				$mobilePhone.focus();
				return false;
			}
		}else if($workPhone.length > 0){
			var workHolder = $workPhone.attr('placeholder');
			var workPhone = $.trim($workPhone.val());
			if(workPhone.length == 0){
				alert('����д'+ workHolder +'!');
				$workPhone.addClass('m-input-error');
				$workPhone.focus();
				return false;
			}
		}
		return true;
	}

	// �жϻ�ȡ����Դ
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
					// Ĭ�ϵ�һ���ֶ���Ϊ����
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
		var $nameFields = $section.find('.m-email-form-small-fields-group').children('.m-name-field').children(); // ��ȡ�����ֶ�html��ǩ
		var $remark = $section.find('textarea[name=remark]');
		var $groupName = $section.find('input[name=group_name]');
		var subResourceStr = getSubResource(); // ��ȡ����Դ�ַ���
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
			 	// ����ѡ�� ��Ҫ���ı�ֵ������id
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
		$submit.attr('disabled','disabled').html('<span>�ύ��...</span>');
		M.ajaxJson(url, 'POST', param, function(ret) {
		  if (ret.success) {
        if (param.p_id == '28308') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>�ύ�ɹ�</p>\
										<p>�����������ӵ�ַ����<br /><a style=\"color:#06c;border-bottom:solid 1px #06c\" href=\"http://resource.m1world.com/2016%E4%BA%BF%E8%BE%BE%E8%BD%AF%E4%BB%B6%E6%96%B0%E5%9F%8E%E5%AE%A2%E6%88%B7%E5%A4%A7%E4%BC%9A%E8%B5%84%E6%96%99%E5%8C%85.zip\" target=\"_blank\">2016�ڴ�����³ǿͻ�������ϰ�</a></p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '28672' || param.p_id == '29761' || param.p_id == '32758') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>�ύ�ɹ�</p>\
										<p>�����������ӵ�ַ����<br /><a style=\"color:#06c;border-bottom:solid 1px #06c\" href=\"http://aed8e0ab16f8ba5b.share.mingdao.net/apps/kcshare/5857d416442bf21c080e6ee8\" target=\"_blank\">�����ʼ�ģ�尸������-��M1�ƶ��г�������</a></p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '28857') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>Submitted successfully, thank you for your support��</p>\
									</div>\
								</div>');
        }
        else if (param.p_id == '29750') {
            $content.empty().append('<div class="m-form-submit-success">\
									<div class="icon-success"><i class="fa fa-check-circle"></i></div>\
									<div class="m-form-submit-success-info">\
										<p>Thank you for your submission��</p>\
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

        	// ----�˴��Ǳ���ǿ���� ���Ͼ�Ϊ��ʱ----------
		  		var setting = ret.data;
    	  	var tips = '<p>�ύ�ɹ�</p><p>��л�������ǵ�������֧�֣�</p>';
    	  	if(typeof setting === 'object') {
    	  		if(setting.isurl) {
    	  			// location.href = setting.content;
    	  			// Ϊ�����׿΢�����localhost.hrefʧЧ����
    	  			var timeStamp = (new Date().getTime())
    	  			var paramTimeStamp = setting.content.indexOf('?') >= 0 ? ('&__t=' + timeStamp) : ('?__t=' + timeStamp);
    	  			var jumpUrl = setting.content + paramTimeStamp;
    	  			window.location.href = jumpUrl;

    	  			tips += '<p>û����ת�� <a href="'+ jumpUrl +'">���˴���ת</a></p>'
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
				$submit.removeAttr('disabled').html('<span>�ύ</span>');
			}
		});	
	}

	function postFormHandler(ret) {
	  if (ret.success) {
	  	var setting = ret.data;
	  	var tips = '<p>�ύ�ɹ�</p><p>��л�������ǵ�������֧�֣�</p>';
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
			$submit.removeAttr('disabled').html('<span>�ύ</span>');
		}
	}

	function setCodeBtnCountdown($btn) {
		var countdown = 60;
		$btn.prop('disabled', true);
		$btn.text( countdown + '������»�ȡ');
		var timer = setInterval(function(){
			if(--countdown >= 0) {
				$btn.text(countdown + '������»�ȡ');
			} else {
				$btn.text('�����ȡ��֤��');
				countdown = 60;
				$btn.prop('disabled', false);
				clearInterval(timer);
			}
		},1000);
	}

	// �����ֻ���֤��
	function postPhoneVerifyCode(phone,formId,fn) {
		var url = config.pageApi + '/contact_form/verify_code';
		var param = {
			phone: phone,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'POST', param, fn);
	}

	// ��ȡУ���ֻ���֤��
	function postCheckPhoneVerifyCode(code_phone, formId, fn) {
		var url = config.pageApi + '/contact_form/verify_code/check';
		var param = {
			code_phone: code_phone,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'GET', param, fn);
	}

	// ����������֤��
	function postEmailVerifyCode(email,formId,fn) {
		var url = config.pageApi + '/contact_form/verify_code';
		var param = {
			email: email,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'POST', param, fn);
	}

	// ��ȡУ��������֤��
	function postCheckEmailVerifyCode(code_email, formId, fn) {
		var url = config.pageApi + '/contact_form/verify_code/check';
		var param = {
			code_email: code_email,
			f_id: formId,
			p_id: _pageId
		};
		M.ajaxJson(url, 'GET', param, fn);
	}

	// ���һ����֤��DOM
	function getFieldVerifyCodeDom(option) {
		var $fieldVerify;
		var verifyHtml = '<input type="number" name="verify_code_'+ option.fieldKey +'" placeholder="'+ option.fieldPlaceholder +'">'
                        verifyHtml  +=     '<div class="verify-code-wrap">'
                        verifyHtml  +=      '<span class="verify-code-icon"></span>'
                        verifyHtml  +=      '<button class="verify-code-button btn-verify-code-'+ option.fieldKey +'">�����ȡ��֤��</button>' 
                        verifyHtml  +=    '</div>'
		if(option.fieldIndex % 2 === 0) {
		  $fieldVerify = $('<section>' + verifyHtml + '</section>');
		} else {
		  $fieldVerify = $('<div>' + verifyHtml + '</div>');
		}
		return $fieldVerify.addClass('m-email-form-field m-name-field-wrap wow fadeInUp');
	}

	// ���ñ�����
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

	// ������֤��״̬
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

	// ������֤�봦��
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
			fieldPlaceholder: '�����������֤��',
			fieldIndex: fieldIndex + 1
		});

		// ���½���֤���ֶβ����
		$mobilePhone.parent().after($fieldCode);
		// ���ñ�����
		resetFormLayoutType($inputsGroup);

		var $phoneCodeInput = $fieldCode.find('input[name="verify_code_phone"]');
		var $phoneCodeBtn = $fieldCode.find('.btn-verify-code-phone');
		var $codeIcon = $fieldCode.find('.verify-code-icon');

		$phoneCodeBtn.click(function(event) {
			if(!testMobilePhone($mobilePhone)) {
				alert('��������ȷ���ֻ��ţ�');
				return;
			}
			var phone = $mobilePhone.val().trim();
			$phoneCodeBtn.prop('disabled', true);
			$phoneCodeBtn.text('��֤�뷢����...');
			postPhoneVerifyCode(phone, formId, function(ret) {
				if(ret.success) {
					setCodeBtnCountdown($phoneCodeBtn);
				}else{
					alert('��֤���ȡ���������»�ȡ��');
					$phoneCodeBtn.prop('disabled', false);
					$phoneCodeBtn.text('�����ȡ��֤��');
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
					alert('��֤����Ч');
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

	// �ʼ���֤�봦��
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
			fieldPlaceholder: '������������֤��',
			fieldIndex: fieldIndex + 1
		});
		// ���½���֤���ֶβ����
		$email.parent().after($fieldCode);
		// ���ñ�����
		resetFormLayoutType($inputsGroup);

		var $emailCodeInput = $form.find('input[name="verify_code_email"]');
		var $emailCodeBtn = $form.find('.btn-verify-code-email');
		var $codeIcon = $emailCodeBtn.parent().find('.verify-code-icon');

		$emailCodeBtn.click(function(event) {
			if(!testEmail($email)) {
				alert('��������ȷ�����䣡');
				return;
			}
			var email = $email.val().trim();
			$emailCodeBtn.prop('disabled', true);
			$emailCodeBtn.text('��֤�뷢����...');
			postEmailVerifyCode(email, formId, function(ret) {
				if(ret.success) {
					setCodeBtnCountdown($emailCodeBtn);
				}else{
					alert('��֤���ȡ���������»�ȡ��');
					$emailCodeBtn.prop('disabled', false);
					$emailCodeBtn.text('�����ȡ��֤��');
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
					alert('��֤����Ч');
				}
			})
		});
	}

	// ��ȡ��ǰ�ֶ����ڱ��е�����(���������ֶ�,��section)
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

	// �ֻ�����
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

	// ���䴦��
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
		var $nameFields = $fieldsGroup.children('.m-name-field').children();   // ��ȡ�����ֶ�html��ǩ
		var $name = $me.find('input[name=full_name]');
		var $email = $me.find('input[name=email]');
		var $job = $me.find('input[name=job_title]');
		var $company = $me.find('input[name=company]');
		var $mobilePhone = $me.find('input[name=mobile_phone]').attr('type','number');	// ��Ϊ��������
		var $workPhone = $me.find('input[name=work_phone]');		// ��Ϊ��������
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
			if($submit.attr('disabled') == 'disabled') return; //��ֹ�ظ��ύ

			//�ⲿ��Ϊ��Ԥ��ҳ����
			if(!_pageId){
				_pageId = util.request('p');
			}
			
			if(!_pageId){
				alert('��������');
				return false;
			}
			if(checkSubmit($content)){
				fields = getFieldsJson($content);
				fields.p_id = _pageId;
				fields.resource = _pageTitle + ' [' + _pageId + ']';
        setTimeout(function(){ // �ӳ��ύ ��ֹ��ť����¼�ʧЧ
				  postForm(fields, $content);
        },4)
			}
		});

		phoneHandler($me);
		emailHandler($me);
	});
}

function loadingFonts(){
	// �ж��Ƿ�Ϊ�ƶ������л��� 
	if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
	    if (window.location.href.indexOf("?mobile") < 0) {
	        try {
	            //if(/Android/i.test(navigator.userAgent)) {
	                // �жϷ��ʻ��� Android �����������ʽ 
	                 //setActiveStyleSheet("/common/css/fonts/web-font.css");
	            //}
	            /*if (!(/Android/i.test(navigator.userAgent))) {
	                // �жϷ��ʻ����� Android �����������ʽ 
	                 setActiveStyleSheet("/common/css/fonts/web-font.css");
	            }*/
	            /*if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
	                // �жϷ��ʻ����� Android|webOS|iPhone|iPod|BlackBerry �����������ʽ 
	                setActiveStyleSheet("style_mobile_a.css");
	            } else if (/iPad/i.test(navigator.userAgent)) {
	                // �жϷ��ʻ����� iPad �����������ʽ 
	                setActiveStyleSheet("style_mobile_iPad.css");
	            } else {
	                // �жϷ��ʻ����� �����ƶ��豸 �����������ʽ 
	                setActiveStyleSheet("style_mobile_other.css");
	            }*/
	        } catch (e) {}
	    }
	} else {
	    // ������϶����ǣ������������ʽ 
	    //setActiveStyleSheet("/common/css/fonts/web-font.css");
	    //setActiveStyleSheet("common/css/fonts/editorfonts.css");
	}
	// �ж���Ϻ������ʽ 
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
	   		 var maxValue = 100; //����ǰٷֱ���ʾ�������ֵ��Ϊ100
	   		 if(!percentage){	 //����Ǵ�������ʾ�������ֵ��Ϊ��ǰֵ
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
		if($link.get(0).nodeName !== 'A' || !$link.attr('href') || $link.attr('href').trim() === ''){  //����������� ���������� �����Ԥ��ͼ
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
	if(location.href.indexOf('/edit.html') < 0){			//�Ǻ�̨�༭ҳ��ִ��
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
		$shareBar.prepend('<div class="middle"><div class="middle-text"><a href="http://www.m1world.com/?ref=m1page" target="_blank">M1�ƶ��г����ṩ����֧��</a></div></div>');
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

	// ----------------���⴦��ʼ ����ҳ������Ͷ�߰�ť---------
	var pageId = $.trim($('#page_id').val());
	if(pageId && ['27645'].indexOf(pageId) >= 0) {
		$shareBar.find('.right-complaint .icon-right').empty().css('width','0px');
	}
	// -----------------���⴦�����-----------------------------

	resetShareBar($shareBar);
}
// ����ײ�����
function resetShareBar($shareBar) {
	var $body = $('body');
	$shareBar = $shareBar || $('.m-page-bottom-share');
	if (document.documentElement.clientHeight >= document.documentElement.offsetHeight - 4) {
		$shareBar.addClass('slideInUp');
	}else{
		$window.scroll(util.debounce(function(event){
			// չʾ���ط���ť
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
