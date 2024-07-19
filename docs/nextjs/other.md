---
sidebar_position: 7
---

# Other Hooks and Functions

## userAgent

The userAgent helper in Next.js provides a more convenient way to interact with
the user agent information. It extends the Web Request API to offer additional
properties and methods for handling the user agent data more effectively.

```jsx
import { NextRequest, NextResponse, userAgent } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { device } = userAgent(request);
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';
  url.searchParams.set('viewport', viewport);
  return NextResponse.rewrite(url);
}
```

### List of properties

- `isBot` A boolean indicating whether the request comes from a known bot.
- `browser`
  - `name`
  - `version`
- `device`
  - `type` string representing the type of the device,
  - `model`
  - `vendor`
- `engine`
  - `name`
  - `version`
- `os`
  - `name`
  - `version`
- `cpu`
  - `architecture`
