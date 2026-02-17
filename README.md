# Crawler

Simple web crawler written in TypeScript.

The application:
- starts from the provided URL,
- crawls pages concurrently (with a concurrency limit),
- extracts data from each page (`h1`, first paragraph, outgoing links, images),
- saves results to a CSV file (`report.csv`).

## Requirements

- Node.js 18+ (20+ recommended)
- npm

## Installation

```bash
npm install
```

## Run

```bash
npm run start <baseURL> [maxConcurrency maxPages]
```

### Arguments

- `baseURL` *(required)* — start URL, e.g. `https://crawler-test.com`
- `maxConcurrency` *(optional)* — number of parallel requests
- `maxPages` *(optional)* — maximum number of pages to crawl

If you provide only `baseURL`, default values are:
- `maxConcurrency = 3`
- `maxPages = 25`

### Examples

```bash
npm run start https://crawler-test.com
npm run start https://crawler-test.com 3 25
```

## Output

After crawling is finished, the following file is created:
- `report.csv` (in the project root)

CSV columns:
- `page_url`
- `h1`
- `first_paragraph`
- `outgoing_link_urls` (multiple values separated with `|`)
- `image_urls` (multiple values separated with `|`)

## Tests

```bash
npm run test
```

## Project structure

```text
src/
  index.ts                    # CLI entry point
  classes/ConcurrentCrawler.ts# concurrent crawler
  crawl.ts                    # URL normalization + crawl/fetch helpers
  extractPage.ts              # page data model and extraction
  helpers.ts                  # HTML parsers (JSDOM)
  report.ts                   # CSV export
```

## Notes

- The crawler only processes URLs from the same host as `baseURL`.
- Some test pages may return HTTP errors — such URLs are logged and skipped.
