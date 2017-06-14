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

const Wallet_SaveMoney = React.createClass({
  getInitialState(){
    return{
      albums:[]
    }
  },

  componentDidMount(){
    var _this = this;
    var url = "/user/"+localStorage.getItem("uid")+"/point_records"
    Tools.ajax({
          url: url,
          type: "GET",
          // data: { name: "super", age: 20 },
          dataType: "json",
          success: function (response, xml) {

              var dyjItem = eval('(' + response + ')');
              var items = dyjItem.data.items;
              var albums = [];
              if(items.length > 0){
                for(let i=0;i< items.length;i++){
                  albums.push({
                    title:items[i].source,
                    subTitle:"¥ "+items[i].dateCreated,
                    after:items[i].number,
                  })
                }
              }else {
                albums.push({
                  title:"您暂无抵用金",
                  after:"¥ 0.00",
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
            <div className="home-saveMoney">抵用金明细</div>
            <div className="saveItem">
              <List>
                {albums.map((album, i) => {
                  return (
                    <List.Item
                      className="saveMoneyList"
                      {...album}
                      target="_blank"
                      key={i}
                      desc={null}
                    />
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
export default Wallet_SaveMoney;
