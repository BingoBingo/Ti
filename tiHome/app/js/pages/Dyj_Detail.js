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
import dyjsm from '../../i/dyjsm.jpg';
import sstsm from '../../i/sstsm.jpg';
import back from '../../i/back.jpg';
import close from '../../i/close.png';


const Dyj_Detail = React.createClass({
  getInitialState(){
    return{
      albums:[],
      share:false,
      shareInfo:"",
      shareLink:"",
      isShow:"none",
      sstInfo:"none",
      dyjInfo:"none",
      hykInfo:"none",
      specialArray:[]
    }
  },

  componentDidMount(){
    var pathType = this.props.location.query.pathType;
    if(pathType == "sstsm"){
        this.setState({
          sstInfo:""
        })
    }
    if(pathType == "dyjsm"){
        this.setState({
          dyjInfo:""
        })
    }
    if(pathType == "hyksm"){
        var about = this.props.location.query.about;

        var aboutArray = (typeof(about) == "undefined") ? [] : about.split("@@");
        var specialArray = [];
        if(aboutArray.length == 0){
          specialArray.push(<div className="title_0">本卡暂无特权</div>)
        }else{
          for(var i=0;i<aboutArray.length;i++){
            specialArray.push(<div className="title_0">{i*1 + 1}、{aboutArray[i]}</div>)
          }
        }
        this.setState({
          hykInfo:"",
          specialArray:specialArray
        })
    }
  },
  goBack(){
      window.history.back();
  },
  render(){



    var pathType = this.props.location.query.pathType;


    var location = window.location.host;
    var backgroundImage = "";

    if(pathType == "sstsm"){
        backgroundImage = "url("+back+")"
    }

    if(pathType == "dyjsm"){
        backgroundImage = "url("+back+")"
    }
    if(pathType == "hyksm"){
        backgroundImage = "url("+back+")"
    }
    var closePic = "url("+close+")";
    var cardBack = {
      backgroundImage:backgroundImage,
      backgroundSize:"cover",
      backgroundColor:"#fff",
      height:"100%",
      width: "100%",
      right: "0",
      left: "0",
    };

    var closePic = {
    backgroundImage:closePic,
    backgroundSize:"cover",
    height: "0.72rem",
    width: "0.72rem",
    right: "0",
    left: "0",
    display: "inline-block"
  }

    return(
      <View className="dyj-back" style={cardBack}>
        <div style={{display:this.state.sstInfo}}>
          <div className="sst_head">随时退</div>
          <div className="sst_shead">以下权益由 钛会员&trade;为您保障</div>
          <div className="title_0">不限时间</div>
          <div className="title_0_0">自购卡之日起永久可退卡</div>
          <div className="title_0">不限状态</div>
          <div className="title_0_0">失效过期、商家停业均可退卡</div>
          <div className="title_0">极速退卡</div>
          <div className="title_0_0">无需审核，卡费原途径退还，1-3日到账</div>
          <div className="title_0">无手续费</div>
          <div className="title_0_0">仅扣除此卡以往优惠及购卡时所赠抵用金</div>
        </div>

        <div style={{display:this.state.dyjInfo}}>
          <div className="sst_head">抵用金</div>
          <div className="sst_shead">以下权益由 钛会员&trade;为您保障</div>
          <div className="title_0">全网通用</div>
          <div className="title_0_0">钛会员全部商家通用</div>
          <div className="title_0">不设上限</div>
          <div className="title_0_0">消费金额越高可用抵用金越多</div>
          <div className="title_0">永久有效</div>
          <div className="title_0_0">等额抵用现金，不过期</div>
        </div>

        <div style={{display:this.state.hykInfo}}>
          <div className="sst_head">会员卡特权</div>
          <div className="sst_shead">以下权益由商家提供</div>
          {this.state.specialArray}
        </div>
        <div className="closeBtn" onClick={this.goBack}>
          <div style={closePic}></div>
          {/* <img src={closePic}/> */}
        </div>
      </View>
    )
  }
})
export default Dyj_Detail;

//
// const Dyj_Detail = React.createClass({
//   getInitialState(){
//     return{
//       albums:[],
//       share:false,
//       shareInfo:"",
//       shareLink:"",
//       isShow:"none"
//     }
//   },
//
//   componentDidMount(){
//
//   },
//   render(){
//
//
//
//     var pathType = this.props.location.query.pathType;
//
//
//     var location = window.location.host;
//     var backgroundImage = "";
//
//     if(pathType == "sstsm"){
//       if(location =="taihuiyuan.com" || location =="dev.taihuiyuan.com"){
//         backgroundImage = "url(pay/"+sstsm+")"
//       }else{
//         backgroundImage = "url("+sstsm+")"
//       }
//     }
//
//     if(pathType == "dyjsm"){
//       if(location =="taihuiyuan.com" || location =="dev.taihuiyuan.com"){
//         backgroundImage = "url(pay/"+dyjsm+")"
//       }else{
//         backgroundImage = "url("+dyjsm+")"
//       }
//     }
//
//     var cardBack = {
//       backgroundImage:backgroundImage,
//       backgroundSize:"cover",
//       backgroundColor:"#fff",
//       height:"100%",
//       width: "100%",
//       right: "0",
//       left: "0",
//     };
//
//     return(
//       <View className="dyj-back" style={cardBack}>
//
//       </View>
//     )
//   }
// })
// export default Dyj_Detail;
