import tzBuilder from "timezone";
import tzZones from "timezone/zones";

// type Timezone = { base: string, hours?: number };

const timezone = tzBuilder(tzZones);

const tzData = Object.fromEntries(
	tzZones
		.flat()
		.flatMap((zon) => zon.zones)
		.filter((e) => e)
		.flatMap(Object.entries),
);

export const tzKeywords = Object.keys(tzData);

const tzRegex = new RegExp(
	`(?<![a-zA-Z0-9])(${tzKeywords.join("|")})(?:([+-]\\d+)(?::(\\d+))?)?\\b`,
);

export const parseTimeZone = (txt) => {
	if (!txt) return;
	const match = txt.match(tzRegex);
	if (!match) return;
	const [, base, hours /*, mins*/] = match;

	return { base, hours /*, mins*/ };
};

// hello sir can i interest you in boolean logic today?
export const emitTimeZone = (tz) =>
	tz.base + ((tz.hours ?? 0) > 0 ? "+" : "") + (tz.hours ?? "");
/*(tz.hours || (tz.mins ? "+0" : "")) +
	(tz.mins ? ":" + tz.mins : "");*/

export const formatInTimeZone = (momentTime, zone, fmt) =>
	timezone(
		momentTime,
		zone.base,
		"+" + (zone.hours ?? 0) + " hour",
		//"+" + (zone.mins ?? 0) + " minute",
		fmt,
	);

// purely for consistency's sake!
export const formatAsIs = (momentTime, fmt) =>
	timezone(momentTime, `+${momentTime.utcOffset()} minute`, fmt);
