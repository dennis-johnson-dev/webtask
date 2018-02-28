import { http } from "./http";

export interface Stat {
  fileName: string;
  size: number;
}

export interface Main {
  owner: string;
  repo: string;
  token: string;
  stats: [Stat];
  pr: string;
}

export async function main({
  owner,
  repo,
  token,
  stats,
  pr,
}: Main): Promise<void> {
  const [, prNumber] = pr.split("/pull/"); // example = 'https://github.com/songawee/webpack-example/pull/1'

  const repository = await http({
    uri: `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    method: "get",
    headers: {
      "User-Agent": "webtask-test",
      Authorization: `Bearer ${token}`,
    },
    json: true,
  });

  const header = ["| Filename | Size |", "| --- | --- |"];

  const fileData = stats.map(datum => {
    const size =
      datum.size < 1
        ? `${datum.size * 1000} bytes`
        : `${datum.size.toFixed(2)} kB`;

    return `| ${datum.fileName} | ${size} |`;
  });

  const body = header.concat(...fileData).join("\n");

  const commentResponse = await http({
    method: "post",
    uri: repository.body._links.comments.href,
    json: {
      body,
    },
    headers: {
      "User-Agent": "webtask-test",
      Authorization: `Bearer ${token}`,
    },
  });
}
