$('#navbar-collapse').collapse('toggle');
$('.login').click(function(){
	alert("抱歉您无权限使用该功能！")
})

$(document).ready(function(){
	var rootURL = urlOrigin;	

	var recordPerPage=10;
	function getCurrentPages(datatosend,url){
		$.ajax({
		type: "get", //方式是post或是get，与后台人员协商，一般为get
		url: url,
		data: datatosend, //发送的数据即刚刚定义的那个
		crossDomain: true, //不用管
		dataType: "json", //不用管
		success: function(data) {    console.log(data);
			if(data.result == true) {
				var datas = data.datum.articleVideos;			
				var txt="";				
				for(var i = 0; i < datas.length; i++) {

					var valuedata = datas[i];  
					var limit='';
					var content = valuedata.content.replace(/<[^>]+>/g,"");//去掉所有的html标记 
					//var content=valuedata.content;
					if(content.length>103){
						content=content.substr(0,103);
			            limit='<a href="'+getTxt(valuedata.articleVideoId)+'" style="color: #0E73CE;">...阅读更多</a>';
					}
					txt+='<div class="content" id='+ valuedata.articleVideoId +'><h4><a href="'+getTxt(valuedata.articleVideoId)+'">'+valuedata.title+'</a></h4><p>'
					+content+limit+'</p></div>'					
				}
				$(".current").text(datatosend.pageNo);
				$('.contentlist').html(txt);
				var rowCounts=data.datum.totalCount;
				$('.total-pages').text(Math.ceil(rowCounts/recordPerPage));
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) { //这是错误处理，会在console口输出一些状态号帮助我们查看错误原因
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(textStatus);
			console.log(XMLHttpRequest.responseText);
		}
	});
	}

	
	$(document).on('click','.first-page',function(){
		sendData = {
		"msgType": 1,
		"pageNo":1,
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
	})
	
    $(document).on('click','.last-page',function(){
    	sendData = {
		"msgType": 1,
		"pageNo":$('.total-pages').text(),
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
    })
	
	 $(document).on('click','.prev',function(){
	 	var currentPage=parseInt($('.current').text())-1;
	 	if(currentPage>=1){
	 		sendData = {
		"msgType": 1,
		"pageNo":currentPage,
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
	 	}
	 	
	 })
	 
	 $(document).on('click','.next',function(){
	 	var currentPage=parseInt($('.current').text())+1;
	 	if(currentPage <= $('.total-pages').text()){
	 		sendData = {
		"msgType": 1,
		"pageNo":currentPage,
		pageSize:recordPerPage
	   }; 
	 getCurrentPages(sendData,url);
	 	}
	 	
	 })
	
	$(document).on('click','.go',function(){
		var currentPageNum = parseInt($(".skip").val());
		if(currentPageNum <= parseInt($('.total-pages').text()) && currentPageNum >= 1)
		{
			sendData = {
		"msgType": 1,
		"pageNo":currentPageNum,
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
		}
	});
	/*---------------显示文章列表-------------------------------*/
	var datatosend={
		"msgType": 1,
		"pageNo":1,
		pageSize:recordPerPage
	};
	 var url=rootURL+"/HealthControlProject/article_video/queryArticleVideoByMsgType";
	getCurrentPages(datatosend,url);

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


