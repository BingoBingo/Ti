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
      totalMoney:"如何使用",
      vipCardCount:"",
      share:false,
      shareInfo:"",
      cardlist:[],
      normalCards:[]
    })
  },
  componentDidMount(){
    var walletInfo = localStorage.getItem("walletInfo");
    walletInfo = eval("(" +walletInfo+")");
    var totalMoney = walletInfo.totalMoney;
    if(totalMoney == 0){
      totalMoney = "如何使用";
    }else{
      totalMoney = totalMoney + "元";
    }
    var vipCardCount = walletInfo.vipCardCount;
    var share = walletInfo.share;
    var shareInfo=""
    if(share){
      shareInfo = "邀请好友各得5元"
    }else{
      shareInfo = "送好友5元抵用金"
    }
    this.setState({
      totalMoney :totalMoney,
      vipCardCount:vipCardCount,
      share:share,
      shareInfo:shareInfo
    })

    var uid = Tools.GetQueryString("uid");
    var url = "/user/"+uid+"/cards";
    const _this = this;
    Tools.ajax({
          url: url,
          type: "GET",
          dataType: "json",
          success: function (response, xml) {

              var cardlist = eval('(' + response + ')');
              console.log("---------------");
              console.log(cardlist);
              //_this.state.hotelInfo = searchResult.data.items;
              //cardlist.length = 0;
              if(cardlist.length == 0){
                _this.setState({
                  totalMoney:"如何使用"
                })
              }
              _this.setState({
                cardlist:cardlist.data.items
              })

              const wallet_card = JSON.stringify(cardlist);
              localStorage.setItem("wallet_card",wallet_card);

              //var cardlist = this.state.cardlist;
              var noCard = {
                background: "url("+no_card+") no-repeat",
                backgroundSize:"100% 100%"
              };
              var normalCards = [];
              var cardlist = cardlist.data.items;
              if(cardlist !== "" && cardlist.length > 0){
                  cardlist.map((item, index) => {
                    var cardStyle = {
                      background: "url("+item.photo+") no-repeat",
                      backgroundSize:"100% 100%"
                    };

                    var discount =  item.discount ? (item.discount*10).toFixed(1):"" ;
                    var saveMoney = item.saveMoney ? item.saveMoney:"0";
                    var showOrNot = "";
                    item.status == "normal" ? showOrNot="" : showOrNot="none";

                    var deadline = item.deadline;
                    var dateCreated = item.dateCreated;

                    var endtime_ms = Date.parse(new Date(deadline.replace(/-/g, "/")));
                    var begintime_ms = Date.parse(new Date(dateCreated.replace(/-/g, "/")));

                    var times = endtime_ms -begintime_ms;

                    var days;
                    if(times <= 0){
                      days = 0;
                    }else{
                      days = Math.floor(times/(24*3600*1000))
                    }
                    if(item.status == "normal"){
                      normalCards.push(
                        <Link to={{pathname:"/Wallet_C_D",query:{item:item.cardId}}}  key={item.cardId}>
                          <div className="card-box-wallet" style={{display:showOrNot}}>
                            <div className="club-card-body-wallet" style={cardStyle}>
                            <div className="club-discount-wallet">{discount}<span style={{fontSize:"24px"}}>折卡·</span><span style={{color:"#474747",marginRight:"8px",fontSize:"26px"}}>已省</span><span style={{color:"#474747",fontSize:"26px"}}>￥{saveMoney}</span></div>
                            <div className="club-name-wallet">{item.cardName}·剩余{days}天</div>
                            </div>
                          </div>
                        </Link>
                      )
                    }
                  });
            }
            console.log("+++");
            console.log(normalCards);

            if(normalCards.length == 0){
              normalCards.push(
                <div className="card-box-wallet" style={{marginTop:"70px"}} key="no-card">
                  <div style={{marginLeft:"22px",color:"#616161",fontFamily:"PingFangSC-Regular,sans-serif",fontSize:"24px",marginBottom:"12px"}}>如何获得可退会员卡<span fontSize={{fontSize:"26px"}}>？</span></div>
                  <div className="club-card-body-wallet" style={noCard}>
                  </div>
                </div>
              )
            }

            _this.setState({
              normalCards:normalCards
            })

          },
          fail: function (status) {
            console.log(status);
          }
      });
  },
  renderCardList(){
      var cardlist = this.state.cardlist;
      var noCard = {
        background: "url("+no_card+") no-repeat",
        backgroundSize:"100% 100%"
      };
      if(cardlist !== "" && cardlist.length > 0){
          return cardlist.map((item, index) => {
            var cardStyle = {
              background: "url("+item.photo+") no-repeat",
              backgroundSize:"100% 100%"
            };
            console.log(cardStyle);
            var discount =  item.discount ? (item.discount*10).toFixed(1):"" ;
            var saveMoney = item.saveMoney ? item.saveMoney:"0";
            var showOrNot = "";
            item.status == "normal" ? showOrNot="" : showOrNot="none";

            var deadline = item.deadline;
            var dateCreated = item.dateCreated;

            var endtime_ms = Date.parse(new Date(deadline.replace(/-/g, "/")));
            var begintime_ms = Date.parse(new Date(dateCreated.replace(/-/g, "/")));

            var times = endtime_ms -begintime_ms;

            var days;
            if(times <= 0){
              days = 0;
            }else{
              days = Math.floor(times/(24*3600*1000))
            }
            return (
              <Link to={{pathname:"/Wallet_C_D",query:{item:item.cardId}}}  key={item.cardId}>
                <div className="card-box-wallet" style={{display:showOrNot}}>
                  <div className="club-card-body-wallet" style={cardStyle}>
                  <div className="club-discount-wallet">{discount}<span style={{fontSize:"24px"}}>折卡·</span><span style={{color:"#474747",marginRight:"8px",fontSize:"26px"}}>已省</span><span style={{color:"#474747",fontSize:"26px"}}>￥{saveMoney}</span></div>
                  <div className="club-name-wallet">{item.cardName}·剩余{days}天</div>
                  </div>
                </div>
              </Link>
            );
          });
    }else{
      return (
          <div className="card-box-wallet" style={{marginTop:"70px"}}>
            <div style={{marginLeft:"22px",color:"#616161",fontFamily:"PingFangSC-Regular,sans-serif",fontSize:"28px",marginBottom:"12px"}}>如何获得可退会员卡？</div>
            <div className="club-card-body-wallet" style={noCard}>
            </div>
          </div>
      );
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


    return (
      <View>
        <Container scrollable>

            <div className="wallet-info">
              <div className="wallet-dis" style={{marginBottom:"43px"}}>
                <span className="personName">我的钱包</span>
              </div>
            </div>

            <div style={wallet_wddyj}>
            <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
              <div className="wddyj_title">我的抵用金</div>
              <div className="wddyj_count">{this.state.totalMoney}</div>
            </Link>
            </div>
            <div className="getFiveRMB">
            <Link to={{pathname:"Wallet_Share"}} style={{color:"#ff5161"}}>
              <div style={giftPic}></div><span style={{display:"inline-block"}}>领取5元</span>
            </Link>
            </div>

            {/* {this.renderCardList()} */}
            {this.state.normalCards}
          {/* <div className="me-top-short"></div>
          <div className="rank-exp">
            <Link to={{pathname:"Wallet_SaveMoney"}}>
              <span className="wallet-left">我的抵用金</span>
              <span className="wallet-right">{this.state.totalMoney}元</span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          <div className="rank-exp">
            <Link to={{pathname:"Wallet_Share"}}>
            <span className="wallet-left">邀请好友 各得5元</span>
            <span className="wallet-right"><Icon name="share"></Icon></span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          <div className="rank-exp">
            <Link to={{pathname:"Wallet_CardList"}}>
            <span className="wallet-left">我的会员卡</span>
            <span className="wallet-right"><Icon name="mycard"></Icon></span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          <div className="rank-exp">
            <Link to={{pathname:"Wallet_tradeList"}}>
            <span className="wallet-left">交易记录</span>
            <span className="wallet-right"><Icon name="changelist"></Icon></span>
            </Link>
          </div>

          <div className="cf"></div>
          <div className="wallet-line"></div>
          <HelpCard
                title="Popup Modal"
                modalProps={{
                  role: 'popup',
                  title: '帮助中心',
                }}
              >
              <h3>什么是低用金?</h3>
              <Card>
                低用金就是让你花最少的钱，享受最好的服务。
              </Card>
          </HelpCard> */}

        </Container>
      </View>
    );
  }
});

export default Wallet;
