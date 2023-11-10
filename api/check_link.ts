import type { VercelRequest, VercelResponse } from "@vercel/node";

const headers = {
  Referer: "https://www.aliyundrive.com/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
};

async function matchShareId(link: string) {
  const aliRe = /www.aliyundrive.com\/s\/(.*)/;
  const aliResult = link.match(aliRe);

  if (!aliResult) {
    throw new Error("Link is error");
  }
  return aliResult[1];
}

async function linkCheck(link: string) {
  const aliRe = /www.aliyundrive.com\/s\/(.*)/;
  const aliResult = link.match(aliRe);

  if (!aliResult) {
    throw new Error("Link is error");
  }
  const shareId = aliResult[1];
  return fetch(
    "https://api.aliyundrive.com/adrive/v3/share_link/get_share_by_anonymous",
    { method: "post", body: JSON.stringify({ share_id: shareId }), headers }
  );
}

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { link } = req.query;

  if (!link) {
    res.status(200).send({ code: 500, msg: "link is empty", data: null });
    return Promise.reject();
  }

  return linkCheck(link as string)
    .then(async (r) => {
      if (r.status == 200) {
        res.status(200).send({ code: r.status, msg: "", data: await r.json() });
      } else {
        res.status(200).send({ code: r.status, msg: "", data: await r.json() });
      }
    })
    .catch((e: Error) => {
      res.status(200).send({ code: 500, msg: e.message, data: null });
    });
}
