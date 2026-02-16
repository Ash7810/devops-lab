
import React, { useState, useEffect } from 'react';
import { PlusIcon } from '../icons/Icon';

interface QuantityInputProps {
    initialQuantity: number;
    onQuantityChange: (quantity: number) => void;
    maxQuantity?: number;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({ initialQuantity, onQuantityChange, maxQuantity }) => {
    const [inputValue, setInputValue] = useState<string>(String(initialQuantity));

    useEffect(() => {
        setInputValue(String(initialQuantity));
    }, [initialQuantity]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string or numbers
        if (value === '' || /^[0-9]+$/.test(value)) {
            setInputValue(value);
        }
    };
    
    const handleBlur = () => {
        let newQuantity = parseInt(inputValue, 10);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        if (maxQuantity && newQuantity > maxQuantity) {
            newQuantity = maxQuantity;
        }
        setInputValue(String(newQuantity));
        onQuantityChange(newQuantity);
    };

    const adjustQuantity = (amount: number) => {
        let currentQuantity = parseInt(inputValue, 10) || 1;
        let newQuantity = currentQuantity + amount;
        
        if (newQuantity < 1) return;
        if (maxQuantity && newQuantity > maxQuantity) return;
        
        setInputValue(String(newQuantity));
        onQuantityChange(newQuantity);
    };

    const currentQty = parseInt(inputValue, 10) || 1;

    return (
        <div className="flex items-center border-2 border-gray-200 rounded-lg w-fit bg-white h-11">
            <button 
                className="px-3 text-gray-500 h-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                onClick={() => adjustQuantity(-1)} 
                disabled={currentQty <= 1}
                aria-label="Decrease quantity"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
            </button>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-10 text-center text-sm font-bold bg-transparent border-none focus:ring-0"
                aria-label="Quantity"
            />
            <button 
                className="px-3 text-gray-500 h-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                onClick={() => adjustQuantity(1)} 
                disabled={maxQuantity !== undefined && currentQty >= maxQuantity}
                aria-label="Increase quantity"
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    );
};
