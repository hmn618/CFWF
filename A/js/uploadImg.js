// var goodsURL;
var orientation;
var fileInputEle;
var exif;
$(function(){
		var w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
			if(w<500){
				var w2=w/320*10;
				//console.log(w2);
				document.getElementsByTagName("html")[0].style.fontSize=w2+"px";
			}else if(w<1000){
				var w2=w/600*15;
				//alert(w2);
				document.getElementsByTagName("html")[0].style.fontSize=w2+"px";
			}else{
				var w2=w/1060*20;
				//alert(w2);
				document.getElementsByTagName("html")[0].style.fontSize=w2+"px";
			}
			
			window.onresize=function(){
				var w=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
				if(w<500){
					var w2=w/320*10;
					//console.log(w2);
					document.getElementsByTagName("html")[0].style.fontSize=w2+"px";
				}else if(w<1000){
					var w2=w/600*15;
					document.getElementsByTagName("html")[0].style.fontSize=w2+"px";
				}else{
					var w2=w/1060*20;
					document.getElementsByTagName("html")[0].style.fontSize=w2+"px";
				}
			};
			$('#uploadDivBox').on("click",".file_btn",function(){
				$('#imgOne').click();
			});
});
var jcrop_api, boundx, boundy, xsize, ysize,uploadData,imgWidth,imgHeight,count=0;
/**
 * 从 file 域获取 本地图片 url
 */
uploadData = {
		cut : false
	};
function getFileUrl(sourceId) {
	var url;
//	if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
//		url = document.getElementById(sourceId).value;
//	} else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
//		url = window.URL
//				.createObjectURL(document.getElementById(sourceId).files
//						.item(0));
//	} else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
	if (window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1){
		url = window.webkitURL.createObjectURL(document.getElementById(sourceId).files.item(0));
	}else{
		url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
	}
		

//	}
	
	return url;
}

if(typeof FileReader === 'undefined') {
            file.disabled = true;
            alert('你的浏览器不支持FileReader，请更换firefox/chrome访问本页！');
        }

/**
 * 将本地图片 显示到浏览器上
 */
function preImg(sourceId) {
	
	var url = getFileUrl(sourceId);
//	alert(url);
	if(url!=null){
		var flag = selectPictrue($("#imgOne"),10, uploadData);//(fileInput, size, data)
//		alert(flag);
		if(flag!=false){
			count++;
			var targetId='target'+count;
			var html='<li class="img-display"><img src="" id="'+targetId+'" class="target" /><div class="imgdel" onclick="imgdel('+count+')"></div></li>';
			//$('#imageDiv ul').append(html);
			$(html).insertBefore($('.file_btn'));
					var imgPre = document.getElementById(targetId);
					imgPre.src = url;
					console.log(url);//blob
					var newImg = new Image(); // 新建一个图片对象
		
					$(newImg).attr("src" , url); // 将图片的src属性赋值给新建图片对象的src		
			if($('.target').size()>=1){
				$('.file_btn').hide();
			}//判断图片的个数
		}
	}
	 		fileInputEle = document.getElementById("imgOne");
	 		var file = fileInputEle.files[0],
                fr = new FileReader;
            
            fr.onloadend = function() {
                exif = EXIF.readFromBinaryFile(new BinaryFile(this.result)), html = [];
//               orientation =exif["Orientation"];
//               alert("orientation:"+orientation);//永远是0
//               alert("exif:"+exif["Orientation"]);//是对的
                html.push('<ol>');
                for(var key in exif) {
//              	alert("key:"+key);
                    var val = exif[key];
                    html.push('<li>', key, '&nbsp;&nbsp;:&nbsp;&nbsp;<em>');
                    html.push(val, '</em></li>');
                }
                html.push('</ol>');
               // document.getElementById('console').innerHTML = html.join('');
            };
            
            fr.readAsBinaryString(file);
}

/**
 * 删除浏览器中显示的图片
 */
function imgdel(n){
	var targetId='#target'+n;
	$(targetId).parent().remove();
	if($('.target').size()<1){
		$('.file_btn').removeAttr("style");
		$('.file_btn').show();
	}
	$("#imgOne").remove();
	var inputHtml = '<input type="file" onchange="preImg(this.id)" accept="image/jpeg,image/png" class="file" name="uploadImg" id="imgOne" />';
	$(".upload_div").append(inputHtml);
}

/**
 * 点击取消按钮，关闭上传图片弹框
 */
 
function closeUploadBox() {
	$("#uploadImgBox").remove();
	
	jcrop_api = null;
}

/**
 * 点击上传按钮
 */
function uploadImg(imgId) {
	selectPictrue($("#imgOne"), 10, imgId, uploadData);
}

/**
 * 点击无需裁剪直接上传按钮
 */
function noCut(imgId) {
	uploadData = {
		cut : false
	};
	selectPictrue($("#imgOne"), 10, imgId, uploadData);
}

/**
 * 判断选择的图片是否符合系统要求的方法
 * 
 * @param fileInput
 *            上传文件对象
 * @param size
 *            上传文件限制的大小
 * @param filePath
 *            上传到服务器的路径
 * @param imgId
 *            如果是图片，更换图片的id
 * @param data
 *            和上传文件同时提交的数据,格式{name : 'name1',age : 'age1'}
 */
function selectPictrue(fileInput, size, data) {
	var filePath = fileInput.val();// 获取选择文件路径
	var fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();// 获取文件后缀名
	if (!checkFileImg(fileExt)) {// 判断选择的文件是否为图片文件
		//$.MsgBox.Alert("","您上传的文件不是图片,请重新选择！");
//		alert("您上传的文件不是图片,请重新选择！");
		return false;
	}
	if (size != 0) {
		if (fileInput[0].files && fileInput[0].files[0]) { // 谷歌浏览器判断文件大小
			var fileSize = toDecimal(fileInput[0].files[0].size / 1024 / 1024);
			if (fileSize > size) {
				$.MsgBox.Alert("",'你选择的文件大小为' + fileSize + 'M，请选择小于' + size + 'M的图片！');
				
//				alert('你选择的文件大小为' + fileSize + 'M，请选择小于' + size + 'M的图片！');
				return false;
			}
		} else {// IE浏览器判断文件大小
			fileInput[0].select();
			var url = document.selection.createRange().text;
			try {
				var fso = new ActiveXObject("Scripting.FileSystemObject");
			} catch (e) {
				$.MsgBox.Alert("",'如果你用的是ie 请将安全级别调低！');
				
//				alert('如果你用的是ie 请将安全级别调低！');
				return false;
			}
			var fileSize = toDecimal(fso.GetFile(url).size / 1024 / 1024);
			if (fileSize > size) {
				$.MsgBox.Alert("",'你选择的文件大小为' + fileSize + 'M，请选择小于' + size + 'M的图片！');
				
//				alert('你选择的文件大小为' + fileSize + 'M，请选择小于' + size + 'M的图片！');
				return false;
			}
		}
	}
//	imgupload(fileInput.attr("id"), data);// 调用上传图片的方法
}
/**
 * 上传文件的方法
 * 
 * @param uploadImg
 *            需要上传的文件控件的id
 * @param filePath
 *            上传到服务器的路径
 * @param imgId
 *            如果是图片，更换图片的id
 * @param data
 *            需要和上传一起提交的数据
 */

/**
 * 将本地图片 显示到浏览器上
 */
//function preImg(sourceId) 方法调用时--selectPictrue--imgupload(fileInput.attr("id"), data);// 调用上传图片的方法


//function imgupload(uploadImg, data) {
//	$.ajaxFileUpload({
//		url : 'http://192.168.1.105:8080/siims/vmaque/picture/addPicture.jspx',// 用于文件上传的服务器端请求地址
//		secureuri : false,// 一般设置为false
//		fileElementId : uploadImg,// 文件上传空间的id属性 <input type="file" id="file"
//									// name="file" />
//		dataType : 'json',// 返回值类型 一般设置为json
//		data : data,// 上传的其他数据
//		async : false,
////		success : function(dataimg, status) {// 服务器成功响应处理函数
////			console.log(dataimg);
////			if (dataimg == "1") {
////				//alert("图片上传失败，请重新选择图片上传！");
////			} else {
////				  //需要修改地方
////				
////					/*	var  url=indexRoot+"/goods_info/key/addGoodsInfo";
////						//获取页面pageid
////						var pageId = $("#id", parent.frames['frame_left'].document).val();
////					  $.ajax({
////							type:"POST",
////							object:$(this),
////							url:url,
////							data:"pageGoodsInfoData.pageId="+pageId+"&goodsInfoData.id="+$("#goodsInfoDataId").val()+"&goodsInfoData.goodsImg="+dataimg,
////							dataType : 'text',// 返回值类型 一般设置为json
////							success : function(data) {
////								 if(data!="1"){
////									 var json=eval("(" + data + ")");
////									 $("#goodsInfoDataId").val(json.goodsInfoId);  //商品id
////										$("#" + imgId).attr("src", dataimg);
////										closeUploadBox();
////								}
////							}
////						})*/
////				
////			}
////		},
// 		success: function (data, status)  //服务器成功响应处理函数
//                  {
//                      goodsURL = data.goodsURL;
//                     
//                  },
//		error :  function (data, status, e){//服务器响应失败处理函数
//			console.log(e);
//			console.log(status);
//		}
//
//	});
//}

/**
 * 判断上传的文件是否为图片
 * 
 * @param imgName
 *            文件名
 * @returns 是否为图片
 */
function checkFileImg(imgName) {
	if (!imgName.match(/.jpg|.png|.jpeg/i)) {
		return false;
	}
	return true;
}
/**
 * 保留两位小数 功能：将浮点数四舍五入，取小数点后2位
 * 
 * @param x
 *            需要保留两位小数的数
 * @returns 保留两位小数后的数
 */
function toDecimal(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return;
	}
	f = Math.round(x * 100) / 100;
	return f;
}


