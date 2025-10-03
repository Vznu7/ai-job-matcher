// Indeed Jobs API service via RapidAPI
const INDEED_API_URL = 'https://indeed12.p.rapidapi.com/jobs/search'
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo_rapidapi_key'
const RAPIDAPI_HOST = 'indeed12.p.rapidapi.com'

export async function fetchIndeedJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('🔍 Indeed API Key check:', {
      key: RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 10) + '...' : 'NOT SET',
      isDemoKey: RAPIDAPI_KEY === 'demo_rapidapi_key'
    })
    
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('❌ Indeed API key not configured')
      return []
    }

    const query = `${expectedRole} ${skills.slice(0, 2).join(' ')}`
    const params = new URLSearchParams({
      query: query,
      location: preferredLocation,
      page_id: '1',
      locality: 'in'
    })

    const apiUrl = `${INDEED_API_URL}?${params}`
    console.log('🌐 Calling Indeed API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    })

    console.log('📡 Indeed API Response Status:', response.status, response.statusText)

    if (!response.ok) {
      console.log('⚠️ Indeed API failed')
      return []
    }

    const data = await response.json()
    console.log('📊 Indeed API Response:', {
      jobs_count: data.jobs ? data.jobs.length : 0,
      hits: data.hits
    })

    if (!data.jobs || data.jobs.length === 0) {
      console.log('⚠️ No jobs found from Indeed API')
      return []
    }

    console.log(`✅ Indeed found ${data.jobs.length} jobs, processing...`)

    return data.jobs.map(job => ({
      id: job.job_id || Math.random().toString(),
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_state || 'India'}` : preferredLocation,
      description: job.job_description || 'No description available',
      salary: job.job_salary || 'Salary not disclosed',
      url: job.job_url || `https://www.indeed.co.in/jobs?q=${encodeURIComponent(job.job_title + ' ' + job.employer_name)}`,
      created: job.job_posted_date || new Date().toISOString(),
      source: 'Indeed'
    })).slice(0, 15)

  } catch (error) {
    console.error('❌ Indeed API failed:', error)
    return []
  }
}
