import { useState } from "react";
import { useBlockchainContext } from "../context/BlockchainContext";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";

export default function Dropdown() {
  const { selectToken, tokens, user } = useBlockchainContext();

  const activeItem = {
    label: ethers.utils.toUtf8String(user.selectedToken.ticker),
    value: user.selectedToken,
  };

  const items = tokens.map((token: any) => ({
    label: ethers.utils.toUtf8String(token.ticker),
    value: token,
  }));

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {activeItem.label}
        </MenuButton>
        <MenuList>
          {items &&
            items.map((item, i) => (
              <MenuItem key={i} onClick={() => selectToken(item.value)}>
                {item.label}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </>
  );
}
