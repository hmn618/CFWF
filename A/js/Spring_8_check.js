$(window).load(function() {
	init();	
});
$(window).resize(function() {
	init();
	
});
function init(){
	
	$('.footer-img').width($('.footer-img').height());
}
/*------------------wechat-------------------*/
//var baseurl='http://10.108.215.75:8888/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
function getQueryString(name) 
{
	//匹配这样的类似参数,但是他只取name参数部分 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	//这里是开始匹配，找到了返回对应url值，没找到返回null。
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var src;
var memberId=decodeURI(getQueryString("memberId"));



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
				//alert(a);
				if(data.result==true){
					UserName=data.datum.memberName;
					$("#nick").text(UserName);
					
					console.log(data.datum.profileDir);
					if(data.datum.profileDir==null||data.datum.profileDir==""){
						document.getElementById('photo').src="../img/pzh/user.png";
					}
					else{
						var photo=urlpic+data.datum.profileDir;
						document.getElementById('photo').src=photo;
					}
					if(data.datum.birthTime!=""&&data.datum.birthTime!=null){
						var birthday=data.datum.birthTime.substring(0,10);
					}else{
						var birthday='';
					}
					
					if(data.datum.contractInfoMap.tel!=""&&data.datum.contractInfoMap.tel!=null){
						var tel = data.datum.contractInfoMap.tel;
					}else{
						var tel = '';
					}
					
					document.getElementById('name').innerHTML=data.datum.memberName;
					document.getElementById('gender').innerHTML=data.datum.gender;
					document.getElementById('tel').innerHTML=tel;
					document.getElementById('birthday').innerHTML=birthday;
					document.getElementById('job').innerHTML=data.datum.occupation;
					var height,weight;
					if(data.datum.height!=""&&data.datum.height!=null){
						height=data.datum.height+"cm";
					}
					else{
						height="";
					}
					if(data.datum.weight!=""&&data.datum.weight!=null){
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
	
})


