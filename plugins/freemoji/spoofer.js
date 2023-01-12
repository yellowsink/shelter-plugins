const user = () => shelter.flux.stores.UserStore.getCurrentUser();

let realNitro;

export const spoofNitro = () => {
	// already spoofed!
	if (realNitro) return;

	realNitro = user().premiumType;
	user().premiumType = 2;
};
export const revertNitro = () => {
	if (realNitro === undefined) return;
	user().premiumType = realNitro;
	realNitro = undefined;
};
