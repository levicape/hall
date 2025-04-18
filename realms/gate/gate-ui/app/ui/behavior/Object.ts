export const flattenObject = (data: object, prefix = "") => {
	const result: { [key: string]: string | number | null } = {};

	Object.entries(data).forEach(([key, value]) => {
		if (typeof value === "object") {
			Object.assign(result, flattenObject(value, `${prefix}${key}.`));
		} else {
			result[`${prefix}${key}`] = value;
		}
	});

	return result;
};
