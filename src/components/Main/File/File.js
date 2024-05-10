import React, { useEffect, useState } from 'react';
import './File.css';
import axios from 'axios';

export default function File({ setSelectedCode }) {
  const [codeFiles, setCodeFiles] = useState([]);

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

  return (
    <div className='file'>
      <ul>
        {codeFiles.map((codeFile) => (
          <li key={codeFile.id} onClick={() => handleFileClick(codeFile.content)}>
            <strong>File ID:</strong> {codeFile.id}<br />
            {/* <strong>File Name:</strong> {codeFile.fileName}<br /> */}
            {/* <strong>Content:</strong> {codeFile.content}<br /> */}
          </li>
        ))}
      </ul>
    </div>
  );
}