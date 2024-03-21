import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Form, FormField} from "../../stemjs/src/ui/form/Form.jsx";
import {TextInput, TextArea} from "../../stemjs/src/ui/input/Input.jsx";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {TemporaryMessageArea} from "../../stemjs/src/ui/misc/TemporaryMessageArea.jsx";
import {parseIntegers} from "../../csabase/js/util.js";


class CustomIntegerInput extends FormField {
    setOptions(options) {
        options.label = options.label || options.name;
        options.label = options.label + ":";
        options.labelWidth = "auto";
        options.initialValue = options.initialValue || "";
        options.children = [
            <TextInput ref={this.refLink("input")} style={{maxWidth:  "70px"}} value={this.options.initialValue} />
        ];
        super.setOptions(options);
    }

    getValue() {
        return parseInt(this.input.getValue());
    }

    onMount() {
        this.input.addNodeListener("input", () => {
            if (this.options.parent.options.dynamicApply) {
                this.options.parent.setInput();
            }
        });
        this.input.addNodeListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.options.parent.setInput();
            }
        });
    }
}

class CustomArrayInput extends FormField {
    setOptions(options) {
        options.label = options.label || options.name;
        options.label = options.label + ":";
        options.labelWidth = "auto";
        options.initialValue = options.initialValue || [];
        let space = false, value = "";
        for (let x of options.initialValue) {
            if (space) {
                value += " ";
            } else {
                space = true;
            }
            value += x;
        }
        options.children = [
            <TextInput ref={this.refLink("input")} style={{maxWidth:  "300px"}}
                              value={this.options.initialValue.join(' ')} />
        ];
        super.setOptions(options);
    }

    getValue() {
        return parseIntegers(this.input.getValue());
    }

    onMount() {
        this.input.addNodeListener("input", () => {
            if (this.options.parent.options.dynamicApply) {
                this.options.parent.setInput();
            }
        });
        this.input.addNodeListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.options.parent.setInput();
            }
        });
    }
}

class CustomStringInput extends FormField {
    setOptions(options) {
        options.label = options.label || options.name;
        options.label = options.label + ":";
        options.labelWidth = "auto";
        options.initialValue = options.initialValue || "";
        options.children = [
            <TextInput ref={this.refLink("input")} style={{maxWidth:  "300px"}} value={this.options.initialValue} />
        ];
        super.setOptions(options);
    }

    getValue() {
        return this.input.getValue();
    }

    onMount() {
        this.input.addNodeListener("input", () => {
            if (this.options.parent.options.dynamicApply) {
                this.options.parent.setInput();
            }
        });
        this.input.addNodeListener("keypress", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.options.parent.setInput();
            }
        });
    }
}

class CustomObjectInput extends FormField {
    setOptions(options) {
        options.label = options.label || options.name;
        options.label = options.label + ":";
        options.labelWidth = "auto";
        super.setOptions(options);
    }

    getValue() {
        let data = {};
        for (let child of this.options.children) {
            data[child.options.name] = child.getValue();
        }
        return data;
    }

    render() {
        return <div>{super.render()}</div>;
    }
}

class CustomAreaInput extends FormField {
    setOptions(options) {
        options.label = options.label || options.name;
        options.label = options.label + ":";
        options.labelWidth = "auto";
        options.initialValue = options.initialValue || "";
        options.children = [
            <TextArea ref={this.refLink("input")} style={{minWidth:  "300px", minHeight: "200px"}} value={options.initialValue} />
        ];
        super.setOptions(options);
    }

    getValue() {
        return this.input.getValue();
    }

    onMount() {
        this.input.addNodeListener("input", () => {
            if (this.options.parent.options.dynamicApply) {
                this.options.parent.setInput();
            }
        });
    }
}

const CustomInputable = (BaseClass) => class CustomInputableClass extends UI.Element {
    getValue() {
        let options = {};
        for (let field of this.fields) {
            options[field.options.name] = field.getValue();
        }
        return options;
    }

    setOptions(options) {
        if (!options.hasOwnProperty("hiddenForm")) {
            options.hiddenForm = true;
        }
        if (!options.hasOwnProperty("dynamicApply")) {
            options.dynamicApply = false;
        }
        super.setOptions(options);
    }

    //function should return "ok" if the input given by the user is valid,
    //or an appropriate error message otherwise
    inputChecker(options) {
        return "ok";
    }

    optionsModifier(options) {
        return options;
    }

    getForm() {
        this.fields = this.getFormFields();
        return <Form>{this.fields}</Form>;
    }

    render() {
        let form;
        if (!this.options.dynamicApply) {
            form = [
                this.getForm(),
                <Button ref="setInputButton" label="Apply" level={Level.SUCCESS} />,
                <div style={{display: "inline-block", float: "left"}}>
                    <TemporaryMessageArea ref="error"/>
                </div>
            ];
        } else {
            form = [
                this.getForm(),
                <TemporaryMessageArea ref="error"/>
            ];
        }
        this.drawing = this.drawing || this.generateNewElement(this.options);
        let result = [this.drawing];
        if (this.options.hiddenForm) {
            result.push(<Button ref="customInputButton" label="Set Custom Input" icon="chevron-right" level={Level.INFO}
                           style={{display: "block", margin: "20px"}}/>);
            result.push(<div className="hidden" ref="customInputForm">
                    {form}
                </div>);
        } else {
            result.push(<div ref="customInputForm">
                    {form}
                </div>);
        }
        return result;
    }

    getElementClass() {
        return BaseClass;
    }

    generateNewElement(options) {
        const ElementClass = this.getElementClass();
        return <ElementClass key={Math.random()} {...options} />;
    }


    setUserOptions(options) {
        Object.assign(this.options, options);
        this.drawing.destroyNode();
        this.drawing = this.generateNewElement(options);
        if (this.customInputButton) {
            this.drawing.mount(this, this.customInputButton.node);
        } else if (!this.options.hiddenForm) {
            this.drawing.mount(this, this.customInputForm.node);
        } else {
            this.drawing.mount(this);
        }
    }

    setInput() {
        let options = Object.assign({}, this.options);
        let inputOptions = this.getValue();
        options = Object.assign(options, inputOptions);
        let msg = this.inputChecker(inputOptions);
        if (msg !== "ok") {
            if (this.options.dynamicApply) {
                this.error.showMessage(msg, "black", 1000 * 24 * 60 * 60);
            } else {
                this.error.showMessage(msg, "black", 4000);
            }
        } else {
            this.error.clear();
            options = this.optionsModifier(options);
            this.setUserOptions(options);
        }
    }

    onMount() {
        if (this.customInputButton) {
            this.customInputButton.addClickListener(() => {
                if (this.customInputForm.hasClass("hidden")) {
                    this.customInputButton.setIcon("chevron-down");
                    this.customInputForm.removeClass("hidden");
                } else {
                    this.customInputButton.setIcon("chevron-right");
                    this.customInputForm.addClass("hidden");
                }
            });
        }
        if (this.setInputButton) {
            this.setInputButton.addClickListener(() => {
                this.setInput();
            });
        }
    }
};


export {CustomInputable, CustomAreaInput, CustomIntegerInput, CustomArrayInput, CustomStringInput, CustomObjectInput};
