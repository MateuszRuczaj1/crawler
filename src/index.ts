import { getHTML, crawlPage } from "./crawl"
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
      const pages = await crawlPage(CLI_args[0])
      console.log("Crawler result:", pages)
     process.exit(0)
  }
}
main()