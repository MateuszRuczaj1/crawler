import {expect, test} from 'vitest';
import {normalizeURL} from './crawl';    
test("normalizeUrl function return string", () => {
    expect(typeof(normalizeURL("http://google"))).toBe("string")
})
test("normalizeUrl function return false if provided string is not an actual url", () =>{
    expect(() => normalizeURL("string")).toThrowError()
})
test("normalizeUrl function should not return url with protocol", () => {
    expect(normalizeURL("https://google.com")).toBe("google.com")
})
test("normalizeUrl function should not return end '/' ", () => {
    expect(normalizeURL("https://google.com/")).toBe('google.com')
})
