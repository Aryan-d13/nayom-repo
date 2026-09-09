const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    filename: 'morrow-portrait.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'health-portrait.jpg',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'balance-portrait.jpg',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'confidence-portrait.jpg',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'clean-treatment.jpg',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'straighten-treatment.jpg',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'restore-treatment.jpg',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'refine-treatment.jpg',
    url: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    filename: 'consultation.jpg',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=85'
  },
  {
    filename: 'detail-enamel.jpg',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=85'
  },
  {
    filename: 'detail-lips.jpg',
    url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=85'
  },
  {
    filename: 'detail-skin.jpg',
    url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=85'
  },
  {
    filename: 'detail-eye.jpg',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=85'
  },
  {
    filename: 'detail-smile.jpg',
    url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=85'
  },
  {
    filename: 'detail-hands.jpg',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=85'
  },
  {
    filename: 'dr-maya.jpg',
    url: 'https://images.unsplash.com/photo-1594824813593-4a1dbb1f4967?auto=format&fit=crop&w=1200&q=85'
  },
  {
    filename: 'cta-face.jpg',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85'
  }
];

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed with status ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading curated portraits to public/...');
  for (const item of images) {
    const dest = path.join(publicDir, item.filename);
    try {
      console.log(`Downloading ${item.filename}...`);
      await downloadFile(item.url, dest);
      console.log(`✓ ${item.filename}`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.filename}:`, err.message);
    }
  }
  console.log('Finished downloading portraits.');
}

main();
