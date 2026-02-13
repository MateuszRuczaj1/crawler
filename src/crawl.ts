
export function normalizeURL(url: string): string{
   
     if(URL.canParse(url)){
        const parsedUrl = new URL(url)
        let normalizedPathname
        if(parsedUrl.pathname.endsWith("/")){
            normalizedPathname = parsedUrl.pathname.slice(0,-1)
        }
        const normalizedString = `${parsedUrl.hostname}${normalizedPathname}`
        return normalizedString
     }
     else {
        throw Error("Cannot parse that url - not valid")
     }
     
   }
   
export async function getHTML(url: string) {
   try {
      const response = await fetch(url,{
      headers:{
         "User-Agent": "Spider-Man"
      }
   })
   
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
