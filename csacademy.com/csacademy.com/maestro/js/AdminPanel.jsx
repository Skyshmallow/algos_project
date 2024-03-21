import {UI} from "../../stemjs/src/ui/UIBase.js";
import {CardPanel} from "../../stemjs/src/ui/CardPanel.jsx";
import {Link} from "../../stemjs/src/ui/primitives/Link.jsx";
import {Level} from "../../stemjs/src/ui/Constants.js";


export class AdminPanel extends CardPanel {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes();
        attr.setStyle("margin", "20px 10%");
    }

    getDefaultOptions() {
        return {
            title:"Admin Panel",
            level: Level.INFO,
            style: {
                margin:"10px"
            }
        };
    }

    render() {
        return <table className="table">
            <tbody>
                <tr>
                    <td><Link href="/manage/icarus/#machines" value="Icarus" /></td>
                </tr>
                <tr>
                    <td><Link href="/manage/icarus/#machine_logging" value="Machine logging" /></td>
                </tr>
                <tr>
                    <td><Link href="/manage/icarus/#website_logging" value="Website logging" /></td>
                </tr>
                <tr>
                    <td><Link href="/analytics" value="Analytics" /></td>
                </tr>
                <tr>
                    <td><Link href="/manage/users" value="Users" /></td>
                </tr>
                <tr>
                    <td><Link href="/manage/charts" value="Charts" /></td>
                </tr>
                <tr>
                    <td><Link href="/email/manager" value="Email Manager" /></td>
                </tr>
                <tr>
                    <td><Link href="/storage/manager" value="Storage Manager" /></td>
                </tr>
                <tr>
                    <td><Link href="/manage/translation" value="Translation" /></td>
                </tr>
                <tr>
                    <td><Link href="/real_ratings" value="Real ratings" /></td>
                </tr>
                <tr>
                    <td><Link href="/private-archives" value="Private Archives" /></td>
                </tr>
            </tbody>
        </table>;
    }
}
