type Lapangan = {
    id:number;
    gambar:string;
    judul:string;
    alamat:string;
    rating:string;
    harga:number;
    deskripsi: string;
    fasilitas: string[];
}

type Testimoni = {
    rating: string;
    testimo: string;
    namaUser: string;
    profil: string;
}

type Faq = {
    pertanyaan:string;
    jawaban:string;
}

type Statistik = {
    judul:string;
    jumlah:number
}

type TimeSlot = {
    start:string;
    end:string;
}

type DaftarBooking = {
    user: string;
    court:string;
    timeSlot: TimeSlot;
    status: "Pending" | "Approved";
}
export type {Lapangan, Testimoni, Faq, Statistik, DaftarBooking}