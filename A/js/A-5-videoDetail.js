/**
 * Created by wangqi on 2017/5/7.
 */
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
   // var openid='oCYIxuOvyU6YMBpiBvxAxQ5W8QDY';
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
            // console.log("+++++");
            //console.log(XMLHttpRequest.status);
            //console.log(XMLHttpRequest.readyState);
            //console.log(textStatus);
        }
    });
}
/*---------------------------------------------------*/
$(document).ready(function(){

    /*-------------------ajax-------------------------*/
    var id=decodeURI(getQueryString("id"));//获取传过来的值，并解码
    //var id=141;
    var datatosend = {
        "id": id
    };
    console.log(datatosend);
    $.ajax({
        type:"get",//方式是post或是get，与后台人员协商，一般为get
        url:urlOrigin+'/HealthControlProject/article_video/queryArticleVideoById',//处理的后台action的URL
        data:datatosend,
        dataType:"json",//不用管
        success:function(data)
        {
            console.log(data);
            if(data.result == true)
            {
                console.log(data.datum);
                data = data.datum;
                var articleVideo = data.articleVideo;

                var txt='<div class="top"><div id="title">'+articleVideo.title+'</div><date id="date1">'+articleVideo.updateTime+'</date>'+
            '</div><div id="text">'+articleVideo.abstractContent+'</div>';
                $('.content').html(txt);

                var txt='<video id="example_video_1" class="video-js vjs-default-skin" controls preload="none" width="640"'+
                    'height="264" poster="'+articleVideo.coverDir+'"><source class="link" src="'+articleVideo.originalLink+'" type="video/mp4" />'+
                    '<source class="link2" src="http://vjs.zencdn.net/v/oceans.webm" type="video/webm" />'+
                    '<source class="link2" src="http://vjs.zencdn.net/v/oceans.ogv" type="video/ogg" />'+
                    '<track kind="captions" src="demo.captions.vtt" srclang="en" label="English"></track>'+
                    '<track kind="subtitles" src="demo.captions.vtt" srclang="en" label="English"></track>';

                $('.video').html(txt);

                videojs(document.getElementById('example_video1'), {

                }, function() {
                    // This is functionally the same as the previous example.
                });

            }
            else{
               // alert(data.MSG);
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