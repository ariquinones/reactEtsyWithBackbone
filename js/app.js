// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'bbfire'
import FavoritesView from './favoritesView'


function app() {
    // start app
    // new Router()
  	var AppView = React.createClass({
  		componentWillMount: function() {
  			var self = this
    		this.props.jsonData.on('sync',function() {self.forceUpdate()})
		},
		_switchToFavorites: function() {
			location.hash = "favorites"
		},
  		render: function() {
  			var etsyData = this.props.jsonData
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
						<button className="viewFavoritesButton" onClick={this._switchToFavorites}> View Favorites </button>
						<EtsyList etsyList={this.props.jsonData} favoritesColl={this.props.favoritesColl}/>
  					</div>
  				)
  		}
  	})

  	var EtsyList = React.createClass({

  		_getEtsyItems: function(etsyArray) {
  				// console.log("EtsyList.render(): ", this.props.etsyList.models)
  				var newArr = []
  				var etsyArray = this.props.etsyList.models
  				for (var i = 0; i < etsyArray.length - 76; i++) {
  					var eachEtsyListing = etsyArray[i]
  					var component = <EtsyListing key={eachEtsyListing.cid} etsyItem={eachEtsyListing} favoritesColl={this.props.favoritesColl} _updater={this._updater}/>
  					newArr.push(component)
  				}
  				return newArr
  		},
  		_updater: function() {
  			this.setState({
  				favoritesColl: this.state.favoritesColl
  			})
  		},
  		render: function() {
  			var etsyListArray = this.props.etsyList.models
  			return (
  					<div className="etsyListContainer">
  						{this._getEtsyItems(etsyListArray)}
  					</div>
  				)
  		},
  		getInitialState: function() {
			return (
					{favoritesColl: this.props.favoritesColl}
				)
		}
  	})
	var EtsyListing = React.createClass({
		_addToFavorites: function() {
			this.props.etsyItem.set({favorite: true})
			this.props.favoritesColl.add(this.props.etsyItem.attributes)
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
						<button style={stylesObj} className="favoriteListing" onClick={this._addToFavorites}>Favorite</button>

					</div>
				)
		}

	})
	var FavoriteModel = Backbone.Model.extend({
		defaults: {
			"favorite": false
		}
	})
	var HomeCollection = Backbone.Collection.extend({
	// url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images'
	url: 'https://openapi.etsy.com/v2/listings/active.js?limit=250&offset=250&api_key=aavnvygu0h5r52qes74x9zvo&callback=?&includes=Images',
	parse: function(rawData) {
			return rawData.results
		}
	})
	var FavoritesCollection = Backbone.Firebase.Collection.extend({
		url: 'https://reactetsyremake.firebaseio.com/',
		model: FavoriteModel
	})
	var EtsyRouter = Backbone.Router.extend({
		routes: {
			"search/:searchQuery": "handleSearch",
			"favorites": "handleFavoritesView",
			"*default": "handleHomeView"
	},
	handleHomeView: function() {
		var newHomeCollection = new HomeCollection()
		newHomeCollection.fetch()
		DOM.render(<AppView jsonData={newHomeCollection} favoritesColl={new FavoritesCollection} />, document.querySelector('.container'))
		},
	handleFavoritesView: function() {
			var newFavoritesCollection = new FavoritesCollection()
			DOM.render(<FavoritesView favorites={newFavoritesCollection}/>, document.querySelector('.container'))
		},
	initialize: function() {
			Backbone.history.start()
		}
	})
	var rtr = new EtsyRouter()
}

app()