<?php
ob_start();
session_start();

$url = $_SERVER['REQUEST_URI'];

$current_url = explode('?', $url);
$url = $current_url[0];

// Handle POST requests to /leads/
if ($url === '/leads/' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require __DIR__ . '/views/leads.php';
    die();
}

if (strpos($url, '/blogs/') === 0 || $url === '/blogs') {
    return; // Let the server handle /blogs/ naturally (WordPress will take over)
}
$dir = __DIR__ . '/views';
$files = array_slice(scandir($dir), 2);

$fileWithOutExt = array();
$fileWithOutExtNoSlash = array(); // Store versions without trailing slash

foreach ($files as $file) {
    // Create URL with trailing slash (original format)
    $with_slash = '/' . pathinfo($file, PATHINFO_FILENAME) . '/';
    array_push($fileWithOutExt, $with_slash);

    // Create URL without trailing slash (new format)
    $without_slash = '/' . pathinfo($file, PATHINFO_FILENAME);
    array_push($fileWithOutExtNoSlash, $without_slash);
}

if ($url == "/") {
    require $dir . '/publishing-service.php';
    die();
}

// Check if URL matches with or without trailing slash
if (in_array($url, $fileWithOutExt) || in_array($url, $fileWithOutExtNoSlash)) {
    // Extract the actual file name regardless of trailing slash
    $fileName = ltrim(rtrim($url, '/'), '/');
    if (!empty($fileName)) {
        require $dir . '/' . $fileName . '.php';
    } else {
        require $dir . '/publishing-service.php'; // Redirect to home if somehow filename is empty
    }
} else {
    // Redirect to home page with proper HTTP redirect to change URL in browser
    header('Location: ./');
    exit();
}
?>