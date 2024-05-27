import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ProblemEdit.css";

const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

export default function ProblemEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [problem, setProblem] = useState({
        problemNumber: "",
        title: "",
        description: "",
        timeLimit: "",
        fuelLimit: "",
        initialX: "",
        initialY: "",
        initialAngle: "",
        initialVelocityX: "",
        initialVelocityY: "",
        restrictedMethods: [],
        isUserDefined: false,
    });

    useEffect(() => {
        if (id) {
            fetchProblem();
        }
    }, [id]);

    const fetchProblem = async () => {
        const token = sessionStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${serverAddress}/api/v1/problems/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProblem(response.data);
        } catch (error) {
            console.error("Failed to fetch problem:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProblem((prevProblem) => ({
            ...prevProblem,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("accessToken");
        try {
            if (id) {
                await axios.put(`${serverAddress}/api/v1/admin/problems/${id}`, problem, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`${serverAddress}/api/v1/admin/problems`, problem, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            navigate("/admin/problem");
        } catch (error) {
            console.error("Failed to save problem:", error);
        }
    };

    const handleDelete = async () => {
        const token = sessionStorage.getItem("accessToken");
        try {
            await axios.delete(`${serverAddress}/api/v1/admin/problems/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/admin/problem");
        } catch (error) {
            console.error("Failed to delete problem:", error);
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setProblem((prevProblem) => ({
            ...prevProblem,
            restrictedMethods: checked ? [...prevProblem.restrictedMethods, name] : prevProblem.restrictedMethods.filter((method) => method !== name),
        }));
    };
    return (
        <div className="problem-edit">
            <h2>{id ? "문제 수정" : "새로운 문제 추가"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>문제 번호:</label>
                    <input type="number" name="problemNumber" value={problem.problemNumber} onChange={handleChange} />
                </div>
                <div>
                    <label>제목:</label>
                    <input type="text" name="title" value={problem.title} onChange={handleChange} />
                </div>
                <div>
                    <label>설명:</label>
                    <textarea name="description" value={problem.description} onChange={handleChange} rows={10} />
                    <div className="markdown-preview">
                        <h3>미리보기:</h3>
                        <ReactMarkdown>{problem.description}</ReactMarkdown>
                    </div>
                </div>
                <div>
                    <label>제한 시간(ms):</label>
                    <input type="number" name="timeLimit" step="0.1" value={problem.timeLimit} onChange={handleChange} />
                </div>
                <div>
                    <label>제한 연료:</label>
                    <input type="number" name="fuelLimit" step="0.1" value={problem.fuelLimit} onChange={handleChange} />
                </div>
                <div>
                    <label>초기 X 좌표:</label>
                    <input type="number" name="initialX" step="0.1" value={problem.initialX} onChange={handleChange} />
                </div>
                <div>
                    <label>초기 Y 좌표:</label>
                    <input type="number" name="initialY" step="0.1" value={problem.initialY} onChange={handleChange} />
                </div>
                <div>
                    <label>초기 각도(도):</label>
                    <input type="number" name="initialAngle" step="0.1" value={problem.initialAngle} onChange={handleChange} />
                </div>
                <div>
                    <label>초기 X 속도:</label>
                    <input type="number" name="initialVelocityX" step="0.1" value={problem.initialVelocityX} onChange={handleChange} />
                </div>
                <div>
                    <label>초기 Y 속도:</label>
                    <input type="number" name="initialVelocityY" step="0.1" value={problem.initialVelocityY} onChange={handleChange} />
                </div>
                <div>
                    <label>허용 함수:</label>
                    <div>
                        <label>
                            <input type="checkbox" name="getVelocityX" checked={problem.restrictedMethods.includes("getVelocityX")} onChange={handleCheckboxChange} />
                            getVelocityX
                        </label>
                        <label>
                            <input type="checkbox" name="getVelocityY" checked={problem.restrictedMethods.includes("getVelocityY")} onChange={handleCheckboxChange} />
                            getVelocityY
                        </label>
                        <label>
                            <input type="checkbox" name="getAngle" checked={problem.restrictedMethods.includes("getAngle")} onChange={handleCheckboxChange} />
                            getAngle
                        </label>
                        <label>
                            <input type="checkbox" name="getHeight" checked={problem.restrictedMethods.includes("getHeight")} onChange={handleCheckboxChange} />
                            getHeight
                        </label>
                        <label>
                            <input type="checkbox" name="getRotationVelocity" checked={problem.restrictedMethods.includes("getRotationVelocity")} onChange={handleCheckboxChange} />
                            getRotationVelocity
                        </label>
                        <label>
                            <input type="checkbox" name="engineOn" checked={problem.restrictedMethods.includes("engineOn")} onChange={handleCheckboxChange} />
                            engineOn
                        </label>
                        <label>
                            <input type="checkbox" name="engineOff" checked={problem.restrictedMethods.includes("engineOff")} onChange={handleCheckboxChange} />
                            engineOff
                        </label>
                        <label>
                            <input type="checkbox" name="rotateLeft" checked={problem.restrictedMethods.includes("rotateLeft")} onChange={handleCheckboxChange} />
                            rotateLeft
                        </label>
                        <label>
                            <input type="checkbox" name="stopLeftRotation" checked={problem.restrictedMethods.includes("stopLeftRotation")} onChange={handleCheckboxChange} />
                            stopLeftRotation
                        </label>
                        <label>
                            <input type="checkbox" name="rotateRight" checked={problem.restrictedMethods.includes("rotateRight")} onChange={handleCheckboxChange} />
                            rotateRight
                        </label>
                        <label>
                            <input type="checkbox" name="stopRightRotation" checked={problem.restrictedMethods.includes("stopRightRotation")} onChange={handleCheckboxChange} />
                            stopRightRotation
                        </label>
                    </div>
                </div>
                <button type="submit">저장</button>
                {id && (
                    <button type="button" onClick={handleDelete}>
                        삭제
                    </button>
                )}
            </form>
        </div>
    );
}
