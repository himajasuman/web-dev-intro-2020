import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import './index.css';
import restaurantsData from '../data/restaurants';
import fetch from 'node-fetch';

const RestrauntList = ({ restaurants, onClickHandler, favs }) => {
  return (
    restaurants ? <div className="restaurant-list">
      {restaurants.map(({restaurant}) => (
        <div className="restaurant-container" key={`restaurant${restaurant.id}`}>
          <span className="user-rating">{restaurant.user_rating.aggregate_rating}</span>
          <Link to={`/restaurant/?id=${restaurant.id}`}>
            <img src={restaurant.thumb} />
          </Link>
          <p>
            {restaurant.name}
            <i 
              onClick={() => onClickHandler(restaurant.id)} 
              className={`fa fa-heart ${favs.indexOf(restaurant.id) > -1 ? 'selected' : ''}`}
            ></i>
          </p>
        </div>
      ))}
    </div> : null
  )
}

class IndexPage extends React.Component {
  constructor() {
    super();

    this.state = {
      restaurants: restaurantsData.restaurants,
      locationSearchText: '',
      favs: []
    };
  }

  handleOnChange(evt) {
    this.setState({
      locationSearchText: evt.target.value
    });
  }
  
  getLocationLatLong(locationSearchText) {
    console.log(locationSearchText)
    fetch(`https://us1.locationiq.com/v1/search.php?key=fc9689585e40dd&q=${locationSearchText}&format=json`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        location: {
          lat: data[0].lat,
          lon: data[0].lon
        }
      })

      this.getRestaurants(data[0].lat, data[0].lon);
      console.log(data);
    });
  }

  addToFavs(res_id) {
    const resIndex = this.state.favs.indexOf(res_id);
    let favs = [];

    if (resIndex > -1) {
      this.state.favs.splice(resIndex, 1);

      favs = [...this.state.favs];

      console.log(favs)
    } else {
      favs = [...this.state.favs, res_id]
    }

    this.setState({
      favs: favs
    });
  }

  getRestaurants(lat, lon) {
    const searchApi = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lon}&entity_type=landmark&radius=100`;
    console.log(searchApi);
    try {
      fetch(searchApi, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'user-key': '919a6002f8818a307f814ca1402a9ff2'
        }
      })
      .then(res => res.json())
      .then(data =>{
        console.log(data.restaurants)
        this.setState({
          restaurants: data.restaurants
        });
      })
    } catch(e) {
      console.log(`Error getting restaurants: ${e}`);
    }
    
  }

  handleOnClick() {
    this.getLocationLatLong(this.state.locationSearchText);
  }

  render() {
    return (
      <Layout>
        <div className="location-search">
          <input placeholder="Enter the location" onChange={(evt) => this.handleOnChange(evt)}/>
          <button onClick={(evt) => this.handleOnClick(evt)}>Search</button>
        </div>
        { this.state.restaurants
          ? <RestrauntList onClickHandler={(id) => this.addToFavs(id)} restaurants={this.state.restaurants} favs={this.state.favs} />
          : <div>
            <img src="https://images.unsplash.com/photo-1551290464-66719418ca54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1510&q=80" />
          </div>
        }
        { this.state.loading && <div className="loading">
            <img src="https://icon-library.net//images/gif-loading-icon/gif-loading-icon-17.jpg" />
          </div>
        }
      </Layout>
    )
  }
}

export default IndexPage
