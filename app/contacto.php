<?php

$data = file_get_contents("php://input");

$decoded = json_decode($data);

sendMail($decoded->to, $decoded->subject, $decoded->message, $decoded->email);

/*
 * Par�metros
 * to:
 *  Destinatario/s del correo.
 *  El formato de este string debe cumplir con la � RFC 2822. Algunos ejemplos son:
 *
 * subject:
 *  T�tulo del correo electr�nico a enviar.
 *
 * message:
 *  Mensaje a enviar.
 *
 * email
 *  Quien envia el mail
 * */
function sendMail($to, $subject, $message, $email)
{
    $headers = "From: " . $email . "\r\n" .
        "CC: mmaneff@gmail.com";

    $success = mail($to, $subject, $message, $headers);

    echo json_encode( $success );
}