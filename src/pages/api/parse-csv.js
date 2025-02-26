import fs from 'fs';
import path from 'path';
import papa from 'papaparse';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const filePath = path.join(process.cwd(), 'public', 'items.csv');

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = papa.parse(fileContent, { header: true, skipEmptyLines: true });
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
