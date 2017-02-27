import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Icon
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';

const Wallet_tradeList = React.createClass({
  getInitialState(){
    return{
      albums:[]
    }
  },

  componentDidMount(){
    var _this = this;
    var url = "/user/"+localStorage.getItem("uid")+"/trade_records"
    Tools.ajax({
          url: url,
          type: "GET",
          // data: { name: "super", age: 20 },
          dataType: "json",
          success: function (response, xml) {

              var jyjlItem = eval('(' + response + ')');
              var items = jyjlItem.data.items;
              var albums = [];
              if(items.length > 0){
                for(let i=0;i< items.length;i++){
                  albums.push({
                    title:items[i].tradePlace,
                    subTitle:items[i].tradeTime,
                    after:"￥ "+items[i].tradePrice,
                    tradePlace:items[i].tradePlace,
                    tradeTime:items[i].tradeTime,
                    tradeCode:items[i].tradeCode,
                    cardName:items[i].cardName,
                    paymentChannel:items[i].paymentChannel,
                    favorablePrice:items[i].favorablePrice,
                    pointNumber:items[i].pointNumber,
                    tradePrice:items[i].tradePrice
                  })
                }
              }else {
                albums.push({
                  title:"您暂无交易记录~",
                  after:"0.00",
                  subTitle: '',
                })
              }
              _this.setState({
                albums :albums
              });
          },
          fail: function (status) {
            console.log(status);
          }
      });
  },
  render(){
    const albums = this.state.albums;
    return(
      <View className="dyj-back">
        <Container scrollable>
          <Group noPadded>
            <div className="home-tradelist">交易记录</div>
            <div className="saveItem">
              <List className="tradelist">
                {albums.map((album, i) => {
                  return (
                    <Link to={{pathname:"Wallet_tradeDetail",query:{tradeDetail:JSON.stringify(album)}}} key={i}>
                    <List.Item
                      {...album}
                      target="_blank"

                      desc={null}
                    />
                    </Link>
                  );
                })}
              </List>
            </div>
          </Group>
        </Container>
      </View>
    )
  }
})
export default Wallet_tradeList;
