import { loadTheme, removeTheme, unloadTheme } from "../../util/themeLoadUtil";
import { BDBadge, CCBadge } from "../badges";
import fetchTheme from "../../util/fetchTheme";
import showCarouselModal from "../CarouselModal";

import Delete from "../../assets/Delete";
import Copy from "../../assets/Copy";

const {
	ui: {Switch},
	plugin: {store}
} = shelter;

const copyText = txt => navigator.clipboard.writeText(txt);

function themeIsEnabled(url) {
	for (const theme of store.themes)
		if (theme.url === url && theme.enabled) return true;

	return false;
}

const themeIsInstalled = (url) =>
	store.themes.some((t) => t.url === url);

export default (props) => (
  <div class="ysink_stain_card ysink_stain_tcard" style={{ marginBottom: props.gap }}>
    <div
      class="ysink_stain_tmedia"
      style={{
        backgroundImage:
          props.theme.media &&
          `url(${Array.isArray(props.theme.media) ? props.theme.media[0] : props.theme.media})`,
      }}
      onClick={() => theme.media && showCarouselModal(theme.media)}
    >
      {props.theme.media ? (
        <div class="ysink_stain_tview">VIEW MEDIA</div>
      ) : (
        <div>NO MEDIA</div>
      )}
    </div>

    <div class="ysink_stain_title">
      {props.theme.compat ? <BDBadge /> : <CCBadge />}
      {props.theme.name}
    </div>

    <div class="ysink_stain_tdesc">{props.theme.description}</div>

    <div class="ysink_stain_tacts">
      <Copy class="ysink_stain_iconbtn" onClick={() => copyText(props.theme.url)} />

      {themeIsInstalled(props.theme.url) ? (
        <Delete
          class="ysink_stain_iconbtn"
          onClick={() => {
            removeTheme(props.theme);
          }}
        />
      ) : (
        []
      )}

      <Switch
        checked={themeIsEnabled(props.theme.url)}
        onChange={
          async () =>
            themeIsEnabled(props.theme.url)
              ? unloadTheme(props.theme)
              : loadTheme(await fetchTheme(props.theme.url)) // not awaiting but loadTheme is async
        }
      />
    </div>

    <div class="ysink_stain_taulic">
      {props.theme.author ? `by ${props.theme.author} ` : ""}
      {props.theme.license ? `under ${props.theme.license}` : ""}
    </div>
  </div>
);
