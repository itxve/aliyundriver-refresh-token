## QR Code 扫码获取阿里云盘 refresh token

## Vercel 部署

<a href="https://vercel.com/new/import?s=https://github.com/itxve/aliyundriver-refresh-token"><img src="https://vercel.com/button" height="24"></a>

## 本地 开发

- `yarn serve`
- `yarn vercel:dev` 需要登陆

### 生成二维码

说明 : 调用此接口 , 获取二维码

**调用例子 :** `/api/generate`

**可选参数 :**
`img`: boolean

**返回说明 :**

- `t` : 一个用于查询的参数传递给 `/api/state-query` （tip：这个不是当前的时间戳）
- `ck` : 一个用于查询的参数传递给 `/api/state-query`
- `codeContent` : `img`为 true 时是一个 base64 图片否则是二维码的接口地址（可自行绘制二维码）

### 查询二维码状态

说明 : 调用此接口 ,查询二维码状态

**调用例子 :** `/api/state-query?t=&ck=`

**必选参数 :**

`t` : 使用 `/api/generate`接口返回的 `t`

`ck` : 使用 `/api/generate`接口返回的 `ck`

tip : 如果不匹配 查询结果一直是 `EXPIRED`的状态

**返回说明 :**

- `qrCodeStatus`
  - NEW: "请用阿里云盘 App 扫码",
  - SCANED: "请在手机上确认",
  - EXPIRED: "二维码已过期",
  - CANCELED: "已取消",
  - CONFIRMED: "已确认"
- `bizExt` 用户信息、token 等... (已经 base64 解码了，可直接食用)

### 签到 [源代码阿里云盘每日签到脚本 青龙面板支持](https://github.com/mrabit/aliyundriveDailyCheck)

说明 : 调用此接口 ,查询进行签到

**调用例子 :** `/api/sign?refreshToken=`

**必选参数 :**

`refreshToken` : 一个用于刷新 token 的 refreshToken

**返回 :**

<b>
本月累计签到 x 天 <br/>
第 x 天奖励领取成功: 获得 xxx
</b>

## 相关项目

[阿里云盘每日签到脚本 青龙面板支持](https://github.com/mrabit/aliyundriveDailyCheck)

[阿里云盘 Go SDK](https://github.com/chyroc/go-aliyundrive)

## Demo

[示例](https://aliyundriver-refresh-token.vercel.app/)

## License

[The MIT License (MIT)](https://github.com/itxve/aliyundriver-refresh-token/blob/master/LICENSE)
