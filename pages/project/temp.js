import {
    Box, Heading, Button, Tag, Link, Stack, Text, Card, CardHeader, CardBody, CardFooter, Stat,
    StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, SimpleGrid, Grid, GridItem,
    Flex, Progress, Alert, AlertIcon, useToast, Badge
} from "@chakra-ui/react";
import { Engine } from 'json-rules-engine';
import { getAllProjects, getProjectById } from "@/lib/db-admin";
import { useEffect, useState } from "react";
import { ArrowDown, Download, BarChart, Cpu, Clock, HardDrive, AlertCircle, ArrowRight } from 'lucide-react';

import Energy from '../rules/Energy.json'
import Time from '../rules/Time.json'
import Memory from '../rules/Memory.json'
import Suggestion from '../rules/Suggestion.json'
import { updateProjectByGithub } from "@/lib/db";
import ProjectShell from "@/components/ProjectShell";

export async function getStaticProps(context) {
    const projectId = context.params.projectId;
    const project = await getProjectById(projectId);
    return {
        props: {
            project: project,
        },
        revalidate: 5,
    }
}

export async function getStaticPaths() {
    const { projects } = await getAllProjects();
    const paths = projects.map((project) => ({
        params: {
            projectId: project.id.toString()
        }
    }))
    return {
        paths,
        fallback: false,
    }
}

const AnalysisPage = ({ project }) => {
    const [suggestions, setSuggestions] = useState({});
    const [es, setEs] = useState({});
    const [ts, setTs] = useState({});
    const [ms, setMs] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [calculationDone, setCalculationDone] = useState(false);
    const [suggestionDone, setSuggestionDone] = useState(false);
    const toast = useToast();

    let e = {};
    let t = {};
    let m = {};
    let cf;
    let cfs;

    const processSuggestionEnergy = (inputs, decisions) => {
        const engine = new Engine(decisions);
        engine.run(inputs)
            .then(results => {
                if (results.events[0] != undefined) {
                    setEs(prevState => ({
                        ...prevState,
                        [inputs.language]: parseFloat(results.events[0]['type'])
                    }));
                }
            });
    };

    const processSuggestionTime = (inputs, decisions) => {
        const engine = new Engine(decisions);
        engine.run(inputs)
            .then(results => {
                if (results.events[0] != undefined) {
                    setTs(prevState => ({
                        ...prevState,
                        [inputs.language]: parseFloat(results.events[0]['type'])
                    }));
                }
            });
    };

    const processSuggestionMemory = (inputs, decisions) => {
        const engine = new Engine(decisions);
        engine.run(inputs)
            .then(results => {
                if (results.events[0] != undefined) {
                    setMs(prevState => ({
                        ...prevState,
                        [inputs.language]: parseFloat(results.events[0]['type'])
                    }));
                }
            });
    };

    const processEnergy = (inputs, decisions) => {
        const engine = new Engine(decisions);
        engine.run(inputs)
            .then(results => {
                if (results.events[0] != undefined) {
                    e[inputs.language] = parseFloat(results.events[0]['type']);
                }
            });
    };

    const processTime = (inputs, decisions) => {
        const engine = new Engine(decisions);
        engine.run(inputs)
            .then(results => {
                if (results.events[0] != undefined) {
                    t[inputs.language] = parseFloat(results.events[0]['type']);
                }
            });
    };

    const processMemory = (inputs, decisions) => {
        const engine = new Engine(decisions);
        engine.run(inputs)
            .then(results => {
                if (results.events[0] != undefined) {
                    m[inputs.language] = parseFloat(results.events[0]['type']);
                }
            });
    };

    const calcPercentandTotal = async () => {
        setIsLoading(true);
        let totalE = 0;
        let totalT = 0;
        let totalM = 0;
        
        Object.keys(project.languages_used).forEach((key) => {
            if (e[key.toLowerCase()] != undefined && t[key.toLowerCase()] != undefined & m[key.toLowerCase()] != undefined) {
                e[key.toLowerCase().concat('Percent')] = (e[key.toLowerCase()] * project.languages_used[key] / 100.0).toFixed(2);
                t[key.toLowerCase().concat('Percent')] = (t[key.toLowerCase()] * project.languages_used[key] / 100.0).toFixed(2);
                m[key.toLowerCase().concat('Percent')] = (m[key.toLowerCase()] * project.languages_used[key] / 100.0).toFixed(2);
                totalE += parseFloat(e[key.toLowerCase().concat('Percent')]);
                totalT += parseFloat(t[key.toLowerCase().concat('Percent')]);
                totalM += parseFloat(m[key.toLowerCase().concat('Percent')]);
            }
        });
        
        e['total'] = totalE;
        t['total'] = totalT;
        m['total'] = totalM;
        cf = (e['total'] + t['total'] + m['total']) / 100;

        let newSuggestions = {};
        Object.keys(project.languages_used).forEach((key) => {
            if (Suggestion[key.toLowerCase()]) {
                Object.keys(Suggestion[key.toLowerCase()]).forEach((key2) => {
                    if (project.domain.toString().trim() == key2.toString().trim()) {
                        newSuggestions[key.toLowerCase()] = Suggestion[key.toLowerCase()][key2];
                    }
                });
            }
        });
        
        Object.keys(newSuggestions).forEach((key) => {
            processSuggestionEnergy({ language: newSuggestions[key] }, Energy.decisions);
            processSuggestionTime({ language: newSuggestions[key] }, Time.decisions);
            processSuggestionMemory({ language: newSuggestions[key] }, Memory.decisions);
        });

        setSuggestions(newSuggestions);
        await updateProjectByGithub(project.github, {
            energy: e,
            time: t,
            memory: m,
            carbon_footprint: cf,
            suggestions: newSuggestions,
        });
        
        setCalculationDone(true);
        setIsLoading(false);
        toast({
            title: 'Calculation complete',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    const handleSubmission = async () => {
        setIsLoading(true);
        let totalE = 0;
        let totalT = 0;
        let totalM = 0;
        
        Object.keys(suggestions).forEach((key) => {
            es[suggestions[key].concat('Percent')] = (es[suggestions[key]] * project.languages_used[key] / 100.0).toFixed(2);
            ts[suggestions[key].concat('Percent')] = (ts[suggestions[key]] * project.languages_used[key] / 100.0).toFixed(2);
            ms[suggestions[key].concat('Percent')] = (ms[suggestions[key]] * project.languages_used[key] / 100.0).toFixed(2);
            totalE += parseFloat(es[suggestions[key].concat('Percent')]);
            totalT += parseFloat(ts[suggestions[key].concat('Percent')]);
            totalM += parseFloat(ms[suggestions[key].concat('Percent')]);
        });
        
        es['total'] = totalE;
        ts['total'] = totalT;
        ms['total'] = totalM;
        cfs = (es['total'] + ts['total'] + ms['total']) / 100;

        await updateProjectByGithub(project.github, {
            suggestion_energy: es,
            suggestion_time: ts,
            suggestion_memory: ms,
            suggestion_carbon_footprint: cfs
        });
        
        setSuggestionDone(true);
        setIsLoading(false);
        toast({
            title: 'Suggestions generated',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    useEffect(() => {
        Object.keys(project?.language_lines).forEach((key) => {
            processEnergy({ language: key.toLowerCase() }, Energy.decisions);
            processTime({ language: key.toLowerCase() }, Time.decisions);
            processMemory({ language: key.toLowerCase() }, Memory.decisions);
        });
    }, [project]);

    const percentageChange = () => {
        if (!suggestionDone || !project?.suggestion_carbon_footprint || !project?.carbon_footprint) return 0;
        return (((project.suggestion_carbon_footprint - project.carbon_footprint) / project.carbon_footprint) * 100).toFixed(2);
    };

    return (
        <ProjectShell>
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

                    {calculationDone && project?.energy && project?.time && project?.memory && (
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
                                                {project.energy.total.toFixed(2)}
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
                                                {project.time.total.toFixed(2)}
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
                                                {project.memory.total.toFixed(2)}
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
                                    {Object.keys(project.suggestions).map((key) => (
                                        <Flex key={key} alignItems="center" gap={1}>
                                            <Badge px={3} py={1} borderRadius="full" colorScheme="gray">
                                                {key}
                                            </Badge>
                                            <ArrowRight size="16px" color="gray.500" />
                                            <Badge px={3} py={1} borderRadius="full" colorScheme="blue">
                                                {project.suggestions[key]}
                                            </Badge>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Box>
                            
                            {suggestionDone && project?.suggestion_energy && project?.suggestion_time && project?.suggestion_memory && (
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
                                                            {project.suggestion_energy.total.toFixed(2)}
                                                        </StatNumber>
                                                        <StatHelpText color="green.600">
                                                            <StatArrow type="decrease" />
                                                            {((project.energy.total - project.suggestion_energy.total) / project.energy.total * 100).toFixed(2)}%
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
                                                            {project.suggestion_time.total.toFixed(2)}
                                                        </StatNumber>
                                                        <StatHelpText color="green.600">
                                                            <StatArrow type="decrease" />
                                                            {((project.time.total - project.suggestion_time.total) / project.time.total * 100).toFixed(2)}%
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
                                                            {project.suggestion_memory.total.toFixed(2)}
                                                        </StatNumber>
                                                        <StatHelpText color="green.600">
                                                            <StatArrow type="decrease" />
                                                            {((project.memory.total - project.suggestion_memory.total) / project.memory.total * 100).toFixed(2)}%
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
                                                        {project.carbon_footprint.toFixed(4)}
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
                                                        {project.suggestion_carbon_footprint.toFixed(4)}
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
                                
                                <Button 
                                    as="a" 
                                    href="/analysis.xlsx" 
                                    download 
                                    colorScheme="blue" 
                                    variant="outline" 
                                    leftIcon={<Download size="16px" />}
                                >
                                    Download Report Data
                                </Button>
                                
                                <Box mt={8} p={4} borderWidth="1px" borderColor="gray.200" borderRadius="lg">
                                    <Flex alignItems="center" justifyContent="center">
                                        <BarChart size="32px" color="gray.400" />
                                        <Text ml={3} color="gray.500">Power BI visualization will appear here after configuration</Text>
                                    </Flex>
                                </Box>
                            </Box>

                            {/* Power BI Embed */}
                            <Box bg="white" borderRadius="lg" boxShadow="md" p={6} textAlign="center">
                                <Heading as="h2" size="md" color="gray.800" mb={3}>Power BI Embed</Heading>
                                <iframe 
                                    title="TestData4BI" 
                                    width="100%" 
                                    height="600px" 
                                    src="https://app.powerbi.com/reportEmbed?reportId=b4170a61-6a51-41fc-949d-eeec23246a2f&autoAuth=true&ctid=6db5d98c-f3ca-4bde-a6b4-6013a4ebc94a" 
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </ProjectShell>
    );
};

export default AnalysisPage;

// GitHubIcon component
function GitHubIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
    );
}