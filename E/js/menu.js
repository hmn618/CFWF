function getMenu(type){
	var html = '';
		$.ajax({
			type: 'get',
			url: 'menu.tmpl',
			dataType: 'text',
			async: false,
			success: function(res){
				html = res;
//				console.log(html);
			}
			});
			return html;
}
function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
$(document).ready(function(){
	var type = getQueryString('type');
//	console.log(type);
	var menu = '';
	menu=getMenu(type);
	console.log(menu);
	var render = template.compile(menu); 
	var html = render({type: type});
//	console.log(html);
	$('.menu-wrapper').empty().append(html);
	$('.catalog-li').on('click',function(){
		 $(this).addClass('active').siblings('li').removeClass('active').addClass('collapsed').attr("aria-expanded","flase");
		 $('.collapsed+ul').removeClass('in').attr("aria-expanded","flase").css("height","0px");
	});
	$('.panel-collapse li').on('click',function(){
       	 $(this).addClass('active2').siblings('li').removeClass('active'); 
       	 });
})