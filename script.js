// ============================================================
//  AIRES MINERAL — script.js
//  Ditulis oleh: Kelompok TRPL
//  Dihubungkan dari: index.html via <script src="script.js">
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================================
  // FITUR 1: UPDATE TAHUN OTOMATIS (FOOTER)
  // Mengambil tahun saat ini dari sistem dan memasukkannya ke
  // elemen <span id="tahun-sekarang"> di footer, sehingga
  // tidak perlu diperbarui manual setiap tahun.
  // ==========================================================
  const elemenTahun = document.getElementById("tahun-sekarang");
  if (elemenTahun) {
    elemenTahun.textContent = new Date().getFullYear();
  }


  // ==========================================================
  // FITUR 2: VALIDASI FORM & KIRIM KE WHATSAPP
  // ==========================================================

  // --- Ambil referensi elemen form ---
  const form       = document.getElementById("form-pemesanan");
  const inputNama  = document.getElementById("nama");
  const inputEmail = document.getElementById("email");
  const inputNowa  = document.getElementById("nowa");
  const inputMerek = document.getElementById("merek");
  const inputPesan = document.getElementById("pesan");

  // ----------------------------------------------------------
  // showError(el, msg)
  // Menampilkan pesan error di bawah kolom yang tidak valid.
  // Selain teks pesan, kolom juga diberi border merah via
  // kelas CSS .input-error agar pengguna langsung tahu.
  // aria-invalid memberi sinyal ke pembaca layar (aksesibilitas).
  // ----------------------------------------------------------
  function showError(el, msg) {
    const span = document.getElementById("error-" + el.id);
    if (!span) return;

    span.textContent   = msg;
    span.style.display = "block";
    el.classList.add("input-error");
    el.setAttribute("aria-invalid", "true");
  }

  // ----------------------------------------------------------
  // clearError(el)
  // Menghapus pesan error dan mengembalikan tampilan kolom
  // ke kondisi normal. Dipanggil saat pengguna mulai mengetik
  // atau memilih opsi di kolom yang sebelumnya bermasalah.
  // ----------------------------------------------------------
  function clearError(el) {
    const span = document.getElementById("error-" + el.id);
    if (!span) return;

    span.textContent   = "";
    span.style.display = "none";
    el.classList.remove("input-error");
    el.removeAttribute("aria-invalid");
  }

  // ----------------------------------------------------------
  // isEmailValid(email)
  // Memeriksa format email dengan regex sederhana:
  // harus ada karakter sebelum @, sesudah @, dan setelah titik.
  // Contoh valid    : budi@email.com
  // Contoh tidak valid: budi@, budi.com, @email.com
  // ----------------------------------------------------------
  function isEmailValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ----------------------------------------------------------
  // isNoWAValid(nowa)
  // Memeriksa nomor WhatsApp Indonesia:
  // - Harus diawali 08 atau 628
  // - Hanya boleh berisi angka
  // - Total panjang 10-15 digit
  // Contoh valid    : 08123456789, 6281234567890
  // Contoh tidak valid: 12345, 08abc, +628...
  // ----------------------------------------------------------
  function isNoWAValid(nowa) {
    return /^(08|628)\d{8,13}$/.test(nowa);
  }

  // --- Hapus error secara real-time saat pengguna berinteraksi ---
  // Pesan error akan langsung hilang begitu pengguna mulai
  // memperbaiki kolom yang bersangkutan, bukan baru hilang
  // setelah menekan Submit lagi.
  if (inputNama)  inputNama.addEventListener("input",  () => clearError(inputNama));
  if (inputEmail) inputEmail.addEventListener("input",  () => clearError(inputEmail));
  if (inputNowa)  inputNowa.addEventListener("input",   () => clearError(inputNowa));
  if (inputMerek) inputMerek.addEventListener("change", () => clearError(inputMerek));
  if (inputPesan) inputPesan.addEventListener("input",  () => clearError(inputPesan));

  // --- Event submit form ---
  if (form) {
    form.addEventListener("submit", function (event) {
      // Mencegah form melakukan reload halaman bawaan browser
      event.preventDefault();

      let isValid = true;

      // -- Validasi Nama --
      if (inputNama.value.trim() === "") {
        showError(inputNama, "Nama tidak boleh kosong.");
        isValid = false;
      }

      // -- Validasi Email --
      const emailValue = inputEmail.value.trim();
      if (emailValue === "") {
        showError(inputEmail, "Email tidak boleh kosong.");
        isValid = false;
      } else if (!isEmailValid(emailValue)) {
        showError(inputEmail, "Format email tidak valid (contoh: nama@email.com).");
        isValid = false;
      }

      // -- Validasi Nomor WhatsApp --
      const nowaValue = inputNowa.value.trim();
      if (nowaValue === "") {
        showError(inputNowa, "Nomor WhatsApp tidak boleh kosong.");
        isValid = false;
      } else if (!isNoWAValid(nowaValue)) {
        showError(inputNowa, "Nomor harus diawali 08 atau 628, hanya angka, 10-15 digit.");
        isValid = false;
      }

      // -- Validasi Merek / Produk --
      if (!inputMerek.value) {
        showError(inputMerek, "Silakan pilih produk terlebih dahulu.");
        isValid = false;
      }

      // -- Validasi Pesan / Alamat --
      if (inputPesan.value.trim() === "") {
        showError(inputPesan, "Kolom pesan atau alamat tidak boleh kosong.");
        isValid = false;
      }

      // Jika ada error: gulir halaman ke kolom pertama yang bermasalah
      // agar pengguna tidak bingung mencari kolom yang perlu diperbaiki
      if (!isValid) {
        const kolomError = form.querySelector(".input-error");
        if (kolomError) {
          kolomError.scrollIntoView({ behavior: "smooth", block: "center" });
          kolomError.focus();
        }
        return; // Hentikan proses, jangan kirim ke WhatsApp
      }

      // -- Semua kolom valid: susun pesan & buka WhatsApp --
      const pesanWA =
        "Halo, saya ingin memesan:\n\n"                   +
        "Nama        : " + inputNama.value.trim()  + "\n" +
        "Email       : " + inputEmail.value.trim() + "\n" +
        "Produk      : " + inputMerek.value        + "\n" +
        "No. WA      : " + inputNowa.value.trim()  + "\n" +
        "Ket./Alamat : " + inputPesan.value.trim();

      const nomorWA      = "6281377848890";
      const pesanEncoded = encodeURIComponent(pesanWA);

      // Buka aplikasi / web WhatsApp di tab baru
      window.open("https://wa.me/" + nomorWA + "?text=" + pesanEncoded, "_blank");

      // Tampilkan notifikasi sukses, lalu reset semua kolom
      alert("Pesan Anda berhasil dikirim. Kami akan segera menghubungi Anda.");
      form.reset();
    });
  }


  // ==========================================================
  // FITUR 3: SCROLL-TO-TOP BUTTON
  //
  // Tombol muncul setelah halaman digulir lebih dari 300px,
  // dan menghilang kembali saat kembali ke atas.
  //
  // Teknik: kelas CSS .visible di-toggle oleh JS, sementara
  // transisi fade + geser ditangani sepenuhnya oleh CSS
  // (opacity, visibility, transform). Ini lebih mulus daripada
  // mengubah display:none/block langsung via JS, karena
  // properti display tidak bisa dianimasikan oleh CSS transition.
  //
  // Throttle 100ms mencegah fungsi dipanggil ratusan kali
  // per detik saat pengguna menggulir halaman dengan cepat.
  // ==========================================================
  const btnScrollTop = document.getElementById("btn-back-to-top");

  if (btnScrollTop) {
    let scrollTimer = null;

    function periksaScroll() {
      if (window.scrollY > 300) {
        btnScrollTop.classList.add("visible");    // tombol muncul (fade-in)
      } else {
        btnScrollTop.classList.remove("visible"); // tombol hilang (fade-out)
      }
    }

    // Throttle: jalankan periksaScroll maksimal 1x per 100ms
    window.addEventListener("scroll", function () {
      if (scrollTimer) return;          // abaikan jika timer masih berjalan
      scrollTimer = setTimeout(function () {
        periksaScroll();
        scrollTimer = null;             // lepas kunci setelah selesai
      }, 100);
    });

    // Periksa posisi awal (berguna jika halaman dibuka di tengah)
    periksaScroll();

    // Klik tombol -> gulir halus ke paling atas
    btnScrollTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

}); // akhir DOMContentLoaded