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
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import {javascriptGenerator} from 'blockly/javascript';


javascriptGenerator['main_loop'] = function(block) {
  var statements_content = javascriptGenerator.statementToCode(block, 'content');
  var code = '_mainLoop = function() {\n' + statements_content + '};\n';
  return code;
};

javascriptGenerator['get_velocity_x'] = function(block) {
  var code = 'getVelocityX()';
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['get_velocity_y'] = function(block) {
  var code = 'getVelocityY()';
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['get_angle'] = function(block) {
  var code = 'getAngle()';
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['get_height'] = function(block) {
  var code = 'getHeight()';
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['get_rotation_velocity'] = function(block) {
  var code = 'getRotationVelocity()';
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['engine_on'] = function(block) {
  var code = 'engineOn();\n';
  return code;
};

javascriptGenerator['engine_off'] = function(block) {
  var code = 'engineOff();\n';
  return code;
};

javascriptGenerator['rotate_left'] = function(block) {
  var code = 'rotateLeft();\n';
  return code;
};

javascriptGenerator['stop_left_rotation'] = function(block) {
  var code = 'stopLeftRotation();\n';
  return code;
};

javascriptGenerator['rotate_right'] = function(block) {
  var code = 'rotateRight();\n';
  return code;
};

javascriptGenerator['stop_right_rotation'] = function(block) {
  var code = 'stopRightRotation();\n';
  return code;
};

javascriptGenerator['logging'] = function(block) {
  var code = 'logging();\n';
  return code;
};