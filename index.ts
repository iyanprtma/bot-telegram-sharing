import { Bot, webhookCallback } from "grammy";
import express from "express";
import { getFile, storeFile } from "./services";
import { botID, botToken } from "./config";
import sendMediaFunction from "./utils/sendMediaFunction";

const bot = new Bot(botToken);

bot.command("oke", async (ctx) => {
  try {
    if (ctx.match && ctx.match.length === 8) {
      const file = await getFile(ctx.match);
      if (!file) {
        await ctx.reply(
          "Code tidak tersedia, mungkin terjadi kesalahan."
        );
        return;
      }
      await ctx.reply("Getting your file, please wait a moment");
      await sendMediaFunction(ctx, file);
      return;
    }
    return ctx.reply(
      "Selamat Dibot Berbagi File. Upload file anda disini lalu bagikan ( foto, video, dokumen, dan musik )"
    );
  } catch (error) {
    console.error(error);
    await ctx.reply(" terjadi kesalahan, coba lagi");
  }
});

bot.on("message:text", async (ctx) => {
  await ctx.reply(
    "saya tidak mengerti apa printah anda, upload kembali file anda untuk berbagi"
  );
});

bot.on("message:file", async (ctx) => {
  try {
    const file = await ctx.getFile();
    const fileCode = await storeFile(file.file_id);
    return ctx.reply(
      `ini file anda dengan code: ${fileCode}. siip link sudah siap dibagikan, salin kode berikut <p> https://t.me/${botID}?start=${fileCode} </p>` 
    );
  } catch (error) {
    console.error(error);
    await ctx.reply("Something wrong! Please try again :(");
  }
});

if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.oke();
}

console.log("The bot is running 🚀️🚀️🚀️");
