import React, { useState, useRef, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import styled, { keyframes } from "styled-components";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Animate from '../Components/Animate';
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import Levels from '../Components/Levels';
import flash from "../images/flash.webp";
import { IoClose } from 'react-icons/io5';
import ref from '../images/ref.webp';

const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Plutos = () => {
  const imageRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const { balance, tapBalance, energy, battery, tapGuru, mainTap, setIsRefilling, refillIntervalRef, refillEnergy, setEnergy, tapValue, setTapBalance, setBalance, refBonus, level, loading, id } = useUser();
  // eslint-disable-next-line
  const [points, setPoints] = useState(0);
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line
  const [isDisabled, setIsDisabled] = useState(false);
  // eslint-disable-next-line
  const [openClaim, setOpenClaim] = useState(false);
  // eslint-disable-next-line
  const [congrats, setCongrats] = useState(false);
  // eslint-disable-next-line
  const [glowBooster, setGlowBooster] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const debounceTimerRef = useRef(null);
  // eslint-disable-next-line
  const refillTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const accumulatedBalanceRef = useRef(balance);
  const accumulatedEnergyRef = useRef(energy);
  const accumulatedTapBalanceRef = useRef(tapBalance);
  const refillTimeoutRef = useRef(null); // Add this line

  const [isHolding, setIsHolding] = useState(false);
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [isHoldingLongEnough, setIsHoldingLongEnough] = useState(false);

  const [showInvitation, setShowInvitation] = useState(false);

  const [isLoading, setLoading] = useState(true);
  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid && 'vibrate' in navigator) {
      // Use the vibration API on Android
      navigator.vibrate(50); // Vibrate for 50ms
    } else {
      console.warn('Haptic feedback not supported on this device.');
    }
  }

  const handleHoldStart = (e) => {
    setIsHolding(true);

    // Set a timeout to detect if the user holds for 20 seconds
    const timeout = setTimeout(() => {
      setIsHoldingLongEnough(true); // Flag to increase points after 20 seconds
    }, 20000); // 20 seconds

    setHoldTimeout(timeout);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);

    // Clear the timeout if the user releases before 20 seconds
    clearTimeout(holdTimeout);
    setHoldTimeout(null);

    // Reset the holding state after releasing
    setIsHoldingLongEnough(false);
  };


  const handleClick = (e) => {
    triggerHapticFeedback();

    if (energy <= 0 || isDisabled || isUpdatingRef.current) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return; // Exit if no energy left or if clicks are disabled or if an update is in progress
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? 'wobble-left'
        : offsetX > horizontalMidpoint
          ? 'wobble-right'
          : offsetY < verticalMidpoint
            ? 'wobble-top'
            : 'wobble-bottom';

    // Remove previous animations
    imageRef.current.classList.remove(
      'wobble-top',
      'wobble-bottom',
      'wobble-left',
      'wobble-right'
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    // Update state immediately for UI
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - tapValue.value, 0); // Ensure energy does not drop below zero
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setPoints((prevPoints) => prevPoints + tapValue.value);

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + tapValue.value;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000);

    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateFirestore, 1000); // Adjust the delay as needed

    // Reset the refill timer
    clearInterval(refillIntervalRef.current); // Stop refilling while the user is active
    setIsRefilling(false); // Set refilling state to false
    clearTimeout(refillTimeoutRef.current);
    refillTimeoutRef.current = setTimeout(() => {
      if (energy < battery.energy) {
        refillEnergy();
      }
    }, 1000);
  };


  const handleClickGuru = (e) => {
    triggerHapticFeedback();

    if (energy <= 0 || isDisabled || isUpdatingRef.current) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return;
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? 'wobble-left'
        : offsetX > horizontalMidpoint
          ? 'wobble-right'
          : offsetY < verticalMidpoint
            ? 'wobble-top'
            : 'wobble-bottom';

    // Remove previous animations
    imageRef.current.classList.remove(
      'wobble-top',
      'wobble-bottom',
      'wobble-left',
      'wobble-right'
    );

    // Add the new animation class
    imageRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends
    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500);

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    // Update state immediately for UI
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - 0, 0); // Ensure energy does not drop below zero
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setPoints((prevPoints) => prevPoints + tapValue.value * 5);

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value * 5;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + tapValue.value * 5;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) => prevClicks.filter((click) => click.id !== newClick.id));
    }, 1000);

    // Reset the debounce timer
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateFirestore, 1000);

    clearInterval(refillIntervalRef.current);
    setIsRefilling(false);
    clearTimeout(refillTimeoutRef.current);
    refillTimeoutRef.current = setTimeout(() => {
      if (energy < battery.energy) {
        refillEnergy();
      }
    }, 1000);
  };


  const updateFirestore = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());

      // Set updating flag
      isUpdatingRef.current = true;

      try {
        await updateDoc(userRef, {
          balance: accumulatedBalanceRef.current,
          energy: accumulatedEnergyRef.current,
          tapBalance: accumulatedTapBalanceRef.current,
        });

        // No need to update state here as it is already updated immediately in handleClick

        // Reset accumulated values to current state values
        accumulatedBalanceRef.current = balance;
        accumulatedEnergyRef.current = energy;
        accumulatedTapBalanceRef.current = tapBalance;
      } catch (error) {
        console.error('Error updating balance and energy:', error);
      } finally {
        // Clear updating flag
        isUpdatingRef.current = false;
      }
    }
  };



  const energyPercentage = (energy / battery.energy) * 100;



  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const handleInvite = () => {
    console.log("Pressed");
    setShowInvitation(true);
  }
  const copyToClipboard = () => {
    const reflink = `https://t.me/Rockipointbot?start=r${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 10000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    // Set a timeout to change the loading state after 10 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    // Cleanup the timeout if the component is unmounted before the timer completes
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>

          <div
            className={`${showInvitation === true ? "visible" : "invisible"
              } absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5`}
          >
            <div className="w-full flex flex-col justify-between py-8">
              <button
                onClick={() => setShowInvitation(false)}
                className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
              >
                <IoClose size={24} className="text-[#9a96a6]" />
              </button>


              <div className="w-full flex justify-center flex-col items-center">
                <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center">
                  <img alt="claim" src={ref} className="w-[100px] h-[100px]" />
                </div>
                <h3 className="font-semibold text-[32px] py-4">
                  Your Invite Link
                </h3>
                <p className="pb-6 text-[#9a96a6] text-[16px] text-center">
                  {/* Turbo Engine will tap when your energy is full <br />
                  Max bot work duration is 12 hours */}
                </p>

                <div className="flex flex-1 items-center space-x-2">
                  
                </div>
              </div>

              <div className="w-full flex justify-center pb-6 pt-4">
                <button
                onClick={copyToClipboard}
                  className={`bg-[#1F2942] text-[#979797] w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]`}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center w-full overflow-hidden">
            <div className="flex space-x-[2px] justify-center items-center">
              <div className="w-[50px] h-[50px]">
                <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
              </div>
              <h1 className="text-[#fff] text-[42px] font-extrabold">
                {formatNumber(balance + refBonus)} <br />
              </h1>
            </div>

            <div className="w-full ml-[6px] flex space-x-1 items-center justify-center">
              <img
                src={level.imgUrl}
                className="w-[25px] relative"
                alt="bronze"
              />
              <h2 onClick={() => setShowLevels(true)} className="text-[#9d99a9] text-[20px] font-medium">
                {level.name}
              </h2>
              <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
            </div>
            <div  className="w-full flex justify-center ">
              {/* Invite button positioned to the top right of the image */}
              <button
               onClick={()=>{setShowInvitation(true)}}
              // onMouseMove={()=>console.log("Hello")}
                className="mt-2 bg-[#1F2942] text-white font-bold py-1 px-0 rounded-md w-[100px] transform translate-x-[130%] translate-y-[-10px]"
              >
                Invite
              </button>
            </div>

            <div className="relative flex items-center justify-center w-full pb-24 pt-0">
              <div className="bg-[#35389e] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] top-10 -left-40 rounded-full"></div>

              <div class={`${tapGuru ? 'block' : 'hidden'} pyro`}>
                <div class="before"></div>
                <div class="after"></div>
              </div>

              <div className="w-[350px] h-[350px] relative flex items-center justify-center">
                <img src="/lihgt.webp" alt="err" className={`absolute w-[330px] rotate-45 ${tapGuru ? 'block' : 'hidden'}`} />

                <div className="image-container">
                  {mainTap && (
                    <Container>
                      <img
                        onPointerDown={handleClick}
                        ref={imageRef}
                        src={require('../images/bcen.png')}
                        alt="Wobble"
                        className="wobble-image !w-[250px] select-none"
                      />
                      {clicks.map((click) => (
                        <SlideUpText key={click.id} x={click.x} y={click.y}>
                          +{tapValue.value}
                        </SlideUpText>
                      ))}
                    </Container>
                  )}
                  {tapGuru && (
                    <Container>
                      <img
                        onPointerDown={handleClickGuru}
                        ref={imageRef}
                        src={require('../images/bcen.png')}
                        alt="Wobble"
                        className="wobble-image !w-[250px] select-none"
                      />
                      {clicks.map((click) => (
                        <SlideUpText key={click.id} x={click.x} y={click.y}>
                          +{tapValue.value * 5}
                        </SlideUpText>
                      ))}
                    </Container>
                  )}
                </div>

              </div>
            </div>

            {/* New Invite button added */}
            <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">


              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
                  <img alt="flash" src={flash} className="w-[20px]" />
                  <div className="">
                    <span className="text-[18px] font-bold">{energy.toFixed(0)}</span>
                    <span className="text-[14px] font-medium">/ {battery.energy}</span>
                  </div>
                </div>
                <div className="flex w-full p-[4px] h-[20px] items-center bg-energybar rounded-[12px] border-[1px] border-borders2">
                  <div
                    className="bg-[#e39725] h-full rounded-full transition-width duration-100"
                    style={{ width: `${energyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <Levels showLevels={showLevels} setShowLevels={setShowLevels} />

          </div>
        </Animate>
      )}
    </>
  );

};


export default Plutos;
