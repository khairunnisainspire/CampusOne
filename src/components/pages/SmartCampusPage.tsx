import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  X,
  QrCode,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { CampusFacility, FacilityReservation, UserProfile } from '../../types';

interface SmartCampusPageProps {
  facilities: CampusFacility[];
  reservations: FacilityReservation[];
  bookedSlots: { facilityId: string; date: string; timeSlot: string; bookedBy: string }[];
  user: UserProfile;
  onCreateReservation: (params: {
    facilityId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    attendeesCount: number;
  }) => { success: boolean; error?: string; reservation?: FacilityReservation };
  onCancelReservation: (reservationId: string) => void;
}

export const SmartCampusPage: React.FC<SmartCampusPageProps> = ({
  facilities,
  reservations,
  bookedSlots,
  user,
  onCreateReservation,
  onCancelReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'my_reservations'>('facilities');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [minCapacity, setMinCapacity] = useState<number>(0);

  // Reservation Modal
  const [selectedFacility, setSelectedFacility] = useState<CampusFacility | null>(null);
  const [resDate, setResDate] = useState<string>('2026-10-30');
  const [resTimeSlot, setResTimeSlot] = useState<string>('10:00 - 12:00');
  const [resPurpose, setResPurpose] = useState<string>('Diskusi Kelompok & Persiapan Tugas Akhir');
  const [resAttendees, setResAttendees] = useState<number>(4);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<FacilityReservation | null>(null);

  // Cancel Confirmation Modal
  const [cancellingResv, setCancellingResv] = useState<FacilityReservation | null>(null);

  const categories = [
    'Semua',
    'Ruang Diskusi',
    'Laboratorium',
    'Ruang Kelas',
    'Ruang Rapat',
    'Peralatan & Studio',
  ];

  const timeSlots = [
    '08:00 - 10:00',
    '10:00 - 12:00',
    '13:00 - 15:00',
    '15:30 - 17:30',
    '18:30 - 20:30',
  ];

  const filteredFacilities = facilities.filter((fac) => {
    if (selectedCategory !== 'Semua' && fac.category !== selectedCategory) {
      return false;
    }
    if (minCapacity > 0 && fac.capacity < minCapacity) {
      return false;
    }
    return true;
  });

  const handleOpenBooking = (fac: CampusFacility) => {
    setSelectedFacility(fac);
    setBookingError(null);
    setBookingSuccess(null);
    setResAttendees(Math.min(4, fac.capacity));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;

    setBookingError(null);
    const result = onCreateReservation({
      facilityId: selectedFacility.id,
      date: resDate,
      timeSlot: resTimeSlot,
      purpose: resPurpose,
      attendeesCount: resAttendees,
    });

    if (!result.success) {
      setBookingError(result.error || 'Gagal melakukan reservasi.');
    } else {
      setBookingSuccess(result.reservation || null);
    }
  };

  // Helper to check if a specific slot is booked for selectedFacility
  const checkSlotBooked = (facilityId: string, date: string, slot: string) => {
    return bookedSlots.find(
      (b) => b.facilityId === facilityId && b.date === date && b.timeSlot === slot
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#163B70] tracking-tight">
              SmartCampus Facilities
            </h1>
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              Demo Jadwal & Reservasi
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Reservasi ruang diskusi perpustakaan, workstation AI lab, kelas pintar, dan studio multimedia kampus.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'facilities'
                ? 'bg-white text-[#163B70] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Fasilitas ({facilities.length})
          </button>
          <button
            onClick={() => setActiveTab('my_reservations')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my_reservations'
                ? 'bg-white text-[#163B70] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#3978F6]" />
            <span>Reservasi Saya ({reservations.length})</span>
          </button>
        </div>
      </div>

      {/* FACILITIES TAB */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === c
                        ? 'bg-[#163B70] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Min Capacity Filter */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Kapasitas Min:</span>
                <select
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Number(e.target.value))}
                  className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold"
                >
                  <option value={0}>Semua Kapasitas</option>
                  <option value={4}>4+ Orang</option>
                  <option value={8}>8+ Orang</option>
                  <option value={15}>15+ Orang</option>
                </select>
              </div>
            </div>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Photo Banner with Badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-md text-[#163B70] font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
                        {fac.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                          <Users className="w-3.5 h-3.5 text-teal-300" />
                          Max {fac.capacity} Orang
                        </span>
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                          <Clock className="w-3.5 h-3.5 text-amber-300" />
                          {fac.openHours}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#163B70] transition-colors">
                        {fac.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {fac.building}, {fac.floor}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {fac.description}
                    </p>

                    {/* Amenities Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Fasilitas Tersedia:</span>
                      <div className="flex flex-wrap gap-1">
                        {fac.amenities.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                          >
                            ✓ {a}
                          </span>
                        ))}
                        {fac.amenities.length > 3 && (
                          <span className="text-[10px] bg-blue-50 text-[#3978F6] px-1.5 py-0.5 rounded font-bold">
                            +{fac.amenities.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Tersedia Hari Ini
                  </span>

                  <button
                    onClick={() => handleOpenBooking(fac)}
                    className="px-4 py-2 bg-[#163B70] hover:bg-[#1e4885] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reservasi Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MY RESERVATIONS TAB */}
      {activeTab === 'my_reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">Belum ada reservasi aktif</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan pilih fasilitas pada tab "Daftar Fasilitas" untuk memesan ruang diskusi atau laboratorium.
              </p>
              <button
                onClick={() => setActiveTab('facilities')}
                className="px-4 py-2 bg-[#3978F6] text-white text-xs font-bold rounded-xl"
              >
                Pilih Fasilitas Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((resv) => {
                const isConfirmed = resv.status === 'Confirmed';
                const isCancelled = resv.status === 'Cancelled';

                return (
                  <div
                    key={resv.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                      isCancelled
                        ? 'border-slate-200/60 opacity-60 bg-slate-50/50'
                        : 'border-slate-200/80 hover:border-blue-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {resv.status === 'Confirmed' ? '✓ Dikonfirmasi' : '✕ Dibatalkan'}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 font-semibold">
                          Kode: {resv.bookingCode}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{resv.facilityName}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {resv.facilityLocation}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Tanggal:</span>
                          <span className="font-bold">📅 {resv.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Waktu:</span>
                          <span className="font-bold">⏰ {resv.timeSlot} WIB</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Peserta:</span>
                          <span className="font-bold">👥 {resv.attendeesCount} Mahasiswa</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60 text-slate-600">
                          <span className="text-[11px] text-slate-400 block">Tujuan:</span>
                          <span className="font-medium">{resv.purpose}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Dipesan: {resv.bookedAt}</span>
                      {isConfirmed && (
                        <button
                          onClick={() => setCancellingResv(resv)}
                          className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold transition-colors"
                        >
                          Batalkan Reservasi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RESERVATION FORM MODAL */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#3978F6] uppercase">
                  Formulir Reservasi Fasilitas
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                  {selectedFacility.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccess ? (
              <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
                {bookingError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Slot Tidak Tersedia:</strong>
                      <span>{bookingError}</span>
                    </div>
                  </div>
                )}

                {/* Date Picker */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Tanggal Penggunaan</label>
                  <input
                    type="date"
                    required
                    value={resDate}
                    onChange={(e) => {
                      setResDate(e.target.value);
                      setBookingError(null);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                  />
                  <div className="flex gap-2 mt-1.5">
                    {['2026-10-29', '2026-10-30', '2026-10-31'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setResDate(d);
                          setBookingError(null);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          resDate === d ? 'bg-[#163B70] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d === '2026-10-29' ? 'Hari Ini' : d === '2026-10-30' ? 'Besok' : 'Lusa'} ({d})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots with Visual Conflict Indicator */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Pilih Slot Jam (Validasi Konflik Otomatis)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => {
                      const bookedInfo = checkSlotBooked(selectedFacility.id, resDate, slot);
                      const isSelected = resTimeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setResTimeSlot(slot);
                            setBookingError(null);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                            bookedInfo
                              ? 'border-rose-200 bg-rose-50/70 text-rose-800'
                              : isSelected
                              ? 'border-[#3978F6] bg-blue-50 text-[#163B70] font-bold shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot}</span>
                            {bookedInfo && (
                              <span className="text-[9px] bg-rose-200 px-1 py-0.5 rounded text-rose-900 font-bold">
                                Dipesan
                              </span>
                            )}
                          </div>
                          {bookedInfo && (
                            <span className="text-[10px] text-rose-600 block mt-0.5">
                              Oleh: {bookedInfo.bookedBy}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Attendees count */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jumlah Peserta (Maks. {selectedFacility.capacity} Orang)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedFacility.capacity}
                    value={resAttendees}
                    onChange={(e) => setResAttendees(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                {/* Purpose */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tujuan Penggunaan</label>
                  <textarea
                    rows={2}
                    required
                    value={resPurpose}
                    onChange={(e) => setResPurpose(e.target.value)}
                    placeholder="Contoh: Kerja kelompok Struktur Data, latihan presentasi lomba..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3978F6] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedFacility(null)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#163B70] hover:bg-[#1e4885] text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Konfirmasi Reservasi
                  </button>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-black text-xl text-slate-900">Reservasi Berhasil Disetujui!</h3>
                <p className="text-xs text-slate-600">
                  Peminjaman <span className="font-bold text-slate-800">{bookingSuccess.facilityName}</span> telah tercatat di sistem SmartCampus.
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Kode Booking:</span>
                    <span className="font-mono font-bold text-blue-600">{bookingSuccess.bookingCode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Jadwal:</span>
                    <span className="font-bold">{bookingSuccess.date} ({bookingSuccess.timeSlot} WIB)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nama Pemesan:</span>
                    <span className="font-bold">{user.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedFacility(null);
                      setActiveTab('my_reservations');
                    }}
                    className="px-5 py-2.5 bg-[#163B70] text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Lihat di Reservasi Saya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {cancellingResv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-lg">Batalkan Reservasi?</h3>
              <p className="text-xs text-slate-500">
                Apakah kamu yakin ingin membatalkan pemesanan{' '}
                <strong className="text-slate-700">{cancellingResv.facilityName}</strong> pada tanggal{' '}
                <strong>{cancellingResv.date} ({cancellingResv.timeSlot})</strong>? Slot ini akan dibuka kembali untuk mahasiswa lain.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setCancellingResv(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Pertahankan
              </button>
              <button
                onClick={() => {
                  onCancelReservation(cancellingResv.id);
                  setCancellingResv(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-rose-600/20"
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
