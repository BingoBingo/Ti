import React from 'react';
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

import ajax from '../util/ajax';

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


const Me_Phone_Change = React.createClass({

  contextTypes: {
        router: React.PropTypes.object.isRequired,
  },
  handerSubmit(event){
    event.preventDefault();
    var _this = this;
    const mobileNum = event.target.elements[0].value;
    const reg = new RegExp("^[0-9]*$");

    if(!reg.test(mobileNum)){
        _this.openModal;
    }else{
      ajax({
            url: "http://123.56.20.50/hotel-union-api/sms",              //请求地址
            type: "POST",                       //请求方式
            data: { mobile:mobileNum},        //请求参数
            dataType: "json",
            success: function (response, xml) {
                alert("success");
                var appInfo = eval('(' + response + ')')
                const path = `/Me_Phone_Code/`
                _this.context.router.push(path);
            },
            fail: function (status) {
              alert("faild");
              console.console.log(status);
            }
        });
    }
  },

  render() {
    return (
      <View>
        <Container scrollable>
          <Group>
          <h1>您的手机号</h1>
          <p>您已绑定18818033066,希望修改为</p>
          </Group>
          <form onSubmit={this.handerSubmit}>
            <Group>
              <List>
                <List.Item
                    nested="input"
                  >
                    <Field
                      label={null}
                      placeholder={'...'}
                      id="phoneNum"
                    />
                  </List.Item>
              </List>
            </Group>

            <Group className="phone-send-group">
                <Button hollow amStyle="success" className="phonesend-dis-btn">发送验证码</Button>
            </Group>

            <SubmitPhone
              title="Alert Modal"
              modalProps={{
                role: 'alert',
                title: 'Amaze UI',
              }}
              >
            </SubmitPhone>

          </form>
        </Container>
      </View>
    );
  }
})

export default Me_Phone_Input;
