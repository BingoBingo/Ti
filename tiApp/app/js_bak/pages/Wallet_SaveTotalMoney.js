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
    const card_id = this.props.location.query.vid;
    var url = "/vip/"+card_id+"/save_records";
    console.log(url);
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
                    after:"￥ "+items[i].favorablePrice,
                  })
                }
              }else {
                albums.push({
                  title:"您暂无优惠记录~",
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
            <div className="home-tradelist">优惠明细</div>
            <div className="saveItem">
              <List>
                {albums.map((album, i) => {
                  return (
                    <List.Item
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
export default Wallet_tradeList;
