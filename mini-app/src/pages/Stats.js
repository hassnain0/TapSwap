import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";

const Stats = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 46,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
    <div className="flex justify-center items-start h-screen text-white">
      <div className="text-center max-w-lg p-6 rounded-lg  mt-10">
        {/* Coin Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative  rounded-full flex justify-center items-center overflow-hidden">
            <div className="relative w-50 h-50 flex justify-center items-center mb-4">
              {/* Glowing Background */}

              <img
                src={require('../images/airdrop.png')} // Use the imported BULL image
                alt="Bull"
                className="w-[150px] h-[150px] " // Position the image above the glow
              />
            </div>
          </div>

        </div>

        {/* Airdrop Heading */}
        <h1 className="text-2xl font-bold mb-2">AirDrop is coming soon</h1>

        {/* Earn per hour */}
        <p className="text-lg mb-4">Income: <img src={require('../images/coinsmall.png')} className="w-7 h-7 inline-block pb-1" alt="Coin" /><span className="text-2l pl-2">{formatNumber(balance + refBonus)}</span> </p>


        {/* Exchange section with gradient background */}
        <div className="bg-cards rounded-lg p-4 mb-6">
          <p>You will be able to exchange your krypto diamonds for real money</p>
        </div>
        {/* Task Requirements */}
        <div className="bg-cards rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">To do this you need</h2>
          <ul className="list-disc list-inside text-left">
            <li>Complete all tasks</li>

          </ul>
        </div>

        {/* Countdown Timer with reduced opacity */}
        <div className=" rounded-lg p-4 mb-[70px] relative overflow-hidden  ">
          {/* Add a semi-transparent overlay */}
          <div className="absolute inset-0  opacity-50 rounded-lg"></div>
          <div className="flex justify-around items-center relative z-10">
            {/* Day Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-4 rounded-lg shadow-md">
              <span className="text-4xl font-bold text-white">{timeLeft.days}</span>
              <span className="text-sm text-white">days</span>
            </div>
            <span className="text-4xl font-bold mx-2">:</span>
            {/* Hour Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-4 rounded-lg shadow-md">
              <span className="text-4xl font-bold text-white">{timeLeft.hours}</span>
              <span className="text-sm text-white">hours</span>
            </div>
            <span className="text-4xl font-bold mx-2">:</span>
            {/* Minute Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-4 rounded-lg shadow-md">
              <span className="text-4xl font-bold text-white">{timeLeft.minutes}</span>
              <span className="text-sm text-white">minutes</span>
            </div>
            <span className="text-4xl font-bold mx-2">:</span>
            {/* Second Block */}
            <div className="flex flex-col items-center border-2 border-activeborder bg-cards p-4 rounded-lg shadow-md">
              <span className="text-4xl font-bold text-white">{timeLeft.seconds}</span>
              <span className="text-sm text-white">seconds</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Stats;
