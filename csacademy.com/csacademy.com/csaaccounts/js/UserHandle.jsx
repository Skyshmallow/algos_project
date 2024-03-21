import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";
import {Popup} from "../../establishment/content/js/Popup.jsx";
import {CountryStore} from "../../establishment/localization/js/state/CountryStore.js";
import {PublicUserStore} from "./state/UserStore.js";
import {Emoji} from "../../csabase/js/ui/EmojiUI.jsx";

export class UserHandle extends UI.Element {
    setOptions(options) {

        options.userId = options.userId || options.id;

        super.setOptions(options);

        this.setUser(PublicUserStore.get(this.options.userId));
    }

    setUser(user) {
        this.user = user;
    }

    getNodeType() {
        return "span";
    }

    getRatingColor() {
        if (!this.user) {
            return "#BBB";
        }
        if (this.user.isAdmin) {
            return "black";
        }
        if (!this.user.rating) {
            return "#BBB";
        }
        let ratingBands = window.RATING_BANDS;
        for (let ratingBand of ratingBands) {
            if (ratingBand.minRating <= this.user.rating && this.user.rating < ratingBand.maxRating) {
                return ratingBand.color;
            }
        }
    }

    setColor(color) {
        this.options.color = color;
        this.handle.setStyle("color", color);
    }

    render() {
        let handle, countryEmoji;
        if (!this.user) {
            PublicUserStore.fetch(this.options.userId, (user) => {
                this.setUser(user);
                this.redraw();
            });
            handle = <span ref="handle" style={{color: "#BBB"}} onClick={()=>null}>{"user-" + this.options.userId}</span>;
        } else {
            let clickFunc = null;
            if (!this.options.hasOwnProperty("disableClick")) {
                clickFunc = () => {
                    this.togglePopup();
                    window.event.stopPropagation();
                    window.event.preventDefault();
                };
            }
            if (this.options.showCountry && this.user.countryId) {
                countryEmoji = <Emoji style={{paddingRight: "2px"}} width="1.6em" height="1.6em"
                                         value={this.user.getCountry().getEmojiName()} title={this.user.getCountry().name} />;
            }
            handle = <span ref="handle" style={{
                                            cursor: "pointer",
                                            color: (this.options.color ? this.options.color : this.getRatingColor())
                                        }}
                                        onClick={clickFunc}>
                            <b>{this.user.getDisplayHandle()}</b>
                    </span>;
        }

        //The purpose of the container is to simplify the usage of the popup.
        return [
            <span ref="container" style={{position: "relative"}}>
                {countryEmoji}
                {handle}
                {this.options.children}
            </span>
        ]
    }

    getPopupTitle() {
        let profileLink = <Link href={this.user.getProfileUrl()} value={this.user.name || this.user.username || ("user-" + this.user.id)} />;
        if (USER.isSuperUser) {
            return <span style={{position: "relative"}}>
                {profileLink}
                <br/>
                <span>{"id: " + this.user.id}</span>
            </span>
        } else {
            return profileLink;
        }
    }

    getPopupContent() {
        let rez = [];
        if (this.user.rating) {
            rez.push(<p style={{"height": "25px", "line-height": "25px"}}>{"Rating: " + this.user.rating}</p>);
            rez.push(<p style={{"height": "25px", "line-height": "25px"}}><Link href="/ratings" value={"Rank: " + this.user.globalRatingRank} /></p>);
        } else {
            rez.push(<p style={{"height": "25px", "line-height": "25px"}}>{"Rating: N/A"}</p>);
        }
        if (this.user.countryId) {
            let country = CountryStore.get(this.user.countryId);
            let emojiName = country.getEmojiName();
            rez.push(<p style={{"height": "25px", "line-height": "25px"}}>
                            Country: {country.name}
                            <Emoji style={{paddingLeft: "3px"}} title={country.name}
                                      value={emojiName} height="1.6em" width="1.6em"/>
                        </p>);
        }
        //if (USER.isSuperUser) {
        //    rez.push(<p><ReputationWidget reputation={this.user.reputation}/></p>);
        //}
        return rez;
    }

    togglePopup() {
        if (this.options.noPopup) {
            window.open(this.user.getProfileUrl(), "_blank");
            return;
        }
        if (this.popup && this.popup.isInDocument()) {
            this.popup.hide();
            return;
        }
        this.popup = Popup.create(this.container, Object.assign({
            target: this.handle,
            title: this.getPopupTitle(),
            children: this.getPopupContent(),
            transitionTime: 300,
            titleFontSize: "10pt",
            style: {
                minWidth: "150px",
                maxWidth: "270px",
            }
        }));
    }
}
