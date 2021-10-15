<?php

$value = urldecode(($_REQUEST['name']));

if (stripos(strtolower($value), 'googlebot') === FALSE) {
	file_put_contents('profiles/' . time() . '.txt', $value);
}

die('<h1>Tnx! That\'s All!</h1>');

?>