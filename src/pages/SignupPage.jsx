import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
// createUserWithEmailAndPassword 함수는 이메일과 비밀번호를 사용하여 새로운 사용자를 생성, 등록된 사용자의 정보를 반환
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

function SignupPage(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    nickName: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  });

  // 공통된 onChange 핸들러 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!isEmailValid(formData.email)) {
      setError("유효하지 않은 이메일 주소입니다.");
      return;
    }

    if (formData.password !== formData.passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // addDoc() : Firestore 데이터베이스에 문서를 추가하는 함수
      // => 이 함수는 새로운 문서를 생성하고 지정된 데이터를 해당 문서에 저장합니다.
      await addDoc(collection(firestore, "users"), {
        uid: user.uid, // 현재 로그인한 사용자의 고유 식별자
        email: formData.email, // 사용자가 입력한 이메일
        nickname: formData.nickName, // 사용자가 입력한 닉네임
      });

      navigate("/login");
      alert("회원가입 성공:", user);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일 주소입니다.");
      } else {
        setError(`회원가입 실패: ${error.code} ${error.message}`);
      }
    }
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // 정규표현식을 사용하여 문자열을 검사하는 메서드
    // 주어진 정규 표현식(email)에 대해 문자열을 테스트하고, 해당 문자열이 정규 표현식과 일치하는지 여부를 Boolean 값으로 반환
  };

  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>제주버스 회원가입</p>
        <p>회원가입을 시작해보겠습니다.</p>
      </div>
      <div className={`signup-container n`}>
        <form onSubmit={handleSignup}>
          <div className="signup-inputBox">
            <label htmlFor="email">
              이메일
              <div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="이메일을 입력해주세요"
                  autoComplete="username"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </label>
          </div>
          <div className={`signup-inputBox`}>
            <label htmlFor="password">
              비밀번호
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </label>
          </div>
          <div className={`signup-inputBox`}>
            <label htmlFor="passwordCheck">
              비밀번호 확인
              <div>
                <input
                  id="passwordCheck"
                  name="passwordCheck"
                  type="password"
                  placeholder="비밀번호 확인"
                  autoComplete="current-password"
                  value={formData.passwordCheck}
                  onChange={handleInputChange}
                />
              </div>
            </label>
          </div>
          <div className={`signup-inputBox`}>
            <label htmlFor="nickName">
              닉네임
              <div>
                <input
                  id="nickName"
                  name="nickName"
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  value={formData.nickName}
                  onChange={handleInputChange}
                />
              </div>
            </label>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="rectBtn">
              가입하기
            </button>
          </div>
          {error && <p className={"error"}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
