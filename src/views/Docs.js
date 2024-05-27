import React, { useEffect, useRef } from "react";
import './Docs.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css'; // 하이라이트 스타일 선택

import landing_sample from "assets/images/landing_sample.gif";
import docs_angle from "assets/images/docs_angle.png";
import docs_u from "assets/images/docs_u.png";
import docs_r from "assets/images/docs_r.png";
import docs_l from "assets/images/docs_l.png";

const basicForm = `// TODO: 
newInterval = setInterval(() => {
    // TODO: 
}, 1); // 1ms loop
// TODO:`;

const wrongEx = `// 잘못된 예시

setInterval(() => {
    // 어쩌구 저쩌구
}, 1);`;

const codeExample = `var targetHeight = 0; // 착륙 고도

function engineCtrl() { // 고도에 따라 엔진 control
    if (getVelocityY() * 5 > 
        (getHeight() - targetHeight))
        engineOn();
    else
        engineOff();
}

newInterval = setInterval(() => { // main loop
    if (getAngle() > 0) { // 우주선 각도 조정
        stopRightRotation();
        rotateLeft();
    } else {
        stopLeftRotation();
        rotateRight();
    }
    engineCtrl();
}, 1);`;

const aboutLogging = `logging()

/*
f12 -> [console output]

getVelocityX()        : 11.39214005489352
getVelocityY()        : 27.95145243876781
getAngle()            : -60.2
getHeight()           : 239
getRotationVelocity() : 0.37505750000014804
*/`;
const Docs = () => {
    const docsRef = useRef(null);
    useEffect(() => {
        if (docsRef.current) {
            docsRef.current.scrollTo(0, 0);
        }
        document.querySelectorAll('pre code').forEach((block) => {
            if (!block.dataset.highlighted) {
                hljs.highlightBlock(block);
                block.dataset.highlighted = true;
            }
        });
    }, []);

    return (
        <div className={`docs-container `} ref={docsRef}>
            <div>X</div>
            <div className="desc">
                <h1>CodeMos API Documentation</h1>  
            <div>
                CodeMos는 추락하는 우주선을 안전하게 착륙시키는 게임입니다.<br />
                어떠한 상황에서도 안전하게 착륙하는 알고리즘을 작성해보세요.<br />
            </div>
        </div>

        <hr />

        <h2>INDEX</h2>
        <ul  className="links">
            <li><a href="#description">Description</a></li>
            <li><a href="#tip">Tip</a></li>
            <li><a href="#start">Getting Started</a></li>
            <li><a href="#get">Get Methods</a>
                <ul>
                    <li><a href="#getVelocityX">getVelocityX</a></li>
                    <li><a href="#getVelocityY">getVelocityY</a></li>
                    <li><a href="#getAngle">getAngle</a></li>
                    <li><a href="#getHeight">getHeight</a></li>
                    <li><a href="#getRotationVelocity">getRotationVelocity</a></li>
                </ul>
            </li>
            <li><a href="#set">Set Methods</a>
                <ul>
                    <li><a href="#engineOn">engineOn</a></li>
                    <li><a href="#engineOff">engineOff</a></li>
                    <li><a href="#rotateLeft">rotateLeft</a></li>
                    <li><a href="#stopLeftRotation">stopLeftRotation</a></li>
                    <li><a href="#rotateRight">rotateRight</a></li>
                    <li><a href="#stopRightRotation">stopRightRotation</a></li>
                </ul>
            </li>
            <li><a href="#util">Utility Methods</a>
                <ul>
                    <li><a href="#logging">logging</a></li>
                </ul>
            </li>
            <li><a href="#tmi">TMI</a></li>
        </ul>
        <h2 id="description">Description</h2>
        <div>
            - 하단의 버튼으로 API 페이지와 코드 에디터를 열고 닫을 수 있습니다.<br />
            - 코드를 모두 작성한 뒤, Apply 버튼을 눌러, 우주선에 착륙 알고리즘을 주입할 수 있습니다.<br />
            - 착륙 속도 12.0 MPH, 착륙 각도 11.0° 미만일 때 착륙으로 간주합니다.<br />
            - 키보드 방향키로 우주선을 작동시켜 볼 수 있습니다. 단, 키보드로 착륙한 결과는 순위표에 등재되지 않습니다.<br />
        </div>
        <h2 id="tip">Tip</h2>
        <div>
            1. JS ES6의 모든 문법을 사용해 CodeMos 우주선 알고리즘을 작성할 수 있습니다.<br />
            2. 알고리즘이 작동하지 않는다면 코드를 잘못 짠게 아닐지 고민해 보세요.<br />
            3. 버그가 발견되었다면 이스터에그입니다.<br />
        </div>
        <h2 id="start">Getting Started</h2>
        <div className="api-function" id="">
            <h2 className="function-title">main loop</h2>
            <p className="function-description">
                CodeMos 알고리즘에서 main loop는 아래와 같이 "newInterval"에 할당되어야 합니다.<br />
                "newInterval"에 할당하지 않고 setInterval을 호출할 시 초기화 오류가 발생할 수 있습니다.<br />
                interval 간격은 수정할 수 있습니다.<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
                    {basicForm}
                </code></pre>
                <pre><code className="language-javascript">
                    {wrongEx}
                </code></pre>
            </div>
            <h2 className="function-title">알고리즘 작성 예시</h2>
            <p className="function-description">
                전역 스코프에서 함수와 변수를 정의할 수 있습니다.<br />
                아래는 착륙 알고리즘 예제 입니다.(고득점 불가)<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
                    {codeExample}
                </code></pre>
            </div>
            <h2 className="function-title">잘 짠 착륙 알고리즘 예시</h2>
            <div className="function-description">
                <pre><code className="language-javascript">
    // 비밀~
                </code></pre>
            </div>
            <img src={landing_sample} width="100%" /><br />
            <p className="function-description">
                by 조영효<br />
            </p>
        </div>
        <h2 id="get">Get Methods</h2>
        <div className="api-function" id="getVelocityX">
            <h2 className="function-title">getVelocityX</h2>
            <p className="function-description">
    이 함수는 우주선의 현재 수평 속도를 실수형으로 반환합니다.<br />
    &nbsp;&nbsp;- 음수 : 우주선이 좌로 이동 중<br />
    &nbsp;&nbsp;- 양수 : 우주선이 우로 이동 중<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    getVelocityX()
                </code></pre>
            </div>
        </div>
        <div className="api-function" id="getVelocityY">
            <h2 className="function-title">getVelocityY</h2>
            <p className="function-description">
    이 함수는 우주선의 현재 수직 속도를 실수형으로 반환합니다.<br />
    &nbsp;&nbsp;- 음수 : 우주선이 위로 이동 중<br />
    &nbsp;&nbsp;- 양수 : 우주선이 아래로 이동 중<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    getVelocityY()
                </code></pre>
            </div>
        </div>    
        <div className="api-function" id="getAngle">
            <h2 className="function-title">getAngle</h2>
            <p className="function-description">
    이 함수는 우주선의 현재 각도를 실수형으로 반환합니다.(-180.0 ~ +180.0)<br />
    <br />
            <img src={docs_angle} width="100%" />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    getAngle()
                </code></pre>
            </div>
        </div>
        <div className="api-function" id="getHeight">
            <h2 className="function-title">getHeight</h2>
            <p className="function-description">
    이 함수는 우주선의 현재 고도(ft, 피트)를 정수형으로 반환합니다.<br />
    착륙지점의 고도는 0ft 입니다.<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    getHeight()
                </code></pre>
            </div>
        </div>
        <div className="api-function" id="getRotationVelocity">
            <h2 className="function-title">getRotationVelocity</h2>
            <p className="function-description">
    이 함수는 우주선의 현재 각속도를 실수형으로 반환합니다.<br />
    &nbsp;&nbsp;- 음수 : 우주선이 반시계 방향으로 회전 중<br />
    &nbsp;&nbsp;- 양수 : 우주선이 시계 방향으로 회전 중<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    getRotationVelocity()
                </code></pre>
            </div>
        </div>
        <h2 id="set">Set Methods</h2>
        <div className="api-function" id="engineOn">
            <h2 className="function-title">engineOn</h2>
            <p className="function-description">
    이 함수를 호출하면 우주선의 주 엔진을 작동시킵니다.<br />
            <img src={docs_u} width="25%" />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    engineOn()
                </code></pre>
            </div>
        </div>   

        <div className="api-function" id="engineOff">
            <h2 className="function-title">engineOff</h2>
            <p className="function-description">
    이 함수를 호출하면 우주선의 주 엔진을 정지합니다.<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    engineOff()
                </code></pre>
            </div>
        </div>   

        <div className="api-function" id="rotateLeft">
            <h2 className="function-title">rotateLeft</h2>
            <p className="function-description">
    이 함수를 호출하면 우주선의 좌측 추진체을 작동합니다.<br />
    (우주선의 각속도가 증가합니다.)<br />

            <img src={docs_r} width="40%" />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    rotateLeft()
                </code></pre>
            </div>
        </div> 

        <div className="api-function" id="stopLeftRotation">
            <h2 className="function-title">stopLeftRotation</h2>
            <p className="function-description">
    이 함수를 호출하면 우주선의 좌측 추진체을 정지합니다.<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    stopLeftRotation()
                </code></pre>
            </div>
        </div> 

        <div className="api-function" id="rotateRight">
            <h2 className="function-title">rotateRight</h2>
            <p className="function-description">
    이 함수를 호출하면 우주선의 우측 추진체을 작동합니다.<br />
    (우주선의 각속도가 감소합니다.)<br />
            <img src={docs_l} width="40%" />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    rotateRight()
                </code></pre>
            </div>
        </div> 

        <div className="api-function" id="stopRightRotation">
            <h2 className="function-title">stopRightRotation</h2>
            <p className="function-description">
    이 함수를 호출하면 우주선의 우측 추진체을 정지합니다.<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    stopRightRotation()
                </code></pre>
            </div>
        </div> 
        <h2 id="util">Utility Methods</h2>
        <div className="api-function" id="logging">
            <h2 className="function-title">logging</h2>
            <p className="function-description">
    이 함수는 Get Method 들의 반환값을 console에 표시합니다.<br />
            </p>
            <div className="function-example">
                <pre><code className="language-javascript">
    {aboutLogging}
                </code></pre>
            </div>
        </div>
        <h2 id="tmi">TMI</h2>
        <div>
            1. CodeMos 행성은 중력(4.29158 m/s²) 외에는 어떠한 힘도 작용하지 않습니다.<br />
            2. 주 엔진 thrust : Δ10.729 m/s<br />
            3. 좌, 우측 엔진 thrust: Δ1.2 각속도/s<br />
            4. 착륙 속도 0.0 MPH, 착륙 각도 0.0° 일 때, 100점을 획득합니다.<br />
        </div>
        <br /><br /><br /><br /><br />
        </div>
    )
}
export default Docs;