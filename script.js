// 1. Fungsi Load Template
async function loadTemplate(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Gagal load file template");
    return await res.arrayBuffer();
}

function getFormattedDates(dateValue) {
    if (!dateValue) return { hari: "", tipe1: "", tipe2: "", tipe3: "" };
    
    const d = new Date(dateValue);
    const tgl = String(d.getDate()).padStart(2, '0');
    const bln = String(d.getMonth() + 1).padStart(2, '0');
    const thn = d.getFullYear();
    
    const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    return {
        hari: namaHari[d.getDay()], 
        tipe1: `${tgl}-${bln}-${thn}`,
        tipe2: `${d.getDate()} ${namaBulan[d.getMonth()]} ${thn}`, 
        tipe3: `${tgl}/${bln}/${thn}`  
    };
}
function toggleAll(source) {
    const checkboxes = document.querySelectorAll('.tpl-check');
    checkboxes.forEach(cb => {
        cb.checked = source.checked;
    });
    updateFields();
}

function updateFields() {
    const checkboxes = document.querySelectorAll('.tpl-check');
    const checkAll = document.getElementById('cekSemua');
    
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    const noneChecked = Array.from(checkboxes).every(cb => !cb.checked);
    
    if (allChecked) {
        checkAll.checked = true;
        checkAll.indeterminate = false;
    } else if (noneChecked) {
        checkAll.checked = false;
        checkAll.indeterminate = false;
    } else {
        checkAll.checked = false;
        checkAll.indeterminate = true; 
    }

    const tpl1 = document.querySelector('.tpl-check[value="0"]').checked;
    const tpl2 = document.querySelector('.tpl-check[value="1"]').checked;
    const tpl3 = document.querySelector('.tpl-check[value="2"]').checked;
    const tpl4 = document.querySelector('.tpl-check[value="3"]').checked;
    const tpl5 = document.querySelector('.tpl-check[value="4"]').checked;
    const tpl6 = document.querySelector('.tpl-check[value="5"]').checked;
    const tpl7 = document.querySelector('.tpl-check[value="6"]').checked;
    const tpl8 = document.querySelector('.tpl-check[value="7"]').checked;
    const tpl9 = document.querySelector('.tpl-check[value="8"]').checked;
    const tpl10 = document.querySelector('.tpl-check[value="9"]').checked;
    const tpl11 = document.querySelector('.tpl-check[value="10"]').checked;
    const tpl12 = document.querySelector('.tpl-check[value="11"]').checked;
    const tpl13 = document.querySelector('.tpl-check[value="12"]').checked;

    const anyChecked = tpl1 || tpl2 || tpl3 || tpl4 || tpl5 || tpl6 || tpl7 || tpl8 || tpl9 || tpl10 || tpl11 || tpl12 || tpl13;

    document.getElementById('group-namaN').style.display = (tpl1 || tpl2 || tpl3 || tpl4 || tpl5 || tpl6 || tpl7 || tpl8 || tpl9 || tpl10 || tpl11 || tpl12 || tpl13) ? 'block' : 'none';
    document.getElementById('group-alamatN').style.display = (tpl1 || tpl2 || tpl3 || tpl4 || tpl5 || tpl7 || tpl9 ||tpl13) ? 'block' : 'none';
    document.getElementById('group-noKTPN').style.display = (tpl1 || tpl2 || tpl3 || tpl4 || tpl5 || tpl7 || tpl13) ? 'block' : 'none';
    document.getElementById('group-noRekN').style.display = (tpl2 || tpl6 || tpl8) ? 'block' : 'none';
    document.getElementById('group-ttlN').style.display = tpl5 ? 'block' : 'none';
    document.getElementById('group-noTelN').style.display = (tpl2 || tpl4 || tpl5 || tpl7 || tpl9) ? 'block' : 'none';

    document.getElementById('group-namaP').style.display = (tpl1 || tpl5 || tpl9 || tpl10 || tpl12) ? 'block' : 'none';
    document.getElementById('group-alamatP').style.display = (tpl5 || tpl9) ? 'block' : 'none';
    document.getElementById('group-noKTPP').style.display = tpl5 ? 'block' : 'none';
    document.getElementById('group-ttlP').style.display = tpl5 ? 'block' : 'none';
    document.getElementById('group-noTelP').style.display = (tpl5 || tpl9)? 'block' : 'none';



    document.getElementById('group-noAkad').style.display = (tpl1 || tpl2 || tpl7 || tpl9 || tpl10 || tpl11 || tpl12 || tpl13) ? 'block' : 'none';
    document.getElementById('group-tanggal').style.display = anyChecked ? 'block' : 'none';
    document.getElementById('group-namaDoc').style.display = anyChecked ? 'block' : 'none';

    
    const btn = document.querySelector('button');
    const totalSelected = document.querySelectorAll('.tpl-check:checked').length;
    
    if (totalSelected > 1) {
        btn.innerText = `Generate ${totalSelected} Dokumen (.zip)`;
    } else if (totalSelected === 1) {
        btn.innerText = "Generate Dokumen (.docx)";
    } else {
        btn.innerText = "Pilih Template";
    }
}

window.onload = updateFields;


async function generate() {
    const tglValue = document.getElementById("tglInput").value;
    const formatTgl = getFormattedDates(tglValue);

    const data = {
        namaN: document.getElementById("namaN").value,
        namaP: document.getElementById("namaP").value,
        alamatN: document.getElementById("alamatN").value,
        alamatP: document.getElementById("alamatP").value,
        noKTPN: document.getElementById("noKTPN").value,
        noKTPP: document.getElementById("noKTPP").value,
        noRekN: document.getElementById("noRekN").value,
        noTelP: document.getElementById("noTelP").value,
        noTelN: document.getElementById("noTelN").value,
        noAkad: document.getElementById("noAkad").value,
        ttlP: document.getElementById("ttlP").value,
        ttlN: document.getElementById("ttlP").value,
        hari: formatTgl.hari,
        tgl1: formatTgl.tipe1,
        tgl2: formatTgl.tipe2,
        tgl3: formatTgl.tipe3,
        namaDoc: document.getElementById("namaDoc").value || "Dokumen"
    };

    const allFiles = [
        { path: "templates/template1.docx", name: `Surat Pernyataan COVER ASS - ${data.namaDoc}.docx` },
        { path: "templates/template2.docx", name: `Surat Pernyataan dan Kuasa Blokir - ${data.namaDoc}.docx` },
        { path: "templates/template3.docx", name: `Surat Pernyataan Nasabah - ${data.namaDoc}.docx` },
        { path: "templates/template4.docx", name: `Surat Debut Rekening - ${data.namaDoc}.docx` },
        { path: "templates/template5.docx", name: `SPP Pasangan - ${data.namaDoc}.docx` },
        { path: "templates/template6.docx", name: `Memo Blokir - ${data.namaDoc}.docx` },
        { path: "templates/template7.docx", name: `GCG - ${data.namaDoc}.docx` },
        { path: "templates/template8.docx", name: `FRP Pencairan - ${data.namaDoc}.docx` },
        { path: "templates/template9.docx", name: `DAFTAR HADIR AKAD - ${data.namaDoc}.docx` },
        { path: "templates/template10.docx", name: `BSTJ - ${data.namaDoc}.docx` },
        { path: "templates/template11.docx", name: `Berita Acara - ${data.namaDoc}.docx` },
        { path: "templates/template12.docx", name: `Berita Acara Akad - ${data.namaDoc}.docx` },
        { path: "templates/template13.docx", name: `Surat Pernyataan Hutang - ${data.namaDoc}.docx` },
    ];

    
    const selectedCheckboxes = document.querySelectorAll('.tpl-check:checked');
    
    if (selectedCheckboxes.length === 0) {
        alert("Silakan pilih minimal satu template!");
        return;
    }

    const zip = new JSZip();
    let processedFiles = [];

    for (let cb of selectedCheckboxes) {
        const index = cb.value;
        const file = allFiles[index];

        try {
            const content = await loadTemplate(file.path);
            const zipContent = new window.PizZip(content);
            
            const doc = new window.docxtemplater(zipContent, {
                delimiters: { start: '{{', end: '}}' },
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.setData(data);
            doc.render();

            const blob = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });

            processedFiles.push({ blob: blob, name: file.name });
        } catch (error) {
            console.error(`Error pada file ${file.path}:`, error);
        }
    }

    if (processedFiles.length === 1) {
        saveAs(processedFiles[0].blob, processedFiles[0].name);
    } else if (processedFiles.length > 1) {
        processedFiles.forEach(f => zip.file(f.name, f.blob));
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `Paket_Dokumen_${data.namaDoc}.zip`);
    }
}
function autoResize(element) {
    element.style.height = "auto";
    element.style.height = (element.scrollHeight) + "px";
}
