import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from "../context/userContext";
import { IoClose } from "react-icons/io5";


const CardData = [
    {
        title: 'Binance Coin',
        image: require("../images/binance.png"),
        subtitle: 'Profit Per hour',
        price: 16100,
        amount: 200000,
    },
    {
        title: 'Solana',
        image: require("../images/Solana.png"),
        subtitle: 'Profit Per hour',
        price: 3800,
        amount: 100000,
    },
    {
        title: 'Dogs',
        image: require("../images/dog.png"),
        subtitle: 'Profit Per hour',
        price: 900,
        amount: 100000,
    }, {
        title: 'Paragon',
        image: require("../images/paragon.png"),
        subtitle: 'Profit Per hour',
        price: 25000,
        amount: 1900000,
    }, {
        title: 'Cardano',
        image: require("../images/cardano.png"),
        subtitle: 'Profit Per hour',
        price: 1000,
        amount: 700,
    }, {
        title: 'Etherum',
        image: require("../images/Ethreum.png"),
        subtitle: 'Profit Per hour',
        price: 12000,
        amount: 200000,
    }, {
        title: 'LiteCoin',
        image: require("../images/litecoin.png"),
        subtitle: 'Profit Per hour',
        price: 2510,
        amount: 4000000,
    }, {
        title: 'BitCoinCash',
        image: require("../images/bitcoincash.png"),
        subtitle: 'Profit Per hour',
        price: 20000,
        amount: 1200000,
    }, {
        title: 'Thether',
        image: require("../images/binance.png"),
        subtitle: 'Profit Per hour',
        price: 16100,
        amount: 9000000,
    }, {
        title: 'NotCoin',
        image: require("../images/binance.png"),
        subtitle: 'Profit Per hour',
        price: 6000,
        amount: 100000,
    },
]

const tapValues = [
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

const energyValues = [
    {
        level: 1,
        energy: 500,
    },
    {
        level: 2,
        energy: 1000,
    },
    {
        level: 3,
        energy: 1500,
    },
    {
        level: 4,
        energy: 2000,
    },
    {
        level: 5,
        energy: 2500,
    },
    {
        level: 6,
        energy: 3000,
    },
    {
        level: 7,
        energy: 3500,
    },
    {
        level: 8,
        energy: 4000,
    },
    {
        level: 9,
        energy: 4500,
    },
    {
        level: 10,
        energy: 5000,
    },
    {
        level: 11,
        energy: 5500,
    },
    {
        level: 12,
        energy: 6000,
    },
    {
        level: 13,
        energy: 6600,
    },
    {
        level: 14,
        energy: 7000,
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

    const { balance, id, freeGuru, refiller, setRefiller, setFreeGuru, setTapGuru, fullTank, setFullTank, setMainTap, startTimer, timeRefill, setTimeRefill, tapValue, setTapValue, battery, setEnergy, setBattery, setBalance, refBonus } = useUser();
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
    const [showMining,setShowMining]=useState(false)


    const infoRef = useRef(null);
    const infoRefTwo = useRef(null);

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
        setIsUpgrading(true);
        const nextLevel = tapValue.level;
        const upgradeCost = upgradeCosts[nextLevel];
        if (nextLevel < tapValues.length && (balance + refBonus) >= upgradeCost && id) {
            const newTapValue = tapValues[nextLevel];
            const userRef = doc(db, 'telegramUsers', id.toString());
            try {
                await updateDoc(userRef, {
                    tapValue: newTapValue,
                    balance: balance - upgradeCost
                });
                setTapValue(newTapValue);
                setBalance((prevBalance) => prevBalance - upgradeCost);
                setIsUpgrading(false);
                setIsUpgradeModalVisible(false);
                setCongrats(true)

                setTimeout(() => {
                    setCongrats(false)
                }, 2000)
                console.log('Tap value upgraded successfully');
            } catch (error) {
                console.error('Error updating tap value:', error);
            }

        }

    };



    const nextUpgradeCost = upgradeCosts[tapValue.level];
    const hasSufficientBalance = (balance + refBonus) >= nextUpgradeCost;

    const nextEnergyUpgradeCost = energyUpgradeCosts[battery.level];
    const hasSufficientBalanceEn = (balance + refBonus) >= nextEnergyUpgradeCost;

    const nextChargingUpgradeCost = chargingUpgradeCosts[timeRefill.level];
    const hasSufficientBalanceEnc = (balance + refBonus) >= nextChargingUpgradeCost;

    const location = useNavigate();

    const [isDisabled, setIsDisabled] = useState(false);


    const calculateTimeRemaining = () => {
        const now = new Date();
        const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeDiff = nextDate - now;

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    };
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    };

    const chunkedData = chunkArray(CardData, 2); // Chunk the data into groups of two

    return (
        <div className="w-full">
                   <div
            className={`${showMining === true ? "visible" : "invisible"
              } absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5`}
          >
            <div className="w-full flex flex-col justify-between py-8">
              <button
                onClick={() => setShowMining(false)}
                className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
              >
                <IoClose size={24} className="text-[#9a96a6]" />
              </button>


              <div className="w-full flex justify-center flex-col items-center">
                {/* <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center">
                  <img alt="claim" src={ref} className="w-[100px] h-[100px]" />
                </div> */}
                <h3 className="font-semibold text-[32px] py-4">
                  Your Invite Link
                </h3>
                <div className="text-[#9a96a6] text-[13px]">
                  https://t.me/RockiPointAirdropbot?start=r{id}
                </div>

                <div className="flex flex-1 items-center space-x-2">

                </div>
              </div>

              <div className="w-full flex justify-center pb-6 pt-4">
                
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
            <div className="max-h-[500px] overflow-y-scroll">
                <div className="max-h-[500px] overflow-y-scroll">
                    {chunkedData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex justify-between items-center mb-4 m-5 max-h-[500px]"
                        >
                            {row.map((item, index) => (
                                <button
                                    key={index}
                                    className="bg-cards w-[48%] border-[1px] border-borders rounded-[8px] p-[16px] flex flex-col items-start"
                                >
                                    {/* Top section: icon and details */}
                                    <div className="flex w-full items-center">
                                        <div className="w-[40px] h-[40px] flex items-center justify-center mr-[12px]">
                                            <img src={item.image} alt="Description of your new image" className="w-full" />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <span className="text-white font-semibold">{item.title}</span>
                                            <span className="text-gray-400 text-[10px] font-medium">{item.subtitle}</span>
                                            <div className="flex items-center justify-center">
                                                <img src={require('../images/coinsmall.png')} alt="Price icon" className="w-[16px] h-[16px] mr-2" />
                                                <span className=" text-[14px] font-medium">{formatNumber(item.price)}</span>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Middle section: divider */}
                                    <hr className="w-full my-[8px] border-gray-600" />

                                    {/* Bottom section: lvl and price with coin image */}
                                    <div className="flex justify-between w-full items-center">
                                        <span className="text-gray-400 text-[14px]">lvl 0</span>
                                        <div className="flex items-center">
                                            <img
                                                src={require('../images/coinsmall.png')}
                                                className="w-5 h-5 mr-1"
                                                alt="Coin Icon"
                                            />
                                            <span className=" text-[16px] font-semibold">{formatNumber(item.amount)}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}
export default Cards;