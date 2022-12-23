import TabInstalled from "./tabs/TabInstalled";
import TabQuickCSS from "./tabs/TabQuickCSS";
import TabRepo from "./tabs/TabRepo";
import TabStore from "./tabs/TabStore";
import TabDebug from "./tabs/TabDebug";

import TabBar from "./TabBar";

const {Header, HeaderTags} = shelter.ui;

export default () => {
	return (
		<div>
			<Header tag={HeaderTags.H1}>Snazzy Shelter Settings</Header>

			<TabBar
				items={[
					{ text: "Installed", component: TabInstalled },
					{ text: "Store", component: TabStore },
					{ text: "Repos", component: TabRepo },
					{ text: "Quick CSS", component: TabQuickCSS },
					{ text: "Debug", component: TabDebug },
				]}
			/>
		</div>
	);
};
