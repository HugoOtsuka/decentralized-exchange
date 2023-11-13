import { Card, Flex } from "@chakra-ui/react";
import { DEX_CONTRACT_ADDRESSES } from "../constants/addresses";
import Dropdown from "./Dropdown";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Navbar() {
  return (
    <Card>
      <Flex>
        <Dropdown />
        <h1>
          Dex -{" "}
          <span>
            Contract address:{" "}
            <span className="address">{DEX_CONTRACT_ADDRESSES}</span>
          </span>
        </h1>
        <ConnectWallet />
      </Flex>
    </Card>
  );
}
