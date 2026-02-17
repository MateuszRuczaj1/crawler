import * as fs from "node:fs"
import * as path from "node:path"
import type { ExtractedPageData } from "./extractPage"
function csvEscape(field: string) {
  const str = field ?? "";
  const needsQuoting = /[",\n]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}
export function createCsvReport(pageData: Record<string,ExtractedPageData>, filename:string="report.csv"){
    const file = path.resolve(process.cwd(), filename)
    const headers = ["page_url", "h1", "first_paragraph", "outgoing_link_urls", "image_urls"]
    const rows: string[] = [headers.join(",")]
    for(const page of Object.values(pageData)){
        const row = [
      csvEscape(page.url),
      csvEscape(page.h1),
      csvEscape(page.first_paragraph),
      csvEscape(page.outgoing_links?.join("|") ?? ""),
      csvEscape(page.image_urls.join("|"))

        ]
        rows.push(row.join(','))
    }
    const result = rows.join("\n")
    fs.writeFileSync(file, result)
}