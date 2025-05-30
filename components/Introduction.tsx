import { FileText, Star, Globe, MapPin, Heart } from "lucide-react"

export default function Introduction() {

    const introductionParts = [
        {
            title: "Start",
            description:
                "Begin your journey with Spark and discover your potential to create meaningful impact in the world.",
            icon: <Star className="w-5 h-5" />,
            color: "from-red-500 to-red-600",
        },
        {
            title: "Programs",
            description:
                "Comprehensive training programs designed to fuel your growth and expertise in cutting-edge technologies.",
            icon: <FileText className="w-5 h-5" />,
            color: "from-orange-500 to-red-500",
        },
        {
            title: "Online Events",
            description:
                "Virtual gatherings that connect minds and spark collaborative innovation across global communities.",
            icon: <Globe className="w-5 h-5" />,
            color: "from-red-600 to-orange-600",
        },
        {
            title: "In-Site Events",
            description:
                "Physical meetups and workshops that bring the community together for hands-on learning experiences.",
            icon: <MapPin className="w-5 h-5" />,
            color: "from-orange-600 to-red-700",
        },
        {
            title: "Influence",
            description:
                "Building emotional connections and meaningful relationships within our passionate community of innovators.",
            icon: <Heart className="w-5 h-5" />,
            color: "from-red-700 to-orange-500",
        },
    ]
    return (
        <section id="introduction" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                        INTRODUCTION
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Discover the five pillars that make Spark a transformative force in innovation and community building.
                    </p>
                </div>

                <div className="relative">
                    {/* Stacked Layout */}
                    <div className="space-y-6">
                        {introductionParts.map((part, index) => (
                            <div
                                key={index}
                                className={`relative group transition-all duration-500 hover:scale-[1.02] ${index % 2 === 0 ? "ml-0 md:ml-12" : "ml-0 md:ml-24"
                                    }`}
                                style={{
                                    transform: `translateY(${index * -10}px)`,
                                    zIndex: introductionParts.length - index,
                                }}
                            >
                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-red-500/20 hover:border-orange-500/40 transition-all duration-300">
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                                        style={{
                                            background: `linear-gradient(135deg, ${part.color.split(" ")[1]}, ${part.color.split(" ")[3]})`,
                                        }}
                                    ></div>

                                    <div className="relative p-8 md:p-12">
                                        <div className="flex items-start space-x-6">
                                            <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${part.color} shadow-lg`}>
                                                <div className="text-white">{part.icon}</div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
                                                    {part.title.toUpperCase()}
                                                </h3>
                                                <p className="text-gray-300 text-lg leading-relaxed">{part.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-tr-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Connecting Lines */}
                    <div className="absolute left-8 top-20 bottom-20 w-0.5 bg-gradient-to-b from-red-500/50 via-orange-500/50 to-red-500/50 hidden md:block"></div>
                </div>
            </div>
        </section>

    )
}