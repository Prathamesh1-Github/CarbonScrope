import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Configuration, OpenAIApi } from 'openai';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Button,
  Input,
  Textarea,
  useToast,
  VStack,
  HStack,
  Icon,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  Box,
  Text
} from '@chakra-ui/react';
import { createProject, updateProject } from '@/lib/db';
import { useAuth } from '@/lib/auth';
import { mutate } from 'swr';
import { Github as GitHub, FileText, Type } from 'lucide-react';
import axios from 'axios';

const AddProjectModalGithub = ({ isOpen, onClose, defaultValues = {} }) => {
  const initialRef = useRef();
  const toast = useToast();
  const auth = useAuth();

  const { handleSubmit, register, formState: { isSubmitting, isDirty, isValid } } = useForm({
    defaultValues: {
      name: defaultValues.name || '',
      desc: defaultValues.desc || '',
      github: defaultValues.github || ''
    }
  });

  const onCreateProject = async ({ name, desc, github }) => {
    try {
      const repo = github.split('github.com/')[1].split('/');
      const res = await fetch(`https://api.github.com/repos/${repo[0]}/${repo[1]}/languages`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch repository data');
      }
      
      const data = await res.json();

      let total = 0;
      for (let key in data) {
        total += data[key];
      }

      const languages = {};
      Object.keys(data).forEach((key) => {
        languages[key.toLowerCase()] = ((data[key] / total) * 100).toFixed(2);
      });

      const newProject = {
        authorId: auth.user.uid,
        createdAt: new Date().toISOString(),
        name,
        desc,
        github,
        languages_used: languages,
        language_lines: data,
      };

      const { id } = await createProject(newProject);
      getnlpDomain(newProject, desc, id);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || "We couldn't add your project. Please check the GitHub URL and try again.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getOpenAiData = async (newProject, desc, id) => {
    try {
      const configuration = new Configuration({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createCompletion({
        model: 'gpt-3.5-turbo-instruct',
        prompt: `AI/ML, Blockchain, Web Development, App Development, Command Line App. From these given options choose what suits best for the below description of project. I want the answer in only one word and it should be from given options only. Options are: AI/ML, Blockchain, Web Development, App Development, Command Line App : ${desc}`,
        max_tokens: 256
      });

      const domain = response.data.choices[0].text.trim();

      await updateProject(id, { domain });

      mutate(
        '/api/projects',
        async (data) => {
          const existingProjects = data?.projects || [];
          return {
            projects: [{ id, ...newProject, domain }, ...existingProjects]
          };
        },
        false
      );

      onClose();
      toast({
        title: 'Success!',
        description: "We've added your project.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } catch (error) {
      toast({
        title: 'Error classifying project',
        description: "We added your project but couldn't determine its domain.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      
      // Still close modal and mutate, just without domain
      onClose();
      mutate(
        '/api/projects',
        async (data) => {
          const existingProjects = data?.projects || [];
          return {
            projects: [{ id, ...newProject, domain: "Unclassified" }, ...existingProjects]
          };
        },
        false
      );
    }
  };

  async function getnlpDomain(newProject, desc, id) {
    try {
      // Send description to the local NLP server
      const response = await axios.post('http://localhost:5001/classify', {
        description: desc,
      });

      // Extract domain from the response
      const domain = response.data.domain;

      console.log(domain)

      // Update the project with the domain
      await updateProject(id, { domain });

      // Update the global project state
      mutate(
        '/api/projects',
        async (data) => ({
          projects: [{ id, ...newProject, domain }, ...(data?.projects || [])],
        }),
        false
      );

      // Show success toast
      toast({
        title: 'Success!',
        description: "We've added your project.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      // Show error toast if classification fails
      toast({
        title: 'Error classifying project',
        description: "We added your project but couldn't determine its domain.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });

      // Close modal and update project with "Unclassified" domain
      onClose();
      mutate(
        '/api/projects',
        async (data) => ({
          projects: [{ id, ...newProject, domain: "Unclassified" }, ...(data?.projects || [])],
        }),
        false
      );
    }
  }

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay 
        bg="blackAlpha.300" 
        backdropFilter="blur(5px)"
      />
      <ModalContent 
        as="form" 
        onSubmit={handleSubmit(onCreateProject)}
        borderRadius="xl"
        boxShadow="xl"
      >
        <ModalHeader 
          fontWeight="bold" 
          borderBottomWidth="1px"
          borderColor="gray.100"
          pb={4}
        >
          <HStack spacing={2}>
            <Icon as={GitHub} />
            <Text>Add New Project</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={5} align="start">
            <FormControl>
              <FormLabel 
                fontWeight="medium" 
                color="gray.700"
                display="flex"
                alignItems="center"
              >
                <Icon as={Type} size={16} mr={2} />
                Project Name
              </FormLabel>
              <Input
                ref={initialRef}
                placeholder="Project Name"
                {...register('name', { required: true })}
                focusBorderColor="teal.400"
                borderRadius="md"
                _hover={{ borderColor: 'gray.300' }}
                transition="all 0.2s"
              />
              <FormHelperText>Give your project a descriptive name</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel 
                fontWeight="medium" 
                color="gray.700"
                display="flex"
                alignItems="center"
              >
                <Icon as={FileText} size={16} mr={2} />
                Description
              </FormLabel>
              <Textarea
                placeholder="Explain what your project does in a few sentences"
                {...register('desc', { required: true })}
                focusBorderColor="teal.400"
                borderRadius="md"
                _hover={{ borderColor: 'gray.300' }}
                transition="all 0.2s"
                minH="100px"
                resize="vertical"
              />
              <FormHelperText>This helps us classify your project accurately</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel 
                fontWeight="medium" 
                color="gray.700"
                display="flex"
                alignItems="center"
              >
                <Icon as={GitHub} size={16} mr={2} />
                GitHub Link
              </FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={GitHub} color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="https://github.com/username/repo"
                  {...register('github', { 
                    required: true,
                    pattern: {
                      value: /https:\/\/github\.com\/[\w-]+\/[\w-]+/,
                      message: "Please enter a valid GitHub repository URL"
                    }
                  })}
                  focusBorderColor="teal.400"
                  borderRadius="md"
                  pl={10}
                  _hover={{ borderColor: 'gray.300' }}
                  transition="all 0.2s"
                />
              </InputGroup>
              <FormHelperText>The repository to analyze</FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter 
          borderTopWidth="1px"
          borderColor="gray.100"
          pt={4}
        >
          <Button 
            onClick={onClose} 
            mr={3} 
            fontWeight="medium"
            variant="ghost"
            _hover={{ bg: 'gray.100' }}
            size="md"
          >
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            fontWeight="medium"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Submitting"
            size="md"
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: 'sm'
            }}
            transition="all 0.2s"
          >
            Add Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProjectModalGithub;