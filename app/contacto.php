<?php
require 'PHPMailerAutoload.php';
$data = file_get_contents("php://input");

$decoded = json_decode($data);

sendMail($decoded->to, $decoded->subject, $decoded->message, $decoded->email);

/*
 * Parámetros
 * to:
 *  Destinatario/s del correo.
 *  El formato de este string debe cumplir con la » RFC 2822. Algunos ejemplos son:
 *
 * subject:
 *  Título del correo electrónico a enviar.
 *
 * message:
 *  Mensaje a enviar.
 *
 * email
 *  Quien envia el mail
 * */
function sendMail($to, $subject, $message, $email)
{
    $mail = new PHPMailer;
    $mail->isSMTP();                                    // Set mailer to use SMTP
    $mail->Host = 'gator4184.hostgator.com';            // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                             // Enable SMTP authentication
    $mail->Username = 'ventas@ac-desarrollos.com';      // SMTP username
    $mail->Password = 'ventas';                         // SMTP password
    $mail->SMTPSecure = 'ssl';                          // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 465;

    $mail->From = $email;
    //$mail->FromName = $name;
    $mail->addAddress($to);                             // Add a recipient
    //$mail->addReplyTo('info@example.com', 'Information');
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');

    //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
    //$mail->isHTML(true);                                  // Set email format to HTML

    $mail->Subject = $subject;
    $mail->Body    = $message;
    $mail->AltBody = $message;

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        echo 'Message has been sent';
    }
}