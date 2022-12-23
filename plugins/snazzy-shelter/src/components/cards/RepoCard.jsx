import fetchRepo from "../../util/fetchRepo";
import { officialRepos } from "../../defaultRepos";
import {TextBadge} from "../badges";

const {
	solid: { createResource },
	ui: {Text,
	Button,
	ButtonColors},
	plugin: {store}
} = shelter;

export default (props) => {
	const [fullRepo] = createResource(() => props.repo, fetchRepo);

	return (
		<div class="ysink_stain_card ysink_stain_row">
			<div>
				<div class="ysink_stain_title">
					{fullRepo()?.manifest.meta.name}
					{officialRepos.includes(props.repo) && (
						<TextBadge
							class="ysink_stain_officialbadge"
							text="official"
							color="var(--info-positive-foreground)"
						/>
					)}
				</div>

				<Text>{props.repo}</Text>
			</div>

			<Button
				color={ButtonColors.RED}
				class="ysink_stain_button"
				onClick={() =>
					(store.repos = store.repos.filter((r) => r !== props.repo))
				}
			>
				Remove Repo
			</Button>
		</div>
	);
};
