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

import Tools from '../util/tools';



const Me_Rank = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  handerSubmit(event){
    event.preventDefault()
    const keyword = event.target.elements[0].value;
    const path = `/SearchResult`;
    localStorage.setItem("keyword",keyword);
    this.context.router.push({
      pathname: path,
      query: { keyword: keyword
             }
      });
  },

  renderHistory(){
      var searchHistory = localStorage.getItem("histories");
      searchHistory = eval("("+searchHistory+")");
      console.log(searchHistory);
      if(searchHistory !== "" && searchHistory.length > 0){
          return searchHistory.map((item, index) => {
            return (
                <dt key={index}>{item}</dt>
            );
          });
    }
  },
  render() {
      return (
        <View>
          <Container scrollable>
            <Group>
            </Group>
            <form onSubmit={this.handerSubmit}>
              <Group>
                <List>
                  <List.Item
                      nested="input"
                      className="search-list"
                    >
                      <Field
                        label={null}
                        placeholder={'...'}
                        className="search-box"
                      />
                    </List.Item>
                </List>
                <dl>
                  <dt><a href="http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:39.96554,116.26719;title:成都;addr:北京市海淀区复兴路32号院|coord:39.87803,116.19025;title:成都园;addr:北京市丰台区射击场路15号北京园博园|coord:39.88129,116.27062;title:老成都;addr:北京市丰台区岳各庄梅市口路西府景园六号楼底商|coord:39.9982,116.19015;title:北京园博园成都园;addr:北京市丰台区园博园内&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp" target="_blank">附近</a></dt>
                  {this.renderHistory()}
                </dl>
              </Group>

            </form>
          </Container>
        </View>
      );
  }
})
export default Me_Rank;
