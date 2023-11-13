import { Fragment } from "react";
import { useBlockchainContext } from "../context/BlockchainContext";
import { Card, Flex } from "@chakra-ui/react";
import Moment from "react-moment";

export default function AllOrders() {
  const { orders } = useBlockchainContext();

  const renderList = (orders: any, side: string) => {
    return (
      <Fragment>
        <table>
          <thead>
            <tr className="table-title order-list-title">
              <th colSpan={3}>{side}</th>
            </tr>
            <tr>
              <th>amount</th>
              <th>price</th>
              <th>date</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </Fragment>
    );
  };

  return (
    <Card>
      <h2 className="card-title">All orders</h2>
      <Flex>
        {renderList(orders.buy, "Buy")}
        {renderList(orders.sell, "Sell")}
      </Flex>
    </Card>
  );
}
