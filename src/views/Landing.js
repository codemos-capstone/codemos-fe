import Header from 'components/Header/Header';
import './Landing.css';
import Problems from 'assets/images/ProblemsDetails.png';
import Matter from 'components/matter/Matter.js';
import Footer from 'components/footer/footer';
export default function Landing(){

    
    return(
        <div className="container">
            <Header></Header>
            <div className="content">
                <div className='title'>Problems</div>
                <Matter></Matter>
                <Matter></Matter>
                <Matter></Matter>
                <Matter></Matter>
                <Matter></Matter>
                <Matter></Matter><Footer></Footer>
            </div>     
        
        </div>
    )
}
