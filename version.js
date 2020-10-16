if (typeof window === "undefined") {
  // nodejs
  const fs = require("fs");
  const version = require("./package.json").version;
  const angularJson = require("./angular.json");
  const defaultProject = angularJson.defaultProject;

  // create version in assets
  fs.writeFileSync("./src/version.json", JSON.stringify({ version }));
  const { assets, scripts } = angularJson.projects[
    defaultProject
  ].architect.build.options;

  let existImport = false;

  if (!assets.includes("src/version.json")) {
    assets.push("src/version.json");
    existImport = true;
  }

  if (!scripts.includes("version.js")) {
    scripts.push("version.js");
    existImport = true;
  }

  existImport &&
    fs.writeFileSync("./angular.json", JSON.stringify(angularJson));
} else {
  // Browser
  (async function () {
    const verifyIntervalMinutes = 2;

    const getVersion = () =>
      new Promise((done) => {
        fetch(`version.json?v=${Date.now()}`)
          .then((res) => res.json())
          .then((out) => {
            done(out);
          })
          .catch((err) => {
            throw err;
          });
      });

    const { version } = await getVersion();
    console.log(`Version: ${version}`);

    const verifyVersion = () => {
      getVersion().then((data) => {
        const currentVersion = data.version;
        if (currentVersion !== version) {
          // update
          localStorage.clear();
          sessionStorage.clear();
          location.reload();
        }
      });
    };

    setInterval(() => verifyVersion(), 60000 * verifyIntervalMinutes);
  })();
}
