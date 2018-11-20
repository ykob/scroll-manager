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
        `%c ${this.message} %c ${this.url}`,
        `color: #fff; background: ${this.color}; padding:3px 0;`,
        `padding:3px 1px;`,
      ];
      console.log.apply(console, args);
    } else if (window.console) {
      console.log(`${this.message} ${this.url}`);
    }
  }
}
