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

const Wallet_SupportHotel = React.createClass({

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
      showDot:"none"
    }
    this.setState({
      tabBarVisable:"none"
    })
  },
  componentDidMount(){
    var _this = this;
    const vid = this.props.location.query.vid;

    var url = "/vip/"+vid+"/support";
    var hid = this.props.location.query.hid;
    console.log(url);
//http://dev.taihuiyuan.com/api/vip/6281ef1b-7ef7-11e6-9a85-bc5ff4cacf90/support?v=07401596253221006
    Tools.ajax({
          url: url,
          type: "GET",
          data: {},
          dataType: "json",
          success: function (data, xml) {
              var hotelDetail = eval('(' + data + ')');
              _this.setState({
                rooms: hotelDetail.data.items,
              });
              console.log(hotelDetail.data.items);
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
          photo = item.photo.path + "/" + item.photo.name;

          return (
              <div  className="room-list" key={i}>
                <div className="col-HotelImg"><div className="room-img"><img src={photo} style={{width:"135px",height:"93px"}}/></div></div>
                <div style={{marginLeft:"135px"}}>
                  <div className="col-Hoteltype"><div className="room-type">{item.name}</div><div className="room-dis">{item.city} {item.county}</div></div>
                  {/* <div className="col-roomPrice"><div className="room-price">¥{item.price}</div></div> */}
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

    return (
      <View>

        <Container scrollable>
          <div style={{margin:"25px 25px 0"}}>
            {this.renderRoomList()}
          </div>
        </Container>

      </View>

    );
  }
});

export default Wallet_SupportHotel;
