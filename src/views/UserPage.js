import Header from "components/Header/Header";
import Footer from "components/footer/footer";
import UserInfo from "components/UserInfo/UserInfo";

export default function UserPage(){
    const user = {
        username: "Hi",
        email: "tt@tt.com",
        solvedCtn: 999,
        solved: [
            1000, 1001, 1002, 1003, 1005, 1006, 1007, 1008, 1009, 1010
        ]
    }
    return (
        <div className="container" style={{}}>
            <Header />
            <div className="body" style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "5%"}}>
                <UserInfo user={user} />
            </div>
            <Footer />
        </div>
    )

}