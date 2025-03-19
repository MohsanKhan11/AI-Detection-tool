import { Metadata } from 'next'
import Link from 'next/link'
import { getLandingPage } from '@/lib/strapi'

type FeatureCardProps = {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await getLandingPage()
  const seo = landingPage?.data?.seo

  return {
    title: seo?.metaTitle || 'AI Detection Tool',
    description: seo?.metaDescription || 'Detect AI-generated content with our powerful tool',
  }
}

export default async function HomePage() {
  try {
    const landingPage = await getLandingPage()
    
    if (!landingPage?.data) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Content...</h1>
            <p>Please make sure Strapi is running and content is published.</p>
            <pre className="mt-4 text-sm bg-gray-800 p-4 rounded-lg overflow-auto max-w-2xl">
              {JSON.stringify({ error: 'No data received' }, null, 2)}
            </pre>
          </div>
        </div>
      )
    }

    const { hero = {}, features = [] } = landingPage.data

    if (!features || features.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p>Please make sure features are added and published in Strapi.</p>
            <pre className="mt-4 text-sm bg-gray-800 p-4 rounded-lg overflow-auto max-w-2xl">
              {JSON.stringify({ 
                fullResponse: landingPage,
                hero: hero,
                features: features
              }, null, 2)}
            </pre>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end space-x-4">
            <Link 
              href="/auth/signin"
              className="text-gray-300 hover:text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          {/* Hero Section */}
          <div className="text-center relative">
            {/* Gradient orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] -z-10" />
            
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {hero?.title || 'AI Content Detection Tool'}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {hero?.subtitle || 'Instantly analyze your text to determine if it was written by AI or a human.'}
            </p>
            <Link 
              href={hero?.buttonLink || '/detector'}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              {hero?.buttonText || 'Try Detection Tool'}
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features?.map((feature: any, index: number) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in HomePage:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>An error occurred while loading the page.</p>
          <p className="mt-2 text-sm text-gray-400">Error: {error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    )
  }
}
