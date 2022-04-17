import type { VercelRequest, VercelResponse } from "@vercel/node";
import https from "https";

export default function (req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { ck, t } = req.query;
  const params: any = {
    t,
    ck,
    appName: "aliyun_drive",
    appEntrance: "web",
    isMobile: "false",
    lang: "zh_CN",
    returnUrl: "",
    fromSite: "52",
    bizParams: "",
    navlanguage: "zh-CN",
    navPlatform: "MacIntel",
  };

  let body = "";
  Object.keys(params).forEach((key) => {
    body += "&" + key + "=" + params[key];
  });

  const status: any = {
    NEW: "请用阿里云盘 App 扫码",
    SCANED: "请在手机上确认",
    EXPIRED: "二维码已过期",
    CANCELED: "已取消",
    CONFIRMED: "已确认",
  };
  https
    .request(
      {
        method: "POST",
        host: "passport.aliyundrive.com",
        path:
          "/newlogin/qrcode/query.do?appName=aliyun_drive&fromSite=52&_bx-v=2.0.31",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        timeout: 3000,
      },
      (response) => {
        let data: any = "";
        response.on("data", (d) => {
          data += d;
        });
        response.on("end", () => {
          const rt = JSON.parse(data).content;
          if (rt.data.qrCodeStatus === "CONFIRMED") {
            rt.data.bizExt = JSON.parse(atob(rt.data.bizExt));
          } else {
            //添加 一个tip
            rt.data.tip = status[rt.data.qrCodeStatus];
          }
          res.send(rt);
        });
      }
    )
    .on("error", (e) => {
      res.status(500).send(e);
    })
    .end(body);
}
