// 源代码 ：https://github.com/mrabit/aliyundriveDailyCheck/blob/master/autoSignin.js
export class AliyundriveSign {
  updateAccesssTokenURL = "https://auth.aliyundrive.com/v2/account/token";
  signinURL =
    "https://member.aliyundrive.com/v1/activity/sign_in_list?_rx-s=mobile";
  rewardURL =
    "https://member.aliyundrive.com/v1/activity/sign_in_reward?_rx-s=mobile";

  authorization = {
    nick_name: "",
    refresh_token: "",
    access_token: "",
  };
  messages: string[] = [];

  // 使用 refresh_token 更新 access_token
  async updateAccesssToken(refreshToken: string) {
    return fetch(this.updateAccesssTokenURL, {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((d) => d.json())
      .then((d) => {
        const { code, message, nick_name, refresh_token, access_token } = d;
        if (
          code === "RefreshTokenExpired" ||
          code === "InvalidParameter.RefreshToken"
        ) {
          return Promise.reject(message);
        }
        this.authorization = {
          nick_name,
          refresh_token,
          access_token,
        };
      });
  }

  //签到
  async sign_in(access_token: string = "") {
    access_token = this.authorization.access_token || access_token;
    return fetch(this.signinURL, {
      method: "POST",
      body: JSON.stringify({
        isReward: false,
      }),
      headers: {
        authorization: access_token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (json) => {
        if (!json.success) {
          return Promise.reject(json.message);
        }
        const { signInLogs, signInCount } = json.result;
        const currentSignInfo = signInLogs[signInCount - 1]; // 当天签到信息

        this.messages.push(`本月累计签到 ${signInCount} 天`);

        // 未领取奖励列表
        const rewards = signInLogs.filter(
          (v: any) => v.status === "normal" && !v.isReward
        );

        if (rewards.length) {
          for await (let reward of rewards) {
            const signInDay = reward.day;
            try {
              const rewardInfo = await this.getReward(access_token, signInDay);
              this.messages.push(
                `第${signInDay}天奖励领取成功: 获得${rewardInfo.name || ""}${
                  rewardInfo.description || ""
                }`
              );
            } catch (e: any) {
              this.messages.push(`第${signInDay}天奖励领取失败:`, e);
            }
          }
        } else if (currentSignInfo.isReward) {
          this.messages.push(
            `今日签到获得${currentSignInfo.reward.name || ""}${
              currentSignInfo.reward.description || ""
            }`
          );
        }
      });
  }

  // 领取奖励
  async getReward(access_token: string, signInDay: number) {
    return fetch(this.rewardURL, {
      method: "POST",
      body: JSON.stringify({ signInDay }),
      headers: {
        authorization: access_token,
        "Content-Type": "application/json",
      },
    })
      .then((d) => d.json())
      .then((json) => {
        if (!json.success) {
          return Promise.reject(json.message);
        }
        return json.result;
      });
  }
}
