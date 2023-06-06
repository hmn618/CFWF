 //var rooturl="http://192.168.31.206:8888";

$(document).ready(function () {
	
    $("#submitupdate").click(function(){
    	//用户名、旧密码、新密码、确认新密码信息
    	 var unameElement=$("#userName").val();
    	 var oldpwdElement= $("#oldPassword").val();
         var newpwdElement= $("#newPassword").val();
         var repwdElement=$("#confirmPassword").val();
         
         var datatosend0={
         	"userName":unameElement,
         	"oldPassword":oldpwdElement,
         	"newPassword":newpwdElement,
         	"confirmPassword":repwdElement,
         };
         
         else if(oldpwdElement=="null"||oldpwdElement==""){
         	alert("请输入原密码");
         	$("#oldPassword").val();
         	$("#oldPassword").focus();
         	return false;
         }
         else if(newpwdElement=="null"||newpwdElement==""){
         	alert("请输入新密码");
         	$("#newPassword").val();
         	$("#newPassword").focus();
         	return false;
         }
         else if(repwdElement=="null"||repwdElement==""){
         	alert("请再次输入新密码");
         	$("#confirmPassword").val();
         	$("#confirmPassword").focus();
         	return false;
         }
         else if(newpwdElement!=repwdElement){
         	alert("两次输入密码不一致");
         }
        
        else{
         	$.ajax({
         	type:"post",
         	url: urlOrigin+'/HealthControlProject/user/forgetPassword',
         	async: false,
         	data:datatosend0,
         	dataType:"json",
			crossDomain:true,
			success: function (data) {
            	var a=JSON.stringify(data);
				//alert(a);
                if(data.result==true){
                	alert("修改成功");
              window.location.href ='a-3-1-new.html';
					}else{
						alert("失败："+data.reason);
					}
               
            },
            error:function (data) {
                alert("error");
                var a=JSON.stringify(data);
                alert(a);
            }
        });
         } 
    })

    $("#submit").click(function () {

        // 账号信息
        var username= $("#member-id").val();
		var email=$("#email-id").val();       
		var datatosend = {
            "userName": username
         //   "?": email
            
         };
         if(username=="null"||username=="") 
		{
			alert("请输入用户名!")
			$("#member-id").val("");
			$("#member-id").focus();
			return false;	
		}
		
		
          $.ajax({
            type: "post",
            url: urlOrigin+'/HealthControlProject/user/forgetPassword',
            //url: rooturl+'/HealthControlProject/user/forgetPassword',
            async:false,
			data:datatosend,
			dataType:"json",
			crossDomain:true,
            success: function (data) {
            	var a=JSON.stringify(data);
				//alert(a);
                if(data.result==true){
                	alert("提交成功，请去您的邮箱查看~");
                window.location.href =a-3-1-login.html;
					}else{
						alert("提交失败，请重试");
					}
               
            },
            error:function (data) {
                alert("error");
                var a=JSON.stringify(data);
                alert(a);
            }
           
        });
    });
})