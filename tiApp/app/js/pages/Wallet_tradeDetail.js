import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Icon
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';

const Wallet_tradeDetail = React.createClass({
  getInitialState(){
    return{
      albums:[],
      tradePlace:"",
      tradeTime:"",
      tradeCode:"",
      cardName:"",
      paymentChannel:"",
      favorablePrice:0,
      pointNumber:0,
      tradePrice:0
    }
  },
  prevPathenameSave(){
	var _this = this;
    window.addEventListener("popstate", function(e) {

			localStorage.setItem("prevPathename",_this.props.location.pathname);

    }, false); 
  },
  componentDidMount(){

    var _this = this;
	_this.prevPathenameSave();
	var tradeDetail = this.props.location.query.tradeDetail;
    tradeDetail = eval("("+tradeDetail+")");

    var paymentChannel = tradeDetail.paymentChannel;
    if(paymentChannel == "wechat_pay"){
      paymentChannel = "微信";
    }else {
      paymentChannel = "支付宝";
    }
	var discountZk = tradeDetail.discount*10;
	if(discountZk==10){
		var discountNotice = '无';
	}else{
		var discountNotice = discountZk;
	}

    this.setState({
      totalPrice:tradeDetail.totalPrice,
      tradePlace:tradeDetail.tradePlace,
      tradeTime:tradeDetail.tradeTime,
      tradeCode:tradeDetail.tradeCode,
      paymentChannel:paymentChannel,
      favorablePrice:tradeDetail.favorablePrice,
      currency:tradeDetail.currency,
      storedValue:tradeDetail.storedValue,
      discountNotice:discountNotice,
      tradePrice:tradeDetail.tradePrice
    })

    //var url = "/user/"+localStorage.getItem("uid")+"/trade_records"
    // Tools.ajax({
    //       url: url,
    //       type: "GET",
    //       // data: { name: "super", age: 20 },
    //       dataType: "json",
    //       success: function (response, xml) {
    //
    //           var jyjlItem = eval('(' + response + ')');
    //           var items = jyjlItem.data.items;
    //           var albums = [];
    //           if(items.length > 0){
    //             for(let i=0;i< items.length;i++){
    //               albums.push({
    //                 title:items[i].tradePlace,
    //                 subTitle:items[i].tradeTime,
    //                 after:"￥ "+items[i].tradePrice,
    //               })
    //             }
    //           }else {
    //             albums.push({
    //               title:"您暂无交易记录~",
    //               after:"0.00",
    //               subTitle: '',
    //             })
    //           }
    //           _this.setState({
    //             albums :albums
    //           });
    //       },
    //       fail: function (status) {
    //         console.log(status);
    //       }
    //   });
  },
  render(){
    const albums = this.state.albums;
    return(
      <View className="dyj-back">
        <Container scrollable>
          <Group noPadded>
            <div className="home-tradelist">消费记录</div>
            <div className="" style={{marginLeft:"25px",marginRight:"25px"}}>
              <span style={{marginBottom:"10px",display:"inline-block",width:"40%",fontSize:"18px"}}>门店</span><span style={{marginBottom:"10px",display:"inline-block",width:"60%",fontSize:"18px",textAlign:"right"}}>{this.state.tradePlace}</span>
              <span style={{marginBottom:"10px",display:"inline-block",width:"45%",fontSize:"18px"}}>时间</span><span style={{marginBottom:"10px",display:"inline-block",width:"55%",fontSize:"18px",textAlign:"right"}}>{this.state.tradeTime}</span>
              <span style={{marginBottom:"10px",display:"inline-block",width:"45%",fontSize:"18px"}}>单号</span><span style={{marginBottom:"10px",display:"inline-block",width:"55%",fontSize:"18px",textAlign:"right"}}>{this.state.tradeCode}</span>
              <span style={{marginBottom:"15px",display:"inline-block",width:"70%",fontSize:"26px",fontWeight:"700"}}>总金额</span><span style={{marginBottom:"15px",display:"inline-block",width:"30%",fontSize:"26px",fontWeight:"700",textAlign:"right"}}>{this.state.totalPrice}</span>
              <span style={{marginBottom:"15px",display:"inline-block",width:"70%",fontSize:"18px"}}>折扣</span><span style={{marginBottom:"15px",display:"inline-block",width:"30%",fontSize:"18px",textAlign:"right"}}>{this.state.discountNotice}</span>
              <span style={{marginBottom:"15px",display:"inline-block",width:"70%",fontSize:"18px"}}>折扣金额</span><span style={{marginBottom:"15px",display:"inline-block",width:"30%",fontSize:"18px",textAlign:"right"}}>{this.state.favorablePrice}</span>
              <div className="border-top-lineCus" ></div>
              <span style={{display:"inline-block",width:"100%",fontSize:"18px",textAlign:"right"}}>抵用金支付 : {this.state.currency}</span>
              <span style={{display:"inline-block",width:"100%",fontSize:"18px",textAlign:"right"}}>储值支付 : {this.state.storedValue}</span>
				<span style={{display:"inline-block",width:"100%",fontSize:"21px",textAlign:"right",fontWeight:"700"}}>实付 : {this.state.tradePrice}</span>

            </div>
          </Group>
        </Container>
      </View>
    )
  }
})
export default Wallet_tradeDetail;
