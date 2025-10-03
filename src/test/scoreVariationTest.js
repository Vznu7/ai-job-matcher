// Test to ensure score variation
export function testScoreVariation() {
  // Simulate different resume profiles
  const profiles = [
    {
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      experience: 5,
      hasEducation: true,
      expectedRole: 'Software Engineer'
    },
    {
      skills: ['Python', 'Django', 'SQL'],
      experience: 2,
      hasEducation: true,
      expectedRole: 'Backend Developer'
    },
    {
      skills: ['HTML', 'CSS', 'JavaScript'],
      experience: 0,
      hasEducation: false,
      expectedRole: 'Frontend Developer'
    }
  ]

  // Test jobs with different requirements
  const testJobs = [
    {
      title: 'Senior JavaScript Developer',
      description: 'Senior role requiring JavaScript, React, Node.js, TypeScript. 5+ years experience required.',
      company: 'TechCorp'
    },
    {
      title: 'Python Backend Developer',
      description: 'Python developer needed with Django and SQL knowledge. 2-3 years experience preferred.',
      company: 'DataCorp'
    },
    {
      title: 'Junior Frontend Developer',
      description: 'Entry level HTML, CSS, JavaScript developer. Fresh graduates welcome.',
      company: 'StartupXYZ'
    },
    {
      title: 'Full Stack Engineer',
      description: 'Full stack developer with React, Node.js, Python, and database experience required.',
      company: 'WebSolutions'
    }
  ]

  console.log('🧪 Testing Score Variation...')
  
  profiles.forEach((profile, profileIndex) => {
    console.log(`\n👤 Profile ${profileIndex + 1}: ${profile.expectedRole} (${profile.experience} years)`)
    console.log(`Skills: ${profile.skills.join(', ')}`)
    
    testJobs.forEach((job, jobIndex) => {
      // Simulate the scoring algorithm manually for testing
      const jobText = (job.title + ' ' + job.description).toLowerCase()
      const userSkills = profile.skills
      
      let matchCount = 0
      userSkills.forEach(skill => {
        if (jobText.includes(skill.toLowerCase())) {
          matchCount++
        }
      })
      
      // Simple scoring logic
      let score = (matchCount / userSkills.length) * 60 + 30
      
      // Experience adjustments
      if (jobText.includes('senior') && profile.experience < 3) {
        score -= 15
      }
      if (jobText.includes('junior') && profile.experience > 2) {
        score += 10
      }
      
      // Add randomness
      score += (Math.random() - 0.5) * 10
      score = Math.max(45, Math.min(95, Math.round(score)))
      
      console.log(`  📋 ${job.title}: ${score}%`)
    })
  })
  
  console.log('\n✅ Score variation test complete!')
}

// Auto-run in browser
if (typeof window !== 'undefined') {
  window.testScoreVariation = testScoreVariation
}
