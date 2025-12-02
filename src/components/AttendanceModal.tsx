import { motion, AnimatePresence } from 'framer-motion';
import { SafeImage } from './SafeImage';
import { useEffect, useState } from 'react';

interface AttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    streak: number;
    isReward: boolean;
    rewardAmount?: number;
}

export default function AttendanceModal({
    isOpen,
    onClose,
    streak,
    isReward,
    rewardAmount = 20
}: AttendanceModalProps) {
    const [showReward, setShowReward] = useState(false);

    useEffect(() => {
        if (isOpen && isReward) {
            const timer = setTimeout(() => {
                setShowReward(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isReward]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/ui/pattern-dot.png')] bg-repeat opacity-50" />
                        </div>

                        <div className="relative flex flex-col items-center text-center">
                            {/* Title */}
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {isReward ? '🎉 축하해요!' : '출석 체크'}
                            </h2>
                            <p className="text-gray-500 mb-8">
                                {isReward
                                    ? `3일 연속 출석으로 ${rewardAmount}원을 받았어요!`
                                    : `${streak}일째 출석했어요!`}
                            </p>

                            {/* Attendance Stamps */}
                            <div className="flex items-center justify-center gap-4 mb-8 w-full">
                                {[1, 2, 3].map((day) => (
                                    <div key={day} className="relative flex flex-col items-center">
                                        <div
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${day <= streak
                                                    ? 'bg-blue-50 border-blue-200 shadow-inner'
                                                    : 'bg-gray-50 border-gray-100'
                                                }`}
                                        >
                                            {day <= streak ? (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                        damping: 20,
                                                        delay: day === streak ? 0.2 : 0
                                                    }}
                                                >
                                                    <SafeImage
                                                        src="/images/items/icon-check.png"
                                                        alt="Checked"
                                                        width={40}
                                                        height={40}
                                                    />
                                                </motion.div>
                                            ) : (
                                                <span className="text-gray-300 font-bold text-xl">{day}일</span>
                                            )}
                                        </div>

                                        {/* Day Label */}
                                        <span className={`mt-2 text-sm font-medium ${day <= streak ? 'text-blue-600' : 'text-gray-400'
                                            }`}>
                                            {day}일차
                                        </span>

                                        {/* Reward Badge for Day 3 */}
                                        {day === 3 && (
                                            <div className="absolute -top-3 -right-2">
                                                <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-yellow-200">
                                                    {rewardAmount}원
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Reward Animation */}
                            <AnimatePresence>
                                {showReward && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    >
                                        <SafeImage
                                            src="/images/items/icon-coin-large.png"
                                            alt="Reward"
                                            width={120}
                                            height={120}
                                            className="drop-shadow-2xl"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Button */}
                            <button
                                onClick={onClose}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-200 active:scale-95 transform duration-100"
                            >
                                {isReward ? '받기' : '확인'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
