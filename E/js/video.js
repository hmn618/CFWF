$('#navbar-collapse').collapse('toggle');
$('.login').click(function(){
	alert("抱歉您无权限使用该功能！")
})
$(document).ready(function(){
		var rootURL = urlOrigin;	
	var recordPerPage=3;
	function getCurrentPages(datatosend,url){
	$.ajax({
		type: "get", //方式是post或是get，与后台人员协商，一般为get
		url: url,
		data: datatosend, //发送的数据即刚刚定义的那个
		crossDomain: true, //不用管
		dataType: "json", //不用管
		success: function(data) {  console.log(data)
			if(data.result == true) {
				var datas = data.datum.articleVideos;
				var txt="";
				
				for(var i = 0; i < datas.length; i++) {
					var valuedata = datas[i];		
					var img=urlpic+valuedata.coverDir;
					txt+='<div class="col-md-4 col-sm-6 col-xs-12"><div class="video"><video id="example_video_1"'
					+'class="video-js vjs-default-skin" controls preload="none" width="235" height="125" poster="'+img+'" data-setup="{}">'
					+'<source src="'+valuedata.originalLink+'"'
					+'type="video/mp4" /></div><div class="videoBottom"><img src="../img/e/u18997.png" alt="" />'+	valuedata.author			    			
				    +'<img src="../img/e/u18995.png" alt="" />'+valuedata.updateTime+'</div></div>'					
				}
				$('.content').html(txt);
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
		"msgType": 2,
		"pageNo":1,
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
	})
	
    $(document).on('click','.last-page',function(){
    	sendData = {
		"msgType": 2,
		"pageNo":$('.total-pages').text(),
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
    })
	
	 $(document).on('click','.prev',function(){
	 	var currentPage=parseInt($('.total-pages').text())-1;
	 	if(currentPage>=1){
	 		sendData = {
		"msgType": 2,
		"pageNo":currentPage,
		pageSize:recordPerPage
	}; 
	 	}	 	
	 getCurrentPages(sendData,url);
	 })
	 
	 $(document).on('click','.next',function(){
	 	var currentPage=parseInt($('.current').text())+1;
	 	if(currentPage <= $('.total-pages').text()){
	 		sendData = {
		"msgType": 2,
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
		"msgType": 2,
		"pageNo":currentPageNum,
		pageSize:recordPerPage
	}; 
	 getCurrentPages(sendData,url);
		}
	});
	/*---------------显示文章列表-------------------------------*/
	var datatosend={
		"msgType": 2,
		"pageNo":1,
		pageSize:recordPerPage
	};
	 var url=rootURL+"/HealthControlProject/article_video/queryArticleVideoByMsgType";
	getCurrentPages(datatosend,url);


})
