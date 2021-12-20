---
published: true
layout: post
comments: true
date: "2021-12-21 00:00 +08:00"
type: post
title: "print react element"
categories:
  - frontend
tags:
  - react
---
To print react element, the "easier way" is using [react-to-print](https://github.com/gregnb/react-to-print), but if we want do it by ourself, how to?
The basic idea is same as react-to-print, use a invisaible iframe, write the html to the iframe, then call the `print` of the iframe window.

### Get the html of the element
Two options:
1: `const html = ReactDOMServer.renderToStaticMarkup(element);`, in most case, this should work and it is straightforward.

2: Sometimes ReactDOMServer have problem to render the element, we can use `ReactDOM.render()` to render the element into the iframe body. `react-to-print` did the same kind of trick. In this case, as the html is already rendered in the iframe.

### Print
```javascript
export const printHtml = html => {
  const oHideFrame = document.createElement("iframe");

  oHideFrame.style.position = "fixed";
  oHideFrame.style.right = "0";
  oHideFrame.style.bottom = "0";
  oHideFrame.style.width = "0";
  oHideFrame.style.height = "0";
  oHideFrame.style.border = "0";
  document.body.appendChild(oHideFrame);

  const pri = oHideFrame.contentWindow;
  pri.document.open();
  pri.document.write(`
  <html lang="en">
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" />
    </head>
    <body>${html}</body>
  </html>
`);
  pri.document.close();
  pri.focus();
  pri.print();
  document.body.removeChild(oHideFrame);
};
```
Above is the working code. Some thing I want to mention is that I see many other code using onLoad event of the iframe, but it is not reliable, especially when the iframe is `invisible`, that make the print content is blank ocasionally, so in my solution, it use synchronous method document.write and document.close, this will make sure the content have write to the iframe and safe to print.(But for images, it still a problem.) 