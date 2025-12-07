/**
 * Secret keywords for easter egg features
 * 
 * To add a new keyword:
 * 1. Add a new entry with the keyword as the key
 * 2. Add the content as a template string value
 * 3. The keyword will automatically work in search
 */

export const keywords: Record<string, string> = {
  holding: `<p>I ask you to hold me.<br/>
Please hold me.<br/>
You have no idea what you're holding.</p>

<p>I have no idea what you're holding.<br/>
(When we speak of our dreams<br/>
the beautiful thing is<br/>
neither of us have any idea<br/>
what we're talking about)</p>`
}

// Export keyword keys as an array for convenience
export const keywordKeys = Object.keys(keywords)

