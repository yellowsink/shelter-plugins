const serverHeader_class = "container-1NXEtd";
const serverName_class = "name-3Uvkvr";
const manifestVersion = "4.0.0";

// == Yoinked from "https://www.delftstack.com/howto/javascript/get-json-from-url-in-javascript/" ==
var get = function (type, url, callback) {
  var xmlhttprequest = new XMLHttpRequest();
  xmlhttprequest.open('GET', url, true);
  xmlhttprequest.responseType = type;
  xmlhttprequest.onload = function () {
    var status = xmlhttprequest.status;
    if (status == 200) {
      callback(null, xmlhttprequest.response);
    } else {
      callback(status, xmlhttprequest.response);
    }
  };
  xmlhttprequest.send();
};
// == ------------------------------------------------------------------------------------------- ==

function log(type, input) {
  let color;
  if (type == "log") {
    color = "#7289da";
  } else if (type == "info") {
    color = "#43b581";
  } else if (type == "warn") {
    color = "#faa61a";
  } else if (type == "error") {
    color = "#f04747";
  }
  console.log(`%cDiscord CSL v${manifestVersion}%c ${input}`, `color: ${color}; border-right: 2px solid ${color}; padding-right: 5px; font-weight: bold`, "font-style: italic;", "");
}

function addStyle() {
  const style = document.createElement("style");
  style.textContent = `
 [csl-server] div.guildIconContainer-3QvE6w {
     transform: translate(-6%, 6%)
 }
 [csl-server] .${serverName_class} {
     display: flex;
     justify-content: center;
     position: relative;
 }
 
 /* == Shrink server banners to header instead of disappearing == */
 [csl-server] [class*="animatedContainer-"] {
     opacity: 1 !important;
     transition: opacity .5s, blur .5s;
 }
 [csl-server] [class*="animatedContainer-"] > [class*="bannerImage-"] {
     transition: margin .5s;
 }
 [csl-server] :not([class*="bannerVisible-"]) > [class*="animatedContainer-"] {
     opacity: .35 !important;
     filter: blur(2px);
     height: 138px;
 }
 [csl-server] :not([class*="bannerVisible-"]) > [class*="animatedContainer-"] > [class*="bannerImage-"] {
     margin-top: -12px;
 }`;
  style.id = "DiscordCSL-style"
  document.head.append(style);
}

function removeStyle() {
  var removeData = document.getElementById("DiscordCSL-style");
  removeData.parentNode.removeChild(removeData);
}

var injectLogo = () => {
  get("json", 'https://raw.githubusercontent.com/DiscordCSL/database/main/db.json', function (err, data) {
    if (err !== null) {
      log("error", `Failed to fetch database json!`);
    } else {
      var all = data.servers.length,
        serverData;

      while (all--) {

        if (window.location.pathname.split('/')[2] == data.servers[all].id) {
          if (!(document.getElementsByClassName(serverHeader_class)[0].hasAttribute('csl-server'))) {
            document.getElementsByClassName(serverHeader_class)[0].setAttribute('csl-server', '');
            serverData = data.servers[all];
            get("text", serverData.logoURL, function (err, data) {
              if (err !== null) {
                log("error", `Failed to fetch server logo vector data! | ${serverData.id}`);
              } else {
                document.getElementsByClassName(serverName_class)[0].innerHTML = data;
              }
            });
          } else if (Error && !(document.getElementsByClassName(serverHeader_class)[0].hasAttribute('csl-server'))) {
            log("error", "No server header found. Try restarting the app and reinstalling the plugin, before reporting any issues.")
          }
        }
      }
    }
  })
};
window.addEventListener("load", function () {

});


export function onLoad() {
  addStyle();
  setInterval(injectLogo, 0);
  log("log", "Thanks for installing Custom Server Logos!")
  get("json", 'https://raw.githubusercontent.com/DiscordCSL/database/main/db.json', function (err, data) {
    if (err !== null) {
      log("error", `Failed to fetch database json!`);
    } else {
      if (data.latestVersion > manifestVersion) {
        log("error", `You're running an older version of this plugin, please update to the latest version, ${data.latestVersion}.`)
      } else {
        log("info", "You're running the latest and greatest.")
      }
    }
  })
}
export function onUnload() {
  removeStyle();
  clearInterval(injectLogo);
  log("log", "See ya next time!")
}