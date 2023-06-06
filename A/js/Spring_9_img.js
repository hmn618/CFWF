$(window).load(function() {
	$('.wrapper').height($(window).height());
	$('.footer-img').width($('.footer-img').height());
	$('.footer-img img').height($('.footer-img img').width());
	
});
$(document).ready(function(){
	
	$('#reset').click(function(){
		$('#name').val('');
	})
})

/*------------------wechat-------------------*/
//var baseurl='http://192.168.31.74:8888/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
var openid,nick;
var role;
var memberId=decodeURI(getQueryString("memberId"));
var src;
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
					memberId = data.datum.roleId;
					//alert(memberId);
					role=data.datum.role;
					if(role==""){
						alert("您还未登录！");
						return false;
					}
					else if(role!="member"){
						alert("请以会员身份进行登录！");
						window.close();
						window.open("","_self").close();
						WeixinJSBridge.call('closeWindow');
						return false;
					}
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

/*---------------------------------ajax---------------------*/
//从数据库读入已存信息
	var datatosend = {
		'memberId':memberId
	};
	console.log(memberId);
	$.ajax({
		type:"post",
		url:urlOrigin+'/HealthControlProject/Member/findMemberInfo',
		crossDomain:true,
		data:datatosend,
		dataType:"json",
		success:function(data){
			if(data.result==true){	
				UserName=data.datum.memberName;
				$("#nick").text(UserName);
				console.log(data.datum.profileDir);
				console.log(data.datum.birthTime);
				if(data.datum.birthTime != "" && data.datum.birthTime != null){
					var datetime1=data.datum.birthTime.substring(0,4);
					var datetime2=data.datum.birthTime.substring(5,7);
					var datetime3=data.datum.birthTime.substring(8,10);
					var datetime=datetime1+"-"+datetime2+"-"+datetime3;
				}
				
				// 基本信息
				var photo;
				if(data.datum.profileDir==""||data.datum.profileDir==null){
					photo="../img/pzh/user.png";
				}
				else{
					photo = urlpic+data.datum.profileDir;
				}
				$("#addPicId").attr("src",photo);
				$("#name").val(data.datum.memberName);
				$("#gender option:selected").text(data.datum.gender);
				$("#tel").val(data.datum.contractInfoMap.tel);
				$("#wechat").val(data.datum.openId);
				$("#birthday").val(datetime);
				$("#job").val(data.datum.occupation);
				$("#height").val(data.datum.height);
				$("#weight").val(data.datum.weight);
				
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown) {
			//console.log(XMLHttpRequest.status);
			//console.log(XMLHttpRequest.readyState);
			//console.log(textStatus);
		}
	});

/*-----------------------------------------------------*/


	
		//-----------------wrap covers all the elements with form----------------------------
	$("#imgUpload").wrap("<form id='myupload' name='userfile' action='http://182.92.4.200:8660/HealthControlProject/uploadfile/uploadFileMember' method='post' enctype='multipart/form-data'></form>");
	$("#imgUpload").on("change",function(){ 
	    $("#myupload").ajaxSubmit({
	        dataType:  'json', 
	        success: function(data) {
	            src=urlpic+data.datum;
	            console.log(src);
				$("#addPicId").attr("src",src);
				$("#addPicId").show();
				src=src.substring(urlpic.length,src.length);
	        },
	        error:function(xhr){ //fail to upload
	        	var a=JSON.stringify(xhr);
					alert(a)
	            console.log(xhr.responseText); //return the error msg
	        }
	    });
	  });
	  


function clickImgUp(){
	document.getElementById('imgUpload').click();

}

$('#btn2').click(function(){
	var name=$("#name").val();
		var sex=$("#gender option:selected").text();	
		var telephone=$("#tel").val();
		var wechat=$("#wechat").val();
		var birthday=$("#birthday").val();
		var d = new Date(Date.parse(birthday));
		var job=$("#job").val();
		var height=$("#height").val();
		var weight=$("#weight").val();
//		if(name==""||sex==""||birthday==""){
//			alert("请将信息补充完整！");
//			return false;
//		}
		if(name==""){
			alert("请将信息补充完整！");
			return false;
		}
		if(birthday==""){
			var datatosend={
				"memberId":memberId,
				"memberType":"普通会员",
				"profileDir":src,
				"memberName":name,
				"gender":sex,
				"tel":telephone,
				//"birthTime":birthday,
				"occupation":job,
				"height":height,
				"weight":weight
			};
		}
		else{
			var datatosend={
				"memberId":memberId,
				"memberType":"普通会员",
				"profileDir":src,
				"memberName":name,
				"gender":sex,
				"tel":telephone,
				"birthTime":birthday,
				"occupation":job,
				"height":height,
				"weight":weight
			};
		}

		console.log(datatosend);
		
		//send data to the backstage
		$.ajax({
			type:"get",
			url:urlOrigin+'/HealthControlProject/Member/updateMember',
			data:datatosend,
			crossDomain:true,
			dataType:"json",
			success:function(data){
				if(data.result==true){
					//alert('Success!');
					//console.log(data);
					window.location.href="Spring_8.html?memberId="+memberId;
				}else{
					//alert(data.MSG);
					var a=JSON.stringify(data);
					//alert(a);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				//console.log(XMLHttpRequest.status);
				//console.log(XMLHttpRequest.readyState);
				//console.log(textStatus);
				//console.log(XMLHttpRequest.responseText);
		    }
		});
}