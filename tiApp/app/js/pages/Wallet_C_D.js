import React from 'react';
import Rodal from 'rodal';

import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Icon,
  Field,
  Modal,
  Button
} from 'amazeui-touch';
import {
  Link,Router,Route,
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
          className="card-back"
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

const Wallet_C_D = React.createClass({
	defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

	},
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return{
      cardDiscount:"",
      totalMoney:"",
      saveMoney:"",
      currency:"",
      deadline:"",
      cardPhoto:"",
      cardName:"",
      vid:"",
      cardPrice:"",
      refundPrice:"",
      card_id:"",
	  reduceYHstyle:"",
	  visibleAlert:false

    }
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
		if(this.state.realoadUlr){
			this.context.router.push(this.state.realoadUlr);
		}

	},
  prevPathenameSave(){
	var _this = this;
    window.addEventListener("popstate", function(e) {

			localStorage.setItem("prevPathename",_this.props.location.pathname);

    }, false); 
  },
  loadUserInfo(){
    /*获取url的uid*/
    var _this = this;
    var uid = Tools.GetQueryString("uid");
    console.log(uid);
    localStorage.setItem("uid",uid);
    var url = "/user/"+uid+"/data";

    var lat = localStorage.getItem("userLat") ? localStorage.getItem("userLat"):0;
    var lng = localStorage.getItem("userLng") ? localStorage.getItem("userLng"):0;

    //var mockurl = "http://localhost:3005/home";
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          data: {
            uid:uid,
            userLat:lat,
            userLng:lng
          },        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var appInfo = eval('(' + response + ')');

              localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
              localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
              localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
          },
          fail: function (status) {

            console.log(status);
          }
      });
  },
  getRefundInfo(wallet_card){
    const _this = this;
	var cardType = wallet_card.type;
	var card_id = wallet_card.id;
	if(cardType==0){
		var url = "/user/"+localStorage.getItem("uid")+"/refund_stored_card_price";
	}else{
		var url = "/user/"+localStorage.getItem("uid")+"/refund_vip_card_price";
	}
	Tools.ajax({
		  url: url,              //请求地址
		  type: "POST",                       //请求方式
		  data: { cid: card_id },        //请求参数
		  dataType: "json",
		  success: function (response, xml) {

			var response = eval("("+response+")");
			console.log(response);

				if(response.data.minusCurrency2>0){
					var minusCurrency2Style ='';
				}else{
					var minusCurrency2Style ='none';
				}
				_this.setState({
					refundPrice:response.data.refundPrice,
					favorablePrice:response.data.favorablePrice,
					minusCurrency:response.data.minusCurrency,
					minusCurrency2:response.data.minusCurrency2,
					minusCurrency2Style:minusCurrency2Style

				});
		  },
		  fail: function (status) {
			console.log(status);

		  }
		});  
  },
  componentDidMount(){
    var _this = this;
	_this.prevPathenameSave();
    var wallet_card = _this.props.location.query.item;
    var walletInfo = localStorage.getItem("walletInfo");
    walletInfo = eval("(" +walletInfo+")");
	if(typeof(walletInfo)!='undefined'){
		var totalCurrency = walletInfo.totalCurrency;
		var totalFavorablePrice = walletInfo.totalFavorablePrice;
		var isShare = walletInfo.isShare;

	}else{
		var totalCurrency = 0;
		var totalFavorablePrice = 0;
		var isShare = '';

	}	
    var wallet_card = eval('(' + wallet_card + ')');

	if(wallet_card.type==0){
		var cardType='';
		var cardTypeDiscount='none';
		var reduceYHstyle ="none";
	}else{
		var cardType='none';
		var cardTypeDiscount='';
		var reduceYHstyle ="";


	}
	if(wallet_card.status){
		var refundTit='';

		if(wallet_card.status =='allow_refund'){

			var refundNotice=wallet_card.refundDeadline;
		}else if(wallet_card.status =='not_allow_refund'){
			var refundNotice='不可退卡';
			var refundTit='none';

		}else if(wallet_card.status =='refunded'){
			var refundNotice='已退卡';
		}else if(wallet_card.status =='expired'){
			var refundNotice='已过期';
		}else if(wallet_card.status =='invalid'){
			var refundNotice='已失效';
		}
	
	}else{
		var refundNotice='';
		var refundTit='';

	}
	if(wallet_card.type==0){
		var saveMoneyType ="余额";

	}else{
		var saveMoneyType ="已省";

	}
	
	if(wallet_card.status == 'allow_refund'){
		var refundTypeShow ='';
	}else{
		var refundTypeShow ='none';
	}
	

	_this.setState({
	  about:wallet_card.about,
	  notice:wallet_card.notice,
	  type:wallet_card.type,
	  card_id:wallet_card.id,
	  cardId:wallet_card.cardId,
	  totalMoney:wallet_card.price,
	  totalCurrency:totalCurrency,
	  cardDiscount:(wallet_card.discount * 10).toFixed(1),
	  balance:wallet_card.balance,
	  saveMoneyType:saveMoneyType,
	  refundTypeShow:refundTypeShow,
	  supportCount:wallet_card.supportCount,
	  currency:wallet_card.currency,
	  privilegeCount:wallet_card.privilegeCount,
	  cardPhoto :wallet_card.photo,
	  cardName:wallet_card.name,
	  cardTypeDiscount:cardTypeDiscount,
	  cardType:cardType,
	  vid:wallet_card.vipId,
	  cardPrice:wallet_card.price,
	  refundNotice:refundNotice,
	  refundTit:refundTit,
	  reduceYHstyle:reduceYHstyle
	});

	_this.getRefundInfo(wallet_card);
	
    
  },
  backCardFunc(){
    const _this = this;
	var cardType = _this.state.type;
	var card_id = _this.state.card_id;

	var refundPrice = _this.state.refundPrice;
	var refundTypeShow = _this.state.refundTypeShow;
	if(cardType==0){
		var url = "/user/"+localStorage.getItem("uid")+"/refund_stored_card";
	}else{
		var url = "/user/"+localStorage.getItem("uid")+"/refund_vip_card";
	}
	if(refundTypeShow=='none'){
		 _this.showAlert("此卡状态无法操作退卡");
	}
	if(refundPrice<0){
		 _this.showAlert("可退金额必须大于等于0");
	}
    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: { cid: card_id },        //请求参数
          dataType: "json",
          success: function (response, xml) {

            var response = eval("("+response+")");
            var backInfo = "退卡成功";
            var status = response.status;
            var currency = _this.state.currency;
            var refundPrice = _this.state.refundPrice;

            if(response.status == "failure"){
              backInfo = response.error;
            }

            const path = `/Wallet_Card_BackF`
            _this.context.router.push({
                pathname: path,
                query: {
                  status:status,
                  backInfo: backInfo,
                  currency:currency,
                  refundPrice:refundPrice
                }
              }
            );
          },
          fail: function (status) {
            console.log(status);
            var status = eval("("+status+")");

            var backInfo = status.error;
            console.log(backInfo);
            const path = `/Wallet_Card_BackF`
            _this.context.router.push({
              pathname: path,
              query: { backInfo: backInfo}
              }
            );
          }
      });
  },

  render(){
    // let page = this.props.params.cardInfo;
    //console.log(this.props.location.query);
    var cardBack = {
      backgroundSize: "cover !important",
      background:"url("+this.state.cardPhoto+")",
      height: "224px",
      width: "100%"
      // width: "90%",
      // right: "0px",
      // left: "0px",
      // margin: "30px auto",
      // backgroundRepeat:"no-repeat"
    };
    return(
      <View>
        <Container scrollable>
		  <div className="card-box-wallet card-d-title" style={{display:''}}>
			<div className="club-card-body-wallet card-d-title-dis" style={cardBack}>
			<div className="club-discount-wallet"><span className="bigTxt" style={{display:this.state.cardTypeDiscount}}>{this.state.cardDiscount}折卡 · </span><span className="smallTxt" style={{display:this.state.cardTypeDiscount}}>售价￥{this.state.cardPrice}</span><span className="bigTxt" style={{display:this.state.cardType}}>储值 · </span><span className="smallTxt" style={{display:this.state.cardType}}>{this.state.cardPrice}元</span></div>
			<div className="club-name-wallet">{this.state.cardName}</div>
			</div>
		  </div>
          <div className="card-d-body" style={{display:""}}>
            <div className="Wallet_C_D_Border"></div>

            <div className="CardList" style={{display:this.state.refundTit}}>
                <span className="data-before">无理由退卡</span>
                <span className="data-after">{this.state.refundNotice}</span>
            </div>
				{
			/*
           <div className="Wallet_C_D_Border"></div>
            <div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"sstsm"}}}>
              <span className="data-before">随时退</span>
              <span className="data-after">详情</span>
              </Link>
            </div>*/
			}

            <div className="Wallet_C_D_Border"></div>
			<div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
                <span className="data-before">赠抵用金</span>
                <span className="data-after">{this.state.currency}元</span>
              </Link>
            </div>
			<div className="Wallet_C_D_Border"></div>
            <div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"hyksm",pathValue:JSON.stringify(this.state.about)}}}>
                <span className="data-before">本卡特权</span>
                <span className="data-after">{this.state.privilegeCount}项</span>
              </Link>
            </div>
 
            <div className="Wallet_C_D_Border"></div>
            <div className="CardList">
            <Link to={{pathname:"Wallet_SupportHotel",query:{vid:this.state.cardId,type:this.state.type}}}>
              <span className="data-before">适用门店</span>
              <span className="data-after">{this.state.supportCount}家</span>
            </Link>
            </div>
 
            <div className="Wallet_C_D_Border"></div>
            <div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"ykxz",pathValue:JSON.stringify(this.state.notice)}}}>
              <span className="data-before">用卡须知</span>
              <span className="data-after">查看</span>
            </Link>
            </div>


            <div className="Wallet_C_D_Border"></div>
          </div>
          <div className="CardList">
			<div className="storeBottomTool">
                <span className="saveMoney" style={{color:"#474747"}}>{this.state.saveMoneyType} ¥{this.state.balance}</span>
              <div className="buyBtn" style={{display:this.state.refundTypeShow}}><span className="" style={{marginTop:"18px"}}>
            <SortCollection
                        title="退卡"
                        modalProps={{
                          role: 'actions',
						  className:'CardRefundShadow'
                        }}
                      >
                        <div className="modal-actions-group CardRefundShadow">
                          <List>
                            <List.Item className="modal-actions-header reduce-detail">退卡说明</List.Item>
							<div className="reduceOutBox">
							<div className="reduceYH" style={{display:this.state.reduceYHstyle}}>
                                <span>扣除已省</span><span className="card-data-after">￥{this.state.favorablePrice}</span>
                              </div>
                              <div className="reduceDYJ">
                                <span>扣除已赠抵用金</span><span className="card-data-after">{this.state.minusCurrency}元</span>
                              </div>
                              <div className="reduceJSDYJ" style={{display:this.state.minusCurrency2Style}}>
                                <span>仅剩余抵用金{this.state.totalCurrency}元，需补扣￥{this.state.minusCurrency2}</span>
                              </div>
							  </div>
                              <div className="border_back"></div>
                              <div className="giveBack">
                                <span>返还</span><span className="card-data-after">￥{this.state.refundPrice}</span>
                              </div>
                              <div className="btn-cancel-card" onClick={this.backCardFunc}>确认退卡</div>
                          </List>
                        </div>
            </SortCollection>
            </span></div></div>
   
            

          </div>


			<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
				<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
			</Rodal>
        </Container>
      </View>

    )
  }
})

export default Wallet_C_D;
