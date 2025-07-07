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

  // Remove undefined fields
  Object.keys(cslData).forEach(key => {
    if (cslData[key] === undefined) delete cslData[key]
  })

  return cslData
}

/**
 * Generates a unique ID for CSL-JSON
 */
function generateId() {
  return 'ref-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}

/**
 * Maps internal type to CSL type
 */
function mapType(type) {
  const typeMap = {
    'journal_article': 'article-journal',
    'journal': 'article-journal',
    'book': 'book',
    'website': 'webpage',
    'conference_paper': 'paper-conference',
    'thesis': 'thesis',
    'report': 'report'
  }
  return typeMap[type] || 'article'
}

/**
 * Parses author string or array into CSL author format
 * Handles both "Last, First" and "First Last" formats
 */
function parseAuthors(authors) {
  if (!authors) return []
  
  // If already in CSL format, return as is
  if (Array.isArray(authors) && authors.length > 0 && typeof authors[0] === 'object') {
    return authors
  }
  
  // Convert string to array
  const authorList = Array.isArray(authors) ? authors : [authors]
  
  return authorList.map(author => {
    if (typeof author === 'object') return author
    
    // Handle "Last, First" format
    if (author.includes(',')) {
      const [family, given] = author.split(',').map(s => s.trim())
      return { family, given }
    }
    
    // Handle "First Last" format
    const parts = author.trim().split(' ')
    if (parts.length === 1) {
      return { family: parts[0] }
    }
    
    const given = parts.slice(0, -1).join(' ')
    const family = parts[parts.length - 1]
    return { family, given }
  })
}

/**
 * Parses date into CSL date format
 */
function parseDate(date) {
  if (!date) return null
  
  const year = parseInt(date)
  if (!isNaN(year)) {
    return { 'date-parts': [[year]] }
  }
  
  return null
}

// Custom APA formatter (7th edition)
function formatAPA(cslData) {
  const authors = formatAuthorListAPA(cslData.author)
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'n.d.'
  const title = cslData.title || 'Untitled'
  
  // Journal article
  if (cslData.type === 'article-journal' && cslData['container-title']) {
    let citation = `${authors} (${year}). ${title}. `
    citation += `<i>${cslData['container-title']}</i>`
    
    if (cslData.volume) {
      citation += `, <i>${cslData.volume}</i>`
      if (cslData.issue) {
        citation += `(${cslData.issue})`
      }
    }
    
    if (cslData.page) {
      citation += `, ${cslData.page}`
    }
    
    citation += '.'
    
    // Add DOI if available
    if (cslData.DOI) {
      citation += ` https://doi.org/${cslData.DOI}`
    }
    
    return citation
  }
  
  // Book
  if (cslData.type === 'book' || cslData.publisher) {
    return `${authors} (${year}). <i>${title}</i>. ${cslData.publisher || ''}${cslData.DOI ? `. https://doi.org/${cslData.DOI}` : '.'}`
  }
  
  // Website
  if (cslData.type === 'webpage' && cslData.URL) {
    return `${authors} (${year}). <i>${title}</i>. ${cslData.URL}`
  }
  
  // Default
  return `${authors} (${year}). ${title}.`
}

// APA author formatter
function formatAuthorListAPA(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author'
  
  const formatName = (author) => {
    if (author.given && author.family) {
      // Get initials from given name
      const initials = author.given.split(' ').map(name => name[0] + '.').join(' ')
      return `${author.family}, ${initials}`
    }
    return author.family || 'Unknown'
  }
  
  if (authors.length === 1) {
    return formatName(authors[0])
  } else if (authors.length === 2) {
    return `${formatName(authors[0])}, & ${formatName(authors[1])}`
  } else if (authors.length <= 20) {
    const formatted = authors.slice(0, -1).map(formatName).join(', ')
    return `${formatted}, & ${formatName(authors[authors.length - 1])}`
  } else {
    // 21 or more authors: list first 19, then ellipsis, then last author
    const first19 = authors.slice(0, 19).map(formatName).join(', ')
    const last = formatName(authors[authors.length - 1])
    return `${first19}, ... ${last}`
  }
}

// Custom MLA formatter (9th edition)
function formatMLA(cslData) {
  const authors = formatAuthorListMLA(cslData.author)
  const title = cslData.title || 'Untitled'
  
  // Journal article
  if (cslData.type === 'article-journal' && cslData['container-title']) {
    let citation = `${authors} "${title}." <i>${cslData['container-title']}</i>`
    
    if (cslData.volume) {
      citation += `, vol. ${cslData.volume}`
      if (cslData.issue) {
        citation += `, no. ${cslData.issue}`
      }
    }
    
    const year = cslData.issued?.['date-parts']?.[0]?.[0]
    if (year) {
      citation += `, ${year}`
    }
    
    if (cslData.page) {
      citation += `, pp. ${cslData.page}`
    }
    
    citation += '.'
    
    // Add DOI or URL if available
    if (cslData.DOI) {
      citation += ` https://doi.org/${cslData.DOI}.`
    } else if (cslData.URL) {
      citation += ` ${cslData.URL}.`
    }
    
    return citation
  }
  
  // Book
  if (cslData.type === 'book' || cslData.publisher) {
    const year = cslData.issued?.['date-parts']?.[0]?.[0] || ''
    return `${authors} <i>${title}</i>. ${cslData.publisher || 'Publisher'}, ${year}.`
  }
  
  // Website
  if (cslData.type === 'webpage') {
    const year = cslData.issued?.['date-parts']?.[0]?.[0] || ''
    return `${authors} "${title}." <i>${cslData['container-title'] || 'Website'}</i>, ${year}. ${cslData.URL || ''}.`
  }
  
  // Default
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || ''
  return `${authors} ${title}. ${year}.`
}

// MLA author formatter
function formatAuthorListMLA(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author.'
  
  const formatName = (author, isFirst = false) => {
    if (author.given && author.family) {
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

// Custom Chicago formatter (17th/18th edition - Author-Date)
function formatChicago(cslData) {
  const authors = formatAuthorListChicago(cslData.author)
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'n.d.'
  const title = cslData.title || 'Untitled'
  
  // Journal article
  if (cslData.type === 'article-journal' && cslData['container-title']) {
    let citation = `${authors} ${year}. "${title}." <i>${cslData['container-title']}</i>`
    
    if (cslData.volume) {
      citation += ` ${cslData.volume}`
      if (cslData.issue) {
        citation += ` (${cslData.issue})`
      }
    }
    
    if (cslData.page) {
      citation += `: ${cslData.page}`
    }
    
    citation += '.'
    
    // Add DOI if available
    if (cslData.DOI) {
      citation += ` https://doi.org/${cslData.DOI}.`
    }
    
    return citation
  }
  
  // Book
  if (cslData.type === 'book' || cslData.publisher) {
    // Note: Chicago 18th edition no longer requires place of publication
    return `${authors} ${year}. <i>${title}</i>. ${cslData.publisher || 'Publisher'}.`
  }
  
  // Website
  if (cslData.type === 'webpage') {
    return `${authors} ${year}. "${title}." Accessed ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. ${cslData.URL || ''}.`
  }
  
  // Default
  return `${authors} ${year}. ${title}.`
}

// Chicago author formatter
function formatAuthorListChicago(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author.'
  
  const formatName = (author, isFirst = false) => {
    if (author.given && author.family) {
      if (isFirst) {
        return `${author.family}, ${author.given}`
      }
      return `${author.given} ${author.family}`
    }
    return author.family || 'Unknown'
  }
  
  if (authors.length === 1) {
    return formatName(authors[0], true) + '.'
  } else if (authors.length <= 3) {
    const names = authors.map((author, i) => formatName(author, i === 0))
    const lastAuthor = names.pop()
    return names.join(', ') + ', and ' + lastAuthor + '.'
  } else {
    return formatName(authors[0], true) + ', et al.'
  }
}

// Custom Harvard formatter
function formatHarvard(cslData) {
  const authors = formatAuthorListHarvard(cslData.author)
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'no date'
  const title = cslData.title || 'Untitled'
  
  // Journal article
  if (cslData.type === 'article-journal' && cslData['container-title']) {
    let citation = `${authors} (${year}) '${title}', <i>${cslData['container-title']}</i>`
    
    if (cslData.volume) {
      citation += `, ${cslData.volume}`
      if (cslData.issue) {
        citation += `(${cslData.issue})`
      }
    }
    
    if (cslData.page) {
      citation += `, pp. ${cslData.page}`
    }
    
    citation += '.'
    
    // Add DOI if available
    if (cslData.DOI) {
      citation += ` Available at: https://doi.org/${cslData.DOI} (Accessed: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}).`
    }
    
    return citation
  }
  
  // Book
  if (cslData.type === 'book' || cslData.publisher) {
    return `${authors} (${year}) <i>${title}</i>. ${cslData.publisher || 'Publisher'}.`
  }
  
  // Website
  if (cslData.type === 'webpage') {
    const accessDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    return `${authors} (${year}) <i>${title}</i>. Available at: ${cslData.URL || '[URL]'} (Accessed: ${accessDate}).`
  }
  
  // Default
  return `${authors} (${year}) ${title}.`
}

// Harvard author formatter
function formatAuthorListHarvard(authors) {
  if (!authors || authors.length === 0) return 'Unknown Author'
  
  const formatName = (author, isLast = false) => {
    if (author.given && author.family) {
      return `${author.family}, ${author.given[0]}.`
    }
    return author.family || 'Unknown'
  }
  
  if (authors.length === 1) {
    return formatName(authors[0])
  } else if (authors.length === 2) {
    return `${formatName(authors[0])} and ${formatName(authors[1])}`
  } else if (authors.length === 3) {
    return `${formatName(authors[0])}, ${formatName(authors[1])} and ${formatName(authors[2])}`
  } else {
    return formatName(authors[0]) + ' et al.'
  }
}

/**
 * Formats citation according to specified style
 * Now with custom formatters that follow the latest style guidelines
 * @param {Object} cslData - CSL-JSON formatted data
 * @param {string} style - Citation style (apa, mla, chicago, harvard)
 * @returns {string} Formatted citation
 */
export function formatCitation(cslData, style = 'apa') {
  try {
    const normalizedStyle = style.toLowerCase()
    
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
        // Try to use citation-js as fallback
        try {
          const cite = new Cite(cslData)
          return cite.format('bibliography', {
            format: 'text',
            template: normalizedStyle
          })
        } catch (error) {
          // If citation-js fails, use our APA formatter as default
          return formatAPA(cslData)
        }
    }
  } catch (error) {
    console.error(`Error formatting citation with style ${style}:`, error)
    // Fallback to basic APA format
    return fallbackApaFormat(cslData)
  }
}

/**
 * Fallback formatter when all else fails
 */
function fallbackApaFormat(cslData) {
  const authors = cslData.author?.map(a => a.family || 'Unknown').join(', ') || 'Unknown Author'
  const year = cslData.issued?.['date-parts']?.[0]?.[0] || 'n.d.'
  const title = cslData.title || 'Untitled'
  return `${authors} (${year}). ${title}.`
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use formatCitation with 'apa' style instead
 */
export function formatAsApa(cslData) {
  return formatCitation(cslData, 'apa')
}