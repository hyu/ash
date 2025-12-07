/**
 * Secret keywords for easter egg features
 * 
 * To add a new keyword:
 * 1. Add a new entry with the keyword as the key
 * 2. Add the content as a template string value
 * 3. The keyword will automatically work in search
 */

export const keywords: Record<string, string> = {
  holding: `I ask you to hold me. 

Please hold me.

You have no idea what you're holding.

I have no idea what you're holding.

(When we speak of our dreams

the beautiful thing is

neither of us have any idea

what we're talking about)`
}

// Export keyword keys as an array for convenience
export const keywordKeys = Object.keys(keywords)

