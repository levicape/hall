
const hydrateDataSsg = () => {
	if (typeof window !== "undefined" && window.__hydrateDataIsr === undefined) {

		/*
		 * This function is called when the DOM is loaded.
		 * It will remove the data-ssg attribute from elements
		 * and set the data-csr attribute to the current time.
		 * This is used so server rendered elements can use data attributes to render CSS without using javascript.
		 */
		window.__hydrateDataCsr = () => {
			const el = document.querySelectorAll(
				"[data-ssg]:not([data-hono-hydrated])",
			);
			if (el.length === 0) {
				return;
			}
			for (const e of el) {
				e.removeAttribute("data-ssg");
				e.setAttribute("data-csr", Date.now().toString());
			}

			setTimeout(() => {
				window.__hydrateDataIsr();
			}, 32);
		};
		/*
		 * This function is called some indeterminate time after data-csr is set
		 * It will set the data-isr attribute to the current time.
		 * It indicates that the page has been hydrated and may be now interactive.
		 */
		window.__hydrateDataIsr = () => {
			const el = document.querySelectorAll(
				"[data-csr]:not([data-hono-hydrated])",
			);
			if (el.length === 0) {
				return;
			}
			for (const e of el) {
				e.setAttribute("data-isr", Date.now().toString());
			}

			if (window.__hydrateDataCsr) {
				document.removeEventListener("DOMContentLoaded", window.__hydrateDataCsr);
				window.__hydrateDataCsr = undefined;
				window.__hydrateDataIsr = undefined;
			}
		};
		
		document?.addEventListener("DOMContentLoaded", window.__hydrateDataCsr);
	}
};

hydrateDataSsg();