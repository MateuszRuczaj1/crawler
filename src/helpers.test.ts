import {expect, test} from 'vitest';
import { getH1FromHTML,getFirstParagraphFromHTML, getURLsFromHTML, getImagesFromHTML } from './helpers';   
test("getH1FromHTML basic", () => {
  const inputBody = `<html><body><h1>Test Title</h1></body></html>`;
  const actual = getH1FromHTML(inputBody);
  const expected = "Test Title";
  expect(actual).toEqual(expected);
});
test("return empty string if not h1", () => {
  const inputBody = `<html><body><h2>Example</h2></body></html>`;
  const actual = getH1FromHTML(inputBody)
  const expected = ""
  expect(actual).toEqual(expected)
})
test("getFirstParagraphFromHTML main priority", () => {
  const inputBody = `
    <html><body>
      <p>Outside paragraph.</p>
      <main>
        <p>Main paragraph.</p>
      </main>
    </body></html>
  `;
  const actual = getFirstParagraphFromHTML(inputBody);
  const expected = "Main paragraph.";
  expect(actual).toEqual(expected);
});
test("return empty string if not p1", () => {
  const inputBody = `<html><body><h2>Example</h2></body></html>`;
  const actual = getFirstParagraphFromHTML(inputBody)
  const expected = ""
  expect(actual).toEqual(expected)
})
test("return first p", () => {
  const inputBody = `<html><body><p>Example</p><p>Exmaple 2</p></body></html>`;
  const actual = getFirstParagraphFromHTML(inputBody)
  const expected = ""
  expect(actual).toEqual("Example")
})
test("getURLsFromHTML should return an absolute url", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <p>Paragraph</p>
     <a href="/slug/1">Hello</a>
   </body>
  </html>`
  const expected = ["https://google.com/slug/1"]
  const actual = getURLsFromHTML(inputBody,inputURL)
  expect(actual).toEqual(expected)
})
test("getURLsFromHTML should return all urls", () => {
    const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <p>Paragraph</p>
     <a href="/slug/1">Hello</a>
     <a href="/slug/2">Hello 2</a>
   </body>
  </html>`
  const expected = ["https://google.com/slug/1", "https://google.com/slug/2"]
  const actual = getURLsFromHTML(inputBody, inputURL)
  expect(actual).toEqual(expected)
})
test("getURLsFromHTML should ignore links without href", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <a href="/slug/1">Valid</a>
     <a>No href</a>
   </body>
  </html>`
  const expected = ["https://google.com/slug/1"]
  const actual = getURLsFromHTML(inputBody,inputURL)
  expect(actual).toEqual(expected)
  
})
test("getURLsFromHTML should keep absolute links unchanged", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <a href="https://google.com/slug/1">Valid</a>

   </body>
  </html>`
  const expected = ["https://google.com/slug/1"]
   const actual = getURLsFromHTML(inputBody,inputURL)
  expect(actual).toEqual(expected)
})
test("getImagesFromHTML should return all urls", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <p>Paragraph</p>
     <img src="/logo.png" />
     <img src="/logo2.png" />
   </body>
  </html>`
  const expected = ["https://google.com/logo.png", "https://google.com/logo2.png"]
  const actual = getImagesFromHTML(inputBody, inputURL)
  expect(actual).toEqual(expected)
})
test("getImagesFromHTML should return an absolute url", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <p>Paragraph</p>
     <img src="/slug/1">Hello</a>
   </body>
  </html>`
  const expected = ["https://google.com/slug/1"]
  const actual = getImagesFromHTML(inputBody,inputURL)
  expect(actual).toEqual(expected)
})
test("getImagesFromHTML should ignore links without href", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <img src="/slug/1">Valid</img>
     <img>No src</img>
   </body>
  </html>`
  const expected = ["https://google.com/slug/1"]
  const actual = getImagesFromHTML(inputBody,inputURL)
  expect(actual).toEqual(expected)
  
})
test("getImagesFromHTML should keep absolute links unchanged", () => {
  const inputURL = "https://google.com"
  const inputBody = `<html>
   <body>
     <img src="https://google.com/slug/1">Valid</img>

   </body>
  </html>`
  const expected = ["https://google.com/slug/1"]
   const actual = getImagesFromHTML(inputBody,inputURL)
  expect(actual).toEqual(expected)
})