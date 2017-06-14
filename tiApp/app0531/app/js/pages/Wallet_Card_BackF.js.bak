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

const Wallet_Card_BackF = React.createClass({
  getInitialState(){
    return{
      backInfo:"",
      backTitleInfo:"",
      backCallBack:"",
      giveBack:"0",
      givePoint:"0",
      lat:"0",
      lng:"0"
    }
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  componentDidMount(){

    var status = this.props.location.query.status;
    var backInfo = this.props.location.query.backInfo;
    var givePoint = this.props.location.query.givePoint;
    var giveBack = this.props.location.query.giveBack;
    var backTitleInfo = "";
    var backCallBack = "";
    if(status == "success"){
      backTitleInfo = "恭喜您";
      backCallBack = "退卡成功"
    }else{
      backTitleInfo = "很抱歉";
      backCallBack = backInfo;
    }
    console.log(backInfo);
    this.setState({
      backInfo:backInfo,
      backTitleInfo:backTitleInfo,
      backCallBack:backCallBack,
      givePoint:givePoint,
      giveBack:giveBack
    })

    /*获取url的uid*/
    var _this = this;
    var uid = Tools.GetQueryString("uid");
    var url = "/user/"+uid+"/data";
    var lat = this.state.lat;
    var lng = this.state.lng;

    //var mockurl = "http://localhost:3005/home";
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          data: {
            uid:uid,
            userLat:lat,
            userLng:lng
          },        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var appInfo = eval('(' + response + ')');

              _this.setState({
                hotelInfo:appInfo.data.hotelInfo,
                visible:false
              })
              localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
              localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
              localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
          },
          fail: function (status) {

            console.log(status);
          }
      });
  },
  backhome(){
    const path = `/Wallet`
    this.context.router.push({
        pathname: path
      }
    );
  },
  render(){
    return(
      <View>
        <Container scrollable>
            <div className="backTitle">{this.state.backTitleInfo}</div>
            <div className="backSuccess">{this.state.backCallBack}</div>
            <div className="backInfo">
              <span style={{marginBottom:"10px",display:"inline-block",width:"80%",fontSize:"16px",float:"left"}}>扣除抵用金</span><span style={{marginBottom:"10px",display:"inline-block",width:"20%",fontSize:"16px",textAlign:"right"}}><span style={{fontSize:"15px"}}>￥</span>{this.state.givePoint}</span>
              <span style={{display:"inline-block",width:"80%",fontSize:"16px",float:"left"}}>返还金额</span><span style={{display:"inline-block",width:"20%",fontSize:"16px",textAlign:"right"}}><span style={{fontSize:"15px"}}>￥</span>{this.state.giveBack}</span>
              <div className="border-top-line"></div>
              <span className="backInfoTitle">* 1~3个工作日内退回至当时购卡的账户中</span>
              <span className="backInfoDis">银行处理可能有延迟，具体以账户的到账时间为准</span>
            </div>
            <div className="btn-backhome" onClick={this.backhome}>完成</div>
        </Container>
      </View>
    )
  }
})
export default Wallet_Card_BackF;
