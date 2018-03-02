import { main, Stat } from "./lib/module";

interface Context {
  data: {
    stats: [Stat];
    meta: {
      pr: string;
      repo: string;
      username: string;
    };
  };
  secrets: {
    GH_TOKEN: string;
  };
}

module.exports = function(ctx: Context, cb) {
  const stats = ctx.data.stats;
  const owner = ctx.data.meta.username;
  const repo = ctx.data.meta.repo;
  const pr = ctx.data.meta.pr;

  main({
    stats,
    owner,
    pr,
    repo,
    token: ctx.secrets.GH_TOKEN,
  })
    .then(res => {
      cb(null, "Success");
    })
    .catch(err => {
      console.log(err);
      cb(err);
    });
};
