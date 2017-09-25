<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <title>NFL RISK</title>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script>		
<?php
	date_default_timezone_set('America/Chicago');
	$config = parse_ini_file('/var/www//nflriskconfig.ini');
	
	$conn = new mysqli($config["mysqlhost"],$config["mysqluser"],$config["mysqlpassword"],$config["mysqldbname"]);
	$res = $conn->query("select * from stad");
	$teams = array();
	while($r = $res->fetch_assoc()){
		$teams[] = $r;
	}
	echo "var teams = ".json_encode($teams).";\n";
	$res = $conn->query("select * from winslosses where win != '' order by week");
	$wl = array();
	while($r = $res->fetch_assoc()){
		$wl[]=$r;
	}
	echo "var wl = ".json_encode($wl).";\n";
?>
</script>
	<script src="index.js"></script>
	<link rel='stylesheet' type='text/css' href='index.css'>
  </head>
  <body>
	<div id='selectlabel'>Select Week:</div>
	<div id='selectdiv'>
<?php
	$res = $conn->query("select distinct week as wk from winslosses where win != ''");
	while($w = $res->fetch_assoc()){
			echo "<span class='weeksel' id='week-".$w["wk"]."'>".$w["wk"]."</span>";
	}
?>
	</div>
    <div id="map"></div>
	<div id='teamicons'></div>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD0sVVdxyD7HqGhEfPEqzTO84OkSClWjTg&&libraries=geometry&callback=initMap">
    </script>
  </body>
</html>