import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';

const TIMER_DURATION = 1200;
const Timer = ({ item, userId, startTimerClock }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (startTimerClock) {
            startTimer();
        }
    })
    // Function to start the timer and save the start time in Firebase
    const startTimer = async () => {
        const startTime = new Date().toISOString(); // Get current time as ISO string
        await setDoc(doc(db, 'timers', userId), { startTime });
        calculateRemainingTime(startTime); // Update the timeLeft immediately
    };

    // Function to calculate remaining time based on startTime from Firestore
    const calculateRemainingTime = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const elapsed = Math.floor((now - start) / 1000); // Elapsed time in seconds
        const remaining = TIMER_DURATION - elapsed;
        setTimeLeft(remaining > 0 ? remaining : 0);
    };

    // Fetch the timer start time from Firestore when the component mounts
    useEffect(() => {
        const fetchTimer = async () => {
            const docRef = doc(db, 'timers', item.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const { startTime } = docSnap.data();
                if (startTime) {
                    calculateRemainingTime(startTime);
                }
            }
        };
        fetchTimer();
    }, [item.id]);

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    // Convert time in seconds to minutes and seconds format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
    return (
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center mb-8">
            <img
                src={require('../images/timer.png')} // Replace with the path to your timer image
                className="w-10 h-10"
                alt="Timer Icon"
            />
            <span className="text-white text-[35px] mt-1 font-semibold ml-2">
                {formatTime(timeLeft)}
            </span>
        </div>
    )
}
export default Timer;