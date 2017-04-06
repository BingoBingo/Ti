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
import {Link, Router, Route} from 'react-router';

import Tools from '../util/tools';
import card_bak from '../../i/card-bak.jpg';

const CardDetail_Buy = React.createClass({
  getInitialState() {

    var payReduce = this.props.location.query.payReduce;
    return {
      btnPayNotPut: "btn-pay-input",
      payReduce: payReduce,
      saleCards: [],
      cardDiscount: "",
      cardName: "",
      cardDeadLine: "",
      cardPrice: "",
      cardGivePoint: "",
      cardTQ: "",
      cardMD: "",
      supportCount: ""
    }
  },
  newPayMoney() {

    var ownCard = localStorage.getItem("ownCard");
    ownCard = eval("(" + ownCard + ")");
    let userVipId = ownCard.cardId
      ? ownCard.cardId
      : "";

    var payTrue = this.props.location.query.payTrue;
    var cardId = this.props.location.query.cardId;
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    var url = "/spotpayment";
    var payParam = {
      device: "wechat",
      uid: uid,
      hotelId: hotelId,
      price: payTrue,
      cardId: cardId,
      usePoint: false,
      userVipId: userVipId
    }

    Tools.ajax({
      url: url, //请求地址
      type: "POST", //请求方式
      data: payParam, //请求参数
      dataType: "json",
      success: function(response, xml) {
        var payInfo = eval('(' + response + ')');
        var wechatPayParam = payInfo.data.wechatPayParam;
        wechatPayParam = eval("(" + wechatPayParam + ")");
        WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            wx.closeWindow();
          }
        });
      },
      fail: function(status) {
        console.log(status);
      }
    });
  },
  componentDidMount() {

    var cardDetail = localStorage.getItem("saleCards");
    cardDetail = eval("(" + cardDetail + ")");

    var cardId = this.props.location.query.cardId;
    var payReduce = this.props.location.query.payReduce;
    var itemPhoto = this.props.location.query.itemPhoto;
    this.setState({itemPhoto: itemPhoto})

    for (let i = 0; i < cardDetail.length; i++) {
      if (cardDetail[i].cardId == cardId) {
        this.setState({
          cardDiscount: cardDetail[i].discount
            ? (cardDetail[i].discount * 10).toFixed(1)
            : "",
          cardDeadLine: cardDetail[i].expiry
            ? cardDetail[i].expiry
            : "",
          cardName: cardDetail[i].name
            ? cardDetail[i].name
            : "",
          cardGivePoint: cardDetail[i].givePoint
            ? (cardDetail[i].givePoint).toFixed(2)
            : 0,
          cardPrice: cardDetail[i].price
            ? cardDetail[i].price
            : "",
          cardTQ: cardDetail[i].cardTQ
            ? cardDetail[i].cardTQ
            : "",
          cardMD: cardDetail[i].cardMD
            ? cardDetail[i].cardMD
            : "",
          cardPhoto: cardDetail[i].photo
            ? cardDetail[i].photo
            : "",
          supportCount: cardDetail[i].supportCount
            ? cardDetail[i].supportCount
            : ""
        })
      }
    }
  },

  renderCards() {

    var saleCards = this.state.saleCards;
    console.log(saleCards);

    if (saleCards !== "" && saleCards.length > 0) {
      return saleCards.map((item, index) => {
        var cardStyle = {
          background: "url(" + item.photo + ")",
          backgroundSize: "cover"
        };

        var userPayMoney = this.props.location.query.userPayMoney;
        var payReduce = userPayMoney - userPayMoney * item.discount;
        payReduce = payReduce.toFixed(2);

        var discount = item.discount
          ? (item.discount * 10).toFixed(1)
          : "";
        return (
          <Link to={{
            pathname: "Home_H_D/",
            query: {
              hid: index
            }
          }} key={index}>
            <div className="card-list">
              <div className="hotelcard-list">
                <div className="card-type" style={cardStyle}>
                  <div className="card-discount">
                    <span>{discount}</span>折卡</div>
                  <div className="card-money">售价￥{item.price}</div>
                </div>
                <div className="card-reduce">
                  <div className="card-reduceMoney">本单立减{payReduce}</div>
                  <div className="card-giveMoney">在赠低用金{item.givePoint}元</div>
                </div>
              </div>
              <div className="cardlist-border"></div>

            </div>
          </Link>
        );
      });
    }
  },

  render() {
    var cardBack = {
      backgroundImage: "url(" + this.state.cardPhoto + ")",
      backgroundSize: "cover",
      backgroundColor: "#fff",
      height: "5.466667rem",
      right: "0",
      left: "0",
      margin: "0.666667rem",
      borderRadius: "0.3rem"
    };

    var payTrue = this.props.location.query.payTrue;
    var cardId = this.props.location.query.cardId;
    var about = this.props.location.query.about;

    return (
      <View>
        <Container scrollable>
          <div style={cardBack}>
            <div className="cardDiscount"></div>
            <div className="cardDetail_name"></div>
            <div className="cardDetail_deadline"></div>
            <div className="cardDetail_price"></div>
          </div>

          {/* <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
            <div className="cardDetail-list">
              <span className="info-before">赠抵用金</span>
              <span className="info-after">{this.state.cardGivePoint}元</span>
            </div>
          </Link>

          <Link to={{pathname:"Dyj_Detail",query:{pathType:"sstsm"}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <span className="info-before">随时退</span>
              <span className="info-after">详情</span>
            </div>
          </Link> */}

          <Link to={{
            pathname: "Dyj_Detail",
            query: {
              pathType: "hyksm",
              about: about
            }
          }}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <span className="info-before">本卡特权</span>
              <span className="info-after">详情</span>
            </div>
          </Link>

          <Link to={{
            pathname: "Wallet_SupportHotel",
            query: {
              cardId: cardId
            }
          }}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <div className="pserson-wechat">
                <span className="info-before">适用门店</span>
                <span className="info-after">{this.state.supportCount}家</span>
              </div>
            </div>
          </Link>
          <div className="cardDetail-top-line"></div>

          <div className="CardDetailBtn">
            <Link to={{
              pathname: "PayEnd_WithCard",
              query: {
                cardId: cardId,
                cardPrice: this.state.cardPrice,
                cardDiscount: this.state.cardDiscount,
                userPayMoney: payTrue,
                itemPhoto: this.state.itemPhoto
              }
            }}>
              确认储值
            </Link>
          </div>

          {/* <div className="CardDetailBtn" style={{display:"none"}} onClick={this.newPayMoney}>
              省￥{this.state.payReduce}&gt;
        </div> */}
        </Container>
      </View>
    )
  }
})
export default CardDetail_Buy;
