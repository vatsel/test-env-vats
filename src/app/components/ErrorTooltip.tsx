
export default function ErrorTooltip({errorText}: {errorText: string}) {
    return (
        <div className={`w-full pl-6 py-1 
            text-foundation bg-primary 
            duration-100 ease-out
        `}>
            {errorText}
        </div>
    );
}