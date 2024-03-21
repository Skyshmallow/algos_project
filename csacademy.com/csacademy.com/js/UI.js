// Use to keep compatibility with the old Stem UI.js
// If you want that, use import from "ui/UI";
export * from "../../stemjs/src/ui/All";
export * from "../../stemjs/src/ui/UIPrimitives";
export * from "../../stemjs/src/ui/SVG";
export * from "../../stemjs/src/ui/input/Input";
export * from "../../stemjs/src/ui/button/ButtonStyle";
export * from "../../stemjs/src/ui/button/ButtonGroup";
export * from "../../stemjs/src/ui/modal/Modal";
export * from "../../stemjs/src/ui/modal/FloatingWindow";
export * from "../../stemjs/src/ui/SimpleElements";
export * from "../../stemjs/src/ui/ProgressBar";
export * from "../../stemjs/src/ui/Router";
export * from "../../stemjs/src/ui/Switcher";
export * from "../../stemjs/src/ui/section-divider/SectionDivider";
export * from "../../stemjs/src/ui/section-divider/Accordion";
export * from "../../stemjs/src/ui/section-divider/TitledSectionDivider";
export * from "../../stemjs/src/ui/section-divider/Style";
export * from "../../stemjs/src/ui/CardPanel";
export * from "../../stemjs/src/ui/DelayedElement";
export * from "../../stemjs/src/ui/table/CollapsibleTable";
export * from "../../stemjs/src/ui/table/SortableTable";
export * from "../../stemjs/src/ui/form/Form";
export * from "../../stemjs/src/ui/collapsible/CollapsiblePanel";
export * from "../../stemjs/src/ui/navmanager/NavManager";
export * from "../../stemjs/src/ui/RangePanel";
export * from "../../stemjs/src/ui/table/Table";
export * from "../../stemjs/src/ui/horizontal-overflow/HorizontalOverflow";
export * from "../../stemjs/src/ui/horizontal-overflow/Style";
export * from "../../stemjs/src/ui/tabs/TabArea";
export * from "../../stemjs/src/ui/tabs/FlatTabArea";
export * from "../../stemjs/src/ui/tabs/Style";
export * from "../../stemjs/src/ui/StyleElement";
export * from "../../stemjs/src/ui/RowList";
export * from "../../stemjs/src/ui/style/Theme";

import {
    IconableInterface,
    MakeIcon
} from "../../stemjs/src/ui/SimpleElements";

IconableInterface.prototype.getIcon = function() {
    const {
        icon
    } = this.options;
    return icon && MakeIcon(icon, {
        style: {
            marginRight: 5
        }
    });
}