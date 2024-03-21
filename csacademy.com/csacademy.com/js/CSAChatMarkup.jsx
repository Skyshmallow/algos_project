import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {ChatMarkupRenderer} from "../../establishment/chat/js/ChatMarkupRenderer.jsx";
import {Graph} from "../../csacontent/js/CSAGraph.jsx";

class ChatGraph extends Graph {
    setOptions(options) {
        let maxAllowedNodes = 16;
        if (options.nodes) {
            while (options.nodes.length > maxAllowedNodes) {
                options.nodes.pop();
            }
        }
        if (options.edges) {
            for (let i = 0; i < options.edges.length; ++i) {
                if (options.edges[i].source >= maxAllowedNodes || options.edges[i].target >= maxAllowedNodes) {
                    options.edges.splice(i, 1);
                    --i;
                }
            }
        }
        options.idlePauseThreshold = 1;
        super.setOptions(options);
    }
}

class ChatGraphSVG extends SVG.SVGRoot {
    getDefaultOptions() {
        return {
            width: 300,
            height: 300
        }
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setStyle("height", this.options.height + "px");
        attr.setStyle("width", this.options.width + "px");
        return attr;
    }

    setOptions(options) {
        delete options.style;
        super.setOptions(options);
        this.options.height = Math.min(this.options.height, 400);
        this.options.width = Math.min(this.options.width, 400);
    }

    render() {
        return [
                <SVG.Rect ref="borderRect"
                             x={0} y={0} width={this.options.width} height = {this.options.height}
                             stroke="gray" fill="white"/>,
                <ChatGraph ref="graph" {...this.options}
            box={{x:0, y:0, width: this.options.width, height:this.options.height}} />];
    }

    onMount() {
    }
}

ChatMarkupRenderer.classMap.addClass("Graph", ChatGraphSVG);
