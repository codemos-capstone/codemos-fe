import React from "react";

// Leaderboard 컴포넌트는 props로 데이터를 받아 렌더링
export default function Leaderboard({ data, onRowClick }) {
  return (
    <div className="leader">
      <table>
        <thead>
          <tr>
            <th>Score</th>
            <th>Fuel</th>
            <th>Time</th>
            <th>Code Byte Size</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id} onClick={() => onRowClick(entry)}> {/* 클릭 이벤트 추가 */}
              <td>{entry.score}</td>
              <td>{entry.fuel}</td>
              <td>{entry.time}</td>
              <td>{entry.codeByteSize}</td>
              <td className="uid">{entry.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
