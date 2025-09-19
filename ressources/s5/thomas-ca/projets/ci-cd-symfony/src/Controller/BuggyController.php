<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class BuggyController extends AbstractController
{
    /**
     * @return array<string, number>
     */
    private function getData(): array
    {
        return [
            'key1' => 1,
            'key2' => 2,
        ];
    }

    #[Route('/bug', name: 'buggy_route')]
    public function buggyAction(): Response
    {
        $data = $this->getData();

        return $this->render('welcome.html.twig', [
            'data' => $data['key1'],
        ]);
    }
}
