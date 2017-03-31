import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Field,
  Button,
  Icon
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';

const Index = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
      isNewUser:"",
      hotelId:"",
      uid:"",
      device:"",
      btnPayNotPut:"btn-pay-notput",
      btnPayNewNotPut:"btn-pay-newnotput",
      payOldDeadline:"",
      payOldAvailable:"",
      ownCard:"",
      saleCards : "",
      ownCard_discount : "",
      ownCard_deadline : "",
      ownCard_cardName : "",
      ownCard_hotelName : "",
      isNewUser:"",
      ownCard_hotelPhoto:"",
      hname:"",
      payBtnInfo:"支付",
      isSaleCards:true,
      alipayForm:"",
      _input_charset:"",
      subject:"",
      sign:"",
      it_b_pay:"",
      notify_url:"",
      body:"",
      payment_type:"",
      out_trade_no:"",
      partner:"",
      service:"",
      total_fee:"",
      return_url:"",
      sign_type:"",
      seller_id:""
    };
  },

  noCardPayMoney(payMoney){

    var payMoney = payMoney;
    // var ownCard = localStorage.getItem("ownCard");
    // ownCard = eval("("+ownCard+")");
    // let userVipId = ownCard.cardId ? ownCard.cardId :"";
    var _this = this;
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    let device = localStorage.getItem("device");
    var url = "/spotpayment";
    var payParam = {
      price:payMoney,
      device :device,
      uid : uid,
      hotelId :hotelId,
      userVipId :"",
      usePoint:false,
      cardId:""
    }

    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: payParam,        //请求参数
          dataType: "json",
          success: function (response, xml) {
                var payBtnInfo = "支付"

                _this.setState({
                  payBtnInfo:payBtnInfo,
                  btnPayNewNotPut:"btn-pay-newnotput"
                })
                var payInfo = eval('(' + response + ')');
                if(payInfo.status == "success"){
                  if(device == "wechat"){
                    var wechatPayParam = payInfo.data.wechatPayParam;
                    var code = payInfo.data.code;
                    var exp = payInfo.data.exp;
                    var p = payInfo.data.p;
                    wechatPayParam = eval("("+wechatPayParam+")");
                    WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
                      if (res.err_msg == "get_brand_wcpay_request:ok") {
                        wx.closeWindow();
                        /*不购卡操作*/
                        localStorage.setItem("card_buy","false");
                        if(window.location.host == "taihuiyuan.com"){
                          window.location.href=  "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards")+"&code=" +code+"&exp=" +exp+"&p=" +p ;
                        }else{
                          window.location.href=  "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards")+"&code=" +code+"&exp=" +exp+"&p=" +p ;
                        }
                      }
                    });
                  }
                  if(device == "alipay"){
                    localStorage.setItem("card_buy","false");
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
                      _input_charset:_input_charset,
                      subject:subject,
                      sign:sign,
                      it_b_pay:it_b_pay,
                      notify_url:notify_url,
                      body:body,
                      payment_type:payment_type,
                      out_trade_no:out_trade_no,
                      partner:partner,
                      service:service,
                      total_fee:total_fee,
                      return_url:return_url,
                      sign_type:sign_type,
                      seller_id:seller_id
                    })
                    document.forms['alipaysubmit'].submit();

                  }
                }else{
                  var path = "Pay_Success_Fail";
                  _this.context.router.push({
                  pathname: path,
                  query: { backInfo: payInfo.error,status:"fail"}
                  }
                );
                }

          },
          fail: function (status) {
            var payBtnInfo = "支付"
            alert("error: " + status);
            _this.setState({
              payBtnInfo:payBtnInfo,
              btnPayNewNotPut:"btn-pay-newnotput"
            })
            console.log(status);
          }
      });
  },

  vipPayMoney(payMoney,payDiscountMoney){
    var payMoney = payMoney;
    var ownCard = localStorage.getItem("ownCard");
    ownCard = eval("("+ownCard+")");
    let userVipId = ownCard.cardId ? ownCard.cardId :"";

    var _this = this;
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    let device = localStorage.getItem("device");
    var url = "/spotpayment";
    var payParam = {
      device :device,
      uid : uid,
      hotelId :hotelId,
      price:payMoney,
      userVipId :userVipId,
      cardId:"",
      usePoint:false,

    }

    Tools.ajax({
          url: url,
          type: "POST",
          data: payParam,
          dataType: "json",
          success: function (response, xml) {
                var payBtnInfo = "支付"

                document.getElementById("vipPayBtn").innerText = "支付 ￥"+ payDiscountMoney;
                var payInfo = eval('(' + response + ')');
                if(payInfo.status == "success"){
                  if(device == "wechat"){
                    var wechatPayParam = payInfo.data.wechatPayParam;
                    var code = payInfo.data.code;
                    var exp = payInfo.data.exp;
                    var p = payInfo.data.p;
                    wechatPayParam = eval("("+wechatPayParam+")");
                    WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
                      if (res.err_msg == "get_brand_wcpay_request:ok") {
                        wx.closeWindow();
                        /*不购卡操作*/
                        localStorage.setItem("card_buy","false");
                        if(window.location.host == "taihuiyuan.com"){
                          window.location.href=  "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards")+"&code=" +code+"&exp=" +exp+"&p=" +p ;
                        }else{
                          window.location.href=  "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards")+"&code=" +code+"&exp=" +exp+"&p=" +p ;
                        }
                      }
                    });
                  }
                  if(device == "alipay"){
                    localStorage.setItem("card_buy","false");
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
                      _input_charset:_input_charset,
                      subject:subject,
                      sign:sign,
                      it_b_pay:it_b_pay,
                      notify_url:notify_url,
                      body:body,
                      payment_type:payment_type,
                      out_trade_no:out_trade_no,
                      partner:partner,
                      service:service,
                      total_fee:total_fee,
                      return_url:return_url,
                      sign_type:sign_type,
                      seller_id:seller_id
                    })
                    document.forms['alipaysubmit'].submit();

                  }
                }else{
                  var path = "Pay_Success_Fail";
                  _this.context.router.push({
                  pathname: path,
                  query: { backInfo: payInfo.error,status:"fail"}
                  }
                );
                }
          },
          fail: function (status) {
            document.getElementById("vipPayBtn").innerText = "支付 ￥"+ payDiscountMoney;
          }
      });
  },

  oldUserChousePay(){
    const payOldMoney= document.getElementById("payOldMoney").value;
    const ownCard_discount = this.state.ownCard_discount;
    const path = `/New_User_Welfare/`;
    document.getElementById("xdd-keybord").style.display = "none";
    this.context.router.push({pathname:path,query:{userPayMoney:payOldMoney,vipgoback:"返回"}});
},

  oldUserPay(e){
    let payOldMoney= document.getElementById("payOldMoney").value;
    let ownCard_discount = this.state.ownCard_discount;
    let payDiscountMoney = (payOldMoney * ownCard_discount)/10;
    payDiscountMoney = payDiscountMoney.toFixed(2);
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if(!exp.test(payOldMoney) || payOldMoney == "0"){
        alert("输入正确的金额");
        return false;
    }
    if(payOldMoney > 9999.99){
      alert("单笔支付金额不能超过1w元");
      return false;
    }
    localStorage.setItem("payOldMoney",payOldMoney);
    localStorage.setItem("ownCard_discount",ownCard_discount);
    var payBtnInfo =
    "<div class='loader-inner ball-pulse'><div></div><div></div><div></div></div>";
    e.target.innerHTML = payBtnInfo;
    this.vipPayMoney(payOldMoney,payDiscountMoney);
    // document.getElementById("xdd-keybord").style.display = "none";
    // const path = `/Old_User_Welfare/`
    // this.context.router.push({pathname:path,query:{payOldMoney:payOldMoney,ownCard_discount:ownCard_discount}});
  },


newUserPay(){
  const newUserPayMoney= document.getElementById("payNewMoney").value;
  var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
  if(!exp.test(newUserPayMoney) || newUserPayMoney == 0){
      alert("输入正确的金额");
      return false;
  }
  if(newUserPayMoney > 9999.99){
    alert("单笔支付金额不能超过1w元");
    return false;
  }

  localStorage.setItem("newUserPayMoney",newUserPayMoney);

  var isSaleCards = this.state.isSaleCards;
  //var isSaleCards = false;

  var payBtnInfo =
  <div className="loader-inner ball-pulse">
    <div></div>
    <div></div>
    <div></div>
  </div>;

  this.setState({
    payBtnInfo:payBtnInfo,
    btnPayNewNotPut:"btn-pay-newnotloading"
  })
  //return false;

  if(!isSaleCards){
    this.noCardPayMoney(newUserPayMoney);
  }else{
    document.getElementById("xdd-keybord").style.display = "none";
    const path = `/New_User_Welfare/`
    this.context.router.push({pathname:path,query:{userPayMoney:newUserPayMoney}});
  }
},

chooseGood(){

  const payMemberMoney= document.getElementById("payMemberMoney").value;
  // var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
  // if(!exp.test(payMemberMoney) || payMemberMoney == 0){
  //     alert("输入正确的金额");
  //     return false;
  // }
  if(payMemberMoney > 9999.99){
    alert("单笔支付金额不能超过1w元");
    return false;
  }
  var isSaleCards = this.state.isSaleCards;
  var payBtnInfo =
  <div className="loader-inner ball-pulse">
    <div></div>
    <div></div>
    <div></div>
  </div>;

  this.setState({
    payBtnInfo:payBtnInfo,
    btnPayNewNotPut:"btn-pay-newnotloading"
  })

  if(!isSaleCards){
    this.noCardPayMoney(payMemberMoney);
  }else{
    document.getElementById("xdd-keybord").style.display = "none";
    const path = `/New_User_Welfare/`
    this.context.router.push({pathname:path,query:{userPayMoney:payMemberMoney}});
  }
  //localStorage.setItem("newUserPayMoney",newUserPayMoney);

},
GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
},

componentDidMount() {

  /*获取url的uid*/
  var _this = this;
  var isNewUser = Tools.GetQueryString("ut");
  var hotelId = Tools.GetQueryString("hid");
  var uid = Tools.GetQueryString("uid");
  var device = Tools.GetQueryString("device");
  var hname = Tools.GetQueryString("hname");
  hname = decodeURI(hname)
  hname = Tools.Base64(hname);
  this.setState({
    isNewUser : isNewUser,
    hname: hname
  })
  if(isNewUser == "member"){
    var payMemberMoney = document.getElementById('payMemberMoney');
    var cursorMember = document.getElementById('cursorMember');
    payMemberMoney.onclick = Tools.KeyBoard(payMemberMoney,cursorMember);
  }
  if(isNewUser == "new"){
    var payNewMoney = document.getElementById('payNewMoney');
    var cursorNew = document.getElementById('cursorNew');
    payNewMoney.onclick = Tools.KeyBoard(payNewMoney,cursorNew);
  }
  if(isNewUser == "vip"){
    var payOldMoney = document.getElementById('payOldMoney');
    var cursorVip = document.getElementById("cursorVip");
    var vipReduce = document.getElementById("vipReduce");
    var vipPayBtn = document.getElementById("vipPayBtn");
    payOldMoney.onclick = Tools.KeyBoard(payOldMoney,cursorVip,vipReduce,vipPayBtn);
  }
  localStorage.setItem("uid",uid);
  localStorage.setItem("isNewUser",isNewUser);
  localStorage.setItem("hotelId",hotelId);
  localStorage.setItem("device",device);
  localStorage.setItem("hname",hname);
  var url = "/hotel/"+hotelId+"/data";
  //var mockurl = "http://localhost:3005/home";
  //if(isNewUser == "vip"){
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          data: { uid:uid },        //请求参数
          dataType: "json",
          success: function (response, xml) {
                var cardInfo = eval('(' + response + ')')

                console.log(cardInfo);
                let saleCards = JSON.stringify(cardInfo.data.saleCards);
                let isSaleCards = cardInfo.data.isSaleCards;
                console.log("--------------------");
                console.log(isSaleCards);
                var payBtnInfo = "";
                if(isSaleCards){
                  payBtnInfo = "去选折扣";
                }else{
                  payBtnInfo = "支付";
                }

                _this.setState({
                  payBtnInfo:payBtnInfo,
                  isSaleCards:isSaleCards
                })
                localStorage.setItem("isSaleCards",isSaleCards);

                if(isNewUser == "vip"){

                  let ownCard = JSON.stringify(cardInfo.data.ownCard);
                  localStorage.setItem("ownCard",ownCard);
                  localStorage.setItem("saleCards",saleCards);
                  let ownCard_discount = cardInfo.data.ownCard.discount ? (cardInfo.data.ownCard.discount * 10).toFixed(1) :10;
                  let ownCard_deadline = cardInfo.data.ownCard.deadline.split(" ")[0];
                  let ownCard_cardName = cardInfo.data.ownCard.cardName;
                  let ownCard_hotelName = cardInfo.data.ownCard.hotelName;
                  let ownCard_hotelPhoto = cardInfo.data.ownCard.photo;

                  _this.setState({
                    ownCard:ownCard,
                    saleCards:saleCards,
                    ownCard_discount : ownCard_discount,
                    ownCard_deadline : ownCard_deadline,
                    ownCard_cardName : ownCard_cardName,
                    ownCard_hotelName : ownCard_hotelName,
                    ownCard_hotelPhoto :ownCard_hotelPhoto

                  })
                  localStorage.setItem("ownCard_discount",ownCard_discount);
                }
          },
          fail: function (status) {
            console.log(status);
          }
      });
  //}

},
changeBtn(){
    alert("test")
    console.log("--test");
    //console.log(event.target.elements);
    //const mobileNum = event.target.elements[0].value;
    const payOldMoney = document.getElementById("payOldMoney").value;
    if(payOldMoney != ""){
      this.setState({
        btnPayNotPut:"btn-pay-input"
      })
    }else{
      this.setState({
        btnPayNotPut:"btn-pay-notput"
      })
    }
  },
  changeNewBtn(){
      //console.log(event.target.elements);
      //const mobileNum = event.target.elements[0].value;
      console.log(document.getElementById("payMemberMoney").value);

      const userType = this.state.isNewUser;

      if(userType == "new"){
        const payMoney = document.getElementById("payNewMoney").value;
        if(payMoney != ""){

          this.setState({
            btnPayNewNotPut:"btn-pay-newinput"
          })
        }else{
          this.setState({
            btnPayNewNotPut:"btn-pay-newnotput"
          })
        }
      }
      if(userType == "member"){
        const payMemberMoney = document.getElementById("payMemberMoney").value;
        if(payMemberMoney != ""){

          this.setState({
            btnPayNewNotPut:"btn-pay-newinput"
          })
        }else{
          this.setState({
            btnPayNewNotPut:"btn-pay-newnotput"
          })
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

  if(isNewUser == "vip"){

  var card_bak = this.state.ownCard_hotelPhoto;
  var cardBack = {
    background:"#dedede url("+card_bak+") no-repeat",
  };

  var specialVipInput = {
    border:"0px",
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
          <div className="moneyVipInputArea"><div className="inputVipBefore">￥</div><div className="cursorVipInput flash" id="cursorVip"></div><div className="inputSpecialBox"><input readOnly="readonly" className="specialInput_vip" id="payOldMoney" onChange={this.changeBtn}  /></div></div>
        </div>

        <div className="vipCopration" style={{display:"none"}}>由钛会员&reg;提供技术支持</div>

        {/* <div className="vipDiscount">
          <div className="discount-card" style={cardBack}>
            <div className="discount-level"></div>
            <div className="discount-deadline"></div>
          </div>
          <div className="moreCards">
            <div className="vipBig">尊享优惠<span id="vipReduce">￥0</span></div>
            <div onClick={this.oldUserChousePay} className="vipMoreCards">更多会员卡</div>
          </div>
        </div> */}

        <div className="btn-pay-notput" onClick={this.oldUserChousePay} id="vipPayBtn">去选优惠</div>

      </Container>

      <form id="alipaysubmit" name="alipaysubmit" style={{display:"none"}} action="https://mapi.alipay.com/gateway.do?_input_charset=UTF-8" method="POST">
      <input type="hidden" name="_input_charset"  value={this.state._input_charset}/>
      <input type="hidden" name="subject"  value={this.state.subject} />
      <input type="hidden" name="sign"  value={this.state.sign} />
      <input type="hidden" name="it_b_pay"  value={this.state.it_b_pay} />
      <input type="hidden" name="notify_url"  value={this.state.notify_url}/>
      <input type="hidden" name="body"  value={this.state.body}/>
      <input type="hidden" name="payment_type"  value={this.state.payment_type} />
      <input type="hidden" name="out_trade_no"  value={this.state.out_trade_no} />
      <input type="hidden" name="partner"  value={this.state.partner} />
      <input type="hidden" name="service"  value={this.state.service} />
      <input type="hidden" name="total_fee"  value={this.state.total_fee} />
      <input type="hidden" name="return_url"  value={this.state.return_url} />
      <input type="hidden" name="sign_type"  value={this.state.sign_type} />
      <input type="hidden" name="seller_id"  value={this.state.seller_id}/>
      <input type="submit" value="Confirm" style={{display:"none"}}/>
      </form>

    </View>
  );
}
if(isNewUser == "member"){

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
                 {/* <div  className="moneyInputArea"><div className="inputBefore">￥</div><input readOnly="readonly" className="specialInput_member" id="payMemberMoney" onChange={this.changeNewBtn} pattern="[0-9]*" type="number"  min="1"/></div> */}
                 <div  className="moneyInputArea"><div className="inputBefore">￥</div><div className="cursorInput flash" id="cursorMember"></div><div className="inputSpecialBox"><input readOnly="readonly" className="inputSpecial" id="payMemberMoney"  onChange={this.changeNewBtn} style={specialInput} /></div></div>
              </div>
              <div className="copration-new" style={{display:"none"}}>由钛会员&reg;提供技术支持</div>
              <div className={this.state.btnPayNewNotPut} onClick={this.chooseGood}>{this.state.payBtnInfo}</div>
      </Container>

      <form id="alipaysubmit" name="alipaysubmit" style={{display:"none"}} action="https://mapi.alipay.com/gateway.do?_input_charset=UTF-8" method="POST">
      <input type="hidden" name="_input_charset"  value={this.state._input_charset}/>
      <input type="hidden" name="subject"  value={this.state.subject} />
      <input type="hidden" name="sign"  value={this.state.sign} />
      <input type="hidden" name="it_b_pay"  value={this.state.it_b_pay} />
      <input type="hidden" name="notify_url"  value={this.state.notify_url}/>
      <input type="hidden" name="body"  value={this.state.body}/>
      <input type="hidden" name="payment_type"  value={this.state.payment_type} />
      <input type="hidden" name="out_trade_no"  value={this.state.out_trade_no} />
      <input type="hidden" name="partner"  value={this.state.partner} />
      <input type="hidden" name="service"  value={this.state.service} />
      <input type="hidden" name="total_fee"  value={this.state.total_fee} />
      <input type="hidden" name="return_url"  value={this.state.return_url} />
      <input type="hidden" name="sign_type"  value={this.state.sign_type} />
      <input type="hidden" name="seller_id"  value={this.state.seller_id}/>
      <input type="submit" value="Confirm" style={{display:"none"}}/>
      </form>

    </View>
  );
}
if (isNewUser == "new"){

  var specialInput = {
    border:"0px",
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
                <div className="moneyInputArea"><div className="inputBefore">￥</div><div className="cursorInput flash" id="cursorNew"></div><div className="inputSpecialBox"><input readOnly="readonly" className="inputSpecial" id="payNewMoney" onChange={this.changeNewBtn}  style={specialInput} /></div></div>
              </div>

              <div className="copration-new" style={{display:"none"}}>由钛会员&reg;提供技术支持</div>
              <div className={this.state.btnPayNewNotPut} onClick={this.newUserPay}>{this.state.payBtnInfo}</div>
      </Container>

      <form id="alipaysubmit" name="alipaysubmit" style={{display:"none"}} action="https://mapi.alipay.com/gateway.do?_input_charset=UTF-8" method="POST">
      <input type="hidden" name="_input_charset"  value={this.state._input_charset}/>
      <input type="hidden" name="subject"  value={this.state.subject} />
      <input type="hidden" name="sign"  value={this.state.sign} />
      <input type="hidden" name="it_b_pay"  value={this.state.it_b_pay} />
      <input type="hidden" name="notify_url"  value={this.state.notify_url}/>
      <input type="hidden" name="body"  value={this.state.body}/>
      <input type="hidden" name="payment_type"  value={this.state.payment_type} />
      <input type="hidden" name="out_trade_no"  value={this.state.out_trade_no} />
      <input type="hidden" name="partner"  value={this.state.partner} />
      <input type="hidden" name="service"  value={this.state.service} />
      <input type="hidden" name="total_fee"  value={this.state.total_fee} />
      <input type="hidden" name="return_url"  value={this.state.return_url} />
      <input type="hidden" name="sign_type"  value={this.state.sign_type} />
      <input type="hidden" name="seller_id"  value={this.state.seller_id}/>
      <input type="submit" value="Confirm" style={{display:"none"}}/>
      </form>
    </View>
  );
}

}
})

export default Index;
/*首页*/
