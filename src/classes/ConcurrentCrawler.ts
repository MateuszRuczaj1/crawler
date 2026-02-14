import { normalizeURL } from "../crawl";
import { getURLsFromHTML } from "../helpers";

export class ConcurrentCrawler{
    baseURL: string;
    pages: Record<string, number>;
   limit: <T>(fn: () => Promise<T>) => Promise<T>
   constructor(baseUrl: string, pages: Record<string, number>, limit: <T>(fn: () => Promise<T>) => Promise<T>){
        this.baseURL = baseUrl
        this.pages = pages
        this.limit = limit
    }

    private addPageVisit(normalizedURL: string): boolean{
        if(this.pages[normalizedURL]){
         this.pages[normalizedURL]+=1
         return true
      }
      else{
         this.pages[normalizedURL] = 1
         return false
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
    private async  crawlPage(baseURL: string, currentURL: string = baseURL, pages: Record<string, number> = {}){
       if(!URL.canParse(currentURL)) return pages
          const baseHost = new URL(baseURL).hostname
          const curretHost = new URL(currentURL).hostname
          if(baseHost !== curretHost) return pages
          console.log(`[crawler] visiting: ${currentURL}`)
          const normalizedCurrentUrl = normalizeURL(currentURL)
          const seenBefore = this.addPageVisit(normalizedCurrentUrl)
          if(seenBefore) return pages
          
               let inputBody = ""
               try {
                  inputBody = await this.getHTML(currentURL)
               } catch (error) {
                  console.error(`[crawler] skip ${currentURL}:`, error)
                  return pages
               }
               const urls: string[] = getURLsFromHTML(inputBody, baseURL) ?? [];
                console.log(`[crawler] found ${urls.length} links on: ${currentURL}`)
               const tasks = urls.map((url) => this.crawlPage(baseURL, url, pages))
               await Promise.allSettled(tasks)
       return pages
    }
      public async crawl(): Promise<Record<string, number>>{
         const pages = await this.crawlPage(this.baseURL, this.baseURL, this.pages)
            return pages
    }
}