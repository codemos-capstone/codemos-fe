import Header from 'components/Header/Header';
import './Landing.css';
import Problems from 'assets/images/ProblemsDetails.png';
import Matter from 'components/matter/Matter.js';
export default function Landing(){

    
    return(
        <div className="container">
            <Header></Header>
            <div className="content">
                <div className='title'>Problems</div>
                <img src={Problems}/>
                <Matter></Matter>
            </div>     
        </div>
    )
}
