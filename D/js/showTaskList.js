
var burl = urlOrigin+"/HealthControlProject/Consultant/findConsultantInfo";
var baseurl=urlOrigin+"/HealthControlProject/task/selectTodayTask";
var baseurlchao=urlOrigin+"/HealthControlProject/task/selectTimeout";
var baseurlzhao=urlOrigin+"/HealthControlProject/Member/findMemberInfo";
var consultantID,sumId,memberName;
var allListId=new Array();
window.onload=function(){	
	
}
$(function(){
	function getQueryString(name) {
		//接收参数id
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
		if (r != null) 
			return unescape(r[2]);
		return null;
	 }
//	$(".conName").text("贾蜜蜜");
//	consultantID = 1;
	consultantID=decodeURI(getQueryString("consultantID"));
	getNameById(consultantID);
	getYiCaseByConsultantID(consultantID);
	getWeiCaseByConsultantID(consultantID);
	getChaoCaseByConsultantID(consultantID);
	function getNameById(consultantID){
		var datatosend = {"consultantId":consultantID};
		$.ajax({	
			type:"post",
			url:burl,
			async:false,
			data:datatosend,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				if(data.result==true){
//					alert("获取顾问姓名成功！");
					var conName = data.datum.consultantName;
//					alert(conName);
					$(".conName").text(conName);
				}else{
					alert(data.reason);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
//		            console.log("+++++");
		            console.log(XMLHttpRequest.status);
					console.log(XMLHttpRequest.readyState);
					console.log(textStatus);
		       }
		});
	}
	function getYiCaseByConsultantID(consultantID){
		var datatosend = {"consultantId":consultantID,"isAccomplish":"true"};
		$.ajax({	
			type:"post",
			url:baseurl,
			async:false,
			data:datatosend,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				if(data.result==true){
//					alert("显示已完成任务成功！");
					var htmlTemp,operate,listId;
//					$(".goodsListTemp").empty();
					$("table.yi tr:not(:first)").empty();
					for(var i=0;i<data.datum.length;i++){
						 listId = i+1;
						 sumId=data.datum[i].id;
						 allListId[i]=sumId;
						 var type = data.datum[i].description;
						 
//						var type;
//						switch (typeNum)
//						  {
//						  case 0:
//						    type="填写客户日志";
//						    break;
//						  case 1:
//						    type="回复客户日志";
//						    break;
//						  case 2:
//						    type="登记客户资料";
//						    break;
//						  case 3:
//						    type="填写干预计划";
//						    break;
//						  case 4:
//						    type="调整管理阶段";
//						    break;
//						  case 5:
//						    type="周期延长提醒";
//						    break;
//						  case 6:
//						    type="教育内容推送";
//						    break;
//						  case 7:
//						    type="问题会员处理";
//						    break;
//						  case 8:
//						    type="客户日常回访";
//						    break;
//						  default:
//						    type="没有任务";
//						  }				
						 
						 var targetID = data.datum[i].targetId;
						 memberName = data.datum[i].memberName;
						 //获取会员的姓名memberName
//						 getMemberById(targetID);
						 var finishTime = data.datum[i].finishTime;
						 var isTimeout = data.datum[i].isTimeout;
						 htmlTemp=listTemp(listId,type,targetID,memberName,finishTime,isTimeout);
						 $("table.yi").append(htmlTemp);
					}
				}else{
					alert(data.reason);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
//		            console.log("+++++");
		            console.log(XMLHttpRequest.status);
					console.log(XMLHttpRequest.readyState);
					console.log(textStatus);
		       }
		});
	}
	function getWeiCaseByConsultantID(consultantID){
		var datatosend = {"consultantId":consultantID,"isAccomplish":"false"};
		$.ajax({	
			type:"post",
			url:baseurl,
			async:false,
			data:datatosend,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				if(data.result==true){
//					alert("显示未完成任务成功！");
					var htmlTemp2,operate,listId;
//					$(".goodsListTemp").empty();
					$("table.wei tr:not(:first)").empty();
					for(var i=0;i<data.datum.length;i++){
						 listId = i+1;
						 sumId=data.datum[i].id;
						 allListId[i]=sumId;
						 var type = data.datum[i].description;
						 
//						var type;
//						switch (typeNum)
//						  {
//						  case 0:
//						    type="填写客户日志";
//						    break;
//						  case 1:
//						    type="回复客户日志";
//						    break;
//						  case 2:
//						    type="登记客户资料";
//						    break;
//						  case 3:
//						    type="填写干预计划";
//						    break;
//						  case 4:
//						    type="调整管理阶段";
//						    break;
//						  case 5:
//						    type="周期延长提醒";
//						    break;
//						  case 6:
//						    type="教育内容推送";
//						    break;
//						  case 7:
//						    type="问题会员处理";
//						    break;
//						  case 8:
//						    type="客户日常回访";
//						    break;
//						  default:
//						    type="没有任务";
//						  }			
						var targetID = data.datum[i].targetId;
						 memberName = data.datum[i].memberName;
						 //获取会员的姓名memberName
//						 getMemberById(targetID);
						 var createTime = data.datum[i].createTime;
						 htmlTemp2=listTempWei(listId,type,targetID,memberName,createTime);
						 $("table.wei").append(htmlTemp2);
					}
				}else{
					alert(data.reason);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
//		            console.log("+++++");
		            console.log(XMLHttpRequest.status);
					console.log(XMLHttpRequest.readyState);
					console.log(textStatus);
		       }
		});
	}
	function getChaoCaseByConsultantID(consultantID){
		var datatosend = {"consultantId":consultantID};
		$.ajax({	
			type:"post",
			url:baseurlchao,
			async:false,
			data:datatosend,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				if(data.result==true){
//					alert("显示超时任务成功！");
					var htmlTemp2,operate,listId;
//					$(".goodsListTemp").empty();
					$("table.chao tr:not(:first)").empty();
					for(var i=0;i<data.datum.length;i++){
						 listId = i+1;
						 sumId=data.datum[i].id;
						 allListId[i]=sumId;
						 var type = data.datum[i].description;
						 
//						var type;
//						switch (typeNum)
//						  {
//						  case 0:
//						    type="填写客户日志";
//						    break;
//						  case 1:
//						    type="回复客户日志";
//						    break;
//						  case 2:
//						    type="登记客户资料";
//						    break;
//						  case 3:
//						    type="填写干预计划";
//						    break;
//						  case 4:
//						    type="调整管理阶段";
//						    break;
//						  case 5:
//						    type="周期延长提醒";
//						    break;
//						  case 6:
//						    type="教育内容推送";
//						    break;
//						  case 7:
//						    type="问题会员处理";
//						    break;
//						  case 8:
//						    type="客户日常回访";
//						    break;
//						  default:
//						    type="没有任务";
//						  }			
						var targetID = data.datum[i].targetId;
						 memberName = data.datum[i].memberName;
						 //获取会员的姓名memberName
//						 getMemberById(targetID);
						 var createTime = data.datum[i].createTime;
						 htmlTemp2=listTempChao(listId,type,targetID,memberName,createTime);
						 $("table.chao").append(htmlTemp2);
					}
				}else{
					alert(data.reason);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
//		            console.log("+++++");
		            console.log(XMLHttpRequest.status);
					console.log(XMLHttpRequest.readyState);
					console.log(textStatus);
		       }
		});
	}
//	function  getMemberById(targetID){
//		var datatosend = {"targetID":targetID};
//		$.ajax({	
//			type:"post",
//			url:baseurl+"/goods/findGoodsListNumByOpenid",
//			async:false,
//			data:datatosend,
//			dataType:"json",
//			crossDomain:true,
//			success:function(data){
//				if(data.result==true){
////					alert("获取会员信息成功！");
//					memberName= data.datum.memberName;
//				}else{
//					alert(data.reason);
//				}
//			},
//			error: function(XMLHttpRequest, textStatus, errorThrown) {
////		            console.log("+++++");
//		            console.log(XMLHttpRequest.status);
//					console.log(XMLHttpRequest.readyState);
//					console.log(textStatus);
//		       }
//		});
//	}
	function listTemp(listId,type,targetID,memberName,finishTime,isTimeout){
		if(isTimeout==true){
			var str ='<tr class="table_content"> '
			+'<td>LISTID</td> '
			+'<td><a href="#" class="look" data-id="TARGETID" data-toggle="modal" data-target="#myModal1" data-backdrop="static"">MEMBERNAME</a></td>'
			+'<td>TYPE</td>'
			+'<td>FINISHTIME</td>'
			+'<td>超时完成</td>'
			+'</tr>';
		    str=str.replace("LISTID",listId).replace("TYPE",type).replace("TARGETID",targetID).replace("MEMBERNAME",memberName).replace("FINISHTIME",finishTime);
		    return str;
		}
		else{
			var str ='<tr class="table_content"> '
			+'<td>LISTID</td> '
			+'<td><a href="#" class="look" data-id="TARGETID" data-toggle="modal" data-target="#myModal1" data-backdrop="static"">MEMBERNAME</a></td>'
			+'<td>TYPE</td>'
			+'<td>FINISHTIME</td>'
			+'<td>正常完成</td>'
			+'</tr>';
		    str=str.replace("LISTID",listId).replace("TYPE",type).replace("TARGETID",targetID).replace("MEMBERNAME",memberName).replace("FINISHTIME",finishTime);
		    return str;
		}
		
	}
	function listTempWei(listId,type,targetID,memberName,createTime){
		var str ='<tr class="table_content"> '
			+'<td>LISTID</td> '
			+'<td><a href="#" class="look" data-id="TARGETID" data-toggle="modal" data-target="#myModal1" data-backdrop="static"">MEMBERNAME</a></td>'
			+'<td>TYPE</td>'
			+'<td>CREATETIME</td>'
			+'</tr>';
		str=str.replace("LISTID",listId).replace("TYPE",type).replace("TARGETID",targetID).replace("MEMBERNAME",memberName).replace("CREATETIME",createTime);
		return str;
	}
	function listTempChao(listId,type,targetID,memberName,createTime){
		var str ='<tr class="table_content"> '
			+'<td>LISTID</td> '
			+'<td><a href="#" class="look" data-id="TARGETID" data-toggle="modal" data-target="#myModal1" data-backdrop="static"">MEMBERNAME</a></td>'
			+'<td>TYPE</td>'
			+'<td>CREATETIME</td>'
			+'</tr>';
		str=str.replace("LISTID",listId).replace("TYPE",type).replace("TARGETID",targetID).replace("MEMBERNAME",memberName).replace("CREATETIME",createTime);
		return str;
	}
	
	$("a.look").on("click",function(){
		var userID = $(this).data('id');
//		alert(userID);
		getUser(userID);
		
	});
	function getUser(userID){
//		console.log("1");
		var datatouser = {"memberId":userID};
		//var allListId=new Array();
		$.ajax({	
			type:"post",
			url:baseurlzhao,
			async:false,
			data:datatouser,
			dataType:"json",
			crossDomain:true,
			success:function(data){
//				console.log(data);
				if(data.result==true){
//					alert("查找某顾问信息成功！");
					var pic;
					if(data.datum.profileDir==""||data.datum.profileDir==null){
						pic = "../img/moren.jpg";
					}else{
						pic = urlpic+data.datum.profileDir;
					}
					var name = data.datum.memberName;
					var sex = data.datum.gender;
					var age = data.datum.age;
					var tel = data.datum.contractInfoMap.tel;
					var email = data.datum.contractInfoMap.email;
					var step = data.datum.periodPhase;
					var doctorName = data.datum.doctorName;
					var label = data.datum.tag;
					$(".pic").attr("src",pic);
					$("span.aaa").html(name);
					$("span.bbb").html(sex);
					$("span.ccc").html(age);
					$("span.ddd").html("");
					$("span.ddd").html(tel);
					$("span.eee").html("");
					$("span.eee").html(email);
					$("span.fff").html(step);
					$("span.ggg").html(doctorName);
					$("span.hhh").html(label);
				}else{
					alert(data.reason);
					
				}
			},
//			error: function(XMLHttpRequest, textStatus, errorThrown) {
////		            console.log("+++++");
//		            console.log(XMLHttpRequest.status);
//					console.log(XMLHttpRequest.readyState);
//					console.log(textStatus);
//		       }
			error:function (data) {
		            var a=JSON.stringify(data);
		            alert(a);
		     }
		});
	}
	
	//返回
	$('.returnPage').on('click',function(){
		window.history.back();
	});
	
	
		
})
