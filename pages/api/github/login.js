export default async function handler(req, res) {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        scope: 'repo', // needed to list repos
        allow_signup: 'true'
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
