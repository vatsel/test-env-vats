type Props = {
    children: React.ReactNode;
    disabled: boolean;
    ariaLabel: string;
    onClick?: () => void;
    isSubmitBtn?: boolean;
    invert?: boolean;
}

export default function SquareBtn(
    { disabled, onClick, children, invert, isSubmitBtn, ariaLabel } : Props
){
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            type={isSubmitBtn ? 'submit' : 'button'}
            className={`flex items-center justify-center size-11
                duration-100 ease-out
                outline-none border 
                disabled:text-tertiary disabled:border-ui-detail disabled:hover:bg-transparent
                ${invert 
                    ? `text-foundation border-foundation bg-primary 
                    hover:bg-foundation hover:text-primary focus-within:border-accent`
                    : `text-primary border-primary bg-foundation 
                    hover:bg-primary hover:text-foundation focus-within:border-primary` 
                }

                focus-within:border-2 
            `}
        >
            {children}
        </button>
    )

}