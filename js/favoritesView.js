import React, {Component} from 'react'

var FavoritesView = React.createClass({
	componentWillMount: function() {
  			var self = this
    		this.props.favorites.on('sync',function() {self.forceUpdate()})
	},
	_switchToAll: function() {
			location.hash = "all"
		},
	render: function() {
	  			var etsyData = this.props.favorites
	  			return (
	  					<div className="mainContainer">
	  						<div className="header"> 	
						 		<a href="index.html#home/"><img className="etsyLogo" src="http://diytrunkshow.com/wp/wp-content/uploads/2012/11/etsy_logo_lg_rgb2-676x386.png"/></a>
							 	<ul className="headerList">
							 		<li className="headerListItem">Shop</li>
									<li className="headerListItem">Sell on Etsy</li>
									<li className="headerListItem">Register</li>
									<li id="signInButton" className="headerListItem">Sign In</li>	 
								</ul>		
							</div>
								<div className="headerImageContainer">
									<img className="headerImage" src="https://carpediem1115.files.wordpress.com/2013/12/rokit.jpg"/>
									<h1 className="tagline">Shop directly from people around the world.</h1>
									<div className="searchOptionsContainer">
										<input className="search" placeholder="Search for items or shops"/>
									</div>
								</div>
							<button className="viewAllButton" onClick={this._switchToAll}> View All </button>
							<EtsyList etsyList={this.props.favorites}/>
	  					</div>
	  				)
	  		}
})
var EtsyList = React.createClass({

  		_getEtsyItems: function(eachEtsyListing, i) {
  			return (
  				<EtsyListing key={i} etsyItem={eachEtsyListing} favoritesColl={this.props.etsyList} _updater={this._updater} />
  				)
  				
  		},
  		_updater: function() {
  			this.setState({
  				favoritesColl: this.state.etsyList
  			})
  		},
  	
  		render: function() {
  			var favoritesArray = this.props.etsyList.models
  			return (
  					<div className="etsyListContainer">
  					{favoritesArray.map(this._getEtsyItems)}
  					</div>
  				)
  		},
  		getInitialState: function() {
			return (
					{favoritesColl: this.props.etsyList}
				)
		}
  	})
var EtsyListing = React.createClass({
		_deleteFromFavorites: function() {
			this.props.etsyItem.set({favorite: false})
			this.props.favoritesColl.remove(this.props.etsyItem.attributes)
			this.props._updater()
		},
		render: function() {
			var stylesObj = {}
			if (this.props.etsyItem.get('favorite') === true) {
				stylesObj.backgroundColor = "red"
				stylesObj.color = "white"
			}
			return (
					<div className= "etsyItem">
						<img className="itemImage" src= {this.props.etsyItem.get('Images')[0].url_75x75} />
						<p className="title"> {this.props.etsyItem.get('title').substring(0,15)}</p>
						<p className="price"> {this.props.etsyItem.get('price')}</p>
						<button style={stylesObj} className="favoriteListing" onClick={this._deleteFromFavorites}>Favorite</button>

					</div>
			)
		}
	})

export default FavoritesView