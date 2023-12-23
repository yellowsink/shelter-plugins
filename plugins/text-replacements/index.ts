const {
	// @ts-expect-error
	http: { intercept },
	// @ts-expect-error
	plugin: { store },
	ui: { injectCss },
} = shelter;

// @ts-expect-error
import css from "./style.scss";

export * from "./settings";

// name, regexp, flags, replace
type StoredRegex = [string, string, string, string];

store.regexes ??= [] as StoredRegex[];

const unintercept = intercept(
	"post",
	/\/channels\/\d+\/messages/,
	(req, send) => {
		let newContent = req?.body?.content; // this variable technically unnecessary

		try {
			if (typeof newContent === "string") {
				for (const [
					,
					match,
					flags,
					replace,
				] of store.regexes as StoredRegex[]) {
					const regex = new RegExp(match, flags);

					newContent = newContent[regex.global ? "replaceAll" : "replace"](
						regex,
						replace,
					);
				}

				req.body.content = newContent;
			}
		} catch (e) {
			console.error(
				"[shelter/text-replacements] BIG OOPSIE while replacing, sending request as-is!",
				req,
				e,
			);
		}

		return send(req);
	},
);

const uncss = injectCss(css);

export const onUnload = () => (uncss(), unintercept());
