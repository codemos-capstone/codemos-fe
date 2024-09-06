import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Landing.css";
import Matter from "components/matter/Matter.js";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                const response = await axios.get(`${serverAddress}/api/v1/problems`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProblems(response.data);
            } catch (error) {
                console.error("페치페일:", error);
            }
        };

        const fetchMe = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                const response = await axios.get(`${serverAddress}/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSolvedProblems(response.data.solvedProblems);
            } catch (error) {
                console.error("페치페일:", error);
            }
        };

        fetchProblems();
        fetchMe();
    }, []);

    const handleTryProblem = (_problem) => {
        sessionStorage.setItem("selectedProblem", JSON.stringify(_problem));
        // console.log(_problem)
        navigate("/codespaces");
    };

    return (
        <div className="container">
            <div className="content">
                <div className="title">Problems</div>
                {problems? problems.map((problem) => (
                    <Matter key={problem.id} problem={problem} onTryProblem={handleTryProblem} solvedProblems={solvedProblems}/>
                )) : ""}
            </div>

        </div>
    );
}
