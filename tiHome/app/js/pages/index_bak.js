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
      hname:""
    };
  },
  oldUserPay(){
    const payOldMoney= document.getElementById("payOldMoney").value;
    const ownCard_discount = this.state.ownCard_discount;
    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if(!exp.test(payOldMoney) || payOldMoney == "0"){
        alert("输入正确的金额");
        return false;
    }
    localStorage.setItem("payOldMoney",payOldMoney);
    localStorage.setItem("ownCard_discount",ownCard_discount);
    const path = `/Old_User_Welfare/`
    this.context.router.push({pathname:path,query:{payOldMoney:payOldMoney,ownCard_discount:ownCard_discount}});
  },
newUserPay(){
  const newUserPayMoney= document.getElementById("payNewMoney").value;
  var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
  if(!exp.test(newUserPayMoney) || newUserPayMoney == 0){
      alert("输入正确的金额");
      return false;
  }
  localStorage.setItem("newUserPayMoney",newUserPayMoney);
  const path = `/New_User_Welfare/`
  this.context.router.push({pathname:path,query:{userPayMoney:newUserPayMoney}});
},

chooseGood(){
  const payMemberMoney= document.getElementById("payMemberMoney").value;
  var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
  if(!exp.test(payMemberMoney) || payMemberMoney == 0){
      alert("输入正确的金额");
      return false;
  }
  //localStorage.setItem("newUserPayMoney",newUserPayMoney);
  const path = `/New_User_Welfare/`
  this.context.router.push({pathname:path,query:{userPayMoney:payMemberMoney}});
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


  this.setState({
    isNewUser : isNewUser,
    hname: hname
  })

  localStorage.setItem("uid",uid);
  localStorage.setItem("isNewUser",isNewUser);
  localStorage.setItem("hotelId",hotelId);
  localStorage.setItem("device",device);
  localStorage.setItem("hname",hname);
  var url = "/hotel/"+hotelId+"/data";
  //var mockurl = "http://localhost:3005/home";
  if(isNewUser == "vip"){
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          data: { uid:uid },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              var cardInfo = eval('(' + response + ')')

                console.log(cardInfo);
                let ownCard = JSON.stringify(cardInfo.data.ownCard);
                let saleCards = JSON.stringify(cardInfo.data.saleCards);

                localStorage.setItem("ownCard",ownCard);
                localStorage.setItem("saleCards",saleCards);

                let ownCard_discount = cardInfo.data.ownCard.discount ? (cardInfo.data.ownCard.discount * 10).toFixed(1) :"";
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

          },
          fail: function (status) {
            console.log(status);
          }
      });
  }

},
changeBtn(e){
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
  changeNewBtn(e){
      //console.log(event.target.elements);
      //const mobileNum = event.target.elements[0].value;
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
          console.log("00000");
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
    backgroundImage:"url("+card_bak+")",
    backgroundSize:"cover",
    backgroundColor:"#fff",
    height:"120px"
  };

  console.log(cardBack);

  return (
    <View>
      <Container scrollable>

        <div className="home-title">请输入折前金额</div>


        <List className="money-input">
            <List.Item
              nested="input"
              >
              <Field
                label= '￥'
                type='text'
                placeholder={'...'}
                onChange={this.changeBtn}
                id="payOldMoney"
              />
            </List.Item>
        </List>
        <div className="vipCopration">由钛会员&reg;提供技术支持</div>

        <div className="card-status">已持卡</div>
        <div className="discount-card" style={cardBack}>
          <div className="discount-level">{this.state.ownCard_discount}折</div>
          <div className="discount-deadline">有效期至 ￥{this.state.ownCard_deadline}</div>
        </div>
        <div className={this.state.btnPayNotPut} onClick={this.oldUserPay}>支付</div>

      </Container>
    </View>
  );
}
if(isNewUser == "member"){

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
              <div className="hotel-card-new">春天连锁酒店</div>
              <List className="money-new-input" style={{display:"none"}}>
                  <List.Item
                    nested="input"
                    >
                    <Field
                      label= '￥'
                      type='text'
                      placeholder={'...'}
                      onChange={this.changeNewBtn}
                      id="payMemberMoney"
                    />
                  </List.Item>
              </List>
              <div className="inputMoney">
                <span className="inputBefore">￥</span><div className="moneyInputArea"><input className="inputSpecial" id="payMemberMoney" onChange={this.changeNewBtn} type="number" style={specialInput} min="1"/></div>
              </div>
              <div className="copration-new">由钛会员&reg;提供技术支持</div>
              <div className={this.state.btnPayNewNotPut} onClick={this.chooseGood}>选择优惠</div>
      </Container>
    </View>
  );
}
if (isNewUser == "new"){

  return (
    <View className="new-background">
      <Container scrollable>
              <div className="home-new-title">请输入您的金额</div>
              <div className="hotel-card-new">哈尔滨春天国际酒店</div>
              <List className="money-new-input">
                  <List.Item
                    nested="input"
                    >
                    <Field
                      label= '￥'
                      type='text'
                      placeholder={'...'}
                      onChange={this.changeNewBtn}
                      id="payNewMoney"
                    />
                  </List.Item>
              </List>
              <div className="copration">由钛会员&reg;提供技术支持</div>
              <div className={this.state.btnPayNewNotPut} onClick={this.newUserPay}>确定</div>
      </Container>
    </View>
  );
}

}
})

export default Index;
/*首页*/
