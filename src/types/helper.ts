declare module 'youtube-dl-wrap' {
  interface YoutubeDlWrapOptions {
  }

  class YoutubeDlWrap {
    constructor(options?: YoutubeDlWrapOptions);
    exec(args: string[]): import('child_process').ChildProcess;
    downloadYtDlp(): Promise<void>;
  }

  export default YoutubeDlWrap;
}
