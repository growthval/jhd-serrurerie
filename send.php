<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

// Sanitize
$name    = trim(htmlspecialchars($_POST['name']    ?? '', ENT_QUOTES, 'UTF-8'));
$email   = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$phone   = trim(htmlspecialchars($_POST['phone']   ?? '', ENT_QUOTES, 'UTF-8'));
$city    = trim(htmlspecialchars($_POST['city']    ?? '', ENT_QUOTES, 'UTF-8'));
$message = trim(htmlspecialchars($_POST['message'] ?? '', ENT_QUOTES, 'UTF-8'));

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Veuillez remplir tous les champs obligatoires.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Adresse email invalide.']);
    exit;
}

// Prevent header injection
if (preg_match('/[\r\n]/', $name . $email . $phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Données invalides.']);
    exit;
}

$to      = 'direction@jocehome.fr, lejaultvalentinpro@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode('Nouvelle demande — JHD Serrurerie') . '?=';

$cityLabels = [
    'la-rochelle' => 'La Rochelle',
    'ile-de-re'   => 'Île de Ré',
    'niort'       => 'Niort',
    'poitiers'    => 'Poitiers',
    'autre'       => 'Autre',
];
$cityLabel = $cityLabels[$city] ?? ($city ?: 'Non précisée');

$body  = "Nouvelle demande de contact — jhd-serrurerie.fr\n";
$body .= str_repeat('─', 45) . "\n\n";
$body .= "Nom       : {$name}\n";
$body .= "Email     : {$email}\n";
$body .= "Téléphone : {$phone}\n";
$body .= "Ville     : {$cityLabel}\n\n";
$body .= "Message :\n{$message}\n";

$headers  = "From: JHD Serrurerie <noreply@jhd-serrurerie.fr>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'envoi. Appelez-nous directement au 06 71 69 75 78.']);
}
