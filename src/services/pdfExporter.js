import jsPDF from 'jspdf'

export async function exportToPDF(jobs, resumeData, expectedRole) {
  try {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    const margin = 20
    let yPosition = margin

    // Title
    pdf.setFontSize(20)
    pdf.setFont(undefined, 'bold')
    pdf.text('AI Job Matcher Results', margin, yPosition)
    yPosition += 15

    // Subtitle
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'normal')
    pdf.text(`Job matches for: ${expectedRole}`, margin, yPosition)
    yPosition += 10
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition)
    yPosition += 20

    // Profile Summary
    pdf.setFontSize(14)
    pdf.setFont(undefined, 'bold')
    pdf.text('Profile Summary', margin, yPosition)
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont(undefined, 'normal')
    pdf.text(`Experience: ${resumeData.experience} years`, margin, yPosition)
    yPosition += 6
    pdf.text(`Education: ${resumeData.hasEducation ? 'Yes' : 'Not specified'}`, margin, yPosition)
    yPosition += 6
    pdf.text(`Skills: ${resumeData.skills.slice(0, 10).join(', ')}`, margin, yPosition, { maxWidth: pageWidth - 2 * margin })
    yPosition += 15

    // Job Matches
    pdf.setFontSize(14)
    pdf.setFont(undefined, 'bold')
    pdf.text('Job Matches', margin, yPosition)
    yPosition += 15

    jobs.forEach((job, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage()
        yPosition = margin
      }

      // Job title and match score
      pdf.setFontSize(12)
      pdf.setFont(undefined, 'bold')
      pdf.text(`${index + 1}. ${job.title}`, margin, yPosition)
      pdf.text(`${job.matchScore}%`, pageWidth - margin - 20, yPosition)
      yPosition += 8

      // Company and location
      pdf.setFontSize(10)
      pdf.setFont(undefined, 'normal')
      pdf.text(`${job.company} - ${job.location}`, margin + 5, yPosition)
      yPosition += 6

      // Salary
      if (job.salary) {
        pdf.text(`Salary: ${job.salary}`, margin + 5, yPosition)
        yPosition += 6
      }

      // Matching skills
      if (job.overlappingSkills && job.overlappingSkills.length > 0) {
        pdf.text(`Matching Skills: ${job.overlappingSkills.join(', ')}`, margin + 5, yPosition, { maxWidth: pageWidth - 2 * margin - 10 })
        yPosition += 6
      }

      // Missing skills
      if (job.missingSkills && job.missingSkills.length > 0) {
        pdf.text(`Skills to Learn: ${job.missingSkills.join(', ')}`, margin + 5, yPosition, { maxWidth: pageWidth - 2 * margin - 10 })
        yPosition += 6
      }

      yPosition += 8
    })

    // Save the PDF
    pdf.save(`job-matches-${expectedRole.replace(/\s+/g, '-').toLowerCase()}.pdf`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    throw new Error('Failed to export PDF')
  }
}
