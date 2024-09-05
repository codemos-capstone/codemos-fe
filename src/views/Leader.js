import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Leaderboard from "../components/LeaderBoard/Leaderboard";
import CodeDetails from "../components/LeaderBoard/CodeDetails";
import './Leader.css';

export default function Leader() {
  const { problemId } = useParams(); 
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [leaderData, setLeaderData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchProblemId, setSearchProblemId] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');

  const fetchLeaderboardData = async (pageNumber) => {
    try {
      const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
      const response = await fetch(`${serverAddress}/api/v1/problem-ranking/problem?problemId=${problemId}&page=${pageNumber}`);
      const data = await response.json();
      setPage(pageNumber);
      setLeaderData(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(0);
  }, [problemId]);

  // selectedCode가 변경되었을 때 모달을 열도록 처리
  useEffect(() => {
    if (selectedCode) {
      console.log("SELECTEDCODE: ", selectedCode);
      setModalIsOpen(true);
    }
  }, [selectedCode]);

  const handleRowClick = (rowData) => {
    if (rowData.code) { 
      setSelectedCode(rowData.code); // 코드가 설정되면 모달이 자동으로 열림
    } else {
      alert("No code available for this entry.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCode(''); // 모달이 닫힐 때 선택된 코드 초기화
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "white" }}>Ranking {problemId}</h1>

      <div className="search-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter problem ID"
          value={searchProblemId}
          onChange={(e) => setSearchProblemId(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button
          onClick={() => navigate(`/leader/${searchProblemId}`)}
          style={{ padding: '8px', cursor: 'pointer' }}
        >
          검색
        </button>
      </div>

      <div id="board" style={{ width: "50%", margin: "auto" }}>
        <Leaderboard
          data={leaderData}
          onRowClick={handleRowClick} // Leaderboard에 클릭 이벤트 전달
        />
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${i === page ? "active" : ""}`}
            onClick={() => fetchLeaderboardData(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 모달은 selectedCode가 있을 때만 렌더링 */}
      {selectedCode && (
        <CodeDetails
          code={selectedCode} 
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
        />
      )}
    </div>
  );
}
