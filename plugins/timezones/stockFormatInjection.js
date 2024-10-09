// changes the format of stock timestamps

import { formatAsIs } from "./timezones";

const {
	plugin: { store },
} = shelter;

export const preflightStockFormat = (el) =>
	el.dataset.fmttime !== el.childNodes[1].textContent;

export function injectStockFormat(el, date) {
	if (store.sutc) {
		date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
	}
	const fmttime = formatAsIs(date, store.sfmt);
	el.dataset.fmttime = fmttime;
	el.childNodes[1].textContent = fmttime;
}
