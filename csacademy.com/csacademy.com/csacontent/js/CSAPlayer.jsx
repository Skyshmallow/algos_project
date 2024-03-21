import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {getOffset} from "../../stemjs/src/ui/Utils.js";
import {CardPanel, CardPanelStyle} from "../../stemjs/src/ui/CardPanel.jsx";
import {HorizontalSlideBar} from "../../stemjs/src/ui/input/SlideBar.jsx";
import {styleRuleInherit} from "../../stemjs/src/decorators/Style.js";
import {registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {ProgressBar} from "../../stemjs/src/ui/ProgressBar.jsx";
import {Button} from "../../stemjs/src/ui/button/Button.jsx";
import {Size} from "../../stemjs/src/ui/Constants.js";
import {Device} from "../../stemjs/src/base/Device.js";
import {interpolationValue} from "../../stemjs/src/math.js";
import {TransitionList, Transition, Modifier} from "../../stemjs/src/ui/Transition.js";
import {Color} from "../../stemjs/src/ui/Color.js";

class CSAPlayerContainer extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            width: "100%",
            height: "100%",
            position: "relative",
            display: "inline-block",
        });
    }
}

class PlayerCardPanelStyle extends CardPanelStyle {
    @styleRuleInherit
    heading = {
        backgroundColor: "#DBDBDB",
        color: "white"
    };

    @styleRuleInherit
    body = {
        padding: 0,
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden"
    }
}

@registerStyle(PlayerCardPanelStyle)
class PlayerCardPanel extends CardPanel {
    setOptions(options) {
        options = Object.assign({
            // level: "default",
            color: "#DBDBDB"
        }, options);

        super.setOptions(options);
        this.focused = false;
        return options;
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle({
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            height: this.options.height + "px",
            width: this.options.width + "px",
        });
    }

    render() {
        return (
            <SVG.SVGRoot ref="svg" width="100%" height="100%">
                {this.options.children}
            </SVG.SVGRoot>
        );
    }

    getChildrenToRender() {
        return [
            this.options.nonSVGChildren,
            super.getChildrenToRender(),
        ];
    }

    setColor(color) {
        this.options.color = color;
        if (this.node) {
            this.panelTitle.setStyle("background-color", color);
            this.setStyle("border-color", color);
        }
    }

    toggleFocus(duration, dependsOn=[], startTime=0) {
        let transitionList = new TransitionList();
        transitionList.dependsOn = dependsOn;
        let modifier = new Modifier({
            func: () => {
                this.focused = !this.focused
            },
            reverseFunc: () => {
                this.focused = !this.focused
            }
        });
        transitionList.push(modifier, false);

        let targetColor = this.focused ? "#DBDBDB" : "#87ACCC";
        transitionList.push(new Transition({
            func: (t, context) => {
                this.setColor(Color.interpolate(context.color, targetColor, t));
            },
            context: {
                color: this.options.color
            },
            duration: duration,
            dependsOn: [modifier]
        }), false);

        transitionList.setStartTime(startTime);
        return transitionList;
    }
};

class CSAPlayer extends UI.Element {
    getDefaultOptions() {
        return {
            speedFactor: 1,
            fullPlayer: true,
            speedInterpolationArray: [
                {x: 0, y: 0.5},
                {x: 0.25, y: 0.75},
                {x: 0.5, y: 1},
                {x: 0.75, y: 2},
                {x: 1, y: 4}
            ]
        };
    }

    setOptions(options) {
        if (this.getDefaultOptions) {
            let defaultOptions = this.getDefaultOptions();
            super.setOptions(Object.assign(defaultOptions, options));
        } else {
            super.setOptions(options);
        }
    }

    redraw() {
        this.pause();
        super.redraw();
        if (this.movie) {
            delete this.movie;
        }
    }

    render() {

        let buttonOptions = {
            style: {
                "margin": "0 5px",
                borderRadius: "4px",
            }
        };

        let result = [
            <ProgressBar ref="progressBar" active="true" value="0" disableTransition={true}
                            style={{height: "9px", "margin-bottom": "10px", cursor: "pointer"}}/>,
            <Button ref="playButton" level="default" size={Size.SMALL} style={buttonOptions.style} icon="play"/>,
            <Button ref="pauseButton" level="default" className="hidden" size={Size.SMALL} style={buttonOptions.style} icon="pause"/>,
            <Button ref="repeatButton" level="default" className="hidden" size={Size.SMALL} style={buttonOptions.style} icon="repeat"/>
        ];

        if (this.options.fullPlayer === true) {
            result.push(<Button ref="plusButton" level="default" className="pull-right" size={Size.SMALL} style={buttonOptions.style} icon="plus-circle"/>);
            result.push(<HorizontalSlideBar ref="speedBar" className="pull-right" width={100} barWidth={5} value="0.5" style={{margin: "0 8px"}}/>);
            result.push(<Button ref="minusButton" level="default" className="pull-right" size={Size.SMALL} style={buttonOptions.style} icon="minus-circle"/>);
        }

        return result;
    }

    setSpeedFactor(speedFactor) {
        this.options.speedFactor = speedFactor;
        if (this.movie) {
            this.movie.setSpeedFactor(speedFactor);
        }
    }

    pause() {
        this.options.paused = true;
        if (this.movie) {
            this.movie.pause();
        }
        if (this.pauseButton) {
            this.pauseButton.hide();
        }
        if (this.playButton) {
            this.playButton.show();
        }
    }

    play() {
        this.options.paused = false;
        if (this.movie) {
            this.movie.resume();
        } else {
            this.buildMovie();
            this.movie.setSpeedFactor(this.options.speedFactor);
            this.movie.startAtPercent(0);
        }
        this.playButton.hide();
        this.pauseButton.show();
    }

    repeat() {
        this.movie.startAtPercent(0);
        this.repeatButton.hide();
        this.pauseButton.show();
    }

    setProgressValue(progressValue) {
        this.progressBar.set(progressValue);
        if (progressValue === 1) {
            this.playButton.hide();
            this.pauseButton.hide();
            this.repeatButton.show();
        }
    }

    onMount() {
        if (this.options.fullPlayer) {
            this.speedBar.addListener("change", (newValue) => {
                this.setSpeedFactor(interpolationValue(this.options.speedInterpolationArray, newValue));
            });

            this.minusButton.addClickListener(() => {
                let newSpeed = this.options.speedInterpolationArray[0].x;
                for (let i = 0; i < this.options.speedInterpolationArray.length; i += 1) {
                    let speed = this.options.speedInterpolationArray[i];
                    if (speed.y < this.options.speedFactor) {
                        newSpeed = speed.x;
                    }
                }
                this.speedBar.setValue(newSpeed);
            });

            this.plusButton.addClickListener(() => {
                let newSpeed = this.options.speedInterpolationArray.last().x;
                for (let i = this.options.speedInterpolationArray.length - 1; i >= 0; i -= 1) {
                    let speed = this.options.speedInterpolationArray[i];
                    if (speed.y > this.options.speedFactor) {
                        newSpeed = speed.x;
                    }
                }
                this.speedBar.setValue(newSpeed);
            });
        }
        this.playButton.addClickListener(() => {
            this.play();
        });

        this.progressBar.addClickListener((event) => {
            if (!this.movie) {
                this.buildMovie();
                this.options.paused = false;
            }

            this.repeatButton.hide();
            if (this.options.paused) {
                this.playButton.show();
                this.pauseButton.hide();
            } else {
                this.playButton.hide();
                this.pauseButton.show();
            }

            let t = (Device.getEventX(event) - getOffset(this.progressBar).left) / this.progressBar.getWidth();
            this.movie.startAtPercent(t);
        });

        this.pauseButton.addClickListener(() => {
            this.pause();
        });

        this.repeatButton.addClickListener(() => {
            this.repeat();
        });
    }

    focusTransition(focusPanels, duration, dependsOn=[], startTime=0) {
        let transitions = new TransitionList();
        transitions.dependsOn = dependsOn;
        if (!Array.isArray(focusPanels)) {
            focusPanels = [focusPanels];
        }

        for (let i = 0; i < this.panels.length; i += 1) {
            let panel = this.panels[i];
            if (panel.focused && focusPanels.indexOf(panel) === - 1) {
                transitions.add(panel.toggleFocus(duration), false);
            }
        }

        for (let i = 0; i < focusPanels.length; i += 1) {
            let panel = focusPanels[i];
            if (!panel.focused) {
                transitions.add(panel.toggleFocus(duration), false);
            }
        }

        transitions.setStartTime(startTime);
        return transitions;
    }

    delayTransition(duration, dependsOn=[], startTime=0) {
        return new Transition({
            func: () => {},
            duration: duration,
            startTime: startTime,
            dependsOn: dependsOn
        });
    }
}

export {CSAPlayer, CSAPlayerContainer, PlayerCardPanel};
