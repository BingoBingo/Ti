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



const Me_Rank = React.createClass({

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
      hotelInfo:[],
      searchCount:"0",
      wxInfo:{},
      lat:"",
      lng:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:""
    })
  },

  handerSubmit(event){
    event.preventDefault()
    const keyword = event.target.elements[0].value;
    const path = `/SearchResult`;
    localStorage.setItem("keyword",keyword);
    this.context.router.push({
      pathname: path,
      query: { keyword: keyword
             }
      });
  },

  historySubmit(event){
    event.preventDefault();
    const keyword = event.target.getAttribute("data-value");
    const path = `/SearchResult`;
    localStorage.setItem("keyword",keyword);
    this.context.router.push({
      pathname: path,
      query: { keyword: keyword
             }
      });
  },

  renderHistory(){
      var searchHistory = localStorage.getItem("histories");
      searchHistory = eval("("+searchHistory+")");

      if(searchHistory !== "" && searchHistory.length > 0){
          return searchHistory.map((item, index) => {
            return (
              <div key={index}>
                  <div className="search-top-line"></div>
                  <dt  data-value={item} className="search-dt" onClick={this.historySubmit} >{item}</dt>
              </div>
            );
          });
    }
  },
  componentDidMount(){

    setTimeout( function(){
      try{
        document.getElementById('searchPlace').focus();
      } catch(e){}
    }, 200);
  },
  hiddenLable(){
    var searchPlace = this.refs.searchPlace.value;
    if(searchPlace != ""){
      this.setState({
        hiddenLable:"none"
      })
    }else{
      this.setState({
        hiddenLable:""
      })
    }
  },
  goNearBy(){
    this.callWX();
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

            <form onSubmit={this.handerSubmit}>
              <Group className="searchBody">

                <div className="searchTitle">
                  <div className="borderRight" style={{display:this.state.hiddenLable}}></div>
                  <input type="text" ref="searchPlace" id="searchPlace" onChange={this.hiddenLable} placeholder="您要去哪里" className="searchPlace"/>
                </div>
              </Group>
              <div className="searchBorder"></div>
              {/* <List className="searchInput" style={{display:"none"}}>
                <List.Item
                    nested="input"
                    className="search-list"

                  >
                    <Field
                      label={null}
                      placeholder="您要去哪里"
                      className="search-box"
                    />
                  </List.Item>
              </List> */}
              <dl className="serachDt">
                <dt className="search-dt"><a onClick={this.goNearBy} target="_blank">附近</a></dt>
                {this.renderHistory()}
              </dl>

            </form>

          </Container>
        </View>
      );
  }
})
export default Me_Rank;
