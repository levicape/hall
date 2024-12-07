/* Returns React children into an array, flattening fragments. */
import { Children, cloneElement, isValidElement } from "react";
import { isFragment } from "react-is";

export default function flattenChildren(children, depth = 0, keys = []) {
	return Children.toArray(children).reduce((acc, node, nodeIndex) => {
		if (isFragment(node)) {
			acc.push.apply(
				acc,
				flattenChildren(
					node.props.children,
					depth + 1,
					keys.concat(node.key || nodeIndex),
				),
			);
		} else {
			if (isValidElement(node)) {
				acc.push(
					cloneElement(node, {
						key: keys.concat(String(node.key)).join("."),
					}),
				);
			} else if (typeof node === "string" || typeof node === "number") {
				acc.push(node);
			}
		}
		return acc;
	}, []);
}
