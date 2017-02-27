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
import ajax from '../util/ajax';
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
    };
  }

  componentDidMount() {
    var personInfo = localStorage.getItem("personInfo");
    personInfo = JSON.parse(personInfo);

    console.log(personInfo.realName);
    this.setState({
      headPic:personInfo.headPic,
      realName:personInfo.realName,
      nickname:personInfo.nickname,
      gender:personInfo.gender,
      identity:personInfo.identity,
      birthday:personInfo.birthday,
      rank:personInfo.rank,
      favoriteCount: personInfo.favoriteCount,
      bindMobile: personInfo.bindMobile == false ? "未绑定":"已绑定",
      bindWechat: personInfo.bindWechat == false ? "未设置":"已设置",
      setPassword: personInfo.setPassword == false ? "未绑定":"已绑定"
    })
  }

  render() {
    const personhead = <img width="32" src={this.state.headPic} />;
    return (
      <View>

        <Container scrollable>

          <Group
          >

          <List>
            <List.Item className="me-name"
              media={personhead}
              title={this.state.realName}
              href="#Me_Detail"
            />
          <List.Item
              after={this.state.rank}
              title="等级经验"
              href="#Me_Rank"
            />
            <List.Item
              after={this.state.favoriteCount}
              title="收藏"
              href="#Collection"
            />
            <List.Item
              after={this.state.bindMobile}
              title="手机号"
              href="#Me_Phone_Input"
            />
            <List.Item
              after={this.state.setPassword}
              title="密码"
              href="#"
            />
            <List.Item
              after={this.state.bindWechat}
              title="微信"
              href="#"
            />
          </List>
        </Group>

        <Group className="user-change-group">
          <Button hollow amStyle="success" className="user-change-btn">切换账号</Button>
        </Group>
        </Container>
      </View>
    );
  }
}
