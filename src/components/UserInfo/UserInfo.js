import React from "react"
import profile from "assets/images/profile.jpeg"

export default function UserInfo({ user }){
    const optionBtnStyle = {
        display: "block",
        margin: "5px",
        padding: "5px 10px",
        borderRadius: "4px",
        cursor: "pointer",
    }
    return (
        <div className="information"
            style={{
                justifyContent: "space-between",
                width: "80%",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#a5a6b4",
                color: "white",
                padding: "50px",
                fontFamily: "Arial, sans-serif",
                borderRadius: "8px"
            }}
        >
            <div className="profile" style={{display: "block"}}>
                <div className="image-container" style={{width: "100px", height: "100px"}}>
                    <img src={profile} style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} />
                </div>
                <h3 className="user-name" style={{color: "#2f664e", marginTop: "10px", marginBottom: "0"}}>{user.username}</h3>
                <div className="user-email" style={{fontSize: "70%"}}>{user.email}</div>
                <div className="solved-ctn" style={{fontSize: "70%"}}>{`Solved: `}{user.solvedCtn}</div>
            </div>
            <div className="solved-list" style={{margin: "0 20px", width: "40%"}}>
                {user.solved.map((n) => <button key={n}
                style={{
                    margin: "5px",
                    padding: "5px 10px",
                    color: "#2196f3",
                    backgroundColor: "white",
                    border: "1px solid #2196f3",
                    borderRadius: "4px"
                }}>{n}</button>)}
            </div>
            <div className="btns" style={{margin: "0", width: "fit-content"}}>
                <button style={{...optionBtnStyle, borderColor: "#2196f3", color: "#2196f3"}}>Change Info</button>
                <button style={{...optionBtnStyle, color: "white", borderColor: "#2196f3", backgroundColor: "#2196f3"}}>Show Ranking</button>
                <button style={{...optionBtnStyle, color: "white", borderColor: "#2196f3", backgroundColor: "#2196f3"}}>Settings</button>
                <button style={{...optionBtnStyle, color: "#5b0012", borderColor: "#dc2348", backgroundColor: "#dc2348"}}>Reset Records</button>
                <button style={{...optionBtnStyle, color: "#5b0012", borderColor: "#dc2348", backgroundColor: "#dc2348"}}>Delete Account</button>
            </div>
        </div>
    )
}