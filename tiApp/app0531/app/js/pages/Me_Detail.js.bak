import React from 'react';
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
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  getInitialState(){
    return({
      headPic: "",
      nickname: "",
      realName: "",
      gender: "",
      identity: "",
      birthday: "",
      headPic:"",
      firstName:"",
      lastName:""
    })
  },

  componentDidMount(){
    var personInfo = localStorage.getItem("personInfo");
    personInfo = JSON.parse(personInfo);
    var gender = "";
    if(personInfo.gender == "male"){
      gender = "男";
    }else if(personInfo.gender == "female") {
      gender = "女";
    }else {
      gender = "";
    }
    this.setState({
      realName:personInfo.lastName + personInfo.firstName,
      nickname:personInfo.nickname,
      gender:gender,
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
                hotelInfo:appInfo.data.hotelInfo,
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
       alert("身份证输入不合法");
       return  false;
   }
 },
  savePersonInfo(){
      //const phoneCode= event.target.elements[0].value;
      var nickname = document.getElementById("nickname").value == "" ? this.state.nickname :document.getElementById("nickname").value;
      //var realName = document.getElementById("realName").value == "" ? this.state.realName :document.getElementById("realName").value;
      var gender = document.getElementById("gender").value == "" ? this.state.gender :document.getElementById("gender").value;
      var identity = document.getElementById("identity").value == "" ? this.state.identity :document.getElementById("identity").value;
      var birthday = document.getElementById("birthday").value == ""? this.state.birthday :document.getElementById("birthday").value;
      var firstName = document.getElementById("firstName").value == "" ? this.state.realName :document.getElementById("firstName").value;
      var lastName = document.getElementById("lastName").value == "" ? this.state.realName :document.getElementById("lastName").value;
      if(gender == "男"){
        gender = "male"
      }else if(gender == "女"){
        gender = "female"
      }else{
        gender = ""
      }
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(reg.test(identity) === false)
      {
          alert("身份证输入不合法");
          return  false;
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
                alert("恭喜您～修改成功");
                var appInfo = eval('(' + response + ')');
                _this.context.router.push(path);
            },
            fail:function(status){
              var path = `/Me/`
              alert("很遗憾，修改失败，请联系服务商");
              _this.context.router.push(path);
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
    const header = (
      <Card.Child cover={headPic}>
      </Card.Child>
    );
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
          <div className="savePersonInfo" onClick={this.savePersonInfo}>
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
                  />
                </List.Item>
                <List.Item
                  nested="input">
                  <Field
                    label= '姓'
                    type='text'
                    id="lastName"
                    placeholder={this.state.lastName}
                  />
                </List.Item>
                <List.Item
                  nested="input">
                  <Field
                    label= '名字'
                    type='text'
                    id="firstName"
                    placeholder={this.state.firstName}
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
                  defaultValue="male"
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
                  />
                </List.Item>
            </List>
        </Group>
        </Container>
      </View>
    )
  }
})
export default Me_Detail;
