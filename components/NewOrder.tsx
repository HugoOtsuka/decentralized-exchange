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

const TYPE = {
  LIMIT: "LIMIT",
  MARKET: "MARKET",
};

const SIDE = {
  BUY: 0,
  SELL: 1,
};

export default function NewOrder() {
  const [order, setOrder] = useState({
    type: TYPE.LIMIT,
    side: SIDE.BUY,
    amount: "",
    price: "",
  });

  const { createMarketOrder, createLimitOrder } = useBlockchainContext();

  const onSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (order.type === TYPE.MARKET) {
      createMarketOrder(order.amount, order.side);
    } else {
      createLimitOrder(order.amount, order.price, order.side);
    }
  };

  return (
    <Card>
      <h2 className="card-title">New Order</h2>
      <FormControl onSubmit={(e) => onSubmit(e)}>
        <Flex>
          <FormLabel htmlFor="type" className="col-sm-4 col-form-FormLabel">
            Type
          </FormLabel>
          <ButtonGroup>
            <Button
              type="button"
              className={`btn btn-secondary ${
                order.type === TYPE.LIMIT ? "active" : ""
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, type: TYPE.LIMIT }))
              }
            >
              Limit
            </Button>
            <Button
              type="button"
              className={`btn btn-secondary ${
                order.type === TYPE.MARKET ? "active" : ""
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, type: TYPE.MARKET }))
              }
            >
              Market
            </Button>
          </ButtonGroup>
        </Flex>
        <Flex>
          <FormLabel htmlFor="side" className="col-sm-4 col-form-FormLabel">
            Side
          </FormLabel>
          <ButtonGroup>
            <Button
              type="button"
              className={`btn btn-secondary ${
                order.side === SIDE.BUY ? "active" : ""
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, side: SIDE.BUY }))
              }
            >
              Buy
            </Button>
            <Button
              type="button"
              className={`btn btn-secondary ${
                order.side === SIDE.SELL ? "active" : ""
              }`}
              onClick={() =>
                setOrder((order) => ({ ...order, side: SIDE.SELL }))
              }
            >
              Sell
            </Button>
          </ButtonGroup>
        </Flex>
        <Flex>
          <FormLabel
            className="col-sm-4 col-form-FormLabel"
            htmlFor="order-amount"
          >
            Amount
          </FormLabel>
          <Input
            type="text"
            className="form-control"
            id="order-amount"
            onChange={({ target: { value } }) =>
              setOrder((order) => ({ ...order, amount: value }))
            }
          />
        </Flex>
        {order.type === TYPE.MARKET ? null : (
          <Flex>
            <FormLabel
              className="col-sm-4 col-form-FormLabel"
              htmlFor="order-amount"
            >
              Price
            </FormLabel>
            <Input
              type="text"
              className="form-control"
              id="order-price"
              onChange={({ target: { value } }) =>
                setOrder((order) => ({ ...order, price: value }))
              }
            />
          </Flex>
        )}
        <Flex>
          <Button type="submit" className="btn btn-primary">
            Submit
          </Button>
        </Flex>
      </FormControl>
    </Card>
  );
}
