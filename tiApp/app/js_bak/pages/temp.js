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
  getInitialState(){
    return{

    }
  },
  componentDidMount(){
    // const keyword = localStorage.getItem("keyword");
    // console.log(keyword);
    // const uid = localStorage.getItem("uid");
    // const url = "/hotels/filter";
    // const _this = this;
    // Tools.ajax({
    //       url: url,              //请求地址
    //       type: "POST",                       //请求方式
    //       data: { keyword: keyword, uid: uid },        //请求参数
    //       dataType: "json",
    //       success: function (response, xml) {
    //           console.log(keyword);
    //           console.log(uid);
    //           var searchResult = eval('(' + response + ')');
    //           console.log(searchResult);
    //           //_this.state.shopInfo = searchResult.data.items;
    //           _this.setState({
    //             shopInfo:searchResult.data.items,
    //             searchCount:searchResult.data.total
    //           })
    //       },
    //       fail: function (status) {
    //         console.log(status);
    //       }
    //   });
  },
  render(){
    return(
      <Container>

      </Container>
    )
  }
})
export default Wallet_CardList;
