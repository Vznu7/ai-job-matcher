import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, User, Briefcase, Award, TrendingUp } from 'lucide-react'
import Logo from './Logo'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import JobCard from './JobCard'
import { exportToPDF } from '../services/pdfExporter'

export default function Dashboard({ resumeData, jobs, expectedRole, onBack }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportToPDF(jobs, resumeData, expectedRole)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const averageMatch = jobs.length > 0 
    ? Math.round(jobs.reduce((sum, job) => sum + job.matchScore, 0) / jobs.length)
    : 0

  const topSkills = resumeData.skills.slice(0, 8)
  const allMissingSkills = [...new Set(jobs.flatMap(job => job.missingSkills || []))].slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Logo size="small" variant="compact" />
              <Button 
                variant="ghost" 
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Job Matches for {expectedRole}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Found {jobs.length} relevant positions
            </p>
          </div>
          
          <Button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="mt-4 md:mt-0"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Resume Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="w-5 h-5 mr-2" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Experience</span>
                      <Badge variant="outline">
                        {resumeData.experience} years
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Education</span>
                      <Badge variant={resumeData.hasEducation ? "default" : "outline"}>
                        {resumeData.hasEducation ? "Yes" : "Not specified"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg. Match</span>
                      <Badge variant="secondary">
                        {averageMatch}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Award className="w-5 h-5 mr-2" />
                    Your Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map((skill, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {allMissingSkills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-orange-600 dark:text-orange-400">
                        Skills to Learn:
                      </h4>
                      <div className="space-y-1">
                        {allMissingSkills.map((skill, index) => (
                          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                            • {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                      General Tips:
                    </h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div>• Tailor your resume for each application</div>
                      <div>• Highlight relevant project experience</div>
                      <div>• Consider remote opportunities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-6">
              <Briefcase className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">Job Matches</h2>
            </div>
            
            {jobs.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    No job matches found. Try adjusting your search criteria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <motion.div 
                className="grid md:grid-cols-2 xl:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {jobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
