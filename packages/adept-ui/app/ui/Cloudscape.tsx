import stylesheet from "@cloudscape-design/global-styles/index.css?url";
import action from "~/style/compact/cloudscape.action.css?url";
import chart from "~/style/compact/cloudscape.chart.css?url";
import codeEditor from "~/style/compact/cloudscape.codeEditor.css?url";
import data from "~/style/compact/cloudscape.data.css?url";
import date from "~/style/compact/cloudscape.date.css?url";
import form from "~/style/compact/cloudscape.form.css?url";
import informational from "~/style/compact/cloudscape.informational.css?url";
import layout from "~/style/compact/cloudscape.layout.css?url";
import navigation from "~/style/compact/cloudscape.navigation.css?url";
import structural from "~/style/compact/cloudscape.structural.css?url";
import tables from "~/style/compact/cloudscape.tables.css?url";
import tutorials from "~/style/compact/cloudscape.tutorials.css?url";

// import alertCss from "~/style/cloudscape/cloudscape.alert.css?url";
// import anchorNavigationCss from "~/style/cloudscape/cloudscape.anchor-navigation.css?url";
// import attributeEditorCss from "~/style/cloudscape/cloudscape.attribute-editor.css?url";
// import badgeCss from "~/style/cloudscape/cloudscape.badge.css?url";
// import baseComponentCss from "~/style/cloudscape/cloudscape.base-component.css?url";
// import boxCss from "~/style/cloudscape/cloudscape.box.css?url";
// import breadcrumbGroupCss from "~/style/cloudscape/cloudscape.breadcrumb-group.css?url";
// import buttonGroupCss from "~/style/cloudscape/cloudscape.button-group.css?url";
// import buttonTriggerCss from "~/style/cloudscape/cloudscape.button-trigger.css?url";
// import buttonCss from "~/style/cloudscape/cloudscape.button.css?url";
// import cardCss from "~/style/cloudscape/cloudscape.card.css?url";
// import checkboxIconCss from "~/style/cloudscape/cloudscape.checkbox-icon.css?url";
// import checkboxCss from "~/style/cloudscape/cloudscape.checkbox.css?url";
// import columnCss from "~/style/cloudscape/cloudscape.column-layout.css?url";
// import componentCss from "~/style/cloudscape/cloudscape.components.css?url";
// import containerCss from "~/style/cloudscape/cloudscape.container.css?url";
// import contentLayoutCss from "~/style/cloudscape/cloudscape.content-layout.css?url";
// import dropdownCss from "~/style/cloudscape/cloudscape.dropdown.css?url";
// import expandableSectionCss from "~/style/cloudscape/cloudscape.expandable-section.css?url";
// import flashbarCss from "~/style/cloudscape/cloudscape.flashbar.css?url";
// import formFieldCss from "~/style/cloudscape/cloudscape.form-field.css?url";
// import formCss from "~/style/cloudscape/cloudscape.form.css?url";
// import gridCss from "~/style/cloudscape/cloudscape.grid.css?url";
// import headerCss from "~/style/cloudscape/cloudscape.header.css?url";
// import iconCss from "~/style/cloudscape/cloudscape.icon.css?url";
// import inputCss from "~/style/cloudscape/cloudscape.input.css?url";
// import linkCss from "~/style/cloudscape/cloudscape.link.css?url";
// import modalCss from "~/style/cloudscape/cloudscape.modal.css?url";
// import multiselectCss from "~/style/cloudscape/cloudscape.multiselect.css?url";
// import optionCss from "~/style/cloudscape/cloudscape.option.css?url";
// import optionsListCss from "~/style/cloudscape/cloudscape.options-list.css?url";
// import popoverCss from "~/style/cloudscape/cloudscape.popover.css?url";
// import progressBarCss from "~/style/cloudscape/cloudscape.progress-bar.css?url";
// import radioGroupCss from "~/style/cloudscape/cloudscape.radio-group.css?url";
// import segmentedControlCss from "~/style/cloudscape/cloudscape.segmented-control.css?url";
// import selectCss from "~/style/cloudscape/cloudscape.select.css?url";
// import selectableItemCss from "~/style/cloudscape/cloudscape.selectable-item.css?url";
// import sideNavigationCss from "~/style/cloudscape/cloudscape.side-navigation.css?url";
// import sliderCss from "~/style/cloudscape/cloudscape.slider.css?url";
// import spaceBetweenCss from "~/style/cloudscape/cloudscape.space-between.css?url";
// import spinnerCss from "~/style/cloudscape/cloudscape.spinner.css?url";
// // import variableCss from "~/style/cloudscape/cloudscape._.scss?url";
// import splitPanelCss from "~/style/cloudscape/cloudscape.split-panel.css?url";
// import statusIndicatorCss from "~/style/cloudscape/cloudscape.status-indicator.css?url";
// import tabsCss from "~/style/cloudscape/cloudscape.tabs.css?url";
// import textContentCss from "~/style/cloudscape/cloudscape.text-content.css?url";
// import textareaCss from "~/style/cloudscape/cloudscape.textarea.css?url";
// import tilesCss from "~/style/cloudscape/cloudscape.tiles.css?url";
// import toggleButtonCss from "~/style/cloudscape/cloudscape.toggle-button.css?url";
// import toggleCss from "~/style/cloudscape/cloudscape.toggle.css?url";
// import topNavigationCss from "~/style/cloudscape/cloudscape.top-navigation.css?url";
// import wizardCss from "~/style/cloudscape/cloudscape.wizard.css?url";

import type { FunctionComponent, PropsWithChildren } from "react";

export class Cloudscape {
	Provider: FunctionComponent<PropsWithChildren> = ({ children }) => {
		return <span>{children}</span>;
	};
	stylesheet = (): { rel: string; href: string }[] => [
		// { rel: "stylesheet", href: variableCss },
		{ rel: "stylesheet", href: stylesheet },
		{ rel: "stylesheet", href: structural },
		{ rel: "stylesheet", href: layout },
		{ rel: "stylesheet", href: navigation },
		{ rel: "stylesheet", href: form },
		{ rel: "stylesheet", href: informational },
		{ rel: "stylesheet", href: action },
		{ rel: "stylesheet", href: data },
		{ rel: "stylesheet", href: tables },
		{ rel: "stylesheet", href: tutorials },
		{ rel: "stylesheet", href: date },
		{ rel: "stylesheet", href: chart },
		{ rel: "stylesheet", href: codeEditor },
		// { rel: "stylesheet", href: textContentCss },
		// { rel: "stylesheet", href: baseComponentCss },
		// { rel: "stylesheet", href: alertCss },
		// { rel: "stylesheet", href: anchorNavigationCss },
		// { rel: "stylesheet", href: attributeEditorCss },
		// { rel: "stylesheet", href: boxCss },
		// { rel: "stylesheet", href: breadcrumbGroupCss },
		// { rel: "stylesheet", href: buttonGroupCss },
		// { rel: "stylesheet", href: buttonCss },
		// { rel: "stylesheet", href: cardCss },
		// // TODO: Not working properly with tailwind
		// { rel: "stylesheet", href: checkboxCss },
		// { rel: "stylesheet", href: columnCss },
		// { rel: "stylesheet", href: componentCss },
		// { rel: "stylesheet", href: containerCss },
		// { rel: "stylesheet", href: contentLayoutCss },
		// { rel: "stylesheet", href: flashbarCss },
		// { rel: "stylesheet", href: formFieldCss },
		// { rel: "stylesheet", href: formCss },
		// { rel: "stylesheet", href: gridCss },
		// { rel: "stylesheet", href: headerCss },
		// { rel: "stylesheet", href: iconCss },
		// { rel: "stylesheet", href: inputCss },
		// { rel: "stylesheet", href: linkCss },
		// { rel: "stylesheet", href: modalCss },
		// { rel: "stylesheet", href: selectCss },
		// { rel: "stylesheet", href: spaceBetweenCss },
		// { rel: "stylesheet", href: spinnerCss },
		// { rel: "stylesheet", href: statusIndicatorCss },
		// { rel: "stylesheet", href: toggleButtonCss },
		// { rel: "stylesheet", href: toggleCss },
		// { rel: "stylesheet", href: topNavigationCss },
		// { rel: "stylesheet", href: checkboxIconCss },
		// { rel: "stylesheet", href: dropdownCss },
		// { rel: "stylesheet", href: optionCss },
		// { rel: "stylesheet", href: optionsListCss },
		// { rel: "stylesheet", href: buttonTriggerCss },
		// { rel: "stylesheet", href: selectableItemCss },
		// { rel: "stylesheet", href: splitPanelCss },
		// { rel: "stylesheet", href: textareaCss },
		// { rel: "stylesheet", href: tilesCss },
		// { rel: "stylesheet", href: tabsCss },
		// { rel: "stylesheet", href: sideNavigationCss },
		// { rel: "stylesheet", href: sliderCss },
		// { rel: "stylesheet", href: segmentedControlCss },
		// { rel: "stylesheet", href: radioGroupCss },
		// { rel: "stylesheet", href: progressBarCss },
		// { rel: "stylesheet", href: popoverCss },
		// { rel: "stylesheet", href: multiselectCss },
		// { rel: "stylesheet", href: expandableSectionCss },
		// { rel: "stylesheet", href: badgeCss },
		// { rel: "stylesheet", href: wizardCss },
	];
}
