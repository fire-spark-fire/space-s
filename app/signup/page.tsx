import SignupForm from './SignupForm'
import SimpleNavigation from '@/components/SimpleNavigation'
import Footer from '@/components/Footer'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <SimpleNavigation />
      
      {/* Main Content */}
      <div className="pt-20"> {/* Add padding top to account for fixed header */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                加入 Spark 大家庭
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                分享你的故事，连接志同道合的伙伴
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
