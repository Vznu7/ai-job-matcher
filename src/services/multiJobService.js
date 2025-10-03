// Multi-API job service for better coverage in India
import { fetchJobs } from './jobService.js'
import { fetchJobsWithJSearch } from './jsearchService.js'

// The Muse API - No auth required
const MUSE_API_URL = 'https://www.themuse.com/api/public/jobs'

export async function fetchJobsFromMultipleSources(expectedRole, skills, preferredLocation = 'India') {
  console.log(`🔍 Fetching jobs from multiple sources for location: ${preferredLocation}...`)
  
  const jobPromises = [
    fetchAdzunaJobs(expectedRole, skills, preferredLocation),
    fetchJSearchJobs(expectedRole, skills, preferredLocation),
    fetchMuseJobs(expectedRole, skills, preferredLocation)
  ]

  try {
    const results = await Promise.allSettled(jobPromises)
    
    let allJobs = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        const source = ['Adzuna', 'JSearch', 'The Muse'][index]
        console.log(`✅ ${source}: Found ${result.value.length} jobs`)
        
        // Log first job URL to verify real data
        if (result.value[0]) {
          console.log(`   📎 Sample URL from ${source}:`, result.value[0].url)
          console.log(`   🏢 Sample source:`, result.value[0].source)
          console.log(`   📋 Sample job:`, {
            title: result.value[0].title,
            company: result.value[0].company,
            url: result.value[0].url,
            source: result.value[0].source
          })
        }
        
        allJobs = [...allJobs, ...result.value]
      } else {
        const source = ['Adzuna', 'JSearch', 'The Muse'][index]
        console.log(`❌ ${source}: No jobs found`)
        if (result.status === 'rejected') {
          console.log(`   Error:`, result.reason)
        }
      }
    })

    // Remove duplicates based on title and company
    const uniqueJobs = removeDuplicateJobs(allJobs)
    
    if (uniqueJobs.length === 0) {
      console.log('📝 No jobs from APIs, using comprehensive mock data')
      return getComprehensiveMockJobs(expectedRole, skills, preferredLocation)
    }

    console.log(`🎯 Total unique jobs found: ${uniqueJobs.length}`)
    return uniqueJobs.slice(0, 20) // Limit to 20 best matches

  } catch (error) {
    console.error('Error fetching from multiple sources:', error)
    return getComprehensiveMockJobs(expectedRole, skills, preferredLocation)
  }
}

async function fetchAdzunaJobs(expectedRole, skills, preferredLocation) {
  try {
    // Map location to Adzuna country codes
    const locationMap = {
      'india': 'in',
      'mumbai': 'in',
      'bangalore': 'in',
      'delhi': 'in',
      'hyderabad': 'in',
      'chennai': 'in',
      'pune': 'in',
      'kolkata': 'in',
      'usa': 'us',
      'uk': 'gb',
      'canada': 'ca',
      'australia': 'au'
    }
    
    const countryCode = locationMap[preferredLocation.toLowerCase()] || 'in'
    return await fetchJobs(expectedRole, skills, countryCode)
  } catch (error) {
    console.error('Adzuna API failed:', error)
    return []
  }
}

async function fetchJSearchJobs(expectedRole, skills, preferredLocation) {
  try {
    return await fetchJobsWithJSearch(expectedRole, skills, preferredLocation)
  } catch (error) {
    console.error('JSearch API failed:', error)
    return []
  }
}

async function fetchMuseJobs(expectedRole, skills, preferredLocation) {
  try {
    const query = encodeURIComponent(`${expectedRole} ${skills.slice(0, 2).join(' ')}`)
    const response = await fetch(`${MUSE_API_URL}?category=Engineering&location=India&page=0&descending=true&api_key=public`)
    
    if (!response.ok) {
      throw new Error('Muse API failed')
    }

    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      return []
    }

    return data.results.map(job => ({
      id: job.id.toString(),
      title: job.name,
      company: job.company.name,
      location: job.locations?.[0]?.name || 'India',
      description: job.contents || 'No description available',
      salary: 'Competitive salary',
      url: job.refs.landing_page,
      created: job.publication_date,
      source: 'The Muse'
    })).slice(0, 10)

  } catch (error) {
    console.error('Muse API failed:', error)
    return []
  }
}

function removeDuplicateJobs(jobs) {
  const seen = new Set()
  return jobs.filter(job => {
    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function getComprehensiveMockJobs(expectedRole, skills, preferredLocation = 'India') {
  // Location-specific job data
  const locationJobs = {
    'bangalore': [
      { company: 'Infosys Limited', location: 'Bangalore, Karnataka', salary: '₹15,00,000 - ₹25,00,000' },
      { company: 'Flipkart', location: 'Bangalore, Karnataka', salary: '₹20,00,000 - ₹35,00,000' },
      { company: 'Swiggy', location: 'Bangalore, Karnataka', salary: '₹18,00,000 - ₹30,00,000' }
    ],
    'mumbai': [
      { company: 'Reliance Jio', location: 'Mumbai, Maharashtra', salary: '₹18,00,000 - ₹28,00,000' },
      { company: 'Nykaa', location: 'Mumbai, Maharashtra', salary: '₹16,00,000 - ₹26,00,000' },
      { company: 'Paytm', location: 'Mumbai, Maharashtra', salary: '₹17,00,000 - ₹27,00,000' }
    ],
    'delhi': [
      { company: 'Zomato', location: 'Gurgaon, Haryana', salary: '₹16,00,000 - ₹25,00,000' },
      { company: 'PolicyBazaar', location: 'Gurgaon, Haryana', salary: '₹15,00,000 - ₹24,00,000' },
      { company: 'MakeMyTrip', location: 'Gurgaon, Haryana', salary: '₹17,00,000 - ₹26,00,000' }
    ],
    'hyderabad': [
      { company: 'Microsoft India', location: 'Hyderabad, Telangana', salary: '₹25,00,000 - ₹45,00,000' },
      { company: 'Amazon India', location: 'Hyderabad, Telangana', salary: '₹22,00,000 - ₹40,00,000' },
      { company: 'Google India', location: 'Hyderabad, Telangana', salary: '₹30,00,000 - ₹50,00,000' }
    ],
    'remote': [
      { company: 'GitLab', location: 'Remote, India', salary: '₹25,00,000 - ₹40,00,000' },
      { company: 'Buffer', location: 'Remote, India', salary: '₹20,00,000 - ₹35,00,000' },
      { company: 'Automattic', location: 'Remote, India', salary: '₹22,00,000 - ₹38,00,000' }
    ]
  }

  const defaultJobs = [
    { company: 'Tech Mahindra', location: 'Pune, Maharashtra', salary: '₹12,00,000 - ₹20,00,000' },
    { company: 'HCL Technologies', location: 'Chennai, Tamil Nadu', salary: '₹14,00,000 - ₹22,00,000' },
    { company: 'Wipro Technologies', location: 'Bangalore, Karnataka', salary: '₹13,00,000 - ₹21,00,000' }
  ]

  const jobs = locationJobs[preferredLocation.toLowerCase()] || defaultJobs

  return jobs.map((jobData, index) => ({
    id: `comprehensive-${index + 1}`,
    title: `${expectedRole} - ${preferredLocation}`,
    company: jobData.company,
    location: jobData.location,
    description: `${expectedRole} role at ${jobData.company} in ${preferredLocation}. Skills: ${skills.slice(0, 3).join(', ')}. Excellent growth opportunities.`,
    salary: jobData.salary,
    url: '#',
    created: new Date().toISOString(),
    source: 'Mock Data - Location Specific'
  }))
}
