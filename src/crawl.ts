import { getURLsFromHTML } from "./helpers"

export function normalizeURL(url: string): string  {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname.endsWith("/") ? parsedUrl.pathname.slice(0, -1) : parsedUrl.pathname;
  if (!/^[a-zA-Z0-9.-]+$/.test(parsedUrl.hostname)) {
throw new Error(`Invalid hostname: ${parsedUrl.hostname}`);
}
  return `${parsedUrl.hostname}${pathname}`;
}  
export async function getHTML(url: string) {
   try {
       let finalUrl = url
      if(!url.startsWith("https://") && !url.startsWith("http://")){
         finalUrl = `https://${url}`
      }
      console.log(`[crawler] fetching: ${finalUrl}`)
      const response = await fetch(finalUrl,{
      headers:{
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
   const HTML = await response.text()
   return HTML
   } catch (error) {
      console.error(error)
   }
}

export async function crawlPage(baseURL: string, currentURL: string = baseURL, pages: Record<string, number> = {}){
   if(!URL.canParse(currentURL)) return pages
      const baseHost = new URL(baseURL).hostname
      const curretHost = new URL(currentURL).hostname
      if(baseHost !== curretHost) return pages
      console.log(`[crawler] visiting: ${currentURL}`)
      const normalizedCurrentUrl = normalizeURL(currentURL)
      if(pages[normalizedCurrentUrl]){
         pages[normalizedCurrentUrl]+=1
         return pages
      }
      else{
         pages[normalizedCurrentUrl] = 1
      }
      
      const inputBody = await getHTML(currentURL)
      const urls: string[] = getURLsFromHTML(inputBody!, baseURL) ?? [];
      console.log(`[crawler] found ${urls.length} links on: ${currentURL}`)
      for (const url of urls) {
      console.log(`[crawler] queue -> ${url}`)
      await crawlPage(baseURL, url, pages);
     
      }
   return pages
}