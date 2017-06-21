import React from 'react';
import Rodal from 'rodal';
import {
  View,
  Container,
  Group,
  Grid,
  Col,
  Modal,
  Field,
  List,
  Icon,
  Card,
  Accordion,
  Slider
} from 'amazeui-touch';
import Tools from '../util/tools';
import nopic from "../../i/no-pic.jpg"
import share from '../../i/share.jpg';
import click from '../../i/click.png';
import arrow_right_top from '../../i/arrow-right-top.png';
import {
  Link,Router,Route,
} from 'react-router';

const Home_H_D = React.createClass({
   defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

	},
  getInitialState(){

    return{
      id: "",
      hotelName: "",
      address: "",
      detail: "",
      photos: [],
      rooms: [],
      products:[],
      cardInfo:[],
      province: "",
      city: "",
      county: "",
      discountInfo:[],
      hotelDiscount:"",
      discountShow:"",
      hotelLat:"",
      hotelLon:"",
      countInfo:"",
      likeIcon:"none",
      dislikeIcon:"",
      share:false,
      shareInfo:"",
      shareLink:"",
      isShow:"none",
      showAll:"none",
      showOther:"none",
      showDot:"none",
      discountInfo_mark:"",
      discountInfo_info:"",
      color:"",
	  visibleAlert:false

    }
    this.setState({
      tabBarVisable:"none"
    })
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
  removeColl(){
    var _this = this;
    var hid = this.props.location.query.hid;
    var _this = this;
    var url = "/user/"+Tools.GetQueryString("uid")+"/favorite/cancel"
    Tools.ajax({
          //url: "http://123.56.20.50/hotel-union-api/user/086d1f45-19b7-43e9-84db-2f3d2915523c/favorites",
          url:url,
          type: "POST",
          data: { sid: hid},
          dataType: "json",
          success: function (response, xml) {
              var response = eval('(' + response + ')');
              if(response.status == "success"){
                _this.setState({
                  dislikeIcon:"",
                  likeIcon:"none"
                })
              }else{
                _this.showAlert("操作失败，请确保网络正常~");
              }
          },
          fail: function (status) {
            _this.showAlert("操作失败，请确保网络正常~",'reload');
            console.log(status);
          }
      });
  },
  addCollection(){

     var _this = this;
     var hid = this.props.location.query.hid;
     var url = "/user/"+  Tools.GetQueryString("uid") + "/favorite";
     Tools.ajax({
           url: url,
           type: "POST",
           data: { sid: hid },
           dataType: "json",
           success: function (response, xml) {

               var hotelDetail = eval('(' + response + ')');
               if(hotelDetail.status == "success"){
                 _this.setState({
                   dislikeIcon:"none",
                   likeIcon:""
                 })

               }else{
                 var error = hotelDetail.error;
                 _this.showAlert("收藏失败:" + error);

               }
           },
           fail: function (response) {
             _this.showAlert("收藏失败~")
             console.log(response);
           }
       });
  },
  prevPathenameSave(){
	var _this = this;
    window.addEventListener("popstate", function(e) {

			localStorage.setItem("prevPathename",_this.props.location.pathname);

    }, false); 
  },
  componentDidMount(){

    var _this = this;
	_this.prevPathenameSave();
    var hid = this.props.location.query.hid;
    var uid = Tools.GetQueryString("uid");
    var url = "/shop/"+ hid;

    Tools.ajax({
          url: url,
          type: "GET",
          data: { uid: uid},
          dataType: "json",
          success: function (data, xml) {
              var hotelDetail = eval('(' + data + ')');
              var color = "#00a698";
     

              _this.setState({
                hotelName: hotelDetail.data.name,
                detail: hotelDetail.data.detail,
                like: hotelDetail.data.like,
                photos: hotelDetail.data.photos,
                rooms: hotelDetail.data.rooms,
                products: hotelDetail.data.products,
                province: hotelDetail.data.province,
                city: hotelDetail.data.city,
                county: hotelDetail.data.county,
                address: hotelDetail.data.address,
                discountInfo: hotelDetail.data.discountInfo,
                hotelDiscount:hotelDetail.data.hotelDiscount*10,
                discountShow:hotelDetail.data.shopVipDiscount == "1" ? "none" : "",
                hotelLon:hotelDetail.data.longitude,
                hotelLat:hotelDetail.data.latitude,
                color:color
              });

              /*是否收藏*/
              var likeOrNot = hotelDetail.data.like;
              if(likeOrNot == false){
                _this.setState({
                  dislikeIcon:"",
                  likeIcon:"none"
                })
              }else{
                _this.setState({
                  dislikeIcon:"none",
                  likeIcon:""
                })
              }

              var scrollHeight = hotelDetail.data.detail.length;
              if(scrollHeight >= 50){
                _this.setState({
                  showAll:"",
                  showDot:""
                })
              }
          },
          fail: function (status) {
            console.log(status);
          }
      });
	_this.getCardInfo();

  },
  getCardInfo(){
  
    var _this = this;
    var hid = this.props.location.query.hid;
    var uid = Tools.GetQueryString("uid");
    var url = "/user/"+uid+"/vip_shop/"+ hid;

    Tools.ajax({
          url: url,
          type: "GET",
          data: { },
          dataType: "json",
          success: function (data, xml) {
              var cardInfo = eval('(' + data + ')');
			  if(cardInfo.data){
				  _this.setState({
					cardInfo: cardInfo.data

				  });
			  }


          },
          fail: function (status) {
            console.log(status);
          }
      });  
  
  },
  hideRemark(e){
    document.getElementById("remark").style.display = "none";
  },
  renderHotelPic() {

    const photos = this.state.photos;
      return (
        <div className="h-d-pic">
          <Slider controls={false} interval={3000}>
              {photos.map(function(item, i) {
                var photo = item.path + "/" + item.name;
                return (
                  <Slider.Item
                    key={i}
                  >
                    <img src={photo} />
                    <div className="slider-caption">
                    </div>
                  </Slider.Item>
                );
              })}
          </Slider>
        </div>
      );
  },
  callWX(){
    this.setState({
      isShow:""
    })
    document.getElementById("remark").style.display = "";
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

              var personInfo = localStorage.getItem("personInfo");
              personInfo = eval("(" +personInfo+")");
              var shareLink = personInfo.shareLink;
              var wxInfo = eval('(' + response + ')');
              var shareData = {
                title: '一次认真的分享，一场优惠的狂欢', // 分享标题
                desc: '便捷入住，优惠享不停', // 分享描述
                link: shareLink, // 分享链接
                imgUrl: '', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '',// 如果type是music或video，则要提供数据链接，默认为空
                success: function () { },
                cancel: function () { }
              }
              wxInfo.debug = false;
              wxInfo.jsApiList = ["getLocation","onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"];
              //_this.state.shopInfo = searchResult.data.items;

              _this.setState({
                wxInfo:wxInfo
              })
              wx.config(wxInfo);
              wx.ready(function(){

                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareQQ(shareData);
                wx.onMenuShareWeibo(shareData);
                wx.onMenuShareQZone(shareData);
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
  renderCardInfo(){
    const cardInfo = this.state.cardInfo;
	const discountInfo = this.state.discountInfo;
    if(cardInfo!=''){

		if(discountInfo.type=='vip'){
	
		  
          var discount =  cardInfo.discount ? (cardInfo.discount*10).toFixed(1):"" ;

		  return (
                <Link to={{pathname:"/Wallet_C_D",query:{item:cardInfo.id}}}  key={cardInfo.id}>

				<div className="storeCard">
					<div className="cardType">{discount}折会员</div>
					<div className="cardNotice">已开通</div>
					<div className="rightIcon"></div>

				</div>
				</Link>
	 
		  );
		}
	
	}else{
		  if(discountInfo.type=='point'){
			  return (
					<Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}} key={0}>

					<div className="storeCard">
						<div className="cardType">抵用金</div>
						<div className="cardNotice">本店支持使用抵用金</div>
						<div className="rightIcon"></div>

					</div>
					</Link>
		 
			  );	
		  }
	
	}

  
  },
  renderRoomList(){
    const rooms = this.state.rooms;
    const products = this.state.products;
    if(products!=''){
		return(
		  <div>
			{products.map(function(item, i) {
			  var photo = "";
			  if(item.photos.length == 0){
				  photo = nopic;
			  }else {
				  photo = item.photos[0].path + "/" + item.photos[0].name;
			  }
			  var roomImg = {
					background:"url('"+photo+"')",
					backgroundSize:"cover"
				  };

			  var hid = item.id;
			  var discountInfo = item.discountInfo?item.discountInfo:'';

			  return (
					<div className="items"  key={item.id}>
						<div className="img" style={roomImg}></div>
						<div className="rightBox">
						<div className="title">{item.name}</div>
						<div className="desc">{item.about}</div>
						<div className="prices"><span className="coupon">{discountInfo.mark} ¥{discountInfo.price}</span><span className="price">¥{item.price}</span></div>
						</div>
					</div>
		 
			  );
			})}
		  </div>
		);	
	}	
    if(rooms!=''){
		return(
		  <div>
			{rooms.map(function(item, i) {
			  var photo = "";
			  if(item.photos.length == 0){
				  photo = nopic;
			  }else {
				  photo = item.photos[0].path + "/" + item.photos[0].name;
			  }
			  var roomImg = {
					background:"url('"+photo+"')",
					backgroundSize:"cover"
				  };

			  var hid = item.id;
			  var discountInfo = item.discountInfo?item.discountInfo:'';

			  return (
					<div className="items"  key={item.id}>
						<div className="img" style={roomImg}></div>
						<div className="rightBox">
						<div className="title">{item.name}</div>
						<div className="times">{item.bed}、{item.breakfast}、{item.area}㎡</div>
						<div className="prices"><span className="coupon">{discountInfo.mark} ¥{discountInfo.price}</span><span className="price">¥{item.price}</span></div>
						</div>
					</div>
		 
			  );
			})}
		  </div>
		);
	  }
  },
  showAllDetail(){
    this.setState({
      showAll:"none",
      showOther:"",
      showDot:"none"
    })
  },
goBackUp(){
  history.go(-1);
},
BuyItem(){
	const uid = localStorage.getItem("uid");
    var hid = this.props.location.query.hid;
	Tools.ajax
	var Base64 = new Tools.Base64Cus();  
	var hname = Base64.encode(this.state.hotelName);  
 
	var userType = this.state.discountInfo.userType;
	var hostUrl = window.location.host;
	if(hostUrl == "taihuiyuan.com"){
		var urlPre = "https://taihuiyuan.com/";
	}else{
		var urlPre = "https://dev.taihuiyuan.com/";
	}
	var url=urlPre+"pay/index.html?hid="+hid+"&hname="+hname+"&device=wechat&ut="+userType+"&uid="+uid
	window.location.href=url;

},
  render() {

    const hotelLat = this.state.hotelLat;
    const hotelLng = this.state.hotelLon;
    const uid = localStorage.getItem("uid");
    const hotelLocation = "http://taihuiyuan.com/api/map.jsp?hotelLat="+hotelLat+"&hotelLng="+hotelLng+"&userLat=0&userLng=0&uid="+uid+"";

    var detail = this.state.detail;
    var cardBack = {
      backgroundImage:"url("+share+")",
      backgroundSize:"cover",
      backgroundColor:"#fff",
      height:"100%",
      width: "100%",
      right: "0",
      left: "0",
    };

    var clickPic = {
      background:"url("+click+") no-repeat",
      width: "100px",
      height: "20px",
      float: "right",
      marginTop: "90px",
      backgroundSize: "100% 100%"
    }
    var arrowPic = {
      background: "url("+arrow_right_top+") no-repeat" ,
      width: "54px",
      height: "69px",
      marginRight: "30px",
      marginTop: "10px",
      float: "right",
      backgroundSize: "100% 100%",
    }

    return (
      <View>

        <Container scrollable>
			<div className="storeInfBody">
				<div className="storeImg">
				  <div style={{backgroundColor:"#dedede"}}>
					{this.renderHotelPic()}
				  </div>
				<span className="share" onClick={this.callWX}></span><span className="collect" onClick={this.addCollection} style={{display:this.state.dislikeIcon}}></span><span className="collectOn" onClick={this.removeColl} style={{display:this.state.likeIcon}}></span>
				</div>
				<div className="storeListContent storeInfoInBox cleafix">
					<div className="storeTit">
						<span className="title">{this.state.hotelName}</span>
						<a href={hotelLocation}><span className="location">{this.state.province}{this.state.city}{this.state.county}{this.state.address}</span></a>
					</div>
					<div className="cleafix">
					{this.renderCardInfo()}

					</div>
					<div className="storeRecommend">

						{this.renderRoomList()}
					</div>
					<div className="storeDesc">
						<div className="descTit">门店详情</div>
						<div className="storeDescBox">{detail}</div>
					</div>
					<div className="storeBottomTool">
						<div className="leftIcon" onClick={this.goBackUp}></div>
						<div className="buyBtn" onClick={this.BuyItem}>优惠买单</div>
					</div>
				</div>
			</div>
			<div className="remark" onClick={this.hideRemark} id="remark" style={{display:this.state.isShow}}>
			  <div className="arrowPic" style={arrowPic}></div>
			  <div className="clickPic" style={clickPic}></div>
			</div>
			<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
				<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
			</Rodal>
        </Container>

      </View>

    );
  }
});

export default Home_H_D;
