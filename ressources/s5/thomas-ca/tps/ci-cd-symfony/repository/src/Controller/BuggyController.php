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
            "key1" => "value1",
            "key2" => "value2",
        ];
    }
}
