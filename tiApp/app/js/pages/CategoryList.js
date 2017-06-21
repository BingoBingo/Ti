import '../../style/cate.scss'
import React from 'react';
import {
  Container,
  List,
  NavBar,
  Group,
  View,
  Card,
  Loader,
  Icon
} from 'amazeui-touch';
import {
  Link
} from 'react-router';

import Tools from '../util/tools';



const CategoryList = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState(){
    //this.callWX();
    let userLng = localStorage.getItem("userLng") ? localStorage.getItem("userLng") : "0" ;
    let userLat = localStorage.getItem("userLat") ? localStorage.getItem("userLat") :"0";
    return({
      shopInfo:[],
      searchCount:"0",
      wxInfo:{},
      lat:userLat,
      lng:userLng,
      categoryList:"",
      userLng:userLng,
      userLat:userLat,
      hiddenLable:""
    })
  },

  renderCheckChildCate(id,getPid=false){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			for(var i=0;i<categoryList.length;i++){
				if(typeof(categoryList[i].pid) != 'undefined'){
					if(getPid!=false){
						if(categoryList[i].id==id){
							return categoryList[i].pid;
						}
					}else{

						var pid = categoryList[i].pid;
						if(pid != '' && typeof(pid) != 'undefined' && pid != 'undefined'){
							if(pid==id){
								return true;
								
							}
						}
					}
				}
			}
			return false;
		}
	}
  },
  renderGetCateName(cid){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			for(var i=0;i<categoryList.length;i++){
				if(categoryList[i].id==cid){
					return categoryList[i].name;
				}
			}
			return '全部分类';
		}
	}
  },
  renderGetCateId(code){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){
			for(var i=0;i<categoryList.length;i++){

				if(categoryList[i].code==code){
					return categoryList[i].id;
				}
			}
		}
	}
  },
  renderCategoryListBackUp(){
	var cid = this.props.location.query.cid;
	if(cid){
	var categoryPid = this.renderCheckChildCate(cid,'getPid');
		return(<li><Link to={{pathname:"CategoryList/",query:{cid:categoryPid}}}><i className="l-icon"></i><span className="txt">返回</span><i className="r-icon"></i></Link></li>);
	}
  },
  renderCategoryList(){
    var categoryList = this.state.categoryList;
	if(typeof(categoryList) != 'undefined' && categoryList !== ""){//By HeMuYu_Ray
		if(categoryList !== "" && categoryList.length > 0){

			var cid = this.props.location.query.cid;

			document.getElementById('categoryTitle').innerHTML = this.renderGetCateName(cid);


			return categoryList.map((item, index) => {
			  var cat_name = item.name ? item.name:"";
			  var id = item.id ? item.id:"";
			  var pid = item.pid ? item.pid:"";
			  var code = item.code ? item.code:"";
			  var isChild=true;
			  if(typeof(cid) != 'undefined' && cid !== "" && cid !== "undefined" && typeof(cid) !== null && cid !== 'null'){
				
				  if(pid==cid){
							var isChild=this.renderCheckChildCate(id);
							if(isChild==true){
								  return (

										<li id={id} key={index}><Link to={{pathname:"CategoryList/",query:{cid:id}}} key={index}><i className="l-icon"></i><span className="txt">{cat_name}</span><i className="r-icon"></i></Link></li>
								  );
							}else{
								  return (

										<li id={id} key={index}><Link to={{pathname:"StoreList/",query:{category:code}}} key={index}><i className="l-icon"></i><span className="txt">{cat_name}</span><i className="r-icon"></i></Link></li>
								  );
							
							}
				  }else if(cid==id){

									  return (

										<li id={id} key={index}><Link to={{pathname:"StoreList/",query:{category:code}}} key={index}><i className="l-icon"></i><span className="txt">全部{cat_name}</span><i className="r-icon"></i></Link></li>
								  );			  
				  }
			  }else{
				  if(pid==''){

					  return (

							<li id={id} key={index}><Link to={{pathname:"CategoryList/",query:{cid:id}}} key={index}><i className="l-icon"></i><span className="txt">{cat_name}</span><i className="r-icon"></i></Link></li>
					  );
				  }			  
			  
			  }
			});
		}
	}
  },
goBackUp(){
  var goBack = 1;
  if(this.props.location.query.goBack){
	var goBack = this.props.location.query.goBack;
  }
  history.go(-goBack);
},

  prevPathenameSave(){
	var _this = this;
    window.addEventListener("popstate", function(e) {

			localStorage.setItem("prevPathename",_this.props.location.pathname);

    }, false); 
  },
componentDidMount() {
  /*获取url的uid*/
  var _this = this;

	_this.prevPathenameSave();

  var url = "/shop/categories";
  Tools.ajax({
        url: url,              //请求地址
        type: "GET",                       //请求方式
        dataType: "json",
        success: function (response, xml) {

            var appInfo = eval('(' + response + ')');

            _this.setState({
              categoryList:appInfo.data,
              visible:false
            });
			  var category = localStorage.getItem("catCode");

			  if(category){
				var cid =_this.renderGetCateId(category);

				if(_this.renderCheckChildCate(cid)){
					var path = `/CategoryList?cid=`+cid+'&goBack=2';
					_this.context.router.push(path);
				}else{
					var pid = _this.renderCheckChildCate(cid,'getPid');

					var path = `/CategoryList?cid=`+pid+'&goBack=2';;
					_this.context.router.push(path);				
				}

			  }
        },
        fail: function (status) {

          console.log(status);
        }
    });

},

  render() {
    var lat = this.state.userLat;
    var lng = this.state.userLng;
    var uid = localStorage.getItem("uid");
      return (
        <View>
          <Container scrollable>

			<div className="categoryListBody">
				<div className="categoryTitle" id="categoryTitle">全部分类</div>
				<div className="categoryInfoList">
					<ul className="cleafix">{this.renderCategoryList()}
						{this.renderCategoryListBackUp()}
					
	
					</ul>

				</div>
			</div>
           
          </Container>
		  <div className="backUpBtn" onClick={this.goBackUp}></div>
        </View>
      );
  }
})
export default CategoryList;
