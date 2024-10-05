import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { db } from "../firebase";
import { doc, getDoc } from "@firebase/firestore";

const Stats = () => {
  const [timeLeft, setTimeLeft] = useState({
    days:0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchEndTime = async () => {
      const docRef = doc(db, 'countdown', 'timer');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const endTime = new Date(docSnap.data().endTime);
        startCountdown(endTime);
      } else {
        console.log('No such document!');
      }
    };

    fetchEndTime();
  }, []);

  const startCountdown = (endTime) => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDiff = endTime - now;

      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
  }
  const { balance, refBonus } = useUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen text-white px-4 sm:px-6 lg:px-8">
      <div className="text-center w-full max-w-xl p-4 sm:p-6 rounded-lg mt-10">
        {/* Coin Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative rounded-full flex justify-center items-center overflow-hidden">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex justify-center items-center mb-4">
              <img
                src={require("../images/airdrop.png")}
                alt="Bull"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Airdrop Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          AirDrop is coming soon
        </h1>

        {/* Earn per hour */}
        <p className="text-lg sm:text-xl mb-4">
          Income:{" "}
          <img
            src={require("../images/coinsmall.png")}
            className="w-6 h-6 sm:w-7 sm:h-7 inline-block pb-1"
            alt="Coin"
          />
          <span className="pl-2">{formatNumber(balance + refBonus)}</span>
        </p>

        {/* Exchange section with gradient background */}
        <div className="bg-cards rounded-lg p-4 mb-6 text-sm sm:text-base">
          <p>You will be able to exchange your krypto diamonds for real money</p>
        </div>

        {/* Task Requirements */}
        <div className="bg-cards rounded-lg p-4 mb-6 text-sm sm:text-base">
          <h2 className="text-xl font-semibold mb-4">
            To do this you need
          </h2>
          <ul className="list-disc list-inside text-left">
            <li>Complete all tasks</li>
          </ul>
        </div>

        {/* Countdown Timer with reduced opacity */}
        <div className="rounded-lg p-2  relative overflow-hidden text-sm sm:text-base">
          {/* Add a semi-transparent overlay */}
          <div className="flex justify-around items-center relative z-10">
            {/* Day Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-2 sm:p-4 rounded-lg shadow-md">
              <span className="text-2xl sm:text-4xl font-bold text-white">
                {timeLeft.days}
              </span>
              <span className="text-xs sm:text-sm text-white">days</span>
            </div>
            <span className="text-2xl sm:text-4xl font-bold mx-1 sm:mx-2">:</span>
            {/* Hour Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-2 sm:p-4 rounded-lg shadow-md">
              <span className="text-2xl sm:text-4xl font-bold text-white">
                {timeLeft.hours}
              </span>
              <span className="text-xs sm:text-sm text-white">hours</span>
            </div>
            <span className="text-2xl sm:text-4xl font-bold mx-1 sm:mx-2">:</span>
            {/* Minute Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-2 sm:p-4 rounded-lg shadow-md">
              <span className="text-2xl sm:text-4xl font-bold text-white">
                {timeLeft.minutes}
              </span>
              <span className="text-xs sm:text-sm text-white">minutes</span>
            </div>
            <span className="text-2xl sm:text-4xl font-bold mx-1 sm:mx-2">:</span>
            {/* Second Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-2 sm:p-4 rounded-lg shadow-md">
              <span className="text-2xl sm:text-4xl font-bold text-white">
                {timeLeft.seconds}
              </span>
              <span className="text-xs sm:text-sm text-white">seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
