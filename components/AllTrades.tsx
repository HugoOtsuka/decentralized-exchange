import { Fragment } from "react";
import Moment from "react-moment";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useBlockchainContext } from "../context/BlockchainContext";
import { Card, Flex } from "@chakra-ui/react";

export default function AllTrades() {
  const { trades } = useBlockchainContext();
  console.log(trades);

  const renderChart = () => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={trades}>
          <Line type="monotone" dataKey="price" stroke="#741cd7" />
          <CartesianGrid stroke="#000000" />
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => {
              const date = new Date(parseInt(dateStr) * 1000);
              return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            }}
          />
          <YAxis dataKey="price" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderList = () => {
    return (
      <Fragment>
        <table>
          <thead>
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
      <h2 className="card-title">All trades</h2>
      <Flex direction={"column"}>
        {renderChart()}
        {renderList()}
      </Flex>
    </Card>
  );
}
