// ReviewForm.jsx
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import personImg from "../assets/svgs/person.svg";

function ReviewForm({ isEditing, setIsEditing, initialText }) {
  const [reviewText, setReviewText] = useState("");
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    let unsubscribe;

    const getUserAndSubscribe = async () => {
      const user = await new Promise((resolve) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user);
        });
      });

      if (user) {
        const q = query(
          collection(firestore, "users"),
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserNickname(userDoc.data().nickname);
        } else {
          console.log("User document not found for UID:", user.uid);
          setUserNickname("이름없음");
        }
      } else {
        setUserNickname("");
      }
      setReviewText(initialText?.text || "");
    };

    getUserAndSubscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initialText]);

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleReviewSubmit = async () => {
    const user = auth.currentUser;

    try {
      if (user) {
        const reviewCollection = collection(firestore, "reviews");
        if (isEditing) {
          await updateDoc(doc(firestore, "reviews", initialText.id), {
            text: reviewText,
            timestamp: serverTimestamp(),
          });
          setIsEditing(false);
          alert("Review가 성공적으로 수정되었습니다.");
        } else {
          await addDoc(reviewCollection, {
            userId: user.uid,
            text: reviewText,
            nickname: userNickname,
            timestamp: serverTimestamp(),
          });
          alert("Review가 성공적으로 저장되었습니다.");
        }

        setReviewText("");
      } else {
        alert("로그인시에만 리뷰작성이 가능합니다ㅠㅠ");
        setReviewText("");
      }
    } catch (e) {
      console.log(e);
      alert("리뷰 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="reviewForm-container">
      <div className="userContainer">
        <img src={personImg} alt="personImg" width={80} />
        <div className="nickname">{userNickname}</div>
      </div>
      <div className="reviewContainer">
        <textarea
          className="reviewInput"
          value={reviewText}
          placeholder="버스 노선과 정류장에 대한 리뷰와 평가를 남겨주세요!!"
          onChange={handleTextChange}
        />
        <div className="btnContainer">
          <button
            className="rectBtn"
            type="submit"
            onClick={handleReviewSubmit}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewForm;
