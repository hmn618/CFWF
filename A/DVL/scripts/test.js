/*------------------wechat-------------------*/
//var baseurl='http://192.168.31.74:8888/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
var openid,nick;
var memberId,role;
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
		           // console.log("+++++");
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
					role=data.datum.role;
					if(role==""){
						alert("您还未登录！");
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

/*---------------------------------------------------*/
$(document).ready(function(){
	var datatosend0={
		"memberId":memberId
	}
		$.ajax({
			type:"get",
			url:urlOrigin+"/HealthControlProject/phaseSummarize/queryNewestPhaseSummarize",
			data:datatosend0,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				if(data.result==true){
					//alert("ok");
					$("#assistant").html(data.datum.phaseSummarizeInfo);
					//alert(1);
				}
				
				else{
					//alert(data.MSG);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("no");
		         console.log(XMLHttpRequest.status);
			     console.log(XMLHttpRequest.readyState);
				 console.log(textStatus);
		   }
		});
	
	
	var datatosend={
		"memberId":memberId,
		"number":100
	};
	$.ajax({
			type:"get",
			url:urlOrigin+"/HealthControlProject/indexProof/queryIndexForChart",
			data:datatosend,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				if(data.result==true){
					console.log(data.datum);
					//alert(2);
					//alert("ok");
					$("#assistant").html(data.datum.phaseSummarizeInfo);
					var data1 = {
						"describe": "体重曲线",
						"title": "体重",
						"objects": ["体重"],
						"property": [data.datum.logDate],
						"relationtype":2,
						"relations":{
							"体重":[data.datum.weight]
						}
					}
					
					var data2 = {
						"describe": "腰围曲线",
						"title": "腰围",
						"objects": ["腰围"],
						"property": [data.datum.logDate],
						"relationtype":2,
						"relations":{
							"腰围":[data.datum.waistLine]
						}
					}
					var data3 = {
						"describe": "空腹血糖曲线",
						"title": "空腹血糖",
						"objects": ["空腹血糖"],
						"property": [data.datum.logDate],
						"relationtype":2,
						"relations":{
							"空腹血糖":[data.datum.bloodSugarEmptyStomach]
						}
					}
					var data4 = {
						"describe": "餐后2h血糖曲线",
						"title": "餐后2h血糖",
						"objects": ["餐后2h血糖"],
						"property": [data.datum.logDate],
						"relationtype":2,
						"relations":{
							"餐后2h血糖":[data.datum.bloodSugarAfter2h]
						}
					}
					var data5 = {
						"describe": "收缩压曲线",
						"title": "收缩压",
						"objects": ["收缩压"],
						"property": [data.datum.logDate],
						"relationtype":2,
						"relations":{
							"收缩压":[data.datum.systolicPressure]
						}
					}
					var data6 = {
						"describe": "舒张压曲线",
						"title": "舒张压",
						"objects": ["舒张压"],
						"property": [data.datum.logDate],
						"relationtype":2,
						"relations":{
							"舒张压":[data.datum.diastolicPressure]
						}
					}
					var weight = document.getElementById('weight');
					DVL.line(weight, data1);
					var waist = document.getElementById('waist');
					DVL.line(waist, data2);
					var blood_sugar = document.getElementById('blood_sugar');
					DVL.line(blood_sugar, data3);
					var two_hour = document.getElementById('two_hour');
					DVL.line(two_hour, data4);
					var shrink = document.getElementById('shrink');
					DVL.line(shrink, data5);
					var relax = document.getElementById('relax');
					DVL.line(relax, data6);
				}
				
				else{
					//alert(data.MSG);
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("no");
		         console.log(XMLHttpRequest.status);
			     console.log(XMLHttpRequest.readyState);
				 console.log(textStatus);
		   }
		});
});
