import React from 'react';
import {
  View,
  NavBar,
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';

import NotFound from './NotFound';
import Wallet from './Wallet';
import Me from './Me';
import Me_Detail from './Me_Detail';
import Me_Phone_Input from './Me_Phone_Input';
import Me_Phone_Code from './Me_Phone_Code';
import Search from './Search';
import Collection from './Collection';
import Me_Rank from './Me_Rank';
import Home_H_D from './Home_H_D'
import SearchResult from './SearchResult'
import Wallet_CardList from './Wallet_CardList'
//import Wallet_C_D from './Wallet_C_D'
import Home_H_DT from './Home_H_DT'
import Wallet_SaveMoney from './Wallet_SaveMoney'
import CategoryList from './CategoryList';//By HeMuYu_Ray
import StoreList from './StoreList';//By HeMuYu_Ray
import cityList from './cityList';//By HeMuYu_Ray

const pages = {
  Wallet,
  Me,
  Me_Detail,
  Me_Phone_Input,
  Me_Phone_Code,
  Search,
  Collection,
  Me_Rank,
  Home_H_D,
  SearchResult,
  Wallet_CardList,
  //Wallet_C_D,
  Home_H_DT,
  Wallet_SaveMoney,
  CategoryList,//By HeMuYu_Ray
  StoreList,//By HeMuYu_Ray
  cityList
};

const Page = React.createClass({
  // getInitialState(){
  //   const searchKeyWord = this.props.location.query;
  //   return({
  //     searchKeyWord:searchKeyWord
  //   });
  // },
  render() {
    //console.log(this.state.searchKeyWord)
    let page = this.props.params.page;
    // 使用 query
    //console.log(this.props.location.query);

    if (page) {
      page = page.charAt(0).toUpperCase() + page.slice(1);
      console.log(page);
    }

    const Component = pages[page] || NotFound;
    const backNav = {
      component: Link,
      icon: 'left-nav',
      title: '返回',
      to: '/',
      onlyActiveOnIndex: true,
    };

    return (
      <View>
        <Component scrollable  />
      </View>
    );
  }
})
// class Page extends React.Component {
//
// }

export default Page;
