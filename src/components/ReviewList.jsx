// ReviewList.jsx
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { deleteDoc, doc, onSnapshot, collection } from "firebase/firestore";
import ReviewForm from "./ReviewForm";
import personImg from "../assets/svgs/person.svg";

function ReviewListItem({ review }) {
  const [initialText, setInitialText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = auth.currentUser;

  const handleEditClick = () => {
    if (currentUser && review.userId === currentUser.uid) {
      setInitialText(review);
      setIsEditing(true);
    } else {
      alert("해당 리뷰를 수정할 권한이 없습니다.");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (currentUser && review.userId === currentUser.uid) {
      const reviewRef = doc(firestore, "reviews", reviewId);
      try {
        await deleteDoc(reviewRef);
        alert("리뷰가 성공적으로 삭제되었습니다.");
      } catch (e) {
        console.error("리뷰 삭제 중 오류 : ", e);
        alert("리뷰 삭제 중 오류가 발생했습니다.");
      }
    } else {
      alert("해당 리뷰를 삭제할 권한이 없습니다.");
    }
  };

  return (
    <>
      {isEditing ? (
        <ReviewForm
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          initialText={initialText}
        />
      ) : (
        <div key={review.id} className="review-item">
          <div className="userContainer">
            <img src={personImg} alt="personImg" width={80} />
            <div className="nickname">{review.nickname}</div>
          </div>
          <div className="reviewContainer">
            <div className="content">
              <p>{review.date} </p>
              <p>{review.text}</p>
            </div>
            <div className="btnContainer">
              <button
                type="button"
                className="correctionBtn rectBtn"
                onClick={handleEditClick}
              >
                수정
              </button>
              <button
                type="button"
                className="rectBtn deleteBtn"
                onClick={() => handleReviewDelete(review.id)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "reviews"),
      (querySnapshot) => {
        const newReviews = [];
        querySnapshot.forEach((doc) => {
          const reviewData = doc.data();
          const date = reviewData.timestamp
            ? new Date(
                reviewData.timestamp.seconds * 1000 +
                  reviewData.timestamp.nanoseconds / 1000000
              )
            : new Date();

          const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
          const review = {
            id: doc.id,
            text: reviewData.text,
            nickname: reviewData.nickname,
            date: formattedDate,
            userId: reviewData.userId,
          };
          newReviews.push(review);
        });
        newReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews(newReviews);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="reviewList-container">
      {reviews.map((review) => (
        <ReviewListItem key={review.id} review={review} />
      ))}
    </div>
  );
}

export default ReviewList;
