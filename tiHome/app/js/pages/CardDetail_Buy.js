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
import pay_back from '../../i/pay-back.png';

const CardDetail_Buy = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    var payReduce = this.props.location.query.payReduce;
    return {
      btnPayNotPut: "btn-pay-input",
      payReduce: payReduce,
      saleCards: [],
      cardDiscount: "",
      cardName: "",
      cardId:"",
      storeId:"",
      cardDeadLine: "",
      cardPrice: "",
      cardGivePoint: "",
      cardTQ: "",
      cardMD: "",
      supportCount: "",
      payBtnInfo:"储值并支付",
      btnPayNewNotPut: "btn-pay-czzf",
    }
  },
  confirmCZ(){
    const path = `/PayEnd_WithCard/`;
    var payTrue = this.props.location.query.payTrue;
    var cardId = this.props.location.query.cardId;
    localStorage.setItem("isBuyCard","zk");
    this.context.router.push({
      pathname:path,
      query: {
          cardId: cardId,
          cardPrice: this.state.cardPrice,
          cardDiscount: this.state.cardDiscount,
          userPayMoney: payTrue,
          itemPhoto: this.state.itemPhoto
      }});
  },
  goForPay() {
    let payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;
    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-cczfloading"})
    var payTrue = this.props.location.query.userPayMoney * 1;
    payTrue = payTrue.toFixed(2);
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
      price: payTrue,
      usePoint: true,
      cardId: "",
      storeId: (typeof(cardId) == "undefined") ? "" : cardId,
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
  chooseNext() {
    const cardId = this.props.location.query.cardId;
    const cardType = this.props.location.query.cardType;
    const availablePoint = this.props.location.query.availablePoint;
    const payTrue = this.props.location.query.payTrue;

    if(cardType == "DiscountCard"){
      const path = `/PayEnd_WithCard/`;
      this.context.router.push({
        pathname: path,
        query: {
          cardId:cardId,
          availablePoint:availablePoint,
          cardPrice:this.state.cardPrice ,
          cardDiscount:this.state.cardDiscount,
          userPayMoney:payTrue,
          itemPhoto:this.state.itemPhoto
        }
      });
    }else{
      this.goForPay();
    }
  },
  componentDidMount() {
    let cardType = this.props.location.query.cardType;
    if(cardType == "DiscountCard"){
        this.getDiscountCardDetail();
    }else{
        this.getCZCardDetail();
    }
  },
  getCZCardDetail() {
    var cardDetail = localStorage.getItem("saleStoredCards");
    cardDetail = eval("(" + cardDetail + ")");
    var cardId = this.props.location.query.cardId;
    var payReduce = this.props.location.query.payReduce;
    var itemPhoto = this.props.location.query.itemPhoto;
    var refundExpires= this.props.location.query.refundExpires;
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
          cardId: cardDetail[i].cardId
            ? cardDetail[i].cardId
            : "",
          storeId:"",
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
            : "",
          refundExpires: refundExpires
        })
      }
    }
  },
  getDiscountCardDetail(){
    var cardDetail = localStorage.getItem("saleCards");
    cardDetail = eval("(" + cardDetail + ")");
    var cardId = this.props.location.query.cardId;
    var payReduce = this.props.location.query.payReduce;
    var itemPhoto = this.props.location.query.itemPhoto;
    var refundExpires= this.props.location.query.refundExpires;
    this.setState({itemPhoto: itemPhoto})
    for (let i = 0; i < cardDetail.length; i++) {
      if (cardDetail[i].cardId == cardId) {
        let start = new Date();
        let end = cardDetail[i].expiry;
        let devi =  new Date(end).getTime() - start.getTime();
        let deviDays =Math.floor(devi/(24*3600*1000)) + "天"
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
          storeId: cardDetail[i].cardId
            ? cardDetail[i].cardId
            : "",
          cardId: "",
          deviDays:deviDays,
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
            : "",
          refundExpires: refundExpires
        })
      }
    }
  },
  goback() {
    window.history.go(-1);
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
    var about = this.props.location.query.about;
    var cardId = this.props.location.query.cardId;
    var privilegeCount = this.props.location.query.privilegeCount == 0 ? "无" : this.props.location.query.privilegeCount + "项";
    var cardType = this.props.location.query.cardType;
    var payTrue = this.props.location.query.payTrue;
    var availablePoint = this.props.location.query.availablePoint;


    var location = window.location.host;
    var backgroundImage = "url(" + pay_back + ")";
    if (location == "taihuiyuan.com" || location == "dev.taihuiyuan.com") {
      backgroundImage = "url(pay/" + pay_back + ")"
    }
    var payback = {
      backgroundImage: backgroundImage,
      backgroundSize: "cover",
      backgroundColor: "#fff",
      height: "0.853333rem",
      width: "0.853333rem"
    };

    return (
      <View>
        <Container scrollable>
          <div style={cardBack}>
            <div className="cardDiscount">{cardType == "DiscountCard" ? <div><span style={{fontSize:"0.64rem",color:"#a0a0a0"}}>{this.state.cardDiscount}折卡</span> · <span style={{fontSize:"0.64rem"}}>{this.state.deviDays}</span></div>
            : <div><span style={{fontSize:"0.64rem",color:"#a0a0a0"}}>储值</span> · <span style={{fontSize:"0.64rem"}}>{this.state.cardPrice}元</span></div>}</div>
            <div className="cardDetail_name">{this.state.cardName}</div>
            <div className="cardDetail_deadline">
            {/* 有效期{this.state.cardDeadLine}天 */}
            </div>
            <div className="cardDetail_price">
            {/* 售价{this.state.cardPrice}元 */}
            </div>
          </div>
          <div className="cardDetail-top-line" style={{display: this.state.refundExpires == "不可退" ? "none" : ""}}></div>
          <div className="cardDetail-list" style={{display: this.state.refundExpires == "不可退" ? "none" : ""}}>
            <span className="info-before">无理由退卡</span>
            <span className="info-after">{this.state.refundExpires}</span>
          </div>
          <div className="cardDetail-top-line"></div>
          <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
            <div className="cardDetail-list">
              <span className="info-before">赠抵用金</span>
              <span className="info-after">{this.state.cardGivePoint}元</span>
            </div>
          </Link>
          {/* <Link to={{pathname:"Dyj_Detail",query:{pathType:"sstsm"}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <span className="info-before">随时退</span>
              <span className="info-after">详情</span>
            </div>
          </Link> */}
          <Link to={{pathname: "Dyj_Detail",query: {pathType: "hyksm",about: about}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <span className="info-before">本卡特权</span>
              <span className="info-after">{privilegeCount}</span>
            </div>
          </Link>
          <Link to={{pathname: "Wallet_SupportHotel",query: {cardId: cardId,cardType:cardType}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <div className="pserson-wechat">
                <span className="info-before">适用门店</span>
                <span className="info-after">{this.state.supportCount}家</span>
              </div>
            </div>
          </Link>
          <div className="cardDetail-top-line"></div>
          <div style={{height:"2.6rem"}}></div>
        </Container>
        <div className="payEndNew">
          <div className="btn-pay-back" style={payback} onClick={this.goback}></div>
          <div className={this.state.btnPayNewNotPut} onClick={this.chooseNext}>
              {/* <Link to={{pathname:(cardType == "DiscountCard") ? "PayEnd_WithCard" :"PayEnd_Detail",
                  query:(cardType == "DiscountCard") ? {cardId:cardId,availablePoint:availablePoint,cardPrice:this.state.cardPrice ,cardDiscount:this.state.cardDiscount,userPayMoney:payTrue,itemPhoto:this.state.itemPhoto}
                  :{cardId:cardId,availablePoint:availablePoint,cardGivePoint:this.state.cardGivePoint,cardPrice:this.state.cardPrice,userPayMoney:this.props.location.query.userPayMoney,availableStoredValue: this.props.location.query.availableStoredValue,defaultDiscount:this.props.location.query.defaultDiscount}
              }}>
                {cardType == "DiscountCard" ? `￥${this.state.cardPrice} 开通` : `储值并支付`}
              </Link> */}
              {cardType == "DiscountCard" ? `￥${this.state.cardPrice} 开通` : this.state.payBtnInfo}
          </div>
        </div>
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
    )
  }
})
export default CardDetail_Buy;
