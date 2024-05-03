const user = 'Glaceon-471'; // GitHubユーザー名
const repo = 'PokemonTRPG'; // リポジトリ名
const token = '';

async function CreateIssue(title, body) {
    const data = {
        title: title,
        body: body
    };
    try {
        const response = await fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 201) console.log('Issue created successfully!');
        else console.error(`Error creating issue: ${response.status} - ${await response.text()}`);
    }
    catch (error) {
        console.error('Error creating issue:', error);
    }
}

// CreateIssue("Test issue", "これはテストで作成しているよ!");