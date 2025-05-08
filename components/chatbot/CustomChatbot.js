import { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { Send } from "lucide-react";
import axios from "axios";

const CustomChatbot = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setIsSending(true);

    try {
      const res = await axios.post("http://localhost:8000/query", {
        query: input,
        projectId: props.projectId,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, couldn't connect to the server." },
      ]);
    } finally {
      setInput("");
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" mt={6}>
      <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto" mb={4}>
        {messages.map((msg, i) => (
          <Flex key={i} justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
            <Box
              bg={msg.sender === "user" ? "blue.500" : "gray.200"}
              color={msg.sender === "user" ? "white" : "black"}
              px={4}
              py={2}
              borderRadius="md"
              maxW="70%"
            >
              <Text>{msg.text}</Text>
            </Box>
          </Flex>
        ))}
        {isSending && (
          <Flex justify="flex-start">
            <Spinner size="sm" color="blue.500" />
          </Flex>
        )}
      </VStack>

      <Flex gap={2}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the project..."
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleSend} colorScheme="blue" isDisabled={isSending}>
          <Icon as={Send} />
        </Button>
      </Flex>
    </Box>
  );
};

export default CustomChatbot;
