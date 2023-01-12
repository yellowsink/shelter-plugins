import Codeblock from "./components/Codeblock";

const {
	flux: { dispatcher },
	ui: { ReactiveRoot },
	observeDom,
} = shelter;

const classRegex = /[a-z]+/;

function getLanguage(cb) {
	for (const className of cb.classList)
		if (className !== "hljs" && className.match(classRegex)[0] === className)
			return className;
}

function injectCodeblocks() {
	for (const code of document.querySelectorAll("pre:not(.shiki) > code")) {
		code.parentElement.style.display = "contents";
		code.parentElement.replaceChildren(
			<Codeblock lang={getLanguage(code)}>{code.textContent}</Codeblock>,
		);
	}
}

const TRIGGERS = [
	"MESSAGE_CREATE",
	"CHANNEL_SELECT",
	"LOAD_MESSAGES_SUCCESS",
	"UPDATE_CHANNEL_DIMENSIONS",
	"MESSAGE_END_EDIT",
	"MESSAGE_UPDATE",
];

function onDispatch() {
	let once = false;

	const unObserve = observeDom("pre:not(.shiki) > code", () => {
		if (once) return;
		once = true;
		injectCodeblocks();
	});

	setTimeout(unObserve, 500);
}

export default () => {
	TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));

	return () => TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
};
