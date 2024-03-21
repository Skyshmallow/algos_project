import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Level} from "../../stemjs/src/ui/Constants.js";
import {Link, Panel} from "../../stemjs/src/ui/UIPrimitives.jsx";
import {Label} from "../../stemjs/src/ui/SimpleElements.jsx";
import {Switcher} from "../../stemjs/src/ui/Switcher.jsx";
import {TabArea} from "../../stemjs/src/ui/tabs/TabArea.jsx";
import {EvalTaskStore} from "../../eval/js/state/EvalTaskStore.js";
import {EvalTaskUserSummaryStore} from "../../eval/js/state/EvalTaskUserSummaryStore.js";
import {ContestUserStore} from "../../contest/js/state/ContestUserStore.js";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {CodeforcesUserRatingSVG, CSAUserRatingSVG} from "../../csacontent/js/UserRatingChart.jsx";

import {PublicUserStore} from "./state/UserStore.js";
import {UserHandle} from "./UserHandle.jsx";
import {Emoji} from "../../csabase/js/ui/EmojiUI.jsx";


const LinkLabel = UI.Primitive(Label, "a");

class ActivityPanel extends UI.Element {
    getTaskLinks() {
        let taskLinks = [];
        for (let summary of EvalTaskUserSummaryStore.all()) {
            if (summary.userId === this.options.user.id && summary.solved) {
                taskLinks.push(<LinkLabel style={{margin: "4px", display: "inline-block"}} target="_blank"
                               href={"/contest/archive/task/" + EvalTaskStore.get(summary.evalTaskId).urlName}
                               level={Level.INFO}>
                               {EvalTaskStore.get(summary.evalTaskId).longName}</LinkLabel>);
            }
        }
        return taskLinks;
    }

    getContestLinks() {
        let contestLinks = [];
        for (let contestUser of ContestUserStore.all()) {
            if (contestUser.userId === this.options.user.id) {
                let contest = contestUser.getBaseContest();
                contestLinks.push(<p><Link href={"/contest/"+contest.name} value={contest.longName} /></p>);
            }
        }
        return contestLinks;
    }

    render() {
        if (this.options.loaded) {
            //let reputation;
            //if (USER.isSuperUser) {
            //    reputation = [
            //        <h4 style={{"margin-left": "35px"}}>{UI.T("Contribution")}</h4>,
            //        <LargeReputationWidget reputation={this.options.user.reputation} style={{"margin-left": "50px", "margin-bottom": "20px"}}/>
            //    ];
            //}
            let taskLinks = this.getTaskLinks();
            let contestLinks = this.getContestLinks();
            return [
                <h3>{UI.T("Activity")}</h3>,
                <h4 style={{"margin-left": "35px"}}>{UI.T("Algorithms")}</h4>,
                <div style={{"margin-bottom": "20px", "display": "inline-flex"}}>
                    <div style={{"width": "40%", "margin-left": "50px", "display": "inline-block"}}>
                        <span style={{"font-size": "1.3em", "margin-bottom": "10px"}}>{UI.T("Problems solved")}: {taskLinks.length}</span>
                        <div style={{
                                "max-height": "200px",
                                "overflow-y": "auto",
                                "overflow-x": "none",
                                "background-color": "#f3f4f6",
                                "padding": "5px",
                                "font-size": "1.2em"
                            }}>
                            {taskLinks}
                        </div>
                    </div>
                    <div style={{"width": "40%", "margin-left": "20px", "display": "inline-block"}}>
                        <span style={{"font-size": "1.3em", "margin-bottom": "10px"}}>{UI.T("Contest history")}: {contestLinks.length}</span>
                        <div style={{
                                "max-height": "200px",
                                "overflow-y": "auto",
                                "overflow-x": "none",
                                "background-color": "#f3f4f6",
                                "padding": "5px",
                                "font-size": "1.2em"
                            }}>
                            {contestLinks}
                        </div>
                    </div>
                </div>

                //TODO: interviews
            ];
        }
        if (this.options.errorInLoading) {
            return [
                <h3>{UI.T("Activity")}</h3>,
                <p style={{"marginLeft": "50px"}}>Error in loading activity</p>
            ];
        }
        Ajax.getJSON("/accounts/user_activity/", {
            "userId": this.options.user.id,
        }).then(
            () => this.updateOptions({loaded: true}),
            () => this.updateOptions({errorInLoading: true})
        );
        return [
            <h3>{UI.T("Activity")}</h3>,
            <p style={{"marginLeft": "50px"}}>Loading...</p>
        ];
    }
}

class ProfilePanel extends Panel {
    render() {
        let infos = [
            <p>Username: <UserHandle style={{display:"inline"}} userId={this.options.user.id}/></p>
        ];
        if (this.options.user.name != "") {
            infos.push(
                <p>{"Name: " + this.options.user.name}</p>
            );
        }
        if (this.options.user.globalRatingRank) {
            infos.push(<p> <Link href="/ratings/" value={"Rank: " + this.options.user.globalRatingRank} /> </p>);
        } else {
            infos.push(<p>Rank: N/A</p>);
        }

        if (this.options.user.countryId) {
            let country = this.options.user.getCountry();
            infos.push(<p> Country: {country.name}
                                <Emoji style={{paddingLeft: "3px"}} title={country.name}
                                      value={country.getEmojiName()} height="1.6em" width="1.6em"/>
                        </p>);
        }

        let rating = [];
        if (this.options.user.rating) {
            infos.push(<p>{"Rating: " + this.options.user.rating}</p>);
            rating.push(<h3>Rating</h3>);
            rating.push(<CSAUserRatingSVG ref="rating" data={this.options.user}/>);
        }
        return [
            <h3>General Info</h3>,
            <div style={{"marginLeft": "50px"}}>
                {infos}
            </div>,
            <ActivityPanel user={this.options.user} active={false}/>,
            ...rating
        ];
    }
}

class ExternalPanel extends Panel {
    render() {
        let rating = [];
        if (this.options.user.codeforcesRating.result && this.options.user.codeforcesRating.result.length > 0) {
            rating.push(<h4>Rating</h4>);
            rating.push(<CodeforcesUserRatingSVG data={this.options.user.codeforcesRating}/>);
        }

        return [
            <h3>Codeforces Profile</h3>,
            <div style={{"marginLeft": "50px"}}>
                <p>Handle: <a href={"http://codeforces.com/profile/" + this.options.user.codeforcesHandle} target="_blank">
                    {this.options.user.codeforcesHandle}
                </a></p>
            </div>,
            ...rating
        ];
    }
}


class UserProfilePanel extends TabArea {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.SMALL);
    }

    getSwitcher(tabPanels) {
        return <Switcher ref="switcherArea" style={{display: "table"}} lazyRender={this.options.lazyRender}>
                {tabPanels}
            </Switcher>;
    }

    setUser(user) {
        this.user = user;
    }

    render() {
        this.setUser(PublicUserStore.get(this.options.userId));

        this.options.children = [
            <ProfilePanel title="Profile" user={this.user} active={true}/>
        ];

        if (this.user.codeforcesRating) {
            this.options.children.push(
                <ExternalPanel title="External profiles" user={this.user}/>
            );
        }

        return this.options.children;
    }

    getChildrenToRender() {
        let ownUserInfo = [];
        if (this.options.userId == USER.id) {
            if (!USER.username) {
                ownUserInfo.push(<h3>You don't have a username set, please edit your profile</h3>);
            }
            ownUserInfo.push(<h4>To edit your account settings, please <Link href="/accounts/settings/general/">click here</Link></h4>)
        }
        return [
            ownUserInfo,
            super.getChildrenToRender()
        ]
    }
}

export {UserProfilePanel};
