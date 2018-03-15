export default class ConsoleSignature {
  constructor(message, url, color = '#47c') {
    this.message = message;
    this.url = url;
    this.color = color;
    this.show();
  }
  show() {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      const args = [
        `\n%c ${this.message} %c%c ${this.url} \n\n`,
        `color: #fff; background: #222; padding:3px 0;`,
        `padding:3px 1px;`,
        `color: #fff; background: ${this.color}; padding:3px 0;`,
      ];
      console.log.apply(console, args);
    } else if (window.console) {
      console.log(`${this.message} ${this.url}`);
    }
  }
}
