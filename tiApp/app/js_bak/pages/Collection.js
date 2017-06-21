import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Loader,
  Button,
  Modal,
  Icon
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';

const SortCollection = React.createClass({


  getInitialState() {
    return {
      isModalOpen: false,
    };
  },

  openModal() {
    this.setState({
      isModalOpen: true,
    })
  },

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  },

  onOpen() {
    console.log('modal open....');
  },

  onClosed() {
    console.log('modal closed....');
  },

  handleAction(data) {
    let role = this.getModalRole();
  },

  getModalRole() {
    return this.props.modalProps.role;
  },

  render() {
    return (
      <div>
        <div
          className="SortCollection"
          onClick={this.openModal}
        >
          {this.props.title}
        </div>
        <Modal
          ref="modal"
          isOpen={this.state.isModalOpen}
          onDismiss={this.closeModal}
          onOpen={this.onOpen}
          onClosed={this.onClosed}
          onAction={this.handleAction}
          {...this.props.modalProps}
        >
          {this.getModalRole() !== 'loading' && this.props.children}
        </Modal>
      </div>
    );
  }
});

const Collection = React.createClass({

  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return({
      favorites : "",
      photo:"",
      province: "",
      city: "",
      district: "",
      tags: "",
      price: "",
      visible: true,
      loaderDis:""
    })
  },

  renderfavo(){
    var _this = this;
    var url = "/user/"+localStorage.getItem("uid")+"/favorites"
    Tools.ajax({
          //url: "http://123.56.20.50/hotel-union-api/user/086d1f45-19b7-43e9-84db-2f3d2915523c/favorites",
          url:url,              //请求地址
          type: "GET",                       //请求方式
          // data: { name: "super", age: 20 },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              var favorites = eval('(' + response + ')')
              console.log(favorites);
              _this.setState({
                favorites:favorites.data.items,
                visible:false
              })
              // localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
              // localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
              // localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
          },
          fail: function (status) {
            console.console.log(status);
          }
      });
  },
  componentDidMount() {
    this.renderfavo();
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
        <Container scrollable>
          <Group noPadded>
          <div className="home-collectionTitle">收藏夹</div>
          <div className="card-loader" style={loaderDis}><Loader rounded/></div>
          {this.renderItems()}
          </Group>
        </Container>
      </View>
    );
  },
    removeColl(e){
      console.log(e.target);
      var hid = e.target.getAttribute("data-id");
      var _this = this;
      var url = "/user/"+localStorage.getItem("uid")+"/favorite/cancel"
      Tools.ajax({
            //url: "http://123.56.20.50/hotel-union-api/user/086d1f45-19b7-43e9-84db-2f3d2915523c/favorites",
            url:url,              //请求地址
            type: "POST",                       //请求方式
            data: { hid: hid},        //请求参数
            dataType: "json",
            success: function (response, xml) {
                var response = eval('(' + response + ')');
                if(response.status == "success"){
                  alert("取消收藏成功~");
                  window.location.reload();
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
    renderItems() {
      var favorites = this.state.favorites;
      console.log("------");
      console.log(favorites);
      if(favorites !== "" && favorites.length > 0){
          return favorites.map((item, index) => {

            var id = item.id ? item.id:"";
            var photoPath = item.photo.path ? item.photo.path:"";
            var photoName = item.photo.name ? item.photo.name:"";
            var place =  item.place ? item.place:"";
            var name =  item.name ? item.name:"";
            var price =  item.price ? item.price:0 ;
            price = price.toFixed(2);
            var distance =  item.distance ? item.distance:"" ;
            var hotel_tags =  item.tags ? item.tags:"" ;
            var tags = "";

            for(var value of hotel_tags){
              tags += "·" + value;
            }
            var photo = photoPath + "/" + photoName;
            var display =  item.display ? item.display:"" ;
            var like =  item.like ? item.like:"" ;
            var discount =  item.discount ? item.discount * 10: "" ;
            //var district = item.district ? item.district:"";
            var county = item.county ? item.county:"";
            const header = (
              <Link to={{pathname:"Home_H_D/",query:{hid:id}}} style={{width:"100%"}}>
                <Card.Child cover={photo}>
                </Card.Child>
              </Link>
            );
            return (

                <Card header={header} key={index} className="hotel-card">
                  <div className="hotel-detail">
                    <div className="hotel-price-info">
                      <div className="hotel-price">￥{price}</div>
                      <div className="hotel-discout">{discount}折</div>
                      <div className="removeCollection">
                        <SortCollection
                                    title="..."
                                    modalProps={{
                                      role: 'actions'
                                    }}
                                  >
                                    <div className="modal-actions-group" style={{textAlign:"center"}}>
                                      <List>
                                        <List.Item className="sort-type" >
                                          <div data-id={id} onClick={this.removeColl} style={{width:"100%"}}>
                                            取消收藏
                                          </div>
                                        </List.Item>
                                      </List>
                                    </div>
                        </SortCollection>
                      </div>
                      <div className="cf"></div>
                    </div>
                    <div className="hotel-name">{item.name}{tags}</div>
                    <div className="hotel-place"><Icon name="location" style={{color:"#06A79B"}}></Icon></div>
                    <div className="countyName">{county}</div>
                  </div>
                </Card>
            );
          });
    }
  }
})
export default Collection;
