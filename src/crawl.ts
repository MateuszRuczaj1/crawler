
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
   

