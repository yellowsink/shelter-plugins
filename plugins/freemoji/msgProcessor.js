const {
	plugin: {store},
	flux: {
		stores: {
			SelectedGuildStore,
			EmojiStore
		}
	}
} = shelter;

const isInDms = () =>
	document
		.querySelector('[data-list-item-id="guildsnav___home"]')
		.classList.contains(selected);

const getEmoteSize = () =>
	Number.isSafeInteger(parseInt(store.size)) ? store.size : 64;

function extractUnusableEmojis(messageString, size) {
	const emojiStrings = messageString.matchAll(/<a?:(\w+):(\d+)>/gi);
	const emojiUrls = [];

	for (const emojiString of emojiStrings) {
		// fetch required info about the emoji
		const emoji = EmojiStore.getCustomEmojiById(emojiString[2]);

		//check emoji usability
		if (
			emoji.guildId !== SelectedGuildStore.getLastSelectedGuildId() ||
			emoji.animated ||
			isInDms()
		) {
			// remove emote from original msg
			messageString = messageString.replace(emojiString[0], "");
			// add to emotes to send
			emojiUrls.push(`${emoji.url.split("?")[0]}?size=${size}`);
		}
	}

	return [messageString.trim(), emojiUrls];
}

// fixes message object if needed, modifies by reference and does not return its arg
export default (content) => {
	if (!content.match(/<a?:(\w+):(\d+)>/i)) return;

	//find all emojis from the captured message string and return object with emojiURLS and content
	let [newContent, extractedEmojis] = extractUnusableEmojis(
		content,
		getEmoteSize()
	);

	if (extractedEmojis.length > 0)
		newContent += "\n" + extractedEmojis.join("\n");

	return newContent;
};