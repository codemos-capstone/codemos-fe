import React, { useEffect, useState, useRef, useContext } from 'react';
import { CodeSpaceContext } from 'common/CodeSpaceContext';
import './File.css';
import axios from 'axios';

import probImage from 'assets/images/FILE.png';
import jsImage from 'assets/images/JS.png';
import pythonImage from 'assets/images/python.png';
import cImage from 'assets/images/c.png';
import blockImage from 'assets/images/block.svg';

const logos = {
  'js': jsImage,
  'py': pythonImage,
  'c': cImage,
  'block': blockImage
}

export default function File({ reloadFiles }) {
  const { selectedProblem, setSelectedProblem, setSelectedCode, selectedCodeId, setSelectedCodeId, setSelectedFileName, showNewFile, setShowNewFile, setCurrentLang } = useContext(CodeSpaceContext);
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
  const [codeFiles, setCodeFiles] = useState([]);
  const [problems, setProblems] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({ files: true, problems: false });
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, fileId: null });
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [fileWidth, setFileWidth] = useState(300);
  const fileRef = useRef(null);
  const resizerRef = useRef(null);
  const inputRef = useRef(null); //인풋 포커싱 줄라고

  useEffect(() => {
    fetchData('code-file', setCodeFiles);
    fetchData('problems', setProblems);
  }, [reloadFiles]); // reloadFiles 값이 변경되면 파일 목록 다시 불러오기

  
  useEffect(() => {
    if (showNewFile && inputRef.current) {
      inputRef.current.focus(); // showNewFile이 true가 되면 input에 포커스
    }
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowNewFile(false); // input 영역 외를 클릭하면 showNewFile 상태를 off
      }
    };

    // 전역 클릭 이벤트 리스너 추가
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewFile]);
  async function fetchData(endpoint, setState) {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`${serverAddress}/api/v1/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      // console.log(`Failed to load ${endpoint}. Please try again later.`);
    }
  }

  const handleProblemClick = async (problemNumber) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`${serverAddress}/api/v1/problems/${problemNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const handleNewFileNameChange = (e) => {
    const fileName = e.target.value;
    if (/[\u3131-\uD79D]/ugi.test(fileName)) {
      return;
    }
    setNewFileName(fileName);
  };

  const handleCreateFile = async (e) => {
    if (e.key === 'Enter' && newFileName.trim()) {
      try {
        const token = sessionStorage.getItem('accessToken');
        await axios.post(`${serverAddress}/api/v1/code-file`, {
          problemId: selectedProblem ? selectedProblem.problemNumber : "0000",
          name: newFileName,
          content: "",
          language: showNewFile
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNewFileName('');
        fetchData('code-file', setCodeFiles);
        setShowNewFile(null);
      } catch (error) {
        console.error('Error creating file:', error);
      }
    }
  };

  const handleFileClick = (codeFile) => {
    setSelectedCode(codeFile.content);
    setSelectedCodeId(codeFile.id);  // setSelectedCodeId를 호출하여 ID 전달
    setSelectedFileName(codeFile.name);
    setCurrentLang(codeFile.language);
  };


  const handleContextMenu = (e, fileId) => {
    e.preventDefault();
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const colabHeader = document.querySelector('.colab-header')?.offsetHeight || 0;
    const offsetX = e.clientX;
    const offsetY = e.clientY - headerHeight - colabHeader;
    setContextMenu({
      visible: true,
      x: offsetX, 
      y: offsetY, 
      fileId: fileId
    });
  };

  const handleDeleteFile = async () => {
    if (contextMenu.fileId) {
      try {
        const token = sessionStorage.getItem('accessToken');
        await axios.delete(`${serverAddress}/api/v1/code-file/${contextMenu.fileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
        fetchData('code-file', setCodeFiles);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, fileId: null });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const newWidth = e.clientX - fileRef.current.getBoundingClientRect().left;
    setFileWidth(Math.max(150, newWidth)); // Minimum width of 100px
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='file-container' ref={fileRef} style={{ width: `${fileWidth}px` }}>
      <div className='file' onClick={closeContextMenu}>
        <ul>
          <li>
            <button onClick={() => toggleDropdown('files')} className={`dropdown-toggle ${dropdownStates.files ? 'open' : ''}`}>
              {dropdownStates.files ? '▼ File' : '▶ File'}
            </button>
            {dropdownStates.files && (
              <ul>
                {codeFiles.map((codeFile) => (
                  <li
                    key={codeFile.id}
                    onClick={() => handleFileClick(codeFile)}
                    onContextMenu={(e) => handleContextMenu(e, codeFile.id)}
                    className={codeFile.id === selectedCodeId ? 'selected' : ''}
                  >
                    <div className="fileNameDetail">
                      <img src={logos[codeFile.language]} alt={`${codeFile.language} Logo`} style={{ width: '14px' }} />
                      <div>P{codeFile.problemId ? codeFile.problemId : '0000'}
                        -{codeFile.name ? codeFile.name : "undefined"}
                        <span className='format'>{(codeFile.language && '.' + codeFile.language)}</span>
                      </div>
                    </div>
                  </li>
                ))}
                {showNewFile && (
                  <li>
                    <div className='fileNameDetail'>
                      <img src={logos[showNewFile]} alt={`${showNewFile} Logo`} style={{ width: '14px' }} />
                      <input
                        type="text"
                        ref={inputRef}
                        value={newFileName} 
                        onChange={handleNewFileNameChange}
                        onKeyDown={handleCreateFile}
                        placeholder="Enter new file name"
                      />
                    </div>
                  </li>
                )}
              </ul>
            )}
          </li>
          <li>
            <button onClick={() => toggleDropdown('problems')} className={`dropdown-toggle ${dropdownStates.problems ? 'open' : ''}`}>
              {dropdownStates.problems ? '▼ Problems' : '▶ Problems'}
            </button>
            {dropdownStates.problems && (
              <ul>
                {problems.map((problem) => (
                  <li
                    key={problem.id}
                    onClick={() => handleProblemClick(problem.problemNumber)}
                    className={selectedProblem && selectedProblem.problemNumber === problem.problemNumber ? 'selected' : ''}
                  >
                    <div className="fileNameDetail">
                      <img src={probImage} alt="Problem Icon" style={{ width: '14px' }} />
                      <div>{problem.problemNumber}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
        {contextMenu.visible && (
          <div
            className="context-menu"
            style={{ top: contextMenu.y, left: contextMenu.x, position: 'absolute', zIndex: 1000 }}
          >
            <button onClick={handleDeleteFile}>Delete</button>
          </div>
        )}
      </div>
      <div className="resizer" ref={resizerRef} onMouseDown={handleMouseDown}></div>
    </div>
  );
}