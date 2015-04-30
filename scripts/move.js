/**
 * 
 * @authors csy (you@example.org)
 * @date    2015-04-20 11:51:09
 * @version $Id$
 * @desp 	首页的滑动样式
 */
 $(function(){
 	var obj = {
 		page    : $(".page"),
 		width   : $(window).width(),
 		height  : $(window).height(),
 		showPic : $(".lazyImg").size(),
 		pageSize: $(".page").size(),
 		node	: [],

 		pageNow  : 0,
 		pageNext : 1,
 		moveP    : null,
 		startX   : null,
 		isStart  : false,
 		moveDistance : null,
 		movePosition : null,
 		createElement : document.createElement('div').style,
		vendor	: function () {
			var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
				transform,
				i = 0,
				l = vendors.length;

			for ( ; i < l; i++ ) {
				transform = vendors[i] + 'ransform';
				if ( transform in this.createElement ) return vendors[i].substr(0, vendors[i].length-1);
			}
			return false;
		},
		//检测css
		prefixStyle : function(style){
			if( this.vendor() === false ) return false;
			if( this.vendor() === '') return style;
			return this.vendor() + style.charAt(0).toUpperCase() + style.substr(1);
		},
		initEvent : function(){
			this.page.on('touchstart', this.pageStart);
			this.page.on('touchmove', this.pageMove);
			this.page.on('touchend', this.pageEnd);
		},
		pageStart : function(e){
			if (e.type != 'touchstart') return;
			obj.isStart = true;
			obj.startX = window.event.touches[0].pageX;
			
			
		},
		pageMove : function(e){
			e.preventDefault();
			if(!obj.isStart) return;

			var moveP = window.event.touches[0].pageX;
			obj.moveDistance = moveP - obj.startX;
			if(obj.moveDistance > 0){
				// 初始化数组
				obj.movePosition = "right";
				obj.pageNext = obj.pageNow - 1;
				obj.node 	 = [obj.page.eq(obj.pageNow), obj.page.eq(obj.pageNext)];
				obj.swipeRight();
			} else if(obj.moveDistance < 0){
				// 初始化数组
				obj.movePosition = "left";
				obj.pageNext = obj.pageNow + 1;
				obj.node	 = [obj.page.eq(obj.pageNow), obj.page.eq(obj.pageNext)];
				obj.swipeLeft();
			}
		},
		swipeLeft : function(){
			if(obj.pageNow == obj.pageSize -1) return;
			obj.node[1].removeClass("hidden");
			var l = obj.width + obj.moveDistance;
			//初始化上一个页面的位置
			obj.node[1][0].style[obj.prefixStyle('transform')] = 'translateX('+ l +'px)';
			//当前页的变化
			obj.node[0][0].style[obj.prefixStyle('transform')] = 'translateX('+ obj.moveDistance +'px)';
		},
		swipeRight : function(){
			if(obj.pageNow == 0) return;
			obj.node[1].removeClass("hidden");
			var l = -obj.width + obj.moveDistance;
			//初始化上一个页面的位置
			obj.node[1][0].style[obj.prefixStyle('transform')] = 'translateX('+ l +'px)';
			//当前页的变化
			obj.node[0][0].style[obj.prefixStyle('transform')] = 'translateX('+ obj.moveDistance +'px)';
		},
		pageEnd : function(e){
			//console.log(obj.moveDistance < 0 && obj.pageNow == 0)
			if(obj.movePosition == "right" && obj.pageNow == 0) return;
			if(obj.movePosition == "left" && obj.pageNow == obj.pageSize -1) return;
			obj.isStart = false;
			if(Math.abs(obj.moveDistance) > 10){		
				console.log("end")
				obj.node[0][0].style[obj.prefixStyle('transition')] = "all .3s";
				obj.node[1][0].style[obj.prefixStyle('transition')] = "all .3s";
			}
			if(Math.abs(obj.moveDistance) > 80){
				obj.pageSucc();
			} else {
				obj.pageFail();
			}
		},
		pageSucc : function(){
			//这里 node[0]为当前页面 node[1]已经被切换过去
			var w = obj.width;
			
			if(obj.movePosition =="left"){
				obj.node[1][0].style[obj.prefixStyle('transform')] = 'translateX(0)';
				obj.node[0][0].style[obj.prefixStyle('transform')] = 'translateX('+ -w +'px)';
			} else if(obj.movePosition == "right"){
				obj.node[1][0].style[obj.prefixStyle('transform')] = 'translateX(0)';
				obj.node[0][0].style[obj.prefixStyle('transform')] = 'translateX('+ w +'px)';
			}
			setTimeout(function(){
				//当前页面
				obj.page.eq(obj.pageNow).addClass("hidden").removeClass("index");
				obj.page.eq(obj.pageNext).addClass("index");
				obj.node[1][0].style[obj.prefixStyle('transform')]  = '';
				obj.node[1][0].style[obj.prefixStyle('transition')] = '';
				obj.node[0][0].style[obj.prefixStyle('transform')]  = '';
				obj.node[0][0].style[obj.prefixStyle('transition')] = '';
								
				if(obj.moveDistance > 0){
					obj.pageNow  = obj.pageNow - 1;
				} else {
					obj.pageNow  = obj.pageNow + 1;
				}
				$(".point").eq(obj.pageNow).addClass("now").siblings().removeClass("now");
				obj.moveDistance = 0;
			}, 300)
		},
		pageFail : function(){
			var w = obj.width;
			
			if(obj.movePosition =="left"){
				obj.node[0][0].style[obj.prefixStyle('transform')] = 'translateX(0)';
				obj.node[1][0].style[obj.prefixStyle('transform')] = 'translateX('+ w +'px)';
			} else if(obj.movePosition == "right"){
				obj.node[0][0].style[obj.prefixStyle('transform')] = 'translateX(0)';
				obj.node[1][0].style[obj.prefixStyle('transform')] = 'translateX('+ -w +'px)';
			}
			setTimeout(function(){
				//当前页面
				obj.page.eq(obj.pageNext).addClass("hidden");
				obj.node[1][0].style[obj.prefixStyle('transform')]  = '';
				obj.node[1][0].style[obj.prefixStyle('transition')] = '';
				obj.node[0][0].style[obj.prefixStyle('transform')]  = '';
				obj.node[0][0].style[obj.prefixStyle('transition')] = '';
								
				obj.moveDistance = 0;
			}, 300)
		},
		imgLoading : function(){
			var src = $(".lazyImg");
			for(var i = 0; i < obj.showPic; i++){
				var img = new Image();
				img.onload = (function(n){
					return function(){
						if(this.complete==true){ 
							$(src[n]).removeClass("lazyImg"); 
	                		$(src[n]).css("backgroundImage" ,"url("+ this.src + ")"); 
	               			if( n == obj.showPic -1 ){
								obj.pageShow();
							} 
	            		}  	
					}
				})(i)
				img.src = $(src[i]).data("src");	
			}
		},
		pageShow : function(){
			$(".bar").css("left",(obj.width - $(".bar").width())/2 + "px");
			$(".point").eq(obj.pageNow).addClass("now");
			$(".bar").show();
			$(".load").hide();
			$(".page").eq(obj.pageNow).addClass("index").removeClass("hidden");
		},
		initStyle : function(){
			$(".page").addClass("hidden");
			$(".load").height(obj.height);
			$(".load").width(obj.width);
			$(".page").width(obj.width);
			$(".page").height(obj.height);
			$(".view").height(obj.height);
			$(".view").width(obj.width);

		},
		init : function(){
			this.initStyle();
			this.imgLoading();
			this.initEvent();
		}
	}
	obj.init();
})
