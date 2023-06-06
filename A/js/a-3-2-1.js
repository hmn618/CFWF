/*------------------wechat-------------------*/
//var baseurl='http://10.108.215.75:8888/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
var openid,nick;
var memberId,role;
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
					console.log(memberId);
					role=data.datum.role;
					if(role==""){
						alert("您还未登录！");
						return false;
					}
					else if(role!="member"){
						alert("请以会员身份进行登录！");
						window.close();
						WeixinJSBridge.call('closeWindow');
						return false;
					//alert(memberId);
				}else{
					//alert(data.reason);
				}
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

/*---------------------------------------------------*/
$(document).ready(function(){
	$(function(){
		var datatosend={
			"memberId":memberId
		};
		console.log(datatosend);
		$.ajax({
			type: "post",
			url: urlOrigin+'/HealthControlProject/Member/findMemberInfo',
			data:datatosend,
			crossDomain:true,
			dateType: "json",
			success:function(data){
				var a=JSON.stringify(data);
				if(data.result==true){
					console.log(data.datum.profileDir);
					if(data.datum.profileDir==null||data.datum.profileDir==""){
						document.getElementById('photo').src="../img/moren.jpg";
					}
					else{
						var photo=urlpic+data.datum.profileDir;
						document.getElementById('photo').src=photo;
					}
					if(data.datum.birthTime!=""&&data.datum.birthTime!=null){
						var birthday=data.datum.birthTime.substring(0,10);
					}
					
					document.getElementById('name').innerHTML=data.datum.memberName;
					document.getElementById('sex').innerHTML=data.datum.gender;
					document.getElementById('telephone').innerHTML=data.datum.contractInfoMap.tel;
					document.getElementById('birthday').innerHTML=birthday;
					document.getElementById('job').innerHTML=data.datum.occupation;
					var height,weight;
					if(data.datum.height!=""){
						height=data.datum.height+"cm";
					}
					else{
						height="";
					}
					if(data.datum.weight!=""){
						weight=data.datum.weight+"kg";
					}
					else{
						weight="";
					}
					
					document.getElementById('height').innerHTML=height;
					document.getElementById('weight').innerHTML=weight;
				}else{
					
					  //alert(data.MSG);
				}
			}
			
		})
	})
	$(".btn").click(function(){
		window.location.href="a-3-2-member_modify.html?memberId="+memberId;
	})
})


