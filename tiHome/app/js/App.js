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
      hotelInfo : "",
      personInfo : "",
      walletInfo : ""
    };
  }

  componentDidMount(){

  }
  render() {

    const {
        histories,
        hotelInfo,
        personInfo,
        walletInfo,
        params,
        children,
        ...props,
      } = this.props;
    const {
      router
    } = this.context;
    const transition = children.props.transition || 'sfr';

    return (
      <Container direction="column" id="sk-container">

        <Container
          transition={transition}
          // fade transition example
          // transition='fade'
          // transitionEnterTimeout={450}
          // transitionLeaveTimeout={300}
        >
          {React.cloneElement(children, {key: location.key})}
        </Container>

      </Container>
    );
  }
}


// Pages
import Index from './pages/Index';
import New_User_Welfare from './pages/New_User_Welfare'
import Old_User_Welfare from './pages/Old_User_Welfare'
import CardDetail_Buy from './pages/CardDetail_Buy'
import PayEnd_Detail from './pages/PayEnd_Detail'
import Dyj_Detail from './pages/Dyj_Detail'
import Pay_Success_Fail from './pages/Pay_Success_Fail'
import PayEnd_WithCard from './pages/PayEnd_WithCard'
import Wallet_SupportHotel from './pages/Wallet_SupportHotel'

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="Old_User_Welfare" component={Old_User_Welfare} />
      <Route path="New_User_Welfare" component={New_User_Welfare} />
      <Route path="CardDetail_Buy" component={CardDetail_Buy} />
      <Route path="PayEnd_Detail" component={PayEnd_Detail} />
      <Route path="Dyj_Detail" component={Dyj_Detail} />
      <Route path="Pay_Success_Fail" component={Pay_Success_Fail} />
      <Route path="PayEnd_WithCard" component={PayEnd_WithCard} />
      <Route path="Wallet_SupportHotel" component={Wallet_SupportHotel} />
    </Route>
  </Router>
);

document.addEventListener('DOMContentLoaded', () => {
  render(routes, document.getElementById('root'));
});

/*路由*/
