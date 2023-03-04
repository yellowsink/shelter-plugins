import Settings from "./Settings";
import UserMan from "./UserMan";

const pages = [Settings, UserMan];

export default () => {
	const [currentPage, setCurrentPage] = shelter.solid.createSignal(0);

	return shelter.solid.createMemo(() => pages[currentPage()](setCurrentPage));
};
