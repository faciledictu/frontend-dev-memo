---
sidebar_position: 4
---

# How Browser Works

When a user enters a domain name in the browser input, the following sequence of
events typically occurs.

## 1. DNS Lookup

The browser first checks its cache to see if it has the IP address for the
domain. If not, it sends a DNS (Domain Name System) server to resolve the domain
name (e.g., www.example.com) into an IP address, which identifies the server
hosting the website.

## 2. TCP/IP Connection

The browser establishes a TCP (Transmission Control Protocol) connection with
the server using the IP address. This involves a three-way handshake process to
ensure a reliable connection.

:::info

The browser can request a secure connection and the server can provide its
SSL/TLS certificate.

If the certificate is valid, the browser and server agree on encryption
algorithms and a TLS handshake occurs to establish a secure connection.

:::

## 3. HTTP/HTTPS Request

The browser sends an HTTP (Hypertext Transfer Protocol) or HTTPS (HTTP Secure)
request to the server. The request includes details such as the HTTP method,
headers, cookies, and other relevant information. If other data needes (such as
images, scripts etc.), the browser sends additional requests later.

### How Server Responses

#### Processing

The server processes the request, fetching the requested resource (e.g., an HTML
page, image, or data) from its storage.

### Response Sending

The server sends an HTTP response back to the browser. The response includes a
status code (e.g., 200 OK, 404 Not Found), headers, and the requested content
(e.g., HTML, CSS, JavaScript, images).

## 4. Rendering the Page

The browser receives the response and begins to render the page. This involves
several steps:

- **Parsing HTML.** The browser parses the HTML to construct the DOM (Document
  Object Model) tree.

- **Parsing CSS.** CSS files are fetched and parsed to construct the CSSOM (CSS
  Object Model) tree.

- **Combining DOM and CSSOM.** The DOM and CSSOM are combined to create the
  render tree, which represents the structure and styles of the page.

- **JavaScript Execution.** JavaScript files are fetched and executed.
  JavaScript can manipulate the DOM and CSSOM, dynamically updating the content
  and styles of the page.

- **Layout.** The browser calculates the layout of each element based on the
  render tree.

- **Painting.** The browser paints the pixels to the screen, rendering the final
  visual representation of the page.

## Additional Resources

If the HTML includes references to additional resources (e.g., images, videos,
fonts), the browser makes additional requests to fetch these resources and
incorporates them into the page.

## User Interaction

Once the page is rendered, the browser handles user interactions (e.g., clicks,
form submissions) and updates the page accordingly.

If JavaScript or other actions modify the layout or style, the browser may need
to reflow (recalculate layout) and repaint (update the display).
