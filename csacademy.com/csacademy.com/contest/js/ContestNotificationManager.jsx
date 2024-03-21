import {UI} from "../../csabase/js/UI.js";
import {Link, styleRule, registerStyle, Size, Level, Button, ButtonGroup, CardPanel, CardPanelStyle} from "../../csabase/js/UI.js";
import {Theme} from "../../stemjs/src/ui/style/Theme.js";
import {StemDate} from "../../stemjs/src/time/Date.js";
import {ContestLocalStorageManager} from "./ContestLocalStorageManager.jsx";


class ContestNotificationStyle extends CardPanelStyle {
    timeout = 1000;

    @styleRule
    className = {
        boxShadow: "none",
        backgroundColor: this.themeProps.COLOR_BACKGROUND,
        zIndex: 9999,
        position: "fixed",
        right: "10px",
        top: "-100px",
        opacity: "0",
        transition: this.timeout / 1000 + "s all ease",
        fontSize: "110%",
    };

    body = {
        width: "320px",
        padding: "10px",
    };

    @styleRule
    visible = {
        top: "39px",
        opacity: "1",
    };

    @styleRule
    buttonGroup = {
        float: "right",
        marginBottom: "5px",
        marginRight: "-5px",
        ">*": {
            padding: "2px 4px",
        }
    };

    @styleRule
    textBoxClass = {
        display: "block",
        cursor: "pointer",
        height: "2em",
        marginBottom: "15px",
        ":hover": {
            textDecoration: "none",
        }
    };
}


@registerStyle(ContestNotificationStyle)
class ContestNotification extends CardPanel {
    getDefaultOptions() {
        return Object.assign({}, super.getDefaultOptions(), {
            level: Level.WARNING,
            bodyStyle: this.styleSheet.body,
        })
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        if (this.options.manager.notificationCount === 1) {
            attr.setStyle("boxShadow", Theme.props.DARK_BOX_SHADOW);
        }
        attr.addClass(this.styleSheet.className);
    }

    show() {
        this.addClass(this.styleSheet.visible);
    }

    hide() {
        this.removeClass(this.styleSheet.visible);
        setTimeout(() => this.options.manager.deleteNotification(this.options.data), this.styleSheet.timeout);
    }

    render() {
        const {manager} = this.options;

        if (this.options.data.link) {
            this.message = <Link className={this.styleSheet.textBoxClass}
                                 href={this.options.data.link} value={this.options.data.message} />;
        } else {
            this.message = <div className={this.styleSheet.textBoxClass}>{this.options.data.message}</div>
        }
        const closeAllButton = manager.notificationCount > 1 && <Button
            ref="closeAll"
            onClick={() => manager.deleteAll()}
        >
            {"Close all(" + (manager.notificationCount) + ")"}
        </Button>;
        return [
            this.message,
            <ButtonGroup size={Size.SMALL} level={Level.DANGER} className={this.styleSheet.buttonGroup}>
                {closeAllButton}
                <Button ref="close" onClick={() => this.hide()}>Close</Button>
            </ButtonGroup>
        ]
    }

    onMount() {
        setTimeout(() => this.show(), 100);
        if (this.options.data.link) {
            this.message.addClickListener(() => {
                if (this.options.data.id) {
                    window.location.hash = this.options.data.id;
                }
                this.hide();
            });
        }
    }
}

export class ContestNotificationManager {
    // contestId is needed as an identifier only.
    constructor(contestId) {
        this.notifications = new Map();
        this.notificationCount = 0;
        this.localStorageMap = ContestLocalStorageManager.getNotificationsLocalStorageMap(contestId);
        const notificationData = this.getAllDataFromStorage();
        for (const [key, data] of notificationData) {
            this.createNotification(data, false);
        }
        this.localStorageMap.addChangeListener((event) => {
            if (!event.newValue) {
                // removed
                this.deleteNotification(event.oldValue, false);
            }
        });
    }

    getAllDataFromStorage() {
        return this.localStorageMap.entries().sort((a, b) => a[1].timeAdded - b[1].timeAdded);
    }

    // data is an object that contains the fields "message", "link", "title" and "id".
    createNotification(data, addData = true) {
        if (addData) {
            data.timeAdded = StemDate.now().unix();
            this.localStorageMap.set(data.key, data);
        }

        this.notificationCount += 1;
        this.notifications.set(data.key, ContestNotification.create(document.body, {
            title: data.title,
            data: data,
            manager: this,
        }));
    }

    deleteNotification(data, deleteData = true) {
        if (deleteData) {
            this.localStorageMap.delete(data.key);
        }

        this.notificationCount -= 1;
        const notificationElement = this.notifications.get(data.key);
        this.notifications.delete(data.key);
        if (notificationElement) {
            notificationElement.destroyNode();
        }
    }

    deleteAll() {
        for (let notificationElement of this.notifications.values()) {
            notificationElement.hide();
        }
    }
}