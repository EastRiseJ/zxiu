/****
 * mixins:
 */

var Tool={
	getJsonByString:function(_string){
		var p=_string.indexOf("(");
		return JSON.parse(_string.substring(p+1,_string.length-1));
	},
	getUserByName : function(){
		var _localStorage = window.localStorage;
		var _name = _localStorage.getItem('userName');
		var flag ;
		if(_name){
			flag=true;
		}
		else{
			flag=false;
		}
		return flag;
	}
}
/* ********* LayoutComponent begin ********* */

var LayoutComponent = React.createClass({
	render : function(){
		return (
			<div>
				<div id="container">
					<header>
						<HeaderComponent/>
					</header>
					<div id="shopCarTemp">
						<section>
							<SearchComponent/>
						</section>
						<div id="template">
							<section>
								<BannerComponent/>
							</section>
							<section id="goods-list">
								<ListComponent/>
							</section>
						</div>
					</div>
				</div>
				<footer id="footer">
					<FooterComponent/>
				</footer>
			</div>
		);
	}
	
});

/* ********* LayoutComponent end ********* */

/* ********* HeaderComponent begin ********* */
var HeaderComponent = React.createClass({
	render : function(){
		return (
			<div className="header">
				<div className="back">
					
				</div>
				<div className="font" ></div>
				<div className="tool"></div>
			</div>
		);
	}
});


/* ********* HeaderComponent end ********* */


/* ********* SearchComponent begin ********* */
var SearchComponent = React.createClass({
	mixins :[Tool],
	getDefaultProps : function(){
		return {
			searchSource : 'http://datainfo.duapp.com/shopdata/selectGoodes.php'
		};
	},
	getInitialState:function(){
		return {
			searchRes :[]
		};
	},
//	handleClick : function(){
//		var _inputvalue = $('.tb-search').val();
//		console.log(encodeURI(_inputvalue));
//		var _this = this;
//		$.ajax({
//			type:'get',
////			url:_this.props.searchSource+'/s?selectText='+encodeURI(_inputvalue),
//			url:_this.props.searchSource+'?selectText='+encodeURI(_inputvalue),
//			aysnc:false,
//			success : function(data){
//				console.log(_this.getJsonByString(data));
//				var _res = _this.getJsonByString(data);
//				_this.setState({
//					searchRes : _res
//				});
//			}
//		});
//	},
	render : function(){
		return (
			<div className="search">
				<div className="search-box">
					<span className="search-img"></span>
					<input type="text" className="tb-search" placeholder="请输入搜索内容"/>
					<button id="btn_search" >搜索</button>
				</div>
			</div>
		);
	},
	componentDidMount : function(){
		
		var _this = this;
		var oBtn = document.getElementById('btn_search');
		oBtn.onclick = function(){
			var _inputvalue = $('.tb-search').val();
			console.log(encodeURI(_inputvalue));
			var _node =document.getElementById('template');
			_node.innerHTML = '';
			$.ajax({
				type:'get',
	//			url:_this.props.searchSource+'/s?selectText='+encodeURI(_inputvalue),
				url:_this.props.searchSource+'?selectText='+encodeURI(_inputvalue),
				aysnc:false,
				success : function(data){
					console.log(_this.getJsonByString(data));
					var _res = _this.getJsonByString(data);
					var searchResArr = [];
					_res.map(function(item,index){
						searchResArr.push(<ListItemComponent name={item} />);
					});
					ReactDOM.render(
						<div>
							{searchResArr}
						</div>,
						_node
					);
				}
			});
		}
	},
	//XXXXXXXXXXXXXXXXXXXX
//	componentDidUpdate : function(){
//		var _this = this;
//		$('.goods-list').eq(0).on('click','.item-goods-detail-shopcar',function(){
//			var _goodsid = $(this).attr('data-goodsid');
//			var _username = localStorage.getItem('userName');
//			var flag = _this.getUserByName();
//			console.log(flag);
//			if(flag){
//				$.ajax({
//					type:"post",
//					url:_this.props.updateCarUrl,
//					async:true,
//					data:{
//						userID:_username,
//						goodsID : _goodsid,
//						number : 1
//					},
//					success : function(data){
//						console.log(data);
//						alert('加入购物车成功！');
//					}
//				});
//			}else{
//				alert('请先登录！');
//			}
//		});
//	}
	
});


/* ********* SearchBoxComponent end ********* */

/* ********* BannerComponent begin ********* */
var BannerComponent = React.createClass({
	mixins:[Tool],
	getDefaultProps:function(){
		return {
			bannerSource : 'http://datainfo.duapp.com/shopdata/getBanner.php'
		}
	},
	getInitialState : function(){
		return {
			bannerResult :[]
		}
	},
	componentWillMount : function(){
		var _this = this;
		$.ajax({
			type:'get',
			url:_this.props.bannerSource ,
			async:false,
			success:function(data){
				var _res = _this.getJsonByString(data);
				_this.setState({
					bannerResult :_res
				});
			}
		});
	},
	render : function(){
		var bannerArr = [];
		this.state.bannerResult.map(function(item,index){
			bannerArr.push(<BannerItemComponent data-img={item}/>);
		});
		return (
			<div className="banner">
				<div className="swiper-container">
				  <div className="swiper-wrapper">
				   { bannerArr}
				  </div>
				   <div className="swiper-pagination"></div>
				</div>			
			</div>
		);
	},
	componentDidMount : function(){
		var indexSwiper = new Swiper('.banner .swiper-container',{
			pagination : '.banner .swiper-pagination',
			autoplay:5000,
			autoplayDisableOnInteraction:false,
			loop:true,
		});
	}
});
var BannerItemComponent = React.createClass({
	render :function(){
		var _img =JSON.parse(this.props['data-img'].goodsBenUrl)[0];
		return (
				 <div className="swiper-slide">
					<img src={_img}/>
				</div>
		);
	}
});

/* ********* SearchBoxComponent end ********* */

/* *********ListComponent begin ********* */
var ListComponent = React.createClass({
	mixins:[Tool],
	getDefaultProps : function(){
		return {
			getGoodsListUrl : 'http://datainfo.duapp.com/shopdata/getGoods.php',
			updateCarUrl:'http://datainfo.duapp.com/shopdata/updatecar.php'
		};
	},
	getInitialState : function(){
		return {
			goodsListResult:[]
		};
	},
	componentWillMount : function(){
		var _this = this;
		// 获取到商品列表
		$.ajax({
			type:"get",
			url:_this.props.getGoodsListUrl,
			async:false,
			success : function(data){
//				console.log(data);
				data=_this.getJsonByString(data);
				_this.setState({
					goodsListResult:data
				});
			}
		});
	},
	render: function(){
		var goodsListArr = [];
		this.state.goodsListResult.map(function(item,index){
			goodsListArr.push(<ListItemComponent name={item}/>);
		});
		return (
			<div className="goods-list">
				{goodsListArr}
			</div>
		);
	},
	componentDidMount:function(){
		var _this = this;
		$('.goods-list').eq(0).on('click','.item-goods-detail-shopcar',function(){
			var _goodsid = $(this).attr('data-goodsid');
			var _username = localStorage.getItem('userName');
			var flag = _this.getUserByName();
			console.log(flag);
			if(flag){
				$.ajax({
					type:"post",
					url:_this.props.updateCarUrl,
					async:true,
					data:{
						userID:_username,
						goodsID : _goodsid,
						number : 1
					},
					success : function(data){
						console.log(data);
						alert('加入购物车成功！');
					}
				});
			}else{
				alert('请先登录！');
			}
		});
	}
})


var ListItemComponent = React.createClass({
	render: function(){
//		console.log(this.props.name);
		return (
			<div>
				<div className="list-item">
					<div className="list-item-img">
						<img src={this.props.name.goodsListImg} />
					</div>	
					<div className="list-item-desc">
						<div className="item-goods-name">
							<span className="item-goods-name-font">
								{this.props.name.goodsName}
							</span>
						</div>
						<div className="item-goods-detail">
							<div className="item-goods-detail-left">
								<span className="item-goods-price">￥{this.props.name.price}</span>
								<span className="item-goods-old-price">￥{this.props.name[4]}</span>
								<div>
									<span className="item-discount">{this.props.name.discount}折</span>
								</div>
							</div>
							<div className="item-goods-detail-right">
								<img src="img/shopcar.png" data-goodsid={this.props.name.goodsID} className="item-goods-detail-shopcar" />
							</div>
							
						</div>
					</div>	
				</div>	
			</div>
		)
	}
});
/* *********ListComponent end ********* */

/****
 * 分类页面
 */
/* ********* TypeListComponent begin ********* */
var TypeHeaderComponent = React.createClass({
	render : function(){
		return (
			<div>
				<img src="img/jian.png" />
			</div>
		);
	}
});
var TypeListComponent = React.createClass({
	mixins:[Tool],
	getDefaultProps : function(){
		return {
			listurl:'http://datainfo.duapp.com/shopdata/getclass.php'
		};
	},
	getInitialState : function(){
		return {
			listResult : []
		};
	},
	componentWillMount : function(){
		var _this = this;
		$.ajax({
			type:'get',
			url:_this.props.listurl,
			async:false,
			dataType:'json',
			success : function(data){
//				data=_this.getJsonByString(data);
				_this.setState({
					listResult:data
				});
			}
			
		})
	},
	render : function(){
		var typeItemArr = [];
		this.state.listResult.map(function(item,index){
//			debugger;
			typeItemArr.push(<TypeItemComponent name={item}/>);
		});
		return (
			<div>
				<div className="type-list">
					<div className="type-list-title">
						全部
					</div>
					{typeItemArr}
				</div>
			</div>
		);
	}
});

var TypeItemComponent = React.createClass({
	
	render:function(){
		return (
			<div>
				<div className="type-list-item">
					{this.props.name.className}
				</div>
			</div>
		)
	}
});
/* ********* TypeListComponent end ********* */

/* *********ShopCarComponent begin ********* */
var ShopCarComponent = React.createClass({
	mixins : [Tool],
	getDefaultProps : function(){
		return {
			shopCarItemUrl : 'http://datainfo.duapp.com/shopdata/getCar.php',
			updateCarUrl : 'http://datainfo.duapp.com/shopdata/updatecar.php'
		}
	},
	getInitialState:function(){
		return {
			shopCarItemRetult : []
		};
	},
	componentWillMount : function(){
		var _this=this;
		var _userName = localStorage.getItem('userName');
		var flag = this.getUserByName();
		console.log();
		if(flag){
			$.ajax({
				type:'post',
				url:_this.props.shopCarItemUrl,
				async: false,
				data:{
					userID : _userName
				},
				success:function(data){
//					console.log(data);
					var _res = _this.getJsonByString(data);
					_this.setState({
						shopCarItemRetult : _res
					});
				}
			});
		}
		else{
			alert('请先登录！');
		}
			
	},
	shouldComponentUpdate :function(nextprops,nextstate){
		console.log(nextprops);
		console.log(this.props);
		console.log(nextprops===this.props);
		return !(nextprops===this.props);
	},
	render : function(){
//		console.log(this.state.shopCarItemRetult);
		var shopCatItemArr = [];
		this.state.shopCarItemRetult.map(function(item,index){
			shopCatItemArr.push(<ShopCarItemComponent data-cariteminfo={item}/>)
		});
		return (
			<div className="shopcarContent">
				<div className="shopcar-top">
					<span>
						商品数量:<span className="shopcar-goods-num">1</span>
						应付总额(不含运费):<span className="shopcar-goods-whole-price">￥199</span>
					</span>
				</div>
				<div className="shopcar-list">
					{shopCatItemArr}
				</div>
			</div>
		);
	},
	componentDidMount: function(){
		var _this = this;
		var _userName = localStorage.getItem('userName');
		$('.shopcarContent').on('click','.btn_dele',function(){
			var _goodsid = $(this).attr('data-goodsid');
			var _thisbtn = this;
			console.log('dele');
			var isDele = confirm('确认要删除此商品吗？');
			if(isDele){
				$.ajax({
					type:"post",
					url:_this.props.updateCarUrl,
					async:true,
					data:{
						userID : _userName,
						goodsID : _goodsid,
						number : 0
					},
					success :function(data){
//						console.log(data);
						if(data==='1'){
//							$('.shipCarTemp').eq(0).html('');
//							ReactDOM.render(<ShopCarComponent/>,document.getElementsByClassName('shopCarTemp')[0]);
							$(_thisbtn).parents('.shopcar-item').remove();
							alert('删除成功！');
						}else if(data==='0'){
							alert('删除失败！');
						}
					}
				});
			}
				
		});
	}
	
});

var EmptyCarCmponent = React.createClass({
	render : function(){
		return (
			<div className="empty-shopcar">
				<h3>
					您的购物车空空~
				</h3>
				<img src="img/no.png" className="empty-img" />
				<img src="img/go.png" className="btn_goshop" />
			</div>
		);
	}
});

var ShopCarItemComponent = React.createClass({
	render : function(){
		var _propsinfo = this.props['data-cariteminfo'];
		return (
					<div className="shopcar-item">
						<div className="shopcar-item-left">
							<img src={_propsinfo.goodsListImg} />
						</div>
						<div className="shopcar-item-mid">
							<p className="shopcar-item-name">
								{_propsinfo.goodsName}
							</p>
							<div>
								<span>单价：</span>
								<span className="shopcar-item-singlePrice">￥{_propsinfo.price}</span>
							</div>
							<div>
								<span>数量：</span>
								<span className="shopcar-item-numOption">
									<button className="shopcar-item-num-sub">-</button>
									<input type="text" className="shopcar-item-num" value={_propsinfo.number} />
									<button className="shopcar-item-num-add">+</button>
								</span>
							</div>
								
						</div>
						<div className="shopcar-item-right">
							<div className="shopcar-item-right-top">
								<img src="img/dustbin.png" data-goodsid={_propsinfo.goodsID} className="btn_dele" />
							</div>
							<div className="shopcar-item-right-bot">
								<span className="shopcar-item-size">L</span>
							</div>
						</div>
					</div>
		);
	}
});

var GoPayComponent =React.createClass({
	render : function(){
		return (
			<div>
				<img src="img/balan.png" className="btn_gopay" />
			</div>
		);
	}
});
/* *********ShopCarComponent end ********* */

/* *********RegistComponent begin ********* */
var RegistComponent = React.createClass({
	getDefaultProps : function(){
		return {
			registSource : 'http://datainfo.duapp.com/shopdata/userinfo.php'
		}
	},
	render : function(){
		return (
			<div className="regist-content">
				<input type="text" name="userName" className="userName" placeholder="帐号" />
				<input type="password" name="userpwd" className="userpwd" placeholder="密码" />
				<input type="password" name="userpwd2" className="userpwd2" placeholder="重复密码" />
				<button className="btn_regist">同意服务协议并注册</button>
			</div>
		);
	},
	componentDidMount : function(){
		var _this = this;
		$('.regist-content').eq(0).on('click','.btn_regist',function(){
			console.log('click');
			var _username = $('.userName').eq(0).val();
			var _userpwd = $('.userpwd').eq(0).val();
			$.ajax({
				type:"post",
				url:_this.props.registSource,
				async:true,
				data:{
					status : 'register',
					userID : _username,
					password:_userpwd
				},
				success : function(data){
//					console.log(data);
					switch(data){
						case '0' : 
							alert('此帐号已存在！');
						break;
						case '1' : 
							alert('注册成功，快去登录吧！');
						break;
						case '2' :
							alert('注册失败，可能数据库爆炸了！');
						break;
						default: 
						break;
					}
				}
				
			});
		});
	}
	
});
var GoLoginComponent =React.createClass({
	render : function(){
		return (
			<div>
				<img src="img/logina.png" className="btn_gologin" />
			</div>
		);
	},
	componentDidMount : function(){
		
		$('.btn_gologin').click(function(){
			var _node = document.getElementById('shopCarTemp');
			var _back = document.getElementsByClassName('back')[0];
			var _tool = document.getElementsByClassName('tool')[0];
			var _username = localStorage.getItem('userName');
			_back.innerHTML='';
			_tool.innerHTML='';
			ReactDOM.render(<TypeHeaderComponent/>,_back);
			ReactDOM.render(<GoRegistComponent/>,_tool);
			ReactDOM.render(<LoginComponent/>,_node);
		});
	}
});
/* *********RegistComponent end ********* */

/* *********LoginComponent begin ********* */
var LoginComponent = React.createClass({
	getDefaultProps : function(){
		return {
			registSource : 'http://datainfo.duapp.com/shopdata/userinfo.php'
		}
	},
	render : function(){
		return (
			<div className="login-content">
				<input type="text" name="userName" className="userName" placeholder="帐号" />
				<input type="password" name="userpwd" className="userpwd" placeholder="密码" />
				
				<label for="cb_rem" className="remeber-box">
					<input type="checkbox" id="cb_rem"/> 记住密码
				</label>
				<a href="javascript:;" className="btn_rem">忘记密码？</a>
				<button className="btn_login">登录</button>
			</div>
		);
	},
	componentDidMount : function(){
		var _this = this;
		$('.login-content').eq(0).on('click','.btn_login',function(){
			console.log('click');
			var _username = $('.userName').eq(0).val();
			var _userpwd = $('.userpwd').eq(0).val();
			$.ajax({
				type:"post",
				url:_this.props.registSource,
				async:true,
				data:{
					status : 'login',
					userID : _username,
					password:_userpwd
				},
				success : function(data){
//					console.log(data);
					switch(data){
						case '0' : 
							alert('此帐号不存在！');
						break;
						case '2' :
							alert('帐号密码有误！');
						break;
						default: 
							alert('登录成功！');
							console.log(data);
							localStorage.setItem('userName',_username);
							localStorage.setItem('userpwd',_userpwd);
//							localStorage.removeItem()
						break;
					}
				}
				
			});
		});
	}
	
});

var GoRegistComponent =React.createClass({
	render : function(){
		return (
			<div>
				<img src="img/reg.png" className="btn_goregist" />
			</div>
		);
	},
	componentDidMount : function(){
		$('.btn_goregist').click(function(){
			var _node = document.getElementById('shopCarTemp');
			var _back = document.getElementsByClassName('back')[0];
			var _tool = document.getElementsByClassName('tool')[0];
			var _username = localStorage.getItem('userName');
			_back.innerHTML='';
			_tool.innerHTML='';
			ReactDOM.render(<TypeHeaderComponent/>,_back);
			ReactDOM.render(<GoLoginComponent/>,_tool);
			ReactDOM.render(<RegistComponent/>,_node);
		});
	}
});

/* *********LoginComponent end ********* */

/* *********MyShowComponent begin ********* */
var MyShowComponent = React.createClass({
	mixins : [Tool],
	getDefaultProps:function(){
		return {
			userInfoUrl : 'http://datainfo.duapp.com/shopdata/getuser.php'
		};
	}, 
	getInitialState:function(){
		return {
			userInfoRes :[]
		};
	},
//	shouldComponentUpdate:function(nextprops,nextstate){
//		console.log(nextprops===this.props);
//	},
	componentWillMount : function(){
		var _this = this;
		var flag = this.getUserByName();
		if(flag){
			var userID = localStorage.getItem('userName');
			$.ajax({
				type:"post",
				url:_this.props.userInfoUrl,
				async:false,
				data:{
					userID : userID
				},
				success : function(data){
					var _res = _this.getJsonByString(data);
					console.log(_res);
					_this.setState({
						userInfoRes:_res
					});
				}
			});
		}else{
			_this.setState({
				userInfoRes:[{
					userID : '未知'
				}]
			});
		}
		
	},
	render :function (){
//		console.log(this.state.userInfoRes[0]);
//		var _userID = this.state.userInfoRes[0].userID?  this.state.userInfoRes[0].userID:'未知';
		return (
			<div className="myshow-box">
				<div className="myshow-top">
					<div className="myshow-top-left">
						<img src="img/head.png" />
					</div>
					<div className="myshow-top-right">
						<h3>
							昵称:<span className="myshow-username">{this.state.userInfoRes[0].userID}</span>
						</h3>
						<img src="img/login.png" name='gologin' className="btn_gologin"/>
						<img src="img/register.png" name='goregist' className="btn_goregist"/>
					</div>
				</div>
				<div className="myshow-list">
					<ul className="myshow-list-ul">
						<li>
							<a href="javascript:;">我的订单</a>
							<img src="img/23.png" />
						</li>
						<li>
							<a href="javascript:;">我的优惠券</a>
							<img src="img/23.png" />
						</li>
						<li>
							<a href="javascript:;">浏览记录</a>
							<img src="img/23.png" />
						</li>
						<li className="li-noborder">
							<a href="javascript:;">我的收藏</a>
							<img src="img/23.png" />
						</li>
					</ul>
				</div>
			</div>
		);
	},
	componentDidMount : function(){
		$('.myshow-box').on('click','img',function(){
			var _node = document.getElementById('shopCarTemp');
			var _back = document.getElementsByClassName('back')[0];
			var _tool = document.getElementsByClassName('tool')[0];
			var _username = localStorage.getItem('userName');
			_back.innerHTML='';
			_tool.innerHTML='';
			if($(this).attr('name')==='gologin'){
				ReactDOM.render(<TypeHeaderComponent/>,_back);
				ReactDOM.render(<GoRegistComponent/>,_tool);
				ReactDOM.render(<LoginComponent/>,_node);
			}else if($(this).attr('name')==='goregist'){
				ReactDOM.render(<TypeHeaderComponent/>,_back);
				ReactDOM.render(<GoLoginComponent/>,_tool);
				ReactDOM.render(<RegistComponent/>,_node);
			}
			
		});
	}
});


/* *********MyShowComponent end ********* */




/* *********FooterComponent begin ********* */
var FooterComponent = React.createClass({
	handleClick : function(evt){
		var _itemName = evt.target.getAttribute('name');
//		console.log(evt.target);
		var _this= this;
		var oLine = $('.line').eq(0);
		var _node = document.getElementById('shopCarTemp');
		var _back = document.getElementsByClassName('back')[0];
		var _tool = document.getElementsByClassName('tool')[0];
		var _username = localStorage.getItem('userName');
		_back.innerHTML='';
		_tool.innerHTML='';
		$('#shopCarTemp').children().remove();
		switch(_itemName){
			case 'index' :
			oLine.css({
				left:'0'
			});
			
			ReactDOM.render(
				<div>
					<section>
						<SearchComponent/>
					</section>
					<div id="template">
						<section>
							<BannerComponent/>
						</section>
						<section id="goods-list">
							<ListComponent/>
						</section>
					</div>
				</div>,_node);
			break;
			case 'type' :
			oLine.css({
				left:'20%'
			});
			ReactDOM.render(<TypeHeaderComponent/>,_back);
			ReactDOM.render(
				<div>
					<section>
						<SearchComponent/>
					</section>
					<div id="template">
						<TypeListComponent/>
					</div>
				</div>
				
			,_node);
			break;
			case 'car' :
			oLine.css({
				left:'40%'
			});
			
			
			
			ReactDOM.render(<TypeHeaderComponent/>,_back);
			ReactDOM.render(<GoPayComponent/>,_tool);
			ReactDOM.render(<ShopCarComponent/>,_node);
			break;
			case 'myShow' :
			oLine.css({
				left:'60%'
			});
			ReactDOM.render(<TypeHeaderComponent/>,_back);
			ReactDOM.render(<MyShowComponent/>,_node);
			break;
			case 'more' :
			oLine.css({
				left:'80%'
			});
			break;
			default:
			break;
		}
		return false;
	},
	render : function(){
		return (
			<div className="footer-box">
				<div className="footer">
					<div name="index" onClick={this.handleClick}>
						<div className="footer-top" name="index" onClick={this.handleClick}>
							<img src="img/home.png"  name="index" onClick={this.handleClick} />
						</div>
						<div className="footer-bottom" name="index" onClick={this.handleClick}>
							首页
						</div>
					</div>
					<div name="type" onClick={this.handleClick}>
						<div className="footer-top" name="type" onClick={this.handleClick}>
							<img src="img/menu.png" name="type" onClick={this.handleClick} />
						</div>
						<div className="footer-bottom" name="type" onClick={this.handleClick} >
							分类
						</div>						
					</div>
					<div name="car" onClick={this.handleClick}>
						<div className="footer-top" name="car" onClick={this.handleClick}>
							<img src="img/car.png" name="car" onClick={this.handleClick} />
						</div>
						<div className="footer-bottom" name="car" onClick={this.handleClick}>
							购物车
						</div>	
					</div>
					<div name="myShow" onClick={this.handleClick}>
						<div className="footer-top" name="myShow" onClick={this.handleClick}>
							<img src="img/p.png" name="myShow" onClick={this.handleClick} />
						</div>
						<div className="footer-bottom" name="myShow" onClick={this.handleClick}>
							我的秀
						</div>	
					</div>
					<div name="more" onClick={this.handleClick} name="more" onClick={this.handleClick}>
						<div className="footer-top" name="more" onClick={this.handleClick}>
							<img src="img/more.png" name="more" onClick={this.handleClick} />
						</div>
						<div className="footer-bottom" name="more" onClick={this.handleClick}>
							更多
						</div>	
					</div>
					<span className="line"></span>
				</div>
			</div>
		);
	}
});

/* *********FooterComponent end ********* */






ReactDOM.render(<EmptyCarCmponent/>,document.body); // LayoutComponent ShopCarComponent LoginComponent








