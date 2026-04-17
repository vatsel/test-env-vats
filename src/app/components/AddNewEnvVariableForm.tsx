"use client";

import { useState } from "react";

import { ApiResponse, ParseErrors } from "../models";
import { UNKNOWN_ERROR } from "../constants";
import StyledGapColumn from "./StyledGapColumn";
import SquareBtn from "./SquareBtn";
import { Check, CircleX } from "lucide-react";
import ErrorTooltip from "./ErrorTooltip";

export default function AddNewEnvVariableForm(
    {handleAdd} 
    : {handleAdd: (name: string, value: string) => Promise<ApiResponse>}
) {
    const [isAddingNewVar, setIsAddingNewVar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newVarName, setNewVarName] = useState('');
    const [newVarValue, setNewVarValue] = useState('');
    const [errors, setErrors] = useState<ParseErrors>({ formErrors: [], fieldErrors: {} });

    const clearForm = () => {
        setNewVarName('');
        setNewVarValue('');
        setErrors({ formErrors: [], fieldErrors: {} });
    }

    return (
    <>
        {isAddingNewVar
            ? <form
                className={`text-[12px] flex flex-col gap-1 lg:gap-0
                    lg:grid lg:grid-cols-subgrid lg:col-span-3`}
                onSubmit={async (e) => {
                    e.preventDefault();
                    // handleAdd is on the client, but let's pretend it's on the server 
                    // so we'll wrap it in a try-catch so our button doesn't freeze
                    try {
                        setIsSubmitting(true);
                        const response = await handleAdd(newVarName, newVarValue);
    
                        if (response.success){
                            setIsAddingNewVar(false);

                            // clear form for next submission
                            clearForm();
                        } else {
                            setErrors(response.errors);
                        }
                    } catch {
                        setErrors({ formErrors: [UNKNOWN_ERROR], fieldErrors: {} });
                    } finally {
                        setIsSubmitting(false);
                    }

                }}
            >
                <div>
                    <div className={`flex items-center pl-6 h-11 bg-base
                        duration-100 ease-out w-full

                        font-semibold -my-px
                        
                        dashed-border text-tertiary
                        ${isSubmitting ? "looping-dash" : ""}
                    `}

                    >
                        <input 
                            type="text" 
                            autoFocus
                            aria-label="Variable name"
                            placeholder="Name" 
                            value={newVarName}
                            onChange={(e) => setNewVarName(e.target.value)}
                            className={`outline-none text-primary 
                                placeholder:text-ui-detail w-full `}
                        />
                    </div>
                    {/* we also show any overall form errors in the name section */}
                    {(errors.fieldErrors.name || errors.formErrors.length > 0) && 
                        <ErrorTooltip errorText={errors.fieldErrors.name?.[0] || errors.formErrors[0]} />
                    }
                </div>

                <StyledGapColumn className="hidden lg:block"/>

                <div className="flex gap-1 lg:gap-gridgap items-start">
                    <div className="flex flex-col grow w-0">
                        <div className={`flex items-center pl-6 h-11 bg-base
                            duration-100 ease-out
                            font-semibold  -my-px 
                            dashed-border text-tertiary
                            ${isSubmitting ? "looping-dash" : ""}

                            `}>
                            <input 
                                type="text"
                                aria-label="Variable value"
                                placeholder="Value" 
                                value={newVarValue}
                                onChange={(e) => setNewVarValue(e.target.value)}
                                className={`outline-none text-primary 
                                    placeholder:text-ui-detail w-full `}
                            />
                        </div>
                    {errors.fieldErrors.value && 
                        <ErrorTooltip errorText={errors.fieldErrors.value[0]} />
                    }
                    </div>
                    <SquareBtn
                        isSubmitBtn
                        ariaLabel="Save variable"
                        disabled={isSubmitting}
                    >
                        <Check className="icon-size draw-icon" />
                    </SquareBtn>

                    <SquareBtn
                        disabled={isSubmitting}
                        ariaLabel="Cancel adding new variable"
                        onClick={() => setIsAddingNewVar(false)}
                    >
                        <CircleX className="icon-size draw-icon" />
                    </SquareBtn>
                </div>
            </form>
            : <div className="h-11 shrink-0 text-[12px] font-medium lg:grid lg:grid-cols-subgrid lg:col-span-3">
                <button 
                    type="button"
                    className={`flex outline-none pl-6 w-full h-full
                        bg-accent text-base items-center
                        duration-100 ease-out border-accent

                        hover:bg-base hover:text-accent hover:border-accent 
                        hover:border hover:pl-5.75

                        focus-within:bg-base focus-within:text-accent 
                        focus-within:border-accent focus-within:border-2
                        /* compensating for the added border */
                        focus-within:pl-5.5 
                        `}
                    onClick={() => setIsAddingNewVar(true)}
                >
                    + Add Environment Variable
                </button>

                <StyledGapColumn className="hidden lg:block"/>
            </div>
        }
    </>
    );
}
