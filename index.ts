let qr: any = "";
let checkInterval: NodeJS.Timer;

document.querySelector(".refresh").addEventListener("click", getQrCode);
const userInfoDom = document.querySelector("#user-Info");
const expireDom = document.querySelector("#expire");
const tipDom = document.querySelector("#tip");
export function getQrCode() {
  expireDom.classList.remove("show");
  fetch("/api/generate?img=true")
    .then((res) => res.json())
    .then((res) => {
      qr = res;
      const qrcode = document.getElementById("qrcode");
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
        userInfoDom.innerHTML = res.data.bizExt.pds_login_result.refreshToken;
        expireDom.classList.add("show");
        clearInterval(checkInterval);
      }
      tipDom.innerHTML = res.data.tip;
    });
}

setTimeout(getQrCode, 200);
