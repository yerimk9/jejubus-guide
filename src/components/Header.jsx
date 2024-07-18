import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Header() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggingIn(!!user);

      if (user) {
        const usersCollection = collection(firestore, "users");
        const q = query(usersCollection, where("uid", "==", user.uid));

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUserNickname(userData.nickname);
        } else {
          console.log("User document not found for UID:", user.uid);
          setUserNickname("이름없음");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("로그아웃 되었습니다.");
        window.location.reload();
      })
      .catch((error) => {
        console.error("로그아웃 오류:", error.message);
      });
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <div className="flex items-center">
        <Link to={"/"}>
          <div className="text-2xl font-bold">JEJU BUS</div>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggingIn ? (
          <>
            <span>{userNickname} 님</span>
            <button onClick={handleLogout} className="btn">
              로그아웃
            </button>
          </>
        ) : (
          <Link to={"/login"} className="btn">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
