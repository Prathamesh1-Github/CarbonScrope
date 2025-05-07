import React from "react";
import { Table, Tr, Td, Th } from "./Table";
import { 
  Box, 
  Code, 
  Link, 
  Badge, 
  Flex, 
  Text, 
  Tooltip,
  HStack,
  Icon
} from "@chakra-ui/react";
import NextLink from 'next/link';
import { ExternalLink, Github as GitHub, Code as CodeIcon } from 'lucide-react';

const ProjectTable = ({ projects }) => {
  return (
    <Box
      width="100%"
      backgroundColor="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
    >
      <Table>
        <thead>
          <Tr isHeader>
            <Th>Name</Th>
            <Th>Github Link</Th>
            <Th>Languages Used</Th>
            <Th>Domain</Th>
            <Th textAlign="right">Actions</Th>
          </Tr>
        </thead>
        <tbody>
          {projects.map(project => {
            const languages = project.languages_used;
            const topLanguages = Object.entries(languages)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3);
              
            return (
              <Tr key={project.github}>
                <Td fontWeight="medium">
                  <Text fontSize="md" fontWeight="semibold">
                    {project.name}
                  </Text>
                </Td>
                <Td>
                  <Link 
                    href={project.github} 
                    isExternal 
                    color="teal.500"
                    display="flex"
                    alignItems="center"
                    _hover={{ textDecoration: 'none', color: 'teal.600' }}
                  >
                    <Icon as={GitHub} mr={2} boxSize={4} />
                    <Text isTruncated maxWidth="200px">
                      {project.github.replace('https://github.com/', '')}
                    </Text>
                    <Icon as={ExternalLink} ml={1} boxSize={4} />
                  </Link>
                </Td>
                <Td>
                  <HStack spacing={2} wrap="wrap">
                    {topLanguages.map(([lang, percentage]) => (
                      <Tooltip key={lang} label={`${lang}: ${percentage}%`}>
                        <Badge 
                          colorScheme={getLanguageColor(lang)} 
                          variant="subtle"
                          py={1}
                          px={2}
                          borderRadius="full"
                        >
                          {lang}
                        </Badge>
                      </Tooltip>
                    ))}
                    {Object.keys(languages).length > 3 && (
                      <Tooltip 
                        label={Object.entries(languages)
                          .sort(([, a], [, b]) => b - a)
                          .slice(3)
                          .map(([lang, percentage]) => `${lang}: ${percentage}%`)
                          .join(', ')}
                      >
                        <Badge colorScheme="gray" variant="outline">
                          +{Object.keys(languages).length - 3} more
                        </Badge>
                      </Tooltip>
                    )}
                  </HStack>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={getDomainColor(project.domain)}
                    py={1}
                    px={3}
                    borderRadius="full"
                  >
                    {project.domain}
                  </Badge>
                </Td>
                <Td textAlign="right">
                  <NextLink href="/project/[projectId]" as={`/project/${project.id}`} passHref>
                    <Link
                      color="teal.500"
                      fontWeight="medium"
                      display="inline-flex"
                      alignItems="center"
                      py={2}
                      px={4}
                      borderRadius="md"
                      _hover={{ 
                        bg: "teal.50", 
                        color: "teal.700",
                        textDecoration: "none" 
                      }}
                      transition="all 0.2s"
                    >
                      <Text mr={2}>View Analysis</Text>
                      <Icon as={CodeIcon} boxSize={4} />
                    </Link>
                  </NextLink>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </Box>
  );
};

// Helper functions for consistent color coding
function getLanguageColor(language) {
  const colorMap = {
    javascript: "yellow",
    typescript: "blue",
    python: "green",
    java: "orange",
    ruby: "red",
    go: "cyan",
    rust: "orange",
    php: "purple",
    html: "orange",
    css: "blue",
    c: "gray",
    "c++": "purple",
    "c#": "purple",
  };
  
  return colorMap[language.toLowerCase()] || "gray";
}

function getDomainColor(domain) {
  const colorMap = {
    "AI/ML": "purple",
    "Blockchain": "orange",
    "Web Development": "blue",
    "App Development": "green",
    "Command Line App": "gray"
  };
  
  return colorMap[domain?.trim()] || "teal";
}

export default ProjectTable;