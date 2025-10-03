// Multi-API job service for comprehensive job coverage
import { fetchJobs } from './jobService.js'
import { fetchJobsWithJSearch } from './jsearchService.js'
import { fetchLinkedInJobs } from './linkedinService.js'
import { fetchIndeedJobs } from './indeedService.js'
import { fetchNaukriJobs } from './naukriService.js'
import { fetchMonsterJobs, fetchGlassdoorJobs, fetchAngelListJobs, fetchDiceJobs } from './additionalJobsService.js'

// The Muse API - No auth required
const MUSE_API_URL = 'https://www.themuse.com/api/public/jobs'

export async function fetchJobsFromMultipleSources(expectedRole, skills, preferredLocation = 'India') {
  console.log(`🔍 Fetching jobs from ALL major job sources for location: ${preferredLocation}...`)
  console.log(`🎯 Role: ${expectedRole}, Skills: ${skills.slice(0, 3).join(', ')}`)
  
  const jobPromises = [
    // Major job boards
    fetchAdzunaJobs(expectedRole, skills, preferredLocation),
    fetchJSearchJobs(expectedRole, skills, preferredLocation),
    fetchLinkedInJobsWrapper(expectedRole, skills, preferredLocation),
    fetchIndeedJobsWrapper(expectedRole, skills, preferredLocation),
    fetchNaukriJobsWrapper(expectedRole, skills, preferredLocation),
    
    // Additional sources
    fetchMuseJobs(expectedRole, skills, preferredLocation),
    fetchMonsterJobsWrapper(expectedRole, skills, preferredLocation),
    fetchGlassdoorJobsWrapper(expectedRole, skills, preferredLocation),
    fetchAngelListJobsWrapper(expectedRole, skills, preferredLocation),
    fetchDiceJobsWrapper(expectedRole, skills, preferredLocation)
  ]

  try {
    const results = await Promise.allSettled(jobPromises)
    
    let allJobs = []
    
    results.forEach((result, index) => {
      const sources = [
        'Adzuna', 'JSearch', 'LinkedIn', 'Indeed', 'Naukri.com', 
        'The Muse', 'Monster', 'Glassdoor', 'AngelList', 'Dice'
      ]
      const source = sources[index]
      
      if (result.status === 'fulfilled') {
        if (result.value.length > 0) {
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
          console.log(`⚠️ ${source}: API succeeded but returned 0 jobs`)
        }
      } else {
        console.log(`❌ ${source}: API failed`)
        console.log(`   Error:`, result.reason)
      }
    })

    // Remove duplicates based on title and company
    const uniqueJobs = removeDuplicateJobs(allJobs)
    
    if (uniqueJobs.length === 0) {
      console.log('📝 No jobs found from any APIs')
      return []
    }

    console.log(`🎯 Total unique jobs found: ${uniqueJobs.length}`)
    console.log(`📊 Job distribution by source:`)
    
    // Count jobs by source
    const sourceCount = {}
    uniqueJobs.forEach(job => {
      sourceCount[job.source] = (sourceCount[job.source] || 0) + 1
    })
    
    Object.entries(sourceCount).forEach(([source, count]) => {
      console.log(`   ${source}: ${count} jobs`)
    })
    
    return uniqueJobs.slice(0, 50) // Increased limit for more comprehensive results

  } catch (error) {
    console.error('Error fetching from multiple sources:', error)
    return []
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
    const jobs = await fetchJobs(expectedRole, skills, countryCode)
    console.log(`✅ Adzuna returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ Adzuna API failed:', error)
    return []
  }
}

async function fetchJSearchJobs(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchJobsWithJSearch(expectedRole, skills, preferredLocation)
    console.log(`✅ JSearch returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ JSearch API failed:', error)
    return []
  }
}

async function fetchMuseJobs(expectedRole, skills, preferredLocation) {
  try {
    console.log('🎭 Attempting to fetch from The Muse API...')
    const query = encodeURIComponent(`${expectedRole} ${skills.slice(0, 2).join(' ')}`)
    
    // Try the public API endpoint without authentication first
    const response = await fetch(`${MUSE_API_URL}?category=Engineering&location=${encodeURIComponent(preferredLocation)}&page=0&descending=true`)
    
    console.log('🎭 Muse API Response Status:', response.status, response.statusText)
    
    if (!response.ok) {
      console.log('⚠️ Muse API failed, skipping this source')
      return []
    }

    const data = await response.json()
    console.log('🎭 Muse API Response:', {
      results_count: data.results ? data.results.length : 0,
      page_count: data.page_count,
      total: data.total
    })
    
    if (!data.results || data.results.length === 0) {
      console.log('⚠️ No jobs found from Muse API')
      return []
    }

    console.log(`✅ Muse found ${data.results.length} jobs, processing...`)
    return data.results.map(job => ({
      id: job.id.toString(),
      title: job.name,
      company: job.company.name,
      location: job.locations?.[0]?.name || preferredLocation,
      description: job.contents || 'No description available',
      salary: 'Competitive salary',
      url: job.refs.landing_page,
      created: job.publication_date,
      source: 'The Muse'
    })).slice(0, 10)

  } catch (error) {
    console.error('❌ Muse API failed:', error)
    return []
  }
}

// Wrapper functions for new job services
async function fetchLinkedInJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchLinkedInJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ LinkedIn returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ LinkedIn API failed:', error)
    return []
  }
}

async function fetchIndeedJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchIndeedJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ Indeed returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ Indeed API failed:', error)
    return []
  }
}

async function fetchNaukriJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchNaukriJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ Naukri returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ Naukri API failed:', error)
    return []
  }
}

async function fetchMonsterJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchMonsterJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ Monster returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ Monster API failed:', error)
    return []
  }
}

async function fetchGlassdoorJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchGlassdoorJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ Glassdoor returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ Glassdoor API failed:', error)
    return []
  }
}

async function fetchAngelListJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchAngelListJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ AngelList returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ AngelList API failed:', error)
    return []
  }
}

async function fetchDiceJobsWrapper(expectedRole, skills, preferredLocation) {
  try {
    const jobs = await fetchDiceJobs(expectedRole, skills, preferredLocation)
    console.log(`✅ Dice returned ${jobs.length} real jobs`)
    return jobs
  } catch (error) {
    console.error('❌ Dice API failed:', error)
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
    url: 'https://careers.example.com/',
    created: new Date().toISOString(),
    source: 'Mock Data - Location Specific'
  }))
}
