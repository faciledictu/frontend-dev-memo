---
sidebar_position: 4
---

# HTML Markup

## Basic Structure of an HTML Document

HTML, or Hypertext Markup Language, is the standard language used to create web
pages. An HTML document typically starts with a `<!DOCTYPE html>` declaration,
which defines the document type and version of HTML. This is followed by the
`<html>` tag, which encloses the entire document. Inside the`<html>`tag, there
are two main sections: the `<head>` and the `<body>`.

<!DOCTYPE html>: Declares the document type and version.
<html>: Root element of the HTML document.
<head>: Contains meta-information about the document, such as the title, character set, styles, and links to external resources.
<body>: Contains the content of the HTML document, including text, images, links, tables, forms, etc.
Here’s an example of a basic HTML document structure:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Sample Page</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML document.</p>
  </body>
</html>
```

To to display reserved characters or special symbols in an HTML document,
character entities are used. For example:

- `&lt;` represents <
- `&gt;` represents >
- `&amp;` represents &
- `&quot;` represents "
- `&apos;` represents '

## Text Formatting and Paragraphs

<p>: Defines a paragraph.
<br>: Inserts a line break.
<strong>: Makes text bold.
<em>: Emphasizes text (usually italic).
<u>: Underlines text.
<h1> to <h6>: Define headings from level 1 to 6.
<span>: Used for inline formatting without adding any block-level semantics.
Example:

```html
<p>
  This is a <strong>bold</strong> paragraph with an <em>emphasized</em> word.
</p>
```

### HTML Links

Links are created using the <a> tag.

- `href` attribute specifies the URL of the linked page.

- `target` attribute specifies where to open the linked document.
  - `_self` Default. Opens in the same window/tab.
  - `_blank` Opens in a new window/tab.
  - `_parent` Opens in the parent frame.
  - `_top` Opens in the full body of the window.

```html
<a href="https://www.example.com" target="_blank">Visit Example</a>
```

### HTML Tables

Tables are used to display tabular data. Key elements include:

`<table>` Defines the table. `<tr>` Defines a table row. `<td>` Defines a table
cell. `<th>` Defines a table header cell.

```html
<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>Data 1</td>
    <td>Data 2</td>
  </tr>
</table>
```

### Types of Inputs

HTML forms can contain various input types, each suited for different kinds of
data entry:

-`<input type="text">` Single-line text input. -`<input type="password">`
Password input. -`<input type="email">` Email input. -`<input type="number">`
Numeric input. -`<input type="date">` Date input. -`<input type="radio">` Radio
button. -`<input type="checkbox">` Checkbox. -`<input type="file">` File upload.

````html
<form>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" />
  <input type="submit" value="Submit" />
</form>

### Types of Buttons Buttons are used to trigger actions, typically within
forms: -`<input type="submit" />` A submit button that sends form data to a
server. -`<input type="reset" />` A reset button that resets form fields to
their default values. -`<button type="button">
  ` A button that can be programmed with JavaScript to perform custom actions.
  ```html
  <button type="button" onclick="alert('Button clicked!')">Click Me</button>
</button>
````

### Working with Forms

Forms are used to collect user input and submit it to a server.

- `action` attribute specifies where to send the form data.
- `method` attribute specifies the HTTP method (GET or POST) to use when sending
  form data.

```html
<form action="/submit" method="post">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" />
  <button type="submit">Submit</button>
</form>
```

### Adding Scripts

Scripts, typically JavaScript, can be added to HTML documents to enhance
interactivity and functionality.

`src` attribute can be used to include an external script file.

```html
<script>
  function showAlert() {
    alert('Hello, World!');
  }
</script>
<button type="button" onclick="showAlert()">Show Alert</button>
```

### Media Elements

Media elements in HTML include `images`, `audio`, and `video`, which are used to
embed media content into web pages.

```html
<img src="image.jpg" alt="Sample Image" />
<audio controls>
  <source src="audio.mp3" type="audio/mpeg" />
  Your browser does not support the audio element.
</audio>
<video controls>
  <source src="video.mp4" type="video/mp4" />
  Your browser does not support the video element.
</video>
```
