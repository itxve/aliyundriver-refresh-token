let qr: any = "";
let checkInterval: NodeJS.Timer;

document.querySelector(".refresh").addEventListener("click", getQrCode);
const userInfoDom = document.querySelector("#user-Info");
const expireDom = document.querySelector("#expire");

export function getQrCode() {
  fetch("/api/qrcode-generate?img=true")
    .then((res) => res.json())
    .then((res) => {
      qr = res;
      const qrcode = document.getElementById("qrcode");
      qrcode.setAttribute("src", res.codeContent);
      checkInterval = setInterval(checkQrCode, 1000);
    });
}

export function checkQrCode() {
  fetch("/api/qrcode-state-query?ck=" + qr.ck + "&t=" + qr.t)
    .then((res) => res.json())
    .then((res) => {
      if (["EXPIRED", "CANCELED"].includes(res.data.qrCodeStatus)) {
        if (checkInterval) {
          clearInterval(checkInterval);
        }
        expireDom.classList.add("show");
      } else if (["CONFIRMED"].includes(res.data.qrCodeStatus)) {
        console.log(res, "CONFIRMED");
        userInfoDom.innerHTML = res.data.bizExt;
      }
    });
}

setTimeout(getQrCode, 1000);
