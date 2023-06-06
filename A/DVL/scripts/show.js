$(document).ready(function(){
	$.ajax({
			type:"get",
			url:"../DVL/test.json",
			async:true,
//			data:condition,
			dataType:"json",
			crossDomain:true,
			success:function(data){
				alert("ok");
				var main_weight = document.getElementById('main_weight');
				DVL.line(main_weight, data);
				var main_lowpressure = document.getElementById('main_lowpressure');
				DVL.line(main_lowpressure, data);
				var main_highpressure = document.getElementById('main_highpressure');
				DVL.line(main_highpressure, data);
				var main_blood = document.getElementById('main_blood');
				DVL.line(main_blood, data);
				var main_afterblood = document.getElementById('main_afterblood');
				DVL.line(main_afterblood, data);
				var main_waist = document.getElementById('main_waist');
				DVL.line(main_waist, data);
			},
			error:function(XMLHttpRequest, textStatus, errorThrown) {
		         console.log(XMLHttpRequest.status);
			     console.log(XMLHttpRequest.readyState);
				 console.log(textStatus);
		   }
		});
});
