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

const Wallet_Share = React.createClass({
  getInitialState(){
    return{
      albums:[],
      share:false,
      shareInfo:"",
      shareLink:"",

    }
  },

  callWX(){
    alert("点击右上角，分享给我的朋友~");
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
              console.log(response);
              var wxInfo = eval('(' + response + ')');
              wxInfo.debug = "true";
              wxInfo.jsApiList = ["getLocation","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"];
              //_this.state.shopInfo = searchResult.data.items;

              _this.setState({
                wxInfo:wxInfo
              })


              wx.config(wxInfo);
              wx.ready(function(){

                wx.onMenuShareTimeline({
                    title: '一次认真的分享，一场优惠的狂欢', // 分享标题
                    link: '便捷入住，优惠享不停', // 分享链接
                    imgUrl: _this.state.shareLink, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareQQ({
                      title: '一次认真的分享，一场优惠的狂欢', // 分享标题
                      desc: '便捷入住，优惠享不停', // 分享描述
                      link: _this.state.shareLink, // 分享链接
                      imgUrl: '', // 分享图标
                      success: function () {
                         // 用户确认分享后执行的回调函数
                      },
                      cancel: function () {
                         // 用户取消分享后执行的回调函数
                      }
                  });

                  wx.onMenuShareWeibo({
                      title: '一次认真的分享，一场优惠的狂欢', // 分享标题
                      desc: '便捷入住，优惠享不停', // 分享描述
                      link: _this.state.shareLink, // 分享链接
                      imgUrl: '', // 分享图标
                      success: function () {
                         // 用户确认分享后执行的回调函数
                      },
                      cancel: function () {
                          // 用户取消分享后执行的回调函数
                      }
                  });

                  wx.onMenuShareQZone({
                      title: '一次认真的分享，一场优惠的狂欢', // 分享标题
                      desc: '便捷入住，优惠享不停', // 分享描述
                      link: _this.state.shareLink, // 分享链接
                      imgUrl: '', // 分享图标
                      success: function () {
                         // 用户确认分享后执行的回调函数
                      },
                      cancel: function () {
                          // 用户取消分享后执行的回调函数
                      }
                  });


                wx.onMenuShareAppMessage({
                    title: '一次认真的分享，一场优惠的狂欢', // 分享标题
                    desc: '便捷入住，优惠享不停', // 分享描述
                    link: _this.state.shareLink, // 分享链接
                    imgUrl: '', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
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
    // Tools.ajax({
    //       url: url,
    //       type: "GET",
    //       // data: { name: "super", age: 20 },
    //       dataType: "json",
    //       success: function (response, xml) {
    //
    //           var jyjlItem = eval('(' + response + ')');
    //           var items = jyjlItem.data.items;
    //           var albums = [];
    //           if(items.length > 0){
    //             for(let i=0;i< items.length;i++){
    //               albums.push({
    //                 title:items[i].tradePlace,
    //                 subTitle:items[i].tradeTime,
    //                 after:items[i].tradePrice +"￥",
    //               })
    //             }
    //           }else {
    //             albums.push({
    //               title:"您暂无交易记录~",
    //               after:"0.00",
    //               subTitle: '',
    //             })
    //           }
    //           _this.setState({
    //             albums :albums
    //           });
    //       },
    //       fail: function (status) {
    //         console.log(status);
    //       }
    //   });
  },
  render(){
    const albums = this.state.albums;
    return(
      <View className="dyj-back">
        <Container scrollable>
          <Group noPadded>
            <div className="sharePage">{this.state.shareInfo}<span className="getMoney">5</span>元抵用金</div>
            <div className="shareRule"><span className="">活动规则：邀请一名好友关注公众号即可</span></div>
            <div className="shareLink"><span className="">好用通过分享链接关注公众号直接或得5元低佣金</span></div>
            <div className="shareButton" onClick={this.callWX}>我要邀请</div>
          </Group>
        </Container>
      </View>
    )
  }
})
export default Wallet_Share;
