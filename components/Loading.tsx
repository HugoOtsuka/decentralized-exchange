import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

const Loading: React.FC = () => {
  return (
    <Flex minHeight="100vh" alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <ConnectWallet />
      </Box>
    </Flex>
  );
};

export default Loading;
