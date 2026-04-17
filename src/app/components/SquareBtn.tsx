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
                    ? `text-base border-base bg-primary 
                    hover:bg-base hover:text-primary focus-within:border-accent`
                    : `text-primary border-primary bg-base 
                    hover:bg-primary hover:text-base focus-within:border-primary` 
                }

                focus-within:border-2 
            `}
        >
            {children}
        </button>
    )

}