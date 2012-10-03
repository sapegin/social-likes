<?php

header('Content-type: application/zip');
header('Content-Disposition: attachment; filename="social-likes.zip"');

try {
	$content = base64_decode($_POST['content']);
	if (empty($content)) throw new Exception();
	echo $content;
}
catch (Exception $e) {
	header('HTTP/1.0 400 Bad request');
}

?>