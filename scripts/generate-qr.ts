import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateQRCodes() {
  console.log('Fetching guests from Supabase...');
  
  const { data: guests, error } = await supabase
    .from('guestbook')
    .select('id, name');

  if (error) {
    console.error('Error fetching guests:', error);
    return;
  }

  if (!guests || guests.length === 0) {
    console.log('No guests found in database.');
    return;
  }

  const outputDir = path.join(process.cwd(), 'public', 'qrcodes');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating QR Codes for ${guests.length} guests...`);

  for (const guest of guests) {
    const qrData = JSON.stringify({
      id: guest.id,
      name: guest.name,
      event: "Wedding Habibie & Lala"
    });

    const fileName = `${guest.id}.png`;
    const filePath = path.join(outputDir, fileName);

    try {
      await QRCode.toFile(filePath, qrData, {
        color: {
          dark: '#4d694d', // Sage 600
          light: '#ffffff'
        },
        width: 400
      });
      console.log(`✓ Generated QR for: ${guest.name}`);
    } catch (err) {
      console.error(`× Failed to generate QR for ${guest.name}:`, err);
    }
  }

  console.log('\nAll QR Codes have been generated in: /public/qrcodes/');
}

generateQRCodes();
