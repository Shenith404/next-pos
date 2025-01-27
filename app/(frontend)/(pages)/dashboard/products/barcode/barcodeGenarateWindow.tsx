'use client';

import useForm from '@/app/(frontend)/hooks/useForm';
import { Product } from '@/app/(frontend)/types/interfaces';
import { productBarcodeSchema } from '@/app/(frontend)/utils/validations/productBarcode';
import { Combobox } from '@/components/ui/combobox';
import CustomInput from '@/components/ui/input';
import ProgressButton from '@/components/ui/pogress_btn/pogress_btn';
import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';

interface ProductBarcodePDFProps {
    product: Product;
}

const ProductBarcodePDF = ({ product }: ProductBarcodePDFProps) => {
    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
    } = useForm(
        {
            pageSize: 'a4',
            barcodesPerPage: 30,
            barcodeWidth: 50, // mm
            barcodeHeight: 25, // mm
            customWidth: 0, // mm
            customHeight: 0, // mm
            margin: 10, // mm
        },
        productBarcodeSchema
    );

    const pageSizeOptions = [
        { value: 'a4', label: 'A4' },
        { value: 'letter', label: 'Letter' },
        { value: 'custom', label: 'Custom' },
    ];

    const convertMmToPoints = (mm: number) => mm * 2.83465; // Conversion factor: 1 mm = 2.83465 points

    const generateBarcode = (id: string) => {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, id, { format: 'CODE128' });
        return canvas.toDataURL('image/png');
    };

    const generatePDF = async () => {
        try {
            const {
                pageSize,
                barcodesPerPage,
                barcodeWidth,
                barcodeHeight,
                customWidth,
                customHeight,
                margin,
            } = values;

            const pdfPageSize = pageSize === 'custom'
                ? [
                    convertMmToPoints(Number(customWidth)),
                    convertMmToPoints(Number(customHeight)),
                ]
                : pageSize;

            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: pdfPageSize,
            });

            const convertedMargin = convertMmToPoints(margin);
            const titleFontSize = 8;
            const titleHeight = 20;
            let x = convertedMargin;
            let y = titleHeight;

            const barcodeImage = generateBarcode(product._id);
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            for (let i = 0; i < barcodesPerPage; i++) {
                const barcodeWidthPt = convertMmToPoints(barcodeWidth);
                const barcodeHeightPt = convertMmToPoints(barcodeHeight);

                // Check if we need to move to next column or page
                if (y + barcodeHeightPt > pageHeight - convertedMargin) {
                    x += barcodeWidthPt + convertedMargin;
                    y = titleHeight;
                }

                if (x + barcodeWidthPt > pageWidth - convertedMargin) {
                    doc.addPage();
                    x = convertedMargin;
                    y = titleHeight;
                }

                // Add barcode image
                doc.addImage(
                    barcodeImage,
                    'PNG',
                    x,
                    y,
                    barcodeWidthPt,
                    barcodeHeightPt
                );

                // Add product title
                doc.setFontSize(titleFontSize);
                doc.text(
                    product.title,
                    x + (barcodeWidthPt / 2),
                    y + barcodeHeightPt + 10,
                    {
                        align: 'center',
                        maxWidth: barcodeWidthPt
                    }
                );

                y += barcodeHeightPt + convertedMargin;
            }

            doc.save(`${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_barcodes.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate PDF');
        } finally {
        }
    };
    return (
        <div className="w-full space-y-4">
            <Combobox
                label="Page Size"
                value={values.pageSize}
                name="pageSize"
                options={pageSizeOptions}
                onChange={handleChange}
                error={errors.pageSize}
            />

            {values.pageSize === 'custom' && (
                <div className="space-y-2">
                    <CustomInput
                        label="Custom Width (mm)"
                        type="number"
                        name="customWidth"
                        value={values.customWidth}
                        errors={errors.customWidth}
                        onchange={handleChange}
                        placeholder="Enter width in millimeters"
                    />
                    <CustomInput
                        label="Custom Height (mm)"
                        type="number"
                        name="customHeight"
                        value={values.customHeight}
                        errors={errors.customHeight}
                        onchange={handleChange}
                        placeholder="Enter height in millimeters"
                    />
                </div>
            )}

            <CustomInput
                label="Margin (mm)"
                type="number"
                name="margin"
                value={values.margin}
                errors={errors.margin}
                onchange={handleChange}
                placeholder="Enter margin in millimeters"
            />

            <CustomInput
                label="Barcodes Per Page"
                type="number"
                name="barcodesPerPage"
                value={values.barcodesPerPage}
                errors={errors.barcodesPerPage}
                onchange={handleChange}
                placeholder="Enter the number of barcodes per page"
            />

            <CustomInput
                label="Barcode Width (mm)"
                type="number"
                name="barcodeWidth"
                value={values.barcodeWidth}
                errors={errors.barcodeWidth}
                onchange={handleChange}
                placeholder="Enter barcode width in millimeters"
            />

            <CustomInput
                label="Barcode Height (mm)"
                type="number"
                name="barcodeHeight"
                value={values.barcodeHeight}
                errors={errors.barcodeHeight}
                onchange={handleChange}
                placeholder="Enter barcode height in millimeters"
            />

            <ProgressButton
                width="w-full"
                title="Generate PDF"
                handleClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, generatePDF)}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default ProductBarcodePDF;
