import { formatAsIs } from "./timezones";

const {
	plugin: { store },
} = shelter;

export const preflightAbsoluteTime = (el) =>
	el.dataset.abstime !== el.childNodes[1].textContent;

export function injectAbsoluteTime(el, date) {
	if (store.absUtc) {
		date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
	}
	const abstime = formatAsIs(date, "%Y-%m-%d %H:%M:%S");
	el.dataset.abstime = abstime;
	el.childNodes[1].textContent = abstime;
}
