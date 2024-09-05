import React, { useEffect, useState, useRef } from 'react';
import './File.css';
import axios from 'axios';
import jSImage from 'assets/images/JS.png';
import proImage from 'assets/images/FILE.png';

export default function File({ setSelectedCode, setSelectedProblem, reloadFiles, showInput, selectedProblem, setShowInput }) {
  const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
  const [codeFiles, setCodeFiles] = useState([]);
  const [problems, setProblems] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({ files: true, problems: false });
  const [newFileName, setNewFileName] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, fileId: null });
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [fileWidth, setFileWidth] = useState(200); // Initial width
  const fileRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    fetchData('code-file', setCodeFiles);
    fetchData('problems', setProblems);
  }, [reloadFiles]);

  async function fetchData(endpoint, setState) {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`${serverAddress}/api/v1/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      console.log(`Failed to load ${endpoint}. Please try again later.`);
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
          language: "js"
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNewFileName('');
        fetchData('code-file', setCodeFiles);
        setShowInput(false);
      } catch (error) {
        console.error('Error creating file:', error);
      }
    }
  };

  const handleFileClick = (codeFile) => {
    setSelectedCode(codeFile.content);
    setSelectedFileId(codeFile.id);
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
                    className={codeFile.id === selectedFileId ? 'selected' : ''}
                  >
                    <div className="fileNameDetail">
                      <img src={jSImage} alt="JS Logo" style={{ width: '14px' }} />
                      <div>P{codeFile.problemId ? codeFile.problemId : '0000'}
                        -{codeFile.name ? codeFile.name : "undefined"}
                      </div>
                    </div>
                  </li>
                ))}
                {showInput && (
                  <li>
                    <div className='fileNameDetail'>
                      <img src={jSImage} alt="JS Logo" style={{ width: '14px' }} />
                      <input
                        type="text"
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
                      <img src={proImage} alt="Problem Icon" style={{ width: '14px' }} />
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