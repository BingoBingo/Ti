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

const Old_User_Welfare = React.createClass({

  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    let payOldMoney = localStorage.getItem("payOldMoney");
    let ownCard_discount = localStorage.getItem("ownCard_discount");
    // var userPayMoney = this.props.location.query.payOldMoney;
    // var ownCard_discount = this.props.location.query.ownCard_discount;
    var payReduce = payOldMoney * ownCard_discount/10;
    console.log(payReduce);
    //var payReduce = payOldMoney - ownCard_discount*payOldMoney/10;
    return{
      btnPayNotPut:"btn-pay-input",
      payOldMoney:payOldMoney,
      payReduce:payReduce,
      ownCard_discount :ownCard_discount,
      payReduceMoney:"",
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
    }
  },
  getMoreGood(){
    let payOldMoney = localStorage.getItem("payOldMoney");
    const path = `/New_User_Welfare/`
    this.context.router.push({pathname:path,query:{userPayMoney:payOldMoney,vipgoback:"返回"}});
  },
  oldPayMoney(){

    let payMoney = document.getElementById("payMoney").value;
    var ownCard = localStorage.getItem("ownCard");
    ownCard = eval("("+ownCard+")");
    let userVipId = ownCard.cardId;
    
    let uid = localStorage.getItem("uid");
    let hotelId = localStorage.getItem("hotelId");
    let device = Tools.GetQueryString("device");
    var url = "/spotpayment";
    var payParam = {
      price:payMoney,
      uid : uid,
      hotelId :hotelId,
      userVipId :userVipId,
      usePoint:false,
      device :device
    }
    console.log(payParam);

    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: payParam,        //请求参数
          dataType: "json",
          success: function (response, xml) {

                var payInfo = eval('(' + response + ')');
                if(payInfo.status == "success"){

                  if(device == "wechat"){
                    var wechatPayParam = payInfo.data.wechatPayParam;
                    wechatPayParam = eval("("+wechatPayParam+")");
                    WeixinJSBridge.invoke('getBrandWCPayRequest', wechatPayParam, function(res) {
                      if (res.err_msg == "get_brand_wcpay_request:ok") {
                        wx.closeWindow();
                        if(window.location.host == "taihuiyuan.com"){
                          window.location.href=  "http://taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards")+"&code=" +code+"&exp=" +exp+"&p=" +p ;
                        }else{
                          window.location.href=  "http://dev.taihuiyuan.com/index2.html?isSaleCards=" + localStorage.getItem("isSaleCards")+"&code=" +code+"&exp=" +exp+"&p=" +p ;
                        }
                        }
                    });
                  }

                  if(device == "alipay"){
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
            console.log(status);
          }
      });
  },
  componentDidMount(){
    let payOldMoney = localStorage.getItem("payOldMoney");
    let ownCard_discount = localStorage.getItem("ownCard_discount");
    // var userPayMoney = this.props.location.query.payOldMoney;
    // var ownCard_discount = this.props.location.query.ownCard_discount;
    var payReduce = (payOldMoney * ownCard_discount)/10;
    var payReduceMoney = payOldMoney - payReduce;
    payReduceMoney = payReduceMoney.toFixed(2);

    payReduce = payReduce.toFixed(2);
    this.setState({
      payOldMoney :payOldMoney,
      ownCard_discount :ownCard_discount,
      payReduce:payReduce,
      payReduceMoney:payReduceMoney
    })
  },
  render(){
    return(
      <View>
        <Container scrollable>

          <div className="home-title">消费金额</div>

          <List className="money-input">
              <List.Item
                nested="input"
                >
                <Field
                  label= '￥'
                  type='text'
                  onChange={this.changeBtn}
                  id="payMoney"
                  defaultValue = {this.state.payOldMoney}
                />
              </List.Item>
          </List>
          <div className="oldDiscount">
            优惠￥{this.state.payReduceMoney}
          </div>
          <div className="discount-welfare">
            <div className="welfare-level" onClick={this.getMoreGood}>更多优惠</div>
            <div className="welfare-reduce" onClick={this.oldPayMoney}> 支付￥{this.state.payReduce}</div>
          </div>
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
    )
  }
})
export default Old_User_Welfare;
