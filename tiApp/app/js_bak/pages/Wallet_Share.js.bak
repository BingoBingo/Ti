import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Icon
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';
import share from '../../i/share.jpg';
import click from '../../i/click.png';
import arrow_right_top from '../../i/arrow-right-top.png';

const Wallet_Share = React.createClass({
  getInitialState(){
    return{
      albums:[],
      share:false,
      shareInfo:"",
      shareLink:"",
      isShow:"none"
    }
  },

  callWX(){
    this.setState({
      isShow:""
    })
    document.getElementById("remark").style.display = "";
    const urlJS = "/wechat/jssign";
    var currentUrl = window.location.href;
    currentUrl = window.location.href.split('#')[0];

    const _this = this;
    Tools.ajax({
          url: urlJS,              //请求地址
          type: "POST",                       //请求方式
          data: { url: currentUrl},        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var personInfo = localStorage.getItem("personInfo");
              personInfo = eval("(" +personInfo+")");
              var shareLink = personInfo.shareLink;
              var wxInfo = eval('(' + response + ')');
              var shareData = {
              	title: '一次认真的分享，一场优惠的狂欢', // 分享标题
              	desc: '便捷入住，优惠享不停', // 分享描述
              	link: shareLink, // 分享链接
              	imgUrl: '', // 分享图标
              	type: '', // 分享类型,music、video或link，不填默认为link
              	dataUrl: '',// 如果type是music或video，则要提供数据链接，默认为空
              	success: function () { },
              	cancel: function () { }
              }
              wxInfo.debug = false;
              wxInfo.jsApiList = ["getLocation","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"];
              //_this.state.hotelInfo = searchResult.data.items;

              _this.setState({
                wxInfo:wxInfo
              })


              wx.config(wxInfo);
              wx.ready(function(){

                wx.onMenuShareTimeline(shareData);
            		wx.onMenuShareAppMessage(shareData);
            		wx.onMenuShareQQ(shareData);
            		wx.onMenuShareWeibo(shareData);
            		wx.onMenuShareQZone(shareData);
                wx.error(function(res){
                  alert(JSON.stringify(res));
                });
              });
          },
          fail: function (status) {
            console.log(status);
          }
      });
  },

  hideRemark(e){
    document.getElementById("remark").style.display = "none";
  },
  componentDidMount(){
    var _this = this;
    //var url = "/user/"+localStorage.getItem("uid")+"/trade_records"
    var walletInfo = localStorage.getItem("walletInfo");
    walletInfo = eval("(" +walletInfo+")");
    var share = walletInfo.share;

    var shareInfo=""
    if(share){
      shareInfo = "邀请好友各得"
    }else{
      shareInfo = "送好友"
    }

    var personInfo = localStorage.getItem("personInfo");
    personInfo = eval("(" +personInfo+")");
    var shareLink = personInfo.shareLink;

    this.setState({
      shareInfo:shareInfo,
      shareLink:shareLink
    })
    this.callWX();
  },
  render(){
    var cardBack = {
      backgroundImage:"url("+share+")",
      backgroundSize:"cover",
      backgroundColor:"#fff",
      height:"100%",
      width: "100%",
      right: "0",
      left: "0",
    };

    var clickPic = {
      background:"url("+click+") no-repeat",
      width: "100px",
      height: "20px",
      float: "right",
      marginTop: "90px",
      backgroundSize: "100% 100%"
    }
    var arrowPic = {
      background: "url("+arrow_right_top+") no-repeat" ,
      width: "54px",
      height: "69px",
      marginRight: "30px",
      marginTop: "10px",
      float: "right",
      backgroundSize: "100% 100%",
    }

    const albums = this.state.albums;
    const isShow = this.state.isShow;
    return(
      <View className="dyj-back" style={cardBack}>
        <div className="shareButton" onClick={this.callWX}>我要邀请</div>
        <div className="remark" onClick={this.hideRemark} id="remark" style={{display:isShow}}>
          <div className="arrowPic" style={arrowPic}></div>
          <div className="clickPic" style={clickPic}></div>
      	</div>
      </View>
    )
  }
})
export default Wallet_Share;
