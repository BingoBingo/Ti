import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Field,
  Button
} from 'amazeui-touch';
import {Link} from 'react-router';
import Tools from '../util/tools';
const Index = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      isNewUser: "",
      hotelId: "",
      uid: "",
      device: "",
      btnPayNotPut: "btn-pay-notput",
      btnPayNewNotPut: "payEnd",
      payOldDeadline: "",
      payOldAvailable: "",
      ownCard: "",
      saleCards: "",
      ownCard_discount: "",
      ownCard_deadline: "",
      ownCard_cardName: "",
      ownCard_hotelName: "",
      isNewUser: "",
      ownCard_hotelPhoto: "",
      hname: "",
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
      payBtnInfo: "去支付 ￥",
      trueCost: 0,
      discountMoney: 0,
      payTrue: 0,
      cardDiscount: 0,
      cardPrice: 0,
      itemPhoto: 0,
      cardDiscount: 0
    };
  },

  oldUserPay() {
    const payOldMoney = document.getElementById("payOldMoney").value;
    const ownCard_discount = this.state.ownCard_discount;
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (!exp.test(payOldMoney) || payOldMoney == "0") {
      alert("输入正确的金额");
      return false;
    }
    localStorage.setItem("payOldMoney", payOldMoney);
    localStorage.setItem("ownCard_discount", ownCard_discount);
    const path = `/Old_User_Welfare/`
    this.context.router.push({
      pathname: path,
      query: {
        payOldMoney: payOldMoney,
        ownCard_discount: ownCard_discount
      }
    });
  },

  newUserPay() {
    const newUserPayMoney = document.getElementById("payNewMoney").value;
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (!exp.test(newUserPayMoney) || newUserPayMoney == 0) {
      alert("输入正确的金额");
      return false;
    }
    localStorage.setItem("newUserPayMoney", newUserPayMoney);
    const path = `/New_User_Welfare/`
    this.context.router.push({
      pathname: path,
      query: {
        userPayMoney: newUserPayMoney
      }
    });
  },

  chooseGood() {
    const payMemberMoney = document.getElementById("payMemberMoney").value;
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (!exp.test(payMemberMoney) || payMemberMoney == 0) {
      alert("输入正确的金额");
      return false;
    }
    const path = `/New_User_Welfare/`
    this.context.router.push({
      pathname: path,
      query: {
        userPayMoney: payMemberMoney
      }
    });
  },

  GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  },

  goForPay() {
    var userPayMoney = this.props.location.query.userPayMoney * 1;
    userPayMoney = userPayMoney.toFixed(2);
    var discountMoney = this.state.trueCost;
    var cardId = this.props.location.query.cardId;
    var payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;
    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "payEnd payend-loading"})
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    let device = Tools.GetQueryString("device");
    var ownCard = localStorage.getItem("ownCard");
    ownCard = eval("(" + ownCard + ")");
    var url = "/spotpayment";
    var payParam = {
      device: device,
      uid: uid,
      hotelId: hotelId,
      price: userPayMoney,
      cardId: cardId,
      storeId: "",
      usePoint: true,
      userVipId: ""
    }
    var _this = this;
    Tools.ajax({
      url: url, //请求地址
      type: "POST", //请求方式
      data: payParam, //请求参数
      dataType: "json",
      success: function(response, xml) {
        var payInfo = eval('(' + response + ')');
        var payBtnInfo = "去支付 ￥";
        // _this.setState({payBtnInfo: payBtnInfo, trueCost: discountMoney, btnPayNewNotPut: "payEnd"})
        _this.setState({trueCost: discountMoney})
        if (payInfo.status == "success") {
          if (device == "wechat") {
            var wechatPayParam = payInfo.data.wechatPayParam;
            var code = payInfo.data.code;
            var exp = payInfo.data.exp;
            var p = payInfo.data.p;
            wechatPayParam = eval("(" + wechatPayParam + ")");
            WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                //wx.closeWindow();
                var hid = localStorage.getItem("hotelId");
                var hname = localStorage.getItem("hname");
                var device = localStorage.getItem("device");
                var ut = localStorage.getItem("isNewUser");
                var uid = localStorage.getItem("uid");
                var cardPrice_buy = localStorage.getItem("cardPrice_buy");
                if (window.location.host == "taihuiyuan.com") {
                  window.location.href = "http://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
                } else {
                  window.location.href = "http://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
                }
              }
            });
          }
          if (device == "alipay") {
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
          var path = "Pay_Success_Fail";
          _this.context.router.push({
            pathname: path,
            query: {
              backInfo: payInfo.error,
              status: "fail"
            }
          });
        }
      },
      fail: function(status) {
        alert(status);
        var payBtnInfo = "去支付 ￥";
        _this.setState({payBtnInfo: payBtnInfo, trueCost: userPayMoney, btnPayNewNotPut: "payEnd"})
        console.log(status);
      }
    });
  },

  componentDidMount() {
    var isNewUser = Tools.GetQueryString("ut");
    var hotelId = Tools.GetQueryString("hid");
    var uid = Tools.GetQueryString("uid");
    var device = Tools.GetQueryString("device");
    var hname = Tools.GetQueryString("hname");
    //实际输入
    var payTrue = this.props.location.query.userPayMoney * 1;
    payTrue = payTrue.toFixed(2);
    //扣减抵用金
    //var availablePoint = this.props.location.query.availablePoint * 1;
    //卡折扣
    var cardDiscount = this.props.location.query.cardDiscount * 1;
    //卡售价
    var cardPrice = this.props.location.query.cardPrice * 1;
    var itemPhoto = this.props.location.query.itemPhoto;
    //存储，支付成功页使用
    localStorage.setItem("cardDiscount_buy", cardDiscount);
    localStorage.setItem("cardPrice_buy", cardPrice);
    localStorage.setItem("card_buy", "true");
    localStorage.setItem("itemPhoto_buy", itemPhoto)
    //会员折扣
    var discountMoney = payTrue * (1 - cardDiscount / 10);
    discountMoney = discountMoney.toFixed(2);
    var trueCost = payTrue * 1 + cardPrice * 1 - discountMoney * 1
    trueCost = trueCost.toFixed(2);
    this.setState({
      trueCost: trueCost,
      discountMoney: discountMoney,
      cardDiscount: cardDiscount,
      payTrue: payTrue,
      cardPrice: cardPrice,
      itemPhoto: itemPhoto
    })
  },

  changeBtn(e) {
    const payOldMoney = document.getElementById("payOldMoney").value;
    if (payOldMoney != "") {
      this.setState({btnPayNotPut: "btn-pay-input"})
    } else {
      this.setState({btnPayNotPut: "btn-pay-notput"})
    }
  },

  changeNewBtn(e) {
    const userType = this.state.isNewUser;
    if (userType == "new") {
      const payMoney = document.getElementById("payNewMoney").value;
      if (payMoney != "") {
        this.setState({btnPayNewNotPut: "btn-pay-newinput"})
      } else {
        this.setState({btnPayNewNotPut: "btn-pay-newnotput"})
      }
    }
    if (userType == "member") {
      const payMemberMoney = document.getElementById("payMemberMoney").value;
      if (payMemberMoney != "") {
        this.setState({btnPayNewNotPut: "btn-pay-newinput"})
      } else {
        this.setState({btnPayNewNotPut: "btn-pay-newnotput"})
      }
    }
  },
  
  render() {
    return (
      <View className="payEnd-background">
        <Container scrollable>
          <div className="home-new-title">支付明细</div>
          <div className="payCostMoney">
            <span className="data-before">消费金额</span>
            <span className="data-after">￥{this.state.payTrue}</span>
          </div>
          <div className="payCostMoney">
            <span className="data-before">{this.state.cardDiscount}折卡</span>
            <span className="data-after">￥{this.state.cardPrice.toFixed(2)}</span>
          </div>
          <div className="payCostMoney">
            <span className="data-before reduce-dyj">会员折扣</span>
            <span className="data-after reduce-dyj">￥{this.state.discountMoney}</span>
          </div>
          <div className="card-border-line"></div>
          <div className="payTrueMoney">
            <span className="data-before dyjTrueMoney">实付</span>
            <span className="data-after dyjTrueMoney">￥{this.state.trueCost}</span>
          </div>
          <div className="checkTK"><input type="checkbox" style={{
        zoom: "2"
      }} checked/>
            <span>我同意《会员协议》中的条款</span>
          </div>
          <div className={this.state.btnPayNewNotPut} onClick={this.goForPay}>{this.state.payBtnInfo}{this.state.trueCost}</div>
        </Container>
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
          <input type="submit" value="Confirm" style={{
            display: "none"
          }}/>
        </form>
      </View>
    );
  }
})
export default Index;
