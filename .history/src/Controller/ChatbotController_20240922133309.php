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
        // Récupère le message de l'utilisateur via la requête
        $message = $request->query->get('message');

        // Vérifie si un message a été fourni
        if (empty($message)) {
            return $this->json(['response' => 'Please provide a message.']);
        }

        // Appelle le service Groq pour obtenir la réponse du chatbot
        $response = $this->groqService->getChatCompletion($message);

        // Retourne la réponse du chatbot sous forme de JSON
        return $this->json(['response' => $response]);
    }
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
