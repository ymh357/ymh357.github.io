interface ChineseDoubleLuckProps {
    size?: number
    className?: string
}

export default function ChineseDoubleLuck({ size = 80, className = "" }: ChineseDoubleLuckProps) {
    return (
        <div
            className={`flex items-center justify-center ${className}`}
            style={{ width: size, height: size, margin: "0 auto" }}
        >
            <div
                className="bg-red-600 text-yellow-300 flex items-center justify-center rounded-full border-4 border-yellow-400"
                style={{
                    width: size,
                    height: size,
                    fontSize: size * 0.6,
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
                }}
            >
                囍
            </div>
        </div>
    )
}

