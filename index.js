const { default: axios } = require("axios");
// const config = require("./config/config");
const { Client, Intents } = require("discord.js");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});
const TOKEN =
  "MTEwMzcxNTE3NjA3MjYxMzk0OQ.GACEkc.sMRrYGy5xBJAZg3eYupJh4ZB9kwxYKYtAjY2hI";
// "MTEwMTQ3ODQ1ODY5MDg5OTk5OQ.GrL1Zg.HlF0pSoZIzZKb8-IOiRLMoAOwqzlhjydUFWAwA";
// const CHANNEL_ID = "1101592182483341322";

const apiKey = "Y0mMQYyoTUW10x3OJIZl0Q";
const apiSecret = "dsBAaS7KChHORm9zdgfR3GDJ39TOCfuEAZ99";

client.on("ready", () => {
  console.log("Bot is ready.");
});

client.on("message", async (msg) => {
  try {
    const prefix = "/online";
    // console.log(msg);
    // console.log(msg.content.startsWith(prefix));
    if (msg.content.startsWith("/online")) {
      console.log("under");
      const regex =
        /^\/online\/(\d{2}-\d{2}-\d{4})\/(\d{1,2}):(\d{2})(AM|PM)$/i;

      const args = msg.content.split("/");
      const [date, time] = args.slice(2);
      const dateTime = moment(`${date} ${time}`, "DD-MM-YYYY hh:mmA")
        .utc()
        .format();

        console.log(dateTime);

      if (!regex.test(msg.content)) {
        return msg.reply(
          "Please enter the date and time in the format: DD-MM-YYYY hh:mmAM/PM"
        );
      }

      if (!moment(dateTime).isValid()) {
        return msg.reply("Please enter a valid date and time.");
      }

      if (moment(dateTime).isBefore(moment().utc())) {
        return msg.reply("Please enter a date and time in the future.");
      }

      console.log(dateTime);
      const startTime =
        moment.utc(dateTime).format("YYYY-MM-DDTHH:mm:ss") + "Z";
      console.log(startTime);
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
              join_before_host: false,
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
        return msg.reply(
          `Your Zoom meeting has been scheduled. Join URL: ${joinUrl}`
        );
      } catch (err) {
        console.log("err: ", err);
        return msg.reply(
          "Failed to create Zoom meeting. Please try again later."
        );
      }
    }
    if (msg.content.startsWith("/offline")) {
      const args = msg.content.split("/");
      const [date, time, address] = args.slice(2);
      if (!date && !time && !address)
      {
        msg.reply("Please enter the date,time and address");

      }
      else{
        msg.reply(
          `We Will meet you at:${address} on date:${date} at time:${time} `
        );
      }
    }
  } catch (error) {
    console.log(error);
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
