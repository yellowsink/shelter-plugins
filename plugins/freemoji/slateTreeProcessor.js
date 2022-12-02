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
	!!document.querySelector('[data-list-item-id="guildsnav___home"][class*="selected"]');

const getEmoteSize = () =>
	Number.isSafeInteger(parseInt(store.size)) ? store.size : 64;

// fixes slate tree
export default (slateTree) => {
	//if (!slateTree.match(/<a?:(\w+):(\d+)>/i)) return;

	// find all emojis from the tree and return new emojiURLS
	const extractedEmojis = [];

	const newSlateTree = [];

	for (const line of slateTree) {
		const newLine = [];

		for (const lineItem of line.children) {
			if (lineItem.emoji) {
				// fetch required info about the emoji
				const emoji = EmojiStore.getCustomEmojiById(lineItem.emoji.emojiId);

				//check emoji usability
				if (
					emoji.guildId !== SelectedGuildStore.getLastSelectedGuildId() ||
					emoji.animated ||
					isInDms()
				) {
					// add to emotes to send
					extractedEmojis.push(`${emoji.url.split("?")[0]}?size=${(getEmoteSize())}`);
					// don't add to the line
					continue;
				}
			}

			newLine.push(lineItem);
		}

		newSlateTree.push({
			...line,
			children: newLine
		});
	}

	for (const extracted of extractedEmojis)
		newSlateTree.push({
			type: "line",
			children: [{text: extracted}]
		})

	return newSlateTree;
};