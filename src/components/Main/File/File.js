import React, { useEffect, useState } from 'react';
import './File.css';
import axios from 'axios';
import jSImage from 'assets/images/JS.png';

export default function File({ setSelectedCode }) {
  const [codeFiles, setCodeFiles] = useState([]);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [isProblemsOpen, setIsProblemsOpen] = useState(false);

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

  const toggleFileDropdown = () => {
    setIsFileOpen(!isFileOpen);
  };

  const toggleProblemsDropdown = () => {
    setIsProblemsOpen(!isProblemsOpen);
  };

  return (
    <div className='file'>
      <ul>
        <li>
          <button onClick={toggleFileDropdown} className={`dropdown-toggle ${isFileOpen ? 'open' : ''}`}>
            {isFileOpen ? 'File' : 'File'}
          </button>
          {isFileOpen && (
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
        </li>
        <li>
          <button onClick={toggleProblemsDropdown} className={`dropdown-toggle ${isProblemsOpen ? 'open' : ''}`}>
            {isProblemsOpen ? 'Problems' : 'Problems'}
          </button>
          {isProblemsOpen && (
            <ul>
              <li>Problem 1</li>
              <li>Problem 2</li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
