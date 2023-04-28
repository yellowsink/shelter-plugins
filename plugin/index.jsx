import styles from "./styles.scss";

const {
    flux: {
        dispatcher,
        storesFlat: {SelectedChannelStore, ChannelStore}
    },
    observeDom,
    ui: { injectCss }
} = shelter;

const manifestVersion = "5.0.0"

// CDSL Console Log
function log(input, type) {
    let color
    if (type == "info") {
        color = "#43b581"
    } else if (type == "warn") {
        color = "#faa61a"
    } else if (type == "error") {
        color = "#f04747"
    } else {
        color = "#7289da"
    }
    console.log(`%cDiscord CSL v${manifestVersion}%c ${input}`, `color: ${color}; padding: 3px; border-radius: 4px; background: ${color}22; border-right: 2px solid ${color}; padding-right: 5px; padding-left: 6px; font-weight: bold`, "font-style: italic;", "");
}

// Fetching the database
let data
async function getDB() {
    data = fetch('https://raw.githubusercontent.com/DiscordCSL/database/main/db.json')
        .then(r => r.json())

    data = await data;

    log("Thanks for installing Custom Server Logos!")
    if (data.latestVersion > manifestVersion) {
        log(`You're running an older version of this plugin. Update to v${data.latestVersion}`, "error")
    } else {
        log("You're running the latest and greatest!", "info")
    }
}


function handleDispatch() {
    const stopObs = observeDom('[class*="sidebar-"] > [class*="container-"]:not([csl-server])', async (el) => {
        stopObs();

        const nameEl = el.querySelector('[class*="name-"]');
        if (!nameEl) return;

        const currentChannel = ChannelStore.getChannel(SelectedChannelStore.getChannelId());
        const currentGuildId = currentChannel?.guild_id;
        if (!currentGuildId) return;

        let db = data;
        if (db instanceof Promise) db = await data;

        for (const server of db.servers) {
            if (server.id !== currentGuildId) continue;

            el.setAttribute("csl-server", "");

            nameEl.replaceChildren(<img src={server.logoURL} />);
        }
    });

    // just in case we didn't find it
    setTimeout(stopObs, 100);
}

// Plugin Stuff
getDB();
const removeStyle = injectCss(styles);
dispatcher.subscribe("CHANNEL_SELECT", handleDispatch);

export function onUnload() {
    removeStyle()
    dispatcher.unsubscribe("CHANNEL_SELECT", handleDispatch);
    log("See ya next time!")
}
