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
  Icon
} from 'amazeui-touch';
import {
  Link
} from 'react-router';


import Tools from '../util/tools';


const StoreList = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },
  getInitialState(){
    let userLng = localStorage.getItem("userLng") ? localStorage.getItem("userLng") : "0" ;
    let userLat = localStorage.getItem("userLat") ? localStorage.getItem("userLat") :"0";
	let latLngTimeStr = localStorage.getItem("latLngTime") ? localStorage.getItem("latLngTime") :0;
    return({
      shopInfo:[],
      searchCount:"0",
      wxInfo:{},
      lat:userLat,
      lng:userLng,
      o:0,
      f:0,
      t:1,
	  page:1,
	  size:10,
	  distance:50,
	  offset:0,
	  listTotal:0,
      category:'',
      cityId:'null',
      storeList:"",
      categoryList:"",
	  cityList:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:"",
	  visible: true,
      topicExtended:[false,false],
	  maskShowExtended:false,
	  latLngFailureTime:1,//坐标失效分钟
	  latLngTime:latLngTimeStr

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
						_this.loadStoreLngLatList();
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
  loadStoreLngLatList(){
	  var _this = this;
	  const uid = localStorage.getItem("uid");
	  var keyword = '';
	  var locations = localStorage.getItem("cityId");
	  var category = localStorage.getItem("catCode");
	  var distance = _this.state.distance?_this.state.distance:50;
	  var offset = _this.state.offset?_this.state.offset:0;
	  var page = _this.state.page?_this.state.page:1;
	  var size = _this.state.size?_this.state.size:10;
	  var o = _this.state.o?_this.state.o:0;
	  var f = _this.state.f?_this.state.f:0;
	  var t = _this.state.t?_this.state.t:1;
	  var lat = _this.state.lat?_this.state.lat:0;
	  var lng = _this.state.lng?_this.state.lng:0;
	  var lat = locations=='nearby'?lat:0;
	  var lng = locations=='nearby'?lng:0;
	  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
		var locations = '';
	  }

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
			  userLng:lng,
			  location:locations

			},        //请求参数
			dataType: "json",
			success: function (response, xml) {

				var appInfo = eval('(' + response + ')');
				_this.setState({
				  storeList:appInfo.data.items,
				  listTotal:appInfo.data.total,
				  size:size,
				  visible:false
				});
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
		return '全部';
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

		return(<ul className="cleafix"><li ><Link to={{pathname:"CategoryList/",query:{}}} key={0}><span className="txt" id="catName">全部</span><i className="line"></i></Link></li>
		<li ><Link to={{pathname:"CityList/",query:{}}} key={1}><span className="txt" id="cityName">附近</span><i className="line"></i></Link></li>
		<li onClick={this.showSortBox.bind(this,0)}  className={topicCls}><span className="txt">排序</span><i className="line"></i>
			<ul className="sortSelList sortSelList2">
			<li onClick={this.sortOrderState.bind(this,0,f,0)} className={activeT0}><span className="txt">距离</span></li>
			<li onClick={this.sortOrderState.bind(this,0,f,2)} className={activeT1}><span className="txt">价格</span></li>
			<li onClick={this.sortOrderState.bind(this,1,f,2)} className={activeT2}><span className="txt desc">价格</span></li>
			<li onClick={this.sortOrderState.bind(this,0,f,1)} className={activeT3}><span className="txt desc">折扣</span></li>
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
 saveScrollPage(){
 
	var scrollTop = document.getElementById('LoadIndexScroll').scrollTop;
	var page = this.state.page?this.state.page:1;
	localStorage.setItem("scrollTopStore",scrollTop);
	localStorage.setItem("scrollTopPageStore",page);
    var storeList = this.state.storeList;
	if(typeof(storeList) != 'undefined' && storeList !== ""){//By HeMuYu_Ray
		if(storeList !== "" && storeList.length > 0){
			sessionStorage.setItem("shopInfoStore", JSON.stringify(storeList));

		}
	}
 },
  renderStoreList(){
    var storeList = this.state.storeList;

	if(typeof(storeList) != 'undefined' && storeList !== ""){//By HeMuYu_Ray

		if(storeList !== "" && storeList.length > 0){

			return storeList.map((item, index) => {
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
			  var businesses = item.businesses ? item.businesses:"";
			  var categoryCode = item.categoryCode ? item.categoryCode:"";
			  var categoryCode = categoryCode.substr(0,2);
				
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
		}else{
			return (<div className="notFindInfo"><div className="NotImg">没有找到符合的商家</div></div>);
	
		}
	}else{
		return (<div className="notFindInfo"><div className="NotImg">没有找到符合的商家</div></div>);
	
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
  var locations = _this.state.cityId?_this.state.cityId:'';
  var category = this.state.category?this.state.category:'';
  var distance = this.state.distance?this.state.distance:50;
  var offset = this.state.offset?this.state.offset:0;
  var page = this.state.page?this.state.page:1;
  var size = this.state.size?this.state.size:10;
  var lat = this.state.lat?this.state.lat:0;
  var lng = this.state.lng?this.state.lng:0;
  var lat = locations=='nearby'?lat:0;
  var lng = locations=='nearby'?lng:0;
  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
	var locations = '';
  }

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
          userLng:lng,
		  location:locations
        },        //请求参数
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              storeList:appInfo.data.items,
			  listTotal:appInfo.data.total,
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
  /*获取url的uid*/
  var _this = this;
  const uid = localStorage.getItem("uid");
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

hideMask(){

this.setState({
  topicExtended:[false,false],
  maskShowExtended:false

});


},
getCategorys(){
	/*获取url的uid*/
	var _this = this;
	const uid = localStorage.getItem("uid");
	var categoryOld = this.state.category?this.state.category:'';
	var category =  localStorage.getItem("catCode");

	if( categoryOld == category && category!= ''){
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
                  category:category,
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
},
getCitys(){
	/*获取url的uid*/
	var _this = this;
	const uid = localStorage.getItem("uid");
	var cityIdOld = this.state.cityId?this.state.cityId:'';
	var city_id =  localStorage.getItem("cityId");
    if(city_id=='nearby'){
		city_id='';
	}
	if(cityIdOld ==city_id && city_id!= '' && localStorage.getItem("cityName") != ''){
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
			      cityId:city_id,
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
},
 sortOrderScroll(e){
	/*获取url的uid*/
	var _this = this;
    var visible = _this.state.visible;
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
	  const uid = localStorage.getItem("uid");
	  var keyword = '';
	  var listTotal = _this.state.listTotal?_this.state.listTotal:10;
	  var size = _this.state.size?_this.state.size:10;
	  var page = _this.state.page?_this.state.page:1;
	  page = page +1;
	  if((page*size-size)>=listTotal){
		_this.setState({
		  visible:false
		});	
		return;
	  }

	  var locations = _this.state.cityId?_this.state.cityId:'';
	  var category = _this.state.category?_this.state.category:'';
	  var distance = _this.state.distance?_this.state.distance:50;
	  var offset = _this.state.offset?_this.state.offset:0;

	  var o = _this.state.o?_this.state.o:0;
	  var f = _this.state.f?_this.state.f:0;
	  var t = _this.state.t?_this.state.t:1;
	  var lat = locations=='nearby'?_this.state.lat:0;
	  var lng = locations=='nearby'?_this.state.lng:0;
	  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
		var locations = '';
	  }

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
			  userLng:lng,
			  location:locations
			},        //请求参数
			dataType: "json",
			success: function (response, xml) {

				var appInfo = eval('(' + response + ')');
				var oldStoreList = _this.state.storeList;
				var storeList  = appInfo.data.items;
			    var newStoreList = oldStoreList.concat(storeList);

				_this.setState({
				  storeList:newStoreList,
				  listTotal:appInfo.data.total,
				  size:size,
				  visible:false
				  

				});
			},
			fail: function (status) {

			  console.log(status);
			}
		});
		
	} 
	
},

componentDidMount() {

  /*获取url的uid*/
  var _this = this;

	var scrollTop = localStorage.getItem("scrollTopStore")?localStorage.getItem("scrollTopStore"):0;
	var scrollTopPage = localStorage.getItem("scrollTopPageStore")?localStorage.getItem("scrollTopPageStore"):1;
	var prevPathename = localStorage.getItem("prevPathename");

  if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D' || prevPathename=='/CityList/' || prevPathename=='/CityList' || prevPathename=='/CategoryList/' || prevPathename=='/CategoryList') && scrollTopPage>1){
				
	var shopInfoStore = sessionStorage.getItem("shopInfoStore")?sessionStorage.getItem("shopInfoStore"):'';
	shopInfoStore = eval("(" +shopInfoStore+")");

	if(shopInfoStore){
		_this.setState({
		  storeList:shopInfoStore,
		  page:scrollTopPage,
		  visible:false
		});

		setTimeout(function(){
			document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
			localStorage.removeItem("prevPathename");
			localStorage.removeItem("scrollTopStore");
			localStorage.removeItem("scrollTopPageStore");
			sessionStorage.clear();
		},1);

	}
  }else{

	  sessionStorage.clear();
	  const uid = localStorage.getItem("uid");
	  var keyword = '';
	  var category = typeof(_this.props.location.query.category)!='undefined'?_this.props.location.query.category:localStorage.getItem("catCode");
	  localStorage.setItem("catCode",category);
	  var distance = _this.state.distance?_this.state.distance:50;
	  var offset = _this.state.offset?_this.state.offset:0;
	  var page = _this.state.page?_this.state.page:1;
	  var size = _this.state.size?_this.state.size:1;
	  var o = _this.state.o?_this.state.o:0;
	  var f = _this.state.f?_this.state.f:0;
	  var t = _this.state.t?_this.state.t:1;
	  var locations = typeof(_this.props.location.query.city_id)!='undefined'?_this.props.location.query.city_id:localStorage.getItem("cityId");
	  if(locations==''){
		var locations= 'nearby';
	  }
	  localStorage.setItem("cityId",locations);
	  if(locations=='null' || locations==null || typeof(locations) ==null){
			var path = `/CityList/`
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
		  if(locations=='null' || locations==null || typeof(locations) ==null || locations=='nearby'){
			var locations = '';
		  }
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
				  userLng:lng,
				  location:locations

				},        //请求参数
				dataType: "json",
				success: function (response, xml) {

					var appInfo = eval('(' + response + ')');

					_this.setState({
					  storeList:appInfo.data.items,
					  listTotal:appInfo.data.total,
					  size:size,
					  visible:false
					});

					if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D' || prevPathename=='/CityList/' || prevPathename=='/CityList' || prevPathename=='/CategoryList/' || prevPathename=='/CategoryList')){

						document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
						localStorage.removeItem("prevPathename");
						localStorage.removeItem("scrollTopStore");
						localStorage.removeItem("scrollTopPageStore");
					}
				},
				fail: function (status) {

				  console.log(status);
				}
			});
		}
  }
	_this.getCategorys();
	_this.getCitys();
	
},

  render() {
    var lat = this.state.userLat;
    var lng = this.state.userLng;
    var uid = localStorage.getItem("uid");
  
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
	if(this.state.maskShowExtended){

      return (
        <View>
		<div className="storeListSort">
				{this.renderSortList()}
		</div>
          <Container >

			<div className="storeListBody">

				<div className="storeListContent">
					<div className="card-loader" style={loaderDis}><Loader rounded/></div>

					{this.renderStoreList()}
				</div>

			</div>
			<div className={maskShow} onClick={this.hideMask}></div>
          </Container>
        </View>
      );
	}else{
      return (
        <View>
		<div className="storeListSort">
				{this.renderSortList()}
		</div>
          <Container scrollable onScroll={this.sortOrderScroll}  id="LoadIndexScroll">
			<div className="storeListBody">
			

				<div className="storeListContent">

					{this.renderStoreList()}

					<div className="card-loader" style={loaderDis}><Loader rounded/></div>

				</div>
			</div>
			<div className={maskShow} onClick={this.hideMask}></div>
          </Container>
        </View>
      );	
	}
  }
});

export default StoreList;
