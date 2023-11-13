import { FormEvent, useState } from "react";
import { useBlockchainContext } from "../context/BlockchainContext";
import {
  Button,
  ButtonGroup,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { ethers } from "ethers";

const DIRECTION = {
  WITHDRAW: "WITHDRAW",
  DEPOSIT: "DEPOSIT",
};

export default function Wallet() {
  const [direction, setDirection] = useState(DIRECTION.DEPOSIT);
  const [amount, setAmount] = useState(0);

  const { deposit, withdraw, user } = useBlockchainContext();

  const onSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (direction === DIRECTION.DEPOSIT) {
      deposit(amount);
    } else {
      withdraw(amount);
    }
  };

  return (
    <Card>
      <h2 className="card-title">Wallet</h2>
      <h3>
        Token balance for {ethers.utils.toUtf8String(user.selectedToken.ticker)}
      </h3>
      <Flex>
        <FormLabel htmlFor="wallet">Wallet</FormLabel>
        <Input
          className="form-control"
          id="wallet"
          disabled
          value={user.balances.tokenWallet}
        />
      </Flex>
      <Flex>
        <FormLabel htmlFor="contract">Dex</FormLabel>
        <Input
          className="form-control"
          id="wallet"
          disabled
          value={user.balances.tokenDex}
        />
      </Flex>
      <h3>Transfer {ethers.utils.toUtf8String(user.selectedToken.ticker)}</h3>
      <FormControl id="transfer" onSubmit={(e) => onSubmit(e)}>
        <Flex>
          <FormLabel
            htmlFor="direction"
            className="col-sm-4 col-form-FormLabel"
          >
            Direction
          </FormLabel>
          <ButtonGroup id="direction" className="btn-group" role="group">
            <Button
              type="button"
              className={`btn btn-secondary ${
                direction === DIRECTION.DEPOSIT ? "active" : ""
              }`}
              onClick={() => setDirection(DIRECTION.DEPOSIT)}
            >
              Deposit
            </Button>
            <Button
              type="button"
              className={`btn btn-secondary ${
                direction === DIRECTION.WITHDRAW ? "active" : ""
              }`}
              onClick={() => setDirection(DIRECTION.WITHDRAW)}
            >
              Withdraw
            </Button>
          </ButtonGroup>
        </Flex>
        <Flex>
          <FormLabel htmlFor="amount" className="col-sm-4 col-form-FormLabel">
            Amount
          </FormLabel>
          <Input
            id="amount"
            type="text"
            className="form-control"
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </Flex>
        <Flex>
          <Button type="submit" className="btn btn-primary">
            Submit
          </Button>
        </Flex>
      </FormControl>
    </Card>
  );
}
