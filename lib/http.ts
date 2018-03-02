import * as request_ from "request";

// rollup workaround :\ - https://github.com/rollup/rollup/issues/670
const request = request_;

export async function http(
  opts: request_.OptionsWithUri
): Promise<request_.Response> {
  return new Promise<request_.Response>((resolve, reject) => {
    request(opts, (err, res, body) => {
      if (err || res.statusCode === 500) {
        reject(err);
      }

      resolve(res);
    });
  });
}
