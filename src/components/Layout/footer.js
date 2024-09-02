import React, { useState } from "react";
import './footer.css';
import companyLogo from 'assets/images/comLogo.png';


export default function Footer(){
    return(
        <div className="footer">
            <div className="footer-content">
                <div className="logo-section">
                    <img src={companyLogo} alt="CodeMos Logo" className="logo"/>
                    <p>© CodeMosTeam 2024</p>
                </div>
                <div className="links-section">
                    <div className="footer-links">
                        <a href="#about">About Us</a>
                        <a href="#contact">Contact</a>
                        <a href="#terms">Terms & Conditions</a>
                    </div>
                </div>
                <div className="social-media">
                    <a href="https://github.com/codemos-capstone">GitHub</a>
                    <a href="#notion">Notion</a>
                    <a href="https://www.seoultech.ac.kr">Seoultech</a>
                </div>
                
                <div className="subscribe-section">
                    <form action="">
                        <input type="email" placeholder="Email Address" required/>
                        <button type="submit">OK</button>
                    </form>
                </div>
                <div className="address-section">
                    <p>Mirae-Hall, 232, Gongneung-ro,<br></br> Nowon-gu, Seoul, Republic of Korea</p>
                    <p>+82 010 6368 9651</p>
                    <p>codemosdevteam@gmail.com</p>
                </div>
            </div>
        </div>
    );
}