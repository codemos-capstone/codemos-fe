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
 * @fileoverview Blockly React Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React from 'react';
import './BlocklyComponent.css';
import {useEffect, useRef} from 'react';

import * as Blockly from 'blockly/core';
import * as locale from 'blockly/msg/en';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';

Blockly.setLocale(locale);

let primaryWorkspace;

export const getEncodedCode = (jsonCode) => {
  if (!jsonCode) return;
  const converted = JSON.parse(jsonCode);
  Blockly.serialization.workspaces.load(converted, primaryWorkspace?.current);
  return javascriptGenerator.workspaceToCode(primaryWorkspace?.current);
}

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const toolbox = useRef();
  primaryWorkspace = useRef();

  const handleCode = () => {
    const code = Blockly.serialization.workspaces.save(primaryWorkspace.current);
    const processed = JSON.stringify(code);
    console.log(code);
    props.setSavedCode(processed);
    Blockly.serialization.workspaces.load(code, primaryWorkspace.current);
  };

  useEffect(() => {
    const {initialXml, children, savedCode, ...rest} = props;
    primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      ...rest,
    });
    primaryWorkspace.current.setTheme(Blockly.Theme.defineTheme('dark', {
      'base': Blockly.Themes.Classic,
      'componentStyles': {
        'workspaceBackgroundColour': '#202020',
        'toolboxBackgroundColour': '#3D3D3D',
        'toolboxForegroundColour': '#fff',
        'flyoutBackgroundColour': '#252526',
        'flyoutForegroundColour': '#ccc',
        'flyoutOpacity': 1,
        'scrollbarColour': '#797979',
        'insertionMarkerColour': '#fff',
        'insertionMarkerOpacity': 0.3,
        'scrollbarOpacity': 0.4,
        'cursorColour': '#d0d0d0',
      },
    }));

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        primaryWorkspace.current,
      );
    }
  }, [primaryWorkspace, toolbox]);
  useEffect(() => {
    primaryWorkspace.current.clear();
    if (!props.savedCode) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(props.initialXml),
        primaryWorkspace.current,
      );
    }
  }, [props.selectedCodeId])
  useEffect(() => {
    const savedCode = props.savedCode;
    if(primaryWorkspace.current) {
      if (savedCode) {
        const processed = JSON.parse(savedCode);
        Blockly.serialization.workspaces.load(processed, primaryWorkspace.current);
      }
    }
  }, [props.savedCode])

  return (
    <React.Fragment>
      <button className='block-convert-btn' onClick={handleCode}>Convert</button>
      <div ref={blocklyDiv} id="blocklyDiv" />
      <div style={{display: 'none'}} ref={toolbox}>
        {props.children}
      </div>
    </React.Fragment>
  );
}

export default BlocklyComponent;
