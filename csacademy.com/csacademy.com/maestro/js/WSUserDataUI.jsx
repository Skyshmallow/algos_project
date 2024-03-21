import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CollapsiblePanel} from "../../stemjs/src/ui/collapsible/CollapsiblePanel.jsx";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {UserHandle} from "../../csaaccounts/js/UserHandle.jsx";

import {WSUserDataStore} from "./state/WSUserDataStore";
import {WSConnectionDataStore} from "./state/WSConnectionDataStore";


export class WSUserDataUI extends UI.Element {
    render() {
        return [
            <CollapsiblePanel ref="usersPanel" title={"Users online: " + WSUserDataStore.all().length}>
                {WSUserDataUI.renderAllUserData()}
            </CollapsiblePanel>
        ];
    }

    static renderConnectionTitle(connectionData) {
        let labelStyle = {
            margin: "1px"
        };
        let badgeStyle = {
            "background-color": "black"
        };
        return [
            <h3>
                <span className="label label-primary" style={labelStyle}>Id: <span className="badge" style={badgeStyle}>{connectionData.id}</span></span>
                <span className="label label-primary" style={labelStyle}>IP: <span className="badge" style={badgeStyle}>{connectionData.data["IP"]}</span></span>
                <span className="label label-primary" style={labelStyle}>Streams: <span className="badge" style={badgeStyle}>{connectionData.streams.length}</span></span>
            </h3>
        ];
    }

    static renderConnectionStreams(connectionData) {
        let result = [];
        let labelStyle = {
            margin: "0px",
            "background-color": "#953b39"
        };
        for (let stream of connectionData.streams) {
            result.push(
                <span className="badge" style={labelStyle}>{"#" + stream}</span>
            );
        }
        return result;
    }

    static renderConnectionData(userData) {
        let result = [];
        for (let connectionId of userData.connectionIds) {
            let connectionData = WSConnectionDataStore.get(connectionId);
            result.push(
                <CardPanel ref="connectionCardPanel" title={WSUserDataUI.renderConnectionTitle(connectionData)}>
                    <h4>
                        {WSUserDataUI.renderConnectionStreams(connectionData)}
                    </h4>
                </CardPanel>
            );
        }

        return result;
    }

    static renderUserDataTitle(userData) {
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

    static renderUserData(userData) {
        let panelStyle = {
            margin: "5px",
            padding: "0px"
        };
        return [
            <CollapsiblePanel ref="userPanel" title={WSUserDataUI.renderUserDataTitle(userData)} style={panelStyle} collapsed>
                <div> {WSUserDataUI.renderConnectionData(userData)} </div>
            </CollapsiblePanel>
        ];
    }

    static renderAllUserData() {
        let allUserData = [];
        for (let userData of WSUserDataStore.all()) {
            allUserData.push(WSUserDataUI.renderUserData(userData));
        }
        return allUserData;
    }
}
