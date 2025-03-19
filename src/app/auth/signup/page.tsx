import Link from 'next/link'
import SignUpForm from '../components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Create Account</h1>
        <SignUpForm />
        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 