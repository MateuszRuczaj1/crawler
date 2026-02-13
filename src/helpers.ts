import {JSDOM} from 'jsdom'
export function getH1FromHTML(html: string): string{
    const dom = new JSDOM(html)
    const h1 = dom.window.document.querySelector("h1")
    if(!h1) return ""
    return h1.textContent
}
export function getFirstParagraphFromHTML(html:string):string{
    const dom = new JSDOM(html)
    const main = dom.window.document.querySelector("main")
    let p1: string = ""
    if(main){
        p1 = main.querySelector("p")?.textContent!
        console.log(p1)
        return p1
    }
    else{
        p1 = dom.window.document.querySelector("p")?.textContent || ""
        return p1
    }

}
export function getURLsFromHTML(html:string, baseURL: string): string[] | undefined{
    const dom = new JSDOM(html)
    const urls = dom.window.document.querySelectorAll("a")
    if(!urls) return []
    const links: string[] = []
     urls.forEach((url) => {
        if(url.hasAttribute("href")){
            const href = url.getAttribute("href")
            if(href?.startsWith(baseURL)){
                links.push(href)
            }
            else{
                const absoluteUrl = `${baseURL}${href}`
                links.push(absoluteUrl)
            }
        }
    })
    return links
}