import {test, expect} from 'vitest'
import extractPageData from './extractPage'

test("extractPageData should return page details", () => {
  const inputURL = "https://google.com";
  const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

  const actual = extractPageData(inputBody, inputURL);
  const expected = {
    url: "https://google.com",
    h1: "Test Title",
    first_paragraph: "This is the first paragraph.",
    outgoing_links: ["https://google.com/link1"],
    image_urls: ["https://google.com/image1.jpg"],
  };

  expect(actual).toEqual(expected);
})