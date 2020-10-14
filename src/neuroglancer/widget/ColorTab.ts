/**
 * @license
 * Copyright 2018 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Tab for updating a coordinate transform.
 */

import './coordinate_transform.css';
import {Color} from 'neuroglancer/color';
import {Atab} from 'neuroglancer/ui/AbstractTab';
import {TrackableBoolean, TrackableBooleanCheckbox} from 'neuroglancer/trackable_boolean';
import {TrackableValue} from 'neuroglancer/trackable_value';
import {StringInputWidget} from 'neuroglancer/widget/string_input_widget';

/**
 * View for the Color tab.
 */
export class ColorTab extends Atab {

  m:Map<string,HTMLElement> = new Map();

  private set_color_val = document.createElement('textarea');
  private clSetVal = document.createElement('input');
  private clClear = document.createElement('input');
  private clNeuronColor = document.createElement('textarea');
  private clNeuronColorButton = document.createElement('input');
  private clAlsoLoadNeurons = document.createElement('input');
  private clClearBeforeLoad = document.createElement('input');

  constructor(public transform: Color) {
    super(transform);

    this.m.set('set_color_val',this.set_color_val);
    this.m.set('clSetVal',this.clSetVal);
    this.m.set('clClear',this.clClear);
    this.m.set('clNeuronColor',this.clNeuronColor);
    this.m.set('clNeuronColorButton', this.clNeuronColorButton);
    this.m.set('clAlsoLoadNeurons',this.clAlsoLoadNeurons);
    this.m.set('clClearBeforeLoad',this.clClearBeforeLoad);

    const {element} = this;
    element.classList.add('neuroglancer-Color-widget');

    // this.addTextField(this.set_color_val,'Color value','H3');
    // this.addInputElement(this.clSetVal,'Set color to selections','button','clSetVal');
    // this.addInputElement(this.clClear,'Clear colors','button','clClear');
    // this.addTextField(this.clNeuronColor,'Neuron color mapping','H3', 14, 28);
    // this.addInputElement(this.clNeuronColorButton,'Set color','button','clNeuronColorButton');
    // this.addInputElement(this.clAlsoLoadNeurons,'Also load neurons');
    // this.addInputElement(this.clClearBeforeLoad,'Clear segments before load');

    this.addTextArea('Color value', transform.set_color_val);
    this.addInputElement(this.clSetVal, 'Set color to selections', 'button', 'clSetVal');
    this.addInputElement(this.clClear,'Clear colors','button','clClear');
    this.addTextArea('Neuron color mapping', transform.clNeuronColor, 14, 28);
    this.addInputElement(this.clNeuronColorButton,'Set color','button','clNeuronColorButton');
    this.addCheckbox('Also load neurons', transform.clAlsoLoadNeurons);
    this.addCheckbox('Clear segments before load', transform.clClearBeforeLoad);

    this.updateView();
  }


  addCheckbox = (label: string, value: TrackableBoolean) => {
    const linebreak = document.createElement('br');
    const div_inpArea = document.createElement('DIV');
    div_inpArea.setAttribute('align','right');

    this.m.set(label, document.createElement('input'));

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    const checkbox = this.registerDisposer(new TrackableBooleanCheckbox(value));
    labelElement.appendChild(checkbox.element);
    div_inpArea.appendChild(labelElement);
    div_inpArea.appendChild(linebreak);
    div_inpArea.appendChild(linebreak);
    this.element.appendChild(div_inpArea);
  }

  addTextArea = (label: string, value: TrackableValue<string>, rows:number=1, cols:number=24) => {
    this.m.set(label, document.createElement('textarea'));

    const div_textArea = document.createElement('DIV');
    div_textArea.setAttribute('align','right');

    const labelElement = document.createElement('H3');
    labelElement.textContent = label;
    labelElement.style.padding = '0';
    labelElement.style.margin='0';

    const inputField = this.registerDisposer(new StringInputWidget(value, rows, cols));
    labelElement.appendChild(inputField.element);
    div_textArea.appendChild(labelElement);
    this.element.appendChild(div_textArea);
  }

  /**
   * Uses the values in the text boxes and checkboxes to update the model for the Color tab.
   */
  updateModel() {
    try {
        for (let key in this.transform.value) {
          let field = this.m.get(key)!;
          if(field.nodeName === 'TEXTAREA') {
            this.transform.value[key]= (<HTMLTextAreaElement>field).value;
          } else if(field.nodeName === 'INPUT' && (<HTMLInputElement>field).type === 'checkbox') {

            if((<HTMLInputElement>field).checked) {
              this.transform.value[key] = '1';
              } else {
              this.transform.value[key] = '0';
            }
          }
        }
        this.transform.changed.dispatch();
    } catch {
      this.updateView();
    }
  }
}
