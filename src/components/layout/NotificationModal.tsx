import React from 'react';
import { X, CheckCheck, Trash2, Bell, Clock, ArrowRight } from 'lucide-react';
import { AppNotification, ActiveTab } from '../../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full sm:max-w-md bg-white sm:rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col h-full sm:h-auto sm:max-h-[85vh] mt-0 sm:mt-12 overflow-hidden animate-in slide-in-from-right"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100/70 text-[#163B70] rounded-xl">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Pusat Notifikasi</h3>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5 text-[#3978F6] hover:text-[#163B70] font-medium disabled:opacity-40 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Tandai semua dibaca
          </button>
          <button
            onClick={onClearAll}
            disabled={notifications.length === 0}
            className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 font-medium disabled:opacity-40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Tidak ada notifikasi</p>
              <p className="text-xs text-slate-400 mt-1">
                Semua pembaruan penting mengenai beasiswa, kuis, dan fasilitas akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick(notif)}
                className={`pt-2.5 p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 ${
                  notif.isRead
                    ? 'hover:bg-slate-50 text-slate-600'
                    : 'bg-blue-50/50 hover:bg-blue-50 border-l-4 border-[#3978F6] text-slate-900'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold leading-snug">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#3978F6] shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.timestamp}
                    </span>
                    {notif.targetTab && (
                      <span className="text-[#3978F6] font-semibold flex items-center gap-0.5 hover:underline">
                        Buka Detail <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
