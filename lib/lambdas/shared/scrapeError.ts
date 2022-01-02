export class ScrapeError extends Error {
  readonly scrapingTargetName: string;
  constructor(scrapingTargetName: string, selector?: string) {
    super(`failed to scrape: ${scrapingTargetName}, selector: ${selector ?? ""}`);
    this.name = new.target.name;
    this.scrapingTargetName = scrapingTargetName;
    Object.setPrototypeOf(this, ScrapeError.prototype);
  }

  getScrapingTargetName(): string {
    return this.scrapingTargetName;
  }
}
