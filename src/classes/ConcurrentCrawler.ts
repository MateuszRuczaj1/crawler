class ConcurrentCrawler{
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
}