type Props = {
    children: React.ReactNode;
    disabled: boolean;
    onClick?: () => void;
    isSubmitBtn?: boolean;
}

export default function SquareBtn({ disabled, onClick, children, isSubmitBtn } : Props){
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type={isSubmitBtn ? 'submit' : 'button'}
            className={`flex items-center justify-center size-11
                duration-100 ease-out
                outline-none
                bg-base border
                ${disabled 
                    ? 'text-tertiary border-ui-detail' 
                    : 'text-primary border-primary' }

                hover:bg-primary hover:text-base
                focus-within:border-2 focus-within:border-primary
            `}
        >
            {children}
        </button>
    )

}