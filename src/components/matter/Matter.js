import React from "react";
import axios from "axios";
import "./Matter.css";
import Profile from "assets/images/profile.jpeg";
import OfficialProfile from "assets/favicon-540x540.png";

export default function Matter({ problem, onTryProblem }) {
    const { problemNumber, title, description, difficulty, isUserDefined, userId, tags } = problem;

    const handleTryProblem = async () => {
      try {
          const token = sessionStorage.getItem("accessToken");
          const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/api/v1/problems/${problemNumber}`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          const detailedProblem = response.data;
          onTryProblem(detailedProblem);
      } catch (error) {
          console.error("페치페일:", error);
      }
  };

    return (
        <div className="prob">
            <div></div>
            <div>
                {title && <p>{title}</p>}
                {problemNumber && <p>{problemNumber}</p>}
                {description && <p>{description}</p>}
            </div>
            <div className="filters">
                {difficulty && <button>{difficulty}</button>}
                {tags && tags.map((tag) => <button key={tag}>{tag}</button>)}
            </div>
            <div className="prob_right">
                {isUserDefined ? <img src={Profile} alt="Profile" /> : <img src={OfficialProfile} alt="Profile" />}
                {isUserDefined ? userId && <p>{userId}</p> : <p>CodeMos</p>}
                <button onClick={handleTryProblem}>Try</button>
            </div>
        </div>
    );
}
