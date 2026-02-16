
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useImageUpload = (bucket: string = 'product-images') => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadImage = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;

        setIsUploading(true);
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            alert(uploadError.message);
            setIsUploading(false);
            return null;
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
        
        setIsUploading(false);
        return data?.publicUrl || null;
    };

    return { isUploading, uploadImage };
};
