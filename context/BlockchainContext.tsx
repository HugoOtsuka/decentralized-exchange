import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { BigNumber, Signer, ethers } from "ethers";
import {
  ContractEvent,
  useAddress,
  useContract,
  useContractEvents,
} from "@thirdweb-dev/react";
import { ThirdwebSDK, SmartContract } from "@thirdweb-dev/sdk";
import { Mumbai } from "@thirdweb-dev/chains";
import { DEX_CONTRACT_ADDRESSES } from "../constants/addresses";
import ERC20Abi from "../constants/ERC20Abi.json";
import Loading from "../components/Loading";

const SIDE = {
  BUY: 0,
  SELL: 1,
};

type User = {
  accounts: Signer | undefined;
  balances: {
    tokenDex: number;
    tokenWallet: number;
  };
  selectedToken: string | undefined;
};

type Order = {
  id: number;
  trader: Signer;
  side: number;
  ticker: string;
  amount: number;
  filled: number;
  price: number;
  date: Date;
};

type BlockchainContextType = {
  tokens: any[];
  setTokens: Dispatch<SetStateAction<string[]>>;
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
  orders: any;
  setOrders: Dispatch<SetStateAction<any>>;
  trades: ContractEvent<Record<string, any>>[] | undefined;
  tokenContracts: {
    [ticker: string]: SmartContract<ethers.BaseContract> | undefined;
  };
  setTokenContracts: Dispatch<
    SetStateAction<{
      [ticker: string]: SmartContract<ethers.BaseContract> | undefined;
    }>
  >;
  getBalances: (
    account: any,
    token: any
  ) => Promise<{ tokenDex: any; tokenWallet: any } | undefined>;
  getOrders: (token: any) => Promise<{ buy: any; sell: any } | undefined>;
  selectToken: (token: any) => void;
  deposit: (amount: any) => Promise<void>;
  withdraw: (amount: any) => Promise<void>;
  createMarketOrder: (amount: any, side: any) => Promise<void>;
  createLimitOrder: (amount: any, price: any, side: any) => Promise<void>;
};

type BlockchainContextProviderProps = {
  children: React.ReactNode;
};

export const BlockchainContext = createContext<BlockchainContextType>(
  {} as BlockchainContextType
);

export const BlockchainContextProvider = ({
  children,
}: BlockchainContextProviderProps) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [user, setUser] = useState<any>({
    account: [],
    balances: {
      tokenDex: 0,
      tokenWallet: 0,
    },
    selectedToken: undefined,
  });
  const [trades, setTrades] = useState<
    ContractEvent<Record<string, any>>[] | undefined
  >();
  const [orders, setOrders] = useState<any>({
    buy: [],
    sell: [],
  });
  const [tokenContracts, setTokenContracts] = useState<{
    [ticker: string]: SmartContract<ethers.BaseContract> | undefined;
  }>({});

  const sdk = new ThirdwebSDK(Mumbai, {
    clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
  });
  const account = "0x65150630Ee1C0b16d056bA64eF30530Eb49249Ea";
  const { contract: dexContract, isLoading: loadingDex } = useContract(
    DEX_CONTRACT_ADDRESSES
  );

  const getBalances = async (account: string, token: any) => {
    if (!loadingDex && tokenContracts && token) {
      const tokenDex = await dexContract!.call("traderBalances", [
        account,
        token.ticker,
      ]);
      const tokenWallet = await tokenContracts[token.ticker]!.call(
        "balanceOf",
        ["0x65150630Ee1C0b16d056bA64eF30530Eb49249Ea"]
      );
      return { tokenDex, tokenWallet };
    }
  };

  const getOrders = async (token: any) => {
    if (!loadingDex && token) {
      const orders = await Promise.all([
        dexContract!.call("getOrders", [token.ticker, SIDE.BUY]),
        dexContract!.call("getOrders", [token.ticker, SIDE.SELL]),
      ]);
      return { buy: orders[0], sell: orders[1] };
    }
  };

  useEffect(() => {
    const init = async () => {
      const [balances, orders] = await Promise.all([
        getBalances(user.account[0], user.selectedToken),
        getOrders(user.selectedToken),
      ]);
      setUser((user: any) => ({ ...user, balances }));
      setOrders(orders);
    };
    if (typeof user.selectedToken !== "undefined") {
      init();
    }
  }, [user.selectedToken]);

  const selectToken = (token: any) => {
    setUser((user: any) => ({ ...user, selectedToken: token }));
  };

  const deposit = async (amount: any) => {
    await tokenContracts[user.selectedToken.ticker]!.call("approve", [
      ethers.utils.getAddress(DEX_CONTRACT_ADDRESSES),
      amount,
    ]);
    await dexContract!.call("deposit", [amount, user.selectedToken.ticker]);
    const balances = await getBalances(user.accounts[0], user.selectedToken);
    setUser((user: any) => ({ ...user, balances }));
  };

  const withdraw = async (amount: any) => {
    await dexContract!.call("withdraw", [amount, user.selectedToken.ticker]);
    const balances = await getBalances(user.accounts[0], user.selectedToken);
    setUser((user: any) => ({ ...user, balances }));
  };

  const createMarketOrder = async (amount: any, side: any) => {
    await dexContract!.call("createMarketOrder", [
      user.selectedToken.ticker,
      amount,
      side,
    ]);
    const orders = await getOrders(user.selectedToken);
    setOrders(orders);
  };

  const createLimitOrder = async (amount: any, price: any, side: any) => {
    await dexContract!.call("createLimitOrder", [
      user.selectedToken.ticker,
      amount,
      price,
      side,
    ]);
    const orders = await getOrders(user.selectedToken);
    setOrders(orders);
  };

  useEffect(() => {
    const initContract = async () => {
      if (!loadingDex) {
        const _tokens = await dexContract!.call("getTokens");
        console.log(_tokens);
        const tokenContracts: {
          [ticker: string]: SmartContract<ethers.BaseContract> | undefined;
        } = {};
        for (const token of _tokens) {
          const tokenContract = await sdk.getContract(token.tokenAddress);
          tokenContracts[token.ticker] = tokenContract;
        }
        setTokenContracts(tokenContracts);

        const tokens = _tokens.map((token: any, i: number) => {
          return { ...token, ticker: token.ticker };
        });
        setTokens(tokens);
      }
    };
    const init = async (account: any) => {
      if (!loadingDex) {
        const [balances, orders] = await Promise.all([
          getBalances(account, tokens[0]),
          getOrders(tokens[0]),
        ]);
        setUser({ account, balances, selectedToken: tokens[0] });
        setOrders(orders);
      }
    };
    initContract();
    init(account);
    // eslint-disable-next-line
  }, [dexContract, tokenContracts]);

  const isReady = () => {
    console.log(loadingDex);
    console.log(tokenContracts);
    console.log(user.selectedToken);
    return (
      !loadingDex && tokenContracts && typeof user.selectedToken !== "undefined"
    );
  };

  if (!isReady()) {
    return <Loading />;
  }

  return (
    <BlockchainContext.Provider
      value={{
        tokens,
        setTokens,
        user,
        setUser,
        orders,
        setOrders,
        trades,
        tokenContracts,
        setTokenContracts,
        getBalances,
        getOrders,
        selectToken,
        deposit,
        withdraw,
        createMarketOrder,
        createLimitOrder,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchainContext = () => useContext(BlockchainContext);
