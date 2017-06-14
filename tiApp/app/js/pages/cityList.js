import '../../style/cate.scss'
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



const CityList = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },
  callWX(){
    //const mockUrl = "http://localhost:3005/searchResult"
    const urlJS = "/wechat/jssign";
    var currentUrl = window.location.href;
    currentUrl = window.location.href.split('#')[0];
    const _this = this;
    Tools.ajax({
          url: urlJS,              //请求地址
          type: "POST",                       //请求方式
          data: { url: currentUrl},        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var wxInfo = eval('(' + response + ')');
              wxInfo.debug = "true";
              wxInfo.jsApiList = ["getLocation"];
              //_this.state.shopInfo = searchResult.data.items;

              _this.setState({
                wxInfo:wxInfo
              })

              wx.config(wxInfo);
              wx.ready(function(){
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        var uid = localStorage.getItem("uid");
                        // _this.setState({
                        //   lat:latitude,
                        //   lng:longitude
                        // })
                        window.location.href  = "http://taihuiyuan.com/api/map.jsp?uid="+uid+"&userLat="+latitude+"&userLng="+longitude+"";
                    }
                });
                wx.error(function(res){
                  alert(JSON.stringify(res));
                });
              });

          },
          fail: function (status) {
            console.log(status);
          }
      });
  },

  getInitialState(){
    //this.callWX();
    let userLng = localStorage.getItem("userLng") ? localStorage.getItem("userLng") : "" ;
    let userLat = localStorage.getItem("userLat") ? localStorage.getItem("userLat") :"";
    return({
      shopInfo:[],
      searchCount:"0",
      wxInfo:{},
      lat:"",
      lng:"",
      cityList:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:""
    })
  },

  renderCityList(){
    var cityList = this.state.cityList;
	if(typeof(cityList) != 'undefined' && cityList !== ""){//By HeMuYu_Ray
		if(cityList !== "" && cityList.length > 0){
			var category = this.props.location.query.category?this.props.location.query.category:'';
			var o = this.props.location.query.o?this.props.location.query.o:0;
			var t = this.props.location.query.t?this.props.location.query.t:1;
			var f = this.props.location.query.f?this.props.location.query.f:0;
			return cityList.map((item, index) => {

			  var name = item.name ? item.name:"";
			  var id = item.id ? item.id:"";
			  
			  if(id==''){
			  
				  return (

						<li id={id}><Link to={{pathname:"StoreList/",query:{city_id:id,category:category,o:o,t:t,f:f}}} key={index}><span className="txt">{name}</span><i className="r-icon">推荐</i></Link></li>
				  );

			  }else{
				  return (

						<li id={id}><Link to={{pathname:"StoreList/",query:{city_id:id,category:category,o:o,t:t,f:f}}} key={index}><span className="txt">{name}</span></Link></li>
				  );
			  }
				  			  
			  
			  
			});
		}
	}
  },
goBackUp(){
  history.go(-1);
},


componentDidMount() {

  /*获取url的uid*/
  var _this = this;
  var url = "/shop/locations";
  Tools.ajax({
        url: url,              //请求地址
        type: "GET",                       //请求方式
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              cityList:appInfo.data,
              visible:false
            })
        },
        fail: function (status) {

          console.log(status);
        }
    });
},

  render() {
    var lat = this.state.userLat;
    var lng = this.state.userLng;
    var uid = localStorage.getItem("uid");
    var center = "";
    if(lat == "" || lng == ""){
      center = "CurrentLocation";
    }else {
      center= this.state.lat + "," + this.state.lng;
    }
    var nearBy = "http://taihuiyuan.com/api/map.jsp?uid="+uid+"&userLat="+lat+"&userLng="+lng+"";
    //console.log(nearBy);
      return (
        <View>
          <Container scrollable>

			<div className="cityListBody">
				<div className="cityTitle">选择城市</div>
				<div className="cityInfoList">
					<ul className="cleafix">
						{this.renderCityList()}
					</ul>
				</div>
				<div className="backUpBtn" onClick={this.goBackUp}></div>
			</div>
          </Container>
        </View>
      );
  }
})
export default CityList;
