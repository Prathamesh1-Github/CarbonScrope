// pages/github-repos.js

import React, { useEffect, useState } from 'react';
import { Search, Star, GitFork, ExternalLink } from 'lucide-react';
import {
  Box,
  Spinner,
  Input,
  Icon,
  InputGroup,
  InputLeftElement,
  Text,
  SimpleGrid,
  Heading,
  Button,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import AddProjectModalGithub from '@/components/AddProjectModalGithub';

function SkeletonCard() {
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bg} p={4} rounded="lg" shadow="md" borderWidth="1px" borderColor={border}>
      <Box h="20px" bg="gray.200" mb={3} rounded="md" w="75%" />
      <Box h="16px" bg="gray.200" mb={2} rounded="md" />
      <Box h="16px" bg="gray.200" mb={4} rounded="md" w="66%" />
      <Flex gap={4}>
        <Box h="16px" bg="gray.200" w="48px" rounded="md" />
        <Box h="16px" bg="gray.200" w="48px" rounded="md" />
      </Flex>
    </Box>
  );
}

function RepositoryCard({ repo, onClick }) {
  const bg = useColorModeValue('white', 'gray.800');
  const text = useColorModeValue('gray.900', 'white');
  const subtext = useColorModeValue('gray.600', 'gray.400');
  const border = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      p={4}
      rounded="lg"
      shadow="md"
      borderWidth="1px"
      borderColor={border}
      cursor="pointer"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.3s"
      onClick={onClick}
    >
      <Flex justify="space-between" align="start">
        <Heading size="sm" color={text} noOfLines={1}>
          {repo.name}
        </Heading>
        <Box
          as="a"
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          color={subtext}
          _hover={{ color: 'blue.500' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Icon as={ExternalLink} boxSize={4} />
        </Box>
      </Flex>
      <Text fontSize="sm" color={subtext} mt={1} noOfLines={2}>
        {repo.description || 'No description available'}
      </Text>

      <Flex mt={4} gap={4} align="center" wrap="wrap" fontSize="xs" color={subtext}>
        {repo.language && (
          <Flex align="center" gap={1}>
            <Box w={3} h={3} rounded="full" bg="blue.500" />
            <Text>{repo.language}</Text>
          </Flex>
        )}
        <Flex align="center" gap={1}>
          <Icon as={Star} boxSize={3.5} />
          <Text>{repo.stargazers_count}</Text>
        </Flex>
        <Flex align="center" gap={1}>
          <Icon as={GitFork} boxSize={3.5} />
          <Text>{repo.forks_count}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}

function GitHubRepos() {
  const router = useRouter();
  const { token } = router.query;
  const auth = useAuth();

  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetch('https://api.github.com/user/repos?visibility=public', {
        headers: {
          Authorization: `token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setRepos(data);
          setFilteredRepos(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [token]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRepos(repos);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = repos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          (repo.description && repo.description.toLowerCase().includes(query))
      );
      setFilteredRepos(filtered);
    }
  }, [searchQuery, repos]);

  if (!token || !auth.user) return <Spinner size="xl" />;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={10} px={{ base: 4, md: 10 }}>
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        p={6}
        borderRadius="lg"
        shadow="md"
        mb={10}
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Heading size="lg" mb={2}>
          Select a GitHub Repository
        </Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} mb={4}>
          Choose a public repository to add to your projects. You can search by name or description.
        </Text>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg={useColorModeValue('white', 'gray.700')}
            color={useColorModeValue('gray.900', 'white')}
            _placeholder={{ color: 'gray.400' }}
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            focusBorderColor="blue.500"
          />
        </InputGroup>
      </Box>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </SimpleGrid>
      ) : filteredRepos.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
          {filteredRepos.map((repo) => (
            <RepositoryCard key={repo.id} repo={repo} onClick={() => setSelectedRepo(repo)} />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={10}>
          <Text mb={2} color={useColorModeValue('gray.600', 'gray.400')}>
            No repositories found matching your search.
          </Text>
          <Button variant="link" colorScheme="blue" onClick={() => setSearchQuery('')}>
            Clear search
          </Button>
        </Box>
      )}

      {selectedRepo && (
        <AddProjectModalGithub
          isOpen={true}
          onClose={() => setSelectedRepo(null)}
          defaultValues={{
            name: selectedRepo.name,
            github: selectedRepo.html_url,
            desc: selectedRepo.description || '',
          }}
        />
      )}
    </Box>
  );
}

export default GitHubRepos;
