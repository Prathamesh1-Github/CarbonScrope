import React from 'react';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Button,
  Flex,
  Link,
  Avatar,
  useColorModeValue,
  Container,
  Icon,
  Text,
  HStack
} from '@chakra-ui/react';
import { useAuth } from '@/lib/auth';
import AddProjectModal from './AddProjectModal';
import NextLink from 'next/link';
import { Github as GitHub, LogOut, ChevronRight } from 'lucide-react';

const DashboardShell = ({ children }) => {
  const { user, signout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const headerShadow = useColorModeValue('sm', 'none');

  return (
    <Box 
      backgroundColor="gray.50" 
      minH="100vh" 
      pb={8}
    >
      <Box 
        as="header" 
        backgroundColor={bgColor} 
        boxShadow={headerShadow} 
        borderBottom="1px" 
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="sticky"
        width="100%"
      >
        <Container maxW="1280px" py={4}>
          <Flex 
            alignItems="center" 
            justifyContent="space-between"
          >
            <Flex alignItems="center">
              <NextLink href="/dashboard" passHref>
                <Link 
                  mr={4} 
                  display="flex" 
                  alignItems="center"
                  fontWeight="bold"
                  fontSize="xl"
                  color="teal.600"
                  _hover={{ textDecoration: 'none', color: 'teal.500' }}
                  transition="color 0.2s"
                >
                  <Text 
                    bgGradient="linear(to-r, teal.500, teal.300)" 
                    bgClip="text"
                    fontWeight="extrabold"
                  >
                    CarbonScope
                  </Text>
                </Link>
              </NextLink>
            </Flex>
            
            <HStack spacing={4} alignItems="center">
              <Button 
                as="a" 
                href="/api/github/login" 
                colorScheme="teal"
                variant="outline"
                leftIcon={<Icon as={GitHub} />}
                size="sm"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'sm'
                }}
                transition="all 0.2s"
              >
                Connect GitHub
              </Button>
              
              {user && (
                <HStack spacing={3}>
                  <Button 
                    variant="ghost" 
                    colorScheme="gray" 
                    size="sm"
                    leftIcon={<Icon as={LogOut} size={16} />}
                    onClick={() => signout()}
                    _hover={{
                      bg: 'red.50',
                      color: 'red.600'
                    }}
                  >
                    Log Out
                  </Button>
                  
                  <Avatar 
                    size="sm" 
                    src={user?.photoUrl} 
                    name={user?.name || 'User'}
                    borderWidth="2px"
                    borderColor="teal.400"
                    showBorder
                  />
                </HStack>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
      
      <Container maxW="1280px" pt={8} px={4}>
        <Breadcrumb 
          separator={<Icon as={ChevronRight} color="gray.400" fontSize="sm" />}
          mb={4}
        >
          <BreadcrumbItem>
            <BreadcrumbLink 
              as={NextLink} 
              href="/dashboard"
              color="gray.600"
              _hover={{ color: 'teal.500', textDecoration: 'none' }}
            >
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Flex 
          justifyContent="space-between" 
          alignItems="center"
          mb={6}
        >
          <Heading 
            size="lg"
            bgGradient="linear(to-r, gray.800, gray.600)" 
            bgClip="text"
          >
            My Projects
          </Heading>
          
          <AddProjectModal>
            Add Project
          </AddProjectModal>
        </Flex>
        
        <Box
          borderRadius="lg"
          transition="all 0.2s"
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardShell;