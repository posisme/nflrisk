<?php
date_default_timezone_set('America/Chicago');
$config = parse_ini_file('/var/www//nflriskconfig.ini');
$conn = new mysqli($config["mysqlhost"],$config["mysqluser"],$config["mysqlpassword"],$config["mysqldbname"]);


	
if($_GET["mode"] == "addlatlng"){
	$res = $conn->query("update stad set lat = ".$_GET["lat"]." where team = '".$_GET["team"]."'");
	echo json_encode($res);
	$res = $conn->query("update stad set lng = ".$_GET["lng"]." where team = '".$_GET["team"]."'");
	echo json_encode($res);
	//echo json_encode($_GET);
}
else if($_GET["mode"] == "addpoly"){
	$res = $conn->query("update stad set poly = '".$_GET["poly"]."' where teamkey = '".$_GET["team"]."'");
	echo json_encode($res);
}
else if($_GET["mode"] == "updatescores"){
	$res = $conn->query("update winslosses set win = '".$_GET["winner"]."' where gameid = ".$_GET["gameid"]);
	echo json_encode($res);
}
?>