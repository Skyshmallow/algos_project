import {UI} from "../../stemjs/src/ui/UIBase.js";
import {Route} from "../../stemjs/src/ui/Router.jsx";
import {GlobalStyle} from "../../stemjs/src/ui/GlobalStyle.js";
import {StateDependentElement} from "../../stemjs/src/ui/StateDependentElement.jsx";
import {ErrorHandlers} from "../../establishment/errors/js/ErrorHandlers.js";


class GenericErrorView extends UI.Element {
    extraNodeAttributes(attr) {
        super.extraNodeAttributes(attr);
        attr.addClass(GlobalStyle.Container.EXTRA_SMALL);
    }

    render() {
        return StateDependentElement.renderError(ErrorHandlers.PAGE_NOT_FOUND);
    }
}

class PageNotFoundRoute extends Route {
    constructor() {
        super([], GenericErrorView, [], "Page not found11");
    }

    matches(urlParts) {
        return {
            args: [],
            urlParts: urlParts
        };
    }

    matchesOwnNode() {
        return true;
    }
}

export {GenericErrorView, PageNotFoundRoute};
