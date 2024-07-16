<?php
namespace Site;

require_once(__DIR__ . '/vendor/autoload.php');
require_once(__DIR__ . '/includes/autoload.php');

$app = new App();
$app->run();