import Airtable from 'airtable';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Airtable configuration
export const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
export const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';


// Configure Airtable
const airtable = new Airtable({
  apiKey: AIRTABLE_API_KEY
}).base(AIRTABLE_BASE_ID);

export default airtable;