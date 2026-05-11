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
  trimSize: string;      // e.g., "6 x 9", "5.5 x 8.5"
  interiorColor: string; // e.g., "Black & White Standard", "Standard Color"
  binding: 'PB' | 'HC';  // PB = Paperback (Perfect Bound), HC = Hardcover (Case Wrap)
  coverFinish: string;   // e.g., "Gloss", "Matte"
}) {
  // 1. Map Trim Sizes
  let trimCode = '0600X0900'; // Default 6 x 9
  if (specs.trimSize === '5.5 x 8.5') trimCode = '0550X0850';
  if (specs.trimSize === '8.5 x 11') trimCode = '0850X1100';

  // 2. Map Interior Ink Colors
  let inkCode = 'BW'; // Default Black & White Standard
  if (specs.interiorColor === 'Standard Color' || specs.interiorColor === 'Premium Color') {
    inkCode = 'FC'; // Full Color
  }

  // 3. Map Cover Finishes
  const finishCode = specs.coverFinish === 'Matte' ? 'MXX' : 'GXX';

  // 4. Set standard defaults for Quality and Paper Type
  const qualityCode = 'STD';  // Standard Quality
  const paperCode = '060UW';  // 60# Uncoated White

  // Build: Trim.Ink.Quality.Binding.Paper.Finish
  return `${trimCode}.${inkCode}.${qualityCode}.${specs.binding}.${paperCode}.${finishCode}`;
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
      coverBack: book.coverBack,
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
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      status: book.status,
      image: book.image,
      coverBack: book.coverBack,
      manuscriptUrl: book.manuscriptUrl,
      createdAt: book.createdAt.toISOString(),
      pageCount: book.pageCount,
      descriptionHtml: book.descriptionHtml,
      isbn: book.isbn,
      language: book.language,
      
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

export async function updateBookDetailsAction(slug: string, updateData: any) {
  try {
    await dbConnect();
    const book = await Book.findOneAndUpdate({ slug }, updateData, { new: true });
    
    if (!book) throw new Error("Book not found");

    revalidatePath('/dashboard');
    revalidatePath('/bookstore');
    revalidatePath(`/bookstore/${slug}`);

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
      genre: book.genre,
      rating: book.rating,
      reviews: book.reviews,
      price: {
        paperback: book.pricePaperback,
        ebook: book.priceEbook,
        hardcover: book.priceHardcover
      },
      image: book.image,
      coverBack: book.coverBack,
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
      if (!file || typeof file === 'string') return file as string || '';
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${prefix}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = join(uploadDir, fileName);
      
      await fs.writeFile(filePath, buffer);
      return `/library/${bookFolderName}/${fileName}`;
    };

    const imageFile = rawFormData.get('image') as File;
    const coverBackFile = rawFormData.get('coverBack') as File;
    const manuscriptFile = rawFormData.get('manuscriptUrl') as File;

    const imageUrl = await saveFile(imageFile, 'front');
    const coverBackUrl = await saveFile(coverBackFile, 'back');
    const manuscriptUrl = await saveFile(manuscriptFile, 'ms');

    let luluPaperbackId = '';
    let luluHardcoverId = '';

    // Verify required assets exist
    if (!manuscriptUrl || !imageUrl) {
      console.log("❌ CRITICAL: Missing manuscript or cover image.");
      return { 
        success: false, 
        error: "Required Publishing assets (Front Cover and Manuscript) are missing." 
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
      genre: data.genre,
      descriptionHtml: data.descriptionHtml || '<p>No description provided yet.</p>',
      pricePaperback,
      priceEbook,
      priceHardcover,
      isbn: data.isbn,
      pageCount: data.pageCount,
      language: data.language || 'English',
      image: imageUrl || '/assets/images/placeholder-book.png',
      coverBack: coverBackUrl,
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