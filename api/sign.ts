import type { VercelRequest, VercelResponse } from "@vercel/node";

import { AliyundriveSign } from "../utils";

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { refreshToken } = req.query;

  try {
    const ali = new AliyundriveSign();
    await ali.updateAccesssToken(refreshToken as string);
    await ali.sign_in();
    res.status(200).send(ali.messages.join("\n"));
  } catch (e) {
    res.status(500).send(e);
  }
}
