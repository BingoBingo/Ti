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
      btnPayNewNotPut: "btn-pay-newnotput",
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
      seller_id: ""
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
    var userPayMoney = this.props.location.query.cardPrice;
    var cardId = this.props.location.query.cardId;
    var ownCard = localStorage.getItem("ownCard");
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    var url = "/spotpayment";
    let device = Tools.GetQueryString("device");

    var payParam = {
      device: device,
      uid: uid,
      hotelId: hotelId,
      price: userPayMoney,
      usePoint: true,
      cardId: cardId,
      userVipId: ""
    }
    var _this = this;
    localStorage.setItem("card_buy", "false");
    Tools.ajax({
      url: url, //请求地址
      type: "POST", //请求方式
      data: payParam, //请求参数
      dataType: "json",
      success: function(response, xml) {
        var payInfo = eval('(' + response + ')');
        var code = payInfo.data.code;
        var exp = payInfo.data.exp;
        var p = payInfo.data.p;
        if (payInfo.status == "success") {
          if (device == "wechat") {
            var wechatPayParam = payInfo.data.wechatPayParam;
            var isBuyCard = localStorage.getItem("isBuyCard");
            if (wechatPayParam == "") {
              if (window.location.host == "taihuiyuan.com") {
                window.location.href = "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
              }
              if (window.location.host == "dev.taihuiyuan.com") {
                window.location.href = "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
              }
            } else {
              wechatPayParam = eval("(" + wechatPayParam + ")");
              WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  wx.closeWindow();
                  if (window.location.host == "taihuiyuan.com") {
                    window.location.href = "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
                  } else {
                    window.location.href = "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
                  }
                }
              });
            }
          }

          if (device == "alipay") {
            var alipayForm = payInfo.data.alipayParam;
            var isBuyCard = localStorage.getItem("isBuyCard");
            if (alipayForm == "") {
              if (window.location.host == "taihuiyuan.com") {
                window.location.href = "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
                //window.location.href = "http://dev.taihuiyuan.com/pay/index.html?hid=" + hid + "&hname=" + hname + "&device=" + device + "&ut=member" + "&uid=" + uid + "&cardPrice_buy=" + cardPrice_buy;
              }
              if (window.location.host == "dev.taihuiyuan.com") {
                window.location.href = "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
                //window.location.href = "http://dev.taihuiyuan.com/pay/index.html?hid=" + hid + "&hname=" + hname + "&device=" + device + "&ut=member" + "&uid=" + uid + "&cardPrice_buy=" + cardPrice_buy;
              }
            } else {
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
          }
        } else {
          if (window.location.host == "taihuiyuan.com") {
            window.location.href = "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
          } else {
            window.location.href = "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards") + "&code=" + code + "&exp=" + exp + "&p=" + p;
          }
        }
      },
      fail: function(status) {
        console.log(status);
      }
    });

  },

  componentDidMount() {},
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

    // var isNewUser = this.state.isNewUser;
    // var hotelId = this.state.hotelId
    // var uid = this.state.uid
    // var device = this.state.device

    var isNewUser = Tools.GetQueryString("ut");
    var hotelId = Tools.GetQueryString("hid");
    var uid = Tools.GetQueryString("uid");
    var device = Tools.GetQueryString("device");
    var hname = Tools.GetQueryString("hname");
    //实际输入
    var payTrue = this.props.location.query.userPayMoney * 1;
    payTrue = payTrue.toFixed(2);
    //扣减抵用金
    var availablePoint = this.props.location.query.availablePoint * 1;
    availablePoint = availablePoint.toFixed(2);

    //本单抵扣
    var payReduce = this.props.location.query.payReduce * 1;
    payReduce = payReduce.toFixed(2);

    var payCost = payTrue - payReduce;
    payCost = payCost.toFixed(2);
    var cardId = this.props.location.query.cardId;

    //实付
    var cardPrice = this.props.location.query.cardPrice * 1;
    cardPrice = cardPrice.toFixed(2);

    return (
      <View className="payEnd-background">
        <Container scrollable>

          <div className="home-new-title">支付明细</div>

          <div className="payCostMoney">
            <span className="data-before">消费金额</span>
            <span className="data-after">￥{payTrue}</span>
          </div>
          <div className="payDiscountMoney">
            <span className="data-before reduce-dyj">抵用金</span>
            <span className="data-after reduce-dyj">￥-{payReduce}</span>
          </div>
          <div className="dyj-border-line"></div>
          <div className="payTrueMoney">
            <span className="data-before dyjTrueMoney">储值支付</span>
            <span className="data-after dyjTrueMoney">￥{payCost}</span>
          </div>
          <div className="payEnd" onClick={this.goForPay}>储值 ￥{cardPrice}</div>
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
/*首页*/
