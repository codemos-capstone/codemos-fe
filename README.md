![header](https://capsule-render.vercel.app/api?type=waving&color=0:000,40:02071e,80:030928&height=300&section=header&text=CodeMos&fontSize=90&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Try%20writing%20an%20algorithm%20that%20can%20land%20safely%20in%20any%20situation.&descAlignY=51&descAlign=50)

# CodeMos - 착륙 알고리즘(PS) 게임

- CodeMos는 추락하는 우주선을 안전하게 착륙시키는 착륙 알고리즘을 작성하는 게임입니다. :rocket:
- 우주선의 착륙 안정성과, 착륙 시간으로 다른 유저들과 경쟁할 수 있습니다.
- 우주선은 매 판 랜덤하게 추락하기 때문에 어떠한 상황에서도 안전하게 착륙하는 범용적인 알고리즘을 작성해보세요.
- [lunar-lander프로젝트](https://github.com/ehmorris/lunar-lander)와 [Elevator Saga](https://play.elevatorsaga.com/), 그리고 [BOJ](https://www.acmicpc.net/)로 부터 영감을 얻었습니다.
  
## Table of Contents

1. [Getting Started](#getting-started)
2. [How to Play](#how-to-play)
    1. [코드 스페이스](#코드-스페이스)
    2. [API Docs와 Code Editor](#API-Docs와-Code-Editor)
    3. [Code Apply](#code-apply)
4. [API Function Docs](#API-Function-Docs)
5. [기술 스택](#기술-스택)
6. [Reference](#reference)
7. [License](#license)

### Getting Started

- Web Link
    - http://codemos.site
- Prerequisites
    - Chromium 기반 웹 브라우저

### Running on LocalHost

```bash
$> npx http-server
```

## How to play

### **메인 페이지**

![image](https://github.com/user-attachments/assets/8719e3f0-0e07-445d-b523-069a299b96b9)


### **코드 스페이스**

![image](https://github.com/user-attachments/assets/6c18bdf3-602a-43d7-9e4f-5172601adde3)
![image](https://github.com/user-attachments/assets/9deed0f7-6956-4b01-9a6f-216e79a7bf22)

### API Docs

![image](https://github.com/user-attachments/assets/9e0c3c7d-ba74-44df-9f12-efb556ef6d66)

- 우측 상단의 Docs 버튼을 누르면 우주선의 상태를 받아오고 엔진을 조작하는 API 함수에 대한 설명을 제공합니다.
- 경계선을 드래그하여 크기를 조절할 수 있습니다.

### Code Apply

- 우측 상단 실행 버튼을 클릭해 코드 에디터에 작성한 코드로 시뮬레이션을 시작할 수 있습니다.


## API Function Docs
게임 내에서 우주선 착륙 알고리즘을 작성 할 때 사용 가능한 함수들에 대한 설명입니다.[API Docs](https://github.com/yhcho0405/CodeMos/wiki/CodeMos-API-Documentation)

### Tip

1. JS ES6의 모든 문법을 사용해 CodeMos 우주선 알고리즘을 작성할 수 있습니다.
2. 알고리즘이 작동하지 않는다면 코드를 잘못 짠게 아닐지 고민해 보세요.
3. 버그가 발견되었다면 이스터에그입니다.


#### main loop

CodeMos 알고리즘에서 main loop는 아래와 같이 "newInterval"에 할당되어야 합니다.
"newInterval"에 할당하지 않고 setInterval을 호출할 시 초기화 오류가 발생할 수 있습니다.
interval 간격은 수정할 수 있습니다.

```javascript
// TODO: 
newInterval = setInterval(() => {
    // TODO: 
}, 1); // 1ms loop
// TODO: 
```

```javascript
// Incorrect Example

setInterval(() => {
    // something something
}, 1);
```

#### Algorithm Writing Example

전역 스코프에서 함수와 변수를 정의할 수 있습니다.
아래는 착륙 알고리즘 예제 입니다.(고득점 불가)

```javascript
var targetHeight = 0; // Landing altitude

function engineCtrl() { // Engine control depending on altitude
    if (getVelocityY() * 5 > (getHeight() - targetHeight))
        engineOn();
    else
        engineOff();
}

newInterval = setInterval(() => { // main loop
    if (getAngle() > 0) { // Adjusting the angle of the spaceship
        stopRightRotation();
        rotateLeft();
    } else {
        stopLeftRotation();
        rotateRight();
    }
    engineCtrl();
}, 1);
```

#### Well-Written Landing Algorithm Example
```javascript
// 비밀 ~
```

### Get Methods

#### getVelocityX

이 함수는 우주선의 현재 수평 속도를 실수형으로 반환합니다.
  - 음수 : 우주선이 좌로 이동 중
  - 양수 : 우주선이 우로 이동 중

```javascript
getVelocityX()
```

#### getVelocityY

이 함수는 우주선의 현재 수직 속도를 실수형으로 반환합니다.
  - 음수 : 우주선이 위로 이동 중
  - 양수 : 우주선이 아래로 이동 중

```javascript
getVelocityY()
```

#### getAngle

이 함수는 우주선의 현재 각도를 실수형으로 반환합니다.(-180.0 ~ +180.0)

```javascript
getAngle()
```

#### getHeight

이 함수는 우주선의 현재 고도(ft, 피트)를 정수형으로 반환합니다.
착륙지점의 고도는 0ft 입니다.

```javascript
getHeight()
```

#### getRotationVelocity

이 함수는 우주선의 현재 각속도를 실수형으로 반환합니다.
  - 음수 : 우주선이 반시계 방향으로 회전 중
  - 양수 : 우주선이 시계 방향으로 회전 중

```javascript
getRotationVelocity()
```

### Set Methods

#### engineOn

이 함수를 호출하면 우주선의 주 엔진을 작동시킵니다.

```javascript
engineOn()
```

#### engineOff

이 함수를 호출하면 우주선의 주 엔진을 정지합니다.

```javascript
engineOff()
```

#### rotateLeft

이 함수를 호출하면 우주선의 좌측 추진체을 작동합니다.
(우주선의 각속도가 증가합니다.)

```javascript
rotateLeft()
```

#### stopLeftRotation

이 함수를 호출하면 우주선의 좌측 추진체을 정지합니다.

```javascript
stopLeftRotation()
```

#### rotateRight

이 함수를 호출하면 우주선의 우측 추진체을 작동합니다.
(우주선의 각속도가 감소합니다.)

```javascript
rotateRight()
```

#### stopRightRotation

이 함수를 호출하면 우주선의 우측 추진체을 정지합니다.

```javascript
stopRightRotation()
```

### Utility Methods

#### logging

이 함수는 Get Method 들의 반환값을 console에 표시합니다.

```javascript
logging()

/*
f12 -> [console output]

getVelocityX()        : 11.39214005489352
getVelocityY()        : 27.95145243876781
getAngle()            : -60.2
getHeight()           : 239
getRotationVelocity() : 0.37505750000014804
*/
```

### TMI

1. CodeMos 행성은 중력(4.29158 m/s²) 외에는 어떠한 힘도 작용하지 않습니다.
2. 주 엔진 thrust : Δ10.729 m/s
3. 좌, 우측 엔진 thrust: Δ1.2 rotational velocity/s
4. 착륙 속도 0.0 MPH, 착륙 각도 0.0° 일 때, 100점을 획득합니다.


## 기술 스택


## Reference

- https://github.com/ehmorris/lunar-lander
- https://github.com/ajaxorg/ace

## License

This project is licensed under the MIT License
