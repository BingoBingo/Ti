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
      shopInfo:[],
      searchCount:"0",
	  page:1,
	  size:10,
	  listTotal:0,
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

 LoadSearchScroll(e){
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
	  
	  /*获取url的uid*/

	const keyword = localStorage.getItem("keyword");
	const uid = localStorage.getItem("uid");
	const url = "/shops/filter";
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

	  //var mockurl = "http://localhost:3005/home";
	  Tools.ajax({
			url: url,              //请求地址
			type: "POST",                       //请求方式
			data: {
				keyword: keyword,
				uid: uid,
				userLat:0,
				userLng:0,
				location:'',
				page:page,
				size:size
			},         //请求参数
			dataType: "json",
			success: function (response, xml) {

				var searchResult = eval('(' + response + ')');
				var oldShopInfo = _this.state.shopInfo;
				var shopInfo  = searchResult.data.items;
			    var newShopInfo = oldShopInfo.concat(shopInfo);

				_this.setState({
				  shopInfo:newShopInfo,
				  listTotal:searchResult.data.total,
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
 saveScrollPage(){
 
	var scrollTop = document.getElementById('LoadIndexScroll').scrollTop;
	var page = this.state.page?this.state.page:1;
	localStorage.setItem("scrollTopSearch",scrollTop);
	localStorage.setItem("scrollTopPageSearch",page);
    var shopInfo = this.state.shopInfo;
	if(typeof(shopInfo) != 'undefined' && shopInfo !== ""){//By HeMuYu_Ray
		if(shopInfo !== "" && shopInfo.length > 0){
			sessionStorage.setItem("shopInfoSearch", JSON.stringify(shopInfo));
		}
	}
 },
  componentDidMount(){
    //this.callWX();
	var prevPathename = localStorage.getItem("prevPathename");
	var scrollTop = localStorage.getItem("scrollTopSearch")?localStorage.getItem("scrollTopSearch"):0;
	var scrollTopPage = localStorage.getItem("scrollTopPageSearch")?localStorage.getItem("scrollTopPageSearch"):1;

  if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D') && scrollTopPage>1){
				
	var shopInfoSearch = sessionStorage.getItem("shopInfoSearch")?sessionStorage.getItem("shopInfoSearch"):'';
	shopInfoSearch = eval("(" +shopInfoSearch+")");

	if(shopInfoSearch){
		_this.setState({
		  shopInfo:shopInfoSearch,
		  page:scrollTopPage,
		  visible:false
		});

		setTimeout(function(){
			document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
			localStorage.removeItem("prevPathename");
			localStorage.removeItem("scrollTopSearch");
			localStorage.removeItem("scrollTopPageSearch");
			sessionStorage.clear();
		},1);
	}
  }else{
	sessionStorage.clear();
    const keyword = localStorage.getItem("keyword");
    const uid = localStorage.getItem("uid");

    const url = "/shops/filter";
    const _this = this;
    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: {
            keyword: keyword,
            uid: uid,
            userLng:0,
            userLat:0,
			location:''

           },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              var searchResult = eval('(' + response + ')');
              
              //_this.state.shopInfo = searchResult.data.items;
              _this.setState({
                shopInfo:searchResult.data.items,
                searchCount:searchResult.data.total
              });
				if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D')){

					document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
					localStorage.removeItem("prevPathename");
					localStorage.removeItem("scrollTopSearch");
					localStorage.removeItem("scrollTopPageSearch");
				}

          },
          fail: function (status) {
            console.log(status);
          }
      });
  }

  },
  historyBack(){
    history.go(-1)
  },
  renderItems() {

    const _this = this;
    var shopInfo = _this.state.shopInfo;
	if(typeof(shopInfo) != 'undefined' && shopInfo !== ""){//By HeMuYu_Ray
		if(shopInfo !== "" && shopInfo.length > 0){

			return shopInfo.map((item, index) => {

				  var name = item.name ? item.name:"";
				  var id = item.id ? item.id:"";
				  var price = item.price ? parseFloat(item.price):0;

				  var photo = item.photo ? item.photo:"";
				  var locations =  localStorage.getItem("cityId");
				  if(locations=='nearby'){
					var distance = item.distance>=0 ? item.distance.toFixed(1)+'km':"";
				  }else{
					var distance = "";
				  }
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
		  }
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
        <Container scrollable  onScroll={this.LoadSearchScroll}  id="LoadIndexScroll">
          <Group noPadded className="grop-margin">
          <div className="keyword-dis">{keyword}</div><div className="searchIcon" onClick={this.historyBack}><Icon name="search"></Icon></div>
          <div className="search-title">{showInfo}</div>
			<div className="storeListBody">
				<div className="storeListContent">

					{this.renderItems()}

				</div>

			</div>

          </Group>
          <div className="earth-sort" style={{display:"none"}}>地图 ｜ 排序</div>
        </Container>
      </View>
    )
  }
})

export default SearchResult;
