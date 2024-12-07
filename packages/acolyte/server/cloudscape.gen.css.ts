import * as fs from "node:fs";
import * as path from "node:path";

const components = [
	"alert",
	"anchor-navigation",
	"annotation-context",
	"app-layout",
	"area-chart",
	"attribute-editor",
	"autosuggest",
	"badge",
	"bar-chart",
	"box",
	"breadcrumb-group",
	"button",
	"button-dropdown",
	"button-group",
	"calendar",
	"cards",
	"checkbox",
	"code-editor",
	"collection-preferences",
	"column-layout",
	"container",
	"content-layout",
	"copy-to-clipboard",
	"date-input",
	"date-picker",
	"date-range-picker",
	"drawer",
	"expandable-section",
	"file-upload",
	"flashbar",
	"form",
	"form-field",
	"grid",
	"header",
	"help-panel",
	"hotspot",
	"icon",
	"input",
	"internal",
	"key-value-pairs",
	"line-chart",
	"link",
	"live-region",
	"modal",
	"mixed-line-bar-chart",
	"multiselect",
	"pagination",
	"pie-chart",
	"popover",
	"progress-bar",
	"prompt-input",
	"property-filter",
	"radio-group",
	"s3-resource-selector",
	"segmented-control",
	"select",
	"side-navigation",
	"slider",
	"space-between",
	"spinner",
	"status-indicator",
	"steps",
	"table",
	"tabs",
	"tag-editor",
	"text-content",
	"text-filter",
	"textarea",
	"tiles",
	"time-input",
	"toggle",
	"toggle-button",
	"top-navigation",
	"tutorial-panel",
	"wizard",
] as const;
type Component = (typeof components)[number];

const structural: Component[] = [
	"anchor-navigation",
	"annotation-context",
	"app-layout",
	"form",
	"internal",
];

const layout: Component[] = [
	"box",
	"column-layout",
	"container",
	"content-layout",
	"form-field",
	"grid",
	"link",
	"progress-bar",
	"segmented-control",
	"slider",
	"space-between",
	"tabs",
	"tiles",
	"key-value-pairs",
];

const form: Component[] = [
	"badge",
	"hotspot",
	"checkbox",
	"input",
	"multiselect",
	"radio-group",
	"select",
	"textarea",
	"toggle",
	"toggle-button",
	"prompt-input",
];

const date: Component[] = [
	"calendar",
	"date-input",
	"date-picker",
	"date-range-picker",
	"time-input",
];

const navigation: Component[] = [
	"drawer",
	"expandable-section",
	"flashbar",
	"side-navigation",
	"top-navigation",
	"autosuggest",
	"button-dropdown",
	"cards",
];

const action: Component[] = [
	"breadcrumb-group",
	"button-group",
	"button",
	"link",
	"header",
	"status-indicator",
	"toggle-button",
	"copy-to-clipboard",
];

const informational: Component[] = [
	"alert",
	"badge",
	"flashbar",
	"help-panel",
	"status-indicator",
];

const data: Component[] = [
	"icon",
	"spinner",
	"text-content",
	"modal",
	"pagination",
	"popover",
	"file-upload",
	"live-region",
];

const tutorials: Component[] = [
	"tutorial-panel",
	"steps",
	"wizard",
	"attribute-editor",
];

const tables: Component[] = [
	"table",
	"tag-editor",
	"collection-preferences",
	"property-filter",
	"text-filter",
];

const chart = [
	"area-chart",
	"bar-chart",
	"line-chart",
	"mixed-line-bar-chart",
	"pie-chart",
];

const codeEditor: Component[] = ["code-editor", "s3-resource-selector"];

const componentsByType = {
	structural,
	layout,
	form,
	date,
	navigation,
	action,
	data,
	tutorials,
	tables,
	informational,
	chart,
	codeEditor,
};
const rest = components.filter(
	(c) => !Object.values(componentsByType).flat().includes(c),
);
if (rest.length > 0) {
	throw new Error(`Unassigned components: ${rest.join(", ")}`);
}

// Function to recursively get all CSS files in a directory
function getAllCssFiles(dir: string): string[] {
	let results: string[] = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);
		if (stat?.isDirectory()) {
			results = results.concat(getAllCssFiles(filePath));
		} else if (filePath.endsWith(".css")) {
			console.log({ getAllCssFiles: { message: "Found CSS file", filePath } });
			results.push(filePath);
		}
	});
	return results;
}

// Main function to generate the all.gen.css file
function generateCssImportFile() {
	// const rootDir = getRootFromPackageJson();
	const cssDir = path.join(".", "app/style/cloudscape");
	console.log({
		generateCssImportFile: { message: "Set CSS directory", cssDir },
	});
	for (const [type, components] of Object.entries(componentsByType)) {
		const outputFilePath = path.join(
			cssDir,
			`../compact/cloudscape.${type}.css`,
		);
		console.log({
			generateCssImportFile: {
				message: "Set output file path",
				type,
				outputFilePath,
			},
		});
		if (!fs.existsSync(path.dirname(outputFilePath))) {
			console.log({
				generateCssImportFile: {
					message: "Creating directory",
					dir: path.dirname(outputFilePath),
				},
			});
			fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
		}

		if (fs.existsSync(outputFilePath)) {
			console.log({
				generateCssImportFile: {
					message: "Removing existing file",
					outputFilePath,
				},
			});
			fs.rmSync(outputFilePath);
		}

		const cssFiles = getAllCssFiles(cssDir).filter((file) => {
			return components.some((component) => file.includes(component));
		});
		console.log({
			generateCssImportFile: { message: "Filtered CSS files", cssFiles },
		});

		const importStatements = cssFiles
			.map((file) => {
				const relativePath = path
					.relative(path.dirname(outputFilePath), file)
					.replace(/\\/g, "/");
				return `@import "./${relativePath}";`;
			})
			.join("\n");
		console.log({
			generateCssImportFile: {
				message: "Generated import statements",
				importStatements,
			},
		});

		fs.writeFileSync(outputFilePath, importStatements, "utf-8");
		console.log({
			generateCssImportFile: {
				message: "Wrote to output file",
				outputFilePath,
			},
		});
	}
}

// Run the main function
try {
	generateCssImportFile();
} catch (error) {
	console.error(error.message);
}
