export class Page {
  private readonly name: string;
  private readonly paths: string[];

  constructor(name: string, paths: string[]) {
    this.name = name;
    this.paths = paths;
  }

  get pageName(): string {
    return this.name;
  }

  get lastPath(): string {
    return this.paths[this.paths.length - 1];
  }

  get pathsArray(): string[] {
    return this.paths;
  }

  public compiledPaths(): string {
    return this.paths.reduce((result: string, currentValue: string): string => result + "/" + currentValue);
  }
}
