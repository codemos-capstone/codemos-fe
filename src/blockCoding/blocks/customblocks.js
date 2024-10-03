/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks

import * as Blockly from 'blockly/core';

// Since we're using json to initialize the field, we'll need to import it.
import '../fields/BlocklyReactField';
import '../fields/DateField';

Blockly.Blocks['get_fuel'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getFuel()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 남은 연료를 실수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_time_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getTimeLeft()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("현재 남은 제한시간을 정수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getX()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 X 좌표를 실수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getY()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 Y 좌표를 실수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_velocity_x'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getVelocityX()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 수평 속도를 실수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_velocity_y'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getVelocityY()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 수직 속도를 실수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_angle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getAngle()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 각도를 실수형으로 반환합니다.(-180.0 ~ +180.0)");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_height'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getHeight()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 고도(ft, 피트)를 정수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['get_rotation_velocity'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("getRotationVelocity()");
    this.setOutput(true, "Number");
    this.setColour(230);
    this.setTooltip("우주선의 현재 각속도를 실수형으로 반환합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['engine_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("engineOn()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("우주선의 주 엔진을 작동시킵니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['engine_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("engineOff()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("우주선의 주 엔진을 정지합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['rotate_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rotateLeft()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("우주선의 좌측 추진체를 작동합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['stop_left_rotation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stopLeftRotation()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("우주선의 좌측 추진체를 정지합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['rotate_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("rotateRight()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("우주선의 우측 추진체를 작동합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['stop_right_rotation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("stopRightRotation()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(290);
    this.setTooltip("우주선의 우측 추진체를 정지합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['logging'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("logging()");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip("Get Method 들의 반환값을 console에 표시합니다.");
    this.setHelpUrl("");
  }
};

Blockly.Blocks['main_loop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("_mainLoop");
    this.appendStatementInput("content")
        .setCheck(null);
    this.setColour(20);
    this.setTooltip("착륙 알고리즘의 메인 루프입니다.");
    this.setHelpUrl("");
  }
};
