import { getHTML, crawlPage } from "./crawl"
import { ConcurrentCrawler} from "./classes/ConcurrentCrawler"
import pLimit from "p-limit"
const limit = pLimit(3)
async function crawlSiteAsync(baseURL: string) {
const concurrentCrawler = new ConcurrentCrawler(baseURL, {}, limit)
  const pages = await concurrentCrawler.crawl()
  return pages
}
async function main(){
  const argv = process.argv
  const CLI_args = argv.slice(2)
  argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
  })
  if(CLI_args.length != 1){
    console.log("One runtime argument required")
    process.exit(1)
  }
  else{
     console.log("Crawler is starting with URL: ", CLI_args[0])
    //   const pages = await crawlPage(CLI_args[0])
      const startedAt = Date.now()
      const pages = await crawlSiteAsync(CLI_args[0])
      const endedAt = Date.now()
      const durationSeconds = ((endedAt - startedAt) / 1000).toFixed(2)
      console.log("Crawler result:", pages)
      console.log(`Execution time: ${durationSeconds}s`)
     process.exit(0)
  }
}
main()