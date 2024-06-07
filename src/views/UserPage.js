import Header from "components/Header/Header";
import Footer from "components/footer/footer";
import UserInfo from "components/UserInfo/UserInfo";

export default function UserPage() {


    return (
        <div className="container" style={{}}>
            <Header />
            <div className="body" style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "5%" }}>
                <UserInfo />
            </div>
            <Footer />
        </div>
    );
}
