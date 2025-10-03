// JSearch API service - Better coverage for India
// For development: API keys are set here, for production: use environment variables
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search'
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || 'c404bc1120msh945084d4c9348bdp1c4782jsnc9f6236d2a96'
const RAPIDAPI_HOST = 'jsearch.p.rapidapi.com'

export async function fetchJobsWithJSearch(expectedRole, skills, preferredLocation = 'India') {
  try {
    if (RAPIDAPI_KEY === 'demo_rapidapi_key') {
      console.log('JSearch API key not configured, using mock data')
      return getLocationMockJobs(expectedRole, skills, preferredLocation)
    }

    // Map location to country codes and include location in query
    const locationMap = {
      'india': 'IN',
      'mumbai': 'IN',
      'bangalore': 'IN',
      'delhi': 'IN',
      'hyderabad': 'IN',
      'chennai': 'IN',
      'pune': 'IN',
      'remote': 'IN',
      'usa': 'US',
      'uk': 'GB',
      'canada': 'CA',
      'australia': 'AU'
    }
    
    const countryCode = locationMap[preferredLocation.toLowerCase()] || 'IN'
    const query = `${expectedRole} ${preferredLocation} ${skills.slice(0, 2).join(' ')}`
    
    const params = new URLSearchParams({
      query: query,
      page: '1',
      num_pages: '1',
      country: countryCode,
      employment_types: 'FULLTIME,PARTTIME,CONTRACTOR',
      job_requirements: 'under_3_years_experience,more_than_3_years_experience,no_experience',
      date_posted: 'all'
    })

    const response = await fetch(`${JSEARCH_API_URL}?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    })

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.data || data.data.length === 0) {
      console.log('No jobs found from JSearch, using mock data')
      return getLocationMockJobs(expectedRole, skills, preferredLocation)
    }

    return data.data.map(job => ({
      id: job.job_id || Math.random().toString(),
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_state || 'India'}` : 'India',
      description: job.job_description || 'No description available',
      salary: formatSalary(job.job_min_salary, job.job_max_salary),
      url: job.job_apply_link || job.job_google_link || '#',
      created: job.job_posted_at_datetime_utc || new Date().toISOString(),
      source: 'JSearch API'
    })).slice(0, 20) // Limit to 20 jobs

  } catch (error) {
    console.error('Error fetching jobs from JSearch:', error)
    return getLocationMockJobs(expectedRole, skills, preferredLocation)
  }
}

function formatSalary(minSalary, maxSalary) {
  if (!minSalary && !maxSalary) return 'Salary not disclosed'
  
  // Convert USD to INR (approximate)
  const usdToInr = 83
  
  if (minSalary && maxSalary) {
    const minInr = Math.round(minSalary * usdToInr)
    const maxInr = Math.round(maxSalary * usdToInr)
    return `₹${minInr.toLocaleString('en-IN')} - ₹${maxInr.toLocaleString('en-IN')}`
  } else if (minSalary) {
    const minInr = Math.round(minSalary * usdToInr)
    return `₹${minInr.toLocaleString('en-IN')}+`
  } else {
    const maxInr = Math.round(maxSalary * usdToInr)
    return `Up to ₹${maxInr.toLocaleString('en-IN')}`
  }
}

function getLocationMockJobs(expectedRole, skills, preferredLocation) {
  // Location-specific companies and cities
  const locationData = {
    'bangalore': {
      companies: ['Infosys', 'Wipro', 'Flipkart', 'Swiggy', 'Ola'],
      locations: ['Bangalore, Karnataka', 'Bengaluru, Karnataka']
    },
    'mumbai': {
      companies: ['Tata Consultancy Services', 'Reliance', 'Nykaa', 'Paytm', 'HDFC Bank'],
      locations: ['Mumbai, Maharashtra', 'Navi Mumbai, Maharashtra']
    },
    'delhi': {
      companies: ['HCL Technologies', 'Zomato', 'Snapdeal', 'MakeMyTrip', 'PolicyBazaar'],
      locations: ['New Delhi, Delhi', 'Gurgaon, Haryana', 'Noida, Uttar Pradesh']
    },
    'hyderabad': {
      companies: ['Microsoft India', 'Amazon India', 'Google India', 'Facebook India', 'Cyient'],
      locations: ['Hyderabad, Telangana', 'Secunderabad, Telangana']
    },
    'chennai': {
      companies: ['Cognizant', 'Zoho', 'Freshworks', 'PayPal India', 'Ford India'],
      locations: ['Chennai, Tamil Nadu', 'Coimbatore, Tamil Nadu']
    },
    'pune': {
      companies: ['Tech Mahindra', 'Persistent Systems', 'Bajaj Finserv', 'Cummins India', 'Synechron'],
      locations: ['Pune, Maharashtra', 'Pimpri-Chinchwad, Maharashtra']
    },
    'remote': {
      companies: ['GitLab', 'Buffer', 'Automattic', 'InVision', 'Toptal'],
      locations: ['Remote, India', 'Work from Home', 'Remote - India']
    }
  }

  const defaultData = {
    companies: ['Tech Mahindra', 'HCL Technologies', 'Infosys', 'Wipro', 'Cognizant'],
    locations: ['Bangalore, Karnataka', 'Mumbai, Maharashtra', 'Hyderabad, Telangana']
  }

  const data = locationData[preferredLocation.toLowerCase()] || defaultData

  return [
    {
      id: 'location-mock-1',
      title: `${expectedRole} - ${preferredLocation}`,
      company: data.companies[0],
      location: data.locations[0],
      description: `Exciting ${expectedRole} opportunity in ${preferredLocation}. Required skills: ${skills.slice(0, 3).join(', ')}. Join our innovative team working on cutting-edge projects.`,
      salary: '₹8,00,000 - ₹14,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Location Specific'
    },
    {
      id: 'location-mock-2',
      title: `Senior ${expectedRole}`,
      company: data.companies[1] || data.companies[0],
      location: data.locations[1] || data.locations[0],
      description: `Senior ${expectedRole} role in ${preferredLocation}. Experience with ${skills.slice(1, 4).join(', ')} preferred. Great career growth opportunities.`,
      salary: '₹12,00,000 - ₹18,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Location Specific'
    },
    {
      id: 'location-mock-3',
      title: `${expectedRole} - Remote`,
      company: data.companies[2] || data.companies[0],
      location: preferredLocation.toLowerCase() === 'remote' ? 'Remote, India' : `${data.locations[0]} (Remote Option)`,
      description: `Remote ${expectedRole} position. Work with ${skills.slice(0, 2).join(', ')} technologies. Flexible work arrangements in ${preferredLocation}.`,
      salary: '₹10,00,000 - ₹16,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Location Specific'
    },
    {
      id: 'location-mock-4',
      title: `Lead ${expectedRole}`,
      company: data.companies[3] || data.companies[0],
      location: data.locations[0],
      description: `Leadership role for ${expectedRole} in ${preferredLocation}. Team management and ${skills.slice(2, 5).join(', ')} expertise required.`,
      salary: '₹18,00,000 - ₹25,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Location Specific'
    },
    {
      id: 'location-mock-5',
      title: `${expectedRole} - Growth Role`,
      company: data.companies[4] || data.companies[0],
      location: data.locations[1] || data.locations[0],
      description: `Growth-focused ${expectedRole} position in ${preferredLocation}. Work with ${skills.slice(1, 3).join(', ')} in a dynamic environment.`,
      salary: '₹15,00,000 - ₹22,00,000',
      url: '#',
      created: new Date().toISOString(),
      source: 'Mock Data - Location Specific'
    }
  ]
}
