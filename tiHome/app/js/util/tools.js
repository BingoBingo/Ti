import deleteP from '../../i/delete.png';
var location = window.location.host;
var deleteBack = "url(" + deleteP + ") no-repeat";
//var deleteBack = deleteP;
if (location == "taihuiyuan.com" || location == "dev.taihuiyuan.com") {
  deleteBack = "url(pay/" + deleteP + ") no-repeat";
  //deleteBack = "pay/" + deleteP;
}

window.alert = function(name){
     var iframe = document.createElement("IFRAME");
     iframe.style.display="none";
     iframe.setAttribute("src", 'data:text/plain,');
     document.documentElement.appendChild(iframe);
     window.frames[0].window.alert(name);
     iframe.parentNode.removeChild(iframe);
}

var Tools = {
  ajax: function(options) {
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
    xhr.onreadystatechange = function() {
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
    var hostUrl = window.location.host;
    if (hostUrl == "taihuiyuan.com") {
      options.url = "https://taihuiyuan.com/api" + options.url;
    } else {
      options.url = "https://dev.taihuiyuan.com/api" + options.url;
      //options.url = "http://taihuiyuan.com/api" + options.url;
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
  formatParams: function(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
  },
  GetQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var searchURL = window.location.search;
    searchURL = encodeURI(searchURL);
    var r = searchURL.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  },

  /**
  *
  *  Base64 encode / decode
  */

  Base64: function(input) {

    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1,
      chr2,
      chr3;
    var enc1,
      enc2,
      enc3,
      enc4;
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
    output = this._utf8_decode(output);
    return output;
    _utf8_encode = function(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
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
    _utf8_decode = function(utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  },

  _utf8_decode: function(utftext) {
    var string = "";
    var i = 0;
    var c = 0;
    var c1 = 0;
    var c2 = 0;
    var c3 = "";
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },

  KeyBoard: function(input, cursor, vipReduce, vipPayBtn, options) {
    var ownCard_discount = localStorage.getItem("ownCard_discount");
    var body = document.getElementsByTagName('body')[0];
    var DIV_ID = options && options.divId || 'xdd-keybord';
    if (document.getElementById(DIV_ID)) {
      body.removeChild(document.getElementById(DIV_ID));
    }

    this.input = input;
    this.cursor = cursor;
    this.vipReduce = vipReduce;
    this.vipPayBtn = vipPayBtn;
    this.el = document.createElement('div');

    var self = this;
    var zIndex = options && options.zIndex || 1000;
    var width = options && options.width || '100%';
    //var height = options && options.height || '210px';
    var height = options && options.height;
    var fontSize = options && options.fontSize || '15px';
    var backgroundColor = options && options.backgroundColor || '#fff';
    var TABLE_ID = options && options.table_id || 'table_0909099';
    var mobile = typeof orientation !== 'undefined';

    this.el.id = DIV_ID;
    this.el.style.position = 'absolute';
    this.el.style.left = 0;
    this.el.style.right = 0;
    this.el.style.bottom = 0;
    this.el.style.zIndex = zIndex;
    this.el.style.width = width;
    this.el.style.height = height;
    this.el.style.backgroundColor = backgroundColor;

    //样式
    var cssStr = '<style type="text/css">';
    cssStr += '#' + TABLE_ID + '{text-align:center;width:100%;border-top:1px solid #CECDCE;background-color:#FFF;}';
    cssStr += '#' + TABLE_ID + ' td{color:#474747;font-size:36px;width:33%;border:1px solid #ddd;border-right:0;border-top:0;}';
    if (!mobile) {
      cssStr += '#' + TABLE_ID + ' td:hover{color:#FFF;}';
    }
    cssStr += '</style>';

    //Button
    var btnStr = '<div style="display:none;width:60px;height:28px;';
    btnStr += 'float:right;margin-right:5px;text-align:center;color:#fff;';
    btnStr += 'line-height:28px;border-radius:3px;margin-bottom:5px;cursor:pointer;">完成</div>';

    //table
    var tableStr = '<table id="' + TABLE_ID + '" border="0" cellspacing="0" cellpadding="0">';
    tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
    tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
    tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
    tableStr += '<tr><td>.</td><td>0</td>';
    tableStr += '<td><div style="background-position: center !important;background-size: 0.813333rem 0.48rem !important;background:' + deleteBack + '">&nbsp;</div></td></tr>';
    //tableStr += '<td><div><img style="width:0.813333rem;height:0.48rem" src="' + deleteBack + '"/><div></td></tr>';
    tableStr += '</table>';
    this.el.innerHTML = cssStr + btnStr + tableStr;

    function addEvent(e) {
      var ev = e || window.event;
      var clickEl = ev.element || ev.target;
      clickEl.style.backgroundColor = "#CECDCE";
      var value = clickEl.textContent || clickEl.innerText;
      if (clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "删除") {
        if (self.input && value !== "." && value !== "0") {
          self.input.value += value;
        } else if (value === ".") {
          //首次输入点
          if (self.input.value.length == 0) {
            self.input.value = "0." + self.input.value;
          } else {
            //不能输入俩点
            if (self.input.value.indexOf(".") > 0) {} else {
              self.input.value = self.input.value + ".";
            }
          }
        } else if (value === "0" && self.input.value.length == 0) {
          self.input.value = "0." + self.input.value;
        } else {
          self.input.value += value;
        }
        if (self.input.value.indexOf(".") > 0) {
          self.input.value = (self.input.value).substring(0, self.input.value.indexOf(".") + 3);
        }
        // else if(clickEl.tagName.toLocaleLowerCase() === 'div' && value === "完成"){
        // 	    body.removeChild(self.el);
        // }
      } else if (clickEl.tagName.toLocaleLowerCase() === 'img' || clickEl.tagName.toLocaleLowerCase() === 'div') {
        var num = self.input.value;
        if (num) {
          var newNum = num.substr(0, num.length - 1);
          self.input.value = newNum;
        }
      }
      if (self.input.value != "") {
        var reduceMoney = self.input.value * 1 - (self.input.value * ownCard_discount) / 10;
        var payTrue = (self.input.value * ownCard_discount) / 10;
        reduceMoney = reduceMoney.toFixed(1);
        payTrue = payTrue.toFixed(1);
        self.cursor.style.display = "none";
        self.vipReduce.innerText = "￥" + reduceMoney;
        self.vipPayBtn.innerText = "支付 ￥" + payTrue;
        self.vipPayBtn.style.opacity = 1;
      } else {
        self.cursor.style.display = "";
        self.vipReduce.innerText = "￥0";
        self.vipPayBtn.innerText = "支付";
      }

    }

    function removeEvent(e) {
      var ev = e || window.event;
      var clickEl = ev.element || ev.target;
      clickEl.style.backgroundColor = "#fff";
    }

    if (mobile) {
      this.el.ontouchstart = addEvent;
      this.el.ontouchend = removeEvent;
    } else {
      this.el.onclick = addEvent;
    }
    body.appendChild(this.el);

  }
}

export default Tools;
