var rootURL = urlOrigin;	
$('.login').click(function(){
	alert("抱歉您无权限使用该功能！")
})
$(function(){
	var id=decodeURI(getQueryString("id"));//获取传过来的值，并解码  
	var datatosend={
		"id":id
	};
	$.ajax({
		type:"get",
		url:rootURL+"/HealthControlProject/article_video/queryArticleVideoById",
		data:datatosend,
		dataType:'json',
		success:function(data){  console.log(data);
			if(data.result==true){
				data=data.datum;
				datas=data.articleVideo;
				var articleVideo=datas.articleVideoId;
				var tags=data.tagsContent;
				var tagssplit = tags.split(",");
			
				var title=datas.title;
				var origin=datas.author;
				var time=datas.updateTime;  
				var content=datas.content;   
				
				var articleTag="";
				for(var i=0;i<tagssplit.length-1;i++){
					articleTag+=tagssplit[i]+",";
				}
				articleTag+=tagssplit[tagssplit.length-1];
				
				var txt="";
				txt+='<p class="t1">'+title+'</p><div class="t2"><span class="tags">本文所属类别:'
				+articleTag+'</span><span class="origin">来源：'+origin+'</span><span class="time">发布时间：'
				+time+'</span></div><p class="t3">'+content+'</p></div>';
				$('.content').html(txt);
				
			}
		}
	});
	
	
})
//取得参数
function getQueryString(name)
{
	var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)","i");
	var r=window.location.search.substr(1).match(reg);
	if(r!=null) return unescape(r[2]);return null;
}
