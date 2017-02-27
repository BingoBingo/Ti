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

  componentDidMount(){
    var _this = this;
    var tradeDetail = this.props.location.query.tradeDetail;
    tradeDetail = eval("("+tradeDetail+")");
    var payTrue = tradeDetail.tradePrice*1 -tradeDetail.favorablePrice*1 -tradeDetail.pointNumber*1;
    payTrue = payTrue.toFixed(2);
    var paymentChannel = tradeDetail.paymentChannel;
    if(paymentChannel == "wechat_pay"){
      paymentChannel = "微信";
    }else {
      paymentChannel = "支付宝";
    }
    this.setState({
      tradePlace:tradeDetail.tradePlace,
      tradeTime:tradeDetail.tradeTime,
      tradeCode:tradeDetail.tradeCode,
      cardName:tradeDetail.cardName,
      paymentChannel:paymentChannel,
      favorablePrice:tradeDetail.favorablePrice,
      pointNumber:tradeDetail.pointNumber,
      tradePrice:tradeDetail.tradePrice,
      payTrue:payTrue
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
              <span style={{marginBottom:"10px",display:"inline-block",width:"40%",fontSize:"16px"}}>消费门店</span><span style={{marginBottom:"10px",display:"inline-block",width:"60%",fontSize:"16px",textAlign:"right"}}>{this.state.tradePlace}</span>
              <span style={{marginBottom:"10px",display:"inline-block",width:"45%",fontSize:"16px"}}>支付时间</span><span style={{marginBottom:"10px",display:"inline-block",width:"55%",fontSize:"16px",textAlign:"right"}}>{this.state.tradeTime}</span>
              <span style={{marginBottom:"10px",display:"inline-block",width:"45%",fontSize:"16px"}}>交易单号</span><span style={{marginBottom:"10px",display:"inline-block",width:"55%",fontSize:"16px",textAlign:"right"}}>{this.state.tradeCode}</span>
              <span style={{marginBottom:"10px",display:"inline-block",width:"45%",fontSize:"16px"}}>会员卡</span><span style={{marginBottom:"10px",display:"inline-block",width:"55%",fontSize:"16px",textAlign:"right"}}>{this.state.cardName}</span>
              <span style={{display:"inline-block",width:"70%",fontSize:"16px"}}>支付途径</span><span style={{display:"inline-block",width:"30%",fontSize:"16px",textAlign:"right"}}>{this.state.paymentChannel}</span>
              <div className="border-top-line" style={{display:"inline-block",marginTop:"25px",marginBottom:"25px"}}></div>
              <span style={{marginBottom:"15px",display:"inline-block",width:"70%",fontSize:"18px"}}>原价</span><span style={{marginBottom:"15px",display:"inline-block",width:"30%",fontSize:"18px",textAlign:"right"}}>{this.state.tradePrice}</span>
              <span style={{marginBottom:"15px",display:"inline-block",width:"70%",fontSize:"18px"}}>会员折扣</span><span style={{marginBottom:"15px",display:"inline-block",width:"30%",fontSize:"18px",textAlign:"right"}}>{this.state.favorablePrice}</span>
              <span style={{display:"inline-block",width:"70%",fontSize:"18px"}}>使用抵用金</span><span style={{display:"inline-block",width:"30%",fontSize:"18px",textAlign:"right"}}>{this.state.pointNumber}</span>
              <div className="border-top-line" style={{display:"inline-block",marginTop:"25px",marginBottom:"25px"}}></div>
              <span style={{display:"inline-block",width:"70%",fontSize:"21px"}}>实付</span><span style={{display:"inline-block",width:"30%",fontSize:"21px",textAlign:"right"}}>{this.state.payTrue}</span>

            </div>
          </Group>
        </Container>
      </View>
    )
  }
})
export default Wallet_tradeDetail;
