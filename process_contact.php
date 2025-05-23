<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars($_POST["name"]);
    $email = htmlspecialchars($_POST["email"]);
    $subject = htmlspecialchars($_POST["subject"]);
    $message = htmlspecialchars($_POST["message"]);
    
    // Validate inputs
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If there are errors, redirect back with error messages
    if (!empty($errors)) {
        $error_string = implode(", ", $errors);
        header("Location: contact.php?error=" . urlencode($error_string));
        exit();
    }
    
    // For testing: Save to file instead of sending email
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "=== New Contact Form Submission ===\n";
    $log_entry .= "Date: $timestamp\n";
    $log_entry .= "Name: $name\n";
    $log_entry .= "Email: $email\n";
    $log_entry .= "Subject: $subject\n";
    $log_entry .= "Message:\n$message\n";
    $log_entry .= str_repeat("-", 50) . "\n\n";
    
    // Save to messages.txt file
    $file_saved = file_put_contents('contact_messages.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    if ($file_saved !== false) {
        // Also try to send email (might work on some XAMPP setups)
        $to = "nafiulaziz.na@gmail.com";
        $email_subject = "Portfolio Contact: $subject";
        $email_body = "You have received a new message from your portfolio website.\n\n";
        $email_body .= "Name: $name\n";
        $email_body .= "Email: $email\n";
        $email_body .= "Subject: $subject\n";
        $email_body .= "Message:\n$message\n";
        
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        
        // Try to send email (will likely fail on localhost)
        $email_sent = mail($to, $email_subject, $email_body, $headers);
        
        if ($email_sent) {
            header("Location: contact.php?success=Email sent successfully!");
        } else {
            header("Location: contact.php?success=Message saved locally. Email sending not configured on localhost.");
        }
        exit();
    } else {
        header("Location: contact.php?error=" . urlencode("Failed to save message. Please check file permissions."));
        exit();
    }
    
} else {
    header("Location: contact.php");
    exit();
}
?>