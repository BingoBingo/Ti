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
  Button,
  Modal
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import Tools from '../util/tools';

const SubmitPhone = React.createClass({
  getInitialState() {
    return {
      isModalOpen: false,
    };
  },

  openModal() {
    const phoneNum = document.getElementById("phoneNum").value;
    alert(phoneNum)
    this.setState({
      isModalOpen: true,
    })
  },

  closeModal() {
    this.setState({
      isModalOpen: false,
    });
  },

  onOpen() {
    console.log('modal open....');
  },

  onClosed() {
    console.log('modal closed....');
  },

  handleAction(data) {

  },

  getModalRole() {
    return this.props.modalProps.role;
  },

  render() {
    return (
      <div>

        <Modal
          ref="modal"
          isOpen={this.state.isModalOpen}
          onDismiss={this.closeModal}
          onOpen={this.onOpen}
          onClosed={this.onClosed}
          onAction={this.handleAction}
          {...this.props.modalProps}
        >
          {this.getModalRole() !== 'loading' && this.props.children}
        </Modal>
      </div>
    );
  }
});


const Me_Phone_Input = React.createClass({
   defaultProps :{
		width           : 70,
		height          : 20,
		measure         : '%'

	},
  getInitialState(){
    return({
      phoneNotInput :"phonesend-dis-btn",
      bindOrNot:"none",
      mobileNum:"",
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
  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  handerSubmit(event){
    event.preventDefault();
    var _this = this;
    const phoneNum = document.getElementById("phoneNum").value;
    //const mobileNum = event.target.elements[0].value;
    localStorage.setItem("mobileNum",phoneNum);
    const reg = new RegExp("^[0-9]*$");
    var url = "/sms/";
    if(!reg.test(phoneNum)){
        _this.showAlert("请输入正确的电话号码");
        return false;
    }else{
      Tools.ajax({
            url: url,              //请求地址
            type: "POST",                       //请求方式
            data: { mobile:phoneNum},        //请求参数
            dataType: "json",
            success: function (response, xml) {
                console.log(response);
                var appInfo = eval('(' + response + ')')
                const path = `/Me_Phone_Code/`
                _this.showAlert("验证码发送成功",path);

            },
            fail: function (status) {
              _this.showAlert(status);
            }
        });
    }
  },

  componentDidMount(){
    var personInfo = localStorage.getItem("personInfo");
    personInfo = JSON.parse(personInfo);
    var bindMobile =  personInfo.bindMobile;
    var mobileNum = localStorage.getItem("mobileNum");
    console.log(bindMobile);
    if(bindMobile){
      this.setState({
        bindOrNot:"",
        mobileNum:mobileNum
      })
    }
  },

  changeBtn(e){
    //console.log(event.target.elements);
    //const mobileNum = event.target.elements[0].value;
    const phoneNum = document.getElementById("phoneNum").value;
    if(phoneNum != ""){
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
    var bindOrNot = this.state.bindOrNot;
    console.log(bindOrNot);
    return (
      <View>
        <Container scrollable>
          <div>
          <div className="home-mephone">您的手机号</div>
          <div className="bindPhone" style={{display:bindOrNot}}>您已绑定{this.state.mobileNum},您希望修改为</div>
          </div>
          <form onSubmit={this.handerSubmit}>
            <div className="phoneInputArea">
              <List className="phoneInput">
                <List.Item
                    nested="input"
                  >
                    <Field
                      label={null}
                      placeholder={'请输入手机号'}
                      id="phoneNum"
                      onChange={this.changeBtn}
                      type="number"
                    />
                  </List.Item>
              </List>
            </div>

            <div className="phone-send-group">
                <Button className={this.state.phoneNotInput}>发送验证码</Button>
            </div>

            <SubmitPhone
              title="Alert Modal"
              modalProps={{
                role: 'alert',
                title: 'Amaze UI',
              }}
              >
            </SubmitPhone>

          </form>
			<Rodal visible={this.state.visibleAlert} {...this.defaultProps} onClose={this.hideAlert} >
				<div id="showAlertContent" style={{textAlign: 'center',paddingTop: '30px'}}></div>
			</Rodal>
        </Container>
      </View>
    );
  }
})

export default Me_Phone_Input;
