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
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },

  getInitialState(){
    return{
      cardDiscount:"",
      totalMoney:"",
      saveMoney:"",
      givePoint:"",
      deadline:"",
      cardPhoto:"",
      cardName:"",
      vid:"",
      cardPrice:"",
      giveBack:"",
      card_id:""
    }
  },
  componentDidMount(){
    var _this = this;
    const card_id = _this.props.location.query.item;
    console.log(card_id);
    var wallet_card = localStorage.getItem("wallet_card");
    wallet_card = eval('(' + wallet_card + ')');

    console.log(wallet_card);
    const cardItems = wallet_card.data.items;
    for(var i=0;i< cardItems.length;i++){

      if(cardItems[i].cardId == card_id){

        var giveBack = cardItems[i].price  - cardItems[i].saveMoney;
        if(giveBack < 0){
          giveBack = 0
        }else{
          giveBack = giveBack.toFixed(2);
        }


        _this.setState({
          totalMoney:cardItems[i].price,
          cardDiscount:(cardItems[i].discount * 10).toFixed(1),
          saveMoney:cardItems[i].saveMoney,
          deadline:cardItems[i].deadline.split(" ")[0],
          supportCount:cardItems[i].supportCount,
          givePoint:cardItems[i].givePoint,
          cardPhoto :cardItems[i].photo,
          cardName:cardItems[i].cardName,
          vid:cardItems[i].vipId,
          cardPrice:cardItems[i].price,
          giveBack:giveBack,
          card_id:card_id
        })
      }
    }
  },

  backCardFunc(){
    //alert("退卡失败，请联系服务商~");

    var url = "/user/"+localStorage.getItem("uid")+"/refund_card";
    const _this = this;
    console.log(this.props.location.query.item);
    Tools.ajax({
          url: url,              //请求地址
          type: "POST",                       //请求方式
          data: { cid: _this.props.location.query.item },        //请求参数
          dataType: "json",
          success: function (response, xml) {

            var response = eval("("+response+")");
            var backInfo = "退卡成功";
            var status = response.status;
            var givePoint = _this.state.givePoint;
            var giveBack = _this.state.giveBack;


            if(response.status == "failure"){
              backInfo = response.error;
            }

            const path = `/Wallet_Card_BackF`
            _this.context.router.push({
                pathname: path,
                query: {
                  status:status,
                  backInfo: backInfo,
                  givePoint:givePoint,
                  giveBack:giveBack
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

          <div className="card-d-title" style={{display:""}}>
            <div className="card-d-title-dis" style={cardBack}>
              <div className="card-discount">{this.state.cardDiscount}折</div>
              <div className="card-name"><span className="card-total-name">{this.state.cardName}</span></div>
              <div className="card-money"><span className="card-total-money">{this.state.deadline}</span><span className="card-give-money">售价￥{this.state.cardPrice}</span></div>
            </div>
          </div>
          <div className="card-d-body" style={{display:""}}>
            <div className="Wallet_C_D_Border"></div>

            <div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
                <span className="data-before">赠送抵用金</span>
                <span className="data-after">{this.state.givePoint}元</span>
              </Link>
            </div>

            <div className="Wallet_C_D_Border"></div>
            <div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"sstsm"}}}>
              <span className="data-before">随时退</span>
              <span className="data-after">详情</span>
              </Link>
            </div>

            <div className="Wallet_C_D_Border"></div>
            <div className="CardList">
              <Link to={{pathname:"Dyj_Detail",query:{pathType:"hyksm"}}}>
                <span className="data-before">本卡特权</span>
                <span className="data-after">详情</span>
              </Link>
            </div>

            <div className="Wallet_C_D_Border"></div>
            <div className="CardList">
            <Link to={{pathname:"Wallet_SupportHotel",query:{vid:this.state.vid}}}>
              <span className="data-before">适用门店</span>
              <span className="data-after">{this.state.supportCount}家</span>
            </Link>
            </div>
            <div className="Wallet_C_D_Border"></div>
          </div>
          <div className="CardList">
            {/* <div className="total-save">累计省钱 ¥{this.state.saveMoney}</div> */}

            <span className="data-before">
              <Link to={{pathname:"Wallet_SaveTotalMoney",query:{vid:this.state.card_id}}}>
                <span style={{color:"#474747"}}>累计省钱 ¥{this.state.saveMoney}</span>
              </Link>
            </span>
            <span className="data-after" style={{marginTop:"18px"}}>
            <SortCollection
                        title="退卡&gt;"
                        modalProps={{
                          role: 'actions'
                        }}
                      >
                        <div className="modal-actions-group">
                          <List>
                            <List.Item className="modal-actions-header reduce-detail">退卡详情</List.Item>
                              <div className="reduceDYJ">
                                <span>扣除已赠抵用金</span><span className="card-data-after">{this.state.givePoint}元</span>
                              </div>
                              <div className="reduceYH">
                                <span>扣除已享优惠</span><span className="card-data-after">{this.state.saveMoney}元</span>
                              </div>
                              <div className="border_back"></div>
                              <div className="giveBack">
                                <span>返还</span><span className="card-data-after">{this.state.giveBack}元</span>
                              </div>
                              <div className="btn-cancel-card" onClick={this.backCardFunc}>确认退卡</div>
                          </List>
                        </div>
            </SortCollection>

            </span>

            {/* <Link to={{pathname:"/Wallet_C_Back",query:{item:this.props.location.query.item}}}>
              <div className="card-back" style={{display:"none"}}>退卡 &gt;</div>
            </Link> */}
          </div>



        </Container>
      </View>

    )
  }
})

export default Wallet_C_D;
