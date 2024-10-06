namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class GroqService
{
    private $client;
    private $apiKey;

    public function __construct(HttpClientInterface $client, string $apiKey)
    {
        // Désactiver la vérification SSL lors de la création du client
        $this->client = $client->withOptions([
            'verify_peer' => false,  // Désactiver la vérification SSL
        ]);
        $this->apiKey = $apiKey;
    }

    public function getChatCompletion(string $message): string
    {
        $response = $this->client->request('POST', 'https://api.groq.com/openai/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'llama3-70b-8192',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $message,
                    ]
                ],
                'temperature' => 1,
                'max_tokens' => 1024,
                'top_p' => 1,
                'stream' => false,
                'stop' => null,
            ],
        ]);

        $content = $response->toArray();

        return $content['choices'][0]['message']['content'] ?? 'Error';
    }
}
