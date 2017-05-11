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
  Button
} from 'amazeui-touch';
import {Link, Router, Route} from 'react-router';

import Tools from '../util/tools';
import card_bak from '../../i/card-bak.jpg';

const CardDetail_Buy = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    var payReduce = this.props.location.query.payReduce;
    return {
      btnPayNotPut: "btn-pay-input",
      payReduce: payReduce,
      saleCards: [],
      cardDiscount: "",
      cardName: "",
      cardId:"",
      storeId:"",
      cardDeadLine: "",
      cardPrice: "",
      cardGivePoint: "",
      cardTQ: "",
      cardMD: "",
      supportCount: ""
    }
  },
  confirmCZ(){
    const path = `/PayEnd_WithCard/`;
    var payTrue = this.props.location.query.payTrue;
    var cardId = this.props.location.query.cardId;
    localStorage.setItem("isBuyCard","zk");
    this.context.router.push({
      pathname:path,
      query: {
          cardId: cardId,
          cardPrice: this.state.cardPrice,
          cardDiscount: this.state.cardDiscount,
          userPayMoney: payTrue,
          itemPhoto: this.state.itemPhoto
      }});
  },
  componentDidMount() {
    let cardType = this.props.location.query.cardType;
    if(cardType == "DiscountCard"){
        this.getDiscountCardDetail();
    }else{
        this.getCZCardDetail();
    }
  },
  getCZCardDetail() {
    var cardDetail = localStorage.getItem("saleStoredCards");
    cardDetail = eval("(" + cardDetail + ")");
    var cardId = this.props.location.query.cardId;
    var payReduce = this.props.location.query.payReduce;
    var itemPhoto = this.props.location.query.itemPhoto;
    var refundExpires= this.props.location.query.refundExpires;
    this.setState({itemPhoto: itemPhoto})
    for (let i = 0; i < cardDetail.length; i++) {
      if (cardDetail[i].cardId == cardId) {
        this.setState({
          cardDiscount: cardDetail[i].discount
            ? (cardDetail[i].discount * 10).toFixed(1)
            : "",
          cardDeadLine: cardDetail[i].expiry
            ? cardDetail[i].expiry
            : "",
          cardName: cardDetail[i].name
            ? cardDetail[i].name
            : "",
          cardGivePoint: cardDetail[i].givePoint
            ? (cardDetail[i].givePoint).toFixed(2)
            : 0,
          cardPrice: cardDetail[i].price
            ? cardDetail[i].price
            : "",
          cardId: cardDetail[i].cardId
            ? cardDetail[i].cardId
            : "",
          storeId:"",
          cardTQ: cardDetail[i].cardTQ
            ? cardDetail[i].cardTQ
            : "",
          cardMD: cardDetail[i].cardMD
            ? cardDetail[i].cardMD
            : "",
          cardPhoto: cardDetail[i].photo
            ? cardDetail[i].photo
            : "",
          supportCount: cardDetail[i].supportCount
            ? cardDetail[i].supportCount
            : "",
          refundExpires: refundExpires
        })
      }
    }
  },
  getDiscountCardDetail(){
    var cardDetail = localStorage.getItem("saleCards");
    cardDetail = eval("(" + cardDetail + ")");
    var cardId = this.props.location.query.cardId;
    var payReduce = this.props.location.query.payReduce;
    var itemPhoto = this.props.location.query.itemPhoto;
    var refundExpires= this.props.location.query.refundExpires;
    this.setState({itemPhoto: itemPhoto})
    for (let i = 0; i < cardDetail.length; i++) {
      if (cardDetail[i].cardId == cardId) {
        let start = new Date();
        let end = cardDetail[i].expiry;
        let devi =  new Date(end).getTime() - start.getTime();
        let deviDays =Math.floor(devi/(24*3600*1000)) + "天"
        this.setState({
          cardDiscount: cardDetail[i].discount
            ? (cardDetail[i].discount * 10).toFixed(1)
            : "",
          cardDeadLine: cardDetail[i].expiry
            ? cardDetail[i].expiry
            : "",
          cardName: cardDetail[i].name
            ? cardDetail[i].name
            : "",
          cardGivePoint: cardDetail[i].givePoint
            ? (cardDetail[i].givePoint).toFixed(2)
            : 0,
          cardPrice: cardDetail[i].price
            ? cardDetail[i].price
            : "",
          storeId: cardDetail[i].cardId
            ? cardDetail[i].cardId
            : "",
          cardId: "",
          deviDays:deviDays,
          cardTQ: cardDetail[i].cardTQ
            ? cardDetail[i].cardTQ
            : "",
          cardMD: cardDetail[i].cardMD
            ? cardDetail[i].cardMD
            : "",
          cardPhoto: cardDetail[i].photo
            ? cardDetail[i].photo
            : "",
          supportCount: cardDetail[i].supportCount
            ? cardDetail[i].supportCount
            : "",
          refundExpires: refundExpires
        })
      }
    }
  },
  render() {
    var cardBack = {
      backgroundImage: "url(" + this.state.cardPhoto + ")",
      backgroundSize: "cover",
      backgroundColor: "#fff",
      height: "5.466667rem",
      right: "0",
      left: "0",
      margin: "0.666667rem",
      borderRadius: "0.3rem"
    };
    var about = this.props.location.query.about;
    var cardId = this.props.location.query.cardId;
    var privilegeCount = this.props.location.query.privilegeCount == 0 ? "无" : this.props.location.query.privilegeCount + "项";
    var cardType = this.props.location.query.cardType;
    var payTrue = this.props.location.query.payTrue;
    return (
      <View>
        <Container scrollable>
          <div style={cardBack}>
            <div className="cardDiscount">{cardType == "DiscountCard" ? `${this.state.cardDiscount}折卡·${this.state.deviDays}`:`储值·${this.state.cardPrice}元`}</div>
            <div className="cardDetail_name">{this.state.cardName}</div>
            <div className="cardDetail_deadline">
            {/* 有效期{this.state.cardDeadLine}天 */}
            </div>
            <div className="cardDetail_price">
            {/* 售价{this.state.cardPrice}元 */}
            </div>
          </div>
          <div className="cardDetail-top-line"></div>
          <div className="cardDetail-list">
            <span className="info-before">无理由退卡</span>
            <span className="info-after">{this.state.refundExpires}</span>
          </div>
          <div className="cardDetail-top-line"></div>
          <Link to={{pathname:"Dyj_Detail",query:{pathType:"dyjsm"}}}>
            <div className="cardDetail-list">
              <span className="info-before">赠抵用金</span>
              <span className="info-after">{this.state.cardGivePoint}元</span>
            </div>
          </Link>
          <Link to={{pathname:"Dyj_Detail",query:{pathType:"sstsm"}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <span className="info-before">随时退</span>
              <span className="info-after">详情</span>
            </div>
          </Link>
          <Link to={{pathname: "Dyj_Detail",query: {pathType: "hyksm",about: about}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <span className="info-before">本卡特权</span>
              <span className="info-after">{privilegeCount}</span>
            </div>
          </Link>
          <Link to={{pathname: "Wallet_SupportHotel",query: {cardId: cardId}}}>
            <div className="cardDetail-top-line"></div>
            <div className="cardDetail-list">
              <div className="pserson-wechat">
                <span className="info-before">适用门店</span>
                <span className="info-after">{this.state.supportCount}家</span>
              </div>
            </div>
          </Link>
          <div className="cardDetail-top-line"></div>
          <div style={{height:"2.6rem"}}></div>
          <div className="payEndNew">
            {/* <div className="CardDetailBtn" onClick={this.goForPay}>
                {cardType == "DiscountCard" ? `￥${this.state.cardPrice} 开通` : `储值并支付`}
            </div> */}
            <div className="CardDetailBtn">
                <Link to={{pathname:"PayEnd_WithCard",query:{cardId:cardId,cardPrice:this.state.cardPrice ,cardDiscount:this.state.cardDiscount,userPayMoney:payTrue,itemPhoto:this.state.itemPhoto}}}>
                  {cardType == "DiscountCard" ? `￥${this.state.cardPrice} 开通` : `储值并支付`}
                </Link>
            </div>
          </div>
        </Container>
      </View>
    )
  }
})
export default CardDetail_Buy;
