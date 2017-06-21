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
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';

const Wallet_CardList = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  getInitialState(){
    return{
      cardlist:[]
    }
  },
  componentDidMount(){
    //const mockUrl = "http://localhost:3005/Card-List";
    var uid = Tools.GetQueryString("uid");
    var url = "/user/"+uid+"/cards";
    const _this = this;
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          //data: { keyword: keyword, uid: "086d1f45-19b7-43e9-84db-2f3d2915523c" },        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var cardlist = eval('(' + response + ')');
              console.log("---------------");
              console.log(cardlist);
              //_this.state.shopInfo = searchResult.data.items;
              _this.setState({
                cardlist:cardlist.data.items
              })
              const wallet_card = JSON.stringify(cardlist);
              localStorage.setItem("wallet_card",wallet_card);
          },
          fail: function (status) {
            console.log(status);
          }
      });
  },
  renderCardList(){
      var cardlist = this.state.cardlist;
      if(cardlist !== "" && cardlist.length > 0){
          return cardlist.map((item, index) => {
            var cardStyle = {
              background: "url("+item.photo+")",
              backgroundSize:"cover"
            };
            console.log(cardStyle);
            var discount =  item.discount ? (item.discount*10).toFixed(1):"" ;
            var showOrNot = ""
            item.status == "normal" ? showOrNot="" : showOrNot="none";
            console.log("--"+showOrNot);
            return (
              <Link to={{pathname:"/Wallet_C_D",query:{item:item.cardId}}}  key={item.cardId}>
                <div className="card-box" style={{display:showOrNot}}>
                  <div className="club-card-body" style={cardStyle}>
                  <div className="club-name">{item.cardName}</div><div className="club-discount">{discount}折</div>
                  </div>
                </div>
              </Link>
            );
          });
    }
  },
  render(){
    return(
      <View>
        <Container scrollable>

        <div className="my-cardlist">我的会员卡</div>

          {this.renderCardList()}
          <div className="card-box">

          </div>
          <div className="card-box">

          </div>
        </Container>
      </View>
    )
  }
})

export default Wallet_CardList;
