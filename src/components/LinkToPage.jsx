import React from "react";
import { Link } from "react-router-dom";

function LinkToPage({ imgUrl, link, children }) {
  return (
    <Link to={link} className="linkToPage">
      {imgUrl && <img src={imgUrl} alt="img" width={50} />}

      {children}
    </Link>
  );
}

export default LinkToPage;
