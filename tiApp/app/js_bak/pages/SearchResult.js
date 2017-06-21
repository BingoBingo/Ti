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

const SearchResult = React.createClass({

  getInitialState(){
    //this.callWX();
    //console.log(this.props.searchKeyWord.keyword);


    return({
      // keyword :this.props.searchKeyWord,
      shopInfo:[],
      searchCount:"0",
      wxInfo:{},
      isShowDiscount:"notShowDiscount",
    })
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
              console.log(response);
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
  componentDidMount(){
    //this.callWX();
    const keyword = localStorage.getItem("keyword");
    const uid = localStorage.getItem("uid");
    const userLng = localStorage.getItem("userLng") ? localStorage.getItem("userLng") : "0" ;
    const userLat = localStorage.getItem("longitude") ? localStorage.getItem("longitude") :"0";

    const url = "/hotels/filter";
    const _this = this;
    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: {
            keyword: keyword,
            uid: uid,
            userLng:userLng,
            userLat:userLat
           },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              var searchResult = eval('(' + response + ')');
              console.log(searchResult);
              //_this.state.shopInfo = searchResult.data.items;
              _this.setState({
                shopInfo:searchResult.data.items,
                searchCount:searchResult.data.total
              })
          },
          fail: function (status) {
            console.log(status);
          }
      });

  },
  historyBack(){
    history.go(-1)
  },
  renderItems() {

    const _this = this;
    var shopInfo = _this.state.shopInfo;
    if(shopInfo !== "" && shopInfo.length > 0){
        return shopInfo.map((item, index) => {

          var id = item.id ? item.id:"";
          var photoPath = item.photo.path ? item.photo.path:"";
          var photoName = item.photo.name ? item.photo.name:"";
          var place =  item.place ? item.place:"";
          var name =  item.name ? item.name:"";
          var price =  item.price ? item.price:0 ;
          price = price.toFixed(2);
          //var district = item.district ? item.district:"";
          var county = item.county ? item.county:"";
          var distance =  item.distance ? item.distance:"" ;
          var hotel_tags =  item.tags ? item.tags:"" ;
          var tags = "";
          var photo = photoPath+"/"+photoName;
          for(var i=0;i< hotel_tags.length;i++){

            tags += "·" + hotel_tags[i];
          }

          var display =  item.display ? item.display:"" ;
          var like =  item.like ? item.like:"" ;
          var discount =  item.discount ? item.discount * 10  :"无折扣" ;
          if(discount == 10){
            discount = "无折扣"
          }else{
            discount = discount + "折"
          }


          const header = (
          <Card.Child cover={photo}>
          </Card.Child>
          );
          return (
            <Link to={{pathname:"Home_H_D/",query:{hid:id}}} key={index}>
              <Card header={header}  className="hotel-card">
                <div className="hotel-detail">
                  <div className="hotel-price-info">
                    <div className="hotel-price">￥{price}</div>
                    <div className="hotel-discout" >{discount}</div>
                    <div className="cf"></div>
                  </div>
                  <div className="hotel-name">{name}{tags}</div>
                  <div className="hotel-place"><Icon name="location" style={{color:"#06A79B"}}></Icon>{county}</div>
                </div>
              </Card>
              </Link>
          );
        });
      }
    },
  render(){
    var searchCount = this.state.searchCount;
    var showInfo=""
    if(searchCount == 0){
      showInfo = "未找到您搜索的结果"
    }else{
      showInfo = "搜索到" + searchCount + "个结果"
    }
    const keyword = localStorage.getItem("keyword");
    return(
      <View>
        <Container scrollable>
          <Group noPadded className="grop-margin">
          <div className="keyword-dis">{keyword}</div><div className="searchIcon" onClick={this.historyBack}><Icon name="search"></Icon></div>
          <div className="search-title">{showInfo}</div>
          {this.renderItems()}

          </Group>
          <div className="earth-sort" style={{display:"none"}}>地图 ｜ 排序</div>
        </Container>
      </View>
    )
  }
})

export default SearchResult;
