import RepoCard from "../cards/RepoCard";

import { addRepo } from "../../util/friendlyUtils";

const toast = (str) => console.log("toasted: ", str); //showToast({ title: str, duration: 5000 });

const {
	solid: {createSignal},
	plugin: {store},
	ui: {
		Button,
		Divider,
		ButtonSizes
	}
} = shelter;

export default () => {
	const [url, setUrl] = createSignal("");

	return (
			<div>
				<div
					class="ysink_stain_row"
					style={{
					display: "flex",
					// TODO
				}}>
					{/*TODO*/}
					{/*<TextInput*/}
					<input
						placeholder="https://example.com/repo"
						type="text"
						value={url()}
						onInput={(e) => setUrl(e.target.value)}
					/>
					<Button
						class="ysink_stain_button"
						size={ButtonSizes.MEDIUM}
						onClick={async () => {
							if (await addRepo(url(), toast, toast)) setUrl("");
						}}
					>
						Add
					</Button>
				</div>

				{/*<Flex basis="auto" grow={1} shrink={1} class="ysink_stain_row">

				</Flex>*/}

				<Divider mt=".5rem" mb=".5rem" />

				<div class="ysink_stain_cardcontainer">
					{store.repos.map((repo) => (<RepoCard repo={repo} />))}
				</div>
			</div>
	);
};
