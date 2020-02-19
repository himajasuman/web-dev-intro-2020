import React from "react";
import { Link } from "gatsby";
import queryString from 'query-string';
import Layout from "../components/layout";
import './restaurant.css';

class RestaurantPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    const res_id = queryString.parse(this.props.location.search).id;

    fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${res_id}`,  {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'user-key': '919a6002f8818a307f814ca1402a9ff2'
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        restaurantDetails: data
      });
    });
  }

  render() {

    return (
      <Layout>
      {
        this.state.restaurantDetails ?
        <div className="restraunt">
          <div className="restraunt-header">
            <img src={this.state.restaurantDetails.thumb}></img>
            <div>
              <h4>{this.state.restaurantDetails.name}</h4>
              <i></i>
              <p> {this.state.restaurantDetails.location.address} </p>
              <h5>{this.state.restaurantDetails.timings}</h5>
            </div>
            <span className="ratings">
              {this.state.restaurantDetails.user_rating.aggregate_rating}
            </span>
          </div>
          <div className="images">
            <h4>Images</h4>
            {
              this.state.restaurantDetails.photos.slice(0, 10).map(
                ({photo}, index) => (
                  <img key={`restaurant${index}`} src={photo.thumb_url}/>
                )
              )
            }
          </div>
        </div>
        : <div className="loading">
          <img src="https://icon-library.net//images/gif-loading-icon/gif-loading-icon-17.jpg" />
        </div>
      }
      <Link to="/">Go back to the homepage</Link>
      </Layout>
    )
  }
}

export default RestaurantPage
