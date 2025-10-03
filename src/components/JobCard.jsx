import { motion } from 'framer-motion'
import { MapPin, DollarSign, ExternalLink, Star, Brain } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export default function JobCard({ job, index }) {
  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-orange-500'
  }

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Great Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {job.title}
            </CardTitle>
            <div className="flex items-center space-x-1 ml-2">
              <div className={`w-3 h-3 rounded-full ${getMatchColor(job.matchScore)}`} />
              <span className="text-sm font-medium">{job.matchScore}%</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {job.company}
            </p>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            
            {job.salary && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Badge 
              variant="secondary" 
              className={`w-fit ${getMatchColor(job.matchScore)} text-white`}
            >
              <Star className="w-3 h-3 mr-1" />
              {getMatchLabel(job.matchScore)}
            </Badge>
            {job.aiEnhanced && (
              <Badge variant="outline" className="w-fit border-purple-300 text-purple-600">
                <Brain className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {job.description}
            </p>
            
            {job.overlappingSkills && job.overlappingSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">
                  Matching Skills:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {job.overlappingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {job.missingSkills && job.missingSkills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-orange-600 dark:text-orange-400">
                  Skills to Learn:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {job.missingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-orange-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {job.tips && job.tips.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                  Tips:
                </h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  {job.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Button 
              className="w-full" 
              onClick={() => {
                console.log('🔗 Clicking Apply Now for:', job.title)
                console.log('🔗 Job URL:', job.url)
                console.log('🏢 Job source:', job.source)
                
                // Simple logic: if URL exists and is not just '#', use it directly
                if (job.url && job.url !== '#') {
                  console.log('✅ Opening job URL directly:', job.url)
                  window.open(job.url, '_blank')
                } else {
                  console.log('❌ No valid URL found, this is mock data')
                  alert(`This is demo data for: ${job.company} - ${job.title}\n\nReal jobs from APIs will have direct application links.`)
                }
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
