const { default: axios } = require("axios");
const config = require("./config/config");
const { Client, Intents } = require("discord.js");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const TOKEN =
  "MTEwMTQ3ODQ1ODY5MDg5OTk5OQ.GrL1Zg.HlF0pSoZIzZKb8-IOiRLMoAOwqzlhjydUFWAwA";
// const CHANNEL_ID = "1101592182483341322";

const apiKey = "Y0mMQYyoTUW10x3OJIZl0Q";
const apiSecret = "dsBAaS7KChHORm9zdgfR3GDJ39TOCfuEAZ99";

client.on("ready", () => {
  console.log("Bot is ready.");
});

client.on("message", async (message) => {
  if (message.content.startsWith("/online")) {
    const regex = /^\/online\/(\d{2}-\d{2}-\d{4})\/(\d{1,2}):(\d{2})(AM|PM)$/i;

    const args = message.content.split("/");
    const [date, time] = args.slice(2);
    const dateTime = moment(`${date} ${time}`, "DD-MM-YYYY hh:mmA");
    if (!dateTime.isValid()) {
      message.reply(
        "Invalid date/time format. Please use DD-MM-YYYY/h:mmA format."
      );
      return;
    }
    const startTime = moment.utc(dateTime).format("YYYY-MM-DDTHH:mm:ss") + "Z";

    try {
      const response = await axios.post(
        "https://api.zoom.us/v2/users/me/meetings",
        {
          topic: "Discord Meeting",
          type: 2,
          start_time: startTime,
          duration: 60,
          timezone: "UTC",
          settings: {
            join_before_host: true,
            mute_upon_entry: true,
            approval_type: 2,
            auto_recording: "none",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${await getZoomAccessToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const joinUrl = response.data.join_url;
      return message.reply(
        `Your Zoom meeting has been scheduled. Join URL: ${joinUrl}`
      );
    } catch (err) {
      console.log("err: ", err);
      return message.reply(
        "Failed to create Zoom meeting. Please try again later."
      );
    }
  }
  if (message.content.startsWith("/offline")) {
    const args = message.content.split("/");
    const [date, time, address] = args.slice(2);

    message.reply(
      `We Will meet you at:${address} on date:${date} at time:${time} `
    );
  }
});

async function getZoomAccessToken() {
  const payload = {
    iss: apiKey,
    exp: Date.now() + 60 * 60 * 1000, // Token expires in 1 hour
  };
  const token = jwt.sign(payload, apiSecret);

  return token;
}

client.login(TOKEN);
