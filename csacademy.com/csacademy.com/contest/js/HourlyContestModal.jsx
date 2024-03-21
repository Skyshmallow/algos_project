import {UI, ActionModal, Level, ButtonGroup, Button, Router} from "../../csabase/js/UI.js";

export class NextContestModal extends ActionModal {
    getTitle() {
        return UI.T("This contest has finished");
    }

    getBody() {
        let congrats;
        let contestUser = this.options.contest.getUser(USER.id);
        if (contestUser) {
            let rank = contestUser.rank;
            congrats = <p>
                {UI.T("Your rank:")} {rank}. {UI.T("Congratulations!")}
            </p>;
        }
        return <div>
            {congrats}
            <p>{UI.T("A new hourly contest will start soon!")}</p>
            <p>{UI.T("What would you like to do?")}</p>
        </div>;
    }

    getFooter() {
        return <ButtonGroup level={Level.PRIMARY}>
            <Button label={UI.T("Stay here")} onClick={() => this.hide()}/>
            <Button label={UI.T("Go to homepage")} onClick={() => {
                Router.changeURL([]);
                this.hide();
            }}/>
            <Button label={UI.T("Go to next contest")}
                       onClick={() => {
                           Router.changeURL(["contest", this.options.nextContestData.name]);
                           this.hide();
                       }}/>
        </ButtonGroup>;
    }
}


export class ContestCancelledModal extends ActionModal {
    getTitle() {
        return UI.T("This contest has been cancelled");
    }

    getBody() {
        return <div>
            <p>{UI.T("For an hourly contest to take place, at least one " +
                     "person should be registered before the contest starts.")}</p>
        </div>;
    }

    getFooter() {
        let nextContestButton;
        if (this.options.nextContestName) {
            nextContestButton = <Button label={UI.T("Go to next contest")}
                                        onClick={() => {
                                            Router.changeURL(["contest", this.options.nextContestName]);
                                            this.hide();
                                        }}/>
        }
        return <ButtonGroup level={Level.PRIMARY}>
            <Button label={UI.T("Stay here")} onClick={() => this.hide()}/>
            <Button label={UI.T("Go to homepage")}
                    onClick={() => {
                        Router.changeURL([]);
                        this.hide();
                    }}/>
            {nextContestButton}
        </ButtonGroup>;
    }
}
