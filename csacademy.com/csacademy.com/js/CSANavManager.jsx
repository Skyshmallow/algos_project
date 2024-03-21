import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Theme, registerStyle} from "../../stemjs/src/ui/style/Theme.js";
import {Direction} from "../../stemjs/src/ui/Constants.js";
import {Accordion} from "../../stemjs/src/ui/section-divider/Accordion.jsx";
import {AccordionStyle} from "../../stemjs/src/ui/section-divider/Style.js";
import {FAIcon} from "../../stemjs/src/ui/FontAwesome.jsx";
import {LoginModal} from "../../establishment/accounts/js/LoginModal.jsx";
import {Logout} from "../../csaaccounts/js/Logout.js";
import {BasePopup} from "../../establishment/content/js/Popup.jsx";
import {NavManager} from "../../stemjs/src/ui/navmanager/NavManager.jsx";
import {
    navSessionManager,
    NavSection,
    NavElement,
    NavLinkElement,
    NavAnchoredNotifications
} from "../../stemjs/src/ui/navmanager/NavElement.jsx";
import {NavStyle} from "../../stemjs/src/ui/navmanager/NavStyle.js";
import {enhance} from "../../stemjs/src/ui/Color.js";
import {UserStore} from "../../csaaccounts/js/state/UserStore.js";
import {styleRule, styleRuleInherit, StyleSheet} from "../../stemjs/src/ui/Style.js";
import {Router} from "../../stemjs/src/ui/Router.jsx";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";

import {NavGlobalChat} from "./ui/NavGlobalChat.jsx";
import {NavRecentActivity} from "./ui/NavRecentActivity.jsx";
import {CSALogo} from "./CSALogo.jsx";
import {NotificationsIcon, MessagesIcon, LanguagesIcon, WebsocketStatusIcon} from "./CSANavIcons.jsx";
import {getTextColor} from "../../stemjs/src/ui/GlobalStyle.js";

class PersistentAccordionStyle extends AccordionStyle {
    @styleRuleInherit
    accordion = {
        ">:nth-of-type(odd)": {
            color: NavStyle.getInstance().colors.text,
            transition: `background-color ${NavStyle.getInstance().dimensions.backgroundTransitionDuration}`,
            ":hover": {
                backgroundColor: NavStyle.getInstance().colors.sidepanelHover,
            }
        }
    };
}

@registerStyle(PersistentAccordionStyle)
class PersistentAccordion extends Accordion {
    sessionManager = navSessionManager;

    onMount() {
        super.onMount();

        let childrenStatus = this.sessionManager.get(this.options.sessionKey);
        if (childrenStatus) {
            this.setChildrenStatus(childrenStatus);
        } else {
            this.setChildrenStatus(this.getDefaultChildrenStatus());
        }

        this.addListener("childrenStatusChange", () => {
            this.sessionManager.set(this.options.sessionKey, this.getChildrenStatus());
            NavManager.Global.dispatch("changedAccordion");
        });
        this.addListener("dragging", () => {
            NavManager.Global.dispatch("changedAccordion");
        });
    }
}


class OnlineButtonStyle extends StyleSheet {
    @styleRule
    online = {
        display: "inline-block",
        height: "calc(1em + 16px)",
        padding: "8px",
        top: 0,
        position: "absolute",
        right: 0,
        color: enhance(this.themeProps.COLOR_PRIMARY, 1),
        cursor: "pointer",
        backgroundColor: enhance(this.themeProps.COLOR_PRIMARY, .2),
        ":hover": {
            backgroundColor: enhance(this.themeProps.COLOR_PRIMARY, .3),
        }
    };
}


class CSANavManager extends NavManager {
    getRightFixed() {
        if (USER.isAuthenticated) {
            return [
                <NavAnchoredNotifications anchor={Direction.RIGHT}>
                    <LanguagesIcon/>
                    <MessagesIcon/>
                    <NotificationsIcon/>
                </NavAnchoredNotifications>
            ];
        } else {
            return [<NavSection anchor={Direction.RIGHT}>
                <LanguagesIcon/>
                <NavElement value={[<FAIcon icon="sign-in" style={Object.assign({}, {
                    fontSize: "170%",
                    paddingRight: "6px",
                    width: "auto",
                    verticalAlign: "middle",
                })}/>, UI.T("Sign in")]} style={{textTransform: "uppercase",}} onClick={() => LoginModal.show()}/>
            </NavSection>];
        }
    }

    getSuperUserArea() {
        if (!USER.isSuperUser && !USER.isProblemsetter) {
            return [];
        }
        let problemsetterLinks = [
            <NavLinkElement value={[UI.T("Eval Tasks")]} href="/eval/manager/"/>,
            <NavLinkElement value={[UI.T("My Contests")]} href="/contest/manager/"/>
        ];
        if (USER.isSuperUser) {
            const serverAdminSection = USER.isStaff &&
                <NavElement value={UI.T("Server (Admin)")} persistent sessionKey="server">
                    <NavLinkElement value={[UI.T("Machines")]} href="/manage/icarus/"/>
                    <NavLinkElement value={[UI.T("Analytics")]} href="/analytics/"/>
                    <NavLinkElement value={[UI.T("Users")]} href="/manage/users/"/>
                    <NavLinkElement value={[UI.T("Commands")]} href="/baseconfig/command/manager/"/>
                    <NavLinkElement value={[UI.T("Testing")]} href="/testing/"/>
                </NavElement>;

            return [
                <hr className={this.styleSheet.hrStyle}/>,
                <NavSection>
                    {serverAdminSection}
                    <NavElement value={UI.T("Content (Admin)")} persistent sessionKey="content">
                        {[
                            ...problemsetterLinks,
                            <NavLinkElement value={[UI.T("Checkers")]} href="/eval/checkers/"/>,
                            <NavLinkElement value={[UI.T("Private Archives")]} href="/private-archives/"/>,
                            <NavLinkElement value={[UI.T("Eval Jobs")]} href="/eval/global/"/>,
                            <NavLinkElement value={[UI.T("Articles")]} href="/article/manager/"/>,
                            <NavLinkElement value={[UI.T("Raw Ratings")]} href="/real_ratings/"/>,
                            <NavLinkElement value={[UI.T("Reputation")]} href="/reputations/"/>,
                            <NavLinkElement value={[UI.T("File Storage")]} href="/storage/manager/"/>,
                        ]}
                    </NavElement>
                </NavSection>
            ];
        }
        return [
            <hr className={this.styleSheet.hrStyle}/>,
            <NavElement value={UI.T("Content (Admin)")} persistent sessionKey="content">
                {problemsetterLinks}
            </NavElement>
        ];
    }

    getLeftSidePanelFixedChildren() {
        return [];
    }

    getLeftSidePanelChildren() {
        let userArea = [];
        if (USER.isAuthenticated) {
            const currentUser = UserStore.getCurrentUser();
            const myProfileLink = (USER.username) ? "/user/" + USER.username : "/userid/" + USER.id;
            let currentUserDisplay = (currentUser.displayName ? currentUser.firstName + " " + currentUser.lastName : currentUser.username);
            currentUserDisplay = currentUserDisplay || <em style={{color: "red"}}><strong>no username set</strong></em>;
            userArea.push(<NavElement value={["Profile (", currentUserDisplay, ")"]} persistent sessionKey="user"
                                      defaultToggled>
                <NavLinkElement value={[UI.T("My Profile")]} href={myProfileLink}/>
                <NavLinkElement value={[UI.T("Account Settings")]} href="/accounts/settings/"/>
                <NavLinkElement value={[UI.T("Workspace Settings")]} href="/accounts/workspace_settings/"/>
                <NavLinkElement value={[UI.T("Messages")]} href="/messages/"/>
            </NavElement>);
            userArea.push(<NavElement value={[UI.T("Logout")]} onClick={() => Logout.logout()}/>);
        }
        userArea.push(<WebsocketStatusIcon/>);
        return [
            <NavSection>
                <NavLinkElement value={[<CSALogo style={{marginRight: "6px", verticalAlign: "middle"}}
                                                 size="14" color={getTextColor(Theme.Global.properties.COLOR_PRIMARY)}
                                                 background="transparent"/>, UI.T("Home")]} href="/"/>
                <NavElement value={UI.T("Interviews")} persistent sessionKey="interviews" defaultToggled>
                    <NavLinkElement value={UI.T("Tasks")} href="/contest/interview-archive/"/>
                    <NavLinkElement value={UI.T("My Interviews")} href="/interview/"/>
                </NavElement>
                <NavElement value={UI.T("Algorithms")} persistent sessionKey="algorithms" defaultToggled>
                    <NavLinkElement value={UI.T("Tasks")} href="/contest/archive/"/>
                    <NavLinkElement value={UI.T("Lessons")} href="/lessons/"/>
                    <NavLinkElement value={UI.T("Contests")} href="/contests/"/>
                    <NavLinkElement value={UI.T("Leaderboard")} href="/ratings/"/>
                </NavElement>
                <NavElement value={UI.T("Apps")} persistent sessionKey="apps">
                    <NavLinkElement value={UI.T("Graph Editor")} href="/app/graph_editor/"/>
                    <NavLinkElement value={UI.T("Geometry Widget")} href="/app/geometry_widget/"/>
                    <NavLinkElement value={UI.T("Diff Tool")} href="/app/diffing_tool/"/>
                </NavElement>
                <NavLinkElement value={UI.T("Workspace")} href="/workspace/"/>
            </NavSection>,
            <hr className={this.styleSheet.hrStyle}/>,
            <NavSection>
                <NavLinkElement value={UI.T("Forum")} href="/forum/"/>
                <NavLinkElement value={UI.T("Blog")} href="/blog/"/>
                <NavLinkElement value={UI.T("About")} href="/about/"/>
            </NavSection>,
            <hr className={this.styleSheet.hrStyle}/>,
            <NavSection>
                {userArea}
            </NavSection>,
            ...this.getSuperUserArea()
        ];
    }

    getRightSidePanelChildren() {
        const onlineButton = <div ref={this.refLink("onlineButton")}
                                  className={OnlineButtonStyle.getInstance().online}/>;

        return [<NavSection style={{height: "100%", position: "relative"}}>
            <PersistentAccordion
                ref={this.refLink("accordion")}
                style={{height: "100%", bottom: "0"}}
                sessionKey="accordion"
            >
                <NavGlobalChat ref={this.refLink("navChat")} style={{backgroundColor: "#fafafa"}}
                               title={[UI.T("Chat"), onlineButton]}/>
                <NavRecentActivity title={UI.T("Activity")} style={{backgroundColor: "#fafafa"}}/>
            </PersistentAccordion>
            {onlineButton}
        </NavSection>];
    }

    initGlobalRouterListener() {
        Router.Global.addListener("change", () => {
            // TODO: This needs rethinking
            setTimeout(() => {
                this.checkForWrap();
            }, 0);
        });
    }

    onMount() {
        super.onMount();

        // This is also dispatched on url change
        document.body.addEventListener("click", () => {
            if (this.leftSidePanel && this.leftSidePanel.visible) {
                this.toggleLeftSidePanel();
            }
        });

        this.attachListener(this.navChat, "updateOnlineUsers", () =>
            this.onlineButton.setChildren([<FAIcon icon="users" style={{marginRight: "5px"}}/>,
                this.navChat.onlineUsers.size + " online"]));

        this.onlineButton.addClickListener(() => this.togglePopup(this.navChat.onlineUsers));
    }

    togglePopup(onlineUsers) {
        if (this.onlineUsersPopup && this.onlineUsersPopup.isInDocument()) {
            this.onlineUsersPopup.hide();
            delete this.onlineUsersPopup;
            return;
        }
        if (onlineUsers.size) {
            this.onlineUsersPopup = BasePopup.create(document.body, {
                target: this.onlineButton,
                children: Array.from(onlineUsers).map(userId => <div style={{width: "100%"}}><UserHandle
                    userId={userId}/></div>),
                arrowDirection: Direction.UP,
                bodyPlaced: true,
                style: {
                    zIndex: 3000,
                }
            });
        }
    }
}

let initializeNavbar = () => {
    NavManager.Global = NavManager.Global || new CSANavManager();
    return NavManager.Global;
};

export {initializeNavbar, CSANavManager};
