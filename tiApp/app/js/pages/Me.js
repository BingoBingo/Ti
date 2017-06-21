import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Icon,
  Button
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';

export default class Me extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      headPic: "",
      nickname: "",
      realName: "",
      gender: "",
      identity: "",
      birthday: "",
      rank: "",
      favoriteCount: "",
      bindMobile: "",
      bindWechat: "",
      setPassword: "",
      lastName:"",
      firstName:""
    };
  }

  componentDidMount() {
	this.loadUserInfo();
    var personInfo = localStorage.getItem("personInfo");
    personInfo = JSON.parse(personInfo);
	
    this.setState({
      headPic:personInfo.headPic,
      realName:personInfo.realName,
      lastName:personInfo.lastName,
      firstName:personInfo.firstName,
      nickname:personInfo.nickname,
      gender:personInfo.gender,
      identity:personInfo.identity,
      birthday:personInfo.birthday,
      rank:personInfo.rank,
      favoriteCount: personInfo.favoriteCount,
      bindMobile: personInfo.bindMobile == false ? "未绑定":"已绑定",
      bindWechat: personInfo.bindWechat == false ? "未绑定":"已绑定",
      bindAlipay: personInfo.bindAlipay == false ? "未绑定":"已绑定",
      alipayShow: personInfo.bindAlipay == false ? "":"none",
      alipayShowMargin: personInfo.bindAlipay == false ?"10px":"25px",
      setPassword: personInfo.setPassword == false ? "未绑定":"已绑定"
    });
  }
  loadUserInfo(){
    /*获取url的uid*/
    var _this = this;
	const uid = localStorage.getItem("uid");
    var url = "/user/"+uid+"/data";

    var lat = localStorage.getItem("userLat") ? localStorage.getItem("userLat"):0;
    var lng = localStorage.getItem("userLng") ? localStorage.getItem("userLng"):0;
    Tools.ajax({
          url: url,              //请求地址
          type: "GET",                       //请求方式
          data: {
            uid:uid,
            userLat:lat,
            userLng:lng
          },        //请求参数
          dataType: "json",
          success: function (response, xml) {

              var appInfo = eval('(' + response + ')');
              localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
          },
          fail: function (status) {

            console.log(status);
          }
      });
  }
  render() {
    const personhead = <img width="32" src={this.state.headPic} />;
    var headStyle = {
      backgroundImage: "url("+this.state.headPic+")",
      backgroundSize:"cover",
      backgroundColor:"#b7a17c"
    };
	if(this.state.alipayShow==""){
		var linkLinkPay1 = "/linkPay1.html?uid=" + localStorage.getItem("uid");
	}else{
		var linkLinkPay1 = "/wechatAccount.html?headPic=" + this.state.headPic +"&nickname="+this.state.nickname;
    }
	return (
      <View>

        <Container scrollable>


            <div className="name-info">
              <div className="me-dis">
                <Link to={{pathname:"Me_Detail"}}>
                <span className="personName">{this.state.nickname}</span>
                <span className="personEdit">编辑个人资料</span>
                </Link>
              </div>
              <div className="personhead">
              <Link to={{pathname:"Me_Detail"}}>
                <div className="headImage" style={headStyle}>
                </div>
              </Link>
              </div>
            </div>


          <div className="me-top-short"></div>


          <div className="rank-exp">
            <Link to={{pathname:"Collection"}}>
            <span className="wallet-left">收藏</span>
            <span className="wallet-right">{this.state.favoriteCount}</span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>
          <div className="rank-exp">
            <Link to={{pathname:"Wallet_tradeList"}}>
            <span className="wallet-left">交易记录</span>
            <span className="wallet-right">查看</span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          <div className="rank-exp">
            <Link to={{pathname:"Me_Phone_Input"}}>
            <span className="wallet-left">手机</span>
            <span className="wallet-right">{this.state.bindMobile}</span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          <div className="rank-exp">
            <Link to={{pathname:"Me"}}>
            <span className="wallet-left">微信</span>
            <span className="wallet-right">{this.state.bindWechat}</span>
            </Link>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          <div className="rank-exp">
            <a href={linkLinkPay1} target="_blank" >
            <span className="wallet-left" style={{marginBottom:this.state.alipayShowMargin}}>支付宝</span>
            <span className="wallet-right" style={{marginBottom:this.state.alipayShowMargin}}>{this.state.bindAlipay}</span>
            <span className="linkInfo" style={{display:this.state.alipayShow}}>关联后，微信支付宝都可以使用会员卡哦</span>
            </a>
          </div>
          <div className="cf"></div>
          <div className="wallet-line"></div>

          {/* <div className="rankandexp">
            <Link to={{pathname:"Me_Rank"}}>
            <span className="info-before">等级经验</span>
            <span className="data-after">{this.state.rank}</span>
            </Link>
          </div> */}
          {/* <div className="me-top-line"></div>
          <div className="person-coll">
            <Link to={{pathname:"Collection"}}>
            <span className="info-before">收藏</span>
            <span className="data-after">{this.state.favoriteCount}</span>
            </Link>
          </div> */}



          {/* <div className="me-top-line"></div>
          <div className="person-phone">
            <Link to={{pathname:"Me_Phone_Input"}}>
            <span className="info-before">手机</span>
            <span className="data-after">{this.state.bindMobile}</span>
            </Link>
          </div> */}


        {/* <div className="me-top-line"></div>
        <div className="pserson-wechat">
          <span className="info-before">微信</span>
          <span className="data-after">{this.state.bindWechat}</span>
        </div>
        <div className="me-top-line"></div> */}

        <Group className="user-change-group" style={{display:"none"}}>
          <Button hollow amStyle="success" className="user-change-btn">切换账号</Button>
        </Group>
        </Container>
      </View>
    );
  }
}
