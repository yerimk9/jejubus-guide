import React from "react";

function Modal({ onConfirm, onCancel }) {
  return (
    <div className="modal-container">
      <div className="modal-intro">
        <div>위치정보 이용에 대한 엑세스 권한이 없어요</div>
        <div>
          위치기반 서비스 이용을 위해 위치정보 이용약관에 동의하겠습니까?
        </div>
      </div>
      <div className="modalBtn-container">
        <button type="button" onClick={onCancel}>
          취소
        </button>
        <button type="button" onClick={onConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}

export default Modal;
