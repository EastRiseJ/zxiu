window.onload = function(){
	resizeFontSize();
	window.addEventListener('resize',resizeFontSize,false)
	function resizeFontSize(){
		document.documentElement.style.fontSize = document.documentElement.clientWidth/6.4 + 'px';
	}
	
//	indexSwiper();
	
}
//function indexSwiper(){
//	var indexSwiper = new Swiper('.banner .swiper-container',{
//		autoplay:300
//	});
//}
