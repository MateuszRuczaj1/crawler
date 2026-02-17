import { getHTML, crawlPage } from "./crawl"
import { ConcurrentCrawler} from "./classes/ConcurrentCrawler"
import pLimit from "p-limit"
import { createCsvReport } from "./report"
const argv = process.argv
const CLI_args = argv.slice(2)
async function crawlSiteAsync(baseURL: string, maxConcurrency: number, maxPages: number) {
const limit = pLimit(maxConcurrency)
const concurrentCrawler = new ConcurrentCrawler(baseURL, {},maxPages,false, new Set(), limit)
  const pages = await concurrentCrawler.crawl()
  return pages
}
async function main(){
  
  
 
  argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
  })
  if(CLI_args.length !== 1 && CLI_args.length !== 3){
    console.log("One or three runtime argument required")
    process.exit(1)
  }
  else{
     console.log("Crawler is starting with URL: ", CLI_args[0])
    //   const pages = await crawlPage(CLI_args[0])
      const startedAt = Date.now()
      const maxConcurrency = Number(CLI_args[1] ?? 3)
      const maxPages = Number(CLI_args[2] ?? 25)
      const pages = await crawlSiteAsync(CLI_args[0], maxConcurrency, maxPages)
      const endedAt = Date.now()
      const durationSeconds = ((endedAt - startedAt) / 1000).toFixed(2)
      // console.log("Crawler result:", pages)
      // console.log("Finished crawling.");

      if (pages) {
      const firstPage = Object.values(pages)[0];
      createCsvReport(pages)
      if (firstPage) {
      console.log(`First page record: ${firstPage["url"]} - ${firstPage["h1"]}`);
      }
}
      console.log(`Execution time: ${durationSeconds}s`)
     process.exit(0)
  }
}
main()
// console.log("Hello, World!")