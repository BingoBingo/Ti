import React from 'react';
import {
  Container,
  Group,
  Button,
  ButtonGroup,
  Modal,
  Field,
  List,
  Icon,
  Card,
  View
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';
import dyj_backnew from '../../i/dyj_backnew.png';
import no_card from '../../i/no_card.jpg';
import gift from '../../i/gift.png';
const HelpCard = React.createClass({
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
      <Container>
        <div className="helpCenter" onClick={this.openModal}><Icon name="help" style={{fontSize:"16px"}}></Icon>帮助中心</div>
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
      </Container>
    );
  }
});



const Wallet = React.createClass({

  getInitialState(){
    return({
      totalCurrency:"0",
      totalFavorablePrice:"",
      isShare:false,
      InvalidCardBtn:false,
      InvalidCardBox:true,
      shareInfo:"",
      cardlist:[],
      normalCards:[],
		listTotal:0,
		page:1,
		size:10
    })
  },
  showInvalidCard(){
    this.setState({
      InvalidCardBtn :true,
      InvalidCardBox :false
    })	  
  },
  LoadCardsScroll(e){
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

	  /*获取url的uid*/

	  var uid =  localStorage.getItem("uid");
	  var page = this.state.page?this.state.page:1;
	  page = page +1;
	  var listTotal = this.state.listTotal?this.state.listTotal:10;
	  var size = this.state.size?this.state.size:10;
	  if((size*page-size)>=listTotal){
		this.setState({
		  visible:false
		});	
		return;
	  }	
		var uid = Tools.GetQueryString("uid");
		var url = "/user/"+uid+"/cards";
		Tools.ajax({
			  url: url,
			  type: "GET",
			  data: { page: page},

			  dataType: "json",
			  success: function (response, xml) {

				  var cardlist = eval('(' + response + ')');
				  //_this.state.shopInfo = searchResult.data.items;
				  //cardlist.length = 0;
				  if(cardlist.length == 0){
					_this.setState({
					  totalCurrency:"如何使用"
					})
				  }
				var oldcardlist = _this.state.cardlist;

				var newCardlist = oldcardlist.concat(cardlist.data.items);
				  _this.setState({
					cardlist:newCardlist,
					  listTotal:cardlist.data.total,
					  size:size,
					  page:page,
					  visible:false
				  })


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
	localStorage.setItem("scrollTopCard",scrollTop);
	localStorage.setItem("scrollTopPageCard",page);
    var cardlist = this.state.cardlist;
	if(typeof(cardlist) != 'undefined' && cardlist !== ""){//By HeMuYu_Ray
		if(cardlist !== "" && cardlist.length > 0){
			sessionStorage.setItem("CardInfo", JSON.stringify(cardlist));
		}
	}
	
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


			var walletInfo = appInfo.data.walletInfo;
			if(typeof(walletInfo)!='undefined'){
				var totalCurrency = walletInfo.totalCurrency;
				var totalFavorablePrice = walletInfo.totalFavorablePrice;
				var isShare = walletInfo.isShare;

			}else{
				var totalCurrency = 0;
				var totalFavorablePrice = 0;
				var isShare = '';

			}

			if(totalCurrency == 0){
			  totalCurrency = "0"+ "元";
			}else{
			  totalCurrency = totalCurrency + "元";
			}
			var shareInfo=""
			if(isShare){
			  shareInfo = " 如何使用"
			}else{
			  shareInfo = " 如何使用"
			}
			_this.setState({
			  totalCurrency :totalCurrency,
			  totalFavorablePrice:totalFavorablePrice,
			  isShare:isShare,
			  shareInfo:shareInfo
			});
          },
          fail: function (status) {

            console.log(status);
          }
      });
  },
  componentDidMount(){
	var prevPathename = localStorage.getItem("prevPathename");
	var scrollTop = localStorage.getItem("scrollTopCard")?localStorage.getItem("scrollTopCard"):0;
	var scrollTopPage = localStorage.getItem("scrollTopPageCard")?localStorage.getItem("scrollTopPageCard"):1;

  if((prevPathename=='/Wallet_C_D/' || prevPathename=='/Wallet_C_D') && scrollTopPage>1){
				
	var CardInfo = sessionStorage.getItem("CardInfo")?sessionStorage.getItem("CardInfo"):'';
	CardInfo = eval("(" +CardInfo+")");

	if(CardInfo){
		this.setState({
		  cardlist:CardInfo,
		  page:scrollTopPage,
		  visible:false
		});

		setTimeout(function(){
			document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
			localStorage.removeItem("prevPathename");
			localStorage.removeItem("scrollTopCard");
			localStorage.removeItem("scrollTopPageCard");
			sessionStorage.clear();
		},1);

	}
 }else{
	sessionStorage.clear();
    this.loadUserInfo();
    var uid = Tools.GetQueryString("uid");
    var url = "/user/"+uid+"/cards";
    const _this = this;
    Tools.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          success: function (response, xml) {

              var cardlist = eval('(' + response + ')');
              //_this.state.shopInfo = searchResult.data.items;
              //cardlist.length = 0;
              if(cardlist.length == 0){
                _this.setState({
                  totalCurrency:"如何使用"
                })
              }
              _this.setState({
                cardlist:cardlist.data.items
              });
			  _this.checkInvalidCardlist();

			if((prevPathename=='/Wallet_C_D/' || prevPathename=='/Wallet_C_D')){

				document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
				localStorage.removeItem("prevPathename");
				localStorage.removeItem("scrollTopCard");
				localStorage.removeItem("scrollTopPageCard");
			}
				
          },
          fail: function (status) {
            console.log(status);
          }
      });
	}
  },
  renderCardList(){
  
	  var cardlist = this.state.cardlist;
		const _this = this;

	  if(cardlist !== "" && cardlist.length > 0){

		  return cardlist.map((item, index) => {
			var cardStyle = {
			  background: "url("+item.photo+") no-repeat",
			  backgroundSize:"100% 100%"
			};

			var discount =  item.discount ? (item.discount*10).toFixed(1):"" ;
			var showOrNot = "";
			(item.status == "refunded" || item.status == "expired"  || item.status == "invalid" ) ? showOrNot="none" : showOrNot="";
			var deadline = item.deadline?item.deadline:'';
			var dateCreated = item.dateCreated?item.dateCreated:'';
			var cardName = item.name?item.name:'';
			var cardPrice = item.price?item.price:0;
			var cardBalance = item.balance?item.balance:0;
			var type = item.type?item.type:'';
			if(type==0){
				var cardType='';
				var cardTypeDiscount='none';
			}else{
				var cardType='none';
				var cardTypeDiscount='';
		
			}


			if(item.status != "refunded" && item.status != "expired" && item.status != "invalid" && ( (type==0 && cardBalance >0) || (type!=0))){
			  return(
				<Link to={{pathname:"/Wallet_C_D",query:{item:JSON.stringify(item)}}}  key={item.id} onClick={this.saveScrollPage}>
				  <div className="card-box-wallet" style={{display:showOrNot}}>
					<div className="club-card-body-wallet" style={cardStyle}>
					<div className="club-discount-wallet"><span className="bigTxt" style={{display:cardTypeDiscount}}>{discount}折卡 · </span><span className="smallTxt" style={{display:cardTypeDiscount}}>{deadline}</span><span className="bigTxt" style={{display:cardType}}>储值余额 · </span><span className="smallTxt" style={{display:cardType}}>{cardBalance}元</span></div>
					<div className="club-name-wallet">{cardName}</div>
					</div>
				  </div>
				</Link>
			  )
			}

		});

	}else{
	
                  
		  var noCard = {
			background: "url("+no_card+") no-repeat",
			backgroundSize:"100% 100%"
		  };

		  return (
			<div className="card-box-wallet" style={{marginTop:"70px"}} key="no-card">
			  <div style={{marginLeft:"22px",color:"#c3c3c3",fontFamily:"PingFangSC-Regular,sans-serif",fontSize:"24px",marginBottom:"12px"}}>没有可用的会员卡<span fontSize={{fontSize:"26px"}}>...</span></div>
			  <div className="club-card-body-wallet" style={noCard}>
			  </div>
			</div>
		  );			  
	}
  },
  checkInvalidCardlist(){
  	  var cardlist = this.state.cardlist;
      const _this = this;
	  var InvalidCard=0;

	  if(cardlist !== "" && cardlist.length > 0){

			for(var i=0;i<cardlist.length;i++){
				if(cardlist[i].status != "allow_refund" && cardlist[i].status != "not_allow_refund"){
						InvalidCard++;
				}
			}

	  }
	if(InvalidCard==0){
		_this.setState({
		  InvalidCardBtn :true
		});
	}else{
		_this.setState({
		  InvalidCardBtn :false
		});	
	}

  },
  renderInvalidCardList(){
  
	  var cardlist = this.state.cardlist;
      const _this = this;

	  if(cardlist !== "" && cardlist.length > 0){

		return cardlist.map((item, index) => {
			var cardStyle = {
			  background: "url("+item.photo+") no-repeat",
			  backgroundSize:"100% 100%"
			};


			var discount =  item.discount ? (item.discount*10).toFixed(1):"" ;
			var showOrValNot = "";
			((item.status != "allow_refund" && item.status != "not_allow_refund") && _this.state.InvalidCardBox ) ? showOrValNot="none" : showOrValNot="";
			
			var deadline = item.deadline?item.deadline:'';
			var dateCreated = item.dateCreated?item.dateCreated:'';
			var cardName = item.name?item.name:'';
			var cardPrice = item.price?item.price:0;
			var cardBalance = item.balance?item.balance:0;
			var type = item.type?item.type:'';
			if(type==0){
				var cardType='';
				var cardTypeDiscount='none';
			}else{
				var cardType='none';
				var cardTypeDiscount='';

			}

			if(item.status != "allow_refund" && item.status != "not_allow_refund"){

			  return(
				<Link to={{pathname:"/Wallet_C_D",query:{item:JSON.stringify(item)}}}  key={item.id} onClick={this.saveScrollPage}>
				  <div className="card-box-wallet" style={{display:showOrValNot}}>
					<div className="club-card-body-wallet" style={cardStyle}>
					<div className="club-discount-wallet"><span className="bigTxt" style={{display:cardTypeDiscount}}>{discount}折卡 · </span><span className="smallTxt" style={{display:cardTypeDiscount}}>{deadline}</span><span className="bigTxt" style={{display:cardType}}>储值余额 · </span><span className="smallTxt" style={{display:cardType}}>{cardBalance}元</span></div>
					<div className="club-name-wallet">{cardName}</div>
					</div>
				  </div>
				</Link>
			  )
			}
		  });
	}
  },
  render() {

    var headStyle = {
      backgroundImage: "url("+this.state.headPic+")",
      backgroundSize:"cover",
      backgroundColor:"#fff"
    };

    var wallet_wddyj ={
      backgroundImage: "url("+dyj_backnew+")",
      backgroundSize:"cover",
      backgroundColor:"#fff",
      backgroundSize: "180px 100px",
      height: "100px",
      width: "182px",
      marginLeft: "15px",
      display: "inline-block",
      float: "left"
    };
    var giftPic = {
      backgroundImage: "url("+gift+")",
      backgroundSize:"cover",
      backgroundColor:"#fff",
      backgroundSize: "18px 18px",
      height: "18px",
      width: "18px",
      marginLeft: "25px",
      float:"left",
      marginRight:"6px",
      marginTop: "4px"
    }


	if(this.state.InvalidCardBtn){
		var InvalidCardBtn = 'none';
	}else{
		var InvalidCardBtn = '';
	}
    return (
      <View>
        <Container scrollable onScroll={this.LoadCardsScroll}  id="LoadIndexScroll">
			<div className="cleafix">
            <div className="wallet-info">
              <div className="wallet-dis" style={{marginBottom:"43px"}}>
                <span className="personName">我的钱包</span>
              </div>
            </div>

            <div style={wallet_wddyj}>
            <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
              <div className="wddyj_title">我的抵用金</div>
              <div className="wddyj_count">{this.state.totalCurrency}</div>
            </Link>
            </div>
            <div className="getFiveRMB">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}} style={{color:"#ff5161"}}>
              <div style={giftPic}></div><span style={{display:"inline-block"}}>如何使用</span>
            </Link>
            </div>
			{this.renderCardList()}
			{this.renderInvalidCardList()}

			</div>
			<div className="totalFavorablePrice">
			<span className="InvalidCardBtn" style={{display:InvalidCardBtn}} onClick={this.showInvalidCard}>查看已失效卡</span>
			<div className="btmBorder"><span>累计已省 ¥{this.state.totalFavorablePrice}</span></div>	
			</div>

        </Container>
      </View>
    );
  }
});

export default Wallet;
