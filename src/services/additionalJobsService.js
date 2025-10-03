// Additional job boards service - Monster, Glassdoor, etc.
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'demo_rapidapi_key'

// Monster Jobs API
export async function fetchMonsterJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('👹 Monster Jobs API check...')
    
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('❌ Monster API key not configured')
      return []
    }

    // Monster API via RapidAPI
    const response = await fetch('https://monster-jobs-api.p.rapidapi.com/jobs/search', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'monster-jobs-api.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      console.log('⚠️ Monster API failed')
      return []
    }

    const data = await response.json()
    console.log(`✅ Monster found ${data.jobs?.length || 0} jobs`)

    if (!data.jobs || data.jobs.length === 0) {
      return []
    }

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(),
      title: job.title,
      company: job.company,
      location: job.location || preferredLocation,
      description: job.description || 'No description available',
      salary: job.salary || 'Salary not disclosed',
      url: job.url || `https://www.monster.com/jobs/search/?q=${encodeURIComponent(job.title)}`,
      created: job.posted_date || new Date().toISOString(),
      source: 'Monster'
    })).slice(0, 10)

  } catch (error) {
    console.error('❌ Monster API failed:', error)
    return []
  }
}

// Glassdoor Jobs API
export async function fetchGlassdoorJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('🏢 Glassdoor Jobs API check...')
    
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('❌ Glassdoor API key not configured')
      return []
    }

    // Glassdoor API via RapidAPI
    const response = await fetch('https://glassdoor-jobs-api.p.rapidapi.com/jobs', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'glassdoor-jobs-api.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      console.log('⚠️ Glassdoor API failed')
      return []
    }

    const data = await response.json()
    console.log(`✅ Glassdoor found ${data.jobs?.length || 0} jobs`)

    if (!data.jobs || data.jobs.length === 0) {
      return []
    }

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(),
      title: job.jobTitle,
      company: job.employer,
      location: job.location || preferredLocation,
      description: job.jobDescription || 'No description available',
      salary: job.salary || 'Salary not disclosed',
      url: job.jobUrl || `https://www.glassdoor.com/Jobs/${encodeURIComponent(job.jobTitle)}-jobs-SRCH_KO0,${job.jobTitle?.length || 10}.htm`,
      created: job.postedDate || new Date().toISOString(),
      source: 'Glassdoor'
    })).slice(0, 10)

  } catch (error) {
    console.error('❌ Glassdoor API failed:', error)
    return []
  }
}

// AngelList (Wellfound) Jobs for startups
export async function fetchAngelListJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('👼 AngelList Jobs API check...')
    
    // AngelList/Wellfound has a public API
    const query = `${expectedRole} ${skills.slice(0, 2).join(' ')}`
    const response = await fetch(`https://api.wellfound.com/1/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(preferredLocation)}`)

    if (!response.ok) {
      console.log('⚠️ AngelList API failed')
      return []
    }

    const data = await response.json()
    console.log(`✅ AngelList found ${data.jobs?.length || 0} jobs`)

    if (!data.jobs || data.jobs.length === 0) {
      return []
    }

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(),
      title: job.title,
      company: job.startup?.name || 'Startup',
      location: job.location || preferredLocation,
      description: job.description || 'No description available',
      salary: job.salary_range || 'Startup equity + salary',
      url: job.angellist_url || `https://wellfound.com/jobs?query=${encodeURIComponent(job.title)}`,
      created: job.created_at || new Date().toISOString(),
      source: 'AngelList'
    })).slice(0, 10)

  } catch (error) {
    console.error('❌ AngelList API failed:', error)
    return []
  }
}

// Dice Jobs for tech roles
export async function fetchDiceJobs(expectedRole, skills, preferredLocation = 'India') {
  try {
    console.log('🎲 Dice Jobs API check...')
    
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('❌ Dice API key not configured')
      return []
    }

    const response = await fetch('https://dice-jobs-api.p.rapidapi.com/jobs', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'dice-jobs-api.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      console.log('⚠️ Dice API failed')
      return []
    }

    const data = await response.json()
    console.log(`✅ Dice found ${data.jobs?.length || 0} jobs`)

    if (!data.jobs || data.jobs.length === 0) {
      return []
    }

    return data.jobs.map(job => ({
      id: job.id || Math.random().toString(),
      title: job.jobTitle,
      company: job.company,
      location: job.location || preferredLocation,
      description: job.summary || 'No description available',
      salary: job.salary || 'Salary not disclosed',
      url: job.detailUrl || `https://www.dice.com/jobs?q=${encodeURIComponent(job.jobTitle)}`,
      created: job.postedDate || new Date().toISOString(),
      source: 'Dice'
    })).slice(0, 10)

  } catch (error) {
    console.error('❌ Dice API failed:', error)
    return []
  }
}
