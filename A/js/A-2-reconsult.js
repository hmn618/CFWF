/**
 * Created by wangqi on 2017/5/9.
 */
/*------------------wechat-------------------*/
//var baseurl='http://111.207.243.66:9099/';
//var baseurlOpenid="http://182.92.222.75/wechatTestService";
var openid,nick;
var doctorId,role;
doctorId=130;

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
               // alert(data.reason);

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
                doctorId = data.datum.roleId;
                role=data.datum.role;
                if(role!="doctor"){
                    alert("请以医生身份进行登录！");
                    window.close();
                    WeixinJSBridge.call('closeWindow');
                    return false;
                }
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
$(document).ready(function(){

    /*---------------title-------------------*/
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
                    var datas=data.datum;
                    console.log(data.datum);
                    $('#morning').html(datas.doctorName+'医生');
                    $('#scan').attr('href','A-2-Scan.html?doctorId='+doctorId);

                }else{

                    //alert(data.MSG);
                }
            }

        });

    });

    /*--------------------Undeal-------------------*/
    $(function(){
        var datatosend={
            "queryFlag":0,
            "doctorId":doctorId
        };

        $.ajax({
            type: "get",
            url: urlOrigin+'/HealthControlProject/MemberRevisit/viewForDoctor',
            data:datatosend,
            crossDomain:true,
            dateType: "json",
            success:function(data){
                console.log(data);
                if(data.result==true){
                    var txt="";
                    //alert(data.datum);

                    var a = data.datum;
                    if(a==null||data.datum.length==0){
                        // document.getElementById('totalNum').innerHTML=0;
                    }
                    else{
                        $("#totalNum").html(data.datum.length);
                        for(var i=0;i<data.datum.length;i++){
                            var datas=data.datum[i];
                            var label=data.datum[i].tag.split(",");
                            var label0="";
                            if(label==""||label==null){
                                label0="";
                            }
                            else{
                                for(var k=0;k<label.length;k++){
                                    label0 += "<mark class='marker'>"+label[k]+"</mark>";
                                }

                            }
                            //var photo=urlpic+data.datum[i].profileDir;
                            var photo;
                            if(data.datum[i].profileDir==""||data.datum[i].profileDir==null){
                               photo="../img/head.png";
                            }
                            else{
                                photo = urlpic+data.datum[i].profileDir;
                            }
                            // txt+="<div class='row patient'><div class='col-xs-3'> <img src='"+photo+"' alt='会员照片' class='photo' /></div>"
                            //     +"<div class='col-xs-4' style='margin-left:10px; width:41%;padding-right:0;'><p class='introduction name'>姓名："+data.datum[i].memberName+"</p>"
                            //     +"<p class='introduction'>电话："+data.datum[i].telePhone+"</p></div><div class='col-xs-3' style='width:18%;'><button type='button' class='btn agree' id="+data.datum[i].revisitId+" onclick='javascript:getRevisitId1(this.id);'>需要</button><div class='revisit' style='display:none;'>"
                            //     +data.datum[i].revisitId+"</div>"
                            //     +"<button type='button' class='btn disagree' id="+data.datum[i].revisitId+"  onclick='javascript:getRevisitId2(this.id);'>不需要</button></div><a style='text-decoration:none' href='a-2-4-1?memberId="
                            //     +data.datum[i].memberId+"'><img class='arrow' src='../img/arrow.png' alt='More'/></a></div></div> "
                            //     +"<div class='row label1'><p class='introduction bq'>标签："+label0+"</p></div>";
							
							var tags = datas.tag.split(",");
                            
							var t="";
							if(tags.length==1){
								
								t='<span style="float:left; padding-left:10px; padding-top:5px;margin:5px;width:70px; height:30px; background-color:#DCDCDC; border-radius:25px;">'+tags+'</span>';
							}
							if(datas.tag==null||datas.tag==""){
									t="无";
							}
							
							for(var p=0;p<tags.length-1;p++){
					    		t += '<span style="float:left; padding-left:10px; padding-top:5px;margin:5px;width:70px; height:30px; background-color:#DCDCDC; border-radius:25px;">'+tags[p]+'</span>';
							}
							//alert(datas.gender);
							var gender=datas.gender;
							if(gender==undefined){
								gender=" ";
							}
                            txt+='<div class="item row"><div class="left col-sm-2 col-xs-2"><img src="'+photo+'" alt="会员头像" class="photo img-circle" style="width:61.52px;height:61.52px;"></div>'
                                +'<div class="col-sm-6 col-xs-6"><p>'+datas.memberName+ '('+gender+')</p>'+'<button style="background-color: rgb(64, 199, 125);color:white;border-radius: 20px; border:none;" type="button" data-toggle="modal" data-target="#myModal'+i+'">基本病情</button><div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" style="background-color: aliceblue;"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">基本病情</h4>'
                                +'</div><div class="modal-body" style="height:200px;">'+t+'</div></div></div></div></div>'+'<div class="right col-sm-3 col-xs-3">'
                                +'<div class="agree" id="'+datas.revisitId+'" onclick="javascript:getRevisitId1(this.id);">同意 </div><div class="revisit" style="display:none;">'
                                +data.datum[i].revisitId+'</div><div class="disagree" id="'+datas.revisitId+'" onclick="javascript:getRevisitId2(this.id);">不同意 </div></div>'
                                +'<a href="../page/a-2-4-1.html?memberId='+datas.memberId+'"><div class="arrow col-sm-1 col-xs-1">'
                                +'<span class="glyphicon glyphicon-chevron-right"></span></div></div></a>';


                        }
                        $('#unfinished').html(txt);
                    }


                    /*-----------------agree----------------*/
                    $(".agree").click(function(){
                        var revisitId = getRevisitId1(this.id);
                        var datatosend={
                            "replyInfo":1,
                            "revisitId":revisitId
                        };
                        //alert(revisitId);
                        $.ajax({
                            type: "get",
                            url: urlOrigin+'/HealthControlProject/MemberRevisit/replySendApply',
                            data:datatosend,
                            crossDomain:true,
                            dateType: "json",
                            success:function(data){
                                var a=JSON.stringify(data);
                                if(data.result==true){
                                    //alert('ok');
                                    window.location.reload();
                                }else{
                                    //  alert(data.MSG);
                                }
                            }
                        })
                    });

                    /*-------------------disagree-----------------*/
                    $(".disagree").click(function(){
                        //var revisit = document.getElementsByClassName('revisit')[0].innerHTML;
                        var revisitId = getRevisitId1(this.id);
                        var datatosend={
                            "replyInfo":2,
                            "revisitId":revisitId
                        };

                        $.ajax({
                            type: "get",
                            url: urlOrigin+'/HealthControlProject/MemberRevisit/replySendApply',
                            data:datatosend,
                            crossDomain:true,
                            dateType: "json",
                            success:function(data){
                                var a=JSON.stringify(data);
                                if(data.result==true){
                                    //alert('ok');
                                    window.location.reload();
                                }else{
                                    //alert(data.MSG);
                                }
                            }
                        })
                    });
                }else{

                    //alert(data.MSG);
                }
            }

        })

    })

    $("#left-tab").click(function(){
        var datatosend={
            "queryFlag":0,
            "doctorId":doctorId
        };
        $.ajax({
            type: "get",
            url: urlOrigin+'/HealthControlProject/MemberRevisit/viewForDoctor',
            data:datatosend,
            crossDomain:true,
            dateType: "json",
            success:function(data){
                console.log(data);
                if(data.result==true){
                    var txt="";
                    //alert(data.datum);

                    var a = data.datum;
                    if(a==null||data.datum.length==0){
                        // document.getElementById('totalNum').innerHTML=0;
                    }
                    else{
                        $("#totalNum").html(data.datum.length);
                        for(var i=0;i<data.datum.length;i++){
                            var datas=data.datum[i];
                            var label=data.datum[i].tag.split(",");
                            var label0="";
                            if(label==""||label==null){
                                label0="";
                            }
                            else{
                                for(var k=0;k<label.length;k++){
                                    label0 += "<mark class='marker'>"+label[k]+"</mark>";
                                }

                            }
                            //var photo=urlpic+data.datum[i].profileDir;
                            var photo;
                           // alert(datas.profileDir);
                            if(data.datum[i].profileDir==null||data.datum[i].profileDir==""){
                            	
                                photo="../img/head.png";
                            }
                            else{
                                photo = urlpic+data.datum[i].profileDir;
                            }
                            // txt+="<div class='row patient'><div class='col-xs-3'> <img src='"+photo+"' alt='会员照片' class='photo' /></div>"
                            //     +"<div class='col-xs-4' style='margin-left:10px; width:41%;padding-right:0;'><p class='introduction name'>姓名："+data.datum[i].memberName+"</p>"
                            //     +"<p class='introduction'>电话："+data.datum[i].telePhone+"</p></div><div class='col-xs-3' style='width:18%;'><button type='button' class='btn agree' id="+data.datum[i].revisitId+" onclick='javascript:getRevisitId1(this.id);'>需要</button><div class='revisit' style='display:none;'>"
                            //     +data.datum[i].revisitId+"</div>"
                            //     +"<button type='button' class='btn disagree' id="+data.datum[i].revisitId+"  onclick='javascript:getRevisitId2(this.id);'>不需要</button></div><a style='text-decoration:none' href='a-2-4-1?memberId="
                            //     +data.datum[i].memberId+"'><img class='arrow' src='../img/arrow.png' alt='More'/></a></div></div> "
                            //     +"<div class='row label1'><p class='introduction bq'>标签："+label0+"</p></div>";
							
							var tags = datas.tag.split(",");
                            
							var t="";
							if(tags.length==1){
								
								t='<span style="float:left; padding-left:10px; padding-top:5px;margin:5px;width:70px; height:30px; background-color:#DCDCDC; border-radius:25px;">'+tags+'</span>';
							}
							if(datas.tag==null||datas.tag==""){
									t="无";
							}
							
							for(var p=0;p<tags.length-1;p++){
					    		t += '<span style="float:left; padding-left:10px; padding-top:5px;margin:5px;width:70px; height:30px; background-color:#DCDCDC; border-radius:25px;">'+tags[p]+'</span>';
							}
							var gender=datas.gender;
							if(gender==undefined){
								gender=" ";
							}
                            txt+='<div class="item row"><div class="left col-sm-2 col-xs-2"><img src="'+photo+'" alt="会员头像" class="photo img-circle" style="width:61.52px;height:61.52px;"></div>'
                                +'<div class="col-sm-6 col-xs-6"><p>'+datas.memberName+ '('+gender+')</p>'+'<button style="background-color: rgb(64, 199, 125);color:white;border-radius: 20px; border:none;" type="button" data-toggle="modal" data-target="#myModal'+i+'">基本病情</button><div class="modal fade" id="myModal'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" style="background-color: aliceblue;"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">基本病情</h4>'
                                +'</div><div class="modal-body" style="height:200px;">'+t+'</div></div></div></div></div>'+'<div class="right col-sm-3 col-xs-3">'
                                +'<div class="agree" id="'+datas.revisitId+'">同意 </div><div class="disagree" id="'+datas.revisitId+'">不同意 </div></div>'
                                +'<a href="../page/a-2-4-1.html?memberId='+datas.memberId+'"><div class="arrow col-sm-1 col-xs-1">'
                                +'<span class="glyphicon glyphicon-chevron-right"></span></div></div></a>';


                        }
                        $('#unfinished').html(txt);
                    }


                    /*-----------------agree----------------*/
                    $(".agree").click(function(){
                        var revisitId = getRevisitId1(this.id);
                        var datatosend={
                            "replyInfo":1,
                            "revisitId":revisitId
                        };
                        //alert(revisitId);
                        $.ajax({
                            type: "get",
                            url: urlOrigin+'/HealthControlProject/MemberRevisit/replySendApply',
                            data:datatosend,
                            crossDomain:true,
                            dateType: "json",
                            success:function(data){
                                var a=JSON.stringify(data);
                                if(data.result==true){
                                    //alert('ok');
                                    window.location.reload();
                                }else{
                                    //  alert(data.MSG);
                                }
                            }
                        })
                    });

                    /*-------------------disagree-----------------*/
                    $(".disagree").click(function(){
                        //var revisit = document.getElementsByClassName('revisit')[0].innerHTML;
                        var revisitId = getRevisitId1(this.id);
                        var datatosend={
                            "replyInfo":2,
                            "revisitId":revisitId
                        };

                        $.ajax({
                            type: "get",
                            url: urlOrigin+'/HealthControlProject/MemberRevisit/replySendApply',
                            data:datatosend,
                            crossDomain:true,
                            dateType: "json",
                            success:function(data){
                                var a=JSON.stringify(data);
                                if(data.result==true){
                                    //alert('ok');
                                    window.location.reload();
                                }else{
                                    //alert(data.MSG);
                                }
                            }
                        })
                    });
                }else{

                    //alert(data.MSG);
                }
            }

        })


    })
    /*--------------------Deal-------------------*/
    $("#right-tab").click(function(){
        var datatosend={
            "queryFlag":1,
            "doctorId":doctorId
        };

        $.ajax({
            type: "get",
            url: urlOrigin+'/HealthControlProject/MemberRevisit/viewForDoctor',
            data:datatosend,
            crossDomain:true,
            dateType: "json",
            success:function(data){
                console.log(data);
                if(data.result==true){
                    var txt="";
                    var a = data.datum;
                    if(a==null||data.datum.length==0){
                        // document.getElementById('totalNum').innerHTML=0;
                    }
                    else{
                        for(var i=0;i<data.datum.length;i++){
                            var datas=data.datum[i];
                            var label=data.datum[i].tag.split(",");
                            var label0 = "";
                            if(label==""||label==null){
                                label0="";
                            }
                            else{
                                for(var k=0;k<label.length;k++){
                                    label0 += "<mark class='marker'>"+label[k]+"</mark>";
                                }
                            }
                            /*for(var i=0;i<data.datum.length;i++){
                             var label=data.datum[i].tag.split(",");
                             var label0="";
                             if(label==""||label==null){
                             label0="";
                             }
                             else{
                             for(var k=0;k<label.length;k++){
                             label0 += "<mark class='marker'>"+label[k]+"</mark>";
                             }
                             }*/
                            if(data.datum[i].replyInfo=='1'){
                                var reply = "已同意";
                            }
                            else{
                                var reply="不同意";
                            }
                            $("#revisit").val(data.datum[i].revisitId);
                            //var photo=urlpic+data.datum[i].profileDir;
                            var photo;
                            if(data.datum[i].profileDir==""||data.datum[i].profileDir==null){
                                photo="../img/head.png";
                            }
                            else{
                                photo = urlpic+data.datum[i].profileDir;
                            }
                            // txt+="<div class='row patient1'><div class='col-xs-3'> <img src='"+photo+"' alt='会员照片' class='photo' /></div>"
                            //     +"<div class='col-xs-4' style='margin-left:10px; width:41%;padding-right:0;'><p class='introduction name'>姓名："+data.datum[i].memberName+"</p>"
                            //     +"<p class='introduction'>电话："+data.datum[i].telePhone+"</p></div><div class='col-xs-3' style='width:18%;'><button class='btn btn1'>"+reply+"</button></div><a style='text-decoration:none' href='a-2-4-1?memberId="
                            //     +data.datum[i].memberId+"'><img class='arrow' src='../img/arrow.png' alt='More'/></a></div> "
                            //     +"<div class='row label2'><p class='introduction bq' style='margin-left:10px;'>标签："+label0+"</p></div><div class='revisit' style='display:none;'>"+data.datum[i].revisitId+"</div>";

                            var tags = datas.tag.split(",");
                            
							var t="";
							if(tags.length==1){
								
								t='<span style="float:left; padding-left:10px; padding-top:5px;margin:5px;width:70px; height:30px; background-color:#DCDCDC; border-radius:25px;">'+tags+'</span>';
							}
							if(datas.tag==null||datas.tag==""){
									t="无";
							}
							
							for(var p=0;p<tags.length-1;p++){
					    		t += '<span style="float:left; padding-left:10px; padding-top:5px;margin:5px;width:70px; height:30px; background-color:#DCDCDC; border-radius:25px;">'+tags[p]+'</span>';
							}
							var gender=datas.gender;
							if(gender==undefined){
								gender=" ";
							}
                            txt+='<div class="item row"><div class="left col-sm-2 col-xs-2"><img src="'+photo+'" alt="会员头像" class="photo img-circle" style="width:61.52px;height:61.52px;"></div>'
                                +'<div class="col-sm-6 col-xs-6"><p>'+datas.memberName+ '('+gender+')</p>'+'<button style="background-color: rgb(64, 199, 125);color:white;border-radius: 20px; border:none;" type="button" data-toggle="modal" data-target="#myModalt'+i+'">基本病情</button><div class="modal fade" id="myModalt'+i+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" style="background-color: aliceblue;"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">基本病情</h4>'
                                +'</div><div class="modal-body" style="height:200px;">'+t+'</div></div></div></div></div>'+'<div class="right col-sm-3 col-xs-3">'
                                +'<div class="disagree" style="margin-top:35px;"id="'+datas.revisitId+'">'+reply+'</div></div>'
                                +'<a href="../page/a-2-4-1.html?memberId='+datas.memberId+'"><div class="arrow col-sm-1 col-xs-1">'
                                +'<span class="glyphicon glyphicon-chevron-right"></span></div></div></a>';
                        }

                        $('#finished').html(txt);
                    }


                }else{

                    //alert(data.MSG);
                }
            }

        })
    });
})

function getRevisitId1(x){
    var revisit = document.getElementById(x);
    var revisitId = revisit.id;
    $(revisit).parent().parent('row').css("display","none");
    return revisitId;
}
function getRevisitId2(x){
    var revisit = document.getElementById(x);
    var revisitId = revisit.id;
    $(revisit).parent().parent('row').css("display","none");
    return revisitId;
}