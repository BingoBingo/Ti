import React from 'react';
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

  getInitialState(){

    return{
      id: "",
      hotelName: "",
      address: "",
      detail: "",
      photos: [],
      rooms: [],
      city: "",
      district: "",
      address: "",
      detail:"",
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
      color:""
    }
    this.setState({
      tabBarVisable:"none"
    })
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
          data: { hid: hid},
          dataType: "json",
          success: function (response, xml) {
              var response = eval('(' + response + ')');
              if(response.status == "success"){
                _this.setState({
                  dislikeIcon:"",
                  likeIcon:"none"
                })
              }else{
                alert("操作失败，请确保网络正常~");
              }
          },
          fail: function (status) {
            alert("操作失败，请确保网络正常~");
            window.location.reload();
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
           data: { hid: hid },
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
                 alert("收藏失败:" + error);
                //  _this.setState({
                //    dislikeIcon:"none",
                //    likeIcon:""
                //  })
               }
           },
           fail: function (response) {
             alert("收藏失败~")
             console.log(response);
           }
       });
  },
  componentDidMount(){
    var _this = this;
    //var mockUrl = "http://localhost:3005/Home_H_D";
    //var hid = Tools.GetQueryString("hid");
    var hid = this.props.location.query.hid;
    var uid = Tools.GetQueryString("uid");
    //var url = "/hotel/"+ hid + "?uid=" + uid;
    var url = "/hotel/"+ hid;
    console.log(url);

    Tools.ajax({
          url: url,
          type: "GET",
          data: { uid: uid},
          dataType: "json",
          success: function (data, xml) {
              var hotelDetail = eval('(' + data + ')');
              var countInfo = (1 - hotelDetail.data.hotelDiscount)* 100;
              countInfo = countInfo.toFixed(0) + "%";
              var discountInfo = hotelDetail.data.discountInfo ? hotelDetail.data.discountInfo:{};
              var discountInfo_type = discountInfo.type;
              var color = "#00a698";
              if(discountInfo_type != "vip"){
                color = "#ff5161"
              }
              var discountInfo_info = discountInfo.info;
              var discountInfo_price = discountInfo.price;
              var discountInfo_mark = discountInfo.mark;

              _this.setState({
                hotelName: hotelDetail.data.name,
                address: hotelDetail.data.address,
                detail: hotelDetail.data.detail,
                like: hotelDetail.data.like,
                photos: hotelDetail.data.photos,
                rooms: hotelDetail.data.rooms,
                city: hotelDetail.data.city,
                district: hotelDetail.data.district,
                address: hotelDetail.data.address,
                detail: hotelDetail.data.detail,
                hotelDiscount:hotelDetail.data.hotelDiscount*10,
                discountShow:hotelDetail.data.shopVipDiscount == "1" ? "none" : "",
                hotelLon:hotelDetail.data.longitude,
                hotelLat:hotelDetail.data.latitude,
                countInfo:countInfo,
                discountInfo_mark:discountInfo_mark,
                discountInfo_info:discountInfo_info,
                color:color
              });

              /*是否收藏*/
              var likeOrNot = hotelDetail.data.like;
              console.log(likeOrNot);
              // likeOrNot = true;
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

              console.log(hotelDetail.data.detail.length + "+++");
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
                  alert(JSON.stringify(res));
                });
              });
          },
          fail: function (status) {
            console.log(status);
          }
      });
  },
  renderRoomList(){
    const rooms = this.state.rooms;

    return(
      <div>
        {rooms.map(function(item, i) {
          console.log(item);
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
          return (
              <div  className="room-list" key={i}>
                <div className="col-roomImg"><div className="room-img"><img src={photo} height="30px"/></div></div>
                <div style={{marginLeft:"90px"}}>
                  <div className="col-roomtype"><div className="room-type">{item.name}</div><div className="room-dis">{item.bed}、{item.breakfast}、{item.area}㎡</div></div>
                  <div className="col-roomPrice"><div className="room-price">¥{item.price}</div></div>
                </div>

                <div className="border-line"></div>
              </div>
          );
        })}
      </div>
    )
  },
  showAllDetail(){
    this.setState({
      showAll:"none",
      showOther:"",
      showDot:"none"
    })
  },
  render() {

    const img40 = <img width="48" src="./i/hotel.jpg" />;
    const hotelLat = this.state.hotelLat;
    const hotelLng = this.state.hotelLon;
    const uid = localStorage.getItem("uid");
    const hotelLocation = "http://taihuiyuan.com/api/map.jsp?hotelLat="+hotelLat+"&hotelLng="+hotelLng+"&userLat=0&userLng=0&uid="+uid+"";

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

    const albums = this.state.albums;
    // const isShow = this.state.isShow;
    var detail_0 = this.state.detail.substring(0,50);
    var detail_1 = this.state.detail.substring(50,this.state.detail.length);


    return (
      <View>

        <Container scrollable>

          <div style={{height:"290px",backgroundColor:"#dedede"}}>
            {this.renderHotelPic()}
          </div>


          <div className="hotelOP">
              <div className="likeOrNot" onClick={this.addCollection} style={{display:this.state.dislikeIcon}}><Icon name="dislike"></Icon></div>
              <div className="likeOrNot" onClick={this.removeColl} style={{display:this.state.likeIcon}}><Icon name="like"></Icon></div>
              <div className="shareHotel" onClick={this.callWX}><Icon name="transmit"></Icon></div>
          </div>
          <Group className="h-d-dis">
            <div>
              <div className="hotelName">{this.state.hotelName}</div>
              <div className="dis-info"><div className="hotel-discout-detail" style={{display:this.state.discountShow,backgroundColor:this.state.color}}><span style={{fontSize:"11px"}}>{this.state.discountInfo_mark}</span></div><div className="discount-dis">{this.state.discountInfo_info}</div></div>
            </div>

            <div className="border-line-hotelname" style={{marginTop:"40px"}}></div>
            <Grid wrap="wrap" className="hotel-earth">
              <Col cols={4}><div className="hotel-earth-place">{this.state.city}</div></Col>
              <Col cols={2}><a href={hotelLocation} target="_blank"><div className="ckdt" >查看地图</div></a></Col>
              <Col cols={6} className="district-info">{this.state.district}{this.state.address}</Col>
            </Grid>
            <div className="border-line-place"></div>
            {this.renderRoomList()}
            <div className="dis-title">酒店详情</div>
            <div className="hotel-dis" ref="hotel_dis" id="hotel_dis">
              <span>{detail_0}</span><span style={{display:this.state.showDot}} >...</span><span style={{display:this.state.showOther}}>{detail_1}</span>
            </div>
            <div className="showAll" onClick={this.showAllDetail} style={{display:this.state.showAll}}>显示全部</div>
          </Group>

        </Container>
        <div className="remark" onClick={this.hideRemark} id="remark" style={{display:this.state.isShow}}>
          <div className="arrowPic" style={arrowPic}></div>
          <div className="clickPic" style={clickPic}></div>
        </div>
        <div className="collectHotel" onClick={this.addCollection} style={{display:"none"}}>加入收藏</div>
      </View>

    );
  }
});

export default Home_H_D;
