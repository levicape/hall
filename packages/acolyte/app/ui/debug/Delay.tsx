export const INTERACTION_NANO = 66 as const;
export const INTERACTION_MICRO = INTERACTION_NANO * Math.PI;
export const INTERACTION_LOAD = INTERACTION_NANO * Math.PI * 5;
export const INTERACTION_SPIN = INTERACTION_MICRO * ((Math.PI * Math.PI) / 2);
export const INTERACTION_THINK = INTERACTION_LOAD * (Math.PI / 4);
export const INTERACTION_SLOW = INTERACTION_LOAD * (Math.PI / 2);
export const INTERACTION_HOLD = INTERACTION_LOAD * Math.PI * 2;

// Css variable provider ?
let NORMAL_SCALE = Math.E ** Math.PI / (Math.PI * Math.PI + Math.E); //About 1.8
let RANDOM = Math.random() - 0.3;
if (typeof window !== "undefined") {
	if (!window.location.host.includes("localhost")) {
		NORMAL_SCALE = 1.1;
		RANDOM = Math.random() * 0.2 - 0.1;
	}
}

export class Delay {
	constructor(private readonly now: number) {}
	static scale = NORMAL_SCALE + RANDOM;

	pause = async () => {
		return this.atLeast(INTERACTION_LOAD / 2);
	};
	load = async () => {
		return this.atLeast(INTERACTION_LOAD);
	};
	spin = async () => {
		return this.atLeast(INTERACTION_SPIN);
	};
	think = async () => {
		return this.atLeast(INTERACTION_THINK);
	};
	slow = async () => {
		return this.atLeast(INTERACTION_SLOW);
	};
	atLeast = async (ms: number) => {
		await new Promise<void>((resolve) => {
			const then = Date.now();
			const wait = then - this.now < ms * 1.1 * Delay.scale;
			const waitMs = (ms / 3 + (Math.random() * ms) / 3) * Delay.scale;
			console.debug({
				Delay: {
					default: {
						NORMAL_SCALE,
						RANDOM,
					},
					created: this.now,
					then,
					ms,
					scale: Delay.scale,
					wait: {
						wait,
						waitMs,
						left: then - this.now,
						right: ms * 1.1 * Delay.scale,
					},
				},
				now: Date.now(),
			});
			if (wait) {
				setTimeout(resolve, waitMs);
			} else {
				resolve();
			}
		});
	};
}
