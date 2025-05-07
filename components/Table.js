import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

export const Th = (props) => (
  <Text
    as="th"
    textTransform="uppercase"
    fontSize="xs"
    color="gray.600"
    fontWeight="semibold"
    px={4}
    py={3}
    borderBottom="2px solid"
    borderBottomColor="gray.200"
    letterSpacing="wider"
    {...props}
  />
);

export const Td = (props) => {
  const bgHover = useColorModeValue("gray.50", "gray.700");
  
  return (
    <Box
      as="td"
      color="gray.800"
      p={4}
      borderBottom="1px solid"
      borderBottomColor="gray.100"
      transition="background-color 0.2s"
      _hover={{ bg: bgHover }}
      {...props}
    />
  );
};

export const Tr = (props) => {
  const { isHeader, ...rest } = props;
  
  return (
    <Box
      as="tr"
      borderTopLeftRadius={isHeader ? 8 : 0}
      borderTopRightRadius={isHeader ? 8 : 0}
      borderBottom="1px solid"
      borderBottomColor="gray.200"
      transition="all 0.2s"
      _hover={isHeader ? {} : { bg: "gray.50" }}
      {...rest}
    />
  );
};

export const Table = (props) => {
  return (
    <Box
      as="table"
      width="100%"
      textAlign="left"
      backgroundColor="white"
      borderRadius={8}
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.05)"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)"
      }}
      {...props}
    />
  );
};