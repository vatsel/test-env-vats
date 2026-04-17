import DashedBorder from "./DashedBorder";

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
        <DashedBorder className={disabled ? 'border-color-tertiary' : '' }>
            <button
                tabIndex={disabled ? -1 : 0}
                onClick={onClick}
                disabled={disabled}
                aria-label={ariaLabel}
                type={isSubmitBtn ? 'submit' : 'button'}
                className={`relative flex items-center justify-center size-11
                    duration-100 ease-out
                    outline-none 
                    disabled:text-tertiary disabled:border-ui-detail
                    disabled:hover:bg-transparent
                    ${invert 
                        ? `text-foundation border-foundation bg-primary 
                        hover:bg-foundation hover:text-primary`
                        : `text-primary border-primary bg-foundation 
                        hover:bg-primary hover:text-foundation` 
                    }
                `}
            >
                {children}
            </button>
        </DashedBorder>
    )

}