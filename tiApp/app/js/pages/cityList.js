import '../../style/cate.scss'
import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Loader,
  Icon
} from 'amazeui-touch';
import {
  Link
} from 'react-router';

import Tools from '../util/tools';



const CityList = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },
  

  getInitialState(){
    //this.callWX();
    let userLng = localStorage.getItem("userLng") ? localStorage.getItem("userLng") : "0" ;
    let userLat = localStorage.getItem("userLat") ? localStorage.getItem("userLat") :"0";
    return({
      shopInfo:[],
      searchCount:"0",
      wxInfo:{},
      lat:"",
      lng:"",
      cityList:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:""
    })
  },

  renderCityList(){
    var cityList = this.state.cityList;

	if(typeof(cityList) != 'undefined' && cityList !== ""){//By HeMuYu_Ray
		if(cityList !== "" && cityList.length > 0){

			var isIndex = this.props.location.query.isIndex?this.props.location.query.isIndex:0;
			return cityList.map((item, index) => {

			  var name = item.name ? item.name:"";
			  var id = item.id ? item.id:"";
				if(isIndex==0){
					var linkStr = "StoreList/";

				}else{
					var linkStr = "";

				}

				  if(id==''){
				  
					  return (

							<li id={id} key={index}><Link to={{pathname:linkStr,query:{city_id:id}}} key={index}><span className="txt">{name}</span><i className="r-icon">推荐</i></Link></li>
					  );

				  }else{
					  return (

							<li id={id} key={index}><Link to={{pathname:linkStr,query:{city_id:id}}} key={index}><span className="txt">{name}</span></Link></li>
					  );
				  }
	
				  			  
			  
			  
			});
		}
	}
  },
goBackUp(){
  history.go(-1);
},

  prevPathenameSave(){
	var _this = this;
    window.addEventListener("popstate", function(e) {

			localStorage.setItem("prevPathename",_this.props.location.pathname);

    }, false); 
  },
componentDidMount() {

  /*获取url的uid*/
  var _this = this;
	_this.prevPathenameSave();

  var url = "/shop/locations";
  Tools.ajax({
        url: url,              //请求地址
        type: "GET",                       //请求方式
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');
            _this.setState({
              cityList:appInfo.data,
              visible:false
            })
        },
        fail: function (status) {
          console.log(status);
        }
    });
},

  render() {
    var lat = this.state.userLat;
    var lng = this.state.userLng;
    var uid = localStorage.getItem("uid");
 
      return (
        <View>
          <Container scrollable>

			<div className="cityListBody">
				<div className="cityTitle">选择城市</div>
				<div className="cityInfoList">
					<ul className="cleafix">
						{this.renderCityList()}
					</ul>
				</div>
			</div>
          </Container>
		  <div className="backUpBtn" onClick={this.goBackUp}></div>
        </View>
      );
  }
})
export default CityList;
