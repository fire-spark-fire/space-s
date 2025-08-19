import { Star, Heart, Milestone, CheckCheck, Goal, Lightbulb } from "lucide-react"

export default function Introduction() {

    const introductionParts = [
        {
            title: "方向",
            description:
                'Spark 是一个面向青年群体、以“相互成长，彼此支持”为文化核心的去中心化人际连接平台。',
            icon: <Milestone className="w-5 h-5" />,
            color: "from-red-500 to-red-600",
        },
        {
            title: "愿景",
            description:
                "我们希望构建一个彼此照亮的同行者网络，在这个快速变化的时代，为青年个体提供温暖的陪伴、真诚的交流与长久的支持。我们相信，当彼此之间建立起真实而稳定的连接，每一位成员都将更有力量的朝着自己所向往的方向前行。",
            icon: <CheckCheck className="w-5 h-5" />,
            color: "from-orange-500 to-red-500",
        },
        {
            title: "目标",
            description:["搭建松弛且真实的沟通机制，使成员之间产生更多彼此认可与支持",
                "沉淀可被记录与回顾的表达体系，保存成员的关键思考与成长轨迹",
                "构建去中心化自我迭代的运营系统，使 Spark 可以长久稳定的运作"],
            icon: <Goal className="w-5 h-5" />,
            color: "from-red-600 to-orange-600",
        },
        {
            title: "价值",
            description:
                "自我表达的轻松性；关系的相互回应性；内容的存续性；连接的稳定性",
            icon: <Star className="w-5 h-5" />,
            color: "from-orange-600 to-red-700",
        },
        {
            title: "机制",
            description:
                "三层平台架构；多重角色设定；机制工具设计。确保轻连接、深共鸣、高体验。",
            icon: <Heart className="w-5 h-5" />,
            color: "from-red-700 to-orange-500",
        },
        {
            title: "什么人会加入spark",
            description:
                "那些追求持续成长、践行利他精神、具备长远视野、敢于突破自我、保持积极乐观的青年伙伴。",
            icon: <Lightbulb className="w-5 h-5" />,
            color: "from-orange-500 to-red-500",
        }
    ]
    return (
        <section id="introduction" className="py-20 px-4 relative">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
                        什么是Spark
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        关于我们是谁，我们在做什么，以及我们共建的核心价值
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
                                                {Array.isArray(part.description) ? (
                                                    <ul className="text-gray-400 text-2xl leading-relaxed list-disc pl-6 space-y-2">
                                                        {part.description
                                                            .filter((item): item is string => typeof item === "string")
                                                            .map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-400 text-2xl leading-relaxed">{part.description}</p>
                                                )}
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