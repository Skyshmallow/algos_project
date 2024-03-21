import {
    ButtonStyle
} from "../../../stemjs/src/ui/button/ButtonStyle.js";
import {
    styleRule,
    styleRuleInherit
} from "../../../stemjs/src/decorators/Style.js";
import {
    StyleSheet
} from "../../../stemjs/src/ui/Style.js";
import {
    DefaultTabAreaStyle
} from "../../../stemjs/src/ui/tabs/Style.js";
import {
    SectionDividerStyle
} from "../../../stemjs/src/ui/section-divider/Style.js";
import {
    HorizontalOverflowStyle
} from "../../../stemjs/src/ui/horizontal-overflow/Style.js";
import {
    enhance
} from "../../../stemjs/src/ui/Color.js";


class WorkspaceButtonStyle extends ButtonStyle {
    workspaceBase = Object.assign({}, this.base, {
        border: "none",
        borderRadius: "0",
        fontSize: "14px",
    });

    @styleRule
    RUN = [this.workspaceBase, this.colorStyleRule(this.themeProps.COLOR_RUN)];

    @styleRule
    COMPILE = [this.workspaceBase, this.colorStyleRule(this.themeProps.COLOR_COMPILE)];

    @styleRule
    SUBMIT = [this.workspaceBase, this.colorStyleRule(this.themeProps.COLOR_SUBMIT)];
};


export class WorkspaceStyle extends StyleSheet {
    workspaceBackground = () => this.themeProps.COLOR_WORKSPACE;
    menuButtonSelected = () => enhance(this.workspaceBackground(), 1);
    menuButtonColor = () => enhance(this.workspaceBackground(), .8);
    menuSelectSelected = () => enhance(this.workspaceBackground(), .3);
    menuSelectBackground = () => enhance(this.workspaceBackground(), .2);

    menuButtonSelectedStyle = {
        color: this.menuButtonSelected,
        background: "none",
    };

    menuSelectSelectedStyle = {
        color: this.menuButtonSelected,
        background: this.menuSelectSelected,
    };

    menuSelectBackgroundStyle = {
        background: this.menuSelectBackground,
    };

    menuButtonStyle = {
        fontSize: "14px",
        background: "none",
        border: "none",
        fontWeight: "bold",
        padding: "5px 10px",
        color: this.menuButtonColor,
        ":hover": this.menuButtonSelectedStyle,
        ":focus": {
            background: "none"
        },
        ":active": {
            background: "none"
        },
        ":focus:active": {
            background: "none"
        },
        ":hover:active": {
            background: "none"
        },
        outline: "0",
    };

    @styleRule
    actionButtons = {
        whiteSpace: "nowrap",
        padding: "5px 0",
        float: "right",
        ">*": {
            marginRight: "5px",
            display: "inline-block",
        },
        paddingLeft: "5px",
    };

    @styleRule
    menuButton = this.menuButtonStyle;

    @styleRule
    menuSelect = Object.assign({}, this.menuButtonStyle, {
        cursor: "pointer",
        ":hover": this.menuSelectSelectedStyle,
        ":focus": this.menuSelectBackgroundStyle,
        ":active": this.menuSelectBackgroundStyle,
        ":focus:active": this.menuSelectBackgroundStyle,
        ":hover:active": this.menuSelectSelectedStyle,
        ":hover:focus": this.menuSelectSelectedStyle,
        background: this.menuSelectBackground,
        marginLeft: "10px",
        height: "1.9em",
        verticalAlign: "middle"
    });

    @styleRule
    workspace = {
        backgroundColor: this.workspaceBackground,
    };

    @styleRule
    optionButtons = {
        ">*": {
            whiteSpace: "nowrap",
            margin: "5px 2.5px 5px 2.5px",
        },
        whiteSpace: "nowrap",
    };

    @styleRule
    bottomTab = {
        backgroundColor: this.themeProps.COLOR_BACKGROUND,
    };

    @styleRule
    tabAreaTitleArea = {
        display: "flex",
        width: "100%",
        backgroundColor: this.workspaceBackground,
    };

    @styleRule
    expandTabAreaButton = {
        ">:first-child": {
            transform: "rotate(180deg)",
            fontSize: "120%",
            position: "relative",
            width: "1em",
            height: "1em",
            borderRadius: "100%",
            transition: "transform .3s ease",
            verticalAlign: "top",
        },
        ">:first-child::before": {
            position: "absolute",
            left: 0,
            top: "-.1em",
        },
    };

    @styleRule
    expandedButton = {
        ">:first-child": {
            transform: "rotate(0deg) !important",
        },
    };
};


export class WorkspaceTabAreaStyle extends DefaultTabAreaStyle {
    navBackground = () => this.themeProps.COLOR_WORKSPACE;
    tabColor = () => enhance(this.navBackground(), .8);
    tabHoverBackground = () => enhance(this.navBackground(), .1);
    tabHoverColor = () => enhance(this.navBackground(), .9);
    tabActiveColor = () => enhance(this.navBackground(), 1);
    tabActiveBackground = () => enhance(this.navBackground(), -.2);

    transitionTime = .2;

    @styleRule
    workspaceTab = {
        position: "relative",
        ">*": {
            position: "absolute",
            height: "100%",
            width: "100%",
        },
    };

    @styleRuleInherit
    tab = {
        color: this.tabColor,
        border: "none",
        borderRadius: "0",
        margin: "0",
        fontSize: "14px",
        padding: "6px",
        paddingRight: "12px",
        paddingLeft: "12px",
        transition: "padding " + this.transitionTime + "s ease",
        ":hover": {
            cursor: "pointer",
            backgroundColor: this.tabHoverBackground,
            border: "none",
            color: this.tabHoverColor
        },
    };

    @styleRuleInherit
    activeTab = {
        border: "none",
        color: this.tabActiveColor,
        backgroundColor: this.tabActiveBackground,
        paddingTop: "3px",
        ":hover": {
            backgroundColor: this.tabActiveBackground,
            color: this.tabActiveColor,
        }
    };

    @styleRuleInherit
    nav = {
        border: "none",
        whiteSpace: "nowrap",
        backgroundColor: this.navBackground,
    };
}


export class WorkspaceSectionDividerStyle extends SectionDividerStyle {
    transitionTime = 0.3;
    barPadding = 0;
    barThickness = 5;
    dividerColor = () => enhance(this.themeProps.COLOR_WORKSPACE, .3);

    @styleRule
    animatedSectionDivider = {
        ">*": {
            transition: this.transitionTime + "s height ease",
        }
    }
}


export class WorkspaceHorizontalOverflowStyle extends HorizontalOverflowStyle {
    baseColor = () => this.themeProps.COLOR_WORKSPACE;
}


export const workspaceButtonStyle = new WorkspaceButtonStyle();