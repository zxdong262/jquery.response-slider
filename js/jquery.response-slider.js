/* ------------------------------------------------------------------------
    plugin-name:jQuery response slider
    Developped By: ZHAO Xudong, zxdong@gmail.com -> http://html5beta.com/jquery-2/jquery-response-slider/
    License: MIT
------------------------------------------------------------------------ */

(function($){
	function SS(opts, ob) {
		var defaults = {
			speed: 500
			,timer: 4000
			,autoSlider: true
			,hasNav: true
			,pauseOnHover: true
			,navLeftTxt: '&lt;'
			,navRightTxt: '&gt;'
			,zIndex:20
			,showIndicator: true
			,ease: 'linear'
		}
		,th = this
		,defs = th.defs = $.extend(defaults, opts)
		,cssSet = {
			position:'absolute'
			,left: '0'
			,top:0
			,width:'100%'
			,height:'100%'
			,'overflow': 'hidden'
			,'z-index': defs.zIndex
		}
		th.t = ob.show().wrapInner('<div class="response-slides" />')
		th.p = th.t.children().css(cssSet)
		th.ss = th.p.children().addClass('response-slide').css(cssSet).css('left', '100%')
		th.len = th.ss.length
		th.flag = null
		th.pause = false
		th.onAction = false
		th.currentPage = 0

		//init 
		th.ss.eq(0).css('left', 0)
		
		//dots
		if(defs.showIndicator) {
			var len1 = th.len
			,th0 = '<span class="ss-dots">'
			for(var k = 0;k < len1;k ++) {
				th0 += '<a data-ss-page="' + k + '" href="javascript:;" class="ss-dot ss-on"></a>'
			}
			var c = th.t.append(th0 + '</span>')
			.children('.ss-dots').css('z-index', defs.zIndex + 5 + th.len)
			th.t.on('click', '.ss-dot', function() {
				var ta = $(this)
				,i = parseInt(ta.data('ss-page'), 10)
				isNext = i > th.currentPage
				if(th.onAction || i === th.currentPage) return
				//ta.addClass('ss-on').siblings().removeClass('ss-on')
				th.onAction = true
				th.action(i, isNext)
			})
		}
		
		//navs
		if(defs.hasNav) {
			th.t.append('<a href="javascript:;" class="ss-nav ss-nav-prev">' + defs.navLeftTxt +
			'</a><a href="javascript:;" class="ss-nav ss-nav-next">' + defs.navRightTxt + '</a>')
			.children('.ss-nav').css('z-index', defs.zIndex + 10 + th.len)
			th.t.on('click', '.ss-nav', function() {
				if(th.onAction) return
				th.onAction = true
				var isNext = $(this).hasClass('ss-nav-next')
				,len = th.len
				,i = isNext? (th.currentPage + 1 + len) % len : (th.currentPage - 1 + len) % len 
				th.action(i, isNext)
			})
		}
		
		//auto start
		if(th.defs.autoSlider) {
			th.autoroll()
		}
		
		//pauseOnHover
		if(defs.pauseOnHover) {
			th.t.hover(function() {
				th.pause = true
			},function() {
				th.pause = false
			})
		}
	}
	
	SS.prototype = {
		action: function(index, isNext) {
			var th = this
			,defs = th.defs
			,speed = defs.speed
			,c = th.currentPage
			,ss = th.ss
			,step = isNext?100 : -100
			,cp = ss.eq(c).show()
			,cds = th.t.find('.ss-dot')
			,ip = ss.eq(index).css('left', step + '%').show()
			cds.eq(c).addClass('ss-on').siblings().removeClass('ss-on')
			ip.animate({
				left: 0
			}, speed, defs.ease);
			cp.animate({
				left: -step + '%'
			}, speed, defs.ease, function() {
				th.currentPage = index
				cds.eq(th.currentPage).addClass('ss-on').siblings().removeClass('ss-on')
				th.onAction = false
				if(defs.autoSlider) {
					clearTimeout(th.flag)
					th.flag = setTimeout(function() {
						th.autoroll()
					}, defs.timer)
				}
			})
		}
		,autoroll: function() {
			var t = this
			if(!t.onAction && !t.pause) {
				t.onAction = true
				var i = (t.currentPage + 1 + t.len) % t.len
				t.action(i, true)
			}
			else {
				clearTimeout(t.flag)
				t.flag = setTimeout(function() {
					t.autoroll()
				}, t.defs.timer)
			}
		}
		,destroy: function() {
			var t = this
			clearTimeout(t.flag)
			t.ss.unwrap()
			t.t.off( 'click', '**' ).removeAttr('style').children('.ss-nav').remove()
			t.t.children('.ss-dots').remove()
			t.t.children('.response-slide').removeAttr('style').removeClass('response-slide')
			$.each( t, function( key, value ) {
				t[key] = null
			})
		}
		
	}
	
	//jquery plugin
	$.fn.responseSlider = function(opts) {
		return new SS(opts, this)
    }
})(jQuery)
 