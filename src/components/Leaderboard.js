import React, { useEffect, useState } from "react";

const btnTexts = require('lang/kor.json').leader;
const serverAddress = "";

export default function Leaderboard({ page }){
    const tableStyle = {
        width: "500px",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#0a0f1c", // dark navy
        color: "#fff",
        borderRadius: "10px",
        borderCollapse: "collapse", // prevent border overlap
        border: "1px solid white"
    }
    const thStyle = {
        border: "1px solid #2e9cca",
        backgroundColor: "#1c223a",
        padding: "5px"
    }

    const [save, setSave] = useState([]);

    useEffect(()=>{
        loadBoard();
    }, [page])

    // Call functions to set current leaderboard page.
    const loadBoard = () => {
        getBoard("/leaderboard?pageno=" + String(page)).then(result => {
            if (result.length == 0){
                console.log('page is empty');
                return;
            }
            setSave(result);
        })
        .catch(error => {
            console.log('Error', error);
        })   
    }

    return(
        <table style={tableStyle}>
            <thead>
                <tr>
                    <td style={thStyle}>{btnTexts.cols[0]}</td>
                    <td style={thStyle}>{btnTexts.cols[1]}</td>
                    <td style={thStyle}>{btnTexts.cols[2]}</td>
                    <td style={thStyle}>{btnTexts.cols[3]}</td>
                </tr>
            </thead>
            <BoardRows boardData={save} page={page} />
        </table>
    )
}

// Sends requests to backend server.
// Get a page of leaderboard except each specific code or each submitted code.
// -> loadBoard
function getBoard(url){
    return new Promise((resolve, reject) => {
        fetch(serverAddress + url,{
            method: "GET",
            body: null
        })
        .then((response) => {
            if(!response.ok){
                throw new Error(response.status);
            }
            const contentType = response.headers.get('Content-Type');
            if(!contentType){
                throw new Error('no content type');
            } else if (contentType.includes('application/json')){
                return response.json();
            } else {
                throw new Error('cannot handle response');
            } 
        })
        .then((data) => {
            let leaderboard = data.content;
            for(var i = 0; i < leaderboard.length; i++){
                leaderboard[i].score /= 100000;
            }
            resolve(leaderboard);
        })
        .catch((error) => {
            reject(error);
        })
    })
}
// Sends requests to backend server.
// Get each specific submitted code(string).
// -> setBoard, 
function getCode(url){
    return new Promise((resolve, reject) => {
        fetch(serverAddress + url,{
            method: "GET",
            body: null
        })
        .then((response) => {
            if(!response.ok){
                throw new Error(response.status);
            }
            const contentType = response.headers.get('Content-Type');
            if(!contentType){
                throw new Error('no content type');
            } else if (contentType.includes('text/plain')){
                return response.text();
            } else {
                throw new Error('cannot handle response');
            } 
        })
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        })
    })
}
// Set <tbody> with given data.
// Add toggle menu to show detail codes(set onClick event to <td> that uses getBoard())
// -> loadBoard
function Code({id}){
    const [code, setCode] = useState("");
    getCode("/leaderboard/" + id).then(result => {
        setCode(result);
    })
    return(
        <tr className="details">
            <td colSpan="4"><pre><code className="language-javascript">{code}</code></pre></td>
        </tr>
    )
}
function BoardRows({boardData, page}){
    if(boardData.length == 0){
        return(
            <tbody><tr>
                <td colSpan={4} style={{height: "200px"}}>No Results</td>
            </tr></tbody>
        )
    }

    const [showCode, setShowCode] = useState(boardData.map(() => false));
    const toggleCode = (idx) => {
        setShowCode((prevState) => {
            const newState = [...prevState];
            newState[idx] = !newState[idx];
            return newState;
        });
    };

    return(<tbody>
        {boardData.map((item, idx) => (
            <React.Fragment key={idx+"-w"}><tr
            className="row" style={{border: "1px solid white"}}
            key={idx+"-r"} onClick={() => {if (page == 0) return; toggleCode(idx)}}
            >
                <td style={{border: "1px solid #2e9cca", padding: "5px"}}>{(page) * 10 + idx + 1}</td>
                <td style={{border: "1px solid #2e9cca", padding: "5px"}}>{item.nickname}</td>
                <td style={{border: "1px solid #2e9cca", padding: "5px"}}>{item.score}</td>
                <td style={{border: "1px solid #2e9cca", padding: "5px"}}>{item.time + " s"}</td>
            </tr>
            {showCode[idx] && <Code id={item.codeId} />}</React.Fragment>
        ))}
    </tbody>);
}