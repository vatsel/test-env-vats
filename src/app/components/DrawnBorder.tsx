import BorderSvg from "@/assets/rect-borders.svg";

export default function DrawnBorder({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <div 
            className={`relative z-20 drawn-rect-border draw-intro ${className}`}
        >
            {children}
            <BorderSvg className="border-svg" />
        </div>
    )
}