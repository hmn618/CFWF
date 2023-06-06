/*------------------wechat-------------------*/
//var baseurl='http://10.108.215.75:8888/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
var openid,nick;
var doctorId;
//获取url参数
	function getQueryString(name) {
		//console.log("调用了getQueryString");
		//接收参数id
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
		if (r != null) 
			return unescape(r[2]);
		return null;
	  }
	if(!sessionStorage.openid){
		//alert("sessionStorage.openid是空："+sessionStorage.openid);
		var code=decodeURI(getQueryString("code"));
		//alert("code是："+code);
		//console.log(code);
		
		getOpenid();
	}else{
		//alert("sessionStorage.openid不是空："+sessionStorage.openid);
		
		openid = sessionStorage.openid;
		nick = sessionStorage.nick;
		getUser();
	}
	
	function getOpenid(){
		//console.log("调用了getOpenid");
		var datatocode = {"code":code,"lang":"zh_CN"};
		$.ajax({	
			type:"post",
			url:baseurlOpenid+"/getOAuth2UserInfo",
			async:false,
			data:datatocode,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				//console.log(data);
				if(data.result==true){
					//alert("查找openid成功！");
					nick = data.datum.nickname;
					openid = data.datum.openId;
					sessionStorage.openid = openid;
					sessionStorage.nick = nick;
					
					//alert("openid是："+openid);
					//alert("nick是："+nick);
					getUser();
				}else{
					//alert(data.reason);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
		            //console.log("+++++");
		            //console.log(XMLHttpRequest.status);
					//console.log(XMLHttpRequest.readyState);
					//console.log(textStatus);
		       }
		});
		
	}
	
	//	getUser();
	function getUser(){
		
		//console.log("1");
		var datatosend = {"openId":openid};
		$.ajax({	
			type:"post",
			url:urlOrigin+"/HealthControlProject/user/getRoleInfoByOpenId",
			async:false,
			data:datatosend,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				//console.log(data);
				if(data.result==true){
					//alert("查找用户成功！");
					doctorId=data.datum.roleId;
					//alert(doctorId);
				}else{
					//alert(data.reason);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
		            //console.log("+++++");
		            //console.log(XMLHttpRequest.status);
					//console.log(XMLHttpRequest.readyState);
					//console.log(textStatus);
		       }
		});
	}

/*---------------------------------------------------*/
$(document).ready(function(){
	var id=decodeURI(getQueryString("id"));//获取传过来的值，并解码
	var datatosend = {
		"id": id
	};
	console.log(id);
		$.ajax({
			type:"get",//方式是post或是get，与后台人员协商，一般为get
			url:urlOrigin+'/HealthControlProject/article_video/queryArticleVideoById',//处理的后台action的URL
			data:datatosend,
			dataType:"json",//不用管
			success:function(data)
			{
				if(data.result == true)
				{	

				    data = data.datum;
				    var articleVideo = data.articleVideo;
				    
					$("#title").html(articleVideo.title);
					$("#date1").html(articleVideo.updateTime);
					$("#author").html(articleVideo.author);
					$("#remark").html(articleVideo.abstractContent);
					$("#passage").html(articleVideo.content);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {//这是错误处理，会在console口输出一些状态号帮助我们查看错误原因
				//console.log(XMLHttpRequest.status);
				//console.log(XMLHttpRequest.readyState);
				//console.log(textStatus);
			}
		});
})


//取得传过来的某个参数
function getQueryString(name) 
{
	//匹配这样的类似参数,但是他只取name参数部分 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	//这里是开始匹配，找到了返回对应url值，没找到返回null。
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}