import React from 'react';
import Rodal from 'rodal';
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
	defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

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
	  visibleAlert:false,
      loaderDis:"",
	  page:1,
	  size:10,
	  listTotal:0
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
 saveScrollPage(){
 
	var scrollTop = document.getElementById('LoadIndexScroll').scrollTop;
	var page = this.state.page?this.state.page:1;
	localStorage.setItem("scrollTopCollection",scrollTop);
	
	localStorage.setItem("scrollTopPageCollection",page);
    var favorites = this.state.favorites;

	if(typeof(favorites) != 'undefined' && favorites !== ""){//By HeMuYu_Ray
		if(favorites !== "" && favorites.length > 0){
			sessionStorage.setItem("collectionInfo", JSON.stringify(favorites));


		}
	}
 },

  componentDidMount() {

    var _this = this;
	var prevPathename = localStorage.getItem("prevPathename");
	var scrollTop = localStorage.getItem("scrollTopCollection")?localStorage.getItem("scrollTopCollection"):0;
	var scrollTopPage = localStorage.getItem("scrollTopPageCollection")?localStorage.getItem("scrollTopPageCollection"):1;

  if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D') && scrollTopPage>1){
	var collectionInfo = sessionStorage.getItem("collectionInfo")?sessionStorage.getItem("collectionInfo"):'';
	collectionInfo = eval("(" +collectionInfo+")");
	if(collectionInfo){


		_this.setState({
		  favorites:collectionInfo,
		  page:scrollTopPage,
		  visible:false
		});
		 setTimeout(function(){
			document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
			localStorage.removeItem("prevPathename");
			localStorage.removeItem("scrollTopCollection");
			localStorage.removeItem("scrollTopPageCollection");
			sessionStorage.clear();		 
		 
		 },1);
	}
  }else{
	sessionStorage.clear();
    var url = "/user/"+localStorage.getItem("uid")+"/favorites"
    Tools.ajax({
          //url: "http://123.56.20.50/hotel-union-api/user/086d1f45-19b7-43e9-84db-2f3d2915523c/favorites",
          url:url,              //请求地址
          type: "GET",                       //请求方式
          // data: { name: "super", age: 20 },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              var favorites = eval('(' + response + ')')
              _this.setState({
                favorites:favorites.data.items,
				listTotal:favorites.data.total,
                visible:false
              });

				if((prevPathename=='/Home_H_D/' || prevPathename=='/Home_H_D')){

					document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
					localStorage.removeItem("prevPathename");
					localStorage.removeItem("scrollTopCollection");
					localStorage.removeItem("scrollTopPageCollection");
				}

              // localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
              // localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
              // localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
          },
          fail: function (status) {
            console.console.log(status);
          }
      });
	}
  },
  LoadCollectScroll(e){
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

		var url = "/user/"+localStorage.getItem("uid")+"/favorites"
		var page = this.state.page?this.state.page:1;
		page = page +1;
		var listTotal = this.state.listTotal?this.state.listTotal:10;
		var size = this.state.size?this.state.size:10;

		if((page*size-size)>=listTotal){
			this.setState({
			  visible:false
			});	
			return;
		}

		Tools.ajax({
			  //url: "http://123.56.20.50/hotel-union-api/user/086d1f45-19b7-43e9-84db-2f3d2915523c/favorites",
			  url:url,              //请求地址
			  type: "GET",                       //请求方式
			  data: { page: page },        //请求参数
			  dataType: "json",
			  success: function (response, xml) {
				var favorites = eval('(' + response + ')');

				var oldFavoritesItems = _this.state.favorites;
				var favoritesItems  = favorites.data.items;
				var newFavoritesItems = oldFavoritesItems.concat(favoritesItems);

				  _this.setState({
					favorites:newFavoritesItems,
					listTotal:favorites.data.total,
					  size:size,
					  page:page,
					visible:false
				  });


			  },
			  fail: function (status) {
				console.console.log(status);
			  }
		  });
	}


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
		
        <Container scrollable onScroll={this.LoadCollectScroll} id="LoadIndexScroll" >
          <Group noPadded>
          <div className="home-collectionTitle">收藏夹</div>
          {this.renderItems()}
         
          <div className="card-loader" style={loaderDis}><Loader rounded/></div>

          </Group>
			<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
				<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
			</Rodal>
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
            data: { sid: hid},        //请求参数
            dataType: "json",
            success: function (response, xml) {
                var response = eval('(' + response + ')');
                if(response.status == "success"){
                  //_this.showAlert("取消收藏成功~",'reload');
				  window.location.reload();
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
    renderItems() {
      var favorites = this.state.favorites;
	if(typeof(favorites) != 'undefined' && favorites !== ""){//By HeMuYu_Ray

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
              <Link to={{pathname:"Home_H_D/",query:{hid:id}}} style={{width:"100%"}} onClick={this.saveScrollPage}>
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
  }
})
export default Collection;
