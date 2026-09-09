# Clean-Room Local Development Setup

This runbook guides an engineer through setting up the complete Nayom development environment from a completely clean machine.

---

## 1. System Prerequisites

* **Operating System**: Windows 10/11, macOS (Apple Silicon or Intel), or Ubuntu 22.04+ LTS.
* **Python**: Python 3.10, 3.11, or 3.12 (64-bit).
* **Node.js & npm**: Node.js v18.0.0+ LTS or v20.0.0+ (Tested on v24.18.0). npm v9.0.0+.
* **Git**: v2.30.0+.
* **External Scraper Binary**: `gosom/google-maps-scraper` v1.x (Bundled for Windows as `google-maps-scraper.exe`).
* **Terminal Shell**: PowerShell / CMD on Windows, Bash / Zsh on Linux/macOS.

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/Aryan-d13/nayom-repo.git nayom
cd nayom
```

### Step 2: Configure Python Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Activate on Linux/macOS
source venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

*(Optional) Install Playwright Browser Binaries for Headless Crawling:*
```bash
playwright install chromium
```

### Step 4: Verify or Download Scraper Binary
If running on Windows, verify that `google-maps-scraper.exe` exists in the repository root:
```powershell
Get-Item google-maps-scraper.exe
```
If running on Linux or macOS, download the appropriate binary via the setup script:
```bash
python scripts/setup_scraper.py
```

### Step 5: Install Frontend Dependencies (Admin Console)
```bash
cd admin
npm install
cd ..
```

### Step 6: Environment Configuration
Copy the template configuration file:
```bash
cp .env.example .env  # On Windows: copy .env.example .env
```
Open `.env` in an editor and configure your credentials. At minimum, configure:
```ini
# Google Gemini API (Required for Intelligence and Email Generation)
GEMINI_API_KEY=your_gemini_api_key_here

# At least one deployment token (if testing live deployment)
VERCEL_TOKEN=your_vercel_token_here

# At least one email provider (if testing live email dispatch)
RESEND_API_KEY=your_resend_api_key_here
```

---

## 3. Verification & Smoke Test

### 1. Verify Test Suite
Run the unit test suite to ensure all contracts and modules are functioning:
```bash
pytest tests/ -q
```
*Expected output: `122 passed`.*

### 2. Verify Scraper Execution
Run a dry-run single-tile test:
```bash
python main.py maps "coffee shops in Austin TX" --limit 2 --fast-mode
```
*Expected output: Discovers 2 businesses and outputs normalized JSON to `data/normalized/`.*

### 3. Verify Admin Console Build
```bash
cd admin
npm run build
cd ..
```
*Expected output: Next.js compiles cleanly (`✓ Compiled successfully`).*

---

## 4. Running the Development Services

To run the complete local environment, open two terminal windows:

### Terminal 1: FastAPI Control Plane
```bash
python main.py server --host 127.0.0.1 --port 8000 --reload
```
* Swagger UI available at: `http://127.0.0.1:8000/docs`

### Terminal 2: Next.js Operations Console
```bash
cd admin
npm run dev
```
* Operations Console available at: `http://localhost:3000`
