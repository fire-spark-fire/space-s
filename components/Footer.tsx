import { Flame } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-black/50 border-t border-red-600/20 py-8 px-4 backdrop-blur-sm">
            <div className="container mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <Flame className="w-6 h-6 text-red-500" />
                    <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-wider">
                        SPARK
                    </span>
                </div>
                <p className="text-gray-400">
                    © {new Date().getFullYear()} Spark. 认识更多<span className="text-orange-400 italic mx-1">不平凡</span>的灵魂
                </p>
            </div>
        </footer>
    )
}


