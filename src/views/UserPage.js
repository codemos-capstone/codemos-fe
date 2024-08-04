import UserInfo from "components/UserInfo/UserInfo";

export default function UserPage() {


    return (
        <div className="container" style={{}}>
            <div className="body" style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "5%" }}>
                <UserInfo />
            </div>
        </div>
    );
}
