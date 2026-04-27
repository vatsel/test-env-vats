"use client"; //  use client since data can't be updated on the server and data is stored in state

import { Fragment, useState } from "react";
import { flattenError } from "zod/v4/core";


import { ApiResponse, EnvironmentVariable, SortOption } from "../models";
import EnvironmentVariableField from "./EnvironmentVariableField";
import { EnvVarSchema } from "../schema";
import StyledGapColumn from "./StyledGapColumn";
import AddNewEnvVariableForm from "./AddNewEnvVariableForm";
import { getUpdatedOrCreatedAt, wait } from "../utils";
import { SORT_OPTIONS } from "../constants";
import SearchFilterBar from "./SearchFilterBar";


import EvervaultSvg from "@/assets/evervault-icon-white.svg"

type EnvVarState = {
    id: string; // for deduplication. in production we'll get something from the server 
    name: string;
    value: string;
    createdAt: Date;
    lastUpdated: Date | null;
}



export default function EnvironmentVariableEditor({initialVars} : {initialVars: EnvironmentVariable[]}) {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<SortOption>(SORT_OPTIONS[0]);

    // forced to use state here 
    const [envVarsState, setEnvVarsState] = useState<EnvVarState[]>(
        initialVars.map((envVar) => ({
            id: crypto.randomUUID(), // crypto.randomUUID() should be very fast for our test purposes
            name: envVar.name, 
            value: envVar.value,
            createdAt: envVar.createdAt,
            lastUpdated: envVar.lastUpdated
        })) 
    );

    const checkInput = async (
        name: string, 
        value: string,
        id: string 
    ): Promise<ApiResponse> =>  {
        const parseResult = EnvVarSchema.safeParse({name, value});
        if (!parseResult.success){
            const errors = flattenError(parseResult.error);
            return { success: false, errors: errors };
        }

        const { name: parsedName } = parseResult.data;
        if (envVarsState.some((val) => val.id !== id && val.name === parsedName)){
            return { success: false, errors: {formErrors : [], fieldErrors: {name: ['name must be unique']} } };
        }


        return { success: true };

    }

    const handleDelete = async (id: string): Promise<ApiResponse> => {
        
        try {
            await wait(1);
            
            setEnvVarsState((prev) => prev.filter((val) => val.id !== id));
            return { success: true };

        } catch (err) {
            const message = err instanceof(Error) ? err.message : String(err);
            return { success: false, errors: { formErrors: [message], fieldErrors: {}} };

        } 

    };

    const handleAdd = async (name: string, value: string): Promise<ApiResponse> => {
        const newId = crypto.randomUUID();
        const checkResult = await checkInput(name, value, newId);
        if (!checkResult.success){
            return { success: false, errors: checkResult.errors };
        }

        try {
            await wait(1);

            setEnvVarsState((prev) => [
                ...prev, 
                { id: newId, name, value, createdAt: new Date(Date.now()), lastUpdated: null  }
            ]);

            return { success: true };

        } catch (err) {
            const message = err instanceof(Error) ? err.message : String(err);
            return { success: false, errors: {formErrors: [message], fieldErrors: {}}};
        }

    };

    const handleUpdate = async (id: string, name: string, value: string): Promise<ApiResponse> => {
        const checkResult = await checkInput(name, value, id);
        if (!checkResult.success){
            return { success: false, errors: checkResult.errors };
        }
        
        try {
            await wait(1);

            setEnvVarsState((prev) => [
                ...prev.filter((val) => val.id !== id),
                { id: crypto.randomUUID(), name, value, createdAt: new Date(Date.now()), lastUpdated: null }
            ]);
            
            return { success: true };

        } catch (err) {
            const message = err instanceof(Error) ? err.message : String(err);
            return { success: false, errors: {formErrors: [message], fieldErrors: {}}};
        }

    };

    const filteredEnvVars = envVarsState.filter((envVar) => 
        envVar.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedEnvVars = filteredEnvVars.toSorted((a, b) => {
        if (sortOption === 'Last Updated') {
            return getUpdatedOrCreatedAt(b).getTime() - getUpdatedOrCreatedAt(a).getTime();
        } else if (sortOption === 'Name A-Z') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'Name Z-A') {
            return b.name.localeCompare(a.name);
        } else {
            console.error(`Unknown sort option ${sortOption}`);
            return 0;
        }
 
    });

    // in the content row,
    // the last row needs to be auto size so the rest of the divider line will be drawn
    // calculate the number of rows below:

    // start with 2 rows for the 'Search & Sort' row and its spacer
    let numContentRows = 2;
    if (sortedEnvVars.length === 0) {
        numContentRows += 2; // add result row and spacer for "no results found"
    } else {
        // add len of vars * 2, as there's a spacer row for each
        numContentRows += sortedEnvVars.length * 2;
    }
    if (!searchQuery) {
        // +2 for the 'Add env variable' button and its spacer row above 
        numContentRows += 2; 
    }

    return (
        <div 
            className={` grid min-h-screen 
                
                grid-cols-[10vw_11px_1fr_11px_6vw]
                sm:grid-cols-[18vw_11px_1fr_11px_12vw]
                lg:grid-cols-[12vw_11px_1fr_11px_2.3fr_11px_3vw]
                xl:grid-cols-[16.5vw_11px_1fr_11px_2.3fr_11px_10.5vw]

                grid-rows-[30vh_minmax(67vh,auto)_10vh] 
                xl:grid-rows-[30vh_minmax(60vh,auto)_10vh] 
            `}
        >

            {/* -----  LOGO & HEADER: ROW 1 ------   */}

            {/* COL: logo  & spacer*/}
            <div className="flex justify-end items-end">
                <EvervaultSvg className={`
                    hidden sm:inline
                    size-14 md:size-16 mb-2
                    text-accent object-contain 
                    draw-evervault-svg-logo 
                `} />
                <BlackArrow direction="bottomRight" />
            </div>

            <StyledGapColumn className="animate-draw-bottom-to-top" />

            <div className="flex flex-col lg:flex-row justify-end lg:items-end ">
                <h1 
                    className={`font-outline-geist font-semibold tracking-tighter
                        text-5xl sm:text-6xl xl:text-7xl 
                        lg:pb-1 pl-2.5 lg:pl-3 pr-3`}
                >
                    Environment
                </h1>
                <div className="flex ">
                    <SecondHeadline className="lg:hidden" />
                    <EvervaultSvg className={`
                        inline sm:hidden
                        ml-7
                        size-12
                        text-accent object-contain 
                        draw-evervault-svg-logo 
                        `} />
                </div>
                <BlackArrow direction="bottomRight" placeOnRight />
            </div>
            
            <StyledGapColumn className="animate-draw-bottom-to-top [animation-delay:0.4s]" />

            <div className="hidden lg:flex items-end ">
                <SecondHeadline />
                <BlackArrow direction="bottomRight" placeOnRight />
            </div>

            <StyledGapColumn className="hidden lg:block animate-draw-bottom-to-top" />
                    
            <div  /> {/* COL: right spacer  */}



            {/* -----  CONTENT: ROW 2 ------   */}

            {/* COL: left spacer  */}
            <div className="relative bg-off-white" >
                <div className="h-full dotted-line animate-draw-right-to-left" />
                <BlackArrow direction="bottomRight" absolutePosition />
            </div>

            {/* COL: gap  */}
            <StyledGapColumn hasDottedTopBorder className="bg-off-white" />
            
            {/* COMBINED COLS block: List of env vars */}
            <div 
                className={`flex flex-col
                    lg:grid lg:col-span-3 lg:grid-cols-subgrid lg:content-start 
                     bg-off-white
                    font-mono-geist`}
                style={{
                    gridTemplateRows: `repeat(${numContentRows}, auto) minmax(26px,1fr)`,
                }}
            >

                {/* First subgrid row spacer + arrow */}
                <div className="relative min-h-6 lg:grid lg:grid-cols-subgrid lg:col-span-3">
                    <BlackArrow direction="topLeft" absolutePosition />
                    <div className="h-full dotted-line animate-draw-left-to-right " />
                    <StyledGapColumn className="hidden lg:block" hasDottedTopBorder />
                    <div className="hidden lg:block relative h-full dotted-line animate-draw-right-to-left">
                        <BlackArrow direction="topLeft" absolutePosition />
                    </div>
                </div>


                {/* Search & Sort */}
                <div className={` text-[12px] font-medium
                    lg:grid lg:grid-cols-subgrid lg:col-span-3`}>
                    <SearchFilterBar 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                    />
                    <StyledGapColumn className="hidden lg:block" />
                </div>

                {filteredEnvVars.length === 0 &&
                    <>
                        {/* Spacer row */}
                        <div className="lg:grid lg:grid-cols-subgrid lg:col-span-3 text-[12px]">
                            <div className="h-gridgap" />
                            <StyledGapColumn className="hidden lg:block" />
                        </div>

                        <div className="lg:grid lg:grid-cols-subgrid lg:col-span-3 text-[12px]">
                            <div className={`flex min-h-11 items-start px-6 py-3
                                min-w-0 wrap-anywhere text-tertiary
                                font-sans font-medium tracking-normal`} 
                            >
                                { searchQuery
                                    ? `No results for "${searchQuery}"`
                                    : 'No environment variables yet - Add one below'
                                }
                            </div>
                            <StyledGapColumn className="hidden lg:block" />
                        </div>
                    </>
                }

                {sortedEnvVars.map((envVar) => (
                    <Fragment key={`envVar_frag_${envVar.id}`} >

                        {/* Spacer row */}
                        <div
                            className="lg:grid lg:grid-cols-subgrid lg:col-span-3 h-3.5 lg:h-gridgap shrink-0" 
                            key={`envVar_spacer_${envVar.id}`}
                        >
                            <div />
                            <StyledGapColumn className="hidden lg:block" />
                        </div>

                        {/* field row */}
                        <EnvironmentVariableField 
                            envVar={envVar} 
                            key={`envVar_el_${envVar.id}`}
                            onUpdate={(newName, newValue) => handleUpdate(envVar.id, newName, newValue)}  
                            onDelete={() => handleDelete(envVar.id)}
                        />
                    </Fragment>
                ))}

                {/* Add new variable + spacer row */}
                {!searchQuery && 
                    <>
                        <div className="lg:grid lg:grid-cols-subgrid lg:col-span-3">
                            <div className="h-gridgap" />
                            <StyledGapColumn className="hidden lg:block" />
                        </div>

                        <AddNewEnvVariableForm handleAdd={handleAdd} />
                    </>
                }
                
                {/* Last spacer row */}
                <div className={`flex h-full items-end justify-end 
                    lg:grid lg:grid-cols-subgrid lg:col-span-3`}>
                    <div className="relative min-h-5 " >
                        <BlackArrow direction="bottomRight" absolutePosition />
                    </div>
                    <StyledGapColumn className="hidden lg:block" />
                    <div className="relative hidden lg:block" >
                        <BlackArrow direction="bottomRight" absolutePosition />
                    </div>
                </div>
            </div>

            {/* COL: gap  */}
            <StyledGapColumn hasDottedTopBorder className="bg-off-white" />
            
            {/* column spacer on the right  */}
            <div className="relative bg-off-white" >
                <BlackArrow direction="topLeft" absolutePosition />
                <div className="h-full dotted-line animate-draw-left-to-right"></div>
            </div>
            


            {/* -----  FOOTER (mostly blank): ROW 3  ------   */}
            
            <div className="dotted-line animate-draw-right-to-left" />
            <StyledGapColumn hasDottedTopBorder className="animate-draw-top-to-bottom"/>
            <div className="dotted-line animate-draw-left-to-right" >
                <BlackArrow direction="topLeft" />
            </div>
            <StyledGapColumn hasDottedTopBorder className="animate-draw-top-to-bottom [animation-delay:0.4s]" />
            <div className="dotted-line animate-draw-right-to-left" >
                <BlackArrow direction="topLeft" />
            </div>
            <StyledGapColumn hasDottedTopBorder className="hidden lg:block animate-draw-top-to-bottom" />
            <div className="dotted-line animate-draw-left-to-right hidden lg:block" >
                <BlackArrow direction="topLeft" />
            </div>


            <div aria-live="polite" className="sr-only">
                {filteredEnvVars.length} results found
            </div>
        </div>
    );
}

type CornerDirection = "bottomRight" | "topLeft";
type BlackArrowProps = {
    direction: CornerDirection;
    absolutePosition?: boolean;
    placeOnRight?: boolean;
}

function BlackArrow({ direction, absolutePosition, placeOnRight }: BlackArrowProps) {
    return (
        <div 
            className={`z-10 w-2.5 h-2.5 border-primary

                ${direction === "bottomRight" ? '-mr-px -mb-px border-r-2 border-b-2' : ''} 
                ${(absolutePosition && direction === "bottomRight") ? 'absolute bottom-0 right-0' : ''} 
                
                ${direction === "topLeft" ? '-ml-px border-t-2 border-l-2' : ''} 
                ${(absolutePosition && direction === "topLeft") ? 'absolute top-0 left-0' : ''} 

                ${placeOnRight ? 'ml-auto' : ''}
            `} 
        />
    );
}


function SecondHeadline({className}: {className?: string}) {
    return (
        <h1 
            className={`text-5xl sm:text-6xl xl:text-7xl font-semibold tracking-tighter
                font-outline-geist text-outline 
                pl-3 lg:pb-1 
                ${className}
                `}
        >
            Variables
        </h1>  
    )

}
