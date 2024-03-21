import {UI, StyleSheet, registerStyle, styleRule, Link, Image} from "../../csabase/js/UI.js";
import {ContestSummary} from "../../contest/js/ContestSummary";
import {Device} from "../../stemjs/src/base/Device";

import {IEEEXtremeContestCountdown} from "./Countdown";
import {IEEE_PRIMARY_COLOR, IEEE_SECONDARY_COLOR} from "./Constants.js";
import {IEEELoginWidget, IEEESSOLoginWidget, IEEEPasswordResetRequestWidget} from "./IEEELoginWidget.jsx";


class IEEEXtremeContestSummaryStyle extends StyleSheet {
    @styleRule
    container = {
        width: 1200,
        // backgroundColor: "#ddd",
        margin: "0 auto",
        maxWidth: "100%",
    };

    @styleRule
    logoSectionContainer = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: Device.isMobileDevice() || window.innerWidth < 1125 ? "column" : "row",
    };

    @styleRule
    sectionContainer = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: Device.isMobileDevice() || window.innerWidth < 850 ? "column" : "row",
    };

    @styleRule
    logoContainer = {
        // width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    @styleRule
    image = {
        width: Device.isMobileDevice() ? "100%" : 450,
    };

    @styleRule
    countdown = {
        minWidth: Device.isMobileDevice() ? "100%" : 670,
    };

    @styleRule
    sectionTitleContainer = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    };

    @styleRule
    sectionTitle = {
        // width: 32,
        lineHeight: 30,
        paddingBottom: 20,

        textAlign: "center",
        fontSize: 25,

        borderBottom: "2px solid " + IEEE_PRIMARY_COLOR,

        display: "flex",
        justifyContent: "center",

        color: IEEE_SECONDARY_COLOR,
        marginTop: Device.isMobileDevice() ? 0 : 30,
        marginBottom: 20,
    };

    @styleRule
    sponsorsAndPartners = {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    };

    @styleRule
    sponsorContainer = {
        height: 200,
        color: "inherit",
        cursor: "pointer",
        width: "40%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    };

    @styleRule
    sponsorImageContainer = {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    };

    @styleRule
    sponsorImage = {
        width: 120,
        display: "flex",
    };

    @styleRule
    sponsorName = {
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        paddingTop: 10,
        flex: 1,
        textAlign: "center",
        fontSize: 17,
        maxHeight: 50,
        letterSpacing: 0.5,
    };

    @styleRule
    textSection = {
        fontSize: 17,
        // paddingLeft: "5%",
        // paddingRight: "5%",
        textAlign: "justify",
        lineHeight: 22,
        letterSpacing: 0.5,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingLeft: 30,
        paddingRight: 30,
    };

    @styleRule
    sponsorsAndPartnersLogosContainer = {
        display: "flex",
        justifyContent: "center",
    };

    loginContainer = {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    };

    @styleRule
    infoLinesContainer = {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
    };

    @styleRule
    infoLine = {
        width: "50%",
        textAlign: "center",
        color: IEEE_PRIMARY_COLOR,
        fontSize: 15,
        fontWeight: 700,
    };
}

@registerStyle(IEEEXtremeContestSummaryStyle)
export class IEEEXtremeContestSummary extends ContestSummary {
    getRegisterButton() {
        return null;
    }

    renderInfoLines() {
        const {contest} = this.options;
        const stats = contest.getStatistics() || {};
        const infoLines = [
            {label: UI.T("Teams Registered"), value: contest.getNumUsers() || "N/A"},
            {label: UI.T("Users Online"), value: stats.numUsersOnline || "N/A"},
            {label: UI.T("Submissions"), value: stats.numSubmissions || "N/A"},
            {label: UI.T("Compiles"), value: stats.numCompiles || "N/A"},
            {label: UI.T("Example Runs"), value: stats.numExampleRuns || "N/A"},
            {label: UI.T("Custom Runs"), value: stats.numCustomRuns || "N/A"},
        ].filter(infoLine => infoLine.value !== "0" && infoLine.value !== "N/A");

        return <div className={this.styleSheet.infoLinesContainer}>
            {
                infoLines.map((infoLine) => {
                    return <div className={this.styleSheet.infoLine}>
                        {infoLine.label} - {infoLine.value}
                    </div>;
                })
            }
        </div>;
    }

    getSectionTitle(title) {
        return [
            <div className={this.styleSheet.sectionTitleContainer}>
                <div className={this.styleSheet.sectionTitle}>
                    {title}
                </div>
            </div>,
        ];
    }

    getUnauthenticated() {
        if (USER.isAuthenticated) {
            return null;
        }
        const {contest} = this.options;

        return (
            <div className={this.styleSheet.sectionContainer} style={{alignItems: "flex-start"}}>
                <div className={this.styleSheet.textSection}>
                    {this.getSectionTitle("Sign in with IEEE Account")}
                    <p>
                        Login using your IEEE member account to continue to {contest.longName}:
                    </p>
                    <div className={this.styleSheet.loginWidget}>
                        <IEEESSOLoginWidget />
                    </div>
                </div>
                <div className={this.styleSheet.textSection}>
                    {this.getSectionTitle("Sign in")}
                    <p>
                        Login using your team account from the official email to continue to {contest.longName}:
                    </p>
                    <div className={this.styleSheet.loginContainer}>
                        <IEEELoginWidget />
                    </div>
                </div>
                <div className={this.styleSheet.textSection}>
                    {this.getSectionTitle("Forgot password?")}
                    <p>
                        Enter your email address below, and an email with further instructions on how to reset your password
                        will be sent to all members of your team:
                    </p>
                    <div className={this.styleSheet.loginContainer}>
                        <IEEEPasswordResetRequestWidget />
                    </div>
                </div>
            </div>
        );
    }

    getAboutIEEEXtreme() {
        const {contest} = this.options;

        return [
            <div className={this.styleSheet.textSection}>
                {this.getSectionTitle("IEEEXtreme")}
                <p>
                    <Link href="https://ieeextreme.org/" newTab>IEEEXtreme</Link> is a global challenge in which teams of IEEE Student
                    members – advised and proctored by an IEEE member, and often supported by an IEEE Student Branch – compete in a
                    24-hour time span against each other to solve a set of programming problems.
                </p>
                <p>
                    See the full {contest.longName} rules <Link href="https://ieeextreme.org/rules/" newTab>here</Link>.
                </p>
            </div>
        ]
    }

    getPlatformHelp() {
        return [
            <div className={this.styleSheet.textSection}>
                {this.getSectionTitle("Programming Environment")}
                <p>
                    You can find out more about the CS Academy environment from the <Link href="/about" newTab> about page</Link>.
                </p>
                <p>
                    To familiarize yourself with the platform, and try to solve some problems with the past IEEEXtreme competitions,
                    please access the <Link href="/ieeextreme-practice/" newTab>the practice community</Link>.
                </p>
            </div>
        ]
    }

    renderSponsor(sponsorInfo) {
        const [name, imageURL, websiteURL] = sponsorInfo;
        return [
            <Link className={this.styleSheet.sponsorContainer} href={websiteURL} newTab>
                <div className={this.styleSheet.sponsorImageContainer}>
                    <Image src={imageURL} className={this.styleSheet.sponsorImage} />
                </div>
                <div className={this.styleSheet.sponsorName}>
                    {name}
                </div>
            </Link>,
        ];
    }

    renderPartners() {
        const {contest} = this.options;
        const {partners} = contest.getExtraSummary();

        return [
            <div className={this.styleSheet.sponsorsAndPartners} style={{flex: .4}}>
                {this.getSectionTitle("Partners")}
                <div className={this.styleSheet.sponsorsAndPartnersLogosContainer}>
                    {(partners || []).map(partner => this.renderSponsor(partner))}
                </div>
            </div>,
            <div style={{paddingBottom: 50}} />,
        ];
    }

    renderSponsors() {
        const {contest} = this.options;
        const {sponsors} = contest.getExtraSummary();

        return [
            <div className={this.styleSheet.sponsorsAndPartners} style={{flex: 1}}>
                {this.getSectionTitle("Sponsors")}
                <div className={this.styleSheet.sponsorsAndPartnersLogosContainer}>
                    {(sponsors || []).map(sponsor => this.renderSponsor(sponsor))}
                </div>
            </div>,
        ];
    }

    renderLogo() {
        const {contest} = this.options;
        return <div className={`${this.styleSheet.logoContainer} ${this.styleSheet.textSection}`}>
            <Link href="https://ieeextreme.org" newTab>
                <Image src={contest.getLogoURL()} className={this.styleSheet.image}/>
            </Link>
            {this.renderInfoLines()}
        </div>;
    }

    render() {
        const {contest} = this.options;
        return [
            <div className={this.styleSheet.logoSectionContainer}>
                {this.renderLogo()}
                <IEEEXtremeContestCountdown contest={contest} className={`${this.styleSheet.countdown} ${this.styleSheet.textSection}`} />
            </div>,
            this.getUnauthenticated(),
            <div className={this.styleSheet.sectionContainer} style={{alignItems: "flex-start"}}>
                {this.getAboutIEEEXtreme()}
                {this.getPlatformHelp()}
            </div>,
            <div className={this.styleSheet.sectionContainer}>
                {this.renderPartners()}
                {this.renderSponsors()}
            </div>,
            <div className={this.styleSheet.sectionContainer}>
                <div style={{marginTop: 30}}>
                    <hr/>
                    <h4>For any technical issues, please send an email to contact@csacademy.com</h4>
                    <h4>Please try to provide as many details as possible for your problem (OS, browser, steps to reproduce, etc).</h4>
                    <h4>Have a great contest experience!</h4>
                </div>
            </div>,
            <div style={{height: 50, width: "100%"}} />,
        ];
    }
}
