export const Cookie = {
	
	Set: function(cName, cValue, cExp) { //cExp:cookie的有效期，传入的参数以分钟计算
		var str = cName + "=" + escape(cValue)
		if(cExp > 0) {
			var exp = new Date();
			exp.setTime(exp.getTime() + cExp * 60 * 1000);

			str = str + ";expires=" + exp.toGMTString();
		}
		document.cookie = str;
	},

	Get: function(objName) {

		var arrStr = document.cookie.split("; ");
		for(var i = 0; i < arrStr.length; i++) {
			var temp = arrStr[i].split("=");
			if(temp[0] == objName)
				return unescape(temp[1]);
		}
		return '';
	},

}

export const jzm = {
	findOnID: function(rpts, rid) {
		for(var n = 0; n < rpts.length; n++) {
			if(rpts[n].rid == rid) {
				return rpts[n].data;
			}
		}
		return "";
	}
}