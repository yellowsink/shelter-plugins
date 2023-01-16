import Codeblock from "./components/Codeblock";

const {
	flux: { dispatcher },
	solid: { createSignal },
	observeDom,
} = shelter;

const classRegex = /[a-z]+/;

function getLanguage(cb) {
	// wrap the fact that we need to get the lang a tick after
	// in a signal to fix a one-frame flash of non-injection
	const [sig, setSig] = createSignal("");

	setTimeout(() => {
		for (const className of cb.classList)
			if (className !== "hljs" && className.match(classRegex)[0] === className)
				setSig(className);
	});

	return sig;
}

function injectCodeblock(code) {
	if (!code.parentElement) return;
	code.parentElement.style.display = "contents";
	const langSig = getLanguage(code);
	code.parentElement.replaceChildren(
		<Codeblock lang={langSig()}>{code.textContent}</Codeblock>,
	);
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
	const unObserve = observeDom("pre:not(.shiki) > code", (elem) => {
		unObserve();
		injectCodeblock(elem);
	});

	setTimeout(unObserve, 500);
}

export default () => {
	TRIGGERS.forEach((t) => dispatcher.subscribe(t, onDispatch));

	return () => TRIGGERS.forEach((t) => dispatcher.unsubscribe(t, onDispatch));
};
