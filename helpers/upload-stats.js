const fs = require("fs");
const path = require("path");
const request = require("request");
const util = require("util");

const readDir = util.promisify(fs.readdir);
const openFile = util.promisify(fs.open);
const readStats = util.promisify(fs.fstat);

async function main() {
  const dirPath = path.resolve(process.cwd(), "./dist");
  const files = await readDir(dirPath);
  const jsFileStats = await Promise.all(
    files
      .filter(file => file.includes(".js") && !file.includes(".map"))
      .map(async file => {
        const filePath = path.resolve(dirPath, file);
        const openedFile = await openFile(filePath, "r");
        const stats = await readStats(openedFile);

        return {
          fileName: file,
          size: stats.size / 1000,
        };
      })
  );

  await http({
    method: "POST",
    uri: "your webtask uri",
    json: {
      stats: jsFileStats,
      meta: {
        username: "github username",
        repo: "repo",
        pr: "https://github.com/owner/repo/pull/1",
      },
    },
  });
}

async function http(opts) {
  return new Promise((resolve, reject) => {
    request(opts, (err, res, body) => {
      if (err || res.statusCode === 500) {
        return reject(err);
      }

      resolve(res);
    });
  });
}

main()
  .then(() => {
    console.log("success");
  })
  .catch(err => {
    console.log("oops", err);
  });
