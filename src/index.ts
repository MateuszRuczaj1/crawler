import { getHTML, crawlPage } from "./crawl"
import { ConcurrentCrawler} from "./classes/ConcurrentCrawler"
import pLimit from "p-limit"

const argv = process.argv
const limit = pLimit(3)
const CLI_args = argv.slice(2)
async function crawlSiteAsync(baseURL: string, maxConcurrency: number, maxPages: number) {
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
      const pages = await crawlSiteAsync(CLI_args[0], Number(CLI_args[1]), Number(CLI_args[2]))
      const endedAt = Date.now()
      const durationSeconds = ((endedAt - startedAt) / 1000).toFixed(2)
      console.log("Crawler result:", pages)
      console.log(`Execution time: ${durationSeconds}s`)
     process.exit(0)
  }
}
main()
// console.log("Hello, World!")