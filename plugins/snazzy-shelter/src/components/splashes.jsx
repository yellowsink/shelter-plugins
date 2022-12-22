const {
	Header,
	HeaderTags,
	Text,
	Button,
	ButtonColors,
	ButtonSizes
} = shelter.ui;

const Splash = (props) => (
	<div class="ysink_stain_nosplash">
		<Header tag={HeaderTags.H2}>{props.title}</Header>
		<Text>{props.subtitle}</Text>
		<Button
			class="ysink_stain_button"
			color={ButtonColors.GREEN}
			sizes={ButtonSizes.LARGE}
			onClick={props.onClick}
		>
			{props.btnText}
		</Button>
	</div>
);

export const NoRepos = (props) => (
	<Splash
		title="No Repos"
		subtitle="Add one in the repo manager!"
		onClick={props.goToRepos}
		btnText="Open repo manager"
	/>
);

export const NoThemes = (props) => (
	<Splash
		title="No Themes"
		subtitle="Paste a link in above, or head over to the store"
		onClick={props.goToStore}
		btnText="Get some themes"
	/>
);
