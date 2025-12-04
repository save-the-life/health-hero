"use client";

import { SafeImage } from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import StageButton from "@/components/StageButton";
import { SoundButton } from "@/components/SoundButton";

export default function Phase7Page() {
    const router = useRouter();
    const { user, isAuthenticated, initialize } = useAuthStore();
    const { hearts, isLoading, error, currentStage, loadUserData, updateHearts } =
        useGameStore();

    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerHeight < 700);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        const initData = async () => {
            await initialize();
        };
        initData();
    }, [initialize]);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            loadUserData(user.id);
        }
    }, [isAuthenticated, user?.id, loadUserData]);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!document.hidden && isAuthenticated && user?.id) {
                try {
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("데이터 로드 타임아웃")), 8000)
                    );

                    await Promise.race([loadUserData(user.id), timeoutPromise]);
                    console.log(
                        "페이즈 페이지 가시성 변경 - 사용자 데이터 새로고침 완료"
                    );
                } catch (error) {
                    console.error("페이즈 페이지 데이터 새로고침 실패:", error);
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isAuthenticated, user?.id, loadUserData]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id || !hearts) return;

        const interval = setInterval(() => {
            if (hearts.current_hearts < 5) {
                updateHearts();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated, user?.id, hearts, updateHearts]);

    const isStageLocked = (stageNumber: number) => {
        const locked = stageNumber > currentStage;
        console.log(
            `스테이지 ${stageNumber} 잠금 상태 확인: currentStage=${currentStage}, locked=${locked}`
        );
        return locked;
    };

    const handleStageClick = async (stageNumber: number) => {
        if (isStageLocked(stageNumber)) {
            console.log(
                `스테이지 ${stageNumber} 클릭 시도 - 잠금 상태로 인해 차단됨`
            );
            return;
        }

        if (user?.id) {
            try {
                console.log("스테이지 클릭 전 데이터 새로고침 시도");
                await loadUserData(user.id);
                console.log("스테이지 클릭 전 데이터 새로고침 완료");
            } catch (error) {
                console.error("스테이지 클릭 전 데이터 새로고침 실패:", error);
            }
        }

        router.push(`/game/quiz?phase=7&stage=${stageNumber}`);
    };

    if (isLoading) {
        return (
            <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
                <div className="absolute inset-0 z-0">
                    <SafeImage
                        src="/images/backgrounds/background-phase7.png"
                        alt="페이즈 7 배경"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-white text-xl font-medium">로딩 중...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
                <div className="absolute inset-0 z-0">
                    <SafeImage
                        src="/images/backgrounds/background-phase7.png"
                        alt="페이즈 7 배경"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-red-500 text-xl font-medium">에러: {error}</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="relative h-screen overflow-hidden flex items-center justify-center" style={{ height: '100vh', overflow: 'hidden' }}>
                <div className="text-white text-xl">로그인이 필요합니다.</div>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
            <div className="absolute inset-0 z-0">
                <SafeImage
                    src="/images/backgrounds/background-phase7.png"
                    alt="페이즈 7 배경"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="relative z-10 w-full h-screen">
                <div className="absolute top-[60px] left-4 z-20">
                    <SoundButton
                        onClick={() => router.push("/game")}
                        className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity px-3 py-2 rounded-lg"
                    >
                        <SafeImage
                            src="/images/items/icon-backspace.png"
                            alt="뒤로가기"
                            width={24}
                            height={24}
                        />
                    </SoundButton>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center items-center mb-5">
                    {isSmallScreen ? (
                        <>
                            <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={1}
                                    isLocked={isStageLocked(1)}
                                    onClick={() => handleStageClick(1)}
                                />
                            </div>
                            <div className="absolute bottom-[180px] left-5/9 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={2}
                                    isLocked={isStageLocked(2)}
                                    onClick={() => handleStageClick(2)}
                                />
                            </div>
                            <div className="absolute bottom-[300px] left-4/10 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={3}
                                    isLocked={isStageLocked(3)}
                                    onClick={() => handleStageClick(3)}
                                />
                            </div>
                            <div className="absolute bottom-[400px] left-5/9 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={4}
                                    isLocked={isStageLocked(4)}
                                    onClick={() => handleStageClick(4)}
                                />
                            </div>
                            <div className="absolute bottom-[520px] left-1/2 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={5}
                                    isLocked={isStageLocked(5)}
                                    onClick={() => handleStageClick(5)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={1}
                                    isLocked={isStageLocked(1)}
                                    onClick={() => handleStageClick(1)}
                                />
                            </div>
                            <div className="absolute bottom-[200px] left-5/9 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={2}
                                    isLocked={isStageLocked(2)}
                                    onClick={() => handleStageClick(2)}
                                />
                            </div>
                            <div className="absolute bottom-[340px] left-4/10 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={3}
                                    isLocked={isStageLocked(3)}
                                    onClick={() => handleStageClick(3)}
                                />
                            </div>
                            <div className="absolute bottom-[440px] left-6/9 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={4}
                                    isLocked={isStageLocked(4)}
                                    onClick={() => handleStageClick(4)}
                                />
                            </div>
                            <div className="absolute bottom-[580px] left-1/2 transform -translate-x-1/2">
                                <StageButton
                                    stageNumber={5}
                                    isLocked={isStageLocked(5)}
                                    onClick={() => handleStageClick(5)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
