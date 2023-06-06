$(window).load(function() {
	init();
	var width1=$(".wrapper").width();
	var width2=$(".index").width()+20;
	var left=(width1-width2)/2;
	$('.index').css({'left':left});
			
	var top_wrapper=$(".wrapper").height();
	//alert(top_wrapper);
	var top_search=$(".form-group").height();
	//alert(top_search);
    var top_index=$(".index").height();
    //alert(top_index);
	var top=(top_wrapper-top_search-top_index)/2+top_search;
	$(".index").css({'top':top});
})
$(window).resize(function(){
	init();
	var width1=$(".wrapper").width();
	var width2=$(".index").width()+20;
	var left=(width1-width2)/2;
	$('.index').css({'left':left});
			
	var top_wrapper=$(".wrapper").height();
	//alert(top_wrapper);
	var top_search=$(".form-group").height();
	//alert(top_search);
    var top_index=$(".index").height();
    //alert(top_index);
	var top=(top_wrapper-top_search-top_index)/2+top_search;
	$(".index").css({'top':top});
})
function init(){
	var height=$(window).height()-20;			//自适应
	var height2=$(window).height()*0.05;
	$(".log").height($(".log").width());
	$('.feedback').height($('.feedback').width());
	$(".relook").height($(".relook").width());
	$('.state').height($('.state').width());
	$('.index').height($('.index').width());
	$('.search-text').height(height2);
	var width=$(".log").width()*0.5;
	var height=$(".log").height()*0.5;
	$('.log-content').width(width);
	$('.log-content').height(height);
	$('.log-content img').width(width);
	$('.log-content img').height(height);
	$('.log-content1').width(width);
	$('.log-content1').height(height);
	$('.log-content1 img').width(width);
	$('.log-content1 img').height(height);
	
	$('.footer-img img').height($('.footer-img img').width());
	$('.footer-text').height($('.content').height());
}
