import Cite from 'citation-js'

/**
 * Supported citation formats with their CSL template names
 * Note: citation-js has limited built-in styles, so we use custom formatting for some
 */
export const SUPPORTED_FORMATS = {
  'APA': 'apa',
  'MLA': 'mla',
  'Chicago': 'chicago',
  'Harvard': 'harvard'
}

/**
 * Maps internal data structure (from Gemini/CrossRef) to CSL-JSON format
 * This is the core task for Phase 1 - correctly parsing author names in "姓, 名" format
 * @param {Object} data - Internal reference data
 * @returns {Object} CSL-JSON formatted object
 */
export function mapToCSL(data) {
  const cslData = {
    id: data.doi || data.id || generateId(),
    type: mapType(data.type),
    title: data.title,
    author: parseAuthors(data.authors || data.author),
    issued: parseDate(data.year || data.publishedDate),
    'container-title': data.journal || data.publisher,
    publisher: data.publisher,
    volume: data.volume,
    issue: data.issue,
    page: data.pages || data.page,
    DOI: data.doi,
    URL: data.url,
    source: data.source
  }

  // Remove undefined/null values
  Object.keys(cslData).forEach(key => {
    if (cslData[key] === undefined || cslData[key] === null) {
      delete cslData[key]
    }
  })

  return cslData
}

/**
 * Format CSL-JSON data with specified citation style
 * @param {Object} cslData - CSL-JSON formatted data
 * @param {string} style - Citation style (e.g., 'apa', 'mla', 'chicago', 'harvard')
 * @returns {string} Formatted citation
 */
export function formatCitation(cslData, style = 'apa') {
  try {
    // Normalize style name
    const normalizedStyle = style.toLowerCase()
    
    // Use custom formatters for different styles since citation-js has limited built-in support
    switch (normalizedStyle) {
      case 'apa':
        return formatAPA(cslData)
      case 'mla':
        return formatMLA(cslData)
      case 'chicago':
        return formatChicago(cslData)
      case 'harvard':
        return formatHarvard(cslData)
      default:
        // Try citation-js as fallback
        const cite = new Cite(cslData)
        const formatted = cite.format('bibliography', {
          format: 'text',
          template: 'apa',
          lang: 'en-US'
        })
        return formatted.trim()
    }
  } catch (error) {
    console.error(`Error formatting citation with style ${style}:`, error)
    // Fallback to basic formatting if citation-js fails
    return fallbackApaFormat(cslData)
  }
}

// Helper function to format APA using citation-js
function formatAPA(cslData) {
  const cite = new Cite(cslData)
  return cite.format('bibliography', {
    format: 'text',
    template: 'apa',
    lang: 'en-US'
  }).trim()
}

// Custom MLA formatter
function formatMLA(cslData) {
  const authors = formatAuthorListMLA(cslData.author)
  const title = cslData.title ? `"${cslData.title}."` : ''
  const container = cslData['container-title'] || ''
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || ''
  
  if (cslData.type === 'article-journal' && container) {
    const volume = cslData.volume || ''
    const issue = cslData.issue ? `.${cslData.issue}` : ''
    const pages = cslData.page ? `: ${cslData.page}` : ''
    return `${authors} ${title} ${container}, vol. ${volume}${issue}, ${year}${pages}.`.replace(/\s+/g, ' ').trim()
  }
  
  // Book format
  if (cslData.publisher) {
    return `${authors} ${title} ${cslData.publisher}, ${year}.`.replace(/\s+/g, ' ').trim()
  }
  
  // Default
  return `${authors} ${title} ${year}.`.replace(/\s+/g, ' ').trim()
}

// Custom Chicago formatter (Author-Date)
function formatChicago(cslData) {
  const authors = formatAuthorList(cslData.author)
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'n.d.'
  const title = cslData.title || 'Untitled'
  
  if (cslData['container-title']) {
    let citation = `${authors} ${year}. "${title}." ${cslData['container-title']}`
    if (cslData.volume) {
      citation += ` ${cslData.volume}`
      if (cslData.issue) {
        citation += ` (${cslData.issue})`
      }
    }
    if (cslData.page) {
      citation += `: ${cslData.page}`
    }
    return citation + '.'
  }
  
  // Book
  if (cslData.publisher) {
    return `${authors} ${year}. ${title}. ${cslData.publisher}.`
  }
  
  return `${authors} ${year}. ${title}.`
}

// Custom Harvard formatter
function formatHarvard(cslData) {
  const authors = formatAuthorList(cslData.author)
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'n.d.'
  const title = cslData.title || 'Untitled'
  
  if (cslData['container-title']) {
    let citation = `${authors} ${year}, '${title}', ${cslData['container-title']}`
    if (cslData.volume) {
      citation += `, vol. ${cslData.volume}`
      if (cslData.issue) {
        citation += `, no. ${cslData.issue}`
      }
    }
    if (cslData.page) {
      citation += `, pp. ${cslData.page}`
    }
    return citation + '.'
  }
  
  // Book
  if (cslData.publisher) {
    return `${authors} ${year}, ${title}, ${cslData.publisher}.`
  }
  
  return `${authors} ${year}, ${title}.`
}

// MLA-specific author formatter
function formatAuthorListMLA(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author.'
  
  const formatName = (author, isFirst = false) => {
    if (author.family && author.given) {
      if (isFirst) {
        return `${author.family}, ${author.given}`
      }
      return `${author.given} ${author.family}`
    }
    return author.family || 'Unknown'
  }
  
  if (authors.length === 1) {
    return formatName(authors[0], true) + '.'
  } else if (authors.length === 2) {
    return `${formatName(authors[0], true)}, and ${formatName(authors[1])}.`
  } else if (authors.length === 3) {
    return `${formatName(authors[0], true)}, ${formatName(authors[1])}, and ${formatName(authors[2])}.`
  } else {
    return `${formatName(authors[0], true)}, et al.`
  }
}

/**
 * Format CSL-JSON data as APA citation string
 * @param {Object} cslData - CSL-JSON formatted data
 * @returns {string} APA formatted citation
 * @deprecated Use formatCitation(cslData, 'apa') instead
 */
export function formatAsApa(cslData) {
  return formatCitation(cslData, 'apa')
}

/**
 * Parse author string or array into CSL author format
 * Handles "姓, 名" format and various other formats
 * @param {string|Array} authors - Author data
 * @returns {Array} CSL author array
 */
function parseAuthors(authors) {
  if (!authors) return []
  
  // If already an array of objects, ensure proper format
  if (Array.isArray(authors)) {
    return authors.map(author => {
      if (typeof author === 'object' && author.family) {
        return author
      }
      return parseAuthorString(String(author))
    })
  }
  
  // Handle string format with multiple authors
  if (typeof authors === 'string') {
    // Split by common separators: semicolon, "and", "&"
    const authorList = authors.split(/[;]|(?:\s+and\s+)|(?:\s*&\s*)/)
    return authorList.map(author => parseAuthorString(author.trim())).filter(a => a)
  }
  
  return []
}

/**
 * Parse individual author string
 * @param {string} authorStr - Single author string
 * @returns {Object} CSL author object
 */
function parseAuthorString(authorStr) {
  if (!authorStr) return null
  
  // Handle "Last, First" format
  if (authorStr.includes(',')) {
    const parts = authorStr.split(',').map(p => p.trim())
    return {
      family: parts[0],
      given: parts[1] || ''
    }
  }
  
  // Handle "First Last" format
  const parts = authorStr.trim().split(/\s+/)
  if (parts.length === 1) {
    return { family: parts[0] }
  }
  
  // Assume last part is family name
  return {
    given: parts.slice(0, -1).join(' '),
    family: parts[parts.length - 1]
  }
}

/**
 * Parse date information into CSL date format
 * @param {string|number|Object} date - Date data
 * @returns {Object} CSL date object
 */
function parseDate(date) {
  if (!date) return undefined
  
  // If already in CSL format
  if (typeof date === 'object' && date['date-parts']) {
    return date
  }
  
  // Parse year only
  const year = parseInt(String(date).match(/\d{4}/)?.[0])
  if (year) {
    return {
      'date-parts': [[year]]
    }
  }
  
  return undefined
}

/**
 * Map internal type to CSL type
 * @param {string} type - Internal type
 * @returns {string} CSL type
 */
function mapType(type) {
  const typeMap = {
    'journal': 'article-journal',
    'article': 'article-journal',
    'book': 'book',
    'chapter': 'chapter',
    'conference': 'paper-conference',
    'thesis': 'thesis',
    'report': 'report',
    'webpage': 'webpage'
  }
  
  return typeMap[type?.toLowerCase()] || 'article'
}

/**
 * Generate unique ID for CSL data
 * @returns {string} Unique ID
 */
function generateId() {
  return 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Fallback APA formatting when citation-js fails
 * @param {Object} cslData - CSL-JSON data
 * @returns {string} Basic APA formatted string
 */
function fallbackApaFormat(cslData) {
  const authors = formatAuthorList(cslData.author)
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'n.d.'
  const title = cslData.title || 'Untitled'
  
  // Journal article
  if (cslData['container-title']) {
    let citation = `${authors} (${year}). ${title}. ${cslData['container-title']}`
    if (cslData.volume) {
      citation += `, ${cslData.volume}`
      if (cslData.issue) {
        citation += `(${cslData.issue})`
      }
    }
    if (cslData.page) {
      citation += `, ${cslData.page}`
    }
    return citation + '.'
  }
  
  // Book
  if (cslData.publisher) {
    return `${authors} (${year}). ${title}. ${cslData.publisher}.`
  }
  
  // Default
  return `${authors} (${year}). ${title}.`
}

/**
 * Format author list for fallback APA
 * @param {Array} authors - CSL author array
 * @returns {string} Formatted author string
 */
function formatAuthorList(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author'
  
  const formatName = (author) => {
    if (author.family && author.given) {
      return `${author.family}, ${author.given.charAt(0)}.`
    }
    return author.family || 'Unknown'
  }
  
  if (authors.length === 1) {
    return formatName(authors[0])
  } else if (authors.length === 2) {
    return `${formatName(authors[0])} & ${formatName(authors[1])}`
  } else {
    return `${formatName(authors[0])} et al.`
  }
}

export default {
  mapToCSL,
  formatAsApa,
  formatCitation,
  SUPPORTED_FORMATS
}