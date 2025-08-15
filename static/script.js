function removeBackground() {
  const input = document.getElementById("imageInput");
  const originalImage = document.getElementById("originalImage");
  const resultImage = document.getElementById("resultImage");
  const originalSize = document.getElementById("originalSize");
  const resultSize = document.getElementById("resultSize");
  const downloadBtn = document.getElementById("downloadBtn");

  if (input.files.length === 0) {
    alert("Pilih gambar terlebih dahulu!");
    return;
  }

  const file = input.files[0];
  const formData = new FormData();
  formData.append("image", file);

  // Tampilkan gambar asli & ukuran file asli
  const reader = new FileReader();
  reader.onload = function (e) {
    originalImage.src = e.target.result;
    originalSize.textContent = `Ukuran: ${(file.size / 1024).toFixed(2)} KB`;
  };
  reader.readAsDataURL(file);

  // Kirim gambar ke server
  fetch("/remove-bg", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const imageUrl = "data:image/png;base64," + data.image_base64;
      resultImage.src = imageUrl;
      resultSize.textContent = `Ukuran: ${data.result_size_kb} KB`;

      // Aktifkan tombol download
      downloadBtn.href = imageUrl;
      downloadBtn.classList.remove("hidden");
    })
    .catch((err) => {
      alert("Terjadi kesalahan: " + err.message);
    });
}

function resetImages() {
  document.getElementById("originalImage").src = "/static/image/default.png";
  document.getElementById("resultImage").src = "/static/image/default.png";
  document.getElementById("originalSize").textContent = "Ukuran: - KB";
  document.getElementById("resultSize").textContent = "Ukuran: - KB";
  document.getElementById("imageInput").value = "";
  document.getElementById("downloadBtn").classList.add("hidden");
}
