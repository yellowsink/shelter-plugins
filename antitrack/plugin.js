(()=>{var{scoped:o}=shelter.plugin;try{window.__SENTRY__.hub.getClient().getOptions().enabled=!1,Object.keys(console).forEach(e=>console[e]=console[e].__sentry_original__??console[e])}catch{}o.http.intercept("POST",/^\/science|^\/error-reporting-proxy/,()=>{});})();