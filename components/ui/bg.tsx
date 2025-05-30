{/* Granular Background Effect */ }
export default function Bg() {
    return (
        <div className="fixed inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-orange-900/10"></div>
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0),
      radial-gradient(circle at 20px 20px, rgba(239,68,68,0.1) 1px, transparent 0),
      radial-gradient(circle at 40px 40px, rgba(249,115,22,0.1) 1px, transparent 0)
    `,
                    backgroundSize: "50px 50px, 100px 100px, 150px 150px",
                }}
            ></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-red-900/5 to-transparent"></div>
        </div>
    )
}