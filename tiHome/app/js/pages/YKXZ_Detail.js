import React from 'react';
import {View} from 'amazeui-touch';
import {
  Link,Router,Route,Container
} from 'react-router';

import Tools from '../util/tools';
import back from '../../i/back.jpg';
import close from '../../i/close.png';


const YKXZ_Detail = React.createClass({

  getInitialState(){
    return{
      albums:[],
      share:false,
      shareInfo:"",
      shareLink:"",
      notice:""
    }
  },

  componentDidMount(){
    let notice = this.props.location.query.notice;
    if(notice.length == 0){
      notice = "暂无"
    }
    this.setState({notice:notice})
  },

  goBack(){
      window.history.back();
  },

  render(){

    var pathType = this.props.location.query.pathType;
    var location = window.location.host;
    var backgroundImage = backgroundImage = "url("+back+")"
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
        <Container scrollable>
        <div>
          <div className="sst_head">用卡须知</div>
          <div className="title_0" style={{lineHeight:"0.8rem",textIndent:"0.53rem",margin:"1rem 0.666667rem"}}>{this.state.notice}</div>
        </div>
        <div className="closeBtn" onClick={this.goBack}>
          <div style={closePic}></div>
        </div>
        </Container>
      </View>
    )
  }
})
export default YKXZ_Detail;
