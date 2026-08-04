"use client";

import { useState, useEffect, useRef } from "react";
import { FiBell, FiX, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const popupRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications`, {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) setNotifications(data.notifications);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read-all`, {
                method: "PATCH",
                credentials: "include",
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        if (open) {
            markAllRead();
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleNotificationClick = (notification) => {
        setOpen(false);
        router.push(notification.actionRoute);
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={popupRef}>
            {/* Bell Button  */}
            <button
                onClick={() => setOpen(!open)}
                className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-muted hover:text-text transition"
            >
                <div className="relative">
                    <FiBell className="text-lg" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </div>
                <span className="text-sm font-medium">Notifications</span>
            </button>

            {/* Popup */}
            {open && (
                <div className="fixed md:absolute left-16 md:left-full md:ml-3 top-auto md:top-0 bottom-16 md:bottom-auto w-[320px] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <FiBell className="text-primary" />
                            <h3 className="text-text font-bold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <button onClick={() => setOpen(false)} className="text-muted hover:text-text transition w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5">
                            <FiX className="text-sm" />
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                    <FiBell className="text-muted text-xl" />
                                </div>
                                <p className="text-text font-medium text-sm">All caught up!</p>
                                <p className="text-muted text-xs mt-1">No notifications yet.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((n) => (
                                    <button
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`w-full text-left px-5 py-4 hover:bg-white/5 transition-all duration-200 flex gap-3 items-start group ${!n.read ? "bg-primary/5 border-l-2 border-primary" : ""
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? "bg-primary/20" : "bg-white/5"
                                            }`}>
                                            {n.read
                                                ? <FiCheck className="text-muted text-xs" />
                                                : <FiBell className="text-primary text-xs" />
                                            }
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed ${!n.read ? "text-text" : "text-muted"}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-muted/60 text-xs mt-1">{timeAgo(n.createdAt)}</p>
                                        </div>

                                        {/* Unread dot */}
                                        {!n.read && (
                                            <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-white/5 bg-white/2">
                            <p className="text-muted/60 text-xs text-center">{notifications.length} total notifications</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}