import React, { useEffect, useState } from 'react';
import './File.css';
import axios from 'axios';
import jSImage from 'assets/images/JS.png';

export default function File({ setSelectedCode }) {
  const [codeFiles, setCodeFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태 추가

  useEffect(() => {
    const fetchCodeFiles = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/v1/code-file', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodeFiles(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCodeFiles();
  }, []);

  const handleFileClick = (content) => {
    setSelectedCode(content);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);  // 드롭다운 상태 토글 함수
  
  return (
    <div className='file'>
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {isOpen ? '코드 파일 숨기기' : '코드 파일 보기'}
      </button>
      {isOpen && (  // isOpen 상태에 따라 목록을 보여주거나 숨김
        <ul>
          {codeFiles.map((codeFile) => (
            <li key={codeFile.name} onClick={() => handleFileClick(codeFile.content)}>
              <div className="fileNameDetail"> 
                <img src={jSImage} alt="JS Logo" style={{width: '14px'}} />
                <div>{codeFile.problemId ? codeFile.problemId : '0000'}번</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
