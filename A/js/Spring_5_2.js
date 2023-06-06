/**
 * written By pzh on 2017/5/5
 */



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
					alert(data.reason);
                	window.close();
                	WeixinJSBridge.call('closeWindow');
                	return false;
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

/*-------------------------------------------------------------------------*/
$(window).load(function() {
	$.cookie("state", 6, { expires: 1 });
	if(memberId==""||memberId==undefined){
		$(".log").click(function(){
			alert('请先注册会员');
		});
		$(".feedback").click(function(){
			alert('请先注册会员');
		});
		$(".relook").click(function(){
			alert('请先注册会员');
		});
		$(".state").click(function(){
			alert('请先注册会员');
						
		});
		$(".index").click(function(){
			alert('请先注册会员');
						
		});
	}
})


$(document).ready(function() {
	var datatosend={
		"memberId":memberId
	};
	$.ajax({
		type:"post",//方式是post或是get，与后台人员协商，一般为get
		url:urlOrigin+'/HealthControlProject/Member/findMemberInfo',//处理的后台action的URL
		data:datatosend,//发送的数据即刚刚定义的那个
		crossDomain:true,//不用管
		dataType:"json",//不用管
		success:function(data){
			//这时候就开始在接收数据成功后的一些动作，随意设置操作DOM，或是其他需要的操作都在这里
			var a=JSON.stringify(data);
			//alert(a);
			if(data.result == true){
				UserName=data.datum.memberName;
				$("#nick").text(UserName);
				
				var memberType=data.datum.memberType;
				if(memberType=="普通会员"){
					$(".feedback").click(function(){
						alert('对不起，普通会员不能享受此项服务！');
					});
					$(".relook").click(function(){
						alert('对不起，普通会员不能享受此项服务！');
					});
					$(".state").click(function(){
						alert('对不起，普通会员不能享受此项服务！');
						
					});
//					$(".index").click(function(){
//						alert('对不起，普通会员不能享受此项服务！');
//						
//					});
				}else{
					$(".feedback").click(function(){
						//localStorage.clear();
						var display = document.getElementById('log-remark').style.display
						if(display!='none'){
							localStorage.flag = 1;
							var date = new Date();//现在时刻
							var dateIntegralPoint = new Date();//用户登录时刻的下一个整点，也可以设置成某一个固定时刻
							dateIntegralPoint.setHours(29);//小时数增加1
							dateIntegralPoint.setMinutes(0);
							dateIntegralPoint.setSeconds(0);
//							dateIntegralPoint.setHours(date.getHours());//小时数增加1
//							dateIntegralPoint.setMinutes(date.getMinutes());
//						    dateIntegralPoint.setSeconds(date.getSeconds()+3);
							//alert(dateIntegralPoint-date);
							setTimeout("localStorage.clear();",dateIntegralPoint-date);
							window.location.href='Spring_13.html';
						}else{
							window.location.href='Spring_13.html';
						}
						
						
					});
					$(".relook").click(function(){
						window.location.href='Spring_14.html';
					});
					$(".state").click(function(){
						window.location.href='Spring_15.html';
						document.getElementById('state-remark').style.display='none';
						$.cookie("hasClick2", "true", { expires: 1 });
						
					});
				}
				
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
			
			
			
			
			}
				
			},
		error:function(XMLHttpRequest, textStatus, errorThrown) {//这是错误处理，会在console口输出一些状态号帮助我们查看错误原因
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(textStatus);
			console.log(XMLHttpRequest.responseText);
	    }
	});
	
	/*---------------按时间查询--------------*/
	$('#USER_AGE').change(function(){
		var queryDate = $("#USER_AGE").val();
		//		alert(date);
		/*----------------时间---------------*/
		var myDate = new Date();
		var date1 = myDate.getDate().toString();
		var month = myDate.getMonth()+1;
		var year = myDate.getFullYear().toString();
		if(month<10){
			month = "0"+month.toString();
		}
		else{
			month.toString();
		}
		if(date1<10){
			date1 = "0"+date1.toString();
		}
		else{
			date1.toString();
		}
		 fullDate = year+'-'+month+'-'+date1;
		//alert(queryDate);
		//alert(fullDate);
		//alert(queryDate==fullDate);
		//var memberId=485;
		var datatosend={
			'memberId':memberId,
			'logDate' : queryDate
			
		};
		if(queryDate==fullDate){
			window.location.href='Spring_6.html?memberId='+memberId+"&logDate="+queryDate;
		}
		else{
			
		}
		$.ajax({
			type:"get",
			url:urlOrigin+"/HealthControlProject/lossweight/queryForWeChat",
			data:datatosend,
			dataType: "json",
			success:function(data){
				//alert(data.datum);
				//alert(data.datum.logWeightLog.satisfaction);
						var a=JSON.stringify(data);

					if(data.datum==null){
						alert("无当日日志！");
			       }else{
			            window.location.href='Spring_6_check.html?memberId='+memberId+"&logDate="+queryDate;
		            }
				
			}
		});
		
		
		
	});
	
	/*------------点击我的日志----------------*/
	$('.log').click(function(){
		if(memberId!=undefined){
			window.location.href='Spring_new.html?memberId='+memberId;
		}
	})
	/*------------点击我的指标----------------*/
	$('.index').click(function(){
		if(memberId!=undefined){
			window.location.href='a-4-3-1.html?memberId='+memberId;
		}
	})
	/*-------------------顾问反馈小红点-----------------*/
	$(function(){
		
		var myDate = new Date();
		var date1 = myDate.getDate().toString();
		var month = myDate.getMonth()+1;
		var year = myDate.getFullYear().toString();
		if(month<10){
			month = "0"+month.toString();
		}
		else{
			month.toString();
		}
		if(date1<10){
			date1 = "0"+date1.toString();
		}
		else{
			date1.toString();
		}
		 fullDate = year+'-'+month+'-'+date1;
		
		var datatosend={
			'memberId':memberId,
			'logDate' : fullDate 
		};
		//console.log(datatosend);
		$.ajax({
			type:"get",
			url:urlOrigin+"/HealthControlProject/lossweight/queryForWeChat",
			data:datatosend,
			dataType: "json",
			success:function(data){
						
				if(data.result==true){
					
					
					if(data.datum!=null&&data.datum.logReply!=null){
						var a=JSON.stringify(data.datum.logReply);
							//alert(a);
						var logReplyInfo=data.datum.logReply.logReplyInfo;
						if(logReplyInfo!=null&&logReplyInfo!=''){
							
							var a = localStorage.flag;
							//alert(a);
							if(a==undefined)
							
							{
								document.getElementById('log-remark').style.display='';
							}
						}
						
						
						
								//console.log(data.datum);
					}
				}
				//console.log(datatosend);
				//console.log(1);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
				/*var a=JSON.stringify(data);
							alert(a)*/
				//console.log(datatosend);
				//console.log(2);
				/*console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
				console.log(textStatus);*/
			}				
		});	
	})
		
	/*-------------------申请状态小红点-----------------*/
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
				var reply_msg="";
				if(data.result==true){
					if(data.datum==null||data.datum==''){
//						reply_msg="您还未发送复诊请求"
						
						
					}else{
						if(data.datum.replyInfo==2){
								var reply_msg=2;
								var replyMsg = $.cookie('state');
								var a = $.cookie("hasClick2");
								if(a==undefined)
								
								{
									if(reply_msg!=replyMsg){
									document.getElementById('state').style.display='';
									$.cookie('state',2,{ expires: 1 });
								}
							}
						}
						else if(data.datum.replyInfo==1){
							var reply_msg=1;
							var replyMsg = $.cookie('state');
							var a = $.cookie("hasClick2");
								if(a==undefined)
								
								{
									if(reply_msg!=replyMsg){
										document.getElementById('state').style.display='';
										$.cookie('state',1,{ expires: 1 });
									}
								}
						}
						else if(data.datum.replyInfo==0){
							var reply_msg=0;
							var replyMsg = $.cookie('state');
							var a = $.cookie("hasClick2");
								if(a==undefined)
								
								{
									if(reply_msg!=replyMsg){
										document.getElementById('state-remark').style.display='';
										$.cookie('state',0,{ expires: 1 });
									}
								}
						}
					
					
					
				}
					}else{
					  //alert(data.MSG);
				}
			}
		})
	})
	$('.footer-img').click(function(){
		window.location.href='Spring_8.html';
	})

	$(".tel").click(function(){
			
			document.getElementsByClassName("telephone")[0].click();
			console.log($(".telephone".html()));
		})
})
	
	
	
