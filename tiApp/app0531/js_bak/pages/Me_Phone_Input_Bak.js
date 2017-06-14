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
  Button
} from 'amazeui-touch';
import {
  Link,Router,Route,
} from 'react-router';

import ajax from '../util/ajax';
export default class Me_Phone_Input extends React.Component {
  static defaultProps = {
    transition: 'rfr'
  };
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  handerSubmit(){

    alert(1)
    // const {
    //   router
    // } = this.context;
    console.log(this.context);

    event.preventDefault()
    // const userName = event.target.elements[0].value
    // const repo = event.target.elements[1].value
    //const path = `/Me_Phone_Code/`
    this.context.router.push()
    alert(123);
  }

  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    this.setState({
        children: nextProps.children
    });
  }

  render() {

    return (
      <View>
        <Container scrollable>
          <Group>
          <h1>您的手机号</h1>
          <p>首次绑定手机号码获得35抵用券</p>
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
                    />
                  </List.Item>
              </List>
            </Group>
            <Group className="phone-send-group">
                <Button hollow amStyle="success" type="submit" className="phonesend-dis-btn">发送验证码</Button>
            </Group>
          </form>
        </Container>
      </View>
    );
  }
}

Me_Phone_Input.contextTypes = {
  router: React.PropTypes.object
};
