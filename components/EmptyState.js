import React from 'react';
import { 
  Heading, 
  Flex, 
  Text, 
  Icon, 
  VStack, 
  Box,
  useColorModeValue
} from '@chakra-ui/react';
import { Github } from 'lucide-react';
import AddProjectModal from '@/components/AddProjectModal';

const EmptyState = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Flex
      width="100%"
      backgroundColor={bgColor}
      borderRadius="xl"
      p={10}
      justify="center"
      align="center"
      direction="column"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      minH="400px"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="8px"
        bgGradient="linear(to-r, teal.400, teal.200)"
      />
      
      <VStack spacing={6} textAlign="center" maxW="500px">
        <Icon 
          as={Github} 
          boxSize={16} 
          color="teal.500" 
          mb={2}
        />
        
        <Heading 
          size="lg" 
          fontWeight="bold"
          bgGradient="linear(to-r, gray.800, gray.600)" 
          bgClip="text"
        >
          No projects yet
        </Heading>
        
        <Text 
          fontSize="lg" 
          color="gray.600" 
          mb={6}
          maxW="400px"
        >
          Get started by connecting a GitHub repository to analyze its carbon footprint 
          and receive optimization recommendations.
        </Text>
        
        <AddProjectModal>
          Add Your First Project
        </AddProjectModal>
      </VStack>
    </Flex>
  );
};

export default EmptyState;