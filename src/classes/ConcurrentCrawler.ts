import { normalizeURL } from "../crawl";
import { getURLsFromHTML } from "../helpers";
import type { ExtractedPageData } from "../extractPage";
import extractPageData from "../extractPage";
export class ConcurrentCrawler{
    baseURL: string;
    pages: Record<string, ExtractedPageData>;
    maxPages: number;
    shouldStop: boolean;
    allTasks: Set<Promise<void>>
   limit: <T>(fn: () => Promise<T>) => Promise<T>
    seenUrls: Set<string>
    reservedPages: number
   constructor(baseUrl: string, pages: Record<string, ExtractedPageData>, maxPages: number, shouldStop: boolean, allTasks: Set<Promise<void>>, limit: <T>(fn: () => Promise<T>) => Promise<T>){
        this.baseURL = baseUrl
        this.pages = pages
        this.maxPages = maxPages
        this.allTasks = allTasks
        this.limit = limit
        this.shouldStop = shouldStop
            this.seenUrls = new Set(Object.keys(pages))
            this.reservedPages = Object.keys(pages).length
    }

    private addPageVisit(normalizedURL: string): boolean{
        if(this.shouldStop){
            return false
        }
         if(this.seenUrls.has(normalizedURL)){
         return false
      }
            if(this.reservedPages >= this.maxPages){
            this.shouldStop = true
            console.log("Reached maximum number of pages to crawl")
            // this.abortController.abort()
            return false

        }
          this.seenUrls.add(normalizedURL)
          this.reservedPages += 1
          if(this.reservedPages >= this.maxPages){
             this.shouldStop = true
             console.log("Reached maximum number of pages to crawl")
          }
       return true
    }

      private releasePageVisit(normalizedURL: string){
         if(this.pages[normalizedURL]) return
         if(!this.seenUrls.has(normalizedURL)) return
         this.seenUrls.delete(normalizedURL)
         if(this.reservedPages > 0){
            this.reservedPages -= 1
         }
         if(this.reservedPages < this.maxPages){
            this.shouldStop = false
         }
      }
    private async getHTML(currentURL: string): Promise<string>{
       return await this.limit(async () => {
          let finalUrl = currentURL
          if(!currentURL.startsWith("https://") && !currentURL.startsWith("http://")){
             finalUrl = `https://${currentURL}`
          }
          console.log(`[crawler] fetching: ${finalUrl}`)
          const response = await fetch(finalUrl, {
            headers: {
              "User-Agent": "Spider-Man"
            }
          })
          console.log(`[crawler] response: ${response.status} ${response.statusText} (${finalUrl})`)

          if(response.status >= 400){
            throw new Error("Error getting page content")
          }
          if(!response.headers.get('content-type')?.includes("text/html")){
            throw new Error("Wrong content type! Unable to crawl")
          }

          const html = await response.text()
          return html
       })
    }
    private async crawlPage(baseURL: string, currentURL: string = baseURL, pages: Record<string, ExtractedPageData>  = {}){
       if(this.shouldStop) return pages
       if(!URL.canParse(currentURL)) return pages
          const baseHost = new URL(baseURL).hostname
          const curretHost = new URL(currentURL).hostname
          if(baseHost !== curretHost) return pages
          console.log(`[crawler] visiting: ${currentURL}`)
          const normalizedCurrentUrl = normalizeURL(currentURL)
          const canVisit = this.addPageVisit(normalizedCurrentUrl)
          if(!canVisit) return pages
          
               let inputBody = ""
               try {
                  inputBody = await this.getHTML(currentURL)
               } catch (error) {
                  this.releasePageVisit(normalizedCurrentUrl)
                  console.error(`[crawler] skip ${currentURL}:`, error)
                  return pages
               }
               const urls: string[] = []
               const data = extractPageData(inputBody, currentURL)
               pages[normalizedCurrentUrl] = data
               for(const nextURL of data?.outgoing_links ?? []){
                  urls.push(nextURL)
               }
               //  console.log(`[crawler] found ${urls.length} links on: ${currentURL}`)
               const tasks: Promise<void>[] = urls.map((url) => {
                  const task = this.crawlPage(baseURL, url, pages).then(() => undefined)
                  this.allTasks.add(task)
                  return task.finally(() => {
                     this.allTasks.delete(task)
                  })
               })
               
               await Promise.allSettled(tasks)
       return pages
    }
      public async crawl(): Promise<Record<string, ExtractedPageData> | void>{
         const pages = await this.crawlPage(this.baseURL, this.baseURL, this.pages)
         return pages
    }
}