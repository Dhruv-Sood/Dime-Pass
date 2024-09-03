/*
import { useState, useEffect, createContext } from "react";
import {ethers} from "ethers"
import { contractAddress, contractABI } from "../utils/constants"

export const TransactionContext = createContext()

const ethereum = window.ethereum


const getEthereumContract = async() => {
    if (!ethereum) {
        alert("Please install MetaMask");
        return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
    
}

export const TransactionProvider = ({children})=>{

    const [currentAccount , setCurrentAccount] = useState("");

    const [formData , setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    })

    const [isLoading , setIsLoading] = useState(false);

    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"))

    const handleChange = (e,name) => {
         setFormData((prevState)=>{
             return {...prevState , [name]:e.target.value}
         })
    }

    const checkIfWalletIsConnected = async ()=>{
       try {
           if (!ethereum) return alert("Please install MetaMask")

           const accounts = await ethereum.request({ method: "eth_accounts" })

           if (accounts.length) {
               setCurrentAccount(accounts[0])

               // getAllTransactions();
           } else {
               console.log("No account found");

           }


           console.log(accounts);
       } catch (error) {
            console.log(error);
           throw new Error("No Ethereum object present")
            
       }
    }

    const connectWallet = async()=>{
        try {
            if (!ethereum) return alert("Please install MetaMask")
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object present")
        }
    }


    const sendTransaction = async () => {
        try {
            if (!ethereum) return

            const { addressTo, amount, keyword, message } = formData;

            const transactionContract = getEthereumContract()
 
            const parsedAmount = ethers.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parsedAmount._hex
                }]
            });
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)

            setIsLoading(true)
            console.log(`Loading -- ${transactionHash.hash}`);
            await transactionHash.wait()

            setIsLoading(false)
            console.log(`Success`);

            const transactionCount = await transactionContract.getTransactionCount()
            
            setTransactionCount(transactionCount.toNumber);


        
        } catch (error) {
            console.log(error);
            throw Error("No Ethereum object")
        }
    }


    useEffect(()=>{
        checkIfWalletIsConnected();
    },[])

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}



*/

import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/constants";

export const TransactionContext = createContext();

const getEthereumContract = async () => {
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask");
        return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    });

    const [transactions, setTransactions] = useState([])

    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: e.target.value
        }));
    };

    const getAllTransactions = async () => {
        try {
            if (typeof window.ethereum === "undefined") {
                alert("Please install MetaMask");
                return;
            }
            const transactionContract = await getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions()
            
            const structuredTransactions = availableTransactions.map((transaction)=>{
                return{
                    addressFrom: transaction[0],
                    addressTo: transaction[1],
                    amount: ethers.formatEther(transaction[2]),
                    message: transaction[3],
                    timestamp: new Date(Number(transaction[4]) * 1000).toLocaleString(),
                    keyword: transaction[5]

                }
            })

            setTransactions(structuredTransactions)
            
            

        } catch (error) {
            
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (typeof window.ethereum === "undefined") {
                alert("Please install MetaMask");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                getAllTransactions();

            } else {
                console.log("No account found");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object present");
        }
    };

    const checkIfTransactionsExist = async ()=> {
        try {
            const transactionContract = await getEthereumContract();
            const transactionCount = await transactionContract.getTransactioncount();

            window.localStorage.setItem('transactionCount', transactionCount)
        } catch (error) {
            console.log(error);
            
        }
    }

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum === "undefined") {
                alert("Please install MetaMask");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object present");
        }
    };

    const sendTransaction = async () => {
        try {
            if (typeof window.ethereum === "undefined") return;
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = await getEthereumContract();
            const parsedAmount = ethers.parseEther(amount);

            await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: ethers.toBeHex(parsedAmount)
                }]
            });

            const transactionHash = await transactionContract.addToBlockChain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            
            console.log(`Loading -- ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success`);

            const transactionCount = await transactionContract.getTransactioncount();
            setTransactionCount(transactionCount.toString());

            window.location.reload()
        } catch (error) {
            console.log(error);
            throw Error("No Ethereum object");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    );
};