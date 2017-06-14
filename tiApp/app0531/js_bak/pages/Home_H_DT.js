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

const Home_H_DT = React.createClass({
  getInitialState(){
    return{

    }
  },
 loadScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://map.qq.com/api/js?v=2.exp&callback=init";
    document.body.appendChild(script);
    var myLatlng = new qq.maps.LatLng(-34.397, 150.644);
    var myOptions = {
      zoom: 8,
      center: myLatlng,
      mapTypeId: qq.maps.MapTypeId.ROADMAP
    }
    var map = new qq.maps.Map(document.getElementById("container"), myOptions);
  },
  componentDidMount(){
    //this.loadScript();
    var map = new qq.maps.Map(this.refs.container, {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(39.916527,116.397128)
    });
  },
  render(){

    return(
      <Container>
        <div ref="container" style={{width: 400, height:400, }}></div>
      </Container>
    )
  }
})
export default Home_H_DT;
