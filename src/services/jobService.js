// Adzuna API service
// For development: API keys are set here, for production: use environment variables
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID || 'demo_app_id'
const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY || 'demo_api_key'
const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/jobs'

export async function fetchJobs(expectedRole, skills, location = 'in') {
  try {
    console.log('🔧 Adzuna API Check:', {
      app_id: ADZUNA_APP_ID,
      api_key: ADZUNA_API_KEY ? 'SET' : 'NOT SET',
      is_demo: ADZUNA_APP_ID === 'demo_app_id'
    })
    
    // Use mock data if API keys are not configured
    if (ADZUNA_APP_ID === 'demo_app_id' || ADZUNA_API_KEY === 'demo_api_key') {
      console.log('⚠️ Using Adzuna mock data - API keys not configured')
      return getMockJobs(expectedRole, skills)
    }
    
    const query = `${expectedRole} ${skills.slice(0, 3).join(' ')}`
    const url = `${ADZUNA_BASE_URL}/${location}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=20&what=${encodeURIComponent(query)}`
    
    console.log('🌐 Calling Adzuna API:', url)
    const response = await fetch(url)
    if (!response.ok) {
      console.error('❌ Adzuna API failed:', response.status, response.statusText)
      throw new Error('Failed to fetch jobs')
    }
    
    const data = await response.json()
    console.log('✅ Adzuna API response:', data.results?.length, 'jobs')
    if (data.results?.[0]) {
      console.log('📎 First Adzuna job URL:', data.results[0].redirect_url)
    }
    
    return data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      salary: job.salary_min && job.salary_max ? 
        `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 
        'Salary not specified',
      url: job.redirect_url,
      created: job.created,
      source: 'Adzuna API'
    }))
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return getMockJobs(expectedRole, skills)
  }
}

function getMockJobs(expectedRole, skills) {
  const mockJobs = [
    {
      id: '1',
      title: `Senior ${expectedRole}`,
      company: 'Infosys Limited',
      location: 'Bangalore, Karnataka',
      description: `We are looking for a talented ${expectedRole} to join our team in Bangalore. Required skills include ${skills.slice(0, 3).join(', ')} and more. Great opportunity for career growth.`,
      salary: '₹12,00,000 - ₹18,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Adzuna'
    },
    {
      id: '2',
      title: `${expectedRole} - Remote`,
      company: 'Flipkart',
      location: 'Remote (India)',
      description: `Remote ${expectedRole} position with competitive benefits. Experience with ${skills.slice(1, 4).join(', ')} preferred. Work from anywhere in India.`,
      salary: '₹10,00,000 - ₹15,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Adzuna'
    },
    {
      id: '3',
      title: `Lead ${expectedRole}`,
      company: 'Tata Consultancy Services',
      location: 'Mumbai, Maharashtra',
      description: `Leadership role for experienced ${expectedRole} in Mumbai. Must have expertise in ${skills.slice(0, 2).join(', ')} and team management. Leading global projects.`,
      salary: '₹20,00,000 - ₹25,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Adzuna'
    },
    {
      id: '4',
      title: `${expectedRole} - Fresher`,
      company: 'Wipro Technologies',
      location: 'Hyderabad, Telangana',
      description: `Entry-level ${expectedRole} position perfect for recent graduates in Hyderabad. Training provided in ${skills.slice(2, 5).join(', ')}. Great learning opportunities.`,
      salary: '₹4,00,000 - ₹6,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Adzuna'
    },
    {
      id: '5',
      title: `${expectedRole} - Product Team`,
      company: 'Zomato',
      location: 'Gurgaon, Haryana',
      description: `Product team ${expectedRole} role in Gurgaon with flexible schedule. Expertise in ${skills.slice(1, 3).join(', ')} required. Work on India's favorite food app.`,
      salary: '₹15,00,000 - ₹22,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Adzuna'
    },
    {
      id: '6',
      title: `${expectedRole} - Fintech`,
      company: 'Paytm',
      location: 'Noida, Uttar Pradesh',
      description: `Fintech ${expectedRole} position at India's leading digital payments company. Experience with ${skills.slice(0, 4).join(', ')} preferred.`,
      salary: '₹12,00,000 - ₹20,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Adzuna'
    }
  ]
  
  return mockJobs
}
