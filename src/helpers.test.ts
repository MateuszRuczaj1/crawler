import {expect, test} from 'vitest';
import { getH1FromHTML,getFirstParagraphFromHTML } from './helpers';   
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