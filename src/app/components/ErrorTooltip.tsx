
export default function ErrorTooltip({errorText}: {errorText: string}) {
    return (
        <div className="bg-primary pl-6 py-1 text-base w-full 
            duration-100 ease-out
        ">
            {errorText}
        </div>
    );
}