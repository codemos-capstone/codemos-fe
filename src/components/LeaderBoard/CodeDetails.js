import React from 'react';
import Modal from 'react-modal';
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-ambiance";

Modal.setAppElement('#root');

const CodeEditorStyle = {
    width: "95%",
    height: "auto",
    maxHeight: "fit-content",
    border: "5px solid #3D3D3D",
    borderTop: "20px solid #3D3D3D",
};

const CodeDetails = ({ isOpen, onRequestClose, code }) => {  
    const handleAfterOpen = () => {
        document.body.style.overflow = 'hidden';  // 모달 열릴 때 스크롤 막음
    };
    
    const handleCloseModal = () => {
        document.body.style.overflow = 'auto';  // 모달 닫힐 때 스크롤 원래대로
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}  // isOpen 속성 추가
            onAfterOpen={handleAfterOpen}
            onRequestClose={handleCloseModal}
            className="custom-modal"
            overlayClassName="custom-modal-overlay"
        >
            <button onClick={handleCloseModal} style={{ padding: '10px', marginTop: '20px' }}>X</button>
            <br></br>
            <AceEditor
                style={CodeEditorStyle}
                id="ddd"
                mode="javascript"
                theme="ambiance"
                name="code-editor"
                fontSize="14px"
                value={code}
                showPrintMargin={false}
                showGutter={false}
                readOnly={true}   // 수정 불가 설정
            />
        </Modal>
    );
};

export default CodeDetails;
