import Link from 'next/link'
import SignInForm from '../components/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Sign In</h1>
        <SignInForm />
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-blue-500 hover:text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
} 