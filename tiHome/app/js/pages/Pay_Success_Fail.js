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
import qcode from '../../i/qcode.png';

const Pay_Success_Fail = React.createClass({
  getInitialState(){
    return{
      backInfo:"",
      backTitleInfo:"",
      backCallBack:"",
    }
  },
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  componentDidMount(){

    var status = this.props.location.query.status;
    var backInfo = this.props.location.query.backInfo;
    var backTitleInfo = "";
    var backCallBack = "";
    if(status == "success"){
      backTitleInfo = "恭喜您";
      backCallBack = "支付成功"
    }else{
      backTitleInfo = "很抱歉";
      backCallBack = backInfo;
    }
    console.log(backInfo);
    this.setState({
      backInfo:backInfo,
      backTitleInfo:backTitleInfo,
      backCallBack:backCallBack
    })
  },
  backhome(){
    const path = `/Wallet`
    this.context.router.push({
        pathname: path
      }
    );
  },
  render(){
    var location = window.location.host;
    var background =  "url("+qcode+")";
    if(location =="taihuiyuan.com" || location =="dev.taihuiyuan.com"){
      background = "url(pay/"+qcode+")";
    }

    var cardStyle = {
        background: background,
        backgroundSize:"100% 100%",
        width:"50%",
        height:"160px",
        display:"inline-block",
        float:"left"
      };
    var cardDisCrib = {
      width :"50%",
      display:"inline-block",
      textIndent:"30px"
    }

    return(
      <View>
        <Container scrollable>
            <div className="backTitle">{this.state.backTitleInfo}</div>
            <div className="backSuccess">{this.state.backCallBack}</div>
            <div className="backInfo">
              <span className="border-top-line"></span>
              <div style={cardStyle}></div>
              <div style={cardDisCrib}>
                <div style={{fontSize:"24px",color:"#474747"}}>长按二维码</div>
                <div style={{fontSize:"20px"}}>关注公众号</div>
                <div>*退卡</div>
                <div>*领抵用金</div>
                <div>*查商家</div>
              </div>
            </div>

        </Container>
      </View>
    )
  }
})
export default Pay_Success_Fail;
