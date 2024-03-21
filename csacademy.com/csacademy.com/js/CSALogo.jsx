import {UI} from "../../stemjs/src/ui/UIBase.js";
import {SVG} from "../../stemjs/src/ui/svg/SVGBase.js";
import {Theme} from "../../stemjs/src/ui/style/Theme.js";
import {ArticleTabArea} from "../../establishment/content/js/ArticleTabArea.jsx";
import {BlogArticleRenderer} from "../../establishment/blog/js/BlogArticleRenderer.jsx";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {ABOUT_ARTICLES} from "./state/CSASettings.js";

class LogoElectron extends SVG.Circle {
    updateCenter(baseAngle) {
        let angle = baseAngle + this.options.angleOffset;
        let x = this.options.nucleusCenter.x + Math.sin(angle) * this.options.outerRadius;
        let y = this.options.nucleusCenter.y + Math.cos(angle) * this.options.outerRadius;
        this.setCenter(x, y);
    }
}

class OuterLayer extends SVG.Group {
    getElectrons() {
        let electrons = [];
        for (let i = 0; i < this.options.electronCount; i += 1) {
            electrons.push(
                <LogoElectron ref={this.refLinkArray("electrons", i)}
                    radius={this.options.electronRadius}
                              angleOffset={i * Math.PI * 2 / this.options.electronCount}
                              outerRadius={this.options.radius} nucleusCenter={this.options.center} fill="black"/>
            );
        }
        return electrons;
    }

    render() {
        return [
            <SVG.Circle radius={this.options.radius} center={this.options.center} fill="transparent"
                           stroke="black" strokeWidth={this.options.strokeWidth} />,
            this.getElectrons()
        ];
    }

    recalcElectrons(seed) {
        const angleOffset = this.options.radius * Math.PI % 1; //randomish
        let baseAngle = -(seed * this.options.electronSpeed) / 2000 + angleOffset;
        for (let electron of this.electrons) {
            electron.updateCenter(baseAngle);
        }
    }
}

class CSAAtomLogo extends SVG.SVGRoot {
    setOptions(options) {
        super.setOptions(options);
        this.options = Object.assign({
            version: 7,
            electronSpeed: [1, 0.8, 0.5, 0.24, 0.1],
        }, this.options);

        const LAYER_MAX_SIZE = [2, 8, 18, 18, 18];
        let electronCount = [], numElectrons = this.options.version;
        let ringCount = 0;

        for (; ringCount < LAYER_MAX_SIZE.length && numElectrons; ringCount += 1) {
            const numElectronsOnLayer = Math.min(numElectrons, LAYER_MAX_SIZE[ringCount]);
            electronCount.push(numElectronsOnLayer);
            numElectrons -= numElectronsOnLayer;
        }

        this.options.ringCount = ringCount;
        this.options.electronCount = electronCount;
        this.setSize(this.options.size);
    }

    setSize(size, doRedraw) {
        if (!size) {
            console.error("You need to specify a size for the logo!");
        }
        this.size = size;
        this.nucleusCenter = {
            x: size / 2,
            y: size / 2
        };

        const scalingFactor = Math.log2(this.options.ringCount + 1);

        this.nucleusRadius = 0.08 * size / scalingFactor;
        this.electronRadius = 0.034 * size / scalingFactor;
        this.electronRingStrokeWidth = 0.01 * size / scalingFactor;
        this.maxRadius = 0.4 * size;

        if (doRedraw) {
            this.redraw();
        }
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();

        attr.setStyle("height", this.size + "px");
        attr.setStyle("width", this.size + "px");

        return attr;
    }

    getRings() {
        let rings = [];
        for (let i = 0; i < this.options.ringCount; i += 1) {
            rings.push(
                <OuterLayer
                    ref={this.refLinkArray("rings", i)}
                    center={this.nucleusCenter}
                    radius={(i + 1) * this.maxRadius / this.options.ringCount}
                    strokeWidth={this.electronRingStrokeWidth}
                    electronRadius={this.electronRadius}
                    electronCount={this.options.electronCount[i]}
                    electronSpeed={this.options.electronSpeed[i]}
                />
            );
        }
        return rings;
    }

    render() {
        return [
            this.getRings(),
            <SVG.Circle ref="nucleusCircle" center={this.nucleusCenter} radius={this.nucleusRadius} fill="black"/>
        ];
    }

    onMount() {
        this.redrawOrbitAnimation = () => {
            if (!this.isInDocument()) {
                return;
            }

            let seed = Date.now();
            for (let ring of this.rings) {
                ring.recalcElectrons(seed);
            }
            requestAnimationFrame(this.redrawOrbitAnimation);
        };

        requestAnimationFrame(this.redrawOrbitAnimation);
    }
}

class CSALogoSwarm extends SVG.SVGRoot {
    constructor(options) {
        super(options);
        this.extraAngles = new Array(250);
        this.outerRadius = [];
        this.electrons = [];
        for (let i = 0; i < this.extraAngles.length; i++) {
            this.extraAngles[i] = Math.random() * 2.0 * Math.PI;
            this.outerRadius[i] = 160 * Math.random();
        }
        this.size = this.options.size || 400;
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();

        attr.setStyle("height", this.size + "px");
        attr.setStyle("width", this.size + "px");

        return attr;
    }

    render() {
        let angle = -Date.now() / 1000;
        let outerRadius = 160;
        let nucleusCenter = {x: 200, y: 200};

        let electrons = [];
        for (let i = 0; i < this.extraAngles.length; i++) {
            angle += this.extraAngles[i];
            let electronCenter = {
                x: nucleusCenter.x + Math.sin(angle) * this.outerRadius[i],
                y: nucleusCenter.y + Math.cos(angle) * this.outerRadius[i]
            };
            let fillColor = "#"+((1<<24)*Math.random()|0).toString(16);

            electrons.push(<SVG.Circle key={i+1} center={electronCenter} radius={1}
                                          fill={fillColor}/>);
        }
        this.electrons = electrons;

        return electrons;
    }

    updateCircles() {
        let nucleusCenter = {x: 200, y: 200};
        let angle = -Date.now() / 1000;

        let extraAngles = this.extraAngles;
        let nrAngles = extraAngles.length;

        for (let i = 0; i < nrAngles; i += 1) {
            angle += extraAngles[i];
            this.electrons[i].setCenter(nucleusCenter.x + Math.sin(angle) * this.outerRadius[i],
                nucleusCenter.y + (Math.cos(angle)) * this.outerRadius[i]);
            this.electrons[i].setRadius(Math.abs((angle % 1)) * 5);
        }
    }

    onMount() {
        var timesCounted = 0, totalDuration = 0;
        var lastTime = performance.now();

        var redrawOrbit = () => {
            let startTime = window.performance.now();
            this.updateCircles();
            totalDuration += window.performance.now() - startTime;
            timesCounted += 1;
            //console.log("Redraw avg duration: ", totalDuration / timesCounted);
            lastTime = performance.now();
            requestAnimationFrame(redrawOrbit);
        };

        requestAnimationFrame(redrawOrbit);
    }
}

class CSALogo extends SVG.SVGRoot {
    getDefaultOptions() {
        return {
            size: 500,
            color: Theme.props.COLOR_PRIMARY || "black",
            background: "transparent",
        };
    }


    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setAttribute("height", this.options.size + "px");
        attr.setAttribute("width", this.options.size + "px");
        attr.setAttribute("preserveAspectRatio", "none");
        attr.setAttribute("viewBox", "0 0 500 500");
    }

    render() {
        let scale = 50;
        let center = 250;
        return [
            <SVG.Group ref="circlesGroup">
                <SVG.Circle radius={1.15 * scale} center={{x: 5 * scale, y: 1.25 * scale}} strokeWidth="0"
                            stroke={this.options.color} fill={this.options.color}/>
                <SVG.Circle radius={1.15 * scale} center={{x: 5 * scale, y: 1.25 * scale}} strokeWidth="0"
                            stroke={this.options.color} fill={this.options.color}
                            transform={`rotate(240,${center},${center})`}/>
                <SVG.Circle radius={1.15 * scale} center={{x: 5 * scale, y: 1.25 * scale}} strokeWidth="0"
                            stroke={this.options.color} fill={this.options.color}
                            transform={`rotate(120,${center},${center})`}/>
            </SVG.Group>,
            <SVG.Group ref="triangleGroup">
                <SVG.Path stroke={this.options.color} strokeWidth={scale}
                          d={`M${5 * scale},${(5 - 1.6 * Math.sqrt(3) * 2 / 3) * scale}L${(5 - 1.6 * 1) * scale},${(5 + 1.6 * Math.sqrt(3) / 3) * scale}L${(5 + 1.6) * scale},${(5 + 1.6 * Math.sqrt(3) / 3) * scale}z`}
                          fill={this.options.background}/>
            </SVG.Group>,
            <SVG.Group ref="linesGroup">
                <SVG.Rect stroke={this.options.color} strokeWidth="0" x={4.5 * scale} y={1 * scale}
                          width={1 * scale} height={3 * scale} fill={this.options.color}/>
                <SVG.Rect stroke={this.options.color} strokeWidth="0" x={4.5 * scale} y={1 * scale}
                          width={1 * scale} height={3 * scale} fill={this.options.color}
                          transform={`rotate(240,${center},${center})`}/>
                <SVG.Rect stroke={this.options.color} strokeWidth="0" x={4.5 * scale} y={1 * scale}
                          width={1 * scale} height={3 * scale} fill={this.options.color}
                          transform={`rotate(120,${center},${center})`}/>
            </SVG.Group>,
        ];
    }

}


class CSALoadingLogo extends CSALogo {
    easeFunction(t) {
        if (t < 0) {
            t = 0;
        }
        if (t > 1) {
            t = 1;
        }
        t *= 2.0;
        if (t < 1) return 0.5 * t * t + 0;
        t--;
        return -0.5 * (t * (t - 2 ) - 1) + 0;
    };

    onMount() {
        let speed = 0.05;
        let totalRotation = 0;
        let totalEase = 0;
        let previousEase = 0;
        let change = false;
        let animateOpacity;
        let totalOpacity = 0;
        let sign = 1;
        let animateRotation = () => {
            totalRotation += speed;
            if (totalRotation >= 1) {
                totalRotation = 0;
                totalEase += 60;
                // change = true;
            }
            let currentEase = this.easeFunction(totalRotation) * 60;
            let center = 250;
            this.circlesGroup.setAttribute("transform",
                                           `rotate(${totalEase + currentEase},${center},${center})`);
            this.triangleGroup.setAttribute("transform",
                                            `rotate(${-(totalEase + currentEase)},${center},${center})`);
            this.linesGroup.setAttribute("transform",
                                            `rotate(${totalEase + currentEase},${center},${center})`);
            if (change) {
                change = false;
                // requestAnimationFrame(animateOpacity);
            } else {
                this.animationFrame = requestAnimationFrame(animateRotation);
            }
        };

        this.animationFrame = requestAnimationFrame(animateRotation);
    }

    onUnmount() {
        cancelAnimationFrame(this.animationFrame);
    }
}

class CSAAboutPage extends UI.Element {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.EXTRA_SMALL);
    }

    render() {
        return [
            <ArticleTabArea variableHeightPanels ref="articleTabArea" path="/about">
                {ABOUT_ARTICLES}
            </ArticleTabArea>,
            <hr/>,
            <div style={{"text-align": "center"}}>
                <h2>CS Academy version <strong>Nitrogen</strong></h2>
                <CSAAtomLogo size={300} />
            </div>
        ];
    }

    setURL(urlParts) {
        this.articleTabArea.setURL(urlParts);
    }
}

class BlogAtomLogo extends UI.Element {
    extraNodeAttributes(attr) {
        attr.setStyle({
            textAlign: "center",
        });
    }

    render() {
        return <CSAAtomLogo {...this.options} />;
    }
}

BlogArticleRenderer.markupClassMap.addClass("CSAAtomLogo", BlogAtomLogo);

export {CSAAtomLogo, CSALogoSwarm, CSALogo, CSALoadingLogo, CSAAboutPage};
