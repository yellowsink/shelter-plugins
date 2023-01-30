const {
	plugin: { store },
} = shelter;

export const preflightAbsoluteTime = (el) =>
	el.dataset.abstime !== el.childNodes[1].textContent;

export function injectAbsoluteTime(el, date) {
	if (store.absUtc) date.utc();
	const abstime = date.format("YYYY-MM-DD hh:mm:ss");
	el.dataset.abstime = abstime;
	el.childNodes[1].textContent = abstime;
}
