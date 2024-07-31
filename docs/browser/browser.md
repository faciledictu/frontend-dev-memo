---
sidebar_position: 4
---

# How Browser Works

When a user enters a domain name in the browser input, the following sequence of
events typically occurs.

## 1. DNS Resolution

The browser first checks its cache to see if it has the IP address for the
domain. If not, it sends a DNS query to a DNS server to resolve the domain name
to an IP address.

## 2. TCP Connection

Once the IP address is obtained, the browser initiates a TCP connection with the
server at that IP address on the specified port (usually port 80 for HTTP or
port 443 for HTTPS).

:::info TLS Handshake

The browser can request a secure connection and the server can provide its
SSL/TLS certificate.

If the certificate is valid, the browser and server agree on encryption
algorithms and establish a secure encrypted connection.

For secure connections, a TLS handshake occurs to establish a secure connection.
This involves verifying the server's certificate and establishing an encrypted
communication channel.

:::

## 3. HTTP or HTTPS Request

The browser sends an HTTP request to the server, typically a GET request, asking
for the content of the page.

## 5. Server Response

The server processes the request and sends back an HTTP response (or encrypned
HTTPS response), which includes the requested resources (HTML, CSS, JavaScript,
images, etc.) and status information.

## 6. Rendering

The browser parses the HTML content, constructs the DOM (Document Object Model),
and then fetches and processes any linked resources (like CSS, JavaScript,
images).

## 7. Rendering Engine

The rendering engine applies CSS to the DOM, runs JavaScript, and constructs the
render tree.

## 8. Layout and Painting

The render tree is used to perform layout calculations, determining the exact
position and size of each element on the page. The browser then paints the
content to the screen.

## 9. User Interaction

The browser continues to interact with the user, responding to events like
clicks, scrolls, and input.

If JavaScript or other actions modify the layout or style, the browser may need
to reflow (recalculate layout) and repaint (update the display).
