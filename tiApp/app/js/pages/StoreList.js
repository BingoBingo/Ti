import '../../style/cate.scss'
import React from 'react';

import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Loader,
  Icon,
  Field,
  Button
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';


const StoreList = React.createClass({

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
      o:0,
      f:0,
      t:1,
      storeList:"",
      categoryList:"",
	  cityList:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:"",
	  visible: true,
      topicExtended:[false,false],
	  maskShowExtended:false

    })
  },

  renderGetCityName(cid){
    var cityList = this.state.cityList;
	if(typeof(cityList) != 'undefined' && cityList !== ""){//By HeMuYu_Ray
		if(cityList !== "" && cityList.length > 0){
			for(var i=0;i<cityList.length;i++){
				if(cityList[i].id==cid){
					return cityList[i].name;
				}
			}
		}
		return '附近';
	}
  },
	renderGetCateName(cid){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			for(var i=0;i<categoryList.length;i++){
				if(categoryList[i].code==cid){
					return categoryList[i].name;
				}
			}
		}
		return '全部';
	}
  },
  renderSortList(){
		var topicCls = "";
		if(this.state.topicExtended[0]){
			var topicCls =" active";
		}
		var topicCls2 = "";
		if(this.state.topicExtended[1]){
			var topicCls2 =" active";
		}
		var category = this.props.location.query.category?this.props.location.query.category:'';
		var city_id = this.props.location.query.city_id?this.props.location.query.city_id:'';

		var o = this.state.o?this.state.o:0;
		var f = this.state.f?this.state.f:0;
		var t = this.state.t?this.state.t:1;
		var activeT0='';
		if(t==0){
			activeT0 +=' active';
		}
		var activeT1='';
		if(t==2 && o==0){
			activeT1 +=' active';
		}
		var activeT2='';
		if(t==2 && o==1){
			activeT2 +=' active';
		}
		var activeT3='';
		if(t==1){
			activeT3 +=' active';
		}
		var activeF0='';
		if(f==0){
			activeF0 +=' active';
		}
		var activeF1='';
		if(f==1){
			activeF1 +=' active';
		}
		var activeF2='';
		if(f==2){
			activeF2 +=' active';
		}
		return(<ul className="cleafix"><li ><Link to={{pathname:"CategoryList/",query:{category:category,city_id:city_id,o:o,t:t,f:f}}} key={0}><span className="txt" id="catName">全部</span><i className="line"></i></Link></li>
		<li ><Link to={{pathname:"CityList/",query:{category:category,city_id:city_id,o:o,t:t,f:f}}} key={1}><span className="txt" id="cityName">附近</span><i className="line"></i></Link></li>
		<li onClick={this.showSortBox.bind(this,0)}  className={topicCls}><span className="txt">排序</span><i className="line"></i>
			<ul className="sortSelList sortSelList2">
			<li onClick={this.sortOrderState.bind(this,0,f,0)} className={activeT0}><span className="txt">距离</span></li>
			<li onClick={this.sortOrderState.bind(this,0,f,2)} className={activeT1}><span className="txt">价格</span></li>
			<li onClick={this.sortOrderState.bind(this,1,f,2)} className={activeT2}><span className="txt desc">价格</span></li>
			<li onClick={this.sortOrderState.bind(this,1,f,1)} className={activeT3}><span className="txt desc">折扣</span></li>
			</ul>				
		</li>
		<li onClick={this.showSortBox.bind(this,1)}  className={topicCls2}><span className="txt">筛选</span><i className="line"></i>
			<ul className="sortSelList">
			<li onClick={this.sortOrderState.bind(this,o,0,t)} className={activeF0}><span className="txt">全部</span></li>
			<li onClick={this.sortOrderState.bind(this,o,1,t)} className={activeF1}><span className="txt">已开通会员</span></li>
			<li onClick={this.sortOrderState.bind(this,o,2,t)} className={activeF2}><span className="txt">可用抵用金</span></li>
			</ul>
		</li></ul>); 
  },
  renderStoreList(){
    var storeList = this.state.storeList;

	if(typeof(storeList) != 'undefined' && storeList !== ""){//By HeMuYu_Ray

		if(storeList !== "" && storeList.length > 0){

			return storeList.map((item, index) => {
			  var name = item.name ? item.name:"";
			  var id = item.id ? item.id:"";
			  var price = item.price ? item.price:"0";
			  var photo = item.photo ? item.photo:"";
			  var path = photo.path ? photo.path:"";
			  var path_name = photo.name ? photo.name:"";
			  var pic_name = path+'/'+path_name;
			  var backgroundImage = "url("+pic_name+")";
			  var pic_style ={backgroundImage:backgroundImage};
			  var discountInfo = item.discountInfo ? item.discountInfo:"";
			  var discountMark = discountInfo.mark ? discountInfo.mark:"低佣金";
			  var discountPrice = discountInfo.price ? discountInfo.price:"0";
			  var tags = item.tags ? item.tags:"";
			  var categoryName = item.categoryName ? item.categoryName:"";
	
			  return (
				<Link to={{pathname:"Home_H_D/",query:{hid:id}}} key={index}>

					<div className="item">
					<div className="image" style={pic_style}></div>
					<div className="title">{name}</div>
					<div className="tags"><span>四惠</span><span>{categoryName}</span></div>
					<div className="prices"><span className="coupon">{discountMark}¥{discountPrice}</span><span className="price">¥{price}/人</span></div>
					</div>
				</Link>

			  );
				  
			  
			  
			});
		}
	}
  },
goBackUp(){
  history.go(-1);
},
sortOrderState(o,f,t,obj){

  /*获取url的uid*/
  var _this = this;
  const uid = localStorage.getItem("uid");
  var keyword = '';
  var city_id = this.props.location.query.city_id?this.props.location.query.city_id:'';
  var category = this.props.location.query.category?this.props.location.query.category:'';
  var page = this.props.location.query.page?this.props.location.query.page:1;
  var offset = this.props.location.query.offset?this.props.location.query.offset:0;
  var size = this.props.location.query.size?this.props.location.query.size:10;
  var distance = this.props.location.query.distance?this.props.location.query.distance:5;
  var lat = this.state.lat?this.state.latf:0;
  var lng = this.state.lng?this.state.lng:0;
  var url = "/shops/filter";
  Tools.ajax({
        url: url,              //请求地址
        type: "POST",                       //请求方式
        data: {
          uid:uid,
          page:page,
          offset:offset,
          size:size,
          keyword:keyword,
          distance:distance,
          category:category,
          o:o,
          t:t,
          f:f,
          userLat:lat,
          userLng:lng
        },        //请求参数
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              storeList:appInfo.data.items,
              visible:false
            });
        },
        fail: function (status) {

          console.log(status);
        }
    });
    this.setState({
      o:o,
      f:f,
      t:t
    });
},
showSortBox(obj,index){
  if(this.state.topicExtended[obj]==false && this.state.topicExtended[obj]==false){
	   var maskShowExtended = true;
  }else{
	   var maskShowExtended = false;
  }
  if(obj==0){
    this.setState({
      topicExtended:[!this.state.topicExtended[0],false],
      maskShowExtended:maskShowExtended

    });
	}else{
    this.setState({
      topicExtended:[false,!this.state.topicExtended[1]],
      maskShowExtended:maskShowExtended

    });	
	
	}

},

componentDidMount() {

  /*获取url的uid*/
  var _this = this;
  const uid = localStorage.getItem("uid");
  var keyword = '';
  var city_id = this.props.location.query.city_id?this.props.location.query.city_id:'';
  var category = this.props.location.query.category?this.props.location.query.category:'';
  var page = this.props.location.query.page?this.props.location.query.page:1;
  var offset = this.props.location.query.offset?this.props.location.query.offset:0;
  var size = this.props.location.query.size?this.props.location.query.size:10;
  var distance = this.props.location.query.distance?this.props.location.query.distance:5;
  var o = this.state.o?this.state.o:0;
  var f = this.state.f?this.state.f:0;
  var t = this.state.t?this.state.t:1;
  var lat = this.state.lat?this.state.latf:0;
  var lng = this.state.lng?this.state.lng:0;
  var url = "/shops/filter";
  Tools.ajax({
        url: url,              //请求地址
        type: "POST",                       //请求方式
        data: {
          uid:uid,
          page:page,
          offset:offset,
          size:size,
          keyword:keyword,
          distance:distance,
          category:category,
          o:o,
          t:t,
          f:f,
          userLat:lat,
          userLng:lng
        },        //请求参数
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              storeList:appInfo.data.items,
              visible:false
            });
        },
        fail: function (status) {

          console.log(status);
        }
    });
	var category_l =  localStorage.getItem("catCode");
	if(category_l == category){
				document.getElementById('catName').innerHTML = localStorage.getItem("catName");
	}else{
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
				});
				document.getElementById('catName').innerHTML = _this.renderGetCateName(category);
				localStorage.setItem("catCode",category);
				localStorage.setItem("catName",_this.renderGetCateName(category));
			},
			fail: function (status) {

			  console.log(status);
			}
		});
	}
	var cityId_l =  localStorage.getItem("cityId");
	if(cityId_l == city_id){
				document.getElementById('cityName').innerHTML = localStorage.getItem("cityName");
	}else{
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
				});
				document.getElementById('cityName').innerHTML = _this.renderGetCityName(city_id);
				localStorage.setItem("cityId",city_id);
				localStorage.setItem("cityName",_this.renderGetCityName(city_id));

			},
			fail: function (status) {

			  console.log(status);
			}
		});
	}
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
	var loaderDis;
	if (this.state.visible) {
	loaderDis = {display: ""};
	}else{
	loaderDis = {display: "none"};
	}
	var maskShow = "m-mask";
	if(this.state.maskShowExtended){
		maskShow +=" m-mask-show";
	}
    var nearBy = "http://taihuiyuan.com/api/map.jsp?uid="+uid+"&userLat="+lat+"&userLng="+lng+"";
    //console.log(nearBy);
	if(this.state.maskShowExtended){

      return (
        <View>
          <Container >

			<div className="storeListBody">
				<div className="storeListSort">
						{this.renderSortList()}
				</div>
				<div className="storeListContent">
					<div className="categoryTitle">全国酒店</div>
					<div className="card-loader" style={loaderDis}><Loader rounded/></div>

					{this.renderStoreList()}
				</div>

			</div>
			<div className={maskShow}></div>
          </Container>
        </View>
      );
	}else{
      return (
        <View>
          <Container scrollable >
			<div className="storeListBody">
				<div className="storeListSort">
						{this.renderSortList()}
				</div>

				<div className="storeListContent">
					<div className="categoryTitle">全国酒店</div>
					<div className="card-loader" style={loaderDis}><Loader rounded/></div>

					{this.renderStoreList()}
				</div>
			</div>
			<div className={maskShow}></div>
          </Container>
        </View>
      );	
	}
  }
});

export default StoreList;
