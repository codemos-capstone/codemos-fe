import React, { useState } from "react";
import './footer.css';
import companyLogo from 'assets/images/comLogo.png';


export default function Footer(){
    return(
        <div class="footer">
            <div class="footer-content">
                <div class="logo-section">
                    <img src={companyLogo} alt="CodeMos Logo" class="logo"/>
                </div>
                <div class="links-section">
                    <div class="footer-links">
                        <a href="#about">About Us</a>
                        <a href="#contact">Contact</a>
                        <a href="#terms">Terms & Conditions</a>
                    </div>
                    </div>
                <div class="social-media">
                    <a href="#github">GitHub</a>
                    <a href="#notion">Notion</a>
                    <a href="#seoultech">Seoultech</a>
                </div>
                
                <div class="subscribe-section">
                    <form action="submit_email.php">
                        <input type="email" placeholder="Email Address" required/>
                        <button type="submit">OK</button>
                    </form>
                </div>
                <div class="address-section">
                    <p>Mirae-Hall,<br></br> 232, Gongneung-ro, Nowon-gu, Seoul, Republic of Korea</p>
                    <p>+82 010 6368 9651</p>
                    <p>codemosdevteam@gmail.com</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© CodeMosTeam 2024</p>
            </div>
        </div>
    );
}