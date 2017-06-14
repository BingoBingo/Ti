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



const CategoryList = React.createClass({

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
      categoryList:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:""
    })
  },

  renderCheckChildCate(id){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			for(var i=0;i<categoryList.length;i++){
				if(typeof(categoryList[i].pid) != 'undefined'){
					var pid = categoryList[i].pid;
					if(pid != '' && typeof(pid) != 'undefined' && pid != 'undefined'){
						if(pid==id){
							return true;
						}
					}
				}
			}
			return false;
		}
	}
  },
  renderGetCateName(cid){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			for(var i=0;i<categoryList.length;i++){
				if(categoryList[i].id==cid){
					return categoryList[i].name;
				}
			}
			return '全部分类';
		}
	}
  },
 
  renderCategoryList(){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			var cid = this.props.location.query.cid;
			document.getElementById('categoryTitle').innerHTML = this.renderGetCateName(cid);
			var city_id = this.props.location.query.city_id?this.props.location.query.city_id:'';
			var o = this.props.location.query.o?this.props.location.query.o:0;
			var t = this.props.location.query.t?this.props.location.query.t:1;
			var f = this.props.location.query.f?this.props.location.query.f:0;

			return categoryList.map((item, index) => {
			  var cat_name = item.name ? item.name:"";
			  var id = item.id ? item.id:"";
			  var pid = item.pid ? item.pid:"";
			  var code = item.code ? item.code:"";
			  var isChild=true;
			  if(typeof(cid) != 'undefined' && cid !== "" && cid !== "undefined" && typeof(cid) !== null && cid !== 'null'){
	
				  if(pid==cid){
							var isChild=this.renderCheckChildCate(id);
							if(isChild==true){
								  return (

										<li id={id}><Link to={{pathname:"CategoryList/",query:{cid:id,city_id:city_id,o:o,t:t,f:f}}} key={index}><i className="l-icon"></i><span className="txt">{cat_name}</span><i className="r-icon"></i></Link></li>
								  );
							}else{
								  return (

										<li id={id}><Link to={{pathname:"StoreList/",query:{category:code,city_id:city_id,o:o,t:t,f:f}}} key={index}><i className="l-icon"></i><span className="txt">{cat_name}</span><i className="r-icon"></i></Link></li>
								  );
							
							}
				  }else if(cid==id){

									  return (

										<li id={id}><Link to={{pathname:"StoreList/",query:{category:code,city_id:city_id,o:o,t:t,f:f}}} key={index}><i className="l-icon"></i><span className="txt">全部{cat_name}</span><i className="r-icon"></i></Link></li>
								  );			  
				  }
			  }else{
				  if(pid==''){

					  return (

							<li id={id}><Link to={{pathname:"CategoryList/",query:{cid:id,city_id:city_id,o:o,t:t,f:f}}} key={index}><i className="l-icon"></i><span className="txt">{cat_name}</span><i className="r-icon"></i></Link></li>
					  );
				  }			  
			  
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
  var url = "/shop/categories";
  Tools.ajax({
        url: url,              //请求地址
        type: "GET",                       //请求方式
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              categoryList:appInfo.data,
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

			<div className="categoryListBody">
				<div className="categoryTitle" id="categoryTitle">全部分类</div>
				<div className="categoryInfoList">
					<ul className="cleafix">{this.renderCategoryList()}</ul>

				</div>
				<div className="backUpBtn" onClick={this.goBackUp}></div>
			</div>
           


          </Container>
        </View>
      );
  }
})
export default CategoryList;
