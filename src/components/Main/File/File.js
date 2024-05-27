import React, { useEffect, useState } from 'react';
import './File.css';
import axios from 'axios';
import jSImage from 'assets/images/JS.png';
import proImage from 'assets/images/FILE.png';

export default function File({ setSelectedCode, setSelectedProblem }) {
  const [codeFiles, setCodeFiles] = useState([]);
  const [problems, setProblems] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({ files: false, problems: false });

  useEffect(() => {
    fetchData('code-file', setCodeFiles);
    fetchData('problems', setProblems);
  }, []);


  async function fetchData(endpoint, setState) {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:8080/api/v1/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      alert(`Failed to load ${endpoint}. Please try again later.`);
    }
  }
  //하이 안녕

  const handleProblemClick = async (problemNumber) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/problems/${problemNumber}`);
      setSelectedProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  return (
    <div className='file'>
      <ul>
        <li>
          <button onClick={() => toggleDropdown('files')} className={`dropdown-toggle ${dropdownStates.files ? 'open' : ''}`}>
            {dropdownStates.files ? 'File' : 'File'}
          </button>
          {dropdownStates.files && (
            <ul>
              {codeFiles.map((codeFile) => (
                <li key={codeFile.name} onClick={() => setSelectedCode(codeFile.content)}>
                  <div className="fileNameDetail">
                    <img src={jSImage} alt="JS Logo" style={{width: '14px'}} />
                    <div>P{codeFile.problemId ? codeFile.problemId : '0000'}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <button onClick={() => toggleDropdown('problems')} className={`dropdown-toggle ${dropdownStates.problems ? 'open' : ''}`}>
            {dropdownStates.problems ? 'Problems' : 'Problems'}
          </button>
          {dropdownStates.problems && (
            <ul>
              {problems.map((problem) => (
                <li key={problem.id} onClick={() => handleProblemClick(problem.problemNumber)}>
                  <div className="fileNameDetail">
                    <img src={proImage} alt="Problem Icon" style={{width: '14px'}} />
                    <div>{problem.problemNumber}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
