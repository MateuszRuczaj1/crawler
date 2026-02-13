import { getURLsFromHTML } from "./helpers"

export function normalizeURL(url: string): string {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname.endsWith("/") ? parsedUrl.pathname.slice(0, -1) : parsedUrl.pathname;
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
   console.log(HTML)
   } catch (error) {
      console.error(error)
   }
}
