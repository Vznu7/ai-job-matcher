// LinkedIn Jobs API service via RapidAPI
const LINKEDIN_API_URL = 'https://linkedin-jobs-search.p.rapidapi.com/jobs'
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo_rapidapi_key'
const RAPIDAPI_HOST = 'linkedin-jobs-search.p.rapidapi.com'

export async function fetchLinkedInJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('💼 LinkedIn API Key check:', {
      key: RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 10) + '...' : 'NOT SET',
      isDemoKey: RAPIDAPI_KEY === 'demo_rapidapi_key'
    })
    
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('❌ LinkedIn API key not configured')
      return []
    }

    const query = `${expectedRole} ${skills.slice(0, 2).join(' ')}`
    const params = new URLSearchParams({
      keywords: query,
      location: preferredLocation,
      dateSincePosted: 'anyTime',
      jobType: 'fullTime',
      sort: 'mostRelevant'
    })

    const apiUrl = `${LINKEDIN_API_URL}?${params}`
    console.log('🌐 Calling LinkedIn API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    })

    console.log('📡 LinkedIn API Response Status:', response.status, response.statusText)

    if (!response.ok) {
      console.log('⚠️ LinkedIn API failed, trying alternative approach')
      return []
    }

    const data = await response.json()
    console.log('📊 LinkedIn API Response:', {
      jobs_count: data.jobs ? data.jobs.length : 0,
      total: data.total
    })

    if (!data.jobs || data.jobs.length === 0) {
      console.log('⚠️ No jobs found from LinkedIn API')
      return []
    }

    console.log(`✅ LinkedIn found ${data.jobs.length} jobs, processing...`)

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(),
      title: job.title,
      company: job.company,
      location: job.location || preferredLocation,
      description: job.description || 'No description available',
      salary: job.salary || 'Salary not disclosed',
      url: job.url || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + ' ' + job.company)}`,
      created: job.postedDate || new Date().toISOString(),
      source: 'LinkedIn'
    })).slice(0, 15)

  } catch (error) {
    console.error('❌ LinkedIn API failed:', error)
    return []
  }
}
