# AI Detection Tool

A modern web application built with Next.js that helps users detect AI-generated content using multiple detection services.

## Features

- User authentication with Supabase
- AI content detection using multiple services
- Real-time detection status updates
- History tracking of previous detections
- Modern, responsive UI with Tailwind CSS

## Technical Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Integration**: Multiple AI detection services
- **Type Safety**: TypeScript

## Application Flow

### Authentication Flow
1. **User Registration/Login**:
   - Email/password authentication using Supabase Auth
   - Real-time session management with AuthProvider
   - Automatic redirect to protected routes after authentication
   - Session persistence across page reloads

2. **Protected Routes**:
   - Middleware-based route protection
   - Authentication state checking using Zustand store
   - Automatic redirection for unauthenticated users

### Detection Flow
1. **Content Submission**:
   - Text input validation and preprocessing
   - Multiple detection service integration
   - Parallel API calls for faster results

2. **Processing**:
   - Real-time status updates using Zustand store
   - Retry mechanism for failed API calls
   - Progress tracking for long-running operations

3. **Results Display**:
   - Aggregated results from multiple services
   - Historical data tracking
   - Export functionality for results

## Technical Decisions

### 1. Next.js App Router
- Chosen for better server-side rendering capabilities
- Improved routing with nested layouts
- Built-in API routes for backend functionality
- Better TypeScript integration

### 2. Supabase Integration
- **Authentication**:
  ```typescript
  // Authentication store setup
  interface AuthState {
    user: User | null
    isAuthenticated: boolean
  }
  
  // Real-time session management
  const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
      supabase.auth.onAuthStateChange((event, session) => {
        // Handle auth state changes
      })
    }, [])
  }
  ```

### 3. State Management with Zustand
- Chosen for its simplicity and performance
- Separate stores for different concerns:
  ```typescript
  // Detection store example
  interface DetectionState {
    detections: Detection[]
    status: 'idle' | 'processing' | 'complete'
    currentDetection: Detection | null
  }
  ```

### 4. API Integration Architecture
- **Multiple Service Integration**:
  ```typescript
  // Service abstraction
  interface DetectionService {
    detect(text: string): Promise<DetectionResult>
    retry(id: string): Promise<DetectionResult>
  }
  
  // Implementation example
  class UndetectableAIService implements DetectionService {
    async detect(text: string) {
      // Service-specific implementation
    }
  }
  ```

## Implementation Details

### 1. Authentication Implementation
- Middleware-based route protection
- Session management using Supabase client
- Custom hooks for auth state management
```typescript
// Auth middleware
export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}
```

### 2. Detection Service Integration
- Retry mechanism with exponential backoff
- Result caching for performance
- Error handling and recovery
```typescript
// Retry mechanism
const detectWithRetry = async (text: string, attempts = 3) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await detectService.detect(text)
    } catch (error) {
      if (i === attempts - 1) throw error
      await delay(Math.pow(2, i) * 1000)
    }
  }
}
```

### 3. Database Schema
```sql
-- Detections table
CREATE TABLE detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Performance Optimizations

1. **Client-Side Performance**:
   - Lazy loading of components
   - Optimized re-renders with React.memo
   - Debounced API calls

2. **API Performance**:
   - Result caching
   - Parallel API calls
   - Connection pooling for database

## Error Handling

1. **User-Facing Errors**:
   - Friendly error messages
   - Automatic retry for transient failures
   - Offline support

2. **System Errors**:
   - Error boundary implementation
   - Logging and monitoring
   - Graceful degradation

## Prerequisites

Before you begin, ensure you have:
- Node.js 18.x or later
- npm or yarn package manager
- A Supabase account
- Required API keys for AI detection services

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-detection-tool
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
NEXT_STRAPI_URL=your_strapi_url
STRAPI_API_TOKEN=your_strapi_token
NEXT_UNDETECTABLE_API_URL=your_undetectable_api_url
UNDETECTABLE_API_KEY=your_undetectable_api_key
NEXT_SITE_URL=http://localhost:3000
NEXT_MAX_DETECTION_ATTEMPTS=10
NEXT_DETECTION_DELAY_MS=1000
```

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-detection-tool/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/         # Reusable UI components
│   ├── lib/               # Utility functions and configurations
│   ├── providers/         # Context providers
│   └── store/             # Zustand state management
├── public/               # Static assets
└── types/               # TypeScript type definitions
```

## Key Integrations

### 1. Supabase Authentication
- Implemented using `@supabase/auth-helpers-nextjs`
- Real-time session management with `AuthProvider`
- Protected routes using middleware
- Email/password authentication flow

### 2. AI Detection Services
- Multiple API integrations for reliable detection
- Retry mechanism for failed attempts
- Real-time status updates
- Result caching and history tracking

### 3. State Management
- Zustand store for global state
- Separate stores for authentication and detection states
- Persistent storage for user preferences

## Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `git push` to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details
