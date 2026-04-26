<?php
require_once 'db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $name = trim($_GET['name'] ?? '');

    $id = intval($_GET['id'] ?? 0);

    if ($name !== '' && $id > 0) {
        // Login: name + ID must match
        $stmt = $pdo->prepare(
            "SELECT * FROM menu_preferences WHERE id = ? AND user_name = ? LIMIT 1"
        );
        $stmt->execute([$id, $name]);
    } elseif ($name !== '') {
        // Fallback: name only (internal use by ViewMenu/Dashboard)
        $stmt = $pdo->prepare(
            "SELECT * FROM menu_preferences WHERE user_name = ? ORDER BY created_at DESC LIMIT 1"
        );
        $stmt->execute([$name]);
    } else {
        $stmt = $pdo->query(
            "SELECT * FROM menu_preferences ORDER BY created_at DESC LIMIT 1"
        );
    }
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode([
            'success' => true,
            'prefs'   => [
                'id'           => $row['id'],
                'user_name'    => $row['user_name'],
                'budget'       => $row['budget'],
                'load_level'   => $row['load_level'],
                'prep_time'    => $row['prep_time'],
                'dietary_pref' => $row['dietary_pref'] ? explode(',', $row['dietary_pref']) : [],
                'events'       => $row['events']       ? explode(',', $row['events'])       : []
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'prefs' => null]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
