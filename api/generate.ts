import type { VercelRequest, VercelResponse } from "@vercel/node";
import QRCode from "qrcode";
import https from "https";

export default function (req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { img } = req.query;
  https
    .get(
      {
        host: "passport.aliyundrive.com",
        path:
          "/newlogin/qrcode/generate.do?" +
          "appName=aliyun_drive" +
          "&fromSite=52" +
          "&appName=aliyun_drive" +
          "&appEntrance=web" +
          "&isMobile=false" +
          "&lang=zh_CN" +
          "&returnUrl=" +
          "&bizParams=" +
          "&_bx-v=2.0.31",
        timeout: 3000,
      },
      (response) => {
        let data: any = "";
        response.on("data", (d) => {
          data += d;
        });
        response.on("end", async () => {
          const json = JSON.parse(data);
          const result = {
            codeContent: json.content.data.codeContent,
            ck: json.content.data.ck,
            t: json.content.data.t,
          };
          if (img) {
            const image = await QRCode.toDataURL(result.codeContent);
            result.codeContent = image;
          }
          res.send(result);
        });
      }
    )
    .on("error", (e) => {
      res.status(500).send(e);
    });
}
