import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { keywords } from '../../data/keywords'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Extract text content from Vue component template
 * This extracts text from <template> sections, ignoring HTML tags and Vue directives
 */
function extractTextContent(vueContent: string): string {
  // Extract template section
  const templateMatch = vueContent.match(/<template>([\s\S]*?)<\/template>/)
  if (!templateMatch) {
    return ''
  }
  
  const templateContent = templateMatch[1]
  
  // Remove HTML tags, Vue directives, and comments
  let text = templateContent
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove Vue directives (v-if, v-for, @click, etc.)
    .replace(/\s+v-\w+[^>]*/g, '')
    .replace(/\s+@\w+[^>]*/g, '')
    .replace(/\s+:[^>]*/g, '')
    // Remove HTML tags but keep text content
    .replace(/<[^>]+>/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim()
  
  return text
}

describe('Secret Keywords', () => {
  it('should have at least one keyword defined', () => {
    const keywordNames = Object.keys(keywords)
    expect(keywordNames.length).toBeGreaterThan(0)
  })

  it('should not appear in any component content', () => {
    const keywordNames = Object.keys(keywords)
    
    expect(keywordNames.length).toBeGreaterThan(0)
    
    // Get all Vue component files
    const componentsDir = join(__dirname, '..')
    const componentFiles = readdirSync(componentsDir).filter(
      file => file.endsWith('.vue')
    )
    
    const violations: Array<{ file: string; keyword: string }> = []
    
    for (const file of componentFiles) {
      // Skip Search.vue and KeywordSections.vue since they use keywords
      if (file === 'Search.vue' || file === 'KeywordSections.vue') {
        continue
      }
      
      const filePath = join(componentsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      const textContent = extractTextContent(content)
      
      // Check each keyword
      for (const keyword of keywordNames) {
        // Check if keyword appears in the text content (case-insensitive)
        if (textContent.includes(keyword.toLowerCase())) {
          violations.push({ file, keyword })
        }
      }
    }
    
    if (violations.length > 0) {
      const violationMessages = violations.map(
        v => `  - "${v.keyword}" found in ${v.file}`
      ).join('\n')
      
      throw new Error(
        `Secret keywords found in component content:\n${violationMessages}\n\n` +
        `Secret keywords should not appear in any page content to maintain their secrecy.`
      )
    }
  })
})

