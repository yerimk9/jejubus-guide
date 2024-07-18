import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import googleLoginImg from "../assets/svgs/googleLogin.svg";

function LoginPage() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // 사용자의 정보가 user안에 들어온다.
      console.log(user);

      // Check if user exists in Firestore
      const userRef = collection(firestore, "users");
      const querySnapshot = await getDocs(
        query(userRef, where("uid", "==", user.uid))
      );

      // If user doesn't exist, add to Firestore
      if (querySnapshot.empty) {
        await addDoc(userRef, {
          uid: user.uid,
          email: user.email,
          nickname: user.displayName,
        });
      }
    } catch (error) {
      console.error("Google 로그인 오류:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, [auth, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      setMessage("로그인에 실패하였습니다.");
    }
  };

  return (
    <div className="bg-[#f8f8fc]">
      <Header />
      <div className="notice-container h-screen">
        <div className="my-0 mx-auto">
          <p>로그인</p>
        </div>
        <div className="login-userContainer">
          <div>
            <button className="rectBtn googleBtn" onClick={login}>
              구글 로그인
            </button>
          </div>
          {/*  <div className="flex items-center">
            <button onClick={login} className="googleBtn">
              <img src={googleLoginImg} alt="googleBtn" />
              구글 로그인
            </button>
          </div> */}
          <div className="border-[1px] ml-[30px] md:ml-0"></div>
          <form onSubmit={handleLogin}>
            <div>
              <div className="flex items-center justify-center gap-5">
                <div className="flex flex-col gap-4">
                  <div className="inputBox">
                    <label htmlFor="email">이메일</label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="inputBox ">
                    <label htmlFor="password">비밀번호</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <button type="submit" className="rectBtn">
                  로그인
                </button>
              </div>
              {message && <div className="fail-message">{message}</div>}
              <div className="flex items-center justify-around gap-4">
                <div className="flex items-center gap-2">
                  이메일 / 비밀번호 규칙
                  <span className="tooltip" tabIndex="0">
                    <img
                      src={
                        "https://www.nhcapital.co.kr/resource/pc/image/icon/icon_tooltip.png"
                      }
                      alt="id, password rule"
                    />
                    <div>
                      <ul className="text-left">
                        <li>- 이메일은 유효한 형식이어야 합니다.</li>
                        <li>- 비밀번호는 최소 6자 이상 작성해주세요.</li>
                      </ul>
                    </div>
                  </span>
                </div>
                <Link to="/findPassword" type="button" className="btn">
                  비밀번호 찾기
                </Link>
              </div>
            </div>
            <Link to="/signup" className="signupLink-container">
              <div className="border-t-[1px] pt-[30px] mt-8">
                제주버스 회원가입
              </div>
              <div>[회원가입]을 통해 아이디와 비밀번호를 등록해주세요.</div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
