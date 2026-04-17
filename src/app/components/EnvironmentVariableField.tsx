"use client";

import { useState } from "react";
import { Check, CircleX, Eye, EyeOff, Pencil, Trash } from "lucide-react";

import { ApiResponse, EnvironmentVariable, ParseErrors } from "../models";
import SquareBtn from "./SquareBtn";
import { UNKNOWN_ERROR, HIDDEN_ENV_CHAR } from "../constants";
import StyledGapColumn from "./StyledGapColumn";
import { getTimeStr } from "../utils";
import ErrorTooltip from "./ErrorTooltip";



type Props = {
    envVar: EnvironmentVariable;
    onUpdate: (name: string, value: string) => Promise<ApiResponse>;
    onDelete: () => Promise<ApiResponse>;
};

type ClipboardCopyState = 'idle' | 'success' | 'error';
const CLIPBOARD_MESSAGES: Record<ClipboardCopyState, string> = {
    idle: 'Copy to clipboard',
    success: 'Copied to clipboard',
    error: 'Error'
};

type DisplayMode = 'view' | 'edit' | 'aboutToDelete'; 

export default function EnvironmentVariableField({ envVar, onUpdate, onDelete}: Props) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [envVarName, setEnvVarName] = useState(envVar.name);
    const [envVarValue, setEnvVarValue] = useState(envVar.value);
    const [errors, setErrors] = useState<ParseErrors>({ formErrors: [], fieldErrors: {} });
    const [copyState, setCopyState] = useState<ClipboardCopyState>('idle');
    const [displayMode, setDisplayMode] = useState<DisplayMode>('view');

    const clearErrors = () => {
        setErrors({ formErrors: [], fieldErrors: {} });
    }

    const handleSubmit = async () => {
        // handleUpdate is on the client, but let's pretend it's on the server 
        // we'll wrap it in a try-catch so our button doesn't freeze
        try {
            setIsSubmitting(true);
            const response = await onUpdate(envVarName, envVarValue);

            if (response.success) {
                setDisplayMode('view');
                setIsRevealed(false);
                clearErrors();
            } else {
                setErrors(response.errors);
            }
        } catch (error) {
            setErrors({ formErrors: [ UNKNOWN_ERROR ], fieldErrors: {} });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelClick = () => {
        setEnvVarName(envVar.name);
        setEnvVarValue(envVar.value);
        clearErrors();

        setDisplayMode('view');
    };

    const handleDeleteClick = () => {
        setDisplayMode('aboutToDelete');
    };

    const handleConfirmDelete = async () => {
        // handleDelete is on the client, but let's pretend it's on the server 
        // we'll wrap it in a try-catch so our button doesn't freeze
        try {
            setIsSubmitting(true);
            const response = await onDelete();

            if (!response.success) {
                setErrors(response.errors);
            }
        } catch {
            setErrors({ formErrors: [UNKNOWN_ERROR], fieldErrors: {} });
        } finally {
            setDisplayMode('view');
        } 
    };


    const handleEnter = (e: React.KeyboardEvent) => {
        if (displayMode === 'edit' && !isSubmitting && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };


    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(envVarValue);
            setCopyState('success');

        } catch (error) {
            console.error('Error copying to clipboard:', error);
            setCopyState('error'); 

        } finally {
            setTimeout( () => setCopyState('idle'), 2000);

        }
    };


    return (
        <div 
            className={`grid grid-cols-subgrid lg:col-span-3 
                 text-[12px] gap-1 lg:gap-0`}
            onKeyDown={handleEnter}
        >
            {/* COLUMN 1: name  
            MD and smaller: edit and delete as well */}
            <div className="flex flex-row gap-1 lg:flex-col overflow-hidden -mx-px ">
                <div className="w-full lg:w-auto">
                    <div 
                        className={`flex items-center
                            relative 
                            dashed-border
                            pl-5 lg:pl-6 h-11 bg-foundation 
                            duration-100 ease-out  
                            ${(displayMode !== 'edit' && !isSubmitting) ? 'solid-dash' : ''}
                            ${isSubmitting ? 'looping-dash mx-px' : ''} 
                            ${displayMode === 'edit'  
                                ? "mx-px font-semibold text-tertiary" 
                                // text-* sets colour in our dashed-border utility
                                : 'font-medium' // extra px for border growth
                            }       
                        `}
                    >
                        {displayMode === 'edit'
                            ? <input 
                                type="text"
                                autoFocus
                                aria-label="Variable name"
                                placeholder="Name"
                                value={envVarName}
                                onChange={(e) => setEnvVarName(e.target.value)}
                                className={`flex 
                                    text-[16px] sm:text-[12px]
                                    font-normal sm:font-semibold
                                    items-center text-primary outline-none h-11 
                                    placeholder:text-ui-detail w-full 
                                    `}
                            /> 
                            
                            : <span className="z-10 text-tertiary truncate">
                                {envVar.name}
                            </span>
                        }
                    </div>

                    {(errors.fieldErrors.name || errors.formErrors.length > 0) && 
                        <ErrorTooltip errorText={errors.fieldErrors.name?.[0] || errors.formErrors[0]} />
                    }
                </div>
                
                {/*  < lg: Edit and Delete button */}
                {(displayMode === 'view' || displayMode === 'aboutToDelete') &&
                    <div className="flex gap-1 lg:hidden z-10 mb-px">
                        {displayMode === 'view' &&
                            <>
                                <SquareBtn
                                    ariaLabel="Edit value"
                                    disabled={isSubmitting} 
                                    onClick={() => setDisplayMode('edit')}
                                >
                                    <Pencil className="icon-size draw-icon" />
                                </SquareBtn>
                                <SquareBtn 
                                    ariaLabel="Delete variable"
                                    disabled={isSubmitting} 
                                    onClick={handleDeleteClick}   
                                >
                                    <Trash className="icon-size draw-icon" />
                                </SquareBtn>
                            </>
                        }
                        {displayMode === 'aboutToDelete' &&
                            <>
                                <SquareBtn 
                                    invert
                                    ariaLabel="Confirm delete"
                                    disabled={isSubmitting} 
                                    onClick={handleConfirmDelete}
                                >
                                    <Check className="icon-size draw-icon" />
                                </SquareBtn>
                                <SquareBtn
                                    invert
                                    ariaLabel="Cancel delete"
                                    disabled={isSubmitting} 
                                    onClick={handleCancelClick}
                                >
                                    <CircleX className="icon-size draw-icon" />
                                </SquareBtn>
                            </>
                        }
                    </div>
                }
            </div>


            {/* COLUMN 2: separator */}
            <StyledGapColumn className="hidden lg:block" />
            

            {/* COLUMN 3: reveal, value, last edit time and buttons. 
            < lg : remove edit/delete buttons */}
            <div className="flex gap-1 lg:gap-gridgap items-start">

                {/* View Hide Icon */}
                {displayMode !== 'edit' &&
                    <div className="-ml-px"> {/* overlap the lighter border */}
                        <SquareBtn 
                            ariaLabel={isRevealed ? 'Hide value' : 'Reveal value'}
                            disabled={isSubmitting} 
                            onClick={() => setIsRevealed(!isRevealed)}
                        >
                            {isRevealed 
                                ? <EyeOff className="icon-size draw-icon" />
                                : <Eye className="icon-size draw-icon" />
                            }
                        </SquareBtn>
                    </div>
                }

                {/* Variable & last edit time */}
                <div className="flex flex-col grow w-0">
                    <div className={`relative flex items-center justify-between 
                        px-5 lg:px-4 xl:px-6 h-11 
                        -mr-px lg:mr-0 /* overlap right border on <lg */
                        gap-gridgap 
                        bg-foundation text-tertiary

                        dashed-border
                        ${(displayMode !== 'edit' && !isSubmitting) ? 'solid-dash' : ''}
                        ${isSubmitting ? 'looping-dash mx-px' : ''} 
                        ${displayMode === 'edit' 
                            ? 'font-semibold text-tertiary' 
                            // text-* sets colour in our dashed-border utility
                            : 'font-medium'
                        }
                    `}>
                        {displayMode === 'edit' 
                            ? <input 
                                type="text"
                                aria-label="Variable value"
                                value={envVarValue}
                                onChange={(e) => setEnvVarValue(e.target.value)}
                                placeholder="Value"
                                className={`flex items-center w-full text-primary outline-none
                                    text-base sm:text-[12px]
                                    font-normal sm:font-semibold
                                    placeholder:text-ui-detail`}
                            />
                            : <>
                                <button 
                                    tabIndex={0}
                                    type="button"
                                    className={`min-w-0 truncate peer outline-none
                                        ${isRevealed ? '' : 'pt-1.5'}`}
                                    aria-label="copy environment value to clipboard"
                                    onClick={handleCopyToClipboard}
                                >
                                    <span className={`hover:bg-ui-detail focus:bg-ui-detail
                                        ${isRevealed 
                                            ? '' 
                                            : 'tracking-normal cursor-default'} `}
                                    >
                                        {isRevealed 
                                            ? envVar.value 
                                            : HIDDEN_ENV_CHAR.repeat(16) 
                                        }
                                    </span>
                                </button>
                                <span className={`opacity-0 peer-hover:opacity-100 peer-focus:opacity-100 
                                    pointer-events-none
                                    absolute z-20 -top-2 px-1.5 left-5 lg:left-6
                                    duration-100 ease-out transition-opacity
                                    bg-accent  text-foundation font-normal
                                `}>
                                    { CLIPBOARD_MESSAGES[copyState] }
                                </span>
                                <span className="whitespace-nowrap text-[10px] xl:text-[12px]">
                                    {getTimeStr(envVar)}
                                </span>
                            </> 
                            } 
                    </div>
                    {errors.fieldErrors.value && 
                        <ErrorTooltip errorText={errors.fieldErrors.value[0]} />
                    }

                </div>
                
                {/* < lg : Confirm and Cancel button */}
                {displayMode === 'edit' &&
                    <div className="flex gap-1 lg:hidden -mr-px z-10">
                        <SquareBtn
                            ariaLabel="Submit edit"
                            disabled={isSubmitting} 
                            onClick={handleSubmit}
                        >
                            <Check className="icon-size draw-icon" />
                        </SquareBtn> 
                        <SquareBtn 
                            ariaLabel="Cancel edit"
                            disabled={isSubmitting} 
                            onClick={handleCancelClick}
                        >
                            <CircleX className="icon-size draw-icon" />
                        </SquareBtn>
                    </div>
                }

                {/* lg+: Edit OR Confirm button */}
                <div className="hidden lg:block">
                    {displayMode === 'view' && 
                        <SquareBtn
                            ariaLabel="Edit environment variable"
                            disabled={isSubmitting} 
                            onClick={() => setDisplayMode('edit')}
                        >
                            <Pencil className="icon-size draw-icon" />
                        </SquareBtn>

                    }
                    {displayMode === 'edit' && 
                        <SquareBtn
                            ariaLabel="Submit edit"
                            disabled={isSubmitting} 
                            onClick={handleSubmit}
                        >
                            <Check className="icon-size draw-icon" />
                        </SquareBtn> 
                    }
                    {displayMode === 'aboutToDelete' &&
                        <SquareBtn
                            invert
                            ariaLabel="Confirm delete"
                            disabled={isSubmitting} 
                            onClick={handleConfirmDelete}
                        >
                            <Check className="icon-size draw-icon" />
                        </SquareBtn> 
                    }
                </div>

                {/* lg+: Delete OR Cancel button */}
                <div className="hidden lg:block -mr-px z-10">
                    {displayMode === 'edit' &&
                        <SquareBtn 
                            ariaLabel="Cancel edit"
                            disabled={isSubmitting} 
                            onClick={handleCancelClick}
                        >
                            <CircleX className="icon-size draw-icon" />
                        </SquareBtn>
                    }
                    {displayMode === 'aboutToDelete' &&
                        <SquareBtn
                            invert
                            ariaLabel="Cancel delete"
                            disabled={isSubmitting}
                            onClick={handleCancelClick}
                        >
                            <CircleX className="icon-size draw-icon" />
                        </SquareBtn>
                    }
                    {displayMode === 'view' &&
                        <SquareBtn 
                            ariaLabel="Delete environment variable"
                            disabled={isSubmitting} 
                            onClick={handleDeleteClick}   
                        >
                            <Trash className="icon-size draw-icon" />
                        </SquareBtn>
                    }
                </div>
            </div>
        </div>
    );
}
