import {UI} from "../../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../../stemjs/src/ui/svg/SVGBase.js";
import {MarkupModifier, MarkupParser} from "../../../stemjs/src/markup/MarkupParser.js";
import {ensure} from "../../../stemjs/src/base/Require.js";

const {EmojiData} = self;

class EmojiModifier extends MarkupModifier {
    constructor(options) {
        super(options);

        // TODO should be probably build when needed
        this.emojiMap = new Map();
        this.unicodeToEmojiMap = new Map();
        for (let emoji in EmojiData.EMOJI) {
            this.emojiMap.set(EmojiData.EMOJI[emoji].key, emoji);
            this.unicodeToEmojiMap.set(EmojiData.EMOJI[emoji].unicode, emoji);
        }
        for (let emoticon in EmojiData.EMOTICONS) {
            let emoji = this.unicodeToEmojiMap.get(EmojiData.EMOTICONS[emoticon]);
            this.emojiMap.set(emoticon, emoji);
        }
    }

    modify(currentArray, originalString) {
        let newArray = [];
        let arrayLocation = 0;
        let currentElement = currentArray[arrayLocation];
        let lineStart = 0;

        let checkAndAddEmoji = (start, end) => {
            let substr = originalString.substring(start, end);
            if (this.emojiMap.has(substr)) {
                if (currentElement.start < start) {
                    newArray.push({
                        isString: true,
                        start: currentElement.start,
                        end: start,
                    });
                }

                newArray.push({
                    content: {
                        tag: "Emoji",
                        value: this.emojiMap.get(substr)
                    },
                    start: start,
                    end: end,
                });

                currentElement = {
                    isString: true,
                    start: end,
                    end: currentElement.end,
                };
            }
        };

        for (let i = 0; i < originalString.length; i += 1) {
            if (i >= currentElement.end) {
                newArray.push(currentElement);
                arrayLocation += 1;
                currentElement = currentArray[arrayLocation];
            }

            if (currentElement.isJSX) {
                continue;
            }

            if ((/\s/).test(originalString[i])) {
                checkAndAddEmoji(lineStart, i);
                lineStart = i + 1;
            }
        }
        if (lineStart < originalString.length) {
            checkAndAddEmoji(lineStart, originalString.length);
        }
        if (currentElement.start < originalString.length) {
            newArray.push(currentElement);
        }
        return newArray;
    }
}

MarkupParser.modifiers.push(new EmojiModifier());

export class Emoji extends UI.Element {
    setOptions(options) {
        options.height = options.height || "1.25em";
        options.width = options.width || "1.25em";
        super.setOptions(options);
    }

    getNodeType() {
        return "span";
    }

    render() {
        if (!EmojiData.isFull) {
            return [];
        }
        if (EmojiData.EMOJI[this.options.value]) {
            return <SVG.SVGRoot ref="svg" height={this.options.height} width={this.options.width}
                                   style={{
                                   "display": "inline-block",
                                   "margin": "-.2ex .15em .2ex",
                                   "line-height": "normal",
                                   "vertical-align": "middle",
                                   }}/>;
        } else {
            return [];
        }
    }

    getNodeAttributes() {
        const attr = super.getNodeAttributes();
        if (EmojiData.EMOJI[this.options.value]) {
            attr.setAttribute("title", ":" + this.options.value + ":");
        }
        if (this.options.title) {
            attr.setAttribute("title", this.options.title);
        }
        return attr;
    }

    updateEmojiContent() {
        if (EmojiData.EMOJI[this.options.value]) {
            this.svg.node.innerHTML = EmojiData.EMOJI[this.options.value].svgData;
            this.svg.node.setAttribute("viewBox", "0 0 64 64");
        } else {
            console.error("Invalid emoji value", this.options.value);
        }
    }

    redraw() {
        if (EmojiData.isFull) {
            super.redraw();
            this.updateEmojiContent();
            return;
        }
        // TODO add some configs to ensure, so just say ensure("Emoji", callback);
        ensure(`/static/js/Emoji.js?v=${JS_VERSION}`, () => {
            if (this.node) {
                this.redraw();
            }
        });
    }
}
