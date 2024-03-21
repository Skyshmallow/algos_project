import {
    UI
} from "../../stemjs/src/ui/UIBase.js";
import {
    ensure
} from "../../stemjs/src/base/Require.js";

export class RichEditorTest extends UI.Element {
    Cls = null;

    render() {
        const Cls = this.Cls;
        if (Cls) {
            return <Cls / > ;
        }
        ensure("/static/js/RichEditorWrapper.js", (modules) => {
            console.log("Modules", modules);
            window["require"](["RichEditorWrapper"], (exports) => {
                this.Cls = exports.RichEditorWrapper;
                this.redraw();
            })
        })
        return <h1 > Loading.... < /h1>;
    }
}