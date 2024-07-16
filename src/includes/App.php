<?php
namespace Site;

class App {
    private $data;

    public function __construct() {
        $this->data = [
            'site' => [
                'title' => 'App Title',
                'url' => (empty($_SERVER['HTTPS']) ? 'http' : 'https') . "://$_SERVER[HTTP_HOST]"
            ]
        ];
    }

    public function run() {
        $loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../views');
        $twig = new \Twig\Environment($loader);

        echo $twig->render('index.twig', $this->data);
    }
}