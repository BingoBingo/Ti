import React from 'react';
import {
  render,
} from 'react-dom';
import {
  Router,
  Route,
  Link,
  IndexRoute,
  hashHistory,
  browserHistory,
  withRouter
} from 'react-router';
import {
  Container,
  TabBar,
} from 'amazeui-touch';



class App extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      histories : "",
      shopInfo : "",
      personInfo : "",
      walletInfo : "",
      tabBarVisable:""
    };
  }

  componentDidMount(){

  }
  render() {

    const {
        // histories,
        // shopInfo,
        // personInfo,
        // walletInfo,
        params,
        children,
        // tabBarVisable,
        ...props,
      } = this.props;
    var pathname = this.props.location.pathname;
    var tabBarVisable = ""
    if(pathname == "/Wallet_Share" || pathname == "/Dyj_Detail" || pathname == "/Wallet_Card_BackF" || pathname == "/Wallet_C_D"){
      tabBarVisable = "none"
    }
    const {
      router
    } = this.context;
    const transition = children.props.transition || 'sfr';

    return (

      <Container direction="column" id="sk-container">

        <Container
          transition={transition}
          // fade transition example
          transition='fade'
          transitionEnterTimeout={450}
          transitionLeaveTimeout={300}
        >
          {React.cloneElement(children, {key: location.key})}
        </Container>
        <TabBar style={{display:tabBarVisable}}>
          <TabBar.Item
            component={Link}
            icon="home"
            title="推荐"
            selected={router.isActive('/', true)}
            to="/"
            onlyActiveOnIndex
            className="tabBarColor"
          />
          <TabBar.Item
            component={Link}
            icon="search"
            title="搜索"
            selected={router.isActive('/Search', true)}
            to="/Search"
            onlyActiveOnIndex
            className="tabBarColor"
          />
          <TabBar.Item
            component={Link}
            icon="wallet"
            title="钱包"
            selected={router.isActive('/Wallet', true)}
            to="/Wallet"
            onlyActiveOnIndex
            className="tabBarColor"
          />
          <TabBar.Item
            component={Link}
            icon="me"
            title="我"
            // @see https://github.com/reactjs/react-router/blob/0616f6e14337f68d3ce9f758aa73f83a255d6db3/docs/API.md#isactivepathorloc-indexonly
            selected={router.isActive('/Me', true)}
            to="/Me"
            onlyActiveOnIndex
            className="tabBarColor"
          />
        </TabBar>
      </Container>
    );
  }
}


// Pages
import Index from './pages/Index';

/*search*/
import Search from './pages/Search'
import SearchResult from './pages/SearchResult'

/*wallet*/
import Wallet from './pages/Wallet'
import Wallet_C_D from './pages/Wallet_C_D'
import Wallet_CardList from './pages/Wallet_CardList'
import Wallet_SaveMoney from './pages/Wallet_SaveMoney'
import Wallet_tradeList from './pages/Wallet_tradeList'
import Wallet_C_Back from './pages/Wallet_C_Back'
import Wallet_SaveTotalMoney from './pages/Wallet_SaveTotalMoney'
import Wallet_SupportHotel from './pages/Wallet_SupportHotel'
import Wallet_tradeDetail from './pages/Wallet_tradeDetail'
/*Home*/
import Home_H_D from "./pages/Home_H_D"

/*me*/
import Me from "./pages/Me"
import Me_Rank from "./pages/Me_Rank"
import Collection from "./pages/Collection"
import Me_Phone_Input from "./pages/Me_Phone_Input"
import Me_Phone_Code from "./pages/Me_Phone_Code"
import Wallet_Share from "./pages/Wallet_Share"
import Me_Detail from "./pages/Me_Detail"
import Wallet_Card_BackF from "./pages/Wallet_Card_BackF"
import Dyj_Detail from "./pages/Dyj_Detail"

/*Category*/
import CategoryList from './pages/CategoryList'//By HeMuYu_Ray
import StoreList from './pages/StoreList'//By HeMuYu_Ray
import cityList from './pages/cityList'//By HeMuYu_Ray

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="Home_H_D" component={Home_H_D} />
      <Route path="Wallet" component={Wallet} />
      <Route path="Wallet_C_D" component={Wallet_C_D} />
      <Route path="Wallet_CardList" component={Wallet_CardList} />
      <Route path="Wallet_SaveMoney" component={Wallet_SaveMoney} />
      <Route path="Wallet_C_Back" component={Wallet_C_Back} />
      <Route path="Wallet_SaveTotalMoney" component={Wallet_SaveTotalMoney} />
      <Route path="Wallet_SupportHotel" component={Wallet_SupportHotel} />
      <Route path="Wallet_tradeDetail" component={Wallet_tradeDetail} />
      <Route path="Wallet_tradeList" component={Wallet_tradeList} />
      <Route path="Search" component={Search} />
      <Route path="SearchResult" component={SearchResult} />
      <Route path="Me" component={Me} />
      <Route path="Me_Rank" component={Me_Rank} />
      <Route path="Me_Detail" component={Me_Detail} />
      <Route path="Collection" component={Collection} />
      <Route path="Me_Phone_Input" component={Me_Phone_Input} />
      <Route path="Me_Phone_Code" component={Me_Phone_Code} />
      <Route path="Wallet_Share" component={Wallet_Share} />
      <Route path="Wallet_Card_BackF" component={Wallet_Card_BackF} />
      <Route path="Dyj_Detail" component={Dyj_Detail} />
      <Route path="CategoryList" component={CategoryList} />//By HeMuYu_Ray
      <Route path="StoreList" component={StoreList} />//By HeMuYu_Ray
      <Route path="cityList" component={cityList} />//By HeMuYu_Ray
	  
    </Route>
  </Router>
);

document.addEventListener('DOMContentLoaded', () => {
  render(routes, document.getElementById('root'));
});

/*路由*/
