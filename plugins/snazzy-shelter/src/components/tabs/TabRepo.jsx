import RepoCard from "../cards/RepoCard";

import { addRepo } from "../../util/friendlyUtils";

const {showToast} = shelter.ui;

const toast = (str) => showToast({ title: str, duration: 5000 });

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
					display: "flex"
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

				<Divider mt=".5rem" mb=".5rem" />

				<div class="ysink_stain_cardcontainer">
					{store.repos.map((repo) => (<RepoCard repo={repo} />))}
				</div>
			</div>
	);
};
