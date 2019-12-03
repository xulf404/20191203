(function($){
var $mContent,$headerContenter,$navContainer,$navbar,$mNav;

var commonFolter = config.pageDomain + '/v2/common';

var includeFileUrls = {
	ckplayer: commonFolter +'/lib/ckplayer/ckplayer.js'
};

function moduleHandle(){
	var moduleNames = ['plain-text','jinshuju','feature-listing','content-columns','gallery'];	
	for(var i=0; i< moduleNames.length; i++){
		var moduleName = moduleNames[i];
		var $module = $('.m-module-' + moduleName);
		$.each($module, function(index, item) {
			M.moduleHandler($(item), moduleName);
		});
	}
}

function winResize(){
	$(window).resize(util.debounce(function(event) {
		moduleHandle();
	},100));
}

function initCkplayer(){
	var swfUrl = 'http://page.m1world.com/v2/common/lib/ckplayer/ckplayer.swf';
	var $videos = $('.m-video-content-upload');
	var priorityH5 = true;	// 播放器优先级 true h5播放  false flash播放
	$.each($videos, function(index, el) {
		var $this = $(el);
		var vid = $this.attr('id');
		var fileUrl = $this.attr('data-file');
		var w = parseInt($this.attr('data-width')) || 0;
		w = (w && parseInt(w)) || '100%';		// 处理data-width=0的情况
		//var w= '100%';
		var h = '100%';
		var poster = fileUrl + '?vframe/jpg/offset/7/w/'+ w 

		var flashvars={
			i: poster,
			f: fileUrl,
			c: 0,
			p: 2,  //0 默认暂停，1 默认播放，2 默认不加载视频~~ 默认参数为1
			loaded:'loadedHandler'
		};
		 var video=[fileUrl + '->video/mp4'];
		 CKobject.embed(swfUrl, vid, 'ckplayer_' + vid, w, h, priorityH5, flashvars, video);
	});
}

function initWOW(){
	var wow = new WOW({
		animateClass: 'animated',
		offset: 100,
		callback: function(box){
			//console.log("WOW: animating <" + box.tagName.toLowerCase() + ">");
		}
	});
	wow.init();
}

function chickLoadCkplayer() {
	if($('.m-video-content-upload').length > 0) {
		if(util.isInclude('ckplayer.js')) {
			initCkplayer();
		} else {
			util.loadScript.load([includeFileUrls.ckplayer]).done(function() {
				initCkplayer();
			})
		}
	}
}

function chickLoadWOW() {
	if(util.isInclude('wow.min.js')){
		if (!(/Android/i.test(navigator.userAgent))) {
            // 判断访问环境非 Android 则加动画特效
            initWOW();
        }
	}else{
		console.log('The page is not include the JavaScript file of "wow.min.js"!');
	}
}

// 临时处理页脚出错误链接
function footerHandle(){
	var $links = $('.powered-by .free').find('a');
	$.each($links, function(index, link) {
		 var $link = $(link);
		 var hrefVal = $link.attr('href');
		 if(hrefVal.indexOf('ref=user-page-footer') >= 0){
		 	$link.attr('href',hrefVal.replace('ref=user-page-footer','?ref=m1page'));
		 }
	});
}

function blockFeatureHandle() {
	var $features = $('.m-block-item.m-block-feature');
	$.each($features, function(index, el) {
		var $feature = $(el);
		 if(!$feature.hasClass('m-persp-column')){
		 	$feature.addClass('m-persp-column');
		 }
	});
}

function galleryHandle() {
	var $gallerys = $('.m-module-gallery');
	$.each($gallerys, function(index, el) {
		var $mGallery = $(el).find('.m-gallery');
		$mGallery.find('.m-component-content').attr({'img-sw': 400, 'img-mw': 400, 'img-lw': 400});
	});
}

function initNavigator() {
	$navbar.click(function(event) {
		$headerContenter.toggleClass('translate-right');
	});

	$mNav.on('click', 'li a', function(event) {
		if($headerContenter.hasClass('translate-right')){
			$headerContenter.removeClass('translate-right');
		}
	});

	$(document).click(function(event) {
		var $target = $(event.target);
		if(!$target.is('ul.m-nav') && !$target.is('.m-navbar') && $target.parents('.m-navbar').length == 0){
			$headerContenter.removeClass('translate-right');
		}
	});
}

function initLazyload() {
	// lazyload
	if($.fn.lazyload){
		$mContent.find("img,.m-bg-image").lazyload({effect: "show",data_attribute: 'url',getImageView: util.getImageView.bind(util)});	
	}
}

var initPage = function(){
	$mContent = $('#m-content');
	$headerContenter = $('#header-container');
	$navContainer = $headerContenter.find('.nav-container');
	$navbar = $navContainer.find('.m-navbar');
	$mNav = $('#m-nav');

	if($mContent.length === 0) {
		return;
	}

	initNavigator();

	initLazyload();

	chickLoadCkplayer();
	chickLoadWOW();	

	winResize();
	moduleHandle();
	galleryHandle();
	footerHandle();
	blockFeatureHandle();
}

window.initPage = initPage;

$(function() {
	initPage();
});

})(jQuery);


