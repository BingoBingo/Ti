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
import dyj from '../../i/dyj.png';
const New_User_Welfare = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState() {
    let payOldMoney = localStorage.getItem("payOldMoney");
    let ownCard_discount = localStorage.getItem("ownCard_discount");
    var payReduce = payOldMoney - ownCard_discount * payOldMoney / 10;
    payReduce = payReduce.toFixed(0);
    return {
      btnPayNotPut: "btn-pay-input",
      payOldMoney: payOldMoney,
      payReduce: payReduce,
      ownCard_discount: ownCard_discount,
      saleCards: [],
      saleStoredCards:[],
      availablePoint: 0,
      hasDYJ: "none",
      canUsePoint: "",
      trueUsePoint: "",
      alipayForm: "",
      _input_charset: "",
      subject: "",
      sign: "",
      it_b_pay: "",
      notify_url: "",
      body: "",
      payment_type: "",
      out_trade_no: "",
      partner: "",
      service: "",
      total_fee: "",
      return_url: "",
      sign_type: "",
      seller_id: "",
      btnPayNewNotPut: "giveUp",
      payBtnInfo: "放弃优惠"
    }
  },

  newPayMoney() {
    var payBtnInfo = this.state.payBtnInfo;
    if (payBtnInfo == "返回") {
      window.history.go(-1);
    }
    if(payBtnInfo == "跳过"){
      var userPayMoney = this.props.location.query.userPayMoney;
      if (userPayMoney == "") {
        alert("您未输入消费金额");
        return false;
      }
      localStorage.setItem("isBuyCard","czk");
      const path = `/PayEnd_Detail/`
      this.context.router.push({
        pathname: path,
        query: {
          availablePoint: this.state.trueUsePoint,
          userPayMoney: userPayMoney,
          payType: "useDYJ"
        }
      });
    }
    var payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;

    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "giveUp pay-loading"})
    var payTrue = this.props.location.query.userPayMoney;
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    // let device = localStorage.getItem("device")
    let device = Tools.GetQueryString("device");
    var url = "/spotpayment";
    var payParam = {
      device: device,
      uid: uid,
      hotelId: hotelId,
      price: payTrue,
      cardId: "",
      userVipId: "",
      usePoint: false
    }
    var _this = this;

    Tools.ajax({
      url: url, //请求地址
      type: "POST", //请求方式
      data: payParam, //请求参数
      dataType: "json",
      success: function(response, xml) {
        var payInfo = eval('(' + response + ')');
        var payBtnInfo = "放弃优惠"
        _this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "giveUp"})
        if (payInfo.status == "success") {

          if (device == "wechat") {
            var wechatPayParam = payInfo.data.wechatPayParam;
            var code = payInfo.data.code;
            var exp = payInfo.data.exp;
            var p = payInfo.data.p;
            wechatPayParam = eval("(" + wechatPayParam + ")");
            WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                wx.closeWindow();
                localStorage.setItem("card_buy", "false");
                if (window.location.host == "taihuiyuan.com") {
                  window.location.href = "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
                } else {
                  window.location.href = "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
                }
              }
            });
          }

          if (device == "alipay") {

            localStorage.setItem("card_buy", "false");
            var alipayForm = payInfo.data.alipayParam;
            alipayForm = eval('(' + alipayForm + ')');
            var _input_charset = alipayForm._input_charset;
            var subject = alipayForm.subject;
            var sign = alipayForm.sign;
            var it_b_pay = alipayForm.it_b_pay;
            var notify_url = alipayForm.notify_url;
            var body = alipayForm.body;
            var payment_type = alipayForm.payment_type;
            var out_trade_no = alipayForm.out_trade_no;
            var partner = alipayForm.partner;
            var service = alipayForm.service;
            var total_fee = alipayForm.total_fee;
            var return_url = alipayForm.return_url;
            var sign_type = alipayForm.sign_type;
            var seller_id = alipayForm.seller_id;

            _this.setState({
              _input_charset: _input_charset,
              subject: subject,
              sign: sign,
              it_b_pay: it_b_pay,
              notify_url: notify_url,
              body: body,
              payment_type: payment_type,
              out_trade_no: out_trade_no,
              partner: partner,
              service: service,
              total_fee: total_fee,
              return_url: return_url,
              sign_type: sign_type,
              seller_id: seller_id
            })
            document.forms['alipaysubmit'].submit();

          }
        } else {
          alert(payInfo.error + ",支付失败");
        }

      },
      fail: function(status) {
        var payBtnInfo = "放弃优惠"
        _this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "giveUp"})
        console.log(status);
      }
    });
  },
  componentDidMount() {
    var hid = localStorage.getItem("hotelId");
    var url = "/hotel/" + hid + "/data";
    var userType = localStorage.getItem("isNewUser");
    var uid = localStorage.getItem("uid");
    var _this = this;
    var userPayMoney = this.props.location.query.userPayMoney;
    var vipgoback = this.props.location.query.vipgoback;
    if (vipgoback == "返回") {
      this.setState({payBtnInfo: vipgoback})
    }
    //if(userType == "new" || userType == "member"){
    Tools.ajax({
      url: url, //请求地址
      type: "GET", //请求方式
      data: {
        uid: uid
      }, //请求参数
      dataType: "json",
      success: function(response, xml) {

        let cardInfo = eval('(' + response + ')')
        //可用抵用金
        let availablePoint = cardInfo.data.availablePoint;
        let defaultDiscount = cardInfo.data.defaultDiscount;
        //var canUsePoint = (availablePoint - availablePoint * defaultDiscount) * 100;
        var canUsePoint = (1 - defaultDiscount) * userPayMoney;
        canUsePoint = canUsePoint.toFixed(2);

        var trueUsePoint = availablePoint - canUsePoint;

        if (trueUsePoint > 0) {
          trueUsePoint = canUsePoint;
        } else {
          trueUsePoint = availablePoint;
        }
        console.log("抵用金——————————————");
        console.log(trueUsePoint);
        var hasDYJ = "none";
        //有抵用金就显示
        if (availablePoint != 0) {
          hasDYJ = "";
          _this.setState({
            payBtnInfo: "跳过"
          })
        }
        _this.setState({
          saleCards: cardInfo.data.saleCards,//折扣卡
          saleStoredCards:cardInfo.data.saleStoredCards,//储值卡
          availablePoint: availablePoint,
          defaultDiscount:cardInfo.data.defaultDiscount,
          hasDYJ: hasDYJ,
          canUsePoint: canUsePoint,
          trueUsePoint: trueUsePoint
        })
        let saleCards = JSON.stringify(cardInfo.data.saleCards);
        let saleStoredCards = JSON.stringify(cardInfo.data.saleStoredCards);
        localStorage.setItem("saleCards", saleCards);
        localStorage.setItem("saleStoredCards", saleStoredCards);
      },
      fail: function(status) {
        console.log(status);
      }
    });
    //}
  },

  renderCards() {
    var saleCards = this.state.saleCards;
    if (saleCards !== "" && saleCards.length > 0) {
      return saleCards.map((item, index) => {
        var cardStyle = {
          background: "url(" + item.photo + ")",
          backgroundSize: "cover"
        };
        var userPayMoney = this.props.location.query.userPayMoney;
        var payReduce = userPayMoney - userPayMoney * item.discount;
        payReduce = payReduce.toFixed(0);
        var payTrue = userPayMoney * item.discount;
        var discount = item.discount
          ? (item.discount * 10).toFixed(1)
          : "";
        var givePoint = item.givePoint ? item.givePoint : 0;
        var isRefund = item.isRefund ? "可退" : "";
        givePoint = givePoint.toFixed(0);

        return (
          <Link to={{
            pathname: "CardDetail_Buy",
            query: {
              cardId: item.cardId,
              cardType:"DiscountCard",
              payReduce: payReduce,
              payTrue: userPayMoney,
              itemPhoto: item.photo,
              support: item.supportCount,
              about: item.about,
              refundExpires:item.refundExpires,
              privilegeCount:item.privilegeCount
            }
          }} key={index}>
            <div className="card-list">
              <div className="hotelcard-list">
                <div className="card-type" style={cardStyle}>
                  <div className="card-discount"><span>{isRefund}{discount}折卡</span></div>
                  <div className="card-money">售价￥{item.price}</div>
                </div>
                <div className="card-reduce">
                  <div className="card-reduceMoney">本单立减￥{payReduce}</div>
                  <div className="card-giveMoney">再赠抵用金{givePoint}元</div>
                </div>
              </div>
              <div className="cardlist-border"></div>
            </div>
          </Link>
        );
      });
    }
  },
  renderStoredCards() {
    var saleStoredCards = this.state.saleStoredCards;
    if (saleStoredCards !== "" && saleStoredCards.length > 0) {
      return saleStoredCards.map((item, index) => {
        var cardStyle = {
          background: "url(" + item.photo + ")",
          backgroundSize: "cover"
        };
        var userPayMoney = this.props.location.query.userPayMoney;
        var payReduce = userPayMoney - userPayMoney * this.state.defaultDiscount;
        payReduce = payReduce.toFixed(0);
        var payTrue = userPayMoney * item.discount;
        var discount = item.discount ? (item.discount * 10).toFixed(1) : "";
        var givePoint = item.givePoint ? item.givePoint : 0;
        givePoint = givePoint.toFixed(0);
        var isRefund = item.isRefund ? "可退" : "";
        return (
          <Link to={{
            pathname: "CardDetail_Buy",
            query: {
              cardId: item.cardId,
              cardType:"CZCard",
              payReduce: payReduce,
              payTrue: userPayMoney,
              itemPhoto: item.photo,
              support: item.supportCount,
              about: item.about,
              refundExpires:item.refundExpires,
              privilegeCount:item.privilegeCount,
              cardPrice:item.price,
              availablePoint: this.state.trueUsePoint,
              userPayMoney: userPayMoney,
              payType: "useDYJ"
            }
          }} key={index}>
            <div className="card-list">
              <div className="hotelcard-list">
                <div className="card-type" style={cardStyle}>
                  <div className="card-discount-cz"><span>{isRefund}储值卡</span></div>
                  <div className="card-money-cz">售价￥{item.price}</div>
                </div>
                <div className="card-reduce">
                  <div className="card-reduceMoney">本单抵扣￥{payReduce}</div>
                  <div className="card-giveMoney">再赠抵用金{givePoint}元</div>
                </div>
              </div>
              <div className="cardlist-border"></div>
            </div>
          </Link>
        );
      });
    }
  },

  goPayEnd() {
    var userPayMoney = this.props.location.query.userPayMoney;
    if (userPayMoney == "") {
      alert("您未输入消费金额");
      return false;
    }
    localStorage.setItem("isBuyCard","czk");
    const path = `/PayEnd_Detail/`
    this.context.router.push({
      pathname: path,
      query: {
        availablePoint: this.state.trueUsePoint,
        userPayMoney: userPayMoney,
        payType: "useDYJ"
      }
    });
  },
  render() {
    var location = window.location.host;
    var backgroundImage = "url(" + card_bak + ")";
    var background = "url(" + dyj + ")";
    if (location == "taihuiyuan.com" || location == "dev.taihuiyuan.com") {
      backgroundImage = "url(pay/" + card_bak + ")"
      background = "url(pay/" + dyj + ")";
    }
    var cardBack = {
      backgroundImage: backgroundImage,
      backgroundSize: "cover",
      backgroundColor: "#fff",
      height: "6.933333rem"
    };
    var cardStyle = {
      background: background,
      backgroundSize: "100% 100%"
    };
    var hasDYJ = this.state.hasDYJ;
    var userPayMoney = this.props.location.query.userPayMoney;
    return (
      <View>
        <Container scrollable>
          <div style={cardBack}>
            <div className="bigTitle">请选优惠</div>
            <div className="smallTitle">若支付宝已购卡，请关联</div>
          </div>
          {/* <Link to={{pathname:"PayEnd_Detail",query:{availablePoint:this.state.trueUsePoint,userPayMoney:userPayMoney,payType:"useDYJ"}}}> */}
          {/* <div className="card-list" style={{
            display: hasDYJ
          }} onClick={this.goPayEnd}>
            <div className="hotelcard-list">
              <div className="dyj-type" style={cardStyle}>
                <div className="dyj-discount" style={{fontSize: "0.6rem"}}>使用抵用金</div>
              </div>
              <div className="card-reduce">
                <div className="card-reduceMoney" style={{
                  paddingTop: "0.5rem"
                }}>本单抵扣{this.state.trueUsePoint}</div>
                <div className="card-giveMoney"></div>
              </div>
            </div>
            <div className="cardlist-border"></div>
          </div> */}
          {/* </Link> */}
          {this.renderCards()}
          {this.renderStoredCards()}
        </Container>
        <div className={this.state.btnPayNewNotPut} onClick={this.newPayMoney}>{this.state.payBtnInfo}</div>
        <form id="alipaysubmit" name="alipaysubmit" style={{
          display: "none"
        }} action="https://mapi.alipay.com/gateway.do?_input_charset=UTF-8" method="POST">
          <input type="hidden" name="_input_charset" value={this.state._input_charset}/>
          <input type="hidden" name="subject" value={this.state.subject}/>
          <input type="hidden" name="sign" value={this.state.sign}/>
          <input type="hidden" name="it_b_pay" value={this.state.it_b_pay}/>
          <input type="hidden" name="notify_url" value={this.state.notify_url}/>
          <input type="hidden" name="body" value={this.state.body}/>
          <input type="hidden" name="payment_type" value={this.state.payment_type}/>
          <input type="hidden" name="out_trade_no" value={this.state.out_trade_no}/>
          <input type="hidden" name="partner" value={this.state.partner}/>
          <input type="hidden" name="service" value={this.state.service}/>
          <input type="hidden" name="total_fee" value={this.state.total_fee}/>
          <input type="hidden" name="return_url" value={this.state.return_url}/>
          <input type="hidden" name="sign_type" value={this.state.sign_type}/>
          <input type="hidden" name="seller_id" value={this.state.seller_id}/>
          <input type="submit" value="Confirm" style={{display: "none"}}/>
        </form>
      </View>

    )
  }
})
export default New_User_Welfare;
