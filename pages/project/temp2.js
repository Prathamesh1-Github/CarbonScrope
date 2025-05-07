import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Link, 
  Flex, 
  Grid, 
  GridItem, 
  Button, 
  Badge, 
  Stack, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow,
  Progress,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { 
  ArrowDown, 
  ArrowUp, 
  Download, 
  Github as GitHubIcon, 
  BarChart, 
  Cpu, 
  Clock, 
  HardDrive, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

function App() {
  // Mock project data
  const project = {
    name: "Green Code Project",
    desc: "A sustainable coding project focused on reducing carbon footprint",
    github: "https://github.com/username/green-code-project",
    languages_used: {
      "JavaScript": 60,
      "Python": 25,
      "Java": 15
    },
    language_lines: {
      "javascript": 5000,
      "python": 2000,
      "java": 1200
    },
    domain: "WebDevelopment"
  };

  // Mock calculation results
  const mockCalculationResults = {
    energy: {
      javascript: 75,
      javascriptPercent: '45.00',
      python: 60,
      pythonPercent: '15.00',
      java: 85,
      javaPercent: '12.75',
      total: 72.75
    },
    time: {
      javascript: 70,
      javascriptPercent: '42.00',
      python: 65,
      pythonPercent: '16.25',
      java: 75,
      javaPercent: '11.25',
      total: 69.50
    },
    memory: {
      javascript: 80,
      javascriptPercent: '48.00',
      python: 70,
      pythonPercent: '17.50',
      java: 65,
      javaPercent: '9.75',
      total: 75.25
    },
    carbon_footprint: 2.175,
    suggestions: {
      javascript: "typescript",
      python: "go",
      java: "rust"
    }
  };

  // Mock suggestion results
  const mockSuggestionResults = {
    suggestion_energy: {
      typescript: 65,
      typescriptPercent: '39.00',
      go: 50,
      goPercent: '12.50',
      rust: 45,
      rustPercent: '6.75',
      total: 58.25
    },
    suggestion_time: {
      typescript: 60,
      typescriptPercent: '36.00',
      go: 45,
      goPercent: '11.25',
      rust: 40,
      rustPercent: '6.00',
      total: 53.25
    },
    suggestion_memory: {
      typescript: 70,
      typescriptPercent: '42.00',
      go: 40,
      goPercent: '10.00',
      rust: 35,
      rustPercent: '5.25',
      total: 57.25
    },
    suggestion_carbon_footprint: 1.6875
  };

  const [calculationDone, setCalculationDone] = useState(false);
  const [suggestionDone, setSuggestionDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const calcPercentandTotal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCalculationDone(true);
      setIsLoading(false);
      toast({
        title: 'Calculation complete',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }, 1000);
  };

  const handleSubmission = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSuggestionDone(true);
      setIsLoading(false);
      toast({
        title: 'Suggestions generated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }, 1000);
  };

  const percentageChange = () => {
    if (!suggestionDone) return 0;
    return (((mockSuggestionResults.suggestion_carbon_footprint - mockCalculationResults.carbon_footprint) / mockCalculationResults.carbon_footprint) * 100).toFixed(2);
  };

  return (
    <Box minH="100vh" bg="gray.50" p={{ base: 4, md: 8 }}>
      <Box maxW="7xl" mx="auto">
        {/* Header */}
        <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6}>
          <Heading as="h1" size="xl" color="gray.800" mb={2}>Project Analysis</Heading>
          <Text color="gray.600" maxW="2xl">
            Analyze your project's environmental impact and discover eco-friendly technology alternatives
          </Text>
        </Box>

        {/* Project Info */}
        <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6}>
          <Box mb={6}>
            <Heading as="h2" size="lg" color="gray.800" textTransform="uppercase" letterSpacing="wider" mb={3}>
              {project.name}
            </Heading>
            <Text color="gray.600" mb={4}>
              {project.desc}
            </Text>
            <Flex alignItems="center" mb={4}>
              <GitHubIcon size="20px" color="gray.700" mr={2} />
              <Link 
                href={project.github} 
                color="blue.600" 
                _hover={{ color: "blue.800" }} 
                isExternal
              >
                {project.github}
              </Link>
            </Flex>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>Current Technologies</Text>
              <Flex flexWrap="wrap" gap={2}>
                {Object.keys(project.languages_used).map((key) => (
                  <Badge 
                    key={key} 
                    px={3} 
                    py={1} 
                    borderRadius="full" 
                    colorScheme="green"
                  >
                    {key} ({project.languages_used[key]}%)
                  </Badge>
                ))}
              </Flex>
            </Box>
          </Box>
          
          <Flex flexWrap="wrap" gap={3}>
            <Button 
              onClick={calcPercentandTotal}
              isLoading={isLoading && !calculationDone}
              loadingText="Calculating..."
              colorScheme="green"
              variant="outline"
            >
              Calculate Impact
            </Button>
            
            <Button 
              onClick={handleSubmission}
              isLoading={isLoading && calculationDone}
              loadingText="Processing..."
              isDisabled={!calculationDone}
              colorScheme="blue"
              variant="outline"
            >
              Generate Suggestions
            </Button>
          </Flex>
        </Box>

        {calculationDone && (
          <>
            {/* Current Metrics */}
            <Heading as="h2" size="xl" color="gray.800" mb={4}>Current Environmental Impact</Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
              <GridItem>
                <Box bg="white" borderRadius="lg" boxShadow="md" p={6} transition="all 0.3s" _hover={{ boxShadow: "lg" }}>
                  <Flex alignItems="center" mb={3}>
                    <Cpu size="24px" color="#D97706" mr={2} />
                    <Heading as="h3" size="md" color="gray.800">Energy Consumption</Heading>
                  </Flex>
                  <Stat>
                    <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900">
                      {mockCalculationResults.energy.total.toFixed(2)}
                    </StatNumber>
                    <StatHelpText>units</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>
              
              <GridItem>
                <Box bg="white" borderRadius="lg" boxShadow="md" p={6} transition="all 0.3s" _hover={{ boxShadow: "lg" }}>
                  <Flex alignItems="center" mb={3}>
                    <Clock size="24px" color="#5B21B6" mr={2} />
                    <Heading as="h3" size="md" color="gray.800">Execution Time</Heading>
                  </Flex>
                  <Stat>
                    <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900">
                      {mockCalculationResults.time.total.toFixed(2)}
                    </StatNumber>
                    <StatHelpText>units</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>
              
              <GridItem>
                <Box bg="white" borderRadius="lg" boxShadow="md" p={6} transition="all 0.3s" _hover={{ boxShadow: "lg" }}>
                  <Flex alignItems="center" mb={3}>
                    <HardDrive size="24px" color="#7C3AED" mr={2} />
                    <Heading as="h3" size="md" color="gray.800">Memory Usage</Heading>
                  </Flex>
                  <Stat>
                    <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900">
                      {mockCalculationResults.memory.total.toFixed(2)}
                    </StatNumber>
                    <StatHelpText>units</StatHelpText>
                  </Stat>
                </Box>
              </GridItem>
            </Grid>

            {/* Suggested Technologies */}
            <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6}>
              <Heading as="h2" size="md" color="gray.800" mb={3}>Suggested Technologies</Heading>
              <Flex flexWrap="wrap" gap={2} mb={4}>
                {Object.keys(mockCalculationResults.suggestions).map((key) => (
                  <Flex key={key} alignItems="center" gap={1}>
                    <Badge px={3} py={1} borderRadius="full" colorScheme="gray">
                      {key}
                    </Badge>
                    <ArrowRight size="16px" color="gray.500" />
                    <Badge px={3} py={1} borderRadius="full" colorScheme="blue">
                      {mockCalculationResults.suggestions[key]}
                    </Badge>
                  </Flex>
                ))}
              </Flex>
            </Box>
            
            {suggestionDone && (
              <>
                {/* Improved Metrics */}
                <Heading as="h2" size="xl" color="gray.800" mb={4}>Projected Environmental Impact</Heading>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
                  <GridItem>
                    <Box bg="white" borderRadius="lg" boxShadow="md" p={6} transition="all 0.3s" _hover={{ boxShadow: "lg" }}>
                      <Flex alignItems="center" mb={3}>
                        <Cpu size="24px" color="#D97706" mr={2} />
                        <Heading as="h3" size="md" color="gray.800">Energy Consumption</Heading>
                      </Flex>
                      <Stat>
                        <Flex alignItems="flex-end" gap={2}>
                          <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900">
                            {mockSuggestionResults.suggestion_energy.total.toFixed(2)}
                          </StatNumber>
                          <StatHelpText color="green.600">
                            <StatArrow type="decrease" />
                            {((mockCalculationResults.energy.total - mockSuggestionResults.suggestion_energy.total) / mockCalculationResults.energy.total * 100).toFixed(2)}%
                          </StatHelpText>
                        </Flex>
                        <StatHelpText>units</StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                  
                  <GridItem>
                    <Box bg="white" borderRadius="lg" boxShadow="md" p={6} transition="all 0.3s" _hover={{ boxShadow: "lg" }}>
                      <Flex alignItems="center" mb={3}>
                        <Clock size="24px" color="#5B21B6" mr={2} />
                        <Heading as="h3" size="md" color="gray.800">Execution Time</Heading>
                      </Flex>
                      <Stat>
                        <Flex alignItems="flex-end" gap={2}>
                          <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900">
                            {mockSuggestionResults.suggestion_time.total.toFixed(2)}
                          </StatNumber>
                          <StatHelpText color="green.600">
                            <StatArrow type="decrease" />
                            {((mockCalculationResults.time.total - mockSuggestionResults.suggestion_time.total) / mockCalculationResults.time.total * 100).toFixed(2)}%
                          </StatHelpText>
                        </Flex>
                        <StatHelpText>units</StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                  
                  <GridItem>
                    <Box bg="white" borderRadius="lg" boxShadow="md" p={6} transition="all 0.3s" _hover={{ boxShadow: "lg" }}>
                      <Flex alignItems="center" mb={3}>
                        <HardDrive size="24px" color="#7C3AED" mr={2} />
                        <Heading as="h3" size="md" color="gray.800">Memory Usage</Heading>
                      </Flex>
                      <Stat>
                        <Flex alignItems="flex-end" gap={2}>
                          <StatNumber fontSize="3xl" fontWeight="bold" color="gray.900">
                            {mockSuggestionResults.suggestion_memory.total.toFixed(2)}
                          </StatNumber>
                          <StatHelpText color="green.600">
                            <StatArrow type="decrease" />
                            {((mockCalculationResults.memory.total - mockSuggestionResults.suggestion_memory.total) / mockCalculationResults.memory.total * 100).toFixed(2)}%
                          </StatHelpText>
                        </Flex>
                        <StatHelpText>units</StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                </Grid>

                {/* Carbon Footprint Comparison */}
                <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <Heading as="h2" size="md" color="gray.800" mb={4}>Carbon Emission Impact</Heading>
                  
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                    <GridItem>
                      <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="lg">
                        <Heading as="h3" size="sm" fontWeight="medium" color="gray.700" mb={2}>Current Carbon Emission</Heading>
                        <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                          {mockCalculationResults.carbon_footprint.toFixed(4)}
                        </Text>
                        <Alert status="warning" variant="left-accent" mt={1} fontSize="sm">
                          <AlertIcon boxSize="16px" />
                          Baseline measurement
                        </Alert>
                      </Box>
                    </GridItem>
                    
                    <GridItem>
                      <Box p={4} borderWidth="1px" borderColor="gray.200" borderRadius="lg">
                        <Heading as="h3" size="sm" fontWeight="medium" color="gray.700" mb={2}>Projected Carbon Emission</Heading>
                        <Text fontSize="3xl" fontWeight="bold" color="green.600">
                          {mockSuggestionResults.suggestion_carbon_footprint.toFixed(4)}
                        </Text>
                        <Alert status="success" variant="left-accent" mt={1} fontSize="sm">
                          <AlertIcon boxSize="16px" />
                          {Math.abs(Number(percentageChange()))}% reduction
                        </Alert>
                      </Box>
                    </GridItem>
                  </Grid>
                  
                  <Progress value={77} size="sm" colorScheme="green" mt={6} borderRadius="full" />
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Implementing suggested changes could reduce your carbon footprint by approximately {Math.abs(Number(percentageChange()))}%
                  </Text>
                </Box>
              </>
            )}
            
            {/* Visualization Section */}
            <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6} textAlign="center">
              <Heading as="h2" size="md" color="gray.800" mb={3}>Visualization</Heading>
              <Text color="gray.600" mb={4}>Download the report data to visualize in Power BI</Text>
              
              <Button colorScheme="blue" variant="outline" leftIcon={<Download size="16px" />}>
                Download Report Data
              </Button>
              
              <Box mt={8} p={4} borderWidth="1px" borderColor="gray.200" borderRadius="lg">
                <Flex alignItems="center" justifyContent="center">
                  <BarChart size="32px" color="gray.400" />
                  <Text ml={3} color="gray.500">Power BI visualization will appear here after configuration</Text>
                </Flex>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;