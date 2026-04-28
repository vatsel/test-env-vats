

type Props = {
    hasDottedTopBorder?: boolean;
    className?: string;
}

export default function StyledGapColumn({hasDottedTopBorder, className}: Props) {
    
    return (
        <div 
            className={`h-full border-l border-r border-ui-detail
                ${hasDottedTopBorder ? 'dotted-line h-full' : '' }
                ${className}
            `} 
        >
        
        </div>
    )
}