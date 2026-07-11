const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const loader = document.getElementById('loader');
const resultArea = document.getElementById('resultArea');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');

let selectedFile = null;

// Upload area par click karne se file selection open hogi
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

// Jab user koi image select kar le
imageInput.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
    
    if (selectedFile) {
        // Original image ko screen par dikhana
        originalImage.src = URL.createObjectURL(selectedFile);
        resultArea.style.display = 'flex';
        resultImage.src = ''; 
        downloadBtn.style.display = 'none'; 
        
        // Process button ko enable karna
        processBtn.disabled = false;
        processBtn.innerText = "Remove Background";
    }
});

// Jab "Remove Background" button par click ho
processBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    // UI ko loading state mein lana
    processBtn.disabled = true;
    loader.style.display = 'block';
    
    // Data tayar karna jo backend ko bhejna hai
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
        // Python server ko request bhejna
        const response = await fetch('http://127.0.0.1:5000/remove-bg', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Processing mein masla aaya hai. Server check karein.");
        }

        // Backend se aane wali image ko receive karna
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        // Processed image ko screen par dikhana
        resultImage.src = imageUrl;
        downloadBtn.href = imageUrl;
        downloadBtn.style.display = 'inline-block';
        
    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        // Processing ke baad loading animation band karna
        loader.style.display = 'none';
        processBtn.disabled = false;
    }
});