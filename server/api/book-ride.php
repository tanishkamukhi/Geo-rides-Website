<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
$host = 'localhost';
$db = 'geo_rides';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get authorization token
    $headers = apache_request_headers();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if (!$token) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }

    // Verify token and get user ID
    $stmt = $pdo->prepare('SELECT id FROM users WHERE api_token = ?');
    $stmt->execute([$token]);
    $userRecord = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userRecord) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid token']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (!isset($data['pickupLocation']) || !isset($data['dropLocation']) || !isset($data['vehicleType'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        exit;
    }

    // Generate booking ID
    $bookingId = 'GEO' . strtoupper(substr(uniqid(), -8));

    // Calculate estimated fare (dummy calculation)
    $baseFare = 50;
    $kmRate = 15;
    $estimatedKm = rand(2, 10);
    $estimatedFare = $baseFare + ($estimatedKm * $kmRate);

    // Insert booking into database
    try {
        $stmt = $pdo->prepare('INSERT INTO bookings 
            (booking_id, user_id, pickup_location, drop_location, vehicle_type, 
             estimated_fare, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())');
        
        $stmt->execute([
            $bookingId,
            $userRecord['id'],
            htmlspecialchars($data['pickupLocation']),
            htmlspecialchars($data['dropLocation']),
            htmlspecialchars($data['vehicleType']),
            $estimatedFare,
            'confirmed'
        ]);

        http_response_code(201);
        echo json_encode([
            'message' => 'Ride booked successfully',
            'bookingId' => $bookingId,
            'estimatedFare' => '₹' . $estimatedFare,
            'estimatedTime' => rand(3, 8) . ' mins'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Booking failed']);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
