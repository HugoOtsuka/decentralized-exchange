import { NextPage } from "next";
import { Container, Flex } from "@chakra-ui/react";
import { useBlockchainContext } from "../context/BlockchainContext";
import Wallet from "../components/Wallet";
import NewOrder from "../components/NewOrder";
import AllTrades from "../components/AllTrades";
import AllOrders from "../components/AllOrders";
import MyOrders from "../components/MyOrders";
import { ethers } from "ethers";

const Home: NextPage = () => {
  const { user } = useBlockchainContext();

  return (
    <>
      <Container>
        <Flex>
          <Flex direction={"column"}>
            <div>Wallet</div>
            {ethers.utils.toUtf8String(user.selectedToken.ticker) !== "DAI" ? (
              <div>NewOrder</div>
            ) : null}
          </Flex>
          {ethers.utils.toUtf8String(user.selectedToken.ticker) !== "DAI" ? (
            <Flex direction={"column"}>
              <div>AllOrders</div>
              <div>MyOrders</div>
            </Flex>
          ) : null}
        </Flex>
      </Container>
    </>
  );
};

export default Home;
