interface ParentNamesProps {
    groomFather: string
    groomMother: string
    brideFather: string
    brideMother: string
}

export default function ParentNames({ groomFather, groomMother, brideFather, brideMother }: ParentNamesProps) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto text-center">
                <div className="col-span-1 py-2 grid grid-rows-3">
                    <p className="text-red-700 font-medium row-span-2">男方父母</p>
                    <p className="text-red-700 font-medium row-span-1">爱子</p>
                </div>
                <div className="col-span-2 py-2 border-b border-red-300">
                    <p className="text-red-700">
                        {groomFather} <span className="text-sm text-red-500">先生</span>
                    </p>
                    <p className="text-red-700">
                        {groomMother} <span className="text-sm text-red-500">女士</span>
                    </p>
                    <p className="text-red-700">
                        于明昊
                    </p>
                </div>

                <div className="col-span-1 py-2 grid grid-rows-3">
                    <p className="text-red-700 font-medium row-span-2">女方父母</p>
                    <p className="text-red-700 font-medium row-span-1">爱女</p>
                </div>
                <div className="col-span-2 py-2 border-b border-red-300">
                    <p className="text-red-700">
                        {brideFather} <span className="text-sm text-red-500">先生</span>
                    </p>
                    <p className="text-red-700">
                        {brideMother} <span className="text-sm text-red-500">女士</span>
                    </p>
                    <p className="text-red-700">
                        刘宽
                    </p>
                </div>
            </div>
        </div>
    )
}

