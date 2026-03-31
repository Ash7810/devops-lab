'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [user, setUser] = useState(null)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    name: '' 
  })
  const [profileForm, setProfileForm] = useState({
    age: '',
    weight: '',
    height: '',
    goals: [],
    preferences: '',
    healthConditions: ''
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(response.data)
        setIsAuthenticated(true)
        
        // Check if profile is complete
        if (!response.data.profile?.age) {
          setShowProfileSetup(true)
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      localStorage.removeItem('token')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, loginForm)
      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
      setShowLogin(false)
      checkAuth()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Login failed')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, signupForm)
      localStorage.setItem('token', response.data.token)
      setIsAuthenticated(true)
      setShowSignup(false)
      setShowProfileSetup(true)
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Signup failed')
    }
  }

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        profileForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setShowProfileSetup(false)
      router.push('/dashboard')
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Profile setup failed')
    }
  }

  if (showProfileSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Profile</h2>
          <form onSubmit={handleProfileSetup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                required
                value={profileForm.age}
                onChange={(e) => setProfileForm({...profileForm, age: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                required
                value={profileForm.weight}
                onChange={(e) => setProfileForm({...profileForm, weight: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                required
                value={profileForm.height}
                onChange={(e) => setProfileForm({...profileForm, height: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goals</label>
              <div className="space-y-2">
                {['Fat Loss', 'Muscle Gain', 'Endurance', 'Strength', 'General Fitness'].map(goal => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileForm.goals.includes(goal)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfileForm({...profileForm, goals: [...profileForm.goals, goal]})
                        } else {
                          setProfileForm({...profileForm, goals: profileForm.goals.filter(g => g !== goal)})
                        }
                      }}
                      className="mr-2"
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
              <textarea
                value={profileForm.preferences}
                onChange={(e) => setProfileForm({...profileForm, preferences: e.target.value})}
                placeholder="e.g., Vegetarian, No dairy, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health Conditions (optional)</label>
              <textarea
                value={profileForm.healthConditions}
                onChange={(e) => setProfileForm({...profileForm, healthConditions: e.target.value})}
                placeholder="Any health conditions we should be aware of..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Complete Setup
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-primary-600">💪 FitAI</div>
            {!isAuthenticated && (
              <div className="space-x-4">
                <button
                  onClick={() => { setShowLogin(true); setShowSignup(false) }}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600"
                >
                  Login
                </button>
                <button
                  onClick={() => { setShowSignup(true); setShowLogin(false) }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                value={signupForm.name}
                onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={signupForm.email}
                onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={signupForm.password}
                onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Your AI-Powered Fitness Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Personalized diet and workout plans powered by Gemini 2.0 Flash and RAG
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => setShowSignup(true)}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started Free
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold mb-2">Personalized Workouts</h3>
            <p className="text-gray-600">AI-generated exercise plans tailored to your goals, body type, and preferences.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="text-xl font-semibold mb-2">Smart Nutrition Plans</h3>
            <p className="text-gray-600">Customized diet plans with macronutrient balance and calorie tracking.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
            <p className="text-gray-600">The system learns from your feedback and adapts recommendations over time.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
