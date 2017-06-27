import React from 'react';
import {
  View,
  Container,
  Group,
  Grid,
  Col,
  Modal,
  Field,
  List,
  Icon,
  Card,
  Accordion,
  Slider
} from 'amazeui-touch';
import Tools from '../util/tools';
import pay_back from '../../i/pay-back.png';

import {
  Link,Router,Route,
} from 'react-router';

const Wallet_SupportHotel = React.createClass({

  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },

  getInitialState(){

    return{
      id: "",
      hotelName: "",
      address: "",
      detail: "",
      photos: [],
      rooms: [],
      city: "",
      district: "",
      address: "",
      detail:"",
      hotelDiscount:"",
      discountShow:"",
      hotelLat:"",
      hotelLon:"",
      countInfo:"",
      likeIcon:"none",
      dislikeIcon:"",
      share:false,
      shareInfo:"",
      shareLink:"",
      isShow:"none",
      showAll:"none",
      showOther:"none",
      showDot:"none",
      payBtnInfo:"储值并支付",
      btnPayNewNotPut: "btn-pay-czzf"
    }
    this.setState({
      tabBarVisable:"none"
    })
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
        //let expiry = cardDetail[i].expiry;
        // let devi =  new Date(end).getTime() - start.getTime();
        // let deviDays =Math.floor(devi/(24*3600*1000)) + "天"
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
          deviDays: cardDetail[i].expiry
            ? cardDetail[i].expiry
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
            : "",
          refundExpires: refundExpires
        })
      }
    }
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

  goForPay() {
    let payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;
    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-cczfloading"})
    var payTrue = this.props.location.query.payTrue * 1;
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
                window.location.href = "https://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
              }
              if (window.location.host == "dev.taihuiyuan.com") {
                window.location.href = "https://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
              }
            } else {
              wechatPayParam = eval("(" + wechatPayParam + ")");
              WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  //wx.closeWindow();
                  if (window.location.host == "taihuiyuan.com") {
                    window.location.href = "https://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
                  } else {
                    window.location.href = "https://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
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
                window.location.href = "https://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
                //window.location.href = "http://dev.taihuiyuan.com/pay/index.html?hid=" + hid + "&hname=" + hname + "&device=" + device + "&ut=member" + "&uid=" + uid + "&cardPrice_buy=" + cardPrice_buy;
              }
              if (window.location.host == "dev.taihuiyuan.com") {
                window.location.href = "https://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
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
            window.location.href = "http://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
          } else {
            window.location.href = "http://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
          }
        }
      },
      fail: function(status) {
        console.log(status);
      }
    });

  },

  componentDidMount(){
    var _this = this;
    const vid = this.props.location.query.cardId;
    const cardType = this.props.location.query.cardType;
    var url = (cardType == "DiscountCard") ? ("/vip/"+vid+"/support") : ("/store/"+vid+"/support");
    var hid = this.props.location.query.hid;

    Tools.ajax({
          url: url,
          type: "GET",
          data: {
            "page":1,
            "size":50
          },
          dataType: "json",
          success: function (data, xml) {
              var hotelDetail = eval('(' + data + ')');
              _this.setState({
                rooms: hotelDetail.data.items,
              });
          },
          fail: function (status) {
            console.log(status);
          }
      });
      if(cardType == "DiscountCard"){
          this.getDiscountCardDetail();
      }else{
          this.getCZCardDetail();
      }
  },

  renderRoomList(){
    const rooms = this.state.rooms;

    return(
      <div>
        {rooms.map(function(item, i) {
          var photo = "";
          photo = item.photo.path + "/" + item.photo.name;

          return (
              <div  className="room-list" key={i}>
                <div className="col-HotelImg"><div className="room-img"><img src={photo} style={{height:"2.4rem",width:"3.733333rem"}}/></div></div>
                <div style={{marginLeft:"3.733333rem"}}>
                  <div className="col-Hoteltype"><div className="room-type">{item.name}</div><div className="room-dis">{item.city} {item.county}</div></div>
                  {/* <div className="col-roomPrice"><div className="room-price">¥{item.price}</div></div> */}
                </div>

                <div className="border-line"></div>
              </div>
          );
        })}
      </div>
    )
  },
  showAllDetail(){
    this.setState({
      showAll:"none",
      showOther:"",
      showDot:"none"
    })
  },
  goback() {
    window.history.go(-1);
  },
  render() {

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
    const cardType = this.props.location.query.cardType;

    return (
      <View>

        <Container scrollable>
          <div style={{marginTop:"1.333333rem",marginLeft:"0.666667rem",marginRight:"0.666667rem"}}>
            {this.renderRoomList()}
          </div>
        </Container>
        <div className="payEndNew">
          <div className="btn-pay-back" style={payback} onClick={this.goback}></div>
          <div className={this.state.btnPayNewNotPut} onClick={this.chooseNext}>
              {cardType == "DiscountCard" ? `￥${this.state.cardPrice} 开通` : this.state.payBtnInfo}
          </div>
        </div>

      </View>

    );
  }
});

export default Wallet_SupportHotel;
