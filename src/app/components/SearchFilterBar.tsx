"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownNarrowWide, ChevronDown, Search, X } from "lucide-react";

import { SortOption } from "../models";
import { SORT_OPTIONS } from "../constants";


type Props = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    sortOption: SortOption;
    setSortOption: (value: SortOption) => void;
}


export default function SearchFilterBar({ searchQuery, setSearchQuery, sortOption, setSortOption}: Props) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault(); // prevent scroll
            setActiveDropdownIndex((prevIndex) => (prevIndex + 1) % SORT_OPTIONS.length);

        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); // prevent scroll
            setActiveDropdownIndex((prevIndex) => (prevIndex - 1) % SORT_OPTIONS.length);

        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault(); // any potential forms etc
            setSortOption(SORT_OPTIONS[activeDropdownIndex]);
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        // added as a ref to <ul>
        if (isDropdownOpen) {
            itemRefs.current[activeDropdownIndex]?.focus();
        }
    }, [activeDropdownIndex, isDropdownOpen]);


    useEffect(() => {
        // global trigger to close dropdown
        if (!isDropdownOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isDropdownOpen]);


    return (
        <div className={`relative flex gap-3 -mx-px
            flex-col sm:flex-row lg:flex-col xl:flex-row 
            h-full sm:h-11 lg:h-full xl:h-11 `}>

            {/* SEARCH */}
            <div className={`flex pl-4 z-10 
                w-full h-11 xl:h-full
                bg-foundation border-primary border 
                duration-100 ease-out
                items-center
                focus-within:border-2 
                `}
            >
                <div className="pb-0.5">
                    <Search className="icon-size"  />
                </div>
                <input 
                    type="search"
                    aria-label="Search environment variables"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`bg-transparent outline-none 
                        text-base sm:text-[12px]
                        tracking-tighter sm:tracking-tight
                        font-normal sm:font-semibold
                        pl-3 mr-1 w-full
                        placeholder:text-tertiary
                        [&::-webkit-search-cancel-button]:hidden 
                        `}
                />
                {searchQuery && 
                    <button 
                        onClick={() => setSearchQuery('')}
                        type="button"
                        aria-label="Clear search"
                        className={`outline-none mr-2
                            focus:bg-accent focus:text-foundation`}
                    >
                        <X className="icon-size draw-icon shrink-0"  />
                    </button>
                }
            </div>
            

            {/* FILTER */}
            <div className="flex w-full relative">
                <button 
                    className={`flex px-4 w-full h-11 xl:h-full gap-2
                        bg-foundation border-primary border 
                        items-center justify-between
                        outline-none
                        duration-100 ease-out
                        hover:bg-primary hover:text-foundation
                        focus-within:border-2 focus-within:border-primary
                        `}
                        type="button"
                        aria-label={`Sort by ${sortOption}`}
                        onClick={() => {
                            if (isDropdownOpen) {
                                setIsDropdownOpen(false);
                            } else {
                                setIsDropdownOpen(true);
                                setActiveDropdownIndex(SORT_OPTIONS.indexOf(sortOption));
                            }
                        }}
                        >
                    <ArrowDownNarrowWide className="shrink-0 icon-size" />
                    <span className="shrink-0">{sortOption}</span>
                    <ChevronDown className={`icon-size draw-icon shrink-0 
                        ${isDropdownOpen ? 'rotate-180' : ''} `} 
                    />
                </button>

                {isDropdownOpen &&
                    <ul 
                        role="listbox"
                        onKeyDown={handleKeyDown}
                        className={`absolute z-20 top-full left-0 w-full bg-foundation -mt-px
                            border-primary border `}
                    >
                        {SORT_OPTIONS.map((option, i) => (
                            <li 
                                key={option}
                                aria-selected={option === sortOption}
                                role="option"
                                className={`w-full`}
                            >
                                <button 
                                    type="button"
                                    ref={(el) => {itemRefs.current[i] = el;}}
                                    className={`w-full text-left px-3 py-2 
                                        outline-none
                                        duration-100 ease-out
                                        hover:bg-primary hover:text-foundation
                                        focus:bg-primary focus:text-foundation
                                        ${sortOption === option ? 'text-tertiary' : ''}`}
                                    onClick={() => {
                                        setSortOption(option);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                }
            </div>
        </div>

    );
}