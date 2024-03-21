import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {CollapsiblePanel} from "../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";

import {WSUserDataStore} from "./state/WSUserDataStore";
import {WSConnectionDataStore} from "./state/WSConnectionDataStore";
import {WSStreamDataStore} from "./state/WSStreamDataStore";


export class WSStreamDataUI extends UI.Element {
    render() {
        return [
            <CollapsiblePanel ref="streamPanel" title={"Streams: " + WSStreamDataStore.all().length}>
                {WSStreamDataUI.renderAllStreamData()}
            </CollapsiblePanel>
        ];
    }

    static renderUserConnections(userData) {
        let result = [];
        let labelStyle = {
            margin: "1px"
        };
        let badgeStyle = {
            "background-color": "black"
        };
        for (let connectionId of userData.connectionIds) {
            let connectionData = WSConnectionDataStore.get(connectionId);
            result.push(
                <span className="label label-success" style={labelStyle}>
                    <span className="label label-primary" style={labelStyle}>Id: <span className="badge" style={badgeStyle}>{connectionData.id}</span></span>
                    <span className="label label-primary" style={labelStyle}>IP: <span className="badge" style={badgeStyle}>{connectionData.data["IP"]}</span></span>
                    <span className="label label-primary" style={labelStyle}>Streams: <span className="badge" style={badgeStyle}>{connectionData.streams.length}</span></span>
                </span>
            );
        }
        return result;
    }

    static renderUserTitle(userData) {
        let labelStyle = {
            margin: "5px"
        };
        return [
                <div>User: <UserHandle id={userData.id}/>
                    <span className="label label-success" style={labelStyle}>Websocket connections: {userData.connectionIds.length}</span>
                    <span className="label label-primary" style={labelStyle}>Total Redis streams: {userData.streams.length}</span>
                </div>
        ];
    }

    static renderUserData(streamData) {
        let result = [];
        for (let userId of streamData.userIds) {
            let userData = WSUserDataStore.get(userId);
            result.push(
                <CardPanel ref="userCardPanel" title={WSStreamDataUI.renderUserTitle(userData)}>
                    <h4>
                        {WSStreamDataUI.renderUserConnections(userData)}
                    </h4>
                </CardPanel>
            );
        }

        return result;
    }

    static renderStreamDataTitle(streamData) {
        let badgeStyle = {
            margin: "5px",
            "background-color": "#953b39"
        };
        return [
                <div>Stream: <span className="badge" style={badgeStyle}>{"#" + streamData.id}</span></div>
        ];
    }

    static renderStreamData(streamData) {
        let panelStyle = {
            margin: "5px",
            padding: "0px"
        };
        return [
            <CollapsiblePanel ref="streamPanel" title={WSStreamDataUI.renderStreamDataTitle(streamData)} style={panelStyle} collapsed>
                <div> {WSStreamDataUI.renderUserData(streamData)} </div>
            </CollapsiblePanel>
        ];
    }

    static renderAllStreamData() {
        let allStreamData = [];
        for (let streamData of WSStreamDataStore.all()) {
            allStreamData.push(WSStreamDataUI.renderStreamData(streamData));
        }
        return allStreamData;
    }
}
