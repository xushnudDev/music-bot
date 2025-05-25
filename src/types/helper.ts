declare module 'youtube-dl-wrap' {
  interface YoutubeDlWrapOptions {
    // Bu yerga kerak bo'lsa opsiyalar qo'shishingiz mumkin
  }

  class YoutubeDlWrap {
    constructor(options?: YoutubeDlWrapOptions);
    exec(args: string[]): import('child_process').ChildProcess;
    downloadYtDlp(): Promise<void>;
  }

  export default YoutubeDlWrap;
}
