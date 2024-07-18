import React, { useRef } from "react";
import Header from "../components/Header";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore } from "../firebase";

function FindPasswordPage(props) {
  const emailRef = useRef();

  const findPassword = async (e) => {
    e.preventDefault();

    try {
      const usersCollection = firestore.collection("users");
      const querySnapshot = await usersCollection
        .where("email", "==", emailRef.current.value)
        .get();

      if (!querySnapshot.empty) {
        // 이메일이 존재할 때
        await sendPasswordResetEmail(auth, emailRef.current.value);
        alert("이메일을 확인해 주세요!");
      } else {
        // 이메일이 존재하지 않을 때
        alert("등록되지 않은 이메일입니다.");
      }
    } catch (error) {
      // Firebase 오류 처리
      console.error("Error finding password: ", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="notice-container">
      <Header />
      <div>
        <p>비밀번호 찾기</p>
        <div className="check">
          <div>
            <img
              src="https://www.nhcapital.co.kr/resource/pc/image/component/icon_notice.png"
              alt="checkImg"
              width={20}
              className="mt-1"
            />
          </div>
          <div>
            비밀번호 분실 시 본인 확인 절차를 거친 후 비밀번호 재설정 이메일을
            보내드립니다.
            <br />
            비밀번호 재설정 이메일을 받으신 경우, 이메일의 지시에 따라 새로운
            비밀번호를 설정해주시기 바랍니다.
            <br />
            <span className="text-sm text-[#707070]">
              {" "}
              참고 : 비밀번호 재설정 이메일이 수신되지 않는 경우, 이메일이 스팸
              폴더로 이동되었을 수 있습니다.
            </span>
          </div>
        </div>
      </div>
      <div className={`signup-container`}>
        <form onSubmit={findPassword}>
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
                  ref={emailRef}
                />
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="rectBtn">
              메일 보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindPasswordPage;
