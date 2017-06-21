import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Icon,
  Field,
  Button
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';

const Wallet_C_Back = React.createClass({
  getInitialState(){
    return{
      cardDiscount:"",
      totalMoney:"",
      saveMoney:"",
      givePoint:"",
      deadline:"",
    }
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  componentDidMount(){
    var _this = this;
    const card_id = this.props.location.query.item;
    console.log(card_id);
    var wallet_card = localStorage.getItem("wallet_card");
    wallet_card = eval('(' + wallet_card + ')');
    const cardItems = wallet_card.data.items;
    for(var i=0;i< cardItems.length;i++){

      if(cardItems[i].cardId == card_id){
        _this.setState({
          totalMoney:cardItems[i].price,
          cardDiscount:cardItems[i].discount * 10,
          saveMoney:cardItems[i].saveMoney,
          deadline:cardItems[i].deadline.split(" ")[0],
          supportCount:cardItems[i].supportCount,
          givePoint:cardItems[i].givePoint
        })
      }
    }
  },
  loadUserInfo(){
    /*获取url的uid*/
    var _this = this;
    var uid = Tools.GetQueryString("uid");
    console.log(uid);
    localStorage.setItem("uid",uid);
    var url = "/user/"+uid+"/data";

    var lat = localStorage.getItem("userLat") ? localStorage.getItem("userLat"):0;
    var lng = localStorage.getItem("userLng") ? localStorage.getItem("userLng"):0;

    //var mockurl = "http://localhost:3005/home";
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          data: {
            uid:uid,
            userLat:lat,
            userLng:lng
          },        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var appInfo = eval('(' + response + ')');

              _this.setState({
                shopInfo:appInfo.data.shopInfo,
                visible:false
              })
              localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
              localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
              localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
          },
          fail: function (status) {

            console.log(status);
          }
      });
  },
  backCardFunc(){
    //alert("退卡失败，请联系服务商~");
    var url = "/user/"+localStorage.getItem("uid")+"/refund_card";
    const _this = this;
    console.log(this.props.location.query.item);
    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: { cid: _this.props.location.query.item },        //请求参数
          dataType: "json",
          success: function (response, xml) {
            console.log(response);
            _this.loadUserInfo();
            var response = eval("("+response+")");

            var backInfo = response.error;
            const path = `/Wallet_Card_BackF`
            _this.context.router.push({
                pathname: path,
                query: { backInfo: backInfo}
              }
            );
          },
          fail: function (status) {
            alert("fail")
            console.log(status);
            var status = eval("("+status+")");

            var backInfo = status.error;
            console.log(backInfo);
            const path = `/Wallet_Card_BackF`
            _this.context.router.push({
              pathname: path,
              query: { backInfo: backInfo}
              }
            );
          }
      });
  },
  render(){
    // let page = this.props.params.cardInfo;
    //console.log(this.props.location.query);
    return(
      <Container scrollable>
        <div className="my-cardlist">会员卡详情</div>
        <div className="card-d-title">
          <div className="card-d-title-dis">
            <div className="card-discount">{this.state.cardDiscount}折</div>
            <div className="card-money"><span className="card-total-money">￥{this.state.totalMoney}</span><span className="card-give-money">赠送抵用金{this.state.givePoint}</span></div>
          </div>
          <div className="card-time">会员卡有效期至 {this.state.deadline}</div>
        </div>

        <div className="card-op">
        <Link to={{pathname:"/Wallet_C_Back",query:{}}}>
          <div className="confirm-card-back" onClick={this.backCardFunc}>确认退卡</div>
        </Link>
        </div>
      </Container>
    )
  }
})

export default Wallet_C_Back;
