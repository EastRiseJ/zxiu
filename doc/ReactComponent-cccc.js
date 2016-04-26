/**LayoutComponent beigin**/
var Tool={
	getJsonByString:function(_string){
		var p=_string.indexOf("(");
		return JSON.parse(_string.substring(p+1,_string.length-1));
	}
}
var LayoutComponent = React.createClass({
	render:function(){
		return(
			<div>
				<div id="container">
					<header>
						<HeaderComponent/>
					</header>
					<section>
						<SearchComponent/>
					</section>
					<div id="template">
						<section>
							<BannerComponent/>
						</section>
						<section>
							<ListComponent/>
						</section>
					</div>
				</div>
				<footer id="footer">
					<FooterComponent/>
				</footer>
			</div>
		)
	}
})
/**LayoutComponent end**/

/**HeaderComponent beigin**/
var HeaderComponent = React.createClass({
	render:function(){
		return(
			<div className="header">
				<div className="back"></div>
				<div className="font"></div>
				<div className="tool"></div>
			</div>
		)
	}
})
/**HeaderComponent end**/

/**SearchComponent beigin**/
var SearchComponent = React.createClass({
	render:function(){
		return(
			<div className="search">
				<div className="search-box">
					<img className="search-img" src="img/search-img.png" />
					<input type='text' className="search-input" placeholder="请输入搜索内容"/>
				</div>
			</div>
		)
	}
})
/**SearchComponent end**/

/**BannerComponent beigin**/
var BannerComponent = React.createClass({
	render:function(){
		return(
			<div className="list">
				<div className="swiper-container">
					<div className="swiper-wrapper">
						<div className="swiper-slide">
							<img className="slide-img" src="img/1.png" />
						</div>
						<div className="swiper-slide">
							<img className="slide-img" src="img/1.png" />
						</div>
						<div className="swiper-slide">
							<img className="slide-img" src="img/1.png" />
						</div>
					</div>
					<div className="swiper-pagination"></div>
				</div>
			</div>
		)
	},
	componentDidMount:function(){
		var mySwiper = new Swiper('.swiper-container',{
			loop:true,
			autoplay:2000,
			autoplayDisableOnInteraction:false,
			pagination:'.swiper-pagination'
		})
	}
})
/**BannerComponent end**/

/**ListComponent begin**/
var ListComponent = React.createClass({
	mixins:[Tool],
	getDefaultProps:function(){
		return{
			source:'http://datainfo.duapp.com/shopdata/getGoods.php'
		}
	},
	getInitialState:function(){
		return{
			result:[]
		}
	},
	componentWillMount:function(){
		
		var _this = this;
		$.ajax({
			type:"get",
			url:_this.props.source,
			async:true,
			success:function(callback){
				console.log("will mount");
                callback=_this.getJsonByString(callback);
				_this.setState({result:callback});
			}
		});
	},
	render:function(){
		var temp = [];
		this.state.result.map(function(item,index){
			temp.push(<ItemComponent name={item}/>)
		})
		return(
			<div className="listBox">
				{temp}
			</div>
		)
	}
})
var ItemComponent = React.createClass({
	render:function(){
		return(
			<div className="list-item">
				<div className="list-item-img">
					<img className="list-item-imgs" src={this.props.name.goodsListImg} />
				</div>
				<div className="list-item-desc">
					<div className="item-goods-name">
						<span className="item-goods-name-font">{this.props.name.goodsName}</span>
					</div>
					<div className="item-goods-detail">
						<div className="item-detail-price">
							<span className="item-now-price">¥ {this.props.name.price}</span>
							<span className="item-begin-price">¥28800</span>
							<div>
								<span className="item-discount">{this.props.name.discount}折</span>
							</div>
						</div>
						<div className="item-detail-btn">
							<img className="item-detail-btn-img" src="img/shopcar.png" />
						</div>
					</div>
				</div>
			</div>
		)
	}
})	
/**ListComponent end**/

/**TypeComponent begin**/
var TypeComponent = React.createClass({
	render:function(){
		return(
			<div>
				<span>这是type组件</span>
			</div>
		)
	}
})

/**TypeComponent end**/

/**FooterComponent begin**/

var FooterComponent = React.createClass({
	//实现组件切换的思路:
	//1.实际上就是在点击不停选项的时候，将原先页面中的组件卸载
	//2.然后将新页面中的组件重新载入，聚合，组成新页面
	//3.注意：组件无论是在被卸载还是被载入的时候，组件都保持本身独有的属性和功能
	
	//实现功能：点击type的时候，将新组件载入
	//声明新组件 将新组件放在固定位置
	handleClick:function(event){
		var _itemName = event.target.getAttribute('name');
//		console.log(_itemName);
		var _line = document.getElementsByClassName('line')[0];
		var _temp = document.getElementById("template");
		switch(_itemName){
			case 'index':
			_line.style.left = '0%';
			$('#template').children().remove();
			ReactDOM.render(
				<div>
					<section><BannerComponent/></section>
					<section><ListComponent/></section>
				</div>,_temp)
			break;
			case 'type':
			_line.style.left = '20%';
			$('#template').children().remove();
			ReactDOM.render(<TypeComponent/>,_temp)
			break;
			case 'shopcar':
			_line.style.left = '40%';
			break;
			case 'myshow':
			_line.style.left = '60%';
			break;
			case 'more':
			_line.style.left = '80%';
			break;
		}
	},
	render:function(){
		return(
			<div>
				<div className="footer">
					<div onClick={this.handleClick} name="index">
						<p className="bord" onClick={this.handleClick} name="index"></p>
						<p className="text" onClick={this.handleClick} name="index">首页</p>
					</div>
					<div onClick={this.handleClick} name="type">
						<p className="bord" onClick={this.handleClick} name="type"></p>
						<p className="text" onClick={this.handleClick} name="type">分类</p>
					</div>
					<div onClick={this.handleClick} name="shopcar">
						<p className="bord" onClick={this.handleClick} name="shopcar"></p>
						<p className="text" onClick={this.handleClick} name="shopcar">购物车</p>	
					</div>
					<div onClick={this.handleClick} name="myshow">
						<p className="bord" onClick={this.handleClick} name="myshow"></p>
						<p className="text" onClick={this.handleClick} name="myshow">我的秀</p>	
					</div>
					<div onClick={this.handleClick} name="more">
						<p className="bord" onClick={this.handleClick} name="more"></p>
						<p className="text" onClick={this.handleClick} name="more">更多</p>	
					</div>
				</div>
				<div className="line"></div>
			</div>
		)
	}
})

/**FooterComponent end**/
ReactDOM.render(<LayoutComponent/>,document.body);