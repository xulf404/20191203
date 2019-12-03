(function ($) {
    var KEY_COOKIE_CLIENT_ID = 'meihua_pages_client_id';
    var pId;
    var _startTime;
    var _user_ver = "";

    var isOverview = false;

    var sourceObj = {
        '#WECHAT': 1,   //΢��
        '#SINA-WEIBO': 2,   //����΢��
        '#QZONE': 3,    //QQ�ռ�
        '#TENC-WEIBO': 4,   //��Ѷ΢��
        '#DOUBAN': 5,   //����
        '#RENREN': 6,   //������
        '#GOOGLE+': 7,  //Google+
        '#FB': 8,   //Facebook
        '#TWITTER': 9,  //Twitter
        '#LINKEDIN': 10,  //LinkedIn
        '#MINGDAO': 11   //����
    }

    //�ж���PC�˻����ƶ���
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    //��Ӱ�ť�����¼
    function addBtnClick(pid, btnId) {
        var url = config.pageApi + '/click';
        var param = {
            p: pid,
            id: btnId
        };

        M.ajaxJson(url, 'GET', param, function (retData) {
            if (retData.success) {
                //location.href=linkUrl;
                //window.open(linkUrl);
                //console.log(retData.data)
            }
        });
    }

    //���ͨƪ�Ķ���¼
    function addOverview(pid, timeSpan) {
        timeSpan = timeSpan ? timeSpan : util.getTimeToMilli() - _startTime;
        var url = config.pageApi + '/overview';
        var param = {
            p: pid,
            t: timeSpan
        };

        M.ajaxJson(url, 'GET', param, function (retData) {
            if (retData.success) {
                //console.log(retData.data)
            }
        });
    }

    //����û����ʼ�¼
    function addUserView(pid, ip, source, device, guid, referrer) {
        var url = config.pageApi + '/view';
        var param = {
            p: pid,
            i: ip,
            r: source,
            d: device,
            f: referrer,
            id: guid
        };

        M.ajaxJson(url, 'GET', param, function (retData) {
            if (retData.success) {
                console.log(retData.data)
            }
        });
    }

    //ajax�汾ר�ã�ajax����html����
    function getShareContent(p) {
        var url = config.pageApi + '/share/' + p;
        M.ajaxJson(url, 'GET', {}, function (ret) {
            if (ret.success) {
                $('#page_id').val(p);
                $('#client_id').val(ret.data.client_id);
                $('#cover_image').val(ret.data.cover_image);
                $('title').text(ret.data.title);
                $('meta[name=description]').attr('content', ret.data.summary);
                $('meta[name=keywords]').attr('content', ret.data.summary);
                $('#m-page-container').html(ret.data.page_html);

                initSharePage();
                initPage();
                initShareContent();

                wxShareHandle();
            } else {
                message.alert(ret.data);
                setTimeout(function () {
                    location.href = '/';
                }, 2000);
                return false;
            }
        });
    }

    //������ҳ��������ִ�д���
    function initSharePage() {

        var guid;
        if (!$.cookie(KEY_COOKIE_CLIENT_ID)) {
            guid = $('#client_id').val();
            $.cookie(KEY_COOKIE_CLIENT_ID, guid, {expires: 365});
        } else {
            guid = $.cookie(KEY_COOKIE_CLIENT_ID);
        }
        var ip = '203.156.203.10';
        var source = 0;
        var device = 1;
        var currUrl = location.href;
        var sourceStr = currUrl.substring(currUrl.lastIndexOf('#'));
        var referrer = $.trim(document.referrer);

        referrer = referrer ? referrer : location.href;

        var from = util.request('from');

        /*if(!(/(page.m1world.com\/edit.html)|(page.m1world.com\/stat.html)|(localhost)|(127.0.0.1)/.test(referrer))){  //���������Դ�Ǳ��ػ��߱����Լ�Ԥ�� ����Ϊ��
         referrer = '';
         }
         */
        var isSecond = false;
        var secIndex = sourceStr.indexOf('_SEC');
        if (secIndex > 0) {
            isSecond = true;
        }
        sourceStr = secIndex < 0 ? sourceStr : sourceStr.substring(0, secIndex);

        //�ж���Դ����������������Դ��Ϊ΢��
        if (from == 'timeline' || from == 'groupmessage' || from == 'singlemessage') {
            sourceStr = '#WECHAT';
        }

        if (sourceObj[sourceStr]) {
            source = sourceObj[sourceStr];
        } else if (currUrl.lastIndexOf('MINGDAO') > 0) {
            source = 11;
        }

        if (!IsPC()) {
            device = 2;
        }
        if(window.returnCitySN) {
            ip = returnCitySN["cip"];
            addUserView(pId,ip,source,device,guid,referrer);
        }else {
            $.getScript('http://pv.sohu.com/cityjson?ie=utf-8', function() {
                ip = window.returnCitySN ? returnCitySN["cip"] : ip;
                addUserView(pId,ip,source,device,guid,referrer); //�û������
            })
        }

        eventsHandler();	// �¼�����
        wxShareHandle();    // ��ʼ����������΢�ŷ���SDK
    }

    // ����΢�ŷ���SDK
    function wxShareHandle(){
         var ua = navigator.userAgent.toLowerCase();
         // �����΢������������΢�ŷ���SDK����
         if(ua.match(/MicroMessenger/i) == "micromessenger"){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'http://page.m1world.com/common2/js/wxshare.js';
            document.head.appendChild(script);
            script.onload = function(){
                window.wxShare.init();
            }
         }
    }

    // �¼�����
    function eventsHandler(){
       $pageContainer.on('click', 'a[data-control=btn-link]', function (event) {
          var $this = $(this);
            var btnId = $this.attr('data-control-id');
            if (btnId != undefined && btnId != null && btnId != '') {
                addBtnClick(pId, btnId);
            }
          if(IsPC()) {
            var href = $.trim($this.attr('href'));
            if(href.indexOf('tel:') >= 0) {
                var tel = href.substring(4);
                if(tel !== '') {
                  alert('�벦��绰��' + tel)
                  return false;
                }
            }
          }
        });
    	$(window).scroll(util.debounce(function (event) {
    	    // ����������ײ�400���ش�����ͨƪ�Ķ���
    	    if(util.isScrollBottom($(window), $('body'), 400)){
    	        if (!isOverview) {
    	            addOverview(pId);
    	            isOverview = true;
    	        }
    	    }
    	}, 300));

    	//console.log('document.documentElement.clientHeight: '+document.documentElement.clientHeight)
    	//console.log('document.documentElement.offsetHeight: '+ (document.documentElement.offsetHeight - 4))
    	//�ж�ҳ���Ƿ���ֹ�����(�����ж��Ƿ�ͨƪ�Ķ�),���û���ֹ�������Ϊͨƪ�Ķ�
    	if (document.documentElement.clientHeight >= document.documentElement.offsetHeight - 4) {
    	    if (!isOverview) {
    	        addOverview(pId);   // ͨƪ�Ķ���
    	        isOverview = true;
    	        $('.sharefield').fadeIn('slow');
    	    }
    	}
    }

    function initMouseWheel() {
		function wheel(event) {
           var delta = 0;
           if (!event) event = window.event;
           if (event.wheelDelta) {
               delta = event.wheelDelta / 120;
               if (window.opera) delta = -delta;
           } else if (event.detail) {
               delta = -event.detail / 3;
           }
           if (delta) {
               handle(delta);
           }
           return false;
       }
       if (document.addEventListener) {
           document.addEventListener('DOMMouseScroll', wheel, false);
       }
       var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
       if (!isMac) {
           document.onmousewheel = wheel;
           $(window).scroll(function (event) {
               event.preventDefault();
           });
       }
       //���᷽���ж�
       var iscompleted = true;
       function handle(delta) {
           if (!iscompleted)
           {return;}
           iscompleted = false;
           p = $(this).scrollTop();
           if (delta > 0) {
               //����������
               jQuery('body,html').animate(
                    { scrollTop: "-=400" },  600, function () {
                        iscompleted = true;
                    });
           }
           else {
               jQuery('body,html').animate(
                    { scrollTop: "+=400" }, 600, function () {
                        iscompleted = true;
                    });
           }
       }
    }

    $(function () {
        _startTime = util.getTimeToMilli();
        pId = $('#page_id').val();
        $pageContainer = $('#m-page-container');

        // initMouseWheel();
        initSharePage();    // ��ʼ��ҳ�����ݴ���        
    });
})(jQuery);
