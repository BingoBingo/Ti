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
    this.callWX();
    //console.log(this.props.searchKeyWord.keyword);
    return({
      // keyword :this.props.searchKeyWord,
      hotelInfo:[],
      searchCount:"0",
      wxInfo:{}
    })
  },

  callWX(){
    //const mockUrl = "http://localhost:3005/searchResult"
    const urlJS = "/wechat/jssign";
    //const currentUrl = window.location.href;
    const currentUrl = "http://taihuiyuan.com/index.html?uid=086d1f45-19b7-43e9-84db-2f3d2915523c";

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
              //_this.state.hotelInfo = searchResult.data.items;

              _this.setState({
                wxInfo:wxInfo
              })

              alert(JSON.stringify(wxInfo));
              wx.config(wxInfo);
              wx.ready(function(){
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        var speed = res.speed; // 速度，以米/每秒计
                        var accuracy = res.accuracy; // 位置精度
                        alert(latitude);
                        alert(longitude);
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
    //console.log(this.props.searchKeyWord.keyword);
    //return false;
    //const mockUrl = "http://localhost:3005/searchResult"

    const keyword = localStorage.getItem("keyword");
    console.log(keyword);
    const uid = localStorage.getItem("uid");
    const url = "/hotels/filter";
    const _this = this;
    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: { keyword: keyword, uid: uid },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              console.log(keyword);
              console.log(uid);
              var searchResult = eval('(' + response + ')');
              console.log(searchResult);
              //_this.state.hotelInfo = searchResult.data.items;
              _this.setState({
                hotelInfo:searchResult.data.items,
                searchCount:searchResult.data.total
              })
          },
          fail: function (status) {
            console.log(status);
          }
      });

  },
  renderItems() {

    const _this = this;
    var hotelInfo = _this.state.hotelInfo;
    if(hotelInfo !== "" && hotelInfo.length > 0){
        return hotelInfo.map((item, index) => {

          var id = item.id ? item.id:"";
          var photoPath = item.photo.path ? item.photo.path:"";
          var photoName = item.photo.name ? item.photo.name:"";
          var place =  item.place ? item.place:"";
          var name =  item.name ? item.name:"";
          var price =  item.price ? item.price:"" ;
          var distance =  item.distance ? item.distance:"" ;
          var hotel_tags =  item.tags ? item.tags:"" ;
          var tags = "";
          var photo = photoPath+"/"+photoName;
          for(var value of hotel_tags){
            tags += "·" + value;
          }
          var display =  item.display ? item.display:"" ;
          var like =  item.like ? item.like:"" ;
          var discount =  item.discount ? item.discount:"" ;
          console.log(photo);
          const header = (
          <Card.Child cover={photo}>
          </Card.Child>
          );
          return (
            <Link to="/Home_H_D" key={index}>
              <Card header={header}  className="hotel-card">
                <div className="hotel-detail">
                  <div className="hotel-price-info">
                    <div className="hotel-price">￥{price}</div>
                    <div className="hotel-discout">{discount}折</div>
                    <div className="cf"></div>
                  </div>
                  <div className="hotel-name">{item.name}{tags}</div>
                  <div className="hotel-place">{item.place}</div>
                </div>
              </Card>
              </Link>
          );
        });
      }
    },
  render(){
    return(
      <Container scrollable>
        <Group noPadded>
        <div className="home-title">搜索到{this.state.searchCount}个结果</div>
        {this.renderItems()}
        <div className="earth-sort">地图 ｜ 排序</div>
        </Group>
      </Container>
    )
  }
})

export default SearchResult;
