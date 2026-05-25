'use server';

import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { join } from 'path';

/**
 * Offline generator for Lulu POD IDs.
 * Constructs the standard dotted Lulu package ID structure.
 * Format: [Trim].[Ink].[Quality].[Binding].[Paper].[Finish]
 */
function generateLuluPodId(specs: {
  trimSize: string;      // "6 x 9", "5.5 x 8.5", "8.5 x 11"
  interiorColor: string; // "Black & White Standard", "Standard Color", "Premium Color"
  binding: 'PB' | 'HC';  // PB = Paperback, HC = Hardcover
  coverFinish: string;   // "Gloss", "Matte"
}) {
  // 1. Map Trim Sizes
  let trimCode = '0600X0900'; 
  if (specs.trimSize === '5.5 x 8.5') trimCode = '0550X0850';
  if (specs.trimSize === '8.5 x 11')  trimCode = '0850X1100';

  let inkCode = 'BW';
  let qualityCode = 'STD';
  
  // 2. Resolve Ink & Quality Limits
  if (specs.interiorColor === 'Standard Color') {
    inkCode = 'FC';
    qualityCode = 'STD';
    
    // Manufacturing Limit: 8.5x11 does not support Standard Color. Upgrade to Premium.
    if (trimCode === '0850X1100') {
      qualityCode = 'PRE';
    }
  } else if (specs.interiorColor === 'Premium Color') {
    inkCode = 'FC';
    qualityCode = 'PRE';
  }

  // 3. Resolve Paper Weight & Bulk Code (CRITICAL FIX: Appending '444')
  // Premium uses 80# Coated White (080CW444) for color, Standard/B&W uses 60# Uncoated White (060UW444)
  // EXCEPT for 6x9 color books where standard color also maps to 80# coated paper.
  let paperCode = '060UW444'; 
  
  if (inkCode === 'FC') {
    if (qualityCode === 'PRE' || trimCode === '0600X0900') {
      paperCode = '080CW444'; // Use Coated White with 444 bulk thickness specifier
    }
  }

  // 4. Resolve Cover Finish Limits
  let finishCode = specs.coverFinish === 'Matte' ? 'MXX' : 'GXX';
  
  // Manufacturing Limit: 8.5x11 Premium Color Paperbacks on 80# paper cannot be Matte. Force to Gloss.
  if (trimCode === '0850X1100' && qualityCode === 'PRE' && specs.binding === 'PB') {
    finishCode = 'GXX'; 
  }

  // Final Composite Output Layout: Trim.Ink.Quality.Binding.Paper.Finish
  const finalId = `${trimCode}.${inkCode}.${qualityCode}.${specs.binding}.${paperCode}.${finishCode}`;
  console.log(`🚀 [LULU ID BUILDER] Final generated SKU: ${finalId}`);
  
  return finalId;
}

export async function getBooksAction() {
  try {
    await dbConnect();
    const books = await Book.find({ status: 'LIVE' }).lean();
    
    return books.map((book: any) => ({
      id: book.slug,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      price: {
        paperback: book.pricePaperback,
        ebook: book.priceEbook,
        hardcover: book.priceHardcover
      },
      image: book.image,
      coverPdf: book.coverPdf,
      manuscriptUrl: book.manuscriptUrl,
      luluPaperbackId: book.luluPaperbackId,
      luluHardcoverId: book.luluHardcoverId,
      descriptionHtml: book.descriptionHtml,
      status: book.status,
      language: book.language,
      published: book.published,
      imprint: book.imprint,
      isbn: book.isbn,
      pageCount: book.pageCount,
      paperbackTrimSize: book.paperbackTrimSize,
      paperbackCoverFinish: book.paperbackCoverFinish,
      paperbackInteriorColor: book.paperbackInteriorColor,
      hardcoverTrimSize: book.hardcoverTrimSize,
      hardcoverCoverFinish: book.hardcoverCoverFinish,
      hardcoverInteriorColor: book.hardcoverInteriorColor,
    }));
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export async function getDashboardBooksAction() {
  try {
    await dbConnect();
    const books = await Book.find({}).sort({ createdAt: -1 }).lean();
    
    return books.map((book: any) => ({
      id: book.slug,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      email: book.email,
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      status: book.status,
      image: book.image,
      coverPdf: book.coverPdf,
      manuscriptUrl: book.manuscriptUrl,
      createdAt: book.createdAt.toISOString(),
      pageCount: book.pageCount,
      descriptionHtml: book.descriptionHtml,
      isbn: book.isbn,
      language: book.language,
      specification: book.specification,
      priceEbook: book.priceEbook,
      pricePaperback: book.pricePaperback,
      priceHardcover: book.priceHardcover,
      
      // Technical Specs
      paperbackTrimSize: book.paperbackTrimSize,
      paperbackCoverFinish: book.paperbackCoverFinish,
      paperbackInteriorColor: book.paperbackInteriorColor,
      hardcoverTrimSize: book.hardcoverTrimSize,
      hardcoverCoverFinish: book.hardcoverCoverFinish,
      hardcoverInteriorColor: book.hardcoverInteriorColor,
      
      // Map database prices to format objects for the dashboard UI
      kindle: { 
        status: book.priceEbook > 0 ? 'LIVE' : 'NONE', 
        price: book.priceEbook 
      },
      paperback: { 
        status: book.pricePaperback > 0 ? 'LIVE' : 'NONE', 
        price: book.pricePaperback 
      },
      hardcover: { 
        status: book.priceHardcover > 0 ? 'LIVE' : 'NONE', 
        price: book.priceHardcover 
      }
    }));
  } catch (error) {
    console.error('Failed to fetch dashboard books:', error);
    return [];
  }
}

export async function updateBookDetailsAction(slug: string, rawFormData: FormData) {
  try {
    await dbConnect();
    const book = await Book.findOne({ slug });
    if (!book) throw new Error("Book not found");

    const data: any = {};
    rawFormData.forEach((value, key) => {
      data[key] = value;
    });

    // 0. Handle File Saving
    const authorFolder = (data.fullName || book.author).replace(/\s+/g, '-');
    const titleFolder = (data.title || book.title).replace(/\s+/g, '-');
    const bookFolderName = `${authorFolder}-${titleFolder}`.replace(/[^a-zA-Z0-9-]/g, '');
    const uploadDir = join(process.cwd(), 'public', 'library', bookFolderName);

    const saveFile = async (file: any, prefix: string) => {
      if (!file || typeof file === 'string' || !(file instanceof File) || file.size === 0) return null;
      
      await fs.mkdir(uploadDir, { recursive: true });
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      return `/library/${bookFolderName}/${fileName}`;
    };

    const imageFile = rawFormData.get('image') as File;
    const coverPdfFile = rawFormData.get('coverPdf') as File;
    const manuscriptFile = rawFormData.get('manuscriptUrl') as File;

    const imageUrl = await saveFile(imageFile, 'front');
    const coverPdfUrl = await saveFile(coverPdfFile, 'cover-pdf');
    const manuscriptUrl = await saveFile(manuscriptFile, 'ms');

    const updateFields: any = {};
    
    // Explicitly pick fields from form data to avoid schema pollution
    if (data.title) updateFields.title = data.title;
    if (data.subtitle) updateFields.subtitle = data.subtitle;
    if (data.fullName) updateFields.author = data.fullName;
    if (data.email) updateFields.email = data.email;
    if (data.descriptionHtml) updateFields.descriptionHtml = data.descriptionHtml;
    if (data.isbn) updateFields.isbn = data.isbn;
    if (data.language) updateFields.language = data.language;
    if (data.specification) updateFields.specification = data.specification;
    if (data.pageCount) updateFields.pageCount = Number(data.pageCount);
    
    // Pricing
    if (data.priceEbook !== undefined) updateFields.priceEbook = Number(data.priceEbook);
    if (data.pricePaperback !== undefined) updateFields.pricePaperback = Number(data.pricePaperback);
    if (data.priceHardcover !== undefined) updateFields.priceHardcover = Number(data.priceHardcover);

    // Physical Specifications
    if (data.paperbackTrimSize) updateFields.paperbackTrimSize = data.paperbackTrimSize;
    if (data.paperbackCoverFinish) updateFields.paperbackCoverFinish = data.paperbackCoverFinish;
    if (data.paperbackInteriorColor) updateFields.paperbackInteriorColor = data.paperbackInteriorColor;
    if (data.hardcoverTrimSize) updateFields.hardcoverTrimSize = data.hardcoverTrimSize;
    if (data.hardcoverCoverFinish) updateFields.hardcoverCoverFinish = data.hardcoverCoverFinish;
    if (data.hardcoverInteriorColor) updateFields.hardcoverInteriorColor = data.hardcoverInteriorColor;

    if (imageUrl) updateFields.image = imageUrl;
    if (coverPdfUrl) updateFields.coverPdf = coverPdfUrl;
    if (manuscriptUrl) updateFields.manuscriptUrl = manuscriptUrl;
    if (data.status) updateFields.status = data.status;

    console.log("🛠️ Updating book with fields:", Object.keys(updateFields));
    Object.assign(book, updateFields);
    await book.save();

    console.log("✅ UPDATE SUCCESS: Book updated successfully");
    revalidatePath('/dashboard');
    revalidatePath('/bookstore');

    return { success: true, book: JSON.parse(JSON.stringify(book)) };
  } catch (error: any) {
    console.error('Failed to update book details:', error);
    return { success: false, error: error.message };
  }
}

export async function getBookAction(id: string) {
  try {
    await dbConnect();
    const book = await Book.findOne({ slug: id }).lean() as any;

    if (!book) return undefined;

    return {
      id: book.slug,
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      email: book.email,
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      price: {
        paperback: book.pricePaperback,
        ebook: book.priceEbook,
        hardcover: book.priceHardcover
      },
      image: book.image,
      coverPdf: book.coverPdf,
      manuscriptUrl: book.manuscriptUrl,
      luluPaperbackId: book.luluPaperbackId,
      luluHardcoverId: book.luluHardcoverId,
      descriptionHtml: book.descriptionHtml,
      status: book.status,
      language: book.language,
      published: book.published,
      imprint: book.imprint,
      isbn: book.isbn,
      pageCount: book.pageCount,
      paperbackTrimSize: book.paperbackTrimSize,
      paperbackCoverFinish: book.paperbackCoverFinish,
      paperbackInteriorColor: book.paperbackInteriorColor,
      hardcoverTrimSize: book.hardcoverTrimSize,
      hardcoverCoverFinish: book.hardcoverCoverFinish,
      hardcoverInteriorColor: book.hardcoverInteriorColor,
    };
  } catch (error) {
    console.error(`Failed to fetch book with id ${id}:`, error);
    return undefined;
  }
}

export async function updateBookCoverAction(slug: string, rawFormData: FormData) {
  try {
    const imageFile = rawFormData.get('image') as File;
    if (!imageFile) throw new Error("No image file provided");

    await dbConnect();
    const book = await Book.findOne({ slug });
    if (!book) throw new Error("Book not found");

    const authorFolder = book.author.replace(/\s+/g, '-');
    const titleFolder = book.title.replace(/\s+/g, '-');
    const bookFolderName = `${authorFolder}-${titleFolder}`.replace(/[^a-zA-Z0-9-]/g, '');
    const uploadDir = join(process.cwd(), 'public', 'library', bookFolderName);

    await fs.mkdir(uploadDir, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `front-${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
    const filePath = join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);
    const imageUrl = `/library/${bookFolderName}/${fileName}`;

    book.image = imageUrl;
    await book.save();

    revalidatePath('/dashboard');
    revalidatePath('/bookstore');
    revalidatePath(`/bookstore/${slug}`);

    return { success: true, imageUrl };
  } catch (error: any) {
    console.error('Failed to update book cover:', error);
    return { success: false, error: error.message };
  }
}

export async function publishBookAction(rawFormData: FormData) {
  const data: any = {};
  rawFormData.forEach((value, key) => {
    data[key] = value;
  });

  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  try {
    // 0. Handle File Saving Locally in a professional structure
    const authorFolder = data.fullName.replace(/\s+/g, '-');
    const titleFolder = data.title.replace(/\s+/g, '-');
    const bookFolderName = `${authorFolder}-${titleFolder}`.replace(/[^a-zA-Z0-9-]/g, '');
    
    const uploadDir = join(process.cwd(), 'public', 'library', bookFolderName);
    
    // Ensure the book-specific folder exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const saveFile = async (file: File | null, prefix: string) => {
      if (!file) return '';
      if (typeof file === 'string') return file;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${prefix}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = join(uploadDir, fileName);
      
      await fs.writeFile(filePath, buffer);
      return `/library/${bookFolderName}/${fileName}`;
    };

    const imageFile = rawFormData.get('image') as File;
    const coverPdfFile = rawFormData.get('coverPdf') as File;
    const manuscriptFile = rawFormData.get('manuscriptUrl') as File;

    const imageUrl = await saveFile(imageFile, 'front');
    const coverPdfUrl = await saveFile(coverPdfFile, 'cover-pdf');
    const manuscriptUrl = await saveFile(manuscriptFile, 'ms');

    let luluPaperbackId = '';
    let luluHardcoverId = '';

    // Verify required assets exist
    if (!manuscriptUrl || !coverPdfUrl) {
      console.log("❌ CRITICAL: Missing manuscript or cover pdf.");
      return { 
        success: false, 
        error: "Required Publishing assets (Book Cover PDF and Manuscript) are missing." 
      };
    }

    const pricePaperback = parseFloat(data.pricePaperback) || 0;
    const priceHardcover = parseFloat(data.priceHardcover) || 0;
    const priceEbook = parseFloat(data.priceEbook) || 0;

    // 1. PAPERBACK OFFLINE ID GENERATION
    if (pricePaperback > 0) {
      luluPaperbackId = generateLuluPodId({
        trimSize: data.paperbackTrimSize,
        interiorColor: data.paperbackInteriorColor,
        binding: 'PB',
        coverFinish: data.paperbackCoverFinish
      });
      console.log(`✅ Generated Offline Paperback POD ID: ${luluPaperbackId}`);
    }

    // 2. HARDCOVER OFFLINE ID GENERATION
    if (priceHardcover > 0) {
      luluHardcoverId = generateLuluPodId({
        trimSize: data.hardcoverTrimSize,
        interiorColor: data.hardcoverInteriorColor,
        binding: 'HC',
        coverFinish: data.hardcoverCoverFinish
      });
      console.log(`✅ Generated Offline Hardcover POD ID: ${luluHardcoverId}`);
    }

    // 3. DATABASE INSERTION (No external API overhead)
    console.log("⚡ Connecting to MongoDB...");
    await dbConnect();

    const book = await Book.create({
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      title: data.title,
      subtitle: data.subtitle,
      author: data.fullName,
      email: data.email,
      genre: data.genre,
      descriptionHtml: data.descriptionHtml || '<p>No description provided yet.</p>',
      pricePaperback,
      priceEbook,
      priceHardcover,
      isbn: data.isbn,
      pageCount: data.pageCount,
      language: data.language || 'English',
      specification: data.specification,
      image: imageUrl || '/assets/images/placeholder-book.png',
      coverPdf: coverPdfUrl,
      manuscriptUrl: manuscriptUrl,
      luluPaperbackId,
      luluHardcoverId,
      status: 'PENDING',

      // Physical specs saved for record-keeping
      paperbackTrimSize: data.paperbackTrimSize,
      paperbackCoverFinish: data.paperbackCoverFinish,
      paperbackInteriorColor: data.paperbackInteriorColor,

      hardcoverTrimSize: data.hardcoverTrimSize,
      hardcoverCoverFinish: data.hardcoverCoverFinish,
      hardcoverInteriorColor: data.hardcoverInteriorColor,
    });

    console.log("🎉 DATABASE SUCCESS: Book saved successfully under slug:", book.slug);
    revalidatePath('/bookstore');

    return { success: true, book: JSON.parse(JSON.stringify(book)) };

  } catch (error: any) {
    console.error('❌ GLOBAL CRITICAL FAILURE:', error);
    return { 
      success: false, 
      error: error?.message || 'Internal Server Error' 
    };
  }
}