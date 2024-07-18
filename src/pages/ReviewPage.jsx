import React from "react";
import Header from "../components/Header";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

function ReviewPage(props) {
  return (
    <div>
      <Header />
      <div className="container">
        <div>
          <ReviewForm />
        </div>
        <div>
          <ReviewList />
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
