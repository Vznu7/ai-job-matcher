// Test the improved matching algorithm
import { calculateJobMatches } from '../services/aiMatcher.js'

// Test data
const testResumeData = {
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  experience: 3,
  hasEducation: true,
  expectedRole: 'Software Engineer'
}

const testJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    description: 'Looking for experienced JavaScript and React developer with Node.js knowledge. 5+ years required.',
    location: 'Bangalore'
  },
  {
    id: '2', 
    title: 'Junior Frontend Developer',
    company: 'StartupXYZ',
    description: 'Entry level position for React and JavaScript developer. Fresh graduates welcome.',
    location: 'Mumbai'
  },
  {
    id: '3',
    title: 'Python Data Scientist',
    company: 'DataCorp',
    description: 'Python expert needed for machine learning projects. SQL and pandas experience required.',
    location: 'Hyderabad'
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    description: 'JavaScript, React, Node.js full stack developer. Experience with databases preferred.',
    location: 'Chennai'
  }
]

// Test the matching
export async function testMatching() {
  console.log('🧪 Testing improved matching algorithm...')
  
  try {
    const results = await calculateJobMatches(testResumeData, testJobs)
    
    console.log('📊 Match Results:')
    results.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - ${job.matchScore}%`)
      console.log(`   Company: ${job.company}`)
      console.log(`   Matching Skills: ${job.overlappingSkills?.join(', ') || 'None'}`)
      console.log(`   Missing Skills: ${job.missingSkills?.join(', ') || 'None'}`)
      console.log(`   AI Enhanced: ${job.aiEnhanced ? 'Yes' : 'No'}`)
      console.log('---')
    })
    
    // Verify scores are varied and realistic
    const scores = results.map(job => job.matchScore)
    const minScore = Math.min(...scores)
    const maxScore = Math.max(...scores)
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    
    console.log('📈 Score Analysis:')
    console.log(`   Range: ${minScore}% - ${maxScore}%`)
    console.log(`   Average: ${Math.round(avgScore)}%`)
    console.log(`   Variation: ${maxScore - minScore}%`)
    
    if (minScore >= 45 && maxScore <= 95 && (maxScore - minScore) >= 10) {
      console.log('✅ Matching algorithm working correctly!')
      return true
    } else {
      console.log('❌ Matching algorithm needs adjustment')
      return false
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

// Auto-run test if in browser
if (typeof window !== 'undefined') {
  window.testMatching = testMatching
}
