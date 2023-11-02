let qr: any = "";
let checkInterval: NodeJS.Timeout;
const host = "";

document.querySelector(".refresh")!.addEventListener("click", getQrCode);
document.querySelector("#sign")!.addEventListener("click", sign);
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

  fetch(host + "/api/generate?img=true")
    .then((res) => res.json())
    .then((res) => {
      qr = res;
      const qrcode = document.getElementById("qrcode")!;
      qrcode.setAttribute("src", res.codeContent);
      checkInterval = setInterval(checkQrCode, 2500);
    });
}

export function checkQrCode() {
  fetch(host + "/api/state-query?ck=" + qr.ck + "&t=" + qr.t)
    .then((res) => res.json())
    .then((res) => {
      if (["EXPIRED", "CANCELED"].includes(res.data.qrCodeStatus)) {
        clearInterval(checkInterval);
        expireDom.classList.add("show");
      } else if (["CONFIRMED"].includes(res.data.qrCodeStatus)) {
        const {
          nickName,
          avatar,
          refreshToken,
        } = res.data.bizExt.pds_login_result;

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

export function sign() {
  const refreshToken = (userInfoDom as HTMLElement).innerText!;
  fetch(host + "/api/sign?refreshToken=" + refreshToken)
    .then((res) => res.json())
    .then((res) => {
      alert(res);
    });
}

setTimeout(getQrCode, 200);
