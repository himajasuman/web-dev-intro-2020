import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import './header.css';

const Header = ({ siteTitle }) => (
  <header className="header">
    <div className="container">
      <h1>
        <Link to="/">
          {siteTitle}
        </Link>
      </h1>
      <span className="my-favs">
        My favs &nbsp;<i className="fa fa-heart"></i>
      </span>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
