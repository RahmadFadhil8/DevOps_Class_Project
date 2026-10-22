type Lapangan = {
    id:string;
    gambar:string;
    judul:string;
    alamat:string;
    tipe?:'Indoor' | 'Outdoor';
    rating:number;
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
    id?: string;
    kode?: string;
    user: string;
    court:string;
    timeSlot: TimeSlot;
    status: "Pending" | "Approved" | "Rejected" | "Cancelled";
}
export type {Lapangan, Testimoni, Faq, Statistik, DaftarBooking}