import { Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import * as ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { Context } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';

const youtubeDl = require('youtube-dl-exec').create('/usr/local/bin/yt-dlp');

ffmpeg.setFfmpegPath(ffmpegPath!);

@Update()
export class TelegramMusic {
  constructor() {}

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.replyWithMarkdownV2(
      `🎵 *YouTube MP3 Bot Yordam* 🎵
      
1\\. *YouTube videosi havolasini yuboring*  
Masalan: \`https://www.youtube.com/watch?v=dQw4w9WgXcQ\`

2\\. Bot sizga *MP3 formatida musiqa*ni yuboradi\\.

❗ Eslatma:  
\\- Maksimal hajm: *50MB*  
\\- Faqat *audio fayl* yuboriladi  
\\- Yuklash *bir necha soniya* vaqt oladi  

\\/start — Botni qayta boshlash  
\\/help — Yordam oynasi  

🎧 Yaxshi tinglashlar\\!`
    );
  }

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('Salom! YouTube link yuboring, men uni mp3 ga aylantirib yuboraman 🎵');
  }

  @On('text')
  async handleYoutubeLink(@Ctx() ctx: Context & { message: { text: string } }) {
    const text = ctx.message.text;    
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/;

    if (!youtubeUrlRegex.test(text)) {
      await ctx.reply('Iltimos, toʻgʻri YouTube link yuboring!');
      return;
    }

    await ctx.reply('Musiqa yuklanmoqda...');

    try {
      const info = await youtubeDl(text, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        ffmpegLocation: ffmpegPath!,
      });

      let title = info.title || 'audio';
      title = title.replace(/[\\\/:*?"<>|]/g, '').trim();

      const outputFileName = `${title}.mp3`;
      const outputPath = path.resolve(__dirname, outputFileName);

      await youtubeDl(text, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: '128',
        output: outputPath,
        noCheckCertificates: true,
        ffmpegLocation: ffmpegPath!,
      });

      const stats = fs.statSync(outputPath);
      const fileSizeInMb = stats.size / (1024 * 1024);

      if (fileSizeInMb > 50) {
        await ctx.reply('Fayl hajmi 50MB dan oshib ketdi. Kichikroq video tanlang.');
      } else {
        await ctx.replyWithAudio({ source: outputPath });
      }

      fs.unlinkSync(outputPath);
    } catch (error: any) {
      console.error('Xatolik yuz berdi:', error);
      await ctx.reply(`❌ Xatolik: Yuklab boʻlmadi. Iltimos, boshqa link urinib koʻring.\n\nXato: ${error.message}`);
    }
  }
}
