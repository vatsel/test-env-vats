import BorderSvg from "@/assets/rect-borders.svg";

export default function DashedBorder({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <div 
            className={`relative z-20 drawn-border draw-intro ${className}`}
        >
            {children}
            <BorderSvg className="border-svg" />
        </div>
    )
}