import React from 'react';
import {Container,View} from 'amazeui-touch';
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
      btnPayNewNotPut: "btn-pay-newnotput",
      btnPayNewNotPut_CZ: "btn-pay-newnotput_CZ",
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
      payBtnInfo: "支付",
      isSaleCards: true,
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
      availablePoint:0,
      availableStoredValue:0
    };
  },

  noCardPayMoney(payMoney) {
    let _this = this;
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    let device = localStorage.getItem("device");
    let url = "/spotpayment";
    let payParam = {
      price: payMoney,
      device: device,
      uid: uid,
      hotelId: hotelId,
      userVipId: "",
      usePoint: false,
      cardId: ""
    }
    Tools.ajax({
      url: url, //请求地址
      type: "POST", //请求方式
      data: payParam, //请求参数
      dataType: "json",
      success: function(response, xml) {
        var payBtnInfo = "支付";
        _this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-newnotput"})
        var payInfo = eval('(' + response + ')');
        if (payInfo.status == "success") {
          if (device == "wechat") {
            var wechatPayParam = payInfo.data.wechatPayParam;
            var code = payInfo.data.code;
            var exp =  payInfo.data.exp;
            var p =  payInfo.data.p;
            wechatPayParam = eval("(" + wechatPayParam + ")");
            WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                //wx.closeWindow();
                /*不购卡操作*/
                localStorage.setItem("card_buy", "false");
                if (window.location.host == "taihuiyuan.com") {
                  window.location.href = "https://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
                } else {
                  window.location.href = "https://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
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
          // var path = "Pay_Success_Fail";
          // _this.context.router.push({
          //   pathname: path,
          //   query: {
          //     backInfo: payInfo.error,
          //     status: "fail"
          //   }
          // });
          alert(payInfo.error);
          return false;
        }

      },
      fail: function(status) {
        var payBtnInfo = "支付"
        _this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-newnotput"})
        console.log(status);
      }
    });
  },

  vipPayMoney(payMoney, payDiscountMoney) {
    let ownCard = localStorage.getItem("ownCard");
    ownCard = eval("(" + ownCard + ")");
    let userVipId = ownCard.cardId? ownCard.cardId: "";
    let _this = this;
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    let device = localStorage.getItem("device");
    let url = "/spotpayment";
    let payParam = {
      device: device,
      uid: uid,
      hotelId: hotelId,
      price: payMoney,
      userVipId: userVipId,
      cardId: "",
      usePoint: false
    }
    Tools.ajax({
      url: url,
      type: "POST",
      data: payParam,
      dataType: "json",
      success: function(response, xml) {
        var payBtnInfo = "支付"
        document.getElementById("vipPayBtn").innerText = "支付 ￥" + payDiscountMoney;
        var payInfo = eval('(' + response + ')');
        if (payInfo.status == "success") {
          if (device == "wechat") {
            var wechatPayParam = payInfo.data.wechatPayParam;
            var code = payInfo.data.code;
            var exp =  payInfo.data.exp;
            var p =  payInfo.data.p;
            wechatPayParam = eval("(" + wechatPayParam + ")");
            WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                //wx.closeWindow();
                /*不购卡操作*/
                localStorage.setItem("card_buy", "false");
                if (window.location.host == "taihuiyuan.com") {
                  window.location.href = "https://taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
                } else {
                  window.location.href = "https://dev.taihuiyuan.com/index2.html?sid=" + hotelId + "&uid=" + uid + "&code=" + code;
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
          // var path = "Pay_Success_Fail";
          // _this.context.router.push({
          //   pathname: path,
          //   query: {
          //     backInfo: payInfo.error,
          //     status: "fail"
          //   }
          // });
          alert(payInfo.error);
          return false;
        }
      },
      fail: function(status) {
        alert(status);
        document.getElementById("vipPayBtn").innerText = "支付 ￥" + payDiscountMoney;
      }
    });
  },

  oldUserChousePay() {
    const payOldMoney = document.getElementById("payOldMoney").value;
    const ownCard_discount = this.state.ownCard_discount;
    const path = `/New_User_Welfare/`;
    document.getElementById("xdd-keybord").style.display = "none";
    this.context.router.push({
      pathname: path,
      query: {
        userPayMoney: payOldMoney,
        vipgoback: "放弃优惠"
      }
    });
  },

  oldUserPay(e) {
    let payOldMoney = document.getElementById("payOldMoney").value;
    let ownCard_discount = this.state.ownCard_discount;
    let payDiscountMoney = (payOldMoney * ownCard_discount) / 10;
    payDiscountMoney = payDiscountMoney.toFixed(2);
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (!exp.test(payOldMoney) || payOldMoney == "0") {
      alert("输入正确的金额");
      return false;
    }
    if (payOldMoney > 19999.99) {
      alert("输入金额请小于20000");
      return false;
    }
    localStorage.setItem("payOldMoney", payOldMoney);
    localStorage.setItem("ownCard_discount", ownCard_discount);
    var payBtnInfo = "<div class='loader-inner ball-pulse'><div></div><div></div><div></div></div>";
    e.target.innerHTML = payBtnInfo;
    this.vipPayMoney(payOldMoney, payDiscountMoney);
    // document.getElementById("xdd-keybord").style.display = "none";
    // const path = `/Old_User_Welfare/`
    // this.context.router.push({pathname:path,query:{payOldMoney:payOldMoney,ownCard_discount:ownCard_discount}});
  },
  chooseNext(payMoney){
    let isSaleCards = this.state.isSaleCards;
    let storeCards = this.state.storeCards;
    let discountCards = this.state.discountCards;

    if(payMoney.length == 0 && isSaleCards && (storeCards.length !== 0 || discountCards.length !==0)){
      document.getElementById("xdd-keybord").style.display = "none";
      const path = `/New_User_Welfare/`
      this.context.router.push({
        pathname: path,
        query: {
          userPayMoney: payMoney
        }
      });
    }else{
      let isSaleCards = this.state.isSaleCards;
      let availablePoint = this.state.availablePoint;
      let availableStoredValue = this.state.availableStoredValue;
      let defaultDiscount = this.state.defaultDiscount;
      let discountCards = this.state.discountCards;
      let storeCards = this.state.storeCards;
      let canBuyCards = [];
      if (storeCards.length > 0) {
          storeCards.map((item, index) => {
          //原价
          var userPayMoney = payMoney;
          //本次可用抵用金(1 - this.props.location.query.defaultDiscount) * payTrue;
          var availablePoint =(1-defaultDiscount*1) * userPayMoney;
          //储值金额
          //var price = item.price
          //储值余额 availableStoredValue

          //余额 < 原价-折扣 < 储值卡金额 + 余额 + 赠送储值
          var diff0 = userPayMoney*1 - availablePoint*1 -availableStoredValue*1;
          var diff1 = item.price*1 + availableStoredValue*1 + item.storedValue*1 - (userPayMoney*1 - availablePoint*1);
          if (diff0 > 0 && diff1 > 0) {
              canBuyCards.push(item)
          }
        });
      }
      if (!isSaleCards) {
        this.noCardPayMoney(payMoney);
        return false;
      }
      //storeCards ->canBuyCards
      if(discountCards.length == 0 && canBuyCards.length == 0 && availablePoint == 0 && availableStoredValue == 0){
        this.noCardPayMoney(payMoney);
        return false;
      }
      //storeCards ->canBuyCards
      if(discountCards.length == 0 && canBuyCards.length == 0 && (availablePoint != 0 || availableStoredValue !=0)) {
        document.getElementById("xdd-keybord").style.display = "none";
        let path = `/PayEnd_Detail/`
        this.context.router.push({
          pathname: path,
          query: {
            availablePoint: availablePoint,
            cardGivePoint: 0,
            payReduce:0,
            userPayMoney: payMoney,
            payType: "useDYJ",
            availableStoredValue:availableStoredValue,
            defaultDiscount:defaultDiscount,
            payBtnInfo:"jump"
          }
        });
      }

      if(canBuyCards.length == 0 && discountCards.length == 0){
        if(availablePoint == 0 && availableStoredValue ==0){
          this.noCardPayMoney(payMoney);
        }else{
          document.getElementById("xdd-keybord").style.display = "none";
          let path = `/PayEnd_Detail/`
          this.context.router.push({
            pathname: path,
            query: {
              availablePoint: availablePoint,
              cardGivePoint: 0,
              payReduce:0,
              userPayMoney: payMoney,
              payType: "useDYJ",
              availableStoredValue:availableStoredValue,
              defaultDiscount:defaultDiscount,
              payBtnInfo:"jump"
            }
          });
        }
      }

      if(isSaleCards && (canBuyCards.length !=0 || discountCards.length != 0)) {
        document.getElementById("xdd-keybord").style.display = "none";
        const path = `/New_User_Welfare/`
        this.context.router.push({
          pathname: path,
          query: {
            userPayMoney: payMoney
          }
        });
      }
    }
  },
  newUserPay() {
    let newUserPayMoney = document.getElementById("payNewMoney").value;
    let exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    // if (!exp.test(newUserPayMoney) || newUserPayMoney == 0) {
    //   alert("输入正确的金额");
    //   return false;
    // }
    if (newUserPayMoney > 19999.99) {
      alert("输入金额请小于20000");
      return false;
    }
    localStorage.setItem("newUserPayMoney", newUserPayMoney);
    let payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;
    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-newnotloading"})
    this.chooseNext(newUserPayMoney);
  },
  chooseGood() {
    let payMemberMoney = document.getElementById("payMemberMoney").value;
    let cardPrice_buy = Tools.GetQueryString("cardPrice_buy");
    let exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    // if (!exp.test(payMemberMoney) || payMemberMoney == 0) {
    //   alert("金额不能为0");
    //   return false;
    // }
    if (payMemberMoney > 19999.99) {
      alert("输入金额请小于20000");
      return false;
    }
    let payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;
    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-newnotloading"})
    this.chooseNext(payMemberMoney);
  },
  chooseGood_CZ() {
    let payMemberMoney = document.getElementById("payMemberMoney_CZ").value;
    let cardPrice_buy = Tools.GetQueryString("cardPrice_buy");
    let payBtnInfo = <div className="loader-inner ball-pulse">
      <div></div>
      <div></div>
      <div></div>
    </div>;
    if (payMemberMoney > 19999.99) {
      alert("输入金额请小于20000");
      return false;
    }
    this.setState({payBtnInfo: payBtnInfo, btnPayNewNotPut: "btn-pay-newnotloading"})
    this.chooseNext(payMemberMoney);
  },
  GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  },
  componentDidMount() {
    /*获取url的uid*/
    var _this = this;
    var isNewUser = Tools.GetQueryString("ut");
    var hotelId = Tools.GetQueryString("hid");
    var uid = Tools.GetQueryString("uid");
    var device = Tools.GetQueryString("device");
    var hname = Tools.GetQueryString("hname");
    var cardPrice_buy = Tools.GetQueryString("cardPrice_buy");
    let availableStoredValue = 0;
    let availablePoint = 0;
    localStorage.setItem("uid", uid);
    localStorage.setItem("isNewUser", isNewUser);
    localStorage.setItem("hotelId", hotelId);
    localStorage.setItem("device", device);
    localStorage.setItem("hname", hname);
    hname = decodeURI(hname)
    hname = Tools.Base64(hname);
    this.setState({isNewUser: isNewUser, hname: hname})

    if (isNewUser == "member") {
      var payMemberMoney = document.getElementById('payMemberMoney');
      var cursorMember = document.getElementById('cursorMember');
      var btnType = document.getElementById("memberBtn");
      payMemberMoney.onclick = Tools.KeyBoard(payMemberMoney, cursorMember,btnType);
    }
    if (isNewUser == "new") {
      var payNewMoney = document.getElementById('payNewMoney');
      var cursorNew = document.getElementById('cursorNew');
      var btnType = document.getElementById("newBtn");
      payNewMoney.onclick = Tools.KeyBoard(payNewMoney, cursorNew,btnType);
    }
    if (isNewUser == "vip") {
      var payOldMoney = document.getElementById('payOldMoney');
      var cursorVip = document.getElementById("cursorVip");
      var vipReduce = document.getElementById("vipReduce");
      var vipPayBtn = document.getElementById("vipPayBtn");
      //var ownCard_discount = this.state.ownCard_discount;
      //payOldMoney.onclick = Tools.KeyBoard(payOldMoney, cursorVip, vipReduce, ownCard_discount);
    }

    if (cardPrice_buy === null) {
      var url = "/hotel/" + hotelId + "/data";
      Tools.ajax({
        url: url, //请求地址
        type: "GET", //请求方式
        data: {
          uid: uid
        }, //请求参数
        dataType: "json",
        success: function(response, xml) {
          let cardInfo = eval('(' + response + ')')
          let saleCards = JSON.stringify(cardInfo.data.saleCards);
          let discountCards = cardInfo.data.saleCards;
          let storeCards = cardInfo.data.saleStoredCards;
          let isSaleCards = cardInfo.data.isSaleCards;
          availableStoredValue = cardInfo.data.availableStoredValue;
          availablePoint = cardInfo.data.availablePoint;
          let defaultDiscount = cardInfo.data.defaultDiscount;
          var payBtnInfo = "";
          if (isSaleCards && (storeCards.length !== 0 || discountCards.length !==0)) {
            payBtnInfo = "会员卡";
          } else {
            payBtnInfo = "支付";
          }
          localStorage.setItem("isBuyCard", "zk");
          _this.setState({payBtnInfo: payBtnInfo, isSaleCards: isSaleCards,discountCards:discountCards,storeCards:storeCards,availableStoredValue:availableStoredValue,availablePoint:availablePoint,defaultDiscount:defaultDiscount})
          localStorage.setItem("isSaleCards", isSaleCards);
          localStorage.setItem("payBtnInfo", payBtnInfo);
          if (isNewUser == "vip") {
            let ownCard = JSON.stringify(cardInfo.data.ownCard);
            localStorage.setItem("ownCard", ownCard);
            localStorage.setItem("saleCards", saleCards);
            let ownCard_discount = cardInfo.data.ownCard.discount
              ? (cardInfo.data.ownCard.discount * 10).toFixed(1)
              : 10;
            let ownCard_deadline = cardInfo.data.ownCard.deadline.split(" ")[0];
            let ownCard_cardName = cardInfo.data.ownCard.cardName;
            let ownCard_hotelName = cardInfo.data.ownCard.hotelName;
            let ownCard_hotelPhoto = cardInfo.data.ownCard.photo;
            _this.setState({
              ownCard: ownCard,
              saleCards: saleCards,
              ownCard_discount: ownCard_discount,
              ownCard_deadline: ownCard_deadline,
              ownCard_cardName: ownCard_cardName,
              ownCard_hotelName: ownCard_hotelName,
              ownCard_hotelPhoto: ownCard_hotelPhoto
            })
            localStorage.setItem("ownCard_discount", ownCard_discount);
            payOldMoney.onclick = Tools.KeyBoard(payOldMoney, cursorVip, vipReduce, ownCard_discount);
          }
          if (isNewUser == "member" && availableStoredValue != 0) {
            var payMemberMoney_CZ = document.getElementById('payMemberMoney_CZ');
            var cursorMember_CZ = document.getElementById('cursorMember_CZ');
            var btnType = document.getElementById('memberWithStore');
            payMemberMoney_CZ.onclick = Tools.KeyBoard(payMemberMoney_CZ, cursorMember_CZ,btnType);
          }
        },
        fail: function(status) {}
      });
    } else {
      _this.setState({payBtnInfo: "储值卡支付"});
      localStorage.setItem("isBuyCard", "czk");
    }
    let printCardUrl = "/hotel/" + hotelId + "/data";
    Tools.ajax({
      url: printCardUrl, //请求地址
      type: "GET", //请求方式
      data: {
        uid: uid
      }, //请求参数
      dataType: "json",
      success: function(response, xml) {
        let cardInfo = eval('(' + response + ')')
        let availablePoint = cardInfo.data.availablePoint * 1;
        if(availablePoint > 0){
          let url = "/spotpayment";
          let payParam = {
            price: availablePoint,
            device: device,
            uid: (window.location.host == "taihuiyuan.com") ? "be3858a1-4efb-4859-a81d-3d774a9cdf29" : "c02c5ba5-b2f2-49c6-b362-e223cde03794",
            hotelId: (window.location.host == "taihuiyuan.com") ? "ee8576e8-1ef3-4f3f-b139-feb534ad87c4" : "41016c19-b0ad-4977-b424-57314848066b",
            usePoint: true
          }
          Tools.ajax({
            url: url, //请求地址
            type: "POST", //请求方式
            data: payParam, //请求参数
            dataType: "json",
            success: function(response, xml) {},
            fail: function(status) {}
          })
        }
      },
      fail: function(status) {}
    });
  },
  changeBtn() {
    const payOldMoney = document.getElementById("payOldMoney").value;
    if (payOldMoney != "") {
      this.setState({btnPayNotPut: "btn-pay-input"})
    } else {
      this.setState({btnPayNotPut: "btn-pay-notput"})
    }
  },
  changeNewBtn() {
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
      const payMemberMoney_CZ = document.getElementById("payMemberMoney_CZ").value;

      if (payMemberMoney != "" || payMemberMoney_CZ != "") {

        this.setState({btnPayNewNotPut: "btn-pay-newinput"})
      } else {
        this.setState({btnPayNewNotPut: "btn-pay-newnotput"})
      }
    }

  },
  render() {
    let isNewUser = Tools.GetQueryString("ut");
    let hotelId = Tools.GetQueryString("hid");
    let uid = Tools.GetQueryString("uid");
    let device = Tools.GetQueryString("device");
    let hname = Tools.GetQueryString("hname");
    let availableStoredValue = this.state.availableStoredValue;
    if (isNewUser == "vip") {
      let card_bak = this.state.ownCard_hotelPhoto;
      let cardBack = {
        background: "#dedede url(" + card_bak + ") no-repeat"
      };
      let specialVipInput = {
        border: "0px",
        background: "transparent",
        marginLeft: "50px",
        color: "#474747",
        fontSize: "30px",
        paddingTop: "7px",
        marginBottom: "0px"
      }
      return (
        <View className="vipBack">
          <Container scrollable>
            <div className="home-title">请输入折前金额</div>
            <div className="inputMoney">
              {/* <span className="inputVipBefore">￥</span><div  className="moneyVipInputArea"><input className="specialInput_vip" id="payOldMoney" readOnly="readonly" onChange={this.changeBtn} type="number"  min="1"/></div> */}
              <div className="moneyVipInputArea">
                <div className="inputVipBefore">￥</div>
                <div className="cursorVipInput flash" id="cursorVip"></div>
                <div className="inputSpecialBox"><input readOnly="readonly" className="specialInput_vip" id="payOldMoney" onChange={this.changeBtn}/></div>
              </div>
            </div>
            {/* <div className="vipCopration" style={{display:"none"}}>储值余额：{availableStoredValue}</div> */}
            {/* <div className="btn-pay-notput" onClick={this.oldUserChousePay} id="vipPayBtn">去选优惠</div> */}
            <div className="vipDiscount">
              <div className="discount-card" style={cardBack}>
                <div className="discount-level">{this.state.ownCard_discount}折</div>
                <div className="discount-deadline">有效期至 {this.state.ownCard_deadline}</div>
              </div>
              <div className="moreCards">
                <div className="vipBig">尊享优惠<span id="vipReduce">￥0</span></div>
                <div onClick={this.oldUserChousePay} className="vipMoreCards">更多会员卡</div>
              </div>
            </div>
            <div className={this.state.btnPayNotPut} onClick={this.oldUserPay} id="vipPayBtn">支付</div>
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
    if (isNewUser == "member" && availableStoredValue == 0) {
      var specialInput = {
        border: "0 rem",
        background: "transparent",
        marginLeft: "0.8 rem",
        color: "#fff",
        fontSize: "0.58 rem",
        paddingTop: "0.19 rem",
        marginBottom: "0 rem",
        paddingBottom: "0.2 rem"
      }
      return (
        <View className="new-background">
          <Container scrollable>
            <div className="home-new-title">请输入您的金额</div>
            <div className="hotel-card-new">{this.state.hname}</div>

            <div className="inputMoney">
              <div className="moneyInputArea">
                <div className="inputBefore">￥</div>
                <div className="cursorInput flash" id="cursorMember"></div>
                <div className="inputSpecialBox"><input readOnly="readonly" className="inputSpecial" id="payMemberMoney" onChange={this.changeNewBtn} style={specialInput}/></div>
              </div>
            </div>
            {/* <div className="copration-new" >储值余额：{this.state.availableStoredValue}</div> */}
            <div className={this.state.btnPayNewNotPut} id="memberBtn" onClick={this.chooseGood}>{this.state.payBtnInfo}</div>
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

    if (isNewUser == "member" && availableStoredValue != 0) {
      var specialInput = {
        border: "0 rem",
        background: "transparent",
        marginLeft: "0.8 rem",
        color: "#fff",
        fontSize: "0.58 rem",
        paddingTop: "0.19 rem",
        marginBottom: "0 rem",
        paddingBottom: "0.2 rem"
      }
      return (
        <View className="vipBack">
          <Container scrollable>
            <div className="home-title">请输入折前金额</div>
            <div className="inputMoney">
              <div className="moneyVipInputArea">
                <div className="inputVipBefore">￥</div>
                <div className="cursorVipInput flash" id="cursorMember_CZ"></div>
                <div className="inputSpecialBox"><input readOnly="readonly" className="inputSpecial" id="payMemberMoney_CZ" onChange={this.changeNewBtn}/></div>
              </div>
            </div>
            {/* <div className="vipCopration" >储值余额：{this.state.availableStoredValue}</div> */}
            <div className="memberDiscount">
              <div className="storeMoney">
                <div>{availableStoredValue}元</div>
                <span>本店储值余额</span>
              </div>
              <div className="borderMiddle"></div>
              <div className="discountMoney">
                <div>{this.state.availablePoint}元</div>
                <span>抵用金余额</span>
              </div>
            </div>
            <div className={this.state.btnPayNewNotPut} style={{background:"#00a698",color:"#fff"}} id="memberWithStore" onClick={this.chooseGood_CZ}>{this.state.payBtnInfo}</div>
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

    if (isNewUser == "new") {
      var specialInput = {
        border: "0px",
        background: "transparent",
        marginLeft: "50px",
        color: "#fff",
        fontSize: "30px",
        paddingTop: "7px",
        marginBottom: "0px"
      }
      return (
        <View className="new-background">
          <Container scrollable>
            <div className="home-new-title">请输入您的金额</div>
            <div className="hotel-card-new">{this.state.hname}</div>

            <div className="inputMoney">
              {/* <div className="moneyInputArea"><span className="inputBefore">￥</span><input readOnly="readonly" className="inputSpecial" id="payNewMoney" onChange={this.changeNewBtn} type="number" style={specialInput} min="1"/></div> */}
              <div className="moneyInputArea">
                <div className="inputBefore">￥</div>
                <div className="cursorInput flash" id="cursorNew"></div>
                <div className="inputSpecialBox"><input readOnly="readonly" className="inputSpecial" id="payNewMoney" onChange={this.changeNewBtn} style={specialInput}/></div>
              </div>
            </div>

            {/* <div className="copration-new">储值余额：{availableStoredValue}</div> */}
            <div className={this.state.btnPayNewNotPut} id="newBtn" onClick={this.newUserPay}>{this.state.payBtnInfo}</div>
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

  }
})

export default Index;
/*首页*/
