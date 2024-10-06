<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Service\GroqService;

class ChatbotController extends AbstractController
{
    private $groqService;

    public function __construct(GroqService $groqService)
    {
        $this->groqService = $groqService;
    }

    #[Route('/', name: 'chat')]
    public function index(): Response
    {
        // Rendre la vue Twig à partir du chemin spécifié
        return $this->render('chatbot/chat.html.twig');
    }
#[Route('/chat', name: 'chat_message')]
public function chat(Request $request): Response
{
    $message = $request->query->get('message');

    if (empty($message)) {
        return $this->json(['response' => 'Aucun message fourni.'], 400);
    }

    // Appel au service Groq pour obtenir la réponse
    $response = $this->groqService->getChatCompletion($message);

    return $this->json(['response' => $response]);
}
