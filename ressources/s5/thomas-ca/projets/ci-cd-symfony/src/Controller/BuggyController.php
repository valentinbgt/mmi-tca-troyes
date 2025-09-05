<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

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
}
