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


/*---------------top&down------------------------------------*/
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
				console.log(a);
				if(data.result==true){
					$("#name").html(data.datum.doctorName);
					$("#who").html(data.datum.memberName);
					
					var	consultantId=data.datum.consultantId;
					if(consultantId==""||consultantId==null){
						$(".dialog").html("请拨打咨询电话");
					    $(".telephone").html("4006735730");
						$(".telephone").attr("href","tel:4006735730");
					}
					$.ajax({
						type:"get",
						url:urlOrigin+"/HealthControlProject/Consultant/findConsultantInfo",
						async:true,
						data:{consultantId:consultantId},
						dataType:"json",
						crossDomain:true,
						success:function(data){
							if(data.result == true){
					    			//$(".telNos").attr("href",data.datum.contractInfoMap.tel);
					    			//alert($(".telNos").attr("href"));
					    			console.log(data.datum.contractInfoMap.tel);
					    			$(".telephone").html(data.datum.contractInfoMap.tel);
					    			$(".telephone").attr("href","tel:"+data.datum.contractInfoMap.tel);
					    			
							}
						},
						error:function(XMLHttpRequest, textStatus, errorThrown) {
					         console.log(XMLHttpRequest.status);
						     console.log(XMLHttpRequest.readyState);
							 console.log(textStatus);
					   }
					});
					
				}else{
					
					  //alert(data.MSG);
				}
			}
			
		})
	})


/*---------------center---------------------------------*/
$(function(){
		var datatosend1={
			"memberId":memberId
		}
	$.ajax({
		type: "get",
		url: urlOrigin+'/HealthControlProject/MemberRevisit/queryReplyInfo',
		data:datatosend1,
		crossDomain:true,
		dateType: "json",
		success:function(data){
			var a=JSON.stringify(data);
			console.log(a);
			var reply_msg="";
			if(data.result==true){
				console.log(data.datum);
				var reply_send="";
				var reply_time1="发送时间:";
				var reply_time2="反馈时间:";
				
				if(data.datum==null||data.datum==""){
					reply_msg="您还未发送复诊请求";
					reply_time1=reply_time1+"未发送";
					reply_time2=reply_time2+"无反馈";
				}
				else{
					if(data.datum.replyInfo==2){
						reply_msg="依现情况，不需额外复诊";
						reply_time1=reply_time1+data.datum.sendTime;
						reply_time2=reply_time2+data.datum.replyTime;
					}
					else if(data.datum.replyInfo==1){
						reply_msg="请及时复诊";
						reply_time1=reply_time1+data.datum.sendTime;
						reply_time2=reply_time2+data.datum.replyTime;
					}
					else if(data.datum.replyInfo==0){
						reply_msg="您的复诊请求已经被受理安排，请耐心等待";
						reply_time1=reply_time1+data.datum.sendTime;
						reply_time2=reply_time2+"未反馈";
					}
				}
				
				/*var date_msg="";
				if(data.datum.replyInfo!=0){
					date_msg="回复时间："+data.datum.replyTime;
				}
				else{
					data_msg="";
				}*/
				$("#warn").html(reply_msg);
				$(".time1").html(reply_time1);
				$(".time2").html(reply_time2);
				/*----------------bar---------------*/
				var status=parseInt(data.datum.operateStatus);
				console.log(status);
					switch (status){
						case 1:
							$("#circle1").css("background-color","#0044CC");
							$("#op1").css("color","darkblue");
							break;
						case 2:
							$("#circle1").css("background-color","#0044CC");
							$("#op1").css("color","darkblue");
							$("#circle2").css("background-color","#0044CC");
							$("#op2").css("color","darkblue");
							break;
						case 3:
							$("#circle1").css("background-color","#0044CC");
							$("#op1").css("color","darkblue");
							$("#circle2").css("background-color","#0044CC");
							$("#op2").css("color","darkblue");
							$("#circle3").css("background-color","#0044CC");
							$("#op3").css("color","darkblue");
							break;
					}
				
			}else{
				  //alert(data.MSG);
			}
		}
	})
	
	$(".tel").click(function(){
			
			document.getElementsByClassName("telephone")[0].click();
			console.log($(".telephone".html()));
		})
	
})
/*---------------down-----------------------------------*/