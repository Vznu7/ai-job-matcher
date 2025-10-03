import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

export async function parsePDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      fullText += pageText + ' '
    }
    
    return extractResumeData(fullText)
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF. Please ensure it\'s a valid PDF file.')
  }
}

function extractResumeData(text) {
  const cleanText = text.toLowerCase()
  
  // Extract skills using common patterns
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
    'typescript', 'angular', 'vue', 'php', 'c++', 'c#', 'ruby', 'go',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'mongodb', 'postgresql',
    'mysql', 'redis', 'elasticsearch', 'git', 'jenkins', 'terraform',
    'machine learning', 'data science', 'artificial intelligence', 'deep learning',
    'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'tableau',
    'power bi', 'excel', 'r', 'scala', 'spark', 'hadoop', 'kafka',
    'project management', 'agile', 'scrum', 'kanban', 'jira', 'confluence',
    'leadership', 'communication', 'problem solving', 'teamwork'
  ]
  
  const foundSkills = skillKeywords.filter(skill => 
    cleanText.includes(skill.toLowerCase())
  )
  
  // Extract experience years (simple pattern matching)
  const experienceMatch = text.match(/(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)/i)
  const experience = experienceMatch ? parseInt(experienceMatch[1]) : 0
  
  // Extract education
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college']
  const hasEducation = educationKeywords.some(keyword => 
    cleanText.includes(keyword)
  )
  
  // Extract contact info (basic patterns)
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  const phoneMatch = text.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/g)
  
  return {
    skills: foundSkills,
    experience: experience,
    hasEducation: hasEducation,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    rawText: text.substring(0, 500) + '...' // First 500 chars for preview
  }
}
