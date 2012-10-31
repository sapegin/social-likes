<?php

try {
	$content = base64_decode($_POST['content']);
	if (empty($content)) throw new Exception();
	header('Content-type: application/zip');
	header('Content-Disposition: attachment; filename="social-likes.zip"');
	echo $content;
}
catch (Exception $e) {
	header('HTTP/1.0 400 Bad request');
	echo 'Bad request.';
}

?>