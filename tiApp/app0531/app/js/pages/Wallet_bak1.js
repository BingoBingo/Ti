import React from 'react';
import {
  Container,
  Group,
  Button,
  ButtonGroup,
  Modal,
  Field,
  List,
  Icon,
  Card,
  Accordion
} from 'amazeui-touch';


const ClubCard = React.createClass({
  getInitialState() {
    return {
      isModalOpen: false,
    };
  },

  openModal() {
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
    let role = this.getModalRole();

    // 确定和取消放在一起处理
    // data 为 true 时为 `确定`
    if (role === 'confirm') {
      console.log('你的选择是：「' + (data ? '确定' : '取消') + '」')
    } else if (role === 'prompt') {
      // `prompt` 类型支持通过返回值控制是否关闭 Modal

      // 点击取消时 data 的值为 null

      // 简单的验证逻辑
      // 仅适用于一个输入框的场景，多个输入框的 data 值为 `['', '', ...]`
      if (data === '') {
        console.error('赶紧交出来啊，不然...你懂的...');
        return false; // 点击确定时不关闭 Modal
      }

      console.log('输入的数据是：', data);
      return true; // 点击确定时关闭 Modal
    }
  },

  getModalRole() {
    return this.props.modalProps.role;
  },

  render() {
    return (
      <div>
        <List>
          <List.Item
            media={<Icon name="info"></Icon>}
            after="戳我"
            title="我的会员卡"
            onClick={this.openModal}
          />
        </List>

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

const Wallet = React.createClass({


  handleAction(data) {
    let role = this.getModalRole();

    // 确定和取消放在一起处理
    // data 为 true 时为 `确定`
    if (role === 'confirm') {
      console.log('你的选择是：「' + (data ? '确定' : '取消') + '」')
    } else if (role === 'prompt') {
      // `prompt` 类型支持通过返回值控制是否关闭 Modal

      // 点击取消时 data 的值为 null

      // 简单的验证逻辑
      // 仅适用于一个输入框的场景，多个输入框的 data 值为 `['', '', ...]`
      if (data === '') {
        console.error('赶紧交出来啊，不然...你懂的...');
        return false; // 点击确定时不关闭 Modal
      }

      console.log('输入的数据是：', data);
      return true; // 点击确定时关闭 Modal
    }
  },

  getModalRole() {
    return this.props.modalProps.role;
  },


  renderItems() {
      const pages = {
        "shopInfo":[
          {
        'hotelName':"",
        'hotelStatus':"住过",
        'hotelPrice':"100$",
        'hotelPlace':"丰台",
        'hotelPic':"../../i/wallet.jpg"
      }]
    };

      return pages.shopInfo.map((item, index) => {

      const header = (
      <Card.Child cover={require('../../i/wallet.png')}>
        <h3 className="card-title">
          {item.hotelName}
        </h3>
      </Card.Child>
      );
      return (
        <div className="me-card" key={index}>
          <Card header={header}>
          </Card>
        </div>
      );
    });
  },

  render() {
    return (
      <Container {...this.props}>
        <div className="wallet-header">
          <div className="wallet-title">我的钱包</div>
          <div className="wallet-kytitle">可用低用金</div>
          <div className="wallet-kymoney">¥100</div>
          <div className="wallet-sxmoney">本月将失效低用金100</div>
        </div>
        <List>
          <List.Item className="shareMoney"
            media={<Icon name="person"></Icon>}
            after="戳我"
            title="分享赚低佣金"
            href="#"
          />
        </List>
        <List>

          <ClubCard
            title="Popup Modal"
            modalProps={{
              role: 'popup',
              title: '我的会员卡',
            }}
          >
          <Card>
            <div>
              怎能就让这不停燃烧的心，
              就这样耗尽消失在平庸里。
            </div>
          </Card>
          <Card>
            <Accordion inset>

                  <Accordion.Item
                    title="卡片详情"
                  >
                    <p>
                      test
                    </p>
                  </Accordion.Item>
            </Accordion>
          </Card>
          </ClubCard>
          <List.Item
            media={<Icon name="compose"></Icon>}
            after="累计省钱128￥"
            title="交易记录"
            href="#"
          />
          <List.Item
            media={<Icon name="compose"></Icon>}
            after="累计省钱128￥"
            title="交易记录"
            href="#"
          />
          <List.Item
            media={<Icon name="compose"></Icon>}
            after="累计省钱128￥"
            title="交易记录"
            href="#"
          />
        </List>

      </Container>
    );
  }
});

export default Wallet;
