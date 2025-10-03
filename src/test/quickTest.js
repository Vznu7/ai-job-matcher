// Quick test to verify core functionality
import { fetchJobsFromMultipleSources } from '../services/multiJobService.js'
import { calculateJobMatches } from '../services/aiMatcher.js'

export async function runQuickTest() {
  console.log('🧪 Running quick functionality test...')
  
  try {
    // Test 1: Multi-source job fetching
    console.log('📋 Testing job fetching...')
    const testJobs = await fetchJobsFromMultipleSources('Software Engineer', ['JavaScript', 'React', 'Node.js'])
    console.log(`✅ Job fetching: Found ${testJobs.length} jobs`)
    
    // Test 2: AI matching
    console.log('🤖 Testing AI matching...')
    const mockResumeData = {
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      experience: 3,
      hasEducation: true
    }
    
    const matchedJobs = await calculateJobMatches(mockResumeData, testJobs.slice(0, 3))
    console.log(`✅ AI matching: Processed ${matchedJobs.length} job matches`)
    
    // Test 3: Check for AI enhancement
    const hasAIEnhanced = matchedJobs.some(job => job.aiEnhanced)
    console.log(`🧠 AI Enhancement: ${hasAIEnhanced ? 'Active' : 'Using fallback'}`)
    
    return {
      status: 'success',
      jobCount: testJobs.length,
      matchCount: matchedJobs.length,
      aiEnhanced: hasAIEnhanced
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return {
      status: 'error',
      error: error.message
    }
  }
}

// Auto-run test when imported (for debugging)
if (typeof window !== 'undefined') {
  window.runQuickTest = runQuickTest
}
