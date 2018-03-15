<?php
ini_set('display_errors', 1);
error_reporting(~0);

$url = $_POST["url"];
//@ supresses the warnings
$content = @file_get_contents($url);

if (!$content) {
    http_response_code(404);
    die("could not find wiki page");
}

exit ($content);


?>