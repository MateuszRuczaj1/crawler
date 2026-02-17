import {getFirstParagraphFromHTML, getH1FromHTML, getImagesFromHTML, getURLsFromHTML} from "./helpers"
export interface ExtractedPageData {
    url: string,
    h1: string,
    first_paragraph: string,
    outgoing_links: string[] | undefined,
    image_urls: string[]
}
export default function extractPageData(html: string, pageUrl:string): ExtractedPageData{
   const pageObj: ExtractedPageData = {
    url: pageUrl,
    h1: getH1FromHTML(html),
    first_paragraph: getFirstParagraphFromHTML(html),
    outgoing_links: getURLsFromHTML(html, pageUrl),
    image_urls: getImagesFromHTML(html, pageUrl)

   }
   return pageObj
}