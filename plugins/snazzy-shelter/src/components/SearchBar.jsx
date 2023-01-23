export default (props) => (
	<shelter.ui.TextBox
		value={props.query}
		onInput={props.onChange}
		placeholder="Search themes..."
	/>
);
