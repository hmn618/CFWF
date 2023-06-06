/**
 * Created by wangqi on 2017/5/8.
 */
/**
 * Created by wangqi on 2017/5/9.
 */
/*------------------wechat-------------------*/
//var baseurl='http://10.108.215.75:8888/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
var openid,nick;
var doctorId,role;
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
                //console.log(data.datum.roleId);
                doctorId=data.datum.roleId;
                role=data.datum.role;
                if(role!="doctor"){
                    alert("请以医生身份进行登录！");
                    window.close();
                    WeixinJSBridge.call('closeWindow');
                    return false;
                }
                //console.log(doctorId);
            }else{
                alert(data.reason);
                window.close();
                WeixinJSBridge.call('closeWindow');
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
$(document).ready(function(){   console.log("haha");
    $(function(){
        var datatosend={
            "doctorId":doctorId
        };

        $.ajax({
            type: "post",
            url: urlOrigin+'/HealthControlProject/Doctor/findDoctorInfo',
            data:datatosend,
            crossDomain:true,
            dateType: "json",
            success:function(data){
                if(data.result==true){
                    console.log(data.datum);
                    var scan= urlpic+data.datum.qrCode;
                    $('#morning').html(data.datum.doctorName+'医生');
                    $('#scan').attr('href','A-2-Scan.html?doctorId='+doctorId);
                    $('#list').attr('href','A-2-memberlist.html?doctorId='+doctorId);
                    $('#reconsult').attr('href','A-2-reconsult.html?doctorId='+doctorId);
                    $('#article').attr('href','A-5-article.html?doctorId='+doctorId);
                    $('#video').attr('href','A-5-video.html?doctorId='+doctorId)
                }else{

                    //alert(data.MSG);
                }
            }

        });

    });
});
