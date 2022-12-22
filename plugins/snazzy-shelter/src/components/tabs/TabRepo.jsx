import { persist } from "@cumcord/pluginData";
import { useNest } from "@cumcord/utils";
import { showToast } from "@cumcord/ui/toasts";

import { ErrorBoundary } from "@cumcord/ui/components";
import RepoCard from "../cards/RepoCard";

import { Flex, FormSection, TextInput, Button } from "../../WPMODULES";
import { addRepo } from "../../util/friendlyUtils";

const toast = (str) => showToast({ title: str, duration: 5000 });

export default () => {
	const [url, setUrl] = React.useState("");
	useNest(persist);

	return (
		<ErrorBoundary>
			<FormSection>
				<Flex basis="auto" grow={1} shrink={1} className="ysink_stain_row">
					<TextInput
						placeholder="https://example.com/repo"
						type="text"
						value={url}
						onChange={(e) => setUrl(e)}
					/>
					<Button
						className="ysink_stain_button"
						onClick={async () => {
							if (await addRepo(url, toast, toast)) setUrl("");
						}}
					>
						Add
					</Button>
				</Flex>

				<div className="ysink_stain_divide" />

				<div className="ysink_stain_cardcontainer">
					{persist.ghost.repos.map((repo) => (
						<RepoCard repo={repo} />
					))}
				</div>
			</FormSection>
		</ErrorBoundary>
	);
};
