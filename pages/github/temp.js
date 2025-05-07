// pages/github-repos.js

import { useEffect, useState } from 'react';
import { Box, Button, Heading, List, ListItem, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import AddProjectModalGithub from '@/components/AddProjectModalGithub';

export default function GitHubRepos() {
    const router = useRouter();
    const { token } = router.query;
    const [repos, setRepos] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const auth = useAuth();

    useEffect(() => {
        if (token) {
            fetch('https://api.github.com/user/repos?visibility=public', {
                headers: {
                    Authorization: `token ${token}`,
                },
            })
                .then((res) => res.json())
                .then(setRepos)
                .catch(console.error);
        }
    }, [token]);

    if (!token || !auth.user) return <Spinner />;

    return (
        <Box p={6}>
            <Heading size="md" mb={4}>Select a Public Repo to Add</Heading>
            <List spacing={3}>
                {repos.map((repo) => (
                    <ListItem key={repo.id}>
                        <Button variant="outline" onClick={() => setSelectedRepo(repo)}>
                            {repo.full_name}
                        </Button>
                    </ListItem>
                ))}
            </List>

            {selectedRepo && (
                <AddProjectModalGithub
                    isOpen={true}
                    onClose={() => setSelectedRepo(null)}
                    defaultValues={{
                        name: selectedRepo.name,
                        github: selectedRepo.html_url,
                        desc: selectedRepo.description || ''
                    }}
                />
            )}
        </Box>
    );
}
