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
        options.url = "http://taihuiyuan.com/api" + options.url;
      }else{
        options.url = "http://dev.taihuiyuan.com/api" + options.url;
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
 formatParams:function(data) {
      var arr = [];
      for (var name in data) {
          arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      arr.push(("v=" + Math.random()).replace(".",""));
      return arr.join("&");
  },
  GetQueryString:function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }
}

export default Tools;
