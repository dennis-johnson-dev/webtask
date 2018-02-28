import { expect } from "chai";
import * as nock from "nock";

import { main, Stat } from "../../lib/module";

describe("Main", () => {
  it("posts comment to GitHub", async () => {
    const stats: [Stat] = [{ fileName: "app.js", size: 8.417 }];

    const owner = "owner";
    const repo = "repo";
    const token = "token";
    const prNumber = 2;
    const pr = `https://github.com/songawee/webpack-example/pull/${prNumber}`;

    const baseHref = "https://api.github.com";
    const uri = `/repos/${owner}/${repo}/issues/1347/comments`;
    const href = `${baseHref}${uri}`;

    const getRepoScope: nock.Scope = nock("https://api.github.com")
      .get(`/repos/${owner}/${repo}/pulls/${prNumber}`)
      .reply(200, { _links: { comments: { href } } });

    const updateCommentScope: nock.Scope = nock(baseHref)
      .post(uri, req => {
        expect(req.body.replace(/\s+/g, "")).to.equal(
          `
            | Filename | Size |
            | --- | --- |
            | app.js | 8.42 kB |
          `.replace(/\s+/g, "")
        );

        return true;
      })
      .reply(200);

    await main({ owner, repo, token, stats, pr });

    getRepoScope.done();
    updateCommentScope.done();
  });

  it("displays sizes less than 1 kB", async () => {
    const stats: [Stat] = [{ fileName: "app.js", size: 0.417 }];

    const owner = "owner";
    const repo = "repo";
    const token = "token";
    const prNumber = 2;
    const pr = `https://github.com/songawee/webpack-example/pull/${prNumber}`;

    const baseHref = "https://api.github.com";
    const uri = `/repos/${owner}/${repo}/issues/1347/comments`;
    const href = `${baseHref}${uri}`;

    const getRepoScope: nock.Scope = nock("https://api.github.com")
      .get(`/repos/${owner}/${repo}/pulls/${prNumber}`)
      .reply(200, { _links: { comments: { href } } });

    const updateCommentScope: nock.Scope = nock(baseHref)
      .post(uri, req => {
        expect(req.body.replace(/\s+/g, "")).to.equal(
          `
            | Filename | Size |
            | --- | --- |
            | app.js | 417 bytes |
          `.replace(/\s+/g, "")
        );

        return true;
      })
      .reply(200);

    await main({ owner, repo, token, stats, pr });

    getRepoScope.done();
    updateCommentScope.done();
  });
});
