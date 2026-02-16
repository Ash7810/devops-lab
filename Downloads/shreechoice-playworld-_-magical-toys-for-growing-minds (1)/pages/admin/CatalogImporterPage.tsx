
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

import { UploadCloudIcon, SparklesIcon, ChevronDownIcon } from '../../components/icons/Icon';
import { CatalogReviewModal } from '../../components/Admin/CatalogReviewModal';
import { Brand, Category } from '../../types';
import { useToast } from '../../contexts/ToastContext';

// Set the worker source for pdf.js to ensure it can process PDFs in the browser.
GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

// Define the structure of the data we expect from the AI
export interface ExtractedProduct {
  Name: string;
  SKU: number;
  MRP: number;
  Category: string;
  description: string;
  boundingBox?: { x: number; y: number; width: number; height: number; };
  image_base64?: string;
}

interface PageData {
  pageNumber: number;
  pageImage: string;
  products: ExtractedProduct[];
}

interface CatalogImporterPageProps {
    brands: Brand[];
    categories: Category[];
    onImportSuccess: () => void;
}

const CatalogImporterPage: React.FC<CatalogImporterPageProps> = ({ brands, categories, onImportSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [processingMessage, setProcessingMessage] = useState('Starting process...');
    const [extractedData, setExtractedData] = useState<PageData[]>([]);
    const [selectedSkus, setSelectedSkus] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { showToast } = useToast();
    const [extractImages, setExtractImages] = useState(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const pdfFile = e.target.files[0];
            setFile(pdfFile);
            processPdf(pdfFile);
        }
    };

    const processPdf = useCallback(async (pdfFile: File) => {
        setStatus('processing');
        setError(null);
        setExtractedData([]);

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(pdfFile);
        
        fileReader.onload = async (e) => {
            if (!e.target?.result) {
                setError('Failed to read PDF file.');
                setStatus('error');
                return;
            }
            
            try {
                const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
                const pdf = await getDocument(typedarray).promise;
                const pageImages: {pageNumber: number, data: string}[] = [];
                const pageCanvases: {pageNumber: number, canvas: HTMLCanvasElement}[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    try {
                        setProcessingMessage(`Processing page ${i} of ${pdf.numPages}...`);
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        if (context) {
                            const renderTask = page.render({ canvasContext: context, viewport: viewport, canvas });
                            await renderTask.promise;
                            pageImages.push({ pageNumber: i, data: canvas.toDataURL('image/jpeg', 0.8) });
                            pageCanvases.push({ pageNumber: i, canvas: canvas });
                        }
                    } catch (renderError: any) {
                        console.error(`Failed to render page ${i}: ${renderError.message}`);
                    }
                }
                
                if (pageImages.length === 0) {
                    setError('Failed to extract any pages from the PDF. The file may be corrupted or in an unsupported format.');
                    setStatus('error');
                    return;
                }

                setProcessingMessage('Asking AI to extract product data...');
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

                const allPagesData: PageData[] = [];

                for (let i = 0; i < pageImages.length; i++) {
                    const pageImage = pageImages[i];
                    setProcessingMessage(`AI is analyzing page ${pageImage.pageNumber} of ${pdf.numPages}...`);
                    
                    const imagePart = {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: pageImage.data.split(',')[1],
                        },
                    };

                    let textPart;
                    let responseSchema;

                    if (extractImages) {
                        textPart = {
                            text: `You are a product data specialist. Look at this toy catalog page. For every product visible, extract:
1.  **Name**: The product's name.
2.  **SKU**: The number in brackets (e.g., 4504).
3.  **MRP**: The second number in the "Dp/Mrp" pair.
4.  **Category**: Choose from: Arts and Crafts, Toys, Soft Toys, Books, Infants, Scooter, Games, Sports, Wooden Toys, RC Cars.
5.  **description**: A 2-sentence fun description for a toy shop.
6.  **boundingBox**: The exact, tight bounding box of the product itself, excluding any background elements, shadows, or text. The coordinates must be in pixels relative to the top-left corner of the provided page image.

Output ONLY a clean JSON array. Do not include any other text or formatting.`,
                        };
                        responseSchema = {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    Name: { type: Type.STRING },
                                    SKU: { type: Type.NUMBER },
                                    MRP: { type: Type.NUMBER },
                                    Category: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    boundingBox: {
                                        type: Type.OBJECT,
                                        description: "Coordinates of the product's image.",
                                        properties: {
                                            x: { type: Type.NUMBER, description: 'Top-left x-coordinate.' },
                                            y: { type: Type.NUMBER, description: 'Top-left y-coordinate.' },
                                            width: { type: Type.NUMBER, description: 'Width of the image.' },
                                            height: { type: Type.NUMBER, description: 'Height of the image.' },
                                        },
                                        required: ['x', 'y', 'width', 'height']
                                    }
                                },
                            },
                        };
                    } else {
                        textPart = {
                            text: `You are a product data specialist. Look at this toy catalog page. For every product visible, extract:
1.  **Name**: The product's name.
2.  **SKU**: The number in brackets (e.g., 4504).
3.  **MRP**: The second number in the "Dp/Mrp" pair.
4.  **Category**: Choose from: Arts and Crafts, Toys, Soft Toys, Books, Infants, Scooter, Games, Sports, Wooden Toys, RC Cars.
5.  **description**: A 2-sentence fun description for a toy shop.

Output ONLY a clean JSON array. Do not include any other text or formatting.`,
                        };
                        responseSchema = {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    Name: { type: Type.STRING },
                                    SKU: { type: Type.NUMBER },
                                    MRP: { type: Type.NUMBER },
                                    Category: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                },
                            },
                        };
                    }

                    let success = false;
                    let attempt = 0;
                    const maxRetries = 3;

                    while (!success && attempt < maxRetries) {
                        try {
                            const response = await ai.models.generateContent({
                                model: 'gemini-3-flash-preview',
                                contents: { parts: [imagePart, textPart] },
                                config: { responseMimeType: "application/json", responseSchema },
                            });

                            const responseText = response.text;
                            if (!responseText?.trim()) {
                                console.warn(`AI returned empty content for page ${pageImage.pageNumber}. Skipping.`);
                                success = true; 
                                continue;
                            }
                            
                            const productsOnPage: ExtractedProduct[] = JSON.parse(responseText.trim());
                            const sourceCanvas = pageCanvases.find(c => c.pageNumber === pageImage.pageNumber)?.canvas;

                            const productsWithImages = productsOnPage.map(product => {
                                if (extractImages && product.boundingBox && sourceCanvas) {
                                    const { x, y, width, height } = product.boundingBox;
                                    const cropCanvas = document.createElement('canvas');
                                    cropCanvas.width = width;
                                    cropCanvas.height = height;
                                    const cropCtx = cropCanvas.getContext('2d');
                                    if (cropCtx) {
                                        cropCtx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
                                        product.image_base64 = cropCanvas.toDataURL('image/jpeg', 0.8).split(',')[1];
                                    }
                                }
                                return product;
                            });
                            
                            if (Array.isArray(productsWithImages) && productsWithImages.length > 0) {
                                allPagesData.push({
                                    pageNumber: pageImage.pageNumber,
                                    pageImage: pageImage.data,
                                    products: productsWithImages,
                                });
                            }
                            success = true;

                        } catch (e: any) {
                            attempt++;
                            if (e.message && e.message.includes('429')) { // Check for rate limit error
                                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
                                console.warn(`Rate limit hit on page ${pageImage.pageNumber}. Retrying in ${waitTime / 1000}s... (${maxRetries - attempt} attempts left)`);
                                setProcessingMessage(`Rate limit hit. Retrying page ${pageImage.pageNumber} in ${waitTime / 1000}s...`);
                                await new Promise(resolve => setTimeout(resolve, waitTime));
                            } else {
                                console.error(`Failed to process page ${pageImage.pageNumber} with non-retriable AI error: ${e.message}`);
                                break; 
                            }
                        }
                    }
                    if (!success) {
                        console.error(`Failed to process page ${pageImage.pageNumber} after ${maxRetries} attempts.`);
                    }
                }
                
                setExtractedData(allPagesData);
                setStatus('success');
            } catch (pdfError: any) {
                console.error(pdfError);
                setError(`Failed to load PDF: ${pdfError.message}. It may be corrupted or password-protected.`);
                setStatus('error');
            }
        };

        fileReader.onerror = () => {
             setError('Error reading the file.');
             setStatus('error');
        }

    }, [extractImages]);

    const toggleSelection = (sku: number) => {
        setSelectedSkus(prev => prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]);
    };
    
    const toggleSelectAll = () => {
        const allSkus = extractedData.flatMap(page => page.products.map(p => p.SKU));
        if (selectedSkus.length === allSkus.length) {
            setSelectedSkus([]);
        } else {
            setSelectedSkus(allSkus);
        }
    };

    const handleProcessSelected = () => {
        if(selectedSkus.length > 0) {
            setIsReviewModalOpen(true);
        } else {
            showToast("Please select at least one product to import.");
        }
    }
    
    const allProducts = extractedData.flatMap(page => page.products);
    const selectedProducts = allProducts.filter(p => selectedSkus.includes(p.SKU));

    const renderContent = () => {
        switch (status) {
            case 'idle':
                return (
                    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
                        <label className="w-full flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-300 rounded-3xl cursor-pointer hover:border-brand-primary hover:bg-blue-50 transition-all text-center">
                            <UploadCloudIcon className="w-16 h-16 text-slate-400 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700">Click to upload or drag & drop</h3>
                            <p className="text-slate-500 mt-2">Upload your PDF catalog to begin.</p>
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                         <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl w-full flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <SparklesIcon className="w-6 h-6 text-brand-primary" />
                                <div>
                                    <label htmlFor="extract-images-toggle" className="font-bold text-slate-700 cursor-pointer">Extract Product Images</label>
                                    <p className="text-xs text-slate-500">Uses AI to crop images. Disable to save costs.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="extract-images-toggle"
                                    className="sr-only peer"
                                    checked={extractImages}
                                    onChange={(e) => setExtractImages(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    </div>
                );
            case 'processing':
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold text-brand-primary">{processingMessage}</h3>
                    </div>
                );
            case 'success':
                if (extractedData.length === 0) {
                     return <div className="text-center bg-yellow-50 p-6 rounded-xl border border-yellow-200"><h3 className="text-yellow-700 font-bold">Processing complete, but no products were found.</h3><p className="text-sm text-yellow-600 mt-2">The AI couldn't extract any product information from the uploaded PDF.</p><button onClick={() => setStatus('idle')} className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Try a different file</button></div>;
                }
                return (
                   <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between md:items-center gap-4 sticky top-4 z-20">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 font-bold text-sm text-slate-700">
                                    <input type="checkbox" onChange={toggleSelectAll} checked={selectedSkus.length > 0 && selectedSkus.length === allProducts.length} className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary" />
                                    Select All
                                </label>
                                <div className="w-px h-6 bg-slate-200"></div>
                                <span className="text-sm font-bold text-slate-500">{selectedSkus.length} of {allProducts.length} products selected</span>
                            </div>
                            <button onClick={handleProcessSelected} disabled={selectedSkus.length === 0} className="bg-brand-secondary text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-opacity-90 shadow-lg shadow-brand-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                                <SparklesIcon className="w-5 h-5"/> Process {selectedSkus.length} Selected Items
                            </button>
                        </div>

                        {extractedData.map(page => (
                            <PageResult key={page.pageNumber} pageData={page} selectedSkus={selectedSkus} onToggleSelection={toggleSelection} />
                        ))}
                   </div>
                );
             case 'error':
                 return <div className="text-center bg-red-50 p-6 rounded-xl border border-red-200"><h3 className="text-red-600 font-bold">{error}</h3><button onClick={() => setStatus('idle')} className="mt-4 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg">Try again</button></div>;

        }
    };
    
    return (
        <div>
            {isReviewModalOpen && <CatalogReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                products={selectedProducts}
                brands={brands}
                categories={categories}
                onImportSuccess={onImportSuccess}
            />}
            <div className="flex justify-center">{renderContent()}</div>
        </div>
    );
};

const PageResult: React.FC<{ pageData: PageData; selectedSkus: number[]; onToggleSelection: (sku: number) => void; }> = ({ pageData, selectedSkus, onToggleSelection }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 bg-slate-50 border-b flex justify-between items-center text-left">
                <h4 className="font-bold text-slate-700">Page {pageData.pageNumber} ({pageData.products.length} products found)</h4>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    <img src={pageData.pageImage} alt={`Page ${pageData.pageNumber}`} className="rounded-lg border shadow-sm w-full h-auto" />
                    <div className="space-y-2 overflow-y-auto max-h-[600px]">
                        {pageData.products.map(p => (
                            <div key={p.SKU} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
                                <input type="checkbox" checked={selectedSkus.includes(p.SKU)} onChange={() => onToggleSelection(p.SKU)} className="mt-1 w-5 h-5 rounded text-brand-primary focus:ring-brand-primary"/>
                                {p.image_base64 ? (
                                    <img src={`data:image/jpeg;base64,${p.image_base64}`} alt={p.Name} className="w-12 h-12 object-cover rounded-md border flex-shrink-0" />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                                        <UploadCloudIcon className="w-6 h-6 text-slate-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-sm text-slate-800">{p.Name} <span className="font-mono text-xs text-slate-500">[{p.SKU}]</span></p>
                                    <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">MRP: ₹{p.MRP}</span>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{p.Category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


export default CatalogImporterPage;
