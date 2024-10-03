import React, { useContext } from 'react';

import { CodeSpaceContext } from 'common/CodeSpaceContext';
import BlocklyComponent, { Block, Category } from './Blockly';

import './blocks/customblocks';
import './generator/generator';

export default function BlockEditor() {
  const { selectedCode, setSelectedCode } = useContext(CodeSpaceContext);
  const toolbox = `
    <xml xmlns="http://www.w3.org/1999/xhtml">
      <category name="Logic" colour="#5C81A6">
        <block type="controls_if"></block>
        <block type="controls_ifelse"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
        <block type="logic_null"></block>
        <block type="logic_ternary"></block>
      </category>
      <category name="Loops" colour="#5CA65C">
        <block type="controls_repeat_ext"></block>
        <block type="controls_whileUntil"></block>
        <block type="controls_for"></block>
        <block type="controls_forEach"></block>
        <block type="controls_flow_statements"></block>
      </category>
      <category name="Math" colour="#5C68A6">
        <block type="math_number"></block>
        <block type="math_arithmetic"></block>
        <block type="math_single"></block>
        <block type="math_trig"></block>
        <block type="math_constant"></block>
        <block type="math_number_property"></block>
        <block type="math_round"></block>
        <block type="math_on_list"></block>
        <block type="math_modulo"></block>
        <block type="math_constrain"></block>
        <block type="math_random_int"></block>
        <block type="math_random_float"></block>
      </category>
      <category name="Text" colour="#5CA68D">
        <block type="text"></block>
        <block type="text_join"></block>
        <block type="text_append"></block>
        <block type="text_length"></block>
        <block type="text_isEmpty"></block>
        <block type="text_indexOf"></block>
        <block type="text_charAt"></block>
        <block type="text_getSubstring"></block>
        <block type="text_changeCase"></block>
        <block type="text_trim"></block>
        <block type="text_print"></block>
        <block type="text_prompt_ext"></block>
      </category>
      <category name="Lists" colour="#745CA6">
        <block type="lists_create_empty"></block>
        <block type="lists_create_with"></block>
        <block type="lists_repeat"></block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_indexOf"></block>
        <block type="lists_getIndex"></block>
        <block type="lists_setIndex"></block>
        <block type="lists_getSublist"></block>
        <block type="lists_split"></block>
      </category>
      <category name="Variables" custom="VARIABLE" colour="#A65C81"></category>
      <category name="Functions" custom="PROCEDURE" colour="#9A5CA6"></category>
      <sep></sep>
      <category name="Game" colour="#A6745C">
        <block type="main_loop"></block>
        <block type="get_x"></block>
        <block type="get_y"></block>
        <block type="get_velocity_x"></block>
        <block type="get_velocity_y"></block>
        <block type="get_angle"></block>
        <block type="get_height"></block>
        <block type="get_rotation_velocity"></block>
        <block type="get_fuel"></block>
        <block type="get_time_left"></block>
        <block type="engine_on"></block>
        <block type="engine_off"></block>
        <block type="rotate_left"></block>
        <block type="stop_left_rotation"></block>
        <block type="rotate_right"></block>
        <block type="stop_right_rotation"></block>
        <block type="logging"></block>
      </category>
    </xml>
  `;
  const containerStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }

  return (
    <div className="block-editor-container" style={containerStyles}>
        <BlocklyComponent
          readOnly={false}
          trashcan={true}
          media={'media/'}
          savedCode={selectedCode}
          setSavedCode={setSelectedCode}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          initialXml={`
<xml xmlns="http://www.w3.org/1999/xhtml">
<block type="main_loop" x="0" y="0"></block>
</xml>
      `}
          toolbox={toolbox}
        >
        </BlocklyComponent>
    </div>
  );
}