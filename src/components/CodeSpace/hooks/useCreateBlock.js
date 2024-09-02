import { useState } from 'react';
import axios from 'axios';

const useCreateBlock = () => {
  const [fileName, setFileName] = useState('');  // 파일 이름 상태
  const [showInput, setShowInput] = useState(false);  // 입력 필드 표시 여부

  const createNewBlock = () => {
    const token = sessionStorage.getItem('accessToken'); // 세션에서 토큰 가져오기

    axios.post('http://localhost:8080/api/v1/code-file', {
      problemId: "1000",
      name: fileName,
      content: "",
      language: "js"
    }, {
      headers: {
        Authorization: `Bearer ${token}`  // Bearer 토큰 설정
      }
    })
    .then(response => {
      console.log('File created successfully:', response.data);
      setShowInput(false); // 파일 생성 후 입력 필드 숨기기
      setFileName(''); // 입력 필드를 초기화
      // 추가 작업이 필요하면 여기에 추가
    })
    .catch(error => {
      console.error('Error creating file:', error);
    });
  };

  return {
    fileName,
    setFileName,
    showInput,
    setShowInput,
    createNewBlock
  };
};

export default useCreateBlock;
