import React, { useEffect, useState, useRef } from "react";

import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { useUser } from "../context/userContext";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { db } from "../firebase";
import Timer from "../Components/Timer";


const TIMER_DURATION = 1200; // 20 minutes in seconds


const cardValues = [
    {
        level: 0,
        value: 0,
    },
    {
        level: 1,
        value: 1,
    },
    {
        level: 2,
        value: 2,
    },
    {
        level: 3,
        value: 3,
    },
    {
        level: 4,
        value: 4,
    },
    {
        level: 5,
        value: 5,
    },
    {
        level: 6,
        value: 6,
    },
    {
        level: 7,
        value: 7,
    },
    {
        level: 8,
        value: 8,
    },
    {
        level: 9,
        value: 9,
    },
    {
        level: 10,
        value: 10,
    },
    {
        level: 11,
        value: 11,
    },
    {
        level: 12,
        value: 12,
    },
    {
        level: 13,
        value: 13,
    },
    {
        level: 14,
        value: 14,
    },
];


const chargingValues = [
    {
        level: 1,
        duration: 10,
        step: 600,
    },
    {
        level: 2,
        duration: 6,
        step: 360,
    },
    {
        level: 3,
        duration: 4,
        step: 240,
    },
    {
        level: 4,
        duration: 2,
        step: 120,
    },
    {
        level: 5,
        duration: 1,
        step: 60,
    },
]
const upgradeCosts = [0, 2000, 5000, 10000, 20000, 40000, 80000, 100000, 150000, 200000, 250000, 300000, 400000, 500000];


const energyUpgradeCosts = [0, 3000, 6000, 12000, 24000, 50000, 100000, 200000, 300000, 400000, 600000, 800000, 1000000, 2000000];


const chargingUpgradeCosts = [0, 2000, 30000, 100000, 200000];


const Cards = () => {

    const { balance, id, freeGuru, refiller, setRefiller, setFreeGuru, setTapGuru, fullTank, setFullTank, setMainTap, startTimer, timeRefill, setTimeRefill, tapValue, cardsValue, setCardsValue, setTapValue, battery, setEnergy, setBattery, setBalance, refBonus, setProfitPerHour } = useUser();
    const [openInfo, setOpenInfo] = useState(false);
    const [openInfoTwo, setOpenInfoTwo] = useState(false);
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
    const [isUpgradeModalVisibleEn, setIsUpgradeModalVisibleEn] = useState(false);
    const [isUpgradeModalVisibleEnc, setIsUpgradeModalVisibleEnc] = useState(false);
    const [congrats, setCongrats] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isUpgradingEn, setIsUpgradingEn] = useState(false);
    const [isUpgradingEnc, setIsUpgradingEnc] = useState(false);
    const [guru, setGuru] = useState(false);
    const [tank, setTank] = useState(false);
    const [bot, setBot] = useState(false);
    const [showCards, setshowCards] = useState(false)
    const [cardData, setCardData] = useState([]);
    const [blurItem, setBlurItem] = useState([]);
    const [blurredCardId, setBlurredCardId] = useState([]);
    const [image, setImage] = useState();
    const [index, setIndex] = useState(0);

    const [selectedCards, setSelectedCards] = useState([]);
    const [timers, setTimers] = useState({});
    const [item, setItem] = useState(null);

    const [startTimerClock, setStartTimerClock] = useState(false);
    const infoRef = useRef(null);
    const infoRefTwo = useRef(null);

    useEffect(() => {
        fetchCardData();
    })

    const fetchCardData = async () => {
        try {
            // Reference to the specific document in the 'cards' collection
            const docRef = doc(db, "cards", "CardData");

            // Fetch the document data
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // If the document exists, log the data
                const data = docSnap.data().CardData;
                setCardData(data)

            } else {
                // If the document does not exist
                console.log("No such document!");
            }
        } catch (e) {
            console.error("Error fetching document: ", e);
        }
    };

    const handleClickOutside = (event) => {
        if (infoRef.current && !infoRef.current.contains(event.target)) {
            setOpenInfo(false);
        }
        if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
            setOpenInfoTwo(false);
        }
    };
    useEffect(() => {
        if (openInfo || openInfoTwo) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openInfo, openInfoTwo]);

    const formatNumber = (num) => {
        if (num < 1000) {
            // Less than 1,000: no suffix
            return num.toString();
        } else if (num < 1000000) {
            // From 1,000 to less than 1,000,000: add 'k'
            return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        } else if (num < 1000000000) {
            // From 1,000,000 to less than 1 billion: add 'M'
            return (num / 1000000).toFixed(2).replace(/\.0+$/, "") + "M";
        } else if (num < 1000000000000) {
            // From 1 billion to less than 1 trillion: add 'B'
            return (num / 1000000000).toFixed(2).replace(/\.0+$/, "") + "B";
        } else {
            // 1 trillion or more: add 'T'
            return (num / 1000000000000).toFixed(2).replace(/\.0+$/, "") + "T";
        }
    };



    const handleUpgrade = async () => {

        setshowCards(false);
        const nextLevel = cardsValue.level;
        const upgradeCost = upgradeCosts[nextLevel];
        if (nextLevel < cardValues.length && (balance + refBonus) >= upgradeCost && id) {
            const newTapValue = cardValues[nextLevel];
            const userRef = doc(db, 'telegramUsers', id.toString());
            try {
                await updateDoc(userRef, {
                    cardsValue: newTapValue,
                    balance: balance - upgradeCost,

                });
                setCardsValue(newTapValue);
                setBalance((prevBalance) => prevBalance - upgradeCost);
                setCongrats(true);

            } catch (error) {
                console.error('Error updating tap value:', error);
            }

        }

    };

    const nextUpgradeCost = upgradeCosts[tapValue.level];
    // const hasSufficientBalance = (balance + refBonus) >= nextUpgradeCost;
    const hasSufficientBalance = true;
    const nextEnergyUpgradeCost = energyUpgradeCosts[battery.level];
    const hasSufficientBalanceEn = (balance + refBonus) >= nextEnergyUpgradeCost;

    const nextChargingUpgradeCost = chargingUpgradeCosts[timeRefill.level];
    const hasSufficientBalanceEnc = (balance + refBonus) >= nextChargingUpgradeCost;

    const [isDisabled, setIsDisabled] = useState(false);

    //Display Cards
    const DisplayCards = (item, index) => {
        setItem(item);
        setIndex(index);
        setshowCards(true);
        setImage(item.image)
    }

    useEffect(() => {
        fetchData();
    },);

    const fetchData = async () => {
        try {

            const userRef = collection(db, "telegramUsers", id.toString());
            const querySnapshot = await getDocs(userRef);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Check if card is in selected cards and update timers
                if (selectedCards.includes(data.index)) {
                    setTimers((prev) => ({ ...prev, [data.index]: data.timer }));
                }
            });

        } catch (error) {
            console.error("Error fetching timer: ", error);

        }
    }

    // const handlerRechargeUpgrade = async () => {
    //     setIsUpgradingEnc(true);
    //     const nextChargingLevel = timeRefill.level;
    //     const chargingUpgradeCost = chargingUpgradeCosts[nextChargingLevel];
    //     if (nextChargingLevel < chargingValues.length && (balance + refBonus) >= chargingUpgradeCost && id) {
    //         const newChargingValue = chargingValues[nextChargingLevel];
    //         const userRef = doc(db, 'telegramUsers', id.toString());
    //         try {
    //             await updateDoc(userRef, {
    //                 timeRefill: newChargingValue,
    //                 balance: balance - chargingUpgradeCost,
    //             });
    //             setTimeRefill(newChargingValue);
    //             setBalance((prevBalance) => prevBalance - chargingUpgradeCost);
    //             setIsUpgradingEnc(false);
    //             setEnergy(battery.energy);
    //             setCongrats(true)
    //             setIsUpgradeModalVisibleEnc(false);
    //             setTimeout(() => {
    //                 setCongrats(false)
    //             }, 2000)
    //             console.log('Energy value upgraded successfully');
    //             console.log('Energy value upgraded successfully +', newChargingValue.value);
    //         } catch (error) {
    //             console.error('Error updating energy value:', error);
    //         }

    //     }

    // };


    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    };

    const chunkedData = chunkArray(cardData, 2); // Chunk the data into groups of two

    return (
        <div className="w-full">
            <div className={`${congrats === true ? "visible bottom-6" : "invisible bottom-[-10px]"} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
                <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">



                    <IoCheckmarkCircle size={24} className="" />

                    <span className="font-medium">
                        Good
                    </span>

                </div>


            </div>
            <div
                className={`${showCards === true ? "visible" : "invisible"
                    } absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5`}
            >
                <div className="w-full flex flex-col justify-between py-8">
                    <button
                        onClick={() => setshowCards(false)}
                        className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
                    >
                        <IoClose size={24} className="text-[#9a96a6]" />
                    </button>

                    <div className="w-full flex justify-center flex-col items-center">
                        <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center">
                            <img alt="claim" src={image} className="w-[100px] h-[100px]" />
                        </div>
                        <h3 className="font-semibold text-[32px] py-4">
                            X2 Income
                        </h3>
                        <div className=" text-[18px]">
                            Tap the menu diamond to buy upgrades for your income
                        </div>

                        <div className="flex flex-1 items-center space-x-2">

                        </div>
                    </div>

                    <div className="w-full flex justify-center pb-6 pt-4">
                        <button
                            // onClick={handleUpgrade}
                            disabled={!hasSufficientBalance}
                            className={`${!hasSufficientBalance ? 'bg-btn2 text-[#979797]' : 'bg-gradient-to-b from-[#3a5fd4] to-[#5078e0]'} w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]`}
                        >
                            {/* {isUpgrading ? 'Boosting...' : hasSufficientBalance ? 'Get it!' : 'Insufficient Balance'} */}
                            Comming Soon
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full items-center justify-center pb-2 flex ">
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                    Your Total Balance
                </h2>
            </div>
            <div className="flex space-x-1 ml-[-8px] justify-center items-center ">
                <div className="w-[50px] h-[50px]">
                    <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                    {formatNumber(balance + refBonus)}
                </h1>
            </div>
            <div className="bg-borders w-full px-5 h-[1px] !mt-3 !mb-5 " ></div>

            <div className="max-h-[450px] overflow-y-scroll">
                {chunkedData.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex justify-between items-center mb-4 m-5 max-h-[500px]"

                    >
                        {row.map((item, index) => (
                            <button
                                onClick={() => DisplayCards(item, item.index)}
                                key={index}
                                className={` w-[48%] border-[1px] border-borders rounded-[8px] p-[16px] flex flex-col items-start
                                   ${item.blur ? 'bg-activebg' : 'bg-cards'} 
                        `}
                            >

                                <div className="flex w-full items-center">
                                    <div className="w-[40px] h-[40px] flex items-center justify-center mr-[12px]">
                                        <img
                                            src={item.image}
                                            alt="Description of your new image"
                                            className={`w-full`}
                                        />

                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <span className={`text-white font-semibold ${item.blur ? 'blur-lg' : ''}`}>{item.title}</span>
                                        <span className={`text-gray-400 text-[10px] font-medium ${item.blur ? 'blur-lg' : ''}`}>{item.subtitle}</span>
                                        <div className="flex items-center justify-center relative">
                                            {/* Conditionally render the timer or price based on item.blur */}

                                            <div className="flex items-center justify-center">
                                                <img src={require('../images/coinsmall.png')} alt="Price icon" className="w-[16px] h-[16px] mr-2" />
                                                <span className="text-[14px] font-medium">{formatNumber(item.price)}</span>
                                            </div>

                                        </div>

                                    </div>
                                </div>


                                <hr className="w-full my-[8px] border-gray-600" />


                                <div className="flex justify-between w-full items-center relative">
                                    {/* Level Section */}

                                    <span className={`text-gray-400 text-[14px] ${item.blur ? 'blur-lg' : ''}`}> {cardValues[cardsValue.level]?.value} lvl</span>

                                    {/* Timer Display in the Center */}

                                    {/* Coins Section */}
                                    <div className={`flex items-center ${item.blur ? 'blur-lg' : ''}`}>
                                        <img
                                            src={require('../images/coinsmall.png')}
                                            className="w-5 h-5 mr-1"
                                            alt="Coin Icon"
                                        />
                                        <span className={`text-[16px] font-semibold `}>{formatNumber(item.amount)}</span>
                                    </div>
                                </div>



                                {/* Timer section: display only when card is blurred */}

                            </button>
                        ))}
                    </div>
                ))}
            </div>


        </div>
    );
}
export default Cards;