<?php
// session_start();

// Blocked IP addresses
$blockedIPs = [
    '62.113.116.213',
    '185.39.19.21',
    '80.94.95.173',
    '80.94.95.202',
    // '154.57.210.213',
    // '127.0.0.1',
    '185.39.19.47'
];

// Function to get the real client IP address
function getRealIpAddress()
{
    // Check for shared internet/ISP IP
    if (!empty($_SERVER['HTTP_CLIENT_IP']) && filter_var($_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP)) {
        return $_SERVER['HTTP_CLIENT_IP'];
    }

    // Check for IPs passing through proxies
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // Can be a comma-separated list of IPs
        $ipList = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        foreach ($ipList as $ip) {
            $ip = trim($ip);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }

    // Check for IP from proxy
    if (!empty($_SERVER['HTTP_X_FORWARDED']) && filter_var($_SERVER['HTTP_X_FORWARDED'], FILTER_VALIDATE_IP)) {
        return $_SERVER['HTTP_X_FORWARDED'];
    }

    if (!empty($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']) && filter_var($_SERVER['HTTP_X_CLUSTER_CLIENT_IP'], FILTER_VALIDATE_IP)) {
        return $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
    }

    if (!empty($_SERVER['HTTP_FORWARDED_FOR']) && filter_var($_SERVER['HTTP_FORWARDED_FOR'], FILTER_VALIDATE_IP)) {
        return $_SERVER['HTTP_FORWARDED_FOR'];
    }

    if (!empty($_SERVER['HTTP_FORWARDED']) && filter_var($_SERVER['HTTP_FORWARDED'], FILTER_VALIDATE_IP)) {
        return $_SERVER['HTTP_FORWARDED'];
    }

    // Return REMOTE_ADDR if no proxy IP found
    return $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';
}

// Function to generate a browser fingerprint
function getBrowserFingerprint()
{
    $fingerprint = '';

    // User agent
    if (isset($_SERVER['HTTP_USER_AGENT'])) {
        $fingerprint .= $_SERVER['HTTP_USER_AGENT'];
    }

    // Accept headers
    if (isset($_SERVER['HTTP_ACCEPT'])) {
        $fingerprint .= $_SERVER['HTTP_ACCEPT'];
    }

    // Accept language
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $fingerprint .= $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    }

    // Accept encoding
    if (isset($_SERVER['HTTP_ACCEPT_ENCODING'])) {
        $fingerprint .= $_SERVER['HTTP_ACCEPT_ENCODING'];
    }

    // Screen dimensions (passed via form)
    if (isset($_REQUEST['screen_width']) && isset($_REQUEST['screen_height'])) {
        $fingerprint .= $_REQUEST['screen_width'] . 'x' . $_REQUEST['screen_height'];
    }

    // Timezone (passed via form)
    if (isset($_REQUEST['timezone_offset'])) {
        $fingerprint .= $_REQUEST['timezone_offset'];
    }

    // Canvas fingerprinting (passed via form)
    if (isset($_REQUEST['canvas_fp'])) {
        $fingerprint .= $_REQUEST['canvas_fp'];
    }

    // WebGL fingerprinting (passed via form)
    if (isset($_REQUEST['webgl_fp'])) {
        $fingerprint .= $_REQUEST['webgl_fp'];
    }

    // Plugins (passed via form)
    if (isset($_REQUEST['plugins'])) {
        $fingerprint .= $_REQUEST['plugins'];
    }

    // Fonts (passed via form)
    if (isset($_REQUEST['fonts'])) {
        $fingerprint .= $_REQUEST['fonts'];
    }

    return md5($fingerprint);
}

/**
 * Allow POST requests only
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: /");
    exit;
}
// var_dump($_POST); exit;

/**
 * Collect form fields
 */
$firstName = trim($_POST['first_name'] ?? '');
$lastName = trim($_POST['last_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$brief = trim($_POST['brief'] ?? '');

/**
 * Basic required validation
 */
if ($firstName === '' || $email === '' || $phone === '') {
    header("Location: /errors/");
    exit;
}

/**
 * Get real client IP and check if blocked
 */
$clientIp = getRealIpAddress();
// Check if IP is blocked
//sam
// if (in_array($clientIp, $blockedIPs)) {
//     exit(header("location:/error-page/?msg=Access denied."));
// }

/**
 * Get browser fingerprint and validate submission frequency
 */
$browserFingerprint = getBrowserFingerprint();
$uploadsDir = __DIR__ . '/../uploads/logs';
$logFile = $uploadsDir . '/submission_log.json';

// Create logs directory if it doesn't exist
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0777, true);
}

$maxSubmissions = 3; // Maximum allowed submissions
$timeWindow = 86400; // 24 hours in seconds

// Load existing log data
$logData = [];
if (file_exists($logFile) && is_readable($logFile)) {
    $content = file_get_contents($logFile);
    if (!empty($content)) {
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            $logData = $decoded;
        }
    }
}

// Cleanup old entries
$logData = array_values(array_filter($logData, function ($entry) use ($timeWindow) {
    if (!is_array($entry) || !isset($entry['timestamp'])) {
        return false;
    }
    return (time() - $entry['timestamp']) < $timeWindow;
}));

// Count submissions from the same IP
$submissionCountByIP = 0;
foreach ($logData as $entry) {
    if (is_array($entry) && isset($entry['ip']) && $entry['ip'] === $clientIp) {
        $submissionCountByIP++;
    }
}

// Count submissions from the same browser fingerprint
$submissionCountByFingerprint = 0;
foreach ($logData as $entry) {
    if (is_array($entry) && isset($entry['fingerprint']) && $entry['fingerprint'] === $browserFingerprint) {
        $submissionCountByFingerprint++;
    }
}

// Block if either limit is exceeded
//sam
// if ($submissionCountByIP >= $maxSubmissions || $submissionCountByFingerprint >= $maxSubmissions) {
//     exit(header("location:/error-page/?msg=Too many submissions. Try again later."));
// }

// Add new submission to log
$logData[] = [
    'ip' => $clientIp,
    'fingerprint' => $browserFingerprint,
    'timestamp' => time()
];

// Write log file
if (is_writable($uploadsDir) || @chmod($uploadsDir, 0777)) {
    $logContent = json_encode($logData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    @file_put_contents($logFile, $logContent);
}

/**
 * Concatenate first + last name
 */
$name = trim($firstName . ' ' . $lastName);

/**
 * Route handling
 */
$route = $_REQUEST['route'];
$brief;

/**
 * Prepare API payload
 * ONLY required fields
 */
$data = array(
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'brief' => $brief,
    'domain' => 'www.kdpPress.com',
    'brand' => 'www.kdpPress.com',
    'ip_address' => $clientIp,
    'route' => $route,
);

/**
 * Block test number
 */
if ($phone === '5556660606' || $phone === '555-666-0606') {
    header("Location: /");
    exit;
}

// Handle file upload
$manuscript = $_FILES['manuscript'] ?? [];
$uploadDir = __DIR__ . "/../uploads/"; // Directory to save the uploaded files

if (!empty($manuscript) && isset($manuscript['name']) && $manuscript['name'] !== '') {
    $uploadFilePath = $uploadDir . basename($manuscript['name']);

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Create the uploads directory if it doesn't exist
    }

    if (move_uploaded_file($manuscript['tmp_name'], $uploadFilePath)) {
        $domain = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        $fileUrl = $domain . "/uploads/" . basename($manuscript['name']); // Construct file URL
        $data['manuscript_url'] = $fileUrl; // Add to payload
        $brief .= " | Manuscript: " . $fileUrl;
    } else {
        $fileUrl = null; // Handle failure
    }
}

/**
 * Encode JSON
 */
$payload = json_encode($data);

/**
 * Initialize cURL
 */
$curl = curl_init();

curl_setopt_array($curl, array(
    // 🔁 Switch to live API when ready
    CURLOPT_URL => "https://savtrack.savtechglobal.com/api/customer",
    // CURLOPT_URL => "https://webhook.site/727dd895-a7cb-404a-bc2f-aec32cafb114",

    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 500,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json',
    ),
));

/**
 * Execute API request
 */
$response = curl_exec($curl);
$error = curl_error($curl);
curl_close($curl);

/**
 * If API fails → back to form
 */
if ($error || !$response) {
    header("Location: /errors/");
    exit;
}

/**
 * Decode API response
 */
$decodeResponse = json_decode($response, true);

/**
 * Expected success message (EXACT)
 */
$apiSuccessMsg = "Thank you for your response we will contact you as soon as possible.";

/**
 * Safely extract API message
 */
$msg = $decodeResponse[1] ?? '';

/**
 * Redirect based on API response
 */
// if ($msg === $apiSuccessMsg) {

//     // Optional session flag
//     $_SESSION['thanks'] = true;

//     header("Location: /thank-you/");
//     exit;

// } else {

//     header("Location: /errors/");
//     exit;
// }
if ($response) {

    header("Location: /thank-you/");
    exit;

} else {

    header("Location: /errors/");
    exit;
}
