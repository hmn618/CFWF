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
				console.log(data);
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
					memberId=data.datum.roleId;
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
						//$(".container").css('display','none');
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
	$(function(){
		var datatosend={
			"memberId":memberId
		};
		
		$.ajax({
			type: "post",
			url: urlOrigin+'/HealthControlProject/Member/findMemberInfo',
			data:datatosend,
			crossDomain:true,
			dateType: "json",
			success:function(data){
				var a=JSON.stringify(data);
				console.log(a);
				/*if(data==null){
					
				}*/
				//console.log(data.datum);
				var periodPhase = data.datum.periodPhase;
				console.log(periodPhase);
				var x;
				switch (periodPhase){
					case "010":
						x="准备期";
						break;
					case "020":
						x="启动期";
						break;
					case "030":
						x="过渡期";
						break;
					case "040":
						x="维持期";
						break;
					case "050":
						x="回访期";
						break;
					case "060":
						x="暂停期";
						break;
				}
				document.getElementById("period").innerHTML=x;
				console.log(x);
	//	console.log($("#period").html(x));
				if(periodPhase == "020"){
					$.ajax({
						type: "post",
						url: urlOrigin+'/HealthControlProject/InterveneProjectStartup/viewInterveneProject',
						data:datatosend,
						crossDomain:true,
						dateType: "json",
						success:function(data){
							var a=JSON.stringify(data);
							if(data.result==true){
								//$("#period").html(data.datum.periodPhaseName);
								/*$("#food1").html(data.datum.breakfastCerealflour);
								$("#food2").html(data.datum.breakfastFoodbar);
								$("#food3").html(data.datum.breakfastEgg);
								$("#food4").html(data.datum.lunchFoodbar);
								$("#food5").html(data.datum.lunchVegetable);
								$("#food6").html(data.datum.lunchMeat);
								$("#food7").html(data.datum.lunchFish);
								$("#food8").html(data.datum.dinnerCerealflour);
								$("#food9").html(data.datum.dinnerFoodbar);
								$("#food10").html(data.datum.dinnerVegetable);
								$("#food11").html(data.datum.dinnerMeat);
								$("#food12").html(data.datum.dinnerFish);*/
								
								var txt1 = "";
								txt="<div class='row row1'><div id='reference'><h1>综合</h1><div class='col-xs-7'><p class='food'>一日能量参考范围</p>"
									+"<p id='ref1' class='foo'>"+data.datum.energyReferencerange+"</p><p class='food'>Kcal</p></div><div class='col-xs-5'><p class='food'>三餐分配</p>"
									+"<p id='ref2' class='foo'></p>"+data.datum.allocationBreakfast+"<p class='food'>:</p><p id='ref3' class='foo'>"+data.datum.allocationLunch+"<p class='food'>:</p><p id='ref4' class='foo'>"
									+data.datum.allocationDinner+"</p></div><div class='col-xs-12'><p class='food'>(早，中餐可以吃的丰盛一些，晚餐后没有运动，可以少吃一点，清淡一些)</p></div></div></div>"
									+"<div class='row row1' id='breakfast'><h1>早餐</h1><div id='breakfast-content'><div class='col-xs-4'><p class='food'>谷粒粉</p><p id='food1' class='foo'>"
									+data.datum.breakfastCerealflour+"</p><p class='food'>包</p></div><div class='col-xs-4'><p class='food'>食物棒</p><p id='food2' class='foo'>"+data.datum.breakfastFoodbar+"</p><p class='food'>根</p></div><div class='col-xs-4'><p class='food'>鸡蛋</p><p id='food3' class='foo'>"
									+data.datum.breakfastEgg+"</p><p class='food'>个</p></div><div class='col-xs-12'><p class='food'>（无糖，无淀粉），</p><p id='food13' class='foo'>"+data.datum.breakfastSupplement+"</p></div></div></div>"
									+"<div class='row row1' id='lunch'><h1>午餐</h1><div id='lunch-content'><div class='col-xs-6'><p class='food'>食物棒</p><p id='food4' class='foo'>"+data.datum.lunchFoodbar+"</p><p class='food'>根</p></div>"
									+"<div class='col-xs-6'><p class='food'>蔬菜</p><p id='food5' class='foo'>"+data.datum.lunchVegetable+"</p><p class='food'>两</p></div>"
									+"<p class='food food1'>荤菜&nbsp;&nbsp;瘦肉</p><p id='food6' class='foo'>"+data.datum.lunchMeat+"</p><p class='food'>两</p>"
									+'<p class="food">+</p><p class="food">鱼虾</p><p id="food7" class="foo">'+data.datum.lunchFish+'</p><p class="food">两，</p><p id="food14" class="foo">'+data.datum.lunchSupplement+'</p></div></div>'
									+'<div class="row row1" id="dinner"><h1>晚餐</h1><div id="dinner-content"><div class="col-xs-4"><p class="food">谷粒粉</p><p id="food8" class="foo">'+data.datum.dinnerCerealflour+'</p><p class="food">包</p></div>'
									+'<div class="col-xs-4"><p class="food">食物棒</p><p id="food9" class="foo">'+data.datum.dinnerFoodbar+'</p><p class="food">根</p></div><div class="col-xs-4"><p class="food">蔬菜</p><p id="food10" class="foo">'
									+data.datum.dinnerVegetable+'</p><p class="food">两</p></div><p class="food food1">荤菜&nbsp;&nbsp;瘦肉</p><p id="food11" class="foo">'+data.datum.dinnerMeat+'</p><p class="food">两</p><p class="food">+</p><p class="food">鱼虾</p><p id="food12" class="foo">'
									+data.datum.dinnerFish+'</p><p class="food">两，</p><p id="food15" class="foo">'+data.datum.dinnerSupplement+'</p></div></div><div class="row row1"><div id="otherItem"><h1>其他</h1><div class="col-xs-12"><p class="food">运动：</p><p id="oth1" class="foo">'+data.datum.movement
									+'</p></div><div class="col-xs-12"><p class="food">饮水：</p><p id="oth2" class="foo">'
									+data.datum.drinking+'</p><p class="food">ml/日</p><p class="food">(白水，柠檬水，菊花茶)</p></div></div></div>';
									
									$("#interInfo").html(txt);
							}else{
								  //alert(data.MSG);
							}
						}
					});
				}
				else{
					/*--------------------------非启动期--------------------------------*/
					$.ajax({
						type: "post",
						url: urlOrigin+'/HealthControlProject/InterveneProject/viewInterveneProject',
						data:datatosend,
						crossDomain:true,
						dateType: "json",
						success:function(data){
							var a=JSON.stringify(data);
							if(data.result==true){
								console.log(data.datum.interveneInfo);
								//$("#period").html(data.datum.periodPhaseName);
								$("#interInfo").html(data.datum.interveneInfo);
							}else{
								  alert(data.MSG);
							}
						}
					});
				}
			}
		});
	});
})
