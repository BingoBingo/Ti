import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Grid,
  Col
} from 'amazeui-touch';
import {
  Link,
} from 'react-router';
import Tools from '../util/tools';

const Me_Rank = React.createClass({

  getInitialState() {
    return {
      isModalOpen: false,
      // number:"",
      // totalNumber:"",
      // description:"",
      // dateCreated:""
      rankInfo:[],
      rank:"",
      expNumber:"",
      nextRank:"",
      givePointNumber:"",
      nextExpNumber:""
    };
  },


  componentDidMount() {
    var _this = this;
    var rankUrl = "/user/" + localStorage.getItem("uid") + "/exp_records";
    console.log(rankUrl);
    var personInfo = localStorage.getItem("personInfo");
    personInfo = eval("("+personInfo+")");
    _this.setState({
      rank : personInfo.rank,
      expNumber: personInfo.expNumber,
      nextRank: personInfo.nextRank,
      givePointNumber:personInfo.givePointNumber,
      nextExpNumber:personInfo.nextExpNumber
    })

    Tools.ajax({
          url: rankUrl,              //请求地址
          type: "GET",                       //请求方式
          // data: { name: "super", age: 20 },        //请求参数
          dataType: "json",
          success: function (response, xml) {
              var rankInfo = eval('(' + response + ')')
              console.log(rankInfo);
              _this.setState({
                rankInfo:rankInfo.data.items,
                visible:false
              })
          },
          fail: function (status) {
            console.log(status);
          }
      });
  },

renderMyRank(){
  console.log(this.state.rankInfo);
  const rankInfo = this.state.rankInfo

  if(rankInfo.length >0){
    return(
      <div>
        {rankInfo.map(function(item, i) {
          var photo = item.path + "/" + item.name;
          return (
            <div className="rank-list" key={i}>
              <Grid>
                <Col cols={2}><div className="rank-title">{item.description}</div></Col>
                <Col cols={3}><div className="rank-date">{item.dateCreated}</div></Col>
                <Col cols={1}><div className="rank-add">{item.number}</div></Col>
              </Grid>
            </div>
          );
        })}
        <div className="nomore text-center">
          <span>没有更多...</span>
        </div>
      </div>
    )
  }else {
    return(
      <div className="noRankInfo">您暂无等级经验~</div>
    )
  }

},

render() {
      return (
        <View>
          <Container scrollable>
            <Group
          >
          <div>
            <div className="rankLevel">
            <span className="levelNum">{this.state.rank}</span>
            <span className="expNumber">经验值{this.state.expNumber}</span>
            </div>

            <div className="rankProcess">
            <span className="nextRank">距离{this.state.nextRank}:还差{this.state.nextExpNumber}</span>
            <span className="givePointNumber">即将活动低佣金:{this.state.givePointNumber}</span>
            </div>
          </div>
          {this.renderMyRank()}
          </Group>
          </Container>
        </View>
      );
  }
});

export default Me_Rank;
