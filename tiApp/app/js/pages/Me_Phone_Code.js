import React from 'react';
import Rodal from 'rodal';

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
  Link,
} from 'react-router';
import Tools from '../util/tools';
const Me_Phone_Code = React.createClass({
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
   defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

	},
  getInitialState(){
    return({
      mobileNum:"",
      phoneNotInput :"phonesend-dis-btn",
	  visibleAlert:false
    })
  },
	showAlert(contents,url) {
		document.getElementById('showAlertContent').innerHTML = contents;
		this.setState({ visibleAlert: true});
		if(url){
			this.setState({ realoadUlr: url });
		}
	},

	hideAlert() {
		this.setState({ visibleAlert: false });
		document.getElementById('showAlertContent').innerHTML = '';
		if(this.state.realoadUlr && this.state.realoadUlr !='reload'){
			this.context.router.push(this.state.realoadUlr);
		}
		if( this.state.realoadUlr =='reload'){
				window.location.reload();
		}


	},
  loadUserInfo(){
    /*获取url的uid*/
    var _this = this;
    var uid = Tools.GetQueryString("uid");
    console.log(uid);
    localStorage.setItem("uid",uid);
    var url = "/user/"+uid+"/data";

    var lat = localStorage.getItem("userLat") ? localStorage.getItem("userLat"):0;
    var lng = localStorage.getItem("userLng") ? localStorage.getItem("userLng"):0;

    //var mockurl = "http://localhost:3005/home";
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

              _this.setState({
                shopInfo:appInfo.data.shopInfo,
                visible:false
              })
              //localStorage.setItem("histories",JSON.stringify(appInfo.data.histories));
              localStorage.setItem("personInfo",JSON.stringify(appInfo.data.personInfo));
              //localStorage.setItem("walletInfo",JSON.stringify(appInfo.data.walletInfo));
          },
          fail: function (status) {

            console.log(status);
          }
      });
  },
  codeSubmit(){
      //const phoneCode= event.target.elements[0].value;
      const phoneCode = document.getElementById("chekcCode").value;
      var codeUrl =  "/user/"+localStorage.getItem("uid")+"/phone";
      const mobileNum = localStorage.getItem("mobileNum");

      var personInfo = localStorage.getItem("personInfo");
      personInfo = JSON.parse(personInfo);
      var bindMobile =  personInfo.bindMobile;
      const _this = this;

      Tools.ajax({
            url: codeUrl,              //请求地址
            type: "POST",                       //请求方式
            data: { code:phoneCode,mobile:mobileNum},        //请求参数
            dataType: "json",
            success: function (response, xml) {
                var path = `/Me/`
                var appInfo = eval('(' + response + ')')
                console.log(appInfo);
                if(appInfo.status == "success"){
                  _this.loadUserInfo();
                  if(bindMobile){
                    _this.showAlert("恭喜您～改绑成功",path);
                  }else{
                    _this.showAlert("恭喜您～绑定成功",path);
                  }
                }else{
                    _this.showAlert("很遗憾，绑定失败，请联系服务商")
                }
            },
            fail:function(status){
              var path = `/Me/`
              _this.showAlert("很遗憾，绑定失败，请联系服务商",path);
            }
        });
  },
  componentDidMount(){
    this.setState({
      mobileNum : localStorage.getItem("mobileNum")
    })
  },
  changeBtn(e){
    //console.log(event.target.elements);
    //const mobileNum = event.target.elements[0].value;
    const chekcCode = document.getElementById("chekcCode").value;
    if(chekcCode != ""){
      this.setState({
        phoneNotInput:"phoneInput-dis-btn"
      })
    }else{
      this.setState({
        phoneNotInput:"phonesend-dis-btn"
      })
    }
  },
  render() {
    return (
      <View>
        <Container scrollable>
          {/* <Group>
          <h1>输入短信中验证码</h1>
          <p>已向您{this.state.mobileNum}发送短信</p>
          </Group> */}

          <div>
          <div className="home-mephone">输入短信中验证码</div>
          <div className="bindPhone">已向您{this.state.mobileNum}发送短信</div>
          </div>

            <div className="phoneInputArea">
              <List className="phoneInput">
                <List.Item
                    nested="input"
                  >
                    <Field
                      label={null}
                      placeholder={'请输入验证码'}
                      onChange={this.changeBtn}
                      id="chekcCode"
                    />
                  </List.Item>
              </List>
              <h6 className="text-center">重新发送</h6>
            </div>
            <div className="phone-send-group">
              <Button className={this.state.phoneNotInput} onClick={this.codeSubmit}>绑定手机号</Button>
            </div>
			<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
				<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
			</Rodal>
        </Container>
      </View>
    );
  }
})

export default Me_Phone_Code;
