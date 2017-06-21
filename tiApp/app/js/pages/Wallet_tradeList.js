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
      albums:[],
	  containsDate:[],
	  visible:false,
		listTotal:0,
		page:1,
		size:10
    }
  },
  LoadTradeScroll(e){
  

	/*获取url的uid*/
	var _this = this;
    var visible = this.state.visible;
	if(visible){
		return;
	}

    var clientHeight = e.target.clientHeight; //可视区域高度
    var scrollTop  = e.target.scrollTop;  //滚动条滚动高度
    var scrollHeight = e.target.scrollHeight; //滚动内容高度

	if((clientHeight+scrollTop+150)>=(scrollHeight)){
	this.setState({
	  visible:true
	});

	  /*获取url的uid*/

	  var uid =  localStorage.getItem("uid");
	  var page = this.state.page?this.state.page:1;
	  page = page +1;
	  var listTotal = this.state.listTotal?this.state.listTotal:10;
	  var size = this.state.size?this.state.size:10;
	  if((size*page-size)>=listTotal){
		this.setState({
		  visible:false
		});	
		return;
	  }


	var url = "/user/"+uid+"/trade_records"
    Tools.ajax({
          url: url,
          type: "GET",
          data: { page: page},
          dataType: "json",
          success: function (response, xml) {

              var jyjlItem = eval('(' + response + ')');
              var items = jyjlItem.data.items;
  
			  var recordsArr = [];
              if(items.length > 0){
                for(let i=0;i< items.length;i++){
					  if(_this.containsDateCheck(items[i].date)==false){
						  recordsArr.push({
							date:items[i].date,
							isInfo:0

						  });
					  }
					
					for(let j=0;j< items[i].records.length;j++){
					  recordsArr.push({
						date:items[i].date,
						title:items[i].records[j].tradePlace,
						tradeType:items[i].records[j].tradeType,
						tradePlace:items[i].records[j].tradePlace,
						tradeTime:items[i].records[j].tradeTime,
						tradeCode:items[i].records[j].tradeCode,
						discount:items[i].records[j].discount,
						storedValue:items[i].records[j].storedValue,
						paymentChannel:items[i].records[j].paymentChannel,
						favorablePrice:items[i].records[j].favorablePrice,
						currency:items[i].records[j].currency,
						tradePrice:items[i].records[j].tradePrice,
						totalPrice:items[i].records[j].totalPrice,
						isInfo:1
					  });
					}
                }

              }
			 var oldAlbums = _this.state.albums;

			 var newAlbums = oldAlbums.concat(recordsArr);

              _this.setState({
				  albums :newAlbums,
				  listTotal:jyjlItem.data.total,
				  size:size,
				  page:page,
				  visible:false
              });
          },
          fail: function (status) {
            console.log(status);
          }
      });
	}   
  
  },
 saveScrollPage(){
 
	var scrollTop = document.getElementById('LoadIndexScroll').scrollTop;
	var page = this.state.page?this.state.page:1;
	localStorage.setItem("scrollTopTrade",scrollTop);
	localStorage.setItem("scrollTopPageTrade",page);
    var albums = this.state.albums;
	if(typeof(albums) != 'undefined' && albums !== ""){//By HeMuYu_Ray
		if(albums !== "" && albums.length > 0){
			sessionStorage.setItem("TradeInfo", JSON.stringify(albums));
		}
	}
	
 },
  renderTradeList(){
    var albums = this.state.albums;

	if(typeof(albums) != 'undefined' && albums !== ""){//By HeMuYu_Ray
		if(albums !== "" && albums.length > 0){
		
			return albums.map((item, index) => {


		      if(item.isInfo==1){
					  var storedValue = item.storedValue.replace("¥ ",'');
					  if(storedValue>0){
						var storedType='';
					  }else{
						var storedType='none';
					  }
					  return (
						<Link to={{pathname:"Wallet_tradeDetail",query:{tradeDetail:JSON.stringify(item)}}} key={index} onClick={this.saveScrollPage}>
							<li className="item item-content"><div className="item-main"><div className="item-title-row"><h3 className="item-title">{item.title}</h3><div className="item-after">{item.tradePrice}</div></div><div className="item-subtitle">{item.tradeTime}</div><div className="item-tradeType" style={{display:storedType}}>(储值支付 : {item.storedValue})</div></div></li>

						</Link>

					  );
			  }else{

				  return (
						<li className="item item-content item-date" key={index} ><span>{item.date}</span></li>

				  );
				  
			  
			  }
				  
			  
			  
			});
		}else{
				  return (
						<li className="item item-content"><h3 className="item-title">您暂无交易记录~</h3></li>

				  );	
	
			}
	}
  },
  containsDateCheck(obj) {
	var containsDateArr = this.state.containsDate;
	var i = containsDateArr.length;  
	while (i--) {  
		if (containsDateArr[i] === obj) {

			return true;
		}  
	}
	containsDateArr.push(obj);

	this.setState({
	  containsDate:containsDateArr
	});

	return false;  
   },
  componentDidMount(){
    var _this = this;
	var prevPathename = localStorage.getItem("prevPathename");
	var scrollTop = localStorage.getItem("scrollTopTrade")?localStorage.getItem("scrollTopTrade"):0;
	var scrollTopPage = localStorage.getItem("scrollTopPageTrade")?localStorage.getItem("scrollTopPageTrade"):1;
	var TradeInfo = sessionStorage.getItem("TradeInfo")?sessionStorage.getItem("TradeInfo"):'';

  if((prevPathename=='/Wallet_tradeDetail/' || prevPathename=='/Wallet_tradeDetail') && scrollTopPage>1 && TradeInfo){
				

	if(TradeInfo){
		TradeInfo = eval("(" +TradeInfo+")");

		_this.setState({
		  albums:TradeInfo,
		  page:scrollTopPage,
		  visible:false
		});
		

		setTimeout(function(){
			document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
			localStorage.removeItem("prevPathename");
			localStorage.removeItem("scrollTopTrade");
			localStorage.removeItem("scrollTopPageTrade");
			sessionStorage.clear();
		},1);

	}
  }else{
	sessionStorage.clear();
    var url = "/user/"+localStorage.getItem("uid")+"/trade_records"
    Tools.ajax({
          url: url,
          type: "GET",
          data: { page:1},
          dataType: "json",
          success: function (response, xml) {

              var jyjlItem = eval('(' + response + ')');
              var items = jyjlItem.data.items;
              var recordsArr = [];
              if(items.length > 0){
                for(let i=0;i< items.length;i++){
					  if(_this.containsDateCheck(items[i].date)==false){

						  recordsArr.push({
							date:items[i].date,
							isInfo:0

						  });
					  }
					for(let j=0;j< items[i].records.length;j++){
					  recordsArr.push({
						date:items[i].date,
						title:items[i].records[j].tradePlace,
						tradeType:items[i].records[j].tradeType,
						tradePlace:items[i].records[j].tradePlace,
						tradeTime:items[i].records[j].tradeTime,
						tradeCode:items[i].records[j].tradeCode,
						discount:items[i].records[j].discount,
						storedValue:items[i].records[j].storedValue,
						paymentChannel:items[i].records[j].paymentChannel,
						favorablePrice:items[i].records[j].favorablePrice,
						currency:items[i].records[j].currency,
						tradePrice:items[i].records[j].tradePrice,
						totalPrice:items[i].records[j].totalPrice,
						isInfo:1
					  });
					}
                }

              }
	
              _this.setState({
                albums :recordsArr,
				  listTotal:jyjlItem.data.total,
				  visible:false
              });
			if((prevPathename=='/Wallet_tradeDetail/' || prevPathename=='/Wallet_tradeDetail')){

				document.getElementById('LoadIndexScroll').scrollTop = scrollTop;
				localStorage.removeItem("prevPathename");
				localStorage.removeItem("scrollTopTrade");
				localStorage.removeItem("scrollTopPageTrade");
			}
          },
          fail: function (status) {
            console.log(status);
          }
      });
  }
  },
  render(){
    return(
      <View className="dyj-back">
        <Container scrollable  onScroll={this.LoadTradeScroll}  id="LoadIndexScroll">
          <Group noPadded>
            <div className="home-tradelist">交易记录</div>
            <div className="saveItem">
				<ul className="list tradelist">
					{this.renderTradeList()}
				</ul>
            </div>
          </Group>
        </Container>
      </View>
    )
  }
})
export default Wallet_tradeList;
