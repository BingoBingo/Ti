<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%
	String path = request.getContextPath() + "/";
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path;
	if(request.getServerPort() == 808){
		basePath =  request.getScheme() + "://taihuiyuan.com/api/";
	}
	String shareLink = request.getParameter("u");
%>
<!DOCTYPE html>
<html>
<head>
<base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, user-scalable=no, target-densitydpi=device-dpi">
<meta name="renderer" content="webkit">
<title>分享关注</title>
<style type="text/css">
body{margin:0;padding:0;vertical-align:middle}.warp{background-image:url('common/share.jpg');background-size:100% 100%;position:absolute;bottom:0;left:0;right:0;top:0}.info{text-align:center;position:absolute;bottom:115px;right:0;left:0;font-size:14px;line-height:25px;color:#df1b3b}.share{height:40px;line-height:40px;text-align:center;position:absolute;bottom:60px;right:20px;left:20px;border-radius:22px;background:rgba(255,255,255,0.5)}.back{height:60px;line-height:60px;text-align:center;position:absolute;bottom:0;right:20px;left:20px}.share a{color:#df1b3b;text-decoration:none;font-size:22px;display:block}.back a{color:#FFF;opacity:.7;text-decoration:none;font-size:22px;display:block}.remark{background:rgba(0,0,0,0.8);position:absolute;bottom:0;top:0;left:0;right:0;z-index:2;display:none;text-align:right}.remark img.arrow{width:10%;margin:20px 20px 0 0}.remark img.click{width:30%;margin:10px 50px 0 0}
</style>
<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript" src="common/jquery.min.js"></script>
<script type="text/javascript" src="common/json2.js"></script>
<script type="text/javascript">
var shareData = {
	title: '一次认真的分享，一场优惠的狂欢', // 分享标题
	desc: '便捷入住，优惠享不停', // 分享描述
	link: '<%=shareLink%>', // 分享链接
	imgUrl: '', // 分享图标
	type: '', // 分享类型,music、video或link，不填默认为link
	dataUrl: '',// 如果type是music或video，则要提供数据链接，默认为空
	success: function () { },
	cancel: function () { }
}
var cu = window.location.href.split("#")[0];
$.post("wechat/jssign", {url:cu}, function(data){
	data.debug = false;
	data.jsApiList = [ "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone" ];
	wx.config(data);
	wx.ready(function(){
		wx.onMenuShareTimeline(shareData);
		wx.onMenuShareAppMessage(shareData);
		wx.onMenuShareQQ(shareData);
		wx.onMenuShareWeibo(shareData);
		wx.onMenuShareQZone(shareData);
	});
}, "json");
$(function(){
	$(".share a").click(function(){
		var visible = $(".remark").is(":visible");
		if (visible) {
			$(".remark").hide();
		}else{
			$(".remark").show();
		}
	});
	$(".back a").click(function(){
		wx.closeWindow();
	});
	$(".remark").click(function(){
		$(this).hide();
	});
});
</script>
</head>
<body>
	<div class="warp">
		<div class="info">*邀请一名好友关注公众号即可<br>好友通过分享链接关注公众号直接得5元抵用金</div>
		<div class="share"><a href="javascript:void(0)">我要邀请</a></div>
		<div class="back"><a href="javascript:void(0)">返回</a></div>
	</div>
	<div class="remark">
		<img src="common/arrow-right-top.png" class="arrow"><br>
		<img src="common/click.png" class="click">
	</div>
</body>
</html>