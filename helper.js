function cleanCookieValue(value) {
  // Remove wrapping quotes if present (e.g. "\"something\"")
  if (
    typeof value === "string" &&
    value.length >= 2 &&
    value.startsWith('"') &&
    value.endsWith('"')
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function transformCookies(cookies) {
  console.log("Transforming cookies:");
  return cookies.map((cookie) => {
    // Map SameSite to Puppeteer expected values
    let sameSite;
    if (cookie.sameSite) {
      const s = cookie.sameSite.toLowerCase();
      if (s === "no_restriction") sameSite = "None";
      else if (s === "strict") sameSite = "Strict";
      else if (s === "lax") sameSite = "Lax";
      // if it's "unspecified" or null, we'll leave sameSite undefined (omit it)
    }

    // Build cookie object
    const cookieObj = {
      name: cookie.name,
      value: cleanCookieValue(cookie.value),
      domain: cookie.domain,
      path: cookie.path,
      secure: cookie.secure || false,
      httpOnly: cookie.httpOnly || false,
      ...(sameSite ? { sameSite: sameSite } : {}), // include sameSite only if defined
    };

    // Only add expires for persistent cookies (not session cookies)
    if (!cookie.session && cookie.expirationDate != null) {
      // Cookie Editor gives expirationDate in seconds since epoch (possibly as float)
      cookieObj.expires = Math.floor(cookie.expirationDate);
    }

    return cookieObj;
  });
}

async function setCookies(page, cookies) {
  if (!page) throw new Error("Page not initialized");

  try {
    await page.setCookie(...transformCookies(cookies));
  } catch (error) {
    throw new Error(`Invalid cookie format: ${error}`);
  }
}

module.exports = { cleanCookieValue, transformCookies, setCookies };