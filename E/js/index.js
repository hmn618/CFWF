console.log("11");
$('#navbar-collapse').collapse('toggle')
/*灰色方块*/
$('.col').css({
	"height":$('.carousel-inner').height()*0.7+'px',
	"margin-top":$('.carousel-inner').height()*0.15+'px'
});
$(window).resize(function(){
	$('.col').css({
	"height":$('.carousel-inner').height()*0.7+'px',
	"margin-top":$('.carousel-inner').height()*0.15+'px'
});
});
/*保证 文章专栏与视频保持同高度*/
if($(window).width()>992&&$('.m1').height()>125)
{
	$('.m2').css('height',$('.m1').height()+'px');	
}
$(window).resize(function(){
	if($(window).width()>992&&$('.m1').height()>125){
		$('.m2').css('height',$('.m1').height()+'px');
	}		
	});

$('.login').click(function(){
	alert("抱歉您无权限使用该功能！")
})

var rootURL = urlOrigin;	
/*-------------------front and back end connection------------------*/
$(document).ready(function(){
	var datatosend = {
		"msgType": 1,
		"pageNo":1,
		"pageSize":3
	};
	var datatosend1 = {
		"msgType": 2,
		"pageNo":1,
		"pageSize":3
	};
	//文章
	$.ajax({
		type: "get", //方式是post或是get，与后台人员协商，一般为get
		url: rootURL+"/HealthControlProject/article_video/queryArticleVideoByMsgType",
		data: datatosend, //发送的数据即刚刚定义的那个
		crossDomain: true, //不用管
		dataType: "json", //不用管
		success: function(data) { console.log(data)
			if(data.result == true) {
				var datas = data.datum;			
				var txt="";		
				var num=datas.totalCount>3?3:datas.totalCount; console.log(num);
				for(var i = 0; i < num; i++) {  
					var valuedata = datas.articleVideos[i];
					var limit='';  
					var content = valuedata.content.replace(/<[^>]+>/g,"");//去掉所有的html标记 
					if(content.length>69){
						content=content.substr(0,69);
			            limit='<a href="'+getTxt(valuedata.articleVideoId)+'" style="color: #0E73CE;">...阅读更多</a>';
					}
					var img=urlpic+valuedata.coverDir;
					txt+='<div class="media m1"><div class="media-left"><a href="'+getTxt(valuedata.articleVideoId)+'"><img src="'
					+img+'" class="media-object"/></a></div><div class="media-body"><p class="media-heading">'
					+'<a href="'+getTxt(valuedata.articleVideoId)+'">'+valuedata.title+'</a></p><p>'+content+limit+'</p></div></div>'
					
				}				
				$('#article').html(txt);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { //这是错误处理，会在console口输出一些状态号帮助我们查看错误原因
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(textStatus);
			console.log(XMLHttpRequest.responseText);
		}
	});
	//视频
	$.ajax({
		type: "get", //方式是post或是get，与后台人员协商，一般为get
		url: rootURL+"/HealthControlProject/article_video/queryArticleVideoByMsgType",
		data: datatosend1, //发送的数据即刚刚定义的那个
		crossDomain: true, //不用管
		dataType: "json", //不用管
		success: function(data) { console.log(data);
			if(data.result == true) {
				var datas = data.datum;				
				var txt="";				
				var num=datas.totalCount>3?3:datas.totalCount;
				for(var i = 0; i < num; i++) {
					var valuedata = datas.articleVideos[i];	
					var img=urlpic+valuedata.coverDir;
					txt+='<div class="media m2"><div class="media-left videoImg"><video id="example_video_1"'
					+'class="video-js vjs-default-skin" controls preload="none" width="235" height="125" '
					+'poster="'+img+'" data-setup="{}"><source src="'+valuedata.originalLink+'" type="video/mp4" />'						     
					+'</div><div class="media-body"><div class="t1"><img src="../img/e/u18997.png" alt="" />'+valuedata.author
					+'</div><div class="t1"><img src="../img/e/u18995.png"/>'+valuedata.updateTime+'</div></div></div>'	
				}
				$('#video').html(txt);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { //这是错误处理，会在console口输出一些状态号帮助我们查看错误原因
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(textStatus);
			console.log(XMLHttpRequest.responseText);
		}
	});
})
//跳转到详情页
function getTxt(val){       
		var id=val;//获取button的id
		var hrefStr=makeurl(id);
		return hrefStr;//跳转到新页面
	}

function makeurl(name){
	var encode=encodeURI(name);//encodeURI() 函数可把字符串作为 URI 进行编码。
	var url="detail.html";
	var encode=encodeURI(url + "?id=" + encode);//这里我把值名取名为value，可以取名为其他你想要的名字，看网址就能看出是什么意思了。
	return encode;
	
}

