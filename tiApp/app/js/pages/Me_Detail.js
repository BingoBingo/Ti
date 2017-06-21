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
  Field
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';


const Me_Detail = React.createClass({
	defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

	},
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  getInitialState(){
    let personInfo = localStorage.getItem("personInfo");
    personInfo = JSON.parse(personInfo);

    return({
      headPic: "",
      nickname: "",
      realName: "",
      gender: personInfo.gender,
      identity: "",
      birthday: "",
      headPic:"",
      firstName:"",
      lastName:"",
	  showSaveBtn:false,
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
		if(this.state.realoadUlr){
			this.context.router.push(this.state.realoadUlr);
		}

	},
  componentDidMount(){
    var personInfo = localStorage.getItem("personInfo");
    personInfo = JSON.parse(personInfo);
    this.setState({
      realName:personInfo.lastName + personInfo.firstName,
      nickname:personInfo.nickname,
      gender:personInfo.gender,
      identity:personInfo.identity,
      birthday:personInfo.birthday,
      headPic:personInfo.headPic,
      firstName:personInfo.firstName,
      lastName:personInfo.lastName
    })
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
  isCardNo(card)
  {
   // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
   if(reg.test(card) === false)
   {
       this.showAlert("身份证输入不合法");
       return  false;
   }
 },
  changeInfoCheck(){
		var _this = this;
	
      var nickname = document.getElementById("nickname").value;
      var nickname2 = this.state.nickname;
      var gender = document.getElementById("gender").value;
      var gender2 = this.state.gender;
      var identity = document.getElementById("identity").value;
      var identity2 = this.state.identity;
      var birthday = document.getElementById("birthday").value;
      var birthday2 = this.state.birthday;
      var firstName = document.getElementById("firstName").value;
      var firstName2 = this.state.firstName;
      var lastName = document.getElementById("lastName").value;
      var lastName2 = this.state.lastName;
	  if(nickname!= nickname2 || gender!= gender2 || identity!= identity2 || birthday!= birthday2 || firstName!= firstName2 || lastName!= lastName2 )
	  _this.setState({
		showSaveBtn:true
	  })
	  
 },
  savePersonInfo(){
      //const phoneCode= event.target.elements[0].value;
      var nickname = document.getElementById("nickname").value == "" ? this.state.nickname :document.getElementById("nickname").value;
      //var realName = document.getElementById("realName").value == "" ? this.state.realName :document.getElementById("realName").value;
      var gender = document.getElementById("gender").value == "" ? '' :document.getElementById("gender").value;
      var identity = document.getElementById("identity").value == "" ? '' :document.getElementById("identity").value;
      var birthday = document.getElementById("birthday").value != ""? document.getElementById("birthday").value :this.state.birthday;
      var firstName = document.getElementById("firstName").value == "" ? this.state.firstName :document.getElementById("firstName").value;
      var lastName = document.getElementById("lastName").value == "" ? this.state.lastName :document.getElementById("lastName").value;
		if(birthday=='' || typeof(birthday)=='undefined'){
			var birthday = '';
		}
	  if(identity.length>0){

		  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		  if(reg.test(identity) === false)
		  {
			  this.showAlert("身份证输入不合法");
			  return  false;
		  }
	  }else{
		if(this.state.identity!='' && typeof(this.state.identity)!='undefined'){
			var identity = this.state.identity;
		}else{
			var identity = '';
		}
	  }
      var personParam = {
        nickname :nickname,
        firstName :firstName,
        lastName:lastName,
        gender :gender,
        identity :identity,
        birthday :birthday
      };
      console.log(personParam);
      const _this = this;
      var personUrl =  "/user/"+localStorage.getItem("uid");
      Tools.ajax({
            url: personUrl,              //请求地址
            type: "POST",                       //请求方式
            data: personParam,        //请求参数
            dataType: "json",
            success: function (response, xml) {
                _this.loadUserInfo();
                var path = `/Me/`
                _this.showAlert("恭喜您～修改成功",path);
                var appInfo = eval('(' + response + ')');
            },
            fail:function(status){
              var path = `/Me/`
              _this.showAlert("很遗憾，修改失败，请联系服务商",path);
            }
        });
  },

  render(){
    let fields = [
      {
        label: 'Username',
        type: 'text',
        icon: 'person'
      },
      {
        label: 'Password',
        type: 'password',
        icon: 'info'
      },
      {
        label: 'Birth date',
        type: 'date',
        icon: 'refresh'
      }
    ];
    var headPic = this.state.headPic;
    var showSaveBtn = this.state.showSaveBtn;
    const header = (
      <Card.Child cover={headPic}>
      </Card.Child>
    );
	if(showSaveBtn){
		var showSaveBtnSty = '';
	}else{
		var showSaveBtnSty = 'none';
	}
	
    return(
      <View>
        <Container scrollable>
          <Group
            noPadded
          >
          <div className="me-card">
            <Card header={header} className="headerPic">
            </Card>
          </div>
          <div className="savePersonInfo" style={{display:showSaveBtnSty}} onClick={this.savePersonInfo}>
            保存<Icon name="save" style={{fontSize:"16px",marginLeft:"6px"}}></Icon>
          </div>
          </Group>

          <Group className="me-detail">

            <List>
                <List.Item
                  nested="input"
                  className="nickName"
                  >
                  <Field
                    label= '昵称'
                    type='text'
                    placeholder={this.state.nickname}
                    id="nickname"
					onChange={this.changeInfoCheck}
                  />
                </List.Item>
                <List.Item
                  nested="input">
                  <Field
                    label= '姓'
                    type='text'
                    id="lastName"
                    placeholder={this.state.lastName}
					onChange={this.changeInfoCheck}
                  />
                </List.Item>
                <List.Item
                  nested="input">
                  <Field
                    label= '名字'
                    type='text'
                    id="firstName"
                    placeholder={this.state.firstName}
					onChange={this.changeInfoCheck}
                  />
                </List.Item>
                {/* <List.Item
                  nested="input">
                  <Field
                    label= '性别'
                    type='text'
                    id="genderSelect"
                    placeholder={this.state.gender}
                  />
                </List.Item> */}

                <List.Item
                  nested="input">
                <Field
                  type="select"
                  label="性别"
                  id="gender"
                  ref="gender"
                  defaultValue={this.state.gender}
				  onChange={this.changeInfoCheck}
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="">保密</option>
                </Field>
                </List.Item>

                <List.Item
                  nested="input">
                  <Field
                    label= '身份证号'
                    type='text'
                    id='identity'
                    placeholder={this.state.identity}
					onChange={this.changeInfoCheck}
                  />
                </List.Item>
                <List.Item
                  nested="input">
                  <Field
                    label= '生日'
                    type='date'
                    icon= 'person'
                    id='birthday'
                    value={this.state.birthday}
                    placeholder={this.state.birthday}
					onChange={this.changeInfoCheck}
                  />
                </List.Item>
            </List>
        </Group>
			<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
				<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
			</Rodal>
        </Container>
      </View>
    )
  }
})
export default Me_Detail;
