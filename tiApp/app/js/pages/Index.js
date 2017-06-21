import React from 'react';
import LazyLoad from 'react-lazyload';
import Rodal from 'rodal';


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
   defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

	},
  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState() {
    console.log("------------------");
	let userLng = localStorage.getItem("userLng") ? localStorage.getItem("userLng") : "0" ;
	let userLat = localStorage.getItem("userLat") ? localStorage.getItem("userLat") :"0";
	let latLngTimeStr = localStorage.getItem("latLngTime") ? localStorage.getItem("latLngTime") :0;
    return {
      histories : "",
      shopInfo : "",
	  cityList:"",
	  categories : "",
      personInfo : "",
      walletInfo : "",
      cityId:'null',
      id: "",
      photo: "",
      place: "",
      name: "",
      price: "0",
      distance: 50,
      tags: "",
      display: "",
      book: "",
      visible: true,
	  visibleAlert:false,
      loaderDis:"",
      lat:userLat,
      lng:userLng,
	  page:1,
	  size:10,
	  listTotal:0,
	  latLngFailureTime:1,//坐标失效分钟
	  latLngTime:latLngTimeStr
    };
  },
	showAlert(contents,url) {
		document.getElementById('showAlertContent').innerHTML = contents;
		this.setState({ visibleAlert: true});
		if(url){
			this.setState({ realoadUlr: url });
		}
	},

	hideAlert() {
		this.setState({ visibleAlert: false });
		document.getElementById('showAlertContent').innerHTML = '';
		if(this.state.realoadUlr && this.state.realoadUlr !='reload'){
			this.context.router.push(this.state.realoadUlr);
		}
		if( this.state.realoadUlr =='reload'){
				window.location.reload();
		}


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
						var dateNow = new Date();
						var newLatLng=_this.changeLatLng(latitude,longitude);
						_this.setState({
                          lat:newLatLng.lat,
                          lng:newLatLng.lng,
                          latLngTime:dateNow.getTime()
                        });
	
                        localStorage.setItem("latLngTime",dateNow.getTime());
                        localStorage.setItem("userLat",newLatLng.lat);
                        localStorage.setItem("userLng",newLatLng.lng);
						_this.loadFirstLngLatList();
                    }
                });
                wx.error(function(res){
                  _this.showAlert(JSON.stringify(res));
                });
              });

          },
          fail: function (status) {
            console.log(status);
          }
      });
  },
  loadFirstLngLatList(){
    /*获取url的uid*/
  var _this = this;
  var uid = Tools.GetQueryString("uid");
  var url = "/user/"+uid+"/data";
  
  var locations = localStorage.getItem("cityId");
  if(locations==''){
	var locations= 'nearby';
  }
  localStorage.setItem("cityId",locations);

  var lat = locations=='nearby'?_this.state.lat:0;
  var lng = locations=='nearby'?_this.state.lng:0;
  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
	var locations = '';
  }
 

  //var mockurl = "http://localhost:3005/home";
  Tools.ajax({
        url: url,              //请求地址
        type: "GET",                       //请求方式
        data: {
          uid:uid,
          userLat:lat,
          userLng:lng,
		  location:locations
        },        //请求参数
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              shopInfo:appInfo.data.shopInfo,
              categories:appInfo.data.categories,
              visible:false
            });
			_this.getListTotal();
            localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
            localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
            localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
        },
        fail: function (status) {

          console.log(status);
        }
    });  
  },
  changeLatLng(gg_lat, gg_lon)    
 {    
        
     var point=new Object();  
     var x_pi = 3.14159265358979324 * 3000.0 / 180.0;  
     var x = new Number(gg_lon);  
     var y = new Number(gg_lat);    
     var z =  Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);    
     var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);    
     var bd_lon = z * Math.cos(theta) + 0.0065;    
     var bd_lat = z * Math.sin(theta) + 0.006;   
     point.lng=bd_lon;  
     point.lat=bd_lat;  

     return point;  
 },  
 saveScrollPage(){
 
	var scrollTop = document.getElementById('LoadIndexScroll').scrollTop;
	var page = this.state.page?this.state.page:1;
	localStorage.setItem("scrollTop",scrollTop);
	localStorage.setItem("scrollTopPage",page);
    var shopInfo = this.state.shopInfo;

	if(typeof(shopInfo) != 'undefined' && shopInfo !== ""){//By HeMuYu_Ray
		if(shopInfo !== "" && shopInfo.length > 0){
			sessionStorage.setItem("shopInfoIndex", JSON.stringify(shopInfo));

		}
	}
 },
  renderItems() {

    var shopInfo = this.state.shopInfo;

	if(typeof(shopInfo) != 'undefined' && shopInfo !== ""){//By HeMuYu_Ray
		if(shopInfo !== "" && shopInfo.length > 0){

			return shopInfo.map((item, index) => {

			  var name = item.name ? item.name:"";

			  var id = item.id ? item.id:"";
			  var price = item.price ? parseFloat(item.price):0;

			  var locations =  localStorage.getItem("cityId");
			  if(locations=='nearby'){
				var distance = item.distance>=0 ? item.distance.toFixed(1)+'km':"";
			  }else{
				var distance = "";
			  }
			  var photo = item.photo ? item.photo:"";
			  var county = item.county ? item.county:"";
			  var path = photo.path ? photo.path:"";
			  var path_name = photo.name ? photo.name:"";
			  var pic_name = path+'/'+path_name;
			  var backgroundImage = "url("+pic_name+")";
			  var pic_style ={backgroundImage:backgroundImage};
			  var discountInfo = item.discountInfo ? item.discountInfo:"";
			  var discountPrice = discountInfo.price ? parseFloat(discountInfo.price):0;
			  var discountMark = discountInfo.mark ? discountInfo.mark:"";
			  var tags = item.tags ? item.tags:"";
			  var categoryName = item.categoryName ? item.categoryName:"";
			  var categoryCode = item.categoryCode ? item.categoryCode:"";
			  var categoryCode = categoryCode.substr(0,2);
			  var businesses = item.businesses ? item.businesses:"";
			  if(businesses !=''){
				var businessesStr = distance+' ';
				for(var i=0;i<businesses.length;i++){
					businessesStr +=' '+businesses[i]['name'];
				}
			  }else{
				var businessesStr = distance+' '+county;
			  }
	
				if (discountMark=='') {
					var couponStyle = {display: "none"};
				}else{
					var couponStyle = {display: ""};
				}
				if(categoryCode=='01'){
					var categoryType = {display: ""};
					var categoryTypeNot = {display: "none"};
				}else{
					var categoryType = {display: "none"};
					var categoryTypeNot = {display: ""};
					var discountPrice = (discountPrice/price) * 10;
					if((discountPrice.toFixed(0)+'.0')==discountPrice.toFixed(1)){
						discountPrice  = discountPrice.toFixed(0);
					}else{
						discountPrice  = discountPrice.toFixed(1);
					}
				}

				return (
				<Link to={{pathname:"Home_H_D/",query:{hid:id}}} key={index} onClick={this.saveScrollPage}>

					<div className="item">
					<div className="image" style={pic_style}></div>
					<div className="title">{name}</div>
					<div className="tags"><span>{businessesStr}</span><span>{categoryName}</span></div>
					<div className="prices"><span className="coupon" style={couponStyle}>{discountMark} <span className="bigTxt">{discountPrice}</span><small style={categoryTypeNot}>折</small><small style={categoryType}>起</small></span><span className="price">¥{price}<small style={categoryTypeNot}>/人</small><small style={categoryType}>起</small></span></div>
					</div>
				</Link>

				);
	
			});
	  }
	}
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
		return '选择城市';
	}
  },
 getCitys(){
	/*获取url的uid*/
	var _this = this;
	var cityIdOld = this.state.cityId?this.state.cityId:'';
	var city_id =  localStorage.getItem("cityId");
	if(city_id=='nearby'){
		city_id='';
	}

	if(cityIdOld == city_id && city_id!='null' && city_id!=null && typeof(city_id)!=null && localStorage.getItem("cityName") != ''){
		document.getElementById('cityName').innerHTML = localStorage.getItem("cityName");
	}else{
    var cityList = this.state.cityList;

	if(typeof(cityList) != 'undefined' && cityList !== ""){//By HeMuYu_Ray
			document.getElementById('cityName').innerHTML = _this.renderGetCityName(city_id);
			  if(city_id==''){
				var city_ids= 'nearby';
				localStorage.setItem("cityId",city_ids);

			  }else{
				localStorage.setItem("cityId",city_id);
			  
			  }
			localStorage.setItem("cityName",_this.renderGetCityName(city_id));

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
					  if(city_id==''){
						var city_ids= 'nearby';
						localStorage.setItem("cityId",city_ids);

					  }else{
						localStorage.setItem("cityId",city_id);
					  
					  }
					localStorage.setItem("cityName",_this.renderGetCityName(city_id));

				},
				fail: function (status) {

				  console.log(status);
				}
			});
		} 
	}
  },
 renderCateItems() {

    var categories = this.state.categories;
	if(typeof(categories) != 'undefined' && categories !== ""){//By HeMuYu_Ray
		if(categories !== "" && categories.length > 0){
			var k=0;
			return categories.map((item, index) => {
			
			  var id = item.id ? item.id:"";
			  var name =  item.name ? item.name:"";
			  var pid =  item.pid ? item.pid:"";
			  var code = item.code ? item.code:"";
			  if(pid=='' && k<4){
				  k++;
				  return (
					<li key={index}>
						<Link to={{pathname:"StoreList/",query:{category:code}}} key={index}>
						<span className="img"></span>
						<span className="txt">{name}</span>
						</Link>
					</li>
			
	
				  );
			  }
			});
	  }
	}
},

GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
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
 LoadIndexScroll(e){

	/*获取url的uid*/
	var _this = this;
    var visible = this.state.visible;
	if(visible){
		return;
	}

    var clientHeight = e.target.clientHeight; //可视区域高度
    var scrollTop  = e.target.scrollTop;  //滚动条滚动高度
    var scrollHeight = e.target.scrollHeight; //滚动内容高度

	if((clientHeight+scrollTop+150)>=(scrollHeight)){
		this.setState({
		  visible:true
		});
	  
		this.getCitys();

	  /*获取url的uid*/

	  var uid =  localStorage.getItem("uid");
	  var url = "/shops/index";
	  var locations =  localStorage.getItem("cityId");

	  var lat = locations=='nearby'?this.state.lat:0;
	  var lng = locations=='nearby'?this.state.lng:0;
	  var page = this.state.page?this.state.page:1;
	  page = page +1;
	  var listTotal = this.state.listTotal?this.state.listTotal:10;
	  var size = this.state.size?this.state.size:10;
	  var distance = this.state.distance?this.state.distance:50;
	  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
		var locations = '';
	  }
	  if((page*size-size)>=listTotal){
		this.setState({
		  visible:false
		});	
		return;
	  }
	  //var mockurl = "http://localhost:3005/home";
	  Tools.ajax({
			url: url,              //请求地址
			type: "GET",                       //请求方式
			data: {
			  uid:uid,
			  page:page,
			  size:size,
			  userLat:lat,
			  userLng:lng,
			  location:locations,
			  distance:distance
			},        //请求参数
			dataType: "json",
			success: function (response, xml) {

				var appInfo = eval('(' + response + ')');
				var oldShopItems = _this.state.shopInfo;
				var shopItems  = appInfo.data.shopItems.items;
			    var newShopItems = oldShopItems.concat(shopItems);

				_this.setState({
				  shopInfo:newShopItems,
				  listTotal:appInfo.data.shopItems.total,
				  size:size,
				  page:page,
				  visible:false
				});
			},
			fail: function (status) {

			  console.log(status);
			}
		});

	} 
	
},
getListTotal(){
	  var _this = this;

	  var uid =  localStorage.getItem("uid");
	  var url = "/shops/index";
	  var locations =  localStorage.getItem("cityId");

	  var lat = locations=='nearby'?_this.state.lat:0;
	  var lng = locations=='nearby'?_this.state.lng:0;
	  var page = _this.state.page?_this.state.page:1;
	  var size = _this.state.size?_this.state.size:10;
	  var distance = _this.state.distance?_this.state.distance:50;
	  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
		var locations = '';
	  }
	  Tools.ajax({
			url: url,              //请求地址
			type: "GET",                       //请求方式
			data: {
			  uid:uid,
			  page:page,
			  size:size,
			  userLat:lat,
			  userLng:lng,
			  location:locations,
			  distance:distance
			},        //请求参数
			dataType: "json",
			success: function (response, xml) {
			    var appInfo = eval('(' + response + ')');
				_this.setState({
				  listTotal:appInfo.data.shopItems.total,
				  visible:false
				});
			},
			fail: function (status) {

			  console.log(status);
			}
		});
},
componentDidMount() {


  /*获取url的uid*/
  var _this = this;
  var uid = Tools.GetQueryString("uid");
  localStorage.setItem("uid",uid);
  
	var prevPathename = localStorage.getItem("prevPathename");
	var scrollTop = localStorage.getItem("scrollTop")?localStorage.getItem("scrollTop"):0;
	var scrollTopPage = localStorage.getItem("scrollTopPage")?localStorage.getItem("scrollTopPage"):1;

  if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D' || prevPathename=='/CityList/' || prevPathename=='/CityList' || prevPathename=='/CategoryList/' || prevPathename=='/CategoryList') && scrollTopPage>1){
				
	var shopInfoIndex = sessionStorage.getItem("shopInfoIndex")?sessionStorage.getItem("shopInfoIndex"):'';
	shopInfoIndex = eval("(" +shopInfoIndex+")");

	if(shopInfoIndex){
		_this.setState({
		  shopInfo:shopInfoIndex,
		  page:scrollTopPage,
		  visible:false
		});
		setTimeout(function(){
			document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
			localStorage.removeItem("prevPathename");
			localStorage.removeItem("scrollTop");
			localStorage.removeItem("scrollTopPage");
			sessionStorage.clear();
		},1);
	}
  }else{
	  sessionStorage.clear();
	  var url = "/user/"+uid+"/data";
	  var locations = typeof(_this.props.location.query.city_id)!='undefined'?_this.props.location.query.city_id:(typeof(localStorage.getItem("cityId"))!='undefined' && localStorage.getItem("cityId")!='null'? localStorage.getItem("cityId") :'null');
	  if(locations==''){
		var locations= 'nearby';
	  }
	  localStorage.setItem("cityId",locations);

	  if(locations=='null' || locations==null || typeof(locations) ==null){
			var path = `/CityList/?isIndex=1`
			_this.context.router.push(path);		
	  }
	  var lat = locations=='nearby'?_this.state.lat:0;
	  var lng = locations=='nearby'?_this.state.lng:0;
	  var latLngFailureTime = _this.state.latLngFailureTime?_this.state.latLngFailureTime:0;
	  var latLngTime = _this.state.latLngTime?_this.state.latLngTime:0;
	  var dateNow = new Date();
	  var timeNow =dateNow.getTime();
	  var differenceMin = Math.abs((timeNow-latLngTime)/1000/60);

	  if(locations =='nearby' && (lng==0 || lat==0 || differenceMin>latLngFailureTime || latLngTime<=0)){
			_this.callWX();
	  }else{

		  if(locations=='null' || locations==null || typeof(locations) ==null || locations == 'nearby'){
			var locations = '';
		  }
			 
		  //var mockurl = "http://localhost:3005/home";
		  Tools.ajax({
				url: url,              //请求地址
				type: "GET",                       //请求方式
				data: {
				  uid:uid,
				  userLat:lat,
				  userLng:lng,
				  location:locations
				},        //请求参数
				dataType: "json",
				success: function (response, xml) {

					var appInfo = eval('(' + response + ')');

					_this.setState({
					  shopInfo:appInfo.data.shopInfo,
					  categories:appInfo.data.categories,
					  visible:false
					});
					_this.getListTotal();
						  
					if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D' || prevPathename=='/CityList/' || prevPathename=='/CityList' || prevPathename=='/CategoryList/' || prevPathename=='/CategoryList')){

						document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
						localStorage.removeItem("prevPathename");
						localStorage.removeItem("scrollTop");
						localStorage.removeItem("scrollTopPage");
					}
					localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
					localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
					localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
				},
				fail: function (status) {

				  console.log(status);
				}
			});
		}
	}
  _this.getCitys();
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
      <Container scrollable onScroll={this.LoadIndexScroll} id="LoadIndexScroll">
        <div className="home-search cleafix">
			<Link to={{pathname:"CityList/",query:{isIndex:1}}} key={0}><div className="selectCitys"><font id="cityName">选择城市</font><span className="icon"></span></div></Link>
			<div className="searchBox">
			<form onSubmit={this.handerSubmit}>
			<input type="text" id="searchIndexPlace" placeholder="美食,酒店,娱乐" className="searchIndexPlace"/>
			</form>
			</div>
		</div>
		<div className="home-category">
			<ul className="cleafix">
				{this.renderCateItems()}
			<li>
				<Link to={{pathname:"CategoryList/",query:{}}} key={0}>
				<span className="img"></span>
				<span className="txt">更多</span>
				</Link>
			</li>
			</ul>
		</div>
		<div className="storeListBody storeListBodyIndex">
			<div className="storeListContent">
				<div className="categoryTitle">今日推荐</div>

				{this.renderItems()}
				<div className="card-loader" style={loaderDis}><Loader rounded/></div>

			</div>

		</div>
		<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
			<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
		</Rodal>
      </Container>
    </View>
  );
}
})

export default Index;
/*首页*/
