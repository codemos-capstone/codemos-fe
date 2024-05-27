import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ProblemList.css";

const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

export default function ProblemList() {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        const token = sessionStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${serverAddress}/api/v1/problems`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProblems(response.data);
        } catch (error) {
            console.error("Failed to fetch problems:", error);
        }
    };

    return (
        <div className="problem-list">
            <h2>문제 목록</h2>
            <Link to="/admin/problem/edit" className="add-problem-link">
                새로운 문제 추가
            </Link>
            <ul>
                {problems.map((problem) => (
                    <li key={problem.problemNumber}>
                        <Link to={`/admin/problem/edit/${problem.problemNumber}`}>
                            {problem.problemNumber}. {problem.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

