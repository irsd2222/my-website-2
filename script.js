document.getElementById("calculator-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form melakukan reload halaman saat disubmit

    // Mengambil nilai ketinggian dari input
    const height = parseFloat(document.getElementById("height").value);
    
    // Memastikan input ketinggian valid
    if (isNaN(height) || height < 0) {
        alert("Mohon masukkan ketinggian yang valid.");
        return;
    }

    // Konstanta
    const P0 = 101325;  // Tekanan atmosfer di permukaan laut (Pa)
    const L = 0.0065;   // Laju penurunan suhu (K/m)
    const T0 = 288.15;  // Suhu di permukaan laut (K)
    const g = 9.81;     // Percepatan gravitasi (m/s²)
    const M = 0.029;    // Massa molar udara (kg/mol)
    const R = 8.314;    // Konstanta gas ideal (J/(mol·K))

    // Fungsi untuk menghitung tekanan atmosfer pada ketinggian tertentu
    function pressureAtAltitude(h) {
        const exponent = (g * M) / (R * L);
        return P0 * Math.pow(1 - (L * h) / T0, exponent);
    }

    // Menghitung tekanan atmosfer berdasarkan ketinggian yang dimasukkan
    const pressure = pressureAtAltitude(height);

    // Menampilkan hasil
    document.getElementById("pressure").textContent = `Tekanan pada ketinggian ${height} meter adalah ${pressure.toFixed(2)} Pa`;
});
