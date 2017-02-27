import React from 'react';
import LazyLoad from 'react-lazyload';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Loader,
  Icon
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';

const Index = React.createClass({

  getInitialState() {
    console.log("------------------");
    console.log(this.props.tabBarVisable);
    console.log(this.props.visible);
    //this.callWX();
    return {
      histories : "",
      hotelInfo : "",
      personInfo : "",
      walletInfo : "",
      id: "",
      photo: "",
      place: "",
      name: "",
      price: "0",
      distance: "0",
      tags: "",
      display: "",
      book: "",
      visible: true,
      loaderDis:"",
      lat:"0",
      lng:"0"
    };
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
              wxInfo.debug = false;
              wxInfo.jsApiList = ["getLocation"];
              //_this.state.hotelInfo = searchResult.data.items;

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

                        //alert(longitude);
                        // var latitude = "39.91333";
                        // var longitude = "116.486885";
                        _this.setState({
                          lat:latitude,
                          lng:longitude
                        })
                        localStorage.setItem("userLat",latitude);
                        localStorage.setItem("userLng",longitude);
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

  renderItems() {

    var hotelInfo = this.state.hotelInfo;
    if(hotelInfo !== "" && hotelInfo.length > 0){

        return hotelInfo.map((item, index) => {

          var id = item.id ? item.id:"";
          var photoPath = item.photo.path ? item.photo.path:"";
          var photoName = item.photo.name ? item.photo.name:"";
          var place =  item.place ? item.place:"";

          var name =  item.name ? item.name:"";
          var price =  item.price ? item.price:0 ;
          price = price.toFixed(2);
          var distance =  item.distance ? item.distance:"0" ;
          var hotel_tags =  item.tags ? item.tags:"" ;
          //var district = item.district ? item.district:"";
          var county = item.county ? item.county:"";
          var tags = "";

          var photo = photoPath+"/"+photoName;

          // for(var value of hotel_tags){
          //   tags += "·" + value;
          // }
          for(var i=0;i< hotel_tags.length;i++){

            tags += " · " + hotel_tags[i];
          }
          var display =  item.display ? item.display:"" ;
          var like =  item.like ? item.like:"" ;
          var discount =  item.discount ? item.discount * 10:0 ;
          discount = discount.toFixed(1);
          var hotelDiscount = item.hotelDiscount ? item.hotelDiscount:"";
          var discountInfo = item.discountInfo ? item.discountInfo:{};
          var discountInfo_type = discountInfo.type;
          var color = "#00a698";
          if(discountInfo_type != "vip"){
            color = "#ff5161"
          }
          var discountInfo_info = discountInfo.info;
          var discountInfo_price = discountInfo.price;
          var discountInfo_mark = discountInfo.mark;
          // var isShowDiscount = "none";
          // if(discount == ""){
          //   isShowDiscount :"none"
          // }else{
          //   isShowDiscount :""
          // }

          const header = (
            <Card.Child cover={photo}>
            </Card.Child>
          );
          return (
            <Link to={{pathname:"Home_H_D/",query:{hid:id}}} key={index}>
              <Card header={header}  className="hotel-card">

                  <div className="hotel-detail">
                    <div className="hotel-price-info">
                      <div className="hotel-discout" style={{display:""}}><span style={{fontSize:"21px",color:color}}>{discountInfo_mark}</span><span style={{color:"#474747",fontSize:"21px",marginRight:"5px",marginLeft:"5px"}}>·</span><span style={{color:color,fontSize:"21px"}}><span style={{fontSize:"20px"}}>￥</span>{discountInfo_price}</span></div>
                      {/* <div className="hotel-price">￥{price}</div> */}

                      <div className="cf"></div>
                    </div>
                    <div className="hotel-name">{name}{tags}</div>
                    <div className="hotel-place"><Icon name="location" style={{color:"#06A79B"}}></Icon></div>
                    <div className="countyName">{county}</div>
                  </div>

              </Card>

            </Link>
          );
        });
  }
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
  var uid = Tools.GetQueryString("uid");
  console.log(uid);
  localStorage.setItem("uid",uid);
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
render() {

  var loaderDis;
  if (this.state.visible) {
    loaderDis = {display: ""};
  }else{
    loaderDis = {display: "none"};
  }
  return (
    <View>
      <Container scrollable>
        <Group noPadded>
        <div className="home-title">为您推荐</div>
        <div className="card-loader" style={loaderDis}><Loader rounded/></div>
        {this.renderItems()}
        </Group>
      </Container>
    </View>
  );
}
})

export default Index;
/*首页*/
