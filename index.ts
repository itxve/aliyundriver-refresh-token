let qr: any = "";
let checkInterval: NodeJS.Timer;

document.querySelector(".refresh")!.addEventListener("click", getQrCode);
const userInfoDom = document.querySelector("#user-info")!;
const expireDom = document.querySelector("#expire")!;
const tipDom = document.querySelector("#tip")!;
const nickNameDom = document.querySelector("#nick-name")!;
const userImgDom = document.querySelector("#user-img")!;
const userDom = document.querySelector("#user")!;

export function getQrCode() {
  tipDom.innerHTML = "请用阿里云盘 App 扫码";
  expireDom.classList.remove("show");
  userDom.classList.add("hidden");

  fetch("/api/generate?img=true")
    .then((res) => res.json())
    .then((res) => {
      qr = res;
      const qrcode = document.getElementById("qrcode")!;
      qrcode.setAttribute("src", res.codeContent);
      checkInterval = setInterval(checkQrCode, 2500);
    });
}

export function checkQrCode() {
  fetch("/api/state-query?ck=" + qr.ck + "&t=" + qr.t)
    .then((res) => res.json())
    .then((res) => {
      if (["EXPIRED", "CANCELED"].includes(res.data.qrCodeStatus)) {
        clearInterval(checkInterval);
        expireDom.classList.add("show");
      } else if (["CONFIRMED"].includes(res.data.qrCodeStatus)) {
        console.log(res, "CONFIRMED");

        const { nickName, avatar, refreshToken } =
          res.data.bizExt.pds_login_result;

        (userInfoDom as HTMLElement).innerText = refreshToken;
        nickNameDom.innerHTML = nickName;
        userImgDom.setAttribute("src", avatar);
        userDom.classList.remove("hidden");
        expireDom.classList.add("show");
        clearInterval(checkInterval);
      }
      tipDom.innerHTML = res.data.tip;
    });
}

setTimeout(getQrCode, 200);
