var Tools = {
  ajax :function(options) {
      options = options || {};
      options.type = (options.type || "GET").toUpperCase();
      options.dataType = options.dataType || "json";
      var params = this.formatParams(options.data);

      //创建 - 非IE6 - 第一步
      if (window.XMLHttpRequest) {
          var xhr = new XMLHttpRequest();
      } else { //IE6及其以下版本浏览器
          var xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }

      //接收 - 第三步
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              var status = xhr.status;
              if (status >= 200 && status < 300) {
                  options.success && options.success(xhr.responseText, xhr.responseXML);
              } else {
                  options.fail && options.fail(status);
              }
          }
      }
      var test = true;
      // if(test){
      //   options.url = "http://taihuiyuan.com/api" + options.url
      //   console.log(options.url);
      // }else{
      //   options.url = window.location.host + options.url
      // }

      var hostUrl = window.location.host;
      if(hostUrl == "taihuiyuan.com"){
        options.url = "https://taihuiyuan.com/api" + options.url;
      }else{
        //options.url = "https://dev.taihuiyuan.com/api" + options.url;
        options.url = "https://taihuiyuan.com/api" + options.url;
      }
      //连接 和 发送 - 第二步
      if (options.type == "GET") {
          xhr.open("GET", options.url + "?" + params, true);
          xhr.send(null);
      } else if (options.type == "POST") {
          xhr.open("POST", options.url, true);
          //设置表单提交时的内容类型
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.send(params);
      }
  },
  //格式化参数
 formatParams:function(data) {
      var arr = [];
      for (var name in data) {
          arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      arr.push(("v=" + Math.random()).replace(".",""));
      return arr.join("&");
  },
  Base64Cus:function () {

		// private property
		var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		// public method for encoding
		this.encode = function (input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = this._utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		}

		// public method for decoding
		this.decode = function (input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		}

		// private method for UTF-8 encoding
		this._utf8_encode = function (string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}
			return utftext;
		}

		// private method for UTF-8 decoding
		this._utf8_decode = function (utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while ( i < utftext.length ) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	},
  GetQueryString:function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }

}

export default Tools;
