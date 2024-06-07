import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "components/Header/Header";
import "./Landing.css";
import Matter from "components/matter/Matter.js";
import { useNavigate } from "react-router-dom";
import Footer from 'components/footer/footer';

export default function Landing() {
    const serverAddress = process.env.SERVER_ADDRESS;
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
        console.log(_problem)
        navigate("/codespace");
    };

    return (
        <div className="container">
            <Header></Header>
            <div className="content">

                <div className="title">Problems</div>
                {problems.map((problem) => (
                    <Matter key={problem.id} problem={problem} onTryProblem={handleTryProblem} solvedProblems={solvedProblems}/>
                ))}
                
                <Footer></Footer>
            </div>

        </div>
    );
}
