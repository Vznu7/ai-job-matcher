// Naukri.com Jobs API service via RapidAPI
const NAUKRI_API_URL = 'https://naukri-jobs-api.p.rapidapi.com/jobs'
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo_rapidapi_key'
const RAPIDAPI_HOST = 'naukri-jobs-api.p.rapidapi.com'

export async function fetchNaukriJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('🇮🇳 Naukri API Key check:', {
      key: RAPIDAPI_KEY ? RAPIDAPI_KEY.substring(0, 10) + '...' : 'NOT SET',
      isDemoKey: RAPIDAPI_KEY === 'demo_rapidapi_key'
    })
    
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('❌ Naukri API key not configured')
      return []
    }

    const query = `${expectedRole} ${skills.slice(0, 2).join(' ')}`
    const params = new URLSearchParams({
      query: query,
      location: preferredLocation,
      page: '1'
    })

    const apiUrl = `${NAUKRI_API_URL}?${params}`
    console.log('🌐 Calling Naukri API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    })

    console.log('📡 Naukri API Response Status:', response.status, response.statusText)

    if (!response.ok) {
      console.log('⚠️ Naukri API failed')
      return []
    }

    const data = await response.json()
    console.log('📊 Naukri API Response:', {
      jobs_count: data.jobs ? data.jobs.length : 0,
      total: data.total
    })

    if (!data.jobs || data.jobs.length === 0) {
      console.log('⚠️ No jobs found from Naukri API')
      return []
    }

    console.log(`✅ Naukri found ${data.jobs.length} jobs, processing...`)

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(),
      title: job.title,
      company: job.company_name,
      location: job.location || preferredLocation,
      description: job.job_description || 'No description available',
      salary: job.salary || 'Salary not disclosed',
      url: job.job_url || `https://www.naukri.com/jobs-in-${preferredLocation.toLowerCase()}?k=${encodeURIComponent(job.title)}`,
      created: job.posted_date || new Date().toISOString(),
      source: 'Naukri.com'
    })).slice(0, 15)

  } catch (error) {
    console.error('❌ Naukri API failed:', error)
    return []
  }
}
