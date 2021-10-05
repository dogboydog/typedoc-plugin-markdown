export class MarkdownBuilder {
  lines: string[];

  constructor() {
    this.lines = [];
  }

  add(content: string) {
    this.lines.push(content);
  }

  print(joinChars = '\n\n') {
    return this.lines.filter((item) => item).join(joinChars);
  }
}
