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
      totalMoney:"",
      vipCardCount:"",
      share:false,
      shareInfo:"",
    })
  },
  componentDidMount(){
    var walletInfo = localStorage.getItem("walletInfo");
    walletInfo = eval("(" +walletInfo+")");
    var totalMoney = walletInfo.totalMoney;
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
  },

  render() {

    var headStyle = {
      backgroundImage: "url("+this.state.headPic+")",
      backgroundSize:"cover",
      backgroundColor:"#fff"
    };

    return (
      <View>
        <Container scrollable>
          <div className="wallet-header" style={{display:"none"}}>
            <div className="wallet-title">我的钱包</div>
            <div className="wallet-kytitle">可用低用金</div>
            <div className="wallet-kymoney">¥{this.state.totalMoney}</div>
            <div className="wallet-sxmoney" style={{display:"none"}}>本月将失效低用金100</div>
          </div>
          <List style={{display:"none"}}>
            <List.Item className="shareMoney"
              media={<Icon name="share"></Icon>}
              after="戳我"
              title={this.state.shareInfo}
              href="#Wallet_Share"
            />

            <List.Item
              media={<Icon name="itemlist"></Icon>}
              title="抵用金明细"
              href="#Wallet_SaveMoney"
            />
            <List.Item
              media={<Icon name="mycard"></Icon>}
              title="我的会员卡"
              href="#Wallet_CardList"
            />
            <List.Item
              media={<Icon name="changelist"></Icon>}
              title="交易记录"
              href="#Wallet_tradeList"
            />
          </List>


            <div className="wallet-info">
              <div className="wallet-dis">
                <span className="personName">我的钱包</span>
              </div>
              {/* <div className="personhead">
                <div className="head-wallet" style={headStyle}>
                </div>
              </div> */}
            </div>

          <div className="me-top-short"></div>
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
          </HelpCard>

        </Container>
      </View>
    );
  }
});

export default Wallet;
