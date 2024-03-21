import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Badge} from "../../stemjs/src/ui/SimpleElements.jsx";
import {Size} from "../../stemjs/src/ui/Constants.js";
import {Emoji} from "./ui/EmojiUI.jsx";
import {Ajax} from "../../stemjs/src/base/Ajax.js";
import {FAIcon} from "../../stemjs/src/ui/FontAwesome.jsx";
import {NotificationsList} from "../../establishment/chat/js/SocialNotifications.jsx";
import {IconMessagesList} from "../../establishment/chat/js/PrivateMessages.jsx";
import {Language} from "../../establishment/localization/js/state/LanguageStore.js";
import {NavElement} from "../../stemjs/src/ui/navmanager/NavElement.jsx";
import {NavIcon} from "../../stemjs/src/ui/navmanager/NavIcon.jsx";
import {UserStore} from "../../csaaccounts/js/state/UserStore.js";
import {WebsocketSubscriber} from "../../stemjs/src/websocket/client/WebsocketSubscriber.js";

class MessagesIcon extends NavIcon {
    setOptions(options) {
        super.setOptions(options);
        this.count = 0;
    }

    render() {
        this.iconMessagesList = this.iconMessagesList || <IconMessagesList />;
        return [this.iconMessagesList];
    }

    getIcon() {
        return <FAIcon icon="envelope" size={Size.LARGE}/>;
    }

    getContent() {
        return <Badge ref={this.refLink("messagesCount")} style={{backgroundColor: "crimson", bottom: "5px",
                marginLeft: "-9px", marginTop: "15px", position: "absolute"}} className="hidden" />;
    }

    updateUnreadCount(count) {
        if (!this.messagesCount) {
            return;
        }
        this.count = count;
        this.messagesCount.options.children = count;
        this.messagesCount.options.className = (count ? "" : "hidden");
        this.messagesCount.redraw();
        this.dispatch("changeTabCount");
    }

    onMount() {
        super.onMount();

        this.iconMessagesList.addListener("unreadCountChanged", (value) => {
            this.updateUnreadCount(value);
        });

        this.addClickListener(() => {
            this.parent.dispatch("changeSwitcher", this.iconMessagesList || <IconMessagesList />, this);
        });
    }
}


class NotificationsIcon extends NavIcon {
    setOptions(options) {
        super.setOptions(options);
        this.unreadNotificationsCount = 0;
        this.count = 0;
    }

    render() {
        return [<NotificationsList icon={this}/>];
    }

    getIcon() {
        return <FAIcon icon="bell" size={Size.LARGE}/>;
    }

    getContent() {
        return <Badge ref={this.refLink("notificationsCount")} style={{backgroundColor: "crimson", bottom: "5px",
                marginLeft: "-9px", marginTop: "15px", position: "absolute"}} className="hidden" />;
    }

    setUnreadNotificationsCount(count) {
        if (!this.notificationsCount) {
            return;
        }
        this.count = count;
        this.notificationsCount.options.children = count;
        this.notificationsCount.options.className = (count ? "" : "hidden");
        this.notificationsCount.redraw();
        this.dispatch("changeTabCount");
    }

    setNotificationsAsRead() {
        Ajax.postJSON("/accounts/set_user_notifications_read", {}).then(
            () => this.setUnreadNotificationsCount(0),
            () => {}
        );
    }

    increaseUnreadNotificationsCount() {
        if (this.isToggled) {
            this.setNotificationsAsRead();
        } else {
            this.unreadNotificationsCount += 1;
            this.setUnreadNotificationsCount(this.unreadNotificationsCount);
        }
    }

    onMount() {
        super.onMount();
        this.attachChangeListener(UserStore.getCurrentUser(), (event) => {
            if (event.type === "lastReadNotification") {
                this.unreadNotificationsCount = 0;
                this.setUnreadNotificationsCount(this.unreadNotificationsCount);
            }
        });
        this.addClickListener(() => {
            this.notificationsList = this.notificationsList || <NotificationsList icon={this}/>;
            this.isToggled = !this.isToggled;
            this.parent.dispatch("changeSwitcher", this.notificationsList, this);

            if (this.isToggled) {
                this.setNotificationsAsRead();
            }
        });
    }
}


class LanguagesIcon extends NavElement {
    static addLanguage(language, flagEmoji) {
        if (language) {
            language.flagEmoji = flagEmoji;
            this.Languages.push(language);
        }
    }

    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.setStyle("white-space", "nowrap");
    }

    getDefaultOptions() {
        return {
            value: <Emoji height="1.8em" width="1.8em" value={Language.Locale.flagEmoji} />,
        };
    }

    render() {
        let languagesList = [];
        for (let language of this.constructor.Languages) {
            let onLanguageSelect = () => {
                this.setLanguage(language);
                this.options.value = <Emoji height="1.8em" width="1.8em" value={language.flagEmoji} />;
                this.redraw();
            };
            languagesList.push(<NavElement onClick={onLanguageSelect}
                               value={[<Emoji height="1.8em"  width="1.8em" value={language.flagEmoji} />, language.toString()]} />);
        }
        return languagesList;
    }

    setLanguage(language) {
        Language.setLocale(language);

        let request = {
            localeLanguageId: language.id,
        };

        Ajax.postJSON("/accounts/profile_changed/", request).then(() => {}, () => {});
    }

    onMount() {
        super.onMount();
        setTimeout(() => {
            this.options.value = <Emoji height="1.8em" width="1.8em" value={Language.Locale.flagEmoji} />;
            this.redraw();
        });
    }
}

LanguagesIcon.Languages = [];

setTimeout(() => {
    LanguagesIcon.addLanguage(Language.ENGLISH, "flag_gb");
    LanguagesIcon.addLanguage(Language.ROMANIAN, "flag_ro");
    LanguagesIcon.addLanguage(Language.RUSSIAN, "flag_ru");
    LanguagesIcon.addLanguage(Language.ARABIC, "flag_ara");

    LanguagesIcon.addLanguage(Language.BULGARIAN, "flag_bg");
    LanguagesIcon.addLanguage(Language.UKRAINIAN, "flag_ua");
    LanguagesIcon.addLanguage(Language.ITALIAN, "flag_it");
    LanguagesIcon.addLanguage(Language.HUNGARIAN, "flag_hu");
});


class WebsocketStatusIcon extends NavElement {
    setOptions(options) {
        options.value = [
            <FAIcon icon="circle" style={{color: "#d99a01", marginRight: "10px"}} />,
            UI.T("Connecting"),
        ];
        super.setOptions(options);
    }

    getNodeAttributes() {
        let attr = super.getNodeAttributes();
        attr.setStyle("cursor", "default");
        return attr;
    }

    onMount() {
        let setIconStatus = () => {
            let connectionStatus = WebsocketSubscriber.Global.connectionStatus;
            let statusTypes = WebsocketSubscriber.ConnectionStatus;
            switch(connectionStatus) {
                case statusTypes.CONNECTED: {
                    this.options.value[0].setStyle("color", "#417a5a");
                    this.options.value[1] = UI.T("Connected");
                    break;
                }
                case statusTypes.CONNECTING: {
                    this.options.value[0].setStyle("color", "#d99a01");
                    this.options.value[1] = UI.T("Connecting");
                    break;
                }
                case statusTypes.DISCONNECTED: {
                    this.options.value[0].setStyle("color", "#d64144");
                    this.options.value[1] = UI.T("Disconnected");
                }
            }
            this.redraw();
        };
        WebsocketSubscriber.Global.addListener("connectionStatus", () => {
            setIconStatus();
        });
        setIconStatus();
    }
}

export {MessagesIcon, NotificationsIcon, LanguagesIcon, WebsocketStatusIcon};
