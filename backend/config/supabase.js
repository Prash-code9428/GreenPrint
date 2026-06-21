import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabaseClient = null;
let isMock = false;

// Mock database directories
const dbStoreDir = path.join(process.cwd(), 'data', 'db_store');

class FileCollection {
  constructor(name) {
    this.filePath = path.join(dbStoreDir, `${name}.json`);
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(dbStoreDir)) {
      fs.mkdirSync(dbStoreDir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read() {
    this.ensureFile();
    try {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } catch {
      return [];
    }
  }

  write(data) {
    this.ensureFile();
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}

// Fluent Mock Query Engine mimicking `@supabase/supabase-js`
class MockQueryBuilder {
  constructor(tableName) {
    this.collection = new FileCollection(tableName);
    this.filters = [];
    this.selectFields = '*';
    this.singleRow = false;
    this.orderField = null;
    this.orderDesc = false;
    this.limitVal = null;
  }

  select(fields = '*') {
    this.selectFields = fields;
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, value, op: 'eq' });
    return this;
  }

  single() {
    this.singleRow = true;
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderField = column;
    this.orderDesc = !ascending;
    return this;
  }

  limit(val) {
    this.limitVal = val;
    return this;
  }

  async executeQuery(data) {
    let result = [...data];

    // Apply filters
    for (const filter of this.filters) {
      if (filter.op === 'eq') {
        result = result.filter(item => item[filter.column] === filter.value);
      }
    }

    // Apply sorting
    if (this.orderField) {
      result.sort((a, b) => {
        const valA = a[this.orderField];
        const valB = b[this.orderField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.orderDesc ? valB - valA : valA - valB;
        }
        return this.orderDesc
          ? String(valB).localeCompare(String(valA))
          : String(valA).localeCompare(String(valB));
      });
    }

    // Apply limit
    if (this.limitVal) {
      result = result.slice(0, this.limitVal);
    }

    if (this.singleRow) {
      return result.length > 0 ? result[0] : null;
    }
    return result;
  }

  async insert(records) {
    const list = this.collection.read();
    const inserted = [];
    const isArray = Array.isArray(records);
    const recordsToInsert = isArray ? records : [records];

    for (const r of recordsToInsert) {
      const newRec = {
        id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
        created_at: new Date().toISOString(),
        ...r
      };
      list.push(newRec);
      inserted.push(newRec);
    }

    this.collection.write(list);
    
    // Fluent return chain simulation
    return {
      data: isArray ? inserted : inserted[0],
      error: null,
      select: () => ({
        single: async () => ({ data: inserted[0], error: null })
      })
    };
  }

  async update(updates) {
    const list = this.collection.read();
    let updatedCount = 0;
    let lastUpdatedDoc = null;

    const modifiedList = list.map(item => {
      // Check if item matches current eq filters
      let match = true;
      for (const filter of this.filters) {
        if (filter.op === 'eq' && item[filter.column] !== filter.value) {
          match = false;
        }
      }

      if (match) {
        updatedCount++;
        const updated = { ...item, ...updates };
        lastUpdatedDoc = updated;
        return updated;
      }
      return item;
    });

    this.collection.write(modifiedList);

    return {
      data: this.singleRow ? lastUpdatedDoc : modifiedList,
      error: null
    };
  }

  // Thenable for immediate async await on select()
  then(onfulfilled, onrejected) {
    const data = this.collection.read();
    return this.executeQuery(data)
      .then(res => onfulfilled({ data: res, error: null }))
      .catch(err => onrejected({ data: null, error: err }));
  }
}

const mockSupabase = {
  from(tableName) {
    return new MockQueryBuilder(tableName);
  }
};

// Client bootstrap
if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url') {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase Postgres connection initialized successfully.');
    isMock = false;
  } catch (err) {
    console.error('Error connecting to Supabase, falling back to mock persistence:', err.message);
    supabaseClient = mockSupabase;
    isMock = true;
  }
} else {
  console.warn('\n======================================================');
  console.warn('WARNING: Supabase URL or Key missing in .env');
  console.warn('Activating local JSON mock Supabase Postgres engine.');
  console.warn('All platform operations will persist locally to data/db_store/');
  console.warn('======================================================\n');
  supabaseClient = mockSupabase;
  isMock = true;
}

export const getSupabase = () => {
  return supabaseClient;
};

export const isDatabaseMock = () => {
  return isMock;
};
